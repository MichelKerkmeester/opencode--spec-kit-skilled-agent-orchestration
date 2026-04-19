# Deep Research Strategy: 020 Extended Wave (cli-copilot)

Wave 1 (cli-codex) converged; this wave deep-dives remaining open questions + new angles.

## Non-Goals
- Re-answering wave-1 Q1-Q10 (those are closed)
- Implementing hooks
- Advisor algorithm changes

## Stop Conditions
- newInfoRatio < 0.05 for 3 consecutive iterations
- 10 iterations max
- research-extended.md written + delta table

## Key Questions
<!-- REDUCER_ANCHOR:key-questions -->

- [ ] X1: Corpus parity+timing harness concrete design (fixture layout, measurement methodology, pass/fail thresholds)
- [ ] X2: Claude UserPromptSubmit exact output semantics — look at real usage in codebase, capture stdin shape + model-visible path
- [ ] X3: Copilot userPromptSubmitted — adapter design to get MODEL-VISIBLE injection (not just notification)
- [ ] X4: Codex PreToolUse/PostToolUse payload + blocking semantics — design for enforcement-mode advisor (future)
- [ ] X5: Adversarial advisor — can user prompt poison advisor brief? Attack surface, mitigation
- [ ] X6: Full observability design — metrics schema (names, types, dims), log-line format, alarms, session_health surface
- [ ] X7: Migration semantics — what happens when a skill is added/removed/renamed mid-session? Cache invalidation behavior
- [ ] X8: Concurrent-session race — two Claude sessions in same workspace; cache/freshness interaction
- [ ] X9: NFKC sanitization interaction — does advisor brief text need sanitization before model sees it? Phase 019/003 context
- [ ] X10: Synthesis — research-extended.md + wave-1+wave-2 delta table + final cluster decomposition refinement
<!-- /REDUCER_ANCHOR:key-questions -->

## Answered Questions
<!-- REDUCER_ANCHOR:answered-questions -->
<!-- (empty — first iteration) -->
<!-- /REDUCER_ANCHOR:answered-questions -->

## Known Context

- Wave 1 research.md at `../../research/020-skill-advisor-hook-surface-001-initial-research/research.md` — all Q1-Q10 answered
- Wave 1 findings registry at `../findings-registry.json`
- Phase 019/003 NFKC hardening shipped (shared/unicode-normalization.ts canonicalFold)
- Phase 018 R4 shared-payload contract live
- 019/004 200-prompt corpus at `../019-system-hardening-001-initial-research-005-routing-accuracy/corpus/labeled-prompts.jsonl`
- Existing hooks pattern in `mcp_server/hooks/{claude,gemini,copilot}/`
- Pattern reference: code-graph `buildStartupBrief()` in `lib/code-graph/startup-brief.ts`
- Wave-1 rejected kind='skill-advisor' — use neutral envelope kind

## Next Focus
<!-- REDUCER_ANCHOR:next-focus -->
Iteration 1: Corpus parity+timing harness concrete design.
<!-- /REDUCER_ANCHOR:next-focus -->

## What Worked
<!-- REDUCER_ANCHOR:what-worked -->
<!-- (empty) -->
<!-- /REDUCER_ANCHOR:what-worked -->

## What Failed
<!-- REDUCER_ANCHOR:what-failed -->
<!-- (empty) -->
<!-- /REDUCER_ANCHOR:what-failed -->

## Exhausted Approaches
<!-- REDUCER_ANCHOR:exhausted-approaches -->
<!-- (empty) -->
<!-- /REDUCER_ANCHOR:exhausted-approaches -->

## Ruled Out Directions
<!-- REDUCER_ANCHOR:ruled-out-directions -->
<!-- Wave 1 rejections inherited -->
<!-- /REDUCER_ANCHOR:ruled-out-directions -->
