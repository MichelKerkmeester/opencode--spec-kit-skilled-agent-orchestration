# Iteration 5: Q4 D1-D8 remediation landing status

## Focus

Audit **Q4**: for each D1-D8 memory-quality remediation slice, determine whether the fix landed in live runtime code, only in reviewer/tests/docs, or remains partial because of schema drift, enum drift, or split heuristics. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:96-107`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/research/002-continuity-memory-runtime-pt-01/iterations/iteration-004.md:60-67`]

## Actions Taken

1. Read the parent `002-memory-quality-remediation` packet plus child phase specs `001` through `010` to map each D-slice to its documented remediation and regression surface. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:96-107`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/010-memory-save-heuristic-calibration/spec.md:83-111`]
2. Read the active research packet state and prior iteration narrative to confirm the session lineage, Q4 target, and expected output surfaces. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/research/002-continuity-memory-runtime-pt-01/deep-research-state.jsonl:1-13`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/research/002-continuity-memory-runtime-pt-01/iterations/iteration-004.md:58-67`]
3. Read the live owner files for D1/D3/D4/D5 and the follow-on calibration work: `truncate-on-word-boundary.ts`, `trigger-phrase-sanitizer.ts`, `decision-extractor.ts`, `frontmatter-migration.ts`, `workflow.ts`, and `find-predecessor-memory.ts`. [SOURCE: `.opencode/skill/system-spec-kit/scripts/lib/truncate-on-word-boundary.ts:14-47`] [SOURCE: `.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts:128-236`] [SOURCE: `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1124-1208`] [SOURCE: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1265-1304`] [SOURCE: `.opencode/skill/system-spec-kit/scripts/core/find-predecessor-memory.ts:15-18,170-183,257-260`]
4. Read the reviewer and validator surfaces to distinguish prevention-at-write-time from post-write detection: `post-save-review.ts`, `validate-memory-quality.ts`, `save-mode.ts`, `content-router.ts`, and `session-extractor.ts`. [SOURCE: `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:844-987,1032-1086`] [SOURCE: `.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:144-170`] [SOURCE: `.opencode/skill/system-spec-kit/scripts/types/save-mode.ts:10-71`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:58,144`] [SOURCE: `.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:93-107`]

## Findings

| D{N} | Target defect | Documented remediation | Code enforcer file:line (or "reviewer-only"/"doc-only") | Reviewer coverage | Regression test | Landing verdict |
| --- | --- | --- | --- | --- | --- | --- |
| D1 | OVERVIEW truncates mid-word | Shared `truncateOnWordBoundary()` + OVERVIEW callsite migration | `scripts/lib/truncate-on-word-boundary.ts:14-47` | `post-save-review.ts:844-872` | `truncate-on-word-boundary.vitest.ts`, `memory-quality-phase1.vitest.ts`, F-AC1 | **live** |
| D2 | Lexical placeholders outrank authored decisions | Validate authored `keyDecisions`, keep lexical fallback only for degraded payloads | `scripts/extractors/decision-extractor.ts:224-242,249-267` | `post-save-review.ts:872-883` | Phase 3 F-AC2 + degraded-payload regression | **live** |
| D3 | Garbage trigger phrases / synthetic topic noise | Narrow sanitizer + manual/extracted split + dedupe | `scripts/lib/trigger-phrase-sanitizer.ts:128-236` | `post-save-review.ts:883-899` | Phase 3 F-AC3 | **live** |
| D4 | `importance_tier` drift between frontmatter and metadata block | Resolve once, sync both rendered locations, review any drift | `scripts/lib/frontmatter-migration.ts:1124-1189` | `post-save-review.ts:900-910` | Phase 2 F-AC4 | **partial** |
| D5 | Missing / inconsistent continuation `supersedes` | Auto-link predecessor for JSON saves + reviewer D5 check | `scripts/core/workflow.ts:1275-1304`; `scripts/core/find-predecessor-memory.ts:15-18,170-183,257-260` | `post-save-review.ts:911-983` | Phase 4 F-AC5 + Phase 10 D5 lane | **partial / drift** |
| D6 | Duplicate trigger phrases | Sanitizer-level dedupe plus reviewer duplicate detection | `scripts/lib/trigger-phrase-sanitizer.ts:187-236` | `post-save-review.ts:922-947` | `post-save-review.vitest.ts` + Phase 9/10 save-path regressions | **live** |
| D7 | Empty git provenance on JSON saves | Provenance-only extraction without capture-path contamination | `scripts/extractors/session-extractor.ts:93-107` (upstream provenance capture; downstream write surface remains split) | `post-save-review.ts:947-967` | Phase 2 F-AC6 | **partial** |
| D8 | OVERVIEW anchor mismatch | Align template contract, parser compatibility, and reviewer anchor check | `shared/parsing/memory-template-contract.ts:51`; `mcp_server/lib/parsing/memory-parser.ts:526` | `post-save-review.ts:969-987` | `memory-quality-phase1.vitest.ts`, F-AC7 | **live** |

### P1

- `FIND-iter005-d4-metadata-block-sync-noops-when-fence-missing`  
  D4 is live for normal packet-generated saves, but the migration helper still assumes an existing `## MEMORY METADATA` fenced YAML block. `mutateMemoryMetadataBlock()` only runs a regex replacement over an existing block and never synthesizes a missing one, so malformed or partially migrated files can still keep top-level/frontmatter fixes without repairing the bottom metadata surface. That makes the D4 slice **schema-fragile rather than universally self-healing**. [SOURCE: `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1142-1151`] [SOURCE: `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1186-1208`]

- `FIND-iter005-d5-linker-and-reviewer-still-do-not-share-the-full-contract`  
  The D5 write-path and the D5 reviewer now share the lexical continuation patterns, but they still do **not** enforce the same full eligibility contract. The linker can select a predecessor via exact source-session match, explicit continuation marker, or `>=50%` title-family overlap, while reviewer D5 only flags emptiness when `detectContinuationPattern(savedTitle|savedDescription)` fires and `supersedes` is still empty. That leaves a residual **heuristic drift** between "should auto-link" and "should warn." [SOURCE: `.opencode/skill/system-spec-kit/scripts/core/find-predecessor-memory.ts:170-183,224-255`] [SOURCE: `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:630,911-983`]

### P2

- `FIND-iter005-save-mode-name-collision-crosses-runtime-layers`  
  The script-side runtime uses `SaveMode = json | capture | manual-file`, but the MCP router independently defines `SaveMode = auto | interactive | dry-run | natural | route-as`. `memory-save.ts` passes `routeAs` / `mergeModeHint` through the routing layer without any shared bridging type, so the repo currently carries **two unrelated enums with the same name**. That is not a live crash in this sweep, but it is an **enum-name drift hazard** for documentation, tests, and future refactors. [SOURCE: `.opencode/skill/system-spec-kit/scripts/types/save-mode.ts:10-71`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:58,144`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1342-1365`]

- `FIND-iter005-d7-provenance-landing-is-real-but-the-writer-surface-is-split`  
  D7 is not doc-only: the remediation is clearly live because the reviewer now treats missing `head_ref` / `commit_ref` as a dedicated defect class, and the session/git extraction path is live. But unlike D1-D5 and D8, the provenance write path is **not co-located in one obvious serializer surface** from this sweep; it is distributed across session/git extraction and later rendering/review. That makes D7 harder to audit and easier to let drift silently than the other slices. [SOURCE: `.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:93-107`] [SOURCE: `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:947-967`]

- `FIND-iter005-shared-truncation-helper-migration-remains-localized`  
  D1 landed for the OVERVIEW path and the later decision-extractor follow-on, but the shared truncation cleanup is still incomplete repo-wide. `input-normalizer.ts` still has raw `substring()` truncation on derived decision titles and descriptions, so the "use the shared helper everywhere" story remains **localized to the packet-owned surfaces**, not universal. That does not reopen D1 itself, but it is a remaining correctness-debt seam inside the same runtime family. [SOURCE: `.opencode/skill/system-spec-kit/scripts/lib/truncate-on-word-boundary.ts:14-47`] [SOURCE: `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:333-338,1256-1283`] [SOURCE: `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:224-267`]

## Questions Answered

Q4 is **fully answered**.

1. **None of D1-D8 are doc-only anymore.** Every slice has a live runtime owner or follow-on runtime owner in the current save path.
2. **D1, D2, D3, D6, and D8 are live** in write-time/runtime code and also have reviewer coverage.
3. **D4, D5, and D7 are only partially clean**: D4 depends on the metadata block shape existing, D5 still splits reviewer/linker heuristics, and D7 is live but spread across multiple surfaces instead of one obvious serializer contract.
4. **The remaining drift is mostly schema/enum/contract drift**, not "tests only" drift: missing metadata-block synthesis, split continuation heuristics, and the duplicate `SaveMode` name across script runtime vs MCP router.

## Questions Remaining (Q5-Q7)

1. **Q5** — cache-warning hook transcript identity, stop-hook replay coverage, and any remaining last-writer-wins paths.
2. **Q6** — reducer / state rehydration schema agreement, especially after the packet-local reducer path drift from iteration 1.
3. **Q7** — documented JSONL audit event taxonomy versus what the live emitters actually append.

## Next Focus

Move to **Q5**: inspect cache-warning hooks, stop-hook transcript identity, replay coverage, and any remaining cross-process or last-writer-wins state hazards in the continuity runtime.
