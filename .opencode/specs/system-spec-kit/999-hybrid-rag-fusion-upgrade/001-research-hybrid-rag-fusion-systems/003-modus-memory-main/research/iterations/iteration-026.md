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

exec
/bin/zsh -lc 'rg -n "semantic|lexical|BM25|hybrid|fusion|embedding|FTS|vector|query expansion|librarian|crossref|adjacency|prefix|Jaccard|cache" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
13:- fix findings, review/review-report.md, 002-implement-cache-warning-hooks, 003-memory-quality-issues, 008-graph-first-routing-nudge, 010-sqlite-fts-helper, 013-analytics-token-contracts, 014-code-graph-upgrades, lexicalPath unavailable, Structural Routing Hint, validate.sh --strict
24:- packet 010 degraded lexical lane vocabulary is `lexicalPath: 'unavailable'`; align runtime output, tests, README, and checklist language to this exact label [Task 1]
130:- docs(026-runtime), no runtime code edits, staged runtime packet docs first, validate.sh 002-implement-cache-warning-hooks, validate.sh 014-code-graph-upgrades, description.json memory/metadata.json untouched
180:- symptom: valid manual trigger phrase with numeric prefix disappears and causes `PSR-2`; cause: broad `^\\d{1,3}\\s` rejection rule; fix: apply numeric-prefix rejection only when phrase remains short (`<=3` words) [Task 1]
205:- shipped 014 lane includes detector provenance vocabulary carriers, blast-radius traversal with explicit depth cap and union semantics, and low-authority hot-file breadcrumb evidence while preserving packet 011 trust-axis payloads [Task 1]
242:scope: redundancy-driven doc updates in `002-implement-cache-warning-hooks` and `003-memory-quality-issues`, plus Phase 6 plan recall tied to completed research authority
253:- 002-implement-cache-warning-hooks, 003-memory-quality-issues, compact continuity wrapper, decision-record.md, implementation-summary.md, spec/validate.sh --strict, template-only anchor/header mismatch
313:- 005-claudest, execution-ready lane, FTS helper forced-degrade matrix, stop-hook metadata patch, normalized analytics reader, cached-summary fast path, verifier discoverer split, token-insight contracts
335:## Task 6: Harmonize `002-implement-cache-warning-hooks` with canonical post-2026-04-08 research sequencing and acceptance criteria, outcome success
339:- rollout_summaries/2026-04-08T09-18-00-WHKH-update_cache_warning_and_close_normalized_analytics.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/08/rollout-2026-04-08T11-18-00-019d6c62-646b-7423-8d05-2b4bfa1536db.jsonl, updated_at=2026-04-08T11:11:26+00:00, thread_id=019d6c62-646b-7423-8d05-2b4bfa1536db)
343:- 002-implement-cache-warning-hooks, canonical research, sequencing prerequisites acceptance criteria, producer metadata, normalized analytics reader, cache token carry-forward, bootstrap authority, UserPromptSubmit demoted
349:- rollout_summaries/2026-04-08T09-18-00-WHKH-update_cache_warning_and_close_normalized_analytics.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/08/rollout-2026-04-08T11-18-00-019d6c62-646b-7423-8d05-2b4bfa1536db.jsonl, updated_at=2026-04-08T11:11:26+00:00, thread_id=019d6c62-646b-7423-8d05-2b4bfa1536db, task-local focus=031 closeout)
383:- Claudest continuation is now an execution-ready sequence to preserve in order: FTS helper and forced-degrade tests -> stop-hook metadata patch -> normalized analytics reader -> cached-summary fast path -> verifier/discoverer split -> token-insight contracts [Task 3]
388:- canonical source for `002-implement-cache-warning-hooks` updates is the post-2026-04-08 synthesis in `001-research-graph-context-systems/research.md` and `research/recommendations.md`; align ordering/prereqs/acceptance there and keep task wording consistent about `.claude/settings.local.json` boundaries [Task 6]
389:- phase sequence now expected in `002` docs: shared schema/metadata -> replay harness -> stop timestamp -> seam validation -> resume estimator -> UserPromptSubmit gate, with producer metadata + cache token carry-forward + bootstrap authority kept as acceptance anchors [Task 6]
392:- follow-on phase train now implemented as: `026/005` measurement contract -> `026/006` trust-axis contract -> `026/007` detector floor -> `026/008` graph hint nudge -> `026/009` auditable publication -> `024/032` cached-summary consumer -> `024/033` optional FTS hardening -> `024/034` workflow/token-insight split [Task 8]
443:scope: packet/folder renames with full reference rewrites, descriptions cache refresh, memory reindex, and changelog path cleanup
456:## Task 2: Rename packet `023-esm-module-compliance` to `023-hybrid-rag-fusion-refinement` and sync changelog references, outcome success
460:- rollout_summaries/2026-04-03T10-18-09-ppdB-rename_023_hybrid_rag_fusion_refinement.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/03/rollout-2026-04-03T12-18-09-019d52d9-a8b9-71c3-949c-f6870aee05a7.jsonl, updated_at=2026-04-03T10:43:47+00:00, thread_id=019d52d9-a8b9-71c3-949c-f6870aee05a7)
464:- 023-hybrid-rag-fusion-refinement, memory_index_scan, memory_quick_search, parentChain, B3-hybrid-rag-fusion-refinement, .opencode/changelog
484:- 01--anobel.com to 00--anobel.com, drop numeric prefixes, .opencode/specs/descriptions.json, ensureDescriptionCache, git rm -r --cached, skip spec folder
494:- git add -A, git diff --cached --name-status -M, git push origin HEAD:main, Everything up-to-date, bypass branch rules, PR CodeScan signature warnings
509:- parent-folder rename cleanup includes untracking excluded folders via `git rm -r --cached <folder>` and verifying with `git ls-files <folder> | wc -l` before push [Task 4]
510:- for large rename waves, verify staged rename mapping with `git diff --cached --name-status -M` before commit/push [Task 5]
514:- symptom: bulk replacement corrupts values (`B3-hybrid-rag-fusion-refinement`); cause: over-broad regex/string substitution; fix: run post-rewrite `rg` anomaly sweep and apply targeted literal repairs for parentChain/headings/JSON snippets [Task 2]
515:- symptom: rename appears complete but stale entries persist in generated indices; cause: descriptions cache/memory index not rebuilt; fix: rerun `ensureDescriptionCache` and forced `memory_index_scan` on packet + parent scope [Task 2][Task 3]
546:- `follow_on_tool_use` depends on a session id that matches the in-memory search session cache; if a non-search tool call lacks/does not inherit that session id, the follow-on event will not emit [Task 2]
721:- strict-validation, 023/011-indexing-and-adaptive-fusion, 024-compact-code-graph, EVIDENCE:, TEMPLATE_HEADERS, PHASE DOCUMENTATION MAP
1039:## Task 4: Keep embeddings provider `auto` compatible while fixing startup dimension mismatches
1069:## Task 7: Verify and harden FTS5 ablation integrity (alignment guard + evaluation mode + parent-id normalization)
1087:- when user requested ablation verification, run `eval_run_ablation({ mode:"ablation", includeFormattedReport:true, storeResults:true })` through Codex MCP before declaring FTS5 outcomes [Task 7]
1113:scope: packet identity rewrites, slug/path sweeps, and follow-on phase packet creation in 022-hybrid-rag-fusion remediation work
1114:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion; reuse_rule=reuse for this epic’s packet lifecycle work only, and verify current live folder names before edits
1120:- rollout_summaries/2026-03-27T18-02-31-ZDov-update_020_pre_release_remediation_paths.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/020-pre-release-remediation, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/27/rollout-2026-03-27T19-02-31-019d3076-47f7-7fd3-8952-dda85e3bdb43.jsonl, updated_at=2026-03-27T18:14:00+00:00, thread_id=019d3076-47f7-7fd3-8952-dda85e3bdb43)
1192:scope: `/spec_kit:deep-research --review` execution contract, review-folder semantics, and release-readiness criteria mapping
1199:- rollout_summaries/2026-03-27T13-58-07-KxRC-hybrid_rag_fusion_deep_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/27/rollout-2026-03-27T14-58-07-019d2f96-895d-7600-a315-cf9e5ee673c0.jsonl, updated_at=2026-03-27T17:15:58+00:00, thread_id=019d2f96-895d-7600-a315-cf9e5ee673c0)
1274:- Advisor benchmark/regression commands need explicit `--dataset` and semantic-disable env toggle for stable timing [Task 1]
1278:- symptom: benchmark p95 unexpectedly high; cause: builtin semantic latency noise; fix: disable builtin semantic path during benchmark runs [Task 1]
1443:scope: structured JSON save authority, recovery-only fallback semantics, and Phase 016/011 runtime-doc-test parity
1451:- rollout_summaries/2026-03-20T13-25-39-plA6-json_mode_hybrid_enrichment_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/20/rollout-2026-03-20T14-25-39-019d0b6c-4b37-7893-95f2-4903cf5564fa.jsonl, updated_at=2026-03-20T14:12:18+00:00, thread_id=019d0b6c-4b37-7893-95f2-4903cf5564fa)
1473:- rollout_summaries/2026-03-22T10-21-03-Dc6v-review_spec_011_hybrid_rag_refinement.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/22/rollout-2026-03-22T11-21-03-019d150f-ff8f-7340-8845-e3d582e7f2cb.jsonl, updated_at=2026-03-22T12:12:08+00:00, thread_id=019d150f-ff8f-7340-8845-e3d582e7f2cb)
1490:- captured-session, stateless-enrichment.vitest.ts, session-enrichment.vitest.ts, 1024-d embeddings
1504:- Handler dedup-path tests require realistic harness inputs (1024-d embedding and branch-specific setup) [Task 4]
1510:- symptom: dedup-path test misses intended branch; cause: PE short-circuit or invalid mock embedding shape; fix: adjust harness to branch conditions [Task 4]
1514:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion and linked docs; reuse_rule=reuse only within this spec family and re-check live numeric IDs each run
1540:- rollout_summaries/2026-03-21T13-00-24-DDYC-022_hybrid_rag_fusion_root_normalization.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/21/rollout-2026-03-21T14-00-24-019d107b-868a-7b62-8c96-076460904ae2.jsonl, updated_at=2026-03-21T14:12:37+00:00, thread_id=019d107b-868a-7b62-8c96-076460904ae2)
1545:- 022-hybrid-rag-fusion, PHASE_LINKS, AI_PROTOCOL, 33 tools, .gemini/agents
1551:- rollout_summaries/2026-03-21T11-13-41-ktLk-hybrid_rag_fusion_alignment_audit_2026_03_21.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/21/rollout-2026-03-21T12-13-41-019d1019-d5aa-7be2-860a-ed8eaa45fe5a.jsonl, updated_at=2026-03-21T12:13:04+00:00, thread_id=019d1019-d5aa-7be2-860a-ed8eaa45fe5a)
1577:scope: governed retrieval scope propagation, shared-space authorization contracts, memory health auto-repair safety, hybrid runtime audits, and handler-level envelope/graph-signal guards
1614:- rollout_summaries/2026-03-21T12-12-58-Tp5J-hybrid_rag_fusion_audit.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/21/rollout-2026-03-21T13-12-58-019d1050-19ec-7bd2-b5bd-7078f5a1dd6f.jsonl, updated_at=2026-03-21T12:59:53+00:00, thread_id=019d1050-19ec-7bd2-b5bd-7078f5a1dd6f)
1651:- Run duplicate-content precheck before embedding persistence to preserve duplicate UX contract [Task 4]
1762:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public; reuse_rule=reuse for Hydra work under `022-hybrid-rag-fusion/015-hydra-db-based-features`, but keep scope explicit when staging/committing
1855:- rollout_summaries/2026-03-13T11-17-06-8uZ8-orphan_remediation_hybrid_rag.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/13/rollout-2026-03-13T12-17-06-019ce6ea-1692-7a91-913f-e70a7ef27206.jsonl, updated_at=2026-03-13T12:19:33+00:00, thread_id=019ce6ea-1692-7a91-913f-e70a7ef27206)
1900:- rollout_summaries/2026-03-13T14-00-56-wEII-audit_hybrid_rag_fusion_specs.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/13/rollout-2026-03-13T15-00-56-019ce780-1534-78c0-aa0e-53e96b088204.jsonl, updated_at=2026-03-13T14:52:39+00:00, thread_id=019ce780-1534-78c0-aa0e-53e96b088204)
1918:- `memory_health` cleanup runbook: back up DB first, clean temp-path rows/vector orphans transactionally, then re-run integrity checks and report post-clean stats [Task 2]
1949:- rollout_summaries/2026-03-12T17-35-18-3ZLY-hybrid_rag_spec_folder_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/12/rollout-2026-03-12T18-35-18-019ce31d-f9c0-74d1-9f39-6de8573ff6aa.jsonl, updated_at=2026-03-12T18:01:53+00:00, thread_id=019ce31d-f9c0-74d1-9f39-6de8573ff6aa)
1960:- rollout_summaries/2026-03-12T16-54-20-kwyP-hybrid_rag_lifecycle_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/12/rollout-2026-03-12T17-54-20-019ce2f8-78de-7020-b460-a2ad3d10009f.jsonl, updated_at=2026-03-12T18:05:20+00:00, thread_id=019ce2f8-78de-7020-b460-a2ad3d10009f)
1975:- rollout_summaries/2026-03-13T07-35-56-VaWc-hybrid_rag_retrieval_015_audit.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/13/rollout-2026-03-13T08-35-56-019ce61f-9983-79b0-92d9-268ec7dbeb98.jsonl, updated_at=2026-03-13T08:10:57+00:00, thread_id=019ce61f-9983-79b0-92d9-268ec7dbeb98)
2008:scope: read-only multi-agent review findings and documentation-drift checks for `023-hybrid-rag-fusion-refinement`
2009:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public under .opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement; reuse_rule=reuse for forensic review of this packet family, but confirm current active slug/path before applying findings
2015:- rollout_summaries/2026-03-04T10-42-27-LKfV-hybrid_rag_fusion_refinement_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/04/rollout-2026-03-04T11-42-27-019cb871-1f3b-70b3-89f4-407b0a5dcacb.jsonl, updated_at=2026-03-04T10:51:24+00:00, thread_id=019cb871-1f3b-70b3-89f4-407b0a5dcacb)
2019:- 023-hybrid-rag-fusion-refinement, ultra-think, severity ordering, file+line evidence, CHK-060 duplicate, [Criteria TBD]
2023:- when user asked to “Let 3 ultra-think agents review all work done in .../023-hybrid-rag-fusion-refinement,” run multi-agent read-only review with severity-ranked findings and exact file+line evidence [Task 1]
2045:- ~/.codex/config.toml, gpt-5.3-codex, model_reasoning_effort, xhigh, codex app-server generate-json-schema --out, models_cache.json
2075:- `~/.codex/models_cache.json` is a fast local truth source for `supported_reasoning_levels` per model slug [Task 1]

exec
/bin/zsh -lc "rg --files -g 'AGENTS.md' -g 'CLAUDE.md' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main .opencode/skill/system-spec-kit | sed 's#"'^#/#'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
codex
I’ve confirmed there aren’t deeper `AGENTS.md` or `CLAUDE.md` files overriding this scope in the target phase tree, and I pulled the deep-research skill entrypoint to stay aligned with the iteration workflow. Next I’m reading the concrete ranking and fusion code on both sides so the trade-off analysis stays tied to actual mechanics rather than prior summaries.
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/bm25.go | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Memory Search
     3	// ───────────────────────────────────────────────────────────────
     4	/* ───────────────────────────────────────────────────────────────
     5	   1. DEPENDENCIES
     6	──────────────────────────────────────────────────────────────── */
     7	
     8	import * as toolCache from '../lib/cache/tool-cache.js';
     9	import * as sessionManager from '../lib/session/session-manager.js';
    10	import * as intentClassifier from '../lib/search/intent-classifier.js';
    11	// TierClassifier, crossEncoder imports removed — only used by legacy V1 pipeline.
    12	import { isSessionBoostEnabled, isCausalBoostEnabled, isCommunitySearchFallbackEnabled, isDualRetrievalEnabled, isIntentAutoProfileEnabled } from '../lib/search/search-flags.js';
    13	import { searchCommunities } from '../lib/search/community-search.js';
    14	// 4-stage pipeline architecture
    15	import { executePipeline } from '../lib/search/pipeline/index.js';
    16	import type { PipelineConfig, PipelineResult } from '../lib/search/pipeline/index.js';
    17	import type { IntentWeightsConfig } from '../lib/search/pipeline/types.js';
    18	import { initConsumptionLog, logConsumptionEvent } from '../lib/telemetry/consumption-logger.js';
    19	import * as retrievalTelemetry from '../lib/telemetry/retrieval-telemetry.js';
    20	// Artifact-class routing (spec/plan/tasks/checklist/memory)
    21	import { getStrategyForQuery } from '../lib/search/artifact-routing.js';
    22	// Chunk reassembly (extracted from this file)
    23	import { collapseAndReassembleChunkResults } from '../lib/search/chunk-reassembly.js';
    24	// Search utilities (extracted from this file)
    25	import {
    26	  filterByMinQualityScore,
    27	  resolveQualityThreshold,
    28	  buildCacheArgs,
    29	  resolveRowContextType,
    30	  resolveArtifactRoutingQuery,
    31	  applyArtifactRouting,
    32	} from '../lib/search/search-utils.js';
    33	// CacheArgsInput used internally by buildCacheArgs (lib/search/search-utils.ts)
    34	// Eval channel tracking (extracted from this file)
    35	import {
    36	  collectEvalChannelsFromRow,
    37	  buildEvalChannelPayloads,
    38	  summarizeGraphWalkDiagnostics,
    39	} from '../lib/telemetry/eval-channel-tracking.js';
    40	import type { EvalChannelPayload } from '../lib/telemetry/eval-channel-tracking.js';
    41	
    42	// Eval logger — fail-safe, no-op when SPECKIT_EVAL_LOGGING !== "true"
    43	import { logSearchQuery, logChannelResult, logFinalResult } from '../lib/eval/eval-logger.js';
    44	import {
    45	  logFeedbackEvents,
    46	  isImplicitFeedbackLogEnabled,
    47	} from '../lib/feedback/feedback-ledger.js';
    48	import type { FeedbackEvent } from '../lib/feedback/feedback-ledger.js';
    49	import { trackQueryAndDetect, logResultCited } from '../lib/feedback/query-flow-tracker.js';
    50	
    51	// Core utilities
    52	import { checkDatabaseUpdated, isEmbeddingModelReady, waitForEmbeddingModel } from '../core/index.js';
    53	import { validateQuery, requireDb, toErrorMessage } from '../utils/index.js';
    54	
    55	// Response envelope + formatters
    56	import { createMCPErrorResponse, createMCPSuccessResponse } from '../lib/response/envelope.js';
    57	import { formatSearchResults } from '../formatters/index.js';
    58	
    59	// Shared handler types
    60	import type { MCPResponse, IntentClassification } from './types.js';
    61	
    62	// Retrieval trace contracts (C136-08)
    63	import { createTrace } from '@spec-kit/shared/contracts/retrieval-trace';
    64	import { buildAdaptiveShadowProposal } from '../lib/cognitive/adaptive-ranking.js';
    65	import { normalizeScopeContext } from '../lib/governance/scope-governance.js';
    66	import {
    67	  attachSessionTransitionTrace,
    68	  type SessionTransitionTrace,
    69	} from '../lib/search/session-transition.js';
    70	
    71	// REQ-D5-003: Mode-Aware Response Shape
    72	import {
    73	  applyProfileToEnvelope,
    74	  isResponseProfileEnabled,
    75	} from '../lib/response/profile-formatters.js';
    76	import {
    77	  buildProgressiveResponse,
    78	  extractSnippets,
    79	  isProgressiveDisclosureEnabled,
    80	  resolveCursor,
    81	} from '../lib/search/progressive-disclosure.js';
    82	import {
    83	  getLastLexicalCapabilitySnapshot,
    84	  resetLastLexicalCapabilitySnapshot,
    85	} from '../lib/search/sqlite-fts.js';
    86	import type { LexicalCapabilitySnapshot } from '../lib/search/sqlite-fts.js';
    87	import { evaluatePublicationGate } from '../lib/context/publication-gate.js';
    88	import {
    89	  deduplicateResults as deduplicateWithSessionState,
    90	  isSessionRetrievalStateEnabled,
    91	  manager as retrievalSessionStateManager,
    92	  refineForGoal,
    93	} from '../lib/search/session-state.js';
    94	
    95	// Type imports for casting
    96	import type { IntentType, IntentWeights as IntentClassifierWeights } from '../lib/search/intent-classifier.js';
    97	import type { RawSearchResult } from '../formatters/index.js';
    98	// RoutingResult, WeightedResult — now used internally by lib/search/search-utils.ts
    99	
   100	// Feature catalog: Semantic and lexical search (memory_search)
   101	// Feature catalog: Hybrid search pipeline
   102	// Feature catalog: 4-stage pipeline architecture
   103	// Feature catalog: Quality-aware 3-tier search fallback
   104	
   105	
   106	/* ───────────────────────────────────────────────────────────────
   107	   2. TYPES
   108	──────────────────────────────────────────────────────────────── */
   109	
   110	/**
   111	 * Internal search result row — enriched DB row used within this handler.
   112	 * NOT the same as the canonical SearchResult in shared/types.ts.
   113	 * Self-contained: uses local types instead of the deprecated MemoryRow/MemoryRecord shapes.
   114	 * This can migrate to MemoryDbRow & Record<string, unknown> later without changing the handler contract.
   115	 */
   116	interface MemorySearchRow extends Record<string, unknown> {
   117	  id: number;
   118	  similarity?: number;
   119	  importance_tier?: string;
   120	  contextType?: string;
   121	  context_type?: string;
   122	  attentionScore?: number;
   123	  retrievability?: number;
   124	  stability?: number;
   125	  last_review?: string | null;
   126	  created_at?: string;
   127	  last_accessed?: number;
   128	  content?: string;
   129	  memoryState?: string;
   130	  file_path?: string;
   131	  parent_id?: number | null;
   132	  chunk_index?: number | null;
   133	  chunk_label?: string | null;
   134	  isChunk?: boolean;
   135	  parentId?: number | null;
   136	  chunkIndex?: number | null;
   137	  chunkLabel?: string | null;
   138	  chunkCount?: number | null;
   139	  contentSource?: 'reassembled_chunks' | 'file_read_fallback';
   140	  precomputedContent?: string;
   141	}
   142	
   143	interface DedupResult {
   144	  results: MemorySearchRow[];
   145	  dedupStats: Record<string, unknown>;
   146	}
   147	
   148	interface SearchCachePayload {
   149	  summary: string;
   150	  data: Record<string, unknown>;
   151	  hints: string[];
   152	}
   153	
   154	type SessionAwareResult = Record<string, unknown> & {
   155	  id: number | string;
   156	  score?: number;
   157	  content?: string;
   158	};
   159	
   160	// ChunkReassemblyResult — now imported from lib/search/chunk-reassembly.ts
   161	
   162	type IntentWeights = IntentClassifierWeights;
   163	
   164	function toIntentWeightsConfig(weights: IntentWeights | null): IntentWeightsConfig | null {
   165	  if (!weights) return null;
   166	  return {
   167	    similarity: weights.similarity,
   168	    importance: weights.importance,
   169	    recency: weights.recency,
   170	  };
   171	}
   172	
   173	// EvalChannelPayload — now imported from lib/telemetry/eval-channel-tracking.ts
   174	
   175	interface SearchArgs {
   176	  cursor?: string;
   177	  query?: string;
   178	  concepts?: string[];
   179	  specFolder?: string;
   180	  folderBoost?: { folder: string; factor: number };
   181	  tenantId?: string;
   182	  userId?: string;
   183	  agentId?: string;
   184	  sharedSpaceId?: string;
   185	  limit?: number;
   186	  tier?: string;
   187	  contextType?: string;
   188	  useDecay?: boolean;
   189	  includeContiguity?: boolean;
   190	  includeConstitutional?: boolean;
   191	  includeContent?: boolean;
   192	  anchors?: string[];
   193	  bypassCache?: boolean;
   194	  sessionId?: string;
   195	  enableDedup?: boolean;
   196	  intent?: string;
   197	  autoDetectIntent?: boolean;
   198	  minState?: string;
   199	  applyStateLimits?: boolean;
   200	  rerank?: boolean;
   201	  applyLengthPenalty?: boolean;
   202	  trackAccess?: boolean; // opt-in access tracking (default false)
   203	  includeArchived?: boolean; // REQ-206: include archived memories in search (default false)
   204	  enableSessionBoost?: boolean;
   205	  enableCausalBoost?: boolean;
   206	  minQualityScore?: number;
   207	  min_quality_score?: number;
   208	  mode?: string; // "deep" mode enables query expansion for multi-query RAG
   209	  includeTrace?: boolean;
   210	  sessionTransition?: SessionTransitionTrace;
   211	  /** REQ-D5-003: Presentation profile ('quick'|'research'|'resume'|'debug'). Default: full response. */
   212	  profile?: string;
   213	  /** Phase B T019: Dual-level retrieval — 'local' (entity), 'global' (community), 'auto' (local + fallback). */
   214	  retrievalLevel?: 'local' | 'global' | 'auto';
   215	}
   216	
   217	// resolveRowContextType — now imported from lib/search/search-utils.ts
   218	// resolveEvalScore, collectEvalChannelsFromRow — now imported from lib/telemetry/eval-channel-tracking.ts
   219	
   220	function attachTelemetryMeta(
   221	  response: MCPResponse,
   222	  telemetryPayload: Record<string, unknown>,
   223	): MCPResponse {
   224	  const firstEntry = response?.content?.[0];
   225	  if (!firstEntry || typeof firstEntry.text !== 'string') {
   226	    return response;
   227	  }
   228	
   229	  try {
   230	    const envelope = JSON.parse(firstEntry.text) as Record<string, unknown>;
   231	    const meta = envelope.meta && typeof envelope.meta === 'object'
   232	      ? envelope.meta as Record<string, unknown>
   233	      : {};
   234	    envelope.meta = {
   235	      ...meta,
   236	      _telemetry: telemetryPayload,
   237	    };
   238	
   239	    return {
   240	      ...response,
   241	      content: [{ ...firstEntry, text: JSON.stringify(envelope, null, 2) }],
   242	    };
   243	  } catch (error: unknown) {
   244	    const message = toErrorMessage(error);
   245	    console.warn('[memory-search] Failed to attach telemetry payload:', message);
   246	    return response;
   247	  }
   248	}
   249	
   250	function extractResponseResults(response: MCPResponse): Array<Record<string, unknown>> {
   251	  const firstEntry = response?.content?.[0];
   252	  if (!firstEntry || typeof firstEntry.text !== 'string') {
   253	    return [];
   254	  }
   255	
   256	  try {
   257	    const envelope = JSON.parse(firstEntry.text) as Record<string, unknown>;
   258	    const data = envelope.data && typeof envelope.data === 'object'
   259	      ? envelope.data as Record<string, unknown>
   260	      : null;
   261	    return Array.isArray(data?.results)
   262	      ? data.results as Array<Record<string, unknown>>
   263	      : [];
   264	  } catch {
   265	    return [];
   266	  }
   267	}
   268	
   269	function extractSearchCachePayload(response: MCPResponse): SearchCachePayload | null {
   270	  const firstEntry = response?.content?.[0];
   271	  if (!firstEntry || typeof firstEntry.text !== 'string') {
   272	    return null;
   273	  }
   274	
   275	  try {
   276	    const envelope = JSON.parse(firstEntry.text) as Record<string, unknown>;
   277	    const summary = typeof envelope.summary === 'string' ? envelope.summary : null;
   278	    const data = envelope.data && typeof envelope.data === 'object'
   279	      ? envelope.data as Record<string, unknown>
   280	      : null;
   281	    const hints = Array.isArray(envelope.hints)
   282	      ? envelope.hints.filter((hint): hint is string => typeof hint === 'string')
   283	      : [];
   284	
   285	    if (!summary || !data) {
   286	      return null;
   287	    }
   288	
   289	    return { summary, data, hints };
   290	  } catch {
   291	    return null;
   292	  }
   293	}
   294	
   295	function parseResponseEnvelope(
   296	  response: MCPResponse,
   297	): { firstEntry: { type: 'text'; text: string }; envelope: Record<string, unknown> } | null {
   298	  const firstEntry = response?.content?.[0];
   299	  if (!firstEntry || firstEntry.type !== 'text' || typeof firstEntry.text !== 'string') {
   300	    return null;
   301	  }
   302	
   303	  try {
   304	    return {
   305	      firstEntry,
   306	      envelope: JSON.parse(firstEntry.text) as Record<string, unknown>,
   307	    };
   308	  } catch {
   309	    return null;
   310	  }
   311	}
   312	
   313	function replaceResponseEnvelope(
   314	  response: MCPResponse,
   315	  firstEntry: { type: 'text'; text: string },
   316	  envelope: Record<string, unknown>,
   317	): MCPResponse {
   318	  return {
   319	    ...response,
   320	    content: [{ ...firstEntry, text: JSON.stringify(envelope, null, 2) }],

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts | sed -n '1,340p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Stage2 Fusion
     3	// ───────────────────────────────────────────────────────────────
     4	// the rollout (R6): 4-Stage Retrieval Pipeline
     5	//
     6	// I/O CONTRACT:
     7	// Input:  Stage2Input { candidates: PipelineRow[], config, stage1Metadata }
     8	// Output: Stage2Output { scored: PipelineRow[], metadata }
     9	// Key invariants:
    10	//     - Every score modification in the pipeline happens exactly once here
    11	//     - Intent weights are NEVER applied to hybrid results (G2 double-weighting guard)
    12	//     - scored is sorted descending by effective composite score on exit
    13	// Side effects:
    14	//     - FSRS write-back to memory_index (when trackAccess=true) — DB write
    15	//     - Learned trigger and negative-feedback reads from DB
    16	//
    17	// PURPOSE: Single point for ALL scoring signals. Intent weights are
    18	// Applied ONCE here only — this is the architectural guard against
    19	// The G2 double-weighting recurrence bug.
    20	//
    21	// SIGNAL APPLICATION ORDER (must not be reordered — 13 steps):
    22	// 1.  Session boost           — working-memory attention amplification
    23	// 1a. Recency fusion          — time-decay bonus for recent memories
    24	// 2.  Causal boost            — graph-traversal neighbor amplification
    25	// 2a. Co-activation spreading — spreading activation from top-N seeds
    26	// 2b. Community co-retrieval  — N2c inject community co-members
    27	// 2c. Graph signals           — N2a momentum + N2b causal depth
    28	// 3.  Testing effect          — FSRS strengthening write-back (trackAccess)
    29	// 4.  Intent weights          — non-hybrid search post-scoring adjustment
    30	// 5.  Artifact routing        — class-based weight boosts
    31	// 6.  Feedback signals        — learned trigger boosts + negative demotions
    32	// 7.  Artifact limiting       — result count cap from routing strategy
    33	// 8.  Anchor metadata         — extract named ANCHOR sections (annotation)
    34	// 9.  Validation metadata     — spec quality signals enrichment + quality scoring
    35	//
    36	// Hybrid search already applies intent-aware scoring
    37	// Internally (RRF / RSF fusion). Post-search intent weighting is
    38	// Therefore ONLY applied for non-hybrid search types (vector,
    39	// Multi-concept). Applying it to hybrid results would double-count.
    40	//
    41	// SCORE AUDIT CONTRACT: Stage 2 writes the fused `score` field (steps 1-7).
    42	// Stage 3 (rerank) MAY overwrite `score` with the reranked value and MUST
    43	// preserve the original in `stage2Score` for auditability (see F2.02 fix).
    44	// Stage 4 (filter) MUST NOT mutate any score fields — it is read-only.
    45	// The canonical reranker output is `rerankerScore`; `score` is synced to it
    46	// for downstream consumer compatibility.
    47	
    48	import type Database from 'better-sqlite3';
    49	import path from 'path';
    50	import { readFile } from 'fs/promises';
    51	
    52	import { resolveEffectiveScore } from './types.js';
    53	import type { Stage2Input, Stage2Output, PipelineRow, IntentWeightsConfig, ArtifactRoutingConfig } from './types.js';
    54	
    55	import * as sessionBoost from '../session-boost.js';
    56	import * as causalBoost from '../causal-boost.js';
    57	import {
    58	  isEnabled as isCoActivationEnabled,
    59	  spreadActivation,
    60	  getRelatedMemoryCounts,
    61	  resolveCoActivationBoostFactor,
    62	} from '../../cognitive/co-activation.js';
    63	import type { SpreadResult } from '../../cognitive/co-activation.js';
    64	import { ensureAdaptiveTables, getAdaptiveMode } from '../../cognitive/adaptive-ranking.js';
    65	import * as fsrsScheduler from '../../cognitive/fsrs-scheduler.js';
    66	import { queryLearnedTriggers } from '../learned-feedback.js';
    67	import { applyNegativeFeedback, getNegativeFeedbackStats } from '../../scoring/negative-feedback.js';
    68	import {
    69	  isNegativeFeedbackEnabled,
    70	  isCommunityDetectionEnabled,
    71	  isGraphCalibrationProfileEnabled,
    72	  isGraphSignalsEnabled,
    73	  isUsageRankingEnabled,
    74	  resolveGraphWalkRolloutState,
    75	  isLearnedStage2CombinerEnabled,
    76	  isResultProvenanceEnabled,
    77	} from '../search-flags.js';
    78	import { applyCalibrationProfile } from '../graph-calibration.js';
    79	import { shadowScore, extractFeatureVector, loadModel } from '@spec-kit/shared/ranking/learned-combiner';
    80	import type { LearnedModel } from '@spec-kit/shared/ranking/learned-combiner';
    81	import { addTraceEntry } from '@spec-kit/shared/contracts/retrieval-trace';
    82	import { requireDb } from '../../../utils/db-helpers.js';
    83	import { computeRecencyScore } from '../../scoring/folder-scoring.js';
    84	import { enrichResultsWithAnchorMetadata } from '../anchor-metadata.js';
    85	import { enrichResultsWithValidationMetadata } from '../validation-metadata.js';
    86	// B4: Stage 2b enrichment extracted for decomposition clarity
    87	import { executeStage2bEnrichment } from './stage2b-enrichment.js';
    88	import { applyCommunityBoost } from '../../graph/community-detection.js';
    89	import { applyGraphSignals } from '../../graph/graph-signals.js';
    90	import { computeUsageBoost } from '../../graph/usage-ranking-signal.js';
    91	import { ensureUsageColumn } from '../../graph/usage-tracking.js';
    92	import { isGraphUnifiedEnabled } from '../graph-flags.js';
    93	import { sortDeterministicRows } from './ranking-contract.js';
    94	
    95	// Feature catalog: 4-stage pipeline architecture
    96	// Feature catalog: MPAB chunk-to-memory aggregation
    97	
    98	
    99	// -- Internal type aliases --
   100	
   101	/** A row with a resolved numeric base score for internal use. */
   102	interface ScoredRow extends PipelineRow {
   103	  intentAdjustedScore?: number;
   104	}
   105	
   106	/** Result of the strengthenOnAccess FSRS write-back. */
   107	interface StrengthenResult {
   108	  stability: number;
   109	  difficulty: number;
   110	}
   111	
   112	interface ValidationMetadataLike {
   113	  qualityScore?: number;
   114	  specLevel?: number;
   115	  completionStatus?: 'complete' | 'partial' | 'unknown';
   116	  hasChecklist?: boolean;
   117	}
   118	
   119	// -- Constants --
   120	
   121	/** Number of top results used as seeds for co-activation spreading. */
   122	const SPREAD_ACTIVATION_TOP_N = 5;
   123	const DEFAULT_LEARNED_STAGE2_MODEL_RELATIVE_PATH = path.join('models', 'learned-stage2-combiner.json');
   124	
   125	/** Recency fusion weight — controls how much recency score contributes to the fused score.
   126	 *  Env-tunable via SPECKIT_RECENCY_FUSION_WEIGHT (default 0.07). */
   127	const RECENCY_FUSION_WEIGHT = parseFloat(process.env.SPECKIT_RECENCY_FUSION_WEIGHT || '') || 0.07;
   128	
   129	/** Recency fusion cap — maximum bonus a candidate can receive from recency fusion.
   130	 *  Env-tunable via SPECKIT_RECENCY_FUSION_CAP (default 0.10). */
   131	const RECENCY_FUSION_CAP = parseFloat(process.env.SPECKIT_RECENCY_FUSION_CAP || '') || 0.10;
   132	
   133	const MIN_VALIDATION_MULTIPLIER = 0.8;
   134	const MAX_VALIDATION_MULTIPLIER = 1.2;
   135	
   136	type LearnedStage2ModelCacheEntry = {
   137	  path: string;
   138	  model: LearnedModel | null;
   139	};
   140	
   141	let cachedLearnedStage2Model: LearnedStage2ModelCacheEntry | null = null;
   142	let learnedStage2ModelLoadPromise: Promise<LearnedStage2ModelCacheEntry> | null = null;
   143	let learnedStage2ModelLoadPromisePath: string | null = null;
   144	
   145	function clampMultiplier(value: number): number {
   146	  if (!Number.isFinite(value)) return 1;
   147	  if (value < MIN_VALIDATION_MULTIPLIER) return MIN_VALIDATION_MULTIPLIER;
   148	  if (value > MAX_VALIDATION_MULTIPLIER) return MAX_VALIDATION_MULTIPLIER;
   149	  return value;
   150	}
   151	
   152	function isShadowLearningModelLoadEnabled(): boolean {
   153	  return process.env.SPECKIT_SHADOW_LEARNING?.toLowerCase().trim() === 'true';
   154	}
   155	
   156	function resolveLearnedStage2ModelPath(): string {
   157	  const configured = process.env.SPECKIT_LEARNED_STAGE2_MODEL?.trim();
   158	  if (!configured) {
   159	    return path.resolve(process.cwd(), DEFAULT_LEARNED_STAGE2_MODEL_RELATIVE_PATH);
   160	  }
   161	  if (path.isAbsolute(configured)) {
   162	    return configured;
   163	  }
   164	  return path.resolve(process.cwd(), configured);
   165	}
   166	
   167	async function loadPersistedLearnedStage2Model(): Promise<LearnedModel | null> {
   168	  if (!isShadowLearningModelLoadEnabled()) {
   169	    return null;
   170	  }
   171	
   172	  const modelPath = resolveLearnedStage2ModelPath();
   173	  if (cachedLearnedStage2Model?.path === modelPath) {
   174	    return cachedLearnedStage2Model.model;
   175	  }
   176	
   177	  if (learnedStage2ModelLoadPromise && learnedStage2ModelLoadPromisePath === modelPath) {
   178	    return (await learnedStage2ModelLoadPromise).model;
   179	  }
   180	
   181	  if (learnedStage2ModelLoadPromisePath !== modelPath) {
   182	    learnedStage2ModelLoadPromise = null;
   183	    learnedStage2ModelLoadPromisePath = null;
   184	  }
   185	
   186	  learnedStage2ModelLoadPromisePath = modelPath;
   187	  learnedStage2ModelLoadPromise = (async (): Promise<LearnedStage2ModelCacheEntry> => {
   188	    try {
   189	      const json = await readFile(modelPath, 'utf8');
   190	      const model = loadModel(json);
   191	      if (!model) {
   192	        console.warn(`[stage2-fusion] learned stage2 model at ${modelPath} is invalid; shadow scoring will use manual-only fallback`);
   193	      }
   194	      const entry = { path: modelPath, model };
   195	      cachedLearnedStage2Model = entry;
   196	      return entry;
   197	    } catch (err: unknown) {
   198	      const entry = { path: modelPath, model: null };
   199	      cachedLearnedStage2Model = entry;
   200	
   201	      const code = typeof err === 'object' && err !== null && 'code' in err
   202	        ? String((err as { code?: unknown }).code)
   203	        : '';
   204	      if (code !== 'ENOENT') {
   205	        const message = err instanceof Error ? err.message : String(err);
   206	        console.warn(`[stage2-fusion] learned stage2 model load failed: ${message}`);
   207	      }
   208	      return entry;
   209	    } finally {
   210	      learnedStage2ModelLoadPromise = null;
   211	      learnedStage2ModelLoadPromisePath = null;
   212	    }
   213	  })();
   214	
   215	  return (await learnedStage2ModelLoadPromise).model;
   216	}
   217	
   218	/**
   219	 * Apply validation-signal scoring at the Stage 2 single scoring point.
   220	 *
   221	 * Uses quality metadata extracted from spec artifacts to apply a bounded
   222	 * multiplier over the current composite score. This keeps S3 integrated
   223	 * in ranking while preserving score stability.
   224	 */
   225	function applyValidationSignalScoring(results: PipelineRow[]): PipelineRow[] {
   226	  if (!Array.isArray(results) || results.length === 0) return results;
   227	
   228	  const adjusted = results.map((row) => {
   229	    const metadata = row.validationMetadata as ValidationMetadataLike | undefined;
   230	    if (!metadata || typeof metadata !== 'object') return row;
   231	
   232	    const baseScore = resolveBaseScore(row);
   233	    const quality = typeof metadata.qualityScore === 'number' && Number.isFinite(metadata.qualityScore)
   234	      ? Math.max(0, Math.min(1, metadata.qualityScore))
   235	      : 0.5;
   236	
   237	    const qualityFactor = 0.9 + (quality * 0.2); // [0.9, 1.1]
   238	    const specLevelBonus = typeof metadata.specLevel === 'number' && Number.isFinite(metadata.specLevel)
   239	      ? Math.max(0, Math.min(0.06, (metadata.specLevel - 1) * 0.02))
   240	      : 0;
   241	
   242	    const completionBonus = metadata.completionStatus === 'complete'
   243	      ? 0.04
   244	      : metadata.completionStatus === 'partial'
   245	        ? 0.015
   246	        : 0;
   247	
   248	    const checklistBonus = metadata.hasChecklist ? 0.01 : 0;
   249	    const multiplier = clampMultiplier(qualityFactor + specLevelBonus + completionBonus + checklistBonus);
   250	    const scored = Math.min(1, Math.max(0, baseScore * multiplier));
   251	
   252	    if (scored === baseScore) return row;
   253	    return withSyncedScoreAliases(row, scored);
   254	  });
   255	
   256	  return sortDeterministicRows(adjusted as Array<PipelineRow & { id: number }>);
   257	}
   258	
   259	// -- Internal helpers --
   260	
   261	/**
   262	 * Replaced with shared resolveEffectiveScore()
   263	 * from types.ts. The shared function uses the correct fallback chain:
   264	 * intentAdjustedScore → rrfScore → score → similarity/100, all clamped to [0,1].
   265	 * This alias ensures all call sites use the shared implementation.
   266	 */
   267	const resolveBaseScore = resolveEffectiveScore;
   268	
   269	function withSyncedScoreAliases(row: PipelineRow, score: number): PipelineRow {
   270	  // F2.03 fix: Clamp to [0,1] so downstream consumers never see raw boosted values > 1.
   271	  const clamped = Math.max(0, Math.min(1, score));
   272	  return {
   273	    ...row,
   274	    score: clamped,
   275	    rrfScore: clamped,
   276	    intentAdjustedScore: clamped,
   277	    // Preserve attentionScore — it is set by the attention-decay module and
   278	    // must not be overwritten with the fusion/ranking score.
   279	  };
   280	}
   281	
   282	function syncScoreAliasesInPlace(rows: PipelineRow[]): void {
   283	  for (const row of rows) {
   284	    if (typeof row.score !== 'number' || !Number.isFinite(row.score)) continue;
   285	    // F2.03 fix: Clamp to [0,1] during in-place sync.
   286	    const clamped = Math.max(0, Math.min(1, row.score));
   287	    row.score = clamped;
   288	    row.rrfScore = clamped;
   289	    row.intentAdjustedScore = clamped;
   290	    // Preserve attentionScore — it is set by the attention-decay module and
   291	    // must not be overwritten with the fusion/ranking score.
   292	  }
   293	}
   294	
   295	type GraphContributionKey = 'causalDelta' | 'coActivationDelta' | 'communityDelta' | 'graphSignalDelta';
   296	
   297	function withGraphContribution(
   298	  row: PipelineRow,
   299	  key: GraphContributionKey,
   300	  delta: number,
   301	  source: string,
   302	  injected: boolean = false,
   303	): PipelineRow {
   304	  const current = (row.graphContribution && typeof row.graphContribution === 'object')
   305	    ? row.graphContribution as Record<string, unknown>
   306	    : {};
   307	  const sources = Array.isArray(current.sources)
   308	    ? current.sources.filter((value): value is string => typeof value === 'string')
   309	    : [];
   310	  const nextSources = sources.includes(source) ? sources : [...sources, source];
   311	  const currentValue = typeof current[key] === 'number' && Number.isFinite(current[key]) ? current[key] : 0;
   312	  const totalDelta = ['causalDelta', 'coActivationDelta', 'communityDelta', 'graphSignalDelta']
   313	    .reduce((sum, field) => {
   314	      const existing = field === key ? currentValue + delta : current[field];
   315	      return sum + (typeof existing === 'number' && Number.isFinite(existing) ? existing : 0);
   316	    }, 0);
   317	  return {
   318	    ...row,
   319	    graphContribution: {
   320	      ...current,
   321	      [key]: currentValue + delta,
   322	      totalDelta,
   323	      sources: nextSources,
   324	      injected: current.injected === true || injected,
   325	    },
   326	  };
   327	}
   328	
   329	function countGraphContribution(rows: PipelineRow[], key: GraphContributionKey): number {
   330	  return rows.filter((row) => {
   331	    const graphContribution = row.graphContribution as Record<string, unknown> | undefined;
   332	    return typeof graphContribution?.[key] === 'number' && Math.abs(graphContribution[key] as number) > 0;
   333	  }).length;
   334	}
   335	
   336	function countGraphInjected(rows: PipelineRow[]): number {
   337	  return rows.filter((row) => {
   338	    const graphContribution = row.graphContribution as Record<string, unknown> | undefined;
   339	    return graphContribution?.injected === true;
   340	  }).length;

exec
/bin/zsh -lc 'cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main" --strict' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1414ms:

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
The first pass confirms the key asymmetry already: Modus tries to bridge semantic gaps before retrieval by expanding a lexical query, while Public treats semantic, lexical, graph, and session signals as separate evidence channels fused later. I’m now tracing the exact lane boundaries and fallback rules in our pipeline so the recommendations land on the right insertion point.
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc 'rg -n "sqlite-fts|semantic|vector|hybrid|RRF|reciprocal|fusion|dual retrieval|lexical|query expansion|multi-query|fts" .opencode/skill/system-spec-kit/mcp_server/lib/search .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:85:} from '../lib/search/sqlite-fts.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:86:import type { LexicalCapabilitySnapshot } from '../lib/search/sqlite-fts.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:100:// Feature catalog: Semantic and lexical search (memory_search)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:208:  mode?: string; // "deep" mode enables query expansion for multi-query RAG
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:362:  if (typeof data.lexicalPath !== 'string' && snapshot) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:363:    data.lexicalPath = snapshot.lexicalPath;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:482:/** Handle memory_search tool — performs hybrid vector/BM25 search with intent-aware ranking.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:777:        : 'hybrid',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:905:    const lexicalCapability = getLastLexicalCapabilitySnapshot();
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:906:    if (lexicalCapability) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:908:        `[memory-search] Lexical capability path '${lexicalCapability.lexicalPath}' (fallbackState: ${lexicalCapability.fallbackState})`
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:919:    if (lexicalCapability) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:920:      extraData.lexicalPath = lexicalCapability.lexicalPath;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:921:      extraData.fallbackState = lexicalCapability.fallbackState;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1234:        fusionMethod: 'rrf',
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:103:  /** RRF fusion score (0–1). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:4:// Combines vector, FTS, and BM25 search with fallback
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:10:import { fuseResultsMulti } from '@spec-kit/shared/algorithms/rrf-fusion';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:11:import { getAdaptiveWeights, isAdaptiveFusionEnabled } from '@spec-kit/shared/algorithms/adaptive-fusion';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:15:import { fts5Bm25Search } from './sqlite-fts.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:63:import type { FusionResult } from '@spec-kit/shared/algorithms/rrf-fusion';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:91:  /** Classified query intent for adaptive fusion weight selection (e.g. 'understand', 'fix_bug'). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:102:   * When true, stop after channel collection and return pre-fusion candidates.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:107:   * When true, return immediately after adaptive/RRF fusion so Stage 2/3 can
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:117:   * - `'vector'` — cosine similarity from sqlite-vec (normalized from 0-100 to 0-1)
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:119:   * - `'fts'` — FTS5 rank score (absolute value, min-max normalized per source group)
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:122:   * After hybrid merge, all source scores are min-max normalized to 0-1 within
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:138:/** Normalize a fused RRF result to the HybridSearchResult contract. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:141:  const primarySource = result.sources[0] ?? 'hybrid';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:218: * Raw RRF scores are typically small decimals (often <0.05), so a
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:234:/** Primary vector similarity floor for hybrid fallback passes (percentage units). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:236:/** Secondary vector similarity floor for adaptive retry passes (percentage units). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:238:/** Tier-2 vector similarity floor for quality-aware fallback (percentage units). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:260:let vectorSearchFn: VectorSearchFn | null = null;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:303: * Initialize hybrid search with database, vector search, and optional graph search dependencies.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:305: * @param vectorFn - Optional vector search function for semantic similarity.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:310:  vectorFn: VectorSearchFn | null = null,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:314:  vectorSearchFn = vectorFn;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:331:    console.warn('[hybrid-search] BM25 not enabled — returning empty bm25Search results');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:398:    console.warn(`[hybrid-search] BM25 search failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:425: * @returns True if the memory_fts table exists in the connected database.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:429:    console.warn('[hybrid-search] db not initialized — isFtsAvailable returning false');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:435:      SELECT name FROM sqlite_master WHERE type='table' AND name='memory_fts'
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:448: * @returns Array of FTS-scored results tagged with source 'fts'.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:450:function ftsSearch(
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:455:    console.warn('[hybrid-search] db not initialized or FTS unavailable — returning empty ftsSearch results');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:462:    // C138-P2: Delegate to weighted BM25 FTS5 search from sqlite-fts.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:463:    // Uses bm25(memory_fts, 10.0, 5.0, 2.0, 1.0) for per-column weighting
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:465:    // Filters: is_archived exclusion and spec_folder matching handled by fts5Bm25Search
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:466:    const bm25Results = fts5Bm25Search(db, query, { limit, specFolder, includeArchived });
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:471:      score: row.fts_score || 0,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:472:      source: 'fts',
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:476:    console.warn(`[hybrid-search] FTS search failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:493:  const ftsResults = ftsSearch(query, options);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:501:  for (const r of ftsResults) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:600:    source: typeof primary.source === 'string' ? primary.source : (sources[0] ?? 'hybrid'),
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:682:  const allowed = new Set<ChannelName>(['vector', 'fts', 'graph', 'degree']);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:688:  if (options.useVector === false) allowed.delete('vector');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:690:  if (options.useFts === false) allowed.delete('fts');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:707:    useVector: allowedChannels.has('vector'),
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:709:    useFts: allowedChannels.has('fts'),
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:742:  vectorEmbeddingCache: Map<number, Float32Array>;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:787:    : await hybridSearch(query, embedding, primaryOptions);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:809:      : await hybridSearch(query, embedding, retryOptions);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:829:      : await hybridSearch(query, embedding, retryOptions);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:848: * Run multi-channel hybrid search combining vector, FTS, BM25, and graph results with per-source normalization.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:849: * Prefer hybridSearchEnhanced() or searchWithFallback() instead. This function uses naive per-source
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:850: * min-max normalization which produces different orderings than the RRF pipeline in hybridSearchEnhanced().
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:853:async function hybridSearch(
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:872:  if (useVector && embedding && vectorSearchFn) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:874:      const vectorResults = vectorSearchFn(embedding, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:881:      for (const r of vectorResults) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:886:          source: 'vector',
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:891:      console.warn(`[hybrid-search] Vector search failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:897:    const ftsResults = ftsSearch(query, { limit, specFolder, includeArchived });
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:898:    results.push(...ftsResults);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:921:      console.warn(`[hybrid-search] Graph search failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:954:  // LIMITATION (P1-1): When a result appears in multiple sources (e.g., vector + fts),
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:973: * Enhanced hybrid search with RRF fusion.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:977:async function hybridSearchEnhanced(
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:991:  return hybridSearch(query, embedding, options);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1010:    const allPossibleChannels: ChannelName[] = ['vector', 'fts', 'bm25', 'graph', 'degree'];
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1053:    let semanticResults: Array<{ id: number | string; source: string; [key: string]: unknown }> = [];
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1054:    let ftsChannelResults: HybridSearchResult[] = [];
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1056:    const vectorEmbeddingCache = new Map<number, Float32Array>();
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1062:    if (activeChannels.has('vector') && embedding && vectorSearchFn) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1064:        const vectorResults = vectorSearchFn(embedding, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1072:        semanticResults = vectorResults.map((r: Record<string, unknown>): { id: number | string; source: string; [key: string]: unknown } => ({
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1075:          source: 'vector',
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1077:        for (const result of semanticResults) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1084:            vectorEmbeddingCache.set(result.id, embeddingCandidate);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1087:        lists.push({ source: 'vector', results: semanticResults, weight: 1.0 });
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1089:        // Non-critical — vector channel failure does not block pipeline
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1090:        console.warn('[hybrid-search] Channel error:', _err instanceof Error ? _err.message : String(_err));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1094:    // FTS channel (internal error handling in ftsSearch) — gated by query-complexity routing
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1095:    if (activeChannels.has('fts')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1096:      ftsChannelResults = ftsSearch(query, options);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1097:      if (ftsChannelResults.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1099:        // flooding top-K with noisy lexical matches despite its exact-match value.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1100:        lists.push({ source: 'fts', results: ftsChannelResults, weight: 0.3 });
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1108:        // BM25 weight 0.6 is lowest lexical channel — in-memory BM25 index
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1133:        console.warn('[hybrid-search] Channel error:', _err instanceof Error ? _err.message : String(_err));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1177:        console.warn('[hybrid-search] Channel error:', _err instanceof Error ? _err.message : String(_err));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1183:      ...ftsChannelResults,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1195:        vectorEmbeddingCache,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1221:    // C138/T315: Build weighted fusion lists once from lightweight adaptive
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1222:    // weights, avoiding the heavier hybridAdaptiveFuse() standard-first path.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1225:    const fusionWeights = adaptiveEnabled
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1227:      : { semanticWeight: 1.0, keywordWeight: 1.0, recencyWeight: 0 };
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1228:    const { semanticWeight, keywordWeight, graphWeight: adaptiveGraphWeight } = fusionWeights;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1233:    const fusionLists = lists
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1234:      .filter((list) => list.source !== 'fts' && list.source !== 'bm25')
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1236:        if (list.source === 'vector') {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1237:          return { ...list, weight: semanticWeight };
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1246:      fusionLists.push({
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1253:    const fused = fuseResultsMulti(fusionLists);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1273:      vectorEmbeddingCache,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1278:    console.warn(`[hybrid-search] Enhanced search failed, falling back: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1296:    vectorEmbeddingCache,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1301:  // -- Aggregation stage: MPAB chunk-to-memory aggregation (after fusion, before state filter) --
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1337:      console.error('[hybrid-search] MPAB error (non-fatal):', msg);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1343:  // In the top-k window. Prevents single-channel dominance in fusion output.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1360:      fusedHybridResults.map(r => ({ ...r, source: r.source || 'hybrid' })),
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1375:    console.warn('[hybrid-search] channel enforcement failed:', err instanceof Error ? err.message : String(err));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1385:  // Reuse embeddings already returned by the vector channel when present and
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1390:  // Preserve cross-encoder gate semantics: when SPECKIT_CROSS_ENCODER=false, skip reranking.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1405:        const embeddingMap = new Map<number, Float32Array>(vectorEmbeddingCache);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1441:          // rows that have embeddings. Non-embedded rows (lexical-only hits,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1459:              source: 'vector',
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1469:        console.warn(`[hybrid-search] MMR embedding retrieval failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1501:      console.warn('[hybrid-search] co-activation enrichment failed:', err instanceof Error ? err.message : String(err));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1555:      console.warn('[hybrid-search] confidence truncation failed:', err instanceof Error ? err.message : String(err));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1623:      queryId: `hybrid-${Date.now()}`,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1676: * immediately after intra-query fusion and before downstream aggregation,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1680: * @param embedding - Optional embedding vector for semantic search.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1710:  if (allowedChannels.has('fts')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1711:    const ftsFallback = collectCandidatesFromLists(
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1712:      [{ source: 'fts', results: ftsSearch(query, options) }],
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1715:    if (ftsFallback.length > 0) return ftsFallback;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1726:  console.warn('[hybrid-search] Raw candidate collection returned empty results');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1737: * @param embedding - Optional embedding vector for semantic search.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1753:  // P3-03 FIX: Use hybridSearchEnhanced (with RRF fusion) instead of
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1754:  // The naive hybridSearch that merges raw scores
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1771:  if (allowedChannels.has('fts')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1772:    const ftsResults = ftsSearch(query, options);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1773:    if (ftsResults.length > 0) return ftsResults;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1782:  console.warn('[hybrid-search] All search methods returned empty results');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1800:    console.warn('[hybrid-search] db not initialized — returning empty structuralSearch results');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1855:    console.warn(`[hybrid-search] Structural search failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2014: * Prevents structural placeholders from outranking stronger semantic/lexical hits.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2103: * TIER 1: hybridSearchEnhanced at minSimilarity=30
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2106: * TIER 2: hybridSearchEnhanced at minSimilarity=10, all allowed channels forced
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2115: * @param embedding - Optional embedding vector for semantic search.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2147:  console.error(`[hybrid-search] Tier 1→2 degradation: ${tier1Trigger.reason} (topScore=${tier1Trigger.topScore.toFixed(3)}, count=${tier1Trigger.resultCount})`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2174:  console.error(`[hybrid-search] Tier 2→3 degradation: ${tier2Trigger.reason} (topScore=${tier2Trigger.topScore.toFixed(3)}, count=${tier2Trigger.resultCount})`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2282:    'combined_lexical_score',
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2390:      `[hybrid-search] Token budget overflow (single-result fallback): ` +
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2427:      `[hybrid-search] Token budget overflow (top-result fallback): ` +
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2444:    `[hybrid-search] Token budget overflow: ${totalTokens} tokens > ${effectiveBudget} budget, ` +
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2472:  ftsSearch,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2473:  hybridSearch,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2474:  hybridSearchEnhanced,
.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:62: * double-counting in the fusion pipeline.
.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts:20:// Integration point: called at the end of Stage 2 fusion, after
.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts:39:   * The semantic type extracted from the anchor ID.
.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts:69: * Derive the semantic type from an anchor ID.
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:8: * assumed normalized [0,1] scores, but raw RRF scores (~0.01-0.03) never exceeded that
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:9: * threshold, causing channel-representation promotion to silently reject ALL RRF results.
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:11: * compatible with both raw RRF scores and normalized [0,1] scores. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:64: * Analyse a post-fusion top-k result set and, when the feature flag is
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:77: * @param topK              - Ordered top-k results from RRF fusion.
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:25:/** Common English stop words for semantic complexity heuristic */
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:26: * Compute cosine similarity between two vectors.
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:95: * @param embeddingFn - Async function to compute embedding vector
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:157: * @param queryEmbedding - Query vector to compare against stored summaries
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:282: * @returns Normalized Float32Array embedding vector
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:295: * Build one centroid vector per intent from seed phrases and keywords.
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:297: * @returns Map of intent types to their centroid embedding vectors
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:332: * L2-normalize a vector in place.
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:334: * @param vec - Float32Array vector to normalize
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:335: * @returns The same vector, normalized to unit length
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:351: * Dot product similarity for normalized vectors.
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:353: * @param a - First vector
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:354: * @param b - Second vector
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:355: * @returns Dot product (cosine similarity for unit vectors)
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:4:// Feature catalog: Semantic and lexical search (memory_search)
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:6:// Extracted from hybrid-search.ts ftsSearch() for independent
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:18:  fts_score: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:28:type LexicalPath = 'fts5' | 'like' | 'unavailable';
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:33:  | 'no_such_module_fts5'
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:37:  lexicalPath: LexicalPath;
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:84:  return toErrorMessage(error).toLowerCase().includes('no such module: fts5');
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:101:        lexicalPath: 'unavailable',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:107:      lexicalPath: 'unavailable',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:114:      `SELECT name FROM sqlite_master WHERE type='table' AND name='memory_fts'`
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:119:        lexicalPath: 'unavailable',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:126:        lexicalPath: 'unavailable',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:127:        fallbackState: 'no_such_module_fts5',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:131:      lexicalPath: 'unavailable',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:137:    lexicalPath: 'fts5',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:147: * Execute a weighted BM25 FTS5 search against memory_fts.
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:159: * const rows = fts5Bm25Search(db, 'memory search', { limit: 10 });
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:162:function fts5Bm25Search(
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:170:  const tokens = normalizeLexicalQueryTokens(query).fts;
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:197:    SELECT m.*, -bm25(memory_fts, ${w0}, ${w1}, ${w2}, ${w3}) AS fts_score
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:198:    FROM memory_fts
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:199:    JOIN memory_index m ON m.id = memory_fts.rowid
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:200:    WHERE memory_fts MATCH ?
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:204:    ORDER BY fts_score DESC
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:211:    console.warn(`[sqlite-fts] FTS5 unavailable (${capability.fallbackState}); returning empty lexical lane results`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:223:      fts_score: (row.fts_score as number) || 0,
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:226:      lexicalPath: 'fts5',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:234:          lexicalPath: 'unavailable',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:235:          fallbackState: 'no_such_module_fts5',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:239:            lexicalPath: 'unavailable',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:242:        : msg.toLowerCase().includes('no such table: memory_fts')
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:244:              lexicalPath: 'unavailable',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:248:              lexicalPath: 'unavailable',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:252:    console.warn(`[sqlite-fts] BM25 FTS5 search failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:258: * Check if the memory_fts FTS5 virtual table exists in the database.
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:260: * Used as a feature-detect before calling fts5Bm25Search, since FTS5
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:264: * @returns true if memory_fts exists and is queryable
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:268: *   fts5Bm25Search(db, 'memory');
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:282:  fts5Bm25Search,
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:23:/** Channel names matching SOURCE_TYPES in rrf-fusion.ts */
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:24:type ChannelName = 'vector' | 'fts' | 'bm25' | 'graph' | 'degree';
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:41:const ALL_CHANNELS: readonly ChannelName[] = ['vector', 'fts', 'bm25', 'graph', 'degree'] as const;
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:47:const FALLBACK_CHANNELS: readonly ChannelName[] = ['vector', 'fts'] as const;
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:64: * - simple:   2 channels (vector + fts) — fastest path
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:65: * - moderate: 3 channels (vector + fts + bm25) — balanced
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:69:  simple: ['vector', 'fts'],
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:70:  moderate: ['vector', 'fts', 'bm25'],
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:71:  complex: ['vector', 'fts', 'bm25', 'graph', 'degree'],
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:81: * fallback channels (vector, fts) until the minimum is met.
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:16:   * Higher = better lexical match. Not directly comparable to vector similarity
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:17:   * scores; use min-max normalization or RRF when combining with other methods.
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:51: * These weights are consumed by the FTS5 path in sqlite-fts.ts,
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:530: * @returns Sanitized query tokens safe to reuse for lexical search paths.
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:533: * sanitizeQueryTokens('title:memory AND vector');
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:534: * // ['title', 'memory', 'vector']
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:561:  fts: string[];
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:573:    fts: [...sharedTokens, ...phraseToken],
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-types.ts:5: * Function signature for graph-based lexical search helpers.
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts:90: *   - Parenthetical abbreviations: "Reciprocal Rank Fusion (RRF)" → "RRF"
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts:91: *   - Parenthetical definitions: "RRF (Reciprocal Rank Fusion)" → "Reciprocal Rank Fusion"
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:8:// Stage 2 fusion. Two tiers:
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:17://     "summary": "Ranked first because semantic, reranker, decision-anchor agreed",
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:18://     "topSignals": ["semantic_match", "anchor:decisions"],
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:19://     "channelContribution": { "vector": 0.44, "fts": 0.12, "graph": 0.06 }
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:32:  | 'semantic_match'
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:33:  | 'lexical_match'
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:45:  vector: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:46:  fts: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:95:    signals.push('semantic_match');
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:103:  if (channelAttribution.includes('fts') || channelAttribution.includes('bm25')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:104:    signals.push('lexical_match');
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:173: * Prioritises: semantic/lexical first, then boosts, then meta.
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:204:    if (signal === 'semantic_match') return 'semantic similarity';
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:205:    if (signal === 'lexical_match') return 'keyword match';
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:232: * distribute the effective score across vector, fts, and graph channels.
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:240:  const vectorScore = typeof row.vectorScore === 'number' && Number.isFinite(row.vectorScore)
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:241:    ? Math.max(0, Math.min(1, row.vectorScore))
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:243:  const ftsScore = typeof row.ftsScore === 'number' && Number.isFinite(row.ftsScore)
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:244:    ? Math.max(0, Math.min(1, row.ftsScore))
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:254:  if (vectorScore !== null && ftsScore !== null) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:258:      vector: Math.round(vectorScore * 100) / 100,
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:259:      fts: Math.round(ftsScore * 100) / 100,
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:268:  const hasFTS = channelAttribution.includes('fts') || channelAttribution.includes('bm25');
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:275:      vector: Math.round(remaining * 0.75 * 100) / 100,
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:276:      fts: Math.round(remaining * 0.25 * 100) / 100,
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:283:      vector: Math.round(effectiveScore * 0.78 * 100) / 100,
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:284:      fts: Math.round(effectiveScore * 0.22 * 100) / 100,
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:292:      vector: Math.round((effectiveScore - graphShare) * 100) / 100,
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:293:      fts: 0,
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:299:  return { vector: Math.round(effectiveScore * 100) / 100, fts: 0, graph: 0 };
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-expander.ts:5:// Rule-based synonym expansion for mode="deep" multi-query RAG.
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-expander.ts:46:  embedding: ['vector', 'representation'],
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-expander.ts:55:  fusion: ['merge', 'combine'],
.opencode/skill/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts:7:// Parses folder paths like "system-spec-kit/140-hybrid-rag/006-sprint-5"
.opencode/skill/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts:75: * Parses folder paths like "system-spec-kit/140-hybrid-rag/006-sprint-5"
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:104:  'vector': 'embedding',
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:105:  'vectors': 'embedding',
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:142:  'semantic': 'search',
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:143:  'semantics': 'search',
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:171: * nounPhrases('How does vector search indexing work?');
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:172: * // ['vector', 'search', 'indexing', 'work']
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:374: * alias table to collect related search terms for query expansion.
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:6:// On RRF scores to detect low-confidence retrieval and inject
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:32: * Summarises Z-score statistics for the RRF score distribution.
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:39:  /** Arithmetic mean of all RRF scores. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:41:  /** Population standard deviation of all RRF scores. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:144: * Detect evidence gaps in an RRF score distribution.
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:35:/** Edge type weights for typed-degree computation (R4 5th RRF channel) */
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:54:/** Runtime fusion weight for the degree channel. Keep aligned with the boost cap. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:61:let ftsTableAvailabilityPerDb = new WeakMap<Database.Database, boolean>();
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:70:  const cached = ftsTableAvailabilityPerDb.get(database);
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:77:      `SELECT name FROM sqlite_master WHERE type='table' AND name='memory_fts'`
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:80:    ftsTableAvailabilityPerDb.set(database, available);
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:83:    ftsTableAvailabilityPerDb.set(database, false);
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:91: * Uses FTS5 full-text search (memory_fts table) instead of naive LIKE matching.
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:150: * FTS5-backed causal edge query. Finds memory IDs via the memory_fts
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:165:  // 1) Materialize matched memory rowids once (no OR join against memory_fts)
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:167:  // 3) Collapse duplicate edge hits in SQL (MAX fts_score per edge)
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:172:        -bm25(memory_fts, 10.0, 5.0, 2.0, 1.0) AS fts_score
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:173:      FROM memory_fts
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:174:      WHERE memory_fts MATCH ?
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:175:      ORDER BY fts_score DESC
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:179:      SELECT ce.id, ce.source_id, ce.target_id, ce.relation, ce.strength, mm.fts_score
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:183:      SELECT ce.id, ce.source_id, ce.target_id, ce.relation, ce.strength, mm.fts_score
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:194:        MAX(fts_score) AS fts_score
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:198:    SELECT id, source_id, target_id, relation, strength, fts_score
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:200:    ORDER BY (strength * fts_score) DESC
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:206:  ) as Array<CausalEdgeRow & { fts_score: number }>;
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:209:  // Numeric IDs matching memory_index.id (INTEGER column) in the hybrid search
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:216:    const ftsScore = typeof row.fts_score === 'number' && Number.isFinite(row.fts_score)
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:217:      ? row.fts_score
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:219:    const score = edgeStrength * ftsScore;
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:228:        ftsScore,
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:243:        ftsScore,
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:634:  ftsTableAvailabilityPerDb = new WeakMap<Database.Database, boolean>();
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:640:  ftsTableAvailabilityPerDb.delete(database);
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:691:  // Typed-degree computation (R4 5th RRF channel)
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:84: * Multi-query expansion for deep-mode retrieval.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:150: * Channel minimum-representation promotion after fusion.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:259: * Temporal contiguity boost on raw Stage 1 vector results.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:521: * REQ-D1-003: Experimental per-intent RRF K selection.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:522: * Default: TRUE (graduated). Set SPECKIT_RRF_K_EXPERIMENTAL=false to disable.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:525:  return isFeatureEnabled('SPECKIT_RRF_K_EXPERIMENTAL');
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:589: * Phase B T016: Query concept expansion for hybrid search.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:4:// SCHEMA_VERSION is now canonical in vector-index-schema.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:8:/** Supported embedding input shapes for vector search and mutation operations. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:11:/** Stable error codes emitted by vector-index modules. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:23:/** Structured error used by vector-index query, mutation, and store helpers. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:75:/** Represents a vector-search memory row shared by query and store helpers. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:132:/** Controls vector search filtering and ranking behavior. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:168: * Converts an embedding vector into a binary buffer for sqlite-vec storage.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:232:// ValidateEmbeddingDimension are exported from vector-index-store.ts (canonical)
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:399:    // Do NOT touch memory_fts or any FTS5 table (Safeguard #1).
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:4:// Split from vector-index-store.ts — contains ALL schema creation,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:18:} from './vector-index-types.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:426:/** Current schema version for vector-index migrations. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:519:              'procedural', 'semantic', 'autobiographical', 'meta-cognitive'
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:595:          CREATE INDEX IF NOT EXISTS idx_fts_fallback
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:599:        logger.info('Migration v7: Created idx_fts_fallback index for deferred indexing');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:601:        console.warn('[VectorIndex] Migration v7 warning (idx_fts_fallback):', get_error_message(e));
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:747:        database.exec('DROP TRIGGER IF EXISTS memory_fts_insert');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:748:        database.exec('DROP TRIGGER IF EXISTS memory_fts_update');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:749:        database.exec('DROP TRIGGER IF EXISTS memory_fts_delete');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:751:        database.exec('DROP TABLE IF EXISTS memory_fts');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:753:          CREATE VIRTUAL TABLE memory_fts USING fts5(
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:760:          CREATE TRIGGER memory_fts_insert AFTER INSERT ON memory_index BEGIN
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:761:            INSERT INTO memory_fts(rowid, title, trigger_phrases, file_path, content_text)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:766:          CREATE TRIGGER memory_fts_update AFTER UPDATE ON memory_index BEGIN
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:767:            INSERT INTO memory_fts(memory_fts, rowid, title, trigger_phrases, file_path, content_text)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:769:            INSERT INTO memory_fts(rowid, title, trigger_phrases, file_path, content_text)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:774:          CREATE TRIGGER memory_fts_delete AFTER DELETE ON memory_index BEGIN
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:775:            INSERT INTO memory_fts(memory_fts, rowid, title, trigger_phrases, file_path, content_text)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:823:          database.exec("INSERT INTO memory_fts(memory_fts) VALUES('rebuild')");
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1688:      console.warn('[vector-index] Migration: Added confidence column');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1700:      console.warn('[vector-index] Migration: Added validation_count column');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1712:      console.warn('[vector-index] Migration: Added importance_tier column');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1721:      console.warn('[vector-index] Migration: Created idx_importance_tier index');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1732:      console.warn('[vector-index] Migration: Added context_type column');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1744:      console.warn('[vector-index] Migration: Added content_hash column');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1756:      console.warn('[vector-index] Migration: Added channel column');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1768:      console.warn('[vector-index] Migration: Added session_id column');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1780:      console.warn('[vector-index] Migration: Added base_importance column');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1792:      console.warn('[vector-index] Migration: Added decay_half_life_days column');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1804:      console.warn('[vector-index] Migration: Added is_pinned column');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1816:      console.warn('[vector-index] Migration: Added last_accessed column');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1828:      console.warn('[vector-index] Migration: Added expires_at column');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1840:      console.warn('[vector-index] Migration: Added related_memories column');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1852:      console.warn('[vector-index] Migration: Added stability column (FSRS)');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1864:      console.warn('[vector-index] Migration: Added difficulty column (FSRS)');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1876:      console.warn('[vector-index] Migration: Added last_review column (FSRS)');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1888:      console.warn('[vector-index] Migration: Added review_count column (FSRS)');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1910:      console.warn('[vector-index] Migration: Added canonical_file_path column');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1929:    console.warn('[vector-index] Canonical path index warning:', get_error_message(e));
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1996: * Creates common indexes used by vector-index queries.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2005:    console.warn('[vector-index] Failed to create index', {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2022:    console.warn('[vector-index] Failed to create canonical path indexes', {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2039:    console.warn('[vector-index] Failed to create index', {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2050:    console.warn('[vector-index] Failed to create index', {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2061:    console.warn('[vector-index] Failed to create index', {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2079:    console.warn('[vector-index] Failed to create idx_trigger_cache_source', {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2090:    console.warn('[vector-index] Failed to create idx_spec_folder_created_at', {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2103:      console.warn('[vector-index] Failed to create idx_history_timestamp:', get_error_message(err));
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2259: * Creates or upgrades the vector-index schema.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2384:    CREATE VIRTUAL TABLE IF NOT EXISTS memory_fts USING fts5(
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2392:    CREATE TRIGGER IF NOT EXISTS memory_fts_insert AFTER INSERT ON memory_index BEGIN
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2393:      INSERT INTO memory_fts(rowid, title, trigger_phrases, file_path, content_text)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2399:    CREATE TRIGGER IF NOT EXISTS memory_fts_update AFTER UPDATE ON memory_index BEGIN
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2400:      INSERT INTO memory_fts(memory_fts, rowid, title, trigger_phrases, file_path, content_text)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2402:      INSERT INTO memory_fts(rowid, title, trigger_phrases, file_path, content_text)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2408:    CREATE TRIGGER IF NOT EXISTS memory_fts_delete AFTER DELETE ON memory_index BEGIN
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2409:      INSERT INTO memory_fts(memory_fts, rowid, title, trigger_phrases, file_path, content_text)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2479:  console.warn('[vector-index] Schema created successfully');
.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:24:import { fts5Bm25Search } from './sqlite-fts.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:110:    const rawResults = fts5Bm25Search(db, query, { limit });
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:13:} from './vector-index-types.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:20:} from './vector-index-types.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:38:} from './vector-index-schema.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:56:} from './vector-index-mutations.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:63:  vector_search,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:72:  vector_search_enriched,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:88:  vectorSearch,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:97:  vectorSearchEnriched,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:108:} from './vector-index-queries.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:126:} from './vector-index-aliases.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:154:  is_vector_search_available,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:161:} from './vector-index-store.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:165:  isVectorSearchAvailable as is_vector_search_available_alias,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:166:} from './vector-index-store.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:6:// TypeScript port of the vector index implementation.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:26:import { IVectorStore } from '../interfaces/vector-store.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:35:} from './vector-index-types.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:39:} from './vector-index-schema.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:46:} from './vector-index-types.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:82:/** Loaded search weight configuration for vector-index ranking (lazy-loaded). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:100:let _cached_queries: Awaited<typeof import('./vector-index-queries.js')> | null = null;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:101:let _cached_mutations: Awaited<typeof import('./vector-index-mutations.js')> | null = null;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:102:let _cached_aliases: Awaited<typeof import('./vector-index-aliases.js')> | null = null;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:105:  return _cached_queries ??= await import('./vector-index-queries.js');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:109:  return _cached_mutations ??= await import('./vector-index-mutations.js');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:113:  return _cached_aliases ??= await import('./vector-index-aliases.js');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:120:/** Default embedding dimension used by the vector index. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:145:  console.warn('[vector-index] Using default dimension 768 after timeout');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:222:    reason: 'No stored vector dimension found for existing schema',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:248:      const warning = `EMBEDDING DIMENSION MISMATCH: Existing database stores ${existing.stored_dim}-dim vectors (${source_label}), ` +
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:249:        `but the active embedding configuration resolves to ${current_dim}. Refusing to bootstrap because vector search would fail. ` +
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:252:      console.error(`[vector-index] WARNING: ${warning}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:258:    console.warn('[vector-index] Dimension validation error:', get_error_message(e));
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:264: * Validates that stored vector dimensions match the provider.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:280:/** Default path for the vector-index database file. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:327:      console.warn(`[vector-index] Could not read file ${valid_path}: ${get_error_message(err)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:360:        console.warn('[vector-index] Blocked potential prototype pollution in JSON');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:367:    console.warn(`[vector-index] JSON parse error: ${get_error_message(err)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:413:        console.warn(`[vector-index] Database connection listener failed: ${get_error_message(error)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:425:    console.warn(`[vector-index] Could not set permissions on ${target_path}: ${get_error_message(err)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:499:    console.warn('[vector-index] Cache validation error:', get_error_message(e));
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:728:    console.warn(`[vector-index] interference score refresh failed for '${specFolder}': ${get_error_message(error)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:737: * Initializes the vector-index database connection.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:773:      console.error('[vector-index] FATAL: better-sqlite3 native module failed to load');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:774:      console.error(`[vector-index] ${errMsg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:775:      console.error(`[vector-index] Running: Node ${process.version} (MODULE_VERSION ${process.versions.modules})`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:780:          console.error(`[vector-index] Marker recorded: Node ${marker.nodeVersion} (MODULE_VERSION ${marker.moduleVersion})`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:785:      console.error('[vector-index] This usually means Node.js was updated without rebuilding native modules.');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:786:      console.error('[vector-index] Fix: Run \'bash scripts/setup/rebuild-native-modules.sh\' from the spec-kit root');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:787:      console.error('[vector-index] Or manually: npm rebuild better-sqlite3');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:797:    console.warn(`[vector-index] sqlite-vec extension not available: ${get_error_message(vec_error)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:798:    console.warn('[vector-index] Falling back to anchor-only mode (no vector search)');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:799:    console.warn('[vector-index] Install sqlite-vec: brew install sqlite-vec (macOS)');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:814:    console.error(`[vector-index] FATAL: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:825:    console.error(`[vector-index] FATAL: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:843: * Closes the shared vector-index database connection.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:860: * Gets the active vector-index database path.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:868: * Gets the shared vector-index database connection.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:875:// Check if vector search is available (sqlite-vec loaded)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:877: * Reports whether sqlite-vec vector search is available.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:878: * @returns True when vector search is available.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:880:export function is_vector_search_available(): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:888:/** Implements the vector-store interface on top of SQLite. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:945:    const { vector_search } = await getQueriesModule();
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:946:    return vector_search(embedding, search_options, database);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1084:    const { vector_search_enriched } = await getQueriesModule();
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1085:    return vector_search_enriched(embedding, undefined, options, database);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1114:    cleaned?: { vectors: number; chunks: number };
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1137:export { is_vector_search_available as isVectorSearchAvailable };
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:5:// Split from vector-index-store.ts — contains LRUCache, query caching,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:13:} from './vector-index-types.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:17:} from './vector-index-store.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:19:  vector_search,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:20:  vector_search_enriched,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:24:} from './vector-index-queries.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:199:// Cached version of vector_search_enriched with LRU cache
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:219:  const results = await vector_search_enriched(query, limit, options);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:276:    console.warn(`[vector-index] learn_from_selection query error: ${get_error_message(e)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:318:    console.warn(`[vector-index] learn_from_selection update error: ${get_error_message(e)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:342:      console.warn(`[vector-index] Could not generate embedding for memory ${new_memory_id}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:346:    const similar = vector_search(embedding, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:365:    console.warn(`[vector-index] Failed to link related memories for ${new_memory_id}: ${get_error_message(error)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:389:    console.warn(`[vector-index] Failed to record access for memory ${memory_id}: ${get_error_message(error)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:415:  const results = await vector_search_enriched(query, fetch_limit, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:429:    console.warn(`[vector-index] Enhanced search took ${elapsed}ms (target <600ms)`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/feedback-denylist.ts:9:   Common English words that carry no semantic signal.
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:23:/** Per-hop boost cap. 0.05 keeps causal nudge subtle relative to semantic scores (~0.5–1.0). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:232: * Intent priority lists may include upper-case semantic labels (e.g. 'CORRECTION').
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:6:// - vector-index-types.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:7:// - vector-index-schema.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:8:// - vector-index-mutations.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:9:// - vector-index-store.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:10:// - vector-index-queries.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:11:// - vector-index-aliases.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:14:export * from './vector-index.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:387: * This is a lightweight pre-filter, NOT a replacement for vector search.
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:40:  /** N2a cap for RRF fusion overflow prevention. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:42:  /** N2b cap for RRF fusion overflow prevention. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:118:  /** Current N2a fusion score. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:120:  /** Current N2b fusion score. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:3:description: "5-channel hybrid search architecture combining vector, lexical (BM25/FTS5), graph-based and structure-aware graph retrieval with Reciprocal Rank Fusion (RRF) and Adaptive Fusion."
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:6:  - "hybrid search"
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:7:  - "vector search"
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:12:> 5-channel hybrid search architecture combining vector, lexical (BM25/FTS5), graph-based and structure-aware graph retrieval, fused with Reciprocal Rank Fusion (RRF) and Adaptive Fusion.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:27:- [FTS CAPABILITY CASCADE FLOOR](#fts-capability-cascade-floor)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:39:The search subsystem provides production-grade hybrid search capabilities with multiple retrieval methods fused via RRF scoring. It handles query expansion, intent classification, typo tolerance and optional cross-encoder reranking.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:42:- **5-Channel Hybrid Search**: Vector (semantic) + BM25/FTS5 (lexical) + Graph (relationship-based) + Graph Structure (structural)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:43:- **RRF Score Fusion**: Industry-standard k=40 with convergence bonuses
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:45:- **Query Enhancement**: Fuzzy matching (Levenshtein) + acronym expansions (via hybrid-search.ts inline logic)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:63:RRF Fusion (k=40) + Adaptive Fusion -> Unified scores
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:75:`vector-index.ts` is the primary typed export surface for the vector index and re-exports the split schema, query, mutation, store and alias modules. `vector-index-impl.ts` is now a 14-line backward-compatibility shim that simply re-exports `vector-index.ts` for older import paths.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:93:| Vector | `vector-index.ts` | Semantic similarity via sqlite-vec through the split vector-index modules |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:95:| FTS5 | `sqlite-fts.ts` | SQLite FTS5 BM25 weighted scoring |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:101:**Stage 2 — Fusion + Signal Integration** (`stage2-fusion.ts`):
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:109:6. Intent weights — non-hybrid only (G2 double-weighting prevention: `isHybrid` boolean guard)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:128:### Reciprocal Rank Fusion (RRF)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:132:**Why RRF?**
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:133:- Parameter-free fusion (no weight tuning required)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:135:- Citation: Cormack et al. "RRF outperforms Condorcet" (SIGIR 2009)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:140:- **Adaptive Fusion**: Intent-aware weighted RRF with dark-run mode (feature flag `SPECKIT_ADAPTIVE_FUSION`)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:148:// RRF score = 1/(40+2) + 1/(40+5) + 1.5/(40+1)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:172:<a id="fts-capability-cascade-floor"></a>
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:175:Packet `026-graph-and-context-optimization/010-fts-capability-cascade-floor` freezes the lexical capability contract that packet `002-implement-cache-warning-hooks` now consumes. `memory_search` responses expose:
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:177:- `lexicalPath`: the lane that actually ran for lexical retrieval. Current packet-owned values are `fts5` and `unavailable`. The wider response schema also allows `like`, but packet `010` does not claim that lane for this runtime seam.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:182:| `fallbackState` | Meaning | `lexicalPath` |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:184:| `ok` | FTS5 compile probe passed, `memory_fts` exists, and BM25 ranking executed normally | `fts5` |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:185:| `compile_probe_miss` | `PRAGMA compile_options` does not report FTS5 support, so lexical work cannot run for this request | `unavailable` |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:186:| `missing_table` | FTS5 support is present, but `memory_fts` is missing at runtime | `unavailable` |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:187:| `no_such_module_fts5` | The SQLite engine rejects FTS5 usage with `no such module: fts5` | `unavailable` |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:190:The contract is intentionally narrow: preserve result-shape semantics, surface truthful lane metadata, and let later packets build on that truth instead of inferring capability from empty results or warning logs.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:246:| **TypeScript**       | `hybrid-search.ts`, `cross-encoder.ts`, `intent-classifier.ts`, `bm25-index.ts`             |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:247:| **TypeScript**       | `vector-index.ts` (typed export surface) + `vector-index-impl.ts` (14-line compatibility shim) |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:248:| **TypeScript**       | `reranker.ts` (local reranking utility); `rrf-fusion.ts`, `adaptive-fusion.ts`, `mmr-reranker.ts` relocated to `shared/algorithms/` |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:253:### Facade Pattern: vector-index
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:259:vector-index.ts          (166 LOC)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:262:    - vector-index-types.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:263:    - vector-index-schema.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:264:    - vector-index-mutations.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:265:    - vector-index-queries.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:266:    - vector-index-store.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:267:    - vector-index-aliases.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:270:vector-index-impl.ts     (14 LOC)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:272:  - Re-exports from './vector-index'
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:276:**NOTE**: Most vector-index logic now lives in the split `vector-index-*` modules. `vector-index-impl.ts` is only a compatibility adapter, so runtime changes should be made in `vector-index.ts` or the underlying split modules.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:282:| `vector-index.ts`          | 166    | TypeScript | Typed export surface re-exporting the split vector-index modules |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:283:| `vector-index-impl.ts`     | 14     | TypeScript | Backward-compatibility shim that re-exports `vector-index.ts` |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:284:| `vector-index-types.ts`    | -      | TypeScript | Shared type definitions for vector index modules    |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:285:| `vector-index-schema.ts`   | -      | TypeScript | Schema creation and migration logic                 |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:286:| `vector-index-mutations.ts`| -      | TypeScript | Insert, update, and delete operations for vector index |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:287:| `vector-index-queries.ts`  | -      | TypeScript | Query builders and search operations for vector index |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:288:| `vector-index-aliases.ts`  | -      | TypeScript | Re-export aliases for backward-compatible imports   |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:289:| `vector-index-store.ts`    | -      | TypeScript | Low-level storage operations and reconsolidation helpers |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:290:| `hybrid-search.ts`         | ~900   | TypeScript | Orchestrates vector/FTS/BM25/graph/degree fusion via adaptive RRF |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:302:| `query-expander.ts`        | -      | TypeScript | Rule-based synonym expansion for mode="deep" multi-query RAG |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:309:| `evidence-gap-detector.ts` | -      | TypeScript | Z-score confidence check on RRF scores to detect low-confidence retrieval |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:311:| `sqlite-fts.ts`            | -      | TypeScript | SQLite FTS5 BM25 weighted scoring, extracted from hybrid-search for independent use |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:323:| `embedding-expansion.ts`   | -      | TypeScript | Embedding-based query expansion for R12 multi-vector retrieval |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:337:| `hyde.ts`                  | -      | TypeScript | HyDE-style hypothetical document generation for query expansion |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:353:**Relocated to `shared/algorithms/`**: `rrf-fusion.ts`, `adaptive-fusion.ts`, `mmr-reranker.ts` -- these are now imported from `@spec-kit/shared/algorithms/`.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:359:   hybrid-search.ts -> Expand acronyms + fix typos (inline)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:366:   vector-index.ts -> Vector search (semantic)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:375:   rrf-fusion.ts -> RRF with k=40, convergence bonus
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:376:   adaptive-fusion.ts -> Intent-aware weighted fusion
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:377:   hybrid-search.ts -> Orchestrate multi-source fusion
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:413:| `ENABLE_BM25`            | `true`   | Enable BM25 lexical search (legacy compatibility gate) |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:425:| `SPECKIT_EMBEDDING_EXPANSION`| `true` | Enable R12 embedding-based query expansion |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:430:**RRF Parameters** (hardcoded, REQ-011):
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:455:| v7      | `partial` embedding_status + `idx_embedding_pending` + `idx_fts_fallback` (REQ-031, T096) |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:506:// 1. Vector search (semantic similarity)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:510:// -> RRF + Adaptive Fusion -> MMR diversity -> Sorted by combined score
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:516:hybridSearch("authentication", { specFolder: "specs/<###-spec-name>" })
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:521:- If RRF disabled: Vector-only with basic metadata
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:522:- If no graph: Vector + Lexical fusion
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:597:| **Storage** | Summaries stored with embeddings in SQLite for vector search |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:639:Graph-based scoring signals applied during Stage 2 fusion. Gated via `SPECKIT_GRAPH_SIGNALS` (N2a + N2b) and `SPECKIT_COMMUNITY_DETECTION` (N2c).
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:642:The 5th RRF channel computes degree centrality with per-edge-type weights:
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:655:**A7: Co-Activation Boost** (`../cognitive/co-activation.ts` + Stage 2 fusion):
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:719:`buildBm25DocumentText()` builds the canonical lexical document from title, content, trigger phrases, and folder metadata. `normalizeLexicalQueryTokens()` is shared by BM25 and SQLite FTS flows so lexical matching stays aligned across search channels.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:769:import { initializeDb } from './vector-index';
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:770:import { init, unifiedSearch } from './hybrid-search';
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:771:import { vectorSearch } from './vector-index';
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:776:init(db, vectorSearch);
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:787:// - sources: ['vector', 'bm25', 'graph']
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:788:// - vectorRank, bm25Rank, graphRank
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:796:import { unifiedSearch } from './hybrid-search';
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:850:import { initializeDb, getDb } from './vector-index';
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:877:- Quality floor corrected from 0.2 to 0.005 (D3) — aligns with RRF score range
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:908:| Search weights configuration | Loaded via SERVER_DIR in the split vector-index modules (compat imports still route through `vector-index-impl.ts`) |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:934:- **RRF**: Cormack et al. "Reciprocal Rank Fusion outperforms Condorcet" (SIGIR 2009)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:943:| REQ-011 | RRF fusion enhancement           | hybrid-search.ts                |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:946:| REQ-014 | BM25 hybrid search               | bm25-index.ts, hybrid-search.ts |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:947:| REQ-018 | Query expansion (fuzzy)          | hybrid-search.ts                |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:948:| REQ-027 | Fuzzy acronym matching           | hybrid-search.ts                |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:961:- `vector-index.ts` is the primary typed export surface. `vector-index-impl.ts` is a 14-line compatibility shim, and the core implementation lives in the split vector-index modules for types, schema, mutations, queries, aliases, and store
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:962:- `rrf-fusion.ts`, `adaptive-fusion.ts`, and `mmr-reranker.ts` relocated to `shared/algorithms/`
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:5:// Semantic query expansion using embedding similarity.
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:11:// Rather than semantic broadening.
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:20:import * as vectorIndex from './vector-index.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:30: * Result produced by embedding-based query expansion.
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:33: * - `expanded`      — Array of semantically related terms extracted from
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:65:/** Number of semantically similar memories to mine for expansion terms. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:74:/** Stop-words that carry no semantic signal for expansion. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:156: * Expand a query using embedding-based similarity to find semantically
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:164: *   3. Embedding vector is invalid (zero-length or non-finite values).
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:168: *   a. Run a vector similarity search using the provided embedding.
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:212:    // Use the query embedding to find semantically similar memories.
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:215:    const similarMemories = vectorIndex.vectorSearch(embedding, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-enforcement.ts:7:// Use inside the hybrid-search pipeline after RRF/RSF fusion.
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-enforcement.ts:80: * @param fusedResults      - Post-fusion results, ordered by score descending.
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:23:  /** Weight for semantic (vector) search component, 0-1 */
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:24:  semanticWeight: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:55:    semanticWeight: 0.7,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:63:    semanticWeight: 0.6,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:71:    semanticWeight: 0.4,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:79:    semanticWeight: 0.3,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:87:    semanticWeight: 0.6,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:95:    semanticWeight: 0.5,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:103:    semanticWeight: 0.8,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:111:    semanticWeight: 0.7,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:119:    semanticWeight: 0.5,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:189:    keywords: ['research', 'investigation', 'analysis', 'findings', 'study', 'evaluation', 'search', 'retrieval', 'pipeline', 'indexing', 'embedding', 'vector', 'semantic'],
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:31:import * as vectorIndex from './vector-index.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:61:  /** Embedding vector of the pseudo-document (Float32Array). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:353: * Run a vector-only search using the HyDE pseudo-document embedding.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:366:export function vectorOnly(
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:371:  return vectorIndex.vectorSearch(embedding, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:412:    const candidates = vectorOnly(hydeResult.embedding, limit, specFolder);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:5:// Split from vector-index-store.ts — contains ALL query/search functions,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:21:} from './vector-index-types.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:32:} from './vector-index-store.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:33:import { delete_memory_from_database } from './vector-index-mutations.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:39:} from './vector-index-types.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:60: * @throws {VectorIndexError} Propagates store initialization failures from the vector index.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:158: * Searches indexed memories by vector similarity.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:162: * @throws {VectorIndexError} Propagates store initialization failures from the vector index.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:165: * const rows = vector_search(queryEmbedding, { limit: 5, specFolder: 'specs/001-demo' });
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:168:export function vector_search(
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:175:    console.warn('[vector-index] Vector search unavailable - sqlite-vec not loaded');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:325:    console.warn('[vector-index] Multi-concept search unavailable - sqlite-vec not loaded');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:505:    console.warn('[vector-index] extract_tags: invalid content type, expected string');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:557:        console.warn('[vector-index-queries] Date parsing failed', { error: _e instanceof Error ? _e.message : String(_e) });
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:592:    console.warn('[vector-index] Empty query provided for embedding');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:601:    console.warn(`[vector-index] Query embedding failed: ${get_error_message(error)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:624:    console.warn('[vector-index] keyword_search: invalid query, expected non-empty string');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:630:    console.warn('[vector-index] keyword_search: no valid search terms after tokenization');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:697: * Runs enriched vector search for a text query.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:702: * @throws {VectorIndexError} Propagates vector-store initialization failures from the underlying search pipeline.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:705: * const results = await vector_search_enriched('sqlite vec mismatch', 10, { specFolder: 'specs/001-demo' });
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:708:export async function vector_search_enriched(
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:720:  let search_method = 'vector';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:724:    raw_results = vector_search(query_embedding, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:730:    console.warn('[vector-index] Falling back to keyword search');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:747:    const similarity = search_method === 'vector'
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:769:    console.warn(`[vector-index] Enriched search took ${elapsed}ms (target <500ms)`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:785: * @throws {VectorIndexError} When concept validation fails or the vector search pipeline cannot execute.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:788: * const results = await multi_concept_search_enriched(['sqlite', 'vector'], 10, { specFolder: 'specs/001-demo' });
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:809:        console.warn(`[vector-index] Failed to embed concept: "${concept}"`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:820:    console.warn('[vector-index] Falling back to keyword multi-concept search');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:855:    console.warn(`[vector-index] Multi-concept search took ${elapsed}ms (target <500ms)`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:876:    console.warn('[vector-index] multi_concept_keyword_search: empty concepts array');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:945:    console.warn('[vector-index] parse_quoted_terms: invalid query, expected non-empty string');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1084:    console.warn(`[vector-index] Failed to get related memories for ${memory_id}: ${get_error_message(error)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1185:    console.warn(`[vector-index] find_cleanup_candidates error: ${get_error_message(e)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1238:    console.warn(`[vector-index] get_memory_preview query error: ${get_error_message(e)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1259:    console.warn('[vector-index] get_memory_preview file read warning', {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1291: * Verifies vector-index consistency and optional cleanup results.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1298:): { totalMemories: number; totalVectors: number; orphanedVectors: number; missingVectors: number; orphanedFiles: Array<{ id: number; file_path: string; reason: string }>; orphanedChunks: number; isConsistent: boolean; cleaned?: { vectors: number; chunks: number } } {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1302:  const find_orphaned_vector_ids = () => {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1304:      console.warn('[vector-index] find_orphaned_vector_ids: sqlite-vec not available');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1313:      console.warn('[vector-index] Could not query orphaned vectors:', get_error_message(e));
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1318:  const orphaned_vector_ids = find_orphaned_vector_ids();
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1319:  const orphaned_vectors = orphaned_vector_ids.length;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1321:  let cleaned_vectors = 0;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1322:  if (autoClean && orphaned_vectors > 0 && sqlite_vec) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1323:    logger.info(`Auto-cleaning ${orphaned_vectors} orphaned vectors...`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1325:    for (const rowid of orphaned_vector_ids) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1328:        cleaned_vectors++;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1330:        console.warn(`[vector-index] Failed to clean orphaned vector ${rowid}: ${get_error_message(e)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1333:    logger.info(`Cleaned ${cleaned_vectors} orphaned vectors`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1338:  const missing_vectors = sqlite_vec
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1347:  const total_vectors = sqlite_vec
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1383:      console.warn('[vector-index] Could not query orphaned chunks:', get_error_message(e));
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1409:        console.warn(`[vector-index] Failed to clean orphaned chunk ${chunk.id}: ${get_error_message(e)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1419:    totalVectors: total_vectors,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1420:    orphanedVectors: autoClean ? orphaned_vectors - cleaned_vectors : orphaned_vectors,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1421:    missingVectors: missing_vectors,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1424:    isConsistent: (orphaned_vectors - cleaned_vectors) === 0 && missing_vectors === 0 && orphaned_files.length === 0 && effective_orphaned_chunks === 0,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1425:    cleaned: (autoClean && (cleaned_vectors > 0 || cleaned_chunks > 0))
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1426:      ? { vectors: cleaned_vectors, chunks: cleaned_chunks }
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1437:export { vector_search as vectorSearch };
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1446:export { vector_search_enriched as vectorSearchEnriched };
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:5:// Split from vector-index-store.ts — contains ALL mutation functions:
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:17:} from './vector-index-aliases.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:23:} from './vector-index-types.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:31:} from './vector-index-store.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:35:} from './vector-index-types.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:128:// contract adopts appendOnly and canonicalFilePath semantics.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:181:    console.warn(`[vector-index] Embedding dimension mismatch: expected ${expected_dim}, got ${embedding.length}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:436:      // H1 FIX: Set 'pending' until vector write is confirmed
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:456:        console.warn(`[vector-index] Embedding dimension mismatch in update: expected ${expected_dim}, got ${embedding.length}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:468:      // H1 FIX: Mark success only after vector write confirmed
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:651:            console.warn(`[VectorIndex] Failed to delete vector for memory ${id}: ${get_error_message(vec_error)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:672:        console.warn(`[vector-index] Failed to delete memory ${id}: ${get_error_message(e)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:710:    console.warn(`[vector-index] delete_memories transaction error: ${get_error_message(e)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:732:    console.warn(`[vector-index] Invalid embedding status: ${status}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:745:    console.warn(`[vector-index] Failed to update embedding status for ${id}: ${get_error_message(error)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:762:    console.warn(`[vector-index] Invalid confidence value: ${confidence}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:775:    console.warn(`[vector-index] Failed to update confidence for ${memory_id}: ${get_error_message(error)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:11://     - Intent weights are NEVER applied to hybrid results (G2 double-weighting guard)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:23:// 1a. Recency fusion          — time-decay bonus for recent memories
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:29:// 4.  Intent weights          — non-hybrid search post-scoring adjustment
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:37:// Internally (RRF / RSF fusion). Post-search intent weighting is
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:38:// Therefore ONLY applied for non-hybrid search types (vector,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:39:// Multi-concept). Applying it to hybrid results would double-count.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:125:/** Recency fusion weight — controls how much recency score contributes to the fused score.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:129:/** Recency fusion cap — maximum bonus a candidate can receive from recency fusion.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:192:        console.warn(`[stage2-fusion] learned stage2 model at ${modelPath} is invalid; shadow scoring will use manual-only fallback`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:206:        console.warn(`[stage2-fusion] learned stage2 model load failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:278:    // must not be overwritten with the fusion/ranking score.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:291:    // must not be overwritten with the fusion/ranking score.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:464:    console.warn(`[stage2-fusion] provenance edge fetch failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:493:    console.warn(`[stage2-fusion] provenance community fetch failed (non-fatal): ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:582:    console.warn(`[stage2-fusion] strengthenOnAccess failed for id ${memoryId}: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:592: * G2 PREVENTION: This function is ONLY called for non-hybrid search types.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:593: * Hybrid search (RRF / RSF) already incorporates intent-weighted signals
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:594: * during fusion. Calling this on hybrid results would double-count intent.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:737:    console.warn(`[stage2-fusion] learned trigger query failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:749:      console.warn(`[stage2-fusion] negative feedback stats failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:835:    console.warn(`[stage2-fusion] usage ranking failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:880:      console.warn(`[stage2-fusion] applyTestingEffect failed for id ${row.id}: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:916:    console.warn('[stage2-fusion] adaptive access signal write failed:', (err as Error)?.message ?? err);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:930: *   1.  Session boost      (hybrid only — working memory attention)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:931: *   1a. Recency fusion     (all types — time-decay bonus)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:932: *   2.  Causal boost       (hybrid only — graph-traversal amplification)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:937: *   4.  Intent weights     (non-hybrid only — G2 prevention)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:975:  const isHybrid = config.searchType === 'hybrid';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:978:  // Only for hybrid search type — session attention signals are most meaningful
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:979:  // When the full hybrid result set is available for ordering.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:993:      console.warn(`[stage2-fusion] session boost failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:998:  // -- 1a. Recency fusion --
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1000:  // Uses computeRecencyScore (already imported but previously unused in hybrid path).
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1027:    console.warn(`[stage2-fusion] recency fusion failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1031:  // Only for hybrid search type — causal graph traversal is seeded from the
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1049:      console.warn(`[stage2-fusion] causal boost failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1057:  // Appear in the co-activation graph. Matches V1 hybrid-search behavior.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1093:      console.warn(`[stage2-fusion] co-activation spreading failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1113:      console.warn(`[stage2-fusion] community boost failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1169:      console.warn(`[stage2-fusion] graph signals failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1180:      console.warn(`[stage2-fusion] usage ranking skipped (db unavailable): ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1191:    console.warn(`[stage2-fusion] graph evidence provenance failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1205:      console.warn(`[stage2-fusion] testing effect skipped (db unavailable): ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1210:  // G2 PREVENTION: Only apply for non-hybrid search types.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1211:  // Hybrid search (RRF / RSF) incorporates intent weighting during fusion —
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1224:      console.warn(`[stage2-fusion] intent weights failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1237:      console.warn(`[stage2-fusion] artifact routing failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1253:    console.warn(`[stage2-fusion] feedback signals failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1287:            `[stage2-fusion] shadow-learned id=${row.id} manual=${shadow.manualScore.toFixed(4)} learned=${shadow.learnedScore.toFixed(4)} delta=${shadow.delta.toFixed(4)}`
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1293:      console.warn(`[stage2-fusion] learned stage2 shadow scoring failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1321:    console.warn(`[stage2-fusion] validation signal scoring failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1344:        '[stage2-fusion] Graph channel active (bounded_runtime) but zero contribution — causal_edges table may be sparse or candidates lack graph connectivity'
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1353:      'fusion',
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:3:description: "Four-stage retrieval pipeline: candidate generation, fusion, reranking and filtering."
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:9:  - "fusion scoring"
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:18:A four-stage retrieval pipeline that takes a search query through candidate generation, score fusion, reranking and final filtering to produce ranked memory results.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:34:The `pipeline/` directory implements the core retrieval pipeline behind `memory_search`. Each search request flows through four sequential stages, each with a defined I/O contract and clear responsibility boundary. The pipeline supports hybrid, vector and multi-concept search types with optional deep-mode query expansion, cross-encoder reranking, MMR diversity pruning and MPAB chunk-to-parent reassembly.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:46:| `stage1-candidate-gen.ts` | Stage 1: Candidate Generation. Runs search channels (hybrid, vector, multi-concept), applies deep-mode query expansion (R6), embedding-based expansion (R12), summary embeddings (R8), constitutional memory injection, quality threshold filtering and tier/contextType filtering. |
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:47:| `stage2-fusion.ts` | Stage 2: Fusion + Signal Integration. The single authoritative scoring point. Applies 9 signal steps in fixed order: session boost, causal boost, co-activation spreading, community co-retrieval, graph signals, FSRS testing effect, intent weights (non-hybrid only, G2 prevention), artifact routing, feedback signals, artifact limiting, anchor metadata and validation metadata scoring. |
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:78:- Channels: hybrid (with optional deep-mode expansion), vector, multi-concept.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:83:**Stage 2 - Fusion + Signal Integration** (`stage2-fusion.ts`)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:86:- G2 prevention: intent weights are applied only for non-hybrid search types.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:105:1. **Single Scoring Point.** All score modifications happen in Stage 2 (fusion) or Stage 3 (reranking). Stage 4 must not change any score field.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:106:2. **G2 Double-Weighting Guard.** Intent weights are applied only for non-hybrid search types. Hybrid search incorporates intent weighting during RRF/RSF fusion internally.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:114:- `mcp_server/lib/search/` - Parent search directory containing hybrid search, vector index, cross-encoder and other search modules consumed by the pipeline.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2b-enrichment.ts:4:// B4 DECOMPOSITION: Extracted from stage2-fusion.ts steps 8-9.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:34:import { executeStage2 } from './stage2-fusion.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:122:  searchType: 'hybrid' | 'vector' | 'multi-concept';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:167: * Intent-aware weighting factors applied during fusion.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:191: * Executes search channels (FTS5, semantic, trigger, graph, co-activation)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:206:    /** Actual retrieval channels active (vector=1, hybrid=2). Unlike channelCount which tracks query variants. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:224: * Single point for ALL scoring signals: RRF/RSF, causal boost, co-activation,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:235: * Stage 2 output containing scored rows and fusion metadata.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:348: * Executor signature for Stage 2 fusion and signal integration.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:12:// MPAB MUST remain AFTER RRF fusion (Stage 2).
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:169:  // The result set, matching the V1 hybrid-search behavior.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:214:          // rows (lexical-only hits, graph injections) must be preserved and merged
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:248:  // MPAB must remain AFTER RRF (Stage 2 constraint). This step runs
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:301: * @param results     - Pipeline rows from Stage 2 fusion.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:473: * RRF fusion (Stage 2). It is intentionally placed in Stage 3.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:7:// This stage avoids downstream fusion/reranking, but may apply temporal
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:8:// Contiguity to raw vector-channel hits before later pipeline stages.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:13://   - hybrid (deep mode): Query expansion + multi-variant hybrid search + dedup
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:14://   - hybrid (R12):       Embedding-based query expansion (SPECKIT_EMBEDDING_EXPANSION)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:16://   - hybrid: collectRawCandidates → falls back to vector on failure
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:17://   - vector: Direct vectorSearch
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:28://     - candidates contains raw channel scores; vector hits may include an
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:29://       optional temporal-contiguity boost applied before downstream fusion
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:34://     - Reads from the vector index and FTS5 / BM25 index (DB reads only)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:38:import * as vectorIndex from '../vector-index.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:40:import * as hybridSearch from '../hybrid-search.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:41:import { vectorSearchWithContiguity } from '../../cognitive/temporal-contiguity.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:79:/** Number of constitutional results to fetch when none appear in hybrid/vector results. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:82:/** Number of similar memories to mine for R12 embedding-based query expansion terms. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:459: * and `config.mode`, then applies vector-channel temporal contiguity when
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:463: * This stage does not apply Stage 2 fusion/reranking signals. Vector-channel
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:508:  // the query for the hybrid search channel, improving recall for alias-rich
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:509:  // queries (e.g. "semantic search" → also searches "retrieval", "query", etc.).
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:513:  /** Effective query for hybrid search — may be expanded by concept routing. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:516:  if (isGraphConceptRoutingEnabled() && searchType === 'hybrid') {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:594:    candidates = vectorIndex.multiConceptSearch(conceptEmbeddings, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:602:  // -- Channel: Hybrid (with optional deep-mode query expansion) ---------------
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:604:  else if (searchType === 'hybrid') {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:613:      throw new Error('[stage1-candidate-gen] Failed to generate embedding for hybrid search query');
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:616:    // Deep mode: expand query into variants and run hybrid for each, then dedup
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:621:      // sub-query facets and run hybrid search per facet. Results are merged
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:654:            // Run hybrid for the original query plus each facet, in parallel
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:666:                  return hybridSearch.collectRawCandidates(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:729:                const variantResults = await hybridSearch.collectRawCandidates(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:738:            'Deep-mode query expansion',
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:759:            `[stage1-candidate-gen] Deep query expansion failed, falling back to single hybrid: ${expandMsg}`
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:761:          // Fall through to single hybrid search below
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:763:          candidates = (await hybridSearch.collectRawCandidates(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:770:        // ExpandQuery returned only the original; treat as standard hybrid
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:772:        candidates = (await hybridSearch.collectRawCandidates(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:781:      // -- R12: Embedding-based query expansion (SPECKIT_EMBEDDING_EXPANSION) --
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:811:              hybridSearch.collectRawCandidates(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:828:                  return hybridSearch.collectRawCandidates(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:864:            `[stage1-candidate-gen] R12 embedding expansion failed, using standard hybrid: ${r12Msg}`
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:869:      // Standard hybrid search — runs when R12 is off, suppressed by R15,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:875:          const hybridResults = (await hybridSearch.collectRawCandidates(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:880:          candidates = hybridResults;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:881:        } catch (hybridErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:882:          const hybridMsg =
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:883:            hybridErr instanceof Error ? hybridErr.message : String(hybridErr);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:885:            `[stage1-candidate-gen] Hybrid search failed, falling back to vector: ${hybridMsg}`
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:888:          // Fallback: pure vector search
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:890:          let vectorResults = vectorIndex.vectorSearch(effectiveEmbedding, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:899:            vectorResults = (
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:900:              vectorSearchWithContiguity(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:901:                vectorResults as Array<PipelineRow & { similarity: number; created_at: string }>,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:904:            ) ?? vectorResults;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:906:          candidates = vectorResults;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:910:              reason: hybridMsg,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:911:              channel: 'vector',
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:921:  else if (searchType === 'vector') {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:926:      throw new Error('[stage1-candidate-gen] Failed to generate embedding for vector search query');
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:930:    let vectorResults = vectorIndex.vectorSearch(effectiveEmbedding, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:939:      vectorResults = (
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:940:        vectorSearchWithContiguity(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:941:          vectorResults as Array<PipelineRow & { similarity: number; created_at: string }>,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:944:      ) ?? vectorResults;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:946:    candidates = vectorResults;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:953:      `[stage1-candidate-gen] Unknown searchType: "${searchType}". Expected 'multi-concept', 'hybrid', or 'vector'.`
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:961:  // Exception: for hybrid search, tier/contextType are applied here because
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:963:  // For vector search, tier/contextType were already passed to vectorSearch,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1011:  // In the current candidate set, fetch them separately via vector search.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1031:        const constitutionalResults = vectorIndex.vectorSearch(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1048:        // via vector search bypass the earlier governance/context gate.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1082:  //   3. Fan-out [original, abstract, ...variants] as additional hybrid search channels.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1088:  if (mode === 'deep' && isLlmReformulationEnabled() && searchType === 'hybrid') {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1109:              return hybridSearch.collectRawCandidates(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1169:  //   - Run a vector-only search with the pseudo-document embedding.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1176:  if (mode === 'deep' && isHyDEEnabled() && searchType === 'hybrid') {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1335:              // raw row.score. For vector-only rows with only `similarity`,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1391:  // P1 fix: activeChannels counts actual retrieval channels (vector, keyword/BM25),
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1392:  // while channelCount counts parallel query variants. In hybrid mode both vector
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1394:  const activeChannels = searchType === 'hybrid' ? 2 : 1;

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go | sed -n '60,420p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
   121			"properties": map[string]interface{}{
   122				"path": map[string]interface{}{"type": "string", "description": "Relative path within vault (e.g. brain/hn/some-file.md)"},
   123			},
   124			"required": []string{"path"},
   125		}, func(args map[string]interface{}) (string, error) {
   126			relPath, _ := args["path"].(string)
   127			doc, err := v.Read(relPath)
   128			if err != nil {
   129				return "", err
   130			}
   131	
   132			var sb strings.Builder
   133			for k, val := range doc.Frontmatter {
   134				sb.WriteString(fmt.Sprintf("%s: %v\n", k, val))
   135			}
   136			sb.WriteString("\n")
   137			sb.WriteString(doc.Body)
   138			return sb.String(), nil
   139		})
   140	
   141		// --- Write ---
   142	
   143		srv.AddTool("vault_write", "Write a vault file (frontmatter + body).", map[string]interface{}{
   144			"type": "object",
   145			"properties": map[string]interface{}{
   146				"path":        map[string]interface{}{"type": "string", "description": "Relative path within vault"},
   147				"frontmatter": map[string]interface{}{"type": "object", "description": "YAML frontmatter fields"},
   148				"body":        map[string]interface{}{"type": "string", "description": "Markdown body"},
   149			},
   150			"required": []string{"path", "body"},
   151		}, func(args map[string]interface{}) (string, error) {
   152			relPath, _ := args["path"].(string)
   153			body, _ := args["body"].(string)
   154			fm := make(map[string]interface{})
   155			if fmRaw, ok := args["frontmatter"].(map[string]interface{}); ok {
   156				fm = fmRaw
   157			}
   158			if err := v.Write(relPath, fm, body); err != nil {
   159				return "", err
   160			}
   161			return fmt.Sprintf("Written: %s", relPath), nil
   162		})
   163	
   164		// --- List ---
   165	
   166		srv.AddTool("vault_list", "List vault files in a subdirectory, optionally filtered.", map[string]interface{}{
   167			"type": "object",
   168			"properties": map[string]interface{}{
   169				"subdir":  map[string]interface{}{"type": "string", "description": "Subdirectory to list (e.g. brain/hn, memory/facts)"},
   170				"field":   map[string]interface{}{"type": "string", "description": "Filter by frontmatter field"},
   171				"value":   map[string]interface{}{"type": "string", "description": "Required value for field"},
   172				"exclude": map[string]interface{}{"type": "boolean", "description": "If true, exclude matches instead of including"},
   173				"limit":   map[string]interface{}{"type": "integer", "description": "Max results (default 50)"},
   174			},
   175			"required": []string{"subdir"},
   176		}, func(args map[string]interface{}) (string, error) {
   177			subdir, _ := args["subdir"].(string)
   178			limit := 50
   179			if l, ok := args["limit"].(float64); ok {
   180				limit = int(l)
   181			}
   182	
   183			var filters []vault.Filter
   184			if field, ok := args["field"].(string); ok && field != "" {
   185				val, _ := args["value"].(string)
   186				exclude, _ := args["exclude"].(bool)
   187				filters = append(filters, vault.Filter{Field: field, Value: val, Exclude: exclude})
   188			}
   189	
   190			docs, err := v.List(subdir, filters...)
   191			if err != nil {
   192				return "", err
   193			}
   194	
   195			var sb strings.Builder
   196			count := 0
   197			for _, doc := range docs {
   198				if count >= limit {
   199					break
   200				}
   201				rel, _ := filepath.Rel(v.Dir, doc.Path)
   202				title := doc.Get("title")
   203				if title == "" {
   204					title = doc.Get("name")
   205				}
   206				if title == "" {
   207					title = doc.Get("subject")
   208				}
   209				if title != "" {
   210					sb.WriteString(fmt.Sprintf("- %s (%s)\n", title, rel))
   211				} else {
   212					sb.WriteString(fmt.Sprintf("- %s\n", rel))
   213				}
   214				count++
   215			}
   216			return fmt.Sprintf("%d files:\n\n%s", count, sb.String()), nil
   217		})
   218	
   219		// --- Status ---
   220	
   221		statusHandler := func(args map[string]interface{}) (string, error) {
   222			return v.StatusJSON()
   223		}
   224	
   225		srv.AddTool("vault_status", "Vault statistics — file counts, index size, cross-ref stats.", map[string]interface{}{
   226			"type": "object", "properties": map[string]interface{}{},
   227		}, statusHandler)
   228	
   229		// --- Memory Facts ---
   230	
   231		memoryFactsHandler := func(args map[string]interface{}) (string, error) {
   232			subject, _ := args["subject"].(string)
   233			limit := 20
   234			if l, ok := args["limit"].(float64); ok {
   235				limit = int(l)
   236			}
   237	
   238			docs, err := v.ListFacts(subject, limit)
   239			if err != nil {
   240				return "", err
   241			}
   242			if len(docs) == 0 {
   243				return "No memory facts found.", nil
   244			}
   245	
   246			var sb strings.Builder
   247			for _, doc := range docs {
   248				subj := doc.Get("subject")
   249				pred := doc.Get("predicate")
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
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

codex
The core pattern is sharpening: Modus spends its intelligence budget earlier, reformulating the query so a lexical engine can succeed, while Public spends that budget later, combining partially independent retrieval channels and then layering intent/session/graph adjustments. I’m pulling the exact channel orchestration code now so I can say where each strategy wins instead of giving a generic “hybrid is best” answer.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts | sed -n '448,620p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts | sed -n '973,1185p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   448	 * @returns Array of FTS-scored results tagged with source 'fts'.
   449	 */
   450	function ftsSearch(
   451	  query: string,
   452	  options: { limit?: number; specFolder?: string; includeArchived?: boolean } = {}
   453	): HybridSearchResult[] {
   454	  if (!db || !isFtsAvailable()) {
   455	    console.warn('[hybrid-search] db not initialized or FTS unavailable — returning empty ftsSearch results');
   456	    return [];
   457	  }
   458	
   459	  const { limit = DEFAULT_LIMIT, specFolder, includeArchived = false } = options;
   460	
   461	  try {
   462	    // C138-P2: Delegate to weighted BM25 FTS5 search from sqlite-fts.ts
   463	    // Uses bm25(memory_fts, 10.0, 5.0, 2.0, 1.0) for per-column weighting
   464	    // (title 10x, trigger_phrases 5x, file_path 2x, content 1x)
   465	    // Filters: is_archived exclusion and spec_folder matching handled by fts5Bm25Search
   466	    const bm25Results = fts5Bm25Search(db, query, { limit, specFolder, includeArchived });
   467	
   468	    return bm25Results.map(row => ({
   469	      ...row,
   470	      id: row.id as number,
   471	      score: row.fts_score || 0,
   472	      source: 'fts',
   473	    }));
   474	  } catch (error: unknown) {
   475	    const msg = error instanceof Error ? error.message : String(error);
   476	    console.warn(`[hybrid-search] FTS search failed: ${msg}`);
   477	    return [];
   478	  }
   479	}
   480	
   481	// 10. COMBINED LEXICAL SEARCH
   482	
   483	/**
   484	 * Merge FTS and BM25 search results, deduplicating by ID and preferring FTS scores.
   485	 * @param query - The search query string.
   486	 * @param options - Optional limit, specFolder filter, and includeArchived flag.
   487	 * @returns Deduplicated array of merged results sorted by score descending.
   488	 */
   489	function combinedLexicalSearch(
   490	  query: string,
   491	  options: { limit?: number; specFolder?: string; includeArchived?: boolean } = {}
   492	): HybridSearchResult[] {
   493	  const ftsResults = ftsSearch(query, options);
   494	  const bm25Results = bm25Search(query, options);
   495	
   496	  // Merge by canonical ID, prefer FTS scores.
   497	  // CanonicalResultId() prevents duplicate rows when one channel emits
   498	  // Numeric IDs (42) and another emits string IDs ("42" or "mem:42").
   499	  const merged = new Map<string, HybridSearchResult>();
   500	
   501	  for (const r of ftsResults) {
   502	    merged.set(canonicalResultId(r.id), r);
   503	  }
   504	
   505	  for (const r of bm25Results) {
   506	    const canonicalId = canonicalResultId(r.id);
   507	    if (!merged.has(canonicalId)) {
   508	      merged.set(canonicalId, r);
   509	    }
   510	  }
   511	
   512	  return Array.from(merged.values())
   513	    .sort((a, b) => b.score - a.score)
   514	    .slice(0, options.limit || DEFAULT_LIMIT);
   515	}
   516	
   517	type RawChannelList = {
   518	  source: string;
   519	  results: Array<{ id: number | string; [key: string]: unknown }>;
   520	};
   521	
   522	function resolveRawCandidateScore(result: { score?: unknown; similarity?: unknown }): number {
   523	  if (typeof result.score === 'number' && Number.isFinite(result.score)) {
   524	    return result.score;
   525	  }
   526	  if (typeof result.similarity === 'number' && Number.isFinite(result.similarity)) {
   527	    return result.similarity / 100;
   528	  }
   529	  return 0;
   530	}
   531	
   532	function getCandidateSources(result: HybridSearchResult): string[] {
   533	  const sourceList = (result as { sources?: unknown }).sources;
   534	  if (Array.isArray(sourceList)) {
   535	    return sourceList.filter((value): value is string => typeof value === 'string');
   536	  }
   537	  return typeof result.source === 'string' && result.source.length > 0
   538	    ? [result.source]
   539	    : [];
   540	}
   541	
   542	function getCandidateSourceScores(result: HybridSearchResult): Record<string, number> {
   543	  const sourceScores = (result as { sourceScores?: unknown }).sourceScores;
   544	  if (sourceScores && typeof sourceScores === 'object' && !Array.isArray(sourceScores)) {
   545	    const normalizedScores: Record<string, number> = {};
   546	    for (const [source, score] of Object.entries(sourceScores as Record<string, unknown>)) {
   547	      if (typeof score === 'number' && Number.isFinite(score)) {
   548	        normalizedScores[source] = score;
   549	      }
   550	    }
   551	    return normalizedScores;
   552	  }
   553	
   554	  const fallbackScores: Record<string, number> = {};
   555	  const resultScore = typeof result.score === 'number' && Number.isFinite(result.score)
   556	    ? result.score
   557	    : 0;
   558	  for (const source of getCandidateSources(result)) {
   559	    fallbackScores[source] = resultScore;
   560	  }
   561	  return fallbackScores;
   562	}
   563	
   564	function mergeRawCandidate(
   565	  existing: HybridSearchResult | undefined,
   566	  incoming: HybridSearchResult
   567	): HybridSearchResult {
   568	  if (!existing) {
   569	    const sources = getCandidateSources(incoming);
   570	    const channelCount = sources.length;
   571	    return {
   572	      ...incoming,
   573	      sources,
   574	      channelCount,
   575	      sourceScores: getCandidateSourceScores(incoming),
   576	      channelAttribution: sources,
   577	    };
   578	  }
   579	
   580	  const existingScore = typeof existing.score === 'number' && Number.isFinite(existing.score)
   581	    ? existing.score
   582	    : 0;
   583	  const incomingScore = typeof incoming.score === 'number' && Number.isFinite(incoming.score)
   584	    ? incoming.score
   585	    : 0;
   586	  const primary = incomingScore > existingScore ? incoming : existing;
   587	  const secondary = primary === incoming ? existing : incoming;
   588	  const sources = Array.from(new Set([
   589	    ...getCandidateSources(existing),
   590	    ...getCandidateSources(incoming),
   591	  ]));
   592	  const channelCount = sources.length;
   593	  const crossChannelBonus = Math.min(0.06, 0.02 * Math.max(0, channelCount - 1));
   594	  const mergedScore = Math.max(0, Math.min(1, Math.max(existingScore, incomingScore) + crossChannelBonus));
   595	
   596	  return {
   597	    ...(secondary ?? {}),
   598	    ...primary,
   599	    score: mergedScore,
   600	    source: typeof primary.source === 'string' ? primary.source : (sources[0] ?? 'hybrid'),
   601	    sources,
   602	    channelCount,
   603	    sourceScores: {
   604	      ...getCandidateSourceScores(existing),
   605	      ...getCandidateSourceScores(incoming),
   606	    },
   607	    channelAttribution: sources,
   608	  };
   609	}
   610	
   611	function collectCandidatesFromLists(
   612	  lists: RawChannelList[],
   613	  limit?: number
   614	): HybridSearchResult[] {
   615	  const deduped = new Map<string, HybridSearchResult>();
   616	
   617	  for (const list of lists) {
   618	    if (!Array.isArray(list.results) || list.results.length === 0) continue;
   619	
   620	    const scored = list.results.map((result) => {

 succeeded in 0ms:
   973	 * Enhanced hybrid search with RRF fusion.
   974	 * All search channels use synchronous better-sqlite3; sequential execution
   975	 * is correct — Promise.all would add overhead without achieving parallelism.
   976	 */
   977	async function hybridSearchEnhanced(
   978	  query: string,
   979	  embedding: Float32Array | number[] | null,
   980	  options: HybridSearchOptions = {}
   981	): Promise<HybridSearchResult[]> {
   982	  const execution = await collectAndFuseHybridResults(query, embedding, options);
   983	  if (execution) {
   984	    if (options.stopAfterFusion) {
   985	      return applyResultLimit(execution.fusedResults, options.limit);
   986	    }
   987	
   988	    return enrichFusedResults(query, execution, options);
   989	  }
   990	
   991	  return hybridSearch(query, embedding, options);
   992	}
   993	
   994	async function collectAndFuseHybridResults(
   995	  query: string,
   996	  embedding: Float32Array | number[] | null,
   997	  options: HybridSearchOptions = {}
   998	): Promise<HybridFusionExecution | null> {
   999	  try {
  1000	    const evaluationMode = options.evaluationMode === true;
  1001	    const lists: HybridFusionExecution['lists'] = [];
  1002	
  1003	    // Pipeline metadata collector (populated by flag-gated stages)
  1004	    const s3meta: Sprint3PipelineMeta = {};
  1005	
  1006	    // -- Stage A: Query Classification + Routing (SPECKIT_COMPLEXITY_ROUTER) --
  1007	    // When enabled, classifies query complexity and restricts channels to a
  1008	    // Subset (e.g., simple queries skip graph+degree). When disabled, all channels run.
  1009	    const routeResult = routeQuery(query, options.triggerPhrases);
  1010	    const allPossibleChannels: ChannelName[] = ['vector', 'fts', 'bm25', 'graph', 'degree'];
  1011	    const activeChannels = options.forceAllChannels
  1012	      ? new Set<ChannelName>(allPossibleChannels)
  1013	      : new Set<ChannelName>(routeResult.channels);
  1014	
  1015	    // Respect explicit caller channel disables across both the primary route and
  1016	    // every fallback tier. useGraph=false also disables the dependent degree lane.
  1017	    const allowedChannels = getAllowedChannels(options);
  1018	    for (const channel of allPossibleChannels) {
  1019	      if (!allowedChannels.has(channel)) activeChannels.delete(channel);
  1020	    }
  1021	
  1022	    const skippedChannels = allPossibleChannels.filter(ch => !activeChannels.has(ch));
  1023	
  1024	    if (skippedChannels.length > 0) {
  1025	      s3meta.routing = {
  1026	        tier: routeResult.tier,
  1027	        channels: routeResult.channels,
  1028	        skippedChannels,
  1029	        featureFlagEnabled: isComplexityRouterEnabled(),
  1030	        confidence: routeResult.classification.confidence,
  1031	        features: routeResult.classification.features as Record<string, unknown>,
  1032	      };
  1033	    }
  1034	
  1035	    // -- Stage E: Dynamic Token Budget (SPECKIT_DYNAMIC_TOKEN_BUDGET) --
  1036	    // Compute tier-aware budget early so it's available for downstream truncation.
  1037	    // When disabled, getDynamicTokenBudget returns the default 4000 budget with applied=false.
  1038	    const budgetResult = getDynamicTokenBudget(routeResult.tier);
  1039	    if (budgetResult.applied && !evaluationMode) {
  1040	      s3meta.tokenBudget = {
  1041	        tier: budgetResult.tier,
  1042	        budget: budgetResult.budget,
  1043	        applied: budgetResult.applied,
  1044	        featureFlagEnabled: isDynamicTokenBudgetEnabled(),
  1045	        configValues: DEFAULT_TOKEN_BUDGET_CONFIG as unknown as Record<string, number>,
  1046	        // headerOverhead and adjustedBudget are patched in below after they are computed
  1047	        headerOverhead: 0,
  1048	        adjustedBudget: budgetResult.budget,
  1049	      };
  1050	    }
  1051	
  1052	    // Channel results collected independently, merged after all complete
  1053	    let semanticResults: Array<{ id: number | string; source: string; [key: string]: unknown }> = [];
  1054	    let ftsChannelResults: HybridSearchResult[] = [];
  1055	    let bm25ChannelResults: HybridSearchResult[] = [];
  1056	    const vectorEmbeddingCache = new Map<number, Float32Array>();
  1057	
  1058	    // All channels use synchronous better-sqlite3; sequential execution
  1059	    // Is correct — Promise.all adds overhead without parallelism.
  1060	
  1061	    // Vector channel — gated by query-complexity routing
  1062	    if (activeChannels.has('vector') && embedding && vectorSearchFn) {
  1063	      try {
  1064	        const vectorResults = vectorSearchFn(embedding, {
  1065	          limit: options.limit || DEFAULT_LIMIT,
  1066	          specFolder: options.specFolder,
  1067	          minSimilarity: options.minSimilarity || 0,
  1068	          includeConstitutional: false,
  1069	          includeArchived: options.includeArchived || false,
  1070	          includeEmbeddings: true,
  1071	        });
  1072	        semanticResults = vectorResults.map((r: Record<string, unknown>): { id: number | string; source: string; [key: string]: unknown } => ({
  1073	          ...r,
  1074	          id: r.id as number | string,
  1075	          source: 'vector',
  1076	        }));
  1077	        for (const result of semanticResults) {
  1078	          if (typeof result.id !== 'number') continue;
  1079	          const embeddingCandidate = toEmbeddingBufferView(
  1080	            (result as Record<string, unknown>).embedding
  1081	            ?? (result as Record<string, unknown>).embeddingBuffer
  1082	          );
  1083	          if (embeddingCandidate) {
  1084	            vectorEmbeddingCache.set(result.id, embeddingCandidate);
  1085	          }
  1086	        }
  1087	        lists.push({ source: 'vector', results: semanticResults, weight: 1.0 });
  1088	      } catch (_err: unknown) {
  1089	        // Non-critical — vector channel failure does not block pipeline
  1090	        console.warn('[hybrid-search] Channel error:', _err instanceof Error ? _err.message : String(_err));
  1091	      }
  1092	    }
  1093	
  1094	    // FTS channel (internal error handling in ftsSearch) — gated by query-complexity routing
  1095	    if (activeChannels.has('fts')) {
  1096	      ftsChannelResults = ftsSearch(query, options);
  1097	      if (ftsChannelResults.length > 0) {
  1098	        // FTS weight reduced to 0.3 after ablation showed 0.8 was harmful,
  1099	        // flooding top-K with noisy lexical matches despite its exact-match value.
  1100	        lists.push({ source: 'fts', results: ftsChannelResults, weight: 0.3 });
  1101	      }
  1102	    }
  1103	
  1104	    // BM25 channel (internal error handling in bm25Search) — gated by query-complexity routing
  1105	    if (activeChannels.has('bm25')) {
  1106	      bm25ChannelResults = bm25Search(query, options);
  1107	      if (bm25ChannelResults.length > 0) {
  1108	        // BM25 weight 0.6 is lowest lexical channel — in-memory BM25 index
  1109	        // Has less precise scoring than SQLite FTS5 BM25; kept for coverage breadth.
  1110	        lists.push({ source: 'bm25', results: bm25ChannelResults, weight: 0.6 });
  1111	      }
  1112	    }
  1113	
  1114	    // Graph channel — gated by query-complexity routing
  1115	    const useGraph = (options.useGraph !== false) && activeChannels.has('graph');
  1116	    if (useGraph && graphSearchFn) {
  1117	      try {
  1118	        graphMetrics.totalQueries++; // counted only if channel executes
  1119	        const graphResults = graphSearchFn(query, {
  1120	          limit: options.limit || DEFAULT_LIMIT,
  1121	          specFolder: options.specFolder,
  1122	          intent: options.intent,
  1123	        });
  1124	        if (graphResults.length > 0) {
  1125	          graphMetrics.graphHits++;
  1126	          lists.push({ source: 'graph', results: graphResults.map((r: Record<string, unknown>) => ({
  1127	            ...r,
  1128	            id: r.id as number | string,
  1129	          })), weight: 0.5 });
  1130	        }
  1131	      } catch (_err: unknown) {
  1132	        // Non-critical — graph channel failure does not block pipeline
  1133	        console.warn('[hybrid-search] Channel error:', _err instanceof Error ? _err.message : String(_err));
  1134	      }
  1135	    }
  1136	
  1137	    // Degree channel re-ranks based on causal-edge connectivity.
  1138	    // Graduated: default-ON. Set SPECKIT_DEGREE_BOOST=false to disable.
  1139	    // Degree channel — also gated by query-complexity routing
  1140	    if (activeChannels.has('degree') && db && isDegreeBoostEnabled()) {
  1141	      try {
  1142	        // Collect all numeric IDs from existing channels
  1143	        const allResultIds = new Set<number>();
  1144	        for (const list of lists) {
  1145	          for (const r of list.results) {
  1146	            const id = r.id;
  1147	            if (typeof id === 'number') allResultIds.add(id);
  1148	          }
  1149	        }
  1150	
  1151	        if (allResultIds.size > 0) {
  1152	          const degreeScores = computeDegreeScores(db, Array.from(allResultIds));
  1153	
  1154	          // Build a ranked list sorted by degree score (highest first)
  1155	          const degreeItems: Array<{ id: number; degreeScore: number }> = [];
  1156	          for (const [idStr, score] of degreeScores) {
  1157	            const numId = Number(idStr);
  1158	            if (score > 0 && !isNaN(numId)) {
  1159	              degreeItems.push({ id: numId, degreeScore: score });
  1160	            }
  1161	          }
  1162	          degreeItems.sort((a, b) => b.degreeScore - a.degreeScore);
  1163	
  1164	          if (degreeItems.length > 0) {
  1165	            lists.push({
  1166	              source: 'degree',
  1167	              results: degreeItems.map(item => ({
  1168	                id: item.id,
  1169	                degreeScore: item.degreeScore,
  1170	              })),
  1171	              weight: DEGREE_CHANNEL_WEIGHT,
  1172	            });
  1173	          }
  1174	        }
  1175	      } catch (_err: unknown) {
  1176	        // Non-critical — degree channel failure does not block pipeline
  1177	        console.warn('[hybrid-search] Channel error:', _err instanceof Error ? _err.message : String(_err));
  1178	      }
  1179	    }
  1180	
  1181	    // Merge keyword results after all channels complete
  1182	    const keywordResults: Array<{ id: number | string; source: string; [key: string]: unknown }> = [
  1183	      ...ftsChannelResults,
  1184	      ...bm25ChannelResults,
  1185	    ];

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts | sed -n '500,930p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   500	  //
   501	  // When SPECKIT_GRAPH_CONCEPT_ROUTING is enabled, extract noun phrases from
   502	  // the query and match them against the concept alias table. If concepts are
   503	  // matched, log them to the trace for downstream use (graph channel activation
   504	  // is surfaced via trace metadata; actual graph channel is handled in Stage 2).
   505	  //
   506	  // Phase B T016: When SPECKIT_QUERY_CONCEPT_EXPANSION is also enabled,
   507	  // matched concepts are reverse-mapped to their alias terms and appended to
   508	  // the query for the hybrid search channel, improving recall for alias-rich
   509	  // queries (e.g. "semantic search" → also searches "retrieval", "query", etc.).
   510	  //
   511	  // Fail-open: any error leaves candidates unchanged.
   512	
   513	  /** Effective query for hybrid search — may be expanded by concept routing. */
   514	  let effectiveQuery = query;
   515	
   516	  if (isGraphConceptRoutingEnabled() && searchType === 'hybrid') {
   517	    try {
   518	      let routingDb: Parameters<typeof routeQueryConcepts>[1];
   519	      try {
   520	        routingDb = requireDb();
   521	      } catch (_dbErr: unknown) {
   522	        routingDb = undefined;
   523	      }
   524	      const routing = routeQueryConcepts(query, routingDb);
   525	      if (routing.graphActivated && routing.concepts.length > 0) {
   526	        // Phase B T016: Expand query with concept alias terms
   527	        if (isQueryConceptExpansionEnabled()) {
   528	          try {
   529	            const originalTokens = nounPhrases(query);
   530	            const expansionTerms = getConceptExpansionTerms(
   531	              routing.concepts,
   532	              originalTokens,
   533	              5,
   534	            );
   535	            if (expansionTerms.length > 0) {
   536	              effectiveQuery = `${query} ${expansionTerms.join(' ')}`;
   537	              if (trace) {
   538	                addTraceEntry(trace, 'candidate', 0, 0, 0, {
   539	                  channel: 'd2-concept-expansion',
   540	                  originalQuery: query,
   541	                  expandedQuery: effectiveQuery,
   542	                  expansionTerms,
   543	                  matchedConcepts: routing.concepts,
   544	                });
   545	              }
   546	            }
   547	          } catch (expansionErr: unknown) {
   548	            const expansionMsg = expansionErr instanceof Error ? expansionErr.message : String(expansionErr);
   549	            console.warn(`[stage1-candidate-gen] D2 concept expansion failed (fail-open): ${expansionMsg}`);
   550	          }
   551	        }
   552	
   553	        if (trace) {
   554	          addTraceEntry(trace, 'candidate', 0, 0, 0, {
   555	            channel: 'd2-concept-routing',
   556	            matchedConcepts: routing.concepts,
   557	            graphActivated: true,
   558	          });
   559	        }
   560	      }
   561	    } catch (routingErr: unknown) {
   562	      const routingMsg = routingErr instanceof Error ? routingErr.message : String(routingErr);
   563	      console.warn(`[stage1-candidate-gen] D2 concept routing failed: ${routingMsg}`);
   564	    }
   565	  }
   566	
   567	  // -- Channel: Multi-Concept --------------------------------------------------
   568	
   569	  if (searchType === 'multi-concept' && Array.isArray(concepts) && concepts.length >= 2) {
   570	    // Validate concept list: 2-5 non-empty strings
   571	    if (concepts.length > 5) {
   572	      throw new Error('[stage1-candidate-gen] Maximum 5 concepts allowed for multi-concept search');
   573	    }
   574	
   575	    for (const concept of concepts) {
   576	      if (typeof concept !== 'string' || concept.trim().length === 0) {
   577	        throw new Error('[stage1-candidate-gen] Each concept must be a non-empty string');
   578	      }
   579	    }
   580	
   581	    // Generate one embedding per concept
   582	    const conceptEmbeddings: Float32Array[] = [];
   583	    for (const concept of concepts) {
   584	      const emb = await embeddings.generateQueryEmbedding(concept);
   585	      if (!emb) {
   586	        throw new Error(
   587	          `[stage1-candidate-gen] Failed to generate embedding for concept: "${concept}"`
   588	        );
   589	      }
   590	      conceptEmbeddings.push(emb);
   591	    }
   592	
   593	    channelCount = 1;
   594	    candidates = vectorIndex.multiConceptSearch(conceptEmbeddings, {
   595	      minSimilarity: MULTI_CONCEPT_MIN_SIMILARITY,
   596	      limit,
   597	      specFolder,
   598	      includeArchived,
   599	    }) as PipelineRow[];
   600	  }
   601	
   602	  // -- Channel: Hybrid (with optional deep-mode query expansion) ---------------
   603	  //
   604	  else if (searchType === 'hybrid') {
   605	    // Resolve the query embedding — either pre-computed in config or generate now
   606	    // Fix #16 — Cache this embedding for reuse in constitutional injection path
   607	    // To avoid a duplicate generateQueryEmbedding() call.
   608	    const effectiveEmbedding: Float32Array | number[] | null =
   609	      queryEmbedding ?? (await embeddings.generateQueryEmbedding(query));
   610	    cachedEmbedding = effectiveEmbedding;
   611	
   612	    if (!effectiveEmbedding) {
   613	      throw new Error('[stage1-candidate-gen] Failed to generate embedding for hybrid search query');
   614	    }
   615	
   616	    // Deep mode: expand query into variants and run hybrid for each, then dedup
   617	    if (mode === 'deep' && isMultiQueryEnabled()) {
   618	      // -- D2 REQ-D2-001: Query Decomposition (SPECKIT_QUERY_DECOMPOSITION) ---
   619	      //
   620	      // When enabled and the query is multi-faceted, decompose into up to 3
   621	      // sub-query facets and run hybrid search per facet. Results are merged
   622	      // by facet coverage (items appearing in multiple facets rank higher).
   623	      //
   624	      // This block takes the place of the synonym-expansion path below when
   625	      // decomposition fires. If decomposition is disabled, not applicable, or
   626	      // fails, execution falls through to the existing expansion logic.
   627	
   628	      if (isQueryDecompositionEnabled() && isMultiFacet(query)) {
   629	        try {
   630	          const normalizedQuery = normalizeFacetText(query);
   631	          let facets: string[] = [];
   632	
   633	          try {
   634	            facets = buildQueryDecompositionPool(query, mode)
   635	              .filter((facet) => facet !== normalizedQuery)
   636	              .map(normalizeFacetText)
   637	              .filter((facet) => facet.length > 0);
   638	          } catch (facetErr: unknown) {
   639	            const facetMsg = facetErr instanceof Error ? facetErr.message : String(facetErr);
   640	            console.warn(
   641	              `[stage1-candidate-gen] D2 faceted query decomposition failed, falling back to basic decomposition: ${facetMsg}`
   642	            );
   643	          }
   644	
   645	          if (facets.length === 0) {
   646	            facets = decompose(query)
   647	              .map(normalizeFacetText)
   648	              .filter((facet) => facet.length > 0 && facet !== normalizedQuery);
   649	          }
   650	
   651	          facets = [...new Set(facets)].slice(0, MAX_QUERY_DECOMPOSITION_FACETS);
   652	
   653	          if (facets.length > 0) {
   654	            // Run hybrid for the original query plus each facet, in parallel
   655	            const allQueries = [query, ...facets];
   656	            // FIX #7: Use Promise.allSettled so one failing facet branch
   657	            // does not discard results from all other branches.
   658	            const facetSettledResults = await withTimeout(
   659	              Promise.allSettled(
   660	                allQueries.map(async (q): Promise<PipelineRow[]> => {
   661	                  const facetEmbedding = await embeddings.generateQueryEmbedding(q);
   662	                  if (!facetEmbedding) {
   663	                    console.warn('[stage1-candidate-gen] D2 facet embedding generation returned null');
   664	                    return [];
   665	                  }
   666	                  return hybridSearch.collectRawCandidates(
   667	                    q,
   668	                    facetEmbedding,
   669	                    { limit, specFolder, includeArchived }
   670	                  ) as Promise<PipelineRow[]>;
   671	                })
   672	              ),
   673	              DECOMPOSITION_TIMEOUT_MS,
   674	              'D2 facet decomposition',
   675	            );
   676	            const facetResultSets = facetSettledResults.map((result, idx) => {
   677	              if (result.status === 'fulfilled') return result.value;
   678	              console.warn(`[stage1-candidate-gen] D2 facet branch ${idx} rejected: ${result.reason}`);
   679	              return [] as PipelineRow[];
   680	            });
   681	
   682	            channelCount = allQueries.length;
   683	            const pools = allQueries.map((q, i) => ({
   684	              query: q,
   685	              results: facetResultSets[i] ?? [],
   686	            }));
   687	            candidates = mergeFacetCoveragePools(pools);
   688	
   689	            if (trace) {
   690	              addTraceEntry(trace, 'candidate', channelCount, candidates.length, 0, {
   691	                channel: 'd2-query-decomposition',
   692	                originalQuery: query,
   693	                facets,
   694	                facetCount: facets.length,
   695	              });
   696	            }
   697	
   698	            // Skip the standard deep-mode expansion path below
   699	            // (jump to post-channel processing via the else-if chain)
   700	          }
   701	        } catch (decompErr: unknown) {
   702	          const decompMsg = decompErr instanceof Error ? decompErr.message : String(decompErr);
   703	          console.warn(
   704	            `[stage1-candidate-gen] D2 query decomposition failed, falling through to expansion: ${decompMsg}`
   705	          );
   706	          // Fall through to standard deep expansion path below (candidates is empty)
   707	        }
   708	      }
   709	
   710	      // Only run existing expansion logic when decomposition did not produce results
   711	      if (candidates.length === 0) {
   712	
   713	      const queryVariants = await buildDeepQueryVariants(query);
   714	
   715	      if (queryVariants.length > 1) {
   716	        try {
   717	          // F1: Wrap parallel variant searches with latency budget.
   718	          // If variants exceed DEEP_EXPANSION_TIMEOUT_MS, fall back to base query.
   719	          // FIX #7: Use Promise.allSettled so one failing variant does not
   720	          // discard results from all other variant branches.
   721	          const variantSettledResults = await withTimeout(
   722	            Promise.allSettled(
   723	              queryVariants.map(async (variant): Promise<PipelineRow[]> => {
   724	                const variantEmbedding = await embeddings.generateQueryEmbedding(variant);
   725	                if (!variantEmbedding) {
   726	                  console.warn('[stage1-candidate-gen] Deep variant embedding generation returned null');
   727	                  return [];
   728	                }
   729	                const variantResults = await hybridSearch.collectRawCandidates(
   730	                  variant,
   731	                  variantEmbedding,
   732	                  { limit, specFolder, includeArchived }
   733	                );
   734	                return variantResults as PipelineRow[];
   735	              })
   736	            ),
   737	            DEEP_EXPANSION_TIMEOUT_MS,
   738	            'Deep-mode query expansion',
   739	          );
   740	          const variantResultSets: PipelineRow[][] = variantSettledResults.map((result, idx) => {
   741	            if (result.status === 'fulfilled') return result.value;
   742	            console.warn(`[stage1-candidate-gen] Deep variant branch ${idx} rejected: ${result.reason}`);
   743	            return [] as PipelineRow[];
   744	          });
   745	
   746	          channelCount = queryVariants.length;
   747	
   748	          // Merge variant results, deduplicate by id, preserve first-occurrence order
   749	          candidates = mergeCandidateBatches(
   750	            variantResultSets.map((rows, index) => ({
   751	              label: queryVariants[index] ?? `deep-variant-${index}`,
   752	              rows,
   753	            })),
   754	          );
   755	        } catch (expandErr: unknown) {
   756	          const expandMsg =
   757	            expandErr instanceof Error ? expandErr.message : String(expandErr);
   758	          console.warn(
   759	            `[stage1-candidate-gen] Deep query expansion failed, falling back to single hybrid: ${expandMsg}`
   760	          );
   761	          // Fall through to single hybrid search below
   762	          channelCount = 1;
   763	          candidates = (await hybridSearch.collectRawCandidates(
   764	            query,
   765	            effectiveEmbedding,
   766	            { limit, specFolder, includeArchived }
   767	          )) as PipelineRow[];
   768	        }
   769	      } else {
   770	        // ExpandQuery returned only the original; treat as standard hybrid
   771	        channelCount = 1;
   772	        candidates = (await hybridSearch.collectRawCandidates(
   773	          query,
   774	          effectiveEmbedding,
   775	          { limit, specFolder, includeArchived }
   776	        )) as PipelineRow[];
   777	      }
   778	
   779	      } // end: if (candidates.length === 0)
   780	    } else {
   781	      // -- R12: Embedding-based query expansion (SPECKIT_EMBEDDING_EXPANSION) --
   782	      //
   783	      // When R12 is enabled and R15 does not classify the query as "simple",
   784	      // We expand the query using embedding similarity to find related terms
   785	      // From the memory index. The expanded query is used as an additional
   786	      // Hybrid search channel whose results are merged with the baseline.
   787	      //
   788	      // Mutual exclusion: isExpansionActive() returns false when R15 classifies
   789	      // The query as "simple", suppressing expansion with zero added latency.
   790	
   791	      let r12ExpansionApplied = false;
   792	
   793	      if (isEmbeddingExpansionEnabled() && isExpansionActive(query)) {
   794	        try {
   795	          // ExpandQueryWithEmbeddings requires a Float32Array; the effective
   796	          // Embedding may be a number[] when generated by some providers, so
   797	          // Convert if necessary before passing it in.
   798	          const expansionEmbedding: Float32Array =
   799	            effectiveEmbedding instanceof Float32Array
   800	              ? effectiveEmbedding
   801	              : Float32Array.from(effectiveEmbedding as number[]);
   802	
   803	          const expanded = await expandQueryWithEmbeddings(query, expansionEmbedding, {
   804	            limit: DEFAULT_EXPANSION_CANDIDATE_LIMIT,
   805	          });
   806	
   807	          // Only run an extra channel if the expansion actually produced new terms
   808	          if (expanded.expanded.length > 0 && expanded.combinedQuery !== query) {
   809	            // Run the baseline and the expanded query in parallel
   810	            const [baselineResults, expansionResults] = await Promise.all([
   811	              hybridSearch.collectRawCandidates(
   812	                query,
   813	                effectiveEmbedding,
   814	                { limit, specFolder, includeArchived }
   815	              ).catch((err: unknown): PipelineRow[] => {
   816	                console.warn(
   817	                  '[stage1-candidate-gen] Baseline candidate collection failed:',
   818	                  err instanceof Error ? err.message : String(err)
   819	                );
   820	                return [];
   821	              }),
   822	              embeddings.generateQueryEmbedding(expanded.combinedQuery).then(
   823	                async (expandedEmb): Promise<PipelineRow[]> => {
   824	                  if (!expandedEmb) {
   825	                    console.warn('[stage1-candidate-gen] Expanded query embedding generation returned null');
   826	                    return [];
   827	                  }
   828	                  return hybridSearch.collectRawCandidates(
   829	                    expanded.combinedQuery,
   830	                    expandedEmb,
   831	                    { limit, specFolder, includeArchived }
   832	                  ) as Promise<PipelineRow[]>;
   833	                }
   834	              ).catch((err: unknown): PipelineRow[] => {
   835	                console.warn(
   836	                  '[stage1-candidate-gen] Expansion candidate collection failed:',
   837	                  err instanceof Error ? err.message : String(err)
   838	                );
   839	                return [];
   840	              }),
   841	            ]);
   842	
   843	            channelCount = 2;
   844	            r12ExpansionApplied = true;
   845	
   846	            // Merge both result sets, deduplicate by id, baseline-first ordering
   847	            // So baseline scores dominate when the same memory appears in both.
   848	            candidates = mergeCandidateBatches([
   849	              { label: query, rows: baselineResults as PipelineRow[] },
   850	              { label: expanded.combinedQuery, rows: expansionResults as PipelineRow[] },
   851	            ]);
   852	
   853	            if (trace) {
   854	              addTraceEntry(trace, 'candidate', channelCount, candidates.length, 0, {
   855	                channel: 'r12-embedding-expansion',
   856	                expandedTerms: expanded.expanded,
   857	                combinedQuery: expanded.combinedQuery,
   858	              });
   859	            }
   860	          }
   861	        } catch (r12Err: unknown) {
   862	          const r12Msg = r12Err instanceof Error ? r12Err.message : String(r12Err);
   863	          console.warn(
   864	            `[stage1-candidate-gen] R12 embedding expansion failed, using standard hybrid: ${r12Msg}`
   865	          );
   866	        }
   867	      }
   868	
   869	      // Standard hybrid search — runs when R12 is off, suppressed by R15,
   870	      // Or produced no results (candidates still empty from the try block above).
   871	      // Phase B T016: Uses effectiveQuery (concept-expanded) for BM25 recall.
   872	      if (!r12ExpansionApplied) {
   873	        try {
   874	          channelCount = 1;
   875	          const hybridResults = (await hybridSearch.collectRawCandidates(
   876	            effectiveQuery,
   877	            effectiveEmbedding,
   878	            { limit, specFolder, includeArchived }
   879	          )) as PipelineRow[];
   880	          candidates = hybridResults;
   881	        } catch (hybridErr: unknown) {
   882	          const hybridMsg =
   883	            hybridErr instanceof Error ? hybridErr.message : String(hybridErr);
   884	          console.warn(
   885	            `[stage1-candidate-gen] Hybrid search failed, falling back to vector: ${hybridMsg}`
   886	          );
   887	
   888	          // Fallback: pure vector search
   889	          channelCount = 1;
   890	          let vectorResults = vectorIndex.vectorSearch(effectiveEmbedding, {
   891	            limit,
   892	            specFolder,
   893	            tier,
   894	            contextType,
   895	            includeConstitutional: false, // Constitutional managed separately below
   896	            includeArchived,
   897	          }) as PipelineRow[];
   898	          if (isTemporalContiguityEnabled()) {
   899	            vectorResults = (
   900	              vectorSearchWithContiguity(
   901	                vectorResults as Array<PipelineRow & { similarity: number; created_at: string }>,
   902	                3600,
   903	              ) as PipelineRow[] | null
   904	            ) ?? vectorResults;
   905	          }
   906	          candidates = vectorResults;
   907	
   908	          if (trace) {
   909	            addTraceEntry(trace, 'fallback', 0, candidates.length, 0, {
   910	              reason: hybridMsg,
   911	              channel: 'vector',
   912	            });
   913	          }
   914	        }
   915	      }
   916	    }
   917	  }
   918	
   919	  // -- Channel: Vector ---------------------------------------------------------
   920	
   921	  else if (searchType === 'vector') {
   922	    const effectiveEmbedding: Float32Array | number[] | null =
   923	      queryEmbedding ?? (await embeddings.generateQueryEmbedding(query));
   924	
   925	    if (!effectiveEmbedding) {
   926	      throw new Error('[stage1-candidate-gen] Failed to generate embedding for vector search query');
   927	    }
   928	
   929	    channelCount = 1;
   930	    let vectorResults = vectorIndex.vectorSearch(effectiveEmbedding, {

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts | sed -n '1080,1215p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1080	  //   1. Retrieve top-3 seed results via fast BM25/FTS5 (no embedding call).
  1081	  //   2. Ask the LLM to produce a step-back abstraction + corpus-grounded variants.
  1082	  //   3. Fan-out [original, abstract, ...variants] as additional hybrid search channels.
  1083	  //   4. Deduplicate and merge into candidates.
  1084	  //
  1085	  // Budget: 1 LLM call per cache miss (0 on cache hit).
  1086	  // Fail-open: any error leaves candidates unchanged.
  1087	
  1088	  if (mode === 'deep' && isLlmReformulationEnabled() && searchType === 'hybrid') {
  1089	    try {
  1090	      const seeds = cheapSeedRetrieve(query, { limit: 3 });
  1091	      const reform = await llm.rewrite({ q: query, seeds, mode: 'step_back+corpus' });
  1092	      const allQueries = fanout([query, reform.abstract, ...reform.variants]);
  1093	
  1094	      if (allQueries.length > 1) {
  1095	        const reformEmbedding: Float32Array | number[] | null =
  1096	          cachedEmbedding ?? queryEmbedding ?? (await embeddings.generateQueryEmbedding(query));
  1097	
  1098	        if (reformEmbedding) {
  1099	          // FIX #7: Use Promise.allSettled so one failing reformulation
  1100	          // branch does not discard results from all other branches.
  1101	          const reformSettledResults = await Promise.allSettled(
  1102	            allQueries.map(async (q, idx): Promise<PipelineRow[]> => {
  1103	              // Reuse cached embedding for original query (idx 0); generate fresh for variants
  1104	              const emb = idx === 0 ? reformEmbedding : await embeddings.generateQueryEmbedding(q);
  1105	              if (!emb) {
  1106	                console.warn('[stage1-candidate-gen] LLM reform embedding generation returned null');
  1107	                return [];
  1108	              }
  1109	              return hybridSearch.collectRawCandidates(
  1110	                q,
  1111	                emb,
  1112	                { limit, specFolder, includeArchived }
  1113	              ) as Promise<PipelineRow[]>;
  1114	            })
  1115	          );
  1116	          const reformResultSets = reformSettledResults.map((result, idx) => {
  1117	            if (result.status === 'fulfilled') return result.value;
  1118	            console.warn(`[stage1-candidate-gen] D2 LLM reform branch ${idx} rejected: ${result.reason}`);
  1119	            return [] as PipelineRow[];
  1120	          });
  1121	
  1122	          if (reformResultSets.length > 0) {
  1123	            const filteredReformSets = reformResultSets.map((resultSet, index) => {
  1124	              let rows = shouldApplyScopeFiltering
  1125	                ? filterRowsByScope(resultSet, scopeFilter, allowedSharedSpaceIds)
  1126	                : resultSet;
  1127	              if (contextType) {
  1128	                rows = rows.filter((r) => resolveRowContextType(r) === contextType);
  1129	              }
  1130	              if (tier) {
  1131	                rows = applyTierFilter(rows, tier);
  1132	              }
  1133	              rows = backfillMissingQualityScores(rows);
  1134	              rows = filterByMinQualityScore(rows, qualityThreshold);
  1135	              return {
  1136	                label: allQueries[index] ?? `d2-reform-${index}`,
  1137	                rows,
  1138	              };
  1139	            });
  1140	            const reformMergedCount = filteredReformSets.reduce((sum, batch) => sum + batch.rows.length, 0);
  1141	            candidates = mergeCandidateBatches(filteredReformSets, {
  1142	              seedCandidates: candidates,
  1143	              seedLabel: query,
  1144	            });
  1145	            channelCount += allQueries.length - 1; // discount original (already counted)
  1146	
  1147	            if (trace) {
  1148	              addTraceEntry(trace, 'candidate', allQueries.length - 1, reformMergedCount, 0, {
  1149	                channel: 'd2-llm-reformulation',
  1150	                abstract: reform.abstract,
  1151	                variantCount: reform.variants.length,
  1152	                fanoutCount: allQueries.length,
  1153	              });
  1154	            }
  1155	          }
  1156	        }
  1157	      }
  1158	    } catch (reformErr: unknown) {
  1159	      const reformMsg = reformErr instanceof Error ? reformErr.message : String(reformErr);
  1160	      console.warn(`[stage1-candidate-gen] D2 LLM reformulation failed: ${reformMsg}`);
  1161	    }
  1162	  }
  1163	
  1164	  // -- D2 REQ-D2-004: HyDE Shadow Mode ----------------------------------------
  1165	  //
  1166	  // When SPECKIT_HYDE is enabled and mode === 'deep':
  1167	  //   - Check if the current baseline has low confidence.
  1168	  //   - If so, generate a HyDE pseudo-document and embed it.
  1169	  //   - Run a vector-only search with the pseudo-document embedding.
  1170	  //   - Shadow mode (SPECKIT_HYDE_ACTIVE=false): log results, do NOT merge.
  1171	  //   - Active mode (SPECKIT_HYDE_ACTIVE=true): merge into candidates.
  1172	  //
  1173	  // Budget: 1 LLM call per cache miss (shared cache with reformulation → ≤2 total).
  1174	  // Fail-open: any error leaves candidates unchanged.
  1175	
  1176	  if (mode === 'deep' && isHyDEEnabled() && searchType === 'hybrid') {
  1177	    try {
  1178	      const rawHydeCandidates = await runHyDE(query, candidates, limit, specFolder);
  1179	      const hydeCandidates = shouldApplyScopeFiltering
  1180	        ? filterRowsByScope(rawHydeCandidates, scopeFilter, allowedSharedSpaceIds)
  1181	        : rawHydeCandidates;
  1182	      if (hydeCandidates.length > 0) {
  1183	        let newHydeCandidates = hydeCandidates;
  1184	        // H11 FIX: Apply the same tier/context/quality filters as main candidates
  1185	        if (contextType) {
  1186	          newHydeCandidates = newHydeCandidates.filter((r) => resolveRowContextType(r) === contextType);
  1187	        }
  1188	        if (tier) {
  1189	          newHydeCandidates = applyTierFilter(newHydeCandidates, tier);
  1190	        }
  1191	        newHydeCandidates = backfillMissingQualityScores(newHydeCandidates);
  1192	        newHydeCandidates = filterByMinQualityScore(newHydeCandidates, qualityThreshold);
  1193	        candidates = mergeCandidateBatches([
  1194	          { label: 'hyde', rows: newHydeCandidates },
  1195	        ], {
  1196	          seedCandidates: candidates,
  1197	          seedLabel: query,
  1198	        });
  1199	        channelCount++;
  1200	
  1201	        if (trace) {
  1202	          addTraceEntry(trace, 'candidate', 1, newHydeCandidates.length, 0, {
  1203	            channel: 'd2-hyde',
  1204	            hydeCandidates: newHydeCandidates.length,
  1205	          });
  1206	        }
  1207	      }
  1208	    } catch (hydeErr: unknown) {
  1209	      const hydeMsg = hydeErr instanceof Error ? hydeErr.message : String(hydeErr);
  1210	      console.warn(`[stage1-candidate-gen] D2 HyDE failed: ${hydeMsg}`);
  1211	    }
  1212	  }
  1213	
  1214	  // -- R8: Summary Embedding Channel ---------------------------------------
  1215	  // When SPECKIT_MEMORY_SUMMARIES is enabled (default-ON) and scale gate is

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Sqlite Fts
     3	// ───────────────────────────────────────────────────────────────
     4	// Feature catalog: Semantic and lexical search (memory_search)
     5	// Weighted BM25 scoring for FTS5 full-text search.
     6	// Extracted from hybrid-search.ts ftsSearch() for independent
     7	// Testing and future delegation.
     8	
     9	import { BM25_FTS5_WEIGHTS, normalizeLexicalQueryTokens } from './bm25-index.js';
    10	import type Database from 'better-sqlite3';
    11	
    12	// ───────────────────────────────────────────────────────────────
    13	// 2. INTERFACES
    14	
    15	// ───────────────────────────────────────────────────────────────
    16	interface FtsBm25Result {
    17	  id: number;
    18	  fts_score: number;
    19	  [key: string]: unknown;
    20	}
    21	
    22	interface FtsBm25Options {
    23	  limit?: number;
    24	  specFolder?: string;
    25	  includeArchived?: boolean;
    26	}
    27	
    28	type LexicalPath = 'fts5' | 'like' | 'unavailable';
    29	type FallbackState =
    30	  | 'ok'
    31	  | 'compile_probe_miss'
    32	  | 'missing_table'
    33	  | 'no_such_module_fts5'
    34	  | 'bm25_runtime_failure';
    35	
    36	interface LexicalCapabilitySnapshot {
    37	  lexicalPath: LexicalPath;
    38	  fallbackState: FallbackState;
    39	}
    40	
    41	let lastLexicalCapabilitySnapshot: LexicalCapabilitySnapshot | null = null;
    42	
    43	function cloneLexicalCapabilitySnapshot(
    44	  snapshot: LexicalCapabilitySnapshot | null
    45	): LexicalCapabilitySnapshot | null {
    46	  return snapshot ? { ...snapshot } : null;
    47	}
    48	
    49	function setLastLexicalCapabilitySnapshot(snapshot: LexicalCapabilitySnapshot): void {
    50	  lastLexicalCapabilitySnapshot = { ...snapshot };
    51	}
    52	
    53	function getLastLexicalCapabilitySnapshot(): LexicalCapabilitySnapshot | null {
    54	  return cloneLexicalCapabilitySnapshot(lastLexicalCapabilitySnapshot);
    55	}
    56	
    57	function resetLastLexicalCapabilitySnapshot(): void {
    58	  lastLexicalCapabilitySnapshot = null;
    59	}
    60	
    61	function toErrorMessage(error: unknown): string {
    62	  return error instanceof Error ? error.message : String(error);
    63	}
    64	
    65	function readCompileOptionValue(row: unknown): string | null {
    66	  if (typeof row === 'string') {
    67	    return row;
    68	  }
    69	  if (!row || typeof row !== 'object') {
    70	    return null;
    71	  }
    72	
    73	  const record = row as Record<string, unknown>;
    74	  const direct = record.compile_options;
    75	  if (typeof direct === 'string') {
    76	    return direct;
    77	  }
    78	
    79	  const firstString = Object.values(record).find((value) => typeof value === 'string');
    80	  return typeof firstString === 'string' ? firstString : null;
    81	}
    82	
    83	function isNoSuchModuleFts5Error(error: unknown): boolean {
    84	  return toErrorMessage(error).toLowerCase().includes('no such module: fts5');
    85	}
    86	
    87	function isBm25RuntimeFailure(error: unknown): boolean {
    88	  const message = toErrorMessage(error).toLowerCase();
    89	  return message.includes('bm25');
    90	}
    91	
    92	function probeFts5Capability(db: Database.Database): LexicalCapabilitySnapshot {
    93	  try {
    94	    const compileRows = (db.prepare('PRAGMA compile_options') as Database.Statement).all() as unknown[];
    95	    const hasFts5CompileFlag = compileRows
    96	      .map(readCompileOptionValue)
    97	      .some((value) => typeof value === 'string' && value.toUpperCase().includes('ENABLE_FTS5'));
    98	
    99	    if (!hasFts5CompileFlag) {
   100	      return {
   101	        lexicalPath: 'unavailable',
   102	        fallbackState: 'compile_probe_miss',
   103	      };
   104	    }
   105	  } catch {
   106	    return {
   107	      lexicalPath: 'unavailable',
   108	      fallbackState: 'compile_probe_miss',
   109	    };
   110	  }
   111	
   112	  try {
   113	    const result = (db.prepare(
   114	      `SELECT name FROM sqlite_master WHERE type='table' AND name='memory_fts'`
   115	    ) as Database.Statement).get() as { name: string } | undefined;
   116	
   117	    if (!result) {
   118	      return {
   119	        lexicalPath: 'unavailable',
   120	        fallbackState: 'missing_table',
   121	      };
   122	    }
   123	  } catch (error: unknown) {
   124	    if (isNoSuchModuleFts5Error(error)) {
   125	      return {
   126	        lexicalPath: 'unavailable',
   127	        fallbackState: 'no_such_module_fts5',
   128	      };
   129	    }
   130	    return {
   131	      lexicalPath: 'unavailable',
   132	      fallbackState: 'missing_table',
   133	    };
   134	  }
   135	
   136	  return {
   137	    lexicalPath: 'fts5',
   138	    fallbackState: 'ok',
   139	  };
   140	}
   141	
   142	// ───────────────────────────────────────────────────────────────
   143	// 3. CORE FUNCTION
   144	
   145	// ───────────────────────────────────────────────────────────────
   146	/**
   147	 * Execute a weighted BM25 FTS5 search against memory_fts.
   148	 *
   149	 * Uses SQLite FTS5's built-in bm25() ranking function with
   150	 * per-column weights instead of the default `rank` pseudo-column.
   151	 * This gives title matches 10x weight, trigger_phrases 5x, etc.
   152	 *
   153	 * @param db - SQLite database connection
   154	 * @param query - Raw search query (will be sanitized)
   155	 * @param options - Search options (limit, specFolder, includeArchived)
   156	 * @returns Array of results with BM25 scores (higher = better)
   157	 * @example
   158	 * ```ts
   159	 * const rows = fts5Bm25Search(db, 'memory search', { limit: 10 });
   160	 * ```
   161	 */
   162	function fts5Bm25Search(
   163	  db: Database.Database,
   164	  query: string,
   165	  options: FtsBm25Options = {}
   166	): FtsBm25Result[] {
   167	  const { limit = 20, specFolder, includeArchived = false } = options;
   168	
   169	  // Sanitize via shared tokenizer, then wrap each token in quotes and join with OR for recall
   170	  const tokens = normalizeLexicalQueryTokens(query).fts;
   171	  const sanitized = tokens
   172	    .map(t => (t.startsWith('"') && t.endsWith('"')) ? t : `"${t}"`)
   173	    .join(' OR ');
   174	
   175	  if (!sanitized) {
   176	    setLastLexicalCapabilitySnapshot(probeFts5Capability(db));
   177	    return [];
   178	  }
   179	
   180	  const folderFilter = specFolder
   181	    ? 'AND (m.spec_folder = ? OR m.spec_folder LIKE ? || "/%")'
   182	    : '';
   183	  const archivalFilter = !includeArchived
   184	    ? 'AND (m.is_archived IS NULL OR m.is_archived = 0)'
   185	    : '';
   186	  const deprecatedTierFilter =
   187	    "AND (m.importance_tier IS NULL OR m.importance_tier != 'deprecated')";
   188	
   189	  const params: (string | number)[] = specFolder
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
   236	        }
   237	      : isBm25RuntimeFailure(error)
   238	        ? {
   239	            lexicalPath: 'unavailable',
   240	            fallbackState: 'bm25_runtime_failure',
   241	          }
   242	        : msg.toLowerCase().includes('no such table: memory_fts')
   243	          ? {
   244	              lexicalPath: 'unavailable',
   245	              fallbackState: 'missing_table',
   246	            }
   247	          : {
   248	              lexicalPath: 'unavailable',
   249	              fallbackState: 'bm25_runtime_failure',
   250	            };
   251	    setLastLexicalCapabilitySnapshot(failureSnapshot);
   252	    console.warn(`[sqlite-fts] BM25 FTS5 search failed: ${msg}`);
   253	    return [];
   254	  }
   255	}
   256	
   257	/**
   258	 * Check if the memory_fts FTS5 virtual table exists in the database.
   259	 *
   260	 * Used as a feature-detect before calling fts5Bm25Search, since FTS5

codex
I’ve got enough of the retrieval path to answer the central question now: lexical wins here when the query can be made token-aligned and field-aware, semantic wins when the user’s phrasing drifts away from stored vocabulary, and Public’s best move is tighter routing between those cases rather than choosing one side. I’m filling in a couple of supporting details from the FTS weights, README claims, and current validator output so the final recommendation set is precise and defensible.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.js | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
nl: .opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.js: No such file or directory

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/modus-memory-main/README.md | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
nl: .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/modus-memory-main/README.md: No such file or directory

exec
/bin/zsh -lc "printf '' | /bin/zsh -lc 'true'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '20,30p;456,466p;1274,1279p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
 succeeded in 0ms:
    20	
    21	- packet 002 status/traceability must reflect real downstream readiness; once the 010 validator exists, document 002 as “Implemented — predecessor verified” instead of blocked to avoid traceability P1 findings [Task 1]
    22	- packet 003 review references must point to real local review artifacts (for example `../review/003-memory-quality-issues/review-report.md`) so strict validator integrity checks pass [Task 1]
    23	- packet 008 structural-routing hint scope is bootstrap/request-shaped only; keep startup/resume hook generic and ensure docs + tests assert no “Structural Routing Hint” text is emitted when task-shaped context is absent [Task 1]
    24	- packet 010 degraded lexical lane vocabulary is `lexicalPath: 'unavailable'`; align runtime output, tests, README, and checklist language to this exact label [Task 1]
    25	- packet 013 benchmark evidence should cite `38/40` combined benchmark in checklist/report surfaces; stale `pass 28` wording is a known traceability finding trigger [Task 1]
    26	- packet 014 enrichment claims must stay graph-local; remove wording that implies resume/bootstrap carriage and keep ownership with packet 011 payload validators [Task 1]
    27	- verification pattern that closed the set: `npm run typecheck`, focused Vitest for `graph-first-routing-nudge` + `sqlite-fts` + `handler-memory-search`, then strict validate over phases 002/003/008/010/013/014 [Task 1]
    28	
    29	## Failures and how to do differently
    30	
   456	## Task 2: Rename packet `023-esm-module-compliance` to `023-hybrid-rag-fusion-refinement` and sync changelog references, outcome success
   457	
   458	### rollout_summary_files
   459	
   460	- rollout_summaries/2026-04-03T10-18-09-ppdB-rename_023_hybrid_rag_fusion_refinement.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/03/rollout-2026-04-03T12-18-09-019d52d9-a8b9-71c3-949c-f6870aee05a7.jsonl, updated_at=2026-04-03T10:43:47+00:00, thread_id=019d52d9-a8b9-71c3-949c-f6870aee05a7)
   461	
   462	### keywords
   463	
   464	- 023-hybrid-rag-fusion-refinement, memory_index_scan, memory_quick_search, parentChain, B3-hybrid-rag-fusion-refinement, .opencode/changelog
   465	
   466	## Task 3: Refresh references for renamed packet `040-sk-auto-deep-research-review-improvement`, outcome success
  1274	- Advisor benchmark/regression commands need explicit `--dataset` and semantic-disable env toggle for stable timing [Task 1]
  1275	
  1276	## Failures and how to do differently
  1277	
  1278	- symptom: benchmark p95 unexpectedly high; cause: builtin semantic latency noise; fix: disable builtin semantic path during benchmark runs [Task 1]
  1279	

codex
A couple of path assumptions were off in the supporting reads, so I’m correcting those directly instead of guessing. The main trade-off analysis is already grounded in source; this last pass is just tightening exact weight constants and README-claim validation.
exec
/bin/zsh -lc "rg --files .opencode/skill/system-spec-kit/mcp_server/lib/search | rg 'bm25-index\\.(ts|js)"'$|README'"\\.md"'$'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md

2026-04-10T21:23:35.908191Z ERROR codex_core::tools::router: error=exec_command failed for `/bin/zsh -lc "python3 - <<'PY'
import subprocess, json
cmd=['bash','.opencode/skill/system-spec-kit/scripts/spec/validate.sh','/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main','--strict']
res=subprocess.run(cmd,cwd='/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public',capture_output=True,text=True)
print('EXIT',res.returncode)
print(res.stdout)
print(res.stderr)
PY"`: CreateProcess { message: "Codex(Sandbox(Denied { output: ExecToolCallOutput { exit_code: 1, stdout: StreamOutput { text: \"\", truncated_after_lines: None }, stderr: StreamOutput { text: \"zsh:1: can't create temp file for here document: operation not permitted\\n\", truncated_after_lines: None }, aggregated_output: StreamOutput { text: \"zsh:1: can't create temp file for here document: operation not permitted\\n\", truncated_after_lines: None }, duration: 0ns, timed_out: false }, network_policy_decision: None }))" }
exec
/bin/zsh -lc "rg --files .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external | rg 'README\\.md"'$|modus-memory-main'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

codex
The environment is also confirming the same constraint you mentioned earlier: commands that try to create temp here-doc state hit the read-only sandbox. I’ll stick to plain non-here-doc reads and a straightforward validator rerun so the final assessment stays explicit about what was and wasn’t verified.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Bm25 Index
     3	// ───────────────────────────────────────────────────────────────
     4	// Feature catalog: BM25 trigger phrase re-index gate
     5	import type Database from 'better-sqlite3';
     6	import { normalizeContentForBM25 } from '../parsing/content-normalizer.js';
     7	
     8	// ───────────────────────────────────────────────────────────────
     9	// 1. INTERFACES
    10	
    11	// ───────────────────────────────────────────────────────────────
    12	interface BM25SearchResult {
    13	  id: string;
    14	  /**
    15	   * BM25 term-frequency relevance score (unbounded, typically 0-25+).
    16	   * Higher = better lexical match. Not directly comparable to vector similarity
    17	   * scores; use min-max normalization or RRF when combining with other methods.
    18	   */
    19	  score: number;
    20	}
    21	
    22	interface BM25Stats {
    23	  documentCount: number;
    24	  termCount: number;
    25	  avgDocLength: number;
    26	}
    27	
    28	interface BM25DocumentSource {
    29	  title?: string | null;
    30	  content_text?: string | null;
    31	  trigger_phrases?: string | string[] | null;
    32	  file_path?: string | null;
    33	}
    34	
    35	/* ───────────────────────────────────────────────────────────────
    36	   1B. CONSTANTS & FEATURE FLAG
    37	   ──────────────────────────────────────────────────────────────── */
    38	
    39	const DEFAULT_K1 = 1.2;
    40	const DEFAULT_B = 0.75;
    41	const BM25_WARMUP_BATCH_SIZE = 250;
    42	const BM25_ENABLED_VALUES = new Set(['1', 'true', 'yes', 'on', 'experimental', 'fallback']);
    43	const BM25_DISABLED_VALUES = new Set(['0', 'false', 'no', 'off']);
    44	
    45	/**
    46	 * C138: Field weight multipliers for weighted BM25 scoring.
    47	 * When indexing a document composed of multiple fields, multiply
    48	 * each field's token scores by the appropriate weight before
    49	 * accumulating the total document score.
    50	 *
    51	 * These weights are consumed by the FTS5 path in sqlite-fts.ts,
    52	 * not the in-memory BM25 engine in this file. Exported for shared access.
    53	 *
    54	 * title:           10.0 — exact title matches are the strongest signal
    55	 * trigger_phrases:  5.0 — curated keywords next most important
    56	 * content_generic:  2.0 — generic textual content (file_path, tags, etc.)
    57	 * body:             1.0 — baseline weight for full body / content_text
    58	 */
    59	const BM25_FTS5_WEIGHTS = [10.0, 5.0, 2.0, 1.0] as const;
    60	
    61	const BM25_FIELD_WEIGHTS: Record<string, number> = {
    62	  title: BM25_FTS5_WEIGHTS[0],
    63	  trigger_phrases: BM25_FTS5_WEIGHTS[1],
    64	  content_generic: BM25_FTS5_WEIGHTS[2],
    65	  body: BM25_FTS5_WEIGHTS[3],
    66	};
    67	
    68	/**
    69	 * Check whether the in-memory BM25 index is enabled.
    70	 *
    71	 * @returns `true` when BM25 indexing/search is enabled for the current process.
    72	 * @example
    73	 * ```ts
    74	 * if (isBm25Enabled()) {
    75	 *   getIndex();
    76	 * }
    77	 * ```
    78	 */
    79	function isBm25Enabled(): boolean {
    80	  const value = process.env.ENABLE_BM25?.trim().toLowerCase();
    81	  if (!value) return true; // enabled by default
    82	  if (BM25_DISABLED_VALUES.has(value)) return false;
    83	  return BM25_ENABLED_VALUES.has(value);
    84	}
    85	
    86	// ───────────────────────────────────────────────────────────────
    87	// 2. HELPERS
    88	
    89	// ───────────────────────────────────────────────────────────────
    90	const STOP_WORDS = new Set([
    91	  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    92	  'of', 'with', 'by', 'from', 'is', 'it', 'as', 'was', 'are', 'be',
    93	  'has', 'had', 'have', 'been', 'were', 'will', 'would', 'could', 'should',
    94	  'may', 'might', 'can', 'this', 'that', 'these', 'those', 'not', 'no',
    95	  'do', 'does', 'did', 'so', 'if', 'then', 'than', 'too', 'very',
    96	]);
    97	
    98	/**
    99	 * Apply lightweight stemming to a token for BM25 indexing and matching.
   100	 *
   101	 * @param word - Token to stem.
   102	 * @returns A lowercased token with simple suffix normalization applied.
   103	 * @example
   104	 * ```ts
   105	 * simpleStem('running');
   106	 * // 'run'
   107	 * ```
   108	 */
   109	function simpleStem(word: string): string {
   110	  let stem = word.toLowerCase();
   111	  let suffixRemoved = false;
   112	  // Simple suffix removal
   113	  if (stem.endsWith('ing') && stem.length > 5) { stem = stem.slice(0, -3); suffixRemoved = true; }
   114	  else if (stem.endsWith('tion') && stem.length > 6) { stem = stem.slice(0, -4); suffixRemoved = true; }
   115	  else if (stem.endsWith('ed') && stem.length > 4) { stem = stem.slice(0, -2); suffixRemoved = true; }
   116	  else if (stem.endsWith('ly') && stem.length > 4) { stem = stem.slice(0, -2); suffixRemoved = true; }
   117	  else if (stem.endsWith('es') && stem.length > 4) { stem = stem.slice(0, -2); suffixRemoved = true; }
   118	  else if (stem.endsWith('s') && stem.length > 3) { stem = stem.slice(0, -1); suffixRemoved = true; }
   119	  // Only deduplicate doubled consonants when a suffix was actually removed.
   120	  // Without this guard, original double consonants are incorrectly stripped:
   121	  // "bass" -> "bas", "jazz" -> "jaz", "bill" -> "bil" etc.
   122	  // Handle doubled consonants after suffix
   123	  // Removal. "running"→"runn"→"run", "stopped"→"stopp"→"stop". Check if last two chars
   124	  // Are identical consonants and deduplicate.
   125	  if (suffixRemoved && stem.length >= 3) {
   126	    const last = stem[stem.length - 1];
   127	    if (last === stem[stem.length - 2] && !/[aeiou]/.test(last)) {
   128	      stem = stem.slice(0, -1);
   129	    }
   130	  }
   131	  return stem;
   132	}
   133	
   134	function splitLexicalFragments(text: string): string[] {
   135	  if (!text || typeof text !== 'string') return [];
   136	
   137	  return text
   138	    .toLowerCase()
   139	    .replace(/[^a-z0-9\s-_]/g, ' ')
   140	    .split(/\s+/)
   141	    .map(t => t.trim())
   142	    .filter(Boolean);
   143	}
   144	
   145	/**
   146	 * Tokenize raw text into normalized BM25 terms.
   147	 *
   148	 * @param text - Input text to tokenize.
   149	 * @returns Stemmed, lowercased, stop-word-filtered terms.
   150	 * @example
   151	 * ```ts
   152	 * tokenize('The memory indexing pipeline');
   153	 * // ['memory', 'index', 'pipeline']
   154	 * ```
   155	 */
   156	function tokenize(text: string): string[] {
   157	  return splitLexicalFragments(text)
   158	    .filter(t => t.length >= 2 && !STOP_WORDS.has(t))
   159	    .map(simpleStem);
   160	}
   161	
   162	/**
   163	 * Count token frequency occurrences for BM25 scoring.
   164	 *
   165	 * @param tokens - Normalized tokens produced by {@link tokenize}.
   166	 * @returns A frequency map keyed by token text.
   167	 * @example
   168	 * ```ts
   169	 * getTermFrequencies(['memory', 'memory', 'search']).get('memory');
   170	 * // 2
   171	 * ```
   172	 */
   173	function getTermFrequencies(tokens: string[]): Map<string, number> {
   174	  const freq = new Map<string, number>();
   175	  for (const token of tokens) {
   176	    freq.set(token, (freq.get(token) || 0) + 1);
   177	  }
   178	  return freq;
   179	}
   180	
   181	function normalizeTriggerPhrasesForBM25(triggerPhrases: string | string[] | null | undefined): string {
   182	  if (Array.isArray(triggerPhrases)) {
   183	    return triggerPhrases
   184	      .filter((phrase): phrase is string => typeof phrase === 'string' && phrase.trim().length > 0)
   185	      .join(' ');
   186	  }
   187	
   188	  if (typeof triggerPhrases !== 'string') {
   189	    return '';
   190	  }
   191	
   192	  const trimmed = triggerPhrases.trim();
   193	  if (!trimmed) {
   194	    return '';
   195	  }
   196	
   197	  try {
   198	    const parsed = JSON.parse(trimmed) as unknown;
   199	    if (Array.isArray(parsed)) {
   200	      return parsed
   201	        .filter((phrase): phrase is string => typeof phrase === 'string' && phrase.trim().length > 0)
   202	        .join(' ');
   203	    }
   204	  } catch {
   205	    // Fall back to raw string when the database value is not JSON.
   206	  }
   207	
   208	  return trimmed;
   209	}
   210	
   211	function buildBm25DocumentText(row: BM25DocumentSource): string {
   212	  const textParts: string[] = [];
   213	
   214	  if (typeof row.title === 'string' && row.title.trim()) {
   215	    textParts.push(row.title.trim());
   216	  }
   217	
   218	  if (typeof row.content_text === 'string' && row.content_text.trim()) {
   219	    textParts.push(normalizeContentForBM25(row.content_text));
   220	  }

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	<p align="center">
     2	  <img src="assets/hero.svg" alt="modus-memory — Personal memory server for AI" width="900"/>
     3	</p>
     4	
     5	<p align="center">
     6	  <a href="#demo"><strong>Demo</strong></a> ·
     7	  <a href="#install"><strong>Install</strong></a> ·
     8	  <a href="#quickstart"><strong>Quickstart</strong></a> ·
     9	  <a href="#the-librarian-pattern"><strong>Librarian</strong></a> ·
    10	  <a href="#how-it-works"><strong>How It Works</strong></a> ·
    11	  <a href="#security--privacy"><strong>Security</strong></a> ·
    12	  <a href="#migrating-from-khoj"><strong>Khoj Migration</strong></a> ·
    13	  <a href="#faq"><strong>FAQ</strong></a>
    14	</p>
    15	
    16	<p align="center">
    17	  <img src="https://img.shields.io/badge/MCP-compatible-blue?style=flat-square&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSI4IiBmaWxsPSIjNThhNmZmIi8+PC9zdmc+" alt="MCP Compatible"/>
    18	  <img src="https://img.shields.io/badge/platform-macOS%20·%20Linux%20·%20Windows-lightgrey?style=flat-square" alt="Platform"/>
    19	  <img src="https://img.shields.io/badge/size-~6MB-green?style=flat-square" alt="Binary Size"/>
    20	  <img src="https://img.shields.io/badge/dependencies-zero-brightgreen?style=flat-square" alt="Zero Dependencies"/>
    21	  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="MIT License"/>
    22	  <img src="https://img.shields.io/badge/price-free-brightgreen?style=flat-square" alt="Completely Free"/>
    23	</p>
    24	
    25	---
    26	
    27	**modus-memory** is a personal memory server that runs on your machine, stores everything in plain markdown, and connects to any AI client via [MCP](https://modelcontextprotocol.io).
    28	
    29	One binary. No cloud. No Docker. No database. Your memories stay on your disk as files you can read, edit, grep, and back up with git.
    30	
    31	> **Completely free. 19,000+ documents indexed in 2 seconds. Cached searches in <100 microseconds. 6MB binary, zero dependencies.**
    32	
    33	## Demo
    34	
    35	<p align="center">
    36	  <img src="assets/demo.svg" alt="modus-memory demo — install, store memory, recall weeks later" width="800"/>
    37	</p>
    38	
    39	Your AI remembers a decision you made 3 weeks ago — in a completely new chat. No copy-paste, no "here's my context dump." Just ask, and it knows.
    40	
    41	## Why
    42	
    43	Every AI conversation starts from zero. Your assistant forgets everything the moment the window closes.
    44	
    45	Cloud memory services charge $19–249/month to store your personal data on their servers. Open-source alternatives require Python, Docker, PostgreSQL, and an afternoon of setup. The official MCP memory server is deliberately minimal — no search ranking, no decay, no cross-referencing. Other "zero-infrastructure" tools still need Node.js runtimes and LLM API keys for every search.
    46	
    47	<p align="center">
    48	  <img src="assets/comparison.svg" alt="modus-memory vs cloud memory services" width="800"/>
    49	</p>
    50	
    51	**modus-memory** fills the gap:
    52	
    53	- **BM25 full-text search** with field boosting and query caching — 19K docs in <5ms
    54	- **FSRS spaced repetition** — memories decay naturally, strengthen on recall
    55	- **Cross-referencing** — facts, notes, and entities linked by subject and tag
    56	- **Librarian query expansion** — "React hooks" also finds "useState lifecycle"
    57	- **Plain markdown storage** — your data is always yours, always readable
    58	- **~6MB binary** — download, configure, done. No runtime, no interpreter, no container
    59	
    60	### Without memory vs. with memory
    61	
    62	| Scenario | Without | With modus-memory |
    63	|----------|---------|-------------------|
    64	| Start a new chat | AI knows nothing about you | AI recalls your preferences, past decisions, project context |
    65	| Switch AI clients | Start over completely | Same memory, any MCP client |
    66	| Ask "what did we decide about auth?" | Blank stare | Instant recall + linked context |
    67	| Close the window | Everything lost | Persisted to disk, searchable forever |
    68	| 6 months later | Stale memories clutter results | FSRS naturally fades noise, reinforces what matters |
    69	
    70	### Token savings
    71	
    72	Memory isn't just about remembering. It's a token reduction strategy.
    73	
    74	| Approach | Tokens per query | Cost at $3/1M tokens | Monthly (50 queries/day) |
    75	|----------|-----------------|----------------------|--------------------------|
    76	| Stuff 1K facts into context | ~36,000 | $0.109 | **$164** |
    77	| modus-memory search (top 10) | ~500 | $0.0015 | **$2.25** |
    78	
    79	**72x fewer input tokens.** Instead of cramming everything into the context window, modus-memory searches 19,000+ documents in <5ms and returns only what's relevant.
    80	
    81	## Install
    82	
    83	### Homebrew (macOS & Linux)
    84	
    85	```bash
    86	brew install GetModus/tap/modus-memory
    87	```
    88	
    89	### Download binary
    90	
    91	Grab the latest release for your platform from [Releases](https://github.com/GetModus/modus-memory/releases):
    92	
    93	| Platform | Architecture | Download |
    94	|----------|-------------|----------|
    95	| macOS | Apple Silicon (M1+) | `modus-memory-darwin-arm64` |
    96	| macOS | Intel | `modus-memory-darwin-amd64` |
    97	| Linux | x86_64 | `modus-memory-linux-amd64` |
    98	| Linux | ARM64 | `modus-memory-linux-arm64` |
    99	| Windows | x86_64 | `modus-memory-windows-amd64.exe` |
   100	
   101	```bash
   102	# macOS / Linux
   103	chmod +x modus-memory-*
   104	sudo mv modus-memory-* /usr/local/bin/modus-memory
   105	
   106	# Verify
   107	modus-memory version
   108	```
   109	
   110	### Go install
   111	
   112	```bash
   113	go install github.com/GetModus/modus-memory@latest
   114	```
   115	
   116	## Quickstart
   117	
   118	### 1. Add to your AI client
   119	
   120	<details>
   121	<summary><strong>Claude Desktop</strong></summary>
   122	
   123	Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:
   124	
   125	```json
   126	{
   127	  "mcpServers": {
   128	    "memory": {
   129	      "command": "modus-memory",
   130	      "args": ["--vault", "~/vault"]
   131	    }
   132	  }
   133	}
   134	```
   135	</details>
   136	
   137	<details>
   138	<summary><strong>Claude Code</strong></summary>
   139	
   140	```bash
   141	claude mcp add memory -- modus-memory --vault ~/vault
   142	```
   143	</details>
   144	
   145	<details>
   146	<summary><strong>Cursor</strong></summary>
   147	
   148	In Settings > MCP Servers, add:
   149	
   150	```json
   151	{
   152	  "memory": {
   153	    "command": "modus-memory",
   154	    "args": ["--vault", "~/vault"]
   155	  }
   156	}
   157	```
   158	</details>
   159	
   160	<details>
   161	<summary><strong>Windsurf / Cline / Any MCP client</strong></summary>
   162	
   163	modus-memory speaks [MCP](https://modelcontextprotocol.io) over stdio. Point any MCP-compatible client at the binary:
   164	
   165	```bash
   166	modus-memory --vault ~/vault
   167	```
   168	</details>
   169	
   170	### 2. Start remembering
   171	
   172	Your AI client now has 11 memory tools. Try:
   173	
   174	```
   175	"Remember that I prefer TypeScript over JavaScript for new projects"
   176	"What do you know about my coding preferences?"
   177	"Find everything related to the authentication refactor"
   178	```
   179	
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
   216	│ (reasoning)  │     │ (local, ~8B)   │     │   (vault)    │
   217	└─────────────┘     └────────────────┘     └──────────────┘
   218	                     Sole write access
   219	                     Query expansion
   220	                     Relevance filtering
   221	                     Context compression
   222	```
   223	
   224	The cloud model stays focused on reasoning. The Librarian handles retrieval, filing, deduplication, decay, and context curation — then hands over only the 4-8k tokens that actually matter.
   225	
   226	- **Token discipline** — the Librarian compresses and reranks locally before anything touches the cloud. You pay for signal, not noise.
   227	- **Context hygiene** — the cloud model never sees duplicates, stale facts, or irrelevant memories.
   228	- **Privacy** — sensitive data stays on your machine. The Librarian decides what crosses the boundary.
   229	- **Consistency** — one model means consistent tagging, frontmatter, importance levels, and deduplication.
   230	
   231	Any small, instruction-following model works: Gemma 4, Qwen 3, Llama 3, Phi-4. It doesn't need to be smart. It needs to be reliable.
   232	
   233	**[Full guide: system prompt, model recommendations, example flows, and wiring patterns →](docs/librarian.md)**
   234	
   235	## How It Works
   236	
   237	<p align="center">
   238	  <img src="assets/architecture.svg" alt="Architecture — MCP client → modus-memory → vault" width="800"/>
   239	</p>
   240	

exec
/bin/zsh -lc 'bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main" --strict' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1336ms:

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
Validation is clean: the phase folder still passes strict validation, with the same read-only sandbox warning on temp-file creation but no spec errors or warnings. I’m doing one last skim of the `memory_search` handler metadata so the final output can connect the strategy recommendations to the exact public API surface.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '480,560p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '760,940p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/README.md | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '1220,1265p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	---
     2	title: "Search Subsystem"
     3	description: "5-channel hybrid search architecture combining vector, lexical (BM25/FTS5), graph-based and structure-aware graph retrieval with Reciprocal Rank Fusion (RRF) and Adaptive Fusion."
     4	trigger_phrases:
     5	  - "search subsystem"
     6	  - "hybrid search"
     7	  - "vector search"
     8	---
     9	
    10	# Search Subsystem
    11	
    12	> 5-channel hybrid search architecture combining vector, lexical (BM25/FTS5), graph-based and structure-aware graph retrieval, fused with Reciprocal Rank Fusion (RRF) and Adaptive Fusion.
    13	
    14	---
    15	
    16	## TABLE OF CONTENTS
    17	<!-- ANCHOR:table-of-contents -->
    18	
    19	- [1. OVERVIEW](#1--overview)
    20	  - [4-STAGE PIPELINE ARCHITECTURE](#4--stage-pipeline-architecture)
    21	- [2. KEY CONCEPTS](#2--key-concepts)
    22	- [3. MODULE STRUCTURE](#3--module-structure)
    23	- [4. FEATURES](#4--features)
    24	  - [GRAPH SIGNAL FEATURES](#graph-signal-features)
    25	  - [SAVE-TIME PROCESSING PIPELINE](#save-time-processing-pipeline)
    26	  - [SCORING ENHANCEMENTS](#scoring-enhancements)
    27	- [FTS CAPABILITY CASCADE FLOOR](#fts-capability-cascade-floor)
    28	- [5. USAGE EXAMPLES](#5--usage-examples)
    29	- [6. RECENT CHANGES (SPRINT 8)](#6--recent-changes-sprint-8)
    30	- [7. RELATED RESOURCES](#7--related-resources)
    31	
    32	<!-- /ANCHOR:table-of-contents -->
    33	
    34	---
    35	
    36	## 1. OVERVIEW
    37	<!-- ANCHOR:overview -->
    38	
    39	The search subsystem provides production-grade hybrid search capabilities with multiple retrieval methods fused via RRF scoring. It handles query expansion, intent classification, typo tolerance and optional cross-encoder reranking.
    40	
    41	**Core Capabilities:**
    42	- **5-Channel Hybrid Search**: Vector (semantic) + BM25/FTS5 (lexical) + Graph (relationship-based) + Graph Structure (structural)
    43	- **RRF Score Fusion**: Industry-standard k=40 with convergence bonuses
    44	- **Intent Classification**: 7 intent types route to task-specific retrieval weights
    45	- **Query Enhancement**: Fuzzy matching (Levenshtein) + acronym expansions (via hybrid-search.ts inline logic)
    46	- **Reranking Pipeline**: Optional cross-encoder with length penalties
    47	- **MMR Diversity Reranking**: Maximal Marginal Relevance to reduce redundancy in result sets
    48	- **Evidence Gap Detection**: Identifies missing context and suggests follow-up queries
    49	- **Schema Management**: sqlite-vec schema v15 (current) with document-type fields, event-based decay and phase-aware columns
    50	
    51	**Architecture Pattern:**
    52	```text
    53	Query Input
    54	    |
    55	Intent Classifier -> Task-specific weights
    56	    |
    57	Parallel Search (5 channels)
    58	|---> Vector (sqlite-vec)       -> Semantic matches
    59	|---> BM25 (Pure JS)            -> Keyword matches
    60	|---> Graph (Co-activation)     -> Relationship matches
    61	|---> Graph Structure           -> Structural matches
    62	    |
    63	RRF Fusion (k=40) + Adaptive Fusion -> Unified scores
    64	    |
    65	MMR Diversity Reranking -> Redundancy reduction
    66	    |
    67	Cross-Encoder Rerank (optional) -> Relevance refinement
    68	    |
    69	Recency Boost + Co-activation -> Final adjustments
    70	    |
    71	Final Results
    72	```
    73	
    74	**Architecture Note:**
    75	`vector-index.ts` is the primary typed export surface for the vector index and re-exports the split schema, query, mutation, store and alias modules. `vector-index-impl.ts` is now a 14-line backward-compatibility shim that simply re-exports `vector-index.ts` for older import paths.
    76	
    77	<a id="4-stage-pipeline-architecture"></a>
    78	### 4-Stage Pipeline Architecture
    79	
    80	The search pipeline (R6) decomposes retrieval into four bounded stages with strict responsibilities. Each stage has clear input/output contracts defined in `pipeline/types.ts`.
    81	
    82	```text
    83	Stage 1                Stage 2                 Stage 3              Stage 4
    84	CANDIDATE GEN    -->   FUSION + SIGNALS   -->  RERANK + AGGREGATE  -->  FILTER + ANNOTATE
    85	(no score changes)     (single scoring point)  (score changes: YES)    (score changes: NO)
    86	```
    87	
    88	**Stage 1 — Candidate Generation** (`stage1-candidate-gen.ts`):
    89	Executes 5 search channels in parallel and collects raw candidates with no scoring modifications.
    90	
    91	| Channel | Source | Description |
    92	|---------|--------|-------------|
    93	| Vector | `vector-index.ts` | Semantic similarity via sqlite-vec through the split vector-index modules |
    94	| BM25 | `bm25-index.ts` | Pure TypeScript keyword matching |
    95	| FTS5 | `sqlite-fts.ts` | SQLite FTS5 BM25 weighted scoring |
    96	| Graph | `graph-search-fn.ts` | Causal edge traversal + typed-weighted degree (R4) |
    97	| Degree | `graph-search-fn.ts` | Structural graph discovery via typed-weighted degree |
    98	
    99	Post-channel: constitutional memory injection, quality score filtering, tier/contextType filtering.
   100	
   101	**Stage 2 — Fusion + Signal Integration** (`stage2-fusion.ts`):
   102	Single authoritative point for ALL scoring signals. Signal application order is fixed:
   103	
   104	1. Session boost — working-memory attention amplification
   105	2. Causal boost — graph-traversal neighbor amplification
   106	3. Community co-retrieval (N2c) — inject community co-members
   107	4. Graph signals (N2a + N2b) — momentum + causal depth
   108	5. Testing effect — FSRS strengthening write-back (opt-in via `trackAccess`)
   109	6. Intent weights — non-hybrid only (G2 double-weighting prevention: `isHybrid` boolean guard)
   110	7. Artifact routing — class-based weight boosts
   111	8. Feedback signals — learned trigger boosts (0.7x weight) + negative demotions
   112	9. Anchor metadata — extract named ANCHOR sections (annotation only)
   113	10. Validation signals — quality scoring multiplier (clamped 0.8-1.2)
   114	
   115	**Stage 3 — Rerank + Aggregate** (`stage3-rerank.ts`):
   116	Cross-encoder reranking (optional, min 2 results) followed by MPAB chunk-to-memory aggregation. Aggregation formula: `parentScore = sMax + 0.3 * Sum(rest) / sqrt(N)` where `sMax` is the best chunk score and N is the remaining chunk count. Chunk ordering preserves `chunk_index` document order (B2 guarantee). `contentSource` metadata marks provenance (`reassembled_chunks` or `file_read_fallback`).
   117	
   118	**Stage 4 — Filter + Annotate** (`stage4-filter.ts`):
   119	**Score immutability invariant**: Stage 4 MUST NOT modify scores. Enforced via compile-time `Stage4ReadonlyRow` readonly fields and runtime `captureScoreSnapshot` / `verifyScoreInvariant` defence-in-depth. Applies memory-state filtering (HOT/WARM/COLD/DORMANT/ARCHIVED with per-tier limits), evidence gap detection (Z-score confidence check), quality floor (`QUALITY_FLOOR=0.005`), and token budget truncation.
   120	
   121	<!-- /ANCHOR:overview -->
   122	
   123	---
   124	
   125	## 2. KEY CONCEPTS
   126	<!-- ANCHOR:key-concepts -->
   127	
   128	### Reciprocal Rank Fusion (RRF)
   129	
   130	**Formula**: `score = Sum 1/(k + rank_i)` where k=40 (tuned for ~1000-memory corpus)
   131	
   132	**Why RRF?**
   133	- Parameter-free fusion (no weight tuning required)
   134	- Resilient to retrieval method failures (graceful degradation)
   135	- Citation: Cormack et al. "RRF outperforms Condorcet" (SIGIR 2009)
   136	
   137	**Enhancements (REQ-011):**
   138	- **10% Convergence Bonus**: Results in multiple sources get +10% score boost
   139	- **1.5x Graph Weight**: Graph-exclusive discoveries weighted higher for novelty
   140	- **Adaptive Fusion**: Intent-aware weighted RRF with dark-run mode (feature flag `SPECKIT_ADAPTIVE_FUSION`)
   141	- **MMR Diversity**: Maximal Marginal Relevance reranking reduces near-duplicate results
   142	- **Recency Boost**: Time-aware score adjustment favoring recently updated memories
   143	- **Co-activation Boost**: Graph-neighbor score propagation via 2-hop causal traversal
   144	
   145	**Example:**
   146	```javascript
   147	// Vector rank: 2, BM25 rank: 5, Graph rank: 1
   148	// RRF score = 1/(40+2) + 1/(40+5) + 1.5/(40+1)
   149	//           = 0.0238 + 0.0222 + 0.0366 = 0.0826
   150	// Convergence bonus: 0.0826 * 1.10 = 0.0909 (final)
   151	```
   152	
   153	### BM25 (Best Matching 25)
   154	
   155	**Formula**:
   156	```text
   157	score(D, Q) = Sum IDF(qi) * (tf(qi,D) * (k1+1)) / (tf(qi,D) + k1 * (1-b + b*|D|/avgdl))
   158	```
   159	
   160	**Parameters:**
   161	- `k1 = 1.2`: Term frequency saturation (higher = less saturation)
   162	- `b = 0.75`: Length normalization (0=ignore length, 1=full penalty)
   163	- `tf(qi,D)`: Term frequency of query term qi in document D
   164	- `|D|`: Document length, `avgdl`: Average document length
   165	- `IDF(qi)`: Inverse document frequency: `log((N - n(qi) + 0.5) / (n(qi) + 0.5) + 1)`
   166	
   167	**Why BM25?**
   168	- Handles term frequency saturation (repeated words don't dominate)
   169	- Length normalization (short docs not penalized unfairly)
   170	- Pure JavaScript implementation (REQ-028, no Python dependency)
   171	
   172	<a id="fts-capability-cascade-floor"></a>
   173	### FTS Capability Cascade Floor
   174	
   175	Packet `026-graph-and-context-optimization/010-fts-capability-cascade-floor` freezes the lexical capability contract that packet `002-implement-cache-warning-hooks` now consumes. `memory_search` responses expose:
   176	
   177	- `lexicalPath`: the lane that actually ran for lexical retrieval. Current packet-owned values are `fts5` and `unavailable`. The wider response schema also allows `like`, but packet `010` does not claim that lane for this runtime seam.
   178	- `fallbackState`: the truthful FTS capability outcome for the request.
   179	
   180	The forced-degrade matrix is:
   181	
   182	| `fallbackState` | Meaning | `lexicalPath` |
   183	|-----------------|---------|---------------|
   184	| `ok` | FTS5 compile probe passed, `memory_fts` exists, and BM25 ranking executed normally | `fts5` |
   185	| `compile_probe_miss` | `PRAGMA compile_options` does not report FTS5 support, so lexical work cannot run for this request | `unavailable` |
   186	| `missing_table` | FTS5 support is present, but `memory_fts` is missing at runtime | `unavailable` |
   187	| `no_such_module_fts5` | The SQLite engine rejects FTS5 usage with `no such module: fts5` | `unavailable` |
   188	| `bm25_runtime_failure` | The FTS5 table exists, but the `bm25(...)` ranking call fails at runtime | `unavailable` |
   189	
   190	The contract is intentionally narrow: preserve result-shape semantics, surface truthful lane metadata, and let later packets build on that truth instead of inferring capability from empty results or warning logs.
   191	
   192	### Intent-Aware Retrieval
   193	
   194	**7 Intent Types** (REQ-012, T036-T039):
   195	
   196	| Intent           | Description                  | Prioritizes                         |
   197	| ---------------- | ---------------------------- | ----------------------------------- |
   198	| `add_feature`    | Building new functionality   | Patterns, examples, architecture    |
   199	| `fix_bug`        | Debugging issues             | Error history, root cause, patches  |
   200	| `refactor`       | Restructuring code           | Patterns, dependencies, design docs |
   201	| `security_audit` | Security review              | Vulnerabilities, audit logs         |
   202	| `understand`     | Learning/exploring (default) | Explanations, context, decisions    |
   203	| `find_spec`      | Spec document retrieval      | Boosts spec-doc source weights      |
   204	| `find_decision`  | Decision rationale lookup    | Boosts decision-record source weights |
   205	
   206	**Detection**: Keyword matching with primary (2x weight) and secondary (1x weight) terms.
   207	
   208	**Example**:
   209	```javascript
   210	// Query: "add user registration feature"
   211	// Intent: add_feature
   212	// Boosts: architecture memories, pattern docs, examples
   213	```
   214	
   215	### Cross-Encoder Reranking
   216	
   217	**Purpose**: Refine top results using query-document pair scoring.
   218	
   219	**Providers** (REQ-013):
   220	- **Voyage rerank-2**: API-based, max 100 docs

 succeeded in 0ms:
  1220	      try {
  1221	        if (responseToReturn?.content?.[0]?.text) {
  1222	          const parsed = JSON.parse(responseToReturn.content[0].text) as Record<string, unknown>;
  1223	          const data = parsed?.data as Record<string, unknown> | undefined;
  1224	          const results = Array.isArray(data?.results) ? data.results as Array<Record<string, unknown>> : [];
  1225	          finalMemoryIds = results.map(r => r.id as number).filter(id => typeof id === 'number');
  1226	          finalScores = results.map(r => (r.score ?? r.similarity ?? 0) as number);
  1227	        }
  1228	      } catch (_error: unknown) { /* ignore parse errors */ }
  1229	      logFinalResult({
  1230	        evalRunId: _evalRunId,
  1231	        queryId: _evalQueryId,
  1232	        resultMemoryIds: finalMemoryIds,
  1233	        scores: finalScores,
  1234	        fusionMethod: 'rrf',
  1235	        latencyMs: Date.now() - _searchStartTime,
  1236	      });
  1237	
  1238	      for (const payload of _evalChannelPayloads) {
  1239	        logChannelResult({
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

codex
# Iteration 026: SEMANTIC VS LEXICAL TRADE-OFFS

## Focus
SEMANTIC VS LEXICAL TRADE-OFFS: Deep analysis of when semantic search beats lexical and vice versa in this system. What hybrid strategies should we adopt?

## Findings

### Finding 1: Semantic should stay primary for abstraction, paraphrase, and multi-facet queries
- **Source**: [search.go#L10](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go#L10); [stage1-candidate-gen.ts#L616](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts#L616); [stage1-candidate-gen.ts#L1088](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts#L1088); [hybrid-search.ts#L1061](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L1061)
- **What it does**: Modus tries to bridge vocabulary gaps by asking the Librarian for keyword variants before lexical retrieval. Public instead has stronger semantic recovery tools: vector retrieval, deep-mode decomposition, LLM reformulation, and HyDE.
- **Why it matters**: When the user asks in abstract language or with different wording than the stored memory, semantic retrieval is the safer first hop. Lexical-only systems need successful reformulation to even enter the right neighborhood.
- **Recommendation**: **adopt now**. Keep semantic or hybrid-first routing for abstraction, paraphrase, and multi-facet queries; use lexical as supporting evidence, not the main lane.
- **Affected repo area**: `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts`, `mcp_server/lib/search/hybrid-search.ts`
- **Risk**: Higher latency if deep-mode reformulation is overused on easy queries.

### Finding 2: Lexical should dominate exact identifiers, titles, trigger phrases, and stable domain vocabulary
- **Source**: [bm25.go#L16](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/bm25.go#L16); [bm25.go#L113](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/bm25.go#L113); [bm25-index.ts#L45](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts#L45); [sqlite-fts.ts#L147](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts#L147); [hybrid-search.ts#L1094](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L1094)
- **What it does**: Modus heavily boosts subject/title/path/tag matches and falls back to prefix matching. Public’s FTS5 lane is even more aggressive on exact surfaces with title/trigger phrases/file path/body weights of `10/5/2/1`.
- **Why it matters**: For queries containing remembered names, spec slugs, file paths, commands, trigger phrases, or repeated team vocabulary, lexical ranking is usually more precise than embeddings and cheaper to execute.
- **Recommendation**: **adopt now**. Add query-shape routing so exact/token-heavy lookups can be lexical-first or lexical-dominant, instead of using today’s mostly fixed lexical weights.
- **Affected repo area**: `mcp_server/lib/search/sqlite-fts.ts`, `mcp_server/lib/search/hybrid-search.ts`
- **Risk**: Global lexical boosting would regress recall; the current code already notes that overly strong FTS weighting polluted top-K, so this must be selective, not universal.

### Finding 3: The right hybrid pattern is asymmetric expansion, not “expand everything”
- **Source**: [search.go#L15](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go#L15); [search.go#L40](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go#L40); [stage1-candidate-gen.ts#L516](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts#L516); [stage1-candidate-gen.ts#L781](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts#L781)
- **What it does**: Modus caps expansion to a small lexical variant set and always preserves the original query. Public already expands through concept aliases, embedding expansion, decomposition, and reformulation, but those paths mostly fan out full hybrid searches.
- **Why it matters**: Exact-lookups benefit more from cheap lexical rewriting than from extra semantic fan-out. Semantic expansion is most useful after lexical evidence is weak or ambiguous.
- **Recommendation**: **prototype later**. Add a cheap lexical-only expansion lane for `exact_lookup` and `entity_topic` style queries before embedding generation, with tight caps like Modus’s 3-5 variants.
- **Affected repo area**: `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts`
- **Risk**: Variant explosion and noisy OR-style recall if the expansion budget is not bounded.

### Finding 4: Public should keep late fusion as the authority surface
- **Source**: [memory-search.ts#L482](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L482); [memory-search.ts#L771](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L771); [hybrid-search.ts#L994](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L994); [memory-search.ts#L1229](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L1229)
- **What it does**: Public routes channels, collects independent evidence from vector/FTS/BM25/graph/degree, and fuses them with RRF before later scoring stages. Modus largely depends on lexical retrieval plus pre-retrieval query expansion.
- **Why it matters**: That means Public already has the stronger architecture for mixed query classes. The gap is policy, not fundamentals: when to let lexical win, when to let semantic win, and when to blend.
- **Recommendation**: **adopt now**. Do not replace hybrid retrieval with BM25-style search. Keep RRF fusion authoritative and improve routing/weight policies around it.
- **Affected repo area**: `mcp_server/handlers/memory-search.ts`, `mcp_server/lib/search/hybrid-search.ts`
- **Risk**: More routing logic increases tuning complexity, but it is far lower risk than swapping out the current hybrid stack.

### Finding 5: Lexical hot-paths deserve a pre-embedding fast lane
- **Source**: [cache.go#L10](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go#L10); [cache.go#L39](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go#L39); [indexer.go#L169](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go#L169); [memory-search.ts#L763](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L763); [memory-search.ts#L775](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L775)
- **What it does**: Modus checks exact and Jaccard-similar query caches before running BM25. Public’s default cache-miss path waits for embeddings and then goes through hybrid retrieval because `memory_search` defaults to `hybrid`.
- **Why it matters**: Repeated operational queries and token-stable lookups are where lexical search can beat semantic on both precision and latency.
- **Recommendation**: **prototype later**. Add a cheap pre-embedding lexical seed pass or small hot-query cache to decide whether semantic work is even needed.
- **Affected repo area**: `mcp_server/handlers/memory-search.ts`, `mcp_server/lib/search/hybrid-search.ts`
- **Risk**: Over-aggressive fuzzy cache reuse could hide new results; the cache needs explicit audit metadata and conservative thresholds.

### Finding 6: `lexicalPath` and `fallbackState` should become routing inputs, not just diagnostics
- **Source**: [sqlite-fts.ts#L28](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts#L28); [sqlite-fts.ts#L92](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts#L92); [sqlite-fts.ts#L208](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts#L208); [memory-search.ts#L904](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L904); [README.md#L173](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md#L173)
- **What it does**: Public already records whether the lexical lane actually ran (`fts5` vs `unavailable`) and why (`ok`, `missing_table`, `bm25_runtime_failure`, etc.), but it currently exposes that mainly as metadata.
- **Why it matters**: A hybrid strategy should react to lane availability. If lexical is unavailable, semantic should skip lexical reformulation and lean harder on vector/graph. If lexical is healthy and the query is exact, the system can safely bias toward it.
- **Recommendation**: **adopt now**. Use the lexical capability snapshot as a routing signal for query policy and benchmark segmentation.
- **Affected repo area**: `mcp_server/lib/search/sqlite-fts.ts`, `mcp_server/handlers/memory-search.ts`
- **Risk**: Minimal implementation risk; the main risk is adding policy branches without enough eval coverage.

## Assessment
- New information ratio: **0.44**
- Strongest conclusion: Public should not choose between semantic and lexical globally. It should route between them by query shape:
  - Semantic-first for paraphrase, abstraction, and multi-facet questions
  - Lexical-first for exact identifiers, titles, trigger phrases, file paths, and stable team vocabulary
  - Hybrid late fusion for everything ambiguous or mixed
- Validation: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main" --strict` returned `RESULT: PASSED` with the read-only sandbox warning `cannot create temp file for here document: Operation not permitted`.
- This was a read-only iteration. I verified source evidence and phase validation, but did not update phase artifacts.

## Recommended Next Focus
Run a narrow routing experiment instead of a retrieval rewrite: detect exact/token-heavy queries, send them through a lexical-first fast lane with optional early exit, keep abstraction/paraphrase queries on semantic-first hybrid, and measure both recall@20 and latency by bucket. The key follow-on is not “make lexical stronger everywhere,” but “make lexical win only when the query shape says it should.”


hook: Stop
hook: Stop Completed
tokens used
156,470
# Iteration 026: SEMANTIC VS LEXICAL TRADE-OFFS

## Focus
SEMANTIC VS LEXICAL TRADE-OFFS: Deep analysis of when semantic search beats lexical and vice versa in this system. What hybrid strategies should we adopt?

## Findings

### Finding 1: Semantic should stay primary for abstraction, paraphrase, and multi-facet queries
- **Source**: [search.go#L10](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go#L10); [stage1-candidate-gen.ts#L616](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts#L616); [stage1-candidate-gen.ts#L1088](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts#L1088); [hybrid-search.ts#L1061](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L1061)
- **What it does**: Modus tries to bridge vocabulary gaps by asking the Librarian for keyword variants before lexical retrieval. Public instead has stronger semantic recovery tools: vector retrieval, deep-mode decomposition, LLM reformulation, and HyDE.
- **Why it matters**: When the user asks in abstract language or with different wording than the stored memory, semantic retrieval is the safer first hop. Lexical-only systems need successful reformulation to even enter the right neighborhood.
- **Recommendation**: **adopt now**. Keep semantic or hybrid-first routing for abstraction, paraphrase, and multi-facet queries; use lexical as supporting evidence, not the main lane.
- **Affected repo area**: `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts`, `mcp_server/lib/search/hybrid-search.ts`
- **Risk**: Higher latency if deep-mode reformulation is overused on easy queries.

### Finding 2: Lexical should dominate exact identifiers, titles, trigger phrases, and stable domain vocabulary
- **Source**: [bm25.go#L16](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/bm25.go#L16); [bm25.go#L113](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/bm25.go#L113); [bm25-index.ts#L45](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts#L45); [sqlite-fts.ts#L147](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts#L147); [hybrid-search.ts#L1094](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L1094)
- **What it does**: Modus heavily boosts subject/title/path/tag matches and falls back to prefix matching. Public’s FTS5 lane is even more aggressive on exact surfaces with title/trigger phrases/file path/body weights of `10/5/2/1`.
- **Why it matters**: For queries containing remembered names, spec slugs, file paths, commands, trigger phrases, or repeated team vocabulary, lexical ranking is usually more precise than embeddings and cheaper to execute.
- **Recommendation**: **adopt now**. Add query-shape routing so exact/token-heavy lookups can be lexical-first or lexical-dominant, instead of using today’s mostly fixed lexical weights.
- **Affected repo area**: `mcp_server/lib/search/sqlite-fts.ts`, `mcp_server/lib/search/hybrid-search.ts`
- **Risk**: Global lexical boosting would regress recall; the current code already notes that overly strong FTS weighting polluted top-K, so this must be selective, not universal.

### Finding 3: The right hybrid pattern is asymmetric expansion, not “expand everything”
- **Source**: [search.go#L15](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go#L15); [search.go#L40](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go#L40); [stage1-candidate-gen.ts#L516](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts#L516); [stage1-candidate-gen.ts#L781](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts#L781)
- **What it does**: Modus caps expansion to a small lexical variant set and always preserves the original query. Public already expands through concept aliases, embedding expansion, decomposition, and reformulation, but those paths mostly fan out full hybrid searches.
- **Why it matters**: Exact-lookups benefit more from cheap lexical rewriting than from extra semantic fan-out. Semantic expansion is most useful after lexical evidence is weak or ambiguous.
- **Recommendation**: **prototype later**. Add a cheap lexical-only expansion lane for `exact_lookup` and `entity_topic` style queries before embedding generation, with tight caps like Modus’s 3-5 variants.
- **Affected repo area**: `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts`
- **Risk**: Variant explosion and noisy OR-style recall if the expansion budget is not bounded.

### Finding 4: Public should keep late fusion as the authority surface
- **Source**: [memory-search.ts#L482](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L482); [memory-search.ts#L771](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L771); [hybrid-search.ts#L994](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L994); [memory-search.ts#L1229](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L1229)
- **What it does**: Public routes channels, collects independent evidence from vector/FTS/BM25/graph/degree, and fuses them with RRF before later scoring stages. Modus largely depends on lexical retrieval plus pre-retrieval query expansion.
- **Why it matters**: That means Public already has the stronger architecture for mixed query classes. The gap is policy, not fundamentals: when to let lexical win, when to let semantic win, and when to blend.
- **Recommendation**: **adopt now**. Do not replace hybrid retrieval with BM25-style search. Keep RRF fusion authoritative and improve routing/weight policies around it.
- **Affected repo area**: `mcp_server/handlers/memory-search.ts`, `mcp_server/lib/search/hybrid-search.ts`
- **Risk**: More routing logic increases tuning complexity, but it is far lower risk than swapping out the current hybrid stack.

### Finding 5: Lexical hot-paths deserve a pre-embedding fast lane
- **Source**: [cache.go#L10](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go#L10); [cache.go#L39](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go#L39); [indexer.go#L169](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go#L169); [memory-search.ts#L763](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L763); [memory-search.ts#L775](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L775)
- **What it does**: Modus checks exact and Jaccard-similar query caches before running BM25. Public’s default cache-miss path waits for embeddings and then goes through hybrid retrieval because `memory_search` defaults to `hybrid`.
- **Why it matters**: Repeated operational queries and token-stable lookups are where lexical search can beat semantic on both precision and latency.
- **Recommendation**: **prototype later**. Add a cheap pre-embedding lexical seed pass or small hot-query cache to decide whether semantic work is even needed.
- **Affected repo area**: `mcp_server/handlers/memory-search.ts`, `mcp_server/lib/search/hybrid-search.ts`
- **Risk**: Over-aggressive fuzzy cache reuse could hide new results; the cache needs explicit audit metadata and conservative thresholds.

### Finding 6: `lexicalPath` and `fallbackState` should become routing inputs, not just diagnostics
- **Source**: [sqlite-fts.ts#L28](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts#L28); [sqlite-fts.ts#L92](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts#L92); [sqlite-fts.ts#L208](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts#L208); [memory-search.ts#L904](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L904); [README.md#L173](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md#L173)
- **What it does**: Public already records whether the lexical lane actually ran (`fts5` vs `unavailable`) and why (`ok`, `missing_table`, `bm25_runtime_failure`, etc.), but it currently exposes that mainly as metadata.
- **Why it matters**: A hybrid strategy should react to lane availability. If lexical is unavailable, semantic should skip lexical reformulation and lean harder on vector/graph. If lexical is healthy and the query is exact, the system can safely bias toward it.
- **Recommendation**: **adopt now**. Use the lexical capability snapshot as a routing signal for query policy and benchmark segmentation.
- **Affected repo area**: `mcp_server/lib/search/sqlite-fts.ts`, `mcp_server/handlers/memory-search.ts`
- **Risk**: Minimal implementation risk; the main risk is adding policy branches without enough eval coverage.

## Assessment
- New information ratio: **0.44**
- Strongest conclusion: Public should not choose between semantic and lexical globally. It should route between them by query shape:
  - Semantic-first for paraphrase, abstraction, and multi-facet questions
  - Lexical-first for exact identifiers, titles, trigger phrases, file paths, and stable team vocabulary
  - Hybrid late fusion for everything ambiguous or mixed
- Validation: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main" --strict` returned `RESULT: PASSED` with the read-only sandbox warning `cannot create temp file for here document: Operation not permitted`.
- This was a read-only iteration. I verified source evidence and phase validation, but did not update phase artifacts.

## Recommended Next Focus
Run a narrow routing experiment instead of a retrieval rewrite: detect exact/token-heavy queries, send them through a lexical-first fast lane with optional early exit, keep abstraction/paraphrase queries on semantic-first hybrid, and measure both recall@20 and latency by bucket. The key follow-on is not “make lexical stronger everywhere,” but “make lexical win only when the query shape says it should.”
