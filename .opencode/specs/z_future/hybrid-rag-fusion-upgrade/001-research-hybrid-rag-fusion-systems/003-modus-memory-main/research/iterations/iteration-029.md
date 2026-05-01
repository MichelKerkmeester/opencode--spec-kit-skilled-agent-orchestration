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

## Recommended Next Focus
[next direction]
hook: SessionStart
hook: SessionStart Completed
hook: UserPromptSubmit
hook: UserPromptSubmit Completed
codex
I’m treating this as a read-only deep-research pass for iteration 29 focused on an architecture decision record. I’ll do a quick memory pass for prior context, then verify the relevant Modus and Spec Kit Memory code paths so the recommendations stay evidence-backed and scoped to this phase.
exec
/bin/zsh -lc 'rg -n "modus|hybrid-rag|FSRS|librarian|crossref|architecture decision|003-modus-memory-main" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,220p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
I’ve confirmed the deep-research workflow guidance and there wasn’t a directly reusable memory note for this specific Modus ADR pass. Next I’m reading the exact ranking, FSRS, cross-reference, markdown, and MCP handler files in the requested order, plus the current Public counterparts, so the accept/reject calls stay grounded in code rather than README claims.
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

codex
I have the ranking path now: Modus is a straightforward weighted BM25 stack with a tiny two-tier cache and LLM-based lexical expansion layered around it. I’m moving into the deeper architecture decisions next: how reinforcement is triggered, how adjacency is built, how markdown persistence shapes operations, and where Public already overlaps enough that copying Modus would be redundant.
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/facts.go | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	package index
     2	
     3	import (
     4		"sort"
     5		"strings"
     6		"time"
     7	)
     8	
     9	// MemFact represents an in-memory memory fact, replacing the SQL memory_facts table.
    10	type MemFact struct {
    11		ID         string
    12		Subject    string
    13		Predicate  string
    14		Value      string
    15		Confidence float64
    16		Importance string
    17		MemoryType string
    18		CreatedAt  string
    19		SessionTag string
    20		IsActive   int
    21	}
    22	
    23	// factStore holds all memory facts in memory with term-based search.
    24	type factStore struct {
    25		facts    []MemFact
    26		terms    map[string][]int // stemmed term → fact indices
    27		subjects map[string][]int // lowercase subject → fact indices
    28	}
    29	
    30	func newFactStore() *factStore {
    31		return &factStore{
    32			terms:    make(map[string][]int),
    33			subjects: make(map[string][]int),
    34		}
    35	}
    36	
    37	// add indexes a fact into the store.
    38	func (fs *factStore) add(f MemFact) {
    39		idx := len(fs.facts)
    40		fs.facts = append(fs.facts, f)
    41	
    42		// Index all text fields
    43		content := f.Subject + " " + f.Predicate + " " + f.Value
    44		for _, token := range tokenize(content) {
    45			fs.terms[token] = append(fs.terms[token], idx)
    46		}
    47	
    48		// Subject index for exact lookups
    49		subj := strings.ToLower(strings.TrimSpace(f.Subject))
    50		fs.subjects[subj] = append(fs.subjects[subj], idx)
    51	}
    52	
    53	// recencyBoost returns a multiplier based on fact age.
    54	// Hot (<24h): 1.5x, Warm (1-7d): 1.2x, Recent (7-30d): 1.0x, Cold (>30d): 0.8x.
    55	// Inspired by Icarus/Hermes tiered memory — hot facts surface first.
    56	func recencyBoost(createdAt string) float64 {
    57		if createdAt == "" {
    58			return 1.0
    59		}
    60		t, err := time.Parse("2006-01-02", createdAt[:min10(10, len(createdAt))])
    61		if err != nil {
    62			// Try RFC3339
    63			t, err = time.Parse(time.RFC3339, createdAt)
    64			if err != nil {
    65				return 1.0
    66			}
    67		}
    68		age := time.Since(t)
    69		switch {
    70		case age < 24*time.Hour:
    71			return 1.5 // hot
    72		case age < 7*24*time.Hour:
    73			return 1.2 // warm
    74		case age < 30*24*time.Hour:
    75			return 1.0 // recent
    76		default:
    77			return 0.8 // cold
    78		}
    79	}
    80	
    81	func min10(a, b int) int {
    82		if a < b {
    83			return a
    84		}
    85		return b
    86	}
    87	
    88	// search finds facts matching a query, ranked by BM25-like scoring with recency boost.
    89	func (fs *factStore) search(query string, limit int) []MemFact {
    90		if len(fs.facts) == 0 {
    91			return nil
    92		}
    93	
    94		queryTerms := tokenize(query)
    95		if len(queryTerms) == 0 {
    96			return nil
    97		}
    98	
    99		// Score each fact by term overlap
   100		scores := make(map[int]float64)
   101		for _, term := range queryTerms {
   102			indices, ok := fs.terms[term]
   103			if !ok {
   104				continue
   105			}
   106			// Simple TF-IDF-like scoring
   107			idf := 1.0 / (1.0 + float64(len(indices))/float64(len(fs.facts)))
   108			for _, idx := range indices {
   109				if fs.facts[idx].IsActive == 0 {
   110					continue
   111				}
   112				scores[idx] += idf
   113				// Boost by confidence
   114				scores[idx] += fs.facts[idx].Confidence * 0.1
   115			}
   116		}
   117	
   118		// Apply recency boost — hot facts surface before cold ones
   119		for idx := range scores {
   120			scores[idx] *= recencyBoost(fs.facts[idx].CreatedAt)
   121		}
   122	
   123		// Sort by score
   124		type scored struct {
   125			idx   int
   126			score float64
   127		}
   128		var ranked []scored
   129		for idx, score := range scores {
   130			ranked = append(ranked, scored{idx, score})
   131		}
   132		sort.Slice(ranked, func(i, j int) bool {
   133			return ranked[i].score > ranked[j].score
   134		})
   135	
   136		if limit > 0 && len(ranked) > limit {
   137			ranked = ranked[:limit]
   138		}
   139	
   140		results := make([]MemFact, len(ranked))
   141		for i, r := range ranked {
   142			results[i] = fs.facts[r.idx]
   143		}
   144		return results
   145	}
   146	
   147	// bySubject returns all active facts for a given subject (case-insensitive).
   148	func (fs *factStore) bySubject(subject string, limit int) []MemFact {
   149		indices := fs.subjects[strings.ToLower(strings.TrimSpace(subject))]
   150		var results []MemFact
   151		for _, idx := range indices {
   152			if fs.facts[idx].IsActive == 1 {
   153				results = append(results, fs.facts[idx])
   154			}
   155			if limit > 0 && len(results) >= limit {
   156				break
   157			}
   158		}
   159		return results
   160	}
   161	
   162	// allActive returns all active facts, optionally limited.
   163	func (fs *factStore) allActive(limit int) []MemFact {
   164		var results []MemFact
   165		for _, f := range fs.facts {
   166			if f.IsActive == 1 {
   167				results = append(results, f)
   168			}
   169			if limit > 0 && len(results) >= limit {
   170				break
   171			}
   172		}
   173		return results
   174	}
   175	
   176	// count returns total and active fact counts.
   177	func (fs *factStore) count() (total, active int) {
   178		total = len(fs.facts)
   179		for _, f := range fs.facts {
   180			if f.IsActive == 1 {
   181				active++
   182			}
   183		}
   184		return
   185	}
   186	
   187	// Tier returns the recency tier label: "hot", "warm", "recent", or "cold".
   188	func (f *MemFact) Tier() string {
   189		if f.CreatedAt == "" {
   190			return "cold"
   191		}
   192		t, err := time.Parse("2006-01-02", f.CreatedAt[:min10(10, len(f.CreatedAt))])
   193		if err != nil {
   194			t, err = time.Parse(time.RFC3339, f.CreatedAt)
   195			if err != nil {
   196				return "cold"
   197			}
   198		}
   199		age := time.Since(t)
   200		switch {
   201		case age < 24*time.Hour:
   202			return "hot"
   203		case age < 7*24*time.Hour:
   204			return "warm"
   205		case age < 30*24*time.Hour:
   206			return "recent"
   207		default:
   208			return "cold"
   209		}
   210	}
   211	
   212	// StalenessWarning returns a warning if the fact is old.
   213	func (f *MemFact) StalenessWarning() string {
   214		if f.CreatedAt == "" {
   215			return ""
   216		}
   217		t, err := time.Parse("2006-01-02", f.CreatedAt[:10])
   218		if err != nil {
   219			return ""
   220		}
   221		age := time.Since(t)
   222		if age > 90*24*time.Hour {
   223			return "⚠ >90d old"
   224		}
   225		if age > 30*24*time.Hour {
   226			return "⚠ >30d old"
   227		}
   228		return ""
   229	}

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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/writer.go | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "rg -n \"ExpandQuery|Connected\\(|ReinforceFact|Search\\(|memory_search|memory_review|facts|connected|librarian|review|reinforce\" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:13://	memory_facts, memory_search, memory_store,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:14://	memory_reinforce, memory_decay_facts, vault_connected
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:25:		"memory_facts":      true,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:26:		"memory_search":     true,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:28:		"memory_reinforce":  true,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:29:		"memory_decay_facts": true,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:30:		"vault_connected":   true,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:11:	"github.com/GetModus/modus-memory/internal/librarian"
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:28:		// If the librarian is available, expand the query for better recall
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:30:		if librarian.Available() {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:31:			expansions := librarian.ExpandQuery(query)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:32:			log.Printf("vault_search: librarian expanded %q → %d variants", query, len(expansions))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:35:				results, err := v.Search(exp, limit)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:47:			// Fallback: direct FTS5 search without librarian
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:48:			results, err := v.Search(query, limit)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:75:		// Append cross-reference hints — show connected docs the agent might want
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:77:			refs := v.Index.Connected(query, 5)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:91:					sb.WriteString("**Cross-references** (connected docs not in results above):\n")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:169:			"subdir":  map[string]interface{}{"type": "string", "description": "Subdirectory to list (e.g. brain/hn, memory/facts)"},
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:243:			return "No memory facts found.", nil
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:258:		return fmt.Sprintf("%d memory facts:\n\n%s", len(docs), sb.String()), nil
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:269:	srv.AddTool("memory_facts", "List episodic memory facts. Optionally filter by subject.", memoryFactsSchema, memoryFactsHandler)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:280:		// Search with optional librarian expansion
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:282:		if librarian.Available() {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:283:			queries = librarian.ExpandQuery(query)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:284:			log.Printf("memory_search: librarian expanded %q → %d variants", query, len(queries))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:292:			facts := v.Index.SearchFacts(q, limit)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:293:			for _, f := range facts {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:303:			return "No memory facts matched this query.", nil
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:311:		// Reinforce accessed facts — FSRS recall event.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:315:				go v.ReinforceFact(f.ID) // async — don't block search response
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:320:		sb.WriteString(fmt.Sprintf("%d results (bm25+librarian, %d queries):\n\n",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:343:	srv.AddTool("memory_search", "Search episodic memory facts with librarian expansion and FSRS reinforcement.", memorySearchSchema, memorySearchHandler)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:649:	srv.AddTool("atlas_reinforce_belief", "Reinforce a belief's confidence (+0.05 independent, +0.02 same source).", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:653:			"source": map[string]interface{}{"type": "string", "description": "Source of reinforcement"},
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:734:		return fmt.Sprintf("PR merged: %s (by %s). Linked beliefs reinforced.", relPath, closedBy), nil
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:856:	srv.AddTool("memory_decay_facts", "Run memory fact confidence decay sweep.", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:863:		return fmt.Sprintf("Decayed %d memory facts.", n), nil
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:866:	srv.AddTool("memory_archive_stale", "Archive stale memory facts below confidence threshold.", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:880:		return fmt.Sprintf("Archived %d stale facts (below %.2f confidence).", n, threshold), nil
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:885:	srv.AddTool("memory_reinforce", "Reinforce a memory fact after successful recall (FSRS stability growth).", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:888:			"path": map[string]interface{}{"type": "string", "description": "Relative vault path to the fact (e.g. memory/facts/some-fact.md)"},
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:893:		if err := v.ReinforceFact(path); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:901:	srv.AddTool("vault_connected", "Find all documents connected to a subject, entity, or tag. Returns facts, beliefs, entities, articles, learnings, and missions that share references.", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:919:		refs := v.Index.Connected(query, limit)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:924:		return index.FormatConnected(refs), nil

exec
/bin/zsh -lc 'rg -n "FSRS|trackAccess|processReview|nextReviewDate|memory_validate|enableSessionBoost|causal|trace|profile|route|fallback|debug|review|search_shown|result_cited" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts:5:// Augments FSRS stability scores with graph centrality so that
.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts:26: * Compute structural freshness by augmenting an FSRS stability score
.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts:36: * @param stability  - FSRS stability value, clamped to [0, 1].
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:5:// CANONICAL FSRS CONSTANTS & ALGORITHM
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:10:// FSRS v4 power-law: R(t) = (1 + FSRS_FACTOR * t/S)^FSRS_DECAY
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:11:// Timescale: days/weeks. Constants: FSRS_FACTOR=19/81, FSRS_DECAY=-0.5
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:19:// Algorithm. All temporal decay for persistent memories should route
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:21:// Where t = elapsed days, S = stability (grows with successful reviews).
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:31:/** FSRS v4 algorithm constants */
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:32:const FSRS_FACTOR = 19 / 81;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:33:const FSRS_DECAY = -0.5;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:36:// From R(h) = 0.5: S = (FSRS_FACTOR / 3) * h = (19/243) * h
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:37:const FSRS_HALF_LIFE_FACTOR = FSRS_FACTOR / 3; // 19/243 ≈ 0.07819
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:39:/** Grade constants for review scoring */
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:62:  reviewCount: number;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:69:  reviewCount: number;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:70:  nextReviewDate: string;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:77: * Calculate retrievability (probability of recall) using FSRS v4 formula.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:86:    1 + FSRS_FACTOR * (elapsedDays / stability),
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:87:    FSRS_DECAY
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:94: * Update stability based on review grade.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:95: * Uses simplified FSRS v4 update rules.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:122: * Calculate optimal review interval from stability.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:132:  const interval = (safeStability / FSRS_FACTOR) * (Math.pow(desiredRetention, 1 / FSRS_DECAY) - 1);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:138: * Update difficulty based on review grade.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:159: * Calculate elapsed days since last review.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:175: * Get next review date based on stability and desired retention.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:186: * Create initial FSRS parameters for a new memory.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:193:    reviewCount: 0,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:198: * Process a review and return updated parameters.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:200:function processReview(params: FsrsParams, grade: number): ReviewResult {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:207:  const nextReviewDate = getNextReviewDate(newStability);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:213:    reviewCount: params.reviewCount + 1,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:214:    nextReviewDate,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:222:const FSRS_CONSTANTS = {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:223:  FSRS_FACTOR,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:224:  FSRS_DECAY,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:225:  FSRS_HALF_LIFE_FACTOR, // T301: derived constant (19/243)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:239: * Each tier modifies how quickly memories decay relative to the base FSRS schedule.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:244: * IMPORTANCE_TIER_STABILITY_MULTIPLIER below, which operates on the FSRS stability
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:261:   Multiplies FSRS stability so that:
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:268: * Applied to the FSRS stability parameter before computing retrievability.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:271: * 1.0 = standard FSRS schedule.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:341: * @param stability      Base FSRS stability value
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:379:      Normal FSRS schedule applies without modification.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:396:const HYBRID_FSRS_CONTEXT_TYPES: ReadonlySet<string> = new Set([
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:445: *   - all others → returns stability unchanged (normal FSRS schedule)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:447: * @param stability    Base FSRS stability value
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:458:  FSRS_FACTOR,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:459:  FSRS_DECAY,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:460:  FSRS_HALF_LIFE_FACTOR, // T301: derived constant for half-life ↔ stability
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:470:  FSRS_CONSTANTS,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:481:  HYBRID_FSRS_CONTEXT_TYPES,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:496:  processReview,
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:43:  description: '[L1:Orchestration] Unified entry point for context retrieval with intent-aware routing. START HERE for most memory operations. For session recovery, use mode: \'resume\' with profile: \'resume\'. Automatically detects task intent (add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision) and routes to optimal retrieval strategy. Modes: auto (default), quick (trigger-based), deep (comprehensive), focused (intent-optimized), resume (session recovery). Token Budget: 3500. For code search by concept/intent, prefer mcp__cocoindex_code__search (CocoIndex). For structural code queries (callers, imports), prefer code_graph_query.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:44:  inputSchema: { type: 'object', additionalProperties: false, properties: { input: { type: 'string', minLength: 1, description: 'The query, prompt, or context description (required)' }, mode: { type: 'string', enum: ['auto', 'quick', 'deep', 'focused', 'resume'], default: 'auto', description: 'Context retrieval mode: auto (detect intent), quick (fast triggers), deep (comprehensive search), focused (intent-optimized), resume (session recovery)' }, intent: { type: 'string', enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'], description: 'Explicit task intent. If not provided and mode=auto, intent is auto-detected from input.' }, specFolder: { type: 'string', description: 'Limit context to specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval when memory_context routes to memory_search.' }, userId: { type: 'string', description: 'User boundary for governed retrieval when memory_context routes to memory_search.' }, agentId: { type: 'string', description: 'Agent boundary for governed retrieval when memory_context routes to memory_search.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed retrieval when memory_context routes to memory_search.' }, limit: { type: 'number', minimum: 1, maximum: 100, description: 'Maximum results (mode-specific defaults apply)' }, sessionId: { type: 'string', description: 'Optional server-issued session identifier for working-memory continuity. When provided, it must match an existing server-managed session or the call is rejected. Omit it to let the server generate a new session for this request.' }, enableDedup: { type: 'boolean', default: true, description: 'Enable session deduplication' }, includeContent: { type: 'boolean', default: false, description: 'Include full file content in results' }, includeTrace: { type: 'boolean', default: false, description: 'Include provenance-rich trace data (scores, source, trace) in results when underlying memory_search is called' }, tokenUsage: { type: 'number', minimum: 0.0, maximum: 1.0, description: "Optional caller token usage ratio (0.0-1.0)" }, anchors: { type: 'array', items: { type: 'string' }, description: 'Filter content to specific anchors (e.g., ["state", "next-steps"] for resume mode)' }, profile: { type: 'string', enum: ['quick', 'research', 'resume', 'debug'], description: 'Optional response profile formatter. Returns a reduced or mode-aware response shape when profile formatting is enabled.' } }, required: ['input'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:50:  description: '[L2:Core] Search conversation memories semantically using vector similarity. Returns ranked results with similarity scores. Constitutional tier memories are ALWAYS included at the top of results (~2000 tokens max), regardless of query. Requires query (string), concepts (array of 2-5 strings), or cursor (string) for continuation pagination. Supports intent-aware retrieval (REQ-006) with task-specific weight adjustments. When implicit feedback logging is enabled, searches also emit shadow-only feedback signals such as search_shown and, for includeContent runs, result_cited. Token Budget: 3500. For code search by concept/intent, prefer mcp__cocoindex_code__search (CocoIndex). For structural code queries (callers, imports), prefer code_graph_query.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:93:      enableSessionBoost: {
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:99:        description: 'Enable causal-neighbor boost (2-hop traversal on causal_edges). Defaults to SPECKIT_CAUSAL_BOOST env flag.'
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:104:        description: 'Include full file content in results. When true, each result includes a "content" field with the memory file contents. This embeds load logic directly in search, eliminating the need for separate load calls. When implicit feedback logging is enabled, includeContent searches also emit shadow-only result_cited events for returned memories.'
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:111:      profile: {
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:113:        enum: ['quick', 'research', 'resume', 'debug'],
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:114:        description: 'Optional response profile formatter. Returns a reduced or mode-aware response shape when profile formatting is enabled.'
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:165:      trackAccess: {
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:168:        description: 'When true, writes FSRS strengthening updates to memory_index for each returned result. Off by default to avoid write-on-read side effects.'
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:184:        description: 'When true (or when SPECKIT_RESPONSE_TRACE=true), include provenance-rich scores/source/trace envelope fields in each result.'
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:298:  name: 'memory_validate',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:485:  description: '[L6:Analysis] Trace causal chain for a memory to answer "why was this decision made?" Traverses causal edges up to maxDepth hops, grouping results by relationship type (caused, enabled, supersedes, contradicts, derived_from, supports). Use to understand decision lineage and memory relationships. Token Budget: 1200.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:487:  inputSchema: { type: 'object', additionalProperties: false, properties: { memoryId: { type: 'string', description: 'Memory ID to trace causal lineage for (number or string, required)' }, maxDepth: { type: 'number', default: 3, minimum: 1, maximum: 10, description: 'Maximum traversal depth (default: 3, max: 10)' }, direction: { type: 'string', description: 'Traversal direction: outgoing, incoming, or both (default: both)' }, relations: { type: 'array', items: { type: 'string' }, description: 'Filter to specific relationship types: caused, enabled, supersedes, contradicts, derived_from, supports' }, includeMemoryDetails: { type: 'boolean', default: true, description: 'Include full memory details in results' } }, required: ['memoryId'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:491:  name: 'memory_causal_link',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:492:  description: '[L6:Analysis] Create a causal relationship between two memories. Links represent decision lineage (caused, enabled), versioning (supersedes), contradictions, derivation, or support. Token Budget: 1200.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:497:  name: 'memory_causal_stats',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:498:  description: '[L6:Analysis] Get statistics about the causal memory graph. Shows total edges, coverage percentage, and breakdown by relationship type. Target: 60% of memories linked (CHK-065). Token Budget: 1200.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:503:  name: 'memory_causal_unlink',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:504:  description: '[L6:Analysis] Remove a causal relationship by edge ID. Use memory_drift_why to find edge IDs. Token Budget: 1200.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:564:  inputSchema: { type: 'object', additionalProperties: false, properties: { specFolder: { type: 'string', description: 'Limit scan to specific spec folder (e.g., "005-memory")' }, force: { type: 'boolean', default: false, description: 'Force re-index all files (ignore content hash)' }, includeConstitutional: { type: 'boolean', default: true, description: 'Whether to scan .opencode/skill/*/constitutional/ directories' }, includeSpecDocs: { type: 'boolean', default: true, description: 'Whether to scan .opencode/specs/ directories for spec folder documents (spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, research/research.md, handover.md). Iteration artifacts under research/iterations/ and review/iterations/ are excluded from spec-doc indexing. Set SPECKIT_INDEX_SPEC_DOCS=false env var to disable globally.' }, incremental: { type: 'boolean', default: true, description: 'Enable incremental indexing. When true (default), skips files whose mtime and content hash are unchanged since last index. Set to false to re-evaluate all files regardless of change detection.' } }, required: [] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:691:      profile: { type: 'string', enum: ['quick', 'research', 'debug'], description: 'Output density profile' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:692:      includeTrace: { type: 'boolean', description: 'Include trace metadata in response for debugging' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:786:      loopType: { type: 'string', enum: ['research', 'review'], description: 'Loop type: research or review (required)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:832:      loopType: { type: 'string', enum: ['research', 'review'], description: 'Loop type (required)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:850:      loopType: { type: 'string', enum: ['research', 'review'], description: 'Loop type (required)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:858:  description: '[L9:CoverageGraph] Composite convergence assessment for deep-loop coverage graph. Returns a typed decision (CONTINUE, STOP_ALLOWED, STOP_BLOCKED), signal values, blockers with severity levels, and a typed trace explaining each signal threshold evaluation. For research: evaluates questionCoverage, claimVerificationRate, contradictionDensity, plus blocking guards sourceDiversity and evidenceDepth. For review: evaluates dimensionCoverage, findingStability, p0ResolutionRate, evidenceDensity, hotspotSaturation. Extends Phase 001 stop logic without replacing newInfoRatio.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:863:      loopType: { type: 'string', enum: ['research', 'review'], description: 'Loop type (required)' },
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:62:// Retrieval trace contracts (C136-08)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:63:import { createTrace } from '@spec-kit/shared/contracts/retrieval-trace';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:75:} from '../lib/response/profile-formatters.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:103:// Feature catalog: Quality-aware 3-tier search fallback
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:125:  last_review?: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:139:  contentSource?: 'reassembled_chunks' | 'file_read_fallback';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:202:  trackAccess?: boolean; // opt-in access tracking (default false)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:204:  enableSessionBoost?: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:211:  /** REQ-D5-003: Presentation profile ('quick'|'research'|'resume'|'debug'). Default: full response. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:212:  profile?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:213:  /** Phase B T019: Dual-level retrieval — 'local' (entity), 'global' (community), 'auto' (local + fallback). */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:365:  if (typeof data.fallbackState !== 'string' && snapshot) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:366:    data.fallbackState = snapshot.fallbackState;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:519:    trackAccess: trackAccess = false, // opt-in, off by default
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:521:    enableSessionBoost: enableSessionBoost = isSessionBoostEnabled(),
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:528:    profile,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:675:    if (classification.fallback) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:676:      console.error(`[memory-search] Intent auto-detected as '${detectedIntent}' (fallback: ${classification.reason})`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:691:  // Phase C: Intent-to-profile auto-routing.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:692:  // Explicit caller `profile` always takes precedence; auto-detect fills in when absent.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:693:  let effectiveProfile: string | undefined = profile;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:699:        console.error(`[memory-search] Intent-to-profile auto-routing: '${detectedIntent}' → profile '${autoProfile}'`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:702:      // Auto-profile is best-effort — never breaks search
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:706:  // Re-run artifact routing with detected intent for fallback coverage
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:711:  // Create retrieval trace at pipeline entry
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:712:  const trace = createTrace(
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:745:    enableSessionBoost,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:799:      enableSessionBoost,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:801:      trackAccess,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:806:      trace,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:812:    // Phase B T018/T019: Community search fallback — inject community members on weak results
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:858:          console.warn(`[memory-search] Community search fallback failed (fail-open): ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:908:        `[memory-search] Lexical capability path '${lexicalCapability.lexicalPath}' (fallbackState: ${lexicalCapability.fallbackState})`
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:921:      extraData.fallbackState = lexicalCapability.fallbackState;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:965:    if (pipelineResult.trace) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:966:      extraData.retrievalTrace = pipelineResult.trace;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:986:      causal: { applied: pipelineResult.metadata.stage2.causalBoostApplied },
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1251:  // REQ-D4-001: Implicit feedback — log search_shown events for returned results
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1270:            type: 'search_shown',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1283:  // REQ-014: Query flow tracking + result_cited for includeContent searches
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1284:  // Shadow-only: emits query_reformulated, same_topic_requery, and result_cited events.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1317:        // Log result_cited for includeContent searches (content was embedded = cited)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1325:  // REQ-D5-003: Apply presentation profile when flag is enabled and profile is specified.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1326:  // Phase C: effectiveProfile includes auto-routed profile from intent detection.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1331:        const profiled = applyProfileToEnvelope(effectiveProfile, firstEntry.text);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1332:        if (profiled !== firstEntry.text) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1335:            content: [{ ...firstEntry, text: profiled }],
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1338:      } catch (_profileError: unknown) {

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go | sed -n '20,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    20	
    21		searchHandler := func(args map[string]interface{}) (string, error) {
    22			query, _ := args["query"].(string)
    23			limit := 10
    24			if l, ok := args["limit"].(float64); ok {
    25				limit = int(l)
    26			}
    27	
    28			// If the librarian is available, expand the query for better recall
    29			var allResults []index.SearchResult
    30			if librarian.Available() {
    31				expansions := librarian.ExpandQuery(query)
    32				log.Printf("vault_search: librarian expanded %q → %d variants", query, len(expansions))
    33				seen := map[string]bool{}
    34				for _, exp := range expansions {
    35					results, err := v.Search(exp, limit)
    36					if err != nil {
    37						continue
    38					}
    39					for _, r := range results {
    40						if !seen[r.Path] {
    41							seen[r.Path] = true
    42							allResults = append(allResults, r)
    43						}
    44					}
    45				}
    46			} else {
    47				// Fallback: direct FTS5 search without librarian
    48				results, err := v.Search(query, limit)
    49				if err != nil {
    50					return "", err
    51				}
    52				allResults = results
    53			}
    54	
    55			// Cap at requested limit
    56			if len(allResults) > limit {
    57				allResults = allResults[:limit]
    58			}
    59	
    60			var sb strings.Builder
    61			sb.WriteString(fmt.Sprintf("Found %d results for %q:\n\n", len(allResults), query))
    62			for i, r := range allResults {
    63				sb.WriteString(fmt.Sprintf("%d. **%s**\n", i+1, r.Path))
    64				if r.Subject != "" {
    65					sb.WriteString(fmt.Sprintf("   Subject: %s\n", r.Subject))
    66				}
    67				if r.Snippet != "" {
    68					clean := strings.ReplaceAll(r.Snippet, "<b>", "**")
    69					clean = strings.ReplaceAll(clean, "</b>", "**")
    70					sb.WriteString(fmt.Sprintf("   %s\n", clean))
    71				}
    72				sb.WriteByte('\n')
    73			}
    74	
    75			// Append cross-reference hints — show connected docs the agent might want
    76			if v.Index != nil {
    77				refs := v.Index.Connected(query, 5)
    78				if len(refs) > 0 {
    79					// Filter out docs already in results
    80					resultPaths := make(map[string]bool)
    81					for _, r := range allResults {
    82						resultPaths[r.Path] = true
    83					}
    84					var extra []index.DocRef
    85					for _, ref := range refs {
    86						if !resultPaths[ref.Path] {
    87							extra = append(extra, ref)
    88						}
    89					}
    90					if len(extra) > 0 {
    91						sb.WriteString("**Cross-references** (connected docs not in results above):\n")
    92						for _, ref := range extra {
    93							title := ref.Title
    94							if title == "" {
    95								title = ref.Path
    96							}
    97							sb.WriteString(fmt.Sprintf("- [%s] %s `%s`\n", ref.Kind, title, ref.Path))
    98						}
    99					}
   100				}
   101			}
   102	
   103			return sb.String(), nil
   104		}
   105	
   106		searchSchema := map[string]interface{}{
   107			"type": "object",
   108			"properties": map[string]interface{}{
   109				"query": map[string]interface{}{"type": "string", "description": "Search query"},
   110				"limit": map[string]interface{}{"type": "integer", "description": "Max results (default 10)"},
   111			},
   112			"required": []string{"query"},
   113		}
   114	
   115		srv.AddTool("vault_search", "Search the vault — brain, memory, atlas, missions.", searchSchema, searchHandler)
   116	
   117		// --- Read ---
   118	
   119		srv.AddTool("vault_read", "Read a vault file by relative path.", map[string]interface{}{
   120			"type": "object",

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go | sed -n '270,345p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go | sed -n '850,925p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

codex
The main contrast is getting sharper: Modus exposes a compact control plane and relies on plain files plus small in-memory structures, while Public already has richer routing, feedback, and causal context but hides more of that behind trace/profile plumbing. I’m pulling the exact Public line ranges now so the ADR can be specific about what we already have versus what Modus would actually add.
exec
/bin/zsh -lc 'rg -n "11 MCP tools|cached|microseconds|milliseconds|markdown|vault_connected|memory_reinforce|memory_search|BM25|field|cache|librarian" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
9:  <a href="#the-librarian-pattern"><strong>Librarian</strong></a> ·
27:**modus-memory** is a personal memory server that runs on your machine, stores everything in plain markdown, and connects to any AI client via [MCP](https://modelcontextprotocol.io).
31:> **Completely free. 19,000+ documents indexed in 2 seconds. Cached searches in <100 microseconds. 6MB binary, zero dependencies.**
53:- **BM25 full-text search** with field boosting and query caching — 19K docs in <5ms
57:- **Plain markdown storage** — your data is always yours, always readable
193:modus-memory exposes 11 MCP tools — all free, no limits:
197:| `vault_search` | BM25 full-text search with librarian query expansion and cross-reference hints |
199:| `vault_write` | Write a document with YAML frontmatter + markdown body |
203:| `memory_search` | Search memory facts with automatic FSRS reinforcement on recall |
205:| `memory_reinforce` | Explicitly reinforce a memory — increases stability, decreases difficulty |
207:| `vault_connected` | Cross-reference query — find everything linked to a subject, tag, or entity |
233:**[Full guide: system prompt, model recommendations, example flows, and wiring patterns →](docs/librarian.md)**
243:Everything is a markdown file with YAML frontmatter:
245:```markdown
263:- **BM25** with field-level boosting (title 3x, subject 2x, tags 1.5x, body 1x)
264:- **Tiered query cache** — exact hash match, then Jaccard fuzzy match
298:Multiple agents can share the same vault. Point Claude Desktop, Cursor, a CrewAI pipeline, and a cron job at the same `--vault` directory — they all read and write the same markdown files.
314:| Can I read my data without modus-memory? | Yes. It's markdown with YAML frontmatter. `cat`, `grep`, VS Code — anything works. |
316:| Does search require an API key? | No. BM25 runs locally. No LLM calls on the search path. Librarian expansion uses a local synonym map, not a cloud API. |
339:- **Missing fields** — facts without `subject` or `predicate`
375:| **Storage** | PostgreSQL | Plain markdown files |
376:| **Search** | Embeddings (needs GPU or API key) | BM25 (instant, local, no GPU) |
421:| Cached search | <100 microseconds |
422:| Cold search | <5 milliseconds |
436:modus-memory is a full-featured memory system: BM25 ranked search, FSRS spaced repetition, cross-references, librarian query expansion, and a markdown-based vault you can browse and edit. It's designed for long-term personal knowledge, not just key-value storage.
456:Yes. Each client spawns its own modus-memory process, but they all read/write the same vault directory. The index is rebuilt on startup (takes ~2 seconds), and writes go directly to disk as markdown files. There's no lock contention for reads.
462:The index is pure in-memory Go. Startup time scales roughly linearly — expect ~10 seconds for 100K docs on Apple Silicon. Search time stays constant (cache hit) or sub-10ms (cold). The binary's memory usage is roughly 2x the total text size of your vault.
473:The binary itself never encrypts or decrypts — it reads plaintext markdown from the path you provide.
479:Your vault is a directory of markdown files. Sync it however you sync files:
497:Currently supported: **Khoj** (ZIP or JSON export). The import system is extensible — adding new sources means writing a converter from their export format to markdown files.

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts | sed -n '1,200p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '500,980p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
   621	  }
   622	
   623	  if (specFolder !== undefined && typeof specFolder !== 'string') {
   624	    return createMCPErrorResponse({
   625	      tool: 'memory_search',
   626	      error: 'specFolder must be a string',
   627	      code: 'E_VALIDATION',
   628	      details: { parameter: 'specFolder' },
   629	      recovery: {
   630	        hint: 'Provide specFolder as a string path'
   631	      }
   632	    });
   633	  }
   634	
   635	  // Eval logger — capture query at pipeline entry (fail-safe)
   636	  let _evalQueryId = 0;
   637	  let _evalRunId = 0;
   638	  try {
   639	    const evalEntry = logSearchQuery({
   640	      query: effectiveQuery,
   641	      intent: explicitIntent ?? null,
   642	      specFolder: specFolder ?? null,
   643	    });
   644	    _evalQueryId = evalEntry.queryId;
   645	    _evalRunId = evalEntry.evalRunId;
   646	  } catch (_error: unknown) { /* eval logging must never break search */ }
   647	
   648	  const artifactRoutingQuery = resolveArtifactRoutingQuery(
   649	    normalizedQuery,
   650	    hasValidConcepts ? concepts : undefined
   651	  );
   652	  let artifactRouting = getStrategyForQuery(artifactRoutingQuery, specFolder);
   653	
   654	  // Intent-aware retrieval
   655	  let detectedIntent: string | null = null;
   656	  let intentConfidence = 0;
   657	  let intentWeights: IntentWeights | null = null;
   658	
   659	  if (explicitIntent) {
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
   731	    contextType,
   732	    useDecay,
   733	    includeArchived,
   734	    qualityThreshold,
   735	    applyStateLimits,
   736	    includeContiguity,
   737	    includeConstitutional,
   738	    includeContent,
   739	    anchors,
   740	    detectedIntent,
   741	    minState: minState ?? '',
   742	    rerank,
   743	    applyLengthPenalty,
   744	    sessionId,
   745	    enableSessionBoost,
   746	    enableCausalBoost,
   747	    includeTrace,
   748	  });
   749	
   750	  let _evalChannelPayloads: EvalChannelPayload[] = [];
   751	  const cacheKey = toolCache.generateCacheKey('memory_search', cacheArgs);
   752	  const cacheEnabled = toolCache.isEnabled() && !bypassCache;
   753	  const cachedPayload = cacheEnabled
   754	    ? toolCache.get<SearchCachePayload>(cacheKey)
   755	    : null;
   756	
   757	  let responseToReturn: MCPResponse;
   758	  let goalRefinementPayload: Record<string, unknown> | null = null;
   759	
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
   831	            const db = requireDb();
   832	            const memberRows = db.prepare(`
   833	              SELECT id, title, similarity, content, file_path, importance_tier, context_type,
   834	                     quality_score, created_at
   835	              FROM memory_index
   836	              WHERE id IN (${placeholders})
   837	            `).all(...memberIds) as Array<Record<string, unknown> & { id: number }>;
   838	
   839	            if (memberRows.length > 0) {
   840	              // Mark community-sourced results and assign a base score
   841	              const communityRows = memberRows.map((row) => ({
   842	                ...row,
   843	                similarity: typeof row.similarity === 'number' ? row.similarity : 0.5,
   844	                score: 0.45,
   845	                _communityFallback: true,
   846	              }));
   847	              // Merge: append community results not already in pipeline results
   848	              const existingIds = new Set(resultsForFormatting.map((r) => (r as Record<string, unknown>).id as number));
   849	              const newRows = communityRows.filter((r) => !existingIds.has(r.id));
   850	              if (newRows.length > 0) {
   851	                resultsForFormatting = [...resultsForFormatting, ...newRows as unknown as SessionAwareResult[]];
   852	                communityFallbackApplied = true;
   853	              }
   854	            }
   855	          }
   856	        } catch (err: unknown) {
   857	          const msg = err instanceof Error ? err.message : String(err);
   858	          console.warn(`[memory-search] Community search fallback failed (fail-open): ${msg}`);
   859	        }
   860	      }
   861	    }
   862	
   863	    // Fix 4 (RC1-B): Apply folder boost — multiply similarity for results matching discovered folder
   864	    if (folderBoost && folderBoost.folder && folderBoost.factor > 1) {
   865	      let boostedCount = 0;
   866	      for (const r of resultsForFormatting) {
   867	        const filePath = (r as Record<string, unknown>).file_path as string | undefined;
   868	        if (filePath && filePath.includes(folderBoost.folder)) {
   869	          const raw = (r as Record<string, unknown>);
   870	          if (typeof raw.similarity === 'number') {
   871	            raw.similarity = Math.min(raw.similarity * folderBoost.factor, 1.0);
   872	            boostedCount++;
   873	          }
   874	        }
   875	      }
   876	      // Re-sort by similarity after boosting
   877	      if (boostedCount > 0) {
   878	        resultsForFormatting.sort((a, b) => {
   879	          const sa = (a as Record<string, unknown>).similarity as number ?? 0;
   880	          const sb = (b as Record<string, unknown>).similarity as number ?? 0;
   881	          return sb - sa;
   882	        });
   883	      }
   884	    }
   885	
   886	    if (sessionId && isSessionRetrievalStateEnabled()) {
   887	      const activeGoal = effectiveQuery.trim().length > 0 ? effectiveQuery : null;
   888	      if (activeGoal) {
   889	        retrievalSessionStateManager.updateGoal(sessionId, activeGoal);
   890	      }
   891	      if (Array.isArray(anchors) && anchors.length > 0) {
   892	        retrievalSessionStateManager.setAnchors(sessionId, anchors);
   893	      }
   894	
   895	      const goalRefinement = refineForGoal(resultsForFormatting, sessionId);
   896	      resultsForFormatting = goalRefinement.results as SessionAwareResult[];
   897	      goalRefinementPayload = {
   898	        activeGoal: goalRefinement.metadata.activeGoal,
   899	        applied: goalRefinement.metadata.refined,
   900	        boostedCount: goalRefinement.metadata.boostedCount,
   901	      };
   902	    }
   903	
   904	    // Build extra data from pipeline metadata for response formatting
   905	    const lexicalCapability = getLastLexicalCapabilitySnapshot();
   906	    if (lexicalCapability) {
   907	      console.error(
   908	        `[memory-search] Lexical capability path '${lexicalCapability.lexicalPath}' (fallbackState: ${lexicalCapability.fallbackState})`
   909	      );
   910	    }
   911	
   912	    const extraData: Record<string, unknown> = {
   913	      stateStats: pipelineResult.annotations.stateStats,
   914	      featureFlags: {
   915	        ...pipelineResult.annotations.featureFlags,
   916	      },
   917	      pipelineMetadata: pipelineResult.metadata,
   918	    };
   919	    if (lexicalCapability) {
   920	      extraData.lexicalPath = lexicalCapability.lexicalPath;
   921	      extraData.fallbackState = lexicalCapability.fallbackState;
   922	    }
   923	
   924	    if (pipelineResult.annotations.evidenceGapWarning) {
   925	      extraData.evidenceGapWarning = pipelineResult.annotations.evidenceGapWarning;
   926	    }
   927	
   928	    if (detectedIntent) {
   929	      extraData.intent = {
   930	        type: detectedIntent,
   931	        confidence: intentConfidence,
   932	        description: intentClassifier.getIntentDescription(detectedIntent as IntentType),
   933	        weightsApplied: pipelineResult.metadata.stage2.intentWeightsApplied,
   934	      };
   935	    }
   936	
   937	    if (artifactRouting) {
   938	      extraData.artifactRouting = artifactRouting;
   939	      extraData.artifact_routing = artifactRouting;
   940	    }
   941	
   942	    if (pipelineResult.metadata.stage2.feedbackSignalsApplied === 'applied') {
   943	      extraData.feedbackSignals = { applied: true };
   944	      extraData.feedback_signals = { applied: true };
   945	    }
   946	
   947	    if (pipelineResult.metadata.stage2.graphContribution) {
   948	      extraData.graphContribution = pipelineResult.metadata.stage2.graphContribution;
   949	      extraData.graph_contribution = pipelineResult.metadata.stage2.graphContribution;
   950	    }
   951	
   952	    if (pipelineResult.metadata.stage3.rerankApplied) {
   953	      extraData.rerankMetadata = {
   954	        reranking_enabled: true,
   955	        reranking_requested: true,
   956	        reranking_applied: true,
   957	      };
   958	    }
   959	
   960	    if (pipelineResult.metadata.stage3.chunkReassemblyStats.chunkParents > 0) {
   961	      extraData.chunkReassembly = pipelineResult.metadata.stage3.chunkReassemblyStats;
   962	      extraData.chunk_reassembly = pipelineResult.metadata.stage3.chunkReassemblyStats;
   963	    }
   964	
   965	    if (pipelineResult.trace) {
   966	      extraData.retrievalTrace = pipelineResult.trace;
   967	    }
   968	    try {
   969	      const adaptiveShadow = buildAdaptiveShadowProposal(
   970	        requireDb(),
   971	        effectiveQuery,
   972	        resultsForFormatting as Array<Record<string, unknown> & { id: number }>,
   973	      );
   974	      if (adaptiveShadow) {
   975	        extraData.adaptiveShadow = adaptiveShadow;
   976	        extraData.adaptive_shadow = adaptiveShadow;
   977	      }
   978	    } catch (_error: unknown) {
   979	      // Adaptive proposal logging is best-effort only
   980	    }

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '1240,1345p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1240	          evalRunId: _evalRunId,
  1241	          queryId: _evalQueryId,
  1242	          channel: payload.channel,
  1243	          resultMemoryIds: payload.resultMemoryIds,
  1244	          scores: payload.scores,
  1245	          hitCount: payload.resultMemoryIds.length,
  1246	        });
  1247	      }
  1248	    }
  1249	  } catch (_error: unknown) { /* eval logging must never break search */ }
  1250	
  1251	  // REQ-D4-001: Implicit feedback — log search_shown events for returned results
  1252	  // Shadow-only: no ranking side effects. Fail-safe, never throws.
  1253	  try {
  1254	    if (isImplicitFeedbackLogEnabled()) {
  1255	      const db = (() => { try { return requireDb(); } catch (_error: unknown) { return null; } })();
  1256	      if (db) {
  1257	        let shownMemoryIds: number[] = [];
  1258	        try {
  1259	          if (responseToReturn?.content?.[0]?.text) {
  1260	            const parsed = JSON.parse(responseToReturn.content[0].text) as Record<string, unknown>;
  1261	            const data = parsed?.data as Record<string, unknown> | undefined;
  1262	            const results = Array.isArray(data?.results) ? data.results as Array<Record<string, unknown>> : [];
  1263	            shownMemoryIds = results.map(r => r.id as number).filter(id => typeof id === 'number');
  1264	          }
  1265	        } catch (_error: unknown) { /* ignore parse errors */ }
  1266	
  1267	        if (shownMemoryIds.length > 0) {
  1268	          const queryId = _evalQueryId ? String(_evalQueryId) : String(_searchStartTime);
  1269	          const feedbackEvents: FeedbackEvent[] = shownMemoryIds.map(memId => ({
  1270	            type: 'search_shown',
  1271	            memoryId: String(memId),
  1272	            queryId,
  1273	            confidence: 'weak',
  1274	            timestamp: _searchStartTime,
  1275	            sessionId: sessionId ?? null,
  1276	          }));
  1277	          logFeedbackEvents(db, feedbackEvents);
  1278	        }
  1279	      }
  1280	    }
  1281	  } catch (_error: unknown) { /* feedback logging must never break search */ }
  1282	
  1283	  // REQ-014: Query flow tracking + result_cited for includeContent searches
  1284	  // Shadow-only: emits query_reformulated, same_topic_requery, and result_cited events.
  1285	  try {
  1286	    if (isImplicitFeedbackLogEnabled()) {
  1287	      const db = (() => { try { return requireDb(); } catch (_error: unknown) { return null; } })();
  1288	      if (db) {
  1289	        // Extract shown memory IDs from response (reuse parsed data if available)
  1290	        let shownIds: string[] = [];
  1291	        try {
  1292	          if (responseToReturn?.content?.[0]?.text) {
  1293	            const parsed = JSON.parse(responseToReturn.content[0].text) as Record<string, unknown>;
  1294	            const data = parsed?.data as Record<string, unknown> | undefined;
  1295	            const results = Array.isArray(data?.results) ? data.results as Array<Record<string, unknown>> : [];
  1296	            shownIds = results.flatMap((result) => {
  1297	              const candidate = result.id;
  1298	              if (typeof candidate !== 'number' && typeof candidate !== 'string') {
  1299	                return [];
  1300	              }
  1301	              const normalizedId = String(candidate).trim();
  1302	              if (!normalizedId || normalizedId === 'undefined' || normalizedId === 'null') {
  1303	                return [];
  1304	              }
  1305	              return [normalizedId];
  1306	            });
  1307	          }
  1308	        } catch (_error: unknown) { /* ignore parse errors */ }
  1309	
  1310	        const queryId = _evalQueryId ? String(_evalQueryId) : String(_searchStartTime);
  1311	
  1312	        // Track query flow — detects reformulations and same-topic re-queries
  1313	        if (normalizedQuery) {
  1314	          trackQueryAndDetect(db, sessionId ?? null, normalizedQuery, queryId, shownIds);
  1315	        }
  1316	
  1317	        // Log result_cited for includeContent searches (content was embedded = cited)
  1318	        if (includeContent && shownIds.length > 0) {
  1319	          logResultCited(db, sessionId ?? null, queryId, shownIds);
  1320	        }
  1321	      }
  1322	    }
  1323	  } catch (_error: unknown) { /* query flow tracking must never break search */ }
  1324	
  1325	  // REQ-D5-003: Apply presentation profile when flag is enabled and profile is specified.
  1326	  // Phase C: effectiveProfile includes auto-routed profile from intent detection.
  1327	  if (effectiveProfile && typeof effectiveProfile === 'string' && isResponseProfileEnabled()) {
  1328	    const firstEntry = responseToReturn?.content?.[0];
  1329	    if (firstEntry && typeof firstEntry.text === 'string') {
  1330	      try {
  1331	        const profiled = applyProfileToEnvelope(effectiveProfile, firstEntry.text);
  1332	        if (profiled !== firstEntry.text) {
  1333	          responseToReturn = {
  1334	            ...responseToReturn,
  1335	            content: [{ ...firstEntry, text: profiled }],
  1336	          } as MCPResponse;
  1337	        }
  1338	      } catch (_profileError: unknown) {
  1339	        // Profile formatting is best-effort — never breaks search
  1340	      }
  1341	    }
  1342	  }
  1343	
  1344	  responseToReturn = attachLexicalCapabilityMetadata(
  1345	    responseToReturn,

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts | sed -n '288,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts | sed -n '40,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    40	// T061: L1 Orchestration - Unified entry point (Token Budget: 3500)
    41	const memoryContext: ToolDefinition = {
    42	  name: 'memory_context',
    43	  description: '[L1:Orchestration] Unified entry point for context retrieval with intent-aware routing. START HERE for most memory operations. For session recovery, use mode: \'resume\' with profile: \'resume\'. Automatically detects task intent (add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision) and routes to optimal retrieval strategy. Modes: auto (default), quick (trigger-based), deep (comprehensive), focused (intent-optimized), resume (session recovery). Token Budget: 3500. For code search by concept/intent, prefer mcp__cocoindex_code__search (CocoIndex). For structural code queries (callers, imports), prefer code_graph_query.',
    44	  inputSchema: { type: 'object', additionalProperties: false, properties: { input: { type: 'string', minLength: 1, description: 'The query, prompt, or context description (required)' }, mode: { type: 'string', enum: ['auto', 'quick', 'deep', 'focused', 'resume'], default: 'auto', description: 'Context retrieval mode: auto (detect intent), quick (fast triggers), deep (comprehensive search), focused (intent-optimized), resume (session recovery)' }, intent: { type: 'string', enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'], description: 'Explicit task intent. If not provided and mode=auto, intent is auto-detected from input.' }, specFolder: { type: 'string', description: 'Limit context to specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval when memory_context routes to memory_search.' }, userId: { type: 'string', description: 'User boundary for governed retrieval when memory_context routes to memory_search.' }, agentId: { type: 'string', description: 'Agent boundary for governed retrieval when memory_context routes to memory_search.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed retrieval when memory_context routes to memory_search.' }, limit: { type: 'number', minimum: 1, maximum: 100, description: 'Maximum results (mode-specific defaults apply)' }, sessionId: { type: 'string', description: 'Optional server-issued session identifier for working-memory continuity. When provided, it must match an existing server-managed session or the call is rejected. Omit it to let the server generate a new session for this request.' }, enableDedup: { type: 'boolean', default: true, description: 'Enable session deduplication' }, includeContent: { type: 'boolean', default: false, description: 'Include full file content in results' }, includeTrace: { type: 'boolean', default: false, description: 'Include provenance-rich trace data (scores, source, trace) in results when underlying memory_search is called' }, tokenUsage: { type: 'number', minimum: 0.0, maximum: 1.0, description: "Optional caller token usage ratio (0.0-1.0)" }, anchors: { type: 'array', items: { type: 'string' }, description: 'Filter content to specific anchors (e.g., ["state", "next-steps"] for resume mode)' }, profile: { type: 'string', enum: ['quick', 'research', 'resume', 'debug'], description: 'Optional response profile formatter. Returns a reduced or mode-aware response shape when profile formatting is enabled.' } }, required: ['input'] },
    45	};
    46	
    47	// L2: Core - Primary operations (Token Budget: 3500)
    48	const memorySearch: ToolDefinition = {
    49	  name: 'memory_search',
    50	  description: '[L2:Core] Search conversation memories semantically using vector similarity. Returns ranked results with similarity scores. Constitutional tier memories are ALWAYS included at the top of results (~2000 tokens max), regardless of query. Requires query (string), concepts (array of 2-5 strings), or cursor (string) for continuation pagination. Supports intent-aware retrieval (REQ-006) with task-specific weight adjustments. When implicit feedback logging is enabled, searches also emit shadow-only feedback signals such as search_shown and, for includeContent runs, result_cited. Token Budget: 3500. For code search by concept/intent, prefer mcp__cocoindex_code__search (CocoIndex). For structural code queries (callers, imports), prefer code_graph_query.',
    51	  inputSchema: {
    52	    type: 'object',
    53	    additionalProperties: false,
    54	    'x-requiredAnyOf': [['query'], ['concepts'], ['cursor']],
    55	    properties: {
    56	      cursor: {
    57	        type: 'string',
    58	        minLength: 1,
    59	        description: 'Opaque continuation cursor returned by progressive disclosure. When provided, resolves the next page without requiring a new query.'
    60	      },
    61	      query: { type: 'string', minLength: 2, maxLength: 1000, description: 'Natural language search query' },
    62	      concepts: {
    63	        type: 'array',
    64	        items: { type: 'string', minLength: 1 },
    65	        minItems: 2,
    66	        maxItems: 5,
    67	        description: 'Multiple concepts for AND search (requires 2-5 concepts). Results must match ALL concepts.'
    68	      },
    69	      specFolder: { type: 'string', description: 'Limit search to a specific spec folder (e.g., "011-spec-kit-memory-upgrade")' },
    70	      tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval. When provided with scope enforcement, results are isolated to this tenant.' },
    71	      userId: { type: 'string', description: 'User boundary for governed retrieval. Filters private or shared-space user-scoped memories.' },
    72	      agentId: { type: 'string', description: 'Agent boundary for governed retrieval. Filters agent-scoped memories.' },
    73	      sharedSpaceId: { type: 'string', description: 'Shared-memory space identifier. Requires explicit membership when shared memory rollout is enabled.' },
    74	      limit: { type: 'number', default: 10, minimum: 1, maximum: 100, description: 'Maximum number of results to return (1-100)' },
    75	      sessionId: {
    76	        type: 'string',
    77	        description: 'Session identifier for working memory and session deduplication (REQ-001). When provided with enableDedup=true, prevents duplicate memories from being returned in the same session (~50% token savings on follow-up queries).'
    78	      },
    79	      enableDedup: {
    80	        type: 'boolean',
    81	        default: true,
    82	        description: 'Enable session deduplication (REQ-001). When true and sessionId provided, filters out already-sent memories.'
    83	      },
    84	      tier: { type: 'string', description: 'Filter by importance tier (constitutional, critical, important, normal, temporary, deprecated)' },
    85	      contextType: { type: 'string', description: 'Filter by context type (decision, implementation, research, etc.)' },
    86	      useDecay: { type: 'boolean', default: true, description: 'Apply temporal decay scoring to results' },
    87	      includeContiguity: { type: 'boolean', default: false, description: 'Include adjacent/contiguous memories in results' },
    88	      includeConstitutional: {
    89	        type: 'boolean',
    90	        default: true,
    91	        description: 'Include constitutional tier memories at top of results (default: true)'
    92	      },
    93	      enableSessionBoost: {
    94	        type: 'boolean',
    95	        description: 'Enable session-based score boost from working_memory attention signals. Defaults to SPECKIT_SESSION_BOOST env flag.'
    96	      },
    97	      enableCausalBoost: {
    98	        type: 'boolean',
    99	        description: 'Enable causal-neighbor boost (2-hop traversal on causal_edges). Defaults to SPECKIT_CAUSAL_BOOST env flag.'
   100	      },
   101	      includeContent: {
   102	        type: 'boolean',
   103	        default: false,
   104	        description: 'Include full file content in results. When true, each result includes a "content" field with the memory file contents. This embeds load logic directly in search, eliminating the need for separate load calls. When implicit feedback logging is enabled, includeContent searches also emit shadow-only result_cited events for returned memories.'
   105	      },
   106	      anchors: {
   107	        type: 'array',
   108	        items: { type: 'string' },
   109	        description: 'Specific anchor IDs to extract from content. If provided, returned content will be filtered to only these sections. Requires includeContent: true.'
   110	      },
   111	      profile: {
   112	        type: 'string',
   113	        enum: ['quick', 'research', 'resume', 'debug'],
   114	        description: 'Optional response profile formatter. Returns a reduced or mode-aware response shape when profile formatting is enabled.'
   115	      },
   116	      min_quality_score: {
   117	        type: 'number',
   118	        minimum: 0,
   119	        maximum: 1,
   120	        description: 'Minimum quality score threshold (0.0-1.0). Results with lower quality_score are filtered out.'

exec
/bin/zsh -lc 'bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main" --strict' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1139ms:

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
I’ve finished the code comparison and kicked off a strict validation check on the phase folder so the assessment stays aligned with the packet’s completion rules even though this pass is read-only. While that runs, I’m distilling the architecture decisions into a tighter adopt/prototype/reject ADR instead of repeating the earlier feature-by-feature findings.
Read-only iteration 29 research pass is in synthesis. Code evidence and validation are complete; I’m consolidating the architectural decisions into the requested ADR output.
  ✓ Quick memory pass and deep-research skill check
  ✓ Read Modus ranking, FSRS, cross-reference, markdown, MCP, and README evidence
  ✓ Read current Public memory retrieval and FSRS counterparts
  ✓ Run strict validation on the phase folder
  → Synthesize iteration 29 architecture decision record
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts | sed -n '120,190p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts | sed -n '236,340p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   120	        description: 'Minimum quality score threshold (0.0-1.0). Results with lower quality_score are filtered out.'
   121	      },
   122	      minQualityScore: {
   123	        type: 'number',
   124	        minimum: 0,
   125	        maximum: 1,
   126	        description: 'Deprecated alias for min_quality_score. Prefer snake_case parameter name.'
   127	      },
   128	      bypassCache: {
   129	        type: 'boolean',
   130	        default: false,
   131	        description: 'Skip the tool cache and force a fresh search. Useful when underlying data has changed since last cached result.'
   132	      },
   133	      rerank: {
   134	        type: 'boolean',
   135	        default: true,
   136	        description: 'Enable cross-encoder reranking of results. Improves relevance at the cost of additional computation.'
   137	      },
   138	      applyLengthPenalty: {
   139	        type: 'boolean',
   140	        default: true,
   141	        description: 'Apply length-based penalty during reranking. Penalizes very long memories to favor concise, focused results. Only effective when rerank is true.'
   142	      },
   143	      applyStateLimits: {
   144	        type: 'boolean',
   145	        default: false,
   146	        description: 'Apply per-tier quantity limits to results. When true, enforces maximum counts per state tier to balance result diversity.'
   147	      },
   148	      minState: {
   149	        type: 'string',
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

 succeeded in 0ms:
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
   281	      ([legacy, canonical]) => [legacy, canonical === 'planning' ? Infinity : canonical === 'research' ? 2.0 : 1.0]
   282	    )
   283	  ),
   284	};
   285	
   286	/**
   287	 * TM-03: Importance-tier stability multipliers.
   288	 * Parallel to TIER_MULTIPLIER but operates on stability (not elapsed time).
   289	 * Used exclusively by getClassificationDecayMultiplier() when
   290	 * SPECKIT_CLASSIFICATION_DECAY is enabled. Do NOT combine with TIER_MULTIPLIER.
   291	 * constitutional/critical: Infinity = never decays.
   292	 * important: 1.5x stability → slower decay.
   293	 * normal: 1.0 → standard.
   294	 * temporary: 0.5x → faster decay (2x relative speed).
   295	 * deprecated: 0.25x → fastest decay (4x relative speed).
   296	 */
   297	const IMPORTANCE_TIER_STABILITY_MULTIPLIER: Record<string, number> = {
   298	  constitutional: Infinity, // never decays
   299	  critical: Infinity,       // never decays
   300	  important: 1.5,           // slower decay
   301	  normal: 1.0,              // standard
   302	  temporary: 0.5,           // faster decay
   303	  deprecated: 0.25,         // fastest decay
   304	};
   305	
   306	/**
   307	 * TM-03: Compute combined stability multiplier from context_type and importance_tier.
   308	 *
   309	 * Logic:
   310	 *   - If either dimension resolves to Infinity, the combined result is Infinity
   311	 *     (no-decay wins unconditionally).
   312	 *   - Unknown context_type or importance_tier values default to 1.0 (standard).
   313	 *   - Combined multiplier = contextMult * tierMult.
   314	 *
   315	 * When the result is Infinity, callers should treat stability as Infinity,
   316	 * which makes R(t) = (1 + factor * t / Infinity)^decay = 1.0 for all t.
   317	 *
   318	 * @param contextType    Memory context_type field (e.g. "decision", "research")
   319	 * @param importanceTier Memory importance_tier field (e.g. "constitutional", "normal")
   320	 * @returns Combined stability multiplier (may be Infinity)
   321	 */
   322	function getClassificationDecayMultiplier(contextType: string, importanceTier: string): number {
   323	  const contextMult = CONTEXT_TYPE_STABILITY_MULTIPLIER[contextType] ?? 1.0;
   324	  const tierMult = IMPORTANCE_TIER_STABILITY_MULTIPLIER[importanceTier] ?? 1.0;
   325	
   326	  // Infinity * anything = Infinity (no-decay wins)
   327	  if (!isFinite(contextMult) || !isFinite(tierMult)) {
   328	    return Infinity;
   329	  }
   330	
   331	  return contextMult * tierMult;
   332	}
   333	
   334	/**
   335	 * TM-03: Apply classification-based decay to a stability value.
   336	 * Gated by SPECKIT_CLASSIFICATION_DECAY env var (must be "true" or "1").
   337	 *
   338	 * Returns stability unchanged when the feature flag is disabled.
   339	 * Returns Infinity when the combined multiplier is Infinity (no-decay).
   340	 *

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts | sed -n '488,505p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   488	  // Core functions
   489	  calculateRetrievability,
   490	  updateStability,
   491	  calculateOptimalInterval,
   492	  updateDifficulty,
   493	  calculateElapsedDays,
   494	  getNextReviewDate,
   495	  createInitialParams,
   496	  processReview,
   497	};
   498	
   499	export type {
   500	  FsrsParams,
   501	  ReviewResult,
   502	  HybridDecayClass,
   503	};

codex
# Iteration 029: ARCHITECTURE DECISION RECORD

## Focus
ARCHITECTURE DECISION RECORD: Document the key architectural decisions this system made and why. Which decisions should we adopt and which should we reject?

## Findings
### Finding 1: A small, opinionated operator control plane is a real architectural advantage
- **Source**: [memory.go:7](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go#L7); [memory.go:18](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go#L18); [tool-schemas.ts:41](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L41); [tool-schemas.ts:48](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L48)
- **What it does**: Modus deliberately trims its exposed MCP surface to 11 memory-facing tools, while Public exposes a much richer retrieval platform with orchestration, search, graph, health, and profile surfaces.
- **Why it matters**: This is a DX architecture decision, not just naming. Modus is easier for operators and agents to learn because the “happy path” is obvious. Public is stronger, but its control plane is broader than many users need.
- **Recommendation**: **adopt now**
- **Impact**: **high**

### Finding 2: Lexical recall should be a complementary lane, not the core retrieval architecture
- **Source**: [bm25.go:16](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/bm25.go#L16); [cache.go:10](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go#L10); [indexer.go:160](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go#L160); [tool-schemas.ts:49](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L49); [memory-search.ts:771](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L771)
- **What it does**: Modus uses weighted BM25, prefix fallback, tiny query caching, OOD filtering, oversampling, and dedup as its main search path. Public already runs a richer hybrid pipeline with reranking, intent weighting, and multiple fallback lanes.
- **Why it matters**: Modus proves that lexical search can be fast and predictable, but its architecture is intentionally simpler than Public’s. Replacing Public’s hybrid stack with BM25 would be a downgrade; adding a lightweight lexical lane for specific debug or constrained-recall cases could still help.
- **Recommendation**: **prototype later**
- **Impact**: **medium**

### Finding 3: Search-route visibility is worth copying more than librarian expansion itself
- **Source**: [search.go:15](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go#L15); [vault.go:28](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L28); [vault.go:47](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L47); [memory-search.ts:675](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L675); [memory-search.ts:907](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L907); [memory-search.ts:1327](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L1327)
- **What it does**: Modus cleanly falls back to the original query when expansion is unavailable, and the route is conceptually easy to understand. Public already has stronger fail-open routing, but much of the explanation lives in stderr, metadata, or optional profiles.
- **Why it matters**: The durable architecture lesson is not “use an LLM expander.” It is “make the retrieval route legible.” Operators trust fallback when they can see which lane ran, which fallback triggered, and why.
- **Recommendation**: **adopt now**
- **Impact**: **medium**

### Finding 4: Explicit review and decay operations are the right control surface; write-on-read is not
- **Source**: [vault.go:311](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L311); [vault.go:856](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L856); [vault.go:885](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L885); [tool-schemas.ts:165](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L165); [tool-schemas.ts:297](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L297); [fsrs-scheduler.ts:200](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts#L200)
- **What it does**: Modus ships explicit `memory_reinforce` and `memory_decay_facts`, but it also auto-reinforces returned facts during `memory_search`. Public already has canonical FSRS review math and keeps `trackAccess` off by default to avoid write-on-read side effects; its exposed feedback action today is `memory_validate`, not a first-class graded review tool.
- **Why it matters**: The right architectural decision is explicit operator control over memory freshness, not silent mutation during observation. Public should copy the explicit control surface and reject the automatic mutation model.
- **Recommendation**: **adopt now**
- **Impact**: **high**

### Finding 5: Cheap adjacency maps are a useful complement to causal graphs, not a replacement
- **Source**: [crossref.go:9](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go#L9); [crossref.go:154](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go#L154); [vault.go:75](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L75); [tool-schemas.ts:97](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L97); [tool-schemas.ts:485](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L485); [fsrs.ts:25](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts#L25)
- **What it does**: Modus builds subject/tag/entity adjacency maps at index time and exposes connected documents directly. Public already has causal traversal and graph-aware freshness, but those are heavier semantic structures than simple adjacency hints.
- **Why it matters**: For compaction recovery and cheap rehydration, adjacency is often the fastest useful move. It is weaker than Public’s causal graph for “why” questions, but better for low-cost “what else is nearby?” expansion.
- **Recommendation**: **prototype later**
- **Impact**: **medium**

### Finding 6: Markdown-native persistence is the right source-of-truth pattern, but not a reason to split retrieval into a separate fact silo
- **Source**: [parser.go:98](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go#L98); [writer.go:10](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/writer.go#L10); [indexer.go:65](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go#L65); [facts.go:23](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/facts.go#L23); [README.md:27](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md#L27); [README.md:31](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md#L31)
- **What it does**: Modus keeps markdown as the canonical store and derives in-memory BM25, fact, and cross-reference indexes at startup. Its fact search is also a distinct sidecar path from general vault retrieval.
- **Why it matters**: The markdown-first decision is strong for operability, repair, and git ergonomics. The separate fact-search architecture is less attractive for Public, which already has unified retrieval, hybrid scoring, and governance metadata; duplicating a second primary retrieval silo would fragment ranking and operator expectations.
- **Recommendation**: **reject**
- **Impact**: **medium**

## Assessment
- New information ratio: **0.27**

## Recommended Next Focus
Turn this ADR into a final adoption matrix for iteration 30: map `adopt now` items to exact Public surfaces (`memory_review`, route-summary/debug output, compact operator bundle), keep adjacency hints in `prototype later`, and explicitly lock in the `reject` decisions on write-on-read reinforcement, BM25-only replacement, and a separate fact-silo retrieval path.
hook: Stop
hook: Stop Completed
tokens used
257,584
# Iteration 029: ARCHITECTURE DECISION RECORD

## Focus
ARCHITECTURE DECISION RECORD: Document the key architectural decisions this system made and why. Which decisions should we adopt and which should we reject?

## Findings
### Finding 1: A small, opinionated operator control plane is a real architectural advantage
- **Source**: [memory.go:7](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go#L7); [memory.go:18](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go#L18); [tool-schemas.ts:41](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L41); [tool-schemas.ts:48](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L48)
- **What it does**: Modus deliberately trims its exposed MCP surface to 11 memory-facing tools, while Public exposes a much richer retrieval platform with orchestration, search, graph, health, and profile surfaces.
- **Why it matters**: This is a DX architecture decision, not just naming. Modus is easier for operators and agents to learn because the “happy path” is obvious. Public is stronger, but its control plane is broader than many users need.
- **Recommendation**: **adopt now**
- **Impact**: **high**

### Finding 2: Lexical recall should be a complementary lane, not the core retrieval architecture
- **Source**: [bm25.go:16](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/bm25.go#L16); [cache.go:10](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go#L10); [indexer.go:160](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go#L160); [tool-schemas.ts:49](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L49); [memory-search.ts:771](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L771)
- **What it does**: Modus uses weighted BM25, prefix fallback, tiny query caching, OOD filtering, oversampling, and dedup as its main search path. Public already runs a richer hybrid pipeline with reranking, intent weighting, and multiple fallback lanes.
- **Why it matters**: Modus proves that lexical search can be fast and predictable, but its architecture is intentionally simpler than Public’s. Replacing Public’s hybrid stack with BM25 would be a downgrade; adding a lightweight lexical lane for specific debug or constrained-recall cases could still help.
- **Recommendation**: **prototype later**
- **Impact**: **medium**

### Finding 3: Search-route visibility is worth copying more than librarian expansion itself
- **Source**: [search.go:15](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go#L15); [vault.go:28](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L28); [vault.go:47](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L47); [memory-search.ts:675](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L675); [memory-search.ts:907](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L907); [memory-search.ts:1327](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L1327)
- **What it does**: Modus cleanly falls back to the original query when expansion is unavailable, and the route is conceptually easy to understand. Public already has stronger fail-open routing, but much of the explanation lives in stderr, metadata, or optional profiles.
- **Why it matters**: The durable architecture lesson is not “use an LLM expander.” It is “make the retrieval route legible.” Operators trust fallback when they can see which lane ran, which fallback triggered, and why.
- **Recommendation**: **adopt now**
- **Impact**: **medium**

### Finding 4: Explicit review and decay operations are the right control surface; write-on-read is not
- **Source**: [vault.go:311](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L311); [vault.go:856](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L856); [vault.go:885](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L885); [tool-schemas.ts:165](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L165); [tool-schemas.ts:297](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L297); [fsrs-scheduler.ts:200](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts#L200)
- **What it does**: Modus ships explicit `memory_reinforce` and `memory_decay_facts`, but it also auto-reinforces returned facts during `memory_search`. Public already has canonical FSRS review math and keeps `trackAccess` off by default to avoid write-on-read side effects; its exposed feedback action today is `memory_validate`, not a first-class graded review tool.
- **Why it matters**: The right architectural decision is explicit operator control over memory freshness, not silent mutation during observation. Public should copy the explicit control surface and reject the automatic mutation model.
- **Recommendation**: **adopt now**
- **Impact**: **high**

### Finding 5: Cheap adjacency maps are a useful complement to causal graphs, not a replacement
- **Source**: [crossref.go:9](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go#L9); [crossref.go:154](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go#L154); [vault.go:75](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L75); [tool-schemas.ts:97](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L97); [tool-schemas.ts:485](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L485); [fsrs.ts:25](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts#L25)
- **What it does**: Modus builds subject/tag/entity adjacency maps at index time and exposes connected documents directly. Public already has causal traversal and graph-aware freshness, but those are heavier semantic structures than simple adjacency hints.
- **Why it matters**: For compaction recovery and cheap rehydration, adjacency is often the fastest useful move. It is weaker than Public’s causal graph for “why” questions, but better for low-cost “what else is nearby?” expansion.
- **Recommendation**: **prototype later**
- **Impact**: **medium**

### Finding 6: Markdown-native persistence is the right source-of-truth pattern, but not a reason to split retrieval into a separate fact silo
- **Source**: [parser.go:98](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go#L98); [writer.go:10](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/writer.go#L10); [indexer.go:65](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go#L65); [facts.go:23](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/facts.go#L23); [README.md:27](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md#L27); [README.md:31](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md#L31)
- **What it does**: Modus keeps markdown as the canonical store and derives in-memory BM25, fact, and cross-reference indexes at startup. Its fact search is also a distinct sidecar path from general vault retrieval.
- **Why it matters**: The markdown-first decision is strong for operability, repair, and git ergonomics. The separate fact-search architecture is less attractive for Public, which already has unified retrieval, hybrid scoring, and governance metadata; duplicating a second primary retrieval silo would fragment ranking and operator expectations.
- **Recommendation**: **reject**
- **Impact**: **medium**

## Assessment
- New information ratio: **0.27**

## Recommended Next Focus
Turn this ADR into a final adoption matrix for iteration 30: map `adopt now` items to exact Public surfaces (`memory_review`, route-summary/debug output, compact operator bundle), keep adjacency hints in `prototype later`, and explicitly lock in the `reject` decisions on write-on-read reinforcement, BM25-only replacement, and a separate fact-silo retrieval path.
