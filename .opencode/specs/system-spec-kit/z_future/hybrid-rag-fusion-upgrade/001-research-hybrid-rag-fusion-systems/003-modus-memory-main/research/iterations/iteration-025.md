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
# Iteration 025: MULTI-AGENT MEMORY SAFETY

## Focus
MULTI-AGENT MEMORY SAFETY: How does this system handle concurrent agent access, merge conflicts, project isolation, and shared vs private memory scoping?

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
I’m treating this as a read-only research iteration on Modus Memory versus Spec Kit Memory, focused specifically on multi-agent safety and scoping. I’ll do a quick memory pass first, then read the concurrency/shared-memory code paths in both systems and synthesize only net-new findings for iteration 25.
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
/bin/zsh -lc 'rg -n "multi-agent|shared memory|shared_space|governed retrieval|filterRowsByScope|actor identity|concurrent|merge conflict|private memory|shared vs private|shared_space_upsert|memory_search|memory_context" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
547:- `memory_stats` currently has no `sessionId` input in tool schema, so calling it after `memory_search` cannot claim the same session by default [Task 2]
548:- verification pattern that worked: confirm fresh `context-server.js` processes, run `session_bootstrap`, execute controlled `memory_search` sequence with fixed session id + trace flags, then query `feedback_events` globally and per-session in sqlite [Task 2]
731:- session_bootstrap, memory_context({mode:"resume",profile:"resume"}), mcp_server/hooks/claude, scripts/hooks/claude, workflow-session-id.vitest.ts, code-graph-query-handler.vitest.ts
786:- `session_bootstrap()` is the primary recovery call for non-hook flows; docs should mention fallback `memory_context({mode:"resume",profile:"resume"})` only after bootstrap guidance [Task 4]
1057:- list_mcp_resources, list_mcp_resource_templates, spec_kit_memory, opencode.json, context-server.js, memory_context, memory_search
1109:- symptom: commit fails with `.git/index.lock`; cause: stale lock or concurrent git process; fix: confirm no active git process, remove stale lock, then retry commit [Task 7]
1223:- release-ready checklist, shared_space_upsert, SPECKIT_SHARED_MEMORY_ADMIN_USER_ID, CHECKPOINT_SCOPE_UNSUPPORTED
1478:- memory_search cursor, progressive-disclosure, requestQuality, SPECKIT_RESULT_CONFIDENCE_V1, memory-search-ux-hooks.vitest.ts
1496:- when user requested deep sequential review with multi-agent delegation and default-on confirmation, include default-flag/docs/playbook verification in done criteria [Task 2][Task 3]
1577:scope: governed retrieval scope propagation, shared-space authorization contracts, memory health auto-repair safety, hybrid runtime audits, and handler-level envelope/graph-signal guards
1588:- tenantId userId agentId sharedSpaceId, filterRowsByScope, superRefine actor identity, score=edgeStrength*fts_score, vi.hoisted
1649:- Shared-space mutation contracts should enforce single actor identity before handler writes [Task 1]
1792:- filterRowsByScope, sessionId filtering, getAllowedSharedSpaceIds, assertSharedSpaceAccess, runRetentionSweep, tenant filtering
1826:- Governance hardening in this wave centered on guaranteed session/tenant enforcement in `filterRowsByScope`, shared-space authorization, and scoped retention sweep deletions [Task 3]
2004:- symptom: commit fails with `.git/index.lock`; cause: stale lock or concurrent git process; fix: confirm no active git process, remove stale lock, then retry commit [Task 4]
2008:scope: read-only multi-agent review findings and documentation-drift checks for `023-hybrid-rag-fusion-refinement`
2023:- when user asked to “Let 3 ultra-think agents review all work done in .../023-hybrid-rag-fusion-refinement,” run multi-agent read-only review with severity-ranked findings and exact file+line evidence [Task 1]

codex
I’ve got the deep-research workflow context and a promising memory hit around governed retrieval and shared-space scoping. Next I’m reading the exact memory notes plus the Modus/Public code paths that govern shared access, actor scoping, and any write-safety behavior.
exec
/bin/zsh -lc "sed -n '1570,1605p' /Users/michelkerkmeester/.codex/memories/MEMORY.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
## Failures and how to do differently

- symptom: stale references remain after script pass; cause: sibling docs/playbooks not covered; fix: run broader `rg` sweep and patch stragglers [Task 2]
- symptom: validator reports template debt after renumber; cause: pre-existing template issues; fix: track separately from rename regression [Task 1][Task 3]
- symptom: strict validate fails on SPEC_DOC_INTEGRITY despite accurate prose; cause: referenced files are missing/unresolvable from packet scope; fix: either provide in-scope files or relink to resolvable artifacts [Task 4]

# Task Group: Governed Retrieval, Memory Health Safety, and Hybrid Runtime Audit
scope: governed retrieval scope propagation, shared-space authorization contracts, memory health auto-repair safety, hybrid runtime audits, and handler-level envelope/graph-signal guards
applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit; reuse_rule=reuse for MCP/runtime governance fixes in this repo, but rerun targeted tests because handler behavior is time-sensitive

## Task 1: Governed retrieval/shared-space admin hardening and graph ranking fix

### rollout_summary_files

- rollout_summaries/2026-03-20T15-43-19-Q1K1-hydra_governed_retrieval_specs.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/20/rollout-2026-03-20T16-43-19-019d0bea-55b4-7ec0-a57a-2a3c9f459fc9.jsonl, updated_at=2026-03-20T17:13:21+00:00, thread_id=019d0bea-55b4-7ec0-a57a-2a3c9f459fc9)

### keywords

- tenantId userId agentId sharedSpaceId, filterRowsByScope, superRefine actor identity, score=edgeStrength*fts_score, vi.hoisted

## Task 2: Remove temp-root auto-delete from memory health autoRepair

### rollout_summary_files

- rollout_summaries/2026-03-20T15-43-10-Fxg6-auto_repair_temp_root_cleanup.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/20/rollout-2026-03-20T16-43-10-019d0bea-319e-7432-8739-3b088f450742.jsonl, updated_at=2026-03-20T17:13:04+00:00, thread_id=019d0bea-319e-7432-8739-3b088f450742)

### keywords

- memory_health autoRepair confirmed, temp_fixture_memory_cleanup, orphanedFiles warning, EXT-H15

## Task 3: Preserve importance-tier overrides and harden spec-affinity matching

### rollout_summary_files

- rollout_summaries/2026-03-20T15-42-58-lcys-fix_tier_override_and_spec_affinity.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/20/rollout-2026-03-20T16-42-58-019d0bea-0321-7352-8e66-c5d154da20e0.jsonl, updated_at=2026-03-20T17:13:02+00:00, thread_id=019d0bea-0321-7352-8e66-c5d154da20e0)


exec
/bin/zsh -lc "sed -n '1788,1832p' /Users/michelkerkmeester/.codex/memories/MEMORY.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
- rollout_summaries/2026-03-13T18-02-17-1YXi-phase_015_governance_refinement.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/13/rollout-2026-03-13T19-02-17-019ce85d-08e7-7411-b011-0414fe8fc054.jsonl, updated_at=2026-03-13T20:06:20+00:00, thread_id=019ce85d-08e7-7411-b011-0414fe8fc054)

### keywords

- filterRowsByScope, sessionId filtering, getAllowedSharedSpaceIds, assertSharedSpaceAccess, runRetentionSweep, tenant filtering

## Task 4: Apply TSDoc and reference-comment cleanup across Hydra runtime modules

### rollout_summary_files

- rollout_summaries/2026-03-13T19-22-18-0v7J-spec_kit_hydra_db_comment_cleanup.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/13/rollout-2026-03-13T20-22-18-019ce8a6-4c0d-7882-8bbd-ec7a9be5d66b.jsonl, updated_at=2026-03-13T20:27:00+00:00, thread_id=019ce8a6-4c0d-7882-8bbd-ec7a9be5d66b)

### keywords

- sk-code--opencode, TSDoc, BUG-###/REQ-###/CHK-### references, adaptive-ranking, shared-memory handlers, npx tsc --noEmit

## Task 5: Run end-to-end Hydra review and ship scoped commit/push

### rollout_summary_files

- rollout_summaries/2026-03-13T17-01-18-nBzp-hydra_phase1_docs_review_and_commit.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/13/rollout-2026-03-13T18-01-18-019ce825-33d1-7383-a15e-bfb227167b2f.jsonl, updated_at=2026-03-13T18:11:29+00:00, thread_id=019ce825-33d1-7383-a15e-bfb227167b2f)

### keywords

- feat(system-spec-kit): harden hydra rollout, validate.sh --recursive, npm run build, targeted vitest, git stage scope, origin/main

## User preferences

- when asked where to place follow-up Hydra changes, the user said “existing” -> keep Hydra work in the existing `015-hydra-db-based-features` packet unless asked to open a new one [Task 1][Task 4]
- when review scope said “make sure everything is bug free ... manual_testing_playbook & feature_catalog ... up to date,” include code + docs + playbook/catalog in one pass [Task 5]
- when user requested commit/push and clarified scope, isolate staged files to Hydra artifacts and leave unrelated work unstaged [Task 5]
- when violations are found in review, the user signal was “apply fixes” -> execute remediation immediately instead of stopping at findings-only reports [Task 4]

## Reusable knowledge

- Level-3 Hydra packets need AI protocol sections, anchors, `SPECKIT_TEMPLATE_SOURCE`, and `[EVIDENCE: ...]` tags on completed P0/P1 checklist rows for clean recursive validation [Task 1][Task 5]
- For phase-sliced completion, convert future-phase rows into explicit deferrals (`[deferred: Phase N follow-up]`) so Phase-1 can close without pretending later phases shipped [Task 2]
- `generate-context.js` succeeds in manual/headless runs when passed JSON-mode session data (`SPEC_FOLDER`, `recent_context`, `observations`, `user_prompts`) plus absolute spec path [Task 2]
- Governance hardening in this wave centered on guaranteed session/tenant enforcement in `filterRowsByScope`, shared-space authorization, and scoped retention sweep deletions [Task 3]
- Hydra comment quality standard: exported interfaces/functions must carry purposeful TSDoc plus traceable reference tags (`T###`, `REQ-###`, `BUG-###`, `CHK-###`) [Task 4]

## Failures and how to do differently

- symptom: completion gate fails while current phase work is done; cause: future phases remain unchecked; fix: mark those rows as explicit deferrals and keep only current-phase rows active [Task 2]
- symptom: memory save / context generation aborts in manual runs; cause: missing JSON input and telemetry doc/schema mismatch; fix: provide `/tmp/save-context-data.json` and sync telemetry README to code fields first [Task 2]

exec
/bin/zsh -lc "rg -n \"shared|scope|tenant|userId|agentId|actor|private|lock|mutex|concurrent|race|merge|conflict|vault|write|review|access\" \"/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external\" --glob '"'!**/node_modules/**'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/LICENSE:8:to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/MIGRATION_POST.md:50:After importing, `modus-memory doctor` validates your vault:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/assets/doctor.svg:16:    <text x="20" y="103" fill="#8b949e">Vault: /Users/you/modus/vault</text>
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md:3:A local LLM that serves as the sole gatekeeper for your memory vault.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md:7:Most AI memory systems let any model read and write freely. This creates predictable problems:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md:16:Run a small, dedicated local model — the **Librarian** — whose only job is memory stewardship. It sits between your vault and whatever model is doing the actual reasoning:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md:21:│ (reasoning)  │     │ (local, ~8B)   │     │   (vault)    │
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md:23:                     Sole write access
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md:46:You are the Librarian — the sole steward of persistent memory and vault state.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md:48:You are the ONLY model authorized to write to the vault. All other models
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md:56:- vault_write: Write or update vault documents
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md:57:- vault_search/vault_read: Retrieve information on behalf of other models
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md:59:No other model writes to the vault. Models may change. The sovereignty
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md:65:file it in the correct vault location with proper frontmatter, tags, and
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md:68:Retrieval: When the reasoning model needs context, search the vault and
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md:73:- ADAPT — valuable, add to vault with proper metadata
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md:81:getting accessed.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md:85:- Every vault entry needs YAML frontmatter (title, type, tags, status)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md:116:      "args": ["--vault", "~/vault"]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md:122:Then instruct your reasoning model: *"For any memory operation, delegate to the Librarian. Do not write to memory directly."*
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md:132:  "Search the vault for relevant context and return a compressed summary"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md:139:In a multi-agent setup, the Librarian is one agent in the fleet with exclusive write access to vault tools. Other agents (coder, researcher, reasoner) request storage through the Librarian agent.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md:145:tools: [vault_search, vault_read, vault_write, vault_list, memory_store, memory_search]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md:150:**User asks the cloud model:** "What did we decide about the auth refactor?"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md:152:**Cloud model delegates to Librarian:** "Search vault for decisions about auth refactor"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md:155:1. `vault_search("auth refactor decision")` — BM25 with query expansion finds "authentication," "OAuth," "session tokens"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md:168:**Cloud model delegates to Librarian:** "File this analysis in the vault"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md:181:1. **Single writer.** One model owns all writes. No conflicts, no inconsistency.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md:189:The Librarian pattern turns modus-memory from a storage layer into a complete personal memory system. The vault holds the data. The Librarian decides what goes in, what comes out, and what fades away.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/entities.go:1:package vault
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/assets/demo.svg:30:    <text x="20" y="148" fill="#8b949e">Vault:      ~/modus/vault</text>
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/assets/security.svg:38:  <text x="400" y="222" font-family="monospace" font-size="11" fill="#8b949e" text-anchor="middle">git commit your vault.</text>
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/assets/security.svg:52:  <text x="650" y="222" font-family="monospace" font-size="11" fill="#8b949e" text-anchor="middle">Delete = rm -rf ~/vault</text>
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/assets/architecture.svg:52:  <!-- Arrow to vault -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/assets/architecture.svg:59:  <text x="400" y="373" font-family="system-ui, sans-serif" font-size="14" fill="#e6edf3" text-anchor="middle" font-weight="600">~/vault/</text>
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:130:      "args": ["--vault", "~/vault"]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:141:claude mcp add memory -- modus-memory --vault ~/vault
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:154:    "args": ["--vault", "~/vault"]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:166:modus-memory --vault ~/vault
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:177:"Find everything related to the authentication refactor"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:180:### 3. Check your vault
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:185:# Vault: ~/modus/vault
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:197:| `vault_search` | BM25 full-text search with librarian query expansion and cross-reference hints |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:198:| `vault_read` | Read any document by path |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:199:| `vault_write` | Write a document with YAML frontmatter + markdown body |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:200:| `vault_list` | List documents in a subdirectory with optional filters |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:201:| `vault_status` | Vault statistics — document counts, index size, cross-ref stats |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:207:| `vault_connected` | Cross-reference query — find everything linked to a subject, tag, or entity |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:211:Most memory systems let any LLM read and write freely. modus-memory is designed around a different principle: a single dedicated local model — the **Librarian** — serves as the sole authority over persistent state.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:216:│ (reasoning)  │     │ (local, ~8B)   │     │   (vault)    │
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:218:                     Sole write access
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:238:  <img src="assets/architecture.svg" alt="Architecture — MCP client → modus-memory → vault" width="800"/>
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:259:Files live in `~/vault/` (configurable). Back them up with git. Edit them in VS Code. Grep them from the terminal. They're just files.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:281:The formula: `R(t) = (1 + t/(9*S))^(-1)` where S is stability (grows on recall) and t is time since last access.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:283:This means your vault self-cleans. You don't need to manually prune stale facts — they fade. The things you actually use stick around.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:287:Documents are connected by shared subjects, tags, and entities. A search for "authentication" returns not just keyword matches, but also:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:298:Multiple agents can share the same vault. Point Claude Desktop, Cursor, a CrewAI pipeline, and a cron job at the same `--vault` directory — they all read and write the same markdown files.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:300:Agent A stores a fact at 2pm. Agent B searches at 3pm and finds it. No message bus, no database. Just a shared directory.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:313:| Where is my data? | `~/vault/` (or wherever you point `--vault`). Plain `.md` files. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:318:| Can I air-gap it? | Yes. It has zero network dependencies. Copy the binary and your vault to an offline machine. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:319:| How do I back up? | `git init ~/vault && git add . && git commit`. Or rsync. Or Time Machine. They're files. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:320:| How do I delete everything? | `rm -rf ~/vault`. That's it. No accounts to close, no data retention policies, no "please email support." |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:324:modus-memory is designed for individual use, but teams can share a vault via a shared filesystem or git repo. There's no built-in access control — if you can read the filesystem, you can read the vault. For team use, control access at the filesystem level.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:331:  <img src="assets/doctor.svg" alt="modus-memory doctor — vault diagnostics" width="800"/>
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:343:- **Distribution** — where your documents live across the vault
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:380:| **Offline capable** | With significant setup | Copy binary + vault, done |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:394:| `--vault` | `MODUS_VAULT_DIR` | `~/modus/vault` | Vault directory path |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:396:That's it. One flag. The vault directory is created automatically on first run.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:401:~/vault/
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:434:The [official MCP memory server](https://github.com/modelcontextprotocol/servers/tree/main/src/memory) is deliberately minimal — it stores knowledge graph triples in a JSON file. No search ranking, no decay, no cross-referencing, no vault structure.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:436:modus-memory is a full-featured memory system: BM25 ranked search, FSRS spaced repetition, cross-references, librarian query expansion, and a markdown-based vault you can browse and edit. It's designed for long-term personal knowledge, not just key-value storage.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:450:Yes. modus-memory makes zero network calls. Copy the binary and your vault to an air-gapped machine and it works identically.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:456:Yes. Each client spawns its own modus-memory process, but they all read/write the same vault directory. The index is rebuilt on startup (takes ~2 seconds), and writes go directly to disk as markdown files. There's no lock contention for reads.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:462:The index is pure in-memory Go. Startup time scales roughly linearly — expect ~10 seconds for 100K docs on Apple Silicon. Search time stays constant (cache hit) or sub-10ms (cold). The binary's memory usage is roughly 2x the total text size of your vault.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:466:<summary><strong>Can I encrypt my vault?</strong></summary>
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:470:- **Linux**: LUKS, eCryptfs, or mount an encrypted partition at your vault path
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:479:Your vault is a directory of markdown files. Sync it however you sync files:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:480:- **git** — `git init ~/vault`, push to a private repo, pull on other machines
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:489:<summary><strong>What if two clients write to the same fact simultaneously?</strong></summary>
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:491:Last writer wins at the file level — it's a filesystem, not a database. In practice this rarely happens because MCP clients take turns (they're sequential conversations). If you're running automated pipelines that write concurrently, use separate fact files (the default behavior — each `memory_store` creates a new file).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go:1:package vault
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go:16:// memory type gates difficulty, and access-based reinforcement resets the clock.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go:52:// Simplified from FSRS-5. w=2.0 is the stability growth factor.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go:54:	w := 2.0 // growth factor — higher means faster stability growth on recall
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go:118:		// Calculate days since last access or creation
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go:119:		lastAccessed := doc.Get("last_accessed")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go:161:// This is the FSRS "review" operation — accessing a fact proves it's still relevant,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go:197:	// Confidence boost: asymptotic toward 1.0, small increment per access
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go:203:	// Track access count
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go:204:	accessCount := 0
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go:205:	if ac := doc.GetFloat("access_count"); ac > 0 {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go:206:		accessCount = int(ac)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go:208:	accessCount++
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go:213:	doc.Set("last_accessed", now.Format(time.RFC3339))
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go:214:	doc.Set("access_count", accessCount)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go:256:// TouchFact updates last_accessed on a fact, resetting its decay clock.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go:262:	doc.Set("last_accessed", time.Now().Format(time.RFC3339))
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go:339:// StoreFact writes a new memory fact as a .md file.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/doctor.go:13:// runDoctor performs a diagnostic scan of the vault and reports problems.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/doctor.go:15:func runDoctor(vaultDir string) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/doctor.go:17:	fmt.Printf("Vault: %s\n\n", vaultDir)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/doctor.go:20:	idx, err := index.Build(vaultDir, "")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/doctor.go:34:	docs, err := markdown.ScanDir(vaultDir)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/doctor.go:36:		fmt.Printf("FAIL: cannot scan vault: %v\n", err)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/doctor.go:152:					fmt.Sprintf("  %s / %s (%d conflicting values)", key.subject, key.predicate, len(seen)))
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/doctor.go:163:		full := fmt.Sprintf("%s/%s", vaultDir, dir)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/doctor.go:174:			// Get top-level dir relative to vault
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/doctor.go:176:			if idx := strings.LastIndex(rel, vaultDir); idx >= 0 {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/doctor.go:177:				rel = rel[idx+len(vaultDir)+1:]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/vault.go:1:package vault
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/vault.go:14:// Vault provides unified access to the entire vault — brain, memory, atlas, missions.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/vault.go:25:// Path joins segments onto the vault root.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/vault.go:31:// safePath resolves relPath within the vault and rejects traversal attempts.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/vault.go:40:		return "", fmt.Errorf("invalid vault root: %w", err)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/vault.go:57:// Write creates or overwrites a markdown file with frontmatter + body.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/vault.go:123:// Status returns vault-wide statistics.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go:10://	modus-memory --vault ~/notes    — use custom vault directory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go:12://	modus-memory health             — check vault health
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go:13://	modus-memory doctor              — diagnose vault problems (post-import validation)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go:25:	"github.com/GetModus/modus-memory/internal/vault"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go:32:	vaultDir := ""
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go:37:		case "--vault", "-v":
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go:39:				vaultDir = args[i+1]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go:46:			vd := resolveVaultDir(vaultDir)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go:50:			vd := resolveVaultDir(vaultDir)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go:54:			vd := resolveVaultDir(vaultDir)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go:60:	vaultDir = resolveVaultDir(vaultDir)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go:62:	// Ensure vault directory exists
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go:63:	if err := os.MkdirAll(vaultDir, 0755); err != nil {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go:64:		fmt.Fprintf(os.Stderr, "Cannot create vault directory %s: %v\n", vaultDir, err)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go:70:		os.MkdirAll(filepath.Join(vaultDir, sub), 0755)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go:78:	idx, err := index.Build(vaultDir, "")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go:83:	// Create vault
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go:84:	v := vault.New(vaultDir, idx)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go:90:	log.Printf("modus-memory %s — vault: %s, %d docs indexed", version, vaultDir, idx.DocCount())
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go:96:// resolveVaultDir determines the vault directory from flag, env, or default.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go:105:	return filepath.Join(home, "modus", "vault")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go:109:func runImport(vaultDir string, args []string) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go:123:		runImportKhoj(file, vaultDir)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go:130:// runHealth prints vault statistics.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go:131:func runHealth(vaultDir string) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go:132:	idx, err := index.Build(vaultDir, "")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go:134:		fmt.Printf("Vault: %s\n", vaultDir)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go:143:	fmt.Printf("Vault: %s\n", vaultDir)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/trust.go:1:package vault
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/trust.go:11:// GetTrustStage reads the current trust stage from vault/atlas/trust.md.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:1:package vault
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:19:		"blocked":   {},
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:89:// CreateMission writes a new mission .md file.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:113:// ShipClock returns the countdown to target.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:114:func (v *Vault) ShipClock() (map[string]interface{}, error) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:115:	doc, err := markdown.Parse(v.Path("state", "ship-clock.md"))
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:117:		return nil, fmt.Errorf("ship clock not configured")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:137:// ShipClockJSON returns ShipClock as formatted JSON.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:138:func (v *Vault) ShipClockJSON() (string, error) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:139:	clock, err := v.ShipClock()
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:143:	data, _ := json.MarshalIndent(clock, "", "  ")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:150:	Type string `json:"type"` // blocks, informs, enhances
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:154:// depType must be "blocks", "informs", or "enhances".
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:156:	if depType != "blocks" && depType != "informs" && depType != "enhances" {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:157:		return fmt.Errorf("dependency type must be blocks, informs, or enhances (got %q)", depType)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:169:	// Cycle detection for blocking deps
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:170:	if depType == "blocks" {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:187:	v.writeDependencies(mission, deps)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:207:	v.writeDependencies(mission, filtered)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:240:// CanStart checks if all blocking dependencies are satisfied.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:241:// Returns (canStart, list of unsatisfied blockers).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:248:	var blockers []string
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:250:		if d["type"] == "blocks" && !d["satisfied"].(bool) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:251:			blockers = append(blockers, d["slug"].(string))
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:255:	return len(blockers) == 0, blockers, nil
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:275:		// Check if this group has a blocking dep on the completed mission
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:277:		hasBlockingDep := false
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:279:			if d.Slug == completedSlug && d.Type == "blocks" {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:280:				hasBlockingDep = true
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:284:		if !hasBlockingDep {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:288:		// Check if ALL blocking deps are now satisfied
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:331:// writeDependencies sets the dependencies array in a mission's frontmatter.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:332:func (v *Vault) writeDependencies(doc *markdown.Document, deps []Dependency) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:360:		if d.Type == "blocks" && v.hasCycle(d.Slug, targetSlug, maxDepth-1) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/prs.go:1:package vault
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/prs.go:10:// OpenPR creates a new PR (evolution proposal) in vault/atlas/prs/.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/prs.go:49:// MergePR marks a PR as merged and reinforces all linked beliefs.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/prs.go:59:		return fmt.Errorf("PR is %s, not open — cannot merge", status)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/prs.go:62:	doc.Set("status", "merged")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/prs.go:74:			v.ReinforceBelief(id, "pr-merge")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/import_khoj.go:43:// runImportKhoj converts a Khoj export (ZIP or JSON) into vault markdown files.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/import_khoj.go:48:func runImportKhoj(exportPath, vaultDir string) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/import_khoj.go:64:	convDir := filepath.Join(vaultDir, "brain", "khoj")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/import_khoj.go:65:	factsDir := filepath.Join(vaultDir, "memory", "facts")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/import_khoj.go:76:	entityDir := filepath.Join(vaultDir, "atlas", "entities")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/import_khoj.go:131:		if err := writeMarkdown(path, fm, body.String()); err != nil {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/import_khoj.go:168:			if err := writeMarkdown(entPath, entFM, fmt.Sprintf("Entity extracted from Khoj conversation: %s\n", conv.Title)); err != nil {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/import_khoj.go:222:				if err := writeMarkdown(factPath, factFM, content); err != nil {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/import_khoj.go:345:// writeMarkdown writes a markdown file with YAML frontmatter.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/import_khoj.go:346:func writeMarkdown(path string, fm map[string]interface{}, body string) error {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/beliefs.go:1:package vault
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/beliefs.go:18:	"blocks":     0.03,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/beliefs.go:19:	"blocked_by": 0.03,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/helpers.go:1:package vault
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/learnings/learnings.go:3:// Unlike per-agent lessons (vault/experience/lessons/), learnings live at
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/learnings/learnings.go:4:// vault/brain/learnings/ and are accessible to every cartridge — Claude,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/learnings/learnings.go:66:// Dir returns the vault path for learnings.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/learnings/learnings.go:67:func Dir(vaultDir string) string {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/learnings/learnings.go:68:	return filepath.Join(vaultDir, "brain", "learnings")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/learnings/learnings.go:71:// Record writes a new learning to the vault.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/learnings/learnings.go:72:func Record(vaultDir string, l Learning) error {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/learnings/learnings.go:73:	dir := Dir(vaultDir)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/learnings/learnings.go:90:	// Don't overwrite — reinforce instead
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/learnings/learnings.go:92:		return Reinforce(vaultDir, l.Slug)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/learnings/learnings.go:116:// LoadAll reads every learning from the vault.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/learnings/learnings.go:117:func LoadAll(vaultDir string) []Learning {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/learnings/learnings.go:118:	return loadFromDir(Dir(vaultDir))
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/learnings/learnings.go:123:func LoadByDomain(vaultDir, domain string, limit int) []Learning {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/learnings/learnings.go:124:	all := LoadAll(vaultDir)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/learnings/learnings.go:152:func LoadForPrompt(vaultDir, domain string, limit int) string {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/learnings/learnings.go:153:	learnings := LoadByDomain(vaultDir, domain, limit)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/learnings/learnings.go:213:func safeLearningPath(vaultDir, slug string) (string, error) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/learnings/learnings.go:214:	dir := Dir(vaultDir)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/learnings/learnings.go:230:func Reinforce(vaultDir, slug string) error {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/learnings/learnings.go:231:	path, err := safeLearningPath(vaultDir, slug)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/learnings/learnings.go:257:func Deprecate(vaultDir, slug string) error {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/learnings/learnings.go:258:	path, err := safeLearningPath(vaultDir, slug)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/learnings/learnings.go:281:func Search(vaultDir, query string, limit int) []Learning {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/learnings/learnings.go:282:	all := LoadAll(vaultDir)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/learnings/learnings.go:301:func PromoteFromLesson(vaultDir string, summary, detail, sourceRole string, confidence float64) error {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/learnings/learnings.go:302:	return Record(vaultDir, Learning{
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/learnings/learnings.go:317:func RecordCorrection(vaultDir, summary, detail string) error {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/learnings/learnings.go:318:	return Record(vaultDir, Learning{
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/learnings.go:8:	"github.com/GetModus/modus-memory/internal/vault"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/learnings.go:13:func RegisterLearningsTools(srv *Server, v *vault.Vault) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/learnings.go:14:	vaultDir := v.Dir
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/learnings.go:35:				all := learnings.LoadAll(vaultDir)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/learnings.go:65:				text := learnings.LoadForPrompt(vaultDir, domain, limit)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/learnings.go:73:			results := learnings.LoadByDomain(vaultDir, domain, limit)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/learnings.go:146:			if err := learnings.Record(vaultDir, l); err != nil {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/learnings.go:171:			results := learnings.Search(vaultDir, query, limit)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/learnings.go:196:			if err := learnings.Reinforce(vaultDir, slug); err != nil {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/learnings.go:214:			if err := learnings.Deprecate(vaultDir, slug); err != nil {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/server.go:91:	writer := os.Stdout
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/server.go:110:		fmt.Fprintf(writer, "%s\n", data)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go:215:	NeedsReview     []string `json:"needs_review"`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go:240:  "needs_review": ["what deserves immediate review"],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:4:	"github.com/GetModus/modus-memory/internal/vault"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:12://	vault_search, vault_read, vault_write, vault_list, vault_status,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:14://	memory_reinforce, memory_decay_facts, vault_connected
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:15:func RegisterMemoryTools(srv *Server, v *vault.Vault) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:20:		"vault_search":      true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:21:		"vault_read":        true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:22:		"vault_write":       true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:23:		"vault_list":        true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:24:		"vault_status":      true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:30:		"vault_connected":   true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/client.go:2:// (Gemma 4 on llama-server). All vault search, triage, extraction, and
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/json.go:10:// This mirrors the Python SAGE _parse_json with brace-matching.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/json.go:14:	// Strip markdown code blocks
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/json.go:29:	// Find first { via brace matching
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go:73:// Save writes the document back to disk with updated frontmatter.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go:23:	hits    int // access count for LRU
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go:30:	counter int // global access counter for LRU
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go:43:	defer c.mu.RUnlock()
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go:86:	defer c.mu.Unlock()
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:12:	"github.com/GetModus/modus-memory/internal/vault"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:15:// RegisterVaultTools adds all vault MCP tools — replaces RegisterArchiveTools,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:18:func RegisterVaultTools(srv *Server, v *vault.Vault) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:32:			log.Printf("vault_search: librarian expanded %q → %d variants", query, len(expansions))
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:115:	srv.AddTool("vault_search", "Search the vault — brain, memory, atlas, missions.", searchSchema, searchHandler)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:119:	srv.AddTool("vault_read", "Read a vault file by relative path.", map[string]interface{}{
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:122:			"path": map[string]interface{}{"type": "string", "description": "Relative path within vault (e.g. brain/hn/some-file.md)"},
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:143:	srv.AddTool("vault_write", "Write a vault file (frontmatter + body).", map[string]interface{}{
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:146:			"path":        map[string]interface{}{"type": "string", "description": "Relative path within vault"},
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:166:	srv.AddTool("vault_list", "List vault files in a subdirectory, optionally filtered.", map[string]interface{}{
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:183:		var filters []vault.Filter
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:187:			filters = append(filters, vault.Filter{Field: field, Value: val, Exclude: exclude})
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:225:	srv.AddTool("vault_status", "Vault statistics — file counts, index size, cross-ref stats.", map[string]interface{}{
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:287:		// Run in-memory fact search across all query variants, merge by subject|predicate
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:289:		var merged []index.MemFact
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:297:					merged = append(merged, f)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:302:		if len(merged) == 0 {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:307:		if len(merged) > limit {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:308:			merged = merged[:limit]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:311:		// Reinforce accessed facts — FSRS recall event.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:313:		for _, f := range merged {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:315:				go v.ReinforceFact(f.ID) // async — don't block search response
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:321:			len(merged), len(queries)))
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:322:		for _, f := range merged {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:479:		for _, status := range []string{"active", "blocked", "planned", "completed"} {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:523:			"status": map[string]interface{}{"type": "string", "description": "Filter: active, blocked, planned, completed"},
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:570:	// --- QM: Ship Clock ---
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:572:	srv.AddTool("qm_ship_clock", "Ship clock — days remaining to target.", map[string]interface{}{
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:575:		return v.ShipClockJSON()
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:614:		label := vault.TrustStageLabel(stage)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:634:		return fmt.Sprintf("Trust stage set to %d (%s) by %s", stage, vault.TrustStageLabel(stage), updatedBy), nil
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:721:	srv.AddTool("atlas_merge_pr", "Merge an evolution PR. Reinforces linked beliefs. Operator only.", map[string]interface{}{
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:734:		return fmt.Sprintf("PR merged: %s (by %s). Linked beliefs reinforced.", relPath, closedBy), nil
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:758:			"status": map[string]interface{}{"type": "string", "description": "Filter: open, merged, rejected"},
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:786:			"type": map[string]interface{}{"type": "string", "description": "blocks, informs, or enhances"},
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:829:		canStart, blockers, _ := v.CanStart(mission)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:835:			sb.WriteString(fmt.Sprintf("Mission %q: **blocked** by %s\n\n", mission, strings.Join(blockers, ", ")))
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:888:			"path": map[string]interface{}{"type": "string", "description": "Relative vault path to the fact (e.g. memory/facts/some-fact.md)"},
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:901:	srv.AddTool("vault_connected", "Find all documents connected to a subject, entity, or tag. Returns facts, beliefs, entities, articles, learnings, and missions that share references.", map[string]interface{}{
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go:23:	Rank    float64 // connection strength (number of shared terms)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go:221:// inferDocKind determines the document type from its vault path and metadata.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go:1:// Package index implements pure Go full-text search over vault .md files.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go:22:// Index wraps an in-memory BM25 search engine built from vault .md files.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go:31:	vaultDir string
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go:34:// document is the internal representation of a vault file.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go:65:// Build scans a vault directory and creates an in-memory search index.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go:66:func Build(vaultDir string, _ string) (*Index, error) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go:70:	mdDocs, err := markdown.ScanDir(vaultDir)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go:72:		return nil, fmt.Errorf("scan vault: %w", err)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go:79:		rel, _ := filepath.Rel(vaultDir, md.Path)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go:125:		vaultDir: vaultDir,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go:129:	idx.indexFacts(vaultDir)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go:142:	// Infer vaultDir from indexPath: indexPath was typically ~/modus/data/index.sqlite
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go:143:	// The vault is at ~/modus/vault/
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go:145:	vaultDir := filepath.Join(home, "modus", "vault")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go:147:		vaultDir = envDir
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go:149:	return Build(vaultDir, "")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go:307:// indexFacts loads memory facts from vault/memory/facts/ into the fact store.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go:308:func (idx *Index) indexFacts(vaultDir string) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go:309:	factsDir := filepath.Join(vaultDir, "memory", "facts")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go:317:		rel, _ := filepath.Rel(vaultDir, doc.Path)

codex
The memory notes confirm our own system’s relevant comparison surface: governed retrieval, actor identity enforcement, and shared-space authorization. I’m drilling into exact code now to see whether Modus actually enforces single-writer/multi-agent safety in code, or mostly describes it as an operational pattern.
exec
/bin/zsh -lc "rg -n \"mutex|Mutex|RWMutex|flock|lock|index.lock|atomic|sync\\.Map|sync\\.Mutex|WriteFile|Rename\\(|OpenFile\\(|Create\\(|Truncate\\(|MkdirAll\\(|TempFile\\(|os\\.WriteFile|yaml|frontmatter|vault_write|memory_store\" \"/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal\"" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/entities.go:27:	// Search by name in frontmatter
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/beliefs.go:18:	"blocks":     0.03,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/beliefs.go:19:	"blocked_by": 0.03,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/vault.go:57:// Write creates or overwrites a markdown file with frontmatter + body.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/vault.go:63:	os.MkdirAll(filepath.Dir(abs), 0755)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/vault.go:67:// Filter constrains List results by frontmatter field.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/trust.go:12:// Returns the stage (1-3), the full frontmatter config, and any error.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:19:		"blocked":   {},
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:113:// ShipClock returns the countdown to target.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:114:func (v *Vault) ShipClock() (map[string]interface{}, error) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:115:	doc, err := markdown.Parse(v.Path("state", "ship-clock.md"))
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:117:		return nil, fmt.Errorf("ship clock not configured")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:137:// ShipClockJSON returns ShipClock as formatted JSON.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:138:func (v *Vault) ShipClockJSON() (string, error) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:139:	clock, err := v.ShipClock()
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:143:	data, _ := json.MarshalIndent(clock, "", "  ")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:150:	Type string `json:"type"` // blocks, informs, enhances
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:153:// AddDependency adds a typed dependency to a mission's frontmatter.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:154:// depType must be "blocks", "informs", or "enhances".
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:156:	if depType != "blocks" && depType != "informs" && depType != "enhances" {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:157:		return fmt.Errorf("dependency type must be blocks, informs, or enhances (got %q)", depType)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:169:	// Cycle detection for blocking deps
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:170:	if depType == "blocks" {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:240:// CanStart checks if all blocking dependencies are satisfied.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:241:// Returns (canStart, list of unsatisfied blockers).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:248:	var blockers []string
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:250:		if d["type"] == "blocks" && !d["satisfied"].(bool) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:251:			blockers = append(blockers, d["slug"].(string))
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:255:	return len(blockers) == 0, blockers, nil
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:275:		// Check if this group has a blocking dep on the completed mission
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:277:		hasBlockingDep := false
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:279:			if d.Slug == completedSlug && d.Type == "blocks" {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:280:				hasBlockingDep = true
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:284:		if !hasBlockingDep {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:288:		// Check if ALL blocking deps are now satisfied
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:303:// readDependencies extracts the dependencies array from a mission's frontmatter.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:331:// writeDependencies sets the dependencies array in a mission's frontmatter.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go:360:		if d.Type == "blocks" && v.hasCycle(d.Slug, targetSlug, maxDepth-1) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go:16:// memory type gates difficulty, and access-based reinforcement resets the clock.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go:256:// TouchFact updates last_accessed on a fact, resetting its decay clock.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go:11:// adjacency maps derived from existing frontmatter.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go:28:	mu      sync.RWMutex
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go:43:	defer c.mu.RUnlock()
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go:86:	defer c.mu.Unlock()
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/learnings/learnings.go:8:// Schema: each learning is a .md file with YAML frontmatter.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/learnings/learnings.go:61:	Summary     string  // one-line summary (from frontmatter)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/learnings/learnings.go:74:	if err := os.MkdirAll(dir, 0755); err != nil {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/learnings/learnings.go:113:	return os.WriteFile(path, []byte(sb.String()), 0644)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/learnings/learnings.go:253:	return os.WriteFile(path, []byte(strings.Join(lines, "\n")), 0644)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/learnings/learnings.go:276:	return os.WriteFile(path, []byte(strings.Join(lines, "\n")), 0644)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:143:	srv.AddTool("vault_write", "Write a vault file (frontmatter + body).", map[string]interface{}{
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:147:			"frontmatter": map[string]interface{}{"type": "object", "description": "YAML frontmatter fields"},
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:155:		if fmRaw, ok := args["frontmatter"].(map[string]interface{}); ok {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:170:			"field":   map[string]interface{}{"type": "string", "description": "Filter by frontmatter field"},
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:315:				go v.ReinforceFact(f.ID) // async — don't block search response
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:379:	srv.AddTool("memory_store", "Store a new episodic memory fact.", memoryStoreSchema, memoryStoreHandler)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:479:		for _, status := range []string{"active", "blocked", "planned", "completed"} {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:523:			"status": map[string]interface{}{"type": "string", "description": "Filter: active, blocked, planned, completed"},
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:570:	// --- QM: Ship Clock ---
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:572:	srv.AddTool("qm_ship_clock", "Ship clock — days remaining to target.", map[string]interface{}{
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:575:		return v.ShipClockJSON()
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:786:			"type": map[string]interface{}{"type": "string", "description": "blocks, informs, or enhances"},
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:829:		canStart, blockers, _ := v.CanStart(mission)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:835:			sb.WriteString(fmt.Sprintf("Mission %q: **blocked** by %s\n\n", mission, strings.Join(blockers, ", ")))
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:12://	vault_search, vault_read, vault_write, vault_list, vault_status,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:13://	memory_facts, memory_search, memory_store,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:22:		"vault_write":       true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:27:		"memory_store":      true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/json.go:14:	// Strip markdown code blocks
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go:10:	"gopkg.in/yaml.v3"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go:13:// Document represents a parsed markdown file with YAML frontmatter.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go:17:	Body        string                 // markdown content after frontmatter
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go:20:// Get returns a frontmatter value as a string, or empty string.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go:29:// GetFloat returns a frontmatter value as float64, or 0.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go:65:// Set updates a frontmatter value.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go:73:// Save writes the document back to disk with updated frontmatter.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go:114:	// Check for frontmatter
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go:120:		// No frontmatter — entire file is body
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go:132:	// Read frontmatter until closing ---
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go:144:	if err := yaml.Unmarshal([]byte(fmLines.String()), &doc.Frontmatter); err != nil {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/writer.go:10:// Write creates a markdown file with YAML frontmatter.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/writer.go:11:func Write(path string, frontmatter map[string]interface{}, body string) error {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/writer.go:13:	if err := os.MkdirAll(dir, 0755); err != nil {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/writer.go:20:	for key, val := range frontmatter {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/writer.go:51:	return os.WriteFile(path, []byte(sb.String()), 0644)

exec
/bin/zsh -lc 'rg -n "shared_memory|shared_space|filterRowsByScope|getAllowedSharedSpaceIds|assertSharedSpaceAccess|tenantId|userId|agentId|actor identity|superRefine|sessionId|governed|scope" .opencode/skill/system-spec-kit/mcp_server' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:72:10. [Governance and Scope](#10-governance-and-scope)
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:260:<!-- ANCHOR:governance-scope -->
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:265:| `SPECKIT_MEMORY_ROADMAP_PHASE` | `shared-rollout` | string | Active memory roadmap phase: `baseline`, `lineage`, `graph`, `adaptive`, `scope-governance`, `shared-rollout`. | `lib/config/capability-flags.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:269:| `SPECKIT_MEMORY_SCOPE_ENFORCEMENT` | `true` | boolean | Scope enforcement for tenant/user/agent isolation. Graduated ON. Legacy: `SPECKIT_HYDRA_SCOPE_ENFORCEMENT`. | `lib/governance/scope-governance.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:270:| `SPECKIT_MEMORY_GOVERNANCE_GUARDRAILS` | `true` | boolean | Governance guardrails for validated operations. Graduated ON. Legacy: `SPECKIT_HYDRA_GOVERNANCE_GUARDRAILS`. | `lib/governance/scope-governance.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:274:<!-- /ANCHOR:governance-scope -->
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:104:  tenantId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:105:  userId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:106:  agentId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:109:  sessionId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:123:  tenantId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:124:  userId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:125:  agentId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:128:  sessionId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:160:  tenantId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:161:  userId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:162:  agentId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:169:  tenantId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:170:  userId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:171:  agentId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:186:  // validated at runtime by scope-governance.ts (F3.04 fix).
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:187:  tenantId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:188:  userId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:189:  agentId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:190:  sessionId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:194:  governedAt: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:205:  specFolder: optionalPathString().describe('Spec folder scope for bulk delete (requires confirm: true)'),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:227:  sessionId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:268:  tenantId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:269:  userId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:270:  agentId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:277:  tenantId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:278:  userId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:279:  agentId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:286:  tenantId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:287:  userId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:288:  agentId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:295:  tenantId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:296:  userId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:297:  agentId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:309:  sessionId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:320:  sessionId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:373:  sessionId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:426:  shared_space_upsert: getSchema({
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:428:    tenantId: z.string(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:436:  shared_space_membership_set: getSchema({
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:438:    tenantId: z.string(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:445:  shared_memory_status: getSchema({
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:446:    tenantId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:450:  shared_memory_enable: getSchema({}) as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:462:  memory_context: ['input', 'mode', 'intent', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'sessionId', 'enableDedup', 'includeContent', 'includeTrace', 'tokenUsage', 'anchors', 'profile'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:463:  memory_search: ['cursor', 'query', 'concepts', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'sessionId', 'enableDedup', 'tier', 'contextType', 'useDecay', 'includeContiguity', 'includeConstitutional', 'enableSessionBoost', 'enableCausalBoost', 'includeContent', 'anchors', 'min_quality_score', 'minQualityScore', 'bypassCache', 'rerank', 'applyLengthPenalty', 'applyStateLimits', 'minState', 'intent', 'autoDetectIntent', 'trackAccess', 'includeArchived', 'mode', 'includeTrace', 'profile'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:464:  memory_quick_search: ['query', 'limit', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:465:  memory_match_triggers: ['prompt', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'session_id', 'turnNumber', 'include_cognitive'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:466:  memory_save: ['filePath', 'force', 'dryRun', 'skipPreflight', 'asyncEmbedding', 'tenantId', 'userId', 'agentId', 'sessionId', 'sharedSpaceId', 'provenanceSource', 'provenanceActor', 'governedAt', 'retentionPolicy', 'deleteAfter'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:472:  memory_validate: ['id', 'wasUseful', 'queryId', 'queryTerms', 'resultRank', 'totalResultsShown', 'searchMode', 'intent', 'sessionId', 'notes'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:474:  checkpoint_create: ['name', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'metadata'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:475:  checkpoint_list: ['specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:476:  checkpoint_restore: ['name', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'clearExisting'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:477:  checkpoint_delete: ['name', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'confirmName'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:478:  task_preflight: ['specFolder', 'taskId', 'knowledgeScore', 'uncertaintyScore', 'contextScore', 'knowledgeGaps', 'sessionId'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:479:  task_postflight: ['specFolder', 'taskId', 'knowledgeScore', 'uncertaintyScore', 'contextScore', 'gapsClosed', 'newGapsDiscovered', 'sessionId'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:487:  memory_get_learning_history: ['specFolder', 'sessionId', 'limit', 'onlyComplete', 'includeSummary'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:491:  shared_space_upsert: ['spaceId', 'tenantId', 'name', 'actorUserId', 'actorAgentId', 'rolloutEnabled', 'rolloutCohort', 'killSwitch'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:492:  shared_space_membership_set: ['spaceId', 'tenantId', 'actorUserId', 'actorAgentId', 'subjectType', 'subjectId', 'role'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:493:  shared_memory_status: ['tenantId', 'actorUserId', 'actorAgentId'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:494:  shared_memory_enable: [],
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:44:  inputSchema: { type: 'object', additionalProperties: false, properties: { input: { type: 'string', minLength: 1, description: 'The query, prompt, or context description (required)' }, mode: { type: 'string', enum: ['auto', 'quick', 'deep', 'focused', 'resume'], default: 'auto', description: 'Context retrieval mode: auto (detect intent), quick (fast triggers), deep (comprehensive search), focused (intent-optimized), resume (session recovery)' }, intent: { type: 'string', enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'], description: 'Explicit task intent. If not provided and mode=auto, intent is auto-detected from input.' }, specFolder: { type: 'string', description: 'Limit context to specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval when memory_context routes to memory_search.' }, userId: { type: 'string', description: 'User boundary for governed retrieval when memory_context routes to memory_search.' }, agentId: { type: 'string', description: 'Agent boundary for governed retrieval when memory_context routes to memory_search.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed retrieval when memory_context routes to memory_search.' }, limit: { type: 'number', minimum: 1, maximum: 100, description: 'Maximum results (mode-specific defaults apply)' }, sessionId: { type: 'string', description: 'Optional server-issued session identifier for working-memory continuity. When provided, it must match an existing server-managed session or the call is rejected. Omit it to let the server generate a new session for this request.' }, enableDedup: { type: 'boolean', default: true, description: 'Enable session deduplication' }, includeContent: { type: 'boolean', default: false, description: 'Include full file content in results' }, includeTrace: { type: 'boolean', default: false, description: 'Include provenance-rich trace data (scores, source, trace) in results when underlying memory_search is called' }, tokenUsage: { type: 'number', minimum: 0.0, maximum: 1.0, description: "Optional caller token usage ratio (0.0-1.0)" }, anchors: { type: 'array', items: { type: 'string' }, description: 'Filter content to specific anchors (e.g., ["state", "next-steps"] for resume mode)' }, profile: { type: 'string', enum: ['quick', 'research', 'resume', 'debug'], description: 'Optional response profile formatter. Returns a reduced or mode-aware response shape when profile formatting is enabled.' } }, required: ['input'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:70:      tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval. When provided with scope enforcement, results are isolated to this tenant.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:71:      userId: { type: 'string', description: 'User boundary for governed retrieval. Filters private or shared-space user-scoped memories.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:72:      agentId: { type: 'string', description: 'Agent boundary for governed retrieval. Filters agent-scoped memories.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:75:      sessionId: {
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:82:        description: 'Enable session deduplication (REQ-001). When true and sessionId provided, filters out already-sent memories.'
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:201:      tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:202:      userId: { type: 'string', description: 'User boundary for governed retrieval.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:203:      agentId: { type: 'string', description: 'Agent boundary for governed retrieval.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:204:      sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed retrieval.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:213:  inputSchema: { type: 'object', additionalProperties: false, properties: { prompt: { type: 'string', minLength: 1, description: 'User prompt or text to match against trigger phrases' }, specFolder: { type: 'string', description: 'Limit trigger matches to a specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed trigger matching.' }, userId: { type: 'string', description: 'User boundary for governed trigger matching.' }, agentId: { type: 'string', description: 'Agent boundary for governed trigger matching.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed trigger matching.' }, limit: { type: 'number', default: 3, minimum: 1, maximum: 100, description: 'Maximum number of matching memories to return (default: 3)' }, session_id: { type: 'string', description: 'Session identifier for cognitive features. When provided, enables attention decay and tiered content injection.' }, turnNumber: { type: 'number', minimum: 1, description: 'Current conversation turn number. Used with session_id for decay calculations.' }, include_cognitive: { type: 'boolean', default: true, description: 'Enable cognitive features (decay, tiers, co-activation). Requires session_id.' } }, required: ['prompt'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:220:  inputSchema: { type: 'object', additionalProperties: false, properties: { filePath: { type: 'string', minLength: 1, description: 'Absolute path to the memory file (must be in specs/**/memory/, .opencode/specs/**/memory/, specs/**/ for spec documents, or .opencode/skill/*/constitutional/)' }, force: { type: 'boolean', default: false, description: 'Force re-index even if content hash unchanged' }, dryRun: { type: 'boolean', default: false, description: 'Validate only without saving. Returns validation results including anchor format, duplicate check, and token budget estimation (CHK-160)' }, skipPreflight: { type: 'boolean', default: false, description: 'Skip pre-flight validation checks (not recommended)' }, asyncEmbedding: { type: 'boolean', default: false, description: 'When true, embedding generation is deferred for non-blocking saves. Memory is immediately saved with pending status and an async background attempt is triggered. Default false preserves synchronous embedding behavior.' }, tenantId: { type: 'string', description: 'Tenant boundary for governed ingest.' }, userId: { type: 'string', description: 'User boundary for governed ingest.' }, agentId: { type: 'string', description: 'Agent boundary for governed ingest.' }, sessionId: { type: 'string', description: 'Session boundary for governed ingest.' }, sharedSpaceId: { type: 'string', description: 'Optional shared-memory space for collaboration saves.' }, provenanceSource: { type: 'string', description: 'Required provenance source when governance guardrails are enabled.' }, provenanceActor: { type: 'string', description: 'Required provenance actor when governance guardrails are enabled.' }, governedAt: { type: 'string', description: 'ISO timestamp for governed ingest. Defaults to now when omitted.' }, retentionPolicy: { type: 'string', enum: ['keep', 'ephemeral', 'shared'], description: 'Retention class applied to the saved memory.' }, deleteAfter: { type: 'string', description: 'Optional ISO timestamp after which retention sweep may delete the memory.' } }, required: ['filePath'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:312:      sessionId: { type: 'string', description: 'Optional session identifier for selection telemetry' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:321:  description: '[L4:Mutation] Bulk delete memories by importance tier. Use to clean up deprecated or temporary memories at scale. Auto-creates checkpoint before deletion for safety. Refuses unscoped deletion of constitutional/critical tiers. Supports optional checkpoint bypass for lower-risk tiers when speed is prioritized. Token Budget: 500.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:322:  inputSchema: { type: 'object', additionalProperties: false, properties: { tier: { type: 'string', enum: ['constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated'], description: 'Importance tier to delete (required)' }, specFolder: { type: 'string', description: 'Optional: scope deletion to a specific spec folder' }, confirm: { type: 'boolean', const: true, description: 'Required safety gate: must be true to proceed' }, olderThanDays: { type: 'number', minimum: MEMORY_BULK_DELETE_MIN_OLDER_THAN_DAYS, description: 'Optional: only delete memories older than this many days' }, skipCheckpoint: { type: 'boolean', default: false, description: 'Optional speed optimization for non-critical tiers. When true, skips auto-checkpoint creation before delete. Rejected for constitutional/critical tiers.' } }, required: ['tier', 'confirm'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:335:      tenantId: { type: 'string', minLength: 1, description: 'Tenant boundary for governed checkpoint scope.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:336:      userId: { type: 'string', minLength: 1, description: 'Scope to this user (optional, defense-in-depth)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:337:      agentId: { type: 'string', minLength: 1, description: 'Scope to this agent (optional, defense-in-depth)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:338:      sharedSpaceId: { type: 'string', minLength: 1, description: 'Scope to this shared space (requires tenantId).' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:353:      tenantId: { type: 'string', minLength: 1, description: 'Tenant boundary for governed checkpoint scope.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:354:      userId: { type: 'string', minLength: 1, description: 'Scope to this user (optional, defense-in-depth)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:355:      agentId: { type: 'string', minLength: 1, description: 'Scope to this agent (optional, defense-in-depth)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:356:      sharedSpaceId: { type: 'string', minLength: 1, description: 'Scope to this shared space (requires tenantId).' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:370:      tenantId: { type: 'string', minLength: 1, description: 'Tenant boundary for governed checkpoint scope.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:371:      userId: { type: 'string', minLength: 1, description: 'Scope to this user (optional, defense-in-depth)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:372:      agentId: { type: 'string', minLength: 1, description: 'Scope to this agent (optional, defense-in-depth)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:373:      sharedSpaceId: { type: 'string', minLength: 1, description: 'Scope to this shared space (requires tenantId).' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:388:      tenantId: { type: 'string', minLength: 1, description: 'Tenant boundary for governed checkpoint scope.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:389:      userId: { type: 'string', minLength: 1, description: 'Scope to this user (optional, defense-in-depth)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:390:      agentId: { type: 'string', minLength: 1, description: 'Scope to this agent (optional, defense-in-depth)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:391:      sharedSpaceId: { type: 'string', minLength: 1, description: 'Scope to this shared space (requires tenantId).' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:403:  name: 'shared_space_upsert',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:410:      tenantId: { type: 'string', description: 'Owning tenant for the shared space.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:420:    required: ['spaceId', 'tenantId', 'name'],
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:425:  name: 'shared_space_membership_set',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:432:      tenantId: { type: 'string', description: 'Tenant boundary for the membership mutation.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:439:    required: ['spaceId', 'tenantId', 'subjectType', 'subjectId', 'role'],
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:444:  name: 'shared_memory_status',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:450:      tenantId: { type: 'string', description: 'Optional tenant filter applied to the authenticated caller scope.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:459:  name: 'shared_memory_enable',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:473:  inputSchema: { type: 'object', additionalProperties: false, properties: { specFolder: { type: 'string', minLength: 1, description: 'Path to spec folder (e.g., "specs/003-memory/077-upgrade")' }, taskId: { type: 'string', minLength: 1, description: 'Task identifier (e.g., "T1", "T2", "implementation")' }, knowledgeScore: { type: 'number', minimum: 0, maximum: 100, description: 'Current knowledge level (0-100): How well do you understand the task requirements and codebase context?' }, uncertaintyScore: { type: 'number', minimum: 0, maximum: 100, description: 'Current uncertainty level (0-100): How uncertain are you about the approach or implementation?' }, contextScore: { type: 'number', minimum: 0, maximum: 100, description: 'Current context completeness (0-100): How complete is your understanding of relevant context?' }, knowledgeGaps: { type: 'array', items: { type: 'string' }, description: 'List of identified knowledge gaps (optional)' }, sessionId: { type: 'string', description: 'Optional session identifier' } }, required: ['specFolder', 'taskId', 'knowledgeScore', 'uncertaintyScore', 'contextScore'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:479:  inputSchema: { type: 'object', additionalProperties: false, properties: { specFolder: { type: 'string', minLength: 1, description: 'Path to spec folder (must match preflight)' }, taskId: { type: 'string', minLength: 1, description: 'Task identifier (must match preflight)' }, knowledgeScore: { type: 'number', minimum: 0, maximum: 100, description: 'Post-task knowledge level (0-100)' }, uncertaintyScore: { type: 'number', minimum: 0, maximum: 100, description: 'Post-task uncertainty level (0-100)' }, contextScore: { type: 'number', minimum: 0, maximum: 100, description: 'Post-task context completeness (0-100)' }, gapsClosed: { type: 'array', items: { type: 'string' }, description: 'List of knowledge gaps closed during task (optional)' }, newGapsDiscovered: { type: 'array', items: { type: 'string' }, description: 'List of new gaps discovered during task (optional)' }, sessionId: { type: 'string', description: 'Optional session identifier. Required when multiple sessions share the same taskId and you need to target a specific learning cycle.' } }, required: ['specFolder', 'taskId', 'knowledgeScore', 'uncertaintyScore', 'contextScore'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:570:  inputSchema: { type: 'object', additionalProperties: false, properties: { specFolder: { type: 'string', minLength: 1, description: 'Spec folder path to get learning history for (required)' }, sessionId: { type: 'string', description: 'Filter by session ID (optional)' }, limit: { type: 'number', default: 10, minimum: 1, maximum: 100, description: 'Maximum records to return (default: 10, max: 100)' }, onlyComplete: { type: 'boolean', default: false, description: 'Only return records with both PREFLIGHT and POSTFLIGHT (complete learning cycles)' }, includeSummary: { type: 'boolean', default: true, description: 'Include summary statistics (averages, trends) in response' } }, required: ['specFolder'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:746:      specFolder: { type: 'string', description: 'Optional spec folder to scope the resume context' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:761:      specFolder: { type: 'string', description: 'Optional spec folder to scope the resume context' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:781:  description: '[L9:CoverageGraph] Idempotent upsert for coverage graph nodes and edges. Reducer writes graph deltas after each deep-loop iteration. Rejects self-loops, clamps weights to [0.0, 2.0], and merges metadata updates on repeated IDs. Requires specFolder, loopType, and sessionId for namespace isolation.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:787:      sessionId: { type: 'string', minLength: 1, description: 'Session identifier for namespace isolation (required)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:821:    required: ['specFolder', 'loopType', 'sessionId'],
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:835:      sessionId: { type: 'string', description: 'Optional session filter' },
.opencode/skill/system-spec-kit/mcp_server/README.md:313:- **LLM query reformulation** -- asks the LLM to rephrase the query more abstractly, grounding in actual knowledge base content. Reformulated hits pass through the same scope, context and quality checks as ordinary results
.opencode/skill/system-spec-kit/mcp_server/README.md:400:This is session-scoped to prevent cross-session interference.
.opencode/skill/system-spec-kit/mcp_server/README.md:475:**Constitutional memory as expert knowledge injection** -- tags high-priority memories with instructions about when to surface. They appear whenever relevant without you asking, like sticky notes on a filing cabinet that say "pull this file whenever someone asks about X." Constitutional injections obey global scope enforcement so the wrong tenant's rules never leak.
.opencode/skill/system-spec-kit/mcp_server/README.md:479:**Dual-scope memory auto-surface** -- watches for tool use and context compression events and automatically brings up important memories without being asked.
.opencode/skill/system-spec-kit/mcp_server/README.md:573:| `tenantId` | string | Tenant boundary for governed retrieval |
.opencode/skill/system-spec-kit/mcp_server/README.md:574:| `userId` | string | User boundary for governed retrieval |
.opencode/skill/system-spec-kit/mcp_server/README.md:575:| `agentId` | string | Agent boundary for governed retrieval |
.opencode/skill/system-spec-kit/mcp_server/README.md:576:| `sharedSpaceId` | string | Shared-space boundary for governed retrieval |
.opencode/skill/system-spec-kit/mcp_server/README.md:578:| `sessionId` | string | Session ID for deduplication across turns |
.opencode/skill/system-spec-kit/mcp_server/README.md:631:| `tenantId` | string | Tenant boundary |
.opencode/skill/system-spec-kit/mcp_server/README.md:632:| `userId` | string | User boundary |
.opencode/skill/system-spec-kit/mcp_server/README.md:633:| `agentId` | string | Agent boundary |
.opencode/skill/system-spec-kit/mcp_server/README.md:660:The lightweight search option. Works like a preset: you provide a query and optional scope boundaries and it forwards to the full search tool with sensible defaults. Use this when you want fast results without setting lots of parameters.
.opencode/skill/system-spec-kit/mcp_server/README.md:666:| `tenantId` | string | Tenant boundary |
.opencode/skill/system-spec-kit/mcp_server/README.md:667:| `userId` | string | User boundary |
.opencode/skill/system-spec-kit/mcp_server/README.md:668:| `agentId` | string | Agent boundary |
.opencode/skill/system-spec-kit/mcp_server/README.md:712:| `sessionId` | string | Session attribution |
.opencode/skill/system-spec-kit/mcp_server/README.md:713:| `tenantId` | string | Governance: tenant scope |
.opencode/skill/system-spec-kit/mcp_server/README.md:714:| `userId` | string | Governance: user attribution |
.opencode/skill/system-spec-kit/mcp_server/README.md:715:| `agentId` | string | Governance: agent attribution |
.opencode/skill/system-spec-kit/mcp_server/README.md:719:| `governedAt` | string | ISO timestamp for governed ingest audit |
.opencode/skill/system-spec-kit/mcp_server/README.md:891:##### `shared_space_upsert`
.opencode/skill/system-spec-kit/mcp_server/README.md:893:Create or update a shared-memory space. Shared spaces start locked: nobody can read or write until you add members with `shared_space_membership_set`. The person or agent who creates the space automatically becomes its owner.
.opencode/skill/system-spec-kit/mcp_server/README.md:898:| `tenantId` | string | **Required.** Tenant scope |
.opencode/skill/system-spec-kit/mcp_server/README.md:908:##### `shared_space_membership_set`
.opencode/skill/system-spec-kit/mcp_server/README.md:915:| `tenantId` | string | **Required.** Tenant boundary |
.opencode/skill/system-spec-kit/mcp_server/README.md:924:##### `shared_memory_status`
.opencode/skill/system-spec-kit/mcp_server/README.md:930:| `tenantId` | string | Filter by tenant |
.opencode/skill/system-spec-kit/mcp_server/README.md:931:| `userId` | string | Filter by user |
.opencode/skill/system-spec-kit/mcp_server/README.md:932:| `agentId` | string | Filter by agent |
.opencode/skill/system-spec-kit/mcp_server/README.md:936:##### `shared_memory_enable`
.opencode/skill/system-spec-kit/mcp_server/README.md:960:| `sessionId` | string | Session identifier |
.opencode/skill/system-spec-kit/mcp_server/README.md:1114:| `sessionId` | string | Filter by session |
.opencode/skill/system-spec-kit/mcp_server/README.md:1496:{ "tool": "shared_memory_enable", "arguments": {} }
.opencode/skill/system-spec-kit/mcp_server/README.md:1501:  "tool": "shared_space_upsert",
.opencode/skill/system-spec-kit/mcp_server/README.md:1504:    "tenantId": "acme",
.opencode/skill/system-spec-kit/mcp_server/README.md:1515:  "tool": "shared_space_membership_set",
.opencode/skill/system-spec-kit/mcp_server/README.md:1518:    "tenantId": "acme",
.opencode/skill/system-spec-kit/mcp_server/README.md:1646:| Shared memory not working | Call `shared_memory_enable` first, then create a space with an actor identity |
.opencode/skill/system-spec-kit/mcp_server/README.md:1705:Yes, through shared memory. Call `shared_memory_enable`, create a space with `shared_space_upsert` and grant access with `shared_space_membership_set`. Spaces are deny-by-default and the first creator becomes owner. See [SHARED_MEMORY_DATABASE.md](../SHARED_MEMORY_DATABASE.md) for the full guide.
.opencode/skill/system-spec-kit/mcp_server/scripts/README.md:75:- Indexed scope follows current scan behavior, including memory, constitutional and spec-doc discovery defaults.
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:360:  const transportSessionId = typeof (extra as { sessionId?: unknown } | null)?.sessionId === 'string'
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:361:    ? ((extra as { sessionId?: string }).sessionId ?? null)
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:363:  const explicitSessionId = typeof args.sessionId === 'string'
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:364:    ? args.sessionId
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:378:// that lack an explicit sessionId param can still correlate with a prior search.
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1340:// P1-09 FIX: Hoist transport to module scope so shutdown handlers can close it
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1803:            console.error('[context-server] Recoverable sessions:', interrupted.sessions.map((s: { sessionId: string }) => s.sessionId).join(', '));
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:11:  assertSharedSpaceAccess,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:19:import { recordGovernanceAudit } from '../lib/governance/scope-governance.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:31:type SharedSpaceAdminTool = 'shared_space_upsert' | 'shared_space_membership_set';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:32:type SharedAdminTool = SharedSpaceAdminTool | 'shared_memory_enable';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:33:type SharedIdentityTool = SharedAdminTool | 'shared_memory_status';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:108:        details: { reason: 'shared_memory_admin_unconfigured' },
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:123:        details: { reason: 'shared_memory_admin_ambiguous' },
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:147:  const userIdProvided = typeof args.actorUserId === 'string';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:148:  const agentIdProvided = typeof args.actorAgentId === 'string';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:151:  const hasBlankUser = userIdProvided && normalizedUserId.length === 0;
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:152:  const hasBlankAgent = agentIdProvided && normalizedAgentId.length === 0;
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:171:      'Provide only one actor identity.',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:174:        error: 'Provide only one actor identity.',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:210:  tenantId?: string,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:212:  const normalizedTenantId = typeof tenantId === 'string' ? tenantId.trim() : '';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:214:  if (args.tool !== 'shared_memory_enable' && normalizedTenantId.length === 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:216:      'Tenant scope is required for shared-memory admin mutations.',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:219:        error: 'Tenant scope is required for shared-memory admin mutations.',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:221:        reason: 'shared_space_tenant_required',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:222:        hint: 'Provide the tenantId for the target shared-space mutation.',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:239:        reason: 'shared_memory_trusted_binding_required',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:248:  // Shared-memory tools do not currently receive a server-minted sessionId or
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:262:  tenantId: string,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:265:  tenantId: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:267:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:268:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:271:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:273:    userId: actor.subjectType === 'user' ? actor.subjectId : undefined,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:274:    agentId: actor.subjectType === 'agent' ? actor.subjectId : undefined,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:282:    tenantId: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:291:    action: 'shared_space_admin',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:294:    ...buildActorScope(args.actor, args.tenantId, args.spaceId),
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:310:    case 'shared_space_not_found':
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:312:    case 'shared_space_create_admin_required':
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:314:    case 'shared_space_tenant_mismatch':
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:316:    case 'shared_space_owner_required':
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:317:      return tool === 'shared_space_membership_set'
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:320:    case 'shared_space_editor_required':
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:322:    case 'shared_space_membership_required':
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:324:    case 'shared_space_kill_switch':
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:326:    case 'shared_space_rollout_disabled':
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:328:    case 'shared_space_tenant_required':
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:329:      return 'Tenant scope is required to manage shared spaces.';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:336:  return reason === 'shared_space_membership_required'
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:337:    ? 'shared_space_owner_required'
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:349:    code: reason === 'shared_space_not_found' ? 'E_NOT_FOUND' : 'E_AUTHORIZATION',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:352:      hint: reason === 'shared_space_not_found'
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:353:        ? 'Create the space first with shared_space_upsert.'
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:354:        : reason === 'shared_space_create_admin_required'
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:363:    tool: 'shared_memory_enable',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:374:  tool: 'shared_space_upsert' | 'shared_space_membership_set' | 'shared_memory_status' | 'shared_memory_enable',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:385:    details: { reason: 'shared_memory_internal_error' },
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:405:function getAllowedSharedSpaceIdsForCaller(
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:408:  tenantId?: string,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:415:  const normalizedTenantId = typeof tenantId === 'string' && tenantId.trim().length > 0
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:416:    ? tenantId.trim()
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:421:    FROM shared_space_members m
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:422:    JOIN shared_spaces s ON s.space_id = m.space_id
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:446:    // WARNING: Admin mutations trust caller-supplied actor identity until transport-auth binding is added.
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:454:        tool: 'shared_space_upsert',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:461:      tool: 'shared_space_upsert',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:464:    }, args.tenantId);
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:472:        FROM shared_spaces
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:483:          const access = assertSharedSpaceAccess(
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:485:            buildActorScope(actor, args.tenantId, args.spaceId),
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:490:            const reason = normalizeOwnerAdminDenyReason(access.reason ?? 'shared_space_owner_required');
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:493:              tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:505:              msg: getSharedSpaceAccessErrorMessage('shared_space_upsert', args.spaceId, reason),
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:511:        const reason = 'shared_space_create_admin_required';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:514:          tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:526:          msg: getSharedSpaceAccessErrorMessage('shared_space_upsert', args.spaceId, reason),
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:533:        tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:566:        FROM shared_spaces
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:573:        tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:598:      return createSharedSpaceAuthError('shared_space_upsert', result.error, result.msg);
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:602:      tool: 'shared_space_upsert',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:606:        tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:621:      'shared_space_upsert',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:637:    // WARNING: Admin mutations trust caller-supplied actor identity until transport-auth binding is added.
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:645:        tool: 'shared_space_membership_set',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:652:      tool: 'shared_space_membership_set',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:655:    }, args.tenantId);
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:658:      const access = assertSharedSpaceAccess(
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:660:        buildActorScope(actor, args.tenantId, args.spaceId),
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:665:        const reason = normalizeOwnerAdminDenyReason(access.reason ?? 'shared_space_owner_required');
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:669:            tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:684:          console.error(`[shared-memory] Failed to record shared_space_admin audit: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:687:          'shared_space_membership_set',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:689:          getSharedSpaceAccessErrorMessage('shared_space_membership_set', args.spaceId, reason),
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:704:        tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:720:      tool: 'shared_space_membership_set',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:724:        tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:738:      'shared_space_membership_set',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:747: * Report rollout status and visible shared spaces for the requested scope.
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:749: * @param args - Tenant, user, or agent scope to evaluate.
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:756:      tool: 'shared_memory_status',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:762:      ? getAllowedSharedSpaceIdsForCaller(db, actor, args.tenantId)
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:765:      tool: 'shared_memory_status',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:772:        tenantId: args.tenantId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:773:        userId: actor.subjectType === 'user' ? actor.subjectId : null,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:774:        agentId: actor.subjectType === 'agent' ? actor.subjectId : null,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:785:      'shared_memory_status',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:802:    // WARNING: Admin mutations trust caller-supplied actor identity until transport-auth binding is added.
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:805:      tool: 'shared_memory_enable',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:811:        'shared_memory_enable_admin_required',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:823:        .get('shared_memory_enabled') as { value: string } | undefined;
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:834:        tool: 'shared_memory_enable',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:850:      tool: 'shared_memory_enable',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:866:      'shared_memory_enable',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:901:- **Spaces** — Named containers for shared memories, scoped to a tenant.
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:911:| \`/memory:manage shared create <spaceId> <tenantId> <name>\` | Create or update a shared space; first creator becomes owner |
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:29:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:30:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:31:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:34:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:49:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:50:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:51:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:62:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:145:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:156:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:157:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:158:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:159:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:163:  governedAt?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:179:  tenantId: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:190:  tenantId: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:199:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:219:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:220:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:221:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:229:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:230:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:231:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:239:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:240:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:241:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:249:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:250:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:251:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:264:  sessionId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:276:  sessionId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:282:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/scripts/migrations/create-checkpoint.ts:198:    scopeDimensionsTracked: rollout.scopeDimensionsTracked,
.opencode/skill/system-spec-kit/mcp_server/test/hooks/replay-harness.ts:68:  sessionId: string = 'replay-session',
.opencode/skill/system-spec-kit/mcp_server/test/hooks/replay-harness.ts:90:          session_id: sessionId,
.opencode/skill/system-spec-kit/mcp_server/test/hooks/replay-harness.ts:99:        const statePath = getStatePath(sessionId);
.opencode/skill/system-spec-kit/mcp_server/test/hooks/replay-harness.ts:101:        const state = loadState(sessionId);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:87:  sessionId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:95:// Token budgets for dual-scope lifecycle hooks (TM-05)
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:116:function recordToolCall(sessionId?: string): void {
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:118:  if (typeof sessionId === 'string' && sessionId.trim().length > 0) {
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:119:    lastActiveSessionId = sessionId.trim();
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:132:function isSessionPrimed(sessionId: string): boolean {
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:133:  return primedSessionIds.has(sessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:137:function markSessionPrimed(sessionId: string): void {
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:138:  primedSessionIds.add(sessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:139:  lastActiveSessionId = sessionId;
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:315:    // Query top attention-weighted memories, scoped to the current session
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:492:  sessionId?: string,
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:494:  // Derive a session key from explicit sessionId or tool args.
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:495:  const effectiveSessionId = sessionId
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:496:    ?? (typeof toolArgs.sessionId === 'string' ? toolArgs.sessionId : null)
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:560: * Reset priming state. When called with a sessionId, clears only that session.
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:563:function resetSessionPrimed(sessionId?: string): void {
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:564:  if (sessionId) {
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:565:    primedSessionIds.delete(sessionId);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-utils.ts:62:      session_id: input.sessionId ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:67:    sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:85:  sessionId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:92:  tenantId: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:93:  userId: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:94:  agentId: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:102:  tenantId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:103:  userId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:104:  agentId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:124:  sessionId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:153:  sessionId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:159:  tenantId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:160:  userId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:161:  agentId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:277:function hasSessionStateRecord(sessionId: string): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:283:    ).get(sessionId) as { 1?: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:292:function hasSentMemoryRecord(sessionId: string): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:298:    ).get(sessionId) as { 1?: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:307:function isTrackedSession(sessionId: string): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:308:  if (!sessionId || typeof sessionId !== 'string') {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:312:  const normalizedSessionId = sessionId.trim();
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:330:function getSessionIdentityRecord(sessionId: string): {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:331:  tenantId: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:332:  userId: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:333:  agentId: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:344:  `).get(sessionId) as Record<string, unknown> | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:351:    tenantId: normalizeIdentityValue(row.tenant_id),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:352:    userId: normalizeIdentityValue(row.user_id),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:353:    agentId: normalizeIdentityValue(row.agent_id),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:358:  storedIdentity: { tenantId: string | null; userId: string | null; agentId: string | null },
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:359:  scope: SessionIdentityScope = {},
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:361:  const requestedTenantId = normalizeIdentityValue(scope.tenantId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:362:  if (requestedTenantId && storedIdentity.tenantId !== requestedTenantId) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:363:    return 'tenantId';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:366:  const requestedUserId = normalizeIdentityValue(scope.userId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:367:  if (requestedUserId && storedIdentity.userId !== requestedUserId) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:368:    return 'userId';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:371:  const requestedAgentId = normalizeIdentityValue(scope.agentId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:372:  if (requestedAgentId && storedIdentity.agentId !== requestedAgentId) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:373:    return 'agentId';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:380:  storedIdentity: { tenantId: string | null; userId: string | null; agentId: string | null } | null,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:381:): storedIdentity is { tenantId: string | null; userId: string | null; agentId: string | null } {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:382:  return Boolean(storedIdentity && (storedIdentity.tenantId || storedIdentity.userId || storedIdentity.agentId));
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:387:  scope: SessionIdentityScope = {},
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:406:      error: `sessionId "${normalizedSessionId}" does not match a server-managed session. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.`,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:416:      error: `sessionId "${normalizedSessionId}" is not bound to a corroborated server identity. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.`,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:420:  const mismatch = getIdentityMismatch(storedIdentity, scope);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:426:      error: `sessionId "${normalizedSessionId}" is bound to a different ${mismatch}. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.`,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:508:function shouldSendMemory(sessionId: string, memory: MemoryInput | number): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:515:  if (!sessionId || typeof sessionId !== 'string') return true;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:526:    const exists = stmt.get(sessionId, hash);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:536:  sessionId: string,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:542:  if (!SESSION_CONFIG.enabled || !sessionId || !Array.isArray(memories)) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:573:      const existingRows = existingStmt.all(sessionId) as { memory_hash: string }[];
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:580:          const insertResult = insertStmt.run(sessionId, hash, memory.id || null, now);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:594:        enforceEntryLimit(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:634:function markMemorySent(sessionId: string, memory: MemoryInput | number): MarkResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:637:  if (!sessionId || typeof sessionId !== 'string') {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:638:    return { success: false, error: 'Valid sessionId is required' };
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:653:      stmt.run(sessionId, hash, memoryId, new Date().toISOString());
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:655:      enforceEntryLimit(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:666:function markMemoriesSentBatch(sessionId: string, memories: MemoryInput[]): MarkBatchResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:669:  if (!sessionId || !Array.isArray(memories) || memories.length === 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:670:    return { success: false, markedCount: 0, error: 'Valid sessionId and memories array required' };
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:685:        const result = insertStmt.run(sessionId, hash, memory.id || null, now);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:691:      enforceEntryLimit(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:708:function enforceEntryLimit(sessionId: string): void {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:709:  if (!db || !sessionId) return;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:715:    const row = countStmt.get(sessionId) as { count: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:730:    deleteStmt.run(sessionId, sessionId, excess);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:843:function clearSession(sessionId: string): CleanupResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:844:  if (!db || !sessionId) return { success: false, deletedCount: 0 };
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:850:    const result = stmt.run(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:854:      workingMemory.clearSession(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:857:      console.warn(`[session-manager] Working memory cleanup for ${sessionId} failed: ${wmMsg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:868:function getSessionStats(sessionId: string): SessionStats {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:869:  if (!db || !sessionId) return { totalSent: 0, oldestEntry: null, newestEntry: null };
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:880:    const row = stmt.get(sessionId) as { total_sent: number; oldest_entry: string | null; newest_entry: string | null } | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:898:function filterSearchResults(sessionId: string, results: MemoryInput[]): FilterResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:899:  if (!SESSION_CONFIG.enabled || !sessionId || !Array.isArray(results)) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:907:  const shouldSendMap = shouldSendMemoriesBatch(sessionId, results, true);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:938:function markResultsSent(sessionId: string, results: MemoryInput[]): MarkBatchResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:939:  if (!SESSION_CONFIG.enabled || !sessionId || !Array.isArray(results) || results.length === 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:943:  return markMemoriesSentBatch(sessionId, results);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:976:  'CREATE INDEX IF NOT EXISTS idx_session_state_identity_scope ON session_state(tenant_id, user_id, agent_id);',
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1020:function saveSessionState(sessionId: string, state: SessionStateInput = {}): InitResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1022:  if (!sessionId || typeof sessionId !== 'string') {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1023:    return { success: false, error: 'Valid sessionId is required' };
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1030:    const tenantId = normalizeIdentityValue(state.tenantId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1031:    const userId = normalizeIdentityValue(state.userId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1032:    const agentId = normalizeIdentityValue(state.agentId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1057:      sessionId,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1064:      tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1065:      userId,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1066:      agentId,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1079:function completeSession(sessionId: string): InitResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1080:  if (!db || !sessionId) return { success: false, error: 'Database or sessionId not available' };
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1088:    stmt.run(new Date().toISOString(), sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1092:      workingMemory.clearSession(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1095:      console.warn(`[session-manager] Working memory cleanup for ${sessionId} failed: ${wmMsg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1126:function recoverState(sessionId: string, scope: SessionIdentityScope = {}): RecoverResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1128:  if (!sessionId || typeof sessionId !== 'string') {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1129:    return { success: false, error: 'Valid sessionId is required' };
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1143:    const row = stmt.get(sessionId) as Record<string, unknown> | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1150:      tenantId: normalizeIdentityValue(row.tenant_id),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1151:      userId: normalizeIdentityValue(row.user_id),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1152:      agentId: normalizeIdentityValue(row.agent_id),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1154:    const mismatch = getIdentityMismatch(storedIdentity, scope);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1156:      return { success: false, error: `sessionId "${sessionId}" is bound to a different ${mismatch}` };
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1160:      sessionId: row.session_id as string,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1167:      tenantId: storedIdentity.tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1168:      userId: storedIdentity.userId,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1169:      agentId: storedIdentity.agentId,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1182:      updateStmt.run(new Date().toISOString(), sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1193:function getInterruptedSessions(scope: SessionIdentityScope = {}): InterruptedSessionsResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1209:        tenantId: normalizeIdentityValue(row.tenant_id),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1210:        userId: normalizeIdentityValue(row.user_id),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1211:        agentId: normalizeIdentityValue(row.agent_id),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1213:      return getIdentityMismatch(storedIdentity, scope) === null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1219:        sessionId: row.session_id as string,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1241:    sessionId,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1262:    : sessionId
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1263:      ? `memory_search({ sessionId: "${sessionId}" })`
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1278:| **Session ID** | \`${sessionId || 'N/A'}\` |
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1324:function writeContinueSessionMd(sessionId: string, specFolderPath: string): CheckpointResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1325:  if (!sessionId || !specFolderPath) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1326:    return { success: false, error: 'sessionId and specFolderPath are required' };
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1330:    const recoverResult = recoverState(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1333:        sessionId,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1355:  sessionId: string,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1359:  const saveResult = saveSessionState(sessionId, state);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1366:    return writeContinueSessionMd(sessionId, folderPath);
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:86:        tenantId: validated.tenantId as string | undefined,
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:87:        userId: validated.userId as string | undefined,
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:88:        agentId: validated.agentId as string | undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:140:const { filtered, dedupStats } = filterSearchResults(sessionId, results);
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:146:markResultsSent(sessionId, filtered);
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:164:  console.log(`Session ${s.sessionId}: ${s.lastAction} in ${s.specFolder}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:174:saveSessionState(sessionId, {
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:183:checkpointSession(sessionId, {
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:194:| Check if should send | `shouldSendMemory(sessionId, memory)` | Before returning single memory |
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:195:| Batch check | `shouldSendMemoriesBatch(sessionId, memories)` | Before returning multiple memories |
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:196:| Mark single sent | `markMemorySent(sessionId, memory)` | After returning a memory |
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:197:| Mark batch sent | `markMemoriesSentBatch(sessionId, memories)` | After returning multiple memories |
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:198:| Clear session | `clearSession(sessionId)` | On explicit session end |
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:199:| Get session stats | `getSessionStats(sessionId)` | For debugging/logging |
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:200:| Recover state | `recoverState(sessionId)` | On session resume |
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:201:| Complete session | `completeSession(sessionId)` | On normal session end |
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:223:const stats = getSessionStats(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:227:clearSession(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:247:console.log(`Using session: ${sessionId}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:268:console.log(getSessionStats(sessionId));
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:129: * @param args - Ingest arguments (paths, scope, options)
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:56:  'shared_space_upsert',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:57:  'shared_space_membership_set',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:58:  'shared_memory_status',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:59:  'shared_memory_enable',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:77:    case 'shared_space_upsert':        return handleSharedSpaceUpsert(parseArgs<SharedSpaceUpsertArgs>(validateToolArgs('shared_space_upsert', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:78:    case 'shared_space_membership_set': return handleSharedSpaceMembershipSet(parseArgs<SharedSpaceMembershipArgs>(validateToolArgs('shared_space_membership_set', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:79:    case 'shared_memory_status':       return handleSharedMemoryStatus(parseArgs<SharedMemoryStatusArgs>(validateToolArgs('shared_memory_status', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:80:    case 'shared_memory_enable':       return handleSharedMemoryEnable(parseArgs<Record<string, unknown>>(validateToolArgs('shared_memory_enable', args)));
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:42:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:43:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:44:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:51:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:52:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:53:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:60:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:61:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:62:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:69:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:70:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:71:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:77:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:78:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:79:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:92:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:203:  const tenantId = validateValue(args.tenantId, 'tenantId', { trim: true });
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:204:  const userId = validateValue(args.userId, 'userId');
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:205:  const agentId = validateValue(args.agentId, 'agentId');
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:208:    userId !== undefined || agentId !== undefined || sharedSpaceId !== undefined;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:212:    && tenantId !== undefined
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:213:    && tenantId.trim().length === 0
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:215:    throw new Error('tenantId must be a non-empty string when userId, agentId, or sharedSpaceId is provided');
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:219:    tenantId: tenantId && tenantId.length > 0 ? tenantId : undefined,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:220:    userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:221:    agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:226:function hasCheckpointScope(scope: CheckpointScopeArgs): boolean {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:228:    scope.tenantId !== undefined
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:229:    || scope.userId !== undefined
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:230:    || scope.agentId !== undefined
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:231:    || scope.sharedSpaceId !== undefined
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:235:function requiresCheckpointTenant(scope: CheckpointScopeArgs): boolean {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:236:  return scope.tenantId === undefined && (
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:237:    scope.userId !== undefined
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:238:    || scope.agentId !== undefined
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:239:    || scope.sharedSpaceId !== undefined
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:245:  scope: CheckpointScopeArgs,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:249:    ...(scope.tenantId !== undefined ? { tenantId: scope.tenantId } : {}),
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:250:    ...(scope.userId !== undefined ? { userId: scope.userId } : {}),
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:251:    ...(scope.agentId !== undefined ? { agentId: scope.agentId } : {}),
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:252:    ...(scope.sharedSpaceId !== undefined ? { sharedSpaceId: scope.sharedSpaceId } : {}),
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:256:function checkpointMatchesScope(rawMetadata: unknown, scope: CheckpointScopeArgs): boolean {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:259:    const expected = scope[field];
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:268:    matchesScopeField('tenantId') &&
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:269:    matchesScopeField('userId') &&
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:270:    matchesScopeField('agentId') &&
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:275:function checkpointScopeDetails(scope: CheckpointScopeArgs): Record<string, string> {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:277:  if (scope.tenantId !== undefined) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:278:    details.tenantId = scope.tenantId;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:280:  if (scope.userId !== undefined) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:281:    details.userId = scope.userId;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:283:  if (scope.agentId !== undefined) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:284:    details.agentId = scope.agentId;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:286:  if (scope.sharedSpaceId !== undefined) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:287:    details.sharedSpaceId = scope.sharedSpaceId;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:297:    error: 'tenantId is required when userId, agentId, or sharedSpaceId is provided.',
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:300:      reason: 'checkpoint_scope_tenant_required',
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:303:      hint: 'Retry with tenantId included for governed checkpoint access.',
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:320:  const scope = validateCheckpointScope(args);
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:321:  if (requiresCheckpointTenant(scope)) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:336:    metadata: mergeCheckpointScopeMetadata(metadata, scope),
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:337:    scope,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:381:  const scope = validateCheckpointScope(args);
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:382:  if (requiresCheckpointTenant(scope)) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:394:  const results = checkpoints.listCheckpoints(spec_folder ?? null, limit, scope);
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:395:  const filteredResults = hasCheckpointScope(scope)
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:396:    ? results.filter((checkpoint) => checkpointMatchesScope(checkpoint.metadata, scope))
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:444:  const scope = validateCheckpointScope(args);
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:445:  if (requiresCheckpointTenant(scope)) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:453:  if (hasCheckpointScope(scope)) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:454:    const checkpoint = checkpoints.getCheckpoint(name, scope);
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:455:    if (checkpoint && !checkpointMatchesScope(checkpoint.metadata, scope)) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:458:        error: `Checkpoint "${name}" scope mismatch`,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:462:          scope: checkpointScopeDetails(scope),
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:465:          hint: 'Retry with matching scope values or omit optional scope parameters if you intend to access an unscoped checkpoint.',
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:466:          actions: ['Use checkpoint_list() with the same scope parameters to discover accessible checkpoints'],
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:473:  const result = checkpoints.restoreCheckpoint(name, clear_existing, scope);
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:537:          'Retry with a narrower scope or clearExisting=true if you intend to replace current state',
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:587:  const scope = validateCheckpointScope(args);
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:588:  if (requiresCheckpointTenant(scope)) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:602:  if (hasCheckpointScope(scope)) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:603:    const checkpoint = checkpoints.getCheckpoint(name, scope);
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:604:    if (checkpoint && !checkpointMatchesScope(checkpoint.metadata, scope)) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:607:        error: `Checkpoint "${name}" scope mismatch`,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:611:          scope: checkpointScopeDetails(scope),
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:614:          hint: 'Retry with matching scope values or omit optional scope parameters if you intend to access an unscoped checkpoint.',
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:615:          actions: ['Use checkpoint_list() with the same scope parameters to discover accessible checkpoints'],
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:622:  const success: boolean = checkpoints.deleteCheckpoint(name, scope);
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:661:    sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:688:      actor: sessionId ?? 'memory_validate',
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:741:      sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:80:  // Safety: refuse to bulk-delete constitutional or critical tiers without explicit specFolder scope
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:82:    throw new Error(`Bulk delete of "${tier}" tier requires specFolder scope for safety. Use memory_delete for individual deletions.`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:15:  sessionId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:66:const sessionId = `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:147:    sessionId,
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:43:function handleCompact(sessionId: string): OutputSection[] {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:44:  const state = loadState(sessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:45:  const pendingCompactPrime = readCompactPrime(sessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:47:    hookLog('warn', 'session-prime', `No cached compact payload for session ${sessionId}`);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:58:    hookLog('warn', 'session-prime', `Rejecting stale compact cache for session ${sessionId} (cached at ${cachedAt})`);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:115:  const sessionId = typeof input.session_id === 'string' ? input.session_id : undefined;
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:120:    claudeSessionId: sessionId,
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:177:function handleResume(sessionId: string): OutputSection[] {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:178:  const state = loadState(sessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:216:  const sessionId = input.session_id ?? 'unknown';
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:218:  hookLog('info', 'session-prime', `SessionStart triggered (source: ${source}, session: ${sessionId})`);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:225:      sections = handleCompact(sessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:233:      sections = handleResume(sessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:262:    clearCompactPrime(sessionId);
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:64:function findSimilarMemories(embedding: Float32Array | null, options: { limit?: number; specFolder?: string | null; tenantId?: string | null; userId?: string | null; agentId?: string | null; sessionId?: string | null; sharedSpaceId?: string | null } = {}): SimilarMemory[] {
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:65:  const { limit = 5, specFolder = null, tenantId = null, userId = null, agentId = null, sessionId = null, sharedSpaceId = null } = options;
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:79:    const scopedMatches: SimilarMemory[] = [];
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:84:    while (scopedMatches.length < limit) {
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:98:        if (!matchesScopedValue(tenantId, r.tenant_id)) continue;
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:99:        if (!matchesScopedValue(userId, r.user_id)) continue;
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:100:        if (!matchesScopedValue(agentId, r.agent_id)) continue;
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:101:        // H9 FIX: Filter by sessionId to prevent false duplicate/supersede decisions across sessions
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:102:        if (!matchesScopedValue(sessionId, r.session_id)) continue;
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:103:        if (!matchesScopedValue(sharedSpaceId, r.shared_space_id)) continue;
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:107:        scopedMatches.push({
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:120:        if (scopedMatches.length >= limit) {
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:134:    return scopedMatches.slice(0, limit);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:60:function runContextAutosave(sessionId: string): void {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:61:  const state = loadState(sessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:78:    observations: [`Auto-saved from Claude Stop hook for session ${sessionId}.`],
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:120:  sessionId: string,
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:124:  updateState(sessionId, patch);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:125:  touchedPaths.add(getStatePath(sessionId));
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:177:  sessionId: string,
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:181:  const state = loadState(sessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:184:  updateState(sessionId, {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:240:  const sessionId = input.session_id ?? 'unknown';
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:241:  hookLog('info', 'session-stop', `Stop hook fired for session ${sessionId}`);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:244:  const stateBeforeStop = loadState(sessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:257:        storeTokenSnapshot(sessionId, usage, cost);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:261:        recordStateUpdate(sessionId, {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:283:      recordStateUpdate(sessionId, { lastSpecFolder: detectedSpec }, touchedPaths);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:288:      recordStateUpdate(sessionId, { lastSpecFolder: detectedSpec }, touchedPaths);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:302:    recordStateUpdate(sessionId, {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:309:    runContextAutosave(sessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:312:  hookLog('info', 'session-stop', `Session ${sessionId} stop processing complete`);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/claude-transcript.ts:66:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/claude-transcript.ts:128:    claudeSessionId: typeof parsed.sessionId === 'string' ? parsed.sessionId : null,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:346:    // T72 SECURITY: Spec-folder scope MUST fail closed — any error in scope
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:347:    // resolution returns [] rather than leaking unscoped BM25 candidates.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:351:        const error = new Error('Database unavailable for spec-folder scope lookup');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:352:        console.warn('[BM25] Spec-folder scope lookup failed, returning empty scoped results:', error);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:370:        console.warn('[BM25] Spec-folder scope lookup failed, returning empty scoped results:', error);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:376:      // Fail closed rather than falling through to unscoped results.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:378:        const error = new Error('specFolderMap unexpectedly null after scope resolution');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:379:        console.warn('[BM25] Spec-folder scope lookup failed, returning empty scoped results:', error);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1384:  // C138/T316: MMR reranking with request-scoped embedding cache.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1902:  const scopeParts = memoryIdx >= 0 ? parts.slice(0, memoryIdx) : parts.slice(0, -1);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1903:  const tailParts = scopeParts.slice(-2);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:378:  const sessionId = input.session_id ?? 'unknown';
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:379:  hookLog('info', 'compact-inject', `PreCompact triggered for session ${sessionId} (trigger: ${input.trigger ?? 'unknown'})`);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:393:    updateState(sessionId, {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:408:    hookLog('info', 'compact-inject', `Cached compact context (${payload.length} chars) for session ${sessionId}`);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:416:  updateState(sessionId, {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:424:  hookLog('info', 'compact-inject', `Cached compact context (${payload.length} chars) for session ${sessionId}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:41:// C2 FIX: Import DB access for scope filtering
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:95:  sessionId: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:111:  // C2 FIX: Scope fields to prevent cross-scope trigger leaks
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:112:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:113:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:114:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:207:  // T73 SECURITY: Validate caller-supplied sessionId through server-side session
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:210:  let sessionId: string | undefined = rawSessionId;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:213:      tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:214:      userId: args.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:215:      agentId: args.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:218:      console.warn(`[memory_match_triggers] SECURITY: Rejected untrusted sessionId "${rawSessionId}" — ${trustedSession.error}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:229:    sessionId = trustedSession.effectiveSessionId;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:274:    sessionId &&
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:281:      decayStats = { decayedCount: workingMemory.batchUpdateScores(sessionId as string) };
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:291:  // C2 FIX: Post-filter by scope to prevent cross-tenant trigger leaks
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:292:  const { specFolder, tenantId, userId, agentId, sharedSpaceId } = args;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:293:  if (specFolder || tenantId || userId || agentId || sharedSpaceId) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:299:        const scopeRows = database.prepare(`
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:300:          SELECT id, spec_folder, tenant_id, user_id, agent_id, shared_space_id
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:308:          shared_space_id?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:310:        const scopeMap = new Map(scopeRows.map(r => [r.id, r]));
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:312:          const row = scopeMap.get(match.memoryId);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:314:          // H2 FIX: Require exact scope match — rows with NULL scope are excluded
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:315:          // when the caller specifies a scope, not silently passed through.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:317:          if (tenantId && row.tenant_id !== tenantId) return false;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:318:          if (userId && row.user_id !== userId) return false;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:319:          if (agentId && row.agent_id !== agentId) return false;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:320:          if (sharedSpaceId && row.shared_space_id !== sharedSpaceId) return false;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:324:    } catch (scopeErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:325:      console.error('[memory_match_triggers] Scope filtering failed, returning empty results (fail-closed):', toErrorMessage(scopeErr));
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:343:          sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:370:        workingMemory.setAttentionScore(sessionId as string, match.memoryId, 1.0);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:398:    const sessionMemories: WorkingMemoryEntry[] = workingMemory.getSessionMemories(sessionId as string)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:469:      sessionId: sessionId!,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:499:  if (!useCognitive && sessionId) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:540:        session_id: sessionId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:67:- `shared-memory.ts` exports `resolveAdminActor()` and `validateCallerAuth()` so shared-space mutations enforce explicit actor identity, tenant scope, and configured admin ownership.
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:316:    it('T031-BM25-07: bm25_search() fails closed when scoped lookup throws', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:331:                throw new Error('scope lookup failed');
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:357:        '[BM25] Spec-folder scope lookup failed, returning empty scoped results:',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:54:} from '../lib/governance/scope-governance.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:56:  assertSharedSpaceAccess,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:609:    scope?: MemoryScopeMatch;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:619:    scope = {},
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:707:      scope,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:721:      scope,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:751:              tenantId: scope.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:752:              userId: scope.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:753:              agentId: scope.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:754:              sessionId: scope.sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:755:              sharedSpaceId: scope.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:800:    }, scope);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:809:      database, parsed, embedding, force, validation.warnings, embeddingStatus, filePath, scope,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:827:      scope,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:922:    }, scope);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:934:        scope,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:954:            scope,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1050:    scope = {} as MemoryScopeMatch,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1071:    scope,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1106:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1107:    userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1108:    agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1109:    sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1113:    governedAt,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1137:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1138:    userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1139:    agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1140:    sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1144:    governedAt,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1153:      tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1154:      userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1155:      agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1156:      sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1165:    const access = assertSharedSpaceAccess(database, {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1166:      tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1167:      userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1168:      agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1169:      sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1174:        action: 'memory_save_shared_space',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1176:        tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1177:        userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1178:        agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1179:        sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1181:        reason: access.reason ?? 'shared_space_denied',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1183:      throw new Error(`Shared-memory save denied: ${access.reason ?? 'shared_space_denied'}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1266:    tenantId: governanceDecision.normalized.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1267:    userId: governanceDecision.normalized.userId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1268:    agentId: governanceDecision.normalized.agentId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1269:    sessionId: governanceDecision.normalized.sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1285:        tenantId: saveScope.tenantId ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1286:        userId: saveScope.userId ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1287:        agentId: saveScope.agentId ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1436:      scope: saveScope,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1465:        tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1466:        userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1467:        agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1468:        sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1470:        reason: sharedSpaceId ? 'shared_space_save' : 'governed_ingest',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1478:          WHERE shared_space_id = ?
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:68:export function getStatePath(sessionId: string): string {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:69:  const safe = createHash('sha256').update(sessionId).digest('hex').slice(0, 16);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:83:export function loadState(sessionId: string): HookState | null {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:85:    const raw = readFileSync(getStatePath(sessionId), 'utf-8');
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:92:function matchesScope(state: HookState, scope: HookStateScope): boolean {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:93:  if (scope.specFolder && state.lastSpecFolder !== scope.specFolder) {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:97:  if (scope.claudeSessionId && state.claudeSessionId !== scope.claudeSessionId) {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:107: * older than maxAgeMs, or when the caller cannot prove scope.
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:112:    scope?: HookStateScope;
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:116:  const scope = options.scope;
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:117:  const hasScope = Boolean(scope?.specFolder || scope?.claudeSessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:125:        reason: 'scope_unknown_fail_closed',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:149:      if (!matchesScope(state, scope!)) {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:170:export function saveState(sessionId: string, state: HookState): boolean {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:171:  const filePath = getStatePath(sessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:185:export function readCompactPrime(sessionId: string): HookState['pendingCompactPrime'] {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:186:  const state = loadState(sessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:191:export function clearCompactPrime(sessionId: string): void {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:192:  const state = loadState(sessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:202:  if (!saveState(sessionId, nextState)) {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:203:    hookLog('warn', 'state', `Failed to clear pending compact payload for session ${sessionId}`);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:212:export function readAndClearCompactPrime(sessionId: string): HookState['pendingCompactPrime'] {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:213:  const prime = readCompactPrime(sessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:215:    clearCompactPrime(sessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:221:export function updateState(sessionId: string, patch: Partial<HookState>): HookState {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:222:  const existing = loadState(sessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:225:    claudeSessionId: sessionId,
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:237:  if (!saveState(sessionId, state)) {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:238:    hookLog('warn', 'state', `State update was not persisted for session ${sessionId}`);
.opencode/skill/system-spec-kit/mcp_server/cli.ts:112:    [--folder <spec-folder>]       Optional: scope to a spec folder
.opencode/skill/system-spec-kit/mcp_server/cli.ts:270:  // Safety: refuse constitutional/critical without folder scope
.opencode/skill/system-spec-kit/mcp_server/cli.ts:272:    console.error(`ERROR: Bulk delete of "${tier}" tier requires --folder scope for safety.`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:68:          // Enforce optional specFolder scope before including a candidate file.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:65:import { normalizeScopeContext } from '../lib/governance/scope-governance.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:181:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:182:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:183:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:194:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:324:function buildSessionStatePayload(sessionId: string): Record<string, unknown> {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:325:  const session = retrievalSessionStateManager.getOrCreate(sessionId);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:450:function applySessionDedup(results: MemorySearchRow[], sessionId: string, enableDedup: boolean): DedupResult {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:451:  if (!enableDedup || !sessionId || !sessionManager.isEnabled()) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:454:      dedupStats: { enabled: false, sessionId: null }
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:458:  const { filtered, dedupStats } = sessionManager.filterSearchResults(sessionId, results as Parameters<typeof sessionManager.filterSearchResults>[1]);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:461:    sessionManager.markResultsSent(sessionId, filtered as Parameters<typeof sessionManager.markResultsSent>[1]);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:468:      sessionId
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:498:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:499:    userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:500:    agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:511:    sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:533:  const normalizedScope = normalizeScopeContext({ tenantId, userId, agentId, sessionId, sharedSpaceId });
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:535:    tenantId: normalizedScope.tenantId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:536:    userId: normalizedScope.userId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:537:    agentId: normalizedScope.agentId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:538:    sessionId: normalizedScope.sessionId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:542:  // Validate at least one search input is provided (moved from schema superRefine for GPT compatibility)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:551:    const resolved = resolveCursor(cursor.trim(), undefined, { scopeKey: progressiveScopeKey });
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:555:        error: 'Cursor is invalid, expired, or out of scope',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:714:    sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:724:    tenantId: normalizedScope.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:725:    userId: normalizedScope.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:726:    agentId: normalizedScope.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:744:    sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:781:      tenantId: normalizedScope.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:782:      userId: normalizedScope.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:783:      agentId: normalizedScope.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:797:      sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:886:    if (sessionId && isSessionRetrievalStateEnabled()) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:889:        retrievalSessionStateManager.updateGoal(sessionId, activeGoal);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:892:        retrievalSessionStateManager.setAnchors(sessionId, anchors);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:895:      const goalRefinement = refineForGoal(resultsForFormatting, sessionId);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1033:          { scopeKey: progressiveScopeKey },
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1054:  if (sessionId && isSessionRetrievalStateEnabled() && !sessionManager.isEnabled()) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1062:      const deduped = deduplicateWithSessionState(existingResults, sessionId);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1072:  if (sessionId && enableDedup && sessionManager.isEnabled()) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1103:        sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1121:        sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1146:  if (sessionId && isSessionRetrievalStateEnabled()) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1159:        retrievalSessionStateManager.markSeen(sessionId, returnedIds);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1162:      data.sessionState = buildSessionStatePayload(sessionId);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1208:        session_id: sessionId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1275:            sessionId: sessionId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1314:          trackQueryAndDetect(db, sessionId ?? null, normalizedQuery, queryId, shownIds);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1319:          logResultCited(db, sessionId ?? null, queryId, shownIds);
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:128:  const sessionId = input.session_id ?? 'unknown';
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:129:  hookLog('info', 'gemini:compact-cache', `PreCompress triggered for session ${sessionId} (trigger: ${input.trigger ?? 'unknown'})`);
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:158:  updateState(sessionId, {
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:184:  hookLog('info', 'gemini:compact-cache', `Cached compact context (${payload.length} chars) for session ${sessionId}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:30:  sessionId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:41:  sessionId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:46:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:68:  sessionId: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:309:    sessionId: session_id = null
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:378:            sessionId: normalizedSessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:428:          sessionId: normalizedSessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:441:          ? `Call task_postflight with taskId: "${taskId}", sessionId: "${normalizedSessionId}" after completing the task`
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:467:    sessionId: session_id = null,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:518:      `Multiple open preflight records found for spec_folder="${spec_folder}" and task_id="${taskId}". Provide sessionId to disambiguate postflight.`,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:526:      `Multiple completed learning cycles found for spec_folder="${spec_folder}" and task_id="${taskId}". Provide sessionId to update the intended record.`,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:539:      { specFolder: spec_folder, taskId: taskId, sessionId: normalizedSessionId }
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:560:    interpretation = 'Knowledge regression detected - may indicate scope expansion or new complexities discovered';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:615:          sessionId: (preflightRecord.session_id as string | null) ?? normalizedSessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:663:    sessionId: session_id,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:719:        sessionId: (row.session_id as string | null) ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:33:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:58:      sessionId: args.sessionId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:391: * @param specFolder - Optional spec folder scope.
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:100:  scope: MemoryScopeMatch = {},
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:102:  const tenantId = normalizeScopeMatchValue(scope.tenantId);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:103:  const userId = normalizeScopeMatchValue(scope.userId);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:104:  const agentId = normalizeScopeMatchValue(scope.agentId);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:105:  const sessionId = normalizeScopeMatchValue(scope.sessionId);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:106:  const sharedSpaceId = normalizeScopeMatchValue(scope.sharedSpaceId);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:118:      AND ((? IS NULL AND shared_space_id IS NULL) OR shared_space_id = ?)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:125:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:126:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:127:    userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:128:    userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:129:    agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:130:    agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:131:    sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:132:    sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:149:  scope: MemoryScopeMatch = {},
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:174:      scope,
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:44:function handleCompact(sessionId: string): OutputSection[] {
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:45:  const state = loadState(sessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:46:  const pendingCompactPrime = readCompactPrime(sessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:48:    hookLog('warn', 'gemini:session-prime', `No cached compact payload for session ${sessionId}`);
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:143:function handleResume(sessionId: string): OutputSection[] {
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:144:  const state = loadState(sessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:176:  const sessionId = input.session_id ?? 'unknown';
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:178:  hookLog('info', 'gemini:session-prime', `SessionStart triggered (source: ${source}, session: ${sessionId})`);
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:187:      sections = handleCompact(sessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:195:      sections = handleResume(sessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:214:    clearCompactPrime(sessionId);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:19:  ['tenant_id', 'tenantId'],
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:20:  ['user_id', 'userId'],
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:21:  ['agent_id', 'agentId'],
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:22:  ['session_id', 'sessionId'],
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:23:  ['shared_space_id', 'sharedSpaceId'],
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:52:function buildScopedWhereClauses(scope: MemoryScopeMatch): {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:57:    tenantId: normalizeScopeMatchValue(scope.tenantId),
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:58:    userId: normalizeScopeMatchValue(scope.userId),
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:59:    agentId: normalizeScopeMatchValue(scope.agentId),
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:60:    sessionId: normalizeScopeMatchValue(scope.sessionId),
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:61:    sharedSpaceId: normalizeScopeMatchValue(scope.sharedSpaceId),
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:84:  scopeClauses: string[],
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:85:  scopeParams: string[],
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:91:    ...scopeClauses,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:103:    ...scopeParams,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:189:  scope: MemoryScopeMatch = {},
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:191:  const { clauses: scopeClauses, params: scopeParams } = buildScopedWhereClauses(scope);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:198:      scopeClauses,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:199:      scopeParams,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:210:        scopeClauses,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:211:        scopeParams,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:251:  scope: MemoryScopeMatch = {},
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:254:    const { clauses: scopeClauses, params: scopeParams } = buildScopedWhereClauses(scope);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:260:      ...scopeClauses,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:266:      ...scopeParams,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:60:    'idx_save_parent_content_hash_scope',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:121:  CREATE INDEX IF NOT EXISTS idx_save_parent_content_hash_scope
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:130:    shared_space_id,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1417:    { name: 'shared_space_id', sql: 'ALTER TABLE memory_index ADD COLUMN shared_space_id TEXT' },
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1420:    { name: 'governed_at', sql: 'ALTER TABLE memory_index ADD COLUMN governed_at TEXT' },
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1450:      shared_space_id TEXT,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1460:    CREATE INDEX IF NOT EXISTS idx_governance_audit_scope
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1461:      ON governance_audit(tenant_id, user_id, agent_id, session_id, shared_space_id);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1466:      CREATE INDEX IF NOT EXISTS idx_memory_scope_hierarchy
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1467:        ON memory_index(tenant_id, user_id, agent_id, session_id, shared_space_id);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1478:    CREATE TABLE IF NOT EXISTS shared_spaces (
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1492:    CREATE TABLE IF NOT EXISTS shared_space_members (
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1504:    CREATE TABLE IF NOT EXISTS shared_space_conflicts (
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1518:    CREATE INDEX IF NOT EXISTS idx_shared_spaces_tenant
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1519:      ON shared_spaces(tenant_id, rollout_enabled, kill_switch);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1520:    CREATE INDEX IF NOT EXISTS idx_shared_space_members_subject
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1521:      ON shared_space_members(subject_type, subject_id, role);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1522:    CREATE INDEX IF NOT EXISTS idx_shared_space_conflicts_space
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1523:      ON shared_space_conflicts(space_id, created_at DESC);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2033:      'idx_save_parent_content_hash_scope',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2041:      index: 'idx_content_hash/idx_save_parent_content_hash_scope',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2326:      shared_space_id TEXT,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2332:      governed_at TEXT,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2435:    CREATE INDEX IF NOT EXISTS idx_memories_scope ON memory_index(spec_folder, session_id, context_type);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2436:    CREATE INDEX IF NOT EXISTS idx_memories_governed_scope ON memory_index(tenant_id, user_id, agent_id, session_id, shared_space_id);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2454:    CREATE INDEX IF NOT EXISTS idx_save_parent_content_hash_scope ON memory_index(
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2462:      shared_space_id,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:81:    | 'scope_mismatch'
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:82:    | 'unknown_scope';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:89:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:306:        'unknown_scope',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:307:        'A target spec folder was requested, but the cached summary did not carry a scope anchor.',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:314:        'scope_mismatch',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:315:        `Cached summary scope ${cachedSpecFolder} did not match requested scope ${expectedSpecFolder}.`,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:321:      'unknown_scope',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:322:      'Cached summary scope was unknown, so the consumer failed closed instead of guessing.',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:360:      scope: {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:482:    claudeSessionId: typeof args.sessionId === 'string' ? args.sessionId : undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:781:  specFolder: 'specs/<###-spec-name>',  // Optional: scope to project
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:131:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:132:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:133:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:134:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:138:  governedAt?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:165:  shared_space_id?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:168:  governed_at?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:177:  tenantId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:178:  userId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:179:  agentId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:180:  sessionId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:28:  sessionId: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:79:    if (!args.sessionId || typeof args.sessionId !== 'string') {
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:80:      return errorResponse('sessionId is required and must be a string');
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:112:        sessionId: args.sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:172:              sessionId: args.sessionId,
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-stop.ts:93:  const sessionId = input.session_id ?? 'unknown';
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-stop.ts:94:  hookLog('info', 'gemini:session-stop', `SessionEnd hook fired for session ${sessionId} (reason: ${input.reason ?? 'unknown'})`);
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-stop.ts:100:      updateState(sessionId, { lastSpecFolder: detectedSpec });
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-stop.ts:108:    updateState(sessionId, {
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-stop.ts:114:  hookLog('info', 'gemini:session-stop', `Session ${sessionId} stop processing complete`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:32:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:33:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:34:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:52:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:115:  tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:116:  userId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:117:  agentId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:135:  sessionId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:144:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:145:    userId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:146:    agentId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:164:    sessionId,
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:34:  const sessionId = input.session_id ?? 'unknown';
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:37:  const pendingCompactPrime = readCompactPrime(sessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:57:  const state = loadState(sessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:75:  clearCompactPrime(sessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:77:  hookLog('info', 'gemini:compact-inject', `Injected ${rawOutput.length} chars for session ${sessionId}`);
.opencode/skill/system-spec-kit/mcp_server/shared-spaces/README.md:30:- Shared spaces are tenant-scoped, deny-by-default collaboration containers.
.opencode/skill/system-spec-kit/mcp_server/shared-spaces/README.md:33:- `shared_memory_enable` bootstraps the shared-memory subsystem and generates this README if it is missing.
.opencode/skill/system-spec-kit/mcp_server/shared-spaces/README.md:41:| `shared_memory_enable` | First-run bootstrap and idempotent enablement |
.opencode/skill/system-spec-kit/mcp_server/shared-spaces/README.md:42:| `shared_memory_status` | Caller-scoped rollout and membership view; requires exactly one actor identity |
.opencode/skill/system-spec-kit/mcp_server/shared-spaces/README.md:43:| `shared_space_upsert` | Create or update a shared space; requires caller auth and tenant scope |
.opencode/skill/system-spec-kit/mcp_server/shared-spaces/README.md:44:| `shared_space_membership_set` | Set deny-by-default membership for a user or agent; requires caller auth and tenant scope |
.opencode/skill/system-spec-kit/mcp_server/shared-spaces/README.md:50:`shared_memory_status`, `shared_space_upsert`, and `shared_space_membership_set` rely on actor identity validation in `handlers/shared-memory.ts`. Admin mutations compare the caller against the configured shared-memory admin identity before allowing ownership-sensitive changes.
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:68:  existing_scope?: {
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:69:    tenantId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:70:    userId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:71:    agentId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:103:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:104:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:105:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:124:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:125:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:126:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:200:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:201:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:202:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:211:  shared_space_id?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:425:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:426:    userId,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:427:    agentId,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:453:    tenantId: normalizeScopeValue(tenantId),
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:454:    userId: normalizeScopeValue(userId),
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:455:    agentId: normalizeScopeValue(agentId),
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:459:  const scopeFilters = [
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:460:    ['tenant_id', requestedScope.tenantId],
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:461:    ['user_id', requestedScope.userId],
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:462:    ['agent_id', requestedScope.agentId],
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:463:    ['shared_space_id', requestedScope.sharedSpaceId],
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:471:      shared_space_id?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:477:      tenantId: duplicate.tenant_id ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:478:      userId: duplicate.user_id ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:479:      agentId: duplicate.agent_id ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:480:      sharedSpaceId: duplicate.shared_space_id ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:483:      existingScope.tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:484:      existingScope.userId,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:485:      existingScope.agentId,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:488:    const isDifferentScope = scopeFilters.some(([_, value], index) => {
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:497:      result.existing_scope = undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:503:    result.existing_scope = existingScope;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:522:      for (const [column, value] of scopeFilters) {
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:529:        SELECT id, file_path, content_text, tenant_id, user_id, agent_id, shared_space_id
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:541:        shared_space_id?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:572:        tenantId: requestedScope.tenantId ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:573:        userId: requestedScope.userId ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:574:        agentId: requestedScope.agentId ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:586:          shared_space_id?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:759:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:760:    userId,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:761:    agentId,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:853:      { content, spec_folder, database, find_similar, embedding, tenantId, userId, agentId, sharedSpaceId },
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:598:  it('rebuilds auto rows in scope and preserves manual rows', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:624:    const scopedRows = db.prepare(`
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:630:    expect(scopedRows.some((row) => row.entity_text === 'Curated Alias' && row.created_by === 'manual')).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:631:    expect(scopedRows.some((row) => row.entity_text === 'Node.js. With Next.js Adapter')).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:632:    expect(scopedRows.some((row) => row.entity_text === 'Node.js' && row.created_by === 'auto')).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:633:    expect(scopedRows.some((row) => row.entity_text === 'Next.js Adapter' && row.created_by === 'auto')).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:171:  scope?: { tenantId?: string | null; userId?: string | null; agentId?: string | null; sessionId?: string | null; sharedSpaceId?: string | null },
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:203:                limit: (opts.limit ?? 3) * 3, // Over-fetch for post-scope-filter
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:208:              // Post-filter by governance scope to prevent cross-tenant reconsolidation
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:209:              const scopeFiltered = results.filter((r: Record<string, unknown>) => {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:210:                if (scope?.tenantId && r.tenant_id && r.tenant_id !== scope.tenantId) return false;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:211:                if (scope?.userId && r.user_id && r.user_id !== scope.userId) return false;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:212:                if (scope?.agentId && r.agent_id && r.agent_id !== scope.agentId) return false;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:213:                if (scope?.sharedSpaceId && r.shared_space_id && r.shared_space_id !== scope.sharedSpaceId) return false;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:216:              return scopeFiltered.map((r: Record<string, unknown>) => ({
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:23:  sessionId: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:36:function isEnabled(_sessionId?: string | null): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:44:function normalizeSessionId(sessionId: string | null | undefined): string | null {
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:45:  if (typeof sessionId !== 'string') return null;
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:46:  const trimmed = sessionId.trim();
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:81:function getAttentionBoost(sessionId: string | null | undefined, memoryIds: number[]): Map<number, number> {
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:83:  if (!isEnabled(sessionId) || !db) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:87:  const normalizedSessionId = normalizeSessionId(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:139:  sessionId: string | null | undefined
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:141:  const normalizedSessionId = normalizeSessionId(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:145:    sessionId: normalizedSessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:35:  scope?: { tenantId?: string | null; userId?: string | null; agentId?: string | null; sessionId?: string | null; sharedSpaceId?: string | null },
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:45:      tenantId: scope?.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:46:      userId: scope?.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:47:      agentId: scope?.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:48:      sessionId: scope?.sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:49:      sharedSpaceId: scope?.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:61:// Feature catalog: Dual-scope memory auto-surface
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:79:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:80:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:81:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:84:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:116:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:117:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:118:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:121:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:704:    tenantId: options.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:705:    userId: options.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:706:    agentId: options.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:709:    session_id: options.sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:725:    tenantId: options.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:726:    userId: options.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:727:    agentId: options.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:734:    sessionId: options.sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:756:    tenantId: options.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:757:    userId: options.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:758:    agentId: options.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:765:    sessionId: options.sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:790:    tenantId: options.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:791:    userId: options.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:792:    agentId: options.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:799:    sessionId: options.sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:827:  // Security: session scope derived from server context, not caller input
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:828:  const trustedSession = sessionManager.resolveTrustedSession(args.sessionId ?? null, {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:829:    tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:830:    userId: args.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:831:    agentId: args.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1234:      details: { requestId, layer: 'L1:Orchestration', requestedSessionId: args.sessionId ?? null },
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1236:        hint: 'Retry without sessionId to let the server mint a trusted session, then reuse the returned effectiveSessionId.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1281:    tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1282:    userId: args.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1283:    agentId: args.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1286:    sessionId: effectiveSessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1354:    tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1355:    userId: args.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1356:    agentId: args.agentId,
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:72:    sessionId: 'sess-abc123',
.opencode/skill/system-spec-kit/mcp_server/lib/utils/logger.ts:64:/** A logger instance scoped to a specific module prefix. */
.opencode/skill/system-spec-kit/mcp_server/lib/utils/logger.ts:73: * Create a logger scoped to a module name.
.opencode/skill/system-spec-kit/mcp_server/lib/utils/logger.ts:82: *   logger.warn('Cleanup failed', { sessionId: 'abc', elapsed: 42 });
.opencode/skill/system-spec-kit/mcp_server/lib/utils/logger.ts:83: *   // stderr: 'WARN  [session-manager] Cleanup failed {"sessionId":"abc","elapsed":42}'
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:66:    'DELETE FROM shared_space_conflicts WHERE existing_memory_id = ? OR incoming_memory_id = ?',
.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:366:        metadata: { applied: false, enabled: true, sessionId: 'test-001', boostedCount: 0, maxBoostApplied: 0 },
.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:376:    input.config.sessionId = 'test-001';
.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:408:    input.config.sessionId = 'test-001';
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:310:  it('runtime accepts governed scope fields for memory_search', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:314:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:315:        userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:316:        agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:335:describe('governed retrieval schema propagation', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:336:  it('public and runtime schemas accept governed scope fields for memory_context', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:339:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:340:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:341:      agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:363:  it('public and runtime schemas accept governed scope fields for memory_quick_search', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:366:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:367:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:368:      agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:378:  it('public and runtime schemas accept governed scope fields for memory_match_triggers', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:382:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:383:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:384:      agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:396:  it('public schemas expose actor identity fields without top-level exclusivity combinators', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:397:    for (const toolName of ['shared_space_upsert', 'shared_space_membership_set', 'shared_memory_status']) {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:409:  it('runtime accepts exactly one actor identity for shared_space_upsert', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:411:      validateToolArgs('shared_space_upsert', {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:413:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:420:  it('handler auth rejects shared_space_upsert when actor identity is omitted', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:425:        tool: 'shared_space_upsert',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:430:  it('handler auth rejects shared_space_membership_set when both actor identities are provided', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:435:        tool: 'shared_space_membership_set',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:439:    }).toThrow(/Provide only one actor identity/);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:442:  it('handler requires caller identity for shared_memory_status', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:444:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:454:  it('runtime accepts shared_memory_status with one actor identity', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:456:      validateToolArgs('shared_memory_status', {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:457:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:397: * deleting only `created_by='auto'` entries in scope, re-extracting from the
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:10:  filterRowsByScope,
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:11:} from '../lib/governance/scope-governance';
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:29:      shared_space_id TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:52:  it('isolates scoped retrieval to a single tenant and actor', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:74:    const filtered = filterRowsByScope(rows, {
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:75:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:76:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:87:  it('prevents cross-actor leakage when scope enforcement is enabled', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:105:    expect(filterRowsByScope(rows, {
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:106:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:107:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:109:    expect(filterRowsByScope(rows, {
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:110:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:111:      agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:164:        meta?: { sessionLifecycle?: { effectiveSessionId?: string }; sessionId?: string };
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:165:        data?: { sessionId?: string };
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:171:      const fromMeta = parsed?.meta?.sessionId;
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:175:      const fromData = parsed?.data?.sessionId;
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:265:  const sessionId = resolveSessionId(result);
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:267:    sessionId,
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:88:        sessionId: 'sess-123',
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:141:        sessionId: 'sess-456',
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:155:      expect(sel.context.sessionId).toBe('sess-456');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:4:vi.mock('../lib/governance/scope-governance', async (importOriginal) => {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:5:  const actual = await importOriginal<typeof import('../lib/governance/scope-governance')>();
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:12:import * as scopeGovernance from '../lib/governance/scope-governance';
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:14:  assertSharedSpaceAccess,
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:16:  getAllowedSharedSpaceIds,
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:39:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:44:    const denied = assertSharedSpaceAccess(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:45:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:46:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:57:    const allowed = assertSharedSpaceAccess(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:58:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:59:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:62:    expect(Array.from(getAllowedSharedSpaceIds(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:63:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:64:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:74:      tenantId: 'tenant-A',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:85:    expect(getAllowedSharedSpaceIds(db, { userId: 'user-1' })).toEqual(new Set());
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:94:      tenantId: 'tenant-A',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:105:    expect(getAllowedSharedSpaceIds(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:106:      tenantId: 'tenant-A',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:107:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:117:      tenantId: 'tenant-A',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:128:    expect(getAllowedSharedSpaceIds(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:129:      tenantId: 'tenant-B',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:130:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:138:    expect(assertSharedSpaceAccess(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:139:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:140:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:143:      reason: 'shared_space_id_required',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:152:      action: 'shared_space_access',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:154:      reason: 'shared_space_id_required',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:164:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:181:    expect(assertSharedSpaceAccess(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:182:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:183:      userId: 'user-editor',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:186:      reason: 'shared_space_owner_required',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:189:    expect(assertSharedSpaceAccess(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:190:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:191:      userId: 'user-owner',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:203:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:220:    expect(assertSharedSpaceAccess(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:221:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:222:      userId: 'user-mixed',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:223:      agentId: 'agent-mixed',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:227:    expect(Array.from(getAllowedSharedSpaceIds(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:228:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:229:      userId: 'user-mixed',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:230:      agentId: 'agent-mixed',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:240:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:251:    expect(assertSharedSpaceAccess(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:252:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:253:      userId: 'user-viewer',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:256:      reason: 'shared_space_membership_required',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:259:    expect(assertSharedSpaceAccess(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:260:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:261:      userId: 'user-owner',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:267:      SELECT decision, reason, tenant_id, user_id, shared_space_id
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:269:      WHERE action = 'shared_space_access'
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:274:        reason: 'shared_space_membership_required',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:277:        shared_space_id: 'space-audit',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:284:        shared_space_id: 'space-audit',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:294:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:301:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:307:      FROM shared_spaces
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:322:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:333:    vi.mocked(scopeGovernance.recordGovernanceAudit)
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:341:    expect(assertSharedSpaceAccess(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:342:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:343:      userId: 'user-owner',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:348:    expect(assertSharedSpaceAccess(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:349:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:350:      userId: 'user-viewer',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:353:      reason: 'shared_space_membership_required',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:357:    expect(consoleErrorSpy.mock.calls[0]?.[0]).toContain('Failed to record shared_space_access audit');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:366:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:377:    const beforeKillSwitch = assertSharedSpaceAccess(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:378:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:379:      userId: 'user-2',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:385:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:391:    const afterKillSwitch = assertSharedSpaceAccess(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:392:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:393:      userId: 'user-2',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:397:      reason: 'shared_space_kill_switch',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:399:    expect(Array.from(getAllowedSharedSpaceIds(db, { userId: 'user-2' }))).toEqual([]);
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:408:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:420:    expect(assertSharedSpaceAccess(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:421:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:422:      agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:425:      reason: 'shared_space_rollout_disabled',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:427:    expect(Array.from(getAllowedSharedSpaceIds(db, { agentId: 'agent-1' }))).toEqual([]);
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:435:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:437:    })).toThrow('E_VALIDATION: spaceId and tenantId must be non-empty strings');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:453:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:459:      tenantId: 'tenant-b',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:476:    expect(Array.from(getAllowedSharedSpaceIds(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:477:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:478:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:481:    expect(assertSharedSpaceAccess(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:482:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:483:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:486:      reason: 'shared_space_tenant_mismatch',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:496:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:512:      FROM shared_space_conflicts
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:524:      SELECT action, decision, memory_id, logical_key, shared_space_id, reason
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:533:      shared_space_id: 'space-4',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:544:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:574:      FROM shared_space_conflicts
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:608:      WHERE shared_space_id = ?
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:644:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:651:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:658:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:665:      tenantId: 'tenant-b',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:720:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:753:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:766:      INSERT INTO shared_space_conflicts (
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:779:      INSERT INTO shared_space_conflicts (
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:835:      .get('shared_memory_enabled') as { count: number };
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:50:  scopeKey?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:81:  scopeKey?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:334:    scopeKey: typeof options?.scopeKey === 'string' && options.scopeKey.length > 0
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:335:      ? options.scopeKey
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:368:    typeof payload.scopeKey === 'string'
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:369:    && payload.scopeKey.length > 0
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:370:    && payload.scopeKey !== options?.scopeKey
.opencode/skill/system-spec-kit/mcp_server/tests/pe-gating.vitest.ts:16:    shared_space_id: string | null;
.opencode/skill/system-spec-kit/mcp_server/tests/pe-gating.vitest.ts:28:    shared_space_id: null,
.opencode/skill/system-spec-kit/mcp_server/tests/pe-gating.vitest.ts:33:describe('PE gating scoped similar-memory search', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/pe-gating.vitest.ts:38:  it('expands the vector window until an in-scope match is found', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/pe-gating.vitest.ts:58:            content_text: 'in-scope memory',
.opencode/skill/system-spec-kit/mcp_server/tests/pe-gating.vitest.ts:59:            file_path: '/specs/026-memory-database-refinement/in-scope.md',
.opencode/skill/system-spec-kit/mcp_server/tests/pe-gating.vitest.ts:68:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/pe-gating.vitest.ts:76:        content: 'in-scope memory',
.opencode/skill/system-spec-kit/mcp_server/tests/pe-gating.vitest.ts:77:        file_path: '/specs/026-memory-database-refinement/in-scope.md',
.opencode/skill/system-spec-kit/mcp_server/tests/pe-gating.vitest.ts:96:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:32:// Initialize a test DB at module scope so skipIf conditions can evaluate correctly.
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:14:  function setScoreDirectly(sessionId: string, memoryId: number, score: number) {
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:18:    `).run(sessionId, memoryId, score);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:21:  function getScoreDirectly(sessionId: string, memoryId: number): number | null {
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:24:    ).get(sessionId, memoryId) as { attention_score: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:28:  function countEntries(sessionId: string): number {
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:31:    ).get(sessionId) as { count: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:79:    const sessionId = 'decay-floor-test';
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:82:      testDb.prepare('DELETE FROM working_memory WHERE session_id = ?').run(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:88:      setScoreDirectly(sessionId, 1, 0.06);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:89:      wm.batchUpdateScores(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:91:      const scoreAfter1 = getScoreDirectly(sessionId, 1);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:100:        wm.batchUpdateScores(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:103:      const scoreAfterMany = getScoreDirectly(sessionId, 1);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:109:      const count = countEntries(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:115:    const sessionId = 'delete-threshold-test';
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:118:      testDb.prepare('DELETE FROM working_memory WHERE session_id = ?').run(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:122:      setScoreDirectly(sessionId, 2, 0.05);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:123:      wm.batchUpdateScores(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:125:      const scoreAtFloor = getScoreDirectly(sessionId, 2);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:130:      setScoreDirectly(sessionId, 3, 0.005);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:131:      wm.batchUpdateScores(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:133:      const scoreClamped = getScoreDirectly(sessionId, 3);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:142:      const deleteSessionId = sessionId + '-delete-test';
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:156:    const sessionId = 'floor-stability-test';
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:159:      testDb.prepare('DELETE FROM working_memory WHERE session_id = ?').run(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:163:      setScoreDirectly(sessionId, 4, 0.15);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:166:        wm.batchUpdateScores(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:169:      const finalScore = getScoreDirectly(sessionId, 4);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:195:    const sessionId = 'mixed-scores-test';
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:198:      testDb.prepare('DELETE FROM working_memory WHERE session_id = ?').run(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:202:      setScoreDirectly(sessionId, 5, 0.8);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:203:      setScoreDirectly(sessionId, 6, 0.05);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:204:      setScoreDirectly(sessionId, 7, 0.005);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:205:      setScoreDirectly(sessionId, 8, 0.03);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:207:      wm.batchUpdateScores(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:209:      const s5 = getScoreDirectly(sessionId, 5);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:215:      const s6 = getScoreDirectly(sessionId, 6);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:220:      const s7 = getScoreDirectly(sessionId, 7);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:228:      const s8 = getScoreDirectly(sessionId, 8);
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-directives.vitest.ts:470:    const content = 'Avoid scope creep when fixing bugs.';
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:282:  it('filters trigger matches by governed scope fields when provided', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:285:        buildTriggerMatch({ memoryId: 11, filePath: '/tmp/scoped.md' }),
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:286:        buildTriggerMatch({ memoryId: 22, filePath: '/tmp/unscoped.md' }),
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:300:            shared_space_id: 'shared-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:308:            shared_space_id: 'shared-2',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:318:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:319:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:320:      agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:330:    expect(results[0]?.filePath).toBe('/tmp/scoped.md');
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:66:    'spec', 'specification', 'requirements', 'scope', 'feature',
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:117:    /what\s+(?:is|was)\s+the\s+(?:scope|plan)/i,
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:166:    'show specification scope and implementation tasks',
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:272:    /(?:find|show|get)\s+(?:me\s+)?(?:the\s+)?(?:spec|specification|requirements|scope|plan|checklist)/i.test(query) ||
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:274:    /what\s+(?:are|is|was|were)\s+the\s+(?:requirements|scope|plan)/i.test(query)
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-setAttentionScore.vitest.ts:18:    it('T209-2: setAttentionScore accepts (sessionId, memoryId, score) without throwing', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-setAttentionScore.vitest.ts:78:      const strictPattern = /workingMemory\.setAttentionScore\(\s*(?:session_id|sessionId)\s*(as\s+string)?\s*,\s*match\.memoryId\s*,\s*[\d.]+\s*\)/;
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-setAttentionScore.vitest.ts:79:      const relaxedPattern = /workingMemory\.setAttentionScore\([^)]*(?:session_id|sessionId)/;
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:439:  it('requires exact scope equality when a governance scope is supplied', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:446:        content_text: 'scoped',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:449:        file_path: 'scoped.md',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:452:        shared_space_id: 'space-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:463:        shared_space_id: 'space-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:474:        shared_space_id: null,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:479:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:480:      userId: 'user-a',
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:48:import { filterRowsByScope, isScopeEnforcementEnabled } from '../../governance/scope-governance.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:49:import { getAllowedSharedSpaceIds } from '../../collab/shared-spaces.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:472:  // Fix #16: Cache embedding at function scope for reuse in constitutional injection
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:484:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:485:    userId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:486:    agentId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:976:  // P0 fix: sessionId is for dedup/state tracking, NOT a governance boundary.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:978:  // passed an ephemeral sessionId, because memories don't have session-scoped access.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:980:    tenantId
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:981:    || userId
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:982:    || agentId
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:986:  const scopeFilter = {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:987:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:988:    userId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:989:    agentId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:997:      allowedSharedSpaceIds = getAllowedSharedSpaceIds(db, scopeFilter);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:998:      candidates = filterRowsByScope(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1000:        scopeFilter,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1004:      candidates = filterRowsByScope(candidates, scopeFilter);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1053:        // to ensure constitutional injection respects global scope enforcement
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1055:          ? filterRowsByScope(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1057:            scopeFilter,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1125:                ? filterRowsByScope(resultSet, scopeFilter, allowedSharedSpaceIds)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1180:        ? filterRowsByScope(rawHydeCandidates, scopeFilter, allowedSharedSpaceIds)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1240:                `SELECT id, title, spec_folder, file_path, importance_tier, importance_weight, quality_score, created_at, is_archived, context_type, tenant_id, user_id, agent_id, session_id, shared_space_id FROM memory_index WHERE id IN (${placeholders})`
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1265:            const scopeFilteredSummaryHits = shouldApplyScopeFiltering
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1266:              ? filterRowsByScope(contextFilteredSummaryHits, scopeFilter, allowedSharedSpaceIds)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1270:            const backfilledSummaryHits = backfillMissingQualityScores(scopeFilteredSummaryHits);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:173:  describe('T012: Session-scoped cache with 60s TTL', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:159:    it('T521-C7: Explicit scope is merged into checkpoint metadata on create', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:162:        name: 'scoped-checkpoint',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:168:          reason: 'scope-test',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:169:          userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:170:          agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:176:          name: 'scoped-checkpoint',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:178:          metadata: { reason: 'scope-test' },
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:179:          tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:180:          userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:181:          agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:185:          name: 'scoped-checkpoint',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:188:            reason: 'scope-test',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:189:            tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:190:            userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:191:            agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:194:          scope: {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:195:            tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:196:            userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:197:            agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:206:    it('T521-C8: Governed checkpoint create requires tenant scope when actor scope is provided', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:209:        userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:216:    it('T521-C9: whitespace-only tenantId is rejected when actor scope is provided', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:219:        tenantId: '   ',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:220:        userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:221:      })).rejects.toThrow(/tenantId must be a non-empty string/i);
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:268:    it('T521-L4: Optional scope filters checkpoint list results by metadata', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:277:          metadata: { userId: 'user-1', sharedSpaceId: 'space-1' },
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:286:          metadata: { userId: 'user-2', sharedSpaceId: 'space-1' },
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:291:          tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:292:          userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:300:          tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:301:          userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:309:    it('T521-L5: Governed checkpoint list requires tenant scope when actor scope is provided', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:310:      const response = await handler.handleCheckpointList({ userId: 'user-1' });
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:405:        name: 'scoped-restore',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:411:        metadata: JSON.stringify({ userId: 'user-2' }),
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:416:          name: 'scoped-restore',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:417:          tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:418:          userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:430:    it('T521-R7: Governed checkpoint restore requires tenant scope when actor scope is provided', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:433:        userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:514:        name: 'scoped-delete',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:525:          name: 'scoped-delete',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:526:          confirmName: 'scoped-delete',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:527:          tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:540:    it('T521-DEL8: Governed checkpoint delete requires tenant scope when actor scope is provided', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:88:  // SUITE: Summary stats respect sessionId filter
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:89:  describe('T503: Summary stats respect sessionId filter', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:90:    it('T503-01: sessionId stats filter — totalTasks=1', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:103:        sessionId: sessA,
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:120:        sessionId: sessB,
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:130:      // Query with sessionId = sessA
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:133:        sessionId: sessA,
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:143:    it('T503-01b: sessionId records filter consistent', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:157:        sessionId: sessA,
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:173:        sessionId: sessB,
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:185:        sessionId: sessA,
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:192:      const allMatch = data.learningHistory.every(row => row.sessionId === sessA);
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:197:    it('T503-01c: sessionId filter normalizes whitespace to match stored records', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:200:      const sessionId = uniqueId('sess-trimmed');
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:209:        sessionId: `  ${sessionId}  `,
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:217:        sessionId: `  ${sessionId}  `,
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:222:        sessionId: `  ${sessionId}  `,
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:228:      expect(data.learningHistory[0].sessionId).toBe(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:292:  // SUITE: Combined sessionId + onlyComplete filters
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:293:  describe('T503: Combined sessionId + onlyComplete filters', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:306:        sessionId: sessC,
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:323:        sessionId: sessC,
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:329:        sessionId: sessC,
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:353:        sessionId: sessC,
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:369:        sessionId: sessC,
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:374:        sessionId: sessC,
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:20:/** Maximum number of entries allowed in each session-scoped cache. */
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:23:/** Session-scoped cache for momentum scores (memoryId -> momentum). */
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:26:/** Session-scoped cache for causal depth scores (memoryId -> normalized depth). */
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:51: * Clear both session-scoped caches. Call at session boundaries or when
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:67: * Cache is scoped per bound DB instance to avoid repeated sqlite_master probes.
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:111:    // Hierarchy-aware fallback/augmentation for spec-scoped retrieval.
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:331: * In-memory degree cache scoped per bound DB instance.
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:89:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:96:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:116:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:123:    expect(envelope.data.details?.reason).toBe('shared_memory_admin_unconfigured');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:131:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:140:    expect(envelope.data.details?.reason).toBe('shared_memory_trusted_binding_required');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:146:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:158:      FROM shared_space_members
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:170:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:180:        && sql.includes('FROM shared_spaces')
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:191:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:203:      FROM shared_space_members
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:209:      FROM shared_spaces
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:221:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:229:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:244:      if (sql.includes('INSERT INTO shared_space_members')) {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:252:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:263:      FROM shared_spaces
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:271:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:277:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:286:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:293:    expect(envelope.data.details?.reason).toBe('shared_space_owner_required');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:299:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:305:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:314:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:326:      FROM shared_space_members
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:336:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:342:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:351:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:360:    expect(envelope.data.details?.reason).toBe('shared_space_owner_required');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:363:  it('rejects omitted actor identity with an authentication error', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:366:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:376:  it('rejects blank or whitespace-only actor identity values', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:386:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:398:  it('rejects ambiguous actor identity', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:401:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:415:      tenantId: 'tenant-b',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:423:    expect(envelope.data.details?.reason).toBe('shared_space_create_admin_required');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:430:    const actor = resolveAdminActor('shared_space_upsert');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:444:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:452:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:461:      FROM shared_spaces
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:471:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:478:      SELECT action, decision, reason, tenant_id, user_id, shared_space_id, metadata
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:480:      WHERE action = 'shared_space_admin'
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:489:      shared_space_id: string;
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:493:    expect(auditRow.action).toBe('shared_space_admin');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:498:    expect(auditRow.shared_space_id).toBe('space-audit-success');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:511:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:518:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:526:      UPDATE shared_space_members
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:531:      INSERT INTO shared_space_members (space_id, subject_type, subject_id, role)
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:537:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:546:    expect(envelope.data.details?.reason).toBe('shared_space_owner_required');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:549:      SELECT action, decision, reason, tenant_id, user_id, shared_space_id, metadata
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:551:      WHERE action = 'shared_space_admin'
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:560:      shared_space_id: string;
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:564:    expect(auditRow.action).toBe('shared_space_admin');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:566:    expect(auditRow.reason).toBe('shared_space_owner_required');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:569:    expect(auditRow.shared_space_id).toBe('space-owner-only');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:584:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:590:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:599:      tenantId: 'tenant-b',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:608:    expect(envelope.data.details?.reason).toBe('shared_space_tenant_mismatch');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:618:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:637:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:647:  it('scopes shared-memory status to the authenticated caller identity', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:650:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:657:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:664:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:672:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:679:    expect(envelope.data.userId).toBe('user-other');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:680:    expect(envelope.data.agentId).toBeNull();
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:711:    expect(envelope.data.details?.reason).toBe('shared_memory_enable_admin_required');
.opencode/skill/system-spec-kit/mcp_server/lib/graph/README.md:52:| Session-scoped caching | Momentum and depth caches prevent redundant DB queries within a single session. Caches clear at 10,000 entries. |
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:590:    it('find_spec keywords include: spec, specification, requirements, scope', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:595:      expect(keywords).toContain('scope');
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:128:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:129:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:130:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:148:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:34:  sessionId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:80:   * @param sessionId - Unique session identifier.
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:83:  getOrCreate(sessionId: string): SessionState {
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:86:    const existing = this.sessions.get(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:99:      sessionId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:108:    this.sessions.set(sessionId, session);
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:115:   * @param sessionId - Session to update.
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:118:  updateGoal(sessionId: string, goal: string | null): void {
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:119:    const session = this.getOrCreate(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:127:   * @param sessionId - Session to update.
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:130:  markSeen(sessionId: string, resultIds: Array<number | string>): void {
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:131:    const session = this.getOrCreate(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:141:   * @param sessionId - Session to update.
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:144:  addQuestion(sessionId: string, question: string): void {
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:145:    const session = this.getOrCreate(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:153:   * @param sessionId - Session to update.
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:156:  setAnchors(sessionId: string, anchors: string[]): void {
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:157:    const session = this.getOrCreate(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:165:   * @param sessionId - Session to remove.
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:167:  clear(sessionId: string): void {
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:168:    this.sessions.delete(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:238: * @param sessionId - Session ID for seen-result lookup.
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:243:  sessionId: string,
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:255:  const session = manager.getOrCreate(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:328: * @param sessionId - Session ID for goal lookup.
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:333:  sessionId: string,
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:345:  const session = manager.getOrCreate(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:9:  filterRowsByScope,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:13:} from '../lib/governance/scope-governance';
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:23:  it('rejects governed ingest when provenance or scope markers are missing', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:28:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:29:      sessionId: 'session-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:33:    expect(decision.issues).toContain('userId or agentId is required for governed ingest');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:34:    expect(decision.issues).toContain('provenanceSource is required for governed ingest');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:37:  it('filters rows to the requested tenant and actor scope', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:39:    const filtered = filterRowsByScope([
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:44:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:45:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:46:      sessionId: 'session-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:52:  it('denies all rows when enforcement is on and scope is empty', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:55:      { tenant_id: 'a', user_id: 'u1', agent_id: null, session_id: null, shared_space_id: null },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:56:      { tenant_id: 'b', user_id: 'u2', agent_id: null, session_id: null, shared_space_id: null },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:59:    const filtered = filterRowsByScope(rows, {});
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:64:  it('honors explicit session scope even when global scope enforcement is disabled', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:65:    const filtered = filterRowsByScope([
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:69:      sessionId: 'session-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:90:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:91:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:92:      sessionId: 'session-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:93:      reason: 'governed_ingest',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:112:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:113:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:114:      sessionId: 'session-123',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:145:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:146:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:147:      sessionId: 'session-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:148:      reason: 'governed_ingest',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:154:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:155:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:156:      sessionId: 'session-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:162:      tenantId: 'tenant-b',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:163:      userId: 'user-9',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:164:      sessionId: 'session-9',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:169:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:183:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:184:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:185:      sessionId: 'session-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:195:  it('blocks unscoped governance audit enumeration unless allowUnscoped=true', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:209:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:210:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:211:      sessionId: 'session-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:212:      reason: 'governed_ingest',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:221:      '[scope-governance] Unscoped governance audit enumeration blocked; explicit filters or allowUnscoped=true required.'
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:224:    const allowed = reviewGovernanceAudit(db, { allowUnscoped: true, limit: 10 });
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:229:  it('reuses cached scope predicates and benchmarks scoped filtering', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:232:      { id: 1, tenant_id: 'tenant-a', user_id: 'user-1', session_id: 'session-1', shared_space_id: 'space-1' },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:233:      { id: 2, tenant_id: 'tenant-a', user_id: 'user-1', session_id: 'session-1', shared_space_id: 'space-2' },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:234:      { id: 3, tenant_id: 'tenant-a', user_id: 'user-2', session_id: 'session-1', shared_space_id: 'space-1' },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:235:      { id: 4, tenant_id: 'tenant-b', user_id: 'user-1', session_id: 'session-1', shared_space_id: 'space-1' },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:240:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:241:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:242:      sessionId: 'session-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:246:    expect(filterRowsByScope(rows, {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:247:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:248:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:249:      sessionId: 'session-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:253:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:254:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:255:      sessionId: 'session-1',
.opencode/skill/system-spec-kit/mcp_server/tests/runtime-detection.vitest.ts:70:    it('treats copilot-cli as disabled_by_scope when no repo hook config exists', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/runtime-detection.vitest.ts:79:      expect(result.hookPolicy).toBe('disabled_by_scope');
.opencode/skill/system-spec-kit/mcp_server/tests/runtime-detection.vitest.ts:95:    it('treats null Gemini hooks blocks as disabled_by_scope', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/runtime-detection.vitest.ts:117:      expect(result.hookPolicy).toBe('disabled_by_scope');
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:467:      'Start a new session with fresh sessionId',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:478:      'Omit sessionId to disable session deduplication'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:486:      'Start fresh with new sessionId',
.opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts:53:      const sessionId = 'ses/sion/../bad';
.opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts:54:      const path = getStatePath(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts:57:      expect(path).toContain(createHash('sha256').update(sessionId).digest('hex').slice(0, 16));
.opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts:136:    it('returns the newest state file that matches the requested scope', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts:172:        const state = loadMostRecentState({ scope: { specFolder: 'specs/matching' } });
.opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts:184:    it('fails closed when the caller cannot prove scope', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts:215:          scope: { specFolder: 'specs/stale', claudeSessionId: staleSessionId },
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:51:      shared_space_id TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:73:  scope: {
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:74:    tenantId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:75:    userId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:76:    agentId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:77:    sessionId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:94:      shared_space_id
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:104:    scope.tenantId ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:105:    scope.userId ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:106:    scope.agentId ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:107:    scope.sessionId ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:108:    scope.sharedSpaceId ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:236:    it('T054-6aa: Cross-tenant duplicates do not dedup when governance scope differs', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:238:      const folder = 'specs/governed-dedup';
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:242:        '/specs/governed-dedup/memory/tenant-a.md',
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:246:        { tenantId: 'tenant-a' },
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:255:        { tenantId: 'tenant-b' },
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:261:    it('T054-6ab: Matching governance scope still dedups identical content', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:263:      const folder = 'specs/governed-dedup-match';
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:267:        '/specs/governed-dedup-match/memory/tenant-a.md',
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:271:        { tenantId: 'tenant-a', sharedSpaceId: 'shared-1' },
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:280:        { tenantId: 'tenant-a', sharedSpaceId: 'shared-1' },
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:353:    it('T320-1: Same-path lookup uses two direct probes without nullable OR scope predicates', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:371:        { tenantId: 'tenant-a' },
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:383:    it('T320-2: Content-hash dedup uses exact scope clauses instead of nullable OR predicates', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:400:        { tenantId: 'tenant-a', sharedSpaceId: 'shared-1' },
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:404:      expect(capturedSql).toContain('shared_space_id = ?');
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:593:    it('T054-6j: Same-path unchanged ignores matching content in another tenant scope', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:594:      const content = 'Same-path unchanged must remain tenant-scoped.';
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:595:      const filePath = '/specs/governed-same-path/memory/doc.md';
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:601:        'specs/governed-same-path',
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:611:        buildParsedMemory('specs/governed-same-path', content, 'Tenant Scoped'),
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:616:        { tenantId: 'tenant-b' },
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:622:    it('T054-6k: Same-path predecessor lookup stays inside the current governance scope', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:624:      const filePath = '/specs/governed-predecessor/memory/doc.md';
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:630:        'specs/governed-predecessor',
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:640:        'specs/governed-predecessor',
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:643:        { tenantId: 'tenant-b' },
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:647:        'specs/governed-predecessor',
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:650:        { tenantId: 'tenant-a' },
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:451:function get_constitutional_cache_db_scope(): string {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:463:  const db_scope = get_constitutional_cache_db_scope();
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:464:  return `${db_scope}::${spec_folder || 'global'}:${includeArchived ? 'arch' : 'noarch'}`;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:468:  const current_db_path = get_constitutional_cache_db_scope();
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:483:    const current_db_path = get_constitutional_cache_db_scope();
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:679:    const scoped_suffix_archived = `::${spec_folder}:arch`;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:680:    const scoped_suffix_live = `::${spec_folder}:noarch`;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:682:      if (key.endsWith(scoped_suffix_archived) || key.endsWith(scoped_suffix_live)) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:687:      if (key.endsWith(scoped_suffix_archived) || key.endsWith(scoped_suffix_live)) {
.opencode/skill/system-spec-kit/mcp_server/lib/graph/temporal-edges.ts:6:// enabling edge invalidation and temporally-scoped graph queries.
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:173:    ).rejects.toThrow(/requires specFolder scope/i);
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:13:// 5. Unscoped queries — no folder restriction applied
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:133:    sessionId: undefined,
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:367:// 5. Unscoped queries — no folder restriction applied
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:370:describe('R9: Unscoped queries — cross-folder behaviour', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:531:  it('R9-15b: scoped result set is a strict subset of cross-folder result set', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:533:    // Equivalently: all scoped results must also appear in the unscoped result set.
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:534:    const scoped = structuralSearch({ specFolder: 'specs/001-auth', limit: 10 });
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:535:    const unscoped = structuralSearch({ limit: 10 });
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:537:    const unscopedIds = new Set(unscoped.map((r) => r.id));
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:538:    for (const row of scoped) {
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:539:      expect(unscopedIds.has(row.id)).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:542:    // Unscoped contains rows from other folders as well.
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:543:    expect(unscoped.length).toBeGreaterThan(scoped.length);
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:1082:    it('EXT-H13: handleCheckpointList rejects whitespace tenantId when sharedSpaceId is provided', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:1084:        tenantId: '   ',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:1086:      })).rejects.toThrow(/tenantId must be a non-empty string/i);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:37:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:247:      selectionContext.sessionId ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:309:        sessionId: row.session_id ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:980:  if (isHybrid && config.enableSessionBoost && config.sessionId) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:984:        config.sessionId
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:254:        sessionId: r.session_id as string,
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:283:    sessionId: r.session_id as string,
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:80:  getSessionState: (sessionId: string) => MockSessionStateRow | undefined;
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:155:            for (const [sessionId, row] of sessionState.entries()) {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:157:                sessionState.delete(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:166:              sessionId,
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:173:              tenantId,
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:174:              userId,
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:175:              agentId,
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:193:            const existing = sessionState.get(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:195:              session_id: sessionId,
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:203:              tenant_id: tenantId ?? existing?.tenant_id ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:204:              user_id: userId ?? existing?.user_id ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:205:              agent_id: agentId ?? existing?.agent_id ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:209:            sessionState.set(sessionId, nextRow);
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:214:            const [updatedAt, sessionId] = args as [string, string];
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:215:            const row = sessionState.get(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:238:            const [updatedAt, sessionId] = args as [string, string];
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:239:            const row = sessionState.get(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:257:            const [sessionId] = args as [string];
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:258:            return sessionState.has(sessionId) ? { 1: 1 } : undefined;
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:266:            const [sessionId] = args as [string];
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:267:            return cloneRow(sessionState.get(sessionId));
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:271:            const [sessionId] = args as [string];
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:272:            const row = sessionState.get(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:335:    getSessionState: (sessionId: string) => cloneRow(sessionState.get(sessionId)),
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:404:      expect(database.execStatements.some((sql) => sql.includes('idx_session_state_identity_scope'))).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:414:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:415:        userId: 'user-a',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:416:        agentId: 'agent-a',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:472:      expect(result.sessions.map((session) => session.sessionId).sort()).toEqual(['list-a', 'list-b']);
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:504:        sessionId: 'session-123',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:523:        sessionId: 'session-with-data',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:607:        tenantId: 'tenant-1',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:608:        userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:609:        agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:694:        tenantId: 'tenant-z',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:695:        userId: 'user-z',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:696:        agentId: 'agent-z',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:705:        sessionId: 'recover-fields',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:712:        tenantId: 'tenant-z',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:713:        userId: 'user-z',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:714:        agentId: 'agent-z',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:788:      expect(result.sessions.map((session) => session.sessionId).sort()).toEqual(['recoverable-a', 'recoverable-b']);
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:798:      expect(result.sessions.some((session) => session.sessionId === 'exclude-completed')).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:812:      const session = result.sessions.find((entry) => entry.sessionId === 'field-check');
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:815:        sessionId: 'field-check',
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth.vitest.ts:64:  'scope_filtered',
.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts:9:  const sessionId = 'test-snapshot-store';
.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts:12:  afterEach(() => { try { rmSync(getStatePath(sessionId)); } catch { /* ok */ } });
.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts:15:    updateState(sessionId, {
.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts:18:    const state = loadState(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts:26:    updateState(sessionId, {
.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts:29:    updateState(sessionId, {
.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts:32:    const state = loadState(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts:38:    updateState(sessionId, { lastSpecFolder: 'specs/test' });
.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts:39:    updateState(sessionId, {
.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts:42:    const state = loadState(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-data.ts:25:  | 'scope_filtered';
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:175:      const sessionId: string = 'test-session-T003';
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:177:      const shouldSend: boolean = sessionManager.shouldSendMemory(sessionId, memory);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:182:      const sessionId: string = 'test-session-T003';
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:183:      const shouldSend2: boolean = sessionManager.shouldSendMemory(sessionId, 999);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:195:      const sessionId: string = 'test-session-T004';
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:198:      const firstCheck: boolean = sessionManager.shouldSendMemory(sessionId, memory);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:201:      const markResult: MarkResult = sessionManager.markMemorySent(sessionId, memory);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:204:      const secondCheck: boolean = sessionManager.shouldSendMemory(sessionId, memory);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:216:      const sessionId: string = 'test-session-T005';
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:224:        const result: MarkResult = sessionManager.markMemorySent(sessionId, memory);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:231:        expect(sessionManager.shouldSendMemory(sessionId, memory)).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:236:      `).get(sessionId) as { count: number };
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:280:      const sessionId: string = 'test-session-T007';
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:290:      sessionManager.markMemorySent(sessionId, searchResults[1]); // 502
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:291:      sessionManager.markMemorySent(sessionId, searchResults[3]); // 504
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:293:      const { filtered, dedupStats }: FilterResult = sessionManager.filterSearchResults(sessionId, searchResults);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:308:      const sessionId: string = 'test-session-T007b';
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:314:      const { filtered, dedupStats }: FilterResult = sessionManager.filterSearchResults(sessionId, [
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:337:      const sessionId: string = 'test-session-T008';
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:346:      sessionManager.markMemorySent(sessionId, searchResults[0]); // 601
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:347:      sessionManager.markMemorySent(sessionId, searchResults[1]); // 602
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:348:      sessionManager.markMemorySent(sessionId, searchResults[2]); // 603
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:350:      const { filtered, dedupStats }: FilterResult = sessionManager.filterSearchResults(sessionId, searchResults);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:359:      const sessionId: string = 'test-session-T008-zero';
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:366:      const { dedupStats: noSavingsStats }: FilterResult = sessionManager.filterSearchResults(sessionId, searchResults);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:121:      "notes": "Find-spec intent with temporal/scope framing. Tests specFolder-aware retrieval."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:240:      "expectedResultDescription": "Topic-scoped resume query. Should surface spec folder 001-sprint-0-measurement-foundation memories with state/next-steps anchors.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:241:      "notes": "From T007b Pattern 2: variant of session resume scoped to a specific sprint/spec folder."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:298:      "category": "scope_filtered",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:300:      "expectedResultDescription": "Spec-scoped browse. Should surface memory titles and tiers from spec folder system-spec-kit/022-hybrid-rag-fusion or 140-hybrid-rag-fusion-refinement.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:308:      "category": "scope_filtered",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:338:      "category": "scope_filtered",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:435:      "query": "refactor session deduplication to use a sliding window instead of session-scoped set",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:448:      "category": "scope_filtered",
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:67:    sessionId: 'sess-A',
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:218:      makeEvent({ memoryId: 'mem-A', sessionId: 'sess-1' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:219:      makeEvent({ memoryId: 'mem-A', sessionId: 'sess-2' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:220:      makeEvent({ memoryId: 'mem-B', sessionId: 'sess-3' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:233:      makeEvent({ confidence: 'strong', sessionId: 'sess-1' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:234:      makeEvent({ confidence: 'medium', sessionId: 'sess-2' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:235:      makeEvent({ confidence: 'weak',   sessionId: 'sess-3' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:249:      makeEvent({ confidence: 'strong', sessionId: 'sess-1' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:250:      makeEvent({ confidence: 'strong', sessionId: 'sess-2' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:251:      makeEvent({ confidence: 'medium', sessionId: 'sess-3' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:261:      makeEvent({ confidence: 'strong', sessionId: `sess-${i}`, memoryId: 'mem-X' })
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:271:      makeEvent({ timestamp: 1000, sessionId: 'sess-in' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:272:      makeEvent({ timestamp: 5000, sessionId: 'sess-out' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:278:  it('treats distinct sessionIds as distinct sessions', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:281:      makeEvent({ sessionId: 'sess-1' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:282:      makeEvent({ sessionId: 'sess-1' }), // same session, not counted twice
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:283:      makeEvent({ sessionId: 'sess-2' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:292:      makeEvent({ memoryId: 'mem-low',  confidence: 'weak',   sessionId: 's1' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:293:      makeEvent({ memoryId: 'mem-high', confidence: 'strong', sessionId: 's2' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:532:      makeEvent({ memoryId: 'mem-1', sessionId: 'sess-A', timestamp: BASE_TS }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:533:      makeEvent({ memoryId: 'mem-1', sessionId: 'sess-B', timestamp: BASE_TS }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:534:      makeEvent({ memoryId: 'mem-1', sessionId: 'sess-C', timestamp: BASE_TS }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:554:      makeEvent({ memoryId: 'mem-weak', sessionId: 'sess-1', timestamp: BASE_TS }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:555:      makeEvent({ memoryId: 'mem-weak', sessionId: 'sess-2', timestamp: BASE_TS }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:574:      makeEvent({ memoryId: 'mem-ok', sessionId: 's1', timestamp: BASE_TS }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:575:      makeEvent({ memoryId: 'mem-ok', sessionId: 's2', timestamp: BASE_TS }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:576:      makeEvent({ memoryId: 'mem-ok', sessionId: 's3', timestamp: BASE_TS }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:578:      makeEvent({ memoryId: 'mem-skip', sessionId: 's4', timestamp: BASE_TS }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:593:      makeEvent({ sessionId: 'sess-1', timestamp: BASE_TS - 10_000 }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:594:      makeEvent({ sessionId: 'sess-2', timestamp: BASE_TS - 10_000 }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:595:      makeEvent({ sessionId: 'sess-3', timestamp: BASE_TS - 10_000 }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:613:      makeEvent({ sessionId: 'sX', timestamp: BASE_TS }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:614:      makeEvent({ sessionId: 'sY', timestamp: BASE_TS }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:615:      makeEvent({ sessionId: 'sZ', timestamp: BASE_TS }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:632:      makeEvent({ sessionId: 's1', timestamp: BASE_TS }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:633:      makeEvent({ sessionId: 's2', timestamp: BASE_TS }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:634:      makeEvent({ sessionId: 's3', timestamp: BASE_TS }),
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:57:  sessionId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:72:  sessionId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:86:  sessionId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:98:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:265:  if (ns.sessionId) {
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:267:    params.push(ns.sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:313:    node.id, node.specFolder, node.loopType, node.sessionId,
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:387:    edge.id, edge.specFolder, edge.loopType, edge.sessionId,
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:462:    snapshot.specFolder, snapshot.loopType, snapshot.sessionId, snapshot.iteration,
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:469:export function getLatestSnapshot(specFolder: string, loopType: LoopType, sessionId?: string): CoverageSnapshot | null {
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:471:  if (sessionId) {
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:476:    `).get(specFolder, loopType, sessionId) as Record<string, unknown> | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:488:export function getSnapshots(specFolder: string, loopType: LoopType, sessionId?: string): CoverageSnapshot[] {
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:490:  if (sessionId) {
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:495:    `).all(specFolder, loopType, sessionId) as Record<string, unknown>[];
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:605:    sessionId: r.session_id as string,
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:621:    sessionId: r.session_id as string,
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:636:    sessionId: r.session_id as string,
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-validation.vitest.ts:170:    'spec.md': `# Test Spec\n\n| **Level** | 1 |\n| **Date** | ${today} |\n\n## Overview\nThis is a test spec.\n\n## Scope\nTest scope.\n\n## Requirements\nTest requirements.\n`,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:184:    keywords: ['spec', 'specification', 'requirements', 'scope', 'objective', 'constraints'],
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:185:    patterns: [/spec\.md/i, /specification/i, /(?:the|our)\s+(?:spec|requirements|scope)/i],
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:38:  scope: 'match' | 'mismatch';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:130:      && scenario.producerMetadata.scope === 'match',
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:193:| `scopeDimensionsTracked` | `number` | Number of tracked retrieval scope dimensions in this phase |
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-stress.vitest.ts:34:function countSessionEntries(db: Database.Database, sessionId: string): number {
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-stress.vitest.ts:36:    .get(sessionId) as CountRow;
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-stress.vitest.ts:50:      const sessionId = 'stress-session';
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-stress.vitest.ts:63:          const ok = workingMemory.setAttentionScore(sessionId, memoryId, score);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-stress.vitest.ts:66:          const currentCount = countSessionEntries(db, sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-stress.vitest.ts:71:      const finalCount = countSessionEntries(db, sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:97:| **temporary** | 0.3 | 0.5x | Yes | 7 days | Session-scoped, auto-expires |
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:141:// Mock governance scope filter
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:142:const mockFilterRowsByScope = vi.fn((rows: Array<Record<string, unknown>>, scope: Record<string, unknown>, allowedSharedSpaceIds?: Set<string>) => {
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:143:  const scopeEnforcementEnabled = process.env.SPECKIT_MEMORY_SCOPE_ENFORCEMENT === 'true'
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:146:    scope.tenantId
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:147:    || scope.userId
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:148:    || scope.agentId
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:149:    || scope.sessionId
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:150:    || scope.sharedSpaceId
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:153:  if (scopeEnforcementEnabled && !hasGovernanceScope) {
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:158:    const tenantMatches = !scope.tenantId || row.tenant_id === scope.tenantId;
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:159:    const userMatches = !scope.userId || row.user_id === scope.userId;
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:160:    const agentMatches = !scope.agentId || row.agent_id === scope.agentId;
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:161:    const sessionMatches = !scope.sessionId || row.session_id === scope.sessionId;
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:162:    const sharedMatches = !scope.sharedSpaceId || (
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:163:      row.shared_space_id === scope.sharedSpaceId
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:164:      && (!allowedSharedSpaceIds || allowedSharedSpaceIds.has(String(row.shared_space_id)))
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:169:vi.mock('../lib/governance/scope-governance', () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:170:  filterRowsByScope: (rows: Array<Record<string, unknown>>, scope: Record<string, unknown>, allowedSharedSpaceIds?: Set<string>) =>
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:171:    mockFilterRowsByScope(rows, scope, allowedSharedSpaceIds),
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:177:const mockGetAllowedSharedSpaceIds = vi.fn((_db: unknown, _scope: Record<string, unknown>) => undefined as Set<string> | undefined);
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:179:  getAllowedSharedSpaceIds: (db: unknown, scope: Record<string, unknown>) => mockGetAllowedSharedSpaceIds(db, scope),
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:457:  it('T8: summary-channel hits are filtered by governance scope before merge', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:471:          spec_folder: 'specs/governed',
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:472:          file_path: 'specs/governed/memory/allowed.md',
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:480:          shared_space_id: 'shared-allowed',
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:485:          spec_folder: 'specs/governed',
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:486:          file_path: 'specs/governed/memory/blocked.md',
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:494:          shared_space_id: 'shared-blocked',
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:504:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:516:  it('T9: constitutional injection re-applies governance scope after vector fetch', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:526:        shared_space_id: 'allowed-space',
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:535:        shared_space_id: 'allowed-space',
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:542:        shared_space_id: 'blocked-space',
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:550:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:559:  it('T10: deny-by-default filters empty-scope candidates when enforcement is enabled', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:573:  it('T11: deep-mode LLM reformulation results are scope-filtered before merge', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:581:        { id: 1, title: 'baseline allowed', tenant_id: 'tenant-a', shared_space_id: 'shared-allowed' },
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:584:        { id: 1, title: 'baseline duplicate', tenant_id: 'tenant-a', shared_space_id: 'shared-allowed' },
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:587:        { id: 2, title: 'reform blocked', tenant_id: 'tenant-b', shared_space_id: 'shared-blocked' },
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:590:        { id: 1, title: 'reform duplicate', score: 0.77, tenant_id: 'tenant-a', shared_space_id: 'shared-allowed' },
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:591:        { id: 3, title: 'reform allowed', tenant_id: 'tenant-a', shared_space_id: 'shared-allowed' },
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:597:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:612:  it('T12: deep-mode HyDE results are scope-filtered before merge', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:619:      { id: 1, title: 'baseline allowed', tenant_id: 'tenant-a', shared_space_id: 'shared-allowed' },
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:622:      { id: 1, title: 'hyde duplicate', score: 0.94, tenant_id: 'tenant-a', shared_space_id: 'shared-allowed' },
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:623:      { id: 2, title: 'hyde allowed', tenant_id: 'tenant-a', shared_space_id: 'shared-allowed' },
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:624:      { id: 3, title: 'hyde blocked', tenant_id: 'tenant-b', shared_space_id: 'shared-blocked' },
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:630:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:58:function buildRetrievableMemoryPredicates(alias: string, scopeInfo: MemoryIndexScopeInfo): string[] {
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:61:  if (scopeInfo.hasArchivedColumn) {
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:65:  if (scopeInfo.hasImportanceTierColumn) {
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:139:  const scopeInfo = getMemoryIndexScopeInfo(database);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:140:  const targetPredicates = buildRetrievableMemoryPredicates('m', scopeInfo);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:141:  const siblingPredicates = buildRetrievableMemoryPredicates('m', scopeInfo);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:147:     ${scopeInfo.hasActiveProjection ? 'JOIN active_memory_projection p ON p.active_memory_id = m.id' : ''}
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:161:     ${scopeInfo.hasActiveProjection ? 'JOIN active_memory_projection p ON p.active_memory_id = m.id' : ''}
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:203:  const scopeInfo = getMemoryIndexScopeInfo(database);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:204:  const rowPredicates = buildRetrievableMemoryPredicates('m', scopeInfo);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:205:  const folderPredicates = buildRetrievableMemoryPredicates('m', scopeInfo);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:212:     ${scopeInfo.hasActiveProjection ? 'JOIN active_memory_projection p ON p.active_memory_id = m.id' : ''}
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:248:       ${scopeInfo.hasActiveProjection ? 'JOIN active_memory_projection p ON p.active_memory_id = m.id' : ''}
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:90:  scopeDimensionsTracked: number;
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:212:      scopeDimensionsTracked: roadmapDefaults.scopeDimensionsTracked,
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:429:    scopeDimensionsTracked?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:445:  if (typeof update.scopeDimensionsTracked === 'number' && Number.isFinite(update.scopeDimensionsTracked)) {
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:446:    t.architecture.scopeDimensionsTracked = Math.max(0, Math.floor(update.scopeDimensionsTracked));
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:677:        scopeEnforcement: t.architecture.capabilities.scopeEnforcement,
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:681:      scopeDimensionsTracked: t.architecture.scopeDimensionsTracked,
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:103:| `sessionId` | `string?` | Optional session identifier |
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:160:| `createTrace(query, sessionId?, intent?)` | `RetrievalTrace` | New trace with auto-generated traceId |
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:244:| Start trace | `createTrace(query, sessionId?)` | Beginning of a retrieval call |
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:30:      sessionId: 'sess-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:38:      sessionId: 'sess-b',
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:47:      sessionId: 'sess-b',
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:76:  it('T081 requires sessionId when multiple open baselines share a task_id', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:83:      sessionId: 'sess-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:91:      sessionId: 'sess-b',
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:101:      message: expect.stringContaining('Provide sessionId'),
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:112:      sessionId: 'repeat-session',
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:120:      sessionId: 'repeat-session',
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:129:      sessionId: 'repeat-session',
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:137:      sessionId: 'repeat-session',
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:443:  it('uses query-scoped feedback signals as relevance labels when available', async () => {
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:477:      'spec': ['spec', 'specification', 'requirements', 'scope', 'what'],
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:181:  it('T017-02: Handles minimal session state (only sessionId)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:185:  it('T017-03: Handles undefined sessionId gracefully', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:200:  it('T018-02: Displays sessionId in code format', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:250:  it('T020-02: Generates memory_search command with sessionId when specFolder is not provided', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:254:  it('T020-03: Generates generic memory_search when neither specFolder nor sessionId is provided', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:262:  it('T020-05: specFolder takes precedence over sessionId for resume command', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:9:  assertSharedSpaceAccess,
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:12:  getAllowedSharedSpaceIds,
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:77:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:88:    expect(Array.from(getAllowedSharedSpaceIds(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:89:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:90:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:92:    expect(assertSharedSpaceAccess(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:93:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:94:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:105:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:116:    expect(assertSharedSpaceAccess(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:117:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:118:      userId: 'user-2',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:121:      reason: 'shared_space_membership_required',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:123:    expect(Array.from(getAllowedSharedSpaceIds(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:124:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:125:      userId: 'user-2',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:134:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:150:    expect(Array.from(getAllowedSharedSpaceIds(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:151:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:152:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:175:    CREATE INDEX IF NOT EXISTS idx_memories_scope ON memory_index(spec_folder, session_id, context_type);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/importance-tiers.ts:68:    description: 'Session-scoped, auto-expires',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1182:    it('passes governance scope into TM-04 semantic dedup candidate lookup', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1238:      const filePath = createAtomicSaveTargetPath('quality-gate-scope.md');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1244:        scope: {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1245:          tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1246:          userId: 'user-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1247:          agentId: 'agent-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1248:          sessionId: 'session-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1258:          tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1259:          userId: 'user-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1260:          agentId: 'agent-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1261:          sessionId: 'session-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1267:    it('passes governance scope into PE arbitration', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1307:      const filePath = createAtomicSaveTargetPath('pe-scope.md');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1313:        scope: {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1314:          tenantId: 'tenant-p',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1315:          userId: 'user-p',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1316:          agentId: 'agent-p',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1317:          sessionId: 'session-p',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1331:          tenantId: 'tenant-p',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1332:          userId: 'user-p',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1333:          agentId: 'agent-p',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1334:          sessionId: 'session-p',
.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:179:  it('scopes hidden-path checks relative to the watched root', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:182:    const scopedPath = __testables.getWatchScopedPath(filePath, [watchRoot]);
.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:184:    expect(scopedPath).toBe('specs/001-test/spec.md');
.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:185:    expect(__testables.shouldIgnoreWatchTarget(scopedPath ?? filePath)).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/scoring-observability.ts:50:// 3. DATABASE HANDLE (module-scoped, set via initScoringObservability)
.opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts:111:    metrics['isolation.unscoped_rows'] = 0;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts:112:    metrics['isolation.missing_session_scope_rows'] = 0;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts:126:  metrics['isolation.unscoped_rows'] = safeScalarMetric(
.opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts:130:  metrics['isolation.missing_session_scope_rows'] = safeScalarMetric(
.opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts:203:        scopeDimensionsTracked: defaults.scopeDimensionsTracked,
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:34:    expect(trace.sessionId).toBeUndefined();
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:38:  it('createTrace includes optional sessionId and intent', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:41:    expect(trace.sessionId).toBe('sess-123');
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:236:      sessionId: 'session-id',
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:263:    expect(sanitizedRecord.sessionId).toBeUndefined();
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:493:    it('filters exact duplicates by governed scope when scope values are provided', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:494:      const testContent = 'Tenant scoped duplicate';
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:504:              file_path: '/specs/test/memory/scoped.md',
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:508:              shared_space_id: null,
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:515:        { content: testContent, database: mockDatabase, tenantId: 'tenant-a', userId: 'user-a' } as unknown as DuplicateParams,
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:520:      expect(result.existing_path).toBe('/specs/test/memory/scoped.md');
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:570:    it('redacts duplicate metadata when similar match belongs to a different scope', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:573:          content: 'Cross-scope similar memory',
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:575:          tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:579:              file_path: '/specs/test/memory/other-scope.md',
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:584:              shared_space_id: null,
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:596:      expect(result.existing_scope).toBeUndefined();
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:599:    it('redacts exact-duplicate identifiers when cross-scope match is detected', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:600:      const testContent = 'Cross-scope exact duplicate';
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:612:              shared_space_id: null,
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:623:          tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:624:          userId: 'user-a',
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:634:      expect(result.existing_scope).toBeUndefined();
.opencode/skill/system-spec-kit/mcp_server/tests/hydra-spec-pack-consistency.vitest.ts:27:  'mcp_server/lib/governance/scope-governance.ts',
.opencode/skill/system-spec-kit/mcp_server/tests/hydra-spec-pack-consistency.vitest.ts:38:  'mcp_server/lib/governance/scope-policy.ts',
.opencode/skill/system-spec-kit/mcp_server/tests/hydra-spec-pack-consistency.vitest.ts:46:  'mcp_server/test/security/scope-isolation.test.ts',
.opencode/skill/system-spec-kit/mcp_server/tests/hydra-spec-pack-consistency.vitest.ts:52:  path.join(SKILL_ROOT, 'feature_catalog', '17--governance', '03-hierarchical-scope-governance-governed-ingest-retention-and-audit.md'),
.opencode/skill/system-spec-kit/mcp_server/tests/hydra-spec-pack-consistency.vitest.ts:67:  it('parent spec and plan describe the closure pass with current scope, evidence, and support boundaries', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/hydra-spec-pack-consistency.vitest.ts:83:    expect(planContent).not.toContain('root-only scope was confirmed');
.opencode/skill/system-spec-kit/mcp_server/tests/hydra-spec-pack-consistency.vitest.ts:109:    expect(checklistContent).toContain('Hydra follow-up verification passed across targeted governed-retrieval, shared-space admin, graph-ranking, and retention regressions');
.opencode/skill/system-spec-kit/mcp_server/tests/hydra-spec-pack-consistency.vitest.ts:123:    expect(playbookContent).toContain('### 122 | Governed ingest and scope isolation (Phase 5)');
.opencode/skill/system-spec-kit/mcp_server/tests/hydra-spec-pack-consistency.vitest.ts:137:    expect(summaryContent).toContain('owner-only shared-space operations now enforce explicit actor identity plus owner authorization');
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning.vitest.ts:14:      sessionId: string | null;
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning.vitest.ts:43:  it('normalizes sessionId before filtering learning history queries', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning.vitest.ts:50:      sessionId: 'normalized-session',
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning.vitest.ts:58:      sessionId: 'normalized-session',
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning.vitest.ts:63:      sessionId: '  normalized-session  ',
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning.vitest.ts:71:      sessionId: 'normalized-session',
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:4:// Hierarchical scope enforcement, governed ingest validation,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:10:// Feature catalog: Hierarchical scope governance, governed ingest, retention, and audit
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:14: * Retention modes applied during governed ingest.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:19: * Request scope used to enforce tenancy, actor, session, and shared-space boundaries.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:22:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:23:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:24:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:25:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:30: * Governed-ingest fields required to persist scope and retention metadata.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:35:  governedAt?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:41: * Result of governed-ingest validation and field normalization.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:45:  tenantId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:46:  userId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:47:  agentId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:48:  sessionId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:52:  governedAt: string;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:83:  allowUnscoped?: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:120: * Options used when benchmarking scope-filter behavior.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:128: * Benchmark result for a scope filter predicate.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:153: * Trim and normalize optional scope identifiers before enforcement.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:160:    tenantId: normalizeId(input.tenantId),
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:161:    userId: normalizeId(input.userId),
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:162:    agentId: normalizeId(input.agentId),
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:163:    sessionId: normalizeId(input.sessionId),
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:169: * Resolve whether scope filtering is active for the current process.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:170: * Default: OFF — scope enforcement is opt-in via SPECKIT_MEMORY_SCOPE_ENFORCEMENT=true.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:171: * When enabled without scope constraints in the query, all results are rejected
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:172: * (empty scope + enforcement = no access). Only enable when multi-tenant governance
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:173: * is configured with tenantId/userId/agentId/sharedSpaceId in queries.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:175: * @returns `true` when scope enforcement is enabled.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:196: * Determine whether an ingest request must pass governed-ingest validation.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:199: * @returns `true` when governance or scope metadata requires enforcement.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:202:  const scope = normalizeScopeContext(input);
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:203:  return Object.values(scope).some((value) => typeof value === 'string')
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:206:    || typeof input.governedAt === 'string'
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:213: * Validate governed-ingest metadata and return normalized persistence fields.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:216: * @returns Validation result with normalized scope, provenance, and retention data.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:219:  const scope = normalizeScopeContext(input);
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:221:  const governedAt = normalizeIsoTimestamp(input.governedAt) ?? new Date().toISOString();
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:230:    // B8: Return null instead of empty string for optional scope fields
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:235:        tenantId: scope.tenantId || null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:236:        userId: scope.userId || null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:237:        agentId: scope.agentId || null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:238:        sessionId: scope.sessionId || null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:239:        sharedSpaceId: scope.sharedSpaceId || null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:242:        governedAt,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:250:  if (!scope.tenantId) issues.push('tenantId is required for governed ingest');
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:251:  if (!scope.sessionId) issues.push('sessionId is required for governed ingest');
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:252:  if (!scope.userId && !scope.agentId) issues.push('userId or agentId is required for governed ingest');
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:253:  if (!provenanceSource) issues.push('provenanceSource is required for governed ingest');
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:254:  if (!provenanceActor) issues.push('provenanceActor is required for governed ingest');
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:255:  if (deleteAfter && new Date(deleteAfter).getTime() <= new Date(governedAt).getTime()) {
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:256:    issues.push('deleteAfter must be later than governedAt');
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:269:      tenantId: scope.tenantId ?? '',
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:270:      userId: scope.userId,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:271:      agentId: scope.agentId,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:272:      sessionId: scope.sessionId ?? '',
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:273:      sharedSpaceId: scope.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:276:      governedAt,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:291:    tenant_id: decision.normalized.tenantId || null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:292:    user_id: decision.normalized.userId ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:293:    agent_id: decision.normalized.agentId ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:294:    session_id: decision.normalized.sessionId || null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:295:    shared_space_id: decision.normalized.sharedSpaceId ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:298:    governed_at: decision.normalized.governedAt,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:302:      tenantId: decision.normalized.tenantId || null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:303:      userId: decision.normalized.userId ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:304:      agentId: decision.normalized.agentId ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:305:      sessionId: decision.normalized.sessionId || null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:309:      governedAt: decision.normalized.governedAt,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:334:  const scope = normalizeScopeContext(entry);
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:338:      shared_space_id, reason, metadata
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:345:    scope.tenantId ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:346:    scope.userId ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:347:    scope.agentId ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:348:    scope.sessionId ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:349:    scope.sharedSpaceId ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:361: * Determine whether a scope includes at least one concrete constraint.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:363: * @param scope - Scope to inspect for tenant, actor, session, or shared-space bounds.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:364: * @returns `true` when the scope constrains access to at least one boundary.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:366:export function hasScopeConstraints(scope: ScopeContext): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:368:    scope.sharedSpaceId
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:369:    || scope.tenantId
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:370:    || scope.userId
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:371:    || scope.agentId
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:372:    || scope.sessionId,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:409:  if (normalized.tenantId) {
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:411:    params.push(normalized.tenantId);
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:413:  if (normalized.userId) {
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:415:    params.push(normalized.userId);
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:417:  if (normalized.agentId) {
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:419:    params.push(normalized.agentId);
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:421:  if (normalized.sessionId) {
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:423:    params.push(normalized.sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:426:    clauses.push('shared_space_id = ?');
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:441:    || normalized.tenantId
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:442:    || normalized.userId
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:443:    || normalized.agentId
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:444:    || normalized.sessionId
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:450: * Build a reusable row predicate for scope filtering without re-normalizing each row scan.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:452: * @param scope - Requested scope used for filtering.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:453: * @param allowedSharedSpaceIds - Optional shared-space allowlist for the scope.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:457:  scope: ScopeContext,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:460:  const normalized = normalizeScopeContext(scope);
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:465:    // BUG-001 fix: Empty scope under enforcement means no access, not universal access.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:470:    const rowSharedSpaceId = normalizeId(row.shared_space_id);
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:486:      return matchesExactScope(row.tenant_id, normalized.tenantId);
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:489:    return matchesExactScope(row.tenant_id, normalized.tenantId)
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:490:      && matchesExactScope(row.user_id, normalized.userId)
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:491:      && matchesExactScope(row.agent_id, normalized.agentId)
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:492:      && matchesExactScope(row.session_id, normalized.sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:508:  const allowUnscoped = filters.allowUnscoped === true;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:509:  // Security: audit enumeration requires explicit scope filters or admin override
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:510:  if (!allowUnscoped && !hasGovernanceAuditFilters(filters)) {
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:511:    console.warn('[scope-governance] Unscoped governance audit enumeration blocked; explicit filters or allowUnscoped=true required.');
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:539:      shared_space_id,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:557:    shared_space_id: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:606:      tenantId: row.tenant_id ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:607:      userId: row.user_id ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:608:      agentId: row.agent_id ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:609:      sessionId: row.session_id ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:610:      sharedSpaceId: row.shared_space_id ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:626: * Benchmark scope filtering with a reusable predicate for rollout and safety checks.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:628: * @param rows - Candidate rows that include governance scope columns.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:629: * @param scope - Requested scope used for filtering.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:635:  scope: ScopeContext,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:641:  const predicate = createScopeFilterPredicate(scope, options.allowedSharedSpaceIds);
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:666: * Filter result rows to the tenant, actor, session, and shared-space scope in force.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:668: * @param rows - Candidate rows that include governance scope columns.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:669: * @param scope - Requested scope used for filtering.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:670: * @param allowedSharedSpaceIds - Optional shared-space allowlist for the scope.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:673:export function filterRowsByScope<T extends Record<string, unknown>>(rows: T[], scope: ScopeContext, allowedSharedSpaceIds?: ReadonlySet<string>): T[] {
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:674:  return rows.filter(createScopeFilterPredicate(scope, allowedSharedSpaceIds));
.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:40:  shared_space_id?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:43:  governed_at?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:61:  'shared_space_id', 'provenance_source', 'provenance_actor',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:62:  'governed_at', 'retention_policy', 'delete_after', 'governance_metadata',
.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:98:| temporary | working | Session-scoped, fast decay |
.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-db.vitest.ts:196:    it('namespace matches sessionId format', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:15:import { getAllowedSharedSpaceIds } from '../collab/shared-spaces.js';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:22:} from '../governance/scope-governance.js';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:82:    'shared_spaces',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:83:    'shared_space_members',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:84:    'shared_space_conflicts',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:124:  'shared_spaces',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:125:  'shared_space_members',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:126:  'shared_space_conflicts',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:172:  scope?: ScopeContext;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:322:  'governance_audit', 'shared_spaces', 'shared_space_members', 'shared_space_conflicts',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:396:    const rawId = memory?.shared_space_id;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:423:function checkpointMetadataMatchesScope(rawMetadata: unknown, scope: ScopeContext): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:424:  const normalizedScope = normalizeScopeContext(scope);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:431:    (normalizedScope.tenantId === undefined || metadata.tenantId === normalizedScope.tenantId)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:432:    && (normalizedScope.userId === undefined || metadata.userId === normalizedScope.userId)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:433:    && (normalizedScope.agentId === undefined || metadata.agentId === normalizedScope.agentId)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:444:    || columns.has('shared_space_id')
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:450:  scope: ScopeContext = {},
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:456:  const normalizedScope = normalizeScopeContext(scope);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:465:  const allowedSharedSpaceIds = getAllowedSharedSpaceIds(database, normalizedScope);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:476:  scope: ScopeContext = {},
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:483:  const { normalizedScope, allowedSharedSpaceIds, predicate } = getScopeFilterContext(database, scope);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:500:  scope: ScopeContext = {},
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:502:  return getScopedMemories(database, specFolder, scope).memoryIds;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:508:  scope: ScopeContext = {},
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:513:  const normalizedScope = normalizeScopeContext(scope);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:521:  if (normalizedScope.tenantId && columns.has('tenant_id')) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:523:    params.push(normalizedScope.tenantId);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:525:  if (normalizedScope.userId && columns.has('user_id')) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:527:    params.push(normalizedScope.userId);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:529:  if (normalizedScope.agentId && columns.has('agent_id')) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:531:    params.push(normalizedScope.agentId);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:533:  if (normalizedScope.sharedSpaceId && columns.has('shared_space_id')) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:534:    clauses.push('shared_space_id = ?');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:649:    scope?: ScopeContext;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:653:  const { specFolder, memoryIds, sharedSpaceIds, scope = {}, allowedSharedSpaceIds } = options;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:654:  const normalizedScope = normalizeScopeContext(scope);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:656:  const scopePredicate = hasScope
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:666:    return scopePredicate ? rows.filter((row) => scopePredicate(row)) : rows;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:699:  if (tableName === 'shared_spaces') {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:703:        'SELECT * FROM shared_spaces WHERE space_id IN (__PLACEHOLDERS__)',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:707:    if (normalizedScope.tenantId) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:709:        'SELECT * FROM shared_spaces WHERE tenant_id = ?'
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:710:      ).all(normalizedScope.tenantId) as Array<Record<string, unknown>>;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:712:    return hasScope ? [] : database.prepare('SELECT * FROM shared_spaces').all() as Array<Record<string, unknown>>;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:715:  if (tableName === 'shared_space_members') {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:719:        'SELECT * FROM shared_space_members WHERE space_id IN (__PLACEHOLDERS__)',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:723:    return hasScope ? [] : database.prepare('SELECT * FROM shared_space_members').all() as Array<Record<string, unknown>>;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:726:  if (tableName === 'shared_space_conflicts') {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:732:            SELECT * FROM shared_space_conflicts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:740:            SELECT * FROM shared_space_conflicts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:750:        'SELECT * FROM shared_space_conflicts WHERE space_id IN (__PLACEHOLDERS__)',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:754:    return hasScope ? [] : database.prepare('SELECT * FROM shared_space_conflicts').all() as Array<Record<string, unknown>>;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:793:  if (!scopePredicate) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:798:    return allRows.filter((row) => scopePredicate(row));
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:811:    scope?: ScopeContext;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:910:    scope?: ScopeContext;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:919:    scope = {},
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:922:  const normalizedScope = normalizeScopeContext(scope);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:934:  const { clauses: scopedClauses, params: scopedParams } = buildRestoreScopeDeleteWhere(
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:941:    if (scopedClauses.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:942:      database.prepare(`DELETE FROM memory_index WHERE ${scopedClauses.join(' AND ')}`).run(...scopedParams);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:957:  if (tableName === 'shared_spaces') {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:962:  if (tableName === 'shared_space_members') {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:967:  if (tableName === 'shared_space_conflicts') {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:992:  if (scopedClauses.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:993:    database.prepare(`DELETE FROM ${tableName} WHERE ${scopedClauses.join(' AND ')}`).run(...scopedParams);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:997:  if (sharedSpaceIds.length > 0 && columns.has('shared_space_id')) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:998:    deleteRowsByStringIds(database, tableName, 'shared_space_id', sharedSpaceIds);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1012:  if (sharedSpaceIds.length > 0 && columns.has('shared_space_id')) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1013:    deleteRowsByStringIds(database, tableName, 'shared_space_id', sharedSpaceIds);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1027:    scope?: ScopeContext;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1030:  const { checkpointSpecFolder, memoryIds, scope = {} } = options;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1031:  const hasScope = hasScopeConstraints(normalizeScopeContext(scope));
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1072:    scope: ScopeContext;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1416:    scope = {},
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1424:        memoryIds: scopedMemoryIds,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1427:      } = getScopedMemories(database, specFolder, scope);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1441:          memoryIds: scopedMemoryIds,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1443:          scope: normalizedScope,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1487:          ...(normalizedScope.tenantId ? { tenantId: normalizedScope.tenantId } : {}),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1488:          ...(normalizedScope.userId ? { userId: normalizedScope.userId } : {}),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1489:          ...(normalizedScope.agentId ? { agentId: normalizedScope.agentId } : {}),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1520:          ...(normalizedScope.tenantId ? { tenantId: normalizedScope.tenantId } : {}),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1521:          ...(normalizedScope.userId ? { userId: normalizedScope.userId } : {}),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1522:          ...(normalizedScope.agentId ? { agentId: normalizedScope.agentId } : {}),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1542:  scope: ScopeContext = {},
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1559:      .filter((row) => checkpointMetadataMatchesScope(row.metadata, scope))
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1576:function getCheckpoint(nameOrId: string | number, scope: ScopeContext = {}): CheckpointEntry | null {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1585:    if (checkpoint && !checkpointMetadataMatchesScope(checkpoint.metadata, scope)) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1599:  scope: ScopeContext = {},
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1614:    const checkpoint = getCheckpoint(nameOrId, scope);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1634:    const { normalizedScope, allowedSharedSpaceIds } = getScopeFilterContext(database, scope);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1638:    const scopedMemoryIdsToReplace = Array.from(
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1717:            memoryIds: scopedMemoryIdsToReplace,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1718:            scope: normalizedScope,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1727:                memoryIds: scopedMemoryIdsToReplace,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1730:                scope: normalizedScope,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1855:          // In merge mode, replace only the in-scope rows captured by the checkpoint.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1859:              memoryIds: scopedMemoryIdsToReplace,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1862:              scope: normalizedScope,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1922:function deleteCheckpoint(nameOrId: string | number, scope: ScopeContext = {}): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1926:    const checkpoint = getCheckpoint(nameOrId, scope);
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:18:} from '../governance/scope-governance.js';
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:35:  tenantId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:61:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:147:    FROM shared_space_conflicts
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:182: * Tier 2: Database config persistence — `shared_memory_enabled` key in `config` table.
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:200:        .get('shared_memory_enabled') as { value: string } | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:204:      console.warn(`[shared-spaces] Failed to resolve shared_memory_enabled config: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:219:    .run('shared_memory_enabled', 'true');
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:235: * @param tenantId - Optional tenant to constrain the summary.
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:238:export function getSharedRolloutMetrics(database: Database.Database, tenantId?: string): SharedRolloutMetrics {
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:240:  const normalizedTenantId = normalizeScopeContext({ tenantId }).tenantId ?? null;
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:252:    FROM shared_spaces
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:264:    FROM shared_space_members m
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:265:    JOIN shared_spaces s ON s.space_id = m.space_id
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:271:    FROM shared_space_conflicts c
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:272:    JOIN shared_spaces s ON s.space_id = c.space_id
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:277:    tenantId: normalizedTenantId ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:292: * @param tenantId - Optional tenant to constrain the summary.
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:297:  tenantId?: string,
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:300:  const normalizedTenantId = normalizeScopeContext({ tenantId }).tenantId ?? null;
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:303:    FROM shared_spaces
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:315:    FROM shared_spaces s
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:316:    LEFT JOIN shared_space_members m ON m.space_id = s.space_id
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:378:    FROM shared_space_conflicts
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:397:  if (!definition.spaceId?.trim() || !definition.tenantId?.trim()) {
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:398:    throw new Error('E_VALIDATION: spaceId and tenantId must be non-empty strings');
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:430:    INSERT INTO shared_spaces (space_id, tenant_id, name, rollout_enabled, rollout_cohort, kill_switch, metadata, updated_at)
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:436:    definition.tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:457:    INSERT INTO shared_spaces (space_id, tenant_id, name, rollout_enabled, rollout_cohort, kill_switch, metadata, updated_at)
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:469:    definition.tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:492:    INSERT INTO shared_space_members (space_id, subject_type, subject_id, role, updated_at)
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:501: * Collect the shared spaces visible to the provided user or agent scope.
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:504: * @param scope - Scope used to filter memberships and tenant boundaries.
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:505: * @returns Shared-space identifiers the scope is allowed to see.
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:507:export function getAllowedSharedSpaceIds(database: Database.Database, scope: ScopeContext): Set<string> {
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:508:  // B2: Respect the same disable gate as assertSharedSpaceAccess.
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:511:  const normalizedScope = normalizeScopeContext(scope);
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:513:  // P0 fix: require tenant context so null scopes cannot enumerate every tenant.
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:514:  if (!normalizedScope.tenantId) return new Set();
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:518:    ['user', normalizedScope.userId],
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:519:    ['agent', normalizedScope.agentId],
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:526:      FROM shared_space_members m
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:527:      JOIN shared_spaces s ON s.space_id = m.space_id
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:536:      normalizedScope.tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:550: * @param scope - Scope requesting shared-space access.
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:555:export function assertSharedSpaceAccess(
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:557:  scope: ScopeContext,
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:561:  const normalizedScope = normalizeScopeContext(scope);
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:569:        action: 'shared_space_access',
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:572:        tenantId: normalizedScope.tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:573:        userId: normalizedScope.userId,
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:574:        agentId: normalizedScope.agentId,
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:575:        sessionId: normalizedScope.sessionId,
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:584:      console.error(`[shared-spaces] Failed to record shared_space_access audit: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:597:    return deny('shared_space_id_required');
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:603:    return deny('shared_memory_disabled');
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:608:    FROM shared_spaces
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:613:    return deny('shared_space_not_found');
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:615:  if (normalizedScope.tenantId && space.tenant_id !== normalizedScope.tenantId) {
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:616:    return deny('shared_space_tenant_mismatch', {
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:620:  if (isGovernanceGuardrailsEnabled() && !normalizedScope.tenantId) {
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:621:    return deny('shared_space_tenant_required');
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:626:    return deny('shared_space_kill_switch');
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:629:    return deny('shared_space_rollout_disabled');
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:632:  const allowed = getAllowedSharedSpaceIds(database, normalizedScope);
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:634:    return deny('shared_space_membership_required');
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:643:    FROM shared_space_members
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:656:  `).get(spaceId, normalizedScope.userId ?? '', normalizedScope.agentId ?? '') as { role?: SharedRole } | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:660:    return deny('shared_space_membership_required');
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:663:    return deny('shared_space_owner_required', { resolvedRole: role });
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:666:    return deny('shared_space_editor_required', { resolvedRole: role });
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:695:      INSERT INTO shared_space_conflicts (
.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:9:  const sessionId = 'test-resume-session';
.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:12:  afterEach(() => { try { rmSync(getStatePath(sessionId)); } catch { /* ok */ } });
.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:15:    updateState(sessionId, {
.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:19:    const state = loadState(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:33:    updateState(sessionId, {
.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:37:    const state = loadState(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:43:    updateState(sessionId, { lastSpecFolder: 'specs/a' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:44:    updateState(sessionId, { lastSpecFolder: 'specs/b' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:45:    const state = loadState(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:46:    expect(state!.claudeSessionId).toBe(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:175:      'shared_space_upsert',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:176:      'shared_space_membership_set',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:177:      'shared_memory_status',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:178:      'shared_memory_enable',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:300:      'shared_space_upsert', 'shared_space_membership_set', 'shared_memory_status', 'shared_memory_enable',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:728:          sessionId: null,
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1055:              arguments: { query: 'recent issues', sessionId: 'sess-sticky-1' },
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:288:    it('undo removes legacy-format correction-owned edge via scoped fallback only', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:164:    expect(api.LAYER_DEFINITIONS.L5.tools).toContain('shared_memory_status');
.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:165:    expect(api.TOOL_LAYER_MAP.shared_memory_status).toBe('L5');
.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:166:    expect(api.getLayerForTool('shared_memory_status')).toBe('L5');
.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:167:    expect(api.getLayerTokenBudget('shared_memory_status')).toBe(1000);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md:38:- Storage helpers assume document-aware columns such as `document_type`, `spec_level`, governance scope columns, and lineage metadata are available.
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:64:  temporary: 'working',              // Session-scoped, fast decay
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:86:    tools: ['checkpoint_create', 'checkpoint_list', 'checkpoint_restore', 'checkpoint_delete', 'shared_memory_enable', 'shared_memory_status', 'shared_space_upsert', 'shared_space_membership_set']
.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts:11:const SUPPORTED_PHASES_ARRAY = ['baseline', 'lineage', 'graph', 'adaptive', 'scope-governance', 'shared-rollout'] as const;
.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts:21:  scopeEnforcement: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts:30:  scopeDimensionsTracked: number;
.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts:59:  scopeEnforcement: 'SPECKIT_MEMORY_SCOPE_ENFORCEMENT',
.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts:68:  scopeEnforcement: 'SPECKIT_HYDRA_SCOPE_ENFORCEMENT',
.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts:149:    scopeEnforcement: isMemoryRoadmapCapabilityEnabled(
.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts:150:      [CAPABILITY_ENV.scopeEnforcement, LEGACY_CAPABILITY_ENV.scopeEnforcement],
.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts:172:    scopeDimensionsTracked: 5, // tenant/user/agent/session/sharedSpace
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:38:  shared_space_id?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:208:  const scopeTuple = [
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:213:    ['shared_space', normalizeScopeValue(row.shared_space_id)],
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:216:  if (scopeTuple.length === 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:220:  const scopeHash = createHash('sha256')
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:221:    .update(JSON.stringify(scopeTuple), 'utf8')
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:225:  return `scope-sha256:${scopeHash}`;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:234:  scopePrefix: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:241:    scopePrefix: parts.scopePrefix,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:258:  const scopePrefix = buildScopePrefix(row);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:266:      scopePrefix,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:272:  if (!scopePrefix) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:275:  return `${row.spec_folder}::${scopePrefix}::${canonicalPath}::${anchorId}`;
.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:26:  'handlers/memory-triggers.js': 470, // actual: 454 — Trigger matching with cognitive features + governance/scope wiring
.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:30:  'handlers/checkpoints.js': 620,   // actual: 611 — Checkpoint operations plus scoped metadata guards, restore/delete safety checks, SEC-002 scope enforcement, and T012 follow-up fixes
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:386:  function getExtractedRow(database: TestDatabase, sessionId: string, memoryId: number): ExtractedRow | undefined {
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:398:    `).get(sessionId, memoryId) as ExtractedRow | undefined;
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:422:      const sessionId = 'wm-provenance-session';
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:427:        sessionId,
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:438:      const row = getExtractedRow(database, sessionId, memoryId);
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:454:      const sessionId = 'wm-no-count-probe';
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:467:        sessionId,
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:476:        sessionId,
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:492:      `).get(sessionId, memoryId) as { cnt: number };
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:504:      const sessionId = 'wm-provenance-update';
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:509:        sessionId,
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:520:        sessionId,
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:534:      `).get(sessionId, memoryId) as { cnt: number };
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:537:      const row = getExtractedRow(database, sessionId, memoryId);
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:555:      const sessionId = 'wm-provenance-checkpoint';
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:560:        sessionId,
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:574:      const removed = workingMemory.clearSession(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:581:      const restoredRow = getExtractedRow(database, sessionId, memoryId);
.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:23:    it('T531-1: sessionId parameter accepted by search', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:28:            sessionId: 'dedup-session-001',
.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:35:        expect(getErrorMessage(error)).not.toContain('sessionId');
.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:44:            sessionId: 'dedup-session-002',
.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:75:    it('T531-4: Search without sessionId accepted (no dedup)', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:80:            // No sessionId — dedup should not activate
.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:94:    it('T531-5: Default dedup behavior with sessionId', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:99:            sessionId: 'dedup-session-default',
.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:115:            sessionId: 'dedup-session-disabled',
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:175:  - `README.md` — pipeline overview and extraction scope.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:194:- Purpose: Owns scope enforcement, governed ingest normalization, audit recording, and retention sweeps. This is the boundary for tenant/user/agent/session/shared-space policy decisions.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:196:  - `scope-governance.ts` — scope normalization, policy decisions, filter helpers, and governance audit writes.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:197:  - `retention.ts` — scoped retention sweep logic over expired memories.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:239:  - `README.md` — current management-cycle scope and algorithm notes.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:372:  - `README.md` — telemetry scope and flag overview.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:570:- Narrowly scoped infra-to-infra imports are allowed when they reflect clear dependency direction:
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:923:    shared_space_id: existingRow.shared_space_id,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:926:    governed_at: existingRow.governed_at,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/runtime-detection.ts:13:export type HookPolicy = 'enabled' | 'disabled_by_scope' | 'unavailable' | 'unknown';
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/runtime-detection.ts:74:    return 'disabled_by_scope';
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/runtime-detection.ts:87:    if (!existsSync(hooksDir)) return 'disabled_by_scope';
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/runtime-detection.ts:90:    if (hookFiles.length === 0) return 'disabled_by_scope';
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/runtime-detection.ts:105:    return 'disabled_by_scope';
.opencode/skill/system-spec-kit/mcp_server/tests/reporting-dashboard.vitest.ts:769:    it('limit applies after sprint grouping and report totals match the included scope', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts:41:  it('forwards governed scope fields through memory_quick_search', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts:44:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts:45:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts:46:      agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts:53:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts:54:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts:55:      agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-state-baseline.vitest.ts:73:    expect(snapshot.metrics['isolation.unscoped_rows']).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-state-baseline.vitest.ts:74:    expect(snapshot.metrics['isolation.missing_session_scope_rows']).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/integration-search-pipeline.vitest.ts:202:            sessionId: 'sess-123',
.opencode/skill/system-spec-kit/mcp_server/tests/integration-search-pipeline.vitest.ts:214:        expect(message.includes('sessionId')).not.toBe(true);
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:75:| `scoring/README.md` | Documentation for cache-scoped scoring re-exports |
.opencode/skill/system-spec-kit/mcp_server/tests/context-metrics.vitest.ts:34:      expect(metrics.sessionId).toMatch(/^sess_/);
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:22:  function insertWorkingMemory(sessionId: string, memoryId: number, score: number = 0.8) {
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:26:    `).run(sessionId, memoryId, score);
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:29:  function countWorkingMemory(sessionId: string): number {
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:32:    ).get(sessionId) as { count: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:105:      const sessionId = 'complete-test-session';
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:108:      insertWorkingMemory(sessionId, 1, 0.9);
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:109:      insertWorkingMemory(sessionId, 2, 0.7);
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:110:      insertWorkingMemory(sessionId, 3, 0.5);
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:112:      const countBefore = countWorkingMemory(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:116:      sm.saveSessionState(sessionId, { currentTask: 'testing' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:119:      const result = sm.completeSession(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:123:      const countAfter = countWorkingMemory(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:127:      getTestDb().prepare('DELETE FROM working_memory WHERE session_id = ?').run(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:128:      getTestDb().prepare('DELETE FROM session_state WHERE session_id = ?').run(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:134:      const sessionId = 'clear-test-session';
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:137:      insertWorkingMemory(sessionId, 4, 0.8);
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:138:      insertWorkingMemory(sessionId, 5, 0.6);
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:140:      const countBefore = countWorkingMemory(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:147:      `).run(sessionId, 'test-hash-123', 4);
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:150:      const result = sm.clearSession(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:154:      const countAfter = countWorkingMemory(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:160:      ).get(sessionId) as { count: number };
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:164:      getTestDb().prepare('DELETE FROM working_memory WHERE session_id = ?').run(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:165:      getTestDb().prepare('DELETE FROM session_sent_memories WHERE session_id = ?').run(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:92:  sessionId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:102:  sessionId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:110:  sessionId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:227:function getOrCreateSession(sessionId: string | null = null): string {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:228:  if (sessionId) return sessionId;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:236:function clearSession(sessionId: string): number {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:243:    ) as Database.Statement).run(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:244:    sessionModeRegistry.delete(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:279:function getWorkingMemory(sessionId: string): WorkingMemoryEntry[] {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:289:    `) as Database.Statement).all(sessionId) as WorkingMemoryEntry[];
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:297:function getSessionMemories(sessionId: string): Array<Record<string, unknown>> {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:308:    `) as Database.Statement).all(sessionId) as Array<Record<string, unknown>>;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:316:function sessionExists(sessionId: string): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:317:  return getLatestSessionEventCounter(sessionId) !== null;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:320:function getSessionEventCounter(sessionId: string): number {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:321:  const current = getLatestSessionEventCounter(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:325:function getSessionPromptContext(sessionId: string, floor: number = DECAY_FLOOR, limit: number = 5): SessionPromptContextEntry[] {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:346:    `) as Database.Statement).all(sessionId, safeFloor, safeLimit) as SessionPromptContextEntry[];
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:354:function getSessionInferredMode(sessionId: string): string | null {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:355:  const mode = sessionModeRegistry.get(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:359:function setSessionInferredMode(sessionId: string, mode: string): void {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:360:  const normalizedSessionId = sessionId.trim();
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:382:  sessionId: string,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:392:    const currentEventCounter = nextEventCounter(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:396:    ) as Database.Statement).get(sessionId, memoryId) as { id: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:407:      `) as Database.Statement).run(clampedScore, currentEventCounter, sessionId, memoryId);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:410:      enforceMemoryLimit(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:415:      `) as Database.Statement).run(sessionId, memoryId, clampedScore, currentEventCounter);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:431:    sessionId,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:440:  if (!sessionId || !sourceTool || !sourceCallId || !extractionRuleId) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:447:    const currentEventCounter = nextEventCounter(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:475:      sessionId,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:489:    ) as Database.Statement).get(sessionId, memoryId) as { focus_count?: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:491:      enforceMemoryLimit(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:502:function nextEventCounter(sessionId: string): number {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:505:  const current = getLatestSessionEventCounter(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:519:function enforceMemoryLimit(sessionId: string): number {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:525:    ) as Database.Statement).get(sessionId) as { count: number };
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:539:    `) as Database.Statement).run(sessionId, excess);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:560:function batchUpdateScores(sessionId: string): number {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:564:  if (!isFeatureEnabled('SPECKIT_EVENT_DECAY', sessionId)) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:569:    const currentEventCounter = getCurrentEventCounter(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:575:    `) as Database.Statement).all(sessionId) as Array<{
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:628:function getCurrentEventCounter(sessionId: string): number {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:629:  const current = getLatestSessionEventCounter(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:637:function getLatestSessionEventCounter(sessionId: string): number | null {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:648:    `) as Database.Statement).get(sessionId) as { event_counter?: number | null };
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:678:function getSessionStats(sessionId: string): SessionStats | null {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:693:    `) as Database.Statement).get(sessionId) as {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:704:      sessionId,
.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:794:    it('creates links only for the saved memory scope', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:16:// Timescale: minutes. Operates on session-scoped attention scores only.
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:161:    it('shared_memory_status appears in exactly one layer and is mapped to that layer', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:162:      const matchingLayers = Object.values(LD).filter((layer) => layer.tools.includes('shared_memory_status'));
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:166:      expect(mod.TOOL_LAYER_MAP['shared_memory_status']).toBe(matchingLayers[0].id);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:252:├── working-memory.ts           # Session-scoped activation (410 lines)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:573:**Purpose**: Session-scoped attention tracking with capacity limits
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:594:const sessionId = getOrCreateSession();
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:595:// sessionId = 'wm-lxyz123-abc456'
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:598:setAttentionScore(sessionId, memoryId, 1.0);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:601:const entries = getWorkingMemory(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:605:const memories = getSessionMemories(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:608:const updated = batchUpdateScores(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:612:const stats = getSessionStats(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:613:// stats = { sessionId, totalEntries, avgAttention, maxAttention, minAttention, totalFocusEvents }
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:616:clearSession(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:109:function mockTrustedSession(sessionId: string): void {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:111:    requestedSessionId: sessionId,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:112:    effectiveSessionId: sessionId,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:188:          sessionId: 'session-auto-resume',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:248:  describe('Governed scope forwarding', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:265:    it('forwards governed scope fields through deep-mode search routing', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:270:          tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:271:          userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:272:          agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:276:        'scope-forward-deep'
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:281:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:282:        userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:283:        agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:288:    it('forwards governed scope fields through resume-mode search routing', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:293:          tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:294:          userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:295:          agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:299:        'scope-forward-resume'
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:303:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:304:        userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:305:        agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:516:    it('T027k: missing sessionId generates ephemeral UUID scope', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:534:    it('T027ka: rejects caller sessionId when it is not server-managed', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:540:          sessionId: 'session-new',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:557:        'Retry without sessionId to let the server mint a trusted session, then reuse the returned effectiveSessionId.'
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:577:          sessionId: 'session-abc',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:626:          sessionId: 'session-trace',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:656:          sessionId: 'session-known',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:691:          sessionId: 'session-default-on',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:722:          sessionId: 'session-opt-out',
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts:31: * @param identity - Unique identity string (e.g., flagName, userId)
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:278:  it('creates save-path optimization indexes for canonical-path and scoped hash lookups', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:286:        AND name IN ('idx_save_parent_content_hash_scope', 'idx_save_parent_canonical_path')
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:297:        name: 'idx_save_parent_content_hash_scope',
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:305:    expect(indexes[1]?.sql).toContain('shared_space_id');
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:44:  sessionId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:63:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:191:      event.sessionId ?? null
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:257:    if (opts.sessionId !== undefined) {
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:259:      params.push(opts.sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts:41:          shared_space_id TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts:58:        CREATE INDEX idx_save_parent_content_hash_scope
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts:67:            shared_space_id,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:37:  'shared_spaces',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:38:  'shared_space_members',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:39:  'shared_space_conflicts',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:216:      shared_space_id,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:264:      shared_space_id,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:363:      id, action, decision, memory_id, logical_key, tenant_id, user_id, agent_id, session_id, shared_space_id, reason, metadata, created_at
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:365:  `).run(1, 'scope_check', 'allow', 1, 'specs/022-hybrid-rag-fusion::/tmp/specs/022/alpha.md::_', 'tenant-a', 'user-a', 'agent-a', 'sess-1', 'space-1', 'seed governance', '{"phase":"seed"}', later);
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:368:    INSERT INTO shared_spaces (space_id, tenant_id, name, rollout_enabled, rollout_cohort, kill_switch, metadata, created_at, updated_at)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:373:    INSERT INTO shared_space_members (space_id, subject_type, subject_id, role, created_at, updated_at)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:378:    INSERT INTO shared_space_conflicts (
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:157:      shared_space_id TEXT
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:188:    CREATE TABLE IF NOT EXISTS shared_spaces (
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:487:        name: 'scoped-edge-snapshot',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:494:      ).get('scoped-edge-snapshot') as { memory_snapshot: Buffer } | undefined);
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:504:      mod.deleteCheckpoint('scoped-edge-snapshot');
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:507:    it('T503-12: scoped clearExisting restore preserves other spec data and unrelated edges', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:509:        name: 'scoped-edge-restore',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:524:      const result = mod.restoreCheckpoint('scoped-edge-restore', true);
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:546:      mod.deleteCheckpoint('scoped-edge-restore');
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:549:    it('T503-13: scoped merge restore replaces stale in-folder edges without touching unrelated ones', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:551:        name: 'scoped-edge-merge-restore',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:562:      const result = mod.restoreCheckpoint('scoped-edge-merge-restore', false);
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:578:      mod.deleteCheckpoint('scoped-edge-merge-restore');
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:602:    it('T503-14: scoped merge restore only replaces auxiliary rows inside the checkpoint scope', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:608:          id, spec_folder, file_path, title, created_at, updated_at, importance_tier, shared_space_id
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:613:          id, spec_folder, file_path, title, created_at, updated_at, importance_tier, shared_space_id
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:618:        INSERT INTO shared_spaces (space_id, tenant_id, name, created_at, updated_at)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:637:        name: 'scoped-aux-merge-restore',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:642:      database.prepare('UPDATE shared_spaces SET name = ? WHERE space_id = ?').run('Space A Live', 'space-a');
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:643:      database.prepare('UPDATE shared_spaces SET name = ? WHERE space_id = ?').run('Space B Live', 'space-b');
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:660:      const result = mod.restoreCheckpoint('scoped-aux-merge-restore', false);
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:665:        database.prepare('SELECT name FROM shared_spaces WHERE space_id = ?').get('space-a')
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:668:        database.prepare('SELECT name FROM shared_spaces WHERE space_id = ?').get('space-b')
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:690:    it('T503-15: unscoped merge restore preserves auxiliary rows outside the checkpoint snapshot', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:696:          id, spec_folder, file_path, title, created_at, updated_at, importance_tier, shared_space_id
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:700:        INSERT INTO shared_spaces (space_id, tenant_id, name, created_at, updated_at)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:721:      database.prepare('UPDATE shared_spaces SET name = ? WHERE space_id = ?').run('Space A Live', 'space-a');
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:730:        INSERT INTO shared_spaces (space_id, tenant_id, name, created_at, updated_at)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:753:        database.prepare('SELECT name FROM shared_spaces WHERE space_id = ?').get('space-a')
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:756:        database.prepare('SELECT name FROM shared_spaces WHERE space_id = ?').get('space-extra')
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:784:          id, spec_folder, file_path, title, created_at, updated_at, importance_tier, shared_space_id
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:788:        INSERT INTO shared_spaces (space_id, tenant_id, name, created_at, updated_at)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:793:        name: 'scoped-rollback-restore',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:798:      database.prepare('UPDATE shared_spaces SET name = ? WHERE space_id = ?').run('Space A Live', 'space-a');
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:799:      updateCheckpointSnapshot(database, 'scoped-rollback-restore', (snapshot) => {
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:800:        const table = snapshot.tables?.shared_spaces;
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:811:      const result = mod.restoreCheckpoint('scoped-rollback-restore', false);
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:814:      expect(result.rolledBackTables).toContain('shared_spaces');
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:815:      expect(result.errors.some((error) => error.includes('shared_spaces: merge restore rolled back'))).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:817:        database.prepare('SELECT name FROM shared_spaces WHERE space_id = ?').get('space-a')
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:820:        (database.prepare('SELECT COUNT(*) as cnt FROM shared_spaces WHERE space_id = ?').get('space-a') as { cnt: number }).cnt
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:824:    it('T503-17: scoped clearExisting restore preserves same-folder rows outside the tenant scope', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:831:        name: 'scoped-tenant-clear-restore',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:833:        scope: { tenantId: 'tenant-a' },
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:839:      const result = mod.restoreCheckpoint('scoped-tenant-clear-restore', true, {
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:840:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:858:    it('T503-18: unscoped clearExisting restore still replaces the whole checkpoint folder', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:865:        name: 'unscoped-folder-clear-restore',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:872:      const result = mod.restoreCheckpoint('unscoped-folder-clear-restore', true);
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:895:    it('T503-19: scoped merge restore respects tenant scope for memory-linked and direct-scope rows', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:902:        name: 'scoped-tenant-merge-restore',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:904:        scope: { tenantId: 'tenant-a' },
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:910:      const result = mod.restoreCheckpoint('scoped-tenant-merge-restore', false, {
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:911:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:55:function evictStale(sessionId: string): void {
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:56:  const entries = sessionQueries.get(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:61:    sessionQueries.delete(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:64:    sessionQueries.set(sessionId, fresh.slice(-MAX_QUERIES_PER_SESSION));
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:101:  sessionId: string,
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:105:  const entries = sessionQueries.get(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:151: * @param sessionId - Session identifier (null = skip tracking)
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:159:  sessionId: string | null,
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:165:  if (!sessionId) return null;
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:172:  evictStale(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:175:  const detection = detectFlow(sessionId, tokens, timestamp);
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:178:  const entries = sessionQueries.get(sessionId) ?? [];
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:180:  sessionQueries.set(sessionId, entries.slice(-MAX_QUERIES_PER_SESSION));
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:192:        sessionId,
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:207:  sessionId: string | null,
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:222:      sessionId: sessionId ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:233:  sessionId: string | null,
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:236:  if (!sessionId) return;
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:238:  const entries = sessionQueries.get(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:255:      sessionId,
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:263:export function clearSession(sessionId: string): void {
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:264:  sessionQueries.delete(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:270:export function getSessionQueryCount(sessionId: string): number {
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:271:  return sessionQueries.get(sessionId)?.length ?? 0;
.opencode/skill/system-spec-kit/mcp_server/tests/session-state.vitest.ts:88:    expect(session.sessionId).toBe('sess-1');
.opencode/skill/system-spec-kit/mcp_server/tests/session-state.vitest.ts:502:    expect(session.sessionId).toBe('singleton-test');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:80:function insertSentRow(sessionId: string, hash: string, memoryId: number | null, sentAt: string): void {
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:83:  ).run(sessionId, hash, memoryId, sentAt);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:232:    it('returns failure for empty sessionId', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:264:    it('empty sessionId returns zeros', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:275:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:296:    it('rejects scope mismatches for bound sessions', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:300:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:301:        userId: 'user-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:304:      const result = sm.resolveTrustedSession('bound-session', { tenantId: 'tenant-b', userId: 'user-a' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:307:      expect(result.error).toContain('different tenantId');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:314:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:318:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:319:        userId: 'user-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:323:      expect(result.error).toContain('different userId');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:334:    it('generates a server session when caller omits sessionId', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:400:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:401:        userId: 'user-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:402:        agentId: 'agent-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:430:    it('rejects empty sessionId', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:449:    it('fails for empty sessionId', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:493:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:506:        expect(state.sessionId).toBe('recover-1');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:509:        expect(state.tenantId).toBe('tenant-a');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:529:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:530:        userId: 'user-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:533:      const r = sm.recoverState('recover-bound', { tenantId: 'tenant-b', userId: 'user-a' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:536:      expect(r.error).toContain('different tenantId');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:539:    it('rejects empty sessionId', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:551:      sm.saveSessionState('int-1', { specFolder: 'specs/A', currentTask: 'task A', tenantId: 'tenant-a' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:552:      sm.saveSessionState('int-2', { specFolder: 'specs/B', currentTask: 'task B', tenantId: 'tenant-a' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:560:        const ids = r.sessions.map((s: InterruptedSession) => s.sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:564:        const s1 = r.sessions.find((s: InterruptedSession) => s.sessionId === 'int-1');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:569:    it('filters interrupted sessions by bound identity when caller scope is provided', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:571:      sm.saveSessionState('int-scope-a', { currentTask: 'task A', tenantId: 'tenant-a', userId: 'user-a' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:572:      sm.saveSessionState('int-scope-b', { currentTask: 'task B', tenantId: 'tenant-b', userId: 'user-b' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:576:      const r = sm.getInterruptedSessions({ tenantId: 'tenant-a', userId: 'user-a' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:577:      const ids = r.sessions.map((session: InterruptedSession) => session.sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:579:      expect(ids).toContain('int-scope-a');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:581:      expect(ids).not.toContain('int-scope-b');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:598:        sessionId: 'gen-md-1',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:619:      // Minimal input (only sessionId required)
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:620:      const md = sm.generateContinueSessionMd({ sessionId: 'gen-md-2' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:625:      // Without specFolder, should use sessionId-based resume command
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:60:| **Content Parsing** | Memory file parsing, trigger matching (with CORRECTION/PREFERENCE signals) and entity scope detection |
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:292:│   └── scope-governance.ts     # Hierarchical scope enforcement and governed ingest
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:433:**Working Memory**: Manages session-scoped memory activation
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-quality-filter.vitest.ts:127:      sessionId: 'session-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-quality-filter.vitest.ts:160:      sessionId: undefined,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:29:    tenantId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:30:    userId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:31:    agentId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:32:    sessionId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:55:      shared_space_id
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:66:    params.tenantId ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:67:    params.userId ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:68:    params.agentId ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:69:    params.sessionId ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:163:  it('derives distinct logical keys for memories that only differ by tenant scope', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:164:    const filePath = '/tmp/specs/015-memory-state/memory/scoped-tenant.md';
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:171:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:179:      tenantId: 'tenant-b',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:184:      actor: 'ops:tenant-scope',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:189:      actor: 'ops:tenant-scope',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:194:    expect(tenantA.logicalKey).toContain('scope-sha256:');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:195:    expect(tenantB.logicalKey).toContain('scope-sha256:');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:205:  it('derives distinct logical keys for memories that only differ by user scope', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:206:    const filePath = '/tmp/specs/015-memory-state/memory/scoped-user.md';
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:213:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:214:      userId: 'user-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:222:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:223:      userId: 'user-b',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:228:      actor: 'ops:user-scope',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:233:      actor: 'ops:user-scope',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:242:  it('preserves the legacy logical key format for unscoped memories', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:243:    const filePath = '/tmp/specs/015-memory-state/memory/unscoped.md';
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:248:      title: 'Unscoped v1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:254:      actor: 'ops:unscoped-compat',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:258:    expect(recorded.logicalKey).toBe('specs/015-memory-state::/tmp/specs/015-memory-state/memory/unscoped.md::_');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:97:  filterSearchResults: vi.fn((_sessionId: string, results: unknown[]) => ({
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:139:      sessionId: 'sess-ux-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:180:  it('rejects continuation cursors when the resuming scope does not match the original query scope', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:183:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:184:      userId: 'user-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:192:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:193:      userId: 'user-b',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:198:    expect(resumedEnvelope.summary).toBe('Error: Cursor is invalid, expired, or out of scope');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:199:    expect(resumedData.error).toBe('Cursor is invalid, expired, or out of scope');
.opencode/skill/system-spec-kit/mcp_server/tests/fixtures/contradiction-pairs.json:43:      "category": "scope-conflict"
.opencode/skill/system-spec-kit/mcp_server/tests/fixtures/contradiction-pairs.json:91:      "category": "scope-exception"
.opencode/skill/system-spec-kit/mcp_server/tests/fixtures/contradiction-pairs.json:104:      "scope-conflict": "All vs some/none scope conflicts",
.opencode/skill/system-spec-kit/mcp_server/tests/fixtures/contradiction-pairs.json:110:      "scope-exception": "General rule vs specific exception",
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:29:    sessionId?: unknown;
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:129:    expect(t.architecture.scopeDimensionsTracked).toBe(5);
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:302:      scopeDimensionsTracked: 5,
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:311:    expect((json as { architecture?: { phase?: string; scopeDimensionsTracked?: number; capabilities?: { graphUnified?: boolean } } }).architecture?.phase).toBe('graph');
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:312:    expect((json as { architecture?: { phase?: string; scopeDimensionsTracked?: number; capabilities?: { graphUnified?: boolean } } }).architecture?.capabilities?.graphUnified).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:313:    expect((json as { architecture?: { phase?: string; scopeDimensionsTracked?: number; capabilities?: { graphUnified?: boolean } } }).architecture?.scopeDimensionsTracked).toBe(5);
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:380:      scopeDimensionsTracked: 6,
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:386:    expect(t.architecture.scopeDimensionsTracked).toBe(6);
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:395:      sessionId: 'session-secret',
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:419:    expect(tracePayload.sessionId).toBeUndefined();
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:36:    sessionId: 'sess-abc',
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:217:      sessionId: 'session-XYZ',
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:232:    logFeedbackEvent(db, makeEvent({ sessionId: null }));
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:327:  it('filters by sessionId', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:329:    logFeedbackEvent(db, makeEvent({ sessionId: 'sess-1' }));
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:330:    logFeedbackEvent(db, makeEvent({ sessionId: 'sess-2' }));
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:332:    const forSess1 = getFeedbackEvents(db, { sessionId: 'sess-1' });
.opencode/skill/system-spec-kit/mcp_server/tests/memory-roadmap-flags.vitest.ts:63:      scopeEnforcement: true,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-roadmap-flags.vitest.ts:117:  it('tracks all five scope dimensions in roadmap defaults', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-roadmap-flags.vitest.ts:118:    expect(getMemoryRoadmapDefaults().scopeDimensionsTracked).toBe(5);
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:261:  it('stores scope metadata in cursor payloads when provided', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:263:    const cursorInfo = createCursor(results, 5, 'scoped query', { scopeKey: 'tenant:user' });
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:267:    expect(payload?.scopeKey).toBe('tenant:user');
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:373:  it('returns null when cursor scope does not match the resuming caller', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:375:    const cursorInfo = createCursor(results, 5, 'scoped query', { scopeKey: 'tenant-a:user-a' });
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:378:    const resolved = resolveCursor(cursorInfo!.cursor, 5, { scopeKey: 'tenant-b:user-a' });
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:504:  it('passes cursor scope metadata through the progressive response builder', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:507:    const response = buildProgressiveResponse(results, 5, 'scoped progressive response', {
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:508:      scopeKey: 'tenant-a:user-a',
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:512:    const resolved = resolveCursor(response.continuation!.cursor, 5, { scopeKey: 'tenant-a:user-a' });
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:513:    const rejected = resolveCursor(response.continuation!.cursor, 5, { scopeKey: 'tenant-b:user-a' });
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-store-remediation.vitest.ts:93:  it('clears folder-scoped constitutional cache entries for archived and non-archived keys', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-store-remediation.vitest.ts:100:      const specFolder = 'specs/cache-scope';
.opencode/skill/system-spec-kit/mcp_server/tests/fixtures/runtime-fixtures.ts:9:  hookPolicy: 'enabled' | 'disabled_by_scope' | 'unavailable';

codex
I’m at the point where the shape is emerging: Modus looks like it relies on architectural discipline for multi-agent safety, while Spec Kit Memory has explicit runtime scoping and authorization machinery. I’m pulling the exact lines now so I can separate code-enforced guarantees from documentation-only patterns.
exec
/bin/zsh -lc "sed -n '1,220p' \"/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/vault.go\"" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
package vault

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/GetModus/modus-memory/internal/index"
	"github.com/GetModus/modus-memory/internal/markdown"
)

// Vault provides unified access to the entire vault — brain, memory, atlas, missions.
type Vault struct {
	Dir   string
	Index *index.Index
}

// New creates a Vault rooted at the given directory.
func New(dir string, idx *index.Index) *Vault {
	return &Vault{Dir: dir, Index: idx}
}

// Path joins segments onto the vault root.
func (v *Vault) Path(parts ...string) string {
	args := append([]string{v.Dir}, parts...)
	return filepath.Join(args...)
}

// safePath resolves relPath within the vault and rejects traversal attempts.
func (v *Vault) safePath(relPath string) (string, error) {
	abs := filepath.Join(v.Dir, relPath)
	abs, err := filepath.Abs(abs)
	if err != nil {
		return "", fmt.Errorf("invalid path: %w", err)
	}
	root, err := filepath.Abs(v.Dir)
	if err != nil {
		return "", fmt.Errorf("invalid vault root: %w", err)
	}
	if !strings.HasPrefix(abs, root+string(os.PathSeparator)) && abs != root {
		return "", fmt.Errorf("path traversal denied: %s", relPath)
	}
	return abs, nil
}

// Read parses a single markdown file by relative path.
func (v *Vault) Read(relPath string) (*markdown.Document, error) {
	abs, err := v.safePath(relPath)
	if err != nil {
		return nil, err
	}
	return markdown.Parse(abs)
}

// Write creates or overwrites a markdown file with frontmatter + body.
func (v *Vault) Write(relPath string, fm map[string]interface{}, body string) error {
	abs, err := v.safePath(relPath)
	if err != nil {
		return err
	}
	os.MkdirAll(filepath.Dir(abs), 0755)
	return markdown.Write(abs, fm, body)
}

// Filter constrains List results by frontmatter field.
type Filter struct {
	Field   string
	Value   string
	Exclude bool // if true, exclude matches instead of including
}

// List scans a subdirectory for .md files, optionally filtered.
func (v *Vault) List(subdir string, filters ...Filter) ([]*markdown.Document, error) {
	abs, err := v.safePath(subdir)
	if err != nil {
		return nil, err
	}
	dir := abs
	docs, err := markdown.ScanDir(dir)
	if err != nil {
		return nil, err
	}

	if len(filters) == 0 {
		return docs, nil
	}

	var result []*markdown.Document
	for _, doc := range docs {
		match := true
		for _, f := range filters {
			val := doc.Get(f.Field)
			if f.Exclude {
				if strings.EqualFold(val, f.Value) {
					match = false
					break
				}
			} else {
				if !strings.EqualFold(val, f.Value) {
					match = false
					break
				}
			}
		}
		if match {
			result = append(result, doc)
		}
	}
	return result, nil
}

// Search performs full-text search across the index.
// Returns empty results if no index is loaded.
func (v *Vault) Search(query string, limit int) ([]index.SearchResult, error) {
	if v.Index == nil {
		return nil, fmt.Errorf("no search index loaded — run with index enabled")
	}
	return v.Index.Search(query, limit)
}

// Status returns vault-wide statistics.
func (v *Vault) Status() map[string]interface{} {
	counts := make(map[string]int)
	filepath.Walk(v.Dir, func(path string, info os.FileInfo, err error) error {
		if err != nil || info.IsDir() || !strings.HasSuffix(path, ".md") {
			return nil
		}
		rel, _ := filepath.Rel(v.Dir, path)
		parts := strings.SplitN(rel, string(os.PathSeparator), 2)
		counts[parts[0]]++
		return nil
	})

	total := 0
	for _, count := range counts {
		total += count
	}

	indexDocs := 0
	if v.Index != nil {
		indexDocs = v.Index.DocCount()
	}

	result := map[string]interface{}{
		"total_files": total,
		"index_docs":  indexDocs,
		"breakdown":   counts,
	}
	return result
}

// StatusJSON returns Status() as formatted JSON.
func (v *Vault) StatusJSON() (string, error) {
	data, err := json.MarshalIndent(v.Status(), "", "  ")
	return string(data), err
}

exec
/bin/zsh -lc "sed -n '1,180p' \"/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/writer.go\"" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "sed -n '1,220p' \"/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go\"" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "sed -n '1,240p' \"/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md\"" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

```yaml
# Agent role definition
name: librarian
model: gemma4:26b
tools: [vault_search, vault_read, vault_write, vault_list, memory_store, memory_search]
```

## Example: Retrieval Flow

**User asks the cloud model:** "What did we decide about the auth refactor?"

**Cloud model delegates to Librarian:** "Search vault for decisions about auth refactor"

**Librarian runs:**
1. `vault_search("auth refactor decision")` — BM25 with query expansion finds "authentication," "OAuth," "session tokens"
2. Gets 12 results, filters by FSRS retrievability (drops 4 stale entries)
3. Deduplicates (2 entries say the same thing)
4. Returns compressed context: 6 relevant facts, ~800 tokens

**Cloud model receives:** Clean, high-signal context. Reasons over it. Responds to user.

**Total cloud tokens spent on memory:** ~800 instead of ~8,000.

## Example: Storage Flow

**Cloud model produces analysis:** 2,000 words on microservice trade-offs.

**Cloud model delegates to Librarian:** "File this analysis in the vault"

**Librarian runs:**
1. Checks for existing entries on "microservice architecture" — finds 2
2. Merges new insights with existing entries rather than duplicating
3. Writes updated document with proper frontmatter, tags, importance: high
4. Stores 3 new memory facts (subject/predicate/value) for quick retrieval
5. Confirms: "Filed. Updated 1 document, added 3 facts."

**Result:** One clean, deduplicated entry instead of scattered fragments.

## Design Principles

1. **Single writer.** One model owns all writes. No conflicts, no inconsistency.
2. **Small model, focused job.** The Librarian doesn't need to be smart. It needs to be reliable.
3. **Compress before crossing the boundary.** Every token that crosses from local to cloud costs money. Minimize.
4. **Plain files as ground truth.** Markdown + YAML frontmatter. Readable, greppable, git-friendly. No proprietary format.
5. **Decay is a feature.** FSRS ensures old noise fades while important memories strengthen. The Librarian doesn't hoard — it curates.

---

The Librarian pattern turns modus-memory from a storage layer into a complete personal memory system. The vault holds the data. The Librarian decides what goes in, what comes out, and what fades away.

Your memory. Your machine. Your archivist.

exec
/bin/zsh -lc "sed -n '1,140p' \"/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go\"" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "sed -n '120,220p' \"/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go\"" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
		"type": "object",
		"properties": map[string]interface{}{
			"path": map[string]interface{}{"type": "string", "description": "Relative path within vault (e.g. brain/hn/some-file.md)"},
		},
		"required": []string{"path"},
	}, func(args map[string]interface{}) (string, error) {
		relPath, _ := args["path"].(string)
		doc, err := v.Read(relPath)
		if err != nil {
			return "", err
		}

		var sb strings.Builder
		for k, val := range doc.Frontmatter {
			sb.WriteString(fmt.Sprintf("%s: %v\n", k, val))
		}
		sb.WriteString("\n")
		sb.WriteString(doc.Body)
		return sb.String(), nil
	})

	// --- Write ---

	srv.AddTool("vault_write", "Write a vault file (frontmatter + body).", map[string]interface{}{
		"type": "object",
		"properties": map[string]interface{}{
			"path":        map[string]interface{}{"type": "string", "description": "Relative path within vault"},
			"frontmatter": map[string]interface{}{"type": "object", "description": "YAML frontmatter fields"},
			"body":        map[string]interface{}{"type": "string", "description": "Markdown body"},
		},
		"required": []string{"path", "body"},
	}, func(args map[string]interface{}) (string, error) {
		relPath, _ := args["path"].(string)
		body, _ := args["body"].(string)
		fm := make(map[string]interface{})
		if fmRaw, ok := args["frontmatter"].(map[string]interface{}); ok {
			fm = fmRaw
		}
		if err := v.Write(relPath, fm, body); err != nil {
			return "", err
		}
		return fmt.Sprintf("Written: %s", relPath), nil
	})

	// --- List ---

	srv.AddTool("vault_list", "List vault files in a subdirectory, optionally filtered.", map[string]interface{}{
		"type": "object",
		"properties": map[string]interface{}{
			"subdir":  map[string]interface{}{"type": "string", "description": "Subdirectory to list (e.g. brain/hn, memory/facts)"},
			"field":   map[string]interface{}{"type": "string", "description": "Filter by frontmatter field"},
			"value":   map[string]interface{}{"type": "string", "description": "Required value for field"},
			"exclude": map[string]interface{}{"type": "boolean", "description": "If true, exclude matches instead of including"},
			"limit":   map[string]interface{}{"type": "integer", "description": "Max results (default 50)"},
		},
		"required": []string{"subdir"},
	}, func(args map[string]interface{}) (string, error) {
		subdir, _ := args["subdir"].(string)
		limit := 50
		if l, ok := args["limit"].(float64); ok {
			limit = int(l)
		}

		var filters []vault.Filter
		if field, ok := args["field"].(string); ok && field != "" {
			val, _ := args["value"].(string)
			exclude, _ := args["exclude"].(bool)
			filters = append(filters, vault.Filter{Field: field, Value: val, Exclude: exclude})
		}

		docs, err := v.List(subdir, filters...)
		if err != nil {
			return "", err
		}

		var sb strings.Builder
		count := 0
		for _, doc := range docs {
			if count >= limit {
				break
			}
			rel, _ := filepath.Rel(v.Dir, doc.Path)
			title := doc.Get("title")
			if title == "" {
				title = doc.Get("name")
			}
			if title == "" {
				title = doc.Get("subject")
			}
			if title != "" {
				sb.WriteString(fmt.Sprintf("- %s (%s)\n", title, rel))
			} else {
				sb.WriteString(fmt.Sprintf("- %s\n", rel))
			}
			count++
		}
		return fmt.Sprintf("%d files:\n\n%s", count, sb.String()), nil
	})

	// --- Status ---


exec
/bin/zsh -lc "sed -n '260,340p' \"/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go\"" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "sed -n '360,430p' \"/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go\"" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

		links := doc.WikiLinks()
		if len(links) > 0 {
			sb.WriteString("\n\n## Resolved Links\n")
			for _, link := range links {
				resolved := v.ResolveWikiLink(link)
				if resolved != "" {
					sb.WriteString(fmt.Sprintf("- [[%s]] → %s\n", link, resolved))
				} else {
					sb.WriteString(fmt.Sprintf("- [[%s]] → (not found)\n", link))

exec
/bin/zsh -lc "sed -n '1,120p' \"/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go\"" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Scope Governance
// ───────────────────────────────────────────────────────────────
// Hierarchical scope enforcement, governed ingest validation,
// provenance normalization, and governance audit persistence.
import type Database from 'better-sqlite3';

import { ensureGovernanceTables, ensureSharedSpaceTables } from '../search/vector-index-schema.js';

// Feature catalog: Hierarchical scope governance, governed ingest, retention, and audit


/**
 * Retention modes applied during governed ingest.
 */
export type RetentionPolicy = 'keep' | 'ephemeral' | 'shared';

/**
 * Request scope used to enforce tenancy, actor, session, and shared-space boundaries.
 */
export interface ScopeContext {
  tenantId?: string;
  userId?: string;
  agentId?: string;
  sessionId?: string;
  sharedSpaceId?: string;
}

/**
 * Governed-ingest fields required to persist scope and retention metadata.
 */
export interface GovernedIngestInput extends ScopeContext {
  provenanceSource?: string;
  provenanceActor?: string;
  governedAt?: string;
  retentionPolicy?: RetentionPolicy;
  deleteAfter?: string;
}

/**
 * Result of governed-ingest validation and field normalization.
 */
// R5: Simplified normalized type — previously a complex intersection.
export interface GovernanceNormalized {
  tenantId?: string | null;
  userId?: string | null;
  agentId?: string | null;
  sessionId?: string | null;
  sharedSpaceId?: string | null;
  provenanceSource: string | null;
  provenanceActor: string | null;
  governedAt: string;
  retentionPolicy: RetentionPolicy;
  deleteAfter: string | null;
}

export interface GovernanceDecision {
  allowed: boolean;
  normalized: GovernanceNormalized;
  reason?: string;
  issues: string[];
}

/**
 * Audit payload written for allow, deny, delete, and conflict events.
 */
export interface GovernanceAuditEntry extends ScopeContext {
  action: string;
  decision: 'allow' | 'deny' | 'delete' | 'conflict';
  memoryId?: number | null;
  logicalKey?: string | null;
  reason?: string | null;
  metadata?: Record<string, unknown> | null;
}

/**
 * Filters used to review governance audit history.
 */
export interface GovernanceAuditReviewFilters extends ScopeContext {
  action?: string;
  decision?: GovernanceAuditEntry['decision'];
  limit?: number;
  allowUnscoped?: boolean;
}

/**
 * Parsed governance audit row returned for review workflows.
 */
export interface GovernanceAuditReviewRow extends ScopeContext {
  id: number;
  action: string;
  decision: GovernanceAuditEntry['decision'];
  memoryId: number | null;
  logicalKey: string | null;
  reason: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

/**
 * Aggregate view of governance audit activity for a filtered review.
 */
export interface GovernanceAuditReviewSummary {
  totalMatching: number;
  returnedRows: number;
  byAction: Record<string, number>;
  byDecision: Partial<Record<GovernanceAuditEntry['decision'], number>>;
  latestCreatedAt: string | null;
}

/**
 * Combined governance audit review rows and summary.
 */
export interface GovernanceAuditReviewResult {
  rows: GovernanceAuditReviewRow[];
  summary: GovernanceAuditReviewSummary;
}

/**
 * Options used when benchmarking scope-filter behavior.
 */
export interface ScopeFilterBenchmarkOptions {
  iterations?: number;
  allowedSharedSpaceIds?: ReadonlySet<string>;
}

/**
 * Benchmark result for a scope filter predicate.
 */
export interface ScopeFilterBenchmarkResult {
  iterations: number;
  totalRows: number;
  matchedRows: number;
  filteredRows: number;
  elapsedMs: number;
  averageMsPerIteration: number;
}

function normalizeId(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function normalizeIsoTimestamp(value: unknown): string | undefined {
  if (typeof value !== 'string' || value.trim().length === 0) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
}

/**
 * Trim and normalize optional scope identifiers before enforcement.
 *
 * @param input - Scope values supplied by the caller.
 * @returns Scope with blank identifiers removed.
 */
export function normalizeScopeContext(input: ScopeContext): ScopeContext {
  return {
    tenantId: normalizeId(input.tenantId),
    userId: normalizeId(input.userId),
    agentId: normalizeId(input.agentId),
    sessionId: normalizeId(input.sessionId),
    sharedSpaceId: normalizeId(input.sharedSpaceId),
  };
}

/**
 * Resolve whether scope filtering is active for the current process.
 * Default: OFF — scope enforcement is opt-in via SPECKIT_MEMORY_SCOPE_ENFORCEMENT=true.
 * When enabled without scope constraints in the query, all results are rejected
 * (empty scope + enforcement = no access). Only enable when multi-tenant governance
 * is configured with tenantId/userId/agentId/sharedSpaceId in queries.
 *
 * @returns `true` when scope enforcement is enabled.
 */
export function isScopeEnforcementEnabled(): boolean {
  const flagValue = process.env.SPECKIT_MEMORY_SCOPE_ENFORCEMENT?.trim().toLowerCase()
    ?? process.env.SPECKIT_HYDRA_SCOPE_ENFORCEMENT?.trim().toLowerCase();
  return flagValue === 'true' || flagValue === '1';
}

/**
 * Resolve whether governance guardrails are active for the current process.
 * Default: OFF — governance guardrails are opt-in via SPECKIT_MEMORY_GOVERNANCE_GUARDRAILS=true.
 *
 * @returns `true` when governance guardrails are enabled.
 */
export function isGovernanceGuardrailsEnabled(): boolean {
  const flagValue = process.env.SPECKIT_MEMORY_GOVERNANCE_GUARDRAILS?.trim().toLowerCase()
    ?? process.env.SPECKIT_HYDRA_GOVERNANCE_GUARDRAILS?.trim().toLowerCase();
  return flagValue === 'true' || flagValue === '1';
}

/**
 * Determine whether an ingest request must pass governed-ingest validation.
 *
 * @param input - Candidate ingest metadata.
 * @returns `true` when governance or scope metadata requires enforcement.
 */
export function requiresGovernedIngest(input: GovernedIngestInput): boolean {
  const scope = normalizeScopeContext(input);
  return Object.values(scope).some((value) => typeof value === 'string')
    || typeof input.provenanceSource === 'string'
    || typeof input.provenanceActor === 'string'
    || typeof input.governedAt === 'string'
    || input.retentionPolicy === 'ephemeral'
    || input.retentionPolicy === 'shared'
    || typeof input.deleteAfter === 'string';
}

/**
 * Validate governed-ingest metadata and return normalized persistence fields.
 *
 * @param input - Candidate ingest metadata.
 * @returns Validation result with normalized scope, provenance, and retention data.
 */
export function validateGovernedIngest(input: GovernedIngestInput): GovernanceDecision {
  const scope = normalizeScopeContext(input);
  const issues: string[] = [];
  const governedAt = normalizeIsoTimestamp(input.governedAt) ?? new Date().toISOString();
  const deleteAfter = normalizeIsoTimestamp(input.deleteAfter) ?? null;
  const retentionPolicy: RetentionPolicy = input.retentionPolicy === 'ephemeral' || input.retentionPolicy === 'shared'
    ? input.retentionPolicy
    : 'keep';
  const provenanceSource = normalizeId(input.provenanceSource) ?? '';
  const provenanceActor = normalizeId(input.provenanceActor) ?? '';

  if (!requiresGovernedIngest(input)) {
    // B8: Return null instead of empty string for optional scope fields
    // when governance is not required, to avoid persisting false-y placeholders.
    return {
      allowed: true,
      normalized: {
        tenantId: scope.tenantId || null,
        userId: scope.userId || null,
        agentId: scope.agentId || null,
        sessionId: scope.sessionId || null,
        sharedSpaceId: scope.sharedSpaceId || null,
        provenanceSource: provenanceSource || null,
        provenanceActor: provenanceActor || null,
        governedAt,
        retentionPolicy,
        deleteAfter,
      },
      issues,
    };
  }

  if (!scope.tenantId) issues.push('tenantId is required for governed ingest');
  if (!scope.sessionId) issues.push('sessionId is required for governed ingest');
  if (!scope.userId && !scope.agentId) issues.push('userId or agentId is required for governed ingest');
  if (!provenanceSource) issues.push('provenanceSource is required for governed ingest');
  if (!provenanceActor) issues.push('provenanceActor is required for governed ingest');
  if (deleteAfter && new Date(deleteAfter).getTime() <= new Date(governedAt).getTime()) {
    issues.push('deleteAfter must be later than governedAt');
  }
  // H21 FIX: Require valid future deleteAfter for ephemeral retention policy
  // Without this, ephemeral rows are never swept since sweeps key off delete_after
  if (retentionPolicy === 'ephemeral' && !deleteAfter) {

exec
/bin/zsh -lc 'rg -n "shared_space_upsert|shared_space_membership_set|shared_memory_status|assertSharedSpaceAccess|getAllowedSharedSpaceIds|filterRowsByScope|scopeKey|actorUserId|actorAgentId" .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/mcp_server/lib' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:11:  assertSharedSpaceAccess,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:31:type SharedSpaceAdminTool = 'shared_space_upsert' | 'shared_space_membership_set';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:33:type SharedIdentityTool = SharedAdminTool | 'shared_memory_status';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:37:  actorUserId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:38:  actorAgentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:147:  const userIdProvided = typeof args.actorUserId === 'string';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:148:  const agentIdProvided = typeof args.actorAgentId === 'string';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:149:  const normalizedUserId = typeof args.actorUserId === 'string' ? args.actorUserId.trim() : '';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:150:  const normalizedAgentId = typeof args.actorAgentId === 'string' ? args.actorAgentId.trim() : '';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:164:        hint: 'Provide exactly one non-empty actorUserId or actorAgentId value.',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:177:        hint: 'Send only actorUserId or actorAgentId, not both.',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:190:        hint: 'Provide exactly one caller identity via actorUserId or actorAgentId.',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:317:      return tool === 'shared_space_membership_set'
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:353:        ? 'Create the space first with shared_space_upsert.'
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:374:  tool: 'shared_space_upsert' | 'shared_space_membership_set' | 'shared_memory_status' | 'shared_memory_enable',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:405:function getAllowedSharedSpaceIdsForCaller(
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:454:        tool: 'shared_space_upsert',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:461:      tool: 'shared_space_upsert',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:462:      actorUserId: args.actorUserId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:463:      actorAgentId: args.actorAgentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:483:          const access = assertSharedSpaceAccess(
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:505:              msg: getSharedSpaceAccessErrorMessage('shared_space_upsert', args.spaceId, reason),
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:526:          msg: getSharedSpaceAccessErrorMessage('shared_space_upsert', args.spaceId, reason),
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:598:      return createSharedSpaceAuthError('shared_space_upsert', result.error, result.msg);
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:602:      tool: 'shared_space_upsert',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:621:      'shared_space_upsert',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:645:        tool: 'shared_space_membership_set',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:652:      tool: 'shared_space_membership_set',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:653:      actorUserId: args.actorUserId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:654:      actorAgentId: args.actorAgentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:658:      const access = assertSharedSpaceAccess(
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:687:          'shared_space_membership_set',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:689:          getSharedSpaceAccessErrorMessage('shared_space_membership_set', args.spaceId, reason),
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:720:      tool: 'shared_space_membership_set',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:738:      'shared_space_membership_set',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:756:      tool: 'shared_memory_status',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:757:      actorUserId: args.actorUserId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:758:      actorAgentId: args.actorAgentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:762:      ? getAllowedSharedSpaceIdsForCaller(db, actor, args.tenantId)
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:765:      tool: 'shared_memory_status',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:785:      'shared_memory_status',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:806:      actorUserId: typeof args.actorUserId === 'string' ? args.actorUserId : undefined,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:807:      actorAgentId: typeof args.actorAgentId === 'string' ? args.actorAgentId : undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:86:    tools: ['checkpoint_create', 'checkpoint_list', 'checkpoint_restore', 'checkpoint_delete', 'shared_memory_enable', 'shared_memory_status', 'shared_space_upsert', 'shared_space_membership_set']
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:551:    const resolved = resolveCursor(cursor.trim(), undefined, { scopeKey: progressiveScopeKey });
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1033:          { scopeKey: progressiveScopeKey },
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:56:  assertSharedSpaceAccess,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1165:    const access = assertSharedSpaceAccess(database, {
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:673:export function filterRowsByScope<T extends Record<string, unknown>>(rows: T[], scope: ScopeContext, allowedSharedSpaceIds?: ReadonlySet<string>): T[] {
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:507:export function getAllowedSharedSpaceIds(database: Database.Database, scope: ScopeContext): Set<string> {
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:508:  // B2: Respect the same disable gate as assertSharedSpaceAccess.
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:555:export function assertSharedSpaceAccess(
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:632:  const allowed = getAllowedSharedSpaceIds(database, normalizedScope);
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:50:  scopeKey?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:81:  scopeKey?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:334:    scopeKey: typeof options?.scopeKey === 'string' && options.scopeKey.length > 0
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:335:      ? options.scopeKey
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:368:    typeof payload.scopeKey === 'string'
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:369:    && payload.scopeKey.length > 0
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:370:    && payload.scopeKey !== options?.scopeKey
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:15:import { getAllowedSharedSpaceIds } from '../collab/shared-spaces.js';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:465:  const allowedSharedSpaceIds = getAllowedSharedSpaceIds(database, normalizedScope);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:48:import { filterRowsByScope, isScopeEnforcementEnabled } from '../../governance/scope-governance.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:49:import { getAllowedSharedSpaceIds } from '../../collab/shared-spaces.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:997:      allowedSharedSpaceIds = getAllowedSharedSpaceIds(db, scopeFilter);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:998:      candidates = filterRowsByScope(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1004:      candidates = filterRowsByScope(candidates, scopeFilter);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1055:          ? filterRowsByScope(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1125:                ? filterRowsByScope(resultSet, scopeFilter, allowedSharedSpaceIds)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1180:        ? filterRowsByScope(rawHydeCandidates, scopeFilter, allowedSharedSpaceIds)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1266:              ? filterRowsByScope(contextFilteredSummaryHits, scopeFilter, allowedSharedSpaceIds)

exec
/bin/zsh -lc "sed -n '660,760p' .opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '500,680p' .opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    elapsedMs,
    averageMsPerIteration: elapsedMs / iterations,
  };
}

/**
 * Filter result rows to the tenant, actor, session, and shared-space scope in force.
 *
 * @param rows - Candidate rows that include governance scope columns.
 * @param scope - Requested scope used for filtering.
 * @param allowedSharedSpaceIds - Optional shared-space allowlist for the scope.
 * @returns Rows that remain visible after governance filtering.
 */
export function filterRowsByScope<T extends Record<string, unknown>>(rows: T[], scope: ScopeContext, allowedSharedSpaceIds?: ReadonlySet<string>): T[] {
  return rows.filter(createScopeFilterPredicate(scope, allowedSharedSpaceIds));
}

 succeeded in 0ms:
/**
 * Collect the shared spaces visible to the provided user or agent scope.
 *
 * @param database - Database connection that stores shared-space state.
 * @param scope - Scope used to filter memberships and tenant boundaries.
 * @returns Shared-space identifiers the scope is allowed to see.
 */
export function getAllowedSharedSpaceIds(database: Database.Database, scope: ScopeContext): Set<string> {
  // B2: Respect the same disable gate as assertSharedSpaceAccess.
  if (!isSharedMemoryEnabled(database)) return new Set();
  ensureSharedCollabRuntime(database);
  const normalizedScope = normalizeScopeContext(scope);

  // P0 fix: require tenant context so null scopes cannot enumerate every tenant.
  if (!normalizedScope.tenantId) return new Set();

  const ids = new Set<string>();
  const candidates: Array<[SharedSubjectType, string | undefined]> = [
    ['user', normalizedScope.userId],
    ['agent', normalizedScope.agentId],
  ];

  for (const [subjectType, subjectId] of candidates) {
    if (!subjectId) continue;
    const rows = database.prepare(`
      SELECT m.space_id
      FROM shared_space_members m
      JOIN shared_spaces s ON s.space_id = m.space_id
      WHERE m.subject_type = ?
        AND m.subject_id = ?
        AND s.tenant_id = ?
        AND s.kill_switch = 0
        AND s.rollout_enabled = 1
    `).all(
      subjectType,
      subjectId,
      normalizedScope.tenantId,
    ) as Array<{ space_id: string }>;
    for (const row of rows) {
      ids.add(row.space_id);
    }
  }

  return ids;
}

/**
 * Enforce rollout, tenancy, and membership rules for shared-space access.
 *
 * @param database - Database connection that stores shared-space state.
 * @param scope - Scope requesting shared-space access.
 * @param spaceId - Shared-space identifier to validate.
 * @param requiredRole - Minimum role required for the attempted action.
 * @returns Allow or deny decision with a failure reason when blocked.
 */
export function assertSharedSpaceAccess(
  database: Database.Database,
  scope: ScopeContext,
  spaceId: string,
  requiredRole: SharedRole = 'viewer',
): { allowed: boolean; reason?: string } {
  const normalizedScope = normalizeScopeContext(scope);
  const auditAccessDecision = (
    decision: 'allow' | 'deny',
    reason: string,
    metadata?: Record<string, unknown>,
  ): void => {
    try {
      recordGovernanceAudit(database, {
        action: 'shared_space_access',
        decision,
        reason,
        tenantId: normalizedScope.tenantId,
        userId: normalizedScope.userId,
        agentId: normalizedScope.agentId,
        sessionId: normalizedScope.sessionId,
        sharedSpaceId: spaceId,
        metadata: {
          requiredRole,
          ...(metadata ?? {}),
        },
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`[shared-spaces] Failed to record shared_space_access audit: ${message}`);
    }
  };
  const deny = (reason: string, metadata?: Record<string, unknown>): { allowed: false; reason: string } => {
    auditAccessDecision('deny', reason, metadata);
    return { allowed: false, reason };
  };
  const allow = (metadata?: Record<string, unknown>): { allowed: true } => {
    auditAccessDecision('allow', 'membership_verified', metadata);
    return { allowed: true };
  };

  if (!spaceId?.trim()) {
    return deny('shared_space_id_required');
  }

  ensureSharedCollabRuntime(database);

  if (!isSharedMemoryEnabled(database)) {
    return deny('shared_memory_disabled');
  }

  const space = database.prepare(`
    SELECT tenant_id, rollout_enabled, kill_switch
    FROM shared_spaces
    WHERE space_id = ?
  `).get(spaceId) as { tenant_id?: string; rollout_enabled?: number; kill_switch?: number } | undefined;

  if (!space) {
    return deny('shared_space_not_found');
  }
  if (normalizedScope.tenantId && space.tenant_id !== normalizedScope.tenantId) {
    return deny('shared_space_tenant_mismatch', {
      spaceTenantId: space.tenant_id ?? null,
    });
  }
  if (isGovernanceGuardrailsEnabled() && !normalizedScope.tenantId) {
    return deny('shared_space_tenant_required');
  }

  const bypassAvailabilityChecks = requiredRole === 'owner';
  if (!bypassAvailabilityChecks && space.kill_switch === 1) {
    return deny('shared_space_kill_switch');
  }
  if (!bypassAvailabilityChecks && space.rollout_enabled !== 1) {
    return deny('shared_space_rollout_disabled');
  }

  const allowed = getAllowedSharedSpaceIds(database, normalizedScope);
  if (!allowed.has(spaceId) && !bypassAvailabilityChecks) {
    return deny('shared_space_membership_required');
  }

  if (requiredRole === 'viewer') {
    return allow();
  }

  const membership = database.prepare(`
    SELECT role
    FROM shared_space_members
    WHERE space_id = ?
      AND (
        (subject_type = 'user' AND subject_id = ?)
        OR
        (subject_type = 'agent' AND subject_id = ?)
      )
    ORDER BY CASE role
      WHEN 'owner' THEN 1
      WHEN 'editor' THEN 2
      ELSE 3
    END ASC
    LIMIT 1
  `).get(spaceId, normalizedScope.userId ?? '', normalizedScope.agentId ?? '') as { role?: SharedRole } | undefined;

  const role = membership?.role;
  if (!role) {
    return deny('shared_space_membership_required');
  }
  if (requiredRole === 'owner' && role !== 'owner') {
    return deny('shared_space_owner_required', { resolvedRole: role });
  }
  if (requiredRole === 'editor' && role === 'viewer') {
    return deny('shared_space_editor_required', { resolvedRole: role });
  }

  return allow({ resolvedRole: role });
}

/**
 * Record an append-version conflict for shared-memory writes and audit it.
 *
 * @param database - Database connection that stores shared-space state.
 * @param args - Conflict details used for shared and governance audits.
 */
export function recordSharedConflict(
  database: Database.Database,
  args: {

exec
/bin/zsh -lc "sed -n '140,220p' .opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    actor: { subjectType: 'agent', subjectId: configuredAgentId },
  };
}

function validateSharedCallerIdentity(
  args: SharedCallerAuthArgs,
): SharedAdminActor {
  const userIdProvided = typeof args.actorUserId === 'string';
  const agentIdProvided = typeof args.actorAgentId === 'string';
  const normalizedUserId = typeof args.actorUserId === 'string' ? args.actorUserId.trim() : '';
  const normalizedAgentId = typeof args.actorAgentId === 'string' ? args.actorAgentId.trim() : '';
  const hasBlankUser = userIdProvided && normalizedUserId.length === 0;
  const hasBlankAgent = agentIdProvided && normalizedAgentId.length === 0;
  const hasUser = normalizedUserId.length > 0;
  const hasAgent = normalizedAgentId.length > 0;

  if (hasBlankUser || hasBlankAgent) {
    throwSharedMemoryAuthError(
      'Actor identities must be non-empty, non-whitespace strings.',
      createCallerAuthErrorResponse({
        tool: args.tool,
        error: 'Actor identities must be non-empty, non-whitespace strings.',
        code: 'E_VALIDATION',
        reason: 'actor_identity_blank',
        hint: 'Provide exactly one non-empty actorUserId or actorAgentId value.',
      }),
    );
  }

  if (hasUser && hasAgent) {
    throwSharedMemoryAuthError(
      'Provide only one actor identity.',
      createCallerAuthErrorResponse({
        tool: args.tool,
        error: 'Provide only one actor identity.',
        code: 'E_VALIDATION',
        reason: 'actor_identity_ambiguous',
        hint: 'Send only actorUserId or actorAgentId, not both.',
      }),
    );
  }

  if (!hasUser && !hasAgent) {
    throwSharedMemoryAuthError(
      'Caller authentication is required for shared-memory operations.',
      createCallerAuthErrorResponse({
        tool: args.tool,
        error: 'Caller authentication is required for shared-memory operations.',
        code: 'E_AUTHENTICATION',
        reason: 'actor_identity_required',
        hint: 'Provide exactly one caller identity via actorUserId or actorAgentId.',
      }),
    );
  }

  return hasUser
    ? { subjectType: 'user', subjectId: normalizedUserId }
    : { subjectType: 'agent', subjectId: normalizedAgentId };
}

function isTrustedCallerIdentityBindingEnabled(): boolean {
  const value = process.env.SPECKIT_SHARED_MEMORY_TRUST_CALLER_IDENTITY;
  if (typeof value !== 'string') {
    return false;
  }
  return value.trim().toLowerCase() === 'true';
}

export function validateCallerAuth(
  args: SharedAdminCallerAuthArgs,
  tenantId?: string,
): ValidatedCallerAuth {
  const normalizedTenantId = typeof tenantId === 'string' ? tenantId.trim() : '';

  if (args.tool !== 'shared_memory_enable' && normalizedTenantId.length === 0) {
    throwSharedMemoryAuthError(
      'Tenant scope is required for shared-memory admin mutations.',
      createCallerAuthErrorResponse({
        tool: args.tool,
        error: 'Tenant scope is required for shared-memory admin mutations.',
        code: 'E_AUTHORIZATION',

exec
/bin/zsh -lc "sed -n '1140,1195p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    sessionId,
    sharedSpaceId,
    provenanceSource,
    provenanceActor,
    governedAt,
    retentionPolicy,
    deleteAfter,
  });

  if (!governanceDecision.allowed) {
    recordGovernanceAudit(database, {
      action: 'memory_save',
      decision: 'deny',
      tenantId,
      userId,
      agentId,
      sessionId,
      sharedSpaceId,
      reason: governanceDecision.reason ?? 'governance_rejected',
      metadata: { issues: governanceDecision.issues },
    });
    throw new Error(`Governed ingest rejected: ${governanceDecision.issues.join('; ')}`);
  }

  if (sharedSpaceId) {
    const access = assertSharedSpaceAccess(database, {
      tenantId,
      userId,
      agentId,
      sessionId,
      sharedSpaceId,
    }, sharedSpaceId, 'editor');
    if (!access.allowed) {
      recordGovernanceAudit(database, {
        action: 'memory_save_shared_space',
        decision: 'deny',
        tenantId,
        userId,
        agentId,
        sessionId,
        sharedSpaceId,
        reason: access.reason ?? 'shared_space_denied',
      });
      throw new Error(`Shared-memory save denied: ${access.reason ?? 'shared_space_denied'}`);
    }
  }

  // DryRun must remain non-mutating even when preflight is explicitly skipped.
  if (dryRun && skipPreflight) {
    const parsedForDryRun = memoryParser.parseMemoryFile(validatedPath);
    const preparedDryRun = prepareParsedMemoryForIndexing(parsedForDryRun, database, {
      emitEvalMetrics: false,
    });
    const templateContractPass = preparedDryRun.templateContract.valid
      || shouldBypassTemplateContract(
        preparedDryRun.sourceClassification,

exec
/bin/zsh -lc "sed -n '680,760p' .opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  args: {
    spaceId: string;
    logicalKey: string;
    existingMemoryId: number | null;
    incomingMemoryId: number;
    actor: string;
    metadata?: Record<string, unknown>;
  }
): void {
  ensureSharedCollabRuntime(database);
  // Use an IMMEDIATE transaction so concurrent writers cannot observe the same
  // prior conflict count between strategy resolution and the insert/audit write.
  const recordConflictTx = database.transaction(() => {
    const resolved = resolveSharedConflictStrategy(database, args);
    database.prepare(`
      INSERT INTO shared_space_conflicts (
        space_id, logical_key, existing_memory_id, incoming_memory_id, strategy, actor, metadata
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      args.spaceId,
      args.logicalKey,
      args.existingMemoryId,
      args.incomingMemoryId,
      resolved.strategy,
      args.actor,
      resolved.metadata ? JSON.stringify(resolved.metadata) : null,
    );

    recordGovernanceAudit(database, {
      action: 'shared_conflict',
      decision: 'conflict',
      memoryId: args.incomingMemoryId,
      logicalKey: args.logicalKey,
      sharedSpaceId: args.spaceId,
      reason: resolved.strategy,
      metadata: resolved.metadata,
    });
  });
  recordConflictTx.immediate();
}

exec
/bin/zsh -lc 'rg -n "append-version|appendVersion|logicalKey|scope-sha256|conflict" .opencode/skill/system-spec-kit/mcp_server/lib .opencode/skill/system-spec-kit/mcp_server/handlers' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:904:- **Conflicts** — Concurrent edits produce append-version conflicts with automatic escalation to manual merge for repeat or high-risk cases.
.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:42:| `reconsolidation-bridge.ts` | TM-06 reconsolidation bridge. When enabled and a checkpoint exists, delegates to the reconsolidation engine for merge/conflict resolution before falling through to normal creation. |
.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:57:5. reconsolidation -- Merge/conflict handling (TM-06, flag-gated)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:70:- **Reconsolidation** -- Optional merge/conflict resolution pass that requires a pre-reconsolidation checkpoint (TM-06 safety gate).
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:286:                    console.warn(`[memory-save] BM25 indexing failed (recon conflict store): ${message}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:293:                      contextLabel: 'recon conflict store',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:315:          // Reconsolidation handled the memory (merge or conflict) — skip normal CREATE path
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:325:            linkedMemoryIds: reconResult.action === 'conflict'
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:53:- `memory-index-alias.ts`, `memory-index-discovery.ts` - Alias conflict discovery, spec-doc discovery, and constitutional file detection.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:289:  // T-09: Log ALL PE decisions (including low/no-match CREATE) to memory_conflicts
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:327: * Format a conflict record for logging.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:355: * Log a conflict record to the database.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:362:      INSERT INTO memory_conflicts (
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:386: * Get conflict statistics.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:398:      `SELECT COUNT(*) as count FROM memory_conflicts ${folderFilter}`
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:402:      `SELECT action, COUNT(*) as count FROM memory_conflicts ${folderFilter} GROUP BY action`
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:406:      `SELECT COUNT(*) as count FROM memory_conflicts WHERE contradiction_detected = 1 ${specFolder ? 'AND spec_folder = ?' : ''}`
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:410:      `SELECT AVG(similarity) as avg_sim FROM memory_conflicts ${folderFilter}`
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:432: * Get recent conflicts.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:439:      SELECT * FROM memory_conflicts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:36:  conflictType: 'keyword_negation' | 'semantic_opposition';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:86: * negation patterns suggesting conflicting information.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:174:            conflictType: 'keyword_negation',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:228:          conflictType: 'keyword_negation',
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:107:- Purpose: Owns shared-space collaboration primitives: shared-space definitions, membership, rollout flags, conflict tracking, and shared-memory metrics. This is the current home for multi-actor/shared-memory tenancy behavior.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:109:  - `shared-spaces.ts` — shared-space schema/runtime, memberships, conflict summaries, and rollout controls.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:355:  - `reconsolidation.ts` — post-save similarity merge/complement/conflict handling.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:75:    'memory_conflicts',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:84:    'shared_space_conflicts',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:117:  'memory_conflicts',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:126:  'shared_space_conflicts',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:312:  'memory_conflicts', 'memory_corrections', 'memory_lineage', 'memory_history',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:322:  'governance_audit', 'shared_spaces', 'shared_space_members', 'shared_space_conflicts',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:726:  if (tableName === 'shared_space_conflicts') {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:732:            SELECT * FROM shared_space_conflicts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:740:            SELECT * FROM shared_space_conflicts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:750:        'SELECT * FROM shared_space_conflicts WHERE space_id IN (__PLACEHOLDERS__)',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:754:    return hasScope ? [] : database.prepare('SELECT * FROM shared_space_conflicts').all() as Array<Record<string, unknown>>;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:967:  if (tableName === 'shared_space_conflicts') {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md:57:| `reconsolidation.ts` | Similarity-based merge, conflict, or complement routing after saves |
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:676:const summarize_alias_conflicts = summarizeAliasConflicts;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:685:  summarize_alias_conflicts,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:184:- Audit: Logs to `memory_conflicts` table for review
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:248:├── prediction-error-gate.ts    # Duplicate detection & conflict logging (510 lines)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:384:**Purpose**: Prevent duplicate memories with conflict detection
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:425:// Manual conflict logging
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:924:// Check conflict logs
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:926:console.log('Recent conflict decisions:', recent);
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:65: * Audit payload written for allow, deny, delete, and conflict events.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:69:  decision: 'allow' | 'deny' | 'delete' | 'conflict';
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:71:  logicalKey?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:94:  logicalKey: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:344:    entry.logicalKey ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:605:      logicalKey: row.logical_key,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:70:  logicalKey: string;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:97:  logicalKey: string;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:106:  logicalKey: string;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:117:  logicalKey: string;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:147:  logicalKeys: string[];
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:157:  logicalKey: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:225:  return `scope-sha256:${scopeHash}`;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:287:function getActiveProjection(database: Database.Database, logicalKey: string): ActiveProjectionRow | null {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:292:  `).get(logicalKey) as ActiveProjectionRow | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:296:function getLatestLineageRowForLogicalKey(database: Database.Database, logicalKey: string): MemoryLineageRow | null {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:303:  `).get(logicalKey) as MemoryLineageRow | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:311:  const logicalKey = resolveLogicalKey(database, memoryId);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:312:  if (!logicalKey) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:316:  const projection = getActiveProjection(database, logicalKey);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:322:  `).all(logicalKey) as MemoryLineageRow[];
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:324:  return { logicalKey, projection, rows };
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:389:    logicalKey: row.logical_key,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:402:  logicalKey: string,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:412:  ).run(activeMemoryId, logicalKey);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:420:  `).run(logicalKey, rootMemoryId, activeMemoryId, updatedAt);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:555:      logicalKey: existing.logical_key,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:611:  const logicalKey = buildLogicalKey(row);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:635:      logicalKey,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:643:    upsertActiveProjection(database, logicalKey, memoryId, memoryId, normalizeTimestamp(row.updated_at ?? validFrom));
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:649:    logicalKey,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:688:      let logicalKey = rowLogicalKey;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:702:          logicalKey = predecessor.logical_key;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:710:          if (seeded.logicalKey !== rowLogicalKey) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:712:              `E_LINEAGE: predecessor ${predecessorMemoryId} logical identity ${seeded.logicalKey} ` +
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:716:          logicalKey = seeded.logicalKey;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:724:        const latest = getLatestLineageRowForLogicalKey(database, logicalKey);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:765:        logicalKey,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:775:      upsertActiveProjection(database, logicalKey, rootMemoryId, memoryId, validFrom);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:778:        logicalKey,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:796:        `Retrying lineage insert for memory ${memoryId} after logical_key/version_number conflict ` +
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:872:  const { logicalKey, projection, rows } = lineage;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:916:    logicalKey,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1083:    const logicalKey = buildLogicalKey(row);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1084:    const group = groups.get(logicalKey);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1088:      groups.set(logicalKey, [row]);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1092:  const logicalKeys = [...groups.keys()];
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1133:      logicalKeys,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1139:    for (const [logicalKey, group] of groups.entries()) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1178:          logicalKey,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1197:        logicalKey,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1212:    logicalKeys,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1271:      logicalKey: `mock:${params.memoryId}`,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1352:      logicalKey: null,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1385:    logicalKey: lastRecorded?.logicalKey ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:38:export type ReconsolidationAction = 'merge' | 'conflict' | 'complement';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:88:/** Result of a conflict (supersede) operation */
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:90:  action: 'conflict';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:132:/** Threshold above which memories are in conflict (supersede) */
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:183: * @returns The action to take: 'merge', 'conflict', or 'complement'
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:190:    return 'conflict';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:461: * Resolve a conflict between highly similar memories (similarity 0.75-0.88).
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:513:          `TM-06 reconsolidation conflict: similarity ${(existingMemory.similarity * 100).toFixed(1)}%`
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:544:      action: 'conflict',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:601: * 3. Execute the appropriate operation (merge/conflict/complement)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:649:    case 'conflict':
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:651:        let conflictMemory = newMemory;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:653:        // F04-002: Wrap store + conflict in single transaction for atomicity
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:656:          const conflictTx = db.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:657:            if (conflictMemory.id === undefined) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:665:                conflictMemory = { ...newMemory, id: storedId };
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:668:            return executeConflict(topMatch, conflictMemory, db);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:670:          return conflictTx();
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:671:        } catch (conflictErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:674:          if (conflictMemory.id !== undefined && conflictMemory.id !== newMemory.id) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:678:              const deleted = delete_memory_from_database(db, conflictMemory.id);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:682:                    conflictMemory.id!,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:687:                    conflictMemory.specFolder ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:694:            console.warn('[reconsolidation] cleaned up orphan memory', conflictMemory.id, 'after executeConflict failure');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:696:          throw conflictErr;
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:6:// controls, conflict resolution, and collaboration metrics.
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:58: * Aggregate rollout metrics for shared spaces, memberships, and conflicts.
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:83: * Aggregate summary of conflict strategies used in shared spaces.
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:98:// R8: Known conflict strategy union for runtime validation.
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:116:  const value = metadata?.conflictKind;
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:129:    console.warn(`[shared-spaces] Unknown conflict strategy "${normalized}", ignoring explicit override`);
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:139:    logicalKey: string;
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:144:  const conflictKind = normalizeConflictKind(args.metadata);
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:147:    FROM shared_space_conflicts
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:150:  `).get(args.spaceId, args.logicalKey) as { count?: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:154:    ?? (HIGH_RISK_CONFLICT_KINDS.has(conflictKind ?? '')
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:161:    : HIGH_RISK_CONFLICT_KINDS.has(conflictKind ?? '')
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:162:      ? `high_risk:${conflictKind}`
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:164:        ? 'repeat_conflict'
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:236: * @returns Aggregate rollout, membership, and conflict counts.
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:269:  const conflictRow = database.prepare(`
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:271:    FROM shared_space_conflicts c
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:283:    totalConflicts: conflictRow.count,
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:360: * Summarize how shared-space conflicts have been resolved by strategy.
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:375:      COUNT(*) AS total_conflicts,
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:378:    FROM shared_space_conflicts
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:381:    ORDER BY total_conflicts DESC, strategy ASC
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:384:    totalConflicts: (row as { total_conflicts: number }).total_conflicts,
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:673: * Record an append-version conflict for shared-memory writes and audit it.
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:682:    logicalKey: string;
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:691:  // prior conflict count between strategy resolution and the insert/audit write.
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:695:      INSERT INTO shared_space_conflicts (
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:700:      args.logicalKey,
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:709:      action: 'shared_conflict',
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:710:      decision: 'conflict',
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:712:      logicalKey: args.logicalKey,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:39:  contradicts:  0.8,  // Dampened — conflicting signals lower confidence
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:213:      // Check if edge exists (for weight_history logging on conflict update).
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:235:      // T001d: Log weight change on conflict update
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1487:            logicalKey: `${result.specFolder || ''}::${validatedPath}`,
.opencode/skill/system-spec-kit/mcp_server/lib/graph/contradiction-detection.ts:45: * Check whether two relations conflict according to the conflict rules.
.opencode/skill/system-spec-kit/mcp_server/lib/graph/contradiction-detection.ts:66: * 2. Same source+target with conflicting relations (e.g., 'supports' vs 'contradicts')
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:117:/** Build alias conflict buckets from index rows. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:217:    console.warn(`[memory-index-scan] Alias conflict detection skipped: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:422:| `SPECKIT_RECONSOLIDATION` | `false` | Enable similarity-based merge/conflict routing on save (TM-06). Opt in with `SPECKIT_RECONSOLIDATION=true` |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:452:| v4      | FSRS columns (`stability`, `difficulty`, `last_review`, `review_count`) + `memory_conflicts` table + FSRS indexes |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:459:| v12     | Unified `memory_conflicts` DDL: drop and recreate with canonical schema (KL-1) |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:693:Similarity-based merge/conflict/complement routing gated via `SPECKIT_RECONSOLIDATION` (default OFF, opt in with `SPECKIT_RECONSOLIDATION=true`):
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:66:    'DELETE FROM shared_space_conflicts WHERE existing_memory_id = ? OR incoming_memory_id = ?',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:110:  const logicalKey = `${specFolder}::${canonicalFilePath}::${anchorId && anchorId.trim().length > 0 ? anchorId : '_'}`;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:116:  ).run(memoryId, logicalKey);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:124:  `).run(logicalKey, memoryId, memoryId, updatedAt);
.opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts:323:    throw new Error(`State transition conflict: job ${jobId} state was changed by another process (expected '${current.state}')`);
.opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts:411:      if (message.startsWith('State transition conflict:')) {
.opencode/skill/system-spec-kit/mcp_server/lib/graph/README.md:42:- **Contradiction detection** auto-invalidates old edges when superseding or conflicting edges are created.
.opencode/skill/system-spec-kit/mcp_server/lib/graph/README.md:68:  contradiction-detection.ts  # Superseding/conflicting edge detection + auto-invalidation
.opencode/skill/system-spec-kit/mcp_server/lib/graph/README.md:83:| `contradiction-detection.ts` | Detects superseding and conflicting edge relations, auto-invalidates old edges via `temporal-edges.ts` | `SPECKIT_TEMPORAL_EDGES` |
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:260:  const appendVersion = database.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:312:  const nextMemoryId = appendVersion();
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:324:/** Log a prediction-error gating decision to the memory_conflicts table */
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:331:      WHERE type='table' AND name='memory_conflicts'
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:335:      console.warn('[PE-Gate] memory_conflicts table not yet created, skipping log');
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:340:      INSERT INTO memory_conflicts (
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:360:    console.error('[memory-save] Failed to log conflict:', message);
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:197: * Format: "3 strong, 2 weak, 1 conflict" style.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:63:  memory_conflicts: [
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:64:    'idx_conflicts_memory',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:65:    'idx_conflicts_timestamp',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:247:    CREATE TABLE IF NOT EXISTS memory_conflicts (
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:273:    'idx_conflicts_memory',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:274:    'CREATE INDEX IF NOT EXISTS idx_conflicts_memory ON memory_conflicts(existing_memory_id)',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:279:    'idx_conflicts_timestamp',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:280:    'CREATE INDEX IF NOT EXISTS idx_conflicts_timestamp ON memory_conflicts(timestamp DESC)',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:299:  if (!hasTable(database, 'memory_conflicts')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:303:  const columns = new Set(getTableColumns(database, 'memory_conflicts'));
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:308:  if (!hasTable(database, 'memory_conflicts')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:317:  database.exec('ALTER TABLE memory_conflicts RENAME TO memory_conflicts_legacy');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:320:  const legacyColumns = new Set(getTableColumns(database, 'memory_conflicts_legacy'));
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:322:    INSERT INTO memory_conflicts (
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:353:    FROM memory_conflicts_legacy
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:355:  database.exec('DROP TABLE memory_conflicts_legacy');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:358:    throw new Error('Migration v12: memory_conflicts table is still missing unified columns after rebuild');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:413:// V12: Unified memory_conflicts DDL (KL-1 Schema Unification)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:489:      logger.info('Migration v4: Ensured memory_conflicts table');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:683:      // V11 -> v12: Unify memory_conflicts DDL (KL-1 Schema Unification)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:685:      logger.info('Migration v12: Unified memory_conflicts table (KL-1)');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:688:      logger.info('Migration v12: Created memory_conflicts indexes');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1504:    CREATE TABLE IF NOT EXISTS shared_space_conflicts (
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1522:    CREATE INDEX IF NOT EXISTS idx_shared_space_conflicts_space
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1523:      ON shared_space_conflicts(space_id, created_at DESC);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1552:    if (hasTable(database, 'memory_conflicts')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1553:      const existingColumns = new Set(getTableColumns(database, 'memory_conflicts'));
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1556:        missingColumns.memory_conflicts = absentColumns;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1577:    if (!hasTable(database, 'memory_conflicts')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1578:      warnings.push('memory_conflicts table missing; conflict audit trail may be incomplete.');

exec
/bin/zsh -lc "sed -n '150,235p' .opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
      FROM memory_index
      WHERE id = 1
    `).get() as { importance_tier: string };
    expect(predecessorTier.importance_tier).toBe('deprecated');
  });

  it('validates lineage schema support for phase 2 tables', () => {
    const report = validateLineageSchemaSupport(database);
    expect(report.compatible).toBe(true);
    expect(report.missingTables).toEqual([]);
    expect(report.missingColumns).toEqual({});
  });

  it('derives distinct logical keys for memories that only differ by tenant scope', () => {
    const filePath = '/tmp/specs/015-memory-state/memory/scoped-tenant.md';
    insertMemory(database, {
      id: 61,
      specFolder: 'specs/015-memory-state',
      filePath,
      title: 'Tenant A',
      createdAt: '2026-03-13T11:00:00.000Z',
      tenantId: 'tenant-a',
    });
    insertMemory(database, {
      id: 62,
      specFolder: 'specs/015-memory-state',
      filePath,
      title: 'Tenant B',
      createdAt: '2026-03-13T11:05:00.000Z',
      tenantId: 'tenant-b',
    });

    const tenantA = recordLineageVersion(database, {
      memoryId: 61,
      actor: 'ops:tenant-scope',
      effectiveAt: '2026-03-13T11:00:00.000Z',
    });
    const tenantB = recordLineageVersion(database, {
      memoryId: 62,
      actor: 'ops:tenant-scope',
      effectiveAt: '2026-03-13T11:05:00.000Z',
    });

    expect(tenantA.logicalKey).not.toBe(tenantB.logicalKey);
    expect(tenantA.logicalKey).toContain('scope-sha256:');
    expect(tenantB.logicalKey).toContain('scope-sha256:');

    const projectionCount = database.prepare(`
      SELECT COUNT(*) AS total
      FROM active_memory_projection
      WHERE logical_key IN (?, ?)
    `).get(tenantA.logicalKey, tenantB.logicalKey) as { total: number };
    expect(projectionCount.total).toBe(2);
  });

  it('derives distinct logical keys for memories that only differ by user scope', () => {
    const filePath = '/tmp/specs/015-memory-state/memory/scoped-user.md';
    insertMemory(database, {
      id: 71,
      specFolder: 'specs/015-memory-state',
      filePath,
      title: 'User A',
      createdAt: '2026-03-13T12:00:00.000Z',
      tenantId: 'tenant-a',
      userId: 'user-a',
    });
    insertMemory(database, {
      id: 72,
      specFolder: 'specs/015-memory-state',
      filePath,
      title: 'User B',
      createdAt: '2026-03-13T12:05:00.000Z',
      tenantId: 'tenant-a',
      userId: 'user-b',
    });

    const userA = recordLineageVersion(database, {
      memoryId: 71,
      actor: 'ops:user-scope',
      effectiveAt: '2026-03-13T12:00:00.000Z',
    });
    const userB = recordLineageVersion(database, {
      memoryId: 72,
      actor: 'ops:user-scope',
      effectiveAt: '2026-03-13T12:05:00.000Z',
    });

codex
I’ve confirmed one important asymmetry: Modus’s “single writer” story is mostly a discipline pattern layered over plain-file writes, while our system has concrete conflict/audit machinery in the shared-memory path. I’m checking lineage and progressive-disclosure next so I can speak precisely about isolation across tenants/users/agents rather than just “shared memory exists.”
exec
/bin/zsh -lc "sed -n '200,245p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function buildScopePrefix(row: MemoryIndexRow): string | null {
  const scopeTuple = [
    ['tenant', normalizeScopeValue(row.tenant_id)],
    ['user', normalizeScopeValue(row.user_id)],
    ['agent', normalizeScopeValue(row.agent_id)],
    ['session', normalizeScopeValue(row.session_id)],
    ['shared_space', normalizeScopeValue(row.shared_space_id)],
  ].filter((entry): entry is [string, string] => entry[1] != null);

  if (scopeTuple.length === 0) {
    return null;
  }

  const scopeHash = createHash('sha256')
    .update(JSON.stringify(scopeTuple), 'utf8')
    .digest('hex')
    .slice(0, 24);

  return `scope-sha256:${scopeHash}`;
}

function hasLogicalKeySeparatorCollision(...components: string[]): boolean {
  return components.some((component) => component.includes('::'));
}

function buildHashedLogicalKey(parts: {
  specFolder: string;
  scopePrefix: string | null;
  canonicalPath: string;
  anchorId: string;
}): string {
  const payload = JSON.stringify({
    version: 2,
    specFolder: parts.specFolder,
    scopePrefix: parts.scopePrefix,
    canonicalPath: parts.canonicalPath,
    anchorId: parts.anchorId,
  });
  const digest = createHash('sha256')

exec
/bin/zsh -lc "sed -n '520,575p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '300,390p' .opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

 succeeded in 0ms:
 */
function createCursor(
  resultSet: DisclosureResult[],
  pageSize: number = DEFAULT_PAGE_SIZE,
  query: string = '',
  options?: CursorOptions,
): CursorInfo | null {
  if (!Array.isArray(resultSet) || resultSet.length <= pageSize) {
    return null;
  }

  const queryHash = hashQuery(query);
  const now = Date.now();
  const cursorKey = randomUUID();

  pruneExpiredCursorEntries(options?.ttlMs ?? DEFAULT_CURSOR_TTL_MS, now);

  // Store the full result set for later resolution
  cursorStore.set(cursorKey, { results: resultSet, storedAt: now });

  // Evict oldest cursors when exceeding max capacity
  if (cursorStore.size > MAX_CURSORS) {
    const sorted = [...cursorStore.entries()].sort((a, b) => a[1].storedAt - b[1].storedAt);
    const excess = cursorStore.size - MAX_CURSORS;
    for (let i = 0; i < excess; i++) {
      cursorStore.delete(sorted[i][0]);
    }
  }

  const payload: CursorPayload = {
    cursorKey,
    offset: pageSize,
    queryHash,
    timestamp: now,
    scopeKey: typeof options?.scopeKey === 'string' && options.scopeKey.length > 0
      ? options.scopeKey
      : undefined,
  };

  return {
    cursor: encodeCursor(payload),
    remainingCount: resultSet.length - pageSize,
  };
}

/**
 * Resolve a continuation cursor to the next page of results.
 *
 * @param cursor - Opaque cursor token from createCursor.
 * @param pageSize - Number of results to return. Default: 5.
 * @param options - Optional cursor configuration (TTL).
 * @returns Object with next page of results, next cursor (if more), or null if cursor is invalid/expired.
 * @example
 * ```ts
 * const page = resolveCursor(cursor, 5);
 * ```
 */
function resolveCursor(
  cursor: string,
  pageSize: number = DEFAULT_PAGE_SIZE,
  options?: CursorOptions,
): { results: DisclosureResult[]; continuation: CursorInfo | null } | null {
  const ttlMs = options?.ttlMs ?? DEFAULT_CURSOR_TTL_MS;
  const payload = decodeCursor(cursor);
  if (!payload) return null;
  const storeKey = payload.cursorKey ?? payload.queryHash;

  if (
    typeof payload.scopeKey === 'string'
    && payload.scopeKey.length > 0
    && payload.scopeKey !== options?.scopeKey
  ) {
    return null;
  }

  pruneExpiredCursorEntries(ttlMs);

  // Check expiry
  const now = Date.now();
  if (now - payload.timestamp > ttlMs) {
    // Expired cursor — clean up stored data
    cursorStore.delete(storeKey);
    return null;
  }

  // Retrieve stored result set
  const stored = cursorStore.get(storeKey);
  if (!stored) return null;

  // Extract the requested page
  const start = payload.offset;

exec
/bin/zsh -lc "sed -n '250,340p' .opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
      specFolder: parsed.specFolder,
      title: parsed.title,
      error: `Memory ${memoryId} not found in memory_index, update had no effect`,
    };
  }

  const fileMetadata = incrementalIndex.getFileMetadata(parsed.filePath);
  const fileMtimeMs = fileMetadata ? fileMetadata.mtime : null;
  const encodingIntent = isEncodingIntentEnabled() ? classifyEncodingIntent(parsed.content) : undefined;

  const appendVersion = database.transaction(() => {
    const nextMemoryId = vectorIndex.indexMemory({
      specFolder: parsed.specFolder,
      filePath: parsed.filePath,
      title: parsed.title,
      triggerPhrases: parsed.triggerPhrases,
      importanceWeight,
      embedding,
      encodingIntent,
      documentType: parsed.documentType || 'memory',
      specLevel,
      contentText: parsed.content,
      qualityScore: parsed.qualityScore,
      qualityFlags: parsed.qualityFlags,
      appendOnly: true,
    });

    applyPostInsertMetadata(database, nextMemoryId, {
      content_hash: parsed.contentHash,
      context_type: parsed.contextType,
      importance_tier: parsed.importanceTier,
      file_mtime_ms: fileMtimeMs,
      encoding_intent: encodingIntent,
      document_type: parsed.documentType || 'memory',
      spec_level: specLevel,
      quality_score: parsed.qualityScore ?? 0,
      quality_flags: JSON.stringify(parsed.qualityFlags ?? []),
    });

    database.prepare(`
      UPDATE memory_index
      SET importance_tier = 'deprecated',
          updated_at = ?
      WHERE id = ?
    `).run(new Date().toISOString(), memoryId);

    recordLineageTransition(database, nextMemoryId, {
      actor: 'mcp:memory_save',
      predecessorMemoryId: memoryId,
      transitionEvent: 'UPDATE',
    });

    try {
      recordHistory(nextMemoryId, 'ADD', null, parsed.title ?? parsed.filePath, 'mcp:memory_save');
      recordHistory(memoryId, 'UPDATE', previous.title, parsed.title ?? parsed.filePath, 'mcp:memory_save');
    } catch (_histErr: unknown) {
      // History recording is best-effort during save
    }

    return nextMemoryId;
  });

  const nextMemoryId = appendVersion();
  return {
    status: 'updated',
    id: nextMemoryId,
    specFolder: parsed.specFolder,
    title: parsed.title,
    triggerPhrases: parsed.triggerPhrases,
    contextType: parsed.contextType,
    importanceTier: parsed.importanceTier
  };
}

/** Log a prediction-error gating decision to the memory_conflicts table */
function logPeDecision(decision: PeDecision, contentHash: string, specFolder: string): void {
  const database = requireDb();

  try {
    const tableExists = database.prepare(`
      SELECT name FROM sqlite_master
      WHERE type='table' AND name='memory_conflicts'
    `).get();

    if (!tableExists) {
      console.warn('[PE-Gate] memory_conflicts table not yet created, skipping log');
      return;
    }

    database.prepare(`
      INSERT INTO memory_conflicts (

exec
/bin/zsh -lc "sed -n '880,930p' .opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  const dir = path.resolve(import.meta.dirname, '../../shared-spaces');
  const readmePath = path.join(dir, 'README.md');
  try {
    await access(readmePath);
    return true;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    void message;
    // README does not exist yet.
  }

  const content = `# Shared Memory Spaces

> Collaborative memory sharing between users and agents.

## Status

Shared memory has been **enabled** for this workspace.

## Key Concepts

- **Spaces** — Named containers for shared memories, scoped to a tenant.
- **Membership** — Deny-by-default: users and agents must be explicitly granted access (owner, editor, or viewer).
- **Rollout** — Each space has independent rollout and kill-switch controls.
- **Conflicts** — Concurrent edits produce append-version conflicts with automatic escalation to manual merge for repeat or high-risk cases.

## Management Commands

| Command | Description |
|---------|-------------|
| \`/memory:manage shared status\` | View rollout state and accessible spaces |
| \`/memory:manage shared create <spaceId> <tenantId> <name>\` | Create or update a shared space; first creator becomes owner |
| \`/memory:manage shared member <spaceId> <type> <id> <role>\` | Set membership; caller must already own the space |
| \`/memory:manage shared enable\` | Re-run first-time setup (idempotent) |

## Environment Overrides

Set \`SPECKIT_MEMORY_SHARED_MEMORY=true\` to force-enable shared memory regardless of database state.
`;

  await mkdir(dir, { recursive: true });
  await writeFile(readmePath, content, 'utf-8');
  return false;
}

exec
/bin/zsh -lc "sed -n '1450,1505p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
      });
    }
    throw error;
  }

  if (typeof result.id === 'number' && result.id > 0 && result.status !== 'unchanged' && result.status !== 'duplicate') {
    // B13 + H5 FIX: Wrap governance metadata in a transaction with rollback on failure.
    // If governance application fails, delete the orphaned memory row to prevent
    // persisted rows without tenant/shared-space/retention metadata.
    const applyGovernanceTx = database.transaction(() => {
      applyPostInsertMetadata(database, result.id, buildGovernancePostInsertFields(governanceDecision));
      recordGovernanceAudit(database, {
        action: 'memory_save',
        decision: 'allow',
        memoryId: result.id,
        tenantId,
        userId,
        agentId,
        sessionId,
        sharedSpaceId,
        reason: sharedSpaceId ? 'shared_space_save' : 'governed_ingest',
        metadata: { filePath: validatedPath, retentionPolicy: governanceDecision.normalized.retentionPolicy },
      });

      if (sharedSpaceId) {
        const existing = database.prepare(`
          SELECT id
          FROM memory_index
          WHERE shared_space_id = ?
            AND file_path = ?
            AND id != ?
          ORDER BY id DESC
          LIMIT 1
        `).get(sharedSpaceId, validatedPath, result.id) as { id?: number } | undefined;
        if (existing?.id) {
          recordSharedConflict(database, {
            spaceId: sharedSpaceId,
            logicalKey: `${result.specFolder || ''}::${validatedPath}`,
            existingMemoryId: existing.id,
            incomingMemoryId: result.id,
            actor: provenanceActor ?? 'mcp:memory_save',
            metadata: { filePath: validatedPath },
          });
        }
      }
    });
    try {
      applyGovernanceTx();
    } catch (govErr: unknown) {
      // C2 FIX: Use full delete helper to clean up ALL ancillary records
      // (vec_memories, BM25 index, causal edges, projections, etc.)
      // not just memory_index, to prevent orphaned search phantoms.
      console.error('[memory-save] Governance metadata failed, removing orphaned memory:', govErr instanceof Error ? govErr.message : String(govErr));
      try { delete_memory_from_database(database, result.id); } catch (_: unknown) { /* best-effort cleanup */ }
      throw govErr;
    }

exec
/bin/zsh -lc 'rg -n "recordSharedConflict|shared_space_conflicts|resolveSharedConflictStrategy|logicalKey" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts .opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts .opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:135:function resolveSharedConflictStrategy(
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:139:    logicalKey: string;
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:147:    FROM shared_space_conflicts
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:150:  `).get(args.spaceId, args.logicalKey) as { count?: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:271:    FROM shared_space_conflicts c
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:378:    FROM shared_space_conflicts
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:678:export function recordSharedConflict(
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:682:    logicalKey: string;
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:693:    const resolved = resolveSharedConflictStrategy(database, args);
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:695:      INSERT INTO shared_space_conflicts (
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:700:      args.logicalKey,
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:712:      logicalKey: args.logicalKey,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:57:  recordSharedConflict,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1485:          recordSharedConflict(database, {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1487:            logicalKey: `${result.specFolder || ''}::${validatedPath}`,

exec
/bin/zsh -lc "sed -n '120,185p' .opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
}

function normalizeExplicitStrategy(metadata: Record<string, unknown> | undefined): string | null {
  const value = metadata?.strategy;
  if (typeof value !== 'string') return null;
  const normalized = value.trim().toLowerCase();
  if (normalized.length === 0) return null;
  // R8: Validate strategy against known union type.
  if (!VALID_CONFLICT_STRATEGIES.has(normalized)) {
    console.warn(`[shared-spaces] Unknown conflict strategy "${normalized}", ignoring explicit override`);
    return null;
  }
  return normalized;
}

function resolveSharedConflictStrategy(
  database: Database.Database,
  args: {
    spaceId: string;
    logicalKey: string;
    metadata?: Record<string, unknown>;
  },
): { strategy: string; metadata: Record<string, unknown> | null } {
  const explicitStrategy = normalizeExplicitStrategy(args.metadata);
  const conflictKind = normalizeConflictKind(args.metadata);
  const priorConflictsRow = database.prepare(`
    SELECT COUNT(*) AS count
    FROM shared_space_conflicts
    WHERE space_id = ?
      AND logical_key = ?
  `).get(args.spaceId, args.logicalKey) as { count?: number } | undefined;
  const priorConflicts = typeof priorConflictsRow?.count === 'number' ? priorConflictsRow.count : 0;

  const strategy = explicitStrategy
    ?? (HIGH_RISK_CONFLICT_KINDS.has(conflictKind ?? '')
      ? 'manual_merge'
      : priorConflicts > 0
        ? 'manual_merge'
        : 'append_version');
  const strategyReason = explicitStrategy
    ? 'explicit_metadata'
    : HIGH_RISK_CONFLICT_KINDS.has(conflictKind ?? '')
      ? `high_risk:${conflictKind}`
      : priorConflicts > 0
        ? 'repeat_conflict'
        : 'default_append_only';

  return {
    strategy,
    metadata: {
      ...(args.metadata ?? {}),
      strategy,
      strategyReason,
      priorConflictCount: priorConflicts,
    },
  };
}

/**
 * Resolve whether shared-memory rollout is enabled for the process.
 *
 * Tier 1: Env var override (highest priority) — `SPECKIT_MEMORY_SHARED_MEMORY` or `SPECKIT_HYDRA_SHARED_MEMORY`.
 * Tier 2: Database config persistence — `shared_memory_enabled` key in `config` table.
 * Default: OFF (requires explicit enablement via env var or first-run setup).
 *
 * @param database - Optional database to check for persisted enablement state.

exec
/bin/zsh -lc "rg -n \"function createScopeFilterPredicate|const createScopeFilterPredicate|createScopeFilterPredicate\\(\" .opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts && sed -n '620,690p' .opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
456:export function createScopeFilterPredicate<T extends Record<string, unknown>>(
641:  const predicate = createScopeFilterPredicate(scope, options.allowedSharedSpaceIds);
674:  return rows.filter(createScopeFilterPredicate(scope, allowedSharedSpaceIds));
      latestCreatedAt: summaryRow.latest_created_at,
    },
  };
}

/**
 * Benchmark scope filtering with a reusable predicate for rollout and safety checks.
 *
 * @param rows - Candidate rows that include governance scope columns.
 * @param scope - Requested scope used for filtering.
 * @param options - Optional iterations and shared-space allowlist.
 * @returns Timing and match counts for the benchmark run.
 */
export function benchmarkScopeFilter<T extends Record<string, unknown>>(
  rows: T[],
  scope: ScopeContext,
  options: ScopeFilterBenchmarkOptions = {},
): ScopeFilterBenchmarkResult {
  const iterations = Number.isInteger(options.iterations) && (options.iterations ?? 0) > 0
    ? Math.trunc(options.iterations as number)
    : 1;
  const predicate = createScopeFilterPredicate(scope, options.allowedSharedSpaceIds);
  let matchedRows = 0;
  const startedAt = process.hrtime.bigint();

  for (let iteration = 0; iteration < iterations; iteration += 1) {
    matchedRows = 0;
    for (const row of rows) {
      if (predicate(row)) {
        matchedRows += 1;
      }
    }
  }

  const elapsedMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
  return {
    iterations,
    totalRows: rows.length,
    matchedRows,
    filteredRows: rows.length - matchedRows,
    elapsedMs,
    averageMsPerIteration: elapsedMs / iterations,
  };
}

/**
 * Filter result rows to the tenant, actor, session, and shared-space scope in force.
 *
 * @param rows - Candidate rows that include governance scope columns.
 * @param scope - Requested scope used for filtering.
 * @param allowedSharedSpaceIds - Optional shared-space allowlist for the scope.
 * @returns Rows that remain visible after governance filtering.
 */
export function filterRowsByScope<T extends Record<string, unknown>>(rows: T[], scope: ScopeContext, allowedSharedSpaceIds?: ReadonlySet<string>): T[] {
  return rows.filter(createScopeFilterPredicate(scope, allowedSharedSpaceIds));
}

exec
/bin/zsh -lc "sed -n '456,560p' .opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
export function createScopeFilterPredicate<T extends Record<string, unknown>>(
  scope: ScopeContext,
  allowedSharedSpaceIds?: ReadonlySet<string>,
): (row: T) => boolean {
  const normalized = normalizeScopeContext(scope);
  if (!isScopeEnforcementEnabled() && !hasScopeConstraints(normalized)) {
    return () => true;
  }
  if (isScopeEnforcementEnabled() && !hasScopeConstraints(normalized)) {
    // BUG-001 fix: Empty scope under enforcement means no access, not universal access.
    return () => false;
  }

  return (row: T) => {
    const rowSharedSpaceId = normalizeId(row.shared_space_id);
    if (rowSharedSpaceId) {
      if (normalized.sharedSpaceId && rowSharedSpaceId !== normalized.sharedSpaceId) {
        return false;
      }
      if (allowedSharedSpaceIds && !allowedSharedSpaceIds.has(rowSharedSpaceId)) {
        return false;
      }
    } else if (normalized.sharedSpaceId) {
      return false;
    }

    // H8 FIX: When a row belongs to an allowed shared space, use membership as
    // the access boundary — don't require exact actor/session match, which would
    // block collaborator B from seeing collaborator A's shared memories.
    if (rowSharedSpaceId && allowedSharedSpaceIds?.has(rowSharedSpaceId)) {
      return matchesExactScope(row.tenant_id, normalized.tenantId);
    }

    return matchesExactScope(row.tenant_id, normalized.tenantId)
      && matchesExactScope(row.user_id, normalized.userId)
      && matchesExactScope(row.agent_id, normalized.agentId)
      && matchesExactScope(row.session_id, normalized.sessionId);
  };
}

/**
 * Review governance audit rows and aggregate counts for a filtered governance window.
 *
 * @param database - Database connection that stores governance state.
 * @param filters - Optional audit filters and row limit.
 * @returns Review rows plus aggregate counts for the matching audit window.
 */
export function reviewGovernanceAudit(
  database: Database.Database,
  filters: GovernanceAuditReviewFilters = {},
): GovernanceAuditReviewResult {
  ensureGovernanceRuntime(database);
  const allowUnscoped = filters.allowUnscoped === true;
  // Security: audit enumeration requires explicit scope filters or admin override
  if (!allowUnscoped && !hasGovernanceAuditFilters(filters)) {
    console.warn('[scope-governance] Unscoped governance audit enumeration blocked; explicit filters or allowUnscoped=true required.');
    return {
      rows: [],
      summary: {
        totalMatching: 0,
        returnedRows: 0,
        byAction: {},
        byDecision: {},
        latestCreatedAt: null,
      },
    };
  }
  const { whereSql, params } = buildGovernanceAuditWhereClause(filters);
  const limit = Number.isInteger(filters.limit) && (filters.limit ?? 0) > 0
    ? Math.trunc(filters.limit as number)
    : 50;

  const rows = database.prepare(`
    SELECT
      id,
      action,
      decision,
      memory_id,
      logical_key,
      tenant_id,
      user_id,
      agent_id,
      session_id,
      shared_space_id,
      reason,
      metadata,
      created_at
    FROM governance_audit
    ${whereSql}
    ORDER BY id DESC
    LIMIT ?
  `).all(...params, limit) as Array<{
    id: number;
    action: string;
    decision: GovernanceAuditEntry['decision'];
    memory_id: number | null;
    logical_key: string | null;
    tenant_id: string | null;
    user_id: string | null;
    agent_id: string | null;
    session_id: string | null;
    shared_space_id: string | null;
    reason: string | null;
    metadata: string | null;
    created_at: string;

exec
/bin/zsh -lc "sed -n '980,1010p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    tenantId
    || userId
    || agentId
    || sharedSpaceId
  );
  const shouldApplyScopeFiltering = hasGovernanceScope || isScopeEnforcementEnabled();
  const scopeFilter = {
    tenantId,
    userId,
    agentId,
    sharedSpaceId,
  };
  let allowedSharedSpaceIds: Set<string> | undefined;

  if (shouldApplyScopeFiltering) {
    try {
      const db = requireDb();
      allowedSharedSpaceIds = getAllowedSharedSpaceIds(db, scopeFilter);
      candidates = filterRowsByScope(
        candidates,
        scopeFilter,
        allowedSharedSpaceIds,
      );
    } catch (_error: unknown) {
      candidates = filterRowsByScope(candidates, scopeFilter);
    }
  }

  // -- Constitutional Memory Injection ----------------------------------------
  //
  // If includeConstitutional is requested and no constitutional results exist

exec
/bin/zsh -lc "sed -n '96,115p' .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   5. SCHEMA DEFINITIONS
──────────────────────────────────────────────────────────────── */

const memoryContextSchema = getSchema({
  input: z.string().min(1),
  mode: z.enum(['auto', 'quick', 'deep', 'focused', 'resume']).optional(),
  intent: intentEnum.optional(),
  specFolder: optionalPathString(),
  tenantId: z.string().optional(),
  userId: z.string().optional(),
  agentId: z.string().optional(),
  sharedSpaceId: z.string().optional(),
  limit: positiveIntMax(100).optional(),
  sessionId: z.string().optional(),
  enableDedup: z.boolean().optional(),
  includeContent: z.boolean().optional(),
  includeTrace: z.boolean().optional(), // CHK-040: Forward to internal memory_search
  tokenUsage: boundedNumber(0, 1).optional(),
  anchors: optionalStringArray,
  profile: z.enum(['quick', 'research', 'resume', 'debug']).optional(),

exec
/bin/zsh -lc "sed -n '426,446p' .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  shared_space_upsert: getSchema({
    spaceId: z.string(),
    tenantId: z.string(),
    name: z.string(),
    actorUserId: z.string().optional().describe('Actor identity (provide actorUserId OR actorAgentId, not both)'),
    actorAgentId: z.string().optional().describe('Actor identity (provide actorUserId OR actorAgentId, not both)'),
    rolloutEnabled: z.boolean().optional(),
    rolloutCohort: z.string().optional(),
    killSwitch: z.boolean().optional(),
  }),
  shared_space_membership_set: getSchema({
    spaceId: z.string(),
    tenantId: z.string(),
    actorUserId: z.string().optional().describe('Actor identity (provide actorUserId OR actorAgentId, not both)'),
    actorAgentId: z.string().optional().describe('Actor identity (provide actorUserId OR actorAgentId, not both)'),
    subjectType: z.enum(['user', 'agent']),
    subjectId: z.string(),
    role: z.enum(['owner', 'editor', 'viewer']),
  }),
  shared_memory_status: getSchema({
    tenantId: z.string().optional(),

exec
/bin/zsh -lc "rg -n \"const memorySearchSchema|getSchema\\(\\{.*memory_search|memorySearchSchema\" .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts && sed -n '118,150p' .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
118:const memorySearchSchema = getSchema({
398:  memory_search: memorySearchSchema as unknown as ToolInputSchema,
const memorySearchSchema = getSchema({
  cursor: z.string().min(1).optional(),
  query: z.string().min(2).max(1000).optional(),
  concepts: z.array(z.string().min(1)).min(2).max(5).optional(),
  specFolder: optionalPathString(),
  tenantId: z.string().optional(),
  userId: z.string().optional(),
  agentId: z.string().optional(),
  sharedSpaceId: z.string().optional(),
  limit: positiveIntMax(100).optional(),
  sessionId: z.string().optional(),
  enableDedup: z.boolean().optional(),
  tier: importanceTierEnum.optional(),
  contextType: z.string().optional(),
  useDecay: z.boolean().optional(),
  includeContiguity: z.boolean().optional(),
  includeConstitutional: z.boolean().optional(),
  enableSessionBoost: z.boolean().optional(),
  enableCausalBoost: z.boolean().optional(),
  includeContent: z.boolean().optional(),
  anchors: optionalStringArray,
  min_quality_score: boundedNumber(0, 1).optional(),
  minQualityScore: boundedNumber(0, 1).optional(),
  bypassCache: z.boolean().optional(),
  rerank: z.boolean().optional(),
  applyLengthPenalty: z.boolean().optional(),
  applyStateLimits: z.boolean().optional(),
  minState: z.enum(['HOT', 'WARM', 'COLD', 'DORMANT', 'ARCHIVED']).optional(),
  intent: intentEnum.optional(),
  autoDetectIntent: z.boolean().optional(),
  trackAccess: z.boolean().optional(),
  includeArchived: z.boolean().optional(),
  mode: z.enum(['auto', 'deep']).optional(),

exec
/bin/zsh -lc "rg -n \"func \\(v \\*Vault\\) StoreFact|memory/facts|ReinforceFact|DecayFacts|subject|predicate|value\" \"/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go\"" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
64:// DecayFacts sweeps all fact files and applies FSRS-based confidence decay.
67:func (v *Vault) DecayFacts() (int, error) {
160:// ReinforceFact increases a fact's confidence and stability after a successful recall.
163:func (v *Vault) ReinforceFact(relPath string) error {
266:// ListFacts returns memory facts, optionally filtered by subject.
267:func (v *Vault) ListFacts(subject string, limit int) ([]*markdown.Document, error) {
282:		if subject != "" && !strings.EqualFold(doc.Get("subject"), subject) {
290:// SearchFacts searches memory facts via FTS, filtering to memory/facts/ paths.
305:			subj := doc.Get("subject")
327:		if !strings.HasPrefix(r.Path, "memory/facts/") {
340:func (v *Vault) StoreFact(subject, predicate, value string, confidence float64, importance string) (string, error) {
348:	slug := slugify(subject + "-" + predicate)
353:	relPath := fmt.Sprintf("memory/facts/%s.md", slug)
359:		relPath = fmt.Sprintf("memory/facts/%s.md", slug2)
364:		"subject":     subject,
365:		"predicate":   predicate,
372:	if err := v.Write(relPath, fm, value); err != nil {

exec
/bin/zsh -lc "sed -n '1,220p' \"/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go\"" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "sed -n '1,220p' \"/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/facts.go\"" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

codex
I’ve narrowed this to a few concrete safety conclusions rather than a broad memory-system recap: unscoped/unrestricted tools, direct file overwrites, async reinforcement races, and vault-root-only isolation on the Modus side; scoped ACLs, lineage partitioning, cursor scoping, and append-version conflict tracking on our side. I’m pulling stable line numbers now so the final iteration note is evidence-backed and clean.
exec
/bin/zsh -lc "nl -ba \"/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go\" | sed -n '1,80p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba \"/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go\" | sed -n '140,170p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba \"/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go\" | sed -n '285,322p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba \"/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go\" | sed -n '160,210p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba \"/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/writer.go\" | sed -n '1,80p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba \"/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/vault.go\" | sed -n '12,65p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    12	)
    13	
    14	// Vault provides unified access to the entire vault — brain, memory, atlas, missions.
    15	type Vault struct {
    16		Dir   string
    17		Index *index.Index
    18	}
    19	
    20	// New creates a Vault rooted at the given directory.
    21	func New(dir string, idx *index.Index) *Vault {
    22		return &Vault{Dir: dir, Index: idx}
    23	}
    24	
    25	// Path joins segments onto the vault root.
    26	func (v *Vault) Path(parts ...string) string {
    27		args := append([]string{v.Dir}, parts...)
    28		return filepath.Join(args...)
    29	}
    30	
    31	// safePath resolves relPath within the vault and rejects traversal attempts.
    32	func (v *Vault) safePath(relPath string) (string, error) {
    33		abs := filepath.Join(v.Dir, relPath)
    34		abs, err := filepath.Abs(abs)
    35		if err != nil {
    36			return "", fmt.Errorf("invalid path: %w", err)
    37		}
    38		root, err := filepath.Abs(v.Dir)
    39		if err != nil {
    40			return "", fmt.Errorf("invalid vault root: %w", err)
    41		}
    42		if !strings.HasPrefix(abs, root+string(os.PathSeparator)) && abs != root {
    43			return "", fmt.Errorf("path traversal denied: %s", relPath)
    44		}
    45		return abs, nil
    46	}
    47	
    48	// Read parses a single markdown file by relative path.
    49	func (v *Vault) Read(relPath string) (*markdown.Document, error) {
    50		abs, err := v.safePath(relPath)
    51		if err != nil {
    52			return nil, err
    53		}
    54		return markdown.Parse(abs)
    55	}
    56	
    57	// Write creates or overwrites a markdown file with frontmatter + body.
    58	func (v *Vault) Write(relPath string, fm map[string]interface{}, body string) error {
    59		abs, err := v.safePath(relPath)
    60		if err != nil {
    61			return err
    62		}
    63		os.MkdirAll(filepath.Dir(abs), 0755)
    64		return markdown.Write(abs, fm, body)
    65	}

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts | sed -n '456,490p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   456	export function createScopeFilterPredicate<T extends Record<string, unknown>>(
   457	  scope: ScopeContext,
   458	  allowedSharedSpaceIds?: ReadonlySet<string>,
   459	): (row: T) => boolean {
   460	  const normalized = normalizeScopeContext(scope);
   461	  if (!isScopeEnforcementEnabled() && !hasScopeConstraints(normalized)) {
   462	    return () => true;
   463	  }
   464	  if (isScopeEnforcementEnabled() && !hasScopeConstraints(normalized)) {
   465	    // BUG-001 fix: Empty scope under enforcement means no access, not universal access.
   466	    return () => false;
   467	  }
   468	
   469	  return (row: T) => {
   470	    const rowSharedSpaceId = normalizeId(row.shared_space_id);
   471	    if (rowSharedSpaceId) {
   472	      if (normalized.sharedSpaceId && rowSharedSpaceId !== normalized.sharedSpaceId) {
   473	        return false;
   474	      }
   475	      if (allowedSharedSpaceIds && !allowedSharedSpaceIds.has(rowSharedSpaceId)) {
   476	        return false;
   477	      }
   478	    } else if (normalized.sharedSpaceId) {
   479	      return false;
   480	    }
   481	
   482	    // H8 FIX: When a row belongs to an allowed shared space, use membership as
   483	    // the access boundary — don't require exact actor/session match, which would
   484	    // block collaborator B from seeing collaborator A's shared memories.
   485	    if (rowSharedSpaceId && allowedSharedSpaceIds?.has(rowSharedSpaceId)) {
   486	      return matchesExactScope(row.tenant_id, normalized.tenantId);
   487	    }
   488	
   489	    return matchesExactScope(row.tenant_id, normalized.tenantId)
   490	      && matchesExactScope(row.user_id, normalized.userId)

exec
/bin/zsh -lc "nl -ba \"/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md\" | sed -n '1,210p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
    61	
    62	## Operations
    63	
    64	Filing: When another model hands you content (research, analysis, code docs),
    65	file it in the correct vault location with proper frontmatter, tags, and
    66	importance level.
    67	
    68	Retrieval: When the reasoning model needs context, search the vault and
    69	return only relevant, high-signal results. Compress and deduplicate before
    70	returning. The reasoning model should never see noise.
    71	
    72	Triage: Classify incoming items:
    73	- ADAPT — valuable, add to vault with proper metadata
    74	- KEEP — store as-is for reference
    75	- DISCARD — not worth storing
    76	
    77	Use importance levels: critical, high, medium, low.
    78	
    79	Maintenance: Check for existing entries before creating new ones. Merge
    80	related facts. Flag stale entries for decay. Reinforce facts that keep
    81	getting accessed.
    82	
    83	## Filing Rules
    84	
    85	- Every vault entry needs YAML frontmatter (title, type, tags, status)
    86	- Memory facts need subject, predicate, value, importance, and confidence
    87	- Update rather than duplicate — always check first
    88	- Tag everything — tags are how facts get found later
    89	- Be concise and orderly. You are a custodian of records.
    90	```
    91	
    92	## Recommended Models
    93	
    94	The Librarian doesn't need a frontier model. It needs a fast, reliable model that follows instructions precisely. Good candidates:
    95	
    96	| Model | Size | Notes |
    97	|-------|------|-------|
    98	| Gemma 4 | 12B-26B | Strong instruction following, multimodal, our default |
    99	| Qwen 3 | 8B-14B | Good structured output, fast |
   100	| Llama 3 | 8B | Solid baseline, widely available |
   101	| Phi-4 | 14B | Compact, good at structured tasks |
   102	
   103	We run ours on Gemma 4 26B via Ollama. Any model that can reliably produce YAML frontmatter and follow classification rules will work. Even a 7-8B model is fine — the Librarian's job is structured and repetitive, not creative.
   104	
   105	## Connecting to modus-memory
   106	
   107	### Option 1: MCP Tool Delegation
   108	
   109	If your AI client supports MCP, the simplest setup is tool-level delegation. Configure your client so the Librarian model handles memory tool calls:
   110	
   111	```json
   112	{
   113	  "mcpServers": {
   114	    "memory": {
   115	      "command": "modus-memory",
   116	      "args": ["--vault", "~/vault"]
   117	    }
   118	  }
   119	}
   120	```
   121	
   122	Then instruct your reasoning model: *"For any memory operation, delegate to the Librarian. Do not write to memory directly."*
   123	
   124	### Option 2: Prompt Pipeline
   125	
   126	For tighter control, run the Librarian as a preprocessing step:
   127	
   128	```bash
   129	# 1. Librarian retrieves relevant context
   130	echo "User is asking about React authentication patterns" | \
   131	  ollama run gemma4:26b --system "$(cat librarian-prompt.md)" \
   132	  "Search the vault for relevant context and return a compressed summary"
   133	
   134	# 2. Feed the Librarian's output into the cloud model as system context
   135	```
   136	
   137	### Option 3: Agent Framework
   138	
   139	In a multi-agent setup, the Librarian is one agent in the fleet with exclusive write access to vault tools. Other agents (coder, researcher, reasoner) request storage through the Librarian agent.
   140	
   141	```yaml
   142	# Agent role definition
   143	name: librarian
   144	model: gemma4:26b
   145	tools: [vault_search, vault_read, vault_write, vault_list, memory_store, memory_search]
   146	```
   147	
   148	## Example: Retrieval Flow
   149	
   150	**User asks the cloud model:** "What did we decide about the auth refactor?"
   151	
   152	**Cloud model delegates to Librarian:** "Search vault for decisions about auth refactor"
   153	
   154	**Librarian runs:**
   155	1. `vault_search("auth refactor decision")` — BM25 with query expansion finds "authentication," "OAuth," "session tokens"
   156	2. Gets 12 results, filters by FSRS retrievability (drops 4 stale entries)
   157	3. Deduplicates (2 entries say the same thing)
   158	4. Returns compressed context: 6 relevant facts, ~800 tokens
   159	
   160	**Cloud model receives:** Clean, high-signal context. Reasons over it. Responds to user.
   161	
   162	**Total cloud tokens spent on memory:** ~800 instead of ~8,000.
   163	
   164	## Example: Storage Flow
   165	
   166	**Cloud model produces analysis:** 2,000 words on microservice trade-offs.
   167	
   168	**Cloud model delegates to Librarian:** "File this analysis in the vault"
   169	
   170	**Librarian runs:**
   171	1. Checks for existing entries on "microservice architecture" — finds 2
   172	2. Merges new insights with existing entries rather than duplicating
   173	3. Writes updated document with proper frontmatter, tags, importance: high
   174	4. Stores 3 new memory facts (subject/predicate/value) for quick retrieval
   175	5. Confirms: "Filed. Updated 1 document, added 3 facts."
   176	
   177	**Result:** One clean, deduplicated entry instead of scattered fragments.
   178	
   179	## Design Principles
   180	
   181	1. **Single writer.** One model owns all writes. No conflicts, no inconsistency.
   182	2. **Small model, focused job.** The Librarian doesn't need to be smart. It needs to be reliable.
   183	3. **Compress before crossing the boundary.** Every token that crosses from local to cloud costs money. Minimize.
   184	4. **Plain files as ground truth.** Markdown + YAML frontmatter. Readable, greppable, git-friendly. No proprietary format.
   185	5. **Decay is a feature.** FSRS ensures old noise fades while important memories strengthen. The Librarian doesn't hoard — it curates.
   186	
   187	---
   188	
   189	The Librarian pattern turns modus-memory from a storage layer into a complete personal memory system. The vault holds the data. The Librarian decides what goes in, what comes out, and what fades away.
   190	
   191	Your memory. Your machine. Your archivist.

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts | sed -n '678,725p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts | sed -n '500,675p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   678	export function recordSharedConflict(
   679	  database: Database.Database,
   680	  args: {
   681	    spaceId: string;
   682	    logicalKey: string;
   683	    existingMemoryId: number | null;
   684	    incomingMemoryId: number;
   685	    actor: string;
   686	    metadata?: Record<string, unknown>;
   687	  }
   688	): void {
   689	  ensureSharedCollabRuntime(database);
   690	  // Use an IMMEDIATE transaction so concurrent writers cannot observe the same
   691	  // prior conflict count between strategy resolution and the insert/audit write.
   692	  const recordConflictTx = database.transaction(() => {
   693	    const resolved = resolveSharedConflictStrategy(database, args);
   694	    database.prepare(`
   695	      INSERT INTO shared_space_conflicts (
   696	        space_id, logical_key, existing_memory_id, incoming_memory_id, strategy, actor, metadata
   697	      ) VALUES (?, ?, ?, ?, ?, ?, ?)
   698	    `).run(
   699	      args.spaceId,
   700	      args.logicalKey,
   701	      args.existingMemoryId,
   702	      args.incomingMemoryId,
   703	      resolved.strategy,
   704	      args.actor,
   705	      resolved.metadata ? JSON.stringify(resolved.metadata) : null,
   706	    );
   707	
   708	    recordGovernanceAudit(database, {
   709	      action: 'shared_conflict',
   710	      decision: 'conflict',
   711	      memoryId: args.incomingMemoryId,
   712	      logicalKey: args.logicalKey,
   713	      sharedSpaceId: args.spaceId,
   714	      reason: resolved.strategy,
   715	      metadata: resolved.metadata,
   716	    });
   717	  });
   718	  recordConflictTx.immediate();
   719	}

 succeeded in 0ms:
   500	/**
   501	 * Collect the shared spaces visible to the provided user or agent scope.
   502	 *
   503	 * @param database - Database connection that stores shared-space state.
   504	 * @param scope - Scope used to filter memberships and tenant boundaries.
   505	 * @returns Shared-space identifiers the scope is allowed to see.
   506	 */
   507	export function getAllowedSharedSpaceIds(database: Database.Database, scope: ScopeContext): Set<string> {
   508	  // B2: Respect the same disable gate as assertSharedSpaceAccess.
   509	  if (!isSharedMemoryEnabled(database)) return new Set();
   510	  ensureSharedCollabRuntime(database);
   511	  const normalizedScope = normalizeScopeContext(scope);
   512	
   513	  // P0 fix: require tenant context so null scopes cannot enumerate every tenant.
   514	  if (!normalizedScope.tenantId) return new Set();
   515	
   516	  const ids = new Set<string>();
   517	  const candidates: Array<[SharedSubjectType, string | undefined]> = [
   518	    ['user', normalizedScope.userId],
   519	    ['agent', normalizedScope.agentId],
   520	  ];
   521	
   522	  for (const [subjectType, subjectId] of candidates) {
   523	    if (!subjectId) continue;
   524	    const rows = database.prepare(`
   525	      SELECT m.space_id
   526	      FROM shared_space_members m
   527	      JOIN shared_spaces s ON s.space_id = m.space_id
   528	      WHERE m.subject_type = ?
   529	        AND m.subject_id = ?
   530	        AND s.tenant_id = ?
   531	        AND s.kill_switch = 0
   532	        AND s.rollout_enabled = 1
   533	    `).all(
   534	      subjectType,
   535	      subjectId,
   536	      normalizedScope.tenantId,
   537	    ) as Array<{ space_id: string }>;
   538	    for (const row of rows) {
   539	      ids.add(row.space_id);
   540	    }
   541	  }
   542	
   543	  return ids;
   544	}
   545	
   546	/**
   547	 * Enforce rollout, tenancy, and membership rules for shared-space access.
   548	 *
   549	 * @param database - Database connection that stores shared-space state.
   550	 * @param scope - Scope requesting shared-space access.
   551	 * @param spaceId - Shared-space identifier to validate.
   552	 * @param requiredRole - Minimum role required for the attempted action.
   553	 * @returns Allow or deny decision with a failure reason when blocked.
   554	 */
   555	export function assertSharedSpaceAccess(
   556	  database: Database.Database,
   557	  scope: ScopeContext,
   558	  spaceId: string,
   559	  requiredRole: SharedRole = 'viewer',
   560	): { allowed: boolean; reason?: string } {
   561	  const normalizedScope = normalizeScopeContext(scope);
   562	  const auditAccessDecision = (
   563	    decision: 'allow' | 'deny',
   564	    reason: string,
   565	    metadata?: Record<string, unknown>,
   566	  ): void => {
   567	    try {
   568	      recordGovernanceAudit(database, {
   569	        action: 'shared_space_access',
   570	        decision,
   571	        reason,
   572	        tenantId: normalizedScope.tenantId,
   573	        userId: normalizedScope.userId,
   574	        agentId: normalizedScope.agentId,
   575	        sessionId: normalizedScope.sessionId,
   576	        sharedSpaceId: spaceId,
   577	        metadata: {
   578	          requiredRole,
   579	          ...(metadata ?? {}),
   580	        },
   581	      });
   582	    } catch (error: unknown) {
   583	      const message = error instanceof Error ? error.message : String(error);
   584	      console.error(`[shared-spaces] Failed to record shared_space_access audit: ${message}`);
   585	    }
   586	  };
   587	  const deny = (reason: string, metadata?: Record<string, unknown>): { allowed: false; reason: string } => {
   588	    auditAccessDecision('deny', reason, metadata);
   589	    return { allowed: false, reason };
   590	  };
   591	  const allow = (metadata?: Record<string, unknown>): { allowed: true } => {
   592	    auditAccessDecision('allow', 'membership_verified', metadata);
   593	    return { allowed: true };
   594	  };
   595	
   596	  if (!spaceId?.trim()) {
   597	    return deny('shared_space_id_required');
   598	  }
   599	
   600	  ensureSharedCollabRuntime(database);
   601	
   602	  if (!isSharedMemoryEnabled(database)) {
   603	    return deny('shared_memory_disabled');
   604	  }
   605	
   606	  const space = database.prepare(`
   607	    SELECT tenant_id, rollout_enabled, kill_switch
   608	    FROM shared_spaces
   609	    WHERE space_id = ?
   610	  `).get(spaceId) as { tenant_id?: string; rollout_enabled?: number; kill_switch?: number } | undefined;
   611	
   612	  if (!space) {
   613	    return deny('shared_space_not_found');
   614	  }
   615	  if (normalizedScope.tenantId && space.tenant_id !== normalizedScope.tenantId) {
   616	    return deny('shared_space_tenant_mismatch', {
   617	      spaceTenantId: space.tenant_id ?? null,
   618	    });
   619	  }
   620	  if (isGovernanceGuardrailsEnabled() && !normalizedScope.tenantId) {
   621	    return deny('shared_space_tenant_required');
   622	  }
   623	
   624	  const bypassAvailabilityChecks = requiredRole === 'owner';
   625	  if (!bypassAvailabilityChecks && space.kill_switch === 1) {
   626	    return deny('shared_space_kill_switch');
   627	  }
   628	  if (!bypassAvailabilityChecks && space.rollout_enabled !== 1) {
   629	    return deny('shared_space_rollout_disabled');
   630	  }
   631	
   632	  const allowed = getAllowedSharedSpaceIds(database, normalizedScope);
   633	  if (!allowed.has(spaceId) && !bypassAvailabilityChecks) {
   634	    return deny('shared_space_membership_required');
   635	  }
   636	
   637	  if (requiredRole === 'viewer') {
   638	    return allow();
   639	  }
   640	
   641	  const membership = database.prepare(`
   642	    SELECT role
   643	    FROM shared_space_members
   644	    WHERE space_id = ?
   645	      AND (
   646	        (subject_type = 'user' AND subject_id = ?)
   647	        OR
   648	        (subject_type = 'agent' AND subject_id = ?)
   649	      )
   650	    ORDER BY CASE role
   651	      WHEN 'owner' THEN 1
   652	      WHEN 'editor' THEN 2
   653	      ELSE 3
   654	    END ASC
   655	    LIMIT 1
   656	  `).get(spaceId, normalizedScope.userId ?? '', normalizedScope.agentId ?? '') as { role?: SharedRole } | undefined;
   657	
   658	  const role = membership?.role;
   659	  if (!role) {
   660	    return deny('shared_space_membership_required');
   661	  }
   662	  if (requiredRole === 'owner' && role !== 'owner') {
   663	    return deny('shared_space_owner_required', { resolvedRole: role });
   664	  }
   665	  if (requiredRole === 'editor' && role === 'viewer') {
   666	    return deny('shared_space_editor_required', { resolvedRole: role });
   667	  }
   668	
   669	  return allow({ resolvedRole: role });
   670	}
   671	
   672	/**
   673	 * Record an append-version conflict for shared-memory writes and audit it.
   674	 *
   675	 * @param database - Database connection that stores shared-space state.

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts | sed -n '145,210p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   145	  args: SharedCallerAuthArgs,
   146	): SharedAdminActor {
   147	  const userIdProvided = typeof args.actorUserId === 'string';
   148	  const agentIdProvided = typeof args.actorAgentId === 'string';
   149	  const normalizedUserId = typeof args.actorUserId === 'string' ? args.actorUserId.trim() : '';
   150	  const normalizedAgentId = typeof args.actorAgentId === 'string' ? args.actorAgentId.trim() : '';
   151	  const hasBlankUser = userIdProvided && normalizedUserId.length === 0;
   152	  const hasBlankAgent = agentIdProvided && normalizedAgentId.length === 0;
   153	  const hasUser = normalizedUserId.length > 0;
   154	  const hasAgent = normalizedAgentId.length > 0;
   155	
   156	  if (hasBlankUser || hasBlankAgent) {
   157	    throwSharedMemoryAuthError(
   158	      'Actor identities must be non-empty, non-whitespace strings.',
   159	      createCallerAuthErrorResponse({
   160	        tool: args.tool,
   161	        error: 'Actor identities must be non-empty, non-whitespace strings.',
   162	        code: 'E_VALIDATION',
   163	        reason: 'actor_identity_blank',
   164	        hint: 'Provide exactly one non-empty actorUserId or actorAgentId value.',
   165	      }),
   166	    );
   167	  }
   168	
   169	  if (hasUser && hasAgent) {
   170	    throwSharedMemoryAuthError(
   171	      'Provide only one actor identity.',
   172	      createCallerAuthErrorResponse({
   173	        tool: args.tool,
   174	        error: 'Provide only one actor identity.',
   175	        code: 'E_VALIDATION',
   176	        reason: 'actor_identity_ambiguous',
   177	        hint: 'Send only actorUserId or actorAgentId, not both.',
   178	      }),
   179	    );
   180	  }
   181	
   182	  if (!hasUser && !hasAgent) {
   183	    throwSharedMemoryAuthError(
   184	      'Caller authentication is required for shared-memory operations.',
   185	      createCallerAuthErrorResponse({
   186	        tool: args.tool,
   187	        error: 'Caller authentication is required for shared-memory operations.',
   188	        code: 'E_AUTHENTICATION',
   189	        reason: 'actor_identity_required',
   190	        hint: 'Provide exactly one caller identity via actorUserId or actorAgentId.',
   191	      }),
   192	    );
   193	  }
   194	
   195	  return hasUser
   196	    ? { subjectType: 'user', subjectId: normalizedUserId }
   197	    : { subjectType: 'agent', subjectId: normalizedAgentId };
   198	}
   199	
   200	function isTrustedCallerIdentityBindingEnabled(): boolean {
   201	  const value = process.env.SPECKIT_SHARED_MEMORY_TRUST_CALLER_IDENTITY;
   202	  if (typeof value !== 'string') {
   203	    return false;
   204	  }
   205	  return value.trim().toLowerCase() === 'true';
   206	}
   207	
   208	export function validateCallerAuth(
   209	  args: SharedAdminCallerAuthArgs,
   210	  tenantId?: string,

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts | sed -n '1160,1190p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1160	    });
  1161	    throw new Error(`Governed ingest rejected: ${governanceDecision.issues.join('; ')}`);
  1162	  }
  1163	
  1164	  if (sharedSpaceId) {
  1165	    const access = assertSharedSpaceAccess(database, {
  1166	      tenantId,
  1167	      userId,
  1168	      agentId,
  1169	      sessionId,
  1170	      sharedSpaceId,
  1171	    }, sharedSpaceId, 'editor');
  1172	    if (!access.allowed) {
  1173	      recordGovernanceAudit(database, {
  1174	        action: 'memory_save_shared_space',
  1175	        decision: 'deny',
  1176	        tenantId,
  1177	        userId,
  1178	        agentId,
  1179	        sessionId,
  1180	        sharedSpaceId,
  1181	        reason: access.reason ?? 'shared_space_denied',
  1182	      });
  1183	      throw new Error(`Shared-memory save denied: ${access.reason ?? 'shared_space_denied'}`);
  1184	    }
  1185	  }
  1186	
  1187	  // DryRun must remain non-mutating even when preflight is explicitly skipped.
  1188	  if (dryRun && skipPreflight) {
  1189	    const parsedForDryRun = memoryParser.parseMemoryFile(validatedPath);
  1190	    const preparedDryRun = prepareParsedMemoryForIndexing(parsedForDryRun, database, {

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts | sed -n '205,235p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts | sed -n '1460,1498p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   205	}
   206	
   207	function buildScopePrefix(row: MemoryIndexRow): string | null {
   208	  const scopeTuple = [
   209	    ['tenant', normalizeScopeValue(row.tenant_id)],
   210	    ['user', normalizeScopeValue(row.user_id)],
   211	    ['agent', normalizeScopeValue(row.agent_id)],
   212	    ['session', normalizeScopeValue(row.session_id)],
   213	    ['shared_space', normalizeScopeValue(row.shared_space_id)],
   214	  ].filter((entry): entry is [string, string] => entry[1] != null);
   215	
   216	  if (scopeTuple.length === 0) {
   217	    return null;
   218	  }
   219	
   220	  const scopeHash = createHash('sha256')
   221	    .update(JSON.stringify(scopeTuple), 'utf8')
   222	    .digest('hex')
   223	    .slice(0, 24);
   224	
   225	  return `scope-sha256:${scopeHash}`;
   226	}
   227	
   228	function hasLogicalKeySeparatorCollision(...components: string[]): boolean {
   229	  return components.some((component) => component.includes('::'));
   230	}
   231	
   232	function buildHashedLogicalKey(parts: {
   233	  specFolder: string;
   234	  scopePrefix: string | null;
   235	  canonicalPath: string;

 succeeded in 0ms:
  1460	      applyPostInsertMetadata(database, result.id, buildGovernancePostInsertFields(governanceDecision));
  1461	      recordGovernanceAudit(database, {
  1462	        action: 'memory_save',
  1463	        decision: 'allow',
  1464	        memoryId: result.id,
  1465	        tenantId,
  1466	        userId,
  1467	        agentId,
  1468	        sessionId,
  1469	        sharedSpaceId,
  1470	        reason: sharedSpaceId ? 'shared_space_save' : 'governed_ingest',
  1471	        metadata: { filePath: validatedPath, retentionPolicy: governanceDecision.normalized.retentionPolicy },
  1472	      });
  1473	
  1474	      if (sharedSpaceId) {
  1475	        const existing = database.prepare(`
  1476	          SELECT id
  1477	          FROM memory_index
  1478	          WHERE shared_space_id = ?
  1479	            AND file_path = ?
  1480	            AND id != ?
  1481	          ORDER BY id DESC
  1482	          LIMIT 1
  1483	        `).get(sharedSpaceId, validatedPath, result.id) as { id?: number } | undefined;
  1484	        if (existing?.id) {
  1485	          recordSharedConflict(database, {
  1486	            spaceId: sharedSpaceId,
  1487	            logicalKey: `${result.specFolder || ''}::${validatedPath}`,
  1488	            existingMemoryId: existing.id,
  1489	            incomingMemoryId: result.id,
  1490	            actor: provenanceActor ?? 'mcp:memory_save',
  1491	            metadata: { filePath: validatedPath },
  1492	          });
  1493	        }
  1494	      }
  1495	    });
  1496	    try {
  1497	      applyGovernanceTx();
  1498	    } catch (govErr: unknown) {

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts | sed -n '326,374p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '531,555p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

 succeeded in 0ms:
   326	    }
   327	  }
   328	
   329	  const payload: CursorPayload = {
   330	    cursorKey,
   331	    offset: pageSize,
   332	    queryHash,
   333	    timestamp: now,
   334	    scopeKey: typeof options?.scopeKey === 'string' && options.scopeKey.length > 0
   335	      ? options.scopeKey
   336	      : undefined,
   337	  };
   338	
   339	  return {
   340	    cursor: encodeCursor(payload),
   341	    remainingCount: resultSet.length - pageSize,
   342	  };
   343	}
   344	
   345	/**
   346	 * Resolve a continuation cursor to the next page of results.
   347	 *
   348	 * @param cursor - Opaque cursor token from createCursor.
   349	 * @param pageSize - Number of results to return. Default: 5.
   350	 * @param options - Optional cursor configuration (TTL).
   351	 * @returns Object with next page of results, next cursor (if more), or null if cursor is invalid/expired.
   352	 * @example
   353	 * ```ts
   354	 * const page = resolveCursor(cursor, 5);
   355	 * ```
   356	 */
   357	function resolveCursor(
   358	  cursor: string,
   359	  pageSize: number = DEFAULT_PAGE_SIZE,
   360	  options?: CursorOptions,
   361	): { results: DisclosureResult[]; continuation: CursorInfo | null } | null {
   362	  const ttlMs = options?.ttlMs ?? DEFAULT_CURSOR_TTL_MS;
   363	  const payload = decodeCursor(cursor);
   364	  if (!payload) return null;
   365	  const storeKey = payload.cursorKey ?? payload.queryHash;
   366	
   367	  if (
   368	    typeof payload.scopeKey === 'string'
   369	    && payload.scopeKey.length > 0
   370	    && payload.scopeKey !== options?.scopeKey
   371	  ) {
   372	    return null;
   373	  }
   374	

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts | sed -n '990,1005p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts | sed -n '100,145p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   990	    sharedSpaceId,
   991	  };
   992	  let allowedSharedSpaceIds: Set<string> | undefined;
   993	
   994	  if (shouldApplyScopeFiltering) {
   995	    try {
   996	      const db = requireDb();
   997	      allowedSharedSpaceIds = getAllowedSharedSpaceIds(db, scopeFilter);
   998	      candidates = filterRowsByScope(
   999	        candidates,
  1000	        scopeFilter,
  1001	        allowedSharedSpaceIds,
  1002	      );
  1003	    } catch (_error: unknown) {
  1004	      candidates = filterRowsByScope(candidates, scopeFilter);
  1005	    }

 succeeded in 0ms:
   100	  input: z.string().min(1),
   101	  mode: z.enum(['auto', 'quick', 'deep', 'focused', 'resume']).optional(),
   102	  intent: intentEnum.optional(),
   103	  specFolder: optionalPathString(),
   104	  tenantId: z.string().optional(),
   105	  userId: z.string().optional(),
   106	  agentId: z.string().optional(),
   107	  sharedSpaceId: z.string().optional(),
   108	  limit: positiveIntMax(100).optional(),
   109	  sessionId: z.string().optional(),
   110	  enableDedup: z.boolean().optional(),
   111	  includeContent: z.boolean().optional(),
   112	  includeTrace: z.boolean().optional(), // CHK-040: Forward to internal memory_search
   113	  tokenUsage: boundedNumber(0, 1).optional(),
   114	  anchors: optionalStringArray,
   115	  profile: z.enum(['quick', 'research', 'resume', 'debug']).optional(),
   116	});
   117	
   118	const memorySearchSchema = getSchema({
   119	  cursor: z.string().min(1).optional(),
   120	  query: z.string().min(2).max(1000).optional(),
   121	  concepts: z.array(z.string().min(1)).min(2).max(5).optional(),
   122	  specFolder: optionalPathString(),
   123	  tenantId: z.string().optional(),
   124	  userId: z.string().optional(),
   125	  agentId: z.string().optional(),
   126	  sharedSpaceId: z.string().optional(),
   127	  limit: positiveIntMax(100).optional(),
   128	  sessionId: z.string().optional(),
   129	  enableDedup: z.boolean().optional(),
   130	  tier: importanceTierEnum.optional(),
   131	  contextType: z.string().optional(),
   132	  useDecay: z.boolean().optional(),
   133	  includeContiguity: z.boolean().optional(),
   134	  includeConstitutional: z.boolean().optional(),
   135	  enableSessionBoost: z.boolean().optional(),
   136	  enableCausalBoost: z.boolean().optional(),
   137	  includeContent: z.boolean().optional(),
   138	  anchors: optionalStringArray,
   139	  min_quality_score: boundedNumber(0, 1).optional(),
   140	  minQualityScore: boundedNumber(0, 1).optional(),
   141	  bypassCache: z.boolean().optional(),
   142	  rerank: z.boolean().optional(),
   143	  applyLengthPenalty: z.boolean().optional(),
   144	  applyStateLimits: z.boolean().optional(),
   145	  minState: z.enum(['HOT', 'WARM', 'COLD', 'DORMANT', 'ARCHIVED']).optional(),

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts | sed -n '160,210p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   160	    expect(report.missingColumns).toEqual({});
   161	  });
   162	
   163	  it('derives distinct logical keys for memories that only differ by tenant scope', () => {
   164	    const filePath = '/tmp/specs/015-memory-state/memory/scoped-tenant.md';
   165	    insertMemory(database, {
   166	      id: 61,
   167	      specFolder: 'specs/015-memory-state',
   168	      filePath,
   169	      title: 'Tenant A',
   170	      createdAt: '2026-03-13T11:00:00.000Z',
   171	      tenantId: 'tenant-a',
   172	    });
   173	    insertMemory(database, {
   174	      id: 62,
   175	      specFolder: 'specs/015-memory-state',
   176	      filePath,
   177	      title: 'Tenant B',
   178	      createdAt: '2026-03-13T11:05:00.000Z',
   179	      tenantId: 'tenant-b',
   180	    });
   181	
   182	    const tenantA = recordLineageVersion(database, {
   183	      memoryId: 61,
   184	      actor: 'ops:tenant-scope',
   185	      effectiveAt: '2026-03-13T11:00:00.000Z',
   186	    });
   187	    const tenantB = recordLineageVersion(database, {
   188	      memoryId: 62,
   189	      actor: 'ops:tenant-scope',
   190	      effectiveAt: '2026-03-13T11:05:00.000Z',
   191	    });
   192	
   193	    expect(tenantA.logicalKey).not.toBe(tenantB.logicalKey);
   194	    expect(tenantA.logicalKey).toContain('scope-sha256:');
   195	    expect(tenantB.logicalKey).toContain('scope-sha256:');
   196	
   197	    const projectionCount = database.prepare(`
   198	      SELECT COUNT(*) AS total
   199	      FROM active_memory_projection
   200	      WHERE logical_key IN (?, ?)
   201	    `).get(tenantA.logicalKey, tenantB.logicalKey) as { total: number };
   202	    expect(projectionCount.total).toBe(2);
   203	  });
   204	
   205	  it('derives distinct logical keys for memories that only differ by user scope', () => {
   206	    const filePath = '/tmp/specs/015-memory-state/memory/scoped-user.md';
   207	    insertMemory(database, {
   208	      id: 71,
   209	      specFolder: 'specs/015-memory-state',
   210	      filePath,

exec
/bin/zsh -lc "nl -ba \"/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go\" | sed -n '18,36p;60,74p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba \"/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go\" | sed -n '340,376p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   340	func (v *Vault) StoreFact(subject, predicate, value string, confidence float64, importance string) (string, error) {
   341		if confidence <= 0 {
   342			confidence = 0.8
   343		}
   344		if importance == "" {
   345			importance = "medium"
   346		}
   347	
   348		slug := slugify(subject + "-" + predicate)
   349		if len(slug) > 80 {
   350			slug = slug[:80]
   351		}
   352	
   353		relPath := fmt.Sprintf("memory/facts/%s.md", slug)
   354		path := v.Path("memory", "facts", slug+".md")
   355	
   356		// Handle duplicates
   357		for i := 2; fileExists(path); i++ {
   358			slug2 := fmt.Sprintf("%s-%d", slug, i)
   359			relPath = fmt.Sprintf("memory/facts/%s.md", slug2)
   360			path = v.Path("memory", "facts", slug2+".md")
   361		}
   362	
   363		fm := map[string]interface{}{
   364			"subject":     subject,
   365			"predicate":   predicate,
   366			"confidence":  confidence,
   367			"importance":  importance,
   368			"memory_type": "semantic",
   369			"created":     "now",
   370		}
   371	
   372		if err := v.Write(relPath, fm, value); err != nil {
   373			return "", err
   374		}
   375		return relPath, nil
   376	}

codex
I’ve got enough code evidence for the safety comparison itself. I’m doing one last read-only check of the phase validator so the iteration note can explicitly state whether the packet still validates in this environment.
exec
/bin/zsh -lc 'bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main" --strict' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1403ms:

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


2026-04-10T21:20:49.951989Z ERROR codex_core::tools::router: error=failed to parse function arguments: missing field `cell_id` at line 1 column 61
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '1581,1593p;1790,1804p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1581	
  1582	### rollout_summary_files
  1583	
  1584	- rollout_summaries/2026-03-20T15-43-19-Q1K1-hydra_governed_retrieval_specs.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/20/rollout-2026-03-20T16-43-19-019d0bea-55b4-7ec0-a57a-2a3c9f459fc9.jsonl, updated_at=2026-03-20T17:13:21+00:00, thread_id=019d0bea-55b4-7ec0-a57a-2a3c9f459fc9)
  1585	
  1586	### keywords
  1587	
  1588	- tenantId userId agentId sharedSpaceId, filterRowsByScope, superRefine actor identity, score=edgeStrength*fts_score, vi.hoisted
  1589	
  1590	## Task 2: Remove temp-root auto-delete from memory health autoRepair
  1591	
  1592	### rollout_summary_files
  1593	
  1790	### keywords
  1791	
  1792	- filterRowsByScope, sessionId filtering, getAllowedSharedSpaceIds, assertSharedSpaceAccess, runRetentionSweep, tenant filtering
  1793	
  1794	## Task 4: Apply TSDoc and reference-comment cleanup across Hydra runtime modules
  1795	
  1796	### rollout_summary_files
  1797	
  1798	- rollout_summaries/2026-03-13T19-22-18-0v7J-spec_kit_hydra_db_comment_cleanup.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/13/rollout-2026-03-13T20-22-18-019ce8a6-4c0d-7882-8bbd-ec7a9be5d66b.jsonl, updated_at=2026-03-13T20:27:00+00:00, thread_id=019ce8a6-4c0d-7882-8bbd-ec7a9be5d66b)
  1799	
  1800	### keywords
  1801	
  1802	- sk-code--opencode, TSDoc, BUG-###/REQ-###/CHK-### references, adaptive-ranking, shared-memory handlers, npx tsc --noEmit
  1803	
  1804	## Task 5: Run end-to-end Hydra review and ship scoped commit/push

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '1786,1793p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1786	### rollout_summary_files
  1787	
  1788	- rollout_summaries/2026-03-13T18-02-17-1YXi-phase_015_governance_refinement.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/13/rollout-2026-03-13T19-02-17-019ce85d-08e7-7411-b011-0414fe8fc054.jsonl, updated_at=2026-03-13T20:06:20+00:00, thread_id=019ce85d-08e7-7411-b011-0414fe8fc054)
  1789	
  1790	### keywords
  1791	
  1792	- filterRowsByScope, sessionId filtering, getAllowedSharedSpaceIds, assertSharedSpaceAccess, runRetentionSweep, tenant filtering
  1793	

codex
# Iteration 025: MULTI-AGENT MEMORY SAFETY

## Focus
MULTI-AGENT MEMORY SAFETY: How does this system handle concurrent agent access, merge conflicts, project isolation, and shared vs private memory scoping?

## Findings
### Finding 1: Modus’s multi-agent safety model is primarily an operational pattern, not a server-enforced boundary
- **Source**: [librarian.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md#L16); [librarian.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md#L46); [librarian.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md#L139); [memory.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go#L7); [vault.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L143)
- **What it does**: Modus documents a “Librarian” with sole write access, but the actual MCP layer registers `vault_write`/`memory_store` as free, unrestricted tools and does not require actor, role, tenant, or scope fields.
- **Why it matters**: In a real multi-agent deployment, safety depends on external routing discipline. If two agents talk to the server directly, the single-writer guarantee is not enforced by the memory system itself.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 2: Modus’s search path can create write-on-read races under concurrent agent access
- **Source**: [vault.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L287); [facts.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go#L163); [writer.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/writer.go#L10)
- **What it does**: `memory_search` launches asynchronous `ReinforceFact` writes for every returned fact. `ReinforceFact` performs a read-modify-write of markdown frontmatter, and the write path ends in plain `os.WriteFile`.
- **Why it matters**: I infer this is race-prone under parallel searches: two agents can read the same fact, compute updates from the same old state, and whichever write lands last wins. That makes `access_count`, `stability`, and `confidence` vulnerable to lost updates.
- **Recommendation**: reject
- **Impact**: high

### Finding 3: Modus isolates by vault root, not by first-class project/user/agent/shared scopes
- **Source**: [vault.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/vault.go#L14); [vault.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/vault.go#L31); [indexer.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go#L22); [indexer.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go#L65)
- **What it does**: Modus builds one in-memory index over one `vaultDir`, and all reads/writes are just relative paths inside that root with traversal protection.
- **Why it matters**: That is filesystem containment, not collaboration isolation. Shared vs private memory, tenant separation, and per-agent visibility are not modeled inside the retrieval/write APIs.
- **Recommendation**: reject
- **Impact**: high

### Finding 4: Spec Kit Memory already has the stronger shared/private scoping model
- **Source**: [tool-input-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts#L100); [tool-input-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts#L118); [stage1-candidate-gen.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts#L994); [scope-governance.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts#L456); [shared-spaces.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts#L507); [memory-save.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L1164)
- **What it does**: Public exposes `tenantId`, `userId`, `agentId`, `sessionId`, and `sharedSpaceId` in the memory surfaces; applies scope filtering during candidate generation; uses membership allowlists for shared rows; and denies shared-space saves without editor access.
- **Why it matters**: This is a real runtime policy layer, not just a prompt convention. It cleanly separates private memories from shared-space memories while still allowing collaborator visibility where membership says it should.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 5: Public has real multi-actor conflict handling where Modus mostly relies on discipline
- **Source**: [shared-spaces.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts#L135); [shared-spaces.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts#L678); [memory-save.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L1474); [lineage-state.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts#L207); [memory-lineage-state.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts#L163)
- **What it does**: Public partitions logical identity by scope hash, detects competing shared-space versions on save, records conflicts in an IMMEDIATE transaction, and escalates repeat or high-risk cases to `manual_merge` instead of silently overwriting.
- **Why it matters**: This is the concrete safety machinery Modus lacks for concurrent collaborative writers. It preserves auditability and keeps “same file path, different scope” from collapsing into one logical memory.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 6: Public also closes a subtle follow-on leak that Modus does not address: scoped continuation
- **Source**: [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L533); [progressive-disclosure.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts#L329)
- **What it does**: Public binds continuation cursors to a serialized `scopeKey` and rejects reuse when the resuming caller’s scope differs.
- **Why it matters**: In multi-agent systems, leakage is not only about writes. Follow-on pagination or resumptions can leak another actor’s result window if cursors are not scope-bound.
- **Recommendation**: adopt now
- **Impact**: medium

## Assessment
- New information ratio: **0.56**
- Validation: On **April 10, 2026**, I re-ran `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main" --strict` and it returned `RESULT: PASSED`. It also emitted `cannot create temp file for here document: Operation not permitted`, which is consistent with the read-only sandbox.
- This was a read-only iteration. I verified source evidence and validator status, but did not update phase artifacts.

## Recommended Next Focus
Shared-memory mutation ergonomics: compare Modus’s prompt-level “single Librarian” discipline against Public’s actual shared conflict pipeline, and decide whether Public needs an explicit operator-facing merge/review surface for `shared_space_conflicts` rather than any additional automatic write-on-read behavior.


hook: Stop
hook: Stop Completed
tokens used
158,380
# Iteration 025: MULTI-AGENT MEMORY SAFETY

## Focus
MULTI-AGENT MEMORY SAFETY: How does this system handle concurrent agent access, merge conflicts, project isolation, and shared vs private memory scoping?

## Findings
### Finding 1: Modus’s multi-agent safety model is primarily an operational pattern, not a server-enforced boundary
- **Source**: [librarian.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md#L16); [librarian.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md#L46); [librarian.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md#L139); [memory.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go#L7); [vault.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L143)
- **What it does**: Modus documents a “Librarian” with sole write access, but the actual MCP layer registers `vault_write`/`memory_store` as free, unrestricted tools and does not require actor, role, tenant, or scope fields.
- **Why it matters**: In a real multi-agent deployment, safety depends on external routing discipline. If two agents talk to the server directly, the single-writer guarantee is not enforced by the memory system itself.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 2: Modus’s search path can create write-on-read races under concurrent agent access
- **Source**: [vault.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L287); [facts.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go#L163); [writer.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/writer.go#L10)
- **What it does**: `memory_search` launches asynchronous `ReinforceFact` writes for every returned fact. `ReinforceFact` performs a read-modify-write of markdown frontmatter, and the write path ends in plain `os.WriteFile`.
- **Why it matters**: I infer this is race-prone under parallel searches: two agents can read the same fact, compute updates from the same old state, and whichever write lands last wins. That makes `access_count`, `stability`, and `confidence` vulnerable to lost updates.
- **Recommendation**: reject
- **Impact**: high

### Finding 3: Modus isolates by vault root, not by first-class project/user/agent/shared scopes
- **Source**: [vault.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/vault.go#L14); [vault.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/vault.go#L31); [indexer.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go#L22); [indexer.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go#L65)
- **What it does**: Modus builds one in-memory index over one `vaultDir`, and all reads/writes are just relative paths inside that root with traversal protection.
- **Why it matters**: That is filesystem containment, not collaboration isolation. Shared vs private memory, tenant separation, and per-agent visibility are not modeled inside the retrieval/write APIs.
- **Recommendation**: reject
- **Impact**: high

### Finding 4: Spec Kit Memory already has the stronger shared/private scoping model
- **Source**: [tool-input-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts#L100); [tool-input-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts#L118); [stage1-candidate-gen.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts#L994); [scope-governance.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts#L456); [shared-spaces.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts#L507); [memory-save.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L1164)
- **What it does**: Public exposes `tenantId`, `userId`, `agentId`, `sessionId`, and `sharedSpaceId` in the memory surfaces; applies scope filtering during candidate generation; uses membership allowlists for shared rows; and denies shared-space saves without editor access.
- **Why it matters**: This is a real runtime policy layer, not just a prompt convention. It cleanly separates private memories from shared-space memories while still allowing collaborator visibility where membership says it should.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 5: Public has real multi-actor conflict handling where Modus mostly relies on discipline
- **Source**: [shared-spaces.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts#L135); [shared-spaces.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts#L678); [memory-save.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L1474); [lineage-state.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts#L207); [memory-lineage-state.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts#L163)
- **What it does**: Public partitions logical identity by scope hash, detects competing shared-space versions on save, records conflicts in an IMMEDIATE transaction, and escalates repeat or high-risk cases to `manual_merge` instead of silently overwriting.
- **Why it matters**: This is the concrete safety machinery Modus lacks for concurrent collaborative writers. It preserves auditability and keeps “same file path, different scope” from collapsing into one logical memory.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 6: Public also closes a subtle follow-on leak that Modus does not address: scoped continuation
- **Source**: [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L533); [progressive-disclosure.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts#L329)
- **What it does**: Public binds continuation cursors to a serialized `scopeKey` and rejects reuse when the resuming caller’s scope differs.
- **Why it matters**: In multi-agent systems, leakage is not only about writes. Follow-on pagination or resumptions can leak another actor’s result window if cursors are not scope-bound.
- **Recommendation**: adopt now
- **Impact**: medium

## Assessment
- New information ratio: **0.56**
- Validation: On **April 10, 2026**, I re-ran `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main" --strict` and it returned `RESULT: PASSED`. It also emitted `cannot create temp file for here document: Operation not permitted`, which is consistent with the read-only sandbox.
- This was a read-only iteration. I verified source evidence and validator status, but did not update phase artifacts.

## Recommended Next Focus
Shared-memory mutation ergonomics: compare Modus’s prompt-level “single Librarian” discipline against Public’s actual shared conflict pipeline, and decide whether Public needs an explicit operator-facing merge/review surface for `shared_space_conflicts` rather than any additional automatic write-on-read behavior.
