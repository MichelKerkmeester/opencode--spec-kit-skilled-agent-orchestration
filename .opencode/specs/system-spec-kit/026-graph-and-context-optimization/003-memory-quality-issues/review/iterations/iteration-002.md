# Review Iteration 2: D2 Security — Phase 2 (metadata+provenance) + Phase 3 (sanitization+precedence)

## Focus

Security audit of Phase 2 (002-single-owner-metadata, D4+D7) and Phase 3 (003-sanitization-precedence, D3+D2) remediations against the narrowed trust-boundary claims.

## Scope

- Review target: Phase 2 (5 artifacts) + Phase 3 (5 artifacts) + targeted code verification
- Dimension: security

## Reviewer Backend

- **cli-codex** `/opt/homebrew/bin/codex exec` (direct homebrew binary)
- Model: `gpt-5.4`, reasoning_effort=`high`, service_tier=`fast`, sandbox=`read-only`
- Elapsed: 181 s

## Scorecard

| File | Sec |
|------|-----|
| 002/spec.md | pass |
| 002/plan.md | pass |
| 002/tasks.md | pass |
| 002/checklist.md | pass |
| 002/implementation-summary.md | pass |
| 003/spec.md | partial |
| 003/plan.md | partial |
| 003/tasks.md | partial |
| 003/checklist.md | **FAIL** |
| 003/implementation-summary.md | partial |
| scripts/core/workflow.ts | **FAIL** |
| scripts/extractors/decision-extractor.ts | **FAIL** |
| scripts/lib/trigger-phrase-sanitizer.ts | partial |

## Findings

### P1-002: Post-sanitization folder anchor bypass reintroduces unsanitized trigger phrases

- **Dimension**: security
- **Severity**: P1
- **File**: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1358`
- **Evidence**: `sanitizeTriggerPhrases(mergedTriggers)` runs first at line 1315, but line 1359 then appends `leafFolderAnchor.toLowerCase()` directly to `preExtractedTriggers` afterward.
- **Impact**: A path-derived trigger can bypass the PR-5 sanitization contract and still be persisted/indexed, weakening the guarantee that untrusted folder-derived phrases are filtered before save.
- **Hunter**: Checked whether every trigger source passed through the sanitizer before persistence.
- **Skeptic**: `leafFolderAnchor` is derived from trimmed folder segments and screened with stopword/coverage checks, so many bad values are reduced before append.
- **Referee**: Still a real bypass — the appended value never re-enters `sanitizeTriggerPhrases()`, and folder names remain untrusted input under the Phase 3 threat model.
- **Recommendation**: Append the leaf anchor before `sanitizeTriggerPhrases()`, or run the appended anchor through the same sanitizer/filter chain before persistence.
- **Final severity**: P1
- **Confidence**: 0.91

```json
{"type":"claim-adjudication","claim":"workflow.ts appends leafFolderAnchor to preExtractedTriggers after sanitizeTriggerPhrases has already run, bypassing PR-5 sanitization for folder-derived trigger phrases.","evidenceRefs":[".opencode/skill/system-spec-kit/scripts/core/workflow.ts:1315",".opencode/skill/system-spec-kit/scripts/core/workflow.ts:1358"],"counterevidenceSought":"Checked whether leafFolderAnchor is re-sanitized downstream before persistence; checked whether folder-anchor construction already applies the full sanitizer chain. Neither holds.","alternativeExplanation":"The stopword/coverage screen applied to leafFolderAnchor may catch most hostile folder names. Rejected because the Phase 3 threat model explicitly lists folder-derived tokens as untrusted and does not carve out an exception.","finalSeverity":"P1","confidence":0.91,"downgradeTrigger":"Evidence that leafFolderAnchor passes through sanitizeTriggerPhrases at a later persistence step, or a Phase 3 spec revision narrowing the sanitization contract to non-folder sources."}
```

### P1-003: Raw `keyDecisions` entries gain authority without validation or trust gating

- **Dimension**: security
- **Severity**: P1
- **File**: `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:205`
- **Evidence**: Lines 205-211 treat any `collectedData.keyDecisions` array as `manualDecisionInputs`; line 234 falls back to `JSON.stringify(manualObj)` when `decision/title` is missing; lines 408-412 suppress lexical fallback whenever `rawKeyDecisions.length > 0`.
- **Impact**: A crafted payload can inject arbitrary decision text or suppress safer lexical recovery just by supplying a non-empty raw array, which expands the trust boundary beyond reviewed/authored decision content.
- **Hunter**: Looked for input validation and confidence checks before the PR-6 precedence gate made raw arrays authoritative.
- **Skeptic**: The phase intentionally treats authored arrays as authoritative, and normal callers may provide trusted first-party JSON.
- **Referee**: Even with that intent, the code has no validation or provenance check before elevating raw arrays, and the `JSON.stringify(...)` fallback turns malformed objects into persisted decision text.
- **Recommendation**: Validate raw decision entries before precedence takes effect, reject opaque objects without `decision/title`, cap text size, and only suppress lexical fallback when at least one valid authored decision survives validation.
- **Final severity**: P1
- **Confidence**: 0.88

```json
{"type":"claim-adjudication","claim":"decision-extractor.ts grants full authority to any non-empty raw keyDecisions array without validation, and JSON.stringify-fallbacks malformed entries into persisted decision text.","evidenceRefs":[".opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:205",".opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:234",".opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:408"],"counterevidenceSought":"Checked for confidence/provenance check before precedence gate; checked whether an upstream caller sanitizes keyDecisions array. Neither holds.","alternativeExplanation":"Callers are trusted first-party JSON sources, so validation would be redundant. Rejected because the PR-6 plan does not document the caller contract and the code path is reachable from untrusted input surfaces.","finalSeverity":"P1","confidence":0.88,"downgradeTrigger":"Evidence of an upstream validator on keyDecisions before decision-extractor runs, or a documented PR-6 caller-trust contract."}
```

### P2-003: Trigger sanitizer lacks generic hostile-token guards

- **Dimension**: security
- **Severity**: P2
- **File**: `.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts:22`
- **Evidence**: The sanitizer only checks path fragments, slug/prefix patterns, stopwords, and fixed bigrams; there is no length cap, control-character rejection, or Unicode normalization.
- **Impact**: Oversized or control-character-bearing phrases that miss the empirical junk classes can still flow toward persisted frontmatter/index content.
- **Recommendation**: Add a generic prefilter layer for max length, control/binary rejection, and Unicode normalization before the category-specific rules.
- **Final severity**: P2

## Cross-Reference Results

### Core Protocols

- **spec_code** — partial: code preserves the intended narrowed rollout, but does not fully honor the "sanitize before persistence" and "authored but safe" trust-boundary expectations.
- **checklist_evidence** — **fail**: Phase 3 checklist claims no junk or placeholder promotion risk, but does not catch the post-sanitization append (P1-002) or the raw-array authority gap (P1-003).

### Overlay Protocols

- Not evaluated this iteration.

## Ruled Out

- **Provenance-only JSON enrichment leaking summary/observation content** — `workflow.ts:940-947` copies only `headRef`, `commitRef`, `repositoryState`, and `isDetachedHead`. PR-4 narrowing held.
- **PR-6 fully disabling degraded fallback** — `decision-extractor.ts:408-412` still permits lexical fallback when observations, processed manual decisions, and raw key-decision arrays are all absent. Degraded-payload path intact.
- **D4 single-owner importance_tier bypass** — Phase 2 metadata-owner plan holds; single-owner contract is honored in `memory-metadata.ts`.

## Sources Reviewed

- Phase 2: spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md
- Phase 3: spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md
- `.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts`
- `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts`
- `.opencode/skill/system-spec-kit/scripts/core/workflow.ts`

## Assessment

- Confirmed findings: 3
- New findings ratio: 1.00
- noveltyJustification: All 3 findings are new to the security dimension and distinct from iteration 1's correctness findings.
- Dimensions addressed: security
- Verdict this iteration: CONDITIONAL (2 P1, 1 P2, no P0)
- Cumulative: P0=0 P1=3 P2=3

## Reflection

- **What worked**: Codex correctly identified two real P1s by cross-referencing the spec's trust-boundary claims against workflow.ts and decision-extractor.ts. The skeptic passes were honest (acknowledged legitimate caller-trust scenarios before confirming).
- **What failed**: Nothing this iteration.
- **Next adjustment**: Iteration 3 (D3 Traceability) should cross-reference parent checklist.md with all 7 phase-local checklists and implementation-summaries, focusing on CHK ID coverage and D1-D8 → phase → PR mapping integrity.
