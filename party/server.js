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
  }

  async onConnect(connection, ctx) {
    // Send current state to newly connected client
    const state = await this.party.storage.get("state");
    if (state) {
      connection.send(JSON.stringify({
        type: "sync",
        state: state
      }));
    }

    // Notify others that someone joined
    this.party.broadcast(JSON.stringify({
      type: "user_joined",
      connectionId: connection.id
    }), [connection.id]);
  }

  async onMessage(message, connection) {
    const data = JSON.parse(message);

    switch (data.type) {
      case "update_state":
        // Store the updated state
        await this.party.storage.put("state", data.state);

        // Broadcast to all other connections
        this.party.broadcast(JSON.stringify({
          type: "state_updated",
          state: data.state,
          updatedBy: connection.id
        }), [connection.id]);
        break;

      case "comparison_made":
        // Handle individual comparison updates for faster sync
        const currentState = await this.party.storage.get("state") || {};
        currentState.comparisons = data.comparisons;
        currentState.tiers = data.tiers;
        currentState.lowerBounds = data.lowerBounds;
        currentState.upperBounds = data.upperBounds;

        await this.party.storage.put("state", currentState);

        this.party.broadcast(JSON.stringify({
          type: "comparison_added",
          comparison: data.comparison,
          comparisons: data.comparisons,
          tiers: data.tiers,
          lowerBounds: data.lowerBounds,
          upperBounds: data.upperBounds,
          updatedBy: connection.id
        }), [connection.id]);
        break;

      case "tier_changed":
        // Handle tier assignment changes
        const state = await this.party.storage.get("state") || {};
        state.tiers = data.tiers;
        state.manualTiers = data.manualTiers;

        await this.party.storage.put("state", state);

        this.party.broadcast(JSON.stringify({
          type: "tier_updated",
          tiers: data.tiers,
          manualTiers: data.manualTiers,
          updatedBy: connection.id
        }), [connection.id]);
        break;

      case "request_sync":
        // Client requesting full state sync
        const fullState = await this.party.storage.get("state");
        connection.send(JSON.stringify({
          type: "sync",
          state: fullState
        }));
        break;
    }
  }

  onClose(connection) {
    // Notify others that someone left
    this.party.broadcast(JSON.stringify({
      type: "user_left",
      connectionId: connection.id
    }));
  }
}
