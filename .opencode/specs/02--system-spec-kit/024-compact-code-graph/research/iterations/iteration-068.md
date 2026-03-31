# Iteration 68: Implementation Phasing -- Concrete File-Level Breakdown of Prioritized Backlog

## Focus
Break the prioritized backlog from iteration-064 into concrete implementation phases with exact files to modify, estimated LOC per file, dependency ordering, and risk assessment. The dispatch directive requested 4 phases (A-D), which map cleanly to the backlog priority tiers: P0 fixes, P1 auto-enrichment, P2/P3 tree-sitter migration, and P3 cross-runtime UX. File sizes verified from source.

## Findings

### 1. Phase A: P0 Critical Fixes (endLine bug + CALLS edge repair)

**Goal:** Fix the endLine=startLine bug that renders CALLS edge detection non-functional and corrupts per-node contentHash.

**Files to modify:**

| File | Current LOC | Changes | Est. LOC Delta | Purpose |
|------|------------|---------|---------------|---------|
| `mcp_server/lib/code-graph/structural-indexer.ts` | 473 | Modify `parseJsTs()`, `parsePython()`, `parseBash()` | +60-80 | Add brace-counting (JS/TS), indentation-based (Python), and brace-counting (Bash) endLine detection |
| `mcp_server/lib/code-graph/indexer-types.ts` | 106 | No change needed | 0 | `RawCapture.endLine` field already exists |
| `mcp_server/lib/code-graph/code-graph-db.ts` | 338 | Minor: add `file_mtime_ms` column to schema init | +5 | Prerequisite for Phase B staleness detection |

**Detailed change breakdown for structural-indexer.ts:**
- `parseJsTs()` (lines 30-107): Add `computeEndLine()` helper using brace-counting. After each regex match, scan forward from startLine counting `{` and `}` until balanced. ~25-35 LOC for the helper + ~10 LOC to call it from each capture site.
- `parsePython()` (lines 110-153): Add indentation-based endLine detection. After match, scan forward until a line at same or lesser indentation is found. ~15-20 LOC.
- `parseBash()` (lines 156-169): Add brace-counting similar to JS/TS. ~10 LOC.
- `extractEdges()` CALLS detection (lines 289-313): No change needed -- it already uses `caller.endLine` which will now be correct.
- `capturesToNodes()` contentHash (line 190): No change needed -- it already slices `startLine` to `endLine` which will now capture the full body.

**Total estimated LOC:** 60-80 new/modified lines
**Dependencies:** None -- this is the foundation that unblocks everything else
**Risk:** LOW. Changes are contained within 3 parser functions. The brace-counting heuristic has known edge cases (strings containing braces, template literals) but is ~85% accurate per iteration 060, and hugely better than the current 0% (single-line scan). Tree-sitter (Phase C) provides the definitive fix.
**Testing:** Run `code_graph_scan` on the project itself and verify CALLS edges now appear for function bodies, not just declaration lines. Compare node contentHash before/after.

[SOURCE: structural-indexer.ts:30-169 (parsers), :190 (contentHash), :289-313 (CALLS extraction)]
[SOURCE: iteration-060 finding 1 (endLine bug trace), iteration-066 finding 1 (parser architecture)]

### 2. Phase B: Auto-Enrichment Infrastructure (MCP first-call priming + GRAPH_AWARE_TOOLS interceptor)

**Goal:** Make code graph and CocoIndex context flow automatically into AI conversations without explicit tool calls.

**Dependency ordering within Phase B:**

```
B1: Stale-on-read mechanism (foundation)
B2: MCP first-call priming (session start)
B3: GRAPH_AWARE_TOOLS interceptor (per-tool enrichment)
```

**B1: Stale-on-Read Mechanism**

| File | Current LOC | Changes | Est. LOC Delta | Purpose |
|------|------------|---------|---------------|---------|
| `mcp_server/lib/code-graph/code-graph-db.ts` | 338 | Add `ensureFreshFiles()`, add `file_mtime_ms` column, add mtime fast-path | +45-60 | Per-file staleness detection with mtime fast-path + content hash fallback |
| `mcp_server/handlers/code-graph/query.ts` | 178 | Call `ensureFreshFiles()` after results | +8-12 | Auto-reindex stale files before returning query results |
| `mcp_server/handlers/code-graph/context.ts` | 96 | Call `ensureFreshFiles()` before `buildContext()` | +8-12 | Auto-reindex stale files before building context |
| `mcp_server/lib/code-graph/code-graph-context.ts` | 329 | Replace coarse `computeFreshness()` with per-file check | +15-20 | Per-file granularity instead of global MAX(indexed_at) |

**Subtotal B1:** 76-104 LOC

**B2: MCP First-Call Priming**

| File | Current LOC | Changes | Est. LOC Delta | Purpose |
|------|------------|---------|---------------|---------|
| `mcp_server/hooks/memory-surface.ts` | 337 | Add `FirstCallTracker` singleton, TTL-based session detection | +60-80 | Detect first MCP call of a logical session, trigger priming |
| `mcp_server/handlers/memory-context.ts` | 1373 | Add priming payload assembly for code graph context | +30-40 | Include code_graph_context summary in first memory_context response |
| `mcp_server/lib/code-graph/code-graph-context.ts` | 329 | Add `getQuickSummary()` for lightweight graph overview | +20-30 | Fast summary (file count, edge count, top symbols) for priming |

**Subtotal B2:** 110-150 LOC

**B3: GRAPH_AWARE_TOOLS Interceptor**

| File | Current LOC | Changes | Est. LOC Delta | Purpose |
|------|------------|---------|---------------|---------|
| `mcp_server/hooks/memory-surface.ts` | 337 (+B2) | Add `GRAPH_AWARE_TOOLS` set, `extractFilePathHint()`, graph enrichment injection | +80-100 | Intercept tool dispatch, extract file paths, inject structural context |
| `mcp_server/lib/code-graph/code-graph-context.ts` | 329 (+B1,B2) | Add `getFileContext()` for single-file structural neighborhood | +25-35 | Given a file path, return its symbols, imports, callers, callees |

**Subtotal B3:** 105-135 LOC

**Phase B total estimated LOC:** 291-389 new/modified lines
**Dependencies:** Phase A (endLine fix) is prerequisite for B3 (GRAPH_AWARE_TOOLS needs accurate CALLS edges). B1 must precede B2 and B3 (both need fresh index data). B2 and B3 are independent of each other.
**Risk:** MEDIUM. The interceptor pattern (B3) modifies the tool dispatch hot path. The `GRAPH_AWARE_TOOLS` set must be carefully curated to avoid recursion (code_graph tools must NOT auto-enrich themselves). The existing `MEMORY_AWARE_TOOLS` pattern in memory-surface.ts (iteration 061 finding) provides a proven template -- invert the set logic so listed tools get enrichment rather than being excluded.
**Testing:** 
- B1: Modify a file on disk, call `code_graph_query`, verify it returns fresh results without manual `code_graph_scan`.
- B2: Start a new MCP session (no prior calls), call `memory_context`, verify response includes code graph summary.
- B3: Call a tool that references a file (e.g., `memory_search` returning a file path), verify response envelope includes structural context for that file.

[SOURCE: memory-surface.ts (337 lines, existing interceptor pattern)]
[SOURCE: iteration-062 finding 1 (resolveTrustedSession session primitive)]
[SOURCE: iteration-061 finding 2 (inverted MEMORY_AWARE_TOOLS pattern)]
[SOURCE: iteration-067 findings 2-5 (stale-on-read design)]

### 3. Phase C: Tree-Sitter WASM Migration

**Goal:** Replace regex-based parsing with tree-sitter WASM for ~99% parse accuracy (vs current ~70%), proper endLine via AST, and support for new edge types (DECORATES, OVERRIDES, TYPE_OF).

**Prerequisite:** Phase A must be complete (brace-counting heuristic provides immediate value; tree-sitter is the long-term replacement).

**Migration sub-phases (from iteration 060, refined in iteration 066):**

**C1: Parser Adapter Interface (compatibility layer)**

| File | Current LOC | Changes | Est. LOC Delta | Purpose |
|------|------------|---------|---------------|---------|
| `mcp_server/lib/code-graph/structural-indexer.ts` | 473 (+A) | Extract `ParseResult` interface, refactor parsers behind adapter | +40-60 | Parser-agnostic interface: `parse(content, lang) -> ParseResult` |

**C2: Tree-Sitter WASM Parser Implementation**

| File | Current LOC | Changes | Est. LOC Delta | Purpose |
|------|------------|---------|---------------|---------|
| `mcp_server/lib/code-graph/tree-sitter-parser.ts` | NEW | Tree-sitter WASM initialization, language loading, S-expression queries | +200-280 | New parser implementing `ParseResult` interface via tree-sitter |
| `package.json` | existing | Add `web-tree-sitter` + grammar packages | +3-5 | Dependencies: ~1.5MB total (runtime WASM ~300KB + grammars ~1.2MB) |

**S-expression queries designed in iteration 066:**
- CALLS: `(call_expression function: (identifier) @callee)` + `(call_expression function: (member_expression property: (property_identifier) @callee))`
- IMPORTS: `(import_statement source: (string) @source)` + `(import_clause (named_imports (import_specifier name: (identifier) @name)))`
- DECORATES: `(decorator (identifier) @decorator_name)` for both JS/TS and Python
- OVERRIDES: `(method_definition name: (property_identifier) @method)` where parent class has method with same name

**C3: New Edge Types (require tree-sitter body analysis)**

| File | Current LOC | Changes | Est. LOC Delta | Purpose |
|------|------------|---------|---------------|---------|
| `mcp_server/lib/code-graph/structural-indexer.ts` | 473 (+A,C1) | Add extractDecoratesEdges(), extractOverridesEdges(), extractTypeOfEdges() | +80-120 | 3 new edge types with tree-sitter accuracy |
| `mcp_server/lib/code-graph/indexer-types.ts` | 106 | Add DECORATES, OVERRIDES, TYPE_OF to EdgeKind enum | +3-5 | Type definitions |
| `mcp_server/lib/code-graph/code-graph-db.ts` | 338 (+B) | No schema change needed -- edges table is type-agnostic | 0 | Already supports arbitrary edge_type strings |

**C4: Regex Removal (final cleanup)**

| File | Current LOC | Changes | Est. LOC Delta | Purpose |
|------|------------|---------|---------------|---------|
| `mcp_server/lib/code-graph/structural-indexer.ts` | ~550 (+all) | Remove `parseJsTs()`, `parsePython()`, `parseBash()` regex functions | -120-150 | Replace with tree-sitter calls only |

**Phase C total estimated LOC:** 
- New code: 320-465 LOC (C1+C2+C3)
- Removed code: 120-150 LOC (C4)
- Net: ~200-315 LOC delta

**Dependencies:** Phase A (brace-counting) must be complete first -- it provides the immediate fix while tree-sitter is developed. C1 must precede C2, C2 must precede C3, C3 must precede C4.
**Risk:** HIGH. Tree-sitter WASM has async initialization, grammar loading, and WASM runtime constraints. Key risks:
1. **Cold start latency:** WASM initialization + grammar loading takes 50-200ms on first parse. Mitigate with lazy initialization (init on first `code_graph_scan`, cache the parser instance).
2. **Grammar availability:** Need `tree-sitter-javascript`, `tree-sitter-typescript`, `tree-sitter-python`, `tree-sitter-bash` WASM builds. All are maintained by the tree-sitter org but WASM builds may need to be compiled from source.
3. **S-expression query correctness:** Queries designed in iteration 066 are based on AST structure documentation but need testing against real code. Edge cases: TypeScript decorators, Python `@property`, method overloading.
4. **Fallback strategy:** During C2, both regex and tree-sitter parsers are available. The adapter (C1) enables runtime selection via config flag. Only after extensive testing should C4 (regex removal) proceed.
**Testing strategy:** 
- Create test fixture files with known symbol counts, edge types, endLine positions
- Run both parsers on same files, compare output for equivalence
- Measure parse time per file (target: <50ms for 500-line file)
- Test error recovery: intentionally malformed files should not crash the parser

[SOURCE: iteration-066 findings 1-6 (regex parser architecture, S-expression queries, adapter design)]
[SOURCE: iteration-060 finding 3 (4-phase migration path)]

### 4. Phase D: Cross-Runtime UX (OpenCode Agent Instructions + CODEX.md + Instruction Files)

**Goal:** Ensure non-hook CLI runtimes (OpenCode, Codex, Copilot, Gemini) get equivalent code graph context without relying on Claude Code hooks.

**D1: OpenCode Agent Instruction Updates**

| File | Current LOC | Changes | Est. LOC Delta | Purpose |
|------|------------|---------|---------------|---------|
| `.opencode/agent/context.md` | 429 | Add Layer 1.5 code_graph_context in retrieval sequence | +15-20 | Every @context dispatch includes structural graph |
| `.claude/agents/context.md` | 418 | Mirror changes from OpenCode context agent | +15-20 | Claude agent parity |
| `.codex/agents/context.toml` | existing | Add code_graph_context instruction | +5-10 | Codex agent parity |
| `.agents/agents/context.md` | existing | Add code_graph_context instruction | +15-20 | Copilot agent parity |

**D2: Resume Command Enhancement**

| File | Current LOC | Changes | Est. LOC Delta | Purpose |
|------|------------|---------|---------------|---------|
| `.opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml` | existing | Add step_1b_index_freshness | +10-15 | Auto-refresh code graph on resume |
| `.opencode/command/spec_kit/assets/spec_kit_resume_confirm.yaml` | existing | Mirror changes | +10-15 | Confirm-mode resume also gets freshness check |

**D3: Instruction File Updates**

| File | Current LOC | Changes | Est. LOC Delta | Purpose |
|------|------------|---------|---------------|---------|
| `CLAUDE.md` (root) | existing | Add code_graph_status to Quick Reference table | +5-8 | Cross-runtime documentation |
| `CODEX.md` | NEW or existing | Add code graph startup guidance: "On first interaction, run code_graph_status" | +10-15 | Codex CLI users get code graph awareness |
| `.opencode/skill/system-spec-kit/SKILL.md` | existing | Add code graph section to skill documentation | +15-25 | Skill documentation includes code graph |

**Phase D total estimated LOC:** 100-168 new/modified lines
**Dependencies:** Phase B2 (MCP first-call priming) should be complete -- it provides the universal mechanism. Phase D is additive instruction-level changes that work even without B2, but are most effective when combined with MCP-side priming.
**Risk:** LOW. These are instruction/documentation changes with no code logic. The risk is purely in instructional clarity -- poorly written instructions lead to wasteful tool calls. Mitigate by testing each agent definition change manually (invoke @context, verify code_graph_context is called).
**Rollout plan:**
1. Start with OpenCode context.md (primary runtime) -- verify it works
2. Mirror to .claude/agents/context.md -- test with Claude Code
3. Mirror to .codex/agents/ and .agents/agents/ -- test with Codex and Copilot
4. Update instruction files (CLAUDE.md, CODEX.md, SKILL.md) last -- documentation follows implementation
5. Each runtime can be rolled out independently -- no cross-runtime dependencies

[SOURCE: iteration-065 findings 1-5 (OpenCode agent architecture, MCP registration, 4-tier integration design)]
[SOURCE: iteration-058 findings (non-hook CLI runtime analysis)]

### 5. Cross-Phase Dependency Graph

```
Phase A: endLine fix (P0, foundation)
   |
   +----> Phase B: Auto-enrichment
   |         |
   |         +-- B1: Stale-on-read (foundation for B2, B3)
   |         |     |
   |         |     +-- B2: MCP first-call priming (independent)
   |         |     +-- B3: GRAPH_AWARE_TOOLS interceptor (independent)
   |         |
   |         +----> Phase D: Cross-runtime UX
   |                  |
   |                  +-- D1: Agent instructions (independent)
   |                  +-- D2: Resume command (independent)
   |                  +-- D3: Instruction files (last)
   |
   +----> Phase C: Tree-sitter migration
             |
             +-- C1: Adapter interface (first)
             +-- C2: WASM parser implementation (after C1)
             +-- C3: New edge types (after C2)
             +-- C4: Regex removal (last, after extensive testing)
```

**Critical path:** A -> B1 -> B2/B3 (parallel) -> D (can start after B2)
**Long pole:** C2 (tree-sitter WASM implementation) is the highest-effort sub-phase at 200-280 LOC with highest risk

### 6. Summary Table

| Phase | Sub-phase | LOC (new) | LOC (removed) | Net LOC | Risk | Duration Est. | Depends On |
|-------|-----------|-----------|---------------|---------|------|--------------|------------|
| **A** | endLine fix | 60-80 | 0 | +60-80 | Low | 1-2 sessions | Nothing |
| **B1** | Stale-on-read | 76-104 | 0 | +76-104 | Low | 1-2 sessions | A |
| **B2** | First-call priming | 110-150 | 0 | +110-150 | Medium | 2-3 sessions | B1 |
| **B3** | GRAPH_AWARE_TOOLS | 105-135 | 0 | +105-135 | Medium | 2-3 sessions | A, B1 |
| **C1** | Adapter interface | 40-60 | 0 | +40-60 | Low | 1 session | A |
| **C2** | Tree-sitter WASM | 200-280 | 0 | +200-280 | High | 3-5 sessions | C1 |
| **C3** | New edge types | 83-125 | 0 | +83-125 | Medium | 2-3 sessions | C2 |
| **C4** | Regex removal | 0 | 120-150 | -120-150 | Medium | 1 session | C3 + testing |
| **D1** | Agent instructions | 50-70 | 0 | +50-70 | Low | 1 session | B2 (preferred) |
| **D2** | Resume command | 20-30 | 0 | +20-30 | Low | 1 session | None |
| **D3** | Instruction files | 30-48 | 0 | +30-48 | Low | 1 session | D1, D2 |
| **TOTAL** | | 774-1082 | 120-150 | **+654-932** | | 16-26 sessions | |

[INFERENCE: based on file sizes from `wc -l`, change estimates from iteration-060/064/066/067 findings, and dependency analysis across all segment 6 iterations]

## Ruled Out
- **Single-phase implementation**: The 654-932 LOC net delta with multiple risk levels rules out a single-phase approach. Phased rollout with Phase A as gatekeeper is the only viable path.
- **Phase C before Phase A**: Tree-sitter provides the definitive endLine fix, but the brace-counting heuristic in Phase A delivers immediate value with ~60 LOC and low risk. Starting with tree-sitter (200-280 LOC, high risk) delays all downstream phases.
- **Phase D before Phase B**: Instruction-file changes work without MCP-side priming, but are significantly more effective when the MCP server can automatically inject context. Sequencing B before D maximizes impact.

## Dead Ends
- None. All four phases are viable with identified file paths and realistic LOC estimates.

## Sources Consulted
- `structural-indexer.ts` (473 lines) -- parser architecture and endLine bug
- `code-graph-db.ts` (338 lines) -- schema, isFileStale(), ensureFreshFiles target
- `code-graph-context.ts` (329 lines) -- computeFreshness(), buildContext()
- `memory-surface.ts` (337 lines) -- interceptor pattern for GRAPH_AWARE_TOOLS
- `memory-context.ts` (1373 lines) -- priming payload injection point
- `seed-resolver.ts` (267 lines) -- CocoIndex integration seam
- `handlers/code-graph/*.ts` (633 lines total) -- handler modification points
- `.opencode/agent/context.md` (429 lines) -- agent instruction update target
- `.claude/agents/context.md` (418 lines) -- Claude agent parity target
- iteration-060, iteration-064, iteration-065, iteration-066, iteration-067 -- prior findings

## Assessment
- New information ratio: 0.55
- Questions addressed: Implementation phasing meta-question (cross-cutting synthesis of all Q13-Q16 findings into actionable phases)
- Questions answered: "What is the concrete implementation plan?" -- fully answered with 4 phases, 11 sub-phases, exact file lists, LOC estimates, and dependency graph

## Reflection
- What worked and why: Using `wc -l` to get actual file sizes before estimating LOC changes ensures realistic estimates. Cross-referencing all prior iteration findings (060, 064, 065, 066, 067) in a single pass produced a coherent dependency graph that would not emerge from any single iteration's findings alone.
- What did not work and why: N/A -- the approach was well-suited to this synthesis task.
- What I would do differently: Reading the actual function signatures in each target file (not just line counts) would give even more precise insertion points. However, the tool budget constraint (12 calls) made full-file reads impractical for all 14+ files involved.

## Recommended Next Focus
Two options for remaining iterations (69-75):
1. **Final synthesis update**: Incorporate this phasing plan into research.md as Part VII "Implementation Roadmap", producing the complete deliverable document.
2. **Risk deep-dive**: Investigate Phase C2 (tree-sitter WASM) risk mitigations in detail -- cold start benchmarks, grammar WASM build process, error recovery behavior.
