### Finding 6: Modus’s small curated tool bundle is easier to learn than Public’s broad surface
- **Source**: [memory.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go#L7); [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md#L191); [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L482)
- **What it does**: Modus deliberately narrows its memory-facing MCP surface to 11 tools. Public’s surface is more capable, but also harder for operators and AI clients to learn quickly.
- **Why it matters**: Discoverability is part of DX. A smaller “operator bundle” can make a powerful system feel approachable without removing advanced capabilities.
- **Recommendation**: **prototype later**. Keep Public’s full surface, but add a curated operator profile or alias bundle centered on search, status, review, debug, health, and adjacency.
- **Impact**: **medium**

## Assessment
- New information ratio: **0.38**
- Strict validation on the phase folder returned `RESULT: PASSED` with the same read-only temp-file warning from `validate.sh`.
- This was a read-only iteration; I verified source evidence and current Public behavior, but did not update `research/research.md` or other phase artifacts.

## Recommended Next Focus
Run the next iteration on **operator workflow design**: map Public’s existing internals into a compact DX control plane with 3 concrete candidates only, `memory_status`, `memory_debug_search`, and `memory_review`, then judge whether each should be a new tool, a `profile:"debug"` response, or a wrapper around existing tools.
--- Iteration 28 ---
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
- **Source**: [crossref.go:9](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go#L9); [crossref.go:41](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go#L41); [vault.go:75](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L75)
- **What it does**: Modus builds lightweight subject/tag/entity adjacency maps at index time and appends connected documents to search output when they were not already returned by lexical search.
- **Why it matters**: For compaction recovery, this is the most transferable Modus idea: after we recover the active spec/task, a cheap connected-neighbor pass could widen context without immediately paying for heavier graph or semantic expansion.
- **Recommendation**: **prototype later**
- **Impact**: **medium**

### Finding 4: Modus’s automatic recall loop is too blunt to map directly onto compaction injection
- **Source**: [vault.go:287](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L287); [vault.go:311](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L311); [facts.go:64](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go#L64); [facts.go:160](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go#L160); [parser.go:65](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go#L65); [writer.go:10](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/writer.go#L10)
- **What it does**: `memory_search` reinforces every returned fact asynchronously, and reinforcement/decay write updated confidence/stability/difficulty/access metadata back into markdown frontmatter.
--
--- Iteration 29 ---
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
- **Source**: [crossref.go:9](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go#L9); [crossref.go:41](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go#L41); [vault.go:75](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L75)
- **What it does**: Modus builds lightweight subject/tag/entity adjacency maps at index time and appends connected documents to search output when they were not already returned by lexical search.
- **Why it matters**: For compaction recovery, this is the most transferable Modus idea: after we recover the active spec/task, a cheap connected-neighbor pass could widen context without immediately paying for heavier graph or semantic expansion.
- **Recommendation**: **prototype later**
- **Impact**: **medium**

### Finding 4: Modus’s automatic recall loop is too blunt to map directly onto compaction injection
- **Source**: [vault.go:287](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L287); [vault.go:311](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L311); [facts.go:64](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go#L64); [facts.go:160](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go#L160); [parser.go:65](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go#L65); [writer.go:10](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/writer.go#L10)
- **What it does**: `memory_search` reinforces every returned fact asynchronously, and reinforcement/decay write updated confidence/stability/difficulty/access metadata back into markdown frontmatter.
--

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

OUTPUT FORMAT:
# Iteration 030: FINAL EXTENDED SYNTHESIS

## Focus
FINAL EXTENDED SYNTHESIS: Integrate all 30 iterations. Update the adopt/prototype/reject classification. Create the definitive recommendation set with priority, effort, and impact scores.

## Findings
### Finding N: [Title]
- **Source**: file path(s)
- **What it does**: technical description
- **Why it matters**: relevance to our system
- **Recommendation**: adopt now / prototype later / reject / NEW FEATURE
- **Impact**: high / medium / low

## Assessment
- New information ratio: [0.0-1.0]

## Recommended Next Focus
[next direction]
hook: SessionStart
hook: SessionStart Completed
hook: UserPromptSubmit
hook: UserPromptSubmit Completed
codex
I’m treating this as a read-only final synthesis pass over the Modus research phase: I’ll refresh the most relevant prior memory context, verify the source evidence in the phase folder and current Spec Kit Memory code, then consolidate iterations 1-29 into one definitive adopt/prototype/reject recommendation set.
exec
/bin/zsh -lc 'rg -n "modus|hybrid-rag-fusion|003-modus-memory-main|memory_review|adjacency|librarian|BM25|FSRS" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
157:- rollout_summaries/2026-04-09T10-35-53-UGDf-009_post_save_render_fixes_memory_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T12-35-53-019d71d0-0ec5-7c80-a08b-6d336ee5c639.jsonl, updated_at=2026-04-09T12:01:25+00:00, thread_id=019d71d0-0ec5-7c80-a08b-6d336ee5c639)
456:## Task 2: Rename packet `023-esm-module-compliance` to `023-hybrid-rag-fusion-refinement` and sync changelog references, outcome success
464:- 023-hybrid-rag-fusion-refinement, memory_index_scan, memory_quick_search, parentChain, B3-hybrid-rag-fusion-refinement, .opencode/changelog
514:- symptom: bulk replacement corrupts values (`B3-hybrid-rag-fusion-refinement`); cause: over-broad regex/string substitution; fix: run post-rewrite `rg` anomaly sweep and apply targeted literal repairs for parentChain/headings/JSON snippets [Task 2]
1113:scope: packet identity rewrites, slug/path sweeps, and follow-on phase packet creation in 022-hybrid-rag-fusion remediation work
1114:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion; reuse_rule=reuse for this epic’s packet lifecycle work only, and verify current live folder names before edits
1120:- rollout_summaries/2026-03-27T18-02-31-ZDov-update_020_pre_release_remediation_paths.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/020-pre-release-remediation, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/27/rollout-2026-03-27T19-02-31-019d3076-47f7-7fd3-8952-dda85e3bdb43.jsonl, updated_at=2026-03-27T18:14:00+00:00, thread_id=019d3076-47f7-7fd3-8952-dda85e3bdb43)
1514:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion and linked docs; reuse_rule=reuse only within this spec family and re-check live numeric IDs each run
1545:- 022-hybrid-rag-fusion, PHASE_LINKS, AI_PROTOCOL, 33 tools, .gemini/agents
1762:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public; reuse_rule=reuse for Hydra work under `022-hybrid-rag-fusion/015-hydra-db-based-features`, but keep scope explicit when staging/committing
1869:- rollout_summaries/2026-03-13T11-01-44-IBXE-outsourced_agent_memory_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/13/rollout-2026-03-13T12-01-44-019ce6dc-0509-7630-9874-db11f57a9e06.jsonl, updated_at=2026-03-13T11:21:38+00:00, thread_id=019ce6dc-0509-7630-9874-db11f57a9e06)
2008:scope: read-only multi-agent review findings and documentation-drift checks for `023-hybrid-rag-fusion-refinement`
2009:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public under .opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement; reuse_rule=reuse for forensic review of this packet family, but confirm current active slug/path before applying findings
2019:- 023-hybrid-rag-fusion-refinement, ultra-think, severity ordering, file+line evidence, CHK-060 duplicate, [Criteria TBD]
2023:- when user asked to “Let 3 ultra-think agents review all work done in .../023-hybrid-rag-fusion-refinement,” run multi-agent read-only review with severity-ranked findings and exact file+line evidence [Task 1]

exec
/bin/zsh -lc "sed -n '1,220p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

codex
I’ve got the deep-research protocol and the memory trace I need. Next I’m reading the phase artifacts plus the specific Modus and Public source files that drive the final classification, so the synthesis stays grounded in code rather than iteration notes alone.
exec
/bin/zsh -lc 'rg --files .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/assets/fsrs-decay.svg
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/assets/security.svg
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/assets/architecture.svg
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/assets/hero.svg
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/assets/doctor.svg
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/assets/comparison.svg
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/assets/demo.svg
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/go.sum
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/MIGRATION_POST.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/entities.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/prs.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/helpers.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/beliefs.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/vault.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/trust.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/bm25.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/facts.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/learnings/learnings.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/learnings.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/server.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/json.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/writer.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/client.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/LICENSE
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/go.mod
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/entities.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/doctor.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/import_khoj.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/phase-research-prompt.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-008.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-019.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-009.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-007.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-017.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-023.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-029.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-003.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-018.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-027.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-013.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-012.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-002.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-026.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-016.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-006.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-025.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-011.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-001.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-014.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-005.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-020.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-004.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-024.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-010.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-015.md

 succeeded in 0ms:
---
title: "Deep Research Report: 003-modus-memory-main"
description: "20-iteration deep research synthesis"
---

# Deep Research Report: 003-modus-memory-main

Generated: 2026-04-10 23:02
Iterations: 20
Engine: Codex GPT-5.4 High (fast mode) + Copilot fallback

---

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

OUTPUT FORMAT (MANDATORY - follow this exactly):
# Iteration 001: ARCHITECTURE OVERVIEW

## Focus
ARCHITECTURE OVERVIEW: Scan repository structure, key directories, main entry points, README, and architecture docs. Map high-level components and data flow.

## Findings
For EACH finding:
### Finding N: [Title]
- **Source**: exact file path(s)
- **What it does**: technical description with code evidence
- **Why it matters for us**: concrete relevance
- **Recommendation**: adopt now / prototype later / reject / NEW FEATURE
- **Impact**: high / medium / low

## Sources Consulted
- [file paths examined]

## Assessment
- New information ratio: [0.0-1.0]
- Questions addressed: [list]
- Questions answered: [list]

## Reflection
- What worked: [approach that yielded results]
- What did not work: [approach that failed]

## Recommended Next Focus
[What to investigate next]
hook: SessionStart
hook: SessionStart Completed
hook: UserPromptSubmit
hook: UserPromptSubmit Completed
codex
I’m treating this as a source-first research pass on the pre-approved `003-modus-memory-main` phase folder. I’ll verify the phase folder state, inspect the Modus code in the required order, compare it against our current memory stack, and then return the iteration report in the exact format you requested.
exec
/bin/zsh -lc 'rg -n "modus-memory|hybrid-rag-fusion|FSRS|BM25|librarian" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
456:## Task 2: Rename packet `023-esm-module-compliance` to `023-hybrid-rag-fusion-refinement` and sync changelog references, outcome success
464:- 023-hybrid-rag-fusion-refinement, memory_index_scan, memory_quick_search, parentChain, B3-hybrid-rag-fusion-refinement, .opencode/changelog
514:- symptom: bulk replacement corrupts values (`B3-hybrid-rag-fusion-refinement`); cause: over-broad regex/string substitution; fix: run post-rewrite `rg` anomaly sweep and apply targeted literal repairs for parentChain/headings/JSON snippets [Task 2]
1113:scope: packet identity rewrites, slug/path sweeps, and follow-on phase packet creation in 022-hybrid-rag-fusion remediation work
1114:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion; reuse_rule=reuse for this epic’s packet lifecycle work only, and verify current live folder names before edits
1120:- rollout_summaries/2026-03-27T18-02-31-ZDov-update_020_pre_release_remediation_paths.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/020-pre-release-remediation, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/27/rollout-2026-03-27T19-02-31-019d3076-47f7-7fd3-8952-dda85e3bdb43.jsonl, updated_at=2026-03-27T18:14:00+00:00, thread_id=019d3076-47f7-7fd3-8952-dda85e3bdb43)
1514:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion and linked docs; reuse_rule=reuse only within this spec family and re-check live numeric IDs each run
1545:- 022-hybrid-rag-fusion, PHASE_LINKS, AI_PROTOCOL, 33 tools, .gemini/agents
1762:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public; reuse_rule=reuse for Hydra work under `022-hybrid-rag-fusion/015-hydra-db-based-features`, but keep scope explicit when staging/committing
2008:scope: read-only multi-agent review findings and documentation-drift checks for `023-hybrid-rag-fusion-refinement`
2009:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public under .opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement; reuse_rule=reuse for forensic review of this packet family, but confirm current active slug/path before applying findings
2019:- 023-hybrid-rag-fusion-refinement, ultra-think, severity ordering, file+line evidence, CHK-060 duplicate, [Criteria TBD]
2023:- when user asked to “Let 3 ultra-think agents review all work done in .../023-hybrid-rag-fusion-refinement,” run multi-agent read-only review with severity-ranked findings and exact file+line evidence [Task 1]

exec
/bin/zsh -lc 'ls -la /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
total 40
drwxr-xr-x   6 michelkerkmeester  staff    192 Apr 10 21:18 .
drwxr-xr-x   7 michelkerkmeester  staff    224 Apr 10 21:07 ..
drwxr-xr-x  12 michelkerkmeester  staff    384 Apr 10 21:19 external
drwxr-xr-x   3 michelkerkmeester  staff     96 Apr 10 21:06 memory
-rw-r--r--   1 michelkerkmeester  staff  17644 Apr 10 21:06 phase-research-prompt.md
drwxr-xr-x   4 michelkerkmeester  staff    128 Apr 10 21:17 research

exec
/bin/zsh -lc 'bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main" --strict' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public

exec
/bin/zsh -lc 'bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main" --strict' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1184ms:

───────────────────────────────────────────────────────────────

  Spec Folder Validation v2.0.0
───────────────────────────────────────────────────────────────


  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main
  Level:  1 (inferred)

───────────────────────────────────────────────────────────────


.opencode/skill/system-spec-kit/scripts/spec/validate.sh: line 406: cannot create temp file for here document: Operation not permitted

───────────────────────────────────────────────────────────────


  Summary: Errors: 0  Warnings: 0

  RESULT: PASSED


codex
The phase already has the research structure in place, and I’ve kicked off strict validation so I can cite the actual current state rather than rely on earlier iteration notes. After that I’m cross-checking the final candidates against both Modus source and our current memory handlers.
2026-04-10T21:34:41.034537Z ERROR codex_core::tools::router: error=failed to parse function arguments: missing field `cell_id` at line 1 column 59
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/bm25.go | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	package index
     2	
     3	import (
     4		"math"
     5		"sort"
     6		"strings"
     7		"unicode"
     8	)
     9	
    10	// BM25 parameters — standard values, tuned for document search.
    11	const (
    12		bm25K1 = 1.2  // term saturation
    13		bm25B  = 0.75 // length normalization
    14	)
    15	
    16	// Field weights — title matches are more valuable than body matches.
    17	// Validated by ByteRover's benchmark: title 3x, path 1.5x achieves 96% LoCoMo.
    18	var fieldWeights = [6]float64{
    19		1.5, // path
    20		1.0, // source
    21		2.0, // subject
    22		3.0, // title
    23		1.5, // tags
    24		1.0, // body
    25	}
    26	
    27	// fieldIndex maps field names to positions.
    28	const (
    29		fieldPath    = 0
    30		fieldSource  = 1
    31		fieldSubject = 2
    32		fieldTitle   = 3
    33		fieldTags    = 4
    34		fieldBody    = 5
    35	)
    36	
    37	// posting records a term occurrence in a specific document field.
    38	type posting struct {
    39		docID int
    40		field int
    41		tf    int // term frequency in this field
    42	}
    43	
    44	// bm25Engine holds the inverted index and document stats for BM25 scoring.
    45	type bm25Engine struct {
    46		postings map[string][]posting // term → postings
    47		docLens  [][6]int             // per-document field lengths (in tokens)
    48		avgLens  [6]float64           // average field lengths across corpus
    49		numDocs  int
    50	}
    51	
    52	// newBM25Engine builds an inverted index from the loaded documents.
    53	func newBM25Engine(docs []document) *bm25Engine {
    54		e := &bm25Engine{
    55			postings: make(map[string][]posting),
    56			docLens:  make([][6]int, len(docs)),
    57			numDocs:  len(docs),
    58		}
    59	
    60		var totalLens [6]int64
    61	
    62		for docID, doc := range docs {
    63			fields := [6]string{
    64				doc.Path,
    65				doc.Source,
    66				doc.Subject,
    67				doc.Title,
    68				doc.Tags,
    69				doc.Body,
    70			}
    71	
    72			for fieldID, text := range fields {
    73				tokens := tokenize(text)
    74				e.docLens[docID][fieldID] = len(tokens)
    75				totalLens[fieldID] += int64(len(tokens))
    76	
    77				// Count term frequencies
    78				tf := make(map[string]int)
    79				for _, t := range tokens {
    80					tf[t]++
    81				}
    82	
    83				for term, count := range tf {
    84					e.postings[term] = append(e.postings[term], posting{
    85						docID: docID,
    86						field: fieldID,
    87						tf:    count,
    88					})
    89				}
    90			}
    91		}
    92	
    93		// Compute average field lengths
    94		for i := 0; i < 6; i++ {
    95			if e.numDocs > 0 {
    96				e.avgLens[i] = float64(totalLens[i]) / float64(e.numDocs)
    97			}
    98		}
    99	
   100		return e
   101	}
   102	
   103	// search scores all documents against the query and returns top results.
   104	func (e *bm25Engine) search(query string, limit int) []scoredDoc {
   105		queryTerms := tokenize(query)
   106		if len(queryTerms) == 0 {
   107			return nil
   108		}
   109	
   110		// Accumulate scores per document
   111		scores := make(map[int]float64)
   112	
   113		for _, term := range queryTerms {
   114			posts, ok := e.postings[term]
   115			if !ok {
   116				// Try prefix match for partial terms
   117				posts = e.prefixMatch(term)
   118				if len(posts) == 0 {
   119					continue
   120				}
   121			}
   122	
   123			// IDF: log((N - df + 0.5) / (df + 0.5) + 1)
   124			df := e.docFreq(term)
   125			idf := math.Log((float64(e.numDocs)-float64(df)+0.5)/(float64(df)+0.5) + 1.0)
   126	
   127			for _, p := range posts {
   128				// BM25 per-field score with field weight
   129				dl := float64(e.docLens[p.docID][p.field])
   130				avgDl := e.avgLens[p.field]
   131				if avgDl == 0 {
   132					avgDl = 1
   133				}
   134	
   135				tf := float64(p.tf)
   136				numerator := tf * (bm25K1 + 1)
   137				denominator := tf + bm25K1*(1-bm25B+bm25B*dl/avgDl)
   138	
   139				score := idf * (numerator / denominator) * fieldWeights[p.field]
   140				scores[p.docID] += score
   141			}
   142		}
   143	
   144		// Sort by score descending
   145		var results []scoredDoc
   146		for docID, score := range scores {
   147			results = append(results, scoredDoc{docID: docID, score: score})
   148		}
   149		sort.Slice(results, func(i, j int) bool {
   150			return results[i].score > results[j].score
   151		})
   152	
   153		if limit > 0 && len(results) > limit {
   154			results = results[:limit]
   155		}
   156		return results
   157	}
   158	
   159	// docFreq returns the number of documents containing a term (across any field).
   160	func (e *bm25Engine) docFreq(term string) int {
   161		posts := e.postings[term]
   162		seen := make(map[int]bool)
   163		for _, p := range posts {
   164			seen[p.docID] = true
   165		}
   166		return len(seen)
   167	}
   168	
   169	// prefixMatch finds postings for terms starting with the given prefix.
   170	// Only used for short queries where exact match fails.
   171	func (e *bm25Engine) prefixMatch(prefix string) []posting {
   172		if len(prefix) < 3 {
   173			return nil
   174		}
   175		var results []posting
   176		for term, posts := range e.postings {
   177			if strings.HasPrefix(term, prefix) {
   178				results = append(results, posts...)
   179			}
   180		}
   181		return results
   182	}
   183	
   184	type scoredDoc struct {
   185		docID int
   186		score float64
   187	}
   188	
   189	// tokenize splits text into lowercase tokens, removing punctuation.
   190	// Uses Porter-like stemming for common suffixes.
   191	func tokenize(text string) []string {
   192		text = strings.ToLower(text)
   193		var tokens []string
   194		var current strings.Builder
   195	
   196		for _, r := range text {
   197			if unicode.IsLetter(r) || unicode.IsDigit(r) {
   198				current.WriteRune(r)
   199			} else {
   200				if current.Len() > 0 {
   201					token := current.String()
   202					if len(token) >= 2 { // skip single-char tokens
   203						tokens = append(tokens, stem(token))
   204					}
   205					current.Reset()
   206				}
   207			}
   208		}
   209		if current.Len() > 0 {
   210			token := current.String()
   211			if len(token) >= 2 {
   212				tokens = append(tokens, stem(token))
   213			}
   214		}
   215	
   216		return tokens
   217	}
   218	
   219	// stem applies minimal suffix stripping. Not a full Porter stemmer —
   220	// just enough to match plurals and common verb forms.
   221	func stem(word string) string {
   222		if len(word) <= 4 {
   223			return word
   224		}
   225	
   226		// Common English suffixes — order matters (longest first)
   227		suffixes := []struct {
   228			suffix string
   229			minLen int // minimum remaining length after stripping
   230		}{
   231			{"nesses", 4},
   232			{"ments", 4},
   233			{"ation", 3},
   234			{"ings", 3},
   235			{"ness", 3},
   236			{"ment", 3},
   237			{"able", 3},
   238			{"ible", 3},
   239			{"tion", 3},
   240			{"sion", 3},
   241			{"ally", 3},
   242			{"ing", 3},
   243			{"ies", 3},
   244			{"ful", 3},
   245			{"ous", 3},
   246			{"ive", 3},
   247			{"ers", 3},
   248			{"est", 3},
   249			{"ize", 3},
   250			{"ise", 3},
   251			{"ity", 3},
   252			{"ed", 3},
   253			{"er", 3},
   254			{"ly", 3},
   255			{"es", 3},
   256			{"ss", 0}, // don't strip -ss (e.g. "less")
   257			{"s", 3},
   258		}
   259	
   260		for _, s := range suffixes {

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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
   241	  "can_wait": ["what can safely wait"]
   242	}
   243	Be specific and concise. Reference items by number.`
   244	
   245		user := fmt.Sprintf("Active missions: %s\n\nItems ingested:\n%s", missions, sb.String())
   246	
   247		response := Call(system, user, 500)
   248		if response == "" {
   249			return &Briefing{}
   250		}
   251	
   252		var b Briefing
   253		if err := ParseJSON(response, &b); err != nil {
   254			log.Printf("librarian/search: briefing parse failed: %v", err)
   255			return &Briefing{}
   256		}
   257		return &b
   258	}
   259	
   260	// FormatBriefing renders a Briefing as a readable markdown string.

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '450,620p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
   561	      });
   562	    }
   563	
   564	    const snippetResults = extractSnippets(resolved.results);
   565	    return createMCPSuccessResponse({
   566	      tool: 'memory_search',
   567	      summary: `Returned ${snippetResults.length} continuation results`,
   568	      data: {
   569	        count: snippetResults.length,
   570	        results: snippetResults,
   571	        continuation: resolved.continuation,
   572	      },
   573	      startTime: _searchStartTime,
   574	      cacheHit: false,
   575	    });
   576	  }
   577	
   578	  const qualityThreshold = resolveQualityThreshold(minQualityScore, min_quality_score);
   579	
   580	  // Validate numeric limit parameter
   581	  const limit = (typeof rawLimit === 'number' && Number.isFinite(rawLimit) && rawLimit > 0)
   582	    ? Math.min(Math.floor(rawLimit), 100)
   583	    : 10;
   584	
   585	  // BUG-007: Validate query first with proper error handling
   586	  let normalizedQuery: string | null = null;
   587	  if (query !== undefined) {
   588	    try {
   589	      normalizedQuery = validateQuery(query);
   590	    } catch (validationError: unknown) {
   591	      if (!concepts || !Array.isArray(concepts) || concepts.length < 2) {
   592	        const message = toErrorMessage(validationError);
   593	        return createMCPErrorResponse({
   594	          tool: 'memory_search',
   595	          error: message,
   596	          code: 'E_VALIDATION',
   597	          details: { parameter: 'query' },
   598	          recovery: {
   599	            hint: 'Provide a valid query string or use concepts array instead'
   600	          }
   601	        });
   602	      }
   603	      normalizedQuery = null;
   604	    }
   605	  }
   606	
   607	  const hasValidQuery = normalizedQuery !== null;
   608	  const hasValidConcepts = Array.isArray(concepts) && concepts.length >= 2;
   609	  const effectiveQuery = normalizedQuery ?? (hasValidConcepts ? concepts.join(', ') : '');
   610	
   611	  if (!hasValidQuery && !hasValidConcepts) {
   612	    return createMCPErrorResponse({
   613	      tool: 'memory_search',
   614	      error: 'Either query (string), concepts (array of 2-5 strings), or cursor (string) is required',
   615	      code: 'E_VALIDATION',
   616	      details: { parameter: 'query' },
   617	      recovery: {
   618	        hint: 'Provide a query string, concepts array with 2-5 entries, or a continuation cursor'
   619	      }
   620	    });

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Fsrs
     3	// ───────────────────────────────────────────────────────────────
     4	// Feature catalog: Classification-based decay
     5	// Augments FSRS stability scores with graph centrality so that
     6	// Central nodes decay slower and peripheral nodes decay faster.
     7	
     8	/* --- 1. INTERFACES --- */
     9	
    10	/**
    11	 * Minimal graph interface required by `computeGraphCentrality`.
    12	 * Defined locally — no imports outside this module's rootDir.
    13	 */
    14	interface MemoryGraphLike {
    15	  /** All graph nodes keyed by node id. */
    16	  nodes: Map<string, unknown>;
    17	  /** Map from node id → list of node ids that point INTO it (inbound edges). */
    18	  inbound: Map<string, string[]>;
    19	  /** Map from node id → list of node ids that this node points TO (outbound edges). */
    20	  outbound: Map<string, string[]>;
    21	}
    22	
    23	/* --- 2. CORE FUNCTIONS --- */
    24	
    25	/**
    26	 * Compute structural freshness by augmenting an FSRS stability score
    27	 * with a graph centrality factor.
    28	 *
    29	 * Formula:
    30	 *   structural_freshness = fsrs_stability * graph_centrality_normalized
    31	 *
    32	 * Central nodes (high centrality) retain more freshness, peripheral
    33	 * nodes (low centrality) decay faster — reflecting the intuition that
    34	 * highly connected knowledge is more reliably accessible over time.
    35	 *
    36	 * @param stability  - FSRS stability value, clamped to [0, 1].
    37	 * @param centrality - Normalized graph centrality value, clamped to [0, 1].
    38	 * @returns Structural freshness score in [0, 1].
    39	 */
    40	export function computeStructuralFreshness(
    41	  stability: number,
    42	  centrality: number
    43	): number {
    44	  const s = Math.min(1, Math.max(0, stability));
    45	  const c = Math.min(1, Math.max(0, centrality));
    46	  return s * c;
    47	}
    48	
    49	/**
    50	 * Compute normalized degree centrality for a node in a graph.
    51	 *
    52	 * Formula:
    53	 *   degree_centrality = (inDegree + outDegree) / (2 * (totalNodes - 1))
    54	 *
    55	 * Normalized to [0, 1]. Returns 0 when:
    56	 * - The node is not found in the graph.
    57	 * - The graph has fewer than 2 nodes (denominator would be 0).
    58	 *
    59	 * @param nodeId - The id of the node to compute centrality for.
    60	 * @param graph  - A memory-graph-like object with `nodes`, `inbound`, and `outbound` maps.
    61	 * @returns Normalized degree centrality in [0, 1].
    62	 */
    63	export function computeGraphCentrality(
    64	  nodeId: string,
    65	  graph: MemoryGraphLike
    66	): number {
    67	  const totalNodes = graph.nodes.size;
    68	
    69	  // Cannot normalize with fewer than 2 nodes.
    70	  if (totalNodes < 2) return 0;
    71	
    72	  // Node must exist in the graph.
    73	  if (!graph.nodes.has(nodeId)) return 0;
    74	
    75	  const inDegree = (graph.inbound.get(nodeId) ?? []).length;
    76	  const outDegree = (graph.outbound.get(nodeId) ?? []).length;
    77	
    78	  const centrality = (inDegree + outDegree) / (2 * (totalNodes - 1));
    79	
    80	  // Clamp to [0, 1] to guard against unexpected edge-list duplication.
    81	  return Math.min(1, Math.max(0, centrality));
    82	}

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go | sed -n '250,960p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
   361			if err != nil {
   362				return "", err
   363			}
   364			return fmt.Sprintf("Stored: %s %s → %s (confidence: %.2f)", subject, predicate, relPath, confidence), nil
   365		}
   366	
   367		memoryStoreSchema := map[string]interface{}{
   368			"type": "object",
   369			"properties": map[string]interface{}{
   370				"subject":    map[string]interface{}{"type": "string"},
   371				"predicate":  map[string]interface{}{"type": "string"},
   372				"value":      map[string]interface{}{"type": "string"},
   373				"confidence": map[string]interface{}{"type": "number", "description": "0.0-1.0"},
   374				"importance": map[string]interface{}{"type": "string", "enum": []string{"critical", "high", "medium", "low"}},
   375			},
   376			"required": []string{"subject", "predicate", "value"},
   377		}
   378	
   379		srv.AddTool("memory_store", "Store a new episodic memory fact.", memoryStoreSchema, memoryStoreHandler)
   380	
   381		// --- Atlas: Entities ---
   382	
   383		srv.AddTool("atlas_list_entities", "List all entities in the knowledge graph.", map[string]interface{}{
   384			"type": "object", "properties": map[string]interface{}{},
   385		}, func(args map[string]interface{}) (string, error) {
   386			docs, err := v.ListEntities()
   387			if err != nil {
   388				return "", err
   389			}
   390	
   391			var sb strings.Builder
   392			sb.WriteString(fmt.Sprintf("%d entities:\n\n", len(docs)))
   393			for _, doc := range docs {
   394				name := doc.Get("name")
   395				kind := doc.Get("kind")
   396				links := doc.WikiLinks()
   397				sb.WriteString(fmt.Sprintf("- **%s** (%s) — %d links\n", name, kind, len(links)))
   398			}
   399			return sb.String(), nil
   400		})
   401	
   402		// --- Atlas: Get Entity ---
   403	
   404		srv.AddTool("atlas_get_entity", "Get an entity page with beliefs and wiki-links.", map[string]interface{}{
   405			"type": "object",
   406			"properties": map[string]interface{}{
   407				"name": map[string]interface{}{"type": "string", "description": "Entity name or slug"},
   408			},
   409			"required": []string{"name"},
   410		}, func(args map[string]interface{}) (string, error) {
   411			name, _ := args["name"].(string)
   412			doc, err := v.GetEntity(name)
   413			if err != nil {
   414				return fmt.Sprintf("Entity %q not found.", name), nil
   415			}
   416	
   417			var sb strings.Builder
   418			sb.WriteString(fmt.Sprintf("# %s\n\n", doc.Get("name")))
   419			sb.WriteString(fmt.Sprintf("Kind: %s | Status: %s\n\n", doc.Get("kind"), doc.Get("status")))
   420			sb.WriteString(doc.Body)
   421	
   422			links := doc.WikiLinks()
   423			if len(links) > 0 {
   424				sb.WriteString("\n\n## Resolved Links\n")
   425				for _, link := range links {
   426					resolved := v.ResolveWikiLink(link)
   427					if resolved != "" {
   428						sb.WriteString(fmt.Sprintf("- [[%s]] → %s\n", link, resolved))
   429					} else {
   430						sb.WriteString(fmt.Sprintf("- [[%s]] → (not found)\n", link))
   431					}
   432				}
   433			}
   434			return sb.String(), nil
   435		})
   436	
   437		// --- Atlas: Beliefs ---
   438	
   439		srv.AddTool("atlas_list_beliefs", "List beliefs from the knowledge graph.", map[string]interface{}{
   440			"type": "object",
   441			"properties": map[string]interface{}{
   442				"subject": map[string]interface{}{"type": "string", "description": "Filter by subject"},
   443				"limit":   map[string]interface{}{"type": "integer"},
   444			},
   445		}, func(args map[string]interface{}) (string, error) {
   446			subject, _ := args["subject"].(string)
   447			limit := 20
   448			if l, ok := args["limit"].(float64); ok {
   449				limit = int(l)
   450			}
   451	
   452			docs, err := v.ListBeliefs(subject, limit)
   453			if err != nil {
   454				return "", err
   455			}
   456	
   457			var sb strings.Builder
   458			for _, doc := range docs {
   459				subj := doc.Get("subject")
   460				pred := doc.Get("predicate")
   461				conf := doc.Get("confidence")
   462				body := strings.TrimSpace(doc.Body)
   463				if len(body) > 100 {
   464					body = body[:100] + "..."
   465				}
   466				sb.WriteString(fmt.Sprintf("- **%s** %s (confidence: %s): %s\n", subj, pred, conf, body))
   467			}
   468			return fmt.Sprintf("%d beliefs:\n\n%s", len(docs), sb.String()), nil
   469		})
   470	
   471		// --- QM: Board ---
   472	
   473		srv.AddTool("qm_board", "Mission board — grouped by status.", map[string]interface{}{
   474			"type": "object", "properties": map[string]interface{}{},
   475		}, func(args map[string]interface{}) (string, error) {
   476			groups := v.MissionBoard()
   477	
   478			var sb strings.Builder
   479			for _, status := range []string{"active", "blocked", "planned", "completed"} {
   480				missions := groups[status]
   481				if len(missions) == 0 {
   482					continue
   483				}
   484				sb.WriteString(fmt.Sprintf("## %s (%d)\n", strings.ToUpper(status[:1])+status[1:], len(missions)))
   485				for _, m := range missions {
   486					title := m.Get("title")
   487					priority := m.Get("priority")
   488					sb.WriteString(fmt.Sprintf("- **%s** (priority: %s)\n", title, priority))
   489				}
   490				sb.WriteByte('\n')
   491			}
   492			return sb.String(), nil
   493		})
   494	
   495		// --- QM: Get Mission ---
   496	
   497		srv.AddTool("qm_get_mission", "Get a specific mission by slug or title.", map[string]interface{}{
   498			"type": "object",
   499			"properties": map[string]interface{}{
   500				"slug": map[string]interface{}{"type": "string", "description": "Mission slug or title"},
   501			},
   502			"required": []string{"slug"},
   503		}, func(args map[string]interface{}) (string, error) {
   504			slug, _ := args["slug"].(string)
   505			doc, err := v.GetMission(slug)
   506			if err != nil {
   507				return fmt.Sprintf("Mission %q not found.", slug), nil
   508			}
   509	
   510			var sb strings.Builder
   511			sb.WriteString(fmt.Sprintf("# %s\n\n", doc.Get("title")))
   512			sb.WriteString(fmt.Sprintf("Status: %s | Priority: %s\n", doc.Get("status"), doc.Get("priority")))
   513			sb.WriteString(fmt.Sprintf("Created: %s\n\n", doc.Get("created")))
   514			sb.WriteString(doc.Body)
   515			return sb.String(), nil
   516		})
   517	
   518		// --- QM: List Missions ---
   519	
   520		srv.AddTool("qm_list_missions", "List missions, optionally filtered by status.", map[string]interface{}{
   521			"type": "object",
   522			"properties": map[string]interface{}{
   523				"status": map[string]interface{}{"type": "string", "description": "Filter: active, blocked, planned, completed"},
   524				"limit":  map[string]interface{}{"type": "integer"},
   525			},
   526		}, func(args map[string]interface{}) (string, error) {
   527			statusFilter, _ := args["status"].(string)
   528			limit := 30
   529			if l, ok := args["limit"].(float64); ok {
   530				limit = int(l)
   531			}
   532	
   533			docs, err := v.ListMissions(statusFilter, limit)
   534			if err != nil {
   535				return "", err
   536			}
   537	
   538			var sb strings.Builder
   539			for _, m := range docs {
   540				status := m.Get("status")
   541				title := m.Get("title")
   542				priority := m.Get("priority")
   543				sb.WriteString(fmt.Sprintf("- [%s] **%s** (priority: %s)\n", status, title, priority))
   544			}
   545			return fmt.Sprintf("%d missions:\n\n%s", len(docs), sb.String()), nil
   546		})
   547	
   548		// --- QM: Create Mission ---
   549	
   550		srv.AddTool("qm_create_mission", "Create a new mission.", map[string]interface{}{
   551			"type": "object",
   552			"properties": map[string]interface{}{
   553				"title":       map[string]interface{}{"type": "string"},
   554				"description": map[string]interface{}{"type": "string"},
   555				"priority":    map[string]interface{}{"type": "string", "enum": []string{"critical", "high", "medium", "low"}},
   556			},
   557			"required": []string{"title", "description"},
   558		}, func(args map[string]interface{}) (string, error) {
   559			title, _ := args["title"].(string)
   560			description, _ := args["description"].(string)
   561			priority, _ := args["priority"].(string)
   562	
   563			path, err := v.CreateMission(title, description, priority)
   564			if err != nil {
   565				return "", err
   566			}
   567			return fmt.Sprintf("Mission created: %s → %s", title, path), nil
   568		})
   569	
   570		// --- QM: Ship Clock ---
   571	
   572		srv.AddTool("qm_ship_clock", "Ship clock — days remaining to target.", map[string]interface{}{
   573			"type": "object", "properties": map[string]interface{}{},
   574		}, func(args map[string]interface{}) (string, error) {
   575			return v.ShipClockJSON()
   576		})
   577	
   578		// --- QM: Blueprints ---
   579	
   580		srv.AddTool("qm_blueprints", "List reusable mission blueprints.", map[string]interface{}{
   581			"type": "object",
   582			"properties": map[string]interface{}{
   583				"limit": map[string]interface{}{"type": "integer"},
   584			},
   585		}, func(args map[string]interface{}) (string, error) {
   586			limit := 20
   587			if l, ok := args["limit"].(float64); ok {
   588				limit = int(l)
   589			}
   590	
   591			docs, err := v.ListBlueprints(limit)
   592			if err != nil {
   593				return "No blueprints found.", nil
   594			}
   595	
   596			var sb strings.Builder
   597			for _, doc := range docs {
   598				name := doc.Get("name")
   599				kind := doc.Get("type")
   600				sb.WriteString(fmt.Sprintf("- **%s** (%s)\n", name, kind))
   601			}
   602			return fmt.Sprintf("%d blueprints:\n\n%s", len(docs), sb.String()), nil
   603		})
   604	
   605		// --- Atlas: Trust Stage ---
   606	
   607		srv.AddTool("atlas_get_trust", "Get the current trust stage (1=Inform, 2=Recommend, 3=Act).", map[string]interface{}{
   608			"type": "object", "properties": map[string]interface{}{},
   609		}, func(args map[string]interface{}) (string, error) {
   610			stage, config, err := v.GetTrustStage()
   611			if err != nil {
   612				return "", err
   613			}
   614			label := vault.TrustStageLabel(stage)
   615			updatedBy, _ := config["updated_by"].(string)
   616			return fmt.Sprintf("Trust: %s\nUpdated by: %s", label, updatedBy), nil
   617		})
   618	
   619		srv.AddTool("atlas_set_trust", "Set the trust stage (1-3). Operator only — MODUS never self-promotes.", map[string]interface{}{
   620			"type": "object",
   621			"properties": map[string]interface{}{
   622				"stage":      map[string]interface{}{"type": "integer", "description": "Trust stage: 1 (Inform), 2 (Recommend), 3 (Act)"},
   623				"updated_by": map[string]interface{}{"type": "string", "description": "Who is making this change"},
   624				"reason":     map[string]interface{}{"type": "string", "description": "Reason for the change"},
   625			},
   626			"required": []string{"stage", "updated_by"},
   627		}, func(args map[string]interface{}) (string, error) {
   628			stage := int(args["stage"].(float64))
   629			updatedBy, _ := args["updated_by"].(string)
   630			reason, _ := args["reason"].(string)
   631			if err := v.SetTrustStage(stage, updatedBy, reason); err != nil {
   632				return "", err
   633			}
   634			return fmt.Sprintf("Trust stage set to %d (%s) by %s", stage, vault.TrustStageLabel(stage), updatedBy), nil
   635		})
   636	
   637		// --- Atlas: Belief Decay ---
   638	
   639		srv.AddTool("atlas_decay_beliefs", "Run belief confidence decay sweep. Returns count of beliefs updated.", map[string]interface{}{
   640			"type": "object", "properties": map[string]interface{}{},
   641		}, func(args map[string]interface{}) (string, error) {
   642			n, err := v.DecayAllBeliefs()
   643			if err != nil {
   644				return "", err
   645			}
   646			return fmt.Sprintf("Decayed %d beliefs.", n), nil
   647		})
   648	
   649		srv.AddTool("atlas_reinforce_belief", "Reinforce a belief's confidence (+0.05 independent, +0.02 same source).", map[string]interface{}{
   650			"type": "object",
   651			"properties": map[string]interface{}{
   652				"path":   map[string]interface{}{"type": "string", "description": "Relative path to belief file"},
   653				"source": map[string]interface{}{"type": "string", "description": "Source of reinforcement"},
   654			},
   655			"required": []string{"path"},
   656		}, func(args map[string]interface{}) (string, error) {
   657			relPath, _ := args["path"].(string)
   658			source, _ := args["source"].(string)
   659			if err := v.ReinforceBelief(relPath, source); err != nil {
   660				return "", err
   661			}
   662			return fmt.Sprintf("Reinforced: %s", relPath), nil
   663		})
   664	
   665		srv.AddTool("atlas_weaken_belief", "Weaken a belief's confidence (-0.10, floor 0.05).", map[string]interface{}{
   666			"type": "object",
   667			"properties": map[string]interface{}{
   668				"path": map[string]interface{}{"type": "string", "description": "Relative path to belief file"},
   669			},
   670			"required": []string{"path"},
   671		}, func(args map[string]interface{}) (string, error) {
   672			relPath, _ := args["path"].(string)
   673			if err := v.WeakenBelief(relPath); err != nil {
   674				return "", err
   675			}
   676			return fmt.Sprintf("Weakened: %s", relPath), nil
   677		})
   678	
   679		// --- Atlas: PRs (Evolution Proposals) ---
   680	
   681		srv.AddTool("atlas_open_pr", "Open a new evolution proposal (PR) for the knowledge graph.", map[string]interface{}{
   682			"type": "object",
   683			"properties": map[string]interface{}{
   684				"title":       map[string]interface{}{"type": "string"},
   685				"opened_by":   map[string]interface{}{"type": "string"},
   686				"target_type": map[string]interface{}{"type": "string", "description": "entity, belief, or fact"},
   687				"target_id":   map[string]interface{}{"type": "string"},
   688				"reasoning":   map[string]interface{}{"type": "string"},
   689				"confidence":  map[string]interface{}{"type": "number"},
   690				"linked_belief_ids": map[string]interface{}{
   691					"type":  "array",
   692					"items": map[string]interface{}{"type": "string"},
   693				},
   694			},
   695			"required": []string{"title", "opened_by", "reasoning"},
   696		}, func(args map[string]interface{}) (string, error) {
   697			title, _ := args["title"].(string)
   698			openedBy, _ := args["opened_by"].(string)
   699			targetType, _ := args["target_type"].(string)
   700			targetID, _ := args["target_id"].(string)
   701			reasoning, _ := args["reasoning"].(string)
   702			confidence := 0.7
   703			if c, ok := args["confidence"].(float64); ok {
   704				confidence = c
   705			}
   706			var linkedIDs []string
   707			if arr, ok := args["linked_belief_ids"].([]interface{}); ok {
   708				for _, item := range arr {
   709					if s, ok := item.(string); ok {
   710						linkedIDs = append(linkedIDs, s)
   711					}
   712				}
   713			}
   714			path, err := v.OpenPR(title, openedBy, targetType, targetID, reasoning, confidence, linkedIDs)
   715			if err != nil {
   716				return "", err
   717			}
   718			return fmt.Sprintf("PR opened: %s", path), nil
   719		})
   720	
   721		srv.AddTool("atlas_merge_pr", "Merge an evolution PR. Reinforces linked beliefs. Operator only.", map[string]interface{}{
   722			"type": "object",
   723			"properties": map[string]interface{}{
   724				"path":      map[string]interface{}{"type": "string", "description": "Relative path to PR file"},
   725				"closed_by": map[string]interface{}{"type": "string"},
   726			},
   727			"required": []string{"path", "closed_by"},
   728		}, func(args map[string]interface{}) (string, error) {
   729			relPath, _ := args["path"].(string)
   730			closedBy, _ := args["closed_by"].(string)
   731			if err := v.MergePR(relPath, closedBy); err != nil {
   732				return "", err
   733			}
   734			return fmt.Sprintf("PR merged: %s (by %s). Linked beliefs reinforced.", relPath, closedBy), nil
   735		})
   736	
   737		srv.AddTool("atlas_reject_pr", "Reject an evolution PR. Weakens linked beliefs. Operator only.", map[string]interface{}{
   738			"type": "object",
   739			"properties": map[string]interface{}{
   740				"path":      map[string]interface{}{"type": "string", "description": "Relative path to PR file"},
   741				"closed_by": map[string]interface{}{"type": "string"},
   742				"reason":    map[string]interface{}{"type": "string"},
   743			},
   744			"required": []string{"path", "closed_by"},
   745		}, func(args map[string]interface{}) (string, error) {
   746			relPath, _ := args["path"].(string)
   747			closedBy, _ := args["closed_by"].(string)
   748			reason, _ := args["reason"].(string)
   749			if err := v.RejectPR(relPath, closedBy, reason); err != nil {
   750				return "", err
   751			}
   752			return fmt.Sprintf("PR rejected: %s (by %s). Linked beliefs weakened.", relPath, closedBy), nil
   753		})
   754	
   755		srv.AddTool("atlas_list_prs", "List evolution PRs, optionally filtered by status.", map[string]interface{}{
   756			"type": "object",
   757			"properties": map[string]interface{}{
   758				"status": map[string]interface{}{"type": "string", "description": "Filter: open, merged, rejected"},
   759			},
   760		}, func(args map[string]interface{}) (string, error) {
   761			status, _ := args["status"].(string)
   762			docs, err := v.ListPRs(status)
   763			if err != nil {
   764				return "", err
   765			}
   766			if len(docs) == 0 {
   767				return "No PRs found.", nil
   768			}
   769			var sb strings.Builder
   770			for _, doc := range docs {
   771				title := doc.Get("title")
   772				st := doc.Get("status")
   773				openedBy := doc.Get("opened_by")
   774				sb.WriteString(fmt.Sprintf("- [%s] **%s** (by %s)\n", st, title, openedBy))
   775			}
   776			return fmt.Sprintf("%d PRs:\n\n%s", len(docs), sb.String()), nil
   777		})
   778	
   779		// --- QM: Mission Dependencies ---
   780	
   781		srv.AddTool("qm_add_dependency", "Add a typed dependency between missions.", map[string]interface{}{
   782			"type": "object",
   783			"properties": map[string]interface{}{
   784				"mission": map[string]interface{}{"type": "string", "description": "Mission slug that has the dependency"},
   785				"depends_on": map[string]interface{}{"type": "string", "description": "Mission slug it depends on"},
   786				"type": map[string]interface{}{"type": "string", "description": "blocks, informs, or enhances"},
   787			},
   788			"required": []string{"mission", "depends_on", "type"},
   789		}, func(args map[string]interface{}) (string, error) {
   790			mission, _ := args["mission"].(string)
   791			dep, _ := args["depends_on"].(string)
   792			depType, _ := args["type"].(string)
   793			if err := v.AddDependency(mission, dep, depType); err != nil {
   794				return "", err
   795			}
   796			return fmt.Sprintf("Dependency added: %s → %s (%s)", mission, dep, depType), nil
   797		})
   798	
   799		srv.AddTool("qm_remove_dependency", "Remove a dependency from a mission.", map[string]interface{}{
   800			"type": "object",
   801			"properties": map[string]interface{}{
   802				"mission": map[string]interface{}{"type": "string", "description": "Mission slug"},
   803				"depends_on": map[string]interface{}{"type": "string", "description": "Dependency to remove"},
   804			},
   805			"required": []string{"mission", "depends_on"},
   806		}, func(args map[string]interface{}) (string, error) {
   807			mission, _ := args["mission"].(string)
   808			dep, _ := args["depends_on"].(string)
   809			if err := v.RemoveDependency(mission, dep); err != nil {
   810				return "", err
   811			}
   812			return fmt.Sprintf("Dependency removed: %s → %s", mission, dep), nil
   813		})
   814	
   815		srv.AddTool("qm_get_dependencies", "Get a mission's dependencies with satisfaction status and whether it can start.", map[string]interface{}{
   816			"type": "object",
   817			"properties": map[string]interface{}{
   818				"mission": map[string]interface{}{"type": "string", "description": "Mission slug"},
   819			},
   820			"required": []string{"mission"},
   821		}, func(args map[string]interface{}) (string, error) {
   822			mission, _ := args["mission"].(string)
   823			deps, err := v.GetDependencies(mission)
   824			if err != nil {
   825				return "", err
   826			}
   827	
   828			// Check can_start
   829			canStart, blockers, _ := v.CanStart(mission)
   830			var sb strings.Builder
   831	
   832			if canStart {
   833				sb.WriteString(fmt.Sprintf("Mission %q: **ready to start**\n\n", mission))
   834			} else {
   835				sb.WriteString(fmt.Sprintf("Mission %q: **blocked** by %s\n\n", mission, strings.Join(blockers, ", ")))
   836			}
   837	
   838			if len(deps) == 0 {
   839				sb.WriteString("No dependencies.")
   840				return sb.String(), nil
   841			}
   842	
   843			for _, d := range deps {
   844				satisfied := "no"
   845				if s, ok := d["satisfied"].(bool); ok && s {
   846					satisfied = "yes"
   847				}
   848				sb.WriteString(fmt.Sprintf("- %s (%s) — status: %s, satisfied: %s\n",
   849					d["slug"], d["type"], d["status"], satisfied))
   850			}
   851			return sb.String(), nil
   852		})
   853	
   854		// --- Memory: Fact Decay ---
   855	
   856		srv.AddTool("memory_decay_facts", "Run memory fact confidence decay sweep.", map[string]interface{}{
   857			"type": "object", "properties": map[string]interface{}{},
   858		}, func(args map[string]interface{}) (string, error) {
   859			n, err := v.DecayFacts()
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
/bin/zsh -lc "rg -n \"memory_validate|trackAccess|processReview|nextReviewDate|AGAIN|HARD|GOOD|EASY|memory_review|memory_due|review\" .opencode/skill/system-spec-kit/mcp_server -g '"'!**/dist/**'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:46:| `SPECKIT_EVAL_LOGGING` | Persists evaluation events for later review, but does not authorize publication-grade multiplier claims. |
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:9:// Feature catalog: Validation feedback (memory_validate)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:40:  action: 'review';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:151:  review_count?: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:70: *   0.88 <= sim < 0.96  → review (supersede or complement recommendation)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:78:): 'auto_merge' | 'review' | 'keep_separate' {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:80:  if (similarity >= ASSISTIVE_REVIEW_THRESHOLD)     return 'review';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:85: * Classify whether a borderline (review-tier) memory pair should be
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:130:   *  borderline pair is detected (review tier). */
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:417:        } else if (tier === 'review') {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:421:            action: 'review',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts:20:// Feature catalog: Validation feedback (memory_validate)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:27:// Feature catalog: Validation feedback (memory_validate)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:31:// Feature catalog: Validation feedback (memory_validate)
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:292:export const handle_memory_validate = lazyFunction(getCheckpointsModule, 'handle_memory_validate');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:411:      meta.parseFailedPreview = parseFailedInnerText.slice(0, 120);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts:22:// Feature catalog: Validation feedback (memory_validate)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:29:// Feature catalog: Validation feedback (memory_validate)
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:517:      hints.push('Contradicting relationships detected - review for consistency');
.opencode/skill/system-spec-kit/mcp_server/cli.ts:114:    [--dry-run]                    Preview without deleting
.opencode/skill/system-spec-kit/mcp_server/cli.ts:307:  console.log(`\nBulk Delete Preview`);
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:17:- [3. HARDENING NOTES](#3--hardening-notes)
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:36:- `checkpoints.ts` - Checkpoint lifecycle plus `memory_validate`.
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:75:## 3. HARDENING NOTES
.opencode/skill/system-spec-kit/mcp_server/api/index.ts:9:// auditing all consumers first (see review/review-report.md P2-MNT-02).
.opencode/skill/system-spec-kit/mcp_server/README.md:78:| **Save quality** | Accept everything | 3-layer gate (structure, semantic sufficiency, duplicate) with dry-run preview |
.opencode/skill/system-spec-kit/mcp_server/README.md:322:Think of it like how your own brain works: things you reviewed recently are easy to recall, while things you have not thought about in months fade into the background.
.opencode/skill/system-spec-kit/mcp_server/README.md:455:If a file fails any gate, the system rejects it with a clear explanation. Preview all checks without saving using `dryRun: true`.
.opencode/skill/system-spec-kit/mcp_server/README.md:707:| `dryRun` | boolean | Preview validation without saving |
.opencode/skill/system-spec-kit/mcp_server/README.md:816:##### `memory_validate`
.opencode/skill/system-spec-kit/mcp_server/README.md:1042:The MCP handler scores chunk-backed hits against `parentMemoryId ?? row.id`, so eval rows stay attached to canonical parent memories. Before comparing runs after a DB rebuild or import, preview or refresh the live ground-truth mapping with `scripts/evals/map-ground-truth-ids.ts`; if token-budget overflow collapses a run below `recallK`, treat that run as investigation-only rather than a clean benchmark.
.opencode/skill/system-spec-kit/mcp_server/README.md:1264:| L7 | Maintenance | 10 | 1,000 | Re-index files, review history, run bulk imports |
.opencode/skill/system-spec-kit/mcp_server/README.md:1578:**Fix**: Preview what would happen with a dry run:
.opencode/skill/system-spec-kit/mcp_server/README.md:1644:| Slow responses on large index | Set `ENABLE_TOOL_CACHE=true` and review cache + trace settings before enabling heavier debug output |
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:557:        'Restore applied partially; review restored.errors and restored.skipped before retrying',
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:648:/** Handle memory_validate tool - records user validation feedback to adjust confidence */
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:688:      actor: sessionId ?? 'memory_validate',
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:726:  // T002 + T027a: Optional wiring from memory_validate to learned feedback + ground truth.
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:780:    tool: 'memory_validate',
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:815:const handle_memory_validate = handleMemoryValidate;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:822:  handle_memory_validate,
.opencode/skill/system-spec-kit/mcp_server/utils/README.md:19:- [3. HARDENING NOTES](#3--hardening-notes)
.opencode/skill/system-spec-kit/mcp_server/utils/README.md:57:## 3. HARDENING NOTES
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:88:    if (args.loopType !== 'research' && args.loopType !== 'review') {
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:89:      return errorResponse('loopType must be "research" or "review"');
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:340:  // Check dimension coverage — blocking gate for review mode.
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:341:  // Incomplete dimension coverage means the review is not yet comprehensive
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:148:  trackAccess: z.boolean().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:407:  memory_validate: memoryValidateSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:463:  memory_search: ['cursor', 'query', 'concepts', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'sessionId', 'enableDedup', 'tier', 'contextType', 'useDecay', 'includeContiguity', 'includeConstitutional', 'enableSessionBoost', 'enableCausalBoost', 'includeContent', 'anchors', 'min_quality_score', 'minQualityScore', 'bypassCache', 'rerank', 'applyLengthPenalty', 'applyStateLimits', 'minState', 'intent', 'autoDetectIntent', 'trackAccess', 'includeArchived', 'mode', 'includeTrace', 'profile'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:472:  memory_validate: ['id', 'wasUseful', 'queryId', 'queryTerms', 'resultRank', 'totalResultsShown', 'searchMode', 'intent', 'sessionId', 'notes'],
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:125:  last_review?: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:202:  trackAccess?: boolean; // opt-in access tracking (default false)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:519:    trackAccess: trackAccess = false, // opt-in, off by default
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:801:      trackAccess,
.opencode/skill/system-spec-kit/mcp_server/hooks/README.md:18:- [3. HARDENING NOTES](#3--hardening-notes)
.opencode/skill/system-spec-kit/mcp_server/hooks/README.md:75:## 3. HARDENING NOTES
.opencode/skill/system-spec-kit/mcp_server/schemas/README.md:70:- `../tests/review-fixes.vitest.ts` -- test coverage for schema validation
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:51:    if (args.loopType !== 'research' && args.loopType !== 'review') {
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:52:      return errorResponse('loopType must be "research" or "review"');
.opencode/skill/system-spec-kit/mcp_server/formatters/README.md:18:- [3. HARDENING NOTES](#3--hardening-notes)
.opencode/skill/system-spec-kit/mcp_server/formatters/README.md:46:## 3. HARDENING NOTES
.opencode/skill/system-spec-kit/mcp_server/handlers/handler-utils.ts:21:// Feature catalog: Validation feedback (memory_validate)
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:165:      trackAccess: {
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:298:  name: 'memory_validate',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:564:  inputSchema: { type: 'object', additionalProperties: false, properties: { specFolder: { type: 'string', description: 'Limit scan to specific spec folder (e.g., "005-memory")' }, force: { type: 'boolean', default: false, description: 'Force re-index all files (ignore content hash)' }, includeConstitutional: { type: 'boolean', default: true, description: 'Whether to scan .opencode/skill/*/constitutional/ directories' }, includeSpecDocs: { type: 'boolean', default: true, description: 'Whether to scan .opencode/specs/ directories for spec folder documents (spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, research/research.md, handover.md). Iteration artifacts under research/iterations/ and review/iterations/ are excluded from spec-doc indexing. Set SPECKIT_INDEX_SPEC_DOCS=false env var to disable globally.' }, incremental: { type: 'boolean', default: true, description: 'Enable incremental indexing. When true (default), skips files whose mtime and content hash are unchanged since last index. Set to false to re-evaluate all files regardless of change detection.' } }, required: [] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:786:      loopType: { type: 'string', enum: ['research', 'review'], description: 'Loop type: research or review (required)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:832:      loopType: { type: 'string', enum: ['research', 'review'], description: 'Loop type (required)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:850:      loopType: { type: 'string', enum: ['research', 'review'], description: 'Loop type (required)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:858:  description: '[L9:CoverageGraph] Composite convergence assessment for deep-loop coverage graph. Returns a typed decision (CONTINUE, STOP_ALLOWED, STOP_BLOCKED), signal values, blockers with severity levels, and a typed trace explaining each signal threshold evaluation. For research: evaluates questionCoverage, claimVerificationRate, contradictionDensity, plus blocking guards sourceDiversity and evidenceDepth. For review: evaluates dimensionCoverage, findingStability, p0ResolutionRate, evidenceDensity, hotspotSaturation. Extends Phase 001 stop logic without replacing newInfoRatio.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:863:      loopType: { type: 'string', enum: ['research', 'review'], description: 'Loop type (required)' },
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:52:  return loopType === 'research' || loopType === 'review';
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:77:      return errorResponse('loopType must be "research" or "review"');
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:67:  review_count?: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:95:  'type_inference_source', 'stability', 'difficulty', 'review_count',
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/status.ts:35:    if (args.loopType !== 'research' && args.loopType !== 'review') {
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/status.ts:36:      return errorResponse('loopType must be "research" or "review"');
.opencode/skill/system-spec-kit/mcp_server/configs/README.md:20:- [3. HARDENING NOTES](#3--hardening-notes)
.opencode/skill/system-spec-kit/mcp_server/configs/README.md:59:## 3. HARDENING NOTES
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:74:  trackAccess?: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:386:  elapsedDays  // Days since last review
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:402:2. **FSRS calculation**: If timestamps exist (`last_review`, `lastReview`, `updated_at`, or `created_at`), calculate using FSRS formula
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-stop.vitest.ts:23:        '.opencode/specs/system-spec-kit/024-compact-code-graph/029-review-remediation/tasks.md',
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-stop.vitest.ts:25:        '.opencode/specs/system-spec-kit/024-compact-code-graph/029-review-remediation/checklist.md',
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-stop.vitest.ts:33:        'specs/system-spec-kit/024-compact-code-graph/029-review-remediation',
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-stop.vitest.ts:35:    ).toBe('specs/system-spec-kit/024-compact-code-graph/029-review-remediation');
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-stop.vitest.ts:44:        '.opencode/specs/system-spec-kit/024-compact-code-graph/029-review-remediation/tasks.md',
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-stop.vitest.ts:59:        '.opencode/specs/system-spec-kit/024-compact-code-graph/029-review-remediation/tasks.md',
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-stop.vitest.ts:60:        '.opencode/specs/system-spec-kit/024-compact-code-graph/029-review-remediation/checklist.md',
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-stop.vitest.ts:66:      'specs/system-spec-kit/024-compact-code-graph/029-review-remediation',
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-stop.vitest.ts:85:        'specs/system-spec-kit/024-compact-code-graph/029-review-remediation',
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:61: * For review: dimensions/files that are not sources of outgoing COVERS or EVIDENCE_FOR edges.
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:77:  if (loopType === 'review') {
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:236: * For review: FINDING nodes with no RESOLVES edges.
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:120:        last_review TEXT,
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:71:  'memory_validate',
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:106:    case 'memory_validate':       return handleMemoryValidate(parseArgs<MemoryValidateArgs>(validateToolArgs('memory_validate', args)));
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:148:      SELECT id, stability, difficulty, last_review, review_count, title
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:157:    const elapsedDays = fsrsScheduler.calculateElapsedDays(memory.last_review as string | null);
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:165:      fsrsScheduler.GRADE_GOOD,
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:179:          last_review = datetime('now'),
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:180:          review_count = COALESCE(review_count, 0) + 1,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:85:        last_review TEXT DEFAULT (datetime('now')),
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:86:        review_count INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:621:            id, spec_folder, file_path, title, content_text, content_hash, stability, difficulty, review_count
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:4:// Scoped governance isolation, retention behavior, and audit review.
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:5:// research and review convergence metrics.
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:312: * Compute review convergence signals.
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:437: * Dispatches to research or review signal computation based on loop type.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:555:      "query": "security review of the path traversal prevention in memory file loading",
.opencode/skill/system-spec-kit/mcp_server/database/README.md:18:- [3. HARDENING NOTES](#3--hardening-notes)
.opencode/skill/system-spec-kit/mcp_server/database/README.md:54:## 3. HARDENING NOTES
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:18:// 8. Sprint gate review -- manual review before enabling
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:41:    last_review: '2025-02-01T12:00:00Z',
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:42:    review_count: 5,
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:82:    reviewCount: 5,
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:165:    row.last_review = null;
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:217:    expect(memory.reviewCount).toBe(5);
.opencode/skill/system-spec-kit/mcp_server/tests/assistive-reconsolidation.vitest.ts:61:  it('auto-merge threshold is above review threshold', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/assistive-reconsolidation.vitest.ts:77:  it('returns "review" for similarity in [0.88, 0.96)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/assistive-reconsolidation.vitest.ts:78:    expect(classifyAssistiveSimilarity(0.88)).toBe('review');
.opencode/skill/system-spec-kit/mcp_server/tests/assistive-reconsolidation.vitest.ts:79:    expect(classifyAssistiveSimilarity(0.90)).toBe('review');
.opencode/skill/system-spec-kit/mcp_server/tests/assistive-reconsolidation.vitest.ts:80:    expect(classifyAssistiveSimilarity(0.9599)).toBe('review');
.opencode/skill/system-spec-kit/mcp_server/tests/assistive-reconsolidation.vitest.ts:93:  it('exact boundary 0.88 is review', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/assistive-reconsolidation.vitest.ts:94:    expect(classifyAssistiveSimilarity(0.88)).toBe('review');
.opencode/skill/system-spec-kit/mcp_server/tests/assistive-reconsolidation.vitest.ts:204:    // review
.opencode/skill/system-spec-kit/mcp_server/tests/assistive-reconsolidation.vitest.ts:205:    expect(classifyAssistiveSimilarity(0.959)).toBe('review');
.opencode/skill/system-spec-kit/mcp_server/tests/assistive-reconsolidation.vitest.ts:206:    expect(classifyAssistiveSimilarity(0.88)).toBe('review');
.opencode/skill/system-spec-kit/mcp_server/tests/assistive-reconsolidation.vitest.ts:223:    expect(tier).toBe('review');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:776:      JSON.stringify({ note: 'resolved by reviewer' }),
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:17:export type LoopType = 'research' | 'review';
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:124:/** Initial weight estimates for review relations */
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:139:  review: ['DIMENSION', 'FILE', 'FINDING', 'EVIDENCE', 'REMEDIATION'] as const,
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:145:  review: ['COVERS', 'EVIDENCE_FOR', 'CONTRADICTS', 'RESOLVES', 'CONFIRMS', 'ESCALATES', 'IN_DIMENSION', 'IN_FILE'] as const,
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:156:    loop_type TEXT NOT NULL CHECK(loop_type IN ('research', 'review')),
.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:85:      trackAccess: false,
.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:348:    input.config.trackAccess = true;
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:95:    { id: 403, content: 'Post-save review highlights title, trigger phrase, and importance tier issues. '.repeat(2) },
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:59:      last_review TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:60:      review_count INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:61:  last_review?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:62:  review_count?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:151:  { pattern: /\/review\/iterations\//, type: 'working' },
.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:146:    it('Recent review => ~1.0', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:149:        last_review: new Date().toISOString(),
.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:156:    it('No last_review => returns baseScore', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:327:      expect(fsrsScheduler.GRADE_AGAIN).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:328:      expect(fsrsScheduler.GRADE_HARD).toBe(2);
.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:329:      expect(fsrsScheduler.GRADE_GOOD).toBe(3);
.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:330:      expect(fsrsScheduler.GRADE_EASY).toBe(4);
.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:423:    // Deprecated tier also frozen — use applyFsrsDecay with no last_review to get baseScore back
.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:424:    it('No last_review = frozen state (returns baseScore)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:123:      last_review TEXT DEFAULT (datetime('now')),
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:124:      review_count INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts:20:  '/review/iterations/',
.opencode/skill/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts:27:  '/review/',
.opencode/skill/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts:30:  '/review/iterations/',
.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:353:      'review XSS security vulnerabilities in forms',
.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:540:        'review XSS protections in forms',
.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:544:        'security review of user input validation',
.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:581:      security_audit: ['security audit', 'vulnerability check', 'xss review', 'penetration test', 'audit permissions'],
.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:624:      security_audit: 'security audit vulnerability and injection review',
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:384:    it('research/review iteration paths fall back to working-artifact weight', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:386:      expect(calculateDocumentWeight('/p/specs/x/review/iterations/iteration-001.md')).toBe(0.25);
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:880:        last_review: null,
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:881:        review_count: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:923:        last_review: null,
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:924:        review_count: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/provenance-envelope.vitest.ts:82:  GRADE_GOOD: 3,
.opencode/skill/system-spec-kit/mcp_server/tests/provenance-envelope.vitest.ts:223:      trackAccess: false,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:62:   2. DIVERSITY HARD GATES
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:72:  MIN_HARD_NEGATIVES: 3,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:271:    required: GATES.MIN_HARD_NEGATIVES,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:273:    passed: hardNegativeCount >= GATES.MIN_HARD_NEGATIVES,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:11:  reviewGovernanceAudit,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:130:  it('reviews governance audit history with summary counts and parsed metadata', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:168:    const review = reviewGovernanceAudit(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:174:    expect(review.summary.totalMatching).toBe(2);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:175:    expect(review.summary.returnedRows).toBe(2);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:176:    expect(review.summary.byAction).toEqual({ memory_save: 2 });
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:177:    expect(review.summary.byDecision).toEqual({ allow: 1, deny: 1 });
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:178:    expect(review.summary.latestCreatedAt).toEqual(expect.any(String));
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:179:    expect(review.rows).toHaveLength(2);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:180:    expect(review.rows[0]).toMatchObject({
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:188:    expect(review.rows[1]).toMatchObject({
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:216:    const blocked = reviewGovernanceAudit(db, {});
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:224:    const allowed = reviewGovernanceAudit(db, { allowUnscoped: true, limit: 10 });
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:15:  { tool: 'memory_validate', handler: 'handleMemoryValidate', layer: 'L4' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:41:  { camel: 'handleMemoryValidate', snake: 'handle_memory_validate' },
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:107:    it('T414: R=1 for just-reviewed memory', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:130:    it('T416: Falls back to updated_at when last_review missing', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts:20:    last_review: string;
.opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts:76:        last_review: daysAgo(elapsed[tier]),
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:55:    'idx_last_review',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:87:  'new_content_preview',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:88:  'existing_content_preview',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:256:      new_content_preview TEXT,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:257:      existing_content_preview TEXT,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:331:      new_content_preview,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:332:      existing_content_preview,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:347:      ${getFirstAvailableColumnExpression(legacyColumns, ['new_content_preview'], 'NULL')},
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:348:      ${getFirstAvailableColumnExpression(legacyColumns, ['existing_content_preview'], 'NULL')},
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:472:        { name: 'last_review', sql: 'ALTER TABLE memory_index ADD COLUMN last_review TEXT' },
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:473:        { name: 'review_count', sql: 'ALTER TABLE memory_index ADD COLUMN review_count INTEGER DEFAULT 0' }
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:500:        'idx_last_review',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:501:        'CREATE INDEX IF NOT EXISTS idx_last_review ON memory_index(last_review)',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:507:        'CREATE INDEX IF NOT EXISTS idx_fsrs_retrieval ON memory_index(stability, difficulty, last_review)',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1873:  if (!column_names.includes('last_review')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1875:      database.exec(`ALTER TABLE memory_index ADD COLUMN last_review TEXT`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1876:      console.warn('[vector-index] Migration: Added last_review column (FSRS)');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1881:      logDuplicateColumnMigrationSkip('last_review', error);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1885:  if (!column_names.includes('review_count')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1887:      database.exec(`ALTER TABLE memory_index ADD COLUMN review_count INTEGER DEFAULT 0`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1888:      console.warn('[vector-index] Migration: Added review_count column (FSRS)');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1893:      logDuplicateColumnMigrationSkip('review_count', error);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2342:      last_review TEXT,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2343:      review_count INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2475:    CREATE INDEX IF NOT EXISTS idx_last_review ON memory_index(last_review);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2476:    CREATE INDEX IF NOT EXISTS idx_fsrs_retrieval ON memory_index(stability, difficulty, last_review);
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:8:// 2. Snippet extraction — short previews with detail-available flags
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:37:/** Snippet preview of a single result. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:260: * Extract snippet previews from full results.
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:267: * const previews = extractSnippets(results);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-types.vitest.ts:122:        { path: '/project/.opencode/specs/008-feature/review/iterations/iteration-001.md', expected: 'working' },
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:30:  it('T016: Just reviewed = full retrievability', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:239:    const grade = 3; // "Good" review
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:474:    // Changes should be less than 2 points per review (gradual)
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:99:    /security\s+(?:audit|review|check)/i,
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:155:    'security audit vulnerability and injection review',
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:527:    const dateStr = r.created_at as string | undefined || r.last_accessed as string | undefined || r.last_review as string | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:128:  'review': 'research',
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:86:      last_review TEXT
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:264:    const timestamp = mem.lastAccess || mem.last_accessed || mem.lastReview || mem.last_review || mem.created_at;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:297:  const lastReview = memory.last_review || memory.created_at;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:320:  // Type's configured half-life, while well-reviewed memories keep their
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:89:        'Summarize rollout monitoring dashboards for post-deployment review.',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:145:    it('T510: conflict records preserve metadata and previews', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:162:      expect(record.new_content_preview).toHaveLength(203);
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:100:        last_review TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:101:        review_count INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/tests/five-factor-scoring.vitest.ts:557:  it('EDGE-T06: Falls back to updated_at when no last_review', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:183:| < 0.40 | Poor -- review fallback policy |
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:81:  get_memory_preview,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:106:  getMemoryPreview,
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:57:        last_review TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:58:        review_count INTEGER DEFAULT 0
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:205:    trackAccess: false,
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:6:// Dimensions for governance review and Wave 2 gate decisions.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:589: * Tune adaptive thresholds after reviewing the current shadow signal set.
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:88:    expect(parsed.data.graphOps.previewPolicy.mode).toBe('metadata-only');
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:24:  last_review?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:91:  last_review?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:152:  trackAccess: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:8:// FSRS-preferred strategy. Memories with FSRS review data (last_review
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:9:// IS NOT NULL, review_count > 0) use the FSRS v4 power-law formula:
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:11:// Memories without review data fall back to half-life exponential:
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:13:// This ensures backward compatibility while aligning reviewed
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:70:        'handle_memory_validate',
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:108:5. Testing effect — FSRS strengthening write-back (opt-in via `trackAccess`)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:201:| `security_audit` | Security review              | Vulnerabilities, audit logs         |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:452:| v4      | FSRS columns (`stability`, `difficulty`, `last_review`, `review_count`) + `memory_conflicts` table + FSRS indexes |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:757:Selection tracking writes to a separate `learned_triggers` column (NOT FTS5 index). 10 safeguards: separate column, 30-day TTL, 100+ stop words denylist, rate cap (3 terms/selection, 8 terms/memory), top-3 exclusion, 1-week shadow period, <72h memory exclusion, sprint gate review, rollback mechanism, provenance audit log. Query weight: **0.7x** of organic triggers. Gated via `SPECKIT_LEARN_FROM_SELECTION` (default ON; set to `false` to disable).
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:137:    trackAccess: false,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:184:- Audit: Logs to `memory_conflicts` table for review
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:264:| `fsrs-scheduler.ts`        | FSRS v4 + TM-03 classification decay | `calculateRetrievability`, `updateStability`, `processReview`, `applyClassificationDecay` |
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:292:  processReview,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:294:  GRADE_GOOD,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:303:// Update stability after review
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:307:  GRADE_GOOD,   // grade (3 = successful recall)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:311:// Process a full review cycle
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:313:// params = { stability: 1.0, difficulty: 5.0, lastReview: null, reviewCount: 0 }
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:315:const result = processReview(params, GRADE_GOOD);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:316:// result = { stability, difficulty, lastReview, reviewCount, nextReviewDate, retrievability }
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:318:// Optimal review interval
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:323:- `GRADE_AGAIN (1)`: Failed recall → Stability × 0.2
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:324:- `GRADE_HARD (2)`: Difficult recall → gradeFactor 0.8
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:325:- `GRADE_GOOD (3)`: Successful recall → gradeFactor 1.0
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:326:- `GRADE_EASY (4)`: Easy recall → gradeFactor 1.3
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:433:  'preview of new',   // newContentPreview
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:434:  'preview of old',   // existingContentPreview
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:478:// Uses memory.stability and memory.last_review to calculate
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:503:// Activate with FSRS review update
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:504:activateMemoryWithFsrs(memoryId, 3);  // memoryId, grade (default: 3 = GOOD)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:773:// Memory was accessed, apply FSRS review update
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:774:decay.activateMemoryWithFsrs(42, 3);  // memoryId=42, grade=GOOD(3)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:933:**Cause**: `last_review` not being updated on access
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:940:// Use activateMemoryWithFsrs (updates stability, last_review, access_count)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:956:| State always COLD    | Use `activateMemoryWithFsrs()` (updates last_review)         |
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:87:- FSRS testing effect fires only when `trackAccess` is explicitly true.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:120:  const lastReview = (memory.last_review || memory.created_at) as string | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:160: * Activate memory with FSRS review update.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:166:    const memory = (db.prepare('SELECT stability, difficulty, last_review, review_count FROM memory_index WHERE id = ?') as Database.Statement).get(memoryId) as Record<string, unknown> | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:172:      lastReview: (memory.last_review as string) || null,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:173:      reviewCount: (memory.review_count as number) || 0,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:177:    if (typeof fsrsScheduler.processReview === 'function') {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:178:      result = fsrsScheduler.processReview(params, grade);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:185:        reviewCount: params.reviewCount + 1,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:186:        nextReviewDate: new Date().toISOString(),
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:195:          last_review = ?,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:196:          review_count = ?,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:204:      result.reviewCount,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:77: * Filters used to review governance audit history.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:87: * Parsed governance audit row returned for review workflows.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:101: * Aggregate view of governance audit activity for a filtered review.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:112: * Combined governance audit review rows and summary.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:503:export function reviewGovernanceAudit(
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:77:    tools: ['memory_update', 'memory_delete', 'memory_validate', 'memory_bulk_delete']
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:72: * Per-cohort summary used to review shared rollout coverage.
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:293: * @returns Cohort-by-cohort rollout counts ordered for review.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:70:  new_content_preview: string;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:71:  existing_content_preview: string;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:113: * Truncate content to a preview length.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:336:  newContentPreview: string,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:337:  existingContentPreview: string,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:348:    new_content_preview: newContentPreview,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:349:    existing_content_preview: existingContentPreview,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:365:        new_content_preview, existing_content_preview, spec_folder
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:375:      record.new_content_preview,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:376:      record.existing_content_preview,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:14://     - FSRS write-back to memory_index (when trackAccess=true) — DB write
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:28:// 3.  Testing effect          — FSRS strengthening write-back (trackAccess)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:533: * handler. Uses GRADE_GOOD with a difficulty bonus inversely proportional
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:554:      'SELECT stability, difficulty, review_count FROM memory_index WHERE id = ?'
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:559:    const grade = fsrsScheduler.GRADE_GOOD;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:572:          last_review = CURRENT_TIMESTAMP,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:573:          review_count = review_count + 1,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:843: * Called only when `trackAccess` is true (P3-09 FIX: explicit opt-in to avoid
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:847: * stability and last_review fields, then `strengthenOnAccess` fires an FSRS
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:848: * GRADE_GOOD update — increasing stability proportional to how much the memory
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:849: * needed the review.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:864:      const lastReview = (row.last_review as string | undefined | null) || (row.created_at as string | undefined);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:936: *   3.  Testing effect     (all types, when trackAccess = true)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1195:  // P3-09 FIX: Only when explicitly opted in via trackAccess.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1198:  if (config.trackAccess) {
.opencode/skill/system-spec-kit/mcp_server/tests/folder-scoring.vitest.ts:121:        { path: 'specs/project/review/iterations/iteration-001', expected: true },
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:371:            last_review TEXT,
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts:4:// When wasUseful=false is recorded via memory_validate, reduce the
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:75:      review_count INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:78:      last_review TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:111:      trackAccess: true,
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:225:  it('records adaptive access signals when trackAccess is true and adaptive ranking enabled', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:230:      INSERT INTO memory_index (id, stability, difficulty, review_count, access_count, last_review, created_at)
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:239:      { id: 1, score: 0.9, similarity: 90, stability: 2.5, last_review: '2026-03-01T00:00:00.000Z', created_at: '2026-02-01T00:00:00.000Z' },
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:240:      { id: 2, score: 0.8, similarity: 80, stability: 3.0, last_review: '2026-03-02T00:00:00.000Z', created_at: '2026-02-02T00:00:00.000Z' },
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:260:      INSERT INTO memory_index (id, stability, difficulty, review_count, access_count, last_review, created_at)
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:267:      { id: 1, score: 0.9, similarity: 90, stability: 2.5, last_review: '2026-03-01T00:00:00.000Z', created_at: '2026-02-01T00:00:00.000Z' },
.opencode/skill/system-spec-kit/mcp_server/lib/manage/README.md:78:When graph scoring behavior needs review, start with the active modules listed below instead of looking for helpers in `lib/manage/`.
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:67:  'review code quality in handlers',
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:78:  'review and audit the complete authentication authorization flow for potential security vulnerabilities and misconfigurations',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:206:         WHEN m.last_review IS NOT NULL AND m.review_count > 0 THEN
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:208:             1.0 + (19.0/81.0) * (julianday('now') - julianday(m.last_review)) / COALESCE(NULLIF(m.stability, 0), 1.0),
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:448: * Extracts a preview snippet from indexed content.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1224: * Builds a preview payload for a stored memory.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1227: * @returns The memory preview, if found.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1229:export function get_memory_preview(memory_id: number, max_lines = 50): { id: number; specFolder: string; filePath: string; title: string; createdAt: string | undefined; lastAccessedAt: number | undefined; accessCount: number; confidence: number; ageString: string; lastAccessString: string; content: string } | null {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1238:    console.warn(`[vector-index] get_memory_preview query error: ${get_error_message(e)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1259:    console.warn('[vector-index] get_memory_preview file read warning', {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1260:      operation: 'get_memory_preview',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1455:export { get_memory_preview as getMemoryPreview };
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:21:// Where t = elapsed days, S = stability (grows with successful reviews).
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:39:/** Grade constants for review scoring */
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:40:const GRADE_AGAIN = 1;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:41:const GRADE_HARD = 2;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:42:const GRADE_GOOD = 3;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:43:const GRADE_EASY = 4;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:62:  reviewCount: number;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:69:  reviewCount: number;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:70:  nextReviewDate: string;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:94: * Update stability based on review grade.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:106:  if (grade === GRADE_AGAIN) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:113:  const gradeFactor = grade === GRADE_EASY ? 1.3 : grade === GRADE_GOOD ? 1.0 : 0.8;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:122: * Calculate optimal review interval from stability.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:138: * Update difficulty based on review grade.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:144:  if (grade === GRADE_AGAIN) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:146:  } else if (grade === GRADE_HARD) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:148:  } else if (grade === GRADE_GOOD) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:151:    // EASY
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:159: * Calculate elapsed days since last review.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:175: * Get next review date based on stability and desired retention.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:193:    reviewCount: 0,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:198: * Process a review and return updated parameters.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:200:function processReview(params: FsrsParams, grade: number): ReviewResult {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:207:  const nextReviewDate = getNextReviewDate(newStability);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:213:    reviewCount: params.reviewCount + 1,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:214:    nextReviewDate,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:226:  GRADE_AGAIN,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:227:  GRADE_HARD,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:228:  GRADE_GOOD,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:229:  GRADE_EASY,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:461:  GRADE_AGAIN,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:462:  GRADE_HARD,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:463:  GRADE_GOOD,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:464:  GRADE_EASY,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:496:  processReview,
.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-db.vitest.ts:211:    it('review node types are well-defined', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-db.vitest.ts:212:      const reviewNodeTypes = ['dimension_node', 'file_node', 'finding_node', 'evidence_node'];
.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-db.vitest.ts:213:      expect(reviewNodeTypes.length).toBe(4);
.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-db.vitest.ts:214:      for (const type of reviewNodeTypes) {
.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-db.vitest.ts:229:    it('review relations are well-defined', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-db.vitest.ts:230:      const reviewRelations = ['COVERS', 'CONTRADICTS', 'EVIDENCES', 'REMEDIATES', 'DEPENDS_ON'];
.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-db.vitest.ts:231:      expect(reviewRelations.length).toBe(5);
.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-db.vitest.ts:232:      for (const rel of reviewRelations) {
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:200:  last_review: '2025-01-15T10:00:00Z',
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-directives.vitest.ts:81:    const content = 'Code should be reviewed before merging when changes touch the core.';
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-directives.vitest.ts:152:      'Should review changes when touching core.',
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:303:  const lastReview = (row.lastReview as string | undefined) || (row.last_review as string | undefined) || row.updated_at || row.created_at;
.opencode/skill/system-spec-kit/mcp_server/tests/safety.vitest.ts:123:          last_review TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/safety.vitest.ts:124:          review_count INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:69:  'last_review',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:70:  'review_count',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:145:      last_review TEXT,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:146:      review_count INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:187:    CREATE INDEX IF NOT EXISTS idx_last_review ON memory_index(last_review);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:188:    CREATE INDEX IF NOT EXISTS idx_fsrs_retrieval ON memory_index(stability, difficulty, last_review);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts:86:function trackAccess(memoryId: number): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts:328:  trackAccess,
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:170:      'memory_validate',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:295:      'memory_validate', 'memory_save', 'memory_index_scan', 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2093:      'memory_validate': '[L4:Mutation]',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:61:        last_review TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:62:        review_count INTEGER DEFAULT 0
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:397: * Flags them for review without deletion.
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:5:// readiness, repair, export/import, path identity, and previews.
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:10:export interface MetadataOnlyPreview {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:44:  previewPolicy: {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:110:    previewPolicy: {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:114:      recommendedAction: 'Expose metadata-only previews for non-text artifacts and avoid raw binary content in runtime context surfaces.',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:119:export function createMetadataOnlyPreview(input: {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:124:}): MetadataOnlyPreview {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:25:  review_count?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:56:  'type_inference_source', 'stability', 'difficulty', 'review_count',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:75: * - `last_review` is always refreshed to `datetime('now')`
.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:101:  setClauses.push("last_review = datetime('now')");
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:186:        mod.trackAccess(i);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:189:      // The next trackAccess should trigger the overflow guard
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:191:      const result = mod.trackAccess(overflowId);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:206:        mod.trackAccess(i);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:208:      mod.trackAccess(MAX + 2);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:231:        mod.trackAccess(2);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:249:        mod.trackAccess(2);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:271:        mod.trackAccess(2);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:301:          mod.trackAccess(memoryId);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:318:          mod.trackAccess(memoryId);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:383:      expect(typeof mod.trackAccess).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-tools.vitest.ts:153:    it('includes optional review-specific signal', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-tools.vitest.ts:250:    it('review graphEvidence sub-check validates finding connectivity', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-tools.vitest.ts:274:    it('review relation weights fall within valid range', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/regression-suite.vitest.ts:4:// Specific finding from the 25-agent comprehensive review.
.opencode/skill/system-spec-kit/mcp_server/tests/regression-suite.vitest.ts:275:// - Each test maps 1:1 to a specific finding from the 25-agent review
.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:42:const GOOD_CONTENT = `# Sprint 0 Measurement Foundation
.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:66:const GOOD_METADATA = {
.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:281:    const score = computeMemoryQualityScore(GOOD_CONTENT, GOOD_METADATA);
.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:305:    const score = computeMemoryQualityScore(GOOD_CONTENT, GOOD_METADATA);
.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:449:    const result = runQualityLoop(GOOD_CONTENT, GOOD_METADATA);
.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:572:      runQualityLoop(GOOD_CONTENT, GOOD_METADATA, { emitEvalMetrics: false });
.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:634:      expect(() => runQualityLoop(GOOD_CONTENT, GOOD_METADATA)).not.toThrow();
.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:635:      expect(runQualityLoop(GOOD_CONTENT, GOOD_METADATA).passed).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1267:    if (column === 'review_count') return 0;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1280:  if (column === 'review_count') {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1341:    'last_review',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1342:    'review_count',
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:26:        last_review: '2020-01-01T00:00:00Z',
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:36:        last_review: new Date().toISOString(),
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:47:        last_review: '2023-01-01T00:00:00Z',
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:56:        { id: 11, importance_tier: 'normal', stability: 1.0, last_review: new Date().toISOString() },
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:57:        { id: 12, importance_tier: 'normal', stability: 0.05, last_review: '2023-01-01T00:00:00Z', created_at: '2023-01-01T00:00:00Z' },
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:58:        { id: 13, importance_tier: 'temporary', stability: 0.01, last_review: '2022-06-01T00:00:00Z', created_at: '2022-06-01T00:00:00Z' },
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:79:        { id: 32, importance_tier: 'normal', stability: 1.0, last_review: new Date().toISOString() },
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:80:        { id: 33, importance_tier: 'normal', stability: 0.05, last_review: '2023-01-01T00:00:00Z', created_at: '2023-01-01T00:00:00Z' },
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:81:        { id: 34, importance_tier: 'temporary', stability: 0.01, last_review: '2022-01-01T00:00:00Z', created_at: '2022-01-01T00:00:00Z' },
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:92:        { id: 32, importance_tier: 'normal', stability: 1.0, last_review: new Date().toISOString() },
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:93:        { id: 33, importance_tier: 'normal', stability: 0.05, last_review: '2023-01-01T00:00:00Z', created_at: '2023-01-01T00:00:00Z' },
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:94:        { id: 34, importance_tier: 'temporary', stability: 0.01, last_review: '2022-01-01T00:00:00Z', created_at: '2022-01-01T00:00:00Z' },
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:105:        { id: 32, importance_tier: 'normal', stability: 1.0, last_review: new Date().toISOString() },
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:106:        { id: 33, importance_tier: 'normal', stability: 0.05, last_review: '2023-01-01T00:00:00Z', created_at: '2023-01-01T00:00:00Z' },
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:107:        { id: 34, importance_tier: 'temporary', stability: 0.01, last_review: '2022-01-01T00:00:00Z', created_at: '2022-01-01T00:00:00Z' },
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:191:        { memoryId: 41, attentionScore: 0.50, tier: 'WARM', importance_tier: 'normal', stability: 1.0, last_review: new Date().toISOString(), id: 41 },
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:192:        { memoryId: 42, attentionScore: 0.10, tier: 'COLD', importance_tier: 'normal', stability: 0.05, last_review: '2023-01-01', created_at: '2023-01-01', id: 42 },
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:20:type MemoryPreview = NonNullable<ReturnType<VectorIndexModule['getMemoryPreview']>>;
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:104:        'findCleanupCandidates', 'deleteMemories', 'getMemoryPreview',
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1446:  describe('getMemoryPreview', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1447:    const previewFileContent = [
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1448:      '# Preview Test File',
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1460:    it('returns full preview with file content', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1462:      fs.writeFileSync(path.join(TMP_DIR, 'memory-a.md'), previewFileContent, 'utf-8');
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1464:      const preview = mod.getMemoryPreview(deferredId1!);
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1465:      expect(preview).toBeTruthy();
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1466:      const resolvedPreview = preview as MemoryPreview;
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1467:      expect(resolvedPreview.id).toBe(deferredId1);
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1468:      expect(resolvedPreview.specFolder).toBe('specs/test-001');
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1469:      expect(resolvedPreview.title).toBe('Updated Title Alpha');
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1470:      expect(typeof resolvedPreview.content).toBe('string');
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1471:      expect(resolvedPreview.content).toContain('Preview Test File');
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1472:      expect(resolvedPreview.content).toContain('line 3');
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1473:      expect(typeof resolvedPreview.ageString).toBe('string');
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1474:      expect(typeof resolvedPreview.accessCount).toBe('number');
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1475:      expect(typeof resolvedPreview.confidence).toBe('number');
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1479:      fs.writeFileSync(path.join(TMP_DIR, 'memory-a.md'), previewFileContent, 'utf-8');
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1481:      const preview = mod.getMemoryPreview(deferredId1!, 3);
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1482:      expect(preview).toBeTruthy();
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1483:      const resolvedPreview = preview as MemoryPreview;
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1484:      const contentLines = resolvedPreview.content.split('\n');
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1487:      expect(resolvedPreview.content).toContain('more lines');
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1491:      const preview = mod.getMemoryPreview(999999);
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1492:      expect(preview).toBeNull();
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1495:    it('returns preview with empty content for missing file', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1497:        specFolder: 'specs/test-preview',
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1501:      const preview = mod.getMemoryPreview(noFileId);
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1502:      expect(preview).toBeTruthy();
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1503:      expect(preview!.title).toBe('No File Memory');
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1504:      expect(preview!.content).toBe('');
.opencode/skill/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:84:    trackAccess: false,
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:87:    tool: 'memory_validate',
.opencode/skill/system-spec-kit/mcp_server/tests/review-fixes.vitest.ts:7:// Validates critical fixes from the 8-agent cross-AI review:
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:60:        last_review TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:61:        review_count INTEGER DEFAULT 0
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts:65:    it('T507-01: trackAccess returns true on accumulate', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts:66:      const result1 = mod.trackAccess(1);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts:70:    it('T507-01b: Accumulator state updated after trackAccess', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts:85:        mod.trackAccess(2);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts:89:      mod.trackAccess(2);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts:169:      mod.trackAccess(1);
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-limit.vitest.ts:40:        last_review TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-limit.vitest.ts:41:        review_count INTEGER DEFAULT 0
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:364:        'New content preview',        // newContentPreview
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:365:        'Existing content preview',   // existingContentPreview
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:382:        'New content preview',
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:383:        'Existing content preview',
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:387:        'reason', 'contradiction_detected', 'contradiction_type', 'new_content_preview',
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:388:        'existing_content_preview', 'spec_folder'];
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:403:        'New content preview',
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:404:        'Existing content preview',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:908:    review_count: existingRow.review_count,
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:47:        last_review: null,
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:48:        review_count: null,
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:137:        last_review: null,
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:168:        last_review: null, is_pinned: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator-swap.vitest.ts:149:      review_count INTEGER,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:58:      last_review TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:59:      review_count INTEGER DEFAULT 0
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:151:      last_review TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:152:      review_count INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:442:          last_review TEXT, review_count INTEGER DEFAULT 0
.opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:163:        trackAccess: false,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:330:      new_content_preview, existing_content_preview, contradiction_detected, contradiction_type, spec_folder, created_at
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:332:  `).run(1, later, 'UPDATE', 'hash-beta', 2, 1, 0.82, 'seed conflict', 'beta preview', 'alpha preview', 0, null, 'specs/022-hybrid-rag-fusion', later);
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:381:  `).run(1, 'space-1', 'specs/022-hybrid-rag-fusion::/tmp/specs/022/alpha.md::_', 1, 2, 'manual_review', 'tester', '{"phase":"seed"}', later);
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:126:        memory_validate: 'L4',
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-comparison.vitest.ts:64:  'review code quality in handlers',
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-comparison.vitest.ts:82:  'review and audit the complete authentication authorization flow for potential security vulnerabilities and misconfigurations',
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-ops-hardening.vitest.ts:4:  createMetadataOnlyPreview,
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-ops-hardening.vitest.ts:25:    expect(contract.previewPolicy.mode).toBe('metadata-only');
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-ops-hardening.vitest.ts:28:  it('builds metadata-only previews for artifact-safe surfacing', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-ops-hardening.vitest.ts:29:    const preview = createMetadataOnlyPreview({
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-ops-hardening.vitest.ts:36:    expect(preview.mode).toBe('metadata-only');
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-ops-hardening.vitest.ts:37:    expect(preview.fileName).toBe('report.pdf');
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-ops-hardening.vitest.ts:38:    expect(preview.kind).toBe('binary');
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-ops-hardening.vitest.ts:39:    expect(preview.rawContentIncluded).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts:48:          last_review TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts:53:        CREATE INDEX idx_last_review ON memory_index(last_review);
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts:54:        CREATE INDEX idx_fsrs_retrieval ON memory_index(stability, difficulty, last_review);
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts:96:          new_content_preview TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts:97:          existing_content_preview TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:27:        memory_validate: 1000,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:49: * Return `false` to leave the `_pending` file in place for manual review.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:402:    // Log and leave for manual review instead of renaming.
.opencode/skill/system-spec-kit/mcp_server/tests/schema-migration.vitest.ts:23:    it('T704: last_review column exists on memory_index', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/schema-migration.vitest.ts:27:    it('T705: review_count column exists on memory_index', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/schema-migration.vitest.ts:39:    it('T708: last_review has TEXT type', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/schema-migration.vitest.ts:43:    it('T709: review_count has INTEGER type', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/schema-migration.vitest.ts:48:      const fsrsColumns = ['stability', 'difficulty', 'last_review', 'review_count'];
.opencode/skill/system-spec-kit/mcp_server/tests/schema-migration.vitest.ts:62:    it('T713: New memory gets review_count = 0', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/schema-migration.vitest.ts:66:    it('T714: last_review can be NULL initially', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/schema-migration.vitest.ts:82:    it('T718: Can set last_review to ISO timestamp', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/schema-migration.vitest.ts:86:    it('T719: Can update review_count incrementally', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/schema-migration.vitest.ts:227:    it('idx_last_review index exists', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:461:    const content = '# Gate Analysis\n\n## Review Process\n\n## Check Strategy\n\n## Validation Notes\n\nAnalysis of gate review process.';
.opencode/skill/system-spec-kit/mcp_server/tests/temporal-contiguity.vitest.ts:48:        last_review TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/temporal-contiguity.vitest.ts:49:        review_count INTEGER DEFAULT 0
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:45:      last_review TEXT
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:121:  it('B-02: review date is in the future', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:127:  it('B-03: higher stability pushes review further out', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:158:    expect(params).toHaveProperty('reviewCount');
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:176:  it('C-05: reviewCount is 0', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:178:    expect(params.reviewCount).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:191:   D. FSRS SCHEDULER — processReview
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:194:describe('D. processReview', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:202:    const result = fsrs.processReview(initial, 3);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:206:    expect(result).toHaveProperty('reviewCount');
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:207:    expect(result).toHaveProperty('nextReviewDate');
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:211:  it('D-02: reviewCount increments by 1', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:212:    const result = fsrs.processReview(initial, 3);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:213:    expect(result.reviewCount).toBe(initial.reviewCount + 1);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:218:    const result = fsrs.processReview(initial, 3);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:219:    const reviewTime = new Date(result.lastReview).getTime();
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:220:    expect(reviewTime).toBeGreaterThanOrEqual(before - 1000);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:221:    expect(reviewTime).toBeLessThanOrEqual(Date.now() + 1000);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:224:  it('D-04: grade AGAIN decreases stability', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:225:    const params = { ...initial, stability: 5.0, lastReview: new Date().toISOString(), reviewCount: 1 };
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:226:    const result = fsrs.processReview(params, fsrs.GRADE_AGAIN);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:230:  it('D-05: grade EASY increases stability', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:231:    const params = { ...initial, lastReview: new Date().toISOString(), reviewCount: 1 };
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:232:    const result = fsrs.processReview(params, fsrs.GRADE_EASY);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:236:  it('D-06: grade GOOD increases stability', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:237:    const params = { ...initial, lastReview: new Date().toISOString(), reviewCount: 1 };
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:238:    const result = fsrs.processReview(params, fsrs.GRADE_GOOD);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:242:  it('D-07: grade HARD gives <= stability than GOOD', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:243:    const params = { ...initial, lastReview: new Date().toISOString(), reviewCount: 1 };
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:244:    const resultHard = fsrs.processReview(params, fsrs.GRADE_HARD);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:245:    const resultGood = fsrs.processReview(params, fsrs.GRADE_GOOD);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:249:  it('D-08: nextReviewDate is valid future date', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:250:    const result = fsrs.processReview(initial, 3);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:251:    const nextDate = new Date(result.nextReviewDate);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:257:    const result = fsrs.processReview(initial, 3);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:262:  it('D-10: chaining reviews updates state', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:264:    const result1 = fsrs.processReview(params, 3);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:265:    const result2 = fsrs.processReview(result1, 4);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:266:    expect(result2.reviewCount).toBe(2);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:57:    it('T601: GRADE_GOOD constant is 3', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:58:      expect(fsrsScheduler.GRADE_GOOD).toBe(3);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:75:    it('T603: GRADE_GOOD increases stability', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:77:      const reviewed = fsrsScheduler.processReview(initial, fsrsScheduler.GRADE_GOOD);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:78:      expect(reviewed.stability).toBeGreaterThan(initial.stability);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:82:      const lowRetrievability = fsrsScheduler.updateStability(2.0, 5.0, fsrsScheduler.GRADE_GOOD, 0.2);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:83:      const highRetrievability = fsrsScheduler.updateStability(2.0, 5.0, fsrsScheduler.GRADE_GOOD, 0.9);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:140:      const reviewed = fsrsScheduler.processReview({
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:144:        reviewCount: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:145:      }, fsrsScheduler.GRADE_AGAIN);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:146:      expect(reviewed.stability).toBeGreaterThanOrEqual(fsrsScheduler.MIN_STABILITY);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:261:    it('T641: review_count column exists in schema', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:262:      expect(VECTOR_INDEX_SCHEMA_SOURCE).toContain('review_count INTEGER DEFAULT 0');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:265:    it('T642: last_review column exists', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:266:      expect(VECTOR_INDEX_SCHEMA_SOURCE).toContain('last_review TEXT');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:277:    it('T645: Default review_count is 0', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:278:      expect(VECTOR_INDEX_SCHEMA_SOURCE).toMatch(/review_count INTEGER DEFAULT 0/);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:281:    it('T646: review_count increments correctly', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:282:      expect(STAGE2_SOURCE).toContain('review_count = review_count + 1');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:286:      expect(STAGE2_SOURCE).not.toContain('review_count = 1');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:289:    it('T648: last_review timestamp updates', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:290:      expect(STAGE2_SOURCE).toContain('last_review = CURRENT_TIMESTAMP');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:294:      const nextReviewDate = fsrsScheduler.getNextReviewDate(5);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:295:      expect(Number.isNaN(new Date(nextReviewDate).getTime())).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:305:    it('updates stability, review_count, access_count, and last_accessed together', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:307:      expect(STAGE2_SOURCE).toContain('review_count = review_count + 1');
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:239:    trackAccess: false,

codex
The main contrast is already sharpening: Modus exposes explicit review and connected-neighbor controls, while Public mostly keeps FSRS mechanics behind retrieval internals and `memory_validate`. I’m pulling the remaining source points now so the final ranking reflects both implementation feasibility and what we should explicitly reject.
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	package vault
     2	
     3	import (
     4		"fmt"
     5		"math"
     6		"strings"
     7		"time"
     8	
     9		"github.com/GetModus/modus-memory/internal/markdown"
    10	)
    11	
    12	// FSRS (Free Spaced Repetition Scheduler) parameters for memory decay.
    13	// Dual-strength model: each fact has stability (how long until 90% recall drops)
    14	// and difficulty (how hard it is to retain). Inspired by LACP's Mycelium Network
    15	// and the FSRS-5 algorithm. Local adaptation: importance gates initial stability,
    16	// memory type gates difficulty, and access-based reinforcement resets the clock.
    17	
    18	// fsrsConfig holds per-importance FSRS parameters.
    19	type fsrsConfig struct {
    20		InitialStability float64 // days until R drops to 0.9 (S0)
    21		InitialDifficulty float64 // 0.0 (trivial) to 1.0 (very hard)
    22		Floor            float64 // minimum confidence (retrievability)
    23	}
    24	
    25	var fsrsConfigs = map[string]fsrsConfig{
    26		"critical": {InitialStability: 1e9, InitialDifficulty: 0, Floor: 1.0}, // never decays
    27		"high":     {InitialStability: 180, InitialDifficulty: 0.3, Floor: 0.3},
    28		"medium":   {InitialStability: 60, InitialDifficulty: 0.5, Floor: 0.1},
    29		"low":      {InitialStability: 14, InitialDifficulty: 0.7, Floor: 0.05},
    30	}
    31	
    32	// Memory type difficulty modifiers. Procedural knowledge is hardest to forget,
    33	// episodic is easiest (it's contextual and fades without reinforcement).
    34	var memoryTypeDifficultyMod = map[string]float64{
    35		"semantic":   -0.1, // easier to retain (general knowledge)
    36		"episodic":   +0.2, // harder to retain (context-dependent)
    37		"procedural": -0.3, // hardest to forget (muscle memory analog)
    38	}
    39	
    40	// fsrsRetrievability computes R(t) = (1 + t/(9*S))^(-1)
    41	// where t = elapsed days, S = stability. This is the FSRS power-law forgetting curve.
    42	// R=0.9 when t=S (by definition of stability).
    43	func fsrsRetrievability(elapsedDays, stability float64) float64 {
    44		if stability <= 0 {
    45			return 0
    46		}
    47		return math.Pow(1.0+elapsedDays/(9.0*stability), -1.0)
    48	}
    49	
    50	// fsrsNewStability computes updated stability after a successful recall.
    51	// S' = S * (1 + e^(w) * (11-D) * S^(-0.2) * (e^(0.05*(1-R)) - 1))
    52	// Simplified from FSRS-5. w=2.0 is the stability growth factor.
    53	func fsrsNewStability(oldStability, difficulty, retrievability float64) float64 {
    54		w := 2.0 // growth factor — higher means faster stability growth on recall
    55		d := difficulty * 10 // scale to 0-10 range
    56		growth := math.Exp(w) * (11.0 - d) * math.Pow(oldStability, -0.2) * (math.Exp(0.05*(1.0-retrievability)) - 1.0)
    57		newS := oldStability * (1.0 + growth)
    58		if newS < oldStability {
    59			newS = oldStability // stability never decreases on recall
    60		}
    61		return newS
    62	}
    63	
    64	// DecayFacts sweeps all fact files and applies FSRS-based confidence decay.
    65	// Confidence = retrievability R(t) = (1 + t/(9*S))^(-1), floored per importance.
    66	// Returns the number of facts updated.
    67	func (v *Vault) DecayFacts() (int, error) {
    68		docs, err := markdown.ScanDir(v.Path("memory", "facts"))
    69		if err != nil {
    70			return 0, err
    71		}
    72	
    73		now := time.Now()
    74		updated := 0
    75	
    76		for _, doc := range docs {
    77			conf := doc.GetFloat("confidence")
    78			importance := doc.Get("importance")
    79			if importance == "" {
    80				importance = "medium"
    81			}
    82	
    83			cfg, ok := fsrsConfigs[importance]
    84			if !ok {
    85				cfg = fsrsConfigs["medium"]
    86			}
    87	
    88			// Critical facts never decay
    89			if cfg.InitialStability >= 1e8 {
    90				continue
    91			}
    92	
    93			if conf <= cfg.Floor {
    94				continue
    95			}
    96	
    97			// Get or initialize stability
    98			stability := doc.GetFloat("stability")
    99			if stability <= 0 {
   100				stability = cfg.InitialStability
   101				// Apply memory type modifier to difficulty → affects initial stability
   102				memType := doc.Get("memory_type")
   103				if mod, ok := memoryTypeDifficultyMod[memType]; ok {
   104					adjustedDifficulty := cfg.InitialDifficulty + mod
   105					if adjustedDifficulty < 0 {
   106						adjustedDifficulty = 0
   107					}
   108					if adjustedDifficulty > 1.0 {
   109						adjustedDifficulty = 1.0
   110					}
   111					// Lower difficulty → higher stability
   112					stability = cfg.InitialStability * (1.0 + (0.5 - adjustedDifficulty))
   113				}
   114				doc.Set("stability", math.Round(stability*10) / 10)
   115				doc.Set("difficulty", cfg.InitialDifficulty)
   116			}
   117	
   118			// Calculate days since last access or creation
   119			lastAccessed := doc.Get("last_accessed")
   120			if lastAccessed == "" {
   121				lastAccessed = doc.Get("last_decayed")
   122			}
   123			if lastAccessed == "" {
   124				lastAccessed = doc.Get("created")
   125			}
   126			if lastAccessed == "" {
   127				continue
   128			}
   129	
   130			t, err := parseTime(lastAccessed)
   131			if err != nil {
   132				continue
   133			}
   134	
   135			elapsedDays := now.Sub(t).Hours() / 24
   136			if elapsedDays < 0.5 {
   137				continue // too recent to decay
   138			}
   139	
   140			// FSRS retrievability: R(t) = (1 + t/(9*S))^(-1)
   141			newConf := fsrsRetrievability(elapsedDays, stability)
   142			newConf = math.Max(cfg.Floor, newConf)
   143			newConf = math.Round(newConf*1000) / 1000
   144	
   145			if newConf == conf {
   146				continue
   147			}
   148	
   149			doc.Set("confidence", newConf)
   150			doc.Set("last_decayed", now.Format(time.RFC3339))
   151			if err := doc.Save(); err != nil {
   152				continue
   153			}
   154			updated++
   155		}
   156	
   157		return updated, nil
   158	}
   159	
   160	// ReinforceFact increases a fact's confidence and stability after a successful recall.
   161	// This is the FSRS "review" operation — accessing a fact proves it's still relevant,
   162	// so stability grows and confidence resets toward 1.0.
   163	func (v *Vault) ReinforceFact(relPath string) error {
   164		doc, err := v.Read(relPath)
   165		if err != nil {
   166			return err
   167		}
   168	
   169		now := time.Now()
   170		conf := doc.GetFloat("confidence")
   171		stability := doc.GetFloat("stability")
   172		difficulty := doc.GetFloat("difficulty")
   173	
   174		importance := doc.Get("importance")
   175		if importance == "" {
   176			importance = "medium"
   177		}
   178		cfg := fsrsConfigs[importance]
   179	
   180		// Initialize if missing
   181		if stability <= 0 {
   182			stability = cfg.InitialStability
   183		}
   184		if difficulty <= 0 {
   185			difficulty = cfg.InitialDifficulty
   186		}
   187	
   188		// Compute new stability: grows on each successful recall
   189		newStability := fsrsNewStability(stability, difficulty, conf)
   190	
   191		// Difficulty decreases slightly on successful recall (fact gets easier)
   192		newDifficulty := difficulty - 0.02
   193		if newDifficulty < 0.05 {
   194			newDifficulty = 0.05
   195		}
   196	
   197		// Confidence boost: asymptotic toward 1.0, small increment per access
   198		newConf := conf + (1.0-conf)*0.08
   199		if newConf > 0.99 {
   200			newConf = 0.99
   201		}
   202	
   203		// Track access count
   204		accessCount := 0
   205		if ac := doc.GetFloat("access_count"); ac > 0 {
   206			accessCount = int(ac)
   207		}
   208		accessCount++
   209	
   210		doc.Set("confidence", math.Round(newConf*1000)/1000)
   211		doc.Set("stability", math.Round(newStability*10)/10)
   212		doc.Set("difficulty", math.Round(newDifficulty*1000)/1000)
   213		doc.Set("last_accessed", now.Format(time.RFC3339))
   214		doc.Set("access_count", accessCount)
   215	
   216		return doc.Save()
   217	}
   218	
   219	// ArchiveStaleFacts marks facts below a confidence threshold as archived.
   220	// Returns the number of facts archived.
   221	func (v *Vault) ArchiveStaleFacts(threshold float64) (int, error) {
   222		if threshold <= 0 {
   223			threshold = 0.1
   224		}
   225	
   226		docs, err := markdown.ScanDir(v.Path("memory", "facts"))
   227		if err != nil {
   228			return 0, err
   229		}
   230	
   231		archived := 0
   232		for _, doc := range docs {
   233			// Skip already archived
   234			if doc.Get("archived") == "true" {
   235				continue
   236			}
   237			// Skip critical facts
   238			if doc.Get("importance") == "critical" {
   239				continue
   240			}
   241	
   242			conf := doc.GetFloat("confidence")
   243			if conf > 0 && conf < threshold {
   244				doc.Set("archived", true)
   245				doc.Set("archived_at", time.Now().Format(time.RFC3339))
   246				if err := doc.Save(); err != nil {
   247					continue
   248				}
   249				archived++
   250			}
   251		}
   252	
   253		return archived, nil
   254	}
   255	
   256	// TouchFact updates last_accessed on a fact, resetting its decay clock.
   257	func (v *Vault) TouchFact(relPath string) error {
   258		doc, err := v.Read(relPath)
   259		if err != nil {
   260			return err
   261		}
   262		doc.Set("last_accessed", time.Now().Format(time.RFC3339))
   263		return doc.Save()
   264	}
   265	
   266	// ListFacts returns memory facts, optionally filtered by subject.
   267	func (v *Vault) ListFacts(subject string, limit int) ([]*markdown.Document, error) {
   268		if limit <= 0 {
   269			limit = 20
   270		}
   271	
   272		docs, err := markdown.ScanDir(v.Path("memory", "facts"))
   273		if err != nil {
   274			return nil, err
   275		}
   276	
   277		var result []*markdown.Document
   278		for _, doc := range docs {
   279			if len(result) >= limit {
   280				break

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
   241		case strings.HasPrefix(path, "experience/"):
   242			return "experience"
   243		default:
   244			return "document"
   245		}
   246	}
   247	
   248	// FormatConnected returns a human-readable string of connected documents.
   249	func FormatConnected(refs []DocRef) string {
   250		if len(refs) == 0 {
   251			return ""
   252		}
   253	
   254		var sb strings.Builder
   255		sb.WriteString(fmt.Sprintf("## Connected (%d)\n\n", len(refs)))
   256	
   257		// Group by kind
   258		byKind := make(map[string][]DocRef)
   259		for _, r := range refs {
   260			byKind[r.Kind] = append(byKind[r.Kind], r)

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/writer.go | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	package markdown
     2	
     3	import (
     4		"fmt"
     5		"os"
     6		"path/filepath"
     7		"strings"
     8	)
     9	
    10	// Write creates a markdown file with YAML frontmatter.
    11	func Write(path string, frontmatter map[string]interface{}, body string) error {
    12		dir := filepath.Dir(path)
    13		if err := os.MkdirAll(dir, 0755); err != nil {
    14			return fmt.Errorf("mkdir %s: %w", dir, err)
    15		}
    16	
    17		var sb strings.Builder
    18		sb.WriteString("---\n")
    19	
    20		for key, val := range frontmatter {
    21			if val == nil {
    22				continue
    23			}
    24			switch v := val.(type) {
    25			case []string:
    26				sb.WriteString(fmt.Sprintf("%s: [%s]\n", key, strings.Join(v, ", ")))
    27			case []interface{}:
    28				parts := make([]string, len(v))
    29				for i, item := range v {
    30					parts[i] = fmt.Sprintf("%v", item)
    31				}
    32				sb.WriteString(fmt.Sprintf("%s: [%s]\n", key, strings.Join(parts, ", ")))
    33			case bool:
    34				sb.WriteString(fmt.Sprintf("%s: %v\n", key, v))
    35			case float64, int:
    36				sb.WriteString(fmt.Sprintf("%s: %v\n", key, v))
    37			default:
    38				s := fmt.Sprintf("%v", v)
    39				if needsQuoting(s) {
    40					sb.WriteString(fmt.Sprintf("%s: %q\n", key, s))
    41				} else {
    42					sb.WriteString(fmt.Sprintf("%s: %s\n", key, s))
    43				}
    44			}
    45		}
    46	
    47		sb.WriteString("---\n\n")
    48		sb.WriteString(strings.TrimSpace(body))
    49		sb.WriteByte('\n')
    50	
    51		return os.WriteFile(path, []byte(sb.String()), 0644)
    52	}
    53	
    54	func needsQuoting(s string) bool {
    55		for _, c := range s {
    56			switch c {
    57			case ':', '#', '[', ']', '{', '}', '|', '>', '*', '&', '!', '%', '@', '`':
    58				return true
    59			}
    60		}
    61		return false
    62	}

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	package markdown
     2	
     3	import (
     4		"bufio"
     5		"fmt"
     6		"os"
     7		"path/filepath"
     8		"strings"
     9	
    10		"gopkg.in/yaml.v3"
    11	)
    12	
    13	// Document represents a parsed markdown file with YAML frontmatter.
    14	type Document struct {
    15		Path        string                 // filesystem path
    16		Frontmatter map[string]interface{} // parsed YAML
    17		Body        string                 // markdown content after frontmatter
    18	}
    19	
    20	// Get returns a frontmatter value as a string, or empty string.
    21	func (d *Document) Get(key string) string {
    22		v, ok := d.Frontmatter[key]
    23		if !ok {
    24			return ""
    25		}
    26		return fmt.Sprintf("%v", v)
    27	}
    28	
    29	// GetFloat returns a frontmatter value as float64, or 0.
    30	func (d *Document) GetFloat(key string) float64 {
    31		v, ok := d.Frontmatter[key]
    32		if !ok {
    33			return 0
    34		}
    35		switch val := v.(type) {
    36		case float64:
    37			return val
    38		case int:
    39			return float64(val)
    40		default:
    41			return 0
    42		}
    43	}
    44	
    45	// GetTags returns the tags field as a string slice.
    46	func (d *Document) GetTags() []string {
    47		v, ok := d.Frontmatter["tags"]
    48		if !ok {
    49			return nil
    50		}
    51		switch val := v.(type) {
    52		case []interface{}:
    53			tags := make([]string, 0, len(val))
    54			for _, t := range val {
    55				tags = append(tags, fmt.Sprintf("%v", t))
    56			}
    57			return tags
    58		case string:
    59			return strings.Split(val, ",")
    60		default:
    61			return nil
    62		}
    63	}
    64	
    65	// Set updates a frontmatter value.
    66	func (d *Document) Set(key string, value interface{}) {
    67		if d.Frontmatter == nil {
    68			d.Frontmatter = make(map[string]interface{})
    69		}
    70		d.Frontmatter[key] = value
    71	}
    72	
    73	// Save writes the document back to disk with updated frontmatter.
    74	func (d *Document) Save() error {
    75		return Write(d.Path, d.Frontmatter, d.Body)
    76	}
    77	
    78	// WikiLinks extracts all [[link]] references from the body.
    79	func (d *Document) WikiLinks() []string {
    80		var links []string
    81		start := 0
    82		for {
    83			i := strings.Index(d.Body[start:], "[[")
    84			if i < 0 {
    85				break
    86			}
    87			j := strings.Index(d.Body[start+i:], "]]")
    88			if j < 0 {
    89				break
    90			}
    91			link := d.Body[start+i+2 : start+i+j]
    92			links = append(links, link)
    93			start = start + i + j + 2
    94		}
    95		return links
    96	}
    97	
    98	// Parse reads a markdown file and returns a Document.
    99	func Parse(path string) (*Document, error) {
   100		f, err := os.Open(path)
   101		if err != nil {
   102			return nil, err
   103		}
   104		defer f.Close()
   105	
   106		scanner := bufio.NewScanner(f)
   107		scanner.Buffer(make([]byte, 0, 64*1024), 1024*1024) // 1MB max line
   108	
   109		doc := &Document{
   110			Path:        path,
   111			Frontmatter: make(map[string]interface{}),
   112		}
   113	
   114		// Check for frontmatter
   115		if !scanner.Scan() {
   116			return doc, nil
   117		}
   118		firstLine := scanner.Text()
   119		if firstLine != "---" {
   120			// No frontmatter — entire file is body
   121			var body strings.Builder
   122			body.WriteString(firstLine)
   123			body.WriteByte('\n')
   124			for scanner.Scan() {
   125				body.WriteString(scanner.Text())
   126				body.WriteByte('\n')
   127			}
   128			doc.Body = body.String()
   129			return doc, nil
   130		}
   131	
   132		// Read frontmatter until closing ---
   133		var fmLines strings.Builder
   134		for scanner.Scan() {
   135			line := scanner.Text()
   136			if line == "---" {
   137				break
   138			}
   139			fmLines.WriteString(line)
   140			fmLines.WriteByte('\n')
   141		}
   142	
   143		// Parse YAML
   144		if err := yaml.Unmarshal([]byte(fmLines.String()), &doc.Frontmatter); err != nil {
   145			// If YAML fails, treat entire content as body
   146			doc.Body = fmLines.String()
   147			return doc, nil
   148		}
   149	
   150		// Read body
   151		var body strings.Builder
   152		for scanner.Scan() {
   153			body.WriteString(scanner.Text())
   154			body.WriteByte('\n')
   155		}
   156		doc.Body = body.String()
   157	
   158		return doc, nil
   159	}
   160	
   161	// ScanDir recursively scans a directory for .md files and parses each.
   162	func ScanDir(dir string) ([]*Document, error) {
   163		var docs []*Document
   164	
   165		err := filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
   166			if err != nil {
   167				return nil // skip errors
   168			}
   169			// Skip discard directories — cold storage, not indexed
   170			if info.IsDir() && info.Name() == "discard" {
   171				return filepath.SkipDir
   172			}
   173			if info.IsDir() || !strings.HasSuffix(path, ".md") {
   174				return nil
   175			}
   176	
   177			doc, err := Parse(path)
   178			if err != nil {
   179				return nil // skip unparseable files
   180			}
   181			docs = append(docs, doc)
   182			return nil
   183		})
   184	
   185		return docs, err
   186	}

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// Package index implements pure Go full-text search over vault .md files.
     2	//
     3	// No SQLite. No external dependencies. Documents are loaded into memory,
     4	// tokenized, and indexed with BM25 field-boosted scoring. A tiered query
     5	// cache (exact hash + Jaccard fuzzy) handles the hot path.
     6	//
     7	// On 7,600 .md files (~15MB text), startup takes 1-3 seconds on Apple Silicon.
     8	// Search returns in microseconds for cached queries, milliseconds for cold.
     9	package index
    10	
    11	import (
    12		"fmt"
    13		"log"
    14		"os"
    15		"path/filepath"
    16		"strings"
    17		"time"
    18	
    19		"github.com/GetModus/modus-memory/internal/markdown"
    20	)
    21	
    22	// Index wraps an in-memory BM25 search engine built from vault .md files.
    23	type Index struct {
    24		docs     []document
    25		engine   *bm25Engine
    26		cache    *queryCache
    27		facts    *factStore
    28		cross    *crossIndex // subject/tag/entity cross-references
    29		meta     map[string]*document // path → document for field lookups
    30		docCount int
    31		vaultDir string
    32	}
    33	
    34	// document is the internal representation of a vault file.
    35	type document struct {
    36		Path        string
    37		Source      string
    38		Subject     string
    39		Title       string
    40		Tags        string
    41		Body        string
    42		Predicate   string
    43		Confidence  float64
    44		Importance  string
    45		Kind        string
    46		Created     string
    47		Triage      string
    48		Frontmatter map[string]interface{}
    49	}
    50	
    51	// SearchResult represents a single search hit.
    52	type SearchResult struct {
    53		Path       string
    54		Source     string
    55		Subject    string
    56		Title      string
    57		Snippet    string
    58		Rank       float64
    59		Confidence float64
    60		Importance string
    61		Created    string
    62		Triage     string
    63	}
    64	
    65	// Build scans a vault directory and creates an in-memory search index.
    66	func Build(vaultDir string, _ string) (*Index, error) {
    67		start := time.Now()
    68	
    69		// Scan all markdown files
    70		mdDocs, err := markdown.ScanDir(vaultDir)
    71		if err != nil {
    72			return nil, fmt.Errorf("scan vault: %w", err)
    73		}
    74	
    75		docs := make([]document, 0, len(mdDocs))
    76		meta := make(map[string]*document, len(mdDocs))
    77	
    78		for _, md := range mdDocs {
    79			rel, _ := filepath.Rel(vaultDir, md.Path)
    80			title := md.Get("title")
    81			if title == "" {
    82				title = md.Get("name")
    83			}
    84			kind := md.Get("kind")
    85			if kind == "" {
    86				kind = md.Get("type")
    87			}
    88	
    89			doc := document{
    90				Path:        rel,
    91				Source:      md.Get("source"),
    92				Subject:     md.Get("subject"),
    93				Title:       title,
    94				Tags:        strings.Join(md.GetTags(), " "),
    95				Body:        md.Body,
    96				Predicate:   md.Get("predicate"),
    97				Confidence:  md.GetFloat("confidence"),
    98				Importance:  md.Get("importance"),
    99				Kind:        kind,
   100				Created:     md.Get("created"),
   101				Triage:      md.Get("triage"),
   102				Frontmatter: md.Frontmatter,
   103			}
   104	
   105			docs = append(docs, doc)
   106			meta[rel] = &docs[len(docs)-1]
   107		}
   108	
   109		// Build BM25 inverted index
   110		engine := newBM25Engine(docs)
   111		cache := newQueryCache()
   112	
   113		// Build cross-reference index — connects docs sharing subjects, tags, entities
   114		cross := newCrossIndex()
   115		cross.build(docs)
   116	
   117		idx := &Index{
   118			docs:     docs,
   119			engine:   engine,
   120			cache:    cache,
   121			facts:    newFactStore(),
   122			cross:    cross,
   123			meta:     meta,
   124			docCount: len(docs),
   125			vaultDir: vaultDir,
   126		}
   127	
   128		// Auto-index memory facts
   129		idx.indexFacts(vaultDir)
   130	
   131		crossSubjects, crossTags, crossEntities := cross.Stats()
   132		elapsed := time.Since(start)
   133		log.Printf("Indexed %d documents in %v (BM25 + cross-ref: %d subjects, %d tags, %d entities)",
   134			len(docs), elapsed, crossSubjects, crossTags, crossEntities)
   135	
   136		return idx, nil
   137	}
   138	
   139	// Open is an alias for Build — there's no persistent index file to open.
   140	// The second argument (indexPath) is ignored; kept for interface compatibility.
   141	func Open(indexPath string) (*Index, error) {
   142		// Infer vaultDir from indexPath: indexPath was typically ~/modus/data/index.sqlite
   143		// The vault is at ~/modus/vault/
   144		home, _ := os.UserHomeDir()
   145		vaultDir := filepath.Join(home, "modus", "vault")
   146		if envDir := os.Getenv("MODUS_VAULT_DIR"); envDir != "" {
   147			vaultDir = envDir
   148		}
   149		return Build(vaultDir, "")
   150	}
   151	
   152	// Close is a no-op — no file handles to release.
   153	func (idx *Index) Close() {}
   154	
   155	// DocCount returns the number of indexed documents.
   156	func (idx *Index) DocCount() int {
   157		return idx.docCount
   158	}
   159	
   160	// Search performs BM25 full-text search with tiered caching and field boosting.
   161	func (idx *Index) Search(query string, limit int) ([]SearchResult, error) {
   162		if limit <= 0 {
   163			limit = 10
   164		}
   165		if strings.TrimSpace(query) == "" {
   166			return nil, nil
   167		}
   168	
   169		// Tier 0-1: check cache (exact hash + Jaccard fuzzy)
   170		if cached, ok := idx.cache.get(query); ok {
   171			if len(cached) > limit {
   172				return cached[:limit], nil
   173			}
   174			return cached, nil
   175		}
   176	
   177		// Tier 2: BM25 search
   178		scored := idx.engine.search(query, limit*2) // oversample for dedup
   179	
   180		// OOD detection — reject garbage results
   181		if filterOOD(query, scored, 0.15) {
   182			empty := []SearchResult{}
   183			idx.cache.put(query, empty)
   184			return empty, nil
   185		}
   186	
   187		queryTerms := tokenize(query)
   188		var results []SearchResult
   189		seen := make(map[string]bool)
   190	
   191		for _, s := range scored {
   192			doc := idx.docs[s.docID]
   193			if seen[doc.Path] {
   194				continue
   195			}
   196			seen[doc.Path] = true
   197	
   198			snip := snippet(doc.Body, queryTerms, 200)
   199			results = append(results, SearchResult{
   200				Path:       doc.Path,
   201				Source:     doc.Source,
   202				Subject:    doc.Subject,
   203				Title:      doc.Title,
   204				Snippet:    snip,
   205				Rank:       normalizeScore(s.score),
   206				Confidence: doc.Confidence,
   207				Importance: doc.Importance,
   208				Created:    doc.Created,
   209				Triage:     doc.Triage,
   210			})
   211	
   212			if len(results) >= limit {
   213				break
   214			}
   215		}
   216	
   217		// Cache the results
   218		idx.cache.put(query, results)
   219	
   220		return results, nil
   221	}
   222	
   223	// SearchByField returns documents where a metadata field matches a value.
   224	func (idx *Index) SearchByField(field string, value string, limit int) ([]SearchResult, error) {
   225		if limit <= 0 {
   226			limit = 20
   227		}
   228	
   229		var results []SearchResult
   230		valueLower := strings.ToLower(value)
   231	
   232		for _, doc := range idx.docs {
   233			var fieldVal string
   234			switch field {
   235			case "source":
   236				fieldVal = doc.Source
   237			case "subject":
   238				fieldVal = doc.Subject
   239			case "kind", "type":
   240				fieldVal = doc.Kind
   241			case "triage":
   242				fieldVal = doc.Triage
   243			case "importance":
   244				fieldVal = doc.Importance
   245			default:
   246				if v, ok := doc.Frontmatter[field]; ok {
   247					fieldVal = fmt.Sprintf("%v", v)
   248				}
   249			}
   250	
   251			if strings.ToLower(fieldVal) == valueLower {
   252				results = append(results, SearchResult{
   253					Path:       doc.Path,
   254					Source:     doc.Source,
   255					Subject:    doc.Subject,
   256					Title:      doc.Predicate,
   257					Confidence: doc.Confidence,
   258					Importance: doc.Importance,
   259					Created:    doc.Created,
   260					Triage:     doc.Triage,
   261				})
   262			}
   263	
   264			if len(results) >= limit {
   265				break
   266			}
   267		}
   268	
   269		return results, nil
   270	}
   271	
   272	// Facts returns the in-memory fact store for agentic search.
   273	func (idx *Index) Facts() *factStore {
   274		return idx.facts
   275	}
   276	
   277	// Connected returns documents cross-referenced to a query via subject, tag, and entity links.
   278	func (idx *Index) Connected(query string, limit int) []DocRef {
   279		return idx.cross.Connected(query, limit)
   280	}

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
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts | sed -n '1180,1225p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts | sed -n '520,620p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   520	      graphEvidence: {
   521	        edges,
   522	        communities,
   523	        boostFactors,
   524	      },
   525	    };
   526	  });
   527	}
   528	
   529	/**
   530	 * Write an FSRS strengthening update for a single memory access.
   531	 *
   532	 * Mirrors the `strengthenOnAccess` logic from the legacy memory-search
   533	 * handler. Uses GRADE_GOOD with a difficulty bonus inversely proportional
   534	 * to current retrievability, so low-retrievability memories receive the
   535	 * largest stability boost.
   536	 *
   537	 * @param db             - Active SQLite connection
   538	 * @param memoryId       - ID of the memory being strengthened
   539	 * @param retrievability - Current retrievability R(t) in [0, 1]
   540	 */
   541	function strengthenOnAccess(
   542	  db: Database.Database,
   543	  memoryId: number,
   544	  retrievability: number
   545	): StrengthenResult | null {
   546	  if (typeof memoryId !== 'number' || !Number.isFinite(memoryId)) return null;
   547	
   548	  const clampedR = (typeof retrievability === 'number' && retrievability >= 0 && retrievability <= 1)
   549	    ? retrievability
   550	    : 0.9;
   551	
   552	  try {
   553	    const memory = db.prepare(
   554	      'SELECT stability, difficulty, review_count FROM memory_index WHERE id = ?'
   555	    ).get(memoryId) as Record<string, unknown> | undefined;
   556	
   557	    if (!memory) return null;
   558	
   559	    const grade = fsrsScheduler.GRADE_GOOD;
   560	    const difficultyBonus = Math.max(0, (0.9 - clampedR) * 0.5);
   561	
   562	    const newStability = fsrsScheduler.updateStability(
   563	      (memory.stability as number) || fsrsScheduler.DEFAULT_INITIAL_STABILITY,
   564	      (memory.difficulty as number) || fsrsScheduler.DEFAULT_INITIAL_DIFFICULTY,
   565	      grade,
   566	      clampedR
   567	    ) * (1 + difficultyBonus);
   568	
   569	    db.prepare(`
   570	      UPDATE memory_index
   571	      SET stability = ?,
   572	          last_review = CURRENT_TIMESTAMP,
   573	          review_count = review_count + 1,
   574	          access_count = access_count + 1,
   575	          last_accessed = ?
   576	      WHERE id = ?
   577	    `).run(newStability, Date.now(), memoryId);
   578	
   579	    return { stability: newStability, difficulty: (memory.difficulty as number) || fsrsScheduler.DEFAULT_INITIAL_DIFFICULTY };
   580	  } catch (err: unknown) {
   581	    const message = err instanceof Error ? err.message : String(err);
   582	    console.warn(`[stage2-fusion] strengthenOnAccess failed for id ${memoryId}: ${message}`);
   583	    return null;
   584	  }
   585	}
   586	
   587	// -- Exported internal functions (also exposed via __testables) --
   588	
   589	/**
   590	 * Apply intent-based weights to search results.
   591	 *
   592	 * G2 PREVENTION: This function is ONLY called for non-hybrid search types.
   593	 * Hybrid search (RRF / RSF) already incorporates intent-weighted signals
   594	 * during fusion. Calling this on hybrid results would double-count intent.
   595	 *
   596	 * Weight combination:
   597	 *   intentScore = similarity * w.similarity + importance * w.importance + recency * w.recency
   598	 *
   599	 * Similarity is normalised from the raw 0–100 scale to 0–1 before the
   600	 * weighted combination so all three dimensions operate on the same scale.
   601	 * Results are sorted descending by intentAdjustedScore.
   602	 *
   603	 * @param results - Pipeline rows to score
   604	 * @param weights - Intent weight configuration {similarity, importance, recency}
   605	 * @returns New array sorted by intentAdjustedScore descending
   606	 */
   607	function applyIntentWeightsToResults(
   608	  results: PipelineRow[],
   609	  weights: IntentWeightsConfig
   610	): PipelineRow[] {
   611	  if (!Array.isArray(results) || results.length === 0) return results;
   612	  if (!weights) return results;
   613	
   614	  const scored: ScoredRow[] = results.map((row) => {
   615	    // Normalise similarity from 0–100 to 0–1 for proper weight combination
   616	    const similarityRaw = typeof row.similarity === 'number' && Number.isFinite(row.similarity)
   617	      ? row.similarity
   618	      : resolveBaseScore(row) * 100; // fall back to base score rescaled
   619	
   620	    const similarity = Math.max(0, Math.min(1, similarityRaw / 100));

 succeeded in 0ms:
  1180	      console.warn(`[stage2-fusion] usage ranking skipped (db unavailable): ${message}`);
  1181	    }
  1182	  }
  1183	
  1184	  // -- 2e. Graph evidence provenance (Phase C T026) --
  1185	  // Populate graphEvidence on results that received graph-based boosts.
  1186	  // Gated behind SPECKIT_RESULT_PROVENANCE. Fail-open.
  1187	  try {
  1188	    results = populateGraphEvidence(results);
  1189	  } catch (err: unknown) {
  1190	    const message = err instanceof Error ? err.message : String(err);
  1191	    console.warn(`[stage2-fusion] graph evidence provenance failed: ${message}`);
  1192	  }
  1193	
  1194	  // -- 3. Testing effect (FSRS write-back) --
  1195	  // P3-09 FIX: Only when explicitly opted in via trackAccess.
  1196	  // Write-back is fire-and-forget; errors per-row are swallowed inside
  1197	  // ApplyTestingEffect so they never abort the pipeline.
  1198	  if (config.trackAccess) {
  1199	    try {
  1200	      const db = requireDb();
  1201	      applyTestingEffect(db, results);
  1202	      recordAdaptiveAccessSignals(db, results, config.query);
  1203	    } catch (err: unknown) {
  1204	      const message = err instanceof Error ? err.message : String(err);
  1205	      console.warn(`[stage2-fusion] testing effect skipped (db unavailable): ${message}`);
  1206	    }
  1207	  }
  1208	
  1209	  // -- 4. Intent weights --
  1210	  // G2 PREVENTION: Only apply for non-hybrid search types.
  1211	  // Hybrid search (RRF / RSF) incorporates intent weighting during fusion —
  1212	  // Applying it again here would double-count, causing the G2 bug.
  1213	  if (!isHybrid && config.intentWeights) {
  1214	    try {
  1215	      const weighted = applyIntentWeightsToResults(results, config.intentWeights);
  1216	      results = weighted.map((result) =>
  1217	        typeof result.intentAdjustedScore === 'number'
  1218	          ? withSyncedScoreAliases(result, result.intentAdjustedScore)
  1219	          : result
  1220	      );
  1221	      metadata.intentWeightsApplied = 'applied';
  1222	    } catch (err: unknown) {
  1223	      const message = err instanceof Error ? err.message : String(err);
  1224	      console.warn(`[stage2-fusion] intent weights failed: ${message}`);
  1225	      metadata.intentWeightsApplied = 'failed';

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts | sed -n '648,790p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts | sed -n '150,330p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   648	/** Handle memory_validate tool - records user validation feedback to adjust confidence */
   649	async function handleMemoryValidate(args: MemoryValidateArgs): Promise<MCPResponse> {
   650	  const startTime = Date.now();
   651	  await checkDatabaseUpdated();
   652	  const {
   653	    id,
   654	    wasUseful,
   655	    queryId,
   656	    queryTerms,
   657	    resultRank,
   658	    totalResultsShown,
   659	    searchMode,
   660	    intent,
   661	    sessionId,
   662	    notes,
   663	  } = args;
   664	
   665	  if (id === undefined || id === null) {
   666	    throw new Error('id is required');
   667	  }
   668	
   669	  if (typeof wasUseful !== 'boolean') {
   670	    throw new Error('wasUseful is required and must be a boolean');
   671	  }
   672	
   673	  const memoryId = parseMemoryId(id);
   674	
   675	  vectorIndex.initializeDb();
   676	  const database = requireDb();
   677	  const normalizedQueryId = typeof queryId === 'string' && queryId.trim().length > 0
   678	    ? queryId.trim()
   679	    : null;
   680	  const queryText = resolveValidationQueryText(database, normalizedQueryId ?? undefined);
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

 succeeded in 0ms:
   150	        enum: ['HOT', 'WARM', 'COLD', 'DORMANT', 'ARCHIVED'],
   151	        default: 'WARM',
   152	        description: 'Minimum memory state to include in results. Memories below this state are filtered out. Order: HOT > WARM > COLD > DORMANT > ARCHIVED.'
   153	      },
   154	      intent: {
   155	        type: 'string',
   156	        enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'],
   157	        description: 'Task intent for weight adjustments (REQ-006). Explicitly set query intent to optimize scoring for specific tasks.'
   158	      },
   159	      autoDetectIntent: {
   160	        type: 'boolean',
   161	        default: true,
   162	        description: 'Auto-detect intent from query if not explicitly specified. When true, classifies query to apply task-specific scoring weights.'
   163	      },
   164	      // Fix #13 : Expose previously hidden handler parameters
   165	      trackAccess: {
   166	        type: 'boolean',
   167	        default: false,
   168	        description: 'When true, writes FSRS strengthening updates to memory_index for each returned result. Off by default to avoid write-on-read side effects.'
   169	      },
   170	      includeArchived: {
   171	        type: 'boolean',
   172	        default: false,
   173	        description: 'Include archived memories in search results. Default: false (archived excluded).'
   174	      },
   175	      mode: {
   176	        type: 'string',
   177	        enum: ['auto', 'deep'],
   178	        default: 'auto',
   179	        description: 'Search mode. "auto" uses standard retrieval. "deep" enables multi-query expansion for broader recall.'
   180	      },
   181	      includeTrace: {
   182	        type: 'boolean',
   183	        default: false,
   184	        description: 'When true (or when SPECKIT_RESPONSE_TRACE=true), include provenance-rich scores/source/trace envelope fields in each result.'
   185	      }
   186	    }
   187	  },
   188	};
   189	
   190	// E3: Simplified search — 3 params, sensible defaults, delegates to memory_search
   191	const memoryQuickSearch: ToolDefinition = {
   192	  name: 'memory_quick_search',
   193	  description: '[L2:Core] Simplified search — query + optional limit + optional spec folder. Delegates to memory_search with sensible defaults (intent auto-detect ON, dedup ON, content included, limit 10). Use this when you want fast search without configuring 31 parameters.',
   194	  inputSchema: {
   195	    type: 'object',
   196	    additionalProperties: false,
   197	    properties: {
   198	      query: { type: 'string', minLength: 2, maxLength: 1000, description: 'Natural language search query' },
   199	      limit: { type: 'number', default: 10, minimum: 1, maximum: 100, description: 'Maximum results (default 10)' },
   200	      specFolder: { type: 'string', description: 'Restrict to spec folder' },
   201	      tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval.' },
   202	      userId: { type: 'string', description: 'User boundary for governed retrieval.' },
   203	      agentId: { type: 'string', description: 'Agent boundary for governed retrieval.' },
   204	      sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed retrieval.' },
   205	    },
   206	    required: ['query'],
   207	  },
   208	};
   209	
   210	const memoryMatchTriggers: ToolDefinition = {
   211	  name: 'memory_match_triggers',
   212	  description: '[L2:Core] Fast trigger phrase matching with cognitive memory features. Supports attention-based decay, tiered content injection (HOT=full, WARM=summary), and co-activation of related memories. Pass session_id and turnNumber for cognitive features. Token Budget: 3500.',
   213	  inputSchema: { type: 'object', additionalProperties: false, properties: { prompt: { type: 'string', minLength: 1, description: 'User prompt or text to match against trigger phrases' }, specFolder: { type: 'string', description: 'Limit trigger matches to a specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed trigger matching.' }, userId: { type: 'string', description: 'User boundary for governed trigger matching.' }, agentId: { type: 'string', description: 'Agent boundary for governed trigger matching.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed trigger matching.' }, limit: { type: 'number', default: 3, minimum: 1, maximum: 100, description: 'Maximum number of matching memories to return (default: 3)' }, session_id: { type: 'string', description: 'Session identifier for cognitive features. When provided, enables attention decay and tiered content injection.' }, turnNumber: { type: 'number', minimum: 1, description: 'Current conversation turn number. Used with session_id for decay calculations.' }, include_cognitive: { type: 'boolean', default: true, description: 'Enable cognitive features (decay, tiers, co-activation). Requires session_id.' } }, required: ['prompt'] },
   214	};
   215	
   216	// T306: Added asyncEmbedding parameter for non-blocking embedding generation
   217	const memorySave: ToolDefinition = {
   218	  name: 'memory_save',
   219	  description: '[L2:Core] Index a memory file into the spec kit memory database. Reads the file, extracts metadata (title, trigger phrases), generates embedding, and stores in the index. Use this to manually index new or updated memory files. Includes pre-flight validation (T067-T070) for anchor format, duplicate detection, and token budget estimation. Token Budget: 3500.',
   220	  inputSchema: { type: 'object', additionalProperties: false, properties: { filePath: { type: 'string', minLength: 1, description: 'Absolute path to the memory file (must be in specs/**/memory/, .opencode/specs/**/memory/, specs/**/ for spec documents, or .opencode/skill/*/constitutional/)' }, force: { type: 'boolean', default: false, description: 'Force re-index even if content hash unchanged' }, dryRun: { type: 'boolean', default: false, description: 'Validate only without saving. Returns validation results including anchor format, duplicate check, and token budget estimation (CHK-160)' }, skipPreflight: { type: 'boolean', default: false, description: 'Skip pre-flight validation checks (not recommended)' }, asyncEmbedding: { type: 'boolean', default: false, description: 'When true, embedding generation is deferred for non-blocking saves. Memory is immediately saved with pending status and an async background attempt is triggered. Default false preserves synchronous embedding behavior.' }, tenantId: { type: 'string', description: 'Tenant boundary for governed ingest.' }, userId: { type: 'string', description: 'User boundary for governed ingest.' }, agentId: { type: 'string', description: 'Agent boundary for governed ingest.' }, sessionId: { type: 'string', description: 'Session boundary for governed ingest.' }, sharedSpaceId: { type: 'string', description: 'Optional shared-memory space for collaboration saves.' }, provenanceSource: { type: 'string', description: 'Required provenance source when governance guardrails are enabled.' }, provenanceActor: { type: 'string', description: 'Required provenance actor when governance guardrails are enabled.' }, governedAt: { type: 'string', description: 'ISO timestamp for governed ingest. Defaults to now when omitted.' }, retentionPolicy: { type: 'string', enum: ['keep', 'ephemeral', 'shared'], description: 'Retention class applied to the saved memory.' }, deleteAfter: { type: 'string', description: 'Optional ISO timestamp after which retention sweep may delete the memory.' } }, required: ['filePath'] },
   221	};
   222	
   223	// L3: Discovery - Browse and explore (Token Budget: 800)
   224	const memoryList: ToolDefinition = {
   225	  name: 'memory_list',
   226	  description: '[L3:Discovery] Browse stored memories with pagination. Use to discover what is remembered and find IDs for delete/update. Token Budget: 800.',
   227	  inputSchema: { type: 'object', additionalProperties: false, properties: { limit: { type: 'number', default: 20, minimum: 1, maximum: 100, description: 'Maximum results to return (max 100)' }, offset: { type: 'number', default: 0, minimum: 0, description: 'Number of results to skip (for pagination)' }, specFolder: { type: 'string', description: 'Filter by spec folder' }, sortBy: { type: 'string', enum: ['created_at', 'updated_at', 'importance_weight'], description: 'Sort order (default: created_at DESC)' }, includeChunks: { type: 'boolean', default: false, description: 'Include chunk child rows. Default false returns parent memories only for cleaner browsing.' } } },
   228	};
   229	
   230	const memoryStats: ToolDefinition = {
   231	  name: 'memory_stats',
   232	  description: '[L3:Discovery] Get statistics about the memory system. Shows counts, dates, status breakdown, and top folders. Supports multiple ranking modes including composite scoring. Token Budget: 800.',
   233	  inputSchema: { type: 'object', additionalProperties: false, properties: { folderRanking: { type: 'string', enum: ['count', 'recency', 'importance', 'composite'], description: 'How to rank folders: count (default, by memory count), recency (most recent first), importance (by tier), composite (weighted multi-factor score)', default: 'count' }, excludePatterns: { type: 'array', items: { type: 'string' }, description: 'Regex patterns to exclude folders (e.g., ["z_archive", "scratch"])' }, includeScores: { type: 'boolean', description: 'Include score breakdown for each folder', default: false }, includeArchived: { type: 'boolean', description: 'Include archived/test/scratch folders in results', default: false }, limit: { type: 'number', minimum: 1, maximum: 100, description: 'Maximum number of folders to return', default: 10 } } },
   234	};
   235	
   236	const memoryHealth: ToolDefinition = {
   237	  name: 'memory_health',
   238	  description: '[L3:Discovery] Check health status of the memory system. Token Budget: 800.',
   239	  inputSchema: {
   240	    type: 'object',
   241	    additionalProperties: false,
   242	    properties: {
   243	      reportMode: {
   244	        type: 'string',
   245	        enum: ['full', 'divergent_aliases'],
   246	        default: 'full',
   247	        description: 'Report mode. full returns system diagnostics; divergent_aliases returns compact divergent alias triage output.'
   248	      },
   249	      limit: {
   250	        type: 'number',
   251	        default: 20,
   252	        minimum: 1,
   253	        maximum: 200,
   254	        description: 'Maximum divergent alias groups to return when reportMode=divergent_aliases (max 200).'
   255	      },
   256	      specFolder: {
   257	        type: 'string',
   258	        description: 'Optional spec folder filter for divergent alias triage mode.'
   259	      },
   260	      autoRepair: {
   261	        type: 'boolean',
   262	        default: false,
   263	        description: 'When true in full mode, attempts best-effort repair actions for detected health issues (e.g., FTS rebuild).'
   264	      },
   265	      confirmed: {
   266	        type: 'boolean',
   267	        default: false,
   268	        description: 'Required with autoRepair:true to execute repair actions. When false or omitted, memory_health returns a confirmation-only response.'
   269	      }
   270	    },
   271	    required: []
   272	  },
   273	};
   274	
   275	// L4: Mutation - Modify existing memories (Token Budget: 500)
   276	const memoryDelete: ToolDefinition = {
   277	  name: 'memory_delete',
   278	  description: '[L4:Mutation] Delete a memory by ID or all memories in a spec folder. Use to remove incorrect or outdated information. Requires EITHER id (single delete) OR specFolder + confirm:true (bulk delete). Token Budget: 500.',
   279	  inputSchema: {
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

exec
/bin/zsh -lc 'rg -n "''^### Finding|Recommendation|Priority|Effort|Impact|adopt now|prototype later|reject|NEW FEATURE" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-0{2,3,4,5,6,7,8,9}.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 2 in 0ms:
rg: .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-02.md: No such file or directory (os error 2)
rg: .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-03.md: No such file or directory (os error 2)
rg: .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-04.md: No such file or directory (os error 2)
rg: .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-05.md: No such file or directory (os error 2)
rg: .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-06.md: No such file or directory (os error 2)
rg: .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-07.md: No such file or directory (os error 2)
rg: .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-08.md: No such file or directory (os error 2)
rg: .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-09.md: No such file or directory (os error 2)

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-026.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
### Finding 4: Modus’s automatic recall loop is too blunt to map directly onto compaction injection
- **Source**: [vault.go:287](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L287); [vault.go:311](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L311); [facts.go:64](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go#L64); [facts.go:160](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go#L160); [parser.go:65](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go#L65); [writer.go:10](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/writer.go#L10)
- **What it does**: `memory_search` reinforces every returned fact asynchronously, and reinforcement/decay write updated confidence/stability/difficulty/access metadata back into markdown frontmatter.
- **Why it matters**: For compaction survival, surfaced memory is not the same as successfully used memory. If we copied this literally, compaction and startup auto-surfaces could strengthen items just because they were injected, not because they truly helped.
- **Recommendation**: **reject**
- **Impact**: **high**

### Finding 5: Public already has the stronger compaction-survival architecture; the Modus lesson is to improve preselection, not replace recovery
- **Source**: [memory-context.ts:673](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L673); [memory-context.ts:783](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L783); [session-resume.ts:409](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts#L409); [session-resume.ts:479](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts#L479); [session-bootstrap.ts:163](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L163); [session-snapshot.ts:33](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts#L33); [session-snapshot.ts:205](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts#L205); [memory-surface.ts:626](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts#L626); [compact-merger.ts:122](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts#L122); [compact-inject.ts:210](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts#L210); [opencode-transport.ts:81](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts#L81); [session-manager.ts:1266](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts#L1266); [generate-context.js:81](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js#L81)
- **What it does**: Public has explicit compaction and recovery surfaces: `memory_context(...resume...)` with bounded anchors, `session_resume`, `session_bootstrap`, a token-capped structural bootstrap contract, a compaction hook, a 4000-token compact merger, runtime transport blocks for startup and compaction, `CONTINUE_SESSION.md`, and curated `generate-context.js` memory saves.
- **Why it matters**: Our compaction survival is already explicit, bounded, and auditable in ways Modus is not. The best Modus-derived improvement is a cheap lexical/adjacency candidate lane ahead of our current merge pipeline, not a replacement of the existing recovery contracts.
- **Recommendation**: **adopt now**
- **Impact**: **high**

## Assessment
- New information ratio: **0.33**
- Validation: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main" --strict` returned `RESULT: PASSED`; it also emitted `cannot create temp file for here document: Operation not permitted`, consistent with the read-only environment.
- This was a read-only iteration. I verified the phase state and source evidence, but did not update phase artifacts.

## Recommended Next Focus
Design a narrow compaction-candidate experiment inside Public’s existing survival stack: add a cheap Modus-style lexical/connected-neighbor preselection lane to `compact-inject` or resume synthesis, but keep `session_bootstrap` / `session_resume` / `memory_context(resume)` as the only authoritative recovery surfaces. In parallel, define an explicit recall-event rule so compaction-injected memories are not auto-strengthened unless they are actually reused.
--- Iteration 25 ---
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
- **Impact**: **medium**

### Finding 4: Modus’s automatic recall loop is too blunt to map directly onto compaction injection
- **Source**: [vault.go:287](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L287); [vault.go:311](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L311); [facts.go:64](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go#L64); [facts.go:160](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go#L160); [parser.go:65](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go#L65); [writer.go:10](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/writer.go#L10)
- **What it does**: `memory_search` reinforces every returned fact asynchronously, and reinforcement/decay write updated confidence/stability/difficulty/access metadata back into markdown frontmatter.
--
## Findings
### Finding N: [Title]
- **Source**: file path(s)
- **What it does**: technical description
- **Why it matters**: relevance to our system
- **Recommendation**: adopt now / prototype later / reject / NEW FEATURE
- **Impact**: high / medium / low

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

OUTPUT FORMAT:
# Iteration 026: SEMANTIC VS LEXICAL TRADE-OFFS

## Focus
SEMANTIC VS LEXICAL TRADE-OFFS: Deep analysis of when semantic search beats lexical and vice versa in this system. What hybrid strategies should we adopt?

## Findings
### Finding N: [Title]
- **Source**: file path(s)
- **What it does**: technical description
- **Why it matters**: relevance to our system
- **Recommendation**: adopt now / prototype later / reject / NEW FEATURE
- **Impact**: high / medium / low

## Assessment
- New information ratio: [0.0-1.0]

## Recommended Next Focus
[next direction]
hook: SessionStart
hook: SessionStart Completed
hook: UserPromptSubmit
hook: UserPromptSubmit Completed
codex
I’m treating this as a read-only research iteration focused on semantic vs lexical retrieval trade-offs, using the approved phase folder and external source tree you named. I’ll re-check the relevant Modus ranking/expansion code against our current Spec Kit Memory search pipeline, then synthesize concrete hybrid strategy recommendations without making any file changes.

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-028.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-029.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
## Recommended Next Focus
Run a narrow routing experiment instead of a retrieval rewrite: detect exact/token-heavy queries, send them through a lexical-first fast lane with optional early exit, keep abstraction/paraphrase queries on semantic-first hybrid, and measure both recall@20 and latency by bucket. The key follow-on is not “make lexical stronger everywhere,” but “make lexical win only when the query shape says it should.”
--- Iteration 27 ---
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
- **Source**: [crossref.go:9](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go#L9); [crossref.go:41](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go#L41); [vault.go:75](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L75)
- **What it does**: Modus builds lightweight subject/tag/entity adjacency maps at index time and appends connected documents to search output when they were not already returned by lexical search.
- **Why it matters**: For compaction recovery, this is the most transferable Modus idea: after we recover the active spec/task, a cheap connected-neighbor pass could widen context without immediately paying for heavier graph or semantic expansion.
- **Recommendation**: **prototype later**
- **Impact**: **medium**

### Finding 4: Modus’s automatic recall loop is too blunt to map directly onto compaction injection
- **Source**: [vault.go:287](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L287); [vault.go:311](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L311); [facts.go:64](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go#L64); [facts.go:160](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go#L160); [parser.go:65](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go#L65); [writer.go:10](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/writer.go#L10)
- **What it does**: `memory_search` reinforces every returned fact asynchronously, and reinforcement/decay write updated confidence/stability/difficulty/access metadata back into markdown frontmatter.
--
- **Impact**: **high**

### Finding 4: Capability-aware fallback is good DX only when the route is visible
- **Source**: [librarian/search.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go#L29); [librarian/search.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go#L35); [vault.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L28); [vault.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L47); [sqlite-fts.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts#L210); [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L676); [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L699)
- **What it does**: Modus cleanly falls back to the original query when librarian expansion is unavailable or unparsable. Public already has stronger fail-open behavior across FTS, intent routing, and community fallback, but much of that is visible only in stderr or trace metadata.
- **Why it matters**: Operators trust fallback only when they can tell what path actually ran and why.
- **Recommendation**: **adopt now**. Public should surface a compact route summary in debug profiles or status tools instead of keeping routing visibility mostly in logs.
- **Impact**: **medium**

### Finding 5: Markdown-native storage is excellent for debugging, but write-on-read is the wrong DX pattern to copy
- **Source**: [parser.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go#L98); [parser.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go#L143); [writer.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/writer.go#L10); [vault.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L311); [facts.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go#L160)
- **What it does**: Modus stores state in plain markdown with tolerant parsing and simple rewrites, which is great for grep, git, and manual repair. But `memory_search` also treats every returned fact as a recall event and asynchronously mutates files on search.
- **Why it matters**: The file transparency is a genuine DX advantage. The automatic mutation-on-read is not: it makes debugging, reproducibility, and git diffs noisier, especially when search is supposed to be observational.
- **Recommendation**: **reject** direct write-on-read behavior. Steal the readable-file ergonomics and explicit mutation tools, not the automatic on-search file rewrite pattern.
- **Impact**: **medium**

### Finding 6: Modus’s small curated tool bundle is easier to learn than Public’s broad surface
- **Source**: [memory.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go#L7); [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md#L191); [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L482)
- **What it does**: Modus deliberately narrows its memory-facing MCP surface to 11 tools. Public’s surface is more capable, but also harder for operators and AI clients to learn quickly.
- **Why it matters**: Discoverability is part of DX. A smaller “operator bundle” can make a powerful system feel approachable without removing advanced capabilities.
- **Recommendation**: **prototype later**. Keep Public’s full surface, but add a curated operator profile or alias bundle centered on search, status, review, debug, health, and adjacency.
- **Impact**: **medium**

## Assessment
- New information ratio: **0.38**
- Strict validation on the phase folder returned `RESULT: PASSED` with the same read-only temp-file warning from `validate.sh`.
- This was a read-only iteration; I verified source evidence and current Public behavior, but did not update `research/research.md` or other phase artifacts.

## Recommended Next Focus
Run the next iteration on **operator workflow design**: map Public’s existing internals into a compact DX control plane with 3 concrete candidates only, `memory_status`, `memory_debug_search`, and `memory_review`, then judge whether each should be a new tool, a `profile:"debug"` response, or a wrapper around existing tools.

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

OUTPUT FORMAT:
# Iteration 028: BENCHMARK & METRICS

## Focus
BENCHMARK & METRICS: What does this system measure? What metrics should we track for memory quality, retrieval accuracy, and system health?

## Findings
### Finding N: [Title]
- **Source**: file path(s)
- **What it does**: technical description
- **Why it matters**: relevance to our system
- **Recommendation**: adopt now / prototype later / reject / NEW FEATURE
- **Impact**: high / medium / low

 succeeded in 0ms:
### Finding 4: Capability-aware fallback is good DX only when the route is visible
- **Source**: [librarian/search.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go#L29); [librarian/search.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go#L35); [vault.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L28); [vault.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L47); [sqlite-fts.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts#L210); [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L676); [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L699)
- **What it does**: Modus cleanly falls back to the original query when librarian expansion is unavailable or unparsable. Public already has stronger fail-open behavior across FTS, intent routing, and community fallback, but much of that is visible only in stderr or trace metadata.
- **Why it matters**: Operators trust fallback only when they can tell what path actually ran and why.
- **Recommendation**: **adopt now**. Public should surface a compact route summary in debug profiles or status tools instead of keeping routing visibility mostly in logs.
- **Impact**: **medium**

### Finding 5: Markdown-native storage is excellent for debugging, but write-on-read is the wrong DX pattern to copy
- **Source**: [parser.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go#L98); [parser.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go#L143); [writer.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/writer.go#L10); [vault.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L311); [facts.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go#L160)
- **What it does**: Modus stores state in plain markdown with tolerant parsing and simple rewrites, which is great for grep, git, and manual repair. But `memory_search` also treats every returned fact as a recall event and asynchronously mutates files on search.
- **Why it matters**: The file transparency is a genuine DX advantage. The automatic mutation-on-read is not: it makes debugging, reproducibility, and git diffs noisier, especially when search is supposed to be observational.
- **Recommendation**: **reject** direct write-on-read behavior. Steal the readable-file ergonomics and explicit mutation tools, not the automatic on-search file rewrite pattern.
- **Impact**: **medium**

### Finding 6: Modus’s small curated tool bundle is easier to learn than Public’s broad surface
- **Source**: [memory.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go#L7); [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md#L191); [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L482)
- **What it does**: Modus deliberately narrows its memory-facing MCP surface to 11 tools. Public’s surface is more capable, but also harder for operators and AI clients to learn quickly.
- **Why it matters**: Discoverability is part of DX. A smaller “operator bundle” can make a powerful system feel approachable without removing advanced capabilities.
- **Recommendation**: **prototype later**. Keep Public’s full surface, but add a curated operator profile or alias bundle centered on search, status, review, debug, health, and adjacency.
- **Impact**: **medium**

## Assessment
- New information ratio: **0.38**
- Strict validation on the phase folder returned `RESULT: PASSED` with the same read-only temp-file warning from `validate.sh`.
- This was a read-only iteration; I verified source evidence and current Public behavior, but did not update `research/research.md` or other phase artifacts.

## Recommended Next Focus
Run the next iteration on **operator workflow design**: map Public’s existing internals into a compact DX control plane with 3 concrete candidates only, `memory_status`, `memory_debug_search`, and `memory_review`, then judge whether each should be a new tool, a `profile:"debug"` response, or a wrapper around existing tools.
--- Iteration 28 ---
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
- **Source**: [crossref.go:9](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go#L9); [crossref.go:41](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go#L41); [vault.go:75](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L75)
- **What it does**: Modus builds lightweight subject/tag/entity adjacency maps at index time and appends connected documents to search output when they were not already returned by lexical search.
- **Why it matters**: For compaction recovery, this is the most transferable Modus idea: after we recover the active spec/task, a cheap connected-neighbor pass could widen context without immediately paying for heavier graph or semantic expansion.
- **Recommendation**: **prototype later**
- **Impact**: **medium**

### Finding 4: Modus’s automatic recall loop is too blunt to map directly onto compaction injection
- **Source**: [vault.go:287](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L287); [vault.go:311](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L311); [facts.go:64](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go#L64); [facts.go:160](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go#L160); [parser.go:65](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go#L65); [writer.go:10](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/writer.go#L10)
- **What it does**: `memory_search` reinforces every returned fact asynchronously, and reinforcement/decay write updated confidence/stability/difficulty/access metadata back into markdown frontmatter.
--

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

OUTPUT FORMAT:
# Iteration 029: ARCHITECTURE DECISION RECORD

## Focus
ARCHITECTURE DECISION RECORD: Document the key architectural decisions this system made and why. Which decisions should we adopt and which should we reject?

## Findings
### Finding N: [Title]
- **Source**: file path(s)
- **What it does**: technical description
- **Why it matters**: relevance to our system
- **Recommendation**: adopt now / prototype later / reject / NEW FEATURE
- **Impact**: high / medium / low

## Assessment
- New information ratio: [0.0-1.0]


codex
I’ve verified the late-iteration recommendations against source. I’m doing one last pass over the canonical report and a few routing lines now so the final synthesis can reconcile the earlier BM25/expansion findings with the later control-plane and DX findings instead of over-weighting just the last few iterations.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '660,715p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc 'rg -n "Recommendation|adopt now|prototype later|reject|BM25|cache|librarian|adjacency|memory_review|route summary|debug|operator bundle" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
18:You are a research specialist in spaced repetition memory systems, BM25 search ranking, cross-referenced knowledge graphs, MCP-exposed local memory services, and local-first personal memory architectures. Work like a systems analyst who can trace implementation details from source code, separate README claims from verified mechanics, and translate Modus Memory's specific design choices into concrete improvements for `Code_Environment/Public`.
22:Research Modus Memory's FSRS spaced repetition, BM25 search ranking, and cross-referencing patterns to identify practical, evidence-backed improvements for `Code_Environment/Public`'s memory search and retrieval, especially around memory decay and reinforcement, query expansion, knowledge linking, and plain-markdown memory storage patterns. Determine which ideas should be `adopt now`, `prototype later`, or `reject`.
28:Modus Memory is a local memory server that stores data as plain markdown files, exposes MCP tools, uses BM25 with field boosting, layers a tiered query cache over lexical retrieval, applies FSRS-style spaced repetition with decay and reinforcement, builds cross-references from subjects, tags, and entities, and uses a librarian query expander to widen lexical recall without relying on vectors. The core attraction is a lightweight local binary, markdown-native persistence, and search behavior that mixes ranking, recency, and linked context while staying git-friendly and human-readable.
36:| 003 | Modus Memory | FSRS spaced repetition + BM25 | 001 (FTS5), 004 (local memory) | Focus FSRS decay, cross-referencing, librarian expansion |
41:`Code_Environment/Public` already has Spec Kit Memory with semantic and hybrid retrieval, markdown-backed memory artifacts, importance tiers, and an FSRS-based classification-decay layer in the MCP server. It does **not** currently mirror Modus Memory's end-to-end local vault server model, BM25 field-boosted lexical search with lightweight query caching, librarian-style synonym expansion for keyword retrieval, or simple subject/tag/entity adjacency maps that surface connected documents directly in result sets. Base the comparison on current code, not stale assumptions.
46:2. Start with the lexical search implementation: read `external/modus-memory-main/internal/index/bm25.go`, `external/modus-memory-main/internal/index/cache.go`, and `external/modus-memory-main/internal/librarian/search.go` before anything else. Trace tokenization, stemming, field weights, prefix matching, Jaccard cache reuse, and query expansion order.
49:5. After FSRS, inspect cross-referencing by reading `external/modus-memory-main/internal/index/crossref.go`. Trace how subject, tag, and entity adjacency maps are built, what weighting is used for connected results, and what the system deliberately does **not** do because it avoids a full graph database.
51:7. Read MCP tool handlers next: `external/modus-memory-main/internal/mcp/vault.go` and `external/modus-memory-main/internal/mcp/memory.go`. Trace which tools are free vs. Pro, where librarian expansion is invoked, where cross-reference hints are appended, and where reinforcement happens automatically on search recall.
52:8. Read `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/modus-memory-main/README.md` only after the source files above. Use it to validate claims about cached search speed, markdown-native persistence, binary size, MCP surface area, and the intended value proposition. Do not let README marketing copy override code evidence.
54:10. Separate overlap cleanly across phases: avoid redoing `001` as a generic MCP memory-server study, avoid drifting into `002` markdown-scaffold and drift-detection patterns, and avoid reframing `003` as vector or plugin work owned by `004`. This phase owns BM25, lightweight caching, librarian expansion, FSRS reinforcement loops, and adjacency-map cross-references.
62:    Research the external repository at /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/modus-memory-main and identify concrete improvements for Code_Environment/Public, especially around spaced repetition memory decay, BM25 search ranking, query expansion, cross-referencing, and plain-markdown memory storage patterns.
64:14. Save all outputs inside this phase folder, especially under `research/`. Every meaningful finding must cite exact file paths, explain what Modus does, why it matters here, whether to `adopt now`, `prototype later`, or `reject`, what Public subsystem it affects, and what migration, compatibility, or validation risk comes with it.
72:1. How exactly does Modus implement BM25 scoring across path, source, subject, title, tags, and body, and which field-weight choices are likely to transfer well to `Code_Environment/Public`?
73:2. How much of Modus's search speed story comes from BM25 itself versus the tiered cache, prefix fallback, tokenization rules, and result deduplication?
74:3. How does librarian query expansion work in practice: what expansions are requested, how many variants are kept, how are duplicates merged, and what failure fallbacks exist?
78:7. How are subject, tag, and entity cross-references represented, weighted, and surfaced, and where does the adjacency-map approach outperform or underperform richer causal or graph-based linking?
81:10. Which Modus patterns would best improve query-time recall in `Code_Environment/Public`: BM25 field boosts, query caching, lexical expansion, connected-result hints, or simpler markdown-vault ergonomics?
87:- Do inspect the exact BM25 field weights, tokenization behavior, prefix-match fallback, and query-cache thresholds.
88:- Do study librarian query expansion as a lexical-recall layer, not as a generic "AI enhancement" feature.
89:- Do inspect the cross-referencing data model based on subject, tag, and entity adjacency maps.
100:- Do not recommend replacing `Code_Environment/Public`'s semantic or hybrid retrieval with BM25 alone unless the evidence clearly supports that tradeoff.
102:- Do not blur Modus's lightweight adjacency maps with existing causal-memory or code-graph capabilities; compare them precisely.
109:`internal/vault/facts.go` reinforces memories automatically when `memory_search` returns them, increasing stability, slightly lowering difficulty, updating `last_accessed`, and incrementing `access_count`. A strong finding would explain how that recall loop differs from Spec Kit Memory's current FSRS-aware decay layer, identify where automatic reinforcement could improve real-world memory freshness in `Code_Environment/Public`, and classify the idea as `adopt now`, `prototype later`, or `reject`.
113:`internal/librarian/search.go` expands a natural-language query into 3-5 keyword-oriented variants, preserves the original query, caps the variant set, and falls back cleanly if parsing fails. A strong finding would explain how that lexical expansion could complement rather than replace current semantic retrieval in `Code_Environment/Public`, what guardrails are needed to prevent noisy recall, and whether the pattern should be adopted directly or only prototyped.
128:- BM25 scoring, tokenization, stemming, field boosting, prefix fallback, and cache behavior
129:- librarian query expansion and result merging
153:- clear classification of each recommendation as `adopt now`, `prototype later`, or `reject`
163:- recommendation: `adopt now`, `prototype later`, or `reject`
171:  - **Role** is specialized in spaced repetition, BM25, cross-references, and local-first memory systems
179:- markdown storage, BM25 ranking, FSRS reinforcement, and cross-reference mechanics are all covered directly
189:- each finding is tagged `adopt now`, `prototype later`, or `reject`
208:- **Recommendation**: adopt now / prototype later / reject / NEW FEATURE
232:/bin/zsh -lc 'rg -n "modus-memory|hybrid-rag-fusion|FSRS|BM25|librarian" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
549:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md
555:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go
561:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian
562:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/client.go
563:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go
613:I’ve confirmed the external repo layout: `cmd/modus-memory` is the CLI entry surface, and the implementation is split cleanly across `internal/index`, `internal/librarian`, `internal/markdown`, `internal/mcp`, and `internal/vault`. Next I’m reading the ranking path and the runtime entry points together so the architecture map stays grounded in real control flow.
619:  .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go \\
620:  .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go \\
636:     215 .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go
637:     325 .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go
657:// BM25 full-text search, FSRS spaced-repetition decay, cross-referencing,
658:// librarian query expansion — all in ~6MB, zero dependencies. Completely free.
1016:    10	// BM25 parameters — standard values, tuned for document search.
1050:    44	// bm25Engine holds the inverted index and document stats for BM25 scoring.
1058:    52	// newBM25Engine builds an inverted index from the loaded documents.
1059:    53	func newBM25Engine(docs []document) *bm25Engine {
1134:   128				// BM25 per-field score with field weight
1229:/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
1243:    13	// Inspired by ByteRover's ablation study showing cache tiers drive 29.4pp accuracy gain.
1245:    15		cacheMaxEntries      = 256
1246:    16		cacheJaccardThreshold = 0.6
1249:    19	type cacheEntry struct {
1259:    29		entries []cacheEntry
1265:    35			entries: make([]cacheEntry, 0, cacheMaxEntries),
1269:    39	// get attempts to find cached results for a query.
1305:    75		if bestSim >= cacheJaccardThreshold {
1313:    83	// put stores query results in the cache, evicting the least recently used entry if full.
1320:    90		// Check if query already cached — update results
1329:    99		entry := cacheEntry{
1336:   106		if len(c.entries) >= cacheMaxEntries {
1448:/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
1450:     1	package librarian
1459:    10	// ExpandQuery asks the librarian to produce search-optimized terms for a query.
1485:    36			log.Printf("librarian/search: expansion parse failed: %v", err)
1504:    55	// RankResults asks the librarian to score and rank search results by relevance.
1538:    89			log.Printf("librarian/search: rank parse failed: %v", err)
1566:   117	// for cloud models. Instead of dumping raw results, the librarian produces
1579:   130		system := `You are a librarian summarizing search results for an AI assistant.
1590:   141	// ExtractFacts asks the librarian to extract structured facts from text.
1606:   157			log.Printf("librarian/search: fact parse failed: %v", err)
1630:   181	// ClassifyIntent asks the librarian to classify a query for routing.
1802:     4	// tokenized, and indexed with BM25 field-boosted scoring. A tiered query
1803:     5	// cache (exact hash + Jaccard fuzzy) handles the hot path.
1806:     8	// Search returns in microseconds for cached queries, milliseconds for cold.
1820:    22	// Index wraps an in-memory BM25 search engine built from vault .md files.
1824:    26		cache    *queryCache
1907:   109		// Build BM25 inverted index
1908:   110		engine := newBM25Engine(docs)
1909:   111		cache := newQueryCache()
1918:   120			cache:    cache,
1931:   133		log.Printf("Indexed %d documents in %v (BM25 + cross-ref: %d subjects, %d tags, %d entities)",
1958:   160	// Search performs BM25 full-text search with tiered caching and field boosting.
1967:   169		// Tier 0-1: check cache (exact hash + Jaccard fuzzy)
1968:   170		if cached, ok := idx.cache.get(query); ok {
1969:   171			if len(cached) > limit {
1970:   172				return cached[:limit], nil
1972:   174			return cached, nil
1975:   177		// Tier 2: BM25 search
1978:   180		// OOD detection — reject garbage results
1981:   183			idx.cache.put(query, empty)
2016:   218		idx.cache.put(query, results)
2653:    88	// search finds facts matching a query, ranked by BM25-like scoring with recency boost.
2808:    10	// entities, or tags. Built at index time alongside BM25. No new storage — just
2809:    11	// adjacency maps derived from existing frontmatter.
3383:/bin/zsh -lc "rg -n \"RegisterMemoryTools|AddTool|ExpandQuery|Connected|ReinforceFact|DecayFacts|Search\\(|SearchFacts|StoreFact|ListFacts|TouchFact|ArchiveStaleFacts|pro|free|librarian|RankResults|SummarizeForCloud\" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
3393:  <a href="#the-librarian-pattern"><strong>Librarian</strong></a> ·
3437:- **BM25 full-text search** with field boosting and query caching — 19K docs in <5ms
3581:| `vault_search` | BM25 full-text search with librarian query expansion and cross-reference hints |
3610:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:11:	"github.com/GetModus/modus-memory/internal/librarian"
3611:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:28:		// If the librarian is available, expand the query for better recall
3612:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:30:		if librarian.Available() {
3613:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:31:			expansions := librarian.ExpandQuery(query)
3614:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:32:			log.Printf("vault_search: librarian expanded %q → %d variants", query, len(expansions))
3616:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:47:			// Fallback: direct FTS5 search without librarian
3632:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:280:		// Search with optional librarian expansion
3633:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:282:		if librarian.Available() {
3634:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:283:			queries = librarian.ExpandQuery(query)
3635:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:284:			log.Printf("memory_search: librarian expanded %q → %d variants", query, len(queries))
3638:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:320:		sb.WriteString(fmt.Sprintf("%d results (bm25+librarian, %d queries):\n\n",
3640:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:343:	srv.AddTool("memory_search", "Search episodic memory facts with librarian expansion and FSRS reinforcement.", memorySearchSchema, memorySearchHandler)
3676:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:737:	srv.AddTool("atlas_reject_pr", "Reject an evolution PR. Weakens linked beliefs. Operator only.", map[string]interface{}{
3703:The README mostly matches the code on the big-picture shape: local binary, markdown vault, BM25 search, FSRS decay, cross-reference index, and 11 exposed memory tools. The numbers are still README claims rather than code-proven benchmarks, so I’m separating those from the verified mechanics while I compare them to our own `memory_search` and FSRS paths.
3808:.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:482:/** Handle memory_search tool — performs hybrid vector/BM25 search with intent-aware ranking.
3825:.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:751:  const cacheKey = toolCache.generateCacheKey('memory_search', cacheArgs);
3842:.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1044:      toolCache.set(cacheKey, cachePayload, { toolName: 'memory_search' });
3846:.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1071:  // Apply session deduplication AFTER cache
4470:   482	/** Handle memory_search tool — performs hybrid vector/BM25 search with intent-aware ranking.
4562:   574	      cacheHit: false,
4706:   718	  // Build cache key args
4707:   719	  const cacheArgs = buildCacheArgs({
4739:   751	  const cacheKey = toolCache.generateCacheKey('memory_search', cacheArgs);
4740:   752	  const cacheEnabled = toolCache.isEnabled() && !bypassCache;
4741:   753	  const cachedPayload = cacheEnabled
4742:   754	    ? toolCache.get<SearchCachePayload>(cacheKey)
4748:   760	  if (cachedPayload) {
4749:   761	    responseToReturn = buildSearchResponseFromPayload(cachedPayload, _searchStartTime, true);
4751:   763	    // Wait for embedding model only on cache miss
5035:  1042	    const cachePayload = extractSearchCachePayload(formatted);
5036:  1043	    if (cachePayload && cacheEnabled) {
5037:  1044	      toolCache.set(cacheKey, cachePayload, { toolName: 'memory_search' });
5040:  1047	    responseToReturn = cachePayload
5041:  1048	      ? buildSearchResponseFromPayload(cachePayload, _searchStartTime, false)
5064:  1071	  // Apply session deduplication AFTER cache
5072:  1079	        console.warn('[memory-search] Failed to parse cached response for dedup:', message);
5079:  1086	    // P1-018 — Validate response shape before dedup. If the cached response
5238:    31	// safePath resolves relPath within the vault and rejects traversal attempts.
5380:    11		"github.com/GetModus/modus-memory/internal/librarian"
5397:    28			// If the librarian is available, expand the query for better recall
5399:    30			if librarian.Available() {
5400:    31				expansions := librarian.ExpandQuery(query)
5401:    32				log.Printf("vault_search: librarian expanded %q → %d variants", query, len(expansions))
5416:    47				// Fallback: direct FTS5 search without librarian
5649:   280			// Search with optional librarian expansion
5651:   282			if librarian.Available() {
5652:   283				queries = librarian.ExpandQuery(query)
5653:   284				log.Printf("memory_search: librarian expanded %q → %d variants", query, len(queries))
5689:   320			sb.WriteString(fmt.Sprintf("%d results (bm25+librarian, %d queries):\n\n",
5712:   343		srv.AddTool("memory_search", "Search episodic memory facts with librarian expansion and FSRS reinforcement.", memorySearchSchema, memorySearchHandler)
5752:/bin/zsh -lc "sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
5786:**Token and cost discipline.** Cloud models are expensive once context balloons. The Librarian aggressively prunes, reranks, and synthesizes memories (using BM25 + FSRS + cross-references) before anything touches the cloud. You're running a local "memory compiler" so the expensive model only sees high-signal context.
5884:  ollama run gemma4:26b --system "$(cat librarian-prompt.md)" \
5896:name: librarian
5908:1. `vault_search("auth refactor decision")` — BM25 with query expansion finds "authentication," "OAuth," "session tokens"
5983:436:modus-memory is a full-featured memory system: BM25 ranked search, FSRS spaced repetition, cross-references, librarian query expansion, and a markdown-based vault you can browse and edit. It's designed for long-term personal knowledge, not just key-value storage.
5996:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:284:			log.Printf("memory_search: librarian expanded %q → %d variants", query, len(queries))
5997:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:343:	srv.AddTool("memory_search", "Search episodic memory facts with librarian expansion and FSRS reinforcement.", memorySearchSchema, memorySearchHandler)
6029:**[Full guide: system prompt, model recommendations, example flows, and wiring patterns →](docs/librarian.md)**
6059:- **BM25** with field-level boosting (title 3x, subject 2x, tags 1.5x, body 1x)
6060:- **Tiered query cache** — exact hash match, then Jaccard fuzzy match
6088:- Connected learnings from past debugging
6090:No graph database. Just adjacency maps built at index time from your existing frontmatter.
6112:| Does search require an API key? | No. BM25 runs locally. No LLM calls on the search path. Librarian expansion uses a local synonym map, not a cloud API. |
6177:| **Search** | Embeddings (needs GPU or API key) | BM25 (instant, local, no GPU) |
6237:modus-memory is a full-featured memory system: BM25 ranked search, FSRS spaced repetition, cross-references, librarian query expansion, and a markdown-based vault you can browse and edit. It's designed for long-term personal knowledge, not just key-value storage.
6278:One mismatch worth checking is the Librarian path: the README talks about local synonym-style expansion with no search-path LLM calls, but the source I’ve seen so far routes expansion through the `librarian` package. I’m opening that client next because it affects whether Modus is really a pure lexical engine or a lexical engine plus optional local-model mediation.
6280:/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/client.go | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
6282:     1	// Package librarian provides the gateway between MODUS and the local LLM
6285:     4	package librarian
6298:    17	// Endpoint is the librarian's address. Gemma 4 Q4_K_M via llama-server.
6301:    20	// Available checks whether the librarian is reachable.
6316:    35	// Call sends a system+user prompt to the librarian and returns the text response.
6342:    61			log.Printf("librarian: call failed: %v", err)
6358:    77			log.Printf("librarian: parse failed: %v (body: %s)", err, truncate(string(body), 200))
6392:   111	// ParseJSON attempts to unmarshal a librarian response as JSON.
6397:   116			return fmt.Errorf("parse librarian JSON: %w (raw: %s)", err, truncate(cleaned, 100))
6408:/bin/zsh -lc "rg -n \"Available\\(|Call\\(|ParseJSON\\(|gemma|ollama|local model|search path\" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/*.go .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
6410:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md:16:Run a small, dedicated local model — the **Librarian** — whose only job is memory stewardship. It sits between your vault and whatever model is doing the actual reasoning:
6411:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md:131:  ollama run gemma4:26b --system "$(cat librarian-prompt.md)" \
6412:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md:144:model: gemma4:26b
6414:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:316:| Does search require an API key? | No. BM25 runs locally. No LLM calls on the search path. Librarian expansion uses a local synonym map, not a cloud API. |
6416:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/client.go:21:func Available() bool {
6417:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/client.go:36:func Call(system, user string, maxTokens int) string {
6418:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/client.go:113:func ParseJSON(text string, v interface{}) error {
6419:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go:29:	response := Call(system, user, 150)
6420:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go:35:	if err := ParseJSON(response, &expansions); err != nil {
6421:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go:82:	response := Call(system, user, 100)
6422:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go:88:	if err := ParseJSON(response, &ranked); err != nil {
6423:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go:138:	return Call(system, user, 400)
6424:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go:150:	response := Call(system, user, 500)
6425:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go:156:	if err := ParseJSON(response, &facts); err != nil {
6426:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go:196:	response := Call(system, query, 20)
6427:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go:247:	response := Call(system, user, 500)
6428:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go:253:	if err := ParseJSON(response, &b); err != nil {
6429:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go:293:	system := `Classify this content for a developer building AI infrastructure (local models, MLX, Apple Silicon, Go, memory systems, security, revenue generation).
6430:.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go:304:	response := Call(system, user, 100)
6433:There’s a meaningful README-to-code drift here: the docs say search doesn’t use LLM calls and that librarian expansion is a local synonym map, but the actual `librarian` package does live HTTP calls to a local model endpoint and uses it for query expansion, ranking, summarization, extraction, and classification. I’m folding that into the architecture findings because it changes how we should think about Modus’s retrieval path and operational simplicity.
6485:.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:142:  it('P010-T1: handleMemorySearch returns lexicalPath and fallbackState on cached degraded responses', async () => {
6490:.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:170:  it('P010-T2: handleMemorySearch returns lexicalPath and fallbackState on cached healthy responses', async () => {
6573:.opencode/skill/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:174:    await expect(executePipeline(config)).rejects.toThrow('embedding service unavailable');
7361:     5	// Weighted BM25 scoring for FTS5 full-text search.
7365:     9	import { BM25_FTS5_WEIGHTS, normalizeLexicalQueryTokens } from './bm25-index.js';
7503:   147	 * Execute a weighted BM25 FTS5 search against memory_fts.
7512:   156	 * @returns Array of results with BM25 scores (higher = better)
7742:description: "5-channel hybrid search architecture combining vector, lexical (BM25/FTS5), graph-based and structure-aware graph retrieval with Reciprocal Rank Fusion (RRF) and Adaptive Fusion."
7751:> 5-channel hybrid search architecture combining vector, lexical (BM25/FTS5), graph-based and structure-aware graph retrieval, fused with Reciprocal Rank Fusion (RRF) and Adaptive Fusion.
7781:- **5-Channel Hybrid Search**: Vector (semantic) + BM25/FTS5 (lexical) + Graph (relationship-based) + Graph Structure (structural)
7798:|---> BM25 (Pure JS)            -> Keyword matches
7833:| BM25 | `bm25-index.ts` | Pure TypeScript keyword matching |
7834:| FTS5 | `sqlite-fts.ts` | SQLite FTS5 BM25 weighted scoring |
7886:// Vector rank: 2, BM25 rank: 5, Graph rank: 1
7892:### BM25 (Best Matching 25)
7906:**Why BM25?**
7914:Packet `026-graph-and-context-optimization/010-fts-capability-cascade-floor` freezes the lexical capability contract that packet `002-implement-cache-warning-hooks` now consumes. `memory_search` responses expose:
7933:- **Recommendation**: prototype later
7937:- **Source**: [indexer.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go#L65), [bm25.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/bm25.go#L16), [cache.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go#L10)
7938:- **What it does**: `Build()` scans all `.md` files, materializes `document` structs, builds a BM25 inverted index, a 256-entry exact-plus-Jaccard query cache, a cross-reference index, and an in-memory fact store; `Search()` then runs cache -> BM25 -> OOD filter -> snippet extraction -> normalized ranking -> cache write.
7940:- **Recommendation**: prototype later
7947:- **Recommendation**: prototype later
7950:### Finding 4: Cross-referencing is intentionally shallow adjacency, not a real graph engine
7952:- **What it does**: Modus builds three adjacency maps (`bySubject`, `byTag`, `byEntity`), scores connected docs with fixed weights (subject `3.0`, entity `2.0`, tag `1.0`), and appends connected-doc hints to search responses. The “second pass” only checks title and subject for entity mentions even though the comments imply broader body linkage.
7954:- **Recommendation**: adopt now
7961:- **Recommendation**: prototype later
7965:- **Source**: [client.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/client.go#L17), [search.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go#L10), [docs/librarian.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md#L16)
7967:- **Why it matters for us**: Modus’s architecture is not purely “BM25 only” in practice once the Librarian is up, so any adoption decision has to treat LLM-mediated lexical expansion as an optional subsystem with availability and correctness risks.
7968:- **Recommendation**: reject
7973:- **What it does**: Public already runs a 4-stage hybrid pipeline with vector + BM25/FTS5 + graph channels, session and causal boosts, reranking, fallback-state reporting, and opt-in FSRS write-back. Modus is simpler, but the README also overstates some properties: `go.mod` is not zero-dependency, and the search path can invoke a local model when Librarian is available.
7974:- **Why it matters for us**: The real comparison is selective borrowing, not replacement. The highest-value overlaps are adjacency hints and a cleaner recall-event policy; the rest would mostly duplicate or downgrade existing Public capabilities.
7975:- **Recommendation**: reject
7983:- [cache.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go)
7989:- [client.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/client.go)
7990:- [search.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go)
7993:- [docs/librarian.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md)
8012:Deep-dive the ranking path next: exact BM25 field weights, tokenization and stemming behavior, cache reuse thresholds, librarian expansion ordering and merge rules, then compare those mechanics directly against Public’s lexical lane and query-enhancement stack.
8028:- **Recommendation**: prototype later
8032:- **Source**: [indexer.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go#L65), [bm25.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/bm25.go#L16), [cache.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go#L10)
8033:- **What it does**: `Build()` scans all `.md` files, materializes `document` structs, builds a BM25 inverted index, a 256-entry exact-plus-Jaccard query cache, a cross-reference index, and an in-memory fact store; `Search()` then runs cache -> BM25 -> OOD filter -> snippet extraction -> normalized ranking -> cache write.
8035:- **Recommendation**: prototype later
8042:- **Recommendation**: prototype later
8045:### Finding 4: Cross-referencing is intentionally shallow adjacency, not a real graph engine
8047:- **What it does**: Modus builds three adjacency maps (`bySubject`, `byTag`, `byEntity`), scores connected docs with fixed weights (subject `3.0`, entity `2.0`, tag `1.0`), and appends connected-doc hints to search responses. The “second pass” only checks title and subject for entity mentions even though the comments imply broader body linkage.
8049:- **Recommendation**: adopt now
8056:- **Recommendation**: prototype later
8060:- **Source**: [client.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/client.go#L17), [search.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go#L10), [docs/librarian.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md#L16)
8062:- **Why it matters for us**: Modus’s architecture is not purely “BM25 only” in practice once the Librarian is up, so any adoption decision has to treat LLM-mediated lexical expansion as an optional subsystem with availability and correctness risks.
8063:- **Recommendation**: reject
8068:- **What it does**: Public already runs a 4-stage hybrid pipeline with vector + BM25/FTS5 + graph channels, session and causal boosts, reranking, fallback-state reporting, and opt-in FSRS write-back. Modus is simpler, but the README also overstates some properties: `go.mod` is not zero-dependency, and the search path can invoke a local model when Librarian is available.
8069:- **Why it matters for us**: The real comparison is selective borrowing, not replacement. The highest-value overlaps are adjacency hints and a cleaner recall-event policy; the rest would mostly duplicate or downgrade existing Public capabilities.
8070:- **Recommendation**: reject
8078:- [cache.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go)
8084:- [client.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/client.go)
8085:- [search.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go)
8088:- [docs/librarian.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md)
8107:Deep-dive the ranking path next: exact BM25 field weights, tokenization and stemming behavior, cache reuse thresholds, librarian expansion ordering and merge rules, then compare those mechanics directly against Public’s lexical lane and query-enhancement stack.
8120:- **What it does**: `Index` is just RAM state: `docs`, `bm25Engine`, `queryCache`, `factStore`, `crossIndex`, and a `meta` map keyed by path. `Build()` rescans markdown, projects it into `document` structs, then rebuilds BM25 postings, cross refs, and in-memory fact indexes; `Open()` ignores the supplied `indexPath` and simply rebuilds from `~/modus/vault` or `MODUS_VAULT_DIR`.
8122:- **Recommendation**: reject
8129:- **Recommendation**: prototype later
8136:- **Recommendation**: reject
8143:- **Recommendation**: prototype later
8150:- **Recommendation**: reject
8157:- **Recommendation**: reject
8162:- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go`
8195:Trace **runtime freshness and mutation semantics** next: whether any write path triggers rebuild or cache invalidation, how long write-to-search consistency gaps persist in practice, and how the librarian/ranking layer behaves when the underlying in-memory snapshot is stale.
8203: gpt-5.4                  1.2m in, 17.4k out, 1.1m cached, 9.9k reasoning (Est. 1 Premium request)
8218:- **Recommendation**: reject
8222:- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/learnings.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md`
8223:- **What it does**: `RegisterVaultTools()` defines a much larger tool family (`atlas_*`, `qm_*`, `distill_status`, plus memory/vault tools). `RegisterMemoryTools()` first calls `RegisterVaultTools()` and then destructively deletes every tool not in its 11-tool allowlist. `RegisterLearningsTools()` defines a separate `modus_learnings_*` family, but `main.go` never wires it. Separately, `docs/librarian.md` recommends a 6-tool “librarian” subset in agent config, but that subset is documentation-only, not a negotiated runtime profile.
8225:- **Recommendation**: prototype later
8229:- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/client.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go`
8230:- **What it does**: Modus hard-codes `http://127.0.0.1:8090` as the Librarian endpoint, probes `/health` with `/v1/models` fallback, and posts chat requests to `/v1/chat/completions`. `ExpandQuery()`, `RankResults()`, `ExtractFacts()`, `ClassifyIntent()`, and `ProduceBriefing()` all run through this local OpenAI-compatible sidecar, but none are exposed as MCP tools themselves. MCP callers only see higher-level tools whose behavior changes if `librarian.Available()` returns true.
8232:- **Recommendation**: prototype later
8239:- **Recommendation**: reject
8243:- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/client.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
8244:- **What it does**: `vault_search` silently switches to librarian-expanded multi-query retrieval when the sidecar is reachable, otherwise falls back to direct search. `memory_search` silently spawns async `ReinforceFact()` calls for every returned fact. There are no per-call controls for disabling reinforcement, forcing plain lexical search, asking for provenance, selecting a presentation profile, or scoping session behavior. Public exposes those controls explicitly through `trackAccess`, `includeTrace`, `profile`, `sessionId`, intent routing, and governed scope fields.
8246:- **Recommendation**: reject
8253:- **Recommendation**: NEW FEATURE
8261:- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/client.go`
8262:- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go`
8267:- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go`
8274:- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md`
8288:- **What did not work**: Searching for inbound HTTP APIs mostly surfaced a stale `CallTool` comment about HTTP reuse; there is no implemented HTTP server to analyze. The README and librarian docs describe multiple role shapes, but source code shows those are only partially realized.
8291:Trace **runtime freshness and mutation semantics across tool calls**: whether `memory_store`, `vault_write`, `memory_reinforce`, and decay/archive operations ever invalidate or rebuild the in-memory BM25/fact/cross-ref state, how long the read-your-write gap lasts in practice, and whether any CLI path repairs stale MCP-visible state.
8299: gpt-5.4                  840.3k in, 12.1k out, 703.0k cached, 4.4k reasoning (Est. 1 Premium
8315:- **Recommendation**: reject
8322:- **Recommendation**: reject
8329:- **Recommendation**: reject
8333:- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/server.go`, `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts`
8334:- **What it does**: `SummarizeForCloud()` can compress search hits, and `ProduceBriefing()` can generate a five-bucket briefing from ingested items plus active missions. But there are no call sites for either helper in the shipped runtime, and `server.go` simply exits on EOF without any session-finalization hook. Public, by contrast, has cached continuity summaries in `session-resume.ts`, a one-call recovery tool in `session-bootstrap.ts`, and checkpoint generation in `session-manager.ts`.
8336:- **Recommendation**: prototype later
8343:- **Recommendation**: prototype later
8350:- **Recommendation**: reject
8360:- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go`
8391: gpt-5.4                  1.7m in, 16.9k out, 1.6m cached, 6.7k reasoning (Est. 1 Premium request)
8402:### Finding 1: Modus is **not** a vector or true hybrid retriever; it is a BM25-only engine with optional LLM query rewrites
8404:- **What it does**: Modus builds one in-memory lexical index over six fields with fixed weights `{path 1.5, source 1.0, subject 2.0, title 3.0, tags 1.5, body 1.0}`, tokenizes/stems locally, and falls back to prefix matching for terms of length `>=3`. The only “hybrid” element in shipped search is librarian-driven query expansion before rerunning the same lexical engine. There is no vector lane, no learned fusion, and no cross-channel score combination. Public already has explicit hybrid retrieval: weighted FTS5 BM25, embedding/vector retrieval, multi-variant deep mode, and RRF-based fusion.
8406:- **Recommendation**: reject
8410:- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go:10-52,55-107`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:28-58,280-332`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:324-343,346-391,713-750,803-850`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:21-41,931-942`
8411:- **What it does**: `ExpandQuery()` always keeps the original query first, appends up to five additional strings, and `vault_search` / `memory_search` then append results variant-by-variant while deduplicating by `path` or `subject|predicate`. After dedup, Modus simply truncates to `limit`; it does not merge scores across branches or globally re-rank the union. A librarian `RankResults()` helper exists, but the only call site is its own definition. Public, by contrast, preserves branch/source provenance per candidate and fuses later in the pipeline.
8413:- **Recommendation**: reject
8416:### Finding 3: The cache idea is useful, but the shipped Jaccard/LRU implementation is unsafe and only partially correct
8417:- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go:10-80,83-120,137-195`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:718-755`
8418:- **What it does**: Modus adds a two-tier cache: exact query hash match first, then fuzzy reuse when token-set Jaccard similarity is `>=0.6`, with `256` max entries. That part is interesting. But `get()` mutates `hits` while holding only `RLock`, and cache reads never increment the global counter, so its “LRU” recency signal is not actually advanced on access.
8419:- **Why it matters for us**: The architectural idea is stronger than the implementation. Public already has exact-argument caching around `memory_search`; a safe lexical/paraphrase cache could still be worth exploring for repeated nearby queries, but Modus’s version should not be copied.
8420:- **Recommendation**: prototype later
8423:### Finding 4: README latency claims only fit the pure in-memory BM25 path; the default librarian-expanded path can be network/LLM-bound
8424:- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:27-32,51-58,191-207,416-427`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:28-35,280-285`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/client.go:17-33,35-82`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:71-75,717-739`
8425:- **What it does**: Modus advertises `<100µs` cached search and `<5ms` cold search, which is believable for the in-memory BM25/cache path after startup. But when the librarian is reachable, both `vault_search` and `memory_search` first do a health probe and then send a chat-completions request with a `120s` HTTP timeout to generate expansions. That makes the real default search path dependent on external model latency, not just BM25 speed. Public’s deep expansion path is explicitly gated and wrapped in a `5s` timeout budget.
8427:- **Recommendation**: reject
8430:### Finding 5: Modus’s fact lane is **not BM25**, and it couples search with automatic write-side reinforcement
8432:- **What it does**: `memory_search` prints `bm25+librarian`, but the fact lane uses a separate `factStore.search()` that scores by token overlap, a small inverse-hit-frequency heuristic, `confidence * 0.1`, and a coarse recency multiplier. It is not BM25. Then every returned fact is asynchronously reinforced via `go v.ReinforceFact(...)`, so read access mutates stored state by default. Public already has FSRS strengthening logic, but only behind explicit `trackAccess=true`.
8434:- **Recommendation**: reject
8439:- **What it does**: Modus builds adjacency maps keyed by normalized subject, tag, and entity name, then scores connected docs with fixed weights `subject=3`, `entity=2`, `tag=1`. This is cheap and useful for related-document surfacing. But it is intentionally shallow: no traversal, no causal semantics, and the “scan title/body for entity mentions” comment only checks title and subject in code. Public already has richer graph-aware ranking signals, causal boost, and structural freshness augmentation.
8441:- **Recommendation**: prototype later
8446:- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go`
8450:- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go`
8451:- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/client.go`
8468:- **Questions addressed**: whether Modus has real hybrid/vector retrieval; exact BM25 field behavior; cache tiers and fuzzy reuse; expansion ordering and failure handling; credibility of search latency claims; fact-lane scoring and reinforcement coupling; cross-reference weighting vs graph behavior
8469:- **Questions answered**: Modus is lexical-only in shipped runtime; its query expansion is recall-oriented but rank-weak; its fuzzy cache idea is promising but its implementation is unsafe; its advertised latency excludes the LLM-expanded path; its fact search is a separate lightweight scorer with automatic write-back; its adjacency maps are best treated as related-doc hints, not as a graph substitute
8472:- **What worked**: Tracing the actual call chain from MCP tool handlers into the BM25 engine and librarian client exposed the real runtime behavior quickly, especially the difference between “search core” and “search marketing.” Comparing Modus’s branch merge logic directly against Public’s Stage 1/Stage 2 pipeline made the recommendation boundaries much clearer.
8484: gpt-5.4                  3.2m in, 20.0k out, 3.1m cached, 7.7k reasoning (Est. 1 Premium request)
8499:- **Recommendation**: reject
8505:- **Why it matters for us**: This is a major runtime hygiene flaw: dedup state, confidence, archive flags, and freshness are not read-your-writes consistent. Public’s mutation path updates DB state, BM25 state, lineage, and cache invalidation immediately; Modus does not.
8506:- **Recommendation**: reject
8513:- **Recommendation**: reject
8520:- **Recommendation**: prototype later
8527:- **Recommendation**: reject
8534:- **Recommendation**: reject
8583: gpt-5.4                  3.1m in, 19.9k out, 2.9m cached, 9.4k reasoning (Est. 1 Premium request)
8595:- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:211-230`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md:45-60,107-145,179-185`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go:83-88`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:7-38`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:143-162,343,379,856-897`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/server.go:149-188`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1100-1183,1458-1493`; `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:218-281,456-493`
8598:- **Recommendation**: reject
8605:- **Recommendation**: reject
8612:- **Recommendation**: reject
8616:- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go:83-88`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:7-38`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go:119-160,181-258`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/learnings.go:11-220`; `.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:157-199,205-258`; `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:962-973`
8619:- **Recommendation**: reject
8626:- **Recommendation**: prototype later
8630:- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/client.go:1-33,35-119`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go:15-52`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:28-53,280-317`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:211-231,316-317`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md:16-29,107-145`
8631:- **What it does**: Retrieval enrichment is optional: if the Librarian is reachable, Modus expands queries through a local OpenAI-compatible HTTP endpoint at `http://127.0.0.1:8090`; if not, search falls back to direct BM25. That separation of “reasoner” vs “local retriever/rewriter” is sound. But the implementation is hard-coded to one localhost endpoint with one request shape, while README says search needs no LLM calls and uses a “local synonym map,” which is not what the source does.
8633:- **Recommendation**: prototype later
8645:- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/client.go`
8646:- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go`
8649:- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md`
8677: gpt-5.4                  3.0m in, 18.8k out, 2.8m cached, 8.8k reasoning (Est. 1 Premium request)
8688:### Finding 1: Modus’s BM25 stack is clean, but Public’s lexical lane is already stronger and sits inside a broader retrieval system
8690:- **What it does**: Modus builds a six-field in-memory BM25 index with fixed weights (`path 1.5`, `source 1.0`, `subject 2.0`, `title 3.0`, `tags 1.5`, `body 1.0`), simple stemming, and a last-chance prefix scan when exact term lookup misses. Public already has weighted lexical retrieval too, but its FTS5 BM25 weights are materially stronger (`title 10x`, `trigger_phrases 5x`, generic metadata `2x`, body `1x`) and that lexical lane runs inside hybrid search with both vector and keyword channels active before later graph/session/feedback fusion.
8691:- **Why it matters for us**: The useful conclusion is **not** “swap in Modus BM25.” Public already has a richer lexical+semantic memory path, plus dedicated code retrieval channels. Modus is a reference for a compact lexical implementation, not a superior search architecture.
8692:- **Recommendation**: reject
8695:### Finding 2: Modus’s fuzzy query cache is one real retrieval idea Public does not already have
8696:- **Source**: `external/internal/index/cache.go:10-17,41-80,83-119,167-195`; `external/internal/index/indexer.go:169-219`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:718-767`
8697:- **What it does**: Modus adds a two-tier cache in front of search: exact normalized-query hash reuse, then fuzzy reuse when Jaccard similarity between token sets is at least `0.6`, with a small LRU of `256` entries. Public also caches search responses, but the cache key is exact and scope-heavy (`query/concepts/specFolder/tenant/user/agent/sharedSpace/session/flags`), so it does not opportunistically reuse near-duplicate lexical queries.
8699:- **Recommendation**: prototype later
8703:- **Source**: `external/internal/librarian/search.go:10-52`; `external/internal/mcp/vault.go:28-58,280-321`; `external/README.md:261-267,316-317`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-expander.ts:20-100`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:155-259`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:347-383,616-860,1088-1155`
8705:- **Why it matters for us**: The net-new idea is narrower than the README suggests. We do **not** need “query expansion” in general; we already have it. The transferable part is a cheap, explicitly lexical rewrite lane that can widen BM25/FTS recall without changing semantic or graph routing.
8706:- **Recommendation**: prototype later
8711:- **What it does**: Modus builds cheap adjacency maps over markdown documents only: shared subject gets weight `3.0`, entity `2.0`, tag `1.0`, then `vault_search` appends connected documents that were not already returned. Public’s code-graph and CocoIndex are stronger, but they solve different problems: `code_graph_query/context` answer structural code questions, and CocoIndex is the semantic code-search bridge. Neither is the same as “show me adjacent memory docs I might also want right now.”
8712:- **Why it matters for us**: This is additive, not competitive. Public should not replace causal memory or code graph with Modus-style string adjacency, but a small connected-memory appendix for markdown artifacts could improve exploration and follow-on recall without disturbing the existing routing split of memory vs semantic code vs structural code.
8713:- **Recommendation**: adopt now
8720:- **Recommendation**: reject
8723:### Finding 6: Modus’s retrieval README overstates the hot path; only the cache story is source-plausible
8724:- **Source**: `external/README.md:261-267,308-317`; `external/docs/librarian.md:33-40`; `external/internal/librarian/search.go:15-35,57-106`; `external/internal/index/cache.go:49-80,167-195`; `external/internal/index/bm25.go:116-118,171-181`
8725:- **What it does**: README says search uses “local synonym map” and “no LLM calls on the search path,” but source expansion/reranking go through `Call(...)` when the Librarian is available. The “microseconds” claim is believable for exact cache hits only; fuzzy cache still scans cache entries, and prefix fallback scans the full term vocabulary. So the fast path exists, but the marketing summary collapses very different paths together.
8726:- **Why it matters for us**: We should treat Modus’s performance story as a benchmark candidate for exact-cache and cold-BM25 tiers, not as proof that the overall retrieval design is cheaper or simpler than Public’s routed memory/CocoIndex/code-graph stack.
8727:- **Recommendation**: reject
8732:- `external/internal/index/cache.go`
8736:- `external/internal/librarian/search.go`
8743:- `external/docs/librarian.md`
8763:- **Questions addressed**: BM25 transferability vs Public lexical search; cache-path differences; real query-expansion mechanics; adjacency-map usefulness vs code-graph/CocoIndex; fact-lane overlap vs `memory_search`; credibility of performance claims.
8764:- **Questions answered**: Modus BM25 is not stronger than Public’s lexical lane; fuzzy lexical cache reuse is the clearest missing idea; Librarian expansion is real local-LLM rewriting, not a no-LLM synonym map; adjacency appendices are the best reusable retrieval UX pattern; Modus fact search is too narrow for Public’s main memory contract; README search/performance claims are only partially source-backed.
8767:- **What worked**: Following the requested order from BM25/cache/expansion into MCP handlers made the retrieval story much clearer than starting from the README. Comparing Modus against Public’s actual lexical, hybrid, semantic-code, and structural-code surfaces prevented false “missing feature” conclusions.
8779: gpt-5.4                  1.9m in, 15.3k out, 1.8m cached, 7.4k reasoning (Est. 1 Premium request)
8793:- **Recommendation**: reject
8800:- **Recommendation**: reject
8805:- **What it does**: Public resolves only server-managed session IDs, rejects mismatched callers, persists `session_state` with `spec_folder` and `current_task`, tracks inferred mode, and can inject attended working-memory items into resumed prompt context. Modus exposes no session token, no identity binding, and no resumed prompt-context surface.
8807:- **Recommendation**: reject
8812:- **What it does**: `session_resume` composes `memory_context(resume)`, code-graph status, CocoIndex availability, structural context, and cached continuity only when summary text, transcript identity, freshness, and scope all validate. `session_bootstrap` adds health, hints, and next actions. Modus has no comparable resume packet or cached-summary validator; `vault_status` is just counts.
8814:- **Recommendation**: reject
8821:- **Recommendation**: reject
8828:- **Recommendation**: prototype later
8868: gpt-5.4                  2.9m in, 20.1k out, 2.8m cached, 8.3k reasoning (Est. 1 Premium request)
8882:- **Recommendation**: reject
8889:- **Recommendation**: prototype later
8892:### Finding 3: Modus cross-references are associative adjacency maps, not a causal-memory hygiene system
8896:- **Recommendation**: reject
8901:- **What it does**: Modus exposes search plus Librarian expansion, but no trigger-phrase cache, no prompt-signal vocabulary, no scope/session validation, no degraded-mode reporting for trigger sources, and no co-activation or tiered-context recall path. Public’s trigger system caches validated phrases from `memory_index`, uses Unicode-aware boundary matching plus candidate indexing, fails closed on scope errors, reports degraded source parsing, supports signal boosts, and layers session-aware decay/co-activation/tier filtering on top.
8903:- **Recommendation**: reject
8908:- **What it does**: Modus treats malformed YAML frontmatter as raw body, skips parse failures during directory scans, writes frontmatter/body directly with no validation gate, and handles duplicate fact writes by suffixing filenames (`-2`, `-3`, ...). Public’s `memory_save` path runs explicit preflight checks for anchors, duplicates, tokens, and size, supports dry-run, and rejects invalid saves unless the caller deliberately bypasses preflight.
8910:- **Recommendation**: reject
8932:- **Questions answered**: Modus’s MCP status tooling is materially weaker than Public’s health surface; its adjacency maps are not substitutes for Public’s causal graph; it has no trigger-recall system comparable to Public’s; its markdown ingestion is permissive rather than hygiene-enforcing; the one transfer-worthy idea is a doctor-style duplicate/contradictory fact audit for Public.
8947: gpt-5.4                  1.3m in, 12.8k out, 1.1m cached, 6.3k reasoning (Est. 1 Premium request)
8962:- **Recommendation**: NEW FEATURE
8969:- **Recommendation**: NEW FEATURE
8976:- **Recommendation**: NEW FEATURE
8981:- **What it does**: Modus can open a PR-like markdown proposal against an `entity`, `belief`, or `fact`, store reasoning and linked belief IDs, then on merge reinforce linked beliefs or on rejection weaken them. Public’s reconsolidation bridge does similarity-based archive/review suggestions, but the reviewed path has no durable pending-proposal object, no explicit operator merge/reject event, and no confidence side-effects tied to that decision.
8983:- **Recommendation**: NEW FEATURE
8990:- **Recommendation**: NEW FEATURE
8997:- **Recommendation**: prototype later
9022:- Questions addressed: whether Modus has net-new memory-adjacent features beyond BM25/FSRS; whether it includes an operational lessons layer; whether it has autonomy/governance controls; whether decay feeds an actual quarantine/archive loop; whether it exposes a structured entity/belief model.
9038: gpt-5.4                  1.2m in, 14.4k out, 1.0m cached, 7.4k reasoning (Est. 1 Premium request)
9048:### Finding 1: **Reject Modus’s fuzzy result-cache architecture; it is the wrong cache contract for Public**
9049:- **Source**: `external/internal/index/cache.go:10-17,41-80,83-119`; `.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:56-61,98-106,143-181,242-257`
9050:- **What it does**: Modus caches full result sets with two tiers: exact query hash and fuzzy reuse when Jaccard similarity between token sets is `>= 0.6`. Its “LRU” bookkeeping is weaker than advertised: `counter` advances only on `put`, while `get` rewrites `hits` without advancing recency, so eviction is really write-recency-biased rather than true read-recency-aware. Public’s cache is a canonical-args SHA256 key with TTL, explicit invalidation by tool, and generation bumps to prevent stale reuse after mutations.
9052:- **Recommendation**: reject
9056:- **Source**: `external/internal/librarian/search.go:10-52`; `external/internal/mcp/vault.go:28-58,280-331`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:347-389,616-779`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:6-20`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/ranking-contract.ts:28-64`
9059:- **Recommendation**: reject
9064:- **What it does**: Modus has at least two fact-retrieval contracts for the same memory objects: a general document BM25 index filtered to `memory/facts/`, and a separate in-memory `factStore` with its own term index, confidence boost, recency boost, and active-flag handling. `memory_search` uses `Index.SearchFacts`, while `Vault.SearchFacts` uses a different path and fallback behavior. Public, by contrast, pushes `memory_search` through a single pipeline config and result contract.
9066:- **Recommendation**: adopt now
9073:- **Recommendation**: adopt now
9079:- **Why it matters for us**: The storage/index part of Modus’s adjacency model is not worth adopting over Public’s causal graph. But the UX layer is reusable: a formatter that emits graph-derived related-memory hints could improve browsing without touching retrieval architecture or inventing another relationship store.
9080:- **Recommendation**: prototype later
9088:- `external/internal/index/cache.go`
9092:- `external/internal/librarian/search.go`
9099:- `.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts`
9112:- Questions addressed: whether Modus’s cache design should influence Public; whether Modus’s query-expansion merge path is architecturally better or worse than Public’s pipeline; whether Modus’s split fact-search surfaces suggest a refactor direction; whether Public’s own FSRS write-back placement should change; whether any part of Modus’s connected-doc UX is worth borrowing without adopting its adjacency index.
9113:- Questions answered: Public should **not** move toward Modus’s fuzzy result cache or union-first expansion flow; Public **should** preserve a single canonical retrieval core and refactor access-writeback out of Stage 2; the only cross-ref idea worth carrying forward is a response-layer related-doc hint built from existing graph evidence rather than a new storage/index model.
9116:- What worked: Tracing the exact merge and cache code paths exposed the architectural differences much faster than feature-by-feature comparison. Looking at where side effects happen — handler, retrieval core, or post-processing — was the key lens for this iteration.
9128: gpt-5.4                  1.9m in, 16.9k out, 1.7m cached, 8.8k reasoning (Est. 1 Premium request)
9143:- **Recommendation**: **NEW FEATURE**
9150:- **Recommendation**: **prototype later**
9155:- **What it does**: Modus opens persistent PR artifacts with `target_type`, `target_id`, `reasoning`, `confidence`, and `linked_belief_ids`; merge/reject is explicit and feeds back into belief confidence. Public already has the raw ingredients for this pattern: assistive reconsolidation classifies borderline pairs and emits review-tier recommendations, but today those remain console warnings while actual changes still happen via direct `memory_update` / `memory_delete` / bulk-delete flows.
9156:- **Why it matters for us**: This is an immediately actionable shift. Public does not need Modus’s whole atlas model to benefit; it can turn its existing shadow recommendations into durable proposal rows with accept/reject outcomes, creating a real operator inbox for reconsolidation, supersession, and possibly promotion/deprecation decisions.
9157:- **Recommendation**: **adopt now**
9164:- **Recommendation**: **NEW FEATURE**
9171:- **Recommendation**: **prototype later**
9202:- Questions answered: **yes** — the strongest paradigm shifts are **multi-plane memory architecture, autonomy-stage governance, proposal-first mutation, decay-as-workflow, and readiness-aware mission state**. The delta is now more about **memory operations architecture** than about BM25 or FSRS formulas.
9217: gpt-5.4                  2.3m in, 15.5k out, 2.2m cached, 7.9k reasoning (Est. 1 Premium request)
9231:- **Why it matters for us**: This is the most valuable pattern in the repo because it turns memory mutation review into a durable operating surface instead of console output or ephemeral response metadata. Public already has strong mutation safety, but not a persistent review object that can be listed, approved, rejected, or resumed later.
9232:- **Recommendation**: **NEW FEATURE**
9237:- **What it does**: On merge, Modus marks the PR `merged`, stamps `closed_at`/`closed_by`, and reinforces each `linked_belief_id`; on reject, it marks `rejected`, stores `rejection_reason`, and weakens linked beliefs. Critically, `target_type` and `target_id` are recorded when the PR is opened, but the merge/reject path does **not** apply any mutation to that target object. The proposal is an evidence/governance artifact whose outcome feeds confidence updates into beliefs.
9239:- **Recommendation**: **adopt now**
9244:- **What it does**: Modus persists `atlas/trust.md`, defaults to stage 1 when absent, records transition history in the markdown body, and exposes MCP tools to get/set the stage with labels `Inform`, `Recommend`, and `Act`. But the current code does not use that stage to gate `atlas_open_pr`, `atlas_merge_pr`, `atlas_reject_pr`, or other mutation paths.
9246:- **Recommendation**: **reject**
9253:- **Recommendation**: **prototype later**
9258:- **What it does**: Public’s review-tier reconsolidation only creates an `assistiveRecommendation` payload and console warning; it is forwarded in the `memory_save` response but not persisted as a reviewable object. Meanwhile `memory_update`, `memory_delete`, and `memory_bulk_delete` act directly, protected by transactionality, checkpoints, and the append-only mutation ledger. `memory_validate` updates confidence, negative-feedback state, and promotion eligibility, but only emits hints like “consider updating or deleting.”
9259:- **Why it matters for us**: Public’s gap is no longer retrieval math or mutation safety. The missing layer is a persistent operator inbox that can hold borderline reconsolidation, supersession, promotion, or deprecation proposals and then feed accept/reject outcomes back into existing confidence and feedback systems.
9260:- **Recommendation**: **NEW FEATURE**
9285:- Questions addressed: whether the proposal/approval pattern is actually implemented end-to-end; whether trust stages are enforced or only descriptive; whether PR merge/reject mutates target objects or only linked confidence; whether Public already has an equivalent durable review surface; whether this pattern belongs in core retrieval or in an operator control plane.
9301: gpt-5.4                  1.1m in, 10.3k out, 952.3k cached, 4.4k reasoning (Est. 1 Premium request)
9314:- **What it does**: `memory_search` merges fact hits across librarian-expanded queries, then asynchronously calls `go v.ReinforceFact(f.ID)` for every returned fact. `MemFact.ID` is the relative markdown path loaded at index time, so the search result is directly wired back to the underlying file. `ReinforceFact()` then raises confidence toward `0.99`, grows `stability`, lowers `difficulty`, stamps `last_accessed`, and increments `access_count`.
9316:- **Recommendation**: **prototype later**
9323:- **Recommendation**: **NEW FEATURE**
9330:- **Recommendation**: **reject**
9337:- **Recommendation**: **reject**
9344:- **Recommendation**: **NEW FEATURE**
9384: gpt-5.4                  1.3m in, 12.4k out, 944.6k cached, 5.7k reasoning (Est. 1 Premium request)
9399:- **Recommendation**: **reject**
9405:- **Why it matters for us**: Modus optimizes for “keep indexing something,” but the cost is silent data quality loss and weaker operator trust. Public’s `memory_save` path is materially safer: preflight, dry-run, validation, and atomic save all give us a better place to reject malformed state before it becomes indexed ambiguity.
9406:- **Recommendation**: **reject**
9413:- **Recommendation**: **reject**
9420:- **Recommendation**: **reject**
9424:- **Source**: `external/internal/index/indexer.go:65-149,307-371`; `external/internal/index/bm25.go:103-181`; `external/internal/index/cache.go:27-119`; `external/internal/mcp/server.go:88-111`; `external/internal/mcp/vault.go:311-317`
9425:- **What it does**: Every build/open rescans markdown, reparses documents, rebuilds BM25, cross-refs, and the fact store entirely in RAM. Prefix fallback linearly scans the full term map. `memory_search` launches a goroutine per returned fact for asynchronous reinforcement writes. The cache uses `RWMutex`, but `get()` mutates `hits` while holding only `RLock`, which is unsafe if request handling ever becomes concurrent. The current stdio loop is serial, so that race is partly masked today.
9427:- **Recommendation**: **reject**
9434:- **Recommendation**: **NEW FEATURE**
9443:- `external/internal/index/cache.go`
9448:- `external/internal/librarian/client.go`
9449:- `external/internal/librarian/search.go`
9472:- What did not work: README and migration copy overstate recovery. Static analysis can validate that diagnostics exist and that writes are non-atomic, but it cannot prove the advertised performance numbers or how often the latent cache race would manifest in practice.
9483: gpt-5.4                  1.4m in, 16.1k out, 1.3m cached, 8.0k reasoning (Est. 1 Premium request)
9498:- **Recommendation**: **NEW FEATURE**
9505:- **Recommendation**: **adopt now**
9509:- **Source**: `external/internal/librarian/search.go:10-53`; `external/internal/mcp/vault.go:21-58,280-331`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:4-18,88-176,200-260`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:616-740`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:173-251`
9511:- **Why it matters for us**: Integration is **medium** because the insertion points already exist, but the value is incremental, not foundational. Public must avoid duplicating its current deep-mode expansion stack or adding noisy variant fan-out across vector, FTS, BM25, and graph lanes.
9512:- **Recommendation**: **prototype later**
9517:- **What it does**: Modus builds an in-memory metadata adjacency map from subject/tag/entity overlap, weights subject/entity/tag at `3/2/1`, and appends “connected” documents that were not in the main ranked set. Public already has stronger structural enrichment—causal-neighbor boost, neighbor injection, and co-activation spreading—but those are graph-driven, not simple frontmatter co-membership summaries.
9518:- **Why it matters for us**: Integration is **medium**. Public should not replace causal machinery with Modus’s simpler adjacency model, but it could add a lightweight explanation layer: “related by shared subject/tag/entity” as an appendix or secondary lane. That would improve operator comprehension without perturbing the main ranking path too aggressively.
9519:- **Recommendation**: **prototype later**
9524:- **What it does**: Modus exposes both automatic reinforcement on recall and an explicit `memory_reinforce` tool. Public already has the underlying grade model (`AGAIN/HARD/GOOD/EASY`), review processing, and strengthening-on-access logic, but keeps write-back behind `trackAccess=false` and has no first-class `memory_reinforce`/`memory_review` tool in the current schema set.
9526:- **Recommendation**: **adopt now**
9531:- `external/internal/index/cache.go`
9532:- `external/internal/librarian/search.go`
9553:- `.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts`
9561:- **Questions addressed**: which Modus ideas already have insertion points in Public; whether the missing work is backend math or operator surface; which candidates are low/medium integration versus truly invasive; whether connected-result hints overlap with Public graph features; whether librarian expansion is still meaningful given Public deep-mode reformulation.
9569:Evaluate a concrete Public design for `memory_due` + `memory_review`: one tool that lists due/stale/promotion-eligible/archival-candidate memories, and one tool that applies graded FSRS review updates explicitly, then compare whether a metadata-based “connected docs” appendix improves operator trust beyond current causal/contiguity enrichment.
9577: gpt-5.4                  2.8m in, 18.6k out, 2.6m cached, 9.0k reasoning (Est. 1 Premium request)
9592:- **Recommendation**: **NEW FEATURE**
9599:- **Recommendation**: **adopt now**
9602:### Finding 3: Lexical expansion risk — copying Modus’s librarian directly would stack another weak branch onto Public’s already-expanded deep pipeline
9603:- **Source**: `external/internal/librarian/search.go:10-52`; `external/internal/mcp/vault.go:280-299`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:8-18,88-125,148-175`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:616-740`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:173-251`
9606:- **Recommendation**: **prototype later**
9609:### Finding 4: Connected-doc hint risk — metadata adjacency is useful as explanation, but risky as a scoring signal
9611:- **What it does**: Modus builds an in-memory adjacency map from subject/tag/entity overlap with weights `3/2/1`, using lightweight matching. Public already has causal traversal, neighbor injection, and co-activation enrichment.
9613:- **Recommendation**: **prototype later**
9620:- **Recommendation**: **adopt now**
9628:- `external/internal/librarian/search.go`
9663: gpt-5.4                  1.2m in, 15.3k out, 1.0m cached, 6.3k reasoning (Est. 1 Premium request)
9674:### Finding 1: Rank 1 (20/25) — explicit `memory_review` is the first thing Public should ship
9678:- **Recommendation**: **adopt now**
9681:### Finding 2: Rank 2 (15/25, tie-broken ahead) — a doctor-style summary should ship in the same tranche as `memory_review`
9685:- **Recommendation**: **adopt now**
9692:- **Recommendation**: **NEW FEATURE**
9697:- **What it does**: Modus builds a lightweight adjacency layer from subject/tag/entity overlap and appends “connected docs not in results above” as an extra hint surface. Public already has stronger graph-backed enrichment via causal boosts, neighbor injection, and co-activation, but not a simple metadata-derived explanation appendix.
9699:- **Recommendation**: **prototype later**
9702:### Finding 5: Rank 5 (6/25) — Modus-style librarian expansion belongs last, and only as weak-result recovery
9703:- **Source**: `external/internal/librarian/search.go:10-52`; `external/internal/mcp/vault.go:280-299`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:4-18,88-176`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:616-740`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:173-251`
9705:- **Why it matters for us**: This has the weakest impact x feasibility score because it overlaps the most with existing Public machinery and carries the highest risk of branch explosion. The only credible adoption path is a bounded fallback for weak-result cases, never an always-on copy of Modus’s librarian path.
9706:- **Recommendation**: **prototype later**
9711:- **What it does**: The ranking resolves into a four-phase roadmap: **Phase 1** ship `memory_review` plus a doctor-style summary; **Phase 2** define the authoritative due-state contract and then add `memory_due`; **Phase 3** pilot connected-doc explanations as a non-scoring appendix; **Phase 4** run a feature-flagged lexical-expansion experiment only on weak-result fallback paths.
9713:- **Recommendation**: **adopt now**
9726:- `external/internal/librarian/search.go`
9743:- Questions answered: the correct roadmap is **not** “build the biggest feature first.” Public should ship **`memory_review` first**, pair it with a **doctor-style summary**, then formalize the due-state contract before building **`memory_due`**. Connected-doc hints are worth testing only as explanation, and lexical expansion should be the final, tightly bounded experiment.
9750:Finalize iteration 020 as a closing synthesis: specify the Public API shape for `memory_review` and `memory_due`, decide whether due state is persisted or derived, and define success metrics for the two later prototypes (connected-doc appendix and weak-result lexical fallback).
9758: gpt-5.4                  1.2m in, 17.2k out, 1.1m cached, 5.9k reasoning (Est. 1 Premium request)
9765:FINAL SYNTHESIS: Classify EVERY finding as adopt-now / prototype-later / new-feature-needed / reject. Executive summary.
9767:**Executive summary:** Borrow **Modus’s operator surfaces**, not its weaker retrieval shortcuts. **Adopt now:** graded `memory_review`, doctor-style summary, and a strict one-retrieval-core rule. **New feature needed:** authoritative `memory_due` and a durable proposal inbox. **Prototype later:** connected-doc appendix, weak-result lexical fallback, and content-level contradiction linting. **Reject:** fuzzy result-cache reuse, permissive markdown ingestion, default write-on-read as policy, and unenforced trust-stage metadata.
9775:- **Recommendation**: adopt now
9782:- **Recommendation**: adopt now
9789:- **Recommendation**: adopt now
9796:- **Recommendation**: NEW FEATURE
9801:- **What it does**: Modus persists risky knowledge changes as markdown PR artifacts, then merge/reject outcomes reinforce or weaken linked beliefs. Public already produces advisory reconsolidation recommendations and confidence feedback, but the recommendation is transient and not stored as a durable review object.
9803:- **Recommendation**: NEW FEATURE
9808:- **What it does**: Modus builds lightweight subject/entity/tag adjacency and appends connected docs that did not make the main ranked list. The weighting is simple and fixed (`subject 3`, `entity 2`, `tag 1`).
9810:- **Recommendation**: prototype later
9814:- **Source**: `external/internal/librarian/search.go:10-52`; `external/internal/mcp/vault.go:28-58,280-299`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:525-529,771-809`
9817:- **Recommendation**: prototype later
9824:- **Recommendation**: prototype later
9827:### Finding 9: Reject Modus’s fuzzy Jaccard result-cache contract
9828:- **Source**: `external/internal/index/cache.go:10-17,41-119`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:502-529,718-755`
9829:- **What it does**: Modus reuses cached result sets on exact hash hits or Jaccard-similar query term sets. Public’s search surface has too many scoring knobs—scope, archived filtering, session/causal boost, rerank, quality thresholds, trace/profile flags—for fuzzy query reuse to be safe.
9830:- **Why it matters for us**: This is the wrong cache contract for Public. Similar text is not enough to guarantee equivalent retrieval intent or scoring context.
9831:- **Recommendation**: reject
9838:- **Recommendation**: reject
9845:- **Recommendation**: reject
9852:- **Recommendation**: reject
9857:- `external/internal/index/cache.go`
9861:- `external/internal/librarian/search.go`
9892:- Questions addressed: which Modus patterns still survive final scrutiny; which ones are operator-surface wins versus retrieval regressions; whether broader control-plane ideas like PRs and trust stages hold up in code; what the final adopt/prototype/reject map should be.
9893:- Questions answered: Public should **not** become “Modus with hybrid search.” It should keep its stronger hybrid/governed core, **ship review + doctor first**, then add **due-state and proposal workflow** as real product surfaces, while rejecting Modus’s fuzzy caching, permissive markdown semantics, and default write-on-read policy.
9900:Turn this synthesis into implementation design: define the Public `memory_review` API first, add a doctor-style formatter over `memory_health`, then write the due-state ADR (`persisted next_review_at` vs deterministic derivation) before scoping `memory_due` and the proposal inbox.
9908: gpt-5.4                  1.3m in, 14.8k out, 1.1m cached, 6.4k reasoning (Est. 1 Premium request)

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts | sed -n '190,235p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   190	    ? [sanitized, specFolder, specFolder, limit]
   191	    : [sanitized, limit];
   192	
   193	  // Bm25() returns negative scores (lower = better), so we negate
   194	  // To produce positive scores where higher = better match.
   195	  const [w0, w1, w2, w3] = BM25_FTS5_WEIGHTS;
   196	  const sql = `
   197	    SELECT m.*, -bm25(memory_fts, ${w0}, ${w1}, ${w2}, ${w3}) AS fts_score
   198	    FROM memory_fts
   199	    JOIN memory_index m ON m.id = memory_fts.rowid
   200	    WHERE memory_fts MATCH ?
   201	      ${folderFilter}
   202	      ${archivalFilter}
   203	      ${deprecatedTierFilter}
   204	    ORDER BY fts_score DESC
   205	    LIMIT ?
   206	  `;
   207	
   208	  const capability = probeFts5Capability(db);
   209	  setLastLexicalCapabilitySnapshot(capability);
   210	  if (capability.fallbackState !== 'ok') {
   211	    console.warn(`[sqlite-fts] FTS5 unavailable (${capability.fallbackState}); returning empty lexical lane results`);
   212	    return [];
   213	  }
   214	
   215	  try {
   216	    const rows = (db.prepare(sql) as Database.Statement).all(
   217	      ...params
   218	    ) as Array<Record<string, unknown>>;
   219	
   220	    const normalizedRows = rows.map(row => ({
   221	      ...row,
   222	      id: row.id as number,
   223	      fts_score: (row.fts_score as number) || 0,
   224	    }));
   225	    setLastLexicalCapabilitySnapshot({
   226	      lexicalPath: 'fts5',
   227	      fallbackState: 'ok',
   228	    });
   229	    return normalizedRows;
   230	  } catch (error: unknown) {
   231	    const msg = error instanceof Error ? error.message : String(error);
   232	    const failureSnapshot: LexicalCapabilitySnapshot = isNoSuchModuleFts5Error(error)
   233	      ? {
   234	          lexicalPath: 'unavailable',
   235	          fallbackState: 'no_such_module_fts5',

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md | sed -n '180,215p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   180	### 3. Check your vault
   181	
   182	```bash
   183	modus-memory health
   184	# modus-memory 0.3.0
   185	# Vault: ~/modus/vault
   186	# Documents: 847
   187	# Facts: 234 total, 230 active
   188	# Cross-refs: 156 subjects, 89 tags, 23 entities
   189	```
   190	
   191	## Tools
   192	
   193	modus-memory exposes 11 MCP tools — all free, no limits:
   194	
   195	| Tool | Description |
   196	|------|-------------|
   197	| `vault_search` | BM25 full-text search with librarian query expansion and cross-reference hints |
   198	| `vault_read` | Read any document by path |
   199	| `vault_write` | Write a document with YAML frontmatter + markdown body |
   200	| `vault_list` | List documents in a subdirectory with optional filters |
   201	| `vault_status` | Vault statistics — document counts, index size, cross-ref stats |
   202	| `memory_facts` | List memory facts, optionally filtered by subject |
   203	| `memory_search` | Search memory facts with automatic FSRS reinforcement on recall |
   204	| `memory_store` | Store a new memory fact (subject/predicate/value) |
   205	| `memory_reinforce` | Explicitly reinforce a memory — increases stability, decreases difficulty |
   206	| `memory_decay_facts` | Run FSRS decay sweep — naturally forgets stale memories |
   207	| `vault_connected` | Cross-reference query — find everything linked to a subject, tag, or entity |
   208	
   209	## The Librarian Pattern
   210	
   211	Most memory systems let any LLM read and write freely. modus-memory is designed around a different principle: a single dedicated local model — the **Librarian** — serves as the sole authority over persistent state.
   212	
   213	```
   214	┌─────────────┐     ┌────────────────┐     ┌──────────────┐
   215	│ Cloud Model  │◄───►│   Librarian    │◄───►│ modus-memory │

codex
I have the retrieval and FSRS evidence already. I’m doing one small final read for the “doctor/status” recommendation so I can either keep it confidently in the top tier or demote it if the source support is thinner than the late-iteration notes suggested.
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/doctor.go | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
   221			for _, s := range stats {
   222				fmt.Printf("  %-20s %d docs\n", s.name+"/", s.count)
   223			}
   224		}
   225	
   226		fmt.Println()
   227		if len(findings) == 0 {
   228			fmt.Println("Vault is healthy.")
   229		} else {
   230			warns := 0
   231			for _, f := range findings {
   232				if f.level == "WARN" {
   233					warns++
   234				}
   235			}
   236			if warns > 0 {
   237				fmt.Printf("%d warnings, %d info. Run after cleanup to verify.\n", warns, len(findings)-warns)
   238			} else {
   239				fmt.Printf("%d info items. Vault is healthy.\n", len(findings))
   240			}
   241		}
   242	}
   243	
   244	type finding struct {
   245		level   string
   246		message string
   247	}
   248	
   249	func severityRank(level string) int {
   250		switch level {
   251		case "FAIL":
   252			return 3
   253		case "WARN":
   254			return 2
   255		case "INFO":
   256			return 1
   257		default:
   258			return 0
   259		}
   260	}

exec
/bin/zsh -lc "rg -n \"memory_health|doctor|status|route summary|profile .*debug|includeTrace\" .opencode/skill/system-spec-kit/mcp_server -g '"'!**/dist/**'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:138:  status: string;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:165:    status: 'ok' | 'error';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:216:  'code_graph_status',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:242:  status: 'ok' | 'timeout' | 'unavailable';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:281:function isMutationStatus(status: string | undefined): boolean {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:282:  return status === 'indexed' || status === 'updated' || status === 'reinforced' || status === 'deferred';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:594:    status: 'ok',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:636:          status: 'unavailable',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:650:        status: 'timeout',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:680:  const codeGraphState = codeGraphStatus?.status === 'ok'
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:681:    ? 'loaded code graph status'
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:682:    : 'code graph status unavailable';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1292:        if (result.status === 'indexed') indexed++;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1293:        else if (result.status === 'updated') updated++;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1838:              if (isMutationStatus(result.status)) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1841:                    indexed: result.status === 'indexed' || result.status === 'deferred' ? 1 : 0,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1842:                    updated: result.status === 'updated' || result.status === 'reinforced' ? 1 : 0,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1847:                    status: result.status,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:5:// and rollout status reporting with deny-by-default access.
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:33:type SharedIdentityTool = SharedAdminTool | 'shared_memory_status';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:374:  tool: 'shared_space_upsert' | 'shared_space_membership_set' | 'shared_memory_status' | 'shared_memory_enable',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:747: * Report rollout status and visible shared spaces for the requested scope.
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:756:      tool: 'shared_memory_status',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:765:      tool: 'shared_memory_status',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:785:      'shared_memory_status',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:786:      'Shared memory status failed',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:910:| \`/memory:manage shared status\` | View rollout state and accessible spaces |
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:50:/** Arguments for the memory_health handler. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:268:      'Use memory_ingest_status with jobId to poll progress',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:290:      tool: 'memory_ingest_status',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:303:    tool: 'memory_ingest_status',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:325:        actions: ['Call memory_ingest_status with a known jobId'],
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:356:const handle_memory_ingest_status = handleMemoryIngestStatus;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:364:  handle_memory_ingest_status,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:14:// Feature catalog: Health diagnostics (memory_health)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:36:const handle_memory_health = handleMemoryHealth;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:45:  handle_memory_health,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:24:  status: 'success' | 'pending';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:162:            status: embeddingStatus,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:188:    status: embeddingStatus,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:55:  status: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:114:  status?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:153:  embedding_status?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:39:| `dedup.ts`                  | Pre-save deduplication. `checkExistingRow` matches by file path but returns `unchanged` only for healthy rows (`success`, `pending`, `partial`); `checkContentHashDedup` matches by content hash and accepts chunked parents only when their status is valid `partial`. |
.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:69:- **Deferred Indexing** -- When embedding generation fails or async mode is explicitly requested, the memory is stored with `embedding_status = 'pending'` and remains searchable via BM25/FTS5. Normal watcher/ingest reindex cache misses still run the eager provider path.
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:345:              status: reconResult.action === 'merge' ? 'merged' : 'superseded',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:39:  embedding_status: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:95:    SELECT id, content_hash, embedding_status, trigger_phrases, quality_score, quality_flags
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:220:  const existingStatus = existing?.embedding_status ?? null;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:231:      status: 'unchanged',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:259:      'embedding_status IN (?, ?)',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:296:        status: 'duplicate',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:151:      status: resultStatus,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:164:    status: resultStatus,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:249:  if (result.status === 'unchanged') {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:254:        status: 'unchanged',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:263:  if (result.status === 'error') {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:273:        status: result.status,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:282:  if (result.status === 'rejected') {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:288:        status: 'rejected',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:312:  const shouldEmitPostMutationFeedback = result.status !== 'duplicate' && result.status !== 'unchanged';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:331:    status: result.status,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:340:    message: result.message ?? (result.status === 'duplicate' ? 'Memory skipped (duplicate content)' : `Memory ${result.status} successfully`),
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:352:    response.message = `Memory ${result.status} (PE: ${result.pe_action})`;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:435:  } else if (result.status === 'duplicate') {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:144:  status: 'error' | 'warning';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:152:    && 'status' in value
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:153:    && typeof (value as { status?: unknown }).status === 'string'
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:211:  if (isVRuleUnavailableResult(vRuleResult) && vRuleResult.status === 'error') {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:639:          status: 'rejected',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:732:      status: embeddingStatus,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:767:            status: 'rejected',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:844:        && (chunkedResult.status === 'indexed' || chunkedResult.status === 'updated')
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:871:            status: 'error',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:881:        && (chunkedResult.status === 'indexed' || chunkedResult.status === 'updated')
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1216:        status: 'dry_run',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1348:          status: 'dry_run',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1455:  if (typeof result.id === 'number' && result.id > 0 && result.status !== 'unchanged' && result.status !== 'duplicate') {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1583:          if (lockedIndexResult.status === 'rejected') {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1613:      if (indexResult.status === 'error') {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1614:        throw new Error(indexResult.message ?? indexResult.error ?? 'indexMemoryFile returned status=error');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1616:      if (indexResult.status === 'rejected') {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1621:          status: 'rejected',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1671:      status: 'error',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1692:      status: 'error',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1710:  if (indexResult.status !== 'unchanged' && indexResult.status !== 'duplicate' && indexResult.id > 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1714:  const shouldEmitPostMutationFeedback = indexResult.status !== 'duplicate' && indexResult.status !== 'unchanged';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1737:    indexResult.status === 'duplicate'
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1739:      : `Memory ${indexResult.status} successfully`
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1751:  } else if (indexResult.status === 'duplicate') {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1758:    status: indexResult.status,
.opencode/skill/system-spec-kit/mcp_server/README.md:178:  "tool": "memory_health",
.opencode/skill/system-spec-kit/mcp_server/README.md:183:You should get a JSON response with `status: "ok"` and database table counts.
.opencode/skill/system-spec-kit/mcp_server/README.md:489:**Provenance-rich response envelopes** (when `includeTrace` is enabled) -- show exactly how each result was found: which channels contributed, how scores were calculated and where the information originated.
.opencode/skill/system-spec-kit/mcp_server/README.md:517:**12-metric core computation** -- grades every query across twelve quality dimensions (MRR@1/3/10, NDCG@10, MAP and more). Together they pinpoint exactly where search is struggling, like a doctor running multiple tests instead of just asking "do you feel sick?"
.opencode/skill/system-spec-kit/mcp_server/README.md:545:**Startup/recovery surfaces:** `session_resume`, `session_bootstrap`, and the startup brief now report freshness-aware graph status instead of count-only health. Startup surfaces are intentionally non-mutating snapshots, so later structural reads may still differ if repo state changes.
.opencode/skill/system-spec-kit/mcp_server/README.md:583:| `includeTrace` | boolean | Include retrieval trace for debugging |
.opencode/skill/system-spec-kit/mcp_server/README.md:601:Resume session with combined memory, code graph and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. The response carries freshness-aware code-graph status (`fresh`, `stale`, `empty`, `error`) instead of count-only health. For the canonical first-call recovery path on session start or after `/clear`, prefer `session_bootstrap`.
.opencode/skill/system-spec-kit/mcp_server/README.md:763:##### `memory_health`
.opencode/skill/system-spec-kit/mcp_server/README.md:779:Check session readiness: priming status, code graph freshness and time since last tool call. Returns `ok`, `warning` or `stale` with actionable hints. Call periodically during long sessions to detect context drift.
.opencode/skill/system-spec-kit/mcp_server/README.md:783:| _(none required)_ |  | Returns health status with hints |
.opencode/skill/system-spec-kit/mcp_server/README.md:924:##### `shared_memory_status`
.opencode/skill/system-spec-kit/mcp_server/README.md:1087:| `includeTrace` | boolean | Include trace metadata for debugging |
.opencode/skill/system-spec-kit/mcp_server/README.md:1123:Start a bulk import job for multiple markdown files. Returns immediately with a job ID so you do not have to wait. Check progress with `memory_ingest_status`.
.opencode/skill/system-spec-kit/mcp_server/README.md:1132:##### `memory_ingest_status`
.opencode/skill/system-spec-kit/mcp_server/README.md:1165:##### `code_graph_status`
.opencode/skill/system-spec-kit/mcp_server/README.md:1175:##### `ccc_status`
.opencode/skill/system-spec-kit/mcp_server/README.md:1177:Check CocoIndex availability, binary path and index status.
.opencode/skill/system-spec-kit/mcp_server/README.md:1262:| L5 | Lifecycle | 8 | 600 | Checkpoints, shared spaces and enable/status/shared-space lifecycle |
.opencode/skill/system-spec-kit/mcp_server/README.md:1446:  "tool": "memory_ingest_status",
.opencode/skill/system-spec-kit/mcp_server/README.md:1542:| Diagnose search problems | `memory_health` | Set `reportMode: "full"` |
.opencode/skill/system-spec-kit/mcp_server/README.md:1563:{ "tool": "memory_health", "arguments": { "reportMode": "full", "autoRepair": true } }
.opencode/skill/system-spec-kit/mcp_server/README.md:1663:{ "tool": "memory_health", "arguments": { "reportMode": "divergent_aliases", "limit": 20 } }
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:85:        if (reinforced.status !== 'error') {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:143:          linkedMemoryIds: updated.status === 'error' ? [existingId] : [existingId, updated.id],
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:113:  if (structuralContext.status === 'ready') {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:115:  } else if (structuralContext.status === 'stale') {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:121:  const healthStatus = typeof healthData.status === 'string' ? healthData.status : null;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:146:  if (structuralContext.status !== 'ready') {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:196:  if (structuralContext.status === 'stale' || structuralContext.status === 'missing') {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:198:      `Structural context is ${structuralContext.status}. Run code_graph_scan if needed, then re-run session_bootstrap.`
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:203:  if (cachedSummary?.status === 'accepted') {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:221:  const cachedCertainty: SharedPayloadCertainty = cachedSummary?.status === 'accepted' ? 'estimated' : 'defaulted';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:255:  if (cachedSummary?.status === 'accepted' && cachedSummary.cachedSummary) {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:301:      ...(cachedSummary?.status === 'accepted' ? [{ label: 'cached', certainty: cachedCertainty }] : []),
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:304:    ])}; structuralStatus=${structuralContext.status}`,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:308:      trustState: trustStateFromStructuralStatus(structuralContext.status),
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:315:    graphFreshness: structuralContext.status === 'ready'
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:317:      : structuralContext.status === 'stale'
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:346:      text: JSON.stringify({ status: 'ok', data: result }, null, 2),
.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts:38:    status: 'rejected',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts:62:    status: 'rejected',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:5:// code graph status, and CocoIndex availability into a single call.
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:68:  status: 'accepted' | 'rejected';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:94:  status: 'fresh' | 'stale' | 'empty' | 'error';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:166:    status: 'rejected',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:328:    status: 'accepted',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:373:  if (decision.status !== 'accepted' || !decision.cachedSummary) {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:387:  if (decision.status === 'accepted' || decision.reason === 'missing_state') {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:437:  // ── Sub-call 2: Code graph status ───────────────────────────
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:439:    status: 'error',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:449:      status: freshness,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:455:    // Graph status hints deferred to structural contract (Phase 027)
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:458:    codeGraph = { status: 'error', lastScan: null, nodeCount: 0, edgeCount: 0, fileCount: 0 };
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:473:  if (structuralContext.status === 'stale' || structuralContext.status === 'missing') {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:474:    hints.push(`Structural context is ${structuralContext.status}. Call session_bootstrap to refresh.`);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:484:  if (cachedSummaryDecision.status === 'accepted') {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:504:  const cachedCertainty: SharedPayloadCertainty = cachedSummaryDecision.status === 'accepted' ? 'estimated' : 'defaulted';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:505:  const codeGraphCertainty: SharedPayloadCertainty = codeGraph.status === 'error' ? 'unknown' : 'exact';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:518:  if (cachedSummaryDecision.status === 'accepted' && cachedSummaryDecision.cachedSummary) {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:533:      key: 'code-graph-status',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:535:      content: `status=${codeGraph.status}; files=${codeGraph.fileCount}; nodes=${codeGraph.nodeCount}; edges=${codeGraph.edgeCount}; lastScan=${codeGraph.lastScan ?? 'unknown'}`,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:540:      key: 'cocoindex-status',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:564:      ...(cachedSummaryDecision.status === 'accepted' ? [{ label: 'cached', certainty: cachedCertainty }] : []),
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:568:    ])}; graph=${codeGraph.status}; graphStatus=${codeGraph.status}`,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:572:      trustState: trustStateFromStructuralStatus(structuralContext.status),
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:579:    graphFreshness: codeGraph.status as GraphFreshness,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:611:      text: JSON.stringify({ status: 'ok', data: result }, null, 2),
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:32:- `memory-ingest.ts` - Async ingestion job start, status, and cancel handlers.
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:46:- `code-graph/status.ts` - `code_graph_status`: report graph health and statistics.
.opencode/skill/system-spec-kit/mcp_server/handlers/v-rule-bridge.ts:42:  status: 'error' | 'warning';
.opencode/skill/system-spec-kit/mcp_server/handlers/v-rule-bridge.ts:94:      status: 'error',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:209:  includeTrace?: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:211:  /** REQ-D5-003: Presentation profile ('quick'|'research'|'resume'|'debug'). Default: full response. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:526:    includeTrace: includeTraceArg = false,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:531:  const includeTraceByFlag = process.env.SPECKIT_RESPONSE_TRACE === 'true';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:532:  const includeTrace = includeTraceByFlag || includeTraceArg === true;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:747:    includeTrace,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1005:      includeTrace,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1172:  if (includeTrace && sessionTransition) {
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:125:- startup and resume surfaces report freshness-aware graph status (`fresh`, `stale`, `empty`, `error`)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:434:- `code_graph_status` (graph health check)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:447:- the startup or bootstrap response reports freshness-aware graph status
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:860:  "SELECT embedding_status, COUNT(*) FROM memory_index GROUP BY embedding_status"
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1017:  "SELECT embedding_status, COUNT(*) FROM memory_index GROUP BY embedding_status"
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:44:  inputSchema: { type: 'object', additionalProperties: false, properties: { input: { type: 'string', minLength: 1, description: 'The query, prompt, or context description (required)' }, mode: { type: 'string', enum: ['auto', 'quick', 'deep', 'focused', 'resume'], default: 'auto', description: 'Context retrieval mode: auto (detect intent), quick (fast triggers), deep (comprehensive search), focused (intent-optimized), resume (session recovery)' }, intent: { type: 'string', enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'], description: 'Explicit task intent. If not provided and mode=auto, intent is auto-detected from input.' }, specFolder: { type: 'string', description: 'Limit context to specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval when memory_context routes to memory_search.' }, userId: { type: 'string', description: 'User boundary for governed retrieval when memory_context routes to memory_search.' }, agentId: { type: 'string', description: 'Agent boundary for governed retrieval when memory_context routes to memory_search.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed retrieval when memory_context routes to memory_search.' }, limit: { type: 'number', minimum: 1, maximum: 100, description: 'Maximum results (mode-specific defaults apply)' }, sessionId: { type: 'string', description: 'Optional server-issued session identifier for working-memory continuity. When provided, it must match an existing server-managed session or the call is rejected. Omit it to let the server generate a new session for this request.' }, enableDedup: { type: 'boolean', default: true, description: 'Enable session deduplication' }, includeContent: { type: 'boolean', default: false, description: 'Include full file content in results' }, includeTrace: { type: 'boolean', default: false, description: 'Include provenance-rich trace data (scores, source, trace) in results when underlying memory_search is called' }, tokenUsage: { type: 'number', minimum: 0.0, maximum: 1.0, description: "Optional caller token usage ratio (0.0-1.0)" }, anchors: { type: 'array', items: { type: 'string' }, description: 'Filter content to specific anchors (e.g., ["state", "next-steps"] for resume mode)' }, profile: { type: 'string', enum: ['quick', 'research', 'resume', 'debug'], description: 'Optional response profile formatter. Returns a reduced or mode-aware response shape when profile formatting is enabled.' } }, required: ['input'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:181:      includeTrace: {
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:220:  inputSchema: { type: 'object', additionalProperties: false, properties: { filePath: { type: 'string', minLength: 1, description: 'Absolute path to the memory file (must be in specs/**/memory/, .opencode/specs/**/memory/, specs/**/ for spec documents, or .opencode/skill/*/constitutional/)' }, force: { type: 'boolean', default: false, description: 'Force re-index even if content hash unchanged' }, dryRun: { type: 'boolean', default: false, description: 'Validate only without saving. Returns validation results including anchor format, duplicate check, and token budget estimation (CHK-160)' }, skipPreflight: { type: 'boolean', default: false, description: 'Skip pre-flight validation checks (not recommended)' }, asyncEmbedding: { type: 'boolean', default: false, description: 'When true, embedding generation is deferred for non-blocking saves. Memory is immediately saved with pending status and an async background attempt is triggered. Default false preserves synchronous embedding behavior.' }, tenantId: { type: 'string', description: 'Tenant boundary for governed ingest.' }, userId: { type: 'string', description: 'User boundary for governed ingest.' }, agentId: { type: 'string', description: 'Agent boundary for governed ingest.' }, sessionId: { type: 'string', description: 'Session boundary for governed ingest.' }, sharedSpaceId: { type: 'string', description: 'Optional shared-memory space for collaboration saves.' }, provenanceSource: { type: 'string', description: 'Required provenance source when governance guardrails are enabled.' }, provenanceActor: { type: 'string', description: 'Required provenance actor when governance guardrails are enabled.' }, governedAt: { type: 'string', description: 'ISO timestamp for governed ingest. Defaults to now when omitted.' }, retentionPolicy: { type: 'string', enum: ['keep', 'ephemeral', 'shared'], description: 'Retention class applied to the saved memory.' }, deleteAfter: { type: 'string', description: 'Optional ISO timestamp after which retention sweep may delete the memory.' } }, required: ['filePath'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:232:  description: '[L3:Discovery] Get statistics about the memory system. Shows counts, dates, status breakdown, and top folders. Supports multiple ranking modes including composite scoring. Token Budget: 800.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:237:  name: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:238:  description: '[L3:Discovery] Check health status of the memory system. Token Budget: 800.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:268:        description: 'Required with autoRepair:true to execute repair actions. When false or omitted, memory_health returns a confirmation-only response.'
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:444:  name: 'shared_memory_status',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:597:  name: 'memory_ingest_status',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:657:  name: 'code_graph_status',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:692:      includeTrace: { type: 'boolean', description: 'Include trace metadata in response for debugging' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:699:  name: 'ccc_status',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:700:  description: '[L7:Maintenance] Check CocoIndex availability, binary path, and index status.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:734:  description: '[L3:Discovery] Check session readiness: priming status, code graph freshness, time since last tool call. Call periodically during long sessions to check for context drift. Returns ok/warning/stale with actionable hints. No arguments required.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:741:  description: '[L1:Orchestration] Resume session with combined memory, code graph, and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. For the canonical first-call recovery path on session start or after /clear, prefer session_bootstrap. Use minimal: true to skip the heavy memory context call and return code graph, CocoIndex, structural context, hints, and session-quality metadata without the full memory payload.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:768:      resume: { type: 'object', description: 'Merged session_resume payload (spec folder, task status, memory context)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:769:      health: { type: 'object', description: 'session_health payload (system status, database health, MCP connectivity)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:770:      structuralContext: { type: 'object', description: 'Structural bootstrap contract (status, summary, recommendedAction); omitted when code graph is unavailable', properties: { status: { type: 'string', enum: ['ready', 'stale', 'missing'] }, summary: { type: 'string' }, recommendedAction: { type: 'string' } } },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:772:      nextActions: { type: 'array', items: { type: 'string' }, description: 'Up to 3 recommended next actions derived from resume, health, and structural status' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:844:  name: 'deep_loop_graph_status',
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:252:export const handle_memory_ingest_status = lazyFunction(getMemoryIngestModule, 'handle_memory_ingest_status');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:267:export const handle_memory_health = lazyFunction(getMemoryCrudModule, 'handle_memory_health');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:87:  includeTrace?: boolean; // CHK-040: Forward to internal memory_search calls
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:124:  includeTrace?: boolean; // CHK-040: Forward to internal memory_search calls
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:127:  /** REQ-D5-003: Presentation profile ('quick'|'research'|'resume'|'debug'). Default: full response. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:185:  includeTrace: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:732:    includeTrace: options.includeTrace || false, // CHK-040
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:763:    includeTrace: options.includeTrace || false, // CHK-040
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:797:    includeTrace: options.includeTrace || false, // CHK-040
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:905:        /\b(next(?:\s+steps?)?|status|state|blockers|where\b|left off|what changed)\b/i.test(normalizedInput)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1009:    includeTrace,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1031:            includeTrace === true ? sessionTransition : undefined,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1289:    includeTrace: (args as unknown as Record<string, unknown>).includeTrace === true, // CHK-040
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1345:  options.sessionTransition = options.includeTrace === true ? sessionTransition : undefined;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1427:  const tracedResult0: ContextResult = effectiveMode === 'quick' && options.includeTrace === true
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1501:      includeTrace: options.includeTrace === true,
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:392:      text: JSON.stringify({ status: 'ok', data }, null, 2),
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:401:      text: JSON.stringify({ status: 'error', error }),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:112:  includeTrace: z.boolean().optional(), // CHK-040: Forward to internal memory_search
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:151:  includeTrace: z.boolean().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:404:  memory_health: memoryHealthSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:424:  memory_ingest_status: memoryIngestStatusSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:445:  shared_memory_status: getSchema({
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:462:  memory_context: ['input', 'mode', 'intent', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'sessionId', 'enableDedup', 'includeContent', 'includeTrace', 'tokenUsage', 'anchors', 'profile'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:463:  memory_search: ['cursor', 'query', 'concepts', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'sessionId', 'enableDedup', 'tier', 'contextType', 'useDecay', 'includeContiguity', 'includeConstitutional', 'enableSessionBoost', 'enableCausalBoost', 'includeContent', 'anchors', 'min_quality_score', 'minQualityScore', 'bypassCache', 'rerank', 'applyLengthPenalty', 'applyStateLimits', 'minState', 'intent', 'autoDetectIntent', 'trackAccess', 'includeArchived', 'mode', 'includeTrace', 'profile'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:469:  memory_health: ['reportMode', 'limit', 'specFolder', 'autoRepair', 'confirmed'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:489:  memory_ingest_status: ['jobId'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:493:  shared_memory_status: ['tenantId', 'actorUserId', 'actorAgentId'],
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:86:  status: string;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:767: *   - Active sessions (session_state with status='active')
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:810:      `DELETE FROM session_state WHERE status IN ('completed', 'interrupted') AND updated_at < ?`
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:961:    status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'completed', 'interrupted')),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:974:  'CREATE INDEX IF NOT EXISTS idx_session_state_status ON session_state(status);',
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1036:        session_id, status, spec_folder, current_task, last_action,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1043:        status = 'active',
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1085:      SET status = 'completed', updated_at = ?
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1113:      SET status = 'interrupted', updated_at = ?
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1114:      WHERE status = 'active'
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1136:      SELECT session_id, status, spec_folder, current_task, last_action,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1161:      status: row.status as string,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1173:      _recovered: row.status === 'interrupted',
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1176:    if (row.status === 'interrupted') {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1179:        SET status = 'active', updated_at = ?
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1203:      WHERE status = 'interrupted'
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:41:    status: 'ok' | 'error';
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:188:      AND embedding_status IN ('success', 'pending', 'partial')
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:224:      status: 'ok',
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:240:      status: 'error',
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:439:  if (graphSnapshot.status === 'ok' && graphSnapshot.data) {
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:525:    if (enrichedConstitutional.length === 0 && codeGraphStatus.status !== 'ok') {
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:49:  status: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:190:      status: 'reinforced',
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:201:    return { status: 'error', id: memoryId, title: '', specFolder: '', success: false, error: message };
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:248:      status: 'error',
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:314:    status: 'updated',
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:147:      text: JSON.stringify({ status: 'ok', data }, null, 2),
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:156:      text: JSON.stringify({ status: 'error', error }),
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:122:  if (cachedSummaryDecision.status !== 'accepted') {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:126:  const sessionContinuity = cachedSummaryDecision.status === 'accepted'
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:143:        '- `code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`',
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:121:- Session ID and status
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:109:        '- `code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`',
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/index.ts:6:export { handleCoverageGraphStatus } from './status.js';
.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:4:// Dispatch for code graph MCP tools: scan, query, status, context.
.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:21:  'code_graph_status',
.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:23:  'ccc_status',
.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:47:        status: 'error',
.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:67:    case 'code_graph_status':
.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:71:    case 'ccc_status':
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:97:  if (typeof result.status === 'number' && result.status === 0) {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:104:  const errorText = stderr || stdout || result.error?.message || `exit=${String(result.status)}`;
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:162:          status: 'ok',
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:189:      text: JSON.stringify({ status: 'error', error }),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:5:// Aggregates metrics, graph freshness, and priming status into a
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:39:  status: 'ready' | 'stale' | 'missing';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:175:  // Priming status
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:215:  let status: StructuralBootstrapContract['status'];
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:217:    status = 'ready';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:219:    status = 'stale';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:221:    status = 'missing';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:227:  if (status === 'ready') {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:240:  } else if (status === 'stale') {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:252:  if (status === 'ready') {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:254:  } else if (status === 'stale') {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:263:    status,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:271:      trustState: trustStateFromStructuralStatus(status),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:273:      lastUpdated: status === 'ready' || status === 'stale'
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:5:// readiness, code graph freshness, and priming status.
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:44:  status: SessionStatus;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:86:    if (snapshot.status === 'ok' && snapshot.data) {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:108:  let status: SessionStatus;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:110:    status = 'stale';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:112:    status = 'warning';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:114:    status = 'ok';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:122:  if (structuralContext.status === 'stale') {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:124:  } else if (structuralContext.status === 'missing') {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:142:        content: `status=${status}; priming=${primed ? 'primed' : 'not_primed'}; graph=${graphFreshness}; specFolder=${specFolder ?? 'none'}`,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:158:    summary: `Session health is ${status}; graph freshness is ${graphFreshness}; structural status is ${structuralContext.status}`,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:162:      trustState: trustStateFromStructuralStatus(structuralContext.status),
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:174:    status,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:192:      text: JSON.stringify({ status: 'ok', data: result }, null, 2),
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/status.ts:4:// MCP tool handler for deep_loop_graph_status — reports graph
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/status.ts:27:/** Handle deep_loop_graph_status tool call */
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/status.ts:59:          status: 'ok',
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/status.ts:89:      text: JSON.stringify({ status: 'error', error }),
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:37:  includeTrace?: boolean;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:77:  includeTrace?: boolean;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:351:/** Arguments for ingestion job status requests. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:28:// Feature catalog: Health diagnostics (memory_health)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:222:/** Handle memory_health tool -- returns system health status and diagnostics. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:233:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:251:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:260:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:269:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:278:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:287:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:333:        tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:359:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:363:        status: isEmbeddingModelReady() && database ? 'healthy' : 'degraded',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:380:  const status = isEmbeddingModelReady() && database ? 'healthy' : 'degraded';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:382:  const summary = `Memory system ${status}: ${memoryCount} memories indexed`;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:428:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:431:        status,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:439:        'Re-run memory_health with autoRepair:true and confirmed:true to execute repair actions.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:570:    tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:573:      status,
.opencode/skill/system-spec-kit/mcp_server/scripts/map-ground-truth-ids.ts:15:if (typeof result.status === 'number') {
.opencode/skill/system-spec-kit/mcp_server/scripts/map-ground-truth-ids.ts:16:  process.exit(result.status);
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:347:          status: 'ok',
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:379:          text: JSON.stringify({ status: 'error', error: `Could not resolve blast-radius sources: ${rawSubjects.join(', ')}` }),
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:389:          status: 'ok',
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:411:        text: JSON.stringify({ status: 'error', error: `Could not resolve subject: ${subject}` }),
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:424:          status: 'ok',
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:548:      return { content: [{ type: 'text', text: JSON.stringify({ status: 'error', error: `Unknown operation: ${operation}` }) }] };
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:555:          status: 'ok',
.opencode/skill/system-spec-kit/mcp_server/scripts/reindex-embeddings.ts:14:if (typeof result.status === 'number') {
.opencode/skill/system-spec-kit/mcp_server/scripts/reindex-embeddings.ts:15:  process.exit(result.status);
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:68:  'memory_health',
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:103:    case 'memory_health':         return handleMemoryHealth(parseArgs<HealthArgs>(validateToolArgs('memory_health', args)));
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:57:  status: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:66:/** Type guard: distinguishes IndexResult from RetryErrorResult via the 'status' property */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:71:    typeof (result as { status?: unknown }).status === 'string' &&
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:80:  status?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:315:        status: 'complete',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:418:          status: 'failed',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:424:          result.status === 'success' ||
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:425:          result.status === 'indexed' ||
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:426:          result.status === 'updated' ||
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:427:          result.status === 'unchanged' ||
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:428:          result.status === 'reinforced' ||
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:429:          result.status === 'duplicate' ||
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:430:          result.status === 'deferred';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:435:        if (result.status === 'indexed') {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:438:        } else if (result.status === 'updated') {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:441:        } else if (result.status === 'unchanged') {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:444:        } else if (result.status === 'reinforced') {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:447:        } else if (result.status === 'duplicate') {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:450:        } else if (result.status === 'deferred') {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:456:          if (result.status === 'indexed') {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:458:          } else if (result.status === 'unchanged') {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:463:        if (result.status !== 'unchanged') {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:468:            status: result.status,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:478:          status: 'failed',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:515:        if (!fileResult.specFolder || fileResult.status === 'failed') {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:634:      status: 'complete',
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/index.ts:6:export { handleCodeGraphStatus } from './status.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/index.ts:8:export { handleCccStatus } from './ccc-status.js';
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:52:  'memory_ingest_status',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:58:  'shared_memory_status',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:73:    case 'memory_ingest_status':       return handleMemoryIngestStatus(parseArgs<IngestStatusArgs>(validateToolArgs('memory_ingest_status', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:79:    case 'shared_memory_status':       return handleSharedMemoryStatus(parseArgs<SharedMemoryStatusArgs>(validateToolArgs('shared_memory_status', args)));
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:48:  status: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:69:  embedding_status?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:96:  'file_mtime_ms', 'embedding_status', 'encoding_intent', 'document_type',
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:145: * Parent record: embedding_status='partial', content_text=summary
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:146: * Child records: embedding_status='success'|'pending', parent_id=parent.id
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:162:    return { status: 'warning', id: 0, specFolder: parsed.specFolder ?? '',
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:249:        embedding_status: 'partial',
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:345:          embedding_status: chunkEmbeddingStatus,
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:469:      status: 'error',
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:509:            embedding_status = 'partial',
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:580:        status: 'error',
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:619:      status: 'chunked',
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:637:    status: existing ? 'updated' : 'indexed',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:127:  let statusCounts: ReturnType<typeof vectorIndex.getStatusCounts> = { success: 0, pending: 0, failed: 0, retry: 0, partial: 0 };
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:138:    statusCounts = vectorIndex.getStatusCounts();
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:210:        WHERE embedding_status = 'success'
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:297:  if (statusCounts.pending > 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:298:    hints.push(`${statusCounts.pending} memories pending re-indexing`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:306:      byStatus: statusCounts,
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:8:        status: 'ok',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:48:      text: JSON.stringify({ status: 'ok', data: { state: 'ok', hints: ['health ok'] } }),
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:59:    status: 'ready',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:105:      status: 'stale',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:114:    expect(parsed.data.structuralContext.status).toBe('stale');
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:116:      structuralContext: expect.objectContaining({ status: 'stale' }),
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/README.md:11:| `status.ts` | `code_graph_status` | Report graph health and statistics |
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:50:  'embedding_status',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:126:      embedding_status TEXT DEFAULT 'pending' CHECK(embedding_status IN ('pending', 'success', 'failed', 'retry', 'partial')),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:170:    CREATE INDEX IF NOT EXISTS idx_embedding_status ON memory_index(embedding_status);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:171:    CREATE INDEX IF NOT EXISTS idx_retry_eligible ON memory_index(embedding_status, retry_count, last_retry_at);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:194:      ON memory_index(embedding_status)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:195:      WHERE embedding_status IN ('pending', 'partial', 'retry');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:198:      ON memory_index(spec_folder, embedding_status)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:199:      WHERE embedding_status IN ('pending', 'failed', 'retry');
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:393:  includeTrace: boolean = false,
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:463:    if (includeTrace) {
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:294:      status: 200,
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:295:      statusText: 'OK',
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-reindex.ts:25:            status: 'error',
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-reindex.ts:49:            status: 'ok',
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-reindex.ts:63:            status: 'error',
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-reindex.ts:74:          status: 'error',
.opencode/skill/system-spec-kit/mcp_server/shared-spaces/README.md:42:| `shared_memory_status` | Caller-scoped rollout and membership view; requires exactly one actor identity |
.opencode/skill/system-spec-kit/mcp_server/shared-spaces/README.md:50:`shared_memory_status`, `shared_space_upsert`, and `shared_space_membership_set` rely on actor identity validation in `handlers/shared-memory.ts`. Admin mutations compare the caller against the configured shared-memory admin identity before allowing ownership-sensitive changes.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:660:// Check specific memory status
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:661:const status = checkMemoryArchivalStatus(memoryId);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:662:// status = { isArchived: boolean, shouldArchive: boolean }
.opencode/skill/system-spec-kit/mcp_server/cli.ts:224:      "SELECT COUNT(*) as count FROM memory_index WHERE embedding_status = 'partial'"
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:33:  includeTrace?: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:155:    const profile = (['quick', 'research', 'debug'].includes(args.profile ?? '') ? args.profile : undefined) as ContextArgs['profile'];
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:164:      includeTrace: args.includeTrace,
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:173:          status: 'ok',
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:203:          status: 'error',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:27:  embedding_status?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:57:  'file_mtime_ms', 'embedding_status', 'encoding_intent', 'document_type',
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/status.ts:4:// MCP tool handler for code_graph_status — reports graph health.
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/status.ts:9:/** Handle code_graph_status tool call */
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/status.ts:19:          status: 'ok',
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/status.ts:41:          status: 'error',
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:307:      WHERE embedding_status = 'success'
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-bridge.vitest.ts:146:    expect(result.earlyReturn?.status).toBe('merged');
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts:145:          status: 'error',
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts:159:          status: 'error',
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts:265:      text: JSON.stringify({ status: 'ok', data: scanResult }, null, 2),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1322:    'embedding_status',
.opencode/skill/system-spec-kit/mcp_server/database/README.md:72:- Use MCP tools (`memory_stats`, `memory_health`, `memory_index_scan`) for normal operations.
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-status.ts:4:// MCP tool handler for ccc_status — reports CocoIndex availability and stats.
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-status.ts:9:/** Handle ccc_status tool call */
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-status.ts:29:          status: 'ok',
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-status.ts:49:          status: 'error',
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-status.ts:50:          error: `ccc_status failed: ${err instanceof Error ? err.message : String(err)}`,
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-feedback.ts:24:            status: 'error',
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-feedback.ts:51:          status: 'ok',
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-feedback.ts:65:          status: 'error',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:233:    db!.prepare('UPDATE memory_index SET embedding_status = ? WHERE id = ?').run('success', initialIndex.id);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:242:    expect(parsed.data.status).toBe('duplicate');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:259:    expect(['indexed', 'created', 'updated', 'deferred']).toContain(parsed.data.status);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:291:    expect(result.status).toBeDefined();
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:305:  it('atomicSaveMemory duplicate no-op omits postMutationHooks and reports no-op status', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:314:    db!.prepare('UPDATE memory_index SET embedding_status = ? WHERE id = ?').run('success', initialIndex.id);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:325:    expect(['duplicate', 'unchanged', 'no_change']).toContain(result.status);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:343:    expect(['deferred', 'created', 'indexed', 'updated']).toContain(result.status);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:362:    expect(result.status).toBe('error');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:381:    expect(result.status).toBe('error');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:390:        status: 'rejected',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:410:    expect(parsed.data.status).toBe('rejected');
.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:271:  it('C10c: includeTrace preserves graph contribution details and top-level graph metadata', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:317:  it('C10d: includeTrace=false omits per-result graph trace even when raw results carry graphContribution', async () => {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md:65:- `incremental-index.ts` uses `file_mtime_ms`, `content_hash`, and `embedding_status` together, so unchanged-path fast paths still requeue rows whose embeddings are unhealthy.
.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:4:// Validates recovery payload generation, status classification,
.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:135:// -- buildRecoveryPayload — status field --
.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:137:describe('buildRecoveryPayload() — status classification', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:138:  it('emits status "no_results" when resultCount is 0', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:140:    expect(payload.status).toBe('no_results');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:143:  it('emits status "low_confidence" when avgConfidence < threshold', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:148:    expect(payload.status).toBe('low_confidence');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:151:  it('emits status "partial" when resultCount is between 1 and PARTIAL_RESULT_MIN-1', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:153:    expect(payload.status).toBe('partial');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:156:  it('emits status "partial" when evidence-gap detection marks incomplete coverage', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:162:    expect(payload.status).toBe('partial');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:257:    expect(payload.status).toBe('low_confidence');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:317:    expect(payload).toHaveProperty('status');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:323:  it('status is one of the valid literals', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:326:    expect(validStatuses).toContain(payload.status);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:468:      embedding_status,
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:402: * @param profile       - Profile name ('quick' | 'research' | 'resume' | 'debug')
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:81:  status: MergeAbortStatus;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:256:    const txResult = db.transaction((): { status: 'merged' } | { status: MergeAbortStatus } => {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:260:        return { status: 'predecessor_gone' };
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:264:        return { status: 'predecessor_changed' };
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:276:      const mergedEmbeddingStatus = mergedEmbeddingBuffer ? 'success' : getOptionalString(currentRow, 'embedding_status') ?? 'pending';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:308:        embedding_status: mergedEmbeddingStatus,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:337:        embedding_status: mergedEmbeddingStatus,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:385:      return { status: 'merged' };
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:388:    if (txResult.status !== 'merged') {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:389:      return buildMergeAbortResult(existingMemory, newMemory, txResult.status);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:841:  status: MergeAbortStatus,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:845:    status,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:910:    embedding_status: existingRow.embedding_status,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:391:          status: 'retry_scheduled',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:427:        status: 'escalated',
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:234: * Find claim nodes whose metadata verification_status is not 'verified'.
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:235: * For research: CLAIM nodes with status != 'verified'.
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:243:    // Research: CLAIM nodes where metadata.verification_status != 'verified'
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:264:        const status = n.metadata?.verification_status;
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:265:        return status !== 'verified';
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:70:/** Re-check weekly due status every hour while the server is running. */
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:269:      `Invalid evidence status: expected one of ${EVIDENCE_STATUS_VALUES.join(', ')}`,
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:319:      `Publication methodology status must be one of ${PUBLICATION_METHODOLOGY_STATUSES.join(', ')}.`,
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:408:  structuralContext: { status: string },
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:410:  if (structuralContext.status === 'ready') {
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:418:  if (structuralContext.status === 'stale') {
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:599:  status: 'ready' | 'stale' | 'missing',
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:601:  return status === 'ready' ? 'live' : 'stale';
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator.vitest.ts:224:    expect(result.status).toBe('indexed');
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator.vitest.ts:228:      SELECT id, anchor_id, chunk_label, embedding_status
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator.vitest.ts:236:      embedding_status: string;
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator.vitest.ts:242:    expect(childRows.map((row) => row.embedding_status)).toEqual(['success', 'pending', 'pending']);
.opencode/skill/system-spec-kit/mcp_server/lib/response/README.md:41:- `profile-formatters.ts` exports `applyResponseProfile()` and `applyProfileToEnvelope()` plus the public profile types for `quick`, `research`, `resume`, and `debug`.
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:182:  // claimVerificationRate: claims with status != 'unresolved' / all claims
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:192:        if (meta.verification_status && meta.verification_status !== 'unresolved') {
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:179:  WHERE embedding_status = 'success'
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:83:    WHERE m.embedding_status = 'success'
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:94:    const status = 'status' in result ? result.status : 'unknown';
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:95:    throw new Error(`Expected merge result but received ${result.action}:${status}`);
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:122:        embedding_status TEXT DEFAULT 'pending',
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:526:          embedding_status, created_at, updated_at
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:614:          embedding_status, created_at, updated_at
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:697:      expect(result.status).toBe('predecessor_changed');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:38:  embedding_status: string;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:119:          SELECT file_path, canonical_file_path, file_mtime_ms, content_hash, embedding_status
.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:126:          SELECT file_path, file_mtime_ms, content_hash, embedding_status
.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:174:    // Still check if embedding status is pending
.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:175:    if (stored.embedding_status === 'pending' || stored.embedding_status === 'failed') {
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:37:      embedding_status TEXT DEFAULT 'complete',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:92:        embedding_status TEXT DEFAULT 'pending'
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:511:      expect(result.status).toBe('error');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:534:      if (result.status === 'error') {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:536:        expect(result.status).toBe('error');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:538:        expect(result.status).toBe('reinforced');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:575:        expect(result.status).toBe('error');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:594:      if (result.status === 'error') {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:595:        expect(result).toHaveProperty('status');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:635:        expect(result.status).toBe('reinforced');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:755:      expect(result.status).toBe('updated');
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:397:    for (const toolName of ['shared_space_upsert', 'shared_space_membership_set', 'shared_memory_status']) {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:442:  it('handler requires caller identity for shared_memory_status', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:454:  it('runtime accepts shared_memory_status with one actor identity', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:456:      validateToolArgs('shared_memory_status', {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:479:describe('memory_health schema', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:482:      validateToolInputSchema('memory_health', { reportMode: 'divergent_aliases', limit: 201 }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:488:      validateToolInputSchema('memory_health', { autoRepair: true, confirmed: true }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:493:    const parsed = validateToolArgs('memory_health', { autoRepair: true, confirmed: true });
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:22:    embedding_status: 'completed',
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:120:    expect(row.embedding_status).toBe('completed');
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:53:        embedding_status TEXT DEFAULT 'success',
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:116:  const status = typeof memory.embedding_status === 'string'
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:117:    ? memory.embedding_status
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:122:  return status === 'pending' || status === 'retry' ? status : null;
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:305:        SET embedding_status = 'retry',
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:309:          AND embedding_status = 'pending'
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:318:          AND embedding_status = 'retry'
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:452:    WHERE embedding_status IN ('pending', 'retry')
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:455:      CASE WHEN embedding_status = 'pending' THEN 0 ELSE 1 END,
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:474:  if (row.embedding_status === 'pending') return true;
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:476:  if (row.embedding_status === 'retry' && row.last_retry_at) {
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:480:    // The retry status, so use (retryCount - 1) for the backoff index. First retry (retryCount=1)
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:487:  return row.embedding_status === 'retry';
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:499:    WHERE embedding_status = 'failed'
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:515:      SUM(CASE WHEN embedding_status = 'pending' THEN 1 ELSE 0 END) as pending,
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:516:      SUM(CASE WHEN embedding_status = 'retry' THEN 1 ELSE 0 END) as retry,
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:517:      SUM(CASE WHEN embedding_status = 'failed' THEN 1 ELSE 0 END) as failed,
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:518:      SUM(CASE WHEN embedding_status = 'success' THEN 1 ELSE 0 END) as success,
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:570:      typeof memory.embedding_status === 'string'
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:571:        ? memory.embedding_status
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:641:        SET embedding_status = 'success',
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:696:  const previousStatus = typeof memory.embedding_status === 'string'
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:697:    ? memory.embedding_status
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:707:      SET embedding_status = 'retry',
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:728:  const previousStatus = memory && typeof memory.embedding_status === 'string'
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:729:    ? memory.embedding_status
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:736:    SET embedding_status = 'failed',
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:749:  const previousStatus = memory && typeof memory.embedding_status === 'string'
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:750:    ? memory.embedding_status
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:757:    SET embedding_status = 'retry',
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:762:    WHERE id = ? AND embedding_status = 'failed'
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:20:type EmbeddingStatus = StoredMetadata['embedding_status'];
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:37:      embedding_status TEXT DEFAULT 'pending'
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:38:        CHECK(embedding_status IN ('pending', 'success', 'failed', 'retry', 'partial')),
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:74:  embedding_status?: EmbeddingStatus;
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:78:    INSERT INTO memory_index (spec_folder, file_path, file_mtime_ms, content_hash, embedding_status)
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:86:    opts.embedding_status ?? 'success',
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:205:  it('returns correct row shape {file_path, file_mtime_ms, content_hash, embedding_status}', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:212:      embedding_status: 'success',
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:222:    expect(row.embedding_status).toBe('success');
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:233:      embedding_status: 'pending',
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:267:      INSERT INTO memory_index (spec_folder, file_path, canonical_file_path, file_mtime_ms, content_hash, embedding_status)
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:300:    insertRow(db, { file_path: fakePath, file_mtime_ms: 1700000000000, embedding_status: 'success' });
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:318:    insertRow(db, { file_path: tmpFile, file_mtime_ms: null, embedding_status: 'success' });
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:331:    insertRow(db, { file_path: tmpFile, file_mtime_ms: mtimeMs, embedding_status: 'success' });
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:348:      embedding_status: 'success',
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:366:    insertRow(db, { file_path: tmpFile, file_mtime_ms: stats.mtimeMs, embedding_status: 'pending' });
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:378:    insertRow(db, { file_path: tmpFile, file_mtime_ms: stats.mtimeMs, embedding_status: 'failed' });
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:389:    insertRow(db, { file_path: tmpFile, file_mtime_ms: 1000000000000, embedding_status: 'success' });
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:443:      INSERT INTO memory_index (spec_folder, file_path, canonical_file_path, file_mtime_ms, content_hash, embedding_status)
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:497:    insertRow(db, { file_path: unchangedFile, file_mtime_ms: unchangedStats.mtimeMs, embedding_status: 'success' });
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:498:    insertRow(db, { file_path: modifiedFile, file_mtime_ms: 1000000000000, embedding_status: 'success' });
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:499:    insertRow(db, { file_path: deletedPath, file_mtime_ms: 1700000000000, embedding_status: 'success' });
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:531:    insertRow(db, { file_path: tmpFile, file_mtime_ms: null, embedding_status: 'success' });
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:544:    insertRow(db, { file_path: liveFile, file_mtime_ms: liveStats.mtimeMs, embedding_status: 'success' });
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:547:    insertRow(db, { file_path: stalePath, file_mtime_ms: 1700000000000, embedding_status: 'success' });
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:572:      INSERT INTO memory_index (spec_folder, file_path, canonical_file_path, file_mtime_ms, content_hash, embedding_status)
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:591:    const staleId = insertRow(db, { file_path: stalePath, file_mtime_ms: 1700000000000, embedding_status: 'success' });
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:595:    const liveId = insertRow(db, { file_path: liveFile, file_mtime_ms: liveStats.mtimeMs, embedding_status: 'success' });
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:620:      INSERT INTO memory_index (spec_folder, file_path, canonical_file_path, file_mtime_ms, content_hash, embedding_status)
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:688:    insertRow(db, { file_path: successFile, file_mtime_ms: successMeta.mtime, content_hash: 'hash-ok', embedding_status: 'success' });
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:705:    insertRow(db, { file_path: failedFile, file_mtime_ms: failedMeta.mtime, content_hash: 'hash-fail', embedding_status: 'failed' });
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:719:    insertRow(db, { file_path: successFile, file_mtime_ms: 0, embedding_status: 'success' });
.opencode/skill/system-spec-kit/mcp_server/tests/cli.vitest.ts:62:      (spec_folder, file_path, title, content_hash, importance_tier, created_at, updated_at, embedding_status)
.opencode/skill/system-spec-kit/mcp_server/tests/cli.vitest.ts:114:    expect(result.status).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/cli.vitest.ts:126:    expect(initResult.status).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/cli.vitest.ts:140:    expect(deleteResult.status).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/cli.vitest.ts:180:    expect(result.status).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/cli.vitest.ts:191:    expect(initResult.status).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/cli.vitest.ts:197:    expect(downgradeResult.status).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/cli.vitest.ts:209:    expect(unknownCommand.status).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/cli.vitest.ts:216:    expect(missingTier.status).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/cli.vitest.ts:223:    expect(missingConfirm.status).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/cli.vitest.ts:240:    expect(result.status).not.toBe(0);
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:21:  includeTrace?: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:69:  const nodeLimit = args.profile === 'quick' ? 10 : args.profile === 'debug' ? 30 : 20;
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:130:      embedding_status TEXT DEFAULT 'pending'
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:818:  it('reinforceExistingMemory: error status for missing ID', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:832:    expect(result.status).toBeDefined();
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-ingest-edge.vitest.ts:137:  it('T005a-I5: status with missing jobId throws', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-ingest-edge.vitest.ts:143:  it('T005a-I6: status with non-string jobId throws', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-ingest-edge.vitest.ts:149:  it('T005a-I6b: status returns E404 payload when job is unknown', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:631:  it('returns an internal error when shared-memory status lookup throws unexpectedly', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:643:    expect(envelope.data.error).toContain('Shared memory status failed');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:647:  it('scopes shared-memory status to the authenticated caller identity', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:649:      spaceId: 'space-status-owner',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:656:      spaceId: 'space-status-other',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:663:      spaceId: 'space-status-other',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:678:    expect(envelope.data.allowedSharedSpaceIds).toEqual(['space-status-other']);
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:685:  it('rejects shared-memory status when caller identity is omitted', async () => {
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
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:336:      'Check memory_health() for system status',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:340:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:345:      'Check embedding provider status with memory_health()',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:350:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:435:      'Check checkpoint_list() for checkpoint status',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:447:      'Run memory_health() to check system status'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:450:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:487:      'Check memory_health() for recovery options'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:490:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:529:      'Run memory_health() to check database status'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:532:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:590:      'Check memory_causal_stats() for graph status'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:659:      'Check memory_health() for system status',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:663:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:677:    'Run memory_health() for diagnostics',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:682:  toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:699:        'Check embedding provider status: memory_health()',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:734:        'Run memory_health() to verify database integrity'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:737:      toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:757:        'Check memory_health() for embedding provider status'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:760:      toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts:6:// query, and status handlers.
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts:343: * Non-mutating freshness check for status display.
.opencode/skill/system-spec-kit/mcp_server/tests/create-record-lineage-regressions.vitest.ts:29:      embedding_status,
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:330:| `missing_methodology` | The row is missing a supported publication methodology status. |
.opencode/skill/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts:28:type EmbeddingStatus = RetryQueueItem['embedding_status'];
.opencode/skill/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts:225:      status: EmbeddingStatus = 'pending',
.opencode/skill/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts:236:             embedding_status, retry_count, last_retry_at, failure_reason,
.opencode/skill/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts:241:          now, now, status, retryCount, lastRetryAt, failureReason,
.opencode/skill/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts:247:          SET embedding_status = ?, retry_count = ?, last_retry_at = ?,
.opencode/skill/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts:250:        `).run(status, retryCount, lastRetryAt, failureReason, now, id);
.opencode/skill/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts:305:      it('T25: getRetryStats() counts by status correctly', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts:427:      it('T37: markAsFailed() sets status and failure_reason', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts:433:        const row = activeDb.prepare('SELECT embedding_status, failure_reason FROM memory_index WHERE id = ?').get(4001) as {
.opencode/skill/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts:434:          embedding_status: string;
.opencode/skill/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts:437:        expect(row.embedding_status).toBe('failed');
.opencode/skill/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts:469:        const row = activeDb.prepare('SELECT embedding_status, retry_count, last_retry_at, failure_reason FROM memory_index WHERE id = ?').get(5001) as {
.opencode/skill/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts:470:          embedding_status: string;
.opencode/skill/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts:475:        expect(row.embedding_status).toBe('retry');
.opencode/skill/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts:545:          'SELECT embedding_status, retry_count, failure_reason FROM memory_index WHERE id = ?'
.opencode/skill/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts:547:          embedding_status: string;
.opencode/skill/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts:553:        expect(row?.embedding_status).toBe('retry');
.opencode/skill/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts:568:          'SELECT embedding_status, failure_reason FROM memory_index WHERE id = ?'
.opencode/skill/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts:570:          embedding_status: string;
.opencode/skill/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts:575:        expect(row?.embedding_status).toBe('failed');
.opencode/skill/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts:661:        const row1 = activeDb.prepare('SELECT embedding_status FROM memory_index WHERE id = ?').get(8010) as {
.opencode/skill/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts:662:          embedding_status: string;
.opencode/skill/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts:664:        expect(row1.embedding_status).toBe('retry');
.opencode/skill/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts:667:        const row2 = activeDb.prepare('SELECT embedding_status FROM memory_index WHERE id = ?').get(8010) as {
.opencode/skill/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts:668:          embedding_status: string;
.opencode/skill/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts:670:        expect(row2.embedding_status).toBe('failed');
.opencode/skill/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts:673:      it('T53: getRetryQueue() excludes success and failed statuses', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts:685:      it('T54: getRetryStats().total >= sum of individual statuses', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts:696:      it('T55: getRetryQueue() rows have id, file_path, embedding_status', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts:704:          expect(['pending', 'retry']).toContain(item.embedding_status);
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:29:  doctor: {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:31:    surface: 'memory_health';
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:86:    doctor: {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:88:      surface: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:100:      recommendedAction: 'Use memory_health({ autoRepair: true, confirmed: true }) for bounded repair workflows and transparent partial-success reporting.',
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:257:      console.warn(`[hyde] LLM endpoint returned HTTP ${response.status}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:49:  embedding_status?: string;
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:209:      (spec_folder, file_path, title, content_hash, importance_tier, created_at, updated_at, embedding_status)
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:285:      (spec_folder, file_path, title, content_hash, importance_tier, created_at, updated_at, embedding_status)
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:328:      (spec_folder, file_path, title, content_hash, importance_tier, created_at, updated_at, embedding_status)
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:376:      (spec_folder, file_path, title, content_hash, importance_tier, created_at, updated_at, embedding_status)
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:460:      (id, spec_folder, file_path, title, created_at, updated_at, embedding_status, content_text, importance_tier)
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:476:      (id, spec_folder, file_path, anchor_id, title, created_at, updated_at, embedding_status, content_text, parent_id, chunk_index, chunk_label, importance_tier)
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:544:    expect(helpResult.status).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:552:    expect(statsResult.status).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/embeddings.vitest.ts:48:function mockFetch(status: number, body: Record<string, unknown>): void {
.opencode/skill/system-spec-kit/mcp_server/tests/embeddings.vitest.ts:50:    ok: status >= 200 && status < 300,
.opencode/skill/system-spec-kit/mcp_server/tests/embeddings.vitest.ts:51:    status,
.opencode/skill/system-spec-kit/mcp_server/tests/embeddings.vitest.ts:52:    statusText: `HTTP ${status}`,
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:861:        embedding_status: 'completed',
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:904:        embedding_status: 'completed',
.opencode/skill/system-spec-kit/mcp_server/tests/empty-result-recovery.vitest.ts:23:  status: (typeof VALID_RECOVERY_STATUSES)[number];
.opencode/skill/system-spec-kit/mcp_server/tests/empty-result-recovery.vitest.ts:122:        status: expect.any(String),
.opencode/skill/system-spec-kit/mcp_server/tests/empty-result-recovery.vitest.ts:129:    expect(VALID_RECOVERY_STATUSES).toContain(envelope.data.recovery?.status);
.opencode/skill/system-spec-kit/mcp_server/tests/empty-result-recovery.vitest.ts:163:    expect(envelope.data.recovery?.status).toBe('low_confidence');
.opencode/skill/system-spec-kit/mcp_server/tests/empty-result-recovery.vitest.ts:188:    expect(envelope.data.recovery?.status).toBe('partial');
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:345:      "query": "checklist verification status for T006 eval metrics implementation",
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:49:  status: string;
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:85:  'status',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:152:          if (normalizedSql === "DELETE FROM session_state WHERE status IN ('completed', 'interrupted') AND updated_at < ?") {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:156:              if ((row.status === 'completed' || row.status === 'interrupted') && row.updated_at < cutoffIso) {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:196:              status: 'active',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:213:          if (normalizedSql === "UPDATE session_state SET status = 'completed', updated_at = ? WHERE session_id = ?") {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:219:            row.status = 'completed';
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:224:          if (normalizedSql === "UPDATE session_state SET status = 'interrupted', updated_at = ? WHERE status = 'active'") {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:228:              if (row.status === 'active') {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:229:                row.status = 'interrupted';
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:237:          if (normalizedSql === "UPDATE session_state SET status = 'active', updated_at = ? WHERE session_id = ?") {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:243:            row.status = 'active';
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:265:          if (normalizedSql === 'SELECT session_id, status, spec_folder, current_task, last_action, context_summary, pending_work, state_data, tenant_id, user_id, agent_id, created_at, updated_at FROM session_state WHERE session_id = ?') {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:290:          if (normalizedSql === 'SELECT session_id, spec_folder, current_task, last_action, context_summary, pending_work, updated_at, tenant_id, user_id, agent_id FROM session_state WHERE status = \'interrupted\' ORDER BY updated_at DESC') {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:292:              .filter((row) => row.status === 'interrupted')
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:402:      expect(database.execStatements.some((sql) => sql.includes('idx_session_state_status'))).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:425:        status: 'active',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:446:      expect(database.getSessionState('active-a')?.status).toBe('interrupted');
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:447:      expect(database.getSessionState('active-b')?.status).toBe('interrupted');
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:458:      expect(database.getSessionState('active-only')?.status).toBe('interrupted');
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:459:      expect(database.getSessionState('completed-only')?.status).toBe('completed');
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:491:      expect(database.getSessionState('recover-me')?.status).toBe('active');
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:583:        'status',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:590:    it('should have CHECK constraint on status column', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:595:      expect(createTableSql).toContain("CHECK(status IN ('active', 'completed', 'interrupted'))");
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:657:      expect(database.getSessionState('complete-transition')?.status).toBe('completed');
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:669:      expect(database.getSessionState('interrupt-transition')?.status).toBe('interrupted');
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:681:      expect(database.getSessionState('interrupt-active')?.status).toBe('interrupted');
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:682:      expect(database.getSessionState('interrupt-completed')?.status).toBe('completed');
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:706:        status: 'interrupted',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:759:      expect(result.state?.status).toBe('completed');
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:774:      expect(database.getSessionState('flag-reactivate')?.status).toBe('active');
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:68:    tools: ['memory_list', 'memory_stats', 'memory_health', 'session_health']
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:86:    tools: ['checkpoint_create', 'checkpoint_list', 'checkpoint_restore', 'checkpoint_delete', 'shared_memory_enable', 'shared_memory_status', 'shared_space_upsert', 'shared_space_membership_set']
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:115:    tools: ['memory_index_scan', 'memory_get_learning_history', 'memory_ingest_start', 'memory_ingest_status', 'memory_ingest_cancel', 'code_graph_scan', 'code_graph_status', 'ccc_status', 'ccc_reindex', 'ccc_feedback']
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:12:  { tool: 'memory_health', handler: 'handleMemoryHealth', layer: 'L3' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:38:  { camel: 'handleMemoryHealth', snake: 'handle_memory_health' },
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:45:      embedding_status TEXT DEFAULT 'success',
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:64: * Insert a memory record as if it was already indexed (embedding_status='success').
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:89:      embedding_status,
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:180:      expect(result!.status).toBe('duplicate');
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:208:      const content = 'Content with a pending embedding status.';
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:211:      // Insert with embedding_status='pending' — should NOT be matched
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:213:        INSERT INTO memory_index (spec_folder, file_path, content_hash, embedding_status)
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:283:      expect(result?.status).toBe('duplicate');
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:305:    it('T054-6c: Invalid terminal status complete is excluded from dedup', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:306:      const content = 'Legacy complete status should not dedup.';
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:307:      const folder = 'specs/invalid-complete-status';
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:311:        '/specs/invalid-complete-status/memory/legacy.md',
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:330:          spec_folder, file_path, canonical_file_path, title, content_hash, content_text, embedding_status, parent_id
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:414:          spec_folder, file_path, canonical_file_path, title, content_hash, embedding_status, parent_id
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:435:          spec_folder, file_path, canonical_file_path, title, content_hash, embedding_status, parent_id
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:448:      expect(result?.status).toBe('unchanged');
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:457:          spec_folder, file_path, canonical_file_path, title, content_hash, embedding_status, trigger_phrases, quality_score, quality_flags, parent_id
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:487:          spec_folder, file_path, canonical_file_path, title, content_hash, embedding_status, trigger_phrases, quality_score, quality_flags, parent_id
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:519:          spec_folder, file_path, canonical_file_path, title, content_hash, embedding_status, parent_id
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:546:          spec_folder, file_path, canonical_file_path, title, content_hash, embedding_status, parent_id
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:563:      expect(result?.status).toBe('duplicate');
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:573:          spec_folder, file_path, canonical_file_path, title, content_hash, embedding_status, parent_id
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:598:          spec_folder, file_path, canonical_file_path, title, content_hash, embedding_status, tenant_id, parent_id
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:627:          spec_folder, file_path, canonical_file_path, title, content_hash, embedding_status, tenant_id, parent_id
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:710:      expect(result).toHaveProperty('status', 'duplicate');
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:722:        INSERT INTO memory_index (spec_folder, file_path, content_hash, embedding_status)
.opencode/skill/system-spec-kit/mcp_server/tests/validation-metadata.vitest.ts:10:// T10-T12 : extractValidationMetadata — completion status markers
.opencode/skill/system-spec-kit/mcp_server/tests/validation-metadata.vitest.ts:144:   T10-T12: Completion status from content markers
.opencode/skill/system-spec-kit/mcp_server/tests/validation-metadata.vitest.ts:147:describe('extractValidationMetadata — completion status', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/hooks-ux-feedback.vitest.ts:76:            data: { status: 'success' },
.opencode/skill/system-spec-kit/mcp_server/tests/eval-the-eval.vitest.ts:58:  status: 'PASS' | 'FAIL';
.opencode/skill/system-spec-kit/mcp_server/tests/eval-the-eval.vitest.ts:71:  const status: 'PASS' | 'FAIL' = delta <= tolerance ? 'PASS' : 'FAIL';
.opencode/skill/system-spec-kit/mcp_server/tests/eval-the-eval.vitest.ts:72:  discrepancyLog.push({ scenario, metric, expected, computed, delta, status });
.opencode/skill/system-spec-kit/mcp_server/tests/eval-the-eval.vitest.ts:408:      const status    = r.status.padEnd(11);
.opencode/skill/system-spec-kit/mcp_server/tests/eval-the-eval.vitest.ts:409:      return `║  ${scenario}  │ ${metric} │ ${expected} │ ${computed} │ ${delta} │  ${status}  ║`;
.opencode/skill/system-spec-kit/mcp_server/tests/eval-the-eval.vitest.ts:412:    const failures = discrepancyLog.filter(r => r.status === 'FAIL').length;
.opencode/skill/system-spec-kit/mcp_server/tests/eval-the-eval.vitest.ts:413:    const passes   = discrepancyLog.filter(r => r.status === 'PASS').length;
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-validation.vitest.ts:75:  status?: number | null;
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-validation.vitest.ts:131:      exitCode: failure.status ?? 2,
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-validation.vitest.ts:152:      exitCode: failure.status ?? 2,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:6:// Index, update, delete, and status/confidence updates.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:218:    const embedding_status = sqlite_vec ? 'success' : 'pending';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:224:        embedding_generated_at, embedding_status, encoding_intent, document_type, spec_level,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:229:      importanceWeight, now, now, embeddingsProvider.getModelName(), now, embedding_status,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:301:            embedding_status = 'pending',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:322:        importance_weight, created_at, updated_at, embedding_status,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:437:      updates.push('embedding_status = ?');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:469:      database.prepare('UPDATE memory_index SET embedding_status = ? WHERE id = ?').run('success', id);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:718:// Valid statuses: 'pending', 'success', 'failed', 'retry', 'partial'
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:720: * Updates the embedding status for a memory.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:722: * @param status - The new embedding status.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:723: * @returns True when the status was updated.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:725:export function update_embedding_status(
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:727:  status: string,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:730:  const valid_statuses = ['pending', 'success', 'failed', 'retry', 'partial'];
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:731:  if (!valid_statuses.includes(status)) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:732:    console.warn(`[vector-index] Invalid embedding status: ${status}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:739:      SET embedding_status = ?, updated_at = datetime('now')
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:741:    `).run(status, id);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:745:    console.warn(`[vector-index] Failed to update embedding status for ${id}: ${get_error_message(error)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:787:export { update_embedding_status as updateEmbeddingStatus };
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:82:      embedding_status TEXT DEFAULT 'pending',
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:373:            embedding_status TEXT DEFAULT 'pending',
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:431:            embedding_status, created_at, updated_at
.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:47:function mockFetch(status: number, body: unknown, shouldThrow = false): void {
.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:51:      status,
.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:52:      statusText: status === 200 ? 'OK' : 'Internal Server Error',
.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:448:          status: 200,
.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:449:          statusText: 'OK',
.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:472:          status: 200,
.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:473:          statusText: 'OK',
.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:500:      const status = crossEncoder.getRerankerStatus();
.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:501:      expect(status.latency.count).toBeGreaterThanOrEqual(1);
.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:502:      expect(status.latency.avg).toBeGreaterThanOrEqual(0);
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:434:  it('T058: DEFAULT_HINT actions include memory_health() reference (REQ-009)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:437:      a.includes('memory_health()')
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:446:  it('T060: DEFAULT_HINT has toolTip for memory_health()', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:447:    expect(DEFAULT_HINT.toolTip).toBe('memory_health()');
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:50:  'check status',
.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:11:      text: JSON.stringify({ status: 'ok', data: { memories: [] } }),
.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:61:    expect(parsed.status).toBe('ok');
.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:68:    expect(parsed.data.graphOps.doctor.surface).toBe('memory_health');
.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:88:    expect(parsed.data.codeGraph.status).toBe('empty');
.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:91:  it('reports stale graph status in the startup payload when freshness detection says stale', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:97:    expect(parsed.data.codeGraph.status).toBe('stale');
.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:99:    expect(parsed.data.payloadContract.sections.find((section: { key: string }) => section.key === 'code-graph-status')?.content)
.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:100:      .toContain('status=stale');
.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:117:    expect(parsed.data.codeGraph.status).toBe('error');
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-scan.vitest.ts:83:      status: string;
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-scan.vitest.ts:97:    expect(payload.status).toBe('ok');
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-scan.vitest.ts:138:      status: string;
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-scan.vitest.ts:146:    expect(payload.status).toBe('ok');
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:215:      WHERE embedding_status = 'success'
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:95:        embedding_status TEXT DEFAULT 'success',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:70:    it('should report enabled status', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:14://   "status": "no_results" | "low_confidence" | "partial",
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:33:  status: RecoveryStatus;
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:65: * Classify retrieval status based on result count and confidence signals.
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:84:function classifyReason(ctx: RecoveryContext, status: RecoveryStatus): RecoveryReason {
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:86:  if (ctx.hasSpecFolderFilter && status === 'no_results') {
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:150: * Map status + reason to a recommended next action.
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:152:function recommendAction(status: RecoveryStatus, reason: RecoveryReason): RecoveryAction {
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:153:  if (status === 'no_results') {
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:158:  if (status === 'low_confidence') {
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:193:  const status = classifyStatus(ctx);
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:194:  if (status !== 'no_results' && status !== 'low_confidence') return [];
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:273:  const status = classifyStatus(ctx);
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:274:  const reason = classifyReason(ctx, status);
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:276:  const recommendedAction = recommendAction(status, reason);
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:279:    status,
.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:69:  /** Completion status derived from content markers ('complete' | 'partial' | 'unknown'). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:213:    // Completion status.
.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:241:        `[llm-reformulation] LLM endpoint returned HTTP ${response.status}`,
.opencode/skill/system-spec-kit/mcp_server/tests/hooks-mutation-wiring.vitest.ts:96:  it('captures thrown hook error details in errors and marks the failing hook status false', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:53:      embedding_status TEXT DEFAULT 'success',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-crud.vitest.ts:77:        'handle_memory_health',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-crud.vitest.ts:235:    it('T519-H1: Health handler returns status', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-crud.vitest.ts:239:      expect(typeof parsed.data?.status).toBe('string');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:197:        status: 'indexed',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:292:        status: 'success',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:650:      expect(result.status).toBe('indexed');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:673:      expect(result.status).toBe('indexed');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:727:      expect(result.status).toBe('indexed');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:743:        checkExistingRowMock: vi.fn(() => buildIndexResult({ status: 'indexed', id: 201 })),
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:776:      expect(result.status).toBe('error');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:786:    it('treats indexMemoryFile status=error as failure and retries once', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:790:            status: 'error',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:792:            message: 'forced error status',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:793:            error: 'forced error status',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:796:        .mockReturnValueOnce(buildIndexResult({ status: 'indexed', id: 301 }));
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:802:      const filePath = createAtomicSaveTargetPath('status-error-then-success.md');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:804:        { file_path: filePath, content: '# status error then success' },
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:812:        fs.readdirSync(path.dirname(filePath)).some((entry) => entry.includes('status-error-then-success_pending.md'))
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:816:    it('treats indexMemoryFile status=rejected as non-retry rollback outcome', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:819:          status: 'rejected',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:830:      const filePath = createAtomicSaveTargetPath('status-rejected.md');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:837:      expect(result.status).toBe('rejected');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:842:        fs.readdirSync(path.dirname(filePath)).some((entry) => entry.includes('status-rejected_pending.md'))
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:850:          status: 'rejected',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:881:      expect(result.status).toBe('rejected');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:889:          status: 'rejected',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:919:      expect(result.status).toBe('rejected');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:940:            status: 'success',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:956:      expect(result.status).toBe('rejected');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:971:            status: 'success',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:985:            earlyReturn: buildIndexResult({ status: 'indexed', id: 401 }),
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:993:      expect(result.status).toBe('indexed');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1005:        status: 'indexed',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1020:            status: 'success',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1039:      expect(result.status).toBe('rejected');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1048:        earlyReturn: buildIndexResult({ status: 'merged', id: 555 }),
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1054:        status: 'indexed',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1064:      expect(result.status).toBe('merged');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1075:        status: 'indexed',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1093:            status: 'success',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1135:      expect(result.status).toBe('indexed');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1145:      const checkContentHashDedupMock = vi.fn(() => buildIndexResult({ status: 'duplicate', id: 779 }));
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1155:            status: 'success',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1207:            status: 'success',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1283:            status: 'success',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1353:            status: 'success',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1377:      expect(result.status).toBe('rejected');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1394:            status: 'success',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1403:            earlyReturn: buildIndexResult({ status: 'reinforced', id: 902 }),
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1422:      expect(result.status).toBe('reinforced');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1427:      const checkExistingRowMock = vi.fn(() => buildIndexResult({ status: 'indexed', id: 911 }));
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1454:      expect(result.status).toBe('error');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1482:          status: 'success',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1582:      expect(result.status).toBe('rejected');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1622:      expect(result.status).toBe('rejected');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1628:      const checkExistingRowMock = vi.fn(() => buildIndexResult({ status: 'indexed', id: 1001 }));
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1661:      expect(payload?.data?.status).toBe('dry_run');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1669:      const checkExistingRowMock = vi.fn(() => buildIndexResult({ status: 'indexed', id: 999 }));
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1684:      expect(payload?.data?.status).toBe('dry_run');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1767:          status: 'error',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1814:      expect(result.status).toBe('indexed');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1845:              status: 'indexed',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1867:      expect(result.status).toBe('indexed');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1889:              status: 'error',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1911:      expect(result.status).toBe('error');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1948:          status: 'indexed',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:2012:      expect(result.status).toBe('error');
.opencode/skill/system-spec-kit/mcp_server/tests/safety.vitest.ts:12:type EmbeddingStatus = MemoryDbRow['embedding_status'];
.opencode/skill/system-spec-kit/mcp_server/tests/safety.vitest.ts:101:          embedding_status TEXT DEFAULT 'pending'
.opencode/skill/system-spec-kit/mcp_server/tests/safety.vitest.ts:102:            CHECK(embedding_status IN ('pending', 'success', 'failed', 'retry', 'partial')),
.opencode/skill/system-spec-kit/mcp_server/tests/safety.vitest.ts:136:      embedding_status?: EmbeddingStatus;
.opencode/skill/system-spec-kit/mcp_server/tests/safety.vitest.ts:140:        INSERT INTO memory_index (spec_folder, file_path, file_mtime_ms, embedding_status)
.opencode/skill/system-spec-kit/mcp_server/tests/safety.vitest.ts:147:        opts.embedding_status ?? 'success',
.opencode/skill/system-spec-kit/mcp_server/tests/safety.vitest.ts:168:      insertRow(db, { file_path: tmpFile, file_mtime_ms: 0, embedding_status: 'success' });
.opencode/skill/system-spec-kit/mcp_server/tests/safety.vitest.ts:191:      insertRow(db, { file_path: successFile, file_mtime_ms: 1000000000000, embedding_status: 'success' });
.opencode/skill/system-spec-kit/mcp_server/tests/safety.vitest.ts:192:      insertRow(db, { file_path: failFile, file_mtime_ms: 1000000000000, embedding_status: 'success' });
.opencode/skill/system-spec-kit/mcp_server/tests/safety.vitest.ts:214:      insertRow(db, { file_path: file, file_mtime_ms: 1000000000000, embedding_status: 'success' });
.opencode/skill/system-spec-kit/mcp_server/tests/safety.vitest.ts:230:      insertRow(db, { file_path: file, file_mtime_ms: stats.mtimeMs, embedding_status: 'pending' });
.opencode/skill/system-spec-kit/mcp_server/tests/safety.vitest.ts:245:      insertRow(db, { file_path: file, file_mtime_ms: stats.mtimeMs, embedding_status: 'failed' });
.opencode/skill/system-spec-kit/mcp_server/tests/safety.vitest.ts:263:        insertRow(db, { file_path: f, file_mtime_ms: 1000000000000, embedding_status: 'success' });
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:315:  vi.mocked(vectorIndex.updateEmbeddingStatus).mockImplementation((id: number, status: string) => { calls.updateEmbeddingStatus.push({ id, status }); });
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:368:  statusCounts?: any;
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:378:    statusCounts = { success: 3, pending: 1, failed: 1 },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:397:        if (sql.includes('embedding_status')) {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:411:  vi.mocked(vectorIndex.getStatusCounts).mockImplementation(() => statusCounts);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:857:    const hasPending = (calls.updateEmbeddingStatus.length > 0 && calls.updateEmbeddingStatus[0].status === 'pending') ||
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:983:  it('EXT-S2: Stats includes status breakdown', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:985:    installStatsMocks({ statusCounts: { success: 10, pending: 2, failed: 1 } });
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1009:    installStatsMocks({ statusCounts: { success: 5, pending: 3, failed: 0 } });
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1119:  it('EXT-H1: Healthy system returns status=healthy', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1125:    expect(parsed?.data?.status).toBe('healthy');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1128:  it('EXT-H2: No DB returns status=degraded', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1134:    expect(parsed?.data?.status).toBe('degraded');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1143:    expect(parsed?.data?.status).toBe('degraded');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1723:    expect(parsed?.data?.status).toBe('degraded');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1734:    expect(parsed?.data?.status).toBe('healthy');
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:677:              if (result.status === 'fulfilled') return result.value;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:741:            if (result.status === 'fulfilled') return result.value;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1117:            if (result.status === 'fulfilled') return result.value;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:125:    embedding_status,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:408:// Added 'partial' embedding_status for deferred indexing (REQ-031, T096)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:581:      // V6 -> v7: Add 'partial' embedding_status for deferred indexing (REQ-031, T096)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:585:          ON memory_index(embedding_status)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:586:          WHERE embedding_status IN ('pending', 'partial', 'retry')
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:596:          ON memory_index(spec_folder, embedding_status, importance_tier)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:597:          WHERE embedding_status IN ('pending', 'partial')
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1136:       ON memory_index(embedding_status, id)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1137:       WHERE embedding_status = 'success'
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2071:      ON memory_index(embedding_status, id)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2072:      WHERE embedding_status = 'success'
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2312:      embedding_status TEXT DEFAULT 'pending' CHECK(embedding_status IN ('pending', 'success', 'failed', 'retry', 'partial')),
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2428:    CREATE INDEX idx_embedding_status ON memory_index(embedding_status);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2429:    CREATE INDEX idx_retry_eligible ON memory_index(embedding_status, retry_count, last_retry_at)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2440:      ON memory_index(embedding_status, id)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2441:      WHERE embedding_status = 'success'
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2457:      embedding_status,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-backfill.vitest.ts:33:      embedding_status,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:56:        embedding_status TEXT DEFAULT 'success',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:564:        SUM(CASE WHEN embedding_status = 'success' THEN 1 ELSE 0 END) as complete,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:565:        SUM(CASE WHEN embedding_status = 'pending' THEN 1 ELSE 0 END) as pending,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:566:        SUM(CASE WHEN embedding_status = 'failed' THEN 1 ELSE 0 END) as failed
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:636:        AND m.embedding_status = 'success'
.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:164:    expect(api.LAYER_DEFINITIONS.L5.tools).toContain('shared_memory_status');
.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:165:    expect(api.TOOL_LAYER_MAP.shared_memory_status).toBe('L5');
.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:166:    expect(api.getLayerForTool('shared_memory_status')).toBe('L5');
.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:167:    expect(api.getLayerTokenBudget('shared_memory_status')).toBe(1000);
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:38:  embedding_status?: string;
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:122:      embedding_status TEXT DEFAULT 'success'
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:126:    INSERT INTO memory_index (id, spec_folder, file_path, title, trigger_phrases, importance_weight, embedding_status)
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:130:    insert.run(r.id, r.spec_folder, r.file_path, r.title, r.trigger_phrases, r.importance_weight, r.embedding_status ?? 'success');
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:354:    it('3.3.6 skips non-success embedding_status', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:358:        { id: 1, spec_folder: 's', file_path: '/a.md', title: 'T', trigger_phrases: '["alpha"]', importance_weight: 0.5, embedding_status: 'success' },
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:359:        { id: 2, spec_folder: 's', file_path: '/b.md', title: 'T', trigger_phrases: '["beta"]', importance_weight: 0.5, embedding_status: 'pending' },
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:43:  it('returns ready status with highlights when graph is fresh', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:55:    expect(contract.status).toBe('ready');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:68:  it('returns stale status when graph scan is old', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:82:    expect(contract.status).toBe('stale');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:90:  it('returns missing status when graph is empty', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:105:    expect(contract.status).toBe('missing');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:113:  it('returns missing status when graph DB throws', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:125:    expect(contract.status).toBe('missing');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-health-edge.vitest.ts:111:    expect(typeof parsed.data.status).toBe('string');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-health-edge.vitest.ts:130:        'Re-run memory_health with autoRepair:true and confirmed:true to execute repair actions.',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-ingest.vitest.ts:79:    expect(typeof handler.handle_memory_ingest_status).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-ingest.vitest.ts:179:  it('status returns E404 payload when job is missing', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-ingest.vitest.ts:189:  it('status returns mapped job payload when found', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-ingest.vitest.ts:242:  it('status emits optional lifecycle telemetry when extended telemetry is enabled', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-ingest.vitest.ts:281:  it('status degrades safely when forecast derivation throws', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts:89:    const content = `---\ntitle: My Spec\nstatus: active\n---\n# Real Title Here\n\nBody content.`;
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:69:      getCachedSessionSummaryDecision: vi.fn(() => ({ status: 'rejected' })),
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:229:            status: 'ok',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:267:          text: JSON.stringify({ status: 'ok', data: { state: 'ok', hints: ['health ok'] } }),
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:278:        status: 'ready',
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:55: * Consumers must not reuse this as parser provenance, evidence status,
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:26:  estimateCompletionPercent: (observations: Array<{ title: string }>, messageCount: number, toolCounts: Record<string, number>, status: string) => number;
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:46:    const status = determineSessionStatus('Build failing due to missing dependency', [], 5);
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:47:    expect(status).toBe('BLOCKED');
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:52:    const status = determineSessionStatus('None', [], 5);
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:53:    expect(status).toBe('IN_PROGRESS');
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:62:    const status = determineSessionStatus('None', observations, 10);
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:63:    expect(status).toBe('COMPLETED');
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:68:    const status = determineSessionStatus('None', [], 2);
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:69:    expect(status).toBe('IN_PROGRESS');
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:74:  it('T124-05: Returns 100 for COMPLETED status', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:80:  it('T124-06: Returns capped value for BLOCKED status', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:204:  it('T018-03: Shows Active as status', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:24:        memory_health: 1000,
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:455:| v7      | `partial` embedding_status + `idx_embedding_pending` + `idx_fts_fallback` (REQ-031, T096) |
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:292:    throw new Error(`Voyage rerank failed: ${response.status} ${response.statusText}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:334:    throw new Error(`Cohere rerank failed: ${response.status} ${response.statusText}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:370:    throw new Error(`Local rerank failed: ${response.status} ${response.statusText}`);
.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:111:    (result): result is PromiseRejectedResult => result.status === 'rejected'
.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:124:    (result): result is PromiseRejectedResult => result.status === 'rejected'
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-stats-edge.vitest.ts:31:    INSERT INTO memory_index (spec_folder, file_path, title, created_at, updated_at, embedding_status)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:113: * Gets memory counts grouped by embedding status.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:114: * @returns The counts for each embedding status.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:116:export function get_status_counts(
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:120:    SELECT m.embedding_status, COUNT(*) as count
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:123:    GROUP BY m.embedding_status
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:126:  // M7 FIX: Include 'partial' status in counts
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:128:  for (const row of rows as Array<{ embedding_status: keyof typeof counts; count: number }>) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:129:    if (row.embedding_status in counts) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:130:      counts[row.embedding_status] = row.count;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:144:  const counts = get_status_counts(database);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:221:  const where_clauses = ['m.embedding_status = \'success\''];
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:380:      WHERE m.embedding_status = 'success'
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1341:        WHERE m.embedding_status = 'success'
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1435:export { get_status_counts as getStatusCounts };
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:166:      'memory_health',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:177:      'shared_memory_status',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:190:      'memory_ingest_status',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:194:      'code_graph_status',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:196:      'ccc_status',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:204:      'deep_loop_graph_status',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:295:      'memory_validate', 'memory_save', 'memory_index_scan', 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:297:      'memory_ingest_start', 'memory_ingest_status', 'memory_ingest_cancel',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:300:      'shared_space_upsert', 'shared_space_membership_set', 'shared_memory_status', 'shared_memory_enable',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:301:      'code_graph_scan', 'code_graph_query', 'code_graph_status', 'code_graph_context',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:302:      'ccc_status', 'ccc_reindex', 'ccc_feedback',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:621:        indexSingleFile: vi.fn(async () => ({ status: 'unchanged' })),
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:622:        indexMemoryFile: vi.fn(async () => ({ status: 'unchanged' })),
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1257:            data: { status: 'success' },
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1325:      const originalText = '{"summary":"ok","data":{"status":"success"},"hints":[],"meta":{"tokenCount":1}}'
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2090:      'memory_health': '[L3:Discovery]',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2109:      'memory_ingest_status': '[L7:Maintenance]',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:68:    tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:46:  update_embedding_status,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:61:  get_status_counts,
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:29:  it('keeps parser provenance, evidence status, and freshness authority as separate fields', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:55:  includeTrace?: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:138:  includeTrace = false,
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:167:    includeTrace,
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-store-remediation.vitest.ts:106:          importance_tier, importance_weight, created_at, updated_at, embedding_status
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index.vitest.ts:19:      embedding_status TEXT DEFAULT 'success'
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index.vitest.ts:74:  it('returns skip when mtime is unchanged and embedding status is success', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index.vitest.ts:81:      INSERT INTO memory_index (spec_folder, file_path, file_mtime_ms, content_hash, embedding_status)
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index.vitest.ts:88:  it('forces reindex when embedding status is pending even if mtime is unchanged', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index.vitest.ts:94:      INSERT INTO memory_index (spec_folder, file_path, file_mtime_ms, content_hash, embedding_status)
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index.vitest.ts:109:      INSERT INTO memory_index (spec_folder, file_path, file_mtime_ms, content_hash, embedding_status)
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index.vitest.ts:115:      INSERT INTO memory_index (spec_folder, file_path, file_mtime_ms, content_hash, embedding_status)
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index.vitest.ts:131:      INSERT INTO memory_index (spec_folder, file_path, file_mtime_ms, content_hash, embedding_status)
.opencode/skill/system-spec-kit/mcp_server/tests/api-validation.vitest.ts:37:function mockFetch(status: number, body: Record<string, unknown>, options: { delay?: number } = {}): void {
.opencode/skill/system-spec-kit/mcp_server/tests/api-validation.vitest.ts:60:      ok: status >= 200 && status < 300,
.opencode/skill/system-spec-kit/mcp_server/tests/api-validation.vitest.ts:61:      status,
.opencode/skill/system-spec-kit/mcp_server/tests/api-validation.vitest.ts:62:      statusText: `HTTP ${status}`,
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:20:    'deep_loop_graph_status',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:123:        memory_health: 'L3',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:161:    it('shared_memory_status appears in exactly one layer and is mapped to that layer', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:162:      const matchingLayers = Object.values(LD).filter((layer) => layer.tools.includes('shared_memory_status'));
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:166:      expect(mod.TOOL_LAYER_MAP['shared_memory_status']).toBe(matchingLayers[0].id);
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:405:    it('reports isVectorSearchAvailable status', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:470:      expect(mem!.embedding_status).toBe('pending');
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:596:      expect(mem?.embedding_status).toBe('failed');
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:611:    it('rejects invalid status', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:612:      const result = mod.updateEmbeddingStatus(deferredId1!, 'invalid_status');
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1209:      expect(mem?.embedding_status).toBe('success');
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1341:      expect(mem?.embedding_status).toBe('success');
.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts:150:    it('getRerankerStatus returns complete status object', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts:151:      const status = crossEncoder.getRerankerStatus();
.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts:153:      expect(typeof status.available).toBe('boolean');
.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts:154:      expect(status.provider === null || typeof status.provider === 'string').toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts:155:      expect(status.model === null || typeof status.model === 'string').toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts:156:      expect(status.latency).toBeTruthy();
.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts:157:      expect(typeof status.latency.avg).toBe('number');
.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts:158:      expect(typeof status.latency.p95).toBe('number');
.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts:159:      expect(typeof status.latency.count).toBe('number');
.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts:164:      const status = crossEncoder.getRerankerStatus();
.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts:165:      expect(status.latency.count).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:53:      embedding_status TEXT DEFAULT 'success',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:146:      embedding_status TEXT DEFAULT 'success',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:202:      status TEXT NOT NULL DEFAULT 'active',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:278:      session_id, status, spec_folder, current_task, tenant_id, created_at, updated_at
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:440:          embedding_status TEXT DEFAULT 'success', confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:628:          session_id, status, spec_folder, current_task, created_at, updated_at
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:710:          session_id, status, spec_folder, current_task, created_at, updated_at
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:740:          session_id, status, spec_folder, current_task, created_at, updated_at
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-retry-stats.vitest.ts:3:// Phase 004 CHK-023 (memory_health embeddingRetry), CHK-024 (retry manager edge cases)
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:15:    status: 'ok',
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:147:            status: 'completed',
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:190:  it('exposes a status tool for plugin diagnostics', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:199:    const status = await hooks.tool?.spec_kit_compact_code_graph_status.execute({});
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:201:    expect(status).toContain('plugin_id=spec-kit-compact-code-graph');
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:202:    expect(status).toContain('cache_ttl_ms=7777');
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:203:    expect(status).toContain('resume_mode=minimal');
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:204:    expect(status).toContain('messages_transform_enabled=true');
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:205:    expect(status).toContain('messages_transform_mode=schema_aligned');
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:206:    expect(status).toContain('runtime_ready=true');
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:207:    expect(status).toContain('node_binary=node-custom');
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:208:    expect(status).toContain('bridge_timeout_ms=1234');
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:209:    expect(status).toContain('last_runtime_error=none');
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:227:    const status = await hooks.tool?.spec_kit_compact_code_graph_status.execute({});
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:228:    expect(status).toContain('runtime_ready=false');
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:229:    expect(status).toContain('last_runtime_error=NODE_MODULE_VERSION mismatch');
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts:37:          embedding_status TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts:62:            embedding_status,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-limit.vitest.ts:35:        embedding_status TEXT DEFAULT 'success',
.opencode/skill/system-spec-kit/mcp_server/tests/publication-gate.vitest.ts:17:  it('excludes rows missing methodology status', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:16:  it('supports every certainty status through the publishable metric helper', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:76:          text: JSON.stringify({ status: 'ok', data: { memories: ['active packet'] } }),
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:115:        status: 'ready',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:143:      'code-graph-status': 'exact',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:144:      'cocoindex-status': 'exact',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:167:            status: 'ok',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:205:          text: JSON.stringify({ status: 'ok', data: { state: 'ok', hints: ['health ok'] } }),
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:216:        status: 'ready',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:99:        data: { status: 'ok' }
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:150:            status: 'ok',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:180:          text: JSON.stringify({ status: 'ok', data: { state: 'ok', hints: ['health ok'] } }),
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:187:        status: 'ready',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-quality-filter.vitest.ts:58:    const routingQuery = resolveArtifactRoutingQuery('show checklist status', ['fallback', 'concepts']);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-quality-filter.vitest.ts:59:    expect(routingQuery).toBe('show checklist status');
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:237:        ['q9', 'status'], ['q10', 'status'],
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:448:  it('J2: DEFAULT_HINT actions reference memory_health()', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:450:    expect(actionsStr).toContain('memory_health');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:26:  status: string;
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:409:        expect(row!.status).toBe('active');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:445:        const row = testDb!.prepare('SELECT status FROM session_state WHERE session_id = ?').get('complete-1') as Pick<SessionStateRow, 'status'>;
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:446:        expect(row.status).toBe('completed');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:469:        const row1 = testDb!.prepare('SELECT status FROM session_state WHERE session_id = ?').get('reset-1') as Pick<SessionStateRow, 'status'>;
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:470:        expect(row1.status).toBe('interrupted');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:471:        const row2 = testDb!.prepare('SELECT status FROM session_state WHERE session_id = ?').get('reset-2') as Pick<SessionStateRow, 'status'>;
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:472:        expect(row2.status).toBe('completed');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:514:        const row = testDb!.prepare('SELECT status FROM session_state WHERE session_id = ?').get('recover-1') as Pick<SessionStateRow, 'status'>;
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:515:        expect(row.status).toBe('active');
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-pipeline-weighting.vitest.ts:97:    expect(result.status).toBe('success');
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:56:        embedding_status TEXT DEFAULT 'success',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:341:    expect(result.status).not.toBe('rejected');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:342:    expect(result.status).not.toBe('error');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:343:    expect(['indexed', 'created', 'updated', 'duplicate', 'deferred', 'unchanged']).toContain(result.status);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:388:    expect(result.status).toBe('rejected');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:988:      expect(result.status).toBe('rejected');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:1009:    expect(result.status).toBe('rejected');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:1026:    expect(result.status).toBe('rejected');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index-cooldown.vitest.ts:109:  indexMemoryFile: vi.fn(async () => ({ status: 'indexed', id: 1, specFolder: 'specs/test' })),
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index-cooldown.vitest.ts:363:          status: 'failed',
.opencode/skill/system-spec-kit/mcp_server/tests/encoding-intent.vitest.ts:202:      'status: active',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts:70:      embedding_status TEXT DEFAULT 'success'
.opencode/skill/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts:92:function insertMemory(db: Database.Database, id: number, opts?: { specFolder?: string; title?: string; status?: string }): void {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts:94:    INSERT INTO memory_index (id, spec_folder, file_path, title, embedding_status)
.opencode/skill/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts:101:    opts?.status ?? 'success',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts:548:      INSERT INTO memory_index (id, spec_folder, file_path, title, embedding_status)
.opencode/skill/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts:563:      INSERT INTO memory_index (id, spec_folder, file_path, title, embedding_status)
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:41:      embedding_status TEXT DEFAULT 'pending',
.opencode/skill/system-spec-kit/mcp_server/tests/temporal-contiguity.vitest.ts:41:        embedding_status TEXT DEFAULT 'success',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:91:  it('T536-2: includeTrace=false (default) omits scores/source/trace', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:101:  it('T536-3: includeTrace=true includes scores, source, and trace fields', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:162:          text: JSON.stringify({ status: 'ok', data: { state: 'ok', hints: ['health ok'] } }),
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:173:        status: 'ready',
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:28:        embedding_status: null,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:154:      status TEXT NOT NULL DEFAULT 'active',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:210:      embedding_status,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:258:      embedding_status,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:385:      session_id, status, spec_folder, current_task, last_action, context_summary, pending_work, state_data, created_at, updated_at
.opencode/skill/system-spec-kit/mcp_server/tests/mutation-hooks.vitest.ts:60:  it('returns success status flags when all hooks succeed', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator-swap.vitest.ts:141:      embedding_status TEXT DEFAULT 'pending',
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator-swap.vitest.ts:206:      embedding_status,
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator-swap.vitest.ts:262:      embedding_status,
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator-swap.vitest.ts:295:      embedding_status,
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator-swap.vitest.ts:350:    expect(result.status).toBe('updated');
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator-swap.vitest.ts:361:      SELECT id, parent_id, chunk_label, embedding_status
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator-swap.vitest.ts:369:      embedding_status: string;
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator-swap.vitest.ts:419:    expect(result.status).toBe('error');
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator-swap.vitest.ts:463:    expect(result.status).toBe('error');
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator-swap.vitest.ts:477:  it('partial embedding failures still swap successfully with mixed child statuses', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator-swap.vitest.ts:494:    expect(result.status).toBe('updated');
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator-swap.vitest.ts:509:      SELECT embedding_status, parent_id
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator-swap.vitest.ts:513:    `).all(parentId) as Array<{ embedding_status: string; parent_id: number | null }>;
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator-swap.vitest.ts:516:    expect(newChildren.some(row => row.embedding_status === 'pending')).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator-swap.vitest.ts:517:    expect(newChildren.some(row => row.embedding_status === 'success')).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator-swap.vitest.ts:537:    expect(result.status).toBe('indexed');
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator-swap.vitest.ts:576:    expect(result.status).toBe('error');
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-ops-hardening.vitest.ts:23:    expect(contract.doctor.surface).toBe('memory_health');
.opencode/skill/system-spec-kit/mcp_server/tests/mutation-ledger.vitest.ts:309:      status?: string;
.opencode/skill/system-spec-kit/mcp_server/tests/mutation-ledger.vitest.ts:312:    expect(escalationMeta.status).toBe('escalated');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:389:    expect(MEMORY_CONTEXT_SOURCE).toContain('options.sessionTransition = options.includeTrace === true ? sessionTransition : undefined;');
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-store.vitest.ts:39:      importance_tier, importance_weight, created_at, updated_at, embedding_status
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-comparison.vitest.ts:37:  'check status',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:47:      embedding_status,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:597:    it('injects session transition into traced nested results when includeTrace=true', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:628:          includeTrace: true,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:658:          includeTrace: true,
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:76:        importance_tier, context_type, embedding_status
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:304:    expect(indexes[1]?.sql).toContain('embedding_status');

exec
/bin/zsh -lc "sed -n '9765,9855p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
FINAL SYNTHESIS: Classify EVERY finding as adopt-now / prototype-later / new-feature-needed / reject. Executive summary.

**Executive summary:** Borrow **Modus’s operator surfaces**, not its weaker retrieval shortcuts. **Adopt now:** graded `memory_review`, doctor-style summary, and a strict one-retrieval-core rule. **New feature needed:** authoritative `memory_due` and a durable proposal inbox. **Prototype later:** connected-doc appendix, weak-result lexical fallback, and content-level contradiction linting. **Reject:** fuzzy result-cache reuse, permissive markdown ingestion, default write-on-read as policy, and unenforced trust-stage metadata.

## Findings

### Finding 1: Explicit graded review is the best immediate transfer
- **Source**: `external/internal/mcp/vault.go:885-897`; `external/internal/vault/facts.go:160-217`; `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:39-43,65-71,197-215`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:298-316`; `.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:648-790`
- **What it does**: Modus exposes `memory_reinforce`, but only as a success-only reinforce action. Public already has the stronger primitive: graded FSRS review (`AGAIN/HARD/GOOD/EASY`) plus computed `nextReviewDate`, yet the exposed adjacent tool is only `memory_validate(wasUseful)`, which adjusts confidence rather than recording a real review event.
- **Why it matters for us**: This closes the clearest control-plane gap without changing retrieval architecture. It also makes any later review queue trustworthy because review history would record hard recalls and lapses, not only “useful / not useful.”
- **Recommendation**: adopt now
- **Impact**: high

### Finding 2: A doctor-style summary should ship beside review
- **Source**: `external/cmd/modus-memory/doctor.go:13-242`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:378-594`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:236-273`
- **What it does**: Modus’s `doctor` turns vault health into a one-screen operator report. Public already has deeper health and repair machinery—FTS rebuild, orphan cleanup, degraded/healthy state, confirmation-gated repair—but exposes it as a richer technical envelope.
- **Why it matters for us**: This is mostly presentation work, not backend work. It improves operator trust immediately while preserving Public’s stronger repair semantics underneath.
- **Recommendation**: adopt now
- **Impact**: medium

### Finding 3: Keep one retrieval core; Modus’s split fact-search paths are a warning
- **Source**: `external/internal/index/indexer.go:287-340`; `external/internal/vault/facts.go:290-337`; `external/internal/mcp/vault.go:273-317`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:771-809`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/index.ts:1-32`
- **What it does**: Modus has multiple fact-search contracts for the same memory objects: `Index.SearchFacts`, a separate in-memory `factStore`, and `Vault.SearchFacts` fallback behavior. Public routes `memory_search` through one pipeline contract via `executePipeline`.
- **Why it matters for us**: This is the strongest architectural lesson from Modus’s weaknesses. Public should keep specialized search surfaces as thin wrappers over the canonical pipeline instead of growing parallel ranking rules that will drift.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 4: `memory_due` is real product value, but it needs an authoritative due-state contract first
- **Source**: `external/internal/mcp/vault.go:273-317,856-897`; `external/internal/vault/facts.go:64-157,160-217`; `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:65-71,177-215`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:519-520`
- **What it does**: Modus visibly ties search recall, reinforce, decay, and archive to one fact state. Public already stores `stability`, `difficulty`, `last_review`, `review_count`, and opt-in access effects, and computes `nextReviewDate`, but does not expose an operator-facing due queue.
- **Why it matters for us**: This is the biggest missing workflow surface in Public. But it should not ship until “due” is defined as either persisted state (`next_review_at`) or a deterministic derivation from existing FSRS fields.
- **Recommendation**: NEW FEATURE
- **Impact**: high

### Finding 5: Durable proposal inboxes are the best non-retrieval idea Modus has
- **Source**: `external/internal/vault/prs.go:10-118`; `external/internal/mcp/vault.go:681-777`; `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:417-452`; `.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:681-790`
- **What it does**: Modus persists risky knowledge changes as markdown PR artifacts, then merge/reject outcomes reinforce or weaken linked beliefs. Public already produces advisory reconsolidation recommendations and confidence feedback, but the recommendation is transient and not stored as a durable review object.
- **Why it matters for us**: Public’s next gap is operator workflow, not mutation safety. A persistent inbox for reconsolidation, supersession, promotion, and deprecation proposals would let existing confidence and mutation systems work as a real review loop.
- **Recommendation**: NEW FEATURE
- **Impact**: high

### Finding 6: Connected-doc hints are worth prototyping only as an explanation appendix
- **Source**: `external/internal/index/crossref.go:154-214,248-280`; `external/internal/mcp/vault.go:75-101,901-924`
- **What it does**: Modus builds lightweight subject/entity/tag adjacency and appends connected docs that did not make the main ranked list. The weighting is simple and fixed (`subject 3`, `entity 2`, `tag 1`).
- **Why it matters for us**: The transferable part is explanation, not ranking. Public can test a “related memories” appendix without diluting stronger graph-backed or hybrid scoring paths.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 7: Lexical-only expansion belongs only in weak-result recovery
- **Source**: `external/internal/librarian/search.go:10-52`; `external/internal/mcp/vault.go:28-58,280-299`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:525-529,771-809`
- **What it does**: Modus asks the Librarian for 3-5 keyword variants, searches each, deduplicates, and caps results. It is lightweight, but ungrounded and union-first.
- **Why it matters for us**: Public already has a more complex retrieval pipeline, so copying this as a mainline branch would mostly add noise and latency. The only credible transfer is a tightly bounded fallback when hybrid retrieval is weak.
- **Recommendation**: prototype later
- **Impact**: low

### Finding 8: Content-level contradiction and duplicate-fact linting is still worth a prototype
- **Source**: `external/cmd/modus-memory/doctor.go:42-158`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:455-555`
- **What it does**: Modus’s `doctor` explicitly flags missing `subject`/`predicate`, duplicate `subject+predicate` pairs, and contradictory values for the same pair. Public’s current health surface is stronger on infrastructure integrity than on fact-content linting.
- **Why it matters for us**: This complements Public’s existing infra health checks instead of replacing them. It is one of the few Modus hygiene ideas that adds net-new value.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 9: Reject Modus’s fuzzy Jaccard result-cache contract
- **Source**: `external/internal/index/cache.go:10-17,41-119`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:502-529,718-755`
- **What it does**: Modus reuses cached result sets on exact hash hits or Jaccard-similar query term sets. Public’s search surface has too many scoring knobs—scope, archived filtering, session/causal boost, rerank, quality thresholds, trace/profile flags—for fuzzy query reuse to be safe.
- **Why it matters for us**: This is the wrong cache contract for Public. Similar text is not enough to guarantee equivalent retrieval intent or scoring context.
- **Recommendation**: reject
- **Impact**: high

### Finding 10: Reject Modus’s permissive markdown parse/write contract
- **Source**: `external/internal/markdown/parser.go:98-159,161-186`; `external/internal/markdown/writer.go:10-52`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:220-220`
- **What it does**: Modus treats malformed YAML as body, skips parse failures during scans, and writes markdown directly with minimal validation. That is good for a personal vault, but it optimizes for permissiveness over authoritative ingestion.
- **Why it matters for us**: Public’s memory layer is intentionally more governed. Regressing to Modus’s permissive storage contract would weaken memory integrity for little gain.
- **Recommendation**: reject
- **Impact**: high

### Finding 11: Reject default write-on-read as Public’s default policy
- **Source**: `external/internal/mcp/vault.go:311-317`; `external/internal/vault/facts.go:188-217`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:519-520,797-802`
- **What it does**: Modus treats every returned fact as a successful recall and asynchronously reinforces it. Public already supports access effects, but keeps them explicit with `trackAccess=false` by default.
- **Why it matters for us**: Public’s graded FSRS model is stronger than Modus’s success-only reinforce loop. Default write-on-read would blur retrieval and review, inflate successful-recall history, and make future due-state less trustworthy.
- **Recommendation**: reject
- **Impact**: high

### Finding 12: Reject trust-stage metadata unless it becomes real gating
- **Source**: `external/internal/vault/trust.go:11-82`; `external/internal/mcp/vault.go:610-635,681-777`; repo search on `external/internal/**/*.go` shows trust-stage calls only in trust read/write surfaces
- **What it does**: Modus persists trust stage and exposes get/set tools, but current code does not use that state to gate PR or other mutation tools. It is posture metadata, not enforced runtime policy.
- **Why it matters for us**: Public should not copy symbolic governance. If autonomy stages are added, they must actually gate review, proposal, or mutation flows.
- **Recommendation**: reject
- **Impact**: medium

## Sources Consulted

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go | sed -n '280,345p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   280	}
   281	
   282	// CrossRefStats returns cross-index statistics (subjects, tags, entities).
   283	func (idx *Index) CrossRefStats() (int, int, int) {
   284		return idx.cross.Stats()
   285	}
   286	
   287	// SearchFacts searches memory facts by query.
   288	func (idx *Index) SearchFacts(query string, limit int) []MemFact {
   289		return idx.facts.search(query, limit)
   290	}
   291	
   292	// FactsBySubject returns all active facts for a subject.
   293	func (idx *Index) FactsBySubject(subject string, limit int) []MemFact {
   294		return idx.facts.bySubject(subject, limit)
   295	}
   296	
   297	// AllActiveFacts returns all active memory facts.
   298	func (idx *Index) AllActiveFacts(limit int) []MemFact {
   299		return idx.facts.allActive(limit)
   300	}
   301	
   302	// FactCount returns total and active fact counts.
   303	func (idx *Index) FactCount() (total, active int) {
   304		return idx.facts.count()
   305	}
   306	
   307	// indexFacts loads memory facts from vault/memory/facts/ into the fact store.
   308	func (idx *Index) indexFacts(vaultDir string) {
   309		factsDir := filepath.Join(vaultDir, "memory", "facts")
   310		docs, err := markdown.ScanDir(factsDir)
   311		if err != nil {
   312			return
   313		}
   314	
   315		count := 0
   316		for _, doc := range docs {
   317			rel, _ := filepath.Rel(vaultDir, doc.Path)
   318			subject := doc.Get("subject")
   319			predicate := doc.Get("predicate")
   320			value := doc.Body
   321			if value == "" {
   322				value = doc.Get("value")
   323			}
   324			if subject == "" || predicate == "" {
   325				continue
   326			}
   327	
   328			confidence := doc.GetFloat("confidence")
   329			if confidence == 0 {
   330				confidence = 0.8
   331			}
   332			importance := doc.Get("importance")
   333			if importance == "" {
   334				importance = "medium"
   335			}
   336			memType := doc.Get("memory_type")
   337			if memType == "" {
   338				memType = "semantic"
   339			}
   340			created := doc.Get("created")
   341			if created == "" {
   342				created = doc.Get("created_at")
   343			}
   344			session := doc.Get("session_tag")
   345			if session == "" {

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go | sed -n '288,340p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   288	}
   289	
   290	// SearchFacts searches memory facts via FTS, filtering to memory/facts/ paths.
   291	// Falls back to listing all facts if no index is loaded.
   292	func (v *Vault) SearchFacts(query string, limit int) ([]string, error) {
   293		if limit <= 0 {
   294			limit = 10
   295		}
   296	
   297		// Fallback: scan directory if no index
   298		if v.Index == nil {
   299			docs, err := v.ListFacts("", limit)
   300			if err != nil {
   301				return nil, err
   302			}
   303			var out []string
   304			for _, doc := range docs {
   305				subj := doc.Get("subject")
   306				val := doc.Body
   307				if len(val) > 200 {
   308					val = val[:197] + "..."
   309				}
   310				// Basic keyword match
   311				if query != "" && !strings.Contains(strings.ToLower(subj+val), strings.ToLower(query)) {
   312					continue
   313				}
   314				out = append(out, fmt.Sprintf("- **%s**: %s", subj, strings.TrimSpace(val)))
   315			}
   316			return out, nil
   317		}
   318	
   319		results, err := v.Index.Search(query, limit*3)
   320		if err != nil {
   321			return nil, err
   322		}
   323	
   324		var out []string
   325		count := 0
   326		for _, r := range results {
   327			if !strings.HasPrefix(r.Path, "memory/facts/") {
   328				continue
   329			}
   330			if count >= limit {
   331				break
   332			}
   333			out = append(out, fmt.Sprintf("- **%s**: %s", r.Subject, r.Snippet))
   334			count++
   335		}
   336		return out, nil
   337	}
   338	
   339	// StoreFact writes a new memory fact as a .md file.
   340	func (v *Vault) StoreFact(subject, predicate, value string, confidence float64, importance string) (string, error) {

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/index.ts | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
# Iteration 030: FINAL EXTENDED SYNTHESIS

## Focus
FINAL EXTENDED SYNTHESIS: Integrate all 30 iterations. Update the adopt/prototype/reject classification. Create the definitive recommendation set with priority, effort, and impact scores.

## Findings
### Finding 1: Ship explicit graded `memory_review` first
- **Source**: [vault.go:885](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L885); [facts.go:160](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go#L160); [fsrs-scheduler.ts:39](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts#L39); [checkpoints.ts:648](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts#L648); [tool-schemas.ts:297](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L297)
- **What it does**: Modus exposes explicit reinforcement; Public already has the stronger graded FSRS math and `nextReviewDate`, but only exposes `memory_validate(wasUseful)`.
- **Why it matters**: This is the clearest operator-surface gap and the best impact-to-effort transfer from Modus.
- **Recommendation**: **adopt now**
- **Priority / Effort / Impact**: **10 / 3 / 9**

### Finding 2: Add a compact doctor/debug surface, not more hidden routing
- **Source**: [doctor.go:13](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/doctor.go#L13); [memory-search.ts:676](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L676); [memory-search.ts:699](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L699); [tool-schemas.ts:236](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L236)
- **What it does**: Modus turns system state into a one-screen operator report. Public already computes more health and routing detail, but much of it is log-first or trace-only.
- **Why it matters**: Operator trust improves immediately when route and health are visible without opening trace envelopes or stderr.
- **Recommendation**: **adopt now**
- **Priority / Effort / Impact**: **8 / 4 / 7**

### Finding 3: Preserve one canonical retrieval core
- **Source**: [indexer.go:287](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go#L287); [facts.go:290](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go#L290); [index.ts:4](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/index.ts#L4)
- **What it does**: Modus ends up with multiple fact-search paths; Public already centralizes retrieval through `executePipeline`.
- **Why it matters**: The strongest architectural lesson from all 30 iterations is to keep new tools as thin wrappers over the same retrieval core, not parallel ranking systems.
- **Recommendation**: **adopt now**
- **Priority / Effort / Impact**: **9 / 2 / 8**

### Finding 4: `memory_due` is the biggest missing workflow, but it needs a real contract first
- **Source**: [vault.go:856](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L856); [fsrs-scheduler.ts:65](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts#L65); [fsrs-scheduler.ts:177](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts#L177); [memory-search.ts:519](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L519)
- **What it does**: Public already stores the FSRS ingredients for due-state, but does not expose an operator-facing due queue.
- **Why it matters**: This is real product value, but “due” must be defined first as either persisted state or deterministic derivation.
- **Recommendation**: **NEW FEATURE**
- **Priority / Effort / Impact**: **9 / 6 / 8**

### Finding 5: Prototype connected-doc hints only as an explanation appendix
- **Source**: [crossref.go:154](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go#L154); [crossref.go:181](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go#L181); [vault.go:901](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L901)
- **What it does**: Modus uses simple subject/entity/tag adjacency with fixed `3/2/1` weights to surface related documents.
- **Why it matters**: The transferable value is cheap explanation and light rehydration, not replacing Public’s stronger graph-backed ranking.
- **Recommendation**: **prototype later**
- **Priority / Effort / Impact**: **6 / 4 / 6**

### Finding 6: Prototype lexical expansion only for weak-result recovery
- **Source**: [search.go:10](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go#L10); [search.go:49](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go#L49); [sqlite-fts.ts:193](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts#L193); [memory-search.ts:691](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L691)
- **What it does**: Modus expands into 3-5 keyword variants, unions results, and deduplicates.
- **Why it matters**: Public already has a richer hybrid stack, so this should only ever be a bounded recovery path when the main retrieval is weak.
- **Recommendation**: **prototype later**
- **Priority / Effort / Impact**: **5 / 5 / 5**

### Finding 7: Do not copy Modus’s fuzzy Jaccard result-cache contract
- **Source**: [cache.go:10](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go#L10); [cache.go:41](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go#L41); [memory-search.ts:502](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L502)
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


hook: Stop
hook: Stop Completed
tokens used
126,995
# Iteration 030: FINAL EXTENDED SYNTHESIS

## Focus
FINAL EXTENDED SYNTHESIS: Integrate all 30 iterations. Update the adopt/prototype/reject classification. Create the definitive recommendation set with priority, effort, and impact scores.

## Findings
### Finding 1: Ship explicit graded `memory_review` first
- **Source**: [vault.go:885](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L885); [facts.go:160](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go#L160); [fsrs-scheduler.ts:39](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts#L39); [checkpoints.ts:648](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts#L648); [tool-schemas.ts:297](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L297)
- **What it does**: Modus exposes explicit reinforcement; Public already has the stronger graded FSRS math and `nextReviewDate`, but only exposes `memory_validate(wasUseful)`.
- **Why it matters**: This is the clearest operator-surface gap and the best impact-to-effort transfer from Modus.
- **Recommendation**: **adopt now**
- **Priority / Effort / Impact**: **10 / 3 / 9**

### Finding 2: Add a compact doctor/debug surface, not more hidden routing
- **Source**: [doctor.go:13](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/doctor.go#L13); [memory-search.ts:676](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L676); [memory-search.ts:699](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L699); [tool-schemas.ts:236](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L236)
- **What it does**: Modus turns system state into a one-screen operator report. Public already computes more health and routing detail, but much of it is log-first or trace-only.
- **Why it matters**: Operator trust improves immediately when route and health are visible without opening trace envelopes or stderr.
- **Recommendation**: **adopt now**
- **Priority / Effort / Impact**: **8 / 4 / 7**

### Finding 3: Preserve one canonical retrieval core
- **Source**: [indexer.go:287](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go#L287); [facts.go:290](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go#L290); [index.ts:4](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/index.ts#L4)
- **What it does**: Modus ends up with multiple fact-search paths; Public already centralizes retrieval through `executePipeline`.
- **Why it matters**: The strongest architectural lesson from all 30 iterations is to keep new tools as thin wrappers over the same retrieval core, not parallel ranking systems.
- **Recommendation**: **adopt now**
- **Priority / Effort / Impact**: **9 / 2 / 8**

### Finding 4: `memory_due` is the biggest missing workflow, but it needs a real contract first
- **Source**: [vault.go:856](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L856); [fsrs-scheduler.ts:65](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts#L65); [fsrs-scheduler.ts:177](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts#L177); [memory-search.ts:519](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L519)
- **What it does**: Public already stores the FSRS ingredients for due-state, but does not expose an operator-facing due queue.
- **Why it matters**: This is real product value, but “due” must be defined first as either persisted state or deterministic derivation.
- **Recommendation**: **NEW FEATURE**
- **Priority / Effort / Impact**: **9 / 6 / 8**

### Finding 5: Prototype connected-doc hints only as an explanation appendix
- **Source**: [crossref.go:154](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go#L154); [crossref.go:181](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go#L181); [vault.go:901](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L901)
- **What it does**: Modus uses simple subject/entity/tag adjacency with fixed `3/2/1` weights to surface related documents.
- **Why it matters**: The transferable value is cheap explanation and light rehydration, not replacing Public’s stronger graph-backed ranking.
- **Recommendation**: **prototype later**
- **Priority / Effort / Impact**: **6 / 4 / 6**

### Finding 6: Prototype lexical expansion only for weak-result recovery
- **Source**: [search.go:10](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go#L10); [search.go:49](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go#L49); [sqlite-fts.ts:193](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts#L193); [memory-search.ts:691](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L691)
- **What it does**: Modus expands into 3-5 keyword variants, unions results, and deduplicates.
- **Why it matters**: Public already has a richer hybrid stack, so this should only ever be a bounded recovery path when the main retrieval is weak.
- **Recommendation**: **prototype later**
- **Priority / Effort / Impact**: **5 / 5 / 5**

### Finding 7: Do not copy Modus’s fuzzy Jaccard result-cache contract
- **Source**: [cache.go:10](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go#L10); [cache.go:41](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go#L41); [memory-search.ts:502](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L502)
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
