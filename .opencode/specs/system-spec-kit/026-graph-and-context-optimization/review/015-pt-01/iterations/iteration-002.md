# Iteration 2 - inventory - lib+search

## Dispatcher
- iteration: 2 of 50
- dispatcher: cli-copilot gpt-5.4 high (code review v1)
- timestamp: 2026-04-16T05:20:37Z

## Files Reviewed
- .opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/continuity/thin-continuity-record.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts
- .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-integration.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/thin-continuity-record.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/archive/coverage-graph-db.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/archive/coverage-graph-tools.vitest.ts

## Findings - New
### P0 Findings
- None.

### P1 Findings
#### P1-001 [P1] Graph-metadata key file extraction accepts absolute paths and then indexes them verbatim
- **File:** `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:395-438` (`keepKeyFile`), `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:562-632` (`buildKeyFileLookupPaths` / `resolveKeyFileCandidate`), `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1021-1044` (`graphMetadataToIndexableText`)
- **Evidence:** `keepKeyFile()` rejects `../` and command-like noise, but never rejects absolute paths. `buildKeyFileLookupPaths()` explicitly treats an absolute candidate as valid input (`path.isAbsolute(candidate)`), and `resolveKeyFileCandidate()` returns that original absolute string once the file exists. The resulting `derived.key_files` array is later flattened straight into indexable/searchable text.
- **Impact:** A canonical doc that backticks `/Users/.../foo.ts` or another workstation-local path will persist that absolute path into `graph-metadata.json` and surface it through packet indexing/search. That leaks environment-specific paths/usernames and breaks the repo-relative metadata shape the rest of this system assumes.
- **Recommendation:** Reject absolute candidates in `keepKeyFile()` or normalize them to repo-relative paths before `resolveKeyFileCandidate()` returns them and before `graphMetadataToIndexableText()` emits them.

```json
{
  "claim": "The graph-metadata derivation path will persist and expose absolute file paths if a canonical doc references one in backticks.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:395-438",
    ".opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:562-632",
    ".opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1021-1044",
    ".opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:334-354"
  ],
  "counterevidenceSought": "I looked for any absolute-path rejection or repo-relative coercion after candidate resolution and for a regression test covering absolute key-file inputs; neither exists.",
  "alternativeExplanation": "If canonical docs never include absolute file references, the leak stays latent, but the current parser and indexer still allow it whenever such content appears.",
  "finalSeverity": "P1",
  "confidence": 0.96,
  "downgradeTrigger": "Downgrade if another persistence-time sanitizer rewrites absolute graph-metadata key_files to repo-relative paths before they are stored or exposed."
}
```

#### P1-002 [P1] `coverage_gaps` reports the wrong thing for review graphs
- **File:** `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:90-176` (`findCoverageGaps`)
- **Evidence:** The published tool contract says `coverage_gaps` means “nodes missing incoming coverage edges” (`.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:796-806`), but the review-mode branch instead flags `DIMENSION` and `FILE` nodes that do **not** emit outgoing `COVERS`/`EVIDENCE_FOR` edges. That conflicts with the rest of the review implementation, which treats covered files as targets of incoming `COVERS` edges from dimensions (`.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:348-357`).
- **Impact:** A review FILE node that is correctly covered by incoming dimension edges can still be returned as a gap, so `deep_loop_graph_query({ queryType: "coverage_gaps", loopType: "review" })` produces false positives and misleads convergence decisions.
- **Recommendation:** Split review semantics by node kind: dimensions should be checked for outgoing coverage, while files should be checked for incoming `COVERS` edges. `EVIDENCE_FOR` should not be used as a generic FILE/DIMENSION coverage relation unless the graph model is changed consistently everywhere.

```json
{
  "claim": "The review-mode `coverage_gaps` query is directionally wrong and will falsely mark covered FILE nodes as uncovered.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:90-176",
    ".opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:796-806",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:348-357"
  ],
  "counterevidenceSought": "I looked for a competing review-graph model where FILE/DIMENSION nodes are supposed to emit outgoing `COVERS`/`EVIDENCE_FOR` edges; the live tool schema and scoped review-signal code both use incoming coverage for files instead.",
  "alternativeExplanation": "If review graphs had been intentionally remodeled so FILE and DIMENSION nodes were edge sources, the query would be consistent, but the rest of the implementation and published schema do not follow that model.",
  "finalSeverity": "P1",
  "confidence": 0.98,
  "downgradeTrigger": "Downgrade if the tool contract and all review-signal consumers are updated to define review coverage as outgoing edges from FILE/DIMENSION nodes."
}
```

### P2 Findings
- **P2-001:** The only coverage-graph “tests” on this surface are archived Phase-3 contract stubs, not live behavior checks. Both archived files explicitly say the real MCP implementation “will be wired in Phase 3” (`.opencode/skill/system-spec-kit/mcp_server/tests/archive/coverage-graph-db.vitest.ts:10-16`, `.opencode/skill/system-spec-kit/mcp_server/tests/archive/coverage-graph-tools.vitest.ts:10-16`), and the tool stub still asserts obsolete review relation names like `EVIDENCES`, `REMEDIATES`, and `DEPENDS_ON` (`.opencode/skill/system-spec-kit/mcp_server/tests/archive/coverage-graph-tools.vitest.ts:274-280`) that no longer match the live enum (`.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:142-146`). This suite will not catch the review-mode direction bug above.

## Traceability Checks
- `deep_loop_graph_query` does **not** currently match its own advertised `coverage_gaps` contract for review graphs: the schema says “incoming coverage edges,” but the implementation checks outgoing edges from FILE/DIMENSION nodes.
- The graph-metadata pipeline behaves as if `derived.key_files` are repo identifiers in tests and downstream indexing, yet the parser will happily preserve absolute paths if they appear in canonical docs.

## Confirmed-Clean Surfaces
- `.opencode/skill/system-spec-kit/mcp_server/lib/continuity/thin-continuity-record.ts` — strong repo-relative/path traversal guards, compact-field validation, overlap checks, and byte-budget enforcement; the paired tests cover normalization and failure paths.
- `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts` — explicit deny-by-default empty-scope filtering and blocked unscoped audit enumeration; reviewed tests align with that behavior and I did not find a cross-scope bypass in the inspected call sites.
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts` — threshold clamping, per-database cache isolation, rollback/reset behavior, and watermark-based retuning are coherent and exercised by targeted tests.
- `.opencode/skill/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts` and `.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts` — canonical spec-doc classification and type resolution are internally consistent for the reviewed paths.

## Next Focus
- Iteration 3 should stay on live handler/query surfaces around coverage-graph and packet indexing, especially any remaining mismatches between tool-schema promises, handler behavior, and the tests that are supposed to guard them.
