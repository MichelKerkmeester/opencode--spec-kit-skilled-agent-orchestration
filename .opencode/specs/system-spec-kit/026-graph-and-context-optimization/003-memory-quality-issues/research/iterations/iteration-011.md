# Iteration 11: Citation Drift Verification (Q8)

## Focus
Generation-1 remediation is only safe if the frozen D1-D8 root-cause citations still point at the live owners in the current tree. If those anchors drifted, downstream fix work could patch the wrong seam, misread an omission as resolved, or carry stale file:line references into the PR plan.

This pass therefore does not reopen Q1-Q7 or reinterpret the defects. It only checks whether the canonical citations from `research.md` and iteration 10 still land on the same functions, branches, and omission points in the current `.opencode/skill/system-spec-kit/scripts/` tree.

## Approach
- Read the Gen-2 strategy reopen scope and confirmed Q8 is limited to drift verification, not root-cause re-analysis. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/deep-research-strategy.md:174-210]
- Read the canonical Gen-1 synthesis to capture the frozen D1-D8 citation set now treated as the source of truth. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:48-75]
- Read iteration 10 to mirror the established deliverable tone and to cross-check which citations Gen-1 declared final. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-010.md:9-16]
- Located the live on-disk TypeScript owners under `.opencode/skill/system-spec-kit/scripts/` and inspected each cited neighborhood directly.
- Compared the frozen line spans against the current source to classify each as stable, drifted, moved, or missing.

## Drift table
| Defect | Cited location (iter 1-10) | Current location on disk | Status | Notes |
|--------|---------------------------|--------------------------|--------|-------|
| D1 | collect-session-data.ts:875-881 | `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:875-881` | stable | Same `sessionSummary.substring(0, 500)` clamp remains in place. |
| D2 | decision-extractor.ts:182-185 | `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:182-185` | stable | Function entry still initializes `_manualDecisions` only; no raw `keyDecisions` read was inserted here. |
| D2 | decision-extractor.ts:367-388 | `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:367-388` | stable | Lexical fallback branch still feeds `allDecisionObservations` when manual decisions are absent. |
| D3 | workflow.ts:1271-1295 | `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1271-1295` | stable | Folder-token append still happens in the same block, although the block now includes an inline stopword set. |
| D3 | semantic-signal-extractor.ts:260-284 | `.opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts:260-284` | stable | Topic-term bigram filtering/sorting pipeline is unchanged at the cited seam. |
| D4 | frontmatter-migration.ts:1112-1183 | `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1112-1183` | stable | The same managed-frontmatter writer still infers and serializes `importance_tier`. |
| D5 | workflow.ts:1305-1372 | `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1305-1372` | stable | The render path still constructs `causalLinks` from pass-through context only; no predecessor discovery was added here. |
| D5 | memory-metadata.ts:227-236 | `.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:227-236` | stable | Helper still reads existing causal arrays and returns them directly. |
| D7 | workflow.ts:658-659 | `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:658-659` | stable | `isCapturedSessionMode` gate is unchanged. |
| D7 | workflow.ts:877-923 | `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:877-923` | stable | Step 3.5 enrichment still runs only inside the capture-mode branch. |

## Findings
1. All ten legacy Q8 target citations still resolve to the same six TypeScript files and the same cited line spans in the current source tree; I found no file move, helper rename, or line-number drift in the frozen D1-D5/D7 anchors. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:875-881] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:182-185] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:367-388] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:658-659] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:877-923] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1271-1295] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1305-1372] [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts:260-284] [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1112-1183] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:227-236]
2. D2’s “missing raw decision read” citation is still valid at the exact function entry: `extractDecisions()` begins by reading `_manualDecisions`, and the cited entry span still shows no direct `keyDecisions` or `decisions` intake before later fallback logic executes. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:182-185]
3. D2’s lexical-fallback citation is also still exact: the `decisionObservations.length === 0 && processedManualDecisions.length === 0` branch still calls `buildLexicalDecisionObservations(collectedData)` and then prefers those observations when none others exist. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:367-388]
4. D3 shows additive evolution without citation drift: the workflow block now includes a `FOLDER_STOPWORDS` set inside the same cited window, but folder-derived tokens are still appended after `filterTriggerPhrases()`, so the original owner citation remains valid. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1270-1298]
5. D4’s second-writer citation remains precise because the same `inferImportanceTier(...)` plus `serializeFrontmatter(...)` path still recomputes and serializes managed frontmatter keys in one place; the owner did not move to another helper. [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1112-1183]
6. D5 and D7 both remain orchestration omissions at the same seams: the workflow still injects `causalLinks` via `buildCausalLinksContext(collectedData)` without predecessor discovery, and JSON-mode still bypasses Step 3.5 because git/spec enrichment remains capture-mode-only. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:658-659] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:877-923] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1305-1372] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:227-236]

## Ruled out / not reproducible
- I did **not** find evidence that any Q8 citation had moved to a renamed helper or a different file; every target still lands on the originally cited owner block in the current tree. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:875-881] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:182-185] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1271-1295]
- I did **not** find a newly added predecessor-discovery stage in the D5 render path; the workflow still passes through `causalLinks` and the helper still only reads arrays already present on `collectedData`. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1305-1372] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:227-236]
- I did **not** find a provenance-only JSON-mode hook replacing the old capture-only gate; Step 3.5 remains entirely inside `if (isCapturedSessionMode)`. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:658-659] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:877-923]

## New questions raised
- When remediation PRs land, should Gen-2 append a post-fix citation refresh appendix so `research.md` does not retain pre-fix line anchors indefinitely?
- Does the inline `FOLDER_STOPWORDS` addition inside the D3 workflow block change the fixture scope needed for Q12’s repo-wide trigger-phrase survey?

## Next focus recommendation
Iteration 12 should execute Q9 (repo-wide survey of JSON-mode memory files). See strategy §14.
