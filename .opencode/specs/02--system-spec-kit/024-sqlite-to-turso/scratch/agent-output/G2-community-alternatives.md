# G2: Community Experiences & Alternatives

**Agent:** general-purpose | **Duration:** ~291s | **Tokens:** 71,788

## Key Findings

### Community Sentiment
- January 2025 data loss incident damaged community trust significantly
- HN commenters: "not ready to entertain Turso as an alternative to something as battle-tested as SQLite"
- VC sustainability concerns: 100x return pressure incompatible with patient database development
- Product identity confusion: libSQL vs Turso rewrite vs Turso Cloud
- Server going closed-source is controversial

### Alternative Vector DBs
- **LanceDB:** STRONGEST candidate — only embedded TS library, hybrid search (FTS+vector), zero infra. Production: Continue IDE, AnythingLLM. Lance SDK 1.0.0 announced.
- **Qdrant embedded:** NOT viable for Node.js (private beta, JS SDK is client-only)
- **ChromaDB:** Python-only for embedded; JS requires server
- **DuckDB VSS:** Experimental but functional HNSW; OLAP-focused, not ideal for frequent writes
- **sqlite-vec:** Good at <100K vectors but brute-force only (ANN still planned)
- **Zvec (Alibaba):** Impressive (8000+ QPS) but only 1 month old

### Hybrid Architecture Validation
- SQLite + LanceDB is the pattern used by Continue IDE and AnythingLLM
- SQLite RAG project demonstrates FTS5 + sqlite-vec + RRF fusion
- Community consensus: for local/embedded systems, keeping structured data in SQLite and vectors in LanceDB is pragmatic

### Cost
- Turso Cloud: Free tier (500 DBs), $4.99/mo developer, ~$8.25/mo standard
- Self-hosted libSQL: infrastructure costs only
- SQLite + extensions: $0
