---
title: Deep Research Strategy — 011-post-stress-followup-research
description: Persistent strategy file for the v1.0.2 follow-up research session. Tracks 4 P0/P1/P2 follow-ups + 1 light arch touch across 10-iteration cli-codex (gpt-5.5 high fast) loop.
---

# Deep Research Strategy — Session Tracking

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose
Refine actionable fix proposals for four v1.0.2 stress-test follow-ups + light architectural touch on intelligence-system seams. Deliverable: per-follow-up evidence + 2-3 fix candidates + recommended approach + falsifiable success criteria + scope estimate, ready to seed downstream remediation packets.

### Usage
- **Init**: This file is populated from research_topic + the 5 opening questions from findings-registry.json.
- **Per iteration**: cli-codex reads §11 NEXT FOCUS, writes iteration evidence to `iterations/iteration-NNN.md` + delta to `deltas/iter-NNN.jsonl`. Reducer rewrites §3, §6, §7-§11 after each iteration.
- **Mutability**: §1, §2, §4, §5, §12-§13 are analyst-owned (stable). §3, §6, §7-§11 are machine-owned (rewritten per iteration).
- **Protection**: Shared state with explicit ownership boundaries. Orchestrator validates consistency on resume.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:topic -->
## 2. TOPIC

Refine actionable fix proposals for four v1.0.2 stress-test follow-ups (P0 cli-copilot `/memory:save` Gate 3 bypass; P1 code-graph fast-fail not testable; P2 file-watcher debounce; opportunity CocoIndex fork telemetry not yet leveraged downstream), plus a light architectural touch on the broader intelligence-system stack.

**Source of evidence**:
- `../../010-stress-test-rerun-v1-0-2/findings.md` Recommendations §1-5
- `../../010-stress-test-rerun-v1-0-2/runs/{cell}/{cli}-N/score.md` per-cell scores (especially I1/cli-copilot for P0; Q1 cells for P1; pre-flight for P2; S2/cli-opencode for opportunity)
- `../../010-stress-test-rerun-v1-0-2/runs/preflight.log`
- Spec folders: `004-memory-save-rewrite/` (planner-first), `005-code-graph-fast-fail/` (fallbackDecision matrix)
- Implementation: `mcp_server/hooks/copilot/`, `mcp_server/lib/ops/file-watcher.ts:49`, `mcp_server/cocoindex_code/` fork
<!-- /ANCHOR:topic -->

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] **Q-P0** Where does cli-copilot's `/memory:save` Gate 3 bypass originate, and what is the minimal sufficient fix? (priority P0)
- [ ] **Q-P1** What is the lowest-cost mechanism for deterministic graph degradation in a future sweep that exercises all four `fallbackDecision` matrix branches? (priority P1)
- [ ] **Q-P2** Should the file-watcher's `DEFAULT_DEBOUNCE_MS=2000` be lowered, OR should `code_graph_status` add a freshness self-check, OR both? Quantify trade-offs. (priority P2)
- [ ] **Q-OPP** Which downstream consumers in `mcp_server/lib/search/` should adopt which CocoIndex fork telemetry fields? Is `path_class` rerank duplicated upstream (deletion target)? (priority P2)
- [ ] **Q-ARCH** Name 1-2 architectural seams in the broader intelligence-system stack (Spec Kit Memory / Code Graph / CocoIndex / Skill Advisor) that v1.0.2 didn't measure but where current evidence suggests a focused refinement packet would pay off. (priority P3, light touch)
<!-- /ANCHOR:key-questions -->

---

<!-- ANCHOR:non-goals -->
## 4. NON-GOALS

- **Authoring per-follow-up remediation packets.** This loop produces evidence + recommendations; packets are downstream user-authored work.
- **Modifying any of the 003-009 remediation packets.** They're closed and frozen; research reads from them.
- **Implementation, testing, or deployment** of any fix proposed by the research.
- **Re-running the v1.0.2 sweep** or any stress-test execution.
- **Deep architectural refactor proposals.** Light touch only — name candidates, don't scope them.
- **Commit-level fix recommendations.** Stop at design proposal + scope estimate (per spec.md Q-001).
<!-- /ANCHOR:non-goals -->

---

<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS

- 10 iterations hit (hard cap)
- Weighted stop-score > 0.60 AND quality guards pass (source diversity ≥2, focus alignment, no single-weak-source)
- All 5 opening questions resolved (question-entropy → 1.0)
- 3+ consecutive iterations with `newInfoRatio` near zero (stuckRecovery threshold)
- Single-weak-source flag triggered for any P0/P1 finding (quality guard block)
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
[First iteration — populated after iteration 1 completes]
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[First iteration — populated after iteration 1 completes]
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[Populated when an approach has been tried from multiple angles without success]
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[Populated as iterations rule out approaches]
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS

**Iteration 1 focus**: Read source-of-evidence artifacts and ground the 5 questions. Specifically:
1. Read `../../010-stress-test-rerun-v1-0-2/findings.md` Recommendations §1-5 verbatim
2. Read `../../010-stress-test-rerun-v1-0-2/runs/I1/cli-copilot-1/score.md` (load-bearing for Q-P0)
3. Read `../../010-stress-test-rerun-v1-0-2/runs/I1/cli-codex-1/score.md` + `I1/cli-opencode-1/score.md` (compare correct-Gate-3 behavior)
4. Read `../../004-cocoindex-overfetch-dedup/spec.md` and the fork at `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/` to ground Q-OPP
5. Identify 2-3 candidate fix approaches per question (don't commit yet; surface options)

**Output expectation**: iteration-001.md should produce per-question initial evidence + 2-3 candidate approaches; subsequent iterations refine.
<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

---

<!-- ANCHOR:known-context -->
## 12. KNOWN CONTEXT

**Source-of-evidence path** (committed in `3568eb1a5`):
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/findings.md`
- 30 score.md files in `010-stress-test-rerun-v1-0-2/runs/`

**Closely related closed packets** (read but don't modify):
- `003-memory-context-truncation-contract` — token-budget envelope (Q-OPP indirect)
- `004-cocoindex-overfetch-dedup` — fork at version 0.2.3+spec-kit-fork.0.2.0; 7 new telemetry fields (Q-OPP primary)
- `005-code-graph-fast-fail` — `fallbackDecision.nextTool` matrix shipped in `mcp_server/code_graph/handlers/query.ts:775-796` (Q-P1 primary)
- `006-causal-graph-window-metrics` — production tuning deferred (Q-ARCH candidate)
- `007-intent-classifier-stability` — sorted-token paraphrase grouping; v2 embedding-based deferred (Q-ARCH candidate)
- `008-mcp-daemon-rebuild-protocol` — daemon-readiness contract (Q-P2 indirect)
- `009-memory-search-response-policy` — refusal contract for low-quality searches (Q-P0 indirect — policy ratified server-side)
- `003-continuity-memory-runtime/004-memory-save-rewrite` — planner-first contract for `/memory:save` (Q-P0 primary)

**Key implementation files**:
- `mcp_server/hooks/copilot/session-prime.ts` — copilot session bootstrap (Q-P0)
- `mcp_server/lib/ops/file-watcher.ts:49` — chokidar watcher with `DEFAULT_DEBOUNCE_MS=2000` (Q-P2 primary)
- `mcp_server/code_graph/handlers/query.ts` — `fallbackDecision` emission point (Q-P1)
- `mcp_server/cocoindex_code/{indexer.py, query.py, schema.py}` — fork that emits 7 new fields (Q-OPP primary)
- `mcp_server/lib/search/{hybrid-search.ts, intent-classifier.ts, local-reranker.ts, cross-encoder.ts, bm25-index.ts, confidence-scoring.ts}` — non-consumers of fork fields (Q-OPP target)

**Constants**:
- v1.0.2 sweep delivered +7.2pp overall improvement (76.7% → 83.8%), 0 REGRESSIONs, 6/7 packets PROVEN, 1 NEUTRAL (packet 005).
- I2/cli-opencode WIN +5 (load-bearing SC-003 closure): recovered from 1/8 to 6/8.
- I1/cli-copilot 2/8 (P0 follow-up): still mutates wrong spec folder.

**Operator memory rules to honor**:
- `feedback_codex_cli_fast_mode`: `service_tier=fast` MUST be explicit
- `feedback_copilot_concurrency_override`: cli-copilot max 3 concurrent (irrelevant to this loop — single-executor cli-codex)
- `feedback_stop_over_confirming`: don't ask A/B/C/D menus when next step is obvious
- `feedback_cli_executor_only_when_requested`: don't substitute cli-codex for advisor's hint
<!-- /ANCHOR:known-context -->

---

<!-- ANCHOR:research-boundaries -->
## 13. RESEARCH BOUNDARIES

- Max iterations: 10 (hard cap)
- Convergence threshold: 0.05 (default)
- Per-iteration budget: 12 tool calls, 10 minutes
- Per-iteration timeout: 900 seconds (15 min) executor wall-clock
- Progressive synthesis: true
- `research/research.md` ownership: workflow-owned canonical synthesis output (written at convergence)
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred)
- Machine-owned sections: reducer controls §3, §6, §7-§11
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.opencode/skill/sk-deep-research/assets/runtime_capabilities.json`
- Current generation: 1
- Started: 2026-04-27T17:00:49Z

**Executor**:
- Kind: cli-codex
- Model: gpt-5.5
- Reasoning effort: high
- Service tier: fast (explicit per memory rule)
- Timeout: 900s/iteration
<!-- /ANCHOR:research-boundaries -->
