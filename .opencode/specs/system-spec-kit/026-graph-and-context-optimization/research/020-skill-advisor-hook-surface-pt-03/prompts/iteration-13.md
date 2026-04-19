# Deep-Research Iteration 13 — 020 Wave-3 Validation (cli-copilot)

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

Iteration: 13 of 20
Focus: **Deep-dive on P0/P1 findings from iter 1-10**

## TASKS

1. Read iterations/iteration-001.md through iteration-010.md and aggregate all P0 and P1 findings.
2. Pick the top 3 most impactful P0 findings that need additional investigation depth.
3. For each picked finding:
   - Re-check the affected child's spec.md + plan.md + tasks.md for any context the iter 1-10 analysis missed
   - Cross-reference against both wave-1 and wave-2 synthesis for any nuance
   - Propose a specific spec patch (diff-style) the 020 parent can adopt pre-implementation
4. Write iteration-13.md with deep-dive + proposed patches.

If no P0/P1 findings remain open, set newInfoRatio < 0.05 and status='in_progress' — signal early convergence.

## STATE FILES

- Config: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-003-implementation-plan-validation-copilot/deep-research-config.json`
- State Log: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-003-implementation-plan-validation-copilot/deep-research-state.jsonl` — APPEND canonical `"type":"iteration"` record
- Strategy: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-003-implementation-plan-validation-copilot/deep-research-strategy.md`
- Registry: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-003-implementation-plan-validation-copilot/findings-registry.json`
- Iter narrative: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-003-implementation-plan-validation-copilot/iterations/iteration-013.md`
- Per-iter delta: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-003-implementation-plan-validation-copilot/deltas/iter-013.jsonl`

## CONSTRAINTS

- Soft cap 8 tool calls, hard max 12
- Iter 13 focus: Deep-dive on P0/P1 findings from iter 1-10 ONLY — do not drift
- REQUIRED canonical JSONL `"type":"iteration"` EXACTLY with schema below
- REQUIRED per-iter delta file
- Findings must cite file paths (e.g. `020/004/spec.md §4.1 REQ-007`) — no vague claims
- Severity tag every finding: P0 (blocks implementation) / P1 (should patch pre-impl) / P2 (defer/accept)
- Do NOT re-open architecture. Do NOT propose new children. Do NOT modify child spec.md files.

## OUTPUT CONTRACT

1. `iterations/iteration-013.md` — focused findings for iter 13 with severity-tagged items and file citations
2. Canonical JSONL appended to state.jsonl (exact shape):
   `{"type":"iteration","iteration":13,"newInfoRatio":0.35,"status":"in_progress","focus":"Deep-dive on P0/P1 findings from iter 1-10","findingsCount":N,"keyQuestions":10,"answeredQuestions":M,"timestamp":"2026-04-19T...Z","durationMs":N,"graphEvents":[]}`
   (Adjust newInfoRatio honestly based on actual novelty — 0.35 is a guidance target for this iter position.)
3. `deltas/iter-013.jsonl` — structured per-iter delta with findings list

## NOTE ON CONVERGENCE

This is iter 13 of 20. If validation findings have saturated and no new P0/P1 gaps surface, set `newInfoRatio` low (below 0.05). Be honest — don't force novelty.
