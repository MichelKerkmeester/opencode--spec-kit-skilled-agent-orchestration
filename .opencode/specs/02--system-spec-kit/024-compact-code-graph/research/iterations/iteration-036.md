# Iteration 036: AI Coding Tools — Code Context Strategies Comparison

## Focus

Compare how leading AI coding tools build, index, retrieve, and budget code context, with emphasis on code-graph-like structure, AST usage, embeddings, hybrid retrieval, and prompt assembly strategies that scale to large repositories.

## Findings

1. The market leader pattern is not "pure code graph" and not "pure embeddings." The strongest tools all use layered context systems that combine a small always-on working set with indexed retrieval and optional persistent instructions or memory.

   | Tool | Publicly visible context strategy | Selection model | Code-graph / structure signal | Public budget signal |
   | --- | --- | --- | --- | --- |
   | Cursor | Automatic codebase indexing via file embeddings, plus rules/AGENTS-style persistent instructions and the current chat working set | Hybrid: active session context + embedding retrieval + user-attached files/rules | No public full graph architecture; structure is implied through file retrieval and rules | Normal mode: 200k tokens; Max Mode: up to model max, including 1M on some models |
   | Continue.dev | Current agent mode is tool-first (file exploration, search, git, MCP, rules). Legacy `@Codebase` and custom RAG are embedding-first with reranking | Hybrid, but increasingly agentic/tool-driven instead of passive vector recall alone | AST is recommended as an optional chunking strategy, not the default system of record | No fixed public prompt budget; custom RAG docs recommend retrieve ~50, rerank, return top 10 |
   | Sourcegraph Cody | Search-centric hybrid retrieval using keyword search, Sourcegraph Search, code graph, local indexing, and agentic context fetching | Hybrid search and tool retrieval | Yes, explicitly: code graph and symbol-aware local index (`symf`) | Exact prompt budget not public |
   | Aider | Repo-map: structural summary of the whole repo built from symbols/tags, then graph-ranked into a compact prompt | Structural-first, then file expansion on demand | Yes, explicitly: repo dependency graph + tree-sitter tags | Repo-map defaults to 1k tokens and can expand dynamically |
   | GitHub Copilot | Layered prompt assembly: system/custom instructions, conversation, implicit editor context, explicit refs, tool outputs, and workspace indexing | Hybrid: implicit local context + indexed retrieval + tools | Indirectly yes via repository indexing and code search, but public docs emphasize embeddings and indexing more than graph traversal | Exact retrieval budget not public |
   | Amazon Q Developer | Explicit `@workspace` triggers local workspace index retrieval of relevant chunks | Indexed chunk retrieval + current prompt context | No public graph design | Exact retrieval budget not public |
   | Codeium / Windsurf | RAG-based context engine over current/open files plus indexed local or remote codebases, with memories/rules/@mentions | Hybrid RAG with persistent context layers | No public full graph design; retrieval engine plus memories/rules | Exact retrieval budget not public; docs mention expanded context lengths and higher indexing limits on paid tiers |

2. AST-first approaches are the exception, not the rule. Aider is the clearest example of a structure-first system: it builds a repository map from key symbols and uses a graph ranking algorithm to fit the most relevant structural summary into a small token budget. Continue's docs mention AST-based chunking as the most exact chunking strategy for custom RAG, but Continue does not position AST parsing as its default modern context path. Sourcegraph is the main "graph-aware hybrid" example in production: its public docs explicitly combine keyword search, Sourcegraph Search, and code graph signals, and its local `symf` index adds symbol-aware retrieval on-device. Cursor, Copilot, Amazon Q, and Windsurf publicly emphasize indexing plus retrieval, but do not expose a detailed AST or whole-graph prompt builder.

3. Embeddings are still essential, but mostly for recall, not as the entire retrieval stack. Cursor publicly says it indexes files by computing embeddings. Continue's custom RAG guidance centers on embedding models, vector databases, and reranking. GitHub Copilot's 2025 VS Code embedding update says embeddings power context retrieval for chat, agent, edit, and ask mode. Windsurf describes its system as RAG-based and retrieval-driven. The practical pattern is: embeddings find candidate regions; secondary signals decide what actually reaches the LLM.

4. The best tools reserve a small "always include" layer and a separate "retrieved on demand" layer.

   Common always-on context:
   - Current file, active selection, nearby conversation state, and explicit user attachments.
   - Persistent rules/instructions (`.cursor/rules`, `.continue/rules`, Copilot customizations/Spaces, Windsurf memories/rules).

   Common retrieved context:
   - Indexed code snippets from local or remote search.
   - Symbol or file summaries.
   - Tool outputs from live exploration.

   This is visible especially in Copilot's explicit context stack, VS Code's generic Copilot context model, Windsurf's "current/open files plus indexed whole codebase" model, and Aider's split between repo-map summary and full file additions.

5. Large codebases are handled with precomputation, incrementality, and scope control, not by dumping more code into the prompt.

   Shared patterns across tools:
   - Incremental indexing: Cursor indexes new files incrementally; Amazon Q incrementally updates after initial workspace indexing; Sourcegraph's `symf` reindexes on changes.
   - Ignore/filter support: Cursor honors ignore files; Amazon Q filters `.gitignore` and non-essential files; Sourcegraph exposes context filters; Windsurf exposes ignore/config surfaces.
   - Remote/local split: Copilot supports remote or local workspace indexes; Windsurf supports remote repositories on Teams/Enterprise; Sourcegraph uses Sourcegraph Search across remote and local codebases.
   - Pre-ranked summaries instead of full-file ingestion: Aider's repo-map is the clearest compact structural example.

   For repositories larger than roughly 10K files, the operationally successful pattern is "persistent index plus narrow prompt composer," not "re-scan the repo every turn."

6. Context selection into the final LLM prompt is usually multi-stage:

   1. Seed from the user's current activity.
   2. Retrieve candidate snippets from one or more indexes.
   3. Rerank or graph-rank those candidates.
   4. Keep only the top slices that fit a reserved prompt budget.
   5. Let the model or agent fetch more only if needed.

   Evidence by tool:
   - Continue explicitly documents a retrieve-then-rerank flow: retrieve about 50 vector hits and rerank down to about 10.
   - Aider graph-ranks its repo map into the active token budget and expands the map when no explicit files are already in chat.
   - Copilot/VS Code describes a layered prompt that includes implicit context, explicit references, codebase search results, and tool outputs.
   - Sourcegraph now exposes "agentic context fetching," where a mini-agent uses search and tools to gather additional context before answering.

7. Publicly disclosed token budgets are rare; prompt composers are increasingly proprietary. The clearest public numbers from this research are:

   - Cursor normal mode: about 200k tokens.
   - Cursor Max Mode: up to the model maximum, including 1M-token models.
   - Aider repo-map: default 1k tokens, with dynamic expansion and a default multiplier of 2 when no files are in chat.
   - Continue custom RAG: not a final prompt budget, but the docs explicitly recommend retrieve about 50 results, rerank, then keep the top 10; they also cite `voyage-code-3` with 16k-token embedding input length for chunking decisions.

   For Copilot, Cody, Amazon Q, and Windsurf, public docs explain the retrieval stack but not a stable code-context token allotment. The likely reason is that modern systems budget dynamically by model, mode, and current session state. That is an inference from the docs, not an explicit vendor statement.

8. Sourcegraph Cody is the clearest production example of "code graph as one signal among several," not "graph as the only answer." Sourcegraph's docs say Cody uses keyword search, Sourcegraph Search, and code graph together; its local indexing docs show `symf` as a lightweight persistent local symbol search layer; its FAQ says enterprise embeddings were removed in favor of Sourcegraph Search as a primary context provider; and newer docs add agentic context fetching on top. That combination suggests a mature architecture: structural signals and search are useful, but they win most when embedded inside a broader retrieval pipeline.

9. GitHub Copilot and VS Code show the direction of travel for state of the art: context engineering is becoming a first-class subsystem. The VS Code docs describe prompt assembly as a stack of system instructions, customizations, user message, conversation history, implicit context, explicit references, and tool outputs. GitHub's 2025 embedding update shows that retrieval quality, index footprint, and latency are being optimized as core product metrics, not treated as plumbing. Copilot Memory adds another layer: persistent, repository-specific facts with citations that are revalidated against the current branch before reuse. This is much closer to "context operating system" behavior than to legacy autocomplete.

10. The current state of the art for code-aware context selection is a compact hybrid:

   - Use embeddings or semantic search for recall.
   - Use structure (symbols, imports, dependency edges, code graph, or repo map) for precision and coverage control.
   - Keep the prompt budgeted into lanes: instructions, working set, retrieved snippets, structural summary, tool outputs.
   - Persist indices and update incrementally.
   - Give the user and the agent explicit control over scope (`@workspace`, `@mentions`, pinned context, rules, context filters).
   - Prefer compact summaries or graph neighborhoods over raw whole-repo dumps.

   The evidence does not support betting on a single monolithic code graph prompt. It supports hybrid retrieval with structure-aware reranking and compact summaries.

## Evidence

1. Cursor codebase indexing and rules:
   - https://docs.cursor.com/context/codebase-indexing
   - https://docs.cursor.com/context/rules
   - https://docs.cursor.com/context/max-mode
   - https://docs.cursor.com/models

2. Continue.dev current agent-mode guidance and custom RAG:
   - https://docs.continue.dev/guides/codebase-documentation-awareness
   - https://docs.continue.dev/guides/custom-code-rag
   - https://docs.continue.dev/customize/model-types/reranking

3. Sourcegraph Cody context and indexing:
   - https://sourcegraph.com/docs/cody/core-concepts/context
   - https://sourcegraph.com/docs/cody/core-concepts/local-indexing
   - https://sourcegraph.com/docs/cody/capabilities/agentic-chat
   - https://sourcegraph.com/docs/cody/faq
   - https://sourcegraph.com/blog/cody-is-generally-available

4. Aider repo-map and token controls:
   - https://aider.chat/docs/repomap.html
   - https://aider.chat/docs/config/options.html
   - https://aider.chat/docs/faq.html

5. GitHub Copilot / VS Code context assembly and retrieval:
   - https://code.visualstudio.com/docs/copilot/concepts/context
   - https://docs.github.com/en/copilot/concepts/context
   - https://docs.github.com/en/copilot/how-tos/provide-context
   - https://github.blog/news-insights/product-news/copilot-new-embedding-model-vs-code/
   - https://docs.github.com/en/copilot/concepts/agents/copilot-memory
   - https://docs.github.com/en/copilot/concepts/completions/code-referencing

6. Amazon Q Developer workspace context:
   - https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/workspace-context.html
   - https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/code-reviews.html

7. Windsurf / Codeium context engine:
   - https://docs.windsurf.com/context-awareness/windsurf-overview

## New Information Ratio (0.0-1.0)

0.78

## Novelty Justification

This iteration adds a broad external comparison that was not covered in the prior implementation-focused hook and repo research. The new value is not just per-tool fact collection; it is the synthesis that:

- successful products converge on hybrid context pipelines rather than single-technique architectures,
- Aider is the clearest proof that compact structural summaries can be useful without full semantic indexing,
- Sourcegraph is the clearest proof that code-graph signals are strongest when fused with search rather than exposed as a standalone prompt artifact,
- Copilot and VS Code now treat prompt assembly and retrieval quality as product-level systems,
- public budget disclosures are sparse, which itself is an implementation signal: modern prompt composers are dynamic and model-aware.

## Recommendations for Our Implementation

1. Build a hybrid compact-code-graph channel, not a graph-only channel. Use semantic retrieval for recall, then use symbol/graph signals to refine and compress the final context.

2. Treat Aider's repo-map as the best reference pattern for a compact structural layer. A repo-wide symbol map that fits in a 1k-4k token lane is more actionable than trying to serialize a full graph.

3. Separate the system into three artifacts:
   - semantic index for broad recall,
   - symbol/relationship index for structural expansion,
   - prompt composer with explicit budget lanes.

4. For large repositories, make indexing incremental and file-scoped from day one. Cursor, Amazon Q, and Sourcegraph all expose incremental updates; Continue's guidance also recommends incremental indexing once the pipeline is proven.

5. Use graph expansion only around retrieved seeds. Start from the top semantic hits, then expand to nearby symbols/imports/callers/callees for one or two hops. Do not inject a whole-project graph.

6. Add manual scoping controls early: file pinning, symbol pinning, ignore rules, and "workspace vs local selection" style switches. Every successful tool gives users some way to narrow context.

7. Reserve a small fixed token lane for structural summary and keep it separate from retrieved raw code. This reduces prompt volatility and mirrors the strongest public patterns:
   - Aider's repo-map,
   - Copilot's layered prompt assembly,
   - Windsurf's default-context split,
   - Sourcegraph's multi-source retrieval.

8. Plan for evaluation at the retrieval layer, not just the answer layer. Copilot's embedding update and Continue's reranking guidance both imply that retrieval quality, latency, and index size should be tracked as first-class metrics.

9. If we want a v1 that is compact and low-risk, the best starting architecture is:
   - active-file and user-pinned context,
   - semantic top-k retrieval,
   - compact symbol map for the retrieved neighborhood,
   - optional on-demand graph expansion only when the model asks for it.

10. Avoid making the graph format itself the product. The better product boundary is "relevant context selection with structural awareness." That aligns with what the strongest tools actually ship.
