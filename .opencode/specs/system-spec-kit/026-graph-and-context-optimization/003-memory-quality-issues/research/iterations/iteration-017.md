# Iteration 17: Refactor Dependency Map for Shared Helpers (Q14)

## Focus
`research.md` already froze three cross-cutting refactor targets for post-synthesis follow-up: a shared truncation helper, an importance-tier single source of truth, and an explicit save/enrichment mode instead of `_source === 'file'` overloading. This iteration maps the concrete callers so those extractions can be sequenced without changing unrelated behavior. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:217-219]

Iteration 10 also flagged these as the remaining shared-helper opportunities after the D1-D8 root-cause pass. The goal here is not another diagnosis pass, but a safe dependency map: which callsites need to move together, which ones are only propagators or reviewers, and which truncation hits are out-of-scope because they are structural slices rather than user-visible text shaping. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-010.md:21-29]

## Approach
- Re-read Gen-2 scope and the canonical synthesis anchors for the three shared-helper candidates. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/deep-research-strategy.md:173-210]
- Searched the live `scripts/` tree for substring/slice truncation patterns and then filtered out array caps, hash digests, and protocol parsing.
- Mapped every `importance_tier` / `importanceTier` read-write site, separating writers from propagators and reviewers.
- Mapped every `_source === 'file'`, `_source !== 'file'`, `_sourceSessionId`, and `_sourceTranscriptPath` usage in the workflow path.
- Cross-checked each shared-helper candidate against the earlier D1/D4/D7 defect owners so the refactor plan stays aligned with proven root causes. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:48-63]

## Target 1: Unified truncation helper
| Callsite | File:lines | Current pattern | Limit (chars) | Callers upstream |
|----------|-----------|-----------------|---------------|------------------|
| `buildSessionSummaryObservation()` title | `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:274-277` | `summary.substring(0, 100).replace(/\\s+\\S*$/, '') + '...'` | 100 | `normalizeInputData()` slow path when `sessionSummary` is present [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:668-674] |
| `buildSessionSummaryObservation()` narrative | `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:279-283` | `summary.substring(0, 500).replace(/\\s+\\S*$/, '') + '...'` | 500 | `normalizeInputData()` slow path when `sessionSummary` is present [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:668-674] |
| `collectSessionData()` overview summary | `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:875-881` | `data.sessionSummary.substring(0, 500)` | 500 | `runWorkflow()` session-data collection path [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:588-647] |
| `extractSentenceAroundCue()` | `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:120-135` | `sentence.slice(0, 200)` | 200 | `buildLexicalDecisionObservations()` -> `extractDecisions()` [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:152-175,381-388] |
| Manual-decision default option description | `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:270-274` | `title.length > 200 ? title.substring(0, 197) + '...' : title` | 200 | `extractDecisions()` manual-decision mapping branch [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:182-361] |
| Manual-decision context snippet | `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:329-332` | `` `${title} — ${rationaleFromInput.substring(0, 120)}` `` | 120 | `extractDecisions()` manual-decision mapping branch [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:182-361] |
| Observation fallback option description | `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:429-436` | `narrative.substring(0, 200)` + last-space trim | 200 | `extractDecisions()` observation/lexical fallback branch [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:386-456] |
| Observation fallback rationale | `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:454-455` | `narrative.substring(0, 200)` | 200 | `extractDecisions()` observation/lexical fallback branch [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:449-455] |

Proposed shared helper signature:
```typescript
export function truncateOnWordBoundary(text: string, limit: number, opts?: { ellipsis?: string }): string
```
Migration impact: 8 callsites to update in live source, concentrated in `input-normalizer.ts`, `collect-session-data.ts`, and `decision-extractor.ts`. Risk: a few callers rely on exact width budgets for short labels (`120`, `200`), so the helper should keep opt-in ellipsis behavior and avoid changing structural/non-narrative slices.

## Target 2: Importance-tier SSOT
| Writer | File:lines | Trigger | Value source |
|--------|-----------|---------|--------------|
| Initial render path | `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:883-885,894-1064`; `.opencode/skill/system-spec-kit/templates/context_template.md:1-10` | on every save before template render | explicit JSON `importanceTier` / `importance_tier`, else resolved tier from `resolveImportanceTier(...)` in session extraction [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:607-612] |
| Managed frontmatter migration | `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1112-1183` | post-render migration / managed-frontmatter rewrite | `inferImportanceTier(content, existingTier, classification)` derived from rendered content + existing tier + classification |

Divergence cause: the initial render path emits one tier into the template, but `frontmatter-migration.ts` later re-infers and rewrites only managed frontmatter keys, leaving the bottom metadata block on the older rendered value. The propagators (`input-normalizer.ts`, `workflow.ts`) and the reviewer (`post-save-review.ts`) do not create the mismatch; they only move or observe the tier value. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:551-555,755-758; .opencode/skill/system-spec-kit/scripts/core/workflow.ts:624-635; .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:279-289]

Proposed SSOT: make the session-extractor tier resolver authoritative, have both initial render and migration read from that one function, and either rewrite both the top frontmatter and bottom metadata block together or stop post-render tier mutation entirely. Migration impact: 6 callsites across normalizer propagation, workflow projection, session-data extraction, template render, frontmatter migration, and reviewer assertions.

## Target 3: Enrichment-mode flag
| Reference | File:lines | Current check | What it controls |
|-----------|-----------|---------------|------------------|
| `enrichCapturedSessionData()` early return | `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:453-460` | `_source === 'file'` | skips spec-folder and git enrichment for JSON/file-backed saves |
| `runWorkflow()` captured-session gate | `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:654-659` | `_source !== 'file' && _isSimulation !== true` | alignment checks and later enrichment branch selection |
| Session-status heuristic | `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:361-388` | `_source === 'file'` | treats explicit JSON payloads with summary + decisions/next steps as complete |
| Completion-percent heuristic | `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:475-482` | `_source === 'file'` | short-circuits JSON-mode completion to `95%` when summary exists |
| Source metadata passthrough | `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:836-847` | `_sourceTranscriptPath` / `_sourceSessionId` presence | emits persisted source-session metadata into rendered memory data |
| Reviewer mode gate | `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:220-226` | `_source && _source !== 'file'` | only runs captured-session related-content checks outside JSON mode |
| Normalizer metadata copy | `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1434-1443` | `_sourceTranscriptPath` / `_sourceSessionId` fields | preserves source-session metadata during normalization |

Proposed enum-based replacement:
```typescript
type SaveMode = 'json' | 'capture';
```
Migration impact: 7 callsites. Risk: downstream consumers may still read `_source` as both provenance and mode, so `SaveMode` should become the only branching input while `_source` remains plain provenance metadata.

## Extraction ordering (safe-refactor dependency DAG)
1. Extract `SaveMode` as a leaf helper / field and backfill it from existing `_source` values without changing behavior yet.
2. Extract `truncateOnWordBoundary()` and first migrate the already boundary-aware `buildSessionSummaryObservation()` callsites, then the D1 owner in `collect-session-data.ts`, then the D2 decision snippets.
3. Promote one authoritative importance-tier resolver (reuse/extract from `session-extractor.ts`) and make initial render read it.
4. Switch `frontmatter-migration.ts` to the same tier resolver and update the bottom metadata block in the same pass.
5. Flip `workflow.ts`, `collect-session-data.ts`, and `post-save-review.ts` from `_source` checks to `SaveMode`, leaving `_sourceTranscriptPath` / `_sourceSessionId` as metadata only.

## Findings
1. The repo already contains one boundary-aware narrative truncator (`buildSessionSummaryObservation()`), but D1 still bypasses it with a raw `substring(0, 500)` in `collect-session-data.ts`; the shared helper can therefore start as an extraction, not a brand-new design. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:274-283; .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:875-881]
2. The decision path is the densest truncation cluster: five user-visible truncation callsites live under `extractDecisions()` and its lexical helper, which makes D2/D1 truncation work mostly a two-file refactor (`decision-extractor.ts` + `collect-session-data.ts`) plus reuse in `input-normalizer.ts`. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:120-135,182-185,270-274,329-332,381-455]
3. D4 drift is a true multi-writer problem, but only two writers matter: initial render and managed-frontmatter migration. The rest of the `importanceTier` surface is propagation (`input-normalizer.ts`, `workflow.ts`) or detection (`post-save-review.ts`). [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:883-885,894-1064; .opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1112-1183; .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:279-289]
4. `_source` is currently overloaded across three concerns at once: enrichment eligibility, JSON-mode completion heuristics, and source-session metadata persistence. That is why a `SaveMode` enum is safer than another `_source === 'file'` patch. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:453-460,654-659; .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:361-388,475-482,836-847]
5. `post-save-review.ts` is already the guardrail consumer for both D4 mismatch detection and `_source`-based captured-session checks, so it should migrate last after the SSOT and `SaveMode` extractions land. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:220-226,279-289]
6. The target surface is smaller than a raw grep suggests because many `slice(0, N)` hits are structural caps or protocol parsing, not user-visible text truncation. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:131-133; .opencode/skill/system-spec-kit/scripts/lib/anchor-generator.ts:68; .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:531]
7. Diagnostic truncations in reviewer/help text (`post-save-review.ts`) should stay out of the shared helper unless the team explicitly widens scope from persisted artifact text to human-facing warnings. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:240,340]

## Ruled out / not reproducible
- Structural `slice(0, N)` usages for array caps, hashes, or git status parsing are not shared-helper candidates for Q14. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:131-133; .opencode/skill/system-spec-kit/scripts/lib/anchor-generator.ts:68; .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:531]
- I found no third writer that independently mutates the rendered tier after save; outside the initial render and `frontmatter-migration.ts`, the remaining `importanceTier` sites only propagate or inspect the value. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:551-555,755-758; .opencode/skill/system-spec-kit/scripts/core/workflow.ts:624-635; .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:279-289]

## New questions raised
- Should `SaveMode` live on `RawInputData` / `CollectedDataFull`, or be derived once in `workflow.ts` to avoid schema churn in saved payload fixtures?
- Should the bottom metadata block remain template-owned, or should managed-frontmatter migration become responsible for rewriting both tier locations atomically?
- Do the decision-extractor short limits (`120`, `200`) need one generic helper, or a helper plus named wrappers for title/context/rationale budgets to preserve reviewable intent?

## Next focus recommendation
Iteration 18 should execute Q15 (D7 provenance <=10-line patch design). See strategy §14.
