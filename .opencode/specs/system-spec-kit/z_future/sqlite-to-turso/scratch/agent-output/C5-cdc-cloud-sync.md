# C5: CDC & Cloud Sync

**Agent:** general-purpose | **Duration:** ~192s | **Tokens:** 56,247

## Key Findings

### CDC
- Enabled per-connection via `PRAGMA unstable_capture_data_changes_conn('full')`
- Schema: change_id, change_time, change_type (-1/0/1), table_name, id, before (BLOB), after (BLOB)
- Four modes: id, before, after, full (full = 3x disk writes per update)
- **Status: unstable/early preview** — API may change
- Binary BLOBs require JSON helper functions to decode
- Schema evolution BREAKS historical record decoding
- Cannot add custom metadata (session_id, reason, etc.)

### Cloud Sync
- Architecture: WAL-based replication, NOT CRDTs
- Logical push (mutations) / physical pull (WAL frames)
- Default: last-push-wins. Also: FAIL_ON_CONFLICT, DISCARD_LOCAL, REBASE_LOCAL, custom handlers
- Offline writes enabled but "no durability guarantees, data loss is possible"
- Read-your-writes guarantee on the replica that wrote

### Encryption
- Page-level AEAD encryption (AEGIS recommended, AES-GCM, ChaCha20-Poly1305)
- ~6% read overhead, ~14% write overhead with AEGIS-256
- BYOK — keys never stored on disk. Lose key = permanent data loss
- No key rotation, no encrypting existing databases

### MCP Server
- 9 generic CRUD tools vs our 23+ specialized tools
- Cannot replace domain-specific logic — only a raw SQL access layer
