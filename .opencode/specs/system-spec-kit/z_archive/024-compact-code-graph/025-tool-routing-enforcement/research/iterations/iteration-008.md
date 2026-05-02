# Iteration 008: Runtime Instruction File Updates — Active Decision Trees

## Focus: Draft updated runtime instruction file sections that replace passive CocoIndex/Code Graph guidance with short active decision trees that are harder for AI assistants to skip across hook-compatible and non-hook CLIs.

## Proposed CLAUDE.md Section:
### Enforced Code Search Routing
IF the task is exact text, exact symbol, or a copied literal, THEN use `Grep()`.
IF the task is a known file or path pattern, THEN use `Glob()`.
IF the task asks by concept, intent, behavior, or unfamiliar code, THEN start with CocoIndex.
IF the task asks about callers, imports, dependencies, neighborhood, or impact, THEN use `code_graph_query` / `code_graph_context`.
IF code graph status is stale, empty, or unavailable, THEN skip graph tools and use CocoIndex plus direct file reads until graph health recovers.

## Proposed CODEX.md Section:
## Enforced Query-Intent Routing
IF the request is exact text, exact symbol, or a pasted literal, THEN use `Grep()`.
IF the request is a known filename or path pattern, THEN use `Glob()`.
IF the request is semantic discovery, implementation lookup, or unfamiliar-code exploration, THEN start with CocoIndex.
IF the request is structural navigation such as callers, imports, dependency shape, or impact, THEN use `code_graph_query` / `code_graph_context`.
IF `code_graph_status()` shows stale, empty, or unavailable graph state, THEN do not use graph tools yet; use CocoIndex plus direct reads first.

## Proposed GEMINI.md Section:
### Mandatory Code Search Decision Tree
IF the task is exact text, exact symbol, or a copied literal, THEN use `Grep()`.
IF the task is a known file or path pattern, THEN use `Glob()`.
IF the task is concept search, intent search, behavior lookup, or unfamiliar code, THEN start with CocoIndex.
IF the task is structural analysis such as callers, imports, dependencies, neighborhood, or impact, THEN use `code_graph_query` / `code_graph_context`.
IF the graph is stale, empty, or unavailable, THEN fall back to CocoIndex plus direct file reads until graph-backed retrieval is trustworthy again.

## Proposed .claude/CLAUDE.md Section:
### Claude Routing Supplement
IF hook-injected context is present, THEN keep it and still route code search by query type.
IF the task is exact text, exact symbol, or a copied literal, THEN use `Grep()`.
IF the task is a known file or path pattern, THEN use `Glob()`.
IF the task is semantic discovery or unfamiliar code, THEN start with CocoIndex.
IF the task is callers, imports, dependencies, neighborhood, or impact, THEN use `code_graph_query` / `code_graph_context`.
IF graph status is stale, empty, or unavailable, THEN use CocoIndex plus direct reads instead of graph tools.

## Findings:
1. Root `CLAUDE.md` already contains CocoIndex-first guidance, but the current phrasing is still passive enough to compete with a model's built-in Grep/Glob bias. The file says CocoIndex "**MUST use**" for unfamiliar code and concept/intent search, while the nearby quick-reference table still reads more like descriptive workflow guidance than a hard decision tree. [SOURCE: CLAUDE.md:34-37] [SOURCE: CLAUDE.md:46-50]
2. Root `CODEX.md` already has the strongest runtime-specific routing structure because it separates semantic discovery from structural navigation. Its `Query-Intent Routing` section maps semantic discovery to CocoIndex and structural navigation to `code_graph_query` / `code_graph_context`, and its session-start section already ties structural retrieval to graph health. [SOURCE: CODEX.md:14-20] [SOURCE: CODEX.md:28-33]
3. Root `GEMINI.md` already includes the clearest search-routing tree in the repository: exact text goes to Grep, known paths go to Glob, concept/intent goes to CocoIndex, and unfamiliar code also starts with CocoIndex. It also already states the needed graph fallback rule: if graph state is stale, empty, or unavailable, the runtime should use CocoIndex plus direct file reads until graph-backed retrieval is trustworthy. [SOURCE: GEMINI.md:69-75] [SOURCE: GEMINI.md:78-113]
4. `.claude/CLAUDE.md` currently contains only Claude-specific hook-aware recovery additions and no code-search routing policy at all. That means Claude has recovery transport guidance but no Claude-local reinforcement of the semantic-vs-structural-vs-exact-match tool split. [SOURCE: .claude/CLAUDE.md:1-24]
5. The repo layout differs from the task prompt for two runtime files: the investigated files are root `CODEX.md` and root `GEMINI.md`, not `.codex/CODEX.md` or `.gemini/GEMINI.md`. This matters for the eventual implementation patch because insertion points must target the actual tracked files. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/CODEX.md] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/GEMINI.md]
6. The most consistent cross-runtime fix is not to invent new guidance per file, but to normalize all runtime docs around the same five-step decision order: exact literal -> Grep, known path -> Glob, semantic discovery -> CocoIndex, structural graph question -> Code Graph, stale graph -> CocoIndex plus direct reads. That keeps the escape hatch for exact text while making Grep/Glob secondary instead of default. [SOURCE: CLAUDE.md:46-50] [SOURCE: CODEX.md:28-33] [SOURCE: GEMINI.md:78-113]
7. The replacement sections should use active `IF/THEN` language because the current passive phrasing ("MUST use", "try CocoIndex first") still leaves room for models to interpret Grep/Glob as the safer default. The Gemini tree and Codex query-intent split provide the strongest source patterns for converting these rules into explicit branching logic. [SOURCE: CLAUDE.md:34-37] [SOURCE: CODEX.md:28-33] [SOURCE: GEMINI.md:80-113]

## Key Questions Answered:
- Q8: What replacement runtime instruction text should be drafted to enforce CocoIndex/Code Graph routing more actively across CLAUDE.md, CODEX.md, GEMINI.md, and `.claude/CLAUDE.md`?
- Q9: How can exact-text Grep/Glob escape hatches remain available without reintroducing Grep-first semantic search behavior?
- Q10: How should stale or unavailable Code Graph state redirect structural questions so non-hook and hook runtimes behave consistently?

## New Information Ratio: 0.84

## Next Focus Recommendation: Validate these draft sections against the exact insertion points in each runtime file, then test whether the wording can be mirrored in MCP server instruction surfaces (`buildServerInstructions()` and/or tool descriptions) so the same routing rule reaches models before the first tool choice, not only through runtime markdown files.
