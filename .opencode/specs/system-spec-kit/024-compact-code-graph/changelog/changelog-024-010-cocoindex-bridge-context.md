# Changelog: 024/010-cocoindex-bridge-context

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration)

---

## 010-cocoindex-bridge-context — 2026-03-31

This phase connected semantic search to the new structural graph so the packet could move beyond isolated retrieval channels. CocoIndex hits can now seed graph expansion, and the returned context includes enough structural framing to explain why a semantic result matters in the codebase around it.

> Spec folder: `.opencode/specs/system-spec-kit/024-compact-code-graph/010-cocoindex-bridge-context/`

---

## New Features (3)

### Seed resolution

**Problem:** A semantic result pointing at a file and line number was not enough to expand the surrounding code graph.

**Fix:** Added `seed-resolver.ts` to map CocoIndex file-range hits to graph symbols or file-level anchors that the structural layer can understand.

### Graph context orchestration

**Problem:** There was no single path that could take semantic seeds, expand the graph, and shape the result into a compact context payload.

**Fix:** Added `code-graph-context.ts` to orchestrate structural neighborhood expansion around those seeds with budget-aware formatting.

### Structured context formatting

**Problem:** Raw graph neighborhoods are difficult to inject directly into a session or read as recovery context.

**Fix:** Added context formatting so expanded results arrive as a readable structural brief instead of a raw database dump.

---

## Deferred (1)

### Reverse semantic augmentation remains advisory

**Problem:** The phase planned stronger back-and-forth enrichment between graph output and CocoIndex.

**Status:** The system suggests next semantic queries, but it does not execute live reverse augmentation inline yet.

---

## Files Changed (4)

| File | What changed |
|------|-------------|
| `mcp_server/lib/code-graph/seed-resolver.ts` | Added mapping from semantic search hits to graph anchors. |
| `mcp_server/lib/code-graph/code-graph-context.ts` | Added seeded structural expansion orchestration. |
| `mcp_server/handlers/code-graph/context.ts` | Added graph-context request handling. |
| `mcp_server/context-server.ts` | Wired seeded graph context into the server surface. |

---

## Upgrade

No migration required. File-anchor fallback remains intentionally coarse when a hit cannot be resolved to a symbol.
