# Iteration 039: Compact Code Representations for LLM Context

## Focus

Research compact, token-efficient ways to represent source code for LLM consumption, with emphasis on repository maps, skeletonization, summary quality, chunking granularity, prompt formatting, and the trade-off between broad context coverage and implementation detail.

## Findings

1. The main families of compact code representations are:
   - Signature-only views: function names, parameters, return types, decorators, inheritance, exported constants, and docstrings without bodies.
   - Skeleton views: preserve file/module/class/function structure while replacing implementation bodies with ellipses, summaries, or placeholders.
   - Repo maps or tag maps: file path plus top-ranked symbols and short structural excerpts, usually ranked to fit a token budget.
   - AST/symbol/graph metadata: definitions, references, call edges, inheritance edges, imports, and doc comments instead of raw code bodies.
   - Natural-language summaries: function, class, module, or repository descriptions generated from code plus context.
   - Hierarchical retrieval bundles: start with broad compact context, then expand only the most relevant files/functions to fuller code.
   - Learned prompt compression: compress the prompt itself by dropping low-value tokens while trying to preserve semantics.

2. Aider's repo-map is a strong practical example of a compact representation. It sends the LLM a repository-wide outline containing file paths plus the most important classes/functions with signatures and a few critical definition lines, rather than full file bodies. Aider explicitly says it selects only the most relevant parts of the map using a graph-ranking algorithm over a dependency graph and fits the result to a token budget controlled by `--map-tokens`, which defaults to about 1k tokens. Under the hood, the map is built with tree-sitter, using definitions and references to identify important identifiers.

   Aider-style shape, simplified:

   ```text
   src/auth/service.py
   │class AuthService:
   │    def login(self, email: str, password: str) -> Session
   │    def logout(self, session_id: str) -> None
   │
   src/auth/tokens.py
   │def issue_token(user_id: str, ttl_seconds: int) -> str
   │def verify_token(token: str) -> TokenClaims
   ```

   This format is compact because it preserves:
   - file location,
   - API surface,
   - object boundaries,
   - a rough dependency/navigation map.

   It intentionally omits:
   - most control flow,
   - low-level algorithm details,
   - repetitive implementation code.

   Practical conclusion: repo maps are best as stage-1 context, not as the only context for edits touching tricky business logic.

3. Code skeletonization means preserving structural and semantic scaffolding while stripping away implementation detail. In practice, a skeletonized file shows the module layout, imports, public interfaces, type signatures, doc comments, class hierarchies, and maybe important constants, but hides most method bodies.

   Example:

   ```python
   class BillingService(PaymentGateway):
       """Creates invoices and charges saved payment methods."""

       def create_invoice(self, customer_id: str, items: list[InvoiceItem]) -> Invoice:
           ...

       def charge_invoice(self, invoice_id: str, retry: bool = False) -> ChargeResult:
           ...

       def _load_customer_profile(self, customer_id: str) -> CustomerProfile:
           ...
   ```

   This is useful when the model needs to understand:
   - system shape,
   - public capabilities,
   - likely edit locations,
   - how files relate.

   It is unsafe when the missing bodies contain the real answer, such as subtle validation logic, mutation order, concurrency behavior, or security checks.

4. Effective function/class summaries for AI consumption are purpose-oriented, not merely body-descriptive. Recent research is useful here:
   - Ding et al. found that function signatures alone can outperform full source as summarization input in some settings, suggesting that compact interface signals carry more value than expected.
   - Su et al. and the later Journal of Systems and Software version show that caller-context summaries help answer "why does this method exist?" and can reduce prompt size substantially.
   - Makharev and Ivanov show that adding class and repository context improves summary quality beyond function-only summarization.

   The best compact summaries therefore should include:
   - Role: what responsibility this symbol has in the system.
   - Inputs/outputs: important parameters, return values, side effects, thrown errors.
   - Dependencies: key callees, services, storage, or events touched.
   - Constraints: invariants, auth rules, performance assumptions, ordering assumptions.
   - Call context: who calls it and why it exists, not just how it works.

   Good AI-facing summary template:

   ```text
   Symbol: create_invoice(customer_id, items) -> Invoice
   Purpose: builds a persisted invoice for checkout and renewal flows.
   Uses: pricing rules, tax service, invoice repository.
   Side effects: writes invoice row and line items.
   Called by: checkout handler, subscription renewal worker.
   Important constraints: items must already be normalized; taxes are computed before persistence.
   ```

5. The optimal balance between code detail and context breadth is progressive disclosure:
   - Stage 1: broad compact map of many files.
   - Stage 2: fuller skeletons or summaries for the most relevant files/classes.
   - Stage 3: full bodies only for the exact symbols being edited, debugged, or verified.

   This is the recurring pattern across practical tools and research:
   - Aider uses a repo map because whole-file context is too bulky.
   - Cody retrieves ranked snippets from multiple sources and then globally ranks them before prompt assembly.
   - RepoCoder iteratively retrieves repository context instead of sending the whole repo at once.

   Practical inference from the sources: the best balance is usually not "full code vs summary" but "coarse context first, selective expansion second."

6. Chunking strategy strongly affects code understanding:
   - File-level chunks preserve imports and nearby context, but waste tokens and can bury the relevant symbol in noise.
   - Function-level chunks maximize precision for retrieval and summarization, and are often the best default for embedding/search.
   - Class-level chunks work better for OO code when behavior is distributed across methods sharing state.
   - Hierarchical chunking is best when you need both retrieval precision and broader context: file summary -> class summary -> function body.

   Evidence points in the same direction:
   - Cody ranks snippets, not whole files, and combines keyword search, Sourcegraph search, and code graph relationships.
   - LangChain-style recursive splitting exists because one-size chunks are brittle.
   - Code summarization research shows class/repository context can improve output beyond isolated function input.

   Recommended rule of thumb:
   - Use function-level as the default retrieval unit.
   - Attach class/file headers and imports as lightweight parent context.
   - Promote to class-level when shared state or inheritance matters.
   - Promote to file-level only for tiny single-purpose files or import-heavy procedural scripts.

7. Relevant research on token-efficient code or prompt representations includes:
   - RepoCoder (2023): iterative retrieval-generation for repository-level code completion, showing repo context should be retrieved in stages rather than dumped wholesale.
   - Lost in the Middle (2024): long contexts degrade when relevant information sits in the middle, which argues for ranking, reordering, and compression instead of naive stuffing.
   - LLMLingua (2023): coarse-to-fine prompt compression with up to 20x compression and little performance loss on tested tasks.
   - LongLLMLingua (2024): prompt compression plus reordering for long contexts; improved performance while using fewer tokens and directly targets position bias.
   - Do Code Summarization Models Process Too Much Information? (2024): signature-based input can beat full code input for summarization.
   - Context-aware Code Summary Generation (2024/2026): caller-summary context can reduce prompt size by 81% while improving purpose-level summaries.
   - Code Summarization Beyond Function Level (2025): class and repository context improve summarization quality, especially when retrieved chunks and few-shot context are added.

8. High compression is possible, but not uniformly safe. The sources suggest a practical compression ladder:
   - Signature-only or symbol-only compression can remove most body tokens and still preserve API/navigation meaning.
   - Natural-language contextual summaries can reduce prompt size sharply; the context-aware summarization work reports 81% token reduction by using caller summaries rather than full raw context.
   - Learned prompt compression can go much further: LLMLingua reports up to 20x compression with limited performance loss on its evaluated tasks.
   - LongLLMLingua reports around 4x fewer tokens while improving accuracy in some long-context evaluations, which shows that smarter compression can beat naive full-context prompting.

   However, semantic loss rises quickly when the missing details include:
   - control flow edge cases,
   - non-obvious mutation order,
   - hidden I/O or stateful behavior,
   - subtle validation/security rules,
   - algorithmic tricks.

   Practical inference: 4x-10x compression is often realistic for orientation and retrieval. Reliable edit-grade compression is lower unless you have a staged expansion path back to full code.

9. Best formatting practices differ somewhat by model family:
   - Claude: Anthropic explicitly recommends putting longform data at the top, keeping the query near the end, and wrapping multi-document context in XML tags with source metadata.
   - Gemini: Google recommends structured prefixes for simple prompts and XML/delimiters for complex prompts. Gemini's large context makes raw inclusion more viable than before, but Google still warns against sending unnecessary tokens.
   - OpenAI GPT models: practical best practice is stable prompt structure, reusable cached prefixes, and clean separation of instructions/context/examples. For expensive repeated context, prompt caching matters directly.

   Cross-model formatting pattern that should be robust:

   ```xml
   <task>
   Explain how invoice retries work and identify the safest edit point.
   </task>

   <repository_map>
   ... compact symbol map here ...
   </repository_map>

   <candidate_symbols>
   ... 3-8 summaries with signatures, callers, side effects ...
   </candidate_symbols>

   <expanded_code>
   ... only the 1-2 full bodies most likely to matter ...
   </expanded_code>
   ```

   For our implementation, this means compact code context should probably be emitted as structured sections, not as one undifferentiated blob.

10. Tooling generally handles the full-code vs summary trade-off with hybrid retrieval:
   - Aider: broad repo-map first, full files on demand.
   - Cody: multi-source retrieval plus snippet ranking and code graph signals.
   - Code2Prompt: structured prompt generation from filtered code trees, useful when you want a deterministic prompt artifact.
   - Prompt-compression research: compress raw context itself when token cost dominates.

   The common winning pattern is:
   - keep the whole repository available indirectly,
   - expose only compressed structure initially,
   - expand a small working set to raw code,
   - preserve a clear path from summary -> skeleton -> full implementation.

   That architecture maps well to `024-compact-code-graph`: our compact representation should not try to replace source code entirely. It should act as a routing layer that helps the model decide what deserves full-token expansion.

## Evidence

1. Aider repository map docs: concise repository map with file paths, important symbols, critical definition lines, graph ranking, and `--map-tokens` budget.  
   URL: https://aider.chat/docs/repomap.html

2. Aider repo-map blog post: tree-sitter extraction of definitions/references; whole-file context is bulky; repo maps solve the code-context problem more efficiently.  
   URL: https://aider.chat/2023/10/22/repomap.html

3. Sourcegraph Cody context docs: hybrid retrieval using keyword search, Sourcegraph search, and code graph relationships.  
   URL: https://sourcegraph.com/docs/cody/core-concepts/context

4. Sourcegraph code graph docs: definitions, references, symbols, and doc comments as structural context beyond plain text.  
   URL: https://sourcegraph.com/docs/cody/core-concepts/code-graph

5. Sourcegraph blog on Cody: snippet-level BM25-style ranking, then global ranking across context providers before prompt assembly.  
   URL: https://sourcegraph.com/blog/how-cody-understands-your-codebase

6. Code2Prompt docs: deterministic prompt generation from directory traversal, tree structure, filtering, templating, and token counting.  
   URL: https://code2prompt.dev/docs/welcome/

7. Ding et al., 2024, "Do Code Summarization Models Process Too Much Information? Function Signature May Be All What Is Needed": low input limits can still work; signatures can outperform full code; human study favored signature-based input.  
   URL: https://dl.acm.org/doi/10.1145/3652156  
   Mirror used for accessible abstract: https://colab.ws/articles/10.1145%2F3652156

8. Su et al., "Context-aware Code Summary Generation": summaries should explain why a method exists in the broader project, not only what it does internally.  
   URL: https://arxiv.org/abs/2408.09006

9. Journal of Systems and Software version, "Context-aware code summary generation": caller-summary context reduced prompt size by 81% and improved quality.  
   URL: https://doi.org/10.1016/j.jss.2025.112580  
   Accessible abstract: https://www.sciencedirect.com/science/article/pii/S0164121225002493

10. Makharev and Ivanov, "Code Summarization Beyond Function Level": class/repository context, few-shot learning, and retrieved code chunks improve summarization beyond isolated functions.  
   URL: https://arxiv.org/abs/2502.16704

11. RepoCoder: iterative retrieval-generation for repository-level code completion with over 10% improvement over in-file baseline in all settings.  
   URL: https://arxiv.org/abs/2303.12570

12. Lost in the Middle: long-context performance drops when relevant information is buried in the middle, motivating ranking and reordering.  
   URL: https://doi.org/10.1162/tacl_a_00638

13. LLMLingua: coarse-to-fine prompt compression with up to 20x compression and little performance loss on evaluated tasks.  
   URL: https://arxiv.org/abs/2310.05736

14. LongLLMLingua: addresses position bias and sparse key information; reports up to 21.4% improvement with about 4x fewer tokens in one benchmark.  
   URL: https://arxiv.org/abs/2310.06839

15. Anthropic long-context guidance: place longform data near the top, queries near the end, and structure documents with XML tags and source metadata.  
   URL: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices

16. Google prompt-structure guidance: use prefixes for simple prompts and XML/delimiters for complex prompts.  
   URL: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/learn/prompts/structure-prompts

17. Google Gemini long-context guidance: large-context models make direct inclusion more viable, but unnecessary tokens should still be avoided; context caching helps repeated use.  
   URL: https://ai.google.dev/gemini-api/docs/long-context

18. OpenAI prompting docs: reusable prompts and prompt caching are important for repeated structured context.  
   URL: https://developers.openai.com/api/docs/guides/prompting

## New Information Ratio (0.0-1.0)

0.73

## Novelty Justification

This iteration adds concrete external evidence for a representation strategy the packet can directly implement: repository maps, skeleton views, interface-first summaries, hierarchical chunking, and prompt compression are now tied to both practical tooling and research literature. The strongest new information is not that "compression exists," but that multiple independent lines of evidence converge on the same architecture: broad structural map first, then selective expansion to fuller code only where needed. The iteration also adds useful quantitative anchors: up to 20x prompt compression (LLMLingua), about 4x fewer tokens with improved long-context performance (LongLLMLingua), 81% token reduction from caller-summary context, and empirical evidence that signatures can outperform full code for summarization input.

## Recommendations for Our Implementation

1. Implement a three-tier context format:
   - Tier A: repository map with file paths, symbols, signatures, imports, and lightweight dependency edges.
   - Tier B: skeletonized symbol expansions for shortlisted files/classes.
   - Tier C: full code bodies only for the active edit/debug set.

2. Make function-level chunks the default indexing and retrieval unit, but always attach lightweight parent context:
   - file path,
   - enclosing class/module,
   - imports,
   - immediate callers/callees when available.

3. Add an explicit "AI summary schema" for each symbol:
   - purpose,
   - signature,
   - dependencies,
   - side effects,
   - callers,
   - constraints/invariants.

4. Treat skeletonization as a first-class output mode:
   - preserve signatures and docstrings,
   - replace bodies with `...` or 1-3 line summaries,
   - optionally keep only control-flow markers for complex functions.

5. Build the compact representation as structured prompt sections, not plain concatenated text. XML-like sections or explicit headers should make the output easier to reuse across Claude, Gemini, and GPT-style models.

6. Add progressive expansion logic:
   - if the model requests algorithm details, validation rules, or state changes, automatically promote the symbol from summary -> skeleton -> full body.

7. Prefer ranking and reordering over naive stuffing. "Lost in the middle" and LongLLMLingua both suggest that context order matters, so the most relevant compact items should be placed near the end of the long context block or near the task-critical region depending on model-specific formatting.

8. Measure compression quality on edit tasks, not only summary quality. A representation that is good for explanation may still be too lossy for modification, so evaluation should include:
   - navigation accuracy,
   - symbol selection accuracy,
   - edit success rate,
   - token cost,
   - escalation rate to full code.

9. Keep full-source fallback mandatory. The compact code graph should be a routing and budgeting layer, not a substitute for source when exact semantics matter.
