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
--- Iteration 22 ---
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
# Iteration 023: MEMORY DECAY & RETENTION

## Focus
MEMORY DECAY & RETENTION: How does this system handle memory aging, relevance decay, forgetting? What temporal strategies should we adopt for long-lived memory systems?

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
I’m treating this as a read-only research pass for iteration 23, focused tightly on Modus decay/retention mechanics versus Spec Kit Memory. I’ll do a quick memory pass for prior Modus context, then trace the relevant source files in the required order and synthesize only net-new findings for this iteration.
exec
/bin/zsh -lc 'rg -n "modus|memory_review|memory_due|FSRS|decay|retention" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,220p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
157:- rollout_summaries/2026-04-09T10-35-53-UGDf-009_post_save_render_fixes_memory_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T12-35-53-019d71d0-0ec5-7c80-a08b-6d336ee5c639.jsonl, updated_at=2026-04-09T12:01:25+00:00, thread_id=019d71d0-0ec5-7c80-a08b-6d336ee5c639)
1784:## Task 3: Refine Phase-015 governance/collaboration boundaries and retention scope
1826:- Governance hardening in this wave centered on guaranteed session/tenant enforcement in `filterRowsByScope`, shared-space authorization, and scoped retention sweep deletions [Task 3]
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

codex
I’ve loaded the deep-research skill baseline and the memory pass mostly confirms prior momentum around `memory_review` and review-related retention work. Next I’m tracing the exact decay and recall mechanics in Modus and our FSRS scheduler so this iteration can focus on temporal policy, not generic retrieval overlap.
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/facts.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Fsrs
// ───────────────────────────────────────────────────────────────
// Feature catalog: Classification-based decay
// Augments FSRS stability scores with graph centrality so that
// Central nodes decay slower and peripheral nodes decay faster.

/* --- 1. INTERFACES --- */

/**
 * Minimal graph interface required by `computeGraphCentrality`.
 * Defined locally — no imports outside this module's rootDir.
 */
interface MemoryGraphLike {
  /** All graph nodes keyed by node id. */
  nodes: Map<string, unknown>;
  /** Map from node id → list of node ids that point INTO it (inbound edges). */
  inbound: Map<string, string[]>;
  /** Map from node id → list of node ids that this node points TO (outbound edges). */
  outbound: Map<string, string[]>;
}

/* --- 2. CORE FUNCTIONS --- */

/**
 * Compute structural freshness by augmenting an FSRS stability score
 * with a graph centrality factor.
 *
 * Formula:
 *   structural_freshness = fsrs_stability * graph_centrality_normalized
 *
 * Central nodes (high centrality) retain more freshness, peripheral
 * nodes (low centrality) decay faster — reflecting the intuition that
 * highly connected knowledge is more reliably accessible over time.
 *
 * @param stability  - FSRS stability value, clamped to [0, 1].
 * @param centrality - Normalized graph centrality value, clamped to [0, 1].
 * @returns Structural freshness score in [0, 1].
 */
export function computeStructuralFreshness(
  stability: number,
  centrality: number
): number {
  const s = Math.min(1, Math.max(0, stability));
  const c = Math.min(1, Math.max(0, centrality));
  return s * c;
}

/**
 * Compute normalized degree centrality for a node in a graph.
 *
 * Formula:
 *   degree_centrality = (inDegree + outDegree) / (2 * (totalNodes - 1))
 *
 * Normalized to [0, 1]. Returns 0 when:
 * - The node is not found in the graph.
 * - The graph has fewer than 2 nodes (denominator would be 0).
 *
 * @param nodeId - The id of the node to compute centrality for.
 * @param graph  - A memory-graph-like object with `nodes`, `inbound`, and `outbound` maps.
 * @returns Normalized degree centrality in [0, 1].
 */
export function computeGraphCentrality(
  nodeId: string,
  graph: MemoryGraphLike
): number {
  const totalNodes = graph.nodes.size;

  // Cannot normalize with fewer than 2 nodes.
  if (totalNodes < 2) return 0;

  // Node must exist in the graph.
  if (!graph.nodes.has(nodeId)) return 0;

  const inDegree = (graph.inbound.get(nodeId) ?? []).length;
  const outDegree = (graph.outbound.get(nodeId) ?? []).length;

  const centrality = (inDegree + outDegree) / (2 * (totalNodes - 1));

  // Clamp to [0, 1] to guard against unexpected edge-list duplication.
  return Math.min(1, Math.max(0, centrality));
}

codex
The core contrast is already showing up clearly: Modus makes decay, reinforce, and archive a visible lifecycle on the fact objects themselves, while Public has stronger FSRS math but keeps operator-facing due/review state much more implicit. I’m now tracing the handlers where those temporal mechanics are actually triggered so the recommendation can be about control-plane behavior, not just formulas.
exec
/bin/zsh -lc "sed -n '250,340p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '850,930p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

 succeeded in 0ms:
			conf := doc.Get("confidence")
			imp := doc.Get("importance")
			body := strings.TrimSpace(doc.Body)
			if len(body) > 200 {
				body = body[:200] + "..."
			}
			sb.WriteString(fmt.Sprintf("- **%s** %s (confidence: %s, importance: %s)\n  %s\n\n", subj, pred, conf, imp, body))
		}
		return fmt.Sprintf("%d memory facts:\n\n%s", len(docs), sb.String()), nil
	}

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
/bin/zsh -lc "sed -n '1,120p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "sed -n '480,540p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "ls -1 .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main && printf '\\n---\\n' && find .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main -maxdepth 2 -type f | sed 's#"'^#/#'"' | sort" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
external
memory
phase-research-prompt.md
research

---
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/.gitignore
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/LICENSE
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/MIGRATION_POST.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/go.mod
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/go.sum
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/memory/.gitkeep
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/phase-research-prompt.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/.gitkeep
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md

codex
The phase folder is not in a completion-ready state: it currently has `phase-research-prompt.md` and `research/research.md`, but the usual spec-kit docs like `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` are absent. I’m still continuing the read-only research iteration, and I’ll verify the validator behavior next so the assessment reflects the actual phase state rather than the intended one.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/research.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/writer.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc 'bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main" --strict' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1503ms:

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


2026-04-10T21:11:03.269224Z ERROR codex_core::tools::router: error=failed to parse function arguments: missing field `cell_id` at line 1 column 67
codex
I hit a minor tooling mismatch while polling the validator, so I’m switching to the normal exec-session poll path. After that I just need the validator result and a couple of our retention-related code paths to finalize the iteration synthesis.
exec
/bin/zsh -lc "rg -n \"nextReviewDate|processReview\\(|trackAccess|review_count|last_review|stability|difficulty|retrievability|due\" .opencode/skill/system-spec-kit/mcp_server -g '*.ts'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '260,420p' .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   Gated by SPECKIT_CLASSIFICATION_DECAY env var.
   Multiplies FSRS stability so that:
     - Infinity stability → R(t) = 1.0 always (no decay)
     - >1.0 stability multiplier → slower decay
     - <1.0 stability multiplier → faster decay */

/**
 * TM-03: Context-type stability multipliers.
 * Applied to the FSRS stability parameter before computing retrievability.
 * Infinity = no decay (retrievability always 1.0).
 * 2.0 = stability doubled → slower decay.
 * 1.0 = standard FSRS schedule.
 */
const CONTEXT_TYPE_STABILITY_MULTIPLIER: Record<string, number> = {
  planning: Infinity,    // no decay — planning/decisions are permanent
  research: 2.0,         // 2x stability — research context decays slower
  implementation: 1.0,   // standard decay
  general: 1.0,          // standard decay
  // P1-3: Legacy aliases inherit their canonical type's multiplier
  ...Object.fromEntries(
    Object.entries(LEGACY_CONTEXT_TYPE_ALIASES).map(
      ([legacy, canonical]) => [legacy, canonical === 'planning' ? Infinity : canonical === 'research' ? 2.0 : 1.0]
    )
  ),
};

/**
 * TM-03: Importance-tier stability multipliers.
 * Parallel to TIER_MULTIPLIER but operates on stability (not elapsed time).
 * Used exclusively by getClassificationDecayMultiplier() when
 * SPECKIT_CLASSIFICATION_DECAY is enabled. Do NOT combine with TIER_MULTIPLIER.
 * constitutional/critical: Infinity = never decays.
 * important: 1.5x stability → slower decay.
 * normal: 1.0 → standard.
 * temporary: 0.5x → faster decay (2x relative speed).
 * deprecated: 0.25x → fastest decay (4x relative speed).
 */
const IMPORTANCE_TIER_STABILITY_MULTIPLIER: Record<string, number> = {
  constitutional: Infinity, // never decays
  critical: Infinity,       // never decays
  important: 1.5,           // slower decay
  normal: 1.0,              // standard
  temporary: 0.5,           // faster decay
  deprecated: 0.25,         // fastest decay
};

/**
 * TM-03: Compute combined stability multiplier from context_type and importance_tier.
 *
 * Logic:
 *   - If either dimension resolves to Infinity, the combined result is Infinity
 *     (no-decay wins unconditionally).
 *   - Unknown context_type or importance_tier values default to 1.0 (standard).
 *   - Combined multiplier = contextMult * tierMult.
 *
 * When the result is Infinity, callers should treat stability as Infinity,
 * which makes R(t) = (1 + factor * t / Infinity)^decay = 1.0 for all t.
 *
 * @param contextType    Memory context_type field (e.g. "decision", "research")
 * @param importanceTier Memory importance_tier field (e.g. "constitutional", "normal")
 * @returns Combined stability multiplier (may be Infinity)
 */
function getClassificationDecayMultiplier(contextType: string, importanceTier: string): number {
  const contextMult = CONTEXT_TYPE_STABILITY_MULTIPLIER[contextType] ?? 1.0;
  const tierMult = IMPORTANCE_TIER_STABILITY_MULTIPLIER[importanceTier] ?? 1.0;

  // Infinity * anything = Infinity (no-decay wins)
  if (!isFinite(contextMult) || !isFinite(tierMult)) {
    return Infinity;
  }

  return contextMult * tierMult;
}

/**
 * TM-03: Apply classification-based decay to a stability value.
 * Gated by SPECKIT_CLASSIFICATION_DECAY env var (must be "true" or "1").
 *
 * Returns stability unchanged when the feature flag is disabled.
 * Returns Infinity when the combined multiplier is Infinity (no-decay).
 *
 * @param stability      Base FSRS stability value
 * @param contextType    Memory context_type field
 * @param importanceTier Memory importance_tier field
 * @returns Adjusted stability value
 */
function applyClassificationDecay(
  stability: number,
  contextType: string,
  importanceTier: string
): number {
  if (isHybridDecayPolicyEnabled() && HYBRID_NO_DECAY_CONTEXT_TYPES.has(contextType)) {
    return Infinity;
  }

  // Graduated: default-ON. Set SPECKIT_CLASSIFICATION_DECAY=false to disable.
  const flag = process.env.SPECKIT_CLASSIFICATION_DECAY?.toLowerCase();
  if (flag === 'false' || flag === '0') {
    return stability;
  }

  const multiplier = getClassificationDecayMultiplier(contextType, importanceTier);
  if (!isFinite(multiplier)) {
    return Infinity;
  }

  return stability * multiplier;
}

/* --- 4b. HYBRID DECAY POLICY (REQ-D4-002) ---
   Gated by SPECKIT_HYBRID_DECAY_POLICY env var (default OFF).
   Distinguishes two classes of memory:

   1. NO-DECAY documents — context_type in {decision, constitutional, critical}
      These represent permanent knowledge artifacts. Their stability is treated as
      Infinity so R(t) = 1.0 at all times.

   2. ENGAGEMENT-SENSITIVE documents — all other context_types (session, scratch,
      transient, implementation, discovery, research, general)
      Normal FSRS schedule applies without modification.

   This is intentionally SEPARATE from TM-03 (applyClassificationDecay) which
   uses a combined context_type × importance_tier multiplier and is default-ON.
   SPECKIT_HYBRID_DECAY_POLICY is default-OFF and must be opted into explicitly.
   DO NOT combine both policies on the same memory. */

/**
 * Context types that should never decay under the hybrid decay policy.
 * Classified as permanent knowledge artifacts.
 */
const HYBRID_NO_DECAY_CONTEXT_TYPES: ReadonlySet<string> = new Set([
  'planning',
  ...Object.keys(LEGACY_CONTEXT_TYPE_ALIASES).filter(k => LEGACY_CONTEXT_TYPE_ALIASES[k] === 'planning'),
  'constitutional',
  'critical',
]);
const HYBRID_FSRS_CONTEXT_TYPES: ReadonlySet<string> = new Set([
  'session',
  'scratch',
  'transient',
  'implementation',
  'discovery',
  'research',
  'general',
]);
const NO_DECAY = Infinity;

/**
 * REQ-D4-002: Check whether the hybrid decay policy feature flag is enabled.
 * Default: TRUE (graduated). Set SPECKIT_HYBRID_DECAY_POLICY=false to disable.
 */
function isHybridDecayPolicyEnabled(): boolean {
  const val = process.env.SPECKIT_HYBRID_DECAY_POLICY?.toLowerCase().trim();
  return val !== 'false' && val !== '0';
}

/**
 * REQ-D4-002: Classify a memory's decay behaviour under the hybrid policy.
 *
 * Returns:
 *   - 'no_decay'       for decision / constitutional / critical context types

 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1762:    // weekly holdout cycle is due. Fail-safe and gated by SPECKIT_SHADOW_FEEDBACK.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:123:  retrievability?: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:124:  stability?: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:125:  last_review?: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:202:  trackAccess?: boolean; // opt-in access tracking (default false)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:519:    trackAccess: trackAccess = false, // opt-in, off by default
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:801:      trackAccess,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:414:        let effectiveRetrievability = classification.retrievability;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:432:      // Clamp to [0,1] — retrievability * decay or wmEntry scores
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:433:      // Can drift outside the valid range due to floating-point arithmetic.
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:165:      trackAccess: {
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:65:  stability?: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:66:  difficulty?: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:67:  review_count?: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:95:  'type_inference_source', 'stability', 'difficulty', 'review_count',
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:246:        stability: fsrsScheduler.DEFAULT_INITIAL_STABILITY,
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:247:        difficulty: fsrsScheduler.DEFAULT_INITIAL_DIFFICULTY,
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:347:          stability: fsrsScheduler.DEFAULT_INITIAL_STABILITY,
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:348:          difficulty: fsrsScheduler.DEFAULT_INITIAL_DIFFICULTY,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:221:      stability: fsrsScheduler.DEFAULT_INITIAL_STABILITY,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:222:      difficulty: fsrsScheduler.DEFAULT_INITIAL_DIFFICULTY,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:148:  trackAccess: z.boolean().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:463:  memory_search: ['cursor', 'query', 'concepts', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'sessionId', 'enableDedup', 'tier', 'contextType', 'useDecay', 'includeContiguity', 'includeConstitutional', 'enableSessionBoost', 'enableCausalBoost', 'includeContent', 'anchors', 'min_quality_score', 'minQualityScore', 'bypassCache', 'rerank', 'applyLengthPenalty', 'applyStateLimits', 'minState', 'intent', 'autoDetectIntent', 'trackAccess', 'includeArchived', 'mode', 'includeTrace', 'profile'],
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:74:  trackAccess?: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:342:  // enough to stop, even if finding stability looks favorable.
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:358:      description: `${contradictions.length} contradiction(s) are lowering finding stability below threshold`,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:23:  stability: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:24:  difficulty: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:71:  previous_stability?: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:73:  retrievability?: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:149:  stability?: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:150:  difficulty?: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:151:  review_count?: number;
.opencode/skill/system-spec-kit/mcp_server/api/index.ts:7:// Review note: Barrel is wide due to legitimate external consumers in scripts/evals,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1584:      error: 'memory_context failed due to an internal error',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:265:                  stability: fsrsScheduler.DEFAULT_INITIAL_STABILITY,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:266:                  difficulty: fsrsScheduler.DEFAULT_INITIAL_DIFFICULTY,
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:40:  stability: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:41:  difficulty: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:56:  previous_stability?: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:58:  retrievability?: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:111:          stability: (r.stability as number) || fsrsScheduler.DEFAULT_INITIAL_STABILITY,
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:112:          difficulty: (r.difficulty as number) || fsrsScheduler.DEFAULT_INITIAL_DIFFICULTY,
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:142:/** Reinforce an existing memory's stability via FSRS scheduling instead of creating a duplicate */
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:148:      SELECT id, stability, difficulty, last_review, review_count, title
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:157:    const elapsedDays = fsrsScheduler.calculateElapsedDays(memory.last_review as string | null);
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:158:    const currentStability = (memory.stability as number) || fsrsScheduler.DEFAULT_INITIAL_STABILITY;
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:159:    const currentDifficulty = (memory.difficulty as number) || fsrsScheduler.DEFAULT_INITIAL_DIFFICULTY;
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:160:    const retrievability = fsrsScheduler.calculateRetrievability(currentStability, elapsedDays);
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:166:      retrievability
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:175:      SET stability = ?,
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:179:          last_review = datetime('now'),
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:180:          review_count = COALESCE(review_count, 0) + 1,
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:194:      previous_stability: currentStability,
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:196:      retrievability: retrievability
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:55:        stability REAL DEFAULT 1.0,
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:56:        difficulty REAL DEFAULT 5.0,
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:57:        last_review TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:58:        review_count INTEGER DEFAULT 0
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:155:  describe('Floor stability over repeated cycles', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:156:    const sessionId = 'floor-stability-test';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:364:  if (result.previous_stability !== undefined) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:365:    response.previous_stability = result.previous_stability;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:367:    response.retrievability = result.retrievability;
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:57:      stability REAL DEFAULT 1.0,
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:58:      difficulty REAL DEFAULT 5.0,
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:59:      last_review TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:60:      review_count INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:120:        last_review TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:121:      stability REAL DEFAULT 1.0,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:122:      difficulty REAL DEFAULT 5.0,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:123:      last_review TEXT DEFAULT (datetime('now')),
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:124:      review_count INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:182:    INSERT INTO memory_index (id, spec_folder, file_path, title, content, content_hash, stability, difficulty)
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:447:        stability: 1,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:448:        difficulty: 1,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:458:        stability: 1,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:459:        difficulty: 1,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:469:        stability: 1,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:470:        difficulty: 1,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:617:      INSERT INTO memory_index (id, spec_folder, file_path, title, content, content_hash, stability, difficulty)
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:44:      stability REAL DEFAULT 1.0,
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:476:      stability: 5.0,
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:500:      stability: 5.0,
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:530:      stability: 5.0,
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:553:      stability: 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:83:        stability REAL DEFAULT 1.0,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:84:        difficulty REAL DEFAULT 5.0,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:85:        last_review TEXT DEFAULT (datetime('now')),
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:86:        review_count INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:146:      INSERT INTO memory_index (id, spec_folder, file_path, title, content, content_hash, stability, difficulty)
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:269:          id, spec_folder, file_path, canonical_file_path, title, content, content_hash, stability, difficulty
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:535:        // May fail due to missing FSRS columns - acceptable
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:541:        expect(typeof result.retrievability).toBe('number');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:621:            id, spec_folder, file_path, title, content_text, content_hash, stability, difficulty, review_count
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:144:        queries: ['graph retrieval regression', 'rrf fusion stability'],
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:138:    // "Entity Extractor" is present but as proper_noun due to dedup
.opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts:17:    stability: number;
.opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts:20:    last_review: string;
.opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts:73:        stability: 0.01,
.opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts:76:        last_review: daysAgo(elapsed[tier]),
.opencode/skill/system-spec-kit/mcp_server/tests/provenance-envelope.vitest.ts:84:  schedule: vi.fn(() => ({ stability: 2, difficulty: 3 })),
.opencode/skill/system-spec-kit/mcp_server/tests/provenance-envelope.vitest.ts:223:      trackAccess: false,
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:16:       - A number (retrievability, elapsedDays): classifyState(0.95, 0)
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:17:       - A memory object: classifyState(memoryObj) reads .retrievability or .attentionScore
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:24:    // Using numeric call: classifyState(retrievability, elapsedDays)
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:96:     Production: calculateRetrievability(stability: number, elapsedDays: number): number
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:113:    it('T218: High stability (S=100, t=10) => very high R', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:118:    it('T219: Low stability (S=1, t=10) => lower R', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:131:     Production: classifyTier(memory: TierInput) returns {state, retrievability, effectiveHalfLife}
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:136:      const r = tierClassifier.classifyTier({ id: 1, importance_tier: 'constitutional', stability: 1.0 });
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:138:      expect(r.retrievability).toBe(1.0);
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:142:      const r = tierClassifier.classifyTier({ id: 2, is_pinned: 1, stability: 1.0 });
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:147:      const r = tierClassifier.classifyTier({ id: 3, importance_tier: 'critical', stability: 1.0 });
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:152:    it('T224: Returns {state, retrievability, effectiveHalfLife}', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:153:      const r = tierClassifier.classifyTier({ id: 4, stability: 1.0 });
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:155:      expect(r).toHaveProperty('retrievability');
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:160:      const r = tierClassifier.classifyTier({ id: 4, stability: 1.0 });
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:172:      expect(tierClassifier.shouldArchive({ id: 1, importance_tier: 'constitutional', stability: 0.01, created_at: new Date(Date.now() - 200 * 86400000).toISOString() })).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:176:      expect(tierClassifier.shouldArchive({ id: 2, importance_tier: 'critical', stability: 0.01, created_at: new Date(Date.now() - 200 * 86400000).toISOString() })).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:180:      expect(tierClassifier.shouldArchive({ id: 3, is_pinned: 1, stability: 0.01, created_at: new Date(Date.now() - 200 * 86400000).toISOString() })).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:183:    it('T229: Old low-stability normal => should archive', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:184:      expect(tierClassifier.shouldArchive({ id: 4, importance_tier: 'normal', stability: 0.01, half_life_days: 0.001, created_at: new Date(Date.now() - 200 * 86400000).toISOString() })).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:187:    it('T230: Recent high-stability => should NOT archive', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:188:      expect(tierClassifier.shouldArchive({ id: 5, importance_tier: 'normal', stability: 100, created_at: new Date().toISOString() })).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:210:        { id: 1, importance_tier: 'constitutional', stability: 1.0 },
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:211:        { id: 2, importance_tier: 'critical', stability: 1.0 },
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:212:        { id: 3, importance_tier: 'normal', stability: 100, created_at: new Date().toISOString() },
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:221:        { id: 1, importance_tier: 'constitutional', stability: 1.0 },
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:222:        { id: 2, importance_tier: 'critical', stability: 1.0 },
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:223:        { id: 3, importance_tier: 'normal', stability: 100, created_at: new Date().toISOString() },
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:235:        { id: 1, importance_tier: 'constitutional', stability: 1.0 },
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:236:        { id: 2, importance_tier: 'critical', stability: 1.0 },
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:237:        { id: 3, importance_tier: 'normal', stability: 100, created_at: new Date().toISOString() },
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:252:      { id: 1, importance_tier: 'constitutional', stability: 1.0 },
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:253:      { id: 2, importance_tier: 'critical', stability: 1.0 },
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:254:      { id: 3, importance_tier: 'normal', stability: 100, created_at: new Date().toISOString() },
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:287:     Production: formatStateResponse(memories) returns [{id, title, state, retrievability, specFolder, filePath}]
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:292:      { id: 1, title: 'Test Memory', spec_folder: 'specs/001', file_path: '/test.md', importance_tier: 'constitutional', stability: 1.0 },
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:293:      { id: 2, title: 'Another', spec_folder: 'specs/002', file_path: '/other.md', importance_tier: 'normal', stability: 100, created_at: new Date().toISOString() },
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:302:    it('T247: Entry has {id, title, state, retrievability, specFolder, filePath}', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:308:      expect(entry).toHaveProperty('retrievability');
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:321:      expect(typeof r[0].retrievability).toBe('number');
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:322:      expect(r[0].retrievability).toBeGreaterThanOrEqual(0);
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:323:      expect(r[0].retrievability).toBeLessThanOrEqual(1);
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:327:      const r = tierClassifier.formatStateResponse([{ id: 99, importance_tier: 'constitutional', stability: 1.0 }]);
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:339:      { id: 1, importance_tier: 'constitutional', stability: 1.0 },
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:340:      { id: 2, importance_tier: 'critical', stability: 1.0 },
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:341:      { id: 3, importance_tier: 'normal', stability: 100, created_at: new Date().toISOString() },
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:403:    it('T261: null => infinite stability', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:407:    it('T262: 60 days => ~4.69 stability (FSRS)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:414:    it('T263: 0 => infinite stability', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:39:    stability: 4.5,
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:40:    difficulty: 0.3,
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:41:    last_review: '2025-02-01T12:00:00Z',
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:42:    review_count: 5,
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:79:    stability: 4.5,
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:80:    difficulty: 0.3,
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:165:    row.last_review = null;
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:215:    expect(memory.stability).toBe(4.5);
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:216:    expect(memory.difficulty).toBe(0.3);
.opencode/skill/system-spec-kit/mcp_server/tests/unit-fsrs-formula.vitest.ts:31:    const stability = halfLifeToStability(60);
.opencode/skill/system-spec-kit/mcp_server/tests/unit-fsrs-formula.vitest.ts:32:    const r = calculateRetrievability(stability, 0);
.opencode/skill/system-spec-kit/mcp_server/tests/unit-fsrs-formula.vitest.ts:38:    const stability = halfLifeToStability(halfLife);
.opencode/skill/system-spec-kit/mcp_server/tests/unit-fsrs-formula.vitest.ts:39:    const r = calculateRetrievability(stability, halfLife);
.opencode/skill/system-spec-kit/mcp_server/tests/unit-fsrs-formula.vitest.ts:47:    const stability = halfLifeToStability(60);
.opencode/skill/system-spec-kit/mcp_server/tests/unit-fsrs-formula.vitest.ts:49:    const rValues = timePoints.map(t => calculateRetrievability(stability, t));
.opencode/skill/system-spec-kit/mcp_server/tests/unit-fsrs-formula.vitest.ts:57:  it('T006: Very old memories (365+ days, low stability) have retrievability near 0', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/unit-fsrs-formula.vitest.ts:58:    const stability = halfLifeToStability(7); // short half-life
.opencode/skill/system-spec-kit/mcp_server/tests/unit-fsrs-formula.vitest.ts:59:    const r365 = calculateRetrievability(stability, 365);
.opencode/skill/system-spec-kit/mcp_server/tests/unit-fsrs-formula.vitest.ts:60:    const r730 = calculateRetrievability(stability, 730);
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:371:            last_review TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:85:      trackAccess: false,
.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:348:    input.config.trackAccess = true;
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:30:  it('T016: Just reviewed = full retrievability', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:36:  it('T017: 1 day elapsed = reduced retrievability', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:43:  it('T018: Higher stability = slower decay', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:53:  it('T019: Success grade increases stability', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:56:    const difficulty = 5.0;
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:57:    const retrievability = 0.9;
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:59:    const newStability = fsrsScheduler.updateStability(initialStability, difficulty, grade, retrievability);
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:63:  it('T020: Failure grade decreases stability', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:66:    const difficulty = 5.0;
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:67:    const retrievability = 0.5;
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:69:    const newStability = fsrsScheduler.updateStability(initialStability, difficulty, grade, retrievability);
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:108:  it('Handles zero/negative stability gracefully', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:229:    const rHigh = fsrsScheduler.calculateRetrievability(10.0, 1);  // High stability, recent
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:230:    const rLow = fsrsScheduler.calculateRetrievability(1.0, 10);   // Low stability, old
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:234:  it('T049: Accessed memories show increased stability (testing effect)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:237:    const difficulty = 5.0;
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:240:    const newStability = fsrsScheduler.updateStability(initial, difficulty, grade, r);
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:244:  it('T050: Low R memories get larger boost (desirable difficulty)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:247:    const difficulty = 5.0;
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:249:    const boostHighR = fsrsScheduler.updateStability(initial, difficulty, grade, 0.9) - initial;
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:250:    const boostLowR = fsrsScheduler.updateStability(initial, difficulty, grade, 0.4) - initial;
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:251:    // Some FSRS implementations may not have desirable difficulty built-in
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:255:    // If desirable difficulty is implemented, low R boost should be larger
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:327:  it('R with very high stability (100+) decays very slowly', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:333:    // High stability should retain much more after 30 days
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:335:    // Should be at least double the normal stability retention
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:339:  it('R with very low stability (0.1) decays very fast', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:345:    // Low stability should decay much faster
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:354:  it('Grade 1 (fail) with high difficulty reduces stability significantly', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:358:    const retrievability = 0.7;
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:360:    const newStability = fsrsScheduler.updateStability(initial, highDifficulty, grade, retrievability);
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:364:  it('Grade 4 (success) with low difficulty increases stability maximally', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:368:    const retrievability = 0.9;
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:371:    const newStability = fsrsScheduler.updateStability(initial, lowDifficulty, grade, retrievability);
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:374:    // Compare with high difficulty
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:376:    const newStabilityHard = fsrsScheduler.updateStability(initial, highDifficulty, grade, retrievability);
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:380:  it('Multiple consecutive successes compound stability growth', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:382:    let stability = 1.0;
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:383:    const difficulty = 5.0;
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:386:    const stabilityHistory = [stability];
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:390:        ? fsrsScheduler.calculateRetrievability(stability, 1)
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:392:      stability = fsrsScheduler.updateStability(stability, difficulty, grade, r);
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:393:      stabilityHistory.push(stability);
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:396:    // Each iteration should increase stability
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:397:    for (let i = 1; i < stabilityHistory.length; i++) {
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:398:      expect(stabilityHistory[i]).toBeGreaterThan(stabilityHistory[i - 1]);
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:401:    // Final stability should be significantly higher
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:402:    const growthFactor = stability / stabilityHistory[0];
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:406:  it('Multiple consecutive failures compound stability decline', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:408:    let stability = 10.0; // Start high
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:409:    const difficulty = 5.0;
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:412:    const stabilityHistory = [stability];
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:417:        ? fsrsScheduler.calculateRetrievability(stability, 1)
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:419:      stability = fsrsScheduler.updateStability(stability, difficulty, grade, r);
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:420:      stabilityHistory.push(stability);
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:423:    // Each iteration should decrease or be at stability floor
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:424:    for (let i = 1; i < stabilityHistory.length; i++) {
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:425:      const atFloor = stabilityHistory[i] <= MIN_STABILITY_FLOOR + 0.001;
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:426:      const decreased = stabilityHistory[i] < stabilityHistory[i - 1];
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:430:    // Final stability should be lower than initial
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:431:    expect(stability).toBeLessThan(stabilityHistory[0]);
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:450:  it('Grade 1 increases difficulty', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:457:  it('Grade 4 decreases difficulty', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:479:  it('Grades have ordered effects on difficulty', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:503:  it('Target R=0.5 intervals increase with stability', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:511:    // Higher stability should give longer intervals for same target R
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:519:    const stability = 1.0;
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:520:    const intervalR90 = calcInterval(stability, 0.9);
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:521:    const intervalR50 = calcInterval(stability, 0.5);
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:522:    const intervalR20 = calcInterval(stability, 0.2);
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:523:    const intervalR10 = calcInterval(stability, 0.1);
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:534:  it('Interval increases with stability', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:545:    // Intervals should be increasing with stability
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:609:  it('C138-T4: tier decay formula produces expected stability', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:624:  it('C138-T5: constitutional memory retains stability over 30 days', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-validation.vitest.ts:164: * Note: validate.sh always returns exit 2 for temp folders due to strict rules
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-validation.vitest.ts:306:      // Validate.sh returns exit 2 for temp folders due to strict rules
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-validation.vitest.ts:651:      // Validate.sh always returns 2 for temp folders due to strict rules
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-validation.vitest.ts:739:      // Validate.sh returns valid exit codes (may be 2 due to strict rules on temp folders)
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth.vitest.ts:80:    difficulty TEXT DEFAULT 'medium',
.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:110:     Production: calculateRetrievabilityDecay(stability: number, elapsedDays: number): number
.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:125:    it('Higher stability = slower decay', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:148:        stability: 10.0,
.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:149:        last_review: new Date().toISOString(),
.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:156:    it('No last_review => returns baseScore', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:157:      const noReviewMemory = { stability: 5.0 };
.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:341:     calculateRetrievability(stability, elapsedDays): number
.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:378:    it('Invalid stability => 0', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:417:    // REC-017: Use FSRS retrievability — high stability + any elapsed = ~1.0
.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:418:    it('High stability = minimal decay after 1000 days', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:423:    // Deprecated tier also frozen — use applyFsrsDecay with no last_review to get baseScore back
.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:424:    it('No last_review = frozen state (returns baseScore)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:425:      const deprMemory = { importance_tier: 'deprecated', stability: 1.0 };
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:138:  it('runs a due holdout cycle from recent consumption_log queries', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:39:  stability?: number;
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:84:      stability REAL DEFAULT 1.0,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:86:      last_review TEXT
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:105:    INSERT INTO memory_index (spec_folder, file_path, title, content_text, importance_tier, created_at, last_accessed, access_count, confidence, is_pinned, stability, half_life_days)
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:119:    data.stability ?? 1.0,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:189:        stability: 0.001,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:208:        stability: 0.001,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:528:        stability: 0.001,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:536:        stability: 0.001,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:553:        stability: 0.001,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:570:        stability: 0.001,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:640:          stability: 0.001,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:661:          stability: 0.001,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:680:        stability: 0.001,
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:425:      stability: 5.0,
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:471:        stability: 1.0,
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:498:      stability: 5.0,
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:777:        stability: 5.0,
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:878:        stability: 1.0,
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:879:        difficulty: 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:880:        last_review: null,
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:881:        review_count: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:921:        stability: 1.0,
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:922:        difficulty: 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:923:        last_review: null,
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:924:        review_count: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:117:  it('returns stability unchanged when flag is OFF for decision type', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:119:    const stability = 3.5;
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:120:    expect(applyHybridDecayPolicy(stability, 'decision')).toBe(stability);
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:123:  it('returns stability unchanged when flag is OFF for session type', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:125:    const stability = 2.0;
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:126:    expect(applyHybridDecayPolicy(stability, 'session')).toBe(stability);
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:147:  it('returns stability unchanged for engagement-sensitive types when flag is ON', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:149:    const stability = 4.2;
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:150:    expect(applyHybridDecayPolicy(stability, 'session')).toBe(stability);
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:151:    expect(applyHybridDecayPolicy(stability, 'scratch')).toBe(stability);
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:152:    expect(applyHybridDecayPolicy(stability, 'research')).toBe(stability);
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:153:    expect(applyHybridDecayPolicy(stability, 'implementation')).toBe(stability);
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:154:    expect(applyHybridDecayPolicy(stability, 'general')).toBe(stability);
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:157:  it('Infinity stability produces R(t) = 1.0 for all elapsed times', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:159:    const stability = applyHybridDecayPolicy(1.0, 'decision');
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:160:    expect(stability).toBe(Infinity);
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:161:    // With Infinity stability, retrievability formula gives 1.0
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:163:    const r0 = calculateRetrievability(stability, 0);
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:164:    const r30 = calculateRetrievability(stability, 30);
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:165:    const r365 = calculateRetrievability(stability, 365);
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:173:    const stability = applyHybridDecayPolicy(1.0, 'session');
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:174:    expect(stability).toBe(1.0); // unchanged
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:175:    // After 30 days with stability=1, retrievability should be < 1
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:176:    const r30 = calculateRetrievability(stability, 30);
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:200:    const stability = 2.0;
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:201:    // applyHybridDecayPolicy should return stability unchanged (its own flag is OFF)
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:202:    expect(applyHybridDecayPolicy(stability, 'decision')).toBe(stability);
.opencode/skill/system-spec-kit/mcp_server/tests/five-factor-scoring.vitest.ts:79:    const row = { lastReview: now.toISOString(), stability: 1.0 };
.opencode/skill/system-spec-kit/mcp_server/tests/five-factor-scoring.vitest.ts:86:    const row = { lastReview: tenDaysAgo.toISOString(), stability: 1.0 };
.opencode/skill/system-spec-kit/mcp_server/tests/five-factor-scoring.vitest.ts:274:      stability: 1.0,
.opencode/skill/system-spec-kit/mcp_server/tests/five-factor-scoring.vitest.ts:493:      stability: 5.0,
.opencode/skill/system-spec-kit/mcp_server/tests/five-factor-scoring.vitest.ts:523:    const row = { lastReview: oldDate.toISOString(), stability: 1.0 };
.opencode/skill/system-spec-kit/mcp_server/tests/five-factor-scoring.vitest.ts:530:    const row = { lastReview: recentDate.toISOString(), stability: 1.0 };
.opencode/skill/system-spec-kit/mcp_server/tests/five-factor-scoring.vitest.ts:535:  it('EDGE-T03: Missing stability defaults to 1.0', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/five-factor-scoring.vitest.ts:543:    const row = { stability: 1.0 };
.opencode/skill/system-spec-kit/mcp_server/tests/five-factor-scoring.vitest.ts:548:  it('EDGE-T05: High stability (S=10) slows decay', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/five-factor-scoring.vitest.ts:550:    const lowStability = { lastReview: tenDaysAgo.toISOString(), stability: 1.0 };
.opencode/skill/system-spec-kit/mcp_server/tests/five-factor-scoring.vitest.ts:551:    const highStability = { lastReview: tenDaysAgo.toISOString(), stability: 10.0 };
.opencode/skill/system-spec-kit/mcp_server/tests/five-factor-scoring.vitest.ts:557:  it('EDGE-T06: Falls back to updated_at when no last_review', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/five-factor-scoring.vitest.ts:559:    const row = { updated_at: now.toISOString(), stability: 1.0 };
.opencode/skill/system-spec-kit/mcp_server/tests/five-factor-scoring.vitest.ts:566:    const row = { created_at: now.toISOString(), stability: 1.0 };
.opencode/skill/system-spec-kit/mcp_server/tests/five-factor-scoring.vitest.ts:822:      stability: 0.1,
.opencode/skill/system-spec-kit/mcp_server/tests/five-factor-scoring.vitest.ts:837:      stability: 100.0,
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:205:    trackAccess: false,
.opencode/skill/system-spec-kit/mcp_server/tests/scoring.vitest.ts:74:    const recentRow = { stability: 5.0, lastReview: daysAgo(1) };
.opencode/skill/system-spec-kit/mcp_server/tests/scoring.vitest.ts:75:    const olderRow = { stability: 5.0, lastReview: daysAgo(30) };
.opencode/skill/system-spec-kit/mcp_server/tests/scoring.vitest.ts:91:      stability: 5.0,
.opencode/skill/system-spec-kit/mcp_server/tests/scoring.vitest.ts:101:      stability: 5.0,
.opencode/skill/system-spec-kit/mcp_server/tests/scoring.vitest.ts:108:    // Constitutional should score higher due to tier boost and recency exemption
.opencode/skill/system-spec-kit/mcp_server/tests/scoring.vitest.ts:133:      stability: 5.0,
.opencode/skill/system-spec-kit/mcp_server/tests/scoring.vitest.ts:155:  it('should return neutral 0.5 for invalid timestamp in retrievability', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/scoring.vitest.ts:205:      { id: 1, similarity: 20, updated_at: daysAgo(30), lastReview: daysAgo(30), stability: 1.0 },
.opencode/skill/system-spec-kit/mcp_server/tests/scoring.vitest.ts:206:      { id: 2, similarity: 90, updated_at: now, lastReview: now, stability: 10.0 },
.opencode/skill/system-spec-kit/mcp_server/tests/scoring.vitest.ts:207:      { id: 3, similarity: 60, updated_at: daysAgo(5), lastReview: daysAgo(5), stability: 5.0 },
.opencode/skill/system-spec-kit/mcp_server/tests/scoring.vitest.ts:229:        stability: 10.0,
.opencode/skill/system-spec-kit/mcp_server/tests/scoring.vitest.ts:239:        stability: 10.0,
.opencode/skill/system-spec-kit/mcp_server/tests/scoring.vitest.ts:245:    // Constitutional should rank higher despite being older, due to tier boost and recency exemption
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:35:      expect(weights.retrievability).toBe(0.15)
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:77:        stability: 10.0,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:87:        stability: 1.0,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:98:        stability: 0.1,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:110:        stability: 10.0,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:117:    it('T415: Missing stability defaults correctly', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:130:    it('T416: Falls back to updated_at when last_review missing', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:133:        stability: 5.0,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:146:        stability: 5.0,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:156:    it('T418: Higher stability = higher R for same elapsed time', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:159:      const rLowS = calcR({ stability: 1.0, lastReview: elapsed })
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:160:      const rHighS = calcR({ stability: 10.0, lastReview: elapsed })
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:164:    it('T418b: Tier multipliers affect retrievability decay rate', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:169:        stability: 5.0,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:174:        stability: 5.0,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:179:        stability: 5.0,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:197:          stability: 5.0,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:217:    it('T418d: Negative and non-finite stability values still yield finite retrievability', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:221:      for (const stability of [-5, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]) {
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:222:        const r = calcR({ stability, lastReview })
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:231:      const rDay1 = calcR({ stability: 5.0, lastReview: new Date(now - 1000 * 60 * 60 * 24).toISOString() })
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:232:      const rDay7 = calcR({ stability: 5.0, lastReview: new Date(now - 1000 * 60 * 60 * 24 * 7).toISOString() })
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:233:      const rDay30 = calcR({ stability: 5.0, lastReview: new Date(now - 1000 * 60 * 60 * 24 * 30).toISOString() })
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:240:      const rMax = calcR({ stability: 1000.0, lastReview: new Date(now).toISOString() })
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:241:      const rMin = calcR({ stability: 0.01, lastReview: new Date(now - 1000 * 60 * 60 * 24 * 10000).toISOString() })
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:263:        stability: 100.0,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:278:        stability: 0.01,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:294:        stability: 5.0,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:325:        stability: 3.0,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:344:        stability: 50.0,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:354:        stability: 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:373:        stability: 3.0,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:383:          retrievability: 0.05,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:404:    it('T430: get_score_breakdown includes retrievability', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:412:        stability: 5.0,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:418:          retrievability: {
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:426:      expect(breakdown.factors.retrievability).toBeDefined()
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:428:      const rFactor = breakdown.factors.retrievability
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:457:        stability: null,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:476:        stability: 1e-10,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:489:        stability: 1e10,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:533:          stability: Number.NaN,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:540:          stability: Number.POSITIVE_INFINITY,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:564:    it('T440b: NaN, undefined, negative, and Infinity stability inputs stay finite', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:568:        { stability: Number.NaN, lastReview },
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:569:        { stability: undefined, lastReview },
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:570:        { stability: -5, lastReview },
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:571:        { stability: Number.POSITIVE_INFINITY, lastReview },
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:600:          stability: 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:610:          stability: 20.0,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:629:          stability: 50.0,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:639:          stability: 1.0,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:661:          stability: 1.0,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:671:          stability: 50.0,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:681:          stability: 50.0,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:690:    it('T444: Ranking preserves _scoring breakdown with retrievability', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:700:          stability: 5.0,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:707:      expect(typeof ranked[0]._scoring.retrievability).toBe('number')
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:723:    // Note: 'deprecated' is handled separately below due to || operator behavior
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:759:        stability: 5.0,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:801:      // Test with known values: days=10, stability=5
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:803:      const stability = 5
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:804:      const expected = Math.pow(1 + (19 / 81) * days / stability, FSRS_DECAY)
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:807:        stability: stability,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:818:        stability: 5.0,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:941:        stability: 1000.0,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:963:        stability: 0.001,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:999:        { stability: 10, lastReview: new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString() },
.opencode/skill/system-spec-kit/mcp_server/tests/channel-representation.vitest.ts:407:    // Graph is under-represented but could not promote due to quality floor
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:137:    trackAccess: false,
.opencode/skill/system-spec-kit/mcp_server/tests/safety.vitest.ts:121:          stability REAL DEFAULT 1.0,
.opencode/skill/system-spec-kit/mcp_server/tests/safety.vitest.ts:122:          difficulty REAL DEFAULT 5.0,
.opencode/skill/system-spec-kit/mcp_server/tests/safety.vitest.ts:123:          last_review TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/safety.vitest.ts:124:          review_count INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:163:        trackAccess: false,
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:73:      stability REAL DEFAULT 1,
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:74:      difficulty REAL DEFAULT 5,
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:75:      review_count INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:78:      last_review TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:111:      trackAccess: true,
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:225:  it('records adaptive access signals when trackAccess is true and adaptive ranking enabled', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:230:      INSERT INTO memory_index (id, stability, difficulty, review_count, access_count, last_review, created_at)
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:239:      { id: 1, score: 0.9, similarity: 90, stability: 2.5, last_review: '2026-03-01T00:00:00.000Z', created_at: '2026-02-01T00:00:00.000Z' },
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:240:      { id: 2, score: 0.8, similarity: 80, stability: 3.0, last_review: '2026-03-02T00:00:00.000Z', created_at: '2026-02-02T00:00:00.000Z' },
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:260:      INSERT INTO memory_index (id, stability, difficulty, review_count, access_count, last_review, created_at)
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:267:      { id: 1, score: 0.9, similarity: 90, stability: 2.5, last_review: '2026-03-01T00:00:00.000Z', created_at: '2026-02-01T00:00:00.000Z' },
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:25:        stability: 0.1,
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:26:        last_review: '2020-01-01T00:00:00Z',
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:35:        stability: 1.0,
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:36:        last_review: new Date().toISOString(),
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:42:    it('T201-3: Old low-stability memory is COLD/DORMANT/ARCHIVED', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:46:        stability: 0.05,
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:47:        last_review: '2023-01-01T00:00:00Z',
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:55:        { id: 10, importance_tier: 'constitutional', stability: 1.0 },
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:56:        { id: 11, importance_tier: 'normal', stability: 1.0, last_review: new Date().toISOString() },
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:57:        { id: 12, importance_tier: 'normal', stability: 0.05, last_review: '2023-01-01T00:00:00Z', created_at: '2023-01-01T00:00:00Z' },
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:58:        { id: 13, importance_tier: 'temporary', stability: 0.01, last_review: '2022-06-01T00:00:00Z', created_at: '2022-06-01T00:00:00Z' },
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:66:    it('T201-5: classifyTier returns {state, retrievability, effectiveHalfLife}', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:67:      const result = tierClassifier.classifyTier({ id: 20, importance_tier: 'normal', stability: 1.0 });
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:69:      expect(typeof result.retrievability).toBe('number');
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:77:        { id: 30, importance_tier: 'constitutional', stability: 1.0 },
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:78:        { id: 31, importance_tier: 'critical', stability: 1.0 },
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:79:        { id: 32, importance_tier: 'normal', stability: 1.0, last_review: new Date().toISOString() },
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:80:        { id: 33, importance_tier: 'normal', stability: 0.05, last_review: '2023-01-01T00:00:00Z', created_at: '2023-01-01T00:00:00Z' },
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:81:        { id: 34, importance_tier: 'temporary', stability: 0.01, last_review: '2022-01-01T00:00:00Z', created_at: '2022-01-01T00:00:00Z' },
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:90:        { id: 30, importance_tier: 'constitutional', stability: 1.0 },
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:91:        { id: 31, importance_tier: 'critical', stability: 1.0 },
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:92:        { id: 32, importance_tier: 'normal', stability: 1.0, last_review: new Date().toISOString() },
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:93:        { id: 33, importance_tier: 'normal', stability: 0.05, last_review: '2023-01-01T00:00:00Z', created_at: '2023-01-01T00:00:00Z' },
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:94:        { id: 34, importance_tier: 'temporary', stability: 0.01, last_review: '2022-01-01T00:00:00Z', created_at: '2022-01-01T00:00:00Z' },
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:103:        { id: 30, importance_tier: 'constitutional', stability: 1.0 },
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:104:        { id: 31, importance_tier: 'critical', stability: 1.0 },
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:105:        { id: 32, importance_tier: 'normal', stability: 1.0, last_review: new Date().toISOString() },
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:106:        { id: 33, importance_tier: 'normal', stability: 0.05, last_review: '2023-01-01T00:00:00Z', created_at: '2023-01-01T00:00:00Z' },
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:107:        { id: 34, importance_tier: 'temporary', stability: 0.01, last_review: '2022-01-01T00:00:00Z', created_at: '2022-01-01T00:00:00Z' },
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:160:        stability: 1.0,
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:164:      expect(classification.retrievability).toBe(1.0);
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:190:        { memoryId: 40, attentionScore: 0.95, tier: 'HOT', importance_tier: 'constitutional', stability: 1.0, id: 40 },
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:191:        { memoryId: 41, attentionScore: 0.50, tier: 'WARM', importance_tier: 'normal', stability: 1.0, last_review: new Date().toISOString(), id: 41 },
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:192:        { memoryId: 42, attentionScore: 0.10, tier: 'COLD', importance_tier: 'normal', stability: 0.05, last_review: '2023-01-01', created_at: '2023-01-01', id: 42 },
.opencode/skill/system-spec-kit/mcp_server/tests/decay.vitest.ts:63:  it('calculateRetrievability with Infinity stability returns 1.0 regardless of elapsed days', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/decay.vitest.ts:102:  it('applyClassificationDecay halves stability for temporary (flag=true)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/decay.vitest.ts:110:  it('temporary decays faster than normal: retrievability at 30 days', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/decay.vitest.ts:139:  it('research + normal = 2.0 stability increase (slower decay than standard)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/decay.vitest.ts:148:      // Higher stability = higher retrievability at same elapsed time
.opencode/skill/system-spec-kit/mcp_server/tests/decay.vitest.ts:178:  it('applyClassificationDecay with unknown types returns unchanged stability', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/decay.vitest.ts:196:  it('flag="false" → applyClassificationDecay returns stability unchanged', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/decay.vitest.ts:213:  it('flag="0" → applyClassificationDecay returns stability unchanged', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:417:    // Wait for stability + debounce + buffer to settle
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:206:    hint: 'Failed to read file due to encoding issues.',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:255:    hint: 'Database transaction failed (possibly due to concurrent access).',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:59:        stability REAL DEFAULT 1.0,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:60:        difficulty REAL DEFAULT 5.0,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:61:        last_review TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:62:        review_count INTEGER DEFAULT 0
.opencode/skill/system-spec-kit/mcp_server/tests/flag-ceiling.vitest.ts:4:// TEST: Validates system stability when 6+ SPECKIT_* flags are
.opencode/skill/system-spec-kit/mcp_server/tests/mmr-reranker.vitest.ts:66:    // #1 always first (highest score). #3 or #4 should appear before #2 due to diversity.
.opencode/skill/system-spec-kit/mcp_server/tests/unit-tier-classifier-types.vitest.ts:20:      expect(typeof r.retrievability).toBe('number');
.opencode/skill/system-spec-kit/mcp_server/tests/unit-tier-classifier-types.vitest.ts:27:      expect(r.retrievability).toBe(1.0);
.opencode/skill/system-spec-kit/mcp_server/tests/unit-tier-classifier-types.vitest.ts:71:        stability: 5.0,
.opencode/skill/system-spec-kit/mcp_server/tests/unit-tier-classifier-types.vitest.ts:87:        stability: 3.0,
.opencode/skill/system-spec-kit/mcp_server/tests/unit-tier-classifier-types.vitest.ts:93:        retrievability: 0.6,
.opencode/skill/system-spec-kit/mcp_server/tests/unit-tier-classifier-types.vitest.ts:114:        { id: 1, importance_tier: 'constitutional', stability: 1.0, spec_folder: 'specs/001' },
.opencode/skill/system-spec-kit/mcp_server/tests/unit-tier-classifier-types.vitest.ts:116:        { id: 2, importanceTier: 'critical', stability: 1.0, specFolder: 'specs/002' },
.opencode/skill/system-spec-kit/mcp_server/tests/unit-tier-classifier-types.vitest.ts:120:        { id: 4, importance_tier: 'normal', stability: 100, created_at: new Date().toISOString(), similarity: 0.9 },
.opencode/skill/system-spec-kit/mcp_server/tests/unit-tier-classifier-types.vitest.ts:130:        { id: 1, importance_tier: 'constitutional', stability: 1.0 },
.opencode/skill/system-spec-kit/mcp_server/tests/unit-tier-classifier-types.vitest.ts:131:        { id: 2, importance_tier: 'normal', stability: 0.01, created_at: new Date(Date.now() - 365 * 86400000).toISOString(), half_life_days: 0.001 },
.opencode/skill/system-spec-kit/mcp_server/tests/unit-tier-classifier-types.vitest.ts:150:        { id: 1, importance_tier: 'constitutional', stability: 1.0 },
.opencode/skill/system-spec-kit/mcp_server/tests/unit-tier-classifier-types.vitest.ts:151:        { id: 2, importance_tier: 'critical', stability: 1.0 },
.opencode/skill/system-spec-kit/mcp_server/tests/unit-tier-classifier-types.vitest.ts:163:        { id: 2, importance_tier: 'normal', stability: 100, created_at: new Date().toISOString(), content: 'text' },
.opencode/skill/system-spec-kit/mcp_server/tests/unit-tier-classifier-types.vitest.ts:182:        { id: 1, title: 'Test One', spec_folder: 'specs/001', file_path: '/a.md', importance_tier: 'constitutional', stability: 1.0 },
.opencode/skill/system-spec-kit/mcp_server/tests/unit-tier-classifier-types.vitest.ts:183:        { id: 2, title: 'Test Two', specFolder: 'specs/002', filePath: '/b.md', importanceTier: 'normal', stability: 100, created_at: new Date().toISOString() },
.opencode/skill/system-spec-kit/mcp_server/tests/unit-tier-classifier-types.vitest.ts:192:        'id' in e && 'title' in e && 'state' in e && 'retrievability' in e
.opencode/skill/system-spec-kit/mcp_server/tests/unit-tier-classifier-types.vitest.ts:200:        { id: 99, importance_tier: 'constitutional', stability: 1.0, extraField: 'hello' },
.opencode/skill/system-spec-kit/mcp_server/tests/unit-tier-classifier-types.vitest.ts:217:        stability: 0.01,
.opencode/skill/system-spec-kit/mcp_server/tests/unit-tier-classifier-types.vitest.ts:230:        stability: 0.01,
.opencode/skill/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:84:    trackAccess: false,
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
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:98:        stability REAL DEFAULT 1.0,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:99:        difficulty REAL DEFAULT 5.0,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:100:        last_review TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:101:        review_count INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:98:  it('T4: title match scores higher due to 10x weight', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:38:      stability REAL DEFAULT 1.0,
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:39:      difficulty REAL DEFAULT 5.0,
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:76:    INSERT INTO memory_index (id, title, stability)
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:146:  // --- T053: Record correction with stability penalty ---------
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:150:      const originalBefore = db.prepare('SELECT stability FROM memory_index WHERE id = 1').get() as { stability: number };
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:163:      // Verify stability penalty applied to original (0.5x)
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:164:      const originalAfter = db.prepare('SELECT stability FROM memory_index WHERE id = 1').get() as { stability: number };
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:165:      const expectedPenalty: number = originalBefore.stability * corrections.CORRECTION_STABILITY_PENALTY;
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:167:      expect(originalAfter.stability).toBeCloseTo(expectedPenalty, 3);
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:172:      const correctionAfter = db.prepare('SELECT stability FROM memory_index WHERE id = 3').get() as { stability: number };
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:175:      expect(correctionAfter.stability).toBeCloseTo(expectedBoost, 3);
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:188:      expect(correctionRecord!.original_stability_before).toBe(10.0);
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:217:    it('CHK-070: undo restores stability and marks correction as undone', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:218:      const memory1BeforeUndo = db.prepare('SELECT stability FROM memory_index WHERE id = 1').get() as { stability: number };
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:221:        SELECT id, original_stability_before FROM memory_corrections
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:224:      `).get() as { id: number; original_stability_before: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:234:      // Verify stability restored
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:235:      const memory1AfterUndo = db.prepare('SELECT stability FROM memory_index WHERE id = 1').get() as { stability: number };
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:236:      expect(memory1AfterUndo.stability).toBeCloseTo(correctionToUndo.original_stability_before, 3);
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:251:      db.prepare(`INSERT OR REPLACE INTO memory_index (id, title, stability) VALUES (?, 'Undo Original', 9.0)`).run(originalId);
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:252:      db.prepare(`INSERT OR REPLACE INTO memory_index (id, title, stability) VALUES (?, 'Undo Correction', 9.0)`).run(correctionId);
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:293:      db.prepare(`INSERT OR REPLACE INTO memory_index (id, title, stability) VALUES (?, 'Legacy Undo Original', 9.0)`).run(originalId);
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:294:      db.prepare(`INSERT OR REPLACE INTO memory_index (id, title, stability) VALUES (?, 'Legacy Undo Correction', 9.0)`).run(correctionId);
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:430:        'original_stability_before',
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:431:        'original_stability_after',
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:432:        'correction_stability_before',
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:433:        'correction_stability_after',
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:504:  describe('T144: record_correction() applies 0.5x stability penalty', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:511:        INSERT OR REPLACE INTO memory_index (id, title, stability)
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:516:        INSERT OR REPLACE INTO memory_index (id, title, stability)
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:532:      const after = db.prepare('SELECT stability FROM memory_index WHERE id = ?').get(testOriginalId) as { stability: number };
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:535:      expect(after.stability).toBeCloseTo(expected, 3);
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:538:    it('T144: stability_changes correctly reports penalty application', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:544:      db.prepare(`INSERT OR REPLACE INTO memory_index (id, title, stability) VALUES (?, 'T144b Original', ?)`).run(origId, origStab);
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:545:      db.prepare(`INSERT OR REPLACE INTO memory_index (id, title, stability) VALUES (?, 'T144b Correction', ?)`).run(corrId, 10.0);
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:555:      expect(result.stability_changes).toBeDefined();
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:556:      expect(result.stability_changes!.original.before).toBe(origStab);
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:557:      expect(result.stability_changes!.original.after).toBeCloseTo(origStab * 0.5, 3);
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:558:      expect(result.stability_changes!.original.penalty_applied).toBe(0.5);
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:591:        INSERT OR REPLACE INTO memory_index (id, title, stability)
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:596:        INSERT OR REPLACE INTO memory_index (id, title, stability)
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:610:      const after = db.prepare('SELECT stability FROM memory_index WHERE id = ?').get(testCorrectionId) as { stability: number };
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:613:      expect(after.stability).toBeCloseTo(expected, 3);
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:616:    it('T146: stability_changes correctly reports boost application', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:621:      db.prepare(`INSERT OR REPLACE INTO memory_index (id, title, stability) VALUES (?, 'T146b Original', 10.0)`).run(testOriginalId);
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:622:      db.prepare(`INSERT OR REPLACE INTO memory_index (id, title, stability) VALUES (?, 'T146b Correction', ?)`).run(testCorrectionId, correctionInitialStability);
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:632:      expect(result.stability_changes!.correction).toBeDefined();
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:633:      expect(result.stability_changes!.correction!.before).toBe(correctionInitialStability);
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:634:      expect(result.stability_changes!.correction!.after).toBeCloseTo(correctionInitialStability * 1.2, 3);
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:635:      expect(result.stability_changes!.correction!.boost_applied).toBe(1.2);
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:653:        db.prepare(`INSERT OR REPLACE INTO memory_index (id, title, stability) VALUES (?, ?, 10.0)`)
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:656:          db.prepare(`INSERT OR REPLACE INTO memory_index (id, title, stability) VALUES (?, ?, 10.0)`)
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts:65:    it('T507-01: trackAccess returns true on accumulate', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts:66:      const result1 = mod.trackAccess(1);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts:70:    it('T507-01b: Accumulator state updated after trackAccess', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts:85:        mod.trackAccess(2);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts:89:      mod.trackAccess(2);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts:169:      mod.trackAccess(1);
.opencode/skill/system-spec-kit/mcp_server/tests/eval-db.vitest.ts:161:      expect(cols).toContain('difficulty');
.opencode/skill/system-spec-kit/mcp_server/tests/eval-db.vitest.ts:223:        INSERT INTO eval_queries (query, intent, difficulty)
.opencode/skill/system-spec-kit/mcp_server/tests/eval-db.vitest.ts:284:        INSERT INTO eval_queries (query, intent, difficulty, category)
.opencode/skill/system-spec-kit/mcp_server/tests/eval-db.vitest.ts:295:      expect(row.difficulty).toBe('medium');
.opencode/skill/system-spec-kit/mcp_server/tests/eval-db.vitest.ts:299:    it('T004-23: difficulty defaults to medium when not specified', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/eval-db.vitest.ts:304:      `).run('default difficulty test');
.opencode/skill/system-spec-kit/mcp_server/tests/eval-db.vitest.ts:307:        SELECT difficulty FROM eval_queries WHERE id = ?
.opencode/skill/system-spec-kit/mcp_server/tests/eval-db.vitest.ts:308:      `).get(insertResult.lastInsertRowid) as { difficulty: string };
.opencode/skill/system-spec-kit/mcp_server/tests/eval-db.vitest.ts:310:      expect(row.difficulty).toBe('medium');
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:56:      stability REAL DEFAULT 1.0,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:57:      difficulty REAL DEFAULT 5.0,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:58:      last_review TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:59:      review_count INTEGER DEFAULT 0
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:149:      stability REAL DEFAULT 1.0,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:150:      difficulty REAL DEFAULT 5.0,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:151:      last_review TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:152:      review_count INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:441:          stability REAL DEFAULT 1.0, difficulty REAL DEFAULT 5.0,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:442:          last_review TEXT, review_count INTEGER DEFAULT 0
.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-scoring-calibration.vitest.ts:223:  // T041-16: applyClassificationDecay with flag enabled adjusts stability
.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-scoring-calibration.vitest.ts:224:  it('T041-16: flag enabled adjusts stability by combined multiplier', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-scoring-calibration.vitest.ts:234:  // T041-17: Flag explicitly disabled → stability unchanged
.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-scoring-calibration.vitest.ts:235:  it('T041-17: flag disabled returns stability unchanged', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:458:    expect(FEEDBACK_SCHEMA_SQL).not.toContain('stability');
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:459:    expect(FEEDBACK_SCHEMA_SQL).not.toContain('retrievability');
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:461:    expect(FEEDBACK_INDEX_SQL).not.toContain('stability');
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:699:    expect(BATCH_LEARNING_LOG_SCHEMA_SQL).not.toContain('stability');
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:700:    expect(BATCH_LEARNING_LOG_SCHEMA_SQL).not.toContain('retrievability');
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:710:    expect(result).not.toHaveProperty('stabilityUpdated');
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts:46:    difficulty TEXT DEFAULT 'medium',
.opencode/skill/system-spec-kit/mcp_server/tests/learned-combiner.vitest.ts:730:      // relatively high importance (not necessarily #1 due to feature variance)
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:645:    // The substance check should pass due to word count even if chars < 250
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:911:    // Sufficiency should fail due to no primary evidence
.opencode/skill/system-spec-kit/mcp_server/tests/unit-folder-scoring-types.vitest.ts:27:    stability: 3.0,
.opencode/skill/system-spec-kit/mcp_server/tests/unit-folder-scoring-types.vitest.ts:41:    stability: 3.0,
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:30:      stability REAL DEFAULT 1.0,
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:31:      difficulty REAL DEFAULT 5.0,
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:63:  stability = 1.0,
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:66:    INSERT INTO memory_index (id, spec_folder, file_path, title, stability)
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:68:  `).run(memoryId, `memory-${memoryId}.md`, title, stability);
.opencode/skill/system-spec-kit/mcp_server/tests/unit-composite-scoring-types.vitest.ts:20:    it('T-CS-01: only stability field', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/unit-composite-scoring-types.vitest.ts:21:      const r = calculateRetrievabilityScore({ stability: 5.0 });
.opencode/skill/system-spec-kit/mcp_server/tests/unit-composite-scoring-types.vitest.ts:46:        stability: 5.0,
.opencode/skill/system-spec-kit/mcp_server/tests/unit-composite-scoring-types.vitest.ts:102:        { id: 1, importance_tier: 'constitutional', stability: 100, similarity: 90 },
.opencode/skill/system-spec-kit/mcp_server/tests/unit-composite-scoring-types.vitest.ts:137:          stability: 5.0,
.opencode/skill/system-spec-kit/mcp_server/tests/unit-composite-scoring-types.vitest.ts:155:          stability: 5.0,
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:58:        stability REAL DEFAULT 1.0,
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:59:        difficulty REAL DEFAULT 5.0,
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:60:        last_review TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:61:        review_count INTEGER DEFAULT 0
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:5:// Measures the impact of different RRF K-values on ranking stability.
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:336:      id, original_memory_id, correction_memory_id, correction_type, original_stability_before,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:337:      original_stability_after, correction_stability_before, correction_stability_after, reason, corrected_by, created_at
.opencode/skill/system-spec-kit/mcp_server/tests/temporal-contiguity.vitest.ts:46:        stability REAL DEFAULT 1.0,
.opencode/skill/system-spec-kit/mcp_server/tests/temporal-contiguity.vitest.ts:47:        difficulty REAL DEFAULT 5.0,
.opencode/skill/system-spec-kit/mcp_server/tests/temporal-contiguity.vitest.ts:48:        last_review TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/temporal-contiguity.vitest.ts:49:        review_count INTEGER DEFAULT 0
.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:86:        // Should not fail due to missing session
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fallback.vitest.ts:27: * Adaptive fallback logic extracted for testability.
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:46:    const status = determineSessionStatus('Build failing due to missing dependency', [], 5);
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-limit.vitest.ts:38:        stability REAL DEFAULT 1.0,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-limit.vitest.ts:39:        difficulty REAL DEFAULT 5.0,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-limit.vitest.ts:40:        last_review TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-limit.vitest.ts:41:        review_count INTEGER DEFAULT 0
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator-swap.vitest.ts:147:      stability REAL,
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator-swap.vitest.ts:148:      difficulty REAL,
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator-swap.vitest.ts:149:      review_count INTEGER,
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:50:  stability_changes?: StabilityChanges;
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:61:  original_stability_before: number;
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:62:  original_stability_after: number;
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:63:  correction_stability_before: number | null;
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:64:  correction_stability_after: number | null;
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:133:  stability_restored?: {
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:264:    original_stability_before REAL,
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:265:    original_stability_after REAL,
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:266:    correction_stability_before REAL,
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:267:    correction_stability_after REAL,
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:325:function get_memory_stability(memory_id: number): number | null {
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:332:      SELECT stability FROM memory_index WHERE id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:333:    `).get(memory_id) as { stability?: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:335:    return row ? (row.stability || 1.0) : null;
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:337:    console.warn(`[corrections] Could not get stability for memory ${memory_id}: ${get_error_message(error)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:342:function set_memory_stability(memory_id: number, new_stability: number): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:348:    // Clamp stability to valid range
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:349:    const clamped_stability = Math.max(0.1, Math.min(365, new_stability));
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:353:      SET stability = ?,
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:356:    `).run(clamped_stability, memory_id);
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:360:    console.warn(`[corrections] Could not update stability for memory ${memory_id}: ${get_error_message(error)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:433:  // Get current stability values
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:434:  const original_stability_before = get_memory_stability(original_memory_id);
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:435:  if (original_stability_before === null) {
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:439:  let correction_stability_before: number | null = null;
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:441:    correction_stability_before = get_memory_stability(correction_memory_id);
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:442:    if (correction_stability_before === null) {
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:449:    // Apply stability penalty to original memory (T053: 0.5x penalty)
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:450:    const original_stability_after = original_stability_before * CORRECTION_STABILITY_PENALTY;
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:451:    set_memory_stability(original_memory_id, original_stability_after);
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:453:    // Apply stability boost to correction memory if exists (T055: 1.2x boost)
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:454:    let correction_stability_after: number | null = null;
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:455:    if (correction_memory_id && correction_stability_before !== null) {
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:456:      correction_stability_after = correction_stability_before * REPLACEMENT_STABILITY_BOOST;
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:457:      set_memory_stability(correction_memory_id, correction_stability_after);
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:467:        original_stability_before,
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:468:        original_stability_after,
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:469:        correction_stability_before,
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:470:        correction_stability_after,
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:481:      original_stability_before,
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:482:      original_stability_after,
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:483:      correction_stability_before,
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:484:      correction_stability_after,
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:526:      stability_changes: {
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:528:          before: original_stability_before,
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:529:          after: original_stability_after,
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:533:          before: correction_stability_before as number,
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:534:          after: correction_stability_after as number,
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:587:    // Restore original memory stability
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:588:    if (correction.original_stability_before !== null) {
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:589:      set_memory_stability(
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:591:        correction.original_stability_before
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:595:    // Restore correction memory stability
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:596:    if (correction.correction_memory_id && correction.correction_stability_before !== null) {
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:597:      set_memory_stability(
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:599:        correction.correction_stability_before
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:665:      stability_restored: {
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:666:        original: correction.original_stability_before,
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:667:        correction: correction.correction_stability_before
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:75:    it('T603: GRADE_GOOD increases stability', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:77:      const reviewed = fsrsScheduler.processReview(initial, fsrsScheduler.GRADE_GOOD);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:78:      expect(reviewed.stability).toBeGreaterThan(initial.stability);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:81:    it('T604: Stability multiplier applied with difficulty bonus', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:104:    it('T613: R = 1.0 gives zero difficulty bonus', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:132:    it('T618: Combined boost = base_stability * (1 + difficultyBonus)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:134:      const difficultyBonus = Math.max(0, (0.9 - 0.2) * 0.5);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:135:      const combined = baseStability * (1 + difficultyBonus);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:139:    it('T619: FSRS stability bounds (0.1 to 365) respected', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:140:      const reviewed = fsrsScheduler.processReview({
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:141:        stability: 0.01,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:142:        difficulty: 5,
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
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:306:      expect(STAGE2_SOURCE).toContain('SET stability = ?,');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:307:      expect(STAGE2_SOURCE).toContain('review_count = review_count + 1');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:316:    it('normalizes invalid retrievability inputs back to 0.9', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts:46:          stability REAL,
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts:47:          difficulty REAL,
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts:48:          last_review TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts:52:        CREATE INDEX idx_stability ON memory_index(stability DESC);
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts:53:        CREATE INDEX idx_last_review ON memory_index(last_review);
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts:54:        CREATE INDEX idx_fsrs_retrieval ON memory_index(stability, difficulty, last_review);
.opencode/skill/system-spec-kit/mcp_server/tests/schema-migration.vitest.ts:15:    it('T702: stability column exists on memory_index', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/schema-migration.vitest.ts:19:    it('T703: difficulty column exists on memory_index', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/schema-migration.vitest.ts:23:    it('T704: last_review column exists on memory_index', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/schema-migration.vitest.ts:27:    it('T705: review_count column exists on memory_index', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/schema-migration.vitest.ts:31:    it('T706: stability has REAL type', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/schema-migration.vitest.ts:35:    it('T707: difficulty has REAL type', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/schema-migration.vitest.ts:39:    it('T708: last_review has TEXT type', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/schema-migration.vitest.ts:43:    it('T709: review_count has INTEGER type', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/schema-migration.vitest.ts:48:      const fsrsColumns = ['stability', 'difficulty', 'last_review', 'review_count'];
.opencode/skill/system-spec-kit/mcp_server/tests/schema-migration.vitest.ts:54:    it('T711: New memory gets stability = 1.0', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/schema-migration.vitest.ts:58:    it('T712: New memory gets difficulty = 5.0', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/schema-migration.vitest.ts:62:    it('T713: New memory gets review_count = 0', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/schema-migration.vitest.ts:66:    it('T714: last_review can be NULL initially', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/schema-migration.vitest.ts:74:    it('T716: Can explicitly set stability value', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/schema-migration.vitest.ts:78:    it('T717: Can explicitly set difficulty value', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/schema-migration.vitest.ts:82:    it('T718: Can set last_review to ISO timestamp', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/schema-migration.vitest.ts:86:    it('T719: Can update review_count incrementally', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/schema-migration.vitest.ts:204:    it('T747: idx_stability index exists', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/schema-migration.vitest.ts:223:    it('idx_stability index exists', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/schema-migration.vitest.ts:227:    it('idx_last_review index exists', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:99: * Calculate retrievability-based decay using FSRS formula.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:101:function calculateRetrievabilityDecay(stability: number, elapsedDays: number): number {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:103:    return fsrsScheduler.calculateRetrievability(stability, elapsedDays);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:106:  if (stability <= 0 || elapsedDays < 0) return 0;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:107:  return Math.pow(1 + fsrsScheduler.FSRS_FACTOR * (elapsedDays / stability), fsrsScheduler.FSRS_DECAY);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:119:  const stability = (memory.stability as number) || 1.0;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:120:  const lastReview = (memory.last_review || memory.created_at) as string | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:130:  const retrievability = calculateRetrievabilityDecay(stability, elapsedDays);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:131:  return baseScore * retrievability;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:166:    const memory = (db.prepare('SELECT stability, difficulty, last_review, review_count FROM memory_index WHERE id = ?') as Database.Statement).get(memoryId) as Record<string, unknown> | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:170:      stability: (memory.stability as number) || 1.0,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:171:      difficulty: (memory.difficulty as number) || 5.0,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:172:      lastReview: (memory.last_review as string) || null,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:173:      reviewCount: (memory.review_count as number) || 0,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:178:      result = fsrsScheduler.processReview(params, grade);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:182:        stability: params.stability * 1.1,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:183:        difficulty: params.difficulty,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:186:        nextReviewDate: new Date().toISOString(),
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:187:        retrievability: 1.0,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:193:      SET stability = ?,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:194:          difficulty = ?,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:195:          last_review = ?,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:196:          review_count = ?,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:201:      result.stability,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:202:      result.difficulty,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:7:// Import FSRS constants and canonical retrievability function.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:37:// 5-State Model thresholds based on FSRS retrievability R = (1 + FACTOR * t / S)^DECAY
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:195: * Convert half-life in days to FSRS stability value.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:197: * FSRS v4 retrievability: R(t) = (1 + FACTOR * t / S)^DECAY
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:205: * which yielded stability ~18.5x too high for the FSRS power-law model.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:209:    return 999999; // Effectively infinite stability (no decay)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:221: * Calculate retrievability using FSRS formula.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:224:function calculateRetrievability(stability: number, elapsedDays: number): number {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:225:  if (stability <= 0 || elapsedDays < 0) return 0;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:226:  return calculateFsrsRetrievability(stability, elapsedDays);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:230: * Classify memory into 5-state model based on retrievability.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:233: *   - Two numbers: classifyState(retrievability, elapsedDays)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:235: *     retrievability, attentionScore, or defaults to 0
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:239:  retrievabilityOrMemory: number | TierInput | null | undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:245:  if (retrievabilityOrMemory === null || retrievabilityOrMemory === undefined) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:249:  if (typeof retrievabilityOrMemory === 'number') {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:251:    r = retrievabilityOrMemory;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:253:  } else if (typeof retrievabilityOrMemory === 'object') {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:255:    const mem = retrievabilityOrMemory as Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:256:    if (typeof mem.retrievability === 'number') {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:257:      r = mem.retrievability;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:264:    const timestamp = mem.lastAccess || mem.last_accessed || mem.lastReview || mem.last_review || mem.created_at;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:276:  // ARCHIVED requires BOTH conditions: old age AND very low retrievability
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:293:  retrievability: number;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:296:  const stability = memory.stability ?? 1.0;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:297:  const lastReview = memory.last_review || memory.created_at;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:302:    return { state: 'HOT', retrievability: 1.0, effectiveHalfLife: null };
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:307:    return { state: 'HOT', retrievability: 1.0, effectiveHalfLife };
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:318:  // Use effective stability from half-life.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:319:  // Math.max ensures new memories (default stability=1.0) benefit from their
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:321:  // Earned FSRS stability if it exceeds the type baseline.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:323:  const finalStability = Math.max(stability, effectiveStability);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:325:  const retrievability = calculateRetrievability(finalStability, elapsedDays);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:326:  const state = classifyState(retrievability, elapsedDays);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:328:  return { state, retrievability, effectiveHalfLife };
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:454:  retrievability: number;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:464:      retrievability: Math.round(classification.retrievability * 100) / 100,
.opencode/skill/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:544:      const retrievability = calculateRetrievabilityScore({
.opencode/skill/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:548:        stability: 1.0,
.opencode/skill/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:550:      expect(retrievability).toBeGreaterThan(0);
.opencode/skill/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:551:      expect(retrievability).toBeLessThan(0.5);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:43:      stability REAL DEFAULT 1.0,
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:45:      last_review TEXT
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:127:  it('B-03: higher stability pushes review further out', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:139:  it('B-05: very low stability still returns future date', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:155:    expect(params).toHaveProperty('stability');
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:156:    expect(params).toHaveProperty('difficulty');
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:161:  it('C-02: stability matches DEFAULT_INITIAL_STABILITY', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:163:    expect(params.stability).toBe(fsrs.DEFAULT_INITIAL_STABILITY);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:166:  it('C-03: difficulty matches DEFAULT_INITIAL_DIFFICULTY', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:168:    expect(params.difficulty).toBe(fsrs.DEFAULT_INITIAL_DIFFICULTY);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:185:    a.stability = 999;
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:186:    expect(b.stability).not.toBe(999);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:202:    const result = fsrs.processReview(initial, 3);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:203:    expect(result).toHaveProperty('stability');
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:204:    expect(result).toHaveProperty('difficulty');
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:207:    expect(result).toHaveProperty('nextReviewDate');
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:208:    expect(result).toHaveProperty('retrievability');
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:212:    const result = fsrs.processReview(initial, 3);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:218:    const result = fsrs.processReview(initial, 3);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:224:  it('D-04: grade AGAIN decreases stability', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:225:    const params = { ...initial, stability: 5.0, lastReview: new Date().toISOString(), reviewCount: 1 };
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:226:    const result = fsrs.processReview(params, fsrs.GRADE_AGAIN);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:227:    expect(result.stability).toBeLessThan(params.stability);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:230:  it('D-05: grade EASY increases stability', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:232:    const result = fsrs.processReview(params, fsrs.GRADE_EASY);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:233:    expect(result.stability).toBeGreaterThan(initial.stability);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:236:  it('D-06: grade GOOD increases stability', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:238:    const result = fsrs.processReview(params, fsrs.GRADE_GOOD);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:239:    expect(result.stability).toBeGreaterThan(initial.stability);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:242:  it('D-07: grade HARD gives <= stability than GOOD', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:244:    const resultHard = fsrs.processReview(params, fsrs.GRADE_HARD);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:245:    const resultGood = fsrs.processReview(params, fsrs.GRADE_GOOD);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:246:    expect(resultHard.stability).toBeLessThanOrEqual(resultGood.stability);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:249:  it('D-08: nextReviewDate is valid future date', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:250:    const result = fsrs.processReview(initial, 3);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:251:    const nextDate = new Date(result.nextReviewDate);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:256:  it('D-09: retrievability is in [0, 1]', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:257:    const result = fsrs.processReview(initial, 3);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:258:    expect(result.retrievability).toBeGreaterThanOrEqual(0);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:259:    expect(result.retrievability).toBeLessThanOrEqual(1);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:264:    const result1 = fsrs.processReview(params, 3);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:265:    const result2 = fsrs.processReview(result1, 4);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:267:    expect(result2.stability).toBeGreaterThan(0);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:21:// Where t = elapsed days, S = stability (grows with successful reviews).
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:35:// Derived constant for half-life ↔ stability conversion.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:59:  stability: number;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:60:  difficulty: number;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:66:  stability: number;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:67:  difficulty: number;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:70:  nextReviewDate: string;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:71:  retrievability: number;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:77: * Calculate retrievability (probability of recall) using FSRS v4 formula.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:80:function calculateRetrievability(stability: number, elapsedDays: number): number {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:81:  if (stability <= 0 || elapsedDays < 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:85:  const retrievability = Math.pow(
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:86:    1 + FSRS_FACTOR * (elapsedDays / stability),
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:90:  return Math.max(0, Math.min(1, retrievability));
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:94: * Update stability based on review grade.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:99:  difficulty: number,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:101:  retrievability: number
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:104:  const safeDifficulty = Math.max(MIN_DIFFICULTY, Math.min(MAX_DIFFICULTY, difficulty));
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:107:    // Lapse: stability decreases significantly
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:111:  // Success: stability increases based on grade and difficulty
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:112:  const difficultyFactor = 1 + (11 - safeDifficulty) * 0.1;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:114:  const retrievabilityBonus = 1 + (1 - retrievability) * 0.5;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:116:  const newStability = safeStability * difficultyFactor * gradeFactor * retrievabilityBonus;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:122: * Calculate optimal review interval from stability.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:123: * The interval where retrievability = 0.9 (desired retention).
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:125:function calculateOptimalInterval(stability: number, desiredRetention: number = 0.9): number {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:126:  const safeStability = Math.max(0, stability);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:138: * Update difficulty based on review grade.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:175: * Get next review date based on stability and desired retention.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:177:function getNextReviewDate(stability: number, desiredRetention: number = 0.9): string {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:178:  const intervalDays = calculateOptimalInterval(stability, desiredRetention);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:190:    stability: DEFAULT_INITIAL_STABILITY,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:191:    difficulty: DEFAULT_INITIAL_DIFFICULTY,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:200:function processReview(params: FsrsParams, grade: number): ReviewResult {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:202:  const retrievability = calculateRetrievability(params.stability, elapsedDays);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:204:  const newStability = updateStability(params.stability, params.difficulty, grade, retrievability);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:205:  const newDifficulty = updateDifficulty(params.difficulty, grade);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:207:  const nextReviewDate = getNextReviewDate(newStability);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:210:    stability: newStability,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:211:    difficulty: newDifficulty,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:214:    nextReviewDate,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:215:    retrievability,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:238: * C138: Tier-based decay multipliers for long-term memory stability.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:244: * IMPORTANCE_TIER_STABILITY_MULTIPLIER below, which operates on the FSRS stability
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:248: *     (stability adjustment, activated via SPECKIT_CLASSIFICATION_DECAY env var)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:261:   Multiplies FSRS stability so that:
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:262:     - Infinity stability → R(t) = 1.0 always (no decay)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:263:     - >1.0 stability multiplier → slower decay
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:264:     - <1.0 stability multiplier → faster decay */
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:267: * TM-03: Context-type stability multipliers.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:268: * Applied to the FSRS stability parameter before computing retrievability.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:269: * Infinity = no decay (retrievability always 1.0).
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:270: * 2.0 = stability doubled → slower decay.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:275:  research: 2.0,         // 2x stability — research context decays slower
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:287: * TM-03: Importance-tier stability multipliers.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:288: * Parallel to TIER_MULTIPLIER but operates on stability (not elapsed time).
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:292: * important: 1.5x stability → slower decay.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:307: * TM-03: Compute combined stability multiplier from context_type and importance_tier.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:315: * When the result is Infinity, callers should treat stability as Infinity,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:320: * @returns Combined stability multiplier (may be Infinity)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:335: * TM-03: Apply classification-based decay to a stability value.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:338: * Returns stability unchanged when the feature flag is disabled.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:341: * @param stability      Base FSRS stability value
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:344: * @returns Adjusted stability value
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:347:  stability: number,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:358:    return stability;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:366:  return stability * multiplier;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:374:      These represent permanent knowledge artifacts. Their stability is treated as
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:440: * REQ-D4-002: Apply the hybrid decay policy to a stability value.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:442: * When SPECKIT_HYBRID_DECAY_POLICY is OFF (default), returns stability unchanged.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:445: *   - all others → returns stability unchanged (normal FSRS schedule)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:447: * @param stability    Base FSRS stability value
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:449: * @returns Adjusted stability: Infinity for no-decay types, original otherwise
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:451:function applyHybridDecayPolicy(stability: number, contextType: string, importanceTier?: string): number {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:453:  return Number.isFinite(multiplier) ? stability * multiplier : NO_DECAY;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:460:  FSRS_HALF_LIFE_FACTOR, // T301: derived constant for half-life ↔ stability
.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:109:      // Large folder still wins here due to volume, but damping reduces its advantage
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:45:        stability: null,
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:46:        difficulty: null,
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:47:        last_review: null,
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:48:        review_count: null,
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:89:      const memory = partialDbRowToMemory({ id: 5, importance_tier: 'normal', stability: 3.0 });
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:136:        stability: null,
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:137:        last_review: null,
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:155:    it('T-NR-08c: stability null stays null', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:158:        stability: null, is_pinned: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:162:      expect(memory.stability).toBeNull();
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:168:        last_review: null, is_pinned: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:180:    it('T-NR-09b: missing stability → undefined', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:182:      expect(memory.stability).toBeUndefined();
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:70:/** Re-check weekly due status every hour while the server is running. */
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:181: * Determine whether a new weekly evaluation cycle is due.
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:239:    trackAccess: false,
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:385: * Run one fail-safe production shadow evaluation cycle when a weekly run is due.
.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:253:    awaitWriteFinish: { stabilityThreshold: 1000 },
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:67:  'stability',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:68:  'difficulty',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:69:  'last_review',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:70:  'review_count',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:143:      stability REAL DEFAULT 1.0,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:144:      difficulty REAL DEFAULT 5.0,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:145:      last_review TEXT,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:146:      review_count INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:186:    CREATE INDEX IF NOT EXISTS idx_stability ON memory_index(stability DESC);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:187:    CREATE INDEX IF NOT EXISTS idx_last_review ON memory_index(last_review);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:188:    CREATE INDEX IF NOT EXISTS idx_fsrs_retrieval ON memory_index(stability, difficulty, last_review);
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:115:  /** Memories skipped due to insufficient session support. */
.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts:86:function trackAccess(memoryId: number): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts:328:  trackAccess,
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:27:// COGNITIVE-079: FSRS Scheduler for retrievability calculations
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:30:  calculateRetrievability: (stability: number, elapsedDays: number) => number;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:31:  applyClassificationDecay?: (stability: number, contextType: string, importanceTier: string) => number;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:104:  retrievability: number;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:142:    retrievability: FactorDetail;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:176:  retrievability: 0.15,
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:214:function applyClassificationDecayFallback(stability: number, contextType: string, importanceTier: string): number {
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:222:  return stability * contextMult * tierMult;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:296: * T032: Calculate temporal/retrievability score (REQ-017 Factor 1)
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:301:  let stability = (row.stability as number | undefined) || 1.0;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:302:  if (!isFinite(stability)) stability = 1.0;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:303:  const lastReview = (row.lastReview as string | undefined) || (row.last_review as string | undefined) || row.updated_at || row.created_at;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:327:  // TM-03: Classification decay applies at stability-level; when enabled do not
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:329:  let adjustedStability = stability;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:332:      adjustedStability = scheduler.applyClassificationDecay(stability, contextType, tier);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:334:      adjustedStability = applyClassificationDecayFallback(stability, contextType, tier);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:357:  const retrievability = Math.pow(1 + FSRS_FACTOR * (adjustedElapsedDays / adjustedStability), FSRS_DECAY);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:358:  const score = Math.max(0, Math.min(1, retrievability));
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:590: * temporal (FSRS retrievability), usage (access frequency),
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:634: * similarity, importance, recency, popularity, tierBoost, and retrievability.
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:650:    + rawWeights.popularity + rawWeights.tierBoost + rawWeights.retrievability;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:658:        retrievability: rawWeights.retrievability / wSum,
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:670:  const retrievabilityScore = calculateRetrievabilityScore(row);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:678:    retrievabilityScore * weights.retrievability
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:692: * - `composite_score`: Five-factor composite (0-1) combining retrievability,
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:726: *   importance, recency, popularity, tierBoost, and retrievability scores.
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:754:        retrievability: calculateRetrievabilityScore(row),
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:791:      temporal: { value: temporal, weight: weights.temporal, contribution: temporal * weights.temporal, description: 'FSRS retrievability decay' },
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:816:    + rawWeights.popularity + rawWeights.tierBoost + rawWeights.retrievability;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:824:        retrievability: rawWeights.retrievability / wSum,
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:834:  const retrievability = calculateRetrievabilityScore(row);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:843:      retrievability: { value: retrievability, weight: weights.retrievability, contribution: retrievability * weights.retrievability },
.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:23:  stability?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:24:  difficulty?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:25:  review_count?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:56:  'type_inference_source', 'stability', 'difficulty', 'review_count',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:75: * - `last_review` is always refreshed to `datetime('now')`
.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:101:  setClauses.push("last_review = datetime('now')");
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1265:    if (column === 'stability') return 1.0;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1266:    if (column === 'difficulty') return 5.0;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1267:    if (column === 'review_count') return 0;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1274:  if (column === 'stability') {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1277:  if (column === 'difficulty') {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1280:  if (column === 'review_count') {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1339:    'stability',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1340:    'difficulty',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1341:    'last_review',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1342:    'review_count',
.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts:5:// Augments FSRS stability scores with graph centrality so that
.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts:26: * Compute structural freshness by augmenting an FSRS stability score
.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts:30: *   structural_freshness = fsrs_stability * graph_centrality_normalized
.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts:36: * @param stability  - FSRS stability value, clamped to [0, 1].
.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts:41:  stability: number,
.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts:44:  const s = Math.min(1, Math.max(0, stability));
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:676:            // instead of raw DELETE to clean lineage, projections, and graph residue.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:906:    stability: existingRow.stability,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:907:    difficulty: existingRow.difficulty,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:908:    review_count: existingRow.review_count,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:504:      const due = (database.prepare(`
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:508:        END AS is_due
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:510:        is_due: number;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:513:      if (due.is_due !== 1) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:536:    // BUG-020: Clean ancillary records so deletes do not leave graph residue behind.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:54:    'idx_stability',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:55:    'idx_last_review',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:470:        { name: 'stability', sql: 'ALTER TABLE memory_index ADD COLUMN stability REAL DEFAULT 1.0' },
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:471:        { name: 'difficulty', sql: 'ALTER TABLE memory_index ADD COLUMN difficulty REAL DEFAULT 5.0' },
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:472:        { name: 'last_review', sql: 'ALTER TABLE memory_index ADD COLUMN last_review TEXT' },
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:473:        { name: 'review_count', sql: 'ALTER TABLE memory_index ADD COLUMN review_count INTEGER DEFAULT 0' }
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:494:        'idx_stability',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:495:        'CREATE INDEX IF NOT EXISTS idx_stability ON memory_index(stability DESC)',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:500:        'idx_last_review',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:501:        'CREATE INDEX IF NOT EXISTS idx_last_review ON memory_index(last_review)',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:507:        'CREATE INDEX IF NOT EXISTS idx_fsrs_retrieval ON memory_index(stability, difficulty, last_review)',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:651:            original_stability_before REAL,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:652:            original_stability_after REAL,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:653:            correction_stability_before REAL,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:654:            correction_stability_after REAL,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1849:  if (!column_names.includes('stability')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1851:      database.exec(`ALTER TABLE memory_index ADD COLUMN stability REAL DEFAULT 1.0`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1852:      console.warn('[vector-index] Migration: Added stability column (FSRS)');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1857:      logDuplicateColumnMigrationSkip('stability', error);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1861:  if (!column_names.includes('difficulty')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1863:      database.exec(`ALTER TABLE memory_index ADD COLUMN difficulty REAL DEFAULT 5.0`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1864:      console.warn('[vector-index] Migration: Added difficulty column (FSRS)');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1869:      logDuplicateColumnMigrationSkip('difficulty', error);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1873:  if (!column_names.includes('last_review')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1875:      database.exec(`ALTER TABLE memory_index ADD COLUMN last_review TEXT`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1876:      console.warn('[vector-index] Migration: Added last_review column (FSRS)');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1881:      logDuplicateColumnMigrationSkip('last_review', error);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1885:  if (!column_names.includes('review_count')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1887:      database.exec(`ALTER TABLE memory_index ADD COLUMN review_count INTEGER DEFAULT 0`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1888:      console.warn('[vector-index] Migration: Added review_count column (FSRS)');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1893:      logDuplicateColumnMigrationSkip('review_count', error);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2340:      stability REAL DEFAULT 1.0,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2341:      difficulty REAL DEFAULT 5.0,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2342:      last_review TEXT,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2343:      review_count INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2474:    CREATE INDEX IF NOT EXISTS idx_stability ON memory_index(stability DESC);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2475:    CREATE INDEX IF NOT EXISTS idx_last_review ON memory_index(last_review);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2476:    CREATE INDEX IF NOT EXISTS idx_fsrs_retrieval ON memory_index(stability, difficulty, last_review);
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:218:  // Os.freemem() can look artificially low due to disk cache usage.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:206:         WHEN m.last_review IS NOT NULL AND m.review_count > 0 THEN
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:208:             1.0 + (19.0/81.0) * (julianday('now') - julianday(m.last_review)) / COALESCE(NULLIF(m.stability, 0), 1.0),
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1396:        // (lineage, projections, graph residue) instead of raw DELETE.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:378: * stability (no decay). All other types follow the standard FSRS schedule.
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:527:    const dateStr = r.created_at as string | undefined || r.last_accessed as string | undefined || r.last_review as string | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:8:// FSRS-preferred strategy. Memories with FSRS review data (last_review
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:9:// IS NOT NULL, review_count > 0) use the FSRS v4 power-law formula:
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:59:  stability?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:60:  difficulty?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:61:  last_review?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:62:  review_count?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:14://     - FSRS write-back to memory_index (when trackAccess=true) — DB write
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:28:// 3.  Testing effect          — FSRS strengthening write-back (trackAccess)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:108:  stability: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:109:  difficulty: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:223: * in ranking while preserving score stability.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:533: * handler. Uses GRADE_GOOD with a difficulty bonus inversely proportional
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:534: * to current retrievability, so low-retrievability memories receive the
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:535: * largest stability boost.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:539: * @param retrievability - Current retrievability R(t) in [0, 1]
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:544:  retrievability: number
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:548:  const clampedR = (typeof retrievability === 'number' && retrievability >= 0 && retrievability <= 1)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:549:    ? retrievability
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:554:      'SELECT stability, difficulty, review_count FROM memory_index WHERE id = ?'
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:560:    const difficultyBonus = Math.max(0, (0.9 - clampedR) * 0.5);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:563:      (memory.stability as number) || fsrsScheduler.DEFAULT_INITIAL_STABILITY,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:564:      (memory.difficulty as number) || fsrsScheduler.DEFAULT_INITIAL_DIFFICULTY,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:567:    ) * (1 + difficultyBonus);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:571:      SET stability = ?,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:572:          last_review = CURRENT_TIMESTAMP,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:573:          review_count = review_count + 1,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:579:    return { stability: newStability, difficulty: (memory.difficulty as number) || fsrsScheduler.DEFAULT_INITIAL_DIFFICULTY };
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:843: * Called only when `trackAccess` is true (P3-09 FIX: explicit opt-in to avoid
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:846: * For each result, the current retrievability R(t) is computed from the stored
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:847: * stability and last_review fields, then `strengthenOnAccess` fires an FSRS
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:848: * GRADE_GOOD update — increasing stability proportional to how much the memory
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:864:      const lastReview = (row.last_review as string | undefined | null) || (row.created_at as string | undefined);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:867:      const stability = typeof row.stability === 'number' && Number.isFinite(row.stability)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:868:        ? row.stability
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:873:        stability,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:936: *   3.  Testing effect     (all types, when trackAccess = true)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1195:  // P3-09 FIX: Only when explicitly opted in via trackAccess.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1198:  if (config.trackAccess) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:22:  retrievability?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:23:  stability?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:24:  last_review?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:89:  retrievability?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:90:  stability?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:91:  last_review?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:152:  trackAccess: boolean;

codex
The validator did pass exactly as before, including the read-only temp-file warning, so I can keep the assessment concrete. One more slice matters for this topic: Public’s access-strengthening and archive criteria, because that’s where its latent retention policy diverges most from Modus’s visible decay sweep.
exec
/bin/zsh -lc "sed -n '520,610p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "sed -n '150,210p' .opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '840,910p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    });

    it('T224: Returns {state, retrievability, effectiveHalfLife}', () => {
      const r = tierClassifier.classifyTier({ id: 4, stability: 1.0 });
      expect(r).toHaveProperty('state');
      expect(r).toHaveProperty('retrievability');
      expect(r).toHaveProperty('effectiveHalfLife');
    });

    it('T225: Normal tier has numeric effectiveHalfLife', () => {
      const r = tierClassifier.classifyTier({ id: 4, stability: 1.0 });
      expect(typeof r.effectiveHalfLife).toBe('number');
      expect(r.effectiveHalfLife).toBeGreaterThan(0);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     shouldArchive() (T226-T230)
  ──────────────────────────────────────────────────────────────── */

  describe('shouldArchive() (T226-T230)', () => {
    it('T226: Constitutional => never archive', () => {
      expect(tierClassifier.shouldArchive({ id: 1, importance_tier: 'constitutional', stability: 0.01, created_at: new Date(Date.now() - 200 * 86400000).toISOString() })).toBe(false);
    });

    it('T227: Critical => never archive', () => {
      expect(tierClassifier.shouldArchive({ id: 2, importance_tier: 'critical', stability: 0.01, created_at: new Date(Date.now() - 200 * 86400000).toISOString() })).toBe(false);
    });

    it('T228: Pinned => never archive', () => {
      expect(tierClassifier.shouldArchive({ id: 3, is_pinned: 1, stability: 0.01, created_at: new Date(Date.now() - 200 * 86400000).toISOString() })).toBe(false);
    });

    it('T229: Old low-stability normal => should archive', () => {
      expect(tierClassifier.shouldArchive({ id: 4, importance_tier: 'normal', stability: 0.01, half_life_days: 0.001, created_at: new Date(Date.now() - 200 * 86400000).toISOString() })).toBe(true);
    });

    it('T230: Recent high-stability => should NOT archive', () => {
      expect(tierClassifier.shouldArchive({ id: 5, importance_tier: 'normal', stability: 100, created_at: new Date().toISOString() })).toBe(false);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     getStateStats() (T236-T240)
     Production: getStateStats(memories) returns { HOT, WARM, COLD, DORMANT, ARCHIVED, total }
  ──────────────────────────────────────────────────────────────── */

  describe('getStateStats() (T236-T240)', () => {
    it('T236: Empty array => all zeros', () => {
      const s = tierClassifier.getStateStats([]);
      expect(s.HOT).toBe(0);
      expect(s.WARM).toBe(0);
      expect(s.COLD).toBe(0);
      expect(s.DORMANT).toBe(0);
      expect(s.ARCHIVED).toBe(0);
      expect(s.total).toBe(0);
    });

    it('T237: Stats count memories correctly', () => {
      const memories = [
        { id: 1, importance_tier: 'constitutional', stability: 1.0 },

 succeeded in 0ms:
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

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
<p align="center">
  <img src="assets/hero.svg" alt="modus-memory — Personal memory server for AI" width="900"/>
</p>

<p align="center">
  <a href="#demo"><strong>Demo</strong></a> ·
  <a href="#install"><strong>Install</strong></a> ·
  <a href="#quickstart"><strong>Quickstart</strong></a> ·
  <a href="#the-librarian-pattern"><strong>Librarian</strong></a> ·
  <a href="#how-it-works"><strong>How It Works</strong></a> ·
  <a href="#security--privacy"><strong>Security</strong></a> ·
  <a href="#migrating-from-khoj"><strong>Khoj Migration</strong></a> ·
  <a href="#faq"><strong>FAQ</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/MCP-compatible-blue?style=flat-square&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSI4IiBmaWxsPSIjNThhNmZmIi8+PC9zdmc+" alt="MCP Compatible"/>
  <img src="https://img.shields.io/badge/platform-macOS%20·%20Linux%20·%20Windows-lightgrey?style=flat-square" alt="Platform"/>
  <img src="https://img.shields.io/badge/size-~6MB-green?style=flat-square" alt="Binary Size"/>
  <img src="https://img.shields.io/badge/dependencies-zero-brightgreen?style=flat-square" alt="Zero Dependencies"/>
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="MIT License"/>
  <img src="https://img.shields.io/badge/price-free-brightgreen?style=flat-square" alt="Completely Free"/>
</p>

---

**modus-memory** is a personal memory server that runs on your machine, stores everything in plain markdown, and connects to any AI client via [MCP](https://modelcontextprotocol.io).

One binary. No cloud. No Docker. No database. Your memories stay on your disk as files you can read, edit, grep, and back up with git.

> **Completely free. 19,000+ documents indexed in 2 seconds. Cached searches in <100 microseconds. 6MB binary, zero dependencies.**

## Demo

<p align="center">
  <img src="assets/demo.svg" alt="modus-memory demo — install, store memory, recall weeks later" width="800"/>
</p>

Your AI remembers a decision you made 3 weeks ago — in a completely new chat. No copy-paste, no "here's my context dump." Just ask, and it knows.

## Why

Every AI conversation starts from zero. Your assistant forgets everything the moment the window closes.

Cloud memory services charge $19–249/month to store your personal data on their servers. Open-source alternatives require Python, Docker, PostgreSQL, and an afternoon of setup. The official MCP memory server is deliberately minimal — no search ranking, no decay, no cross-referencing. Other "zero-infrastructure" tools still need Node.js runtimes and LLM API keys for every search.

<p align="center">
  <img src="assets/comparison.svg" alt="modus-memory vs cloud memory services" width="800"/>
</p>

**modus-memory** fills the gap:

- **BM25 full-text search** with field boosting and query caching — 19K docs in <5ms
- **FSRS spaced repetition** — memories decay naturally, strengthen on recall
- **Cross-referencing** — facts, notes, and entities linked by subject and tag
- **Librarian query expansion** — "React hooks" also finds "useState lifecycle"
- **Plain markdown storage** — your data is always yours, always readable
- **~6MB binary** — download, configure, done. No runtime, no interpreter, no container

### Without memory vs. with memory

| Scenario | Without | With modus-memory |
|----------|---------|-------------------|
| Start a new chat | AI knows nothing about you | AI recalls your preferences, past decisions, project context |
| Switch AI clients | Start over completely | Same memory, any MCP client |
| Ask "what did we decide about auth?" | Blank stare | Instant recall + linked context |
| Close the window | Everything lost | Persisted to disk, searchable forever |
| 6 months later | Stale memories clutter results | FSRS naturally fades noise, reinforces what matters |

### Token savings

Memory isn't just about remembering. It's a token reduction strategy.

| Approach | Tokens per query | Cost at $3/1M tokens | Monthly (50 queries/day) |
|----------|-----------------|----------------------|--------------------------|
| Stuff 1K facts into context | ~36,000 | $0.109 | **$164** |
| modus-memory search (top 10) | ~500 | $0.0015 | **$2.25** |

**72x fewer input tokens.** Instead of cramming everything into the context window, modus-memory searches 19,000+ documents in <5ms and returns only what's relevant.

## Install

### Homebrew (macOS & Linux)

```bash
brew install GetModus/tap/modus-memory
```

### Download binary

Grab the latest release for your platform from [Releases](https://github.com/GetModus/modus-memory/releases):

| Platform | Architecture | Download |
|----------|-------------|----------|
| macOS | Apple Silicon (M1+) | `modus-memory-darwin-arm64` |
| macOS | Intel | `modus-memory-darwin-amd64` |
| Linux | x86_64 | `modus-memory-linux-amd64` |
| Linux | ARM64 | `modus-memory-linux-arm64` |
| Windows | x86_64 | `modus-memory-windows-amd64.exe` |

```bash
# macOS / Linux
chmod +x modus-memory-*
sudo mv modus-memory-* /usr/local/bin/modus-memory

# Verify
modus-memory version
```

### Go install

```bash
go install github.com/GetModus/modus-memory@latest
```

## Quickstart

### 1. Add to your AI client

<details>
<summary><strong>Claude Desktop</strong></summary>

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

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
</details>

<details>
<summary><strong>Claude Code</strong></summary>

```bash
claude mcp add memory -- modus-memory --vault ~/vault
```
</details>

<details>
<summary><strong>Cursor</strong></summary>

In Settings > MCP Servers, add:

```json
{
  "memory": {
    "command": "modus-memory",
    "args": ["--vault", "~/vault"]
  }
}
```
</details>

<details>
<summary><strong>Windsurf / Cline / Any MCP client</strong></summary>

modus-memory speaks [MCP](https://modelcontextprotocol.io) over stdio. Point any MCP-compatible client at the binary:

```bash
modus-memory --vault ~/vault
```
</details>

### 2. Start remembering

Your AI client now has 11 memory tools. Try:

```
"Remember that I prefer TypeScript over JavaScript for new projects"
"What do you know about my coding preferences?"
"Find everything related to the authentication refactor"
```

### 3. Check your vault

```bash
modus-memory health
# modus-memory 0.3.0
# Vault: ~/modus/vault
# Documents: 847
# Facts: 234 total, 230 active
# Cross-refs: 156 subjects, 89 tags, 23 entities
```

## Tools

modus-memory exposes 11 MCP tools — all free, no limits:

| Tool | Description |
|------|-------------|
| `vault_search` | BM25 full-text search with librarian query expansion and cross-reference hints |
| `vault_read` | Read any document by path |
| `vault_write` | Write a document with YAML frontmatter + markdown body |
| `vault_list` | List documents in a subdirectory with optional filters |
| `vault_status` | Vault statistics — document counts, index size, cross-ref stats |
| `memory_facts` | List memory facts, optionally filtered by subject |
| `memory_search` | Search memory facts with automatic FSRS reinforcement on recall |
| `memory_store` | Store a new memory fact (subject/predicate/value) |
| `memory_reinforce` | Explicitly reinforce a memory — increases stability, decreases difficulty |
| `memory_decay_facts` | Run FSRS decay sweep — naturally forgets stale memories |
| `vault_connected` | Cross-reference query — find everything linked to a subject, tag, or entity |

## The Librarian Pattern

Most memory systems let any LLM read and write freely. modus-memory is designed around a different principle: a single dedicated local model — the **Librarian** — serves as the sole authority over persistent state.

```
┌─────────────┐     ┌────────────────┐     ┌──────────────┐
│ Cloud Model  │◄───►│   Librarian    │◄───►│ modus-memory │
│ (reasoning)  │     │ (local, ~8B)   │     │   (vault)    │
└─────────────┘     └────────────────┘     └──────────────┘
                     Sole write access
                     Query expansion
                     Relevance filtering

exec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Vector Index Store
// ───────────────────────────────────────────────────────────────
// Feature catalog: Hybrid search pipeline
// SEARCH: VECTOR INDEX
// TypeScript port of the vector index implementation.
// DECAY STRATEGY (ADR-004): Search-time temporal decay uses an
// FSRS-preferred strategy. Memories with FSRS review data (last_review
// IS NOT NULL, review_count > 0) use the FSRS v4 power-law formula:
// R(t) = (1 + 0.2346 * t / S)^(-0.5)
// Memories without review data fall back to half-life exponential:
// Weight * 0.5^(days / half_life_days)
// This ensures backward compatibility while aligning reviewed
// Memories with the canonical FSRS algorithm.

import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

import Database from 'better-sqlite3';
import * as sqliteVec from 'sqlite-vec';

import { getStartupEmbeddingDimension } from '@spec-kit/shared/embeddings/factory';

import { DATABASE_PATH, SERVER_DIR } from '../../core/config.js';
import { IVectorStore } from '../interfaces/vector-store.js';
import { computeInterferenceScoresBatch } from '../scoring/interference-scoring.js';
import { validateFilePath } from '../utils/path-security.js';
import {
  get_error_code,
  get_error_message,
  parse_trigger_phrases,
  VectorIndexError,
  VectorIndexErrorCode,
} from './vector-index-types.js';
import {
  create_schema,
  ensure_schema_version,
} from './vector-index-schema.js';
import type {
  EmbeddingInput,
  EnrichedSearchResult,
  IndexMemoryParams,
  MemoryRow,
  VectorSearchOptions,
} from './vector-index-types.js';

type SearchWeightsConfig = {
  maxTriggersPerMemory?: number;
  smartRanking?: {
    recencyWeight?: number;
    accessWeight?: number;
    relevanceWeight?: number;
  };
};

function loadSearchWeights(): SearchWeightsConfig {
  // SERVER_DIR points to dist/ at runtime; configs/ lives at the package root (dist/..)
  const candidates = [
    path.join(SERVER_DIR, 'configs', 'search-weights.json'),
    path.join(SERVER_DIR, '..', 'configs', 'search-weights.json'),
  ];
  for (const candidate of candidates) {
    try {
      return JSON.parse(fs.readFileSync(candidate, 'utf-8')) as SearchWeightsConfig;
    } catch {
      // Try next candidate
    }
  }
  return {};
}

let _search_weights: SearchWeightsConfig | null = null;

function getSearchWeights(): SearchWeightsConfig {
  if (_search_weights === null) {
    _search_weights = loadSearchWeights();
  }
  return _search_weights;
}

/** Loaded search weight configuration for vector-index ranking (lazy-loaded). */
export const search_weights: SearchWeightsConfig = {
  get maxTriggersPerMemory() {
    return getSearchWeights().maxTriggersPerMemory;
  },
  get smartRanking() {
    return getSearchWeights().smartRanking;
  },
};

type EnhancedSearchOptions = {
  specFolder?: string | null;
  minSimilarity?: number;
  diversityFactor?: number;
  noDiversity?: boolean;
};
type JsonObject = Record<string, unknown>;

let _cached_queries: Awaited<typeof import('./vector-index-queries.js')> | null = null;
let _cached_mutations: Awaited<typeof import('./vector-index-mutations.js')> | null = null;
let _cached_aliases: Awaited<typeof import('./vector-index-aliases.js')> | null = null;

async function getQueriesModule() {
  return _cached_queries ??= await import('./vector-index-queries.js');
}

async function getMutationsModule() {
  return _cached_mutations ??= await import('./vector-index-mutations.js');
}

async function getAliasesModule() {
  return _cached_aliases ??= await import('./vector-index-aliases.js');
}

/* ───────────────────────────────────────────────────────────────
   1. CONFIGURATION — Embedding Dimension
----------------------------------------------------------------*/

/** Default embedding dimension used by the vector index. */
export const EMBEDDING_DIM = 768;

/**
 * Gets the active embedding dimension for the current provider.
 * @returns The embedding dimension.
 */
export function get_embedding_dim(): number {
  return getStartupEmbeddingDimension();
}

/**
 * Waits for the embedding provider to report a stable dimension.
 * @param timeout_ms - The maximum time to wait in milliseconds.
 * @returns A promise that resolves to the confirmed embedding dimension.
 */
export async function get_confirmed_embedding_dimension(timeout_ms = 5000): Promise<number> {
  const start = Date.now();
  while (Date.now() - start < timeout_ms) {
    const dim = get_embedding_dim();
    if (dim !== 768 || process.env.EMBEDDING_DIM === '768') {
      return dim;
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  console.warn('[vector-index] Using default dimension 768 after timeout');
  return 768;
}

type EmbeddingDimensionValidation = {
  valid: boolean;
  stored: number | null;
  current: number | null;
  reason?: string;
  warning?: string;
};

type StoredEmbeddingDimension = {
  existing_db: boolean;
  stored_dim: number | null;
  source: 'vec_metadata' | 'vec_memories' | null;
  reason?: string;
};

function get_existing_embedding_dimension(
  database: Database.Database,
): StoredEmbeddingDimension {
  const schema_row = database.prepare(`
    SELECT name FROM sqlite_master WHERE type='table' AND name='memory_index'
  `).get();

  if (!schema_row) {
    return {
      existing_db: false,
      stored_dim: null,
      source: null,
      reason: 'No existing schema',
    };
  }

  const metadata_table = database.prepare(`
    SELECT name FROM sqlite_master WHERE type='table' AND name='vec_metadata'
  `).get();

  if (metadata_table) {
    const stored_row = database.prepare(`
      SELECT value FROM vec_metadata WHERE key = 'embedding_dim'
    `).get() as { value: string } | undefined;

    if (stored_row) {
      const stored_dim = parseInt(stored_row.value, 10);
      if (Number.isFinite(stored_dim) && stored_dim > 0) {
        return {
          existing_db: true,
          stored_dim,
          source: 'vec_metadata',
        };
      }
    }
  }

  const vec_table = database.prepare(`
    SELECT sql FROM sqlite_master WHERE name='vec_memories'
  `).get() as { sql: string | null } | undefined;
  const vec_sql = typeof vec_table?.sql === 'string' ? vec_table.sql : null;
  const match = vec_sql?.match(/FLOAT\[(\d+)\]/i);

  if (match) {
    const stored_dim = parseInt(match[1], 10);
    if (Number.isFinite(stored_dim) && stored_dim > 0) {
      return {
        existing_db: true,
        stored_dim,
        source: 'vec_memories',
      };
    }
  }

  return {
    existing_db: true,
    stored_dim: null,
    source: null,
    reason: 'No stored vector dimension found for existing schema',
  };
}

function validate_embedding_dimension_for_connection(
  database: Database.Database | null,
  _sqlite_vec_available: boolean,
): EmbeddingDimensionValidation {
  if (!database) {
    return { valid: true, stored: null, current: null, reason: 'No database' };
  }

  try {
    const current_dim = get_embedding_dim();
    const existing = get_existing_embedding_dimension(database);

    if (!existing.existing_db) {
      return { valid: true, stored: null, current: current_dim, reason: existing.reason };
    }

exec
/bin/zsh -lc "rg -n \"function shouldArchive|shouldArchive\\(\" .opencode/skill/system-spec-kit/mcp_server -g '*.ts'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:167:     shouldArchive() (T226-T230)
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:170:  describe('shouldArchive() (T226-T230)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:172:      expect(tierClassifier.shouldArchive({ id: 1, importance_tier: 'constitutional', stability: 0.01, created_at: new Date(Date.now() - 200 * 86400000).toISOString() })).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:176:      expect(tierClassifier.shouldArchive({ id: 2, importance_tier: 'critical', stability: 0.01, created_at: new Date(Date.now() - 200 * 86400000).toISOString() })).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:180:      expect(tierClassifier.shouldArchive({ id: 3, is_pinned: 1, stability: 0.01, created_at: new Date(Date.now() - 200 * 86400000).toISOString() })).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:184:      expect(tierClassifier.shouldArchive({ id: 4, importance_tier: 'normal', stability: 0.01, half_life_days: 0.001, created_at: new Date(Date.now() - 200 * 86400000).toISOString() })).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:188:      expect(tierClassifier.shouldArchive({ id: 5, importance_tier: 'normal', stability: 100, created_at: new Date().toISOString() })).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:496:function shouldArchive(memory: TierInput): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:397:        shouldArchiveRow = classifier.shouldArchive(row) as boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:466:      shouldArchive = classifier.shouldArchive(memory) as boolean;
.opencode/skill/system-spec-kit/mcp_server/tests/unit-tier-classifier-types.vitest.ts:210:  describe('shouldArchive() with TierInput objects', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/unit-tier-classifier-types.vitest.ts:214:      const result = tierClassifier.shouldArchive({
.opencode/skill/system-spec-kit/mcp_server/tests/unit-tier-classifier-types.vitest.ts:227:      const result = tierClassifier.shouldArchive({

exec
/bin/zsh -lc "sed -n '190,235p' .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  // M9 FIX: Validate embedding dimension before querying
  const expected_dim = get_embedding_dim();
  if (!query_embedding || query_embedding.length !== expected_dim) {
    throw new VectorIndexError(
      `Invalid embedding dimension: expected ${expected_dim}, got ${query_embedding?.length}`,
      VectorIndexErrorCode.EMBEDDING_VALIDATION,
    );
  }

  const query_buffer = to_embedding_buffer(query_embedding);
  const max_distance = 2 * (1 - minSimilarity / 100);

  // ADR-004: FSRS-preferred decay with half-life fallback
  const decay_expr = useDecay
    ? `CASE
         WHEN m.is_pinned = 1 THEN m.importance_weight
         WHEN m.last_review IS NOT NULL AND m.review_count > 0 THEN
           m.importance_weight * POWER(
             1.0 + (19.0/81.0) * (julianday('now') - julianday(m.last_review)) / COALESCE(NULLIF(m.stability, 0), 1.0),
             -0.5
           )
         ELSE m.importance_weight * POWER(0.5, (julianday('now') - julianday(m.updated_at)) / COALESCE(NULLIF(m.decay_half_life_days, 0), 90.0))
       END`
    : 'm.importance_weight';

  let constitutional_results: MemoryRow[] = [];

  if (includeConstitutional && tier !== 'constitutional') {
    constitutional_results = get_constitutional_memories(database, specFolder, includeArchived);
  }

  const where_clauses = ['m.embedding_status = \'success\''];
  const params: unknown[] = [query_buffer];

  where_clauses.push('(m.expires_at IS NULL OR m.expires_at > datetime(\'now\'))');

  if (!includeArchived) {
    where_clauses.push('(m.is_archived IS NULL OR m.is_archived = 0)');
  }
  if (tier === 'deprecated') {
    where_clauses.push('m.importance_tier = ?');
    params.push('deprecated');
  } else if (tier === 'constitutional') {
    where_clauses.push('m.importance_tier = ?');
    params.push('constitutional');
  } else if (tier) {

exec
/bin/zsh -lc "sed -n '460,560p' .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    return {
      id: m.id ?? 0,
      title: m.title || 'Untitled',
      state: classification.state,
      retrievability: Math.round(classification.retrievability * 100) / 100,
      specFolder: m.spec_folder || '',
      filePath: m.file_path || '',
    };
  });
}

/**
 * Get statistics for each state.
 * Accepts any array of TierInput-compatible objects.
 */
function getStateStats(memories: readonly TierInput[]): StateStats {
  const stats: StateStats = {
    HOT: 0,
    WARM: 0,
    COLD: 0,
    DORMANT: 0,
    ARCHIVED: 0,
    total: memories.length,
  };

  for (const memory of memories) {
    const { state } = classifyTier(memory);
    stats[state]++;
  }

  return stats;
}

/**
 * Determine if a memory should be archived.
 */
function shouldArchive(memory: TierInput): boolean {
  const { state } = classifyTier(memory);

  // Never archive constitutional or critical
  if (memory.importance_tier === 'constitutional' || memory.importance_tier === 'critical') {
    return false;
  }

  // Pinned memories are never archived
  if (memory.is_pinned === 1) {
    return false;
  }

  return state === 'ARCHIVED' || state === 'DORMANT';
}

/* ───────────────────────────────────────────────────────────────
   4. EXPORTS
----------------------------------------------------------------*/

export {
  // Constants
  STATE_THRESHOLDS,
  ARCHIVED_DAYS_THRESHOLD,
  TIER_CONFIG,
  PER_TIER_LIMITS,
  TIER_PRIORITY,

  // Core functions
  classifyState,
  calculateRetrievability,
  classifyTier,
  getEffectiveHalfLife,
  halfLifeToStability,

  // Query functions
  getStateContent,
  filterAndLimitByState,
  formatStateResponse,
  getStateStats,
  shouldArchive,
};

export type {
  TierState,
  TierInput,
  StateContent,
  StateStats,
  TierConfigType,
};

exec
/bin/zsh -lc "sed -n '260,360p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
		return nil, err
	}

	var out []string
	count := 0
	for _, r := range results {
		if !strings.HasPrefix(r.Path, "memory/facts/") {
			continue
		}
		if count >= limit {
			break
		}
		out = append(out, fmt.Sprintf("- **%s**: %s", r.Subject, r.Snippet))
		count++
	}
	return out, nil
}

// StoreFact writes a new memory fact as a .md file.
func (v *Vault) StoreFact(subject, predicate, value string, confidence float64, importance string) (string, error) {
	if confidence <= 0 {
		confidence = 0.8
	}
	if importance == "" {
		importance = "medium"
	}

	slug := slugify(subject + "-" + predicate)
	if len(slug) > 80 {
		slug = slug[:80]
	}

	relPath := fmt.Sprintf("memory/facts/%s.md", slug)
	path := v.Path("memory", "facts", slug+".md")

	// Handle duplicates
	for i := 2; fileExists(path); i++ {
		slug2 := fmt.Sprintf("%s-%d", slug, i)
		relPath = fmt.Sprintf("memory/facts/%s.md", slug2)
		path = v.Path("memory", "facts", slug2+".md")

codex
I have the conceptual picture now; I’m grabbing exact line references so the iteration output stays audit-grade and easy to merge into the phase report later. After that I’ll synthesize only the retention-specific deltas from this pass.
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/facts.go | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go | sed -n '274,334p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go | sed -n '856,910p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts | sed -n '260,420p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
   341	 * @param stability      Base FSRS stability value
   342	 * @param contextType    Memory context_type field
   343	 * @param importanceTier Memory importance_tier field
   344	 * @returns Adjusted stability value
   345	 */
   346	function applyClassificationDecay(
   347	  stability: number,
   348	  contextType: string,
   349	  importanceTier: string
   350	): number {
   351	  if (isHybridDecayPolicyEnabled() && HYBRID_NO_DECAY_CONTEXT_TYPES.has(contextType)) {
   352	    return Infinity;
   353	  }
   354	
   355	  // Graduated: default-ON. Set SPECKIT_CLASSIFICATION_DECAY=false to disable.
   356	  const flag = process.env.SPECKIT_CLASSIFICATION_DECAY?.toLowerCase();
   357	  if (flag === 'false' || flag === '0') {
   358	    return stability;
   359	  }
   360	
   361	  const multiplier = getClassificationDecayMultiplier(contextType, importanceTier);
   362	  if (!isFinite(multiplier)) {
   363	    return Infinity;
   364	  }
   365	
   366	  return stability * multiplier;
   367	}
   368	
   369	/* --- 4b. HYBRID DECAY POLICY (REQ-D4-002) ---
   370	   Gated by SPECKIT_HYBRID_DECAY_POLICY env var (default OFF).
   371	   Distinguishes two classes of memory:
   372	
   373	   1. NO-DECAY documents — context_type in {decision, constitutional, critical}
   374	      These represent permanent knowledge artifacts. Their stability is treated as
   375	      Infinity so R(t) = 1.0 at all times.
   376	
   377	   2. ENGAGEMENT-SENSITIVE documents — all other context_types (session, scratch,
   378	      transient, implementation, discovery, research, general)
   379	      Normal FSRS schedule applies without modification.
   380	
   381	   This is intentionally SEPARATE from TM-03 (applyClassificationDecay) which
   382	   uses a combined context_type × importance_tier multiplier and is default-ON.
   383	   SPECKIT_HYBRID_DECAY_POLICY is default-OFF and must be opted into explicitly.
   384	   DO NOT combine both policies on the same memory. */
   385	
   386	/**
   387	 * Context types that should never decay under the hybrid decay policy.
   388	 * Classified as permanent knowledge artifacts.
   389	 */
   390	const HYBRID_NO_DECAY_CONTEXT_TYPES: ReadonlySet<string> = new Set([
   391	  'planning',
   392	  ...Object.keys(LEGACY_CONTEXT_TYPE_ALIASES).filter(k => LEGACY_CONTEXT_TYPE_ALIASES[k] === 'planning'),
   393	  'constitutional',
   394	  'critical',
   395	]);
   396	const HYBRID_FSRS_CONTEXT_TYPES: ReadonlySet<string> = new Set([
   397	  'session',
   398	  'scratch',
   399	  'transient',
   400	  'implementation',
   401	  'discovery',
   402	  'research',
   403	  'general',
   404	]);
   405	const NO_DECAY = Infinity;
   406	
   407	/**
   408	 * REQ-D4-002: Check whether the hybrid decay policy feature flag is enabled.
   409	 * Default: TRUE (graduated). Set SPECKIT_HYBRID_DECAY_POLICY=false to disable.
   410	 */
   411	function isHybridDecayPolicyEnabled(): boolean {
   412	  const val = process.env.SPECKIT_HYBRID_DECAY_POLICY?.toLowerCase().trim();
   413	  return val !== 'false' && val !== '0';
   414	}
   415	
   416	/**
   417	 * REQ-D4-002: Classify a memory's decay behaviour under the hybrid policy.
   418	 *
   419	 * Returns:
   420	 *   - 'no_decay'       for decision / constitutional / critical context types

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts | sed -n '528,590p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts | sed -n '840,905p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   840	/**
   841	 * Apply FSRS testing effect (strengthening write-back) for all accessed memories.
   842	 *
   843	 * Called only when `trackAccess` is true (P3-09 FIX: explicit opt-in to avoid
   844	 * unintended write side-effects during read-only searches).
   845	 *
   846	 * For each result, the current retrievability R(t) is computed from the stored
   847	 * stability and last_review fields, then `strengthenOnAccess` fires an FSRS
   848	 * GRADE_GOOD update — increasing stability proportional to how much the memory
   849	 * needed the review.
   850	 *
   851	 * Errors per-row are caught and logged; they do not abort the full set.
   852	 *
   853	 * @param db      - Active SQLite database connection
   854	 * @param results - Pipeline rows that were accessed
   855	 */
   856	function applyTestingEffect(
   857	  db: Database.Database,
   858	  results: PipelineRow[]
   859	): void {
   860	  if (!db || !Array.isArray(results) || results.length === 0) return;
   861	
   862	  for (const row of results) {
   863	    try {
   864	      const lastReview = (row.last_review as string | undefined | null) || (row.created_at as string | undefined);
   865	      if (!lastReview) continue;
   866	
   867	      const stability = typeof row.stability === 'number' && Number.isFinite(row.stability)
   868	        ? row.stability
   869	        : fsrsScheduler.DEFAULT_INITIAL_STABILITY;
   870	
   871	      const elapsedDays = fsrsScheduler.calculateElapsedDays(lastReview);
   872	      const currentR = fsrsScheduler.calculateRetrievability(
   873	        stability,
   874	        Math.max(0, elapsedDays)
   875	      );
   876	
   877	      strengthenOnAccess(db, row.id, currentR);
   878	    } catch (err: unknown) {
   879	      const message = err instanceof Error ? err.message : String(err);
   880	      console.warn(`[stage2-fusion] applyTestingEffect failed for id ${row.id}: ${message}`);
   881	    }
   882	  }
   883	}
   884	
   885	function recordAdaptiveAccessSignals(
   886	  db: Database.Database,
   887	  results: PipelineRow[],
   888	  query: string | undefined
   889	): void {
   890	  if (!db || !Array.isArray(results) || results.length === 0) return;
   891	
   892	  if (getAdaptiveMode() === 'disabled') return;
   893	
   894	  ensureAdaptiveTables(db);
   895	  const insertAdaptiveSignal = db.prepare(`
   896	    INSERT INTO adaptive_signal_events (memory_id, signal_type, signal_value, query, actor, metadata)
   897	    VALUES (?, ?, ?, ?, ?, ?)
   898	  `);
   899	  const writeAdaptiveSignals = db.transaction((accessedResults: PipelineRow[]) => {
   900	    for (const result of accessedResults) {
   901	      insertAdaptiveSignal.run(
   902	        result.id,
   903	        'access',
   904	        1.0,
   905	        query || '',

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '512,526p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts | sed -n '200,216p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   200	  const max_distance = 2 * (1 - minSimilarity / 100);
   201	
   202	  // ADR-004: FSRS-preferred decay with half-life fallback
   203	  const decay_expr = useDecay
   204	    ? `CASE
   205	         WHEN m.is_pinned = 1 THEN m.importance_weight
   206	         WHEN m.last_review IS NOT NULL AND m.review_count > 0 THEN
   207	           m.importance_weight * POWER(
   208	             1.0 + (19.0/81.0) * (julianday('now') - julianday(m.last_review)) / COALESCE(NULLIF(m.stability, 0), 1.0),
   209	             -0.5
   210	           )
   211	         ELSE m.importance_weight * POWER(0.5, (julianday('now') - julianday(m.updated_at)) / COALESCE(NULLIF(m.decay_half_life_days, 0), 90.0))
   212	       END`
   213	    : 'm.importance_weight';
   214	
   215	  let constitutional_results: MemoryRow[] = [];
   216	

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts | sed -n '492,520p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   492	
   493	/**
   494	 * Determine if a memory should be archived.
   495	 */
   496	function shouldArchive(memory: TierInput): boolean {
   497	  const { state } = classifyTier(memory);
   498	
   499	  // Never archive constitutional or critical
   500	  if (memory.importance_tier === 'constitutional' || memory.importance_tier === 'critical') {
   501	    return false;
   502	  }
   503	
   504	  // Pinned memories are never archived
   505	  if (memory.is_pinned === 1) {
   506	    return false;
   507	  }
   508	
   509	  return state === 'ARCHIVED' || state === 'DORMANT';
   510	}
   511	
   512	/* ───────────────────────────────────────────────────────────────
   513	   4. EXPORTS
   514	----------------------------------------------------------------*/
   515	
   516	export {
   517	  // Constants
   518	  STATE_THRESHOLDS,
   519	  ARCHIVED_DAYS_THRESHOLD,
   520	  TIER_CONFIG,

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md | sed -n '20,90p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts | sed -n '2312,2348p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  2312	      embedding_status TEXT DEFAULT 'pending' CHECK(embedding_status IN ('pending', 'success', 'failed', 'retry', 'partial')),
  2313	      retry_count INTEGER DEFAULT 0,
  2314	      last_retry_at TEXT,
  2315	      failure_reason TEXT,
  2316	      base_importance REAL DEFAULT 0.5,
  2317	      decay_half_life_days REAL DEFAULT 90.0,
  2318	      is_pinned INTEGER DEFAULT 0,
  2319	      access_count INTEGER DEFAULT 0,
  2320	      last_accessed INTEGER DEFAULT 0,
  2321	      importance_tier TEXT DEFAULT 'normal' CHECK(importance_tier IN ('constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated')),
  2322	      tenant_id TEXT,
  2323	      user_id TEXT,
  2324	      agent_id TEXT,
  2325	      session_id TEXT,
  2326	      shared_space_id TEXT,
  2327	      context_type TEXT DEFAULT 'general' CHECK(context_type IN ('research', 'implementation', 'planning', 'general')),
  2328	      channel TEXT DEFAULT 'default',
  2329	      content_hash TEXT,
  2330	      provenance_source TEXT,
  2331	      provenance_actor TEXT,
  2332	      governed_at TEXT,
  2333	      retention_policy TEXT DEFAULT 'keep',
  2334	      delete_after TEXT,
  2335	      governance_metadata TEXT,
  2336	      expires_at DATETIME,
  2337	      confidence REAL DEFAULT 0.5,
  2338	      validation_count INTEGER DEFAULT 0,
  2339	      -- FSRS (Free Spaced Repetition Scheduler) columns for cognitive memory
  2340	      stability REAL DEFAULT 1.0,
  2341	      difficulty REAL DEFAULT 5.0,
  2342	      last_review TEXT,
  2343	      review_count INTEGER DEFAULT 0,
  2344	      file_mtime_ms INTEGER,
  2345	      is_archived INTEGER DEFAULT 0,
  2346	      document_type TEXT DEFAULT 'memory',
  2347	      spec_level INTEGER,
  2348	      content_text TEXT,

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go | sed -n '1,170p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/writer.go | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

codex
# Iteration 023: MEMORY DECAY & RETENTION

## Focus
MEMORY DECAY & RETENTION: How does this system handle memory aging, relevance decay, forgetting? What temporal strategies should we adopt for long-lived memory systems?

## Findings
### Finding 1: Modus turns forgetting into an explicit lifecycle, while Public still hides too much of that lifecycle behind internals
- **Source**: [external/internal/vault/facts.go:64](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go#L64), [external/internal/mcp/vault.go:311](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L311), [external/internal/mcp/vault.go:856](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L856), [external/internal/mcp/vault.go:866](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L866), [mcp_server/handlers/memory-search.ts:519](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L519), [mcp_server/lib/cognitive/tier-classifier.ts:496](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts#L496)
- **What it does**: Modus exposes a full retention loop as operator-visible actions: search recall auto-reinforces, `memory_decay_facts` runs a sweep, and `memory_archive_stale` archives low-confidence facts. Public has the pieces internally, but the main search surface defaults to `trackAccess=false`, so reinforcement is not part of normal operator-visible behavior.
- **Why it matters**: Long-lived memory systems need a legible lifecycle, not just good formulas. If users cannot see when a memory aged, refreshed, or crossed into archival territory, the system will feel arbitrary even when the math is sound.
- **Recommendation**: **NEW FEATURE**
- **Impact**: **high**

### Finding 2: Modus anchors decay to the last meaningful interaction, which is the temporal contract Public is still missing
- **Source**: [external/internal/vault/facts.go:118](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go#L118), [external/internal/vault/facts.go:135](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go#L135), [external/internal/mcp/vault.go:311](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L311), [mcp_server/lib/search/vector-index-queries.ts:202](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts#L202), [mcp_server/lib/search/pipeline/stage2-fusion.ts:840](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L840)
- **What it does**: Modus decays from `last_accessed`, then `last_decayed`, then `created`, skips decay under 0.5 days, and treats each returned search result as a recall event. Public’s search-time decay uses `last_review` when present and otherwise falls back to `updated_at`; access-based strengthening only happens in the opt-in testing-effect path.
- **Why it matters**: For long-lived systems, “when was this memory meaningfully touched?” must be canonical. Otherwise memories that are clearly still in active use can keep aging as though they were untouched.
- **Recommendation**: **adopt now**
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


hook: Stop
hook: Stop Completed
tokens used
85,158
# Iteration 023: MEMORY DECAY & RETENTION

## Focus
MEMORY DECAY & RETENTION: How does this system handle memory aging, relevance decay, forgetting? What temporal strategies should we adopt for long-lived memory systems?

## Findings
### Finding 1: Modus turns forgetting into an explicit lifecycle, while Public still hides too much of that lifecycle behind internals
- **Source**: [external/internal/vault/facts.go:64](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go#L64), [external/internal/mcp/vault.go:311](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L311), [external/internal/mcp/vault.go:856](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L856), [external/internal/mcp/vault.go:866](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L866), [mcp_server/handlers/memory-search.ts:519](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L519), [mcp_server/lib/cognitive/tier-classifier.ts:496](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts#L496)
- **What it does**: Modus exposes a full retention loop as operator-visible actions: search recall auto-reinforces, `memory_decay_facts` runs a sweep, and `memory_archive_stale` archives low-confidence facts. Public has the pieces internally, but the main search surface defaults to `trackAccess=false`, so reinforcement is not part of normal operator-visible behavior.
- **Why it matters**: Long-lived memory systems need a legible lifecycle, not just good formulas. If users cannot see when a memory aged, refreshed, or crossed into archival territory, the system will feel arbitrary even when the math is sound.
- **Recommendation**: **NEW FEATURE**
- **Impact**: **high**

### Finding 2: Modus anchors decay to the last meaningful interaction, which is the temporal contract Public is still missing
- **Source**: [external/internal/vault/facts.go:118](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go#L118), [external/internal/vault/facts.go:135](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go#L135), [external/internal/mcp/vault.go:311](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L311), [mcp_server/lib/search/vector-index-queries.ts:202](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts#L202), [mcp_server/lib/search/pipeline/stage2-fusion.ts:840](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L840)
- **What it does**: Modus decays from `last_accessed`, then `last_decayed`, then `created`, skips decay under 0.5 days, and treats each returned search result as a recall event. Public’s search-time decay uses `last_review` when present and otherwise falls back to `updated_at`; access-based strengthening only happens in the opt-in testing-effect path.
- **Why it matters**: For long-lived systems, “when was this memory meaningfully touched?” must be canonical. Otherwise memories that are clearly still in active use can keep aging as though they were untouched.
- **Recommendation**: **adopt now**
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
