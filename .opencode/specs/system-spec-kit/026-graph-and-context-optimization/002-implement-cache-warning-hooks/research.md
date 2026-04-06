---
title: "Research Pointer: Cache-Warning Hook System"
description: "Local pointer to upstream Phase 001 research that drives this implementation. Findings F4-F8, F19-F20, F22, F24 are the source of authority for spec.md and plan.md."
trigger_phrases:
  - "cache warning research"
  - "F19 prerequisite research"
  - "phase 001 findings"
importance_tier: "normal"
contextType: "research"
---

# Research Pointer: Cache-Warning Hook System

<!-- SPECKIT_LEVEL: 3 -->

## 1. Authoritative Source

The full research that drives this implementation lives in **Phase 001 of the parent spec packet**:

- **Path:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/research/research.md`
- **Length:** ~580 lines, 12 sections, 24 deduplicated findings (F1-F24)
- **Iterations:** 13 deep-research cycles (cli-codex gpt-5.4 high)
- **Status:** Convergence-complete; source discovery exhausted

## 2. Findings Driving This Spec

| Finding | Title | Phase Mapped | Recommendation |
|---------|-------|--------------|----------------|
| **F4** | Stop hook idle-timestamp capture | Phase C | prototype later |
| **F5** | UserPromptSubmit warning hook | Phase F (highest risk) | prototype later |
| **F6** | SessionStart resume-cost estimate | Phase E | prototype later |
| **F7** | Shared hook-state JSON as cache-warning seam | Phases A + D | prototype later |
| **F8** | Keep `compact-inject.js` as mitigation, NOT warning owner | Hard scope rule | REJECTED as warning owner |
| **F19** | Idle-timestamp contract is a prerequisite | Phase A (blocker) | prototype later |
| **F20** | Shared hook replay harness is the missing scaffold | Phase B (blocker) | prototype later |
| **F22** | Remedy bundle is not net-costed | Risk framing R-007 | adopt now (caution) |
| **F24** | Hook replay must isolate side effects | Phase B isolation rule | adopt now |

## 3. Findings Explicitly Out of Scope

| Finding | Why deferred | Owner |
|---------|--------------|-------|
| F1 (`ENABLE_TOOL_SEARCH`) | Already in `.claude/settings.local.json` | none |
| F11 (rereads cache-amplified) | Documentation-only, lives in CLAUDE.md | docs phase |
| F12 (edit-retry chains) | Documentation-only, lives in CLAUDE.md | docs phase |
| F14 (transcript auditor) | Phase 005-claudest owns implementation | phase 005 |
| F15 (skill disable-review queue) | Requires phase 005 telemetry first | phase 005 |
| F16 (Claude JSONL parser) | Reject as core infra; phase 005 may build guarded adapter | phase 005 |
| F17 (cross-agent rollout) | Phase 005 concern (shared schema/dashboard layer) | phase 005 |
| F18 (current telemetry insufficient) | Validation constraint, not implementation work | n/a |
| F23 (skill baseline window) | Out of hook scope | phase 005 |

## 4. Discrepancies Preserved (NOT smoothed)

The upstream research preserves two unresolved source discrepancies that bound how confidently this spec can quote any number from the post:

1. **Session count:** "926 sessions" (header) vs "858 sessions" (body)
2. **Turns denominator:** "18,903 turns" (headline) vs "11,357 turns" (cache-expiry calculation)

Both must remain visible in any downstream document. This spec frames cache-cliff prevalence qualitatively only.

## 5. Open Questions Carried Forward

| ID | Question | Phase Impact |
|----|----------|--------------|
| Q9 | What is `/clear` + plugin-memory remedy net of overhead? [F22] | Risk R-007; do not claim savings |
| Q11 | Which artifacts must the replay harness stub to prevent contamination? [F24] | Phase B design requirement |

## 6. Boundary with Phase 005-claudest

This phase (002) owns the **decision and prototype implementation layer** for the 6 phases A-F. Phase 005-claudest owns the **observability layer** (transcript auditor, SQLite normalization, dashboard, JSONL guarded adapter). These layers communicate via the shared `hook-state.json` seam defined in Phase A.

For the full evidence chain, all source quotes, and the cross-iteration audit trail, read the upstream research file path in §1 above.
