# Research Iteration 004: Final Synthesis and Recommendation

## Focus

Turn the comparison into a concrete packet-024 recommendation and a broader memory-system shortlist.

## Findings

### Packet 024 Recommendation

Build a **thin OpenCode adapter plugin** that copies LCM's insertion points, but not its whole storage/search backend:

1. `event` hook:
   - capture lightweight OpenCode session metadata needed for routing and lineage
   - optionally cache a tiny compaction digest
2. `experimental.chat.system.transform`:
   - inject a short startup digest derived from our existing session snapshot / startup-instructions model
3. `experimental.chat.messages.transform`:
   - inject two compact synthetic blocks:
     - `retrieved-context` from Spec Kit Memory / working-memory / trigger logic
     - `graph-context` from compact code graph plus CocoIndex bridge
4. `experimental.session.compacting`:
   - inject a packet-024 resume note with spec folder, graph freshness, recent files, and next-step guidance

This keeps our current stores as the source of truth and uses the plugin only as an OpenCode transport shell. [SOURCE: `external/opencode-lcm-master/src/index.ts:14-220`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:665-712`] [SOURCE: `decision-record.md:39-99`]

### Broader Memory-System Improvements Worth Porting

1. **Doctor-style repair tooling**
   - Our memory stack would benefit from a compact integrity report + optional repair path modeled after `lcm_doctor`, especially for index drift and orphan cleanup. [SOURCE: `external/opencode-lcm-master/src/store.ts:1369-1605`]
2. **Deduplicated blob storage for oversized payloads**
   - `artifact_blobs` is a strong model for storing repeated large tool/file payloads once while keeping searchable previews in primary rows. [SOURCE: `external/opencode-lcm-master/src/store.ts:897-920`]
3. **Pre-index privacy compilation**
   - The plugin's compiled path/tool/redaction filters are small but production-friendly and should be considered for archival surfaces that may hold sensitive raw tool output. [SOURCE: `external/opencode-lcm-master/src/privacy.ts:3-122`]
4. **Portable snapshots**
   - Snapshot export/import is a useful complement to checkpoints because it supports workspace transfer and safe merge modes rather than only local rollback. [SOURCE: `external/opencode-lcm-master/README.md:71-78`] [SOURCE: `external/opencode-lcm-master/src/index.ts:19-220`]
5. **Expandable summary DAGs**
   - Summary roots plus targeted expansion is a useful pattern for very large session archives or research archives where one paragraph is too small and full raw replay is too large. [SOURCE: `external/opencode-lcm-master/src/store.ts:2796-2857`] [SOURCE: `external/opencode-lcm-master/src/store.ts:3580-3665`]

### What Not To Port

- Do not create a second parallel memory engine for all runtimes.
- Do not collapse structural graph storage into a session archive store.
- Do not replace packet 024's clean-room graph/CocoIndex split with a transcript-first archive design.

## Convergence

The last iteration only refined prioritization and packaging; it did not uncover a new architectural branch. Convergence threshold reached.
