# Iteration 5: Backward Compatibility and Workflow Invariance

## Focus
Q9 and Q10: backward compatibility for maintainers and ADR-005 workflow invariance.

## Findings
- ADR-005 makes `Level 1/2/3/3+ + phase-parent` the only public/AI-facing vocabulary and requires user conversation flow to remain unchanged. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/decision-record.md:211` and `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/decision-record.md:217`.
- ADR-005 explicitly keeps forbidden internal taxonomy off public/AI-facing surfaces and allows it only in maintainer-internal design docs. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/decision-record.md:235` and `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/decision-record.md:241`.
- Maintainer backward compatibility has a natural env-var path because `opencode.json` already injects environment values into the local `spec_kit_memory` MCP server. Evidence: `opencode.json:19` and `opencode.json:25`.
- Per-call backward compatibility requires a schema and handler update because `code_graph_scan` is schema-closed and the dispatcher passes parsed args directly to `handleCodeGraphScan`. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:566` and `.opencode/skill/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts:63`.
- Existing docs already teach that default exclude changes require a full scan to prune old paths, so the migration message can extend that existing behavior rather than introducing a new operation. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code_graph/README.md:289` and `.opencode/skill/system-spec-kit/mcp_server/code_graph/README.md:295`.
- The scan README already defines filter ordering and additive overrides; it should be updated to include `.opencode/skill` in the default list and state that `includeSkills` bypasses only that specific default. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code_graph/README.md:260` and `.opencode/skill/system-spec-kit/mcp_server/code_graph/README.md:266`.
- Schema tests already cover optional scan controls, and default-config tests already check that include/exclude lists exist, so both are natural regression homes for `includeSkills` and the default exclude list. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:534` and `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:242`.
- The safest maintainer one-step setup is `SPECKIT_CODE_GRAPH_INDEX_SKILLS=true` before starting the MCP server, with `code_graph_scan({ incremental:false })` afterward for existing databases. Evidence: the MCP server env injection site is `opencode.json:25`, and full-scan pruning is `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:243`.

## Decisions Made
- Choose `SPECKIT_CODE_GRAPH_INDEX_SKILLS=true` as the maintainer env opt-in and `includeSkills:true` as the one-call override. Rationale: both names describe behavior directly without importing unrelated internal design vocabulary.
- Preserve public workflow invariance by changing only code graph scan/status/readiness wording and docs; Gate 3, spec levels, and conversation prompts do not change. Rationale: ADR-005 is about spec workflow surfaces, and this packet can satisfy it by keeping scope language concrete.
- Backward compatibility is documented opt-in, not old default behavior. Rationale: retaining old default behavior would fail the packet goal and keep the graph dominated by skill internals.

## Open Questions Discovered
- None blocking. Implementation can choose exact helper names and test fixture shapes during plan authoring.

## What Worked
Reading ADR-005 directly prevented a vocabulary leak into the recommendation and clarified that compatibility should preserve workflow text, not preserve noisy scan results.

## What Failed
Trying to satisfy maintainers through old defaults conflicts with the measured graph pollution; compatibility has to be explicit opt-in.

## Convergence Signal
near-converged

## Tokens / Confidence
0.94
