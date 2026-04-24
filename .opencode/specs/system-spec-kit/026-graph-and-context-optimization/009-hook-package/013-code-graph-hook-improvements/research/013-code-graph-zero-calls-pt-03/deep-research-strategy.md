# Strategy — 013-code-graph-zero-calls-pt-03

## Research Charter

### Non-Goals

- This packet will not implement the code fix or edit production files outside the packet scope; it only produces diagnosis and fix recommendations.
- This packet will not redesign the entire CALLS extractor around AST call-expression traversal unless the evidence shows that is necessary for the reported zero-edge symptom.
- This packet will not re-audit unrelated tree-sitter parse-health regressions beyond checking whether they materially explain the `handleMemoryContext` result.
- This packet will not reopen CF-013's post-dedup `TESTED_BY` reconciliation work unless the current evidence shows that fix directly intersects this incident.

### Stop Conditions

- Stop when the packet can identify the exact failing layer behind the zero-edge observation, distinguish it from adjacent hypotheses, and name the concrete target files for the remediation.
- Stop when there is enough evidence to answer whether the issue is isolated to `handleMemoryContext` or affects other same-name symbols.
- Stop when the recommended regression test can be described precisely enough to fail before the fix and pass after it.

### Success Criteria

- Identify the exact defect responsible for the zero-edge result.
- Prove whether the defect lives in extraction, storage, or subject resolution.
- Produce a concrete recommended fix with `target_files`.
- Describe a regression test that would have caught the failure.
- Assess whether other symbols are affected and by what pattern.

## Known Context

- The prior investigation packet states that `calls_from` and `calls_to` were run against symbolId `0470757d9d3bfdbc` for `handleMemoryContext`, and both returned zero edges even though the function body was known to contain many calls [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/013-code-graph-hook-improvements/code-graph-zero-calls-investigation.md:11-21].
- That same packet attributed the symptom primarily to regex-based CALLS extraction in `extractEdges()` and to a possible mismatch between `handleMemoryContext` and the `function|method` caller filter [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/013-code-graph-hook-improvements/code-graph-zero-calls-investigation.md:29-53].
- The current structural indexer still builds CALLS edges inside `extractEdges()` by running `/\b(\w+)\s*\(/g` over function bodies, with `preferredKinds()` resolving targets from in-file nodes [.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts:857-868,.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts:942-973].
- The tree-sitter parser is AST-backed for symbol capture, but it still passes the captured nodes into the shared `extractEdges()` helper rather than performing AST-native call-edge extraction itself [.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/tree-sitter-parser.ts:645-648].
- The query handler resolves ambiguous subjects by sorting all `fq_name` or `name` matches by `file_path`, `start_line`, and `symbol_id`, returning the first candidate and only attaching a generic warning when more than one node matches [.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:115-126,.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:165-190].
- `calls_from` and `calls_to` themselves only read persisted `code_edges` through `queryEdgesFrom()` and `queryEdgesTo()`, then strip dangling endpoints; they do not recalculate or suppress valid CALLS edges once the correct symbol is chosen [.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts:515-550,.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:762-823].
- `handlers/index.ts` exports many handler names as `lazyFunction(...)` wrappers, including `handleMemorySearch`, `handleMemoryContext`, `handleSessionHealth`, and `handleSessionResume`, creating same-name wrapper nodes ahead of the implementation files in path order [.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:212-217,.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:247-320].
- CF-013 fixed post-dedup edge reconciliation and `TESTED_BY` synthesis ordering, but it explicitly deferred DB-level edge insertion behavior, so it is a useful comparison point rather than an explanation for subject-selection failures [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-013.md:7-15,.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-013.md:69-71].
- The current query-handler regression coverage already asserts that ambiguous subjects are resolved to the first candidate deterministically, which may itself be preserving the wrong behavior for CALLS queries [.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-query-handler.vitest.ts:278-299].

## Initial Hypotheses

- H1: The reported zero-edge result came from querying the wrong symbolId rather than from missing CALLS extraction.
  How to test: map the investigation's symbolId back to `code_nodes` and compare it to the current `handleMemoryContext` function node.
- H2: Name-based subject resolution is selecting a wrapper/export/import node before the implementation function.
  How to test: inspect `resolveSubject()` ordering and compare it to duplicate `handleMemoryContext` rows across `handlers/index.ts`, `memory-context.ts`, and test imports.
- H3: The current extractor still emits CALLS edges for the real `handleMemoryContext` function node.
  How to test: run `parseFile()` on `memory-context.ts` and inspect the resulting function node and outgoing CALLS edges; cross-check with the persisted `code_graph.sqlite` rows.
- H4: `calls_from`/`calls_to` are innocent readers; the issue is entirely upstream of query rendering.
  How to test: inspect `queryEdgesFrom()`, `queryEdgesTo()`, and the query handler mapping code for any edge-type or metadata filters.
- H5: The impact extends to other `handle*` surfaces because `handlers/index.ts` mass-produces same-name lazy exports.
  How to test: probe `code_nodes` for duplicate `handle*` names and compare counts for wrapper nodes versus implementation functions.
- H6: Existing regression coverage misses the real failure mode and may even codify it.
  How to test: read the current `code-graph-query-handler.vitest.ts` ambiguity tests and compare their expected behavior with the desired operation-aware subject selection.
- H7: AST-native call extraction is still a worthwhile future hardening path, but it is not required to fix this incident.
  How to test: compare the current parse output for `handleMemoryContext` against the prior root-cause narrative and see whether the zero-edge symptom reproduces after selecting the correct function node.

## Iteration Plan

- Iteration 1: Reconstruct the prior hypothesis chain from the investigation doc, extraction code, query code, and CF-013 so the packet starts from the exact claimed failure mode.
- Iteration 2: Run direct parser and SQLite probes against `handleMemoryContext` to identify the real symbol, its current outgoing CALLS edges, and the ambiguity pattern.
- Iteration 3: Measure whether the ambiguity pattern hits sibling `handle*` symbols, then convert that into concrete fix and regression-test recommendations.

## Risks and Mitigations

- Risk: The repo may have changed since the prior investigation, making the earlier zero-edge observation stale.
  Mitigation: treat the prior doc as a hypothesis source, then validate all critical claims against the current parser and database state.
- Risk: A direct parse probe could accidentally overstate extractor quality if it bypasses persisted DB behavior.
  Mitigation: cross-check both `parseFile()` output and the live `code-graph.sqlite` rows for the same symbol.
- Risk: Duplicate-name impact could be broader than the few handlers examined.
  Mitigation: sample the `handle*` namespace from the live DB to determine whether the issue is class-wide or isolated.
- Risk: The recommended fix could accidentally regress imports-related operations.
  Mitigation: make the proposal operation-aware so `calls_*` prefers callable implementations while `imports_*` preserves import-oriented behavior.
