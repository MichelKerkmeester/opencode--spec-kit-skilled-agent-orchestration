## Iteration 10
### Focus
Final production-readiness sweep: documentation drift, missing regression nets, and release posture.

### Findings
- The package-level README accurately documents tree-sitter-first parsing, but the library README still says `structural-indexer.ts` is a regex-based parser with tree-sitter merely “planned,” which no longer matches the runtime. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code-graph/README.md:35-58`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/README.md:11-18`.
- The package README still points readers to “Packet 012” as the origin of the latest scan/highlight fixes even though this work now lives under the renumbered `003-code-graph-context-and-scan-scope` phase, so packet navigation is stale. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code-graph/README.md:208-211`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-code-graph-package/spec.md:55-58`.
- Existing schema coverage and handler tests leave the highest-risk parity problems unguarded: no union-mode schema case, no rich-seed schema case, no scan write-failure staging case, and no debounce keying case. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:490-540`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-scan.vitest.ts:56-167`, `.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:129-269`.
- A release candidate could pass today’s tests while still shipping unreachable blast-radius union mode, dropped seed provenance, stale cache bleed-through, and false AST trust signals. Evidence: iterations `01`, `02`, `03`, `04`, and `06` in this packet.

### New Questions
- Which issues are release blockers versus fast-follow cleanup for the next remediation packet?
- Should the package add a single contract test suite that compares handler interfaces, Zod schemas, and tool-schema docs for the same tool?
- Is there appetite for a shared “scan persistence” helper so `ensure-ready` and `code_graph_scan` cannot drift again?

### Status
converging
