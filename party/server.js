/**
 * PartyKit Server for Real-time Ranking Collaboration
 *
 * Syncs state between multiple users working on the same ranking session:
 * - Options list
 * - Tier assignments
 * - Comparisons made
 * - Bradley-Terry prices
 * - Bounds (lowerBounds, upperBounds)
 * - Participant data
 */

export default class RankingServer {
  constructor(party) {
    this.party = party;
    // Track participant info per connection
    this.connectionInfo = new Map(); // connectionId -> { participant, isAdmin }
  }

  async onConnect(connection, ctx) {
    // Note: We'll send state after the client identifies themselves
    // with their participant name, so we can send the right state

    // Notify others that someone joined
    this.party.broadcast(JSON.stringify({
      type: "user_joined",
      connectionId: connection.id
    }), [connection.id]);
  }

  async onMessage(message, connection) {
    const data = JSON.parse(message);
    console.log('[SERVER] Received message:', data.type, 'from', connection.id);

    switch (data.type) {
      case "identify":
        // Store participant info for this connection
        this.connectionInfo.set(connection.id, {
          participant: data.participant,
          isAdmin: data.isAdmin
        });
        console.log('[SERVER] Connection identified:', connection.id, data.participant, 'isAdmin:', data.isAdmin);

        // Send participant-specific state
        const participantStateKey = `state_${data.participant}`;
        const participantState = await this.party.storage.get(participantStateKey);
        if (participantState) {
          connection.send(JSON.stringify({
            type: "sync",
            state: participantState
          }));
        }
        break;

      case "update_state":
        // Store the updated state per participant
        const senderInfo = this.connectionInfo.get(connection.id);
        if (senderInfo && senderInfo.participant) {
          const stateKey = `state_${senderInfo.participant}`;
          await this.party.storage.put(stateKey, data.state);
        }

        // Broadcast to connections with same participant
        this.broadcastToParticipant(JSON.stringify({
          type: "state_updated",
          state: data.state,
          updatedBy: connection.id
        }), connection);
        break;

      case "comparison_made":
        // Handle individual comparison updates for faster sync
        const senderInfo2 = this.connectionInfo.get(connection.id);
        if (senderInfo2 && senderInfo2.participant) {
          const stateKey = `state_${senderInfo2.participant}`;
          const currentState = await this.party.storage.get(stateKey) || {};
          currentState.comparisons = data.comparisons;
          currentState.tiers = data.tiers;
          currentState.lowerBounds = data.lowerBounds;
          currentState.upperBounds = data.upperBounds;

          await this.party.storage.put(stateKey, currentState);
        }

        this.broadcastToParticipant(JSON.stringify({
          type: "comparison_added",
          comparison: data.comparison,
          comparisons: data.comparisons,
          tiers: data.tiers,
          lowerBounds: data.lowerBounds,
          upperBounds: data.upperBounds,
          updatedBy: connection.id
        }), connection);
        break;

      case "tier_changed":
        // Handle tier assignment changes
        const senderInfo3 = this.connectionInfo.get(connection.id);
        if (senderInfo3 && senderInfo3.participant) {
          const stateKey = `state_${senderInfo3.participant}`;
          const state = await this.party.storage.get(stateKey) || {};
          state.tiers = data.tiers;
          state.manualTiers = data.manualTiers;
          state.customMultipliers = data.customMultipliers;

          await this.party.storage.put(stateKey, state);
        }

        this.broadcastToParticipant(JSON.stringify({
          type: "tier_updated",
          tiers: data.tiers,
          manualTiers: data.manualTiers,
          customMultipliers: data.customMultipliers,
          updatedBy: connection.id
        }), connection);
        break;

      case "screen_changed":
        // Handle screen navigation changes
        console.log('[SERVER] Broadcasting screen_updated:', data.screenId, 'for', data.participant);
        this.broadcastToParticipant(JSON.stringify({
          type: "screen_updated",
          screenId: data.screenId,
          participant: data.participant,
          updatedBy: connection.id
        }), connection);
        console.log('[SERVER] Broadcast complete');
        break;

      case "comparison_drawn":
        // Handle comparison pair drawn - broadcast to others with same multiplier
        console.log('[SERVER] Broadcasting comparison_drawn:', data.idx1, 'vs', data.idx2);
        this.broadcastToParticipant(JSON.stringify({
          type: "comparison_drawn",
          idx1: data.idx1,
          idx2: data.idx2,
          multiplier: data.multiplier,
          multipliedIndex: data.multipliedIndex,
          updatedBy: connection.id
        }), connection);
        break;

      case "request_sync":
        // Client requesting full state sync
        const senderInfo4 = this.connectionInfo.get(connection.id);
        if (senderInfo4 && senderInfo4.participant) {
          const stateKey = `state_${senderInfo4.participant}`;
          const fullState = await this.party.storage.get(stateKey);
          if (fullState) {
            connection.send(JSON.stringify({
              type: "sync",
              state: fullState
            }));
          }
        }
        break;
    }
  }

  onClose(connection) {
    // Clean up connection info
    this.connectionInfo.delete(connection.id);

    // Notify others that someone left
    this.party.broadcast(JSON.stringify({
      type: "user_left",
      connectionId: connection.id
    }));
  }

  // Helper method to broadcast to connections with the same participant
  // Admin connections receive all broadcasts but their actions don't broadcast
  broadcastToParticipant(message, senderConnection, excludeSender = true) {
    const senderInfo = this.connectionInfo.get(senderConnection.id);

    // If sender is admin, don't broadcast (admin observes only)
    if (senderInfo && senderInfo.isAdmin) {
      console.log('[SERVER] Admin action - not broadcasting');
      return;
    }

    const senderParticipant = senderInfo?.participant;
    console.log('[SERVER] Broadcasting from participant:', senderParticipant);

    for (const conn of this.party.getConnections()) {
      // Skip sender if excludeSender is true
      if (excludeSender && conn.id === senderConnection.id) {
        continue;
      }

      const connInfo = this.connectionInfo.get(conn.id);

      // Send to admins (they observe everything)
      if (connInfo && connInfo.isAdmin) {
        console.log('[SERVER] Sending to admin connection:', conn.id);
        conn.send(message);
        continue;
      }

      // Send to connections with same participant name
      if (connInfo && connInfo.participant === senderParticipant) {
        console.log('[SERVER] Sending to same-participant connection:', conn.id);
        conn.send(message);
      }
    }
  }
}
