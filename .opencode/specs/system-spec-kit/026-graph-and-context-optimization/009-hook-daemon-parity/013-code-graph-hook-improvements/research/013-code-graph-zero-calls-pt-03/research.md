---
title: "...timization/009-hook-daemon-parity/013-code-graph-hook-improvements/research/013-code-graph-zero-calls-pt-03/research]"
description: "This packet started from a prior report that calls_from and calls_to returned zero CALLS edges for handleMemoryContext, even though the function body clearly invokes many helper..."
trigger_phrases:
  - "timization"
  - "009"
  - "hook"
  - "daemon"
  - "parity"
  - "research"
  - "013"
  - "code"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/research/013-code-graph-zero-calls-pt-03"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["research.md"]
---
# Deep Research — 013-code-graph-zero-calls-pt-03

## Summary

This packet started from a prior report that `calls_from` and `calls_to` returned zero CALLS edges for `handleMemoryContext`, even though the function body clearly invokes many helpers. The current code and live `code-graph.sqlite` do not reproduce an extraction failure for the real implementation node: `handleMemoryContext` is parsed as a `function`, and its persisted graph row currently has 28 outgoing CALLS edges [iterations/iteration-02.md#evidence]. The zero-edge observation instead traces back to subject selection: the prior packet queried symbolId `0470757d9d3bfdbc`, which corresponds to the `handlers/index.ts` lazy re-export node, not the implementation function in `handlers/memory-context.ts` [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/code-graph-zero-calls-investigation.md:11,.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:310-311,.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1196-1205]. The enabling defect is operation-agnostic ambiguous-subject resolution in `code_graph_query`, which sorts matches by `file_path,start_line,symbol_id` and takes the first result, even for `calls_from`/`calls_to` where an export/import wrapper is a poor proxy for the underlying callable implementation [.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:115-126,.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:165-190]. The blast radius is broader than one symbol because `handlers/index.ts` and similar index modules manufacture many same-name wrapper nodes ahead of implementation files, including `handleMemorySearch`, `handleSessionResume`, and `handleCodeGraphQuery` [iterations/iteration-03.md#evidence,.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:212-320,.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/index.ts:5]. The primary fix is therefore in query-time subject ranking and ambiguity observability, not in the CALLS extractor itself.

## Scope

- In scope: diagnose the reported zero-edge result for `handleMemoryContext`, determine the exact failing layer, name the concrete fix, describe the regression test, and assess whether other symbols share the same problem.
- In scope: inspect the current extraction pipeline, persisted graph state, query resolution logic, and relevant tests and prior research.
- Out of scope: implementing the fix, re-architecting CALLS extraction to AST-native traversal, or auditing every unrelated tree-sitter parse-health regression in the repository.
- Out of scope: changing documentation or production code outside this research packet.

## Methodology

The packet ran 3 iterations and used direct source inspection plus local SQLite probes against `.opencode/skill/system-spec-kit/mcp_server/database/code-graph.sqlite`. Sources consulted included the prior investigation doc, the structural indexer, the tree-sitter parser, the code-graph DB/query layers, `handlers/index.ts`, the real implementation files for sample `handle*` functions, CF-013, and the current query-handler regression tests. Convergence did not hit the formal `<0.05` threshold, but iteration 3 reduced the open question set enough to answer the packet charter, so the run stopped at `max_iterations`.

## Research Charter Recap

- Non-goals revalidated: this packet did not implement the fix, did not reopen AST-native CALLS extraction as a mandatory solution, and did not treat unrelated parse-health warnings as the root cause by default.
- Stop conditions met: the failing layer is identified as ambiguous subject resolution; the recommended fix and target files are concrete; the regression-test surface is clear; and the blast radius pattern is established across sibling `handle*` symbols.
- Success criteria met: the packet distinguishes extraction from subject resolution, names the remediation, specifies the test shape, and documents cross-symbol impact.

## Key Findings

### P0

- `F-001`: The reported zero-edge result is caused by querying the wrong graph node, not by missing CALLS extraction for the real implementation function. The prior packet used symbolId `0470757d9d3bfdbc`; the live graph contains a same-name lazy re-export in `handlers/index.ts` and the real implementation function in `handlers/memory-context.ts`, while `code_graph_query` resolves ambiguous names by taking the first candidate in path order [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/code-graph-zero-calls-investigation.md:11-21,.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:310-311,.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1196-1205,.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:115-126,.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:165-190,iterations/iteration-02.md#evidence].

### P1

- `F-002`: The ambiguity contract in `code_graph_query` is under-specified for relationship operations. It warns that multiple matches exist, but it does not rank candidates by operation semantics or surface enough selected-candidate metadata to reveal that an export/import wrapper was chosen instead of the callable implementation [.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:144-161,.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:165-190].
- `F-003`: Existing regression coverage preserves the wrong behavior. The current ambiguity test explicitly expects `calls_from` to query the first candidate deterministically, but it does not model the `handleMemoryContext`-style collision between a wrapper/export node and an implementation function [.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-query-handler.vitest.ts:278-299].

### P2

- `F-004`: The issue is systemic across handler surfaces because `handlers/index.ts` and similar index modules mass-produce same-name wrapper nodes. Sample collisions include `handleMemorySearch`, `handleSessionResume`, and `handleCodeGraphQuery`, where wrapper/export nodes have zero outgoing CALLS while the implementation functions have significant non-zero outgoing counts [iterations/iteration-03.md#evidence,.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:212-320,.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/index.ts:5,.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:612,.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:540,.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:586].

## Evidence Trail

- Iteration 1 established that the query layer, not the DB reader, was the most likely defect surface because `calls_from`/`calls_to` only render stored edges and `handlers/index.ts` already created same-name lazy wrapper nodes [iterations/iteration-01.md#findings].
- Iteration 2 disproved the extraction hypothesis for the current code by showing that the real `handleMemoryContext` function node is parsed cleanly and has 28 outgoing CALLS edges in the live graph, while the original investigation symbolId belongs to the wrapper/export node [iterations/iteration-02.md#findings,iterations/iteration-02.md#evidence].
- Iteration 3 widened the diagnosis from one symbol to a class of `handle*` collisions and translated that into operation-aware resolver and regression-test recommendations [iterations/iteration-03.md#findings,iterations/iteration-03.md#evidence].

## Recommended Fixes

### Fix Bucket A — Correct Subject Selection

- `FIX-01`
  Severity: `P0`
  Target Files: `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-query-handler.vitest.ts`
  Concrete diff shape recommendation: change `resolveSubject()` to accept the active operation or requested edge type, rank ambiguous candidates by operation-aware preferred kinds, and for `calls_from`/`calls_to` prefer callable implementation nodes (`function`, `method`) before `export`, `import`, or wrapper `variable` nodes. Preserve the current warning behavior, but only fall back to the existing path-order heuristic when no callable candidates exist.

### Fix Bucket B — Make Ambiguity Observable

- `FIX-02`
  Severity: `P1`
  Target Files: `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-query-handler.vitest.ts`
  Concrete diff shape recommendation: enrich ambiguity warnings with candidate metadata (`symbolId`, `kind`, `filePath`, `startLine`) and the selected candidate. This can remain backward-compatible by extending the warning object instead of replacing it. The selected node kind/file should also be exposed in the top-level payload for easier operator debugging.

### Fix Bucket C — Add Regression Coverage

- `FIX-03`
  Severity: `P1`
  Target Files: `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-query-handler.vitest.ts`
  Concrete diff shape recommendation: add a regression case that seeds ambiguous `handleMemoryContext` candidates in the mock DB with an `export` or wrapper `variable` in `handlers/index.ts` and a `function` in `handlers/memory-context.ts`, then assert that `calls_from` and `calls_to` select the function candidate while still surfacing the ambiguity warning. Add sibling cases for `handleMemorySearch` or `handleSessionResume` only if one synthetic case is not enough to protect the selection heuristic.

## Negative Knowledge

- The current zero-edge symptom is not caused by `calls_from`/`calls_to` filtering valid CALLS edges after lookup; those handlers simply read `code_edges` and strip dangling endpoints [.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts:515-550,.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:762-823].
- The live `memory-context.ts` implementation is not missing a `function` node in the current parser pipeline; the direct parse probe returned `parseHealth: clean` and persisted outgoing CALLS for the actual function node [iterations/iteration-02.md#evidence].
- Imported callees are not the specific blocker for this incident. The persisted CALLS edges for the real `handleMemoryContext` node already include imported helpers such as `checkDatabaseUpdated`, `createMCPErrorResponse`, and `buildContext` [iterations/iteration-02.md#evidence].
- CF-013 is related historical context, but its scope was post-dedup edge reconciliation and `TESTED_BY` synthesis, not ambiguous-subject resolution [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-013.md:7-15,.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-013.md:69-71].
- Replacing regex CALLS extraction with AST-native call-expression traversal would harden overall fidelity, but it would not fix this incident by itself because the live graph already stores CALLS edges for the correct function symbol [iterations/iteration-03.md#negative-knowledge,.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts:942-973].

## Cross-Cutting Themes

- Wrapper/index modules inflate name collisions. The code graph currently treats lazy re-exports, final exports, imports, and implementation functions as equal candidates during generic name resolution.
- Query semantics are operation-sensitive, but subject resolution is not. `calls_*` needs callable-preference logic that differs from `imports_*` and pure outline queries.
- Current warnings are technically accurate but operationally insufficient. They reveal that ambiguity exists without revealing why the chosen candidate is a bad fit for the requested relationship query.

## Risk Matrix

| Risk | Severity | Why it matters | Mitigation |
| --- | --- | --- | --- |
| Callable-preference logic could break import-oriented lookups | P1 | `imports_from` and `imports_to` want different preferred kinds than `calls_*` | Make candidate ranking operation-aware instead of globally changing sort order |
| Warning payload changes could break consumers expecting the old shape | P2 | Some downstream tooling may parse warning objects strictly | Extend the warning object additively and keep existing fields/messages intact |
| Synthetic resolver tests might miss real-world wrapper/index patterns | P2 | The bug depends on file-order and kind collisions across modules | Mirror the `handlers/index.ts` lazy-export shape in the regression fixture and include exact kinds and file paths |

## Alternatives Considered

- Rewrite CALLS extraction around AST `call_expression` traversal.
  Rejected as the primary fix because it would improve fidelity for member calls and optional chaining, but the live graph already proves that CALLS edges exist for the real `handleMemoryContext` function.
- Force users to always pass explicit symbol IDs.
  Rejected because the graph surface already accepts `name` and `fq_name`, and the current ambiguity warning implies that user-friendly disambiguation is expected behavior.
- Hard-code a `handlers/index.ts` exclusion for CALLS queries.
  Rejected because the same wrapper-vs-function pattern appears outside that one file family, including `code-graph/handlers/index.ts`; operation-aware kind ranking is more general and less brittle.

## Open Questions

- Should `blast_radius` inherit the same callable-preference behavior as `calls_from` and `calls_to`, or is its current file-centric behavior sufficient?
- Should ambiguous-subject payloads expose all candidate metadata by default, or only when `warnings` are emitted?
- Is one synthetic ambiguity regression enough, or should there also be a DB-backed integration fixture for lazy-export index modules?

## Convergence Report

- Iteration 1 contributed the structural hypothesis split: extraction vs query-time subject resolution.
- Iteration 2 contributed the decisive proof: the real `handleMemoryContext` function node currently has persisted outgoing CALLS edges, while the original symbolId maps to a zero-edge wrapper/export node.
- Iteration 3 contributed blast-radius evidence and converted the diagnosis into concrete fix/test recommendations.
- `newInfoRatio` trend: `0.74 -> 0.66 -> 0.18`.
- Stop reason: `max_iterations` reached after the root cause, fix, regression-test, and cross-symbol impact questions were all answered; the strict `<0.05 for 2 consecutive iterations` convergence gate did not trigger.

## Related Work

- Prior incident note: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/code-graph-zero-calls-investigation.md` framed the symptom and supplied the original symbolId and extractor hypothesis.
- Historical adjacent fix: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-013.md` closed a different edge-reconciliation gap and was useful as a non-root-cause comparison point.
- Existing regression surface: `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-query-handler.vitest.ts` already owns ambiguity-resolution tests and is the natural home for the new protection.

## Next Steps

- Implement `FIX-01` in `code-graph/handlers/query.ts` so `calls_from` and `calls_to` prefer callable implementation nodes.
- Implement `FIX-02` in the same handler to expose selected-candidate metadata and richer ambiguity payloads.
- Add `FIX-03` regression coverage in `code-graph-query-handler.vitest.ts`, keeping the old deterministic-first test only for operations where that behavior remains intentional.
- After the fix lands, rerun the original operator workflow with `handleMemoryContext`, `handleMemorySearch`, and `handleSessionResume` to verify that relationship queries no longer route onto zero-edge wrapper nodes.

## References

### Prior Research

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/code-graph-zero-calls-investigation.md:11-21`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/code-graph-zero-calls-investigation.md:29-53`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-013.md:7-15`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-013.md:69-71`

### Code Paths

- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts:857-868`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts:942-973`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts:1050-1061`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/tree-sitter-parser.ts:645-648`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts:515-550`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:115-126`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:144-161`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:165-190`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:762-823`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:212-320`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1196-1705`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:612`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:540`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/index.ts:5`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:586`

### Tests and Packet Evidence

- `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-query-handler.vitest.ts:278-299`
- `iterations/iteration-01.md#findings`
- `iterations/iteration-02.md#evidence`
- `iterations/iteration-03.md#evidence`
