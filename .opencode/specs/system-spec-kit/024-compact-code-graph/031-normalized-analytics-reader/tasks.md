---
title: "Tasks: Normalized Analytics Reader [system-spec-kit/024-compact-code-graph/031-normalized-analytics-reader/tasks]"
description: "Task Format: T### [P0|P1|P2] Description (file path)"
trigger_phrases:
  - "analytics reader tasks"
  - "session analytics replay tasks"
  - "normalized analytics tasks"
importance_tier: "normal"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/031-normalized-analytics-reader"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["tasks.md"]
---
# Tasks: Normalized Analytics Reader

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P0|P1|P2] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Packet Alignment
- [x] T001 [P0] Confirm the producer metadata predecessor packet is complete and usable (`spec.md`, `plan.md`) [EVIDENCE: packet scope now explicitly depends on `026/002-continuity-memory-runtime/001-cache-warning-hooks` rather than recreating producer changes.]
- [x] T002 [P0] Narrow packet scope to a reader-owned replay model (`spec.md`, `plan.md`, `tasks.md`) [EVIDENCE: docs explicitly defer dashboards, startup consumers, and Stop-hook writer changes.]
- [x] T003 [P1] Reuse the existing replay fixture instead of introducing a second producer fixture (`tests/fixtures/hooks/session-stop-replay.jsonl`) [EVIDENCE: the packet reuses the existing fixture-backed transcript for all replay checks.]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase -->
## Phase 2: Implementation

### Phase A: Deterministic Replay Parsing
- [x] T004 [P0] Extend transcript replay parsing with absolute line numbers and byte offsets (`hooks/claude/claude-transcript.ts`) [EVIDENCE: `parseTranscriptTurns()` now counts prior lines before replay offsets and emits deterministic `lineNo`, `byteStart`, and `byteEnd` fields.]
- [x] T005 [P0] Keep transcript replay streaming-based instead of adding full-file eager parsing (same file) [EVIDENCE: the implementation still uses `createReadStream()` and incremental offsets for normal replay.]

### Phase B: Reader-Owned Normalized Analytics Store
- [x] T006 [P0] Create normalized analytics DB schema for sessions and turns (`lib/analytics/session-analytics-db.ts`) [EVIDENCE: `analytics_sessions` and `analytics_turns` now initialize in `speckit-session-analytics.db`.]
- [x] T007 [P0] Seed additive lookup tables for model pricing and normalized cache tiers (same file) [EVIDENCE: `model_pricing_versioned` and `cache_tier_normalized` are initialized with seed rows.]
- [x] T008 [P0] Implement ingest from `HookState` producer metadata plus transcript replay (same file) [EVIDENCE: `ingestSessionAnalytics()` requires `producerMetadata.transcript.path` and replays transcript turns into normalized rows.]
- [x] T009 [P0] Recompute session totals from normalized turns after replay (same file) [EVIDENCE: `recomputeSessionAggregates()` derives session totals from `analytics_turns` rather than copying hook-state snapshot totals.]
- [x] T010 [P1] Preserve the reader-only boundary by keeping `session-stop.ts`, `hook-state.ts`, `session-prime.ts`, and `.claude/settings.local.json` out of active write scope (read-only verification) [EVIDENCE: this packet's runtime diff is limited to `claude-transcript.ts`, `session-analytics-db.ts`, and the new test file.]

### Phase C: Replay Verification
- [x] T011 [P0] Add first-ingest schema and replay verification (`tests/session-analytics-db.vitest.ts`) [EVIDENCE: the test suite asserts schema creation, seed rows, and the first replay result.]
- [x] T012 [P0] Add unchanged-transcript idempotency verification (same file) [EVIDENCE: the second replay inserts `0` turns and preserves stable session totals.]
- [x] T013 [P0] Add growing-transcript replay verification (same file) [EVIDENCE: appending one transcript line inserts exactly one new turn and advances the replay offset.]
<!-- /ANCHOR:phase -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Phase Verification
- [x] T014 [P0] Run package typecheck for the analytics module and parser changes [EVIDENCE: `TMPDIR=$PWD/.tmp/tsc-tmp npm run typecheck` passed in `.opencode/skill/system-spec-kit/mcp_server`.]
- [x] T015 [P0] Run focused replay and analytics tests [EVIDENCE: `TMPDIR=$PWD/.tmp/vitest-tmp npx vitest run tests/session-analytics-db.vitest.ts tests/hook-session-stop-replay.vitest.ts tests/hook-stop-token-tracking.vitest.ts` passed.]
- [x] T016 [P0] Update `implementation-summary.md` after runtime verification completes [EVIDENCE: the implementation summary now reflects the delivered replay parser, analytics DB, and tests.]
- [x] T017 [P0] Run strict packet validation [EVIDENCE: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh ".opencode/specs/system-spec-kit/024-compact-code-graph/031-normalized-analytics-reader" --strict` passed.]
- [x] T018 [P1] Refresh packet metadata cache and description fields if needed (`description.json`) [EVIDENCE: packet description metadata now identifies `024-compact-code-graph/031-normalized-analytics-reader` correctly.]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 tasks marked `[x]` with evidence
- [x] No `[B]` blocked tasks remaining
- [x] Reader-owned boundary remains explicit across code and packet docs
- [x] Replay is verified for first-run, unchanged, and growing transcripts
- [x] Follow-on dashboard and startup consumers remain deferred honestly
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
