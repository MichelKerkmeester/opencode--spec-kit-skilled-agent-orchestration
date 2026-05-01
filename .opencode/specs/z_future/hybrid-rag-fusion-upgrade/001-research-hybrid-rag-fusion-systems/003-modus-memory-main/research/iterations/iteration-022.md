### Finding 3: Keep one retrieval core; Modus’s split fact-search paths are a warning
- **Source**: `external/internal/index/indexer.go:287-340`; `external/internal/vault/facts.go:290-337`; `external/internal/mcp/vault.go:273-317`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:771-809`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/index.ts:1-32`
- **What it does**: Modus has multiple fact-search contracts for the same memory objects: `Index.SearchFacts`, a separate in-memory `factStore`, and `Vault.SearchFacts` fallback behavior. Public routes `memory_search` through one pipeline contract via `executePipeline`.
- **Why it matters for us**: This is the strongest architectural lesson from Modus’s weaknesses. Public should keep specialized search surfaces as thin wrappers over the canonical pipeline instead of growing parallel ranking rules that will drift.
- **Recommendation**: adopt now
--- Iteration 21 ---
## Findings

### Finding 1: Review queue risk — a Public `memory_due` inbox will be misleading unless it gets a first-class due-state contract
- **Source**: `external/internal/mcp/vault.go:280-317,856-897`; `external/internal/vault/facts.go:64-157,160-217`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2319-2343`; `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:65-71,177-215`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:512-520`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1194-1202`
- **What it does**: Modus keeps search recall, explicit reinforce, decay, and archive on the same fact fields. Public already persists `access_count`, `last_accessed`, `stability`, `difficulty`, `last_review`, and `review_count`, and `processReview()` computes `nextReviewDate`, but that due date is not persisted and read-time strengthening stays opt-in via `trackAccess=false`.
- **Why it matters for us**: If Public adds a due/review queue without defining one authoritative source of truth for “due,” the queue can drift from actual search behavior. A memory can look overdue while recent read activity updated its effective retrievability, which would make the inbox feel unreliable.
- **Recommendation**: **NEW FEATURE**
- **Impact**: **high**

### Finding 2: Doctor summary risk — a friendlier `doctor` surface can hide the repair semantics that currently keep Public safe
- **Source**: `external/cmd/modus-memory/doctor.go:13-242`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:343-530`; `.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:479-540`
- **What it does**: Modus’s `doctor` is compact: build the index, count issues, print warnings. Public’s health path is richer: degraded/healthy distinction, confirmation-gated auto-repair, FTS/vector/orphan cleanup, and partial-restore error reporting.
- **Why it matters for us**: The risk is lossy compression. If Public promotes a one-screen doctor summary as the main surface, operators may miss whether a problem is merely informational, auto-repairable, or a partial restore failure with rollback details.
- **Recommendation**: **adopt now**
- **Impact**: **medium**

### Finding 3: Lexical expansion risk — copying Modus’s librarian directly would stack another weak branch onto Public’s already-expanded deep pipeline
- **Source**: `external/internal/librarian/search.go:10-52`; `external/internal/mcp/vault.go:280-299`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:8-18,88-125,148-175`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:616-740`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:173-251`
- **What it does**: Modus asks an LLM for 3-5 keyword variants with no corpus grounding and searches each variant. Public already has deep-mode decomposition, corpus-grounded reformulation, and graph-expanded fallback queries.
- **Why it matters for us**: In Modus this is lightweight; in Public it risks branch explosion, extra latency, and noisier recall. Ungrounded lexical variants can duplicate or fight with stronger grounded/vector lanes, especially when reranking and graph fallback already exist.
- **Recommendation**: **prototype later**
## Findings

### Finding 1: Rank 1 (20/25) — explicit `memory_review` is the first thing Public should ship
- **Source**: `external/internal/mcp/memory.go:7-15`; `external/internal/mcp/vault.go:885-897`; `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:39-43,197-215`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:529-585,840-877,1194-1202`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:300-316`
- **What it does**: Modus exposes an explicit `memory_reinforce` operator action on top of its FSRS state. Public already has the underlying pieces: graded review math (`AGAIN/HARD/GOOD/EASY`), `processReview()` with `nextReviewDate`, and opt-in strengthening-on-access. The current exposed adjacent surface is `memory_validate`, which records only `wasUseful` feedback and does not let an operator issue a graded FSRS review.
- **Why it matters for us**: This is the highest impact x feasibility transfer because it closes the clearest control-plane gap without inventing new storage or changing retrieval architecture. It also de-risks the bigger `memory_due` idea: until Public has a first-class graded review action, any future review queue would have no trustworthy way to record hard recalls, lapses, and easy wins distinctly.
- **Recommendation**: **adopt now**
- **Impact**: **high**

- **Recommendation**: adopt now
- **Impact**: high

### Finding 4: Modus is uniquely strong on first-class spaced-repetition operations, not just background decay math
- **Source**: [facts.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go#L12), [vault.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L273), [fsrs-scheduler.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts#L39), [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L519)
- **What it does**: Modus alone exposes a visible memory lifecycle over shared fact state: search recall reinforces, explicit `memory_reinforce` reviews, decay sweeps, and stale archiving. Public already has stronger graded FSRS internals, but they are not yet surfaced as a first-class operator tool.
- **Why it matters**: This is the clearest thing Modus contributes that the other four phases do not. It makes `memory_review` the strongest immediate Modus-derived transfer, and it makes `memory_due` the next gated feature after the review contract is real.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 5: Modus is uniquely useful as a “related-memory appendix” pattern, because its crossrefs are lightweight and deliberately not a graph engine
- **Source**: [crossref.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go#L9), [vault.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L899), [research.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md#L9806)
- **What it does**: Modus builds subject/entity/tag adjacency in memory, scores it with fixed weights (`3/2/1`), and returns it as connected material beside the main result set instead of pretending it is a full causal graph.
- **Why it matters**: None of the other four systems gave this exact middle ground. For Public, that makes it a credible explanation-layer experiment, while ranking should stay with the canonical hybrid and graph-backed paths.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 6: Modus is uniquely opinionated about durable knowledge-change review objects and fact-content lint
- **Source**: [prs.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/prs.go#L10), [vault.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L681), [doctor.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/doctor.go#L42), [research.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md#L9799)
- **What it does**: Modus persists PR-like evolution proposals in markdown and ties merge/reject outcomes back to belief strengthening or weakening; separately, `doctor` checks for missing fact fields, duplicate `subject+predicate`, and contradictory values.
- **Why it matters**: Mex has repair briefs and MemPalace has temporal facts, but Modus is the only one that turns memory evolution into durable review artifacts plus fact-content QA. That makes it the strongest source for a future proposal inbox and contradiction-lint layer in Public.
- **Recommendation**: NEW FEATURE
- **Impact**: high

## Assessment
- New information ratio: 0.34
- Validation: strict validation on [003-modus-memory-main](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main) returned `RESULT: PASSED`; the script also printed `cannot create temp file for here document: Operation not permitted`, which appears to be a read-only environment warning rather than a phase-doc failure.

## Recommended Next Focus
Turn the converged adopt-now set into one cross-phase implementation tranche: exact-key recall, doctor summary, compaction-time checkpoint, bootstrap memory hints, and static markdown integrity. After that, open a second design tranche for `memory_review`, `memory_due`, and a durable proposal inbox so the strongest Modus-specific ideas land behind an explicit control-plane contract.

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
# Iteration 022: IMPLEMENTATION BLUEPRINTS

## Focus
IMPLEMENTATION BLUEPRINTS: For the top 3 adopt-now recommendations, write concrete implementation blueprints with file paths, function signatures, and migration steps for our system.

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
I’m treating this as a read-only deep-research pass for iteration 22, focused on turning the top adopt-now Modus findings into concrete blueprints for Spec Kit Memory. I’ll quickly pull the most relevant prior memory context, then read the Public code paths for `memory_search`, health, schemas, and FSRS so the blueprints map to real file boundaries and signatures.
exec
/bin/zsh -lc 'rg -n "memory_review|doctor|executePipeline|memory_search|memory-crud-health|tool-schemas|fsrs-scheduler|modu[s]?" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
157:- rollout_summaries/2026-04-09T10-35-53-UGDf-009_post_save_render_fixes_memory_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T12-35-53-019d71d0-0ec5-7c80-a08b-6d336ee5c639.jsonl, updated_at=2026-04-09T12:01:25+00:00, thread_id=019d71d0-0ec5-7c80-a08b-6d336ee5c639)
456:## Task 2: Rename packet `023-esm-module-compliance` to `023-hybrid-rag-fusion-refinement` and sync changelog references, outcome success
547:- `memory_stats` currently has no `sessionId` input in tool schema, so calling it after `memory_search` cannot claim the same session by default [Task 2]
548:- verification pattern that worked: confirm fresh `context-server.js` processes, run `session_bootstrap`, execute controlled `memory_search` sequence with fixed session id + trace flags, then query `feedback_events` globally and per-session in sqlite [Task 2]
584:- when the user insisted “MAKE SURE CODE TOUCHED ALIGNS WITH SK-CODE--OPENCODE,” enforce module header/section/TSDoc conventions and rerun targeted build/test gates before closeout [Task 1]
703:## Task 2: Deep-review packet `023-esm-module-compliance` across docs/code/catalog/playbook, outcome success
707:- rollout_summaries/2026-04-02T05-48-55-ewoK-023_esm_module_compliance_deep_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/02/rollout-2026-04-02T07-48-55-019d4cbc-d03a-7fb2-a2ea-7028e451483e.jsonl, updated_at=2026-04-02T09:39:16+00:00, thread_id=019d4cbc-d03a-7fb2-a2ea-7028e451483e)
711:- 023-esm-module-compliance, sk-code--opencode, feature catalog, manual_testing_playbook, validate.sh --recursive --strict, --workspaces=false
733:## Task 5: Truth-sync changelog packet `023-esm-module-compliance` (add phase 013 + adjust 010-012 claims), outcome success
737:- rollout_summaries/2026-04-02T15-04-40-XOMQ-changelog_023_esm_module_compliance_update.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/02/rollout-2026-04-02T17-04-40-019d4eb9-9c7f-7e91-a395-f537a58c3d74.jsonl, updated_at=2026-04-02T15:16:00+00:00, thread_id=019d4eb9-9c7f-7e91-a395-f537a58c3d74)
741:- changelog-root-esm-module-compliance.md, changelog-013-fts5-fix-and-search-dashboard.md, v1.1.0, 13 phases, validate.sh --recursive --strict
1057:- list_mcp_resources, list_mcp_resource_templates, spec_kit_memory, opencode.json, context-server.js, memory_context, memory_search
1156:## Task 5: Sync `023-esm-module-compliance` docs to 20-iteration research conclusions while keeping runtime migration pending
1164:- 023-esm-module-compliance, research/research.md, shared + mcp_server, scripts CommonJS interop, dual-build fallback-only, validate.sh --strict
1181:- For `023-esm-module-compliance`, keep `research/research.md` immutable as canonical evidence and sync `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` to the same strategy language (shared + mcp_server ESM, scripts CommonJS interop, dual-build fallback-only) [Task 5]
1478:- memory_search cursor, progressive-disclosure, requestQuality, SPECKIT_RESULT_CONFIDENCE_V1, memory-search-ux-hooks.vitest.ts
1794:## Task 4: Apply TSDoc and reference-comment cleanup across Hydra runtime modules
1869:- rollout_summaries/2026-03-13T11-01-44-IBXE-outsourced_agent_memory_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/13/rollout-2026-03-13T12-01-44-019ce6dc-0509-7630-9874-db11f57a9e06.jsonl, updated_at=2026-03-13T11:21:38+00:00, thread_id=019ce6dc-0509-7630-9874-db11f57a9e06)
2096:- chat-screen.tsx, sk-code--opencode, module header, numbered sections, renderContent, prettier, eslint
2115:- Keep module-header plus numbered uppercase sections (`IMPORTS`, `COMPONENT`, `HOOKS AND LOCAL STATE`, `DERIVED STATE`, `HANDLERS`, `EFFECTS`, `RENDER`) so future diffs stay navigable [Task 1]

exec
/bin/zsh -lc "pwd && rg --files .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main | sed 's#"'^#/#'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/assets/fsrs-decay.svg
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/assets/security.svg
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/assets/architecture.svg
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/assets/hero.svg
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/assets/doctor.svg
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/assets/comparison.svg
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/assets/demo.svg
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/go.sum
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/MIGRATION_POST.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/entities.go
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/prs.go
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/helpers.go
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/beliefs.go
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/vault.go
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/trust.go
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/bm25.go
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/facts.go
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/learnings/learnings.go
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/learnings.go
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/server.go
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/json.go
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/writer.go
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/client.go
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/LICENSE
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/go.mod
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/entities.go
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/doctor.go
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/import_khoj.go
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/phase-research-prompt.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-010.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-004.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-020.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-014.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-005.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-015.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-001.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-011.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-006.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-016.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-002.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-012.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-003.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-013.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-007.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-017.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-008.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-018.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-009.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-019.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md

codex
I’ve got the phase folder and prior memory hit that points to recent `memory_review` work, which is useful because one of the blueprints almost certainly needs to land cleanly on that newer control-plane surface. Next I’m reading the exact runtime files and the latest phase notes so the blueprint can reference real handler boundaries instead of generic suggestions.
exec
/bin/zsh -lc "sed -n '150,165p' /Users/michelkerkmeester/.codex/memories/MEMORY.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
scope: render-layer memory pipeline fixes in `003-memory-quality-issues/009-post-save-render-fixes` with acceptance anchored to a real 014 wild save and zero post-save-review issues
applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public; reuse_rule=reuse when patching memory render/reviewer behavior in this checkout and proving fixes through an end-to-end generate-context run

## Task 1: Ship 009 render-layer fixes (A-I lanes), tests, and final wild save with clean post-save review, outcome success

### rollout_summary_files

- rollout_summaries/2026-04-09T10-35-53-UGDf-009_post_save_render_fixes_memory_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T12-35-53-019d71d0-0ec5-7c80-a08b-6d336ee5c639.jsonl, updated_at=2026-04-09T12:01:25+00:00, thread_id=019d71d0-0ec5-7c80-a08b-6d336ee5c639)

### keywords

- 009-post-save-render-fixes, PSR-2, trigger phrase omission, input-normalizer.ts, collect-session-data.ts, post-save-review.ts extractSection, memory-metadata.ts session_id metadata block, generate-context.js wild save, OVERVIEW 655 chars

## User preferences

- when a medium reviewer note remained, the user asked: “fix the remaining trigger-phrase omission before commit if you want the wild save to finish with a completely clean post-save review” -> do not close this workflow with unresolved `PSR-2` warnings [Task 1]

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-deep-research/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-021.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
### Finding 3: **Medium integration** — Modus-style lexical expansion can reuse Public’s deep-mode hooks
- **Source**: `external/internal/librarian/search.go:10-53`; `external/internal/mcp/vault.go:21-58,280-331`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:4-18,88-176,200-260`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:616-740`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:173-251`
- **What it does**: Modus expands one query into 3-5 lexical variants, runs retrieval per variant, and merges deduped results. Public already has three nearby hooks: corpus-grounded LLM reformulation, deep-mode query decomposition, and graph-expanded fallback queries. So integration is not about inventing expansion; it is about deciding whether a **lighter lexical-only branch** should run before or beside the current deep pipeline.
- **Why it matters for us**: Integration is **medium** because the insertion points already exist, but the value is incremental, not foundational. Public must avoid duplicating its current deep-mode expansion stack or adding noisy variant fan-out across vector, FTS, BM25, and graph lanes.
- **Recommendation**: **prototype later**
## Findings

### Finding 1: Review queue risk — a Public `memory_due` inbox will be misleading unless it gets a first-class due-state contract
- **Source**: `external/internal/mcp/vault.go:280-317,856-897`; `external/internal/vault/facts.go:64-157,160-217`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2319-2343`; `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:65-71,177-215`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:512-520`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1194-1202`
- **What it does**: Modus keeps search recall, explicit reinforce, decay, and archive on the same fact fields. Public already persists `access_count`, `last_accessed`, `stability`, `difficulty`, `last_review`, and `review_count`, and `processReview()` computes `nextReviewDate`, but that due date is not persisted and read-time strengthening stays opt-in via `trackAccess=false`.
- **Why it matters for us**: If Public adds a due/review queue without defining one authoritative source of truth for “due,” the queue can drift from actual search behavior. A memory can look overdue while recent read activity updated its effective retrievability, which would make the inbox feel unreliable.
- **Recommendation**: **NEW FEATURE**
- **Impact**: **high**

### Finding 2: Doctor summary risk — a friendlier `doctor` surface can hide the repair semantics that currently keep Public safe
- **Source**: `external/cmd/modus-memory/doctor.go:13-242`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:343-530`; `.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:479-540`
- **What it does**: Modus’s `doctor` is compact: build the index, count issues, print warnings. Public’s health path is richer: degraded/healthy distinction, confirmation-gated auto-repair, FTS/vector/orphan cleanup, and partial-restore error reporting.
- **Why it matters for us**: The risk is lossy compression. If Public promotes a one-screen doctor summary as the main surface, operators may miss whether a problem is merely informational, auto-repairable, or a partial restore failure with rollback details.
- **Recommendation**: **adopt now**
- **Impact**: **medium**

### Finding 3: Lexical expansion risk — copying Modus’s librarian directly would stack another weak branch onto Public’s already-expanded deep pipeline
- **Source**: `external/internal/librarian/search.go:10-52`; `external/internal/mcp/vault.go:280-299`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:8-18,88-125,148-175`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:616-740`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:173-251`
- **What it does**: Modus asks an LLM for 3-5 keyword variants with no corpus grounding and searches each variant. Public already has deep-mode decomposition, corpus-grounded reformulation, and graph-expanded fallback queries.
- **Why it matters for us**: In Modus this is lightweight; in Public it risks branch explosion, extra latency, and noisier recall. Ungrounded lexical variants can duplicate or fight with stronger grounded/vector lanes, especially when reranking and graph fallback already exist.
- **Recommendation**: **prototype later**
## Findings

### Finding 1: Rank 1 (20/25) — explicit `memory_review` is the first thing Public should ship
- **Source**: `external/internal/mcp/memory.go:7-15`; `external/internal/mcp/vault.go:885-897`; `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:39-43,197-215`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:529-585,840-877,1194-1202`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:300-316`
- **What it does**: Modus exposes an explicit `memory_reinforce` operator action on top of its FSRS state. Public already has the underlying pieces: graded review math (`AGAIN/HARD/GOOD/EASY`), `processReview()` with `nextReviewDate`, and opt-in strengthening-on-access. The current exposed adjacent surface is `memory_validate`, which records only `wasUseful` feedback and does not let an operator issue a graded FSRS review.
- **Why it matters for us**: This is the highest impact x feasibility transfer because it closes the clearest control-plane gap without inventing new storage or changing retrieval architecture. It also de-risks the bigger `memory_due` idea: until Public has a first-class graded review action, any future review queue would have no trustworthy way to record hard recalls, lapses, and easy wins distinctly.
- **Recommendation**: **adopt now**
- **Impact**: **high**

### Finding 2: Rank 2 (15/25, tie-broken ahead) — a doctor-style summary should ship in the same tranche as `memory_review`
- **Source**: `external/cmd/modus-memory/doctor.go:13-242`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:236-273`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:378-443,455-555`
- **What it does**: Modus turns index and vault diagnostics into a one-screen operator summary. Public already has the deeper machinery: `memory_health` with confirmation-gated auto-repair, FTS rebuild, orphan-edge cleanup, orphan-vector cleanup, and degraded/healthy reporting. The gap is presentation, not backend capability.
- **Why it matters for us**: This is nearly pure formatter work and improves operator trust immediately. It ranks ahead of `memory_due` despite lower raw strategic upside because it is safer, independent, and can ship without any FSRS contract decisions.
- **Recommendation**: **adopt now**
- **Impact**: **medium**

### Finding 3: Rank 3 (15/25, tie-broken behind) — `memory_due` is the biggest strategic win, but only after a due-state contract is fixed
- **Source**: `external/internal/mcp/vault.go:273-317,856-897`; `external/internal/vault/facts.go:64-157,160-217`; `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:65-71,177-215`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:467-473,1813-1888`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:505-520`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1194-1202`
- **What it does**: Modus exposes the full review lifecycle visibly: search recall, explicit reinforce, decay, and archive all operate over the same fact state. Public already stores `stability`, `difficulty`, `last_review`, `review_count`, and `last_accessed`, and `processReview()` computes `nextReviewDate`, but no persisted `next_review_at` column exists and write-on-read remains opt-in through `trackAccess=false`.
- **Why it matters for us**: This is the most valuable missing product surface, but it should not ship first. If Public adds a queue before deciding whether “due” is persisted (`next_review_at`) or deterministically derived from `stability + last_review`, operators will see a review inbox that can drift from actual FSRS behavior.
- **Recommendation**: **NEW FEATURE**
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

codex
The shape is tightening up: the likely blueprint set is `memory_review`, a doctor-style summary over existing health machinery, and a “one retrieval core” wrapper pattern so new surfaces do not fork ranking logic. I’m validating that against the current TypeScript handlers and schemas now, including whether any `memory_review` work already landed yesterday so I can build on current reality instead of duplicating it.
exec
/bin/zsh -lc "sed -n '220,360p' .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  inputSchema: { type: 'object', additionalProperties: false, properties: { filePath: { type: 'string', minLength: 1, description: 'Absolute path to the memory file (must be in specs/**/memory/, .opencode/specs/**/memory/, specs/**/ for spec documents, or .opencode/skill/*/constitutional/)' }, force: { type: 'boolean', default: false, description: 'Force re-index even if content hash unchanged' }, dryRun: { type: 'boolean', default: false, description: 'Validate only without saving. Returns validation results including anchor format, duplicate check, and token budget estimation (CHK-160)' }, skipPreflight: { type: 'boolean', default: false, description: 'Skip pre-flight validation checks (not recommended)' }, asyncEmbedding: { type: 'boolean', default: false, description: 'When true, embedding generation is deferred for non-blocking saves. Memory is immediately saved with pending status and an async background attempt is triggered. Default false preserves synchronous embedding behavior.' }, tenantId: { type: 'string', description: 'Tenant boundary for governed ingest.' }, userId: { type: 'string', description: 'User boundary for governed ingest.' }, agentId: { type: 'string', description: 'Agent boundary for governed ingest.' }, sessionId: { type: 'string', description: 'Session boundary for governed ingest.' }, sharedSpaceId: { type: 'string', description: 'Optional shared-memory space for collaboration saves.' }, provenanceSource: { type: 'string', description: 'Required provenance source when governance guardrails are enabled.' }, provenanceActor: { type: 'string', description: 'Required provenance actor when governance guardrails are enabled.' }, governedAt: { type: 'string', description: 'ISO timestamp for governed ingest. Defaults to now when omitted.' }, retentionPolicy: { type: 'string', enum: ['keep', 'ephemeral', 'shared'], description: 'Retention class applied to the saved memory.' }, deleteAfter: { type: 'string', description: 'Optional ISO timestamp after which retention sweep may delete the memory.' } }, required: ['filePath'] },
};

// L3: Discovery - Browse and explore (Token Budget: 800)
const memoryList: ToolDefinition = {
  name: 'memory_list',
  description: '[L3:Discovery] Browse stored memories with pagination. Use to discover what is remembered and find IDs for delete/update. Token Budget: 800.',
  inputSchema: { type: 'object', additionalProperties: false, properties: { limit: { type: 'number', default: 20, minimum: 1, maximum: 100, description: 'Maximum results to return (max 100)' }, offset: { type: 'number', default: 0, minimum: 0, description: 'Number of results to skip (for pagination)' }, specFolder: { type: 'string', description: 'Filter by spec folder' }, sortBy: { type: 'string', enum: ['created_at', 'updated_at', 'importance_weight'], description: 'Sort order (default: created_at DESC)' }, includeChunks: { type: 'boolean', default: false, description: 'Include chunk child rows. Default false returns parent memories only for cleaner browsing.' } } },
};

const memoryStats: ToolDefinition = {
  name: 'memory_stats',
  description: '[L3:Discovery] Get statistics about the memory system. Shows counts, dates, status breakdown, and top folders. Supports multiple ranking modes including composite scoring. Token Budget: 800.',
  inputSchema: { type: 'object', additionalProperties: false, properties: { folderRanking: { type: 'string', enum: ['count', 'recency', 'importance', 'composite'], description: 'How to rank folders: count (default, by memory count), recency (most recent first), importance (by tier), composite (weighted multi-factor score)', default: 'count' }, excludePatterns: { type: 'array', items: { type: 'string' }, description: 'Regex patterns to exclude folders (e.g., ["z_archive", "scratch"])' }, includeScores: { type: 'boolean', description: 'Include score breakdown for each folder', default: false }, includeArchived: { type: 'boolean', description: 'Include archived/test/scratch folders in results', default: false }, limit: { type: 'number', minimum: 1, maximum: 100, description: 'Maximum number of folders to return', default: 10 } } },
};

const memoryHealth: ToolDefinition = {
  name: 'memory_health',
  description: '[L3:Discovery] Check health status of the memory system. Token Budget: 800.',
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      reportMode: {
        type: 'string',
        enum: ['full', 'divergent_aliases'],
        default: 'full',
        description: 'Report mode. full returns system diagnostics; divergent_aliases returns compact divergent alias triage output.'
      },
      limit: {
        type: 'number',
        default: 20,
        minimum: 1,
        maximum: 200,
        description: 'Maximum divergent alias groups to return when reportMode=divergent_aliases (max 200).'
      },
      specFolder: {
        type: 'string',
        description: 'Optional spec folder filter for divergent alias triage mode.'
      },
      autoRepair: {
        type: 'boolean',
        default: false,
        description: 'When true in full mode, attempts best-effort repair actions for detected health issues (e.g., FTS rebuild).'
      },
      confirmed: {
        type: 'boolean',
        default: false,
        description: 'Required with autoRepair:true to execute repair actions. When false or omitted, memory_health returns a confirmation-only response.'
      }
    },
    required: []
  },
};

// L4: Mutation - Modify existing memories (Token Budget: 500)
const memoryDelete: ToolDefinition = {
  name: 'memory_delete',
  description: '[L4:Mutation] Delete a memory by ID or all memories in a spec folder. Use to remove incorrect or outdated information. Requires EITHER id (single delete) OR specFolder + confirm:true (bulk delete). Token Budget: 500.',
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    'x-requiredAnyOf': [['id'], ['specFolder', 'confirm']],
    properties: {
      id: { type: 'number', minimum: 1, description: 'Memory ID to delete (single delete mode)' },
      specFolder: { type: 'string', minLength: 1, description: 'Delete all memories in this spec folder (bulk delete mode, requires confirm: true)' },
      confirm: { type: 'boolean', const: true, description: 'Safety gate. When provided, confirm must be true.' }
    }
  },
};

const memoryUpdate: ToolDefinition = {
  name: 'memory_update',
  description: '[L4:Mutation] Update an existing memory with corrections. Re-generates embedding if content changes. Token Budget: 500.',
  inputSchema: { type: 'object', additionalProperties: false, properties: { id: { type: 'number', minimum: 1, description: 'Memory ID to update' }, title: { type: 'string', description: 'New title' }, triggerPhrases: { type: 'array', items: { type: 'string' }, description: 'Updated trigger phrases' }, importanceWeight: { type: 'number', minimum: 0, maximum: 1, description: 'New importance weight (0-1)' }, importanceTier: { type: 'string', enum: ['constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated'], description: 'Set importance tier. Constitutional tier memories always surface at top of results.' }, allowPartialUpdate: { type: 'boolean', default: false, description: 'Allow update to succeed even if embedding regeneration fails. When true, metadata changes are applied and the embedding is marked for re-index. When false (default), the entire update is rolled back on embedding failure.' } }, required: ['id'] },
};

const memoryValidate: ToolDefinition = {
  name: 'memory_validate',
  description: '[L4:Mutation] Record validation feedback for a memory. Tracks whether memories are useful, updating confidence scores. Memories with high confidence and validation counts may be promoted to critical tier. Token Budget: 500.',
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      id: { type: 'number', minimum: 1, description: 'Memory ID to validate' },
      wasUseful: { type: 'boolean', description: 'Whether the memory was useful (true increases confidence, false decreases it)' },
      queryId: { type: 'string', description: 'Optional query identifier to attach implicit feedback/ground-truth selection context' },
      queryTerms: { type: 'array', items: { type: 'string' }, description: 'Optional normalized query terms used for learned feedback term extraction' },
      resultRank: { type: 'number', minimum: 1, description: 'Optional rank position (1-based) of the selected memory in search results' },
      totalResultsShown: { type: 'number', minimum: 1, description: 'Optional total number of results shown to the user' },
      searchMode: { type: 'string', description: 'Optional search mode context (search/context/trigger)' },
      intent: { type: 'string', description: 'Optional classified intent associated with the originating query' },
      sessionId: { type: 'string', description: 'Optional session identifier for selection telemetry' },
      notes: { type: 'string', description: 'Optional free-form notes associated with this validation event' },
    },
    required: ['id', 'wasUseful']
  },
};

const memoryBulkDelete: ToolDefinition = {
  name: 'memory_bulk_delete',
  description: '[L4:Mutation] Bulk delete memories by importance tier. Use to clean up deprecated or temporary memories at scale. Auto-creates checkpoint before deletion for safety. Refuses unscoped deletion of constitutional/critical tiers. Supports optional checkpoint bypass for lower-risk tiers when speed is prioritized. Token Budget: 500.',
  inputSchema: { type: 'object', additionalProperties: false, properties: { tier: { type: 'string', enum: ['constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated'], description: 'Importance tier to delete (required)' }, specFolder: { type: 'string', description: 'Optional: scope deletion to a specific spec folder' }, confirm: { type: 'boolean', const: true, description: 'Required safety gate: must be true to proceed' }, olderThanDays: { type: 'number', minimum: MEMORY_BULK_DELETE_MIN_OLDER_THAN_DAYS, description: 'Optional: only delete memories older than this many days' }, skipCheckpoint: { type: 'boolean', default: false, description: 'Optional speed optimization for non-critical tiers. When true, skips auto-checkpoint creation before delete. Rejected for constitutional/critical tiers.' } }, required: ['tier', 'confirm'] },
};

// L5: Lifecycle - Checkpoints and versioning (Token Budget: 600)
const checkpointCreate: ToolDefinition = {
  name: 'checkpoint_create',
  description: '[L5:Lifecycle] Create a named checkpoint of current memory state for later restoration. Token Budget: 600.',
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      name: { type: 'string', minLength: 1, description: 'Unique checkpoint name' },
      specFolder: { type: 'string', description: 'Limit to specific spec folder' },
      tenantId: { type: 'string', minLength: 1, description: 'Tenant boundary for governed checkpoint scope.' },
      userId: { type: 'string', minLength: 1, description: 'Scope to this user (optional, defense-in-depth)' },
      agentId: { type: 'string', minLength: 1, description: 'Scope to this agent (optional, defense-in-depth)' },
      sharedSpaceId: { type: 'string', minLength: 1, description: 'Scope to this shared space (requires tenantId).' },
      metadata: { type: 'object', description: 'Additional metadata' }
    },
    required: ['name']
  },
};

const checkpointList: ToolDefinition = {
  name: 'checkpoint_list',
  description: '[L5:Lifecycle] List all available checkpoints. Token Budget: 600.',
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      specFolder: { type: 'string', description: 'Filter by spec folder' },
      tenantId: { type: 'string', minLength: 1, description: 'Tenant boundary for governed checkpoint scope.' },
      userId: { type: 'string', minLength: 1, description: 'Scope to this user (optional, defense-in-depth)' },
      agentId: { type: 'string', minLength: 1, description: 'Scope to this agent (optional, defense-in-depth)' },
      sharedSpaceId: { type: 'string', minLength: 1, description: 'Scope to this shared space (requires tenantId).' },
      limit: { type: 'number', default: 50, minimum: 1, maximum: 100 }
    }
  },
};

exec
/bin/zsh -lc "sed -n '340,620p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    console.warn(`[memory-health] Failed to get memory count [requestId=${requestId}]:`, message);
  }

  if (reportMode === DIVERGENT_ALIAS_REPORT_MODE) {
    const hints: string[] = [];
    if (!database) {
      hints.push('Database not connected - restart MCP server');
    }
    if (autoRepair) {
      hints.push('autoRepair is only applied in reportMode="full"');
    }
    if (aliasConflicts.divergentHashGroups === 0) {
      hints.push('No divergent alias groups detected');
    }
    if (aliasConflicts.divergentHashGroups > divergentAliasGroups.length) {
      hints.push(`More divergent alias groups available: increase limit above ${safeLimit}`);
    }

    return createMCPSuccessResponse({
      tool: 'memory_health',
      summary: `Divergent alias report: ${divergentAliasGroups.length} of ${aliasConflicts.divergentHashGroups} group(s)`,
      data: {
        reportMode,
        status: isEmbeddingModelReady() && database ? 'healthy' : 'degraded',
        databaseConnected: !!database,
        embeddingRetry,
        specFolder: specFolder ?? null,
        limit: safeLimit,
        totalRowsScanned: aliasRows.length,
        totalDivergentGroups: aliasConflicts.divergentHashGroups,
        returnedGroups: divergentAliasGroups.length,
        groups: divergentAliasGroups,
      },
      hints,
      startTime,
    });
  }

  let providerMetadata = embeddings.getProviderMetadata() as PartialProviderMetadata;
  let profile = embeddings.getEmbeddingProfile() as EmbeddingProfile | null;
  const status = isEmbeddingModelReady() && database ? 'healthy' : 'degraded';

  const summary = `Memory system ${status}: ${memoryCount} memories indexed`;
  const hints: string[] = [];
  const repair = {
    requested: autoRepair,
    attempted: false,
    repaired: false,
    partialSuccess: false,
    actions: [] as string[],
    warnings: [] as string[],
    errors: [] as string[],
  };
  let successfulRepairCount = 0;
  let failedRepairCount = 0;

  const trackRepairOutcome = (succeeded: boolean): void => {
    repair.attempted = true;
    if (succeeded) {
      successfulRepairCount += 1;
      return;
    }
    failedRepairCount += 1;
  };

  if (!profile) {
    try {
      // Resolve the lazy profile so health reflects the active runtime provider
      // Rather than the legacy sync fallback defaults.
      profile = await embeddings.getEmbeddingProfileAsync() as EmbeddingProfile | null;
      providerMetadata = embeddings.getProviderMetadata() as PartialProviderMetadata;
    } catch (profileError: unknown) {
      hints.push(`Embedding profile unavailable: ${sanitizeErrorForHint(toErrorMessage(profileError))}`);
    }
  }

  const providerName = profile?.provider ?? providerMetadata.provider;
  const providerModel = profile?.model ?? providerMetadata.model ?? embeddings.getModelName();
  const providerDimension = profile?.dim ?? providerMetadata.dim ?? embeddings.getEmbeddingDimension();
  const repairActions = [
    'fts_rebuild',
    'trigger_cache_refresh',
    'orphan_edges_cleanup',
    'orphan_vector_cleanup',
  ];

  if (autoRepair && !confirmed) {
    return createMCPSuccessResponse({
      tool: 'memory_health',
      summary: 'Confirmation required before auto-repair actions are executed',
      data: {
        status,
        reportMode,
        autoRepairRequested: true,
        needsConfirmation: true,
        actions: repairActions,
        embeddingRetry,
      },
      hints: [
        'Re-run memory_health with autoRepair:true and confirmed:true to execute repair actions.',
      ],
      startTime,
    });
  }

  if (!isEmbeddingModelReady()) {
    hints.push('Embedding model not ready - some operations may fail');
  }
  if (!database) {
    hints.push('Database not connected - restart MCP server');
  }
  if (!vectorIndex.isVectorSearchAvailable()) {
    hints.push('Vector search unavailable - fallback to BM25');
  }
  // FTS5 consistency check
  if (database) {
    try {
      const memoryCountRow = database.prepare('SELECT COUNT(*) as count FROM memory_index').get() as { count: number };
      const ftsCountRow = database.prepare('SELECT COUNT(*) as count FROM memory_fts').get() as { count: number };
      if (memoryCountRow.count !== ftsCountRow.count) {
        hints.push(
          `FTS5 index out of sync: memory_index has ${memoryCountRow.count} rows, memory_fts has ${ftsCountRow.count} rows. ` +
          `Run memory_index_scan with force:true to rebuild FTS5 index.`
        );

        if (autoRepair) {
          try {
            database.exec("INSERT INTO memory_fts(memory_fts) VALUES('rebuild')");
            repair.actions.push('fts_rebuild');

            triggerMatcher.refreshTriggerCache();
            repair.actions.push('trigger_cache_refresh');

            const repairedFtsCountRow = database.prepare('SELECT COUNT(*) as count FROM memory_fts').get() as { count: number };
            if (memoryCountRow.count === repairedFtsCountRow.count) {
              trackRepairOutcome(true);
              repair.actions.push('fts_consistency_verified');
              hints.push('Auto-repair completed: FTS5 index rebuilt and trigger cache refreshed.');
            } else {
              trackRepairOutcome(false);
              const warning = `Post-repair mismatch persists: memory_index=${memoryCountRow.count}, memory_fts=${repairedFtsCountRow.count}`;
              repair.warnings.push(warning);
              hints.push(`Auto-repair attempted, but mismatch remains (${warning}).`);
            }
          } catch (repairError: unknown) {
            const message = toErrorMessage(repairError);
            trackRepairOutcome(false);
            repair.errors.push(sanitizeErrorForHint(message));
            hints.push(`Auto-repair failed: ${sanitizeErrorForHint(message)}`);
          }
        }
      }
    } catch (e: unknown) {
      const message = toErrorMessage(e);
      hints.push(`FTS5 consistency check failed: ${sanitizeErrorForHint(message)}`);
      if (autoRepair) {
        trackRepairOutcome(false);
        repair.errors.push(`Consistency check failed before repair: ${sanitizeErrorForHint(message)}`);
      }
    }
  }
  // cleanupOrphanedEdges was exported but
  // Never invoked at runtime. Wire it into autoRepair so orphaned causal edges
  // (referencing deleted memories) are cleaned up during health checks.
  if (autoRepair && database) {
    try {
      // Fix F8 — ensure causal-edges DB init before orphan cleanup.
      causalEdges.init(database);
      const orphanResult = causalEdges.cleanupOrphanedEdges();
      if (orphanResult.deleted > 0) {
        trackRepairOutcome(true);
        repair.actions.push(`orphan_edges_cleaned:${orphanResult.deleted}`);
        hints.push(`Auto-repair: removed ${orphanResult.deleted} orphaned causal edge(s)`);
      }
    } catch (orphanError: unknown) {
      trackRepairOutcome(false);
      repair.errors.push(`Orphan edge cleanup failed: ${sanitizeErrorForHint(toErrorMessage(orphanError))}`);
    }
  }

  if (autoRepair && database) {
    try {
      const integrityReport = vectorIndex.verifyIntegrity({ autoClean: true });
      const cleanedVectors = integrityReport.cleaned?.vectors ?? 0;
      const cleanedChunks = integrityReport.cleaned?.chunks ?? 0;

      if (cleanedVectors > 0) {
        trackRepairOutcome(true);
        repair.actions.push(`orphan_vectors_cleaned:${cleanedVectors}`);
        hints.push(`Auto-repair: removed ${cleanedVectors} orphaned vector(s)`);
      }

      if (cleanedChunks > 0) {
        trackRepairOutcome(true);
        repair.actions.push(`orphan_chunks_cleaned:${cleanedChunks}`);
        hints.push(`Auto-repair: removed ${cleanedChunks} orphaned chunk(s)`);
      }

      const postRepairReport = vectorIndex.verifyIntegrity({ autoClean: false });
      if (
        postRepairReport.orphanedVectors > 0 ||
        postRepairReport.missingVectors > 0 ||
        postRepairReport.orphanedFiles.length > 0 ||
        postRepairReport.orphanedChunks > 0
      ) {
        repair.warnings.push(
          `Post-repair integrity still degraded: orphanedVectors=${postRepairReport.orphanedVectors}, ` +
          `missingVectors=${postRepairReport.missingVectors}, orphanedFiles=${postRepairReport.orphanedFiles.length}, ` +
          `orphanedChunks=${postRepairReport.orphanedChunks}`
        );
      }
    } catch (integrityError: unknown) {
      trackRepairOutcome(false);
      repair.errors.push(`Integrity cleanup failed: ${sanitizeErrorForHint(toErrorMessage(integrityError))}`);
    }
  }

  if (repair.attempted) {
    repair.repaired = failedRepairCount === 0 && successfulRepairCount > 0;
    repair.partialSuccess = failedRepairCount > 0 && successfulRepairCount > 0;
  }

  if (aliasConflicts.groups > 0) {
    hints.push(`Detected ${aliasConflicts.groups} specs/.opencode alias group(s)`);
  }
  if (aliasConflicts.divergentHashGroups > 0) {
    hints.push(`${aliasConflicts.divergentHashGroups} alias group(s) have divergent content hashes`);
  }

  return createMCPSuccessResponse({
    tool: 'memory_health',
    summary,
    data: {
      status,
      embeddingModelReady: isEmbeddingModelReady(),
      databaseConnected: !!database,
      vectorSearchAvailable: vectorIndex.isVectorSearchAvailable(),
      memoryCount,
      uptime: process.uptime(),
      version: SERVER_VERSION,
      reportMode: 'full',
      aliasConflicts,
      repair,
      embeddingProvider: {
        provider: providerName,
        model: providerModel,
        dimension: providerDimension,
        healthy: providerMetadata.healthy !== false,
        databasePath: redactPath(vectorIndex.getDbPath() ?? ''),
      },
      embeddingRetry,
    },
    hints,
    startTime,
  });
}

/* ───────────────────────────────────────────────────────────────
   EXPORTS
──────────────────────────────────────────────────────────────── */

export { handleMemoryHealth };

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Fsrs Scheduler
// ───────────────────────────────────────────────────────────────
// Feature catalog: Classification-based decay
// CANONICAL FSRS CONSTANTS & ALGORITHM
// Free Spaced Repetition Scheduler v4 algorithm implementation
//
// TWO-DOMAIN DECAY MODEL (Single Source of Truth)
// Long-term memory (this file):
// FSRS v4 power-law: R(t) = (1 + FSRS_FACTOR * t/S)^FSRS_DECAY
// Timescale: days/weeks. Constants: FSRS_FACTOR=19/81, FSRS_DECAY=-0.5
// All long-term decay consumers MUST import constants from this file.
//
// Working memory (working-memory.ts — separate system, intentionally decoupled):
// Linear multiplicative: score * 0.95 per tick
// Timescale: minutes. Operates on session-scoped attention scores only.
//
// DECAY STRATEGY (ADR-004): This is the CANONICAL long-term decay
// Algorithm. All temporal decay for persistent memories should route
// Through calculateRetrievability(). Formula: R(t) = (1 + 19/81 * t/S)^(-0.5)
// Where t = elapsed days, S = stability (grows with successful reviews).
//
// Consumers: attention-decay.ts (facade), composite-scoring.ts (temporal
// Factor), tier-classifier.ts (state classification),
// Vector-index-impl.js (SQL search ranking).

import { LEGACY_CONTEXT_TYPE_ALIASES } from '@spec-kit/shared/context-types';

/* --- 1. CONSTANTS --- */

/** FSRS v4 algorithm constants */
const FSRS_FACTOR = 19 / 81;
const FSRS_DECAY = -0.5;

// Derived constant for half-life ↔ stability conversion.
// From R(h) = 0.5: S = (FSRS_FACTOR / 3) * h = (19/243) * h
const FSRS_HALF_LIFE_FACTOR = FSRS_FACTOR / 3; // 19/243 ≈ 0.07819

/** Grade constants for review scoring */
const GRADE_AGAIN = 1;
const GRADE_HARD = 2;
const GRADE_GOOD = 3;
const GRADE_EASY = 4;

/** Default initial parameters */
const DEFAULT_INITIAL_STABILITY = 1.0;
const DEFAULT_INITIAL_DIFFICULTY = 5.0;

/** Difficulty bounds */
const MIN_DIFFICULTY = 1.0;
const MAX_DIFFICULTY = 10.0;

/** Stability bounds */
const MIN_STABILITY = 0.1;

/* --- 2. INTERFACES --- */

interface FsrsParams {
  stability: number;
  difficulty: number;
  lastReview: string | null;
  reviewCount: number;
}

interface ReviewResult {
  stability: number;
  difficulty: number;
  lastReview: string;
  reviewCount: number;
  nextReviewDate: string;
  retrievability: number;
}

/* --- 3. CORE FUNCTIONS --- */

/**
 * Calculate retrievability (probability of recall) using FSRS v4 formula.
 * R(t) = (1 + FACTOR * t / S)^DECAY
 */
function calculateRetrievability(stability: number, elapsedDays: number): number {
  if (stability <= 0 || elapsedDays < 0) {
    return 0;
  }

  const retrievability = Math.pow(
    1 + FSRS_FACTOR * (elapsedDays / stability),
    FSRS_DECAY
  );

  return Math.max(0, Math.min(1, retrievability));
}

/**
 * Update stability based on review grade.
 * Uses simplified FSRS v4 update rules.
 */
function updateStability(
  currentStability: number,
  difficulty: number,
  grade: number,
  retrievability: number
): number {
  const safeStability = Math.max(0, currentStability);
  const safeDifficulty = Math.max(MIN_DIFFICULTY, Math.min(MAX_DIFFICULTY, difficulty));

  if (grade === GRADE_AGAIN) {
    // Lapse: stability decreases significantly
    return Math.max(MIN_STABILITY, safeStability * 0.2);
  }

  // Success: stability increases based on grade and difficulty
  const difficultyFactor = 1 + (11 - safeDifficulty) * 0.1;
  const gradeFactor = grade === GRADE_EASY ? 1.3 : grade === GRADE_GOOD ? 1.0 : 0.8;
  const retrievabilityBonus = 1 + (1 - retrievability) * 0.5;

  const newStability = safeStability * difficultyFactor * gradeFactor * retrievabilityBonus;

  return Math.max(MIN_STABILITY, newStability);
}

/**
 * Calculate optimal review interval from stability.
 * The interval where retrievability = 0.9 (desired retention).
 */
function calculateOptimalInterval(stability: number, desiredRetention: number = 0.9): number {
  const safeStability = Math.max(0, stability);

  if (safeStability <= 0 || desiredRetention <= 0 || desiredRetention >= 1) {
    return 0;
  }

  const interval = (safeStability / FSRS_FACTOR) * (Math.pow(desiredRetention, 1 / FSRS_DECAY) - 1);

  return Math.max(0, Math.round(Math.max(0, interval)));
}

/**
 * Update difficulty based on review grade.
 */
function updateDifficulty(currentDifficulty: number, grade: number): number {
  const safeDifficulty = Math.max(MIN_DIFFICULTY, Math.min(MAX_DIFFICULTY, currentDifficulty));
  let newDifficulty: number;

  if (grade === GRADE_AGAIN) {
    newDifficulty = safeDifficulty + 1.0;
  } else if (grade === GRADE_HARD) {
    newDifficulty = safeDifficulty + 0.5;
  } else if (grade === GRADE_GOOD) {
    newDifficulty = safeDifficulty;
  } else {
    // EASY
    newDifficulty = safeDifficulty - 0.5;
  }

  return Math.max(MIN_DIFFICULTY, Math.min(MAX_DIFFICULTY, newDifficulty));
}

/**
 * Calculate elapsed days since last review.
 */
function calculateElapsedDays(lastReview: string | null): number {
  if (!lastReview) {
    return 0;
  }

  const lastDate = new Date(lastReview);
  if (isNaN(lastDate.getTime())) return 0;
  const now = new Date();
  const diffMs = now.getTime() - lastDate.getTime();

  return Math.max(0, diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Get next review date based on stability and desired retention.
 */
function getNextReviewDate(stability: number, desiredRetention: number = 0.9): string {
  const intervalDays = calculateOptimalInterval(stability, desiredRetention);
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + intervalDays);

  return nextDate.toISOString();
}

/**
 * Create initial FSRS parameters for a new memory.
 */
function createInitialParams(): FsrsParams {
  return {
    stability: DEFAULT_INITIAL_STABILITY,
    difficulty: DEFAULT_INITIAL_DIFFICULTY,
    lastReview: null,
    reviewCount: 0,
  };
}

/**
 * Process a review and return updated parameters.
 */
function processReview(params: FsrsParams, grade: number): ReviewResult {
  const elapsedDays = calculateElapsedDays(params.lastReview);
  const retrievability = calculateRetrievability(params.stability, elapsedDays);

  const newStability = updateStability(params.stability, params.difficulty, grade, retrievability);
  const newDifficulty = updateDifficulty(params.difficulty, grade);
  const now = new Date().toISOString();
  const nextReviewDate = getNextReviewDate(newStability);

  return {
    stability: newStability,
    difficulty: newDifficulty,
    lastReview: now,
    reviewCount: params.reviewCount + 1,
    nextReviewDate,
    retrievability,
  };
}

/* --- 4. EXPORTS --- */

/** Bundled constants object for test/external consumption */
const FSRS_CONSTANTS = {
  FSRS_FACTOR,
  FSRS_DECAY,
  FSRS_HALF_LIFE_FACTOR, // T301: derived constant (19/243)
  GRADE_AGAIN,
  GRADE_HARD,
  GRADE_GOOD,
  GRADE_EASY,
  DEFAULT_STABILITY: DEFAULT_INITIAL_STABILITY,
  DEFAULT_DIFFICULTY: DEFAULT_INITIAL_DIFFICULTY,
  MIN_DIFFICULTY,
  MAX_DIFFICULTY,
  MIN_STABILITY,
} as const;

/**
 * C138: Tier-based decay multipliers for long-term memory stability.
 * Each tier modifies how quickly memories decay relative to the base FSRS schedule.
 * constitutional = slowest decay (most persistent), scratch = fastest decay (ephemeral).
 *
 * NOTE (TM-03): This multiplier operates on elapsed-time in composite-scoring.ts
 * (lower value = slower perceived time = slower decay). It is a SEPARATE system from
 * IMPORTANCE_TIER_STABILITY_MULTIPLIER below, which operates on the FSRS stability
 * parameter directly. Do NOT apply both to the same memory — use one or the other:
 *   - TIER_MULTIPLIER → used by composite-scoring.ts (elapsed-time adjustment)
 *   - IMPORTANCE_TIER_STABILITY_MULTIPLIER → used by getClassificationDecayMultiplier()
 *     (stability adjustment, activated via SPECKIT_CLASSIFICATION_DECAY env var)
 */
const TIER_MULTIPLIER: Readonly<Record<string, number>> = {
  constitutional: 0.1,
  critical: 0.3,
  important: 0.5,
  normal: 1.0,
  temporary: 2.0,
  scratch: 3.0,
} as const;

/* --- 4a. CLASSIFICATION-BASED DECAY (TM-03) ---
   Gated by SPECKIT_CLASSIFICATION_DECAY env var.

exec
/bin/zsh -lc "sed -n '1,120p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/index.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Index
// ───────────────────────────────────────────────────────────────
// Public API for the 4-stage retrieval pipeline
/**
 * Execute the four-stage retrieval pipeline.
 */

// Feature catalog: 4-stage pipeline architecture
// Feature catalog: 4-stage pipeline refactor

export { executePipeline } from './orchestrator.js';
/**
 * Public pipeline data contracts.
 */
export type {
  PipelineConfig,
  PipelineResult,
  PipelineRow,
  Stage4ReadonlyRow,
  Stage1Input,
  Stage1Output,
  Stage2Input,
  Stage2Output,
  Stage3Input,
  Stage3Output,
  Stage4Input,
  Stage4Output,
  ScoreSnapshot,
  IntentWeightsConfig,
  ArtifactRoutingConfig,
} from './types.js';
/**
 * Score snapshot helpers for Stage 4 invariants.
 */
export { captureScoreSnapshot, verifyScoreInvariant } from './types.js';

exec
/bin/zsh -lc "rg -n \"memory_review|memoryReview|processReview\\(|ReviewGrade|AGAIN|HARD|GOOD|EASY|trackAccess|nextReviewDate|executePipeline|memory_health|doctor|health\" .opencode/skill/system-spec-kit/mcp_server -g '"'!**/*.map'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:874:    // T018: Track last tool call timestamp for all tools except session_health.
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:875:    if (name !== 'session_health') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:964:    if (name !== 'memory_search' && name !== 'memory_context' && name !== 'memory_quick_search' && name !== 'session_health') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1652:    console.error('[context-server] Startup health: memory_index=%d, active_memory_projection=%d', memoryCount, projectionCount);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:50:/** Arguments for the memory_health handler. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:64:  healthy?: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:9:import { handleMemoryHealth } from './memory-crud-health.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:14:// Feature catalog: Health diagnostics (memory_health)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:36:const handle_memory_health = handleMemoryHealth;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:45:  handle_memory_health,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:39:| `dedup.ts`                  | Pre-save deduplication. `checkExistingRow` matches by file path but returns `unchanged` only for healthy rows (`success`, `pending`, `partial`); `checkContentHashDedup` matches by content hash and accepts chunked parents only when their status is valid `partial`. |
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:112:  sessionQuality?: 'healthy' | 'degraded' | 'critical' | 'unknown';
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:79:type SessionHealthModule = typeof import('./session-health.js');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:201:    sessionHealthModule = loadHandlerModule<SessionHealthModule>('session-health');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:267:export const handle_memory_health = lazyFunction(getMemoryCrudModule, 'handle_memory_health');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:328:// Session health handler
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:5:// + session_health in one call, merging results with hints.
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:9:import { handleSessionHealth } from './session-health.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:47:  health: Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:96:  healthData: Record<string, unknown>,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:105:  if (healthData.error) {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:106:    nextActions.add('Call `session_health()` directly to inspect the current health-check failure.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:121:  const healthStatus = typeof healthData.status === 'string' ? healthData.status : null;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:122:  if (healthStatus === 'warning' || healthStatus === 'stale') {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:182:  // Sub-call 2: session_health
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:183:  let healthData: Record<string, unknown> = {};
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:185:    const healthResponse = await handleSessionHealth();
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:186:    healthData = extractData(healthResponse);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:187:    allHints.push(...extractHints(healthData));
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:190:    healthData = { error: message };
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:191:    allHints.push('session_health failed. Try calling it manually.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:216:  const completeness = resumeData.error || healthData.error ? 'partial' : 'full';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:220:  const healthCertainty: SharedPayloadCertainty = healthData.error ? 'unknown' : 'estimated';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:225:  const healthPayload = coerceSharedPayloadEnvelope(healthData.payloadContract);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:270:      key: 'health-surface',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:272:      content: summarizeUnknown(healthData),
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:274:      certainty: healthCertainty,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:289:      content: buildNextActions(resumeData, healthData, structuralContext).join(' | '),
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:300:      { label: 'health', certainty: healthCertainty },
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:311:      sourceRefs: ['session-resume', 'session-health', 'session-snapshot'],
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:325:    health: healthData,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:333:      healthPayload,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:340:    nextActions: buildNextActions(resumeData, healthData, structuralContext),
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:4:// T018: MCP tool handler for session_health — reports session
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:65:/** Handle session_health tool call */
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:101:  // Phase 027: Structural bootstrap contract for health surface
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:102:  const structuralContext = buildStructuralBootstrapContract('session_health');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:137:    kind: 'health',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:140:        key: 'session-health',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:158:    summary: `Session health is ${status}; graph freshness is ${graphFreshness}; structural status is ${structuralContext.status}`,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:160:      producer: 'session_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:161:      sourceSurface: 'session_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:170:    sourceSurface: 'session_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:28:// Feature catalog: Health diagnostics (memory_health)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:30:// Feature catalog: Memory health autoRepair metadata
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:222:/** Handle memory_health tool -- returns system health status and diagnostics. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:231:    console.error(`[memory-health] Database refresh failed [requestId=${requestId}]: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:233:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:251:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:260:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:269:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:278:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:287:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:331:      console.error(`[memory-health] Schema missing [requestId=${requestId}]:`, message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:333:        tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:340:    console.warn(`[memory-health] Failed to get memory count [requestId=${requestId}]:`, message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:359:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:363:        status: isEmbeddingModelReady() && database ? 'healthy' : 'degraded',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:380:  const status = isEmbeddingModelReady() && database ? 'healthy' : 'degraded';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:407:      // Resolve the lazy profile so health reflects the active runtime provider
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:428:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:439:        'Re-run memory_health with autoRepair:true and confirmed:true to execute repair actions.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:503:  // (referencing deleted memories) are cleaned up during health checks.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:570:    tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:587:        healthy: providerMetadata.healthy !== false,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:15:import { executePipeline } from '../lib/search/pipeline/index.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:202:  trackAccess?: boolean; // opt-in access tracking (default false)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:519:    trackAccess: trackAccess = false, // opt-in, off by default
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:801:      trackAccess,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:809:    const pipelineResult: PipelineResult = await executePipeline(pipelineConfig);
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:17:- [3. HARDENING NOTES](#3--hardening-notes)
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:46:- `code-graph/status.ts` - `code_graph_status`: report graph health and statistics.
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:51:- `memory-crud-delete.ts`, `memory-crud-update.ts`, `memory-crud-list.ts`, `memory-crud-stats.ts`, `memory-crud-health.ts` - Focused CRUD implementations behind `memory-crud.ts`.
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:71:- `memory-crud-health.ts` surfaces embedding retry stats and FTS/index sync diagnostics as part of the health response.
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:75:## 3. HARDENING NOTES
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/README.md:11:| `status.ts` | `code_graph_status` | Report graph health and statistics |
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:25:} from '@spec-kit/shared/parsing/spec-doc-health';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:294:  // Non-blocking spec doc health annotation
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:312:        `[memory-save] spec-doc-health annotation skipped for ${path.basename(parsed.filePath)}: ${message}`
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1703:        'Retry memory_save({ filePath, force: true }) once dependencies are healthy',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:667:/** Handle memory_causal_stats tool - returns graph coverage and health metrics */
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:719:    const health = orphanedEdges.length === 0 ? 'healthy' : 'has_orphans';
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:721:    const summary = `Causal graph: ${safeTotalEdges} edges, ${coveragePercent}% coverage (${health})`;
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:745:        health,
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:74:  trackAccess?: boolean;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:124:/** Arguments for memory health checks.
.opencode/skill/system-spec-kit/mcp_server/utils/README.md:19:- [3. HARDENING NOTES](#3--hardening-notes)
.opencode/skill/system-spec-kit/mcp_server/utils/README.md:57:## 3. HARDENING NOTES
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:5:// List, stats, health, delete, update, validate (T303).
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:68:  'memory_health',
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:103:    case 'memory_health':         return handleMemoryHealth(parseArgs<HealthArgs>(validateToolArgs('memory_health', args)));
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/status.ts:4:// MCP tool handler for code_graph_status — reports graph health.
.opencode/skill/system-spec-kit/mcp_server/database/README.md:18:- [3. HARDENING NOTES](#3--hardening-notes)
.opencode/skill/system-spec-kit/mcp_server/database/README.md:54:## 3. HARDENING NOTES
.opencode/skill/system-spec-kit/mcp_server/database/README.md:72:- Use MCP tools (`memory_stats`, `memory_health`, `memory_index_scan`) for normal operations.
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:60:  'session_health',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:81:    case 'session_health':             return handleSessionHealth();
.opencode/skill/system-spec-kit/mcp_server/tools/README.md:28:- `memory-tools.ts` - dispatch for search, quick search, triggers, save, CRUD, stats, health, validate, and bulk delete.
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:165:      fsrsScheduler.GRADE_GOOD,
.opencode/skill/system-spec-kit/mcp_server/formatters/README.md:18:- [3. HARDENING NOTES](#3--hardening-notes)
.opencode/skill/system-spec-kit/mcp_server/formatters/README.md:46:## 3. HARDENING NOTES
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/status.ts:5:// health, counts, relation breakdowns, and signal summaries.
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking-e2e.vitest.ts:26:import { executePipeline } from '../lib/search/pipeline/index.js';
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking-e2e.vitest.ts:43:  executePipeline: vi.fn(),
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking-e2e.vitest.ts:114:    vi.mocked(executePipeline).mockReset();
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking-e2e.vitest.ts:313:    vi.mocked(executePipeline).mockResolvedValue({
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking-e2e.vitest.ts:315:    } as Awaited<ReturnType<typeof executePipeline>>);
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking-e2e.vitest.ts:326:    expect(vi.mocked(executePipeline)).toHaveBeenCalledTimes(1);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:27:  sessionQuality: 'healthy' | 'degraded' | 'critical' | 'unknown';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:43:  sourceSurface: 'auto-prime' | 'session_bootstrap' | 'session_resume' | 'session_health';
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:137:    trackAccess: false,
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:26:export type QualityLevel = 'healthy' | 'degraded' | 'critical';
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:200: * session-health.ts should use this instead of the memory-surface duplicate.
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:241:  if (score > 0.7) level = 'healthy';
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:479:describe('memory_health schema', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:482:      validateToolInputSchema('memory_health', { reportMode: 'divergent_aliases', limit: 201 }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:488:      validateToolInputSchema('memory_health', { autoRepair: true, confirmed: true }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:493:    const parsed = validateToolArgs('memory_health', { autoRepair: true, confirmed: true });
.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:327:      expect(fsrsScheduler.GRADE_AGAIN).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:328:      expect(fsrsScheduler.GRADE_HARD).toBe(2);
.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:329:      expect(fsrsScheduler.GRADE_GOOD).toBe(3);
.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:330:      expect(fsrsScheduler.GRADE_EASY).toBe(4);
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:30:  'memory health',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:170:  it('P010-T2: handleMemorySearch returns lexicalPath and fallbackState on cached healthy responses', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:188:    const response = await handler.handleMemorySearch({ query: 'healthy query' });
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:205:    trackAccess: false,
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:44:vi.mock('../handlers/session-health.js', () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:48:      text: JSON.stringify({ status: 'ok', data: { state: 'ok', hints: ['health ok'] } }),
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:68:import { handleSessionHealth } from '../handlers/session-health.js';
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:84:    expect(parsed.data.health.state).toBe('ok');
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:91:      health: expect.any(Object),
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:95:    expect(parsed.data.hints).toEqual(expect.arrayContaining(['resume ok', 'health ok']));
.opencode/skill/system-spec-kit/mcp_server/tests/provenance-envelope.vitest.ts:82:  GRADE_GOOD: 3,
.opencode/skill/system-spec-kit/mcp_server/tests/provenance-envelope.vitest.ts:223:      trackAccess: false,
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:23:          : 'session_health',
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:37:    const health = makePayload('health', 'health summary');
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:42:      healthPayload: health,
.opencode/skill/system-spec-kit/mcp_server/tests/embeddings.vitest.ts:128:        'healthCheck',
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:20:import { executePipeline } from '../lib/search/pipeline/index.js';
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:34:  executePipeline: vi.fn(),
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:118:    vi.mocked(executePipeline).mockReset();
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:144:    vi.mocked(executePipeline).mockImplementation(async (config) => {
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:149:      return result as unknown as Awaited<ReturnType<typeof executePipeline>>;
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:193:    expect(vi.mocked(executePipeline)).toHaveBeenCalledTimes(2);
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:218:    expect(vi.mocked(executePipeline)).not.toHaveBeenCalled();
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:227:    vi.mocked(executePipeline).mockResolvedValue({
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:229:    } as unknown as Awaited<ReturnType<typeof executePipeline>>);
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:255:    const initialCallCount = vi.mocked(executePipeline).mock.calls.length;
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:259:    expect(vi.mocked(executePipeline)).toHaveBeenCalledTimes(initialCallCount + 1);
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:283:    vi.mocked(executePipeline).mockResolvedValue({
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:285:    } as unknown as Awaited<ReturnType<typeof executePipeline>>);
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:318:    vi.mocked(executePipeline).mockResolvedValue({
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:320:    } as unknown as Awaited<ReturnType<typeof executePipeline>>);
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:355:    vi.mocked(executePipeline).mockResolvedValue({
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:357:    } as unknown as Awaited<ReturnType<typeof executePipeline>>);
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:404:    vi.mocked(executePipeline).mockResolvedValue({
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:406:    } as unknown as Awaited<ReturnType<typeof executePipeline>>);
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:452:    vi.mocked(executePipeline).mockResolvedValue({
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:454:    } as unknown as Awaited<ReturnType<typeof executePipeline>>);
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:487:    vi.mocked(executePipeline).mockResolvedValue({
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:489:    } as unknown as Awaited<ReturnType<typeof executePipeline>>);
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:521:    vi.mocked(executePipeline).mockResolvedValue({
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:523:    } as unknown as Awaited<ReturnType<typeof executePipeline>>);
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:565:    vi.mocked(executePipeline).mockResolvedValue({
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:567:    } as unknown as Awaited<ReturnType<typeof executePipeline>>);
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-health-edge.vitest.ts:106:  it('T007b-H8: Empty args return the default full health payload', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-health-edge.vitest.ts:130:        'Re-run memory_health with autoRepair:true and confirmed:true to execute repair actions.',
.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:85:      trackAccess: false,
.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:348:    input.config.trackAccess = true;
.opencode/skill/system-spec-kit/mcp_server/tests/graph-roadmap-finalization.vitest.ts:37:  it('serializes graph-health and adaptive telemetry contracts', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-roadmap-finalization.vitest.ts:75:  it('summarizes graph-health dashboard metrics across telemetry payloads', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-roadmap-finalization.vitest.ts:119:  it('samples sanitized trace payloads using graph-health thresholds', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:4:// Verifies B1 error handling in executePipeline:
.opencode/skill/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:62:import { executePipeline } from '../lib/search/pipeline/orchestrator';
.opencode/skill/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:84:    trackAccess: false,
.opencode/skill/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:148:describe('executePipeline error cascading (B1)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:158:    const result = await executePipeline(config);
.opencode/skill/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:174:    await expect(executePipeline(config)).rejects.toThrow('embedding service unavailable');
.opencode/skill/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:184:    const result = await executePipeline(config);
.opencode/skill/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:201:    const result = await executePipeline(config);
.opencode/skill/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:216:    const result = await executePipeline(config);
.opencode/skill/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:227:    const result = await executePipeline(config);
.opencode/skill/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:242:    const result = await executePipeline(config);
.opencode/skill/system-spec-kit/mcp_server/tests/integration-causal-graph.vitest.ts:248:      expect(envelope.data).toHaveProperty('health');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-eval-channels.vitest.ts:28:  executePipeline: vi.fn(async () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/README.md:89:| Infrastructure and utilities | `batch-processor.vitest.ts`, `tool-input-schema.vitest.ts`, `transaction-manager.vitest.ts`, `retry-manager-health.vitest.ts`, `vector-index-store-remediation.vitest.ts` | Shared helpers and runtime hardening |
.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:27:  'handlers/memory-crud.js': 40,    // actual: 32 — Re-export barrel (decomposed into memory-crud-{health,update,delete,stats,list,utils,types}.js)
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts:65:    it('T507-01: trackAccess returns true on accumulate', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts:66:      const result1 = mod.trackAccess(1);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts:70:    it('T507-01b: Accumulator state updated after trackAccess', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts:85:        mod.trackAccess(2);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts:89:      mod.trackAccess(2);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts:169:      mod.trackAccess(1);
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:434:  it('T058: DEFAULT_HINT actions include memory_health() reference (REQ-009)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:437:      a.includes('memory_health()')
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:446:  it('T060: DEFAULT_HINT has toolTip for memory_health()', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:447:    expect(DEFAULT_HINT.toolTip).toBe('memory_health()');
.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:71:    expect(brief.startupSurface).toContain('- Code Graph: healthy');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:57:    it('T601: GRADE_GOOD constant is 3', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:58:      expect(fsrsScheduler.GRADE_GOOD).toBe(3);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:75:    it('T603: GRADE_GOOD increases stability', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:77:      const reviewed = fsrsScheduler.processReview(initial, fsrsScheduler.GRADE_GOOD);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:82:      const lowRetrievability = fsrsScheduler.updateStability(2.0, 5.0, fsrsScheduler.GRADE_GOOD, 0.2);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:83:      const highRetrievability = fsrsScheduler.updateStability(2.0, 5.0, fsrsScheduler.GRADE_GOOD, 0.9);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:140:      const reviewed = fsrsScheduler.processReview({
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:145:      }, fsrsScheduler.GRADE_AGAIN);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:294:      const nextReviewDate = fsrsScheduler.getNextReviewDate(5);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:295:      expect(Number.isNaN(new Date(nextReviewDate).getTime())).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-retry-stats.vitest.ts:3:// Phase 004 CHK-023 (memory_health embeddingRetry), CHK-024 (retry manager edge cases)
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:36:/** In-memory-only snapshot of embedding retry health — no DB access. */
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:537: * Return a lightweight in-memory snapshot of embedding retry health.
.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:68:    expect(parsed.data.graphOps.doctor.surface).toBe('memory_health');
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:12:  { tool: 'memory_health', handler: 'handleMemoryHealth', layer: 'L3' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:38:  { camel: 'handleMemoryHealth', snake: 'handle_memory_health' },
.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts:993:  it('healthy workspace — no repairs needed, no writes', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts:995:    const specDir = createSpecFolder(tmpDir, '001-healthy', '# Healthy Spec');
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:68:    tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/lib/providers/README.md:119:| `getEmbeddingRetryStats` | `() => EmbeddingRetryStats` | Get a lightweight in-memory retry health snapshot without DB access |
.opencode/skill/system-spec-kit/mcp_server/lib/providers/README.md:135:| `EmbeddingRetryStats` | In-memory retry health snapshot returned by `getEmbeddingRetryStats()`, including pending/failed counts, retry attempts, circuit-breaker state, last run and queue depth |
.opencode/skill/system-spec-kit/mcp_server/lib/providers/README.md:189:| Check queue stats | `getRetryStats()` | Monitor health |
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:202:    const result = fsrs.processReview(initial, 3);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:207:    expect(result).toHaveProperty('nextReviewDate');
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:212:    const result = fsrs.processReview(initial, 3);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:218:    const result = fsrs.processReview(initial, 3);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:224:  it('D-04: grade AGAIN decreases stability', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:226:    const result = fsrs.processReview(params, fsrs.GRADE_AGAIN);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:230:  it('D-05: grade EASY increases stability', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:232:    const result = fsrs.processReview(params, fsrs.GRADE_EASY);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:236:  it('D-06: grade GOOD increases stability', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:238:    const result = fsrs.processReview(params, fsrs.GRADE_GOOD);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:242:  it('D-07: grade HARD gives <= stability than GOOD', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:244:    const resultHard = fsrs.processReview(params, fsrs.GRADE_HARD);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:245:    const resultGood = fsrs.processReview(params, fsrs.GRADE_GOOD);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:249:  it('D-08: nextReviewDate is valid future date', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:250:    const result = fsrs.processReview(initial, 3);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:251:    const nextDate = new Date(result.nextReviewDate);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:257:    const result = fsrs.processReview(initial, 3);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:264:    const result1 = fsrs.processReview(params, 3);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:265:    const result2 = fsrs.processReview(result1, 4);
.opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:163:        trackAccess: false,
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
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:447:      'Run memory_health() to check system status'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:450:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:487:      'Check memory_health() for recovery options'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:490:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:529:      'Run memory_health() to check database status'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:532:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:628:      'Run memory_causal_stats() to inspect graph health',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:659:      'Check memory_health() for system status',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:663:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:677:    'Run memory_health() for diagnostics',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:682:  toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:699:        'Check embedding provider status: memory_health()',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:734:        'Run memory_health() to verify database integrity'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:737:      toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:757:        'Check memory_health() for embedding provider status'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:760:      toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:111:      trackAccess: true,
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:225:  it('records adaptive access signals when trackAccess is true and adaptive ranking enabled', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:173:      computeQualityScore: vi.fn(() => ({ level: 'healthy' })),
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:176:    vi.doMock('../handlers/session-health.js', () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:180:          text: JSON.stringify({ status: 'ok', data: { state: 'ok', hints: ['health ok'] } }),
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:24:        memory_health: 1000,
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:123:        memory_health: 'L3',
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:123:    const contract = buildStructuralBootstrapContract('session_health');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:126:    expect(contract.sourceSurface).toBe('session_health');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:140:    const surfaces = ['auto-prime', 'session_bootstrap', 'session_resume', 'session_health'] as const;
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:158:    vi.doMock('../handlers/session-health.js', () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:162:          text: JSON.stringify({ status: 'ok', data: { state: 'ok', hints: ['health ok'] } }),
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-ops-hardening.vitest.ts:23:    expect(contract.doctor.surface).toBe('memory_health');
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:448:  it('J2: DEFAULT_HINT actions reference memory_health()', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:450:    expect(actionsStr).toContain('memory_health');
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:166:      'memory_health',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:199:      'session_health',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:295:      'memory_validate', 'memory_save', 'memory_index_scan', 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:303:      'session_health', 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:320:    it('T16d: only session_health is excluded from tool-call tracking', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:321:      expect(sourceCode).toMatch(/if \(name !== 'session_health'\) \{/)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:322:      expect(sourceCode).not.toMatch(/name !== 'session_health' && name !== 'session_bootstrap'/)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2090:      'memory_health': '[L3:Discovery]',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:105:        level: 'healthy',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:201:    vi.doMock('../handlers/session-health.js', () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:205:          text: JSON.stringify({ status: 'ok', data: { state: 'ok', hints: ['health ok'] } }),
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:239:    expect(parsed.data.payloadContract.summary).toContain('health=estimated');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:244:      'health-surface': 'estimated',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:263:    vi.doMock('../handlers/session-health.js', () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:267:          text: JSON.stringify({ status: 'ok', data: { state: 'ok', hints: ['health ok'] } }),
.opencode/skill/system-spec-kit/mcp_server/tests/context-metrics.vitest.ts:85:      expect(score.level).toMatch(/^(healthy|degraded|critical)$/);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:26:  executePipeline: vi.fn(async () => ({
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
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-comparison.vitest.ts:44:  'memory health',
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-comparison.vitest.ts:89:  'implement zero-downtime deployment strategy using blue-green deployment with automated health checks and rollback',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:58:    // Fix F23 — include cleanupOrphanedEdges in mock for health auto-repair coverage.
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:440:    providerMetadata = { provider: 'test', model: 'test-model', healthy: true },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1119:  it('EXT-H1: Healthy system returns status=healthy', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1125:    expect(parsed?.data?.status).toBe('healthy');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1153:      providerMetadata: { provider: 'huggingface', model: 'gte-small', healthy: true },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1176:      .mockImplementation(() => ({ provider: 'voyage', model: 'voyage-4', healthy: true, dim: 1024 }));
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1193:      providerMetadata: { provider: 'voyage', healthy: true },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1215:      providerMetadata: { provider: 'voyage', healthy: true },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1244:      providerMetadata: { provider: 'voyage', healthy: true },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1448:      healthy: true,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1522:      healthy: true,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1591:      healthy: true,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1642:      healthy: true,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1707:  it('EXT-EMR1: setEmbeddingModelReady(true) reflected in health', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1726:  it('EXT-EMR3: Toggle sequence ends healthy', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1734:    expect(parsed?.data?.status).toBe('healthy');
.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts:380:  it('R6-T27: executePipeline is exported from pipeline index', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts:381:    const { executePipeline } = await import('../lib/search/pipeline');
.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts:382:    expect(typeof executePipeline).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/tests/hydra-spec-pack-consistency.vitest.ts:41:  'mcp_server/lib/search/graph-health.ts',
.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:42:const GOOD_CONTENT = `# Sprint 0 Measurement Foundation
.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:66:const GOOD_METADATA = {
.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:281:    const score = computeMemoryQualityScore(GOOD_CONTENT, GOOD_METADATA);
.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:305:    const score = computeMemoryQualityScore(GOOD_CONTENT, GOOD_METADATA);
.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:449:    const result = runQualityLoop(GOOD_CONTENT, GOOD_METADATA);
.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:572:      runQualityLoop(GOOD_CONTENT, GOOD_METADATA, { emitEvalMetrics: false });
.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:634:      expect(() => runQualityLoop(GOOD_CONTENT, GOOD_METADATA)).not.toThrow();
.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:635:      expect(runQualityLoop(GOOD_CONTENT, GOOD_METADATA).passed).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/search-fallback-tiered.vitest.ts:311:    const healthy = __testables.checkDegradation([
.opencode/skill/system-spec-kit/mcp_server/tests/search-fallback-tiered.vitest.ts:316:    expect(healthy).toBeNull();
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:434:- `code_graph_status` (graph health check)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:436:- `session_health` (session readiness check)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:579:`memory_stats()` returns counts, dates and top-ranked folders for the memory system. Use it to confirm indexing is working and to inspect database health.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:62:   2. DIVERSITY HARD GATES
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:72:  MIN_HARD_NEGATIVES: 3,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:271:    required: GATES.MIN_HARD_NEGATIVES,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:273:    passed: hardNegativeCount >= GATES.MIN_HARD_NEGATIVES,
.opencode/skill/system-spec-kit/mcp_server/README.md:174:After connecting your MCP client, call the health check:
.opencode/skill/system-spec-kit/mcp_server/README.md:178:  "tool": "memory_health",
.opencode/skill/system-spec-kit/mcp_server/README.md:517:**12-metric core computation** -- grades every query across twelve quality dimensions (MRR@1/3/10, NDCG@10, MAP and more). Together they pinpoint exactly where search is struggling, like a doctor running multiple tests instead of just asking "do you feel sick?"
.opencode/skill/system-spec-kit/mcp_server/README.md:545:**Startup/recovery surfaces:** `session_resume`, `session_bootstrap`, and the startup brief now report freshness-aware graph status instead of count-only health. Startup surfaces are intentionally non-mutating snapshots, so later structural reads may still differ if repo state changes.
.opencode/skill/system-spec-kit/mcp_server/README.md:601:Resume session with combined memory, code graph and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. The response carries freshness-aware code-graph status (`fresh`, `stale`, `empty`, `error`) instead of count-only health. For the canonical first-call recovery path on session start or after `/clear`, prefer `session_bootstrap`.
.opencode/skill/system-spec-kit/mcp_server/README.md:612:Complete session bootstrap in one call. This is the canonical first-call recovery step on session start or after `/clear`. It wraps the full `session_resume` payload plus `session_health` and returns context, health, structural readiness and recommended next actions. Startup/bootstrap surfaces are freshness-aware but non-mutating; use `code_graph_scan` when readiness shows an empty or broad full-scan state.
.opencode/skill/system-spec-kit/mcp_server/README.md:763:##### `memory_health`
.opencode/skill/system-spec-kit/mcp_server/README.md:765:Run a health check. This is the diagnostic tool for when search quality degrades or something feels off. It checks for stale indexes, divergent aliases, broken embeddings and other issues. It can also attempt automatic repairs.
.opencode/skill/system-spec-kit/mcp_server/README.md:777:##### `session_health`
.opencode/skill/system-spec-kit/mcp_server/README.md:783:| _(none required)_ |  | Returns health status with hints |
.opencode/skill/system-spec-kit/mcp_server/README.md:1167:Report code graph index health: file count, node and edge counts by type, parse health summary, last scan timestamp, DB file size and schema version.
.opencode/skill/system-spec-kit/mcp_server/README.md:1171:| _(none required)_ |  | Returns health report |
.opencode/skill/system-spec-kit/mcp_server/README.md:1181:| _(none required)_ |  | Returns CocoIndex health |
.opencode/skill/system-spec-kit/mcp_server/README.md:1260:| L3 | Discovery | 4 | 800 | Browse what is stored, check system health |
.opencode/skill/system-spec-kit/mcp_server/README.md:1542:| Diagnose search problems | `memory_health` | Set `reportMode: "full"` |
.opencode/skill/system-spec-kit/mcp_server/README.md:1560:**Fix**: Run a health check with auto-repair, then retry with a higher quality floor:
.opencode/skill/system-spec-kit/mcp_server/README.md:1563:{ "tool": "memory_health", "arguments": { "reportMode": "full", "autoRepair": true } }
.opencode/skill/system-spec-kit/mcp_server/README.md:1663:{ "tool": "memory_health", "arguments": { "reportMode": "divergent_aliases", "limit": 20 } }
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:110:// T018: Session-level tracking for prime package and session_health
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:220:      WHERE parse_health = 'error' OR parse_health = 'recovered'
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:680:  // T018: Session tracking for session_health tool
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:689:// T018: Export types for session-health handler
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:35:The telemetry module provides structured observability for the retrieval pipeline and scoring subsystem. It records per-stage latency, search mode selection, fallback triggers, composite quality scores, scoring observation samples, trace payload validation, and agent consumption events. Telemetry data flows to governance tooling and is used by retrieval handlers to surface pipeline health metrics.
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:108:When `SPECKIT_EXTENDED_TELEMETRY` is disabled (default), the minimal `RetrievalTelemetry` shell is still created so callers can rely on a stable shape. Latency, mode, fallback, quality, graph-health, and adaptive sub-metrics remain zeroed/empty, while the baseline architecture snapshot still records the current memory-roadmap phase/capability defaults.
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:274:**Purpose**: Return shape from `sampleTracePayloads()` containing sanitized trace details and graph-health context.
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:279:| `graphHealth` | `GraphHealthMetrics` | Graph-health counters associated with the sampled retrieval payload |
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:86:  healthPayload?: SharedPayloadEnvelope | null;
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:94:    args.healthPayload?.kind,
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:99:  const messagePayloads = [args.resumePayload, args.healthPayload].filter(
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:10:  | 'health'
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:158:    | 'session_health'
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:67:    useCase: 'Explore available memories, check system health, view statistics.',
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:68:    tools: ['memory_list', 'memory_stats', 'memory_health', 'session_health']
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-crud.vitest.ts:77:        'handle_memory_health',
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:148:  trackAccess: z.boolean().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:404:  memory_health: memoryHealthSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:454:  session_health: getSchema({}) as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:463:  memory_search: ['cursor', 'query', 'concepts', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'sessionId', 'enableDedup', 'tier', 'contextType', 'useDecay', 'includeContiguity', 'includeConstitutional', 'enableSessionBoost', 'enableCausalBoost', 'includeContent', 'anchors', 'min_quality_score', 'minQualityScore', 'bypassCache', 'rerank', 'applyLengthPenalty', 'applyStateLimits', 'minState', 'intent', 'autoDetectIntent', 'trackAccess', 'includeArchived', 'mode', 'includeTrace', 'profile'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:469:  memory_health: ['reportMode', 'limit', 'specFolder', 'autoRepair', 'confirmed'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:496:  session_health: [],
.opencode/skill/system-spec-kit/mcp_server/hooks/index.ts:12:  // T018: Session tracking for session_health tool
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/README.md:49:| L3 | Discovery | 800 | Browse and explore (list, stats, health) |
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:40:const GRADE_AGAIN = 1;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:41:const GRADE_HARD = 2;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:42:const GRADE_GOOD = 3;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:43:const GRADE_EASY = 4;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:70:  nextReviewDate: string;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:106:  if (grade === GRADE_AGAIN) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:113:  const gradeFactor = grade === GRADE_EASY ? 1.3 : grade === GRADE_GOOD ? 1.0 : 0.8;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:144:  if (grade === GRADE_AGAIN) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:146:  } else if (grade === GRADE_HARD) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:148:  } else if (grade === GRADE_GOOD) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:151:    // EASY
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:200:function processReview(params: FsrsParams, grade: number): ReviewResult {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:207:  const nextReviewDate = getNextReviewDate(newStability);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:214:    nextReviewDate,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:226:  GRADE_AGAIN,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:227:  GRADE_HARD,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:228:  GRADE_GOOD,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:229:  GRADE_EASY,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:461:  GRADE_AGAIN,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:462:  GRADE_HARD,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:463:  GRADE_GOOD,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:464:  GRADE_EASY,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:294:  GRADE_GOOD,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:307:  GRADE_GOOD,   // grade (3 = successful recall)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:315:const result = processReview(params, GRADE_GOOD);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:316:// result = { stability, difficulty, lastReview, reviewCount, nextReviewDate, retrievability }
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:323:- `GRADE_AGAIN (1)`: Failed recall → Stability × 0.2
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:324:- `GRADE_HARD (2)`: Difficult recall → gradeFactor 0.8
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:325:- `GRADE_GOOD (3)`: Successful recall → gradeFactor 1.0
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:326:- `GRADE_EASY (4)`: Easy recall → gradeFactor 1.3
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:504:activateMemoryWithFsrs(memoryId, 3);  // memoryId, grade (default: 3 = GOOD)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:774:decay.activateMemoryWithFsrs(42, 3);  // memoryId=42, grade=GOOD(3)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:178:      result = fsrsScheduler.processReview(params, grade);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:186:        nextReviewDate: new Date().toISOString(),
.opencode/skill/system-spec-kit/mcp_server/hooks/README.md:18:- [3. HARDENING NOTES](#3--hardening-notes)
.opencode/skill/system-spec-kit/mcp_server/hooks/README.md:75:## 3. HARDENING NOTES
.opencode/skill/system-spec-kit/mcp_server/configs/README.md:20:- [3. HARDENING NOTES](#3--hardening-notes)
.opencode/skill/system-spec-kit/mcp_server/configs/README.md:59:## 3. HARDENING NOTES
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:165:      trackAccess: {
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:237:  name: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:238:  description: '[L3:Discovery] Check health status of the memory system. Token Budget: 800.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:263:        description: 'When true in full mode, attempts best-effort repair actions for detected health issues (e.g., FTS rebuild).'
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:268:        description: 'Required with autoRepair:true to execute repair actions. When false or omitted, memory_health returns a confirmation-only response.'
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:658:  description: '[L7:Maintenance] Report code graph index health: file count, node/edge counts by type, parse health summary, last scan timestamp, DB file size, schema version. Token Budget: 500.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:731:// T018: Session health diagnostic tool
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:733:  name: 'session_health',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:756:  description: '[L1:Orchestration] Complete session bootstrap in one call. Returns session context, system health, structural readiness, and recommended next actions. This is the canonical first recovery call on session start or after /clear; it wraps the full session_resume payload plus session_health.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:769:      health: { type: 'object', description: 'session_health payload (system status, database health, MCP connectivity)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:772:      nextActions: { type: 'array', items: { type: 'string' }, description: 'Up to 3 recommended next actions derived from resume, health, and structural status' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:774:    required: ['resume', 'health', 'hints', 'nextActions'],
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:845:  description: '[L9:CoverageGraph] Report deep-loop coverage graph health: node/edge counts grouped by kind and relation, current convergence signal values, momentum (signal deltas between snapshots), last iteration, schema version, and DB file size. Suitable for dashboards and synthesis surfaces.',
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:17:import { executePipeline, type PipelineConfig } from '../search/pipeline/index.js';
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:239:    trackAccess: false,
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:325:  const pipelineResult = await executePipeline(buildReplayPipelineConfig(queryText, searchLimit));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:280: * Return current graph channel metrics for health check reporting.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2104: *   → Pass if quality signal is healthy AND count >= 3
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2108: *   → Pass if quality signal is healthy AND count >= 3
.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:129:      return ['[session] Context quality is CRITICAL. Consider running `memory_context({ mode: "resume" })` or `session_health` to diagnose.'];
.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts:86:function trackAccess(memoryId: number): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts:328:  trackAccess,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md:65:- `incremental-index.ts` uses `file_mtime_ms`, `content_hash`, and `embedding_status` together, so unchanged-path fast paths still requeue rows whose embeddings are unhealthy.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:108:5. Testing effect — FSRS strengthening write-back (opt-in via `trackAccess`)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:679:Same-path `unchanged` only applies to healthy existing rows (`success`, `pending`, `partial`), so unhealthy embedding states still re-enter indexing. Cross-path content-hash dedup accepts chunked parents only when the parent row is in valid `partial` state and ignores invalid parent rows marked `complete`.
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:101:      'healthy',
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:57:export async function executePipeline(config: PipelineConfig): Promise<PipelineResult> {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:14://     - FSRS write-back to memory_index (when trackAccess=true) — DB write
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:28:// 3.  Testing effect          — FSRS strengthening write-back (trackAccess)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:533: * handler. Uses GRADE_GOOD with a difficulty bonus inversely proportional
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:559:    const grade = fsrsScheduler.GRADE_GOOD;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:843: * Called only when `trackAccess` is true (P3-09 FIX: explicit opt-in to avoid
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:848: * GRADE_GOOD update — increasing stability proportional to how much the memory
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:936: *   3.  Testing effect     (all types, when trackAccess = true)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1195:  // P3-09 FIX: Only when explicitly opted in via trackAccess.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1198:  if (config.trackAccess) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:286: * - "good":  most results have high/medium confidence and a healthy top score
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:29:  doctor: {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:31:    surface: 'memory_health';
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:86:    doctor: {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:88:      surface: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:100:      recommendedAction: 'Use memory_health({ autoRepair: true, confirmed: true }) for bounded repair workflows and transparent partial-success reporting.',
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:152:  trackAccess: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/index.ts:12:export { executePipeline } from './orchestrator.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:36:The public API is a single function: `executePipeline(config)` exported from `index.ts`.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:44:| `index.ts` | Public barrel export. Re-exports `executePipeline` from the orchestrator and all pipeline type definitions from `types.ts`. |
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:87:- FSRS testing effect fires only when `trackAccess` is explicitly true.
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:63:    parse_health TEXT DEFAULT 'clean',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:279:        file_mtime_ms = ?, parse_health = ?, indexed_at = ?, parse_duration_ms = ?
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:287:      file_path, language, content_hash, file_mtime_ms, node_count, edge_count, parse_health, indexed_at, parse_duration_ms
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:639:  const healthRows = d.prepare('SELECT parse_health, COUNT(*) as c FROM code_files GROUP BY parse_health').all() as { parse_health: string; c: number }[];
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:640:  for (const r of healthRows) parseHealthSummary[r.parse_health] = r.c;

exec
/bin/zsh -lc "sed -n '480,840p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
──────────────────────────────────────────────────────────────── */

/** Handle memory_search tool — performs hybrid vector/BM25 search with intent-aware ranking.
 * @param args - Search arguments (query, concepts, mode, specFolder, etc.)
 * @returns MCP response with ranked search results
 */
async function handleMemorySearch(args: SearchArgs): Promise<MCPResponse> {
  const _searchStartTime = Date.now();
  resetLastLexicalCapabilitySnapshot();
  // BUG-001: Check for external database updates before processing
  await checkDatabaseUpdated();

  const {
    cursor,
    query,
    concepts,
    specFolder,
    folderBoost,
    tenantId,
    userId,
    agentId,
    sharedSpaceId,
    limit: rawLimit = 10,
    tier,
    contextType,
    useDecay: useDecay = true,
    includeContiguity: includeContiguity = false,
    includeConstitutional: includeConstitutional = true,
    includeContent: includeContent = false,
    anchors,
    bypassCache: bypassCache = false,
    sessionId,
    enableDedup: enableDedup = true,
    intent: explicitIntent,
    autoDetectIntent: autoDetectIntent = true,
    minState,  // No default — memoryState column not yet in schema; defaulting to 'WARM' filters all rows
    applyStateLimits: applyStateLimits = false,
    rerank = true, // Enable reranking by default for better result quality
    applyLengthPenalty: applyLengthPenalty = true,
    trackAccess: trackAccess = false, // opt-in, off by default
    includeArchived: includeArchived = false, // REQ-206: exclude archived by default
    enableSessionBoost: enableSessionBoost = isSessionBoostEnabled(),
    enableCausalBoost: enableCausalBoost = isCausalBoostEnabled(),
    minQualityScore,
    min_quality_score,
    mode,
    includeTrace: includeTraceArg = false,
    sessionTransition,
    profile,
    retrievalLevel: retrievalLevel = 'auto',
  } = args;
  const includeTraceByFlag = process.env.SPECKIT_RESPONSE_TRACE === 'true';
  const includeTrace = includeTraceByFlag || includeTraceArg === true;
  const normalizedScope = normalizeScopeContext({ tenantId, userId, agentId, sessionId, sharedSpaceId });
  const progressiveScopeKey = JSON.stringify({
    tenantId: normalizedScope.tenantId ?? null,
    userId: normalizedScope.userId ?? null,
    agentId: normalizedScope.agentId ?? null,
    sessionId: normalizedScope.sessionId ?? null,
    sharedSpaceId: normalizedScope.sharedSpaceId ?? null,
  });

  // Validate at least one search input is provided (moved from schema superRefine for GPT compatibility)
  const hasCursor = typeof cursor === 'string' && cursor.trim().length > 0;
  const hasQuery = typeof query === 'string' && query.trim().length > 0;
  const hasConcepts = Array.isArray(concepts) && concepts.length >= 2;
  if (!hasCursor && !hasQuery && !hasConcepts) {
    return { content: [{ type: 'text', text: JSON.stringify({ error: 'Either "query" (string), "concepts" (array with 2-5 items), or "cursor" (string) is required.' }) }] };
  }

  if (hasCursor) {
    const resolved = resolveCursor(cursor.trim(), undefined, { scopeKey: progressiveScopeKey });
    if (!resolved) {
      return createMCPErrorResponse({
        tool: 'memory_search',
        error: 'Cursor is invalid, expired, or out of scope',
        code: 'E_VALIDATION',
        details: { parameter: 'cursor' },
        recovery: {
          hint: 'Retry the original search to generate a fresh continuation cursor',
        },
      });
    }

    const snippetResults = extractSnippets(resolved.results);
    return createMCPSuccessResponse({
      tool: 'memory_search',
      summary: `Returned ${snippetResults.length} continuation results`,
      data: {
        count: snippetResults.length,
        results: snippetResults,
        continuation: resolved.continuation,
      },
      startTime: _searchStartTime,
      cacheHit: false,
    });
  }

  const qualityThreshold = resolveQualityThreshold(minQualityScore, min_quality_score);

  // Validate numeric limit parameter
  const limit = (typeof rawLimit === 'number' && Number.isFinite(rawLimit) && rawLimit > 0)
    ? Math.min(Math.floor(rawLimit), 100)
    : 10;

  // BUG-007: Validate query first with proper error handling
  let normalizedQuery: string | null = null;
  if (query !== undefined) {
    try {
      normalizedQuery = validateQuery(query);
    } catch (validationError: unknown) {
      if (!concepts || !Array.isArray(concepts) || concepts.length < 2) {
        const message = toErrorMessage(validationError);
        return createMCPErrorResponse({
          tool: 'memory_search',
          error: message,
          code: 'E_VALIDATION',
          details: { parameter: 'query' },
          recovery: {
            hint: 'Provide a valid query string or use concepts array instead'
          }
        });
      }
      normalizedQuery = null;
    }
  }

  const hasValidQuery = normalizedQuery !== null;
  const hasValidConcepts = Array.isArray(concepts) && concepts.length >= 2;
  const effectiveQuery = normalizedQuery ?? (hasValidConcepts ? concepts.join(', ') : '');

  if (!hasValidQuery && !hasValidConcepts) {
    return createMCPErrorResponse({
      tool: 'memory_search',
      error: 'Either query (string), concepts (array of 2-5 strings), or cursor (string) is required',
      code: 'E_VALIDATION',
      details: { parameter: 'query' },
      recovery: {
        hint: 'Provide a query string, concepts array with 2-5 entries, or a continuation cursor'
      }
    });
  }

  if (specFolder !== undefined && typeof specFolder !== 'string') {
    return createMCPErrorResponse({
      tool: 'memory_search',
      error: 'specFolder must be a string',
      code: 'E_VALIDATION',
      details: { parameter: 'specFolder' },
      recovery: {
        hint: 'Provide specFolder as a string path'
      }
    });
  }

  // Eval logger — capture query at pipeline entry (fail-safe)
  let _evalQueryId = 0;
  let _evalRunId = 0;
  try {
    const evalEntry = logSearchQuery({
      query: effectiveQuery,
      intent: explicitIntent ?? null,
      specFolder: specFolder ?? null,
    });
    _evalQueryId = evalEntry.queryId;
    _evalRunId = evalEntry.evalRunId;
  } catch (_error: unknown) { /* eval logging must never break search */ }

  const artifactRoutingQuery = resolveArtifactRoutingQuery(
    normalizedQuery,
    hasValidConcepts ? concepts : undefined
  );
  let artifactRouting = getStrategyForQuery(artifactRoutingQuery, specFolder);

  // Intent-aware retrieval
  let detectedIntent: string | null = null;
  let intentConfidence = 0;
  let intentWeights: IntentWeights | null = null;

  if (explicitIntent) {
    if (intentClassifier.isValidIntent(explicitIntent)) {
      detectedIntent = explicitIntent;
      intentConfidence = 1.0;
      intentWeights = intentClassifier.getIntentWeights(explicitIntent);
    } else {
      console.warn(`[memory-search] Invalid intent '${explicitIntent}', using auto-detection`);
    }
  }

  if (!detectedIntent && autoDetectIntent && hasValidQuery) {
    const classification: IntentClassification = intentClassifier.classifyIntent(normalizedQuery!);
    detectedIntent = classification.intent;
    intentConfidence = classification.confidence;
    intentWeights = intentClassifier.getIntentWeights(classification.intent as IntentType);

    if (classification.fallback) {
      console.error(`[memory-search] Intent auto-detected as '${detectedIntent}' (fallback: ${classification.reason})`);
    } else {
      console.error(`[memory-search] Intent auto-detected as '${detectedIntent}' (confidence: ${intentConfidence.toFixed(2)})`);
    }
  }

  // FIX RC3-B: Intent confidence floor — override low-confidence auto-detections to "understand"
  const INTENT_CONFIDENCE_FLOOR = parseFloat(process.env.SPECKIT_INTENT_CONFIDENCE_FLOOR || '0.25');
  if (detectedIntent && intentConfidence < INTENT_CONFIDENCE_FLOOR && !explicitIntent) {
    console.error(`[memory-search] Intent confidence ${intentConfidence.toFixed(3)} below floor ${INTENT_CONFIDENCE_FLOOR}, overriding '${detectedIntent}' → 'understand'`);
    detectedIntent = 'understand';
    intentConfidence = 1.0;
    intentWeights = intentClassifier.getIntentWeights('understand' as IntentType);
  }

  // Phase C: Intent-to-profile auto-routing.
  // Explicit caller `profile` always takes precedence; auto-detect fills in when absent.
  let effectiveProfile: string | undefined = profile;
  if (!effectiveProfile && detectedIntent && isIntentAutoProfileEnabled()) {
    try {
      const autoProfile = intentClassifier.getProfileForIntent(detectedIntent as IntentType);
      if (autoProfile) {
        effectiveProfile = autoProfile;
        console.error(`[memory-search] Intent-to-profile auto-routing: '${detectedIntent}' → profile '${autoProfile}'`);
      }
    } catch (_autoProfileErr: unknown) {
      // Auto-profile is best-effort — never breaks search
    }
  }

  // Re-run artifact routing with detected intent for fallback coverage
  if (detectedIntent && artifactRouting?.detectedClass === 'unknown' && artifactRouting?.confidence === 0) {
    artifactRouting = getStrategyForQuery(artifactRoutingQuery, specFolder, detectedIntent);
  }

  // Create retrieval trace at pipeline entry
  const trace = createTrace(
    effectiveQuery,
    sessionId,
    detectedIntent || undefined
  );

  // Build cache key args
  const cacheArgs = buildCacheArgs({
    normalizedQuery,
    hasValidConcepts,
    concepts,
    specFolder,
    tenantId: normalizedScope.tenantId,
    userId: normalizedScope.userId,
    agentId: normalizedScope.agentId,
    sharedSpaceId: normalizedScope.sharedSpaceId,
    limit,
    mode,
    tier,
    contextType,
    useDecay,
    includeArchived,
    qualityThreshold,
    applyStateLimits,
    includeContiguity,
    includeConstitutional,
    includeContent,
    anchors,
    detectedIntent,
    minState: minState ?? '',
    rerank,
    applyLengthPenalty,
    sessionId,
    enableSessionBoost,
    enableCausalBoost,
    includeTrace,
  });

  let _evalChannelPayloads: EvalChannelPayload[] = [];
  const cacheKey = toolCache.generateCacheKey('memory_search', cacheArgs);
  const cacheEnabled = toolCache.isEnabled() && !bypassCache;
  const cachedPayload = cacheEnabled
    ? toolCache.get<SearchCachePayload>(cacheKey)
    : null;

  let responseToReturn: MCPResponse;
  let goalRefinementPayload: Record<string, unknown> | null = null;

  if (cachedPayload) {
    responseToReturn = buildSearchResponseFromPayload(cachedPayload, _searchStartTime, true);
  } else {
    // Wait for embedding model only on cache miss
    if (!isEmbeddingModelReady()) {
      const modelReady = await waitForEmbeddingModel(30000);
      if (!modelReady) {
        throw new Error('Embedding model not ready after 30s timeout. Try again later.');
      }
    }

    // V2 pipeline is the only path (legacy V1 removed from the runtime pipeline)
    const pipelineConfig: PipelineConfig = {
      query: effectiveQuery,
      concepts: hasValidConcepts ? concepts : undefined,
      searchType: (hasValidConcepts && concepts!.length >= 2)
        ? 'multi-concept'
        : 'hybrid',
      mode,
      limit,
      specFolder,
      tenantId: normalizedScope.tenantId,
      userId: normalizedScope.userId,
      agentId: normalizedScope.agentId,
      sharedSpaceId: normalizedScope.sharedSpaceId,
      tier,
      contextType,
      includeArchived,
      includeConstitutional,
      includeContent,
      anchors,
      qualityThreshold,
      minState: minState ?? '',
      applyStateLimits,
      useDecay,
      rerank,
      applyLengthPenalty,
      sessionId,
      enableDedup,
      enableSessionBoost,
      enableCausalBoost,
      trackAccess,
      detectedIntent,
      intentConfidence,
      intentWeights: toIntentWeightsConfig(intentWeights),
      artifactRouting: artifactRouting as unknown as PipelineConfig['artifactRouting'],
      trace,
    };

    const pipelineResult: PipelineResult = await executePipeline(pipelineConfig);
    let resultsForFormatting = pipelineResult.results as unknown as SessionAwareResult[];

    // Phase B T018/T019: Community search fallback — inject community members on weak results
    let communityFallbackApplied = false;
    const shouldRunCommunitySearch = (
      isDualRetrievalEnabled() &&
      isCommunitySearchFallbackEnabled() &&
      effectiveQuery.length > 0 &&
      (retrievalLevel === 'global' || retrievalLevel === 'auto')
    );
    if (shouldRunCommunitySearch) {
      const isWeakResult = resultsForFormatting.length === 0 ||
        (retrievalLevel === 'global') ||
        (resultsForFormatting.length < 3 && retrievalLevel === 'auto');
      if (isWeakResult) {
        try {
          const communityResults = searchCommunities(effectiveQuery, requireDb(), 5);
          if (communityResults.totalMemberIds.length > 0) {
            // Fetch the actual memory rows for community member IDs
            const memberIds = communityResults.totalMemberIds.slice(0, 20);
            const placeholders = memberIds.map(() => '?').join(', ');
            const db = requireDb();
            const memberRows = db.prepare(`
              SELECT id, title, similarity, content, file_path, importance_tier, context_type,
                     quality_score, created_at
              FROM memory_index
              WHERE id IN (${placeholders})
            `).all(...memberIds) as Array<Record<string, unknown> & { id: number }>;

            if (memberRows.length > 0) {
              // Mark community-sourced results and assign a base score

exec
/bin/zsh -lc "sed -n '520,940p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
      graphEvidence: {
        edges,
        communities,
        boostFactors,
      },
    };
  });
}

/**
 * Write an FSRS strengthening update for a single memory access.
 *
 * Mirrors the `strengthenOnAccess` logic from the legacy memory-search
 * handler. Uses GRADE_GOOD with a difficulty bonus inversely proportional
 * to current retrievability, so low-retrievability memories receive the
 * largest stability boost.
 *
 * @param db             - Active SQLite connection
 * @param memoryId       - ID of the memory being strengthened
 * @param retrievability - Current retrievability R(t) in [0, 1]
 */
function strengthenOnAccess(
  db: Database.Database,
  memoryId: number,
  retrievability: number
): StrengthenResult | null {
  if (typeof memoryId !== 'number' || !Number.isFinite(memoryId)) return null;

  const clampedR = (typeof retrievability === 'number' && retrievability >= 0 && retrievability <= 1)
    ? retrievability
    : 0.9;

  try {
    const memory = db.prepare(
      'SELECT stability, difficulty, review_count FROM memory_index WHERE id = ?'
    ).get(memoryId) as Record<string, unknown> | undefined;

    if (!memory) return null;

    const grade = fsrsScheduler.GRADE_GOOD;
    const difficultyBonus = Math.max(0, (0.9 - clampedR) * 0.5);

    const newStability = fsrsScheduler.updateStability(
      (memory.stability as number) || fsrsScheduler.DEFAULT_INITIAL_STABILITY,
      (memory.difficulty as number) || fsrsScheduler.DEFAULT_INITIAL_DIFFICULTY,
      grade,
      clampedR
    ) * (1 + difficultyBonus);

    db.prepare(`
      UPDATE memory_index
      SET stability = ?,
          last_review = CURRENT_TIMESTAMP,
          review_count = review_count + 1,
          access_count = access_count + 1,
          last_accessed = ?
      WHERE id = ?
    `).run(newStability, Date.now(), memoryId);

    return { stability: newStability, difficulty: (memory.difficulty as number) || fsrsScheduler.DEFAULT_INITIAL_DIFFICULTY };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`[stage2-fusion] strengthenOnAccess failed for id ${memoryId}: ${message}`);
    return null;
  }
}

// -- Exported internal functions (also exposed via __testables) --

/**
 * Apply intent-based weights to search results.
 *
 * G2 PREVENTION: This function is ONLY called for non-hybrid search types.
 * Hybrid search (RRF / RSF) already incorporates intent-weighted signals
 * during fusion. Calling this on hybrid results would double-count intent.
 *
 * Weight combination:
 *   intentScore = similarity * w.similarity + importance * w.importance + recency * w.recency
 *
 * Similarity is normalised from the raw 0–100 scale to 0–1 before the
 * weighted combination so all three dimensions operate on the same scale.
 * Results are sorted descending by intentAdjustedScore.
 *
 * @param results - Pipeline rows to score
 * @param weights - Intent weight configuration {similarity, importance, recency}
 * @returns New array sorted by intentAdjustedScore descending
 */
function applyIntentWeightsToResults(
  results: PipelineRow[],
  weights: IntentWeightsConfig
): PipelineRow[] {
  if (!Array.isArray(results) || results.length === 0) return results;
  if (!weights) return results;

  const scored: ScoredRow[] = results.map((row) => {
    // Normalise similarity from 0–100 to 0–1 for proper weight combination
    const similarityRaw = typeof row.similarity === 'number' && Number.isFinite(row.similarity)
      ? row.similarity
      : resolveBaseScore(row) * 100; // fall back to base score rescaled

    const similarity = Math.max(0, Math.min(1, similarityRaw / 100));
    const importance = typeof row.importance_weight === 'number' && Number.isFinite(row.importance_weight)
      ? row.importance_weight
      : 0.5;

    // Recency: use created_at as the timestamp (ISO string stored in DB)
    const recencyTimestamp = (row.created_at as string | undefined) ?? '';
    const importanceTier = (row.importance_tier as string | undefined) ?? 'normal';
    const recency = computeRecencyScore(recencyTimestamp, importanceTier);

    const intentScore =
      similarity * weights.similarity +
      importance * weights.importance +
      recency * weights.recency;

    return {
      ...row,
      intentAdjustedScore: intentScore,
    };
  });

  return scored.sort((a, b) => {
    const aScore = typeof a.intentAdjustedScore === 'number' ? a.intentAdjustedScore : 0;
    const bScore = typeof b.intentAdjustedScore === 'number' ? b.intentAdjustedScore : 0;
    if (bScore === aScore) return (a.id ?? 0) - (b.id ?? 0);
    return bScore - aScore;
  });
}

/**
 * Apply artifact routing weight boosts to results.
 *
 * When the routing system detected a known artifact class with non-zero
 * confidence, the class strategy's `boostFactor` is applied to the
 * current composite score (`score`, then `rrfScore`, then `similarity`).
 * Results are re-sorted by score descending after boosting.
 *
 * @param results       - Pipeline rows to boost
 * @param routingResult - Artifact routing configuration from Stage 1
 * @returns New array with updated scores, sorted descending
 */
function applyArtifactRouting(
  results: PipelineRow[],
  routingResult: ArtifactRoutingConfig
): PipelineRow[] {
  if (!Array.isArray(results) || results.length === 0) return results;
  if (!routingResult || routingResult.confidence <= 0) return results;

  // Obtain boostFactor from the strategy object (passed through config)
  const strategy = routingResult.strategy as { boostFactor?: number; maxResults?: number };
  const boostFactor = typeof strategy?.boostFactor === 'number'
    ? Math.max(0, Math.min(2, strategy.boostFactor))
    : 1.0;

  if (boostFactor === 1.0) {
    // No boost; still re-sort for consistency
    return sortDeterministicRows(results as Array<PipelineRow & { id: number }>);
  }

  const boosted = results.map((row) => {
    const baseScore = resolveBaseScore(row);
    const boostedScore = baseScore * boostFactor;
    return {
      ...withSyncedScoreAliases(row, boostedScore),
      artifactBoostApplied: boostFactor,
    };
  });

  return sortDeterministicRows(boosted as Array<PipelineRow & { id: number }>);
}

/**
 * Apply feedback signals — learned trigger boosts and negative feedback demotions.
 *
 * Learned triggers: each memory that matches the query's learned terms receives
 * a proportional boost to its score (capped at 1.0). The boost magnitude uses
 * `match.weight` directly because queryLearnedTriggers already applies the
 * configured learned-trigger weighting (0.7x).
 *
 * Negative feedback: memories with wasUseful=false validations receive a
 * confidence-multiplier demotion. The multiplier is batch-loaded from the DB
 * then applied via applyNegativeFeedback. Feature-gated via
 * SPECKIT_NEGATIVE_FEEDBACK env var.
 *
 * @param results - Pipeline rows to adjust
 * @param query   - Original search query (used for learned trigger matching)
 * @returns New array with feedback-adjusted scores
 */
function applyFeedbackSignals(
  results: PipelineRow[],
  query: string
): PipelineRow[] {
  if (!Array.isArray(results) || results.length === 0) return results;

  let db: Database.Database | null = null;
  try {
    db = requireDb();
  } catch (error: unknown) {
    if (error instanceof Error) {
      // DB not available — skip feedback signals gracefully
      return results;
    }
    // DB not available — skip feedback signals gracefully
    return results;
  }

  // -- Learned trigger boosts --
  let learnedBoostMap = new Map<number, number>();
  try {
    const learnedMatches = queryLearnedTriggers(query, db as Parameters<typeof queryLearnedTriggers>[1]);
    for (const match of learnedMatches) {
      const boost = match.weight;
      const existing = learnedBoostMap.get(match.memoryId) ?? 0;
      learnedBoostMap.set(match.memoryId, Math.max(existing, boost));
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`[stage2-fusion] learned trigger query failed: ${message}`);
    learnedBoostMap = new Map();
  }

  // -- Negative feedback stats (batch load) --
  let negativeFeedbackStats = new Map<number, { negativeCount: number; lastNegativeAt: number | null }>();
  if (isNegativeFeedbackEnabled()) {
    try {
      const memoryIds = results.map((r) => r.id);
      negativeFeedbackStats = getNegativeFeedbackStats(db as Parameters<typeof getNegativeFeedbackStats>[0], memoryIds);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`[stage2-fusion] negative feedback stats failed: ${message}`);
    }
  }

  // -- Apply combined adjustments --
  return results.map((row) => {
    let currentScore = resolveBaseScore(row);

    // Apply learned trigger boost (additive to base score, capped at 1.0)
    const learnedBoost = learnedBoostMap.get(row.id) ?? 0;
    if (learnedBoost > 0) {
      currentScore = Math.min(1.0, currentScore + learnedBoost);
    }

    // Apply negative feedback demotion (multiplicative confidence multiplier)
    if (isNegativeFeedbackEnabled()) {
      const negStats = negativeFeedbackStats.get(row.id);
      if (negStats && negStats.negativeCount > 0) {
        currentScore = applyNegativeFeedback(
          currentScore,
          negStats.negativeCount,
          negStats.lastNegativeAt
        );
      }
    }

    if (currentScore === resolveBaseScore(row)) return row;

    return withSyncedScoreAliases(row, currentScore);
  });
}

function applyUsageRankingBoost(
  db: Database.Database,
  results: PipelineRow[],
): PipelineRow[] {
  if (!isUsageRankingEnabled() || !Array.isArray(results) || results.length === 0) {
    return results;
  }

  try {
    ensureUsageColumn(db);
    const resultIds = results
      .map((row) => row.id)
      .filter((id): id is number => typeof id === 'number' && Number.isFinite(id));

    if (resultIds.length === 0) {
      return results;
    }

    const placeholders = resultIds.map(() => '?').join(',');
    const usageRows = db.prepare(`
      SELECT id, COALESCE(access_count, 0) AS access_count
      FROM memory_index
      WHERE id IN (${placeholders})
    `).all(...resultIds) as Array<{ id: number; access_count: number }>;

    if (usageRows.length === 0) {
      return results;
    }

    const maxAccess = usageRows.reduce((currentMax, row) =>
      Math.max(currentMax, Number.isFinite(row.access_count) ? row.access_count : 0), 0);

    if (maxAccess <= 0) {
      return results;
    }

    const usageMap = new Map(usageRows.map((row) => [row.id, row.access_count]));
    const boosted = results.map((row) => {
      const accessCount = usageMap.get(row.id) ?? 0;
      const usageBoost = computeUsageBoost(accessCount, maxAccess);

      if (usageBoost <= 0) {
        return row;
      }

      return {
        ...withSyncedScoreAliases(row, resolveBaseScore(row) + usageBoost),
        usageBoost,
      };
    });

    return sortDeterministicRows(boosted as Array<PipelineRow & { id: number }>);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`[stage2-fusion] usage ranking failed: ${message}`);
    return results;
  }
}

/**
 * Apply FSRS testing effect (strengthening write-back) for all accessed memories.
 *
 * Called only when `trackAccess` is true (P3-09 FIX: explicit opt-in to avoid
 * unintended write side-effects during read-only searches).
 *
 * For each result, the current retrievability R(t) is computed from the stored
 * stability and last_review fields, then `strengthenOnAccess` fires an FSRS
 * GRADE_GOOD update — increasing stability proportional to how much the memory
 * needed the review.
 *
 * Errors per-row are caught and logged; they do not abort the full set.
 *
 * @param db      - Active SQLite database connection
 * @param results - Pipeline rows that were accessed
 */
function applyTestingEffect(
  db: Database.Database,
  results: PipelineRow[]
): void {
  if (!db || !Array.isArray(results) || results.length === 0) return;

  for (const row of results) {
    try {
      const lastReview = (row.last_review as string | undefined | null) || (row.created_at as string | undefined);
      if (!lastReview) continue;

      const stability = typeof row.stability === 'number' && Number.isFinite(row.stability)
        ? row.stability
        : fsrsScheduler.DEFAULT_INITIAL_STABILITY;

      const elapsedDays = fsrsScheduler.calculateElapsedDays(lastReview);
      const currentR = fsrsScheduler.calculateRetrievability(
        stability,
        Math.max(0, elapsedDays)
      );

      strengthenOnAccess(db, row.id, currentR);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`[stage2-fusion] applyTestingEffect failed for id ${row.id}: ${message}`);
    }
  }
}

function recordAdaptiveAccessSignals(
  db: Database.Database,
  results: PipelineRow[],
  query: string | undefined
): void {
  if (!db || !Array.isArray(results) || results.length === 0) return;

  if (getAdaptiveMode() === 'disabled') return;

  ensureAdaptiveTables(db);
  const insertAdaptiveSignal = db.prepare(`
    INSERT INTO adaptive_signal_events (memory_id, signal_type, signal_value, query, actor, metadata)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const writeAdaptiveSignals = db.transaction((accessedResults: PipelineRow[]) => {
    for (const result of accessedResults) {
      insertAdaptiveSignal.run(
        result.id,
        'access',
        1.0,
        query || '',
        '',
        '{}',
      );
    }
  });

  try {
    writeAdaptiveSignals(results);
  } catch (err: unknown) {
    // Adaptive signal capture must never block the core search pipeline.
    console.warn('[stage2-fusion] adaptive access signal write failed:', (err as Error)?.message ?? err);
  }
}

// -- Main Stage 2 entry point --

/**
 * Execute Stage 2: Fusion + Signal Integration.
 *
 * This is the SINGLE authoritative point where all scoring signals are
 * applied. The ordering is fixed and must not be changed without updating
 * the architectural documentation (see types.ts Stage2 comment block).
 *
 * Signal application order (13 steps):
 *   1.  Session boost      (hybrid only — working memory attention)
 *   1a. Recency fusion     (all types — time-decay bonus)
 *   2.  Causal boost       (hybrid only — graph-traversal amplification)
 *   2a. Co-activation      (spreading activation from top-N seeds)
 *   2b. Community boost    (N2c — inject co-members)
 *   2c. Graph signals      (N2a+N2b — momentum + depth)
 *   3.  Testing effect     (all types, when trackAccess = true)
 *   4.  Intent weights     (non-hybrid only — G2 prevention)
 *   5.  Artifact routing   (all types, when routing confidence > 0)
 *   6.  Feedback signals   (all types — learned triggers + negative feedback)
 *   7.  Artifact limiting  (trim to strategy.maxResults if routing active)

exec
/bin/zsh -lc "sed -n '2280,2360p' .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    ensureCompanionTables(database);
    ensureLineageTables(database);
    ensureGovernanceTables(database);
    ensureSharedSpaceTables(database);
    const compatibility = validate_backward_compatibility(database);
    if (!compatibility.compatible) {
      logger.warn(
        'Existing schema is not fully backward-compatible after bootstrap',
        compatibility as unknown as Record<string, unknown>
      );
    }
    // the rollout (REQ-S2-001) — embedding cache table must exist before any
    // Save/index operation so lookupEmbedding() can skip redundant provider calls.
    ensureEmbeddingCacheSchema(database);
    return;
  }

  // Create memory_index table (metadata only)
  database.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      spec_folder TEXT NOT NULL,
      file_path TEXT NOT NULL,
      canonical_file_path TEXT,
      anchor_id TEXT,
      title TEXT,
      trigger_phrases TEXT,
      importance_weight REAL DEFAULT 0.5,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      embedding_model TEXT,
      embedding_generated_at TEXT,
      embedding_status TEXT DEFAULT 'pending' CHECK(embedding_status IN ('pending', 'success', 'failed', 'retry', 'partial')),
      retry_count INTEGER DEFAULT 0,
      last_retry_at TEXT,
      failure_reason TEXT,
      base_importance REAL DEFAULT 0.5,
      decay_half_life_days REAL DEFAULT 90.0,
      is_pinned INTEGER DEFAULT 0,
      access_count INTEGER DEFAULT 0,
      last_accessed INTEGER DEFAULT 0,
      importance_tier TEXT DEFAULT 'normal' CHECK(importance_tier IN ('constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated')),
      tenant_id TEXT,
      user_id TEXT,
      agent_id TEXT,
      session_id TEXT,
      shared_space_id TEXT,
      context_type TEXT DEFAULT 'general' CHECK(context_type IN ('research', 'implementation', 'planning', 'general')),
      channel TEXT DEFAULT 'default',
      content_hash TEXT,
      provenance_source TEXT,
      provenance_actor TEXT,
      governed_at TEXT,
      retention_policy TEXT DEFAULT 'keep',
      delete_after TEXT,
      governance_metadata TEXT,
      expires_at DATETIME,
      confidence REAL DEFAULT 0.5,
      validation_count INTEGER DEFAULT 0,
      -- FSRS (Free Spaced Repetition Scheduler) columns for cognitive memory
      stability REAL DEFAULT 1.0,
      difficulty REAL DEFAULT 5.0,
      last_review TEXT,
      review_count INTEGER DEFAULT 0,
      file_mtime_ms INTEGER,
      is_archived INTEGER DEFAULT 0,
      document_type TEXT DEFAULT 'memory',
      spec_level INTEGER,
      content_text TEXT,
      quality_score REAL DEFAULT 0,
      quality_flags TEXT,
      parent_id INTEGER REFERENCES memory_index(id) ON DELETE CASCADE,
      chunk_index INTEGER,
      chunk_label TEXT,
      encoding_intent TEXT DEFAULT 'document',
      learned_triggers TEXT DEFAULT '[]',
      interference_score REAL DEFAULT 0,
      UNIQUE(spec_folder, file_path, anchor_id)
    )
  `);


exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ────────────────────────────────────────────────────────────────
// MODULE: Memory Crud Types
// ────────────────────────────────────────────────────────────────

/* ───────────────────────────────────────────────────────────────
   TYPES
──────────────────────────────────────────────────────────────── */

/** Arguments for the memory_delete handler. */

// Feature catalog: Memory indexing (memory_save)
// Feature catalog: Memory metadata update (memory_update)
// Feature catalog: Single and folder delete (memory_delete)
// Feature catalog: Tier-based bulk deletion (memory_bulk_delete)

interface DeleteArgs {
  id?: number | string;
  specFolder?: string;
  confirm?: boolean;
}

/** Arguments for the memory_update handler. */
interface UpdateArgs {
  id: number;
  title?: string;
  triggerPhrases?: string[];
  importanceWeight?: number;
  importanceTier?: string;
  allowPartialUpdate?: boolean;
}

/** Arguments for the memory_list handler. */
interface ListArgs {
  limit?: number;
  offset?: number;
  specFolder?: string;
  sortBy?: string;
  includeChunks?: boolean;
}

/** Arguments for the memory_stats handler. */
interface StatsArgs {
  folderRanking?: string;
  excludePatterns?: string[];
  includeScores?: boolean;
  includeArchived?: boolean;
  limit?: number;
}

/** Arguments for the memory_health handler. */
interface HealthArgs {
  reportMode?: 'full' | 'divergent_aliases';
  limit?: number;
  specFolder?: string;
  autoRepair?: boolean;
  confirmed?: boolean;
}

/** Partial embedding provider metadata — see shared/types.ts ProviderMetadata for the full shape. */
interface PartialProviderMetadata {
  provider: string;
  model?: string;
  dim?: number;
  healthy?: boolean;
}

/** Snapshot of a memory's hash state for mutation tracking. */
interface MemoryHashSnapshot {
  id: number;
  content_hash: string | null;
  spec_folder?: string | null;
  file_path?: string | null;
}

/** Valid mutation types for the CRUD ledger. */
type CrudMutationType = 'create' | 'update' | 'delete' | 'merge' | 'archive' | 'restore' | 'reindex';

/** Input parameters for recording a mutation in the ledger. */
interface MutationLedgerInput {
  mutationType: CrudMutationType;
  reason: string;
  priorHash: string | null;
  newHash: string;
  linkedMemoryIds: number[];
  decisionMeta: Record<string, unknown>;
  actor: string;
  sessionId?: string | null;
}

/** Result returned by post-mutation hooks (cache invalidation, etc.). */
interface MutationHookResult {
  latencyMs: number;
  triggerCacheCleared: boolean;
  constitutionalCacheCleared: boolean;
  toolCacheInvalidated: number;
  graphSignalsCacheCleared: boolean;
  coactivationCacheCleared: boolean;
  errors: string[];
}

/* ───────────────────────────────────────────────────────────────
   EXPORTS
──────────────────────────────────────────────────────────────── */

export type {
  DeleteArgs,
  UpdateArgs,
  ListArgs,
  StatsArgs,
  HealthArgs,
  PartialProviderMetadata,
  MemoryHashSnapshot,
  CrudMutationType,
  MutationLedgerInput,
  MutationHookResult,
};

exec
/bin/zsh -lc "rg -n \"handleMemoryValidate|memory_validate|wasUseful|validation_count|confidence_score\" .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/mcp_server/lib -g '"'!**/*.map'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:9:// Feature catalog: Validation feedback (memory_validate)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts:20:// Feature catalog: Validation feedback (memory_validate)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:27:// Feature catalog: Validation feedback (memory_validate)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:31:// Feature catalog: Validation feedback (memory_validate)
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:287:export const handleMemoryValidate = lazyFunction(getCheckpointsModule, 'handleMemoryValidate');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:292:export const handle_memory_validate = lazyFunction(getCheckpointsModule, 'handle_memory_validate');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts:22:// Feature catalog: Validation feedback (memory_validate)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:29:// Feature catalog: Validation feedback (memory_validate)
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:36:- `checkpoints.ts` - Checkpoint lifecycle plus `memory_validate`.
.opencode/skill/system-spec-kit/mcp_server/handlers/handler-utils.ts:21:// Feature catalog: Validation feedback (memory_validate)
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:85:  wasUseful: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:648:/** Handle memory_validate tool - records user validation feedback to adjust confidence */
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:649:async function handleMemoryValidate(args: MemoryValidateArgs): Promise<MCPResponse> {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:654:    wasUseful,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:669:  if (typeof wasUseful !== 'boolean') {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:670:    throw new Error('wasUseful is required and must be a boolean');
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:681:  const result: ValidationResult = confidenceTracker.recordValidation(database, memoryId, wasUseful);
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:685:      signalType: wasUseful ? 'outcome' : 'correction',
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:688:      actor: sessionId ?? 'memory_validate',
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:710:  if (wasUseful) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:722:  if (!wasUseful) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:726:  // T002 + T027a: Optional wiring from memory_validate to learned feedback + ground truth.
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:735:  if (wasUseful && typeof queryId === 'string' && queryId.trim().length > 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:767:  const summary = wasUseful
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:775:  if (!wasUseful && result.validationCount > 3) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:780:    tool: 'memory_validate',
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:784:      wasUseful: wasUseful,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:807:  handleMemoryValidate,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:815:const handle_memory_validate = handleMemoryValidate;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:822:  handle_memory_validate,
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:99:    validation_count INTEGER NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:131:      'SELECT importance_tier, validation_count, confidence FROM memory_index WHERE id = ?'
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:134:      validation_count?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:149:    const totalValidationCount = memory.validation_count ?? 0;
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:183:        reason: `below_threshold: positive_validation_count=${validationCount}/${path.threshold}`,
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:192:      reason: `threshold_met: positive_validation_count=${validationCount}>=${path.threshold}`,
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:251:          (memory_id, previous_tier, new_tier, validation_count, promoted_at)
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:298:      SELECT id, importance_tier, validation_count
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:301:        AND validation_count >= ?
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:305:      validation_count: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:317:        row.validation_count ?? 0,
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:328:        reason: `threshold_met: positive_validation_count=${positiveValidationCount}>=${path.threshold}`,
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts:4:// When wasUseful=false is recorded via memory_validate, reduce the
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts:69: * @param negativeCount - Number of negative (wasUseful=false) validations
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:57:  validation_count?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:40:  validation_count?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:100: * - This function updates `memory_index.confidence` and `validation_count`,
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:102: * - For `wasUseful=false`, `handlers/checkpoints.ts` pairs this update with
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:108:export function recordValidation(db: Database, memoryId: number, wasUseful: boolean): ValidationResult {
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:114:        SELECT confidence, validation_count, importance_tier FROM memory_index WHERE id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:124:      if (wasUseful) {
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:130:      const currentValidationCount = memory.validationCount ?? memory.validation_count ?? 0;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:135:        SET confidence = ?, validation_count = ?, updated_at = ?
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:140:      const effectiveNegativeValidationCount = wasUseful
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:155:      if (!wasUseful) {
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:209:      SELECT confidence, validation_count, importance_tier FROM memory_index WHERE id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:222:    const validationCount = memory.validationCount ?? memory.validation_count ?? 0;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:240:        SELECT confidence, validation_count, importance_tier FROM memory_index WHERE id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:251:      const validationCount = memory.validationCount ?? memory.validation_count ?? 0;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:257:        `and positive_validation_count >= ${PROMOTION_VALIDATION_THRESHOLD} (current: ${positiveValidationCount})`
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:286:      SELECT confidence, validation_count, importance_tier FROM memory_index WHERE id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:294:    const validationCount = memory.validationCount ?? memory.validation_count ?? 0;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:208:          created_at, updated_at, confidence, validation_count, access_count
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:699: * Negative feedback: memories with wasUseful=false validations receive a
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:128:- HVR score = validated_useful_count / total_validation_count
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:260:> **Note on `validationCount`:** SQLite returns `validation_count` (snake_case column name).
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:261:> The code type-casts to include both `validationCount` and `validation_count` for safety,
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:263:> `validation_count` is used at runtime. No bug, but the type cast is defensive/misleading.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1697:  if (!column_names.includes('validation_count')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1699:      database.exec(`ALTER TABLE memory_index ADD COLUMN validation_count INTEGER DEFAULT 0`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1700:      console.warn('[vector-index] Migration: Added validation_count column');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1705:      logDuplicateColumnMigrationSkip('validation_count', error);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2338:      validation_count INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:66:  'validation_count',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:142:      validation_count INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:751:`wasUseful=false` validations apply a demotion multiplier to composite scores. Penalty: -0.1 per negative validation, floor at 0.3 (never suppress below 30%). 30-day half-life recovery: penalty halves over time if no further negative feedback. Gated via `SPECKIT_NEGATIVE_FEEDBACK` (default ON).
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1338:    'validation_count',
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:77:    tools: ['memory_update', 'memory_delete', 'memory_validate', 'memory_bulk_delete']

codex
I’ve confirmed two important runtime facts: `memory_search` already funnels through a single exported `executePipeline(config)` core, and FSRS write-back today is only the implicit `trackAccess`/`GRADE_GOOD` path. That makes the blueprint much cleaner: one new explicit review mutation, one presentation layer over `memory_health`, and one guardrail pass that keeps any new retrieval surface pipeline-backed rather than inventing side paths.
exec
/bin/zsh -lc "sed -n '640,820p' .opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    startTime: startTime
  });
}

/* ───────────────────────────────────────────────────────────────
   7. MEMORY VALIDATE HANDLER
──────────────────────────────────────────────────────────────── */

/** Handle memory_validate tool - records user validation feedback to adjust confidence */
async function handleMemoryValidate(args: MemoryValidateArgs): Promise<MCPResponse> {
  const startTime = Date.now();
  await checkDatabaseUpdated();
  const {
    id,
    wasUseful,
    queryId,
    queryTerms,
    resultRank,
    totalResultsShown,
    searchMode,
    intent,
    sessionId,
    notes,
  } = args;

  if (id === undefined || id === null) {
    throw new Error('id is required');
  }

  if (typeof wasUseful !== 'boolean') {
    throw new Error('wasUseful is required and must be a boolean');
  }

  const memoryId = parseMemoryId(id);

  vectorIndex.initializeDb();
  const database = requireDb();
  const normalizedQueryId = typeof queryId === 'string' && queryId.trim().length > 0
    ? queryId.trim()
    : null;
  const queryText = resolveValidationQueryText(database, normalizedQueryId ?? undefined);
  const result: ValidationResult = confidenceTracker.recordValidation(database, memoryId, wasUseful);
  try {
    recordAdaptiveSignal(database, {
      memoryId,
      signalType: wasUseful ? 'outcome' : 'correction',
      signalValue: 1,
      query: queryText,
      actor: sessionId ?? 'memory_validate',
      metadata: {
        queryId: normalizedQueryId,
        queryText,
        resultRank: typeof resultRank === 'number' ? resultRank : null,
        totalResultsShown: typeof totalResultsShown === 'number' ? totalResultsShown : null,
        intent: intent ?? null,
      },
    });
  } catch (_error: unknown) {
    // Adaptive signals are best-effort only
  }

  // T002a: Auto-promotion wiring on positive feedback.
  let autoPromotion: {
    attempted: boolean;
    promoted: boolean;
    previousTier?: string;
    newTier?: string;
    reason?: string;
  } | null = null;

  if (wasUseful) {
    const promotionResult = executeAutoPromotion(database, memoryId);
    autoPromotion = {
      attempted: true,
      promoted: promotionResult.promoted,
      previousTier: promotionResult.previousTier,
      newTier: promotionResult.newTier,
      reason: promotionResult.reason,
    };
  }

  // T002b: Negative-feedback confidence signal persistence for runtime scoring.
  if (!wasUseful) {
    recordNegativeFeedbackEvent(database, memoryId);
  }

  // T002 + T027a: Optional wiring from memory_validate to learned feedback + ground truth.
  let learnedFeedback: {
    attempted: boolean;
    applied: boolean;
    termsLearned: string[];
    reason?: string;
  } | null = null;
  let groundTruthSelectionId: number | null = null;

  if (wasUseful && typeof queryId === 'string' && queryId.trim().length > 0) {
    groundTruthSelectionId = recordUserSelection(queryId, memoryId, {
      searchMode,
      intent,
      selectedRank: resultRank,
      totalResultsShown,
      sessionId,
      notes,
    });

    const normalizedTerms = Array.isArray(queryTerms)
      ? queryTerms.filter((term) => typeof term === 'string' && term.trim().length > 0).map((term) => term.trim())
      : [];

    if (typeof resultRank === 'number' && Number.isFinite(resultRank) && resultRank > 0 && normalizedTerms.length > 0) {
      const learnResult = recordSelection(queryId, memoryId, normalizedTerms, Math.floor(resultRank), database);
      learnedFeedback = {
        attempted: true,
        applied: learnResult.applied,
        termsLearned: learnResult.terms,
        reason: learnResult.reason,
      };
    } else {
      learnedFeedback = {
        attempted: false,
        applied: false,
        termsLearned: [],
        reason: 'missing_query_terms_or_rank',
      };
    }
  }

  const summary = wasUseful
    ? `Positive validation recorded (confidence: ${result.confidence.toFixed(2)})`
    : `Negative validation recorded (confidence: ${result.confidence.toFixed(2)})`;

  const hints: string[] = [];
  if (result.promotionEligible) {
    hints.push('Memory eligible for promotion to critical tier');
  }
  if (!wasUseful && result.validationCount > 3) {
    hints.push('Consider updating or deleting this memory if consistently unhelpful');
  }

  return createMCPSuccessResponse({
    tool: 'memory_validate',
    summary,
    data: {
      memoryId,
      wasUseful: wasUseful,
      confidence: result.confidence,
      validationCount: result.validationCount,
      positiveValidationCount: result.positiveValidationCount,
      promotionEligible: result.promotionEligible,
      autoPromotion,
      learnedFeedback,
      groundTruthSelectionId,
    },
    hints,
    startTime: startTime
  });
}

/* ───────────────────────────────────────────────────────────────
   8. EXPORTS
──────────────────────────────────────────────────────────────── */

export {
  handleCheckpointCreate,
  handleCheckpointList,
  handleCheckpointRestore,
  handleCheckpointDelete,
  handleMemoryValidate,
};

// Backward-compatible aliases (snake_case)
const handle_checkpoint_create = handleCheckpointCreate;
const handle_checkpoint_list = handleCheckpointList;
const handle_checkpoint_restore = handleCheckpointRestore;
const handle_checkpoint_delete = handleCheckpointDelete;
const handle_memory_validate = handleMemoryValidate;

export {
  handle_checkpoint_create,
  handle_checkpoint_list,
  handle_checkpoint_restore,

exec
/bin/zsh -lc "sed -n '1660,1735p' .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:

function safe_get_schema_version(database: Database.Database): number | null {
  try {
    if (!hasTable(database, 'schema_version')) {
      return null;
    }
    const row = database.prepare('SELECT version FROM schema_version WHERE id = 1').get() as { version?: number } | undefined;
    if (typeof row?.version === 'number' && Number.isFinite(row.version)) {
      return row.version;
    }
    return null;
  } catch (_error: unknown) {
    return null;
  }
}

/**
 * Adds legacy confidence-related columns when needed.
 * @param database - The database connection to migrate.
 * @returns Nothing.
 */
export function migrate_confidence_columns(database: Database.Database): void {
  const columns = database.prepare(`PRAGMA table_info(memory_index)`).all() as Array<{ name: string }>;
  const column_names = columns.map((c) => c.name);

  if (!column_names.includes('confidence')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN confidence REAL DEFAULT 0.5`);
      console.warn('[vector-index] Migration: Added confidence column');
    } catch (error: unknown) {
      if (!get_error_message(error).includes('duplicate column')) {
        throw error;
      }
      logDuplicateColumnMigrationSkip('confidence', error);
    }
  }

  if (!column_names.includes('validation_count')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN validation_count INTEGER DEFAULT 0`);
      console.warn('[vector-index] Migration: Added validation_count column');
    } catch (error: unknown) {
      if (!get_error_message(error).includes('duplicate column')) {
        throw error;
      }
      logDuplicateColumnMigrationSkip('validation_count', error);
    }
  }

  if (!column_names.includes('importance_tier')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN importance_tier TEXT DEFAULT 'normal'`);
      console.warn('[vector-index] Migration: Added importance_tier column');
    } catch (error: unknown) {
      if (!get_error_message(error).includes('duplicate column')) {
        throw error;
      }
      logDuplicateColumnMigrationSkip('importance_tier', error);
    }
    try {
      database.exec(`CREATE INDEX IF NOT EXISTS idx_importance_tier ON memory_index(importance_tier)`);
      console.warn('[vector-index] Migration: Created idx_importance_tier index');
    } catch (error: unknown) {
      logger.warn('Index creation failed (non-critical)', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  if (!column_names.includes('context_type')) {
    try {
      database.exec(`ALTER TABLE memory_index ADD COLUMN context_type TEXT DEFAULT 'general'`);
      console.warn('[vector-index] Migration: Added context_type column');
    } catch (error: unknown) {
      if (!get_error_message(error).includes('duplicate column')) {
        throw error;

exec
/bin/zsh -lc "sed -n '1188,1225p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    results = populateGraphEvidence(results);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`[stage2-fusion] graph evidence provenance failed: ${message}`);
  }

  // -- 3. Testing effect (FSRS write-back) --
  // P3-09 FIX: Only when explicitly opted in via trackAccess.
  // Write-back is fire-and-forget; errors per-row are swallowed inside
  // ApplyTestingEffect so they never abort the pipeline.
  if (config.trackAccess) {
    try {
      const db = requireDb();
      applyTestingEffect(db, results);
      recordAdaptiveAccessSignals(db, results, config.query);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`[stage2-fusion] testing effect skipped (db unavailable): ${message}`);
    }
  }

  // -- 4. Intent weights --
  // G2 PREVENTION: Only apply for non-hybrid search types.
  // Hybrid search (RRF / RSF) incorporates intent weighting during fusion —
  // Applying it again here would double-count, causing the G2 bug.
  if (!isHybrid && config.intentWeights) {
    try {
      const weighted = applyIntentWeightsToResults(results, config.intentWeights);
      results = weighted.map((result) =>
        typeof result.intentAdjustedScore === 'number'
          ? withSyncedScoreAliases(result, result.intentAdjustedScore)
          : result
      );
      metadata.intentWeightsApplied = 'applied';
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`[stage2-fusion] intent weights failed: ${message}`);
      metadata.intentWeightsApplied = 'failed';

exec
/bin/zsh -lc "sed -n '1,180p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-020.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
# Iteration 020: FINAL SYNTHESIS

## Focus
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
- `external/internal/index/bm25.go`
- `external/internal/index/cache.go`
- `external/internal/index/crossref.go`
- `external/internal/index/facts.go`
- `external/internal/index/indexer.go`
- `external/internal/librarian/search.go`
- `external/internal/markdown/parser.go`
- `external/internal/markdown/writer.go`
- `external/internal/mcp/memory.go`
- `external/internal/mcp/vault.go`
- `external/internal/vault/facts.go`
- `external/internal/vault/prs.go`
- `external/internal/vault/trust.go`
- `external/internal/vault/missions.go`
- `external/internal/learnings/learnings.go`
- `external/internal/vault/vault.go`
- `external/cmd/modus-memory/doctor.go`
- `external/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/index.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts`
- `research/iterations/iteration-010.md`
- `research/iterations/iteration-012.md`
- `research/iterations/iteration-013.md`
- `research/iterations/iteration-014.md`
- `research/iterations/iteration-015.md`
- `research/iterations/iteration-017.md`
- `research/iterations/iteration-018.md`
- `research/iterations/iteration-019.md`

## Assessment
- New information ratio: 0.39
- Questions addressed: which Modus patterns still survive final scrutiny; which ones are operator-surface wins versus retrieval regressions; whether broader control-plane ideas like PRs and trust stages hold up in code; what the final adopt/prototype/reject map should be.
- Questions answered: Public should **not** become “Modus with hybrid search.” It should keep its stronger hybrid/governed core, **ship review + doctor first**, then add **due-state and proposal workflow** as real product surfaces, while rejecting Modus’s fuzzy caching, permissive markdown semantics, and default write-on-read policy.

## Reflection
- What worked: The best synthesis came from tracing every promising Modus surface back to its actual state mutation path, then comparing that against the concrete Public MCP surface. That separated “good operator UX” from “unsafe simplification.”
- What did not work: Modus’s README value proposition is directionally right, but most of the final classification turned on source-level details the README does not encode—especially duplicate retrieval paths, success-only reinforce semantics, and the non-enforced trust-stage model.

## Recommended Next Focus
Turn this synthesis into implementation design: define the Public `memory_review` API first, add a doctor-style formatter over `memory_health`, then write the due-state ADR (`persisted next_review_at` vs deterministic derivation) before scoping `memory_due` and the proposal inbox.


Total usage est:        1 Premium request
API time spent:         4m 14s
Total session time:     4m 32s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  1.3m in, 14.8k out, 1.1m cached, 6.4k reasoning (Est. 1 Premium request)

exec
/bin/zsh -lc "rg -n \"doctor|ops-hardening|memory_health\\(\" .opencode/skill/system-spec-kit/mcp_server/lib .opencode/skill/system-spec-kit/mcp_server/handlers -g '"'!**/*.map'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:33:} from '../lib/code-graph/ops-hardening.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:34:} from '../lib/code-graph/ops-hardening.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:26:} from '../lib/code-graph/ops-hardening.js';
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
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:29:  doctor: {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:86:    doctor: {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:100:      recommendedAction: 'Use memory_health({ autoRepair: true, confirmed: true }) for bounded repair workflows and transparent partial-success reporting.',

codex
The blueprint is now mostly an integration map problem, not a product-idea problem. I’m grabbing the last missing wiring points, mainly how a new tool is registered end-to-end and the exact Modus call sites for reinforce and doctor, so the migration steps can be concrete down to handler placement and schema touchpoints.
exec
/bin/zsh -lc "sed -n '1,120p' .opencode/skill/system-spec-kit/mcp_server/handlers/index.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ────────────────────────────────────────────────────────────────
// MODULE: Index
// ────────────────────────────────────────────────────────────────

import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'node:url';

type ModuleLoader<TModule extends object> = () => Promise<TModule>;

async function loadHandlerModule<TModule extends object>(moduleName: string): Promise<TModule> {
  const basePath = path.join(import.meta.dirname, moduleName);
  const candidatePaths = [`${basePath}.js`, `${basePath}.ts`, basePath];

  for (const candidatePath of candidatePaths) {
    if (fs.existsSync(candidatePath)) {
      return await import(pathToFileURL(candidatePath).href) as TModule;
    }
  }

  return await import(pathToFileURL(basePath).href) as TModule;
}

function lazyFunction<
  TModule extends Record<string, unknown>,
  TKey extends keyof TModule,
>(load: ModuleLoader<TModule>, key: TKey): TModule[TKey] {
  return (async (...args: unknown[]) => {
    const module = await load();
    const fn = module[key];
    if (typeof fn !== 'function') {
      throw new Error(`Lazy export '${String(key)}' is not callable`);
    }
    return await (fn as (...fnArgs: unknown[]) => unknown)(...args);
  }) as TModule[TKey];
}

function lazyModule<TModule extends object>(load: ModuleLoader<TModule>): TModule {
  return new Proxy({} as TModule, {
    get(_target, property, receiver) {
      return async (...args: unknown[]) => {
        const module = await load();
        const loadedValue = Reflect.get(module as object, property, receiver);
        if (typeof loadedValue === 'function') {
          return await (loadedValue as (...fnArgs: unknown[]) => unknown)(...args);
        }
        return loadedValue;
      };
    },
    has(_target, property) {
      return typeof property === 'string';
    },
    ownKeys() {
      return [];
    },
    getOwnPropertyDescriptor(_target, _property) {
      return {
        configurable: true,
        enumerable: true,
      };
    },
  });
}

type MemorySearchModule = typeof import('./memory-search.js');
type MemoryTriggersModule = typeof import('./memory-triggers.js');
type MemorySaveModule = typeof import('./memory-save.js');
type PeGatingModule = typeof import('./pe-gating.js');
type MemoryIngestModule = typeof import('./memory-ingest.js');
type MemoryCrudModule = typeof import('./memory-crud.js');
type MemoryIndexModule = typeof import('./memory-index.js');
type MemoryBulkDeleteModule = typeof import('./memory-bulk-delete.js');
type CheckpointsModule = typeof import('./checkpoints.js');
type SessionLearningModule = typeof import('./session-learning.js');
type EvalReportingModule = typeof import('./eval-reporting.js');
type CausalGraphModule = typeof import('./causal-graph.js');
type MemoryContextModule = typeof import('./memory-context.js');
type SharedMemoryModule = typeof import('./shared-memory.js');
type SessionHealthModule = typeof import('./session-health.js');
type SessionResumeModule = typeof import('./session-resume.js');
type SessionBootstrapModule = typeof import('./session-bootstrap.js');

let memorySearchModule: Promise<MemorySearchModule> | null = null;
let memoryTriggersModule: Promise<MemoryTriggersModule> | null = null;
let memorySaveModule: Promise<MemorySaveModule> | null = null;
let peGatingModule: Promise<PeGatingModule> | null = null;
let memoryIngestModule: Promise<MemoryIngestModule> | null = null;
let memoryCrudModule: Promise<MemoryCrudModule> | null = null;
let memoryIndexModule: Promise<MemoryIndexModule> | null = null;
let memoryBulkDeleteModule: Promise<MemoryBulkDeleteModule> | null = null;
let checkpointsModule: Promise<CheckpointsModule> | null = null;
let sessionLearningModule: Promise<SessionLearningModule> | null = null;
let evalReportingModule: Promise<EvalReportingModule> | null = null;
let causalGraphModule: Promise<CausalGraphModule> | null = null;
let memoryContextModule: Promise<MemoryContextModule> | null = null;
let sharedMemoryModule: Promise<SharedMemoryModule> | null = null;
let sessionHealthModule: Promise<SessionHealthModule> | null = null;
let sessionResumeModule: Promise<SessionResumeModule> | null = null;
let sessionBootstrapModule: Promise<SessionBootstrapModule> | null = null;

function getMemorySearchModule(): Promise<MemorySearchModule> {
  if (!memorySearchModule) {
    memorySearchModule = loadHandlerModule<MemorySearchModule>('memory-search');
  }
  return memorySearchModule;
}

function getMemoryTriggersModule(): Promise<MemoryTriggersModule> {
  if (!memoryTriggersModule) {
    memoryTriggersModule = loadHandlerModule<MemoryTriggersModule>('memory-triggers');
  }
  return memoryTriggersModule;
}

function getMemorySaveModule(): Promise<MemorySaveModule> {
  if (!memorySaveModule) {
    memorySaveModule = loadHandlerModule<MemorySaveModule>('memory-save');
  }
  return memorySaveModule;
}

exec
/bin/zsh -lc "rg -n \"toolDefinitions|memoryValidate|memory_health|name: 'memory_validate'|const tools|export \\{.*memoryHealth\" .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts .opencode/skill/system-spec-kit/mcp_server -g '"'!**/*.map'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:237:  name: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:268:        description: 'Required with autoRepair:true to execute repair actions. When false or omitted, memory_health returns a confirmation-only response.'
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:297:const memoryValidate: ToolDefinition = {
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:298:  name: 'memory_validate',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:896:  memoryValidate,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:50:/** Arguments for the memory_health handler. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:14:// Feature catalog: Health diagnostics (memory_health)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:36:const handle_memory_health = handleMemoryHealth;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:45:  handle_memory_health,
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:267:export const handle_memory_health = lazyFunction(getMemoryCrudModule, 'handle_memory_health');
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
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:428:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:439:        'Re-run memory_health with autoRepair:true and confirmed:true to execute repair actions.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:570:    tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:237:  name: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:268:        description: 'Required with autoRepair:true to execute repair actions. When false or omitted, memory_health returns a confirmation-only response.'
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:297:const memoryValidate: ToolDefinition = {
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:298:  name: 'memory_validate',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:896:  memoryValidate,
.opencode/skill/system-spec-kit/mcp_server/utils/tool-input-schema.ts:186:  toolDefinitions: ToolDefinition[]
.opencode/skill/system-spec-kit/mcp_server/utils/tool-input-schema.ts:188:  const toolDefinition = toolDefinitions.find((tool) => tool.name === toolName);
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:218:const memoryValidateSchema = getSchema({
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:404:  memory_health: memoryHealthSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:407:  memory_validate: memoryValidateSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:469:  memory_health: ['reportMode', 'limit', 'specFolder', 'autoRepair', 'confirmed'],
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:68:  'memory_health',
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:103:    case 'memory_health':         return handleMemoryHealth(parseArgs<HealthArgs>(validateToolArgs('memory_health', args)));
.opencode/skill/system-spec-kit/mcp_server/README.md:178:  "tool": "memory_health",
.opencode/skill/system-spec-kit/mcp_server/README.md:763:##### `memory_health`
.opencode/skill/system-spec-kit/mcp_server/README.md:1542:| Diagnose search problems | `memory_health` | Set `reportMode: "full"` |
.opencode/skill/system-spec-kit/mcp_server/README.md:1563:{ "tool": "memory_health", "arguments": { "reportMode": "full", "autoRepair": true } }
.opencode/skill/system-spec-kit/mcp_server/README.md:1663:{ "tool": "memory_health", "arguments": { "reportMode": "divergent_aliases", "limit": 20 } }
.opencode/skill/system-spec-kit/mcp_server/database/README.md:72:- Use MCP tools (`memory_stats`, `memory_health`, `memory_index_scan`) for normal operations.
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:479:describe('memory_health schema', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:482:      validateToolInputSchema('memory_health', { reportMode: 'divergent_aliases', limit: 201 }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:488:      validateToolInputSchema('memory_health', { autoRepair: true, confirmed: true }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:493:    const parsed = validateToolArgs('memory_health', { autoRepair: true, confirmed: true });
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:68:    tools: ['memory_list', 'memory_stats', 'memory_health', 'session_health']
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
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:12:  { tool: 'memory_health', handler: 'handleMemoryHealth', layer: 'L3' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:38:  { camel: 'handleMemoryHealth', snake: 'handle_memory_health' },
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:31:    surface: 'memory_health';
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:88:      surface: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:100:      recommendedAction: 'Use memory_health({ autoRepair: true, confirmed: true }) for bounded repair workflows and transparent partial-success reporting.',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-crud.vitest.ts:77:        'handle_memory_health',
.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:68:    expect(parsed.data.graphOps.doctor.surface).toBe('memory_health');
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:434:  it('T058: DEFAULT_HINT actions include memory_health() reference (REQ-009)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:437:      a.includes('memory_health()')
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:446:  it('T060: DEFAULT_HINT has toolTip for memory_health()', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:447:    expect(DEFAULT_HINT.toolTip).toBe('memory_health()');
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:166:      'memory_health',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:295:      'memory_validate', 'memory_save', 'memory_index_scan', 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:333:      const toolsDir = path.join(SERVER_DIR, 'tools')
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:353:        const toolsDir = path.join(SERVER_DIR, 'tools')
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:471:      toolDefinitions?: Array<{ name: string; description: string; inputSchema: Record<string, unknown> }>
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:617:      vi.doMock('../tool-schemas', () => ({ TOOL_DEFINITIONS: options?.toolDefinitions ?? [] }))
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2090:      'memory_health': '[L3:Discovery]',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-health-edge.vitest.ts:130:        'Re-run memory_health with autoRepair:true and confirmed:true to execute repair actions.',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:68:    tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-retry-stats.vitest.ts:3:// Phase 004 CHK-023 (memory_health embeddingRetry), CHK-024 (retry manager edge cases)
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:24:        memory_health: 1000,
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:77:        const tools = layer.tools;
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:123:        memory_health: 'L3',
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:448:  it('J2: DEFAULT_HINT actions reference memory_health()', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:450:    expect(actionsStr).toContain('memory_health');
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:465:    const tools = Object.keys(TOOL_SPECIFIC_HINTS);
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-ops-hardening.vitest.ts:23:    expect(contract.doctor.surface).toBe('memory_health');

exec
/bin/zsh -lc "sed -n '1,80p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '860,930p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
package mcp

import (
	"github.com/GetModus/modus-memory/internal/vault"
)

// RegisterMemoryTools registers the 11 MCP tools for the modus-memory server.
// All features are free and unrestricted.
//
// Tools:
//
//	vault_search, vault_read, vault_write, vault_list, vault_status,
//	memory_facts, memory_search, memory_store,
//	memory_reinforce, memory_decay_facts, vault_connected
func RegisterMemoryTools(srv *Server, v *vault.Vault) {
	RegisterVaultTools(srv, v)

	// Keep only the 11 memory-relevant tools
	keep := map[string]bool{
		"vault_search":      true,
		"vault_read":        true,
		"vault_write":       true,
		"vault_list":        true,
		"vault_status":      true,
		"memory_facts":      true,
		"memory_search":     true,
		"memory_store":      true,
		"memory_reinforce":  true,
		"memory_decay_facts": true,
		"vault_connected":   true,
	}

	for name := range srv.tools {
		if !keep[name] {
			delete(srv.tools, name)
			delete(srv.handlers, name)
		}
	}
}

 succeeded in 0ms:
		if err != nil {
			return "", err
		}
		return fmt.Sprintf("Decayed %d memory facts.", n), nil
	})

	srv.AddTool("memory_archive_stale", "Archive stale memory facts below confidence threshold.", map[string]interface{}{
		"type": "object",
		"properties": map[string]interface{}{
			"threshold": map[string]interface{}{"type": "number", "description": "Confidence threshold (default 0.1)"},
		},
	}, func(args map[string]interface{}) (string, error) {
		threshold := 0.1
		if t, ok := args["threshold"].(float64); ok {
			threshold = t
		}
		n, err := v.ArchiveStaleFacts(threshold)
		if err != nil {
			return "", err
		}
		return fmt.Sprintf("Archived %d stale facts (below %.2f confidence).", n, threshold), nil
	})

	// --- Memory: Reinforce Fact ---

	srv.AddTool("memory_reinforce", "Reinforce a memory fact after successful recall (FSRS stability growth).", map[string]interface{}{
		"type": "object",
		"properties": map[string]interface{}{
			"path": map[string]interface{}{"type": "string", "description": "Relative vault path to the fact (e.g. memory/facts/some-fact.md)"},
		},
		"required": []string{"path"},
	}, func(args map[string]interface{}) (string, error) {
		path, _ := args["path"].(string)
		if err := v.ReinforceFact(path); err != nil {
			return "", err
		}
		return fmt.Sprintf("Reinforced %s — stability increased, difficulty decreased.", path), nil
	})

	// --- Cross-Reference Query ---

	srv.AddTool("vault_connected", "Find all documents connected to a subject, entity, or tag. Returns facts, beliefs, entities, articles, learnings, and missions that share references.", map[string]interface{}{
		"type": "object",
		"properties": map[string]interface{}{
			"query": map[string]interface{}{"type": "string", "description": "Subject, entity name, or tag to find connections for"},
			"limit": map[string]interface{}{"type": "integer", "description": "Max results (default 20)"},
		},
		"required": []string{"query"},
	}, func(args map[string]interface{}) (string, error) {
		query, _ := args["query"].(string)
		limit := 20
		if l, ok := args["limit"].(float64); ok {
			limit = int(l)
		}

		if v.Index == nil {
			return "Index not loaded.", nil
		}

		refs := v.Index.Connected(query, limit)
		if len(refs) == 0 {
			return fmt.Sprintf("No cross-references found for %q.", query), nil
		}

		return index.FormatConnected(refs), nil
	})

	// --- Distillation Status ---

	srv.AddTool("distill_status", "Check training pair collection and distillation readiness.", map[string]interface{}{
		"type": "object", "properties": map[string]interface{}{},

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/doctor.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
package main

import (
	"fmt"
	"os"
	"sort"
	"strings"

	"github.com/GetModus/modus-memory/internal/index"
	"github.com/GetModus/modus-memory/internal/markdown"
)

// runDoctor performs a diagnostic scan of the vault and reports problems.
// Designed for post-import validation — especially useful after Khoj migration.
func runDoctor(vaultDir string) {
	fmt.Printf("modus-memory doctor %s\n", version)
	fmt.Printf("Vault: %s\n\n", vaultDir)

	// Build index to get stats
	idx, err := index.Build(vaultDir, "")
	if err != nil {
		fmt.Printf("FAIL: cannot build index: %v\n", err)
		os.Exit(1)
	}

	totalFacts, activeFacts := idx.FactCount()
	subjects, tags, entities := idx.CrossRefStats()

	fmt.Printf("Documents: %d\n", idx.DocCount())
	fmt.Printf("Facts: %d total, %d active, %d archived\n", totalFacts, activeFacts, totalFacts-activeFacts)
	fmt.Printf("Cross-refs: %d subjects, %d tags, %d entities\n\n", subjects, tags, entities)

	// Scan all markdown files for diagnostics
	docs, err := markdown.ScanDir(vaultDir)
	if err != nil {
		fmt.Printf("FAIL: cannot scan vault: %v\n", err)
		os.Exit(1)
	}

	var findings []finding

	// Check 1: Facts missing required fields
	missingSubject := 0
	missingPredicate := 0
	for _, doc := range docs {
		if !strings.Contains(doc.Path, "memory/facts") {
			continue
		}
		if doc.Get("subject") == "" {
			missingSubject++
		}
		if doc.Get("predicate") == "" {
			missingPredicate++
		}
	}
	if missingSubject > 0 {
		findings = append(findings, finding{"WARN", fmt.Sprintf("%d facts missing 'subject' field", missingSubject)})
	}
	if missingPredicate > 0 {
		findings = append(findings, finding{"WARN", fmt.Sprintf("%d facts missing 'predicate' field", missingPredicate)})
	}

	// Check 2: Duplicate subjects (same subject + predicate)
	type factKey struct{ subject, predicate string }
	factCounts := make(map[factKey]int)
	for _, doc := range docs {
		if !strings.Contains(doc.Path, "memory/facts") {
			continue
		}
		s := doc.Get("subject")
		p := doc.Get("predicate")
		if s != "" && p != "" {
			factCounts[factKey{s, p}]++
		}
	}
	dupes := 0
	for _, count := range factCounts {
		if count > 1 {
			dupes++
		}
	}
	if dupes > 0 {
		findings = append(findings, finding{"WARN", fmt.Sprintf("%d duplicate subject+predicate pairs", dupes)})
	}

	// Check 3: Empty documents (frontmatter but no body)
	emptyDocs := 0
	for _, doc := range docs {
		if strings.TrimSpace(doc.Body) == "" {
			emptyDocs++
		}
	}
	if emptyDocs > 0 {
		findings = append(findings, finding{"INFO", fmt.Sprintf("%d documents with empty body", emptyDocs)})
	}

	// Check 4: Documents without frontmatter
	noFrontmatter := 0
	for _, doc := range docs {
		if len(doc.Frontmatter) == 0 {
			noFrontmatter++
		}
	}
	if noFrontmatter > 0 {
		findings = append(findings, finding{"INFO", fmt.Sprintf("%d documents without frontmatter", noFrontmatter)})
	}

	// Check 5: Contradictions — same subject, same predicate, different values
	type factEntry struct {
		value string
		path  string
	}
	factValues := make(map[factKey][]factEntry)
	for _, doc := range docs {
		if !strings.Contains(doc.Path, "memory/facts") {
			continue
		}
		s := doc.Get("subject")
		p := doc.Get("predicate")
		if s == "" || p == "" {
			continue
		}
		v := strings.TrimSpace(doc.Body)
		if v == "" {
			v = doc.Get("value")
		}
		if len(v) > 100 {
			v = v[:100]
		}
		key := factKey{strings.ToLower(s), strings.ToLower(p)}
		rel := doc.Path
		if idx := strings.Index(rel, "memory/facts"); idx >= 0 {
			rel = rel[idx:]
		}
		factValues[key] = append(factValues[key], factEntry{v, rel})
	}
	contradictions := 0
	var contradictionDetails []string
	for key, entries := range factValues {
		if len(entries) < 2 {
			continue
		}
		// Check if values actually differ
		seen := make(map[string]bool)
		for _, e := range entries {
			seen[e.value] = true
		}
		if len(seen) > 1 {
			contradictions++
			if len(contradictionDetails) < 5 {
				contradictionDetails = append(contradictionDetails,
					fmt.Sprintf("  %s / %s (%d conflicting values)", key.subject, key.predicate, len(seen)))
			}
		}
	}
	if contradictions > 0 {
		findings = append(findings, finding{"WARN", fmt.Sprintf("%d potential contradictions (same subject+predicate, different values)", contradictions)})
	}

	// Check 6: Vault structure — expected directories
	expectedDirs := []string{"memory/facts", "brain", "atlas"}
	for _, dir := range expectedDirs {
		full := fmt.Sprintf("%s/%s", vaultDir, dir)
		if _, err := os.Stat(full); os.IsNotExist(err) {
			findings = append(findings, finding{"INFO", fmt.Sprintf("directory %s/ does not exist (optional)", dir)})
		}
	}

	// Check 7: Document distribution by directory
	dirCounts := make(map[string]int)
	for _, doc := range docs {
		parts := strings.SplitN(doc.Path, string(os.PathSeparator), 3)
		if len(parts) >= 2 {
			// Get top-level dir relative to vault
			rel := doc.Path
			if idx := strings.LastIndex(rel, vaultDir); idx >= 0 {
				rel = rel[idx+len(vaultDir)+1:]
			}
			topParts := strings.SplitN(rel, string(os.PathSeparator), 3)
			if len(topParts) >= 1 {
				dirCounts[topParts[0]]++
			}
		}
	}

	// Print findings
	fmt.Println("─── Diagnostics ───")
	if len(findings) == 0 {
		fmt.Println("No issues found.")
	} else {
		sort.Slice(findings, func(i, j int) bool {
			return severityRank(findings[i].level) > severityRank(findings[j].level)
		})
		for _, f := range findings {
			fmt.Printf("[%s] %s\n", f.level, f.message)
		}
	}

	if len(contradictionDetails) > 0 {
		fmt.Println("\n─── Contradictions (first 5) ───")
		for _, d := range contradictionDetails {
			fmt.Println(d)
		}
		if contradictions > 5 {
			fmt.Printf("  ... and %d more\n", contradictions-5)
		}
	}

	// Print distribution
	if len(dirCounts) > 0 {
		fmt.Println("\n─── Distribution ───")
		type dirStat struct {
			name  string
			count int
		}
		var stats []dirStat
		for name, count := range dirCounts {
			stats = append(stats, dirStat{name, count})
		}
		sort.Slice(stats, func(i, j int) bool { return stats[i].count > stats[j].count })
		for _, s := range stats {
			fmt.Printf("  %-20s %d docs\n", s.name+"/", s.count)
		}
	}

	fmt.Println()
	if len(findings) == 0 {
		fmt.Println("Vault is healthy.")
	} else {
		warns := 0
		for _, f := range findings {
			if f.level == "WARN" {
				warns++
			}
		}
		if warns > 0 {
			fmt.Printf("%d warnings, %d info. Run after cleanup to verify.\n", warns, len(findings)-warns)
		} else {
			fmt.Printf("%d info items. Vault is healthy.\n", len(findings))
		}
	}
}

type finding struct {
	level   string
	message string
}

func severityRank(level string) int {
	switch level {
	case "FAIL":
		return 3
	case "WARN":
		return 2
	case "INFO":
		return 1
	default:
		return 0
	}
}

exec
/bin/zsh -lc "sed -n '880,910p' .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,140p' .opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  memoryContext,
  sessionResume,
  sessionBootstrap,
  // L2: Core
  memorySearch,
  memoryQuickSearch,
  memoryMatchTriggers,
  memorySave,
  // L3: Discovery
  memoryList,
  memoryStats,
  memoryHealth,
  sessionHealth,
  // L4: Mutation
  memoryDelete,
  memoryUpdate,
  memoryValidate,
  memoryBulkDelete,
  // L5: Lifecycle
  checkpointCreate,
  checkpointList,
  checkpointRestore,
  checkpointDelete,
  sharedSpaceUpsert,
  sharedSpaceMembershipSet,
  sharedMemoryStatus,
  sharedMemoryEnable,
  // L6: Analysis
  taskPreflight,
  taskPostflight,
  memoryDriftWhy,

 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Memory Tools
// ───────────────────────────────────────────────────────────────
// Dispatch for L2-L4 memory tools: search, triggers, save,
// List, stats, health, delete, update, validate (T303).
import {
  handleMemorySearch,
  handleMemoryMatchTriggers,
  handleMemorySave,
  handleMemoryList,
  handleMemoryStats,
  handleMemoryHealth,
  handleMemoryDelete,
  handleMemoryUpdate,
  handleMemoryValidate,
  handleMemoryBulkDelete,
} from '../handlers/index.js';
import { validateToolArgs } from '../schemas/tool-input-schemas.js';

import { parseArgs } from './types.js';
import type {
  MCPResponse,
  SearchArgs,
  TriggerArgs,
  SaveArgs,
  ListArgs,
  StatsArgs,
  HealthArgs,
  DeleteArgs,
  UpdateArgs,
  MemoryValidateArgs,
  BulkDeleteArgs,
} from './types.js';

function relabelResponseTool(response: MCPResponse, toolName: string): MCPResponse {
  const firstEntry = response?.content?.[0];
  if (!firstEntry || firstEntry.type !== 'text' || typeof firstEntry.text !== 'string') {
    return response;
  }

  try {
    const envelope = JSON.parse(firstEntry.text) as Record<string, unknown>;
    const meta = envelope.meta && typeof envelope.meta === 'object'
      ? envelope.meta as Record<string, unknown>
      : {};
    envelope.meta = {
      ...meta,
      tool: toolName,
    };

    return {
      ...response,
      content: [{ ...firstEntry, text: JSON.stringify(envelope, null, 2) }],
    };
  } catch {
    return response;
  }
}

/** Tool names handled by this module */
export const TOOL_NAMES = new Set([
  'memory_search',
  'memory_quick_search',
  'memory_match_triggers',
  'memory_save',
  'memory_list',
  'memory_stats',
  'memory_health',
  'memory_delete',
  'memory_update',
  'memory_validate',
  'memory_bulk_delete',
]);

/** Dispatch a tool call. Returns null if tool name not handled. */
export async function handleTool(name: string, args: Record<string, unknown>): Promise<MCPResponse | null> {
  switch (name) {
    case 'memory_search':         return handleMemorySearch(parseArgs<SearchArgs>(validateToolArgs('memory_search', args)));
    case 'memory_quick_search': {
      // E3: Delegate to memory_search with sensible defaults
      const validated = validateToolArgs('memory_quick_search', args);
      const quickArgs: SearchArgs = {
        query: validated.query as string,
        limit: typeof validated.limit === 'number' ? validated.limit : 10,
        specFolder: validated.specFolder as string | undefined,
        tenantId: validated.tenantId as string | undefined,
        userId: validated.userId as string | undefined,
        agentId: validated.agentId as string | undefined,
        sharedSpaceId: validated.sharedSpaceId as string | undefined,
        autoDetectIntent: true,
        enableDedup: true,
        includeContent: true,
        includeConstitutional: true,
        rerank: true,
      };
      const response = await handleMemorySearch(quickArgs);
      return relabelResponseTool(response, 'memory_quick_search');
    }
    case 'memory_match_triggers': return handleMemoryMatchTriggers(parseArgs<TriggerArgs>(validateToolArgs('memory_match_triggers', args)));
    case 'memory_save':           return handleMemorySave(parseArgs<SaveArgs>(validateToolArgs('memory_save', args)));
    case 'memory_list':           return handleMemoryList(parseArgs<ListArgs>(validateToolArgs('memory_list', args)));
    case 'memory_stats':          return handleMemoryStats(parseArgs<StatsArgs>(validateToolArgs('memory_stats', args)));
    case 'memory_health':         return handleMemoryHealth(parseArgs<HealthArgs>(validateToolArgs('memory_health', args)));
    case 'memory_delete':         return handleMemoryDelete(parseArgs<DeleteArgs>(validateToolArgs('memory_delete', args)));
    case 'memory_update':         return handleMemoryUpdate(parseArgs<UpdateArgs>(validateToolArgs('memory_update', args)));
    case 'memory_validate':       return handleMemoryValidate(parseArgs<MemoryValidateArgs>(validateToolArgs('memory_validate', args)));
    case 'memory_bulk_delete':    return handleMemoryBulkDelete(parseArgs<BulkDeleteArgs>(validateToolArgs('memory_bulk_delete', args)));
    default: return null;
  }
}

exec
/bin/zsh -lc "sed -n '200,260p' .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// Branch 2 requires `specFolder` + `confirm: true` (bulk folder delete).
// Codex fix: `confirm` accepts only `true` (not `false`) in both branches
// To prevent semantically meaningless `confirm: false` from passing validation.
const memoryDeleteSchema = getSchema({
  id: positiveInt.optional().describe('Memory ID to delete (required unless specFolder + confirm provided for bulk)'),
  specFolder: optionalPathString().describe('Spec folder scope for bulk delete (requires confirm: true)'),
  confirm: z.boolean().optional().describe('Must be true for spec-folder bulk delete'),
});

const memoryUpdateSchema = getSchema({
  id: positiveInt,
  title: z.string().optional(),
  triggerPhrases: optionalStringArray,
  importanceWeight: boundedNumber(0, 1).optional(),
  importanceTier: importanceTierEnum.optional(),
  allowPartialUpdate: z.boolean().optional(),
});

const memoryValidateSchema = getSchema({
  id: positiveInt,
  wasUseful: z.boolean(),
  queryId: z.string().optional(),
  queryTerms: optionalStringArray,
  resultRank: safeNumericPreprocess.pipe(z.number().int().min(1)).optional(),
  totalResultsShown: safeNumericPreprocess.pipe(z.number().int().min(1)).optional(),
  searchMode: z.string().optional(),
  intent: z.string().optional(),
  sessionId: z.string().optional(),
  notes: z.string().optional(),
});

export const memoryBulkDeleteSchema = getSchema({
  tier: importanceTierEnum,
  specFolder: optionalPathString(),
  confirm: z.literal(true),
  olderThanDays: safeNumericPreprocess
    .pipe(z.number().int().min(MEMORY_BULK_DELETE_MIN_OLDER_THAN_DAYS))
    .optional(),
  skipCheckpoint: z.boolean().optional(),
});

const memoryListSchema = getSchema({
  limit: positiveIntMax(100).optional(),
  offset: safeNumericPreprocess.pipe(z.number().int().min(0)).optional(),
  specFolder: optionalPathString(),
  sortBy: z.enum(['created_at', 'updated_at', 'importance_weight']).optional(),
  includeChunks: z.boolean().optional(),
});

const memoryStatsSchema = getSchema({
  folderRanking: z.enum(['count', 'recency', 'importance', 'composite']).optional(),
  excludePatterns: optionalStringArray,
  includeScores: z.boolean().optional(),
  includeArchived: z.boolean().optional(),
  limit: positiveIntMax(100).optional(),
});

const memoryHealthSchema = getSchema({
  reportMode: z.enum(['full', 'divergent_aliases']).optional(),
  limit: positiveIntMax(200).optional(),
  specFolder: optionalPathString(),

exec
/bin/zsh -lc "sed -n '1,120p' .opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// TEST: MCP TOOL DISPATCH
import { describe, it, expect } from 'vitest';
import * as handlers from '../handlers/index';

const TOOL_HANDLER_MAP: Array<{ tool: string; handler: string; layer: string }> = [
  { tool: 'memory_context', handler: 'handleMemoryContext', layer: 'L1' },
  { tool: 'memory_search', handler: 'handleMemorySearch', layer: 'L2' },
  { tool: 'memory_match_triggers', handler: 'handleMemoryMatchTriggers', layer: 'L2' },
  { tool: 'memory_save', handler: 'handleMemorySave', layer: 'L2' },
  { tool: 'memory_list', handler: 'handleMemoryList', layer: 'L3' },
  { tool: 'memory_stats', handler: 'handleMemoryStats', layer: 'L3' },
  { tool: 'memory_health', handler: 'handleMemoryHealth', layer: 'L3' },
  { tool: 'memory_delete', handler: 'handleMemoryDelete', layer: 'L4' },
  { tool: 'memory_update', handler: 'handleMemoryUpdate', layer: 'L4' },
  { tool: 'memory_validate', handler: 'handleMemoryValidate', layer: 'L4' },
  { tool: 'checkpoint_create', handler: 'handleCheckpointCreate', layer: 'L5' },
  { tool: 'checkpoint_list', handler: 'handleCheckpointList', layer: 'L5' },
  { tool: 'checkpoint_restore', handler: 'handleCheckpointRestore', layer: 'L5' },
  { tool: 'checkpoint_delete', handler: 'handleCheckpointDelete', layer: 'L5' },
  { tool: 'task_preflight', handler: 'handleTaskPreflight', layer: 'L6' },
  { tool: 'task_postflight', handler: 'handleTaskPostflight', layer: 'L6' },
  { tool: 'memory_drift_why', handler: 'handleMemoryDriftWhy', layer: 'L6' },
  { tool: 'memory_causal_link', handler: 'handleMemoryCausalLink', layer: 'L6' },
  { tool: 'memory_causal_stats', handler: 'handleMemoryCausalStats', layer: 'L6' },
  { tool: 'memory_causal_unlink', handler: 'handleMemoryCausalUnlink', layer: 'L6' },
  { tool: 'eval_run_ablation', handler: 'handleEvalRunAblation', layer: 'L6' },
  { tool: 'eval_reporting_dashboard', handler: 'handleEvalReportingDashboard', layer: 'L6' },
  { tool: 'memory_index_scan', handler: 'handleMemoryIndexScan', layer: 'L7' },
  { tool: 'memory_get_learning_history', handler: 'handleGetLearningHistory', layer: 'L7' },
];

const SNAKE_CASE_MAP: Array<{ camel: string; snake: string }> = [
  { camel: 'handleMemorySearch', snake: 'handle_memory_search' },
  { camel: 'handleMemoryMatchTriggers', snake: 'handle_memory_match_triggers' },
  { camel: 'handleMemorySave', snake: 'handle_memory_save' },
  { camel: 'handleMemoryList', snake: 'handle_memory_list' },
  { camel: 'handleMemoryStats', snake: 'handle_memory_stats' },
  { camel: 'handleMemoryHealth', snake: 'handle_memory_health' },
  { camel: 'handleMemoryDelete', snake: 'handle_memory_delete' },
  { camel: 'handleMemoryUpdate', snake: 'handle_memory_update' },
  { camel: 'handleMemoryValidate', snake: 'handle_memory_validate' },
  { camel: 'handleCheckpointCreate', snake: 'handle_checkpoint_create' },
  { camel: 'handleCheckpointList', snake: 'handle_checkpoint_list' },
  { camel: 'handleCheckpointRestore', snake: 'handle_checkpoint_restore' },
  { camel: 'handleCheckpointDelete', snake: 'handle_checkpoint_delete' },
  { camel: 'handleTaskPreflight', snake: 'handle_task_preflight' },
  { camel: 'handleTaskPostflight', snake: 'handle_task_postflight' },
  { camel: 'handleGetLearningHistory', snake: 'handle_get_learning_history' },
  { camel: 'handleMemoryDriftWhy', snake: 'handle_memory_drift_why' },
  { camel: 'handleMemoryCausalLink', snake: 'handle_memory_causal_link' },
  { camel: 'handleMemoryCausalStats', snake: 'handle_memory_causal_stats' },
  { camel: 'handleMemoryCausalUnlink', snake: 'handle_memory_causal_unlink' },
  { camel: 'handleEvalRunAblation', snake: 'handle_eval_run_ablation' },
  { camel: 'handleEvalReportingDashboard', snake: 'handle_eval_reporting_dashboard' },
  { camel: 'handleMemoryIndexScan', snake: 'handle_memory_index_scan' },
  { camel: 'handleMemoryContext', snake: 'handle_memory_context' },
];

type ToolHandler = (args: Record<string, unknown>) => unknown;

const handlerExports = handlers as Record<string, unknown>;

function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'then' in value &&
    typeof (value as { then?: unknown }).then === 'function'
  );
}

describe('MCP Protocol Tool Dispatch (T533) [deferred - requires DB test fixtures]', () => {

  describe('Tool Dispatch Verification (24 tools)', () => {
    TOOL_HANDLER_MAP.forEach((entry, i) => {
      const testNum = i + 1;

      it(`T533-${testNum}: ${entry.tool} dispatches to ${entry.handler}`, async () => {
        const handlerFn = handlerExports[entry.handler];

        // Handler exists as export
        expect(handlerFn).toBeDefined();

        // It's a function
        expect(typeof handlerFn).toBe('function');

        // Verify it's callable (async or sync)
        if (typeof handlerFn === 'function') {
          try {
            const result = (handlerFn as ToolHandler)({});
            if (isPromiseLike(result)) {
              // It's a promise — catch any rejection from invalid args
              try {
                await result;
              } catch (_: unknown) {
                // Expected: invalid args cause errors. That's fine.
              }
            }
          } catch (_: unknown) {
            // Synchronous throw — still confirms it's callable
          }
        }
      });
    });
  });

  describe('Snake_case alias verification', () => {
    SNAKE_CASE_MAP.forEach((entry) => {
      it(`T533-alias: ${entry.snake} aliases ${entry.camel}`, () => {
        const snakeFn = handlerExports[entry.snake];
        expect(typeof snakeFn).toBe('function');
      });
    });
  });
});

exec
/bin/zsh -lc "sed -n '460,520p' .opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    }).not.toThrow();
  });

  it('public causal tool schemas expose string memory identifiers', () => {
    const driftWhy = TOOL_DEFINITIONS.find((entry) => entry.name === 'memory_drift_why');
    const causalLink = TOOL_DEFINITIONS.find((entry) => entry.name === 'memory_causal_link');
    const driftWhySchema = driftWhy?.inputSchema as { properties?: Record<string, unknown> } | undefined;
    const causalLinkSchema = causalLink?.inputSchema as { properties?: Record<string, unknown> } | undefined;

    expect(driftWhySchema?.properties).toMatchObject({
      memoryId: { type: 'string' },
    });
    expect(causalLinkSchema?.properties).toMatchObject({
      sourceId: { type: 'string' },
      targetId: { type: 'string' },
    });
  });
});

describe('memory_health schema', () => {
  it('public schema rejects divergent_aliases limit above 200', () => {
    expect(() => {
      validateToolInputSchema('memory_health', { reportMode: 'divergent_aliases', limit: 201 }, TOOL_DEFINITIONS);
    }).toThrow(/must be <= 200/);
  });

  it('public schema accepts autoRepair confirmation payloads', () => {
    expect(() => {
      validateToolInputSchema('memory_health', { autoRepair: true, confirmed: true }, TOOL_DEFINITIONS);
    }).not.toThrow();
  });

  it('runtime schema preserves confirmed for handler execution', () => {
    const parsed = validateToolArgs('memory_health', { autoRepair: true, confirmed: true });
    expect(parsed).toEqual({ autoRepair: true, confirmed: true });
  });
});

describe('checkpoint_delete schema', () => {
  it('public checkpoint_list schema rejects limit above 100', () => {
    expect(() => {
      validateToolInputSchema('checkpoint_list', { limit: 101 }, TOOL_DEFINITIONS);
    }).toThrow(/must be <= 100/);
  });

  it('requires confirmName at schema level', () => {
    expect(() => {
      validateToolInputSchema('checkpoint_delete', { name: 'danger-zone' }, TOOL_DEFINITIONS);
    }).toThrow(/Missing required arguments.*confirmName/);
  });

  it('accepts matching name + confirmName payload shape', () => {
    expect(() => {
      validateToolInputSchema('checkpoint_delete', { name: 'danger-zone', confirmName: 'danger-zone' }, TOOL_DEFINITIONS);
    }).not.toThrow();
  });
});

// CHK-024: Schema validation overhead <5ms benchmark
describe('schema validation performance (CHK-024)', () => {
  it('validateToolInputSchema completes in <5ms per tool (steady-state)', () => {

exec
/bin/zsh -lc "sed -n '220,360p' .opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
 * Convert a production query text into the side-effect-free pipeline config
 * used for scheduled shadow replay.
 */
function buildReplayPipelineConfig(query: string, searchLimit: number): PipelineConfig {
  return {
    query,
    searchType: 'hybrid',
    limit: searchLimit,
    includeArchived: false,
    includeConstitutional: true,
    includeContent: false,
    minState: 'ARCHIVED',
    applyStateLimits: false,
    useDecay: true,
    rerank: true,
    applyLengthPenalty: true,
    enableDedup: false,
    enableSessionBoost: isSessionBoostEnabled(),
    enableCausalBoost: isCausalBoostEnabled(),
    trackAccess: false,
    detectedIntent: null,
    intentConfidence: 0,
    intentWeights: null,
  };
}

/**
 * Extract live results plus the adaptive shadow proposal from a replayed query.
 */
function buildReplayRanks(
  database: Database.Database,
  liveRows: ShadowSearchResultRow[],
  shadowRows: ShadowProposalRow[],
  queryText?: string,
): ShadowReplayRanks | null {
  if (liveRows.length === 0 || shadowRows.length === 0) {
    return null;
  }

  const memoryIds = Array.from(new Set([
    ...liveRows
      .map((row) => normalizeMemoryId(row.id))
      .filter((memoryId): memoryId is number => memoryId !== null),
    ...shadowRows
      .map((row) => normalizeMemoryId(row.memoryId))
      .filter((memoryId): memoryId is number => memoryId !== null),
  ]));
  const relevanceFeedbackById = getRelevanceFeedback(database, memoryIds, queryText);
  if (relevanceFeedbackById.size === 0) {
    return null;
  }

  const live: RankedItem[] = [];
  for (let index = 0; index < liveRows.length; index += 1) {
    const row = liveRows[index];
    if (typeof row.id !== 'number' && typeof row.id !== 'string') {
      continue;
    }

    const resultId = String(row.id);
    const memoryId = normalizeMemoryId(row.id);
    const relevanceScore = memoryId !== null
      ? relevanceFeedbackById.get(memoryId)
      : undefined;

    live.push({
      resultId,
      rank: index + 1,
      relevanceScore,
    });
  }

  const shadow: RankedItem[] = [...shadowRows]
    .filter((row): row is Required<Pick<ShadowProposalRow, 'memoryId' | 'shadowRank' | 'shadowScore'>> => (
      typeof row.memoryId === 'number'
      && typeof row.shadowRank === 'number'
      && typeof row.shadowScore === 'number'
    ))
    .sort((a, b) => a.shadowRank - b.shadowRank)
    .map((row) => ({
      resultId: String(row.memoryId),
      rank: row.shadowRank,
      relevanceScore: (() => {
        const memoryId = normalizeMemoryId(row.memoryId);
        return memoryId !== null
          ? relevanceFeedbackById.get(memoryId)
          : undefined;
      })(),
    }));

  if (live.length === 0 || shadow.length === 0) {
    return null;
  }

  return { live, shadow };
}

/**
 * Replay one query without emitting consumption or feedback side effects.
 */
async function replayQueryForShadowEvaluation(
  db: Database.Database,
  queryText: string,
  searchLimit: number,
): Promise<ShadowReplayRanks | null> {
  const pipelineResult = await executePipeline(buildReplayPipelineConfig(queryText, searchLimit));
  const liveRows = pipelineResult.results as ShadowSearchResultRow[];
  const shadowProposal = buildAdaptiveShadowProposal(
    db,
    queryText,
    pipelineResult.results as Array<Record<string, unknown> & { id: number }>,
  );

  if (!shadowProposal) {
    return null;
  }

  return buildReplayRanks(db, liveRows, shadowProposal.rows as ShadowProposalRow[], queryText);
}

/**
 * Prepare replay ranks for the deterministic holdout subset only.
 */
async function buildHoldoutReplayMap(
  db: Database.Database,
  queries: ConsumptionQueryRow[],
  holdoutPercent: number,
  seed: number,
  searchLimit: number,
): Promise<Map<string, ShadowReplayRanks>> {
  const queryIdToText = new Map<string, string>();
  const allQueryIds = queries.map((row) => {
    const queryId = `consumption:${row.id}`;
    queryIdToText.set(queryId, row.query_text);
    return queryId;
  });

  const holdoutQueryIds = selectHoldoutQueries(allQueryIds, { holdoutPercent, seed });
  const replayed = new Map<string, ShadowReplayRanks>();

  for (const queryId of holdoutQueryIds) {

exec
/bin/zsh -lc "rg -n \"executePipeline\\(\" .opencode/skill/system-spec-kit/mcp_server -g '"'!**/*.map'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "rg -n \"memory_quick_search|handleMemorySearch\\(|handle_memory_search|memory_context\\(\" .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/mcp_server/tools -g '"'!**/*.map'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:809:    const pipelineResult: PipelineResult = await executePipeline(pipelineConfig);
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:325:  const pipelineResult = await executePipeline(buildReplayPipelineConfig(queryText, searchLimit));
.opencode/skill/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:158:    const result = await executePipeline(config);
.opencode/skill/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:174:    await expect(executePipeline(config)).rejects.toThrow('embedding service unavailable');
.opencode/skill/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:184:    const result = await executePipeline(config);
.opencode/skill/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:201:    const result = await executePipeline(config);
.opencode/skill/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:216:    const result = await executePipeline(config);
.opencode/skill/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:227:    const result = await executePipeline(config);
.opencode/skill/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:242:    const result = await executePipeline(config);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:36:The public API is a single function: `executePipeline(config)` exported from `index.ts`.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:57:export async function executePipeline(config: PipelineConfig): Promise<PipelineResult> {

 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/tools/README.md:40:- `memory-tools.ts` implements the `memory_quick_search` delegation path by building a richer `memory_search` request and relabeling the returned envelope metadata back to `memory_quick_search`.
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:63:  'memory_quick_search',
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:78:    case 'memory_search':         return handleMemorySearch(parseArgs<SearchArgs>(validateToolArgs('memory_search', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:79:    case 'memory_quick_search': {
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:81:      const validated = validateToolArgs('memory_quick_search', args);
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:96:      const response = await handleMemorySearch(quickArgs);
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:97:      return relabelResponseTool(response, 'memory_quick_search');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:222:export const handle_memory_search = lazyFunction(getMemorySearchModule, 'handle_memory_search');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:123:    nextActions.add('Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` if you need a deeper state refresh.');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:486:async function handleMemorySearch(args: SearchArgs): Promise<MCPResponse> {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1374:const handle_memory_search = handleMemorySearch;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1377:  handle_memory_search,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:721:  const result = await handleMemorySearch({
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:752:  const result = await handleMemorySearch({
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:786:  const result = await handleMemorySearch({

exec
/bin/zsh -lc "sed -n '1,130p' .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '700,810p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Ops Hardening
// ───────────────────────────────────────────────────────────────
// Phase 030 / Phase 3: shared runtime hardening contract for
// readiness, repair, export/import, path identity, and previews.

export type GraphFreshness = 'fresh' | 'stale' | 'empty' | 'error';
export type StructuralReadiness = 'ready' | 'stale' | 'missing';

export interface MetadataOnlyPreview {
  mode: 'metadata-only';
  path: string;
  fileName: string;
  kind: 'text' | 'binary' | 'unknown';
  sizeBytes: number | null;
  mimeType: string | null;
  lastModified: string | null;
  rawContentIncluded: false;
}

export interface CodeGraphOpsContract {
  readiness: {
    canonical: StructuralReadiness;
    graphFreshness: GraphFreshness;
    sourceSurface: string;
    summary: string;
    recommendedAction: string;
  };
  doctor: {
    supported: true;
    surface: 'memory_health';
    checks: string[];
    repairModes: string[];
    recommendedAction: string;
  };
  exportImport: {
    rawDbDumpAllowed: false;
    portableIdentityRequired: true;
    postImportRepairRequired: true;
    workspaceBoundRelativePaths: true;
    absolutePaths: 'allowed-for-import-only';
    recommendedAction: string;
  };
  previewPolicy: {
    mode: 'metadata-only';
    rawBinaryAllowed: false;
    recommendedFields: string[];
    recommendedAction: string;
  };
}

export function normalizeStructuralReadiness(graphFreshness: GraphFreshness): StructuralReadiness {
  if (graphFreshness === 'fresh') {
    return 'ready';
  }
  if (graphFreshness === 'stale') {
    return 'stale';
  }
  return 'missing';
}

export function buildCodeGraphOpsContract(args: {
  graphFreshness: GraphFreshness;
  sourceSurface: string;
}): CodeGraphOpsContract {
  const canonical = normalizeStructuralReadiness(args.graphFreshness);
  const readinessSummary = canonical === 'ready'
    ? 'Code graph readiness is unified and structurally usable.'
    : canonical === 'stale'
      ? 'Code graph exists but needs refresh before structural trust is high.'
      : 'Code graph is missing or unusable; fallback and repair flows should be used.';
  const readinessAction = canonical === 'ready'
    ? 'Use code_graph_query for structural lookups and keep transport shells thin.'
    : canonical === 'stale'
      ? 'Run code_graph_scan or session_bootstrap before relying on structural context.'
      : 'Run session_bootstrap first, then code_graph_scan if structural context is required.';

  return {
    readiness: {
      canonical,
      graphFreshness: args.graphFreshness,
      sourceSurface: args.sourceSurface,
      summary: readinessSummary,
      recommendedAction: readinessAction,
    },
    doctor: {
      supported: true,
      surface: 'memory_health',
      checks: [
        'fts_consistency',
        'trigger_cache_refresh',
        'orphan_edges',
        'orphan_vectors',
        'orphan_chunks',
      ],
      repairModes: [
        'confirmation-gated autoRepair',
        'best-effort partial success reporting',
      ],
      recommendedAction: 'Use memory_health({ autoRepair: true, confirmed: true }) for bounded repair workflows and transparent partial-success reporting.',
    },
    exportImport: {
      rawDbDumpAllowed: false,
      portableIdentityRequired: true,
      postImportRepairRequired: true,
      workspaceBoundRelativePaths: true,
      absolutePaths: 'allowed-for-import-only',
      recommendedAction: 'Treat export/import as a portable identity flow with post-import repair, never as a raw DB dump.',
    },
    previewPolicy: {
      mode: 'metadata-only',
      rawBinaryAllowed: false,
      recommendedFields: ['path', 'fileName', 'kind', 'sizeBytes', 'mimeType', 'lastModified'],
      recommendedAction: 'Expose metadata-only previews for non-text artifacts and avoid raw binary content in runtime context surfaces.',
    },
  };
}

export function createMetadataOnlyPreview(input: {
  path: string;
  sizeBytes?: number | null;
  mimeType?: string | null;
  lastModified?: string | null;
}): MetadataOnlyPreview {
  const normalizedPath = input.path.replace(/\\/g, '/');
  const fileName = normalizedPath.split('/').filter(Boolean).pop() ?? normalizedPath;
  const kind = input.mimeType?.startsWith('text/')
    ? 'text'
    : input.mimeType
      ? 'binary'

 succeeded in 0ms:
async function executeQuickStrategy(input: string, options: ContextOptions): Promise<ContextResult> {
  const result = await handleMemoryMatchTriggers({
    prompt: input,
    specFolder: options.specFolder,
    tenantId: options.tenantId,
    userId: options.userId,
    agentId: options.agentId,
    sharedSpaceId: options.sharedSpaceId,
    limit: options.limit || 5,
    session_id: options.sessionId,
    include_cognitive: true
  });

  return {
    strategy: 'quick',
    mode: 'quick',
    ...result
  };
}

async function executeDeepStrategy(input: string, intent: string | null, options: ContextOptions): Promise<ContextResult> {
  const result = await handleMemorySearch({
    query: input,
    specFolder: options.specFolder,
    folderBoost: options.folderBoost,
    tenantId: options.tenantId,
    userId: options.userId,
    agentId: options.agentId,
    sharedSpaceId: options.sharedSpaceId,
    limit: options.limit || 10,
    includeConstitutional: true,
    includeContent: options.includeContent || false,
    includeTrace: options.includeTrace || false, // CHK-040
    anchors: options.anchors,
    sessionId: options.sessionId,
    sessionTransition: options.sessionTransition,
    enableDedup: options.enableDedup !== false,
    profile: options.profile,
    intent: intent ?? undefined,
    autoDetectIntent: intent ? false : true,
    useDecay: true,
    // minState omitted — memoryState column not yet in schema
  });

  return {
    strategy: 'deep',
    mode: 'deep',
    ...result
  };
}

async function executeFocusedStrategy(input: string, intent: string | null, options: ContextOptions): Promise<ContextResult> {
  const result = await handleMemorySearch({
    query: input,
    specFolder: options.specFolder,
    folderBoost: options.folderBoost,
    tenantId: options.tenantId,
    userId: options.userId,
    agentId: options.agentId,
    sharedSpaceId: options.sharedSpaceId,
    limit: options.limit || 8,
    includeConstitutional: true,
    includeContent: options.includeContent || false,
    includeTrace: options.includeTrace || false, // CHK-040
    anchors: options.anchors,
    sessionId: options.sessionId,
    sessionTransition: options.sessionTransition,
    enableDedup: options.enableDedup !== false,
    profile: options.profile,
    intent: intent ?? undefined,
    autoDetectIntent: intent ? false : true,
    useDecay: true,
    // minState omitted — memoryState column not yet in schema
  });

  return {
    strategy: 'focused',
    mode: 'focused',
    intent: intent,
    ...result
  };
}

async function executeResumeStrategy(input: string, intent: string | null, options: ContextOptions): Promise<ContextResult> {
  const resumeAnchors = options.anchors || ['state', 'next-steps', 'summary', 'blockers'];

  const result = await handleMemorySearch({
    query: input || 'resume work continue session',
    specFolder: options.specFolder,
    folderBoost: options.folderBoost,
    tenantId: options.tenantId,
    userId: options.userId,
    agentId: options.agentId,
    sharedSpaceId: options.sharedSpaceId,
    limit: options.limit || 5,
    includeConstitutional: false,
    includeContent: true,
    includeTrace: options.includeTrace || false, // CHK-040
    anchors: resumeAnchors,
    sessionId: options.sessionId,
    sessionTransition: options.sessionTransition,
    enableDedup: false,
    profile: options.profile,
    intent: intent ?? undefined,
    autoDetectIntent: intent ? false : true,
    useDecay: false,
    // minState omitted — memoryState column not yet in schema
  });

  return {
    strategy: 'resume',

exec
/bin/zsh -lc "sed -n '760,860p' .opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
        close: vi.fn(),
      }))
      vi.doMock('../lib/storage/history', () => ({ recordHistory: vi.fn(), getHistory: vi.fn(() => []) }))
      vi.doMock('../handlers/memory-index-discovery', () => ({ discoverMemoryFiles: vi.fn(async () => []) }))
      vi.doMock('../handlers/mutation-hooks', () => ({ runPostMutationHooks: vi.fn(async () => {}) }))
      vi.doMock('../lib/response/envelope', () => ({
        createMCPErrorResponse: vi.fn((data: unknown) => ({ content: [{ type: 'text', text: JSON.stringify(data) }], isError: true })),
        wrapForMCP: vi.fn((data: unknown, isError?: boolean) => ({ content: [{ type: 'text', text: JSON.stringify(data) }], isError: isError ?? false })),
      }))
      vi.doMock('../lib/search/local-reranker', () => ({ disposeLocalReranker: vi.fn() }))
      vi.doMock('../lib/ops/job-queue', () => ({ initIngestJobQueue: vi.fn(() => ({ resetCount: 0 })) }))
      vi.doMock('../lib/search/folder-discovery', () => ({ getSpecsBasePaths: vi.fn(() => options?.watchPaths ?? []) }))
      vi.doMock('../lib/ops/file-watcher', () => ({
        startFileWatcher: vi.fn(() => ({
          close: fileWatcherCloseMock,
        })),
      }))
      vi.doMock('../lib/storage/incremental-index', () => ({}))
      vi.doMock('../lib/storage/transaction-manager', () => ({
        recoverAllPendingFiles: vi.fn(() => []),
        getMetrics: vi.fn(() => ({ totalRecoveries: 0, totalErrors: 0, totalAtomicWrites: 0 })),
      }))
      vi.doMock('../lib/cache/tool-cache', () => ({ clear: toolCacheClearMock, shutdown: toolCacheShutdownMock }))
      vi.doMock('../lib/errors', () => ({
        ErrorCodes: options?.errorCodes ?? { UNKNOWN_TOOL: 'UNKNOWN_TOOL' },
        getRecoveryHint: vi.fn(options?.getRecoveryHintImpl ?? (() => ({ code: 'UNKNOWN_TOOL' }))),
        buildErrorResponse: vi.fn(options?.buildErrorResponseImpl ?? ((_tool: string, error: Error) => ({ error: error.message }))),
        getDefaultErrorCodeForTool: vi.fn(() => 'UNKNOWN_TOOL'),
      }))
      vi.doMock('@spec-kit/shared/embeddings/factory', () => {
        const startupEmbeddingDimension = options?.startupEmbeddingDimension
          ?? options?.dimValidation?.current
          ?? options?.dimValidation?.stored
          ?? 1536
        const startupValidation = options?.startupValidation ?? {
          valid: true,
          provider: 'voyage',
        }

        return {
          getStartupEmbeddingDimension: vi.fn(() => startupEmbeddingDimension),
          resolveStartupEmbeddingConfig: vi.fn(async () => ({
            resolution: { name: 'voyage', reason: 'mocked startup embedding config' },
            info: {
              provider: 'voyage',
              requestedProvider: 'voyage',
              effectiveProvider: 'voyage',
              fallbackReason: undefined,
              dimensionChanged: false,
              reason: 'mocked startup embedding config',
              config: {},
            },
            dimension: startupEmbeddingDimension,
            validation: startupValidation,
          })),
          validateConfiguredEmbeddingsProvider: vi.fn(() => options?.configuredEmbeddingsProvider ?? null),
        }
      })

      const module = await import('../context-server')
      // The entrypoint guard (isMain) prevents main() from running on import.
      // Explicitly call main() so startup-time side effects (dim validation,
      // dynamic instructions, file watcher) are exercised by the test harness.
      const testables = (module as { __testables?: { main?: () => Promise<void> } }).__testables
      if (testables?.main) {
        await testables.main().catch((err: unknown) => {
          // Mirror production: main().catch → console.error + process.exit(1)
          console.error('[context-server] Fatal error:', err);
          process.exit(1);
        })
      }
      const callToolHandler = handlers.get(callToolSchema)
      expect(typeof callToolHandler).toBe('function')
      await Promise.resolve()
      await new Promise((resolve) => setTimeout(resolve, 0))

      if (typeof options?.dynamicInit === 'string') {
        if (previousDynamicInit === undefined) {
          delete process.env.SPECKIT_DYNAMIC_INIT
        } else {
          process.env.SPECKIT_DYNAMIC_INIT = previousDynamicInit
        }
      }
      if (previousEmbeddingDim === undefined) {
        delete process.env.EMBEDDING_DIM
      } else {
        process.env.EMBEDDING_DIM = previousEmbeddingDim
      }

      return {
        registerAfterToolCallback: module.registerAfterToolCallback,
        testables: (module as { __testables?: RuntimeHarness['testables'] }).__testables,
        dispatchToolMock,
        autoSurfaceMemoriesMock,
        autoSurfaceAtToolDispatchMock,
        autoSurfaceAtCompactionMock,
        appendAutoSurfaceHintsMock,
        setInstructionsMock,
        handleMemoryStatsMock,
        processExitSpy,
        registeredProcessHandlers,

codex
I’ve got enough runtime structure to make the blueprints concrete, so I’m doing one last sanity check on the phase folder validation surface before I package the iteration output. If validation is blocked by the read-only sandbox again, I’ll call that out explicitly rather than overstate it.
exec
/bin/zsh -lc 'bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main" --strict' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1306ms:

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
Validation is still running; once that returns I’ll fold the exact result into the assessment so this iteration stays evidence-based. Meanwhile the blueprint content itself is already grounded in the current handler, schema, and pipeline files.
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '154,162p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   154	
   155	### rollout_summary_files
   156	
   157	- rollout_summaries/2026-04-09T10-35-53-UGDf-009_post_save_render_fixes_memory_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T12-35-53-019d71d0-0ec5-7c80-a08b-6d336ee5c639.jsonl, updated_at=2026-04-09T12:01:25+00:00, thread_id=019d71d0-0ec5-7c80-a08b-6d336ee5c639)
   158	
   159	### keywords
   160	
   161	- 009-post-save-render-fixes, PSR-2, trigger phrase omission, input-normalizer.ts, collect-session-data.ts, post-save-review.ts extractSection, memory-metadata.ts session_id metadata block, generate-context.js wild save, OVERVIEW 655 chars
   162	

codex
# Iteration 022: IMPLEMENTATION BLUEPRINTS

## Focus
IMPLEMENTATION BLUEPRINTS: For the top 3 adopt-now recommendations, write concrete implementation blueprints with file paths, function signatures, and migration steps for our system.

## Findings
### Finding 1: Ship first-class graded `memory_review`
- **Source**: [vault.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:882), [fsrs-scheduler.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:39), [checkpoints.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:648), [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:297)
- **What it does**: Add an explicit mutation tool for `AGAIN|HARD|GOOD|EASY` review events instead of overloading `memory_validate(wasUseful)`.
- **Why it matters**: Public already has the FSRS math and implicit `trackAccess` strengthen path, but no operator-facing graded review surface.
- **Recommendation**: adopt now
- **Impact**: high

```ts
interface MemoryReviewArgs {
  id: number;
  grade: 1 | 2 | 3 | 4;
  sessionId?: string;
  queryId?: string;
  searchMode?: string;
  notes?: string;
}

async function handleMemoryReview(args: MemoryReviewArgs): Promise<MCPResponse>;
function applyExplicitReview(db: Database.Database, memoryId: number, grade: number): ReviewResult;
```

1. Add `memoryReview` beside `memoryValidate` in [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:297), [tool-input-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:216), [memory-tools.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:55), and [handlers/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:60).
2. Implement `handleMemoryReview` in [checkpoints.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:648), because that module already owns adjacent mutation flows plus adaptive/selection logging.
3. `applyExplicitReview` should read `stability`, `difficulty`, `last_review`, and `review_count` from `memory_index`, call `fsrsScheduler.processReview(...)`, then update only `stability`, `difficulty`, `last_review`, and `review_count`.
4. Keep `nextReviewDate` response-only in tranche 1. Do not add `next_review_at` yet; that belongs to the later due-state ADR.
5. Add dispatch/schema coverage in [mcp-tool-dispatch.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:1), [tool-input-schema.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:479), plus a new handler test covering all four grades and missing-ID failure.

### Finding 2: Add a doctor-mode summary to `memory_health`, not a new health tool
- **Source**: [doctor.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/doctor.go:13), [memory-crud-health.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:380), [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:237), [ops-hardening.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:25)
- **What it does**: Extend the existing health surface with a compact operator report that summarizes status, failed checks, and next repair action while preserving current repair semantics.
- **Why it matters**: The backend is already stronger than Modus. The gap is scan-friendly presentation.
- **Recommendation**: adopt now
- **Impact**: medium

```ts
type HealthArgs = {
  reportMode?: 'full' | 'divergent_aliases' | 'doctor';
  autoRepair?: boolean;
  confirmed?: boolean;
  specFolder?: string;
  limit?: number;
};

function buildDoctorSummary(input: {
  status: 'healthy' | 'degraded';
  memoryCount: number;
  vectorSearchAvailable: boolean;
  embeddingModelReady: boolean;
  aliasConflicts: Record<string, number>;
  repair: Record<string, unknown>;
  hints: string[];
}): {
  headline: string;
  checks: Array<{ name: string; status: 'pass' | 'warn' | 'fail'; detail: string }>;
  nextActions: string[];
};
```

1. Extend `reportMode` enums in [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:237), [memory-crud-types.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:50), and [tool-input-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:254).
2. In [memory-crud-health.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:380), add a `doctor` branch after diagnostics are computed so it reuses the same FTS, alias, orphan, provider, and repair checks.
3. Keep `memory_health` as the only tool name. Update [ops-hardening.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:79) so the fast path recommends `memory_health({ reportMode: "doctor" })` and remediation still recommends `autoRepair:true, confirmed:true`.
4. Return a compact `doctor` payload plus the current richer metadata under `details`, so the one-screen report does not hide repair semantics.
5. Add schema and handler tests for `doctor` mode and one README example for healthy, degraded, and confirmation-required output.

### Finding 3: Formalize the one-retrieval-core rule before adding more search surfaces
- **Source**: [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:486), [pipeline/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/index.ts:1), [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:721), [memory-tools.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:79), [shadow-evaluation-runtime.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:223)
- **What it does**: Extract the canonical pipeline-config builder out of `handleMemorySearch` and make wrappers consume it instead of recreating search defaults piecemeal.
- **Why it matters**: Public is already close to this. A small hardening pass now prevents future `memory_due`, appendix, or exact-key surfaces from drifting into parallel ranking behavior.
- **Recommendation**: adopt now
- **Impact**: high

```ts
export interface CanonicalPipelineBuildResult {
  config: PipelineConfig;
  cacheKeyArgs: Record<string, unknown>;
}

export function buildCanonicalPipelineConfig(args: SearchArgs, derived: {
  effectiveQuery: string;
  detectedIntent: string | null;
  intentConfidence: number;
  intentWeights: IntentWeights | null;
  normalizedScope: NormalizedScopeContext;
  includeTrace: boolean;
}): CanonicalPipelineBuildResult;

export async function executeCanonicalSearch(config: PipelineConfig): Promise<PipelineResult>;
```

1. Extract pipeline-config assembly from [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:771) into a new internal file such as `lib/search/pipeline/request-builder.ts`.
2. Keep `handleMemorySearch` as the public orchestration layer for validation, caching, logging, and formatting, but make it call `buildCanonicalPipelineConfig(...)` instead of constructing `PipelineConfig` inline.
3. Replace the bespoke replay builder in [shadow-evaluation-runtime.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:223) with the canonical builder so shadow replay cannot drift on defaults like `trackAccess`, archived filtering, or dedup.
4. Keep wrapper tools thin: [memory-tools.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:79) should keep delegating `memory_quick_search` to `handleMemorySearch`, and [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:721) should keep calling `handleMemorySearch` rather than lower-level scoring modules.
5. Add a regression test that asserts every search-adjacent surface either calls `handleMemorySearch` or `executePipeline`, never BM25/hybrid primitives directly.

## Assessment
- New information ratio: 0.28
- Validation: `validate.sh --strict` on `003-modus-memory-main` returned `RESULT: PASSED`; it also emitted `cannot create temp file for here document: Operation not permitted`, consistent with the read-only sandbox warning seen earlier.
- Execution note: this run was read-only, so I verified and mapped the blueprint but did not write `iteration-022.md` into the phase folder.

## Recommended Next Focus
Implement blueprint 1 first in a write-enabled pass, then add `memory_health({ reportMode: "doctor" })`, then do the retrieval-core extraction before starting the separate `memory_due` ADR.


hook: Stop
hook: Stop Completed
tokens used
141,500
# Iteration 022: IMPLEMENTATION BLUEPRINTS

## Focus
IMPLEMENTATION BLUEPRINTS: For the top 3 adopt-now recommendations, write concrete implementation blueprints with file paths, function signatures, and migration steps for our system.

## Findings
### Finding 1: Ship first-class graded `memory_review`
- **Source**: [vault.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:882), [fsrs-scheduler.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:39), [checkpoints.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:648), [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:297)
- **What it does**: Add an explicit mutation tool for `AGAIN|HARD|GOOD|EASY` review events instead of overloading `memory_validate(wasUseful)`.
- **Why it matters**: Public already has the FSRS math and implicit `trackAccess` strengthen path, but no operator-facing graded review surface.
- **Recommendation**: adopt now
- **Impact**: high

```ts
interface MemoryReviewArgs {
  id: number;
  grade: 1 | 2 | 3 | 4;
  sessionId?: string;
  queryId?: string;
  searchMode?: string;
  notes?: string;
}

async function handleMemoryReview(args: MemoryReviewArgs): Promise<MCPResponse>;
function applyExplicitReview(db: Database.Database, memoryId: number, grade: number): ReviewResult;
```

1. Add `memoryReview` beside `memoryValidate` in [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:297), [tool-input-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:216), [memory-tools.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:55), and [handlers/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:60).
2. Implement `handleMemoryReview` in [checkpoints.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:648), because that module already owns adjacent mutation flows plus adaptive/selection logging.
3. `applyExplicitReview` should read `stability`, `difficulty`, `last_review`, and `review_count` from `memory_index`, call `fsrsScheduler.processReview(...)`, then update only `stability`, `difficulty`, `last_review`, and `review_count`.
4. Keep `nextReviewDate` response-only in tranche 1. Do not add `next_review_at` yet; that belongs to the later due-state ADR.
5. Add dispatch/schema coverage in [mcp-tool-dispatch.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:1), [tool-input-schema.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:479), plus a new handler test covering all four grades and missing-ID failure.

### Finding 2: Add a doctor-mode summary to `memory_health`, not a new health tool
- **Source**: [doctor.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/doctor.go:13), [memory-crud-health.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:380), [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:237), [ops-hardening.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:25)
- **What it does**: Extend the existing health surface with a compact operator report that summarizes status, failed checks, and next repair action while preserving current repair semantics.
- **Why it matters**: The backend is already stronger than Modus. The gap is scan-friendly presentation.
- **Recommendation**: adopt now
- **Impact**: medium

```ts
type HealthArgs = {
  reportMode?: 'full' | 'divergent_aliases' | 'doctor';
  autoRepair?: boolean;
  confirmed?: boolean;
  specFolder?: string;
  limit?: number;
};

function buildDoctorSummary(input: {
  status: 'healthy' | 'degraded';
  memoryCount: number;
  vectorSearchAvailable: boolean;
  embeddingModelReady: boolean;
  aliasConflicts: Record<string, number>;
  repair: Record<string, unknown>;
  hints: string[];
}): {
  headline: string;
  checks: Array<{ name: string; status: 'pass' | 'warn' | 'fail'; detail: string }>;
  nextActions: string[];
};
```

1. Extend `reportMode` enums in [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:237), [memory-crud-types.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:50), and [tool-input-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:254).
2. In [memory-crud-health.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:380), add a `doctor` branch after diagnostics are computed so it reuses the same FTS, alias, orphan, provider, and repair checks.
3. Keep `memory_health` as the only tool name. Update [ops-hardening.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:79) so the fast path recommends `memory_health({ reportMode: "doctor" })` and remediation still recommends `autoRepair:true, confirmed:true`.
4. Return a compact `doctor` payload plus the current richer metadata under `details`, so the one-screen report does not hide repair semantics.
5. Add schema and handler tests for `doctor` mode and one README example for healthy, degraded, and confirmation-required output.

### Finding 3: Formalize the one-retrieval-core rule before adding more search surfaces
- **Source**: [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:486), [pipeline/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/index.ts:1), [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:721), [memory-tools.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:79), [shadow-evaluation-runtime.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:223)
- **What it does**: Extract the canonical pipeline-config builder out of `handleMemorySearch` and make wrappers consume it instead of recreating search defaults piecemeal.
- **Why it matters**: Public is already close to this. A small hardening pass now prevents future `memory_due`, appendix, or exact-key surfaces from drifting into parallel ranking behavior.
- **Recommendation**: adopt now
- **Impact**: high

```ts
export interface CanonicalPipelineBuildResult {
  config: PipelineConfig;
  cacheKeyArgs: Record<string, unknown>;
}

export function buildCanonicalPipelineConfig(args: SearchArgs, derived: {
  effectiveQuery: string;
  detectedIntent: string | null;
  intentConfidence: number;
  intentWeights: IntentWeights | null;
  normalizedScope: NormalizedScopeContext;
  includeTrace: boolean;
}): CanonicalPipelineBuildResult;

export async function executeCanonicalSearch(config: PipelineConfig): Promise<PipelineResult>;
```

1. Extract pipeline-config assembly from [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:771) into a new internal file such as `lib/search/pipeline/request-builder.ts`.
2. Keep `handleMemorySearch` as the public orchestration layer for validation, caching, logging, and formatting, but make it call `buildCanonicalPipelineConfig(...)` instead of constructing `PipelineConfig` inline.
3. Replace the bespoke replay builder in [shadow-evaluation-runtime.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:223) with the canonical builder so shadow replay cannot drift on defaults like `trackAccess`, archived filtering, or dedup.
4. Keep wrapper tools thin: [memory-tools.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:79) should keep delegating `memory_quick_search` to `handleMemorySearch`, and [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:721) should keep calling `handleMemorySearch` rather than lower-level scoring modules.
5. Add a regression test that asserts every search-adjacent surface either calls `handleMemorySearch` or `executePipeline`, never BM25/hybrid primitives directly.

## Assessment
- New information ratio: 0.28
- Validation: `validate.sh --strict` on `003-modus-memory-main` returned `RESULT: PASSED`; it also emitted `cannot create temp file for here document: Operation not permitted`, consistent with the read-only sandbox warning seen earlier.
- Execution note: this run was read-only, so I verified and mapped the blueprint but did not write `iteration-022.md` into the phase folder.

## Recommended Next Focus
Implement blueprint 1 first in a write-enabled pass, then add `memory_health({ reportMode: "doctor" })`, then do the retrieval-core extraction before starting the separate `memory_due` ADR.
