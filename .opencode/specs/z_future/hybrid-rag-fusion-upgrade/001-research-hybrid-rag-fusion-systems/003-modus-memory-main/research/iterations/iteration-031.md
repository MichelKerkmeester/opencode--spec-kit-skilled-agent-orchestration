# Iteration 031: ADOPTION ROADMAP DRAFT

## Focus
ADOPTION ROADMAP DRAFT: Based on all 30 prior iterations, create a phased adoption roadmap with Q1/Q2/Q3 milestones. Include dependencies between adopted patterns.

## Findings
### Finding N: [Title]
- **Source**: file path(s) [SOURCE: path:line]
- **What it does**: technical description
- **Why it matters**: relevance to our system
- **Recommendation**: adopt now / prototype later / reject / NEW FEATURE
- **Impact**: high / medium / low
- **Source strength**: primary / secondary / tentative

## Sources Consulted
- [file:line references]

## Assessment
- New information ratio: [0.0-1.0]
- Questions addressed: [list]
- Questions answered: [list]
- Novelty justification: [1-sentence explanation]

## Ruled Out
- [approaches eliminated and why]

## Reflection
- What worked: [approach + causal explanation]
- What did not work: [approach + root cause]
- What I would do differently: [specific adjustment]

## Recommended Next Focus
[What to investigate next]

ACCUMULATED FINDINGS SUMMARY:
s:39-43,197-215`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:529-585,840-877,1194-1202`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:300-316`
- **What it does**: Modus exposes an explicit `memory_reinforce` operator action on top of its FSRS state. Public already has the underlying pieces: graded review math (`AGAIN/HARD/GOOD/EASY`), `processReview()` with `nextReviewDate`, and opt-in strengthening-on-access. The current exposed adjacent surface is `memory_validate`, which records only `wasUseful` feedback and does not let an operator issue a graded FSRS review.
- **Why it matters for us**: This is the highest impact x feasibility transfer because it closes the clearest control-plane gap without inventing new storage or changing retrieval architecture. It also de-risks the bigger `memory_due` idea: until Public has a first-class graded review action, any future review queue would have no trustworthy way to record hard recalls, lapses, and easy wins distinctly.
- **Recommendation**: **adopt now**
- **Impact**: **high**

- **Impact**: **high**

### Finding 3: Modus’s cheapest useful rehydration primitive is adjacency, not session recovery
- **Source**: [crossref.go:9](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go#L9); [crossref.go:41](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go#L41); [vault.go:75](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L75)
- **What it does**: Modus builds lightweight subject/tag/entity adjacency maps at index time and appends connected documents to search output when they were not already returned by lexical search.
- **Why it matters**: For compaction recovery, this is the most transferable Modus idea: after we recover the active spec/task, a cheap connected-neighbor pass could widen context without immediately paying for heavier graph or semantic expansion.
- **Recommendation**: **prototype later**
--
## Findings
### Finding N: [Title]
- **Source**: file path(s)
## Findings

### Finding 1: Rank 1 (20/25) — explicit `memory_review` is the first thing Public should ship
- **Source**: `external/internal/mcp/memory.go:7-15`; `external/internal/mcp/vault.go:885-897`; `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:39-43,197-215`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:529-585,840-877,1194-1202`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:300-316`
- **What it does**: Modus exposes an explicit `memory_reinforce` operator action on top of its FSRS state. Public already has the underlying pieces: graded review math (`AGAIN/HARD/GOOD/EASY`), `processReview()` with `nextReviewDate`, and opt-in strengthening-on-access. The current exposed adjacent surface is `memory_validate`, which records only `wasUseful` feedback and does not let an operator issue a graded FSRS review.
- **Why it matters for us**: This is the highest impact x feasibility transfer because it closes the clearest control-plane gap without inventing new storage or changing retrieval architecture. It also de-risks the bigger `memory_due` idea: until Public has a first-class graded review action, any future review queue would have no trustworthy way to record hard recalls, lapses, and easy wins distinctly.
- **Recommendation**: **adopt now**
- **Impact**: **high**

- **Impact**: **high**

### Finding 3: Modus’s cheapest useful rehydration primitive is adjacency, not session recovery
- **Source**: [crossref.go:9](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go#L9); [crossref.go:41](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go#L41); [vault.go:75](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L75)
- **What it does**: Modus builds lightweight subject/tag/entity adjacency maps at index time and appends connected documents to search output when they were not already returned by lexical search.
- **Why it matters**: For compaction recovery, this is the most transferable Modus idea: after we recover the active spec/task, a cheap connected-neighbor pass could widen context without immediately paying for heavier graph or semantic expansion.
- **Recommendation**: **prototype later**
--
## Findings
### Finding N: [Title]
- **Source**: file path(s)
## Findings
### Finding N: [Title]
- **Source**: file path(s)
- **What it does**: technical description
- **Why it matters**: relevance to our system
- **Recommendation**: adopt now / prototype later / reject / NEW FEATURE
- **Impact**: high / medium / low
--- Iteration 26 ---
## Findings

### Finding 1: Rank 1 (20/25) — explicit `memory_review` is the first thing Public should ship
- **Source**: `external/internal/mcp/memory.go:7-15`; `external/internal/mcp/vault.go:885-897`; `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:39-43,197-215`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:529-585,840-877,1194-1202`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:300-316`
- **What it does**: Modus exposes an explicit `memory_reinforce` operator action on top of its FSRS state. Public already has the underlying pieces: graded review math (`AGAIN/HARD/GOOD/EASY`), `processReview()` with `nextReviewDate`, and opt-in strengthening-on-access. The current exposed adjacent surface is `memory_validate`, which records only `wasUseful` feedback and does not let an operator issue a graded FSRS review.
- **Why it matters for us**: This is the highest impact x feasibility transfer because it closes the clearest control-plane gap without inventing new storage or changing retrieval architecture. It also de-risks the bigger `memory_due` idea: until Public has a first-class graded review action, any future review queue would have no trustworthy way to record hard recalls, lapses, and easy wins distinctly.
- **Recommendation**: **adopt now**
- **Impact**: **high**

- **Impact**: **high**

### Finding 3: Modus’s cheapest useful rehydration primitive is adjacency, not session recovery
## Findings
### Finding N: [Title]
- **Source**: file path(s)
- **What it does**: technical description
- **Why it matters**: relevance to our system
- **Recommendation**: adopt now / prototype later / reject / NEW FEATURE
- **Impact**: high / medium / low
--- Iteration 26 ---
## Findings

### Finding 1: Rank 1 (20/25) — explicit `memory_review` is the first thing Public should ship
- **Source**: `external/internal/mcp/memory.go:7-15`; `external/internal/mcp/vault.go:885-897`; `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:39-43,197-215`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:529-585,840-877,1194-1202`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:300-316`
- **What it does**: Modus exposes an explicit `memory_reinforce` operator action on top of its FSRS state. Public already has the underlying pieces: graded review math (`AGAIN/HARD/GOOD/EASY`), `processReview()` with `nextReviewDate`, and opt-in strengthening-on-access. The current exposed adjacent surface is `memory_validate`, which records only `wasUseful` feedback and does not let an operator issue a graded FSRS review.
- **Why it matters for us**: This is the highest impact x feasibility transfer because it closes the clearest control-plane gap without inventing new storage or changing retrieval architecture. It also de-risks the bigger `memory_due` idea: until Public has a first-class graded review action, any future review queue would have no trustworthy way to record hard recalls, lapses, and easy wins distinctly.
- **Recommendation**: **adopt now**
- **Impact**: **high**

- **Impact**: **high**

### Finding 3: Modus’s cheapest useful rehydration primitive is adjacency, not session recovery
## Findings
### Finding N: [Title]
- **Source**: file path(s)
- **What it does**: technical description
- **Why it matters**: relevance to our system
- **Recommendation**: adopt now / prototype later / reject / NEW FEATURE
- **Impact**: high / medium / low
--- Iteration 26 ---
## Findings

### Finding 1: Rank 1 (20/25) — explicit `memory_review` is the first thing Public should ship
- **Source**: `external/internal/mcp/memory.go:7-15`; `external/internal/mcp/vault.go:885-897`; `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:39-43,197-215`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:529-585,840-877,1194-1202`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:300-316`
- **What it does**: Modus exposes an explicit `memory_reinforce` operator action on top of its FSRS state. Public already has the underlying pieces: graded review math (`AGAIN/HARD/GOOD/EASY`), `processReview()` with `nextReviewDate`, and opt-in strengthening-on-access. The current exposed adjacent surface is `memory_validate`, which records only `wasUseful` feedback and does not let an operator issue a graded FSRS review.
- **Why it matters for us**: This is the highest impact x feasibility transfer because it closes the clearest control-plane gap without inventing new storage or changing retrieval architecture. It also de-risks the bigger `memory_due` idea: until Public has a first-class graded review action, any future review queue would have no trustworthy way to record hard recalls, lapses, and easy wins distinctly.
- **Recommendation**: **adopt now**
- **Impact**: **high**

- **Impact**: **high**

### Finding 3: Modus’s cheapest useful rehydration primitive is adjacency, not session recovery
## Findings
### Finding N: [Title]
- **Source**: file path(s)
- **What it does**: technical description
- **Why it matters**: relevance to our system
- **Recommendation**: adopt now / prototype later / reject / NEW FEATURE
- **Impact**: high / medium / low
--- Iteration 26 ---
## Findings

### Finding 1: Rank 1 (20/25) — explicit `memory_review` is the first thing Public should ship
- **Source**: `external/internal/mcp/memory.go:7-15`; `external/internal/mcp/vault.go:885-897`; `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:39-43,197-215`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:529-585,840-877,1194-1202`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:300-316`
- **What it does**: Modus exposes an explicit `memory_reinforce` operator action on top of its FSRS state. Public already has the underlying pieces: graded review math (`AGAIN/HARD/GOOD/EASY`), `processReview()` with `nextReviewDate`, and opt-in strengthening-on-access. The current exposed adjacent surface is `memory_validate`, which records only `wasUseful` feedback and does not let an operator issue a graded FSRS review.
- **Why it matters for us**: This is the highest impact x feasibility transfer because it closes the clearest control-plane gap without inventing new storage or changing retrieval architecture. It also de-risks the bigger `memory_due` idea: until Public has a first-class graded review action, any future review queue would have no trustworthy way to record hard recalls, lapses, and easy wins distinctly.
- **Recommendation**: **adopt now**
- **Impact**: **high**

- **Impact**: **high**

### Finding 3: Modus’s cheapest useful rehydration primitive is adjacency, not session recovery
- **What it does**: Modus reuses cached results for exact matches and Jaccard-similar term sets.
- **Why it matters**: Public has too many routing, scope, rerank, quality, and trace knobs for fuzzy query reuse to be trustworthy.
- **Recommendation**: **reject**
- **Priority / Effort / Impact**: **8 / 1 / 8**

### Finding 8: Reject write-on-read and permissive markdown as default policy
- **Source**: [vault.go:311](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L311); [facts.go:160](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go#L160); [parser.go:143](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go#L143); [writer.go:10](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/writer.go#L10); [tool-schemas.ts:165](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L165)
- **What it does**: Modus reinforces on search return and tolerates malformed markdown/YAML much more aggressively.
- **Why it matters**: Public’s stronger governance depends on retrieval staying observational by default and ingestion staying authoritative.
- **Recommendation**: **reject**
- **Priority / Effort / Impact**: **9 / 1 / 9**

## Assessment
- New information ratio: **0.12**
- Definitive classification: **adopt now = 3**, **NEW FEATURE = 1**, **prototype later = 2**, **reject = 2**
- Validation check: `validate.sh --strict` still returns `RESULT: PASSED`; the read-only sandbox also still emits the known temp-file warning.
- This was a read-only synthesis pass, so I did not update `research/research.md`, `checklist.md`, `implementation-summary.md`, or memory artifacts.

## Recommended Next Focus
Stop external research and convert this into implementation design in this order: `memory_review` API, doctor/debug route-summary surface, ADR for authoritative `memory_due`, then feature-flagged prototypes for connected-doc appendix and weak-result lexical fallback.

RESEARCH BRIEF:
# $refine TIDD-EC Prompt: 003-modus-memory-main

## 2. Role

You are a research specialist in spaced repetition memory systems, BM25 search ranking, cross-referenced knowledge graphs, MCP-exposed local memory services, and local-first personal memory architectures. Work like a systems analyst who can trace implementation details from source code, separate README claims from verified mechanics, and translate Modus Memory's specific design choices into concrete improvements for `Code_Environment/Public`.

## 3. Task

Research Modus Memory's FSRS spaced repetition, BM25 search ranking, and cross-referencing patterns to identify practical, evidence-backed improvements for `Code_Environment/Public`'s memory search and retrieval, especially around memory decay and reinforcement, query expansion, knowledge linking, and plain-markdown memory storage patterns. Determine which ideas should be `adopt now`, `prototype later`, or `reject`.

## 4. Context

### 4.1 System Description

Modus Memory is a local memory server that stores data as plain markdown files, exposes MCP tools, uses BM25 with field boosting, layers a tiered query cache over lexical retrieval, applies FSRS-style spaced repetition with decay and reinforcement, builds cross-references from subjects, tags, and entities, and uses a librarian query expander to widen lexical recall without relying on vectors. The core attraction is a lightweight local binary, markdown-native persistence, and search behavior that mixes ranking, recency, and linked context while staying git-friendly and human-readable.

### 4.2 Cross-Phase Awareness Table

| Phase | System | Core Pattern | Overlap Risk | Differentiation |
| --- | --- | --- | --- | --- |
| 001 | Engram | MCP memory server (Go, SQLite+FTS5) | 003 (MCP memory) | Focus tool profiles, session lifecycle, topic keys |
| 002 | Mex | Markdown scaffold + drift detection | 003 (markdown storage) | Focus drift detection, scaffold structure |
| 003 | Modus Memory | FSRS spaced repetition + BM25 | 001 (FTS5), 004 (local memory) | Focus FSRS decay, cross-referencing, librarian expansion |
| 004 | OpenCode Mnemosyne | Hybrid search (FTS5 + vector) | 003 (local memory) | Focus vector search, plugin architecture |

### 4.3 What This Repo Already Has

`Code_Environment/Public` already has Spec Kit Memory with semantic and hybrid retrieval, markdown-backed memory artifacts, importance tiers, and an FSRS-based classification-decay layer in the MCP server. It does **not** currently mirror Modus Memory's end-to-end local vault server model, BM25 field-boosted lexical search with lightweight query caching, librarian-style synonym expansion for keyword retrieval, or simple subject/tag/entity adjacency maps that surface connected documents directly in result sets. Base the comparison on current code, not stale assumptions.

## 5. Instructions

1. Treat `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main` as the pre-approved phase folder. Skip Gate 3, keep all writes inside this phase folder, and treat everything under `external/` as read-only.
2. Start with the lexical search implementation: read `external/modus-memory-main/internal/index/bm25.go`, `external/modus-memory-main/internal/index/cache.go`, and `external/modus-memory-main/internal/librarian/search.go` before anything else. Trace tokenization, stemming, field weights, prefix matching, Jaccard cache reuse, and query expansion order.
3. After the ranking path, read `external/modus-memory-main/internal/index/indexer.go` if needed to confirm how documents are loaded into the search engine and how search results are assembled. Keep focus on ranking behavior, not generic indexing boilerplate.
4. Next, trace FSRS and memory-fact behavior by reading `external/modus-memory-main/internal/vault/facts.go` and `external/modus-memory-main/internal/index/facts.go`. Extract the exact stability, difficulty, confidence, floor, access-count, and reinforcement mechanics. Do not collapse these into a generic "TTL" description.
5. After FSRS, inspect cross-referencing by reading `external/modus-memory-main/internal/index/crossref.go`. Trace how subject, tag, and entity adjacency maps are built, what weighting is used for connected results, and what the system deliberately does **not** do because it avoids a full graph database.
6. Read `external/modus-memory-main/internal/markdown/parser.go` and `external/modus-memory-main/internal/markdown/writer.go` after the retrieval core. Study frontmatter parsing, body parsing, wiki-link extraction, markdown write conventions, and how plain-file storage shapes operability and portability.
7. Read MCP tool handlers next: `external/modus-memory-main/internal/mcp/vault.go` and `external/modus-memory-main/internal/mcp/memory.go`. Trace which tools are free vs. Pro, where librarian expansion is invoked, where cross-reference hints are appended, and where reinforcement happens automatically on search recall.
8. Read `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/modus-memory-main/README.md` only after the source files above. Use it to validate claims about cached search speed, markdown-native persistence, binary size, MCP surface area, and the intended value proposition. Do not let README marketing copy override code evidence.
9. Compare Modus directly against current `Code_Environment/Public` memory behavior by reading `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts`, and `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts`. Be explicit about what this repo already does with FSRS-style decay and where Modus still differs materially.
10. Separate overlap cleanly across phases: avoid redoing `001` as a generic MCP memory-server study, avoid drifting into `002` markdown-scaffold and drift-detection patterns, and avoid reframing `003` as vector or plugin work owned by `004`. This phase owns BM25, lightweight caching, librarian expansion, FSRS reinforcement loops, and adjacency-map cross-references.
11. Before any deep-research run, ensure this phase folder contains the required Spec Kit docs for the research effort. If they are missing, note the gap and create or request them through the established spec workflow before claiming the phase is complete.
12. Validate the phase folder before deep research with:
    ```bash
    cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main" --strict
    ```
13. After validation passes, run deep research against this same phase folder using this exact topic:
    ```text
    Research the external repository at /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/modus-memory-main and identify concrete improvements for Code_Environment/Public, especially around spaced repetition memory decay, BM25 search ranking, query expansion, cross-referencing, and plain-markdown memory storage patterns.
    ```
14. Save all outputs inside this phase folder, especially under `research/`. Every meaningful finding must cite exact file paths, explain what Modus does, why it matters here, whether to `adopt now`, `prototype later`, or `reject`, what Public subsystem it affects, and what migration, compatibility, or validation risk comes with it.
15. When research is complete, update `checklist.md`, create `implementation-summary.md`, and save memory with:
    ```bash
    cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main"
    ```

## 6. Research Questions

1. How exactly does Modus implement BM25 scoring across path, source, subject, title, tags, and body, and which field-weight choices are likely to transfer well to `Code_Environment/Public`?
2. How much of Modus's search speed story comes from BM25 itself versus the tiered cache, prefix fallback, tokenization rules, and result deduplication?
3. How does librarian query expansion work in practice: what expansions are requested, how many variants are kept, how are duplicates merged, and what failure fallbacks exist?
4. What is the precise FSRS model in `internal/vault/facts.go`: initial stability by importance, memory-type difficulty modifiers, decay floor behavior, reinforcement growth, and access-count tracking?
5. How does automatic reinforcement on `memory_search` differ from explicit reinforcement tools, and what recall event model would make sense for Spec Kit Memory?
6. How does Modus's simple in-memory fact search interact with markdown-backed fact files, and what can be learned from that split between vault-wide search and fact-specific retrieval?
7. How are subject, tag, and entity cross-references represented, weighted, and surfaced, and where does the adjacency-map approach outperform or underperform richer causal or graph-based linking?
8. How does the markdown parser and writer shape operability: frontmatter fields, wiki links, body handling, file naming, duplicate avoidance, and human-editability?
9. Compared with Spec Kit Memory's current hybrid and FSRS-aware retrieval stack, which Modus ideas are genuinely missing, which are partial overlaps, and which would be redundant?
10. Which Modus patterns would best improve query-time recall in `Code_Environment/Public`: BM25 field boosts, query caching, lexical expansion, connected-result hints, or simpler markdown-vault ergonomics?
11. How credible are the README performance claims given the code structure, and what should be treated as a benchmark candidate versus an unverified marketing number?

## 7. Do's

- Do trace the FSRS algorithm in detail, including stability, difficulty, retrievability, confidence floors, and reinforcement updates.
- Do inspect the exact BM25 field weights, tokenization behavior, prefix-match fallback, and query-cache thresholds.
- Do study librarian query expansion as a lexical-recall layer, not as a generic "AI enhancement" feature.
- Do inspect the cross-referencing data model based on subject, tag, and entity adjacency maps.
- Do examine the markdown file format, write conventions, and duplicate-handling logic because plain-file operability is a core design choice.
- Do compare Modus against the current Spec Kit Memory code so recommendations distinguish overlap from net-new value.
- Do benchmark or at least critically assess performance claims where the code gives enough evidence to reason about likely bottlenecks.

## 8. Don'ts

- Do not focus on installation, packaging, Homebrew distribution, or release mechanics.
- Do not confuse FSRS spaced repetition with simple TTL expiry, stale-after-N-days logic, or a one-shot archive rule.
- Do not ignore the markdown storage format; git-friendly, human-readable persistence is part of the architecture, not just implementation detail.
- Do not quote README claims as proven if the source code does not validate them.
- Do not recommend replacing `Code_Environment/Public`'s semantic or hybrid retrieval with BM25 alone unless the evidence clearly supports that tradeoff.
- Do not describe this repo as lacking all FSRS or decay logic when current code already contains an FSRS-based scheduler and classification-decay path.
- Do not blur Modus's lightweight adjacency maps with existing causal-memory or code-graph capabilities; compare them precisely.
- Do not edit anything under `external/` or outside this phase folder.

## 9. Examples

### Example A: FSRS reinforcement finding

`internal/vault/facts.go` reinforces memories automatically when `memory_search` returns them, increasing stability, slightly lowering difficulty, updating `last_accessed`, and incrementing `access_count`. A strong finding would explain how that recall loop differs from Spec Kit Memory's current FSRS-aware decay layer, identify where automatic reinforcement could improve real-world memory freshness in `Code_Environment/Public`, and classify the idea as `adopt now`, `prototype later`, or `reject`.

### Example B: Librarian expansion finding

`internal/librarian/search.go` expands a natural-language query into 3-5 keyword-oriented variants, preserves the original query, caps the variant set, and falls back cleanly if parsing fails. A strong finding would explain how that lexical expansion could complement rather than replace current semantic retrieval in `Code_Environment/Public`, what guardrails are needed to prevent noisy recall, and whether the pattern should be adopted directly or only prototyped.

## 10. Constraints

### 10.1 Error handling

- If a cited file is missing or diverges from README claims, say so plainly instead of guessing.
- If the code and README disagree, prefer code evidence and mark the README statement as unverified or outdated.
- If comparison assumptions about `Code_Environment/Public` prove false, correct them in the research rather than preserving stale framing.
- If a performance claim cannot be reproduced from static analysis, label it as a claim to benchmark later, not an established fact.

### 10.2 Scope

**IN SCOPE**

- BM25 scoring, tokenization, stemming, field boosting, prefix fallback, and cache behavior
- librarian query expansion and result merging
- FSRS decay, reinforcement, floors, stability, difficulty, retrievability, and recall triggers
- subject, tag, and entity cross-referencing
- markdown file structure, parser/writer behavior, and vault ergonomics
- MCP tool handlers that expose search, memory, reinforcement, decay, and connected-doc surfaces
- comparison against current Spec Kit Memory retrieval and decay capabilities

**OUT OF SCOPE**

- installer UX, packaging, licensing strategy, or release engineering
- generic MCP primers unrelated to Modus's implementation choices
- vector search or embedding architecture except when explicitly contrasting with phase `004`
- markdown drift detection patterns primarily owned by phase `002`
- broad memory-server taxonomy that does not produce implementation-level recommendations

### 10.3 Prioritization framework

Rank findings in this order: improvement to retrieval quality in `Code_Environment/Public`, complementarity with existing hybrid retrieval instead of duplication, operational simplicity of implementation, markdown-native maintainability, quality of evidence in source code, and clarity of differentiation from phases `001`, `002`, and `004`.

## 11. Deliverables

- `phase-research-prompt.md` present and tailored to `003-modus-memory-main`
- `research/research.md` as the canonical report with at least 5 evidence-backed findings
- explicit comparison to current Public retrieval, FSRS decay, and memory-linking behavior
- clear classification of each recommendation as `adopt now`, `prototype later`, or `reject`
- `implementation-summary.md` created at the end
- memory saved from this phase folder using `generate-context.js`

Minimum finding schema:

- finding title
- exact source evidence
- what Modus Memory does
- why it matters for `Code_Environment/Public`
- recommendation: `adopt now`, `prototype later`, or `reject`
- affected repo area
- migration, compatibility, or validation risk

## 12. Evaluation Criteria

- CLEAR target: `>= 40/50`
- RICCE compliance is visible in the prompt:
  - **Role** is specialized in spaced repetition, BM25, cross-references, and local-first memory systems
  - **Instructions** are ordered, concrete, and path-specific
  - **Context** is domain-specific, cross-phase aware, and honest about current repo overlap
  - **Constraints** limit scope and define evidence handling
  - **Examples** show what strong Modus-derived findings look like
- at least 5 findings are backed by code evidence rather than README-only assertions
- findings distinguish overlap with current Spec Kit Memory from genuinely new value
- overlap with `001` and `004` is explicitly addressed so recommendations are not duplicated or misplaced
- markdown storage, BM25 ranking, FSRS reinforcement, and cross-reference mechanics are all covered directly

## 13. Completion Bar

The phase is only complete when all of the following are true:

- the reading order started with ranking and search files, then FSRS, then cross-references, then MCP handlers, then README validation
- current `Code_Environment/Public` FSRS and retrieval behavior was compared using code, not assumptions
- the validation command passed on this exact phase folder
- `research/research.md` contains at least 5 evidence-backed findings
- each finding is tagged `adopt now`, `prototype later`, or `reject`
- `checklist.md` is updated with evidence and completion marks
- `implementation-summary.md` exists
- memory is saved successfully for `003-modus-memory-main`
- no edits were made outside the phase folder
- cross-phase overlap with `001` and `004` is explicitly resolved
hook: SessionStart
hook: SessionStart Completed
hook: UserPromptSubmit
hook: UserPromptSubmit Completed
codex
I’m treating this as a read-only research synthesis pass for iteration 31, grounded in the existing phase folder and the prior Modus findings you included. I’ll pull the most relevant prior context, read the deep-research instructions plus the current phase artifacts, then trace just the source surfaces needed to draft a Q1/Q2/Q3 adoption roadmap with explicit dependencies.
exec
/bin/zsh -lc 'rg -n "modus|memory_review|memory_due|adjacency|doctor|roadmap|iteration 31|Q1|Q2|Q3" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,220p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
157:- rollout_summaries/2026-04-09T10-35-53-UGDf-009_post_save_render_fixes_memory_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T12-35-53-019d71d0-0ec5-7c80-a08b-6d336ee5c639.jsonl, updated_at=2026-04-09T12:01:25+00:00, thread_id=019d71d0-0ec5-7c80-a08b-6d336ee5c639)
415:- 999-feature-roadmap, 001-research-agentic-systems, phase-research-prompt.md, Level 3 Spec Kit docs, spec_kit:deep-research, external/
1250:- rollout_summaries/2026-03-27T12-56-48-Q3YU-advisor_routing_docs_update.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/27/rollout-2026-03-27T13-56-48-019d2f5e-65c4-7782-a36a-9db97f90df2c.jsonl, updated_at=2026-03-27T13:59:07+00:00, thread_id=019d2f5e-65c4-7782-a36a-9db97f90df2c)
1260:- rollout_summaries/2026-03-27T12-56-48-Q3YU-advisor_routing_docs_update.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/27/rollout-2026-03-27T13-56-48-019d2f5e-65c4-7782-a36a-9db97f90df2c.jsonl, updated_at=2026-03-27T13:59:07+00:00, thread_id=019d2f5e-65c4-7782-a36a-9db97f90df2c)
1584:- rollout_summaries/2026-03-20T15-43-19-Q1K1-hydra_governed_retrieval_specs.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/20/rollout-2026-03-20T16-43-19-019d0bea-55b4-7ec0-a57a-2a3c9f459fc9.jsonl, updated_at=2026-03-20T17:13:21+00:00, thread_id=019d0bea-55b4-7ec0-a57a-2a3c9f459fc9)
1761:scope: Hydra roadmap packaging, phase-1 implementation hardening, governance refinement, and scoped release execution
1764:## Task 1: Build Hydra-first Level-3 roadmap/spec pack for `015-hydra-db-based-features`
1772:- 015-hydra-db-based-features, Level 3+, Hydra-first roadmap, decision-record, AI protocol sections, SPECKIT_TEMPLATE_SOURCE
1869:- rollout_summaries/2026-03-13T11-01-44-IBXE-outsourced_agent_memory_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/13/rollout-2026-03-13T12-01-44-019ce6dc-0509-7630-9874-db11f57a9e06.jsonl, updated_at=2026-03-13T11:21:38+00:00, thread_id=019ce6dc-0509-7630-9874-db11f57a9e06)

 succeeded in 0ms:
---
name: sk-deep-research
description: "Autonomous deep research loop protocol with iterative investigation, externalized state, convergence detection, and fresh context per iteration"
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob, Task, WebFetch, memory_context, memory_search]
# Note: Task tool is for the command executor (loop management). The @deep-research agent itself does NOT have Task (LEAF-only).
argument-hint: "[topic] [:auto|:confirm] [--max-iterations=N] [--convergence=N]"
version: 1.4.0.0
---

<!-- Keywords: autoresearch, deep-research, iterative-research, autonomous-loop, convergence-detection, externalized-state, fresh-context, research-agent, JSONL-state, strategy-file -->

# Autonomous Deep Research Loop

Iterative research protocol with fresh context per iteration, externalized state, and convergence detection for deep technical investigation.

Runtime path resolution:
- OpenCode/Copilot runtime: `.opencode/agent/*.md`
- Claude runtime: `.claude/agents/*.md`
- Codex runtime: `.codex/agents/*.toml`

<!-- ANCHOR:when-to-use -->
## 1. WHEN TO USE

### When to Use This Skill

Use this skill when:
- Deep investigation requiring multiple rounds of discovery
- Topic spans 3+ technical domains or sources
- Initial findings need progressive refinement
- Overnight or unattended research sessions
- Research where prior findings inform subsequent queries

### When NOT to Use

- Simple, single-question research (use direct codebase search or `/spec_kit:plan`)
- Known-solution documentation (use `/spec_kit:plan`)
- Implementation tasks (use `/spec_kit:implement`)
- Quick codebase searches (use `@context` or direct Grep/Glob)
- Fewer than 3 sources needed (single-pass research suffices)

### Keyword Triggers

`autoresearch`, `deep research`, `autonomous research`, `research loop`, `iterative research`, `multi-round research`, `deep investigation`, `comprehensive research`

For iterative code review and quality auditing, see `sk-deep-review`.

### Lifecycle Contract

Live lifecycle branches:
- `resume` — continue the active lineage
- `restart` — start a new generation with explicit parent linkage
- `fork` — branch from the current packet state
- `completed-continue` — reopen a completed lineage only after immutable synthesis snapshotting

---

<!-- /ANCHOR:when-to-use -->
<!-- ANCHOR:smart-routing -->
## 2. SMART ROUTING

### Resource Loading Levels

| Level | When to Load | Resources |
|-------|-------------|-----------|
| ALWAYS | Every skill invocation | Quick reference baseline |
| CONDITIONAL | If intent signals match | Loop protocol, convergence, state format |
| ON_DEMAND | Only on explicit request | Templates, detailed specifications |

### Smart Router Pseudocode

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/quick_reference.md"

INTENT_SIGNALS = {
    "LOOP_SETUP": {"weight": 4, "keywords": ["autoresearch", "deep research", "research loop", "autonomous research"]},
    "ITERATION": {"weight": 4, "keywords": ["iteration", "next round", "continue research", "research cycle"]},
    "CONVERGENCE": {"weight": 3, "keywords": ["convergence", "stop condition", "diminishing returns", "stuck"]},
    "STATE": {"weight": 3, "keywords": ["state file", "JSONL", "strategy", "resume", "auto-resume"]},
}

NOISY_SYNONYMS = {
    "LOOP_SETUP": {"run research": 2.0, "investigate deeply": 1.8, "overnight research": 1.5},
    "ITERATION": {"another pass": 1.5, "keep searching": 1.4, "dig deeper": 1.6},
    "CONVERGENCE": {"good enough": 1.4, "stop when": 1.5, "diminishing": 1.6},
    "STATE": {"pick up where": 1.5, "continue from": 1.4, "resume": 1.8},
}

RESOURCE_MAP = {
    "LOOP_SETUP": ["references/loop_protocol.md", "references/state_format.md", "assets/deep_research_config.json"],
    "ITERATION": ["references/loop_protocol.md", "references/convergence.md"],
    "CONVERGENCE": ["references/convergence.md"],
    "STATE": ["references/state_format.md", "assets/deep_research_strategy.md"],
}

LOADING_LEVELS = {
    "ALWAYS": [DEFAULT_RESOURCE],
    "ON_DEMAND_KEYWORDS": ["full protocol", "all templates", "complete reference"],
    "ON_DEMAND": ["references/loop_protocol.md", "references/state_format.md", "references/convergence.md"],
}
```

### Scoped Guard

```python
def _guard_in_skill():
    """Verify this skill is active before loading resources."""
    if not hasattr(_guard_in_skill, '_active'):
        _guard_in_skill._active = True
    return _guard_in_skill._active

def discover_markdown_resources(base_path: Path) -> list[str]:
    """Discover all .md files in the assets directory."""
    return sorted(str(p.relative_to(base_path)) for p in (base_path / "references").glob("*.md"))
```

### Phase Detection

Detect the current research phase from dispatch context to load appropriate resources:

| Phase | Signal | Resources to Load |
|-------|--------|-------------------|
| Init | No JSONL exists | Loop protocol, state format |
| Iteration | Dispatch context includes iteration number | Loop protocol, convergence |
| Stuck | Dispatch context includes "RECOVERY" | Convergence, loop protocol |
| Synthesis | Convergence triggered STOP | Quick reference |

---

<!-- /ANCHOR:smart-routing -->
<!-- ANCHOR:how-it-works -->
## 3. HOW IT WORKS

### Architecture: 3-Layer Integration

```
User invokes: /spec_kit:deep-research "topic"
                    |
                    v
    ┌─────────────────────────────────┐
    │  /spec_kit:deep-research command│  Layer 1: Command
    │  (YAML workflow + loop config)    │  Manages loop lifecycle
    └──────────────┬──────────────────┘
                   |
                   v
    ┌─────────────────────────────────┐
    │     YAML Loop Engine            │  Layer 2: Workflow
    │  - Init (config, strategy)       │  Dispatch, evaluate, decide
    │  - Loop (dispatch + converge)   │
    │  - Synthesize (final output)     │
    │  - Save (memory context)        │
    └──────────────┬──────────────────┘
                   |  dispatches per iteration
                   v
    ┌─────────────────────────────────┐
    │    @deep-research (LEAF agent)  │  Layer 3: Agent
    │  - Reads: state + strategy      │  Fresh context each time
    │  - Executes ONE research cycle  │
    │  - Writes: findings + state      │
    │  - Tools: WebFetch, Grep, etc.  │
    └──────────────┬──────────────────┘
                   |
                   v
    ┌─────────────────────────────────┐
    │        State Files (disk)       │  Externalized State
    │  deep-research-config.json       │  Persists across iterations
    │  deep-research-state.jsonl      │
    │  deep-research-strategy.md      │
    │  findings-registry.json          │
    │  research/iterations/iteration-NNN.md │
    │  research/research.md (workflow-owned │
    │  progressive synthesis)         │
    └─────────────────────────────────┘
```

### Core Innovation: Fresh Context Per Iteration

Each agent dispatch gets a fresh context window. State continuity comes from files, not memory. This solves context degradation in long research sessions.

Adapted from: karpathy/autoresearch (loop concept), AGR (fresh context "Ralph Loop"), pi-autoresearch (JSONL state), autoresearch-opencode (context injection).

### Data Flow

```
Init --> Create config.json, strategy.md, state.jsonl
  |
Loop --> Read state --> Check convergence --> Dispatch @deep-research
  |                                              |
  |                                              v
  |                                         Agent executes:
  |                                         1. Read state files
  |                                         2. Determine focus
  |                                         3. Research (3-5 actions)
  |                                         4. Write iteration-NNN.md
  |                                         5. Update strategy.md
  |                                         6. Append state.jsonl
  |                                              |
  +<--- Evaluate results <-----------------------+
  |
  +--- Continue? --> Yes: next iteration
  |                  No: exit loop
  v
Synthesize --> Compile final research/research.md
  |
Save --> generate-context.js --> verify memory artifact
```

### Key Concepts

| Concept | Description |
|---------|-------------|
| **Externalized state** | All research continuity via files, not agent memory |
| **Fresh context** | Each iteration gets a clean agent with no prior context |
| **Convergence** | Multi-signal detection: newInfoRatio, stuck count, questions answered |
| **Strategy file** | Reducer-synchronized research steering with machine-owned sections |
| **JSONL log** | Append-only structured log for lineage and iteration data |
| **Findings registry** | Reducer-owned open/resolved questions, key findings, and ruled-out directions |

exec
/bin/zsh -lc 'rg --files /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/assets/fsrs-decay.svg
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/assets/security.svg
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/assets/architecture.svg
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/assets/hero.svg
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/assets/doctor.svg
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/assets/comparison.svg
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/assets/demo.svg
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/go.sum
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/MIGRATION_POST.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/entities.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/prs.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/helpers.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/beliefs.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/vault.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/trust.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/bm25.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/facts.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/learnings/learnings.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/learnings.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/server.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/json.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/writer.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/client.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/LICENSE
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/go.mod
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/entities.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/doctor.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/import_khoj.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/phase-research-prompt.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-010.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-024.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-004.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-020.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-014.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-005.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-015.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-001.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-011.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-025.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-006.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-016.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-002.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-012.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-026.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-003.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-013.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-027.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-007.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-023.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-017.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-008.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-018.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-009.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-019.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-029.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md

codex
I’ve confirmed the phase has the full iteration history and the deep-research workflow contract, so I’m now narrowing to the evidence that should shape the roadmap rather than rereading all 30 passes. Next I’m pulling the latest synthesis plus the exact Modus and Public code points behind the likely adoption sequence: `memory_review`, `memory_due`, adjacency-based rehydration, lexical fallback, and doctor/debug visibility.
Read-only deep-research iteration 31 focused on converting prior Modus findings into a phased adoption roadmap for Spec Kit Memory.
  ✓ Load relevant memory context, deep-research skill guidance, and phase artifact inventory
  → Read prior synthesis and verify the code evidence for likely roadmap candidates and dependencies
  • Draft iteration 031 roadmap with Q1/Q2/Q3 milestones, dependency links, and recommendation rationale
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	### Finding 6: Modus’s small curated tool bundle is easier to learn than Public’s broad surface
     2	- **Source**: [memory.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go#L7); [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md#L191); [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L482)
     3	- **What it does**: Modus deliberately narrows its memory-facing MCP surface to 11 tools. Public’s surface is more capable, but also harder for operators and AI clients to learn quickly.
     4	- **Why it matters**: Discoverability is part of DX. A smaller “operator bundle” can make a powerful system feel approachable without removing advanced capabilities.
     5	- **Recommendation**: **prototype later**. Keep Public’s full surface, but add a curated operator profile or alias bundle centered on search, status, review, debug, health, and adjacency.
     6	- **Impact**: **medium**
     7	
     8	## Assessment
     9	- New information ratio: **0.38**
    10	- Strict validation on the phase folder returned `RESULT: PASSED` with the same read-only temp-file warning from `validate.sh`.
    11	- This was a read-only iteration; I verified source evidence and current Public behavior, but did not update `research/research.md` or other phase artifacts.
    12	
    13	## Recommended Next Focus
    14	Run the next iteration on **operator workflow design**: map Public’s existing internals into a compact DX control plane with 3 concrete candidates only, `memory_status`, `memory_debug_search`, and `memory_review`, then judge whether each should be a new tool, a `profile:"debug"` response, or a wrapper around existing tools.
    15	--- Iteration 28 ---
    16	## Findings
    17	### Finding N: [Title]
    18	- **Source**: file path(s)
    19	- **What it does**: technical description
    20	- **Why it matters**: relevance to our system
    21	- **Recommendation**: adopt now / prototype later / reject / NEW FEATURE
    22	- **Impact**: high / medium / low
    23	--- Iteration 26 ---
    24	## Findings
    25	
    26	### Finding 1: Rank 1 (20/25) — explicit `memory_review` is the first thing Public should ship
    27	- **Source**: `external/internal/mcp/memory.go:7-15`; `external/internal/mcp/vault.go:885-897`; `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:39-43,197-215`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:529-585,840-877,1194-1202`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:300-316`
    28	- **What it does**: Modus exposes an explicit `memory_reinforce` operator action on top of its FSRS state. Public already has the underlying pieces: graded review math (`AGAIN/HARD/GOOD/EASY`), `processReview()` with `nextReviewDate`, and opt-in strengthening-on-access. The current exposed adjacent surface is `memory_validate`, which records only `wasUseful` feedback and does not let an operator issue a graded FSRS review.
    29	- **Why it matters for us**: This is the highest impact x feasibility transfer because it closes the clearest control-plane gap without inventing new storage or changing retrieval architecture. It also de-risks the bigger `memory_due` idea: until Public has a first-class graded review action, any future review queue would have no trustworthy way to record hard recalls, lapses, and easy wins distinctly.
    30	- **Recommendation**: **adopt now**
    31	- **Impact**: **high**
    32	
    33	- **Impact**: **high**
    34	
    35	### Finding 3: Modus’s cheapest useful rehydration primitive is adjacency, not session recovery
    36	- **Source**: [crossref.go:9](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go#L9); [crossref.go:41](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go#L41); [vault.go:75](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L75)
    37	- **What it does**: Modus builds lightweight subject/tag/entity adjacency maps at index time and appends connected documents to search output when they were not already returned by lexical search.
    38	- **Why it matters**: For compaction recovery, this is the most transferable Modus idea: after we recover the active spec/task, a cheap connected-neighbor pass could widen context without immediately paying for heavier graph or semantic expansion.
    39	- **Recommendation**: **prototype later**
    40	- **Impact**: **medium**
    41	
    42	### Finding 4: Modus’s automatic recall loop is too blunt to map directly onto compaction injection
    43	- **Source**: [vault.go:287](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L287); [vault.go:311](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L311); [facts.go:64](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go#L64); [facts.go:160](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go#L160); [parser.go:65](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go#L65); [writer.go:10](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/writer.go#L10)
    44	- **What it does**: `memory_search` reinforces every returned fact asynchronously, and reinforcement/decay write updated confidence/stability/difficulty/access metadata back into markdown frontmatter.
    45	--
    46	--- Iteration 29 ---
    47	## Findings
    48	### Finding N: [Title]
    49	- **Source**: file path(s)
    50	- **What it does**: technical description
    51	- **Why it matters**: relevance to our system
    52	- **Recommendation**: adopt now / prototype later / reject / NEW FEATURE
    53	- **Impact**: high / medium / low
    54	--- Iteration 26 ---
    55	## Findings
    56	
    57	### Finding 1: Rank 1 (20/25) — explicit `memory_review` is the first thing Public should ship
    58	- **Source**: `external/internal/mcp/memory.go:7-15`; `external/internal/mcp/vault.go:885-897`; `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:39-43,197-215`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:529-585,840-877,1194-1202`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:300-316`
    59	- **What it does**: Modus exposes an explicit `memory_reinforce` operator action on top of its FSRS state. Public already has the underlying pieces: graded review math (`AGAIN/HARD/GOOD/EASY`), `processReview()` with `nextReviewDate`, and opt-in strengthening-on-access. The current exposed adjacent surface is `memory_validate`, which records only `wasUseful` feedback and does not let an operator issue a graded FSRS review.
    60	- **Why it matters for us**: This is the highest impact x feasibility transfer because it closes the clearest control-plane gap without inventing new storage or changing retrieval architecture. It also de-risks the bigger `memory_due` idea: until Public has a first-class graded review action, any future review queue would have no trustworthy way to record hard recalls, lapses, and easy wins distinctly.
    61	- **Recommendation**: **adopt now**
    62	- **Impact**: **high**
    63	
    64	- **Impact**: **high**
    65	
    66	### Finding 3: Modus’s cheapest useful rehydration primitive is adjacency, not session recovery
    67	- **Source**: [crossref.go:9](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go#L9); [crossref.go:41](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go#L41); [vault.go:75](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L75)
    68	- **What it does**: Modus builds lightweight subject/tag/entity adjacency maps at index time and appends connected documents to search output when they were not already returned by lexical search.
    69	- **Why it matters**: For compaction recovery, this is the most transferable Modus idea: after we recover the active spec/task, a cheap connected-neighbor pass could widen context without immediately paying for heavier graph or semantic expansion.
    70	- **Recommendation**: **prototype later**
    71	- **Impact**: **medium**
    72	
    73	### Finding 4: Modus’s automatic recall loop is too blunt to map directly onto compaction injection
    74	- **Source**: [vault.go:287](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L287); [vault.go:311](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L311); [facts.go:64](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go#L64); [facts.go:160](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go#L160); [parser.go:65](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go#L65); [writer.go:10](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/writer.go#L10)
    75	- **What it does**: `memory_search` reinforces every returned fact asynchronously, and reinforcement/decay write updated confidence/stability/difficulty/access metadata back into markdown frontmatter.
    76	--
    77	
    78	RESEARCH BRIEF:
    79	# $refine TIDD-EC Prompt: 003-modus-memory-main
    80	
    81	## 2. Role
    82	
    83	You are a research specialist in spaced repetition memory systems, BM25 search ranking, cross-referenced knowledge graphs, MCP-exposed local memory services, and local-first personal memory architectures. Work like a systems analyst who can trace implementation details from source code, separate README claims from verified mechanics, and translate Modus Memory's specific design choices into concrete improvements for `Code_Environment/Public`.
    84	
    85	## 3. Task
    86	
    87	Research Modus Memory's FSRS spaced repetition, BM25 search ranking, and cross-referencing patterns to identify practical, evidence-backed improvements for `Code_Environment/Public`'s memory search and retrieval, especially around memory decay and reinforcement, query expansion, knowledge linking, and plain-markdown memory storage patterns. Determine which ideas should be `adopt now`, `prototype later`, or `reject`.
    88	
    89	## 4. Context
    90	
    91	### 4.1 System Description
    92	
    93	Modus Memory is a local memory server that stores data as plain markdown files, exposes MCP tools, uses BM25 with field boosting, layers a tiered query cache over lexical retrieval, applies FSRS-style spaced repetition with decay and reinforcement, builds cross-references from subjects, tags, and entities, and uses a librarian query expander to widen lexical recall without relying on vectors. The core attraction is a lightweight local binary, markdown-native persistence, and search behavior that mixes ranking, recency, and linked context while staying git-friendly and human-readable.
    94	
    95	### 4.2 Cross-Phase Awareness Table
    96	
    97	| Phase | System | Core Pattern | Overlap Risk | Differentiation |
    98	| --- | --- | --- | --- | --- |
    99	| 001 | Engram | MCP memory server (Go, SQLite+FTS5) | 003 (MCP memory) | Focus tool profiles, session lifecycle, topic keys |
   100	| 002 | Mex | Markdown scaffold + drift detection | 003 (markdown storage) | Focus drift detection, scaffold structure |
   101	| 003 | Modus Memory | FSRS spaced repetition + BM25 | 001 (FTS5), 004 (local memory) | Focus FSRS decay, cross-referencing, librarian expansion |
   102	| 004 | OpenCode Mnemosyne | Hybrid search (FTS5 + vector) | 003 (local memory) | Focus vector search, plugin architecture |
   103	
   104	### 4.3 What This Repo Already Has
   105	
   106	`Code_Environment/Public` already has Spec Kit Memory with semantic and hybrid retrieval, markdown-backed memory artifacts, importance tiers, and an FSRS-based classification-decay layer in the MCP server. It does **not** currently mirror Modus Memory's end-to-end local vault server model, BM25 field-boosted lexical search with lightweight query caching, librarian-style synonym expansion for keyword retrieval, or simple subject/tag/entity adjacency maps that surface connected documents directly in result sets. Base the comparison on current code, not stale assumptions.
   107	
   108	## 5. Instructions
   109	
   110	1. Treat `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main` as the pre-approved phase folder. Skip Gate 3, keep all writes inside this phase folder, and treat everything under `external/` as read-only.
   111	2. Start with the lexical search implementation: read `external/modus-memory-main/internal/index/bm25.go`, `external/modus-memory-main/internal/index/cache.go`, and `external/modus-memory-main/internal/librarian/search.go` before anything else. Trace tokenization, stemming, field weights, prefix matching, Jaccard cache reuse, and query expansion order.
   112	3. After the ranking path, read `external/modus-memory-main/internal/index/indexer.go` if needed to confirm how documents are loaded into the search engine and how search results are assembled. Keep focus on ranking behavior, not generic indexing boilerplate.
   113	4. Next, trace FSRS and memory-fact behavior by reading `external/modus-memory-main/internal/vault/facts.go` and `external/modus-memory-main/internal/index/facts.go`. Extract the exact stability, difficulty, confidence, floor, access-count, and reinforcement mechanics. Do not collapse these into a generic "TTL" description.
   114	5. After FSRS, inspect cross-referencing by reading `external/modus-memory-main/internal/index/crossref.go`. Trace how subject, tag, and entity adjacency maps are built, what weighting is used for connected results, and what the system deliberately does **not** do because it avoids a full graph database.
   115	6. Read `external/modus-memory-main/internal/markdown/parser.go` and `external/modus-memory-main/internal/markdown/writer.go` after the retrieval core. Study frontmatter parsing, body parsing, wiki-link extraction, markdown write conventions, and how plain-file storage shapes operability and portability.
   116	7. Read MCP tool handlers next: `external/modus-memory-main/internal/mcp/vault.go` and `external/modus-memory-main/internal/mcp/memory.go`. Trace which tools are free vs. Pro, where librarian expansion is invoked, where cross-reference hints are appended, and where reinforcement happens automatically on search recall.
   117	8. Read `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/modus-memory-main/README.md` only after the source files above. Use it to validate claims about cached search speed, markdown-native persistence, binary size, MCP surface area, and the intended value proposition. Do not let README marketing copy override code evidence.
   118	9. Compare Modus directly against current `Code_Environment/Public` memory behavior by reading `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts`, and `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts`. Be explicit about what this repo already does with FSRS-style decay and where Modus still differs materially.
   119	10. Separate overlap cleanly across phases: avoid redoing `001` as a generic MCP memory-server study, avoid drifting into `002` markdown-scaffold and drift-detection patterns, and avoid reframing `003` as vector or plugin work owned by `004`. This phase owns BM25, lightweight caching, librarian expansion, FSRS reinforcement loops, and adjacency-map cross-references.
   120	11. Before any deep-research run, ensure this phase folder contains the required Spec Kit docs for the research effort. If they are missing, note the gap and create or request them through the established spec workflow before claiming the phase is complete.
   121	12. Validate the phase folder before deep research with:
   122	    ```bash
   123	    cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main" --strict
   124	    ```
   125	13. After validation passes, run deep research against this same phase folder using this exact topic:
   126	    ```text
   127	    Research the external repository at /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/modus-memory-main and identify concrete improvements for Code_Environment/Public, especially around spaced repetition memory decay, BM25 search ranking, query expansion, cross-referencing, and plain-markdown memory storage patterns.
   128	    ```
   129	14. Save all outputs inside this phase folder, especially under `research/`. Every meaningful finding must cite exact file paths, explain what Modus does, why it matters here, whether to `adopt now`, `prototype later`, or `reject`, what Public subsystem it affects, and what migration, compatibility, or validation risk comes with it.
   130	15. When research is complete, update `checklist.md`, create `implementation-summary.md`, and save memory with:
   131	    ```bash
   132	    cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main"
   133	    ```
   134	
   135	## 6. Research Questions
   136	
   137	1. How exactly does Modus implement BM25 scoring across path, source, subject, title, tags, and body, and which field-weight choices are likely to transfer well to `Code_Environment/Public`?
   138	2. How much of Modus's search speed story comes from BM25 itself versus the tiered cache, prefix fallback, tokenization rules, and result deduplication?
   139	3. How does librarian query expansion work in practice: what expansions are requested, how many variants are kept, how are duplicates merged, and what failure fallbacks exist?
   140	4. What is the precise FSRS model in `internal/vault/facts.go`: initial stability by importance, memory-type difficulty modifiers, decay floor behavior, reinforcement growth, and access-count tracking?
   141	5. How does automatic reinforcement on `memory_search` differ from explicit reinforcement tools, and what recall event model would make sense for Spec Kit Memory?
   142	6. How does Modus's simple in-memory fact search interact with markdown-backed fact files, and what can be learned from that split between vault-wide search and fact-specific retrieval?
   143	7. How are subject, tag, and entity cross-references represented, weighted, and surfaced, and where does the adjacency-map approach outperform or underperform richer causal or graph-based linking?
   144	8. How does the markdown parser and writer shape operability: frontmatter fields, wiki links, body handling, file naming, duplicate avoidance, and human-editability?
   145	9. Compared with Spec Kit Memory's current hybrid and FSRS-aware retrieval stack, which Modus ideas are genuinely missing, which are partial overlaps, and which would be redundant?
   146	10. Which Modus patterns would best improve query-time recall in `Code_Environment/Public`: BM25 field boosts, query caching, lexical expansion, connected-result hints, or simpler markdown-vault ergonomics?
   147	11. How credible are the README performance claims given the code structure, and what should be treated as a benchmark candidate versus an unverified marketing number?
   148	
   149	## 7. Do's
   150	
   151	- Do trace the FSRS algorithm in detail, including stability, difficulty, retrievability, confidence floors, and reinforcement updates.
   152	- Do inspect the exact BM25 field weights, tokenization behavior, prefix-match fallback, and query-cache thresholds.
   153	- Do study librarian query expansion as a lexical-recall layer, not as a generic "AI enhancement" feature.
   154	- Do inspect the cross-referencing data model based on subject, tag, and entity adjacency maps.
   155	- Do examine the markdown file format, write conventions, and duplicate-handling logic because plain-file operability is a core design choice.
   156	- Do compare Modus against the current Spec Kit Memory code so recommendations distinguish overlap from net-new value.
   157	- Do benchmark or at least critically assess performance claims where the code gives enough evidence to reason about likely bottlenecks.
   158	
   159	## 8. Don'ts
   160	
   161	- Do not focus on installation, packaging, Homebrew distribution, or release mechanics.
   162	- Do not confuse FSRS spaced repetition with simple TTL expiry, stale-after-N-days logic, or a one-shot archive rule.
   163	- Do not ignore the markdown storage format; git-friendly, human-readable persistence is part of the architecture, not just implementation detail.
   164	- Do not quote README claims as proven if the source code does not validate them.
   165	- Do not recommend replacing `Code_Environment/Public`'s semantic or hybrid retrieval with BM25 alone unless the evidence clearly supports that tradeoff.
   166	- Do not describe this repo as lacking all FSRS or decay logic when current code already contains an FSRS-based scheduler and classification-decay path.
   167	- Do not blur Modus's lightweight adjacency maps with existing causal-memory or code-graph capabilities; compare them precisely.
   168	- Do not edit anything under `external/` or outside this phase folder.
   169	
   170	## 9. Examples
   171	
   172	### Example A: FSRS reinforcement finding
   173	
   174	`internal/vault/facts.go` reinforces memories automatically when `memory_search` returns them, increasing stability, slightly lowering difficulty, updating `last_accessed`, and incrementing `access_count`. A strong finding would explain how that recall loop differs from Spec Kit Memory's current FSRS-aware decay layer, identify where automatic reinforcement could improve real-world memory freshness in `Code_Environment/Public`, and classify the idea as `adopt now`, `prototype later`, or `reject`.
   175	
   176	### Example B: Librarian expansion finding
   177	
   178	`internal/librarian/search.go` expands a natural-language query into 3-5 keyword-oriented variants, preserves the original query, caps the variant set, and falls back cleanly if parsing fails. A strong finding would explain how that lexical expansion could complement rather than replace current semantic retrieval in `Code_Environment/Public`, what guardrails are needed to prevent noisy recall, and whether the pattern should be adopted directly or only prototyped.
   179	
   180	## 10. Constraints
   181	
   182	### 10.1 Error handling
   183	
   184	- If a cited file is missing or diverges from README claims, say so plainly instead of guessing.
   185	- If the code and README disagree, prefer code evidence and mark the README statement as unverified or outdated.
   186	- If comparison assumptions about `Code_Environment/Public` prove false, correct them in the research rather than preserving stale framing.
   187	- If a performance claim cannot be reproduced from static analysis, label it as a claim to benchmark later, not an established fact.
   188	
   189	### 10.2 Scope
   190	
   191	**IN SCOPE**
   192	
   193	- BM25 scoring, tokenization, stemming, field boosting, prefix fallback, and cache behavior
   194	- librarian query expansion and result merging
   195	- FSRS decay, reinforcement, floors, stability, difficulty, retrievability, and recall triggers
   196	- subject, tag, and entity cross-referencing
   197	- markdown file structure, parser/writer behavior, and vault ergonomics
   198	- MCP tool handlers that expose search, memory, reinforcement, decay, and connected-doc surfaces
   199	- comparison against current Spec Kit Memory retrieval and decay capabilities
   200	
   201	**OUT OF SCOPE**
   202	
   203	- installer UX, packaging, licensing strategy, or release engineering
   204	- generic MCP primers unrelated to Modus's implementation choices
   205	- vector search or embedding architecture except when explicitly contrasting with phase `004`
   206	- markdown drift detection patterns primarily owned by phase `002`
   207	- broad memory-server taxonomy that does not produce implementation-level recommendations
   208	
   209	### 10.3 Prioritization framework
   210	
   211	Rank findings in this order: improvement to retrieval quality in `Code_Environment/Public`, complementarity with existing hybrid retrieval instead of duplication, operational simplicity of implementation, markdown-native maintainability, quality of evidence in source code, and clarity of differentiation from phases `001`, `002`, and `004`.
   212	
   213	## 11. Deliverables
   214	
   215	- `phase-research-prompt.md` present and tailored to `003-modus-memory-main`
   216	- `research/research.md` as the canonical report with at least 5 evidence-backed findings
   217	- explicit comparison to current Public retrieval, FSRS decay, and memory-linking behavior
   218	- clear classification of each recommendation as `adopt now`, `prototype later`, or `reject`
   219	- `implementation-summary.md` created at the end
   220	- memory saved from this phase folder using `generate-context.js`
   221	
   222	Minimum finding schema:
   223	
   224	- finding title
   225	- exact source evidence
   226	- what Modus Memory does
   227	- why it matters for `Code_Environment/Public`
   228	- recommendation: `adopt now`, `prototype later`, or `reject`
   229	- affected repo area
   230	- migration, compatibility, or validation risk
   231	
   232	## 12. Evaluation Criteria
   233	
   234	- CLEAR target: `>= 40/50`
   235	- RICCE compliance is visible in the prompt:
   236	  - **Role** is specialized in spaced repetition, BM25, cross-references, and local-first memory systems
   237	  - **Instructions** are ordered, concrete, and path-specific
   238	  - **Context** is domain-specific, cross-phase aware, and honest about current repo overlap
   239	  - **Constraints** limit scope and define evidence handling
   240	  - **Examples** show what strong Modus-derived findings look like
   241	- at least 5 findings are backed by code evidence rather than README-only assertions
   242	- findings distinguish overlap with current Spec Kit Memory from genuinely new value
   243	- overlap with `001` and `004` is explicitly addressed so recommendations are not duplicated or misplaced
   244	- markdown storage, BM25 ranking, FSRS reinforcement, and cross-reference mechanics are all covered directly
   245	
   246	## 13. Completion Bar
   247	
   248	The phase is only complete when all of the following are true:
   249	
   250	- the reading order started with ranking and search files, then FSRS, then cross-references, then MCP handlers, then README validation
   251	- current `Code_Environment/Public` FSRS and retrieval behavior was compared using code, not assumptions
   252	- the validation command passed on this exact phase folder
   253	- `research/research.md` contains at least 5 evidence-backed findings
   254	- each finding is tagged `adopt now`, `prototype later`, or `reject`
   255	- `checklist.md` is updated with evidence and completion marks
   256	- `implementation-summary.md` exists
   257	- memory is saved successfully for `003-modus-memory-main`
   258	- no edits were made outside the phase folder
   259	- cross-phase overlap with `001` and `004` is explicitly resolved
   260	

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	package mcp
     2	
     3	import (
     4		"github.com/GetModus/modus-memory/internal/vault"
     5	)
     6	
     7	// RegisterMemoryTools registers the 11 MCP tools for the modus-memory server.
     8	// All features are free and unrestricted.
     9	//
    10	// Tools:
    11	//
    12	//	vault_search, vault_read, vault_write, vault_list, vault_status,
    13	//	memory_facts, memory_search, memory_store,
    14	//	memory_reinforce, memory_decay_facts, vault_connected
    15	func RegisterMemoryTools(srv *Server, v *vault.Vault) {
    16		RegisterVaultTools(srv, v)
    17	
    18		// Keep only the 11 memory-relevant tools
    19		keep := map[string]bool{
    20			"vault_search":      true,
    21			"vault_read":        true,
    22			"vault_write":       true,
    23			"vault_list":        true,
    24			"vault_status":      true,
    25			"memory_facts":      true,
    26			"memory_search":     true,
    27			"memory_store":      true,
    28			"memory_reinforce":  true,
    29			"memory_decay_facts": true,
    30			"vault_connected":   true,
    31		}
    32	
    33		for name := range srv.tools {
    34			if !keep[name] {
    35				delete(srv.tools, name)
    36				delete(srv.handlers, name)
    37			}
    38		}
    39	}

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go | sed -n '860,980p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   860			if err != nil {
   861				return "", err
   862			}
   863			return fmt.Sprintf("Decayed %d memory facts.", n), nil
   864		})
   865	
   866		srv.AddTool("memory_archive_stale", "Archive stale memory facts below confidence threshold.", map[string]interface{}{
   867			"type": "object",
   868			"properties": map[string]interface{}{
   869				"threshold": map[string]interface{}{"type": "number", "description": "Confidence threshold (default 0.1)"},
   870			},
   871		}, func(args map[string]interface{}) (string, error) {
   872			threshold := 0.1
   873			if t, ok := args["threshold"].(float64); ok {
   874				threshold = t
   875			}
   876			n, err := v.ArchiveStaleFacts(threshold)
   877			if err != nil {
   878				return "", err
   879			}
   880			return fmt.Sprintf("Archived %d stale facts (below %.2f confidence).", n, threshold), nil
   881		})
   882	
   883		// --- Memory: Reinforce Fact ---
   884	
   885		srv.AddTool("memory_reinforce", "Reinforce a memory fact after successful recall (FSRS stability growth).", map[string]interface{}{
   886			"type": "object",
   887			"properties": map[string]interface{}{
   888				"path": map[string]interface{}{"type": "string", "description": "Relative vault path to the fact (e.g. memory/facts/some-fact.md)"},
   889			},
   890			"required": []string{"path"},
   891		}, func(args map[string]interface{}) (string, error) {
   892			path, _ := args["path"].(string)
   893			if err := v.ReinforceFact(path); err != nil {
   894				return "", err
   895			}
   896			return fmt.Sprintf("Reinforced %s — stability increased, difficulty decreased.", path), nil
   897		})
   898	
   899		// --- Cross-Reference Query ---
   900	
   901		srv.AddTool("vault_connected", "Find all documents connected to a subject, entity, or tag. Returns facts, beliefs, entities, articles, learnings, and missions that share references.", map[string]interface{}{
   902			"type": "object",
   903			"properties": map[string]interface{}{
   904				"query": map[string]interface{}{"type": "string", "description": "Subject, entity name, or tag to find connections for"},
   905				"limit": map[string]interface{}{"type": "integer", "description": "Max results (default 20)"},
   906			},
   907			"required": []string{"query"},
   908		}, func(args map[string]interface{}) (string, error) {
   909			query, _ := args["query"].(string)
   910			limit := 20
   911			if l, ok := args["limit"].(float64); ok {
   912				limit = int(l)
   913			}
   914	
   915			if v.Index == nil {
   916				return "Index not loaded.", nil
   917			}
   918	
   919			refs := v.Index.Connected(query, limit)
   920			if len(refs) == 0 {
   921				return fmt.Sprintf("No cross-references found for %q.", query), nil
   922			}
   923	
   924			return index.FormatConnected(refs), nil
   925		})
   926	
   927		// --- Distillation Status ---
   928	
   929		srv.AddTool("distill_status", "Check training pair collection and distillation readiness.", map[string]interface{}{
   930			"type": "object", "properties": map[string]interface{}{},
   931		}, func(args map[string]interface{}) (string, error) {
   932			home, _ := os.UserHomeDir()
   933			statusPath := filepath.Join(home, "modus", "data", "distill", "STATUS.md")
   934			data, err := os.ReadFile(statusPath)
   935			if err != nil {
   936				// Check raw pair counts
   937				sageDir := filepath.Join(v.Dir, "training", "sage")
   938				sageEntries, _ := os.ReadDir(sageDir)
   939				runsDir := filepath.Join(v.Dir, "experience", "runs")
   940				runEntries, _ := os.ReadDir(runsDir)
   941				return fmt.Sprintf("Distillation pipeline active. Sources: %d SAGE files, %d agent run logs. Run the distill cadence to generate dataset.", len(sageEntries), len(runEntries)), nil
   942			}
   943			return string(data), nil
   944		})
   945	}
   946	
   947	func truncateStr(s string, n int) string {
   948		if len(s) <= n {
   949			return s
   950		}
   951		return s[:n-3] + "..."
   952	}

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	---
     2	title: "Deep Research Report: 003-modus-memory-main"
     3	description: "30-iteration deep research synthesis"
     4	---
     5	
     6	# Deep Research Report: 003-modus-memory-main
     7	
     8	Generated: 2026-04-10 23:37
     9	Iterations: 30
    10	Engine: Codex GPT-5.4 High (fast mode)
    11	
    12	---
    13	
    14	# $refine TIDD-EC Prompt: 003-modus-memory-main
    15	
    16	## 2. Role
    17	
    18	You are a research specialist in spaced repetition memory systems, BM25 search ranking, cross-referenced knowledge graphs, MCP-exposed local memory services, and local-first personal memory architectures. Work like a systems analyst who can trace implementation details from source code, separate README claims from verified mechanics, and translate Modus Memory's specific design choices into concrete improvements for `Code_Environment/Public`.
    19	
    20	## 3. Task
    21	
    22	Research Modus Memory's FSRS spaced repetition, BM25 search ranking, and cross-referencing patterns to identify practical, evidence-backed improvements for `Code_Environment/Public`'s memory search and retrieval, especially around memory decay and reinforcement, query expansion, knowledge linking, and plain-markdown memory storage patterns. Determine which ideas should be `adopt now`, `prototype later`, or `reject`.
    23	
    24	## 4. Context
    25	
    26	### 4.1 System Description
    27	
    28	Modus Memory is a local memory server that stores data as plain markdown files, exposes MCP tools, uses BM25 with field boosting, layers a tiered query cache over lexical retrieval, applies FSRS-style spaced repetition with decay and reinforcement, builds cross-references from subjects, tags, and entities, and uses a librarian query expander to widen lexical recall without relying on vectors. The core attraction is a lightweight local binary, markdown-native persistence, and search behavior that mixes ranking, recency, and linked context while staying git-friendly and human-readable.
    29	
    30	### 4.2 Cross-Phase Awareness Table
    31	
    32	| Phase | System | Core Pattern | Overlap Risk | Differentiation |
    33	| --- | --- | --- | --- | --- |
    34	| 001 | Engram | MCP memory server (Go, SQLite+FTS5) | 003 (MCP memory) | Focus tool profiles, session lifecycle, topic keys |
    35	| 002 | Mex | Markdown scaffold + drift detection | 003 (markdown storage) | Focus drift detection, scaffold structure |
    36	| 003 | Modus Memory | FSRS spaced repetition + BM25 | 001 (FTS5), 004 (local memory) | Focus FSRS decay, cross-referencing, librarian expansion |
    37	| 004 | OpenCode Mnemosyne | Hybrid search (FTS5 + vector) | 003 (local memory) | Focus vector search, plugin architecture |
    38	
    39	### 4.3 What This Repo Already Has
    40	
    41	`Code_Environment/Public` already has Spec Kit Memory with semantic and hybrid retrieval, markdown-backed memory artifacts, importance tiers, and an FSRS-based classification-decay layer in the MCP server. It does **not** currently mirror Modus Memory's end-to-end local vault server model, BM25 field-boosted lexical search with lightweight query caching, librarian-style synonym expansion for keyword retrieval, or simple subject/tag/entity adjacency maps that surface connected documents directly in result sets. Base the comparison on current code, not stale assumptions.
    42	
    43	## 5. Instructions
    44	
    45	1. Treat `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main` as the pre-approved phase folder. Skip Gate 3, keep all writes inside this phase folder, and treat everything under `external/` as read-only.
    46	2. Start with the lexical search implementation: read `external/modus-memory-main/internal/index/bm25.go`, `external/modus-memory-main/internal/index/cache.go`, and `external/modus-memory-main/internal/librarian/search.go` before anything else. Trace tokenization, stemming, field weights, prefix matching, Jaccard cache reuse, and query expansion order.
    47	3. After the ranking path, read `external/modus-memory-main/internal/index/indexer.go` if needed to confirm how documents are loaded into the search engine and how search results are assembled. Keep focus on ranking behavior, not generic indexing boilerplate.
    48	4. Next, trace FSRS and memory-fact behavior by reading `external/modus-memory-main/internal/vault/facts.go` and `external/modus-memory-main/internal/index/facts.go`. Extract the exact stability, difficulty, confidence, floor, access-count, and reinforcement mechanics. Do not collapse these into a generic "TTL" description.
    49	5. After FSRS, inspect cross-referencing by reading `external/modus-memory-main/internal/index/crossref.go`. Trace how subject, tag, and entity adjacency maps are built, what weighting is used for connected results, and what the system deliberately does **not** do because it avoids a full graph database.
    50	6. Read `external/modus-memory-main/internal/markdown/parser.go` and `external/modus-memory-main/internal/markdown/writer.go` after the retrieval core. Study frontmatter parsing, body parsing, wiki-link extraction, markdown write conventions, and how plain-file storage shapes operability and portability.
    51	7. Read MCP tool handlers next: `external/modus-memory-main/internal/mcp/vault.go` and `external/modus-memory-main/internal/mcp/memory.go`. Trace which tools are free vs. Pro, where librarian expansion is invoked, where cross-reference hints are appended, and where reinforcement happens automatically on search recall.
    52	8. Read `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/modus-memory-main/README.md` only after the source files above. Use it to validate claims about cached search speed, markdown-native persistence, binary size, MCP surface area, and the intended value proposition. Do not let README marketing copy override code evidence.
    53	9. Compare Modus directly against current `Code_Environment/Public` memory behavior by reading `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts`, and `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts`. Be explicit about what this repo already does with FSRS-style decay and where Modus still differs materially.
    54	10. Separate overlap cleanly across phases: avoid redoing `001` as a generic MCP memory-server study, avoid drifting into `002` markdown-scaffold and drift-detection patterns, and avoid reframing `003` as vector or plugin work owned by `004`. This phase owns BM25, lightweight caching, librarian expansion, FSRS reinforcement loops, and adjacency-map cross-references.
    55	11. Before any deep-research run, ensure this phase folder contains the required Spec Kit docs for the research effort. If they are missing, note the gap and create or request them through the established spec workflow before claiming the phase is complete.
    56	12. Validate the phase folder before deep research with:
    57	    ```bash
    58	    cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main" --strict
    59	    ```
    60	13. After validation passes, run deep research against this same phase folder using this exact topic:
    61	    ```text
    62	    Research the external repository at /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/modus-memory-main and identify concrete improvements for Code_Environment/Public, especially around spaced repetition memory decay, BM25 search ranking, query expansion, cross-referencing, and plain-markdown memory storage patterns.
    63	    ```
    64	14. Save all outputs inside this phase folder, especially under `research/`. Every meaningful finding must cite exact file paths, explain what Modus does, why it matters here, whether to `adopt now`, `prototype later`, or `reject`, what Public subsystem it affects, and what migration, compatibility, or validation risk comes with it.
    65	15. When research is complete, update `checklist.md`, create `implementation-summary.md`, and save memory with:
    66	    ```bash
    67	    cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main"
    68	    ```
    69	
    70	## 6. Research Questions
    71	
    72	1. How exactly does Modus implement BM25 scoring across path, source, subject, title, tags, and body, and which field-weight choices are likely to transfer well to `Code_Environment/Public`?
    73	2. How much of Modus's search speed story comes from BM25 itself versus the tiered cache, prefix fallback, tokenization rules, and result deduplication?
    74	3. How does librarian query expansion work in practice: what expansions are requested, how many variants are kept, how are duplicates merged, and what failure fallbacks exist?
    75	4. What is the precise FSRS model in `internal/vault/facts.go`: initial stability by importance, memory-type difficulty modifiers, decay floor behavior, reinforcement growth, and access-count tracking?
    76	5. How does automatic reinforcement on `memory_search` differ from explicit reinforcement tools, and what recall event model would make sense for Spec Kit Memory?
    77	6. How does Modus's simple in-memory fact search interact with markdown-backed fact files, and what can be learned from that split between vault-wide search and fact-specific retrieval?
    78	7. How are subject, tag, and entity cross-references represented, weighted, and surfaced, and where does the adjacency-map approach outperform or underperform richer causal or graph-based linking?
    79	8. How does the markdown parser and writer shape operability: frontmatter fields, wiki links, body handling, file naming, duplicate avoidance, and human-editability?
    80	9. Compared with Spec Kit Memory's current hybrid and FSRS-aware retrieval stack, which Modus ideas are genuinely missing, which are partial overlaps, and which would be redundant?
    81	10. Which Modus patterns would best improve query-time recall in `Code_Environment/Public`: BM25 field boosts, query caching, lexical expansion, connected-result hints, or simpler markdown-vault ergonomics?
    82	11. How credible are the README performance claims given the code structure, and what should be treated as a benchmark candidate versus an unverified marketing number?
    83	
    84	## 7. Do's
    85	
    86	- Do trace the FSRS algorithm in detail, including stability, difficulty, retrievability, confidence floors, and reinforcement updates.
    87	- Do inspect the exact BM25 field weights, tokenization behavior, prefix-match fallback, and query-cache thresholds.
    88	- Do study librarian query expansion as a lexical-recall layer, not as a generic "AI enhancement" feature.
    89	- Do inspect the cross-referencing data model based on subject, tag, and entity adjacency maps.
    90	- Do examine the markdown file format, write conventions, and duplicate-handling logic because plain-file operability is a core design choice.
    91	- Do compare Modus against the current Spec Kit Memory code so recommendations distinguish overlap from net-new value.
    92	- Do benchmark or at least critically assess performance claims where the code gives enough evidence to reason about likely bottlenecks.
    93	
    94	## 8. Don'ts
    95	
    96	- Do not focus on installation, packaging, Homebrew distribution, or release mechanics.
    97	- Do not confuse FSRS spaced repetition with simple TTL expiry, stale-after-N-days logic, or a one-shot archive rule.
    98	- Do not ignore the markdown storage format; git-friendly, human-readable persistence is part of the architecture, not just implementation detail.
    99	- Do not quote README claims as proven if the source code does not validate them.
   100	- Do not recommend replacing `Code_Environment/Public`'s semantic or hybrid retrieval with BM25 alone unless the evidence clearly supports that tradeoff.
   101	- Do not describe this repo as lacking all FSRS or decay logic when current code already contains an FSRS-based scheduler and classification-decay path.
   102	- Do not blur Modus's lightweight adjacency maps with existing causal-memory or code-graph capabilities; compare them precisely.
   103	- Do not edit anything under `external/` or outside this phase folder.
   104	
   105	## 9. Examples
   106	
   107	### Example A: FSRS reinforcement finding
   108	
   109	`internal/vault/facts.go` reinforces memories automatically when `memory_search` returns them, increasing stability, slightly lowering difficulty, updating `last_accessed`, and incrementing `access_count`. A strong finding would explain how that recall loop differs from Spec Kit Memory's current FSRS-aware decay layer, identify where automatic reinforcement could improve real-world memory freshness in `Code_Environment/Public`, and classify the idea as `adopt now`, `prototype later`, or `reject`.
   110	
   111	### Example B: Librarian expansion finding
   112	
   113	`internal/librarian/search.go` expands a natural-language query into 3-5 keyword-oriented variants, preserves the original query, caps the variant set, and falls back cleanly if parsing fails. A strong finding would explain how that lexical expansion could complement rather than replace current semantic retrieval in `Code_Environment/Public`, what guardrails are needed to prevent noisy recall, and whether the pattern should be adopted directly or only prototyped.
   114	
   115	## 10. Constraints
   116	
   117	### 10.1 Error handling
   118	
   119	- If a cited file is missing or diverges from README claims, say so plainly instead of guessing.
   120	- If the code and README disagree, prefer code evidence and mark the README statement as unverified or outdated.
   121	- If comparison assumptions about `Code_Environment/Public` prove false, correct them in the research rather than preserving stale framing.
   122	- If a performance claim cannot be reproduced from static analysis, label it as a claim to benchmark later, not an established fact.
   123	
   124	### 10.2 Scope
   125	
   126	**IN SCOPE**
   127	
   128	- BM25 scoring, tokenization, stemming, field boosting, prefix fallback, and cache behavior
   129	- librarian query expansion and result merging
   130	- FSRS decay, reinforcement, floors, stability, difficulty, retrievability, and recall triggers
   131	- subject, tag, and entity cross-referencing
   132	- markdown file structure, parser/writer behavior, and vault ergonomics
   133	- MCP tool handlers that expose search, memory, reinforcement, decay, and connected-doc surfaces
   134	- comparison against current Spec Kit Memory retrieval and decay capabilities
   135	
   136	**OUT OF SCOPE**
   137	
   138	- installer UX, packaging, licensing strategy, or release engineering
   139	- generic MCP primers unrelated to Modus's implementation choices
   140	- vector search or embedding architecture except when explicitly contrasting with phase `004`
   141	- markdown drift detection patterns primarily owned by phase `002`
   142	- broad memory-server taxonomy that does not produce implementation-level recommendations
   143	
   144	### 10.3 Prioritization framework
   145	
   146	Rank findings in this order: improvement to retrieval quality in `Code_Environment/Public`, complementarity with existing hybrid retrieval instead of duplication, operational simplicity of implementation, markdown-native maintainability, quality of evidence in source code, and clarity of differentiation from phases `001`, `002`, and `004`.
   147	
   148	## 11. Deliverables
   149	
   150	- `phase-research-prompt.md` present and tailored to `003-modus-memory-main`
   151	- `research/research.md` as the canonical report with at least 5 evidence-backed findings
   152	- explicit comparison to current Public retrieval, FSRS decay, and memory-linking behavior
   153	- clear classification of each recommendation as `adopt now`, `prototype later`, or `reject`
   154	- `implementation-summary.md` created at the end
   155	- memory saved from this phase folder using `generate-context.js`
   156	
   157	Minimum finding schema:
   158	
   159	- finding title
   160	- exact source evidence
   161	- what Modus Memory does
   162	- why it matters for `Code_Environment/Public`
   163	- recommendation: `adopt now`, `prototype later`, or `reject`
   164	- affected repo area
   165	- migration, compatibility, or validation risk
   166	
   167	## 12. Evaluation Criteria
   168	
   169	- CLEAR target: `>= 40/50`
   170	- RICCE compliance is visible in the prompt:
   171	  - **Role** is specialized in spaced repetition, BM25, cross-references, and local-first memory systems
   172	  - **Instructions** are ordered, concrete, and path-specific
   173	  - **Context** is domain-specific, cross-phase aware, and honest about current repo overlap
   174	  - **Constraints** limit scope and define evidence handling
   175	  - **Examples** show what strong Modus-derived findings look like
   176	- at least 5 findings are backed by code evidence rather than README-only assertions
   177	- findings distinguish overlap with current Spec Kit Memory from genuinely new value
   178	- overlap with `001` and `004` is explicitly addressed so recommendations are not duplicated or misplaced
   179	- markdown storage, BM25 ranking, FSRS reinforcement, and cross-reference mechanics are all covered directly
   180	
   181	## 13. Completion Bar
   182	
   183	The phase is only complete when all of the following are true:
   184	
   185	- the reading order started with ranking and search files, then FSRS, then cross-references, then MCP handlers, then README validation
   186	- current `Code_Environment/Public` FSRS and retrieval behavior was compared using code, not assumptions
   187	- the validation command passed on this exact phase folder
   188	- `research/research.md` contains at least 5 evidence-backed findings
   189	- each finding is tagged `adopt now`, `prototype later`, or `reject`
   190	- `checklist.md` is updated with evidence and completion marks
   191	- `implementation-summary.md` exists
   192	- memory is saved successfully for `003-modus-memory-main`
   193	- no edits were made outside the phase folder
   194	- cross-phase overlap with `001` and `004` is explicitly resolved
   195	
   196	OUTPUT FORMAT (MANDATORY - follow this exactly):
   197	# Iteration 001: ARCHITECTURE OVERVIEW
   198	
   199	## Focus
   200	ARCHITECTURE OVERVIEW: Scan repository structure, key directories, main entry points, README, and architecture docs. Map high-level components and data flow.
   201	
   202	## Findings
   203	For EACH finding:
   204	### Finding N: [Title]
   205	- **Source**: exact file path(s)
   206	- **What it does**: technical description with code evidence
   207	- **Why it matters for us**: concrete relevance
   208	- **Recommendation**: adopt now / prototype later / reject / NEW FEATURE
   209	- **Impact**: high / medium / low
   210	
   211	## Sources Consulted
   212	- [file paths examined]
   213	
   214	## Assessment
   215	- New information ratio: [0.0-1.0]
   216	- Questions addressed: [list]
   217	- Questions answered: [list]
   218	
   219	## Reflection
   220	- What worked: [approach that yielded results]
   221	- What did not work: [approach that failed]
   222	
   223	## Recommended Next Focus
   224	[What to investigate next]
   225	hook: SessionStart
   226	hook: SessionStart Completed
   227	hook: UserPromptSubmit
   228	hook: UserPromptSubmit Completed
   229	codex
   230	I’m treating this as a source-first research pass on the pre-approved `003-modus-memory-main` phase folder. I’ll verify the phase folder state, inspect the Modus code in the required order, compare it against our current memory stack, and then return the iteration report in the exact format you requested.
   231	exec
   232	/bin/zsh -lc 'rg -n "modus-memory|hybrid-rag-fusion|FSRS|BM25|librarian" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
   233	 succeeded in 0ms:
   234	456:## Task 2: Rename packet `023-esm-module-compliance` to `023-hybrid-rag-fusion-refinement` and sync changelog references, outcome success
   235	464:- 023-hybrid-rag-fusion-refinement, memory_index_scan, memory_quick_search, parentChain, B3-hybrid-rag-fusion-refinement, .opencode/changelog
   236	514:- symptom: bulk replacement corrupts values (`B3-hybrid-rag-fusion-refinement`); cause: over-broad regex/string substitution; fix: run post-rewrite `rg` anomaly sweep and apply targeted literal repairs for parentChain/headings/JSON snippets [Task 2]
   237	1113:scope: packet identity rewrites, slug/path sweeps, and follow-on phase packet creation in 022-hybrid-rag-fusion remediation work
   238	1114:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion; reuse_rule=reuse for this epic’s packet lifecycle work only, and verify current live folder names before edits
   239	1120:- rollout_summaries/2026-03-27T18-02-31-ZDov-update_020_pre_release_remediation_paths.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/020-pre-release-remediation, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/27/rollout-2026-03-27T19-02-31-019d3076-47f7-7fd3-8952-dda85e3bdb43.jsonl, updated_at=2026-03-27T18:14:00+00:00, thread_id=019d3076-47f7-7fd3-8952-dda85e3bdb43)
   240	1514:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion and linked docs; reuse_rule=reuse only within this spec family and re-check live numeric IDs each run
   241	1545:- 022-hybrid-rag-fusion, PHASE_LINKS, AI_PROTOCOL, 33 tools, .gemini/agents
   242	1762:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public; reuse_rule=reuse for Hydra work under `022-hybrid-rag-fusion/015-hydra-db-based-features`, but keep scope explicit when staging/committing
   243	2008:scope: read-only multi-agent review findings and documentation-drift checks for `023-hybrid-rag-fusion-refinement`
   244	2009:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public under .opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement; reuse_rule=reuse for forensic review of this packet family, but confirm current active slug/path before applying findings
   245	2019:- 023-hybrid-rag-fusion-refinement, ultra-think, severity ordering, file+line evidence, CHK-060 duplicate, [Criteria TBD]
   246	2023:- when user asked to “Let 3 ultra-think agents review all work done in .../023-hybrid-rag-fusion-refinement,” run multi-agent read-only review with severity-ranked findings and exact file+line evidence [Task 1]
   247	
   248	exec
   249	/bin/zsh -lc 'ls -la /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
   250	 succeeded in 0ms:
   251	total 40
   252	drwxr-xr-x   6 michelkerkmeester  staff    192 Apr 10 21:18 .
   253	drwxr-xr-x   7 michelkerkmeester  staff    224 Apr 10 21:07 ..
   254	drwxr-xr-x  12 michelkerkmeester  staff    384 Apr 10 21:19 external
   255	drwxr-xr-x   3 michelkerkmeester  staff     96 Apr 10 21:06 memory
   256	-rw-r--r--   1 michelkerkmeester  staff  17644 Apr 10 21:06 phase-research-prompt.md
   257	drwxr-xr-x   4 michelkerkmeester  staff    128 Apr 10 21:17 research
   258	
   259	exec
   260	/bin/zsh -lc 'bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main" --strict' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public

codex
The current shape is getting clearer: prior synthesis already converged on `memory_review` as the first adoption, but I’m re-checking the source so the roadmap doesn’t overfit an old summary. I’m now pulling the supporting pieces that affect sequencing, especially where Public already has the mechanics but not the operator surface, and where Modus adds a genuinely different retrieval primitive.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts | sed -n '280,340p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   280	    type: 'object',
   281	    additionalProperties: false,
   282	    'x-requiredAnyOf': [['id'], ['specFolder', 'confirm']],
   283	    properties: {
   284	      id: { type: 'number', minimum: 1, description: 'Memory ID to delete (single delete mode)' },
   285	      specFolder: { type: 'string', minLength: 1, description: 'Delete all memories in this spec folder (bulk delete mode, requires confirm: true)' },
   286	      confirm: { type: 'boolean', const: true, description: 'Safety gate. When provided, confirm must be true.' }
   287	    }
   288	  },
   289	};
   290	
   291	const memoryUpdate: ToolDefinition = {
   292	  name: 'memory_update',
   293	  description: '[L4:Mutation] Update an existing memory with corrections. Re-generates embedding if content changes. Token Budget: 500.',
   294	  inputSchema: { type: 'object', additionalProperties: false, properties: { id: { type: 'number', minimum: 1, description: 'Memory ID to update' }, title: { type: 'string', description: 'New title' }, triggerPhrases: { type: 'array', items: { type: 'string' }, description: 'Updated trigger phrases' }, importanceWeight: { type: 'number', minimum: 0, maximum: 1, description: 'New importance weight (0-1)' }, importanceTier: { type: 'string', enum: ['constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated'], description: 'Set importance tier. Constitutional tier memories always surface at top of results.' }, allowPartialUpdate: { type: 'boolean', default: false, description: 'Allow update to succeed even if embedding regeneration fails. When true, metadata changes are applied and the embedding is marked for re-index. When false (default), the entire update is rolled back on embedding failure.' } }, required: ['id'] },
   295	};
   296	
   297	const memoryValidate: ToolDefinition = {
   298	  name: 'memory_validate',
   299	  description: '[L4:Mutation] Record validation feedback for a memory. Tracks whether memories are useful, updating confidence scores. Memories with high confidence and validation counts may be promoted to critical tier. Token Budget: 500.',
   300	  inputSchema: {
   301	    type: 'object',
   302	    additionalProperties: false,
   303	    properties: {
   304	      id: { type: 'number', minimum: 1, description: 'Memory ID to validate' },
   305	      wasUseful: { type: 'boolean', description: 'Whether the memory was useful (true increases confidence, false decreases it)' },
   306	      queryId: { type: 'string', description: 'Optional query identifier to attach implicit feedback/ground-truth selection context' },
   307	      queryTerms: { type: 'array', items: { type: 'string' }, description: 'Optional normalized query terms used for learned feedback term extraction' },
   308	      resultRank: { type: 'number', minimum: 1, description: 'Optional rank position (1-based) of the selected memory in search results' },
   309	      totalResultsShown: { type: 'number', minimum: 1, description: 'Optional total number of results shown to the user' },
   310	      searchMode: { type: 'string', description: 'Optional search mode context (search/context/trigger)' },
   311	      intent: { type: 'string', description: 'Optional classified intent associated with the originating query' },
   312	      sessionId: { type: 'string', description: 'Optional session identifier for selection telemetry' },
   313	      notes: { type: 'string', description: 'Optional free-form notes associated with this validation event' },
   314	    },
   315	    required: ['id', 'wasUseful']
   316	  },
   317	};
   318	
   319	const memoryBulkDelete: ToolDefinition = {
   320	  name: 'memory_bulk_delete',
   321	  description: '[L4:Mutation] Bulk delete memories by importance tier. Use to clean up deprecated or temporary memories at scale. Auto-creates checkpoint before deletion for safety. Refuses unscoped deletion of constitutional/critical tiers. Supports optional checkpoint bypass for lower-risk tiers when speed is prioritized. Token Budget: 500.',
   322	  inputSchema: { type: 'object', additionalProperties: false, properties: { tier: { type: 'string', enum: ['constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated'], description: 'Importance tier to delete (required)' }, specFolder: { type: 'string', description: 'Optional: scope deletion to a specific spec folder' }, confirm: { type: 'boolean', const: true, description: 'Required safety gate: must be true to proceed' }, olderThanDays: { type: 'number', minimum: MEMORY_BULK_DELETE_MIN_OLDER_THAN_DAYS, description: 'Optional: only delete memories older than this many days' }, skipCheckpoint: { type: 'boolean', default: false, description: 'Optional speed optimization for non-critical tiers. When true, skips auto-checkpoint creation before delete. Rejected for constitutional/critical tiers.' } }, required: ['tier', 'confirm'] },
   323	};
   324	
   325	// L5: Lifecycle - Checkpoints and versioning (Token Budget: 600)
   326	const checkpointCreate: ToolDefinition = {
   327	  name: 'checkpoint_create',
   328	  description: '[L5:Lifecycle] Create a named checkpoint of current memory state for later restoration. Token Budget: 600.',
   329	  inputSchema: {
   330	    type: 'object',
   331	    additionalProperties: false,
   332	    properties: {
   333	      name: { type: 'string', minLength: 1, description: 'Unique checkpoint name' },
   334	      specFolder: { type: 'string', description: 'Limit to specific spec folder' },
   335	      tenantId: { type: 'string', minLength: 1, description: 'Tenant boundary for governed checkpoint scope.' },
   336	      userId: { type: 'string', minLength: 1, description: 'Scope to this user (optional, defense-in-depth)' },
   337	      agentId: { type: 'string', minLength: 1, description: 'Scope to this agent (optional, defense-in-depth)' },
   338	      sharedSpaceId: { type: 'string', minLength: 1, description: 'Scope to this shared space (requires tenantId).' },
   339	      metadata: { type: 'object', description: 'Additional metadata' }
   340	    },

 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Fsrs Scheduler
     3	// ───────────────────────────────────────────────────────────────
     4	// Feature catalog: Classification-based decay
     5	// CANONICAL FSRS CONSTANTS & ALGORITHM
     6	// Free Spaced Repetition Scheduler v4 algorithm implementation
     7	//
     8	// TWO-DOMAIN DECAY MODEL (Single Source of Truth)
     9	// Long-term memory (this file):
    10	// FSRS v4 power-law: R(t) = (1 + FSRS_FACTOR * t/S)^FSRS_DECAY
    11	// Timescale: days/weeks. Constants: FSRS_FACTOR=19/81, FSRS_DECAY=-0.5
    12	// All long-term decay consumers MUST import constants from this file.
    13	//
    14	// Working memory (working-memory.ts — separate system, intentionally decoupled):
    15	// Linear multiplicative: score * 0.95 per tick
    16	// Timescale: minutes. Operates on session-scoped attention scores only.
    17	//
    18	// DECAY STRATEGY (ADR-004): This is the CANONICAL long-term decay
    19	// Algorithm. All temporal decay for persistent memories should route
    20	// Through calculateRetrievability(). Formula: R(t) = (1 + 19/81 * t/S)^(-0.5)
    21	// Where t = elapsed days, S = stability (grows with successful reviews).
    22	//
    23	// Consumers: attention-decay.ts (facade), composite-scoring.ts (temporal
    24	// Factor), tier-classifier.ts (state classification),
    25	// Vector-index-impl.js (SQL search ranking).
    26	
    27	import { LEGACY_CONTEXT_TYPE_ALIASES } from '@spec-kit/shared/context-types';
    28	
    29	/* --- 1. CONSTANTS --- */
    30	
    31	/** FSRS v4 algorithm constants */
    32	const FSRS_FACTOR = 19 / 81;
    33	const FSRS_DECAY = -0.5;
    34	
    35	// Derived constant for half-life ↔ stability conversion.
    36	// From R(h) = 0.5: S = (FSRS_FACTOR / 3) * h = (19/243) * h
    37	const FSRS_HALF_LIFE_FACTOR = FSRS_FACTOR / 3; // 19/243 ≈ 0.07819
    38	
    39	/** Grade constants for review scoring */
    40	const GRADE_AGAIN = 1;
    41	const GRADE_HARD = 2;
    42	const GRADE_GOOD = 3;
    43	const GRADE_EASY = 4;
    44	
    45	/** Default initial parameters */
    46	const DEFAULT_INITIAL_STABILITY = 1.0;
    47	const DEFAULT_INITIAL_DIFFICULTY = 5.0;
    48	
    49	/** Difficulty bounds */
    50	const MIN_DIFFICULTY = 1.0;
    51	const MAX_DIFFICULTY = 10.0;
    52	
    53	/** Stability bounds */
    54	const MIN_STABILITY = 0.1;
    55	
    56	/* --- 2. INTERFACES --- */
    57	
    58	interface FsrsParams {
    59	  stability: number;
    60	  difficulty: number;
    61	  lastReview: string | null;
    62	  reviewCount: number;
    63	}
    64	
    65	interface ReviewResult {
    66	  stability: number;
    67	  difficulty: number;
    68	  lastReview: string;
    69	  reviewCount: number;
    70	  nextReviewDate: string;
    71	  retrievability: number;
    72	}
    73	
    74	/* --- 3. CORE FUNCTIONS --- */
    75	
    76	/**
    77	 * Calculate retrievability (probability of recall) using FSRS v4 formula.
    78	 * R(t) = (1 + FACTOR * t / S)^DECAY
    79	 */
    80	function calculateRetrievability(stability: number, elapsedDays: number): number {
    81	  if (stability <= 0 || elapsedDays < 0) {
    82	    return 0;
    83	  }
    84	
    85	  const retrievability = Math.pow(
    86	    1 + FSRS_FACTOR * (elapsedDays / stability),
    87	    FSRS_DECAY
    88	  );
    89	
    90	  return Math.max(0, Math.min(1, retrievability));
    91	}
    92	
    93	/**
    94	 * Update stability based on review grade.
    95	 * Uses simplified FSRS v4 update rules.
    96	 */
    97	function updateStability(
    98	  currentStability: number,
    99	  difficulty: number,
   100	  grade: number,
   101	  retrievability: number
   102	): number {
   103	  const safeStability = Math.max(0, currentStability);
   104	  const safeDifficulty = Math.max(MIN_DIFFICULTY, Math.min(MAX_DIFFICULTY, difficulty));
   105	
   106	  if (grade === GRADE_AGAIN) {
   107	    // Lapse: stability decreases significantly
   108	    return Math.max(MIN_STABILITY, safeStability * 0.2);
   109	  }
   110	
   111	  // Success: stability increases based on grade and difficulty
   112	  const difficultyFactor = 1 + (11 - safeDifficulty) * 0.1;
   113	  const gradeFactor = grade === GRADE_EASY ? 1.3 : grade === GRADE_GOOD ? 1.0 : 0.8;
   114	  const retrievabilityBonus = 1 + (1 - retrievability) * 0.5;
   115	
   116	  const newStability = safeStability * difficultyFactor * gradeFactor * retrievabilityBonus;
   117	
   118	  return Math.max(MIN_STABILITY, newStability);
   119	}
   120	
   121	/**
   122	 * Calculate optimal review interval from stability.
   123	 * The interval where retrievability = 0.9 (desired retention).
   124	 */
   125	function calculateOptimalInterval(stability: number, desiredRetention: number = 0.9): number {
   126	  const safeStability = Math.max(0, stability);
   127	
   128	  if (safeStability <= 0 || desiredRetention <= 0 || desiredRetention >= 1) {
   129	    return 0;
   130	  }
   131	
   132	  const interval = (safeStability / FSRS_FACTOR) * (Math.pow(desiredRetention, 1 / FSRS_DECAY) - 1);
   133	
   134	  return Math.max(0, Math.round(Math.max(0, interval)));
   135	}
   136	
   137	/**
   138	 * Update difficulty based on review grade.
   139	 */
   140	function updateDifficulty(currentDifficulty: number, grade: number): number {
   141	  const safeDifficulty = Math.max(MIN_DIFFICULTY, Math.min(MAX_DIFFICULTY, currentDifficulty));
   142	  let newDifficulty: number;
   143	
   144	  if (grade === GRADE_AGAIN) {
   145	    newDifficulty = safeDifficulty + 1.0;
   146	  } else if (grade === GRADE_HARD) {
   147	    newDifficulty = safeDifficulty + 0.5;
   148	  } else if (grade === GRADE_GOOD) {
   149	    newDifficulty = safeDifficulty;
   150	  } else {
   151	    // EASY
   152	    newDifficulty = safeDifficulty - 0.5;
   153	  }
   154	
   155	  return Math.max(MIN_DIFFICULTY, Math.min(MAX_DIFFICULTY, newDifficulty));
   156	}
   157	
   158	/**
   159	 * Calculate elapsed days since last review.
   160	 */
   161	function calculateElapsedDays(lastReview: string | null): number {
   162	  if (!lastReview) {
   163	    return 0;
   164	  }
   165	
   166	  const lastDate = new Date(lastReview);
   167	  if (isNaN(lastDate.getTime())) return 0;
   168	  const now = new Date();
   169	  const diffMs = now.getTime() - lastDate.getTime();
   170	
   171	  return Math.max(0, diffMs / (1000 * 60 * 60 * 24));
   172	}
   173	
   174	/**
   175	 * Get next review date based on stability and desired retention.
   176	 */
   177	function getNextReviewDate(stability: number, desiredRetention: number = 0.9): string {
   178	  const intervalDays = calculateOptimalInterval(stability, desiredRetention);
   179	  const nextDate = new Date();
   180	  nextDate.setDate(nextDate.getDate() + intervalDays);
   181	
   182	  return nextDate.toISOString();
   183	}
   184	
   185	/**
   186	 * Create initial FSRS parameters for a new memory.
   187	 */
   188	function createInitialParams(): FsrsParams {
   189	  return {
   190	    stability: DEFAULT_INITIAL_STABILITY,
   191	    difficulty: DEFAULT_INITIAL_DIFFICULTY,
   192	    lastReview: null,
   193	    reviewCount: 0,
   194	  };
   195	}
   196	
   197	/**
   198	 * Process a review and return updated parameters.
   199	 */
   200	function processReview(params: FsrsParams, grade: number): ReviewResult {
   201	  const elapsedDays = calculateElapsedDays(params.lastReview);
   202	  const retrievability = calculateRetrievability(params.stability, elapsedDays);
   203	
   204	  const newStability = updateStability(params.stability, params.difficulty, grade, retrievability);
   205	  const newDifficulty = updateDifficulty(params.difficulty, grade);
   206	  const now = new Date().toISOString();
   207	  const nextReviewDate = getNextReviewDate(newStability);
   208	
   209	  return {
   210	    stability: newStability,
   211	    difficulty: newDifficulty,
   212	    lastReview: now,
   213	    reviewCount: params.reviewCount + 1,
   214	    nextReviewDate,
   215	    retrievability,
   216	  };
   217	}
   218	
   219	/* --- 4. EXPORTS --- */
   220	
   221	/** Bundled constants object for test/external consumption */
   222	const FSRS_CONSTANTS = {
   223	  FSRS_FACTOR,
   224	  FSRS_DECAY,
   225	  FSRS_HALF_LIFE_FACTOR, // T301: derived constant (19/243)
   226	  GRADE_AGAIN,
   227	  GRADE_HARD,
   228	  GRADE_GOOD,
   229	  GRADE_EASY,
   230	  DEFAULT_STABILITY: DEFAULT_INITIAL_STABILITY,
   231	  DEFAULT_DIFFICULTY: DEFAULT_INITIAL_DIFFICULTY,
   232	  MIN_DIFFICULTY,
   233	  MAX_DIFFICULTY,
   234	  MIN_STABILITY,
   235	} as const;
   236	
   237	/**
   238	 * C138: Tier-based decay multipliers for long-term memory stability.
   239	 * Each tier modifies how quickly memories decay relative to the base FSRS schedule.
   240	 * constitutional = slowest decay (most persistent), scratch = fastest decay (ephemeral).
   241	 *
   242	 * NOTE (TM-03): This multiplier operates on elapsed-time in composite-scoring.ts
   243	 * (lower value = slower perceived time = slower decay). It is a SEPARATE system from
   244	 * IMPORTANCE_TIER_STABILITY_MULTIPLIER below, which operates on the FSRS stability
   245	 * parameter directly. Do NOT apply both to the same memory — use one or the other:
   246	 *   - TIER_MULTIPLIER → used by composite-scoring.ts (elapsed-time adjustment)
   247	 *   - IMPORTANCE_TIER_STABILITY_MULTIPLIER → used by getClassificationDecayMultiplier()
   248	 *     (stability adjustment, activated via SPECKIT_CLASSIFICATION_DECAY env var)
   249	 */
   250	const TIER_MULTIPLIER: Readonly<Record<string, number>> = {
   251	  constitutional: 0.1,
   252	  critical: 0.3,
   253	  important: 0.5,
   254	  normal: 1.0,
   255	  temporary: 2.0,
   256	  scratch: 3.0,
   257	} as const;
   258	
   259	/* --- 4a. CLASSIFICATION-BASED DECAY (TM-03) ---
   260	   Gated by SPECKIT_CLASSIFICATION_DECAY env var.
   261	   Multiplies FSRS stability so that:
   262	     - Infinity stability → R(t) = 1.0 always (no decay)
   263	     - >1.0 stability multiplier → slower decay
   264	     - <1.0 stability multiplier → faster decay */
   265	
   266	/**
   267	 * TM-03: Context-type stability multipliers.
   268	 * Applied to the FSRS stability parameter before computing retrievability.
   269	 * Infinity = no decay (retrievability always 1.0).
   270	 * 2.0 = stability doubled → slower decay.
   271	 * 1.0 = standard FSRS schedule.
   272	 */
   273	const CONTEXT_TYPE_STABILITY_MULTIPLIER: Record<string, number> = {
   274	  planning: Infinity,    // no decay — planning/decisions are permanent
   275	  research: 2.0,         // 2x stability — research context decays slower
   276	  implementation: 1.0,   // standard decay
   277	  general: 1.0,          // standard decay
   278	  // P1-3: Legacy aliases inherit their canonical type's multiplier
   279	  ...Object.fromEntries(
   280	    Object.entries(LEGACY_CONTEXT_TYPE_ALIASES).map(

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	package index
     2	
     3	import (
     4		"fmt"
     5		"sort"
     6		"strings"
     7	)
     8	
     9	// CrossRef is an in-memory cross-index that connects documents sharing subjects,
    10	// entities, or tags. Built at index time alongside BM25. No new storage — just
    11	// adjacency maps derived from existing frontmatter.
    12	//
    13	// This is Option A from the knowledge graph discussion: connected search results
    14	// without a full graph engine. A query for "Gemma 4" returns the fact, the Atlas
    15	// entity, the beliefs, the articles that mention it, and the learnings — one search.
    16	
    17	// DocRef is a lightweight reference to a connected document.
    18	type DocRef struct {
    19		Path    string
    20		Title   string
    21		Kind    string // "fact", "belief", "entity", "article", "learning", "mission", "role"
    22		Subject string
    23		Rank    float64 // connection strength (number of shared terms)
    24	}
    25	
    26	// crossIndex maps normalized subjects/entities to document references.
    27	type crossIndex struct {
    28		bySubject map[string][]DocRef // lowercase subject → connected docs
    29		byTag     map[string][]DocRef // tag → connected docs
    30		byEntity  map[string][]DocRef // entity name → connected docs
    31	}
    32	
    33	func newCrossIndex() *crossIndex {
    34		return &crossIndex{
    35			bySubject: make(map[string][]DocRef),
    36			byTag:     make(map[string][]DocRef),
    37			byEntity:  make(map[string][]DocRef),
    38		}
    39	}
    40	
    41	// build populates the cross-index from all indexed documents.
    42	func (ci *crossIndex) build(docs []document) {
    43		for _, doc := range docs {
    44			kind := inferDocKind(doc.Path, doc.Kind)
    45			ref := DocRef{
    46				Path:    doc.Path,
    47				Title:   doc.Title,
    48				Kind:    kind,
    49				Subject: doc.Subject,
    50			}
    51	
    52			// Index by subject
    53			if doc.Subject != "" {
    54				key := strings.ToLower(strings.TrimSpace(doc.Subject))
    55				ci.bySubject[key] = append(ci.bySubject[key], ref)
    56			}
    57	
    58			// Index by tags
    59			for _, tag := range strings.Fields(doc.Tags) {
    60				tag = strings.ToLower(strings.TrimSpace(tag))
    61				if tag != "" {
    62					ci.byTag[tag] = append(ci.byTag[tag], ref)
    63				}
    64			}
    65	
    66			// Index by entity mentions in title and subject
    67			// Entities are subjects of atlas docs, but also appear in other docs' text.
    68			// For now, cross-reference by exact subject match across all doc types.
    69			if kind == "entity" && doc.Title != "" {
    70				key := strings.ToLower(strings.TrimSpace(doc.Title))
    71				ci.byEntity[key] = append(ci.byEntity[key], ref)
    72			}
    73			if kind == "entity" && doc.Subject != "" {
    74				key := strings.ToLower(strings.TrimSpace(doc.Subject))
    75				ci.byEntity[key] = append(ci.byEntity[key], ref)
    76			}
    77	
    78			// Scan body for references to known entities (built in second pass)
    79		}
    80	
    81		// Second pass: scan all docs for mentions of entity names in title/body.
    82		// This connects articles to entities they discuss.
    83		entityNames := make(map[string]bool, len(ci.byEntity))
    84		for name := range ci.byEntity {
    85			if len(name) >= 3 { // skip tiny entity names
    86				entityNames[name] = true
    87			}
    88		}
    89	
    90		for _, doc := range docs {
    91			kind := inferDocKind(doc.Path, doc.Kind)
    92			if kind == "entity" {
    93				continue // entities already indexed
    94			}
    95	
    96			ref := DocRef{
    97				Path:    doc.Path,
    98				Title:   doc.Title,
    99				Kind:    kind,
   100				Subject: doc.Subject,
   101			}
   102	
   103			// Check if title or subject mentions a known entity
   104			titleLower := strings.ToLower(doc.Title)
   105			subjectLower := strings.ToLower(doc.Subject)
   106	
   107			for entityName := range entityNames {
   108				if strings.Contains(titleLower, entityName) || strings.Contains(subjectLower, entityName) {
   109					ci.byEntity[entityName] = append(ci.byEntity[entityName], ref)
   110				}
   111			}
   112		}
   113	}
   114	
   115	// ForSubject returns all documents connected to a subject (case-insensitive).
   116	func (ci *crossIndex) ForSubject(subject string, limit int) []DocRef {
   117		if limit <= 0 {
   118			limit = 20
   119		}
   120		key := strings.ToLower(strings.TrimSpace(subject))
   121		refs := ci.bySubject[key]
   122		if len(refs) > limit {
   123			refs = refs[:limit]
   124		}
   125		return refs
   126	}
   127	
   128	// ForTag returns all documents sharing a tag.
   129	func (ci *crossIndex) ForTag(tag string, limit int) []DocRef {
   130		if limit <= 0 {
   131			limit = 20
   132		}
   133		key := strings.ToLower(strings.TrimSpace(tag))
   134		refs := ci.byTag[key]
   135		if len(refs) > limit {
   136			refs = refs[:limit]
   137		}
   138		return refs
   139	}
   140	
   141	// ForEntity returns all documents connected to an entity.
   142	func (ci *crossIndex) ForEntity(entity string, limit int) []DocRef {
   143		if limit <= 0 {
   144			limit = 20
   145		}
   146		key := strings.ToLower(strings.TrimSpace(entity))
   147		refs := ci.byEntity[key]
   148		if len(refs) > limit {
   149			refs = refs[:limit]
   150		}
   151		return refs
   152	}
   153	
   154	// Connected returns the full neighborhood of a query — union of subject, tag,
   155	// and entity matches, deduplicated by path, sorted by connection count.
   156	func (ci *crossIndex) Connected(query string, limit int) []DocRef {
   157		if limit <= 0 {
   158			limit = 20
   159		}
   160	
   161		terms := strings.Fields(strings.ToLower(query))
   162		if len(terms) == 0 {
   163			return nil
   164		}
   165	
   166		// Score each document by how many query terms connect to it
   167		scores := make(map[string]*DocRef)  // path → ref
   168		counts := make(map[string]float64)  // path → connection strength
   169	
   170		addRefs := func(refs []DocRef, weight float64) {
   171			for _, r := range refs {
   172				counts[r.Path] += weight
   173				if _, ok := scores[r.Path]; !ok {
   174					copy := r
   175					scores[r.Path] = &copy
   176				}
   177			}
   178		}
   179	
   180		for _, term := range terms {
   181			addRefs(ci.bySubject[term], 3.0) // subject match is strongest
   182			addRefs(ci.byEntity[term], 2.0)  // entity match is strong
   183			addRefs(ci.byTag[term], 1.0)     // tag match is weaker
   184		}
   185	
   186		// Also try the full query as a single key
   187		fullQuery := strings.Join(terms, " ")
   188		addRefs(ci.bySubject[fullQuery], 3.0)
   189		addRefs(ci.byEntity[fullQuery], 2.0)
   190	
   191		// Sort by connection strength
   192		type ranked struct {
   193			ref   *DocRef
   194			score float64
   195		}
   196		var results []ranked
   197		for path, ref := range scores {
   198			ref.Rank = counts[path]
   199			results = append(results, ranked{ref, counts[path]})
   200		}
   201		sort.Slice(results, func(i, j int) bool {
   202			return results[i].score > results[j].score
   203		})
   204	
   205		if len(results) > limit {
   206			results = results[:limit]
   207		}
   208	
   209		out := make([]DocRef, len(results))
   210		for i, r := range results {
   211			out[i] = *r.ref
   212		}
   213		return out
   214	}
   215	
   216	// Stats returns cross-index statistics.
   217	func (ci *crossIndex) Stats() (subjects, tags, entities int) {
   218		return len(ci.bySubject), len(ci.byTag), len(ci.byEntity)
   219	}
   220	
   221	// inferDocKind determines the document type from its vault path and metadata.
   222	func inferDocKind(path, metaKind string) string {
   223		if metaKind != "" {
   224			return metaKind
   225		}
   226		switch {
   227		case strings.HasPrefix(path, "memory/facts/"):
   228			return "fact"
   229		case strings.HasPrefix(path, "atlas/beliefs/"):
   230			return "belief"
   231		case strings.HasPrefix(path, "atlas/entities/") || strings.HasPrefix(path, "atlas/"):
   232			return "entity"
   233		case strings.HasPrefix(path, "brain/learnings/"):
   234			return "learning"
   235		case strings.HasPrefix(path, "brain/"):
   236			return "article"
   237		case strings.HasPrefix(path, "missions/"):
   238			return "mission"
   239		case strings.HasPrefix(path, "roles/"):
   240			return "role"

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	package librarian
     2	
     3	import (
     4		"encoding/json"
     5		"fmt"
     6		"log"
     7		"strings"
     8	)
     9	
    10	// ExpandQuery asks the librarian to produce search-optimized terms for a query.
    11	// This replaces the embedding channel — instead of computing vector similarity,
    12	// we ask Gemma to bridge the semantic gap at query time.
    13	//
    14	// Example: "what's our fastest model" → "speed tok/s benchmark performance Gemma GLM"
    15	func ExpandQuery(query string) []string {
    16		system := `You are a search query expander for a developer's personal knowledge base.
    17	Given a natural language query, produce 3-5 alternative search phrases that would match
    18	relevant documents using keyword search (FTS5). Include:
    19	- Synonyms and related terms
    20	- Technical equivalents
    21	- Specific names/tools the user likely means
    22	- Both formal and informal phrasings
    23	
    24	Return ONLY a JSON array of strings. No explanation.
    25	Example: ["original query terms", "synonym phrase", "technical equivalent", "specific tool names"]`
    26	
    27		user := fmt.Sprintf("Expand this query for keyword search: %q", query)
    28	
    29		response := Call(system, user, 150)
    30		if response == "" {
    31			return []string{query}
    32		}
    33	
    34		var expansions []string
    35		if err := ParseJSON(response, &expansions); err != nil {
    36			log.Printf("librarian/search: expansion parse failed: %v", err)
    37			return []string{query}
    38		}
    39	
    40		// Always include the original query
    41		result := []string{query}
    42		for _, exp := range expansions {
    43			exp = strings.TrimSpace(exp)
    44			if exp != "" && exp != query {
    45				result = append(result, exp)
    46			}
    47		}
    48	
    49		if len(result) > 6 {
    50			result = result[:6]
    51		}
    52		return result
    53	}
    54	
    55	// RankResults asks the librarian to score and rank search results by relevance.
    56	// Takes the original query and a set of result snippets, returns ranked indices.
    57	func RankResults(query string, results []ResultSnippet, topN int) []int {
    58		if len(results) == 0 {
    59			return nil
    60		}
    61		if len(results) <= topN {
    62			indices := make([]int, len(results))
    63			for i := range indices {
    64				indices[i] = i
    65			}
    66			return indices
    67		}
    68	
    69		var sb strings.Builder
    70		for i, r := range results {
    71			sb.WriteString(fmt.Sprintf("%d. [%s] %s\n   %s\n\n",
    72				i+1, r.Source, r.Title, truncate(r.Snippet, 200)))
    73		}
    74	
    75		system := `You rank search results for relevance. Given a query and numbered results,
    76	return a JSON array of the most relevant result numbers (1-indexed), ordered by relevance.
    77	Return ONLY the JSON array of integers. No explanation.`
    78	
    79		user := fmt.Sprintf("Query: %q\nReturn the top %d most relevant results:\n\n%s",
    80			query, topN, sb.String())
    81	
    82		response := Call(system, user, 100)
    83		if response == "" {
    84			return defaultIndices(topN, len(results))
    85		}
    86	
    87		var ranked []int
    88		if err := ParseJSON(response, &ranked); err != nil {
    89			log.Printf("librarian/search: rank parse failed: %v", err)
    90			return defaultIndices(topN, len(results))
    91		}
    92	
    93		// Convert 1-indexed to 0-indexed, validate
    94		var valid []int
    95		seen := map[int]bool{}
    96		for _, r := range ranked {
    97			idx := r - 1
    98			if idx >= 0 && idx < len(results) && !seen[idx] {
    99				valid = append(valid, idx)
   100				seen[idx] = true
   101			}
   102			if len(valid) >= topN {
   103				break
   104			}
   105		}
   106		return valid
   107	}
   108	
   109	// ResultSnippet is a lightweight search result for ranking.
   110	type ResultSnippet struct {
   111		Source  string
   112		Title   string
   113		Snippet string
   114	}
   115	
   116	// SummarizeForCloud condenses search results into a token-efficient summary
   117	// for cloud models. Instead of dumping raw results, the librarian produces
   118	// a curated briefing.
   119	func SummarizeForCloud(query string, results []ResultSnippet) string {
   120		if len(results) == 0 {
   121			return "No results found."
   122		}
   123	
   124		var sb strings.Builder
   125		for i, r := range results {
   126			sb.WriteString(fmt.Sprintf("%d. [%s] %s: %s\n",
   127				i+1, r.Source, r.Title, truncate(r.Snippet, 300)))
   128		}
   129	
   130		system := `You are a librarian summarizing search results for an AI assistant.
   131	Produce a concise, information-dense summary that answers the query directly.
   132	Include specific facts, numbers, and references. Cite result numbers in brackets.
   133	Keep under 300 words. Do not add opinions or speculation.`
   134	
   135		user := fmt.Sprintf("Query: %q\n\nResults:\n%s\n\nSummarize the key findings.",
   136			query, sb.String())
   137	
   138		return Call(system, user, 400)
   139	}
   140	
   141	// ExtractFacts asks the librarian to extract structured facts from text.
   142	func ExtractFacts(text string) []ExtractedFact {
   143		system := `Extract factual claims from the text as structured data.
   144	Return a JSON array: [{"subject": "X", "predicate": "Y", "value": "Z"}]
   145	Only extract concrete, verifiable facts. No opinions or speculation.
   146	Keep subjects and predicates consistent and reusable.`
   147	
   148		user := fmt.Sprintf("Extract facts from:\n\n%s", truncate(text, 2000))
   149	
   150		response := Call(system, user, 500)
   151		if response == "" {
   152			return nil
   153		}
   154	
   155		var facts []ExtractedFact
   156		if err := ParseJSON(response, &facts); err != nil {
   157			log.Printf("librarian/search: fact parse failed: %v", err)
   158			return nil
   159		}
   160		return facts
   161	}
   162	
   163	// ExtractedFact is a subject/predicate/value triple.
   164	type ExtractedFact struct {
   165		Subject   string `json:"subject"`
   166		Predicate string `json:"predicate"`
   167		Value     string `json:"value"`
   168	}
   169	
   170	func defaultIndices(n, max int) []int {
   171		if n > max {
   172			n = max
   173		}
   174		indices := make([]int, n)
   175		for i := range indices {
   176			indices[i] = i
   177		}
   178		return indices
   179	}
   180	
   181	// ClassifyIntent asks the librarian to classify a query for routing.
   182	// Returns one of the 8 query classes used by the agentic search system.
   183	func ClassifyIntent(query string) string {
   184		system := `Classify the user's query intent. Return ONLY one of these exact labels:
   185	- exact_lookup: asking for a specific fact (what is X, how many, which)
   186	- entity_topic: asking about a specific entity or topic
   187	- temporal: asking about time, history, changes, sequence
   188	- multi_hop: asking about relationships, chains, why/how connections
   189	- abstraction: asking for overview, comparison, big picture
   190	- preference: asking about preferences, beliefs, philosophy
   191	- update_check: checking current status or progress
   192	- no_retrieval: greeting, command, or not a knowledge query
   193	
   194	Return ONLY the label, nothing else.`
   195	
   196		response := Call(system, query, 20)
   197		response = strings.TrimSpace(strings.ToLower(response))
   198	
   199		valid := map[string]bool{
   200			"exact_lookup": true, "entity_topic": true, "temporal": true,
   201			"multi_hop": true, "abstraction": true, "preference": true,
   202			"update_check": true, "no_retrieval": true,
   203		}
   204		if valid[response] {
   205			return response
   206		}
   207		return "entity_topic"
   208	}
   209	
   210	// Briefing produces an end-of-cycle intelligence brief.
   211	type Briefing struct {
   212		New          []string `json:"new"`
   213		MissionRelevant []string `json:"mission_relevant"`
   214		Contradictions  []string `json:"contradictions"`
   215		NeedsReview     []string `json:"needs_review"`
   216		CanWait         []string `json:"can_wait"`
   217	}
   218	
   219	// ProduceBriefing generates a structured intelligence brief from ingested items.
   220	func ProduceBriefing(items []string, activeMissions []string) *Briefing {
   221		if len(items) == 0 {
   222			return &Briefing{}
   223		}
   224	
   225		var sb strings.Builder
   226		for i, item := range items {
   227			sb.WriteString(fmt.Sprintf("%d. %s\n", i+1, item))
   228		}
   229	
   230		missions := "None specified"
   231		if len(activeMissions) > 0 {
   232			missions = strings.Join(activeMissions, ", ")
   233		}
   234	
   235		system := `You produce intelligence briefings. Given a list of newly ingested items and active missions, answer exactly 5 questions as a JSON object:
   236	{
   237	  "new": ["what is new — key items ingested"],
   238	  "mission_relevant": ["what matters to active missions"],
   239	  "contradictions": ["what contradicts existing beliefs"],
   240	  "needs_review": ["what deserves immediate review"],

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/doctor.go | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	package main
     2	
     3	import (
     4		"fmt"
     5		"os"
     6		"sort"
     7		"strings"
     8	
     9		"github.com/GetModus/modus-memory/internal/index"
    10		"github.com/GetModus/modus-memory/internal/markdown"
    11	)
    12	
    13	// runDoctor performs a diagnostic scan of the vault and reports problems.
    14	// Designed for post-import validation — especially useful after Khoj migration.
    15	func runDoctor(vaultDir string) {
    16		fmt.Printf("modus-memory doctor %s\n", version)
    17		fmt.Printf("Vault: %s\n\n", vaultDir)
    18	
    19		// Build index to get stats
    20		idx, err := index.Build(vaultDir, "")
    21		if err != nil {
    22			fmt.Printf("FAIL: cannot build index: %v\n", err)
    23			os.Exit(1)
    24		}
    25	
    26		totalFacts, activeFacts := idx.FactCount()
    27		subjects, tags, entities := idx.CrossRefStats()
    28	
    29		fmt.Printf("Documents: %d\n", idx.DocCount())
    30		fmt.Printf("Facts: %d total, %d active, %d archived\n", totalFacts, activeFacts, totalFacts-activeFacts)
    31		fmt.Printf("Cross-refs: %d subjects, %d tags, %d entities\n\n", subjects, tags, entities)
    32	
    33		// Scan all markdown files for diagnostics
    34		docs, err := markdown.ScanDir(vaultDir)
    35		if err != nil {
    36			fmt.Printf("FAIL: cannot scan vault: %v\n", err)
    37			os.Exit(1)
    38		}
    39	
    40		var findings []finding
    41	
    42		// Check 1: Facts missing required fields
    43		missingSubject := 0
    44		missingPredicate := 0
    45		for _, doc := range docs {
    46			if !strings.Contains(doc.Path, "memory/facts") {
    47				continue
    48			}
    49			if doc.Get("subject") == "" {
    50				missingSubject++
    51			}
    52			if doc.Get("predicate") == "" {
    53				missingPredicate++
    54			}
    55		}
    56		if missingSubject > 0 {
    57			findings = append(findings, finding{"WARN", fmt.Sprintf("%d facts missing 'subject' field", missingSubject)})
    58		}
    59		if missingPredicate > 0 {
    60			findings = append(findings, finding{"WARN", fmt.Sprintf("%d facts missing 'predicate' field", missingPredicate)})
    61		}
    62	
    63		// Check 2: Duplicate subjects (same subject + predicate)
    64		type factKey struct{ subject, predicate string }
    65		factCounts := make(map[factKey]int)
    66		for _, doc := range docs {
    67			if !strings.Contains(doc.Path, "memory/facts") {
    68				continue
    69			}
    70			s := doc.Get("subject")
    71			p := doc.Get("predicate")
    72			if s != "" && p != "" {
    73				factCounts[factKey{s, p}]++
    74			}
    75		}
    76		dupes := 0
    77		for _, count := range factCounts {
    78			if count > 1 {
    79				dupes++
    80			}
    81		}
    82		if dupes > 0 {
    83			findings = append(findings, finding{"WARN", fmt.Sprintf("%d duplicate subject+predicate pairs", dupes)})
    84		}
    85	
    86		// Check 3: Empty documents (frontmatter but no body)
    87		emptyDocs := 0
    88		for _, doc := range docs {
    89			if strings.TrimSpace(doc.Body) == "" {
    90				emptyDocs++
    91			}
    92		}
    93		if emptyDocs > 0 {
    94			findings = append(findings, finding{"INFO", fmt.Sprintf("%d documents with empty body", emptyDocs)})
    95		}
    96	
    97		// Check 4: Documents without frontmatter
    98		noFrontmatter := 0
    99		for _, doc := range docs {
   100			if len(doc.Frontmatter) == 0 {
   101				noFrontmatter++
   102			}
   103		}
   104		if noFrontmatter > 0 {
   105			findings = append(findings, finding{"INFO", fmt.Sprintf("%d documents without frontmatter", noFrontmatter)})
   106		}
   107	
   108		// Check 5: Contradictions — same subject, same predicate, different values
   109		type factEntry struct {
   110			value string
   111			path  string
   112		}
   113		factValues := make(map[factKey][]factEntry)
   114		for _, doc := range docs {
   115			if !strings.Contains(doc.Path, "memory/facts") {
   116				continue
   117			}
   118			s := doc.Get("subject")
   119			p := doc.Get("predicate")
   120			if s == "" || p == "" {
   121				continue
   122			}
   123			v := strings.TrimSpace(doc.Body)
   124			if v == "" {
   125				v = doc.Get("value")
   126			}
   127			if len(v) > 100 {
   128				v = v[:100]
   129			}
   130			key := factKey{strings.ToLower(s), strings.ToLower(p)}
   131			rel := doc.Path
   132			if idx := strings.Index(rel, "memory/facts"); idx >= 0 {
   133				rel = rel[idx:]
   134			}
   135			factValues[key] = append(factValues[key], factEntry{v, rel})
   136		}
   137		contradictions := 0
   138		var contradictionDetails []string
   139		for key, entries := range factValues {
   140			if len(entries) < 2 {
   141				continue
   142			}
   143			// Check if values actually differ
   144			seen := make(map[string]bool)
   145			for _, e := range entries {
   146				seen[e.value] = true
   147			}
   148			if len(seen) > 1 {
   149				contradictions++
   150				if len(contradictionDetails) < 5 {
   151					contradictionDetails = append(contradictionDetails,
   152						fmt.Sprintf("  %s / %s (%d conflicting values)", key.subject, key.predicate, len(seen)))
   153				}
   154			}
   155		}
   156		if contradictions > 0 {
   157			findings = append(findings, finding{"WARN", fmt.Sprintf("%d potential contradictions (same subject+predicate, different values)", contradictions)})
   158		}
   159	
   160		// Check 6: Vault structure — expected directories
   161		expectedDirs := []string{"memory/facts", "brain", "atlas"}
   162		for _, dir := range expectedDirs {
   163			full := fmt.Sprintf("%s/%s", vaultDir, dir)
   164			if _, err := os.Stat(full); os.IsNotExist(err) {
   165				findings = append(findings, finding{"INFO", fmt.Sprintf("directory %s/ does not exist (optional)", dir)})
   166			}
   167		}
   168	
   169		// Check 7: Document distribution by directory
   170		dirCounts := make(map[string]int)
   171		for _, doc := range docs {
   172			parts := strings.SplitN(doc.Path, string(os.PathSeparator), 3)
   173			if len(parts) >= 2 {
   174				// Get top-level dir relative to vault
   175				rel := doc.Path
   176				if idx := strings.LastIndex(rel, vaultDir); idx >= 0 {
   177					rel = rel[idx+len(vaultDir)+1:]
   178				}
   179				topParts := strings.SplitN(rel, string(os.PathSeparator), 3)
   180				if len(topParts) >= 1 {
   181					dirCounts[topParts[0]]++
   182				}
   183			}
   184		}
   185	
   186		// Print findings
   187		fmt.Println("─── Diagnostics ───")
   188		if len(findings) == 0 {
   189			fmt.Println("No issues found.")
   190		} else {
   191			sort.Slice(findings, func(i, j int) bool {
   192				return severityRank(findings[i].level) > severityRank(findings[j].level)
   193			})
   194			for _, f := range findings {
   195				fmt.Printf("[%s] %s\n", f.level, f.message)
   196			}
   197		}
   198	
   199		if len(contradictionDetails) > 0 {
   200			fmt.Println("\n─── Contradictions (first 5) ───")
   201			for _, d := range contradictionDetails {
   202				fmt.Println(d)
   203			}
   204			if contradictions > 5 {
   205				fmt.Printf("  ... and %d more\n", contradictions-5)
   206			}
   207		}
   208	
   209		// Print distribution
   210		if len(dirCounts) > 0 {
   211			fmt.Println("\n─── Distribution ───")
   212			type dirStat struct {
   213				name  string
   214				count int
   215			}
   216			var stats []dirStat
   217			for name, count := range dirCounts {
   218				stats = append(stats, dirStat{name, count})
   219			}
   220			sort.Slice(stats, func(i, j int) bool { return stats[i].count > stats[j].count })

exec
/bin/zsh -lc 'rg -n "memory_health|memory_stats|session_bootstrap|debug|trace|profile|route" .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/mcp_server/lib .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:43:  description: '[L1:Orchestration] Unified entry point for context retrieval with intent-aware routing. START HERE for most memory operations. For session recovery, use mode: \'resume\' with profile: \'resume\'. Automatically detects task intent (add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision) and routes to optimal retrieval strategy. Modes: auto (default), quick (trigger-based), deep (comprehensive), focused (intent-optimized), resume (session recovery). Token Budget: 3500. For code search by concept/intent, prefer mcp__cocoindex_code__search (CocoIndex). For structural code queries (callers, imports), prefer code_graph_query.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:44:  inputSchema: { type: 'object', additionalProperties: false, properties: { input: { type: 'string', minLength: 1, description: 'The query, prompt, or context description (required)' }, mode: { type: 'string', enum: ['auto', 'quick', 'deep', 'focused', 'resume'], default: 'auto', description: 'Context retrieval mode: auto (detect intent), quick (fast triggers), deep (comprehensive search), focused (intent-optimized), resume (session recovery)' }, intent: { type: 'string', enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'], description: 'Explicit task intent. If not provided and mode=auto, intent is auto-detected from input.' }, specFolder: { type: 'string', description: 'Limit context to specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval when memory_context routes to memory_search.' }, userId: { type: 'string', description: 'User boundary for governed retrieval when memory_context routes to memory_search.' }, agentId: { type: 'string', description: 'Agent boundary for governed retrieval when memory_context routes to memory_search.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed retrieval when memory_context routes to memory_search.' }, limit: { type: 'number', minimum: 1, maximum: 100, description: 'Maximum results (mode-specific defaults apply)' }, sessionId: { type: 'string', description: 'Optional server-issued session identifier for working-memory continuity. When provided, it must match an existing server-managed session or the call is rejected. Omit it to let the server generate a new session for this request.' }, enableDedup: { type: 'boolean', default: true, description: 'Enable session deduplication' }, includeContent: { type: 'boolean', default: false, description: 'Include full file content in results' }, includeTrace: { type: 'boolean', default: false, description: 'Include provenance-rich trace data (scores, source, trace) in results when underlying memory_search is called' }, tokenUsage: { type: 'number', minimum: 0.0, maximum: 1.0, description: "Optional caller token usage ratio (0.0-1.0)" }, anchors: { type: 'array', items: { type: 'string' }, description: 'Filter content to specific anchors (e.g., ["state", "next-steps"] for resume mode)' }, profile: { type: 'string', enum: ['quick', 'research', 'resume', 'debug'], description: 'Optional response profile formatter. Returns a reduced or mode-aware response shape when profile formatting is enabled.' } }, required: ['input'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:111:      profile: {
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:113:        enum: ['quick', 'research', 'resume', 'debug'],
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:114:        description: 'Optional response profile formatter. Returns a reduced or mode-aware response shape when profile formatting is enabled.'
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:184:        description: 'When true (or when SPECKIT_RESPONSE_TRACE=true), include provenance-rich scores/source/trace envelope fields in each result.'
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:231:  name: 'memory_stats',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:237:  name: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:268:        description: 'Required with autoRepair:true to execute repair actions. When false or omitted, memory_health returns a confirmation-only response.'
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:487:  inputSchema: { type: 'object', additionalProperties: false, properties: { memoryId: { type: 'string', description: 'Memory ID to trace causal lineage for (number or string, required)' }, maxDepth: { type: 'number', default: 3, minimum: 1, maximum: 10, description: 'Maximum traversal depth (default: 3, max: 10)' }, direction: { type: 'string', description: 'Traversal direction: outgoing, incoming, or both (default: both)' }, relations: { type: 'array', items: { type: 'string' }, description: 'Filter to specific relationship types: caused, enabled, supersedes, contradicts, derived_from, supports' }, includeMemoryDetails: { type: 'boolean', default: true, description: 'Include full memory details in results' } }, required: ['memoryId'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:691:      profile: { type: 'string', enum: ['quick', 'research', 'debug'], description: 'Output density profile' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:692:      includeTrace: { type: 'boolean', description: 'Include trace metadata in response for debugging' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:741:  description: '[L1:Orchestration] Resume session with combined memory, code graph, and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. For the canonical first-call recovery path on session start or after /clear, prefer session_bootstrap. Use minimal: true to skip the heavy memory context call and return code graph, CocoIndex, structural context, hints, and session-quality metadata without the full memory payload.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:755:  name: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:858:  description: '[L9:CoverageGraph] Composite convergence assessment for deep-loop coverage graph. Returns a typed decision (CONTINUE, STOP_ALLOWED, STOP_BLOCKED), signal values, blockers with severity levels, and a typed trace explaining each signal threshold evaluation. For research: evaluates questionCoverage, claimVerificationRate, contradictionDensity, plus blocking guards sourceDiversity and evidenceDepth. For review: evaluates dimensionCoverage, findingStability, p0ResolutionRate, evidenceDensity, hotspotSaturation. Extends Phase 001 stop logic without replacing newInfoRatio.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:41:/** Arguments for the memory_stats handler. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:50:/** Arguments for the memory_health handler. */
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:199:| Get session stats | `getSessionStats(sessionId)` | For debugging/logging |
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:43:  sourceSurface: 'auto-prime' | 'session_bootstrap' | 'session_resume' | 'session_health';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:257:    recommendedAction = 'Call session_bootstrap first. Then run code_graph_scan if structural context is needed.';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:13:// Feature catalog: System statistics (memory_stats)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:14:// Feature catalog: Health diagnostics (memory_health)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:35:const handle_memory_stats = handleMemoryStats;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:36:const handle_memory_health = handleMemoryHealth;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:44:  handle_memory_stats,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:45:  handle_memory_health,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:418:        profile: 'resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:474:    hints.push(`Structural context is ${structuralContext.status}. Call session_bootstrap to refresh.`);
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:266:export const handle_memory_stats = lazyFunction(getMemoryCrudModule, 'handle_memory_stats');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:267:export const handle_memory_health = lazyFunction(getMemoryCrudModule, 'handle_memory_health');
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:130:/** Log hook execution time for monitoring and debugging */
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:144:  // Log to console for debugging
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:55:    preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:116:    nextActions.add('Run `code_graph_scan` if you need fresh structural context, then call `session_bootstrap()` again.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:118:    nextActions.add('If structural context matters for this task, run `code_graph_scan` and then re-run `session_bootstrap()`.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:123:    nextActions.add('Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` if you need a deeper state refresh.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:155:    preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:163:/** Handle session_bootstrap tool call — one-call session setup */
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:195:  const structuralContext = buildStructuralBootstrapContract('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:198:      `Structural context is ${structuralContext.status}. Run code_graph_scan if needed, then re-run session_bootstrap.`
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:230:      'session_bootstrap expected session_resume to emit structural-context.structuralTrust.',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:236:    { label: 'session_bootstrap structural context payload' },
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:243:      { label: 'session_bootstrap resume payload' },
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:306:      producer: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:307:      sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:320:    sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/README.md:38:| `trigger-matcher.ts` | Fast cached trigger matching with Unicode normalization, stats, and debug hooks |
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:121:  'debug': 'implementation',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:89:  profile?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:127:  /** REQ-D5-003: Presentation profile ('quick'|'research'|'resume'|'debug'). Default: full response. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:128:  profile?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:170:  tracedResult: ContextResult;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:203:  preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:325:    preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:645:    description: 'Automatically detect intent and route to optimal strategy',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:737:    profile: options.profile,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:768:    profile: options.profile,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:802:    profile: options.profile,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:999:    tracedResult,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1046:    strategy: tracedResult.strategy,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1078:/** Handle memory_context tool — L1 orchestration layer that routes to optimal retrieval strategy.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1136:    routedBackend: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1147:        routedBackend: classification.intent === 'structural' && classification.confidence > 0.65
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1291:    profile: args.profile,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1318:  // Phase C: Intent-to-profile auto-routing for memory_context.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1319:  // Explicit caller `profile` always takes precedence; auto-detect fills in when absent.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1320:  // Skip for 'quick' mode: quick routes through handleMemoryMatchTriggers which does not
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1321:  // support profile formatting — setting a profile there would be a no-op.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1322:  if (!options.profile && detectedIntent && effectiveMode !== 'quick' && isIntentAutoProfileEnabled()) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1328:        options.profile = autoProfile;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1329:        console.error(`[memory-context] Intent-to-profile auto-routing: '${detectedIntent}' → profile '${autoProfile}'`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1332:      // Auto-profile is best-effort — never breaks context retrieval
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1427:  const tracedResult0: ContextResult = effectiveMode === 'quick' && options.includeTrace === true
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1438:      (tracedResult0 as Record<string, unknown>).systemPromptContext = resumeContextItems.map((item) => ({
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1444:      (tracedResult0 as Record<string, unknown>).systemPromptContextInjected = true;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1449:  const { result: budgetedResult, enforcement } = enforceTokenBudget(tracedResult0, effectiveBudget);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1450:  const tracedResult = budgetedResult;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1453:  const responseData: ContextResult & Record<string, unknown> = { ...tracedResult };
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1473:      ? `Context retrieved via ${effectiveMode} mode (${tracedResult.strategy} strategy) [truncated${enforcement.originalResultCount !== undefined ? `: ${enforcement.originalResultCount} → ${enforcement.returnedResultCount} results` : ''} to fit ${effectiveBudget} token budget]`
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1474:      : `Context retrieved via ${effectiveMode} mode (${tracedResult.strategy} strategy)`,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1486:      tracedResult,
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:63:| **Query Routing** | Complexity classifier routes simple/moderate/complex queries to optimal pipelines |
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:146:│   ├── query-router.ts         # Query routing based on complexity
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:266:│   └── README.md               # Points to ../shared/contracts/retrieval-trace.ts
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:272:│   ├── trace-schema.ts         # Trace payload sanitization and guards
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:49:    useCase: 'Default entry point for context retrieval. Automatically routes based on intent.',
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:50:    tools: ['memory_context', 'session_resume', 'session_bootstrap']
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:68:    tools: ['memory_list', 'memory_stats', 'memory_health', 'session_health']
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:338:/** Handle memory_drift_why tool - traces causal relationships for a given memory */
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:646:        `Use memory_drift_why({ memoryId: "${targetId}" }) to trace this relationship`,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:123:    hints.push('Structural context is stale. Call session_bootstrap to refresh, or run code_graph_scan for a full rescan.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:125:    hints.push('No structural context available. Call session_bootstrap first, then run code_graph_scan.');
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:29:- `memory-search.ts` - L2 hybrid search handler with telemetry and profile support.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:34:import { routeQuery } from './query-router.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:64:import type { ChannelName } from './query-router.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:738:  routeResult: ReturnType<typeof routeQuery>;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1009:    const routeResult = routeQuery(query, options.triggerPhrases);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1013:      : new Set<ChannelName>(routeResult.channels);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1015:    // Respect explicit caller channel disables across both the primary route and
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1026:        tier: routeResult.tier,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1027:        channels: routeResult.channels,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1030:        confidence: routeResult.classification.confidence,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1031:        features: routeResult.classification.features as Record<string, unknown>,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1038:    const budgetResult = getDynamicTokenBudget(routeResult.tier);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1192:        routeResult,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1270:      routeResult,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1293:    routeResult,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1559:  // Preserve routing and Stage 4 trace metadata as explicit result fields so downstream
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1565:        typeof row.traceMetadata === 'object' && row.traceMetadata !== null && !Array.isArray(row.traceMetadata)
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1566:          ? row.traceMetadata
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1571:        traceMetadata: {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1577:          // Wire queryComplexity from router classification into trace
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1578:          queryComplexity: routeResult.tier,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1579:          // Wire confidence truncation metadata into per-result trace (036)
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1609:    // Apply token budget truncation after trace/header enrichment so token
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1633:        typeof row.traceMetadata === 'object' && row.traceMetadata !== null && !Array.isArray(row.traceMetadata)
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1634:          ? row.traceMetadata
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1639:        traceMetadata: {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1664:  // Attach pipeline metadata to results for eval/debugging
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1666:  // Polluting result serialization while remaining accessible for debugging.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2278:    'traceMetadata',
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2486:  routeQuery,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:28:// Feature catalog: Health diagnostics (memory_health)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:33:/** Strip absolute paths, stack traces, and truncate for safe user-facing hints. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:38:    .replace(/^[ \t]*at .+$/gm, '')            // strip stack trace lines
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:222:/** Handle memory_health tool -- returns system health status and diagnostics. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:233:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:251:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:260:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:269:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:278:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:287:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:333:        tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:359:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:379:  let profile = embeddings.getEmbeddingProfile() as EmbeddingProfile | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:405:  if (!profile) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:407:      // Resolve the lazy profile so health reflects the active runtime provider
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:409:      profile = await embeddings.getEmbeddingProfileAsync() as EmbeddingProfile | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:411:    } catch (profileError: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:412:      hints.push(`Embedding profile unavailable: ${sanitizeErrorForHint(toErrorMessage(profileError))}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:416:  const providerName = profile?.provider ?? providerMetadata.provider;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:417:  const providerModel = profile?.model ?? providerMetadata.model ?? embeddings.getModelName();
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:418:  const providerDimension = profile?.dim ?? providerMetadata.dim ?? embeddings.getEmbeddingDimension();
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:428:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:439:        'Re-run memory_health with autoRepair:true and confirmed:true to execute repair actions.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:570:    tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:3:description: "Retrieval telemetry, scoring observability, trace schema validation, and consumption logging for the MCP server pipeline."
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:10:  - "trace schema"
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:15:> Retrieval telemetry, scoring observability, trace schema validation, and consumption logging for the MCP server pipeline.
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:35:The telemetry module provides structured observability for the retrieval pipeline and scoring subsystem. It records per-stage latency, search mode selection, fallback triggers, composite quality scores, scoring observation samples, trace payload validation, and agent consumption events. Telemetry data flows to governance tooling and is used by retrieval handlers to surface pipeline health metrics.
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:41:| Modules | 4 | `retrieval-telemetry.ts`, `scoring-observability.ts`, `trace-schema.ts`, `consumption-logger.ts` |
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:54:| **TelemetryTracePayload** | Canonical retrieval trace payload (sanitized, no sensitive/extra fields) |
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:69:├── trace-schema.ts           # Canonical trace payload schema and validation
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:80:| `trace-schema.ts` | Canonical schema and runtime validation for `TelemetryTracePayload`; sanitizes unknown/sensitive fields from trace data |
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:94:| `SPECKIT_EXTENDED_TELEMETRY` | `false` | Enable extended metric collection (latency breakdown, quality scoring, trace payload validation, and architecture updates). Set to `true` to activate |
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:125:| `transitionDiagnostics` | `SessionTransitionTrace \| undefined` | Optional spec-shaped session transition diagnostics captured for trace-enabled retrievals |
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:128:| `tracePayload` | `TelemetryTracePayload \| undefined` | Optional canonical retrieval trace payload |
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:226:| `rolloutState` | `'off' \| 'trace_only' \| 'bounded_runtime'` | Effective graph-walk rollout state for the run |
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:236:**Purpose**: Persist the spec-shaped session transition trace contract into retrieval telemetry when trace-enabled search paths emit transition metadata.
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:264:**Purpose**: Configure `sampleTracePayloads()` filtering behavior when selecting trace payload examples.
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:274:**Purpose**: Return shape from `sampleTracePayloads()` containing sanitized trace details and graph-health context.
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:280:| `tracePayload` | `TelemetryTracePayload` | Sanitized canonical retrieval trace payload |
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:301:### Trace Schema (`trace-schema.ts`)
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:303:**Purpose**: Canonical schema and runtime validation for retrieval trace payloads.
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:307:| `sanitizeRetrievalTracePayload(payload)` | Validate and strip unknown/sensitive fields from a trace payload |
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:429:import { sanitizeRetrievalTracePayload, isRetrievalTracePayload } from './trace-schema';
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:462:| [lib/contracts/README.md](../contracts/README.md) | Retrieval pipeline contracts (envelopes, traces) |
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:6:// and trace.
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:102:        trace: [],
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:120:    const trace: ConvergenceTraceEntry[] = [];
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:127:        trace,
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:134:        trace,
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:144:    } else if (trace.every(t => t.passed)) {
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:150:    const reason = buildDecisionReason(decision, blockingBlockers, trace);
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:157:      trace,
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:179:  trace: ConvergenceTraceEntry[],
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:184:  trace.push({
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:192:  trace.push({
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:200:  trace.push({
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:209:  trace.push({
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:217:  trace.push({
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:286:  trace: ConvergenceTraceEntry[],
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:290:  trace.push({
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:298:  trace.push({
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:306:  trace.push({
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:314:  trace.push({
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:322:  trace.push({
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:372:  trace: ConvergenceTraceEntry[],
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:382:      const failing = trace.filter(t => !t.passed).map(t => t.signal).join(', ');
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/trace-schema.ts:5:// Canonical schema + runtime validation for retrieval trace payloads
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/trace-schema.ts:8:import type { RetrievalStage } from '@spec-kit/shared/contracts/retrieval-trace';
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/trace-schema.ts:21:  'traceId',
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/trace-schema.ts:43:  traceId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/trace-schema.ts:103:  const traceIdValue = payload.traceId;
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/trace-schema.ts:104:  if (typeof traceIdValue !== 'string' || traceIdValue.trim().length === 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/trace-schema.ts:129:    traceId: traceIdValue,
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/trace-schema.ts:149:    payload.traceId !== canonical.traceId ||
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:23:// Feature catalog: System statistics (memory_stats)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:30:/** Handle memory_stats tool -- returns memory system statistics and folder rankings. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:40:      tool: 'memory_stats',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:51:      tool: 'memory_stats',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:70:      tool: 'memory_stats',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:80:      tool: 'memory_stats',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:89:      tool: 'memory_stats',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:98:      tool: 'memory_stats',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:107:      tool: 'memory_stats',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:116:      tool: 'memory_stats',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:159:      tool: 'memory_stats',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:283:      tool: 'memory_stats',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:302:    tool: 'memory_stats',
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:30:      "expectedResultDescription": "Should surface memories about adaptive-fusion.ts (7 intent profiles), intent-classifier.ts, and memory_context intent routing. Cross-document because the behavior spans multiple modules.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:101:      "notes": "Graph-relationship query about architectural lineage. Tests find_decision intent routing with high graph weight (0.50 per adaptive-fusion profile)."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:260:      "expectedResultDescription": "Decision archaeology query. Should surface adaptive-fusion.ts intent profiles and any decision record about mode selection heuristics.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:391:      "notes": "Refactor-intent query — tests that refactor intent routes to deep mode (T007b §1 step 1)."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:395:      "query": "add a new intent type to the adaptive fusion scoring profiles",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:400:      "expectedResultDescription": "Should surface adaptive-fusion.ts intent profiles, intent-classifier.ts enum, and eval-metrics.ts intentMultipliers. Cross-document because the change touches 3+ files.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:401:      "notes": "From T007b §5b: mode selection driven by intent classifier — add_feature routes to deep mode."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:411:      "notes": "Security audit intent — tests that security_audit intent routes to deep mode and surfaces relevant security content."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:860:      "expectedResultDescription": "Should surface retrieval-telemetry.ts, trace-schema.ts, and any spec about the eval logging framework (T005).",
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:196:  // Raw error is logged for debugging but not returned to the caller.
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:197:  console.error('[errors] Unmatched error (debug):', error.message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:62:// Retrieval trace contracts (C136-08)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:63:import { createTrace } from '@spec-kit/shared/contracts/retrieval-trace';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:75:} from '../lib/response/profile-formatters.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:211:  /** REQ-D5-003: Presentation profile ('quick'|'research'|'resume'|'debug'). Default: full response. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:212:  profile?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:528:    profile,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:691:  // Phase C: Intent-to-profile auto-routing.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:692:  // Explicit caller `profile` always takes precedence; auto-detect fills in when absent.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:693:  let effectiveProfile: string | undefined = profile;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:699:        console.error(`[memory-search] Intent-to-profile auto-routing: '${detectedIntent}' → profile '${autoProfile}'`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:702:      // Auto-profile is best-effort — never breaks search
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:711:  // Create retrieval trace at pipeline entry
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:712:  const trace = createTrace(
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:806:      trace,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:965:    if (pipelineResult.trace) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:966:      extraData.retrievalTrace = pipelineResult.trace;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1325:  // REQ-D5-003: Apply presentation profile when flag is enabled and profile is specified.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1326:  // Phase C: effectiveProfile includes auto-routed profile from intent detection.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1331:        const profiled = applyProfileToEnvelope(effectiveProfile, firstEntry.text);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1332:        if (profiled !== firstEntry.text) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1335:            content: [{ ...firstEntry, text: profiled }],
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1338:      } catch (_profileError: unknown) {
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:20:  rolloutState: 'off' | 'trace_only' | 'bounded_runtime';
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:133: * Inspects `trace.graphContribution` on each row.
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:138:  let rolloutState: 'off' | 'trace_only' | 'bounded_runtime' = 'off';
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:147:    const trace = row.trace && typeof row.trace === 'object'
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:148:      ? row.trace as Record<string, unknown>
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:150:    const graphContribution = trace?.graphContribution && typeof trace.graphContribution === 'object'
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:151:      ? trace.graphContribution as Record<string, unknown>
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:158:    if (graphContribution.rolloutState === 'trace_only' || graphContribution.rolloutState === 'bounded_runtime') {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:198:  let toolCalls = 1; // session_bootstrap
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:138:// Default hint is "Run memory_health() for diagnostics".
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:149:      'Run memory_health() to check embedding system status'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:152:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:179:      'Run memory_health() to see current provider status'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:182:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:242:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:247:      'Run memory_health() to check database integrity',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:252:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:268:      'Contact support with schema version info from memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:271:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:276:      'Run memory_health() to assess damage',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:286:      'Run memory_health() to check database status',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:291:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:316:      'Use memory_health() to see current system limits'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:324:      'Use memory_stats() to see available spec folders',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:328:    toolTip: 'memory_stats()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:336:      'Check memory_health() for system status',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:340:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:345:      'Check embedding provider status with memory_health()',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:350:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:377:      'Check memory_stats() to see what content is indexed'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:380:    toolTip: 'memory_stats()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:447:      'Run memory_health() to check system status'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:450:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:487:      'Check memory_health() for recovery options'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:490:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:529:      'Run memory_health() to check database status'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:532:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:659:      'Check memory_health() for system status',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:663:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:677:    'Run memory_health() for diagnostics',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:682:  toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:699:        'Check embedding provider status: memory_health()',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:734:        'Run memory_health() to verify database integrity'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:737:      toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:757:        'Check memory_health() for embedding provider status'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:760:      toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:790:      hint: 'Cannot trace lineage: memory not found.',
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:10:} from './trace-schema.js';
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:13:} from './trace-schema.js';
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:111:  rolloutState: 'off' | 'trace_only' | 'bounded_runtime';
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:153:  tracePayload: TelemetryTracePayload;
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:167:  tracePayload?: TelemetryTracePayload;
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:305:    delete t.tracePayload;
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:309:  t.tracePayload = sanitized;
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:588:    const tracePayload = sanitizeRetrievalTracePayload(
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:589:      isObjectRecord(payload) ? payload.tracePayload : undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:594:    if (!tracePayload || !graphHealth) {
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:607:      tracePayload,
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:632:  const tracePayload = sanitizeRetrievalTracePayload((t as { tracePayload?: unknown }).tracePayload);
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:700:  if (tracePayload) {
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:701:    payload.tracePayload = tracePayload;
.opencode/skill/system-spec-kit/mcp_server/lib/utils/logger.ts:12:export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
.opencode/skill/system-spec-kit/mcp_server/lib/utils/logger.ts:16:  debug: 0,
.opencode/skill/system-spec-kit/mcp_server/lib/utils/logger.ts:66:  debug(message: string, data?: Record<string, unknown>): void;
.opencode/skill/system-spec-kit/mcp_server/lib/utils/logger.ts:88:    debug: (message, data?) => log('debug', prefix, message, data),
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:174:    const profile: EmbeddingProfile | null = embeddings.getEmbeddingProfile();
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:175:    if (profile) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:176:      console.error(`[memory_index_scan] Using embedding provider: ${profile.provider}, model: ${profile.model}, dimension: ${profile.dim}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:639:            _debug_fileCounts: {
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-flags.ts:32: * Whether graph-walk diagnostics should be visible on the trace path.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:322: * Intent classes aligned with adaptive-fusion.ts weight profiles.
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:32:  profile?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:155:    const profile = (['quick', 'research', 'debug'].includes(args.profile ?? '') ? args.profile : undefined) as ContextArgs['profile'];
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:163:      profile,
.opencode/skill/system-spec-kit/mcp_server/lib/search/feedback-denylist.ts:66:  'test', 'error', 'warning', 'info', 'debug', 'log',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:4:// Heuristic pre-classifier that routes queries to the optimal
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:134:  - `README.md` — relocation note and local compatibility documentation for retrieval-trace contracts.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:135:  - `../../shared/contracts/retrieval-trace.ts` — canonical shared contract implementation referenced by retrieval and telemetry code.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:319:  - `query-router.ts` — query-complexity routing and pipeline selection.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:366:- Purpose: Owns structured observability for retrieval and scoring behavior: trace sanitization, retrieval telemetry, scoring observability, and consumption logging. It is intended to observe domain modules rather than drive domain decisions.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:370:  - `trace-schema.ts` — trace payload sanitization and schema validation.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:554:- `telemetry` should accept trace/metric payloads from `search`, `scoring`, or handlers, but not import retrieval logic from them.
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:3:description: "Proxy README for retrieval pipeline contracts. Source of truth is @spec-kit/shared/contracts/retrieval-trace.ts."
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:7:  - "retrieval trace"
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:12:> Proxy README for retrieval pipeline contracts. The canonical source is `@spec-kit/shared/contracts/retrieval-trace.ts`.
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:35:The canonical location for retrieval-trace is `shared/contracts/retrieval-trace.ts` (importable as `@spec-kit/shared/contracts/retrieval-trace`). This README is retained as a pointer so that existing documentation links remain valid.
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:42:| Canonical Source | 1 | `shared/contracts/retrieval-trace.ts` |
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:50:| **ContextEnvelope\<T\>** | Generic typed wrapper for pipeline results with trace and degraded-mode metadata |
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:51:| **RetrievalTrace** | Full pipeline trace capturing stages, timing, query, and intent |
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:69: retrieval-trace.ts                 # Canonical source: types, interfaces, and factory functions
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:76:| `retrieval-trace.ts` | `shared/contracts/` | Defines all retrieval pipeline contracts: ContextEnvelope\<T\>, RetrievalTrace, TraceEntry, DegradedModeContract, EnvelopeMetadata, and the RetrievalStage union type |
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:87:**Purpose**: Generic typed wrapper for pipeline results with trace and degraded-mode metadata.
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:92:| `trace` | `RetrievalTrace` | Full pipeline trace attached to this retrieval |
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:102:| `traceId` | `string` | Unique identifier for this retrieval run (auto-generated `tr_` prefix) |
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:112:**Purpose**: Record per-stage metrics within a retrieval trace.
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:160:| `createTrace(query, sessionId?, intent?)` | `RetrievalTrace` | New trace with auto-generated traceId |
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:161:| `addTraceEntry(trace, stage, inputCount, outputCount, durationMs, metadata?)` | `RetrievalTrace` | Append a stage entry to an existing trace (mutates in place, returns trace for chaining) |
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:163:| `createEnvelope(data, trace, degradedMode?, serverVersion?)` | `ContextEnvelope<T>` | New envelope wrapping results + trace + metadata |
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:207:} from '@spec-kit/shared/contracts/retrieval-trace';
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:208:import type { RetrievalStage } from '@spec-kit/shared/contracts/retrieval-trace';
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:210:// Start a new trace
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:211:const trace = createTrace('authentication flow', 'session-xyz');
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:214:addTraceEntry(trace, 'fusion', 50, 30, 12);
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:217:const envelope = createEnvelope(results, trace);
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:225:} from '@spec-kit/shared/contracts/retrieval-trace';
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:244:| Start trace | `createTrace(query, sessionId?)` | Beginning of a retrieval call |
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:245:| Record stage | `addTraceEntry(trace, stage, in, out, ms)` | After each pipeline stage completes |
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:247:| Wrap output | `createEnvelope(data, trace, degraded?)` | Before returning from retrieval handler |
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:268:| `shared/contracts/retrieval-trace.ts` | Canonical source for all contract types |
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:271:| `lib/telemetry/trace-schema.ts` | Trace schema definitions |
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:169:      const currentTrace = result.trace && typeof result.trace === 'object'
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:170:        ? result.trace as Record<string, unknown>
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:174:        trace: {
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:187:    console.warn(`[session-transition] Failed to attach session transition trace: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:69:| **episodic** | 7 days | 30 days | Event-based: sessions, debugging, discoveries |
.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:105:| `/scratch/`, `/temp/` | working | `specs/<###-spec-name>/scratch/debug.md` |
.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:106:| `session-\d+`, `debug-log` | episodic | `memory/session-1.md` |
.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:164:  filePath: 'specs/<###-spec-name>/scratch/debug.md',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:20:  profile?: 'quick' | 'research' | 'debug';
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:69:  const nodeLimit = args.profile === 'quick' ? 10 : args.profile === 'debug' ? 30 : 20;
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:4:// Feature catalog: Graph calibration profiles and community thresholds
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:8://   cap enforcement, and calibration profile presets.
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:18:// Feature catalog: Graph calibration profiles and community thresholds
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:36:/** Named calibration profile controlling graph and community parameters. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:114:/** Scoring context that a calibration profile can be applied to. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:146:/** Default conservative profile --- all caps at baseline values. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:155:/** Aggressive profile --- tighter caps, stricter Louvain gates. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:318: * Ensures Stage 2 graph bonus never exceeds the profile's graphWeightCap.
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:334: * Applies the profile's graphWeightCap and N2a/N2b caps.
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:337: * @param profile - Calibration profile to apply (defaults to DEFAULT_PROFILE).
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:342:  profile: CalibrationProfile = DEFAULT_PROFILE,
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:345:    graphWeightBoost: applyGraphWeightCap(context.graphWeightBoost, profile.graphWeightCap),
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:346:    n2aScore: Math.min(Math.max(0, context.n2aScore), profile.n2aCap),
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:347:    n2bScore: Math.min(Math.max(0, context.n2bScore), profile.n2bCap),
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:357: * Load the active calibration profile from environment or use default.
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:371:  const profileName = process.env.SPECKIT_CALIBRATION_PROFILE_NAME?.toLowerCase().trim();
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:374:  if (profileName === 'aggressive') {
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:400: * Apply a calibration profile to a scoring context.
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:404: * @param profile - Profile to apply (defaults to loaded profile).
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:409:  profile?: CalibrationProfile,
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:415:  const activeProfile = profile ?? loadCalibrationProfile();
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:431: * @param thresholds     - Activation thresholds (defaults from loaded profile).
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:473: * Extract Louvain thresholds from the loaded calibration profile.
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:476:  const profile = loadCalibrationProfile();
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:478:    minDensity: profile.louvainMinDensity,
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:479:    minSize: profile.louvainMinSize,
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:31:type GraphWalkRolloutState = 'off' | 'trace_only' | 'bounded_runtime';
.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:66:    description: 'Event-based memories: sessions, debugging, discoveries',
.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:144:  { pattern: /debug[-_]?log/i, type: 'episodic' },
.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:209:  'debug session': 'episodic',
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:159:    | 'session_bootstrap'
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:6:// Feature catalog: Query complexity router
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:40: * Check if the complexity router feature flag is enabled.
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:192:        // Round to 3 decimals to avoid floating-point noise in debug output
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:31:    surface: 'memory_health';
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:75:      ? 'Run code_graph_scan or session_bootstrap before relying on structural context.'
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:76:      : 'Run session_bootstrap first, then code_graph_scan if structural context is required.';
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:88:      surface: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:100:      recommendedAction: 'Use memory_health({ autoRepair: true, confirmed: true }) for bounded repair workflows and transparent partial-success reporting.',
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:46:import { addTraceEntry } from '@spec-kit/shared/contracts/retrieval-trace';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:58:import { routeQueryConcepts, nounPhrases, getConceptExpansionTerms } from '../entity-linker.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:493:    trace,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:503:  // matched, log them to the trace for downstream use (graph channel activation
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:504:  // is surfaced via trace metadata; actual graph channel is handled in Stage 2).
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:518:      let routingDb: Parameters<typeof routeQueryConcepts>[1];
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:524:      const routing = routeQueryConcepts(query, routingDb);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:537:              if (trace) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:538:                addTraceEntry(trace, 'candidate', 0, 0, 0, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:553:        if (trace) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:554:          addTraceEntry(trace, 'candidate', 0, 0, 0, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:689:            if (trace) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:690:              addTraceEntry(trace, 'candidate', channelCount, candidates.length, 0, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:853:            if (trace) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:854:              addTraceEntry(trace, 'candidate', channelCount, candidates.length, 0, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:908:          if (trace) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:909:            addTraceEntry(trace, 'fallback', 0, candidates.length, 0, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1147:            if (trace) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1148:              addTraceEntry(trace, 'candidate', allQueries.length - 1, reformMergedCount, 0, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1201:        if (trace) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1202:          addTraceEntry(trace, 'candidate', 1, newHydeCandidates.length, 0, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1277:              if (trace) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1278:                addTraceEntry(trace, 'candidate', 1, filteredSummaryHits.length, 0, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1355:          if (trace && boostedCount > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1356:            addTraceEntry(trace, 'candidate', 0, boostedCount, 0, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1374:  if (trace) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1376:      trace,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:81:import { addTraceEntry } from '@spec-kit/shared/contracts/retrieval-trace';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1232:      const routed = applyArtifactRouting(results, config.artifactRouting);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1233:      results = routed;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1350:  if (config.trace) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1352:      config.trace,
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:7:// presentation profiles, each optimising for a different consumer:
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:15://   debug    — full trace, no omission
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:16://              Complete raw response for debugging (flag-gated).
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:20:// Backward compatibility: when flag is OFF (or profile omitted), the
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:28:/** Supported response profile names. */
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:29:export type ResponseProfile = 'quick' | 'research' | 'resume' | 'debug';
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:56:/** Input to the profile formatter: the parsed response envelope data. */
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:62:  /** Extra fields from the envelope (passed through in non-omitting profiles). */
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:66:/** Output of the `quick` profile formatter. */
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:78:/** Output of the `research` profile formatter. */
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:86:/** Output of the `resume` profile formatter. */
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:94:/** Output of the `debug` profile formatter — passthrough + tokenStats. */
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:107:/** Union of all profile outputs. */
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:109:  | { profile: 'quick'; data: QuickProfile }
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:110:  | { profile: 'research'; data: ResearchProfile }
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:111:  | { profile: 'resume'; data: ResumeProfile }
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:112:  | { profile: 'debug'; data: DebugProfile };
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:292: * Format results as the `quick` profile.
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:337: * Format results as the `research` profile.
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:352: * Format results as the `resume` profile.
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:374: * Format results as the `debug` profile.
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:396: * Apply a named presentation profile to search results.
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:398: * Returns a tagged union with `profile` + `data` fields.
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:399: * When the flag is OFF or profile is not recognized, returns `null`
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:402: * @param profile       - Profile name ('quick' | 'research' | 'resume' | 'debug')
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:405: * @returns FormattedProfile or null if feature is disabled / profile unknown
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:408:  profile: string,
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:418:  switch (profile as ResponseProfile) {
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:420:      return { profile: 'quick', data: formatQuick(safeInput) };
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:422:      return { profile: 'research', data: formatResearch(safeInput) };
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:424:      return { profile: 'resume', data: formatResume(safeInput) };
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:425:    case 'debug':
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:426:      return { profile: 'debug', data: formatDebug(safeInput) };
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:433: * Apply a profile to an MCP response envelope text (JSON string).
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:434: * Parses the envelope, applies the profile formatter, and returns
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:435: * a new envelope JSON string with the profiled data.
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:442: * @param profile      - Profile name
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:448:  profile: string,
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:482:  const formatted = applyResponseProfile(profile, formatterInput, forceEnabled);
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:493:      responseProfile: formatted.profile,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:73:  PipelineResult { results, metadata, annotations, trace }
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:116:- `@spec-kit/shared/contracts/retrieval-trace.ts` - Trace contract used for pipeline observability.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:41:import { addTraceEntry } from '@spec-kit/shared/contracts/retrieval-trace';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:322:  if (config.trace) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:324:      config.trace,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:37:import { addTraceEntry } from '@spec-kit/shared/contracts/retrieval-trace';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:155:  if (config.trace) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:157:      config.trace,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:258:  if (config.trace) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:260:      config.trace,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:13:// Output: PipelineResult { results: Stage4ReadonlyRow[], metadata, annotations, trace }
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:193:    trace: config.trace,
.opencode/skill/system-spec-kit/mcp_server/lib/response/README.md:3:description: "Envelope helpers, MCP wrappers, and response-profile formatting for memory tool responses."
.opencode/skill/system-spec-kit/mcp_server/lib/response/README.md:6:  - "response profiles"
.opencode/skill/system-spec-kit/mcp_server/lib/response/README.md:24:`lib/response/` standardizes how MCP tool handlers build envelopes, wrap them for MCP transport, and optionally compress them into profile-shaped outputs for specific consumers.
.opencode/skill/system-spec-kit/mcp_server/lib/response/README.md:33:| `profile-formatters.ts` | Profile reducers for `quick`, `research`, `resume`, and `debug` response shapes |
.opencode/skill/system-spec-kit/mcp_server/lib/response/README.md:41:- `profile-formatters.ts` exports `applyResponseProfile()` and `applyProfileToEnvelope()` plus the public profile types for `quick`, `research`, `resume`, and `debug`.
.opencode/skill/system-spec-kit/mcp_server/lib/response/README.md:42:- Response profiles are gated through `isResponseProfileEnabled()` and preserve backward compatibility by returning `null` when profile formatting is disabled or not requested.
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:10://   - debug (opt-in): adds channelContribution map
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:23:// The channelContribution map is only included when debug.enabled=true.
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:43:/** Per-channel score contribution breakdown (debug tier). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:56:/** Full explainability payload — includes channelContribution when debug ON. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:69:  /** Whether to include channelContribution (debug tier). Default: false. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:70:  debugEnabled?: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:307: * When debugEnabled=false (default), only summary and topSignals are included.
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:308: * When debugEnabled=true, channelContribution is also included.
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:326:  if (options.debugEnabled) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:5:import type { RetrievalTrace } from '@spec-kit/shared/contracts/retrieval-trace';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:163:  trace?: RetrievalTrace;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:252:      rolloutState?: 'off' | 'trace_only' | 'bounded_runtime';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:338:  trace?: RetrievalTrace;
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:4:// Feature catalog: Query complexity router
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:49:    'problem', 'debug', 'patch', 'resolve', 'repair', 'incorrect',
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:85:    /debug\s+/i,
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:145:    'fix bug and debug failing error',
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:609: * Phase C: Intent-to-profile auto-routing.
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:610: * Maps detected intent types to the most appropriate response profile.
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:611: * Used when no explicit profile is specified by the caller.
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:613:const INTENT_TO_PROFILE: Readonly<Record<IntentType, 'quick' | 'research' | 'debug'>> = {
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:614:  fix_bug: 'debug',
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:615:  security_audit: 'debug',
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:624: * Get the auto-routed response profile for a detected intent.
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:627: * @returns Response profile name or null if no mapping exists
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:629:function getProfileForIntent(intent: IntentType): 'quick' | 'research' | 'debug' | null {
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:169:import { routeQueryConcepts } from './entity-linker.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:197:    const routing = routeQueryConcepts(ctx.query ?? '', db);
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:200:    // Find memory IDs matching the routed concepts via title keyword search,
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:44:- **Intent Classification**: 7 intent types route to task-specific retrieval weights
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:249:| **TypeScript**       | `query-classifier.ts`, `query-router.ts`, `query-expander.ts` (query pipeline)               |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:301:| `query-router.ts`          | -      | TypeScript | Tier-to-channel-subset routing for selective pipeline execution (Sprint 3) |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:908:| Search weights configuration | Loaded via SERVER_DIR in the split vector-index modules (compat imports still route through `vector-index-impl.ts`) |
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-expander.ts:35:  api: ['endpoint', 'route'],
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:16:// Feature catalog: Query complexity router
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:33:/** Result of the routeQuery convenience function. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:128: * Classify a query's complexity and route it to the appropriate channel subset
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:134: * @param query - The search query to classify and route
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:138:function routeQuery(
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:184:  routeQuery,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:19:// Algorithm. All temporal decay for persistent memories should route
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:346: * const routed = routeQueryConcepts('memory graph edges', db);
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:349:export function routeQueryConcepts(
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:367:    console.warn(`[entity-linker] routeQueryConcepts failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:379: * @param concepts - Canonical concept names (from routeQueryConcepts).
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:17:import { routeQueryConcepts } from './entity-linker.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:725:    const routing = routeQueryConcepts(query, database);
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:212:// Supported SPECKIT_GRAPH_WALK_ROLLOUT states: off, trace_only, bounded_runtime.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:213:export type GraphWalkRolloutState = 'off' | 'trace_only' | 'bounded_runtime';
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:220:  if (rollout === 'trace_only' || rollout === 'trace-only') {
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:221:    return 'trace_only';
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:449: * REQ-D3-005 / REQ-D3-006: Graph calibration profiles and community thresholds.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:450: * Enables calibration profile enforcement, Louvain activation gates, and
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:577: * REQ-D5-003: Mode-aware response profile formatting.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:618: * communities, and boost factors for transparency and debuggability.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:669: * Phase C: Intent-to-profile auto-routing.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:670: * When enabled, classifyIntent() results automatically select a response profile
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:671: * (quick, research, resume, debug) when no explicit profile is specified by the caller.
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:122:  traceMetadata?: Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:133: * Inspects `sources`, `source`, and traceMetadata.attribution.
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:148:  // Check traceMetadata.attribution for richer channel data
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:150:  const attribution = result.traceMetadata?.attribution;

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	package index
     2	
     3	import (
     4		"hash/fnv"
     5		"sort"
     6		"strings"
     7		"sync"
     8	)
     9	
    10	// QueryCache implements tiered caching for search results.
    11	// Tier 0: exact query hash match (0ms)
    12	// Tier 1: fuzzy match via Jaccard similarity >= threshold (~1ms)
    13	// Inspired by ByteRover's ablation study showing cache tiers drive 29.4pp accuracy gain.
    14	const (
    15		cacheMaxEntries      = 256
    16		cacheJaccardThreshold = 0.6
    17	)
    18	
    19	type cacheEntry struct {
    20		query   string
    21		terms   map[string]bool // tokenized query terms for Jaccard comparison
    22		results []SearchResult
    23		hits    int // access count for LRU
    24	}
    25	
    26	// queryCache stores recent query→results pairs with exact and fuzzy matching.
    27	type queryCache struct {
    28		mu      sync.RWMutex
    29		entries []cacheEntry
    30		counter int // global access counter for LRU
    31	}
    32	
    33	func newQueryCache() *queryCache {
    34		return &queryCache{
    35			entries: make([]cacheEntry, 0, cacheMaxEntries),
    36		}
    37	}
    38	
    39	// get attempts to find cached results for a query.
    40	// Returns results and true if found (tier 0 or 1), nil and false otherwise.
    41	func (c *queryCache) get(query string) ([]SearchResult, bool) {
    42		c.mu.RLock()
    43		defer c.mu.RUnlock()
    44	
    45		if len(c.entries) == 0 {
    46			return nil, false
    47		}
    48	
    49		// Tier 0: exact hash match
    50		h := hashQuery(query)
    51		for i := range c.entries {
    52			if hashQuery(c.entries[i].query) == h && c.entries[i].query == query {
    53				c.entries[i].hits = c.counter
    54				return c.entries[i].results, true
    55			}
    56		}
    57	
    58		// Tier 1: fuzzy match via Jaccard similarity
    59		queryTerms := termSet(query)
    60		if len(queryTerms) == 0 {
    61			return nil, false
    62		}
    63	
    64		var bestIdx int
    65		var bestSim float64
    66	
    67		for i := range c.entries {
    68			sim := jaccard(queryTerms, c.entries[i].terms)
    69			if sim > bestSim {
    70				bestSim = sim
    71				bestIdx = i
    72			}
    73		}
    74	
    75		if bestSim >= cacheJaccardThreshold {
    76			c.entries[bestIdx].hits = c.counter
    77			return c.entries[bestIdx].results, true
    78		}
    79	
    80		return nil, false
    81	}
    82	
    83	// put stores query results in the cache, evicting the least recently used entry if full.
    84	func (c *queryCache) put(query string, results []SearchResult) {
    85		c.mu.Lock()
    86		defer c.mu.Unlock()
    87	
    88		c.counter++
    89	
    90		// Check if query already cached — update results
    91		for i := range c.entries {
    92			if c.entries[i].query == query {
    93				c.entries[i].results = results
    94				c.entries[i].hits = c.counter
    95				return
    96			}
    97		}
    98	
    99		entry := cacheEntry{
   100			query:   query,
   101			terms:   termSet(query),
   102			results: results,
   103			hits:    c.counter,
   104		}
   105	
   106		if len(c.entries) >= cacheMaxEntries {
   107			// Evict LRU entry
   108			minIdx := 0
   109			minHits := c.entries[0].hits
   110			for i := 1; i < len(c.entries); i++ {
   111				if c.entries[i].hits < minHits {
   112					minHits = c.entries[i].hits
   113					minIdx = i
   114				}
   115			}
   116			c.entries[minIdx] = entry
   117		} else {
   118			c.entries = append(c.entries, entry)
   119		}
   120	}
   121	
   122	func hashQuery(q string) uint64 {
   123		h := fnv.New64a()
   124		h.Write([]byte(strings.ToLower(strings.TrimSpace(q))))
   125		return h.Sum64()
   126	}
   127	
   128	func termSet(query string) map[string]bool {
   129		terms := tokenize(query)
   130		set := make(map[string]bool, len(terms))
   131		for _, t := range terms {
   132			set[t] = true
   133		}
   134		return set
   135	}
   136	
   137	// jaccard computes the Jaccard similarity between two term sets.
   138	func jaccard(a, b map[string]bool) float64 {
   139		if len(a) == 0 && len(b) == 0 {
   140			return 0
   141		}
   142	
   143		intersection := 0
   144		for term := range a {
   145			if b[term] {
   146				intersection++
   147			}
   148		}
   149	
   150		union := len(a) + len(b) - intersection
   151		if union == 0 {
   152			return 0
   153		}
   154	
   155		return float64(intersection) / float64(union)
   156	}
   157	
   158	// sortByScore sorts results by score normalization: s / (1 + s) → [0, 1).
   159	// Higher is better. ByteRover uses this normalization for consistent thresholding.
   160	func normalizeScore(score float64) float64 {
   161		if score <= 0 {
   162			return 0
   163		}
   164		return score / (1.0 + score)
   165	}
   166	
   167	// filterOOD performs out-of-domain detection.
   168	// If significant query terms (>= 4 chars) are unmatched and top score
   169	// is below threshold, returns true (query is out of domain).
   170	func filterOOD(query string, results []scoredDoc, threshold float64) bool {
   171		if len(results) == 0 {
   172			return true
   173		}
   174	
   175		topNormalized := normalizeScore(results[0].score)
   176		if topNormalized >= threshold {
   177			return false
   178		}
   179	
   180		// Check if significant terms are all unmatched
   181		terms := tokenize(query)
   182		significant := 0
   183		for _, t := range terms {
   184			if len(t) >= 4 {
   185				significant++
   186			}
   187		}
   188	
   189		// If most terms are short (< 4 chars), don't filter
   190		if significant == 0 {
   191			return false
   192		}
   193	
   194		return topNormalized < threshold
   195	}
   196	
   197	// deduplicateResults removes duplicate paths, keeping the highest scored.
   198	func deduplicateResults(results []SearchResult) []SearchResult {
   199		seen := make(map[string]int) // path → index in output
   200		var deduped []SearchResult
   201	
   202		// Results should already be sorted by rank (best first)
   203		for _, r := range results {
   204			if _, exists := seen[r.Path]; !exists {
   205				seen[r.Path] = len(deduped)
   206				deduped = append(deduped, r)
   207			}
   208		}
   209	
   210		sort.Slice(deduped, func(i, j int) bool {
   211			return deduped[i].Rank > deduped[j].Rank
   212		})
   213	
   214		return deduped
   215	}

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go | sed -n '250,360p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   250				conf := doc.Get("confidence")
   251				imp := doc.Get("importance")
   252				body := strings.TrimSpace(doc.Body)
   253				if len(body) > 200 {
   254					body = body[:200] + "..."
   255				}
   256				sb.WriteString(fmt.Sprintf("- **%s** %s (confidence: %s, importance: %s)\n  %s\n\n", subj, pred, conf, imp, body))
   257			}
   258			return fmt.Sprintf("%d memory facts:\n\n%s", len(docs), sb.String()), nil
   259		}
   260	
   261		memoryFactsSchema := map[string]interface{}{
   262			"type": "object",
   263			"properties": map[string]interface{}{
   264				"subject": map[string]interface{}{"type": "string", "description": "Filter by subject (optional)"},
   265				"limit":   map[string]interface{}{"type": "integer", "description": "Max results (default 20)"},
   266			},
   267		}
   268	
   269		srv.AddTool("memory_facts", "List episodic memory facts. Optionally filter by subject.", memoryFactsSchema, memoryFactsHandler)
   270	
   271		// --- Memory Search ---
   272	
   273		memorySearchHandler := func(args map[string]interface{}) (string, error) {
   274			query, _ := args["query"].(string)
   275			limit := 10
   276			if l, ok := args["limit"].(float64); ok {
   277				limit = int(l)
   278			}
   279	
   280			// Search with optional librarian expansion
   281			queries := []string{query}
   282			if librarian.Available() {
   283				queries = librarian.ExpandQuery(query)
   284				log.Printf("memory_search: librarian expanded %q → %d variants", query, len(queries))
   285			}
   286	
   287			// Run in-memory fact search across all query variants, merge by subject|predicate
   288			seen := map[string]bool{}
   289			var merged []index.MemFact
   290	
   291			for _, q := range queries {
   292				facts := v.Index.SearchFacts(q, limit)
   293				for _, f := range facts {
   294					key := f.Subject + "|" + f.Predicate
   295					if !seen[key] {
   296						seen[key] = true
   297						merged = append(merged, f)
   298					}
   299				}
   300			}
   301	
   302			if len(merged) == 0 {
   303				return "No memory facts matched this query.", nil
   304			}
   305	
   306			// Cap at limit
   307			if len(merged) > limit {
   308				merged = merged[:limit]
   309			}
   310	
   311			// Reinforce accessed facts — FSRS recall event.
   312			// Each fact returned to an agent is a successful recall, strengthening stability.
   313			for _, f := range merged {
   314				if f.ID != "" {
   315					go v.ReinforceFact(f.ID) // async — don't block search response
   316				}
   317			}
   318	
   319			var sb strings.Builder
   320			sb.WriteString(fmt.Sprintf("%d results (bm25+librarian, %d queries):\n\n",
   321				len(merged), len(queries)))
   322			for _, f := range merged {
   323				tier := f.Tier()
   324				line := fmt.Sprintf("- **%s** %s → %s (conf=%.2f, %s)",
   325					f.Subject, f.Predicate, truncateStr(f.Value, 120), f.Confidence, tier)
   326				if warn := f.StalenessWarning(); warn != "" {
   327					line += " " + warn
   328				}
   329				sb.WriteString(line + "\n")
   330			}
   331			return sb.String(), nil
   332		}
   333	
   334		memorySearchSchema := map[string]interface{}{
   335			"type": "object",
   336			"properties": map[string]interface{}{
   337				"query": map[string]interface{}{"type": "string", "description": "Search query"},
   338				"limit": map[string]interface{}{"type": "integer", "description": "Max results (default 10)"},
   339			},
   340			"required": []string{"query"},
   341		}
   342	
   343		srv.AddTool("memory_search", "Search episodic memory facts with librarian expansion and FSRS reinforcement.", memorySearchSchema, memorySearchHandler)
   344	
   345		// --- Memory Store ---
   346	
   347		memoryStoreHandler := func(args map[string]interface{}) (string, error) {
   348			subject, _ := args["subject"].(string)
   349			predicate, _ := args["predicate"].(string)
   350			value, _ := args["value"].(string)
   351			confidence := 0.8
   352			if c, ok := args["confidence"].(float64); ok {
   353				confidence = c
   354			}
   355			importance := "medium"
   356			if imp, ok := args["importance"].(string); ok {
   357				importance = imp
   358			}
   359	
   360			relPath, err := v.StoreFact(subject, predicate, value, confidence, importance)

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '430,560p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   430	
   431	// filterByMinQualityScore, resolveQualityThreshold, buildCacheArgs,
   432	// resolveArtifactRoutingQuery, applyArtifactRouting — now imported from lib/search/search-utils.ts
   433	// CacheArgsInput — now imported from lib/search/search-utils.ts
   434	// parseNullableInt, collapseAndReassembleChunkResults — now imported from lib/search/chunk-reassembly.ts
   435	
   436	/* ───────────────────────────────────────────────────────────────
   437	   3. CONFIGURATION
   438	──────────────────────────────────────────────────────────────── */
   439	
   440	// Sections 3–5 (STATE_PRIORITY, MAX_DEEP_QUERY_VARIANTS, buildDeepQueryVariants,
   441	// StrengthenOnAccess, applyTestingEffect, filterByMemoryState) removed in
   442	// These were only used by the legacy V1 pipeline.
   443	// The V2 4-stage pipeline handles state filtering (Stage 4), testing effect, and
   444	// Query expansion through its own stages.
   445	
   446	/* ───────────────────────────────────────────────────────────────
   447	   6. SESSION DEDUPLICATION UTILITIES
   448	──────────────────────────────────────────────────────────────── */
   449	
   450	function applySessionDedup(results: MemorySearchRow[], sessionId: string, enableDedup: boolean): DedupResult {
   451	  if (!enableDedup || !sessionId || !sessionManager.isEnabled()) {
   452	    return {
   453	      results,
   454	      dedupStats: { enabled: false, sessionId: null }
   455	    };
   456	  }
   457	
   458	  const { filtered, dedupStats } = sessionManager.filterSearchResults(sessionId, results as Parameters<typeof sessionManager.filterSearchResults>[1]);
   459	
   460	  if (filtered.length > 0) {
   461	    sessionManager.markResultsSent(sessionId, filtered as Parameters<typeof sessionManager.markResultsSent>[1]);
   462	  }
   463	
   464	  return {
   465	    results: filtered as MemorySearchRow[],
   466	    dedupStats: {
   467	      ...dedupStats,
   468	      sessionId
   469	    }
   470	  };
   471	}
   472	
   473	// Sections 7–9 (applyCrossEncoderReranking, applyIntentWeightsToResults,
   474	// ShouldApplyPostSearchIntentWeighting, postSearchPipeline) removed in
   475	// These were only used by the legacy V1 pipeline
   476	// Path. The V2 4-stage pipeline handles all equivalent functionality.
   477	
   478	/* ───────────────────────────────────────────────────────────────
   479	   10. MAIN HANDLER
   480	──────────────────────────────────────────────────────────────── */
   481	
   482	/** Handle memory_search tool — performs hybrid vector/BM25 search with intent-aware ranking.
   483	 * @param args - Search arguments (query, concepts, mode, specFolder, etc.)
   484	 * @returns MCP response with ranked search results
   485	 */
   486	async function handleMemorySearch(args: SearchArgs): Promise<MCPResponse> {
   487	  const _searchStartTime = Date.now();
   488	  resetLastLexicalCapabilitySnapshot();
   489	  // BUG-001: Check for external database updates before processing
   490	  await checkDatabaseUpdated();
   491	
   492	  const {
   493	    cursor,
   494	    query,
   495	    concepts,
   496	    specFolder,
   497	    folderBoost,
   498	    tenantId,
   499	    userId,
   500	    agentId,
   501	    sharedSpaceId,
   502	    limit: rawLimit = 10,
   503	    tier,
   504	    contextType,
   505	    useDecay: useDecay = true,
   506	    includeContiguity: includeContiguity = false,
   507	    includeConstitutional: includeConstitutional = true,
   508	    includeContent: includeContent = false,
   509	    anchors,
   510	    bypassCache: bypassCache = false,
   511	    sessionId,
   512	    enableDedup: enableDedup = true,
   513	    intent: explicitIntent,
   514	    autoDetectIntent: autoDetectIntent = true,
   515	    minState,  // No default — memoryState column not yet in schema; defaulting to 'WARM' filters all rows
   516	    applyStateLimits: applyStateLimits = false,
   517	    rerank = true, // Enable reranking by default for better result quality
   518	    applyLengthPenalty: applyLengthPenalty = true,
   519	    trackAccess: trackAccess = false, // opt-in, off by default
   520	    includeArchived: includeArchived = false, // REQ-206: exclude archived by default
   521	    enableSessionBoost: enableSessionBoost = isSessionBoostEnabled(),
   522	    enableCausalBoost: enableCausalBoost = isCausalBoostEnabled(),
   523	    minQualityScore,
   524	    min_quality_score,
   525	    mode,
   526	    includeTrace: includeTraceArg = false,
   527	    sessionTransition,
   528	    profile,
   529	    retrievalLevel: retrievalLevel = 'auto',
   530	  } = args;
   531	  const includeTraceByFlag = process.env.SPECKIT_RESPONSE_TRACE === 'true';
   532	  const includeTrace = includeTraceByFlag || includeTraceArg === true;
   533	  const normalizedScope = normalizeScopeContext({ tenantId, userId, agentId, sessionId, sharedSpaceId });
   534	  const progressiveScopeKey = JSON.stringify({
   535	    tenantId: normalizedScope.tenantId ?? null,
   536	    userId: normalizedScope.userId ?? null,
   537	    agentId: normalizedScope.agentId ?? null,
   538	    sessionId: normalizedScope.sessionId ?? null,
   539	    sharedSpaceId: normalizedScope.sharedSpaceId ?? null,
   540	  });
   541	
   542	  // Validate at least one search input is provided (moved from schema superRefine for GPT compatibility)
   543	  const hasCursor = typeof cursor === 'string' && cursor.trim().length > 0;
   544	  const hasQuery = typeof query === 'string' && query.trim().length > 0;
   545	  const hasConcepts = Array.isArray(concepts) && concepts.length >= 2;
   546	  if (!hasCursor && !hasQuery && !hasConcepts) {
   547	    return { content: [{ type: 'text', text: JSON.stringify({ error: 'Either "query" (string), "concepts" (array with 2-5 items), or "cursor" (string) is required.' }) }] };
   548	  }
   549	
   550	  if (hasCursor) {
   551	    const resolved = resolveCursor(cursor.trim(), undefined, { scopeKey: progressiveScopeKey });
   552	    if (!resolved) {
   553	      return createMCPErrorResponse({
   554	        tool: 'memory_search',
   555	        error: 'Cursor is invalid, expired, or out of scope',
   556	        code: 'E_VALIDATION',
   557	        details: { parameter: 'cursor' },
   558	        recovery: {
   559	          hint: 'Retry the original search to generate a fresh continuation cursor',
   560	        },

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts | sed -n '360,450p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   360	    ? summary
   361	    : results.length > 0
   362	      ? `${results.length} result(s) available for continuation`
   363	      : 'No prior context found for this session';
   364	
   365	  return {
   366	    state: stateDescription,
   367	    nextSteps: extractNextSteps(results),
   368	    blockers: extractBlockers(results),
   369	    topResult: results.length > 0 ? results[0] : null,
   370	  };
   371	}
   372	
   373	/**
   374	 * Format results as the `debug` profile.
   375	 * Passthrough — all data preserved. Adds token statistics.
   376	 */
   377	function formatDebug(input: ProfileFormatterInput): DebugProfile {
   378	  const { results, summary, hints, meta, ...rest } = input;
   379	  const tokenStats = computeTokenStats(JSON.stringify(input), results.length);
   380	
   381	  return {
   382	    results,
   383	    summary: typeof summary === 'string' ? summary : '',
   384	    hints: Array.isArray(hints) ? hints : [],
   385	    meta: {
   386	      ...(meta ?? {}),
   387	      ...rest,
   388	    },
   389	    tokenStats,
   390	  };
   391	}
   392	
   393	// ── Public API ─────────────────────────────────────────────────
   394	
   395	/**
   396	 * Apply a named presentation profile to search results.
   397	 *
   398	 * Returns a tagged union with `profile` + `data` fields.
   399	 * When the flag is OFF or profile is not recognized, returns `null`
   400	 * so the caller can fall through to the original response.
   401	 *
   402	 * @param profile       - Profile name ('quick' | 'research' | 'resume' | 'debug')
   403	 * @param input         - Parsed response data containing results array
   404	 * @param forceEnabled  - Override flag check (for testing)
   405	 * @returns FormattedProfile or null if feature is disabled / profile unknown
   406	 */
   407	export function applyResponseProfile(
   408	  profile: string,
   409	  input: ProfileFormatterInput,
   410	  forceEnabled?: boolean
   411	): FormattedProfile | null {
   412	  const enabled = forceEnabled !== undefined ? forceEnabled : isResponseProfileEnabled();
   413	  if (!enabled) return null;
   414	
   415	  const safeResults: SearchResultEntry[] = Array.isArray(input.results) ? input.results : [];
   416	  const safeInput: ProfileFormatterInput = { ...input, results: safeResults };
   417	
   418	  switch (profile as ResponseProfile) {
   419	    case 'quick':
   420	      return { profile: 'quick', data: formatQuick(safeInput) };
   421	    case 'research':
   422	      return { profile: 'research', data: formatResearch(safeInput) };
   423	    case 'resume':
   424	      return { profile: 'resume', data: formatResume(safeInput) };
   425	    case 'debug':
   426	      return { profile: 'debug', data: formatDebug(safeInput) };
   427	    default:
   428	      return null;
   429	  }
   430	}
   431	
   432	/**
   433	 * Apply a profile to an MCP response envelope text (JSON string).
   434	 * Parses the envelope, applies the profile formatter, and returns
   435	 * a new envelope JSON string with the profiled data.
   436	 *
   437	 * Returns the original text unchanged when:
   438	 * - Flag is OFF
   439	 * - Profile is unrecognised
   440	 * - Parsing fails
   441	 *
   442	 * @param profile      - Profile name
   443	 * @param envelopeText - JSON string of the MCP response envelope
   444	 * @param forceEnabled - Override flag check (for testing)
   445	 * @returns Modified envelope JSON string, or original on no-op
   446	 */
   447	export function applyProfileToEnvelope(
   448	  profile: string,
   449	  envelopeText: string,
   450	  forceEnabled?: boolean

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts | sed -n '220,340p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   220	──────────────────────────────────────────────────────────────── */
   221	
   222	/** Handle memory_health tool -- returns system health status and diagnostics. */
   223	async function handleMemoryHealth(args: HealthArgs): Promise<MCPResponse> {
   224	  const startTime = Date.now();
   225	  // A7-P2-1: Generate requestId for incident correlation in error responses
   226	  const requestId = randomUUID();
   227	  try {
   228	    await checkDatabaseUpdated();
   229	  } catch (dbStateErr: unknown) {
   230	    const message = toErrorMessage(dbStateErr);
   231	    console.error(`[memory-health] Database refresh failed [requestId=${requestId}]: ${message}`);
   232	    return createMCPErrorResponse({
   233	      tool: 'memory_health',
   234	      error: 'Database refresh failed before diagnostics completed. Retry the request or restart the MCP server.',
   235	      code: 'E021',
   236	      details: { requestId },
   237	      startTime,
   238	    });
   239	  }
   240	
   241	  const {
   242	    reportMode = 'full',
   243	    limit: rawLimit = DEFAULT_DIVERGENT_ALIAS_LIMIT,
   244	    specFolder,
   245	    autoRepair = false,
   246	    confirmed = false,
   247	  } = args ?? {};
   248	
   249	  if (reportMode !== 'full' && reportMode !== DIVERGENT_ALIAS_REPORT_MODE) {
   250	    return createMCPErrorResponse({
   251	      tool: 'memory_health',
   252	      error: `Invalid reportMode: ${String(reportMode)}. Expected "full" or "${DIVERGENT_ALIAS_REPORT_MODE}"`,
   253	      code: 'E_INVALID_INPUT',
   254	      details: { requestId },
   255	      startTime,
   256	    });
   257	  }
   258	  if (specFolder !== undefined && typeof specFolder !== 'string') {
   259	    return createMCPErrorResponse({
   260	      tool: 'memory_health',
   261	      error: 'specFolder must be a string',
   262	      code: 'E_INVALID_INPUT',
   263	      details: { requestId },
   264	      startTime,
   265	    });
   266	  }
   267	  if (typeof autoRepair !== 'boolean') {
   268	    return createMCPErrorResponse({
   269	      tool: 'memory_health',
   270	      error: 'autoRepair must be a boolean',
   271	      code: 'E_INVALID_INPUT',
   272	      details: { requestId },
   273	      startTime,
   274	    });
   275	  }
   276	  if (typeof confirmed !== 'boolean') {
   277	    return createMCPErrorResponse({
   278	      tool: 'memory_health',
   279	      error: 'confirmed must be a boolean',
   280	      code: 'E_INVALID_INPUT',
   281	      details: { requestId },
   282	      startTime,
   283	    });
   284	  }
   285	  if (rawLimit !== undefined && (!Number.isFinite(rawLimit) || rawLimit <= 0)) {
   286	    return createMCPErrorResponse({
   287	      tool: 'memory_health',
   288	      error: 'limit must be a positive number',
   289	      code: 'E_INVALID_INPUT',
   290	      details: { requestId },
   291	      startTime,
   292	    });
   293	  }
   294	  const safeLimit = Math.max(1, Math.min(Math.floor(rawLimit || DEFAULT_DIVERGENT_ALIAS_LIMIT), MAX_DIVERGENT_ALIAS_LIMIT));
   295	
   296	  const database = vectorIndex.getDb();
   297	  let memoryCount = 0;
   298	  let aliasConflicts: ReturnType<typeof summarizeAliasConflicts> = summarizeAliasConflicts([]);
   299	  let aliasRows: AliasConflictDbRow[] = [];
   300	  let divergentAliasGroups: DivergentAliasGroup[] = [];
   301	  const embeddingRetry = getEmbeddingRetryStats();
   302	  try {
   303	    if (database) {
   304	      const countResult = database.prepare('SELECT COUNT(*) as count FROM memory_index')
   305	        .get() as Record<string, number> | undefined;
   306	      memoryCount = countResult?.count ?? 0;
   307	
   308	      const whereParts: string[] = [
   309	        'parent_id IS NULL',
   310	      ];
   311	      const params: unknown[] = [];
   312	      if (specFolder) {
   313	        whereParts.push('spec_folder = ?');
   314	        params.push(specFolder);
   315	      }
   316	
   317	      const aliasSql = `
   318	        SELECT file_path, content_hash, spec_folder
   319	        FROM memory_index
   320	        WHERE ${whereParts.join(' AND ')}
   321	      `;
   322	
   323	      aliasRows = (database.prepare(aliasSql).all(...params) as AliasConflictDbRow[])
   324	        .filter((row) => typeof row?.file_path === 'string' && isSpecsAliasPath(row.file_path));
   325	      aliasConflicts = summarizeAliasConflicts(aliasRows);
   326	      divergentAliasGroups = getDivergentAliasGroups(aliasRows, safeLimit);
   327	    }
   328	  } catch (err: unknown) {
   329	    const message = toErrorMessage(err);
   330	    if (message.includes('no such table')) {
   331	      console.error(`[memory-health] Schema missing [requestId=${requestId}]:`, message);
   332	      return createMCPErrorResponse({
   333	        tool: 'memory_health',
   334	        error: `Schema missing: ${sanitizeErrorForHint(message)}. Run memory_index_scan() to create the database schema, or restart the MCP server.`,
   335	        code: 'E_SCHEMA_MISSING',
   336	        details: { requestId },
   337	        startTime,
   338	      });
   339	    }
   340	    console.warn(`[memory-health] Failed to get memory count [requestId=${requestId}]:`, message);

exec
/bin/zsh -lc 'rg -n "memory_due|due review|nextReviewDate|review queue|memory_review|memory_status|memory_debug_search|vault_connected|connected" .opencode/skill/system-spec-kit/mcp_server .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:184:| `SPECKIT_COMMUNITY_DETECTION` | `true` | boolean | Community detection via BFS connected components + Louvain escalation (N2c). Graduated ON. | `lib/search/search-flags.ts` |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-010.md:23:- **What it does**: Modus builds an in-memory `bySubject`/`byTag`/`byEntity` cross-index, scores connections with fixed weights (subject `3.0`, entity `2.0`, tag `1.0`), and appends connected docs to search results or returns them via `vault_connected`. Public stores typed causal edges (`caused`, `enabled`, `supersedes`, `contradicts`, `derived_from`, `supports`), exposes traversal in both directions, tracks graph coverage/orphans, records `weight_history`, and applies contradiction detection and edge bounds.
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:33:type SharedIdentityTool = SharedAdminTool | 'shared_memory_status';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:374:  tool: 'shared_space_upsert' | 'shared_space_membership_set' | 'shared_memory_status' | 'shared_memory_enable',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:756:      tool: 'shared_memory_status',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:765:      tool: 'shared_memory_status',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:785:      'shared_memory_status',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-024.md:2:Implement blueprint 1 first in a write-enabled pass, then add `memory_health({ reportMode: "doctor" })`, then do the retrieval-core extraction before starting the separate `memory_due` ADR.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-024.md:6:### Finding 1: Review queue risk — a Public `memory_due` inbox will be misleading unless it gets a first-class due-state contract
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-024.md:8:- **What it does**: Modus keeps search recall, explicit reinforce, decay, and archive on the same fact fields. Public already persists `access_count`, `last_accessed`, `stability`, `difficulty`, `last_review`, and `review_count`, and `processReview()` computes `nextReviewDate`, but that due date is not persisted and read-time strengthening stays opt-in via `trackAccess=false`.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-024.md:9:- **Why it matters for us**: If Public adds a due/review queue without defining one authoritative source of truth for “due,” the queue can drift from actual search behavior. A memory can look overdue while recent read activity updated its effective retrievability, which would make the inbox feel unreliable.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-024.md:27:### Finding 1: Rank 1 (20/25) — explicit `memory_review` is the first thing Public should ship
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-024.md:29:- **What it does**: Modus exposes an explicit `memory_reinforce` operator action on top of its FSRS state. Public already has the underlying pieces: graded review math (`AGAIN/HARD/GOOD/EASY`), `processReview()` with `nextReviewDate`, and opt-in strengthening-on-access. The current exposed adjacent surface is `memory_validate`, which records only `wasUseful` feedback and does not let an operator issue a graded FSRS review.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-024.md:30:- **Why it matters for us**: This is the highest impact x feasibility transfer because it closes the clearest control-plane gap without inventing new storage or changing retrieval architecture. It also de-risks the bigger `memory_due` idea: until Public has a first-class graded review action, any future review queue would have no trustworthy way to record hard recalls, lapses, and easy wins distinctly.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-024.md:63:Define a canonical recall-event contract for Public first: decide whether ordinary search hits should refresh lifetime, persist a real due-state projection on top of existing FSRS fields, and expose that through `memory_review` plus a visible `memory_due`/retention surface. After that, test whether Modus-style freshness buckets belong only in an episodic fact lane rather than in canonical memory ranking.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-024.md:93:`Code_Environment/Public` already has Spec Kit Memory with semantic and hybrid retrieval, markdown-backed memory artifacts, importance tiers, and an FSRS-based classification-decay layer in the MCP server. It does **not** currently mirror Modus Memory's end-to-end local vault server model, BM25 field-boosted lexical search with lightweight query caching, librarian-style synonym expansion for keyword retrieval, or simple subject/tag/entity adjacency maps that surface connected documents directly in result sets. Base the comparison on current code, not stale assumptions.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-024.md:101:5. After FSRS, inspect cross-referencing by reading `external/modus-memory-main/internal/index/crossref.go`. Trace how subject, tag, and entity adjacency maps are built, what weighting is used for connected results, and what the system deliberately does **not** do because it avoids a full graph database.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-024.md:133:10. Which Modus patterns would best improve query-time recall in `Code_Environment/Public`: BM25 field boosts, query caching, lexical expansion, connected-result hints, or simpler markdown-vault ergonomics?
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-024.md:185:- MCP tool handlers that expose search, memory, reinforcement, decay, and connected-doc surfaces
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-024.md:2214:// This is Option A from the knowledge graph discussion: connected search results
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-024.md:2218:// DocRef is a lightweight reference to a connected document.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-024.md:2229:	bySubject map[string][]DocRef // lowercase subject → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-024.md:2230:	byTag     map[string][]DocRef // tag → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-024.md:2231:	byEntity  map[string][]DocRef // entity name → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-024.md:2316:// ForSubject returns all documents connected to a subject (case-insensitive).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-024.md:2342:// ForEntity returns all documents connected to an entity.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-024.md:2449:// FormatConnected returns a human-readable string of connected documents.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-024.md:2890:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:14://	memory_reinforce, memory_decay_facts, vault_connected
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-024.md:2989:	srv.AddTool("vault_connected", "Find all documents connected to a subject, entity, or tag. Returns facts, beliefs, entities, articles, learnings, and missions that share references.", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-024.md:3046://	memory_reinforce, memory_decay_facts, vault_connected
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-024.md:3062:		"vault_connected":   true,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-024.md:8596:		// Append cross-reference hints — show connected docs the agent might want
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-024.md:8612:					sb.WriteString("**Cross-references** (connected docs not in results above):\n")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-024.md:8879:    75			// Append cross-reference hints — show connected docs the agent might want
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-024.md:8895:    91						sb.WriteString("**Cross-references** (connected docs not in results above):\n")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-024.md:10922:    13	// This is Option A from the knowledge graph discussion: connected search results
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-024.md:10926:    17	// DocRef is a lightweight reference to a connected document.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-024.md:10937:    28		bySubject map[string][]DocRef // lowercase subject → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-024.md:10938:    29		byTag     map[string][]DocRef // tag → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-024.md:10939:    30		byEntity  map[string][]DocRef // entity name → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-024.md:11024:   115	// ForSubject returns all documents connected to a subject (case-insensitive).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-024.md:11201:- **What it does**: The README/Librarian pattern promises that a local model prunes and compresses context down to a small handoff, but the MCP code itself only exposes search, expansion, fact recall, and connected-doc hints. The compression layer is an operational pattern around the server, not a typed startup/compaction surface emitted by the server.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-024.md:11208:- **What it does**: Modus builds lightweight subject/tag/entity adjacency maps at index time and appends connected documents to search output when they were not already returned by lexical search.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-024.md:11209:- **Why it matters**: For compaction recovery, this is the most transferable Modus idea: after we recover the active spec/task, a cheap connected-neighbor pass could widen context without immediately paying for heavier graph or semantic expansion.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-024.md:11233:Design a narrow compaction-candidate experiment inside Public’s existing survival stack: add a cheap Modus-style lexical/connected-neighbor preselection lane to `compact-inject` or resume synthesis, but keep `session_bootstrap` / `session_resume` / `memory_context(resume)` as the only authoritative recovery surfaces. In parallel, define an explicit recall-event rule so compaction-injected memories are not auto-strengthened unless they are actually reused.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-024.md:11255:- **What it does**: The README/Librarian pattern promises that a local model prunes and compresses context down to a small handoff, but the MCP code itself only exposes search, expansion, fact recall, and connected-doc hints. The compression layer is an operational pattern around the server, not a typed startup/compaction surface emitted by the server.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-024.md:11262:- **What it does**: Modus builds lightweight subject/tag/entity adjacency maps at index time and appends connected documents to search output when they were not already returned by lexical search.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-024.md:11263:- **Why it matters**: For compaction recovery, this is the most transferable Modus idea: after we recover the active spec/task, a cheap connected-neighbor pass could widen context without immediately paying for heavier graph or semantic expansion.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-024.md:11287:Design a narrow compaction-candidate experiment inside Public’s existing survival stack: add a cheap Modus-style lexical/connected-neighbor preselection lane to `compact-inject` or resume synthesis, but keep `session_bootstrap` / `session_resume` / `memory_context(resume)` as the only authoritative recovery surfaces. In parallel, define an explicit recall-event rule so compaction-injected memories are not auto-strengthened unless they are actually reused.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:14:Run the next iteration on **operator workflow design**: map Public’s existing internals into a compact DX control plane with 3 concrete candidates only, `memory_status`, `memory_debug_search`, and `memory_review`, then judge whether each should be a new tool, a `profile:"debug"` response, or a wrapper around existing tools.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:26:### Finding 1: Rank 1 (20/25) — explicit `memory_review` is the first thing Public should ship
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:28:- **What it does**: Modus exposes an explicit `memory_reinforce` operator action on top of its FSRS state. Public already has the underlying pieces: graded review math (`AGAIN/HARD/GOOD/EASY`), `processReview()` with `nextReviewDate`, and opt-in strengthening-on-access. The current exposed adjacent surface is `memory_validate`, which records only `wasUseful` feedback and does not let an operator issue a graded FSRS review.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:29:- **Why it matters for us**: This is the highest impact x feasibility transfer because it closes the clearest control-plane gap without inventing new storage or changing retrieval architecture. It also de-risks the bigger `memory_due` idea: until Public has a first-class graded review action, any future review queue would have no trustworthy way to record hard recalls, lapses, and easy wins distinctly.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:37:- **What it does**: Modus builds lightweight subject/tag/entity adjacency maps at index time and appends connected documents to search output when they were not already returned by lexical search.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:38:- **Why it matters**: For compaction recovery, this is the most transferable Modus idea: after we recover the active spec/task, a cheap connected-neighbor pass could widen context without immediately paying for heavier graph or semantic expansion.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:57:### Finding 1: Rank 1 (20/25) — explicit `memory_review` is the first thing Public should ship
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:59:- **What it does**: Modus exposes an explicit `memory_reinforce` operator action on top of its FSRS state. Public already has the underlying pieces: graded review math (`AGAIN/HARD/GOOD/EASY`), `processReview()` with `nextReviewDate`, and opt-in strengthening-on-access. The current exposed adjacent surface is `memory_validate`, which records only `wasUseful` feedback and does not let an operator issue a graded FSRS review.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:60:- **Why it matters for us**: This is the highest impact x feasibility transfer because it closes the clearest control-plane gap without inventing new storage or changing retrieval architecture. It also de-risks the bigger `memory_due` idea: until Public has a first-class graded review action, any future review queue would have no trustworthy way to record hard recalls, lapses, and easy wins distinctly.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:68:- **What it does**: Modus builds lightweight subject/tag/entity adjacency maps at index time and appends connected documents to search output when they were not already returned by lexical search.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:69:- **Why it matters**: For compaction recovery, this is the most transferable Modus idea: after we recover the active spec/task, a cheap connected-neighbor pass could widen context without immediately paying for heavier graph or semantic expansion.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:106:`Code_Environment/Public` already has Spec Kit Memory with semantic and hybrid retrieval, markdown-backed memory artifacts, importance tiers, and an FSRS-based classification-decay layer in the MCP server. It does **not** currently mirror Modus Memory's end-to-end local vault server model, BM25 field-boosted lexical search with lightweight query caching, librarian-style synonym expansion for keyword retrieval, or simple subject/tag/entity adjacency maps that surface connected documents directly in result sets. Base the comparison on current code, not stale assumptions.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:114:5. After FSRS, inspect cross-referencing by reading `external/modus-memory-main/internal/index/crossref.go`. Trace how subject, tag, and entity adjacency maps are built, what weighting is used for connected results, and what the system deliberately does **not** do because it avoids a full graph database.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:146:10. Which Modus patterns would best improve query-time recall in `Code_Environment/Public`: BM25 field boosts, query caching, lexical expansion, connected-result hints, or simpler markdown-vault ergonomics?
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:198:- MCP tool handlers that expose search, memory, reinforcement, decay, and connected-doc surfaces
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:287:/bin/zsh -lc 'rg -n "modus|hybrid-rag-fusion|003-modus-memory-main|memory_review|adjacency|librarian|BM25|FSRS" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:289:157:- rollout_summaries/2026-04-09T10-35-53-UGDf-009_post_save_render_fixes_memory_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T12-35-53-019d71d0-0ec5-7c80-a08b-6d336ee5c639.jsonl, updated_at=2026-04-09T12:01:25+00:00, thread_id=019d71d0-0ec5-7c80-a08b-6d336ee5c639)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:299:1869:- rollout_summaries/2026-03-13T11-01-44-IBXE-outsourced_agent_memory_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/13/rollout-2026-03-13T12-01-44-019ce6dc-0509-7630-9874-db11f57a9e06.jsonl, updated_at=2026-03-13T11:21:38+00:00, thread_id=019ce6dc-0509-7630-9874-db11f57a9e06)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:649:`Code_Environment/Public` already has Spec Kit Memory with semantic and hybrid retrieval, markdown-backed memory artifacts, importance tiers, and an FSRS-based classification-decay layer in the MCP server. It does **not** currently mirror Modus Memory's end-to-end local vault server model, BM25 field-boosted lexical search with lightweight query caching, librarian-style synonym expansion for keyword retrieval, or simple subject/tag/entity adjacency maps that surface connected documents directly in result sets. Base the comparison on current code, not stale assumptions.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:657:5. After FSRS, inspect cross-referencing by reading `external/modus-memory-main/internal/index/crossref.go`. Trace how subject, tag, and entity adjacency maps are built, what weighting is used for connected results, and what the system deliberately does **not** do because it avoids a full graph database.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:689:10. Which Modus patterns would best improve query-time recall in `Code_Environment/Public`: BM25 field boosts, query caching, lexical expansion, connected-result hints, or simpler markdown-vault ergonomics?
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:741:- MCP tool handlers that expose search, memory, reinforcement, decay, and connected-doc surfaces
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:1893:    70	  nextReviewDate: string;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:2030:   207	  const nextReviewDate = getNextReviewDate(newStability);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:2037:   214	    nextReviewDate,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:2141:    34	 * highly connected knowledge is more reliably accessible over time.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:2845:   901		srv.AddTool("vault_connected", "Find all documents connected to a subject, entity, or tag. Returns facts, beliefs, entities, articles, learnings, and missions that share references.", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:2899:/bin/zsh -lc "rg -n \"memory_validate|trackAccess|processReview|nextReviewDate|AGAIN|HARD|GOOD|EASY|memory_review|memory_due|review\" .opencode/skill/system-spec-kit/mcp_server -g '"'!**/dist/**'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:3173:.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:316:// result = { stability, difficulty, lastReview, reviewCount, nextReviewDate, retrievability }
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:3198:.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:186:        nextReviewDate: new Date().toISOString(),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:3268:.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:70:  nextReviewDate: string;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:3283:.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:207:  const nextReviewDate = getNextReviewDate(newStability);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:3285:.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:214:    nextReviewDate,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:3490:.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:207:    expect(result).toHaveProperty('nextReviewDate');
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:3511:.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:249:  it('D-08: nextReviewDate is valid future date', () => {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:3513:.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:251:    const nextDate = new Date(result.nextReviewDate);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:3541:.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:294:      const nextReviewDate = fsrsScheduler.getNextReviewDate(5);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:3542:.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:295:      expect(Number.isNaN(new Date(nextReviewDate).getTime())).toBe(false);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:3548:The main contrast is already sharpening: Modus exposes explicit review and connected-neighbor controls, while Public mostly keeps FSRS mechanics behind retrieval internals and `memory_validate`. I’m pulling the remaining source points now so the final ranking reflects both implementation feasibility and what we should explicitly reject.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:3848:    13	// This is Option A from the knowledge graph discussion: connected search results
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:3852:    17	// DocRef is a lightweight reference to a connected document.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:3863:    28		bySubject map[string][]DocRef // lowercase subject → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:3864:    29		byTag     map[string][]DocRef // tag → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:3865:    30		byEntity  map[string][]DocRef // entity name → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:3950:   115	// ForSubject returns all documents connected to a subject (case-insensitive).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:3976:   141	// ForEntity returns all documents connected to an entity.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:4083:   248	// FormatConnected returns a human-readable string of connected documents.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:4653:    14	//	memory_reinforce, memory_decay_facts, vault_connected
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:4669:    30			"vault_connected":   true,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:5202:Design a narrow compaction-candidate experiment inside Public’s existing survival stack: add a cheap Modus-style lexical/connected-neighbor preselection lane to `compact-inject` or resume synthesis, but keep `session_bootstrap` / `session_resume` / `memory_context(resume)` as the only authoritative recovery surfaces. In parallel, define an explicit recall-event rule so compaction-injected memories are not auto-strengthened unless they are actually reused.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:5206:### Finding 1: Rank 1 (20/25) — explicit `memory_review` is the first thing Public should ship
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:5208:- **What it does**: Modus exposes an explicit `memory_reinforce` operator action on top of its FSRS state. Public already has the underlying pieces: graded review math (`AGAIN/HARD/GOOD/EASY`), `processReview()` with `nextReviewDate`, and opt-in strengthening-on-access. The current exposed adjacent surface is `memory_validate`, which records only `wasUseful` feedback and does not let an operator issue a graded FSRS review.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:5209:- **Why it matters for us**: This is the highest impact x feasibility transfer because it closes the clearest control-plane gap without inventing new storage or changing retrieval architecture. It also de-risks the bigger `memory_due` idea: until Public has a first-class graded review action, any future review queue would have no trustworthy way to record hard recalls, lapses, and easy wins distinctly.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:5217:- **What it does**: Modus builds lightweight subject/tag/entity adjacency maps at index time and appends connected documents to search output when they were not already returned by lexical search.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:5218:- **Why it matters**: For compaction recovery, this is the most transferable Modus idea: after we recover the active spec/task, a cheap connected-neighbor pass could widen context without immediately paying for heavier graph or semantic expansion.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:5262:`Code_Environment/Public` already has Spec Kit Memory with semantic and hybrid retrieval, markdown-backed memory artifacts, importance tiers, and an FSRS-based classification-decay layer in the MCP server. It does **not** currently mirror Modus Memory's end-to-end local vault server model, BM25 field-boosted lexical search with lightweight query caching, librarian-style synonym expansion for keyword retrieval, or simple subject/tag/entity adjacency maps that surface connected documents directly in result sets. Base the comparison on current code, not stale assumptions.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:5270:5. After FSRS, inspect cross-referencing by reading `external/modus-memory-main/internal/index/crossref.go`. Trace how subject, tag, and entity adjacency maps are built, what weighting is used for connected results, and what the system deliberately does **not** do because it avoids a full graph database.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:5302:10. Which Modus patterns would best improve query-time recall in `Code_Environment/Public`: BM25 field boosts, query caching, lexical expansion, connected-result hints, or simpler markdown-vault ergonomics?
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:5354:- MCP tool handlers that expose search, memory, reinforcement, decay, and connected-doc surfaces
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:5461:### Finding 1: Rank 1 (20/25) — explicit `memory_review` is the first thing Public should ship
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:5463:- **What it does**: Modus exposes an explicit `memory_reinforce` operator action on top of its FSRS state. Public already has the underlying pieces: graded review math (`AGAIN/HARD/GOOD/EASY`), `processReview()` with `nextReviewDate`, and opt-in strengthening-on-access. The current exposed adjacent surface is `memory_validate`, which records only `wasUseful` feedback and does not let an operator issue a graded FSRS review.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:5464:- **Why it matters for us**: This is the highest impact x feasibility transfer because it closes the clearest control-plane gap without inventing new storage or changing retrieval architecture. It also de-risks the bigger `memory_due` idea: until Public has a first-class graded review action, any future review queue would have no trustworthy way to record hard recalls, lapses, and easy wins distinctly.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:5472:- **What it does**: Modus builds lightweight subject/tag/entity adjacency maps at index time and appends connected documents to search output when they were not already returned by lexical search.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:5473:- **Why it matters**: For compaction recovery, this is the most transferable Modus idea: after we recover the active spec/task, a cheap connected-neighbor pass could widen context without immediately paying for heavier graph or semantic expansion.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:5510:Run the next iteration on **operator workflow design**: map Public’s existing internals into a compact DX control plane with 3 concrete candidates only, `memory_status`, `memory_debug_search`, and `memory_review`, then judge whether each should be a new tool, a `profile:"debug"` response, or a wrapper around existing tools.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:5540:`Code_Environment/Public` already has Spec Kit Memory with semantic and hybrid retrieval, markdown-backed memory artifacts, importance tiers, and an FSRS-based classification-decay layer in the MCP server. It does **not** currently mirror Modus Memory's end-to-end local vault server model, BM25 field-boosted lexical search with lightweight query caching, librarian-style synonym expansion for keyword retrieval, or simple subject/tag/entity adjacency maps that surface connected documents directly in result sets. Base the comparison on current code, not stale assumptions.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:5548:5. After FSRS, inspect cross-referencing by reading `external/modus-memory-main/internal/index/crossref.go`. Trace how subject, tag, and entity adjacency maps are built, what weighting is used for connected results, and what the system deliberately does **not** do because it avoids a full graph database.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:5580:10. Which Modus patterns would best improve query-time recall in `Code_Environment/Public`: BM25 field boosts, query caching, lexical expansion, connected-result hints, or simpler markdown-vault ergonomics?
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:5632:- MCP tool handlers that expose search, memory, reinforcement, decay, and connected-doc surfaces
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:5737:Run the next iteration on **operator workflow design**: map Public’s existing internals into a compact DX control plane with 3 concrete candidates only, `memory_status`, `memory_debug_search`, and `memory_review`, then judge whether each should be a new tool, a `profile:"debug"` response, or a wrapper around existing tools.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:5749:### Finding 1: Rank 1 (20/25) — explicit `memory_review` is the first thing Public should ship
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:5751:- **What it does**: Modus exposes an explicit `memory_reinforce` operator action on top of its FSRS state. Public already has the underlying pieces: graded review math (`AGAIN/HARD/GOOD/EASY`), `processReview()` with `nextReviewDate`, and opt-in strengthening-on-access. The current exposed adjacent surface is `memory_validate`, which records only `wasUseful` feedback and does not let an operator issue a graded FSRS review.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:5752:- **Why it matters for us**: This is the highest impact x feasibility transfer because it closes the clearest control-plane gap without inventing new storage or changing retrieval architecture. It also de-risks the bigger `memory_due` idea: until Public has a first-class graded review action, any future review queue would have no trustworthy way to record hard recalls, lapses, and easy wins distinctly.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:5760:- **What it does**: Modus builds lightweight subject/tag/entity adjacency maps at index time and appends connected documents to search output when they were not already returned by lexical search.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:5761:- **Why it matters**: For compaction recovery, this is the most transferable Modus idea: after we recover the active spec/task, a cheap connected-neighbor pass could widen context without immediately paying for heavier graph or semantic expansion.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:5798:`Code_Environment/Public` already has Spec Kit Memory with semantic and hybrid retrieval, markdown-backed memory artifacts, importance tiers, and an FSRS-based classification-decay layer in the MCP server. It does **not** currently mirror Modus Memory's end-to-end local vault server model, BM25 field-boosted lexical search with lightweight query caching, librarian-style synonym expansion for keyword retrieval, or simple subject/tag/entity adjacency maps that surface connected documents directly in result sets. Base the comparison on current code, not stale assumptions.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:5806:5. After FSRS, inspect cross-referencing by reading `external/modus-memory-main/internal/index/crossref.go`. Trace how subject, tag, and entity adjacency maps are built, what weighting is used for connected results, and what the system deliberately does **not** do because it avoids a full graph database.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:5838:10. Which Modus patterns would best improve query-time recall in `Code_Environment/Public`: BM25 field boosts, query caching, lexical expansion, connected-result hints, or simpler markdown-vault ergonomics?
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:5890:- MCP tool handlers that expose search, memory, reinforcement, decay, and connected-doc surfaces
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:6034:/bin/zsh -lc 'rg -n "Recommendation|adopt now|prototype later|reject|BM25|cache|librarian|adjacency|memory_review|route summary|debug|operator bundle" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:6040:41:`Code_Environment/Public` already has Spec Kit Memory with semantic and hybrid retrieval, markdown-backed memory artifacts, importance tiers, and an FSRS-based classification-decay layer in the MCP server. It does **not** currently mirror Modus Memory's end-to-end local vault server model, BM25 field-boosted lexical search with lightweight query caching, librarian-style synonym expansion for keyword retrieval, or simple subject/tag/entity adjacency maps that surface connected documents directly in result sets. Base the comparison on current code, not stale assumptions.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:6042:49:5. After FSRS, inspect cross-referencing by reading `external/modus-memory-main/internal/index/crossref.go`. Trace how subject, tag, and entity adjacency maps are built, what weighting is used for connected results, and what the system deliberately does **not** do because it avoids a full graph database.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:6052:81:10. Which Modus patterns would best improve query-time recall in `Code_Environment/Public`: BM25 field boosts, query caching, lexical expansion, connected-result hints, or simpler markdown-vault ergonomics?
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:6258:7952:- **What it does**: Modus builds three adjacency maps (`bySubject`, `byTag`, `byEntity`), scores connected docs with fixed weights (subject `3.0`, entity `2.0`, tag `1.0`), and appends connected-doc hints to search responses. The “second pass” only checks title and subject for entity mentions even though the comments imply broader body linkage.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:6278:8047:- **What it does**: Modus builds three adjacency maps (`bySubject`, `byTag`, `byEntity`), scores connected docs with fixed weights (subject `3.0`, entity `2.0`, tag `1.0`), and appends connected-doc hints to search responses. The “second pass” only checks title and subject for entity mentions even though the comments imply broader body linkage.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:6349:8439:- **What it does**: Modus builds adjacency maps keyed by normalized subject, tag, and entity name, then scores connected docs with fixed weights `subject=3`, `entity=2`, `tag=1`. This is cheap and useful for related-document surfacing. But it is intentionally shallow: no traversal, no causal semantics, and the “scan title/body for entity mentions” comment only checks title and subject in code. Public already has richer graph-aware ranking signals, causal boost, and structural freshness augmentation.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:6391:8711:- **What it does**: Modus builds cheap adjacency maps over markdown documents only: shared subject gets weight `3.0`, entity `2.0`, tag `1.0`, then `vault_search` appends connected documents that were not already returned. Public’s code-graph and CocoIndex are stronger, but they solve different problems: `code_graph_query/context` answer structural code questions, and CocoIndex is the semantic code-search bridge. Neither is the same as “show me adjacent memory docs I might also want right now.”
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:6392:8712:- **Why it matters for us**: This is additive, not competitive. Public should not replace causal memory or code graph with Modus-style string adjacency, but a small connected-memory appendix for markdown artifacts could improve exploration and follow-on recall without disturbing the existing routing split of memory vs semantic code vs structural code.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:6449:9112:- Questions addressed: whether Modus’s cache design should influence Public; whether Modus’s query-expansion merge path is architecturally better or worse than Public’s pipeline; whether Modus’s split fact-search surfaces suggest a refactor direction; whether Public’s own FSRS write-back placement should change; whether any part of Modus’s connected-doc UX is worth borrowing without adopting its adjacency index.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:6500:9517:- **What it does**: Modus builds an in-memory metadata adjacency map from subject/tag/entity overlap, weights subject/entity/tag at `3/2/1`, and appends “connected” documents that were not in the main ranked set. Public already has stronger structural enrichment—causal-neighbor boost, neighbor injection, and co-activation spreading—but those are graph-driven, not simple frontmatter co-membership summaries.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:6503:9524:- **What it does**: Modus exposes both automatic reinforcement on recall and an explicit `memory_reinforce` tool. Public already has the underlying grade model (`AGAIN/HARD/GOOD/EASY`), review processing, and strengthening-on-access logic, but keeps write-back behind `trackAccess=false` and has no first-class `memory_reinforce`/`memory_review` tool in the current schema set.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:6508:9561:- **Questions addressed**: which Modus ideas already have insertion points in Public; whether the missing work is backend math or operator surface; which candidates are low/medium integration versus truly invasive; whether connected-result hints overlap with Public graph features; whether librarian expansion is still meaningful given Public deep-mode reformulation.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:6509:9569:Evaluate a concrete Public design for `memory_due` + `memory_review`: one tool that lists due/stale/promotion-eligible/archival-candidate memories, and one tool that applies graded FSRS review updates explicitly, then compare whether a metadata-based “connected docs” appendix improves operator trust beyond current causal/contiguity enrichment.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:6522:9674:### Finding 1: Rank 1 (20/25) — explicit `memory_review` is the first thing Public should ship
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:6524:9681:### Finding 2: Rank 2 (15/25, tie-broken ahead) — a doctor-style summary should ship in the same tranche as `memory_review`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:6527:9697:- **What it does**: Modus builds a lightweight adjacency layer from subject/tag/entity overlap and appends “connected docs not in results above” as an extra hint surface. Public already has stronger graph-backed enrichment via causal boosts, neighbor injection, and co-activation, but not a simple metadata-derived explanation appendix.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:6533:9711:- **What it does**: The ranking resolves into a four-phase roadmap: **Phase 1** ship `memory_review` plus a doctor-style summary; **Phase 2** define the authoritative due-state contract and then add `memory_due`; **Phase 3** pilot connected-doc explanations as a non-scoring appendix; **Phase 4** run a feature-flagged lexical-expansion experiment only on weak-result fallback paths.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:6536:9743:- Questions answered: the correct roadmap is **not** “build the biggest feature first.” Public should ship **`memory_review` first**, pair it with a **doctor-style summary**, then formalize the due-state contract before building **`memory_due`**. Connected-doc hints are worth testing only as explanation, and lexical expansion should be the final, tightly bounded experiment.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:6537:9750:Finalize iteration 020 as a closing synthesis: specify the Public API shape for `memory_review` and `memory_due`, decide whether due state is persisted or derived, and define success metrics for the two later prototypes (connected-doc appendix and weak-result lexical fallback).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:6540:9767:**Executive summary:** Borrow **Modus’s operator surfaces**, not its weaker retrieval shortcuts. **Adopt now:** graded `memory_review`, doctor-style summary, and a strict one-retrieval-core rule. **New feature needed:** authoritative `memory_due` and a durable proposal inbox. **Prototype later:** connected-doc appendix, weak-result lexical fallback, and content-level contradiction linting. **Reject:** fuzzy result-cache reuse, permissive markdown ingestion, default write-on-read as policy, and unenforced trust-stage metadata.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:6547:9808:- **What it does**: Modus builds lightweight subject/entity/tag adjacency and appends connected docs that did not make the main ranked list. The weighting is simple and fixed (`subject 3`, `entity 2`, `tag 1`).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:6564:9900:Turn this synthesis into implementation design: define the Public `memory_review` API first, add a doctor-style formatter over `memory_health`, then write the due-state ADR (`persisted next_review_at` vs deterministic derivation) before scoping `memory_due` and the proposal inbox.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:6647:   207	| `vault_connected` | Cross-reference query — find everything linked to a subject, tag, or entity |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:6945:.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:33:type SharedIdentityTool = SharedAdminTool | 'shared_memory_status';
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:6946:.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:374:  tool: 'shared_space_upsert' | 'shared_space_membership_set' | 'shared_memory_status' | 'shared_memory_enable',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:6948:.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:756:      tool: 'shared_memory_status',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:6949:.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:765:      tool: 'shared_memory_status',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:6950:.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:785:      'shared_memory_status',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:7027:.opencode/skill/system-spec-kit/mcp_server/README.md:924:##### `shared_memory_status`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:7108:.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:444:  name: 'shared_memory_status',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:7143:.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:445:  shared_memory_status: getSchema({
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:7148:.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:493:  shared_memory_status: ['tenantId', 'actorUserId', 'actorAgentId'],
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:7289:.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:58:  'shared_memory_status',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:7291:.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:79:    case 'shared_memory_status':       return handleSharedMemoryStatus(parseArgs<SharedMemoryStatusArgs>(validateToolArgs('shared_memory_status', args)));
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:7334:.opencode/skill/system-spec-kit/mcp_server/shared-spaces/README.md:42:| `shared_memory_status` | Caller-scoped rollout and membership view; requires exactly one actor identity |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:7335:.opencode/skill/system-spec-kit/mcp_server/shared-spaces/README.md:50:`shared_memory_status`, `shared_space_upsert`, and `shared_space_membership_set` rely on actor identity validation in `handlers/shared-memory.ts`. Admin mutations compare the caller against the configured shared-memory admin identity before allowing ownership-sensitive changes.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:7457:.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:397:    for (const toolName of ['shared_space_upsert', 'shared_space_membership_set', 'shared_memory_status']) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:7458:.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:442:  it('handler requires caller identity for shared_memory_status', async () => {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:7459:.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:454:  it('runtime accepts shared_memory_status with one actor identity', () => {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:7460:.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:456:      validateToolArgs('shared_memory_status', {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:7686:.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:86:    tools: ['checkpoint_create', 'checkpoint_list', 'checkpoint_restore', 'checkpoint_delete', 'shared_memory_enable', 'shared_memory_status', 'shared_space_upsert', 'shared_space_membership_set']
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:7927:.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:164:    expect(api.LAYER_DEFINITIONS.L5.tools).toContain('shared_memory_status');
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:7928:.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:165:    expect(api.TOOL_LAYER_MAP.shared_memory_status).toBe('L5');
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:7929:.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:166:    expect(api.getLayerForTool('shared_memory_status')).toBe('L5');
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:7930:.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:167:    expect(api.getLayerTokenBudget('shared_memory_status')).toBe(1000);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:7994:.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:177:      'shared_memory_status',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:8001:.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:300:      'shared_space_upsert', 'shared_space_membership_set', 'shared_memory_status', 'shared_memory_enable',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:8032:.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:161:    it('shared_memory_status appears in exactly one layer and is mapped to that layer', () => {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:8033:.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:162:      const matchingLayers = Object.values(LD).filter((layer) => layer.tools.includes('shared_memory_status'));
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:8034:.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:166:      expect(mod.TOOL_LAYER_MAP['shared_memory_status']).toBe(matchingLayers[0].id);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:8174:**Executive summary:** Borrow **Modus’s operator surfaces**, not its weaker retrieval shortcuts. **Adopt now:** graded `memory_review`, doctor-style summary, and a strict one-retrieval-core rule. **New feature needed:** authoritative `memory_due` and a durable proposal inbox. **Prototype later:** connected-doc appendix, weak-result lexical fallback, and content-level contradiction linting. **Reject:** fuzzy result-cache reuse, permissive markdown ingestion, default write-on-read as policy, and unenforced trust-stage metadata.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:8180:- **What it does**: Modus exposes `memory_reinforce`, but only as a success-only reinforce action. Public already has the stronger primitive: graded FSRS review (`AGAIN/HARD/GOOD/EASY`) plus computed `nextReviewDate`, yet the exposed adjacent tool is only `memory_validate(wasUseful)`, which adjusts confidence rather than recording a real review event.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:8181:- **Why it matters for us**: This closes the clearest control-plane gap without changing retrieval architecture. It also makes any later review queue trustworthy because review history would record hard recalls and lapses, not only “useful / not useful.”
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:8199:### Finding 4: `memory_due` is real product value, but it needs an authoritative due-state contract first
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:8201:- **What it does**: Modus visibly ties search recall, reinforce, decay, and archive to one fact state. Public already stores `stability`, `difficulty`, `last_review`, `review_count`, and opt-in access effects, and computes `nextReviewDate`, but does not expose an operator-facing due queue.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:8215:- **What it does**: Modus builds lightweight subject/entity/tag adjacency and appends connected docs that did not make the main ranked list. The weighting is simple and fixed (`subject 3`, `entity 2`, `tag 1`).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:8438:### Finding 1: Ship explicit graded `memory_review` first
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:8440:- **What it does**: Modus exposes explicit reinforcement; Public already has the stronger graded FSRS math and `nextReviewDate`, but only exposes `memory_validate(wasUseful)`.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:8459:### Finding 4: `memory_due` is the biggest missing workflow, but it needs a real contract first
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:8466:### Finding 5: Prototype connected-doc hints only as an explanation appendix
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:8501:Stop external research and convert this into implementation design in this order: `memory_review` API, doctor/debug route-summary surface, ADR for authoritative `memory_due`, then feature-flagged prototypes for connected-doc appendix and weak-result lexical fallback.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:8514:### Finding 1: Ship explicit graded `memory_review` first
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:8516:- **What it does**: Modus exposes explicit reinforcement; Public already has the stronger graded FSRS math and `nextReviewDate`, but only exposes `memory_validate(wasUseful)`.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:8535:### Finding 4: `memory_due` is the biggest missing workflow, but it needs a real contract first
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:8542:### Finding 5: Prototype connected-doc hints only as an explanation appendix
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md:8577:Stop external research and convert this into implementation design in this order: `memory_review` API, doctor/debug route-summary surface, ADR for authoritative `memory_due`, then feature-flagged prototypes for connected-doc appendix and weak-result lexical fallback.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:346:      hints.push('Database not connected - restart MCP server');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:449:    hints.push('Database not connected - restart MCP server');
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-020.md:6:**Executive summary:** Borrow **Modus’s operator surfaces**, not its weaker retrieval shortcuts. **Adopt now:** graded `memory_review`, doctor-style summary, and a strict one-retrieval-core rule. **New feature needed:** authoritative `memory_due` and a durable proposal inbox. **Prototype later:** connected-doc appendix, weak-result lexical fallback, and content-level contradiction linting. **Reject:** fuzzy result-cache reuse, permissive markdown ingestion, default write-on-read as policy, and unenforced trust-stage metadata.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-020.md:12:- **What it does**: Modus exposes `memory_reinforce`, but only as a success-only reinforce action. Public already has the stronger primitive: graded FSRS review (`AGAIN/HARD/GOOD/EASY`) plus computed `nextReviewDate`, yet the exposed adjacent tool is only `memory_validate(wasUseful)`, which adjusts confidence rather than recording a real review event.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-020.md:13:- **Why it matters for us**: This closes the clearest control-plane gap without changing retrieval architecture. It also makes any later review queue trustworthy because review history would record hard recalls and lapses, not only “useful / not useful.”
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-020.md:31:### Finding 4: `memory_due` is real product value, but it needs an authoritative due-state contract first
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-020.md:33:- **What it does**: Modus visibly ties search recall, reinforce, decay, and archive to one fact state. Public already stores `stability`, `difficulty`, `last_review`, `review_count`, and opt-in access effects, and computes `nextReviewDate`, but does not expose an operator-facing due queue.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-020.md:47:- **What it does**: Modus builds lightweight subject/entity/tag adjacency and appends connected docs that did not make the main ranked list. The weighting is simple and fixed (`subject 3`, `entity 2`, `tag 1`).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-020.md:139:Turn this synthesis into implementation design: define the Public `memory_review` API first, add a doctor-style formatter over `memory_health`, then write the due-state ADR (`persisted next_review_at` vs deterministic derivation) before scoping `memory_due` and the proposal inbox.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-015.md:72:Investigate a system with a real **due-items scheduler / review queue / approval inbox** so the next pass can determine how Public should surface review-needed, stale, promotion-eligible, and archival-candidate memories without inheriting Modus’s coarse age-based heuristics.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-008.md:29:### Finding 4: Modus’s best retrieval-specific pattern is not its graph model, but its explicit “connected docs not in top hits” appendix
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-008.md:31:- **What it does**: Modus builds cheap adjacency maps over markdown documents only: shared subject gets weight `3.0`, entity `2.0`, tag `1.0`, then `vault_search` appends connected documents that were not already returned. Public’s code-graph and CocoIndex are stronger, but they solve different problems: `code_graph_query/context` answer structural code questions, and CocoIndex is the semantic code-search bridge. Neither is the same as “show me adjacent memory docs I might also want right now.”
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-008.md:32:- **Why it matters for us**: This is additive, not competitive. Public should not replace causal memory or code graph with Modus-style string adjacency, but a small connected-memory appendix for markdown artifacts could improve exploration and follow-on recall without disturbing the existing routing split of memory vs semantic code vs structural code.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-002.md:24:- **What it does**: `vault_write`, `memory_store`, and `ReinforceFact` mutate markdown files directly. But `vault_search`, `vault_connected`, and `memory_search` only read the prebuilt in-memory `Index`, `factStore`, and `crossIndex`. Meanwhile `vault_list` and `memory_facts` rescan disk live, so they can see writes the search path cannot.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-013.md:39:- **Why it matters for us**: This suggests a second major shift: memory should not only help answer questions; it should also expose what work is blocked, what is ready, and what knowledge dependencies remain unresolved. That would pair naturally with the proposal inbox and review queue ideas.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-013.md:78:Investigate a system with an explicit **review queue / due-items scheduler / approval inbox** so the next pass can test whether Public now needs a dedicated triage layer above proposals, decay signals, and mission readiness rather than more retrieval improvements.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-005.md:45:- **What it does**: Modus builds adjacency maps keyed by normalized subject, tag, and entity name, then scores connected docs with fixed weights `subject=3`, `entity=2`, `tag=1`. This is cheap and useful for related-document surfacing. But it is intentionally shallow: no traversal, no causal semantics, and the “scan title/body for entity mentions” comment only checks title and subject in code. Public already has richer graph-aware ranking signals, causal boost, and structural freshness augmentation.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-005.md:82:Trace **agent/tool orchestration and caller contract** next: when Modus expects the client to choose `vault_search` vs `memory_search` vs `vault_connected`, how often searches implicitly mutate memory, and whether the shipped tool surface assumes a prompt-side policy layer to compensate for weak global ranking and LLM-latency tradeoffs.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-018.md:8:### Finding 1: Review queue risk — a Public `memory_due` inbox will be misleading unless it gets a first-class due-state contract
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-018.md:10:- **What it does**: Modus keeps search recall, explicit reinforce, decay, and archive on the same fact fields. Public already persists `access_count`, `last_accessed`, `stability`, `difficulty`, `last_review`, and `review_count`, and `processReview()` computes `nextReviewDate`, but that due date is not persisted and read-time strengthening stays opt-in via `trackAccess=false`.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-018.md:11:- **Why it matters for us**: If Public adds a due/review queue without defining one authoritative source of truth for “due,” the queue can drift from actual search behavior. A memory can look overdue while recent read activity updated its effective retrievability, which would make the inbox feel unreliable.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-018.md:39:- **Why it matters for us**: If Public copies Modus literally, every explicit review starts looking like successful recall. That biases histories upward and makes any later due/review queue less trustworthy because “hard” or failed recall events have no first-class path.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-018.md:68:- Questions answered: the main risks are semantic and operational, not algorithmic. The safest transfers remain a doctor-style summary and an explicit review action, but only if they preserve Public’s existing repair semantics and graded FSRS model. The riskiest transfer is unbounded lexical expansion. Connected-doc hints are safest as explanation, and a review queue needs an explicit due-state contract before it can be trusted.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-018.md:75:Define the mitigation contract: decide whether `memory_due` needs a persisted `next_review_at` field or a deterministic derived rule, constrain lexical-only expansion to weak-result recovery instead of always-on deep mode, and test connected-docs as an appendix/explanation lane rather than a score-bearing retrieval lane.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-012.md:35:### Finding 5: **If we want Modus-style “connected docs” ergonomics, add them as a formatter over existing graph evidence, not as a new index**
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-012.md:37:- **What it does**: Modus appends a lightweight connected-doc block after primary results using fixed subject/entity/tag weights. Public already computes and exposes graph contribution metadata in the pipeline response, but it does not currently turn that into a first-class “you may also want these linked memories” presentation block.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-012.md:71:- Questions addressed: whether Modus’s cache design should influence Public; whether Modus’s query-expansion merge path is architecturally better or worse than Public’s pipeline; whether Modus’s split fact-search surfaces suggest a refactor direction; whether Public’s own FSRS write-back placement should change; whether any part of Modus’s connected-doc UX is worth borrowing without adopting its adjacency index.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-012.md:79:Compare against a system with an explicit **review queue / due-items scheduler** and **approval inbox**, so the next pass can test whether Public’s strongest missing piece is not retrieval anymore, but the operator workflow that sits on top of retrieval, reinforcement, and governance.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-025.md:15:### Finding 1: Rank 1 (20/25) — explicit `memory_review` is the first thing Public should ship
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-025.md:17:- **What it does**: Modus exposes an explicit `memory_reinforce` operator action on top of its FSRS state. Public already has the underlying pieces: graded review math (`AGAIN/HARD/GOOD/EASY`), `processReview()` with `nextReviewDate`, and opt-in strengthening-on-access. The current exposed adjacent surface is `memory_validate`, which records only `wasUseful` feedback and does not let an operator issue a graded FSRS review.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-025.md:18:- **Why it matters for us**: This is the highest impact x feasibility transfer because it closes the clearest control-plane gap without inventing new storage or changing retrieval architecture. It also de-risks the bigger `memory_due` idea: until Public has a first-class graded review action, any future review queue would have no trustworthy way to record hard recalls, lapses, and easy wins distinctly.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-025.md:26:- **What it does**: Modus builds lightweight subject/tag/entity adjacency maps at index time and appends connected documents to search output when they were not already returned by lexical search.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-025.md:27:- **Why it matters**: For compaction recovery, this is the most transferable Modus idea: after we recover the active spec/task, a cheap connected-neighbor pass could widen context without immediately paying for heavier graph or semantic expansion.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-025.md:51:Design a narrow compaction-candidate experiment inside Public’s existing survival stack: add a cheap Modus-style lexical/connected-neighbor preselection lane to `compact-inject` or resume synthesis, but keep `session_bootstrap` / `session_resume` / `memory_context(resume)` as the only authoritative recovery surfaces. In parallel, define an explicit recall-event rule so compaction-injected memories are not auto-strengthened unless they are actually reused.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-025.md:81:`Code_Environment/Public` already has Spec Kit Memory with semantic and hybrid retrieval, markdown-backed memory artifacts, importance tiers, and an FSRS-based classification-decay layer in the MCP server. It does **not** currently mirror Modus Memory's end-to-end local vault server model, BM25 field-boosted lexical search with lightweight query caching, librarian-style synonym expansion for keyword retrieval, or simple subject/tag/entity adjacency maps that surface connected documents directly in result sets. Base the comparison on current code, not stale assumptions.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-025.md:89:5. After FSRS, inspect cross-referencing by reading `external/modus-memory-main/internal/index/crossref.go`. Trace how subject, tag, and entity adjacency maps are built, what weighting is used for connected results, and what the system deliberately does **not** do because it avoids a full graph database.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-025.md:121:10. Which Modus patterns would best improve query-time recall in `Code_Environment/Public`: BM25 field boosts, query caching, lexical expansion, connected-result hints, or simpler markdown-vault ergonomics?
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-025.md:173:- MCP tool handlers that expose search, memory, reinforcement, decay, and connected-doc surfaces
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-025.md:647:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:207:| `vault_connected` | Cross-reference query — find everything linked to a subject, tag, or entity |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-025.md:655:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:287:Documents are connected by shared subjects, tags, and entities. A search for "authentication" returns not just keyword matches, but also:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-025.md:845:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:14://	memory_reinforce, memory_decay_facts, vault_connected
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-025.md:852:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:30:		"vault_connected":   true,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-025.md:900:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:901:	srv.AddTool("vault_connected", "Find all documents connected to a subject, entity, or tag. Returns facts, beliefs, entities, articles, learnings, and missions that share references.", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-025.md:1065:.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:445:  shared_memory_status: getSchema({
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-025.md:1083:.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:493:  shared_memory_status: ['tenantId', 'actorUserId', 'actorAgentId'],
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-025.md:1122:.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:444:  name: 'shared_memory_status',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-025.md:1160:.opencode/skill/system-spec-kit/mcp_server/README.md:924:##### `shared_memory_status`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-025.md:1186:.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:33:type SharedIdentityTool = SharedAdminTool | 'shared_memory_status';
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-025.md:1232:.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:374:  tool: 'shared_space_upsert' | 'shared_space_membership_set' | 'shared_memory_status' | 'shared_memory_enable',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-025.md:1277:.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:756:      tool: 'shared_memory_status',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-025.md:1279:.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:765:      tool: 'shared_memory_status',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-025.md:1283:.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:785:      'shared_memory_status',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-025.md:1504:.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:58:  'shared_memory_status',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-025.md:1508:.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:79:    case 'shared_memory_status':       return handleSharedMemoryStatus(parseArgs<SharedMemoryStatusArgs>(validateToolArgs('shared_memory_status', args)));
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-025.md:2011:.opencode/skill/system-spec-kit/mcp_server/shared-spaces/README.md:42:| `shared_memory_status` | Caller-scoped rollout and membership view; requires exactly one actor identity |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-025.md:2014:.opencode/skill/system-spec-kit/mcp_server/shared-spaces/README.md:50:`shared_memory_status`, `shared_space_upsert`, and `shared_space_membership_set` rely on actor identity validation in `handlers/shared-memory.ts`. Admin mutations compare the caller against the configured shared-memory admin identity before allowing ownership-sensitive changes.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-025.md:2160:.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:397:    for (const toolName of ['shared_space_upsert', 'shared_space_membership_set', 'shared_memory_status']) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-025.md:2169:.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:442:  it('handler requires caller identity for shared_memory_status', async () => {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-025.md:2171:.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:454:  it('runtime accepts shared_memory_status with one actor identity', () => {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-025.md:2172:.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:456:      validateToolArgs('shared_memory_status', {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-025.md:3432:.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:177:      'shared_memory_status',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-025.md:3434:.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:300:      'shared_space_upsert', 'shared_space_membership_set', 'shared_memory_status', 'shared_memory_enable',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-025.md:3438:.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:164:    expect(api.LAYER_DEFINITIONS.L5.tools).toContain('shared_memory_status');
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-025.md:3439:.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:165:    expect(api.TOOL_LAYER_MAP.shared_memory_status).toBe('L5');
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-025.md:3440:.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:166:    expect(api.getLayerForTool('shared_memory_status')).toBe('L5');
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-025.md:3441:.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:167:    expect(api.getLayerTokenBudget('shared_memory_status')).toBe(1000);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-025.md:3444:.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:86:    tools: ['checkpoint_create', 'checkpoint_list', 'checkpoint_restore', 'checkpoint_delete', 'shared_memory_enable', 'shared_memory_status', 'shared_space_upsert', 'shared_space_membership_set']
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-025.md:3599:.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:161:    it('shared_memory_status appears in exactly one layer and is mapped to that layer', () => {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-025.md:3600:.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:162:      const matchingLayers = Object.values(LD).filter((layer) => layer.tools.includes('shared_memory_status'));
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-025.md:3601:.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:166:      expect(mod.TOOL_LAYER_MAP['shared_memory_status']).toBe(matchingLayers[0].id);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-025.md:4503://	memory_reinforce, memory_decay_facts, vault_connected
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-025.md:4519:		"vault_connected":   true,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-025.md:5184:/bin/zsh -lc 'rg -n "shared_space_upsert|shared_space_membership_set|shared_memory_status|assertSharedSpaceAccess|getAllowedSharedSpaceIds|filterRowsByScope|scopeKey|actorUserId|actorAgentId" .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/mcp_server/lib' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-025.md:5188:.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:33:type SharedIdentityTool = SharedAdminTool | 'shared_memory_status';
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-025.md:5200:.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:374:  tool: 'shared_space_upsert' | 'shared_space_membership_set' | 'shared_memory_status' | 'shared_memory_enable',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-025.md:5221:.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:756:      tool: 'shared_memory_status',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-025.md:5225:.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:765:      tool: 'shared_memory_status',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-025.md:5226:.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:785:      'shared_memory_status',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-025.md:5229:.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:86:    tools: ['checkpoint_create', 'checkpoint_list', 'checkpoint_restore', 'checkpoint_delete', 'shared_memory_enable', 'shared_memory_status', 'shared_space_upsert', 'shared_space_membership_set']
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-025.md:6716:  shared_memory_status: getSchema({
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-025.md:7245:    14	//	memory_reinforce, memory_decay_facts, vault_connected
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-025.md:7261:    30			"vault_connected":   true,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-026.md:21:Design a narrow compaction-candidate experiment inside Public’s existing survival stack: add a cheap Modus-style lexical/connected-neighbor preselection lane to `compact-inject` or resume synthesis, but keep `session_bootstrap` / `session_resume` / `memory_context(resume)` as the only authoritative recovery surfaces. In parallel, define an explicit recall-event rule so compaction-injected memories are not auto-strengthened unless they are actually reused.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-026.md:25:### Finding 1: Rank 1 (20/25) — explicit `memory_review` is the first thing Public should ship
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-026.md:27:- **What it does**: Modus exposes an explicit `memory_reinforce` operator action on top of its FSRS state. Public already has the underlying pieces: graded review math (`AGAIN/HARD/GOOD/EASY`), `processReview()` with `nextReviewDate`, and opt-in strengthening-on-access. The current exposed adjacent surface is `memory_validate`, which records only `wasUseful` feedback and does not let an operator issue a graded FSRS review.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-026.md:28:- **Why it matters for us**: This is the highest impact x feasibility transfer because it closes the clearest control-plane gap without inventing new storage or changing retrieval architecture. It also de-risks the bigger `memory_due` idea: until Public has a first-class graded review action, any future review queue would have no trustworthy way to record hard recalls, lapses, and easy wins distinctly.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-026.md:36:- **What it does**: Modus builds lightweight subject/tag/entity adjacency maps at index time and appends connected documents to search output when they were not already returned by lexical search.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-026.md:37:- **Why it matters**: For compaction recovery, this is the most transferable Modus idea: after we recover the active spec/task, a cheap connected-neighbor pass could widen context without immediately paying for heavier graph or semantic expansion.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-026.md:81:`Code_Environment/Public` already has Spec Kit Memory with semantic and hybrid retrieval, markdown-backed memory artifacts, importance tiers, and an FSRS-based classification-decay layer in the MCP server. It does **not** currently mirror Modus Memory's end-to-end local vault server model, BM25 field-boosted lexical search with lightweight query caching, librarian-style synonym expansion for keyword retrieval, or simple subject/tag/entity adjacency maps that surface connected documents directly in result sets. Base the comparison on current code, not stale assumptions.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-026.md:89:5. After FSRS, inspect cross-referencing by reading `external/modus-memory-main/internal/index/crossref.go`. Trace how subject, tag, and entity adjacency maps are built, what weighting is used for connected results, and what the system deliberately does **not** do because it avoids a full graph database.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-026.md:121:10. Which Modus patterns would best improve query-time recall in `Code_Environment/Public`: BM25 field boosts, query caching, lexical expansion, connected-result hints, or simpler markdown-vault ergonomics?
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-026.md:173:- MCP tool handlers that expose search, memory, reinforcement, decay, and connected-doc surfaces
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-026.md:2019:    13	// This is Option A from the knowledge graph discussion: connected search results
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-026.md:2023:    17	// DocRef is a lightweight reference to a connected document.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-026.md:2034:    28		bySubject map[string][]DocRef // lowercase subject → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-026.md:2035:    29		byTag     map[string][]DocRef // tag → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-026.md:2036:    30		byEntity  map[string][]DocRef // entity name → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-026.md:2121:   115	// ForSubject returns all documents connected to a subject (case-insensitive).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-026.md:2147:   141	// ForEntity returns all documents connected to an entity.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-026.md:2254:   248	// FormatConnected returns a human-readable string of connected documents.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-026.md:2573:.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:425: * @returns True if the memory_fts table exists in the connected database.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-026.md:3417:    75			// Append cross-reference hints — show connected docs the agent might want
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-026.md:3433:    91						sb.WriteString("**Cross-references** (connected docs not in results above):\n")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-026.md:3800:    34	 * highly connected knowledge is more reliably accessible over time.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-026.md:3922:    70	  nextReviewDate: string;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-026.md:4059:   207	  const nextReviewDate = getNextReviewDate(newStability);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-026.md:4066:   214	    nextReviewDate,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-026.md:5952:   207	| `vault_connected` | Cross-reference query — find everything linked to a subject, tag, or entity |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:9:### Finding 1: Review queue risk — a Public `memory_due` inbox will be misleading unless it gets a first-class due-state contract
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:11:- **What it does**: Modus keeps search recall, explicit reinforce, decay, and archive on the same fact fields. Public already persists `access_count`, `last_accessed`, `stability`, `difficulty`, `last_review`, and `review_count`, and `processReview()` computes `nextReviewDate`, but that due date is not persisted and read-time strengthening stays opt-in via `trackAccess=false`.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:12:- **Why it matters for us**: If Public adds a due/review queue without defining one authoritative source of truth for “due,” the queue can drift from actual search behavior. A memory can look overdue while recent read activity updated its effective retrievability, which would make the inbox feel unreliable.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:30:### Finding 1: Rank 1 (20/25) — explicit `memory_review` is the first thing Public should ship
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:32:- **What it does**: Modus exposes an explicit `memory_reinforce` operator action on top of its FSRS state. Public already has the underlying pieces: graded review math (`AGAIN/HARD/GOOD/EASY`), `processReview()` with `nextReviewDate`, and opt-in strengthening-on-access. The current exposed adjacent surface is `memory_validate`, which records only `wasUseful` feedback and does not let an operator issue a graded FSRS review.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:33:- **Why it matters for us**: This is the highest impact x feasibility transfer because it closes the clearest control-plane gap without inventing new storage or changing retrieval architecture. It also de-risks the bigger `memory_due` idea: until Public has a first-class graded review action, any future review queue would have no trustworthy way to record hard recalls, lapses, and easy wins distinctly.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:43:- **Why it matters**: This is the clearest thing Modus contributes that the other four phases do not. It makes `memory_review` the strongest immediate Modus-derived transfer, and it makes `memory_due` the next gated feature after the review contract is real.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:49:- **What it does**: Modus builds subject/entity/tag adjacency in memory, scores it with fixed weights (`3/2/1`), and returns it as connected material beside the main result set instead of pretending it is a full causal graph.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:66:Turn the converged adopt-now set into one cross-phase implementation tranche: exact-key recall, doctor summary, compaction-time checkpoint, bootstrap memory hints, and static markdown integrity. After that, open a second design tranche for `memory_review`, `memory_due`, and a durable proposal inbox so the strongest Modus-specific ideas land behind an explicit control-plane contract.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:96:`Code_Environment/Public` already has Spec Kit Memory with semantic and hybrid retrieval, markdown-backed memory artifacts, importance tiers, and an FSRS-based classification-decay layer in the MCP server. It does **not** currently mirror Modus Memory's end-to-end local vault server model, BM25 field-boosted lexical search with lightweight query caching, librarian-style synonym expansion for keyword retrieval, or simple subject/tag/entity adjacency maps that surface connected documents directly in result sets. Base the comparison on current code, not stale assumptions.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:104:5. After FSRS, inspect cross-referencing by reading `external/modus-memory-main/internal/index/crossref.go`. Trace how subject, tag, and entity adjacency maps are built, what weighting is used for connected results, and what the system deliberately does **not** do because it avoids a full graph database.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:136:10. Which Modus patterns would best improve query-time recall in `Code_Environment/Public`: BM25 field boosts, query caching, lexical expansion, connected-result hints, or simpler markdown-vault ergonomics?
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:188:- MCP tool handlers that expose search, memory, reinforcement, decay, and connected-doc surfaces
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:277:/bin/zsh -lc 'rg -n "memory_review|doctor|executePipeline|memory_search|memory-crud-health|tool-schemas|fsrs-scheduler|modu[s]?" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:279:157:- rollout_summaries/2026-04-09T10-35-53-UGDf-009_post_save_render_fixes_memory_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T12-35-53-019d71d0-0ec5-7c80-a08b-6d336ee5c639.jsonl, updated_at=2026-04-09T12:01:25+00:00, thread_id=019d71d0-0ec5-7c80-a08b-6d336ee5c639)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:296:1869:- rollout_summaries/2026-03-13T11-01-44-IBXE-outsourced_agent_memory_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/13/rollout-2026-03-13T12-01-44-019ce6dc-0509-7630-9874-db11f57a9e06.jsonl, updated_at=2026-03-13T11:21:38+00:00, thread_id=019ce6dc-0509-7630-9874-db11f57a9e06)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:369:I’ve got the phase folder and prior memory hit that points to recent `memory_review` work, which is useful because one of the blueprints almost certainly needs to land cleanly on that newer control-plane surface. Next I’m reading the exact runtime files and the latest phase notes so the blueprint can reference real handler boundaries instead of generic suggestions.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:380:- rollout_summaries/2026-04-09T10-35-53-UGDf-009_post_save_render_fixes_memory_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T12-35-53-019d71d0-0ec5-7c80-a08b-6d336ee5c639.jsonl, updated_at=2026-04-09T12:01:25+00:00, thread_id=019d71d0-0ec5-7c80-a08b-6d336ee5c639)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:624:### Finding 1: Review queue risk — a Public `memory_due` inbox will be misleading unless it gets a first-class due-state contract
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:626:- **What it does**: Modus keeps search recall, explicit reinforce, decay, and archive on the same fact fields. Public already persists `access_count`, `last_accessed`, `stability`, `difficulty`, `last_review`, and `review_count`, and `processReview()` computes `nextReviewDate`, but that due date is not persisted and read-time strengthening stays opt-in via `trackAccess=false`.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:627:- **Why it matters for us**: If Public adds a due/review queue without defining one authoritative source of truth for “due,” the queue can drift from actual search behavior. A memory can look overdue while recent read activity updated its effective retrievability, which would make the inbox feel unreliable.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:645:### Finding 1: Rank 1 (20/25) — explicit `memory_review` is the first thing Public should ship
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:647:- **What it does**: Modus exposes an explicit `memory_reinforce` operator action on top of its FSRS state. Public already has the underlying pieces: graded review math (`AGAIN/HARD/GOOD/EASY`), `processReview()` with `nextReviewDate`, and opt-in strengthening-on-access. The current exposed adjacent surface is `memory_validate`, which records only `wasUseful` feedback and does not let an operator issue a graded FSRS review.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:648:- **Why it matters for us**: This is the highest impact x feasibility transfer because it closes the clearest control-plane gap without inventing new storage or changing retrieval architecture. It also de-risks the bigger `memory_due` idea: until Public has a first-class graded review action, any future review queue would have no trustworthy way to record hard recalls, lapses, and easy wins distinctly.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:652:### Finding 2: Rank 2 (15/25, tie-broken ahead) — a doctor-style summary should ship in the same tranche as `memory_review`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:655:- **Why it matters for us**: This is nearly pure formatter work and improves operator trust immediately. It ranks ahead of `memory_due` despite lower raw strategic upside because it is safer, independent, and can ship without any FSRS contract decisions.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:659:### Finding 3: Rank 3 (15/25, tie-broken behind) — `memory_due` is the biggest strategic win, but only after a due-state contract is fixed
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:661:- **What it does**: Modus exposes the full review lifecycle visibly: search recall, explicit reinforce, decay, and archive all operate over the same fact state. Public already stores `stability`, `difficulty`, `last_review`, `review_count`, and `last_accessed`, and `processReview()` computes `nextReviewDate`, but no persisted `next_review_at` column exists and write-on-read remains opt-in through `trackAccess=false`.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:668:- **What it does**: Modus exposes `memory_reinforce`, but only as a success-only reinforce action. Public already has the stronger primitive: graded FSRS review (`AGAIN/HARD/GOOD/EASY`) plus computed `nextReviewDate`, yet the exposed adjacent tool is only `memory_validate(wasUseful)`, which adjusts confidence rather than recording a real review event.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:669:- **Why it matters for us**: This closes the clearest control-plane gap without changing retrieval architecture. It also makes any later review queue trustworthy because review history would record hard recalls and lapses, not only “useful / not useful.”
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:714:`Code_Environment/Public` already has Spec Kit Memory with semantic and hybrid retrieval, markdown-backed memory artifacts, importance tiers, and an FSRS-based classification-decay layer in the MCP server. It does **not** currently mirror Modus Memory's end-to-end local vault server model, BM25 field-boosted lexical search with lightweight query caching, librarian-style synonym expansion for keyword retrieval, or simple subject/tag/entity adjacency maps that surface connected documents directly in result sets. Base the comparison on current code, not stale assumptions.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:722:5. After FSRS, inspect cross-referencing by reading `external/modus-memory-main/internal/index/crossref.go`. Trace how subject, tag, and entity adjacency maps are built, what weighting is used for connected results, and what the system deliberately does **not** do because it avoids a full graph database.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:754:10. Which Modus patterns would best improve query-time recall in `Code_Environment/Public`: BM25 field boosts, query caching, lexical expansion, connected-result hints, or simpler markdown-vault ergonomics?
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:806:- MCP tool handlers that expose search, memory, reinforcement, decay, and connected-doc surfaces
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:839:The shape is tightening up: the likely blueprint set is `memory_review`, a doctor-style summary over existing health machinery, and a “one retrieval core” wrapper pattern so new surfaces do not fork ranking logic. I’m validating that against the current TypeScript handlers and schemas now, including whether any `memory_review` work already landed yesterday so I can build on current reality instead of duplicating it.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:994:      hints.push('Database not connected - restart MCP server');
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:1097:    hints.push('Database not connected - restart MCP server');
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:1323:  nextReviewDate: string;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:1460:  const nextReviewDate = getNextReviewDate(newStability);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:1467:    nextReviewDate,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:1556:/bin/zsh -lc "rg -n \"memory_review|memoryReview|processReview\\(|ReviewGrade|AGAIN|HARD|GOOD|EASY|trackAccess|nextReviewDate|executePipeline|memory_health|doctor|health\" .opencode/skill/system-spec-kit/mcp_server -g '"'!**/*.map'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:1774:.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:294:      const nextReviewDate = fsrsScheduler.getNextReviewDate(5);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:1775:.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:295:      expect(Number.isNaN(new Date(nextReviewDate).getTime())).toBe(false);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:1789:.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:207:    expect(result).toHaveProperty('nextReviewDate');
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:1801:.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:249:  it('D-08: nextReviewDate is valid future date', () => {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:1803:.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:251:    const nextDate = new Date(result.nextReviewDate);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:1970:.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:70:  nextReviewDate: string;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:1978:.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:207:  const nextReviewDate = getNextReviewDate(newStability);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:1979:.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:214:    nextReviewDate,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:1991:.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:316:// result = { stability, difficulty, lastReview, reviewCount, nextReviewDate, retrievability }
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:1999:.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:186:        nextReviewDate: new Date().toISOString(),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:3451:**Executive summary:** Borrow **Modus’s operator surfaces**, not its weaker retrieval shortcuts. **Adopt now:** graded `memory_review`, doctor-style summary, and a strict one-retrieval-core rule. **New feature needed:** authoritative `memory_due` and a durable proposal inbox. **Prototype later:** connected-doc appendix, weak-result lexical fallback, and content-level contradiction linting. **Reject:** fuzzy result-cache reuse, permissive markdown ingestion, default write-on-read as policy, and unenforced trust-stage metadata.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:3457:- **What it does**: Modus exposes `memory_reinforce`, but only as a success-only reinforce action. Public already has the stronger primitive: graded FSRS review (`AGAIN/HARD/GOOD/EASY`) plus computed `nextReviewDate`, yet the exposed adjacent tool is only `memory_validate(wasUseful)`, which adjusts confidence rather than recording a real review event.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:3458:- **Why it matters for us**: This closes the clearest control-plane gap without changing retrieval architecture. It also makes any later review queue trustworthy because review history would record hard recalls and lapses, not only “useful / not useful.”
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:3476:### Finding 4: `memory_due` is real product value, but it needs an authoritative due-state contract first
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:3478:- **What it does**: Modus visibly ties search recall, reinforce, decay, and archive to one fact state. Public already stores `stability`, `difficulty`, `last_review`, `review_count`, and opt-in access effects, and computes `nextReviewDate`, but does not expose an operator-facing due queue.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:3492:- **What it does**: Modus builds lightweight subject/entity/tag adjacency and appends connected docs that did not make the main ranked list. The weighting is simple and fixed (`subject 3`, `entity 2`, `tag 1`).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:3584:Turn this synthesis into implementation design: define the Public `memory_review` API first, add a doctor-style formatter over `memory_health`, then write the due-state ADR (`persisted next_review_at` vs deterministic derivation) before scoping `memory_due` and the proposal inbox.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:3893://	memory_reinforce, memory_decay_facts, vault_connected
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:3909:		"vault_connected":   true,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:3962:	srv.AddTool("vault_connected", "Find all documents connected to a subject, entity, or tag. Returns facts, beliefs, entities, articles, learnings, and missions that share references.", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:5224:   157	- rollout_summaries/2026-04-09T10-35-53-UGDf-009_post_save_render_fixes_memory_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T12-35-53-019d71d0-0ec5-7c80-a08b-6d336ee5c639.jsonl, updated_at=2026-04-09T12:01:25+00:00, thread_id=019d71d0-0ec5-7c80-a08b-6d336ee5c639)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:5238:### Finding 1: Ship first-class graded `memory_review`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:5262:4. Keep `nextReviewDate` response-only in tranche 1. Do not add `next_review_at` yet; that belongs to the later due-state ADR.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:5305:- **Why it matters**: Public is already close to this. A small hardening pass now prevents future `memory_due`, appendix, or exact-key surfaces from drifting into parallel ranking behavior.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:5339:Implement blueprint 1 first in a write-enabled pass, then add `memory_health({ reportMode: "doctor" })`, then do the retrieval-core extraction before starting the separate `memory_due` ADR.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:5352:### Finding 1: Ship first-class graded `memory_review`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:5376:4. Keep `nextReviewDate` response-only in tranche 1. Do not add `next_review_at` yet; that belongs to the later due-state ADR.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:5419:- **Why it matters**: Public is already close to this. A small hardening pass now prevents future `memory_due`, appendix, or exact-key surfaces from drifting into parallel ranking behavior.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:5453:Implement blueprint 1 first in a write-enabled pass, then add `memory_health({ reportMode: "doctor" })`, then do the retrieval-core extraction before starting the separate `memory_due` ADR.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-001.md:28:`Code_Environment/Public` already has Spec Kit Memory with semantic and hybrid retrieval, markdown-backed memory artifacts, importance tiers, and an FSRS-based classification-decay layer in the MCP server. It does **not** currently mirror Modus Memory's end-to-end local vault server model, BM25 field-boosted lexical search with lightweight query caching, librarian-style synonym expansion for keyword retrieval, or simple subject/tag/entity adjacency maps that surface connected documents directly in result sets. Base the comparison on current code, not stale assumptions.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-001.md:36:5. After FSRS, inspect cross-referencing by reading `external/modus-memory-main/internal/index/crossref.go`. Trace how subject, tag, and entity adjacency maps are built, what weighting is used for connected results, and what the system deliberately does **not** do because it avoids a full graph database.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-001.md:68:10. Which Modus patterns would best improve query-time recall in `Code_Environment/Public`: BM25 field boosts, query caching, lexical expansion, connected-result hints, or simpler markdown-vault ergonomics?
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-001.md:120:- MCP tool handlers that expose search, memory, reinforcement, decay, and connected-doc surfaces
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-001.md:2798:    13	// This is Option A from the knowledge graph discussion: connected search results
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-001.md:2802:    17	// DocRef is a lightweight reference to a connected document.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-001.md:2813:    28		bySubject map[string][]DocRef // lowercase subject → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-001.md:2814:    29		byTag     map[string][]DocRef // tag → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-001.md:2815:    30		byEntity  map[string][]DocRef // entity name → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-001.md:2900:   115	// ForSubject returns all documents connected to a subject (case-insensitive).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-001.md:2926:   141	// ForEntity returns all documents connected to an entity.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-001.md:3033:   248	// FormatConnected returns a human-readable string of connected documents.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-001.md:3340:    14	//	memory_reinforce, memory_decay_facts, vault_connected
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-001.md:3356:    30			"vault_connected":   true,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-001.md:3578:| `vault_connected` | Cross-reference query — find everything linked to a subject, tag, or entity |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-001.md:3682:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:901:	srv.AddTool("vault_connected", "Find all documents connected to a subject, entity, or tag. Returns facts, beliefs, entities, articles, learnings, and missions that share references.", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-001.md:3892:    34	 * highly connected knowledge is more reliably accessible over time.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-001.md:4014:    70	  nextReviewDate: string;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-001.md:4151:   207	  const nextReviewDate = getNextReviewDate(newStability);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-001.md:4158:   214	    nextReviewDate,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-001.md:5431:    75			// Append cross-reference hints — show connected docs the agent might want
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-001.md:5447:    91						sb.WriteString("**Cross-references** (connected docs not in results above):\n")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-001.md:5973:/bin/zsh -lc "rg -n \"with 11 memory tools|CrossRefStats|FactCount|Build\\(|RegisterMemoryTools|vault_connected|memory_search|memory_reinforce|memory_decay_facts\" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-001.md:5977:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:14://	memory_reinforce, memory_decay_facts, vault_connected
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-001.md:5982:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:30:		"vault_connected":   true,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-001.md:5987:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:901:	srv.AddTool("vault_connected", "Find all documents connected to a subject, entity, or tag. Returns facts, beliefs, entities, articles, learnings, and missions that share references.", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-001.md:6050:- **Cross-reference hints** — search results include connected documents from other categories
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-001.md:6070:Documents are connected by shared subjects, tags, and entities. A search for "authentication" returns not just keyword matches, but also:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-001.md:6710:/bin/zsh -lc 'rg -n "TrackAccess|trackAccess|calculateRetrievability|applyClassificationDecay|applyHybridDecayPolicy|reviewCount|nextReviewDate" .opencode/skill/system-spec-kit/mcp_server' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-001.md:6913:.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:316:// result = { stability, difficulty, lastReview, reviewCount, nextReviewDate, retrievability }
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-001.md:6921:.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:186:        nextReviewDate: new Date().toISOString(),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-001.md:6927:.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:70:  nextReviewDate: string;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-001.md:6931:.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:207:  const nextReviewDate = getNextReviewDate(newStability);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-001.md:6933:.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:214:    nextReviewDate,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-001.md:6951:.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:292:      const nextReviewDate = fsrsScheduler.getNextReviewDate(5);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-001.md:6952:.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:293:      expect(Number.isNaN(new Date(nextReviewDate).getTime())).toBe(false);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-001.md:6960:.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:207:    expect(result).toHaveProperty('nextReviewDate');
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-001.md:6967:.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:249:  it('D-08: nextReviewDate is valid future date', () => {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-001.md:6968:.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:251:    const nextDate = new Date(result.nextReviewDate);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-001.md:7939:- **What it does**: Modus builds three adjacency maps (`bySubject`, `byTag`, `byEntity`), scores connected docs with fixed weights (subject `3.0`, entity `2.0`, tag `1.0`), and appends connected-doc hints to search responses. The “second pass” only checks title and subject for entity mentions even though the comments imply broader body linkage.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-001.md:7940:- **Why it matters for us**: This is weaker than our causal/code-graph style signal layers, but it is much easier to expose to users as understandable “connected docs” rather than invisible score boosts.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-001.md:8034:- **What it does**: Modus builds three adjacency maps (`bySubject`, `byTag`, `byEntity`), scores connected docs with fixed weights (subject `3.0`, entity `2.0`, tag `1.0`), and appends connected-doc hints to search responses. The “second pass” only checks title and subject for entity mentions even though the comments imply broader body linkage.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-001.md:8035:- **Why it matters for us**: This is weaker than our causal/code-graph style signal layers, but it is much easier to expose to users as understandable “connected docs” rather than invisible score boosts.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-027.md:11:### Finding 1: Rank 1 (20/25) — explicit `memory_review` is the first thing Public should ship
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-027.md:13:- **What it does**: Modus exposes an explicit `memory_reinforce` operator action on top of its FSRS state. Public already has the underlying pieces: graded review math (`AGAIN/HARD/GOOD/EASY`), `processReview()` with `nextReviewDate`, and opt-in strengthening-on-access. The current exposed adjacent surface is `memory_validate`, which records only `wasUseful` feedback and does not let an operator issue a graded FSRS review.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-027.md:14:- **Why it matters for us**: This is the highest impact x feasibility transfer because it closes the clearest control-plane gap without inventing new storage or changing retrieval architecture. It also de-risks the bigger `memory_due` idea: until Public has a first-class graded review action, any future review queue would have no trustworthy way to record hard recalls, lapses, and easy wins distinctly.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-027.md:22:- **What it does**: Modus builds lightweight subject/tag/entity adjacency maps at index time and appends connected documents to search output when they were not already returned by lexical search.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-027.md:23:- **Why it matters**: For compaction recovery, this is the most transferable Modus idea: after we recover the active spec/task, a cheap connected-neighbor pass could widen context without immediately paying for heavier graph or semantic expansion.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-027.md:98:`Code_Environment/Public` already has Spec Kit Memory with semantic and hybrid retrieval, markdown-backed memory artifacts, importance tiers, and an FSRS-based classification-decay layer in the MCP server. It does **not** currently mirror Modus Memory's end-to-end local vault server model, BM25 field-boosted lexical search with lightweight query caching, librarian-style synonym expansion for keyword retrieval, or simple subject/tag/entity adjacency maps that surface connected documents directly in result sets. Base the comparison on current code, not stale assumptions.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-027.md:106:5. After FSRS, inspect cross-referencing by reading `external/modus-memory-main/internal/index/crossref.go`. Trace how subject, tag, and entity adjacency maps are built, what weighting is used for connected results, and what the system deliberately does **not** do because it avoids a full graph database.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-027.md:138:10. Which Modus patterns would best improve query-time recall in `Code_Environment/Public`: BM25 field boosts, query caching, lexical expansion, connected-result hints, or simpler markdown-vault ergonomics?
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-027.md:190:- MCP tool handlers that expose search, memory, reinforcement, decay, and connected-doc surfaces
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-027.md:1028:/bin/zsh -lc 'rg -n "subject|tag|entity|adjacen|cross|connected|related|weight" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/writer.go' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-027.md:1038:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go:13:// This is Option A from the knowledge graph discussion: connected search results
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-027.md:1040:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go:17:// DocRef is a lightweight reference to a connected document.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-027.md:1044:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go:28:	bySubject map[string][]DocRef // lowercase subject → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-027.md:1045:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go:29:	byTag     map[string][]DocRef // tag → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-027.md:1046:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go:30:	byEntity  map[string][]DocRef // entity name → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-027.md:1072:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go:115:// ForSubject returns all documents connected to a subject (case-insensitive).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-027.md:1078:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go:141:// ForEntity returns all documents connected to an entity.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-027.md:1092:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go:248:// FormatConnected returns a human-readable string of connected documents.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-027.md:1221:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:14://	memory_reinforce, memory_decay_facts, vault_connected
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-027.md:1231:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:30:		"vault_connected":   true,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-027.md:1266:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:207:| `vault_connected` | Cross-reference query — find everything linked to a subject, tag, or entity |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-027.md:1274:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:267:- **Cross-reference hints** — search results include connected documents from other categories
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-027.md:1279:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:287:Documents are connected by shared subjects, tags, and entities. A search for "authentication" returns not just keyword matches, but also:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-027.md:1387:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:901:	srv.AddTool("vault_connected", "Find all documents connected to a subject, entity, or tag. Returns facts, beliefs, entities, articles, learnings, and missions that share references.", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-027.md:1392:The first pass confirms a few promising DX areas already: Modus exposes explicit operational tools like `vault_status`, `memory_reinforce`, and `vault_connected`, and its search path logs its routing decisions. I’m now reading the exact implementations and doing one semantic search pass for setup/debug/status surfaces so the DX findings stay grounded in code rather than just retrieval internals.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-027.md:2973:    13	// This is Option A from the knowledge graph discussion: connected search results
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-027.md:2977:    17	// DocRef is a lightweight reference to a connected document.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-027.md:2988:    28		bySubject map[string][]DocRef // lowercase subject → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-027.md:2989:    29		byTag     map[string][]DocRef // tag → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-027.md:2990:    30		byEntity  map[string][]DocRef // entity name → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-027.md:3075:   115	// ForSubject returns all documents connected to a subject (case-insensitive).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-027.md:3101:   141	// ForEntity returns all documents connected to an entity.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-027.md:3208:   248	// FormatConnected returns a human-readable string of connected documents.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-027.md:3513:    14	//	memory_reinforce, memory_decay_facts, vault_connected
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-027.md:3529:    30			"vault_connected":   true,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-027.md:3617:    75			// Append cross-reference hints — show connected docs the agent might want
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-027.md:3633:    91						sb.WriteString("**Cross-references** (connected docs not in results above):\n")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-027.md:4443:   901		srv.AddTool("vault_connected", "Find all documents connected to a subject, entity, or tag. Returns facts, beliefs, entities, articles, learnings, and missions that share references.", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-027.md:4913:    70	  nextReviewDate: string;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-027.md:5050:   207	  const nextReviewDate = getNextReviewDate(newStability);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-027.md:5057:   214	    nextReviewDate,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-027.md:5388:    34	 * highly connected knowledge is more reliably accessible over time.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-027.md:5929:   207	| `vault_connected` | Cross-reference query — find everything linked to a subject, tag, or entity |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-027.md:6058:- **What it does**: Modus exposes `vault_status` and `vault_connected` directly in the MCP surface. Public already computes useful diagnostics like `lexicalPath` and `fallbackState`, but those mostly appear as logs or response metadata rather than as an operator-first debugging surface.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-027.md:6060:- **Recommendation**: **adopt now**. Add a dedicated `memory_status` or `memory_debug_search` surface that reports embedding readiness, lexical capability, cache path, intent route, graph contribution, and fail-open reasons in one place.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-027.md:6097:Run the next iteration on **operator workflow design**: map Public’s existing internals into a compact DX control plane with 3 concrete candidates only, `memory_status`, `memory_debug_search`, and `memory_review`, then judge whether each should be a new tool, a `profile:"debug"` response, or a wrapper around existing tools.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-027.md:6117:- **What it does**: Modus exposes `vault_status` and `vault_connected` directly in the MCP surface. Public already computes useful diagnostics like `lexicalPath` and `fallbackState`, but those mostly appear as logs or response metadata rather than as an operator-first debugging surface.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-027.md:6119:- **Recommendation**: **adopt now**. Add a dedicated `memory_status` or `memory_debug_search` surface that reports embedding readiness, lexical capability, cache path, intent route, graph contribution, and fail-open reasons in one place.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-027.md:6156:Run the next iteration on **operator workflow design**: map Public’s existing internals into a compact DX control plane with 3 concrete candidates only, `memory_status`, `memory_debug_search`, and `memory_review`, then judge whether each should be a new tool, a `profile:"debug"` response, or a wrapper around existing tools.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-019.md:8:### Finding 1: Rank 1 (20/25) — explicit `memory_review` is the first thing Public should ship
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-019.md:10:- **What it does**: Modus exposes an explicit `memory_reinforce` operator action on top of its FSRS state. Public already has the underlying pieces: graded review math (`AGAIN/HARD/GOOD/EASY`), `processReview()` with `nextReviewDate`, and opt-in strengthening-on-access. The current exposed adjacent surface is `memory_validate`, which records only `wasUseful` feedback and does not let an operator issue a graded FSRS review.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-019.md:11:- **Why it matters for us**: This is the highest impact x feasibility transfer because it closes the clearest control-plane gap without inventing new storage or changing retrieval architecture. It also de-risks the bigger `memory_due` idea: until Public has a first-class graded review action, any future review queue would have no trustworthy way to record hard recalls, lapses, and easy wins distinctly.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-019.md:15:### Finding 2: Rank 2 (15/25, tie-broken ahead) — a doctor-style summary should ship in the same tranche as `memory_review`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-019.md:18:- **Why it matters for us**: This is nearly pure formatter work and improves operator trust immediately. It ranks ahead of `memory_due` despite lower raw strategic upside because it is safer, independent, and can ship without any FSRS contract decisions.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-019.md:22:### Finding 3: Rank 3 (15/25, tie-broken behind) — `memory_due` is the biggest strategic win, but only after a due-state contract is fixed
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-019.md:24:- **What it does**: Modus exposes the full review lifecycle visibly: search recall, explicit reinforce, decay, and archive all operate over the same fact state. Public already stores `stability`, `difficulty`, `last_review`, `review_count`, and `last_accessed`, and `processReview()` computes `nextReviewDate`, but no persisted `next_review_at` column exists and write-on-read remains opt-in through `trackAccess=false`.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-019.md:29:### Finding 4: Rank 4 (9/25) — connected-doc hints are worth prototyping only as an explanation lane
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-019.md:31:- **What it does**: Modus builds a lightweight adjacency layer from subject/tag/entity overlap and appends “connected docs not in results above” as an extra hint surface. Public already has stronger graph-backed enrichment via causal boosts, neighbor injection, and co-activation, but not a simple metadata-derived explanation appendix.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-019.md:45:- **What it does**: The ranking resolves into a four-phase roadmap: **Phase 1** ship `memory_review` plus a doctor-style summary; **Phase 2** define the authoritative due-state contract and then add `memory_due`; **Phase 3** pilot connected-doc explanations as a non-scoring appendix; **Phase 4** run a feature-flagged lexical-expansion experiment only on weak-result fallback paths.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-019.md:76:- Questions addressed: which candidate should ship first; how to break the tie between high-impact and low-risk candidates; whether `memory_due` is blocked by missing persisted due-state; whether connected-docs and lexical expansion belong on the mainline roadmap or only in prototype lanes.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-019.md:77:- Questions answered: the correct roadmap is **not** “build the biggest feature first.” Public should ship **`memory_review` first**, pair it with a **doctor-style summary**, then formalize the due-state contract before building **`memory_due`**. Connected-doc hints are worth testing only as explanation, and lexical expansion should be the final, tightly bounded experiment.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-019.md:84:Finalize iteration 020 as a closing synthesis: specify the Public API shape for `memory_review` and `memory_due`, decide whether due state is persisted or derived, and define success metrics for the two later prototypes (connected-doc appendix and weak-result lexical fallback).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-016.md:10:- **What it does**: Startup logs `index build failed` and claims it can continue, but `main.go` still calls `idx.DocCount()` even when `index.Build()` returned `nil, err`. The MCP layer also assumes an index exists: `memory_search` calls `v.Index.SearchFacts(...)` directly, while only the lower-level `Vault.SearchFacts()` method contains a no-index fallback. `vault_connected` also just returns `"Index not loaded."` rather than recovering.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-011.md:80:Investigate a system with an explicit **review queue / due-items workflow** and **operator approval inbox**, so the next pass can test whether these new feature ideas need active scheduling and triage primitives, not just storage and mutation rules.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-007.md:11:- **Why it matters for us**: The useful idea here is **write mediation**, not Modus’s implementation. In source, “single writer” is a prompt convention, so any connected client can mutate persistent state directly. Public already has the harder part: actual scope/governance enforcement.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-017.md:8:### Finding 1: **Medium integration** — operator-visible review queue is the highest-value Modus pattern
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-017.md:10:- **What it does**: Modus makes the full decay loop visible: `memory_search` reinforces recalled facts, `memory_decay_facts` runs the sweep, `memory_archive_stale` archives low-confidence facts, `memory_reinforce` lets an operator review a fact directly, and result formatting exposes tier/staleness cues. Public already has the harder backend pieces: FSRS columns in `memory_index`, canonical review math, strengthening-on-access, and archival machinery. The missing piece is a first-class due/review queue.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-017.md:29:### Finding 4: **Medium integration** — connected-doc hints are feasible, but should stay explanatory first
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-017.md:31:- **What it does**: Modus builds an in-memory metadata adjacency map from subject/tag/entity overlap, weights subject/entity/tag at `3/2/1`, and appends “connected” documents that were not in the main ranked set. Public already has stronger structural enrichment—causal-neighbor boost, neighbor injection, and co-activation spreading—but those are graph-driven, not simple frontmatter co-membership summaries.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-017.md:38:- **What it does**: Modus exposes both automatic reinforcement on recall and an explicit `memory_reinforce` tool. Public already has the underlying grade model (`AGAIN/HARD/GOOD/EASY`), review processing, and strengthening-on-access logic, but keeps write-back behind `trackAccess=false` and has no first-class `memory_reinforce`/`memory_review` tool in the current schema set.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-017.md:75:- **Questions addressed**: which Modus ideas already have insertion points in Public; whether the missing work is backend math or operator surface; which candidates are low/medium integration versus truly invasive; whether connected-result hints overlap with Public graph features; whether librarian expansion is still meaningful given Public deep-mode reformulation.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-017.md:76:- **Questions answered**: the best Modus transfers are mostly **control-plane additions**. Public already has stronger FSRS storage, lexical lanes, repair flows, and graph enrichment than Modus; the main feasible gains are a **review queue**, an **explicit review action**, and a **doctor-style summary**, with lexical expansion and connected-doc hints as bounded prototypes rather than architectural changes.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-017.md:83:Evaluate a concrete Public design for `memory_due` + `memory_review`: one tool that lists due/stale/promotion-eligible/archival-candidate memories, and one tool that applies graded FSRS review updates explicitly, then compare whether a metadata-based “connected docs” appendix improves operator trust beyond current causal/contiguity enrichment.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:8:### Finding 1: Review queue risk — a Public `memory_due` inbox will be misleading unless it gets a first-class due-state contract
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:10:- **What it does**: Modus keeps search recall, explicit reinforce, decay, and archive on the same fact fields. Public already persists `access_count`, `last_accessed`, `stability`, `difficulty`, `last_review`, and `review_count`, and `processReview()` computes `nextReviewDate`, but that due date is not persisted and read-time strengthening stays opt-in via `trackAccess=false`.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:11:- **Why it matters for us**: If Public adds a due/review queue without defining one authoritative source of truth for “due,” the queue can drift from actual search behavior. A memory can look overdue while recent read activity updated its effective retrievability, which would make the inbox feel unreliable.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:29:### Finding 1: Rank 1 (20/25) — explicit `memory_review` is the first thing Public should ship
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:31:- **What it does**: Modus exposes an explicit `memory_reinforce` operator action on top of its FSRS state. Public already has the underlying pieces: graded review math (`AGAIN/HARD/GOOD/EASY`), `processReview()` with `nextReviewDate`, and opt-in strengthening-on-access. The current exposed adjacent surface is `memory_validate`, which records only `wasUseful` feedback and does not let an operator issue a graded FSRS review.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:32:- **Why it matters for us**: This is the highest impact x feasibility transfer because it closes the clearest control-plane gap without inventing new storage or changing retrieval architecture. It also de-risks the bigger `memory_due` idea: until Public has a first-class graded review action, any future review queue would have no trustworthy way to record hard recalls, lapses, and easy wins distinctly.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:36:### Finding 2: Rank 2 (15/25, tie-broken ahead) — a doctor-style summary should ship in the same tranche as `memory_review`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:39:- **Why it matters for us**: This is nearly pure formatter work and improves operator trust immediately. It ranks ahead of `memory_due` despite lower raw strategic upside because it is safer, independent, and can ship without any FSRS contract decisions.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:43:### Finding 3: Rank 3 (15/25, tie-broken behind) — `memory_due` is the biggest strategic win, but only after a due-state contract is fixed
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:45:- **What it does**: Modus exposes the full review lifecycle visibly: search recall, explicit reinforce, decay, and archive all operate over the same fact state. Public already stores `stability`, `difficulty`, `last_review`, `review_count`, and `last_accessed`, and `processReview()` computes `nextReviewDate`, but no persisted `next_review_at` column exists and write-on-read remains opt-in through `trackAccess=false`.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:52:- **What it does**: Modus exposes `memory_reinforce`, but only as a success-only reinforce action. Public already has the stronger primitive: graded FSRS review (`AGAIN/HARD/GOOD/EASY`) plus computed `nextReviewDate`, yet the exposed adjacent tool is only `memory_validate(wasUseful)`, which adjusts confidence rather than recording a real review event.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:53:- **Why it matters for us**: This closes the clearest control-plane gap without changing retrieval architecture. It also makes any later review queue trustworthy because review history would record hard recalls and lapses, not only “useful / not useful.”
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:98:`Code_Environment/Public` already has Spec Kit Memory with semantic and hybrid retrieval, markdown-backed memory artifacts, importance tiers, and an FSRS-based classification-decay layer in the MCP server. It does **not** currently mirror Modus Memory's end-to-end local vault server model, BM25 field-boosted lexical search with lightweight query caching, librarian-style synonym expansion for keyword retrieval, or simple subject/tag/entity adjacency maps that surface connected documents directly in result sets. Base the comparison on current code, not stale assumptions.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:106:5. After FSRS, inspect cross-referencing by reading `external/modus-memory-main/internal/index/crossref.go`. Trace how subject, tag, and entity adjacency maps are built, what weighting is used for connected results, and what the system deliberately does **not** do because it avoids a full graph database.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:138:10. Which Modus patterns would best improve query-time recall in `Code_Environment/Public`: BM25 field boosts, query caching, lexical expansion, connected-result hints, or simpler markdown-vault ergonomics?
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:190:- MCP tool handlers that expose search, memory, reinforcement, decay, and connected-doc surfaces
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:733:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:7952:- **What it does**: Modus builds three adjacency maps (`bySubject`, `byTag`, `byEntity`), scores connected docs with fixed weights (subject `3.0`, entity `2.0`, tag `1.0`), and appends connected-doc hints to search responses. The “second pass” only checks title and subject for entity mentions even though the comments imply broader body linkage.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:734:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:7953:- **Why it matters for us**: This is weaker than our causal/code-graph style signal layers, but it is much easier to expose to users as understandable “connected docs” rather than invisible score boosts.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:775:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:8047:- **What it does**: Modus builds three adjacency maps (`bySubject`, `byTag`, `byEntity`), scores connected docs with fixed weights (subject `3.0`, entity `2.0`, tag `1.0`), and appends connected-doc hints to search responses. The “second pass” only checks title and subject for entity mentions even though the comments imply broader body linkage.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:776:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:8048:- **Why it matters for us**: This is weaker than our causal/code-graph style signal layers, but it is much easier to expose to users as understandable “connected docs” rather than invisible score boosts.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:812:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:8134:- **What it does**: `vault_write`, `memory_store`, and `ReinforceFact` mutate markdown files directly. But `vault_search`, `vault_connected`, and `memory_search` only read the prebuilt in-memory `Index`, `factStore`, and `crossIndex`. Meanwhile `vault_list` and `memory_facts` rescan disk live, so they can see writes the search path cannot.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:938:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:8439:- **What it does**: Modus builds adjacency maps keyed by normalized subject, tag, and entity name, then scores connected docs with fixed weights `subject=3`, `entity=2`, `tag=1`. This is cheap and useful for related-document surfacing. But it is intentionally shallow: no traversal, no causal semantics, and the “scan title/body for entity mentions” comment only checks title and subject in code. Public already has richer graph-aware ranking signals, causal boost, and structural freshness augmentation.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:988:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:8597:- **Why it matters for us**: The useful idea here is **write mediation**, not Modus’s implementation. In source, “single writer” is a prompt convention, so any connected client can mutate persistent state directly. Public already has the harder part: actual scope/governance enforcement.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:1038:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:8709:### Finding 4: Modus’s best retrieval-specific pattern is not its graph model, but its explicit “connected docs not in top hits” appendix
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:1039:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:8711:- **What it does**: Modus builds cheap adjacency maps over markdown documents only: shared subject gets weight `3.0`, entity `2.0`, tag `1.0`, then `vault_search` appends connected documents that were not already returned. Public’s code-graph and CocoIndex are stronger, but they solve different problems: `code_graph_query/context` answer structural code questions, and CocoIndex is the semantic code-search bridge. Neither is the same as “show me adjacent memory docs I might also want right now.”
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:1040:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:8712:- **Why it matters for us**: This is additive, not competitive. Public should not replace causal memory or code graph with Modus-style string adjacency, but a small connected-memory appendix for markdown artifacts could improve exploration and follow-on recall without disturbing the existing routing split of memory vs semantic code vs structural code.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:1108:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:8894:- **What it does**: Modus builds an in-memory `bySubject`/`byTag`/`byEntity` cross-index, scores connections with fixed weights (subject `3.0`, entity `2.0`, tag `1.0`), and appends connected docs to search results or returns them via `vault_connected`. Public stores typed causal edges (`caused`, `enabled`, `supersedes`, `contradicts`, `derived_from`, `supports`), exposes traversal in both directions, tracks graph coverage/orphans, records `weight_history`, and applies contradiction detection and edge bounds.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:1186:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9076:### Finding 5: **If we want Modus-style “connected docs” ergonomics, add them as a formatter over existing graph evidence, not as a new index**
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:1187:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9078:- **What it does**: Modus appends a lightweight connected-doc block after primary results using fixed subject/entity/tag weights. Public already computes and exposes graph contribution metadata in the pipeline response, but it does not currently turn that into a first-class “you may also want these linked memories” presentation block.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:1220:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9170:- **Why it matters for us**: This suggests a second major shift: memory should not only help answer questions; it should also expose what work is blocked, what is ready, and what knowledge dependencies remain unresolved. That would pair naturally with the proposal inbox and review queue ideas.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:1295:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9397:- **What it does**: Startup logs `index build failed` and claims it can continue, but `main.go` still calls `idx.DocCount()` even when `index.Build()` returned `nil, err`. The MCP layer also assumes an index exists: `memory_search` calls `v.Index.SearchFacts(...)` directly, while only the lower-level `Vault.SearchFacts()` method contains a no-index fallback. `vault_connected` also just returns `"Index not loaded."` rather than recovering.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:1331:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9494:### Finding 1: **Medium integration** — operator-visible review queue is the highest-value Modus pattern
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:1332:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9496:- **What it does**: Modus makes the full decay loop visible: `memory_search` reinforces recalled facts, `memory_decay_facts` runs the sweep, `memory_archive_stale` archives low-confidence facts, `memory_reinforce` lets an operator review a fact directly, and result formatting exposes tier/staleness cues. Public already has the harder backend pieces: FSRS columns in `memory_index`, canonical review math, strengthening-on-access, and archival machinery. The missing piece is a first-class due/review queue.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:1346:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9515:### Finding 4: **Medium integration** — connected-doc hints are feasible, but should stay explanatory first
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:1347:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9517:- **What it does**: Modus builds an in-memory metadata adjacency map from subject/tag/entity overlap, weights subject/entity/tag at `3/2/1`, and appends “connected” documents that were not in the main ranked set. Public already has stronger structural enrichment—causal-neighbor boost, neighbor injection, and co-activation spreading—but those are graph-driven, not simple frontmatter co-membership summaries.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:1352:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9524:- **What it does**: Modus exposes both automatic reinforcement on recall and an explicit `memory_reinforce` tool. Public already has the underlying grade model (`AGAIN/HARD/GOOD/EASY`), review processing, and strengthening-on-access logic, but keeps write-back behind `trackAccess=false` and has no first-class `memory_reinforce`/`memory_review` tool in the current schema set.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:1363:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9588:### Finding 1: Review queue risk — a Public `memory_due` inbox will be misleading unless it gets a first-class due-state contract
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:1364:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9590:- **What it does**: Modus keeps search recall, explicit reinforce, decay, and archive on the same fact fields. Public already persists `access_count`, `last_accessed`, `stability`, `difficulty`, `last_review`, and `review_count`, and `processReview()` computes `nextReviewDate`, but that due date is not persisted and read-time strengthening stays opt-in via `trackAccess=false`.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:1365:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9591:- **Why it matters for us**: If Public adds a due/review queue without defining one authoritative source of truth for “due,” the queue can drift from actual search behavior. A memory can look overdue while recent read activity updated its effective retrievability, which would make the inbox feel unreliable.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:1385:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9619:- **Why it matters for us**: If Public copies Modus literally, every explicit review starts looking like successful recall. That biases histories upward and makes any later due/review queue less trustworthy because “hard” or failed recall events have no first-class path.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:1395:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9674:### Finding 1: Rank 1 (20/25) — explicit `memory_review` is the first thing Public should ship
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:1396:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9676:- **What it does**: Modus exposes an explicit `memory_reinforce` operator action on top of its FSRS state. Public already has the underlying pieces: graded review math (`AGAIN/HARD/GOOD/EASY`), `processReview()` with `nextReviewDate`, and opt-in strengthening-on-access. The current exposed adjacent surface is `memory_validate`, which records only `wasUseful` feedback and does not let an operator issue a graded FSRS review.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:1397:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9677:- **Why it matters for us**: This is the highest impact x feasibility transfer because it closes the clearest control-plane gap without inventing new storage or changing retrieval architecture. It also de-risks the bigger `memory_due` idea: until Public has a first-class graded review action, any future review queue would have no trustworthy way to record hard recalls, lapses, and easy wins distinctly.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:1400:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9681:### Finding 2: Rank 2 (15/25, tie-broken ahead) — a doctor-style summary should ship in the same tranche as `memory_review`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:1402:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9684:- **Why it matters for us**: This is nearly pure formatter work and improves operator trust immediately. It ranks ahead of `memory_due` despite lower raw strategic upside because it is safer, independent, and can ship without any FSRS contract decisions.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:1405:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9688:### Finding 3: Rank 3 (15/25, tie-broken behind) — `memory_due` is the biggest strategic win, but only after a due-state contract is fixed
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:1406:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9690:- **What it does**: Modus exposes the full review lifecycle visibly: search recall, explicit reinforce, decay, and archive all operate over the same fact state. Public already stores `stability`, `difficulty`, `last_review`, `review_count`, and `last_accessed`, and `processReview()` computes `nextReviewDate`, but no persisted `next_review_at` column exists and write-on-read remains opt-in through `trackAccess=false`.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:1410:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9695:### Finding 4: Rank 4 (9/25) — connected-doc hints are worth prototyping only as an explanation lane
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:1411:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9697:- **What it does**: Modus builds a lightweight adjacency layer from subject/tag/entity overlap and appends “connected docs not in results above” as an extra hint surface. Public already has stronger graph-backed enrichment via causal boosts, neighbor injection, and co-activation, but not a simple metadata-derived explanation appendix.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:1421:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9711:- **What it does**: The ranking resolves into a four-phase roadmap: **Phase 1** ship `memory_review` plus a doctor-style summary; **Phase 2** define the authoritative due-state contract and then add `memory_due`; **Phase 3** pilot connected-doc explanations as a non-scoring appendix; **Phase 4** run a feature-flagged lexical-expansion experiment only on weak-result fallback paths.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:1434:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9773:- **What it does**: Modus exposes `memory_reinforce`, but only as a success-only reinforce action. Public already has the stronger primitive: graded FSRS review (`AGAIN/HARD/GOOD/EASY`) plus computed `nextReviewDate`, yet the exposed adjacent tool is only `memory_validate(wasUseful)`, which adjusts confidence rather than recording a real review event.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:1435:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9774:- **Why it matters for us**: This closes the clearest control-plane gap without changing retrieval architecture. It also makes any later review queue trustworthy because review history would record hard recalls and lapses, not only “useful / not useful.”
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:1448:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9792:### Finding 4: `memory_due` is real product value, but it needs an authoritative due-state contract first
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:1449:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9794:- **What it does**: Modus visibly ties search recall, reinforce, decay, and archive to one fact state. Public already stores `stability`, `difficulty`, `last_review`, `review_count`, and opt-in access effects, and computes `nextReviewDate`, but does not expose an operator-facing due queue.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:1459:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9808:- **What it does**: Modus builds lightweight subject/entity/tag adjacency and appends connected docs that did not make the main ranked list. The weighting is simple and fixed (`subject 3`, `entity 2`, `tag 1`).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:3268:**Executive summary:** Borrow **Modus’s operator surfaces**, not its weaker retrieval shortcuts. **Adopt now:** graded `memory_review`, doctor-style summary, and a strict one-retrieval-core rule. **New feature needed:** authoritative `memory_due` and a durable proposal inbox. **Prototype later:** connected-doc appendix, weak-result lexical fallback, and content-level contradiction linting. **Reject:** fuzzy result-cache reuse, permissive markdown ingestion, default write-on-read as policy, and unenforced trust-stage metadata.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:3274:- **What it does**: Modus exposes `memory_reinforce`, but only as a success-only reinforce action. Public already has the stronger primitive: graded FSRS review (`AGAIN/HARD/GOOD/EASY`) plus computed `nextReviewDate`, yet the exposed adjacent tool is only `memory_validate(wasUseful)`, which adjusts confidence rather than recording a real review event.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:3275:- **Why it matters for us**: This closes the clearest control-plane gap without changing retrieval architecture. It also makes any later review queue trustworthy because review history would record hard recalls and lapses, not only “useful / not useful.”
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:3293:### Finding 4: `memory_due` is real product value, but it needs an authoritative due-state contract first
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:3295:- **What it does**: Modus visibly ties search recall, reinforce, decay, and archive to one fact state. Public already stores `stability`, `difficulty`, `last_review`, `review_count`, and opt-in access effects, and computes `nextReviewDate`, but does not expose an operator-facing due queue.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:3309:- **What it does**: Modus builds lightweight subject/entity/tag adjacency and appends connected docs that did not make the main ranked list. The weighting is simple and fixed (`subject 3`, `entity 2`, `tag 1`).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:3973:    13	// This is Option A from the knowledge graph discussion: connected search results
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:3977:    17	// DocRef is a lightweight reference to a connected document.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:3988:    28		bySubject map[string][]DocRef // lowercase subject → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:3989:    29		byTag     map[string][]DocRef // tag → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:3990:    30		byEntity  map[string][]DocRef // entity name → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:4075:   115	// ForSubject returns all documents connected to a subject (case-insensitive).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:4101:   141	// ForEntity returns all documents connected to an entity.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:4208:   248	// FormatConnected returns a human-readable string of connected documents.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:6195:   901		srv.AddTool("vault_connected", "Find all documents connected to a subject, entity, or tag. Returns facts, beliefs, entities, articles, learnings, and missions that share references.", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:6643:    70	  nextReviewDate: string;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:6780:   207	  const nextReviewDate = getNextReviewDate(newStability);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:6787:   214	    nextReviewDate,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:7133:   449	    hints.push('Database not connected - restart MCP server');
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:7678:  9767	**Executive summary:** Borrow **Modus’s operator surfaces**, not its weaker retrieval shortcuts. **Adopt now:** graded `memory_review`, doctor-style summary, and a strict one-retrieval-core rule. **New feature needed:** authoritative `memory_due` and a durable proposal inbox. **Prototype later:** connected-doc appendix, weak-result lexical fallback, and content-level contradiction linting. **Reject:** fuzzy result-cache reuse, permissive markdown ingestion, default write-on-read as policy, and unenforced trust-stage metadata.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:7684:  9773	- **What it does**: Modus exposes `memory_reinforce`, but only as a success-only reinforce action. Public already has the stronger primitive: graded FSRS review (`AGAIN/HARD/GOOD/EASY`) plus computed `nextReviewDate`, yet the exposed adjacent tool is only `memory_validate(wasUseful)`, which adjusts confidence rather than recording a real review event.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:7685:  9774	- **Why it matters for us**: This closes the clearest control-plane gap without changing retrieval architecture. It also makes any later review queue trustworthy because review history would record hard recalls and lapses, not only “useful / not useful.”
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:7703:  9792	### Finding 4: `memory_due` is real product value, but it needs an authoritative due-state contract first
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:7705:  9794	- **What it does**: Modus visibly ties search recall, reinforce, decay, and archive to one fact state. Public already stores `stability`, `difficulty`, `last_review`, `review_count`, and opt-in access effects, and computes `nextReviewDate`, but does not expose an operator-facing due queue.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:7719:  9808	- **What it does**: Modus builds lightweight subject/entity/tag adjacency and appends connected docs that did not make the main ranked list. The weighting is simple and fixed (`subject 3`, `entity 2`, `tag 1`).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:7796:- **What it does**: Each system’s highest-value ideas are workflow primitives: exact recall lanes, repair briefs, compaction checkpoints, status hints, review queues, due queues, and proposal inboxes.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:7804:- **Why it matters**: This is the clearest thing Modus contributes that the other four phases do not. It makes `memory_review` the strongest immediate Modus-derived transfer, and it makes `memory_due` the next gated feature after the review contract is real.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:7810:- **What it does**: Modus builds subject/entity/tag adjacency in memory, scores it with fixed weights (`3/2/1`), and returns it as connected material beside the main result set instead of pretending it is a full causal graph.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:7827:Turn the converged adopt-now set into one cross-phase implementation tranche: exact-key recall, doctor summary, compaction-time checkpoint, bootstrap memory hints, and static markdown integrity. After that, open a second design tranche for `memory_review`, `memory_due`, and a durable proposal inbox so the strongest Modus-specific ideas land behind an explicit control-plane contract.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:7856:- **What it does**: Each system’s highest-value ideas are workflow primitives: exact recall lanes, repair briefs, compaction checkpoints, status hints, review queues, due queues, and proposal inboxes.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:7864:- **Why it matters**: This is the clearest thing Modus contributes that the other four phases do not. It makes `memory_review` the strongest immediate Modus-derived transfer, and it makes `memory_due` the next gated feature after the review contract is real.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:7870:- **What it does**: Modus builds subject/entity/tag adjacency in memory, scores it with fixed weights (`3/2/1`), and returns it as connected material beside the main result set instead of pretending it is a full causal graph.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md:7887:Turn the converged adopt-now set into one cross-phase implementation tranche: exact-key recall, doctor summary, compaction-time checkpoint, bootstrap memory hints, and static markdown integrity. After that, open a second design tranche for `memory_review`, `memory_due`, and a durable proposal inbox so the strongest Modus-specific ideas land behind an explicit control-plane contract.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-029.md:28:Run the next iteration on **operator workflow design**: map Public’s existing internals into a compact DX control plane with 3 concrete candidates only, `memory_status`, `memory_debug_search`, and `memory_review`, then judge whether each should be a new tool, a `profile:"debug"` response, or a wrapper around existing tools.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-029.md:40:### Finding 1: Rank 1 (20/25) — explicit `memory_review` is the first thing Public should ship
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-029.md:42:- **What it does**: Modus exposes an explicit `memory_reinforce` operator action on top of its FSRS state. Public already has the underlying pieces: graded review math (`AGAIN/HARD/GOOD/EASY`), `processReview()` with `nextReviewDate`, and opt-in strengthening-on-access. The current exposed adjacent surface is `memory_validate`, which records only `wasUseful` feedback and does not let an operator issue a graded FSRS review.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-029.md:43:- **Why it matters for us**: This is the highest impact x feasibility transfer because it closes the clearest control-plane gap without inventing new storage or changing retrieval architecture. It also de-risks the bigger `memory_due` idea: until Public has a first-class graded review action, any future review queue would have no trustworthy way to record hard recalls, lapses, and easy wins distinctly.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-029.md:51:- **What it does**: Modus builds lightweight subject/tag/entity adjacency maps at index time and appends connected documents to search output when they were not already returned by lexical search.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-029.md:52:- **Why it matters**: For compaction recovery, this is the most transferable Modus idea: after we recover the active spec/task, a cheap connected-neighbor pass could widen context without immediately paying for heavier graph or semantic expansion.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-029.md:89:`Code_Environment/Public` already has Spec Kit Memory with semantic and hybrid retrieval, markdown-backed memory artifacts, importance tiers, and an FSRS-based classification-decay layer in the MCP server. It does **not** currently mirror Modus Memory's end-to-end local vault server model, BM25 field-boosted lexical search with lightweight query caching, librarian-style synonym expansion for keyword retrieval, or simple subject/tag/entity adjacency maps that surface connected documents directly in result sets. Base the comparison on current code, not stale assumptions.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-029.md:97:5. After FSRS, inspect cross-referencing by reading `external/modus-memory-main/internal/index/crossref.go`. Trace how subject, tag, and entity adjacency maps are built, what weighting is used for connected results, and what the system deliberately does **not** do because it avoids a full graph database.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-029.md:129:10. Which Modus patterns would best improve query-time recall in `Code_Environment/Public`: BM25 field boosts, query caching, lexical expansion, connected-result hints, or simpler markdown-vault ergonomics?
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-029.md:181:- MCP tool handlers that expose search, memory, reinforcement, decay, and connected-doc surfaces
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-029.md:2020:    13	// This is Option A from the knowledge graph discussion: connected search results
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-029.md:2024:    17	// DocRef is a lightweight reference to a connected document.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-029.md:2035:    28		bySubject map[string][]DocRef // lowercase subject → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-029.md:2036:    29		byTag     map[string][]DocRef // tag → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-029.md:2037:    30		byEntity  map[string][]DocRef // entity name → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-029.md:2122:   115	// ForSubject returns all documents connected to a subject (case-insensitive).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-029.md:2148:   141	// ForEntity returns all documents connected to an entity.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-029.md:2506:/bin/zsh -lc "rg -n \"ExpandQuery|Connected\\(|ReinforceFact|Search\\(|memory_search|memory_review|facts|connected|librarian|review|reinforce\" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-029.md:2509:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:14://	memory_reinforce, memory_decay_facts, vault_connected
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-029.md:2514:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:30:		"vault_connected":   true,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-029.md:2523:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:75:		// Append cross-reference hints — show connected docs the agent might want
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-029.md:2525:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:91:					sb.WriteString("**Cross-references** (connected docs not in results above):\n")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-029.md:2551:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:901:	srv.AddTool("vault_connected", "Find all documents connected to a subject, entity, or tag. Returns facts, beliefs, entities, articles, learnings, and missions that share references.", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-029.md:2556:/bin/zsh -lc 'rg -n "FSRS|trackAccess|processReview|nextReviewDate|memory_validate|enableSessionBoost|causal|trace|profile|route|fallback|debug|review|search_shown|result_cited" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-029.md:2574:.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:70:  nextReviewDate: string;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-029.md:2589:.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:207:  const nextReviewDate = getNextReviewDate(newStability);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-029.md:2591:.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:214:    nextReviewDate,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-029.md:2706:    14	//	memory_reinforce, memory_decay_facts, vault_connected
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-029.md:2722:    30			"vault_connected":   true,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-029.md:2791:    75			// Append cross-reference hints — show connected docs the agent might want
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-029.md:2807:    91						sb.WriteString("**Cross-references** (connected docs not in results above):\n")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-029.md:2972:   901		srv.AddTool("vault_connected", "Find all documents connected to a subject, entity, or tag. Returns facts, beliefs, entities, articles, learnings, and missions that share references.", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-029.md:3001:/bin/zsh -lc 'rg -n "11 MCP tools|cached|microseconds|milliseconds|markdown|vault_connected|memory_reinforce|memory_search|BM25|field|cache|librarian" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-029.md:3013:207:| `vault_connected` | Cross-reference query — find everything linked to a subject, tag, or entity |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-029.md:3106:    70	  nextReviewDate: string;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-029.md:3243:   207	  const nextReviewDate = getNextReviewDate(newStability);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-029.md:3250:   214	    nextReviewDate,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-029.md:3314:    34	 * highly connected knowledge is more reliably accessible over time.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-029.md:4356:- **What it does**: Modus builds subject/tag/entity adjacency maps at index time and exposes connected documents directly. Public already has causal traversal and graph-aware freshness, but those are heavier semantic structures than simple adjacency hints.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-029.md:4372:Turn this ADR into a final adoption matrix for iteration 30: map `adopt now` items to exact Public surfaces (`memory_review`, route-summary/debug output, compact operator bundle), keep adjacency hints in `prototype later`, and explicitly lock in the `reject` decisions on write-on-read reinforcement, BM25-only replacement, and a separate fact-silo retrieval path.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-029.md:4413:- **What it does**: Modus builds subject/tag/entity adjacency maps at index time and exposes connected documents directly. Public already has causal traversal and graph-aware freshness, but those are heavier semantic structures than simple adjacency hints.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-029.md:4429:Turn this ADR into a final adoption matrix for iteration 30: map `adopt now` items to exact Public surfaces (`memory_review`, route-summary/debug output, compact operator bundle), keep adjacency hints in `prototype later`, and explicitly lock in the `reject` decisions on write-on-read reinforcement, BM25-only replacement, and a separate fact-silo retrieval path.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-023.md:3:- **What it does**: Modus builds subject/entity/tag adjacency in memory, scores it with fixed weights (`3/2/1`), and returns it as connected material beside the main result set instead of pretending it is a full causal graph.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-023.md:20:Turn the converged adopt-now set into one cross-phase implementation tranche: exact-key recall, doctor summary, compaction-time checkpoint, bootstrap memory hints, and static markdown integrity. After that, open a second design tranche for `memory_review`, `memory_due`, and a durable proposal inbox so the strongest Modus-specific ideas land behind an explicit control-plane contract.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-023.md:24:### Finding 1: Review queue risk — a Public `memory_due` inbox will be misleading unless it gets a first-class due-state contract
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-023.md:26:- **What it does**: Modus keeps search recall, explicit reinforce, decay, and archive on the same fact fields. Public already persists `access_count`, `last_accessed`, `stability`, `difficulty`, `last_review`, and `review_count`, and `processReview()` computes `nextReviewDate`, but that due date is not persisted and read-time strengthening stays opt-in via `trackAccess=false`.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-023.md:27:- **Why it matters for us**: If Public adds a due/review queue without defining one authoritative source of truth for “due,” the queue can drift from actual search behavior. A memory can look overdue while recent read activity updated its effective retrievability, which would make the inbox feel unreliable.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-023.md:45:### Finding 1: Rank 1 (20/25) — explicit `memory_review` is the first thing Public should ship
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-023.md:47:- **What it does**: Modus exposes an explicit `memory_reinforce` operator action on top of its FSRS state. Public already has the underlying pieces: graded review math (`AGAIN/HARD/GOOD/EASY`), `processReview()` with `nextReviewDate`, and opt-in strengthening-on-access. The current exposed adjacent surface is `memory_validate`, which records only `wasUseful` feedback and does not let an operator issue a graded FSRS review.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-023.md:48:- **Why it matters for us**: This is the highest impact x feasibility transfer because it closes the clearest control-plane gap without inventing new storage or changing retrieval architecture. It also de-risks the bigger `memory_due` idea: until Public has a first-class graded review action, any future review queue would have no trustworthy way to record hard recalls, lapses, and easy wins distinctly.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-023.md:81:Implement blueprint 1 first in a write-enabled pass, then add `memory_health({ reportMode: "doctor" })`, then do the retrieval-core extraction before starting the separate `memory_due` ADR.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-023.md:111:`Code_Environment/Public` already has Spec Kit Memory with semantic and hybrid retrieval, markdown-backed memory artifacts, importance tiers, and an FSRS-based classification-decay layer in the MCP server. It does **not** currently mirror Modus Memory's end-to-end local vault server model, BM25 field-boosted lexical search with lightweight query caching, librarian-style synonym expansion for keyword retrieval, or simple subject/tag/entity adjacency maps that surface connected documents directly in result sets. Base the comparison on current code, not stale assumptions.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-023.md:119:5. After FSRS, inspect cross-referencing by reading `external/modus-memory-main/internal/index/crossref.go`. Trace how subject, tag, and entity adjacency maps are built, what weighting is used for connected results, and what the system deliberately does **not** do because it avoids a full graph database.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-023.md:151:10. Which Modus patterns would best improve query-time recall in `Code_Environment/Public`: BM25 field boosts, query caching, lexical expansion, connected-result hints, or simpler markdown-vault ergonomics?
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-023.md:203:- MCP tool handlers that expose search, memory, reinforcement, decay, and connected-doc surfaces
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-023.md:292:/bin/zsh -lc 'rg -n "modus|memory_review|memory_due|FSRS|decay|retention" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-023.md:296:157:- rollout_summaries/2026-04-09T10-35-53-UGDf-009_post_save_render_fixes_memory_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T12-35-53-019d71d0-0ec5-7c80-a08b-6d336ee5c639.jsonl, updated_at=2026-04-09T12:01:25+00:00, thread_id=019d71d0-0ec5-7c80-a08b-6d336ee5c639)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-023.md:299:1869:- rollout_summaries/2026-03-13T11-01-44-IBXE-outsourced_agent_memory_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/13/rollout-2026-03-13T12-01-44-019ce6dc-0509-7630-9874-db11f57a9e06.jsonl, updated_at=2026-03-13T11:21:38+00:00, thread_id=019ce6dc-0509-7630-9874-db11f57a9e06)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-023.md:524:I’ve loaded the deep-research skill baseline and the memory pass mostly confirms prior momentum around `memory_review` and review-related retention work. Next I’m tracing the exact decay and recall mechanics in Modus and our FSRS scheduler so this iteration can focus on temporal policy, not generic retrieval overlap.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-023.md:1099:  nextReviewDate: string;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-023.md:1236:  const nextReviewDate = getNextReviewDate(newStability);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-023.md:1243:    nextReviewDate,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-023.md:1325: * highly connected knowledge is more reliably accessible over time.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-023.md:1433:	srv.AddTool("vault_connected", "Find all documents connected to a subject, entity, or tag. Returns facts, beliefs, entities, articles, learnings, and missions that share references.", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-023.md:1573://	memory_reinforce, memory_decay_facts, vault_connected
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-023.md:1589:		"vault_connected":   true,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-023.md:1789:// This is Option A from the knowledge graph discussion: connected search results
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-023.md:1793:// DocRef is a lightweight reference to a connected document.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-023.md:1804:	bySubject map[string][]DocRef // lowercase subject → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-023.md:1805:	byTag     map[string][]DocRef // tag → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-023.md:1806:	byEntity  map[string][]DocRef // entity name → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-023.md:1891:// ForSubject returns all documents connected to a subject (case-insensitive).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-023.md:1917:// ForEntity returns all documents connected to an entity.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-023.md:2039:`Code_Environment/Public` already has Spec Kit Memory with semantic and hybrid retrieval, markdown-backed memory artifacts, importance tiers, and an FSRS-based classification-decay layer in the MCP server. It does **not** currently mirror Modus Memory's end-to-end local vault server model, BM25 field-boosted lexical search with lightweight query caching, librarian-style synonym expansion for keyword retrieval, or simple subject/tag/entity adjacency maps that surface connected documents directly in result sets. Base the comparison on current code, not stale assumptions.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-023.md:2047:5. After FSRS, inspect cross-referencing by reading `external/modus-memory-main/internal/index/crossref.go`. Trace how subject, tag, and entity adjacency maps are built, what weighting is used for connected results, and what the system deliberately does **not** do because it avoids a full graph database.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-023.md:2079:10. Which Modus patterns would best improve query-time recall in `Code_Environment/Public`: BM25 field boosts, query caching, lexical expansion, connected-result hints, or simpler markdown-vault ergonomics?
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-023.md:2131:- MCP tool handlers that expose search, memory, reinforcement, decay, and connected-doc surfaces
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-023.md:2506:/bin/zsh -lc "rg -n \"nextReviewDate|processReview\\(|trackAccess|review_count|last_review|stability|difficulty|retrievability|due\" .opencode/skill/system-spec-kit/mcp_server -g '*.ts'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-023.md:3405:.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:294:      const nextReviewDate = fsrsScheduler.getNextReviewDate(5);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-023.md:3406:.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:295:      expect(Number.isNaN(new Date(nextReviewDate).getTime())).toBe(false);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-023.md:3454:.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:186:        nextReviewDate: new Date().toISOString(),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-023.md:3518:.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:207:    expect(result).toHaveProperty('nextReviewDate');
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-023.md:3536:.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:249:  it('D-08: nextReviewDate is valid future date', () => {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-023.md:3538:.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:251:    const nextDate = new Date(result.nextReviewDate);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-023.md:3552:.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:70:  nextReviewDate: string;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-023.md:3583:.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:207:  const nextReviewDate = getNextReviewDate(newStability);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-023.md:3586:.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:214:    nextReviewDate,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-023.md:4254:| `vault_connected` | Cross-reference query — find everything linked to a subject, tag, or entity |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-023.md:5338:   901		srv.AddTool("vault_connected", "Find all documents connected to a subject, entity, or tag. Returns facts, beliefs, entities, articles, learnings, and missions that share references.", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-023.md:5421:    70	  nextReviewDate: string;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-023.md:5558:   207	  const nextReviewDate = getNextReviewDate(newStability);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-023.md:5565:   214	    nextReviewDate,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-023.md:6352:Define a canonical recall-event contract for Public first: decide whether ordinary search hits should refresh lifetime, persist a real due-state projection on top of existing FSRS fields, and expose that through `memory_review` plus a visible `memory_due`/retention surface. After that, test whether Modus-style freshness buckets belong only in an episodic fact lane rather than in canonical memory ranking.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-023.md:6406:Define a canonical recall-event contract for Public first: decide whether ordinary search hits should refresh lifetime, persist a real due-state projection on top of existing FSRS fields, and expose that through `memory_review` plus a visible `memory_due`/retention surface. After that, test whether Modus-style freshness buckets belong only in an episodic fact lane rather than in canonical memory ranking.
.opencode/skill/system-spec-kit/mcp_server/README.md:352:The system tracks how decisions relate to each other. Think of it like a corkboard with sticky notes connected by string. One note says "we chose JWT tokens." A string connects it to "because the session store was too slow." Another string connects that to "the Redis outage on March 5th."
.opencode/skill/system-spec-kit/mcp_server/README.md:365:**Typed-weighted degree channel** -- uses these weights to rank memories by their graph importance. Hub caps (`MAX_TYPED_DEGREE`=15, `MAX_TOTAL_DEGREE`=50) and a `DEGREE_BOOST_CAP` of 0.15 prevent any single highly-connected memory from dominating results.
.opencode/skill/system-spec-kit/mcp_server/README.md:367:**Co-activation spreading** -- boosts memories connected to ones you already found relevant. A fan-effect divisor (`1/sqrt(neighbor_count)`) prevents popular hub memories from getting an outsized boost just because they connect to everything.
.opencode/skill/system-spec-kit/mcp_server/README.md:924:##### `shared_memory_status`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:14:### Finding 1: Rank 1 (20/25) — explicit `memory_review` is the first thing Public should ship
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:16:- **What it does**: Modus exposes an explicit `memory_reinforce` operator action on top of its FSRS state. Public already has the underlying pieces: graded review math (`AGAIN/HARD/GOOD/EASY`), `processReview()` with `nextReviewDate`, and opt-in strengthening-on-access. The current exposed adjacent surface is `memory_validate`, which records only `wasUseful` feedback and does not let an operator issue a graded FSRS review.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:17:- **Why it matters for us**: This is the highest impact x feasibility transfer because it closes the clearest control-plane gap without inventing new storage or changing retrieval architecture. It also de-risks the bigger `memory_due` idea: until Public has a first-class graded review action, any future review queue would have no trustworthy way to record hard recalls, lapses, and easy wins distinctly.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:25:- **What it does**: Modus builds lightweight subject/tag/entity adjacency maps at index time and appends connected documents to search output when they were not already returned by lexical search.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:26:- **Why it matters**: For compaction recovery, this is the most transferable Modus idea: after we recover the active spec/task, a cheap connected-neighbor pass could widen context without immediately paying for heavier graph or semantic expansion.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:63:Run the next iteration on **operator workflow design**: map Public’s existing internals into a compact DX control plane with 3 concrete candidates only, `memory_status`, `memory_debug_search`, and `memory_review`, then judge whether each should be a new tool, a `profile:"debug"` response, or a wrapper around existing tools.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:93:`Code_Environment/Public` already has Spec Kit Memory with semantic and hybrid retrieval, markdown-backed memory artifacts, importance tiers, and an FSRS-based classification-decay layer in the MCP server. It does **not** currently mirror Modus Memory's end-to-end local vault server model, BM25 field-boosted lexical search with lightweight query caching, librarian-style synonym expansion for keyword retrieval, or simple subject/tag/entity adjacency maps that surface connected documents directly in result sets. Base the comparison on current code, not stale assumptions.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:101:5. After FSRS, inspect cross-referencing by reading `external/modus-memory-main/internal/index/crossref.go`. Trace how subject, tag, and entity adjacency maps are built, what weighting is used for connected results, and what the system deliberately does **not** do because it avoids a full graph database.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:133:10. Which Modus patterns would best improve query-time recall in `Code_Environment/Public`: BM25 field boosts, query caching, lexical expansion, connected-result hints, or simpler markdown-vault ergonomics?
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:185:- MCP tool handlers that expose search, memory, reinforcement, decay, and connected-doc surfaces
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:2276:    13	// This is Option A from the knowledge graph discussion: connected search results
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:2280:    17	// DocRef is a lightweight reference to a connected document.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:2291:    28		bySubject map[string][]DocRef // lowercase subject → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:2292:    29		byTag     map[string][]DocRef // tag → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:2293:    30		byEntity  map[string][]DocRef // entity name → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:2378:   115	// ForSubject returns all documents connected to a subject (case-insensitive).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:2404:   141	// ForEntity returns all documents connected to an entity.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:2820:    75			// Append cross-reference hints — show connected docs the agent might want
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:2836:    91						sb.WriteString("**Cross-references** (connected docs not in results above):\n")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:3183:    14	//	memory_reinforce, memory_decay_facts, vault_connected
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:3199:    30			"vault_connected":   true,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:3240:   207	| `vault_connected` | Cross-reference query — find everything linked to a subject, tag, or entity |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:3300:   267	- **Cross-reference hints** — search results include connected documents from other categories
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:3320:   287	Documents are connected by shared subjects, tags, and entities. A search for "authentication" returns not just keyword matches, but also:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:3909:    34	 * highly connected knowledge is more reliably accessible over time.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:4031:    70	  nextReviewDate: string;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:4168:   207	  const nextReviewDate = getNextReviewDate(newStability);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:4175:   214	    nextReviewDate,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:4355:.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:33:type SharedIdentityTool = SharedAdminTool | 'shared_memory_status';
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:4356:.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:374:  tool: 'shared_space_upsert' | 'shared_space_membership_set' | 'shared_memory_status' | 'shared_memory_enable',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:4358:.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:756:      tool: 'shared_memory_status',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:4359:.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:765:      tool: 'shared_memory_status',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:4360:.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:785:      'shared_memory_status',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:4510:.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:445:  shared_memory_status: getSchema({
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:4517:.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:493:  shared_memory_status: ['tenantId', 'actorUserId', 'actorAgentId'],
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:5107:.opencode/skill/system-spec-kit/mcp_server/shared-spaces/README.md:42:| `shared_memory_status` | Caller-scoped rollout and membership view; requires exactly one actor identity |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:5108:.opencode/skill/system-spec-kit/mcp_server/shared-spaces/README.md:50:`shared_memory_status`, `shared_space_upsert`, and `shared_space_membership_set` rely on actor identity validation in `handlers/shared-memory.ts`. Admin mutations compare the caller against the configured shared-memory admin identity before allowing ownership-sensitive changes.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:5288:.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:58:  'shared_memory_status',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:5293:.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:79:    case 'shared_memory_status':       return handleSharedMemoryStatus(parseArgs<SharedMemoryStatusArgs>(validateToolArgs('shared_memory_status', args)));
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:6104:.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:397:    for (const toolName of ['shared_space_upsert', 'shared_space_membership_set', 'shared_memory_status']) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:6105:.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:442:  it('handler requires caller identity for shared_memory_status', async () => {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:6106:.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:454:  it('runtime accepts shared_memory_status with one actor identity', () => {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:6107:.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:456:      validateToolArgs('shared_memory_status', {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:6465:.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:444:  name: 'shared_memory_status',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:6905:.opencode/skill/system-spec-kit/mcp_server/README.md:924:##### `shared_memory_status`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:7353:.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:316:// result = { stability, difficulty, lastReview, reviewCount, nextReviewDate, retrievability }
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:7704:.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:86:    tools: ['checkpoint_create', 'checkpoint_list', 'checkpoint_restore', 'checkpoint_delete', 'shared_memory_enable', 'shared_memory_status', 'shared_space_upsert', 'shared_space_membership_set']
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:8245:.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:177:      'shared_memory_status',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:8257:.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:300:      'shared_space_upsert', 'shared_space_membership_set', 'shared_memory_status', 'shared_memory_enable',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:9386:.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:164:    expect(api.LAYER_DEFINITIONS.L5.tools).toContain('shared_memory_status');
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:9387:.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:165:    expect(api.TOOL_LAYER_MAP.shared_memory_status).toBe('L5');
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:9388:.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:166:    expect(api.getLayerForTool('shared_memory_status')).toBe('L5');
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:9389:.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:167:    expect(api.getLayerTokenBudget('shared_memory_status')).toBe(1000);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:9999:.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:161:    it('shared_memory_status appears in exactly one layer and is mapped to that layer', () => {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:10000:.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:162:      const matchingLayers = Object.values(LD).filter((layer) => layer.tools.includes('shared_memory_status'));
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:10001:.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:166:      expect(mod.TOOL_LAYER_MAP['shared_memory_status']).toBe(matchingLayers[0].id);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:13141:/bin/zsh -lc "rg -n \"quality_score|validation_count|memory_validate|wasUseful|confidence_score|reviewCount|nextReviewDate|retrievability|trackAccess\" .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/mcp_server/lib -g '"'!**/node_modules/**'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:13279:.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:70:  nextReviewDate: string;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:13291:.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:207:  const nextReviewDate = getNextReviewDate(newStability);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:13293:.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:214:    nextReviewDate,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:13302:.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:186:        nextReviewDate: new Date().toISOString(),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md:13336:.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:316:// result = { stability, difficulty, lastReview, reviewCount, nextReviewDate, retrievability }
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:445:  shared_memory_status: getSchema({
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:493:  shared_memory_status: ['tenantId', 'actorUserId', 'actorAgentId'],
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:343:/** Delete a node and its connected edges */
.opencode/skill/system-spec-kit/mcp_server/shared-spaces/README.md:42:| `shared_memory_status` | Caller-scoped rollout and membership view; requires exactly one actor identity |
.opencode/skill/system-spec-kit/mcp_server/shared-spaces/README.md:50:`shared_memory_status`, `shared_space_upsert`, and `shared_space_membership_set` rely on actor identity validation in `handlers/shared-memory.ts`. Admin mutations compare the caller against the configured shared-memory admin identity before allowing ownership-sensitive changes.
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:58:  'shared_memory_status',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:79:    case 'shared_memory_status':       return handleSharedMemoryStatus(parseArgs<SharedMemoryStatusArgs>(validateToolArgs('shared_memory_status', args)));
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:151:The causal-depth pass condenses strongly connected components, then computes longest-path depth across the resulting DAG. This preserves deeper causal chains even when shortcut edges exist, gives all members of a cycle the same bounded depth layer, and still leaves pure isolated cycles at `0` normalized depth.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:41:`Code_Environment/Public` already has Spec Kit Memory with semantic and hybrid retrieval, markdown-backed memory artifacts, importance tiers, and an FSRS-based classification-decay layer in the MCP server. It does **not** currently mirror Modus Memory's end-to-end local vault server model, BM25 field-boosted lexical search with lightweight query caching, librarian-style synonym expansion for keyword retrieval, or simple subject/tag/entity adjacency maps that surface connected documents directly in result sets. Base the comparison on current code, not stale assumptions.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:49:5. After FSRS, inspect cross-referencing by reading `external/modus-memory-main/internal/index/crossref.go`. Trace how subject, tag, and entity adjacency maps are built, what weighting is used for connected results, and what the system deliberately does **not** do because it avoids a full graph database.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:81:10. Which Modus patterns would best improve query-time recall in `Code_Environment/Public`: BM25 field boosts, query caching, lexical expansion, connected-result hints, or simpler markdown-vault ergonomics?
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:133:- MCP tool handlers that expose search, memory, reinforcement, decay, and connected-doc surfaces
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:2811:    13	// This is Option A from the knowledge graph discussion: connected search results
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:2815:    17	// DocRef is a lightweight reference to a connected document.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:2826:    28		bySubject map[string][]DocRef // lowercase subject → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:2827:    29		byTag     map[string][]DocRef // tag → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:2828:    30		byEntity  map[string][]DocRef // entity name → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:2913:   115	// ForSubject returns all documents connected to a subject (case-insensitive).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:2939:   141	// ForEntity returns all documents connected to an entity.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:3046:   248	// FormatConnected returns a human-readable string of connected documents.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:3353:    14	//	memory_reinforce, memory_decay_facts, vault_connected
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:3369:    30			"vault_connected":   true,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:3591:| `vault_connected` | Cross-reference query — find everything linked to a subject, tag, or entity |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:3695:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:901:	srv.AddTool("vault_connected", "Find all documents connected to a subject, entity, or tag. Returns facts, beliefs, entities, articles, learnings, and missions that share references.", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:3905:    34	 * highly connected knowledge is more reliably accessible over time.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:4027:    70	  nextReviewDate: string;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:4164:   207	  const nextReviewDate = getNextReviewDate(newStability);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:4171:   214	    nextReviewDate,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:5444:    75			// Append cross-reference hints — show connected docs the agent might want
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:5460:    91						sb.WriteString("**Cross-references** (connected docs not in results above):\n")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:5986:/bin/zsh -lc "rg -n \"with 11 memory tools|CrossRefStats|FactCount|Build\\(|RegisterMemoryTools|vault_connected|memory_search|memory_reinforce|memory_decay_facts\" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:5990:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:14://	memory_reinforce, memory_decay_facts, vault_connected
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:5995:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:30:		"vault_connected":   true,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:6000:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:901:	srv.AddTool("vault_connected", "Find all documents connected to a subject, entity, or tag. Returns facts, beliefs, entities, articles, learnings, and missions that share references.", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:6063:- **Cross-reference hints** — search results include connected documents from other categories
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:6083:Documents are connected by shared subjects, tags, and entities. A search for "authentication" returns not just keyword matches, but also:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:6723:/bin/zsh -lc 'rg -n "TrackAccess|trackAccess|calculateRetrievability|applyClassificationDecay|applyHybridDecayPolicy|reviewCount|nextReviewDate" .opencode/skill/system-spec-kit/mcp_server' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:6926:.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:316:// result = { stability, difficulty, lastReview, reviewCount, nextReviewDate, retrievability }
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:6934:.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:186:        nextReviewDate: new Date().toISOString(),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:6940:.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:70:  nextReviewDate: string;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:6944:.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:207:  const nextReviewDate = getNextReviewDate(newStability);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:6946:.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:214:    nextReviewDate,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:6964:.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:292:      const nextReviewDate = fsrsScheduler.getNextReviewDate(5);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:6965:.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:293:      expect(Number.isNaN(new Date(nextReviewDate).getTime())).toBe(false);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:6973:.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:207:    expect(result).toHaveProperty('nextReviewDate');
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:6980:.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:249:  it('D-08: nextReviewDate is valid future date', () => {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:6981:.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:251:    const nextDate = new Date(result.nextReviewDate);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:7952:- **What it does**: Modus builds three adjacency maps (`bySubject`, `byTag`, `byEntity`), scores connected docs with fixed weights (subject `3.0`, entity `2.0`, tag `1.0`), and appends connected-doc hints to search responses. The “second pass” only checks title and subject for entity mentions even though the comments imply broader body linkage.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:7953:- **Why it matters for us**: This is weaker than our causal/code-graph style signal layers, but it is much easier to expose to users as understandable “connected docs” rather than invisible score boosts.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:8047:- **What it does**: Modus builds three adjacency maps (`bySubject`, `byTag`, `byEntity`), scores connected docs with fixed weights (subject `3.0`, entity `2.0`, tag `1.0`), and appends connected-doc hints to search responses. The “second pass” only checks title and subject for entity mentions even though the comments imply broader body linkage.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:8048:- **Why it matters for us**: This is weaker than our causal/code-graph style signal layers, but it is much easier to expose to users as understandable “connected docs” rather than invisible score boosts.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:8134:- **What it does**: `vault_write`, `memory_store`, and `ReinforceFact` mutate markdown files directly. But `vault_search`, `vault_connected`, and `memory_search` only read the prebuilt in-memory `Index`, `factStore`, and `crossIndex`. Meanwhile `vault_list` and `memory_facts` rescan disk live, so they can see writes the search path cannot.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:8439:- **What it does**: Modus builds adjacency maps keyed by normalized subject, tag, and entity name, then scores connected docs with fixed weights `subject=3`, `entity=2`, `tag=1`. This is cheap and useful for related-document surfacing. But it is intentionally shallow: no traversal, no causal semantics, and the “scan title/body for entity mentions” comment only checks title and subject in code. Public already has richer graph-aware ranking signals, causal boost, and structural freshness augmentation.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:8476:Trace **agent/tool orchestration and caller contract** next: when Modus expects the client to choose `vault_search` vs `memory_search` vs `vault_connected`, how often searches implicitly mutate memory, and whether the shipped tool surface assumes a prompt-side policy layer to compensate for weak global ranking and LLM-latency tradeoffs.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:8597:- **Why it matters for us**: The useful idea here is **write mediation**, not Modus’s implementation. In source, “single writer” is a prompt convention, so any connected client can mutate persistent state directly. Public already has the harder part: actual scope/governance enforcement.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:8709:### Finding 4: Modus’s best retrieval-specific pattern is not its graph model, but its explicit “connected docs not in top hits” appendix
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:8711:- **What it does**: Modus builds cheap adjacency maps over markdown documents only: shared subject gets weight `3.0`, entity `2.0`, tag `1.0`, then `vault_search` appends connected documents that were not already returned. Public’s code-graph and CocoIndex are stronger, but they solve different problems: `code_graph_query/context` answer structural code questions, and CocoIndex is the semantic code-search bridge. Neither is the same as “show me adjacent memory docs I might also want right now.”
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:8712:- **Why it matters for us**: This is additive, not competitive. Public should not replace causal memory or code graph with Modus-style string adjacency, but a small connected-memory appendix for markdown artifacts could improve exploration and follow-on recall without disturbing the existing routing split of memory vs semantic code vs structural code.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:8894:- **What it does**: Modus builds an in-memory `bySubject`/`byTag`/`byEntity` cross-index, scores connections with fixed weights (subject `3.0`, entity `2.0`, tag `1.0`), and appends connected docs to search results or returns them via `vault_connected`. Public stores typed causal edges (`caused`, `enabled`, `supersedes`, `contradicts`, `derived_from`, `supports`), exposes traversal in both directions, tracks graph coverage/orphans, records `weight_history`, and applies contradiction detection and edge bounds.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9030:Investigate a system with an explicit **review queue / due-items workflow** and **operator approval inbox**, so the next pass can test whether these new feature ideas need active scheduling and triage primitives, not just storage and mutation rules.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9076:### Finding 5: **If we want Modus-style “connected docs” ergonomics, add them as a formatter over existing graph evidence, not as a new index**
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9078:- **What it does**: Modus appends a lightweight connected-doc block after primary results using fixed subject/entity/tag weights. Public already computes and exposes graph contribution metadata in the pipeline response, but it does not currently turn that into a first-class “you may also want these linked memories” presentation block.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9112:- Questions addressed: whether Modus’s cache design should influence Public; whether Modus’s query-expansion merge path is architecturally better or worse than Public’s pipeline; whether Modus’s split fact-search surfaces suggest a refactor direction; whether Public’s own FSRS write-back placement should change; whether any part of Modus’s connected-doc UX is worth borrowing without adopting its adjacency index.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9120:Compare against a system with an explicit **review queue / due-items scheduler** and **approval inbox**, so the next pass can test whether Public’s strongest missing piece is not retrieval anymore, but the operator workflow that sits on top of retrieval, reinforcement, and governance.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9170:- **Why it matters for us**: This suggests a second major shift: memory should not only help answer questions; it should also expose what work is blocked, what is ready, and what knowledge dependencies remain unresolved. That would pair naturally with the proposal inbox and review queue ideas.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9209:Investigate a system with an explicit **review queue / due-items scheduler / approval inbox** so the next pass can test whether Public now needs a dedicated triage layer above proposals, decay signals, and mission readiness rather than more retrieval improvements.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9376:Investigate a system with a real **due-items scheduler / review queue / approval inbox** so the next pass can determine how Public should surface review-needed, stale, promotion-eligible, and archival-candidate memories without inheriting Modus’s coarse age-based heuristics.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9397:- **What it does**: Startup logs `index build failed` and claims it can continue, but `main.go` still calls `idx.DocCount()` even when `index.Build()` returned `nil, err`. The MCP layer also assumes an index exists: `memory_search` calls `v.Index.SearchFacts(...)` directly, while only the lower-level `Vault.SearchFacts()` method contains a no-index fallback. `vault_connected` also just returns `"Index not loaded."` rather than recovering.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9494:### Finding 1: **Medium integration** — operator-visible review queue is the highest-value Modus pattern
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9496:- **What it does**: Modus makes the full decay loop visible: `memory_search` reinforces recalled facts, `memory_decay_facts` runs the sweep, `memory_archive_stale` archives low-confidence facts, `memory_reinforce` lets an operator review a fact directly, and result formatting exposes tier/staleness cues. Public already has the harder backend pieces: FSRS columns in `memory_index`, canonical review math, strengthening-on-access, and archival machinery. The missing piece is a first-class due/review queue.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9515:### Finding 4: **Medium integration** — connected-doc hints are feasible, but should stay explanatory first
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9517:- **What it does**: Modus builds an in-memory metadata adjacency map from subject/tag/entity overlap, weights subject/entity/tag at `3/2/1`, and appends “connected” documents that were not in the main ranked set. Public already has stronger structural enrichment—causal-neighbor boost, neighbor injection, and co-activation spreading—but those are graph-driven, not simple frontmatter co-membership summaries.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9524:- **What it does**: Modus exposes both automatic reinforcement on recall and an explicit `memory_reinforce` tool. Public already has the underlying grade model (`AGAIN/HARD/GOOD/EASY`), review processing, and strengthening-on-access logic, but keeps write-back behind `trackAccess=false` and has no first-class `memory_reinforce`/`memory_review` tool in the current schema set.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9561:- **Questions addressed**: which Modus ideas already have insertion points in Public; whether the missing work is backend math or operator surface; which candidates are low/medium integration versus truly invasive; whether connected-result hints overlap with Public graph features; whether librarian expansion is still meaningful given Public deep-mode reformulation.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9562:- **Questions answered**: the best Modus transfers are mostly **control-plane additions**. Public already has stronger FSRS storage, lexical lanes, repair flows, and graph enrichment than Modus; the main feasible gains are a **review queue**, an **explicit review action**, and a **doctor-style summary**, with lexical expansion and connected-doc hints as bounded prototypes rather than architectural changes.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9569:Evaluate a concrete Public design for `memory_due` + `memory_review`: one tool that lists due/stale/promotion-eligible/archival-candidate memories, and one tool that applies graded FSRS review updates explicitly, then compare whether a metadata-based “connected docs” appendix improves operator trust beyond current causal/contiguity enrichment.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9588:### Finding 1: Review queue risk — a Public `memory_due` inbox will be misleading unless it gets a first-class due-state contract
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9590:- **What it does**: Modus keeps search recall, explicit reinforce, decay, and archive on the same fact fields. Public already persists `access_count`, `last_accessed`, `stability`, `difficulty`, `last_review`, and `review_count`, and `processReview()` computes `nextReviewDate`, but that due date is not persisted and read-time strengthening stays opt-in via `trackAccess=false`.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9591:- **Why it matters for us**: If Public adds a due/review queue without defining one authoritative source of truth for “due,” the queue can drift from actual search behavior. A memory can look overdue while recent read activity updated its effective retrievability, which would make the inbox feel unreliable.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9619:- **Why it matters for us**: If Public copies Modus literally, every explicit review starts looking like successful recall. That biases histories upward and makes any later due/review queue less trustworthy because “hard” or failed recall events have no first-class path.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9648:- Questions answered: the main risks are semantic and operational, not algorithmic. The safest transfers remain a doctor-style summary and an explicit review action, but only if they preserve Public’s existing repair semantics and graded FSRS model. The riskiest transfer is unbounded lexical expansion. Connected-doc hints are safest as explanation, and a review queue needs an explicit due-state contract before it can be trusted.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9655:Define the mitigation contract: decide whether `memory_due` needs a persisted `next_review_at` field or a deterministic derived rule, constrain lexical-only expansion to weak-result recovery instead of always-on deep mode, and test connected-docs as an appendix/explanation lane rather than a score-bearing retrieval lane.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9674:### Finding 1: Rank 1 (20/25) — explicit `memory_review` is the first thing Public should ship
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9676:- **What it does**: Modus exposes an explicit `memory_reinforce` operator action on top of its FSRS state. Public already has the underlying pieces: graded review math (`AGAIN/HARD/GOOD/EASY`), `processReview()` with `nextReviewDate`, and opt-in strengthening-on-access. The current exposed adjacent surface is `memory_validate`, which records only `wasUseful` feedback and does not let an operator issue a graded FSRS review.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9677:- **Why it matters for us**: This is the highest impact x feasibility transfer because it closes the clearest control-plane gap without inventing new storage or changing retrieval architecture. It also de-risks the bigger `memory_due` idea: until Public has a first-class graded review action, any future review queue would have no trustworthy way to record hard recalls, lapses, and easy wins distinctly.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9681:### Finding 2: Rank 2 (15/25, tie-broken ahead) — a doctor-style summary should ship in the same tranche as `memory_review`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9684:- **Why it matters for us**: This is nearly pure formatter work and improves operator trust immediately. It ranks ahead of `memory_due` despite lower raw strategic upside because it is safer, independent, and can ship without any FSRS contract decisions.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9688:### Finding 3: Rank 3 (15/25, tie-broken behind) — `memory_due` is the biggest strategic win, but only after a due-state contract is fixed
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9690:- **What it does**: Modus exposes the full review lifecycle visibly: search recall, explicit reinforce, decay, and archive all operate over the same fact state. Public already stores `stability`, `difficulty`, `last_review`, `review_count`, and `last_accessed`, and `processReview()` computes `nextReviewDate`, but no persisted `next_review_at` column exists and write-on-read remains opt-in through `trackAccess=false`.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9695:### Finding 4: Rank 4 (9/25) — connected-doc hints are worth prototyping only as an explanation lane
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9697:- **What it does**: Modus builds a lightweight adjacency layer from subject/tag/entity overlap and appends “connected docs not in results above” as an extra hint surface. Public already has stronger graph-backed enrichment via causal boosts, neighbor injection, and co-activation, but not a simple metadata-derived explanation appendix.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9711:- **What it does**: The ranking resolves into a four-phase roadmap: **Phase 1** ship `memory_review` plus a doctor-style summary; **Phase 2** define the authoritative due-state contract and then add `memory_due`; **Phase 3** pilot connected-doc explanations as a non-scoring appendix; **Phase 4** run a feature-flagged lexical-expansion experiment only on weak-result fallback paths.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9742:- Questions addressed: which candidate should ship first; how to break the tie between high-impact and low-risk candidates; whether `memory_due` is blocked by missing persisted due-state; whether connected-docs and lexical expansion belong on the mainline roadmap or only in prototype lanes.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9743:- Questions answered: the correct roadmap is **not** “build the biggest feature first.” Public should ship **`memory_review` first**, pair it with a **doctor-style summary**, then formalize the due-state contract before building **`memory_due`**. Connected-doc hints are worth testing only as explanation, and lexical expansion should be the final, tightly bounded experiment.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9750:Finalize iteration 020 as a closing synthesis: specify the Public API shape for `memory_review` and `memory_due`, decide whether due state is persisted or derived, and define success metrics for the two later prototypes (connected-doc appendix and weak-result lexical fallback).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9767:**Executive summary:** Borrow **Modus’s operator surfaces**, not its weaker retrieval shortcuts. **Adopt now:** graded `memory_review`, doctor-style summary, and a strict one-retrieval-core rule. **New feature needed:** authoritative `memory_due` and a durable proposal inbox. **Prototype later:** connected-doc appendix, weak-result lexical fallback, and content-level contradiction linting. **Reject:** fuzzy result-cache reuse, permissive markdown ingestion, default write-on-read as policy, and unenforced trust-stage metadata.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9773:- **What it does**: Modus exposes `memory_reinforce`, but only as a success-only reinforce action. Public already has the stronger primitive: graded FSRS review (`AGAIN/HARD/GOOD/EASY`) plus computed `nextReviewDate`, yet the exposed adjacent tool is only `memory_validate(wasUseful)`, which adjusts confidence rather than recording a real review event.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9774:- **Why it matters for us**: This closes the clearest control-plane gap without changing retrieval architecture. It also makes any later review queue trustworthy because review history would record hard recalls and lapses, not only “useful / not useful.”
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9792:### Finding 4: `memory_due` is real product value, but it needs an authoritative due-state contract first
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9794:- **What it does**: Modus visibly ties search recall, reinforce, decay, and archive to one fact state. Public already stores `stability`, `difficulty`, `last_review`, `review_count`, and opt-in access effects, and computes `nextReviewDate`, but does not expose an operator-facing due queue.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9808:- **What it does**: Modus builds lightweight subject/entity/tag adjacency and appends connected docs that did not make the main ranked list. The weighting is simple and fixed (`subject 3`, `entity 2`, `tag 1`).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9900:Turn this synthesis into implementation design: define the Public `memory_review` API first, add a doctor-style formatter over `memory_health`, then write the due-state ADR (`persisted next_review_at` vs deterministic derivation) before scoping `memory_due` and the proposal inbox.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9919:### Finding 1: Review queue risk — a Public `memory_due` inbox will be misleading unless it gets a first-class due-state contract
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9921:- **What it does**: Modus keeps search recall, explicit reinforce, decay, and archive on the same fact fields. Public already persists `access_count`, `last_accessed`, `stability`, `difficulty`, `last_review`, and `review_count`, and `processReview()` computes `nextReviewDate`, but that due date is not persisted and read-time strengthening stays opt-in via `trackAccess=false`.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9922:- **Why it matters for us**: If Public adds a due/review queue without defining one authoritative source of truth for “due,” the queue can drift from actual search behavior. A memory can look overdue while recent read activity updated its effective retrievability, which would make the inbox feel unreliable.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9940:### Finding 1: Rank 1 (20/25) — explicit `memory_review` is the first thing Public should ship
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9942:- **What it does**: Modus exposes an explicit `memory_reinforce` operator action on top of its FSRS state. Public already has the underlying pieces: graded review math (`AGAIN/HARD/GOOD/EASY`), `processReview()` with `nextReviewDate`, and opt-in strengthening-on-access. The current exposed adjacent surface is `memory_validate`, which records only `wasUseful` feedback and does not let an operator issue a graded FSRS review.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9943:- **Why it matters for us**: This is the highest impact x feasibility transfer because it closes the clearest control-plane gap without inventing new storage or changing retrieval architecture. It also de-risks the bigger `memory_due` idea: until Public has a first-class graded review action, any future review queue would have no trustworthy way to record hard recalls, lapses, and easy wins distinctly.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9947:### Finding 2: Rank 2 (15/25, tie-broken ahead) — a doctor-style summary should ship in the same tranche as `memory_review`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9950:- **Why it matters for us**: This is nearly pure formatter work and improves operator trust immediately. It ranks ahead of `memory_due` despite lower raw strategic upside because it is safer, independent, and can ship without any FSRS contract decisions.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9954:### Finding 3: Rank 3 (15/25, tie-broken behind) — `memory_due` is the biggest strategic win, but only after a due-state contract is fixed
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9956:- **What it does**: Modus exposes the full review lifecycle visibly: search recall, explicit reinforce, decay, and archive all operate over the same fact state. Public already stores `stability`, `difficulty`, `last_review`, `review_count`, and `last_accessed`, and `processReview()` computes `nextReviewDate`, but no persisted `next_review_at` column exists and write-on-read remains opt-in through `trackAccess=false`.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9963:- **What it does**: Modus exposes `memory_reinforce`, but only as a success-only reinforce action. Public already has the stronger primitive: graded FSRS review (`AGAIN/HARD/GOOD/EASY`) plus computed `nextReviewDate`, yet the exposed adjacent tool is only `memory_validate(wasUseful)`, which adjusts confidence rather than recording a real review event.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9964:- **Why it matters for us**: This closes the clearest control-plane gap without changing retrieval architecture. It also makes any later review queue trustworthy because review history would record hard recalls and lapses, not only “useful / not useful.”
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:10009:`Code_Environment/Public` already has Spec Kit Memory with semantic and hybrid retrieval, markdown-backed memory artifacts, importance tiers, and an FSRS-based classification-decay layer in the MCP server. It does **not** currently mirror Modus Memory's end-to-end local vault server model, BM25 field-boosted lexical search with lightweight query caching, librarian-style synonym expansion for keyword retrieval, or simple subject/tag/entity adjacency maps that surface connected documents directly in result sets. Base the comparison on current code, not stale assumptions.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:10017:5. After FSRS, inspect cross-referencing by reading `external/modus-memory-main/internal/index/crossref.go`. Trace how subject, tag, and entity adjacency maps are built, what weighting is used for connected results, and what the system deliberately does **not** do because it avoids a full graph database.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:10049:10. Which Modus patterns would best improve query-time recall in `Code_Environment/Public`: BM25 field boosts, query caching, lexical expansion, connected-result hints, or simpler markdown-vault ergonomics?
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:10101:- MCP tool handlers that expose search, memory, reinforcement, decay, and connected-doc surfaces
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:10644:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:7952:- **What it does**: Modus builds three adjacency maps (`bySubject`, `byTag`, `byEntity`), scores connected docs with fixed weights (subject `3.0`, entity `2.0`, tag `1.0`), and appends connected-doc hints to search responses. The “second pass” only checks title and subject for entity mentions even though the comments imply broader body linkage.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:10645:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:7953:- **Why it matters for us**: This is weaker than our causal/code-graph style signal layers, but it is much easier to expose to users as understandable “connected docs” rather than invisible score boosts.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:10686:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:8047:- **What it does**: Modus builds three adjacency maps (`bySubject`, `byTag`, `byEntity`), scores connected docs with fixed weights (subject `3.0`, entity `2.0`, tag `1.0`), and appends connected-doc hints to search responses. The “second pass” only checks title and subject for entity mentions even though the comments imply broader body linkage.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:10687:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:8048:- **Why it matters for us**: This is weaker than our causal/code-graph style signal layers, but it is much easier to expose to users as understandable “connected docs” rather than invisible score boosts.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:10723:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:8134:- **What it does**: `vault_write`, `memory_store`, and `ReinforceFact` mutate markdown files directly. But `vault_search`, `vault_connected`, and `memory_search` only read the prebuilt in-memory `Index`, `factStore`, and `crossIndex`. Meanwhile `vault_list` and `memory_facts` rescan disk live, so they can see writes the search path cannot.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:10849:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:8439:- **What it does**: Modus builds adjacency maps keyed by normalized subject, tag, and entity name, then scores connected docs with fixed weights `subject=3`, `entity=2`, `tag=1`. This is cheap and useful for related-document surfacing. But it is intentionally shallow: no traversal, no causal semantics, and the “scan title/body for entity mentions” comment only checks title and subject in code. Public already has richer graph-aware ranking signals, causal boost, and structural freshness augmentation.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:10899:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:8597:- **Why it matters for us**: The useful idea here is **write mediation**, not Modus’s implementation. In source, “single writer” is a prompt convention, so any connected client can mutate persistent state directly. Public already has the harder part: actual scope/governance enforcement.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:10949:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:8709:### Finding 4: Modus’s best retrieval-specific pattern is not its graph model, but its explicit “connected docs not in top hits” appendix
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:10950:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:8711:- **What it does**: Modus builds cheap adjacency maps over markdown documents only: shared subject gets weight `3.0`, entity `2.0`, tag `1.0`, then `vault_search` appends connected documents that were not already returned. Public’s code-graph and CocoIndex are stronger, but they solve different problems: `code_graph_query/context` answer structural code questions, and CocoIndex is the semantic code-search bridge. Neither is the same as “show me adjacent memory docs I might also want right now.”
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:10951:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:8712:- **Why it matters for us**: This is additive, not competitive. Public should not replace causal memory or code graph with Modus-style string adjacency, but a small connected-memory appendix for markdown artifacts could improve exploration and follow-on recall without disturbing the existing routing split of memory vs semantic code vs structural code.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:11019:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:8894:- **What it does**: Modus builds an in-memory `bySubject`/`byTag`/`byEntity` cross-index, scores connections with fixed weights (subject `3.0`, entity `2.0`, tag `1.0`), and appends connected docs to search results or returns them via `vault_connected`. Public stores typed causal edges (`caused`, `enabled`, `supersedes`, `contradicts`, `derived_from`, `supports`), exposes traversal in both directions, tracks graph coverage/orphans, records `weight_history`, and applies contradiction detection and edge bounds.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:11097:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9076:### Finding 5: **If we want Modus-style “connected docs” ergonomics, add them as a formatter over existing graph evidence, not as a new index**
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:11098:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9078:- **What it does**: Modus appends a lightweight connected-doc block after primary results using fixed subject/entity/tag weights. Public already computes and exposes graph contribution metadata in the pipeline response, but it does not currently turn that into a first-class “you may also want these linked memories” presentation block.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:11131:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9170:- **Why it matters for us**: This suggests a second major shift: memory should not only help answer questions; it should also expose what work is blocked, what is ready, and what knowledge dependencies remain unresolved. That would pair naturally with the proposal inbox and review queue ideas.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:11206:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9397:- **What it does**: Startup logs `index build failed` and claims it can continue, but `main.go` still calls `idx.DocCount()` even when `index.Build()` returned `nil, err`. The MCP layer also assumes an index exists: `memory_search` calls `v.Index.SearchFacts(...)` directly, while only the lower-level `Vault.SearchFacts()` method contains a no-index fallback. `vault_connected` also just returns `"Index not loaded."` rather than recovering.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:11242:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9494:### Finding 1: **Medium integration** — operator-visible review queue is the highest-value Modus pattern
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:11243:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9496:- **What it does**: Modus makes the full decay loop visible: `memory_search` reinforces recalled facts, `memory_decay_facts` runs the sweep, `memory_archive_stale` archives low-confidence facts, `memory_reinforce` lets an operator review a fact directly, and result formatting exposes tier/staleness cues. Public already has the harder backend pieces: FSRS columns in `memory_index`, canonical review math, strengthening-on-access, and archival machinery. The missing piece is a first-class due/review queue.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:11257:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9515:### Finding 4: **Medium integration** — connected-doc hints are feasible, but should stay explanatory first
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:11258:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9517:- **What it does**: Modus builds an in-memory metadata adjacency map from subject/tag/entity overlap, weights subject/entity/tag at `3/2/1`, and appends “connected” documents that were not in the main ranked set. Public already has stronger structural enrichment—causal-neighbor boost, neighbor injection, and co-activation spreading—but those are graph-driven, not simple frontmatter co-membership summaries.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:11263:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9524:- **What it does**: Modus exposes both automatic reinforcement on recall and an explicit `memory_reinforce` tool. Public already has the underlying grade model (`AGAIN/HARD/GOOD/EASY`), review processing, and strengthening-on-access logic, but keeps write-back behind `trackAccess=false` and has no first-class `memory_reinforce`/`memory_review` tool in the current schema set.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:11274:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9588:### Finding 1: Review queue risk — a Public `memory_due` inbox will be misleading unless it gets a first-class due-state contract
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:11275:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9590:- **What it does**: Modus keeps search recall, explicit reinforce, decay, and archive on the same fact fields. Public already persists `access_count`, `last_accessed`, `stability`, `difficulty`, `last_review`, and `review_count`, and `processReview()` computes `nextReviewDate`, but that due date is not persisted and read-time strengthening stays opt-in via `trackAccess=false`.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:11276:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9591:- **Why it matters for us**: If Public adds a due/review queue without defining one authoritative source of truth for “due,” the queue can drift from actual search behavior. A memory can look overdue while recent read activity updated its effective retrievability, which would make the inbox feel unreliable.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:11296:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9619:- **Why it matters for us**: If Public copies Modus literally, every explicit review starts looking like successful recall. That biases histories upward and makes any later due/review queue less trustworthy because “hard” or failed recall events have no first-class path.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:11306:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9674:### Finding 1: Rank 1 (20/25) — explicit `memory_review` is the first thing Public should ship
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:11307:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9676:- **What it does**: Modus exposes an explicit `memory_reinforce` operator action on top of its FSRS state. Public already has the underlying pieces: graded review math (`AGAIN/HARD/GOOD/EASY`), `processReview()` with `nextReviewDate`, and opt-in strengthening-on-access. The current exposed adjacent surface is `memory_validate`, which records only `wasUseful` feedback and does not let an operator issue a graded FSRS review.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:11308:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9677:- **Why it matters for us**: This is the highest impact x feasibility transfer because it closes the clearest control-plane gap without inventing new storage or changing retrieval architecture. It also de-risks the bigger `memory_due` idea: until Public has a first-class graded review action, any future review queue would have no trustworthy way to record hard recalls, lapses, and easy wins distinctly.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:11311:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9681:### Finding 2: Rank 2 (15/25, tie-broken ahead) — a doctor-style summary should ship in the same tranche as `memory_review`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:11313:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9684:- **Why it matters for us**: This is nearly pure formatter work and improves operator trust immediately. It ranks ahead of `memory_due` despite lower raw strategic upside because it is safer, independent, and can ship without any FSRS contract decisions.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:11316:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9688:### Finding 3: Rank 3 (15/25, tie-broken behind) — `memory_due` is the biggest strategic win, but only after a due-state contract is fixed
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:11317:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9690:- **What it does**: Modus exposes the full review lifecycle visibly: search recall, explicit reinforce, decay, and archive all operate over the same fact state. Public already stores `stability`, `difficulty`, `last_review`, `review_count`, and `last_accessed`, and `processReview()` computes `nextReviewDate`, but no persisted `next_review_at` column exists and write-on-read remains opt-in through `trackAccess=false`.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:11321:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9695:### Finding 4: Rank 4 (9/25) — connected-doc hints are worth prototyping only as an explanation lane
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:11322:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9697:- **What it does**: Modus builds a lightweight adjacency layer from subject/tag/entity overlap and appends “connected docs not in results above” as an extra hint surface. Public already has stronger graph-backed enrichment via causal boosts, neighbor injection, and co-activation, but not a simple metadata-derived explanation appendix.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:11332:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9711:- **What it does**: The ranking resolves into a four-phase roadmap: **Phase 1** ship `memory_review` plus a doctor-style summary; **Phase 2** define the authoritative due-state contract and then add `memory_due`; **Phase 3** pilot connected-doc explanations as a non-scoring appendix; **Phase 4** run a feature-flagged lexical-expansion experiment only on weak-result fallback paths.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:11345:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9773:- **What it does**: Modus exposes `memory_reinforce`, but only as a success-only reinforce action. Public already has the stronger primitive: graded FSRS review (`AGAIN/HARD/GOOD/EASY`) plus computed `nextReviewDate`, yet the exposed adjacent tool is only `memory_validate(wasUseful)`, which adjusts confidence rather than recording a real review event.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:11346:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9774:- **Why it matters for us**: This closes the clearest control-plane gap without changing retrieval architecture. It also makes any later review queue trustworthy because review history would record hard recalls and lapses, not only “useful / not useful.”
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:11359:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9792:### Finding 4: `memory_due` is real product value, but it needs an authoritative due-state contract first
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:11360:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9794:- **What it does**: Modus visibly ties search recall, reinforce, decay, and archive to one fact state. Public already stores `stability`, `difficulty`, `last_review`, `review_count`, and opt-in access effects, and computes `nextReviewDate`, but does not expose an operator-facing due queue.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:11370:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:9808:- **What it does**: Modus builds lightweight subject/entity/tag adjacency and appends connected docs that did not make the main ranked list. The weighting is simple and fixed (`subject 3`, `entity 2`, `tag 1`).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:13179:**Executive summary:** Borrow **Modus’s operator surfaces**, not its weaker retrieval shortcuts. **Adopt now:** graded `memory_review`, doctor-style summary, and a strict one-retrieval-core rule. **New feature needed:** authoritative `memory_due` and a durable proposal inbox. **Prototype later:** connected-doc appendix, weak-result lexical fallback, and content-level contradiction linting. **Reject:** fuzzy result-cache reuse, permissive markdown ingestion, default write-on-read as policy, and unenforced trust-stage metadata.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:13185:- **What it does**: Modus exposes `memory_reinforce`, but only as a success-only reinforce action. Public already has the stronger primitive: graded FSRS review (`AGAIN/HARD/GOOD/EASY`) plus computed `nextReviewDate`, yet the exposed adjacent tool is only `memory_validate(wasUseful)`, which adjusts confidence rather than recording a real review event.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:13186:- **Why it matters for us**: This closes the clearest control-plane gap without changing retrieval architecture. It also makes any later review queue trustworthy because review history would record hard recalls and lapses, not only “useful / not useful.”
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:13204:### Finding 4: `memory_due` is real product value, but it needs an authoritative due-state contract first
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:13206:- **What it does**: Modus visibly ties search recall, reinforce, decay, and archive to one fact state. Public already stores `stability`, `difficulty`, `last_review`, `review_count`, and opt-in access effects, and computes `nextReviewDate`, but does not expose an operator-facing due queue.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:13220:- **What it does**: Modus builds lightweight subject/entity/tag adjacency and appends connected docs that did not make the main ranked list. The weighting is simple and fixed (`subject 3`, `entity 2`, `tag 1`).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:13884:    13	// This is Option A from the knowledge graph discussion: connected search results
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:13888:    17	// DocRef is a lightweight reference to a connected document.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:13899:    28		bySubject map[string][]DocRef // lowercase subject → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:13900:    29		byTag     map[string][]DocRef // tag → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:13901:    30		byEntity  map[string][]DocRef // entity name → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:13986:   115	// ForSubject returns all documents connected to a subject (case-insensitive).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:14012:   141	// ForEntity returns all documents connected to an entity.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:14119:   248	// FormatConnected returns a human-readable string of connected documents.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:16106:   901		srv.AddTool("vault_connected", "Find all documents connected to a subject, entity, or tag. Returns facts, beliefs, entities, articles, learnings, and missions that share references.", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:16554:    70	  nextReviewDate: string;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:16691:   207	  const nextReviewDate = getNextReviewDate(newStability);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:16698:   214	    nextReviewDate,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:17044:   449	    hints.push('Database not connected - restart MCP server');
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:17589:  9767	**Executive summary:** Borrow **Modus’s operator surfaces**, not its weaker retrieval shortcuts. **Adopt now:** graded `memory_review`, doctor-style summary, and a strict one-retrieval-core rule. **New feature needed:** authoritative `memory_due` and a durable proposal inbox. **Prototype later:** connected-doc appendix, weak-result lexical fallback, and content-level contradiction linting. **Reject:** fuzzy result-cache reuse, permissive markdown ingestion, default write-on-read as policy, and unenforced trust-stage metadata.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:17595:  9773	- **What it does**: Modus exposes `memory_reinforce`, but only as a success-only reinforce action. Public already has the stronger primitive: graded FSRS review (`AGAIN/HARD/GOOD/EASY`) plus computed `nextReviewDate`, yet the exposed adjacent tool is only `memory_validate(wasUseful)`, which adjusts confidence rather than recording a real review event.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:17596:  9774	- **Why it matters for us**: This closes the clearest control-plane gap without changing retrieval architecture. It also makes any later review queue trustworthy because review history would record hard recalls and lapses, not only “useful / not useful.”
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:17614:  9792	### Finding 4: `memory_due` is real product value, but it needs an authoritative due-state contract first
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:17616:  9794	- **What it does**: Modus visibly ties search recall, reinforce, decay, and archive to one fact state. Public already stores `stability`, `difficulty`, `last_review`, `review_count`, and opt-in access effects, and computes `nextReviewDate`, but does not expose an operator-facing due queue.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:17630:  9808	- **What it does**: Modus builds lightweight subject/entity/tag adjacency and appends connected docs that did not make the main ranked list. The weighting is simple and fixed (`subject 3`, `entity 2`, `tag 1`).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:17707:- **What it does**: Each system’s highest-value ideas are workflow primitives: exact recall lanes, repair briefs, compaction checkpoints, status hints, review queues, due queues, and proposal inboxes.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:17715:- **Why it matters**: This is the clearest thing Modus contributes that the other four phases do not. It makes `memory_review` the strongest immediate Modus-derived transfer, and it makes `memory_due` the next gated feature after the review contract is real.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:17721:- **What it does**: Modus builds subject/entity/tag adjacency in memory, scores it with fixed weights (`3/2/1`), and returns it as connected material beside the main result set instead of pretending it is a full causal graph.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:17738:Turn the converged adopt-now set into one cross-phase implementation tranche: exact-key recall, doctor summary, compaction-time checkpoint, bootstrap memory hints, and static markdown integrity. After that, open a second design tranche for `memory_review`, `memory_due`, and a durable proposal inbox so the strongest Modus-specific ideas land behind an explicit control-plane contract.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:17767:- **What it does**: Each system’s highest-value ideas are workflow primitives: exact recall lanes, repair briefs, compaction checkpoints, status hints, review queues, due queues, and proposal inboxes.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:17775:- **Why it matters**: This is the clearest thing Modus contributes that the other four phases do not. It makes `memory_review` the strongest immediate Modus-derived transfer, and it makes `memory_due` the next gated feature after the review contract is real.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:17781:- **What it does**: Modus builds subject/entity/tag adjacency in memory, scores it with fixed weights (`3/2/1`), and returns it as connected material beside the main result set instead of pretending it is a full causal graph.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:17798:Turn the converged adopt-now set into one cross-phase implementation tranche: exact-key recall, doctor summary, compaction-time checkpoint, bootstrap memory hints, and static markdown integrity. After that, open a second design tranche for `memory_review`, `memory_due`, and a durable proposal inbox so the strongest Modus-specific ideas land behind an explicit control-plane contract.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:17810:### Finding 1: Review queue risk — a Public `memory_due` inbox will be misleading unless it gets a first-class due-state contract
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:17812:- **What it does**: Modus keeps search recall, explicit reinforce, decay, and archive on the same fact fields. Public already persists `access_count`, `last_accessed`, `stability`, `difficulty`, `last_review`, and `review_count`, and `processReview()` computes `nextReviewDate`, but that due date is not persisted and read-time strengthening stays opt-in via `trackAccess=false`.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:17813:- **Why it matters for us**: If Public adds a due/review queue without defining one authoritative source of truth for “due,” the queue can drift from actual search behavior. A memory can look overdue while recent read activity updated its effective retrievability, which would make the inbox feel unreliable.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:17831:### Finding 1: Rank 1 (20/25) — explicit `memory_review` is the first thing Public should ship
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:17833:- **What it does**: Modus exposes an explicit `memory_reinforce` operator action on top of its FSRS state. Public already has the underlying pieces: graded review math (`AGAIN/HARD/GOOD/EASY`), `processReview()` with `nextReviewDate`, and opt-in strengthening-on-access. The current exposed adjacent surface is `memory_validate`, which records only `wasUseful` feedback and does not let an operator issue a graded FSRS review.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:17834:- **Why it matters for us**: This is the highest impact x feasibility transfer because it closes the clearest control-plane gap without inventing new storage or changing retrieval architecture. It also de-risks the bigger `memory_due` idea: until Public has a first-class graded review action, any future review queue would have no trustworthy way to record hard recalls, lapses, and easy wins distinctly.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:17844:- **Why it matters**: This is the clearest thing Modus contributes that the other four phases do not. It makes `memory_review` the strongest immediate Modus-derived transfer, and it makes `memory_due` the next gated feature after the review contract is real.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:17850:- **What it does**: Modus builds subject/entity/tag adjacency in memory, scores it with fixed weights (`3/2/1`), and returns it as connected material beside the main result set instead of pretending it is a full causal graph.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:17867:Turn the converged adopt-now set into one cross-phase implementation tranche: exact-key recall, doctor summary, compaction-time checkpoint, bootstrap memory hints, and static markdown integrity. After that, open a second design tranche for `memory_review`, `memory_due`, and a durable proposal inbox so the strongest Modus-specific ideas land behind an explicit control-plane contract.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:17897:`Code_Environment/Public` already has Spec Kit Memory with semantic and hybrid retrieval, markdown-backed memory artifacts, importance tiers, and an FSRS-based classification-decay layer in the MCP server. It does **not** currently mirror Modus Memory's end-to-end local vault server model, BM25 field-boosted lexical search with lightweight query caching, librarian-style synonym expansion for keyword retrieval, or simple subject/tag/entity adjacency maps that surface connected documents directly in result sets. Base the comparison on current code, not stale assumptions.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:17905:5. After FSRS, inspect cross-referencing by reading `external/modus-memory-main/internal/index/crossref.go`. Trace how subject, tag, and entity adjacency maps are built, what weighting is used for connected results, and what the system deliberately does **not** do because it avoids a full graph database.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:17937:10. Which Modus patterns would best improve query-time recall in `Code_Environment/Public`: BM25 field boosts, query caching, lexical expansion, connected-result hints, or simpler markdown-vault ergonomics?
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:17989:- MCP tool handlers that expose search, memory, reinforcement, decay, and connected-doc surfaces
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:18078:/bin/zsh -lc 'rg -n "memory_review|doctor|executePipeline|memory_search|memory-crud-health|tool-schemas|fsrs-scheduler|modu[s]?" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:18080:157:- rollout_summaries/2026-04-09T10-35-53-UGDf-009_post_save_render_fixes_memory_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T12-35-53-019d71d0-0ec5-7c80-a08b-6d336ee5c639.jsonl, updated_at=2026-04-09T12:01:25+00:00, thread_id=019d71d0-0ec5-7c80-a08b-6d336ee5c639)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:18097:1869:- rollout_summaries/2026-03-13T11-01-44-IBXE-outsourced_agent_memory_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/13/rollout-2026-03-13T12-01-44-019ce6dc-0509-7630-9874-db11f57a9e06.jsonl, updated_at=2026-03-13T11:21:38+00:00, thread_id=019ce6dc-0509-7630-9874-db11f57a9e06)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:18170:I’ve got the phase folder and prior memory hit that points to recent `memory_review` work, which is useful because one of the blueprints almost certainly needs to land cleanly on that newer control-plane surface. Next I’m reading the exact runtime files and the latest phase notes so the blueprint can reference real handler boundaries instead of generic suggestions.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:18181:- rollout_summaries/2026-04-09T10-35-53-UGDf-009_post_save_render_fixes_memory_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T12-35-53-019d71d0-0ec5-7c80-a08b-6d336ee5c639.jsonl, updated_at=2026-04-09T12:01:25+00:00, thread_id=019d71d0-0ec5-7c80-a08b-6d336ee5c639)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:18425:### Finding 1: Review queue risk — a Public `memory_due` inbox will be misleading unless it gets a first-class due-state contract
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:18427:- **What it does**: Modus keeps search recall, explicit reinforce, decay, and archive on the same fact fields. Public already persists `access_count`, `last_accessed`, `stability`, `difficulty`, `last_review`, and `review_count`, and `processReview()` computes `nextReviewDate`, but that due date is not persisted and read-time strengthening stays opt-in via `trackAccess=false`.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:18428:- **Why it matters for us**: If Public adds a due/review queue without defining one authoritative source of truth for “due,” the queue can drift from actual search behavior. A memory can look overdue while recent read activity updated its effective retrievability, which would make the inbox feel unreliable.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:18446:### Finding 1: Rank 1 (20/25) — explicit `memory_review` is the first thing Public should ship
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:18448:- **What it does**: Modus exposes an explicit `memory_reinforce` operator action on top of its FSRS state. Public already has the underlying pieces: graded review math (`AGAIN/HARD/GOOD/EASY`), `processReview()` with `nextReviewDate`, and opt-in strengthening-on-access. The current exposed adjacent surface is `memory_validate`, which records only `wasUseful` feedback and does not let an operator issue a graded FSRS review.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:18449:- **Why it matters for us**: This is the highest impact x feasibility transfer because it closes the clearest control-plane gap without inventing new storage or changing retrieval architecture. It also de-risks the bigger `memory_due` idea: until Public has a first-class graded review action, any future review queue would have no trustworthy way to record hard recalls, lapses, and easy wins distinctly.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:18453:### Finding 2: Rank 2 (15/25, tie-broken ahead) — a doctor-style summary should ship in the same tranche as `memory_review`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:18456:- **Why it matters for us**: This is nearly pure formatter work and improves operator trust immediately. It ranks ahead of `memory_due` despite lower raw strategic upside because it is safer, independent, and can ship without any FSRS contract decisions.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:18460:### Finding 3: Rank 3 (15/25, tie-broken behind) — `memory_due` is the biggest strategic win, but only after a due-state contract is fixed
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:18462:- **What it does**: Modus exposes the full review lifecycle visibly: search recall, explicit reinforce, decay, and archive all operate over the same fact state. Public already stores `stability`, `difficulty`, `last_review`, `review_count`, and `last_accessed`, and `processReview()` computes `nextReviewDate`, but no persisted `next_review_at` column exists and write-on-read remains opt-in through `trackAccess=false`.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:18469:- **What it does**: Modus exposes `memory_reinforce`, but only as a success-only reinforce action. Public already has the stronger primitive: graded FSRS review (`AGAIN/HARD/GOOD/EASY`) plus computed `nextReviewDate`, yet the exposed adjacent tool is only `memory_validate(wasUseful)`, which adjusts confidence rather than recording a real review event.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:18470:- **Why it matters for us**: This closes the clearest control-plane gap without changing retrieval architecture. It also makes any later review queue trustworthy because review history would record hard recalls and lapses, not only “useful / not useful.”
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:18515:`Code_Environment/Public` already has Spec Kit Memory with semantic and hybrid retrieval, markdown-backed memory artifacts, importance tiers, and an FSRS-based classification-decay layer in the MCP server. It does **not** currently mirror Modus Memory's end-to-end local vault server model, BM25 field-boosted lexical search with lightweight query caching, librarian-style synonym expansion for keyword retrieval, or simple subject/tag/entity adjacency maps that surface connected documents directly in result sets. Base the comparison on current code, not stale assumptions.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:18523:5. After FSRS, inspect cross-referencing by reading `external/modus-memory-main/internal/index/crossref.go`. Trace how subject, tag, and entity adjacency maps are built, what weighting is used for connected results, and what the system deliberately does **not** do because it avoids a full graph database.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:18555:10. Which Modus patterns would best improve query-time recall in `Code_Environment/Public`: BM25 field boosts, query caching, lexical expansion, connected-result hints, or simpler markdown-vault ergonomics?
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:18607:- MCP tool handlers that expose search, memory, reinforcement, decay, and connected-doc surfaces
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:18640:The shape is tightening up: the likely blueprint set is `memory_review`, a doctor-style summary over existing health machinery, and a “one retrieval core” wrapper pattern so new surfaces do not fork ranking logic. I’m validating that against the current TypeScript handlers and schemas now, including whether any `memory_review` work already landed yesterday so I can build on current reality instead of duplicating it.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:18795:      hints.push('Database not connected - restart MCP server');
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:18898:    hints.push('Database not connected - restart MCP server');
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:19124:  nextReviewDate: string;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:19261:  const nextReviewDate = getNextReviewDate(newStability);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:19268:    nextReviewDate,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:19357:/bin/zsh -lc "rg -n \"memory_review|memoryReview|processReview\\(|ReviewGrade|AGAIN|HARD|GOOD|EASY|trackAccess|nextReviewDate|executePipeline|memory_health|doctor|health\" .opencode/skill/system-spec-kit/mcp_server -g '"'!**/*.map'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:19575:.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:294:      const nextReviewDate = fsrsScheduler.getNextReviewDate(5);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:19576:.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:295:      expect(Number.isNaN(new Date(nextReviewDate).getTime())).toBe(false);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:19590:.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:207:    expect(result).toHaveProperty('nextReviewDate');
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:19602:.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:249:  it('D-08: nextReviewDate is valid future date', () => {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:19604:.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:251:    const nextDate = new Date(result.nextReviewDate);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:19771:.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:70:  nextReviewDate: string;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:19779:.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:207:  const nextReviewDate = getNextReviewDate(newStability);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:19780:.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:214:    nextReviewDate,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:19792:.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:316:// result = { stability, difficulty, lastReview, reviewCount, nextReviewDate, retrievability }
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:19800:.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:186:        nextReviewDate: new Date().toISOString(),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:21252:**Executive summary:** Borrow **Modus’s operator surfaces**, not its weaker retrieval shortcuts. **Adopt now:** graded `memory_review`, doctor-style summary, and a strict one-retrieval-core rule. **New feature needed:** authoritative `memory_due` and a durable proposal inbox. **Prototype later:** connected-doc appendix, weak-result lexical fallback, and content-level contradiction linting. **Reject:** fuzzy result-cache reuse, permissive markdown ingestion, default write-on-read as policy, and unenforced trust-stage metadata.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:21258:- **What it does**: Modus exposes `memory_reinforce`, but only as a success-only reinforce action. Public already has the stronger primitive: graded FSRS review (`AGAIN/HARD/GOOD/EASY`) plus computed `nextReviewDate`, yet the exposed adjacent tool is only `memory_validate(wasUseful)`, which adjusts confidence rather than recording a real review event.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:21259:- **Why it matters for us**: This closes the clearest control-plane gap without changing retrieval architecture. It also makes any later review queue trustworthy because review history would record hard recalls and lapses, not only “useful / not useful.”
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:21277:### Finding 4: `memory_due` is real product value, but it needs an authoritative due-state contract first
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:21279:- **What it does**: Modus visibly ties search recall, reinforce, decay, and archive to one fact state. Public already stores `stability`, `difficulty`, `last_review`, `review_count`, and opt-in access effects, and computes `nextReviewDate`, but does not expose an operator-facing due queue.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:21293:- **What it does**: Modus builds lightweight subject/entity/tag adjacency and appends connected docs that did not make the main ranked list. The weighting is simple and fixed (`subject 3`, `entity 2`, `tag 1`).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:21385:Turn this synthesis into implementation design: define the Public `memory_review` API first, add a doctor-style formatter over `memory_health`, then write the due-state ADR (`persisted next_review_at` vs deterministic derivation) before scoping `memory_due` and the proposal inbox.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:21694://	memory_reinforce, memory_decay_facts, vault_connected
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:21710:		"vault_connected":   true,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:21763:	srv.AddTool("vault_connected", "Find all documents connected to a subject, entity, or tag. Returns facts, beliefs, entities, articles, learnings, and missions that share references.", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:23025:   157	- rollout_summaries/2026-04-09T10-35-53-UGDf-009_post_save_render_fixes_memory_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T12-35-53-019d71d0-0ec5-7c80-a08b-6d336ee5c639.jsonl, updated_at=2026-04-09T12:01:25+00:00, thread_id=019d71d0-0ec5-7c80-a08b-6d336ee5c639)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:23039:### Finding 1: Ship first-class graded `memory_review`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:23063:4. Keep `nextReviewDate` response-only in tranche 1. Do not add `next_review_at` yet; that belongs to the later due-state ADR.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:23106:- **Why it matters**: Public is already close to this. A small hardening pass now prevents future `memory_due`, appendix, or exact-key surfaces from drifting into parallel ranking behavior.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:23140:Implement blueprint 1 first in a write-enabled pass, then add `memory_health({ reportMode: "doctor" })`, then do the retrieval-core extraction before starting the separate `memory_due` ADR.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:23153:### Finding 1: Ship first-class graded `memory_review`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:23177:4. Keep `nextReviewDate` response-only in tranche 1. Do not add `next_review_at` yet; that belongs to the later due-state ADR.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:23220:- **Why it matters**: Public is already close to this. A small hardening pass now prevents future `memory_due`, appendix, or exact-key surfaces from drifting into parallel ranking behavior.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:23254:Implement blueprint 1 first in a write-enabled pass, then add `memory_health({ reportMode: "doctor" })`, then do the retrieval-core extraction before starting the separate `memory_due` ADR.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:23260:- **What it does**: Modus builds subject/entity/tag adjacency in memory, scores it with fixed weights (`3/2/1`), and returns it as connected material beside the main result set instead of pretending it is a full causal graph.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:23277:Turn the converged adopt-now set into one cross-phase implementation tranche: exact-key recall, doctor summary, compaction-time checkpoint, bootstrap memory hints, and static markdown integrity. After that, open a second design tranche for `memory_review`, `memory_due`, and a durable proposal inbox so the strongest Modus-specific ideas land behind an explicit control-plane contract.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:23281:### Finding 1: Review queue risk — a Public `memory_due` inbox will be misleading unless it gets a first-class due-state contract
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:23283:- **What it does**: Modus keeps search recall, explicit reinforce, decay, and archive on the same fact fields. Public already persists `access_count`, `last_accessed`, `stability`, `difficulty`, `last_review`, and `review_count`, and `processReview()` computes `nextReviewDate`, but that due date is not persisted and read-time strengthening stays opt-in via `trackAccess=false`.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:23284:- **Why it matters for us**: If Public adds a due/review queue without defining one authoritative source of truth for “due,” the queue can drift from actual search behavior. A memory can look overdue while recent read activity updated its effective retrievability, which would make the inbox feel unreliable.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:23302:### Finding 1: Rank 1 (20/25) — explicit `memory_review` is the first thing Public should ship
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:23304:- **What it does**: Modus exposes an explicit `memory_reinforce` operator action on top of its FSRS state. Public already has the underlying pieces: graded review math (`AGAIN/HARD/GOOD/EASY`), `processReview()` with `nextReviewDate`, and opt-in strengthening-on-access. The current exposed adjacent surface is `memory_validate`, which records only `wasUseful` feedback and does not let an operator issue a graded FSRS review.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:23305:- **Why it matters for us**: This is the highest impact x feasibility transfer because it closes the clearest control-plane gap without inventing new storage or changing retrieval architecture. It also de-risks the bigger `memory_due` idea: until Public has a first-class graded review action, any future review queue would have no trustworthy way to record hard recalls, lapses, and easy wins distinctly.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:23338:Implement blueprint 1 first in a write-enabled pass, then add `memory_health({ reportMode: "doctor" })`, then do the retrieval-core extraction before starting the separate `memory_due` ADR.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:23368:`Code_Environment/Public` already has Spec Kit Memory with semantic and hybrid retrieval, markdown-backed memory artifacts, importance tiers, and an FSRS-based classification-decay layer in the MCP server. It does **not** currently mirror Modus Memory's end-to-end local vault server model, BM25 field-boosted lexical search with lightweight query caching, librarian-style synonym expansion for keyword retrieval, or simple subject/tag/entity adjacency maps that surface connected documents directly in result sets. Base the comparison on current code, not stale assumptions.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:23376:5. After FSRS, inspect cross-referencing by reading `external/modus-memory-main/internal/index/crossref.go`. Trace how subject, tag, and entity adjacency maps are built, what weighting is used for connected results, and what the system deliberately does **not** do because it avoids a full graph database.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:23408:10. Which Modus patterns would best improve query-time recall in `Code_Environment/Public`: BM25 field boosts, query caching, lexical expansion, connected-result hints, or simpler markdown-vault ergonomics?
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:23460:- MCP tool handlers that expose search, memory, reinforcement, decay, and connected-doc surfaces
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:23549:/bin/zsh -lc 'rg -n "modus|memory_review|memory_due|FSRS|decay|retention" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:23553:157:- rollout_summaries/2026-04-09T10-35-53-UGDf-009_post_save_render_fixes_memory_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T12-35-53-019d71d0-0ec5-7c80-a08b-6d336ee5c639.jsonl, updated_at=2026-04-09T12:01:25+00:00, thread_id=019d71d0-0ec5-7c80-a08b-6d336ee5c639)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:23556:1869:- rollout_summaries/2026-03-13T11-01-44-IBXE-outsourced_agent_memory_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/13/rollout-2026-03-13T12-01-44-019ce6dc-0509-7630-9874-db11f57a9e06.jsonl, updated_at=2026-03-13T11:21:38+00:00, thread_id=019ce6dc-0509-7630-9874-db11f57a9e06)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:23781:I’ve loaded the deep-research skill baseline and the memory pass mostly confirms prior momentum around `memory_review` and review-related retention work. Next I’m tracing the exact decay and recall mechanics in Modus and our FSRS scheduler so this iteration can focus on temporal policy, not generic retrieval overlap.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:24356:  nextReviewDate: string;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:24493:  const nextReviewDate = getNextReviewDate(newStability);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:24500:    nextReviewDate,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:24582: * highly connected knowledge is more reliably accessible over time.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:24690:	srv.AddTool("vault_connected", "Find all documents connected to a subject, entity, or tag. Returns facts, beliefs, entities, articles, learnings, and missions that share references.", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:24830://	memory_reinforce, memory_decay_facts, vault_connected
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:24846:		"vault_connected":   true,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:25046:// This is Option A from the knowledge graph discussion: connected search results
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:25050:// DocRef is a lightweight reference to a connected document.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:25061:	bySubject map[string][]DocRef // lowercase subject → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:25062:	byTag     map[string][]DocRef // tag → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:25063:	byEntity  map[string][]DocRef // entity name → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:25148:// ForSubject returns all documents connected to a subject (case-insensitive).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:25174:// ForEntity returns all documents connected to an entity.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:25296:`Code_Environment/Public` already has Spec Kit Memory with semantic and hybrid retrieval, markdown-backed memory artifacts, importance tiers, and an FSRS-based classification-decay layer in the MCP server. It does **not** currently mirror Modus Memory's end-to-end local vault server model, BM25 field-boosted lexical search with lightweight query caching, librarian-style synonym expansion for keyword retrieval, or simple subject/tag/entity adjacency maps that surface connected documents directly in result sets. Base the comparison on current code, not stale assumptions.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:25304:5. After FSRS, inspect cross-referencing by reading `external/modus-memory-main/internal/index/crossref.go`. Trace how subject, tag, and entity adjacency maps are built, what weighting is used for connected results, and what the system deliberately does **not** do because it avoids a full graph database.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:25336:10. Which Modus patterns would best improve query-time recall in `Code_Environment/Public`: BM25 field boosts, query caching, lexical expansion, connected-result hints, or simpler markdown-vault ergonomics?
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:25388:- MCP tool handlers that expose search, memory, reinforcement, decay, and connected-doc surfaces
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:25763:/bin/zsh -lc "rg -n \"nextReviewDate|processReview\\(|trackAccess|review_count|last_review|stability|difficulty|retrievability|due\" .opencode/skill/system-spec-kit/mcp_server -g '*.ts'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:26662:.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:294:      const nextReviewDate = fsrsScheduler.getNextReviewDate(5);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:26663:.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:295:      expect(Number.isNaN(new Date(nextReviewDate).getTime())).toBe(false);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:26711:.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:186:        nextReviewDate: new Date().toISOString(),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:26775:.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:207:    expect(result).toHaveProperty('nextReviewDate');
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:26793:.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:249:  it('D-08: nextReviewDate is valid future date', () => {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:26795:.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:251:    const nextDate = new Date(result.nextReviewDate);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:26809:.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:70:  nextReviewDate: string;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:26840:.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:207:  const nextReviewDate = getNextReviewDate(newStability);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:26843:.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:214:    nextReviewDate,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:27511:| `vault_connected` | Cross-reference query — find everything linked to a subject, tag, or entity |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:28595:   901		srv.AddTool("vault_connected", "Find all documents connected to a subject, entity, or tag. Returns facts, beliefs, entities, articles, learnings, and missions that share references.", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:28678:    70	  nextReviewDate: string;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:28815:   207	  const nextReviewDate = getNextReviewDate(newStability);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:28822:   214	    nextReviewDate,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:29609:Define a canonical recall-event contract for Public first: decide whether ordinary search hits should refresh lifetime, persist a real due-state projection on top of existing FSRS fields, and expose that through `memory_review` plus a visible `memory_due`/retention surface. After that, test whether Modus-style freshness buckets belong only in an episodic fact lane rather than in canonical memory ranking.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:29663:Define a canonical recall-event contract for Public first: decide whether ordinary search hits should refresh lifetime, persist a real due-state projection on top of existing FSRS fields, and expose that through `memory_review` plus a visible `memory_due`/retention surface. After that, test whether Modus-style freshness buckets belong only in an episodic fact lane rather than in canonical memory ranking.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:29668:Implement blueprint 1 first in a write-enabled pass, then add `memory_health({ reportMode: "doctor" })`, then do the retrieval-core extraction before starting the separate `memory_due` ADR.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:29672:### Finding 1: Review queue risk — a Public `memory_due` inbox will be misleading unless it gets a first-class due-state contract
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:29674:- **What it does**: Modus keeps search recall, explicit reinforce, decay, and archive on the same fact fields. Public already persists `access_count`, `last_accessed`, `stability`, `difficulty`, `last_review`, and `review_count`, and `processReview()` computes `nextReviewDate`, but that due date is not persisted and read-time strengthening stays opt-in via `trackAccess=false`.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:29675:- **Why it matters for us**: If Public adds a due/review queue without defining one authoritative source of truth for “due,” the queue can drift from actual search behavior. A memory can look overdue while recent read activity updated its effective retrievability, which would make the inbox feel unreliable.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:29693:### Finding 1: Rank 1 (20/25) — explicit `memory_review` is the first thing Public should ship
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:29695:- **What it does**: Modus exposes an explicit `memory_reinforce` operator action on top of its FSRS state. Public already has the underlying pieces: graded review math (`AGAIN/HARD/GOOD/EASY`), `processReview()` with `nextReviewDate`, and opt-in strengthening-on-access. The current exposed adjacent surface is `memory_validate`, which records only `wasUseful` feedback and does not let an operator issue a graded FSRS review.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:29696:- **Why it matters for us**: This is the highest impact x feasibility transfer because it closes the clearest control-plane gap without inventing new storage or changing retrieval architecture. It also de-risks the bigger `memory_due` idea: until Public has a first-class graded review action, any future review queue would have no trustworthy way to record hard recalls, lapses, and easy wins distinctly.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:29729:Define a canonical recall-event contract for Public first: decide whether ordinary search hits should refresh lifetime, persist a real due-state projection on top of existing FSRS fields, and expose that through `memory_review` plus a visible `memory_due`/retention surface. After that, test whether Modus-style freshness buckets belong only in an episodic fact lane rather than in canonical memory ranking.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:29759:`Code_Environment/Public` already has Spec Kit Memory with semantic and hybrid retrieval, markdown-backed memory artifacts, importance tiers, and an FSRS-based classification-decay layer in the MCP server. It does **not** currently mirror Modus Memory's end-to-end local vault server model, BM25 field-boosted lexical search with lightweight query caching, librarian-style synonym expansion for keyword retrieval, or simple subject/tag/entity adjacency maps that surface connected documents directly in result sets. Base the comparison on current code, not stale assumptions.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:29767:5. After FSRS, inspect cross-referencing by reading `external/modus-memory-main/internal/index/crossref.go`. Trace how subject, tag, and entity adjacency maps are built, what weighting is used for connected results, and what the system deliberately does **not** do because it avoids a full graph database.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:29799:10. Which Modus patterns would best improve query-time recall in `Code_Environment/Public`: BM25 field boosts, query caching, lexical expansion, connected-result hints, or simpler markdown-vault ergonomics?
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:29851:- MCP tool handlers that expose search, memory, reinforcement, decay, and connected-doc surfaces
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:31880:// This is Option A from the knowledge graph discussion: connected search results
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:31884:// DocRef is a lightweight reference to a connected document.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:31895:	bySubject map[string][]DocRef // lowercase subject → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:31896:	byTag     map[string][]DocRef // tag → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:31897:	byEntity  map[string][]DocRef // entity name → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:31982:// ForSubject returns all documents connected to a subject (case-insensitive).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:32008:// ForEntity returns all documents connected to an entity.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:32115:// FormatConnected returns a human-readable string of connected documents.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:32556:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:14://	memory_reinforce, memory_decay_facts, vault_connected
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:32655:	srv.AddTool("vault_connected", "Find all documents connected to a subject, entity, or tag. Returns facts, beliefs, entities, articles, learnings, and missions that share references.", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:32712://	memory_reinforce, memory_decay_facts, vault_connected
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:32728:		"vault_connected":   true,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:38262:		// Append cross-reference hints — show connected docs the agent might want
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:38278:					sb.WriteString("**Cross-references** (connected docs not in results above):\n")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:38545:    75			// Append cross-reference hints — show connected docs the agent might want
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:38561:    91						sb.WriteString("**Cross-references** (connected docs not in results above):\n")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:40588:    13	// This is Option A from the knowledge graph discussion: connected search results
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:40592:    17	// DocRef is a lightweight reference to a connected document.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:40603:    28		bySubject map[string][]DocRef // lowercase subject → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:40604:    29		byTag     map[string][]DocRef // tag → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:40605:    30		byEntity  map[string][]DocRef // entity name → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:40690:   115	// ForSubject returns all documents connected to a subject (case-insensitive).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:40867:- **What it does**: The README/Librarian pattern promises that a local model prunes and compresses context down to a small handoff, but the MCP code itself only exposes search, expansion, fact recall, and connected-doc hints. The compression layer is an operational pattern around the server, not a typed startup/compaction surface emitted by the server.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:40874:- **What it does**: Modus builds lightweight subject/tag/entity adjacency maps at index time and appends connected documents to search output when they were not already returned by lexical search.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:40875:- **Why it matters**: For compaction recovery, this is the most transferable Modus idea: after we recover the active spec/task, a cheap connected-neighbor pass could widen context without immediately paying for heavier graph or semantic expansion.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:40899:Design a narrow compaction-candidate experiment inside Public’s existing survival stack: add a cheap Modus-style lexical/connected-neighbor preselection lane to `compact-inject` or resume synthesis, but keep `session_bootstrap` / `session_resume` / `memory_context(resume)` as the only authoritative recovery surfaces. In parallel, define an explicit recall-event rule so compaction-injected memories are not auto-strengthened unless they are actually reused.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:40921:- **What it does**: The README/Librarian pattern promises that a local model prunes and compresses context down to a small handoff, but the MCP code itself only exposes search, expansion, fact recall, and connected-doc hints. The compression layer is an operational pattern around the server, not a typed startup/compaction surface emitted by the server.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:40928:- **What it does**: Modus builds lightweight subject/tag/entity adjacency maps at index time and appends connected documents to search output when they were not already returned by lexical search.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:40929:- **Why it matters**: For compaction recovery, this is the most transferable Modus idea: after we recover the active spec/task, a cheap connected-neighbor pass could widen context without immediately paying for heavier graph or semantic expansion.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:40953:Design a narrow compaction-candidate experiment inside Public’s existing survival stack: add a cheap Modus-style lexical/connected-neighbor preselection lane to `compact-inject` or resume synthesis, but keep `session_bootstrap` / `session_resume` / `memory_context(resume)` as the only authoritative recovery surfaces. In parallel, define an explicit recall-event rule so compaction-injected memories are not auto-strengthened unless they are actually reused.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:40971:### Finding 1: Rank 1 (20/25) — explicit `memory_review` is the first thing Public should ship
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:40973:- **What it does**: Modus exposes an explicit `memory_reinforce` operator action on top of its FSRS state. Public already has the underlying pieces: graded review math (`AGAIN/HARD/GOOD/EASY`), `processReview()` with `nextReviewDate`, and opt-in strengthening-on-access. The current exposed adjacent surface is `memory_validate`, which records only `wasUseful` feedback and does not let an operator issue a graded FSRS review.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:40974:- **Why it matters for us**: This is the highest impact x feasibility transfer because it closes the clearest control-plane gap without inventing new storage or changing retrieval architecture. It also de-risks the bigger `memory_due` idea: until Public has a first-class graded review action, any future review queue would have no trustworthy way to record hard recalls, lapses, and easy wins distinctly.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:40982:- **What it does**: Modus builds lightweight subject/tag/entity adjacency maps at index time and appends connected documents to search output when they were not already returned by lexical search.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:40983:- **Why it matters**: For compaction recovery, this is the most transferable Modus idea: after we recover the active spec/task, a cheap connected-neighbor pass could widen context without immediately paying for heavier graph or semantic expansion.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:41007:Design a narrow compaction-candidate experiment inside Public’s existing survival stack: add a cheap Modus-style lexical/connected-neighbor preselection lane to `compact-inject` or resume synthesis, but keep `session_bootstrap` / `session_resume` / `memory_context(resume)` as the only authoritative recovery surfaces. In parallel, define an explicit recall-event rule so compaction-injected memories are not auto-strengthened unless they are actually reused.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:41037:`Code_Environment/Public` already has Spec Kit Memory with semantic and hybrid retrieval, markdown-backed memory artifacts, importance tiers, and an FSRS-based classification-decay layer in the MCP server. It does **not** currently mirror Modus Memory's end-to-end local vault server model, BM25 field-boosted lexical search with lightweight query caching, librarian-style synonym expansion for keyword retrieval, or simple subject/tag/entity adjacency maps that surface connected documents directly in result sets. Base the comparison on current code, not stale assumptions.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:41045:5. After FSRS, inspect cross-referencing by reading `external/modus-memory-main/internal/index/crossref.go`. Trace how subject, tag, and entity adjacency maps are built, what weighting is used for connected results, and what the system deliberately does **not** do because it avoids a full graph database.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:41077:10. Which Modus patterns would best improve query-time recall in `Code_Environment/Public`: BM25 field boosts, query caching, lexical expansion, connected-result hints, or simpler markdown-vault ergonomics?
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:41129:- MCP tool handlers that expose search, memory, reinforcement, decay, and connected-doc surfaces
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:41603:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:207:| `vault_connected` | Cross-reference query — find everything linked to a subject, tag, or entity |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:41611:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:287:Documents are connected by shared subjects, tags, and entities. A search for "authentication" returns not just keyword matches, but also:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:41801:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:14://	memory_reinforce, memory_decay_facts, vault_connected
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:41808:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:30:		"vault_connected":   true,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:41856:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:901:	srv.AddTool("vault_connected", "Find all documents connected to a subject, entity, or tag. Returns facts, beliefs, entities, articles, learnings, and missions that share references.", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:42021:.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:445:  shared_memory_status: getSchema({
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:42039:.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:493:  shared_memory_status: ['tenantId', 'actorUserId', 'actorAgentId'],
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:42078:.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:444:  name: 'shared_memory_status',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:42116:.opencode/skill/system-spec-kit/mcp_server/README.md:924:##### `shared_memory_status`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:42142:.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:33:type SharedIdentityTool = SharedAdminTool | 'shared_memory_status';
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:42188:.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:374:  tool: 'shared_space_upsert' | 'shared_space_membership_set' | 'shared_memory_status' | 'shared_memory_enable',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:42233:.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:756:      tool: 'shared_memory_status',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:42235:.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:765:      tool: 'shared_memory_status',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:42239:.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:785:      'shared_memory_status',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:42460:.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:58:  'shared_memory_status',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:42464:.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:79:    case 'shared_memory_status':       return handleSharedMemoryStatus(parseArgs<SharedMemoryStatusArgs>(validateToolArgs('shared_memory_status', args)));
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:42967:.opencode/skill/system-spec-kit/mcp_server/shared-spaces/README.md:42:| `shared_memory_status` | Caller-scoped rollout and membership view; requires exactly one actor identity |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:42970:.opencode/skill/system-spec-kit/mcp_server/shared-spaces/README.md:50:`shared_memory_status`, `shared_space_upsert`, and `shared_space_membership_set` rely on actor identity validation in `handlers/shared-memory.ts`. Admin mutations compare the caller against the configured shared-memory admin identity before allowing ownership-sensitive changes.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:43116:.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:397:    for (const toolName of ['shared_space_upsert', 'shared_space_membership_set', 'shared_memory_status']) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:43125:.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:442:  it('handler requires caller identity for shared_memory_status', async () => {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:43127:.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:454:  it('runtime accepts shared_memory_status with one actor identity', () => {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:43128:.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:456:      validateToolArgs('shared_memory_status', {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:44388:.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:177:      'shared_memory_status',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:44390:.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:300:      'shared_space_upsert', 'shared_space_membership_set', 'shared_memory_status', 'shared_memory_enable',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:44394:.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:164:    expect(api.LAYER_DEFINITIONS.L5.tools).toContain('shared_memory_status');
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:44395:.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:165:    expect(api.TOOL_LAYER_MAP.shared_memory_status).toBe('L5');
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:44396:.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:166:    expect(api.getLayerForTool('shared_memory_status')).toBe('L5');
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:44397:.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:167:    expect(api.getLayerTokenBudget('shared_memory_status')).toBe(1000);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:44400:.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:86:    tools: ['checkpoint_create', 'checkpoint_list', 'checkpoint_restore', 'checkpoint_delete', 'shared_memory_enable', 'shared_memory_status', 'shared_space_upsert', 'shared_space_membership_set']
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:44555:.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:161:    it('shared_memory_status appears in exactly one layer and is mapped to that layer', () => {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:44556:.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:162:      const matchingLayers = Object.values(LD).filter((layer) => layer.tools.includes('shared_memory_status'));
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:44557:.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:166:      expect(mod.TOOL_LAYER_MAP['shared_memory_status']).toBe(matchingLayers[0].id);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:45459://	memory_reinforce, memory_decay_facts, vault_connected
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:45475:		"vault_connected":   true,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:46140:/bin/zsh -lc 'rg -n "shared_space_upsert|shared_space_membership_set|shared_memory_status|assertSharedSpaceAccess|getAllowedSharedSpaceIds|filterRowsByScope|scopeKey|actorUserId|actorAgentId" .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/mcp_server/lib' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:46144:.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:33:type SharedIdentityTool = SharedAdminTool | 'shared_memory_status';
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:46156:.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:374:  tool: 'shared_space_upsert' | 'shared_space_membership_set' | 'shared_memory_status' | 'shared_memory_enable',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:46177:.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:756:      tool: 'shared_memory_status',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:46181:.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:765:      tool: 'shared_memory_status',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:46182:.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:785:      'shared_memory_status',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:46185:.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:86:    tools: ['checkpoint_create', 'checkpoint_list', 'checkpoint_restore', 'checkpoint_delete', 'shared_memory_enable', 'shared_memory_status', 'shared_space_upsert', 'shared_space_membership_set']
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:47672:  shared_memory_status: getSchema({
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:48201:    14	//	memory_reinforce, memory_decay_facts, vault_connected
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:48217:    30			"vault_connected":   true,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:49626:Design a narrow compaction-candidate experiment inside Public’s existing survival stack: add a cheap Modus-style lexical/connected-neighbor preselection lane to `compact-inject` or resume synthesis, but keep `session_bootstrap` / `session_resume` / `memory_context(resume)` as the only authoritative recovery surfaces. In parallel, define an explicit recall-event rule so compaction-injected memories are not auto-strengthened unless they are actually reused.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:49630:### Finding 1: Rank 1 (20/25) — explicit `memory_review` is the first thing Public should ship
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:49632:- **What it does**: Modus exposes an explicit `memory_reinforce` operator action on top of its FSRS state. Public already has the underlying pieces: graded review math (`AGAIN/HARD/GOOD/EASY`), `processReview()` with `nextReviewDate`, and opt-in strengthening-on-access. The current exposed adjacent surface is `memory_validate`, which records only `wasUseful` feedback and does not let an operator issue a graded FSRS review.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:49633:- **Why it matters for us**: This is the highest impact x feasibility transfer because it closes the clearest control-plane gap without inventing new storage or changing retrieval architecture. It also de-risks the bigger `memory_due` idea: until Public has a first-class graded review action, any future review queue would have no trustworthy way to record hard recalls, lapses, and easy wins distinctly.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:49641:- **What it does**: Modus builds lightweight subject/tag/entity adjacency maps at index time and appends connected documents to search output when they were not already returned by lexical search.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:49642:- **Why it matters**: For compaction recovery, this is the most transferable Modus idea: after we recover the active spec/task, a cheap connected-neighbor pass could widen context without immediately paying for heavier graph or semantic expansion.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:49686:`Code_Environment/Public` already has Spec Kit Memory with semantic and hybrid retrieval, markdown-backed memory artifacts, importance tiers, and an FSRS-based classification-decay layer in the MCP server. It does **not** currently mirror Modus Memory's end-to-end local vault server model, BM25 field-boosted lexical search with lightweight query caching, librarian-style synonym expansion for keyword retrieval, or simple subject/tag/entity adjacency maps that surface connected documents directly in result sets. Base the comparison on current code, not stale assumptions.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:49694:5. After FSRS, inspect cross-referencing by reading `external/modus-memory-main/internal/index/crossref.go`. Trace how subject, tag, and entity adjacency maps are built, what weighting is used for connected results, and what the system deliberately does **not** do because it avoids a full graph database.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:49726:10. Which Modus patterns would best improve query-time recall in `Code_Environment/Public`: BM25 field boosts, query caching, lexical expansion, connected-result hints, or simpler markdown-vault ergonomics?
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:49778:- MCP tool handlers that expose search, memory, reinforcement, decay, and connected-doc surfaces
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:51624:    13	// This is Option A from the knowledge graph discussion: connected search results
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:51628:    17	// DocRef is a lightweight reference to a connected document.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:51639:    28		bySubject map[string][]DocRef // lowercase subject → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:51640:    29		byTag     map[string][]DocRef // tag → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:51641:    30		byEntity  map[string][]DocRef // entity name → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:51726:   115	// ForSubject returns all documents connected to a subject (case-insensitive).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:51752:   141	// ForEntity returns all documents connected to an entity.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:51859:   248	// FormatConnected returns a human-readable string of connected documents.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:52178:.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:425: * @returns True if the memory_fts table exists in the connected database.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:53022:    75			// Append cross-reference hints — show connected docs the agent might want
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:53038:    91						sb.WriteString("**Cross-references** (connected docs not in results above):\n")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:53405:    34	 * highly connected knowledge is more reliably accessible over time.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:53527:    70	  nextReviewDate: string;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:53664:   207	  const nextReviewDate = getNextReviewDate(newStability);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:53671:   214	    nextReviewDate,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:55557:   207	| `vault_connected` | Cross-reference query — find everything linked to a subject, tag, or entity |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:56316:### Finding 1: Rank 1 (20/25) — explicit `memory_review` is the first thing Public should ship
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:56318:- **What it does**: Modus exposes an explicit `memory_reinforce` operator action on top of its FSRS state. Public already has the underlying pieces: graded review math (`AGAIN/HARD/GOOD/EASY`), `processReview()` with `nextReviewDate`, and opt-in strengthening-on-access. The current exposed adjacent surface is `memory_validate`, which records only `wasUseful` feedback and does not let an operator issue a graded FSRS review.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:56319:- **Why it matters for us**: This is the highest impact x feasibility transfer because it closes the clearest control-plane gap without inventing new storage or changing retrieval architecture. It also de-risks the bigger `memory_due` idea: until Public has a first-class graded review action, any future review queue would have no trustworthy way to record hard recalls, lapses, and easy wins distinctly.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:56327:- **What it does**: Modus builds lightweight subject/tag/entity adjacency maps at index time and appends connected documents to search output when they were not already returned by lexical search.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:56328:- **Why it matters**: For compaction recovery, this is the most transferable Modus idea: after we recover the active spec/task, a cheap connected-neighbor pass could widen context without immediately paying for heavier graph or semantic expansion.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:56403:`Code_Environment/Public` already has Spec Kit Memory with semantic and hybrid retrieval, markdown-backed memory artifacts, importance tiers, and an FSRS-based classification-decay layer in the MCP server. It does **not** currently mirror Modus Memory's end-to-end local vault server model, BM25 field-boosted lexical search with lightweight query caching, librarian-style synonym expansion for keyword retrieval, or simple subject/tag/entity adjacency maps that surface connected documents directly in result sets. Base the comparison on current code, not stale assumptions.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:56411:5. After FSRS, inspect cross-referencing by reading `external/modus-memory-main/internal/index/crossref.go`. Trace how subject, tag, and entity adjacency maps are built, what weighting is used for connected results, and what the system deliberately does **not** do because it avoids a full graph database.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:56443:10. Which Modus patterns would best improve query-time recall in `Code_Environment/Public`: BM25 field boosts, query caching, lexical expansion, connected-result hints, or simpler markdown-vault ergonomics?
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:56495:- MCP tool handlers that expose search, memory, reinforcement, decay, and connected-doc surfaces
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:57333:/bin/zsh -lc 'rg -n "subject|tag|entity|adjacen|cross|connected|related|weight" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/writer.go' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:57343:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go:13:// This is Option A from the knowledge graph discussion: connected search results
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:57345:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go:17:// DocRef is a lightweight reference to a connected document.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:57349:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go:28:	bySubject map[string][]DocRef // lowercase subject → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:57350:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go:29:	byTag     map[string][]DocRef // tag → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:57351:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go:30:	byEntity  map[string][]DocRef // entity name → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:57377:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go:115:// ForSubject returns all documents connected to a subject (case-insensitive).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:57383:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go:141:// ForEntity returns all documents connected to an entity.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:57397:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go:248:// FormatConnected returns a human-readable string of connected documents.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:57526:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:14://	memory_reinforce, memory_decay_facts, vault_connected
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:57536:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:30:		"vault_connected":   true,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:57571:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:207:| `vault_connected` | Cross-reference query — find everything linked to a subject, tag, or entity |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:57579:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:267:- **Cross-reference hints** — search results include connected documents from other categories
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:57584:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:287:Documents are connected by shared subjects, tags, and entities. A search for "authentication" returns not just keyword matches, but also:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:57692:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:901:	srv.AddTool("vault_connected", "Find all documents connected to a subject, entity, or tag. Returns facts, beliefs, entities, articles, learnings, and missions that share references.", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:57697:The first pass confirms a few promising DX areas already: Modus exposes explicit operational tools like `vault_status`, `memory_reinforce`, and `vault_connected`, and its search path logs its routing decisions. I’m now reading the exact implementations and doing one semantic search pass for setup/debug/status surfaces so the DX findings stay grounded in code rather than just retrieval internals.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:59278:    13	// This is Option A from the knowledge graph discussion: connected search results
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:59282:    17	// DocRef is a lightweight reference to a connected document.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:59293:    28		bySubject map[string][]DocRef // lowercase subject → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:59294:    29		byTag     map[string][]DocRef // tag → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:59295:    30		byEntity  map[string][]DocRef // entity name → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:59380:   115	// ForSubject returns all documents connected to a subject (case-insensitive).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:59406:   141	// ForEntity returns all documents connected to an entity.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:59513:   248	// FormatConnected returns a human-readable string of connected documents.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:59818:    14	//	memory_reinforce, memory_decay_facts, vault_connected
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:59834:    30			"vault_connected":   true,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:59922:    75			// Append cross-reference hints — show connected docs the agent might want
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:59938:    91						sb.WriteString("**Cross-references** (connected docs not in results above):\n")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:60748:   901		srv.AddTool("vault_connected", "Find all documents connected to a subject, entity, or tag. Returns facts, beliefs, entities, articles, learnings, and missions that share references.", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:61218:    70	  nextReviewDate: string;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:61355:   207	  const nextReviewDate = getNextReviewDate(newStability);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:61362:   214	    nextReviewDate,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:61693:    34	 * highly connected knowledge is more reliably accessible over time.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:62234:   207	| `vault_connected` | Cross-reference query — find everything linked to a subject, tag, or entity |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:62363:- **What it does**: Modus exposes `vault_status` and `vault_connected` directly in the MCP surface. Public already computes useful diagnostics like `lexicalPath` and `fallbackState`, but those mostly appear as logs or response metadata rather than as an operator-first debugging surface.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:62365:- **Recommendation**: **adopt now**. Add a dedicated `memory_status` or `memory_debug_search` surface that reports embedding readiness, lexical capability, cache path, intent route, graph contribution, and fail-open reasons in one place.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:62402:Run the next iteration on **operator workflow design**: map Public’s existing internals into a compact DX control plane with 3 concrete candidates only, `memory_status`, `memory_debug_search`, and `memory_review`, then judge whether each should be a new tool, a `profile:"debug"` response, or a wrapper around existing tools.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:62422:- **What it does**: Modus exposes `vault_status` and `vault_connected` directly in the MCP surface. Public already computes useful diagnostics like `lexicalPath` and `fallbackState`, but those mostly appear as logs or response metadata rather than as an operator-first debugging surface.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:62424:- **Recommendation**: **adopt now**. Add a dedicated `memory_status` or `memory_debug_search` surface that reports embedding readiness, lexical capability, cache path, intent route, graph contribution, and fail-open reasons in one place.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:62461:Run the next iteration on **operator workflow design**: map Public’s existing internals into a compact DX control plane with 3 concrete candidates only, `memory_status`, `memory_debug_search`, and `memory_review`, then judge whether each should be a new tool, a `profile:"debug"` response, or a wrapper around existing tools.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:62478:### Finding 1: Rank 1 (20/25) — explicit `memory_review` is the first thing Public should ship
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:62480:- **What it does**: Modus exposes an explicit `memory_reinforce` operator action on top of its FSRS state. Public already has the underlying pieces: graded review math (`AGAIN/HARD/GOOD/EASY`), `processReview()` with `nextReviewDate`, and opt-in strengthening-on-access. The current exposed adjacent surface is `memory_validate`, which records only `wasUseful` feedback and does not let an operator issue a graded FSRS review.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:62481:- **Why it matters for us**: This is the highest impact x feasibility transfer because it closes the clearest control-plane gap without inventing new storage or changing retrieval architecture. It also de-risks the bigger `memory_due` idea: until Public has a first-class graded review action, any future review queue would have no trustworthy way to record hard recalls, lapses, and easy wins distinctly.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:62489:- **What it does**: Modus builds lightweight subject/tag/entity adjacency maps at index time and appends connected documents to search output when they were not already returned by lexical search.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:62490:- **Why it matters**: For compaction recovery, this is the most transferable Modus idea: after we recover the active spec/task, a cheap connected-neighbor pass could widen context without immediately paying for heavier graph or semantic expansion.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:62527:Run the next iteration on **operator workflow design**: map Public’s existing internals into a compact DX control plane with 3 concrete candidates only, `memory_status`, `memory_debug_search`, and `memory_review`, then judge whether each should be a new tool, a `profile:"debug"` response, or a wrapper around existing tools.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:62557:`Code_Environment/Public` already has Spec Kit Memory with semantic and hybrid retrieval, markdown-backed memory artifacts, importance tiers, and an FSRS-based classification-decay layer in the MCP server. It does **not** currently mirror Modus Memory's end-to-end local vault server model, BM25 field-boosted lexical search with lightweight query caching, librarian-style synonym expansion for keyword retrieval, or simple subject/tag/entity adjacency maps that surface connected documents directly in result sets. Base the comparison on current code, not stale assumptions.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:62565:5. After FSRS, inspect cross-referencing by reading `external/modus-memory-main/internal/index/crossref.go`. Trace how subject, tag, and entity adjacency maps are built, what weighting is used for connected results, and what the system deliberately does **not** do because it avoids a full graph database.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:62597:10. Which Modus patterns would best improve query-time recall in `Code_Environment/Public`: BM25 field boosts, query caching, lexical expansion, connected-result hints, or simpler markdown-vault ergonomics?
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:62649:- MCP tool handlers that expose search, memory, reinforcement, decay, and connected-doc surfaces
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:64740:    13	// This is Option A from the knowledge graph discussion: connected search results
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:64744:    17	// DocRef is a lightweight reference to a connected document.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:64755:    28		bySubject map[string][]DocRef // lowercase subject → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:64756:    29		byTag     map[string][]DocRef // tag → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:64757:    30		byEntity  map[string][]DocRef // entity name → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:64842:   115	// ForSubject returns all documents connected to a subject (case-insensitive).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:64868:   141	// ForEntity returns all documents connected to an entity.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:65284:    75			// Append cross-reference hints — show connected docs the agent might want
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:65300:    91						sb.WriteString("**Cross-references** (connected docs not in results above):\n")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:65647:    14	//	memory_reinforce, memory_decay_facts, vault_connected
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:65663:    30			"vault_connected":   true,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:65704:   207	| `vault_connected` | Cross-reference query — find everything linked to a subject, tag, or entity |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:65764:   267	- **Cross-reference hints** — search results include connected documents from other categories
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:65784:   287	Documents are connected by shared subjects, tags, and entities. A search for "authentication" returns not just keyword matches, but also:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:66373:    34	 * highly connected knowledge is more reliably accessible over time.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:66495:    70	  nextReviewDate: string;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:66632:   207	  const nextReviewDate = getNextReviewDate(newStability);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:66639:   214	    nextReviewDate,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:66819:.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:33:type SharedIdentityTool = SharedAdminTool | 'shared_memory_status';
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:66820:.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:374:  tool: 'shared_space_upsert' | 'shared_space_membership_set' | 'shared_memory_status' | 'shared_memory_enable',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:66822:.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:756:      tool: 'shared_memory_status',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:66823:.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:765:      tool: 'shared_memory_status',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:66824:.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:785:      'shared_memory_status',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:66974:.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:445:  shared_memory_status: getSchema({
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:66981:.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:493:  shared_memory_status: ['tenantId', 'actorUserId', 'actorAgentId'],
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:67571:.opencode/skill/system-spec-kit/mcp_server/shared-spaces/README.md:42:| `shared_memory_status` | Caller-scoped rollout and membership view; requires exactly one actor identity |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:67572:.opencode/skill/system-spec-kit/mcp_server/shared-spaces/README.md:50:`shared_memory_status`, `shared_space_upsert`, and `shared_space_membership_set` rely on actor identity validation in `handlers/shared-memory.ts`. Admin mutations compare the caller against the configured shared-memory admin identity before allowing ownership-sensitive changes.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:67752:.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:58:  'shared_memory_status',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:67757:.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:79:    case 'shared_memory_status':       return handleSharedMemoryStatus(parseArgs<SharedMemoryStatusArgs>(validateToolArgs('shared_memory_status', args)));
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:68568:.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:397:    for (const toolName of ['shared_space_upsert', 'shared_space_membership_set', 'shared_memory_status']) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:68569:.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:442:  it('handler requires caller identity for shared_memory_status', async () => {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:68570:.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:454:  it('runtime accepts shared_memory_status with one actor identity', () => {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:68571:.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:456:      validateToolArgs('shared_memory_status', {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:68929:.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:444:  name: 'shared_memory_status',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:69369:.opencode/skill/system-spec-kit/mcp_server/README.md:924:##### `shared_memory_status`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:69817:.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:316:// result = { stability, difficulty, lastReview, reviewCount, nextReviewDate, retrievability }
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:70168:.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:86:    tools: ['checkpoint_create', 'checkpoint_list', 'checkpoint_restore', 'checkpoint_delete', 'shared_memory_enable', 'shared_memory_status', 'shared_space_upsert', 'shared_space_membership_set']
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:70709:.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:177:      'shared_memory_status',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:70721:.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:300:      'shared_space_upsert', 'shared_space_membership_set', 'shared_memory_status', 'shared_memory_enable',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:71850:.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:164:    expect(api.LAYER_DEFINITIONS.L5.tools).toContain('shared_memory_status');
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:71851:.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:165:    expect(api.TOOL_LAYER_MAP.shared_memory_status).toBe('L5');
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:71852:.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:166:    expect(api.getLayerForTool('shared_memory_status')).toBe('L5');
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:71853:.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:167:    expect(api.getLayerTokenBudget('shared_memory_status')).toBe(1000);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:72463:.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:161:    it('shared_memory_status appears in exactly one layer and is mapped to that layer', () => {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:72464:.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:162:      const matchingLayers = Object.values(LD).filter((layer) => layer.tools.includes('shared_memory_status'));
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:72465:.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:166:      expect(mod.TOOL_LAYER_MAP['shared_memory_status']).toBe(matchingLayers[0].id);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:75605:/bin/zsh -lc "rg -n \"quality_score|validation_count|memory_validate|wasUseful|confidence_score|reviewCount|nextReviewDate|retrievability|trackAccess\" .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/mcp_server/lib -g '"'!**/node_modules/**'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:75743:.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:70:  nextReviewDate: string;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:75755:.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:207:  const nextReviewDate = getNextReviewDate(newStability);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:75757:.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:214:    nextReviewDate,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:75766:.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:186:        nextReviewDate: new Date().toISOString(),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:75800:.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:316:// result = { stability, difficulty, lastReview, reviewCount, nextReviewDate, retrievability }
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:77202:Run the next iteration on **operator workflow design**: map Public’s existing internals into a compact DX control plane with 3 concrete candidates only, `memory_status`, `memory_debug_search`, and `memory_review`, then judge whether each should be a new tool, a `profile:"debug"` response, or a wrapper around existing tools.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:77214:### Finding 1: Rank 1 (20/25) — explicit `memory_review` is the first thing Public should ship
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:77216:- **What it does**: Modus exposes an explicit `memory_reinforce` operator action on top of its FSRS state. Public already has the underlying pieces: graded review math (`AGAIN/HARD/GOOD/EASY`), `processReview()` with `nextReviewDate`, and opt-in strengthening-on-access. The current exposed adjacent surface is `memory_validate`, which records only `wasUseful` feedback and does not let an operator issue a graded FSRS review.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:77217:- **Why it matters for us**: This is the highest impact x feasibility transfer because it closes the clearest control-plane gap without inventing new storage or changing retrieval architecture. It also de-risks the bigger `memory_due` idea: until Public has a first-class graded review action, any future review queue would have no trustworthy way to record hard recalls, lapses, and easy wins distinctly.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:77225:- **What it does**: Modus builds lightweight subject/tag/entity adjacency maps at index time and appends connected documents to search output when they were not already returned by lexical search.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:77226:- **Why it matters**: For compaction recovery, this is the most transferable Modus idea: after we recover the active spec/task, a cheap connected-neighbor pass could widen context without immediately paying for heavier graph or semantic expansion.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:77263:`Code_Environment/Public` already has Spec Kit Memory with semantic and hybrid retrieval, markdown-backed memory artifacts, importance tiers, and an FSRS-based classification-decay layer in the MCP server. It does **not** currently mirror Modus Memory's end-to-end local vault server model, BM25 field-boosted lexical search with lightweight query caching, librarian-style synonym expansion for keyword retrieval, or simple subject/tag/entity adjacency maps that surface connected documents directly in result sets. Base the comparison on current code, not stale assumptions.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:77271:5. After FSRS, inspect cross-referencing by reading `external/modus-memory-main/internal/index/crossref.go`. Trace how subject, tag, and entity adjacency maps are built, what weighting is used for connected results, and what the system deliberately does **not** do because it avoids a full graph database.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:77303:10. Which Modus patterns would best improve query-time recall in `Code_Environment/Public`: BM25 field boosts, query caching, lexical expansion, connected-result hints, or simpler markdown-vault ergonomics?
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:77355:- MCP tool handlers that expose search, memory, reinforcement, decay, and connected-doc surfaces
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:79194:    13	// This is Option A from the knowledge graph discussion: connected search results
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:79198:    17	// DocRef is a lightweight reference to a connected document.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:79209:    28		bySubject map[string][]DocRef // lowercase subject → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:79210:    29		byTag     map[string][]DocRef // tag → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:79211:    30		byEntity  map[string][]DocRef // entity name → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:79296:   115	// ForSubject returns all documents connected to a subject (case-insensitive).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:79322:   141	// ForEntity returns all documents connected to an entity.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:79680:/bin/zsh -lc "rg -n \"ExpandQuery|Connected\\(|ReinforceFact|Search\\(|memory_search|memory_review|facts|connected|librarian|review|reinforce\" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:79683:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:14://	memory_reinforce, memory_decay_facts, vault_connected
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:79688:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:30:		"vault_connected":   true,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:79697:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:75:		// Append cross-reference hints — show connected docs the agent might want
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:79699:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:91:					sb.WriteString("**Cross-references** (connected docs not in results above):\n")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:79725:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:901:	srv.AddTool("vault_connected", "Find all documents connected to a subject, entity, or tag. Returns facts, beliefs, entities, articles, learnings, and missions that share references.", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:79730:/bin/zsh -lc 'rg -n "FSRS|trackAccess|processReview|nextReviewDate|memory_validate|enableSessionBoost|causal|trace|profile|route|fallback|debug|review|search_shown|result_cited" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:79748:.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:70:  nextReviewDate: string;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:79763:.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:207:  const nextReviewDate = getNextReviewDate(newStability);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:79765:.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:214:    nextReviewDate,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:79880:    14	//	memory_reinforce, memory_decay_facts, vault_connected
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:79896:    30			"vault_connected":   true,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:79965:    75			// Append cross-reference hints — show connected docs the agent might want
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:79981:    91						sb.WriteString("**Cross-references** (connected docs not in results above):\n")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:80146:   901		srv.AddTool("vault_connected", "Find all documents connected to a subject, entity, or tag. Returns facts, beliefs, entities, articles, learnings, and missions that share references.", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:80175:/bin/zsh -lc 'rg -n "11 MCP tools|cached|microseconds|milliseconds|markdown|vault_connected|memory_reinforce|memory_search|BM25|field|cache|librarian" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:80187:207:| `vault_connected` | Cross-reference query — find everything linked to a subject, tag, or entity |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:80280:    70	  nextReviewDate: string;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:80417:   207	  const nextReviewDate = getNextReviewDate(newStability);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:80424:   214	    nextReviewDate,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:80488:    34	 * highly connected knowledge is more reliably accessible over time.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:81530:- **What it does**: Modus builds subject/tag/entity adjacency maps at index time and exposes connected documents directly. Public already has causal traversal and graph-aware freshness, but those are heavier semantic structures than simple adjacency hints.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:81546:Turn this ADR into a final adoption matrix for iteration 30: map `adopt now` items to exact Public surfaces (`memory_review`, route-summary/debug output, compact operator bundle), keep adjacency hints in `prototype later`, and explicitly lock in the `reject` decisions on write-on-read reinforcement, BM25-only replacement, and a separate fact-silo retrieval path.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:81587:- **What it does**: Modus builds subject/tag/entity adjacency maps at index time and exposes connected documents directly. Public already has causal traversal and graph-aware freshness, but those are heavier semantic structures than simple adjacency hints.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:81603:Turn this ADR into a final adoption matrix for iteration 30: map `adopt now` items to exact Public surfaces (`memory_review`, route-summary/debug output, compact operator bundle), keep adjacency hints in `prototype later`, and explicitly lock in the `reject` decisions on write-on-read reinforcement, BM25-only replacement, and a separate fact-silo retrieval path.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:81620:Run the next iteration on **operator workflow design**: map Public’s existing internals into a compact DX control plane with 3 concrete candidates only, `memory_status`, `memory_debug_search`, and `memory_review`, then judge whether each should be a new tool, a `profile:"debug"` response, or a wrapper around existing tools.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:81632:### Finding 1: Rank 1 (20/25) — explicit `memory_review` is the first thing Public should ship
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:81634:- **What it does**: Modus exposes an explicit `memory_reinforce` operator action on top of its FSRS state. Public already has the underlying pieces: graded review math (`AGAIN/HARD/GOOD/EASY`), `processReview()` with `nextReviewDate`, and opt-in strengthening-on-access. The current exposed adjacent surface is `memory_validate`, which records only `wasUseful` feedback and does not let an operator issue a graded FSRS review.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:81635:- **Why it matters for us**: This is the highest impact x feasibility transfer because it closes the clearest control-plane gap without inventing new storage or changing retrieval architecture. It also de-risks the bigger `memory_due` idea: until Public has a first-class graded review action, any future review queue would have no trustworthy way to record hard recalls, lapses, and easy wins distinctly.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:81643:- **What it does**: Modus builds lightweight subject/tag/entity adjacency maps at index time and appends connected documents to search output when they were not already returned by lexical search.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:81644:- **Why it matters**: For compaction recovery, this is the most transferable Modus idea: after we recover the active spec/task, a cheap connected-neighbor pass could widen context without immediately paying for heavier graph or semantic expansion.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:81663:### Finding 1: Rank 1 (20/25) — explicit `memory_review` is the first thing Public should ship
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:81665:- **What it does**: Modus exposes an explicit `memory_reinforce` operator action on top of its FSRS state. Public already has the underlying pieces: graded review math (`AGAIN/HARD/GOOD/EASY`), `processReview()` with `nextReviewDate`, and opt-in strengthening-on-access. The current exposed adjacent surface is `memory_validate`, which records only `wasUseful` feedback and does not let an operator issue a graded FSRS review.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:81666:- **Why it matters for us**: This is the highest impact x feasibility transfer because it closes the clearest control-plane gap without inventing new storage or changing retrieval architecture. It also de-risks the bigger `memory_due` idea: until Public has a first-class graded review action, any future review queue would have no trustworthy way to record hard recalls, lapses, and easy wins distinctly.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:81674:- **What it does**: Modus builds lightweight subject/tag/entity adjacency maps at index time and appends connected documents to search output when they were not already returned by lexical search.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:81675:- **Why it matters**: For compaction recovery, this is the most transferable Modus idea: after we recover the active spec/task, a cheap connected-neighbor pass could widen context without immediately paying for heavier graph or semantic expansion.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:81712:`Code_Environment/Public` already has Spec Kit Memory with semantic and hybrid retrieval, markdown-backed memory artifacts, importance tiers, and an FSRS-based classification-decay layer in the MCP server. It does **not** currently mirror Modus Memory's end-to-end local vault server model, BM25 field-boosted lexical search with lightweight query caching, librarian-style synonym expansion for keyword retrieval, or simple subject/tag/entity adjacency maps that surface connected documents directly in result sets. Base the comparison on current code, not stale assumptions.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:81720:5. After FSRS, inspect cross-referencing by reading `external/modus-memory-main/internal/index/crossref.go`. Trace how subject, tag, and entity adjacency maps are built, what weighting is used for connected results, and what the system deliberately does **not** do because it avoids a full graph database.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:81752:10. Which Modus patterns would best improve query-time recall in `Code_Environment/Public`: BM25 field boosts, query caching, lexical expansion, connected-result hints, or simpler markdown-vault ergonomics?
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:81804:- MCP tool handlers that expose search, memory, reinforcement, decay, and connected-doc surfaces
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:81893:/bin/zsh -lc 'rg -n "modus|hybrid-rag-fusion|003-modus-memory-main|memory_review|adjacency|librarian|BM25|FSRS" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:81895:157:- rollout_summaries/2026-04-09T10-35-53-UGDf-009_post_save_render_fixes_memory_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T12-35-53-019d71d0-0ec5-7c80-a08b-6d336ee5c639.jsonl, updated_at=2026-04-09T12:01:25+00:00, thread_id=019d71d0-0ec5-7c80-a08b-6d336ee5c639)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:81905:1869:- rollout_summaries/2026-03-13T11-01-44-IBXE-outsourced_agent_memory_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/13/rollout-2026-03-13T12-01-44-019ce6dc-0509-7630-9874-db11f57a9e06.jsonl, updated_at=2026-03-13T11:21:38+00:00, thread_id=019ce6dc-0509-7630-9874-db11f57a9e06)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:82255:`Code_Environment/Public` already has Spec Kit Memory with semantic and hybrid retrieval, markdown-backed memory artifacts, importance tiers, and an FSRS-based classification-decay layer in the MCP server. It does **not** currently mirror Modus Memory's end-to-end local vault server model, BM25 field-boosted lexical search with lightweight query caching, librarian-style synonym expansion for keyword retrieval, or simple subject/tag/entity adjacency maps that surface connected documents directly in result sets. Base the comparison on current code, not stale assumptions.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:82263:5. After FSRS, inspect cross-referencing by reading `external/modus-memory-main/internal/index/crossref.go`. Trace how subject, tag, and entity adjacency maps are built, what weighting is used for connected results, and what the system deliberately does **not** do because it avoids a full graph database.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:82295:10. Which Modus patterns would best improve query-time recall in `Code_Environment/Public`: BM25 field boosts, query caching, lexical expansion, connected-result hints, or simpler markdown-vault ergonomics?
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:82347:- MCP tool handlers that expose search, memory, reinforcement, decay, and connected-doc surfaces
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:83499:    70	  nextReviewDate: string;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:83636:   207	  const nextReviewDate = getNextReviewDate(newStability);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:83643:   214	    nextReviewDate,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:83747:    34	 * highly connected knowledge is more reliably accessible over time.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:84451:   901		srv.AddTool("vault_connected", "Find all documents connected to a subject, entity, or tag. Returns facts, beliefs, entities, articles, learnings, and missions that share references.", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:84505:/bin/zsh -lc "rg -n \"memory_validate|trackAccess|processReview|nextReviewDate|AGAIN|HARD|GOOD|EASY|memory_review|memory_due|review\" .opencode/skill/system-spec-kit/mcp_server -g '"'!**/dist/**'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:84779:.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:316:// result = { stability, difficulty, lastReview, reviewCount, nextReviewDate, retrievability }
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:84804:.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:186:        nextReviewDate: new Date().toISOString(),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:84874:.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:70:  nextReviewDate: string;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:84889:.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:207:  const nextReviewDate = getNextReviewDate(newStability);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:84891:.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:214:    nextReviewDate,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:85096:.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:207:    expect(result).toHaveProperty('nextReviewDate');
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:85117:.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:249:  it('D-08: nextReviewDate is valid future date', () => {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:85119:.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:251:    const nextDate = new Date(result.nextReviewDate);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:85147:.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:294:      const nextReviewDate = fsrsScheduler.getNextReviewDate(5);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:85148:.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:295:      expect(Number.isNaN(new Date(nextReviewDate).getTime())).toBe(false);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:85154:The main contrast is already sharpening: Modus exposes explicit review and connected-neighbor controls, while Public mostly keeps FSRS mechanics behind retrieval internals and `memory_validate`. I’m pulling the remaining source points now so the final ranking reflects both implementation feasibility and what we should explicitly reject.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:85454:    13	// This is Option A from the knowledge graph discussion: connected search results
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:85458:    17	// DocRef is a lightweight reference to a connected document.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:85469:    28		bySubject map[string][]DocRef // lowercase subject → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:85470:    29		byTag     map[string][]DocRef // tag → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:85471:    30		byEntity  map[string][]DocRef // entity name → connected docs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:85556:   115	// ForSubject returns all documents connected to a subject (case-insensitive).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:85582:   141	// ForEntity returns all documents connected to an entity.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:85689:   248	// FormatConnected returns a human-readable string of connected documents.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:86259:    14	//	memory_reinforce, memory_decay_facts, vault_connected
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:86275:    30			"vault_connected":   true,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:86808:Design a narrow compaction-candidate experiment inside Public’s existing survival stack: add a cheap Modus-style lexical/connected-neighbor preselection lane to `compact-inject` or resume synthesis, but keep `session_bootstrap` / `session_resume` / `memory_context(resume)` as the only authoritative recovery surfaces. In parallel, define an explicit recall-event rule so compaction-injected memories are not auto-strengthened unless they are actually reused.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:86812:### Finding 1: Rank 1 (20/25) — explicit `memory_review` is the first thing Public should ship
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:86814:- **What it does**: Modus exposes an explicit `memory_reinforce` operator action on top of its FSRS state. Public already has the underlying pieces: graded review math (`AGAIN/HARD/GOOD/EASY`), `processReview()` with `nextReviewDate`, and opt-in strengthening-on-access. The current exposed adjacent surface is `memory_validate`, which records only `wasUseful` feedback and does not let an operator issue a graded FSRS review.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:86815:- **Why it matters for us**: This is the highest impact x feasibility transfer because it closes the clearest control-plane gap without inventing new storage or changing retrieval architecture. It also de-risks the bigger `memory_due` idea: until Public has a first-class graded review action, any future review queue would have no trustworthy way to record hard recalls, lapses, and easy wins distinctly.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:86823:- **What it does**: Modus builds lightweight subject/tag/entity adjacency maps at index time and appends connected documents to search output when they were not already returned by lexical search.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:86824:- **Why it matters**: For compaction recovery, this is the most transferable Modus idea: after we recover the active spec/task, a cheap connected-neighbor pass could widen context without immediately paying for heavier graph or semantic expansion.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:86868:`Code_Environment/Public` already has Spec Kit Memory with semantic and hybrid retrieval, markdown-backed memory artifacts, importance tiers, and an FSRS-based classification-decay layer in the MCP server. It does **not** currently mirror Modus Memory's end-to-end local vault server model, BM25 field-boosted lexical search with lightweight query caching, librarian-style synonym expansion for keyword retrieval, or simple subject/tag/entity adjacency maps that surface connected documents directly in result sets. Base the comparison on current code, not stale assumptions.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:86876:5. After FSRS, inspect cross-referencing by reading `external/modus-memory-main/internal/index/crossref.go`. Trace how subject, tag, and entity adjacency maps are built, what weighting is used for connected results, and what the system deliberately does **not** do because it avoids a full graph database.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:86908:10. Which Modus patterns would best improve query-time recall in `Code_Environment/Public`: BM25 field boosts, query caching, lexical expansion, connected-result hints, or simpler markdown-vault ergonomics?
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:86960:- MCP tool handlers that expose search, memory, reinforcement, decay, and connected-doc surfaces
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:87067:### Finding 1: Rank 1 (20/25) — explicit `memory_review` is the first thing Public should ship
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:87069:- **What it does**: Modus exposes an explicit `memory_reinforce` operator action on top of its FSRS state. Public already has the underlying pieces: graded review math (`AGAIN/HARD/GOOD/EASY`), `processReview()` with `nextReviewDate`, and opt-in strengthening-on-access. The current exposed adjacent surface is `memory_validate`, which records only `wasUseful` feedback and does not let an operator issue a graded FSRS review.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:87070:- **Why it matters for us**: This is the highest impact x feasibility transfer because it closes the clearest control-plane gap without inventing new storage or changing retrieval architecture. It also de-risks the bigger `memory_due` idea: until Public has a first-class graded review action, any future review queue would have no trustworthy way to record hard recalls, lapses, and easy wins distinctly.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:87078:- **What it does**: Modus builds lightweight subject/tag/entity adjacency maps at index time and appends connected documents to search output when they were not already returned by lexical search.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:87079:- **Why it matters**: For compaction recovery, this is the most transferable Modus idea: after we recover the active spec/task, a cheap connected-neighbor pass could widen context without immediately paying for heavier graph or semantic expansion.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:87116:Run the next iteration on **operator workflow design**: map Public’s existing internals into a compact DX control plane with 3 concrete candidates only, `memory_status`, `memory_debug_search`, and `memory_review`, then judge whether each should be a new tool, a `profile:"debug"` response, or a wrapper around existing tools.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:87146:`Code_Environment/Public` already has Spec Kit Memory with semantic and hybrid retrieval, markdown-backed memory artifacts, importance tiers, and an FSRS-based classification-decay layer in the MCP server. It does **not** currently mirror Modus Memory's end-to-end local vault server model, BM25 field-boosted lexical search with lightweight query caching, librarian-style synonym expansion for keyword retrieval, or simple subject/tag/entity adjacency maps that surface connected documents directly in result sets. Base the comparison on current code, not stale assumptions.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:87154:5. After FSRS, inspect cross-referencing by reading `external/modus-memory-main/internal/index/crossref.go`. Trace how subject, tag, and entity adjacency maps are built, what weighting is used for connected results, and what the system deliberately does **not** do because it avoids a full graph database.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:87186:10. Which Modus patterns would best improve query-time recall in `Code_Environment/Public`: BM25 field boosts, query caching, lexical expansion, connected-result hints, or simpler markdown-vault ergonomics?
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:87238:- MCP tool handlers that expose search, memory, reinforcement, decay, and connected-doc surfaces
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:87343:Run the next iteration on **operator workflow design**: map Public’s existing internals into a compact DX control plane with 3 concrete candidates only, `memory_status`, `memory_debug_search`, and `memory_review`, then judge whether each should be a new tool, a `profile:"debug"` response, or a wrapper around existing tools.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:87355:### Finding 1: Rank 1 (20/25) — explicit `memory_review` is the first thing Public should ship
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:87357:- **What it does**: Modus exposes an explicit `memory_reinforce` operator action on top of its FSRS state. Public already has the underlying pieces: graded review math (`AGAIN/HARD/GOOD/EASY`), `processReview()` with `nextReviewDate`, and opt-in strengthening-on-access. The current exposed adjacent surface is `memory_validate`, which records only `wasUseful` feedback and does not let an operator issue a graded FSRS review.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:87358:- **Why it matters for us**: This is the highest impact x feasibility transfer because it closes the clearest control-plane gap without inventing new storage or changing retrieval architecture. It also de-risks the bigger `memory_due` idea: until Public has a first-class graded review action, any future review queue would have no trustworthy way to record hard recalls, lapses, and easy wins distinctly.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:87366:- **What it does**: Modus builds lightweight subject/tag/entity adjacency maps at index time and appends connected documents to search output when they were not already returned by lexical search.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:87367:- **Why it matters**: For compaction recovery, this is the most transferable Modus idea: after we recover the active spec/task, a cheap connected-neighbor pass could widen context without immediately paying for heavier graph or semantic expansion.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:87404:`Code_Environment/Public` already has Spec Kit Memory with semantic and hybrid retrieval, markdown-backed memory artifacts, importance tiers, and an FSRS-based classification-decay layer in the MCP server. It does **not** currently mirror Modus Memory's end-to-end local vault server model, BM25 field-boosted lexical search with lightweight query caching, librarian-style synonym expansion for keyword retrieval, or simple subject/tag/entity adjacency maps that surface connected documents directly in result sets. Base the comparison on current code, not stale assumptions.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:87412:5. After FSRS, inspect cross-referencing by reading `external/modus-memory-main/internal/index/crossref.go`. Trace how subject, tag, and entity adjacency maps are built, what weighting is used for connected results, and what the system deliberately does **not** do because it avoids a full graph database.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:87444:10. Which Modus patterns would best improve query-time recall in `Code_Environment/Public`: BM25 field boosts, query caching, lexical expansion, connected-result hints, or simpler markdown-vault ergonomics?
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:87496:- MCP tool handlers that expose search, memory, reinforcement, decay, and connected-doc surfaces
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:87640:/bin/zsh -lc 'rg -n "Recommendation|adopt now|prototype later|reject|BM25|cache|librarian|adjacency|memory_review|route summary|debug|operator bundle" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:87646:41:`Code_Environment/Public` already has Spec Kit Memory with semantic and hybrid retrieval, markdown-backed memory artifacts, importance tiers, and an FSRS-based classification-decay layer in the MCP server. It does **not** currently mirror Modus Memory's end-to-end local vault server model, BM25 field-boosted lexical search with lightweight query caching, librarian-style synonym expansion for keyword retrieval, or simple subject/tag/entity adjacency maps that surface connected documents directly in result sets. Base the comparison on current code, not stale assumptions.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:87648:49:5. After FSRS, inspect cross-referencing by reading `external/modus-memory-main/internal/index/crossref.go`. Trace how subject, tag, and entity adjacency maps are built, what weighting is used for connected results, and what the system deliberately does **not** do because it avoids a full graph database.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:87658:81:10. Which Modus patterns would best improve query-time recall in `Code_Environment/Public`: BM25 field boosts, query caching, lexical expansion, connected-result hints, or simpler markdown-vault ergonomics?
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:87864:7952:- **What it does**: Modus builds three adjacency maps (`bySubject`, `byTag`, `byEntity`), scores connected docs with fixed weights (subject `3.0`, entity `2.0`, tag `1.0`), and appends connected-doc hints to search responses. The “second pass” only checks title and subject for entity mentions even though the comments imply broader body linkage.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:87884:8047:- **What it does**: Modus builds three adjacency maps (`bySubject`, `byTag`, `byEntity`), scores connected docs with fixed weights (subject `3.0`, entity `2.0`, tag `1.0`), and appends connected-doc hints to search responses. The “second pass” only checks title and subject for entity mentions even though the comments imply broader body linkage.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:87955:8439:- **What it does**: Modus builds adjacency maps keyed by normalized subject, tag, and entity name, then scores connected docs with fixed weights `subject=3`, `entity=2`, `tag=1`. This is cheap and useful for related-document surfacing. But it is intentionally shallow: no traversal, no causal semantics, and the “scan title/body for entity mentions” comment only checks title and subject in code. Public already has richer graph-aware ranking signals, causal boost, and structural freshness augmentation.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:87997:8711:- **What it does**: Modus builds cheap adjacency maps over markdown documents only: shared subject gets weight `3.0`, entity `2.0`, tag `1.0`, then `vault_search` appends connected documents that were not already returned. Public’s code-graph and CocoIndex are stronger, but they solve different problems: `code_graph_query/context` answer structural code questions, and CocoIndex is the semantic code-search bridge. Neither is the same as “show me adjacent memory docs I might also want right now.”
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:87998:8712:- **Why it matters for us**: This is additive, not competitive. Public should not replace causal memory or code graph with Modus-style string adjacency, but a small connected-memory appendix for markdown artifacts could improve exploration and follow-on recall without disturbing the existing routing split of memory vs semantic code vs structural code.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:88055:9112:- Questions addressed: whether Modus’s cache design should influence Public; whether Modus’s query-expansion merge path is architecturally better or worse than Public’s pipeline; whether Modus’s split fact-search surfaces suggest a refactor direction; whether Public’s own FSRS write-back placement should change; whether any part of Modus’s connected-doc UX is worth borrowing without adopting its adjacency index.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:88106:9517:- **What it does**: Modus builds an in-memory metadata adjacency map from subject/tag/entity overlap, weights subject/entity/tag at `3/2/1`, and appends “connected” documents that were not in the main ranked set. Public already has stronger structural enrichment—causal-neighbor boost, neighbor injection, and co-activation spreading—but those are graph-driven, not simple frontmatter co-membership summaries.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:88109:9524:- **What it does**: Modus exposes both automatic reinforcement on recall and an explicit `memory_reinforce` tool. Public already has the underlying grade model (`AGAIN/HARD/GOOD/EASY`), review processing, and strengthening-on-access logic, but keeps write-back behind `trackAccess=false` and has no first-class `memory_reinforce`/`memory_review` tool in the current schema set.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:88114:9561:- **Questions addressed**: which Modus ideas already have insertion points in Public; whether the missing work is backend math or operator surface; which candidates are low/medium integration versus truly invasive; whether connected-result hints overlap with Public graph features; whether librarian expansion is still meaningful given Public deep-mode reformulation.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:88115:9569:Evaluate a concrete Public design for `memory_due` + `memory_review`: one tool that lists due/stale/promotion-eligible/archival-candidate memories, and one tool that applies graded FSRS review updates explicitly, then compare whether a metadata-based “connected docs” appendix improves operator trust beyond current causal/contiguity enrichment.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:88128:9674:### Finding 1: Rank 1 (20/25) — explicit `memory_review` is the first thing Public should ship
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:88130:9681:### Finding 2: Rank 2 (15/25, tie-broken ahead) — a doctor-style summary should ship in the same tranche as `memory_review`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:88133:9697:- **What it does**: Modus builds a lightweight adjacency layer from subject/tag/entity overlap and appends “connected docs not in results above” as an extra hint surface. Public already has stronger graph-backed enrichment via causal boosts, neighbor injection, and co-activation, but not a simple metadata-derived explanation appendix.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:88139:9711:- **What it does**: The ranking resolves into a four-phase roadmap: **Phase 1** ship `memory_review` plus a doctor-style summary; **Phase 2** define the authoritative due-state contract and then add `memory_due`; **Phase 3** pilot connected-doc explanations as a non-scoring appendix; **Phase 4** run a feature-flagged lexical-expansion experiment only on weak-result fallback paths.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:88142:9743:- Questions answered: the correct roadmap is **not** “build the biggest feature first.” Public should ship **`memory_review` first**, pair it with a **doctor-style summary**, then formalize the due-state contract before building **`memory_due`**. Connected-doc hints are worth testing only as explanation, and lexical expansion should be the final, tightly bounded experiment.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:88143:9750:Finalize iteration 020 as a closing synthesis: specify the Public API shape for `memory_review` and `memory_due`, decide whether due state is persisted or derived, and define success metrics for the two later prototypes (connected-doc appendix and weak-result lexical fallback).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:88146:9767:**Executive summary:** Borrow **Modus’s operator surfaces**, not its weaker retrieval shortcuts. **Adopt now:** graded `memory_review`, doctor-style summary, and a strict one-retrieval-core rule. **New feature needed:** authoritative `memory_due` and a durable proposal inbox. **Prototype later:** connected-doc appendix, weak-result lexical fallback, and content-level contradiction linting. **Reject:** fuzzy result-cache reuse, permissive markdown ingestion, default write-on-read as policy, and unenforced trust-stage metadata.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:88153:9808:- **What it does**: Modus builds lightweight subject/entity/tag adjacency and appends connected docs that did not make the main ranked list. The weighting is simple and fixed (`subject 3`, `entity 2`, `tag 1`).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:88170:9900:Turn this synthesis into implementation design: define the Public `memory_review` API first, add a doctor-style formatter over `memory_health`, then write the due-state ADR (`persisted next_review_at` vs deterministic derivation) before scoping `memory_due` and the proposal inbox.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:88253:   207	| `vault_connected` | Cross-reference query — find everything linked to a subject, tag, or entity |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:88551:.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:33:type SharedIdentityTool = SharedAdminTool | 'shared_memory_status';
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:88552:.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:374:  tool: 'shared_space_upsert' | 'shared_space_membership_set' | 'shared_memory_status' | 'shared_memory_enable',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:88554:.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:756:      tool: 'shared_memory_status',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:88555:.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:765:      tool: 'shared_memory_status',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:88556:.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:785:      'shared_memory_status',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:88633:.opencode/skill/system-spec-kit/mcp_server/README.md:924:##### `shared_memory_status`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:88714:.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:444:  name: 'shared_memory_status',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:88749:.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:445:  shared_memory_status: getSchema({
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:88754:.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:493:  shared_memory_status: ['tenantId', 'actorUserId', 'actorAgentId'],
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:88895:.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:58:  'shared_memory_status',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:88897:.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:79:    case 'shared_memory_status':       return handleSharedMemoryStatus(parseArgs<SharedMemoryStatusArgs>(validateToolArgs('shared_memory_status', args)));
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:88940:.opencode/skill/system-spec-kit/mcp_server/shared-spaces/README.md:42:| `shared_memory_status` | Caller-scoped rollout and membership view; requires exactly one actor identity |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:88941:.opencode/skill/system-spec-kit/mcp_server/shared-spaces/README.md:50:`shared_memory_status`, `shared_space_upsert`, and `shared_space_membership_set` rely on actor identity validation in `handlers/shared-memory.ts`. Admin mutations compare the caller against the configured shared-memory admin identity before allowing ownership-sensitive changes.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:89063:.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:397:    for (const toolName of ['shared_space_upsert', 'shared_space_membership_set', 'shared_memory_status']) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:89064:.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:442:  it('handler requires caller identity for shared_memory_status', async () => {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:89065:.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:454:  it('runtime accepts shared_memory_status with one actor identity', () => {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:89066:.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:456:      validateToolArgs('shared_memory_status', {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:89292:.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:86:    tools: ['checkpoint_create', 'checkpoint_list', 'checkpoint_restore', 'checkpoint_delete', 'shared_memory_enable', 'shared_memory_status', 'shared_space_upsert', 'shared_space_membership_set']
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:89533:.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:164:    expect(api.LAYER_DEFINITIONS.L5.tools).toContain('shared_memory_status');
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:89534:.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:165:    expect(api.TOOL_LAYER_MAP.shared_memory_status).toBe('L5');
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:89535:.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:166:    expect(api.getLayerForTool('shared_memory_status')).toBe('L5');
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:89536:.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:167:    expect(api.getLayerTokenBudget('shared_memory_status')).toBe(1000);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:89600:.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:177:      'shared_memory_status',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:89607:.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:300:      'shared_space_upsert', 'shared_space_membership_set', 'shared_memory_status', 'shared_memory_enable',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:89638:.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:161:    it('shared_memory_status appears in exactly one layer and is mapped to that layer', () => {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:89639:.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:162:      const matchingLayers = Object.values(LD).filter((layer) => layer.tools.includes('shared_memory_status'));
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:89640:.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:166:      expect(mod.TOOL_LAYER_MAP['shared_memory_status']).toBe(matchingLayers[0].id);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:89780:**Executive summary:** Borrow **Modus’s operator surfaces**, not its weaker retrieval shortcuts. **Adopt now:** graded `memory_review`, doctor-style summary, and a strict one-retrieval-core rule. **New feature needed:** authoritative `memory_due` and a durable proposal inbox. **Prototype later:** connected-doc appendix, weak-result lexical fallback, and content-level contradiction linting. **Reject:** fuzzy result-cache reuse, permissive markdown ingestion, default write-on-read as policy, and unenforced trust-stage metadata.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:89786:- **What it does**: Modus exposes `memory_reinforce`, but only as a success-only reinforce action. Public already has the stronger primitive: graded FSRS review (`AGAIN/HARD/GOOD/EASY`) plus computed `nextReviewDate`, yet the exposed adjacent tool is only `memory_validate(wasUseful)`, which adjusts confidence rather than recording a real review event.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:89787:- **Why it matters for us**: This closes the clearest control-plane gap without changing retrieval architecture. It also makes any later review queue trustworthy because review history would record hard recalls and lapses, not only “useful / not useful.”
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:89805:### Finding 4: `memory_due` is real product value, but it needs an authoritative due-state contract first
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:89807:- **What it does**: Modus visibly ties search recall, reinforce, decay, and archive to one fact state. Public already stores `stability`, `difficulty`, `last_review`, `review_count`, and opt-in access effects, and computes `nextReviewDate`, but does not expose an operator-facing due queue.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:89821:- **What it does**: Modus builds lightweight subject/entity/tag adjacency and appends connected docs that did not make the main ranked list. The weighting is simple and fixed (`subject 3`, `entity 2`, `tag 1`).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:90044:### Finding 1: Ship explicit graded `memory_review` first
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:90046:- **What it does**: Modus exposes explicit reinforcement; Public already has the stronger graded FSRS math and `nextReviewDate`, but only exposes `memory_validate(wasUseful)`.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:90065:### Finding 4: `memory_due` is the biggest missing workflow, but it needs a real contract first
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:90072:### Finding 5: Prototype connected-doc hints only as an explanation appendix
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:90107:Stop external research and convert this into implementation design in this order: `memory_review` API, doctor/debug route-summary surface, ADR for authoritative `memory_due`, then feature-flagged prototypes for connected-doc appendix and weak-result lexical fallback.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:90120:### Finding 1: Ship explicit graded `memory_review` first
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:90122:- **What it does**: Modus exposes explicit reinforcement; Public already has the stronger graded FSRS math and `nextReviewDate`, but only exposes `memory_validate(wasUseful)`.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:90141:### Finding 4: `memory_due` is the biggest missing workflow, but it needs a real contract first
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:90148:### Finding 5: Prototype connected-doc hints only as an explanation appendix
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md:90183:Stop external research and convert this into implementation design in this order: `memory_review` API, doctor/debug route-summary surface, ADR for authoritative `memory_due`, then feature-flagged prototypes for connected-doc appendix and weak-result lexical fallback.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/edge-density.ts:12:// >= 1.0  → "dense"    — graph is highly connected
.opencode/skill/system-spec-kit/mcp_server/lib/eval/edge-density.ts:207:    '  R4 typed-degree signals depend on well-connected nodes to surface',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:397:    for (const toolName of ['shared_space_upsert', 'shared_space_membership_set', 'shared_memory_status']) {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:442:  it('handler requires caller identity for shared_memory_status', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:454:  it('runtime accepts shared_memory_status with one actor identity', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:456:      validateToolArgs('shared_memory_status', {
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:327: * Collapse cyclic subgraphs into strongly connected components so we can
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:396: * Compute longest-path depths on the DAG formed by strongly connected
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:484: * connected components, which also keeps cyclic subgraphs bounded.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:316:// result = { stability, difficulty, lastReview, reviewCount, nextReviewDate, retrievability }
.opencode/skill/system-spec-kit/mcp_server/lib/graph/README.md:14:> Community detection and graph signal scoring for causal memory networks. Provides BFS connected-component labelling, single-level Louvain modularity and momentum/depth scoring.
.opencode/skill/system-spec-kit/mcp_server/lib/graph/README.md:37:- **Community detection** groups memory nodes into clusters using BFS connected-component labelling as a fast first pass, then escalates to single-level Louvain modularity when the largest component holds more than 50% of all nodes.
.opencode/skill/system-spec-kit/mcp_server/lib/graph/README.md:80:| `community-detection.ts` | BFS connected-component labelling, Louvain escalation, community co-member injection | `SPECKIT_COMMUNITY_DETECTION` |
.opencode/skill/system-spec-kit/mcp_server/lib/graph/README.md:94:| `detectCommunitiesBFS` | community-detection.ts | BFS connected-component labelling from database |
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:444:  name: 'shared_memory_status',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:827:  description: '[L9:CoverageGraph] Structured analysis of deep-loop coverage graph state. Supports query types: uncovered_questions (questions with no coverage), unverified_claims (claims without verification), contradictions (CONTRADICTS edge pairs), provenance_chain (BFS from a node following citation/evidence edges), coverage_gaps (nodes missing incoming coverage edges), and hot_nodes (most connected nodes by edge count + weight).',
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:86:    tools: ['checkpoint_create', 'checkpoint_list', 'checkpoint_restore', 'checkpoint_delete', 'shared_memory_enable', 'shared_memory_status', 'shared_space_upsert', 'shared_space_membership_set']
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:186:        nextReviewDate: new Date().toISOString(),
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:425: * @returns True if the memory_fts table exists in the connected database.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:70:  nextReviewDate: string;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:207:  const nextReviewDate = getNextReviewDate(newStability);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:214:    nextReviewDate,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:321: * This surfaces memories connected by causal relationships (caused, enabled, supports, etc.)
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:89: * Find causal edges connected to memories matching the query.
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:151: * virtual table, then retrieves causal edges connected to those memories.
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:372: * Formula: typed_degree(node) = SUM(weight_t * strength) for all connected edges
.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts:34: * highly connected knowledge is more reliably accessible over time.
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts:199: * Estimate the connected component size for a set of dirty nodes.
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:21: * Minimum number of memory nodes that must be connected to matched graph
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:53:  /** Number of memory nodes connected to query-matched graph nodes. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:54:  connectedNodes: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:90: * the graph has enough connected memory nodes to produce useful results.
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:96: * @returns GraphCoverageResult with early-gap flag and connected node count.
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:110:    return { earlyGap: true, connectedNodes: 0 };
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:125:    return { earlyGap: true, connectedNodes: 0 };
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:128:  // Count distinct memory nodes connected (via inbound edges) to matched nodes.
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:129:  const connectedMemoryNodes = new Set<string>();
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:133:      connectedMemoryNodes.add(memNodeId);
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:137:  const connectedNodes = connectedMemoryNodes.size;
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:138:  const earlyGap = connectedNodes < MIN_GRAPH_MEMORY_NODES;
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:140:  return { earlyGap, connectedNodes };
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:580:      COUNT(DISTINCT connected_file_path) AS degree
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:584:        target.file_path AS connected_file_path
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:595:        source.file_path AS connected_file_path
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:662:The causal graph is condensed into strongly connected components, then longest-path depth is computed across the resulting DAG. Shortcut edges do not collapse deeper chains; cycle members share one bounded depth layer, and the final depth is normalized by the deepest reachable component chain (`maxDepth`). Score bonus: `normalizedDepth * 0.05` — rewards structurally deep nodes in the causal chain.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:665:BFS connected-component labelling assigns community IDs. When the largest component contains >50% of all nodes, escalates to Louvain modularity optimization for finer-grained communities. Community co-members are injected into Stage 2 results before graph signal scoring. Gated via `SPECKIT_COMMUNITY_DETECTION`.
.opencode/skill/system-spec-kit/mcp_server/tests/graph-lifecycle.vitest.ts:260:  it('expands to connected neighbors', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:147: * connected to top-ranked results via causal edges.
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:520: * graph-discovered neighbors and amplifying scores for connected nodes.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:235: * N2c: Community detection (BFS connected components + Louvain escalation).
.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:393:      // Node 1 is connected to 2, 3, 4 — they should be in same community
.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:164:    expect(api.LAYER_DEFINITIONS.L5.tools).toContain('shared_memory_status');
.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:165:    expect(api.TOOL_LAYER_MAP.shared_memory_status).toBe('L5');
.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:166:    expect(api.getLayerForTool('shared_memory_status')).toBe('L5');
.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:167:    expect(api.getLayerTokenBudget('shared_memory_status')).toBe(1000);
.opencode/skill/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts:482:    expect(result.connectedNodes).toBe(2);
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:177:      'shared_memory_status',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:300:      'shared_space_upsert', 'shared_space_membership_set', 'shared_memory_status', 'shared_memory_enable',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:161:    it('shared_memory_status appears in exactly one layer and is mapped to that layer', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:162:      const matchingLayers = Object.values(LD).filter((layer) => layer.tools.includes('shared_memory_status'));
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:166:      expect(mod.TOOL_LAYER_MAP['shared_memory_status']).toBe(matchingLayers[0].id);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-calibration.vitest.ts:630:  it('activates for fully connected graph with sufficient size', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-calibration.vitest.ts:631:    // density = 1.0 for fully connected graph
.opencode/skill/system-spec-kit/mcp_server/tests/graph-calibration.vitest.ts:793:  describe('fully connected graph', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:207:    expect(result).toHaveProperty('nextReviewDate');
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:249:  it('D-08: nextReviewDate is valid future date', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:251:    const nextDate = new Date(result.nextReviewDate);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:294:      const nextReviewDate = fsrsScheduler.getNextReviewDate(5);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:295:      expect(Number.isNaN(new Date(nextReviewDate).getTime())).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-graph-signals.vitest.ts:653:  it('CF.1 — degree ranking and co-activation boost compound to promote well-connected memories', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:519:    it('adds a bounded graph-walk bonus for locally connected candidate rows', () => {

codex
I’ve got enough of the current surface to reason about dependencies now. Public already has richer internals than Modus in several areas, so the roadmap is turning into “adopt operator surfaces and narrow retrieval add-ons in the right order,” not “port Modus wholesale.”
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-024.md | sed -n '1,80p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	## Recommended Next Focus
     2	Implement blueprint 1 first in a write-enabled pass, then add `memory_health({ reportMode: "doctor" })`, then do the retrieval-core extraction before starting the separate `memory_due` ADR.
     3	--- Iteration 23 ---
     4	## Findings
     5	
     6	### Finding 1: Review queue risk — a Public `memory_due` inbox will be misleading unless it gets a first-class due-state contract
     7	- **Source**: `external/internal/mcp/vault.go:280-317,856-897`; `external/internal/vault/facts.go:64-157,160-217`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2319-2343`; `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:65-71,177-215`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:512-520`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1194-1202`
     8	- **What it does**: Modus keeps search recall, explicit reinforce, decay, and archive on the same fact fields. Public already persists `access_count`, `last_accessed`, `stability`, `difficulty`, `last_review`, and `review_count`, and `processReview()` computes `nextReviewDate`, but that due date is not persisted and read-time strengthening stays opt-in via `trackAccess=false`.
     9	- **Why it matters for us**: If Public adds a due/review queue without defining one authoritative source of truth for “due,” the queue can drift from actual search behavior. A memory can look overdue while recent read activity updated its effective retrievability, which would make the inbox feel unreliable.
    10	- **Recommendation**: **NEW FEATURE**
    11	- **Impact**: **high**
    12	
    13	### Finding 2: Doctor summary risk — a friendlier `doctor` surface can hide the repair semantics that currently keep Public safe
    14	- **Source**: `external/cmd/modus-memory/doctor.go:13-242`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:343-530`; `.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:479-540`
    15	- **What it does**: Modus’s `doctor` is compact: build the index, count issues, print warnings. Public’s health path is richer: degraded/healthy distinction, confirmation-gated auto-repair, FTS/vector/orphan cleanup, and partial-restore error reporting.
    16	- **Why it matters for us**: The risk is lossy compression. If Public promotes a one-screen doctor summary as the main surface, operators may miss whether a problem is merely informational, auto-repairable, or a partial restore failure with rollback details.
    17	- **Recommendation**: **adopt now**
    18	- **Impact**: **medium**
    19	
    20	### Finding 3: Lexical expansion risk — copying Modus’s librarian directly would stack another weak branch onto Public’s already-expanded deep pipeline
    21	- **Source**: `external/internal/librarian/search.go:10-52`; `external/internal/mcp/vault.go:280-299`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:8-18,88-125,148-175`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:616-740`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:173-251`
    22	- **What it does**: Modus asks an LLM for 3-5 keyword variants with no corpus grounding and searches each variant. Public already has deep-mode decomposition, corpus-grounded reformulation, and graph-expanded fallback queries.
    23	- **Why it matters for us**: In Modus this is lightweight; in Public it risks branch explosion, extra latency, and noisier recall. Ungrounded lexical variants can duplicate or fight with stronger grounded/vector lanes, especially when reranking and graph fallback already exist.
    24	- **Recommendation**: **prototype later**
    25	## Findings
    26	
    27	### Finding 1: Rank 1 (20/25) — explicit `memory_review` is the first thing Public should ship
    28	- **Source**: `external/internal/mcp/memory.go:7-15`; `external/internal/mcp/vault.go:885-897`; `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:39-43,197-215`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:529-585,840-877,1194-1202`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:300-316`
    29	- **What it does**: Modus exposes an explicit `memory_reinforce` operator action on top of its FSRS state. Public already has the underlying pieces: graded review math (`AGAIN/HARD/GOOD/EASY`), `processReview()` with `nextReviewDate`, and opt-in strengthening-on-access. The current exposed adjacent surface is `memory_validate`, which records only `wasUseful` feedback and does not let an operator issue a graded FSRS review.
    30	- **Why it matters for us**: This is the highest impact x feasibility transfer because it closes the clearest control-plane gap without inventing new storage or changing retrieval architecture. It also de-risks the bigger `memory_due` idea: until Public has a first-class graded review action, any future review queue would have no trustworthy way to record hard recalls, lapses, and easy wins distinctly.
    31	- **Recommendation**: **adopt now**
    32	- **Impact**: **high**
    33	
    34	- **Impact**: **high**
    35	
    36	### Finding 3: Public should not import Modus’s simpler retention taxonomy, because Public already has a stronger policy model than Modus
    37	- **Source**: [external/internal/vault/facts.go:25](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go#L25), [external/internal/vault/facts.go:32](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go#L32), [mcp_server/lib/cognitive/fsrs-scheduler.ts:197](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts#L197), [mcp_server/lib/cognitive/fsrs-scheduler.ts:273](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts#L273), [mcp_server/lib/cognitive/fsrs-scheduler.ts:297](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts#L297), [mcp_server/lib/search/vector-index-schema.ts:2339](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts#L2339)
    38	- **What it does**: Modus has four importance classes plus three memory-type difficulty modifiers. Public already has a richer policy surface: context-type multipliers, importance-tier multipliers, no-decay classes, and review scheduling output via `processReview()`, but only `stability`, `difficulty`, `last_review`, and `review_count` are persisted.
    39	- **Why it matters**: The gap in Public is not lack of decay policy. The gap is that the policy is not projected cleanly into an operator-facing “due / refreshing / permanent / archive-eligible” contract.
    40	- **Recommendation**: **reject**
    41	- **Impact**: **medium**
    42	
    43	### Finding 4: Modus double-counts freshness in fact retrieval, which is useful for episodic recall but risky as a global long-term ranking rule
    44	- **Source**: [external/internal/index/facts.go:53](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/facts.go#L53), [external/internal/index/facts.go:88](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/facts.go#L88), [external/internal/mcp/vault.go:323](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L323)
    45	- **What it does**: Modus boosts ranking by both confidence and fact age buckets (`hot`, `warm`, `recent`, `cold`), then surfaces staleness warnings in the rendered result set.
    46	- **Why it matters**: That is a good fit for ephemeral or session-shaped facts, but it can over-favor recent noise over durable truth if applied as a universal retention heuristic. Public already has retrievability, state classification, and importance weighting; a second global freshness boost would likely overcorrect.
    47	- **Recommendation**: **prototype later**
    48	- **Impact**: **medium**
    49	
    50	### Finding 5: Public should keep cognitive decay state out of authored markdown, even though Modus’s plain-file model is elegant
    51	- **Source**: [external/internal/markdown/parser.go:13](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go#L13), [external/internal/markdown/parser.go:73](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go#L73), [external/internal/markdown/writer.go:10](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/writer.go#L10), [external/internal/vault/facts.go:149](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go#L149), [external/internal/vault/facts.go:210](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go#L210), [external/README.md:27](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md#L27)
    52	- **What it does**: Modus parses markdown into mutable frontmatter/body documents and writes decay, reinforcement, and archive metadata back into those markdown files directly. That matches its “plain markdown, no database” value proposition.
    53	- **Why it matters**: For a git-backed long-lived memory system, per-access or periodic decay writes would create continuous document churn. Public’s split between authored memory artifacts and DB-backed cognitive state is the better long-horizon design.
    54	- **Recommendation**: **reject**
    55	- **Impact**: **medium**
    56	
    57	## Assessment
    58	- New information ratio: **0.27**
    59	- Validation: `validate.sh --strict` on `003-modus-memory-main` returned `RESULT: PASSED`; it also emitted `cannot create temp file for here document: Operation not permitted`, which matches the read-only sandbox warning seen in earlier iterations.
    60	- Phase state: this remains a read-only iteration pass, not a completion pass; the phase folder still lacks completion artifacts like `checklist.md` and `implementation-summary.md`.
    61	
    62	## Recommended Next Focus
    63	Define a canonical recall-event contract for Public first: decide whether ordinary search hits should refresh lifetime, persist a real due-state projection on top of existing FSRS fields, and expose that through `memory_review` plus a visible `memory_due`/retention surface. After that, test whether Modus-style freshness buckets belong only in an episodic fact lane rather than in canonical memory ranking.
    64	
    65	RESEARCH BRIEF:
    66	# $refine TIDD-EC Prompt: 003-modus-memory-main
    67	
    68	## 2. Role
    69	
    70	You are a research specialist in spaced repetition memory systems, BM25 search ranking, cross-referenced knowledge graphs, MCP-exposed local memory services, and local-first personal memory architectures. Work like a systems analyst who can trace implementation details from source code, separate README claims from verified mechanics, and translate Modus Memory's specific design choices into concrete improvements for `Code_Environment/Public`.
    71	
    72	## 3. Task
    73	
    74	Research Modus Memory's FSRS spaced repetition, BM25 search ranking, and cross-referencing patterns to identify practical, evidence-backed improvements for `Code_Environment/Public`'s memory search and retrieval, especially around memory decay and reinforcement, query expansion, knowledge linking, and plain-markdown memory storage patterns. Determine which ideas should be `adopt now`, `prototype later`, or `reject`.
    75	
    76	## 4. Context
    77	
    78	### 4.1 System Description
    79	
    80	Modus Memory is a local memory server that stores data as plain markdown files, exposes MCP tools, uses BM25 with field boosting, layers a tiered query cache over lexical retrieval, applies FSRS-style spaced repetition with decay and reinforcement, builds cross-references from subjects, tags, and entities, and uses a librarian query expander to widen lexical recall without relying on vectors. The core attraction is a lightweight local binary, markdown-native persistence, and search behavior that mixes ranking, recency, and linked context while staying git-friendly and human-readable.

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md | sed -n '89770,89840p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
 89770	.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:628:          includeTrace: true,
 89771	.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:658:          includeTrace: true,
 89772	.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:76:        importance_tier, context_type, embedding_status
 89773	.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:304:    expect(indexes[1]?.sql).toContain('embedding_status');
 89774	
 89775	exec
 89776	/bin/zsh -lc "sed -n '9765,9855p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 89777	 succeeded in 0ms:
 89778	FINAL SYNTHESIS: Classify EVERY finding as adopt-now / prototype-later / new-feature-needed / reject. Executive summary.
 89779	
 89780	**Executive summary:** Borrow **Modus’s operator surfaces**, not its weaker retrieval shortcuts. **Adopt now:** graded `memory_review`, doctor-style summary, and a strict one-retrieval-core rule. **New feature needed:** authoritative `memory_due` and a durable proposal inbox. **Prototype later:** connected-doc appendix, weak-result lexical fallback, and content-level contradiction linting. **Reject:** fuzzy result-cache reuse, permissive markdown ingestion, default write-on-read as policy, and unenforced trust-stage metadata.
 89781	
 89782	## Findings
 89783	
 89784	### Finding 1: Explicit graded review is the best immediate transfer
 89785	- **Source**: `external/internal/mcp/vault.go:885-897`; `external/internal/vault/facts.go:160-217`; `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:39-43,65-71,197-215`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:298-316`; `.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:648-790`
 89786	- **What it does**: Modus exposes `memory_reinforce`, but only as a success-only reinforce action. Public already has the stronger primitive: graded FSRS review (`AGAIN/HARD/GOOD/EASY`) plus computed `nextReviewDate`, yet the exposed adjacent tool is only `memory_validate(wasUseful)`, which adjusts confidence rather than recording a real review event.
 89787	- **Why it matters for us**: This closes the clearest control-plane gap without changing retrieval architecture. It also makes any later review queue trustworthy because review history would record hard recalls and lapses, not only “useful / not useful.”
 89788	- **Recommendation**: adopt now
 89789	- **Impact**: high
 89790	
 89791	### Finding 2: A doctor-style summary should ship beside review
 89792	- **Source**: `external/cmd/modus-memory/doctor.go:13-242`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:378-594`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:236-273`
 89793	- **What it does**: Modus’s `doctor` turns vault health into a one-screen operator report. Public already has deeper health and repair machinery—FTS rebuild, orphan cleanup, degraded/healthy state, confirmation-gated repair—but exposes it as a richer technical envelope.
 89794	- **Why it matters for us**: This is mostly presentation work, not backend work. It improves operator trust immediately while preserving Public’s stronger repair semantics underneath.
 89795	- **Recommendation**: adopt now
 89796	- **Impact**: medium
 89797	
 89798	### Finding 3: Keep one retrieval core; Modus’s split fact-search paths are a warning
 89799	- **Source**: `external/internal/index/indexer.go:287-340`; `external/internal/vault/facts.go:290-337`; `external/internal/mcp/vault.go:273-317`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:771-809`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/index.ts:1-32`
 89800	- **What it does**: Modus has multiple fact-search contracts for the same memory objects: `Index.SearchFacts`, a separate in-memory `factStore`, and `Vault.SearchFacts` fallback behavior. Public routes `memory_search` through one pipeline contract via `executePipeline`.
 89801	- **Why it matters for us**: This is the strongest architectural lesson from Modus’s weaknesses. Public should keep specialized search surfaces as thin wrappers over the canonical pipeline instead of growing parallel ranking rules that will drift.
 89802	- **Recommendation**: adopt now
 89803	- **Impact**: high
 89804	
 89805	### Finding 4: `memory_due` is real product value, but it needs an authoritative due-state contract first
 89806	- **Source**: `external/internal/mcp/vault.go:273-317,856-897`; `external/internal/vault/facts.go:64-157,160-217`; `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:65-71,177-215`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:519-520`
 89807	- **What it does**: Modus visibly ties search recall, reinforce, decay, and archive to one fact state. Public already stores `stability`, `difficulty`, `last_review`, `review_count`, and opt-in access effects, and computes `nextReviewDate`, but does not expose an operator-facing due queue.
 89808	- **Why it matters for us**: This is the biggest missing workflow surface in Public. But it should not ship until “due” is defined as either persisted state (`next_review_at`) or a deterministic derivation from existing FSRS fields.
 89809	- **Recommendation**: NEW FEATURE
 89810	- **Impact**: high
 89811	
 89812	### Finding 5: Durable proposal inboxes are the best non-retrieval idea Modus has
 89813	- **Source**: `external/internal/vault/prs.go:10-118`; `external/internal/mcp/vault.go:681-777`; `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:417-452`; `.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:681-790`
 89814	- **What it does**: Modus persists risky knowledge changes as markdown PR artifacts, then merge/reject outcomes reinforce or weaken linked beliefs. Public already produces advisory reconsolidation recommendations and confidence feedback, but the recommendation is transient and not stored as a durable review object.
 89815	- **Why it matters for us**: Public’s next gap is operator workflow, not mutation safety. A persistent inbox for reconsolidation, supersession, promotion, and deprecation proposals would let existing confidence and mutation systems work as a real review loop.
 89816	- **Recommendation**: NEW FEATURE
 89817	- **Impact**: high
 89818	
 89819	### Finding 6: Connected-doc hints are worth prototyping only as an explanation appendix
 89820	- **Source**: `external/internal/index/crossref.go:154-214,248-280`; `external/internal/mcp/vault.go:75-101,901-924`
 89821	- **What it does**: Modus builds lightweight subject/entity/tag adjacency and appends connected docs that did not make the main ranked list. The weighting is simple and fixed (`subject 3`, `entity 2`, `tag 1`).
 89822	- **Why it matters for us**: The transferable part is explanation, not ranking. Public can test a “related memories” appendix without diluting stronger graph-backed or hybrid scoring paths.
 89823	- **Recommendation**: prototype later
 89824	- **Impact**: medium
 89825	
 89826	### Finding 7: Lexical-only expansion belongs only in weak-result recovery
 89827	- **Source**: `external/internal/librarian/search.go:10-52`; `external/internal/mcp/vault.go:28-58,280-299`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:525-529,771-809`
 89828	- **What it does**: Modus asks the Librarian for 3-5 keyword variants, searches each, deduplicates, and caps results. It is lightweight, but ungrounded and union-first.
 89829	- **Why it matters for us**: Public already has a more complex retrieval pipeline, so copying this as a mainline branch would mostly add noise and latency. The only credible transfer is a tightly bounded fallback when hybrid retrieval is weak.
 89830	- **Recommendation**: prototype later
 89831	- **Impact**: low
 89832	
 89833	### Finding 8: Content-level contradiction and duplicate-fact linting is still worth a prototype
 89834	- **Source**: `external/cmd/modus-memory/doctor.go:42-158`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:455-555`
 89835	- **What it does**: Modus’s `doctor` explicitly flags missing `subject`/`predicate`, duplicate `subject+predicate` pairs, and contradictory values for the same pair. Public’s current health surface is stronger on infrastructure integrity than on fact-content linting.
 89836	- **Why it matters for us**: This complements Public’s existing infra health checks instead of replacing them. It is one of the few Modus hygiene ideas that adds net-new value.
 89837	- **Recommendation**: prototype later
 89838	- **Impact**: medium
 89839	
 89840	### Finding 9: Reject Modus’s fuzzy Jaccard result-cache contract

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md | sed -n '90040,90110p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
 90040	## Focus
 90041	FINAL EXTENDED SYNTHESIS: Integrate all 30 iterations. Update the adopt/prototype/reject classification. Create the definitive recommendation set with priority, effort, and impact scores.
 90042	
 90043	## Findings
 90044	### Finding 1: Ship explicit graded `memory_review` first
 90045	- **Source**: [vault.go:885](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L885); [facts.go:160](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go#L160); [fsrs-scheduler.ts:39](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts#L39); [checkpoints.ts:648](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts#L648); [tool-schemas.ts:297](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L297)
 90046	- **What it does**: Modus exposes explicit reinforcement; Public already has the stronger graded FSRS math and `nextReviewDate`, but only exposes `memory_validate(wasUseful)`.
 90047	- **Why it matters**: This is the clearest operator-surface gap and the best impact-to-effort transfer from Modus.
 90048	- **Recommendation**: **adopt now**
 90049	- **Priority / Effort / Impact**: **10 / 3 / 9**
 90050	
 90051	### Finding 2: Add a compact doctor/debug surface, not more hidden routing
 90052	- **Source**: [doctor.go:13](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/doctor.go#L13); [memory-search.ts:676](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L676); [memory-search.ts:699](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L699); [tool-schemas.ts:236](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L236)
 90053	- **What it does**: Modus turns system state into a one-screen operator report. Public already computes more health and routing detail, but much of it is log-first or trace-only.
 90054	- **Why it matters**: Operator trust improves immediately when route and health are visible without opening trace envelopes or stderr.
 90055	- **Recommendation**: **adopt now**
 90056	- **Priority / Effort / Impact**: **8 / 4 / 7**
 90057	
 90058	### Finding 3: Preserve one canonical retrieval core
 90059	- **Source**: [indexer.go:287](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go#L287); [facts.go:290](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go#L290); [index.ts:4](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/index.ts#L4)
 90060	- **What it does**: Modus ends up with multiple fact-search paths; Public already centralizes retrieval through `executePipeline`.
 90061	- **Why it matters**: The strongest architectural lesson from all 30 iterations is to keep new tools as thin wrappers over the same retrieval core, not parallel ranking systems.
 90062	- **Recommendation**: **adopt now**
 90063	- **Priority / Effort / Impact**: **9 / 2 / 8**
 90064	
 90065	### Finding 4: `memory_due` is the biggest missing workflow, but it needs a real contract first
 90066	- **Source**: [vault.go:856](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L856); [fsrs-scheduler.ts:65](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts#L65); [fsrs-scheduler.ts:177](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts#L177); [memory-search.ts:519](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L519)
 90067	- **What it does**: Public already stores the FSRS ingredients for due-state, but does not expose an operator-facing due queue.
 90068	- **Why it matters**: This is real product value, but “due” must be defined first as either persisted state or deterministic derivation.
 90069	- **Recommendation**: **NEW FEATURE**
 90070	- **Priority / Effort / Impact**: **9 / 6 / 8**
 90071	
 90072	### Finding 5: Prototype connected-doc hints only as an explanation appendix
 90073	- **Source**: [crossref.go:154](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go#L154); [crossref.go:181](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go#L181); [vault.go:901](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L901)
 90074	- **What it does**: Modus uses simple subject/entity/tag adjacency with fixed `3/2/1` weights to surface related documents.
 90075	- **Why it matters**: The transferable value is cheap explanation and light rehydration, not replacing Public’s stronger graph-backed ranking.
 90076	- **Recommendation**: **prototype later**
 90077	- **Priority / Effort / Impact**: **6 / 4 / 6**
 90078	
 90079	### Finding 6: Prototype lexical expansion only for weak-result recovery
 90080	- **Source**: [search.go:10](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go#L10); [search.go:49](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go#L49); [sqlite-fts.ts:193](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts#L193); [memory-search.ts:691](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L691)
 90081	- **What it does**: Modus expands into 3-5 keyword variants, unions results, and deduplicates.
 90082	- **Why it matters**: Public already has a richer hybrid stack, so this should only ever be a bounded recovery path when the main retrieval is weak.
 90083	- **Recommendation**: **prototype later**
 90084	- **Priority / Effort / Impact**: **5 / 5 / 5**
 90085	
 90086	### Finding 7: Do not copy Modus’s fuzzy Jaccard result-cache contract
 90087	- **Source**: [cache.go:10](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go#L10); [cache.go:41](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go#L41); [memory-search.ts:502](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L502)
 90088	- **What it does**: Modus reuses cached results for exact matches and Jaccard-similar term sets.
 90089	- **Why it matters**: Public has too many routing, scope, rerank, quality, and trace knobs for fuzzy query reuse to be trustworthy.
 90090	- **Recommendation**: **reject**
 90091	- **Priority / Effort / Impact**: **8 / 1 / 8**
 90092	
 90093	### Finding 8: Reject write-on-read and permissive markdown as default policy
 90094	- **Source**: [vault.go:311](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L311); [facts.go:160](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go#L160); [parser.go:143](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go#L143); [writer.go:10](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/writer.go#L10); [tool-schemas.ts:165](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L165)
 90095	- **What it does**: Modus reinforces on search return and tolerates malformed markdown/YAML much more aggressively.
 90096	- **Why it matters**: Public’s stronger governance depends on retrieval staying observational by default and ingestion staying authoritative.
 90097	- **Recommendation**: **reject**
 90098	- **Priority / Effort / Impact**: **9 / 1 / 9**
 90099	
 90100	## Assessment
 90101	- New information ratio: **0.12**
 90102	- Definitive classification: **adopt now = 3**, **NEW FEATURE = 1**, **prototype later = 2**, **reject = 2**
 90103	- Validation check: `validate.sh --strict` still returns `RESULT: PASSED`; the read-only sandbox also still emits the known temp-file warning.
 90104	- This was a read-only synthesis pass, so I did not update `research/research.md`, `checklist.md`, `implementation-summary.md`, or memory artifacts.
 90105	
 90106	## Recommended Next Focus
 90107	Stop external research and convert this into implementation design in this order: `memory_review` API, doctor/debug route-summary surface, ADR for authoritative `memory_due`, then feature-flagged prototypes for connected-doc appendix and weak-result lexical fallback.
 90108	
 90109	
 90110	hook: Stop

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '660,730p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   660	    if (intentClassifier.isValidIntent(explicitIntent)) {
   661	      detectedIntent = explicitIntent;
   662	      intentConfidence = 1.0;
   663	      intentWeights = intentClassifier.getIntentWeights(explicitIntent);
   664	    } else {
   665	      console.warn(`[memory-search] Invalid intent '${explicitIntent}', using auto-detection`);
   666	    }
   667	  }
   668	
   669	  if (!detectedIntent && autoDetectIntent && hasValidQuery) {
   670	    const classification: IntentClassification = intentClassifier.classifyIntent(normalizedQuery!);
   671	    detectedIntent = classification.intent;
   672	    intentConfidence = classification.confidence;
   673	    intentWeights = intentClassifier.getIntentWeights(classification.intent as IntentType);
   674	
   675	    if (classification.fallback) {
   676	      console.error(`[memory-search] Intent auto-detected as '${detectedIntent}' (fallback: ${classification.reason})`);
   677	    } else {
   678	      console.error(`[memory-search] Intent auto-detected as '${detectedIntent}' (confidence: ${intentConfidence.toFixed(2)})`);
   679	    }
   680	  }
   681	
   682	  // FIX RC3-B: Intent confidence floor — override low-confidence auto-detections to "understand"
   683	  const INTENT_CONFIDENCE_FLOOR = parseFloat(process.env.SPECKIT_INTENT_CONFIDENCE_FLOOR || '0.25');
   684	  if (detectedIntent && intentConfidence < INTENT_CONFIDENCE_FLOOR && !explicitIntent) {
   685	    console.error(`[memory-search] Intent confidence ${intentConfidence.toFixed(3)} below floor ${INTENT_CONFIDENCE_FLOOR}, overriding '${detectedIntent}' → 'understand'`);
   686	    detectedIntent = 'understand';
   687	    intentConfidence = 1.0;
   688	    intentWeights = intentClassifier.getIntentWeights('understand' as IntentType);
   689	  }
   690	
   691	  // Phase C: Intent-to-profile auto-routing.
   692	  // Explicit caller `profile` always takes precedence; auto-detect fills in when absent.
   693	  let effectiveProfile: string | undefined = profile;
   694	  if (!effectiveProfile && detectedIntent && isIntentAutoProfileEnabled()) {
   695	    try {
   696	      const autoProfile = intentClassifier.getProfileForIntent(detectedIntent as IntentType);
   697	      if (autoProfile) {
   698	        effectiveProfile = autoProfile;
   699	        console.error(`[memory-search] Intent-to-profile auto-routing: '${detectedIntent}' → profile '${autoProfile}'`);
   700	      }
   701	    } catch (_autoProfileErr: unknown) {
   702	      // Auto-profile is best-effort — never breaks search
   703	    }
   704	  }
   705	
   706	  // Re-run artifact routing with detected intent for fallback coverage
   707	  if (detectedIntent && artifactRouting?.detectedClass === 'unknown' && artifactRouting?.confidence === 0) {
   708	    artifactRouting = getStrategyForQuery(artifactRoutingQuery, specFolder, detectedIntent);
   709	  }
   710	
   711	  // Create retrieval trace at pipeline entry
   712	  const trace = createTrace(
   713	    effectiveQuery,
   714	    sessionId,
   715	    detectedIntent || undefined
   716	  );
   717	
   718	  // Build cache key args
   719	  const cacheArgs = buildCacheArgs({
   720	    normalizedQuery,
   721	    hasValidConcepts,
   722	    concepts,
   723	    specFolder,
   724	    tenantId: normalizedScope.tenantId,
   725	    userId: normalizedScope.userId,
   726	    agentId: normalizedScope.agentId,
   727	    sharedSpaceId: normalizedScope.sharedSpaceId,
   728	    limit,
   729	    mode,
   730	    tier,

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '760,830p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   760	  if (cachedPayload) {
   761	    responseToReturn = buildSearchResponseFromPayload(cachedPayload, _searchStartTime, true);
   762	  } else {
   763	    // Wait for embedding model only on cache miss
   764	    if (!isEmbeddingModelReady()) {
   765	      const modelReady = await waitForEmbeddingModel(30000);
   766	      if (!modelReady) {
   767	        throw new Error('Embedding model not ready after 30s timeout. Try again later.');
   768	      }
   769	    }
   770	
   771	    // V2 pipeline is the only path (legacy V1 removed from the runtime pipeline)
   772	    const pipelineConfig: PipelineConfig = {
   773	      query: effectiveQuery,
   774	      concepts: hasValidConcepts ? concepts : undefined,
   775	      searchType: (hasValidConcepts && concepts!.length >= 2)
   776	        ? 'multi-concept'
   777	        : 'hybrid',
   778	      mode,
   779	      limit,
   780	      specFolder,
   781	      tenantId: normalizedScope.tenantId,
   782	      userId: normalizedScope.userId,
   783	      agentId: normalizedScope.agentId,
   784	      sharedSpaceId: normalizedScope.sharedSpaceId,
   785	      tier,
   786	      contextType,
   787	      includeArchived,
   788	      includeConstitutional,
   789	      includeContent,
   790	      anchors,
   791	      qualityThreshold,
   792	      minState: minState ?? '',
   793	      applyStateLimits,
   794	      useDecay,
   795	      rerank,
   796	      applyLengthPenalty,
   797	      sessionId,
   798	      enableDedup,
   799	      enableSessionBoost,
   800	      enableCausalBoost,
   801	      trackAccess,
   802	      detectedIntent,
   803	      intentConfidence,
   804	      intentWeights: toIntentWeightsConfig(intentWeights),
   805	      artifactRouting: artifactRouting as unknown as PipelineConfig['artifactRouting'],
   806	      trace,
   807	    };
   808	
   809	    const pipelineResult: PipelineResult = await executePipeline(pipelineConfig);
   810	    let resultsForFormatting = pipelineResult.results as unknown as SessionAwareResult[];
   811	
   812	    // Phase B T018/T019: Community search fallback — inject community members on weak results
   813	    let communityFallbackApplied = false;
   814	    const shouldRunCommunitySearch = (
   815	      isDualRetrievalEnabled() &&
   816	      isCommunitySearchFallbackEnabled() &&
   817	      effectiveQuery.length > 0 &&
   818	      (retrievalLevel === 'global' || retrievalLevel === 'auto')
   819	    );
   820	    if (shouldRunCommunitySearch) {
   821	      const isWeakResult = resultsForFormatting.length === 0 ||
   822	        (retrievalLevel === 'global') ||
   823	        (resultsForFormatting.length < 3 && retrievalLevel === 'auto');
   824	      if (isWeakResult) {
   825	        try {
   826	          const communityResults = searchCommunities(effectiveQuery, requireDb(), 5);
   827	          if (communityResults.totalMemberIds.length > 0) {
   828	            // Fetch the actual memory rows for community member IDs
   829	            const memberIds = communityResults.totalMemberIds.slice(0, 20);
   830	            const placeholders = memberIds.map(() => '?').join(', ');

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/index.ts | sed -n '1,80p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Index
     3	// ───────────────────────────────────────────────────────────────
     4	// Public API for the 4-stage retrieval pipeline
     5	/**
     6	 * Execute the four-stage retrieval pipeline.
     7	 */
     8	
     9	// Feature catalog: 4-stage pipeline architecture
    10	// Feature catalog: 4-stage pipeline refactor
    11	
    12	export { executePipeline } from './orchestrator.js';
    13	/**
    14	 * Public pipeline data contracts.
    15	 */
    16	export type {
    17	  PipelineConfig,
    18	  PipelineResult,
    19	  PipelineRow,
    20	  Stage4ReadonlyRow,
    21	  Stage1Input,
    22	  Stage1Output,
    23	  Stage2Input,
    24	  Stage2Output,
    25	  Stage3Input,
    26	  Stage3Output,
    27	  Stage4Input,
    28	  Stage4Output,
    29	  ScoreSnapshot,
    30	  IntentWeightsConfig,
    31	  ArtifactRoutingConfig,
    32	} from './types.js';
    33	/**
    34	 * Score snapshot helpers for Stage 4 invariants.
    35	 */
    36	export { captureScoreSnapshot, verifyScoreInvariant } from './types.js';

codex
I’ve finished the evidence pass and I’m stitching it into the requested iteration format now. The roadmap will be dependency-driven rather than just priority-ranked, because the main pattern across the prior work is that a few operator-surface changes unlock the safer higher-value features later.
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '150,160p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   150	scope: render-layer memory pipeline fixes in `003-memory-quality-issues/009-post-save-render-fixes` with acceptance anchored to a real 014 wild save and zero post-save-review issues
   151	applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public; reuse_rule=reuse when patching memory render/reviewer behavior in this checkout and proving fixes through an end-to-end generate-context run
   152	
   153	## Task 1: Ship 009 render-layer fixes (A-I lanes), tests, and final wild save with clean post-save review, outcome success
   154	
   155	### rollout_summary_files
   156	
   157	- rollout_summaries/2026-04-09T10-35-53-UGDf-009_post_save_render_fixes_memory_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T12-35-53-019d71d0-0ec5-7c80-a08b-6d336ee5c639.jsonl, updated_at=2026-04-09T12:01:25+00:00, thread_id=019d71d0-0ec5-7c80-a08b-6d336ee5c639)
   158	
   159	### keywords
   160	

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '410,418p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   410	
   411	- rollout_summaries/2026-04-04T15-43-31-Svpz-research_agentic_system_phase_prompts.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/04/rollout-2026-04-04T17-43-31-019d5929-e78c-73c1-bd08-74488a2b61bd.jsonl, updated_at=2026-04-04T15:53:59+00:00, thread_id=019d5929-e78c-73c1-bd08-74488a2b61bd)
   412	
   413	### keywords
   414	
   415	- 999-feature-roadmap, 001-research-agentic-systems, phase-research-prompt.md, Level 3 Spec Kit docs, spec_kit:deep-research, external/
   416	
   417	## Task 2: Replicate `phase-research-prompt.md` for phases 008/009 in phase roots and keep skip-spec-folder scope, outcome success
   418	

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/prs.go | sed -n '1,180p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	package vault
     2	
     3	import (
     4		"fmt"
     5		"time"
     6	
     7		"github.com/GetModus/modus-memory/internal/markdown"
     8	)
     9	
    10	// OpenPR creates a new PR (evolution proposal) in vault/atlas/prs/.
    11	// Returns the relative path of the created PR file.
    12	func (v *Vault) OpenPR(title, openedBy, targetType, targetID string,
    13		reasoning string, confidence float64, linkedBeliefIDs []string) (string, error) {
    14	
    15		slug := slugify(title)
    16		if len(slug) > 80 {
    17			slug = slug[:80]
    18		}
    19	
    20		relPath := fmt.Sprintf("atlas/prs/%s.md", slug)
    21	
    22		// Ensure unique filename
    23		for i := 2; fileExists(v.Path(relPath)); i++ {
    24			relPath = fmt.Sprintf("atlas/prs/%s-%d.md", slug, i)
    25		}
    26	
    27		now := time.Now().Format(time.RFC3339)
    28	
    29		fm := map[string]interface{}{
    30			"title":              title,
    31			"opened_by":          openedBy,
    32			"status":             "open",
    33			"opened_at":          now,
    34			"target_type":        targetType,
    35			"target_id":          targetID,
    36			"confidence":         confidence,
    37			"linked_belief_ids":  linkedBeliefIDs,
    38		}
    39	
    40		body := fmt.Sprintf("# %s\n\n## Reasoning\n\n%s\n", title, reasoning)
    41	
    42		if err := v.Write(relPath, fm, body); err != nil {
    43			return "", err
    44		}
    45	
    46		return relPath, nil
    47	}
    48	
    49	// MergePR marks a PR as merged and reinforces all linked beliefs.
    50	// Only the operator should call this — MODUS never closes its own PRs.
    51	func (v *Vault) MergePR(relPath, closedBy string) error {
    52		doc, err := v.Read(relPath)
    53		if err != nil {
    54			return fmt.Errorf("read PR: %w", err)
    55		}
    56	
    57		status := doc.Get("status")
    58		if status != "open" {
    59			return fmt.Errorf("PR is %s, not open — cannot merge", status)
    60		}
    61	
    62		doc.Set("status", "merged")
    63		doc.Set("closed_at", time.Now().Format(time.RFC3339))
    64		doc.Set("closed_by", closedBy)
    65	
    66		if err := doc.Save(); err != nil {
    67			return fmt.Errorf("save PR: %w", err)
    68		}
    69	
    70		// Reinforce linked beliefs
    71		linkedIDs := doc.Get("linked_belief_ids")
    72		if linkedIDs != "" {
    73			for _, id := range parseStringList(linkedIDs) {
    74				v.ReinforceBelief(id, "pr-merge")
    75			}
    76		}
    77	
    78		return nil
    79	}
    80	
    81	// RejectPR marks a PR as rejected and weakens all linked beliefs.
    82	func (v *Vault) RejectPR(relPath, closedBy, reason string) error {
    83		doc, err := v.Read(relPath)
    84		if err != nil {
    85			return fmt.Errorf("read PR: %w", err)
    86		}
    87	
    88		status := doc.Get("status")
    89		if status != "open" {
    90			return fmt.Errorf("PR is %s, not open — cannot reject", status)
    91		}
    92	
    93		doc.Set("status", "rejected")
    94		doc.Set("closed_at", time.Now().Format(time.RFC3339))
    95		doc.Set("closed_by", closedBy)
    96		doc.Set("rejection_reason", reason)
    97	
    98		if err := doc.Save(); err != nil {
    99			return fmt.Errorf("save PR: %w", err)
   100		}
   101	
   102		// Weaken linked beliefs
   103		linkedIDs := doc.Get("linked_belief_ids")
   104		if linkedIDs != "" {
   105			for _, id := range parseStringList(linkedIDs) {
   106				v.WeakenBelief(id)
   107			}
   108		}
   109	
   110		return nil
   111	}
   112	
   113	// ListPRs returns all PRs, optionally filtered by status.
   114	func (v *Vault) ListPRs(status string) ([]*markdown.Document, error) {
   115		if status != "" {
   116			return v.List("atlas/prs", Filter{Field: "status", Value: status})
   117		}
   118		return v.List("atlas/prs")
   119	}
   120	
   121	// GetPR reads a single PR by slug or path.
   122	func (v *Vault) GetPR(slug string) (*markdown.Document, error) {
   123		relPath := fmt.Sprintf("atlas/prs/%s.md", slug)
   124		return v.Read(relPath)
   125	}
   126	
   127	// parseStringList handles both Go string slices and YAML-formatted string lists.
   128	func parseStringList(s string) []string {
   129		// Handle YAML list format: [a, b, c]
   130		s = trimBrackets(s)
   131		if s == "" {
   132			return nil
   133		}
   134		parts := splitAndTrim(s, ",")
   135		return parts
   136	}
   137	
   138	func trimBrackets(s string) string {
   139		if len(s) >= 2 && s[0] == '[' && s[len(s)-1] == ']' {
   140			return s[1 : len(s)-1]
   141		}
   142		return s
   143	}
   144	
   145	func splitAndTrim(s, sep string) []string {
   146		var result []string
   147		for _, part := range splitString(s, sep) {
   148			trimmed := trimQuotes(trimSpace(part))
   149			if trimmed != "" {
   150				result = append(result, trimmed)
   151			}
   152		}
   153		return result
   154	}
   155	
   156	func splitString(s, sep string) []string {
   157		var parts []string
   158		for {
   159			i := indexOf(s, sep)
   160			if i < 0 {
   161				parts = append(parts, s)
   162				break
   163			}
   164			parts = append(parts, s[:i])
   165			s = s[i+len(sep):]
   166		}
   167		return parts
   168	}
   169	
   170	func indexOf(s, sub string) int {
   171		for i := 0; i <= len(s)-len(sub); i++ {
   172			if s[i:i+len(sub)] == sub {
   173				return i
   174			}
   175		}
   176		return -1
   177	}
   178	
   179	func trimSpace(s string) string {
   180		for len(s) > 0 && (s[0] == ' ' || s[0] == '\t' || s[0] == '\n') {

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts | sed -n '417,470p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   417	        } else if (tier === 'review') {
   418	          // Review tier: classify and surface as recommendation (no mutations)
   419	          const classification = classifySupersededOrComplement(topContent, parsed.content);
   420	          assistiveRecommendation = {
   421	            action: 'review',
   422	            candidateMemoryIds: [topId],
   423	            description:
   424	              `Review borderline similarity ${similarity.toFixed(3)} between the pending save ` +
   425	              `and existing memory #${topId}; heuristic suggests ${classification}.`,
   426	            olderMemoryId: topId,
   427	            newerMemoryId: null,
   428	            similarity,
   429	            classification,
   430	            recommendedAt: Date.now(),
   431	          };
   432	          // Preserve the advisory payload on the warning carrier so the normal save
   433	          // path can forward it without widening the handler signature.
   434	          reconWarnings.assistiveRecommendation = assistiveRecommendation;
   435	          logAssistiveRecommendation(assistiveRecommendation);
   436	        }
   437	        // 'keep_separate' → no action, fall through to normal save
   438	      }
   439	    } catch (assistiveErr: unknown) {
   440	      const message = toErrorMessage(assistiveErr);
   441	      console.warn(
   442	        `[reconsolidation-bridge] assistive reconsolidation error (proceeding with normal save): ${message}`
   443	      );
   444	      // Errors must not block saves
   445	    }
   446	  }
   447	
   448	  return {
   449	    earlyReturn: null,
   450	    warnings: reconWarnings,
   451	    assistiveRecommendation,
   452	  };
   453	}

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts | sed -n '681,790p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   681	  const result: ValidationResult = confidenceTracker.recordValidation(database, memoryId, wasUseful);
   682	  try {
   683	    recordAdaptiveSignal(database, {
   684	      memoryId,
   685	      signalType: wasUseful ? 'outcome' : 'correction',
   686	      signalValue: 1,
   687	      query: queryText,
   688	      actor: sessionId ?? 'memory_validate',
   689	      metadata: {
   690	        queryId: normalizedQueryId,
   691	        queryText,
   692	        resultRank: typeof resultRank === 'number' ? resultRank : null,
   693	        totalResultsShown: typeof totalResultsShown === 'number' ? totalResultsShown : null,
   694	        intent: intent ?? null,
   695	      },
   696	    });
   697	  } catch (_error: unknown) {
   698	    // Adaptive signals are best-effort only
   699	  }
   700	
   701	  // T002a: Auto-promotion wiring on positive feedback.
   702	  let autoPromotion: {
   703	    attempted: boolean;
   704	    promoted: boolean;
   705	    previousTier?: string;
   706	    newTier?: string;
   707	    reason?: string;
   708	  } | null = null;
   709	
   710	  if (wasUseful) {
   711	    const promotionResult = executeAutoPromotion(database, memoryId);
   712	    autoPromotion = {
   713	      attempted: true,
   714	      promoted: promotionResult.promoted,
   715	      previousTier: promotionResult.previousTier,
   716	      newTier: promotionResult.newTier,
   717	      reason: promotionResult.reason,
   718	    };
   719	  }
   720	
   721	  // T002b: Negative-feedback confidence signal persistence for runtime scoring.
   722	  if (!wasUseful) {
   723	    recordNegativeFeedbackEvent(database, memoryId);
   724	  }
   725	
   726	  // T002 + T027a: Optional wiring from memory_validate to learned feedback + ground truth.
   727	  let learnedFeedback: {
   728	    attempted: boolean;
   729	    applied: boolean;
   730	    termsLearned: string[];
   731	    reason?: string;
   732	  } | null = null;
   733	  let groundTruthSelectionId: number | null = null;
   734	
   735	  if (wasUseful && typeof queryId === 'string' && queryId.trim().length > 0) {
   736	    groundTruthSelectionId = recordUserSelection(queryId, memoryId, {
   737	      searchMode,
   738	      intent,
   739	      selectedRank: resultRank,
   740	      totalResultsShown,
   741	      sessionId,
   742	      notes,
   743	    });
   744	
   745	    const normalizedTerms = Array.isArray(queryTerms)
   746	      ? queryTerms.filter((term) => typeof term === 'string' && term.trim().length > 0).map((term) => term.trim())
   747	      : [];
   748	
   749	    if (typeof resultRank === 'number' && Number.isFinite(resultRank) && resultRank > 0 && normalizedTerms.length > 0) {
   750	      const learnResult = recordSelection(queryId, memoryId, normalizedTerms, Math.floor(resultRank), database);
   751	      learnedFeedback = {
   752	        attempted: true,
   753	        applied: learnResult.applied,
   754	        termsLearned: learnResult.terms,
   755	        reason: learnResult.reason,
   756	      };
   757	    } else {
   758	      learnedFeedback = {
   759	        attempted: false,
   760	        applied: false,
   761	        termsLearned: [],
   762	        reason: 'missing_query_terms_or_rank',
   763	      };
   764	    }
   765	  }
   766	
   767	  const summary = wasUseful
   768	    ? `Positive validation recorded (confidence: ${result.confidence.toFixed(2)})`
   769	    : `Negative validation recorded (confidence: ${result.confidence.toFixed(2)})`;
   770	
   771	  const hints: string[] = [];
   772	  if (result.promotionEligible) {
   773	    hints.push('Memory eligible for promotion to critical tier');
   774	  }
   775	  if (!wasUseful && result.validationCount > 3) {
   776	    hints.push('Consider updating or deleting this memory if consistently unhelpful');
   777	  }
   778	
   779	  return createMCPSuccessResponse({
   780	    tool: 'memory_validate',
   781	    summary,
   782	    data: {
   783	      memoryId,
   784	      wasUseful: wasUseful,
   785	      confidence: result.confidence,
   786	      validationCount: result.validationCount,
   787	      positiveValidationCount: result.positiveValidationCount,
   788	      promotionEligible: result.promotionEligible,
   789	      autoPromotion,
   790	      learnedFeedback,

codex
# Iteration 031: ADOPTION ROADMAP DRAFT

## Focus
ADOPTION ROADMAP DRAFT: Convert the prior 30 Modus-vs-Public findings into a dependency-aware Q1/Q2/Q3 adoption roadmap for Spec Kit Memory, with milestones ordered by operator-surface leverage and architectural safety.

## Findings
### Finding 1: Q1 foundation — ship explicit graded `memory_review` before any review queue work
- **Source**: [memory.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go#L7), [vault.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L885), [fsrs-scheduler.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts#L39), [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L297)
- **What it does**: Modus exposes a direct `memory_reinforce` action; Public already has the stronger graded FSRS machinery (`AGAIN/HARD/GOOD/EASY`, `processReview()`, `nextReviewDate`) but only exposes `memory_validate(wasUseful)`.
- **Why it matters**: This is the cleanest Q1 milestone because it uses existing internals, closes the clearest operator gap, and becomes the prerequisite for any trustworthy `memory_due` or retention workflow.
- **Recommendation**: **adopt now**. Q1 Milestone 1. Dependency root for Q2 review-queue work.
- **Impact**: **high**
- **Source strength**: **primary**

### Finding 2: Q1 operator visibility — add a compact doctor/debug surface as presentation, not new backend logic
- **Source**: [doctor.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/doctor.go#L13), [memory-crud-health.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts#L222), [profile-formatters.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts#L374), [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L676)
- **What it does**: Modus turns vault health into a one-screen `doctor` report. Public already has richer health, trace, and profile machinery, but key routing/health visibility is still spread across technical envelopes and stderr logs.
- **Why it matters**: This is the right second Q1 milestone because it improves operator trust and gives the observability needed to safely roll out later fallbacks and review workflows.
- **Recommendation**: **adopt now**. Q1 Milestone 2. Depends on preserving existing repair semantics under a thinner operator-facing summary.
- **Impact**: **medium**
- **Source strength**: **primary**

### Finding 3: Q2 workflow milestone — define an authoritative `memory_due` contract only after `memory_review`
- **Source**: [vault.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L273), [vault.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L856), [fsrs-scheduler.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts#L65), [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L519)
- **What it does**: Modus keeps recall, reinforce, decay, and archive on one visible fact lifecycle. Public already stores the FSRS ingredients and computes `nextReviewDate`, but does not expose an authoritative due queue and keeps read-time strengthening opt-in with `trackAccess=false`.
- **Why it matters**: `memory_due` is high-value product work, but it should not ship until Q1 establishes explicit review events and a clear rule for whether ordinary retrieval changes due-state.
- **Recommendation**: **NEW FEATURE**. Q2 Milestone 1. Depends on Q1 `memory_review` and Q1 visibility surfaces.
- **Impact**: **high**
- **Source strength**: **primary**

### Finding 4: Q2 bounded recovery — lexical expansion should be a weak-result fallback only
- **Source**: [search.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go#L10), [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L771), [pipeline/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/index.ts#L4), [cache.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go#L10)
- **What it does**: Modus expands into 3-5 lexical variants, unions results, and pairs that with lightweight caching. Public already has one canonical pipeline and much richer routing, reranking, and trace behavior.
- **Why it matters**: The transferable pattern is not “add another mainline branch,” but “offer a tightly bounded recovery lane when the canonical pipeline is visibly weak.”
- **Recommendation**: **prototype later**. Q2 Milestone 2. Depends on Q1 doctor/debug visibility and the Q1 rule that all new retrieval behavior stays as a thin wrapper over the same pipeline.
- **Impact**: **low**
- **Source strength**: **primary**

### Finding 5: Q3 context rehydration — connected-doc hints are worth prototyping as an appendix, not as ranking authority
- **Source**: [crossref.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go#L154), [crossref.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go#L181), [vault.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L901), [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L771)
- **What it does**: Modus builds lightweight subject/entity/tag adjacency with fixed `3/2/1` weights and exposes the neighborhood through `vault_connected` or appended hints.
- **Why it matters**: This is a credible Q3 addition for resume/compaction rehydration, but only as an explanation appendix after the review and due-state workflows are stable; it should not outrank Public’s stronger hybrid and graph-backed core.
- **Recommendation**: **prototype later**. Q3 Milestone 1. Depends on Q1 canonical-pipeline discipline and Q2 visibility from fallback experiments.
- **Impact**: **medium**
- **Source strength**: **primary**

### Finding 6: Q3 workflow maturity — durable proposal inboxes should follow the review loop, not precede it
- **Source**: [prs.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/prs.go#L10), [reconsolidation-bridge.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts#L417), [checkpoints.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts#L681)
- **What it does**: Modus persists proposal artifacts and ties merge/reject outcomes back to belief strength. Public already generates advisory reconsolidation recommendations and validation signals, but they are not durable operator work items.
- **Why it matters**: This is the right Q3 workflow layer because it operationalizes existing confidence and review systems, but only once Q1/Q2 establish explicit review events and due-state semantics.
- **Recommendation**: **NEW FEATURE**. Q3 Milestone 2. Depends on Q1 `memory_review` and Q2 `memory_due`/retention contract.
- **Impact**: **high**
- **Source strength**: **primary**

## Sources Consulted
- [research.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md#L89780)
- [iteration-024.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-024.md#L1)
- [iteration-030.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md#L1)
- [memory.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go#L7)
- [vault.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L273)
- [crossref.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go#L9)
- [search.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go#L10)
- [cache.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go#L10)
- [doctor.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/doctor.go#L13)
- [prs.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/prs.go#L10)
- [fsrs-scheduler.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts#L39)
- [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L231)
- [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L482)
- [memory-crud-health.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts#L222)
- [profile-formatters.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts#L374)
- [reconsolidation-bridge.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts#L417)
- [checkpoints.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts#L681)
- [pipeline/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/index.ts#L4)

## Assessment
- New information ratio: **0.18**
- Questions addressed: quarterly sequencing, dependency ordering, operator-surface adoption, retrieval add-on timing, workflow-feature gating.
- Questions answered: Q1 should ship `memory_review`, doctor/debug visibility, and canonical-pipeline discipline; Q2 should define `memory_due` and only then test weak-result lexical fallback; Q3 should layer connected-doc appendix and durable proposal inboxes on top of the Q1/Q2 control plane.
- Novelty justification: This pass added little new code discovery, but it did convert the prior ranked findings into an execution order with explicit dependency edges and quarter-level milestones.

## Ruled Out
- Porting Modus’s fuzzy Jaccard cache into Public mainline, because Public’s routing/scope/rerank knobs make fuzzy cache reuse unsafe.
- Making write-on-read reinforcement the default policy, because Public’s governance depends on retrieval being observational by default.
- Treating librarian-style lexical expansion as a first-class retrieval branch, because it should stay a bounded weak-result recovery path only.
- Letting adjacency hints influence canonical ranking before the review/due-state contract is settled.

## Reflection
- What worked: using the iteration-024 and iteration-030 synthesis as a shortlist, then re-verifying only the live code points behind the likely milestones; that kept the roadmap grounded without rereading all 30 iterations.
- What did not work: broad repo-wide grep for roadmap-related terms produced too much unrelated output from the already-expanded research artifacts, so direct file verification was more efficient.
- What I would do differently: in a write-enabled pass, add a compact roadmap table directly into the phase report with milestone owner, touchpoints, and validation gates so implementation can start immediately.

## Recommended Next Focus
Convert this roadmap into implementation design rather than more external research: Q1 packet for `memory_review` plus doctor/debug presentation, Q2 ADR for authoritative `memory_due`, then Q2/Q3 experiment packets for weak-result lexical fallback and connected-doc appendix.


hook: Stop
hook: Stop Completed
tokens used
106,514
# Iteration 031: ADOPTION ROADMAP DRAFT

## Focus
ADOPTION ROADMAP DRAFT: Convert the prior 30 Modus-vs-Public findings into a dependency-aware Q1/Q2/Q3 adoption roadmap for Spec Kit Memory, with milestones ordered by operator-surface leverage and architectural safety.

## Findings
### Finding 1: Q1 foundation — ship explicit graded `memory_review` before any review queue work
- **Source**: [memory.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go#L7), [vault.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L885), [fsrs-scheduler.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts#L39), [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L297)
- **What it does**: Modus exposes a direct `memory_reinforce` action; Public already has the stronger graded FSRS machinery (`AGAIN/HARD/GOOD/EASY`, `processReview()`, `nextReviewDate`) but only exposes `memory_validate(wasUseful)`.
- **Why it matters**: This is the cleanest Q1 milestone because it uses existing internals, closes the clearest operator gap, and becomes the prerequisite for any trustworthy `memory_due` or retention workflow.
- **Recommendation**: **adopt now**. Q1 Milestone 1. Dependency root for Q2 review-queue work.
- **Impact**: **high**
- **Source strength**: **primary**

### Finding 2: Q1 operator visibility — add a compact doctor/debug surface as presentation, not new backend logic
- **Source**: [doctor.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/doctor.go#L13), [memory-crud-health.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts#L222), [profile-formatters.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts#L374), [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L676)
- **What it does**: Modus turns vault health into a one-screen `doctor` report. Public already has richer health, trace, and profile machinery, but key routing/health visibility is still spread across technical envelopes and stderr logs.
- **Why it matters**: This is the right second Q1 milestone because it improves operator trust and gives the observability needed to safely roll out later fallbacks and review workflows.
- **Recommendation**: **adopt now**. Q1 Milestone 2. Depends on preserving existing repair semantics under a thinner operator-facing summary.
- **Impact**: **medium**
- **Source strength**: **primary**

### Finding 3: Q2 workflow milestone — define an authoritative `memory_due` contract only after `memory_review`
- **Source**: [vault.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L273), [vault.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L856), [fsrs-scheduler.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts#L65), [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L519)
- **What it does**: Modus keeps recall, reinforce, decay, and archive on one visible fact lifecycle. Public already stores the FSRS ingredients and computes `nextReviewDate`, but does not expose an authoritative due queue and keeps read-time strengthening opt-in with `trackAccess=false`.
- **Why it matters**: `memory_due` is high-value product work, but it should not ship until Q1 establishes explicit review events and a clear rule for whether ordinary retrieval changes due-state.
- **Recommendation**: **NEW FEATURE**. Q2 Milestone 1. Depends on Q1 `memory_review` and Q1 visibility surfaces.
- **Impact**: **high**
- **Source strength**: **primary**

### Finding 4: Q2 bounded recovery — lexical expansion should be a weak-result fallback only
- **Source**: [search.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go#L10), [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L771), [pipeline/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/index.ts#L4), [cache.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go#L10)
- **What it does**: Modus expands into 3-5 lexical variants, unions results, and pairs that with lightweight caching. Public already has one canonical pipeline and much richer routing, reranking, and trace behavior.
- **Why it matters**: The transferable pattern is not “add another mainline branch,” but “offer a tightly bounded recovery lane when the canonical pipeline is visibly weak.”
- **Recommendation**: **prototype later**. Q2 Milestone 2. Depends on Q1 doctor/debug visibility and the Q1 rule that all new retrieval behavior stays as a thin wrapper over the same pipeline.
- **Impact**: **low**
- **Source strength**: **primary**

### Finding 5: Q3 context rehydration — connected-doc hints are worth prototyping as an appendix, not as ranking authority
- **Source**: [crossref.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go#L154), [crossref.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go#L181), [vault.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L901), [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L771)
- **What it does**: Modus builds lightweight subject/entity/tag adjacency with fixed `3/2/1` weights and exposes the neighborhood through `vault_connected` or appended hints.
- **Why it matters**: This is a credible Q3 addition for resume/compaction rehydration, but only as an explanation appendix after the review and due-state workflows are stable; it should not outrank Public’s stronger hybrid and graph-backed core.
- **Recommendation**: **prototype later**. Q3 Milestone 1. Depends on Q1 canonical-pipeline discipline and Q2 visibility from fallback experiments.
- **Impact**: **medium**
- **Source strength**: **primary**

### Finding 6: Q3 workflow maturity — durable proposal inboxes should follow the review loop, not precede it
- **Source**: [prs.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/prs.go#L10), [reconsolidation-bridge.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts#L417), [checkpoints.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts#L681)
- **What it does**: Modus persists proposal artifacts and ties merge/reject outcomes back to belief strength. Public already generates advisory reconsolidation recommendations and validation signals, but they are not durable operator work items.
- **Why it matters**: This is the right Q3 workflow layer because it operationalizes existing confidence and review systems, but only once Q1/Q2 establish explicit review events and due-state semantics.
- **Recommendation**: **NEW FEATURE**. Q3 Milestone 2. Depends on Q1 `memory_review` and Q2 `memory_due`/retention contract.
- **Impact**: **high**
- **Source strength**: **primary**

## Sources Consulted
- [research.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md#L89780)
- [iteration-024.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-024.md#L1)
- [iteration-030.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-030.md#L1)
- [memory.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go#L7)
- [vault.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L273)
- [crossref.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go#L9)
- [search.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go#L10)
- [cache.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go#L10)
- [doctor.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/doctor.go#L13)
- [prs.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/prs.go#L10)
- [fsrs-scheduler.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts#L39)
- [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L231)
- [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L482)
- [memory-crud-health.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts#L222)
- [profile-formatters.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts#L374)
- [reconsolidation-bridge.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts#L417)
- [checkpoints.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts#L681)
- [pipeline/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/index.ts#L4)

## Assessment
- New information ratio: **0.18**
- Questions addressed: quarterly sequencing, dependency ordering, operator-surface adoption, retrieval add-on timing, workflow-feature gating.
- Questions answered: Q1 should ship `memory_review`, doctor/debug visibility, and canonical-pipeline discipline; Q2 should define `memory_due` and only then test weak-result lexical fallback; Q3 should layer connected-doc appendix and durable proposal inboxes on top of the Q1/Q2 control plane.
- Novelty justification: This pass added little new code discovery, but it did convert the prior ranked findings into an execution order with explicit dependency edges and quarter-level milestones.

## Ruled Out
- Porting Modus’s fuzzy Jaccard cache into Public mainline, because Public’s routing/scope/rerank knobs make fuzzy cache reuse unsafe.
- Making write-on-read reinforcement the default policy, because Public’s governance depends on retrieval being observational by default.
- Treating librarian-style lexical expansion as a first-class retrieval branch, because it should stay a bounded weak-result recovery path only.
- Letting adjacency hints influence canonical ranking before the review/due-state contract is settled.

## Reflection
- What worked: using the iteration-024 and iteration-030 synthesis as a shortlist, then re-verifying only the live code points behind the likely milestones; that kept the roadmap grounded without rereading all 30 iterations.
- What did not work: broad repo-wide grep for roadmap-related terms produced too much unrelated output from the already-expanded research artifacts, so direct file verification was more efficient.
- What I would do differently: in a write-enabled pass, add a compact roadmap table directly into the phase report with milestone owner, touchpoints, and validation gates so implementation can start immediately.

## Recommended Next Focus
Convert this roadmap into implementation design rather than more external research: Q1 packet for `memory_review` plus doctor/debug presentation, Q2 ADR for authoritative `memory_due`, then Q2/Q3 experiment packets for weak-result lexical fallback and connected-doc appendix.
