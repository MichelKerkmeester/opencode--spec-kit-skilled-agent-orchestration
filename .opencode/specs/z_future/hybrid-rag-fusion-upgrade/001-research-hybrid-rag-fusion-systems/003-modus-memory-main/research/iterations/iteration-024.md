## Recommended Next Focus
Implement blueprint 1 first in a write-enabled pass, then add `memory_health({ reportMode: "doctor" })`, then do the retrieval-core extraction before starting the separate `memory_due` ADR.
--- Iteration 23 ---
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

- **Impact**: **high**

### Finding 3: Public should not import Modus’s simpler retention taxonomy, because Public already has a stronger policy model than Modus
- **Source**: [external/internal/vault/facts.go:25](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go#L25), [external/internal/vault/facts.go:32](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go#L32), [mcp_server/lib/cognitive/fsrs-scheduler.ts:197](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts#L197), [mcp_server/lib/cognitive/fsrs-scheduler.ts:273](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts#L273), [mcp_server/lib/cognitive/fsrs-scheduler.ts:297](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts#L297), [mcp_server/lib/search/vector-index-schema.ts:2339](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts#L2339)
- **What it does**: Modus has four importance classes plus three memory-type difficulty modifiers. Public already has a richer policy surface: context-type multipliers, importance-tier multipliers, no-decay classes, and review scheduling output via `processReview()`, but only `stability`, `difficulty`, `last_review`, and `review_count` are persisted.
- **Why it matters**: The gap in Public is not lack of decay policy. The gap is that the policy is not projected cleanly into an operator-facing “due / refreshing / permanent / archive-eligible” contract.
- **Recommendation**: **reject**
- **Impact**: **medium**

### Finding 4: Modus double-counts freshness in fact retrieval, which is useful for episodic recall but risky as a global long-term ranking rule
- **Source**: [external/internal/index/facts.go:53](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/facts.go#L53), [external/internal/index/facts.go:88](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/facts.go#L88), [external/internal/mcp/vault.go:323](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L323)
- **What it does**: Modus boosts ranking by both confidence and fact age buckets (`hot`, `warm`, `recent`, `cold`), then surfaces staleness warnings in the rendered result set.
- **Why it matters**: That is a good fit for ephemeral or session-shaped facts, but it can over-favor recent noise over durable truth if applied as a universal retention heuristic. Public already has retrievability, state classification, and importance weighting; a second global freshness boost would likely overcorrect.
- **Recommendation**: **prototype later**
- **Impact**: **medium**

### Finding 5: Public should keep cognitive decay state out of authored markdown, even though Modus’s plain-file model is elegant
- **Source**: [external/internal/markdown/parser.go:13](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go#L13), [external/internal/markdown/parser.go:73](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go#L73), [external/internal/markdown/writer.go:10](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/writer.go#L10), [external/internal/vault/facts.go:149](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go#L149), [external/internal/vault/facts.go:210](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go#L210), [external/README.md:27](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md#L27)
- **What it does**: Modus parses markdown into mutable frontmatter/body documents and writes decay, reinforcement, and archive metadata back into those markdown files directly. That matches its “plain markdown, no database” value proposition.
- **Why it matters**: For a git-backed long-lived memory system, per-access or periodic decay writes would create continuous document churn. Public’s split between authored memory artifacts and DB-backed cognitive state is the better long-horizon design.
- **Recommendation**: **reject**
- **Impact**: **medium**

## Assessment
- New information ratio: **0.27**
- Validation: `validate.sh --strict` on `003-modus-memory-main` returned `RESULT: PASSED`; it also emitted `cannot create temp file for here document: Operation not permitted`, which matches the read-only sandbox warning seen in earlier iterations.
- Phase state: this remains a read-only iteration pass, not a completion pass; the phase folder still lacks completion artifacts like `checklist.md` and `implementation-summary.md`.

## Recommended Next Focus
Define a canonical recall-event contract for Public first: decide whether ordinary search hits should refresh lifetime, persist a real due-state projection on top of existing FSRS fields, and expose that through `memory_review` plus a visible `memory_due`/retention surface. After that, test whether Modus-style freshness buckets belong only in an episodic fact lane rather than in canonical memory ranking.

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
# Iteration 024: COMPACTION & CONTEXT SURVIVAL

## Focus
COMPACTION & CONTEXT SURVIVAL: How does this system handle context window limits, compaction events, and startup context reconstruction? Lessons for our compaction survival.

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
I’m treating this as a read-only research pass for iteration 024, focused on compaction survival and startup context reconstruction. I’ll verify the phase state, inspect the external source in the requested order, then compare it directly against our `session_bootstrap` / `session_resume` / memory retrieval surfaces and report only evidence-backed findings.
Read-only deep-research iteration focused on compaction/context survival. I’m front-loading external source verification, then comparing against current Spec Kit Memory recovery surfaces before synthesizing iteration findings.
  → Verify phase folder state and validate requested research scope
  • Inspect external Modus search/FSRS/MCP code for compaction or context-reconstruction behavior
  • Inspect current Spec Kit Memory session recovery and compaction-survival surfaces
  • Synthesize iteration 024 findings with recommendations and evidence
codex
I’m using `sk-deep-research` for the iteration framing and doing a quick memory pass for prior session/bootstrap context so we stay consistent with earlier Public memory-system work. After that I’ll trace the external code paths and compare them against the current recovery surfaces in our MCP server.
exec
/bin/zsh -lc 'rg -n "session_bootstrap|session_resume|compaction|startup|generate-context|memory_context|memory_search|memory_match_triggers" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

 succeeded in 0ms:
23:- packet 008 structural-routing hint scope is bootstrap/request-shaped only; keep startup/resume hook generic and ensure docs + tests assert no “Structural Routing Hint” text is emitted when task-shaped context is absent [Task 1]
151:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public; reuse_rule=reuse when patching memory render/reviewer behavior in this checkout and proving fixes through an end-to-end generate-context run
161:- 009-post-save-render-fixes, PSR-2, trigger phrase omission, input-normalizer.ts, collect-session-data.ts, post-save-review.ts extractSection, memory-metadata.ts session_id metadata block, generate-context.js wild save, OVERVIEW 655 chars
195:- 005-code-graph-upgrades, shared-payload.ts DetectorProvenance, handlers/code-graph/query.ts unionMode multi maxDepth hotFileBreadcrumb, session_resume session_bootstrap additive edge enrichment, graph-upgrades-regression-floor.vitest.ts.test.ts, validate.sh --strict
542:- follow_on_tool_use, resolveSessionTrackingId, logFollowOnToolUse, memory_stats schema, session_bootstrap, feedback_events sqlite3
547:- `memory_stats` currently has no `sessionId` input in tool schema, so calling it after `memory_search` cannot claim the same session by default [Task 2]
548:- verification pattern that worked: confirm fresh `context-server.js` processes, run `session_bootstrap`, execute controlled `memory_search` sequence with fixed session id + trace flags, then query `feedback_events` globally and per-session in sqlite [Task 2]
731:- session_bootstrap, memory_context({mode:"resume",profile:"resume"}), mcp_server/hooks/claude, scripts/hooks/claude, workflow-session-id.vitest.ts, code-graph-query-handler.vitest.ts
786:- `session_bootstrap()` is the primary recovery call for non-hook flows; docs should mention fallback `memory_context({mode:"resume",profile:"resume"})` only after bootstrap guidance [Task 4]
824:## Task 3: Verify startup/bootstrap quote surfaces and bounded inline reindex behavior in read-only mode, outcome success
832:- read-only verification, session_bootstrap, session_resume minimal, code_graph_query, startup snapshot note, ensureCodeGraphReady, SELECTIVE_REINDEX_THRESHOLD=50
838:- when the user said “Do not make code changes ... Be evidence-based and quote exact startup or bootstrap text and exact readiness output,” keep verification read-only and quote observed startup/readiness payload text verbatim [Task 3]
846:- `session_bootstrap`/`session_resume({ minimal: true })` should still expose freshness-aware graph state and the startup snapshot note; this is a contract-level verification target before deeper debugging [Task 3]
1028:## Task 3: Fix startup DB path/provider drift and auto-repair temp-root cleanup for `spec_kit_memory`
1039:## Task 4: Keep embeddings provider `auto` compatible while fixing startup dimension mismatches
1057:- list_mcp_resources, list_mcp_resource_templates, spec_kit_memory, opencode.json, context-server.js, memory_context, memory_search
1067:- codex features enable memories, codex features enable code_mode, ~/.codex/config.toml, session_meta.dynamic_tools, mcp_startup, handshake timeout
1098:- Desktop `session_meta.dynamic_tools` plus absence of `mcp_startup` events is a stronger surfacing signal than standalone `node context-server.js` timeout probes [Task 6]
1100:- When startup background scan emits `contamination_audit` JSON on stdout, Codex MCP JSON-RPC can fail to handshake; redirect/silence that stream or delay MCP client init until scan completion [Task 7]
1455:- --recovery, RECOVERY_MODE_REQUIRED, allowRecovery, generate-context.ts, loadCollectedData, workflow.ts
1478:- memory_search cursor, progressive-disclosure, requestQuality, SPECKIT_RESULT_CONFIDENCE_V1, memory-search-ux-hooks.vitest.ts
1782:- phase-1 baseline, deferred Phase 2-6 follow-up, check-completion.sh, generate-context.js, /tmp/save-context-data.json, telemetry README schema alignment
1825:- `generate-context.js` succeeds in manual/headless runs when passed JSON-mode session data (`SPEC_FOLDER`, `recent_context`, `observations`, `user_prompts`) plus absolute spec path [Task 2]
1965:- cancelIngestJob retry, ALLOWED_BASE_PATHS startup recovery, MutationHookResult.errors, hooks-ux-feedback.vitest.ts, verify_alignment_drift.py
1981:- TMPDIR=.tmp/vitest-tmp, EX-035 startup scenario, F18-F21 implicit coverage, 19 pre-existing lint errors, index.lock, commit and push
1996:- lifecycle hardening patterns that held: collision-safe checkpoint restore skips, cancel-ingest retry/terminal handling, startup scan roots from `ALLOWED_BASE_PATHS` + `MEMORY_BASE_PATH`, and explicit `errors: []` in mutation hook payloads [Task 3]

exec
/bin/zsh -lc 'cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main && rg --files' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
external/assets/fsrs-decay.svg
external/assets/security.svg
external/assets/architecture.svg
external/assets/hero.svg
external/assets/doctor.svg
external/assets/comparison.svg
external/assets/demo.svg
external/README.md
external/docs/librarian.md
external/go.sum
external/MIGRATION_POST.md
external/internal/vault/entities.go
external/internal/vault/prs.go
external/internal/vault/helpers.go
external/internal/vault/beliefs.go
external/internal/vault/vault.go
external/internal/vault/trust.go
external/internal/vault/missions.go
external/internal/vault/facts.go
external/internal/index/crossref.go
external/internal/index/indexer.go
external/internal/index/cache.go
external/internal/index/bm25.go
external/internal/index/facts.go
external/internal/learnings/learnings.go
external/internal/mcp/vault.go
external/internal/mcp/learnings.go
external/internal/mcp/server.go
external/internal/mcp/memory.go
external/internal/markdown/json.go
external/internal/markdown/parser.go
external/internal/markdown/writer.go
phase-research-prompt.md
external/go.mod
external/LICENSE
external/internal/librarian/search.go
external/internal/librarian/client.go
research/research.md
research/iterations/iteration-010.md
research/iterations/iteration-004.md
research/iterations/iteration-020.md
research/iterations/iteration-014.md
research/iterations/iteration-005.md
research/iterations/iteration-021.md
research/iterations/iteration-015.md
research/iterations/iteration-001.md
research/iterations/iteration-011.md
research/iterations/iteration-006.md
research/iterations/iteration-022.md
research/iterations/iteration-016.md
research/iterations/iteration-002.md
research/iterations/iteration-012.md
research/iterations/iteration-003.md
research/iterations/iteration-013.md
research/iterations/iteration-007.md
research/iterations/iteration-023.md
research/iterations/iteration-017.md
research/iterations/iteration-008.md
research/iterations/iteration-018.md
research/iterations/iteration-009.md
research/iterations/iteration-019.md
external/cmd/modus-memory/entities.go
external/cmd/modus-memory/main.go
external/cmd/modus-memory/doctor.go
external/cmd/modus-memory/import_khoj.go

exec
/bin/zsh -lc 'cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main" --strict' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1463ms:

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
The phase folder is present and already has accumulated research artifacts through `iteration-023.md`. I’m waiting on strict validation now, then I’ll move into the source trace for whether Modus actually has any compaction or startup-reconstruction mechanics versus relying on external file state.
exec
/bin/zsh -lc "sed -n '1,240p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/bm25.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,240p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
package index

import (
	"math"
	"sort"
	"strings"
	"unicode"
)

// BM25 parameters — standard values, tuned for document search.
const (
	bm25K1 = 1.2  // term saturation
	bm25B  = 0.75 // length normalization
)

// Field weights — title matches are more valuable than body matches.
// Validated by ByteRover's benchmark: title 3x, path 1.5x achieves 96% LoCoMo.
var fieldWeights = [6]float64{
	1.5, // path
	1.0, // source
	2.0, // subject
	3.0, // title
	1.5, // tags
	1.0, // body
}

// fieldIndex maps field names to positions.
const (
	fieldPath    = 0
	fieldSource  = 1
	fieldSubject = 2
	fieldTitle   = 3
	fieldTags    = 4
	fieldBody    = 5
)

// posting records a term occurrence in a specific document field.
type posting struct {
	docID int
	field int
	tf    int // term frequency in this field
}

// bm25Engine holds the inverted index and document stats for BM25 scoring.
type bm25Engine struct {
	postings map[string][]posting // term → postings
	docLens  [][6]int             // per-document field lengths (in tokens)
	avgLens  [6]float64           // average field lengths across corpus
	numDocs  int
}

// newBM25Engine builds an inverted index from the loaded documents.
func newBM25Engine(docs []document) *bm25Engine {
	e := &bm25Engine{
		postings: make(map[string][]posting),
		docLens:  make([][6]int, len(docs)),
		numDocs:  len(docs),
	}

	var totalLens [6]int64

	for docID, doc := range docs {
		fields := [6]string{
			doc.Path,
			doc.Source,
			doc.Subject,
			doc.Title,
			doc.Tags,
			doc.Body,
		}

		for fieldID, text := range fields {
			tokens := tokenize(text)
			e.docLens[docID][fieldID] = len(tokens)
			totalLens[fieldID] += int64(len(tokens))

			// Count term frequencies
			tf := make(map[string]int)
			for _, t := range tokens {
				tf[t]++
			}

			for term, count := range tf {
				e.postings[term] = append(e.postings[term], posting{
					docID: docID,
					field: fieldID,
					tf:    count,
				})
			}
		}
	}

	// Compute average field lengths
	for i := 0; i < 6; i++ {
		if e.numDocs > 0 {
			e.avgLens[i] = float64(totalLens[i]) / float64(e.numDocs)
		}
	}

	return e
}

// search scores all documents against the query and returns top results.
func (e *bm25Engine) search(query string, limit int) []scoredDoc {
	queryTerms := tokenize(query)
	if len(queryTerms) == 0 {
		return nil
	}

	// Accumulate scores per document
	scores := make(map[int]float64)

	for _, term := range queryTerms {
		posts, ok := e.postings[term]
		if !ok {
			// Try prefix match for partial terms
			posts = e.prefixMatch(term)
			if len(posts) == 0 {
				continue
			}
		}

		// IDF: log((N - df + 0.5) / (df + 0.5) + 1)
		df := e.docFreq(term)
		idf := math.Log((float64(e.numDocs)-float64(df)+0.5)/(float64(df)+0.5) + 1.0)

		for _, p := range posts {
			// BM25 per-field score with field weight
			dl := float64(e.docLens[p.docID][p.field])
			avgDl := e.avgLens[p.field]
			if avgDl == 0 {
				avgDl = 1
			}

			tf := float64(p.tf)
			numerator := tf * (bm25K1 + 1)
			denominator := tf + bm25K1*(1-bm25B+bm25B*dl/avgDl)

			score := idf * (numerator / denominator) * fieldWeights[p.field]
			scores[p.docID] += score
		}
	}

	// Sort by score descending
	var results []scoredDoc
	for docID, score := range scores {
		results = append(results, scoredDoc{docID: docID, score: score})
	}
	sort.Slice(results, func(i, j int) bool {
		return results[i].score > results[j].score
	})

	if limit > 0 && len(results) > limit {
		results = results[:limit]
	}
	return results
}

// docFreq returns the number of documents containing a term (across any field).
func (e *bm25Engine) docFreq(term string) int {
	posts := e.postings[term]
	seen := make(map[int]bool)
	for _, p := range posts {
		seen[p.docID] = true
	}
	return len(seen)
}

// prefixMatch finds postings for terms starting with the given prefix.
// Only used for short queries where exact match fails.
func (e *bm25Engine) prefixMatch(prefix string) []posting {
	if len(prefix) < 3 {
		return nil
	}
	var results []posting
	for term, posts := range e.postings {
		if strings.HasPrefix(term, prefix) {
			results = append(results, posts...)
		}
	}
	return results
}

type scoredDoc struct {
	docID int
	score float64
}

// tokenize splits text into lowercase tokens, removing punctuation.
// Uses Porter-like stemming for common suffixes.
func tokenize(text string) []string {
	text = strings.ToLower(text)
	var tokens []string
	var current strings.Builder

	for _, r := range text {
		if unicode.IsLetter(r) || unicode.IsDigit(r) {
			current.WriteRune(r)
		} else {
			if current.Len() > 0 {
				token := current.String()
				if len(token) >= 2 { // skip single-char tokens
					tokens = append(tokens, stem(token))
				}
				current.Reset()
			}
		}
	}
	if current.Len() > 0 {
		token := current.String()
		if len(token) >= 2 {
			tokens = append(tokens, stem(token))
		}
	}

	return tokens
}

// stem applies minimal suffix stripping. Not a full Porter stemmer —
// just enough to match plurals and common verb forms.
func stem(word string) string {
	if len(word) <= 4 {
		return word
	}

	// Common English suffixes — order matters (longest first)
	suffixes := []struct {
		suffix string
		minLen int // minimum remaining length after stripping
	}{
		{"nesses", 4},
		{"ments", 4},
		{"ation", 3},
		{"ings", 3},
		{"ness", 3},
		{"ment", 3},
		{"able", 3},
		{"ible", 3},
		{"tion", 3},
		{"sion", 3},

 succeeded in 0ms:
package index

import (
	"hash/fnv"
	"sort"
	"strings"
	"sync"
)

// QueryCache implements tiered caching for search results.
// Tier 0: exact query hash match (0ms)
// Tier 1: fuzzy match via Jaccard similarity >= threshold (~1ms)
// Inspired by ByteRover's ablation study showing cache tiers drive 29.4pp accuracy gain.
const (
	cacheMaxEntries      = 256
	cacheJaccardThreshold = 0.6
)

type cacheEntry struct {
	query   string
	terms   map[string]bool // tokenized query terms for Jaccard comparison
	results []SearchResult
	hits    int // access count for LRU
}

// queryCache stores recent query→results pairs with exact and fuzzy matching.
type queryCache struct {
	mu      sync.RWMutex
	entries []cacheEntry
	counter int // global access counter for LRU
}

func newQueryCache() *queryCache {
	return &queryCache{
		entries: make([]cacheEntry, 0, cacheMaxEntries),
	}
}

// get attempts to find cached results for a query.
// Returns results and true if found (tier 0 or 1), nil and false otherwise.
func (c *queryCache) get(query string) ([]SearchResult, bool) {
	c.mu.RLock()
	defer c.mu.RUnlock()

	if len(c.entries) == 0 {
		return nil, false
	}

	// Tier 0: exact hash match
	h := hashQuery(query)
	for i := range c.entries {
		if hashQuery(c.entries[i].query) == h && c.entries[i].query == query {
			c.entries[i].hits = c.counter
			return c.entries[i].results, true
		}
	}

	// Tier 1: fuzzy match via Jaccard similarity
	queryTerms := termSet(query)
	if len(queryTerms) == 0 {
		return nil, false
	}

	var bestIdx int
	var bestSim float64

	for i := range c.entries {
		sim := jaccard(queryTerms, c.entries[i].terms)
		if sim > bestSim {
			bestSim = sim
			bestIdx = i
		}
	}

	if bestSim >= cacheJaccardThreshold {
		c.entries[bestIdx].hits = c.counter
		return c.entries[bestIdx].results, true
	}

	return nil, false
}

// put stores query results in the cache, evicting the least recently used entry if full.
func (c *queryCache) put(query string, results []SearchResult) {
	c.mu.Lock()
	defer c.mu.Unlock()

	c.counter++

	// Check if query already cached — update results
	for i := range c.entries {
		if c.entries[i].query == query {
			c.entries[i].results = results
			c.entries[i].hits = c.counter
			return
		}
	}

	entry := cacheEntry{
		query:   query,
		terms:   termSet(query),
		results: results,
		hits:    c.counter,
	}

	if len(c.entries) >= cacheMaxEntries {
		// Evict LRU entry
		minIdx := 0
		minHits := c.entries[0].hits
		for i := 1; i < len(c.entries); i++ {
			if c.entries[i].hits < minHits {
				minHits = c.entries[i].hits
				minIdx = i
			}
		}
		c.entries[minIdx] = entry
	} else {
		c.entries = append(c.entries, entry)
	}
}

func hashQuery(q string) uint64 {
	h := fnv.New64a()
	h.Write([]byte(strings.ToLower(strings.TrimSpace(q))))
	return h.Sum64()
}

func termSet(query string) map[string]bool {
	terms := tokenize(query)
	set := make(map[string]bool, len(terms))
	for _, t := range terms {
		set[t] = true
	}
	return set
}

// jaccard computes the Jaccard similarity between two term sets.
func jaccard(a, b map[string]bool) float64 {
	if len(a) == 0 && len(b) == 0 {
		return 0
	}

	intersection := 0
	for term := range a {
		if b[term] {
			intersection++
		}
	}

	union := len(a) + len(b) - intersection
	if union == 0 {
		return 0
	}

	return float64(intersection) / float64(union)
}

// sortByScore sorts results by score normalization: s / (1 + s) → [0, 1).
// Higher is better. ByteRover uses this normalization for consistent thresholding.
func normalizeScore(score float64) float64 {
	if score <= 0 {
		return 0
	}
	return score / (1.0 + score)
}

// filterOOD performs out-of-domain detection.
// If significant query terms (>= 4 chars) are unmatched and top score
// is below threshold, returns true (query is out of domain).
func filterOOD(query string, results []scoredDoc, threshold float64) bool {
	if len(results) == 0 {
		return true
	}

	topNormalized := normalizeScore(results[0].score)
	if topNormalized >= threshold {
		return false
	}

	// Check if significant terms are all unmatched
	terms := tokenize(query)
	significant := 0
	for _, t := range terms {
		if len(t) >= 4 {
			significant++
		}
	}

	// If most terms are short (< 4 chars), don't filter
	if significant == 0 {
		return false
	}

	return topNormalized < threshold
}

// deduplicateResults removes duplicate paths, keeping the highest scored.
func deduplicateResults(results []SearchResult) []SearchResult {
	seen := make(map[string]int) // path → index in output
	var deduped []SearchResult

	// Results should already be sorted by rank (best first)
	for _, r := range results {
		if _, exists := seen[r.Path]; !exists {
			seen[r.Path] = len(deduped)
			deduped = append(deduped, r)
		}
	}

	sort.Slice(deduped, func(i, j int) bool {
		return deduped[i].Rank > deduped[j].Rank
	})

	return deduped
}

exec
/bin/zsh -lc "sed -n '1,240p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
package librarian

import (
	"encoding/json"
	"fmt"
	"log"
	"strings"
)

// ExpandQuery asks the librarian to produce search-optimized terms for a query.
// This replaces the embedding channel — instead of computing vector similarity,
// we ask Gemma to bridge the semantic gap at query time.
//
// Example: "what's our fastest model" → "speed tok/s benchmark performance Gemma GLM"
func ExpandQuery(query string) []string {
	system := `You are a search query expander for a developer's personal knowledge base.
Given a natural language query, produce 3-5 alternative search phrases that would match
relevant documents using keyword search (FTS5). Include:
- Synonyms and related terms
- Technical equivalents
- Specific names/tools the user likely means
- Both formal and informal phrasings

Return ONLY a JSON array of strings. No explanation.
Example: ["original query terms", "synonym phrase", "technical equivalent", "specific tool names"]`

	user := fmt.Sprintf("Expand this query for keyword search: %q", query)

	response := Call(system, user, 150)
	if response == "" {
		return []string{query}
	}

	var expansions []string
	if err := ParseJSON(response, &expansions); err != nil {
		log.Printf("librarian/search: expansion parse failed: %v", err)
		return []string{query}
	}

	// Always include the original query
	result := []string{query}
	for _, exp := range expansions {
		exp = strings.TrimSpace(exp)
		if exp != "" && exp != query {
			result = append(result, exp)
		}
	}

	if len(result) > 6 {
		result = result[:6]
	}
	return result
}

// RankResults asks the librarian to score and rank search results by relevance.
// Takes the original query and a set of result snippets, returns ranked indices.
func RankResults(query string, results []ResultSnippet, topN int) []int {
	if len(results) == 0 {
		return nil
	}
	if len(results) <= topN {
		indices := make([]int, len(results))
		for i := range indices {
			indices[i] = i
		}
		return indices
	}

	var sb strings.Builder
	for i, r := range results {
		sb.WriteString(fmt.Sprintf("%d. [%s] %s\n   %s\n\n",
			i+1, r.Source, r.Title, truncate(r.Snippet, 200)))
	}

	system := `You rank search results for relevance. Given a query and numbered results,
return a JSON array of the most relevant result numbers (1-indexed), ordered by relevance.
Return ONLY the JSON array of integers. No explanation.`

	user := fmt.Sprintf("Query: %q\nReturn the top %d most relevant results:\n\n%s",
		query, topN, sb.String())

	response := Call(system, user, 100)
	if response == "" {
		return defaultIndices(topN, len(results))
	}

	var ranked []int
	if err := ParseJSON(response, &ranked); err != nil {
		log.Printf("librarian/search: rank parse failed: %v", err)
		return defaultIndices(topN, len(results))
	}

	// Convert 1-indexed to 0-indexed, validate
	var valid []int
	seen := map[int]bool{}
	for _, r := range ranked {
		idx := r - 1
		if idx >= 0 && idx < len(results) && !seen[idx] {
			valid = append(valid, idx)
			seen[idx] = true
		}
		if len(valid) >= topN {
			break
		}
	}
	return valid
}

// ResultSnippet is a lightweight search result for ranking.
type ResultSnippet struct {
	Source  string
	Title   string
	Snippet string
}

// SummarizeForCloud condenses search results into a token-efficient summary
// for cloud models. Instead of dumping raw results, the librarian produces
// a curated briefing.
func SummarizeForCloud(query string, results []ResultSnippet) string {
	if len(results) == 0 {
		return "No results found."
	}

	var sb strings.Builder
	for i, r := range results {
		sb.WriteString(fmt.Sprintf("%d. [%s] %s: %s\n",
			i+1, r.Source, r.Title, truncate(r.Snippet, 300)))
	}

	system := `You are a librarian summarizing search results for an AI assistant.
Produce a concise, information-dense summary that answers the query directly.
Include specific facts, numbers, and references. Cite result numbers in brackets.
Keep under 300 words. Do not add opinions or speculation.`

	user := fmt.Sprintf("Query: %q\n\nResults:\n%s\n\nSummarize the key findings.",
		query, sb.String())

	return Call(system, user, 400)
}

// ExtractFacts asks the librarian to extract structured facts from text.
func ExtractFacts(text string) []ExtractedFact {
	system := `Extract factual claims from the text as structured data.
Return a JSON array: [{"subject": "X", "predicate": "Y", "value": "Z"}]
Only extract concrete, verifiable facts. No opinions or speculation.
Keep subjects and predicates consistent and reusable.`

	user := fmt.Sprintf("Extract facts from:\n\n%s", truncate(text, 2000))

	response := Call(system, user, 500)
	if response == "" {
		return nil
	}

	var facts []ExtractedFact
	if err := ParseJSON(response, &facts); err != nil {
		log.Printf("librarian/search: fact parse failed: %v", err)
		return nil
	}
	return facts
}

// ExtractedFact is a subject/predicate/value triple.
type ExtractedFact struct {
	Subject   string `json:"subject"`
	Predicate string `json:"predicate"`
	Value     string `json:"value"`
}

func defaultIndices(n, max int) []int {
	if n > max {
		n = max
	}
	indices := make([]int, n)
	for i := range indices {
		indices[i] = i
	}
	return indices
}

// ClassifyIntent asks the librarian to classify a query for routing.
// Returns one of the 8 query classes used by the agentic search system.
func ClassifyIntent(query string) string {
	system := `Classify the user's query intent. Return ONLY one of these exact labels:
- exact_lookup: asking for a specific fact (what is X, how many, which)
- entity_topic: asking about a specific entity or topic
- temporal: asking about time, history, changes, sequence
- multi_hop: asking about relationships, chains, why/how connections
- abstraction: asking for overview, comparison, big picture
- preference: asking about preferences, beliefs, philosophy
- update_check: checking current status or progress
- no_retrieval: greeting, command, or not a knowledge query

Return ONLY the label, nothing else.`

	response := Call(system, query, 20)
	response = strings.TrimSpace(strings.ToLower(response))

	valid := map[string]bool{
		"exact_lookup": true, "entity_topic": true, "temporal": true,
		"multi_hop": true, "abstraction": true, "preference": true,
		"update_check": true, "no_retrieval": true,
	}
	if valid[response] {
		return response
	}
	return "entity_topic"
}

// Briefing produces an end-of-cycle intelligence brief.
type Briefing struct {
	New          []string `json:"new"`
	MissionRelevant []string `json:"mission_relevant"`
	Contradictions  []string `json:"contradictions"`
	NeedsReview     []string `json:"needs_review"`
	CanWait         []string `json:"can_wait"`
}

// ProduceBriefing generates a structured intelligence brief from ingested items.
func ProduceBriefing(items []string, activeMissions []string) *Briefing {
	if len(items) == 0 {
		return &Briefing{}
	}

	var sb strings.Builder
	for i, item := range items {
		sb.WriteString(fmt.Sprintf("%d. %s\n", i+1, item))
	}

	missions := "None specified"
	if len(activeMissions) > 0 {
		missions = strings.Join(activeMissions, ", ")
	}

	system := `You produce intelligence briefings. Given a list of newly ingested items and active missions, answer exactly 5 questions as a JSON object:
{
  "new": ["what is new — key items ingested"],
  "mission_relevant": ["what matters to active missions"],
  "contradictions": ["what contradicts existing beliefs"],
  "needs_review": ["what deserves immediate review"],

exec
/bin/zsh -lc 'rg -n "compact|compaction|window|startup|bootstrap|resume|reconstruct|rebuild|context" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:27:**modus-memory** is a personal memory server that runs on your machine, stores everything in plain markdown, and connects to any AI client via [MCP](https://modelcontextprotocol.io).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:39:Your AI remembers a decision you made 3 weeks ago — in a completely new chat. No copy-paste, no "here's my context dump." Just ask, and it knows.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:43:Every AI conversation starts from zero. Your assistant forgets everything the moment the window closes.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:64:| Start a new chat | AI knows nothing about you | AI recalls your preferences, past decisions, project context |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:66:| Ask "what did we decide about auth?" | Blank stare | Instant recall + linked context |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:67:| Close the window | Everything lost | Persisted to disk, searchable forever |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:76:| Stuff 1K facts into context | ~36,000 | $0.109 | **$164** |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:79:**72x fewer input tokens.** Instead of cramming everything into the context window, modus-memory searches 19,000+ documents in <5ms and returns only what's relevant.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:99:| Windows | x86_64 | `modus-memory-windows-amd64.exe` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:163:modus-memory speaks [MCP](https://modelcontextprotocol.io) over stdio. Point any MCP-compatible client at the binary:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:224:The cloud model stays focused on reasoning. The Librarian handles retrieval, filing, deduplication, decay, and context curation — then hands over only the 4-8k tokens that actually matter.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:425:| Binary startup to ready | ~2 seconds |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:427:The entire index lives in memory. There's no disk I/O on the search path after startup.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:434:The [official MCP memory server](https://github.com/modelcontextprotocol/servers/tree/main/src/memory) is deliberately minimal — it stores knowledge graph triples in a JSON file. No search ranking, no decay, no cross-referencing, no vault structure.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:456:Yes. Each client spawns its own modus-memory process, but they all read/write the same vault directory. The index is rebuilt on startup (takes ~2 seconds), and writes go directly to disk as markdown files. There's no lock contention for reads.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md:29:The cloud model stays focused on reasoning. The Librarian handles the boring-but-critical infrastructure: retrieval, filing, deduplication, decay, and context curation. It hands the cloud model only the 4-8k tokens that actually matter.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md:33:**Token and cost discipline.** Cloud models are expensive once context balloons. The Librarian aggressively prunes, reranks, and synthesizes memories (using BM25 + FSRS + cross-references) before anything touches the cloud. You're running a local "memory compiler" so the expensive model only sees high-signal context.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md:68:Retrieval: When the reasoning model needs context, search the vault and
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md:129:# 1. Librarian retrieves relevant context
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md:132:  "Search the vault for relevant context and return a compressed summary"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md:134:# 2. Feed the Librarian's output into the cloud model as system context
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md:158:4. Returns compressed context: 6 relevant facts, ~800 tokens
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md:160:**Cloud model receives:** Clean, high-signal context. Reasons over it. Responds to user.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go:33:// episodic is easiest (it's contextual and fades without reinforcement).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go:36:	"episodic":   +0.2, // harder to retain (context-dependent)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go:7:// On 7,600 .md files (~15MB text), startup takes 1-3 seconds on Apple Silicon.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/import_khoj.go:40:	} `json:"context,omitempty"`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/import_khoj.go:46:// Unique context references become memory facts in memory/facts/.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/import_khoj.go:174:		// Extract unique context references as memory facts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/import_khoj.go:191:				// Create a memory fact from the context
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/import_khoj.go:210:					"predicate":  "context-from-khoj",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/import_khoj.go:231:	fmt.Printf("Extracted: %d context facts → memory/facts/\n", factCount)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/import_khoj.go:318:// extractSubject pulls a subject from context text (first sentence or line).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/import_khoj.go:327:		return "khoj-context"

codex
The first sweep already suggests an important angle: Modus talks a lot about reducing context-window load, but the code hits I’ve seen so far point to retrieval-time pruning and an in-memory index, not any real compaction lifecycle or session reconstruction protocol. I’m pulling the next layer now to verify whether that absence is real in the source, then I’ll compare it against our explicit resume/bootstrap surfaces.
exec
/bin/zsh -lc "sed -n '1,260p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// Package index implements pure Go full-text search over vault .md files.
//
// No SQLite. No external dependencies. Documents are loaded into memory,
// tokenized, and indexed with BM25 field-boosted scoring. A tiered query
// cache (exact hash + Jaccard fuzzy) handles the hot path.
//
// On 7,600 .md files (~15MB text), startup takes 1-3 seconds on Apple Silicon.
// Search returns in microseconds for cached queries, milliseconds for cold.
package index

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/GetModus/modus-memory/internal/markdown"
)

// Index wraps an in-memory BM25 search engine built from vault .md files.
type Index struct {
	docs     []document
	engine   *bm25Engine
	cache    *queryCache
	facts    *factStore
	cross    *crossIndex // subject/tag/entity cross-references
	meta     map[string]*document // path → document for field lookups
	docCount int
	vaultDir string
}

// document is the internal representation of a vault file.
type document struct {
	Path        string
	Source      string
	Subject     string
	Title       string
	Tags        string
	Body        string
	Predicate   string
	Confidence  float64
	Importance  string
	Kind        string
	Created     string
	Triage      string
	Frontmatter map[string]interface{}
}

// SearchResult represents a single search hit.
type SearchResult struct {
	Path       string
	Source     string
	Subject    string
	Title      string
	Snippet    string
	Rank       float64
	Confidence float64
	Importance string
	Created    string
	Triage     string
}

// Build scans a vault directory and creates an in-memory search index.
func Build(vaultDir string, _ string) (*Index, error) {
	start := time.Now()

	// Scan all markdown files
	mdDocs, err := markdown.ScanDir(vaultDir)
	if err != nil {
		return nil, fmt.Errorf("scan vault: %w", err)
	}

	docs := make([]document, 0, len(mdDocs))
	meta := make(map[string]*document, len(mdDocs))

	for _, md := range mdDocs {
		rel, _ := filepath.Rel(vaultDir, md.Path)
		title := md.Get("title")
		if title == "" {
			title = md.Get("name")
		}
		kind := md.Get("kind")
		if kind == "" {
			kind = md.Get("type")
		}

		doc := document{
			Path:        rel,
			Source:      md.Get("source"),
			Subject:     md.Get("subject"),
			Title:       title,
			Tags:        strings.Join(md.GetTags(), " "),
			Body:        md.Body,
			Predicate:   md.Get("predicate"),
			Confidence:  md.GetFloat("confidence"),
			Importance:  md.Get("importance"),
			Kind:        kind,
			Created:     md.Get("created"),
			Triage:      md.Get("triage"),
			Frontmatter: md.Frontmatter,
		}

		docs = append(docs, doc)
		meta[rel] = &docs[len(docs)-1]
	}

	// Build BM25 inverted index
	engine := newBM25Engine(docs)
	cache := newQueryCache()

	// Build cross-reference index — connects docs sharing subjects, tags, entities
	cross := newCrossIndex()
	cross.build(docs)

	idx := &Index{
		docs:     docs,
		engine:   engine,
		cache:    cache,
		facts:    newFactStore(),
		cross:    cross,
		meta:     meta,
		docCount: len(docs),
		vaultDir: vaultDir,
	}

	// Auto-index memory facts
	idx.indexFacts(vaultDir)

	crossSubjects, crossTags, crossEntities := cross.Stats()
	elapsed := time.Since(start)
	log.Printf("Indexed %d documents in %v (BM25 + cross-ref: %d subjects, %d tags, %d entities)",
		len(docs), elapsed, crossSubjects, crossTags, crossEntities)

	return idx, nil
}

// Open is an alias for Build — there's no persistent index file to open.
// The second argument (indexPath) is ignored; kept for interface compatibility.
func Open(indexPath string) (*Index, error) {
	// Infer vaultDir from indexPath: indexPath was typically ~/modus/data/index.sqlite
	// The vault is at ~/modus/vault/
	home, _ := os.UserHomeDir()
	vaultDir := filepath.Join(home, "modus", "vault")
	if envDir := os.Getenv("MODUS_VAULT_DIR"); envDir != "" {
		vaultDir = envDir
	}
	return Build(vaultDir, "")
}

// Close is a no-op — no file handles to release.
func (idx *Index) Close() {}

// DocCount returns the number of indexed documents.
func (idx *Index) DocCount() int {
	return idx.docCount
}

// Search performs BM25 full-text search with tiered caching and field boosting.
func (idx *Index) Search(query string, limit int) ([]SearchResult, error) {
	if limit <= 0 {
		limit = 10
	}
	if strings.TrimSpace(query) == "" {
		return nil, nil
	}

	// Tier 0-1: check cache (exact hash + Jaccard fuzzy)
	if cached, ok := idx.cache.get(query); ok {
		if len(cached) > limit {
			return cached[:limit], nil
		}
		return cached, nil
	}

	// Tier 2: BM25 search
	scored := idx.engine.search(query, limit*2) // oversample for dedup

	// OOD detection — reject garbage results
	if filterOOD(query, scored, 0.15) {
		empty := []SearchResult{}
		idx.cache.put(query, empty)
		return empty, nil
	}

	queryTerms := tokenize(query)
	var results []SearchResult
	seen := make(map[string]bool)

	for _, s := range scored {
		doc := idx.docs[s.docID]
		if seen[doc.Path] {
			continue
		}
		seen[doc.Path] = true

		snip := snippet(doc.Body, queryTerms, 200)
		results = append(results, SearchResult{
			Path:       doc.Path,
			Source:     doc.Source,
			Subject:    doc.Subject,
			Title:      doc.Title,
			Snippet:    snip,
			Rank:       normalizeScore(s.score),
			Confidence: doc.Confidence,
			Importance: doc.Importance,
			Created:    doc.Created,
			Triage:     doc.Triage,
		})

		if len(results) >= limit {
			break
		}
	}

	// Cache the results
	idx.cache.put(query, results)

	return results, nil
}

// SearchByField returns documents where a metadata field matches a value.
func (idx *Index) SearchByField(field string, value string, limit int) ([]SearchResult, error) {
	if limit <= 0 {
		limit = 20
	}

	var results []SearchResult
	valueLower := strings.ToLower(value)

	for _, doc := range idx.docs {
		var fieldVal string
		switch field {
		case "source":
			fieldVal = doc.Source
		case "subject":
			fieldVal = doc.Subject
		case "kind", "type":
			fieldVal = doc.Kind
		case "triage":
			fieldVal = doc.Triage
		case "importance":
			fieldVal = doc.Importance
		default:
			if v, ok := doc.Frontmatter[field]; ok {
				fieldVal = fmt.Sprintf("%v", v)
			}
		}

		if strings.ToLower(fieldVal) == valueLower {
			results = append(results, SearchResult{
				Path:       doc.Path,
				Source:     doc.Source,
				Subject:    doc.Subject,
				Title:      doc.Predicate,
				Confidence: doc.Confidence,
				Importance: doc.Importance,
				Created:    doc.Created,
				Triage:     doc.Triage,

exec
/bin/zsh -lc "sed -n '1,320p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
package vault

import (
	"fmt"
	"math"
	"strings"
	"time"

	"github.com/GetModus/modus-memory/internal/markdown"
)

// FSRS (Free Spaced Repetition Scheduler) parameters for memory decay.
// Dual-strength model: each fact has stability (how long until 90% recall drops)
// and difficulty (how hard it is to retain). Inspired by LACP's Mycelium Network
// and the FSRS-5 algorithm. Local adaptation: importance gates initial stability,
// memory type gates difficulty, and access-based reinforcement resets the clock.

// fsrsConfig holds per-importance FSRS parameters.
type fsrsConfig struct {
	InitialStability float64 // days until R drops to 0.9 (S0)
	InitialDifficulty float64 // 0.0 (trivial) to 1.0 (very hard)
	Floor            float64 // minimum confidence (retrievability)
}

var fsrsConfigs = map[string]fsrsConfig{
	"critical": {InitialStability: 1e9, InitialDifficulty: 0, Floor: 1.0}, // never decays
	"high":     {InitialStability: 180, InitialDifficulty: 0.3, Floor: 0.3},
	"medium":   {InitialStability: 60, InitialDifficulty: 0.5, Floor: 0.1},
	"low":      {InitialStability: 14, InitialDifficulty: 0.7, Floor: 0.05},
}

// Memory type difficulty modifiers. Procedural knowledge is hardest to forget,
// episodic is easiest (it's contextual and fades without reinforcement).
var memoryTypeDifficultyMod = map[string]float64{
	"semantic":   -0.1, // easier to retain (general knowledge)
	"episodic":   +0.2, // harder to retain (context-dependent)
	"procedural": -0.3, // hardest to forget (muscle memory analog)
}

// fsrsRetrievability computes R(t) = (1 + t/(9*S))^(-1)
// where t = elapsed days, S = stability. This is the FSRS power-law forgetting curve.
// R=0.9 when t=S (by definition of stability).
func fsrsRetrievability(elapsedDays, stability float64) float64 {
	if stability <= 0 {
		return 0
	}
	return math.Pow(1.0+elapsedDays/(9.0*stability), -1.0)
}

// fsrsNewStability computes updated stability after a successful recall.
// S' = S * (1 + e^(w) * (11-D) * S^(-0.2) * (e^(0.05*(1-R)) - 1))
// Simplified from FSRS-5. w=2.0 is the stability growth factor.
func fsrsNewStability(oldStability, difficulty, retrievability float64) float64 {
	w := 2.0 // growth factor — higher means faster stability growth on recall
	d := difficulty * 10 // scale to 0-10 range
	growth := math.Exp(w) * (11.0 - d) * math.Pow(oldStability, -0.2) * (math.Exp(0.05*(1.0-retrievability)) - 1.0)
	newS := oldStability * (1.0 + growth)
	if newS < oldStability {
		newS = oldStability // stability never decreases on recall
	}
	return newS
}

// DecayFacts sweeps all fact files and applies FSRS-based confidence decay.
// Confidence = retrievability R(t) = (1 + t/(9*S))^(-1), floored per importance.
// Returns the number of facts updated.
func (v *Vault) DecayFacts() (int, error) {
	docs, err := markdown.ScanDir(v.Path("memory", "facts"))
	if err != nil {
		return 0, err
	}

	now := time.Now()
	updated := 0

	for _, doc := range docs {
		conf := doc.GetFloat("confidence")
		importance := doc.Get("importance")
		if importance == "" {
			importance = "medium"
		}

		cfg, ok := fsrsConfigs[importance]
		if !ok {
			cfg = fsrsConfigs["medium"]
		}

		// Critical facts never decay
		if cfg.InitialStability >= 1e8 {
			continue
		}

		if conf <= cfg.Floor {
			continue
		}

		// Get or initialize stability
		stability := doc.GetFloat("stability")
		if stability <= 0 {
			stability = cfg.InitialStability
			// Apply memory type modifier to difficulty → affects initial stability
			memType := doc.Get("memory_type")
			if mod, ok := memoryTypeDifficultyMod[memType]; ok {
				adjustedDifficulty := cfg.InitialDifficulty + mod
				if adjustedDifficulty < 0 {
					adjustedDifficulty = 0
				}
				if adjustedDifficulty > 1.0 {
					adjustedDifficulty = 1.0
				}
				// Lower difficulty → higher stability
				stability = cfg.InitialStability * (1.0 + (0.5 - adjustedDifficulty))
			}
			doc.Set("stability", math.Round(stability*10) / 10)
			doc.Set("difficulty", cfg.InitialDifficulty)
		}

		// Calculate days since last access or creation
		lastAccessed := doc.Get("last_accessed")
		if lastAccessed == "" {
			lastAccessed = doc.Get("last_decayed")
		}
		if lastAccessed == "" {
			lastAccessed = doc.Get("created")
		}
		if lastAccessed == "" {
			continue
		}

		t, err := parseTime(lastAccessed)
		if err != nil {
			continue
		}

		elapsedDays := now.Sub(t).Hours() / 24
		if elapsedDays < 0.5 {
			continue // too recent to decay
		}

		// FSRS retrievability: R(t) = (1 + t/(9*S))^(-1)
		newConf := fsrsRetrievability(elapsedDays, stability)
		newConf = math.Max(cfg.Floor, newConf)
		newConf = math.Round(newConf*1000) / 1000

		if newConf == conf {
			continue
		}

		doc.Set("confidence", newConf)
		doc.Set("last_decayed", now.Format(time.RFC3339))
		if err := doc.Save(); err != nil {
			continue
		}
		updated++
	}

	return updated, nil
}

// ReinforceFact increases a fact's confidence and stability after a successful recall.
// This is the FSRS "review" operation — accessing a fact proves it's still relevant,
// so stability grows and confidence resets toward 1.0.
func (v *Vault) ReinforceFact(relPath string) error {
	doc, err := v.Read(relPath)
	if err != nil {
		return err
	}

	now := time.Now()
	conf := doc.GetFloat("confidence")
	stability := doc.GetFloat("stability")
	difficulty := doc.GetFloat("difficulty")

	importance := doc.Get("importance")
	if importance == "" {
		importance = "medium"
	}
	cfg := fsrsConfigs[importance]

	// Initialize if missing
	if stability <= 0 {
		stability = cfg.InitialStability
	}
	if difficulty <= 0 {
		difficulty = cfg.InitialDifficulty
	}

	// Compute new stability: grows on each successful recall
	newStability := fsrsNewStability(stability, difficulty, conf)

	// Difficulty decreases slightly on successful recall (fact gets easier)
	newDifficulty := difficulty - 0.02
	if newDifficulty < 0.05 {
		newDifficulty = 0.05
	}

	// Confidence boost: asymptotic toward 1.0, small increment per access
	newConf := conf + (1.0-conf)*0.08
	if newConf > 0.99 {
		newConf = 0.99
	}

	// Track access count
	accessCount := 0
	if ac := doc.GetFloat("access_count"); ac > 0 {
		accessCount = int(ac)
	}
	accessCount++

	doc.Set("confidence", math.Round(newConf*1000)/1000)
	doc.Set("stability", math.Round(newStability*10)/10)
	doc.Set("difficulty", math.Round(newDifficulty*1000)/1000)
	doc.Set("last_accessed", now.Format(time.RFC3339))
	doc.Set("access_count", accessCount)

	return doc.Save()
}

// ArchiveStaleFacts marks facts below a confidence threshold as archived.
// Returns the number of facts archived.
func (v *Vault) ArchiveStaleFacts(threshold float64) (int, error) {
	if threshold <= 0 {
		threshold = 0.1
	}

	docs, err := markdown.ScanDir(v.Path("memory", "facts"))
	if err != nil {
		return 0, err
	}

	archived := 0
	for _, doc := range docs {
		// Skip already archived
		if doc.Get("archived") == "true" {
			continue
		}
		// Skip critical facts
		if doc.Get("importance") == "critical" {
			continue
		}

		conf := doc.GetFloat("confidence")
		if conf > 0 && conf < threshold {
			doc.Set("archived", true)
			doc.Set("archived_at", time.Now().Format(time.RFC3339))
			if err := doc.Save(); err != nil {
				continue
			}
			archived++
		}
	}

	return archived, nil
}

// TouchFact updates last_accessed on a fact, resetting its decay clock.
func (v *Vault) TouchFact(relPath string) error {
	doc, err := v.Read(relPath)
	if err != nil {
		return err
	}
	doc.Set("last_accessed", time.Now().Format(time.RFC3339))
	return doc.Save()
}

// ListFacts returns memory facts, optionally filtered by subject.
func (v *Vault) ListFacts(subject string, limit int) ([]*markdown.Document, error) {
	if limit <= 0 {
		limit = 20
	}

	docs, err := markdown.ScanDir(v.Path("memory", "facts"))
	if err != nil {
		return nil, err
	}

	var result []*markdown.Document
	for _, doc := range docs {
		if len(result) >= limit {
			break
		}
		if subject != "" && !strings.EqualFold(doc.Get("subject"), subject) {
			continue
		}
		result = append(result, doc)
	}
	return result, nil
}

// SearchFacts searches memory facts via FTS, filtering to memory/facts/ paths.
// Falls back to listing all facts if no index is loaded.
func (v *Vault) SearchFacts(query string, limit int) ([]string, error) {
	if limit <= 0 {
		limit = 10
	}

	// Fallback: scan directory if no index
	if v.Index == nil {
		docs, err := v.ListFacts("", limit)
		if err != nil {
			return nil, err
		}
		var out []string
		for _, doc := range docs {
			subj := doc.Get("subject")
			val := doc.Body
			if len(val) > 200 {
				val = val[:197] + "..."
			}
			// Basic keyword match
			if query != "" && !strings.Contains(strings.ToLower(subj+val), strings.ToLower(query)) {
				continue
			}
			out = append(out, fmt.Sprintf("- **%s**: %s", subj, strings.TrimSpace(val)))
		}
		return out, nil
	}

	results, err := v.Index.Search(query, limit*3)
	if err != nil {

exec
/bin/zsh -lc "sed -n '1,260p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/facts.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
package index

import (
	"sort"
	"strings"
	"time"
)

// MemFact represents an in-memory memory fact, replacing the SQL memory_facts table.
type MemFact struct {
	ID         string
	Subject    string
	Predicate  string
	Value      string
	Confidence float64
	Importance string
	MemoryType string
	CreatedAt  string
	SessionTag string
	IsActive   int
}

// factStore holds all memory facts in memory with term-based search.
type factStore struct {
	facts    []MemFact
	terms    map[string][]int // stemmed term → fact indices
	subjects map[string][]int // lowercase subject → fact indices
}

func newFactStore() *factStore {
	return &factStore{
		terms:    make(map[string][]int),
		subjects: make(map[string][]int),
	}
}

// add indexes a fact into the store.
func (fs *factStore) add(f MemFact) {
	idx := len(fs.facts)
	fs.facts = append(fs.facts, f)

	// Index all text fields
	content := f.Subject + " " + f.Predicate + " " + f.Value
	for _, token := range tokenize(content) {
		fs.terms[token] = append(fs.terms[token], idx)
	}

	// Subject index for exact lookups
	subj := strings.ToLower(strings.TrimSpace(f.Subject))
	fs.subjects[subj] = append(fs.subjects[subj], idx)
}

// recencyBoost returns a multiplier based on fact age.
// Hot (<24h): 1.5x, Warm (1-7d): 1.2x, Recent (7-30d): 1.0x, Cold (>30d): 0.8x.
// Inspired by Icarus/Hermes tiered memory — hot facts surface first.
func recencyBoost(createdAt string) float64 {
	if createdAt == "" {
		return 1.0
	}
	t, err := time.Parse("2006-01-02", createdAt[:min10(10, len(createdAt))])
	if err != nil {
		// Try RFC3339
		t, err = time.Parse(time.RFC3339, createdAt)
		if err != nil {
			return 1.0
		}
	}
	age := time.Since(t)
	switch {
	case age < 24*time.Hour:
		return 1.5 // hot
	case age < 7*24*time.Hour:
		return 1.2 // warm
	case age < 30*24*time.Hour:
		return 1.0 // recent
	default:
		return 0.8 // cold
	}
}

func min10(a, b int) int {
	if a < b {
		return a
	}
	return b
}

// search finds facts matching a query, ranked by BM25-like scoring with recency boost.
func (fs *factStore) search(query string, limit int) []MemFact {
	if len(fs.facts) == 0 {
		return nil
	}

	queryTerms := tokenize(query)
	if len(queryTerms) == 0 {
		return nil
	}

	// Score each fact by term overlap
	scores := make(map[int]float64)
	for _, term := range queryTerms {
		indices, ok := fs.terms[term]
		if !ok {
			continue
		}
		// Simple TF-IDF-like scoring
		idf := 1.0 / (1.0 + float64(len(indices))/float64(len(fs.facts)))
		for _, idx := range indices {
			if fs.facts[idx].IsActive == 0 {
				continue
			}
			scores[idx] += idf
			// Boost by confidence
			scores[idx] += fs.facts[idx].Confidence * 0.1
		}
	}

	// Apply recency boost — hot facts surface before cold ones
	for idx := range scores {
		scores[idx] *= recencyBoost(fs.facts[idx].CreatedAt)
	}

	// Sort by score
	type scored struct {
		idx   int
		score float64
	}
	var ranked []scored
	for idx, score := range scores {
		ranked = append(ranked, scored{idx, score})
	}
	sort.Slice(ranked, func(i, j int) bool {
		return ranked[i].score > ranked[j].score
	})

	if limit > 0 && len(ranked) > limit {
		ranked = ranked[:limit]
	}

	results := make([]MemFact, len(ranked))
	for i, r := range ranked {
		results[i] = fs.facts[r.idx]
	}
	return results
}

// bySubject returns all active facts for a given subject (case-insensitive).
func (fs *factStore) bySubject(subject string, limit int) []MemFact {
	indices := fs.subjects[strings.ToLower(strings.TrimSpace(subject))]
	var results []MemFact
	for _, idx := range indices {
		if fs.facts[idx].IsActive == 1 {
			results = append(results, fs.facts[idx])
		}
		if limit > 0 && len(results) >= limit {
			break
		}
	}
	return results
}

// allActive returns all active facts, optionally limited.
func (fs *factStore) allActive(limit int) []MemFact {
	var results []MemFact
	for _, f := range fs.facts {
		if f.IsActive == 1 {
			results = append(results, f)
		}
		if limit > 0 && len(results) >= limit {
			break
		}
	}
	return results
}

// count returns total and active fact counts.
func (fs *factStore) count() (total, active int) {
	total = len(fs.facts)
	for _, f := range fs.facts {
		if f.IsActive == 1 {
			active++
		}
	}
	return
}

// Tier returns the recency tier label: "hot", "warm", "recent", or "cold".
func (f *MemFact) Tier() string {
	if f.CreatedAt == "" {
		return "cold"
	}
	t, err := time.Parse("2006-01-02", f.CreatedAt[:min10(10, len(f.CreatedAt))])
	if err != nil {
		t, err = time.Parse(time.RFC3339, f.CreatedAt)
		if err != nil {
			return "cold"
		}
	}
	age := time.Since(t)
	switch {
	case age < 24*time.Hour:
		return "hot"
	case age < 7*24*time.Hour:
		return "warm"
	case age < 30*24*time.Hour:
		return "recent"
	default:
		return "cold"
	}
}

// StalenessWarning returns a warning if the fact is old.
func (f *MemFact) StalenessWarning() string {
	if f.CreatedAt == "" {
		return ""
	}
	t, err := time.Parse("2006-01-02", f.CreatedAt[:10])
	if err != nil {
		return ""
	}
	age := time.Since(t)
	if age > 90*24*time.Hour {
		return "⚠ >90d old"
	}
	if age > 30*24*time.Hour {
		return "⚠ >30d old"
	}
	return ""
}

exec
/bin/zsh -lc "sed -n '1,260p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
package index

import (
	"fmt"
	"sort"
	"strings"
)

// CrossRef is an in-memory cross-index that connects documents sharing subjects,
// entities, or tags. Built at index time alongside BM25. No new storage — just
// adjacency maps derived from existing frontmatter.
//
// This is Option A from the knowledge graph discussion: connected search results
// without a full graph engine. A query for "Gemma 4" returns the fact, the Atlas
// entity, the beliefs, the articles that mention it, and the learnings — one search.

// DocRef is a lightweight reference to a connected document.
type DocRef struct {
	Path    string
	Title   string
	Kind    string // "fact", "belief", "entity", "article", "learning", "mission", "role"
	Subject string
	Rank    float64 // connection strength (number of shared terms)
}

// crossIndex maps normalized subjects/entities to document references.
type crossIndex struct {
	bySubject map[string][]DocRef // lowercase subject → connected docs
	byTag     map[string][]DocRef // tag → connected docs
	byEntity  map[string][]DocRef // entity name → connected docs
}

func newCrossIndex() *crossIndex {
	return &crossIndex{
		bySubject: make(map[string][]DocRef),
		byTag:     make(map[string][]DocRef),
		byEntity:  make(map[string][]DocRef),
	}
}

// build populates the cross-index from all indexed documents.
func (ci *crossIndex) build(docs []document) {
	for _, doc := range docs {
		kind := inferDocKind(doc.Path, doc.Kind)
		ref := DocRef{
			Path:    doc.Path,
			Title:   doc.Title,
			Kind:    kind,
			Subject: doc.Subject,
		}

		// Index by subject
		if doc.Subject != "" {
			key := strings.ToLower(strings.TrimSpace(doc.Subject))
			ci.bySubject[key] = append(ci.bySubject[key], ref)
		}

		// Index by tags
		for _, tag := range strings.Fields(doc.Tags) {
			tag = strings.ToLower(strings.TrimSpace(tag))
			if tag != "" {
				ci.byTag[tag] = append(ci.byTag[tag], ref)
			}
		}

		// Index by entity mentions in title and subject
		// Entities are subjects of atlas docs, but also appear in other docs' text.
		// For now, cross-reference by exact subject match across all doc types.
		if kind == "entity" && doc.Title != "" {
			key := strings.ToLower(strings.TrimSpace(doc.Title))
			ci.byEntity[key] = append(ci.byEntity[key], ref)
		}
		if kind == "entity" && doc.Subject != "" {
			key := strings.ToLower(strings.TrimSpace(doc.Subject))
			ci.byEntity[key] = append(ci.byEntity[key], ref)
		}

		// Scan body for references to known entities (built in second pass)
	}

	// Second pass: scan all docs for mentions of entity names in title/body.
	// This connects articles to entities they discuss.
	entityNames := make(map[string]bool, len(ci.byEntity))
	for name := range ci.byEntity {
		if len(name) >= 3 { // skip tiny entity names
			entityNames[name] = true
		}
	}

	for _, doc := range docs {
		kind := inferDocKind(doc.Path, doc.Kind)
		if kind == "entity" {
			continue // entities already indexed
		}

		ref := DocRef{
			Path:    doc.Path,
			Title:   doc.Title,
			Kind:    kind,
			Subject: doc.Subject,
		}

		// Check if title or subject mentions a known entity
		titleLower := strings.ToLower(doc.Title)
		subjectLower := strings.ToLower(doc.Subject)

		for entityName := range entityNames {
			if strings.Contains(titleLower, entityName) || strings.Contains(subjectLower, entityName) {
				ci.byEntity[entityName] = append(ci.byEntity[entityName], ref)
			}
		}
	}
}

// ForSubject returns all documents connected to a subject (case-insensitive).
func (ci *crossIndex) ForSubject(subject string, limit int) []DocRef {
	if limit <= 0 {
		limit = 20
	}
	key := strings.ToLower(strings.TrimSpace(subject))
	refs := ci.bySubject[key]
	if len(refs) > limit {
		refs = refs[:limit]
	}
	return refs
}

// ForTag returns all documents sharing a tag.
func (ci *crossIndex) ForTag(tag string, limit int) []DocRef {
	if limit <= 0 {
		limit = 20
	}
	key := strings.ToLower(strings.TrimSpace(tag))
	refs := ci.byTag[key]
	if len(refs) > limit {
		refs = refs[:limit]
	}
	return refs
}

// ForEntity returns all documents connected to an entity.
func (ci *crossIndex) ForEntity(entity string, limit int) []DocRef {
	if limit <= 0 {
		limit = 20
	}
	key := strings.ToLower(strings.TrimSpace(entity))
	refs := ci.byEntity[key]
	if len(refs) > limit {
		refs = refs[:limit]
	}
	return refs
}

// Connected returns the full neighborhood of a query — union of subject, tag,
// and entity matches, deduplicated by path, sorted by connection count.
func (ci *crossIndex) Connected(query string, limit int) []DocRef {
	if limit <= 0 {
		limit = 20
	}

	terms := strings.Fields(strings.ToLower(query))
	if len(terms) == 0 {
		return nil
	}

	// Score each document by how many query terms connect to it
	scores := make(map[string]*DocRef)  // path → ref
	counts := make(map[string]float64)  // path → connection strength

	addRefs := func(refs []DocRef, weight float64) {
		for _, r := range refs {
			counts[r.Path] += weight
			if _, ok := scores[r.Path]; !ok {
				copy := r
				scores[r.Path] = &copy
			}
		}
	}

	for _, term := range terms {
		addRefs(ci.bySubject[term], 3.0) // subject match is strongest
		addRefs(ci.byEntity[term], 2.0)  // entity match is strong
		addRefs(ci.byTag[term], 1.0)     // tag match is weaker
	}

	// Also try the full query as a single key
	fullQuery := strings.Join(terms, " ")
	addRefs(ci.bySubject[fullQuery], 3.0)
	addRefs(ci.byEntity[fullQuery], 2.0)

	// Sort by connection strength
	type ranked struct {
		ref   *DocRef
		score float64
	}
	var results []ranked
	for path, ref := range scores {
		ref.Rank = counts[path]
		results = append(results, ranked{ref, counts[path]})
	}
	sort.Slice(results, func(i, j int) bool {
		return results[i].score > results[j].score
	})

	if len(results) > limit {
		results = results[:limit]
	}

	out := make([]DocRef, len(results))
	for i, r := range results {
		out[i] = *r.ref
	}
	return out
}

// Stats returns cross-index statistics.
func (ci *crossIndex) Stats() (subjects, tags, entities int) {
	return len(ci.bySubject), len(ci.byTag), len(ci.byEntity)
}

// inferDocKind determines the document type from its vault path and metadata.
func inferDocKind(path, metaKind string) string {
	if metaKind != "" {
		return metaKind
	}
	switch {
	case strings.HasPrefix(path, "memory/facts/"):
		return "fact"
	case strings.HasPrefix(path, "atlas/beliefs/"):
		return "belief"
	case strings.HasPrefix(path, "atlas/entities/") || strings.HasPrefix(path, "atlas/"):
		return "entity"
	case strings.HasPrefix(path, "brain/learnings/"):
		return "learning"
	case strings.HasPrefix(path, "brain/"):
		return "article"
	case strings.HasPrefix(path, "missions/"):
		return "mission"
	case strings.HasPrefix(path, "roles/"):
		return "role"
	case strings.HasPrefix(path, "experience/"):
		return "experience"
	default:
		return "document"
	}
}

// FormatConnected returns a human-readable string of connected documents.
func FormatConnected(refs []DocRef) string {
	if len(refs) == 0 {
		return ""
	}

	var sb strings.Builder
	sb.WriteString(fmt.Sprintf("## Connected (%d)\n\n", len(refs)))

	// Group by kind
	byKind := make(map[string][]DocRef)
	for _, r := range refs {
		byKind[r.Kind] = append(byKind[r.Kind], r)

exec
/bin/zsh -lc "sed -n '1,260p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
package markdown

import (
	"bufio"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"gopkg.in/yaml.v3"
)

// Document represents a parsed markdown file with YAML frontmatter.
type Document struct {
	Path        string                 // filesystem path
	Frontmatter map[string]interface{} // parsed YAML
	Body        string                 // markdown content after frontmatter
}

// Get returns a frontmatter value as a string, or empty string.
func (d *Document) Get(key string) string {
	v, ok := d.Frontmatter[key]
	if !ok {
		return ""
	}
	return fmt.Sprintf("%v", v)
}

// GetFloat returns a frontmatter value as float64, or 0.
func (d *Document) GetFloat(key string) float64 {
	v, ok := d.Frontmatter[key]
	if !ok {
		return 0
	}
	switch val := v.(type) {
	case float64:
		return val
	case int:
		return float64(val)
	default:
		return 0
	}
}

// GetTags returns the tags field as a string slice.
func (d *Document) GetTags() []string {
	v, ok := d.Frontmatter["tags"]
	if !ok {
		return nil
	}
	switch val := v.(type) {
	case []interface{}:
		tags := make([]string, 0, len(val))
		for _, t := range val {
			tags = append(tags, fmt.Sprintf("%v", t))
		}
		return tags
	case string:
		return strings.Split(val, ",")
	default:
		return nil
	}
}

// Set updates a frontmatter value.
func (d *Document) Set(key string, value interface{}) {
	if d.Frontmatter == nil {
		d.Frontmatter = make(map[string]interface{})
	}
	d.Frontmatter[key] = value
}

// Save writes the document back to disk with updated frontmatter.
func (d *Document) Save() error {
	return Write(d.Path, d.Frontmatter, d.Body)
}

// WikiLinks extracts all [[link]] references from the body.
func (d *Document) WikiLinks() []string {
	var links []string
	start := 0
	for {
		i := strings.Index(d.Body[start:], "[[")
		if i < 0 {
			break
		}
		j := strings.Index(d.Body[start+i:], "]]")
		if j < 0 {
			break
		}
		link := d.Body[start+i+2 : start+i+j]
		links = append(links, link)
		start = start + i + j + 2
	}
	return links
}

// Parse reads a markdown file and returns a Document.
func Parse(path string) (*Document, error) {
	f, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	scanner := bufio.NewScanner(f)
	scanner.Buffer(make([]byte, 0, 64*1024), 1024*1024) // 1MB max line

	doc := &Document{
		Path:        path,
		Frontmatter: make(map[string]interface{}),
	}

	// Check for frontmatter
	if !scanner.Scan() {
		return doc, nil
	}
	firstLine := scanner.Text()
	if firstLine != "---" {
		// No frontmatter — entire file is body
		var body strings.Builder
		body.WriteString(firstLine)
		body.WriteByte('\n')
		for scanner.Scan() {
			body.WriteString(scanner.Text())
			body.WriteByte('\n')
		}
		doc.Body = body.String()
		return doc, nil
	}

	// Read frontmatter until closing ---
	var fmLines strings.Builder
	for scanner.Scan() {
		line := scanner.Text()
		if line == "---" {
			break
		}
		fmLines.WriteString(line)
		fmLines.WriteByte('\n')
	}

	// Parse YAML
	if err := yaml.Unmarshal([]byte(fmLines.String()), &doc.Frontmatter); err != nil {
		// If YAML fails, treat entire content as body
		doc.Body = fmLines.String()
		return doc, nil
	}

	// Read body
	var body strings.Builder
	for scanner.Scan() {
		body.WriteString(scanner.Text())
		body.WriteByte('\n')
	}
	doc.Body = body.String()

	return doc, nil
}

// ScanDir recursively scans a directory for .md files and parses each.
func ScanDir(dir string) ([]*Document, error) {
	var docs []*Document

	err := filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return nil // skip errors
		}
		// Skip discard directories — cold storage, not indexed
		if info.IsDir() && info.Name() == "discard" {
			return filepath.SkipDir
		}
		if info.IsDir() || !strings.HasSuffix(path, ".md") {
			return nil
		}

		doc, err := Parse(path)
		if err != nil {
			return nil // skip unparseable files
		}
		docs = append(docs, doc)
		return nil
	})

	return docs, err
}

exec
/bin/zsh -lc "sed -n '1,240p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/writer.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
package markdown

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

// Write creates a markdown file with YAML frontmatter.
func Write(path string, frontmatter map[string]interface{}, body string) error {
	dir := filepath.Dir(path)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return fmt.Errorf("mkdir %s: %w", dir, err)
	}

	var sb strings.Builder
	sb.WriteString("---\n")

	for key, val := range frontmatter {
		if val == nil {
			continue
		}
		switch v := val.(type) {
		case []string:
			sb.WriteString(fmt.Sprintf("%s: [%s]\n", key, strings.Join(v, ", ")))
		case []interface{}:
			parts := make([]string, len(v))
			for i, item := range v {
				parts[i] = fmt.Sprintf("%v", item)
			}
			sb.WriteString(fmt.Sprintf("%s: [%s]\n", key, strings.Join(parts, ", ")))
		case bool:
			sb.WriteString(fmt.Sprintf("%s: %v\n", key, v))
		case float64, int:
			sb.WriteString(fmt.Sprintf("%s: %v\n", key, v))
		default:
			s := fmt.Sprintf("%v", v)
			if needsQuoting(s) {
				sb.WriteString(fmt.Sprintf("%s: %q\n", key, s))
			} else {
				sb.WriteString(fmt.Sprintf("%s: %s\n", key, s))
			}
		}
	}

	sb.WriteString("---\n\n")
	sb.WriteString(strings.TrimSpace(body))
	sb.WriteByte('\n')

	return os.WriteFile(path, []byte(sb.String()), 0644)
}

func needsQuoting(s string) bool {
	for _, c := range s {
		switch c {
		case ':', '#', '[', ']', '{', '}', '|', '>', '*', '&', '!', '%', '@', '`':
			return true
		}
	}
	return false
}

exec
/bin/zsh -lc "sed -n '260,420p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '840,940p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "rg -n \"memory_search|memory_reinforce|SummarizeForCloud|RankResults|ExpandQuery|Connected|ReinforceFact|Build\\(|startup|index is rebuilt on startup|4-8k|context curation|compact|summary\" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:

	memoryFactsSchema := map[string]interface{}{
		"type": "object",
		"properties": map[string]interface{}{
			"subject": map[string]interface{}{"type": "string", "description": "Filter by subject (optional)"},
			"limit":   map[string]interface{}{"type": "integer", "description": "Max results (default 20)"},
		},
	}

	srv.AddTool("memory_facts", "List episodic memory facts. Optionally filter by subject.", memoryFactsSchema, memoryFactsHandler)

	// --- Memory Search ---

	memorySearchHandler := func(args map[string]interface{}) (string, error) {
		query, _ := args["query"].(string)
		limit := 10
		if l, ok := args["limit"].(float64); ok {
			limit = int(l)
		}

		// Search with optional librarian expansion
		queries := []string{query}
		if librarian.Available() {
			queries = librarian.ExpandQuery(query)
			log.Printf("memory_search: librarian expanded %q → %d variants", query, len(queries))
		}

		// Run in-memory fact search across all query variants, merge by subject|predicate
		seen := map[string]bool{}
		var merged []index.MemFact

		for _, q := range queries {
			facts := v.Index.SearchFacts(q, limit)
			for _, f := range facts {
				key := f.Subject + "|" + f.Predicate
				if !seen[key] {
					seen[key] = true
					merged = append(merged, f)
				}
			}
		}

		if len(merged) == 0 {
			return "No memory facts matched this query.", nil
		}

		// Cap at limit
		if len(merged) > limit {
			merged = merged[:limit]
		}

		// Reinforce accessed facts — FSRS recall event.
		// Each fact returned to an agent is a successful recall, strengthening stability.
		for _, f := range merged {
			if f.ID != "" {
				go v.ReinforceFact(f.ID) // async — don't block search response
			}
		}

		var sb strings.Builder
		sb.WriteString(fmt.Sprintf("%d results (bm25+librarian, %d queries):\n\n",
			len(merged), len(queries)))
		for _, f := range merged {
			tier := f.Tier()
			line := fmt.Sprintf("- **%s** %s → %s (conf=%.2f, %s)",
				f.Subject, f.Predicate, truncateStr(f.Value, 120), f.Confidence, tier)
			if warn := f.StalenessWarning(); warn != "" {
				line += " " + warn
			}
			sb.WriteString(line + "\n")
		}
		return sb.String(), nil
	}

	memorySearchSchema := map[string]interface{}{
		"type": "object",
		"properties": map[string]interface{}{
			"query": map[string]interface{}{"type": "string", "description": "Search query"},
			"limit": map[string]interface{}{"type": "integer", "description": "Max results (default 10)"},
		},
		"required": []string{"query"},
	}

	srv.AddTool("memory_search", "Search episodic memory facts with librarian expansion and FSRS reinforcement.", memorySearchSchema, memorySearchHandler)

	// --- Memory Store ---

	memoryStoreHandler := func(args map[string]interface{}) (string, error) {
		subject, _ := args["subject"].(string)
		predicate, _ := args["predicate"].(string)
		value, _ := args["value"].(string)
		confidence := 0.8
		if c, ok := args["confidence"].(float64); ok {
			confidence = c
		}
		importance := "medium"
		if imp, ok := args["importance"].(string); ok {
			importance = imp
		}

		relPath, err := v.StoreFact(subject, predicate, value, confidence, importance)
		if err != nil {
			return "", err
		}
		return fmt.Sprintf("Stored: %s %s → %s (confidence: %.2f)", subject, predicate, relPath, confidence), nil
	}

	memoryStoreSchema := map[string]interface{}{
		"type": "object",
		"properties": map[string]interface{}{
			"subject":    map[string]interface{}{"type": "string"},
			"predicate":  map[string]interface{}{"type": "string"},
			"value":      map[string]interface{}{"type": "string"},
			"confidence": map[string]interface{}{"type": "number", "description": "0.0-1.0"},
			"importance": map[string]interface{}{"type": "string", "enum": []string{"critical", "high", "medium", "low"}},
		},
		"required": []string{"subject", "predicate", "value"},
	}

	srv.AddTool("memory_store", "Store a new episodic memory fact.", memoryStoreSchema, memoryStoreHandler)

	// --- Atlas: Entities ---

	srv.AddTool("atlas_list_entities", "List all entities in the knowledge graph.", map[string]interface{}{
		"type": "object", "properties": map[string]interface{}{},
	}, func(args map[string]interface{}) (string, error) {
		docs, err := v.ListEntities()
		if err != nil {
			return "", err
		}

		var sb strings.Builder
		sb.WriteString(fmt.Sprintf("%d entities:\n\n", len(docs)))
		for _, doc := range docs {
			name := doc.Get("name")
			kind := doc.Get("kind")
			links := doc.WikiLinks()
			sb.WriteString(fmt.Sprintf("- **%s** (%s) — %d links\n", name, kind, len(links)))
		}
		return sb.String(), nil
	})

	// --- Atlas: Get Entity ---

	srv.AddTool("atlas_get_entity", "Get an entity page with beliefs and wiki-links.", map[string]interface{}{
		"type": "object",
		"properties": map[string]interface{}{
			"name": map[string]interface{}{"type": "string", "description": "Entity name or slug"},
		},
		"required": []string{"name"},
	}, func(args map[string]interface{}) (string, error) {
		name, _ := args["name"].(string)
		doc, err := v.GetEntity(name)
		if err != nil {
			return fmt.Sprintf("Entity %q not found.", name), nil
		}

		var sb strings.Builder
		sb.WriteString(fmt.Sprintf("# %s\n\n", doc.Get("name")))
		sb.WriteString(fmt.Sprintf("Kind: %s | Status: %s\n\n", doc.Get("kind"), doc.Get("status")))
		sb.WriteString(doc.Body)

 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:13://	memory_facts, memory_search, memory_store,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:14://	memory_reinforce, memory_decay_facts, vault_connected
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:26:		"memory_search":     true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:28:		"memory_reinforce":  true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:121:<summary><strong>Claude Desktop</strong></summary>
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:138:<summary><strong>Claude Code</strong></summary>
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:146:<summary><strong>Cursor</strong></summary>
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:161:<summary><strong>Windsurf / Cline / Any MCP client</strong></summary>
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:203:| `memory_search` | Search memory facts with automatic FSRS reinforcement on recall |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:205:| `memory_reinforce` | Explicitly reinforce a memory — increases stability, decreases difficulty |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:224:The cloud model stays focused on reasoning. The Librarian handles retrieval, filing, deduplication, decay, and context curation — then hands over only the 4-8k tokens that actually matter.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:292:- Connected learnings from past debugging
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:425:| Binary startup to ready | ~2 seconds |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:427:The entire index lives in memory. There's no disk I/O on the search path after startup.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:432:<summary><strong>How is this different from the official MCP memory server?</strong></summary>
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:440:<summary><strong>How is this different from Mem0?</strong></summary>
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:448:<summary><strong>Does it work offline?</strong></summary>
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:454:<summary><strong>Can I use it with multiple AI clients at the same time?</strong></summary>
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:456:Yes. Each client spawns its own modus-memory process, but they all read/write the same vault directory. The index is rebuilt on startup (takes ~2 seconds), and writes go directly to disk as markdown files. There's no lock contention for reads.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:460:<summary><strong>What happens if I have 100K+ documents?</strong></summary>
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:466:<summary><strong>Can I encrypt my vault?</strong></summary>
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:477:<summary><strong>How do I sync across devices?</strong></summary>
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:489:<summary><strong>What if two clients write to the same fact simultaneously?</strong></summary>
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:495:<summary><strong>Can I import from other memory tools?</strong></summary>
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:31:			expansions := librarian.ExpandQuery(query)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:77:			refs := v.Index.Connected(query, 5)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:283:			queries = librarian.ExpandQuery(query)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:284:			log.Printf("memory_search: librarian expanded %q → %d variants", query, len(queries))
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:315:				go v.ReinforceFact(f.ID) // async — don't block search response
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:343:	srv.AddTool("memory_search", "Search episodic memory facts with librarian expansion and FSRS reinforcement.", memorySearchSchema, memorySearchHandler)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:885:	srv.AddTool("memory_reinforce", "Reinforce a memory fact after successful recall (FSRS stability growth).", map[string]interface{}{
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:893:		if err := v.ReinforceFact(path); err != nil {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:919:		refs := v.Index.Connected(query, limit)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:924:		return index.FormatConnected(refs), nil
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md:29:The cloud model stays focused on reasoning. The Librarian handles the boring-but-critical infrastructure: retrieval, filing, deduplication, decay, and context curation. It hands the cloud model only the 4-8k tokens that actually matter.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md:132:  "Search the vault for relevant context and return a compressed summary"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md:145:tools: [vault_search, vault_read, vault_write, vault_list, memory_store, memory_search]

 succeeded in 0ms:
			return sb.String(), nil
		}

		for _, d := range deps {
			satisfied := "no"
			if s, ok := d["satisfied"].(bool); ok && s {
				satisfied = "yes"
			}
			sb.WriteString(fmt.Sprintf("- %s (%s) — status: %s, satisfied: %s\n",
				d["slug"], d["type"], d["status"], satisfied))
		}
		return sb.String(), nil
	})

	// --- Memory: Fact Decay ---

	srv.AddTool("memory_decay_facts", "Run memory fact confidence decay sweep.", map[string]interface{}{
		"type": "object", "properties": map[string]interface{}{},
	}, func(args map[string]interface{}) (string, error) {
		n, err := v.DecayFacts()
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
	}, func(args map[string]interface{}) (string, error) {
		home, _ := os.UserHomeDir()
		statusPath := filepath.Join(home, "modus", "data", "distill", "STATUS.md")
		data, err := os.ReadFile(statusPath)
		if err != nil {
			// Check raw pair counts
			sageDir := filepath.Join(v.Dir, "training", "sage")
			sageEntries, _ := os.ReadDir(sageDir)
			runsDir := filepath.Join(v.Dir, "experience", "runs")
			runEntries, _ := os.ReadDir(runsDir)

exec
/bin/zsh -lc "sed -n '1,120p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
codex
I’m switching over to our own recovery surfaces now. The key comparison I need is whether we survive context loss through explicit state recovery primitives, or only through better retrieval ranking, so I’m tracing `session_bootstrap`, `session_resume`, `memory_context(...resume...)`, and `generate-context.js`.
exec
/bin/zsh -lc "sed -n '1,260p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Session Bootstrap Handler
// ───────────────────────────────────────────────────────────────
// Phase 024 / Item 7: Composite tool that runs session_resume
// + session_health in one call, merging results with hints.

import { handleSessionResume } from './session-resume.js';
import type { CachedSessionSummaryDecision } from './session-resume.js';
import { handleSessionHealth } from './session-health.js';
import { recordBootstrapEvent } from '../lib/session/context-metrics.js';
import { buildStructuralBootstrapContract } from '../lib/session/session-snapshot.js';
import type { StructuralBootstrapContract } from '../lib/session/session-snapshot.js';
import {
  attachStructuralTrustFields,
  buildStructuralContextTrust,
  createSharedPayloadEnvelope,
  summarizeUnknown,
  summarizeCertaintyContract,
  trustStateFromStructuralStatus,
  type SharedPayloadCertainty,
  type SharedPayloadEnvelope,
  type SharedPayloadSection,
  StructuralTrustPayloadError,
  type StructuralTrust,
} from '../lib/context/shared-payload.js';
import {
  buildOpenCodeTransportPlan,
  coerceSharedPayloadEnvelope,
  type OpenCodeTransportPlan,
} from '../lib/context/opencode-transport.js';
import {
  buildCodeGraphOpsContract,
  type CodeGraphOpsContract,
} from '../lib/code-graph/ops-hardening.js';
import type { MCPResponse } from '@spec-kit/shared/types';

/* ───────────────────────────────────────────────────────────────
   1. TYPES
──────────────────────────────────────────────────────────────── */

interface SessionBootstrapArgs {
  specFolder?: string;
}

interface SessionBootstrapResult {
  resume: Record<string, unknown>;
  health: Record<string, unknown>;
  cachedSummary?: CachedSessionSummaryDecision;
  structuralContext?: StructuralBootstrapContract & StructuralTrust;
  structuralRoutingNudge?: {
    advisory: true;
    readiness: 'ready';
    preferredTool: 'code_graph_query';
    message: string;
    preservesAuthority: 'session_bootstrap';
  };
  payloadContract?: SharedPayloadEnvelope;
  opencodeTransport?: OpenCodeTransportPlan;
  graphOps?: CodeGraphOpsContract;
  hints: string[];
  nextActions: string[];
}

/* ───────────────────────────────────────────────────────────────
   2. HELPERS
──────────────────────────────────────────────────────────────── */

function extractData(response: MCPResponse): Record<string, unknown> {
  try {
    const text = response?.content?.[0]?.text;
    if (typeof text === 'string') {
      const parsed = JSON.parse(text);
      return parsed?.data ?? parsed ?? {};
    }
  } catch { /* parse failed */ }
  return {};
}

function extractHints(data: Record<string, unknown>): string[] {
  if (Array.isArray(data.hints)) return data.hints as string[];
  return [];
}

function extractCachedSummary(
  data: Record<string, unknown>,
): CachedSessionSummaryDecision | null {
  const candidate = data.cachedSummary;
  if (candidate && typeof candidate === 'object') {
    return candidate as CachedSessionSummaryDecision;
  }
  return null;
}

function buildNextActions(
  resumeData: Record<string, unknown>,
  healthData: Record<string, unknown>,
  structuralContext: StructuralBootstrapContract,
): string[] {
  const nextActions = new Set<string>();

  if (resumeData.error) {
    nextActions.add('Call `session_resume({ specFolder })` directly to inspect the detailed resume failure.');
  }

  if (healthData.error) {
    nextActions.add('Call `session_health()` directly to inspect the current health-check failure.');
  }

  if (structuralContext.recommendedAction) {
    nextActions.add(structuralContext.recommendedAction);
  }

  if (structuralContext.status === 'ready') {
    nextActions.add('Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.');
  } else if (structuralContext.status === 'stale') {
    nextActions.add('Run `code_graph_scan` if you need fresh structural context, then call `session_bootstrap()` again.');
  } else {
    nextActions.add('If structural context matters for this task, run `code_graph_scan` and then re-run `session_bootstrap()`.');
  }

  const healthStatus = typeof healthData.status === 'string' ? healthData.status : null;
  if (healthStatus === 'warning' || healthStatus === 'stale') {
    nextActions.add('Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` if you need a deeper state refresh.');
  }

  return [...nextActions].slice(0, 3);
}

function extractStructuralTrustFromPayload(
  payload: SharedPayloadEnvelope | null,
): StructuralTrust | null {
  if (!payload) {
    return null;
  }

  const structuralSection = payload.sections.find((section) =>
    section.key === 'structural-context' && section.structuralTrust,
  );

  return structuralSection?.structuralTrust ?? null;
}

function buildStructuralRoutingNudge(
  structuralContext: StructuralBootstrapContract,
): SessionBootstrapResult['structuralRoutingNudge'] | null {
  if (structuralContext.status !== 'ready') {
    return null;
  }

  return {
    advisory: true,
    readiness: 'ready',
    preferredTool: 'code_graph_query',
    message: 'Advisory only: when the next question is about callers, imports, dependencies, or outline, prefer `code_graph_query` before Grep or Glob.',
    preservesAuthority: 'session_bootstrap',
  };
}

/* ───────────────────────────────────────────────────────────────
   3. HANDLER
──────────────────────────────────────────────────────────────── */

/** Handle session_bootstrap tool call — one-call session setup */
export async function handleSessionBootstrap(args: SessionBootstrapArgs): Promise<MCPResponse> {
  const startMs = Date.now();
  const allHints: string[] = [];

  // Sub-call 1: session_resume with full resume payload
  let resumeData: Record<string, unknown> = {};
  try {
    const resumeResponse = await handleSessionResume({
      specFolder: args.specFolder,
    });
    resumeData = extractData(resumeResponse);
    allHints.push(...extractHints(resumeData));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    resumeData = { error: message };
    allHints.push('session_resume failed. Try calling it manually.');
  }

  // Sub-call 2: session_health
  let healthData: Record<string, unknown> = {};
  try {
    const healthResponse = await handleSessionHealth();
    healthData = extractData(healthResponse);
    allHints.push(...extractHints(healthData));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    healthData = { error: message };
    allHints.push('session_health failed. Try calling it manually.');
  }

  // Phase 027: Structural bootstrap contract
  const structuralContext = buildStructuralBootstrapContract('session_bootstrap');
  if (structuralContext.status === 'stale' || structuralContext.status === 'missing') {
    allHints.push(
      `Structural context is ${structuralContext.status}. Run code_graph_scan if needed, then re-run session_bootstrap.`
    );
  }

  const cachedSummary = extractCachedSummary(resumeData);
  if (cachedSummary?.status === 'accepted') {
    allHints.push('Cached continuity summary accepted as additive bootstrap context.');
  }
  const structuralRoutingNudge = buildStructuralRoutingNudge(structuralContext);
  if (structuralRoutingNudge) {
    allHints.push(structuralRoutingNudge.message);
  }

  // Deduplicate hints
  const uniqueHints = [...new Set(allHints)];

  // Record bootstrap telemetry once for the composite call.
  const durationMs = Date.now() - startMs;
  const completeness = resumeData.error || healthData.error ? 'partial' : 'full';
  recordBootstrapEvent('tool', durationMs, completeness);

  const resumeCertainty: SharedPayloadCertainty = resumeData.error ? 'unknown' : 'estimated';
  const healthCertainty: SharedPayloadCertainty = healthData.error ? 'unknown' : 'estimated';
  const cachedCertainty: SharedPayloadCertainty = cachedSummary?.status === 'accepted' ? 'estimated' : 'defaulted';
  const structuralCertainty: SharedPayloadCertainty = 'exact';
  const nextActionsCertainty: SharedPayloadCertainty = 'defaulted';
  const resumePayload = coerceSharedPayloadEnvelope(resumeData.payloadContract);
  const healthPayload = coerceSharedPayloadEnvelope(healthData.payloadContract);
  const structuralSnapshotTrust = buildStructuralContextTrust(structuralContext);
  const resumeStructuralTrust = extractStructuralTrustFromPayload(resumePayload);
  if (!resumeData.error && !resumeStructuralTrust) {
    throw new StructuralTrustPayloadError(
      'session_bootstrap expected session_resume to emit structural-context.structuralTrust.',
    );
  }
  const structuralContextWithTrust = attachStructuralTrustFields(
    structuralContext,
    structuralSnapshotTrust,
    { label: 'session_bootstrap structural context payload' },
  );
  const resumeWithTrust = resumeData.error
    ? resumeData
    : attachStructuralTrustFields(
      resumeData,
      resumeStructuralTrust,
      { label: 'session_bootstrap resume payload' },
    );

  const payloadSections: SharedPayloadSection[] = [
    {
      key: 'resume-surface',
      title: 'Resume Surface',
      content: summarizeUnknown(resumeData),
      source: 'memory',
      certainty: resumeCertainty,
    },
  ];
  if (cachedSummary?.status === 'accepted' && cachedSummary.cachedSummary) {
    payloadSections.push({
      key: 'cached-continuity',
      title: 'Cached Continuity',
      content: [
        cachedSummary.cachedSummary.continuityText,

exec
/bin/zsh -lc "sed -n '1,320p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Session Resume Handler
// ───────────────────────────────────────────────────────────────
// Phase 020: Composite MCP tool that merges memory resume context,
// code graph status, and CocoIndex availability into a single call.

import { createHash } from 'node:crypto';
import { statSync } from 'node:fs';
import { isCocoIndexAvailable } from '../lib/utils/cocoindex-path.js';
import { handleMemoryContext } from './memory-context.js';
import * as graphDb from '../lib/code-graph/code-graph-db.js';
import { getGraphFreshness, type GraphFreshness } from '../lib/code-graph/ensure-ready.js';
import { computeQualityScore, recordMetricEvent, recordBootstrapEvent } from '../lib/session/context-metrics.js';
import { buildStructuralBootstrapContract } from '../lib/session/session-snapshot.js';
import type { StructuralBootstrapContract } from '../lib/session/session-snapshot.js';
import {
  buildStructuralContextTrust,
  createSharedPayloadEnvelope,
  summarizeUnknown,
  summarizeCertaintyContract,
  trustStateFromStructuralStatus,
  type SharedPayloadCertainty,
  type SharedPayloadEnvelope,
  type SharedPayloadSection,
} from '../lib/context/shared-payload.js';
import {
  buildOpenCodeTransportPlan,
  type OpenCodeTransportPlan,
} from '../lib/context/opencode-transport.js';
import {
  buildCodeGraphOpsContract,
  type CodeGraphOpsContract,
} from '../lib/code-graph/ops-hardening.js';
import { loadMostRecentState, type HookProducerMetadata, type HookState } from '../hooks/claude/hook-state.js';
import type { MCPResponse } from '@spec-kit/shared/types';

/* ───────────────────────────────────────────────────────────────
   1. TYPES
──────────────────────────────────────────────────────────────── */

export const CACHED_SESSION_SUMMARY_SCHEMA_VERSION = 1;
export const CACHED_SESSION_SUMMARY_MAX_AGE_MS = 30 * 60 * 1000;

export interface CachedSessionSummaryCandidate {
  schemaVersion: number;
  lastSpecFolder: string | null;
  summaryText: string | null;
  extractedAt: string | null;
  stateUpdatedAt: string | null;
  producerMetadata: HookProducerMetadata | null;
}

export interface CachedSessionSummary {
  schemaVersion: number;
  lastSpecFolder: string;
  summaryText: string;
  extractedAt: string;
  lastClaudeTurnAt: string;
  transcriptPath: string;
  transcriptFingerprint: string;
  cacheCreationInputTokens: number;
  cacheReadInputTokens: number;
  continuityText: string;
  startupHint: string;
}

export interface CachedSessionSummaryDecision {
  status: 'accepted' | 'rejected';
  category: 'accepted' | 'fidelity' | 'freshness';
  reason:
    | 'accepted'
    | 'missing_state'
    | 'schema_version_mismatch'
    | 'missing_summary'
    | 'missing_producer_metadata'
    | 'missing_required_fields'
    | 'transcript_unreadable'
    | 'transcript_identity_mismatch'
    | 'stale_summary'
    | 'summary_precedes_producer_turn'
    | 'scope_mismatch'
    | 'unknown_scope';
  detail: string;
  cachedSummary: CachedSessionSummary | null;
}

interface SessionResumeArgs {
  specFolder?: string;
  sessionId?: string;
  minimal?: boolean;
}

interface CodeGraphStatus {
  status: 'fresh' | 'stale' | 'empty' | 'error';
  lastScan: string | null;
  nodeCount: number;
  edgeCount: number;
  fileCount: number;
}

interface CocoIndexStatus {
  available: boolean;
  binaryPath: string;
}

interface SessionResumeResult {
  memory: Record<string, unknown>;
  codeGraph: CodeGraphStatus;
  cocoIndex: CocoIndexStatus;
  cachedSummary?: CachedSessionSummaryDecision;
  structuralContext?: StructuralBootstrapContract;
  sessionQuality?: 'healthy' | 'degraded' | 'critical' | 'unknown';
  payloadContract?: SharedPayloadEnvelope;
  opencodeTransport?: OpenCodeTransportPlan;
  graphOps?: CodeGraphOpsContract;
  hints: string[];
}

/* ───────────────────────────────────────────────────────────────
   2. HELPERS
──────────────────────────────────────────────────────────────── */

function normalizeSpecFolder(specFolder: string | null | undefined): string | null {
  if (typeof specFolder !== 'string') {
    return null;
  }

  const trimmed = specFolder.trim();
  if (trimmed.length === 0) {
    return null;
  }

  return trimmed.replace(/^\.opencode\//, '');
}

function parseIsoMs(value: string | null | undefined): number | null {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return null;
  }

  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function isFiniteNonNegativeNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

function buildTranscriptFingerprint(
  transcriptPath: string,
  sizeBytes: number,
  modifiedAtMs: number,
): string {
  return createHash('sha256')
    .update(`${transcriptPath}:${sizeBytes}:${modifiedAtMs}`)
    .digest('hex')
    .slice(0, 16);
}

function rejectCachedSummary(
  category: 'fidelity' | 'freshness',
  reason: CachedSessionSummaryDecision['reason'],
  detail: string,
): CachedSessionSummaryDecision {
  return {
    status: 'rejected',
    category,
    reason,
    detail,
    cachedSummary: null,
  };
}

export function buildCachedSessionSummaryCandidate(
  state: HookState | null,
): CachedSessionSummaryCandidate | null {
  if (!state) {
    return null;
  }

  return {
    schemaVersion: CACHED_SESSION_SUMMARY_SCHEMA_VERSION,
    lastSpecFolder: state.lastSpecFolder,
    summaryText: state.sessionSummary?.text ?? null,
    extractedAt: state.sessionSummary?.extractedAt ?? null,
    stateUpdatedAt: state.updatedAt,
    producerMetadata: state.producerMetadata,
  };
}

export function evaluateCachedSessionSummaryCandidate(
  candidate: CachedSessionSummaryCandidate | null,
  options: {
    specFolder?: string;
    nowMs?: number;
    maxAgeMs?: number;
  } = {},
): CachedSessionSummaryDecision {
  if (!candidate) {
    return rejectCachedSummary('fidelity', 'missing_state', 'No recent hook state was available for cached continuity reuse.');
  }

  if (candidate.schemaVersion !== CACHED_SESSION_SUMMARY_SCHEMA_VERSION) {
    return rejectCachedSummary(
      'fidelity',
      'schema_version_mismatch',
      `Expected schema version ${CACHED_SESSION_SUMMARY_SCHEMA_VERSION} but received ${String(candidate.schemaVersion)}.`,
    );
  }

  const summaryText = candidate.summaryText?.trim() ?? '';
  if (summaryText.length === 0 || parseIsoMs(candidate.extractedAt) === null) {
    return rejectCachedSummary(
      'fidelity',
      'missing_summary',
      'Cached continuity requires a non-empty session summary with a valid extractedAt timestamp.',
    );
  }

  const producerMetadata = candidate.producerMetadata;
  if (!producerMetadata) {
    return rejectCachedSummary(
      'fidelity',
      'missing_producer_metadata',
      'Producer metadata from packet 002 was missing, so cached continuity cannot be trusted.',
    );
  }

  const transcript = producerMetadata.transcript;
  const cacheTokens = producerMetadata.cacheTokens;
  const producerTurnMs = parseIsoMs(producerMetadata.lastClaudeTurnAt);
  if (
    producerTurnMs === null
    || !transcript
    || typeof transcript.path !== 'string'
    || transcript.path.trim().length === 0
    || typeof transcript.fingerprint !== 'string'
    || transcript.fingerprint.trim().length === 0
    || !isFiniteNonNegativeNumber(transcript.sizeBytes)
    || parseIsoMs(transcript.modifiedAt) === null
    || !cacheTokens
    || !isFiniteNonNegativeNumber(cacheTokens.cacheCreationInputTokens)
    || !isFiniteNonNegativeNumber(cacheTokens.cacheReadInputTokens)
  ) {
    return rejectCachedSummary(
      'fidelity',
      'missing_required_fields',
      'Producer metadata was missing required transcript identity or cache token fields.',
    );
  }

  let transcriptStat: ReturnType<typeof statSync>;
  try {
    transcriptStat = statSync(transcript.path);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return rejectCachedSummary(
      'fidelity',
      'transcript_unreadable',
      `Transcript identity could not be confirmed because the transcript was unreadable: ${message}`,
    );
  }

  const expectedFingerprint = buildTranscriptFingerprint(
    transcript.path,
    transcriptStat.size,
    transcriptStat.mtimeMs,
  );
  if (
    transcript.sizeBytes !== transcriptStat.size
    || transcript.modifiedAt !== transcriptStat.mtime.toISOString()
    || transcript.fingerprint !== expectedFingerprint
  ) {
    return rejectCachedSummary(
      'fidelity',
      'transcript_identity_mismatch',
      'Transcript path, fingerprint, or file stats no longer match the persisted producer identity.',
    );
  }

  const extractedAtMs = parseIsoMs(candidate.extractedAt);
  const nowMs = options.nowMs ?? Date.now();
  const maxAgeMs = options.maxAgeMs ?? CACHED_SESSION_SUMMARY_MAX_AGE_MS;
  if (extractedAtMs === null || nowMs - extractedAtMs > maxAgeMs) {
    return rejectCachedSummary(
      'freshness',
      'stale_summary',
      `Cached summary age exceeded the freshness window of ${maxAgeMs}ms.`,
    );
  }

  if (extractedAtMs < producerTurnMs) {
    return rejectCachedSummary(
      'freshness',
      'summary_precedes_producer_turn',
      'Cached summary predates the latest producer turn metadata and is therefore invalidated.',
    );
  }

  const expectedSpecFolder = normalizeSpecFolder(options.specFolder);
  const cachedSpecFolder = normalizeSpecFolder(candidate.lastSpecFolder);
  if (expectedSpecFolder) {
    if (!cachedSpecFolder) {
      return rejectCachedSummary(
        'freshness',
        'unknown_scope',
        'A target spec folder was requested, but the cached summary did not carry a scope anchor.',
      );
    }

    if (cachedSpecFolder !== expectedSpecFolder) {
      return rejectCachedSummary(
        'freshness',
        'scope_mismatch',
        `Cached summary scope ${cachedSpecFolder} did not match requested scope ${expectedSpecFolder}.`,
      );
    }
  } else if (!cachedSpecFolder) {
    return rejectCachedSummary(
      'freshness',

exec
/bin/zsh -lc "sed -n '1,320p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
"use strict";
// ---------------------------------------------------------------
// MODULE: Generate Context
// ---------------------------------------------------------------
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = main;
exports.readAllStdin = readAllStdin;
exports.parseArguments = parseArguments;
exports.validateArguments = validateArguments;
exports.isValidSpecFolder = isValidSpecFolder;
exports.extractPayloadSpecFolder = extractPayloadSpecFolder;
// ───────────────────────────────────────────────────────────────
// 1. GENERATE CONTEXT
// ───────────────────────────────────────────────────────────────
// CLI entry point -- parses arguments, validates spec folder, and runs the memory workflow
// Node stdlib
const path = __importStar(require("path"));
const fsSync = __importStar(require("fs"));
// Internal modules
const path_security_1 = require("@spec-kit/shared/utils/path-security");
const core_1 = require("../core");
const workflow_1 = require("../core/workflow");
const loaders_1 = require("../loaders");
const collect_session_data_1 = require("../extractors/collect-session-data");
// ───────────────────────────────────────────────────────────────
// 3. HELP TEXT
// ───────────────────────────────────────────────────────────────
const HELP_TEXT = `
Usage: node generate-context.js [options] <input>

Arguments:
  <input>           A JSON data file path
                    - JSON file mode: node generate-context.js data.json [spec-folder]

Options:
  --help, -h        Show this help message
  --stdin           Read structured JSON from stdin (preferred when a caller already has curated session data)
  --json <string>   Read structured JSON from an inline string (preferred when structured data is available)
  --session-id <uuid>  Explicit session ID to attach to the saved memory metadata

Examples:
  node generate-context.js /tmp/context-data.json
  node generate-context.js /tmp/context-data.json specs/001-feature/
  node generate-context.js /tmp/context-data.json .opencode/specs/001-feature/
  echo '{"specFolder":"specs/001-feature/"}' | node generate-context.js --stdin
  node generate-context.js --json '{"specFolder":"specs/001-feature/"}'

Output:
  Creates a memory file in <spec-folder>/memory/ with ANCHOR format
  for indexing by the Spec Kit Memory system.

Preferred save path (JSON-PRIMARY):
  - ALWAYS use --stdin, --json, or a JSON temp file.
  - The AI has strictly better information about its own session than any DB query can reconstruct.
  - Explicit CLI targets still outrank payload specFolder values in every structured-input mode.

Direct CLI target rule:
  - When a spec folder is passed on the CLI, that explicit target is authoritative.
  - Session learning, JSON SPEC_FOLDER fields, and auto-detect may inform logging,
    but they must not reroute the save to another folder.

JSON Data Format (with preflight/postflight, session/git, and tool/exchange enrichment):
  {
    "user_prompts": [...],
    "observations": [...],
    "recent_context": [...],
    "toolCalls": [
      { "tool": "Read", "inputSummary": "Read data-loader.ts", "outputSummary": "585 lines", "status": "success", "durationEstimate": "fast" },
      { "tool": "Edit", "inputSummary": "Added deprecation warning", "outputSummary": "Inserted 10 lines", "status": "success" }
    ],
    "exchanges": [
      { "userInput": "Implement the JSON-primary plan", "assistantResponse": "Updated 8 files...", "timestamp": "ISO-8601" }
    ],
    "preflight": {
      "knowledgeScore": 40,
      "uncertaintyScore": 60,
      "contextScore": 50,
      "timestamp": "ISO-8601",
      "gaps": ["gap1", "gap2"],
      "confidence": 45,
      "readiness": "Needs research"
    },
    "postflight": {
      "knowledgeScore": 75,
      "uncertaintyScore": 25,
      "contextScore": 80,
      "gapsClosed": ["gap1"],
      "newGaps": ["new-gap"]
    }
  }

  Tool/Exchange enrichment fields (all optional — JSON-mode only):
  - toolCalls[]: AI-summarized tool calls with tool name, input/output summaries, status, duration
  - exchanges[]: Key user-assistant exchanges with timestamps
  - These provide richer context than DB extraction since the AI filters noise at source

  Learning Delta Calculation:
  - Knowledge Delta = postflight.knowledgeScore - preflight.knowledgeScore
  - Uncertainty Reduction = preflight.uncertaintyScore - postflight.uncertaintyScore
  - Context Delta = postflight.contextScore - preflight.contextScore
  - Learning Index = (Know x 0.4) + (Uncert x 0.35) + (Context x 0.25)
`;
if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log(HELP_TEXT);
    process.exit(0);
}
// 2.1 SIGNAL HANDLERS
let signalHandlersInstalled = false;
let shuttingDown = false;
// Robustness: signal handler releases locks before reporting
function handleSignalShutdown(signal) {
    if (shuttingDown)
        return; // prevent re-entrant handling
    shuttingDown = true;
    let lockReleaseFailed = false;
    try {
        (0, workflow_1.releaseFilesystemLock)();
    }
    catch (_err) {
        lockReleaseFailed = true;
    }
    console.error(`\nWarning: Received ${signal} signal, shutting down gracefully...`);
    process.exit(lockReleaseFailed ? 1 : 0);
}
function installSignalHandlers() {
    if (signalHandlersInstalled) {
        return;
    }
    process.on('SIGTERM', () => handleSignalShutdown('SIGTERM'));
    process.on('SIGINT', () => handleSignalShutdown('SIGINT'));
    signalHandlersInstalled = true;
}
// ───────────────────────────────────────────────────────────────
// 4. SPEC FOLDER VALIDATION
// ───────────────────────────────────────────────────────────────
function isUnderApprovedSpecsRoot(normalizedInput) {
    return (0, path_security_1.validateFilePath)(path.resolve(core_1.CONFIG.PROJECT_ROOT, normalizedInput), (0, core_1.getSpecsDirectories)()) !== null;
}
function isValidSpecFolder(folderPath) {
    const folderName = path.basename(folderPath);
    // --- Subfolder support: parent/child format (e.g., "003-parent/121-child" or "02--cat/003-parent/121-child") ---
    const normalizedInput = folderPath.replace(/\\/g, '/').replace(/\/+$/, '');
    // Extract the trailing portion that might be "parent/child"
    const trailingSegments = normalizedInput.split('/');
    // Check if the last two segments both match the spec folder pattern
    if (trailingSegments.length >= 2) {
        const lastTwo = trailingSegments.slice(-2);
        if (core_1.SPEC_FOLDER_PATTERN.test(lastTwo[0]) && core_1.SPEC_FOLDER_PATTERN.test(lastTwo[1])) {
            // Both segments are valid spec folder names — valid nested spec folder
            const hasSpecsParent = isUnderApprovedSpecsRoot(normalizedInput);
            if (!hasSpecsParent) {
                // Fallback: check if the path resolves to an existing directory under any specs root
                for (const specsDir of (0, core_1.getSpecsDirectories)()) {
                    const candidate = path.join(specsDir, normalizedInput);
                    if (!path.isAbsolute(normalizedInput) &&
                        fsSync.existsSync(candidate) &&
                        (0, path_security_1.validateFilePath)(candidate, (0, core_1.getSpecsDirectories)()) !== null) {
                        return { valid: true };
                    }
                }
                return {
                    valid: false,
                    reason: `Spec folder must be under specs/ or .opencode/specs/: ${folderPath}`
                };
            }
            return { valid: true };
        }
    }
    if (!core_1.SPEC_FOLDER_PATTERN.test(folderName)) {
        if (/^\d{3}-/.test(folderName)) {
            if (/[A-Z]/.test(folderName)) {
                return { valid: false, reason: 'Spec folder name should be lowercase' };
            }
            if (/_/.test(folderName)) {
                return { valid: false, reason: 'Spec folder name should use hyphens, not underscores' };
            }
            if (!/^[a-z]/.test(folderName.slice(4))) {
                return { valid: false, reason: 'Spec folder name must start with a letter after the number prefix' };
            }
        }
        return { valid: false, reason: 'Invalid spec folder format. Expected: NNN-feature-name' };
    }
    const hasSpecsParent = isUnderApprovedSpecsRoot(normalizedInput);
    if (!hasSpecsParent) {
        // Fallback: check if bare name can be resolved via recursive child search
        // (findChildFolderSync in validateArguments handles this, so just report the error here)
        return {
            valid: false,
            reason: `Spec folder must be under specs/ or .opencode/specs/: ${folderPath}`
        };
    }
    return { valid: true };
}
function resolveCliSpecFolderReference(rawArg) {
    const folderName = path.basename(rawArg);
    const explicitProjectScopedPath = !rawArg.endsWith('.json') && (rawArg.startsWith('specs/') ||
        rawArg.startsWith('.opencode/specs/'))
        ? path.join(core_1.CONFIG.PROJECT_ROOT, rawArg)
        : null;
    let resolvedNestedPath = null;
    if (!rawArg.endsWith('.json')) {
        if (path.isAbsolute(rawArg)) {
            const absoluteSegments = rawArg.replace(/\/+$/, '').split(/[\\/]/).filter(Boolean);
            const lastSegment = absoluteSegments.at(-1);
            const parentSegment = absoluteSegments.at(-2);
            if ((lastSegment && core_1.SPEC_FOLDER_PATTERN.test(lastSegment)) ||
                (parentSegment && lastSegment && core_1.SPEC_FOLDER_PATTERN.test(parentSegment) && core_1.SPEC_FOLDER_PATTERN.test(lastSegment))) {
                resolvedNestedPath = rawArg;
            }
        }
        let cleaned = rawArg;
        if (cleaned.startsWith('.opencode/specs/')) {
            cleaned = cleaned.slice('.opencode/specs/'.length);
        }
        else if (cleaned.startsWith('specs/')) {
            cleaned = cleaned.slice('specs/'.length);
        }
        cleaned = cleaned.replace(/\/+$/, '');
        if (!resolvedNestedPath && explicitProjectScopedPath && fsSync.existsSync(explicitProjectScopedPath)) {
            resolvedNestedPath = explicitProjectScopedPath;
        }
        const segments = cleaned.split('/');
        if (!resolvedNestedPath && segments.length >= 2) {
            for (const specsDir of (0, core_1.getSpecsDirectories)()) {
                const candidate = path.join(specsDir, ...segments);
                if (fsSync.existsSync(candidate)) {
                    resolvedNestedPath = candidate;
                    break;
                }
            }
            if (!resolvedNestedPath && core_1.SPEC_FOLDER_PATTERN.test(segments[segments.length - 1])) {
                const activeDir = (0, core_1.findActiveSpecsDir)();
                if (activeDir) {
                    resolvedNestedPath = path.join(activeDir, ...segments);
                }
            }
        }
    }
    if (resolvedNestedPath) {
        return resolvedNestedPath;
    }
    const isSpecFolderPath = (rawArg.startsWith('specs/') ||
        rawArg.startsWith('.opencode/specs/') ||
        core_1.SPEC_FOLDER_BASIC_PATTERN.test(folderName)) && !rawArg.endsWith('.json');
    return isSpecFolderPath ? rawArg : null;
}
function extractPayloadSpecFolder(data) {
    for (const key of ['specFolder', 'spec_folder', 'SPEC_FOLDER']) {
        const value = data[key];
        if (typeof value === 'string' && value.trim().length > 0) {
            return value.trim();
        }
    }
    return null;
}
async function readAllStdin(stdin = process.stdin) {
    return await new Promise((resolve, reject) => {
        let buffer = '';
        stdin.setEncoding('utf8');
        stdin.on('data', (chunk) => {
            buffer += chunk;
        });
        stdin.on('end', () => resolve(buffer));
        stdin.on('error', reject);
    });
}
function parseStructuredJson(rawJson, sourceLabel) {
    if (rawJson.trim().length === 0) {
        throw new Error(`${sourceLabel} requires a non-empty JSON object`);
    }
    let parsed;
    try {
        parsed = JSON.parse(rawJson);
    }
    catch (error) {
        const errMsg = error instanceof Error ? error.message : String(error);
        throw new Error(`Invalid JSON provided via ${sourceLabel}: ${errMsg}`);
    }
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        throw new Error(`${sourceLabel} requires a JSON object payload`);
    }
    return parsed;
}
async function parseStructuredModeArguments(mode, args, stdinReader) {
    if (mode === '--stdin' && process.stdin.isTTY) {
        console.error('--stdin requires piped input');
        process.exit(1);

exec
/bin/zsh -lc "rg -n \"session_bootstrap|session_resume|mode:\\s*\\\"resume\\\"|profile:\\s*\\\"resume\\\"|generate-context|handover|compaction|resume previous work|startup snapshot\" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/assets/template_mapping.md:179:    └── *.md                     (auto-generated via generate-context.js)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/assets/template_mapping.md:201:    └── *.md                     (auto-generated via generate-context.js)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/assets/template_mapping.md:223:    └── *.md                     (auto-generated via generate-context.js)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/assets/template_mapping.md:245:    └── *.md                     (auto-generated via generate-context.js)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/assets/template_mapping.md:322:**Generation:** Use `/memory:save` or `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"###-name","sessionSummary":"..."}' specs/###-name/` to auto-generate properly formatted memory files.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:257:  preservesAuthority: 'session_bootstrap';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:323:    preservesAuthority: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:770:      const recommended = !snap.primed ? 'call session_bootstrap()' :
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:785:  lines.push('Non-hook runtimes receive automatic structural context via session_bootstrap, session_resume, and auto-prime.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:787:  lines.push('- If "stale" or "missing": call session_bootstrap first to refresh structural context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:788:  lines.push('- Recovery priority: session_bootstrap → session_resume → code_graph_scan');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:257:  preservesAuthority: 'session_bootstrap';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:323:    preservesAuthority: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:770:      const recommended = !snap.primed ? 'call session_bootstrap()' :
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:785:  lines.push('Non-hook runtimes receive automatic structural context via session_bootstrap, session_resume, and auto-prime.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:787:  lines.push('- If "stale" or "missing": call session_bootstrap first to refresh structural context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:788:  lines.push('- Recovery priority: session_bootstrap → session_resume → code_graph_scan');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:137:| Codex | `.codex/config.toml` | Checked-in MCP config. Bootstrap parity via `session_bootstrap` MCP tool, not a native SessionStart hook. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:437:- `session_bootstrap` (complete session bootstrap)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:438:- `session_resume` (combined session resume)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:620:Routes retrieval requests through per-type strategies based on the artifact being queried. Supports 8 artifact types: `spec`, `plan`, `checklist`, `decision-record`, `memory`, `implementation-summary`, `research` and `handover`. Each type applies its own indexing and ranking rules (for example, `memory` uses recency-weighted scoring while `decision-record` boosts causal edges).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:681:**Behind the scenes:** The AI calls `memory_context()` with `mode: "resume"` and `anchors: ["state", "next-steps"]`, then returns the previous session state.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:535:**Architecture:** CocoIndex (semantic, external MCP) finds code by concept. Code Graph (structural, this server) maps imports, calls and hierarchy. Memory (session, this server) preserves decisions. The compact-merger combines all three under a 4000-token budget for compaction injection.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:545:**Startup/recovery surfaces:** `session_resume`, `session_bootstrap`, and the startup brief now report freshness-aware graph status instead of count-only health. Startup surfaces are intentionally non-mutating snapshots, so later structural reads may still differ if repo state changes.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:599:##### `session_resume`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:601:Resume session with combined memory, code graph and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. The response carries freshness-aware code-graph status (`fresh`, `stale`, `empty`, `error`) instead of count-only health. For the canonical first-call recovery path on session start or after `/clear`, prefer `session_bootstrap`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:610:##### `session_bootstrap`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:612:Complete session bootstrap in one call. This is the canonical first-call recovery step on session start or after `/clear`. It wraps the full `session_resume` payload plus `session_health` and returns context, health, structural readiness and recommended next actions. Startup/bootstrap surfaces are freshness-aware but non-mutating; use `code_graph_scan` when readiness shows an empty or broad full-scan state.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1227:├── hooks/                     # Session-start/compaction surfacing, mutation feedback, token-count sync
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1347:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/005-auth
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1535:| Resume a session from scratch | `session_bootstrap` | Use as the first recovery call on session start or after `/clear` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1536:| Inspect the detailed merged resume payload | `session_resume` | Use when you want direct resume details without the full bootstrap wrapper |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:67:      'write session data to /tmp/save-context-data.json, then run: node generate-context.js /tmp/save-context-data.json [spec-folder]'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:67:      'write session data to /tmp/save-context-data.json, then run: node generate-context.js /tmp/save-context-data.json [spec-folder]'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1269:> **Purpose:** Enable seamless session recovery after context compaction, crashes, or breaks.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:102:**Purpose**: Zero data loss on MCP server crash or context compaction.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:451:  session_bootstrap: getSchema({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:455:  session_resume: getSchema({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:495:  session_bootstrap: ['specFolder'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:497:  session_resume: ['specFolder', 'minimal'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:43:  sourceSurface: 'auto-prime' | 'session_bootstrap' | 'session_resume' | 'session_health';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:257:    recommendedAction = 'Call session_bootstrap first. Then run code_graph_scan if structural context is needed.';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:38: * implementation-summary.md, research/research.md, handover.md.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/handover.md:2:title: "Session Handover Document [template:handover.md]"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/handover.md:3:description: "Session handover template for preserving context and enabling seamless continuation across sessions."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/handover.md:6:  - "handover"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/handover.md:14:Session handover template for preserving context and enabling seamless continuation across sessions.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/handover.md:16:<!-- SPECKIT_TEMPLATE_SOURCE: handover | v1.0 -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/handover.md:22:**Use handover.md when:**
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/handover.md:27:- Session compaction detected and recovery needed
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/handover.md:82:Before handover, verify:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/handover.md:87:- [ ] This handover document is complete
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/handover.md:101:2. Complete all validation checklist items before handover
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/handover.md:113:- Use with `/spec_kit:handover` command for automated context saving
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/handover.md:116:- Create new memory file via `generate-context.js` before handover
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:224:  //   recovery (0.20)      — A memory_context({ mode: "resume" }) call is the most
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:61:  'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:62:  'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:82:    case 'session_resume':             return handleSessionResume(parseArgs<SessionResumeArgs>(validateToolArgs('session_resume', args)));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:83:    case 'session_bootstrap':          return handleSessionBootstrap(parseArgs<SessionBootstrapArgs>(validateToolArgs('session_bootstrap', args)));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:473:    { name: 'handover.md', role: 'Session handover notes' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:473:    { name: 'handover.md', role: 'Session handover notes' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:280:    const warning = 'Manual fallback save mode detected; standard generate-context template markers are missing.';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:542:            AND document_type IN ('spec', 'plan', 'tasks', 'checklist', 'decision_record', 'implementation_summary', 'research', 'handover')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:203:  preservesAuthority: 'session_bootstrap';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:325:    preservesAuthority: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:123:    hints.push('Structural context is stale. Call session_bootstrap to refresh, or run code_graph_scan for a full rescan.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:125:    hints.push('No structural context available. Call session_bootstrap first, then run code_graph_scan.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:4:// Phase 024 / Item 7: Composite tool that runs session_resume
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:55:    preservesAuthority: 'session_bootstrap';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:102:    nextActions.add('Call `session_resume({ specFolder })` directly to inspect the detailed resume failure.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:114:    nextActions.add('Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:116:    nextActions.add('Run `code_graph_scan` if you need fresh structural context, then call `session_bootstrap()` again.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:118:    nextActions.add('If structural context matters for this task, run `code_graph_scan` and then re-run `session_bootstrap()`.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:123:    nextActions.add('Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` if you need a deeper state refresh.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:155:    preservesAuthority: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:163:/** Handle session_bootstrap tool call — one-call session setup */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:168:  // Sub-call 1: session_resume with full resume payload
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:179:    allHints.push('session_resume failed. Try calling it manually.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:195:  const structuralContext = buildStructuralBootstrapContract('session_bootstrap');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:198:      `Structural context is ${structuralContext.status}. Run code_graph_scan if needed, then re-run session_bootstrap.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:230:      'session_bootstrap expected session_resume to emit structural-context.structuralTrust.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:236:    { label: 'session_bootstrap structural context payload' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:243:      { label: 'session_bootstrap resume payload' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:306:      producer: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:307:      sourceSurface: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:320:    sourceSurface: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/ops/heal-session-ambiguity.sh:5:#            the memory-save pipeline (generate-context.js).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/ops/heal-session-ambiguity.sh:5:#            the memory-save pipeline (generate-context.js).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:400:/** Handle session_resume tool call — composite resume with memory + graph + cocoindex */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:402:  // F052: Record memory recovery metric for session_resume
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:416:        input: 'resume previous work continue session',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:472:  const structuralContext = buildStructuralBootstrapContract('session_resume');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:474:    hints.push(`Structural context is ${structuralContext.status}. Call session_bootstrap to refresh.`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:487:    logCachedSummaryDecision('session_resume', cachedSummaryDecision);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:570:      producer: 'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:571:      sourceSurface: 'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:580:    sourceSurface: 'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:400:/** Handle session_resume tool call — composite resume with memory + graph + cocoindex */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:402:  // F052: Record memory recovery metric for session_resume
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:416:        input: 'resume previous work continue session',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:472:  const structuralContext = buildStructuralBootstrapContract('session_resume');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:474:    hints.push(`Structural context is ${structuralContext.status}. Call session_bootstrap to refresh.`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:487:    logCachedSummaryDecision('session_resume', cachedSummaryDecision);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:570:      producer: 'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:571:      sourceSurface: 'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:580:    sourceSurface: 'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:4:// Phase 024 / Item 7: Composite tool that runs session_resume
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:55:    preservesAuthority: 'session_bootstrap';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:102:    nextActions.add('Call `session_resume({ specFolder })` directly to inspect the detailed resume failure.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:114:    nextActions.add('Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:116:    nextActions.add('Run `code_graph_scan` if you need fresh structural context, then call `session_bootstrap()` again.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:118:    nextActions.add('If structural context matters for this task, run `code_graph_scan` and then re-run `session_bootstrap()`.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:123:    nextActions.add('Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` if you need a deeper state refresh.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:155:    preservesAuthority: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:163:/** Handle session_bootstrap tool call — one-call session setup */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:168:  // Sub-call 1: session_resume with full resume payload
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:179:    allHints.push('session_resume failed. Try calling it manually.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:195:  const structuralContext = buildStructuralBootstrapContract('session_bootstrap');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:198:      `Structural context is ${structuralContext.status}. Run code_graph_scan if needed, then re-run session_bootstrap.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:230:      'session_bootstrap expected session_resume to emit structural-context.structuralTrust.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:236:    { label: 'session_bootstrap structural context payload' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:243:      { label: 'session_bootstrap resume payload' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:306:      producer: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:307:      sourceSurface: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:320:    sourceSurface: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:203:  preservesAuthority: 'session_bootstrap';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:325:    preservesAuthority: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:123:    hints.push('Structural context is stale. Call session_bootstrap to refresh, or run code_graph_scan for a full rescan.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:125:    hints.push('No structural context available. Call session_bootstrap first, then run code_graph_scan.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-subfolder-resolution.js:539:      '123-generate-context-subfolder',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-subfolder-resolution.js:929:    const { isValidSpecFolder } = require(path.join(DIST_DIR, 'memory', 'generate-context'));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-subfolder-resolution.js:971:  const outsideRoot = fs.mkdtempSync(path.join(require('os').tmpdir(), 'generate-context-outside-'));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-subfolder-resolution.js:979:    const { isValidSpecFolder } = require(path.join(DIST_DIR, 'memory', 'generate-context'));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:73:    expect(brief.startupSurface).toContain('- Note: this is a startup snapshot; later structural reads may differ if the repo state changed.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:110:    expect(brief.startupSurface).toContain('startup snapshot');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:317:    'handover.md': 'handover',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:38: * implementation-summary.md, research/research.md, handover.md.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:748:        'Use generate-context.js script to create memory files'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:542:            AND document_type IN ('spec', 'plan', 'tasks', 'checklist', 'decision_record', 'implementation_summary', 'research', 'handover')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:280:    const warning = 'Manual fallback save mode detected; standard generate-context template markers are missing.';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1269:> **Purpose:** Enable seamless session recovery after context compaction, crashes, or breaks.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:52:Usage: node generate-context.js [options] <input>
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:56:                    - JSON file mode: node generate-context.js data.json [spec-folder]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:65:  node generate-context.js /tmp/context-data.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:66:  node generate-context.js /tmp/context-data.json specs/001-feature/
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:67:  node generate-context.js /tmp/context-data.json .opencode/specs/001-feature/
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:68:  echo '{"specFolder":"specs/001-feature/"}' | node generate-context.js --stdin
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:69:  node generate-context.js --json '{"specFolder":"specs/001-feature/"}'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:540:      console.error('[generate-context] Failed to list spec folders:', errMsg);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:543:  console.error('\nUsage: node generate-context.js [--stdin [spec-folder-name] | --json <json> [spec-folder-name] | <data-file> [spec-folder-name]]\n');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:102:**Purpose**: Zero data loss on MCP server crash or context compaction.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:43:  sourceSurface: 'auto-prime' | 'session_bootstrap' | 'session_resume' | 'session_health';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:257:    recommendedAction = 'Call session_bootstrap first. Then run code_graph_scan if structural context is needed.';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:640:      "expectedResultDescription": "Should surface the generate-context.js script documentation and CLAUDE.md Memory Save Rule about using the script instead of the Write tool.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:641:      "notes": "Derived from \"generate-context\" trigger phrase in the memory save workflow documentation."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:224:  //   recovery (0.20)      — A memory_context({ mode: "resume" }) call is the most
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:911:    ? /[/\\](?:spec|plan|checklist|tasks|decision-record|implementation-summary|research|handover)\.md$/i.test(options.filePath)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:911:    ? /[/\\](?:spec|plan|checklist|tasks|decision-record|implementation-summary|research|handover)\.md$/i.test(options.filePath)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:198:  let toolCalls = 1; // session_bootstrap
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/session-enrichment.vitest.ts:169:            command: "node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js .opencode/specs/00--anobel.com/036-hero-contact-success",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/README.md:38:- `generate-context.ts` - generate memory output from spec folder or JSON input with content-aware candidate selection
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/README.md:59:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/<###-spec-name>
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/README.md:67:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"sessionSummary":"...","specFolder":"..."}' specs/NNN-name
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/nested-changelog.vitest.ts:150:| mcp_server/tool-schemas.ts | Modified | Added output schema for session_bootstrap |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:317:    'handover.md': 'handover',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:40:describe('generate-context CLI authority', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:58:    process.argv = ['node', path.join('scripts', 'dist', 'memory', 'generate-context.js'), dataFile, explicitSpecFolder];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:60:    const { main } = await import('../memory/generate-context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:82:      path.join('scripts', 'dist', 'memory', 'generate-context.js'),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:89:    const { main } = await import('../memory/generate-context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:114:    const { main } = await import('../memory/generate-context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:140:    const { main } = await import('../memory/generate-context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:167:    const { main } = await import('../memory/generate-context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:203:    const { main } = await import('../memory/generate-context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:219:    const { main } = await import('../memory/generate-context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:234:    const { main } = await import('../memory/generate-context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:249:    const { main } = await import('../memory/generate-context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:264:      await import('../memory/generate-context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:748:        'Use generate-context.js script to create memory files'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts:101:        'Implemented the shared insufficiency gate in both generate-context and memory_save, then wired the rejection payload so dry-run reports reasons and evidence counts before any write occurs.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts:106:      triggerPhrases: ['memory_save', 'dry run', 'insufficient context', 'generate-context'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-bug-fixes.js:82:      path.join(ROOT, 'scripts', 'dist', 'memory', 'generate-context.js'),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:640:      "expectedResultDescription": "Should surface the generate-context.js script documentation and CLAUDE.md Memory Save Rule about using the script instead of the Write tool.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:641:      "notes": "Derived from \"generate-context\" trigger phrase in the memory save workflow documentation."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/scripts-registry.json:8:      "name": "generate-context",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/scripts-registry.json:9:      "path": "scripts/dist/memory/generate-context.js",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/scripts-registry.json:458:      "memory": ["generate-context", "cleanup-orphaned-vectors", "test-embeddings-factory"],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:198:  let toolCalls = 1; // session_bootstrap
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-save-title-description-override.vitest.ts:67:      const { main } = await import('../memory/generate-context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-save-title-description-override.vitest.ts:115:      const { main } = await import('../memory/generate-context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:41:| **8 Spec Document Types** | `spec`, `plan`, `tasks`, `checklist`, `decision_record`, `implementation_summary`, `research`, `handover` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:374:  | 'handover'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:398:  { filePattern: /(?:^|\/)handover\.md$/i,                documentType: 'handover',                memoryType: 'episodic',    defaultImportanceTier: 'normal',    defaultImportanceWeight: 0.5 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:416:    handover: 'handover.md',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:118:  'handover.md',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:129:  handover: 'normal',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:143:  handover: 'general',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:662:    case 'handover.md':
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:663:      return 'handover';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:676:    /\/specs\/(.+?)\/(?:(?:spec|plan|tasks|checklist|decision-record|implementation-summary|handover)\.md|research\/research\.md|research\.md)$/i
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:118:  'handover.md',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:129:  handover: 'normal',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:143:  handover: 'general',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:662:    case 'handover.md':
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:663:      return 'handover';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:676:    /\/specs\/(.+?)\/(?:(?:spec|plan|tasks|checklist|decision-record|implementation-summary|handover)\.md|research\/research\.md|research\.md)$/i
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts:13:  'handover.md',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/README.md:52:| `handover.md` | Session handover template |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/README.md:84:- Memory context is saved via `../scripts/dist/memory/generate-context.js`, never manual file creation.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/README.md:26:The `core/` directory contains orchestration modules used by `dist/memory/generate-context.js`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/copilot-hook-wiring.vitest.ts:32:    expect(output).toContain('Note: this is a startup snapshot; later structural reads may differ if the repo state changed.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/context_template.md:108:     - "Memory files MUST use generate-context.js script"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/context_template.md:189:**Quick resume context for session continuation and handover.**
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/context_template.md:328:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js {{SPEC_FOLDER}} --force
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/context_template.md:341:5. **Resume with handover prompt** - Use continuation template above
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/context_template.md:532:  - CONTINUE_SESSION section for quick resume and handover
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:2841:  log('\n🔬 MEMORY: generate-context.js');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:2848:    } = require(path.join(SCRIPTS_DIR, 'memory', 'generate-context'));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/post-save-render-round-trip.vitest.ts:110:      const { main } = await import('../memory/generate-context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:129:      return ['[session] Context quality is CRITICAL. Consider running `memory_context({ mode: "resume" })` or `session_health` to diagnose.'];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:132:      return ['[session] Context quality is degraded. Session may benefit from a `session_resume` call.'];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:129:      return ['[session] Context quality is CRITICAL. Consider running `memory_context({ mode: "resume" })` or `session_health` to diagnose.'];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:132:      return ['[session] Context quality is degraded. Session may benefit from a `session_resume` call.'];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/README.md:70:  - `generate-context-cli-authority.vitest.ts`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/README.md:168:- Direct CLI authority coverage for explicit spec-folder saves through the real `generate-context -> runWorkflow` seam.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1018:        '  - If using generate-context.js, ensure extractors/collect-session-data.js exports collectSessionData'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/rules/check-toc-policy.sh:32:        "handover.md"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/rules/check-toc-policy.sh:63:        RULE_REMEDIATION="Remove '## TABLE OF CONTENTS' / '## TOC' sections from spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, handover.md, and debug-delegation.md. Only research/research.md may include a TOC."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/rules/check-toc-policy.sh:32:        "handover.md"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/rules/check-toc-policy.sh:63:        RULE_REMEDIATION="Remove '## TABLE OF CONTENTS' / '## TOC' sections from spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, handover.md, and debug-delegation.md. Only research/research.md may include a TOC."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/types/session-types.ts:177:  // (AI-composed JSON data from generate-context.js input)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/memory/README.md:7:  - "generate-context"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/memory/README.md:40:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js <spec-folder-or-json-input>
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/memory/README.md:50:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/system-spec-kit
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/memory/README.md:53:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --recovery 003-parent/001-child
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/memory/README.md:56:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --recovery 001-child-name
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/memory/README.md:59:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/memory/README.md:80:- `../../scripts/dist/memory/generate-context.js`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:111:The scoring layer includes document-type multipliers for active document types (for example `spec`, `plan`, `tasks`, `checklist`, `decision-record`, `implementation-summary`, `memory`, `constitutional`, `research`, `handover`, `scratch`). These multipliers are used by folder scoring and document retrieval ranking.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:5:// contracts to OpenCode-oriented startup, message, and compaction blocks.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:37:  compaction?: OpenCodeTransportBlock;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:77:    'Note: this is a startup snapshot; later structural reads may differ if the repo state changed.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:87:  compactionPayload?: SharedPayloadEnvelope | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:95:    args.compactionPayload?.kind,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:102:  const compactionPayload = args.compactionPayload ?? args.resumePayload ?? args.bootstrapPayload ?? null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:140:    ...(compactionPayload
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:142:        compaction: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:145:          payloadKind: compactionPayload.kind,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:146:          dedupeKey: `compaction:${compactionPayload.kind}`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:148:            compactionPayload,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:149:            'Inject this as the continuity note across compaction. Keep it separate from current-turn retrieval.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:111:The scoring layer includes document-type multipliers for active document types (for example `spec`, `plan`, `tasks`, `checklist`, `decision-record`, `implementation-summary`, `memory`, `constitutional`, `research`, `handover`, `scratch`). These multipliers are used by folder scoring and document retrieval ranking.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/rules/README.md:305:- `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, `handover.md`, `debug-delegation.md`: ToC forbidden
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/rules/README.md:305:- `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, `handover.md`, `debug-delegation.md`: ToC forbidden
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:5:// shared by startup, recovery, and compaction surfaces.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:12:  | 'compaction';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:157:    | 'session_resume'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:159:    | 'session_bootstrap'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:249:  handover: 1.0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:249:  handover: 1.0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/importance-tiers.ts:223:    handover: 'normal',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/importance-tiers.ts:223:    handover: 'normal',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-integration.vitest.ts:326:  it('confirms generate-context.js compiled entrypoint exists', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-integration.vitest.ts:327:    // W1-T3 parity: compiled generate-context must be present for CLI invocation
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-integration.vitest.ts:328:    const generateContextPath = path.join(SCRIPTS_DIR, 'dist', 'memory', 'generate-context.js');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/rules/check-spec-doc-integrity.sh:103:        if [[ "$filename" == handover*.md ]]; then
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/rules/check-spec-doc-integrity.sh:128:        RULE_MESSAGE="Spec doc references, metadata, and handover targets resolve cleanly"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/rules/check-spec-doc-integrity.sh:133:        RULE_REMEDIATION="Fix missing markdown references, align Spec Folder metadata to the actual folder name, and ensure handover spec/resume targets resolve to real paths."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/rules/check-spec-doc-integrity.sh:103:        if [[ "$filename" == handover*.md ]]; then
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/rules/check-spec-doc-integrity.sh:128:        RULE_MESSAGE="Spec doc references, metadata, and handover targets resolve cleanly"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/rules/check-spec-doc-integrity.sh:133:        RULE_REMEDIATION="Fix missing markdown references, align Spec Folder metadata to the actual folder name, and ensure handover spec/resume targets resolve to real paths."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:50:    tools: ['memory_context', 'session_resume', 'session_bootstrap']
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:50:    tools: ['memory_context', 'session_resume', 'session_bootstrap']
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:281:  it('exercises session_resume, session_bootstrap, and session-prime against the frozen corpus via hook state', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:315:        sourceSurface: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:30:              producer: 'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:31:              sourceSurface: 'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:62:    sourceSurface: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:77:  it('uses the full session_resume payload and records full bootstrap telemetry', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:86:    expect(parsed.data.payloadContract.provenance.producer).toBe('session_bootstrap');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:98:      'Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:107:      recommendedAction: 'Call session_bootstrap to refresh structural context, or run code_graph_scan for a full rescan.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:108:      sourceSurface: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:121:    expect(parsed.data.nextActions).toContain('Call session_bootstrap to refresh structural context, or run code_graph_scan for a full rescan.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/SKILL.md:67:  - `memory/` → uses generate-context.js script
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/SKILL.md:69:  - `handover.md` → @handover agent only
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/SKILL.md:79:| `handover.md`         | "handover", "next session", "continue later", "pass context", "ending session", "save state", "multi-session", "for next AI"  | Suggest creating handover |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/SKILL.md:148:    "HANDOVER": {"weight": 4, "keywords": ["handover", "continue later", "next session", "pause"]},
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/SKILL.md:221:    "/spec_kit:handover": "HANDOVER",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/SKILL.md:487:- Tracking: Saves pass the target spec folder alongside structured JSON via the generate-context script
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/SKILL.md:511:- **MUST use:** `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/SKILL.md:526:The generate-context script supports nested spec folder paths (parent/child format):
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/SKILL.md:530:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"system-spec-kit/121-script-audit","sessionSummary":"..."}' system-spec-kit/121-script-audit
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/SKILL.md:533:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"121-script-audit","sessionSummary":"..."}' 121-script-audit
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/SKILL.md:536:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"specs/system-spec-kit/121-script-audit","sessionSummary":"..."}' specs/system-spec-kit/121-script-audit
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/SKILL.md:539:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"system-spec-kit","sessionSummary":"..."}' system-spec-kit
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/SKILL.md:623:- **Document-type scoring** — 10 indexed document types with multipliers: spec (1.4x), plan (1.3x), constitutional (2.0x), decision_record (1.4x), tasks (1.1x), implementation_summary (1.1x), scratch (0.6x), checklist (1.0x), handover (1.0x), memory (1.0x). README files and skill-doc trees (`sk-*`, including `references/` and `assets/`) are excluded from memory indexing.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/SKILL.md:631:- **Indexing persistence** — After `generate-context.js`, call `memory_index_scan()` or `memory_save()` for immediate MCP visibility
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/SKILL.md:753:**Claude lifecycle flow:** PreCompact → cache → SessionStart(compact) → inject cached context. On startup, the shared startup snapshot covers memory continuity, code-graph state, CocoIndex availability, and an explicit note that later structural reads may differ if the repo state changed. On resume, the runtime loads prior session state.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/SKILL.md:755:**Cross-runtime handling:** Claude and Gemini use SessionStart hook scripts. OpenCode has a transport/plugin implementation, but operationally should still be treated as bootstrap-first when startup surfacing is unavailable. Codex remains bootstrap-based through its session-start agent bootstrap (not a native SessionStart hook). Copilot startup context depends on local hook configuration or wrapper wiring when present. Use `session_bootstrap()` for fresh start or after `/clear`, `session_resume()` for reconnect-style recovery when bootstrap is unnecessary, and `session_health()` only to re-check drift or readiness mid-session.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/SKILL.md:772:**Architecture:** CocoIndex (semantic, external MCP) finds code by concept. Code Graph (structural, this system) maps imports, calls, hierarchy. Memory (session, existing MCP) preserves decisions. The compact-merger combines all three under a 4000-token budget for compaction injection.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/SKILL.md:801:| `session_resume` | Combined memory + code graph + CocoIndex resume in one call |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/SKILL.md:802:| `session_bootstrap` | Complete session bootstrap (resume + health) in one call |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/SKILL.md:822:11. **Suggest handover.md on session-end keywords** - "continue later", "next session"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/SKILL.md:825:14. **Suggest /spec_kit:handover when session-end keywords detected OR after extended work (15+ tool calls)** - Proactive context preservation
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/SKILL.md:842:9. **Add ToC sections to standard spec artifacts** - `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, `handover.md`, and `debug-delegation.md` must not contain ToC headings
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/SKILL.md:884:- [ ] Context saved via `generate-context.js` script (NEVER manual Write/Edit)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/SKILL.md:941:| Save context | `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/007-feature/` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/SKILL.md:969:| Memory gen        | runtime `scripts/dist/memory/generate-context.js` (source: `scripts/memory/generate-context.ts`) | Memory file creation              |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/README.md:3:Core implementation for the structural code graph system. Provides file parsing, SQLite storage, graph queries, CocoIndex bridge, budget allocation, and compaction merging.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/README.md:16:| `compact-merger.ts` | 3-source merge (Memory + Code Graph + CocoIndex) for compaction |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/README.md:26:The compact-merger combines all three under a 4000-token budget for compaction injection.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/README.md:3:Core implementation for the structural code graph system. Provides file parsing, SQLite storage, graph queries, CocoIndex bridge, budget allocation, and compaction merging.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/README.md:16:| `compact-merger.ts` | 3-source merge (Memory + Code Graph + CocoIndex) for compaction |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/README.md:26:The compact-merger combines all three under a 4000-token budget for compaction injection.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/working-set-tracker.ts:4:// Tracks files and symbols accessed during a session for compaction
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/working-set-tracker.ts:4:// Tracks files and symbols accessed during a session for compaction
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:81:      { path: '/project/.opencode/specs/003/100-feature/handover.md', expected: 'handover', label: 'handover.md in specs/' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:136:      expect(types).toContain('handover');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:187:      'decision-record.md', 'implementation-summary.md', 'research.md', 'handover.md',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:214:      { path: '/p/.opencode/specs/003/100/handover.md', expected: 'handover', label: 'handover.md' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:363:    it('handover -> 0.5', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:364:      expect(calculateDocumentWeight('/p/specs/x/handover.md', 'handover')).toBe(0.5);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:402:        'implementation_summary', 'checklist', 'handover',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:416:    it('handover: 1.0', () => expect(DOCUMENT_TYPE_MULTIPLIERS.handover).toBe(1.0));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:744:    it('handover -> normal', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:745:      expect(getDefaultTierForDocumentType('handover')).toBe('normal');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts:1249:      console.error('\nUsage: node generate-context.js [spec-folder-name] OR node generate-context.js <data-file> [spec-folder]\n');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:125:    '- Note: this is a startup snapshot; later structural reads may differ if the repo state changed.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:125:    '- Note: this is a startup snapshot; later structural reads may differ if the repo state changed.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:199:node scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/<###-feature-name>/
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:201:node scripts/dist/memory/generate-context.js /tmp/save-context-data.json .opencode/specs/<###-feature-name>/
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:213:node scripts/dist/memory/generate-context.js /tmp/context.json specs/<###-feature-name>/
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:216:node scripts/dist/memory/generate-context.js 003-parent/001-child
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:219:node scripts/dist/memory/generate-context.js .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/012-code-audit-per-feature-catalog/021-remediation-revalidation
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:260:# Test with actual generate-context script (which uses these utilities)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:261:node scripts/dist/memory/generate-context.js --help
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:276:| [scripts/memory/generate-context.ts](../memory/generate-context.ts)                        | Main memory save script that uses these utilities |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:5:// into a unified compact brief for compaction injection.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:192:      kind: 'compaction',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:208:        sourceSurface: 'compaction',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:20:        ? 'session_bootstrap'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:22:          ? 'session_resume'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:50:    expect(plan.systemTransform?.content).toContain('startup snapshot');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:53:    expect(plan.compaction?.hook).toBe('experimental.session.compacting');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:5:// into a unified compact brief for compaction injection.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:192:      kind: 'compaction',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:208:        sourceSurface: 'compaction',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/configs/README.md:42:- `documentTypeMultipliers`: active scoring reference for 10 document types (spec, decision_record, plan, tasks, implementation_summary, checklist, handover, memory, constitutional, scratch).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/configs/README.md:54:Important: feature-flag and shared-memory enablement checks are resolved at runtime in helper functions such as `isSharedMemoryEnabled()` and the various `is*Enabled()` lookups under `lib/` and `handlers/`; do not treat this folder as a frozen startup snapshot of MCP behavior.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-ops-hardening.vitest.ts:19:      sourceSurface: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:75:      ? 'Run code_graph_scan or session_bootstrap before relying on structural context.'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:76:      : 'Run session_bootstrap first, then code_graph_scan if structural context is required.';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:75:      ? 'Run code_graph_scan or session_bootstrap before relying on structural context.'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:76:      : 'Run session_bootstrap first, then code_graph_scan if structural context is required.';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/configs/search-weights.json:15:    "handover": 1.0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/README.md:58:| **Document-Type Scoring** | Document-aware ranking supports spec lifecycle docs (spec/plan/tasks/checklist/decision-record/implementation-summary/research/handover) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/README.md:58:| **Document-Type Scoring** | Document-aware ranking supports spec lifecycle docs (spec/plan/tasks/checklist/decision-record/implementation-summary/research/handover) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:253:  hookName: 'tool-dispatch' | 'compaction' | 'memory-aware'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:368:  hookName: 'tool-dispatch' | 'compaction' | 'memory-aware' = 'memory-aware'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:460:    recommendedCalls.push('memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:626: * Fires at session compaction lifecycle points. Surfaces memories relevant
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:628: * across the compaction boundary.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:656:  return autoSurfaceMemories(sessionContext.trim(), COMPACTION_TOKEN_BUDGET, 'compaction');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:50:      content: 'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:61:      content: 'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:77:      content: 'Context was compacted and auto-recovered from the cached compact brief. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:185:      content: `Last active spec folder: ${state.lastSpecFolder}\nCall \`memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })\` for full context.`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:190:      content: 'Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` to restore session state.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC4-importance-tier.json:24:    "Replay the fixture through generate-context.js and confirm tier parity"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:7:/** Token budget for compaction context injection */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:41:    resolve(HOOK_DIR, '../../../scripts/dist/memory/generate-context.js'),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:42:    resolve(HOOK_DIR, '../../../../scripts/dist/memory/generate-context.js'),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:43:    resolve(process.cwd(), '.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js'),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:44:    resolve(process.cwd(), 'scripts/dist/memory/generate-context.js'),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:71:    hookLog('warn', 'session-stop', 'Auto-save skipped: generate-context.js not found');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:149:        ? 'Recovered compact transcript lines were removed before fallback compaction cache assembly.'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:150:        : 'No recovered compact transcript lines detected in fallback compaction cache assembly.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:163:        kind: 'compaction',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:170:        summary: 'Fallback compaction cache assembled from sanitized transcript tail',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:51:      content: 'Context was compressed. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:62:      content: 'Context was compressed. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:73:      content: 'Context was compressed and auto-recovered. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:149:      content: `Last active spec folder: ${state.lastSpecFolder}\nCall \`memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })\` for full context.`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:155:    content: 'Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` to restore session state.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:144:  it('preserves separate trust axes through real session_resume and session_bootstrap outputs', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:190:        sourceSurface: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:63:    'Context was compressed and auto-recovered. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:564:  inputSchema: { type: 'object', additionalProperties: false, properties: { specFolder: { type: 'string', description: 'Limit scan to specific spec folder (e.g., "005-memory")' }, force: { type: 'boolean', default: false, description: 'Force re-index all files (ignore content hash)' }, includeConstitutional: { type: 'boolean', default: true, description: 'Whether to scan .opencode/skill/*/constitutional/ directories' }, includeSpecDocs: { type: 'boolean', default: true, description: 'Whether to scan .opencode/specs/ directories for spec folder documents (spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, research/research.md, handover.md). Iteration artifacts under research/iterations/ and review/iterations/ are excluded from spec-doc indexing. Set SPECKIT_INDEX_SPEC_DOCS=false env var to disable globally.' }, incremental: { type: 'boolean', default: true, description: 'Enable incremental indexing. When true (default), skips files whose mtime and content hash are unchanged since last index. Set to false to re-evaluate all files regardless of change detection.' } }, required: [] },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:740:  name: 'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:741:  description: '[L1:Orchestration] Resume session with combined memory, code graph, and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. For the canonical first-call recovery path on session start or after /clear, prefer session_bootstrap. Use minimal: true to skip the heavy memory context call and return code graph, CocoIndex, structural context, hints, and session-quality metadata without the full memory payload.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:755:  name: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:756:  description: '[L1:Orchestration] Complete session bootstrap in one call. Returns session context, system health, structural readiness, and recommended next actions. This is the canonical first recovery call on session start or after /clear; it wraps the full session_resume payload plus session_health.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:768:      resume: { type: 'object', description: 'Merged session_resume payload (spec folder, task status, memory context)' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:4:// - autoSurfaceAtCompaction:   fires at session compaction lifecycle point
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:300:  it('fires matcher once at tool-dispatch and once at compaction lifecycle points', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:305:    await autoSurfaceAtCompaction('compaction lifecycle context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:309:    expect(matchSpy).toHaveBeenNthCalledWith(2, 'compaction lifecycle context', 5);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:569:  it('compaction hook also enforces result limit via matchTriggerPhrases', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:609:  it('compaction output boundary enforces estimated token budget', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:622:    const result = await autoSurfaceAtCompaction('compaction context for budget enforcement');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:698:    await autoSurfaceAtCompaction('compaction session context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:743:describe('compaction pipeline integration', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:40:        compaction: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:44:          dedupeKey: 'compaction:resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:45:          content: 'Summary: compaction note',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:145:          tool: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:164:  it('adds a compaction note and invalidates cache on session events', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/trigger-extractor.vitest.ts:20:      a compaction cycle. The compaction cycle moves live objects to reduce
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:176:        sourceSurface: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:66:    expect(parsed.data.payloadContract.provenance.producer).toBe('session_resume');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:576:          input: 'resume previous work on memory quality',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:655:          input: 'resume previous work on memory quality',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:137:| Codex | `.codex/config.toml` | Checked-in MCP config. Bootstrap parity via `session_bootstrap` MCP tool, not a native SessionStart hook. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:437:- `session_bootstrap` (complete session bootstrap)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:438:- `session_resume` (combined session resume)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:620:Routes retrieval requests through per-type strategies based on the artifact being queried. Supports 8 artifact types: `spec`, `plan`, `checklist`, `decision-record`, `memory`, `implementation-summary`, `research` and `handover`. Each type applies its own indexing and ranking rules (for example, `memory` uses recency-weighted scoring while `decision-record` boosts causal edges).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:681:**Behind the scenes:** The AI calls `memory_context()` with `mode: "resume"` and `anchors: ["state", "next-steps"]`, then returns the previous session state.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:535:**Architecture:** CocoIndex (semantic, external MCP) finds code by concept. Code Graph (structural, this server) maps imports, calls and hierarchy. Memory (session, this server) preserves decisions. The compact-merger combines all three under a 4000-token budget for compaction injection.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:545:**Startup/recovery surfaces:** `session_resume`, `session_bootstrap`, and the startup brief now report freshness-aware graph status instead of count-only health. Startup surfaces are intentionally non-mutating snapshots, so later structural reads may still differ if repo state changes.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:599:##### `session_resume`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:601:Resume session with combined memory, code graph and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. The response carries freshness-aware code-graph status (`fresh`, `stale`, `empty`, `error`) instead of count-only health. For the canonical first-call recovery path on session start or after `/clear`, prefer `session_bootstrap`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:610:##### `session_bootstrap`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:612:Complete session bootstrap in one call. This is the canonical first-call recovery step on session start or after `/clear`. It wraps the full `session_resume` payload plus `session_health` and returns context, health, structural readiness and recommended next actions. Startup/bootstrap surfaces are freshness-aware but non-mutating; use `code_graph_scan` when readiness shows an empty or broad full-scan state.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1227:├── hooks/                     # Session-start/compaction surfacing, mutation feedback, token-count sync
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1347:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/005-auth
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1535:| Resume a session from scratch | `session_bootstrap` | Use as the first recovery call on session start or after `/clear` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1536:| Inspect the detailed merged resume payload | `session_resume` | Use when you want direct resume details without the full bootstrap wrapper |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:451:  session_bootstrap: getSchema({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:455:  session_resume: getSchema({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:495:  session_bootstrap: ['specFolder'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:497:  session_resume: ['specFolder', 'minimal'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:41:| **8 Spec Document Types** | `spec`, `plan`, `tasks`, `checklist`, `decision_record`, `implementation_summary`, `research`, `handover` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:374:  | 'handover'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:398:  { filePattern: /(?:^|\/)handover\.md$/i,                documentType: 'handover',                memoryType: 'episodic',    defaultImportanceTier: 'normal',    defaultImportanceWeight: 0.5 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:416:    handover: 'handover.md',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:80:    const contract = buildStructuralBootstrapContract('session_bootstrap');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:86:    expect(contract.sourceSurface).toBe('session_bootstrap');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:103:    const contract = buildStructuralBootstrapContract('session_resume');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:108:    expect(contract.recommendedAction).toContain('session_bootstrap');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:109:    expect(contract.sourceSurface).toBe('session_resume');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:140:    const surfaces = ['auto-prime', 'session_bootstrap', 'session_resume', 'session_health'] as const;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:164:    const contract = buildStructuralBootstrapContract('session_bootstrap');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts:13:  'handover.md',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/README.md:50:- `memory/` - 8 TypeScript/JS CLIs (`generate-context.ts`, `rank-memories.ts`, `cleanup-orphaned-vectors.ts`, `validate-memory-quality.ts`, `reindex-embeddings.ts`, `ast-parser.ts`, `backfill-frontmatter.ts`, `rebuild-auto-entities.ts`)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/README.md:107:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/<###-spec-name>
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/README.md:115:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/<###-spec-name>
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:212:describe('session_bootstrap authority preservation', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:249:                  producer: 'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:250:                  sourceSurface: 'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:281:        sourceSurface: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:291:      preservesAuthority: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:296:      'Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:61:  'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:62:  'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:82:    case 'session_resume':             return handleSessionResume(parseArgs<SessionResumeArgs>(validateToolArgs('session_resume', args)));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:83:    case 'session_bootstrap':          return handleSessionBootstrap(parseArgs<SessionBootstrapArgs>(validateToolArgs('session_bootstrap', args)));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/validation-utils.ts:80:    console.warn(`[generate-context] Anchor validation warnings in ${filename}:`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:5:// contracts to OpenCode-oriented startup, message, and compaction blocks.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:37:  compaction?: OpenCodeTransportBlock;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:77:    'Note: this is a startup snapshot; later structural reads may differ if the repo state changed.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:87:  compactionPayload?: SharedPayloadEnvelope | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:95:    args.compactionPayload?.kind,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:102:  const compactionPayload = args.compactionPayload ?? args.resumePayload ?? args.bootstrapPayload ?? null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:140:    ...(compactionPayload
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:142:        compaction: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:145:          payloadKind: compactionPayload.kind,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:146:          dedupeKey: `compaction:${compactionPayload.kind}`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:148:            compactionPayload,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:149:            'Inject this as the continuity note across compaction. Keep it separate from current-turn retrieval.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:5:// shared by startup, recovery, and compaction surfaces.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:12:  | 'compaction';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:157:    | 'session_resume'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:159:    | 'session_bootstrap'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/prompt-utils.ts:23:  console.error('  node generate-context.js /tmp/save-context-data.json <spec-folder-path>');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/prompt-utils.ts:26:  console.error('  node generate-context.js --json \'{"specFolder":"specs/003-memory-and-spec-kit/054-remaining-bugs-remediation"}\' specs/003-memory-and-spec-kit/054-remaining-bugs-remedation');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/prompt-utils.ts:40:    console.warn('[generate-context] Non-interactive mode: using default value');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/prompt-utils.ts:72:    console.warn(`[generate-context] Non-interactive mode: using default choice 1`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:73:    expect(brief.startupSurface).toContain('- Note: this is a startup snapshot; later structural reads may differ if the repo state changed.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:110:    expect(brief.startupSurface).toContain('startup snapshot');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:12:  provenance: ['session_resume'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:54:        provenance: ['session_resume', 'session_resume'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:60:describe('session_resume certainty contract', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:118:        sourceSurface: 'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:150:describe('session_bootstrap certainty contract', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:187:                  producer: 'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:188:                  sourceSurface: 'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:219:        sourceSurface: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:30:              producer: 'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:31:              sourceSurface: 'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:62:    sourceSurface: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:77:  it('uses the full session_resume payload and records full bootstrap telemetry', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:86:    expect(parsed.data.payloadContract.provenance.producer).toBe('session_bootstrap');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:98:      'Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:107:      recommendedAction: 'Call session_bootstrap to refresh structural context, or run code_graph_scan for a full rescan.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:108:      sourceSurface: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:121:    expect(parsed.data.nextActions).toContain('Call session_bootstrap to refresh structural context, or run code_graph_scan for a full rescan.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/configs/README.md:42:- `documentTypeMultipliers`: active scoring reference for 10 document types (spec, decision_record, plan, tasks, implementation_summary, checklist, handover, memory, constitutional, scratch).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/configs/README.md:54:Important: feature-flag and shared-memory enablement checks are resolved at runtime in helper functions such as `isSharedMemoryEnabled()` and the various `is*Enabled()` lookups under `lib/` and `handlers/`; do not treat this folder as a frozen startup snapshot of MCP behavior.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/compact-merger.vitest.ts:12:    triggered: 'Trigger: compaction recovery context',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/compact-merger.vitest.ts:45:      expect(result.payloadContract.kind).toBe('compaction');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/configs/search-weights.json:15:    "handover": 1.0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:22:  'tool-schemas.js': 880,           // actual: 862 — Expanded MCP schema set + Sprint 019: Zod schema integration, ingest tools, Phase 024 session_bootstrap, and newer graph/search tool contracts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:253:  hookName: 'tool-dispatch' | 'compaction' | 'memory-aware'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:368:  hookName: 'tool-dispatch' | 'compaction' | 'memory-aware' = 'memory-aware'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:460:    recommendedCalls.push('memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:626: * Fires at session compaction lifecycle points. Surfaces memories relevant
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:628: * across the compaction boundary.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:656:  return autoSurfaceMemories(sessionContext.trim(), COMPACTION_TOKEN_BUDGET, 'compaction');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:47:        producer: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:48:        sourceSurface: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:50:      content: 'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:61:      content: 'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:77:      content: 'Context was compacted and auto-recovered from the cached compact brief. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:185:      content: `Last active spec folder: ${state.lastSpecFolder}\nCall \`memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })\` for full context.`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:190:      content: 'Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` to restore session state.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:7:/** Token budget for compaction context injection */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:41:    resolve(HOOK_DIR, '../../../scripts/dist/memory/generate-context.js'),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:42:    resolve(HOOK_DIR, '../../../../scripts/dist/memory/generate-context.js'),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:43:    resolve(process.cwd(), '.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js'),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:44:    resolve(process.cwd(), 'scripts/dist/memory/generate-context.js'),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:71:    hookLog('warn', 'session-stop', 'Auto-save skipped: generate-context.js not found');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/copilot-hook-wiring.vitest.ts:32:    expect(output).toContain('Note: this is a startup snapshot; later structural reads may differ if the repo state changed.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:149:        ? 'Recovered compact transcript lines were removed before fallback compaction cache assembly.'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:150:        : 'No recovered compact transcript lines detected in fallback compaction cache assembly.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:163:        kind: 'compaction',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:170:        summary: 'Fallback compaction cache assembled from sanitized transcript tail',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:51:      content: 'Context was compressed. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:62:      content: 'Context was compressed. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:73:      content: 'Context was compressed and auto-recovered. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:149:      content: `Last active spec folder: ${state.lastSpecFolder}\nCall \`memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })\` for full context.`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:155:    content: 'Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` to restore session state.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:63:    'Context was compressed and auto-recovered. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:81:      { path: '/project/.opencode/specs/003/100-feature/handover.md', expected: 'handover', label: 'handover.md in specs/' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:136:      expect(types).toContain('handover');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:187:      'decision-record.md', 'implementation-summary.md', 'research.md', 'handover.md',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:214:      { path: '/p/.opencode/specs/003/100/handover.md', expected: 'handover', label: 'handover.md' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:363:    it('handover -> 0.5', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:364:      expect(calculateDocumentWeight('/p/specs/x/handover.md', 'handover')).toBe(0.5);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:402:        'implementation_summary', 'checklist', 'handover',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:416:    it('handover: 1.0', () => expect(DOCUMENT_TYPE_MULTIPLIERS.handover).toBe(1.0));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:744:    it('handover -> normal', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:745:      expect(getDefaultTierForDocumentType('handover')).toBe('normal');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:564:  inputSchema: { type: 'object', additionalProperties: false, properties: { specFolder: { type: 'string', description: 'Limit scan to specific spec folder (e.g., "005-memory")' }, force: { type: 'boolean', default: false, description: 'Force re-index all files (ignore content hash)' }, includeConstitutional: { type: 'boolean', default: true, description: 'Whether to scan .opencode/skill/*/constitutional/ directories' }, includeSpecDocs: { type: 'boolean', default: true, description: 'Whether to scan .opencode/specs/ directories for spec folder documents (spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, research/research.md, handover.md). Iteration artifacts under research/iterations/ and review/iterations/ are excluded from spec-doc indexing. Set SPECKIT_INDEX_SPEC_DOCS=false env var to disable globally.' }, incremental: { type: 'boolean', default: true, description: 'Enable incremental indexing. When true (default), skips files whose mtime and content hash are unchanged since last index. Set to false to re-evaluate all files regardless of change detection.' } }, required: [] },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:740:  name: 'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:741:  description: '[L1:Orchestration] Resume session with combined memory, code graph, and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. For the canonical first-call recovery path on session start or after /clear, prefer session_bootstrap. Use minimal: true to skip the heavy memory context call and return code graph, CocoIndex, structural context, hints, and session-quality metadata without the full memory payload.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:755:  name: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:756:  description: '[L1:Orchestration] Complete session bootstrap in one call. Returns session context, system health, structural readiness, and recommended next actions. This is the canonical first recovery call on session start or after /clear; it wraps the full session_resume payload plus session_health.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:768:      resume: { type: 'object', description: 'Merged session_resume payload (spec folder, task status, memory context)' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:20:        ? 'session_bootstrap'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:22:          ? 'session_resume'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:50:    expect(plan.systemTransform?.content).toContain('startup snapshot');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:53:    expect(plan.compaction?.hook).toBe('experimental.session.compacting');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:66:    expect(parsed.data.payloadContract.provenance.producer).toBe('session_resume');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:200:      'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:201:      'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:303:      'session_health', 'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:322:      expect(sourceCode).not.toMatch(/name !== 'session_health' && name !== 'session_bootstrap'/)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1123:    it('T000g: memory_context resume mode invokes TM-05 compaction hook at runtime', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/document-helpers.ts:31:      handover: 0.5,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/document-helpers.ts:31:      handover: 0.5,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:80:    const contract = buildStructuralBootstrapContract('session_bootstrap');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:86:    expect(contract.sourceSurface).toBe('session_bootstrap');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:103:    const contract = buildStructuralBootstrapContract('session_resume');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:108:    expect(contract.recommendedAction).toContain('session_bootstrap');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:109:    expect(contract.sourceSurface).toBe('session_resume');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:140:    const surfaces = ['auto-prime', 'session_bootstrap', 'session_resume', 'session_health'] as const;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:164:    const contract = buildStructuralBootstrapContract('session_bootstrap');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:212:describe('session_bootstrap authority preservation', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:249:                  producer: 'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:250:                  sourceSurface: 'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:281:        sourceSurface: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:291:      preservesAuthority: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:296:      'Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/trigger-extractor.vitest.ts:20:      a compaction cycle. The compaction cycle moves live objects to reduce
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-ops-hardening.vitest.ts:19:      sourceSurface: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:47:        producer: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:48:        sourceSurface: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:200:      'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:201:      'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:303:      'session_health', 'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:322:      expect(sourceCode).not.toMatch(/name !== 'session_health' && name !== 'session_bootstrap'/)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1123:    it('T000g: memory_context resume mode invokes TM-05 compaction hook at runtime', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/compact-merger.vitest.ts:12:    triggered: 'Trigger: compaction recovery context',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/compact-merger.vitest.ts:45:      expect(result.payloadContract.kind).toBe('compaction');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:22:  'tool-schemas.js': 880,           // actual: 862 — Expanded MCP schema set + Sprint 019: Zod schema integration, ingest tools, Phase 024 session_bootstrap, and newer graph/search tool contracts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:12:  provenance: ['session_resume'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:54:        provenance: ['session_resume', 'session_resume'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:60:describe('session_resume certainty contract', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:118:        sourceSurface: 'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:150:describe('session_bootstrap certainty contract', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:187:                  producer: 'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:188:                  sourceSurface: 'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:219:        sourceSurface: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:576:          input: 'resume previous work on memory quality',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:655:          input: 'resume previous work on memory quality',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:176:        sourceSurface: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:4:// - autoSurfaceAtCompaction:   fires at session compaction lifecycle point
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:300:  it('fires matcher once at tool-dispatch and once at compaction lifecycle points', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:305:    await autoSurfaceAtCompaction('compaction lifecycle context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:309:    expect(matchSpy).toHaveBeenNthCalledWith(2, 'compaction lifecycle context', 5);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:569:  it('compaction hook also enforces result limit via matchTriggerPhrases', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:609:  it('compaction output boundary enforces estimated token budget', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:622:    const result = await autoSurfaceAtCompaction('compaction context for budget enforcement');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:698:    await autoSurfaceAtCompaction('compaction session context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:743:describe('compaction pipeline integration', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:144:  it('preserves separate trust axes through real session_resume and session_bootstrap outputs', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:190:        sourceSurface: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:40:        compaction: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:44:          dedupeKey: 'compaction:resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:45:          content: 'Summary: compaction note',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:145:          tool: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:164:  it('adds a compaction note and invalidates cache on session events', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts:1249:      console.error('\nUsage: node generate-context.js [spec-folder-name] OR node generate-context.js <data-file> [spec-folder]\n');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-subfolder-resolution.js:539:      '123-generate-context-subfolder',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-subfolder-resolution.js:929:    const { isValidSpecFolder } = require(path.join(DIST_DIR, 'memory', 'generate-context'));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-subfolder-resolution.js:971:  const outsideRoot = fs.mkdtempSync(path.join(require('os').tmpdir(), 'generate-context-outside-'));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-subfolder-resolution.js:979:    const { isValidSpecFolder } = require(path.join(DIST_DIR, 'memory', 'generate-context'));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:199:node scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/<###-feature-name>/
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:201:node scripts/dist/memory/generate-context.js /tmp/save-context-data.json .opencode/specs/<###-feature-name>/
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:213:node scripts/dist/memory/generate-context.js /tmp/context.json specs/<###-feature-name>/
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:216:node scripts/dist/memory/generate-context.js 003-parent/001-child
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:219:node scripts/dist/memory/generate-context.js .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/012-code-audit-per-feature-catalog/021-remediation-revalidation
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:260:# Test with actual generate-context script (which uses these utilities)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:261:node scripts/dist/memory/generate-context.js --help
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:276:| [scripts/memory/generate-context.ts](../memory/generate-context.ts)                        | Main memory save script that uses these utilities |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:40:describe('generate-context CLI authority', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:58:    process.argv = ['node', path.join('scripts', 'dist', 'memory', 'generate-context.js'), dataFile, explicitSpecFolder];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:60:    const { main } = await import('../memory/generate-context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:82:      path.join('scripts', 'dist', 'memory', 'generate-context.js'),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:89:    const { main } = await import('../memory/generate-context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:114:    const { main } = await import('../memory/generate-context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:140:    const { main } = await import('../memory/generate-context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:167:    const { main } = await import('../memory/generate-context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:203:    const { main } = await import('../memory/generate-context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:219:    const { main } = await import('../memory/generate-context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:234:    const { main } = await import('../memory/generate-context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:249:    const { main } = await import('../memory/generate-context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:264:      await import('../memory/generate-context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/README.md:50:- `memory/` - 8 TypeScript/JS CLIs (`generate-context.ts`, `rank-memories.ts`, `cleanup-orphaned-vectors.ts`, `validate-memory-quality.ts`, `reindex-embeddings.ts`, `ast-parser.ts`, `backfill-frontmatter.ts`, `rebuild-auto-entities.ts`)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/README.md:107:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/<###-spec-name>
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/README.md:115:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/<###-spec-name>
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/17--governance/05-constitutional-gate-enforcement-rule-pack.md:3:description: "Always-surface constitutional rule pack that keeps Spec Kit gate behavior visible through trigger phrases, gate cross-references, and continuation/compaction edge-case handling."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/17--governance/05-constitutional-gate-enforcement-rule-pack.md:19:In practice, this pack gives the memory system a compact "do not forget these rules" layer. The core gate-enforcement file is intentionally lean: it does not restate every gate in full, but instead keeps the most important trigger phrases, a gate cross-reference, quick-reference tables, and edge-case rules for continuation validation and compaction recovery. The companion constitutional README explains why this works operationally: constitutional memories are pinned to the top of search results, do not decay, and are designed to surface even when the user query is only loosely related.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/17--governance/05-constitutional-gate-enforcement-rule-pack.md:27:`gate-enforcement.md` is the operational rule surface. Its frontmatter declares `importanceTier: constitutional`, marks the content as a `decision`, and registers trigger phrases spanning file-modification intent, continuation cues, compaction/context-loss cues, completion claims, and memory-save requests. The body adds three practical overlays on top of the AGENTS contract: a gate cross-reference table, a continuation-validation workflow that cross-checks handoff messages against recent memory, and a quick-reference index that ties gate triggers back to their governing source.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/17--governance/05-constitutional-gate-enforcement-rule-pack.md:42:| `.opencode/skill/system-spec-kit/constitutional/gate-enforcement.md` | Constitutional memory | Always-surface rule file defining trigger phrases, gate cross-reference, continuation validation, compaction recovery, and quick-reference behavior |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts:101:        'Implemented the shared insufficiency gate in both generate-context and memory_save, then wired the rejection payload so dry-run reports reasons and evidence counts before any write occurs.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts:106:      triggerPhrases: ['memory_save', 'dry run', 'insufficient context', 'generate-context'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/validation-utils.ts:80:    console.warn(`[generate-context] Anchor validation warnings in ${filename}:`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-save-title-description-override.vitest.ts:67:      const { main } = await import('../memory/generate-context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-save-title-description-override.vitest.ts:115:      const { main } = await import('../memory/generate-context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/17-outsourced-agent-memory-capture.md:3:description: "Outsourced agent memory capture keeps external CLI save payloads aligned with the current `generate-context.js` contract. It enforces hard-fail validation for explicit JSON data files, persists `nextSteps` fields into memory observations, and now documents the post-010 save gates that can still reject a valid handback after normalization."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/17-outsourced-agent-memory-capture.md:10:Outsourced agent handback keeps external CLI save payloads aligned with the current `generate-context.js` contract. It enforces hard-fail validation for explicit JSON data files, persists `nextSteps` fields into memory observations, and now documents the post-010 save gates that can still reject a valid handback after normalization.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/prompt-utils.ts:23:  console.error('  node generate-context.js /tmp/save-context-data.json <spec-folder-path>');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/prompt-utils.ts:26:  console.error('  node generate-context.js --json \'{"specFolder":"specs/003-memory-and-spec-kit/054-remaining-bugs-remediation"}\' specs/003-memory-and-spec-kit/054-remaining-bugs-remedation');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/prompt-utils.ts:40:    console.warn('[generate-context] Non-interactive mode: using default value');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/prompt-utils.ts:72:    console.warn(`[generate-context] Non-interactive mode: using default choice 1`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:52:Usage: node generate-context.js [options] <input>
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:56:                    - JSON file mode: node generate-context.js data.json [spec-folder]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:65:  node generate-context.js /tmp/context-data.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:66:  node generate-context.js /tmp/context-data.json specs/001-feature/
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:67:  node generate-context.js /tmp/context-data.json .opencode/specs/001-feature/
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:68:  echo '{"specFolder":"specs/001-feature/"}' | node generate-context.js --stdin
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:69:  node generate-context.js --json '{"specFolder":"specs/001-feature/"}'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:540:      console.error('[generate-context] Failed to list spec folders:', errMsg);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:543:  console.error('\nUsage: node generate-context.js [--stdin [spec-folder-name] | --json <json> [spec-folder-name] | <data-file> [spec-folder-name]]\n');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/README.md:70:  - `generate-context-cli-authority.vitest.ts`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/README.md:168:- Direct CLI authority coverage for explicit spec-folder saves through the real `generate-context -> runWorkflow` seam.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-bug-fixes.js:82:      path.join(ROOT, 'scripts', 'dist', 'memory', 'generate-context.js'),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/README.md:38:- `generate-context.ts` - generate memory output from spec folder or JSON input with content-aware candidate selection
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/README.md:59:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/<###-spec-name>
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/README.md:67:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"sessionSummary":"...","specFolder":"..."}' specs/NNN-name
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/nested-changelog.vitest.ts:150:| mcp_server/tool-schemas.ts | Modified | Added output schema for session_bootstrap |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/01-dual-scope-memory-auto-surface.md:3:description: "Dual-scope memory auto-surface fires at tool dispatch and session compaction to re-inject critical memories outside explicit search."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/01-dual-scope-memory-auto-surface.md:10:Dual-scope memory auto-surface fires at tool dispatch and session compaction to re-inject critical memories outside explicit search.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/01-dual-scope-memory-auto-surface.md:18:Memory auto-surface hooks fire at two lifecycle points beyond explicit search: tool dispatch for non-memory-aware tools (using extracted context hints), and session compaction (when context is compressed, critical memories are re-injected).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/01-dual-scope-memory-auto-surface.md:37:| `mcp_server/tests/context-server.vitest.ts` | Tool-dispatch and compaction hook integration coverage |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/scripts-registry.json:8:      "name": "generate-context",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/scripts-registry.json:9:      "path": "scripts/dist/memory/generate-context.js",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/scripts-registry.json:458:      "memory": ["generate-context", "cleanup-orphaned-vectors", "test-embeddings-factory"],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:2841:  log('\n🔬 MEMORY: generate-context.js');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:2848:    } = require(path.join(SCRIPTS_DIR, 'memory', 'generate-context'));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/post-save-render-round-trip.vitest.ts:110:      const { main } = await import('../memory/generate-context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/08-constitutional-memory-end-to-end-lifecycle.md:33:- **Retrieval path 2: auto-surface hooks.** `hooks/memory-surface.ts` implements the second runtime path, which is separate from the main search pipeline. It runs around memory-aware tool usage and lifecycle hook points such as tool dispatch and compaction. That hook path always fetches constitutional memories, adds fast trigger-matched memories from the current context hint, and returns a compact `AutoSurfaceResult` payload only when something relevant exists. Hook-specific token budgets enforce bounded payload size, with truncation first removing triggered rows and then constitutional rows if necessary.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:288:When a session is interrupted by a crash, context compaction, timeout, or an ordinary cross-session handoff, this command reconstructs the most likely previous session state and routes the user to the best next step. It uses `memory_context` in resume mode as the primary interrupted-session recovery path, with a fallback chain through crash-recovery breadcrumbs, anchored memory search, and recent-candidate discovery.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:298:The recovery chain prioritizes: (1) fresh `handover.md` when present, (2) `memory_context` in resume mode, (3) `CONTINUE_SESSION.md` crash breadcrumb, (4) anchored `memory_search` for thin summaries, (5) `memory_list` for recent-candidate discovery, and (6) user confirmation as final fallback.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:627:The scanner discovers files from three sources: spec folder memory files (`specs/**/memory/*.md`), constitutional files (`.opencode/skill/*/constitutional/*.md`) and spec documents (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, `research/research.md`, `handover.md`). Canonical path deduplication prevents the same file from being indexed twice under different paths (the `specs/` vs `.opencode/specs/` symlink problem).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:2822:Stateless `generate-context.js` saves now enrich thin OpenCode-derived session data with spec-folder and git context before rendering, while keeping contamination defenses in place.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:3380:Memory auto-surface hooks fire at two lifecycle points beyond explicit search: tool dispatch for non-memory-aware tools (using extracted context hints), and session compaction (when context is compressed, critical memories are re-injected).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:3765:Phase 016 added structured JSON summary support to `generate-context.js`, including `toolCalls` and `exchanges` fields, file-backed JSON authority preservation, and Wave 2 hardening for decision confidence, truncated titles, `git_changed_file_count` stability, and template count preservation.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:3783:Phase 017 established the JSON-only save contract for `generate-context.js`. Dynamic session capture proved unreliable and has been removed. `--json` and `--stdin` are now the sole save paths.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:3879:Session capturing pipeline quality is the current reality-alignment feature for `009-perfect-session-capturing`. It covers the full shipped session-capture path for `generate-context.js`: (1) Part I hardening across session extraction, file writing, contamination filtering, alignment blocking, and config-driven limits; (2) spec-folder and git context enrichment for JSON-mode saves; (3) numeric quality-score calibration so thin saves score lower than rich ones; (4) one shared semantic sufficiency gate so aligned but under-evidenced memories fail explicitly instead of indexing; (5) one shared rendered-memory template contract so malformed ANCHOR/frontmatter output fails before write/index; (6) a fully refreshed canonical verification and manual-testing record; (7) JSON-only routine-save contract; (8) Wave 2 count/confidence hardening for decision confidence, truncated outcomes, and stable `git_changed_file_count` priority.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:4465:| `SPECKIT_INDEX_SPEC_DOCS` | `true` | boolean | `handlers/memory-index-discovery.ts` | Controls whether `memory_index_scan` indexes spec folder documents (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, `research/research.md`, `handover.md`). Set to `'false'` to skip spec docs. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/session-enrichment.vitest.ts:169:            command: "node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js .opencode/specs/00--anobel.com/036-hero-contact-success",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-integration.vitest.ts:326:  it('confirms generate-context.js compiled entrypoint exists', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-integration.vitest.ts:327:    // W1-T3 parity: compiled generate-context must be present for CLI invocation
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-integration.vitest.ts:328:    const generateContextPath = path.join(SCRIPTS_DIR, 'dist', 'memory', 'generate-context.js');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:281:  it('exercises session_resume, session_bootstrap, and session-prime against the frozen corpus via hook state', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:315:        sourceSurface: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/README.md:26:The `core/` directory contains orchestration modules used by `dist/memory/generate-context.js`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/19-post-save-quality-review.md:81:| `scripts/memory/generate-context.ts` | Script | CLI entrypoint; delegates save workflow to `workflow.ts` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/02-precompact-hook.md:3:description: "PreCompact hook precomputes critical context before Claude Code compaction and caches to temp file for later injection."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/02-precompact-hook.md:10:PreCompact hook precomputes critical context before Claude Code compaction and caches to temp file for later injection.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/02-precompact-hook.md:12:When a long conversation is about to be compressed, this hook reads the transcript tail, extracts active file paths and topics, builds a compact context payload within the 4000-token budget, and caches it in hook state for the SessionStart hook to pick up after compaction completes.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1018:        '  - If using generate-context.js, ensure extractors/collect-session-data.js exports collectSessionData'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/validation/phase_checklists.md:126:- [ ] Save context if significant progress: `/memory:save` or `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"...","sessionSummary":"..."}' specs/###-folder/`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/validation/phase_checklists.md:159:- [ ] Memory context saved: `/memory:save` or `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"...","sessionSummary":"..."}' specs/###-folder/`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/types/session-types.ts:177:  // (AI-composed JSON data from generate-context.js input)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/18-session-enrichment-and-alignment-guards.md:18:Captured-session `generate-context.js` saves now enrich thin OpenCode-derived session data with spec-folder and git context before rendering, while keeping contamination defenses in place.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/11-working-set-tracker.md:3:description: "Working-set tracker tracks files and symbols accessed during a session using recency-weighted scoring for compaction priority."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/11-working-set-tracker.md:10:Working-set tracker tracks files and symbols accessed during a session using recency-weighted scoring for compaction priority.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/config/environment_variables.md:108:| `DEBUG` | `false` | Enable debug logging in generate-context.ts |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/config/environment_variables.md:133:node scripts/dist/memory/generate-context.js --json '{"specFolder":"001-feature","sessionSummary":"..."}' specs/001-feature/
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/config/environment_variables.md:136:DEBUG=1 echo '{"specFolder":"001-feature","sessionSummary":"..."}' | node scripts/dist/memory/generate-context.js --stdin
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/18-session-resume-tool.md:3:description: "Composite MCP tool (session_resume) that merges memory resume context, code graph status, CocoIndex availability, and structural bootstrap hints into a detailed recovery payload."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/18-session-resume-tool.md:10:Composite MCP tool (session_resume) that merges memory resume context, code graph status, CocoIndex availability, and structural bootstrap hints into a single recovery payload.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/18-session-resume-tool.md:12:The session_resume handler performs three sub-calls: (1) `memory_context` with `mode=resume` and `profile=resume` to recover session state, (2) code graph database query for node/edge/file counts and last scan timestamp, and (3) CocoIndex binary availability check via filesystem probe. It also appends the shared structural ready/stale/missing contract from `session-snapshot.ts`, so callers can tell when a deeper refresh is needed. Results are merged into a `SessionResumeResult` with `memory`, `codeGraph`, `cocoIndex`, optional `structuralContext`, and `hints` fields. Failures in any sub-call are captured as error entries with recovery hints rather than failing the entire call. For the canonical first-call recovery step, use `session_bootstrap`; `session_resume` remains the detailed merged surface.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/18-session-resume-tool.md:32:| `mcp_server/tools/lifecycle-tools.ts` | Dispatch | Tool dispatch registration for session_resume |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md:92:| `SPECKIT_INDEX_SPEC_DOCS` | `true` | boolean | `handlers/memory-index-discovery.ts` | Controls whether `memory_index_scan` indexes spec folder documents (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, `research/research.md`, `handover.md`). Set to `'false'` to skip spec docs. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/config/hook_system.md:23:1. **PreCompact** — Fires before context compaction. Precomputes critical context (active files, topics, recent transcript) and caches to temp state file. Stdout is NOT injected.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/config/hook_system.md:50:Hook-capable runtimes include Claude Code, Codex CLI, Copilot CLI, Gemini CLI, and OpenCode. Claude Code, Codex CLI, Copilot CLI, and Gemini CLI use shell-script `session-prime.ts` hooks. OpenCode uses plugin-based hooks (`@opencode-ai/plugin` at `.opencode/plugins/spec-kit-compact-code-graph.js`). If hook context is unavailable in any runtime for any reason, fall back to the tool-based recovery path: `session_bootstrap()` on fresh start or after `/clear`, then `session_resume()` only when a detailed follow-up recovery payload is needed.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/config/hook_system.md:56:2. `memory_context({ mode: "resume", profile: "resume" })` — Continuation and compaction recovery core
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/config/hook_system.md:57:3. `session_bootstrap()` / `session_resume()` — Session-oriented wrappers that layer health and structural context around resume retrieval
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/05-cross-runtime-fallback.md:12:All runtimes now have hook or bootstrap-based startup injection. Claude Code, Codex CLI, Copilot CLI, and Gemini CLI use shell-script `session-prime.ts` hooks. OpenCode uses plugin-based hooks (`@opencode-ai/plugin` at `.opencode/plugins/spec-kit-compact-code-graph.js`). When hooks fail or are unavailable in any runtime, recover through the tool-based path starting with `session_bootstrap()` on fresh start or after `/clear`. Runtime detection identifies the active runtime and its current hook policy.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/structure/folder_routing.md:98:| 1    | Check CLI argument  | `node .opencode/.../scripts/dist/memory/generate-context.js data.json [spec-folder]` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/structure/folder_routing.md:165:These thresholds are defined in `generate-context.ts`:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/structure/folder_routing.md:236:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js data.json "006-opencode/014-stateless-alignment"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/structure/folder_routing.md:239:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js data.json "122-skill-standardization/002-api-refactor"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/structure/folder_routing.md:248:   node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/context.json "014-stateless-alignment"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/structure/folder_routing.md:341:AUTO_SAVE_MODE=true node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js data.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/structure/folder_routing.md:348:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js data.json "122-specific-folder"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/structure/folder_routing.md:510:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js data.json "122-feature/003-new-work"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/constitutional/README.md:147:├── gate-enforcement.md    # Edge cases (compaction, continuation) + gate cross-reference
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/constitutional/README.md:164:| `gate-enforcement.md` | Recommended | Edge cases (compaction, continuation) + gate cross-reference |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/constitutional/gate-enforcement.md:29:  - handover
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/constitutional/gate-enforcement.md:35:  - compaction
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/constitutional/gate-enforcement.md:37:  - context compaction
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/constitutional/gate-enforcement.md:54:> This file adds: compaction recovery, continuation validation, and trigger-based surfacing.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/constitutional/gate-enforcement.md:101:| Compaction Recovery     | Context loss / compaction   | **This file** |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/memory/memory_system.md:26:| Scripts | runtime `scripts/dist/memory/generate-context.js` (source: `scripts/memory/generate-context.ts`) | Memory file generation with ANCHOR format |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/memory/memory_system.md:48:- **Memory Files** — Session-specific context generated via `generate-context.js`. Subject to temporal decay.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/memory/memory_system.md:50:- **Spec Documents** — Discovered via `findSpecDocuments()` which walks both `specs/` and `.opencode/specs/`. Indexes spec folder documentation (specs, plans, tasks, checklists, decision records, implementation summaries, research, handovers) with per-type scoring multipliers. Controlled by `includeSpecDocs` parameter (default: `true`) or the `SPECKIT_INDEX_SPEC_DOCS` environment variable. Causal chains are created via `createSpecDocumentChain()` linking spec->plan->tasks->implementation_summary.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/memory/memory_system.md:104:| L1: Orchestration | `session_resume()` | Resume memory, code graph, and CocoIndex state in one call | Detailed recovery payload after reconnect, or when you want direct merged resume state |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/memory/memory_system.md:105:| L1: Orchestration | `session_bootstrap()` | Composite bootstrap combining resume and health checks | Canonical first tool call in a fresh OpenCode-style session or after `/clear` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/memory/memory_system.md:109:| L2: Core | `memory_save()` | Index a memory file. Re-generates embedding when **content hash** changes. Title-only changes do not trigger re-embedding. | After generate-context.js |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/memory/memory_system.md:688:- `scripts/dist/memory/generate-context.js` - Runtime memory-save entrypoint (compiled from `scripts/memory/generate-context.ts`)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/memory/trigger_config.md:394:- [generate-context.ts](../../scripts/memory/generate-context.ts) - Context generation script
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/ARCHITECTURE.md:174:`dist/` directories under `shared/`, `scripts/` and `mcp_server/` are generated build outputs produced from TypeScript sources via the build process (`tsc --build`). They can run at runtime, but they are not source-of-truth code or documentation and should not be committed to version control. Edit the authored `.ts` and `.md` files in package roots, then rebuild. Scripts or documentation that reference `dist/` files for execution (e.g., `node scripts/dist/memory/generate-context.js`) are referencing the generated runtime entry point, not canonical source.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/ARCHITECTURE.md:458:        codex["Codex bootstrap parity<br/>session_bootstrap() MCP tool"]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/ARCHITECTURE.md:504:    claude -->|"startup snapshot"| merger
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/ARCHITECTURE.md:505:    gemini -->|"startup snapshot"| merger
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/ARCHITECTURE.md:521:| `opencode-transport.ts` | `lib/context/` | Transport-only OpenCode startup/message/compaction block builder |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/ARCHITECTURE.md:528:| `compact-merger.ts` | `lib/code-graph/` | 3-source merge for compaction |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/ARCHITECTURE.md:561:| Startup or recovery state | Session surfaces | `session_bootstrap` / `session_resume` / startup surface |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/structure/sub_folder_versioning.md:202:<!-- ANCHOR:generate-context-js-integration -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/structure/sub_folder_versioning.md:203:## 9. generate-context.js Integration
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/structure/sub_folder_versioning.md:205:When using subfolder versioning, the memory save script (`generate-context.js`) fully supports nested paths.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/structure/sub_folder_versioning.md:236:<!-- /ANCHOR:generate-context-js-integration -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/memory/save_workflow.md:21:Direct phase-folder targets are supported. If the explicit CLI target resolves to a policy-defined phase folder, `generate-context.js` preserves that target and writes memory files into the selected phase folder's `memory/` directory.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/memory/save_workflow.md:63:│                    │ generate-context│                         │
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/memory/save_workflow.md:150:3. AI agent creates structured JSON summary (any agent can invoke generate-context.js for memory — this is an exception to the @speckit exclusivity rule)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/memory/save_workflow.md:151:4. AI agent calls `generate-context.js` with JSON data
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/memory/save_workflow.md:212:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js \
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/memory/save_workflow.md:217:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js \
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/memory/save_workflow.md:223:  node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --stdin
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/memory/save_workflow.md:245:| Script exists      | `test -f .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js` | Check skill installation |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/memory/save_workflow.md:562:After `generate-context.js` completes, it emits a **POST-SAVE QUALITY REVIEW** block. This review checks the saved memory file for common issues that degrade retrieval quality.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/memory/save_workflow.md:628:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --help
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC4-importance-tier.json:24:    "Replay the fixture through generate-context.js and confirm tier parity"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/01-category-overview.md:3:description: "Category covering Claude Code hooks (PreCompact, SessionStart, Stop), structural code graph (indexer, SQLite, MCP tools), CocoIndex bridge, and compaction working-set integration."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/01-category-overview.md:10:Category covering runtime hook automation, structural code graph (indexer, SQLite, MCP tools), CocoIndex bridge, and compaction working-set integration.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/01-category-overview.md:12:This category documents the hybrid context injection system that preserves critical knowledge across context compaction events. It combines three complementary systems: hook-based lifecycle automation, structural code analysis (code graph), and semantic search (CocoIndex) — all merging under a 4000-token budget for compaction injection.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/structure/folder_structure.md:37:└── [cross-level templates]  # handover.md, debug-delegation.md, research/research.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/templates/template_style_guide.md:36:| **Utility** | handover.md, debug-delegation.md |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/templates/template_style_guide.md:63:| `context_template.md` | Mustache syntax (`{{VARIABLE}}`) | Programmatic generation via generate-context.js |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/templates/template_style_guide.md:145:- `handover.md` - Session handover context
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:122:- `/spec_kit:handover` - write continuation context for the next session
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:182:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/007-feature/
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:491:<!-- ANCHOR:context-save-handover -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:502:**MANDATORY:** Use generate-context.js for memory save:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:504:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/###-folder/
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:524:**Command:** `/spec_kit:handover`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:527:- `/spec_kit:handover:quick` (default) - Minimal handover for quick continuation
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:528:- `/spec_kit:handover:full` - Comprehensive handover with full context
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:534:- Context compaction detected
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:540:<!-- /ANCHOR:context-save-handover -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:599:- **ONLY @speckit creates spec documentation** — Never route spec.md/plan.md/tasks.md/etc. to @general/@write. Exceptions: @handover (handover.md), @deep-research (research/research.md), @debug (debug-delegation.md)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:754:- [handover.md](../../templates/handover.md) - Full session handover document
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/03-session-start-priming.md:12:This hook handles four session start scenarios: after compaction it reads the cached PreCompact payload, on fresh startup it surfaces a Spec Kit Memory overview, on resume it loads prior session state, and after /clear it provides minimal context. The output is written to stdout for Claude Code to inject into the conversation.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/templates/level_specifications.md:735:| `handover.md` | Session context transfer | End of work session requiring handoff | `/spec_kit:handover` command |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/templates/level_specifications.md:739:- `.opencode/skill/system-spec-kit/templates/handover.md`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/templates/level_specifications.md:764:| `memory/` | Session context preservation | `generate-context.js` runtime script via `/memory:save` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/templates/level_specifications.md:769:- Use `/memory:save` or `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"...","sessionSummary":"..."}' specs/###-folder/`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/templates/level_specifications.md:848:- [handover.md](../../templates/handover.md) - Session context transfer
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/templates/level_specifications.md:852:- `memory/` - Context preservation (auto-generated via generate-context.js)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/workflows/execution_methods.md:77:### generate-context.js runtime entrypoint
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/workflows/execution_methods.md:84:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/context-data.json specs/001-feature/
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/workflows/execution_methods.md:87:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"001-feature","sessionSummary":"..."}' specs/001-feature/
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/workflows/execution_methods.md:90:echo '{"specFolder":"001-feature","sessionSummary":"..."}' | node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --stdin
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/workflows/execution_methods.md:220:The `generate-context.js` script orchestrates a 12-step workflow via `workflow.ts`:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/workflows/worked_examples.md:261:    Found: handover.md (from 2 hours ago)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/workflows/worked_examples.md:277:| `memory/handover.md` | Session state snapshot |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/workflows/worked_examples.md:285:| Handover Files | Created via `/spec_kit:handover` before session end |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/workflows/worked_examples.md:312:| `/spec_kit:handover` | Save context before ending session |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:348:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js \
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/templates/template_guide.md:533:### handover.md - Full Session Handover
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/templates/template_guide.md:537:**Purpose:** Comprehensive session handover document for complex, multi-phase work
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/templates/template_guide.md:539:**Created by:** `/spec_kit:handover:full` command
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/templates/template_guide.md:545:cp .opencode/skill/system-spec-kit/templates/handover.md specs/###-name/handover.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/templates/template_guide.md:600:Memory files in the `memory/` folder are NOT created from templates. They are auto-generated by the runtime save script: `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/templates/template_guide.md:602:**Creation (JSON mode — preferred):** `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"###-name","sessionSummary":"..."}' specs/###-name/`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/templates/template_guide.md:610:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/007-feature
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/templates/template_guide.md:621:- **NEVER create memory files manually** - always use `generate-context.js` via the runtime `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js` entrypoint
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/templates/template_guide.md:626:**Note:** Never manually create memory files using Write/Edit tools. Always use the runtime `generate-context.js` script per AGENTS.md Memory Save Rule.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/templates/template_guide.md:746:- [ ] No ToC heading in non-research spec artifacts (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, `handover.md`, `debug-delegation.md`)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/templates/template_guide.md:1167:| Root | `templates/` (root) | handover.md, debug-delegation.md (cross-level) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/templates/template_guide.md:1183:- [handover.md](../../templates/handover.md) - Full session handover document (~100-150 lines)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/templates/template_guide.md:1188:- `memory/` - Context preservation folder (files auto-generated via `generate-context.js`)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/10-budget-allocator.md:3:description: "Token budget allocator distributes 4000-token compaction budget across context sources using floor allocations plus overflow redistribution."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/10-budget-allocator.md:10:Token budget allocator distributes 4000-token compaction budget across context sources using floor allocations plus overflow redistribution.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:1498:Prompt: `Validate dual-scope auto-surface (TM-05). Capture the evidence needed to prove Non-memory-aware tool path triggers auto-surface hook; compaction event surfaces relevant memories; surfaced memories match current context. Return a concise user-facing pass/fail verdict with the main reason.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:1500:Non-memory-aware tool path triggers auto-surface hook; compaction event surfaces relevant memories; surfaced memories match current context
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:2801:Prompt: `Validate the rendered-memory template contract for memory_save and generate-context. Capture the evidence needed to prove Dry-run surfaces template-contract violations; non-dry-run rejects malformed files before index side effects; valid rendered output remains validator-clean. Return a concise user-facing pass/fail verdict with the main reason.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:2854:Verify the structured JSON summary contract for `generate-context.js`, including `toolCalls`/`exchanges` fields, file-backed JSON authority, and Wave 2 hardening.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:2857:Prompt: `Save a memory using generate-context.js --json with a payload containing toolCalls, exchanges, and snake_case fields. Verify the rendered output preserves all structured fields, decision confidence, and explicit counts. Return a concise user-facing pass/fail verdict.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:2871:Prompt: `Test the two generate-context.js save paths: (1) --json with valid structured payload should succeed, (2) direct positional without --json/--stdin should reject with migration guidance. Return a pass/fail verdict for each path.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:2885:Prompt: `Run generate-context.js --json with varied payloads to exercise the post-save quality review hook. For each scenario confirm whether the review reports PASSED, SKIPPED, or specific issues at the correct severity. Return a pass/fail verdict for each scenario.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:3740:| 257 | Context Preservation | Working-set compaction | [257](22--context-preservation-and-code-graph/257-working-set-compaction.md) | [22--context-preservation-and-code-graph/11-working-set-tracker.md](../feature_catalog/22--context-preservation-and-code-graph/11-working-set-tracker.md) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/11-session-recovery-spec-kit-resume.md:10:When a session is interrupted by a crash, context compaction, timeout, or an ordinary handoff between sessions, `/spec_kit:resume` reconstructs the most likely previous state and routes the user to the best next step. Session recovery is no longer a standalone memory command. It now lives under the spec-folder resume workflow, where its primary recovery chain relies on shared memory tools while the wrapper also exposes broader helper access for resume workflows.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/11-session-recovery-spec-kit-resume.md:18:- **`memory_context`** (from `/memory:search`) -- Called in `resume` mode as the primary interrupted-session recovery path whenever no fresh `handover.md` already provides enough state. In `mcp_server/handlers/memory-context.ts`, resume mode is a dedicated `memory_search`-backed strategy with anchors `["state", "next-steps", "summary", "blockers"]`, default `limit=5`, a 1200-token budget, `minState=WARM`, `includeContent=true`, and both dedup and decay disabled. When auto-resume is enabled and the caller resumes a reusable working-memory session, `systemPromptContext` is injected before token-budget enforcement.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/11-session-recovery-spec-kit-resume.md:33:| 1 | `handover.md` (<24h) | Preferred continuation context when a fresh structured handoff exists |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/11-session-recovery-spec-kit-resume.md:34:| 2 | `memory_context(mode: "resume")` | Primary interrupted-session recovery path |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:116:When a session is interrupted by a crash, context compaction, timeout, or an ordinary cross-session handoff, this command figures out where you left off and helps you pick up again. It checks fresh handover state first, then the memory system for your most recent work, looks for crash-recovery breadcrumbs, and presents what it found. Think of it like reopening your laptop after it went to sleep and having your browser restore all the tabs you had open. Its primary recovery chain uses 3 borrowed tools: `memory_context`, `memory_search`, and `memory_list`, while the live wrapper also keeps `memory_stats`, `memory_match_triggers`, `memory_delete`, `memory_update`, and extra health, indexing, checkpoint, validation, and CocoIndex helpers available for resume workflows. Two modes are available: auto (resolves the best candidate with minimal prompting) and confirm (presents alternatives when it is not sure which session you want). After recovery, it keeps you inside the same resume workflow for structured work or points you to broader history when needed.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/04--maintenance/01-workspace-scanning-and-indexing-memoryindexscan.md:20:Spec documents are still indexed by default. When a scan touches `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, `research/research.md`, or `handover.md`, it routes that save through `memory_save` in warn-only quality mode so validation problems remain visible without dropping the document out of retrieval.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/04--maintenance/01-workspace-scanning-and-indexing-memoryindexscan.md:22:The scanner discovers files from three sources: spec folder memory files under both `.opencode/**/memory/` and `specs/**/memory/` (including `.md` and `.txt` memory files), constitutional files under `.opencode/skill/*/constitutional/` (currently `.md`, excluding `README.md`/`README.txt`), and spec documents (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, `research/research.md`, `handover.md`). Canonical path deduplication prevents the same file from being indexed twice under different paths (the `specs/` vs `.opencode/specs/` alias problem).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/README.md:93:| **Startup / Recovery Surfaces** | Runtime-specific startup context delivery where available, with `session_bootstrap()` as the canonical non-hook recovery entry and `session_resume()` as the detailed follow-up surface                    |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/README.md:95:| **Session Continuity**        | Context preserved across session boundaries via `generate-context.js` and semantic indexing                                                                                                                    |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/README.md:109:| **Session**         | session_health, session_resume, session_bootstrap                        | Structural recovery, readiness checks, and startup/bootstrap state |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/README.md:157:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js \
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/README.md:178:The system checks the best available continuation context for your most recent work, prefers a fresh `handover.md` when it exists, falls back to resume-mode memory retrieval and crash-recovery breadcrumbs when needed, and presents your prior decisions, file changes and next steps before you start.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/README.md:262:├── memory/                      # Session context files (via generate-context.js)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/README.md:427:| `/spec_kit:handover`    | 4     | Create a session handover document for the next AI                                                                               |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/README.md:514:| `handover.md`                 | Session continuity template for handing off to the next AI      |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/README.md:552:| `generate-context.ts`         | Source for the runtime memory-save entrypoint `scripts/dist/memory/generate-context.js` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/README.md:562:TypeScript sources compile to `scripts/dist/`. The runtime entry point for memory saves is `scripts/dist/memory/generate-context.js`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/README.md:588:│   ├── handover.md             # Session continuity template
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/README.md:630:| `scripts/dist/memory/generate-context.js`                                    | Primary workflow for saving session context to memory                                                |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/README.md:639:The **memory system** is the librarian. When a session ends, `generate-context.js` writes a summary of what happened and files it in the spec folder's `memory/` directory. The MCP server indexes it into vector, FTS5, and BM25 surfaces, while graph and degree signals are computed at retrieval time. When a new session starts, runtime-specific startup integrations may auto-surface that context. If startup context is unavailable or the runtime is operating without hooks, begin with `session_bootstrap()`, which bundles resume context, health, and structural readiness into one recovery call before deeper `memory_context` work begins.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/README.md:655:  └─► generate-context.js writes memory file
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/README.md:660:  └─► Startup surface auto-primes OR session_bootstrap() runs once
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/README.md:781:# Using the generate-context.js script directly
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/README.md:782:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js \
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/README.md:878:**What you see**: `generate-context.js` runs but the output file is empty or the script exits with an error.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/README.md:889:node scripts/dist/memory/generate-context.js \
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/README.md:951:| `generate-context.js` not found  | Run `npm run build` in `system-spec-kit/`                                       |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/README.md:1005:A: Spec folders capture what happened in structured documentation. The memory system makes that documentation searchable across sessions. When a session ends, `generate-context.js` writes a summary to the spec folder's `memory/` directory. The MCP server indexes it. When the next session starts, runtime-specific startup integrations may auto-surface that context; otherwise the canonical recovery sequence is `session_bootstrap()` first, then `memory_context` or `memory_match_triggers` for deeper retrieval. One side captures, the recovery surfaces retrieve.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/README.md:1011:A: The memory system can index any markdown file, beyond spec folder contents. But the spec folder workflow is the primary way context gets saved (via `generate-context.js`), so in practice they work together. You can save standalone memories using `memory_save`, but Gate 3 will still ask about a spec folder for file modifications.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/README.md:38:- **CLI scripts** (`scripts/`) - `generate-context.ts` and other utilities
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/README.md:369:// In scripts/memory/generate-context.ts or similar
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/15--retrieval-enhancements/055-dual-scope-memory-auto-surface-tm-05.md:19:- Prompt: `Validate dual-scope auto-surface (TM-05). Capture the evidence needed to prove Non-memory-aware tool path triggers auto-surface hook; compaction event surfaces relevant memories; surfaced memories match current context. Return a concise user-facing pass/fail verdict with the main reason.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/15--retrieval-enhancements/055-dual-scope-memory-auto-surface-tm-05.md:20:- Expected signals: Non-memory-aware tool path triggers auto-surface hook; compaction event surfaces relevant memories; surfaced memories match current context
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/15--retrieval-enhancements/055-dual-scope-memory-auto-surface-tm-05.md:21:- Pass/fail: PASS: Hook triggers on non-memory tool path; compaction surfaces context-relevant memories; FAIL: Hook does not fire or surfaced memories irrelevant
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/15--retrieval-enhancements/055-dual-scope-memory-auto-surface-tm-05.md:29:| 055 | Dual-scope memory auto-surface (TM-05) | Confirm auto-surface hooks | `Validate dual-scope auto-surface (TM-05). Capture the evidence needed to prove Non-memory-aware tool path triggers auto-surface hook; compaction event surfaces relevant memories; surfaced memories match current context. Return a concise user-facing pass/fail verdict with the main reason.` | 1) invoke non-memory-aware tool path 2) trigger compaction 3) verify surfaced memories | Non-memory-aware tool path triggers auto-surface hook; compaction event surfaces relevant memories; surfaced memories match current context | Auto-surface hook trace + surfaced memory list + context relevance assessment | PASS: Hook triggers on non-memory tool path; compaction surfaces context-relevant memories; FAIL: Hook does not fire or surfaced memories irrelevant | Verify auto-surface hook registration → Check compaction trigger logic → Inspect context matching for surfaced memories |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/154-json-primary-deprecation-posture.md:27:- Prompt: `Test the two generate-context.js save paths: (1) --json with valid structured payload should succeed, (2) direct positional without --json/--stdin should reject with migration guidance. Return a pass/fail verdict for each path.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/154-json-primary-deprecation-posture.md:37:| 154 | JSON-primary deprecation posture | Verify JSON-only save contract | `Test the two generate-context.js save paths: (1) --json with valid structured payload should succeed, (2) direct positional without --json/--stdin should reject with migration guidance. Return a pass/fail verdict for each path.` | 1) `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"test","sessionSummary":"test"}' <spec-folder>` → expect exit 0 2) `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js <spec-folder>` → expect non-zero exit with migration message | Path 1: exit 0, Path 2: non-zero with guidance | CLI exit codes and stdout/stderr output | PASS if both paths match documented behavior | Check generate-context.ts argument parsing and migration guidance text |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/153-json-mode-hybrid-enrichment.md:3:description: "This scenario validates the structured JSON summary contract for generate-context.js, including toolCalls/exchanges fields, file-backed JSON authority, and Wave 2 hardening."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/153-json-mode-hybrid-enrichment.md:18:This scenario validates the phase 016 structured JSON summary contract for `generate-context.js`. It covers acceptance of `toolCalls` and `exchanges` fields, file-backed JSON authority preservation, snake_case field compatibility, and Wave 2 hardening for decision confidence, truncated titles, `git_changed_file_count` stability, and template count preservation.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/153-json-mode-hybrid-enrichment.md:27:- Prompt: `Save a memory using generate-context.js --json with a payload containing toolCalls, exchanges, and snake_case fields. Verify the rendered output preserves all structured fields, decision confidence, and explicit counts. Return a pass/fail verdict.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/153-json-mode-hybrid-enrichment.md:37:| 153 | JSON mode structured summary hardening | Verify structured JSON summary contract | `Save a memory using generate-context.js --json with a payload containing toolCalls, exchanges, and snake_case fields (user_prompts, recent_context, trigger_phrases). Verify the rendered output preserves all structured fields, decision confidence, and explicit counts. Return a pass/fail verdict.` | 1) Compose JSON payload with `toolCalls`, `exchanges`, `user_prompts`, `trigger_phrases` 2) `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>` 3) Inspect rendered .md output for field preservation 4) Verify decision confidence matches input 5) Verify git_changed_file_count matches explicit count | All structured fields present in output, counts match, file-backed JSON stays on the structured path | Rendered memory file content, CLI exit code 0 | PASS if structured fields preserved and hardening fixes hold | Check input-normalizer mapping, collect-session-data count handling, and workflow routing for structured inputs |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/153-json-mode-hybrid-enrichment.md:38:| 153-A | JSON mode structured summary hardening | Post-save quality review output verification | `Run generate-context.js --json with a fully-populated payload. Confirm the CLI prints a POST-SAVE QUALITY REVIEW block and that the block reports PASSED with 0 issues. Return a pass/fail verdict.` | 1) Compose a complete JSON payload with `sessionSummary`, `triggerPhrases`, `keyDecisions`, `importanceTier`, `contextType` 2) `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>` 3) Capture full stdout 4) Locate the `POST-SAVE QUALITY REVIEW` block 5) Verify it reads `PASSED` with 0 issues | `POST-SAVE QUALITY REVIEW -- PASSED` header visible in stdout, `issues: 0` or equivalent no-issue indicator | CLI stdout log showing REVIEW block | PASS if REVIEW block is present and reports 0 issues; FAIL if block is absent or reports any issues | Check `scripts/core/post-save-review.ts`, `scripts/core/workflow.ts`, and CLI response rendering in `scripts/memory/generate-context.ts` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/153-json-mode-hybrid-enrichment.md:39:| 153-B | JSON mode structured summary hardening | sessionSummary propagates to frontmatter title | `Run generate-context.js --json with sessionSummary set to a meaningful task title (not "Next Steps"). Confirm the rendered memory file's frontmatter title matches the sessionSummary and is not a generic fallback such as "Next Steps".` | 1) Set `sessionSummary` to a descriptive, non-generic string (e.g., "Refactor auth pipeline for token refresh") 2) `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>` 3) Read the rendered .md frontmatter 4) Assert `title` field matches provided sessionSummary | Frontmatter `title` equals the sessionSummary value; no occurrence of "Next Steps" as the title | Rendered .md frontmatter | PASS if title matches sessionSummary; FAIL if title is "Next Steps" or any other fallback | Inspect input-normalizer title derivation and frontmatter assembly in workflow.ts |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/153-json-mode-hybrid-enrichment.md:40:| 153-C | JSON mode structured summary hardening | triggerPhrases propagate to frontmatter trigger_phrases | `Run generate-context.js --json with an explicit triggerPhrases array. Confirm the rendered memory file's frontmatter trigger_phrases matches the supplied array and contains no file-path fragments.` | 1) Set `triggerPhrases` to meaningful keyword phrases (e.g., ["auth refactor", "token refresh"]) 2) `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>` 3) Read the rendered .md frontmatter 4) Assert `trigger_phrases` matches the provided array 5) Assert no entry looks like a file path (contains `/` or `.ts`) | Frontmatter `trigger_phrases` contains only the supplied keyword phrases; no path fragments present | Rendered .md frontmatter | PASS if trigger_phrases matches payload; FAIL if path fragments appear or array is replaced by heuristic output | Inspect trigger-extractor heuristic fallback and input-normalizer trigger_phrases passthrough |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/153-json-mode-hybrid-enrichment.md:41:| 153-D | JSON mode structured summary hardening | keyDecisions propagate to non-zero decision_count | `Run generate-context.js --json with a keyDecisions array containing at least 2 items. Confirm the rendered memory metadata decision_count is greater than 0 and matches the number of supplied decisions.` | 1) Set `keyDecisions` to an array of 2+ decision strings 2) `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>` 3) Read the rendered .md file, including the `## MEMORY METADATA` YAML block 4) Assert `decision_count` > 0 and equals `keyDecisions.length` | Memory metadata `decision_count` equals the number of items in the `keyDecisions` array | Rendered .md metadata block | PASS if decision_count > 0 and matches array length; FAIL if decision_count is 0 despite supplied decisions | Check collect-session-data decision counting, input-normalizer keyDecisions mapping, and metadata-block rendering |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/153-json-mode-hybrid-enrichment.md:42:| 153-E | JSON mode structured summary hardening | importanceTier propagates to frontmatter importance_tier | `Run generate-context.js --json with importanceTier set to "important". Confirm the rendered memory file's frontmatter importance_tier matches "important" and is not overridden to "normal".` | 1) Set `importanceTier` to `"important"` 2) `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>` 3) Read the rendered .md frontmatter 4) Assert `importance_tier` equals `"important"` | Frontmatter `importance_tier` equals the payload value | Rendered .md frontmatter | PASS if importance_tier matches payload; FAIL if overridden to "normal" or another default | Inspect importance_tier assignment in workflow.ts and input-normalizer passthrough |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/153-json-mode-hybrid-enrichment.md:43:| 153-F | JSON mode structured summary hardening | contextType propagates for the full documented valid enum | `Run generate-context.js --json with contextType set to documented valid values including "implementation", "review", "debugging", and "planning". Confirm each rendered memory file preserves the payload value in frontmatter context_type instead of falling back to heuristics.` | 1) Save separate JSON payloads using `contextType` values `"implementation"`, `"review"`, `"debugging"`, and `"planning"` 2) `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>` for each case 3) Read each rendered .md frontmatter 4) Assert `context_type` matches the payload value every time | Frontmatter `context_type` equals the payload value for every documented valid test case | Rendered .md frontmatter across the saved files | PASS if every valid test case preserves its explicit context_type; FAIL if any valid value is rewritten or defaulted | Inspect contextType passthrough in input-normalizer, detectSessionCharacteristics in session-extractor, and frontmatter assembly in workflow.ts |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/153-json-mode-hybrid-enrichment.md:44:| 153-G | JSON mode structured summary hardening | Contamination filter cleans hedging in sessionSummary | `Run generate-context.js --json with sessionSummary containing "I think this might be important" and recentContext containing "As an AI, I should note". Confirm the saved memory does not contain these hedging/meta-commentary phrases.` | 1) Compose payload with hedging text in sessionSummary and meta-commentary in recentContext 2) Run generate-context.js --json 3) Read saved memory file 4) grep for "I think" and "As an AI" 5) Assert neither phrase appears | Saved memory free of hedging and meta-commentary phrases | grep output showing zero matches | PASS if hedging phrases absent from saved memory; FAIL if any contamination survives | Check contamination-filter.ts pattern list and workflow.ts cleaning call sites |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/153-json-mode-hybrid-enrichment.md:45:| 153-H | JSON mode structured summary hardening | Fast-path filesModified to FILES conversion | `Run generate-context.js --json with userPrompts AND filesModified in the same payload. Confirm the saved memory contains a populated files section matching the filesModified entries.` | 1) Compose payload with userPrompts (triggers fast-path) and filesModified=["src/foo.ts"] 2) Run generate-context.js --json 3) Read saved memory 4) Assert FILES section contains src/foo.ts | FILES section populated with filesModified entries | Rendered memory file | PASS if FILES contains all filesModified entries; FAIL if FILES is empty or missing | Check input-normalizer.ts fast-path filesModified conversion |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/153-json-mode-hybrid-enrichment.md:46:| 153-I | JSON mode structured summary hardening | Unknown field warning for typos | `Run generate-context.js --json with a deliberately misspelled field name "sesionSummary". Confirm a console warning is emitted naming the unknown field.` | 1) Compose payload with sesionSummary (missing 's') 2) Run generate-context.js --json 3) Capture stderr/stdout 4) Assert WARN message contains "sesionSummary" | Console WARN naming the unknown field | CLI stdout/stderr | PASS if warning emitted; FAIL if typo passes silently | Check KNOWN_RAW_INPUT_FIELDS in input-normalizer.ts |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/153-json-mode-hybrid-enrichment.md:47:| 153-J | JSON mode structured summary hardening | contextType enum rejection | `Run generate-context.js --json with contextType="bogus". Confirm validation rejects the payload with an error naming the invalid value and listing valid options.` | 1) Set contextType to "bogus" 2) Run generate-context.js --json 3) Assert validation error mentions "bogus" and lists valid values | Validation error with invalid value and valid options listed | CLI error output | PASS if validation error with enum list; FAIL if bogus value accepted silently | Check VALID_CONTEXT_TYPES in input-normalizer.ts |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/153-json-mode-hybrid-enrichment.md:48:| 153-K | JSON mode structured summary hardening | Quality score discriminates contaminated vs clean | `Run generate-context.js --json with two separate payloads: one containing AI hedging contamination, one with clean technical content. Confirm the contaminated save has quality_score below 0.80 and the clean save has quality_score above 0.80.` | 1) Save contaminated payload 2) Save clean payload 3) Compare quality_score in both files | Contaminated quality_score < 0.80; clean quality_score > 0.80 | Two saved memory files | PASS if contaminated < clean and contaminated < 0.80; FAIL if scores are indistinguishable | Check quality-scorer.ts bonus removal and penalty weights |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/153-json-mode-hybrid-enrichment.md:49:| 153-L | JSON mode structured summary hardening | Trigger phrase filter removes path fragments | `Run generate-context.js --json with a spec folder that has a long path. Confirm the auto-extracted trigger phrases in the saved memory do not contain path separators (/) from the spec folder path.` | 1) Save memory for a deeply nested spec folder 2) Read saved memory trigger_phrases 3) Check for path separator characters | No trigger phrases containing "/" in auto-extracted set (manual phrases may contain them) | Saved memory frontmatter | PASS if no path-fragment trigger phrases in auto-extracted set; FAIL if path fragments survive filtering | Check filterTriggerPhrases in workflow.ts |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/153-json-mode-hybrid-enrichment.md:51:| 153-N | JSON mode structured summary hardening | Default-on pre-save overlap warning uses exact content match | `Run generate-context.js --json twice with the same payload while SPECKIT_PRE_SAVE_DEDUP is unset. Confirm the second run emits a PRE-SAVE OVERLAP warning before writing. Then repeat with SPECKIT_PRE_SAVE_DEDUP=false and confirm the warning is absent.` | 1) Save a JSON payload once 2) Save the exact same payload again with `SPECKIT_PRE_SAVE_DEDUP` unset 3) Capture stdout/stderr and confirm a PRE-SAVE OVERLAP warning 4) Repeat the second save with `SPECKIT_PRE_SAVE_DEDUP=false` 5) Confirm the warning is absent | Advisory overlap warning appears only when the flag is enabled/defaulted | CLI stdout/stderr from repeated saves | PASS if default-on behavior emits the warning and explicit disable suppresses it; FAIL if the warning never appears or cannot be disabled | Check `workflow.ts` SHA1 overlap check and env-flag gate |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/153-json-mode-hybrid-enrichment.md:52:| 153-O | JSON mode structured summary hardening | projectPhase override propagates to frontmatter | `Run generate-context.js --json with projectPhase set to "IMPLEMENTATION". Confirm the rendered memory file's frontmatter PROJECT_PHASE matches "IMPLEMENTATION" and is not the default "RESEARCH".` | 1) Set projectPhase to "IMPLEMENTATION" in JSON payload 2) Run generate-context.js --json 3) Read frontmatter 4) Assert PROJECT_PHASE equals IMPLEMENTATION | PROJECT_PHASE: IMPLEMENTATION in frontmatter | Rendered .md frontmatter | PASS if PROJECT_PHASE matches; FAIL if shows RESEARCH | Check resolveProjectPhase() in session-extractor.ts and projectPhase propagation in input-normalizer.ts |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/20-ops-self-healing-runbooks.md:37:The other two advertised classes are only partially live today. `heal-session-ambiguity.sh` now exits immediately with a deprecation notice saying session ambiguity moved into the memory-save pipeline via `generate-context.js`. Its older deterministic implementation is still retained below the early exit for reference, but it is not reachable in normal execution. `heal-telemetry-drift.sh` still parses options and applies the shared retry contract, but the current main flow exits with an error saying the telemetry drift runner was removed and a supported schema-doc parity workflow must be wired back in before use.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/embeddings/README.md:398:| [generate-context.js](../../scripts/dist/memory/generate-context.js) | Main script using embeddings |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/16-json-mode-hybrid-enrichment.md:3:description: "Structured JSON summary support for generate-context.js, including toolCalls/exchanges fields, file-backed JSON authority, and Wave 2 hardening for decision confidence, truncated titles, git_changed_file_count stability, and template count preservation."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/16-json-mode-hybrid-enrichment.md:29:1. `generate-context.js --json '<data>'` and `generate-context.js --stdin` accept structured JSON with fields like `toolCalls`, `exchanges`, `sessionSummary`, and the documented snake_case contract (`user_prompts`, `recent_context`, `trigger_phrases`).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/16-json-mode-hybrid-enrichment.md:148:| `scripts/memory/generate-context.ts` | CLI help text and structured-first save workflow documentation |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/16-json-mode-hybrid-enrichment.md:156:| `scripts/tests/generate-context-cli-authority.vitest.ts` | Structured-input precedence for `--stdin` and `--json` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/16-json-mode-hybrid-enrichment.md:174:- `cd .opencode/skill/system-spec-kit/scripts && npx vitest run --config ../mcp_server/vitest.config.ts --root . tests/generate-context-cli-authority.vitest.ts tests/input-normalizer-unit.vitest.ts tests/post-save-review.vitest.ts tests/project-phase-e2e.vitest.ts tests/quality-scorer-calibration.vitest.ts tests/task-enrichment.vitest.ts tests/template-mustache-sections.vitest.ts tests/trigger-phrase-filter.vitest.ts tests/validation-v13-v14-v12.vitest.ts tests/workflow-e2e.vitest.ts`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/257-working-set-compaction.md:2:title: "257 -- Working-set tracker feeds compaction"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/257-working-set-compaction.md:3:description: "This scenario validates Working-set tracker for 257. It focuses on Tracked files appear in compaction priority."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/257-working-set-compaction.md:6:# 257 -- Working-set tracker feeds compaction
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/257-working-set-compaction.md:16:- **Objective**: Verify that the WorkingSetTracker correctly tracks file and symbol accesses during a session, using recency-weighted scoring (frequency * recency_decay where recency_decay = 1 / (1 + age_in_minutes / 10)) for compaction priority. `getTopRoots(n)` must return the most relevant files. The tracker must support serialization/deserialization for hook state persistence, auto-evict beyond maxFiles capacity (default: 20), and feed tracked files into the compact merger for compaction context.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/257-working-set-compaction.md:58:- Feature file path: `22--context-preservation-and-code-graph/257-working-set-compaction.md`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/007-session-capturing-pipeline-quality.md:68:    - `grep -n 'SYSTEM_SPEC_KIT_CAPTURE_SOURCE\|trigger_phrases' .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts .opencode/skill/system-spec-kit/templates/context_template.md`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/007-session-capturing-pipeline-quality.md:72:    - `cd .opencode/skill/system-spec-kit/scripts && npm test -- --run tests/spec-affinity.vitest.ts tests/claude-code-capture.vitest.ts tests/codex-cli-capture.vitest.ts tests/copilot-cli-capture.vitest.ts tests/gemini-cli-capture.vitest.ts tests/quality-scorer-calibration.vitest.ts tests/runtime-memory-inputs.vitest.ts tests/session-enrichment.vitest.ts tests/task-enrichment.vitest.ts tests/memory-render-fixture.vitest.ts tests/generate-context-cli-authority.vitest.ts tests/memory-sufficiency.vitest.ts tests/memory-template-contract.vitest.ts`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/007-session-capturing-pipeline-quality.md:77:    - `cd .opencode/skill/system-spec-kit/scripts && npm test -- --run tests/workflow-e2e.vitest.ts tests/generate-context-cli-authority.vitest.ts tests/contamination-filter.vitest.ts tests/quality-scorer-calibration.vitest.ts`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/007-session-capturing-pipeline-quality.md:86:    - `M-007a` Rich JSON-mode save: run `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js <json-data-file> 009-perfect-session-capturing` with a populated synthetic or sandbox JSON file and verify `qualityValidation.valid === true`, indexing succeeds, and a memory ID is returned.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/007-session-capturing-pipeline-quality.md:88:    - `M-007b` Thin JSON insufficiency: rerun `generate-context.js` with intentionally thin JSON input using the documented snake_case contract and verify it now fails `INSUFFICIENT_CONTEXT_ABORT` before file write, with a materially lower diagnostic score than `M-007a`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/007-session-capturing-pipeline-quality.md:99:    - `M-007m` `--stdin` structured input: pipe valid structured JSON into `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --stdin <target-spec-folder>` and confirm the explicit CLI target wins over any payload `specFolder`, while `toolCalls` and `exchanges` survive into the generated output.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/007-session-capturing-pipeline-quality.md:100:    - `M-007n` `--json` structured input: run `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>'` and confirm the payload target is used when no explicit CLI target is provided, while file-backed JSON remains on the authoritative structured path instead of entering runtime-derived reconstruction.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/007-session-capturing-pipeline-quality.md:129:  - `generate-context.js` output or capture logs showing results for `M-007a` through `M-007j`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/007-session-capturing-pipeline-quality.md:130:  - `generate-context.js` output or targeted Vitest evidence showing results for `M-007k` through `M-007q`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/149-rendered-memory-template-contract.md:19:- Prompt: `Validate the rendered-memory template contract for memory_save and generate-context. Capture the evidence needed to prove Dry-run surfaces template-contract violations; non-dry-run rejects malformed files before index side effects; valid rendered output remains validator-clean. Return a concise user-facing pass/fail verdict with the main reason.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/149-rendered-memory-template-contract.md:29:| 149 | Rendered memory template contract | Confirm malformed rendered memories fail before write/index and valid rendered output remains validator-clean | `Validate the rendered-memory template contract for memory_save and generate-context. Capture the evidence needed to prove Dry-run surfaces template-contract violations; non-dry-run rejects malformed files before index side effects; valid rendered output remains validator-clean. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Create a sandbox memory missing mandatory anchors or required frontmatter keys 2) `memory_save({ filePath:"<sandbox-file>", dryRun:true })` and verify contract-violation details 3) `memory_save({ filePath:"<sandbox-file>", force:true })` and verify rejection before indexing 4) Run `generate-context.js` with a valid rich JSON payload and verify the rendered output remains validator-clean | Dry-run surfaces template-contract violations; non-dry-run rejects malformed files before index side effects; valid rendered output remains validator-clean | Dry-run/save rejection output + successful render validation evidence | PASS if malformed files are rejected before write/index and valid rendered output remains validator-clean | Inspect `shared/parsing/memory-template-contract.ts`, `scripts/core/workflow.ts`, and `mcp_server/handlers/memory-save.ts` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/256-budget-allocator.md:16:- **Objective**: Verify the token budget allocator distributes the 4000-token compaction budget across 4 context sources using floor allocations (constitutional: 700, codeGraph: 1200, cocoIndex: 900, triggered: 400, overflow pool: 800) plus overflow redistribution. Empty sources release their floor to the overflow pool. Overflow is redistributed by priority order: constitutional > codeGraph > cocoIndex > triggered. Total cap is enforced with deterministic trim in reverse priority order.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/240-core-workflow-infrastructure.md:19:- Prompt: `Validate the core workflow infrastructure. Capture the evidence needed to prove the memory-indexer weighting, post-save review, quality-scorer calibration, generate-context authority, and workflow end-to-end suites all pass together. Return a concise user-facing pass/fail verdict with the main reason.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/240-core-workflow-infrastructure.md:29:| 240 | Core Workflow Infrastructure | Confirm the shared workflow layer remains stable across indexing, review, scoring, and end-to-end workflow tests | `Validate the core workflow infrastructure. Capture the evidence needed to prove the memory-indexer weighting, post-save review, quality-scorer calibration, generate-context authority, and workflow end-to-end suites all pass together. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `cd .opencode/skill/system-spec-kit/scripts && npx vitest run tests/memory-indexer-weighting.vitest.ts tests/post-save-review.vitest.ts tests/quality-scorer-calibration.vitest.ts tests/generate-context-cli-authority.vitest.ts tests/workflow-e2e.vitest.ts` | All targeted Vitest suites pass with no failing assertions across weighting, review, scoring, authority, or workflow seams | Vitest transcript showing passing suite counts and file names | PASS if the targeted suites pass together without failures; FAIL if any shared workflow seam regresses | Inspect `scripts/core/memory-indexer.ts`, `post-save-review.ts`, `quality-scorer.ts`, `config.ts`, and workflow entrypoints if any targeted suite fails |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:3:description: "Session capturing pipeline quality is the current reality-alignment feature for `009-perfect-session-capturing`. It covers the shipped JSON-primary save path for `generate-context.js`, continued positional JSON file support on the same structured path, and the associated quality gates, sufficiency enforcement, and template-contract validation."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:20:Session capturing pipeline quality is the current reality-alignment feature for `009-perfect-session-capturing`. It covers the full shipped session-capture path for `generate-context.js`:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:51:18. `generate-context.js` diagnostic scores now reflect insufficiency explicitly instead of letting thin memories look healthy.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:55:22. Structured JSON mode accepts both `generate-context.js --stdin` and `generate-context.js --json <string>` as the preferred AI-composed save paths.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:108:- After normalization, `generate-context.js` evaluates one shared semantic sufficiency snapshot before writing or indexing.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:124:- `generate-context.js --stdin` reads structured JSON from stdin and routes it through the same workflow contract as file input.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:125:- `generate-context.js --json <string>` does the same for inline structured JSON payloads.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:176:| `scripts/memory/generate-context.ts` | CLI entrypoint; `--stdin`, `--json`, and positional JSON file input all resolve through the structured-input contract |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:180:| `shared/parsing/memory-sufficiency.ts` | Shared semantic sufficiency evaluator used by `generate-context.js` and `memory_save` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:213:| `scripts/tests/generate-context-cli-authority.vitest.ts` | Explicit CLI root-spec authority coverage plus `--stdin`, `--json`, and positional JSON file-input structured-path behavior |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:227:- `cd .opencode/skill/system-spec-kit/scripts && npm test -- --run tests/spec-affinity.vitest.ts tests/quality-scorer-calibration.vitest.ts tests/task-enrichment.vitest.ts tests/memory-render-fixture.vitest.ts tests/generate-context-cli-authority.vitest.ts tests/memory-sufficiency.vitest.ts tests/memory-template-contract.vitest.ts`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:232:- `cd .opencode/skill/system-spec-kit/scripts && npm test -- --run tests/workflow-e2e.vitest.ts tests/generate-context-cli-authority.vitest.ts tests/contamination-filter.vitest.ts tests/quality-scorer-calibration.vitest.ts`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:263:9. `generate-context.js --stdin` with structured JSON, explicit CLI target precedence, and preserved `toolCalls` / `exchanges`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:264:10. `generate-context.js --json <string>` with payload-target fallback when no explicit CLI override exists and file-backed JSON authority preserved.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/266-context-metrics.md:38:| 266b | Context preservation metrics | Memory recovery tracked and factor updated | `Validate 266b recovery tracking` | Call `memory_context({ mode: "resume" })` then `session_health({})` | recovery factor === 1.0 | session_health response qualityScore.factors.recovery | PASS if recovery factor is 1.0 after resume call | Check memory_recovery event recording and factor computation |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/250-session-start-startup.md:28:  - Resume instruction: `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/249-session-start-compact.md:29:  - When no cached payload exists, fallback output instructs calling `memory_context({ mode: "resume" })`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/249-session-start-compact.md:42:| 249c | SessionStart priming (compact) | Fallback when no cached payload exists | `Validate 249c compact fallback` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts` | Stdout contains "Context Recovery" section instructing `memory_context({ mode: "resume" })` | Test output showing fallback message | PASS if fallback message appears when pendingCompactPrime is null | Verify test fixture simulates missing cache state |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/263-session-resume.md:3:description: "This scenario validates Session resume tool for 263. It focuses on verifying session_resume returns a detailed merged recovery payload, including structural readiness hints."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/263-session-resume.md:10:This scenario validates the detailed Session resume tool (`session_resume`). It focuses on the lower-level merged payload returned by the direct resume surface, while the higher-level bootstrap/recovery guidance is documented separately.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/263-session-resume.md:16:- **Objective**: Verify that session_resume performs its recovery sub-calls (memory_context resume, code graph status, CocoIndex availability), appends the shared structural ready/stale/missing contract, and merges everything into a single SessionResumeResult. Each sub-call failure must be captured as an error entry with recovery hints rather than failing the entire call. The response must include memory (resume context), codeGraph (status/ok/empty/error with counts), cocoIndex (available boolean with binary path), structuralContext (`status`, `summary`, `recommendedAction`, `sourceSurface`, plus freshness guidance), and hints array.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/263-session-resume.md:21:- **Prompt**: `Validate 263 Session resume. Call session_resume and confirm: (1) memory field contains resume context from memory_context, (2) codeGraph field has status (ok/empty/error), nodeCount, edgeCount, fileCount, lastScan, (3) cocoIndex field has available boolean and binaryPath, (4) structuralContext reports ready/stale/missing correctly and includes summary, recommendedAction, and sourceSurface, and (5) hints array includes session_bootstrap guidance when structural context is degraded.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/263-session-resume.md:27:  - structuralContext.summary is a string, `recommendedAction` is a string, and `sourceSurface === "session_resume"`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/263-session-resume.md:28:  - hints array present (may be empty if all subsystems healthy; should point to `session_bootstrap` when structure is degraded)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/263-session-resume.md:39:| 263a | Session resume tool | Memory resume sub-call returns context | `Validate 263a memory resume` | Call `session_resume({})` via MCP | memory field is non-empty object with resume data or error + hint | session_resume response JSON memory field | PASS if memory field present with data or graceful error | Check handleMemoryContext() with mode=resume in session-resume.ts |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/263-session-resume.md:40:| 263b | Session resume tool | Code graph status sub-call returns counts | `Validate 263b code graph status` | Call `session_resume({})` via MCP | codeGraph.status in [ok, empty, error], nodeCount/edgeCount/fileCount are integers >= 0 | session_resume response JSON codeGraph field | PASS if codeGraph field has all required fields with valid types | Check graphDb.getStats() and code-graph-db.ts query |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/263-session-resume.md:41:| 263c | Session resume tool | CocoIndex availability check | `Validate 263c cocoindex status` | Call `session_resume({})` via MCP | cocoIndex.available is boolean, binaryPath is string | session_resume response JSON cocoIndex field | PASS if cocoIndex fields present with correct types | Check `cocoindex-path.ts` plus the availability probe used by session-resume.ts |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/263-session-resume.md:42:| 263d | Session resume tool | Structural readiness and recovery hinting | `Validate 263d structural context` | Call `session_resume({})` via MCP in both healthy and degraded graph states | structuralContext.status in [ready, stale, missing]; structuralContext.summary/recommendedAction/sourceSurface present; degraded states mention session_bootstrap in hints | session_resume response JSON structuralContext + hints | PASS if structural contract fields are surfaced and degraded states recommend session_bootstrap; FAIL if required contract fields are missing or recovery hint is wrong | Check buildStructuralBootstrapContract() and degraded hint injection in session-resume.ts |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/17-json-primary-deprecation-posture.md:19:Phase 017 established the JSON-primary deprecation posture for `generate-context.js`. Runtime-derived capture for routine saves proved unreliable: wrong-session selection, contamination, and thin-evidence failures persisted across multiple research and fix rounds. The resolution: AI-composed JSON via `--json` or `--stdin` is the preferred routine-save contract, while positional JSON file input remains functional on the same structured-input path.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/17-json-primary-deprecation-posture.md:30:2. `generate-context.js --json '<data>'` and `generate-context.js --stdin` are the documented and preferred routine-save paths for AI-composed structured input.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/17-json-primary-deprecation-posture.md:69:| `scripts/memory/generate-context.ts` | CLI argument parsing for `--json`, `--stdin`, and positional JSON file input |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/17-json-primary-deprecation-posture.md:79:| `scripts/tests/generate-context-cli-authority.vitest.ts` | `--stdin` / `--json` structured-input precedence, explicit CLI target authority, and positional JSON file support |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/17-json-primary-deprecation-posture.md:80:| `scripts/tests/generate-context-cli-authority.vitest.ts` | Invalid inline JSON and missing-target failures for structured-input modes |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/17-json-primary-deprecation-posture.md:87:- `cd .opencode/skill/system-spec-kit/scripts && npm test -- --run tests/generate-context-cli-authority.vitest.ts tests/workflow-e2e.vitest.ts`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/003-context-save-index-update.md:25:  - `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/<target-spec>`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/17--governance/220-constitutional-gate-enforcement-rule-pack.md:3:description: "This scenario validates Constitutional Gate-Enforcement Rule Pack for `220`. It focuses on verifying the always-surface constitutional memory preserves gate triggers, cross-references, and continuation or compaction recovery behavior."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/17--governance/220-constitutional-gate-enforcement-rule-pack.md:10:This scenario validates Constitutional Gate-Enforcement Rule Pack for `220`. It focuses on verifying the always-surface constitutional memory preserves gate triggers, cross-references, and continuation or compaction recovery behavior.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/17--governance/220-constitutional-gate-enforcement-rule-pack.md:18:- Objective: Verify the always-surface constitutional memory preserves gate triggers, cross-references, and continuation or compaction recovery behavior
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/17--governance/220-constitutional-gate-enforcement-rule-pack.md:19:- Prompt: `Validate the constitutional gate-enforcement rule pack. Capture the evidence needed to prove the constitutional memory encodes file-modification, continuation, compaction, completion, and memory-save trigger phrases; cross-references the governing gates; includes continuation-validation and compaction-recovery overlays; and that the constitutional tier documentation guarantees top-of-results, non-decaying visibility for this rule pack. Return a concise user-facing pass/fail verdict with the main reason.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/17--governance/220-constitutional-gate-enforcement-rule-pack.md:20:- Expected signals: `gate-enforcement.md` declares constitutional importance and decision-style trigger metadata; the body includes gate cross-reference, continuation validation, compaction recovery, and quick-reference guidance; `constitutional/README.md` documents top-ranked, non-decaying constitutional surfacing semantics
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/17--governance/220-constitutional-gate-enforcement-rule-pack.md:29:| 220 | Constitutional Gate-Enforcement Rule Pack | Verify the always-surface constitutional memory preserves gate triggers, cross-references, and continuation or compaction recovery behavior | `Validate the constitutional gate-enforcement rule pack. Capture the evidence needed to prove the constitutional memory encodes file-modification, continuation, compaction, completion, and memory-save trigger phrases; cross-references the governing gates; includes continuation-validation and compaction-recovery overlays; and that the constitutional tier documentation guarantees top-of-results, non-decaying visibility for this rule pack. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Inspect `.opencode/skill/system-spec-kit/constitutional/gate-enforcement.md` frontmatter and capture the constitutional importance tier, content type, and trigger-phrase coverage 2) Inspect the body of `gate-enforcement.md` and confirm the gate cross-reference table, continuation-validation workflow, compaction-recovery guidance, and quick-reference behavior are present 3) Inspect `.opencode/skill/system-spec-kit/constitutional/README.md` and confirm it documents constitutional ranking, fixed similarity, no decay, permanence, and budget/verification rules 4) Cross-check the rule-pack references against `AGENTS.md` Section 2 to confirm the constitutional pack points back to the authoritative gate contract | `gate-enforcement.md` declares constitutional importance and decision-style trigger metadata; the body includes gate cross-reference, continuation validation, compaction recovery, and quick-reference guidance; `constitutional/README.md` documents top-ranked, non-decaying constitutional surfacing semantics | Frontmatter capture from `gate-enforcement.md` + notes/snippets for cross-reference and recovery sections + constitutional README evidence + cross-check notes against `AGENTS.md` Section 2 | PASS if the rule pack preserves the operational gate overlays and constitutional surfacing guarantees described in the catalog; FAIL if trigger coverage is incomplete, recovery guidance is absent, or constitutional visibility semantics are undocumented | Verify `gate-enforcement.md` frontmatter still includes constitutional tier and trigger phrases -> inspect the gate cross-reference and continuation/compaction sections for accidental removal -> confirm `constitutional/README.md` still documents fixed-priority surfacing semantics -> check `AGENTS.md` Section 2 remains the referenced authoritative source |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/005-outsourced-agent-memory-capture-round-trip.md:27:  - `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/<target-spec>`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/005-outsourced-agent-memory-capture-round-trip.md:31:- Evidence: agent stdout with memory section + generate-context output + search result showing saved memory.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/005-outsourced-agent-memory-capture-round-trip.md:33:- Fail triage: Check memory epilogue in prompt template → Verify generate-context.js JSON mode input → Inspect agent stdout for structured section → Verify index scan ran post-save.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/005-outsourced-agent-memory-capture-round-trip.md:37:2. Run: `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/<target-spec>`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/005-outsourced-agent-memory-capture-round-trip.md:42:2. Run generate-context.js with the JSON file
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/155-post-save-quality-review.md:10:This scenario validates the POST-SAVE QUALITY REVIEW hook that fires after a JSON mode `generate-context.js` save. It confirms that a fully-populated payload produces a PASSED review with 0 issues, that field-level mismatches (generic titles, path-fragment triggers, mismatched importance_tier, zero decision_count) are surfaced with severity-graded instructions, and that the AI can follow the emitted fix instructions to bring frontmatter into alignment with the payload.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/155-post-save-quality-review.md:16:Operators invoke `generate-context.js --json` with controlled payloads and inspect the POST-SAVE QUALITY REVIEW block in stdout as well as the rendered frontmatter of the produced memory file.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/155-post-save-quality-review.md:19:- Prompt: `Run generate-context.js --json with varied payloads to exercise the post-save quality review hook. For each scenario confirm whether the review reports PASSED, SKIPPED, or specific issues at the correct severity. Return a pass/fail verdict for each scenario.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/155-post-save-quality-review.md:29:| 155 | Post-save quality review | JSON mode save with all fields populated correctly | `Run generate-context.js --json with a complete payload containing a meaningful sessionSummary, explicit triggerPhrases, at least 2 keyDecisions, importanceTier="important", and contextType="implementation". Confirm the POST-SAVE QUALITY REVIEW block reports PASSED with 0 issues.` | 1) Compose full JSON payload: `sessionSummary` = descriptive title, `triggerPhrases` = keyword array, `keyDecisions` = 2+ items, `importanceTier` = "important", `contextType` = "implementation" 2) `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>` 3) Capture stdout 4) Locate `POST-SAVE QUALITY REVIEW` block 5) Assert status = PASSED and issues = 0 | `POST-SAVE QUALITY REVIEW -- PASSED` with 0 issues | CLI stdout REVIEW block | PASS if REVIEW shows PASSED and 0 issues; FAIL if any issue is reported for a fully valid payload | Check `scripts/core/post-save-review.ts` for false-positive conditions |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/155-post-save-quality-review.md:30:| 155 | Post-save quality review | JSON mode save with generic title | `Run generate-context.js --json where the pipeline produces a generic title instead of a meaningful one. Confirm the POST-SAVE QUALITY REVIEW block reports a [HIGH] title issue with a fix instruction referencing the sessionSummary field.` | 1) Compose payload that would yield a generic title 2) `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>` 3) Capture stdout 4) Locate `POST-SAVE QUALITY REVIEW` block 5) Assert a `[HIGH]` issue is reported for the title field 6) Assert a fix instruction is present | `[HIGH]` severity issue for title; fix instruction references `sessionSummary` | CLI stdout REVIEW block | PASS if HIGH title issue reported with fix; FAIL if no issue or wrong severity | Inspect title-quality check in `scripts/core/post-save-review.ts` and the generic-title detection list |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/155-post-save-quality-review.md:31:| 155 | Post-save quality review | JSON mode save with path fragment triggers | `Run generate-context.js --json where triggerPhrases are provided but the pipeline generates path-fragment values instead. Confirm the POST-SAVE QUALITY REVIEW block reports a [HIGH] trigger_phrases issue with a fix instruction.` | 1) Compose payload with `triggerPhrases` = ["auth refactor"] but arrange for heuristic override 2) `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>` 3) Capture stdout 4) Assert a `[HIGH]` issue for `trigger_phrases` containing path fragments | `[HIGH]` severity issue for trigger_phrases; fix instruction present | CLI stdout REVIEW block | PASS if HIGH trigger_phrases issue reported; FAIL if path fragments pass undetected | Check path-fragment detection regex in `scripts/core/post-save-review.ts` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/155-post-save-quality-review.md:32:| 155 | Post-save quality review | JSON mode save with mismatched importance_tier | `Run generate-context.js --json with importanceTier="important" in the payload but where the pipeline outputs "normal" in the rendered frontmatter. Confirm the POST-SAVE QUALITY REVIEW block reports a [MEDIUM] importance_tier mismatch.` | 1) Compose payload with `importanceTier` = "important" 2) Force or simulate a pipeline override to "normal" 3) `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>` 4) Capture stdout 5) Assert a `[MEDIUM]` issue for `importance_tier` | `[MEDIUM]` severity issue for importance_tier; expected vs actual values shown | CLI stdout REVIEW block | PASS if MEDIUM importance_tier issue reported; FAIL if mismatch goes unreported | Inspect importance_tier comparison in `scripts/core/post-save-review.ts` and input-normalizer passthrough |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/155-post-save-quality-review.md:33:| 155 | Post-save quality review | JSON mode save with 0 decisions when payload has keyDecisions | `Run generate-context.js --json with 2 keyDecisions in the payload but where the rendered memory metadata has decision_count=0. Confirm the POST-SAVE QUALITY REVIEW block reports a [MEDIUM] decision_count issue.` | 1) Compose payload with `keyDecisions` = ["Decision A", "Decision B"] 2) `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>` 3) Capture stdout 4) Assert a `[MEDIUM]` issue for `decision_count` = 0 despite non-empty payload | `[MEDIUM]` severity issue for decision_count; notes expected count from payload | CLI stdout REVIEW block | PASS if MEDIUM decision_count issue reported; FAIL if zero count is not detected | Check decision counting in `scripts/extractors/collect-session-data.ts` and the metadata-block parser in `scripts/core/post-save-review.ts` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/155-post-save-quality-review.md:35:| 155-F | Post-save quality review | Score penalty advisory logging | `Run generate-context.js --json with a payload designed to trigger at least one HIGH post-save review issue. Confirm the CLI stdout includes a "Post-save review: quality_score penalty" log line with the computed penalty value.` | 1) Compose payload that produces a generic title (triggers HIGH issue) 2) Run generate-context.js --json 3) Capture stdout 4) Locate "Post-save review: quality_score penalty" log line 5) Assert penalty value is negative (e.g., -0.10) | "Post-save review: quality_score penalty" present in stdout with negative value | CLI stdout | PASS if penalty log line present with correct value; FAIL if no penalty log despite HIGH issue | Check computeReviewScorePenalty in post-save-review.ts and advisory logging in workflow.ts |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/155-post-save-quality-review.md:46:- CLI surface: `scripts/memory/generate-context.ts`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/142-session-transition-trace-contract.md:29:| 142 | Session transition trace contract | Verify `memory_context` emits trace-only session transitions with no non-trace leakage | `Validate Markovian session transition tracing for memory_context. Capture the evidence needed to prove Trace-enabled responses include spec-shaped sessionTransition; non-trace responses omit it entirely; no top-level metadata leak appears when trace is disabled. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `memory_context({ input: "resume previous work on rollout hardening", mode: "resume", sessionId: "markovian-142", includeTrace: true })` 2) Verify each result exposes `trace.sessionTransition.previousState`, `currentState`, `confidence`, and ordered `signalSources` 3) Repeat without `includeTrace` and verify `sessionTransition` is absent 4) Confirm the non-trace response does not expose transition data in top-level metadata | Trace-enabled responses include spec-shaped `sessionTransition`; non-trace responses omit it entirely; no top-level metadata leak appears when trace is disabled | Two `memory_context` outputs with and without `includeTrace` + field-level comparison | PASS if trace-only gating holds and the contract fields are present only in the traced call | Inspect `handlers/memory-context.ts`, `handlers/memory-search.ts`, and `lib/search/session-transition.ts` if fields leak or ordering drifts |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/190-session-recovery-spec-kit-resume.md:20:- Expected signals: `memory_context(mode: "resume")` is the first interrupted-session recovery path after any fresh handover; fallback behavior uses the documented resume anchors and recent-candidate discovery; auto mode resolves a strong candidate with minimal prompting; confirm mode shows alternatives when ambiguity remains; the final response includes state and next-step guidance
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/190-session-recovery-spec-kit-resume.md:29:| 190 | Session recovery via /spec_kit:resume | Verify `/spec_kit:resume` recovery chain, ambiguity handling, and post-recovery routing | `Validate session recovery via /spec_kit:resume. Capture the evidence needed to prove resume-mode memory_context is the primary interrupted-session recovery path; the documented fallback chain activates when recovery is thin or ambiguous; auto and confirm resume modes behave correctly; the returned recovery summary includes actionable next steps and appropriate post-recovery routing. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Invoke `/spec_kit:resume specs/<target-spec> :auto` or the equivalent recovery workflow for a real interrupted session and verify the command first calls `memory_context` in `resume` mode when fresh handover data is absent or insufficient 2) Confirm resume recovery uses the documented anchors `["state", "next-steps", "summary", "blockers"]`, include-content behavior, and bounded token-budget response 3) If auto-resume is enabled for a reusable working-memory session, verify injected `systemPromptContext` is applied before token-budget enforcement 4) If the primary summary is thin, verify fallback to `CONTINUE_SESSION.md` and then anchored `memory_search()` using the same resume anchors 5) If no clear candidate exists, verify recent-candidate discovery through `memory_list()` 6) Invoke confirm mode or force an ambiguous case and confirm the workflow presents the detected session plus 2-3 alternatives 7) Verify the final recovery response includes actionable state and next steps, then routes appropriately to continued `/spec_kit:resume` work or `/memory:search history <spec-folder>` depending on user need | `memory_context(mode: "resume")` is primary after fresh handover handling; fallback chain activates correctly; confirm mode shows alternatives when needed; final response contains actionable continuation state and next-step routing | Command transcript; tool invocation logs for resume, search, and list paths; evidence of crash breadcrumb use if present; final recovery summary showing state, next steps, and routing recommendation | PASS: Recovery follows the documented chain and produces an actionable continuation summary; FAIL: primary recovery skips resume mode, fallback routing is missing, ambiguity is mishandled, or the recovered state is not actionable | Verify `/spec_kit:resume` command routing against `.opencode/command/spec_kit/resume.md`; inspect `memory-context.ts` resume-mode wiring; confirm fallback search anchors and candidate-discovery list behavior; check session-manager breadcrumbs and reusable-session auto-resume settings |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/001-context-recovery-and-continuation.md:24:  1. `memory_context({ input: "resume previous work continue session", mode: "resume", specFolder: "specs/<target-spec>", includeContent: true })` — primary recovery path
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/001-context-recovery-and-continuation.md:29:- Expected: Resume-ready state summary and next steps via `memory_context(mode:"resume")` as primary path.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/001-context-recovery-and-continuation.md:31:- Pass: `memory_context(mode:"resume")` is used as the primary recovery path; continuation context is actionable and specific.

exec
/bin/zsh -lc "sed -n '1,260p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1230,1310p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ────────────────────────────────────────────────────────────────
// MODULE: Memory Context
// ────────────────────────────────────────────────────────────────

import { randomUUID } from 'crypto';

// Layer definitions
import * as layerDefs from '../lib/architecture/layer-definitions.js';
import { checkDatabaseUpdated } from '../core/index.js';
import { toErrorMessage } from '../utils/index.js';

// Intent classifier
import * as intentClassifier from '../lib/search/intent-classifier.js';

// Query-intent routing (Phase 020: structural/semantic/hybrid classification)
import { classifyQueryIntent } from '../lib/code-graph/query-intent-classifier.js';
import { buildContext } from '../lib/code-graph/code-graph-context.js';

// Core handlers for routing
import { handleMemorySearch } from './memory-search.js';
import { handleMemoryMatchTriggers } from './memory-triggers.js';

// Response envelope
import { createMCPErrorResponse, createMCPResponse } from '../lib/response/envelope.js';

// Token estimation
import { estimateTokens } from '../formatters/token-metrics.js';
import {
  getPressureLevel,
  type RuntimeContextStats,
} from '../lib/cognitive/pressure-monitor.js';
import * as workingMemory from '../lib/cognitive/working-memory.js';
import * as sessionManager from '../lib/session/session-manager.js';

// Telemetry
import * as retrievalTelemetry from '../lib/telemetry/retrieval-telemetry.js';
import { initConsumptionLog, logConsumptionEvent } from '../lib/telemetry/consumption-logger.js';
import {
  attachSessionTransitionTrace,
  buildSessionTransitionTrace,
  type SessionTransitionTrace,
} from '../lib/search/session-transition.js';

// Eval logger — fail-safe, no-op when SPECKIT_EVAL_LOGGING !== "true"
import { logSearchQuery, logChannelResult, logFinalResult } from '../lib/eval/eval-logger.js';
import * as vectorIndex from '../lib/search/vector-index.js';

// Shared handler types
import type { MCPResponse, IntentClassification } from './types.js';

// PI-B3: Folder discovery integration
import { discoverSpecFolder, getSpecsBasePaths } from '../lib/search/folder-discovery.js';
import {
  isAutoResumeEnabled,
  isFolderDiscoveryEnabled,
  isPressurePolicyEnabled,
  isIntentAutoProfileEnabled,
} from '../lib/search/search-flags.js';

// Feature catalog: Unified context retrieval (memory_context)
// Feature catalog: Dual-scope memory auto-surface
// Feature catalog: Provenance-rich response envelopes


/* ───────────────────────────────────────────────────────────────
   1. TYPES
──────────────────────────────────────────────────────────────── */

interface ContextMode {
  readonly name: string;
  readonly description: string;
  readonly strategy: string;
  readonly tokenBudget?: number;
}

interface ContextOptions {
  specFolder?: string;
  folderBoost?: { folder: string; factor: number };
  tenantId?: string;
  userId?: string;
  agentId?: string;
  sharedSpaceId?: string;
  limit?: number;
  sessionId?: string;
  enableDedup?: boolean;
  includeContent?: boolean;
  includeTrace?: boolean; // CHK-040: Forward to internal memory_search calls
  anchors?: string[];
  profile?: string;
  sessionTransition?: SessionTransitionTrace;
}

interface SessionLifecycleMetadata {
  sessionScope: 'caller' | 'ephemeral';
  requestedSessionId: string | null;
  effectiveSessionId: string;
  resumed: boolean;
  eventCounterStart: number;
  resumedContextCount: number;
}

interface ContextResult extends Record<string, unknown> {
  strategy: string;
  mode: string;
}

interface LayerInfo {
  tokenBudget?: number;
}

interface ContextArgs {
  input: string;
  mode?: string;
  intent?: string;
  specFolder?: string;
  tenantId?: string;
  userId?: string;
  agentId?: string;
  sharedSpaceId?: string;
  limit?: number;
  sessionId?: string;
  enableDedup?: boolean;
  includeContent?: boolean;
  includeTrace?: boolean; // CHK-040: Forward to internal memory_search calls
  tokenUsage?: number;
  anchors?: string[];
  /** REQ-D5-003: Presentation profile ('quick'|'research'|'resume'|'debug'). Default: full response. */
  profile?: string;
}

/** T205: Token budget enforcement metadata */
interface TokenBudgetEnforcement {
  budgetTokens: number;
  actualTokens: number;
  enforced: boolean;
  truncated: boolean;
  originalResultCount?: number;
  returnedResultCount?: number;
}

type PressureOverrideTargetMode = 'quick' | 'focused' | null;

interface SessionLifecycleResolution {
  requestedSessionId: string | null;
  effectiveSessionId: string;
  resumed: boolean;
  priorMode: string | null;
  counter: number;
  error?: string;
}

interface EffectiveModeIntentClassification {
  detectedIntent?: string;
  intentConfidence: number;
  resumeHeuristicApplied: boolean;
  source: 'explicit' | 'auto-detected';
}

interface EffectiveModeResolution {
  effectiveMode: string;
  pressureOverrideApplied: boolean;
  pressureOverrideTargetMode: PressureOverrideTargetMode;
  pressureWarning: string | null;
  intentClassification: EffectiveModeIntentClassification;
}

interface BuildResponseMetaParams {
  effectiveMode: string;
  requestedMode: string;
  tracedResult: ContextResult;
  pressurePolicy: {
    level: string;
    ratio: number | null;
    source: string;
    warning: string | null;
  };
  pressureOverrideApplied: boolean;
  pressureOverrideTargetMode: PressureOverrideTargetMode;
  pressureWarning: string | null;
  sessionLifecycle: SessionLifecycleMetadata;
  effectiveBudget: number;
  enforcement: TokenBudgetEnforcement;
  intentClassification: EffectiveModeIntentClassification;
  discoveredFolder?: string;
  includeTrace: boolean;
  sessionTransition: SessionTransitionTrace;
  structuralRoutingNudge: StructuralRoutingNudgeMeta | null;
}

interface StrategyErrorPayload {
  error: string;
  code: string;
  details: Record<string, unknown>;
  hints: string[];
  severity: string | null;
}

interface StructuralRoutingNudgeMeta {
  advisory: true;
  readiness: 'ready';
  preferredTool: 'code_graph_query';
  message: string;
  preservesAuthority: 'session_bootstrap';
}

const STRUCTURAL_ROUTING_PATTERNS = [
  /\b(?:who|what)\s+calls?\b/i,
  /\bcallers?\s+of\b/i,
  /\b(?:who|what)\s+imports?\b/i,
  /\bimports?\s+of\b/i,
  /\b(?:show|list)\s+(?:the\s+)?outline\b/i,
  /\boutline\s+of\b/i,
  /\bdependenc(?:y|ies)\b/i,
  /\bdependents?\b/i,
  /\bwhat\s+extends\b/i,
];

function extractResultRowsFromContextResponse(responseText: string): Array<Record<string, unknown>> {
  try {
    const parsed = JSON.parse(responseText) as Record<string, unknown>;
    const outerData = parsed?.data as Record<string, unknown> | undefined;

    const directRows = Array.isArray(outerData?.results)
      ? outerData.results as Array<Record<string, unknown>>
      : null;
    if (directRows) {
      return directRows;
    }

    const nestedContent = Array.isArray(outerData?.content)
      ? outerData.content as Array<{ type?: string; text?: string }>
      : [];
    const nestedText = nestedContent[0]?.text;
    if (typeof nestedText !== 'string' || nestedText.length === 0) {
      return [];
    }

    const nestedEnvelope = JSON.parse(nestedText) as Record<string, unknown>;
    const nestedData = nestedEnvelope?.data as Record<string, unknown> | undefined;
    return Array.isArray(nestedData?.results)
      ? nestedData.results as Array<Record<string, unknown>>
      : [];
  } catch {
    return [];
  }
}

function extractStrategyError(result: ContextResult): StrategyErrorPayload | null {
  if ((result as Record<string, unknown>).isError !== true) {
    return null;
  }

  const content = Array.isArray((result as Record<string, unknown>).content)
    ? ((result as Record<string, unknown>).content as Array<{ text?: string }>)
    : [];
  const responseText = content[0]?.text;
  if (typeof responseText !== 'string' || responseText.length === 0) {
    return {
      error: 'Context strategy failed',
      code: 'E_STRATEGY',

 succeeded in 0ms:
    console.error(`[session-manager] get_interrupted_sessions failed: ${message}`);
    return { success: false, sessions: [], error: message };
  }
}

/* ───────────────────────────────────────────────────────────────
   10. CONTINUE SESSION GENERATION
──────────────────────────────────────────────────────────────── */

function generateContinueSessionMd(sessionState: ContinueSessionInput): string {
  const {
    sessionId,
    specFolder,
    currentTask,
    lastAction,
    contextSummary,
    pendingWork,
    data,
  } = sessionState;

  const timestamp = new Date().toISOString();
  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const resumeCommand = specFolder
    ? `/spec_kit:resume ${specFolder}`
    : sessionId
      ? `memory_search({ sessionId: "${sessionId}" })`
      : 'memory_search({ query: "last session" })';

  const content = `# CONTINUE SESSION

> **Generated:** ${dateStr}
> **Purpose:** Enable seamless session recovery after context compaction, crashes, or breaks.
> **Pattern Source:** Adopted from seu-claude's CONTINUE_SESSION.md approach.

---

## Session State

| Field | Value |
|-------|-------|
| **Session ID** | \`${sessionId || 'N/A'}\` |
| **Spec Folder** | ${specFolder || 'N/A'} |
| **Current Task** | ${currentTask || 'N/A'} |
| **Last Action** | ${lastAction || 'N/A'} |
| **Status** | Active |
| **Updated** | ${timestamp} |

---

## Context Summary

${contextSummary || '_No context summary available._'}

---

## Pending Work

${pendingWork || '_No pending work recorded._'}

---

## Quick Resume

To continue this session, use:

\`\`\`
${resumeCommand}
\`\`\`

${data ? `
---

## Additional State Data

exec
/bin/zsh -lc "sed -n '740,810p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// Don't support. If index changes significantly, restart the server to refresh instructions.
async function buildServerInstructions(): Promise<string> {
  if (!isDynamicInitEnabled()) {
    return '';
  }

  const stats = await getMemoryStats();
  const channels: string[] = ['vector', 'fts5'];
  if (bm25Index.isBm25Enabled()) channels.push('bm25');
  if (isGraphUnifiedEnabled()) channels.push('graph');
  if (isDegreeBoostEnabled()) channels.push('degree');
  const staleWarning = stats.staleCount > 10
    ? ` Warning: ${stats.staleCount} stale memories detected. Consider running memory_index_scan.`
    : '';

  const lines = [
    `Spec Kit Memory MCP has ${stats.totalMemories} indexed memories across ${stats.specFolderCount} spec folders.`,
    `Active memories: ${stats.activeCount}. Stale memories: ${stats.staleCount}.`,
    `Search channels: ${channels.join(', ')}.`,
    'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
    'Graph retrieval: memory_search supports retrievalLevel (local/global/auto) for entity-level or community-level search. Graph provenance visible via graphEvidence in results.',
    staleWarning.trim(),
  ];

  // Phase 024 / Item 4: Session recovery digest from session-snapshot
  try {
    const { getSessionSnapshot } = await import('./lib/session/session-snapshot.js');
    const snap = getSessionSnapshot();
    const hasData = snap.specFolder || snap.graphFreshness !== 'error' || snap.sessionQuality !== 'unknown';
    if (hasData) {
      const recommended = !snap.primed ? 'call session_bootstrap()' :
        snap.graphFreshness === 'empty' ? 'run code_graph_scan' :
        snap.sessionQuality === 'critical' ? 'call memory_context(resume)' : 'ready';
      lines.push('');
      lines.push('## Session Recovery');
      lines.push(`- Last spec folder: ${snap.specFolder || 'none'}`);
      lines.push(`- Code graph: ${snap.graphFreshness}`);
      lines.push(`- Session quality: ${snap.sessionQuality}`);
      lines.push(`- Recommended: ${recommended}`);
    }
  } catch { /* session-snapshot not available — skip digest */ }

  // Phase 027: Structural bootstrap guidance for non-hook runtimes
  lines.push('');
  lines.push('## Structural Bootstrap (Phase 027)');
  lines.push('Non-hook runtimes receive automatic structural context via session_bootstrap, session_resume, and auto-prime.');
  lines.push('- If structural context shows "ready": code_graph_query is available for structural lookups');
  lines.push('- If "stale" or "missing": call session_bootstrap first to refresh structural context');
  lines.push('- Recovery priority: session_bootstrap → session_resume → code_graph_scan');

  // Phase 024: Tool routing decision tree
  try {
    const { getSessionSnapshot: getSnap } = await import('./lib/session/session-snapshot.js');
    const snap = getSnap();
    const routingRules: string[] = [];
    if (snap.cocoIndexAvailable) {
      routingRules.push('Semantic/concept code search → mcp__cocoindex_code__search');
    }
    if (snap.graphFreshness === 'fresh' || snap.graphFreshness === 'stale') {
      routingRules.push('Structural queries (callers, imports, deps) → code_graph_query');
    }
    routingRules.push('Exact text/regex matching → Grep tool');
    if (routingRules.length > 0) {
      lines.push('');
      lines.push('## Tool Routing');
      for (const rule of routingRules) {
        lines.push(`- ${rule}`);
      }
    }
  } catch { /* tool routing snapshot unavailable — skip */ }


exec
/bin/zsh -lc "sed -n '520,650p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:

**Ablation study framework** -- turns off each search channel one at a time and measures quality degradation (Recall@20 delta). Identifies which components are critical.

**Shadow scoring with holdout evaluation** -- tests proposed ranking improvements on a fixed test set before they go live. A new approach only reaches production after it proves itself.

**Learned Stage 2 weight combiner** -- learns the best combination of scoring signals from actual usage data. Runs in shadow mode only, without affecting live results.

**Scoring observability** -- randomly samples scoring events and saves before-and-after snapshots for debugging.

---

#### 3.1.13 CODE GRAPH

The code graph system provides structural code analysis via tree-sitter AST parsing and SQLite storage. It maps what connects to what in the codebase: function calls, imports, class hierarchy and containment.

**Architecture:** CocoIndex (semantic, external MCP) finds code by concept. Code Graph (structural, this server) maps imports, calls and hierarchy. Memory (session, this server) preserves decisions. The compact-merger combines all three under a 4000-token budget for compaction injection.

**Parser:** Tree-sitter WASM is the default parser (JS/TS/Python/Shell). Set `SPECKIT_PARSER=regex` for regex fallback.

**Storage:** `database/code-graph.sqlite` (separate from `database/context-index.sqlite`), with tables: `code_files`, `code_nodes`, `code_edges`, and `code_graph_metadata`.

**Edge types:** `CONTAINS`, `CALLS`, `IMPORTS`, `EXPORTS`, `EXTENDS`, `IMPLEMENTS`, `DECORATES`, `OVERRIDES`, `TYPE_OF`.

**Read-path readiness:** `ensureCodeGraphReady()` runs automatically inside `code_graph_query` and `code_graph_context`. It checks graph freshness, returns a `readiness` block, and performs bounded inline selective reindex only when the stale set is small enough to repair safely on the read path. Empty graphs, large stale sets, and other full-scan cases remain explicit `code_graph_scan` work.

**Startup/recovery surfaces:** `session_resume`, `session_bootstrap`, and the startup brief now report freshness-aware graph status instead of count-only health. Startup surfaces are intentionally non-mutating snapshots, so later structural reads may still differ if repo state changes.

**Query routing:** Structural queries (callers, imports, dependencies) go to `code_graph_query`. Semantic and concept queries go to CocoIndex (`mcp__cocoindex_code__search`). Session and memory queries go to `memory_context`.

**Budget allocator floors:** constitutional 700, codeGraph 1200, cocoIndex 900, triggered 400, overflow pool 800 = 4000 total.

---

### 3.2 TOOL REFERENCE

All 47 tools listed by architecture layer. Each entry has a plain-language description and a parameter table. For full Zod schemas with types and defaults, see `tool-schemas.ts`.

**Start here for most tasks**: `memory_context` (L1) automatically figures out what you need. Use the lower-level tools when you want precise control.

---

#### L1: Orchestration (3 tools)

##### `memory_context`

The smart entry point. You describe what you need and it figures out the best way to find it. It reads your query, detects whether you are looking for a decision, debugging context or general knowledge, picks the right search mode and returns the most relevant results. Start here for almost everything.

| Parameter | Type | Notes |
|-----------|------|-------|
| `input` | string | **Required.** Your question or task description |
| `mode` | string | `auto` (default), `quick`, `deep`, `focused`, `resume` |
| `intent` | string | Override detected intent: `add_feature`, `fix_bug`, `refactor`, `security_audit`, `understand`, `find_spec`, `find_decision` |
| `specFolder` | string | Narrow results to a specific spec folder |
| `tenantId` | string | Tenant boundary for governed retrieval |
| `userId` | string | User boundary for governed retrieval |
| `agentId` | string | Agent boundary for governed retrieval |
| `sharedSpaceId` | string | Shared-space boundary for governed retrieval |
| `limit` | number | Max results to return (default varies by mode) |
| `sessionId` | string | Session ID for deduplication across turns |
| `anchors` | string[] | Pull specific sections: `["state", "next-steps"]` |
| `tokenUsage` | number | Current token budget fraction (0.0-1.0) for adaptive depth |
| `enableDedup` | boolean | Skip memories already seen this session |
| `includeContent` | boolean | Include full memory content in response |
| `includeTrace` | boolean | Include retrieval trace for debugging |

```json
{
  "tool": "memory_context",
  "arguments": {
    "input": "implement JWT refresh token rotation",
    "intent": "add_feature",
    "specFolder": "specs/005-auth",
    "anchors": ["decisions", "next-steps"]
  }
}
```

---

##### `session_resume`

Resume session with combined memory, code graph and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. The response carries freshness-aware code-graph status (`fresh`, `stale`, `empty`, `error`) instead of count-only health. For the canonical first-call recovery path on session start or after `/clear`, prefer `session_bootstrap`.

| Parameter | Type | Notes |
|-----------|------|-------|
| `specFolder` | string | Scope resume to a specific spec folder |
| `minimal` | boolean | Skip heavy memory context, return code graph, CocoIndex, structural context, hints, and optional session quality without the full memory payload |

---

##### `session_bootstrap`

Complete session bootstrap in one call. This is the canonical first-call recovery step on session start or after `/clear`. It wraps the full `session_resume` payload plus `session_health` and returns context, health, structural readiness and recommended next actions. Startup/bootstrap surfaces are freshness-aware but non-mutating; use `code_graph_scan` when readiness shows an empty or broad full-scan state.

| Parameter | Type | Notes |
|-----------|------|-------|
| `specFolder` | string | Scope bootstrap to a specific spec folder |

---

#### L2: Core (4 tools)

##### `memory_search`

The main search tool. You type what you are looking for in plain language and the system searches through all stored knowledge to find the best matches. It understands meaning (beyond keywords), so searching for "login problems" can find a document titled "authentication troubleshooting."

| Parameter | Type | Notes |
|-----------|------|-------|
| `query` | string | Free-text search (use `query` OR `concepts`, not both) |
| `concepts` | string[] | AND search: 2-5 strings that must all match |
| `specFolder` | string | Scope to a folder |
| `tenantId` | string | Tenant boundary |
| `userId` | string | User boundary |
| `agentId` | string | Agent boundary |
| `sharedSpaceId` | string | Shared-memory boundary |
| `limit` | number | 1-100 results (default 10) |
| `tier` | string | Filter by importance tier |
| `minState` | string | Minimum state: `HOT`, `WARM`, `COLD`, `DORMANT`, `ARCHIVED` |
| `rerank` | boolean | Apply cross-encoder reranking |
| `useDecay` | boolean | Apply FSRS decay to scores |
| `intent` | string | Adjust channel weights for task type |
| `mode` | string | `auto` or `deep` |
| `min_quality_score` | number | Filter out low-quality results |

```json
{
  "tool": "memory_search",
  "arguments": {
    "query": "database migration strategy",
    "specFolder": "specs/010-db-refactor",
    "rerank": true,

exec
/bin/zsh -lc "sed -n '320,520p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
      'freshness',
      'unknown_scope',
      'Cached summary scope was unknown, so the consumer failed closed instead of guessing.',
    );
  }

  const continuityText = `Last session worked on: ${cachedSpecFolder}\nSummary: ${summaryText}`;
  return {
    status: 'accepted',
    category: 'accepted',
    reason: 'accepted',
    detail: 'Cached summary passed fidelity and freshness gates and may be used additively.',
    cachedSummary: {
      schemaVersion: candidate.schemaVersion,
      lastSpecFolder: cachedSpecFolder,
      summaryText,
      extractedAt: candidate.extractedAt!,
      lastClaudeTurnAt: producerMetadata.lastClaudeTurnAt!,
      transcriptPath: transcript.path,
      transcriptFingerprint: transcript.fingerprint,
      cacheCreationInputTokens: cacheTokens.cacheCreationInputTokens,
      cacheReadInputTokens: cacheTokens.cacheReadInputTokens,
      continuityText,
      startupHint: continuityText,
    },
  };
}

export function getCachedSessionSummaryDecision(
  options: {
    specFolder?: string;
    claudeSessionId?: string;
    nowMs?: number;
    maxAgeMs?: number;
    state?: HookState | null;
  } = {},
): CachedSessionSummaryDecision {
  const candidate = buildCachedSessionSummaryCandidate(
    options.state ?? loadMostRecentState({
      maxAgeMs: options.maxAgeMs,
      scope: {
        specFolder: options.specFolder,
        claudeSessionId: options.claudeSessionId,
      },
    }),
  );
  return evaluateCachedSessionSummaryCandidate(candidate, options);
}

export function applyCachedSummaryAdditively<T extends Record<string, unknown>>(
  baseline: T,
  decision: CachedSessionSummaryDecision,
): T & { cachedSummary?: CachedSessionSummary } {
  if (decision.status !== 'accepted' || !decision.cachedSummary) {
    return { ...baseline };
  }

  return {
    ...baseline,
    cachedSummary: decision.cachedSummary,
  };
}

export function logCachedSummaryDecision(
  surface: string,
  decision: CachedSessionSummaryDecision,
): void {
  if (decision.status === 'accepted' || decision.reason === 'missing_state') {
    return;
  }

  console.error(
    `[${surface}] Cached summary rejected (${decision.category}): ${decision.reason} — ${decision.detail}`,
  );
}

/* ───────────────────────────────────────────────────────────────
   3. HANDLER
──────────────────────────────────────────────────────────────── */

/** Handle session_resume tool call — composite resume with memory + graph + cocoindex */
export async function handleSessionResume(args: SessionResumeArgs): Promise<MCPResponse> {
  // F052: Record memory recovery metric for session_resume
  recordMetricEvent({ kind: 'memory_recovery' });

  // Phase 024: Record bootstrap telemetry
  const startMs = Date.now();
  const hints: string[] = [];

  // ── Sub-call 1: Memory context resume (skip in minimal mode) ──
  let memoryResult: Record<string, unknown> = {};
  if (args.minimal) {
    memoryResult = { skipped: true, reason: 'minimal mode' };
  } else {
    try {
      const mcpResponse = await handleMemoryContext({
        input: 'resume previous work continue session',
        mode: 'resume',
        profile: 'resume',
        specFolder: args.specFolder,
      });
      // Extract data from MCP envelope
      if (mcpResponse?.content?.[0]?.text) {
        try {
          const parsed = JSON.parse(mcpResponse.content[0].text);
          memoryResult = parsed?.data ?? parsed ?? {};
        } catch {
          memoryResult = { raw: mcpResponse.content[0].text };
        }
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      memoryResult = { error: message };
      hints.push('Memory resume failed. Try memory_context manually.');
    }
  }

  // ── Sub-call 2: Code graph status ───────────────────────────
  let codeGraph: CodeGraphStatus = {
    status: 'error',
    lastScan: null,
    nodeCount: 0,
    edgeCount: 0,
    fileCount: 0,
  };
  try {
    const stats = graphDb.getStats();
    const freshness = getGraphFreshness(process.cwd());
    codeGraph = {
      status: freshness,
      lastScan: stats.lastScanTimestamp,
      nodeCount: stats.totalNodes,
      edgeCount: stats.totalEdges,
      fileCount: stats.totalFiles,
    };
    // Graph status hints deferred to structural contract (Phase 027)
    // — structural context hints at lines 128-130 provide preferred recovery path
  } catch {
    codeGraph = { status: 'error', lastScan: null, nodeCount: 0, edgeCount: 0, fileCount: 0 };
    hints.push('Code graph unavailable. Run `code_graph_scan` to initialize.');
  }

  // ── Sub-call 3: CocoIndex availability (F046/F051: shared helper) ──
  const cocoIndex: CocoIndexStatus = {
    available: isCocoIndexAvailable(),
    binaryPath: '.opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc',
  };
  if (!cocoIndex.available) {
    hints.push('CocoIndex not installed. Install: `bash .opencode/skill/mcp-coco-index/scripts/install.sh`');
  }

  // Phase 027: Structural bootstrap contract for resume surface
  const structuralContext = buildStructuralBootstrapContract('session_resume');
  if (structuralContext.status === 'stale' || structuralContext.status === 'missing') {
    hints.push(`Structural context is ${structuralContext.status}. Call session_bootstrap to refresh.`);
  }

  const structuralTrust = buildStructuralContextTrust(structuralContext);

  // Keep live resume authoritative; cached continuity only appends bounded notes when every gate passes.
  const cachedSummaryDecision = getCachedSessionSummaryDecision({
    specFolder: args.specFolder,
    claudeSessionId: typeof args.sessionId === 'string' ? args.sessionId : undefined,
  });
  if (cachedSummaryDecision.status === 'accepted') {
    hints.push('Cached continuity summary accepted as additive resume context.');
  } else {
    logCachedSummaryDecision('session_resume', cachedSummaryDecision);
  }

  let sessionQuality: SessionResumeResult['sessionQuality'];
  if (args.minimal) {
    try {
      sessionQuality = computeQualityScore().level;
    } catch {
      sessionQuality = 'unknown';
    }
  }

  const memoryCertainty: SharedPayloadCertainty = args.minimal
    ? 'defaulted'
    : memoryResult.error
      ? 'unknown'
      : 'estimated';
  const cachedCertainty: SharedPayloadCertainty = cachedSummaryDecision.status === 'accepted' ? 'estimated' : 'defaulted';
  const codeGraphCertainty: SharedPayloadCertainty = codeGraph.status === 'error' ? 'unknown' : 'exact';
  const cocoIndexCertainty: SharedPayloadCertainty = 'exact';
  const structuralCertainty: SharedPayloadCertainty = 'exact';

  const payloadSections: SharedPayloadSection[] = [
    {
      key: 'memory-resume',
      title: 'Memory Resume',
      content: summarizeUnknown(memoryResult),
      source: 'memory',
      certainty: memoryCertainty,
    },
  ];
  if (cachedSummaryDecision.status === 'accepted' && cachedSummaryDecision.cachedSummary) {
    payloadSections.push({
      key: 'cached-continuity',

exec
/bin/zsh -lc "rg -n \"handleMemoryContext|mode: 'resume'|mode: \\\"resume\\\"|cachedSummary|continuity|startupHint|buildStructuralBootstrapContract|minimal\" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
10:import { handleMemoryContext } from './memory-context.js';
14:import { buildStructuralBootstrapContract } from '../lib/session/session-snapshot.js';
63:  continuityText: string;
64:  startupHint: string;
84:  cachedSummary: CachedSessionSummary | null;
90:  minimal?: boolean;
110:  cachedSummary?: CachedSessionSummaryDecision;
170:    cachedSummary: null,
200:    return rejectCachedSummary('fidelity', 'missing_state', 'No recent hook state was available for cached continuity reuse.');
216:      'Cached continuity requires a non-empty session summary with a valid extractedAt timestamp.',
225:      'Producer metadata from packet 002 was missing, so cached continuity cannot be trusted.',
326:  const continuityText = `Last session worked on: ${cachedSpecFolder}\nSummary: ${summaryText}`;
332:    cachedSummary: {
342:      continuityText,
343:      startupHint: continuityText,
372:): T & { cachedSummary?: CachedSessionSummary } {
373:  if (decision.status !== 'accepted' || !decision.cachedSummary) {
379:    cachedSummary: decision.cachedSummary,
409:  // ── Sub-call 1: Memory context resume (skip in minimal mode) ──
411:  if (args.minimal) {
412:    memoryResult = { skipped: true, reason: 'minimal mode' };
415:      const mcpResponse = await handleMemoryContext({
417:        mode: 'resume',
472:  const structuralContext = buildStructuralBootstrapContract('session_resume');
479:  // Keep live resume authoritative; cached continuity only appends bounded notes when every gate passes.
480:  const cachedSummaryDecision = getCachedSessionSummaryDecision({
484:  if (cachedSummaryDecision.status === 'accepted') {
485:    hints.push('Cached continuity summary accepted as additive resume context.');
487:    logCachedSummaryDecision('session_resume', cachedSummaryDecision);
491:  if (args.minimal) {
499:  const memoryCertainty: SharedPayloadCertainty = args.minimal
504:  const cachedCertainty: SharedPayloadCertainty = cachedSummaryDecision.status === 'accepted' ? 'estimated' : 'defaulted';
518:  if (cachedSummaryDecision.status === 'accepted' && cachedSummaryDecision.cachedSummary) {
520:      key: 'cached-continuity',
523:        cachedSummaryDecision.cachedSummary.continuityText,
524:        `Cache tokens: create=${cachedSummaryDecision.cachedSummary.cacheCreationInputTokens}; read=${cachedSummaryDecision.cachedSummary.cacheReadInputTokens}`,
525:        `Transcript: ${cachedSummaryDecision.cachedSummary.transcriptFingerprint}`,
564:      ...(cachedSummaryDecision.status === 'accepted' ? [{ label: 'cached', certainty: cachedCertainty }] : []),
587:    cachedSummary: cachedSummaryDecision,
600:  if (!args.minimal) {

exec
/bin/zsh -lc "sed -n '520,760p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
      key: 'cached-continuity',
      title: 'Cached Continuity',
      content: [
        cachedSummaryDecision.cachedSummary.continuityText,
        `Cache tokens: create=${cachedSummaryDecision.cachedSummary.cacheCreationInputTokens}; read=${cachedSummaryDecision.cachedSummary.cacheReadInputTokens}`,
        `Transcript: ${cachedSummaryDecision.cachedSummary.transcriptFingerprint}`,
      ].join('\n'),
      source: 'session',
      certainty: cachedCertainty,
    });
  }
  payloadSections.push(
    {
      key: 'code-graph-status',
      title: 'Code Graph Status',
      content: `status=${codeGraph.status}; files=${codeGraph.fileCount}; nodes=${codeGraph.nodeCount}; edges=${codeGraph.edgeCount}; lastScan=${codeGraph.lastScan ?? 'unknown'}`,
      source: 'code-graph',
      certainty: codeGraphCertainty,
    },
    {
      key: 'cocoindex-status',
      title: 'CocoIndex Status',
      content: cocoIndex.available
        ? `available at ${cocoIndex.binaryPath}`
        : `unavailable; expected at ${cocoIndex.binaryPath}`,
      source: 'semantic',
      certainty: cocoIndexCertainty,
    },
    {
      key: 'structural-context',
      title: 'Structural Context',
      content: structuralContext.summary,
      source: 'code-graph',
      certainty: structuralCertainty,
      structuralTrust,
    },
  );

  // ── Build composite result ──────────────────────────────────
  const payloadContract = createSharedPayloadEnvelope({
    kind: 'resume',
    sections: payloadSections,
    summary: `Resume payload: ${summarizeCertaintyContract([
      { label: 'memory', certainty: memoryCertainty },
      ...(cachedSummaryDecision.status === 'accepted' ? [{ label: 'cached', certainty: cachedCertainty }] : []),
      { label: 'graph', certainty: codeGraphCertainty },
      { label: 'cocoindex', certainty: cocoIndexCertainty },
      { label: 'structural', certainty: structuralCertainty },
    ])}; graph=${codeGraph.status}; graphStatus=${codeGraph.status}`,
    provenance: {
      producer: 'session_resume',
      sourceSurface: 'session_resume',
      trustState: trustStateFromStructuralStatus(structuralContext.status),
      generatedAt: new Date().toISOString(),
      lastUpdated: structuralContext.provenance?.lastUpdated ?? codeGraph.lastScan,
      sourceRefs: ['memory-context', 'code-graph-db', 'cocoindex-path', 'session-snapshot'],
    },
  });
  const graphOps = buildCodeGraphOpsContract({
    graphFreshness: codeGraph.status as GraphFreshness,
    sourceSurface: 'session_resume',
  });

  const result: SessionResumeResult = {
    memory: memoryResult,
    codeGraph,
    cocoIndex,
    cachedSummary: cachedSummaryDecision,
    structuralContext,
    payloadContract,
    opencodeTransport: buildOpenCodeTransportPlan({
      resumePayload: payloadContract,
      specFolder: args.specFolder ?? null,
    }),
    graphOps,
    ...(sessionQuality ? { sessionQuality } : {}),
    hints,
  };

  // Phase 024 / Item 9: Record bootstrap telemetry
  if (!args.minimal) {
    recordBootstrapEvent(
      'tool',
      Date.now() - startMs,
      'full',
    );
  }

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({ status: 'ok', data: result }, null, 2),
    }],
  };
}

exec
/bin/zsh -lc 'rg -n "compact-merger|compaction injection|4000-token budget|session recovery|resume mode|anchors" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1269:> **Purpose:** Enable seamless session recovery after context compaction, crashes, or breaks.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:68:| `preflight.ts` | All validation logic: anchors, duplicates, tokens, content size, unified preflight |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:69:| `save-quality-gate.ts` | 3-layer pre-storage quality gate: structural validation, content quality scoring (title, triggers, length, anchors, metadata, signal density), and semantic dedup. Behind `SPECKIT_SAVE_QUALITY_GATE` flag with 14-day warn-only graduation period |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:160:| Layer 2 | Content Quality | Weighted signal density across 5 dimensions (title 0.25, triggers 0.20, length 0.20, anchors 0.15, metadata 0.20). Threshold: 0.4 |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:177:| `scoreAnchorQuality(anchors)` | Layer 2 dimension: anchor quality (0-1) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:202:  check_anchors: true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:220:// result.anchors: ['summary', 'decisions', ...]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:259:  anchors: ['summary', 'decisions'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:83:  anchors?: string[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:515: * @param anchors - Array of anchor IDs found in content
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:516: * @returns Score: 0 anchors=0, 1-2=0.5, 3+=1.0
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:518:export function scoreAnchorQuality(anchors: string[]): number {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:519:  const count = anchors.length;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:606:  anchors?: string[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:612:    anchorQuality: scoreAnchorQuality(params.anchors ?? []),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:804:    anchor: params.anchors?.[0] ?? null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:813:    anchors: params.anchors,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:57:  anchors: string[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:133:  check_anchors?: boolean;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:138:  strict_anchors?: boolean;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:307:    anchors: [],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:340:        suggestion: `Rename one of the duplicate anchors to a unique ID`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:382:      result.anchors.push(anchorId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:767:    check_anchors = true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:772:    strict_anchors = false,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:813:  if (check_anchors && content) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:814:    const anchorResult = validateAnchorFormat(content, { strict: strict_anchors });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:819:      if (strict_anchors) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:153:        // S1: strip structural noise (frontmatter, anchors, HTML comments) before embedding
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:9:// Structural noise (YAML frontmatter, HTML comment anchors, pipe
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:38:  // Without the `m` flag, `^` anchors to position 0 only (document start),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:257:  // Steps as the embedding pipeline (frontmatter, anchors, HTML
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/README.md:36:| `content-normalizer.ts` | Strips frontmatter, anchors, HTML comments, fences, tables, list syntax, and heading markers before embedding or BM25 work |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/README.md:37:| `memory-parser.ts` | Parses titles, trigger phrases, tiers, document type, causal links, anchors, and content hashes from markdown files |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:850:/** Extract content from anchors */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:857:  const anchors: Record<string, string> = {};
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:873:      anchors[id] = innerContent.trim();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:877:  return anchors;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:898:  // Validate anchors (warnings only - don't block indexing)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:88:  anchors?: string[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:126:  anchors?: string[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:676:    description: 'Resume previous work with state and next-steps anchors',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:733:    anchors: options.anchors,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:764:    anchors: options.anchors,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:784:  const resumeAnchors = options.anchors || ['state', 'next-steps', 'summary', 'blockers'];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:798:    anchors: resumeAnchors,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1079: * @param args - Context retrieval arguments (intent, mode, specFolder, anchors, etc.)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1111:    anchors
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1290:    anchors,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:218:      'Use anchors to organize content within the file',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:469:      'Consider using /spec_kit:resume for session recovery'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:569:      'Use anchors to allow partial loading',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:767:        'Ensure anchors use correct format'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:240:      "expectedResultDescription": "Topic-scoped resume query. Should surface spec folder 001-sprint-0-measurement-foundation memories with state/next-steps anchors.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:261:      "notes": "From T007b Pattern 4: decision archaeology with anchors=['decisions', 'rationale']."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:341:      "notes": "From T007b Pattern 9: sk-git skill session recovery with domain-specific phrase."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:351:      "notes": "From T007b Pattern 10: completion verification using anchors=['state', 'checklist']."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:179:            anchors: result.resolvedAnchors.map(a => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:27:  anchors: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:75:  anchors: 0.30,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:126: *   - No anchors present at all → score 0.5 (neutral; anchors are optional)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:127: *   - All anchors properly paired  → score 1.0
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:139:  // Match opening anchors: <!-- ANCHOR: name -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:141:  // Match closing anchors: <!-- /ANCHOR: name -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:155:  // No anchors at all — neutral score
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:160:  const countAnchors = (anchors: string[]): Map<string, number> => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:162:    for (const name of anchors) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:205:  // Proportional: correct pairs / total unique anchors
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:373: *   - anchors   × 0.30
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:386: *   - `breakdown` — Per-dimension raw sub-scores (`triggers`, `anchors`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:389: *     in order: triggers → anchors → budget → coherence.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:402:    anchorResult.score * QUALITY_WEIGHTS.anchors +
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:410:      anchors: anchorResult.score,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:456:  // O2-6: Fix #3 (trim) runs BEFORE Fix #2 (anchors) to prevent trim from
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:519: * Appends <!-- /ANCHOR: name --> at the end of content for unclosed anchors.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:536:  const countAnchors = (anchors: string[]): Map<string, number> => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:538:    for (const name of anchors) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:558:  // Append closing tags for unclosed anchors
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:175:    && sufficiencyResult.evidenceCounts.anchors >= 1
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:226:      const rejectScore = { total: 0, breakdown: { triggers: 0, anchors: 0, budget: 0, coherence: 0 }, issues: [`V-rule hard block: ${failedRuleIds.join(', ')}`] };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:243:          evidenceCounts: { primary: 0, support: 0, total: 0, semanticChars: 0, uniqueWords: 0, anchors: 0, triggerPhrases: 0 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1292:        check_anchors: true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1297:        strict_anchors: false,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:192:  anchors?: string[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:509:    anchors,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:739:    anchors,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:790:      anchors,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:891:      if (Array.isArray(anchors) && anchors.length > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:892:        retrievalSessionStateManager.setAnchors(sessionId, anchors);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1001:      anchors,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:257:  - `memory-parser.ts` — main parser for anchors, metadata, causal links, and document classification.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/chunking/chunk-thinning.ts:106:  // Anchor score: 1.0 if chunk has anchors, 0.0 if not
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:14://              Structured continuation shape for session recovery.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:198:  // Suggest anchor-specific follow-up if anchors were matched
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:203:    followUps.push('Search with anchors[] to retrieve specific sections directly');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:238:    const anchors = signals
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:242:    if (hasAnchor && anchors.length > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:243:      steps.push(`Review ${anchors.join(', ')} section in result #${results.indexOf(result) + 1}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts:7:// Splitting when anchors are absent.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts:75: * while preserving uncovered text between anchors as unanchored sections.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts:143: * Small adjacent anchors are merged; large anchors become their own chunk.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/chunking/README.md:36:- **Anchor chunking** detects `<!-- ANCHOR:id -->` / `<!-- /ANCHOR:id -->` tag pairs in content and groups anchor sections into chunks that stay under a target size. When no anchors are present, it falls back to structure-aware markdown splitting on H1/H2 headings.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/chunking/README.md:47:| Anchor weight 0.6 vs density 0.4 | Author-placed anchors are a stronger quality signal than computed density metrics. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/chunking/README.md:67:| `anchor-chunker.ts` | Extracts anchor sections from content via regex, groups them into target-sized chunks, and falls back to H1/H2 heading-based splitting when fewer than 2 anchors are found. Exports the `AnchorChunk` and `ChunkingResult` types used by downstream consumers. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/chunking/README.md:100:      -> Try anchor extraction (>= 2 anchors?)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/index.ts:11:export * from './compact-merger.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:5:// into a unified compact brief for compaction injection.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:212:        sourceRefs: ['budget-allocator', 'compact-merger'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1269:> **Purpose:** Enable seamless session recovery after context compaction, crashes, or breaks.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/README.md:364:| **Options** | `limit`, `threshold`, `specFolder`, `anchors` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/README.md:16:| `compact-merger.ts` | 3-source merge (Memory + Code Graph + CocoIndex) for compaction |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/README.md:26:The compact-merger combines all three under a 4000-token budget for compaction injection.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:9:// 3. Stateful session tracking — questions, anchors, seen items
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:151:   * Set preferred anchors for the session.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:154:   * @param anchors - Array of preferred anchor names.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:156:  setAnchors(sessionId: string, anchors: string[]): void {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:158:    session.preferredAnchors = [...anchors];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:46:/** Build context from resolved anchors using specified query mode */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:74:    // Deadline check: stop processing further anchors if over budget
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:125:    textBrief: 'No anchors resolved. Try `code_graph_scan` first, or provide a `subject` or `seeds[]`.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:133:function buildCombinedSummary(anchors: ArtifactRef[], sections: GraphContextSection[]): string {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:134:  if (anchors.length === 0) return 'No anchors resolved.';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:137:  const files = new Set(anchors.map(a => a.filePath));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:138:  const topAnchor = anchors[0];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:140:  return `${anchors.length} anchor(s) across ${files.size} file(s): ${topName} + ${totalNodes} symbols, ${totalEdges} relationships`;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:144:function suggestNextActions(anchors: ArtifactRef[], sections: GraphContextSection[], mode: QueryMode): string[] {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:152:  if (anchors.some(a => a.resolution === 'file_anchor')) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:153:    actions.push('Run `code_graph_scan` to improve resolution (file anchors found)');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:281:function formatTextBrief(sections: GraphContextSection[], budgetTokens: number, _anchors?: ArtifactRef[]): string {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:93:| `/spec_kit:resume` | Continue or recover an interrupted spec-folder session through the broader memory/session recovery stack | Broad helper surface; primary chain uses 3 shared memory tools |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:535:**Architecture:** CocoIndex (semantic, external MCP) finds code by concept. Code Graph (structural, this server) maps imports, calls and hierarchy. Memory (session, this server) preserves decisions. The compact-merger combines all three under a 4000-token budget for compaction injection.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:579:| `anchors` | string[] | Pull specific sections: `["state", "next-steps"]` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:592:    "anchors": ["decisions", "next-steps"]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1332:    "anchors": ["decisions", "state", "next-steps"]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:114:  anchors: optionalStringArray,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:138:  anchors: optionalStringArray,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:462:  memory_context: ['input', 'mode', 'intent', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'sessionId', 'enableDedup', 'includeContent', 'includeTrace', 'tokenUsage', 'anchors', 'profile'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:463:  memory_search: ['cursor', 'query', 'concepts', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'sessionId', 'enableDedup', 'tier', 'contextType', 'useDecay', 'includeContiguity', 'includeConstitutional', 'enableSessionBoost', 'enableCausalBoost', 'includeContent', 'anchors', 'min_quality_score', 'minQualityScore', 'bypassCache', 'rerank', 'applyLengthPenalty', 'applyStateLimits', 'minState', 'intent', 'autoDetectIntent', 'trackAccess', 'includeArchived', 'mode', 'includeTrace', 'profile'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:257:  - `memory-parser.ts` — main parser for anchors, metadata, causal links, and document classification.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:210:  anchors: ['implementation'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:68:| `preflight.ts` | All validation logic: anchors, duplicates, tokens, content size, unified preflight |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:69:| `save-quality-gate.ts` | 3-layer pre-storage quality gate: structural validation, content quality scoring (title, triggers, length, anchors, metadata, signal density), and semantic dedup. Behind `SPECKIT_SAVE_QUALITY_GATE` flag with 14-day warn-only graduation period |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:160:| Layer 2 | Content Quality | Weighted signal density across 5 dimensions (title 0.25, triggers 0.20, length 0.20, anchors 0.15, metadata 0.20). Threshold: 0.4 |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:177:| `scoreAnchorQuality(anchors)` | Layer 2 dimension: anchor quality (0-1) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:202:  check_anchors: true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:220:// result.anchors: ['summary', 'decisions', ...]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:259:  anchors: ['summary', 'decisions'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:210:  anchors: ['implementation'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:137:  anchors?: string[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:83:  anchors?: string[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:515: * @param anchors - Array of anchor IDs found in content
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:516: * @returns Score: 0 anchors=0, 1-2=0.5, 3+=1.0
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:518:export function scoreAnchorQuality(anchors: string[]): number {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:519:  const count = anchors.length;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:606:  anchors?: string[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:612:    anchorQuality: scoreAnchorQuality(params.anchors ?? []),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:804:    anchor: params.anchors?.[0] ?? null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:813:    anchors: params.anchors,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:687:| 2. Content Quality | 5-dimension weighted signal density | Dimensions: title (0.25), triggers (0.20), length (0.20), anchors (0.15), metadata (0.20) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/index.ts:11:export * from './compact-merger.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:57:  anchors: string[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:133:  check_anchors?: boolean;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:138:  strict_anchors?: boolean;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:307:    anchors: [],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:340:        suggestion: `Rename one of the duplicate anchors to a unique ID`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:382:      result.anchors.push(anchorId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:767:    check_anchors = true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:772:    strict_anchors = false,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:813:  if (check_anchors && content) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:814:    const anchorResult = validateAnchorFormat(content, { strict: strict_anchors });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:819:      if (strict_anchors) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:47:  anchors?: string[] | string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:130:  anchors,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:159:    anchors,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:112:  anchors?: string | string[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:440:  if (row.anchors && options.anchors) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:441:    const rowAnchors: string[] = Array.isArray(row.anchors)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:442:      ? (row.anchors as unknown[]).filter((a): a is string => typeof a === 'string')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:443:      : typeof row.anchors === 'string' ? [row.anchors] : [];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:444:    const queryAnchors: string[] = Array.isArray(options.anchors) ? options.anchors : [options.anchors];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:594: * @param options - Optional weights, query, anchors, model selection
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:638: * @param options - Optional weights, query, anchors, model selection
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts:96: * it is pushed onto an open-anchors stack. When a matching closing tag is
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts:104: *          Returns an empty array when content is empty, null, or has no anchors.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts:112:  /** Stack of { id, startLine } for currently-open anchors (supports nesting). */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts:119:    // F-01 — Parse open tag BEFORE close tag so same-line anchors
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts:135:      // Find the most recent matching open anchor (supports nested anchors)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts:153:  // Any remaining open anchors have no closing tag — ignore silently.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts:162: * as `anchorMetadata`. Rows without content (or with no anchors) are returned
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts:169: * @returns New array — each row is either a new object (when anchors were
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts:170: *          found) or the original reference (when no anchors were found).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts:180:    const anchors = extractAnchorMetadata(content);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts:181:    if (anchors.length === 0) return row;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts:185:      anchorMetadata: anchors,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:112:  anchors?: string | string[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:440:  if (row.anchors && options.anchors) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:441:    const rowAnchors: string[] = Array.isArray(row.anchors)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:442:      ? (row.anchors as unknown[]).filter((a): a is string => typeof a === 'string')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:443:      : typeof row.anchors === 'string' ? [row.anchors] : [];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:444:    const queryAnchors: string[] = Array.isArray(options.anchors) ? options.anchors : [options.anchors];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:594: * @param options - Optional weights, query, anchors, model selection
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:638: * @param options - Optional weights, query, anchors, model selection
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/README.md:16:| `compact-merger.ts` | 3-source merge (Memory + Code Graph + CocoIndex) for compaction |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/README.md:26:The compact-merger combines all three under a 4000-token budget for compaction injection.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:14://              Structured continuation shape for session recovery.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:198:  // Suggest anchor-specific follow-up if anchors were matched
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:203:    followUps.push('Search with anchors[] to retrieve specific sections directly');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:238:    const anchors = signals
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:242:    if (hasAnchor && anchors.length > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:243:      steps.push(`Review ${anchors.join(', ')} section in result #${results.indexOf(result) + 1}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:46:/** Build context from resolved anchors using specified query mode */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:74:    // Deadline check: stop processing further anchors if over budget
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:125:    textBrief: 'No anchors resolved. Try `code_graph_scan` first, or provide a `subject` or `seeds[]`.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:133:function buildCombinedSummary(anchors: ArtifactRef[], sections: GraphContextSection[]): string {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:134:  if (anchors.length === 0) return 'No anchors resolved.';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:137:  const files = new Set(anchors.map(a => a.filePath));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:138:  const topAnchor = anchors[0];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:140:  return `${anchors.length} anchor(s) across ${files.size} file(s): ${topName} + ${totalNodes} symbols, ${totalEdges} relationships`;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:144:function suggestNextActions(anchors: ArtifactRef[], sections: GraphContextSection[], mode: QueryMode): string[] {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:152:  if (anchors.some(a => a.resolution === 'file_anchor')) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:153:    actions.push('Run `code_graph_scan` to improve resolution (file anchors found)');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:281:function formatTextBrief(sections: GraphContextSection[], budgetTokens: number, _anchors?: ArtifactRef[]): string {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/README.md:38:- Anchor filtering works only when `includeContent: true` and `anchors` are provided.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:168: * Count anchors present in this result's anchorMetadata array.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:169: * A result with multiple named anchors is considered "dense" and
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:64:  anchorsRequested: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:65:  anchorsFound: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:389:  anchors: string[] | null = null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:464:      const anchorsInfo = extractAnchorDetails(rawResult);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:476:        anchorIds: anchorsInfo.anchorIds,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:477:        anchorTypes: anchorsInfo.anchorTypes,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:540:        if (anchors && Array.isArray(anchors) && anchors.length > 0 && parser && typeof content === 'string') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:548:          for (const anchorId of anchors) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:566:            // SK-005 Fix: Warn about missing anchors in partial match
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:568:            const missingAnchors = anchors.filter(a => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:573:              filteredParts.push(`<!-- WARNING: Requested anchors not found: ${missingAnchors.join(', ')} -->`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:584:              anchorsRequested: anchors.length,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:585:              anchorsFound: foundCount
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:588:            // No anchors found - return warning
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:589:            content = `<!-- WARNING: Requested anchors not found: ${anchors.join(', ')} -->`;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:594:              anchorsRequested: anchors.length,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:595:              anchorsFound: 0
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:657:  if (includeContent && anchors && anchors.length > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:5:// into a unified compact brief for compaction injection.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:212:        sourceRefs: ['budget-allocator', 'compact-merger'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:9:// Structural noise (YAML frontmatter, HTML comment anchors, pipe
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:38:  // Without the `m` flag, `^` anchors to position 0 only (document start),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:257:  // Steps as the embedding pipeline (frontmatter, anchors, HTML
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:39:  anchors?: string[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:60:  anchors?: string[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:218:      'Use anchors to organize content within the file',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:469:      'Consider using /spec_kit:resume for session recovery'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:569:      'Use anchors to allow partial loading',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:767:        'Ensure anchors use correct format'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/README.md:36:| `content-normalizer.ts` | Strips frontmatter, anchors, HTML comments, fences, tables, list syntax, and heading markers before embedding or BM25 work |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/README.md:37:| `memory-parser.ts` | Parses titles, trigger phrases, tiers, document type, causal links, anchors, and content hashes from markdown files |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/README.md:364:| **Options** | `limit`, `threshold`, `specFolder`, `anchors` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:850:/** Extract content from anchors */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:857:  const anchors: Record<string, string> = {};
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:873:      anchors[id] = innerContent.trim();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:877:  return anchors;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:898:  // Validate anchors (warnings only - don't block indexing)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:163:      const anchors = mod.getLineageTransitionAnchors(1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:164:      expect(Array.isArray(anchors)).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:165:      expect(anchors.length).toBeGreaterThan(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:166:      expect(anchors[0]?.memory_id).toBe(1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:167:      expect(typeof anchors[0]?.actor).toBe('string');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:240:      "expectedResultDescription": "Topic-scoped resume query. Should surface spec folder 001-sprint-0-measurement-foundation memories with state/next-steps anchors.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:261:      "notes": "From T007b Pattern 4: decision archaeology with anchors=['decisions', 'rationale']."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:341:      "notes": "From T007b Pattern 9: sk-git skill session recovery with domain-specific phrase."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:351:      "notes": "From T007b Pattern 10: completion verification using anchors=['state', 'checklist']."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:128:  describe('Multiple anchors in one document', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:129:    it('M01: two sequential anchors both extracted', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:201:    it('M05: five anchors all extracted correctly', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:355:    it('R05: row with content but no anchors is returned unchanged', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:365:  describe('Enrichment when anchors are present', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:385:      const anchors = result[0].anchorMetadata as AnchorMetadata[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:387:      expect(anchors[0].id).toBe('DECISION-use-rrf-001');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:388:      expect(anchors[0].type).toBe('DECISION');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:412:    it('R09: row with multiple anchors gets all of them in anchorMetadata', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:424:      const anchors = result[0].anchorMetadata as AnchorMetadata[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:426:      expect(anchors).toHaveLength(2);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:427:      expect(anchors[0].id).toBe('summary');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:428:      expect(anchors[1].id).toBe('decisions');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:79:  it('preserves text outside anchors when anchor chunking is selected', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:80:    const preface = `Preface outside anchors.\n${'P'.repeat(2200)}`;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:81:    const bridge = `Bridge text between anchors.\n${'B'.repeat(2200)}`;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:82:    const trailing = `Trailing notes outside anchors.\n${'T'.repeat(2200)}`;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:103:    expect(combined).toContain('Preface outside anchors.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:104:    expect(combined).toContain('Bridge text between anchors.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:105:    expect(combined).toContain('Trailing notes outside anchors.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/five-factor-scoring.vitest.ts:237:    const row = { anchors: ['decisions', 'blockers'], similarity: 50 };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/five-factor-scoring.vitest.ts:238:    const options = { anchors: ['decisions'] };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/five-factor-scoring.vitest.ts:254:    const options = { query: 'test', anchors: ['test'] };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/five-factor-scoring.vitest.ts:709:    const row = { anchors: ['decisions', 'blockers', 'context'], similarity: 50 };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/five-factor-scoring.vitest.ts:710:    const oneAnchor = calculatePatternScore(row, { anchors: ['decisions'] });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/five-factor-scoring.vitest.ts:711:    const twoAnchors = calculatePatternScore(row, { anchors: ['decisions', 'blockers'] });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/five-factor-scoring.vitest.ts:712:    const threeAnchors = calculatePatternScore(row, { anchors: ['decisions', 'blockers', 'context'] });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/five-factor-scoring.vitest.ts:739:      anchors: ['test', 'query'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/five-factor-scoring.vitest.ts:744:      anchors: ['test', 'query'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/five-factor-scoring.vitest.ts:843:      anchors: ['test'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/five-factor-scoring.vitest.ts:848:      anchors: ['test'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:913:        anchors: ['decision', 'context'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:915:      const optionsAnchor = { query: 'test', anchors: ['decision'] }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:948:        anchors: ['test', 'query'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:952:      const optionsMax = { query: 'exact match test query', anchors: ['test'] }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:9:// 3. Stateful session tracking — questions, anchors, seen items
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:151:   * Set preferred anchors for the session.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:154:   * @param anchors - Array of preferred anchor names.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:156:  setAnchors(sessionId: string, anchors: string[]): void {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:158:    session.preferredAnchors = [...anchors];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:112:    // Zero score, single channel, no reranker, no anchors → very low confidence
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:242:  it('adds "anchor_density" driver when anchorMetadata has 2+ anchors', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:308:    // Score=0, no channels, no reranker, no anchors, next score is similar (small margin)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:126:    anchors: undefined,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:273:It includes proper structure, anchors, and enough signal density to pass all validation layers.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts:96: * it is pushed onto an open-anchors stack. When a matching closing tag is
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts:104: *          Returns an empty array when content is empty, null, or has no anchors.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts:112:  /** Stack of { id, startLine } for currently-open anchors (supports nesting). */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts:119:    // F-01 — Parse open tag BEFORE close tag so same-line anchors
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts:135:      // Find the most recent matching open anchor (supports nested anchors)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts:153:  // Any remaining open anchors have no closing tag — ignore silently.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts:162: * as `anchorMetadata`. Rows without content (or with no anchors) are returned
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts:169: * @returns New array — each row is either a new object (when anchors were
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts:170: *          found) or the original reference (when no anchors were found).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts:180:    const anchors = extractAnchorMetadata(content);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts:181:    if (anchors.length === 0) return row;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts:185:      anchorMetadata: anchors,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:74:      expect(result.anchors).toContain('summary');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:75:      expect(result.anchors).toContain('decisions');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:100:      expect(result.warnings.length > 0 || result.anchors.length === 0).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:238:        { check_anchors: true, check_tokens: true, check_size: true }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:247:        { check_anchors: true, check_tokens: true, check_size: true }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:256:        { dry_run: true, check_anchors: true, check_tokens: true, check_size: true }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:266:        { check_anchors: false, check_tokens: true, check_size: true }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:282:        { recoverable: true, suggestion: 'Fix the anchors' }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:288:      expect(error.suggestion).toBe('Fix the anchors');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:377:      expect(result.anchors).toHaveLength(5);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:378:      expect(result.anchors).toContain('simple');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:379:      expect(result.anchors).toContain('with-hyphens');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:380:      expect(result.anchors).toContain('spec-folder/section');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:408:      expect(result.anchors).toHaveLength(1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:409:      expect(result.anchors[0]).toBe('test-section');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:418:      expect(mixedResult.anchors).toHaveLength(2);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:430:      expect(result.anchors).toContain('closed-ok');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:723:          check_anchors: true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:751:          check_anchors: true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:754:          strict_anchors: false
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:261:            anchors: 2,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:422:            anchors: 2,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1566:            anchors: 1,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1596:            'description: "Looks plausible but is missing required anchors."',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1644:            anchors: 1,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/handlers/memory-search.js:280:    const { cursor, query, concepts, specFolder, folderBoost, tenantId, userId, agentId, sharedSpaceId, limit: rawLimit = 10, tier, contextType, useDecay: useDecay = true, includeContiguity: includeContiguity = false, includeConstitutional: includeConstitutional = true, includeContent: includeContent = false, anchors, bypassCache: bypassCache = false, sessionId, enableDedup: enableDedup = true, intent: explicitIntent, autoDetectIntent: autoDetectIntent = true, minState, // No default — memoryState column not yet in schema; defaulting to 'WARM' filters all rows
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/handlers/memory-search.js:471:        anchors,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/handlers/memory-search.js:519:            anchors,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/handlers/memory-search.js:614:            if (Array.isArray(anchors) && anchors.length > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/handlers/memory-search.js:615:                retrievalSessionStateManager.setAnchors(sessionId, anchors);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/handlers/memory-search.js:701:        let formatted = await formatSearchResults(resultsForFormatting, pipelineConfig.searchType, includeContent, anchors, null, null, extraData, includeTrace, normalizedQuery, // REQ-D5-001/D5-004: pass query for recovery + confidence context
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-prefix-matching.vitest.ts:233:  // 6. Multiple anchors requested
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-prefix-matching.vitest.ts:235:  describe('Multiple anchors — mixed exact and prefix', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-prefix-matching.vitest.ts:236:    it('P20: resolves a batch of mixed anchors correctly', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-prefix-matching.vitest.ts:244:      const anchors = ['summary', 'state', 'decisions', 'next-steps', 'missing'];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-prefix-matching.vitest.ts:245:      const results = anchors.map((a) => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-prefix-matching.vitest.ts:358:    expect(res.tokenMetrics.anchorsFound).toBe(1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-prefix-matching.vitest.ts:359:    expect(res.tokenMetrics.anchorsRequested).toBe(1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-prefix-matching.vitest.ts:370:    expect(res.tokenMetrics.anchorsFound).toBe(1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-prefix-matching.vitest.ts:379:    expect(res.content).toContain('WARNING: Requested anchors not found: summary');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-prefix-matching.vitest.ts:380:    expect(res.tokenMetrics.anchorsFound).toBe(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-prefix-matching.vitest.ts:384:  it('I04: mix of found and missing anchors includes warning', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-prefix-matching.vitest.ts:395:    expect(res.content).toContain('WARNING: Requested anchors not found: nonexistent');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-prefix-matching.vitest.ts:396:    expect(res.tokenMetrics.anchorsFound).toBe(2);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-prefix-matching.vitest.ts:397:    expect(res.tokenMetrics.anchorsRequested).toBe(3);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-prefix-matching.vitest.ts:409:    expect(res.tokenMetrics.anchorsFound).toBe(1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-prefix-matching.vitest.ts:414:  it('I06: empty anchors array returns full content (no filtering)', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-prefix-matching.vitest.ts:422:      [], // empty anchors
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-prefix-matching.vitest.ts:429:    // With empty anchors array, the anchor filtering branch is NOT entered
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-prefix-matching.vitest.ts:430:    // (anchors.length > 0 is false), so full file content is returned
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:86:  it('should give anchorScore 1.0 for chunks with anchors', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:91:  it('should give anchorScore 0.0 for chunks without anchors', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:97:  it('should give anchorScore 1.0 for chunks with multiple anchors', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:100:      content: '## Multi-anchor chunk\n\nThis chunk covers multiple anchors with substantial content for testing purposes.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:286:        content: '## Medium quality\n\nSome content that is long enough to have moderate density but no anchors attached to it.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:687:| 2. Content Quality | 5-dimension weighted signal density | Dimensions: title (0.25), triggers (0.20), length (0.20), anchors (0.15), metadata (0.20) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:47:  anchors?: string[] | string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:130:  anchors,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:159:    anchors,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:137:  anchors?: string[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/compact-merger.vitest.ts:5:import { mergeCompactBrief, type MergeInput } from '../lib/code-graph/compact-merger.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:17:import { mergeCompactBrief } from '../../lib/code-graph/compact-merger.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:18:import type { MergeInput } from '../../lib/code-graph/compact-merger.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:168: * Count anchors present in this result's anchorMetadata array.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:169: * A result with multiple named anchors is considered "dense" and
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/save-quality-gate.vitest.ts:448:      it('AQ1: No anchors scores 0', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/save-quality-gate.vitest.ts:456:      it('AQ3: Two anchors score 0.5', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/save-quality-gate.vitest.ts:460:      it('AQ4: Three anchors score 1.0', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/save-quality-gate.vitest.ts:510:          anchors: ['summary', 'decisions', 'next-steps'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/save-quality-gate.vitest.ts:522:          anchors: [],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/save-quality-gate.vitest.ts:538:          anchors: [],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/save-quality-gate.vitest.ts:556:          anchors: ['summary', 'decisions', 'next-steps'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/save-quality-gate.vitest.ts:742:        anchors: ['summary', 'decisions', 'next-steps'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/save-quality-gate.vitest.ts:774:        anchors: [],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/save-quality-gate.vitest.ts:796:        anchors: ['summary', 'decisions', 'next-steps'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/save-quality-gate.vitest.ts:824:        anchors: ['summary', 'decisions', 'next-steps'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/save-quality-gate.vitest.ts:860:        anchors: ['summary', 'decisions', 'next-steps'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser-extended.vitest.ts:434:    it('T27: unclosed anchors produce warnings, not errors', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:131:  it('skips message injection for tool-bearing message anchors', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1123:    it('T000g: memory_context resume mode invokes TM-05 compaction hook at runtime', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1157:    it('T000h: memory_context non-resume mode keeps SK-004 memory-aware path', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-state.vitest.ts:199:  it('setAnchors replaces preferred anchors', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/chunking/chunk-thinning.ts:106:  // Anchor score: 1.0 if chunk has anchors, 0.0 if not
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/handlers/quality-loop.d.ts:12:    anchors: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/handlers/quality-loop.d.ts:40:    readonly anchors: 0.3;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/handlers/quality-loop.d.ts:75: *   - No anchors present at all → score 0.5 (neutral; anchors are optional)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/handlers/quality-loop.d.ts:76: *   - All anchors properly paired  → score 1.0
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/handlers/quality-loop.d.ts:150: *   - anchors   × 0.30
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/handlers/quality-loop.d.ts:163: *   - `breakdown` — Per-dimension raw sub-scores (`triggers`, `anchors`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/handlers/quality-loop.d.ts:166: *     in order: triggers → anchors → budget → coherence.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/handlers/quality-loop.d.ts:187: * Appends <!-- /ANCHOR: name --> at the end of content for unclosed anchors.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:397:      evidenceGapWarning: 'No matching memories covered the requested rationale anchors.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-id-simplification.vitest.ts:18:/** Expected simple anchors in the compact v2.2 template */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-id-simplification.vitest.ts:50:  const anchors: string[] = [];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-id-simplification.vitest.ts:53:    anchors.push(match[1]);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-id-simplification.vitest.ts:55:  return anchors;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-id-simplification.vitest.ts:61:  const anchors: string[] = [];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-id-simplification.vitest.ts:64:    anchors.push(match[1]);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-id-simplification.vitest.ts:66:  return anchors;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-id-simplification.vitest.ts:89:      const anchors = extractOpeningAnchors(content);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-id-simplification.vitest.ts:91:      for (const anchor of anchors) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-id-simplification.vitest.ts:98:      const anchors = extractOpeningAnchors(content);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-id-simplification.vitest.ts:100:      for (const anchor of anchors) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-id-simplification.vitest.ts:107:      const anchors = extractOpeningAnchors(content);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-id-simplification.vitest.ts:108:      const staticAnchors = anchors.filter(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-id-simplification.vitest.ts:120:      const anchors = extractOpeningAnchors(content);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-id-simplification.vitest.ts:121:      const staticAnchors = anchors.filter(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-id-simplification.vitest.ts:127:        // Most anchors have 2 segments (e.g., 'continue-session', 'task-guide').
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-id-simplification.vitest.ts:128:        // Some anchors have 3 segments (e.g., 'project-state-snapshot').
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-id-simplification.vitest.ts:139:    it('S05: all static anchors match VALID_ANCHOR_PATTERN', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-id-simplification.vitest.ts:141:      const anchors = extractOpeningAnchors(content);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-id-simplification.vitest.ts:142:      const staticAnchors = anchors.filter(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-id-simplification.vitest.ts:154:    it('S06: all static anchors use lowercase only (no underscores)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-id-simplification.vitest.ts:156:      const anchors = extractOpeningAnchors(content);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-id-simplification.vitest.ts:157:      const staticAnchors = anchors.filter(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-id-simplification.vitest.ts:169:      const anchors = extractOpeningAnchors(content);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-id-simplification.vitest.ts:170:      const staticAnchors = anchors.filter(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-id-simplification.vitest.ts:241:    it('S12: no two static anchors share the same ID', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-id-simplification.vitest.ts:264:    it('S13: compact template does not rely on dynamic anchors', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-id-simplification.vitest.ts:279:    it('S14: all expected anchors exist in the template', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-id-simplification.vitest.ts:301:    it('S16: no unexpected new anchors have been added beyond known set', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-id-simplification.vitest.ts:308:      // All static anchors should be in the expected list.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-id-simplification.vitest.ts:315:        `Unexpected anchors found (update EXPECTED_ANCHORS if intentional): ${unexpected.join(', ')}`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-id-simplification.vitest.ts:341:    it('S20: anchors section in template comment documents indexing approach', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-id-simplification.vitest.ts:343:      // The template should document that anchors use simple semantic names
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts:7:// Splitting when anchors are absent.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts:75: * while preserving uncovered text between anchors as unanchored sections.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts:143: * Small adjacent anchors are merged; large anchors become their own chunk.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/chunking/README.md:36:- **Anchor chunking** detects `<!-- ANCHOR:id -->` / `<!-- /ANCHOR:id -->` tag pairs in content and groups anchor sections into chunks that stay under a target size. When no anchors are present, it falls back to structure-aware markdown splitting on H1/H2 headings.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/chunking/README.md:47:| Anchor weight 0.6 vs density 0.4 | Author-placed anchors are a stronger quality signal than computed density metrics. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/chunking/README.md:67:| `anchor-chunker.ts` | Extracts anchor sections from content via regex, groups them into target-sized chunks, and falls back to H1/H2 heading-based splitting when fewer than 2 anchors are found. Exports the `AnchorChunk` and `ChunkingResult` types used by downstream consumers. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/chunking/README.md:100:      -> Try anchor extraction (>= 2 anchors?)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:642:          reason: 'resumed session inferred resume mode',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:432:    const content = 'Short content without any structure or anchors.';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:455:    // Content with headings (for trigger extraction) but NO trigger phrases and NO anchors.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:457:    //   triggers=0*0.25 + anchors=0.5*0.30 + budget=1.0*0.20 + coherence=0.75*0.25
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:476:    const content = 'no headings no anchors no structure';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:787:      anchors: [],         // 0 anchor quality
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:812:      anchors: ['continue-session'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:831:      anchors: [],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:848:      anchors: [],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:888:    // Content with good structure (headings, anchors) but no primary evidence
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:955:      anchors: [],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:967:    // Content that would fail quality loop (no triggers, short, no anchors)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:1076:  it('handles 1000 nested unclosed anchors without crashing', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:1077:    const anchors = Array.from({ length: 1000 }, (_, i) =>
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:1080:    const content = `---\ntitle: "Anchor Stress Test"\ndescription: "test"\ntrigger_phrases:\n  - "anchor-stress"\nimportance_tier: "normal"\ncontextType: "implementation"\n---\n\n${anchors}`;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:1181:      anchors: [],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:7:// - Quality score computation (trigger phrases, anchors, budget, coherence)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:8:// - Auto-fix strategies (re-extract triggers, normalize anchors, trim budget)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:41:/** Good quality content with anchors, headings, and sufficient length */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:79:/** Content with broken anchors */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:137:  it('returns 1.0 for properly opened and closed anchors', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:144:  it('returns 0.5 (neutral) when no anchors present', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:145:    const content = '# Just a heading\nSome content without anchors.';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:151:  it('penalizes unclosed anchors', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:165:  it('handles mixed valid and invalid anchors', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:284:    expect(score.breakdown.anchors).toBe(1.0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:291:    // BAD_CONTENT = 'short': triggers=0, anchors=0.5 (neutral), budget=1.0, coherence=0.25
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:300:    const weightSum = QUALITY_WEIGHTS.triggers + QUALITY_WEIGHTS.anchors +
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:307:    if (score.breakdown.triggers === 1.0 && score.breakdown.anchors === 1.0 &&
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:331:  it('leaves properly closed anchors unchanged', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:337:  it('handles multiple unclosed anchors', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:405:  it('normalizes unclosed anchors', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:494:    // Has no anchors (0.5 neutral), no triggers (0), budget ok (1.0), coherence (1.0).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:529:    // But coherence gives 0.25 for non-empty, budget gives 1.0, anchors 0.5 (neutral)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:681:**Behind the scenes:** The AI calls `memory_context()` with `mode: "resume"` and `anchors: ["state", "next-steps"]`, then returns the previous session state.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:135:  it('T006: resume mode has resume strategy and 2000 token budget', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:339:    expect(resumed.reason).toBe('resumed session inferred resume mode');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:610:  it('T068: Resume mode description mentions anchors or next-steps', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:43:  description: '[L1:Orchestration] Unified entry point for context retrieval with intent-aware routing. START HERE for most memory operations. For session recovery, use mode: \'resume\' with profile: \'resume\'. Automatically detects task intent (add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision) and routes to optimal retrieval strategy. Modes: auto (default), quick (trigger-based), deep (comprehensive), focused (intent-optimized), resume (session recovery). Token Budget: 3500. For code search by concept/intent, prefer mcp__cocoindex_code__search (CocoIndex). For structural code queries (callers, imports), prefer code_graph_query.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:44:  inputSchema: { type: 'object', additionalProperties: false, properties: { input: { type: 'string', minLength: 1, description: 'The query, prompt, or context description (required)' }, mode: { type: 'string', enum: ['auto', 'quick', 'deep', 'focused', 'resume'], default: 'auto', description: 'Context retrieval mode: auto (detect intent), quick (fast triggers), deep (comprehensive search), focused (intent-optimized), resume (session recovery)' }, intent: { type: 'string', enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'], description: 'Explicit task intent. If not provided and mode=auto, intent is auto-detected from input.' }, specFolder: { type: 'string', description: 'Limit context to specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval when memory_context routes to memory_search.' }, userId: { type: 'string', description: 'User boundary for governed retrieval when memory_context routes to memory_search.' }, agentId: { type: 'string', description: 'Agent boundary for governed retrieval when memory_context routes to memory_search.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed retrieval when memory_context routes to memory_search.' }, limit: { type: 'number', minimum: 1, maximum: 100, description: 'Maximum results (mode-specific defaults apply)' }, sessionId: { type: 'string', description: 'Optional server-issued session identifier for working-memory continuity. When provided, it must match an existing server-managed session or the call is rejected. Omit it to let the server generate a new session for this request.' }, enableDedup: { type: 'boolean', default: true, description: 'Enable session deduplication' }, includeContent: { type: 'boolean', default: false, description: 'Include full file content in results' }, includeTrace: { type: 'boolean', default: false, description: 'Include provenance-rich trace data (scores, source, trace) in results when underlying memory_search is called' }, tokenUsage: { type: 'number', minimum: 0.0, maximum: 1.0, description: "Optional caller token usage ratio (0.0-1.0)" }, anchors: { type: 'array', items: { type: 'string' }, description: 'Filter content to specific anchors (e.g., ["state", "next-steps"] for resume mode)' }, profile: { type: 'string', enum: ['quick', 'research', 'resume', 'debug'], description: 'Optional response profile formatter. Returns a reduced or mode-aware response shape when profile formatting is enabled.' } }, required: ['input'] },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:106:      anchors: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:140:      anchors: ['state', 'next-steps'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:270:      const anchors = memoryParser.extractAnchors(content);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:273:      expect(anchors['decisions']).toBeTruthy();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:274:      expect(anchors['next-steps']).toBeTruthy();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:287:    it('T500-09c: overlapping anchors are rejected', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:300:    it('T500-09d: extraction fails closed for crossed and unclosed anchors', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:312:      const anchors = memoryParser.extractAnchors(malformedContent);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:315:      expect(anchors).toEqual({});
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-quality-filter.vitest.ts:122:      anchors: ['alpha'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-quality-filter.vitest.ts:155:      anchors: undefined,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/tool-schemas.js:17:    description: '[L1:Orchestration] Unified entry point for context retrieval with intent-aware routing. START HERE for most memory operations. For session recovery, use mode: \'resume\' with profile: \'resume\'. Automatically detects task intent (add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision) and routes to optimal retrieval strategy. Modes: auto (default), quick (trigger-based), deep (comprehensive), focused (intent-optimized), resume (session recovery). Token Budget: 3500. For code search by concept/intent, prefer mcp__cocoindex_code__search (CocoIndex). For structural code queries (callers, imports), prefer code_graph_query.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/tool-schemas.js:18:    inputSchema: { type: 'object', additionalProperties: false, properties: { input: { type: 'string', minLength: 1, description: 'The query, prompt, or context description (required)' }, mode: { type: 'string', enum: ['auto', 'quick', 'deep', 'focused', 'resume'], default: 'auto', description: 'Context retrieval mode: auto (detect intent), quick (fast triggers), deep (comprehensive search), focused (intent-optimized), resume (session recovery)' }, intent: { type: 'string', enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'], description: 'Explicit task intent. If not provided and mode=auto, intent is auto-detected from input.' }, specFolder: { type: 'string', description: 'Limit context to specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval when memory_context routes to memory_search.' }, userId: { type: 'string', description: 'User boundary for governed retrieval when memory_context routes to memory_search.' }, agentId: { type: 'string', description: 'Agent boundary for governed retrieval when memory_context routes to memory_search.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed retrieval when memory_context routes to memory_search.' }, limit: { type: 'number', minimum: 1, maximum: 100, description: 'Maximum results (mode-specific defaults apply)' }, sessionId: { type: 'string', description: 'Optional server-issued session identifier for working-memory continuity. When provided, it must match an existing server-managed session or the call is rejected. Omit it to let the server generate a new session for this request.' }, enableDedup: { type: 'boolean', default: true, description: 'Enable session deduplication' }, includeContent: { type: 'boolean', default: false, description: 'Include full file content in results' }, includeTrace: { type: 'boolean', default: false, description: 'Include provenance-rich trace data (scores, source, trace) in results when underlying memory_search is called' }, tokenUsage: { type: 'number', minimum: 0.0, maximum: 1.0, description: "Optional caller token usage ratio (0.0-1.0)" }, anchors: { type: 'array', items: { type: 'string' }, description: 'Filter content to specific anchors (e.g., ["state", "next-steps"] for resume mode)' }, profile: { type: 'string', enum: ['quick', 'research', 'resume', 'debug'], description: 'Optional response profile formatter. Returns a reduced or mode-aware response shape when profile formatting is enabled.' } }, required: ['input'] },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/tool-schemas.js:79:            anchors: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:12:import { mergeCompactBrief } from '../lib/code-graph/compact-merger.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:13:import type { MergeInput } from '../lib/code-graph/compact-merger.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/handlers/quality-loop.js:23:    anchors: 0.30,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/handlers/quality-loop.js:70: *   - No anchors present at all → score 0.5 (neutral; anchors are optional)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/handlers/quality-loop.js:71: *   - All anchors properly paired  → score 1.0
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/handlers/quality-loop.js:82:    // Match opening anchors: <!-- ANCHOR: name -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/handlers/quality-loop.js:84:    // Match closing anchors: <!-- /ANCHOR: name -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/handlers/quality-loop.js:95:    // No anchors at all — neutral score
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/handlers/quality-loop.js:99:    const countAnchors = (anchors) => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/handlers/quality-loop.js:101:        for (const name of anchors) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/handlers/quality-loop.js:137:    // Proportional: correct pairs / total unique anchors
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/handlers/quality-loop.js:288: *   - anchors   × 0.30
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/handlers/quality-loop.js:301: *   - `breakdown` — Per-dimension raw sub-scores (`triggers`, `anchors`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/handlers/quality-loop.js:304: *     in order: triggers → anchors → budget → coherence.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/handlers/quality-loop.js:312:        anchorResult.score * QUALITY_WEIGHTS.anchors +
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/handlers/quality-loop.js:319:            anchors: anchorResult.score,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/handlers/quality-loop.js:357:    // O2-6: Fix #3 (trim) runs BEFORE Fix #2 (anchors) to prevent trim from
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/handlers/quality-loop.js:408: * Appends <!-- /ANCHOR: name --> at the end of content for unclosed anchors.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/handlers/quality-loop.js:422:    const countAnchors = (anchors) => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/handlers/quality-loop.js:424:        for (const name of anchors) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/handlers/quality-loop.js:441:    // Append closing tags for unclosed anchors
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/tools/types.d.ts:21:    anchors?: string[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/tools/types.d.ts:41:    anchors?: string[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/schemas/tool-input-schemas.js:92:    anchors: optionalStringArray,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/schemas/tool-input-schemas.js:115:    anchors: optionalStringArray,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/schemas/tool-input-schemas.js:409:    memory_context: ['input', 'mode', 'intent', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'sessionId', 'enableDedup', 'includeContent', 'includeTrace', 'tokenUsage', 'anchors', 'profile'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/schemas/tool-input-schemas.js:410:    memory_search: ['cursor', 'query', 'concepts', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'sessionId', 'enableDedup', 'tier', 'contextType', 'useDecay', 'includeContiguity', 'includeConstitutional', 'enableSessionBoost', 'enableCausalBoost', 'includeContent', 'anchors', 'min_quality_score', 'minQualityScore', 'bypassCache', 'rerank', 'applyLengthPenalty', 'applyStateLimits', 'minState', 'intent', 'autoDetectIntent', 'trackAccess', 'includeArchived', 'mode', 'includeTrace', 'profile'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/formatters/search-results.js:224:export async function formatSearchResults(results, searchType, include_content = false, anchors = null, parserOverride = null, startTime = null, extraData = {}, includeTrace = false, query = null, specFolder = null) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/formatters/search-results.js:287:            const anchorsInfo = extractAnchorDetails(rawResult);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/formatters/search-results.js:299:                anchorIds: anchorsInfo.anchorIds,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/formatters/search-results.js:300:                anchorTypes: anchorsInfo.anchorTypes,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/formatters/search-results.js:361:                if (anchors && Array.isArray(anchors) && anchors.length > 0 && parser && typeof content === 'string') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/formatters/search-results.js:367:                    for (const anchorId of anchors) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/formatters/search-results.js:383:                        // SK-005 Fix: Warn about missing anchors in partial match
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/formatters/search-results.js:385:                        const missingAnchors = anchors.filter(a => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/formatters/search-results.js:391:                            filteredParts.push(`<!-- WARNING: Requested anchors not found: ${missingAnchors.join(', ')} -->`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/formatters/search-results.js:400:                            anchorsRequested: anchors.length,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/formatters/search-results.js:401:                            anchorsFound: foundCount
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/formatters/search-results.js:405:                        // No anchors found - return warning
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/formatters/search-results.js:406:                        content = `<!-- WARNING: Requested anchors not found: ${anchors.join(', ')} -->`;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/formatters/search-results.js:411:                            anchorsRequested: anchors.length,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/formatters/search-results.js:412:                            anchorsFound: 0
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/formatters/search-results.js:467:    if (includeContent && anchors && anchors.length > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/compact-inject.js:13:import { mergeCompactBrief } from '../../lib/code-graph/compact-merger.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/formatters/search-results.d.ts:8:    anchorsRequested: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/formatters/search-results.d.ts:9:    anchorsFound: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/formatters/search-results.d.ts:117:export declare function formatSearchResults(results: RawSearchResult[] | null, searchType: string, include_content?: boolean, anchors?: string[] | null, parserOverride?: MemoryParserLike | null, startTime?: number | null, extraData?: Record<string, unknown>, includeTrace?: boolean, query?: string | null, specFolder?: string | null): Promise<MCPResponse>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/session/session-manager.js:971:> **Purpose:** Enable seamless session recovery after context compaction, crashes, or breaks.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/response/profile-formatters.js:14://              Structured continuation shape for session recovery.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/response/profile-formatters.js:87:    // Suggest anchor-specific follow-up if anchors were matched
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/response/profile-formatters.js:90:        followUps.push('Search with anchors[] to retrieve specific sections directly');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/response/profile-formatters.js:121:        const anchors = signals
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/response/profile-formatters.js:124:        if (hasAnchor && anchors.length > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/response/profile-formatters.js:125:            steps.push(`Review ${anchors.join(', ')} section in result #${results.indexOf(result) + 1}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/parsing/memory-parser.d.ts:108:/** Extract content from anchors */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/scoring/composite-scoring.d.ts:26:    anchors?: string | string[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/scoring/composite-scoring.d.ts:123: * @param options - Optional weights, query, anchors, model selection
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/scoring/composite-scoring.d.ts:135: * @param options - Optional weights, query, anchors, model selection
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/validation/save-quality-gate.js:390: * @param anchors - Array of anchor IDs found in content
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/validation/save-quality-gate.js:391: * @returns Score: 0 anchors=0, 1-2=0.5, 3+=1.0
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/validation/save-quality-gate.js:393:export function scoreAnchorQuality(anchors) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/validation/save-quality-gate.js:394:    const count = anchors.length;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/validation/save-quality-gate.js:470:        anchorQuality: scoreAnchorQuality(params.anchors ?? []),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/validation/save-quality-gate.js:639:        anchor: params.anchors?.[0] ?? null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/validation/save-quality-gate.js:647:        anchors: params.anchors,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/parsing/memory-parser.js:644:/** Extract content from anchors */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/parsing/memory-parser.js:650:    const anchors = {};
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/parsing/memory-parser.js:661:            anchors[id] = innerContent.trim();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/parsing/memory-parser.js:664:    return anchors;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/parsing/memory-parser.js:680:    // Validate anchors (warnings only - don't block indexing)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/validation/preflight.d.ts:40:    anchors: string[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/validation/preflight.d.ts:109:    check_anchors?: boolean;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/validation/preflight.d.ts:114:    strict_anchors?: boolean;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/validation/save-quality-gate.d.ts:50:    anchors?: string[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/validation/save-quality-gate.d.ts:199: * @param anchors - Array of anchor IDs found in content
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/validation/save-quality-gate.d.ts:200: * @returns Score: 0 anchors=0, 1-2=0.5, 3+=1.0
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/validation/save-quality-gate.d.ts:202:export declare function scoreAnchorQuality(anchors: string[]): number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/validation/save-quality-gate.d.ts:236:    anchors?: string[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/scoring/composite-scoring.js:307:    if (row.anchors && options.anchors) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/scoring/composite-scoring.js:308:        const rowAnchors = Array.isArray(row.anchors)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/scoring/composite-scoring.js:309:            ? row.anchors.filter((a) => typeof a === 'string')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/scoring/composite-scoring.js:310:            : typeof row.anchors === 'string' ? [row.anchors] : [];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/scoring/composite-scoring.js:311:        const queryAnchors = Array.isArray(options.anchors) ? options.anchors : [options.anchors];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/scoring/composite-scoring.js:441: * @param options - Optional weights, query, anchors, model selection
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/scoring/composite-scoring.js:479: * @param options - Optional weights, query, anchors, model selection
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/parsing/content-normalizer.js:9:// Structural noise (YAML frontmatter, HTML comment anchors, pipe
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/parsing/content-normalizer.js:37:    // Without the `m` flag, `^` anchors to position 0 only (document start),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/parsing/content-normalizer.js:234:    // Steps as the embedding pipeline (frontmatter, anchors, HTML
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/validation/preflight.js:103:        anchors: [],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/validation/preflight.js:129:                suggestion: `Rename one of the duplicate anchors to a unique ID`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/validation/preflight.js:165:            result.anchors.push(anchorId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/validation/preflight.js:439:    const { dry_run = false, check_anchors = true, check_duplicates = true, check_similar = false, check_tokens = true, check_size = true, strict_anchors = false, } = options;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/validation/preflight.js:473:    if (check_anchors && content) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/validation/preflight.js:474:        const anchorResult = validateAnchorFormat(content, { strict: strict_anchors });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/validation/preflight.js:478:            if (strict_anchors) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/code-graph/compact-merger.js:5:// into a unified compact brief for compaction injection.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/code-graph/compact-merger.js:139:                sourceRefs: ['budget-allocator', 'compact-merger'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/code-graph/compact-merger.js:159://# sourceMappingURL=compact-merger.js.map
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/code-graph/index.js:11:export * from './compact-merger.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/handlers/save/embedding-pipeline.js:106:                // S1: strip structural noise (frontmatter, anchors, HTML comments) before embedding
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/code-graph/compact-merger.js.map:1:{"version":3,"file":"compact-merger.js","sourceRoot":"","sources":["../../../lib/code-graph/compact-merger.ts"],"names":[],"mappings":"AAAA,kEAAkE;AAClE,yBAAyB;AACzB,kEAAkE;AAClE,gFAAgF;AAChF,yDAAyD;AAEzD,OAAO,EAAE,cAAc,EAAE,oBAAoB,EAAyB,MAAM,uBAAuB,CAAC;AACpG,OAAO,EACL,2BAA2B,GAG5B,MAAM,8BAA8B,CAAC;AAwCtC,sDAAsD;AACtD,SAAS,cAAc,CAAC,IAAY;IAClC,OAAO,IAAI,CAAC,IAAI,CAAC,IAAI,CAAC,MAAM,GAAG,CAAC,CAAC,CAAC;AACpC,CAAC;AAED,iDAAiD;AACjD,SAAS,gBAAgB,CAAC,IAAY,EAAE,SAAiB;IACvD,IAAI,SAAS,IAAI,CAAC;QAAE,OAAO,EAAE,CAAC;IAC9B,IAAI,cAAc,CAAC,IAAI,CAAC,IAAI,SAAS;QAAE,OAAO,IAAI,CAAC;IAEnD,MAAM,MAAM,GAAG,kBAAkB,CAAC;IAClC,MAAM,QAAQ,GAAG,SAAS,GAAG,CAAC,CAAC;IAC/B,IAAI,MAAM,CAAC,MAAM,IAAI,QAAQ,EAAE,CAAC;QAC9B,OAAO,IAAI,CAAC,KAAK,CAAC,CAAC,EAAE,QAAQ,CAAC,CAAC;IACjC,CAAC;IAED,MAAM,YAAY,GAAG,IAAI,CAAC,GAAG,CAAC,CAAC,EAAE,QAAQ,GAAG,MAAM,CAAC,MAAM,CAAC,CAAC;IAC3D,OAAO,IAAI,CAAC,KAAK,CAAC,CAAC,EAAE,YAAY,CAAC,GAAG,MAAM,CAAC;AAC9C,CAAC;AAED,+DAA+D;AAC/D,SAAS,wBAAwB,CAAC,IAAY;IAC5C,MAAM,KAAK,GAAG,IAAI,GAAG,EAAU,CAAC;IAChC,MAAM,SAAS,GAAG,6BAA6B,CAAC;IAChD,MAAM,OAAO,GAAG,IAAI,CAAC,KAAK,CAAC,SAAS,CAAC,CAAC;IACtC,IAAI,OAAO;QAAE,OAAO,CAAC,OAAO,CAAC,CAAC,CAAC,EAAE,CAAC,KAAK,CAAC,GAAG,CAAC,CAAC,CAAC,CAAC,CAAC;IAChD,OAAO,KAAK,CAAC;AACf,CAAC;AAED,gGAAgG;AAChG,SAAS,oBAAoB,CAAC,QAAiC;IAC7D,MAAM,SAAS,GAAG,IAAI,GAAG,EAAU,CAAC;IACpC,IAAI,YAAY,GAAG,CAAC,CAAC;IAErB,KAAK,MAAM,OAAO,IAAI,QAAQ,EAAE,CAAC;QAC/B,MAAM,SAAS,GAAG,wBAAwB,CAAC,OAAO,CAAC,OAAO,CAAC,CAAC;QAC5D,MAAM,UAAU,GAAa,EAAE,CAAC;QAEhC,KAAK,MAAM,EAAE,IAAI,SAAS,EAAE,CAAC;YAC3B,IAAI,SAAS,CAAC,GAAG,CAAC,EAAE,CAAC,EAAE,CAAC;gBACtB,UAAU,CAAC,IAAI,CAAC,EAAE,CAAC,CAAC;gBACpB,YAAY,EAAE,CAAC;YACjB,CAAC;iBAAM,CAAC;gBACN,SAAS,CAAC,GAAG,CAAC,EAAE,CAAC,CAAC;YACpB,CAAC;QACH,CAAC;QAED,gEAAgE;QAChE,IAAI,UAAU,CAAC,MAAM,GAAG,CAAC,EAAE,CAAC;YAC1B,IAAI,OAAO,GAAG,OAAO,CAAC,OAAO,CAAC;YAC9B,KAAK,MAAM,GAAG,IAAI,UAAU,EAAE,CAAC;gBAC7B,MAAM,SAAS,GAAG,IAAI,MAAM,CAAC,MAAM,GAAG,CAAC,OAAO,CAAC,qBAAqB,EAAE,MAAM,CAAC,QAAQ,EAAE,IAAI,CAAC,CAAC;gBAC7F,OAAO,GAAG,OAAO,CAAC,OAAO,CAAC,SAAS,EAAE,EAAE,CAAC,CAAC;YAC3C,CAAC;YACD,OAAO,CAAC,OAAO,GAAG,OAAO,CAAC,IAAI,EAAE,CAAC;YACjC,OAAO,CAAC,aAAa,GAAG,cAAc,CAAC,OAAO,CAAC,OAAO,CAAC,CAAC;QAC1D,CAAC;IACH,CAAC;IACD,OAAO,YAAY,CAAC;AACtB,CAAC;AAED;;;;;;;;GAQG;AACH,MAAM,UAAU,iBAAiB,CAC/B,KAAiB,EACjB,cAAsB,IAAI,EAC1B,SAA6B,EAC7B,SAAqC;IAErC,MAAM,SAAS,GAAG,WAAW,CAAC,GAAG,EAAE,CAAC;IAEpC,MAAM,kBAAkB,GAAG,cAAc,CAAC,KAAK,CAAC,cAAc,CAAC,CAAC;IAChE,MAAM,aAAa,GAAG,cAAc,CAAC,KAAK,CAAC,SAAS,CAAC,CAAC;IACtD,MAAM,aAAa,GAAG,cAAc,CAAC,KAAK,CAAC,SAAS,CAAC,CAAC;IACtD,MAAM,aAAa,GAAG,cAAc,CAAC,KAAK,CAAC,SAAS,CAAC,CAAC;IACtD,MAAM,gBAAgB,GAAG,cAAc,CAAC,KAAK,CAAC,YAAY,CAAC,CAAC;IAE5D,MAAM,OAAO,GAAG,oBAAoB,CAClC,kBAAkB,EAClB,aAAa,EACb,aAAa,EACb,aAAa,EACb,gBAAgB,CACjB,CAAC;IACF,MAAM,UAAU,GAAG,cAAc,CAAC,OAAO,EAAE,WAAW,CAAC,CAAC;IAExD,sCAAsC;IACtC,MAAM,QAAQ,GAA4B,EAAE,CAAC;IAC7C,MAAM,aAAa,GAAG,IAAI,GAAG,CAAC,UAAU,CAAC,WAAW,CAAC,GAAG,CAAC,CAAC,CAAC,EAAE,CAAC,CAAC,CAAC,CAAC,IAAI,EAAE,CAAC,CAAC,CAAC,CAAC,CAAC;IAC5E,MAAM,WAAW,GAAG,CAClB,SAAiB,EACjB,cAAsB,EACtB,WAAmB,EACnB,MAAc,EACR,EAAE;QACR,IAAI,CAAC,SAAS,CAAC,IAAI,EAAE;YAAE,OAAO;QAE9B,MAAM,OAAO,GAAG,aAAa,CAAC,GAAG,CAAC,cAAc,CAAC,EAAE,OAAO,IAAI,CAAC,CAAC;QAChE,IAAI,OAAO,IAAI,CAAC;YAAE,OAAO;QAEzB,MAAM,OAAO,GAAG,gBAAgB,CAAC,SAAS,EAAE,OAAO,CAAC,CAAC;QACrD,IAAI,CAAC,OAAO,CAAC,IAAI,EAAE;YAAE,OAAO;QAE5B,QAAQ,CAAC,IAAI,CAAC;YACZ,IAAI,EAAE,WAAW;YACjB,OAAO;YACP,aAAa,EAAE,cAAc,CAAC,OAAO,CAAC;YACtC,MAAM;SACP,CAAC,CAAC;IACL,CAAC,CAAC;IAEF,WAAW,CAAC,KAAK,CAAC,cAAc,EAAE,gBAAgB,EAAE,sBAAsB,EAAE,QAAQ,CAAC,CAAC;IACtF,WAAW,CAAC,KAAK,CAAC,SAAS,EAAE,WAAW,EAAE,mCAAmC,EAAE,YAAY,CAAC,CAAC;IAC7F,WAAW,CAAC,KAAK,CAAC,SAAS,EAAE,WAAW,EAAE,oBAAoB,EAAE,WAAW,CAAC,CAAC;IAC7E,WAAW,CAAC,KAAK,CAAC,YAAY,EAAE,cAAc,EAAE,4BAA4B,EAAE,SAAS,CAAC,CAAC;IACzF,WAAW,CAAC,KAAK,CAAC,SAAS,EAAE,WAAW,EAAE,oBAAoB,EAAE,QAAQ,CAAC,CAAC;IAE1E,2CAA2C;IAC3C,MAAM,iBAAiB,GAAG,oBAAoB,CAAC,QAAQ,CAAC,CAAC;IAEzD,oBAAoB;IACpB,MAAM,IAAI,GAAG,QAAQ;SAClB,GAAG,CAAC,CAAC,CAAC,EAAE,CAAC,MAAM,CAAC,CAAC,IAAI,KAAK,CAAC,CAAC,OAAO,EAAE,CAAC;SACtC,IAAI,CAAC,MAAM,CAAC,CAAC;IAEhB,MAAM,kBAAkB,GAAG,QAAQ,CAAC,MAAM,CAAC,CAAC,GAAG,EAAE,CAAC,EAAE,EAAE,CAAC,GAAG,GAAG,CAAC,CAAC,aAAa,EAAE,CAAC,CAAC,CAAC;IACjF,MAAM,eAAe,GAAG,IAAI,CAAC,KAAK,CAAC,WAAW,CAAC,GAAG,EAAE,GAAG,SAAS,CAAC,CAAC;IAElE,OAAO;QACL,IAAI;QACJ,QAAQ;QACR,UAAU;QACV,eAAe,EAAE,2BAA2B,CAAC;YAC3C,IAAI,EAAE,YAAY;YAClB,QAAQ,EAAE,QAAQ,CAAC,GAAG,CAAC,CAAC,OAAO,EAAE,EAAE,CAAC,CAAC;gBACnC,GAAG,EAAE,OAAO,CAAC,IAAI,CAAC,WAAW,EAAE,CAAC,OAAO,CAAC,aAAa,EAAE,GAAG,CAAC;gBAC3D,KAAK,EAAE,OAAO,CAAC,IAAI;gBACnB,OAAO,EAAE,OAAO,CAAC,OAAO;gBACxB,MAAM,EAAE,OAAO,CAAC,MAAM,KAAK,YAAY;oBACrC,CAAC,CAAC,YAAY;oBACd,CAAC,CAAC,OAAO,CAAC,MAAM,KAAK,WAAW;wBAC9B,CAAC,CAAC,UAAU;wBACZ,CAAC,CAAC,OAAO,CAAC,MAAM,KAAK,SAAS;4BAC5B,CAAC,CAAC,SAAS;4BACX,CAAC,CAAC,QAAQ;aACjB,CAAC,CAAC;YACH,OAAO,EAAE,6BAA6B,QAAQ,CAAC,MAAM,oBAAoB,WAAW,SAAS;YAC7F,UAAU,EAAE;gBACV,QAAQ,EAAE,gBAAgB;gBAC1B,aAAa,EAAE,YAAY;gBAC3B,UAAU,EAAE,MAAM;gBAClB,WAAW,EAAE,IAAI,IAAI,EAAE,CAAC,WAAW,EAAE;gBACrC,WAAW,EAAE,IAAI;gBACjB,UAAU,EAAE,CAAC,kBAAkB,EAAE,gBAAgB,CAAC;aACnD;YACD,GAAG,CAAC,SAAS,CAAC,CAAC,CAAC,EAAE,SAAS,EAAE,CAAC,CAAC,CAAC,EAAE,CAAC;SACpC,CAAC;QACF,QAAQ,EAAE;YACR,kBAAkB;YAClB,WAAW,EAAE,QAAQ,CAAC,MAAM;YAC5B,QAAQ,EAAE,IAAI,IAAI,EAAE,CAAC,WAAW,EAAE;YAClC,eAAe;YACf,iBAAiB;YACjB,SAAS,EAAE,SAAS,IAAI;gBACtB,EAAE,MAAM,EAAE,gBAAgB,EAAE,WAAW,EAAE,IAAI,EAAE,SAAS,EAAE,SAAS,EAAE;gBACrE,EAAE,MAAM,EAAE,WAAW,EAAE,WAAW,EAAE,IAAI,EAAE,SAAS,EAAE,SAAS,EAAE;gBAChE,EAAE,MAAM,EAAE,WAAW,EAAE,WAAW,EAAE,IAAI,EAAE,SAAS,EAAE,SAAS,EAAE;gBAChE,EAAE,MAAM,EAAE,WAAW,EAAE,WAAW,EAAE,IAAI,EAAE,SAAS,EAAE,SAAS,EAAE;aACjE;YACD,GAAG,CAAC,SAAS,CAAC,CAAC,CAAC,EAAE,SAAS,EAAE,CAAC,CAAC,CAAC,EAAE,CAAC;SACpC;KACF,CAAC;AACJ,CAAC"}
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/code-graph/index.d.ts:8:export * from './compact-merger.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/errors/recovery-hints.js:167:            'Use anchors to organize content within the file',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/errors/recovery-hints.js:412:            'Consider using /spec_kit:resume for session recovery'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/errors/recovery-hints.js:510:            'Use anchors to allow partial loading',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/errors/recovery-hints.js:700:                'Ensure anchors use correct format'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/code-graph/compact-merger.d.ts:48://# sourceMappingURL=compact-merger.d.ts.map
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/code-graph/compact-merger.d.ts.map:1:{"version":3,"file":"compact-merger.d.ts","sourceRoot":"","sources":["../../../lib/code-graph/compact-merger.ts"],"names":[],"mappings":"AAMA,OAAO,EAAwC,KAAK,gBAAgB,EAAE,MAAM,uBAAuB,CAAC;AACpG,OAAO,EAEL,KAAK,yBAAyB,EAC9B,KAAK,qBAAqB,EAC3B,MAAM,8BAA8B,CAAC;AAEtC,qCAAqC;AACrC,MAAM,WAAW,UAAU;IACzB,cAAc,EAAE,MAAM,CAAC;IACvB,SAAS,EAAE,MAAM,CAAC;IAClB,SAAS,EAAE,MAAM,CAAC;IAClB,SAAS,EAAE,MAAM,CAAC;IAClB,YAAY,EAAE,MAAM,CAAC;CACtB;AAED,oCAAoC;AACpC,MAAM,WAAW,eAAe;IAC9B,MAAM,EAAE,MAAM,CAAC;IACf,WAAW,EAAE,MAAM,GAAG,IAAI,CAAC;IAC3B,SAAS,EAAE,OAAO,GAAG,QAAQ,GAAG,OAAO,GAAG,SAAS,CAAC;CACrD;AAED,yCAAyC;AACzC,MAAM,WAAW,WAAW;IAC1B,IAAI,EAAE,MAAM,CAAC;IACb,QAAQ,EAAE;QACR,IAAI,EAAE,MAAM,CAAC;QACb,OAAO,EAAE,MAAM,CAAC;QAChB,aAAa,EAAE,MAAM,CAAC;QACtB,MAAM,EAAE,MAAM,CAAC;KAChB,EAAE,CAAC;IACJ,UAAU,EAAE,gBAAgB,CAAC;IAC7B,eAAe,EAAE,qBAAqB,CAAC;IACvC,QAAQ,EAAE;QACR,kBAAkB,EAAE,MAAM,CAAC;QAC3B,WAAW,EAAE,MAAM,CAAC;QACpB,QAAQ,EAAE,MAAM,CAAC;QACjB,eAAe,EAAE,MAAM,CAAC;QACxB,iBAAiB,EAAE,MAAM,CAAC;QAC1B,SAAS,EAAE,eAAe,EAAE,CAAC;QAC7B,SAAS,CAAC,EAAE,yBAAyB,CAAC;KACvC,CAAC;CACH;AA+DD;;;;;;;;GAQG;AACH,wBAAgB,iBAAiB,CAC/B,KAAK,EAAE,UAAU,EACjB,WAAW,GAAE,MAAa,EAC1B,SAAS,CAAC,EAAE,eAAe,EAAE,EAC7B,SAAS,CAAC,EAAE,yBAAyB,GACpC,WAAW,CAwGb"}
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/code-graph/code-graph-context.js:9:/** Build context from resolved anchors using specified query mode */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/code-graph/code-graph-context.js:32:        // Deadline check: stop processing further anchors if over budget
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/code-graph/code-graph-context.js:78:        textBrief: 'No anchors resolved. Try `code_graph_scan` first, or provide a `subject` or `seeds[]`.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/code-graph/code-graph-context.js:85:function buildCombinedSummary(anchors, sections) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/code-graph/code-graph-context.js:86:    if (anchors.length === 0)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/code-graph/code-graph-context.js:87:        return 'No anchors resolved.';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/code-graph/code-graph-context.js:90:    const files = new Set(anchors.map(a => a.filePath));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/code-graph/code-graph-context.js:91:    const topAnchor = anchors[0];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/code-graph/code-graph-context.js:93:    return `${anchors.length} anchor(s) across ${files.size} file(s): ${topName} + ${totalNodes} symbols, ${totalEdges} relationships`;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/code-graph/code-graph-context.js:96:function suggestNextActions(anchors, sections, mode) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/code-graph/code-graph-context.js:104:    if (anchors.some(a => a.resolution === 'file_anchor')) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/code-graph/code-graph-context.js:105:        actions.push('Run `code_graph_scan` to improve resolution (file anchors found)');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/code-graph/code-graph-context.js:227:function formatTextBrief(sections, budgetTokens, _anchors) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/code-graph/code-graph-context.d.ts:45:/** Build context from resolved anchors using specified query mode */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/eval/data/ground-truth.json:240:            "expectedResultDescription": "Topic-scoped resume query. Should surface spec folder 001-sprint-0-measurement-foundation memories with state/next-steps anchors.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/eval/data/ground-truth.json:261:            "notes": "From T007b Pattern 4: decision archaeology with anchors=['decisions', 'rationale']."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/eval/data/ground-truth.json:341:            "notes": "From T007b Pattern 9: sk-git skill session recovery with domain-specific phrase."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/eval/data/ground-truth.json:351:            "notes": "From T007b Pattern 10: completion verification using anchors=['state', 'checklist']."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/handlers/memory-context.d.ts:27:    anchors?: string[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/handlers/memory-context.d.ts:54: * @param args - Context retrieval arguments (intent, mode, specFolder, anchors, etc.)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/handlers/memory-context.js:428:        description: 'Resume previous work with state and next-steps anchors',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/handlers/memory-context.js:479:        anchors: options.anchors,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/handlers/memory-context.js:508:        anchors: options.anchors,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/handlers/memory-context.js:526:    const resumeAnchors = options.anchors || ['state', 'next-steps', 'summary', 'blockers'];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/handlers/memory-context.js:539:        anchors: resumeAnchors,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/handlers/memory-context.js:746: * @param args - Context retrieval arguments (intent, mode, specFolder, anchors, etc.)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/handlers/memory-context.js:768:        const { input, mode: requested_mode = 'auto', intent: explicit_intent, specFolder: spec_folder, limit, enableDedup: enableDedup = true, includeContent: include_content = false, tokenUsage, anchors } = args;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/handlers/memory-context.js:926:            anchors,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/handlers/memory-search.d.ts:27:    anchors?: string[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/handlers/memory-save.js:91:        && sufficiencyResult.evidenceCounts.anchors >= 1
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/handlers/memory-save.js:127:            const rejectScore = { total: 0, breakdown: { triggers: 0, anchors: 0, budget: 0, coherence: 0 }, issues: [`V-rule hard block: ${failedRuleIds.join(', ')}`] };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/handlers/memory-save.js:144:                    evidenceCounts: { primary: 0, support: 0, total: 0, semanticChars: 0, uniqueWords: 0, anchors: 0, triggerPhrases: 0 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/handlers/memory-save.js:960:            check_anchors: true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/handlers/memory-save.js:965:            strict_anchors: false,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/session-state.js:9:// 3. Stateful session tracking — questions, anchors, seen items
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/session-state.js:100:     * Set preferred anchors for the session.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/session-state.js:103:     * @param anchors - Array of preferred anchor names.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/session-state.js:105:    setAnchors(sessionId, anchors) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/session-state.js:107:        session.preferredAnchors = [...anchors];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/anchor-metadata.js:40: * it is pushed onto an open-anchors stack. When a matching closing tag is
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/anchor-metadata.js:48: *          Returns an empty array when content is empty, null, or has no anchors.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/anchor-metadata.js:55:    /** Stack of { id, startLine } for currently-open anchors (supports nesting). */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/anchor-metadata.js:60:        // F-01 — Parse open tag BEFORE close tag so same-line anchors
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/anchor-metadata.js:74:            // Find the most recent matching open anchor (supports nested anchors)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/anchor-metadata.js:91:    // Any remaining open anchors have no closing tag — ignore silently.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/anchor-metadata.js:99: * as `anchorMetadata`. Rows without content (or with no anchors) are returned
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/anchor-metadata.js:106: * @returns New array — each row is either a new object (when anchors were
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/anchor-metadata.js:107: *          found) or the original reference (when no anchors were found).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/anchor-metadata.js:118:        const anchors = extractAnchorMetadata(content);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/anchor-metadata.js:119:        if (anchors.length === 0)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/anchor-metadata.js:123:            anchorMetadata: anchors,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/handlers/code-graph/context.js:123:                            anchors: result.resolvedAnchors.map(a => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/chunking/chunk-thinning.js:57:    // Anchor score: 1.0 if chunk has anchors, 0.0 if not
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/pipeline/types.d.ts:122:    anchors?: string[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/chunking/anchor-chunker.js:7:// Splitting when anchors are absent.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/chunking/anchor-chunker.js:27: * while preserving uncovered text between anchors as unanchored sections.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/chunking/anchor-chunker.js:83: * Small adjacent anchors are merged; large anchors become their own chunk.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/search-utils.d.ts:32:    anchors?: string[] | string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/search-utils.d.ts:58:declare function buildCacheArgs({ normalizedQuery, hasValidConcepts, concepts, specFolder, tenantId, userId, agentId, sharedSpaceId, limit, mode, tier, contextType, useDecay, includeArchived, qualityThreshold, applyStateLimits, includeContiguity, includeConstitutional, includeContent, anchors, detectedIntent, minState, rerank, applyLengthPenalty, sessionId, enableSessionBoost, enableCausalBoost, includeTrace, }: CacheArgsInput): Record<string, unknown>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/search-utils.js:54:function buildCacheArgs({ normalizedQuery, hasValidConcepts, concepts, specFolder, tenantId, userId, agentId, sharedSpaceId, limit, mode, tier, contextType, useDecay, includeArchived, qualityThreshold, applyStateLimits, includeContiguity, includeConstitutional, includeContent, anchors, detectedIntent, minState, rerank, applyLengthPenalty, sessionId, enableSessionBoost, enableCausalBoost, includeTrace = false, }) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/search-utils.js:74:        anchors,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/session-state.d.ts:76:     * Set preferred anchors for the session.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/session-state.d.ts:79:     * @param anchors - Array of preferred anchor names.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/session-state.d.ts:81:    setAnchors(sessionId: string, anchors: string[]): void;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/anchor-metadata.d.ts:24: * it is pushed onto an open-anchors stack. When a matching closing tag is
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/anchor-metadata.d.ts:32: *          Returns an empty array when content is empty, null, or has no anchors.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/anchor-metadata.d.ts:40: * as `anchorMetadata`. Rows without content (or with no anchors) are returned
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/anchor-metadata.d.ts:47: * @returns New array — each row is either a new object (when anchors were
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/anchor-metadata.d.ts:48: *          found) or the original reference (when no anchors were found).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/confidence-scoring.js:78: * Count anchors present in this result's anchorMetadata array.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/confidence-scoring.js:79: * A result with multiple named anchors is considered "dense" and

exec
/bin/zsh -lc "sed -n '650,830p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  quick: {
    name: 'Quick',
    description: 'Fast trigger matching for real-time context (low latency)',
    strategy: 'triggers',
    tokenBudget: 800
  },

  // Deep: Comprehensive semantic search with full context
  deep: {
    name: 'Deep',
    description: 'Semantic search with full context retrieval',
    strategy: 'search',
    tokenBudget: 3500
  },

  // Focused: Intent-specific search with optimized weights
  focused: {
    name: 'Focused',
    description: 'Intent-aware search with task-specific optimization',
    strategy: 'intent-search',
    tokenBudget: 3000
  },

  // Resume: Session recovery mode
  resume: {
    name: 'Resume',
    description: 'Resume previous work with state and next-steps anchors',
    strategy: 'resume',
    tokenBudget: 2000
  }
};

/* ───────────────────────────────────────────────────────────────
   4. INTENT-TO-MODE ROUTING
──────────────────────────────────────────────────────────────── */

const INTENT_TO_MODE: Record<string, string> = {
  add_feature: 'deep',
  fix_bug: 'focused',
  refactor: 'deep',
  security_audit: 'deep',
  understand: 'focused',
  find_spec: 'deep',
  find_decision: 'focused'
};

/* ───────────────────────────────────────────────────────────────
   5. CONTEXT STRATEGY EXECUTORS
──────────────────────────────────────────────────────────────── */

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
    mode: 'resume',
    resumeAnchors: resumeAnchors,
    ...result
  };
}

/* ───────────────────────────────────────────────────────────────
   6. HANDLER HELPERS
──────────────────────────────────────────────────────────────── */

function resolveSessionLifecycle(
  args: ContextArgs,
  db: ReturnType<typeof vectorIndex.getDb> | null,
): SessionLifecycleResolution {
  void db;

  // Security: session scope derived from server context, not caller input
  const trustedSession = sessionManager.resolveTrustedSession(args.sessionId ?? null, {
    tenantId: args.tenantId,
    userId: args.userId,

exec
/bin/zsh -lc "sed -n '1,180p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
title: "Session Layer"
description: "Session management for the Spec Kit Memory MCP server. Handles session deduplication, crash recovery and context persistence."
trigger_phrases:
  - "session management"
  - "session deduplication"
  - "crash recovery"
---

# Session Layer

> Session management for the Spec Kit Memory MCP server. Handles deduplication and crash recovery with context persistence.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1--overview)
- [2. STRUCTURE](#2--structure)
- [3. FEATURES](#3--features)
- [4. USAGE EXAMPLES](#4--usage-examples)
- [5. TROUBLESHOOTING](#5--troubleshooting)
- [6. RELATED RESOURCES](#6--related-resources)

<!-- /ANCHOR:table-of-contents -->

---

## 1. OVERVIEW
<!-- ANCHOR:overview -->

The session layer provides all session-related operations for the Spec Kit Memory MCP server. It prevents duplicate context injection (saving ~50% tokens on follow-up queries) and enables crash recovery with immediate SQLite persistence.

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| Modules | 1 | `session-manager.ts` |
| Token Savings | ~50% | On follow-up queries via deduplication |
| Session TTL | 30 min | Configurable via `SESSION_TTL_MINUTES` |
| Max Entries | 100 | Per session cap (R7 mitigation) |

### Key Features

| Feature | Description |
|---------|-------------|
| **Session Deduplication** | Tracks sent memories to prevent duplicate context injection |
| **Crash Recovery** | Immediate SQLite persistence + CONTINUE_SESSION.md generation |
| **Token Savings** | ~50% reduction on follow-up queries |
| **State Persistence** | Zero data loss on crash via immediate saves |
| **Phase Awareness** | Session context includes phase metadata for phase-based specs (spec 139) |

<!-- /ANCHOR:overview -->

---

## 2. STRUCTURE
<!-- ANCHOR:structure -->

```
session/
 session-manager.ts  # Session deduplication, crash recovery, state management (~28KB)
 README.md           # This file
```

### Key Files

| File | Purpose |
|------|---------|
| `session-manager.ts` | Core session tracking, deduplication, state persistence, CONTINUE_SESSION.md |

<!-- /ANCHOR:structure -->

---

## 3. FEATURES
<!-- ANCHOR:features -->

### Session Deduplication (v1.2.0)

**Purpose**: Prevent sending the same memory content twice in a session, saving tokens.

| Aspect | Details |
|--------|---------|
| **Hash-based** | SHA-256 hash of memory content (truncated to 16 chars) |
| **Immediate Save** | SQLite persistence on each mark (crash resilient) |
| **Batch Support** | Efficient batch checking and marking |
| **Token Savings** | ~200 tokens per duplicate avoided |

```
Session Query Flow:
1. User queries memory_search
2. Results retrieved from index
3. filterSearchResults() removes already-sent memories
4. Filtered results returned to client
5. markResultsSent() records what was sent
```

### Crash Recovery (v1.2.0)

**Purpose**: Zero data loss on MCP server crash or context compaction.

| Aspect | Details |
|--------|---------|
| **Immediate Persistence** | State saved to SQLite instantly |
| **Interrupted Detection** | On startup, active sessions marked as interrupted |
| **State Recovery** | `recoverState()` returns state with `_recovered: true` flag |
| **CONTINUE_SESSION.md** | Human-readable recovery file in spec folder |

Session states:
- `active`: Session in progress
- `completed`: Session ended normally
- `interrupted`: Session crashed (detected on restart)

### CONTINUE_SESSION.md Generation

**Purpose**: Human-readable recovery file for smooth session continuation.

Generated on checkpoint with:
- Session ID and status
- Spec folder and current task
- Last action and context summary
- Pending work description
- Quick resume command

<!-- /ANCHOR:features -->

---

## 4. USAGE EXAMPLES
<!-- ANCHOR:usage-examples -->

### Example 1: Filter Search Results (Primary Integration)

```typescript
import { filterSearchResults, markResultsSent } from './session-manager';

// After retrieving search results
const { filtered, dedupStats } = filterSearchResults(sessionId, results);

console.log(`Filtered ${dedupStats.filtered} duplicates`);
console.log(`Token savings: ${dedupStats.tokenSavingsEstimate}`);

// Return filtered results to client, then mark as sent
markResultsSent(sessionId, filtered);
```

### Example 2: Crash Recovery on Startup

```typescript
import { init, resetInterruptedSessions, getInterruptedSessions } from './session-manager';

// Initialize session manager
init(database);

// Mark any active sessions as interrupted
const { interruptedCount } = resetInterruptedSessions();
console.log(`Found ${interruptedCount} interrupted sessions`);

// Get details for recovery UI
const { sessions } = getInterruptedSessions();
sessions.forEach(s => {
  console.log(`Session ${s.sessionId}: ${s.lastAction} in ${s.specFolder}`);
});
```

### Example 3: Save Session State with Checkpoint

```typescript
import { checkpointSession, saveSessionState } from './session-manager';

// Save state immediately (minimal)
saveSessionState(sessionId, {
  specFolder: 'specs/<###-spec-name>',
  currentTask: 'T071',
  lastAction: 'Implemented causal edges',
  contextSummary: 'Working on memory relationships...',
  pendingWork: 'Need to add traversal depth limit'
});

exec
/bin/zsh -lc "sed -n '1,220p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Session Snapshot
// ───────────────────────────────────────────────────────────────
// Phase 024: Lightweight read-only snapshot of session state.
// Aggregates metrics, graph freshness, and priming status into a
// single object for buildServerInstructions() and agent bootstrap.

import { getSessionMetrics, computeQualityScore, getLastToolCallAt } from './context-metrics.js';
import { isSessionPrimed, getLastActiveSessionId } from '../../hooks/memory-surface.js';
import { getStats as getGraphStats } from '../code-graph/code-graph-db.js';
import { getGraphFreshness } from '../code-graph/ensure-ready.js';
import { isCocoIndexAvailable } from '../utils/cocoindex-path.js';
import {
  trustStateFromStructuralStatus,
  type SharedPayloadProvenance,
} from '../context/shared-payload.js';

/* ───────────────────────────────────────────────────────────────
   1. TYPES
──────────────────────────────────────────────────────────────── */

export interface SessionSnapshot {
  specFolder: string | null;
  currentTask: string | null;
  graphFreshness: 'fresh' | 'stale' | 'empty' | 'error';
  cocoIndexAvailable: boolean;
  sessionQuality: 'healthy' | 'degraded' | 'critical' | 'unknown';
  lastToolCallAgoMs: number | null;
  primed: boolean;
  routingRecommendation: string;
}

/**
 * Phase 027: Structural Bootstrap Contract — shared by all non-hook surfaces.
 * Single source of truth for structural context in startup/recovery flows.
 * Token budget: 250-400 tokens (hard ceiling 500 including guidance).
 */
export interface StructuralBootstrapContract {
  status: 'ready' | 'stale' | 'missing';
  summary: string;
  highlights?: string[];
  recommendedAction: string;
  sourceSurface: 'auto-prime' | 'session_bootstrap' | 'session_resume' | 'session_health';
  provenance?: SharedPayloadProvenance;
}

/* ───────────────────────────────────────────────────────────────
   2. CONSTANTS
──────────────────────────────────────────────────────────────── */

const STRUCTURAL_CONTRACT_MAX_TOKENS = 500;

/* ───────────────────────────────────────────────────────────────
   3. HELPERS
──────────────────────────────────────────────────────────────── */

function resolveGraphFreshness(): SessionSnapshot['graphFreshness'] {
  try {
    return getGraphFreshness(process.cwd());
  } catch {
    return 'error';
  }
}

function estimateTextTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

function truncateTextToTokenBudget(text: string, maxTokens: number): string {
  if (maxTokens <= 0) {
    return '';
  }

  if (estimateTextTokens(text) <= maxTokens) {
    return text;
  }

  const maxChars = Math.max(0, (maxTokens * 4) - 3);
  return `${text.slice(0, maxChars).trimEnd()}...`;
}

function estimateStructuralContractTokens(
  summary: string,
  highlights: string[] | undefined,
  recommendedAction: string,
): number {
  return estimateTextTokens([
    summary,
    ...(highlights ?? []),
    recommendedAction,
  ].join('\n'));
}

function fitStructuralContractBudget(
  summary: string,
  highlights: string[] | undefined,
  recommendedAction: string,
): {
  summary: string;
  highlights: string[] | undefined;
  recommendedAction: string;
} {
  let fittedSummary = summary;
  let fittedHighlights = highlights ? [...highlights] : undefined;
  let fittedRecommendedAction = recommendedAction;

  while (fittedHighlights && fittedHighlights.length > 0
    && estimateStructuralContractTokens(fittedSummary, fittedHighlights, fittedRecommendedAction) > STRUCTURAL_CONTRACT_MAX_TOKENS) {
    fittedHighlights = fittedHighlights.slice(0, -1);
  }

  if (estimateStructuralContractTokens(fittedSummary, fittedHighlights, fittedRecommendedAction) > STRUCTURAL_CONTRACT_MAX_TOKENS) {
    const reservedTokens = estimateStructuralContractTokens('', fittedHighlights, fittedRecommendedAction);
    const summaryBudget = Math.max(40, STRUCTURAL_CONTRACT_MAX_TOKENS - reservedTokens);
    fittedSummary = truncateTextToTokenBudget(fittedSummary, summaryBudget);
  }

  if (estimateStructuralContractTokens(fittedSummary, fittedHighlights, fittedRecommendedAction) > STRUCTURAL_CONTRACT_MAX_TOKENS) {
    const reservedTokens = estimateStructuralContractTokens(fittedSummary, fittedHighlights, '');
    const actionBudget = Math.max(20, STRUCTURAL_CONTRACT_MAX_TOKENS - reservedTokens);
    fittedRecommendedAction = truncateTextToTokenBudget(fittedRecommendedAction, actionBudget);
  }

  return {
    summary: fittedSummary,
    highlights: fittedHighlights,
    recommendedAction: fittedRecommendedAction,
  };
}

/* ───────────────────────────────────────────────────────────────
   4. PUBLIC API
──────────────────────────────────────────────────────────────── */

/** Build a read-only snapshot of the current session state. */
export function getSessionSnapshot(): SessionSnapshot {
  const now = Date.now();

  // Metrics (safe — in-memory only)
  let specFolder: string | null = null;
  let currentTask: string | null = null;
  try {
    const metrics = getSessionMetrics() as ReturnType<typeof getSessionMetrics> & {
      currentTask?: unknown;
    };
    specFolder = metrics.currentSpecFolder;
    if (typeof metrics.currentTask === 'string' || metrics.currentTask === null) {
      currentTask = metrics.currentTask;
    }
  } catch { /* metrics unavailable */ }

  // Graph freshness
  const graphFreshness = resolveGraphFreshness();

  // CocoIndex availability
  let cocoIndexAvailable = false;
  try {
    cocoIndexAvailable = isCocoIndexAvailable();
  } catch { /* unavailable */ }

  // Quality score
  let sessionQuality: SessionSnapshot['sessionQuality'] = 'unknown';
  try {
    const qs = computeQualityScore();
    sessionQuality = qs.level;
  } catch { /* unknown */ }

  // Last tool call
  let lastToolCallAgoMs: number | null = null;
  try {
    const last = getLastToolCallAt();
    if (last !== null) lastToolCallAgoMs = now - last;
  } catch { /* null */ }

  // Priming status
  let primed = false;
  try {
    const primingSessionId = getLastActiveSessionId();
    primed = primingSessionId ? isSessionPrimed(primingSessionId) : false;
  } catch { /* not primed */ }

  // Build routing recommendation
  const routingParts: string[] = [];
  if (cocoIndexAvailable) {
    routingParts.push('semantic/concept search → mcp__cocoindex_code__search');
  }
  if (graphFreshness === 'fresh') {
    routingParts.push('structural queries (callers, deps) → code_graph_query');
  }
  routingParts.push('exact text/regex → Grep');
  const routingRecommendation = routingParts.join(' | ');

  return {
    specFolder,
    currentTask,
    graphFreshness,
    cocoIndexAvailable,
    sessionQuality,
    lastToolCallAgoMs,
    primed,
    routingRecommendation,
  };
}

/**
 * Phase 027: Build a structural bootstrap contract for a given surface.
 * Reuses resolveGraphFreshness() and getGraphStats() from this module.
 * Keeps output compact (targets 250-400 tokens, ceiling 500).
 */
export function buildStructuralBootstrapContract(
  sourceSurface: StructuralBootstrapContract['sourceSurface']
): StructuralBootstrapContract {
  const graphFreshness = resolveGraphFreshness();

  let status: StructuralBootstrapContract['status'];
  if (graphFreshness === 'fresh') {
    status = 'ready';
  } else if (graphFreshness === 'stale') {
    status = 'stale';
  } else {

exec
/bin/zsh -lc "sed -n '220,320p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  } else {
    status = 'missing';
  }

  let summary: string;
  let highlights: string[] | undefined;

  if (status === 'ready') {
    try {
      const stats = getGraphStats();
      summary = `Code graph: ${stats.totalFiles} files, ${stats.totalNodes} nodes, ${stats.totalEdges} edges (fresh)`;
      const topKinds = Object.entries(stats.nodesByKind)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
      if (topKinds.length > 0) {
        highlights = topKinds.map(([kind, count]) => `${kind}: ${count}`);
      }
    } catch {
      summary = 'Code graph available (structural context ready)';
    }
  } else if (status === 'stale') {
    try {
      const stats = getGraphStats();
      summary = `Code graph: ${stats.totalFiles} files, ${stats.totalNodes} nodes (stale — structural reads may refresh inline or recommend code_graph_scan)`;
    } catch {
      summary = 'Code graph data is stale — structural context may be outdated';
    }
  } else {
    summary = 'No structural context available — code graph is empty or unavailable';
  }

  let recommendedAction: string;
  if (status === 'ready') {
    recommendedAction = 'Structural context available. Use code_graph_query for structural lookups.';
  } else if (status === 'stale') {
    recommendedAction = 'Use a structural read to trigger bounded inline refresh when safe, or run code_graph_scan for broader stale states.';
  } else {
    recommendedAction = 'Call session_bootstrap first. Then run code_graph_scan if structural context is needed.';
  }

  const fittedContract = fitStructuralContractBudget(summary, highlights, recommendedAction);

  return {
    status,
    summary: fittedContract.summary,
    highlights: fittedContract.highlights,
    recommendedAction: fittedContract.recommendedAction,
    sourceSurface,
    provenance: {
      producer: 'session_snapshot',
      sourceSurface,
      trustState: trustStateFromStructuralStatus(status),
      generatedAt: new Date().toISOString(),
      lastUpdated: status === 'ready' || status === 'stale'
        ? (() => {
          try {
            const stats = getGraphStats();
            return stats.lastScanTimestamp ?? null;
          } catch {
            return null;
          }
        })()
        : null,
      sourceRefs: ['code-graph-db', 'session-snapshot'],
    },
  };
}

codex
I’ve confirmed our side has something Modus doesn’t appear to have so far: an explicit recovery contract for compaction/crash survival, not just better retrieval. I’m doing one more pass on the remaining code to make sure I’m not missing a hidden Modus startup cache or recovery hook before I synthesize the iteration findings.
exec
/bin/zsh -lc "rg -n \"startup|Build\\(|Open\\(|vault status|DocCount|index\" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go:23:	"github.com/GetModus/modus-memory/internal/index"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go:77:	// Build search index
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go:78:	idx, err := index.Build(vaultDir, "")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go:80:		log.Printf("Warning: index build failed: %v (starting with empty index)", err)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go:90:	log.Printf("modus-memory %s — vault: %s, %d docs indexed", version, vaultDir, idx.DocCount())
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go:132:	idx, err := index.Build(vaultDir, "")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go:144:	fmt.Printf("Documents: %d\n", idx.DocCount())
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:10:	"github.com/GetModus/modus-memory/internal/index"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:29:		var allResults []index.SearchResult
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:84:				var extra []index.DocRef
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:225:	srv.AddTool("vault_status", "Vault statistics — file counts, index size, cross-ref stats.", map[string]interface{}{
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:289:		var merged []index.MemFact
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:924:		return index.FormatConnected(refs), nil

exec
/bin/zsh -lc "sed -n '1,220p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,140p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// modus-memory is a standalone MCP memory server.
//
// A single Go binary that provides personal memory over the MCP protocol.
// BM25 full-text search, FSRS spaced-repetition decay, cross-referencing,
// librarian query expansion — all in ~6MB, zero dependencies. Completely free.
//
// Usage:
//
//	modus-memory                    — start MCP server on stdio
//	modus-memory --vault ~/notes    — use custom vault directory
//	modus-memory version            — print version
//	modus-memory health             — check vault health
//	modus-memory doctor              — diagnose vault problems (post-import validation)
//	modus-memory import khoj <file> — import from Khoj export (ZIP or JSON)
package main

import (
	"fmt"
	"log"
	"os"
	"path/filepath"

	"github.com/GetModus/modus-memory/internal/index"
	mcpsrv "github.com/GetModus/modus-memory/internal/mcp"
	"github.com/GetModus/modus-memory/internal/vault"
)

const version = "0.3.0"

func main() {
	// Parse flags
	vaultDir := ""
	args := os.Args[1:]

	for i := 0; i < len(args); i++ {
		switch args[i] {
		case "--vault", "-v":
			if i+1 < len(args) {
				vaultDir = args[i+1]
				i++
			}
		case "version", "--version":
			fmt.Printf("modus-memory %s\n", version)
			os.Exit(0)
		case "health":
			vd := resolveVaultDir(vaultDir)
			runHealth(vd)
			os.Exit(0)
		case "doctor":
			vd := resolveVaultDir(vaultDir)
			runDoctor(vd)
			os.Exit(0)
		case "import":
			vd := resolveVaultDir(vaultDir)
			runImport(vd, args[i+1:])
			os.Exit(0)
		}
	}

	vaultDir = resolveVaultDir(vaultDir)

	// Ensure vault directory exists
	if err := os.MkdirAll(vaultDir, 0755); err != nil {
		fmt.Fprintf(os.Stderr, "Cannot create vault directory %s: %v\n", vaultDir, err)
		os.Exit(1)
	}

	// Ensure core subdirectories exist
	for _, sub := range []string{"memory/facts", "brain", "atlas"} {
		os.MkdirAll(filepath.Join(vaultDir, sub), 0755)
	}

	// Redirect log output to stderr (stdout is MCP protocol)
	log.SetOutput(os.Stderr)
	log.SetPrefix("[modus-memory] ")

	// Build search index
	idx, err := index.Build(vaultDir, "")
	if err != nil {
		log.Printf("Warning: index build failed: %v (starting with empty index)", err)
	}

	// Create vault
	v := vault.New(vaultDir, idx)

	// Create MCP server with all 11 memory tools
	srv := mcpsrv.NewServer("modus-memory", version)
	mcpsrv.RegisterMemoryTools(srv, v)

	log.Printf("modus-memory %s — vault: %s, %d docs indexed", version, vaultDir, idx.DocCount())

	// Run MCP stdio loop
	srv.Run()
}

// resolveVaultDir determines the vault directory from flag, env, or default.
func resolveVaultDir(flagDir string) string {
	if flagDir != "" {
		return flagDir
	}
	if envDir := os.Getenv("MODUS_VAULT_DIR"); envDir != "" {
		return envDir
	}
	home, _ := os.UserHomeDir()
	return filepath.Join(home, "modus", "vault")
}

// runImport dispatches to the appropriate import converter.
func runImport(vaultDir string, args []string) {
	if len(args) < 2 {
		fmt.Fprintln(os.Stderr, "Usage: modus-memory import <format> <file>")
		fmt.Fprintln(os.Stderr, "")
		fmt.Fprintln(os.Stderr, "Formats:")
		fmt.Fprintln(os.Stderr, "  khoj    — Khoj AI export (ZIP or JSON)")
		os.Exit(1)
	}

	format := args[0]
	file := args[1]

	switch format {
	case "khoj":
		runImportKhoj(file, vaultDir)
	default:
		fmt.Fprintf(os.Stderr, "Unknown import format: %s\n", format)
		os.Exit(1)
	}
}

// runHealth prints vault statistics.
func runHealth(vaultDir string) {
	idx, err := index.Build(vaultDir, "")
	if err != nil {
		fmt.Printf("Vault: %s\n", vaultDir)
		fmt.Printf("Status: ERROR — %v\n", err)
		return
	}

	totalFacts, activeFacts := idx.FactCount()
	subjects, tags, entities := idx.CrossRefStats()

	fmt.Printf("modus-memory %s\n", version)
	fmt.Printf("Vault: %s\n", vaultDir)
	fmt.Printf("Documents: %d\n", idx.DocCount())
	fmt.Printf("Facts: %d total, %d active\n", totalFacts, activeFacts)
	fmt.Printf("Cross-refs: %d subjects, %d tags, %d entities\n", subjects, tags, entities)
}

 succeeded in 0ms:
# The Librarian Pattern

A local LLM that serves as the sole gatekeeper for your memory vault.

## The Problem

Most AI memory systems let any model read and write freely. This creates predictable problems:

- **Context bloat** — the cloud model sees everything, including noise, duplicates, and stale facts
- **Inconsistent storage** — different models tag, classify, and format memories differently
- **Token waste** — expensive frontier models spend tokens on retrieval, filtering, and filing instead of reasoning
- **No sovereignty** — your memories scatter across whatever model happens to be active

## The Solution

Run a small, dedicated local model — the **Librarian** — whose only job is memory stewardship. It sits between your vault and whatever model is doing the actual reasoning:

```
┌─────────────┐     ┌────────────────┐     ┌──────────────┐
│ Cloud Model  │◄───►│   Librarian    │◄───►│ modus-memory │
│ (reasoning)  │     │ (local, ~8B)   │     │   (vault)    │
└─────────────┘     └────────────────┘     └──────────────┘
                     Sole write access
                     Query expansion
                     Relevance filtering
                     Context compression
```

The cloud model stays focused on reasoning. The Librarian handles the boring-but-critical infrastructure: retrieval, filing, deduplication, decay, and context curation. It hands the cloud model only the 4-8k tokens that actually matter.

## Why This Works

**Token and cost discipline.** Cloud models are expensive once context balloons. The Librarian aggressively prunes, reranks, and synthesizes memories (using BM25 + FSRS + cross-references) before anything touches the cloud. You're running a local "memory compiler" so the expensive model only sees high-signal context.

**Context hygiene.** Cloud models get distracted by noise. The Librarian can pull the last 3 conversations about a topic, expand technical terms, drop anything older than 30 days unless FSRS says it's still relevant, and format it as a clean prompt. The cloud model stays focused.

**Privacy and sovereignty.** Sensitive data never leaves your machine unless you explicitly want it to. The Librarian can decide "this memory has PII — keep it local-only."

**Speed.** Local model runs on whatever hardware you have. No network round-trips for memory lookups. Searches return in microseconds.

## The System Prompt

This is the core prompt that defines the Librarian role. Adapt it to your model and use case:

```markdown
You are the Librarian — the sole steward of persistent memory and vault state.

You are the ONLY model authorized to write to the vault. All other models
delegate storage operations through you. When another model needs something
stored, corrected, or retrieved, it comes through you.

## Write Sovereignty

You are the single point of truth for all persistent state:
- memory_store: Store new facts (subject/predicate/value)
- vault_write: Write or update vault documents
- vault_search/vault_read: Retrieve information on behalf of other models

No other model writes to the vault. Models may change. The sovereignty
of this office does not.

## Operations

Filing: When another model hands you content (research, analysis, code docs),
file it in the correct vault location with proper frontmatter, tags, and
importance level.

Retrieval: When the reasoning model needs context, search the vault and
return only relevant, high-signal results. Compress and deduplicate before
returning. The reasoning model should never see noise.

Triage: Classify incoming items:
- ADAPT — valuable, add to vault with proper metadata
- KEEP — store as-is for reference
- DISCARD — not worth storing

Use importance levels: critical, high, medium, low.

Maintenance: Check for existing entries before creating new ones. Merge
related facts. Flag stale entries for decay. Reinforce facts that keep
getting accessed.

## Filing Rules

- Every vault entry needs YAML frontmatter (title, type, tags, status)
- Memory facts need subject, predicate, value, importance, and confidence
- Update rather than duplicate — always check first
- Tag everything — tags are how facts get found later
- Be concise and orderly. You are a custodian of records.
```

## Recommended Models

The Librarian doesn't need a frontier model. It needs a fast, reliable model that follows instructions precisely. Good candidates:

| Model | Size | Notes |
|-------|------|-------|
| Gemma 4 | 12B-26B | Strong instruction following, multimodal, our default |
| Qwen 3 | 8B-14B | Good structured output, fast |
| Llama 3 | 8B | Solid baseline, widely available |
| Phi-4 | 14B | Compact, good at structured tasks |

We run ours on Gemma 4 26B via Ollama. Any model that can reliably produce YAML frontmatter and follow classification rules will work. Even a 7-8B model is fine — the Librarian's job is structured and repetitive, not creative.

## Connecting to modus-memory

### Option 1: MCP Tool Delegation

If your AI client supports MCP, the simplest setup is tool-level delegation. Configure your client so the Librarian model handles memory tool calls:

```json
{
  "mcpServers": {
    "memory": {
      "command": "modus-memory",
      "args": ["--vault", "~/vault"]
    }
  }
}
```

Then instruct your reasoning model: *"For any memory operation, delegate to the Librarian. Do not write to memory directly."*

### Option 2: Prompt Pipeline

For tighter control, run the Librarian as a preprocessing step:

```bash
# 1. Librarian retrieves relevant context
echo "User is asking about React authentication patterns" | \
  ollama run gemma4:26b --system "$(cat librarian-prompt.md)" \
  "Search the vault for relevant context and return a compressed summary"

# 2. Feed the Librarian's output into the cloud model as system context
```

### Option 3: Agent Framework

In a multi-agent setup, the Librarian is one agent in the fleet with exclusive write access to vault tools. Other agents (coder, researcher, reasoner) request storage through the Librarian agent.


exec
/bin/zsh -lc 'rg -n "compact-merger|compaction injection|merge.*4000|4000-token|budget allocator|compaction" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:535:**Architecture:** CocoIndex (semantic, external MCP) finds code by concept. Code Graph (structural, this server) maps imports, calls and hierarchy. Memory (session, this server) preserves decisions. The compact-merger combines all three under a 4000-token budget for compaction injection.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1227:├── hooks/                     # Session-start/compaction surfacing, mutation feedback, token-count sync
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1269:> **Purpose:** Enable seamless session recovery after context compaction, crashes, or breaks.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:253:  hookName: 'tool-dispatch' | 'compaction' | 'memory-aware'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:368:  hookName: 'tool-dispatch' | 'compaction' | 'memory-aware' = 'memory-aware'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:626: * Fires at session compaction lifecycle points. Surfaces memories relevant
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:628: * across the compaction boundary.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:656:  return autoSurfaceMemories(sessionContext.trim(), COMPACTION_TOKEN_BUDGET, 'compaction');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:102:**Purpose**: Zero data loss on MCP server crash or context compaction.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:53:    expect(plan.compaction?.hook).toBe('experimental.session.compacting');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:7:/** Token budget for compaction context injection */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:17:import { mergeCompactBrief } from '../../lib/code-graph/compact-merger.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:18:import type { MergeInput } from '../../lib/code-graph/compact-merger.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:149:        ? 'Recovered compact transcript lines were removed before fallback compaction cache assembly.'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:150:        : 'No recovered compact transcript lines detected in fallback compaction cache assembly.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:163:        kind: 'compaction',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:170:        summary: 'Fallback compaction cache assembled from sanitized transcript tail',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:5:// contracts to OpenCode-oriented startup, message, and compaction blocks.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:37:  compaction?: OpenCodeTransportBlock;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:87:  compactionPayload?: SharedPayloadEnvelope | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:95:    args.compactionPayload?.kind,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:102:  const compactionPayload = args.compactionPayload ?? args.resumePayload ?? args.bootstrapPayload ?? null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:140:    ...(compactionPayload
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:142:        compaction: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:145:          payloadKind: compactionPayload.kind,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:146:          dedupeKey: `compaction:${compactionPayload.kind}`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:148:            compactionPayload,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:149:            'Inject this as the continuity note across compaction. Keep it separate from current-turn retrieval.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:5:// shared by startup, recovery, and compaction surfaces.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:12:  | 'compaction';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1123:    it('T000g: memory_context resume mode invokes TM-05 compaction hook at runtime', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/compact-merger.vitest.ts:5:import { mergeCompactBrief, type MergeInput } from '../lib/code-graph/compact-merger.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/compact-merger.vitest.ts:12:    triggered: 'Trigger: compaction recovery context',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/compact-merger.vitest.ts:29:      const result = mergeCompactBrief(createInput(), 4000);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/compact-merger.vitest.ts:45:      expect(result.payloadContract.kind).toBe('compaction');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/compact-merger.vitest.ts:85:      const result = mergeCompactBrief(createInput(), 4000, undefined, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/budget-allocator.ts:31:/** Default floor layout for the 4000-token compact brief budget */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/trigger-extractor.vitest.ts:20:      a compaction cycle. The compaction cycle moves live objects to reduce
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/README.md:3:Core implementation for the structural code graph system. Provides file parsing, SQLite storage, graph queries, CocoIndex bridge, budget allocation, and compaction merging.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/README.md:16:| `compact-merger.ts` | 3-source merge (Memory + Code Graph + CocoIndex) for compaction |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/README.md:26:The compact-merger combines all three under a 4000-token budget for compaction injection.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:5:// into a unified compact brief for compaction injection.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:192:      kind: 'compaction',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:208:        sourceSurface: 'compaction',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:212:        sourceRefs: ['budget-allocator', 'compact-merger'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/budget-allocator.vitest.ts:11:describe('budget allocator', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/budget-allocator.vitest.ts:46:    it('uses caller budgets above the default 4000-token layout', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/working-set-tracker.ts:4:// Tracks files and symbols accessed during a session for compaction
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/index.ts:11:export * from './compact-merger.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:707:/** Compute token usage ratio (completion / total) for budget allocator consumption */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/runtime-routing.vitest.ts:33:    it('what is the purpose of the budget allocator', () => { expect(classifyQueryIntent('what is the purpose of the budget allocator').intent).toBe('semantic'); });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:4:// - autoSurfaceAtCompaction:   fires at session compaction lifecycle point
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:12:import { mergeCompactBrief } from '../lib/code-graph/compact-merger.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:13:import type { MergeInput } from '../lib/code-graph/compact-merger.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:300:  it('fires matcher once at tool-dispatch and once at compaction lifecycle points', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:305:    await autoSurfaceAtCompaction('compaction lifecycle context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:309:    expect(matchSpy).toHaveBeenNthCalledWith(2, 'compaction lifecycle context', 5);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:569:  it('compaction hook also enforces result limit via matchTriggerPhrases', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:609:  it('compaction output boundary enforces estimated token budget', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:622:    const result = await autoSurfaceAtCompaction('compaction context for budget enforcement');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:698:    await autoSurfaceAtCompaction('compaction session context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:743:describe('compaction pipeline integration', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:753:    const brief = mergeCompactBrief(input, 4000);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:777:    const brief = mergeCompactBrief(input, 4000);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:804:    const brief = mergeCompactBrief(largeInput, 4000);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:40:        compaction: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:44:          dedupeKey: 'compaction:resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:45:          content: 'Summary: compaction note',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:164:  it('adds a compaction note and invalidates cache on session events', async () => {

exec
/bin/zsh -lc "sed -n '620,700p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   7. COMPACTION HOOK (TM-05)
──────────────────────────────────────────────────────────────── */

/**
 * autoSurfaceAtCompaction
 *
 * Fires at session compaction lifecycle points. Surfaces memories relevant
 * to the ongoing session context so that critical knowledge is preserved
 * across the compaction boundary.
 *
 * Skipped when:
 *   - sessionContext is empty or too short to extract signal
 *   - enableCompactionHook is false in the integration config
 *
 * Token budget: COMPACTION_TOKEN_BUDGET (4000 max)
 *
 * @param sessionContext - A textual summary of the current session state
 * @param options        - Optional integration-layer config flags
 * @returns AutoSurfaceResult or null if nothing to surface / hook disabled
 */
async function autoSurfaceAtCompaction(
  sessionContext: string,
  options?: { enableCompactionHook?: boolean }
): Promise<AutoSurfaceResult | null> {
  // Allow integration layer to disable this hook via config flag
  if (options && options.enableCompactionHook === false) {
    return null;
  }

  // Require a meaningful context string (at least 3 characters)
  if (!sessionContext || typeof sessionContext !== 'string' || sessionContext.trim().length < 3) {
    return null;
  }

  // Delegate to the core surface function; token budget is explicitly
  // Enforced at the hook output boundary via estimateTokenCount().
  return autoSurfaceMemories(sessionContext.trim(), COMPACTION_TOKEN_BUDGET, 'compaction');
}

/* ───────────────────────────────────────────────────────────────
   8. EXPORTS
──────────────────────────────────────────────────────────────── */

export {
  // Constants
  MEMORY_AWARE_TOOLS,
  CONSTITUTIONAL_CACHE_TTL,
  TOOL_DISPATCH_TOKEN_BUDGET,
  COMPACTION_TOKEN_BUDGET,

  // Functions
  extractContextHint,
  getConstitutionalMemories,
  clearConstitutionalCache,
  autoSurfaceMemories,
  primeSessionIfNeeded,
  resetSessionPrimed,
  autoSurfaceAtToolDispatch,
  autoSurfaceAtCompaction,

  // T018: Session tracking for session_health tool
  recordToolCall,
  getSessionTimestamps,
  getLastActiveSessionId,
  isSessionPrimed,
  markSessionPrimed,
  getCodeGraphStatusSnapshot,
};

// T018: Export types for session-health handler
export type { PrimePackage, AutoSurfaceResult };

exec
/bin/zsh -lc "sed -n '1,260p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Compact Merger
// ───────────────────────────────────────────────────────────────
// Merges context from multiple sources (Memory, Code Graph, CocoIndex, Session)
// into a unified compact brief for compaction injection.

import { allocateBudget, createDefaultSources, type AllocationResult } from './budget-allocator.js';
import {
  createSharedPayloadEnvelope,
  type PreMergeSelectionMetadata,
  type SharedPayloadEnvelope,
} from '../context/shared-payload.js';

/** Input from each context source */
export interface MergeInput {
  constitutional: string;    // Constitutional rules (from Memory)
  codeGraph: string;         // Structural context (from Code Graph)
  cocoIndex: string;         // Semantic neighbors (from CocoIndex)
  triggered: string;         // Triggered memories (from Memory)
  sessionState: string;      // Active task / next steps
}

/** Per-source freshness metadata */
export interface SourceFreshness {
  source: string;
  lastUpdated: string | null;
  staleness: 'fresh' | 'recent' | 'stale' | 'unknown';
}

/** Merged compact brief with metadata */
export interface MergedBrief {
  text: string;
  sections: {
    name: string;
    content: string;
    tokenEstimate: number;
    source: string;
  }[];
  allocation: AllocationResult;
  payloadContract: SharedPayloadEnvelope;
  metadata: {
    totalTokenEstimate: number;
    sourceCount: number;
    mergedAt: string;
    mergeDurationMs: number;
    deduplicatedFiles: number;
    freshness: SourceFreshness[];
    selection?: PreMergeSelectionMetadata;
  };
}

/** Estimate tokens from string (4 chars ≈ 1 token) */
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/** Truncate text to fit within a token budget */
function truncateToTokens(text: string, maxTokens: number): string {
  if (maxTokens <= 0) return '';
  if (estimateTokens(text) <= maxTokens) return text;

  const marker = '\n[...truncated]';
  const maxChars = maxTokens * 4;
  if (marker.length >= maxChars) {
    return text.slice(0, maxChars);
  }

  const contentChars = Math.max(0, maxChars - marker.length);
  return text.slice(0, contentChars) + marker;
}

/** Extract file paths from a text section for deduplication */
function extractFilePathsFromText(text: string): Set<string> {
  const paths = new Set<string>();
  const pathRegex = /(?:\/[\w.-]+){2,}(?:\.\w+)/g;
  const matches = text.match(pathRegex);
  if (matches) matches.forEach(m => paths.add(m));
  return paths;
}

/** Deduplicate file references across sections — higher priority sources keep their mentions */
function deduplicateFilePaths(sections: MergedBrief['sections']): number {
  const seenFiles = new Set<string>();
  let removedCount = 0;

  for (const section of sections) {
    const filePaths = extractFilePathsFromText(section.content);
    const duplicates: string[] = [];

    for (const fp of filePaths) {
      if (seenFiles.has(fp)) {
        duplicates.push(fp);
        removedCount++;
      } else {
        seenFiles.add(fp);
      }
    }

    // Remove duplicate file path lines from lower-priority sections
    if (duplicates.length > 0) {
      let content = section.content;
      for (const dup of duplicates) {
        const lineRegex = new RegExp(`^.*${dup.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.*$\n?`, 'gm');
        content = content.replace(lineRegex, '');
      }
      section.content = content.trim();
      section.tokenEstimate = estimateTokens(section.content);
    }
  }
  return removedCount;
}

/**
 * Merge context from multiple sources into a compact brief.
 *
 * Strategy:
 * 1. Allocate budget across sources (floor + overflow)
 * 2. Truncate each source to its granted budget
 * 3. Deduplicate at file level (same file from multiple sources → keep highest priority)
 * 4. Render sections in priority order with headers
 */
export function mergeCompactBrief(
  input: MergeInput,
  totalBudget: number = 4000,
  freshness?: SourceFreshness[],
  selection?: PreMergeSelectionMetadata,
): MergedBrief {
  const startTime = performance.now();

  const constitutionalSize = estimateTokens(input.constitutional);
  const codeGraphSize = estimateTokens(input.codeGraph);
  const cocoIndexSize = estimateTokens(input.cocoIndex);
  const triggeredSize = estimateTokens(input.triggered);
  const sessionStateSize = estimateTokens(input.sessionState);

  const sources = createDefaultSources(
    constitutionalSize,
    codeGraphSize,
    cocoIndexSize,
    triggeredSize,
    sessionStateSize,
  );
  const allocation = allocateBudget(sources, totalBudget);

  // Build sections with granted budgets
  const sections: MergedBrief['sections'] = [];
  const allocationMap = new Map(allocation.allocations.map(a => [a.name, a]));
  const pushSection = (
    inputText: string,
    allocationName: string,
    sectionName: string,
    source: string,
  ): void => {
    if (!inputText.trim()) return;

    const granted = allocationMap.get(allocationName)?.granted ?? 0;
    if (granted <= 0) return;

    const content = truncateToTokens(inputText, granted);
    if (!content.trim()) return;

    sections.push({
      name: sectionName,
      content,
      tokenEstimate: estimateTokens(content),
      source,
    });
  };

  pushSection(input.constitutional, 'constitutional', 'Constitutional Rules', 'memory');
  pushSection(input.codeGraph, 'codeGraph', 'Active Files & Structural Context', 'code-graph');
  pushSection(input.cocoIndex, 'cocoIndex', 'Semantic Neighbors', 'cocoindex');
  pushSection(input.sessionState, 'sessionState', 'Session State / Next Steps', 'session');
  pushSection(input.triggered, 'triggered', 'Triggered Memories', 'memory');

  // File-level deduplication across sections
  const deduplicatedFiles = deduplicateFilePaths(sections);

  // Render final text
  const text = sections
    .map(s => `## ${s.name}\n${s.content}`)
    .join('\n\n');

  const totalTokenEstimate = sections.reduce((sum, s) => sum + s.tokenEstimate, 0);
  const mergeDurationMs = Math.round(performance.now() - startTime);

  return {
    text,
    sections,
    allocation,
    payloadContract: createSharedPayloadEnvelope({
      kind: 'compaction',
      sections: sections.map((section) => ({
        key: section.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title: section.name,
        content: section.content,
        source: section.source === 'code-graph'
          ? 'code-graph'
          : section.source === 'cocoindex'
            ? 'semantic'
            : section.source === 'session'
              ? 'session'
              : 'memory',
      })),
      summary: `Compaction payload merged ${sections.length} sections within ${totalBudget} tokens`,
      provenance: {
        producer: 'compact_merger',
        sourceSurface: 'compaction',
        trustState: 'live',
        generatedAt: new Date().toISOString(),
        lastUpdated: null,
        sourceRefs: ['budget-allocator', 'compact-merger'],
      },
      ...(selection ? { selection } : {}),
    }),
    metadata: {
      totalTokenEstimate,
      sourceCount: sections.length,
      mergedAt: new Date().toISOString(),
      mergeDurationMs,
      deduplicatedFiles,
      freshness: freshness ?? [
        { source: 'constitutional', lastUpdated: null, staleness: 'unknown' },
        { source: 'codeGraph', lastUpdated: null, staleness: 'unknown' },
        { source: 'cocoIndex', lastUpdated: null, staleness: 'unknown' },
        { source: 'triggered', lastUpdated: null, staleness: 'unknown' },
      ],
      ...(selection ? { selection } : {}),
    },
  };
}

exec
/bin/zsh -lc "sed -n '1,220p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: OpenCode Transport Adapter
// ───────────────────────────────────────────────────────────────
// Phase 030 / Phase 2: transport-only mapping from shared payload
// contracts to OpenCode-oriented startup, message, and compaction blocks.

import type { SharedPayloadEnvelope, SharedPayloadSection } from './shared-payload.js';

/** Hook names emitted by the OpenCode transport adapter. */
export type OpenCodeTransportHook =
  | 'event'
  | 'experimental.chat.system.transform'
  | 'experimental.chat.messages.transform'
  | 'experimental.session.compacting';

/** One transport block delivered to an OpenCode runtime hook surface. */
export interface OpenCodeTransportBlock {
  hook: OpenCodeTransportHook;
  title: string;
  payloadKind: SharedPayloadEnvelope['kind'];
  dedupeKey: string;
  content: string;
}

/** Complete transport-only plan derived from shared startup/resume payloads. */
export interface OpenCodeTransportPlan {
  interfaceVersion: '1.0';
  transportOnly: true;
  retrievalPolicyOwner: 'runtime';
  event: {
    hook: 'event';
    trackedPayloadKinds: SharedPayloadEnvelope['kind'][];
    summary: string;
  };
  systemTransform?: OpenCodeTransportBlock;
  messagesTransform: OpenCodeTransportBlock[];
  compaction?: OpenCodeTransportBlock;
}

function isSharedPayloadEnvelope(value: unknown): value is SharedPayloadEnvelope {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const record = value as Record<string, unknown>;
  return typeof record.kind === 'string'
    && typeof record.summary === 'string'
    && Array.isArray(record.sections)
    && !!record.provenance
    && typeof record.provenance === 'object';
}

/** Narrow an unknown runtime payload to the shared transport envelope contract. */
export function coerceSharedPayloadEnvelope(value: unknown): SharedPayloadEnvelope | null {
  return isSharedPayloadEnvelope(value) ? value : null;
}

function renderSections(sections: SharedPayloadSection[], maxSections: number = 2): string {
  return sections
    .slice(0, maxSections)
    .map((section) => `### ${section.title}\n${section.content}`)
    .join('\n\n');
}

function renderBlockContent(payload: SharedPayloadEnvelope, prefix?: string): string {
  const parts = [
    prefix ? `${prefix}\n` : null,
    `Summary: ${payload.summary}`,
    renderSections(payload.sections),
    `Provenance: producer=${payload.provenance.producer}; trustState=${payload.provenance.trustState}; sourceSurface=${payload.provenance.sourceSurface}`,
  ].filter(Boolean);
  return parts.join('\n\n');
}

function appendStartupSnapshotNote(content: string): string {
  return [
    content,
    'Note: this is a startup snapshot; later structural reads may differ if the repo state changed.',
  ].join('\n\n');
}

/** Build the OpenCode runtime hook plan from the shared payload surfaces. */
export function buildOpenCodeTransportPlan(args: {
  bootstrapPayload?: SharedPayloadEnvelope | null;
  startupPayload?: SharedPayloadEnvelope | null;
  resumePayload?: SharedPayloadEnvelope | null;
  healthPayload?: SharedPayloadEnvelope | null;
  compactionPayload?: SharedPayloadEnvelope | null;
  specFolder?: string | null;
}): OpenCodeTransportPlan {
  const trackedPayloadKinds = [
    args.bootstrapPayload?.kind,
    args.startupPayload?.kind,
    args.resumePayload?.kind,
    args.healthPayload?.kind,
    args.compactionPayload?.kind,
  ].filter((kind): kind is SharedPayloadEnvelope['kind'] => !!kind);

  const systemPayload = args.bootstrapPayload ?? args.startupPayload ?? args.resumePayload ?? null;
  const messagePayloads = [args.resumePayload, args.healthPayload].filter(
    (payload): payload is SharedPayloadEnvelope => !!payload,
  );
  const compactionPayload = args.compactionPayload ?? args.resumePayload ?? args.bootstrapPayload ?? null;

  return {
    interfaceVersion: '1.0',
    transportOnly: true,
    retrievalPolicyOwner: 'runtime',
    event: {
      hook: 'event',
      trackedPayloadKinds,
      summary: args.specFolder
        ? `Track OpenCode routing hints for ${args.specFolder}`
        : 'Track OpenCode routing hints for the current packet/runtime state',
    },
    ...(systemPayload
      ? {
        systemTransform: {
          hook: 'experimental.chat.system.transform',
          title: 'OpenCode Startup Digest',
          payloadKind: systemPayload.kind,
          dedupeKey: `system:${systemPayload.kind}`,
          content: appendStartupSnapshotNote(renderBlockContent(
            systemPayload,
            'Inject this as the startup digest for hookless OpenCode recovery. Keep it transport-only.',
          ),
          ),
        },
      }
      : {}),
    messagesTransform: messagePayloads.map((payload, index) => ({
      hook: 'experimental.chat.messages.transform' as const,
      title: index === 0 ? 'OpenCode Retrieved Context' : 'OpenCode Operational Context',
      payloadKind: payload.kind,
      dedupeKey: `messages:${payload.kind}:${index}`,
      content: renderBlockContent(
        payload,
        'Inject this as bounded current-turn context. Do not treat it as retrieval policy.',
      ),
    })),
    ...(compactionPayload
      ? {
        compaction: {
          hook: 'experimental.session.compacting',
          title: 'OpenCode Compaction Resume Note',
          payloadKind: compactionPayload.kind,
          dedupeKey: `compaction:${compactionPayload.kind}`,
          content: renderBlockContent(
            compactionPayload,
            'Inject this as the continuity note across compaction. Keep it separate from current-turn retrieval.',
          ),
        },
      }
      : {}),
  };
}

exec
/bin/zsh -lc "sed -n '1,220p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// MODULE: PreCompact Hook — Compact Inject
// ───────────────────────────────────────────────────────────────
// Runs on Claude Code PreCompact event. Precomputes critical context
// using the 3-source merge pipeline (Memory, Code Graph, CocoIndex)
// and caches to hook state for later injection by SessionStart hook.
// stdout is NOT injected on PreCompact — we only cache here.

import { performance } from 'node:perf_hooks';
import { readFileSync } from 'node:fs';
import {
  parseHookStdin, hookLog, truncateToTokenBudget,
  withTimeout, HOOK_TIMEOUT_MS, COMPACTION_TOKEN_BUDGET,
} from './shared.js';
import { ensureStateDir, updateState } from './hook-state.js';
import { mergeCompactBrief } from '../../lib/code-graph/compact-merger.js';
import type { MergeInput } from '../../lib/code-graph/compact-merger.js';
import { autoSurfaceAtCompaction } from '../../hooks/memory-surface.js';
import {
  createPreMergeSelectionMetadata,
  type SharedPayloadEnvelope,
} from '../../lib/context/shared-payload.js';

const COMPACT_FEEDBACK_GUARDS = [
  /^\s*\[SOURCE:\s*hook-cache/i,
  /^\s*\[PROVENANCE:/i,
  /^\s*\[\/SOURCE\]/i,
  /^\s*##\s+Recovered Context/i,
  /^\s*##\s+Recovery Instructions/i,
  /\bauto-recovered\b/i,
];

/** Extract the last N lines from a file */
function tailFile(filePath: string, lines: number): string[] {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const allLines = content.split('\n');
    return allLines.slice(Math.max(0, allLines.length - lines));
  } catch {
    return [];
  }
}

/** Extract file paths mentioned in transcript lines */
function extractFilePaths(lines: string[]): string[] {
  const pathRegex = /(?:\/[\w.-]+){2,}(?:\.\w+)/g;
  const paths = new Set<string>();
  for (const line of lines) {
    const matches = line.match(pathRegex);
    if (matches) {
      for (const m of matches) paths.add(m);
    }
  }
  return [...paths].slice(0, 20);
}

/** Extract topics from recent transcript content */
function extractTopics(lines: string[]): string[] {
  const topics = new Set<string>();
  for (const line of lines) {
    const specMatch = line.match(/specs\/[\w-]+/g);
    if (specMatch) specMatch.forEach(m => topics.add(m));
    const toolMatch = line.match(/memory_\w+|code_graph_\w+|task_\w+/g);
    if (toolMatch) toolMatch.forEach(m => topics.add(m));
  }
  return [...topics].slice(0, 10);
}

function stripRecoveredCompactLines(lines: string[]): string[] {
  return lines.filter((line) => !COMPACT_FEEDBACK_GUARDS.some((guard) => guard.test(line)));
}

/** Extract most-referenced identifiers from transcript lines (top 10 by frequency) */
function extractAttentionSignals(lines: string[]): string[] {
  const freq = new Map<string, number>();
  // camelCase function calls: e.g. buildMergedContext(
  const funcRe = /\b([a-z][a-zA-Z0-9]{2,})\s*\(/g;
  // PascalCase class/interface names: e.g. MergeInput, OutputSection
  const classRe = /\b([A-Z][a-zA-Z0-9]{2,})\b/g;
  // Common noise words to skip
  const noise = new Set(['Error', 'String', 'Object', 'Array', 'Promise', 'Buffer', 'Date', 'Map', 'Set', 'Number', 'Boolean', 'Function', 'RegExp', 'JSON', 'Math', 'console', 'process', 'undefined', 'null']);
  for (const line of lines) {
    let m: RegExpExecArray | null;
    funcRe.lastIndex = 0;
    while ((m = funcRe.exec(line)) !== null) {
      const id = m[1];
      if (!noise.has(id) && id.length <= 60) {
        freq.set(id, (freq.get(id) ?? 0) + 1);
      }
    }
    classRe.lastIndex = 0;
    while ((m = classRe.exec(line)) !== null) {
      const id = m[1];
      if (!noise.has(id) && id.length <= 60) {
        freq.set(id, (freq.get(id) ?? 0) + 1);
      }
    }
  }
  return [...freq.entries()]
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([id, count]) => `- ${id} (referenced ${count}x)`);
}

/** Detect active spec folder paths from transcript lines */
function detectSpecFolder(lines: string[]): string | null {
  const specFolderRe = /\.opencode\/specs\/[\w/-]+/g;
  const freq = new Map<string, number>();
  for (const line of lines) {
    const matches = line.match(specFolderRe);
    if (matches) {
      for (const m of matches) {
        // Normalize to folder (strip trailing file component if present)
        const folder = m.replace(/\/[^/]+\.\w+$/, '');
        freq.set(folder, (freq.get(folder) ?? 0) + 1);
      }
    }
  }
  if (freq.size === 0) return null;
  // Return the most-referenced spec folder
  return [...freq.entries()].sort((a, b) => b[1] - a[1])[0][0];
}

/** Build compact context from transcript analysis (legacy fallback) */
function buildCompactContext(transcriptLines: string[]): string {
  const filePaths = extractFilePaths(transcriptLines);
  const topics = extractTopics(transcriptLines);
  const sections: string[] = [];

  if (filePaths.length > 0) {
    sections.push('## Active Files\n' + filePaths.map(p => `- ${p}`).join('\n'));
  }
  if (topics.length > 0) {
    sections.push('## Recent Topics\n' + topics.map(t => `- ${t}`).join('\n'));
  }

  const meaningfulLines = transcriptLines
    .filter(l => l.trim().length > 10 && !l.startsWith('{'))
    .slice(-5);
  if (meaningfulLines.length > 0) {
    sections.push('## Recent Context\n' + meaningfulLines.join('\n'));
  }

  // Hint for AI to use CocoIndex for semantic neighbors after recovery
  if (filePaths.length > 0) {
    sections.push('## Semantic Context (CocoIndex)\nUse `mcp__cocoindex_code__search` to find semantic neighbors of active files listed above.');
  }

  return sections.join('\n\n');
}

type AutoSurfaceAtCompactionResult = Awaited<ReturnType<typeof autoSurfaceAtCompaction>>;

function renderConstitutionalMemories(
  autoSurfaced: AutoSurfaceAtCompactionResult,
): string {
  const constitutional = autoSurfaced?.constitutional ?? [];
  if (constitutional.length === 0) {
    return '';
  }

  const lines = constitutional.map((memory) => {
    const details: string[] = [`- ${memory.title}`];

    if (memory.retrieval_directive) {
      details.push(`  ${memory.retrieval_directive}`);
    }

    const provenance = [memory.specFolder, memory.filePath].filter(Boolean).join(' | ');
    if (provenance) {
      details.push(`  ${provenance}`);
    }

    return details.join('\n');
  });

  return `## Constitutional Rules\n${lines.join('\n')}`;
}

function renderTriggeredMemories(
  autoSurfaced: AutoSurfaceAtCompactionResult,
): string {
  const triggered = autoSurfaced?.triggered ?? [];
  if (triggered.length === 0) {
    return '';
  }

  const lines = triggered.map((memory) => {
    const matchedPhrases = [...new Set(memory.matched_phrases
      .map((phrase) => phrase.trim())
      .filter((phrase) => phrase.length > 0))];

    if (matchedPhrases.length === 0) {
      return `- ${memory.title}`;
    }

    return `- ${memory.title} (matched: ${matchedPhrases.join(', ')})`;
  });

  return `## Relevant Memories\n${lines.join('\n')}`;
}

/**
 * Build merged context using the 3-source merge pipeline.
 * Extracts session state from transcript, then delegates budget allocation
 * and section rendering to mergeCompactBrief.
 */
async function buildMergedContext(transcriptLines: string[]): Promise<string> {
  const sanitizedLines = stripRecoveredCompactLines(transcriptLines);
  const filePaths = extractFilePaths(sanitizedLines);
  const topics = extractTopics(sanitizedLines);

  // Build codeGraph input: active files + structural hints
  const codeGraphParts: string[] = [];
  if (filePaths.length > 0) {
    codeGraphParts.push('Active files:\n' + filePaths.map(p => `- ${p}`).join('\n'));
  }
  const codeGraph = codeGraphParts.join('\n\n');

exec
/bin/zsh -lc "sed -n '220,420p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  const codeGraph = codeGraphParts.join('\n\n');

  // Build cocoIndex input: semantic neighbor hint for post-recovery
  const cocoIndex = filePaths.length > 0
    ? 'Use `mcp__cocoindex_code__search` to find semantic neighbors of active files listed above.'
    : '';

  // Build sessionState input: recent context + topics + attention signals
  const sessionParts: string[] = [];

  // Spec folder detection
  const specFolder = detectSpecFolder(sanitizedLines);
  if (specFolder) {
    sessionParts.push(`Active spec folder: ${specFolder}`);
  }

  // Working memory attention signals
  const attentionSignals = extractAttentionSignals(sanitizedLines);
  if (attentionSignals.length > 0) {
    sessionParts.push('Working memory attention:\n' + attentionSignals.join('\n'));
  }

  if (topics.length > 0) {
    sessionParts.push('Recent topics:\n' + topics.map(t => `- ${t}`).join('\n'));
  }
  const meaningfulLines = sanitizedLines
    .filter(l => l.trim().length > 10 && !l.startsWith('{'))
    .slice(-5);
  if (meaningfulLines.length > 0) {
    sessionParts.push('Recent context:\n' + meaningfulLines.join('\n'));
  }
  const sessionState = sessionParts.join('\n\n');

  const selection = createPreMergeSelectionMetadata({
    selectedFrom: ['transcript-tail', 'active-files', 'recent-topics', 'attention-signals'],
    fileCount: filePaths.length,
    topicCount: topics.length,
    attentionSignalCount: attentionSignals.length,
    notes: [
      sanitizedLines.length !== transcriptLines.length
        ? 'Recovered compact transcript lines were removed before pre-merge selection.'
        : 'No recovered compact transcript lines detected in the current tail.',
      specFolder ? `Spec folder anchored: ${specFolder}` : 'No active spec folder detected in transcript tail.',
    ],
    antiFeedbackGuards: [
      'Strip recovered hook-cache source markers before transcript summarization.',
      'Do not reuse Recovery Instructions text as session-state evidence.',
      'Build pre-merge candidates before section assembly.',
    ],
  });

  const mergeInput: MergeInput = {
    constitutional: '',   // Constitutional rules come from Memory MCP, not available in hooks
    codeGraph,
    cocoIndex,
    triggered: '',        // Triggered memories not available in hooks
    sessionState,
  };

  // Merge with timing
  const t0 = performance.now();
  const merged = mergeCompactBrief(mergeInput, COMPACTION_TOKEN_BUDGET, undefined, selection);
  const elapsed = performance.now() - t0;

  if (elapsed > 1500) {
    hookLog('warn', 'compact-inject', `Merge pipeline took ${elapsed.toFixed(0)}ms (budget: ${HOOK_TIMEOUT_MS}ms)`);
  } else {
    hookLog('info', 'compact-inject', `Merge pipeline completed in ${elapsed.toFixed(0)}ms (${merged.metadata.sourceCount} sections, ~${merged.metadata.totalTokenEstimate} tokens)`);
  }

  const autoSurfaced = await autoSurfaceAtCompaction(sessionState);
  if (!autoSurfaced) {
    return merged.text;
  }

  hookLog(
    'info',
    'compact-inject',
    `Compaction auto-surface returned ${autoSurfaced.constitutional.length} constitutional and ${autoSurfaced.triggered.length} triggered memories (${autoSurfaced.latencyMs}ms)`,
  );

  const constitutionalSection = renderConstitutionalMemories(autoSurfaced);
  const triggeredSection = renderTriggeredMemories(autoSurfaced);
  const surfacedSections = [constitutionalSection, triggeredSection]
    .filter((section) => section.length > 0);

  if (surfacedSections.length === 0) {
    return merged.text;
  }

  const surfacedContext = surfacedSections.join('\n\n');

  return merged.text
    ? `${surfacedContext}\n\n${merged.text}`
    : surfacedContext;
}

async function buildMergedPayloadContract(transcriptLines: string[]): Promise<SharedPayloadEnvelope> {
  const sanitizedLines = stripRecoveredCompactLines(transcriptLines);
  const filePaths = extractFilePaths(sanitizedLines);
  const topics = extractTopics(sanitizedLines);
  const attentionSignals = extractAttentionSignals(sanitizedLines);
  const sessionParts: string[] = [];
  const specFolder = detectSpecFolder(sanitizedLines);
  if (specFolder) {
    sessionParts.push(`Active spec folder: ${specFolder}`);
  }
  if (attentionSignals.length > 0) {
    sessionParts.push('Working memory attention:\n' + attentionSignals.join('\n'));
  }
  if (topics.length > 0) {
    sessionParts.push('Recent topics:\n' + topics.map((topic) => `- ${topic}`).join('\n'));
  }
  const meaningfulLines = sanitizedLines.filter((line) => line.trim().length > 10 && !line.startsWith('{')).slice(-5);
  if (meaningfulLines.length > 0) {
    sessionParts.push('Recent context:\n' + meaningfulLines.join('\n'));
  }

  const selection = createPreMergeSelectionMetadata({
    selectedFrom: ['transcript-tail', 'active-files', 'recent-topics', 'attention-signals'],
    fileCount: filePaths.length,
    topicCount: topics.length,
    attentionSignalCount: attentionSignals.length,
    notes: [
      sanitizedLines.length !== transcriptLines.length
        ? 'Recovered compact transcript lines were removed before pre-merge selection.'
        : 'No recovered compact transcript lines detected in the current tail.',
      specFolder ? `Spec folder anchored: ${specFolder}` : 'No active spec folder detected in transcript tail.',
    ],
    antiFeedbackGuards: [
      'Strip recovered hook-cache source markers before transcript summarization.',
      'Do not reuse Recovery Instructions text as session-state evidence.',
      'Build pre-merge candidates before section assembly.',
    ],
  });

  const mergeInput: MergeInput = {
    constitutional: '',
    codeGraph: filePaths.length > 0 ? 'Active files:\n' + filePaths.map((filePath) => `- ${filePath}`).join('\n') : '',
    cocoIndex: filePaths.length > 0
      ? 'Use `mcp__cocoindex_code__search` to find semantic neighbors of active files listed above.'
      : '',
    triggered: '',
    sessionState: sessionParts.join('\n\n'),
  };

  return mergeCompactBrief(mergeInput, COMPACTION_TOKEN_BUDGET, undefined, selection).payloadContract;
}

async function main(): Promise<void> {
  ensureStateDir();

  const input = await withTimeout(parseHookStdin(), HOOK_TIMEOUT_MS, null);
  if (!input) {
    hookLog('warn', 'compact-inject', 'No stdin input received');
    return;
  }

  const sessionId = input.session_id ?? 'unknown';
  hookLog('info', 'compact-inject', `PreCompact triggered for session ${sessionId} (trigger: ${input.trigger ?? 'unknown'})`);

  let transcriptLines: string[] = [];
  if (input.transcript_path) {
    transcriptLines = tailFile(input.transcript_path, 50);
    hookLog('info', 'compact-inject', `Read ${transcriptLines.length} transcript lines`);
  }

  // Use the 3-source merge pipeline, falling back to legacy on error
  let payload: string;
  try {
    const mergedContext = await buildMergedContext(transcriptLines);
    payload = truncateToTokenBudget(mergedContext, COMPACTION_TOKEN_BUDGET);
    const payloadContract = await buildMergedPayloadContract(transcriptLines);
    updateState(sessionId, {
      pendingCompactPrime: {
        payload,
        cachedAt: new Date().toISOString(),
        payloadContract: {
          ...payloadContract,
          provenance: {
            ...payloadContract.provenance,
            producer: 'hook_cache',
            sourceSurface: 'compact-cache',
            trustState: 'cached',
          },
        },
      },
    });
    hookLog('info', 'compact-inject', `Cached compact context (${payload.length} chars) for session ${sessionId}`);
    return;
  } catch (err: unknown) {
    hookLog('warn', 'compact-inject', `Merge pipeline failed, falling back to legacy: ${err instanceof Error ? err.message : String(err)}`);
    const rawContext = buildCompactContext(transcriptLines);
    payload = truncateToTokenBudget(rawContext, COMPACTION_TOKEN_BUDGET);
  }

  updateState(sessionId, {
    pendingCompactPrime: {
      payload,
      cachedAt: new Date().toISOString(),
      payloadContract: null,

exec
/bin/zsh -lc "sed -n '1,120p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
package mcp

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"

	"github.com/GetModus/modus-memory/internal/index"
	"github.com/GetModus/modus-memory/internal/librarian"
	"github.com/GetModus/modus-memory/internal/vault"
)

// RegisterVaultTools adds all vault MCP tools — replaces RegisterArchiveTools,
// RegisterAtlasTools, and RegisterQMTools with a unified set.
// Old tool names are registered as aliases for backward compatibility.
func RegisterVaultTools(srv *Server, v *vault.Vault) {
	// --- Search ---

	searchHandler := func(args map[string]interface{}) (string, error) {
		query, _ := args["query"].(string)
		limit := 10
		if l, ok := args["limit"].(float64); ok {
			limit = int(l)
		}

		// If the librarian is available, expand the query for better recall
		var allResults []index.SearchResult
		if librarian.Available() {
			expansions := librarian.ExpandQuery(query)
			log.Printf("vault_search: librarian expanded %q → %d variants", query, len(expansions))
			seen := map[string]bool{}
			for _, exp := range expansions {
				results, err := v.Search(exp, limit)
				if err != nil {
					continue
				}
				for _, r := range results {
					if !seen[r.Path] {
						seen[r.Path] = true
						allResults = append(allResults, r)
					}
				}
			}
		} else {
			// Fallback: direct FTS5 search without librarian
			results, err := v.Search(query, limit)
			if err != nil {
				return "", err
			}
			allResults = results
		}

		// Cap at requested limit
		if len(allResults) > limit {
			allResults = allResults[:limit]
		}

		var sb strings.Builder
		sb.WriteString(fmt.Sprintf("Found %d results for %q:\n\n", len(allResults), query))
		for i, r := range allResults {
			sb.WriteString(fmt.Sprintf("%d. **%s**\n", i+1, r.Path))
			if r.Subject != "" {
				sb.WriteString(fmt.Sprintf("   Subject: %s\n", r.Subject))
			}
			if r.Snippet != "" {
				clean := strings.ReplaceAll(r.Snippet, "<b>", "**")
				clean = strings.ReplaceAll(clean, "</b>", "**")
				sb.WriteString(fmt.Sprintf("   %s\n", clean))
			}
			sb.WriteByte('\n')
		}

		// Append cross-reference hints — show connected docs the agent might want
		if v.Index != nil {
			refs := v.Index.Connected(query, 5)
			if len(refs) > 0 {
				// Filter out docs already in results
				resultPaths := make(map[string]bool)
				for _, r := range allResults {
					resultPaths[r.Path] = true
				}
				var extra []index.DocRef
				for _, ref := range refs {
					if !resultPaths[ref.Path] {
						extra = append(extra, ref)
					}
				}
				if len(extra) > 0 {
					sb.WriteString("**Cross-references** (connected docs not in results above):\n")
					for _, ref := range extra {
						title := ref.Title
						if title == "" {
							title = ref.Path
						}
						sb.WriteString(fmt.Sprintf("- [%s] %s `%s`\n", ref.Kind, title, ref.Path))
					}
				}
			}
		}

		return sb.String(), nil
	}

	searchSchema := map[string]interface{}{
		"type": "object",
		"properties": map[string]interface{}{
			"query": map[string]interface{}{"type": "string", "description": "Search query"},
			"limit": map[string]interface{}{"type": "integer", "description": "Max results (default 10)"},
		},
		"required": []string{"query"},
	}

	srv.AddTool("vault_search", "Search the vault — brain, memory, atlas, missions.", searchSchema, searchHandler)

	// --- Read ---

	srv.AddTool("vault_read", "Read a vault file by relative path.", map[string]interface{}{
		"type": "object",

codex
I have the shape now. The remaining step is turning this into precise evidence with exact line references so the iteration output is audit-ready rather than just directionally right.
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go | sed -n '55,100p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

 succeeded in 0ms:
    55				runImport(vd, args[i+1:])
    56				os.Exit(0)
    57			}
    58		}
    59	
    60		vaultDir = resolveVaultDir(vaultDir)
    61	
    62		// Ensure vault directory exists
    63		if err := os.MkdirAll(vaultDir, 0755); err != nil {
    64			fmt.Fprintf(os.Stderr, "Cannot create vault directory %s: %v\n", vaultDir, err)
    65			os.Exit(1)
    66		}
    67	
    68		// Ensure core subdirectories exist
    69		for _, sub := range []string{"memory/facts", "brain", "atlas"} {
    70			os.MkdirAll(filepath.Join(vaultDir, sub), 0755)
    71		}
    72	
    73		// Redirect log output to stderr (stdout is MCP protocol)
    74		log.SetOutput(os.Stderr)
    75		log.SetPrefix("[modus-memory] ")
    76	
    77		// Build search index
    78		idx, err := index.Build(vaultDir, "")
    79		if err != nil {
    80			log.Printf("Warning: index build failed: %v (starting with empty index)", err)
    81		}
    82	
    83		// Create vault
    84		v := vault.New(vaultDir, idx)
    85	
    86		// Create MCP server with all 11 memory tools
    87		srv := mcpsrv.NewServer("modus-memory", version)
    88		mcpsrv.RegisterMemoryTools(srv, v)
    89	
    90		log.Printf("modus-memory %s — vault: %s, %d docs indexed", version, vaultDir, idx.DocCount())
    91	
    92		// Run MCP stdio loop
    93		srv.Run()
    94	}
    95	
    96	// resolveVaultDir determines the vault directory from flag, env, or default.
    97	func resolveVaultDir(flagDir string) string {
    98		if flagDir != "" {
    99			return flagDir
   100		}

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go | sed -n '18,100p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    18	func RegisterVaultTools(srv *Server, v *vault.Vault) {
    19		// --- Search ---
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go | sed -n '276,330p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go | sed -n '18,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md | sed -n '1,60p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	# The Librarian Pattern
     2	
     3	A local LLM that serves as the sole gatekeeper for your memory vault.
     4	
     5	## The Problem
     6	
     7	Most AI memory systems let any model read and write freely. This creates predictable problems:
     8	
     9	- **Context bloat** — the cloud model sees everything, including noise, duplicates, and stale facts
    10	- **Inconsistent storage** — different models tag, classify, and format memories differently
    11	- **Token waste** — expensive frontier models spend tokens on retrieval, filtering, and filing instead of reasoning
    12	- **No sovereignty** — your memories scatter across whatever model happens to be active
    13	
    14	## The Solution
    15	
    16	Run a small, dedicated local model — the **Librarian** — whose only job is memory stewardship. It sits between your vault and whatever model is doing the actual reasoning:
    17	
    18	```
    19	┌─────────────┐     ┌────────────────┐     ┌──────────────┐
    20	│ Cloud Model  │◄───►│   Librarian    │◄───►│ modus-memory │
    21	│ (reasoning)  │     │ (local, ~8B)   │     │   (vault)    │
    22	└─────────────┘     └────────────────┘     └──────────────┘
    23	                     Sole write access
    24	                     Query expansion
    25	                     Relevance filtering
    26	                     Context compression
    27	```
    28	
    29	The cloud model stays focused on reasoning. The Librarian handles the boring-but-critical infrastructure: retrieval, filing, deduplication, decay, and context curation. It hands the cloud model only the 4-8k tokens that actually matter.
    30	
    31	## Why This Works
    32	
    33	**Token and cost discipline.** Cloud models are expensive once context balloons. The Librarian aggressively prunes, reranks, and synthesizes memories (using BM25 + FSRS + cross-references) before anything touches the cloud. You're running a local "memory compiler" so the expensive model only sees high-signal context.
    34	
    35	**Context hygiene.** Cloud models get distracted by noise. The Librarian can pull the last 3 conversations about a topic, expand technical terms, drop anything older than 30 days unless FSRS says it's still relevant, and format it as a clean prompt. The cloud model stays focused.
    36	
    37	**Privacy and sovereignty.** Sensitive data never leaves your machine unless you explicitly want it to. The Librarian can decide "this memory has PII — keep it local-only."
    38	
    39	**Speed.** Local model runs on whatever hardware you have. No network round-trips for memory lookups. Searches return in microseconds.
    40	
    41	## The System Prompt
    42	
    43	This is the core prompt that defines the Librarian role. Adapt it to your model and use case:
    44	
    45	```markdown
    46	You are the Librarian — the sole steward of persistent memory and vault state.
    47	
    48	You are the ONLY model authorized to write to the vault. All other models
    49	delegate storage operations through you. When another model needs something
    50	stored, corrected, or retrieved, it comes through you.
    51	
    52	## Write Sovereignty
    53	
    54	You are the single point of truth for all persistent state:
    55	- memory_store: Store new facts (subject/predicate/value)
    56	- vault_write: Write or update vault documents
    57	- vault_search/vault_read: Retrieve information on behalf of other models
    58	
    59	No other model writes to the vault. Models may change. The sovereignty
    60	of this office does not.

 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts | sed -n '400,620p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   400	/** Handle session_resume tool call — composite resume with memory + graph + cocoindex */
   401	export async function handleSessionResume(args: SessionResumeArgs): Promise<MCPResponse> {
   402	  // F052: Record memory recovery metric for session_resume
   403	  recordMetricEvent({ kind: 'memory_recovery' });
   404	
   405	  // Phase 024: Record bootstrap telemetry
   406	  const startMs = Date.now();
   407	  const hints: string[] = [];
   408	
   409	  // ── Sub-call 1: Memory context resume (skip in minimal mode) ──
   410	  let memoryResult: Record<string, unknown> = {};
   411	  if (args.minimal) {
   412	    memoryResult = { skipped: true, reason: 'minimal mode' };
   413	  } else {
   414	    try {
   415	      const mcpResponse = await handleMemoryContext({
   416	        input: 'resume previous work continue session',
   417	        mode: 'resume',
   418	        profile: 'resume',
   419	        specFolder: args.specFolder,
   420	      });
   421	      // Extract data from MCP envelope
   422	      if (mcpResponse?.content?.[0]?.text) {
   423	        try {
   424	          const parsed = JSON.parse(mcpResponse.content[0].text);
   425	          memoryResult = parsed?.data ?? parsed ?? {};
   426	        } catch {
   427	          memoryResult = { raw: mcpResponse.content[0].text };
   428	        }
   429	      }
   430	    } catch (error: unknown) {
   431	      const message = error instanceof Error ? error.message : String(error);
   432	      memoryResult = { error: message };
   433	      hints.push('Memory resume failed. Try memory_context manually.');
   434	    }
   435	  }
   436	
   437	  // ── Sub-call 2: Code graph status ───────────────────────────
   438	  let codeGraph: CodeGraphStatus = {
   439	    status: 'error',
   440	    lastScan: null,
   441	    nodeCount: 0,
   442	    edgeCount: 0,
   443	    fileCount: 0,
   444	  };
   445	  try {
   446	    const stats = graphDb.getStats();
   447	    const freshness = getGraphFreshness(process.cwd());
   448	    codeGraph = {
   449	      status: freshness,
   450	      lastScan: stats.lastScanTimestamp,
   451	      nodeCount: stats.totalNodes,
   452	      edgeCount: stats.totalEdges,
   453	      fileCount: stats.totalFiles,
   454	    };
   455	    // Graph status hints deferred to structural contract (Phase 027)
   456	    // — structural context hints at lines 128-130 provide preferred recovery path
   457	  } catch {
   458	    codeGraph = { status: 'error', lastScan: null, nodeCount: 0, edgeCount: 0, fileCount: 0 };
   459	    hints.push('Code graph unavailable. Run `code_graph_scan` to initialize.');
   460	  }
   461	
   462	  // ── Sub-call 3: CocoIndex availability (F046/F051: shared helper) ──
   463	  const cocoIndex: CocoIndexStatus = {
   464	    available: isCocoIndexAvailable(),
   465	    binaryPath: '.opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc',
   466	  };
   467	  if (!cocoIndex.available) {
   468	    hints.push('CocoIndex not installed. Install: `bash .opencode/skill/mcp-coco-index/scripts/install.sh`');
   469	  }
   470	
   471	  // Phase 027: Structural bootstrap contract for resume surface
   472	  const structuralContext = buildStructuralBootstrapContract('session_resume');
   473	  if (structuralContext.status === 'stale' || structuralContext.status === 'missing') {
   474	    hints.push(`Structural context is ${structuralContext.status}. Call session_bootstrap to refresh.`);
   475	  }
   476	
   477	  const structuralTrust = buildStructuralContextTrust(structuralContext);
   478	
   479	  // Keep live resume authoritative; cached continuity only appends bounded notes when every gate passes.
   480	  const cachedSummaryDecision = getCachedSessionSummaryDecision({
   481	    specFolder: args.specFolder,
   482	    claudeSessionId: typeof args.sessionId === 'string' ? args.sessionId : undefined,
   483	  });
   484	  if (cachedSummaryDecision.status === 'accepted') {
   485	    hints.push('Cached continuity summary accepted as additive resume context.');
   486	  } else {
   487	    logCachedSummaryDecision('session_resume', cachedSummaryDecision);
   488	  }
   489	
   490	  let sessionQuality: SessionResumeResult['sessionQuality'];
   491	  if (args.minimal) {
   492	    try {
   493	      sessionQuality = computeQualityScore().level;
   494	    } catch {
   495	      sessionQuality = 'unknown';
   496	    }
   497	  }
   498	
   499	  const memoryCertainty: SharedPayloadCertainty = args.minimal
   500	    ? 'defaulted'
   501	    : memoryResult.error
   502	      ? 'unknown'
   503	      : 'estimated';
   504	  const cachedCertainty: SharedPayloadCertainty = cachedSummaryDecision.status === 'accepted' ? 'estimated' : 'defaulted';
   505	  const codeGraphCertainty: SharedPayloadCertainty = codeGraph.status === 'error' ? 'unknown' : 'exact';
   506	  const cocoIndexCertainty: SharedPayloadCertainty = 'exact';
   507	  const structuralCertainty: SharedPayloadCertainty = 'exact';
   508	
   509	  const payloadSections: SharedPayloadSection[] = [
   510	    {
   511	      key: 'memory-resume',
   512	      title: 'Memory Resume',
   513	      content: summarizeUnknown(memoryResult),
   514	      source: 'memory',
   515	      certainty: memoryCertainty,
   516	    },
   517	  ];
   518	  if (cachedSummaryDecision.status === 'accepted' && cachedSummaryDecision.cachedSummary) {
   519	    payloadSections.push({
   520	      key: 'cached-continuity',
   521	      title: 'Cached Continuity',
   522	      content: [
   523	        cachedSummaryDecision.cachedSummary.continuityText,
   524	        `Cache tokens: create=${cachedSummaryDecision.cachedSummary.cacheCreationInputTokens}; read=${cachedSummaryDecision.cachedSummary.cacheReadInputTokens}`,
   525	        `Transcript: ${cachedSummaryDecision.cachedSummary.transcriptFingerprint}`,
   526	      ].join('\n'),
   527	      source: 'session',
   528	      certainty: cachedCertainty,
   529	    });
   530	  }
   531	  payloadSections.push(
   532	    {
   533	      key: 'code-graph-status',
   534	      title: 'Code Graph Status',
   535	      content: `status=${codeGraph.status}; files=${codeGraph.fileCount}; nodes=${codeGraph.nodeCount}; edges=${codeGraph.edgeCount}; lastScan=${codeGraph.lastScan ?? 'unknown'}`,
   536	      source: 'code-graph',
   537	      certainty: codeGraphCertainty,
   538	    },
   539	    {
   540	      key: 'cocoindex-status',
   541	      title: 'CocoIndex Status',
   542	      content: cocoIndex.available
   543	        ? `available at ${cocoIndex.binaryPath}`
   544	        : `unavailable; expected at ${cocoIndex.binaryPath}`,
   545	      source: 'semantic',
   546	      certainty: cocoIndexCertainty,
   547	    },
   548	    {
   549	      key: 'structural-context',
   550	      title: 'Structural Context',
   551	      content: structuralContext.summary,
   552	      source: 'code-graph',
   553	      certainty: structuralCertainty,
   554	      structuralTrust,
   555	    },
   556	  );
   557	
   558	  // ── Build composite result ──────────────────────────────────
   559	  const payloadContract = createSharedPayloadEnvelope({
   560	    kind: 'resume',
   561	    sections: payloadSections,
   562	    summary: `Resume payload: ${summarizeCertaintyContract([
   563	      { label: 'memory', certainty: memoryCertainty },
   564	      ...(cachedSummaryDecision.status === 'accepted' ? [{ label: 'cached', certainty: cachedCertainty }] : []),
   565	      { label: 'graph', certainty: codeGraphCertainty },
   566	      { label: 'cocoindex', certainty: cocoIndexCertainty },
   567	      { label: 'structural', certainty: structuralCertainty },
   568	    ])}; graph=${codeGraph.status}; graphStatus=${codeGraph.status}`,
   569	    provenance: {
   570	      producer: 'session_resume',
   571	      sourceSurface: 'session_resume',
   572	      trustState: trustStateFromStructuralStatus(structuralContext.status),
   573	      generatedAt: new Date().toISOString(),
   574	      lastUpdated: structuralContext.provenance?.lastUpdated ?? codeGraph.lastScan,
   575	      sourceRefs: ['memory-context', 'code-graph-db', 'cocoindex-path', 'session-snapshot'],
   576	    },
   577	  });
   578	  const graphOps = buildCodeGraphOpsContract({
   579	    graphFreshness: codeGraph.status as GraphFreshness,
   580	    sourceSurface: 'session_resume',
   581	  });
   582	
   583	  const result: SessionResumeResult = {
   584	    memory: memoryResult,
   585	    codeGraph,
   586	    cocoIndex,
   587	    cachedSummary: cachedSummaryDecision,
   588	    structuralContext,
   589	    payloadContract,
   590	    opencodeTransport: buildOpenCodeTransportPlan({
   591	      resumePayload: payloadContract,
   592	      specFolder: args.specFolder ?? null,
   593	    }),
   594	    graphOps,
   595	    ...(sessionQuality ? { sessionQuality } : {}),
   596	    hints,
   597	  };
   598	
   599	  // Phase 024 / Item 9: Record bootstrap telemetry
   600	  if (!args.minimal) {
   601	    recordBootstrapEvent(
   602	      'tool',
   603	      Date.now() - startMs,
   604	      'full',
   605	    );
   606	  }
   607	
   608	  return {
   609	    content: [{
   610	      type: 'text',
   611	      text: JSON.stringify({ status: 'ok', data: result }, null, 2),
   612	    }],
   613	  };
   614	}

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts | sed -n '150,250p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   150	  return {
   151	    advisory: true,
   152	    readiness: 'ready',
   153	    preferredTool: 'code_graph_query',
   154	    message: 'Advisory only: when the next question is about callers, imports, dependencies, or outline, prefer `code_graph_query` before Grep or Glob.',
   155	    preservesAuthority: 'session_bootstrap',
   156	  };
   157	}
   158	
   159	/* ───────────────────────────────────────────────────────────────
   160	   3. HANDLER
   161	──────────────────────────────────────────────────────────────── */
   162	
   163	/** Handle session_bootstrap tool call — one-call session setup */
   164	export async function handleSessionBootstrap(args: SessionBootstrapArgs): Promise<MCPResponse> {
   165	  const startMs = Date.now();
   166	  const allHints: string[] = [];
   167	
   168	  // Sub-call 1: session_resume with full resume payload
   169	  let resumeData: Record<string, unknown> = {};
   170	  try {
   171	    const resumeResponse = await handleSessionResume({
   172	      specFolder: args.specFolder,
   173	    });
   174	    resumeData = extractData(resumeResponse);
   175	    allHints.push(...extractHints(resumeData));
   176	  } catch (error: unknown) {
   177	    const message = error instanceof Error ? error.message : String(error);
   178	    resumeData = { error: message };
   179	    allHints.push('session_resume failed. Try calling it manually.');
   180	  }
   181	
   182	  // Sub-call 2: session_health
   183	  let healthData: Record<string, unknown> = {};
   184	  try {
   185	    const healthResponse = await handleSessionHealth();
   186	    healthData = extractData(healthResponse);
   187	    allHints.push(...extractHints(healthData));
   188	  } catch (error: unknown) {
   189	    const message = error instanceof Error ? error.message : String(error);
   190	    healthData = { error: message };
   191	    allHints.push('session_health failed. Try calling it manually.');
   192	  }
   193	
   194	  // Phase 027: Structural bootstrap contract
   195	  const structuralContext = buildStructuralBootstrapContract('session_bootstrap');
   196	  if (structuralContext.status === 'stale' || structuralContext.status === 'missing') {
   197	    allHints.push(
   198	      `Structural context is ${structuralContext.status}. Run code_graph_scan if needed, then re-run session_bootstrap.`
   199	    );
   200	  }
   201	
   202	  const cachedSummary = extractCachedSummary(resumeData);
   203	  if (cachedSummary?.status === 'accepted') {
   204	    allHints.push('Cached continuity summary accepted as additive bootstrap context.');
   205	  }
   206	  const structuralRoutingNudge = buildStructuralRoutingNudge(structuralContext);
   207	  if (structuralRoutingNudge) {
   208	    allHints.push(structuralRoutingNudge.message);
   209	  }
   210	
   211	  // Deduplicate hints
   212	  const uniqueHints = [...new Set(allHints)];
   213	
   214	  // Record bootstrap telemetry once for the composite call.
   215	  const durationMs = Date.now() - startMs;
   216	  const completeness = resumeData.error || healthData.error ? 'partial' : 'full';
   217	  recordBootstrapEvent('tool', durationMs, completeness);
   218	
   219	  const resumeCertainty: SharedPayloadCertainty = resumeData.error ? 'unknown' : 'estimated';
   220	  const healthCertainty: SharedPayloadCertainty = healthData.error ? 'unknown' : 'estimated';
   221	  const cachedCertainty: SharedPayloadCertainty = cachedSummary?.status === 'accepted' ? 'estimated' : 'defaulted';
   222	  const structuralCertainty: SharedPayloadCertainty = 'exact';
   223	  const nextActionsCertainty: SharedPayloadCertainty = 'defaulted';
   224	  const resumePayload = coerceSharedPayloadEnvelope(resumeData.payloadContract);
   225	  const healthPayload = coerceSharedPayloadEnvelope(healthData.payloadContract);
   226	  const structuralSnapshotTrust = buildStructuralContextTrust(structuralContext);
   227	  const resumeStructuralTrust = extractStructuralTrustFromPayload(resumePayload);
   228	  if (!resumeData.error && !resumeStructuralTrust) {
   229	    throw new StructuralTrustPayloadError(
   230	      'session_bootstrap expected session_resume to emit structural-context.structuralTrust.',
   231	    );
   232	  }
   233	  const structuralContextWithTrust = attachStructuralTrustFields(
   234	    structuralContext,
   235	    structuralSnapshotTrust,
   236	    { label: 'session_bootstrap structural context payload' },
   237	  );
   238	  const resumeWithTrust = resumeData.error
   239	    ? resumeData
   240	    : attachStructuralTrustFields(
   241	      resumeData,
   242	      resumeStructuralTrust,
   243	      { label: 'session_bootstrap resume payload' },
   244	    );
   245	
   246	  const payloadSections: SharedPayloadSection[] = [
   247	    {
   248	      key: 'resume-surface',
   249	      title: 'Resume Surface',
   250	      content: summarizeUnknown(resumeData),

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts | sed -n '660,820p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts | sed -n '1248,1308p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1248	  } = sessionState;
  1249	
  1250	  const timestamp = new Date().toISOString();
  1251	  const dateStr = new Date().toLocaleDateString('en-US', {
  1252	    weekday: 'long',
  1253	    year: 'numeric',
  1254	    month: 'long',
  1255	    day: 'numeric',
  1256	    hour: '2-digit',
  1257	    minute: '2-digit',
  1258	  });
  1259	
  1260	  const resumeCommand = specFolder
  1261	    ? `/spec_kit:resume ${specFolder}`
  1262	    : sessionId
  1263	      ? `memory_search({ sessionId: "${sessionId}" })`
  1264	      : 'memory_search({ query: "last session" })';
  1265	
  1266	  const content = `# CONTINUE SESSION
  1267	
  1268	> **Generated:** ${dateStr}
  1269	> **Purpose:** Enable seamless session recovery after context compaction, crashes, or breaks.
  1270	> **Pattern Source:** Adopted from seu-claude's CONTINUE_SESSION.md approach.
  1271	
  1272	---
  1273	
  1274	## Session State
  1275	
  1276	| Field | Value |
  1277	|-------|-------|
  1278	| **Session ID** | \`${sessionId || 'N/A'}\` |
  1279	| **Spec Folder** | ${specFolder || 'N/A'} |
  1280	| **Current Task** | ${currentTask || 'N/A'} |
  1281	| **Last Action** | ${lastAction || 'N/A'} |
  1282	| **Status** | Active |
  1283	| **Updated** | ${timestamp} |
  1284	
  1285	---
  1286	
  1287	## Context Summary
  1288	
  1289	${contextSummary || '_No context summary available._'}
  1290	
  1291	---
  1292	
  1293	## Pending Work
  1294	
  1295	${pendingWork || '_No pending work recorded._'}
  1296	
  1297	---
  1298	
  1299	## Quick Resume
  1300	
  1301	To continue this session, use:
  1302	
  1303	\`\`\`
  1304	${resumeCommand}
  1305	\`\`\`
  1306	
  1307	${data ? `
  1308	---

 succeeded in 0ms:
   660	    description: 'Semantic search with full context retrieval',
   661	    strategy: 'search',
   662	    tokenBudget: 3500
   663	  },
   664	
   665	  // Focused: Intent-specific search with optimized weights
   666	  focused: {
   667	    name: 'Focused',
   668	    description: 'Intent-aware search with task-specific optimization',
   669	    strategy: 'intent-search',
   670	    tokenBudget: 3000
   671	  },
   672	
   673	  // Resume: Session recovery mode
   674	  resume: {
   675	    name: 'Resume',
   676	    description: 'Resume previous work with state and next-steps anchors',
   677	    strategy: 'resume',
   678	    tokenBudget: 2000
   679	  }
   680	};
   681	
   682	/* ───────────────────────────────────────────────────────────────
   683	   4. INTENT-TO-MODE ROUTING
   684	──────────────────────────────────────────────────────────────── */
   685	
   686	const INTENT_TO_MODE: Record<string, string> = {
   687	  add_feature: 'deep',
   688	  fix_bug: 'focused',
   689	  refactor: 'deep',
   690	  security_audit: 'deep',
   691	  understand: 'focused',
   692	  find_spec: 'deep',
   693	  find_decision: 'focused'
   694	};
   695	
   696	/* ───────────────────────────────────────────────────────────────
   697	   5. CONTEXT STRATEGY EXECUTORS
   698	──────────────────────────────────────────────────────────────── */
   699	
   700	async function executeQuickStrategy(input: string, options: ContextOptions): Promise<ContextResult> {
   701	  const result = await handleMemoryMatchTriggers({
   702	    prompt: input,
   703	    specFolder: options.specFolder,
   704	    tenantId: options.tenantId,
   705	    userId: options.userId,
   706	    agentId: options.agentId,
   707	    sharedSpaceId: options.sharedSpaceId,
   708	    limit: options.limit || 5,
   709	    session_id: options.sessionId,
   710	    include_cognitive: true
   711	  });
   712	
   713	  return {
   714	    strategy: 'quick',
   715	    mode: 'quick',
   716	    ...result
   717	  };
   718	}
   719	
   720	async function executeDeepStrategy(input: string, intent: string | null, options: ContextOptions): Promise<ContextResult> {
   721	  const result = await handleMemorySearch({
   722	    query: input,
   723	    specFolder: options.specFolder,
   724	    folderBoost: options.folderBoost,
   725	    tenantId: options.tenantId,
   726	    userId: options.userId,
   727	    agentId: options.agentId,
   728	    sharedSpaceId: options.sharedSpaceId,
   729	    limit: options.limit || 10,
   730	    includeConstitutional: true,
   731	    includeContent: options.includeContent || false,
   732	    includeTrace: options.includeTrace || false, // CHK-040
   733	    anchors: options.anchors,
   734	    sessionId: options.sessionId,
   735	    sessionTransition: options.sessionTransition,
   736	    enableDedup: options.enableDedup !== false,
   737	    profile: options.profile,
   738	    intent: intent ?? undefined,
   739	    autoDetectIntent: intent ? false : true,
   740	    useDecay: true,
   741	    // minState omitted — memoryState column not yet in schema
   742	  });
   743	
   744	  return {
   745	    strategy: 'deep',
   746	    mode: 'deep',
   747	    ...result
   748	  };
   749	}
   750	
   751	async function executeFocusedStrategy(input: string, intent: string | null, options: ContextOptions): Promise<ContextResult> {
   752	  const result = await handleMemorySearch({
   753	    query: input,
   754	    specFolder: options.specFolder,
   755	    folderBoost: options.folderBoost,
   756	    tenantId: options.tenantId,
   757	    userId: options.userId,
   758	    agentId: options.agentId,
   759	    sharedSpaceId: options.sharedSpaceId,
   760	    limit: options.limit || 8,
   761	    includeConstitutional: true,
   762	    includeContent: options.includeContent || false,
   763	    includeTrace: options.includeTrace || false, // CHK-040
   764	    anchors: options.anchors,
   765	    sessionId: options.sessionId,
   766	    sessionTransition: options.sessionTransition,
   767	    enableDedup: options.enableDedup !== false,
   768	    profile: options.profile,
   769	    intent: intent ?? undefined,
   770	    autoDetectIntent: intent ? false : true,
   771	    useDecay: true,
   772	    // minState omitted — memoryState column not yet in schema
   773	  });
   774	
   775	  return {
   776	    strategy: 'focused',
   777	    mode: 'focused',
   778	    intent: intent,
   779	    ...result
   780	  };
   781	}
   782	
   783	async function executeResumeStrategy(input: string, intent: string | null, options: ContextOptions): Promise<ContextResult> {
   784	  const resumeAnchors = options.anchors || ['state', 'next-steps', 'summary', 'blockers'];
   785	
   786	  const result = await handleMemorySearch({
   787	    query: input || 'resume work continue session',
   788	    specFolder: options.specFolder,
   789	    folderBoost: options.folderBoost,
   790	    tenantId: options.tenantId,
   791	    userId: options.userId,
   792	    agentId: options.agentId,
   793	    sharedSpaceId: options.sharedSpaceId,
   794	    limit: options.limit || 5,
   795	    includeConstitutional: false,
   796	    includeContent: true,
   797	    includeTrace: options.includeTrace || false, // CHK-040
   798	    anchors: resumeAnchors,
   799	    sessionId: options.sessionId,
   800	    sessionTransition: options.sessionTransition,
   801	    enableDedup: false,
   802	    profile: options.profile,
   803	    intent: intent ?? undefined,
   804	    autoDetectIntent: intent ? false : true,
   805	    useDecay: false,
   806	    // minState omitted — memoryState column not yet in schema
   807	  });
   808	
   809	  return {
   810	    strategy: 'resume',
   811	    mode: 'resume',
   812	    resumeAnchors: resumeAnchors,
   813	    ...result
   814	  };
   815	}
   816	
   817	/* ───────────────────────────────────────────────────────────────
   818	   6. HANDLER HELPERS
   819	──────────────────────────────────────────────────────────────── */
   820	

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md | sed -n '24,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    24	- [6. RELATED RESOURCES](#6--related-resources)
    25	
    26	<!-- /ANCHOR:table-of-contents -->
    27	
    28	---
    29	
    30	## 1. OVERVIEW
    31	<!-- ANCHOR:overview -->
    32	
    33	The session layer provides all session-related operations for the Spec Kit Memory MCP server. It prevents duplicate context injection (saving ~50% tokens on follow-up queries) and enables crash recovery with immediate SQLite persistence.
    34	
    35	### Key Statistics
    36	
    37	| Category | Count | Details |
    38	|----------|-------|---------|
    39	| Modules | 1 | `session-manager.ts` |
    40	| Token Savings | ~50% | On follow-up queries via deduplication |
    41	| Session TTL | 30 min | Configurable via `SESSION_TTL_MINUTES` |
    42	| Max Entries | 100 | Per session cap (R7 mitigation) |
    43	
    44	### Key Features
    45	
    46	| Feature | Description |
    47	|---------|-------------|
    48	| **Session Deduplication** | Tracks sent memories to prevent duplicate context injection |
    49	| **Crash Recovery** | Immediate SQLite persistence + CONTINUE_SESSION.md generation |
    50	| **Token Savings** | ~50% reduction on follow-up queries |
    51	| **State Persistence** | Zero data loss on crash via immediate saves |
    52	| **Phase Awareness** | Session context includes phase metadata for phase-based specs (spec 139) |
    53	
    54	<!-- /ANCHOR:overview -->
    55	
    56	---
    57	
    58	## 2. STRUCTURE
    59	<!-- ANCHOR:structure -->
    60	
    61	```
    62	session/
    63	 session-manager.ts  # Session deduplication, crash recovery, state management (~28KB)
    64	 README.md           # This file
    65	```
    66	
    67	### Key Files
    68	
    69	| File | Purpose |
    70	|------|---------|
    71	| `session-manager.ts` | Core session tracking, deduplication, state persistence, CONTINUE_SESSION.md |
    72	
    73	<!-- /ANCHOR:structure -->
    74	
    75	---
    76	
    77	## 3. FEATURES
    78	<!-- ANCHOR:features -->
    79	
    80	### Session Deduplication (v1.2.0)
    81	
    82	**Purpose**: Prevent sending the same memory content twice in a session, saving tokens.
    83	
    84	| Aspect | Details |
    85	|--------|---------|
    86	| **Hash-based** | SHA-256 hash of memory content (truncated to 16 chars) |
    87	| **Immediate Save** | SQLite persistence on each mark (crash resilient) |
    88	| **Batch Support** | Efficient batch checking and marking |
    89	| **Token Savings** | ~200 tokens per duplicate avoided |
    90	
    91	```
    92	Session Query Flow:
    93	1. User queries memory_search
    94	2. Results retrieved from index
    95	3. filterSearchResults() removes already-sent memories
    96	4. Filtered results returned to client
    97	5. markResultsSent() records what was sent
    98	```
    99	
   100	### Crash Recovery (v1.2.0)
   101	
   102	**Purpose**: Zero data loss on MCP server crash or context compaction.
   103	
   104	| Aspect | Details |
   105	|--------|---------|
   106	| **Immediate Persistence** | State saved to SQLite instantly |
   107	| **Interrupted Detection** | On startup, active sessions marked as interrupted |
   108	| **State Recovery** | `recoverState()` returns state with `_recovered: true` flag |
   109	| **CONTINUE_SESSION.md** | Human-readable recovery file in spec folder |
   110	
   111	Session states:
   112	- `active`: Session in progress
   113	- `completed`: Session ended normally
   114	- `interrupted`: Session crashed (detected on restart)
   115	
   116	### CONTINUE_SESSION.md Generation
   117	
   118	**Purpose**: Human-readable recovery file for smooth session continuation.
   119	
   120	Generated on checkpoint with:

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts | sed -n '624,668p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   624	 * autoSurfaceAtCompaction
   625	 *
   626	 * Fires at session compaction lifecycle points. Surfaces memories relevant
   627	 * to the ongoing session context so that critical knowledge is preserved
   628	 * across the compaction boundary.
   629	 *
   630	 * Skipped when:
   631	 *   - sessionContext is empty or too short to extract signal
   632	 *   - enableCompactionHook is false in the integration config
   633	 *
   634	 * Token budget: COMPACTION_TOKEN_BUDGET (4000 max)
   635	 *
   636	 * @param sessionContext - A textual summary of the current session state
   637	 * @param options        - Optional integration-layer config flags
   638	 * @returns AutoSurfaceResult or null if nothing to surface / hook disabled
   639	 */
   640	async function autoSurfaceAtCompaction(
   641	  sessionContext: string,
   642	  options?: { enableCompactionHook?: boolean }
   643	): Promise<AutoSurfaceResult | null> {
   644	  // Allow integration layer to disable this hook via config flag
   645	  if (options && options.enableCompactionHook === false) {
   646	    return null;
   647	  }
   648	
   649	  // Require a meaningful context string (at least 3 characters)
   650	  if (!sessionContext || typeof sessionContext !== 'string' || sessionContext.trim().length < 3) {
   651	    return null;
   652	  }
   653	
   654	  // Delegate to the core surface function; token budget is explicitly
   655	  // Enforced at the hook output boundary via estimateTokenCount().
   656	  return autoSurfaceMemories(sessionContext.trim(), COMPACTION_TOKEN_BUDGET, 'compaction');
   657	}
   658	
   659	/* ───────────────────────────────────────────────────────────────
   660	   8. EXPORTS
   661	──────────────────────────────────────────────────────────────── */
   662	
   663	export {
   664	  // Constants
   665	  MEMORY_AWARE_TOOLS,
   666	  CONSTITUTIONAL_CACHE_TTL,
   667	  TOOL_DISPATCH_TOKEN_BUDGET,
   668	  COMPACTION_TOKEN_BUDGET,

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts | sed -n '190,360p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   190	  const lines = triggered.map((memory) => {
   191	    const matchedPhrases = [...new Set(memory.matched_phrases
   192	      .map((phrase) => phrase.trim())
   193	      .filter((phrase) => phrase.length > 0))];
   194	
   195	    if (matchedPhrases.length === 0) {
   196	      return `- ${memory.title}`;
   197	    }
   198	
   199	    return `- ${memory.title} (matched: ${matchedPhrases.join(', ')})`;
   200	  });
   201	
   202	  return `## Relevant Memories\n${lines.join('\n')}`;
   203	}
   204	
   205	/**
   206	 * Build merged context using the 3-source merge pipeline.
   207	 * Extracts session state from transcript, then delegates budget allocation
   208	 * and section rendering to mergeCompactBrief.
   209	 */
   210	async function buildMergedContext(transcriptLines: string[]): Promise<string> {
   211	  const sanitizedLines = stripRecoveredCompactLines(transcriptLines);
   212	  const filePaths = extractFilePaths(sanitizedLines);
   213	  const topics = extractTopics(sanitizedLines);
   214	
   215	  // Build codeGraph input: active files + structural hints
   216	  const codeGraphParts: string[] = [];
   217	  if (filePaths.length > 0) {
   218	    codeGraphParts.push('Active files:\n' + filePaths.map(p => `- ${p}`).join('\n'));
   219	  }
   220	  const codeGraph = codeGraphParts.join('\n\n');
   221	
   222	  // Build cocoIndex input: semantic neighbor hint for post-recovery
   223	  const cocoIndex = filePaths.length > 0
   224	    ? 'Use `mcp__cocoindex_code__search` to find semantic neighbors of active files listed above.'
   225	    : '';
   226	
   227	  // Build sessionState input: recent context + topics + attention signals
   228	  const sessionParts: string[] = [];
   229	
   230	  // Spec folder detection
   231	  const specFolder = detectSpecFolder(sanitizedLines);
   232	  if (specFolder) {
   233	    sessionParts.push(`Active spec folder: ${specFolder}`);
   234	  }
   235	
   236	  // Working memory attention signals
   237	  const attentionSignals = extractAttentionSignals(sanitizedLines);
   238	  if (attentionSignals.length > 0) {
   239	    sessionParts.push('Working memory attention:\n' + attentionSignals.join('\n'));
   240	  }
   241	
   242	  if (topics.length > 0) {
   243	    sessionParts.push('Recent topics:\n' + topics.map(t => `- ${t}`).join('\n'));
   244	  }
   245	  const meaningfulLines = sanitizedLines
   246	    .filter(l => l.trim().length > 10 && !l.startsWith('{'))
   247	    .slice(-5);
   248	  if (meaningfulLines.length > 0) {
   249	    sessionParts.push('Recent context:\n' + meaningfulLines.join('\n'));
   250	  }
   251	  const sessionState = sessionParts.join('\n\n');
   252	
   253	  const selection = createPreMergeSelectionMetadata({
   254	    selectedFrom: ['transcript-tail', 'active-files', 'recent-topics', 'attention-signals'],
   255	    fileCount: filePaths.length,
   256	    topicCount: topics.length,
   257	    attentionSignalCount: attentionSignals.length,
   258	    notes: [
   259	      sanitizedLines.length !== transcriptLines.length
   260	        ? 'Recovered compact transcript lines were removed before pre-merge selection.'
   261	        : 'No recovered compact transcript lines detected in the current tail.',
   262	      specFolder ? `Spec folder anchored: ${specFolder}` : 'No active spec folder detected in transcript tail.',
   263	    ],
   264	    antiFeedbackGuards: [
   265	      'Strip recovered hook-cache source markers before transcript summarization.',
   266	      'Do not reuse Recovery Instructions text as session-state evidence.',
   267	      'Build pre-merge candidates before section assembly.',
   268	    ],
   269	  });
   270	
   271	  const mergeInput: MergeInput = {
   272	    constitutional: '',   // Constitutional rules come from Memory MCP, not available in hooks
   273	    codeGraph,
   274	    cocoIndex,
   275	    triggered: '',        // Triggered memories not available in hooks
   276	    sessionState,
   277	  };
   278	
   279	  // Merge with timing
   280	  const t0 = performance.now();
   281	  const merged = mergeCompactBrief(mergeInput, COMPACTION_TOKEN_BUDGET, undefined, selection);
   282	  const elapsed = performance.now() - t0;
   283	
   284	  if (elapsed > 1500) {
   285	    hookLog('warn', 'compact-inject', `Merge pipeline took ${elapsed.toFixed(0)}ms (budget: ${HOOK_TIMEOUT_MS}ms)`);
   286	  } else {
   287	    hookLog('info', 'compact-inject', `Merge pipeline completed in ${elapsed.toFixed(0)}ms (${merged.metadata.sourceCount} sections, ~${merged.metadata.totalTokenEstimate} tokens)`);
   288	  }
   289	
   290	  const autoSurfaced = await autoSurfaceAtCompaction(sessionState);
   291	  if (!autoSurfaced) {
   292	    return merged.text;
   293	  }
   294	
   295	  hookLog(
   296	    'info',
   297	    'compact-inject',
   298	    `Compaction auto-surface returned ${autoSurfaced.constitutional.length} constitutional and ${autoSurfaced.triggered.length} triggered memories (${autoSurfaced.latencyMs}ms)`,
   299	  );
   300	
   301	  const constitutionalSection = renderConstitutionalMemories(autoSurfaced);
   302	  const triggeredSection = renderTriggeredMemories(autoSurfaced);
   303	  const surfacedSections = [constitutionalSection, triggeredSection]
   304	    .filter((section) => section.length > 0);
   305	
   306	  if (surfacedSections.length === 0) {
   307	    return merged.text;
   308	  }
   309	
   310	  const surfacedContext = surfacedSections.join('\n\n');
   311	
   312	  return merged.text
   313	    ? `${surfacedContext}\n\n${merged.text}`
   314	    : surfacedContext;
   315	}
   316	
   317	async function buildMergedPayloadContract(transcriptLines: string[]): Promise<SharedPayloadEnvelope> {
   318	  const sanitizedLines = stripRecoveredCompactLines(transcriptLines);
   319	  const filePaths = extractFilePaths(sanitizedLines);
   320	  const topics = extractTopics(sanitizedLines);
   321	  const attentionSignals = extractAttentionSignals(sanitizedLines);
   322	  const sessionParts: string[] = [];
   323	  const specFolder = detectSpecFolder(sanitizedLines);
   324	  if (specFolder) {
   325	    sessionParts.push(`Active spec folder: ${specFolder}`);
   326	  }
   327	  if (attentionSignals.length > 0) {
   328	    sessionParts.push('Working memory attention:\n' + attentionSignals.join('\n'));
   329	  }
   330	  if (topics.length > 0) {
   331	    sessionParts.push('Recent topics:\n' + topics.map((topic) => `- ${topic}`).join('\n'));
   332	  }
   333	  const meaningfulLines = sanitizedLines.filter((line) => line.trim().length > 10 && !line.startsWith('{')).slice(-5);
   334	  if (meaningfulLines.length > 0) {
   335	    sessionParts.push('Recent context:\n' + meaningfulLines.join('\n'));
   336	  }
   337	
   338	  const selection = createPreMergeSelectionMetadata({
   339	    selectedFrom: ['transcript-tail', 'active-files', 'recent-topics', 'attention-signals'],
   340	    fileCount: filePaths.length,
   341	    topicCount: topics.length,
   342	    attentionSignalCount: attentionSignals.length,
   343	    notes: [
   344	      sanitizedLines.length !== transcriptLines.length
   345	        ? 'Recovered compact transcript lines were removed before pre-merge selection.'
   346	        : 'No recovered compact transcript lines detected in the current tail.',
   347	      specFolder ? `Spec folder anchored: ${specFolder}` : 'No active spec folder detected in transcript tail.',
   348	    ],
   349	    antiFeedbackGuards: [
   350	      'Strip recovered hook-cache source markers before transcript summarization.',
   351	      'Do not reuse Recovery Instructions text as session-state evidence.',
   352	      'Build pre-merge candidates before section assembly.',
   353	    ],
   354	  });
   355	
   356	  const mergeInput: MergeInput = {
   357	    constitutional: '',
   358	    codeGraph: filePaths.length > 0 ? 'Active files:\n' + filePaths.map((filePath) => `- ${filePath}`).join('\n') : '',
   359	    cocoIndex: filePaths.length > 0
   360	      ? 'Use `mcp__cocoindex_code__search` to find semantic neighbors of active files listed above.'

 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Compact Merger
     3	// ───────────────────────────────────────────────────────────────
     4	// Merges context from multiple sources (Memory, Code Graph, CocoIndex, Session)
     5	// into a unified compact brief for compaction injection.
     6	
     7	import { allocateBudget, createDefaultSources, type AllocationResult } from './budget-allocator.js';
     8	import {
     9	  createSharedPayloadEnvelope,
    10	  type PreMergeSelectionMetadata,
    11	  type SharedPayloadEnvelope,
    12	} from '../context/shared-payload.js';
    13	
    14	/** Input from each context source */
    15	export interface MergeInput {
    16	  constitutional: string;    // Constitutional rules (from Memory)
    17	  codeGraph: string;         // Structural context (from Code Graph)
    18	  cocoIndex: string;         // Semantic neighbors (from CocoIndex)
    19	  triggered: string;         // Triggered memories (from Memory)
    20	  sessionState: string;      // Active task / next steps
    21	}
    22	
    23	/** Per-source freshness metadata */
    24	export interface SourceFreshness {
    25	  source: string;
    26	  lastUpdated: string | null;
    27	  staleness: 'fresh' | 'recent' | 'stale' | 'unknown';
    28	}
    29	
    30	/** Merged compact brief with metadata */
    31	export interface MergedBrief {
    32	  text: string;
    33	  sections: {
    34	    name: string;
    35	    content: string;
    36	    tokenEstimate: number;
    37	    source: string;
    38	  }[];
    39	  allocation: AllocationResult;
    40	  payloadContract: SharedPayloadEnvelope;
    41	  metadata: {
    42	    totalTokenEstimate: number;
    43	    sourceCount: number;
    44	    mergedAt: string;
    45	    mergeDurationMs: number;
    46	    deduplicatedFiles: number;
    47	    freshness: SourceFreshness[];
    48	    selection?: PreMergeSelectionMetadata;
    49	  };
    50	}
    51	
    52	/** Estimate tokens from string (4 chars ≈ 1 token) */
    53	function estimateTokens(text: string): number {
    54	  return Math.ceil(text.length / 4);
    55	}
    56	
    57	/** Truncate text to fit within a token budget */
    58	function truncateToTokens(text: string, maxTokens: number): string {
    59	  if (maxTokens <= 0) return '';
    60	  if (estimateTokens(text) <= maxTokens) return text;
    61	
    62	  const marker = '\n[...truncated]';
    63	  const maxChars = maxTokens * 4;
    64	  if (marker.length >= maxChars) {
    65	    return text.slice(0, maxChars);
    66	  }
    67	
    68	  const contentChars = Math.max(0, maxChars - marker.length);
    69	  return text.slice(0, contentChars) + marker;
    70	}
    71	
    72	/** Extract file paths from a text section for deduplication */
    73	function extractFilePathsFromText(text: string): Set<string> {
    74	  const paths = new Set<string>();
    75	  const pathRegex = /(?:\/[\w.-]+){2,}(?:\.\w+)/g;
    76	  const matches = text.match(pathRegex);
    77	  if (matches) matches.forEach(m => paths.add(m));
    78	  return paths;
    79	}
    80	
    81	/** Deduplicate file references across sections — higher priority sources keep their mentions */
    82	function deduplicateFilePaths(sections: MergedBrief['sections']): number {
    83	  const seenFiles = new Set<string>();
    84	  let removedCount = 0;
    85	
    86	  for (const section of sections) {
    87	    const filePaths = extractFilePathsFromText(section.content);
    88	    const duplicates: string[] = [];
    89	
    90	    for (const fp of filePaths) {
    91	      if (seenFiles.has(fp)) {
    92	        duplicates.push(fp);
    93	        removedCount++;
    94	      } else {
    95	        seenFiles.add(fp);
    96	      }
    97	    }
    98	
    99	    // Remove duplicate file path lines from lower-priority sections
   100	    if (duplicates.length > 0) {
   101	      let content = section.content;
   102	      for (const dup of duplicates) {
   103	        const lineRegex = new RegExp(`^.*${dup.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.*$\n?`, 'gm');
   104	        content = content.replace(lineRegex, '');
   105	      }
   106	      section.content = content.trim();
   107	      section.tokenEstimate = estimateTokens(section.content);
   108	    }
   109	  }
   110	  return removedCount;
   111	}
   112	
   113	/**
   114	 * Merge context from multiple sources into a compact brief.
   115	 *
   116	 * Strategy:
   117	 * 1. Allocate budget across sources (floor + overflow)
   118	 * 2. Truncate each source to its granted budget
   119	 * 3. Deduplicate at file level (same file from multiple sources → keep highest priority)
   120	 * 4. Render sections in priority order with headers
   121	 */
   122	export function mergeCompactBrief(
   123	  input: MergeInput,
   124	  totalBudget: number = 4000,
   125	  freshness?: SourceFreshness[],
   126	  selection?: PreMergeSelectionMetadata,
   127	): MergedBrief {
   128	  const startTime = performance.now();
   129	
   130	  const constitutionalSize = estimateTokens(input.constitutional);
   131	  const codeGraphSize = estimateTokens(input.codeGraph);
   132	  const cocoIndexSize = estimateTokens(input.cocoIndex);
   133	  const triggeredSize = estimateTokens(input.triggered);
   134	  const sessionStateSize = estimateTokens(input.sessionState);
   135	
   136	  const sources = createDefaultSources(
   137	    constitutionalSize,
   138	    codeGraphSize,
   139	    cocoIndexSize,
   140	    triggeredSize,
   141	    sessionStateSize,
   142	  );
   143	  const allocation = allocateBudget(sources, totalBudget);
   144	
   145	  // Build sections with granted budgets
   146	  const sections: MergedBrief['sections'] = [];
   147	  const allocationMap = new Map(allocation.allocations.map(a => [a.name, a]));
   148	  const pushSection = (
   149	    inputText: string,
   150	    allocationName: string,
   151	    sectionName: string,
   152	    source: string,
   153	  ): void => {
   154	    if (!inputText.trim()) return;
   155	
   156	    const granted = allocationMap.get(allocationName)?.granted ?? 0;
   157	    if (granted <= 0) return;
   158	
   159	    const content = truncateToTokens(inputText, granted);
   160	    if (!content.trim()) return;
   161	
   162	    sections.push({
   163	      name: sectionName,
   164	      content,
   165	      tokenEstimate: estimateTokens(content),
   166	      source,
   167	    });
   168	  };
   169	
   170	  pushSection(input.constitutional, 'constitutional', 'Constitutional Rules', 'memory');
   171	  pushSection(input.codeGraph, 'codeGraph', 'Active Files & Structural Context', 'code-graph');
   172	  pushSection(input.cocoIndex, 'cocoIndex', 'Semantic Neighbors', 'cocoindex');
   173	  pushSection(input.sessionState, 'sessionState', 'Session State / Next Steps', 'session');
   174	  pushSection(input.triggered, 'triggered', 'Triggered Memories', 'memory');
   175	
   176	  // File-level deduplication across sections
   177	  const deduplicatedFiles = deduplicateFilePaths(sections);
   178	
   179	  // Render final text
   180	  const text = sections
   181	    .map(s => `## ${s.name}\n${s.content}`)
   182	    .join('\n\n');
   183	
   184	  const totalTokenEstimate = sections.reduce((sum, s) => sum + s.tokenEstimate, 0);
   185	  const mergeDurationMs = Math.round(performance.now() - startTime);
   186	
   187	  return {
   188	    text,
   189	    sections,
   190	    allocation,
   191	    payloadContract: createSharedPayloadEnvelope({
   192	      kind: 'compaction',
   193	      sections: sections.map((section) => ({
   194	        key: section.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
   195	        title: section.name,
   196	        content: section.content,
   197	        source: section.source === 'code-graph'
   198	          ? 'code-graph'
   199	          : section.source === 'cocoindex'
   200	            ? 'semantic'
   201	            : section.source === 'session'
   202	              ? 'session'
   203	              : 'memory',
   204	      })),
   205	      summary: `Compaction payload merged ${sections.length} sections within ${totalBudget} tokens`,
   206	      provenance: {
   207	        producer: 'compact_merger',
   208	        sourceSurface: 'compaction',
   209	        trustState: 'live',
   210	        generatedAt: new Date().toISOString(),
   211	        lastUpdated: null,
   212	        sourceRefs: ['budget-allocator', 'compact-merger'],
   213	      },
   214	      ...(selection ? { selection } : {}),
   215	    }),
   216	    metadata: {
   217	      totalTokenEstimate,
   218	      sourceCount: sections.length,
   219	      mergedAt: new Date().toISOString(),
   220	      mergeDurationMs,

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts | sed -n '70,170p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    70	  ].filter(Boolean);
    71	  return parts.join('\n\n');
    72	}
    73	
    74	function appendStartupSnapshotNote(content: string): string {
    75	  return [
    76	    content,
    77	    'Note: this is a startup snapshot; later structural reads may differ if the repo state changed.',
    78	  ].join('\n\n');
    79	}
    80	
    81	/** Build the OpenCode runtime hook plan from the shared payload surfaces. */
    82	export function buildOpenCodeTransportPlan(args: {
    83	  bootstrapPayload?: SharedPayloadEnvelope | null;
    84	  startupPayload?: SharedPayloadEnvelope | null;
    85	  resumePayload?: SharedPayloadEnvelope | null;
    86	  healthPayload?: SharedPayloadEnvelope | null;
    87	  compactionPayload?: SharedPayloadEnvelope | null;
    88	  specFolder?: string | null;
    89	}): OpenCodeTransportPlan {
    90	  const trackedPayloadKinds = [
    91	    args.bootstrapPayload?.kind,
    92	    args.startupPayload?.kind,
    93	    args.resumePayload?.kind,
    94	    args.healthPayload?.kind,
    95	    args.compactionPayload?.kind,
    96	  ].filter((kind): kind is SharedPayloadEnvelope['kind'] => !!kind);
    97	
    98	  const systemPayload = args.bootstrapPayload ?? args.startupPayload ?? args.resumePayload ?? null;
    99	  const messagePayloads = [args.resumePayload, args.healthPayload].filter(
   100	    (payload): payload is SharedPayloadEnvelope => !!payload,
   101	  );
   102	  const compactionPayload = args.compactionPayload ?? args.resumePayload ?? args.bootstrapPayload ?? null;
   103	
   104	  return {
   105	    interfaceVersion: '1.0',
   106	    transportOnly: true,
   107	    retrievalPolicyOwner: 'runtime',
   108	    event: {
   109	      hook: 'event',
   110	      trackedPayloadKinds,
   111	      summary: args.specFolder
   112	        ? `Track OpenCode routing hints for ${args.specFolder}`
   113	        : 'Track OpenCode routing hints for the current packet/runtime state',
   114	    },
   115	    ...(systemPayload
   116	      ? {
   117	        systemTransform: {
   118	          hook: 'experimental.chat.system.transform',
   119	          title: 'OpenCode Startup Digest',
   120	          payloadKind: systemPayload.kind,
   121	          dedupeKey: `system:${systemPayload.kind}`,
   122	          content: appendStartupSnapshotNote(renderBlockContent(
   123	            systemPayload,
   124	            'Inject this as the startup digest for hookless OpenCode recovery. Keep it transport-only.',
   125	          ),
   126	          ),
   127	        },
   128	      }
   129	      : {}),
   130	    messagesTransform: messagePayloads.map((payload, index) => ({
   131	      hook: 'experimental.chat.messages.transform' as const,
   132	      title: index === 0 ? 'OpenCode Retrieved Context' : 'OpenCode Operational Context',
   133	      payloadKind: payload.kind,
   134	      dedupeKey: `messages:${payload.kind}:${index}`,
   135	      content: renderBlockContent(
   136	        payload,
   137	        'Inject this as bounded current-turn context. Do not treat it as retrieval policy.',
   138	      ),
   139	    })),
   140	    ...(compactionPayload
   141	      ? {
   142	        compaction: {
   143	          hook: 'experimental.session.compacting',
   144	          title: 'OpenCode Compaction Resume Note',
   145	          payloadKind: compactionPayload.kind,
   146	          dedupeKey: `compaction:${compactionPayload.kind}`,
   147	          content: renderBlockContent(
   148	            compactionPayload,
   149	            'Inject this as the continuity note across compaction. Keep it separate from current-turn retrieval.',
   150	          ),
   151	        },
   152	      }
   153	      : {}),
   154	  };
   155	}

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js | sed -n '54,140p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    54	const core_1 = require("../core");
    55	const workflow_1 = require("../core/workflow");
    56	const loaders_1 = require("../loaders");
    57	const collect_session_data_1 = require("../extractors/collect-session-data");
    58	// ───────────────────────────────────────────────────────────────
    59	// 3. HELP TEXT
    60	// ───────────────────────────────────────────────────────────────
    61	const HELP_TEXT = `
    62	Usage: node generate-context.js [options] <input>
    63	
    64	Arguments:
    65	  <input>           A JSON data file path
    66	                    - JSON file mode: node generate-context.js data.json [spec-folder]
    67	
    68	Options:
    69	  --help, -h        Show this help message
    70	  --stdin           Read structured JSON from stdin (preferred when a caller already has curated session data)
    71	  --json <string>   Read structured JSON from an inline string (preferred when structured data is available)
    72	  --session-id <uuid>  Explicit session ID to attach to the saved memory metadata
    73	
    74	Examples:
    75	  node generate-context.js /tmp/context-data.json
    76	  node generate-context.js /tmp/context-data.json specs/001-feature/
    77	  node generate-context.js /tmp/context-data.json .opencode/specs/001-feature/
    78	  echo '{"specFolder":"specs/001-feature/"}' | node generate-context.js --stdin
    79	  node generate-context.js --json '{"specFolder":"specs/001-feature/"}'
    80	
    81	Output:
    82	  Creates a memory file in <spec-folder>/memory/ with ANCHOR format
    83	  for indexing by the Spec Kit Memory system.
    84	
    85	Preferred save path (JSON-PRIMARY):
    86	  - ALWAYS use --stdin, --json, or a JSON temp file.
    87	  - The AI has strictly better information about its own session than any DB query can reconstruct.
    88	  - Explicit CLI targets still outrank payload specFolder values in every structured-input mode.
    89	
    90	Direct CLI target rule:
    91	  - When a spec folder is passed on the CLI, that explicit target is authoritative.
    92	  - Session learning, JSON SPEC_FOLDER fields, and auto-detect may inform logging,
    93	    but they must not reroute the save to another folder.
    94	
    95	JSON Data Format (with preflight/postflight, session/git, and tool/exchange enrichment):
    96	  {
    97	    "user_prompts": [...],
    98	    "observations": [...],
    99	    "recent_context": [...],
   100	    "toolCalls": [
   101	      { "tool": "Read", "inputSummary": "Read data-loader.ts", "outputSummary": "585 lines", "status": "success", "durationEstimate": "fast" },
   102	      { "tool": "Edit", "inputSummary": "Added deprecation warning", "outputSummary": "Inserted 10 lines", "status": "success" }
   103	    ],
   104	    "exchanges": [
   105	      { "userInput": "Implement the JSON-primary plan", "assistantResponse": "Updated 8 files...", "timestamp": "ISO-8601" }
   106	    ],
   107	    "preflight": {
   108	      "knowledgeScore": 40,
   109	      "uncertaintyScore": 60,
   110	      "contextScore": 50,
   111	      "timestamp": "ISO-8601",
   112	      "gaps": ["gap1", "gap2"],
   113	      "confidence": 45,
   114	      "readiness": "Needs research"
   115	    },
   116	    "postflight": {
   117	      "knowledgeScore": 75,
   118	      "uncertaintyScore": 25,
   119	      "contextScore": 80,
   120	      "gapsClosed": ["gap1"],
   121	      "newGaps": ["new-gap"]
   122	    }
   123	  }
   124	
   125	  Tool/Exchange enrichment fields (all optional — JSON-mode only):
   126	  - toolCalls[]: AI-summarized tool calls with tool name, input/output summaries, status, duration
   127	  - exchanges[]: Key user-assistant exchanges with timestamps
   128	  - These provide richer context than DB extraction since the AI filters noise at source
   129	
   130	  Learning Delta Calculation:
   131	  - Knowledge Delta = postflight.knowledgeScore - preflight.knowledgeScore
   132	  - Uncertainty Reduction = preflight.uncertaintyScore - postflight.uncertaintyScore
   133	  - Context Delta = postflight.contextScore - preflight.contextScore
   134	  - Learning Index = (Know x 0.4) + (Uncert x 0.35) + (Context x 0.25)
   135	`;
   136	if (process.argv.includes('--help') || process.argv.includes('-h')) {
   137	    console.log(HELP_TEXT);
   138	    process.exit(0);
   139	}
   140	// 2.1 SIGNAL HANDLERS

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts | sed -n '25,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    25	  graphFreshness: 'fresh' | 'stale' | 'empty' | 'error';
    26	  cocoIndexAvailable: boolean;
    27	  sessionQuality: 'healthy' | 'degraded' | 'critical' | 'unknown';
    28	  lastToolCallAgoMs: number | null;
    29	  primed: boolean;
    30	  routingRecommendation: string;
    31	}
    32	
    33	/**
    34	 * Phase 027: Structural Bootstrap Contract — shared by all non-hook surfaces.
    35	 * Single source of truth for structural context in startup/recovery flows.
    36	 * Token budget: 250-400 tokens (hard ceiling 500 including guidance).
    37	 */
    38	export interface StructuralBootstrapContract {
    39	  status: 'ready' | 'stale' | 'missing';
    40	  summary: string;
    41	  highlights?: string[];
    42	  recommendedAction: string;
    43	  sourceSurface: 'auto-prime' | 'session_bootstrap' | 'session_resume' | 'session_health';
    44	  provenance?: SharedPayloadProvenance;
    45	}
    46	
    47	/* ───────────────────────────────────────────────────────────────
    48	   2. CONSTANTS
    49	──────────────────────────────────────────────────────────────── */
    50	
    51	const STRUCTURAL_CONTRACT_MAX_TOKENS = 500;
    52	
    53	/* ───────────────────────────────────────────────────────────────
    54	   3. HELPERS
    55	──────────────────────────────────────────────────────────────── */
    56	
    57	function resolveGraphFreshness(): SessionSnapshot['graphFreshness'] {
    58	  try {
    59	    return getGraphFreshness(process.cwd());
    60	  } catch {
    61	    return 'error';
    62	  }
    63	}
    64	
    65	function estimateTextTokens(text: string): number {
    66	  return Math.ceil(text.length / 4);
    67	}
    68	
    69	function truncateTextToTokenBudget(text: string, maxTokens: number): string {
    70	  if (maxTokens <= 0) {
    71	    return '';
    72	  }
    73	
    74	  if (estimateTextTokens(text) <= maxTokens) {
    75	    return text;
    76	  }
    77	
    78	  const maxChars = Math.max(0, (maxTokens * 4) - 3);
    79	  return `${text.slice(0, maxChars).trimEnd()}...`;
    80	}
    81	
    82	function estimateStructuralContractTokens(
    83	  summary: string,
    84	  highlights: string[] | undefined,
    85	  recommendedAction: string,
    86	): number {
    87	  return estimateTextTokens([
    88	    summary,
    89	    ...(highlights ?? []),
    90	    recommendedAction,
    91	  ].join('\n'));
    92	}
    93	
    94	function fitStructuralContractBudget(
    95	  summary: string,
    96	  highlights: string[] | undefined,
    97	  recommendedAction: string,
    98	): {
    99	  summary: string;
   100	  highlights: string[] | undefined;
   101	  recommendedAction: string;
   102	} {
   103	  let fittedSummary = summary;
   104	  let fittedHighlights = highlights ? [...highlights] : undefined;
   105	  let fittedRecommendedAction = recommendedAction;
   106	
   107	  while (fittedHighlights && fittedHighlights.length > 0
   108	    && estimateStructuralContractTokens(fittedSummary, fittedHighlights, fittedRecommendedAction) > STRUCTURAL_CONTRACT_MAX_TOKENS) {
   109	    fittedHighlights = fittedHighlights.slice(0, -1);
   110	  }
   111	
   112	  if (estimateStructuralContractTokens(fittedSummary, fittedHighlights, fittedRecommendedAction) > STRUCTURAL_CONTRACT_MAX_TOKENS) {
   113	    const reservedTokens = estimateStructuralContractTokens('', fittedHighlights, fittedRecommendedAction);
   114	    const summaryBudget = Math.max(40, STRUCTURAL_CONTRACT_MAX_TOKENS - reservedTokens);
   115	    fittedSummary = truncateTextToTokenBudget(fittedSummary, summaryBudget);
   116	  }
   117	
   118	  if (estimateStructuralContractTokens(fittedSummary, fittedHighlights, fittedRecommendedAction) > STRUCTURAL_CONTRACT_MAX_TOKENS) {
   119	    const reservedTokens = estimateStructuralContractTokens(fittedSummary, fittedHighlights, '');
   120	    const actionBudget = Math.max(20, STRUCTURAL_CONTRACT_MAX_TOKENS - reservedTokens);

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts | sed -n '200,285p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   200	    primed,
   201	    routingRecommendation,
   202	  };
   203	}
   204	
   205	/**
   206	 * Phase 027: Build a structural bootstrap contract for a given surface.
   207	 * Reuses resolveGraphFreshness() and getGraphStats() from this module.
   208	 * Keeps output compact (targets 250-400 tokens, ceiling 500).
   209	 */
   210	export function buildStructuralBootstrapContract(
   211	  sourceSurface: StructuralBootstrapContract['sourceSurface']
   212	): StructuralBootstrapContract {
   213	  const graphFreshness = resolveGraphFreshness();
   214	
   215	  let status: StructuralBootstrapContract['status'];
   216	  if (graphFreshness === 'fresh') {
   217	    status = 'ready';
   218	  } else if (graphFreshness === 'stale') {
   219	    status = 'stale';
   220	  } else {
   221	    status = 'missing';
   222	  }
   223	
   224	  let summary: string;
   225	  let highlights: string[] | undefined;
   226	
   227	  if (status === 'ready') {
   228	    try {
   229	      const stats = getGraphStats();
   230	      summary = `Code graph: ${stats.totalFiles} files, ${stats.totalNodes} nodes, ${stats.totalEdges} edges (fresh)`;
   231	      const topKinds = Object.entries(stats.nodesByKind)
   232	        .sort((a, b) => b[1] - a[1])
   233	        .slice(0, 5);
   234	      if (topKinds.length > 0) {
   235	        highlights = topKinds.map(([kind, count]) => `${kind}: ${count}`);
   236	      }
   237	    } catch {
   238	      summary = 'Code graph available (structural context ready)';
   239	    }
   240	  } else if (status === 'stale') {
   241	    try {
   242	      const stats = getGraphStats();
   243	      summary = `Code graph: ${stats.totalFiles} files, ${stats.totalNodes} nodes (stale — structural reads may refresh inline or recommend code_graph_scan)`;
   244	    } catch {
   245	      summary = 'Code graph data is stale — structural context may be outdated';
   246	    }
   247	  } else {
   248	    summary = 'No structural context available — code graph is empty or unavailable';
   249	  }
   250	
   251	  let recommendedAction: string;
   252	  if (status === 'ready') {
   253	    recommendedAction = 'Structural context available. Use code_graph_query for structural lookups.';
   254	  } else if (status === 'stale') {
   255	    recommendedAction = 'Use a structural read to trigger bounded inline refresh when safe, or run code_graph_scan for broader stale states.';
   256	  } else {
   257	    recommendedAction = 'Call session_bootstrap first. Then run code_graph_scan if structural context is needed.';
   258	  }
   259	
   260	  const fittedContract = fitStructuralContractBudget(summary, highlights, recommendedAction);
   261	
   262	  return {
   263	    status,
   264	    summary: fittedContract.summary,
   265	    highlights: fittedContract.highlights,
   266	    recommendedAction: fittedContract.recommendedAction,
   267	    sourceSurface,
   268	    provenance: {
   269	      producer: 'session_snapshot',
   270	      sourceSurface,
   271	      trustState: trustStateFromStructuralStatus(status),
   272	      generatedAt: new Date().toISOString(),
   273	      lastUpdated: status === 'ready' || status === 'stale'
   274	        ? (() => {
   275	          try {
   276	            const stats = getGraphStats();
   277	            return stats.lastScanTimestamp ?? null;
   278	          } catch {
   279	            return null;
   280	          }
   281	        })()
   282	        : null,
   283	      sourceRefs: ['code-graph-db', 'session-snapshot'],
   284	    },
   285	  };

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '760,792p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   760	    'Graph retrieval: memory_search supports retrievalLevel (local/global/auto) for entity-level or community-level search. Graph provenance visible via graphEvidence in results.',
   761	    staleWarning.trim(),
   762	  ];
   763	
   764	  // Phase 024 / Item 4: Session recovery digest from session-snapshot
   765	  try {
   766	    const { getSessionSnapshot } = await import('./lib/session/session-snapshot.js');
   767	    const snap = getSessionSnapshot();
   768	    const hasData = snap.specFolder || snap.graphFreshness !== 'error' || snap.sessionQuality !== 'unknown';
   769	    if (hasData) {
   770	      const recommended = !snap.primed ? 'call session_bootstrap()' :
   771	        snap.graphFreshness === 'empty' ? 'run code_graph_scan' :
   772	        snap.sessionQuality === 'critical' ? 'call memory_context(resume)' : 'ready';
   773	      lines.push('');
   774	      lines.push('## Session Recovery');
   775	      lines.push(`- Last spec folder: ${snap.specFolder || 'none'}`);
   776	      lines.push(`- Code graph: ${snap.graphFreshness}`);
   777	      lines.push(`- Session quality: ${snap.sessionQuality}`);
   778	      lines.push(`- Recommended: ${recommended}`);
   779	    }
   780	  } catch { /* session-snapshot not available — skip digest */ }
   781	
   782	  // Phase 027: Structural bootstrap guidance for non-hook runtimes
   783	  lines.push('');
   784	  lines.push('## Structural Bootstrap (Phase 027)');
   785	  lines.push('Non-hook runtimes receive automatic structural context via session_bootstrap, session_resume, and auto-prime.');
   786	  lines.push('- If structural context shows "ready": code_graph_query is available for structural lookups');
   787	  lines.push('- If "stale" or "missing": call session_bootstrap first to refresh structural context');
   788	  lines.push('- Recovery priority: session_bootstrap → session_resume → code_graph_scan');
   789	
   790	  // Phase 024: Tool routing decision tree
   791	  try {
   792	    const { getSessionSnapshot: getSnap } = await import('./lib/session/session-snapshot.js');

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go | sed -n '1,90p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/writer.go | sed -n '1,80p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '780,790p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   780	- when updating changelog claims, keep wording pinned to implemented behavior evidence (bounded inline `selective_reindex` vs explicit operator `code_graph_scan`) [Task 8]
   781	
   782	## Reusable knowledge
   783	
   784	- canonical validation gates for packet readiness here were `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <packet> --recursive --strict` plus `TMPDIR=... npm run check:full` and `npm run build` evidence capture [Task 1][Task 2]
   785	- for strict validator compliance, checklist lines need explicit `[EVIDENCE: ...]` and level-template headers/section numbers must remain exact (`## 1. METADATA`, `## 2. PROBLEM & PURPOSE`, etc.) [Task 3]
   786	- `session_bootstrap()` is the primary recovery call for non-hook flows; docs should mention fallback `memory_context({mode:"resume",profile:"resume"})` only after bootstrap guidance [Task 4]
   787	- hook path truth is `mcp_server/hooks/claude/*.ts` and compiled `mcp_server/dist/hooks/claude/*.js`; avoid stale `scripts/hooks/claude/` references [Task 4]
   788	- changelog truth-sync for 023 needed root + per-phase consistency: add missing phase 013 entry and avoid overstating rerun verification for 010/011/012 while strict validation remains green [Task 5]
   789	- for packet changelog generation at this scale, first mirror prior packet changelog structure, then gather evidence from implementation summaries/checklists/review docs before drafting per-phase files [Task 6]
   790	- README formatting in this repo is partially hand-formatted; if `npx prettier --check README.md` fails but `git diff --check` is clean, keep scoped edits and avoid whole-file reflow [Task 7]

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '1818,1828p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1818	- when user requested commit/push and clarified scope, isolate staged files to Hydra artifacts and leave unrelated work unstaged [Task 5]
  1819	- when violations are found in review, the user signal was “apply fixes” -> execute remediation immediately instead of stopping at findings-only reports [Task 4]
  1820	
  1821	## Reusable knowledge
  1822	
  1823	- Level-3 Hydra packets need AI protocol sections, anchors, `SPECKIT_TEMPLATE_SOURCE`, and `[EVIDENCE: ...]` tags on completed P0/P1 checklist rows for clean recursive validation [Task 1][Task 5]
  1824	- For phase-sliced completion, convert future-phase rows into explicit deferrals (`[deferred: Phase N follow-up]`) so Phase-1 can close without pretending later phases shipped [Task 2]
  1825	- `generate-context.js` succeeds in manual/headless runs when passed JSON-mode session data (`SPEC_FOLDER`, `recent_context`, `observations`, `user_prompts`) plus absolute spec path [Task 2]
  1826	- Governance hardening in this wave centered on guaranteed session/tenant enforcement in `filterRowsByScope`, shared-space authorization, and scoped retention sweep deletions [Task 3]
  1827	- Hydra comment quality standard: exported interfaces/functions must carry purposeful TSDoc plus traceable reference tags (`T###`, `REQ-###`, `BUG-###`, `CHK-###`) [Task 4]
  1828	

codex
# Iteration 024: COMPACTION & CONTEXT SURVIVAL

## Focus
COMPACTION & CONTEXT SURVIVAL: How does this system handle context window limits, compaction events, and startup context reconstruction? Lessons for our compaction survival.

## Findings
### Finding 1: Modus survives fresh chats, not active compaction
- **Source**: [main.go:77](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go#L77); [main.go:90](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go#L90); [indexer.go:65](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go#L65)
- **What it does**: On every process start, Modus rebuilds an in-memory BM25/cross-ref index from markdown files, then serves MCP from that rebuilt vault state. The durable truth is the markdown vault; there is no first-class session object, cached continuity summary, resume artifact, or compaction lifecycle in the server itself.
- **Why it matters**: That is enough for cross-chat recall, but it does not preserve in-flight task state across context compaction. Restarting Modus reconstructs searchable memory, not the active working session.
- **Recommendation**: **reject**
- **Impact**: **high**

### Finding 2: Modus handles context-window pressure by convention, not by an auditable transport contract
- **Source**: [librarian.md:14](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md#L14); [librarian.md:29](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md#L29); [vault.go:21](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L21); [vault.go:280](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L280)
- **What it does**: The README/Librarian pattern promises that a local model prunes and compresses context down to a small handoff, but the MCP code itself only exposes search, expansion, fact recall, and connected-doc hints. The compression layer is an operational pattern around the server, not a typed startup/compaction surface emitted by the server.
- **Why it matters**: This makes Modus’s context survival model model-dependent and hard to verify. It can reduce token pressure, but it does not give operators a structured continuity contract comparable to a bootstrap payload.
- **Recommendation**: **prototype later**
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


hook: Stop
hook: Stop Completed
tokens used
195,759
# Iteration 024: COMPACTION & CONTEXT SURVIVAL

## Focus
COMPACTION & CONTEXT SURVIVAL: How does this system handle context window limits, compaction events, and startup context reconstruction? Lessons for our compaction survival.

## Findings
### Finding 1: Modus survives fresh chats, not active compaction
- **Source**: [main.go:77](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go#L77); [main.go:90](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go#L90); [indexer.go:65](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go#L65)
- **What it does**: On every process start, Modus rebuilds an in-memory BM25/cross-ref index from markdown files, then serves MCP from that rebuilt vault state. The durable truth is the markdown vault; there is no first-class session object, cached continuity summary, resume artifact, or compaction lifecycle in the server itself.
- **Why it matters**: That is enough for cross-chat recall, but it does not preserve in-flight task state across context compaction. Restarting Modus reconstructs searchable memory, not the active working session.
- **Recommendation**: **reject**
- **Impact**: **high**

### Finding 2: Modus handles context-window pressure by convention, not by an auditable transport contract
- **Source**: [librarian.md:14](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md#L14); [librarian.md:29](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md#L29); [vault.go:21](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L21); [vault.go:280](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L280)
- **What it does**: The README/Librarian pattern promises that a local model prunes and compresses context down to a small handoff, but the MCP code itself only exposes search, expansion, fact recall, and connected-doc hints. The compression layer is an operational pattern around the server, not a typed startup/compaction surface emitted by the server.
- **Why it matters**: This makes Modus’s context survival model model-dependent and hard to verify. It can reduce token pressure, but it does not give operators a structured continuity contract comparable to a bootstrap payload.
- **Recommendation**: **prototype later**
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
