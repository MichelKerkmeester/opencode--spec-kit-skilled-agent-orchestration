---
title: "Verification Checklist: Normalized Analytics Reader [template:level_3/checklist.md]"
description: "Verification Date: 2026-04-08"
trigger_phrases:
  - "analytics reader verification"
  - "session analytics checklist"
  - "normalized analytics checklist"
importance_tier: "normal"
contextType: "planning"
---
# Verification Checklist: Normalized Analytics Reader

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] `spec.md` documents the reader-only packet boundary [EVIDENCE: the spec keeps Stop-hook writer changes, startup consumers, and dashboards out of scope.]
- [x] CHK-002 [P0] `plan.md` defines replay parser, analytics DB, and idempotent replay phases [EVIDENCE: the plan's implementation phases match the delivered runtime work.]
- [x] CHK-003 [P0] The producer metadata predecessor packet is called out explicitly [EVIDENCE: packet docs depend on `026/.../002-implement-cache-warning-hooks` rather than recreating producer logic.]
- [x] CHK-004 [P1] Follow-on dashboard and startup consumers remain deferred [EVIDENCE: docs name later reporting/startup packets without implying they shipped here.]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Transcript replay emits deterministic turn rows with absolute line numbers and byte offsets [EVIDENCE: `parseTranscriptTurns()` now emits replay-safe `lineNo`, `byteStart`, and `byteEnd` values.]
- [x] CHK-011 [P0] Analytics schema is reader-owned and separate from the Stop hook writer [EVIDENCE: `session-analytics-db.ts` initializes a dedicated `speckit-session-analytics.db`.]
- [x] CHK-012 [P0] Session aggregates are recomputed from normalized turns [EVIDENCE: `recomputeSessionAggregates()` derives totals from `analytics_turns` after every ingest.]
- [x] CHK-013 [P1] Pricing and cache-tier lookup data are seeded for later consumers [EVIDENCE: `model_pricing_versioned` and `cache_tier_normalized` initialize with seed rows.]
- [x] CHK-014 [P0] Active runtime scope excludes `session-stop.ts`, `hook-state.ts`, `session-prime.ts`, and `.claude/settings.local.json` [EVIDENCE: this packet's runtime diff is limited to `claude-transcript.ts`, `session-analytics-db.ts`, and the analytics test file.]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] First replay creates normalized session and turn rows [EVIDENCE: `tests/session-analytics-db.vitest.ts` verifies the first ingest creates 1 session row and 2 turn rows.]
- [x] CHK-021 [P0] Replaying the same transcript twice inserts zero duplicate turns [EVIDENCE: the second ingest reports `insertedTurns = 0` and preserves stable totals.]
- [x] CHK-022 [P0] Growing-transcript replay appends only the new turn [EVIDENCE: the appended transcript test inserts exactly 1 new turn and advances `last_replay_offset`.]
- [x] CHK-023 [P0] Focused replay suites still pass alongside the new analytics suite [EVIDENCE: `tests/session-analytics-db.vitest.ts`, `tests/hook-session-stop-replay.vitest.ts`, and `tests/hook-stop-token-tracking.vitest.ts` passed together.]
- [x] CHK-024 [P0] Package typecheck passes after the parser and analytics changes [EVIDENCE: `TMPDIR=$PWD/.tmp/tsc-tmp npm run typecheck` passed.]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No new network calls or external services are introduced [EVIDENCE: the analytics reader is local-only TypeScript plus SQLite.]
- [x] CHK-031 [P0] The analytics DB path stays inside the configured data directory or explicit test directory [EVIDENCE: `initSessionAnalyticsDb()` resolves under `DATABASE_DIR` or the supplied test path.]
- [x] CHK-032 [P1] Replay ingest fails clearly when required transcript metadata is missing [EVIDENCE: `ingestSessionAnalytics()` throws if `producerMetadata.transcript.path` is absent.]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md` are synchronized [EVIDENCE: the packet docs were rewritten together around the same reader-only boundary.]
- [x] CHK-041 [P0] The implementation summary matches the actual runtime scope [EVIDENCE: the summary describes the parser, reader DB, and replay tests only.]
- [x] CHK-042 [P1] `description.json` reflects the real packet identity [EVIDENCE: packet metadata now names `system-spec-kit/024-compact-code-graph/031-normalized-analytics-reader`.]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No new temp or scratch artifacts were left in the packet root [EVIDENCE: only the expected packet docs and metadata remain in the folder.]
- [x] CHK-051 [P1] The existing replay fixture was reused instead of duplicating packet-local fixtures [EVIDENCE: the test suite points to `tests/fixtures/hooks/session-stop-replay.jsonl`.]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | [x]/14 |
| P1 Items | 8 | [x]/8 |
| P2 Items | 0 | [x]/0 |

**Verification Date**: 2026-04-08
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Decision record explains why analytics remain reader-owned [EVIDENCE: ADR-001 keeps the writer boundary in the predecessor packet.]
- [x] CHK-101 [P0] Decision record documents deterministic replay identity as the core architecture choice [EVIDENCE: ADR-001 chooses `byte_start` keyed turn replay over heuristic joins.]
- [x] CHK-102 [P1] Alternatives include raw JSON scanning and writer-side analytics expansion [EVIDENCE: the decision record compares both rejected options directly.]
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback procedure is documented and limited to parser, reader DB, and tests [EVIDENCE: `plan.md` rollback section keeps the producer predecessor intact.]
- [x] CHK-121 [P0] Packet does not require a feature flag or runtime hook registration change [EVIDENCE: `.claude/settings.local.json` remains out of scope.]
- [x] CHK-122 [P1] Follow-on reporting and startup packets are named without being claimed as done [EVIDENCE: plan and spec both defer those lanes explicitly.]
<!-- /ANCHOR:deploy-ready -->
