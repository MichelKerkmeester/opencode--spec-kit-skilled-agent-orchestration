# Changelog: 024/010-cocoindex-bridge-context

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration)

---

## 010-cocoindex-bridge-context — 2026-03-31

The code graph system (Phase 009) could answer structural questions -- "what does this function call?" -- and CocoIndex could answer semantic questions -- "find code related to authentication." But there was no way to combine them. If an AI agent found a relevant code snippet via semantic search, it couldn't automatically discover that snippet's structural neighborhood (callers, imports, tests) without manually chaining multiple tool calls. This phase adds `code_graph_context`, an orchestration tool that accepts search results from CocoIndex (or manual references) as "seeds," resolves them to graph nodes, expands structurally, and returns a compact context package optimized for AI consumption -- bridging semantic discovery and structural understanding in a single call.

> Spec folder: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/010-cocoindex-bridge-context/`

---

## What Changed

### New Features (3)

### code_graph_context orchestration tool

**Problem:** AI agents had to manually chain two separate tools together to get full picture of a piece of code. First they would run a CocoIndex semantic search to find relevant code (for example, "find authentication code"), then they would run a separate graph query tool to discover that code's structural relationships (what calls it, what it imports, what tests cover it). This multi-step chaining was slow, error-prone, and required the agent to understand the internal data formats of both tools.

**Fix:** Added a single orchestration tool called `code_graph_context` that handles the entire pipeline in one call. The tool accepts "seeds" -- code references from any source -- resolves them to nodes in the structural graph, expands outward to discover related code, and returns everything in a single response. An agent can now go from a natural-language question like "find authentication code" to a complete structural map (the function, its callers, its imports, and its tests) in one step instead of three or four.

---

### Three query modes

**Problem:** Different tasks need different kinds of structural context. A developer debugging a bug wants to see what a function calls and what calls it (its immediate neighborhood). Someone orienting themselves in an unfamiliar codebase wants a high-level outline of files and exports. A developer planning a refactor needs to know every place that depends on the code they are changing (the "blast radius"). Forcing callers to specify exact edge types and expansion parameters for each scenario was verbose and error-prone.

**Fix:** Added three preset query modes that encode these common patterns. **Neighborhood** (the default) performs a one-hop expansion to show a function's immediate callers, callees, imports, and tests -- ideal for understanding and debugging. **Outline** returns file and package structure with minimal expansion, suited for orientation and repo mapping. **Impact** follows reverse dependency edges to surface everything that depends on the target code, supporting refactor planning and blast-radius analysis. Callers pick a single mode keyword and get the right expansion automatically.

---

### Profile-based density control

**Problem:** Different situations call for different levels of detail in the response. A quick lookup during coding needs a compact answer that fits in a small context window, while deep research benefits from verbose output with full provenance and trace information. Without a simple control, callers would have to toggle multiple individual flags (`includeTrace`, `includeTests`, `includeCallers`, etc.) to get the right level of detail.

**Fix:** Added a `profile` parameter with three presets: **quick** (minimal output for fast lookups), **research** (verbose output with full expansion for deep investigation), and **debug** (includes resolution traces and timing metadata for troubleshooting). Setting one flag controls the overall output density, replacing the need to configure multiple options individually.

---

### Architecture (5)

### Seed resolver with three-provider support

**Problem:** Code references arrive in different formats depending on where they come from. CocoIndex search results contain `file`, `lines`, `snippet`, and `score` fields. Manual references from a developer specify `filePath`, `startLine`, and `endLine`. Direct graph references use `symbolId` or `fqName` (fully qualified name -- a unique identifier like `src/auth/middleware.ts::AuthMiddleware.handle`). The orchestration tool needed to work with all three formats without requiring callers to pre-convert their data.

**Fix:** Built a seed resolver that normalizes all three input formats into a single internal representation called `ArtifactRef` (a unified reference containing file path, line range, and optional symbol identifiers). The resolver follows a resolution chain to match each seed against the structural graph: first it looks for an exact symbol match (the seed's line range matches a graph node precisely), then it checks for an enclosing symbol (the seed falls inside a larger function or class), and finally it falls back to a file-level anchor (using the whole file as the reference point). Every resolution carries a confidence score (0 to 1) so the AI agent knows how precise the match is -- an exact match scores higher than a file-level fallback.

---

### Seed deduplication

**Problem:** When multiple search results point to the same function or class (which happens frequently -- a semantic search for "authentication" might return three snippets all inside `AuthMiddleware.handle`), expanding each one separately would waste budget and produce redundant output. The same graph neighborhood would be traversed multiple times, inflating the response with duplicate information.

**Fix:** After resolving all seeds to their graph-node targets, the resolver detects overlapping seeds that resolved to the same node and merges them before expansion begins. This keeps the context lean and avoids spending the limited token budget on redundant structural information.

---

### Budget-aware truncation

**Problem:** AI context windows (the amount of text an AI model can process at once) are finite. A large codebase neighborhood can easily expand into thousands of tokens of structural information, overwhelming the model's capacity and crowding out other important context. Without controlled truncation, the tool would either return too much data (wasting context window space) or require callers to manually limit results.

**Fix:** Added deterministic truncation (meaning it follows the same priority rules every time, producing predictable output) that follows a fixed drop order: second-hop neighbors are dropped first (they are the least directly relevant), then sibling symbols (other functions in the same file), then semantic analogs (similar but non-identical code), then test references, and finally import detail lines (though import presence is always preserved). A "never-drop" invariant guarantees that four critical elements always survive regardless of budget pressure: the top seed (the code the agent asked about), the root anchor (the resolved graph node), one boundary edge (at least one structural relationship), and one next action (a suggested follow-up step). This ensures the AI always receives enough context to take its next action.

---

### Latency guard

**Problem:** One of the tool's optional enrichment steps -- reverse semantic augmentation -- queries CocoIndex with graph-expanded neighbor names to find semantically related code beyond the structural graph. This involves a network round-trip to the CocoIndex service, which can be slow on large neighborhoods. If the tool spends too long on this optional step, it risks exceeding the overall tool timeout and returning nothing at all.

**Fix:** Added a 400-millisecond time-budget check using `performance.now()`. Before starting the reverse semantic augmentation step, the tool checks how much time remains in its overall budget. If fewer than 400ms remain, it skips the augmentation entirely rather than risking a timeout. This ensures the tool always returns a result (possibly without the optional semantic enrichment) rather than failing completely.

---

### Empty-seeds fallback

**Problem:** When an AI agent calls `code_graph_context` without providing any seeds or a subject (perhaps because a previous search returned no results, or the agent is exploring generally), the tool had no graceful way to respond. Returning an error would force the agent to handle the failure case and try a different approach.

**Fix:** When no seeds or subject are provided, the tool gracefully degrades to outline mode via `buildEmptyFallback()`, returning the overall structure of the repository rather than an error. This means callers always get something useful -- at minimum, a structural overview they can use to orient themselves and formulate a more targeted query.

---

### Documentation (2)

### Structured and text output formats

**Problem:** AI agents have two different consumption modes. When processing results programmatically (chaining into further tool calls), they need structured JSON with clearly separated sections. When presenting results directly to a user or including them inline in a response, they need readable, compact text. A single output format cannot serve both needs well.

**Fix:** The tool returns both formats in every response. The structured response separates results into distinct sections: `semanticSeeds` (the original inputs and their provenance), `resolvedAnchors` (the graph-resolved references with confidence scores), and `graphContext` (the expanded nodes, edges, outline entries, and test references). Alongside this, a compact text brief rendered in "repo-map" style (a concise format showing one relationship per line) is included for inline display -- for example: `Root: AuthMiddleware.handle() [function] / Called by: auth/routes.ts / Uses: TokenVerifier.verify`.

---

### Trace metadata

**Problem:** When seed resolution or graph expansion produces unexpected results, debugging is difficult without visibility into what decisions the tool made internally. Which resolution path did each seed follow? Why was a particular node included or excluded? How long did each step take?

**Fix:** Added an `includeTrace` flag that, when enabled, surfaces detailed metadata about the tool's internal processing: which resolution path each seed followed (exact match, enclosing symbol, or file anchor), what expansion decisions were made for each node, and timing data for each processing step. This makes it possible to diagnose unexpected results without reading the source code.

---

<details>
<summary><strong>Files Changed (5)</strong></summary>

| File | What Changed |
|------|-------------|
| `lib/code-graph/seed-resolver.ts` | New file: seed normalization from three providers (CocoIndex, Manual, Graph) to unified ArtifactRef, resolution chain with confidence scoring, deduplication |
| `lib/code-graph/code-graph-context.ts` | New file: main orchestrator with three query modes, graph expansion, budget enforcement, latency guard, text/JSON formatting, empty-seeds fallback |
| `handlers/code-graph/context.ts` | New file: MCP handler wiring for code_graph_context tool |
| `tool-schemas.ts` | Added code_graph_context JSON schema with strict validation |
| `context-server.ts` | Registered code_graph_context handler at server startup |

</details>

## Upgrade

No migration required.
