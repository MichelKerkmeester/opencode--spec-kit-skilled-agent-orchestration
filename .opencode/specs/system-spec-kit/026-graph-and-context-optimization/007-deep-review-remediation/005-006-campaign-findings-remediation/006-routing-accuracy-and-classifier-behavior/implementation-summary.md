---
title: "Implementation Summary: Routing Accuracy and Classifier Behavior Remediation"
description: "Completed P0/P1 remediation for Tier 3 routing gates, cache partitioning, prompt vocabulary, continuity fixtures, prompt leakage gates, and static telemetry separation."
trigger_phrases:
  - "routing accuracy remediation complete"
  - "tier 3 routing gate remediation"
  - "classifier behavior remediation"
importance_tier: "high"
contextType: "implementation-summary"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/005-006-campaign-findings-remediation/006-routing-accuracy-and-classifier-behavior"
    last_updated_at: "2026-04-21T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Completed P0/P1 routing accuracy and classifier behavior remediation"
    next_safe_action: "Orchestrator reviews, stages, commits, and handles remaining P2 batch"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/content-router-cache.vitest.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/k-value-optimization.vitest.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/promotion/promotion-gates.vitest.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/smart-router-measurement.vitest.ts"
    session_dedup:
      fingerprint: "sha256:006-routing-accuracy-and-classifier-behavior-remediation"
      session_id: "codex-2026-04-21-routing-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "P0 and P1 findings were remediated in scope; P2 findings are deferred for a later low-risk batch."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-routing-accuracy-and-classifier-behavior |
| **Completed** | 2026-04-21 |
| **Level** | 3 |
| **Status** | complete |
| **Proposed Commit Message** | `fix(spec-kit): remediate routing classifier P0/P1 findings` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The P0/P1 routing remediation is complete. Tier 3 LLM routing no longer turns on just because a save runs in `full-auto`, built-in Tier 3 cache entries are partitioned by route-shaping context, the public Tier 3 prompt uses the public `drop` category, continuity fixtures distinguish handover-present packets from compact continuity fallback, prompt-leakage release gates have executable coverage, and static router measurement telemetry stays out of the live telemetry stream.

### Files Modified

| File | Action | Purpose |
|------|--------|---------|
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` | Modified | Removed the `full-auto` Tier 3 enable override so the rollout flag is authoritative. |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts` | Modified | Added route context to built-in cache keys and changed public prompt wording from `drop_candidate` to `drop`. |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts` | Modified | Added the P0 no-exfiltration regression and made Tier 3 tests opt into `SPECKIT_ROUTER_TIER3_ENABLED`. |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-router-cache.vitest.ts` | Modified | Added built-in cache partition coverage for packet kind, save mode, and likely phase anchor. |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts` | Modified | Updated prompt-contract assertions for the public `drop` category and direct metadata target behavior. |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/k-value-optimization.vitest.ts` | Modified | Reframed continuity fixtures as generic handover-present rows plus compact-continuity fallback rows. |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/promotion/promotion-gates.vitest.ts` | Modified | Added prompt-leakage release-gate assertions for the live playbook and native MCP scenario. |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/smart-router-measurement.vitest.ts` | Modified | Added coverage that static measurement writes only to the static compliance stream. |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/005-006-campaign-findings-remediation/006-routing-accuracy-and-classifier-behavior/tasks.md` | Modified | Marked P0/P1 remediation tasks with file:line evidence. |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/005-006-campaign-findings-remediation/006-routing-accuracy-and-classifier-behavior/checklist.md` | Modified | Marked verification gates with evidence and P2 deferral scope. |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/005-006-campaign-findings-remediation/006-routing-accuracy-and-classifier-behavior/graph-metadata.json` | Modified | Updated completion status and key files for this remediation closeout. |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/005-006-campaign-findings-remediation/006-routing-accuracy-and-classifier-behavior/implementation-summary.md` | Created | Captured closeout status, changed files, verification output, and proposed commit message. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Work proceeded P0 first, then P1. The historical source packet docs cited by CF-141 and CF-157 were not edited because this assignment granted write authority only for cited code files, their tests, and this remediation sub-phase; instead, the active code/test guardrails now enforce the security behavior and the packet evidence records that boundary.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep Tier 3 transport behind `SPECKIT_ROUTER_TIER3_ENABLED` | `full-auto` controls planner application, not outbound LLM routing permission. |
| Partition cache keys by route-shaping context | Identical ambiguous text can route differently across packet kind, save mode, level, or phase anchor. |
| Keep `drop_candidate` internal only | Runtime normalization still accepts the alias, but the public prompt contract now exposes only the documented 8 categories. |
| Defer P2 findings | The user requested P0 then P1 remediation for this sub-phase; P2 remains a later low-risk batch. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `cd .opencode/skill/system-spec-kit/mcp_server && ../scripts/node_modules/.bin/vitest run tests/handler-memory-save.vitest.ts` | PASS: 60 passed, 3 skipped |
| `cd .opencode/skill/system-spec-kit/mcp_server && ../scripts/node_modules/.bin/vitest run tests/content-router-cache.vitest.ts` | PASS: 2 passed |
| `cd .opencode/skill/system-spec-kit/mcp_server && ../scripts/node_modules/.bin/vitest run tests/content-router.vitest.ts` | PASS: 30 passed |
| `cd .opencode/skill/system-spec-kit/mcp_server && ../scripts/node_modules/.bin/vitest run tests/k-value-optimization.vitest.ts` | PASS: 10 passed |
| `cd .opencode/skill/system-spec-kit/mcp_server && ../scripts/node_modules/.bin/vitest run skill-advisor/tests/promotion/promotion-gates.vitest.ts` | PASS: 26 passed |
| `cd .opencode/skill/system-spec-kit/mcp_server && ../scripts/node_modules/.bin/vitest run tests/smart-router-measurement.vitest.ts` | PASS: 4 passed |
| `cd .opencode/skill/system-spec-kit/mcp_server && npm run typecheck` | PASS: `tsc --noEmit --composite false -p tsconfig.json` exited 0 |
| `cd .opencode/skill/system-spec-kit/mcp_server && npm run build` | PASS: `tsc --build` exited 0 |
| `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --strict --no-recursive /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/005-006-campaign-findings-remediation/006-routing-accuracy-and-classifier-behavior` | PASS: Errors 0, Warnings 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **P2 findings are not implemented in this pass.** They remain triaged for a later low-risk remediation batch.
2. **Historical source packet docs were not rewritten.** The assignment's authority limited writes to cited code/test files and this sub-phase folder, so this packet records executable guardrails instead of mutating older packet history.
<!-- /ANCHOR:limitations -->

---
