---
title: Deep Review Strategy — 012-015 Integrated Cross-Packet Review
description: Persistent strategy file for the integrated review of packets 012-015 + their 28 catalog/playbook updates. 10-iteration loop with cli-codex (gpt-5.5 high fast).
---

# Deep Review Strategy — Session Tracking

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose
Audit the 4 v1.0.2 follow-up packets (012/013/014/015) + their 28 catalog/playbook updates as a cohesive integration unit. Per-packet reviews already approved each in isolation; this loop catches cross-cutting concerns that single-packet reviews miss.

### Usage
- **Init**: This file is populated from review_target + 7 numbered focus areas
- **Per iteration**: cli-codex reads §11 NEXT FOCUS, writes evidence to `iterations/iteration-NNN.md` + delta to `deltas/iter-NNN.jsonl`. Reducer rewrites §3, §6, §7-§11
- **Mutability**: §1, §2, §4, §5, §12-§13 analyst-owned. §3, §6, §7-§11 machine-owned (rewritten per iteration)
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:topic -->
## 2. TOPIC

Integrated cross-packet review of 012-015 + their 28 catalog/playbook updates.

**The 4 packets**:
- **012-copilot-target-authority-helper**: `buildCopilotPromptArg` + `validateSpecFolder` + Gate-3 enforcement at deep-loop dispatch
- **013-graph-degraded-stress-cell**: test-only integration sweep with isolated `SPEC_KIT_DB_DIR`
- **014-graph-status-readiness-snapshot**: read-only `getGraphReadinessSnapshot` + `code_graph_status` surfacing `readiness.action`
- **015-cocoindex-seed-telemetry-passthrough**: per-seed `rawScore`/`pathClass`/`rankingSignals` through `code_graph_context` anchors

**Source of evidence**:
- research.md at `../../../011-post-stress-followup-research/research/research.md`
- 4 implementation-summary.md files at `../../../012-*/...`, `013-*/...`, `014-*/...`, `015-*/...`
- 4 review-report.md files at the same packets
- Implementation code at `.opencode/skill/system-spec-kit/mcp_server/`
- 28 catalog/playbook updates committed in `b227544ca`
<!-- /ANCHOR:topic -->

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

7 numbered review focus areas (per the kickoff topic):

- [ ] **Q-CROSS** Cross-packet interactions: does 014's readiness snapshot work cleanly with 013's degraded setup? Does 015's seed passthrough survive 012's authority preamble? Does 012's `@PROMPT_PATH` wrapper interact cleanly with 014's readiness API?
- [ ] **Q-REGRESS** Integration regressions on UNCHANGED callers: do existing consumers of `code_graph_status`, `code_graph_context`, `memory_search`, `memory_save` behave identically before vs after, especially the 003-009 remediation packets that depend on these surfaces?
- [ ] **Q-FLOW** cli-copilot dispatch flow end-to-end: render prompt → `buildCopilotPromptArg` → `validateSpecFolder` → wrapper-mode → file body → copilot exec. Any seam where authority can leak?
- [ ] **Q-TEST** Test brittleness and false-confidence patterns across the 4 new vitest files (~840 LOC): are mock-surface assertions covering the right invariants, or could production refactor silently break the contract?
- [ ] **Q-COV** Coverage gaps spanning packets: e.g., interaction between graph-degraded state (013) and CocoIndex telemetry passthrough (015) when graph is unavailable
- [ ] **Q-DOC** Catalog/playbook coverage: do the 28 new/updated catalog+playbook entries match the actual shipped behavior, or are there terminology drifts?
- [ ] **Q-MAINT** Maintainability / code smell across the ~480 LOC of new implementation in executor-config.ts, ensure-ready.ts, status.ts, context.ts, seed-resolver.ts, tool-input-schemas.ts
<!-- /ANCHOR:key-questions -->

---

<!-- ANCHOR:non-goals -->
## 4. NON-GOALS

- **Re-reviewing items already closed in the per-packet reviews.** All 7 P1 + 2 P2 from those reviews are folded back; this loop assumes those fixes hold and looks for what individual reviews missed.
- **Auditing 003-009 frozen packets** except where 012-015 changes touch them.
- **The v1.0.2 sweep methodology** (covered by 010 findings).
- **Authoring fix packets** for any P0/P1 surfaced — this is review only; remediation is downstream `/spec_kit:plan` work.
- **Stylistic nits** that don't impact correctness/security/traceability/maintainability.
<!-- /ANCHOR:non-goals -->

---

<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS

- 10 iterations hit (hard cap)
- Weighted stop-score > 0.60 AND quality guards pass (source diversity ≥2, focus alignment, no single-weak-source)
- All 7 questions converged with PASS or remediation proposed
- 2+ consecutive iterations with no new findings (stuckThreshold)
- Any P0 finding blocks STOP until evidence quality validated via adversarial self-check
<!-- /ANCHOR:stop-conditions -->

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet — populated as iterations resolve questions]
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[populated after iteration 1]
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[populated after iteration 1]
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES
[populated when an approach has been tried from multiple angles without success]
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[populated as iterations rule out approaches]
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS

**Iteration 1 focus**: Q-CROSS + Q-FLOW. Read the 4 implementation-summary.md files + the 4 review-report.md files. Walk the cli-copilot dispatch flow end-to-end (Q-FLOW). Look for seams where (a) 012 authority preamble could be bypassed, (b) 014 readiness snapshot could be invoked from a 013-degraded state and surface stale data, (c) 015 seed metadata could leak through 012's wrapper file body in a way that confuses the model.

**Output expectation**: iteration-001.md should produce per-question initial evidence + 1-3 candidate findings per question (with severity P0/P1/P2 + recommended remediation pointer). Subsequent iterations refine and converge.
<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

---

<!-- ANCHOR:known-context -->
## 12. KNOWN CONTEXT

**Per-packet review verdicts** (already closed):
- 012: APPROVE WITH CHANGES → all 5 P1 + 1 P2 fixed in `bbf869331`
- 013: APPROVE WITH NITS → 1 P1 fixed
- 014: APPROVE → 1 P2 fixed
- 015: APPROVE WITH MINOR FIXES → 1 P1 fixed

**Recent commits in scope**:
- `bbf869331` — ship 4 packets + post-review P1/P2 fixes
- `b32ad45e3` — feature-catalog + testing-playbook impact audits
- `b227544ca` — apply 28 catalog + playbook fixes from audits

**Implementation footprint**:
- `mcp_server/lib/deep-loop/executor-config.ts` (+278 LOC): `buildCopilotPromptArg`, `CopilotTargetAuthority`, `validateSpecFolder`, `buildTargetAuthorityPreamble`, `buildMissingAuthorityGate3Prompt`, `promptFileBody` for `@PROMPT_PATH` wrapper
- `mcp_server/code_graph/lib/ensure-ready.ts` (+58): `getGraphReadinessSnapshot`, `GraphReadinessSnapshot` interface; `SELECTIVE_REINDEX_THRESHOLD` exported
- `mcp_server/code_graph/handlers/status.ts` (+23): action-level readiness surface
- `mcp_server/code_graph/handlers/context.ts` (+67): cocoindex seed telemetry passthrough
- `mcp_server/code_graph/lib/seed-resolver.ts` (+26): preserve telemetry through `resolveCocoIndexSeed`
- `mcp_server/schemas/tool-input-schemas.ts` (+11): seed schema extensions

**Test footprint** (4 new vitest files, ~840 LOC, 55/55 passing):
- `executor-config-copilot-target-authority.vitest.ts` (29 tests)
- `code-graph-degraded-sweep.vitest.ts` (5 tests)
- `code-graph-status-readiness-snapshot.vitest.ts` (9 tests)
- `code-graph-context-cocoindex-telemetry-passthrough.vitest.ts` (12 tests)

**Operator memory rules to honor**:
- `feedback_codex_cli_fast_mode`: `service_tier=fast` MUST be explicit
- `feedback_worktree_cleanliness_not_a_blocker`: dirty worktree is not a finding
- `feedback_stop_over_confirming`: don't ask A/B/C/D menus
<!-- /ANCHOR:known-context -->

---

<!-- ANCHOR:research-boundaries -->
## 13. RESEARCH BOUNDARIES

- Max iterations: 10 (hard)
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 min
- Per-iteration timeout: 900s
- Progressive synthesis: true
- Workflow-owned `review-report.md` written at convergence
- Lifecycle: `new`/`resume`/`restart` (live)
- Machine-owned sections: §3, §6, §7-§11 (reducer)
- Pause sentinel: `review/.deep-review-pause`

**Executor**: cli-codex / gpt-5.5 / reasoning-effort=high / service-tier=fast / timeout=900s
<!-- /ANCHOR:research-boundaries -->
