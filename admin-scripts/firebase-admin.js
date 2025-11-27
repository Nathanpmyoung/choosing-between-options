// Firebase Admin SDK helper
const admin = require('firebase-admin');

const serviceAccount = {
  type: "service_account",
  project_id: "rank-by-pairs",
  private_key_id: "25efefe0d698a456f6d4a4ce8dd8fb47f7d688b8",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC8b/Pj02maH5In\nyhfEMiS1MsRDZDoL47ddZCcH1tbSpbDZX4Vm0qOz4jI/iiJyymOHKhrtR5Ll91dK\n8aIToBamfPWsvP7cE9RPDLovHYK2hxotoyYpKMyXRwwsZwO9RCcxizXKsm/ZQy0c\nC+2NIuddp0g2/P8RNTsez0RHNkioDWp0hoHwoU+gvQDPvt9gZmK/14hEnB/XRl8P\n47wg04J3QHhibThPKIKc5udIM2M/ydaB5jY0KVL96DmjwWLlxrV+fYujuKt0nOx2\nl+DH4MmNhT8mdQ7qeOkM/Cw+yAshxB3Emc47oEk0Y7nGrvRuQbNK1oXhXho/KC1a\nfYl+BFfFAgMBAAECggEAPiYya068AqAtBUCLLCNZpgWTY6K33loBjSTOFrDN83XA\naUEu72XDpj2RUxGNIQ0NXHQPo3i6w2wbd1VQnmZrcge+w3UmHZHQsS3Cbm2uQeM3\nSBwKJwMUz0QYiMCFJDRJNPb0C+FkMGUOiLSKacU8R9A3aiNxQMysrhGwNEh8GCib\ntI+81DOsiNgXL5INuaBTXBscfm1KSWg27R0Bt/sSqGHUWMc6RX7UOpsmmjFT9Pax\ncBsxVGotWWR1hO0hT1CDtMucPBVK6Ph2lKDIIQo9LwhnisWay5I67U74dmN570HO\nKErgJXvOwIJb77/XcDzSGOW/edaeGNnV4m2tl4hrtQKBgQDdL7GxPiztc/Uu6h8+\nqRw9sEoVW7gCUcdZOo8HyPUEatMCpByZAJzTcOMIHmcJ+sPev1VQlzZc3YFLQGNY\n6cD9mJHCKjT5te0zRo+j7vzW7Qk6i7oSB/KHwV4lzOcexBOKdilOIvlqTjEHQ8q8\nKR6zWgKJF+EI8eLHKWRAy1iYfwKBgQDaGLJbhFdnv0RX7Gg4RVRjwXxQ3WGyWiF3\nTaCcvTGdf/TV9zd9UaK5L73KX6bry6dqVnAk5fJ6iBVdfRiJrVvqgJVN8wMPjhx9\nHZxtkvMOvY23p38BRtobzWy2BbksGYVaZYi9NIU7ZOlkTnlmYFmthjatDH+pf62p\nacCECDGNuwKBgQCR4xVWjGXhsGv1J6K4F55y6cXTVI2HqhzMM52HSvqgkTzgLxJV\nsFu/8mMsRbE8mdN7JcPFxharJcZTtgJQ8MzD90+cO255jY8IFPBE9ip6MBm4LdTq\nc6d59wZ79Cw01Kr21nzj9pl/jlc0LXiYpp6DOUkW11MsLS6goiJnwjeLTQKBgARf\nbmQLWT1JRnOE1+oY6cI+ROHSLn1G9VjRA6Fg4bfIsv3/QOuQUXTpEiMWm+Aqaybk\nqMb0nVH7nIINWgqYoTkobtXrQ2pybPvNNi+0PI9VGZxPDWrXItRf4AgeQUIzGMth\nMcapYOp58XwDXsfAssuZ30rE72JUnwTAjA2ZpHS1AoGAE34a4IjgdSJWsvWCep4B\nC0oCCJM4tmnq7EJfMLtapEveMuqQbTFDTturWNBKglWsJflOEB75AkdrMdGfYFAo\nMkG0o5EbriMrMt5QZxmd1btTbkgjvNuVe70LkPcYoIFlReRSbaREISLAHc8JeM60\nQRlJVAupvTzrbhlvH4y699k=\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-fbsvc@rank-by-pairs.iam.gserviceaccount.com",
  client_id: "117706695232699557317",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40rank-by-pairs.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = { admin, db };
