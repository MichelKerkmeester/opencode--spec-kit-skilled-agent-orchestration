# Deep-Research Iteration 3 — 020 Wave-3 Validation (cli-copilot)

Dispatched via `copilot -p @PROMPT --model gpt-5.4 --allow-all-tools --no-ask-user`.

**Gate 3 pre-answered**: Option **E** (phase folder). Target `026/research/020-skill-advisor-hook-surface-001-initial-research-003-implementation-plan-validation-copilot/`. All writes pre-authorized. Proceed WITHOUT asking.

**Context**: Wave 1 (cli-codex, converged) + Wave 2 (cli-copilot extended, converged) both settled architecture and contract semantics. You are wave 3 — **validating the current 8-child implementation scaffold** (020/002-009). **DO NOT** re-open architecture. **DO NOT** propose new children beyond 002-009. Only challenge or validate the current scaffold content.

## PRIOR WORK

- Wave-1 research.md: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/research.md`
- Wave-2 research-extended.md: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/research-extended.md`

## 8 SCAFFOLDED CHILDREN (targets for validation)

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/002-shared-payload-advisor-contract/`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/003-advisor-freshness-and-source-cache/`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/004-advisor-brief-producer-cache-policy/`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/005-advisor-renderer-and-regression-harness/`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/006-claude-hook-wiring/`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/007-gemini-copilot-hook-wiring/`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/008-codex-integration-and-hook-policy/`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/009-documentation-and-release-contract/`

## STATE

Iteration: 3 of 20
Focus: **V3 Hidden dependency cycles**

## TASKS

1. Read each child's §3 Scope files-to-change lists.
2. Grep for shared symbols: 'AdvisorHookResult', 'buildSkillAdvisorBrief', 'getAdvisorFreshness', 'AdvisorEnvelopeMetadata', 'renderAdvisorBrief', 'NormalizedAdvisorRuntimeOutput'.
3. Identify type/module/cache-key coupling between children beyond the linear 002→009 chain.
4. Flag any bidirectional dependency or inverted-import risk.
5. Check: does the renderer (005) require types defined only in 004? Does 004's producer require shapes defined in 005? If yes, document the forward reference.
6. Write iteration-003.md with a dependency graph + hidden cycles list + severity tags.

## STATE FILES

- Config: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-003-implementation-plan-validation-copilot/deep-research-config.json`
- State Log: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-003-implementation-plan-validation-copilot/deep-research-state.jsonl` — APPEND canonical `"type":"iteration"` record
- Strategy: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-003-implementation-plan-validation-copilot/deep-research-strategy.md`
- Registry: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-003-implementation-plan-validation-copilot/findings-registry.json`
- Iter narrative: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-003-implementation-plan-validation-copilot/iterations/iteration-003.md`
- Per-iter delta: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-003-implementation-plan-validation-copilot/deltas/iter-003.jsonl`

## CONSTRAINTS

- Soft cap 8 tool calls, hard max 12
- Iter 3 focus: V3 Hidden dependency cycles ONLY — do not drift
- REQUIRED canonical JSONL `"type":"iteration"` EXACTLY with schema below
- REQUIRED per-iter delta file
- Findings must cite file paths (e.g. `020/004/spec.md §4.1 REQ-007`) — no vague claims
- Severity tag every finding: P0 (blocks implementation) / P1 (should patch pre-impl) / P2 (defer/accept)
- Do NOT re-open architecture. Do NOT propose new children. Do NOT modify child spec.md files.

## OUTPUT CONTRACT

1. `iterations/iteration-003.md` — focused findings for iter 3 with severity-tagged items and file citations
2. Canonical JSONL appended to state.jsonl (exact shape):
   `{"type":"iteration","iteration":3,"newInfoRatio":0.80,"status":"in_progress","focus":"V3 Hidden dependency cycles","findingsCount":N,"keyQuestions":10,"answeredQuestions":M,"timestamp":"2026-04-19T...Z","durationMs":N,"graphEvents":[]}`
   (Adjust newInfoRatio honestly based on actual novelty — 0.80 is a guidance target for this iter position.)
3. `deltas/iter-003.jsonl` — structured per-iter delta with findings list

## NOTE ON CONVERGENCE

This is iter 3 of 20. If validation findings have saturated and no new P0/P1 gaps surface, set `newInfoRatio` low (below 0.05). Be honest — don't force novelty.
