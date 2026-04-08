# Review Iteration 5: D5 Performance — Phase 4 heuristics + post-save reviewer overhead

## Focus

Performance audit of Phase 4 (heuristics + SaveMode + post-save reviewer) and the truncation helper hot path. Verify Phase 4's narrowed design claims and check the post-save reviewer's critical-path cost.

## Scope

- Review target: Phase 4 (4 artifacts) + Phase 1 plan + Phase 5 telemetry-catalog + code
- Dimension: performance

## Reviewer Backend

- **cli-codex** `/opt/homebrew/bin/codex exec`
- Model: `gpt-5.4`, reasoning=`high`, service_tier=`fast`, sandbox=`read-only`
- Elapsed: 219 s (13 files read including workflow.ts, post-save-review.ts, find-predecessor-memory.ts, save-mode.ts, memory-telemetry.ts, collect-session-data.ts)

## Findings

### P1-008: Post-save review re-reads and reparses the just-written file on every JSON save

- **Dimension**: performance
- **Severity**: P1
- **File**: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1897` and `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:558`
- **Evidence**: `workflow.ts` invokes `reviewPostSaveQuality()` immediately after write and measures it inside M9; `post-save-review.ts` then does `fs.readFileSync(savedFilePath, 'utf8')` and runs multiple whole-file passes (`parseFrontmatter`, `parseFrontmatterArray`, `extractSection`, `extractMemoryMetadataYaml`, `extractLastContextLines`).
- **Impact**: Every JSON save pays an extra synchronous disk read plus repeated O(file_size) scans, even though the rendered markdown is already in memory in `files[ctxFilename]`. This makes PR-9 overhead part of the critical path by construction and raises the chance that M9 p95 drift shows up under larger memories or slower filesystems.
- **Hunter**: The hot path contains avoidable sync I/O and repeated full-string parsing.
- **Skeptic**: On small local files this may stay below the 500 ms warning threshold.
- **Referee**: Still a valid P1 because the design measures this path with M9 on every eligible save, so unconditional reread/reparse is exactly the kind of cost that should be eliminated rather than merely observed.
- **Recommendation**: Pass rendered content into the reviewer directly and collapse the parsing into a single extraction pass or cached parse object.
- **Final severity**: P1
- **Confidence**: 0.92

```json
{"type":"claim-adjudication","claim":"post-save-review.ts re-reads the just-written file via fs.readFileSync and runs multiple whole-file parse passes on every JSON save, even though the rendered markdown is already in memory in workflow.ts files[ctxFilename]. The critical path carries avoidable sync I/O + repeated O(n) parsing that is measured by M9.","evidenceRefs":[".opencode/skill/system-spec-kit/scripts/core/workflow.ts:1897",".opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:558"],"counterevidenceSought":"Checked whether the reviewer is called asynchronously or off the critical path. It is synchronous and measured in M9. Checked whether the rendered content is discarded before reviewer call — it is still in memory.","alternativeExplanation":"On small local files the overhead is negligible. Rejected because M9 p95 threshold is 500 ms and any filesystem slowdown or memory-file growth compounds the unnecessary cost.","finalSeverity":"P1","confidence":0.92,"downgradeTrigger":"Measurement showing M9 p95 steady-state well below 500 ms at 2x current memory sizes, OR reviewer refactored to accept in-memory content and use a single-pass parse."}
```

### P2-007: PR-7's qualifying-save gate is broader than the spec's JSON-mode intent

- **Dimension**: performance
- **Severity**: P2
- **File**: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1386`
- **Evidence**: The spec frames D5 as a "JSON-mode workflow" pre-render discovery step and says the narrowed design stays cheap when it runs "only on qualifying saves" (`004-heuristics-refactor-guardrails/spec.md:83`); the implementation calls `findPredecessorMemory()` whenever `existingSupersedes.length === 0`, and `find-predecessor-memory.ts:149` only gates on existing supersedes plus continuation signal.
- **Impact**: Manual or capture-adjacent saves with continuation-like titles can still pay the directory walk and header-read cost, which broadens the hot path beyond the packet's stated scope.
- **Recommendation**: Add an explicit `SaveMode.Json` gate before importing/running predecessor discovery so the scan only happens on the intended save path.
- **Final severity**: P2

## Cross-Reference Results

### Core Protocols

- **spec_code** — partial: PR-7 does stay one-pass with bounded header reads, but the shipped code misses the spec's JSON-only gate and PR-9 adds avoidable reread/reparse work on the measured save path.
- **checklist_evidence** — partial: T404/T405 and M9's `p95 > 500 ms` threshold are defined, but the reviewed packet still treats performance-envelope proof as a separate closeout item rather than showing measured closure in the shipped artifact.

## Ruled Out

- **Truncation helper constant-time claim** — `truncate-on-word-boundary.ts:6` is linear in the bounded `limit` slice, not the full input; no false constant-time claim in Phase 1 docs.
- **PR-7 predecessor helper is single-pass** — genuinely single-pass over sibling `.md` files with a 2048-byte header read, not pairwise or rescan.
- **Telemetry emission cost** — `memory-telemetry.ts:25` is lightweight structured logging; the overhead is in the reviewer work being on the critical path, not the metric call wrappers.

## Sources Reviewed

- Phase 4: spec.md, plan.md, tasks.md, implementation-summary.md
- Phase 1: plan.md
- Phase 5: telemetry-catalog.md
- Code: workflow.ts, post-save-review.ts, truncate-on-word-boundary.ts, find-predecessor-memory.ts, collect-session-data.ts, save-mode.ts, memory-telemetry.ts

## Assessment

- Confirmed findings: 2
- New findings ratio: 0.15
- noveltyJustification: Surfaced one hot-path cost issue and one qualifying-gate leak that were not covered by earlier correctness/security/traceability/maintainability passes.
- Dimensions addressed: performance
- Verdict this iteration: CONDITIONAL (1 P1, 1 P2, no P0)
- Cumulative: P0=0 P1=8 P2=7
