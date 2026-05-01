# Iteration 015 — Deep-Research Loop Surface Area

## Research question
Are `system-spec-kit`'s deep-research and deep-review loops the right abstraction, or has the loop infrastructure accumulated too many synchronized artifacts compared with what the external repo proves is actually necessary for durable progress?

## Hypothesis
The local loop will remain stronger for long autonomous studies, but the combination of JSONL, strategy, registry, dashboard, and progressive synthesis will look heavier than needed for many research packets.

## Method
Compared the external repo's plain progress/checklist artifacts to the local deep-research agent contract and skill architecture.

## Evidence
- The external repo's operator progress model is intentionally simple: one `progress` command reads project docs, source, tests, and git history, then reports status and next actions. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/progress.md:11-60]
- The local deep-research agent explicitly treats JSONL, strategy, findings registry, dashboard, and progressive `research.md` updates as synchronized packet surfaces. [SOURCE: .opencode/agent/deep-research.md:50-60] [SOURCE: .opencode/agent/deep-research.md:159-213]
- The `sk-deep-research` skill frames the workflow as a three-layer system with config, strategy, JSONL, findings registry, dashboard, and progressive synthesis, and it treats reducer ownership as part of the live contract. [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:167-176] [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:215-221] [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:231-244] [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:316-323]
- The local agent even awards a novelty bonus for simplification/consolidation work, which is a good signal that the workflow already recognizes over-complex state as a problem. [SOURCE: .opencode/agent/deep-research.md:191-201]

## Analysis
The loop abstraction itself still looks right for `system-spec-kit`. What looks questionable is the number of synchronized surfaces that every loop drags along, even when the packet is not large enough to justify them. The external repo shows that a simple progress surface and one primary artifact can already preserve a lot of value. That suggests the current local architecture should keep the loop but collapse or derive more of its secondary outputs.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** Deep research maintains multiple reducer-owned artifacts in parallel so convergence, traceability, and progress visibility all stay explicit.
- **External repo's approach:** Keep progress and working state much flatter, with fewer synchronized documents.
- **Why the external approach might be better:** It lowers artifact-management overhead and makes packet state easier for humans to understand at a glance.
- **Why system-spec-kit's approach might still be correct:** Long autonomous studies really do benefit from explicit state, especially when recovery and convergence must be robust.
- **Verdict:** SIMPLIFY
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** Reduce the mandatory live state to `deep-research-state.jsonl` plus `research.md`, and make dashboard/registry/strategy generated or optional views rather than always-on primary surfaces.
- **Blast radius of the change:** large
- **Migration path:** Start by deriving dashboard/registry from JSONL on demand, then measure whether strategy can be folded into the synthesis/report surface for lower-complexity packets.

## Conclusion
confidence: high

finding: The deep-research loop should stay, but its state model is probably broader than necessary. The best external lesson is not "drop the loop" but "make fewer artifacts primary."

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/agent/deep-research.md`, `.opencode/skill/sk-deep-research/SKILL.md`, `spec_kit:deep-research` workflow assets
- **Change type:** architectural shift
- **Blast radius:** large
- **Prerequisites:** decide which synchronized outputs are operator-facing conveniences versus core state required for safe recovery
- **Priority:** should-have

## Counter-evidence sought
I looked for evidence that the external repo solves convergence, recovery, and lineage tracking at the same scale as `system-spec-kit`; it does not. That means the local loop abstraction is still justified even if the artifact count is not. [SOURCE: .opencode/agent/deep-research.md:167-213]

## Follow-up questions for next iteration
Would simplifying loop state also let the validation system shrink?
Should human-readable verification and issue-tracking surfaces be generated from the loop instead of maintained separately?
