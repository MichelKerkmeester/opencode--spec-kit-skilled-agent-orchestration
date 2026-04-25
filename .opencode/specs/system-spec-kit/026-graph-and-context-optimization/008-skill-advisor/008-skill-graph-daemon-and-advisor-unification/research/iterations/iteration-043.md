# Iteration 043 — Follow-up Track E: E3 — SQLite WAL contention ceiling

## Question
SQLite WAL contention ceiling — concurrent session threshold before SQLITE_BUSY becomes hot path.

## Evidence Collected
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/027-skill-graph-daemon-and-advisor-unification-pt-01/next-research-paths.md:31-34,98-104` → Track E explicitly asks whether the single-SQLite-commit model hits WAL contention before high concurrent-session counts, and E3 is the named blocker question.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/027-skill-graph-daemon-and-advisor-unification-pt-01/research.md:122-123,133-135` → `027/001` already depends on “scan lease or writer coordination,” and R2 identifies SQLite writer contention plus premature freshness publication as a primary implementation risk.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/027-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-004.md:44-50` → A4 already adopted one SQLite graph transaction as the consistency boundary and deferred WAL/`SQLITE_BUSY` behavior to later failure-mode work.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/027-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-008.md:13-17,46-53` → A8's evidence and synthesis record that WAL allows concurrent readers but only one writer at a time, checkpoints can be delayed by active readers, and Phase 027 should add explicit writer coordination rather than rely on WAL alone.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:181-190` → The live skill-graph database uses `better-sqlite3` and enables `journal_mode = WAL` during init, so WAL behavior applies to the production artifact rather than a hypothetical future design.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:448-463,520-586` → `indexSkillMetadata()` parses every discovered `graph-metadata.json` file, then performs delete/upsert/edge-refresh work inside one `database.transaction()`, making each scan a single writer transaction against the shared WAL file.
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1477-1490,1510-1538,1558-1561` → The daemon today serializes scans only with process-local booleans and one queued rescan, while the watcher is started per process; there is no cross-runtime lease or shared writer election.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts:23-47` → The public `skill_graph_scan` handler directly invokes `indexSkillMetadata()` and returns the result/error; it does not coordinate with other runtimes before starting a write-capable scan.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/freshness.ts:136-188,223-263` and `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:360-380` → Prompt-time advisor freshness is derived from file probes plus artifact mtimes and returns non-live results early; the prompt path does not need to become a writer just to classify freshness.
- `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:385-520` → The repo already has a workspace-safe coordination primitive for memory indexing: an atomic SQLite lease with cooldown, stale-lease expiry, and transactional completion that prevents overlapping scans.

## Analysis
The strongest finding is that E3's “ceiling” is **not primarily a raw session-count threshold**. In the current architecture, writes happen when a startup scan, watcher-triggered rebuild, or explicit `skill_graph_scan` runs; prompt-time advisor freshness checks are read-only file/artifact probes and fail open when the graph is stale or unavailable. That means 50, 100, or 200 simultaneous sessions do not automatically translate into 50, 100, or 200 contending WAL writers. `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:181-190,448-463,520-586`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/freshness.ts:136-188,223-263`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:360-380`

The real contention boundary appears as soon as **more than one runtime can initiate a write-capable scan against the same workspace**. The live implementation uses WAL and one `better-sqlite3` transaction per scan, but its scan serialization is only process-local and the public scan tool has no lease. Prior r01 research already captured the corresponding SQLite behavior: WAL permits concurrent readers, yet only one writer can hold the WAL at a time, and long-lived readers can slow checkpoint progress. In practice, that means the hot path turns into `SQLITE_BUSY` recovery at **2 concurrent writers**, not at some large session number. `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1477-1490,1510-1538,1558-1561`, `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts:23-47`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/027-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-008.md:13-17,46-53`

That shifts the design answer from “how many sessions can WAL survive?” to “how do we guarantee only one writer-capable owner per workspace?” The repo already solved this pattern for memory indexing with an atomic SQLite lease plus cooldown and stale-lease expiry. Reusing that same coordination model for skill-graph writes is the adopt-now answer: let one lease holder run watcher/startup/manual scans, keep the other runtimes read-only, and postpone any background-checkpoint tuning until real post-lease measurements show WAL growth or commit spikes. This directly matches the roadmap and risk register, which already expected writer coordination rather than blind reliance on WAL throughput. `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:385-520`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/027-skill-graph-daemon-and-advisor-unification-pt-01/research.md:122-123,133-135`

## Verdict
- **Call:** adopt now
- **Confidence:** high
- **Rationale:** Treat the practical WAL contention ceiling as “one active writer per workspace”; once a second runtime can write, `SQLITE_BUSY` is already on the hot path. Adopt a workspace-scoped scan lease now rather than tuning for large concurrent-session counts that mostly remain read-only.

## Dependencies
E2, A4, A8, D5

## Open follow-ups
- Measure post-implementation commit latency and WAL file growth with the lease in place to decide whether `027/001` also needs explicit checkpoint telemetry or background checkpointing.
- Confirm whether future prompt-time graph traversals keep read transactions short enough that checkpoint starvation remains theoretical rather than a practical issue.
- If manual `skill_graph_scan` calls remain operator-facing, define whether non-lease holders fail fast, queue behind the leader, or surface a cooldown-style wait response.

## Metrics
- newInfoRatio: 0.63
- dimensions_advanced: [E]
