---
title: "Implementation [system-spec-kit/024-compact-code-graph/031-normalized-analytics-reader/implementation-summary]"
description: "Reader-owned replay model for normalized session analytics, built on top of the completed Stop-hook producer metadata seam."
trigger_phrases:
  - "analytics reader implementation summary"
  - "normalized analytics summary"
  - "session analytics replay summary"
importance_tier: "normal"
contextType: "general"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/031-normalized-analytics-reader"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["implementation-summary.md"]
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/global/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 031-normalized-analytics-reader |
| **Completed** | 2026-04-08 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Packet `024/031` turns the completed Stop-hook producer seam into a real replay model. You can now replay session-end metadata into a dedicated analytics DB, inspect normalized session and turn rows, and trust that replay stays stable when the transcript is unchanged or grows later.

### Deterministic Transcript-Turn Replay

`parseTranscriptTurns()` now emits turn rows with absolute line numbers plus `byteStart` and `byteEnd` offsets. That gives the reader a deterministic replay identity instead of relying on the session-level `lastTranscriptOffset` alone.

### Reader-Owned Normalized Analytics DB

`session-analytics-db.ts` adds a dedicated `speckit-session-analytics.db` with `analytics_sessions` and `analytics_turns` tables. Ingest starts from `HookState` producer metadata, replays the transcript JSONL, stores normalized turn rows, and then recomputes session totals from those stored turns. The module also seeds `model_pricing_versioned` and `cache_tier_normalized` so later reporting packets inherit a stable contract.

### Replay and Growth Verification

The new analytics test suite proves three things: the first replay creates the expected normalized rows, replaying the same transcript twice inserts zero duplicate turns, and replaying after the transcript grows inserts only the appended turn while advancing the replay offset. That makes this packet a safe handoff point for later reporting work.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The packet shipped in three passes. First, the transcript parser was tightened so replay emitted absolute line numbers and deterministic byte offsets. Second, the normalized analytics DB and ingest helpers were added as a separate reader-owned module. Third, focused replay tests and packet docs were finished together so the runtime boundary and the packet wording stayed aligned.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep analytics in a separate reader DB | The predecessor packet already handled producer metadata, so this packet needed to consume that seam, not reopen the Stop hook writer. |
| Key turns by `claude_session_id + transcript_path + byte_start` | Byte offsets are deterministic across unchanged and growing transcript replay, which makes idempotency testable. |
| Seed pricing and cache-tier lookup tables now | Later reporting packets need stable contracts, but this packet still stays short of any dashboard or endpoint work. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `TMPDIR=$PWD/.tmp/tsc-tmp npm run typecheck` | PASS |
| `TMPDIR=$PWD/.tmp/vitest-tmp npx vitest run tests/session-analytics-db.vitest.ts tests/hook-session-stop-replay.vitest.ts tests/hook-stop-token-tracking.vitest.ts` | PASS |
| `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh ".opencode/specs/system-spec-kit/024-compact-code-graph/031-normalized-analytics-reader" --strict` | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No dashboard or reporting endpoint yet.** This packet creates the normalized replay model only. A later reporting packet still needs to expose trends, KPIs, or spend summaries.
2. **No startup consumer yet.** `session_bootstrap()` and existing resume flows stay authoritative. This packet does not change SessionStart behavior.
3. **Pricing remains family-level.** Seeded pricing rows intentionally mirror the current `estimateCost()` family contract rather than a finer-grained model-version catalog.
<!-- /ANCHOR:limitations -->
