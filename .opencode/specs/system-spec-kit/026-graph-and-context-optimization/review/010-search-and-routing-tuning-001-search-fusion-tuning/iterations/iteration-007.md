# Iteration 7: Codex deep-review still instructs a reducer-incompatible iteration format

## Focus
Compare the canonical `deep-review` agent contract against the Codex mirror and the live reducer/parser to determine whether Codex-generated iteration artifacts would still conform to the active workflow.

## Findings

### P0

### P1
- **F005**: `.codex/agents/deep-review.toml` still tells Codex to write a non-canonical review artifact schema that the active reducer does not parse — `.codex/agents/deep-review.toml:140` — Codex still instructs `# Review Iteration ...` plus `## Scope`, `## Scorecard`, `## Cross-Reference Results`, `## Sources Reviewed`, and `## Reflection`, while the canonical Claude/Gemini contract and the reducer only recognize `# Iteration N:` with `## Focus`, `## Findings`, `## Ruled Out`, `## Dead Ends`, `## Recommended Next Focus`, and `## Assessment`. [SOURCE: `.claude/agents/deep-review.md:148`] [SOURCE: `.gemini/agents/deep-review.md:148`] [SOURCE: `.codex/agents/deep-review.toml:140`] [SOURCE: `.codex/agents/deep-review.toml:187`] [SOURCE: `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:202`] [SOURCE: `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:212`]

```json
{"type":"claim-adjudication","findingId":"F005","claim":"The Codex deep-review mirror is operationally stale because it instructs a review-iteration schema that the current reducer/parser does not recognize as canonical.","evidenceRefs":[".claude/agents/deep-review.md:148",".gemini/agents/deep-review.md:148",".codex/agents/deep-review.toml:140",".codex/agents/deep-review.toml:187",".opencode/skill/sk-deep-review/scripts/reduce-state.cjs:202",".opencode/skill/sk-deep-review/scripts/reduce-state.cjs:212"],"counterevidenceSought":"Compared the Claude and Gemini review-agent instructions against the Codex mirror and the reducer parser looking for support for the alternate Codex sections; the parser only extracts the canonical section names.","alternativeExplanation":"The Codex TOML could have been a richer superset format, but the reducer is fail-closed around exact section names, so the extra/renamed sections create a real interoperability risk rather than harmless verbosity.","finalSeverity":"P1","confidence":0.94,"downgradeTrigger":"Downgrade if the Codex mirror is updated to the canonical section set or the reducer is explicitly extended and tested to parse the alternate Codex schema.","transitions":[{"iteration":7,"from":null,"to":"P1","reason":"Initial discovery"}]}
```

### P2

## Ruled Out
- Claude/Gemini parity on the canonical review workflow: both markdown mirrors still match the reducer-compatible template and claim-adjudication requirement. [SOURCE: `.claude/agents/deep-review.md:148`] [SOURCE: `.gemini/agents/deep-review.md:148`]

## Dead Ends
- Treating the Codex delta as cosmetic TOML-vs-Markdown formatting does not hold up because the live reducer keys on the actual heading and section names, not just the storage format. [SOURCE: `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:210`]

## Recommended Next Focus
Compare the Codex `context` mirror against the canonical continuity-first retrieval workflow so the mirror drift is assessed across both recovery and review entrypoints.

## Assessment
- New findings ratio: 0.34
- Dimensions addressed: maintainability, traceability
- Novelty justification: This pass added a new major mirror finding because the Codex review-agent contract can generate artifacts the active reducer will not parse correctly.
