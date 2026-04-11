# Iteration 6: Evaluator Candidates from Existing Validation Surfaces

## Focus
Find real repo-native evaluator candidates that could score a future `sk-improve-agent` without inventing a benchmark from scratch.

## Findings
1. The repo already has deterministic document-integrity validation. `check-spec-doc-integrity.sh` checks markdown references, stale spec metadata, missing handover targets, and non-resolvable `/spec_kit:resume` paths, which makes it a strong structural gate for artifact-oriented agents. [SOURCE: .opencode/skill/system-spec-kit/scripts/rules/check-spec-doc-integrity.sh:82] [SOURCE: .opencode/skill/system-spec-kit/scripts/rules/check-spec-doc-integrity.sh:95] [SOURCE: .opencode/skill/system-spec-kit/scripts/rules/check-spec-doc-integrity.sh:103] [SOURCE: .opencode/skill/system-spec-kit/scripts/rules/check-spec-doc-integrity.sh:126]
2. Some agent-adjacent outputs already have regression-style tests. `startup-brief.vitest.ts` asserts concrete invariants about graph state, summaries, orientation notes, and failure behavior, which shows that generated assistant-facing briefs can be scored with ordinary tests rather than prose judgment alone. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:49] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:60] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:99]
3. The quality loop handler already implements a score-threshold workflow with immediate retries, best-state tracking, and hard rejection after bounded attempts. That is not the same as agent improvement, but it is the closest native pattern for score -> fix -> re-score -> keep/reject. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:567] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:622] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:670]
4. Handover generation is more measurable than open-ended research because the command defines strict pre-validation, seven required sections, a fixed output location, and a mandatory memory-save follow-up. That makes handover-style outputs a much better evaluator substrate than freeform prompt quality. [SOURCE: .opencode/command/spec_kit/handover.md:58] [SOURCE: .opencode/command/spec_kit/handover.md:195] [SOURCE: .opencode/command/spec_kit/handover.md:215]
5. The documentation tooling already has deterministic scoring logic. `extract_structure.py` computes a DQI score from checklist pass rate, structure, content, and style thresholds, which could act as a numeric component inside a phase-1 evaluator. [SOURCE: .opencode/skill/sk-doc/scripts/extract_structure.py:892] [SOURCE: .opencode/skill/sk-doc/scripts/extract_structure.py:940] [SOURCE: .opencode/skill/sk-doc/scripts/extract_structure.py:976]

## Ruled Out
- A pure prompt-quality evaluator is too subjective for a first loop. The repo already favors structural checks, deterministic tests, and thresholded quality scores over freeform prose judgment. [SOURCE: .opencode/skill/system-spec-kit/scripts/rules/check-spec-doc-integrity.sh:126] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:49] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:670]

## Dead Ends
- I did not find a ready-made numeric evaluator for `.opencode/agent/*.md` directly. The strongest existing scoring surfaces measure outputs or artifact quality, not prompt text in isolation.

## Sources Consulted
- .opencode/skill/system-spec-kit/scripts/rules/check-spec-doc-integrity.sh:82
- .opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:49
- .opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:567
- .opencode/command/spec_kit/handover.md:195

## Assessment
- New information ratio: 0.58
- Questions addressed: What capabilities are missing if we want a reliable `sk-improve-agent` rather than a one-off research packet?
- Questions answered: None newly answered; this iteration identified the most realistic scoring candidates.

## Reflection
- What worked and why: Looking for validators and test contracts around generated artifacts surfaced a far more credible evaluator path than trying to score raw agent prose.
- What did not work and why: Searching for a direct "agent evaluator" surface came up empty; the current repo mostly scores outputs, not agent definitions themselves.
- What I would do differently: If this becomes implementation work, prototype the evaluator around one artifact-producing agent first instead of inventing a generic rubric for all agent prompts.

## Recommended Next Focus
Design the control bundle that would wire together a human-authored charter, a target manifest, and one of these evaluator surfaces.
