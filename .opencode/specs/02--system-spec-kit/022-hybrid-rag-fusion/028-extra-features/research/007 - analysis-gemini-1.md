# Document 1 - Technical Analysis: AI Memory and Context Architectures

## Executive Summary
This document analyzes three distinct approaches to providing persistent memory, contextual awareness, and retrieval for AI agents:
1. **Cognee (`topoteretes/cognee`)**: An enterprise-grade, graph-native memory engine utilizing a triple-store architecture.
2. **ArtemXTech's Ecosystem**: A lightweight, highly pragmatic workflow bridging CLI agents (Claude Code) with local structured Markdown databases (Obsidian) via MCP.
3. **QMD (`tobi/qmd`)**: A local-first, hybrid search engine heavily optimized for Markdown and agentic retrieval.

Each system solves the core problem of **context limits** and **information retrieval** but makes different architectural trade-offs between precision, structural awareness, and execution overhead.

---

## 1. Cognee (`topoteretes/cognee`)

### Architecture Overview
Cognee departs from the traditional Vector-only Retrieval-Augmented Generation (RAG) by implementing an **ECL (Extract → Cognify → Load)** pipeline backed by a **Triple-Store System**.

### Core Logic & Data Structures
- **Extract**: Ingests multi-modal data and splits it into discrete chunks.
- **Cognify (The Graph Engine)**: Uses LLMs to perform Named Entity Recognition (NER) and relationship extraction, transforming flat text into a **Knowledge Graph**.
- **The Triple-Store**:
  1. *Relational Store (SQLite/Postgres)*: Manages chunk metadata, provenance, and document lifecycle.
  2. *Vector Store (LanceDB/Qdrant)*: Handles semantic similarity embeddings.
  3. *Graph Store (NetworkX/Neo4j)*: Maps explicit structural relationships (e.g., "Spec A *depends on* Spec B", "Function X *calls* Function Y").

### Integration & Patterns
- **Graph + Vector Fusion**: When queried, Cognee performs a vector search to find the "neighborhood" of relevance, then traverses the graph edges to pull in structurally related (but perhaps not semantically similar) context.
- **Temporal Awareness**: Tracks how entities evolve over time, allowing agents to understand the history of a codebase or document.

### Limitations & Constraints
- **Cognification Overhead**: The LLM processing required to build the graph during ingestion is slow and expensive.
- **Operational Complexity**: Managing three separate database paradigms simultaneously increases maintenance burden.

---

## 2. ArtemXTech's Obsidian MCP Ecosystem

### Architecture Overview
Artem Zhutov's approach represents the "Personal OS" philosophy. It utilizes **Obsidian** as the storage and UI layer, with an **MCP Server** acting as the bridge for terminal-based agents. 

### Core Logic & Data Structures
- **Markdown + Frontmatter**: Treats Markdown files as database records. The YAML frontmatter acts as structured columns, while the body is unstructured data.
- **Bases Query Skill**: An MCP tool that allows an agent to run SQL-like queries against the structured metadata of thousands of Markdown files without reading their contents.

### Integration & Patterns
- **Metadata-First Retrieval**: To save LLM context tokens, the agent is trained to query frontmatter first. Only when a specific ID or path is identified does the agent read the full Markdown file.
- **Semantic Overlays**: Integrates with local vector plugins (like "Smart Connections") to provide the agent with semantic search capabilities natively within the Markdown vault.

### Limitations & Constraints
- Tightly coupled to the Obsidian plugin ecosystem.
- Slower read/write times compared to a dedicated database due to filesystem I/O constraints when querying across massive vaults.

---

## 3. QMD (`tobi/qmd`)

### Architecture Overview
QMD (Query Markup Documents) is a local-first, extremely fast search engine explicitly built for agentic workflows. It is powered entirely by SQLite and local GGUF models via `node-llama-cpp`.

### Core Logic & Data Structures
- **Hybrid Pipeline**: 
  1. *BM25 Keyword Search* (via SQLite FTS5)
  2. *Vector Semantic Search* (via `sqlite-vec`)
  3. *Query Expansion & Re-ranking* (via local cross-encoder model)
- **Reciprocal Rank Fusion (RRF)**: Merges the scores of keyword and vector searches to produce a highly accurate candidate list.
- **Context Trees**: A unique structural feature where metadata can be attached to path namespaces (e.g., `qmd://specs/001-phase` = "Phase 1 Planning Documents").

### Integration & Patterns
- **Smart Markdown Chunking**: Instead of arbitrary character limits (e.g., 1000 chars), QMD chunks documents based on structural Markdown boundaries (H1, H2, code blocks). This ensures semantic completeness.
- **Built-in MCP Server**: Exposes precise tools (`qmd_search`, `qmd_vector_search`, `qmd_deep_search`) directly to the agent.
- **Zero-Cloud Dependency**: By running embeddings and re-ranking locally, it ensures privacy and removes API cost bottlenecks for continuous background indexing.

### Limitations & Constraints
- Requires available local VRAM to keep models loaded for fast inference, which can compete with local LLMs if running on constrained hardware.

---

## Key Learnings & Architectural Takeaways
1. **Graphs are essential for dependencies, Vectors for concepts**: Relying solely on vector search often fails in codebases and spec architectures where explicit relationships (A requires B) matter more than semantic overlap.
2. **Chunk by Structure, not Size**: Markdown headings are the optimal boundary for context chunks.
3. **Context Trees Anchor Agents**: Providing an agent with the "Why this file exists" (Context Tree) alongside the file contents drastically reduces hallucinations.
