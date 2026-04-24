# Iteration 2 -- 003-contextador

## Metadata
- Run: 2 of 10
- Focus: routing path through `routeQuery()`, pointer extraction, and hierarchy usage
- Agent: cli-codex (gpt-5.4, model_reasoning_effort=high)
- Started: UNKNOWN (this iteration did not capture a start timestamp before the first read)
- Finished: 2026-04-06T10:44:20Z
- Tool calls used: 11

## Reading order followed
1. `.opencode/skill/sk-deep-research/SKILL.md` `12-45`, `135-220`
2. `research/iterations/iteration-001.md` `1-102`
3. `external/src/lib/core/headmaster.ts` `1-243`
4. `external/src/lib/core/pointers.ts` `1-190`
5. `external/src/lib/core/hierarchy.ts` `1-133`
6. `external/src/mcp.ts` `212-282`
7. `external/src/lib/core/response.ts` `1-118`

## Findings

### F2.1 -- `routeQuery()` builds its routing corpus from repo-authored context docs, with `.contextador/briefing.md` as an optional shortcut
- Source evidence: `external/src/lib/core/headmaster.ts:16-36`, `external/src/lib/core/headmaster.ts:199-203`
- Evidence type: source-proven
- What it shows: `routeQuery()` first tries `loadBriefing(root)` and only falls back to `buildRoutingSummary(root)` if no briefing exists. The fallback summary scans every `CONTEXT.md`, reads each file, and includes only the first five lines as routing previews.
- Why it matters for Code_Environment/Public: The routing layer is driven by human-authored context artifacts rather than direct code-symbol indexing. That makes the quality and freshness of `CONTEXT.md` or `briefing.md` central to retrieval quality.
- Affected subsystem: routing corpus assembly
- Open questions resolved: deeper Q2, part of Q12
- Risk / ambiguity: This iteration traced only the local routing path; it did not inspect whether briefing generation itself is manual, scheduled, or feedback-driven.

### F2.2 -- The routing decision is explicitly model-first, with a hard deterministic fallback when the model path fails
- Source evidence: `external/src/lib/core/headmaster.ts:199-242`
- Evidence type: source-proven
- What it shows: `routeQuery()` calls `getModel("local-fast")` and `generateText()` inside a `try` block, instructing the model to return JSON containing `targetScopes`. Any failure in model lookup, generation, or JSON parsing drops into `catch { ... }`, which then executes `keywordFallback(root, query)`.
- Why it matters for Code_Environment/Public: This cleanly marks the boundary between model-driven routing and deterministic routing. There is no blended scoring path in the traced function: the model branch wins if it completes, otherwise keyword routing takes over wholesale.
- Affected subsystem: query routing decision
- Open questions resolved: Q3
- Risk / ambiguity: The code does not expose why the model branch failed; callers only observe fallback behavior, not the cause.

### F2.3 -- The deterministic fallback includes keyword scoring, scope-path boosting, hit-log reuse, and a native fan-out branch
- Source evidence: `external/src/lib/core/headmaster.ts:61-126`
- Evidence type: source-proven
- What it shows: `keywordFallback()` extracts normalized keywords, scans all `CONTEXT.md` files, scores scopes by content hits, adds a `+5` bonus when a keyword appears in the scope path, adds hit-log bonuses using `parseHitLog()` and `hashKeywords()`, and then fans out to every non-root scope whose score is at least `60%` of the top score.
- Why it matters for Code_Environment/Public: Fan-out is not an MCP-only presentation detail; it exists in the deterministic router itself. The fallback is therefore more than a simple "best match" heuristic and already encodes multi-scope retrieval behavior.
- Affected subsystem: deterministic routing fallback
- Open questions resolved: Q3
- Risk / ambiguity: Root-only handling is special-cased; if only the root scores, fallback returns `[""]`, which may mask lower-confidence child scopes.

### F2.4 -- The model-driven branch becomes deterministic immediately after scope prediction via `validateScopes()` and `buildResult()`
- Source evidence: `external/src/lib/core/headmaster.ts:128-157`, `external/src/lib/core/headmaster.ts:159-197`, `external/src/lib/core/headmaster.ts:231-236`
- Evidence type: source-proven
- What it shows: After JSON parsing, the AI-produced `targetScopes` are normalized against the real `CONTEXT.md` inventory. Exact matches pass through unchanged; non-exact paths are fuzzy-matched by normalized string equality or containment. `buildResult()` then deterministically converts the scopes into `targets`, `contextChain`, `fanOut`, and a depth-derived `targetRole`.
- Why it matters for Code_Environment/Public: The model only chooses scope names. Everything after that point, including path correction, multi-target packaging, and role assignment, is deterministic and filesystem-grounded.
- Affected subsystem: post-routing normalization and packaging
- Open questions resolved: Q3, deeper Q2
- Risk / ambiguity: Fuzzy matching can silently coerce an imprecise model answer into the "closest" known scope, which may improve robustness but can also hide misrouting.

### F2.5 -- The live hierarchy traversal is shallow path assembly, not a tree walk through `hierarchy.ts`
- Source evidence: `external/src/lib/core/headmaster.ts:159-197`, `external/src/lib/core/hierarchy.ts:62-133`
- Evidence type: source-proven
- What it shows: In the traced route path, `buildResult()` derives `contextChain` by splitting only the primary scope and appending `CONTEXT.md` at each ancestor depth. By contrast, `hierarchy.ts` separately defines `buildHierarchy()`, `findBestNode()`, and `lowestCommonAncestor()`, but the traced `routeQuery()` path does not call those helpers.
- Why it matters for Code_Environment/Public: The current live path does not appear to use a richer graph or tree reasoning model for multi-scope routing. Hierarchy is represented mainly as path depth and ancestor chain construction.
- Affected subsystem: hierarchy handling during routing
- Open questions resolved: deeper Q2, part of Q12
- Risk / ambiguity: Other entrypoints may use `hierarchy.ts` more deeply, but this iteration confirmed only the `context` MCP path.

### F2.6 -- What actually gets serialized for the agent is a compact pointer block extracted from markdown headings, not a structured context object
- Source evidence: `external/src/mcp.ts:212-282`, `external/src/lib/core/pointers.ts:23-138`, `external/src/lib/core/pointers.ts:151-190`
- Evidence type: source-proven
- What it shows: After routing, `mcp.ts` reads each target `CONTEXT.md`, calls `extractPointers()`, serializes the result with `serializePointers()`, joins multiple targets with `\n\n---\n\n`, and optionally prefixes the payload with `[fan-out: N scopes]`. The extracted payload is limited to `purpose`, `keyFiles`, `dependencies`, `apiSurface`, and `tests`, as recognized from markdown section headers and bullet formats.
- Why it matters for Code_Environment/Public: The effective MCP contract is a text block assembled from a narrow schema inferred from `CONTEXT.md` headings. The agent does not receive raw code, symbol graphs, or the richer context object declared elsewhere.
- Affected subsystem: MCP context serialization
- Open questions resolved: deeper Q2
- Risk / ambiguity: If a `CONTEXT.md` deviates from the expected headings or bullet syntax, the serialized payload will silently lose fields.

### F2.7 -- `response.ts` exposes a richer response model, but the traced MCP path bypasses it; Contextador's distinctiveness is therefore authored-summary routing, not structured code retrieval
- Source evidence: `external/src/lib/core/response.ts:45-117`, `external/src/mcp.ts:212-282`, `external/src/lib/core/headmaster.ts:16-36`, `external/src/lib/core/headmaster.ts:61-126`
- Evidence type: inferred from source comparison
- What it shows: `response.ts` can build and serialize a `ContextResponse` containing files, types, dependencies, API surface, tests, and a context chain. The traced `context` MCP path does not use that formatter and instead routes over `briefing.md` or `CONTEXT.md` previews, then returns pointer text from authored markdown sections. Relative to tools like CocoIndex, Compact Code Graph, or Spec Kit Memory, the genuinely different ingredient here is the repo-maintained summary layer plus model-or-keyword scope routing over it.
- Why it matters for Code_Environment/Public: If we want to borrow ideas from Contextador, the most novel piece is not "another structured retrieval engine" but the lightweight, human-maintained context layer that can route quickly and degrade gracefully.
- Affected subsystem: overall retrieval model
- Open questions resolved: Q12
- Risk / ambiguity: The comparative statement about CocoIndex, Compact Code Graph, and Spec Kit Memory is an inference from this source trace plus our packet framing, not a claim made by Contextador itself.

## MCP routing flow
| Stage | File | Deterministic or model-driven | What happens |
|------|------|-------------------------------|--------------|
| Routing corpus | `external/src/lib/core/headmaster.ts:16-36`, `199-203` | Deterministic | Load `.contextador/briefing.md` or build previews from all `CONTEXT.md` files |
| Scope selection | `external/src/lib/core/headmaster.ts:204-237` | Model-driven | `local-fast` model returns JSON `targetScopes` |
| Fallback scope selection | `external/src/lib/core/headmaster.ts:61-126`, `238-241` | Deterministic | Keyword scoring, hit-log boosting, and threshold-based fan-out |
| Scope normalization | `external/src/lib/core/headmaster.ts:128-157`, `231-236` | Deterministic | Validate or fuzzy-correct scopes against real paths |
| Route packaging | `external/src/lib/core/headmaster.ts:159-197` | Deterministic | Build `targets`, `contextChain`, `fanOut`, and `targetRole` |
| Context extraction | `external/src/mcp.ts:221-246`, `external/src/lib/core/pointers.ts:23-138` | Deterministic | Read target `CONTEXT.md` files and extract structured pointer fields |
| Agent payload | `external/src/mcp.ts:258-282`, `external/src/lib/core/pointers.ts:151-190` | Deterministic | Join serialized pointer blocks into one text response |

## Newly answered key questions
- Q3: The routing decision boundary is clear. `routeQuery()` is model-first via `generateText()` and only uses deterministic keyword routing if the model path throws or returns unparsable output (`external/src/lib/core/headmaster.ts:199-242`).
- Q2: The live data shape is `RouteResult` plus serialized `Pointers`, not `ContextResponse`. MCP callers receive text built from markdown-derived `purpose`, `keyFiles`, `dependencies`, `apiSurface`, and `tests` (`external/src/lib/core/headmaster.ts:8-14`, `external/src/lib/core/pointers.ts:14-21`, `external/src/mcp.ts:212-282`).
- Q12: Contextador's genuinely different idea is repo-authored summary routing over `CONTEXT.md` and `briefing.md`, with deterministic fallback and fan-out, rather than direct code-index retrieval. This is an inference from the traced source path, not a README claim (`external/src/lib/core/headmaster.ts:16-36`, `external/src/lib/core/headmaster.ts:61-126`, `external/src/mcp.ts:212-282`).

## Open questions still pending
- Q4: How feedback events, janitor sweeps, and generator passes actually close the loop after bad or missing context.
- Q5: Which README claims about "self-healing" or "self-improving" are fully supported by the implementation.
- Q6, Q7, Q8, Q9, Q10, Q11: still untraced in this iteration.

## Recommended next focus (iteration 3)
Trace the self-healing loop end to end: `external/src/lib/core/feedback.ts`, `external/src/lib/core/janitor.ts`, `external/src/lib/core/generator.ts`, and any `enrichFromFeedback()` helper reachable from `external/src/mcp.ts`. The goal should be to prove what actually changes on disk, what is queued vs immediate, and how much of the repair story is deterministic versus provider-driven.

## Self-assessment
- newInfoRatio (estimate, 0.0-1.0): 0.74
- status: insight
- findingsCount: 7
