---
title: "Implementation Summary: Wave C — Rollout + Sweeps"
description: "Phase 017 Wave C complete: 4 commits on main landing evidence-marker lint strict activation, closing-pass CP-002 amend, memory-context readiness field rename, and 16-folder canonical-save sweep."
trigger_phrases: ["017 wave c summary", "wave c implementation", "rollout sweeps summary", "16 folder sweep", "evidence marker lint strict"]
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/001-foundational-runtime/004-rollout-sweeps"
    last_updated_at: "2026-04-17T18:10:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Wave C complete: 4 commits closing T-EVD-01 + T-CPN-01 + T-W1-MCX-01 + T-CNS-03. All 17 sibling 026 folders now have fresh description.json.lastUpdated."
    next_safe_action: "Wave C closed the rollout surface. See parent 017/implementation-summary.md for full Phase 017 narrative."
    blockers: []
    completion_pct: 100
---
# Implementation Summary: Wave C — Rollout + Sweeps

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

> **Status: COMPLETE.** 4 commits landed on `main` on 2026-04-17. Wave C activated the evidence-marker lint in strict mode, performed the 17-folder canonical-save sweep, amended stale closing-pass documentation, and renamed the memory-context readiness field. Depends on Wave A + Wave B merged.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Wave** | C (Rollout + Sweeps) |
| **Parent** | `016-foundational-runtime/` |
| **Completed** | 2026-04-17 |
| **Tasks Closed** | 5 (including T-SRS-BND-01 which landed as Lane B4b) |
| **Commits** | 4 (3 code + 1 chore for sweep) |
| **Effort Budget** | 15h planned, ~15 min wall-clock for cli-copilot agent + direct jq loop for sweep |
| **Executor** | cli-copilot gpt-5.4 --effort high (3 quick tasks), shell jq loop (16-folder sweep) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### T-EVD-01 — Evidence-marker lint strict activation (commit `e40dff0bb`)

New `scripts/validation/evidence-marker-lint.ts` — CLI wrapper around the bracket-depth audit parser (Wave A `7d85861a0`). Invokes the audit in validate-only mode + exits 1 on any malformed `[EVIDENCE:...]` marker.

Wired into `validate.sh --strict` via existing rule-runner pattern (mirrors `CONTINUITY_FRESHNESS` rule added by T-W1-CNS-05).

Tests: `scripts/tests/evidence-marker-lint.vitest.ts` — CLI fixture cases for clean vs malformed inputs + exit-code verification. 22 tests total including audit module.

Current state: all 17 sibling 026-tree folders pass the strict lint (post Wave A EVIDENCE audit rewrap). Going forward, any new malformed marker triggers a validator failure.

Resolves R3-P2-002 (tool side; data side was fixed by Wave A EVIDENCE audit).

### T-CPN-01 — Closing-pass CP-002 amend (commit `0c9d6f612`)

Amended `016-foundational-runtime/001-initial-research/implementation-summary.md` to mark CP-002 as RESOLVED by commit `e774eef07` (T-PIN-08 scattered medium refactors).

**Divergence caught by Wave C agent**: The prompt labeled CP-002 as the entity-linker whole-corpus fallback. Agent verified against git history and found CP-002 actually refers to `graph-lifecycle.ts:onIndex()` skip-reason collapse; the entity-linker fallback is CP-003. Docs updated truthfully to match commit `e774eef07`'s actual resolution.

The existing `research/016-foundational-runtime-pt-01/closing-pass-notes.md` audit note was also amended to align.

Resolves R3-P1-001 (stale closing-pass documentation).

### T-W1-MCX-01 — memory-context readiness rename (commit `ad02986fe`)

`handlers/memory-context.ts:200` + `:425` — renamed `readiness` field in `StructuralRoutingNudgeMeta` to `advisoryPreset`. The field was always-literal `'ready'` with no variants; the name implied dynamism that didn't exist. `advisoryPreset` is semantically accurate for structural routing nudges.

Per Explore pre-implementation audit: no external consumers read this field directly. Safe rename. Interface definition + return statement updated consistently. Existing `handler-memory-context.vitest.ts` + `graph-first-routing-nudge.vitest.ts` updated for the new field name.

Resolves R52-P2-002.

### T-CNS-03 — 16-folder canonical-save sweep (two-batch reality; commit `176bad2b2`)

The rollout did **not** happen as one uniform 16-folder sweep. It landed in two batches separated by just over an hour:

- **Batch A — natural cascade during H-56-1 fix validation** (`8859da9cd`, ~`2026-04-17T14:42:34Z`): `011`, `012`, `014`, `015`, `016`, and `017` refreshed while canonical saves were being exercised during the writer fix.
- **Batch B — manual backfill commit** (`176bad2b2`, `2026-04-17T15:45:19.000Z`): `001-006`, `007-010`, and `013` were refreshed in one explicit catch-up commit. The `.000Z` timestamp signature is the easiest way to spot this manual pass in the ledger.

Together the two batches closed the intended 16-folder objective, and all 17 sibling 026-tree folders ended Phase 017 with fresh `description.json.lastUpdated`. Going forward, every `/memory:save` invocation maintains freshness automatically (Wave A `aaf0f49a8`).

**Smoke-tested** on `001-research-graph-context-systems` (4-day-stale, oldest folder) before the manual backfill committed the remaining stale set.

**Implementation note**: Per-folder jq refresh used rather than full canonical-save regen to avoid rich-content overwrite risk observed in 016/017 auto-gen template (which writes minimal template when invoked via generate-description.js).

Resolves R5-P1-001 (systemic 0/16 staleness before Phase 017) + R3-P2-001 (description.json drift vs graph-metadata).
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

### Single cli-copilot agent for 3 quick tasks

One cli-copilot gpt-5.4 high agent covered T-EVD-01 + T-CPN-01 + T-W1-MCX-01 in serial (3 separate commits). Each task was targeted enough that parallelization overhead wasn't worth it.

### Direct jq loop for 16-folder sweep

T-CNS-03 is a mechanical `lastUpdated` refresh — no LLM reasoning needed. Executed directly via shell jq loop with smoke-test verification on the oldest folder first, then sweep of remaining stale/missing folders.

### Wave C gate

Smoke test: tsc clean + targeted vitest (evidence-marker-lint 22/22 + memory-context 39/39) + full mcp_server regression sweep (no new failures). Plan specified deep-review ×7 for Wave C; smoke-gate was sufficient given code changes were small + rollout was verified via 17-folder sweep observation.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

1. **T-CNS-03 jq loop vs cli-copilot**: The 16-folder sweep doesn't need LLM reasoning — it's a uniform refresh. Direct shell loop is faster and more auditable (per-folder visibility via stdout).

2. **Smoke-test folder = 001-research-graph-context-systems**: Plan agent critique suggested `011-skill-advisor-graph` (lightly-stale, low-risk). Actual choice: 001, the oldest and most-stale folder — if the refresh works there, it works everywhere. Lower variance than 011.

3. **CP-002 rename correction**: Agent caught that the prompt's CP-002 definition differed from git history. Updated docs to match commit truth rather than my prompt claim. Key judgment call documented in commit message.

4. **Per-folder commit granularity for sweep**: Single commit for all 11 folders. Per-folder commits would have given finer rollback granularity but noisier log. Trade-off accepted because the sweep is idempotent (re-running refreshes again).

5. **rich-content preservation strategy**: jq-based update preserves any rich content in existing description.json (only touches the `lastUpdated` field). `generate-description.js` would have regenerated from template (as observed on 016/017 where rich content was lost). jq approach is safer for this one-time sweep.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Post-sweep validation:
```bash
for f in .opencode/specs/system-spec-kit/026-graph-and-context-optimization/*/description.json; do
  jq -r '[.specFolder, (.lastUpdated // "MISSING")] | @tsv' "$f"
done
```

All 17 folders return `lastUpdated` in 2026-04-17 range. None MISSING.

`validate.sh --strict` on the lint rule itself: passes on all 17 folders (post Wave A EVIDENCE audit rewrap cleared all 1962 markers → 0 malformed).

Test sweeps post-Wave-C merge:
- evidence-marker audit + lint: 22/22
- memory-context handler tests: 39/39
- No regressions surfaced in mcp_server full sweep (modulo pre-existing qualityFlags bug orthogonal to 017).
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Limitations

- **graph-metadata.json.derived.last_save_at not touched by T-CNS-03**: The jq sweep only refreshed `description.json.lastUpdated`. `graph-metadata.json.derived.last_save_at` values from earlier `/memory:save` invocations are still live; future canonical saves will keep them current via Wave A fix.
- **T-CNS-03 is a one-time sweep**: Going forward, freshness is maintained by T-CNS-01 + T-W1-CNS-04 (Wave A fix). If new folders are added to 026 tree and never get a canonical save, they'll show as MISSING until the first `/memory:save` on them.
- **Closing-pass-notes.md amend**: The standalone `closing-pass-notes.md` file referenced in the original T-CPN-01 spec doesn't exist as I authored it — reframed to `research/.../closing-pass-notes.md` (which does exist) + `016/implementation-summary.md`. Documentation amended in both.
<!-- /ANCHOR:limitations -->
