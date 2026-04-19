# Deep Research Strategy: 020 Skill-Advisor Hook Surface

Research Charter: converge on cross-runtime skill-advisor hook architecture with ranked implementation-cluster proposals + child-spec-folder mapping.

## Non-Goals

- Implementing any hook wiring (belongs to 020/002+ children)
- Changing advisor ranking algorithm
- Cross-repo skill discovery

## Stop Conditions

- newInfoRatio < 0.05 (rolling avg of last 3 iterations)
- 10 iterations max reached
- research.md + cluster-mapping written to completion

## Key Questions
<!-- REDUCER_ANCHOR:key-questions -->

- [ ] Q1: Does Codex CLI expose a prompt-submit hook equivalent to Claude's `UserPromptSubmit`? If not, what wrapper strategy is cleanest?
- [ ] Q2: What's the empirical cache TTL sweet spot? Measure using 019/004 200-prompt corpus; expect 1-15 min range.
- [ ] Q3: What's the optimal brief length (40/60/80/120 tokens) that retains full routing quality?
- [ ] Q4: How does `getAdvisorFreshness()` semantic map to `live/stale/absent/unavailable`? What's the freshness comparison (SKILL.md mtimes vs skill-graph SQLite mtime)?
- [ ] Q5: What subprocess-error modes must the fail-open contract handle (binary missing, timeout, JSON parse error, concurrent write to skill-graph)?
- [ ] Q6: Should the hook fire on ALL user prompts or only above a length threshold? What's the threshold?
- [ ] Q7: Is prompt-fingerprint storage in hook-state a privacy concern? How should it be scoped (in-memory only, persisted with TTL, salted hash)?
- [ ] Q8: What's the cross-runtime snapshot-test strategy to prevent format drift across 3 CLIs?
- [ ] Q9: How many implementation clusters should this decompose into? (Parent spec proposes 7 — 002-advisor-brief-producer, 003-claude-hook-wiring, 004-gemini-hook-wiring, 005-copilot-hook-wiring, 006-codex-integration, 007-freshness-signal, 008-documentation.)
- [ ] Q10: What's the interaction with phase 018 R4 shared-payload contract — does it need any extension for this use case?
<!-- /REDUCER_ANCHOR:key-questions -->

## Answered Questions
<!-- REDUCER_ANCHOR:answered-questions -->
<!-- (empty — first iteration) -->
<!-- /REDUCER_ANCHOR:answered-questions -->

## Known Context

- Parent 020 charter committed research-first per ADR-001
- Pattern reference: `mcp_server/lib/code-graph/startup-brief.ts` (live in all 3 runtimes)
- Shared-payload envelope from phase 018 R4 is the cross-runtime transport
- 019/004 200-prompt corpus available at `research/019-system-hardening-001-initial-research-005-routing-accuracy/corpus/labeled-prompts.jsonl`
- Trust-state vocabulary canonical: `live | stale | absent | unavailable` (phase 016 M8)
- Fail-open contract ADR-003 in parent decision-record.md
- Pattern-reuse ADR-002 mandates mirror of code-graph shape

## Next Focus
<!-- REDUCER_ANCHOR:next-focus -->

Iteration 1: Enumerate existing hook trigger points per runtime. Read `mcp_server/hooks/{claude,gemini,copilot}/*.ts` + `memory-surface.ts` + `index.ts`. Output: file × trigger-event × runtime matrix. Identify gaps per Q1.
<!-- /REDUCER_ANCHOR:next-focus -->

## What Worked
<!-- REDUCER_ANCHOR:what-worked -->
<!-- (empty — first iteration) -->
<!-- /REDUCER_ANCHOR:what-worked -->

## What Failed
<!-- REDUCER_ANCHOR:what-failed -->
<!-- (empty — first iteration) -->
<!-- /REDUCER_ANCHOR:what-failed -->

## Exhausted Approaches
<!-- REDUCER_ANCHOR:exhausted-approaches -->
<!-- (empty — first iteration) -->
<!-- /REDUCER_ANCHOR:exhausted-approaches -->

## Ruled Out Directions
<!-- REDUCER_ANCHOR:ruled-out-directions -->
<!-- (empty — first iteration) -->
<!-- /REDUCER_ANCHOR:ruled-out-directions -->
