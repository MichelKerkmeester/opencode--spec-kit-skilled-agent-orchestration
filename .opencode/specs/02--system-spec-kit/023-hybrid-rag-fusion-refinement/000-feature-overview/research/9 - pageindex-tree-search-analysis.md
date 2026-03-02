# PageIndex Tree Search Analysis

## Metadata

| Field         | Value                                                    |
| ------------- | -------------------------------------------------------- |
| Research ID   | RESEARCH-140-009                                         |
| Status        | Complete                                                 |
| Date          | 2026-02-26                                               |
| Repository    | https://github.com/VectifyAI/PageIndex                   |
| Focus         | Tree search implementation, retrieval mechanism, LLM-guided node selection |
| Confidence    | High (Grade A/B evidence from source code and documentation) |

---

## Investigation Report

### Request Summary

Investigate VectifyAI/PageIndex's tree search implementation to understand how LLM-guided hierarchical traversal works as a retrieval mechanism, with specific focus on: prompt patterns, node selection, expert knowledge injection, multi-document search, and context extraction. Assess applicability to spec-kit memory retrieval as a complement to embedding-based search.

### Key Findings

1. PageIndex replaces embedding similarity with LLM reasoning over hierarchical document structures, achieving 98.7% accuracy on FinanceBench.
2. The tree search prompt pattern is remarkably simple: pass a JSON tree (titles + summaries, no full text) and ask the LLM to select relevant nodes with explicit reasoning.
3. Expert knowledge injection requires zero model retraining -- domain preferences are injected directly into the search prompt as additional context.
4. Multi-document search uses a two-stage pipeline: first select relevant documents (via description, metadata, or semantic pre-filter), then tree-search within selected documents.
5. The system uses temperature=0 for deterministic reasoning and a structured JSON output format with explicit "thinking" and "node_list" fields.

### Recommendations

See Section 7 (Solution Design) below.

---

## Executive Overview

PageIndex is a reasoning-based RAG system that eliminates vector databases and artificial document chunking. Instead, it:

1. **Indexes** documents into hierarchical tree structures (resembling a table of contents)
2. **Searches** by having an LLM reason over the tree to select relevant nodes
3. **Extracts** full text from selected nodes for answer generation

The core insight: LLMs can navigate document structure like a human expert, reading section titles and summaries to decide where relevant information lives, rather than relying on embedding cosine similarity.

### Architecture Flow

```
Document -> Tree Construction -> Tree Structure (JSON)
                                        |
Query + Tree Structure -> LLM Reasoning -> Selected Node IDs
                                                    |
Node IDs -> Text Extraction -> Context Assembly -> Answer Generation
```

---

## Core Architecture

### 1. Tree Construction (Indexing Phase)

**Entry point:** `page_index_main()` in `pageindex/page_index.py`

[SOURCE: pageindex/page_index.py - tree_parser function]

The indexing pipeline:

1. **PDF pages extracted** via `get_page_tokens()` returning `(text, token_count)` tuples per page
2. **TOC detection** via `check_toc()` examining first N pages (configurable, default 20)
3. **Structure extraction** via `meta_processor()` with three modes:
   - `process_toc_with_page_numbers` -- uses explicit page indices from TOC
   - `process_toc_no_page_numbers` -- extracts structure without page references
   - `process_no_toc` -- generates structure from document content alone (fallback)
4. **Title validation** via `check_title_appearance_in_start_concurrent()` using async LLM calls
5. **Post-processing** via `post_processing()` building hierarchical tree from flat TOC
6. **Large node handling** via `process_large_node_recursively()` splitting nodes exceeding limits

**Fallback logic:** If accuracy drops below 60%, the system falls back to simpler processing modes.

**Configuration defaults** from `config.yaml`:

```yaml
model: gpt-4o-2024-11-20
toc_check_page_num: 20
max_page_num_each_node: 10
max_token_num_each_node: 20000
if_add_node_id: yes
if_add_node_summary: yes
if_add_doc_description: no
if_add_node_text: no
```

[SOURCE: pageindex/config.yaml]

### 2. Node Data Structure

Each node in the tree follows this exact format:

```json
{
    "structure": "1.2.3",
    "title": "Section Title",
    "node_id": "0003",
    "physical_index": 9,
    "start_index": 9,
    "end_index": 14,
    "appear_start": "yes",
    "summary": "LLM-generated summary of section content",
    "nodes": [
        { "...child nodes..." }
    ]
}
```

[SOURCE: tests/results/2023-annual-report-truncated_structure.json]

**Field semantics:**

| Field            | Purpose                                                      |
| ---------------- | ------------------------------------------------------------ |
| `structure`      | Dotted numeric index (e.g., "1.2.3") encoding tree position  |
| `title`          | Section heading text                                         |
| `node_id`        | Four-digit unique identifier (e.g., "0000", "0001")          |
| `physical_index` | Page number where section begins                             |
| `start_index`    | First page of section content                                |
| `end_index`      | Last page of section content                                 |
| `appear_start`   | Whether title appears on start_index page (yes/no)           |
| `summary`        | LLM-generated description of section main points             |
| `nodes`          | Array of child nodes (empty array [] for leaf nodes)         |

### 3. Summary Generation

Node summaries are generated asynchronously:

```python
async def generate_node_summary(node, model=None):
    prompt = f"""You are given a part of a document, your task is to generate
a description of the partial document about what are main points covered in
the partial document..."""
    response = await ChatGPT_API_async(model, prompt)
    return response
```

[SOURCE: pageindex/utils.py - generate_node_summary]

Document-level descriptions for multi-document filtering:

```python
def generate_doc_description(structure, model=None):
    prompt = f"""Your are an expert in generating descriptions for a document.
You are given a structure of a document. Your task is to generate a one-sentence
description for the document, which makes it easy to distinguish the document
from other documents..."""
    response = ChatGPT_API(model, prompt)
    return response
```

[SOURCE: pageindex/utils.py - generate_doc_description]

---

## Technical Specifications: The Tree Search Mechanism

### The Core Tree Search Prompt

This is the exact prompt template used for tree search retrieval:

```
You are given a question and a tree structure of a document.
Each node contains a node id, node title, and a corresponding summary.
Your task is to find all nodes that are likely to contain the answer to the question.

Question: [USER_QUERY]

Document tree structure:
[JSON_TREE_WITHOUT_TEXT]

Please reply in the following JSON format:
{
    "thinking": "<Your thinking process on which nodes are relevant>",
    "node_list": ["node_id_1", "node_id_2", ..., "node_id_n"]
}
Directly return the final JSON structure. Do not output anything else.
```

[SOURCE: cookbook/pageindex_RAG_simple.ipynb]

**Critical design decisions in this prompt:**

1. **Tree passed WITHOUT full text** -- Only titles, node_ids, and summaries are included. This keeps token usage manageable for large documents.
2. **Explicit "thinking" field** -- Forces the LLM to reason before selecting, similar to chain-of-thought prompting. The thinking is captured but the node_list is what drives retrieval.
3. **JSON output format** -- Structured output enables programmatic extraction of selected nodes.
4. **"All nodes that are likely"** -- Encourages recall over precision; the LLM should err on the side of including more nodes.
5. **Temperature = 0** -- Deterministic reasoning for reproducible results.

### The Clean Structure for Search

Before passing to the LLM, the tree is stripped to essential fields only:

```python
def create_clean_structure_for_description(structure):
    # Filters structure to essential fields: title, node_id, summary, prefix_summary
    # Recursively processes child nodes
    # Removes: start_index, end_index, physical_index, text, appear_start
```

[SOURCE: pageindex/utils.py - create_clean_structure_for_description]

This means the LLM sees a compact tree like:

```json
{
    "title": "Annual Report 2023",
    "node_id": "0000",
    "summary": "Overview of company performance...",
    "nodes": [
        {
            "title": "Financial Statements",
            "node_id": "0001",
            "summary": "Consolidated balance sheet, income statement...",
            "nodes": [
                {
                    "title": "Balance Sheet",
                    "node_id": "0002",
                    "summary": "Assets, liabilities, equity as of Dec 31..."
                }
            ]
        }
    ]
}
```

### Node Selection JSON Format and Validation

**Output format:**

```json
{
    "thinking": "The question asks about EBITDA adjustments. Looking at the tree,
                 node 0005 covers MD&A which typically discusses EBITDA. Node 0008
                 covers Financial Statement footnotes which detail adjustments...",
    "node_list": ["0005", "0008", "0012"]
}
```

**JSON extraction and validation:**

```python
def extract_json(content):
    # 1. Strip ```json and ``` delimiters
    # 2. Normalize whitespace
    # 3. Convert Python None to JSON null
    # 4. Remove trailing commas (malformed JSON cleanup)
    # 5. json.loads() with empty dict fallback on parse failure
```

[SOURCE: pageindex/utils.py - extract_json]

The system is tolerant of LLM formatting inconsistencies -- it handles markdown code fences, Python-style None values, and trailing commas.

### Context Extraction from Selected Nodes

Once nodes are selected, full text is extracted:

```python
node_list = json.loads(tree_search_result)["node_list"]
relevant_content = "\n\n".join(
    node_map[node_id]["text"] for node_id in node_list
)
```

[SOURCE: cookbook/pageindex_RAG_simple.ipynb]

The `node_map` is built from the full tree (with text populated via `add_node_text()`):

```python
def add_node_text(node, pdf_pages):
    # Recursively populates 'text' field using start_index/end_index page ranges
    # Concatenates page text from pdf_pages[start_index:end_index+1]
```

[SOURCE: pageindex/utils.py - add_node_text]

### Answer Generation

The final answer uses a straightforward prompt:

```
Answer the question based on the context:

Question: [USER_QUERY]
Context: [EXTRACTED_TEXT_FROM_NODES]

Provide a clear, concise answer based only on the context provided.
```

[SOURCE: cookbook/pageindex_RAG_simple.ipynb]

---

## Expert Knowledge Injection

### The Pattern

This is one of PageIndex's most distinctive features. Unlike vector-based retrieval where changing retrieval behavior requires retraining embeddings or rewriting chunking strategies, PageIndex allows domain expertise to be injected by modifying the search prompt.

**The injection mechanism:**

```
You are given a question and a tree structure of a document.
Each node contains a node id, node title, and a corresponding summary.
Your task is to find all nodes that are likely to contain the answer to the question.

Expert Knowledge of relevant sections:
[INJECTED_DOMAIN_KNOWLEDGE]

Question: [USER_QUERY]

Document tree structure:
[JSON_TREE]

Please reply in the following JSON format:
{
    "thinking": "<Your thinking process on which nodes are relevant>",
    "node_list": ["node_id_1", "node_id_2", ..., "node_id_n"]
}
```

[SOURCE: tutorials/tree-search/README.md]

### Preference Retrieval Pipeline

The tutorial describes a two-step process:

1. **Preference Retrieval** -- Select relevant expert knowledge using:
   - Keyword matching against the query
   - Semantic similarity search
   - LLM-based relevance assessment

2. **Prompt Enhancement** -- Add retrieved preferences as an "Expert Knowledge of relevant sections" parameter in the search prompt.

**Example domain knowledge:**

> "For queries about EBITDA adjustments, prioritize Item 7 (MD&A) and footnotes in Item 8 (Financial Statements) in 10-K reports."

[SOURCE: tutorials/tree-search/README.md]

### Why This Matters for Memory Systems

The expert knowledge injection pattern is essentially a **constitutional memory** mechanism:

- Rules about where to look (not what to find) guide the search
- No retraining or re-embedding required
- Domain expertise accumulates as a library of searchable preferences
- The LLM's reasoning incorporates both structural understanding AND domain rules

---

## Multi-Document Tree Search

### Three Strategies

PageIndex implements three approaches for searching across multiple documents:

[SOURCE: tutorials/doc-search/README.md]

#### Strategy 1: Description-Based Search (Lightweight)

Best for small document collections.

**Pipeline:**

```
Documents -> PageIndex Trees -> LLM Description Generation (1 sentence each)
                                        |
Query + All Descriptions -> LLM Filter -> Selected doc_ids
                                                |
Selected docs -> Tree Search (per doc) -> Node Selection -> Answer
```

The description generation prompt:

```python
prompt = f"""Your are an expert in generating descriptions for a document.
You are given a structure of a document. Your task is to generate a one-sentence
description for the document, which makes it easy to distinguish the document
from other documents..."""
```

[SOURCE: pageindex/utils.py - generate_doc_description]

Then an LLM compares the query against all descriptions to select relevant documents before running tree search within each.

[SOURCE: tutorials/doc-search/description.md]

#### Strategy 2: Metadata-Based Search (Structured)

Best for documents with distinguishing metadata (company, date, type).

**Pipeline:**

```
Documents -> Upload + Metadata Store (DB)
                        |
Query -> LLM Query Translation -> DB Query -> Matching doc_ids
                                                    |
Selected docs -> Tree Search -> Answer
```

An LLM converts natural language queries into database filters. For example: "What was Apple's Q3 2024 revenue?" becomes a metadata query for company=Apple, period=Q3-2024.

[SOURCE: tutorials/doc-search/metadata.md]

#### Strategy 3: Semantic Search (Hybrid)

Best for diverse document collections.

**Pipeline:**

```
Documents -> Chunk + Embed -> Vector DB (chunks with doc_ids)
                                    |
Query -> Embed -> Top-K chunks -> Document Scoring (aggregated) -> Top doc_ids
                                                                        |
Selected docs -> Tree Search -> Answer
```

**Critical detail -- the scoring formula:**

The system aggregates chunk-level relevance scores at the document level using a normalized formula:

> "The sum aggregates relevance from all related chunks" while "the square root in the denominator allows the score to increase with diminishing returns."

This prevents long documents with many weakly-relevant chunks from outranking shorter documents with fewer highly-relevant chunks.

[SOURCE: tutorials/doc-search/semantics.md]

**Key insight:** This is a HYBRID approach -- embeddings for document selection, tree search for within-document retrieval. The two mechanisms serve different roles in the pipeline.

---

## Advanced: Monte Carlo Tree Search (MCTS)

The tutorials mention that PageIndex's production dashboard combines:

> "LLM tree search and value function-based Monte Carlo Tree Search (MCTS)"

[SOURCE: tutorials/tree-search/README.md]

This suggests an iterative search where:
1. Initial LLM reasoning selects promising nodes
2. MCTS explores alternatives with a value function scoring relevance
3. The combination balances exploration (finding unexpected relevant sections) with exploitation (deepening search in known-relevant areas)

Full implementation details are noted as "forthcoming" in the documentation.

[CITATION: NONE - implementation details not yet published. Grade C evidence (mentioned but unverifiable).]

---

## Tree Manipulation Utilities

### Tree Traversal Functions

[SOURCE: pageindex/utils.py]

```python
def get_nodes(structure):
    # Flattens tree, extracts ALL nodes with recursive descent

def get_leaf_nodes(structure):
    # Returns terminal nodes only (empty 'nodes' arrays)

def structure_to_list(structure):
    # Converts hierarchical tree to flat list maintaining order

def is_leaf_node(data, node_id):
    # Searches tree by node_id, validates leaf status

def find_node(data, node_id):
    # Depth-first search through dict/list structures
```

### Tree Construction

```python
def list_to_tree(data):
    # Reconstructs hierarchical tree from flat list
    # Parent-child relationships inferred from dotted 'structure' codes
    # E.g., "1.2.3" is a child of "1.2"

def format_structure(structure, order=None):
    # Reorders dictionary keys, removes empty 'nodes' arrays
```

### Token Management

```python
def check_token_limit(structure, limit=110000):
    # Identifies nodes exceeding token threshold
    # Logs metadata for oversized nodes

def get_page_tokens(pdf_path, model="gpt-4o-2024-11-20", pdf_parser="PyPDF2"):
    # Returns list of (text, token_count) tuples per page
```

### LLM API Integration

```python
async def ChatGPT_API_async(model, prompt, api_key=CHATGPT_API_KEY):
    # Async OpenAI calls with:
    # - 10-retry logic with 1s delays
    # - temperature=0 (deterministic)
    # - Single user message format
```

---

## Constraints and Limitations

### Token Budget

- The tree structure (titles + summaries) must fit within the LLM's context window
- Default max: 20,000 tokens per node, 110,000 token limit check
- Large documents may require the recursive node splitting strategy

### Accuracy Dependencies

- Tree quality depends on TOC detection accuracy (60% threshold for fallback)
- Summary quality depends on LLM capability
- Title validation uses async concurrent LLM calls (cost implications)

### Single-Pass Limitation

The basic tree search is single-pass: the LLM sees the full tree once and selects all nodes in one response. There is no iterative refinement in the open-source implementation (MCTS is production-only).

### Cost Model

- Tree construction: Multiple LLM calls per document (TOC extraction, title validation, summary generation)
- Tree search: One LLM call per query per document
- Answer generation: One LLM call with extracted context

---

## Performance

- **FinanceBench benchmark:** 98.7% accuracy (state-of-the-art)
- **Retrieval approach:** Reasoning-based (no embedding computation at query time)
- **Token efficiency:** Only titles + summaries sent for search (not full text)
- **Concurrency:** Uses `asyncio.gather()` for parallel summary generation and validation

---

## Implementation Guide: Applicability to Memory Retrieval

### Pattern 1: Reasoning-Over-Structure for Memory Search

**Current spec-kit memory approach:** Embedding similarity search with reranking, causal edges, tier-based filtering.

**PageIndex-inspired complement:**

Instead of (or in addition to) embedding search, construct a lightweight "memory tree" from the spec-kit's hierarchical structure:

```
Constitutional Memories
  |-- Coding Standards
  |     |-- Memory: "Use generate-context.js for saves"
  |     |-- Memory: "Never skip Gate 3"
  |
  |-- Architecture Decisions
        |-- Memory: "SQLite chosen over PostgreSQL"
        |-- Memory: "Causal edges for decision lineage"

Critical Memories
  |-- Spec: 140-hybrid-rag-fusion-refinement
  |     |-- Memory: "10-agent synthesis completed"
  |     |-- Memory: "Gap analysis: 4 missing features"
  ...
```

An LLM could reason over this tree (with titles and summaries, not full content) to select which memories are relevant, then load the full content only for selected memories.

**Advantages:**
- Preserves hierarchical relationships (tier > spec > memory)
- LLM reasoning can handle conceptual connections embeddings miss
- Transparent: the "thinking" field explains WHY memories were selected
- Compatible with existing tier/importance system

**Trade-offs:**
- Requires LLM call at retrieval time (latency + cost)
- Tree must fit in context window (manageable for memory counts < 1000)
- Not suitable for sub-second retrieval requirements

### Pattern 2: Expert Knowledge as Constitutional Memories

**PageIndex pattern:** Domain preferences injected into search prompt guide the LLM toward relevant sections.

**Memory system mapping:**

Constitutional memories already serve this exact role. They could be explicitly injected into a tree search prompt:

```
You are searching a memory system for relevant context.

Constitutional Rules (always apply):
- "When working on spec-kit changes, always check existing memory files first"
- "Prefer memories from the active spec folder over global memories"

Query: [USER_QUERY]

Memory tree structure:
[MEMORY_HIERARCHY_JSON]

Select relevant memories.
```

This is precisely what the current `includeConstitutional: true` flag does in `memory_search`, but the tree search approach makes the LLM reason about structure rather than rely on embedding similarity.

### Pattern 3: Two-Stage Hybrid Search

**PageIndex pattern:** Semantic search for document selection, tree search for within-document retrieval.

**Memory system mapping:**

```
Stage 1: Embedding search identifies candidate spec folders / memory clusters
          (fast, approximate, existing infrastructure)

Stage 2: LLM tree search within candidates selects specific memories
          (slow, precise, reasoning-based)
```

This maps to the current architecture where `memory_search` does embedding retrieval and reranking. A tree search layer could be added as an optional precision step for complex queries where embedding similarity is insufficient.

### Pattern 4: Structured Output with Reasoning

**PageIndex pattern:** The `{"thinking": "...", "node_list": [...]}` format.

**Memory system mapping:**

For memory retrieval, a similar format:

```json
{
    "thinking": "The query asks about hybrid RAG architecture. Memory 42 contains
                 the 10-agent synthesis. Memory 56 has the gap analysis. Memory 12
                 is constitutional about search patterns...",
    "memory_ids": [42, 56, 12],
    "confidence": 0.85
}
```

This provides explainability for memory selection -- critical for debugging and trust.

---

## Code Examples: Minimal Tree Search Implementation

### Building a Memory Tree

```python
def build_memory_tree(memories, tiers=None):
    """Convert flat memory list to hierarchical tree for LLM search."""
    tree = {"title": "Memory System", "nodes": []}

    tier_groups = {}
    for mem in memories:
        tier = mem.get("importance_tier", "normal")
        if tiers and tier not in tiers:
            continue
        tier_groups.setdefault(tier, []).append(mem)

    for tier, mems in tier_groups.items():
        tier_node = {
            "title": f"{tier.title()} Memories",
            "node_id": f"tier_{tier}",
            "summary": f"{len(mems)} memories at {tier} importance",
            "nodes": []
        }

        # Group by spec folder
        folder_groups = {}
        for m in mems:
            folder = m.get("spec_folder", "global")
            folder_groups.setdefault(folder, []).append(m)

        for folder, folder_mems in folder_groups.items():
            folder_node = {
                "title": folder,
                "node_id": f"folder_{folder}",
                "summary": f"{len(folder_mems)} memories",
                "nodes": [
                    {
                        "title": m["title"],
                        "node_id": str(m["id"]),
                        "summary": m.get("summary", m["title"])
                    }
                    for m in folder_mems
                ]
            }
            tier_node["nodes"].append(folder_node)

        tree["nodes"].append(tier_node)

    return tree
```

### Tree Search Prompt for Memories

```python
MEMORY_TREE_SEARCH_PROMPT = """You are given a query and a tree structure of a memory system.
Each node contains a node id, title, and a corresponding summary.
Your task is to find all memory nodes that are likely to contain relevant context for the query.

{constitutional_rules}

Query: {query}

Memory tree structure:
{tree_json}

Please reply in the following JSON format:
{{
    "thinking": "<Your reasoning about which memories are relevant and why>",
    "memory_ids": ["id_1", "id_2", ..., "id_n"]
}}
Directly return the final JSON structure. Do not output anything else."""
```

### Two-Stage Hybrid Search

```python
async def hybrid_tree_search(query, memories, constitutional_memories=None):
    """
    Stage 1: Embedding pre-filter (fast, approximate)
    Stage 2: LLM tree search (precise, reasoning-based)
    """
    # Stage 1: Get candidates via existing embedding search
    candidates = await embedding_search(query, limit=50)

    # Stage 2: Build tree from candidates and search with LLM
    tree = build_memory_tree(candidates)

    # Inject constitutional memories as expert knowledge
    constitutional_rules = ""
    if constitutional_memories:
        rules = "\n".join(f"- {m['title']}: {m['summary']}"
                         for m in constitutional_memories)
        constitutional_rules = f"Constitutional Rules (always apply):\n{rules}\n"

    prompt = MEMORY_TREE_SEARCH_PROMPT.format(
        constitutional_rules=constitutional_rules,
        query=query,
        tree_json=json.dumps(tree, indent=2)
    )

    response = await llm_call(prompt, temperature=0)
    result = extract_json(response)

    return result.get("memory_ids", []), result.get("thinking", "")
```

---

## Testing and Debugging

### Validation Strategies

1. **Tree structure validation:** Verify node_ids are unique, parent-child relationships are consistent, page ranges don't overlap
2. **Search quality:** Compare selected nodes against ground truth (which sections actually contain the answer)
3. **JSON output validation:** The `extract_json()` function handles malformed LLM output gracefully
4. **Fallback behavior:** If accuracy < 60%, the system falls back to simpler processing modes

### Diagnostic Patterns

- The "thinking" field in search output is a built-in diagnostic: it explains why nodes were selected
- Temperature=0 ensures reproducible results for debugging
- The clean structure (titles + summaries only) can be logged to see exactly what the LLM reasoned over

---

## Security Considerations

- API keys managed via environment variables (CHATGPT_API_KEY)
- No user data persistence in the open-source version (tree structures are ephemeral)
- The prompt injection surface is limited: user queries are inserted into a structured prompt, but the JSON output format constrains responses

---

## Troubleshooting

| Issue                          | Cause                                    | Solution                                          |
| ------------------------------ | ---------------------------------------- | ------------------------------------------------- |
| Empty node_list                | Query too vague, tree too shallow        | Improve summaries, add more tree depth            |
| Too many nodes selected        | Query too broad                          | Add expert knowledge to narrow scope              |
| JSON parse failure             | LLM output malformed                    | extract_json handles most cases; retry on failure |
| Wrong nodes selected           | Summaries don't capture relevant content | Regenerate summaries with better prompt           |
| Token limit exceeded           | Tree too large for context window        | Use recursive node splitting or pre-filter        |

---

## Recommendations: Applicability to Spec-Kit Memory

### Option A: Pure Tree Search Layer (Complement to Embedding)

**Description:** Add an optional LLM tree search step after embedding retrieval for complex queries.

| Aspect     | Assessment                                                                        |
| ---------- | --------------------------------------------------------------------------------- |
| Pros       | Reasoning-based precision; explainable selections; constitutional injection fits naturally |
| Cons       | Added latency (LLM call); added cost; requires tree construction from memory data |
| Confidence | High -- the pattern is proven and the mapping to memory tiers is straightforward  |

**When to use:** Complex queries where embedding similarity returns too many near-equal results. The LLM reasoning can disambiguate based on structural context.

### Option B: Expert Knowledge Injection via Constitutional Memories

**Description:** Inject constitutional-tier memories as "expert knowledge" into search prompts (embedding or tree-based).

| Aspect     | Assessment                                                                        |
| ---------- | --------------------------------------------------------------------------------- |
| Pros       | Zero retraining; accumulates domain expertise; already exists in memory system    |
| Cons       | Consumes prompt tokens; requires relevance filtering of constitutional memories   |
| Confidence | High -- this is already partially implemented via includeConstitutional flag       |

**When to use:** Always. This is the lowest-friction enhancement. Constitutional memories are already surfaced; the insight is to format them as search-guiding preferences rather than just additional context.

### Option C: Two-Stage Hybrid Pipeline

**Description:** Embedding search for candidate selection (Stage 1) + LLM tree search for precision selection (Stage 2).

| Aspect     | Assessment                                                                        |
| ---------- | --------------------------------------------------------------------------------- |
| Pros       | Best of both worlds; fast pre-filter + precise reasoning; scalable               |
| Cons       | Highest complexity; two-stage latency; requires both infrastructure pieces        |
| Confidence | Medium -- proven in PageIndex but memory system has different scale characteristics |

**When to use:** When the memory system grows beyond 500+ memories and embedding search alone produces noisy results.

### Recommended Approach

Start with **Option B** (zero cost, high value), evaluate **Option A** for complex queries, and architect toward **Option C** as the system scales. The tree search pattern should COMPLEMENT, not replace, the existing embedding infrastructure.

---

## Appendix

### Key Source Files Analyzed

| File                                 | Purpose                                            |
| ------------------------------------ | -------------------------------------------------- |
| `pageindex/utils.py`                 | Tree traversal, JSON extraction, LLM API, summaries |
| `pageindex/page_index.py`            | Tree construction, TOC parsing, node processing    |
| `pageindex/config.yaml`              | Default configuration                              |
| `cookbook/pageindex_RAG_simple.ipynb`  | Core tree search prompt and RAG pipeline           |
| `cookbook/agentic_retrieval.ipynb`     | Agentic retrieval with structured JSON output      |
| `cookbook/vision_RAG_pageindex.ipynb`  | Vision-based variant (PDF images instead of text)  |
| `tutorials/tree-search/README.md`    | Expert knowledge injection pattern                 |
| `tutorials/doc-search/README.md`     | Multi-document search strategies                   |
| `tutorials/doc-search/description.md`| Description-based document filtering               |
| `tutorials/doc-search/semantics.md`  | Hybrid semantic + tree search                      |
| `tutorials/doc-search/metadata.md`   | Metadata-based document filtering                  |

### Glossary

| Term                    | Definition                                                      |
| ----------------------- | --------------------------------------------------------------- |
| Tree Search             | LLM reasoning over hierarchical document structure              |
| Node Selection          | Identifying relevant tree nodes via LLM reasoning               |
| Expert Knowledge        | Domain preferences injected into search prompts                 |
| Constitutional Memory   | Always-active high-priority memories (maps to expert knowledge) |
| MCTS                    | Monte Carlo Tree Search (production-only, details forthcoming)  |
| Clean Structure         | Tree stripped to titles + summaries for LLM consumption         |
| Physical Index          | Actual page number in the source PDF                            |
| TOC                     | Table of Contents, used as basis for tree construction          |

### Related Research

- Spec 136: MCP Working Memory Hybrid RAG
- Spec 139: Hybrid RAG Fusion
- Spec 140: Hybrid RAG Fusion Refinement (this spec)
- Research files 1-8 in this spec's research folder

### Changelog

| Date       | Change            |
| ---------- | ----------------- |
| 2026-02-26 | Initial research  |
