# Iteration 21: Latent Failure Mode Audit (Q18)

## Focus
Generation 3 exists to answer the question Gen-1 and Gen-2 explicitly left open: whether the JSON-mode save path still hides "unknown unknowns" after the D1-D8 root-cause map and the 9-PR rollout train were locked. That matters because a latent swallow or empty-default path can survive a defect-driven remediation program if it never manifests in the seven-file sample corpus that drove the original investigation. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/deep-research-strategy.md:217-246]

Appendix B already decomposes the confirmed work into safe landing slices, so this pass is not re-litigating D1-D8. It is stress-testing the pipeline assumptions behind that train by auditing every visible `try`/`catch`, silent sentinel, null-input guard, and empty-default path in the JSON-mode generator/workflow/extractor stack. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:184-191]

## Approach
- Read the Gen-3 scope lock in strategy section 15, the canonical D1-D8 catalog in research section 4, and iteration 020 as the output-format baseline.
- Swept the live script tree for `catch`, `return null`, `return []`, `return ''`, `??`, `|| []`, `|| ''`, and null-guard early returns across `memory/`, `extractors/`, `core/workflow.ts`, `lib/`, and `utils/input-normalizer.ts`.
- Re-read the hot ranges in `generate-context.ts`, `workflow.ts`, `decision-extractor.ts`, `conversation-extractor.ts`, `git-context-extractor.ts`, `semantic-signal-extractor.ts`, and `input-normalizer.ts`.
- Mapped each fallback to one of three buckets: already explained by D1-D8, benign/intentional degradation, or a non-overlapping D9+ candidate.
- Treated capture-mode-only branches as out of scope unless the current JSON-mode path can actually execute them.

## Try/catch inventory (by file)
| File | Line | Pattern | Caught error becomes... | Classification |
|------|------|---------|-------------------------|----------------|
| memory/generate-context.ts | 142-145 | `catch (_err) { lockReleaseFailed = true }` | signal shutdown exits `1` instead of pretending cleanup succeeded | BENIGN [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:137-149] |
| memory/generate-context.ts | 330-334 | `catch (error) { throw new Error(...) }` | explicit CLI validation failure | BENIGN [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:324-339] |
| core/workflow.ts | 205-210 | `tryImportMcpApi(...){ ... return null; }` | optional MCP-backed features are skipped after a warning | BENIGN [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:205-210] |
| core/workflow.ts | 230-243 | `loadWorkflowRetryManagerModule(){ ... return FALLBACK_RETRY_MANAGER; }` | retry stats/queue handling degrade to zeroed no-op adapter | BENIGN [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:229-243] |
| core/workflow.ts | 367-415 | stale-lock catch + lock-acquire catch/timeout | workflow proceeds without cross-process filesystem locking | D9 CANDIDATE [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:366-415] |
| core/workflow.ts | 418-423 | `catch (_err) {}` around lock release | cleanup signal is lost, but main workflow continues | BENIGN [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:418-423] |
| core/workflow.ts | 466-475 | `.catch(...){ return null; }` for spec/git enrichment | enrichment silently degrades to "no extra context" | KNOWN (D7-adjacent, but capture-mode only) [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:453-475] |
| extractors/git-context-extractor.ts | 99-104 | `tryRunGitCommand(){ ... return null; }` | git command failures become unavailable provenance | BENIGN [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:91-104] |

## Silent-swallow inventory
| File | Line | Pattern | Lost signal | Classification |
|------|------|---------|-------------|----------------|
| memory/generate-context.ts | 301-309 | `return null` from `extractPayloadSpecFolder()` | payload-level spec-folder hint disappears; caller later hard-fails if no other target exists | BENIGN [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:301-309] |
| core/workflow.ts | 458-459 | `if (collectedData._source === 'file') return collectedData` | JSON mode skips the only enrichment path that would add git/spec context | KNOWN (D7) [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:453-459] |
| semantic-signal-extractor.ts | 249-255 | `if (topPhrases.length < minPhraseCount) return deduplicated ...` | tech-stopword filter is bypassed and lower-quality phrases can re-enter output | KNOWN (D3-adjacent) [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts:243-255] |
| semantic-signal-extractor.ts | 261-263 | `if (filteredTokens.length === 0) return []` | caller receives zero topics from an empty filtered stream | BENIGN [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts:260-263] |
| semantic-signal-extractor.ts | 304-320 | short/placeholder guard returns empty signal bundle | caller sees no semantic phrases/topics for tiny or placeholder text | BENIGN [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts:304-320] |
| extractors/git-context-extractor.ts | 73-85, 99-104 | `emptyResult()` + `catch { return null; }` | provenance collapses to `repositoryState: "unavailable"` instead of hard-failing | BENIGN [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:73-85] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:99-104] |
| utils/input-normalizer.ts | 738-745 | `sessionSummary || 'Manual context save'` | synthetic prompt/recentContext become generic when the payload has no narrative text | BENIGN [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:737-745] |

## Null-check / early-return inventory
| File | Line | Guard | Fallback path | Classification |
|------|------|-------|---------------|----------------|
| extractors/conversation-extractor.ts | 133-148 | `if (!collectedData) return ...` | empty conversation packet, zero tools, `FLOW_PATTERN: 'empty'` | BENIGN [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts:130-148] |
| extractors/decision-extractor.ts | 187-190 | `if (!collectedData) return ...` | empty decision set instead of synthetic placeholder data | BENIGN [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:182-190] |
| extractors/decision-extractor.ts | 381-384 | `decisionObservations.length === 0 && processedManualDecisions.length === 0 ? buildLexicalDecisionObservations(...) : []` | lexical placeholder branch activates | KNOWN (D2) [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:379-384] |
| core/workflow.ts | 458-459 | `if (collectedData._source === 'file') return collectedData` | file-backed JSON never reaches captured-session enrichment | KNOWN (D7) [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:453-459] |
| extractors/git-context-extractor.ts | 112-115 | `if (!cleanedPath) return ''` | malformed/blank git path token is dropped | BENIGN [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:110-115] |
| extractors/git-context-extractor.ts | 124-135 | `if (!trimmedLine) return null` | blank git status line is ignored | BENIGN [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:124-135] |
| utils/input-normalizer.ts | 572-584, 676-687 | `if (keyDecisions.length > 0)` normalization gates | raw `keyDecisions` are promoted into `_manualDecisions` and decision observations | BENIGN safeguard; this is not the live D2 owner [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:566-584] [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:676-687] |

## D9+ candidates
### D9 candidate: cross-process lock bypass on degraded filesystem locking
- Symptom: simultaneous `--json` saves can proceed without cross-process serialization, which makes filename collision handling, indexing order, and post-save review timing non-deterministic under concurrent runs.
- Trigger: any owner-file parse/stat failure in stale-lock detection, any unexpected `mkdir` error other than `EEXIST`, or a 30-second lock wait timeout while another process still owns `.workflow-lock`.
- Root cause: `shouldClearStaleWorkflowLock()` converts any exception into `true`, and `acquireFilesystemLock()` converts unexpected lock acquisition failures into "continue without fs lock" instead of fail-fast. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:366-415]
- Risk: MEDIUM
- Proposed remediation sketch: make malformed lock metadata and unexpected non-`EEXIST` lock failures fail closed for JSON-mode runs, or surface an explicit degraded-lock state to the caller instead of silently continuing. Keep the timeout bypass behind a clearly logged, testable opt-in if cross-process concurrency really must proceed.

No D10+ candidates found. Everything else inspected either maps back to the already-confirmed D2/D3/D7 mechanisms or is an intentional empty-data guard that prevents synthetic corruption rather than causing it.

## Findings
1. The only non-overlapping latent failure mode I found is operational, not content-shaping: the workflow can continue without cross-process locking after stale-lock read failures, unexpected `mkdir` errors, or timeout. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:366-415]
2. The captured-session enrichment catches are not a current JSON-mode bug source because file-backed JSON exits that function immediately on `_source === 'file'`; they stay relevant only as a future D7 regression boundary if PR-4 accidentally reuses the captured branch. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:453-459] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:877-923]
3. `decision-extractor.ts` still has exactly one live placeholder-producing fallthrough, and it is the known D2 lexical branch guarded by `decisionObservations.length === 0 && processedManualDecisions.length === 0`. I did not find a second hidden placeholder path. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:379-388]
4. `input-normalizer.ts` already promotes `keyDecisions` into both `_manualDecisions` and synthesized decision observations on fast and slow paths, so the current tree does not hide a second "raw decisions were never propagated" defect behind empty defaults. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:566-584] [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:676-687]
5. `semantic-signal-extractor.ts` contains a quality-degrading fallback that can bypass tech-stopword filtering when phrase count is too low, but the symptom is still the already-known D3 class (low-quality phrases), not a new defect family. [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts:243-255]
6. The null-input returns in `extractConversations()` and `extractDecisions()` are deliberate anti-corruption guards: they now emit empty packets instead of the older synthetic/simulated data paths. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts:130-148] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:182-190]
7. Git-command failures are intentionally collapsed into an explicit `repositoryState: 'unavailable'` shape rather than silently fabricating provenance; combined with the current JSON-mode enrichment bypass, that means no second hidden D7 owner surfaced in this pass. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:73-85] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:99-104] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:453-459]

## Ruled out / not reproducible
- I did not find a second live D2-style placeholder generator beyond the already-known lexical decision fallback. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:379-388]
- I did not find a current JSON-mode path that executes the captured-session enrichment catches; the `_source === 'file'` guard blocks that route today. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:453-459]
- I did not find any evidence that the null-input/empty-array guards in `conversation-extractor.ts`, `decision-extractor.ts`, or `semantic-signal-extractor.ts` create a new user-visible corruption class on their own; they mostly replace older synthetic fallbacks with explicit empties. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts:130-148] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:182-190] [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts:260-320]

## New questions raised
- Should PR-10 harden `withWorkflowRunLock()`/filesystem-lock behavior before the 9-PR content-quality train lands, or is the concurrency risk acceptable as a separate operational follow-up?
- If PR-4 adds provenance-only JSON-mode git extraction, should `tryRunGitCommand()` continue to silently return `null`, or should JSON mode surface a structured degraded-provenance warning when git is present but unreadable?

## Next focus recommendation
Iteration 22 should execute Q19 (PR-7 performance modeling). See strategy §15.
