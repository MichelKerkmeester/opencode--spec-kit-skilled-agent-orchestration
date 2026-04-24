# Cross-Phase Capability Matrix

> Iteration 4 of master consolidation. Scoring rubric: `0 = absent`, `1 = partial`, `2 = full`, `- = N/A`.
> Table scores are justified in the cited rationale below.

## Capability scores

| # | Capability | 001 Settings | 002 CodeSight | 003 Contextador | 004 Graphify | 005 Claudest | Public (baseline) | Dominant |
|---|------------|--------------|---------------|-----------------|--------------|--------------|-------------------|----------|
| 1 | Code AST coverage | - | 1 | 0 | 2 | 0 | 1 | 004 Graphify |
| 2 | Multimodal support | - | 0 | 0 | 2 | 1 | 1 | 004 Graphify |
| 3 | Structural query | - | 1 | 0 | 1 | 0 | 2 | Public |
| 4 | Semantic query | - | 0 | 0 | 1 | 0 | 2 | Public |
| 5 | Memory / continuity | - | 1 | 1 | 1 | 2 | 2 | Public (tie 005) |
| 6 | Observability | - | 1 | 1 | 1 | 2 | 2 | Public (tie 005) |
| 7 | Hook integration | - | 0 | 0 | 1 | 2 | 2 | Public (tie 005) |
| 8 | License compatibility | - | 2 | 0 | 2 | 2 | - | 002 CodeSight (tie 004/005) |
| 9 | Runtime portability | - | 2 | 0 | 1 | 1 | 1 | 002 CodeSight |

## Per-capability rationale

### 1. Code AST coverage
- **001 Settings** = `-`. Phase 001 is a field-report audit and decision layer, not a shipped parser or runtime surface. [SOURCE: phase-1/implementation-summary.md:38-42] [SOURCE: phase-1/decision-record.md:36-43]
- **002 CodeSight** = `1`. CodeSight is AST-first in important detectors, but its real-AST story is mixed: TypeScript/Python paths are real while Go still uses brace-tracking and regex with misleading `ast` labeling. [SOURCE: phase-2/research/research.md:24-30] [SOURCE: phase-2/research/research.md:676-681]
- **003 Contextador** = `0`. Contextador's live path is a markdown-pointer MCP server over authored artifacts, not a code parser. [SOURCE: phase-3/research/research.md:35-43] [SOURCE: phase-3/research/research.md:195-199]
- **004 Graphify** = `2`. Graphify runs a real AST pass with 12 extractors across 18 extensions, even though Python is much richer than the other languages. [SOURCE: phase-4/research/research.md:621-623]
- **005 Claudest** = `0`. Claudest centers on conversation memory, hooks, and analytics rather than code parsing. [SOURCE: phase-5/research/research.md:15-17] [SOURCE: 005-claudest/external/README.md:39-45]
- **Public (baseline)** = `1`. Public clearly has deeper structural graph behavior than Graphify in prior phase evidence, but this turn re-verified query surfaces rather than reopening parser internals, so the AST score stays conservative. This is an inference from sources. [SOURCE: phase-4/research/research.md:492-503] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:116-238]
- **Dominant:** `004 Graphify` because it is the only system in this set whose current-turn evidence directly proves broad real-AST extraction across many languages. [SOURCE: phase-4/research/research.md:621-623]

### 2. Multimodal support
- **001 Settings** = `-`. Phase 001 is a research audit, not a multimodal extraction system. [SOURCE: phase-1/implementation-summary.md:38-42] [SOURCE: phase-1/decision-record.md:36-43]
- **002 CodeSight** = `0`. CodeSight scans codebase structure, config, middleware, schemas, and components, but the traced system does not extract context from images, screenshots, papers, or conversations. [SOURCE: phase-2/research/research.md:24-30]
- **003 Contextador** = `0`. Contextador's runtime path serves pointer text from `CONTEXT.md` and `briefing.md`; it is ergonomics over authored markdown, not multimodal extraction. [SOURCE: phase-3/research/research.md:195-199] [SOURCE: phase-3/research/research.md:239-248]
- **004 Graphify** = `2`. Graphify's semantic pass explicitly adds per-image-type strategies and a modality-aware pipeline for docs, papers, and images. [SOURCE: phase-4/research/research.md:627-629] [SOURCE: phase-4/research/research.md:681-683]
- **005 Claudest** = `1`. Claudest handles non-code artifacts such as conversations and JSONL analytics, and the marketplace extends into research/content plugins, but it does not unify them into one broad context-extraction surface. [SOURCE: 005-claudest/external/README.md:39-45] [SOURCE: 005-claudest/external/README.md:56-70]
- **Public (baseline)** = `1`. Public already handles non-code docs and conversation/state continuity through Spec Kit Memory, but current shipped evidence does not show image or screenshot extraction. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/README.md:245-260] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:125-163]
- **Dominant:** `004 Graphify` because it is the only system with source-proven multimodal extraction rules spanning code-adjacent docs plus image-aware strategies. [SOURCE: phase-4/research/research.md:627-629] [SOURCE: phase-4/research/research.md:681-683]

### 3. Structural query
- **001 Settings** = `-`. Phase 001 is not a structural query engine. [SOURCE: phase-1/implementation-summary.md:38-42]
- **002 CodeSight** = `1`. CodeSight exposes cached structural MCP summaries and blast-radius/hot-file projections, but not line-precise call-chain tooling. [SOURCE: phase-2/research/research.md:272-279] [SOURCE: phase-2/research/research.md:309-315]
- **003 Contextador** = `0`. Its pointer payload exposes summarized dependencies and API/test lists, not symbol-level caller/import traversal. [SOURCE: phase-3/research/research.md:239-241]
- **004 Graphify** = `1`. Graphify serves structural graph answers through 7 read-only tools, but the MCP layer is text-only and materially weaker than typed structural handlers. [SOURCE: phase-4/research/research.md:669-671]
- **005 Claudest** = `0`. Claudest searches conversations, not code structure. [SOURCE: phase-5/research/research.md:15-17] [SOURCE: 005-claudest/external/plugins/claude-memory/README.md:34-38]
- **Public (baseline)** = `2`. Public explicitly routes structural lookups to `code_graph_query`, and the handler supports outline, callers, imports, and transitive traversal with file/line metadata. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:40-44] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:116-238]
- **Dominant:** `Public` because it is the only column here with current-turn proof for typed structural operations plus transitive traversal. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:116-238]

### 4. Semantic query
- **001 Settings** = `-`. Phase 001 is not a semantic retrieval system. [SOURCE: phase-1/implementation-summary.md:38-42]
- **002 CodeSight** = `0`. CodeSight's reproducible evaluation covers detector accuracy, not embeddings or concept retrieval. [SOURCE: phase-2/research/research.md:329-341]
- **003 Contextador** = `0`. The traced live path has no vector or embedding index behind `context`; it routes to markdown artifacts and pointer extraction instead. [SOURCE: phase-3/research/research.md:239-240]
- **004 Graphify** = `1`. Graphify has semantic LLM extraction and semantic edges, but not a fast embeddings-based semantic search surface. [SOURCE: phase-4/research/research.md:627-629] [SOURCE: phase-4/research/research.md:669-671]
- **005 Claudest** = `0`. Claudest recall is FTS/BM25/LIKE keyword retrieval, not semantic embedding search. [SOURCE: 005-claudest/external/plugins/claude-memory/README.md:34-38] [SOURCE: 005-claudest/external/plugins/claude-memory/README.md:54-58]
- **Public (baseline)** = `2`. Public's semantic lane is explicit: CocoIndex exposes semantic search through embeddings, vector storage, and ranked MCP results. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/SKILL.md:12-13] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/SKILL.md:237-245] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/SKILL.md:267-305]
- **Dominant:** `Public` because CocoIndex is the only source-proven production semantic search backend in the matrix. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/SKILL.md:237-245] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/SKILL.md:267-305]

### 5. Memory / continuity
- **001 Settings** = `-`. Phase 001 is an audit packet, not a continuity system. [SOURCE: phase-1/implementation-summary.md:38-42]
- **002 CodeSight** = `1`. CodeSight persists static assistant-facing artifacts and `.codesight/` summaries across sessions, but not user/session memory. [SOURCE: phase-2/research/research.md:283-301] [SOURCE: phase-2/research/research.md:309-320]
- **003 Contextador** = `1`. Contextador has Mainframe answer replay and some summarized history, but its own phase concludes that Public's continuity surface is deeper. [SOURCE: phase-3/research/research.md:243-247] [SOURCE: phase-3/research/research.md:247-250]
- **004 Graphify** = `1`. Graphify persists `graph.json` and audit artifacts that can be reused later, but it is not a session-memory system. [SOURCE: phase-4/research/research.md:655-667] [SOURCE: phase-4/research/research.md:667-671]
- **005 Claudest** = `2`. Claudest is built around cross-session conversation recall and cached SessionStart continuity via precomputed `context_summary`. [SOURCE: phase-5/research/research.md:15-17] [SOURCE: phase-5/research/research.md:173-184]
- **Public (baseline)** = `2`. Public persists indexed memories, supports intent-aware recovery through `memory_context`, and assembles a composite `session_bootstrap` payload with resume, health, structural context, and next actions. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/README.md:245-260] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:107-217]
- **Dominant:** `Public (tie 005)`. Both reach `2`, but Public wins the tie because its continuity surface is broader than Claudest's branch-memory lane and already merges memory, health, and graph state. [SOURCE: phase-5/research/research.md:17-17] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:107-217]

### 6. Observability
- **001 Settings** = `-`. Phase 001 recommends observability work, but it does not ship instrumentation itself. [SOURCE: phase-1/implementation-summary.md:119-127]
- **002 CodeSight** = `1`. CodeSight has a real F1 harness and opt-in local telemetry, but its token-savings math is heuristic and its telemetry is narrow. [SOURCE: phase-2/research/research.md:329-341] [SOURCE: phase-2/research/research.md:704-705]
- **003 Contextador** = `1`. Contextador records queries served, cache hits, and estimated token usage, but the 93 percent claim is still estimate math rather than benchmark-grade instrumentation. [SOURCE: phase-3/research/research.md:145-153]
- **004 Graphify** = `1`. Graphify emits benchmark/audit outputs and confidence-tagged reports, but it does not instrument live retrieval quality the way Public or Claudest do. [SOURCE: phase-4/implementation-summary.md:48-54] [SOURCE: phase-4/research/research.md:633-635]
- **005 Claudest** = `2`. Claudest's normalized analytics model captures per-turn token, cache, tool, agent, and hook metrics, then projects them into dashboard contracts and trend diagnostics. [SOURCE: phase-5/research/research.md:285-320] [SOURCE: phase-5/research/research.md:322-366]
- **Public (baseline)** = `2`. Public already has implicit feedback logs, shadow scoring, batch learning, consumption logging, evaluation toggles, and extended telemetry controls in the shipped retrieval stack. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:213-225] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:267-275]
- **Dominant:** `Public (tie 005)`. Claudest is the stronger token-analytics exemplar, but Public's shipped observability surface is broader across learning, shadow evaluation, and retrieval telemetry. [SOURCE: phase-5/research/research.md:312-366] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:213-225]

### 7. Hook integration
- **001 Settings** = `-`. Phase 001 discusses hook ideas but ships no hook implementation. [SOURCE: phase-1/implementation-summary.md:38-42] [SOURCE: phase-1/implementation-summary.md:119-127]
- **002 CodeSight** = `0`. CodeSight has CLI flags including `--hook`, but the traced surface is a git/pre-commit style helper, not Claude/OpenCode lifecycle hook integration. This is an inference from sources. [SOURCE: phase-2/research/research.md:694-698]
- **003 Contextador** = `0`. Contextador is a Bun MCP query server and setup flow; current evidence does not show Claude/OpenCode lifecycle hook integration. This is an inference from sources. [SOURCE: phase-3/implementation-summary.md:34-46] [SOURCE: phase-3/research/research.md:35-43]
- **004 Graphify** = `1`. Graphify directly integrates a Claude Code `PreToolUse` nudge, but it is a single focused hook rather than a broader lifecycle hook suite. [SOURCE: phase-4/research/research.md:645-645] [SOURCE: phase-4/implementation-summary.md:44-46]
- **005 Claudest** = `2`. Claudest uses a real hook chain across SessionStart and Stop, with cached summary injection and sync behavior. [SOURCE: phase-5/research/research.md:143-154] [SOURCE: phase-5/research/research.md:173-184]
- **Public (baseline)** = `2`. Public ships hook-driven compaction, session priming, and resume guidance across Claude and Gemini surfaces, and its context server explicitly describes non-hook and hook bootstrap flows. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:146-149] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:215-225] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:104-136]
- **Dominant:** `Public (tie 005)`. Claudest has the stronger single-product hook story, but Public wins the tie on breadth because it already spans multiple runtimes and recovery paths. [SOURCE: phase-5/research/research.md:143-184] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:696-715]

### 8. License compatibility
- **001 Settings** = `-`. Phase 001 is a field report, not licensable source to adopt. [SOURCE: phase-1/decision-record.md:36-43]
- **002 CodeSight** = `2`. CodeSight is MIT-licensed and Node-native, which is a clean fit for Public's stack. [SOURCE: 002-codesight/external/package.json:37-50]
- **003 Contextador** = `0`. Contextador is AGPL-3.0-or-later with a commercial side lane, so this packet repeatedly treats it as concept transfer, not direct source reuse. [SOURCE: phase-3/research/research.md:185-193] [SOURCE: 003-contextador/external/package.json:2-7]
- **004 Graphify** = `2`. Graphify is MIT-licensed. [SOURCE: 004-graphify/external/pyproject.toml:5-12]
- **005 Claudest** = `2`. Claudest's marketplace repo is MIT-licensed. [SOURCE: 005-claudest/external/README.md:7-7] [SOURCE: 005-claudest/external/README.md:199-201]
- **Public (baseline)** = `-`. This row measures compatibility with Public's stack; the baseline is the target stack itself, so there is no external adoption gate to score here. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/README.md:41-48]
- **Dominant:** `002 CodeSight (tie 004/005)`. All three MIT systems score `2`; CodeSight gets the tie call because it is the cleanest direct fit for Public's Node-first implementation lane. This tie-break is an inference from sources. [SOURCE: 002-codesight/external/package.json:37-50] [SOURCE: 004-graphify/external/pyproject.toml:5-12] [SOURCE: 005-claudest/external/README.md:199-201]

### 9. Runtime portability
- **001 Settings** = `-`. Phase 001 is not an executable runtime surface. [SOURCE: phase-1/implementation-summary.md:38-42]
- **002 CodeSight** = `2`. CodeSight is a straightforward Node.js CLI with `node >=18`, which matches Public's existing runtime direction cleanly. [SOURCE: 002-codesight/external/package.json:9-15] [SOURCE: 002-codesight/external/package.json:44-50]
- **003 Contextador** = `0`. Contextador is Bun-native and explicitly framed in its own phase as a runtime-incompatible reference unless Public chooses Bun. [SOURCE: phase-3/research/research.md:175-183] [SOURCE: 003-contextador/external/package.json:27-33] [SOURCE: 003-contextador/external/package.json:51-53]
- **004 Graphify** = `1`. Graphify is portable in the sense that it is a normal Python package, but it still adds a distinct Python dependency stack and optional extras beyond Public's current Node core. [SOURCE: 004-graphify/external/pyproject.toml:10-18] [SOURCE: 004-graphify/external/README.md:32-35]
- **005 Claudest** = `1`. Claudest's hooks and skills are cross-platform Python, but they still assume the Claude `/plugin` runtime and plugin install surface. [SOURCE: 005-claudest/external/README.md:15-21] [SOURCE: 005-claudest/external/plugins/claude-memory/README.md:13-13] [SOURCE: 005-claudest/external/plugins/claude-memory/README.md:80-80]
- **Public (baseline)** = `1`. Public is already usable in its own workspace, but the baseline is a split runtime stack: `system-spec-kit` is Node 20+ while CocoIndex requires Python 3.11+ for install/indexing. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/package.json:11-13] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/SKILL.md:415-421]
- **Dominant:** `002 CodeSight` because it is the only contender here that lands cleanly inside Public's existing primary Node runtime without a second runtime boundary or host-specific plugin surface. [SOURCE: 002-codesight/external/package.json:44-50]

## Public's true gaps (no system fills)

Every capability has at least one system scoring `2`.

## Aggregate dominance count

| System | Capabilities where dominant |
|---|---:|
| 001 | 0 |
| 002 | 2 |
| 003 | 0 |
| 004 | 2 |
| 005 | 0 |
| Public | 5 |

## Footnotes / caveats

- `001 Settings` is treated as a research artifact rather than a runnable product, so the N/A scores are intentional rather than missing data.
- `Public (baseline)` license compatibility is marked `-` because the row is an adoption gate for external systems, and Public is the target stack itself.
- `Public` AST coverage is intentionally conservative at `1`: this turn re-verified query/runtime surfaces directly, but parser breadth was only indirectly evidenced by prior phase research.
- Dominance ties resolved in Public's favor were broken by broader shipped coverage, not by claiming higher point scores.
