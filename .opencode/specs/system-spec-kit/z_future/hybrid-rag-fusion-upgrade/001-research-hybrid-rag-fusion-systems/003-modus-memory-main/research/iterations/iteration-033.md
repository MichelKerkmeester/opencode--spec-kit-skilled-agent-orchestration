# Iteration 033: TESTING STRATEGY

## Focus
TESTING STRATEGY: How should we test the adopted patterns? Unit tests, integration tests, memory quality regression tests. Concrete test plans.

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
le]
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
--- Iteration 31 ---
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
--
## Findings
### Finding N: [Title]
- **Source**: file path(s)

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
--- Iteration 32 ---
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
--
## Findings
### Finding N: [Title]
- **Source**: file path(s)
## Assessment
- New information ratio: 0.16
- Questions addressed: what can break if we add `memory_review`; what can break if we expose doctor/debug summaries; what can break if we enforce wrapper-on-pipeline discipline.
- Questions answered: `memory_review` is storage-light but semantics-heavy; doctor/debug should be an overlay, not a replacement; the canonical-pipeline rule is cheap to adopt and mainly protects against future divergence.
- Novelty justification: earlier iterations ranked the adopt-now items; this pass adds migration-specific failure modes, explicit rollback boundaries, and concrete flag gating for each one.

## Ruled Out
- Shipping `memory_due` in the same tranche, because its contract risk is still higher than the three adopt-now patterns.
- Letting doctor/debug replace `memory_health(full)`, because that would hide repair and degradation semantics.
- Implementing any new operator surface with bespoke ranking, because that recreates the multi-lane drift Modus already shows.

## Reflection
- What worked: re-reading the live Public handler and pipeline code after the synthesis report, because it separated “safe additive surface” risks from “architectural drift” risks.
- What did not work: broad grep across all iteration artifacts, because the accumulated research log is noisy and duplicates late-stage conclusions.
- What I would do differently: in a write-enabled follow-up, convert these proposed flags directly into an implementation ADR so the rollout contract is frozen before code lands.

## Recommended Next Focus
Translate this matrix into implementation design in this order: `memory_review` API contract, doctor/debug response shape, then an ADR that codifies wrapper-only access to the canonical retrieval pipeline.

Note: the recent `memory_review` activity cue came from the local memory registry and may be stale; the migration analysis above is grounded in current source reads.

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
I’m treating this as a read-only external-research pass for iteration 33, focused on concrete testing strategy patterns we can transfer into Spec Kit Memory. I’ll do a quick memory pass for prior Modus research context, load the deep-research skill guidance, then inspect the most relevant external and local test surfaces before synthesizing the iteration in your requested format.
mcp: spec_kit_memory/memory_quick_search started
mcp: spec_kit_memory/memory_quick_search (failed)
user cancelled MCP tool call
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
I’ve loaded the deep-research loop contract and am narrowing this pass to evidence-backed testing patterns rather than rehashing the broader roadmap. Next I’m pulling the prior Modus-memory context from memory, then I’ll read the external and local test-related code paths that can support a concrete unit/integration/regression plan.
mcp: spec_kit_memory/memory_quick_search started
mcp: spec_kit_memory/memory_quick_search (failed)
user cancelled MCP tool call
codex
The memory MCP isn’t returning results here, so I’m falling back to the lightweight file-based memory pass the repo instructions allow: keyword search in `MEMORY.md`, then only opening a directly relevant summary if it points to one. After that I’ll inspect the live source files for test hooks and failure modes.
exec
/bin/zsh -lc "sed -n '1,220p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/references/quick_reference.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc 'rg -n "Modus|hybrid-rag-fusion|memory_review|doctor/debug|canonical-pipeline|testing" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
157:- rollout_summaries/2026-04-09T10-35-53-UGDf-009_post_save_render_fixes_memory_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T12-35-53-019d71d0-0ec5-7c80-a08b-6d336ee5c639.jsonl, updated_at=2026-04-09T12:01:25+00:00, thread_id=019d71d0-0ec5-7c80-a08b-6d336ee5c639)
456:## Task 2: Rename packet `023-esm-module-compliance` to `023-hybrid-rag-fusion-refinement` and sync changelog references, outcome success
464:- 023-hybrid-rag-fusion-refinement, memory_index_scan, memory_quick_search, parentChain, B3-hybrid-rag-fusion-refinement, .opencode/changelog
514:- symptom: bulk replacement corrupts values (`B3-hybrid-rag-fusion-refinement`); cause: over-broad regex/string substitution; fix: run post-rewrite `rg` anomaly sweep and apply targeted literal repairs for parentChain/headings/JSON snippets [Task 2]
673:- when the user asked for recommendation docs “based on the 90 iterations,” keep documentation in the existing packet `research/` folder with structured sections (exec summary, keep/fix, P0/P1/P2, compatibility, validation/testing, rollout order) [Task 1]
711:- 023-esm-module-compliance, sk-code--opencode, feature catalog, manual_testing_playbook, validate.sh --recursive --strict, --workspaces=false
776:- when the user asked for deep review “make sure everything works as expected ... check the feature catalog and manual testing playbook, and all commands, agents and readmes,” treat it as full-spectrum audit + runtime/doc parity, not a narrow fix pass [Task 1][Task 2]
1113:scope: packet identity rewrites, slug/path sweeps, and follow-on phase packet creation in 022-hybrid-rag-fusion remediation work
1114:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion; reuse_rule=reuse for this epic’s packet lifecycle work only, and verify current live folder names before edits
1120:- rollout_summaries/2026-03-27T18-02-31-ZDov-update_020_pre_release_remediation_paths.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/020-pre-release-remediation, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/27/rollout-2026-03-27T19-02-31-019d3076-47f7-7fd3-8952-dda85e3bdb43.jsonl, updated_at=2026-03-27T18:14:00+00:00, thread_id=019d3076-47f7-7fd3-8952-dda85e3bdb43)
1514:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion and linked docs; reuse_rule=reuse only within this spec family and re-check live numeric IDs each run
1545:- 022-hybrid-rag-fusion, PHASE_LINKS, AI_PROTOCOL, 33 tools, .gemini/agents
1662:scope: architecture/check-pipeline doc truth-sync, sk-doc TOC/anchor compliance, and feature-catalog-style manual testing playbook packaging
1675:## Task 2: Build sk-deep-research manual testing playbook (index + per-feature snippets)
1683:- manual_testing_playbook.md, feature-catalog style, snippet per feature test, 19 scenarios, validate_document.py
1762:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public; reuse_rule=reuse for Hydra work under `022-hybrid-rag-fusion/015-hydra-db-based-features`, but keep scope explicit when staging/committing
1817:- when review scope said “make sure everything is bug free ... manual_testing_playbook & feature_catalog ... up to date,” include code + docs + playbook/catalog in one pass [Task 5]
1836:scope: full-spectrum audit remediation across code, tests, specs, feature catalog, and manual testing playbook under `013-code-audit-per-feature-catalog`
1869:- rollout_summaries/2026-03-13T11-01-44-IBXE-outsourced_agent_memory_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/13/rollout-2026-03-13T12-01-44-019ce6dc-0509-7630-9874-db11f57a9e06.jsonl, updated_at=2026-03-13T11:21:38+00:00, thread_id=019ce6dc-0509-7630-9874-db11f57a9e06)
1904:- validate.sh --recursive, npm run typecheck, npm run check:full, 001-018, feature_catalog, manual_testing_playbook, speckit
1908:- when user asks “Review all work done ... bug free ... aligned with sk-code--opencode ... manual_testing_playbook ... feature_catalog,” treat it as full code+tests+docs+playbook/catalog audit, not a narrow fix [Task 1][Task 3][Task 6]
1985:- when auditing, the user repeatedly asked for “bug free” + sk-code/sk-doc parity + feature_catalog/manual_testing_playbook checks -> treat these as one integrated closure gate, not separate optional follow-ups [Task 2][Task 4]
2008:scope: read-only multi-agent review findings and documentation-drift checks for `023-hybrid-rag-fusion-refinement`
2009:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public under .opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement; reuse_rule=reuse for forensic review of this packet family, but confirm current active slug/path before applying findings
2019:- 023-hybrid-rag-fusion-refinement, ultra-think, severity ordering, file+line evidence, CHK-060 duplicate, [Criteria TBD]
2023:- when user asked to “Let 3 ultra-think agents review all work done in .../023-hybrid-rag-fusion-refinement,” run multi-agent read-only review with severity-ranked findings and exact file+line evidence [Task 1]

 succeeded in 0ms:
---
title: Deep Research Quick Reference
description: One-page cheat sheet for the autonomous deep research loop.
---

# Deep Research Quick Reference

<!-- ANCHOR:overview -->
## 1. OVERVIEW

One-page cheat sheet for the autonomous deep research loop.

---
<!-- /ANCHOR:overview -->

<!-- ANCHOR:commands -->
## 2. COMMANDS

| Command | Description |
|---------|-------------|
| `/spec_kit:deep-research:auto "topic"` | Run autonomous deep research (no approval gates) |
| `/spec_kit:deep-research:confirm "topic"` | Run with approval gates at each iteration |
| `/spec_kit:deep-research "topic"` | Ask which mode to use |

### Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `--max-iterations` | 10 | Maximum loop iterations |
| `--convergence` | 0.05 | Stop when avg newInfoRatio below this |
| `--spec-folder` | auto | Target spec folder path |
| `progressiveSynthesis` | true | Allow incremental `research/research.md` updates before final synthesis |

---

<!-- /ANCHOR:commands -->
<!-- ANCHOR:when-to-use -->
## 3. WHEN TO USE

| Scenario | Use |
|----------|-----|
| Deep unknown topic, multi-round needed | `/spec_kit:deep-research` |
| Simple question, 1-2 sources | Direct search with `@context` |
| Check prior work only | `memory_context()` |
| Exhaustive critical research | `/spec_kit:deep-research --max-iterations 15 --convergence 0.02` |

---

<!-- /ANCHOR:when-to-use -->
<!-- ANCHOR:architecture -->
## 4. ARCHITECTURE

```
/spec_kit:deep-research  -->  YAML workflow  -->  @deep-research agent (LEAF)
    |                    |                      |
    |                    |                      +-- Read state
    |                    |                      +-- Research (3-5 actions)
    |                    |                      +-- Write findings
    |                    |                      +-- Update state
    |                    |
    |                    +-- Init (config, strategy, state)
    |                    +-- Loop (dispatch, evaluate, decide)
    |                    +-- Synthesize (final research/research.md)
    |                    +-- Save (memory context)
```

---

<!-- /ANCHOR:architecture -->
<!-- ANCHOR:state-files -->
## 5. STATE FILES

| File | Location | Format | Purpose |
|------|----------|--------|---------|
| Config | `research/deep-research-config.json` | JSON | Loop parameters |
| State | `research/deep-research-state.jsonl` | JSONL | Iteration log (append-only) |
| Strategy | `research/deep-research-strategy.md` | Markdown | What worked/failed, next focus |
| Registry | `research/findings-registry.json` | JSON | Reducer-owned open/resolved questions and key findings |
| Dashboard | `research/deep-research-dashboard.md` | Markdown | Reducer-owned lifecycle and convergence summary |
| Iterations | `research/iterations/iteration-NNN.md` | Markdown | Per-iteration findings |
| Output | `research/research.md` | Markdown | Workflow-owned progressive synthesis output |

> **Live lifecycle branches:** `resume`, `restart`, `fork`, `completed-continue`. `progressiveSynthesis` defaults to `true`, so `research/research.md` is updated during the loop and finalized at synthesis.

> **Canonical pause sentinel:** `research/.deep-research-pause`

> **Runtime capability matrix:** `.opencode/skill/sk-deep-research/references/capability_matrix.md` and `.opencode/skill/sk-deep-research/assets/runtime_capabilities.json`

---

<!-- /ANCHOR:state-files -->
<!-- ANCHOR:iteration-status-legend -->
## 6. ITERATION STATUS LEGEND

| Status | Meaning |
|--------|---------|
| `complete` | Normal iteration with findings |
| `timeout` | Exceeded time/tool budget |
| `error` | Failed to produce outputs |
| `stuck` | No new information found |
| `insight` | Low ratio but conceptual breakthrough |
| `thought` | Analytical-only, no evidence |

---

<!-- /ANCHOR:iteration-status-legend -->
<!-- ANCHOR:convergence-decision-tree -->
## 7. CONVERGENCE DECISION TREE

```
Max iterations reached?
  Yes --> STOP

All questions answered?
  Yes --> STOP

stuckThreshold consecutive no-progress?
  Yes --> STUCK_RECOVERY
    Recovery works? --> CONTINUE
    Recovery fails? --> STOP (with gaps)

Composite convergence (3-signal weighted > 0.60)?
  Yes --> STOP (converged)

Otherwise --> CONTINUE
```

### 3-Signal Convergence Model

| Signal | Weight | Min Iterations | Votes STOP When |
|--------|--------|---------------|-----------------|
| Rolling Average | 0.45 | 3 | avg(last 3 newInfoRatios) < convergenceThreshold |
| MAD Noise Floor | 0.30 | 4 | latest ratio <= MAD * 1.4826 |
| Coverage / Age | 0.25 | 1 | answered / total questions >= 0.85 |

**Composite stop threshold:** 0.60 -- weighted stop score must exceed this before quality guards are evaluated.

Quality guards (source diversity, focus alignment, no single-weak-source) must pass before STOP.

---

<!-- /ANCHOR:convergence-decision-tree -->
<!-- ANCHOR:agent-iteration-checklist -->
## 8. AGENT ITERATION CHECKLIST

Each @deep-research iteration:
1. Read `deep-research-state.jsonl` and `deep-research-strategy.md`
2. Determine focus from reducer-owned strategy "Next Focus"
3. Execute 3-5 research actions (WebFetch, Grep, Read, memory_search)
4. Write `research/iterations/iteration-NNN.md` with findings
5. Append iteration record to `deep-research-state.jsonl`
6. Let the workflow reducer update `deep-research-strategy.md`, `findings-registry.json`, and `deep-research-dashboard.md`
7. Optionally update machine-owned sections in `research/research.md` when progressive synthesis is enabled

---

<!-- /ANCHOR:agent-iteration-checklist -->
<!-- ANCHOR:tuning-guide -->
## 9. TUNING GUIDE

| Goal | Adjustment |
|------|------------|
| Deeper research | Lower convergence (0.02), raise max iterations (15) |
| Faster completion | Raise convergence (0.10), lower max iterations (5) |
| Broader coverage | Start with broad topic, let iterations narrow |
| Specific answer | Start with specific question, lower max iterations (5) |

---

<!-- /ANCHOR:tuning-guide -->
<!-- ANCHOR:troubleshooting -->
## 10. TROUBLESHOOTING

| Problem | Fix |
|---------|-----|
| Stops too early | Lower `--convergence` from 0.05 to 0.02 |
| Repeats same research | Check strategy.md "Exhausted Approaches" is being read |
| Agent ignores state | Verify file paths in dispatch prompt |
| State file corrupt | Validate JSONL: `cat research/deep-research-state.jsonl \| jq .` |
| Loop runs too long | Set lower `--max-iterations` or higher `--convergence` |

---

<!-- /ANCHOR:troubleshooting -->
<!-- ANCHOR:progress-visualization -->
## 11. PROGRESS VISUALIZATION

After each iteration, the orchestrator can display a text-based convergence summary:

### Format

| Element | Format | Example |
|---------|--------|---------|
| newInfoRatio trend | ASCII sparkline | `[0.9 0.7 0.5 0.3 0.1]` |
| Question coverage | Progress bar | `[=======>...] 7/10 (70%)` |
| Composite score | Threshold bar | `[####----] 0.42 / 0.60` |
| Noise floor | Comparison | `ratio: 0.12 > floor: 0.08` |

### Example Output

```
ITERATION 5 PROGRESS
─────────────────────
newInfoRatio: 0.9 → 0.7 → 0.5 → 0.3 → 0.1  ↓ trending down
Questions:   [========>..] 8/10 answered (80%)
Composite:   [######--] 0.48 / 0.60 threshold
Noise floor: 0.08 (ratio 0.10 ABOVE floor)
Stuck count: 0 | Segment: 1 | Recovery: none
Signals: RollingAvg=STOP MAD=CONTINUE Entropy=CONTINUE
```

### When to Display

- After each iteration evaluation (Step 4)
- In the convergence report (synthesis phase)
- In confirm mode approval gates

---

<!-- /ANCHOR:progress-visualization -->

codex
I have the loop protocol and a small amount of prior context. Now I’m mapping the code and test surfaces: external implementation patterns first, then Public’s current handlers/scheduler/search pipeline and whatever test coverage already exists so the recommendations stay grounded in real seams.
Read-only research pass for iteration 33, focused on testing strategy patterns we can transfer from Modus to Spec Kit Memory.
  ✓ Review memory context and deep-research guidance relevant to late-stage Modus synthesis
  → Inspect external Modus source for seams that imply testable ranking, FSRS, cross-reference, and MCP behaviors
  • Inspect current Spec Kit Memory code and existing tests covering search, FSRS, handlers, and memory-quality behaviors
  • Synthesize a concrete unit/integration/regression testing strategy in the requested iteration format
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc "sed -n '1,220p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/modus-memory-main/internal/index/bm25.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 1 in 0ms:
sed: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/modus-memory-main/internal/index/bm25.go: No such file or directory

exec
/bin/zsh -lc "sed -n '1,240p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/modus-memory-main/internal/index/cache.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 1 in 0ms:
sed: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/modus-memory-main/internal/index/cache.go: No such file or directory

exec
/bin/zsh -lc "sed -n '1,240p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/modus-memory-main/internal/librarian/search.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 1 in 0ms:
sed: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/modus-memory-main/internal/librarian/search.go: No such file or directory

codex
The external tree isn’t at the nested `external/modus-memory-main/...` path from the brief, so I’m resolving the real paths first instead of guessing. Once I have the actual layout, I’ll read the core source and test files from there and keep the synthesis tied to the live tree, not the prompt’s older path strings.
exec
/bin/zsh -lc "find /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external -maxdepth 3 -type f | sed -n '1,160p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/import_khoj.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/doctor.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/entities.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/go.mod
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/LICENSE
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/client.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/writer.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/json.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/server.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/learnings.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/learnings/learnings.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/facts.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/bm25.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/trust.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/vault.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/beliefs.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/helpers.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/prs.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/entities.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/MIGRATION_POST.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/go.sum
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/.gitignore
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/assets/demo.svg
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/assets/comparison.svg
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/assets/doctor.svg
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/assets/hero.svg
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/assets/architecture.svg
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/assets/security.svg
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/assets/fsrs-decay.svg

exec
/bin/zsh -lc "find /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external -maxdepth 3 -type d | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/learnings
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/assets

exec
/bin/zsh -lc "rg -n \"memory_search|memory_context|memory_match_triggers|fsrs|scheduler|processReview|memory_validate\" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit -g '*test*' -g '*.spec.*' -g '*.test.*' -g 'vitest*'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:252:### EX-001 | Unified context retrieval (memory_context)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:258:Prompt: `Use memory_context in resume mode for: fix flaky index scan retry logic. Reuse a real sessionId with prompt-context history. Capture the evidence needed to prove Relevant bounded context returned; auto-resume systemPromptContext is injected before budget enforcement; final response stays within the advertised token budget. Return a concise user-facing pass/fail verdict with the main reason.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:266:### EX-002 | Semantic and lexical search (memory_search)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:276:Additional audit scenario: `Run memory_search against a fixture set that contains one expired memory, one live memory, and enough constitutional rows to overflow a tiny limit. Capture the evidence needed to prove multi-concept search excludes the expired row, constitutional injection never returns more than the requested limit, and malformed embeddings fail with a clear validation-style error instead of a raw sqlite-vec exception. Return a concise user-facing pass/fail verdict with the main reason.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:284:### EX-003 | Trigger phrase matching (memory_match_triggers)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:390:### EX-010 | Validation feedback (memory_validate)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:1316:Prompt: `Validate PI-B3 folder description discovery. Capture the evidence needed to prove description.json exists after create.sh; stale detection triggers on spec.md edit; per-folder files preferred over spec.md fallback; mixed-mode aggregation works; invalid JSON or schema-invalid description.json files are ignored, spec.md fallback is used, and existing files are repaired in place; missing description.json falls back cleanly without implicit backfill; out-of-base or prefix-bypass paths are rejected by realpath containment checks; YAML frontmatter is stripped before description extraction, including CRLF-heavy frontmatter cases; memory_context uses folder routing; regeneration leaves valid JSON on disk with no leftover temp files. Return a concise user-facing pass/fail verdict with the main reason.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:1318:description.json exists after create.sh; stale detection triggers on spec.md edit; per-folder files preferred over spec.md fallback; mixed-mode aggregation works; invalid JSON or schema-invalid description.json files are ignored, spec.md fallback is used, and existing files are repaired in place; missing description.json falls back cleanly without implicit backfill; out-of-base or prefix-bypass paths are rejected by realpath containment checks; YAML frontmatter is stripped before description extraction, including CRLF-heavy frontmatter cases; memory_context uses folder routing; regeneration leaves valid JSON on disk with no leftover temp files
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:2700:Verify `memory_context` emits trace-only session transitions with no non-trace leakage.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:2703:Prompt: `Validate Markovian session transition tracing for memory_context. Capture the evidence needed to prove Trace-enabled responses include spec-shaped sessionTransition; non-trace responses omit it entirely; no top-level metadata leak appears when trace is disabled. Return a concise user-facing pass/fail verdict with the main reason.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:3067:Prompt: `Run a search returning > 5 results and verify the response preserves full data.results while adding data.progressiveDisclosure with summaryLayer (count + digest), snippet previews (max 100 chars with detailAvailable flags), and a continuation cursor. Then use memory_search({ cursor }) to retrieve the next page and verify remaining results are returned. Capture the evidence needed to prove the additive disclosure contract. Return a concise user-facing pass/fail verdict with the main reason.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:3469:| EX-001 | Existing Features | Unified context retrieval (memory_context) | [EX-001](01--retrieval/001-unified-context-retrieval-memory-context.md) | [01--retrieval/01-unified-context-retrieval-memorycontext.md](../feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:3470:| EX-002 | Existing Features | Semantic and lexical search (memory_search) | [EX-002](01--retrieval/002-semantic-and-lexical-search-memory-search.md) | [01--retrieval/02-semantic-and-lexical-search-memorysearch.md](../feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:3471:| EX-003 | Existing Features | Trigger phrase matching (memory_match_triggers) | [EX-003](01--retrieval/003-trigger-phrase-matching-memory-match-triggers.md) | [01--retrieval/03-trigger-phrase-matching-memorymatchtriggers.md](../feature_catalog/01--retrieval/03-trigger-phrase-matching-memorymatchtriggers.md) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:3478:| EX-010 | Existing Features | Validation feedback (memory_validate) | [EX-010](02--mutation/010-validation-feedback-memory-validate.md) | [02--mutation/05-validation-feedback-memoryvalidate.md](../feature_catalog/02--mutation/05-validation-feedback-memoryvalidate.md) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:3747:| 264 | Context Preservation | Query-intent routing in memory_context | [264](22--context-preservation-and-code-graph/264-query-intent-routing.md) | [22--context-preservation-and-code-graph/19-query-intent-routing.md](../feature_catalog/22--context-preservation-and-code-graph/19-query-intent-routing.md) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-bridge.vitest.ts:33:vi.mock('../lib/cognitive/fsrs-scheduler', () => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:384:  it('C13: Response meta.tool is memory_search', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:388:    expect(envelope.meta.tool).toBe('memory_search');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:83:      validateToolInputSchema('memory_context', {}, TOOL_DEFINITIONS);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:119:      validateToolInputSchema('memory_context', { input: 'resume', mode: 'invalid-mode' }, TOOL_DEFINITIONS);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:133:      validateToolArgs('memory_search', { query: 'valid query', unexpected: true } as Record<string, unknown>);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:137:    expect(errorSpy.mock.calls.some((call) => String(call[0]).includes('[schema-validation] memory_search:'))).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:240:   4. memory_search LIMIT CONTRACT (schema + runtime alignment)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:243:describe('memory_search limit contract', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:246:      validateToolInputSchema('memory_search', { cursor: 'opaque-cursor-token' }, TOOL_DEFINITIONS);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:252:      validateToolArgs('memory_search', { cursor: 'opaque-cursor-token' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:258:      validateToolInputSchema('memory_search', { concepts: ['alpha', 'beta'] }, TOOL_DEFINITIONS);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:264:      validateToolInputSchema('memory_search', {}, TOOL_DEFINITIONS);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:270:      validateToolArgs('memory_search', { query: 'ab', limit: 100 });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:276:      validateToolArgs('memory_search', { query: 'ab', limit: 101 });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:282:      validateToolInputSchema('memory_search', { query: 'ab', limit: 101 }, TOOL_DEFINITIONS);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:288:      validateToolArgs('memory_search', { concepts: ['solo'] });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:292:  it('public schema rejects unknown memory_search parameters', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:294:      validateToolInputSchema('memory_search', { query: 'valid query', unexpected: true }, TOOL_DEFINITIONS);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:300:      validateToolInputSchema('memory_search', { query: 'a' }, TOOL_DEFINITIONS);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:304:  it('runtime rejects unknown memory_search parameters', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:306:      validateToolArgs('memory_search', { query: 'valid query', unexpected: true } as Record<string, unknown>);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:310:  it('runtime accepts governed scope fields for memory_search', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:312:      validateToolArgs('memory_search', {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:322:  it('public and runtime schemas accept response profiles for memory_search', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:329:      validateToolInputSchema('memory_search', args, TOOL_DEFINITIONS);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:331:    expect(validateToolArgs('memory_search', args)).toEqual(args);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:336:  it('public and runtime schemas accept governed scope fields for memory_context', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:346:      validateToolInputSchema('memory_context', args, TOOL_DEFINITIONS);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:348:    expect(validateToolArgs('memory_context', args)).toEqual(args);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:351:  it('public and runtime schemas accept response profiles for memory_context', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:358:      validateToolInputSchema('memory_context', args, TOOL_DEFINITIONS);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:360:    expect(validateToolArgs('memory_context', args)).toEqual(args);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:378:  it('public and runtime schemas accept governed scope fields for memory_match_triggers', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:389:      validateToolInputSchema('memory_match_triggers', args, TOOL_DEFINITIONS);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:391:    expect(validateToolArgs('memory_match_triggers', args)).toEqual(args);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:59:    it('T516-2: handle_memory_search alias is exported', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:60:      expect(typeof handler.handle_memory_search).toBe('function');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:70:        'handle_memory_validate',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/provenance-envelope.vitest.ts:81:vi.mock('../lib/cognitive/fsrs-scheduler', () => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-fsrs-formula.vitest.ts:2:// Converted from: unit-fsrs-formula.test.ts (custom runner)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:9:} from '../lib/cognitive/fsrs-scheduler';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:83:  it('classifies session as fsrs_schedule', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:84:    expect(classifyHybridDecay('session')).toBe('fsrs_schedule');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:87:  it('classifies scratch as fsrs_schedule', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:88:    expect(classifyHybridDecay('scratch')).toBe('fsrs_schedule');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:91:  it('classifies research as fsrs_schedule', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:92:    expect(classifyHybridDecay('research')).toBe('fsrs_schedule');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:95:  it('classifies implementation as fsrs_schedule', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:96:    expect(classifyHybridDecay('implementation')).toBe('fsrs_schedule');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:99:  it('classifies general as fsrs_schedule', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:100:    expect(classifyHybridDecay('general')).toBe('fsrs_schedule');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:103:  it('classifies unknown types as fsrs_schedule (safe default)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:104:    expect(classifyHybridDecay('transient')).toBe('fsrs_schedule');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:105:    expect(classifyHybridDecay('unknown-type')).toBe('fsrs_schedule');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:106:    expect(classifyHybridDecay('')).toBe('fsrs_schedule');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:5:import { TIER_MULTIPLIER } from '../lib/cognitive/fsrs-scheduler';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:9:type FsrsSchedulerModule = typeof import('../lib/cognitive/fsrs-scheduler');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:12:let fsrsScheduler: FsrsSchedulerModule | null = null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:17:    fsrsScheduler = await import('../lib/cognitive/fsrs-scheduler');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:19:    fsrsScheduler = null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:31:    if (!fsrsScheduler?.calculateRetrievability) return;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:32:    const result = fsrsScheduler.calculateRetrievability(1.0, 0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:37:    if (!fsrsScheduler?.calculateRetrievability) return;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:38:    const result = fsrsScheduler.calculateRetrievability(1.0, 1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:44:    if (!fsrsScheduler?.calculateRetrievability) return;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:45:    const rLowStability = fsrsScheduler.calculateRetrievability(1.0, 10);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:46:    const rHighStability = fsrsScheduler.calculateRetrievability(10.0, 10);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:54:    if (!fsrsScheduler?.updateStability) return;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:59:    const newStability = fsrsScheduler.updateStability(initialStability, difficulty, grade, retrievability);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:64:    if (!fsrsScheduler?.updateStability) return;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:69:    const newStability = fsrsScheduler.updateStability(initialStability, difficulty, grade, retrievability);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:77:    if (!fsrsScheduler?.calculateRetrievability) return;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:78:    const calc = fsrsScheduler.calculateRetrievability;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:89:    if (!fsrsScheduler?.calculateRetrievability) return;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:90:    const calc = fsrsScheduler.calculateRetrievability;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:100:    if (!fsrsScheduler?.calculateRetrievability) return;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:101:    const rVeryLong = fsrsScheduler.calculateRetrievability(1.0, 10000);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:109:    if (!fsrsScheduler?.calculateRetrievability) return;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:110:    const calc = fsrsScheduler.calculateRetrievability;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:120:    if (!fsrsScheduler?.calculateRetrievability) return;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:121:    const calc = fsrsScheduler.calculateRetrievability;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:128:    if (!fsrsScheduler?.calculateRetrievability) return;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:129:    const calc = fsrsScheduler.calculateRetrievability;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:228:    if (!fsrsScheduler?.calculateRetrievability) return;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:229:    const rHigh = fsrsScheduler.calculateRetrievability(10.0, 1);  // High stability, recent
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:230:    const rLow = fsrsScheduler.calculateRetrievability(1.0, 10);   // Low stability, old
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:235:    if (!fsrsScheduler?.updateStability) return;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:240:    const newStability = fsrsScheduler.updateStability(initial, difficulty, grade, r);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:245:    if (!fsrsScheduler?.updateStability) return;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:249:    const boostHighR = fsrsScheduler.updateStability(initial, difficulty, grade, 0.9) - initial;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:250:    const boostLowR = fsrsScheduler.updateStability(initial, difficulty, grade, 0.4) - initial;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:265:    if (!fsrsScheduler) return;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:266:    const constants = fsrsScheduler.FSRS_CONSTANTS || {};
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:273:    if (!fsrsScheduler) return;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:274:    const constants = fsrsScheduler.FSRS_CONSTANTS || {};
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:280:    if (!fsrsScheduler) return;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:281:    const constants = fsrsScheduler.FSRS_CONSTANTS || {};
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:287:    if (!fsrsScheduler) return;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:288:    const constants = fsrsScheduler.FSRS_CONSTANTS || {};
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:297:    if (!fsrsScheduler?.calculateRetrievability) return;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:298:    const rZero = fsrsScheduler.calculateRetrievability(1.0, 0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:308:    if (!fsrsScheduler?.calculateRetrievability) return;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:309:    const calc = fsrsScheduler.calculateRetrievability;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:328:    if (!fsrsScheduler?.calculateRetrievability) return;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:329:    const calc = fsrsScheduler.calculateRetrievability;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:340:    if (!fsrsScheduler?.calculateRetrievability) return;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:341:    const calc = fsrsScheduler.calculateRetrievability;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:355:    if (!fsrsScheduler?.updateStability) return;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:360:    const newStability = fsrsScheduler.updateStability(initial, highDifficulty, grade, retrievability);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:365:    if (!fsrsScheduler?.updateStability) return;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:371:    const newStability = fsrsScheduler.updateStability(initial, lowDifficulty, grade, retrievability);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:376:    const newStabilityHard = fsrsScheduler.updateStability(initial, highDifficulty, grade, retrievability);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:381:    if (!fsrsScheduler?.updateStability) return;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:389:      const r = fsrsScheduler.calculateRetrievability
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:390:        ? fsrsScheduler.calculateRetrievability(stability, 1)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:392:      stability = fsrsScheduler.updateStability(stability, difficulty, grade, r);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:407:    if (!fsrsScheduler?.updateStability) return;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:416:      const r = fsrsScheduler.calculateRetrievability
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:417:        ? fsrsScheduler.calculateRetrievability(stability, 1)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:419:      stability = fsrsScheduler.updateStability(stability, difficulty, grade, r);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:438:    if (!fsrsScheduler?.updateDifficulty) return;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:439:    const updateD = fsrsScheduler.updateDifficulty;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:451:    if (!fsrsScheduler?.updateDifficulty) return;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:453:    const newD = fsrsScheduler.updateDifficulty(dInitial, 1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:458:    if (!fsrsScheduler?.updateDifficulty) return;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:460:    const newD = fsrsScheduler.updateDifficulty(dInitial, 4);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:465:    if (!fsrsScheduler?.updateDifficulty) return;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:466:    const updateD = fsrsScheduler.updateDifficulty;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:480:    if (!fsrsScheduler?.updateDifficulty) return;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:481:    const updateD = fsrsScheduler.updateDifficulty;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:498:    if (!fsrsScheduler?.calculateOptimalInterval) return;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:499:    const interval = fsrsScheduler.calculateOptimalInterval(1.0, 0.9);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:504:    if (!fsrsScheduler?.calculateOptimalInterval) return;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:505:    const calcInterval = fsrsScheduler.calculateOptimalInterval;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:517:    if (!fsrsScheduler?.calculateOptimalInterval) return;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:518:    const calcInterval = fsrsScheduler.calculateOptimalInterval;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:535:    if (!fsrsScheduler?.calculateOptimalInterval) return;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:536:    const calcInterval = fsrsScheduler.calculateOptimalInterval;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:564:      if (!fsrsScheduler) return;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:565:      const moduleExports = fsrsScheduler as unknown as Record<string, unknown>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:625:    if (!fsrsScheduler) return;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:627:    if (typeof fsrsScheduler.calculateRetrievability === 'function') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:628:      const r = fsrsScheduler.calculateRetrievability(30, 10);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:482:describe('T059: autoDetectIntent Parameter (memory_search)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/response-profile-formatters.vitest.ts:23:      tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:76:    it('T517-2: handle_memory_match_triggers alias exported', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:77:      expect(typeof handler.handle_memory_match_triggers).toBe('function');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:221:  it('starts and stops the interval scheduler cleanly', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:3:// Aligned with production attention-decay.ts + fsrs-scheduler.ts named exports
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:6:import * as fsrsScheduler from '../lib/cognitive/fsrs-scheduler';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:306:     Production fsrs-scheduler.ts exports: FSRS_FACTOR=19/81, FSRS_DECAY=-0.5
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:311:      expect(fsrsScheduler.FSRS_FACTOR).toBeCloseTo(19 / 81, 4);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:315:      expect(fsrsScheduler.FSRS_DECAY).toBe(-0.5);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:319:      expect(fsrsScheduler.DEFAULT_INITIAL_STABILITY).toBe(1.0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:323:      expect(fsrsScheduler.DEFAULT_INITIAL_DIFFICULTY).toBe(5.0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:327:      expect(fsrsScheduler.GRADE_AGAIN).toBe(1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:328:      expect(fsrsScheduler.GRADE_HARD).toBe(2);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:329:      expect(fsrsScheduler.GRADE_GOOD).toBe(3);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:330:      expect(fsrsScheduler.GRADE_EASY).toBe(4);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:334:      expect(fsrsScheduler.FSRS_CONSTANTS).toBeTruthy();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:335:      expect(fsrsScheduler.FSRS_CONSTANTS.FSRS_FACTOR).toBeCloseTo(19 / 81, 4);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:346:      expect(fsrsScheduler.calculateRetrievability(1.0, 0)).toBe(1.0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:351:        fsrsScheduler.calculateRetrievability(1.0, t)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:359:      const rFar = fsrsScheduler.calculateRetrievability(1.0, 10000);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:364:      const rS1 = fsrsScheduler.calculateRetrievability(1.0, 5);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:365:      const rS10 = fsrsScheduler.calculateRetrievability(10.0, 5);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:370:      const rNeg = fsrsScheduler.calculateRetrievability(1.0, -5);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:371:      const rHuge = fsrsScheduler.calculateRetrievability(0.001, 1000000);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:379:      expect(fsrsScheduler.calculateRetrievability(0, 1)).toBe(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:380:      expect(fsrsScheduler.calculateRetrievability(-5, 1)).toBe(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:397:    const fsrsExports = ['applyFsrsDecay', 'calculateRetrievabilityDecay', 'activateMemoryWithFsrs'];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:399:    it.each(fsrsExports)('FSRS export: %s', (name) => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:6:  { tool: 'memory_context', handler: 'handleMemoryContext', layer: 'L1' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:7:  { tool: 'memory_search', handler: 'handleMemorySearch', layer: 'L2' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:8:  { tool: 'memory_match_triggers', handler: 'handleMemoryMatchTriggers', layer: 'L2' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:15:  { tool: 'memory_validate', handler: 'handleMemoryValidate', layer: 'L4' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:33:  { camel: 'handleMemorySearch', snake: 'handle_memory_search' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:34:  { camel: 'handleMemoryMatchTriggers', snake: 'handle_memory_match_triggers' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:41:  { camel: 'handleMemoryValidate', snake: 'handle_memory_validate' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:56:  { camel: 'handleMemoryContext', snake: 'handle_memory_context' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:82:      const key1 = generateCacheKey('memory_search', args);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:83:      const key2 = generateCacheKey('memory_search', args);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:88:      const key1 = generateCacheKey('memory_search', { query: 'auth' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:89:      const key2 = generateCacheKey('memory_search', { query: 'login' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:95:      const key1 = generateCacheKey('memory_search', args);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:352:      const key1 = generateCacheKey('memory_search', { query: 'test1' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:353:      const key2 = generateCacheKey('memory_search', { query: 'test2' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:355:      set(key1, 'value1', { toolName: 'memory_search' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:356:      set(key2, 'value2', { toolName: 'memory_search' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:358:      const invalidated = invalidateByTool('memory_search');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:366:      const key1 = generateCacheKey('memory_search', { query: 'test1' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:369:      set(key1, 'value1', { toolName: 'memory_search' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:380:      const key1 = generateCacheKey('memory_search', { query: 'test1' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:383:      set(key1, 'value1', { toolName: 'memory_search' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:394:      const searchKey = generateCacheKey('memory_search', { query: 'test' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:395:      const triggerKey = generateCacheKey('memory_match_triggers', { prompt: 'test' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:396:      set(searchKey, 'search_result', { toolName: 'memory_search' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:397:      set(triggerKey, 'trigger_result', { toolName: 'memory_match_triggers' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:423:      const key = generateCacheKey('memory_search', args);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:427:        'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:436:      expect(invalidateByTool('memory_search')).toBe(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:439:      const second = withCache('memory_search', args, async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:589:      const key = generateCacheKey('memory_search', args);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:593:        'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:603:      const second = withCache('memory_search', args, async () => 'fresh-after-shutdown');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:89:describe('memory_context advisory metadata', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:181:  it('T022: memory_search has tool-specific hints', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:182:    expect(TOOL_SPECIFIC_HINTS.memory_search).toBeDefined();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:183:    expect(typeof TOOL_SPECIFIC_HINTS.memory_search).toBe('object');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:221:  it('T029: memory_search EMBEDDING_FAILED has contextual hint', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:224:      TOOL_SPECIFIC_HINTS.memory_search?.[ERROR_CODES.EMBEDDING_FAILED];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:244:    const searchHint = getRecoveryHint('memory_search', ERROR_CODES.EMBEDDING_FAILED);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:246:      TOOL_SPECIFIC_HINTS.memory_search[ERROR_CODES.EMBEDDING_FAILED];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:301:      'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:315:    const hasSearch = hasSpecificHint('memory_search', ERROR_CODES.EMBEDDING_FAILED);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:356:    const searchHints = getAvailableHints('memory_search');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:362:    const searchHints = getAvailableHints('memory_search');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:365:      TOOL_SPECIFIC_HINTS.memory_search[ERROR_CODES.EMBEDDING_FAILED];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:669:  it('T087: QUERY_TOO_LONG suggests memory_match_triggers()', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:672:      a.includes('memory_match_triggers()')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:713:    const toolSpecific = getRecoveryHint('memory_search', ERROR_CODES.EMBEDDING_FAILED);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:718:      TOOL_SPECIFIC_HINTS.memory_search[ERROR_CODES.EMBEDDING_FAILED]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:725:    const allSearchHints = getAvailableHints('memory_search');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:18:        memory_context: 3500,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:19:        memory_search: 3500,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:21:        memory_match_triggers: 3500,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:27:        memory_validate: 1000,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:159:      'memory_context',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:160:      'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:162:      'memory_match_triggers',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:170:      'memory_validate',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:292:      'memory_context', 'memory_search', 'memory_quick_search', 'memory_match_triggers',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:295:      'memory_validate', 'memory_save', 'memory_index_scan', 'memory_health',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:927:        { id: 'call-1', params: { name: 'memory_search', arguments: {} } },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:944:      expect(callArgs[0]).toBe('memory_search')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1054:              name: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1103:        memoryAwareTools: new Set<string>(['memory_search']),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1113:        { id: 'call-5', params: { name: 'memory_search', arguments: { query: 'hook validation' } } },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1123:    it('T000g: memory_context resume mode invokes TM-05 compaction hook at runtime', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1131:        memoryAwareTools: new Set<string>(['memory_context']),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1144:          params: { name: 'memory_context', arguments: { input: 'session resume context', mode: 'resume' } },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1157:    it('T000h: memory_context non-resume mode keeps SK-004 memory-aware path', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1164:        memoryAwareTools: new Set<string>(['memory_context']),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1177:          params: { name: 'memory_context', arguments: { input: 'focused retrieval context', mode: 'focused' } },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1563:      const response = errorsModule!.buildErrorResponse!('memory_search', testError, { query: 'test' })
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1581:      const hint = errorsModule!.getRecoveryHint!('memory_search', 'UNKNOWN_TOOL')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1614:    it('T28: L1 budget = 3500 (memory_context)', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1619:      expect(layerDefs!.getTokenBudget!('memory_context')).toBe(3500)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1622:    it('T28b: L2 budget = 3500 (memory_search)', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1627:      expect(layerDefs!.getTokenBudget!('memory_search')).toBe(3500)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1703:    const expectedAwareTools = ['memory_context', 'memory_search', 'memory_match_triggers', 'memory_list', 'memory_save', 'memory_index_scan']
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2084:      'memory_context': '[L1:Orchestration]',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2085:      'memory_search': '[L2:Core]',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2086:      'memory_match_triggers': '[L2:Core]',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2093:      'memory_validate': '[L4:Mutation]',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2131:    it('T000e: memory_context supports optional tokenUsage (0.0-1.0)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2132:      expect(toolSchemasCode).toMatch(/name:\s*'memory_context'[\s\S]*?tokenUsage:\s*\{\s*type:\s*'number'/)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2315:        'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2341:      expect(result).toContain('memory_context')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2342:      expect(result).toContain('memory_search')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:250:  it('T020-02: Generates memory_search command with sessionId when specFolder is not provided', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:254:  it('T020-03: Generates generic memory_search when neither specFolder nor sessionId is provided', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:183:      expect(typeof handlerExports.handle_memory_match_triggers).toBe('function');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/review-fixes.vitest.ts:41:    const result = validateToolArgs('memory_search', {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay.vitest.ts:15:} from '../lib/cognitive/fsrs-scheduler';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-integration.vitest.ts:159:  it('fsrs exports: computeStructuralFreshness, computeGraphCentrality', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-integration.vitest.ts:160:    const mod = await import('../lib/search/fsrs');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-eval-channels.vitest.ts:1:// TEST: memory_context per-channel eval logging (T056)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-eval-channels.vitest.ts:88:describe('T056: memory_context emits per-strategy channel eval rows', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/extraction-adapter.vitest.ts:133:    expect(matchRule('memory_search', 'spec.md error context')).not.toBeNull();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/extraction-adapter.vitest.ts:134:    expect(matchRule('memory_context', 'spec.md metadata')).not.toBeNull();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-eval-channels.vitest.ts:1:// TEST: memory_search per-channel eval logging (T056)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-eval-channels.vitest.ts:106:describe('T056: memory_search emits per-channel eval rows', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:86:    expect(envelope.meta.tool).toBe('memory_search');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:30:    tool: 'memory_context',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:37:    tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:43:    tool: 'memory_match_triggers',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:87:    tool: 'memory_validate',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:176:  { tool: 'memory_context', handler: 'handleMemoryContext' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:177:  { tool: 'memory_search', handler: 'handleMemorySearch' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:179:  { tool: 'memory_match_triggers', handler: 'handleMemoryMatchTriggers' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:117:        memory_context: 'L1',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:118:        memory_search: 'L2',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:120:        memory_match_triggers: 'L2',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:126:        memory_validate: 'L4',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:194:        { tool: 'memory_context', expected: '[L1:Orchestration]' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:195:        { tool: 'memory_search', expected: '[L2:Core]' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:221:      const result = mod.enhanceDescription('memory_context', 'Some description text');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:227:        { tool: 'memory_search', desc: 'Search memories', prefix: '[L2:Core]' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:242:      expect(mod.enhanceDescription('memory_context', '')).toBe('[L1:Orchestration] ');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:252:        { tool: 'memory_context', expected: 3500 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:253:        { tool: 'memory_search', expected: 3500 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:270:      expect(typeof mod.getTokenBudget('memory_context')).toBe('number');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:280:      const info = expectLayerInfo(mod.getLayerInfo('memory_context'));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:287:      expect(info.tools).toContain('memory_context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:291:      const info1 = mod.getLayerInfo('memory_context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:292:      const info2 = mod.getLayerInfo('memory_context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:301:      const info = expectLayerInfo(mod.getLayerInfo('memory_search'));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:430:      const toolSamples = ['memory_context', 'memory_search', 'memory_list',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts:54:        CREATE INDEX idx_fsrs_retrieval ON memory_index(stability, difficulty, last_review);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:20:        tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:58:        tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:97:        tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:108:        tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:135:        tool: 'memory_search'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:143:        tool: 'memory_search'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:152:        tool: 'memory_search'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:186:        tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:206:        tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:254:        tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:312:        tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:352:        tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:363:        tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:373:        tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:384:        tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:409:        tool: 'memory_search'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:30:import * as fsrsScheduler from '../lib/cognitive/fsrs-scheduler.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:58:      expect(fsrsScheduler.GRADE_GOOD).toBe(3);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:76:      const initial = fsrsScheduler.createInitialParams();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:77:      const reviewed = fsrsScheduler.processReview(initial, fsrsScheduler.GRADE_GOOD);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:82:      const lowRetrievability = fsrsScheduler.updateStability(2.0, 5.0, fsrsScheduler.GRADE_GOOD, 0.2);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:83:      const highRetrievability = fsrsScheduler.updateStability(2.0, 5.0, fsrsScheduler.GRADE_GOOD, 0.9);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:88:      expect(fsrsScheduler.calculateRetrievability(-1, 5)).toBe(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:89:      expect(fsrsScheduler.calculateOptimalInterval(0, 0.9)).toBe(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:140:      const reviewed = fsrsScheduler.processReview({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:145:      }, fsrsScheduler.GRADE_AGAIN);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:146:      expect(reviewed.stability).toBeGreaterThanOrEqual(fsrsScheduler.MIN_STABILITY);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:147:      expect(fsrsScheduler.calculateRetrievability(365, 30)).toBeLessThanOrEqual(1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:294:      const nextReviewDate = fsrsScheduler.getNextReviewDate(5);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:287:    const resp = buildErrorResponse('memory_search', err);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:296:    const resp = buildErrorResponse('memory_search', err);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:302:    const resp = buildErrorResponse('memory_search', err);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:310:    const resp = buildErrorResponse('memory_search', err);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:311:    expect(resp.meta.tool).toBe('memory_search');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:318:    const resp = buildErrorResponse('memory_search', err);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:328:  it('F7: Tool-specific hints included for memory_search + E001', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:330:    const resp = buildErrorResponse('memory_search', err);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:353:    const err = createErrorWithHint('E040', 'fail', {}, 'memory_search');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:469:  it('K2: Has memory_search, checkpoint_restore, memory_save', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:470:    expect('memory_search' in TOOL_SPECIFIC_HINTS).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:476:    const searchHints = TOOL_SPECIFIC_HINTS['memory_search'];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:492:  it('L1: Returns tool-specific hint for memory_search + E001', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:493:    const hint = getRecoveryHint('memory_search', 'E001');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:512:    const hint = getRecoveryHint('memory_search', 'E040');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:524:  it('M1: Returns true for known tool+code (memory_search, E001)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:525:    expect(hasSpecificHint('memory_search', 'E001')).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:543:    const hints = getAvailableHints('memory_search');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:550:    const hints = getAvailableHints('memory_search');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:626:      expect(md).toContain('memory_search');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:127:  it('returns null for memory_context (prevents recursive surfacing)', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:128:    const result = await autoSurfaceAtToolDispatch('memory_context', { input: 'some context' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:132:  it('returns null for memory_search', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:133:    const result = await autoSurfaceAtToolDispatch('memory_search', { query: 'some query' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:137:  it('returns null for memory_match_triggers', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:138:    const result = await autoSurfaceAtToolDispatch('memory_match_triggers', { prompt: 'some prompt' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:4:import type { FsrsParams } from '../lib/cognitive/fsrs-scheduler';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:5:import * as fsrs from '../lib/cognitive/fsrs-scheduler';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:71:    const result = fsrs.calculateElapsedDays(null);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:77:    const result = fsrs.calculateElapsedDays(oneHourAgo);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:84:    const result = fsrs.calculateElapsedDays(tenDaysAgo);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:91:    const result = fsrs.calculateElapsedDays(oneYearAgo);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:98:    const result = fsrs.calculateElapsedDays(tomorrow);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:104:    const result = fsrs.calculateElapsedDays(now);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:116:    const result = fsrs.getNextReviewDate(1.0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:122:    const result = fsrs.getNextReviewDate(1.0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:128:    const lowStab = new Date(fsrs.getNextReviewDate(1.0)).getTime();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:129:    const highStab = new Date(fsrs.getNextReviewDate(50.0)).getTime();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:134:    const r90 = new Date(fsrs.getNextReviewDate(10.0, 0.9)).getTime();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:135:    const r50 = new Date(fsrs.getNextReviewDate(10.0, 0.5)).getTime();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:140:    const result = fsrs.getNextReviewDate(0.1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:152:    const params = fsrs.createInitialParams();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:162:    const params = fsrs.createInitialParams();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:163:    expect(params.stability).toBe(fsrs.DEFAULT_INITIAL_STABILITY);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:167:    const params = fsrs.createInitialParams();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:168:    expect(params.difficulty).toBe(fsrs.DEFAULT_INITIAL_DIFFICULTY);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:172:    const params = fsrs.createInitialParams();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:177:    const params = fsrs.createInitialParams();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:182:    const a = fsrs.createInitialParams();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:183:    const b = fsrs.createInitialParams();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:191:   D. FSRS SCHEDULER — processReview
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:194:describe('D. processReview', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:198:    initial = fsrs.createInitialParams();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:202:    const result = fsrs.processReview(initial, 3);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:212:    const result = fsrs.processReview(initial, 3);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:218:    const result = fsrs.processReview(initial, 3);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:226:    const result = fsrs.processReview(params, fsrs.GRADE_AGAIN);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:232:    const result = fsrs.processReview(params, fsrs.GRADE_EASY);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:238:    const result = fsrs.processReview(params, fsrs.GRADE_GOOD);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:244:    const resultHard = fsrs.processReview(params, fsrs.GRADE_HARD);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:245:    const resultGood = fsrs.processReview(params, fsrs.GRADE_GOOD);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:250:    const result = fsrs.processReview(initial, 3);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:257:    const result = fsrs.processReview(initial, 3);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:263:    const params = fsrs.createInitialParams();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:264:    const result1 = fsrs.processReview(params, 3);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:265:    const result2 = fsrs.processReview(result1, 4);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts:12:    content: [{ type: 'text', text: JSON.stringify({ data: { results: [], count: 0 }, meta: { tool: 'memory_search' } }) }],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-hybrid-decay.vitest.ts:11:} from '../lib/cognitive/fsrs-scheduler';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/schema-migration.vitest.ts:48:      const fsrsColumns = ['stability', 'difficulty', 'last_review', 'review_count'];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/schema-migration.vitest.ts:49:      expect(fsrsColumns).toHaveLength(4);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/schema-migration.vitest.ts:231:    it('idx_fsrs_retrieval composite index exists', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:32:  handle_memory_context,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:238:   T021-T030: handle_memory_context MAIN HANDLER TESTS
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:242:  it('T021: handle_memory_context is a function', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:289:  it('T029: handleMemoryContext is alias for handle_memory_context', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:290:    expect(handleMemoryContext).toBe(handle_memory_context);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:847:  it('T101: handle_memory_context is exported', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:868:  it('T105: handleMemoryContext is same as handle_memory_context', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:869:    expect(handleMemoryContext).toBe(handle_memory_context);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:902:      meta: { tool: 'memory_search' }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/error-sanitization.vitest.ts:50:    const response = buildErrorResponse('memory_search', error);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/error-sanitization.vitest.ts:68:    const response = buildErrorResponse('memory_search', error);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/error-sanitization.vitest.ts:83:    const response = buildErrorResponse('memory_search', error);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-scoring-calibration.vitest.ts:41:} = require('../lib/cognitive/fsrs-scheduler.ts');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:76:      liveBaselineResolution: 'memory_context',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:107:      liveBaselineResolution: 'memory_context',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:138:      liveBaselineResolution: 'memory_context_then_grep',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:123:describe('memory_search UX hook integration', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:304:  `).run(1, 'sess-1', 1, 0.9, now, later, 2, 1, 1, 'memory_search', 'call-1', 'rule-1', 0);

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/bm25.go | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "find /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external -name '*_test.go' -o -name '*.test.go' | sort" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
   281			}
   282			if subject != "" && !strings.EqualFold(doc.Get("subject"), subject) {
   283				continue
   284			}
   285			result = append(result, doc)
   286		}
   287		return result, nil
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
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go | sed -n '840,980p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

codex
I’ve confirmed one useful testing signal already: the external repo ships without Go tests, so any adoption here should come with a stronger test contract than the source system had. I’m now tracing the exact live seams where Modus does expansion, decay/reinforcement, and connected-result formatting, then matching those against Public’s existing Vitest/manual coverage so the plan lands in the right layers.
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "rg -n \"ExpandQuery|RankResults|ReinforceFact|Connected\\(|memory_search|memory_reinforce|memory_decay_facts|vault_connected|deduplicateResults|filterOOD\" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/{mcp,index,vault,librarian}/*.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go:156:func (ci *crossIndex) Connected(query string, limit int) []DocRef {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go:249:func FormatConnected(refs []DocRef) string {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go:167:// filterOOD performs out-of-domain detection.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go:170:func filterOOD(query string, results []scoredDoc, threshold float64) bool {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go:197:// deduplicateResults removes duplicate paths, keeping the highest scored.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go:198:func deduplicateResults(results []SearchResult) []SearchResult {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go:10:// ExpandQuery asks the librarian to produce search-optimized terms for a query.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go:15:func ExpandQuery(query string) []string {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go:55:// RankResults asks the librarian to score and rank search results by relevance.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go:57:func RankResults(query string, results []ResultSnippet, topN int) []int {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:13://	memory_facts, memory_search, memory_store,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:14://	memory_reinforce, memory_decay_facts, vault_connected
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:26:		"memory_search":     true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:28:		"memory_reinforce":  true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:29:		"memory_decay_facts": true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:30:		"vault_connected":   true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go:160:// ReinforceFact increases a fact's confidence and stability after a successful recall.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go:163:func (v *Vault) ReinforceFact(relPath string) error {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:31:			expansions := librarian.ExpandQuery(query)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:77:			refs := v.Index.Connected(query, 5)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:283:			queries = librarian.ExpandQuery(query)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:284:			log.Printf("memory_search: librarian expanded %q → %d variants", query, len(queries))
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:315:				go v.ReinforceFact(f.ID) // async — don't block search response
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:343:	srv.AddTool("memory_search", "Search episodic memory facts with librarian expansion and FSRS reinforcement.", memorySearchSchema, memorySearchHandler)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:856:	srv.AddTool("memory_decay_facts", "Run memory fact confidence decay sweep.", map[string]interface{}{
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:885:	srv.AddTool("memory_reinforce", "Reinforce a memory fact after successful recall (FSRS stability growth).", map[string]interface{}{
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:893:		if err := v.ReinforceFact(path); err != nil {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:901:	srv.AddTool("vault_connected", "Find all documents connected to a subject, entity, or tag. Returns facts, beliefs, entities, articles, learnings, and missions that share references.", map[string]interface{}{
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:919:		refs := v.Index.Connected(query, limit)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:924:		return index.FormatConnected(refs), nil
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go:181:	if filterOOD(query, scored, 0.15) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go:278:func (idx *Index) Connected(query string, limit int) []DocRef {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go:279:	return idx.cross.Connected(query, limit)

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts | sed -n '1,340p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc 'rg -n "executePipeline|trackAccess|enableDedup|progressiveDisclosure|cursor|includeTrace|toolCache|searchCommunities|attachSessionTransitionTrace|logFeedbackEvents|logResultCited" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
8:import * as toolCache from '../lib/cache/tool-cache.js';
13:import { searchCommunities } from '../lib/search/community-search.js';
15:import { executePipeline } from '../lib/search/pipeline/index.js';
45:  logFeedbackEvents,
49:import { trackQueryAndDetect, logResultCited } from '../lib/feedback/query-flow-tracker.js';
67:  attachSessionTransitionTrace,
176:  cursor?: string;
195:  enableDedup?: boolean;
202:  trackAccess?: boolean; // opt-in access tracking (default false)
209:  includeTrace?: boolean;
450:function applySessionDedup(results: MemorySearchRow[], sessionId: string, enableDedup: boolean): DedupResult {
451:  if (!enableDedup || !sessionId || !sessionManager.isEnabled()) {
493:    cursor,
512:    enableDedup: enableDedup = true,
519:    trackAccess: trackAccess = false, // opt-in, off by default
526:    includeTrace: includeTraceArg = false,
531:  const includeTraceByFlag = process.env.SPECKIT_RESPONSE_TRACE === 'true';
532:  const includeTrace = includeTraceByFlag || includeTraceArg === true;
543:  const hasCursor = typeof cursor === 'string' && cursor.trim().length > 0;
547:    return { content: [{ type: 'text', text: JSON.stringify({ error: 'Either "query" (string), "concepts" (array with 2-5 items), or "cursor" (string) is required.' }) }] };
551:    const resolved = resolveCursor(cursor.trim(), undefined, { scopeKey: progressiveScopeKey });
557:        details: { parameter: 'cursor' },
559:          hint: 'Retry the original search to generate a fresh continuation cursor',
614:      error: 'Either query (string), concepts (array of 2-5 strings), or cursor (string) is required',
618:        hint: 'Provide a query string, concepts array with 2-5 entries, or a continuation cursor'
747:    includeTrace,
751:  const cacheKey = toolCache.generateCacheKey('memory_search', cacheArgs);
752:  const cacheEnabled = toolCache.isEnabled() && !bypassCache;
754:    ? toolCache.get<SearchCachePayload>(cacheKey)
798:      enableDedup,
801:      trackAccess,
809:    const pipelineResult: PipelineResult = await executePipeline(pipelineConfig);
826:          const communityResults = searchCommunities(effectiveQuery, requireDb(), 5);
1005:      includeTrace,
1029:        data.progressiveDisclosure = buildProgressiveResponse(
1044:      toolCache.set(cacheKey, cachePayload, { toolName: 'memory_search' });
1072:  if (sessionId && enableDedup && sessionManager.isEnabled()) {
1104:        enableDedup
1172:  if (includeTrace && sessionTransition) {
1173:    responseToReturn = attachSessionTransitionTrace(responseToReturn, sessionTransition);
1277:          logFeedbackEvents(db, feedbackEvents);
1319:          logResultCited(db, sessionId ?? null, queryId, shownIds);

 succeeded in 0ms:
     1	// TEST: COGNITIVE GAPS
     2	import { describe, it, expect, beforeEach } from 'vitest';
     3	import Database from 'better-sqlite3';
     4	import type { FsrsParams } from '../lib/cognitive/fsrs-scheduler';
     5	import * as fsrs from '../lib/cognitive/fsrs-scheduler';
     6	import * as archival from '../lib/cognitive/archival-manager';
     7	import * as wm from '../lib/cognitive/working-memory';
     8	
     9	interface TableInfoRow {
    10	  name: string;
    11	}
    12	
    13	interface WorkingMemoryRow {
    14	  session_id: string;
    15	  memory_id: number;
    16	}
    17	
    18	/* ─────────────────────────────────────────────────────────────
    19	   DB HELPERS
    20	──────────────────────────────────────────────────────────────── */
    21	
    22	/** Create in-memory DB with memory_index schema for archival-manager */
    23	function createArchivalDb() {
    24	  const db = new Database(':memory:');
    25	  db.exec(`
    26	    CREATE TABLE memory_index (
    27	      id INTEGER PRIMARY KEY,
    28	      spec_folder TEXT NOT NULL,
    29	      file_path TEXT NOT NULL,
    30	      title TEXT,
    31	      importance_tier TEXT DEFAULT 'normal',
    32	      importance_weight REAL DEFAULT 0.5,
    33	      created_at TEXT NOT NULL,
    34	      updated_at TEXT DEFAULT (datetime('now')),
    35	      last_accessed INTEGER DEFAULT 0,
    36	      access_count INTEGER DEFAULT 0,
    37	      confidence REAL DEFAULT 0.5,
    38	      is_archived INTEGER DEFAULT 0,
    39	      archived_at TEXT,
    40	      is_pinned INTEGER DEFAULT 0,
    41	      embedding_status TEXT DEFAULT 'pending',
    42	      related_memories TEXT,
    43	      stability REAL DEFAULT 1.0,
    44	      half_life_days REAL,
    45	      last_review TEXT
    46	    )
    47	  `);
    48	  return db;
    49	}
    50	
    51	/** Create in-memory DB with working_memory + memory_index schema */
    52	function createWorkingMemoryDb() {
    53	  const db = new Database(':memory:');
    54	  db.exec(`
    55	    CREATE TABLE memory_index (
    56	      id INTEGER PRIMARY KEY,
    57	      spec_folder TEXT NOT NULL DEFAULT 'test',
    58	      file_path TEXT NOT NULL DEFAULT '/test.md',
    59	      title TEXT
    60	    )
    61	  `);
    62	  return db;
    63	}
    64	
    65	/* ═══════════════════════════════════════════════════════════════
    66	   A. FSRS SCHEDULER — calculateElapsedDays
    67	═══════════════════════════════════════════════════════════════ */
    68	
    69	describe('A. calculateElapsedDays', () => {
    70	  it('A-01: null lastReview returns 0', () => {
    71	    const result = fsrs.calculateElapsedDays(null);
    72	    expect(result).toBe(0);
    73	  });
    74	
    75	  it('A-02: recent date returns small fraction of a day', () => {
    76	    const oneHourAgo = new Date(Date.now() - 3600_000).toISOString();
    77	    const result = fsrs.calculateElapsedDays(oneHourAgo);
    78	    expect(result).toBeGreaterThanOrEqual(0);
    79	    expect(result).toBeLessThan(0.1);
    80	  });
    81	
    82	  it('A-03: 10 days ago returns ~10', () => {
    83	    const tenDaysAgo = new Date(Date.now() - 10 * 86400_000).toISOString();
    84	    const result = fsrs.calculateElapsedDays(tenDaysAgo);
    85	    expect(result).toBeGreaterThanOrEqual(9.9);
    86	    expect(result).toBeLessThanOrEqual(10.1);
    87	  });
    88	
    89	  it('A-04: 365 days ago returns ~365', () => {
    90	    const oneYearAgo = new Date(Date.now() - 365 * 86400_000).toISOString();
    91	    const result = fsrs.calculateElapsedDays(oneYearAgo);
    92	    expect(result).toBeGreaterThanOrEqual(364.9);
    93	    expect(result).toBeLessThanOrEqual(365.1);
    94	  });
    95	
    96	  it('A-05: future date returns 0 (clamped)', () => {
    97	    const tomorrow = new Date(Date.now() + 86400_000).toISOString();
    98	    const result = fsrs.calculateElapsedDays(tomorrow);
    99	    expect(result).toBe(0);
   100	  });
   101	
   102	  it('A-06: current timestamp returns ~0', () => {
   103	    const now = new Date().toISOString();
   104	    const result = fsrs.calculateElapsedDays(now);
   105	    expect(result).toBeGreaterThanOrEqual(0);
   106	    expect(result).toBeLessThan(0.01);
   107	  });
   108	});
   109	
   110	/* ═══════════════════════════════════════════════════════════════
   111	   B. FSRS SCHEDULER — getNextReviewDate
   112	═══════════════════════════════════════════════════════════════ */
   113	
   114	describe('B. getNextReviewDate', () => {
   115	  it('B-01: returns valid ISO date string', () => {
   116	    const result = fsrs.getNextReviewDate(1.0);
   117	    const parsed = new Date(result);
   118	    expect(isNaN(parsed.getTime())).toBe(false);
   119	  });
   120	
   121	  it('B-02: review date is in the future', () => {
   122	    const result = fsrs.getNextReviewDate(1.0);
   123	    const parsed = new Date(result);
   124	    expect(parsed.getTime()).toBeGreaterThan(Date.now() - 1000);
   125	  });
   126	
   127	  it('B-03: higher stability pushes review further out', () => {
   128	    const lowStab = new Date(fsrs.getNextReviewDate(1.0)).getTime();
   129	    const highStab = new Date(fsrs.getNextReviewDate(50.0)).getTime();
   130	    expect(highStab).toBeGreaterThan(lowStab);
   131	  });
   132	
   133	  it('B-04: lower retention gives longer interval', () => {
   134	    const r90 = new Date(fsrs.getNextReviewDate(10.0, 0.9)).getTime();
   135	    const r50 = new Date(fsrs.getNextReviewDate(10.0, 0.5)).getTime();
   136	    expect(r50).toBeGreaterThan(r90);
   137	  });
   138	
   139	  it('B-05: very low stability still returns future date', () => {
   140	    const result = fsrs.getNextReviewDate(0.1);
   141	    const parsed = new Date(result);
   142	    expect(parsed.getTime()).toBeGreaterThanOrEqual(Date.now() - 1000);
   143	  });
   144	});
   145	
   146	/* ═══════════════════════════════════════════════════════════════
   147	   C. FSRS SCHEDULER — createInitialParams
   148	═══════════════════════════════════════════════════════════════ */
   149	
   150	describe('C. createInitialParams', () => {
   151	  it('C-01: returns object with all required fields', () => {
   152	    const params = fsrs.createInitialParams();
   153	    expect(typeof params).toBe('object');
   154	    expect(params).not.toBeNull();
   155	    expect(params).toHaveProperty('stability');
   156	    expect(params).toHaveProperty('difficulty');
   157	    expect(params).toHaveProperty('lastReview');
   158	    expect(params).toHaveProperty('reviewCount');
   159	  });
   160	
   161	  it('C-02: stability matches DEFAULT_INITIAL_STABILITY', () => {
   162	    const params = fsrs.createInitialParams();
   163	    expect(params.stability).toBe(fsrs.DEFAULT_INITIAL_STABILITY);
   164	  });
   165	
   166	  it('C-03: difficulty matches DEFAULT_INITIAL_DIFFICULTY', () => {
   167	    const params = fsrs.createInitialParams();
   168	    expect(params.difficulty).toBe(fsrs.DEFAULT_INITIAL_DIFFICULTY);
   169	  });
   170	
   171	  it('C-04: lastReview is null', () => {
   172	    const params = fsrs.createInitialParams();
   173	    expect(params.lastReview).toBeNull();
   174	  });
   175	
   176	  it('C-05: reviewCount is 0', () => {
   177	    const params = fsrs.createInitialParams();
   178	    expect(params.reviewCount).toBe(0);
   179	  });
   180	
   181	  it('C-06: returns fresh object each call', () => {
   182	    const a = fsrs.createInitialParams();
   183	    const b = fsrs.createInitialParams();
   184	    expect(a).not.toBe(b);
   185	    a.stability = 999;
   186	    expect(b.stability).not.toBe(999);
   187	  });
   188	});
   189	
   190	/* ═══════════════════════════════════════════════════════════════
   191	   D. FSRS SCHEDULER — processReview
   192	═══════════════════════════════════════════════════════════════ */
   193	
   194	describe('D. processReview', () => {
   195	  let initial: FsrsParams;
   196	
   197	  beforeEach(() => {
   198	    initial = fsrs.createInitialParams();
   199	  });
   200	
   201	  it('D-01: returns ReviewResult with all fields', () => {
   202	    const result = fsrs.processReview(initial, 3);
   203	    expect(result).toHaveProperty('stability');
   204	    expect(result).toHaveProperty('difficulty');
   205	    expect(result).toHaveProperty('lastReview');
   206	    expect(result).toHaveProperty('reviewCount');
   207	    expect(result).toHaveProperty('nextReviewDate');
   208	    expect(result).toHaveProperty('retrievability');
   209	  });
   210	
   211	  it('D-02: reviewCount increments by 1', () => {
   212	    const result = fsrs.processReview(initial, 3);
   213	    expect(result.reviewCount).toBe(initial.reviewCount + 1);
   214	  });
   215	
   216	  it('D-03: lastReview is set to recent timestamp', () => {
   217	    const before = Date.now();
   218	    const result = fsrs.processReview(initial, 3);
   219	    const reviewTime = new Date(result.lastReview).getTime();
   220	    expect(reviewTime).toBeGreaterThanOrEqual(before - 1000);
   221	    expect(reviewTime).toBeLessThanOrEqual(Date.now() + 1000);
   222	  });
   223	
   224	  it('D-04: grade AGAIN decreases stability', () => {
   225	    const params = { ...initial, stability: 5.0, lastReview: new Date().toISOString(), reviewCount: 1 };
   226	    const result = fsrs.processReview(params, fsrs.GRADE_AGAIN);
   227	    expect(result.stability).toBeLessThan(params.stability);
   228	  });
   229	
   230	  it('D-05: grade EASY increases stability', () => {
   231	    const params = { ...initial, lastReview: new Date().toISOString(), reviewCount: 1 };
   232	    const result = fsrs.processReview(params, fsrs.GRADE_EASY);
   233	    expect(result.stability).toBeGreaterThan(initial.stability);
   234	  });
   235	
   236	  it('D-06: grade GOOD increases stability', () => {
   237	    const params = { ...initial, lastReview: new Date().toISOString(), reviewCount: 1 };
   238	    const result = fsrs.processReview(params, fsrs.GRADE_GOOD);
   239	    expect(result.stability).toBeGreaterThan(initial.stability);
   240	  });
   241	
   242	  it('D-07: grade HARD gives <= stability than GOOD', () => {
   243	    const params = { ...initial, lastReview: new Date().toISOString(), reviewCount: 1 };
   244	    const resultHard = fsrs.processReview(params, fsrs.GRADE_HARD);
   245	    const resultGood = fsrs.processReview(params, fsrs.GRADE_GOOD);
   246	    expect(resultHard.stability).toBeLessThanOrEqual(resultGood.stability);
   247	  });
   248	
   249	  it('D-08: nextReviewDate is valid future date', () => {
   250	    const result = fsrs.processReview(initial, 3);
   251	    const nextDate = new Date(result.nextReviewDate);
   252	    expect(isNaN(nextDate.getTime())).toBe(false);
   253	    expect(nextDate.getTime()).toBeGreaterThanOrEqual(Date.now() - 1000);
   254	  });
   255	
   256	  it('D-09: retrievability is in [0, 1]', () => {
   257	    const result = fsrs.processReview(initial, 3);
   258	    expect(result.retrievability).toBeGreaterThanOrEqual(0);
   259	    expect(result.retrievability).toBeLessThanOrEqual(1);
   260	  });
   261	
   262	  it('D-10: chaining reviews updates state', () => {
   263	    const params = fsrs.createInitialParams();
   264	    const result1 = fsrs.processReview(params, 3);
   265	    const result2 = fsrs.processReview(result1, 4);
   266	    expect(result2.reviewCount).toBe(2);
   267	    expect(result2.stability).toBeGreaterThan(0);
   268	  });
   269	});
   270	
   271	/* ═══════════════════════════════════════════════════════════════
   272	   E. ARCHIVAL MANAGER — ensureArchivedColumn
   273	═══════════════════════════════════════════════════════════════ */
   274	
   275	describe('E. ensureArchivedColumn', () => {
   276	  it('E-01: ensureArchivedColumn is idempotent', () => {
   277	    const db = createArchivalDb();
   278	    archival.init(db);
   279	    archival.ensureArchivedColumn();
   280	    archival.ensureArchivedColumn();
   281	    const columns = (db.prepare('PRAGMA table_info(memory_index)').all() as TableInfoRow[]).map((column) => column.name);
   282	    expect(columns).toContain('is_archived');
   283	    archival.cleanup();
   284	    db.close();
   285	  });
   286	
   287	  it('E-02: adds is_archived column when missing', () => {
   288	    const db = new Database(':memory:');
   289	    db.exec(`
   290	      CREATE TABLE memory_index (
   291	        id INTEGER PRIMARY KEY,
   292	        title TEXT
   293	      )
   294	    `);
   295	    const colsBefore = (db.prepare('PRAGMA table_info(memory_index)').all() as TableInfoRow[]).map((column) => column.name);
   296	    expect(colsBefore).not.toContain('is_archived');
   297	
   298	    archival.init(db);
   299	    const colsAfter = (db.prepare('PRAGMA table_info(memory_index)').all() as TableInfoRow[]).map((column) => column.name);
   300	    expect(colsAfter).toContain('is_archived');
   301	    archival.cleanup();
   302	    db.close();
   303	  });
   304	
   305	  it('E-03: no crash when db is null', () => {
   306	    archival.cleanup();
   307	    expect(() => archival.ensureArchivedColumn()).not.toThrow();
   308	  });
   309	});
   310	
   311	/* ═══════════════════════════════════════════════════════════════
   312	   F. ARCHIVAL MANAGER — getRecentErrors
   313	═══════════════════════════════════════════════════════════════ */
   314	
   315	describe('F. getRecentErrors', () => {
   316	  it('F-01: returns empty array when no errors', () => {
   317	    const db = createArchivalDb();
   318	    archival.init(db);
   319	    archival.resetStats();
   320	    const errors = archival.getRecentErrors();

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-hybrid-decay.vitest.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	import { afterEach, describe, expect, it } from 'vitest';
     2	
     3	import {
     4	  HYBRID_FSRS_CONTEXT_TYPES,
     5	  HYBRID_NO_DECAY_CONTEXT_TYPES,
     6	  NO_DECAY,
     7	  applyClassificationDecay,
     8	  applyHybridDecayPolicy,
     9	  getHybridDecayMultiplier,
    10	  isHybridDecayPolicyEnabled,
    11	} from '../lib/cognitive/fsrs-scheduler';
    12	
    13	describe('FSRS hybrid decay policy', () => {
    14	  afterEach(() => {
    15	    delete process.env.SPECKIT_HYBRID_DECAY_POLICY;
    16	    delete process.env.SPECKIT_CLASSIFICATION_DECAY;
    17	  });
    18	
    19	  it('assigns NO_DECAY to decision, constitutional, and critical context types', () => {
    20	    // Flag is now ON by default (graduated), explicit set kept for clarity
    21	    expect(HYBRID_NO_DECAY_CONTEXT_TYPES.has('decision')).toBe(true);
    22	    expect(HYBRID_NO_DECAY_CONTEXT_TYPES.has('constitutional')).toBe(true);
    23	    expect(HYBRID_NO_DECAY_CONTEXT_TYPES.has('critical')).toBe(true);
    24	    expect(getHybridDecayMultiplier('decision', 'normal')).toBe(NO_DECAY);
    25	    expect(getHybridDecayMultiplier('constitutional', 'normal')).toBe(NO_DECAY);
    26	    expect(getHybridDecayMultiplier('critical', 'normal')).toBe(NO_DECAY);
    27	    expect(applyHybridDecayPolicy(4, 'decision', 'normal')).toBe(NO_DECAY);
    28	  });
    29	
    30	  it('routes session, scratch, and transient documents through standard FSRS scheduling', () => {
    31	    // Flag is now ON by default (graduated), explicit set kept for clarity
    32	    expect(HYBRID_FSRS_CONTEXT_TYPES.has('session')).toBe(true);
    33	    expect(HYBRID_FSRS_CONTEXT_TYPES.has('scratch')).toBe(true);
    34	    expect(HYBRID_FSRS_CONTEXT_TYPES.has('transient')).toBe(true);
    35	    expect(getHybridDecayMultiplier('session', 'critical')).toBe(1);
    36	    expect(getHybridDecayMultiplier('scratch', 'constitutional')).toBe(1);
    37	    expect(applyHybridDecayPolicy(6, 'transient', 'critical')).toBe(6);
    38	  });
    39	
    40	  it('makes applyClassificationDecay honor the hybrid no-decay override when enabled', () => {
    41	    // Flag is now ON by default (graduated); SPECKIT_CLASSIFICATION_DECAY=false to isolate test
    42	    process.env.SPECKIT_CLASSIFICATION_DECAY = 'false';
    43	
    44	    expect(applyClassificationDecay(2.5, 'critical', 'temporary')).toBe(NO_DECAY);
    45	    expect(applyClassificationDecay(2.5, 'session', 'constitutional')).toBe(2.5);
    46	  });
    47	
    48	  it('gates hybrid behavior behind SPECKIT_HYBRID_DECAY_POLICY', () => {
    49	    // Flag is now ON by default (graduated)
    50	    expect(isHybridDecayPolicyEnabled()).toBe(true);
    51	    expect(getHybridDecayMultiplier('decision', 'normal')).toBe(NO_DECAY);
    52	    expect(applyHybridDecayPolicy(3, 'decision', 'normal')).toBe(NO_DECAY);
    53	
    54	    // Explicitly disable
    55	    process.env.SPECKIT_HYBRID_DECAY_POLICY = 'false';
    56	
    57	    expect(isHybridDecayPolicyEnabled()).toBe(false);
    58	    expect(getHybridDecayMultiplier('decision', 'normal')).toBe(1);
    59	  });
    60	});

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md | sed -n '252,420p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   252	### EX-001 | Unified context retrieval (memory_context)
   253	
   254	#### Description
   255	Intent-aware context pull.
   256	
   257	#### Current Reality
   258	Prompt: `Use memory_context in resume mode for: fix flaky index scan retry logic. Reuse a real sessionId with prompt-context history. Capture the evidence needed to prove Relevant bounded context returned; auto-resume systemPromptContext is injected before budget enforcement; final response stays within the advertised token budget. Return a concise user-facing pass/fail verdict with the main reason.`
   259	
   260	Relevant bounded context returned; auto-resume context stays within budget
   261	
   262	#### Test Execution
   263	> **Feature File:** [EX-001](01--retrieval/001-unified-context-retrieval-memory-context.md)
   264	> **Catalog:** [01--retrieval/01-unified-context-retrieval-memorycontext.md](../feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md)
   265	
   266	### EX-002 | Semantic and lexical search (memory_search)
   267	
   268	#### Description
   269	Hybrid precision check.
   270	
   271	#### Current Reality
   272	Prompt: `Search for checkpoint restore clearExisting transaction rollback. Capture the evidence needed to prove Relevant ranked results with hybrid signals. Return a concise user-facing pass/fail verdict with the main reason.`
   273	
   274	Relevant ranked results with hybrid signals
   275	
   276	Additional audit scenario: `Run memory_search against a fixture set that contains one expired memory, one live memory, and enough constitutional rows to overflow a tiny limit. Capture the evidence needed to prove multi-concept search excludes the expired row, constitutional injection never returns more than the requested limit, and malformed embeddings fail with a clear validation-style error instead of a raw sqlite-vec exception. Return a concise user-facing pass/fail verdict with the main reason.`
   277	
   278	Expired rows excluded from multi-concept search; constitutional injection respects caller limit; malformed embeddings fail with clear validation errors
   279	
   280	#### Test Execution
   281	> **Feature File:** [EX-002](01--retrieval/002-semantic-and-lexical-search-memory-search.md)
   282	> **Catalog:** [01--retrieval/02-semantic-and-lexical-search-memorysearch.md](../feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md)
   283	
   284	### EX-003 | Trigger phrase matching (memory_match_triggers)
   285	
   286	#### Description
   287	Fast recall path.
   288	
   289	#### Current Reality
   290	Prompt: `Run trigger matching for resume previous session blockers with cognitive=true and governed scope fields. Capture the evidence needed to prove In-scope trigger hits still return fast with cognitive enrichment, while mismatched tenant/user/agent/shared-space rows are filtered out before results are returned. Return a concise user-facing pass/fail verdict with the main reason.`
   291	
   292	Fast in-scope trigger hits + cognitive enrichment; out-of-scope matches filtered
   293	
   294	#### Test Execution
   295	> **Feature File:** [EX-003](01--retrieval/003-trigger-phrase-matching-memory-match-triggers.md)
   296	> **Catalog:** [01--retrieval/03-trigger-phrase-matching-memorymatchtriggers.md](../feature_catalog/01--retrieval/03-trigger-phrase-matching-memorymatchtriggers.md)
   297	
   298	### EX-004 | Hybrid search pipeline
   299	
   300	#### Description
   301	Channel fusion sanity.
   302	
   303	#### Current Reality
   304	Prompt: `Validate hybrid search fallback and score-alias sync behavior. Capture the evidence needed to prove Tier-3 structural fallback excludes archived rows unless includeArchived=true; co-activation boosts update score, rrfScore and intentAdjustedScore together; session boost preserves the original attentionScore while exposing the boosted rank as sessionBoostScore. Return a concise user-facing pass/fail verdict with the main reason.`
   305	
   306	Tier-3 structural fallback excludes archived rows unless includeArchived=true; co-activation boost keeps score aliases synchronized; session boost preserves attentionScore and writes sessionBoostScore
   307	
   308	#### Test Execution
   309	> **Feature File:** [EX-004](01--retrieval/004-hybrid-search-pipeline.md)
   310	> **Catalog:** [01--retrieval/04-hybrid-search-pipeline.md](../feature_catalog/01--retrieval/04-hybrid-search-pipeline.md)
   311	
   312	### EX-005 | 4-stage pipeline architecture
   313	
   314	#### Description
   315	Stage invariant verification.
   316	
   317	#### Current Reality
   318	Prompt: `Validate Stage 1 and Stage 3 guardrail parity in the 4-stage pipeline. Capture the evidence needed to prove deep-mode reformulation and HyDE candidates pass the same scope, tier, contextType and qualityThreshold filters before merge; constitutional injection obeys shouldApplyScopeFiltering; chunk reassembly accepts both snake_case and camelCase chunk metadata. Return a concise user-facing pass/fail verdict with the main reason.`
   319	
   320	Deep-mode reformulation and HyDE candidates pass the same scope, tier, contextType and qualityThreshold filters before merge; constitutional injection obeys shouldApplyScopeFiltering; chunk reassembly accepts both snake_case and camelCase chunk metadata
   321	
   322	#### Test Execution
   323	> **Feature File:** [EX-005](01--retrieval/005-4-stage-pipeline-architecture.md)
   324	> **Catalog:** [01--retrieval/05-4-stage-pipeline-architecture.md](../feature_catalog/01--retrieval/05-4-stage-pipeline-architecture.md)
   325	
   326	### EX-006 | Memory indexing (memory_save)
   327	
   328	#### Description
   329	New memory ingestion.
   330	
   331	#### Current Reality
   332	Prompt: `Index memory file and report action. Capture the evidence needed to prove Save action reported; searchable result appears; no template-contract or insufficiency rejection. Return a concise user-facing pass/fail verdict with the main reason.`
   333	
   334	Save action reported; searchable result appears; no template-contract or insufficiency rejection
   335	
   336	Additional audit scenario: `Prime a search cache for a query that currently returns zero hits, save a matching memory, then rerun the same query immediately. Capture the evidence needed to prove the new memory appears without waiting for cache TTL expiry. Return a concise user-facing pass/fail verdict with the main reason.`
   337	
   338	Post-insert cached search refreshes immediately; new memory visible without TTL wait
   339	
   340	#### Test Execution
   341	> **Feature File:** [EX-006](02--mutation/006-memory-indexing-memory-save.md)
   342	> **Catalog:** [02--mutation/01-memory-indexing-memorysave.md](../feature_catalog/02--mutation/01-memory-indexing-memorysave.md)
   343	
   344	### EX-007 | Memory metadata update (memory_update)
   345	
   346	#### Description
   347	Metadata + re-embed update.
   348	
   349	#### Current Reality
   350	Prompt: `Update memory title and triggers. Capture the evidence needed to prove Updated metadata reflected in retrieval. Return a concise user-facing pass/fail verdict with the main reason.`
   351	
   352	Updated metadata reflected in retrieval
   353	
   354	Additional audit scenario: `Update a memory with new title, trigger phrases and a replacement embedding while forcing one failed vec write before a successful retry. Capture the evidence needed to prove the row stays pending until the vector write completes, never reports false success on the failed attempt, and cached searches reflect the successful metadata update immediately afterward. Return a concise user-facing pass/fail verdict with the main reason.`
   355	
   356	Pending-until-written embedding status; no false-success state; post-update cached search refreshes immediately
   357	
   358	#### Test Execution
   359	> **Feature File:** [EX-007](02--mutation/007-memory-metadata-update-memory-update.md)
   360	> **Catalog:** [02--mutation/02-memory-metadata-update-memoryupdate.md](../feature_catalog/02--mutation/02-memory-metadata-update-memoryupdate.md)
   361	
   362	### EX-008 | Single and folder delete (memory_delete)
   363	
   364	#### Description
   365	Atomic single delete.
   366	
   367	#### Current Reality
   368	Prompt: `Delete memory ID and verify removal. Capture the evidence needed to prove Deleted item absent from retrieval. Return a concise user-facing pass/fail verdict with the main reason.`
   369	
   370	Deleted item absent from retrieval
   371	
   372	#### Test Execution
   373	> **Feature File:** [EX-008](02--mutation/008-single-and-folder-delete-memory-delete.md)
   374	> **Catalog:** [02--mutation/03-single-and-folder-delete-memorydelete.md](../feature_catalog/02--mutation/03-single-and-folder-delete-memorydelete.md)
   375	
   376	### EX-009 | Tier-based bulk deletion (memory_bulk_delete)
   377	
   378	#### Description
   379	Tier cleanup with safety.
   380	
   381	#### Current Reality
   382	Prompt: `Delete temporary tier in scoped folder. Capture the evidence needed to prove Deletion count + checkpoint created. Return a concise user-facing pass/fail verdict with the main reason.`
   383	
   384	Scoped deletion count + checkpoint created
   385	
   386	#### Test Execution
   387	> **Feature File:** [EX-009](02--mutation/009-tier-based-bulk-deletion-memory-bulk-delete.md)
   388	> **Catalog:** [02--mutation/04-tier-based-bulk-deletion-memorybulkdelete.md](../feature_catalog/02--mutation/04-tier-based-bulk-deletion-memorybulkdelete.md)
   389	
   390	### EX-010 | Validation feedback (memory_validate)
   391	
   392	#### Description
   393	Feedback learning loop.
   394	
   395	#### Current Reality
   396	Prompt: `Record positive validation with queryId. Capture the evidence needed to prove Confidence/promotion metadata updates. Return a concise user-facing pass/fail verdict with the main reason.`
   397	
   398	Confidence/promotion metadata updates
   399	
   400	#### Test Execution
   401	> **Feature File:** [EX-010](02--mutation/010-validation-feedback-memory-validate.md)
   402	> **Catalog:** [02--mutation/05-validation-feedback-memoryvalidate.md](../feature_catalog/02--mutation/05-validation-feedback-memoryvalidate.md)
   403	
   404	### EX-011 | Memory browser (memory_list)
   405	
   406	#### Description
   407	Folder inventory audit.
   408	
   409	#### Current Reality
   410	Prompt: `List memories in target spec folder. Capture the evidence needed to prove Paginated list and totals. Return a concise user-facing pass/fail verdict with the main reason.`
   411	
   412	Paginated list and totals
   413	
   414	#### Test Execution
   415	> **Feature File:** [EX-011](03--discovery/011-memory-browser-memory-list.md)
   416	> **Catalog:** [03--discovery/01-memory-browser-memorylist.md](../feature_catalog/03--discovery/01-memory-browser-memorylist.md)
   417	
   418	### EX-012 | System statistics (memory_stats)
   419	
   420	#### Description

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts | sed -n '238,380p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   238	   T021-T030: handle_memory_context MAIN HANDLER TESTS
   239	──────────────────────────────────────────────────────────────── */
   240	
   241	describe('T021-T030: Main Handler Tests [deferred - requires DB test fixtures]', () => {
   242	  it('T021: handle_memory_context is a function', () => {
   243	    expect(typeof handleMemoryContext).toBe('function');
   244	  });
   245	
   246	  it('T022: Returns error for empty input', async () => {
   247	    const result: MCPResponse = await handleMemoryContext({ input: '' });
   248	    const parsed = parseErrorEnvelope(result);
   249	    expect(parsed.error).toBeDefined();
   250	    expect(parsed.error as string).toContain('required');
   251	  });
   252	
   253	  it('T023: Returns error for null input', async () => {
   254	    const result: MCPResponse = await invokeMemoryContext({ input: null });
   255	    const parsed = parseErrorEnvelope(result);
   256	    expect(parsed.error).toBeDefined();
   257	  });
   258	
   259	  it('T024: Returns error for whitespace-only input', async () => {
   260	    const result: MCPResponse = await handleMemoryContext({ input: '   ' });
   261	    const parsed = parseErrorEnvelope(result);
   262	    expect(parsed.error).toBeDefined();
   263	  });
   264	
   265	  it('T025: Error response includes layer metadata', async () => {
   266	    const result: MCPResponse = await handleMemoryContext({ input: '' });
   267	    const parsed = parseErrorEnvelope(result);
   268	    expect(parsed.layer).toBe('L1:Orchestration');
   269	  });
   270	
   271	  it('T026: Error response includes hint', async () => {
   272	    const result: MCPResponse = await handleMemoryContext({ input: '' });
   273	    const parsed = parseErrorEnvelope(result);
   274	    expect(parsed.hint).toBeDefined();
   275	  });
   276	
   277	  it('T027: Input with only newlines is rejected', async () => {
   278	    const result: MCPResponse = await handleMemoryContext({ input: '\n\n\n' });
   279	    const parsed = parseErrorEnvelope(result);
   280	    expect(parsed.error).toBeDefined();
   281	  });
   282	
   283	  it('T028: Input with only tabs is rejected', async () => {
   284	    const result: MCPResponse = await handleMemoryContext({ input: '\t\t\t' });
   285	    const parsed = parseErrorEnvelope(result);
   286	    expect(parsed.error).toBeDefined();
   287	  });
   288	
   289	  it('T029: handleMemoryContext is alias for handle_memory_context', () => {
   290	    expect(handleMemoryContext).toBe(handle_memory_context);
   291	  });
   292	
   293	  it('T030: Handles undefined input gracefully', async () => {
   294	    const result: MCPResponse = await invokeMemoryContext({ input: undefined });
   295	    const parsed = parseErrorEnvelope(result);
   296	    expect(parsed.error).toBeDefined();
   297	  });
   298	});
   299	
   300	describe('T015: Session transition contract coverage', () => {
   301	  it('builds a cold-start trace payload with nullable previousState and no sentinel strings', () => {
   302	    const transition = buildSessionTransitionTrace({
   303	      previousState: null,
   304	      resumedSession: false,
   305	      effectiveMode: 'focused',
   306	      requestedMode: 'auto',
   307	      detectedIntent: 'fix_bug',
   308	      pressureOverrideApplied: false,
   309	      queryHeuristicApplied: false,
   310	    });
   311	
   312	    expect(transition).toEqual({
   313	      previousState: null,
   314	      currentState: 'focused',
   315	      confidence: 0.85,
   316	      signalSources: ['intent-classifier'],
   317	      reason: 'intent classifier selected focused mode',
   318	    });
   319	    expect(JSON.stringify(transition)).not.toContain('none');
   320	    expect(JSON.stringify(transition)).not.toContain('session-active');
   321	  });
   322	
   323	  it('prioritizes resumed-session and explicit-mode reasons deterministically', () => {
   324	    const resumed = buildSessionTransitionTrace({
   325	      previousState: 'focused',
   326	      resumedSession: true,
   327	      effectiveMode: 'resume',
   328	      requestedMode: 'auto',
   329	      detectedIntent: 'find_decision',
   330	      pressureOverrideApplied: false,
   331	      queryHeuristicApplied: true,
   332	    });
   333	    expect(resumed.signalSources).toEqual([
   334	      'session-resume',
   335	      'query-heuristic',
   336	      'intent-classifier',
   337	    ]);
   338	    expect(resumed.confidence).toBe(0.95);
   339	    expect(resumed.reason).toBe('resumed session inferred resume mode');
   340	
   341	    const explicit = buildSessionTransitionTrace({
   342	      previousState: 'quick',
   343	      resumedSession: false,
   344	      effectiveMode: 'deep',
   345	      requestedMode: 'deep',
   346	      detectedIntent: 'add_feature',
   347	      pressureOverrideApplied: false,
   348	      queryHeuristicApplied: false,
   349	    });
   350	    expect(explicit.signalSources).toEqual([
   351	      'explicit-mode',
   352	      'intent-classifier',
   353	    ]);
   354	    expect(explicit.confidence).toBe(1);
   355	    expect(explicit.reason).toBe('explicit mode request selected deep mode');
   356	  });
   357	
   358	  it('supports quick-mode trace injection without leaking non-trace metadata', () => {
   359	    const response = {
   360	      content: [{
   361	        type: 'text',
   362	        text: JSON.stringify({
   363	          data: {
   364	            results: [{ id: 1, title: 'Test result' }],
   365	          },
   366	          meta: {
   367	            sessionLifecycle: {},
   368	          },
   369	        }),
   370	      }],
   371	    };
   372	
   373	    const transition = buildSessionTransitionTrace({
   374	      previousState: null,
   375	      resumedSession: false,
   376	      effectiveMode: 'quick',
   377	      requestedMode: 'quick',
   378	      detectedIntent: null,
   379	      pressureOverrideApplied: false,
   380	      queryHeuristicApplied: false,

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
     2	
     3	const PIPELINE_RESULTS = Array.from({ length: 7 }, (_, index) => ({
     4	  id: index + 1,
     5	  score: 1 - index * 0.05,
     6	  title: `Result ${index + 1}`,
     7	  content: `Detailed result content ${index + 1} for fusion scoring decisions and retrieval context.`,
     8	  file_path: `/tmp/result-${index + 1}.md`,
     9	}));
    10	
    11	vi.mock('../core', () => ({
    12	  checkDatabaseUpdated: vi.fn(async () => false),
    13	  isEmbeddingModelReady: vi.fn(() => true),
    14	  waitForEmbeddingModel: vi.fn(async () => true),
    15	}));
    16	
    17	vi.mock('../lib/cache/tool-cache', () => ({
    18	  generateCacheKey: vi.fn(() => 'memory-search-ux-hooks'),
    19	  isEnabled: vi.fn(() => false),
    20	  get: vi.fn(() => null),
    21	  set: vi.fn(() => undefined),
    22	  withCache: vi.fn(async (_tool: string, _args: unknown, fn: () => Promise<unknown>) => fn()),
    23	}));
    24	
    25	vi.mock('../lib/search/pipeline', () => ({
    26	  executePipeline: vi.fn(async () => ({
    27	    results: PIPELINE_RESULTS,
    28	    metadata: {
    29	      stage1: { searchType: 'hybrid', channelCount: 2, candidateCount: 7, constitutionalInjected: 0, durationMs: 1 },
    30	      stage2: {
    31	        sessionBoostApplied: 'off',
    32	        causalBoostApplied: 'off',
    33	        intentWeightsApplied: 'off',
    34	        artifactRoutingApplied: 'off',
    35	        feedbackSignalsApplied: 'off',
    36	        qualityFiltered: 0,
    37	        durationMs: 1,
    38	      },
    39	      stage3: {
    40	        rerankApplied: false,
    41	        chunkReassemblyStats: { collapsedChunkHits: 0, chunkParents: 0, reassembled: 0, fallback: 0 },
    42	        durationMs: 1,
    43	      },
    44	      stage4: { stateFiltered: 0, constitutionalInjected: 0, evidenceGapDetected: false, durationMs: 1 },
    45	    },
    46	    annotations: { stateStats: {}, featureFlags: {} },
    47	    trace: undefined,
    48	  })),
    49	}));
    50	
    51	vi.mock('../formatters', () => ({
    52	  formatSearchResults: vi.fn(async (results: Array<Record<string, unknown>>) => ({
    53	    content: [{
    54	      type: 'text',
    55	      text: JSON.stringify({
    56	        summary: `Found ${results.length} memories`,
    57	        data: {
    58	          count: results.length,
    59	          results: results.map((row) => ({ ...row })),
    60	        },
    61	      }),
    62	    }],
    63	    isError: false,
    64	  })),
    65	}));
    66	
    67	vi.mock('../utils', () => ({
    68	  validateQuery: vi.fn((query: unknown) => String(query ?? '').trim()),
    69	  requireDb: vi.fn(() => {
    70	    throw new Error('db unavailable in unit test');
    71	  }),
    72	  toErrorMessage: vi.fn((err: unknown) => (err instanceof Error ? err.message : String(err))),
    73	}));
    74	
    75	vi.mock('../lib/search/artifact-routing', () => ({
    76	  getStrategyForQuery: vi.fn(() => null),
    77	  applyRoutingWeights: vi.fn((results: unknown[]) => results),
    78	}));
    79	
    80	vi.mock('../lib/search/intent-classifier', () => ({
    81	  isValidIntent: vi.fn(() => true),
    82	  getIntentWeights: vi.fn(() => ({ similarity: 0.6, importance: 0.25, recency: 0.15 })),
    83	  classifyIntent: vi.fn(() => ({ intent: 'understand', confidence: 0.9, fallback: false })),
    84	  getIntentDescription: vi.fn(() => 'intent description'),
    85	}));
    86	
    87	vi.mock('../lib/search/session-boost', () => ({
    88	  isEnabled: vi.fn(() => false),
    89	}));
    90	
    91	vi.mock('../lib/search/causal-boost', () => ({
    92	  isEnabled: vi.fn(() => false),
    93	}));
    94	
    95	vi.mock('../lib/session/session-manager', () => ({
    96	  isEnabled: vi.fn(() => false),
    97	  filterSearchResults: vi.fn((_sessionId: string, results: unknown[]) => ({
    98	    filtered: results,
    99	    dedupStats: { enabled: false, filtered: 0, total: Array.isArray(results) ? results.length : 0 },
   100	  })),
   101	  markResultsSent: vi.fn(() => undefined),
   102	}));
   103	
   104	vi.mock('../lib/eval/eval-logger', () => ({
   105	  logSearchQuery: vi.fn(() => ({ queryId: 11, evalRunId: 22 })),
   106	  logChannelResult: vi.fn(() => undefined),
   107	  logFinalResult: vi.fn(() => undefined),
   108	}));
   109	
   110	vi.mock('../lib/feedback/feedback-ledger', () => ({
   111	  logFeedbackEvents: vi.fn(() => undefined),
   112	  isImplicitFeedbackLogEnabled: vi.fn(() => false),
   113	}));
   114	
   115	import { handleMemorySearch } from '../handlers/memory-search';
   116	import { clearCursorStore } from '../lib/search/progressive-disclosure';
   117	import { manager as retrievalSessionStateManager } from '../lib/search/session-state';
   118	
   119	function parseEnvelope(response: Awaited<ReturnType<typeof handleMemorySearch>>): Record<string, unknown> {
   120	  return JSON.parse(response.content[0].text) as Record<string, unknown>;
   121	}
   122	
   123	describe('memory_search UX hook integration', () => {
   124	  beforeEach(() => {
   125	    retrievalSessionStateManager.clearAll();
   126	    clearCursorStore();
   127	    delete process.env.SPECKIT_PROGRESSIVE_DISCLOSURE_V1;
   128	    delete process.env.SPECKIT_SESSION_RETRIEVAL_STATE_V1;
   129	  });
   130	
   131	  afterEach(() => {
   132	    clearCursorStore();
   133	    retrievalSessionStateManager.clearAll();
   134	  });
   135	
   136	  it('adds progressive disclosure payloads and session state to search responses', async () => {
   137	    const response = await handleMemorySearch({
   138	      query: 'Find fusion scoring decisions',
   139	      sessionId: 'sess-ux-1',
   140	      anchors: ['state', 'next-steps'],
   141	    });
   142	
   143	    const envelope = parseEnvelope(response);
   144	    const data = envelope.data as Record<string, unknown>;
   145	    const results = data.results as Array<Record<string, unknown>>;
   146	    const progressive = data.progressiveDisclosure as Record<string, unknown>;
   147	    const progressiveResults = progressive.results as Array<Record<string, unknown>>;
   148	    const summaryLayer = progressive.summaryLayer as Record<string, unknown>;
   149	    const continuation = progressive.continuation as Record<string, unknown>;
   150	    const sessionState = data.sessionState as Record<string, unknown>;
   151	    const goalRefinement = data.goalRefinement as Record<string, unknown>;
   152	
   153	    expect(results).toHaveLength(7);
   154	    expect(summaryLayer.count).toBe(7);
   155	    expect(progressiveResults).toHaveLength(5);
   156	    expect(progressiveResults[0]?.resultId).toBe('1');
   157	    expect(continuation.remainingCount).toBe(2);
   158	    expect(typeof continuation.cursor).toBe('string');
   159	    expect(sessionState.activeGoal).toBe('Find fusion scoring decisions');
   160	    expect(sessionState.preferredAnchors).toEqual(['state', 'next-steps']);
   161	    expect(goalRefinement.activeGoal).toBe('Find fusion scoring decisions');
   162	  });
   163	
   164	  it('resolves continuation cursors without requiring a new query', async () => {
   165	    const initial = await handleMemorySearch({ query: 'Find fusion scoring decisions' });
   166	    const initialEnvelope = parseEnvelope(initial);
   167	    const progressive = (initialEnvelope.data as Record<string, unknown>).progressiveDisclosure as Record<string, unknown>;
   168	    const continuation = progressive.continuation as Record<string, unknown>;
   169	
   170	    const nextPage = await handleMemorySearch({ cursor: String(continuation.cursor) });
   171	    const nextEnvelope = parseEnvelope(nextPage);
   172	    const nextData = nextEnvelope.data as Record<string, unknown>;
   173	    const results = nextData.results as Array<Record<string, unknown>>;
   174	
   175	    expect(results).toHaveLength(2);
   176	    expect(results[0]?.resultId).toBe('6');
   177	    expect(nextData.continuation).toBeNull();
   178	  });
   179	
   180	  it('rejects continuation cursors when the resuming scope does not match the original query scope', async () => {
   181	    const initial = await handleMemorySearch({
   182	      query: 'Find fusion scoring decisions',
   183	      tenantId: 'tenant-a',
   184	      userId: 'user-a',
   185	    });
   186	    const initialEnvelope = parseEnvelope(initial);
   187	    const progressive = (initialEnvelope.data as Record<string, unknown>).progressiveDisclosure as Record<string, unknown>;
   188	    const continuation = progressive.continuation as Record<string, unknown>;
   189	
   190	    const resumed = await handleMemorySearch({
   191	      cursor: String(continuation.cursor),
   192	      tenantId: 'tenant-a',
   193	      userId: 'user-b',
   194	    });
   195	    const resumedEnvelope = parseEnvelope(resumed);
   196	    const resumedData = resumedEnvelope.data as Record<string, unknown>;
   197	
   198	    expect(resumedEnvelope.summary).toBe('Error: Cursor is invalid, expired, or out of scope');
   199	    expect(resumedData.error).toBe('Cursor is invalid, expired, or out of scope');
   200	  });
   201	});

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts | sed -n '240,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts | sed -n '360,430p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   240	   4. memory_search LIMIT CONTRACT (schema + runtime alignment)
   241	──────────────────────────────────────────────────────────────── */
   242	
   243	describe('memory_search limit contract', () => {
   244	  it('public schema accepts cursor-only continuation', () => {
   245	    expect(() => {
   246	      validateToolInputSchema('memory_search', { cursor: 'opaque-cursor-token' }, TOOL_DEFINITIONS);
   247	    }).not.toThrow();
   248	  });
   249	
   250	  it('runtime schema accepts cursor-only continuation', () => {
   251	    expect(() => {
   252	      validateToolArgs('memory_search', { cursor: 'opaque-cursor-token' });
   253	    }).not.toThrow();
   254	  });
   255	
   256	  it('public schema accepts concepts-only search', () => {
   257	    expect(() => {
   258	      validateToolInputSchema('memory_search', { concepts: ['alpha', 'beta'] }, TOOL_DEFINITIONS);
   259	    }).not.toThrow();
   260	  });
   261	
   262	  it('public schema rejects requests without query or concepts', () => {
   263	    expect(() => {
   264	      validateToolInputSchema('memory_search', {}, TOOL_DEFINITIONS);
   265	    }).toThrow(/required schema constraints/);
   266	  });
   267	
   268	  it('accepts limit up to 100', () => {
   269	    expect(() => {
   270	      validateToolArgs('memory_search', { query: 'ab', limit: 100 });
   271	    }).not.toThrow();
   272	  });
   273	
   274	  it('rejects limit above 100', () => {
   275	    expect(() => {
   276	      validateToolArgs('memory_search', { query: 'ab', limit: 101 });
   277	    }).toThrow();
   278	  });
   279	
   280	  it('public schema rejects limit above 100', () => {
   281	    expect(() => {
   282	      validateToolInputSchema('memory_search', { query: 'ab', limit: 101 }, TOOL_DEFINITIONS);
   283	    }).toThrow(/must be <= 100/);
   284	  });
   285	
   286	  it('runtime rejects concepts arrays shorter than 2 items', () => {
   287	    expect(() => {
   288	      validateToolArgs('memory_search', { concepts: ['solo'] });
   289	    }).toThrow();
   290	  });
   291	
   292	  it('public schema rejects unknown memory_search parameters', () => {
   293	    expect(() => {
   294	      validateToolInputSchema('memory_search', { query: 'valid query', unexpected: true }, TOOL_DEFINITIONS);
   295	    }).toThrow(/Unknown argument/);
   296	  });
   297	
   298	  it('public schema enforces query minimum length', () => {
   299	    expect(() => {
   300	      validateToolInputSchema('memory_search', { query: 'a' }, TOOL_DEFINITIONS);
   301	    }).toThrow(/length must be >= 2/);
   302	  });
   303	
   304	  it('runtime rejects unknown memory_search parameters', () => {
   305	    expect(() => {
   306	      validateToolArgs('memory_search', { query: 'valid query', unexpected: true } as Record<string, unknown>);
   307	    }).toThrow(/Unknown parameter/);
   308	  });
   309	
   310	  it('runtime accepts governed scope fields for memory_search', () => {
   311	    expect(() => {
   312	      validateToolArgs('memory_search', {
   313	        query: 'valid query',
   314	        tenantId: 'tenant-a',
   315	        userId: 'user-1',
   316	        agentId: 'agent-1',
   317	        sharedSpaceId: 'shared-1',
   318	      });
   319	    }).not.toThrow();
   320	  });

 succeeded in 0ms:
   360	      totalDelta: 0,
   361	      injected: false,
   362	      raw: undefined,
   363	      normalized: 0.25,
   364	      appliedBonus: undefined,
   365	      capApplied: false,
   366	      rolloutState: null,
   367	    });
   368	  });
   369	
   370	  it('C11: extraData merged into response data', async () => {
   371	    const mockResults = [{ id: 40, spec_folder: 's', file_path: '/f.md', title: 'T' }];
   372	    const res = await formatSearchResults(mockResults, 'semantic', false, null, null, null, { myExtra: 'data' }, true);
   373	    const envelope = parseEnvelope(res);
   374	    expect(envelope.data.myExtra).toBe('data');
   375	  });
   376	
   377	  it('C12: searchType propagated to response data', async () => {
   378	    const mockResults = [{ id: 41, spec_folder: 's', file_path: '/f.md', title: 'T' }];
   379	    const res = await formatSearchResults(mockResults, 'multi-concept');
   380	    const envelope = parseEnvelope(res);
   381	    expect(envelope.data.searchType).toBe('multi-concept');
   382	  });
   383	
   384	  it('C13: Response meta.tool is memory_search', async () => {
   385	    const mockResults = [{ id: 42, spec_folder: 's', file_path: '/f.md', title: 'T' }];
   386	    const res = await formatSearchResults(mockResults, 'semantic');
   387	    const envelope = parseEnvelope(res);
   388	    expect(envelope.meta.tool).toBe('memory_search');
   389	  });
   390	
   391	  it('C14: Invalid file path records contentError', async () => {
   392	    const mockResults = [{
   393	      id: 50,
   394	      spec_folder: 's',
   395	      file_path: '/nonexistent/path/that/does/not/exist.md',
   396	      title: 'Bad Path',
   397	    }];
   398	    const res = await formatSearchResults(mockResults, 'semantic', true);
   399	    const envelope = parseEnvelope(res);
   400	    const result = envelope.data.results[0];
   401	    expect(result.content).toBe(null);
   402	    expect(typeof result.contentError).toBe('string');
   403	    expect(result.contentError?.length ?? 0).toBeGreaterThan(0);
   404	  });
   405	
   406	  it('C15: precomputed chunk content bypasses file read', async () => {
   407	    const mockResults = [{
   408	      id: 51,
   409	      spec_folder: 'specs/010-test',
   410	      file_path: '/nonexistent/path.md',
   411	      title: 'Chunk Parent',
   412	      isChunk: true,
   413	      parentId: 999,
   414	      chunkIndex: 0,
   415	      chunkLabel: 'intro',
   416	      chunkCount: 3,
   417	      contentSource: 'reassembled_chunks',
   418	      precomputedContent: 'Reassembled content from chunks.',
   419	    }];
   420	    const res = await formatSearchResults(mockResults, 'semantic', true);
   421	    const envelope = parseEnvelope(res);
   422	    const result = envelope.data.results[0];
   423	    expect(result.content).toBe('Reassembled content from chunks.');
   424	    expect(result.contentError).toBeUndefined();
   425	    expect(result.isChunk).toBe(true);
   426	    expect(result.parentId).toBe(999);
   427	    expect(result.chunkCount).toBe(3);
   428	    expect(result.contentSource).toBe('reassembled_chunks');
   429	  });
   430	

codex
I have enough of the current-state picture to see the test layering that already exists: strong unit/schema coverage, some mocked handler integration, and a manual playbook for end-to-end validation. I’m filling one last gap now by checking the validation-feedback and routing/canonical-pipeline surfaces, since those are the most likely places an adopted `memory_review`-style control plane would need regression coverage.
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go | sed -n '1,120p;260,340p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	package mcp
     2	
     3	import (
     4		"fmt"
     5		"log"
     6		"os"
     7		"path/filepath"
     8		"strings"
     9	
    10		"github.com/GetModus/modus-memory/internal/index"
    11		"github.com/GetModus/modus-memory/internal/librarian"
    12		"github.com/GetModus/modus-memory/internal/vault"
    13	)
    14	
    15	// RegisterVaultTools adds all vault MCP tools — replaces RegisterArchiveTools,
    16	// RegisterAtlasTools, and RegisterQMTools with a unified set.
    17	// Old tool names are registered as aliases for backward compatibility.
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

exec
/bin/zsh -lc "rg -n \"memory_validate|validate\\(|queryId|promotion|confidence|wasUseful|reviewCount|last_review|trackAccess\" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests -g '*.vitest.ts'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:120:    const warning = '> **⚠️ EVIDENCE GAP DETECTED:** Retrieved context has low mathematical confidence. Consider first principles.';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:126:    const warning = '> **⚠️ EVIDENCE GAP DETECTED:** Retrieved context has low mathematical confidence. Consider first principles.';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/job-queue-state-edge.vitest.ts:130:  it('T005b-Q3d: getIngestForecast returns low-confidence caveat before progress starts', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/job-queue-state-edge.vitest.ts:146:      caveat: 'Forecast is low-confidence until at least one file has been processed.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:37:    confidence: 0.95,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:41:    last_review: '2025-02-01T12:00:00Z',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:77:    confidence: 0.95,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:82:    reviewCount: 5,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:165:    row.last_review = null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:213:    expect(memory.confidence).toBe(0.95);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:217:    expect(memory.reviewCount).toBe(5);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:85:      trackAccess: false,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:348:    input.config.trackAccess = true;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:98:    it('retrieves all selections when no queryId filter', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:107:    it('filters selections by queryId', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:114:      expect(history.every(s => s.queryId === 'q1')).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:149:      expect(sel.queryId).toBe('q1');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:168:    it('returns operational labels with bounded relevance and confidence', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:170:        { queryId: 'q1', memoryId: 42, queryText: 'test query', memoryContent: 'test content' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:171:        { queryId: 'q2', memoryId: 43, queryText: 'another query', memoryContent: 'another content' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:177:      expect(labels[0].queryId).toBe('q1');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:181:      expect(labels[0].confidence).toBeGreaterThanOrEqual(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:182:      expect(labels[0].confidence).toBeLessThanOrEqual(1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:195:        { queryId: 'q1', memoryId: 42, relevance: 3, confidence: 0.95, reasoning: 'Highly relevant' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:196:        { queryId: 'q2', memoryId: 43, relevance: 1, confidence: 0.6 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:205:        { queryId: 'q1', memoryId: 42, relevance: 1, confidence: 0.5 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:208:        { queryId: 'q1', memoryId: 42, relevance: 3, confidence: 0.9 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:222:        { queryId: 'q1', memoryId: 42, relevance: 3, confidence: 0.9 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:223:        { queryId: 'q2', memoryId: 43, relevance: 2, confidence: 0.85 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:224:        { queryId: 'q3', memoryId: 44, relevance: 1, confidence: 0.7 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:227:        { queryId: 'q1', memoryId: 42, relevance: 3 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:228:        { queryId: 'q2', memoryId: 43, relevance: 2 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:229:        { queryId: 'q3', memoryId: 44, relevance: 1 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:243:        { queryId: 'q1', memoryId: 42, relevance: 0, confidence: 0.9 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:244:        { queryId: 'q2', memoryId: 43, relevance: 0, confidence: 0.9 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:247:        { queryId: 'q1', memoryId: 42, relevance: 3 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:248:        { queryId: 'q2', memoryId: 43, relevance: 3 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:262:        { queryId: 'q1', memoryId: 1, relevance: 3, confidence: 0.9 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:263:        { queryId: 'q2', memoryId: 2, relevance: 2, confidence: 0.9 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:264:        { queryId: 'q3', memoryId: 3, relevance: 1, confidence: 0.9 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:265:        { queryId: 'q4', memoryId: 4, relevance: 0, confidence: 0.9 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:266:        { queryId: 'q5', memoryId: 5, relevance: 2, confidence: 0.9 }, // disagrees
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:269:        { queryId: 'q1', memoryId: 1, relevance: 3 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:270:        { queryId: 'q2', memoryId: 2, relevance: 2 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:271:        { queryId: 'q3', memoryId: 3, relevance: 1 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:272:        { queryId: 'q4', memoryId: 4, relevance: 0 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:273:        { queryId: 'q5', memoryId: 5, relevance: 0 }, // disagrees
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:285:        { queryId: 'q1', memoryId: 1, relevance: 3, confidence: 0.9 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:286:        { queryId: 'q2', memoryId: 2, relevance: 2, confidence: 0.9 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:287:        { queryId: 'q3', memoryId: 3, relevance: 1, confidence: 0.9 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:288:        { queryId: 'q4', memoryId: 4, relevance: 3, confidence: 0.9 }, // disagrees
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:289:        { queryId: 'q5', memoryId: 5, relevance: 3, confidence: 0.9 }, // disagrees
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:292:        { queryId: 'q1', memoryId: 1, relevance: 3 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:293:        { queryId: 'q2', memoryId: 2, relevance: 2 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:294:        { queryId: 'q3', memoryId: 3, relevance: 1 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:295:        { queryId: 'q4', memoryId: 4, relevance: 0 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:296:        { queryId: 'q5', memoryId: 5, relevance: 0 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:307:        { queryId: 'q1', memoryId: 1, relevance: 3, confidence: 0.9 }, // exact match
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:308:        { queryId: 'q2', memoryId: 2, relevance: 2, confidence: 0.9 }, // +1 from manual
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:309:        { queryId: 'q3', memoryId: 3, relevance: 0, confidence: 0.9 }, // -2 from manual
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:312:        { queryId: 'q1', memoryId: 1, relevance: 3 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:313:        { queryId: 'q2', memoryId: 2, relevance: 1 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:314:        { queryId: 'q3', memoryId: 3, relevance: 2 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:326:        { queryId: 'q1', memoryId: 1, relevance: 3, confidence: 0.9 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:327:        { queryId: 'q99', memoryId: 99, relevance: 0, confidence: 0.9 }, // no manual match
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:330:        { queryId: 'q1', memoryId: 1, relevance: 3 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:331:        { queryId: 'q50', memoryId: 50, relevance: 2 }, // no LLM match
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:343:        { queryId: 'q1', memoryId: 1, relevance: 3, confidence: 0.9 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:346:        { queryId: 'q2', memoryId: 2, relevance: 2 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:358:        { queryId: 'q1', memoryId: 1, relevance: 3, confidence: 0.9 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:359:        { queryId: 'q2', memoryId: 2, relevance: 0, confidence: 0.9 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:362:        { queryId: 'q1', memoryId: 1, relevance: 3 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:363:        { queryId: 'q2', memoryId: 2, relevance: 2 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:401:        { queryId: 'q1', memoryId: 42, relevance: 3, confidence: 0.9 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:402:        { queryId: 'q2', memoryId: 43, relevance: 2, confidence: 0.8 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:418:        { queryId: 'q3', memoryId: 44, relevance: 2, confidence: 0.8 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/confidence-truncation.vitest.ts:19:} from '../lib/search/confidence-truncation';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:54:        confidence REAL DEFAULT 0.5,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:57:        last_review TEXT,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:25:    queryId: 1,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:28:      { queryId: 1, memoryId: 101, relevance: 3 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:29:      { queryId: 1, memoryId: 102, relevance: 2 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:30:      { queryId: 1, memoryId: 103, relevance: 1 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:34:    queryId: 2,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:37:      { queryId: 2, memoryId: 201, relevance: 3 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:38:      { queryId: 2, memoryId: 202, relevance: 2 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:42:    queryId: 3,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:45:      { queryId: 3, memoryId: 301, relevance: 3 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:46:      { queryId: 3, memoryId: 302, relevance: 1 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:50:    queryId: 4,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:53:      { queryId: 4, memoryId: 401, relevance: 3 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:54:      { queryId: 4, memoryId: 402, relevance: 2 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:55:      { queryId: 4, memoryId: 403, relevance: 1 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:59:    queryId: 5,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:62:      { queryId: 5, memoryId: 501, relevance: 3 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:63:      { queryId: 5, memoryId: 502, relevance: 2 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:107:  queryId: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:113:    queryId: 1,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:125:    queryId: 2,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:137:    queryId: 3,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:149:    queryId: 4,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:161:    queryId: 5,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:176:    queryId: 1,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:188:    queryId: 2,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:200:    queryId: 3,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:212:    queryId: 4,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:224:    queryId: 5,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:287:    const corpusEntry = EVAL_CORPUS.find(entry => entry.queryId === fixture.queryId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:291:    expect(payload.documents).toEqual(QUERY_DOCUMENTS[fixture.queryId].map(doc => doc.content));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:327:      QUERY_DOCUMENTS[corpusEntry.queryId],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:855:    const lowRecallVectorSearch = () => [{ id: 1, similarity: 0.01, content: 'vector low confidence' }];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:1281:  it('T024: co-activation promotion happens before confidence truncation drops tail candidates', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:1291:    const promotionDb = createCoactivationPromotionDb();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:1299:    hybridSearch.init(promotionDb, vectorSearch, null);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:1300:    coActivation.init(promotionDb);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:1358:      queryId: 'p1-token-skip',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:1389:      queryId: 'p1-token-fallback',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:1415:      queryId: 't311-cache',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:85:        last_review TEXT DEFAULT (datetime('now')),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:452:          confidence: 0.85,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:55:      confidence REAL DEFAULT 0.5,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:59:      last_review TEXT,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-directives.vitest.ts:95:    const content = 'Must stop if confidence is below 80%.';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-directives.vitest.ts:98:    expect(directive!.surfaceCondition).toContain('confidence is below 80%');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:123:      last_review TEXT DEFAULT (datetime('now')),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking-e2e.vitest.ts:265:        min_signals_for_promotion
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking-e2e.vitest.ts:273:      min_signals_for_promotion: 2,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking-e2e.vitest.ts:277:  it('replays shadow evaluation with real proposal deltas and feedback-driven promotion tuning', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking-e2e.vitest.ts:328:    expect(report?.promotionGate.ready).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking-e2e.vitest.ts:329:    expect(report?.promotionGate.recommendation).toBe('promote');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:149:        last_review: new Date().toISOString(),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:156:    it('No last_review => returns baseScore', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:423:    // Deprecated tier also frozen — use applyFsrsDecay with no last_review to get baseScore back
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:424:    it('No last_review = frozen state (returns baseScore)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:105:    expect(typeof result.confidence).toBe('number');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:114:    expect(result.confidence).toBe(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:121:    expect(result.confidence).toBe(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:420:    expect(result.confidence).toBeGreaterThan(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:646:  it('C138-T2: classifyIntent returns confidence between 0 and 1', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:648:    expect(result.confidence).toBeGreaterThanOrEqual(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:649:    expect(result.confidence).toBeLessThanOrEqual(1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:130:    it('T416: Falls back to updated_at when last_review missing', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:154:    vi.spyOn(evalLogger, 'logSearchQuery').mockReturnValue({ queryId: 11, evalRunId: 22 });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:164:      queryId: 11,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:235:    vi.spyOn(evalLogger, 'logSearchQuery').mockReturnValue({ queryId: 31, evalRunId: 32 });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:289:    vi.spyOn(evalLogger, 'logSearchQuery').mockReturnValue({ queryId: 41, evalRunId: 42 });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:120:        last_review TEXT,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-seed-resolver.vitest.ts:58:    expect(ref.confidence).toBeCloseTo(0.89, 5);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-seed-resolver.vitest.ts:69:    expect(ref.confidence).toBeLessThan(0.5);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:8:import * as confidenceTracker from '../lib/scoring/confidence-tracker';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:13:} from '../lib/search/auto-promotion';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:23:    confidence = 0.95,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:25:  }: { tier?: string; confidence?: number; validationCount?: number } = {},
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:28:    INSERT INTO memory_index (id, title, confidence, validation_count, importance_tier, updated_at)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:30:  `).run(id, `memory-${id}`, confidence, validationCount, tier, new Date().toISOString());
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:33:describe('T055: positive-validation semantics for promotion thresholds', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:35:    dbPath = path.join(os.tmpdir(), `promotion-positive-semantics-${Date.now()}-${Math.random()}.sqlite`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:41:        confidence REAL DEFAULT 0.5,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:58:  it('confidence-tracker eligibility subtracts negative validations from threshold counts', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:59:    insertMemory(1, { confidence: 0.95, validationCount: 5, tier: 'normal' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:60:    expect(confidenceTracker.checkPromotionEligible(db, 1)).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:65:    expect(confidenceTracker.checkPromotionEligible(db, 1)).toBe(false);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:67:    const info = confidenceTracker.getConfidenceInfo(db, 1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:70:    expect(info.promotionProgress.validationsMet).toBe(false);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:74:    insertMemory(2, { confidence: 0.9, validationCount: 4, tier: 'normal' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:76:    const negativeResult = confidenceTracker.recordValidation(db, 2, false);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:80:    expect(negativeResult.promotionEligible).toBe(false);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:85:    const positiveResult = confidenceTracker.recordValidation(db, 2, true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:88:    expect(positiveResult.promotionEligible).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:91:  it('auto-promotion checks use positive-validation counts (total minus negatives)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:70:        'handle_memory_validate',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:559:          invalidArgs<Parameters<typeof handler.handleMemoryValidate>[0]>({ wasUseful: true }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:564:    it('T521-V2: Missing wasUseful throws', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:569:      ).rejects.toThrow(/wasUseful.*required/);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:572:    it('T521-V3: Non-boolean wasUseful throws', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:577:            wasUseful: 'yes',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:580:      ).rejects.toThrow(/wasUseful.*boolean/);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:584:      await expect(handler.handleMemoryValidate({ id: '7abc', wasUseful: true })).rejects.toThrow(/id.*integer|id.*number/i);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:608:          wasUseful: true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:609:          queryId: `consumption:${queryLogId}`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:624:          queryId: `consumption:${queryLogId}`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:89:      avgConfidence: undefined, // no confidence data
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:143:  it('emits status "low_confidence" when avgConfidence < threshold', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:148:    expect(payload.status).toBe('low_confidence');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:250:  it('recommends "ask_user" for low_confidence + knowledge_gap', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:257:    expect(payload.status).toBe('low_confidence');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:324:    const validStatuses = ['no_results', 'low_confidence', 'partial'] as const;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:876:        confidence: 0.8,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:880:        last_review: null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:919:        confidence: 0.8,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:923:        last_review: null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/empty-result-recovery.vitest.ts:9:const VALID_RECOVERY_STATUSES = ['no_results', 'low_confidence', 'partial'] as const;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/empty-result-recovery.vitest.ts:134:  it('classifies weak result sets as low_confidence', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/empty-result-recovery.vitest.ts:163:    expect(envelope.data.recovery?.status).toBe('low_confidence');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:15:  { tool: 'memory_validate', handler: 'handleMemoryValidate', layer: 'L4' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:41:  { camel: 'handleMemoryValidate', snake: 'handle_memory_validate' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts:20:    last_review: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts:76:        last_review: daysAgo(elapsed[tier]),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth.vitest.ts:277:      expect(hardNegIds.has(r.queryId)).toBe(false);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth.vitest.ts:379:      expect(validIds.has(r.queryId)).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth.vitest.ts:684:      expect(hardNegIds.has(r.queryId)).toBe(false);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-metrics.vitest.ts:34:  return { queryId: 1, memoryId, relevance, tier, createdAt };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts:4:import * as confMod from '../lib/scoring/confidence-tracker';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts:18:      confidence REAL DEFAULT 0.5,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts:29:  confidence?: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts:35:    'INSERT INTO memory_index (id, title, confidence, validation_count, importance_tier) VALUES (?, ?, ?, ?, ?)'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts:39:    opts.confidence ?? 0.5,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts:87:      insertMemory(db, 1, { confidence: 0.95, validation_count: 6, importance_tier: 'normal' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts:97:    it('T-CT08 DB tier updated to critical after promotion', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts:99:      insertMemory(db, 1, { confidence: 0.95, validation_count: 7, importance_tier: 'important' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts:107:    it('T-CT09 updated_at refreshed after promotion', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts:110:        'INSERT INTO memory_index (id, title, confidence, validation_count, importance_tier, updated_at) VALUES (?, ?, ?, ?, ?, ?)'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts:121:      insertMemory(db, 1, { confidence: 0.99, validation_count: 10, importance_tier: 'critical' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts:130:      insertMemory(db, 1, { confidence: 0.99, validation_count: 10, importance_tier: 'constitutional' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts:139:      insertMemory(db, 1, { confidence: 0.3, validation_count: 1, importance_tier: 'normal' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts:153:    it('T-CT14 ineligible memory tier unchanged after failed promotion', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts:155:      insertMemory(db, 1, { confidence: 0.4, validation_count: 2, importance_tier: 'normal' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts:167:      insertMemory(db, 1, { confidence: ct, validation_count: vt, importance_tier: 'normal' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts:174:    it('T-CT16 fails just below confidence threshold', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts:178:      insertMemory(db, 1, { confidence: ct - 0.01, validation_count: vt, importance_tier: 'normal' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts:189:      insertMemory(db, 1, { confidence: ct, validation_count: vt - 1, importance_tier: 'normal' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/five-factor-scoring.vitest.ts:557:  it('EDGE-T06: Falls back to updated_at when no last_review', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:37:  confidence?: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:78:      confidence REAL DEFAULT 0.5,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:86:      last_review TEXT
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:105:    INSERT INTO memory_index (spec_folder, file_path, title, content_text, importance_tier, created_at, last_accessed, access_count, confidence, is_pinned, stability, half_life_days)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:117:    data.confidence || 0.5,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:178:        confidence: 0.9,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:188:        confidence: 0.2,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:207:        confidence: 0.2,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:226:        confidence: 0.1,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:244:        confidence: 0.1,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:515:        confidence: 0.9,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:521:        confidence: 0.9,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:527:        confidence: 0.2,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:535:        confidence: 0.1,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:552:        confidence: 0.2,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:569:        confidence: 0.2,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:638:          confidence: 0.1,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:659:          confidence: 0.1,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:679:        confidence: 0.1,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/provenance-envelope.vitest.ts:163:vi.mock('../lib/search/confidence-scoring', () => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/provenance-envelope.vitest.ts:223:      trackAccess: false,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:152:        { detected: true, type: 'deprecation', description: 'Previous guidance replaced', confidence: 0.75 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:266:  it('calls tuneAdaptiveThresholdsAfterEvaluation when adaptive ranking enabled and promotionGate exists', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:310:    expect(vi.mocked(tuneAdaptiveThresholdsAfterEvaluation)).toHaveBeenCalledWith(db, report?.promotionGate);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:344:    expect(report?.promotionGate.ready).toBe(false);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:345:    expect(report?.promotionGate.recommendation).toBe('wait');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:347:    expect(vi.mocked(tuneAdaptiveThresholdsAfterEvaluation)).toHaveBeenCalledWith(db, report?.promotionGate);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:384:  it('handles tuneAdaptiveThresholdsAfterEvaluation errors gracefully when promotionGate exists', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:557:      queryId: 'consumption:1001',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:561:      queryId: 'consumption:1001',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:7:import * as mod from '../lib/scoring/confidence-tracker';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:12:} from '../lib/scoring/confidence-tracker';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:16:// Confidence scoring with validation and tier promotion
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:30:    confidence REAL DEFAULT 0.5,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:54:    'INSERT INTO memory_index (id, title, confidence, validation_count, importance_tier) VALUES (?, ?, ?, ?, ?)'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:115:    it('T510-02a: Positive validation increases confidence', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:119:      expect(result.confidence).toBeGreaterThan(before);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:141:    it('T510-03a: Negative validation decreases confidence', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:145:      expect(result.confidence).toBeLessThan(before);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:184:      // Memory 5 has confidence=0.88, validation_count=4
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:185:      // Promotion requires confidence >= 0.9 AND validation_count >= 5
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:188:      expect(result.promotionEligible).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:191:    it('T510-05b: Auto-promotion occurred', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:194:        expect(validation.promotionEligible).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:208:      expect(typeof info.confidence).toBe('number');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:212:    it('T510-05d: Already-critical memory not eligible for promotion', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:220:// Verifies all 7 DB operations in confidence-tracker survive
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:239:          confidence REAL DEFAULT 0.5,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:163:    expect(shortQuery.confidence).toBe('fallback');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:167:    expect(longQuery.confidence).toBe('fallback');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:174:    expect(result.confidence).toBe('fallback');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:228:  it('reports high confidence for trigger matches', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:231:      expect(result.confidence).toBe('high');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:235:  it('reports high confidence for very short queries', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:238:      expect(result.confidence).toBe('high');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:276:  it('reports appropriate confidence for moderate tier', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:279:      expect(['low', 'medium']).toContain(result.confidence);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:283:  it('reports low confidence near simple boundary (4 terms)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:287:      expect(result.confidence).toBe('low');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:291:  it('reports low confidence near complex boundary (8 terms)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:295:      expect(result.confidence).toBe('low');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:335:  it('reports high confidence for very long queries (>12 terms)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:341:      expect(result.confidence).toBe('high');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:345:  it('reports high confidence for content-rich queries (low stop-word ratio)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:352:      expect(result.confidence).toBe('high');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:525:      expect(result.confidence).toBe('fallback');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:533:      expect(result.confidence).toBe('fallback');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:542:      expect(result.confidence).toBe('fallback');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:551:      expect(result.confidence).toBe('fallback');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:560:      expect(result.confidence).toBe('fallback');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:600:      expect(typeof result.confidence).toBe('string');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:205:    trackAccess: false,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:137:    trackAccess: false,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/channel-representation.vitest.ts:72:  // ---- T1: All channels represented — no promotions ----
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/channel-representation.vitest.ts:73:  it('T1: all channels represented in topK — returns no promotions', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/channel-representation.vitest.ts:113:  // ---- T3: Channel missing but its best result is below quality floor — no promotion ----
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/channel-representation.vitest.ts:114:  it('T3: channel missing and best result below quality floor — no promotion', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/channel-representation.vitest.ts:187:  it('T7: feature flag disabled — returns topK unchanged with no promotions', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-the-eval.vitest.ts:45:  return { queryId: 1, memoryId, relevance };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/artifact-routing.vitest.ts:142:    expect(result.confidence).toBeGreaterThan(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/artifact-routing.vitest.ts:148:    expect(result.confidence).toBeGreaterThan(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/artifact-routing.vitest.ts:154:    expect(result.confidence).toBeGreaterThan(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/artifact-routing.vitest.ts:160:    expect(result.confidence).toBeGreaterThan(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/artifact-routing.vitest.ts:166:    expect(result.confidence).toBeGreaterThan(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/artifact-routing.vitest.ts:172:    expect(result.confidence).toBeGreaterThan(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/artifact-routing.vitest.ts:178:    expect(result.confidence).toBe(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/artifact-routing.vitest.ts:190:    expect(result.confidence).toBe(0.3); // Low confidence from folder hint
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1426:    it('does not start DB indexing when pending promotion fails before atomic save indexing', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:371:            last_review TEXT,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:414:        GROUND_TRUTH_RELEVANCES.some(r => r.queryId === q.id && r.relevance > 0),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:419:        .filter(r => r.queryId === queryWithGT!.id && r.relevance > 0)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:466:        GROUND_TRUTH_RELEVANCES.some(r => r.queryId === q.id),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:473:        r => r.queryId === queryWithGT!.id && r.relevance > 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:523:        GROUND_TRUTH_RELEVANCES.some(r => r.queryId === q.id),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:529:        r => r.queryId === queryWithGT!.id && r.relevance > 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:562:        GROUND_TRUTH_RELEVANCES.some(r => r.queryId === q.id && r.relevance > 0),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:568:        r => r.queryId === queryWithGT!.id && r.relevance > 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:607:        queryId: queryWithGT!.id,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:623:        GROUND_TRUTH_RELEVANCES.some(r => r.queryId === q.id && r.relevance > 0),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:629:        r => r.queryId === queryWithGT!.id && r.relevance > 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:674:        expect(failure.queryId).toBe(queryWithGT!.id);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:840:            queryId: 42,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:847:      expect(md).toContain('`graph` (queryId=42): Graph timeout');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:983:        { channel: 'vector', error: 'vector outage', queryId: 1, query: 'q1' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:984:        { channel: 'bm25', error: 'bm25 outage', queryId: 1, query: 'q1' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1067:      GROUND_TRUTH_RELEVANCES.some(r => r.queryId === q.id && r.relevance > 0),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1089:        r => r.queryId === matchedQuery.id && r.relevance > 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1156:      GROUND_TRUTH_RELEVANCES.some(r => r.queryId === q.id && r.relevance > 0),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1162:      r => r.queryId === queryWithGT!.id && r.relevance > 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1319:        GROUND_TRUTH_RELEVANCES.some(r => r.queryId === q.id && r.relevance > 0),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1324:        r => r.queryId === queryWithGT!.id && r.relevance > 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1367:        GROUND_TRUTH_RELEVANCES.some(r => r.queryId === q.id && r.relevance > 0),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:4:// Validates confidence computation, label thresholds, driver list
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:13:} from '../lib/search/confidence-scoring';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:74:    const confidences = computeResultConfidence(results);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:75:    expect(confidences).toHaveLength(3);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:80:    const confidences = computeResultConfidence(results);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:81:    expect(confidences).toHaveLength(1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:84:  it('confidence value is in [0, 1] range for all results', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:86:    const confidences = computeResultConfidence(results);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:87:    for (const c of confidences) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:88:      expect(c.confidence.value).toBeGreaterThanOrEqual(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:89:      expect(c.confidence.value).toBeLessThanOrEqual(1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:107:    expect(conf.confidence.label).toBe('high');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:108:    expect(conf.confidence.value).toBeGreaterThanOrEqual(0.7);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:112:    // Zero score, single channel, no reranker, no anchors → very low confidence
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:115:    expect(conf.confidence.label).toBe('low');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:116:    expect(conf.confidence.value).toBeLessThan(0.4);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:123:    expect(['medium', 'high']).toContain(conf.confidence.label);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:130:  it('large margin (>= 0.15) boosts confidence', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:133:    expect(topConf.confidence.drivers).toContain('large_margin');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:139:    expect(topConf.confidence.drivers).not.toContain('large_margin');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:144:    const confidences = computeResultConfidence(results);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:145:    const lastConf = confidences[confidences.length - 1];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:146:    expect(lastConf.confidence.drivers).not.toContain('large_margin');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:160:    expect(conf.confidence.drivers).toContain('multi_channel_agreement');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:170:    expect(conf.confidence.drivers).not.toContain('multi_channel_agreement');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:181:    expect(conf.confidence.drivers).toContain('multi_channel_agreement');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:196:    expect(conf.confidence.drivers).toContain('multi_channel_agreement');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:207:    expect(conf.confidence.drivers).not.toContain('multi_channel_agreement');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:217:    expect(conf.confidence.drivers).toContain('reranker_boost');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:223:    expect(conf.confidence.drivers).not.toContain('reranker_boost');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:229:    expect(conf.confidence.drivers).not.toContain('reranker_boost');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:235:    expect(conf.confidence.drivers).not.toContain('reranker_boost');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:252:    expect(conf.confidence.drivers).toContain('anchor_density');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:262:    expect(conf.confidence.drivers).not.toContain('anchor_density');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:268:    expect(conf.confidence.drivers).not.toContain('anchor_density');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:279:    expect(highConf.confidence.value).toBeGreaterThan(lowConf.confidence.value);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:286:    expect(conf.confidence.value).toBeGreaterThan(0.2);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:292:    expect(conf.confidence.value).toBeGreaterThan(0.2);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:299:    expect(conf.confidence.value).toBeGreaterThanOrEqual(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:300:    expect(conf.confidence.value).toBeLessThanOrEqual(1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:311:    expect(Array.isArray(conf.confidence.drivers)).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:326:    expect(conf.confidence.drivers.length).toBeGreaterThan(1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:327:    expect(conf.confidence.drivers).toContain('large_margin');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:328:    expect(conf.confidence.drivers).toContain('multi_channel_agreement');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:329:    expect(conf.confidence.drivers).toContain('reranker_boost');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:330:    expect(conf.confidence.drivers).toContain('anchor_density');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:342:  it('returns "good" when most results are high/medium confidence and top score is high', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:348:    const confidences = computeResultConfidence(results);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:349:    const { requestQuality } = assessRequestQuality(results, confidences);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:353:  it('returns "gap" when all results have low confidence', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:355:    const confidences = computeResultConfidence(results);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:356:    const { requestQuality } = assessRequestQuality(results, confidences);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:360:  it('returns "weak" for results with mediocre scores and mixed confidence', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:362:    const confidences = computeResultConfidence(results);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:363:    const { requestQuality } = assessRequestQuality(results, confidences);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:371:    const confidences = computeResultConfidence(results);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:372:    const { requestQuality } = assessRequestQuality(results, confidences);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:378:    const confidences = computeResultConfidence(results);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:379:    const assessment = assessRequestQuality(results, confidences);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:167:    expect(contract.confidence_impact).toBe(0.8);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:172:  it('createDegradedContract clamps confidence_impact to [0, 1]', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:174:    expect(overContract.confidence_impact).toBe(1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:177:    expect(underContract.confidence_impact).toBe(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:180:    expect(nanContract.confidence_impact).toBe(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:183:    expect(infContract.confidence_impact).toBe(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-router.vitest.ts:287:    expect(typeof result.classification.confidence).toBe('string');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-router.vitest.ts:329:    expect(result.classification.confidence).toBe('fallback');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:78:      last_review TEXT,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:111:      trackAccess: true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:225:  it('records adaptive access signals when trackAccess is true and adaptive ranking enabled', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:230:      INSERT INTO memory_index (id, stability, difficulty, review_count, access_count, last_review, created_at)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:239:      { id: 1, score: 0.9, similarity: 90, stability: 2.5, last_review: '2026-03-01T00:00:00.000Z', created_at: '2026-02-01T00:00:00.000Z' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:240:      { id: 2, score: 0.8, similarity: 80, stability: 3.0, last_review: '2026-03-02T00:00:00.000Z', created_at: '2026-02-02T00:00:00.000Z' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:260:      INSERT INTO memory_index (id, stability, difficulty, review_count, access_count, last_review, created_at)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:267:      { id: 1, score: 0.9, similarity: 90, stability: 2.5, last_review: '2026-03-01T00:00:00.000Z', created_at: '2026-02-01T00:00:00.000Z' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:303:        min_signals_for_promotion
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:311:      min_signals_for_promotion: 2,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:370:        min_signals_for_promotion = 6,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:471:      promotionReadyMemories: 1,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:649:  it('tunes thresholds after evaluation and applies them to promotion gating', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:684:    expect(tuning.summary.promotionReadyMemories).toBe(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:730:  it('applies a larger relaxation multiplier when promotion is recommended', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:231:      confidenceImpact: 0.3,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:239:    expect(contract.confidenceImpact).toBeGreaterThan(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:240:    expect(contract.confidenceImpact).toBeLessThanOrEqual(1.0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:247:      confidenceImpact: 1.0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:251:    expect(totalFailure.confidenceImpact).toBe(1.0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:97:        confidence REAL DEFAULT 0.5,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:100:        last_review TEXT,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:1019:        const result = await handler.handleMemoryValidate({ id: 1, wasUseful: true });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:1027:          typeof parsed.data?.confidence === 'number' ||
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:1042:        const result = await handler.handleMemoryValidate({ id: 1, wasUseful: false });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:1049:        expect(typeof parsed.data?.confidence === 'number').toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/safety.vitest.ts:119:          confidence REAL DEFAULT 0.5,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/safety.vitest.ts:123:          last_review TEXT,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:83:  classifyIntent: vi.fn(() => ({ intent: 'understand', confidence: 0.9, fallback: false })),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:105:  logSearchQuery: vi.fn(() => ({ queryId: 11, evalRunId: 22 })),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:43:        confidence: null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:47:        last_review: null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:137:        last_review: null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:168:        last_review: null, is_pinned: 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:126:        memory_validate: 'L4',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:2:// Tests all 10 safeguards, auto-promotion (T002a), and negative
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:3:// Feedback confidence signal (T002b/A4).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:60:} from '../lib/search/auto-promotion';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:90:      confidence REAL DEFAULT 0.5,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:123:  confidence?: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:131:    confidence = 0.5,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:135:    INSERT INTO memory_index (id, title, trigger_phrases, created_at, importance_tier, validation_count, confidence)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:137:  `).run(id, title, JSON.stringify(triggerPhrases), createdAt, tier, validationCount, confidence);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:742:  it('R11-AP03: below threshold - no promotion (normal with 3 validations)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:750:  it('R11-AP04: below threshold - no promotion (important with 7 validations)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:813:  it('R11-AP12: safeguards cap promotions to 3 per 8-hour rolling window', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:828:    expect(r4.reason).toContain('promotion_window_rate_limited');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:833:  it('R11-AP13: old promotions outside the 8-hour window do not block promotion', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:834:    // Create audit table and seed historical promotion events outside the rolling window.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:836:      CREATE TABLE IF NOT EXISTS memory_promotion_audit (
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:849:        INSERT INTO memory_promotion_audit
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:163:        trackAccess: false,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:126:      expect(result).toEqual({ queryId: 0, evalRunId: 0 });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:133:      logChannelResult({ evalRunId: 1, queryId: 1, channel: 'vector' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:143:      logFinalResult({ evalRunId: 1, queryId: 1 });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:165:      expect(result.queryId).toBeGreaterThan(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:170:      const row = db.prepare('SELECT id FROM eval_queries WHERE id = ?').get(result.queryId) as { id: number } | undefined;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:172:      expect(row!.id).toBe(result.queryId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:177:      const { queryId } = logSearchQuery({ query: 'unique-query-text-T005-9', intent: null });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:179:      const row = db.prepare('SELECT * FROM eval_queries WHERE id = ?').get(queryId) as Record<string, unknown>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:187:    it('T005-9b: logSearchQuery uses queryId as evalRunId for cross-process-safe correlation', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:189:      const { queryId, evalRunId } = logSearchQuery({ query: 'run-id-from-query-id' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:192:      expect(evalRunId).toBe(queryId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:197:      const { queryId, evalRunId } = logSearchQuery({ query: 'channel-log-test-T005-10' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:200:        queryId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:213:      ).get(evalRunId, queryId, 'bm25') as { id: number } | undefined;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:219:      const { queryId, evalRunId } = logSearchQuery({ query: 'ids-serialisation-test' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:222:        queryId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:230:      ).get(evalRunId, queryId) as Record<string, unknown>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:240:      const { queryId, evalRunId } = logSearchQuery({ query: 'final-result-test-T005-12' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:243:        queryId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:255:      ).get(evalRunId, queryId) as { id: number } | undefined;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:261:      const { queryId, evalRunId } = logSearchQuery({ query: 'fusion-method-test' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:262:      logFinalResult({ evalRunId, queryId, fusionMethod: 'rrf' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:266:      ).get(evalRunId, queryId) as { fusion_method: string };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:294:      const { queryId, evalRunId } = logSearchQuery({ query: 'run-id-consistency' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:296:      logChannelResult({ evalRunId, queryId, channel: 'vector' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:297:      logFinalResult({ evalRunId, queryId, fusionMethod: 'rrf' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:302:      ).get(queryId, 'vector') as { eval_run_id: number };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:306:      ).get(queryId) as { eval_run_id: number };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:328:        expect(typeof r.queryId).toBe('number');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:339:        logChannelResult({ evalRunId: 0, queryId: 0, channel: 'vector' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:347:        logFinalResult({ evalRunId: 0, queryId: 0 });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:354:      const { queryId, evalRunId } = logSearchQuery({ query: 'optional-fields-test' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:356:        logChannelResult({ evalRunId, queryId, channel: 'graph' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:401:      const { queryId, evalRunId } = logSearchQuery({ query: 'bench query', intent: 'understand' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:402:      logChannelResult({ evalRunId, queryId, channel: 'vector', resultMemoryIds: [1, 2, 3], scores: [0.9, 0.8, 0.7] });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:403:      logFinalResult({ evalRunId, queryId, resultMemoryIds: [1, 2, 3], scores: [0.9, 0.8, 0.7] });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:422:      logChannelResult({ evalRunId: 1, queryId: 1, channel: 'vector' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:423:      logFinalResult({ evalRunId: 1, queryId: 1 });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:447:      const { queryId, evalRunId } = logSearchQuery({ query: 'overhead test' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:448:      logChannelResult({ evalRunId, queryId, channel: 'hybrid', resultMemoryIds: [1, 2], scores: [0.9, 0.8] });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:449:      logFinalResult({ evalRunId, queryId, resultMemoryIds: [1, 2], scores: [0.9, 0.8] });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-indexer.vitest.ts:170:          confidence: 1,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-indexer.vitest.ts:175:          confidence: 0.8,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:45:    confidence: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:103:  it('produces correct digest with confidence classification', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:105:      makeResult({ id: 1, confidence: { label: 'high', value: 0.9 } }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:106:      makeResult({ id: 2, confidence: { label: 'high', value: 0.8 } }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:107:      makeResult({ id: 3, confidence: { label: 'medium', value: 0.5 } }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:108:      makeResult({ id: 4, confidence: { label: 'low', value: 0.2 } }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:114:  it('classifies results without confidence data as "weak"', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:116:    // No confidence property → defaults to low/weak
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:123:      makeResult({ id: 1, confidence: { label: 'high', value: 0.95 } }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:124:      makeResult({ id: 2, confidence: { label: 'high', value: 0.85 } }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:137:      makeResult({ id: 1, confidence: { label: 'high', value: 0.9 } }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:138:      makeResult({ id: 2, confidence: { label: 'medium', value: 0.5 } }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:139:      makeResult({ id: 3, confidence: { label: 'low', value: 0.2 } }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:140:      makeResult({ id: 4, confidence: { label: 'low', value: 0.1 } }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:146:  it('treats missing confidence as low', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:133:          confidence: 0.85,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:172:      confidence: 0.85,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:64:    queryId: 'q-001',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:65:    confidence: 'strong',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:230:  it('counts confidence tiers separately', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:233:      makeEvent({ confidence: 'strong', sessionId: 'sess-1' }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:234:      makeEvent({ confidence: 'medium', sessionId: 'sess-2' }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:235:      makeEvent({ confidence: 'weak',   sessionId: 'sess-3' }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:249:      makeEvent({ confidence: 'strong', sessionId: 'sess-1' }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:250:      makeEvent({ confidence: 'strong', sessionId: 'sess-2' }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:251:      makeEvent({ confidence: 'medium', sessionId: 'sess-3' }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:261:      makeEvent({ confidence: 'strong', sessionId: `sess-${i}`, memoryId: 'mem-X' })
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:292:      makeEvent({ memoryId: 'mem-low',  confidence: 'weak',   sessionId: 's1' }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:293:      makeEvent({ memoryId: 'mem-high', confidence: 'strong', sessionId: 's2' }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:55:      confidence REAL DEFAULT 0.5,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:58:      last_review TEXT,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:148:      confidence REAL DEFAULT 0.5,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:151:      last_review TEXT,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:440:          embedding_status TEXT DEFAULT 'success', confidence REAL DEFAULT 0.5,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:442:          last_review TEXT, review_count INTEGER DEFAULT 0
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts:65:    it('T507-01: trackAccess returns true on accumulate', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts:66:      const result1 = mod.trackAccess(1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts:70:    it('T507-01b: Accumulator state updated after trackAccess', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts:85:        mod.trackAccess(2);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts:89:      mod.trackAccess(2);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts:169:      mod.trackAccess(1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:27:        memory_validate: 1000,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts:118:    parts.push(`> **⚠️ EVIDENCE GAP DETECTED:** Low confidence (Z=${trm.zScore.toFixed(2)})\n`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-intent-classifier.vitest.ts:53:      expect(result.confidence).toBe(0.5);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-intent-classifier.vitest.ts:66:      expect(result.confidence).toBeGreaterThanOrEqual(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-intent-classifier.vitest.ts:67:      expect(result.confidence).toBeLessThanOrEqual(1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-intent-classifier.vitest.ts:73:    it('confidence never exceeds 0.95', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-intent-classifier.vitest.ts:77:      expect(result.confidence).toBeLessThanOrEqual(0.95);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-intent-classifier.vitest.ts:85:      expect(result.confidence).toBe(0.5);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search-context-headers.vitest.ts:88:      queryId: 'ctx-order-preservation',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search-context-headers.vitest.ts:128:      queryId: 'ctx-budget-overhead',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/scoring-observability.vitest.ts:195:      queryId: 'test-q-1',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/scoring-observability.vitest.ts:215:      queryId: 'age-test',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/scoring-observability.vitest.ts:250:      queryId: 'tm01-test',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/scoring-observability.vitest.ts:270:      queryId: 'tm01-not-applied',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/scoring-observability.vitest.ts:290:      queryId: 'delta-test',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/scoring-observability.vitest.ts:335:        queryId: `q${i}`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/scoring-observability.vitest.ts:352:      memoryId: 1, queryId: 'q1', timestamp: new Date().toISOString(),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/scoring-observability.vitest.ts:358:      memoryId: 2, queryId: 'q2', timestamp: new Date().toISOString(),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/scoring-observability.vitest.ts:387:      queryId: 'safe-test',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/scoring-observability.vitest.ts:435:        queryId: 'no-table',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:402:            confidence: 0.8, validation_count: 2, access_count: 5,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:66:    expect(result.confidence).toBeGreaterThan(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:74:    expect(result.confidence).toBeGreaterThan(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:80:    expect(result.confidence).toBeGreaterThan(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:316:    expect(r1.confidence).toBe(r2.confidence);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:94:     Returns: { detected: boolean, type: string|null, description: string|null, confidence: number }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:168:      expect(typeof r.confidence).toBe('number');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:169:      expect(r.confidence).toBeGreaterThan(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:172:    it('T125: Result has {detected, type, description, confidence}', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:177:      expect(r).toHaveProperty('confidence');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:356:      const contradiction = { detected: false, type: null, description: null, confidence: 0 };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:374:      const contradiction = { detected: false, type: null, description: null, confidence: 0 };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:395:      const contradiction = { detected: false, type: null, description: null, confidence: 0 };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-session-state.vitest.ts:31:        confidence: 0.92,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-session-state.vitest.ts:43:          { intent: 'find_spec', confidence: 0.92, score: 0.92 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-session-state.vitest.ts:44:          { intent: 'find_decision', confidence: 0.44, score: 0.44 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-session-state.vitest.ts:45:          { intent: 'understand', confidence: 0.18, score: 0.18 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-session-state.vitest.ts:118:      logSearchQuery: vi.fn(() => ({ queryId: 0, evalRunId: 0 })),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:87:    tool: 'memory_validate',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:90:    description: 'missing required id and wasUseful',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:170:      'memory_validate',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:295:      'memory_validate', 'memory_save', 'memory_index_scan', 'memory_health',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1474:      { name: 'MemoryValidateArgs', requiredFields: ['id', 'wasUseful'], source: 'toolTypes' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2093:      'memory_validate': '[L4:Mutation]',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:26:        last_review: '2020-01-01T00:00:00Z',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:36:        last_review: new Date().toISOString(),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:47:        last_review: '2023-01-01T00:00:00Z',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:56:        { id: 11, importance_tier: 'normal', stability: 1.0, last_review: new Date().toISOString() },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:57:        { id: 12, importance_tier: 'normal', stability: 0.05, last_review: '2023-01-01T00:00:00Z', created_at: '2023-01-01T00:00:00Z' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:58:        { id: 13, importance_tier: 'temporary', stability: 0.01, last_review: '2022-06-01T00:00:00Z', created_at: '2022-06-01T00:00:00Z' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:79:        { id: 32, importance_tier: 'normal', stability: 1.0, last_review: new Date().toISOString() },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:80:        { id: 33, importance_tier: 'normal', stability: 0.05, last_review: '2023-01-01T00:00:00Z', created_at: '2023-01-01T00:00:00Z' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:81:        { id: 34, importance_tier: 'temporary', stability: 0.01, last_review: '2022-01-01T00:00:00Z', created_at: '2022-01-01T00:00:00Z' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:92:        { id: 32, importance_tier: 'normal', stability: 1.0, last_review: new Date().toISOString() },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:93:        { id: 33, importance_tier: 'normal', stability: 0.05, last_review: '2023-01-01T00:00:00Z', created_at: '2023-01-01T00:00:00Z' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:94:        { id: 34, importance_tier: 'temporary', stability: 0.01, last_review: '2022-01-01T00:00:00Z', created_at: '2022-01-01T00:00:00Z' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:105:        { id: 32, importance_tier: 'normal', stability: 1.0, last_review: new Date().toISOString() },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:106:        { id: 33, importance_tier: 'normal', stability: 0.05, last_review: '2023-01-01T00:00:00Z', created_at: '2023-01-01T00:00:00Z' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:107:        { id: 34, importance_tier: 'temporary', stability: 0.01, last_review: '2022-01-01T00:00:00Z', created_at: '2022-01-01T00:00:00Z' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:191:        { memoryId: 41, attentionScore: 0.50, tier: 'WARM', importance_tier: 'normal', stability: 1.0, last_review: new Date().toISOString(), id: 41 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:192:        { memoryId: 42, attentionScore: 0.10, tier: 'COLD', importance_tier: 'normal', stability: 0.05, last_review: '2023-01-01', created_at: '2023-01-01', id: 42 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:85:    expect(parsed.data).not.toHaveProperty('confidence');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/evidence-gap-detector.vitest.ts:2:// Transparent Reasoning Module: Z-score confidence check on RRF
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/evidence-gap-detector.vitest.ts:3:// Scores to detect low-confidence retrieval and inject warnings.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:13:import { computeResultConfidence } from '../lib/search/confidence-scoring.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:78:  it('keeps ranking confidence separate from structural trust axes', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:96:    expect(firstConfidence?.confidence.value).toBeTypeOf('number');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:97:    expect(firstConfidence?.confidence).not.toHaveProperty('structuralTrust');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:98:    expect(firstConfidence?.confidence).not.toHaveProperty('parserProvenance');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:99:    expect(firstConfidence?.confidence).not.toHaveProperty('evidenceStatus');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:100:    expect(firstConfidence?.confidence).not.toHaveProperty('freshnessAuthority');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/token-budget.vitest.ts:183:      { includeContent: true, queryId: 'test-q1' }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/token-budget.vitest.ts:198:    expect(overflow!.queryId).toBe('test-q1');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/token-budget.vitest.ts:229:    const { overflow } = truncateToBudget(results, 100, { queryId: 'eval-test' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/token-budget.vitest.ts:233:    expect(log.queryId).toBe('eval-test');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/channel-enforcement.vitest.ts:17:// T8:  promotions never displace items already in top-3 (appended)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/channel-enforcement.vitest.ts:18:// T9:  quality floor prevents low-quality promotions
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/channel-enforcement.vitest.ts:19:// T10: multiple missing channels → each gets at most 1 promotion
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/channel-enforcement.vitest.ts:162:    // Total results = 5 original + 1 promotion = 6 (g1 already in tail but a new
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/channel-enforcement.vitest.ts:169:  it('T4: promoted results appear in results list and metadata reflects the promotion', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/channel-enforcement.vitest.ts:195:    // The graph promotion uses a raw lexical-style score that would previously
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/channel-enforcement.vitest.ts:219:    // The normalized promotion must no longer outrank the highest fused item.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/channel-enforcement.vitest.ts:242:    // No promotions expected — all channels already represented.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/channel-enforcement.vitest.ts:277:  it('T8: promotions with lower scores are appended after the top-3, not inserted', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/channel-enforcement.vitest.ts:299:  // ---- T9: Quality floor prevents low-quality promotions ----
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/channel-enforcement.vitest.ts:300:  it('T9: quality floor blocks promotions below 0.005, preventing low-quality pollution', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/channel-enforcement.vitest.ts:312:    // No promotions — both channels below quality floor.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/channel-enforcement.vitest.ts:320:  // ---- T10: Multiple missing channels — each gets at most 1 promotion ----
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/channel-enforcement.vitest.ts:321:  it('T10: multiple missing channels — each receives at most 1 promotion', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/channel-enforcement.vitest.ts:334:    // 3 channels missing → 3 promotions max (one per channel)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/channel-enforcement.vitest.ts:353:  it('T11: when router returns ≥2 channels both present in top-k, no promotion is triggered', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/channel-enforcement.vitest.ts:408:  it('T14: all channel result sets empty — no promotions, results pass through', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/channel-enforcement.vitest.ts:425:  it('T15: topK=0 — empty inspection window, full results returned without promotions', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-eval-channels.vitest.ts:5:  queryId: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-eval-channels.vitest.ts:22:const mockLogSearchQuery = vi.fn<() => EvalSearchQueryResult>(() => ({ queryId: 77, evalRunId: 88 }));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:186:        mod.trackAccess(i);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:189:      // The next trackAccess should trigger the overflow guard
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:191:      const result = mod.trackAccess(overflowId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:206:        mod.trackAccess(i);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:208:      mod.trackAccess(MAX + 2);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:231:        mod.trackAccess(2);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:249:        mod.trackAccess(2);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:271:        mod.trackAccess(2);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:301:          mod.trackAccess(memoryId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:318:          mod.trackAccess(memoryId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:383:      expect(typeof mod.trackAccess).toBe('function');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/schema-migration.vitest.ts:23:    it('T704: last_review column exists on memory_index', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/schema-migration.vitest.ts:39:    it('T708: last_review has TEXT type', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/schema-migration.vitest.ts:48:      const fsrsColumns = ['stability', 'difficulty', 'last_review', 'review_count'];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/schema-migration.vitest.ts:66:    it('T714: last_review can be NULL initially', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/schema-migration.vitest.ts:82:    it('T718: Can set last_review to ISO timestamp', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/schema-migration.vitest.ts:227:    it('idx_last_review index exists', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-eval-channels.vitest.ts:10:const mockLogSearchQuery = vi.fn((_payload: unknown) => ({ queryId: 11, evalRunId: 22 }));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-eval-channels.vitest.ts:86:  classifyIntent: vi.fn(() => ({ intent: 'understand', confidence: 0.9, fallback: false })),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/regression-suite.vitest.ts:143:        { queryId: 1, memoryId: 1, relevance: 3 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/regression-suite.vitest.ts:144:        { queryId: 1, memoryId: 2, relevance: 2 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/regression-suite.vitest.ts:145:        { queryId: 1, memoryId: 3, relevance: 1 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/regression-suite.vitest.ts:165:        { queryId: 1, memoryId: 1, relevance: 3 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/regression-suite.vitest.ts:166:        { queryId: 1, memoryId: 2, relevance: 3 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/regression-suite.vitest.ts:167:        { queryId: 1, memoryId: 3, relevance: 3 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/regression-suite.vitest.ts:189:        { queryId: 1, memoryId: 1, relevance: 3 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/regression-suite.vitest.ts:190:        { queryId: 1, memoryId: 2, relevance: 3 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/regression-suite.vitest.ts:204:      expect(computeNDCG([], [{ queryId: 1, memoryId: 1, relevance: 3 }], 10)).toBe(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-quality-filter.vitest.ts:71:      confidence: 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-quality-filter.vitest.ts:88:      confidence: 0.8,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts:48:          last_review TEXT,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts:53:        CREATE INDEX idx_last_review ON memory_index(last_review);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts:54:        CREATE INDEX idx_fsrs_retrieval ON memory_index(stability, difficulty, last_review);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:37:      confidence?: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:488:      confidence: 0.85,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:497:      confidence: 0.85,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-router-channel-interaction.vitest.ts:234:      // After promotion, all 5 channels should be represented
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-router-channel-interaction.vitest.ts:302:      // Fts is under-represented but nothing qualifies for promotion
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:65:  confidence: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:84:    trackAccess: false,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-limit.vitest.ts:37:        confidence REAL DEFAULT 0.5,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-limit.vitest.ts:40:        last_review TEXT,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:58:        confidence REAL DEFAULT 0.5,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:61:        last_review TEXT,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:626:    it('sets confidence to 0.85', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1475:      expect(typeof resolvedPreview.confidence).toBe('number');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:315:      confidence: 0.85,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:338:    expect(resumed.confidence).toBe(0.95);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:354:    expect(explicit.confidence).toBe(1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:33:    queryId: 'query-001',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:34:    confidence: 'weak',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:88:    expect(names).toContain('confidence');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:101:    expect(names).toContain('idx_feedback_confidence');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:176:    const id = logFeedbackEvent(db, makeEvent({ type: 'result_cited', confidence: 'strong' }));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:196:  it('stores all 3 confidence tiers', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:198:    logFeedbackEvent(db, makeEvent({ confidence: 'strong' }));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:199:    logFeedbackEvent(db, makeEvent({ confidence: 'medium' }));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:200:    logFeedbackEvent(db, makeEvent({ confidence: 'weak' }));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:202:    const tiers = events.map(e => e.confidence);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:214:      queryId: 'q-999',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:215:      confidence: 'strong',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:225:    expect(row.confidence).toBe('strong');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:237:  it('auto-infers confidence from type when not overridden', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:239:    // Pass the event type's own inferred confidence to match resolveConfidence
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:243:      queryId: 'q-1',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:244:      confidence: resolveConfidence('query_reformulated'),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:248:    expect(events[0].confidence).toBe('medium');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:299:    logFeedbackEvent(db, makeEvent({ type: 'result_cited', confidence: 'strong' }));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:316:  it('filters by confidence tier', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:318:    logFeedbackEvent(db, makeEvent({ confidence: 'strong' }));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:319:    logFeedbackEvent(db, makeEvent({ confidence: 'medium' }));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:320:    logFeedbackEvent(db, makeEvent({ confidence: 'weak' }));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:322:    const strong = getFeedbackEvents(db, { confidence: 'strong' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:324:    expect(strong[0].confidence).toBe('strong');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:394:  it('aggregates correctly across confidence tiers', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:396:    logFeedbackEvent(db, makeEvent({ memoryId: 'mem-1', confidence: 'strong' }));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:397:    logFeedbackEvent(db, makeEvent({ memoryId: 'mem-1', confidence: 'strong' }));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:398:    logFeedbackEvent(db, makeEvent({ memoryId: 'mem-1', confidence: 'medium' }));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:399:    logFeedbackEvent(db, makeEvent({ memoryId: 'mem-1', confidence: 'weak' }));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:411:    logFeedbackEvent(db, makeEvent({ memoryId: 'mem-A', confidence: 'strong' }));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:412:    logFeedbackEvent(db, makeEvent({ memoryId: 'mem-B', confidence: 'weak' }));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:448:    logFeedbackEvent(db, makeEvent({ type: 'result_cited', confidence: 'strong' }));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:3:// NDCG/MRR metrics, SQLite logging, weekly tracker, promotion gate,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:173:  const queryIds = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10'];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:176:    const holdout = selectHoldoutQueries(queryIds);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:182:    const holdout = selectHoldoutQueries(queryIds, { holdoutPercent: 0.50 });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:187:    const h1 = selectHoldoutQueries(queryIds, { seed: 42 });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:188:    const h2 = selectHoldoutQueries(queryIds, { seed: 42 });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:194:    const h1 = selectHoldoutQueries(queryIds, { seed: 42, holdoutPercent: 0.50 });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:195:    const h2 = selectHoldoutQueries(queryIds, { seed: 7777, holdoutPercent: 0.50 });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:205:    expect(selectHoldoutQueries(queryIds, { holdoutPercent: 0 })).toEqual([]);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:209:    const holdout = selectHoldoutQueries(queryIds, { holdoutPercent: 1.0 });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:210:    expect(holdout.length).toBe(queryIds.length);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:212:    for (const q of queryIds) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:224:    const holdout = selectHoldoutQueries(queryIds, { holdoutPercent: 0.50 });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:226:      expect(queryIds).toContain(q);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:489:    expect(result.queryId).toBe('q1');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:684:        queryId: 'q1',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:703:      const history = getShadowScoringHistory(db, { queryId: 'q1' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:719:        queryId: 'q1',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:739:        queryId: 'q1',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:761:        queryId: 'q1',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:768:        queryId: 'q2',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:791:        queryId: 'q1',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:1196:    expect(report!.promotionGate).toBeDefined();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:1257:  it('evaluates promotion gate across multiple pipeline runs', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:1278:    expect(report1!.promotionGate.ready).toBe(false);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:1279:    expect(report1!.promotionGate.consecutiveWeeks).toBe(1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:1288:    expect(report2!.promotionGate.ready).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:1289:    expect(report2!.promotionGate.consecutiveWeeks).toBe(2);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:1290:    expect(report2!.promotionGate.recommendation).toBe('promote');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:1394:      queryId: 'q1',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:1402:    const allHistory = getShadowScoringHistory(db, { queryId: 'q1' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:1407:  it('promotion gate handles regression after improvements', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:640:          confidence: 1,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:74:} from '../lib/search/confidence-truncation';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:169:      expect(intent.confidence).toBeGreaterThanOrEqual(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:468:      expect(emptyIntent.confidence).toBe(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:625:      // Step 7: Truncate by confidence
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:28:  confidence?: ConfidencePayload;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:52:    file_path: `/tmp/confidence-${id}.md`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:56:    triggerPhrases: ['retrieval', 'confidence'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:83:  if (!result?.confidence) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:84:    throw new Error(`Expected confidence payload for result ${resultId}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:87:  return result.confidence;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:90:describe('D5 Phase A: result confidence scoring', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:106:  it('assigns high confidence to a result with a large score margin', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:143:    const confidence = getResultConfidence(envelope, 1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:144:    expect(confidence.label).toBe('high');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:145:    expect(confidence.value).toBeGreaterThan(0.7);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:146:    expect(confidence.drivers).toContain('large_margin');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:149:  it('boosts confidence when multiple channels agree on the top result', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:217:  it('assigns low confidence when the top result barely beats the runner-up', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:239:    const confidence = getResultConfidence(envelope, 1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:240:    expect(confidence.label).toBe('low');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:241:    expect(confidence.value).toBeLessThan(0.4);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:244:  it('keeps label thresholds aligned with the numeric confidence value', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:311:  it('populates confidence drivers with contributing factors', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:346:    const confidence = getResultConfidence(envelope, 1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:347:    expect(confidence.drivers.length).toBeGreaterThan(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:348:    expect(new Set(confidence.drivers).size).toBe(confidence.drivers.length);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:349:    expect(confidence.drivers.every((driver) => DRIVER_NAMES.includes(driver as (typeof DRIVER_NAMES)[number]))).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:405:  it('omits confidence when SPECKIT_RESULT_CONFIDENCE_V1 is false', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:425:    expect(envelope.data.results.every((result) => result.confidence === undefined)).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/bm25-baseline.vitest.ts:472:      if (relevance.queryId <= 3 && relevance.relevance > 0 && !relevantMemoryByQueryId.has(relevance.queryId)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/bm25-baseline.vitest.ts:473:        relevantMemoryByQueryId.set(relevance.queryId, relevance.memoryId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:144:        reviewCount: 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:265:    it('T642: last_review column exists', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:266:      expect(VECTOR_INDEX_SCHEMA_SOURCE).toContain('last_review TEXT');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:289:    it('T648: last_review timestamp updates', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:290:      expect(STAGE2_SOURCE).toContain('last_review = CURRENT_TIMESTAMP');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/temporal-contiguity.vitest.ts:45:        confidence REAL DEFAULT 0.5,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/temporal-contiguity.vitest.ts:48:        last_review TEXT,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-handler.vitest.ts:115:            confidence: 0.8,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-handler.vitest.ts:139:      confidence: 0.8,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-handler.vitest.ts:145:    expect(parsed.data).not.toHaveProperty('confidence');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mutation-ledger.vitest.ts:178:      decision_meta: { confidence: 0.95, strategy: 'dedup' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:37:      confidence REAL DEFAULT 0.5,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:45:      last_review TEXT
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:158:    expect(params).toHaveProperty('reviewCount');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:176:  it('C-05: reviewCount is 0', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:178:    expect(params.reviewCount).toBe(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:206:    expect(result).toHaveProperty('reviewCount');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:211:  it('D-02: reviewCount increments by 1', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:213:    expect(result.reviewCount).toBe(initial.reviewCount + 1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:225:    const params = { ...initial, stability: 5.0, lastReview: new Date().toISOString(), reviewCount: 1 };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:231:    const params = { ...initial, lastReview: new Date().toISOString(), reviewCount: 1 };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:237:    const params = { ...initial, lastReview: new Date().toISOString(), reviewCount: 1 };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:243:    const params = { ...initial, lastReview: new Date().toISOString(), reviewCount: 1 };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:266:    expect(result2.reviewCount).toBe(2);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-query-intelligence.vitest.ts:30:} from '../lib/search/confidence-truncation';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-query-intelligence.vitest.ts:97:  it('T001-04: confidence is a valid label (high, medium, low, or fallback)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-query-intelligence.vitest.ts:100:    expect(validLabels).toContain(result.confidence);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-query-intelligence.vitest.ts:107:    expect(result.confidence).toBe('fallback');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-query-intelligence.vitest.ts:113:    expect(result.confidence).toBe('fallback');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:57:        confidence REAL DEFAULT 0.5,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:60:        last_review TEXT,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/search-fallback-tiered.vitest.ts:310:  it('T045-17b: quality degradation uses absolute+relative confidence checks', () => {

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go | sed -n '160,240p;260,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "rg -n \"executePipeline|canonical|single source of truth|pipeline\" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests -g '*.vitest.ts'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:398:// Was part of legacy V1 pipeline, removed in 017-refinement-phase-6 Sprint 1.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:399:// V2 pipeline handles intent weighting in Stage 2.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:53:      canonical_name TEXT NOT NULL UNIQUE,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:447:      canonical_name: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:453:    expect(rows[0].canonical_name).toBe('react framework');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:470:    const row = db.prepare('SELECT * FROM entity_catalog WHERE canonical_name = ?')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:484:    const row = db.prepare('SELECT * FROM entity_catalog').get() as { canonical_name: string };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:485:    expect(row.canonical_name).toBe('react js framework');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:488:  it('appends new alias variants for the same canonical name', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:499:    const row = db.prepare('SELECT * FROM entity_catalog WHERE canonical_name = ?')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:544:      INSERT INTO entity_catalog (canonical_name, aliases, entity_type, memory_count, created_at)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:553:      SELECT canonical_name, aliases, entity_type, memory_count
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:555:      WHERE canonical_name = ?
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:557:      canonical_name: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:563:    expect(row.canonical_name).toBe('react framework');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:644:      SELECT canonical_name, memory_count
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:646:      ORDER BY canonical_name ASC
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:647:    `).all() as Array<{ canonical_name: string; memory_count: number }>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:648:    expect(catalogRows.some((row) => row.canonical_name === 'node js' && row.memory_count === 1)).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:649:    expect(catalogRows.some((row) => row.canonical_name === 'next js adapter' && row.memory_count === 1)).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:650:    expect(catalogRows.some((row) => row.canonical_name === 'curated alias' && row.memory_count === 1)).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:651:    expect(catalogRows.some((row) => row.canonical_name === 'python toolkit' && row.memory_count === 1)).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:3:import type { Stage2Input } from '../lib/search/pipeline/types';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:135:    const { __testables } = await import('../lib/search/pipeline/stage2-fusion');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:158:    const { executeStage2 } = await import('../lib/search/pipeline/stage2-fusion');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:190:    const { executeStage2 } = await import('../lib/search/pipeline/stage2-fusion');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:235:    const { executeStage2 } = await import('../lib/search/pipeline/stage2-fusion');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:266:    const { executeStage2 } = await import('../lib/search/pipeline/stage2-fusion');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:296:    const { executeStage2 } = await import('../lib/search/pipeline/stage2-fusion');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:320:    const { executeStage2 } = await import('../lib/search/pipeline/stage2-fusion');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:343:    const { executeStage2 } = await import('../lib/search/pipeline/stage2-fusion');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:370:    const { executeStage2 } = await import('../lib/search/pipeline/stage2-fusion');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:390:    const { executeStage2 } = await import('../lib/search/pipeline/stage2-fusion');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:402:    const { executeStage2 } = await import('../lib/search/pipeline/stage2-fusion');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-types.vitest.ts:95:    it('getHalfLifeForType returns canonical decay values', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:28:  canonical_file_path: string | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:534:        'ALTER TABLE memory_index ADD COLUMN canonical_file_path TEXT',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:553:        SET canonical_file_path = ?,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:563:        '/canonical/path/mem1.md',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:578:        SET canonical_file_path = NULL,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:593:        SELECT canonical_file_path, content_hash, content_text, quality_score, quality_flags, chunk_index, chunk_label
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:600:      expect(restored.canonical_file_path).toBe('/canonical/path/mem1.md');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:119:    expect(parsed.data.graphOps.readiness.canonical).toBe('stale');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:26:    query: 'how does the hybrid search pipeline work',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:72:    { id: 101, content: 'Hybrid search pipeline runs lexical retrieval, vector retrieval, and reranking in sequence. '.repeat(2) },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts:341:    it('C138-T2: CO_ACTIVATION_CONFIG has required pipeline fields', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-backfill.vitest.ts:27:      canonical_file_path,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:406:    it('T031-LEX-05: combined_lexical_search() deduplicates canonical IDs', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:408:      const canonicalIds = results.map((r: Record<string, unknown>) =>
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:409:        hybridSearch.__testables.canonicalResultId(r.id as number | string)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:411:      const uniqueCanonicalIds = Array.from(new Set(canonicalIds));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:412:      expect(canonicalIds.length).toBe(uniqueCanonicalIds.length);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:600:    it('T031-BASIC-04: hybridSearch() deduplicates canonical IDs across channels', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:614:      const canonicalIds = results.map((r) => hybridSearch.__testables.canonicalResultId(r.id));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:615:      const uniqueCanonicalIds = Array.from(new Set(canonicalIds));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:616:      expect(canonicalIds.length).toBe(uniqueCanonicalIds.length);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:741:  it('C138-T1: hybridSearch module exports hybridSearchEnhanced (pipeline entry)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:12:import type { PipelineRow } from '../lib/search/pipeline/types';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:72:        '<!-- ANCHOR:DECISION-pipeline-003 -->',  // line 1
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:74:        '<!-- /ANCHOR:DECISION-pipeline-003 -->',  // line 3
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:80:        id: 'DECISION-pipeline-003',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:284:    expect(typeOf('DECISION-pipeline-003')).toBe('DECISION');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:288:    expect(typeOf('Decision-pipeline-003')).toBe('Decision-pipeline-003');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:292:    expect(typeOf('decision-pipeline-003')).toBe('decision-pipeline-003');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:320:// SECTION 3: enrichResultsWithAnchorMetadata — pipeline rows
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:3:import type { PipelineRow } from '../lib/search/pipeline/types';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:39:import { __testables } from '../lib/search/pipeline/stage3-rerank';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:40:import { executeStage3 } from '../lib/search/pipeline/stage3-rerank';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:72:<!-- ANCHOR:canonical-docs -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:77:- \`implementation-summary.md\` — Save pipeline integration story
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:79:<!-- /ANCHOR:canonical-docs -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:94:This regression fixture exists to prove that successful saves and duplicate no-op saves still report the correct UX payloads after the shared insufficiency gate and rendered-memory template contract were added to the save pipeline.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator.vitest.ts:245:      SELECT canonical_file_path
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator.vitest.ts:249:      canonical_file_path: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator.vitest.ts:268:      `${parsed.specFolder}::${parentRow.canonical_file_path}::chunk-a`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator.vitest.ts:269:      `${parsed.specFolder}::${parentRow.canonical_file_path}::chunk-b`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator.vitest.ts:270:      `${parsed.specFolder}::${parentRow.canonical_file_path}::chunk-c`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-boost.vitest.ts:70:  it('T015: RRF + session boost pipeline keeps score order stable with equal boosts', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:482:  it('full pipeline: build response, then resolve cursor for remaining', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:485:    const response = buildProgressiveResponse(results, 5, 'full pipeline test');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:200:      query: 'implementation details for hybrid rag fusion pipeline',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:222:      query: 'implementation details for hybrid rag fusion pipeline',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:240:      query: 'the complete architecture of the advanced fusion pipeline v3',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:266:    const payload = buildRecoveryPayload(makeCtx({ query: 'hybrid rag fusion pipeline' }));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:271:    const payload = buildRecoveryPayload(makeCtx({ query: 'hybrid rag fusion pipeline implementation' }));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:288:      query: 'implementation details for hybrid rag fusion pipeline stage two',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/create-record-lineage-regressions.vitest.ts:23:      canonical_file_path,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:251:  symlinkIt('matches alias path via canonical_file_path when available', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:253:    db.exec('ALTER TABLE memory_index ADD COLUMN canonical_file_path TEXT');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:256:    const canonicalDir = fs.mkdtempSync(path.join(os.tmpdir(), 'inc-idx-canonical-'));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:257:    const canonicalFile = path.join(canonicalDir, 'alias-match.md');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:258:    fs.writeFileSync(canonicalFile, 'alias content', 'utf-8');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:261:    fs.symlinkSync(canonicalDir, aliasDir, 'dir');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:264:    const canonicalKey = fs.realpathSync(canonicalFile);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:267:      INSERT INTO memory_index (spec_folder, file_path, canonical_file_path, file_mtime_ms, content_hash, embedding_status)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:269:    `).run('specs/test', canonicalFile, canonicalKey, 1700000000000, 'alias-hash', 'success');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:276:    expect(row.file_path).toBe(canonicalFile);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:280:    fs.rmSync(canonicalDir, { recursive: true, force: true });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:429:    db.exec('ALTER TABLE memory_index ADD COLUMN canonical_file_path TEXT');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:432:    const canonicalDir = fs.mkdtempSync(path.join(os.tmpdir(), 'inc-idx-canonical-update-'));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:433:    const canonicalFile = path.join(canonicalDir, 'alias-update.md');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:434:    fs.writeFileSync(canonicalFile, 'mtime alias content', 'utf-8');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:437:    fs.symlinkSync(canonicalDir, aliasDir, 'dir');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:440:    const canonicalKey = fs.realpathSync(canonicalFile);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:443:      INSERT INTO memory_index (spec_folder, file_path, canonical_file_path, file_mtime_ms, content_hash, embedding_status)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:445:    `).run('specs/test', canonicalFile, canonicalKey, 1000, 'mtime-hash', 'success');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:450:    const row = db.prepare('SELECT file_mtime_ms FROM memory_index WHERE file_path = ?').get(canonicalFile) as { file_mtime_ms: number };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:454:    fs.rmSync(canonicalDir, { recursive: true, force: true });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:557:  symlinkIt('does not mark alias rows as stale when canonical path is still present in scan', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:559:    db.exec('ALTER TABLE memory_index ADD COLUMN canonical_file_path TEXT');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:562:    const canonicalDir = fs.mkdtempSync(path.join(os.tmpdir(), 'inc-idx-canonical-present-'));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:563:    const canonicalFile = path.join(canonicalDir, 'doc.md');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:564:    fs.writeFileSync(canonicalFile, 'canonical content', 'utf-8');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:567:    fs.symlinkSync(canonicalDir, aliasDir, 'dir');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:570:    const canonicalKey = fs.realpathSync(canonicalFile);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:572:      INSERT INTO memory_index (spec_folder, file_path, canonical_file_path, file_mtime_ms, content_hash, embedding_status)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:574:    `).run('specs/test', aliasFile, canonicalKey, 1700000000000, 'alias-hash', 'success');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:576:    const result = mod.categorizeFilesForIndexing([canonicalFile]);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:580:    fs.rmSync(canonicalDir, { recursive: true, force: true });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:605:  symlinkIt('skips deletion ids when canonical path still exists', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:607:    db.exec('ALTER TABLE memory_index ADD COLUMN canonical_file_path TEXT');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:610:    const canonicalDir = fs.mkdtempSync(path.join(os.tmpdir(), 'inc-idx-canonical-id-'));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:611:    const canonicalFile = path.join(canonicalDir, 'doc.md');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:612:    fs.writeFileSync(canonicalFile, 'canonical-id content', 'utf-8');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:615:    fs.symlinkSync(canonicalDir, aliasDir, 'dir');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:618:    const canonicalKey = fs.realpathSync(canonicalFile);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:620:      INSERT INTO memory_index (spec_folder, file_path, canonical_file_path, file_mtime_ms, content_hash, embedding_status)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:622:    `).run('specs/test', aliasFile, canonicalKey, 1700000000000, 'canonical-live', 'success');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:628:    fs.rmSync(canonicalDir, { recursive: true, force: true });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:107:        const canonicalSpecs = path.join(root, '.opencode', 'specs');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:108:        const specFolder = path.join(canonicalSpecs, 'system-spec-kit', '900-dedup-check');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:114:          fs.symlinkSync(canonicalSpecs, linkedSpecs, 'dir');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:133:        const canonicalSpecs = path.join(root, '.opencode', 'specs');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:134:        const targetFolder = path.join(canonicalSpecs, 'system-spec-kit', '910-target');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:135:        const otherFolder = path.join(canonicalSpecs, 'system-spec-kit', '911-other');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:143:          fs.symlinkSync(canonicalSpecs, linkedSpecs, 'dir');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search-context-headers.vitest.ts:124:    const pipelineBudget = rows.reduce((sum, row) => sum + estimateResultTokens(row), 0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search-context-headers.vitest.ts:125:    const adjustedBudget = Math.max(pipelineBudget - rows.length * 26, 200);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search-context-headers.vitest.ts:138:    expect(postInjectionTokens).toBeLessThanOrEqual(pipelineBudget);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/community-search.vitest.ts:68:      { id: 1, summary: 'search retrieval pipeline', memberIds: [1, 2], count: 2 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/community-search.vitest.ts:122:      { id: 1, summary: 'search pipeline alpha', memberIds: [1, 2, 3], count: 3 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/community-search.vitest.ts:123:      { id: 2, summary: 'search pipeline beta', memberIds: [2, 3, 4], count: 3 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/community-search.vitest.ts:126:    const result = searchCommunities('search pipeline', db);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking-e2e.vitest.ts:26:import { executePipeline } from '../lib/search/pipeline/index.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking-e2e.vitest.ts:42:vi.mock('../lib/search/pipeline/index.js', () => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking-e2e.vitest.ts:43:  executePipeline: vi.fn(),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking-e2e.vitest.ts:114:    vi.mocked(executePipeline).mockReset();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking-e2e.vitest.ts:313:    vi.mocked(executePipeline).mockResolvedValue({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking-e2e.vitest.ts:315:    } as Awaited<ReturnType<typeof executePipeline>>);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking-e2e.vitest.ts:326:    expect(vi.mocked(executePipeline)).toHaveBeenCalledTimes(1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:2:// Covers: R10 to S5 dependency chain, N2 pipeline integration,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:122:      canonical_name TEXT NOT NULL UNIQUE,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:272:      const tokenMatch = matches.find(m => m.canonicalName.includes('token'));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:335:  describe('N2 graph signals pipeline integration', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:458:        'The search pipeline processes queries through four stages. ' +
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:481:      // Apply community boost first (as in pipeline order)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/bm25-security.vitest.ts:395:        { id: 2, title: 'Index Management', content_text: 'BM25 indexing pipeline', trigger_phrases: 'index,bm25', file_path: 'specs/002/spec.md' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:421:      '../lib/utils/canonical-path',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:742:      vi.doMock('../lib/utils/canonical-path', () => ({ getCanonicalPathKey: vi.fn((p: string) => p) }))
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2398:      // Verify the source code routes through the canonical helper
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:8: * - Phase 5: Indexing pipeline (calculateDocumentWeight)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:37:// Phase 5: Indexing pipeline
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-roadmap-finalization.vitest.ts:6:} from '../lib/search/pipeline/ranking-contract';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:263:      db.exec('ALTER TABLE memory_index ADD COLUMN canonical_file_path TEXT');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:265:      db.prepare('UPDATE memory_index SET canonical_file_path = file_path').run();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:269:          id, spec_folder, file_path, canonical_file_path, title, content, content_hash, stability, difficulty
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:619:  it('C138-T0c: centroid score peak classifies canonical queries for all 7 intents', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:620:      const canonicalQueries: Record<IntentType, string> = {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:630:      for (const [expectedIntent, query] of Object.entries(canonicalQueries) as Array<[IntentType, string]>) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-id-simplification.vitest.ts:22:  'canonical-docs',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mpab-aggregation.vitest.ts:257:    // Chunks arrive in arbitrary order from retrieval pipeline
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:11:import { getCanonicalPathKey } from '../lib/utils/canonical-path';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:143:          '<!-- ANCHOR:canonical-docs -->',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:150:          '<!-- /ANCHOR:canonical-docs -->',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:289:      const embeddingPipelineModule = await import('../handlers/save/embedding-pipeline');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:477:        vi.doMock('../handlers/save/embedding-pipeline', options.embeddingPipelineModuleFactory);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:624:      vi.doUnmock('../handlers/save/embedding-pipeline');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1177:        canonicalFilePath: getCanonicalPathKey(filePath),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1832:          const actual = await vi.importActual<typeof import('../handlers/save/embedding-pipeline')>('../handlers/save/embedding-pipeline');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1876:          const actual = await vi.importActual<typeof import('../handlers/save/embedding-pipeline')>('../handlers/save/embedding-pipeline');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1960:          const actual = await vi.importActual<typeof import('../handlers/save/embedding-pipeline')>('../handlers/save/embedding-pipeline');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:2017:    it('T-dedup-canonical: canonical-equivalent paths treated as same memory', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hydra-spec-pack-consistency.vitest.ts:51:  path.join(SKILL_ROOT, 'feature_catalog', '14--pipeline-architecture', '22-lineage-state-active-projection-and-asof-resolution.md'),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hydra-spec-pack-consistency.vitest.ts:54:  path.join(SKILL_ROOT, 'feature_catalog', '19--feature-flag-reference', '01-1-search-pipeline-features-speckit.md'),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts:2:// Full scatter→fuse→co-activate→TRM→MMR→serialize pipeline.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts:126:// Full pipeline
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts:188:  // ---- T1: Full pipeline completes within 120ms ----
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts:204:  it('T3: pipeline hits vector, fts5, and graph sources', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts:254:  // ---- T8: Different intents produce different pipeline behavior ----
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts:290:   Tests targeting individual pipeline stages with production imports.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-lifecycle.vitest.ts:78:      canonical_name TEXT NOT NULL UNIQUE,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-save-pipeline.vitest.ts:19:    it('T526-1: Save pipeline modules loaded', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/provenance-envelope.vitest.ts:3:import type { PipelineRow, Stage2Input } from '../lib/search/pipeline/types';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/provenance-envelope.vitest.ts:5:import { executeStage2 } from '../lib/search/pipeline/stage2-fusion';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/provenance-envelope.vitest.ts:104:vi.mock('../lib/search/pipeline/stage2b-enrichment', () => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/provenance-envelope.vitest.ts:131:vi.mock('../lib/search/pipeline/ranking-contract', () => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:37:      canonical_file_path TEXT,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:86:      canonical_file_path,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:330:          spec_folder, file_path, canonical_file_path, title, content_hash, content_text, embedding_status, parent_id
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:367:        '/specs/sql-shape/memory/canonical.md',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:375:      expect(sqlCalls[0]).toContain('canonical_file_path = ?');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:377:      expect(sqlCalls.join('\n')).not.toContain('canonical_file_path = ? OR file_path = ?');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:414:          spec_folder, file_path, canonical_file_path, title, content_hash, embedding_status, parent_id
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:435:          spec_folder, file_path, canonical_file_path, title, content_hash, embedding_status, parent_id
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:457:          spec_folder, file_path, canonical_file_path, title, content_hash, embedding_status, trigger_phrases, quality_score, quality_flags, parent_id
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:487:          spec_folder, file_path, canonical_file_path, title, content_hash, embedding_status, trigger_phrases, quality_score, quality_flags, parent_id
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:508:        { canonicalFilePath: filePath, filePath },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:519:          spec_folder, file_path, canonical_file_path, title, content_hash, embedding_status, parent_id
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:534:        { canonicalFilePath: filePath, filePath },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:540:    it('T054-6h: Cross-path duplicates remain detectable when legacy rows have NULL canonical_file_path', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:541:      const content = 'Legacy rows with null canonical paths must still dedup across paths.';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:542:      const originalFilePath = '/specs/legacy-null-canonical/memory/original.md';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:543:      const incomingFilePath = '/specs/legacy-null-canonical/memory/incoming.md';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:546:          spec_folder, file_path, canonical_file_path, title, content_hash, embedding_status, parent_id
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:549:        'specs/legacy-null-canonical',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:557:        buildParsedMemory('specs/legacy-null-canonical', content, 'Legacy Duplicate'),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:560:        { canonicalFilePath: incomingFilePath, filePath: incomingFilePath },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:568:    it('T054-6i: Same-path exclusion stays effective for legacy rows with NULL canonical_file_path', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:569:      const content = 'Same-path legacy rows with null canonical paths should still be excluded.';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:573:          spec_folder, file_path, canonical_file_path, title, content_hash, embedding_status, parent_id
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:587:        { canonicalFilePath: filePath, filePath },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:598:          spec_folder, file_path, canonical_file_path, title, content_hash, embedding_status, tenant_id, parent_id
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:627:          spec_folder, file_path, canonical_file_path, title, content_hash, embedding_status, tenant_id, parent_id
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:785:function canonicalIds(results: Awaited<ReturnType<typeof hybridSearch.hybridSearchEnhanced>>): string[] {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:786:  return results.map((result) => hybridSearch.__testables.canonicalResultId(result.id));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:790:  it('deduplicates canonical IDs when includeContent=false (default production path)', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:805:    const ids = canonicalIds(results);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:810:  it('deduplicates canonical IDs when includeContent=true', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:826:    const ids = canonicalIds(results);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:831:  it('returns identical deduped canonical IDs for includeContent=false vs true', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:849:    const defaultCanonical = canonicalIds(defaultPath).sort();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:850:    const includeCanonical = canonicalIds(includeContentPath).sort();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-router-channel-interaction.vitest.ts:10:// 3. The two modules compose correctly in the pipeline
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-router-channel-interaction.vitest.ts:107:      const result = routeQuery('find all implementation details about the hybrid search pipeline including scoring normalization and channel representation enforcement mechanisms');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-router-channel-interaction.vitest.ts:207:    it('T033-09: R2 with 5 channels (complex tier) — full pipeline diversity', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-router-channel-interaction.vitest.ts:379:      const route = routeQuery('find all implementation details about the hybrid search pipeline including scoring normalization and channel representation enforcement mechanisms');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts:2:// Validates pipeline types, stage interfaces, Stage 4 invariant,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts:3:// And pipeline orchestration stages.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts:10:} from '../lib/search/pipeline/types';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts:25:} from '../lib/search/pipeline/types';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts:31:import { __testables as stage4Testables } from '../lib/search/pipeline/stage4-filter';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts:380:  it('R6-T27: executePipeline is exported from pipeline index', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts:381:    const { executePipeline } = await import('../lib/search/pipeline');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts:382:    expect(typeof executePipeline).toBe('function');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:166:  it('T006b: canonical ID matching deduplicates numeric/string/mem-prefixed IDs', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:221:  it('telemetry schema exports expected canonical retrieval stages', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:232:  it('sanitizeRetrievalTracePayload strips non-canonical fields', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:268:  it('isRetrievalTracePayload validates only canonical strict payloads', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:269:    const canonicalPayload = {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:285:      ...canonicalPayload,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:290:      ...canonicalPayload,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:302:    expect(isRetrievalTracePayload(canonicalPayload)).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage2b-enrichment-extended.vitest.ts:16:import { executeStage2bEnrichment } from '../lib/search/pipeline/stage2b-enrichment';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:4:// Search pipeline so results are pre-filtered at the DB layer
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:5:// (before entering the scoring pipeline), reducing latency for
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:105:import { executeStage1 } from '../lib/search/pipeline/stage1-candidate-gen';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:106:import type { Stage1Input, PipelineConfig } from '../lib/search/pipeline/types';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:7:import type { Stage2Input } from '../lib/search/pipeline/types.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:237:    const { executeStage2 } = await import('../lib/search/pipeline/stage2-fusion.js');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:265:    const { executeStage2 } = await import('../lib/search/pipeline/stage2-fusion.js');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth.vitest.ts:639:    expect(q!.query).toBe('what does maxTriggersPerMemory control in the search pipeline');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:506:        currentTask: 'Recover interrupted save pipeline audit',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-causal-graph.vitest.ts:147:    it('T528-6: Valid relation types accepted by pipeline', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-checkpoint-lifecycle.vitest.ts:28:    it('T529-1: Checkpoint pipeline modules loaded', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts:261:      // Was removed in 017-refinement-phase-6. The V2 pipeline's Stage 3 passes length penalty
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts:262:      // Config via applyLengthPenalty. Verify the pipeline stage instead.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts:264:        path.join(PROJECT_ROOT, 'lib', 'search', 'pipeline', 'stage3-rerank.ts'),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:4:// Verifies B1 error handling in executePipeline:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:17:} from '../lib/search/pipeline/types';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:28:vi.mock('../lib/search/pipeline/stage1-candidate-gen', () => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:32:vi.mock('../lib/search/pipeline/stage2-fusion', () => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:36:vi.mock('../lib/search/pipeline/stage3-rerank', () => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:40:vi.mock('../lib/search/pipeline/stage4-filter', () => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:62:import { executePipeline } from '../lib/search/pipeline/orchestrator';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:148:describe('executePipeline error cascading (B1)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:158:    const result = await executePipeline(config);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:174:    await expect(executePipeline(config)).rejects.toThrow('embedding service unavailable');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:184:    const result = await executePipeline(config);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:201:    const result = await executePipeline(config);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:216:    const result = await executePipeline(config);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:227:    const result = await executePipeline(config);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:242:    const result = await executePipeline(config);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/embedding-expansion.vitest.ts:143:      'how does the embedding based query expansion pipeline handle recall precision tradeoffs';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/embedding-expansion.vitest.ts:147:      makeMockMemory(1, 'recall precision tradeoff semantic retrieval pipeline'),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/embedding-expansion.vitest.ts:182:    const moderateQuery = 'embedding expansion retrieval pipeline architecture';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/embedding-expansion.vitest.ts:326:    const query = 'complex multi word query for semantic testing expansion pipeline';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/embedding-expansion.vitest.ts:344:        content: 'semantic pipeline query expansion complex',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/embedding-expansion.vitest.ts:352:    const query = 'semantic pipeline query expansion complex architecture retrieval deep search';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/embedding-expansion.vitest.ts:367:      makeMockMemory(2, 'reranking mmr diversity cross-encoder scoring pipeline'),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/embedding-expansion.vitest.ts:398:    const query = 'complex multi word query for semantic retrieval expansion testing pipeline';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-surrogates.vitest.ts:5:// surrogate question generation, full pipeline, storage round-trip,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-surrogates.vitest.ts:483:      surrogateQuestions: ['How do I configure search pipelines?'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-surrogates.vitest.ts:485:    const result = matchSurrogates('configure search pipelines', surrogates);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-surrogates.vitest.ts:777:The search pipeline uses Reciprocal Rank Fusion (RRF) to combine results.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-surrogates.vitest.ts:779:## How to configure the pipeline
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-surrogates.vitest.ts:801:    const matchResult = matchSurrogates('How do I configure RRF pipeline?', loaded!);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-prefix-matching.vitest.ts:46: * the full formatSearchResults pipeline.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-eval-channels.vitest.ts:27:vi.mock('../lib/search/pipeline', () => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-eval-channels.vitest.ts:28:  executePipeline: vi.fn(async () => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-eval-channels.vitest.ts:118:    const response = await handleMemorySearch({ query: 'investigate auth pipeline' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:184:import { executeStage1 } from '../lib/search/pipeline/stage1-candidate-gen';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:187:import type { PipelineConfig } from '../lib/search/pipeline/types';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:23:    doc: '01-1-search-pipeline-features-speckit.md',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:28:    doc: '01-1-search-pipeline-features-speckit.md',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:33:    doc: '01-1-search-pipeline-features-speckit.md',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:38:    doc: '01-1-search-pipeline-features-speckit.md',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:65:  '01-1-search-pipeline-features-speckit.md',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:78:const canonicalHydraAliases = {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:90:  legacyEnv: keyof typeof canonicalHydraAliases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:93:  const canonicalEnv = canonicalHydraAliases[legacyEnv];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:95:    `\\|\\s+\`(?:${escapeRegExp(canonicalEnv)}\`\\s+\\/\\s+\`)?${escapeRegExp(legacyEnv)}\`\\s+\\|\\s+\`${escapeRegExp(defaultValue)}\`\\s+\\|`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:131:    it('T508: PE helpers exported from canonical pe-gating module', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-learning-history.vitest.ts:17:    it('T530-1b: Missing taskId rejected in pipeline', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-learning-history.vitest.ts:82:    it('T530-6b: Full learning pipeline functions exported', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:186:      // But the pipeline code would not call it
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:192:      // Module-level function still works, but pipeline gate prevents calling it
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:200:      // MPAB takes scores as-is from the fusion pipeline (post-RRF, post-normalization)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:217:      // This tests the pipeline's filter logic
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:227:      // (tested at pipeline level, not module level)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:501:The quality gate runs BEFORE reconsolidation in the save pipeline.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:783:  it('S4-INT-21: MPAB module functions still work (but pipeline does not call them when flag OFF)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:846:    // AND reconsolidation would merge. The pipeline order matters:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:488:      const canonicalDir = path.join(TMP_DIR, 'canonical-specs');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:489:      fs.mkdirSync(canonicalDir, { recursive: true });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:491:      const canonicalFile = path.join(canonicalDir, 'memory-symlink.md');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:492:      fs.writeFileSync(canonicalFile, 'symlink content', 'utf-8');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:497:          fs.symlinkSync(canonicalDir, aliasDir, 'dir');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:509:        filePath: canonicalFile,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-integration.vitest.ts:2:// Validates the full search pipeline works with the graph channel
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:339:  // This integration hits the real chunk/index pipeline and can share a worker
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:502:      'This sprint covers important improvements to the retrieval pipeline.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:163:    expect(result.trace?.pipelineStages).toEqual(['candidate', 'fallback']);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage2b-enrichment.vitest.ts:16:import { executeStage2bEnrichment } from '../lib/search/pipeline/stage2b-enrichment';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/validation-metadata.vitest.ts:23:import type { PipelineRow } from '../lib/search/pipeline/types';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/validation-metadata.vitest.ts:24:import { __testables as stage2Testables } from '../lib/search/pipeline/stage2-fusion';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:390:  it('T11: recordTracePayload stores canonical trace payload', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:425:  it('T11b: toJSON excludes non-canonical telemetry fields', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:20:import { executePipeline } from '../lib/search/pipeline/index.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:33:vi.mock('../lib/search/pipeline/index.js', () => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:34:  executePipeline: vi.fn(),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:118:    vi.mocked(executePipeline).mockReset();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:144:    vi.mocked(executePipeline).mockImplementation(async (config) => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:149:      return result as unknown as Awaited<ReturnType<typeof executePipeline>>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:193:    expect(vi.mocked(executePipeline)).toHaveBeenCalledTimes(2);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:218:    expect(vi.mocked(executePipeline)).not.toHaveBeenCalled();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:227:    vi.mocked(executePipeline).mockResolvedValue({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:229:    } as unknown as Awaited<ReturnType<typeof executePipeline>>);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:255:    const initialCallCount = vi.mocked(executePipeline).mock.calls.length;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:259:    expect(vi.mocked(executePipeline)).toHaveBeenCalledTimes(initialCallCount + 1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:283:    vi.mocked(executePipeline).mockResolvedValue({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:285:    } as unknown as Awaited<ReturnType<typeof executePipeline>>);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:318:    vi.mocked(executePipeline).mockResolvedValue({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:320:    } as unknown as Awaited<ReturnType<typeof executePipeline>>);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:355:    vi.mocked(executePipeline).mockResolvedValue({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:357:    } as unknown as Awaited<ReturnType<typeof executePipeline>>);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:404:    vi.mocked(executePipeline).mockResolvedValue({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:406:    } as unknown as Awaited<ReturnType<typeof executePipeline>>);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:452:    vi.mocked(executePipeline).mockResolvedValue({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:454:    } as unknown as Awaited<ReturnType<typeof executePipeline>>);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:487:    vi.mocked(executePipeline).mockResolvedValue({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:489:    } as unknown as Awaited<ReturnType<typeof executePipeline>>);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:521:    vi.mocked(executePipeline).mockResolvedValue({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:523:    } as unknown as Awaited<ReturnType<typeof executePipeline>>);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:565:    vi.mocked(executePipeline).mockResolvedValue({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:567:    } as unknown as Awaited<ReturnType<typeof executePipeline>>);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-canonicalization.vitest.ts:12:  canonicalizeForSpecFolderExtraction,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-canonicalization.vitest.ts:14:} from '../lib/utils/canonical-path';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-canonicalization.vitest.ts:47:describe('canonicalizeForSpecFolderExtraction', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-canonicalization.vitest.ts:51:    const canonSym = canonicalizeForSpecFolderExtraction(symlinkPath);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-canonicalization.vitest.ts:52:    const canonReal = canonicalizeForSpecFolderExtraction(realPath);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-canonicalization.vitest.ts:56:  it('already-canonical paths are unchanged', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-canonicalization.vitest.ts:58:    const result = canonicalizeForSpecFolderExtraction(realPath);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-canonicalization.vitest.ts:64:    const result = canonicalizeForSpecFolderExtraction(atomicPath);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-canonicalization.vitest.ts:73:    const result = canonicalizeForSpecFolderExtraction(deepPath);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-canonicalization.vitest.ts:79:    const result = canonicalizeForSpecFolderExtraction(realPath);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-canonicalization.vitest.ts:131:  it('already-canonical paths produce same result (no regression)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-canonicalization.vitest.ts:132:    const canonicalPath = '/project/specs/003-auth/memory/session.md';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-canonicalization.vitest.ts:133:    const result = extractSpecFolder(canonicalPath);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-canonicalization.vitest.ts:152:  it('symlink and real path produce same canonical key', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-canonicalization.vitest.ts:167:// Without canonicalization, extractSpecFolder returns the alias, not the real name.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-canonicalization.vitest.ts:192:  it('naive regex WITHOUT canonicalization would return wrong result', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-canonicalization.vitest.ts:198:    // Fix: canonicalized extraction returns the real name
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-canonicalization.vitest.ts:241:    const result = canonicalizeForSpecFolderExtraction(loopPath);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-canonicalization.vitest.ts:249:    const result = canonicalizeForSpecFolderExtraction(atomicPath);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/progressive-validation.vitest.ts:2:// Tests for progressive-validate.sh -- a 4-level validation pipeline:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/progressive-validation.vitest.ts:45:  pipelineLevel?: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/progressive-validation.vitest.ts:210: * contains "pipelineLevel".
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/progressive-validation.vitest.ts:213:  // The progressive report is emitted last and contains "pipelineLevel"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/progressive-validation.vitest.ts:214:  // Try to find the last complete JSON object containing pipelineLevel
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/progressive-validation.vitest.ts:230:          if (candidate.includes('pipelineLevel')) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/progressive-validation.vitest.ts:589:      expect(report.pipelineLevel).toBe(4);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/progressive-validation.vitest.ts:893:      expect(report.pipelineLevel).toBe(4);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:372:  describe('T009: Cross-path session consistency via spec folder canonicalization', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-architecture-remediation.vitest.ts:7:import { __testables as stage2Testables } from '../lib/search/pipeline/stage2-fusion';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-architecture-remediation.vitest.ts:8:import type { PipelineRow } from '../lib/search/pipeline/types';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-architecture-remediation.vitest.ts:20:        '<!-- ANCHOR:DECISION-pipeline-004 -->',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-architecture-remediation.vitest.ts:22:        '<!-- /ANCHOR:DECISION-pipeline-004 -->',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:41:      canonical_file_path,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-normalizer.vitest.ts:339:// NormalizeContentForEmbedding — full pipeline
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-normalizer.vitest.ts:352:  it('S1-E-03: strips frontmatter in the full pipeline', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-normalizer.vitest.ts:358:  it('S1-E-04: strips ANCHOR markers in the full pipeline', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-normalizer.vitest.ts:365:  it('S1-E-05: strips HTML comments in the full pipeline', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-normalizer.vitest.ts:419:  it('S1-E-12: end-to-end pipeline with real memory-style markdown', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-normalizer.vitest.ts:511:  it('S1-B-03: current implementation matches the embedding pipeline output', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-normalizer.vitest.ts:512:    // BM25 pipeline is explicitly identical to embedding at present (per source comments)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-normalizer.vitest.ts:555:  it('S1-X-02: content with only frontmatter yields empty string after full pipeline', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-normalizer.vitest.ts:573:  it('S1-X-04: whitespace-only content yields empty string after full pipeline', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-normalizer.vitest.ts:577:  it('S1-X-05: pipeline is idempotent — running twice yields the same result', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-normalizer.vitest.ts:584:  it('S1-X-06: string with only HTML comments yields empty string after full pipeline', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-decomposer.vitest.ts:53:    expect(isMultiFacet('what is the pipeline configuration also how does scoring work')).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-decomposer.vitest.ts:57:    expect(isMultiFacet('what is the retrieval pipeline and how does it score results')).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-decomposer.vitest.ts:61:    expect(isMultiFacet('what are the retrieval pipeline stages')).toBe(false);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-decomposer.vitest.ts:73:    expect(isMultiFacet('describe the hybrid search pipeline scoring approach')).toBe(false);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-decomposer.vitest.ts:120:    const facets = decompose('Explain the hybrid search pipeline. Describe the scoring algorithm.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-decomposer.vitest.ts:159:      query: 'retrieval pipeline',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-decomposer.vitest.ts:176:      query: 'retrieval pipeline',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-decomposition.vitest.ts:5:import { __testables } from '../lib/search/pipeline/stage1-candidate-gen';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-decomposition.vitest.ts:6:import type { PipelineRow } from '../lib/search/pipeline/types';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/concept-routing.vitest.ts:54:    const tokens = nounPhrases('how does the embedding retrieval pipeline work');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/concept-routing.vitest.ts:57:    expect(tokens).toContain('pipeline');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/concept-routing.vitest.ts:89:  it('matches "memory" to canonical "memory"', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/concept-routing.vitest.ts:94:  it('matches "memories" to canonical "memory"', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/concept-routing.vitest.ts:99:  it('matches "embedding" to canonical "embedding"', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/concept-routing.vitest.ts:104:  it('matches "vectors" to canonical "embedding"', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/concept-routing.vitest.ts:109:  it('matches "graph" to canonical "graph"', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/concept-routing.vitest.ts:114:  it('matches "edges" to canonical "graph"', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/concept-routing.vitest.ts:132:  it('deduplicates concepts (multiple aliases -> same canonical)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/concept-routing.vitest.ts:166:    const result = routeQueryConcepts('find memories related to the pipeline');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/concept-routing.vitest.ts:187:    const result = routeQueryConcepts('memory retrieval pipeline');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/concept-routing.vitest.ts:240:    const result = routeQueryConcepts('memory retrieval pipeline search');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts:452:     T038: BM25 integration with hybrid search pipeline
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts:455:  describe('T038: BM25 integration with hybrid search pipeline', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:204:      canonical_file_path,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:252:      canonical_file_path,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:57:  it('canonicalizes session and history spec folders during the v23 upgrade', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:62:    const canonicalSpecFolder = '02--domain/010-feature';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:112:    expect(memoryRow.spec_folder).toBe(canonicalSpecFolder);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:113:    expect(sessionRow.spec_folder).toBe(canonicalSpecFolder);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:115:      { id: 'history-null-folder', spec_folder: canonicalSpecFolder },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:116:      { id: 'history-stale-folder', spec_folder: canonicalSpecFolder },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:278:  it('creates save-path optimization indexes for canonical-path and scoped hash lookups', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:286:        AND name IN ('idx_save_parent_content_hash_scope', 'idx_save_parent_canonical_path')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:293:        name: 'idx_save_parent_canonical_path',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:301:    expect(indexes[0]?.sql).toContain('spec_folder, canonical_file_path, id DESC');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:57:      canonical_name TEXT NOT NULL UNIQUE,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:95:function insertCatalogEntry(db: InstanceType<typeof Database>, canonicalName: string): void {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:96:  db.prepare(`INSERT OR IGNORE INTO entity_catalog (canonical_name) VALUES (?)`)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:97:    .run(canonicalName);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:185:    it('groups entities across memories by canonical name', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:246:      expect(matches[0].canonicalName).toBe('shared entity');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:271:      const names = matches.map((m) => m.canonicalName).sort();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:283:      expect(matches[0].canonicalName).toBe('tf idf score');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:305:        canonicalName: 'shared entity',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:318:        INSERT INTO entity_catalog (canonical_name, aliases, entity_type, memory_count)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:324:      expect(matches[0].canonicalName).toBe('tf idf');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:338:        canonicalName: 'test entity',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:355:        canonicalName: 'test entity',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:371:        canonicalName: 'cross doc entity',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:387:        canonicalName: 'memory system',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:404:        canonicalName: 'duplicate test',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:425:        canonicalName: 'batched-count-normal',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:456:        canonicalName: 'single-item-batch',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:480:        canonicalName: 'large-batch-entity',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:511:        canonicalName: 'over limit entity',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:532:        canonicalName: 'dense graph entity',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:558:        canonicalName: 'boundary density entity',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:806:        INSERT INTO entity_catalog (canonical_name, aliases, entity_type, memory_count)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:25:describe('T005-T008: event-based decay pipeline', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser-extended.vitest.ts:218:    it('T06: canonical types map to themselves', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser-extended.vitest.ts:219:      const canonicals: ContextType[] = ['implementation', 'research', 'planning', 'general'];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser-extended.vitest.ts:220:      const allSelfMap = canonicals.every(k => map[k] === k);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser-extended.vitest.ts:224:    it('T07: aliases map to correct canonical types', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts:188:        description: 'Hybrid RAG fusion pipeline combining vector and keyword retrieval',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts:189:        keywords: ['hybrid', 'rag', 'fusion', 'pipeline', 'combining', 'vector', 'keyword', 'retrieval'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:8:// - Compaction pipeline integration (mergeCompactBrief)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:743:describe('compaction pipeline integration', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:793:  it('pipeline timeout enforcement — mergeCompactBrief completes within 2s under large input', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts:194:    const canonicalSpecDir = path.join(openCodeSpecsDir, '001-auth');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts:195:    fs.mkdirSync(canonicalSpecDir, { recursive: true });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts:196:    fs.writeFileSync(path.join(canonicalSpecDir, 'spec.md'), '# Authentication System', 'utf-8');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts:225:      'The deployment pipeline runs integration tests before merging.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts:239:      'Sentence five about continuous integration pipelines.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts:293:      'Retrieval pipelines combine multiple search channels.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts:326:      'Alpha sentence about search pipelines and indexing strategies.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts:355:      'The indexing pipeline processes documents in batch mode.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts:451:    await generateAndStoreSummary(db, 1, 'The search pipeline retrieves documents using vector similarity over embedding space.', mockEmbeddingFn);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts:456:    const queryEmb = await mockEmbeddingFn('search pipeline vector similarity retrieval');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/encoding-intent.vitest.ts:68:      'This is a memory about a decision we made regarding the search pipeline.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/encoding-intent.vitest.ts:83:    const content = 'The pipeline was refactored to use a four-stage architecture.';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/encoding-intent.vitest.ts:93:      '- Adopted pipeline v2 architecture',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/encoding-intent.vitest.ts:205:      'tags: [pipeline, indexing, metadata]',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/encoding-intent.vitest.ts:225:      '  pipeline_v2: true',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/encoding-intent.vitest.ts:243:      'We decided to use the pipeline v2 architecture for the search system.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/encoding-intent.vitest.ts:249:      'pipeline.execute(query);',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/encoding-intent.vitest.ts:346:      'concluded that a four-stage pipeline would best serve our needs.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/encoding-intent.vitest.ts:353:      'A simple example of invoking the pipeline:',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/encoding-intent.vitest.ts:356:      'pipeline.run(query)',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator-swap.vitest.ts:133:      canonical_file_path TEXT,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator-swap.vitest.ts:200:      canonical_file_path,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator-swap.vitest.ts:257:      canonical_file_path,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator-swap.vitest.ts:290:      canonical_file_path,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-search-pipeline.vitest.ts:45:    it('T525-1: Search pipeline modules loaded', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-search-pipeline.vitest.ts:61:    it('T525-2: Valid args accepted by pipeline', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-search-pipeline.vitest.ts:89:    it('T525-3: Empty query behavior at pipeline entry', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-search-pipeline.vitest.ts:252:  it('C138-T2: pipeline flags are independent (toggling one does not affect others)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts:43:          canonical_file_path TEXT,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts:71:        CREATE INDEX idx_save_parent_canonical_path
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts:72:          ON memory_index(spec_folder, canonical_file_path, id DESC)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/score-resolution-consistency.vitest.ts:8:import { resolveEffectiveScore } from '../lib/search/pipeline/types';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/score-resolution-consistency.vitest.ts:9:import type { PipelineRow, Stage4ReadonlyRow } from '../lib/search/pipeline/types';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/score-resolution-consistency.vitest.ts:10:import { compareDeterministicRows } from '../lib/search/pipeline/ranking-contract';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/score-resolution-consistency.vitest.ts:11:import { extractScoringValue } from '../lib/search/pipeline/stage4-filter';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-trigger-pipeline.vitest.ts:28:    it('T527-1: Trigger pipeline modules loaded', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:1163:  it('runs end-to-end pipeline and returns comprehensive report', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:1257:  it('evaluates promotion gate across multiple pipeline runs', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feedback-denylist.vitest.ts:49:  const technicalTerms = ['vector', 'pipeline', 'database', 'embedding', 'reranker', 'checkpoint', 'ablation'];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-ops-hardening.vitest.ts:9:  it('normalizes graph freshness into canonical readiness', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-ops-hardening.vitest.ts:22:    expect(contract.readiness.canonical).toBe('stale');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-combiner.vitest.ts:108:    it('returns 8 features in canonical order', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-combiner.vitest.ts:706:    it('full pipeline: train, predict, LOOCV, SHAP, persist, shadow', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:452:      const canonicalSpecsRoot = path.join(workspaceRoot, '.opencode', 'specs');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:453:      const memoryDir = path.join(canonicalSpecsRoot, '200-dedup-check', 'memory');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:459:        fs.symlinkSync(canonicalSpecsRoot, linkedSpecsRoot, 'dir');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:41:const STAGE1_SOURCE = fs.readFileSync(path.join(SERVER_ROOT, 'lib', 'search', 'pipeline', 'stage1-candidate-gen.ts'), 'utf-8');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:42:const STAGE2_SOURCE = fs.readFileSync(path.join(SERVER_ROOT, 'lib', 'search', 'pipeline', 'stage2-fusion.ts'), 'utf-8');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:304:  describe('Review and access update pipeline', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-roadmap-flags.vitest.ts:111:  it('honors legacy Hydra adaptive-ranking enables even when the canonical flag is unset', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-comparison.vitest.ts:5:// To full pipeline (all 5 channels) while reducing simulated latency.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-comparison.vitest.ts:10:// - Jaccard similarity of result IDs across routed vs full pipeline
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-comparison.vitest.ts:69:  'configure deployment pipeline settings',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-comparison.vitest.ts:95:  'create an automated data pipeline for ETL processing with error recovery idempotency and observability instrumentation',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-comparison.vitest.ts:110: * In a real system this would invoke the actual search pipeline.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-comparison.vitest.ts:215:  it('T9: full pipeline (ALL_CHANNELS) has 5 channels', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-comparison.vitest.ts:231:  it('T11: simple queries simulated latency is ~60% faster than full pipeline', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-comparison.vitest.ts:276:  it('T15: complex-tier routed results have high overlap with full pipeline', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-comparison.vitest.ts:277:    // Complex routing uses all 5 channels = identical to full pipeline
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-comparison.vitest.ts:294:  it('T16: simple-tier results share core overlap with full pipeline', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-comparison.vitest.ts:295:    // Simple uses vector + fts (subset of full pipeline)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-comparison.vitest.ts:358:  it('T21: flag disabled routes ALL queries to full pipeline (5 channels)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/embedding-pipeline-weighting.vitest.ts:32:import { generateOrCacheEmbedding } from '../handlers/save/embedding-pipeline';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/embedding-pipeline-weighting.vitest.ts:61:      'General implementation notes for the indexing pipeline and save path.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/embedding-pipeline-weighting.vitest.ts:82:describe('Embedding pipeline weighting', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:25:vi.mock('../lib/search/pipeline', () => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:26:  executePipeline: vi.fn(async () => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:147:    it('1. All flags disabled: scoring pipeline produces valid 0-1 scores', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:188:    it('2. All flags enabled: pipeline runs all stages without errors', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:287:        'how does the cross encoder reranker work with the hybrid search pipeline and vector index',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:476:    it('13. Single result: pipeline works with just 1 result', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:572:    it('16. Full pipeline: query → classify → budget → fusion → score → truncate', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:578:      const query = 'fix the memory search scoring bug in hybrid pipeline';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:597:        makeRrfItem(2, { title: 'Scoring pipeline' }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:601:        makeRrfItem(2, { title: 'Scoring pipeline' }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:33:const TEST_DB_DIR = path.join(os.tmpdir(), `speckit-pipeline-enforcement-${process.pid}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:35:const FIXTURE_ROOT = path.join(process.cwd(), 'tmp-test-fixtures', 'specs', '998-pipeline-enforcement');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:64:    description = 'Durable enforcement fixture that validates the full save pipeline rejects malformed content at every gate.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:65:    triggerPhrases = ['pipeline-enforcement', 'save-pipeline-test', 'memory-gate-validation', 'enforcement-fixture'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:81:        title: 'Observation: pipeline gate ordering',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:82:        narrative: 'The save pipeline enforces gates in strict sequence: parser validation, quality loop scoring, sufficiency evaluation, template contract validation, and save quality gate. Each gate blocks downstream processing on failure.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:131:| Fixture Type | pipeline-enforcement |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:140:Continue validating the memory save pipeline enforcement test suite to ensure all six gates properly reject malformed content without allowing bypass.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:146:  mandatorySections['canonical-docs'] = `
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:147:${removeAnchors.includes('canonical-docs') ? '' : '<!-- ANCHOR:canonical-docs -->'}
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:154:${removeAnchors.includes('canonical-docs') ? '' : '<!-- /ANCHOR:canonical-docs -->'}
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:171:This pipeline enforcement fixture validates that every gate in the memory save pipeline correctly rejects malformed content. The gates include parser validation, quality loop scoring, sufficiency evaluation, template contract validation, and the save quality gate.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:182:- Validated all six enforcement gates in the save pipeline
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:214:- Re-run the pipeline enforcement suite and the full MCP package test suite after changing the save contract.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:226:session_id: "pipeline-enforcement-fixture"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:249:${mandatorySections['canonical-docs'] ?? ''}
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:281:  const likePattern = '%998-pipeline-enforcement%';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:334:  it('accepts a fully valid memory through the entire pipeline', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:386:    // Whitespace-only content is > 5 chars raw, so parser passes but pipeline rejects at sufficiency
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:485:  it('quality loop rejection blocks downstream sufficiency evaluation in pipeline', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:528:      triggerPhrases: ['test-trigger', 'enforcement', 'pipeline', 'gates'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:580:      triggerPhrases: ['pipeline-enforcement'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:583:      decisions: ['Decided to enforce the pipeline gate ordering for maximum safety and reliability in production environments.'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:596:      triggerPhrases: ['pipeline-enforcement'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:599:      decisions: ['Decided to validate pipeline gates in strict sequence.'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:618:      observations: [{ title: 'Observation: gate ordering', narrative: `Validated ${longDescription} the complete pipeline gate ordering.` }],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:619:      decisions: ['Decided to implement the pipeline enforcement test suite with comprehensive gate coverage.'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:640:      decisions: ['Decided to implement comprehensive pipeline gate validation.'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:785:      specFolder: '998-pipeline-enforcement',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:810:      specFolder: '998-pipeline-enforcement',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:829:      specFolder: '998-pipeline-enforcement',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:846:      specFolder: '998-pipeline-enforcement',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:861:      specFolder: '998-pipeline-enforcement',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:895:      triggerPhrases: ['pipeline-enforcement', 'save-pipeline-test', 'memory-gate-validation', 'enforcement-fixture'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:904:      triggerPhrases: ['pipeline-enforcement'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:922:      triggerPhrases: ['pipeline-enforcement'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:927:      observations: [{ title: 'Observation: pipeline test', narrative: 'Validated the complete pipeline gate ordering for comprehensive enforcement coverage.' }],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:953:      specFolder: '998-pipeline-enforcement',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:974:    // In the actual pipeline (prepareParsedMemoryForIndexing), if quality loop rejects,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:976:    // We verify by checking that the pipeline result is 'rejected' with quality loop reason
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:1202:      '998-pipeline-enforcement',

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts | sed -n '320,380p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts | sed -n '120,180p;248,304p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   320	    const { executeStage2 } = await import('../lib/search/pipeline/stage2-fusion');
   321	    const result = await executeStage2(createStage2Input([
   322	      { id: 1, score: 0.8, similarity: 80 },
   323	      { id: 2, score: 0.5, similarity: 50 },
   324	    ]));
   325	
   326	    expect(mockSpreadActivation).toHaveBeenCalledWith([1, 2]);
   327	    expect(mockGetRelatedMemoryCounts).toHaveBeenCalledWith([2]);
   328	    const boosted = result.scored.find((row) => row.id === 2);
   329	    expect(boosted?.score).toBeCloseTo(0.55, 9);
   330	  });
   331	
   332	  it('batches adaptive access signal writes into a single transaction', async () => {
   333	    mockGetAdaptiveMode.mockReturnValue('shadow');
   334	
   335	    const insertRun = vi.fn();
   336	    const prepare = vi.fn().mockReturnValue({ run: insertRun });
   337	    const transaction = vi.fn((callback: (rows: Array<Record<string, unknown>>) => void) =>
   338	      (rows: Array<Record<string, unknown>>) => callback(rows)
   339	    );
   340	    const mockDb = { prepare, transaction };
   341	    mockRequireDb.mockReturnValue(mockDb);
   342	
   343	    const { executeStage2 } = await import('../lib/search/pipeline/stage2-fusion');
   344	    const input = createStage2Input([
   345	      { id: 1, score: 0.9, similarity: 90 },
   346	      { id: 2, score: 0.8, similarity: 80 },
   347	    ]);
   348	    input.config.trackAccess = true;
   349	
   350	    await executeStage2(input);
   351	
   352	    expect(mockGetAdaptiveMode).toHaveBeenCalledTimes(1);
   353	    expect(mockEnsureAdaptiveTables).toHaveBeenCalledTimes(1);
   354	    expect(mockEnsureAdaptiveTables).toHaveBeenCalledWith(mockDb);
   355	    expect(prepare).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO adaptive_signal_events'));
   356	    expect(transaction).toHaveBeenCalledTimes(1);
   357	    expect(insertRun).toHaveBeenCalledTimes(2);
   358	    expect(insertRun).toHaveBeenNthCalledWith(1, 1, 'access', 1.0, 'graph rollout regression', '', '{}');
   359	    expect(insertRun).toHaveBeenNthCalledWith(2, 2, 'access', 1.0, 'graph rollout regression', '', '{}');
   360	  });
   361	
   362	  it('reports sessionBoostApplied as "enabled" when boost runs but finds no data', async () => {
   363	    vi.doMock('../lib/search/session-boost', () => ({
   364	      applySessionBoost: <T>(rows: T[]) => ({
   365	        results: rows,
   366	        metadata: { applied: false, enabled: true, sessionId: 'test-001', boostedCount: 0, maxBoostApplied: 0 },
   367	      }),
   368	    }));
   369	
   370	    const { executeStage2 } = await import('../lib/search/pipeline/stage2-fusion');
   371	    const input = createStage2Input([
   372	      { id: 1, score: 0.5, similarity: 50 },
   373	    ]);
   374	    input.config.searchType = 'hybrid';
   375	    input.config.enableSessionBoost = true;
   376	    input.config.sessionId = 'test-001';
   377	
   378	    const result = await executeStage2(input);
   379	    expect(result.metadata.sessionBoostApplied).toBe('enabled');
   380	  });

 succeeded in 0ms:
   120	      const rValues = [0.0, 0.2, 0.4, 0.6, 0.8, 0.9, 1.0];
   121	      const bonuses = rValues.map(r => Math.max(0, (0.9 - r) * 0.5));
   122	      for (let i = 1; i < bonuses.length; i++) {
   123	        expect(bonuses[i]).toBeLessThanOrEqual(bonuses[i - 1]);
   124	      }
   125	    });
   126	
   127	    it('T617: Difficulty bonus formula matches spec', () => {
   128	      const actual = Math.max(0, (0.9 - 0.5) * 0.5);
   129	      expect(Math.abs(actual - 0.2)).toBeLessThan(0.001);
   130	    });
   131	
   132	    it('T618: Combined boost = base_stability * (1 + difficultyBonus)', () => {
   133	      const baseStability = 2.0;
   134	      const difficultyBonus = Math.max(0, (0.9 - 0.2) * 0.5);
   135	      const combined = baseStability * (1 + difficultyBonus);
   136	      expect(Math.abs(combined - 2.7)).toBeLessThan(0.01);
   137	    });
   138	
   139	    it('T619: FSRS stability bounds (0.1 to 365) respected', () => {
   140	      const reviewed = fsrsScheduler.processReview({
   141	        stability: 0.01,
   142	        difficulty: 5,
   143	        lastReview: null,
   144	        reviewCount: 0,
   145	      }, fsrsScheduler.GRADE_AGAIN);
   146	      expect(reviewed.stability).toBeGreaterThanOrEqual(fsrsScheduler.MIN_STABILITY);
   147	      expect(fsrsScheduler.calculateRetrievability(365, 30)).toBeLessThanOrEqual(1);
   148	    });
   149	
   150	    it('T620: Negative R handled in bonus calculation', () => {
   151	      const bonus = Math.max(0, (0.9 - (-0.5)) * 0.5);
   152	      expect(bonus).toBeGreaterThan(0);
   153	    });
   154	  });
   155	
   156	  describe('T621-T630 - Multi-Concept Search', () => {
   157	    it('T621: handleMemorySearch function exported', () => {
   158	      expect(typeof memorySearchHandler.handleMemorySearch).toBe('function');
   159	    });
   160	
   161	    it('T622: Concepts array validation exists', () => {
   162	      expect(MEMORY_SEARCH_SOURCE).toContain('Array.isArray(concepts)');
   163	    });
   164	
   165	    it('T623: Maximum 5 concepts enforced', () => {
   166	      expect(VECTOR_INDEX_QUERIES_SOURCE).toContain('concepts.length > 5');
   167	      expect(VECTOR_INDEX_QUERIES_SOURCE).toContain('Multi-concept search requires 2-5 concepts');
   168	    });
   169	
   170	    it('T624: Each concept generates embedding', () => {
   171	      expect(STAGE1_SOURCE).toContain('generateQueryEmbedding(concept)');
   172	    });
   173	
   174	    it('T625: multiConceptSearch available', () => {
   175	      expect(typeof vectorIndex.multiConceptSearch).toBe('function');
   176	    });
   177	
   178	    it('T626: Multi-concept requests are labeled as multi_concept search type', () => {
   179	      expect(MEMORY_SEARCH_SOURCE).toContain("searchType: (hasValidConcepts && concepts!.length >= 2)");
   180	      expect(MEMORY_SEARCH_SOURCE).toContain("'multi-concept'");
   248	
   249	    it('T639: searchWithFallback falls back to FTS after empty hybrid results', () => {
   250	      expect(HYBRID_SEARCH_SOURCE).toContain('const ftsResults = ftsSearch(query, options);');
   251	      expect(HYBRID_SEARCH_SOURCE).toContain('if (ftsResults.length > 0) return ftsResults;');
   252	    });
   253	
   254	    it('T640: searchWithFallback falls back to BM25 after empty FTS results', () => {
   255	      expect(HYBRID_SEARCH_SOURCE).toContain('const bm25Results = bm25Search(query, options);');
   256	      expect(HYBRID_SEARCH_SOURCE).toContain('if (bm25Results.length > 0) return bm25Results;');
   257	    });
   258	  });
   259	
   260	  describe('T641-T650 - Review Count & Timestamp', () => {
   261	    it('T641: review_count column exists in schema', () => {
   262	      expect(VECTOR_INDEX_SCHEMA_SOURCE).toContain('review_count INTEGER DEFAULT 0');
   263	    });
   264	
   265	    it('T642: last_review column exists', () => {
   266	      expect(VECTOR_INDEX_SCHEMA_SOURCE).toContain('last_review TEXT');
   267	    });
   268	
   269	    it('T643: access_count column exists', () => {
   270	      expect(VECTOR_INDEX_SCHEMA_SOURCE).toContain('access_count INTEGER DEFAULT 0');
   271	    });
   272	
   273	    it('T644: last_accessed column exists', () => {
   274	      expect(VECTOR_INDEX_SCHEMA_SOURCE).toContain('last_accessed INTEGER DEFAULT 0');
   275	    });
   276	
   277	    it('T645: Default review_count is 0', () => {
   278	      expect(VECTOR_INDEX_SCHEMA_SOURCE).toMatch(/review_count INTEGER DEFAULT 0/);
   279	    });
   280	
   281	    it('T646: review_count increments correctly', () => {
   282	      expect(STAGE2_SOURCE).toContain('review_count = review_count + 1');
   283	    });
   284	
   285	    it('T647: Multiple increments accumulate', () => {
   286	      expect(STAGE2_SOURCE).not.toContain('review_count = 1');
   287	    });
   288	
   289	    it('T648: last_review timestamp updates', () => {
   290	      expect(STAGE2_SOURCE).toContain('last_review = CURRENT_TIMESTAMP');
   291	    });
   292	
   293	    it('T649: Timestamp parseable as Date', () => {
   294	      const nextReviewDate = fsrsScheduler.getNextReviewDate(5);
   295	      expect(Number.isNaN(new Date(nextReviewDate).getTime())).toBe(false);
   296	    });
   297	
   298	    it('T650: last_accessed stores epoch timestamp', () => {
   299	      expect(ACCESS_TRACKER_SOURCE).toContain('const now = Date.now();');
   300	      expect(ACCESS_TRACKER_SOURCE).toContain('last_accessed = ?');
   301	    });
   302	  });
   303	
   304	  describe('Review and access update pipeline', () => {

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/bm25-baseline.vitest.ts | sed -n '430,520p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts | sed -n '90,160p;380,430p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    90	      expect(result).toBeDefined();
    91	      const payload = parseEnvelope(result);
    92	      expect(getEnvelopeError(payload) || result.isError).toBeTruthy();
    93	    });
    94	
    95	    it('T516-6: Single concept without query returns MCP error', async () => {
    96	      const result = await handler.handleMemorySearch({ concepts: ['single'] });
    97	      expect(result).toBeDefined();
    98	      const payload = parseEnvelope(result);
    99	      expect(getEnvelopeError(payload) || result.isError).toBeTruthy();
   100	    });
   101	  });
   102	
   103	  describe('Parameter Defaults', () => {
   104	    it('T516-7: Handler accepts args object', () => {
   105	      expect(typeof handler.handleMemorySearch).toBe('function');
   106	      expect(handler.handleMemorySearch.length).toBeGreaterThanOrEqual(0);
   107	    });
   108	
   109	    it('T516-8: Default export includes handleMemorySearch', () => {
   110	      const moduleWithDefault = handler as MemorySearchModule;
   111	      const hasDefault = typeof moduleWithDefault.default?.handleMemorySearch === 'function';
   112	      const hasNamed = typeof handler.handleMemorySearch === 'function';
   113	      expect(hasDefault || hasNamed).toBe(true);
   114	    });
   115	  });
   116	});
   117	
   118	describe('C138: Evidence Gap Warning Injection', () => {
   119	  it('C138-T1: evidence gap warning format is valid markdown blockquote', () => {
   120	    const warning = '> **⚠️ EVIDENCE GAP DETECTED:** Retrieved context has low mathematical confidence. Consider first principles.';
   121	    expect(warning).toMatch(/^> \*\*/);
   122	    expect(warning).toContain('EVIDENCE GAP DETECTED');
   123	  });
   124	
   125	  it('C138-T2: warning contains actionable guidance', () => {
   126	    const warning = '> **⚠️ EVIDENCE GAP DETECTED:** Retrieved context has low mathematical confidence. Consider first principles.';
   127	    expect(warning).toContain('first principles');
   128	  });
   129	});
   130	
   131	describe('Packet 010 lexical capability response surface', () => {
   132	  beforeEach(() => {
   133	    vi.spyOn(core, 'checkDatabaseUpdated').mockResolvedValue(false);
   134	    vi.spyOn(toolCache, 'isEnabled').mockReturnValue(true);
   135	    vi.spyOn(toolCache, 'generateCacheKey').mockReturnValue('packet-010-cache-key');
   136	  });
   137	
   138	  afterEach(() => {
   139	    vi.restoreAllMocks();
   140	  });
   141	
   142	  it('P010-T1: handleMemorySearch returns lexicalPath and fallbackState on cached degraded responses', async () => {
   143	    vi.spyOn(toolCache, 'get').mockReturnValue({
   144	      summary: 'Found 1 memories',
   145	      data: {
   146	        count: 1,
   147	        results: [
   148	          {
   149	            id: 101,
   150	            title: 'Fallback-safe result',
   151	            similarity: 0.42,
   152	          },
   153	        ],
   154	        lexicalPath: 'unavailable',
   155	        fallbackState: 'compile_probe_miss',
   156	      },
   157	      hints: [],
   158	    });
   159	
   160	    const response = await handler.handleMemorySearch({ query: 'fallback-safe query' });
   380	      const output = collapseAndReassembleChunkResults(rows);
   381	      const ids = output.results.map((row) => String(row.id));
   382	      return { output, ids };
   383	    };
   384	
   385	    const withoutContent = runSearch(false);
   386	    const withContent = runSearch(true);
   387	
   388	    expect(withoutContent.ids.length).toBe(new Set(withoutContent.ids).size);
   389	    expect(withContent.ids.length).toBe(new Set(withContent.ids).size);
   390	
   391	    expect(withoutContent.ids).toEqual(withContent.ids);
   392	    expect(withoutContent.output.stats.collapsedChunkHits).toBe(withContent.output.stats.collapsedChunkHits);
   393	    expect(withoutContent.output.results).toHaveLength(withContent.output.results.length);
   394	  });
   395	});
   396	
   397	// Sprint-0 intent weighting guard tests removed — shouldApplyPostSearchIntentWeighting
   398	// Was part of legacy V1 pipeline, removed in 017-refinement-phase-6 Sprint 1.
   399	// V2 pipeline handles intent weighting in Stage 2.

 succeeded in 0ms:
   430	    const result = await runBM25Baseline(mockSearch, { queryLimit: 5 });
   431	
   432	    const { contingencyDecision } = result;
   433	    expect(['PAUSE', 'RATIONALIZE', 'PROCEED']).toContain(contingencyDecision.action);
   434	    expect(['>=0.8', '0.5-0.8', '<0.5']).toContain(contingencyDecision.threshold);
   435	    expect(typeof contingencyDecision.interpretation).toBe('string');
   436	    expect(contingencyDecision.interpretation.length).toBeGreaterThan(0);
   437	    expect(contingencyDecision.bm25MRR).toBe(result.metrics.mrr5);
   438	  });
   439	
   440	  it('T008.12: only invokes the injected searchFn — no side-channel calls', async () => {
   441	    // Verify the runner only calls the injected function and does not attempt
   442	    // To call vector, graph, or trigger search paths (those are controlled by
   443	    // The caller who must disable them before passing the search function).
   444	    const calls: string[] = [];
   445	    const trackingSearch = (query: string, limit: number): BM25SearchResult[] => {
   446	      calls.push(`bm25:${query.slice(0, 10)}`);
   447	      return []; // return empty — metrics will be 0, which is valid
   448	    };
   449	
   450	    const result = await runBM25Baseline(trackingSearch, { queryLimit: 3 });
   451	
   452	    // Should have been called exactly queryLimit times
   453	    expect(calls).toHaveLength(3);
   454	    // All calls should be tagged as bm25 (our tracking tag)
   455	    expect(calls.every(c => c.startsWith('bm25:'))).toBe(true);
   456	    // Metrics are all 0 because empty results never match mapped ground truth IDs
   457	    expect(result.metrics.mrr5).toBe(0);
   458	  });
   459	
   460	  it('T008.12b: timestamp is a valid ISO 8601 string', async () => {
   461	    const mockSearch = makeMockSearchFn(3);
   462	    const result = await runBM25Baseline(mockSearch, { queryLimit: 3 });
   463	
   464	    const parsed = new Date(result.timestamp);
   465	    expect(isNaN(parsed.getTime())).toBe(false);
   466	    expect(result.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
   467	  });
   468	
   469	  it('T008.20: config.k overrides NDCG/Recall but MRR stays at k=5 for contingency', async () => {
   470	    const relevantMemoryByQueryId = new Map<number, number>();
   471	    for (const relevance of GROUND_TRUTH_RELEVANCES) {
   472	      if (relevance.queryId <= 3 && relevance.relevance > 0 && !relevantMemoryByQueryId.has(relevance.queryId)) {
   473	        relevantMemoryByQueryId.set(relevance.queryId, relevance.memoryId);
   474	      }
   475	    }
   476	
   477	    const mockSearch = (query: string, _limit: number): BM25SearchResult[] => {
   478	      const q = GROUND_TRUTH_QUERIES.find(item => item.query === query);
   479	      if (!q) {
   480	        return [{ id: 999_001, score: 1.0, source: 'bm25' }];
   481	      }
   482	      const relevantId = relevantMemoryByQueryId.get(q.id) ?? 999_002;
   483	      return [
   484	        { id: 999_000, score: 1.0, source: 'bm25' }, // non-relevant at rank 1
   485	        { id: relevantId, score: 0.9, source: 'bm25' }, // relevant at rank 2
   486	      ];
   487	    };
   488	
   489	    const baseline = await runBM25Baseline(mockSearch, { queryLimit: 3 });
   490	    const withKOverride = await runBM25Baseline(mockSearch, { queryLimit: 3, k: 1 });
   491	
   492	    expect(withKOverride.metrics.mrr5).toBeCloseTo(baseline.metrics.mrr5, 10);
   493	    expect(withKOverride.contingencyDecision.bm25MRR).toBeCloseTo(baseline.contingencyDecision.bm25MRR, 10);
   494	    expect(withKOverride.metrics.ndcg10).not.toBeCloseTo(baseline.metrics.ndcg10, 10);
   495	    expect(withKOverride.metrics.recall20).not.toBeCloseTo(baseline.metrics.recall20, 10);
   496	  });
   497	
   498	});

codex
The last gap is confirming whether the current system already has a “quality regression” harness we can build on. I’m checking the eval/baseline tests and any direct `memory_validate` coverage, because the strongest recommendation is likely to separate algorithm tests from retrieval-quality regression tests with fixed judged datasets.
exec
/bin/zsh -lc "rg -n \"memory_validate|handleMemoryValidate|wasUseful|promotion|confidence.*updates|validation feedback\" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests -g '*.vitest.ts'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:1281:  it('T024: co-activation promotion happens before confidence truncation drops tail candidates', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:1291:    const promotionDb = createCoactivationPromotionDb();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:1299:    hybridSearch.init(promotionDb, vectorSearch, null);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:1300:    coActivation.init(promotionDb);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:55:      'handleMemoryValidate',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:70:        'handle_memory_validate',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:555:  describe('handleMemoryValidate Validation', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:558:        handler.handleMemoryValidate(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:559:          invalidArgs<Parameters<typeof handler.handleMemoryValidate>[0]>({ wasUseful: true }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:564:    it('T521-V2: Missing wasUseful throws', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:566:        handler.handleMemoryValidate(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:567:          invalidArgs<Parameters<typeof handler.handleMemoryValidate>[0]>({ id: 1 }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:569:      ).rejects.toThrow(/wasUseful.*required/);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:572:    it('T521-V3: Non-boolean wasUseful throws', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:574:        handler.handleMemoryValidate(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:575:          invalidArgs<Parameters<typeof handler.handleMemoryValidate>[0]>({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:577:            wasUseful: 'yes',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:580:      ).rejects.toThrow(/wasUseful.*boolean/);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:584:      await expect(handler.handleMemoryValidate({ id: '7abc', wasUseful: true })).rejects.toThrow(/id.*integer|id.*number/i);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:606:        const response = await handler.handleMemoryValidate({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:608:          wasUseful: true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:266:  it('calls tuneAdaptiveThresholdsAfterEvaluation when adaptive ranking enabled and promotionGate exists', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:310:    expect(vi.mocked(tuneAdaptiveThresholdsAfterEvaluation)).toHaveBeenCalledWith(db, report?.promotionGate);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:344:    expect(report?.promotionGate.ready).toBe(false);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:345:    expect(report?.promotionGate.recommendation).toBe('wait');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:347:    expect(vi.mocked(tuneAdaptiveThresholdsAfterEvaluation)).toHaveBeenCalledWith(db, report?.promotionGate);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:384:  it('handles tuneAdaptiveThresholdsAfterEvaluation errors gracefully when promotionGate exists', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/channel-representation.vitest.ts:72:  // ---- T1: All channels represented — no promotions ----
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/channel-representation.vitest.ts:73:  it('T1: all channels represented in topK — returns no promotions', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/channel-representation.vitest.ts:113:  // ---- T3: Channel missing but its best result is below quality floor — no promotion ----
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/channel-representation.vitest.ts:114:  it('T3: channel missing and best result below quality floor — no promotion', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/channel-representation.vitest.ts:187:  it('T7: feature flag disabled — returns topK unchanged with no promotions', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:15:  { tool: 'memory_validate', handler: 'handleMemoryValidate', layer: 'L4' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:41:  { camel: 'handleMemoryValidate', snake: 'handle_memory_validate' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:13:} from '../lib/search/auto-promotion';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:33:describe('T055: positive-validation semantics for promotion thresholds', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:35:    dbPath = path.join(os.tmpdir(), `promotion-positive-semantics-${Date.now()}-${Math.random()}.sqlite`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:70:    expect(info.promotionProgress.validationsMet).toBe(false);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:80:    expect(negativeResult.promotionEligible).toBe(false);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:88:    expect(positiveResult.promotionEligible).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:91:  it('auto-promotion checks use positive-validation counts (total minus negatives)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking-e2e.vitest.ts:265:        min_signals_for_promotion
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking-e2e.vitest.ts:273:      min_signals_for_promotion: 2,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking-e2e.vitest.ts:277:  it('replays shadow evaluation with real proposal deltas and feedback-driven promotion tuning', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking-e2e.vitest.ts:328:    expect(report?.promotionGate.ready).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking-e2e.vitest.ts:329:    expect(report?.promotionGate.recommendation).toBe('promote');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1426:    it('does not start DB indexing when pending promotion fails before atomic save indexing', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:2:// Tests all 10 safeguards, auto-promotion (T002a), and negative
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:60:} from '../lib/search/auto-promotion';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:742:  it('R11-AP03: below threshold - no promotion (normal with 3 validations)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:750:  it('R11-AP04: below threshold - no promotion (important with 7 validations)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:813:  it('R11-AP12: safeguards cap promotions to 3 per 8-hour rolling window', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:828:    expect(r4.reason).toContain('promotion_window_rate_limited');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:833:  it('R11-AP13: old promotions outside the 8-hour window do not block promotion', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:834:    // Create audit table and seed historical promotion events outside the rolling window.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:836:      CREATE TABLE IF NOT EXISTS memory_promotion_audit (
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:849:        INSERT INTO memory_promotion_audit
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:1010:  // 5.5 handleMemoryValidate
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:1011:  describe('Handler: handleMemoryValidate Happy Path', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:1012:    it('EXT-H10: handleMemoryValidate positive validation', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:1019:        const result = await handler.handleMemoryValidate({ id: 1, wasUseful: true });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:1035:    it('EXT-H11: handleMemoryValidate negative validation', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:1042:        const result = await handler.handleMemoryValidate({ id: 1, wasUseful: false });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:303:        min_signals_for_promotion
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:311:      min_signals_for_promotion: 2,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:370:        min_signals_for_promotion = 6,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:471:      promotionReadyMemories: 1,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:649:  it('tunes thresholds after evaluation and applies them to promotion gating', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:684:    expect(tuning.summary.promotionReadyMemories).toBe(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:730:  it('applies a larger relaxation multiplier when promotion is recommended', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:16:// Confidence scoring with validation and tier promotion
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:188:      expect(result.promotionEligible).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:191:    it('T510-05b: Auto-promotion occurred', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:194:        expect(validation.promotionEligible).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:212:    it('T510-05d: Already-critical memory not eligible for promotion', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-checkpoint-lifecycle.vitest.ts:10:type MemoryValidateArgs = Parameters<typeof checkpointHandler.handleMemoryValidate>[0];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-checkpoint-lifecycle.vitest.ts:70:      await expect(checkpointHandler.handleMemoryValidate({} as MemoryValidateArgs)).rejects.toThrow();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:242:    'handleMemoryValidate',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/channel-enforcement.vitest.ts:17:// T8:  promotions never displace items already in top-3 (appended)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/channel-enforcement.vitest.ts:18:// T9:  quality floor prevents low-quality promotions
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/channel-enforcement.vitest.ts:19:// T10: multiple missing channels → each gets at most 1 promotion
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/channel-enforcement.vitest.ts:162:    // Total results = 5 original + 1 promotion = 6 (g1 already in tail but a new
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/channel-enforcement.vitest.ts:169:  it('T4: promoted results appear in results list and metadata reflects the promotion', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/channel-enforcement.vitest.ts:195:    // The graph promotion uses a raw lexical-style score that would previously
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/channel-enforcement.vitest.ts:219:    // The normalized promotion must no longer outrank the highest fused item.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/channel-enforcement.vitest.ts:242:    // No promotions expected — all channels already represented.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/channel-enforcement.vitest.ts:277:  it('T8: promotions with lower scores are appended after the top-3, not inserted', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/channel-enforcement.vitest.ts:299:  // ---- T9: Quality floor prevents low-quality promotions ----
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/channel-enforcement.vitest.ts:300:  it('T9: quality floor blocks promotions below 0.005, preventing low-quality pollution', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/channel-enforcement.vitest.ts:312:    // No promotions — both channels below quality floor.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/channel-enforcement.vitest.ts:320:  // ---- T10: Multiple missing channels — each gets at most 1 promotion ----
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/channel-enforcement.vitest.ts:321:  it('T10: multiple missing channels — each receives at most 1 promotion', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/channel-enforcement.vitest.ts:334:    // 3 channels missing → 3 promotions max (one per channel)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/channel-enforcement.vitest.ts:353:  it('T11: when router returns ≥2 channels both present in top-k, no promotion is triggered', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/channel-enforcement.vitest.ts:408:  it('T14: all channel result sets empty — no promotions, results pass through', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/channel-enforcement.vitest.ts:425:  it('T15: topK=0 — empty inspection window, full results returned without promotions', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:27:        memory_validate: 1000,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts:97:    it('T-CT08 DB tier updated to critical after promotion', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts:107:    it('T-CT09 updated_at refreshed after promotion', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts:153:    it('T-CT14 ineligible memory tier unchanged after failed promotion', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:170:      'memory_validate',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:295:      'memory_validate', 'memory_save', 'memory_index_scan', 'memory_health',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1474:      { name: 'MemoryValidateArgs', requiredFields: ['id', 'wasUseful'], source: 'toolTypes' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2093:      'memory_validate': '[L4:Mutation]',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-router-channel-interaction.vitest.ts:234:      // After promotion, all 5 channels should be represented
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-router-channel-interaction.vitest.ts:302:      // Fts is under-represented but nothing qualifies for promotion
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:126:        memory_validate: 'L4',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:3:// NDCG/MRR metrics, SQLite logging, weekly tracker, promotion gate,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:1196:    expect(report!.promotionGate).toBeDefined();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:1257:  it('evaluates promotion gate across multiple pipeline runs', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:1278:    expect(report1!.promotionGate.ready).toBe(false);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:1279:    expect(report1!.promotionGate.consecutiveWeeks).toBe(1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:1288:    expect(report2!.promotionGate.ready).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:1289:    expect(report2!.promotionGate.consecutiveWeeks).toBe(2);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:1290:    expect(report2!.promotionGate.recommendation).toBe('promote');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:1407:  it('promotion gate handles regression after improvements', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts:26:  handleMemoryValidate: vi.fn(),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:87:    tool: 'memory_validate',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:88:    handler: 'handleMemoryValidate',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:90:    description: 'missing required id and wasUseful',

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts | sed -n '90,180p;217,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "rg -n \"ablation|Recall@20|recall20|mrr5|ground truth|baseline\" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests -g '*.vitest.ts'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    90	describe('D5 Phase A: result confidence scoring', () => {
    91	  let originalFlag: string | undefined;
    92	
    93	  beforeEach(() => {
    94	    originalFlag = process.env[CONFIDENCE_FLAG];
    95	    process.env[CONFIDENCE_FLAG] = 'true';
    96	  });
    97	
    98	  afterEach(() => {
    99	    if (originalFlag === undefined) {
   100	      delete process.env[CONFIDENCE_FLAG];
   101	    } else {
   102	      process.env[CONFIDENCE_FLAG] = originalFlag;
   103	    }
   104	  });
   105	
   106	  it('assigns high confidence to a result with a large score margin', async () => {
   107	    const envelope = await formatEnvelope([
   108	      makeResult(1, {
   109	        similarity: 96,
   110	        averageSimilarity: 96,
   111	        intentAdjustedScore: 0.94,
   112	        rrfScore: 0.92,
   113	        fts_score: 0.89,
   114	        rerankerScore: 0.91,
   115	        anchorMetadata: [
   116	          { id: 'decision-1', type: 'decision' },
   117	          { id: 'state-1', type: 'state' },
   118	        ],
   119	        graphContribution: {
   120	          sources: ['graph'],
   121	          totalDelta: 0.19,
   122	          injected: true,
   123	        },
   124	        traceMetadata: {
   125	          attribution: {
   126	            vector: [1],
   127	            fts: [1],
   128	            graph: [1],
   129	          },
   130	        },
   131	      }),
   132	      makeResult(2, {
   133	        similarity: 48,
   134	        averageSimilarity: 48,
   135	        intentAdjustedScore: 0.42,
   136	        rrfScore: 0.4,
   137	        fts_score: 0.35,
   138	        rerankerScore: 0.34,
   139	        anchorMetadata: [{ id: 'note-1', type: 'note' }],
   140	      }),
   141	    ]);
   142	
   143	    const confidence = getResultConfidence(envelope, 1);
   144	    expect(confidence.label).toBe('high');
   145	    expect(confidence.value).toBeGreaterThan(0.7);
   146	    expect(confidence.drivers).toContain('large_margin');
   147	  });
   148	
   149	  it('boosts confidence when multiple channels agree on the top result', async () => {
   150	    const agreementEnvelope = await formatEnvelope([
   151	      makeResult(1, {
   152	        similarity: 88,
   153	        averageSimilarity: 88,
   154	        intentAdjustedScore: 0.82,
   155	        rrfScore: 0.8,
   156	        fts_score: 0.79,
   157	        rerankerScore: 0.78,
   158	        anchorMetadata: [
   159	          { id: 'decision-1', type: 'decision' },
   160	          { id: 'rationale-1', type: 'rationale' },
   161	        ],
   162	        graphContribution: {
   163	          sources: ['graph'],
   164	          totalDelta: 0.14,
   165	          injected: true,
   166	        },
   167	        traceMetadata: {
   168	          attribution: {
   169	            vector: [1],
   170	            fts: [1],
   171	            graph: [1],
   172	          },
   173	        },
   174	      }),
   175	      makeResult(2, {
   176	        similarity: 72,
   177	        averageSimilarity: 72,
   178	        intentAdjustedScore: 0.63,
   179	        rrfScore: 0.61,
   180	        fts_score: 0.58,
   217	  it('assigns low confidence when the top result barely beats the runner-up', async () => {
   218	    const envelope = await formatEnvelope([
   219	      makeResult(1, {
   220	        similarity: 53,
   221	        averageSimilarity: 53,
   222	        intentAdjustedScore: 0.36,
   223	        rrfScore: 0.35,
   224	        fts_score: 0.31,
   225	        rerankerScore: 0.18,
   226	        anchorMetadata: [],
   227	      }),
   228	      makeResult(2, {
   229	        similarity: 52,
   230	        averageSimilarity: 52,
   231	        intentAdjustedScore: 0.35,
   232	        rrfScore: 0.34,
   233	        fts_score: 0.3,
   234	        rerankerScore: 0.17,
   235	        anchorMetadata: [],
   236	      }),
   237	    ]);
   238	
   239	    const confidence = getResultConfidence(envelope, 1);
   240	    expect(confidence.label).toBe('low');
   241	    expect(confidence.value).toBeLessThan(0.4);
   242	  });
   243	
   244	  it('keeps label thresholds aligned with the numeric confidence value', async () => {
   245	    const highEnvelope = await formatEnvelope([
   246	      makeResult(1, {
   247	        similarity: 95,
   248	        averageSimilarity: 95,
   249	        intentAdjustedScore: 0.93,
   250	        rrfScore: 0.92,
   251	        fts_score: 0.88,
   252	        rerankerScore: 0.9,
   253	        anchorMetadata: [{ id: 'decision-1', type: 'decision' }],
   254	      }),
   255	      makeResult(2, {
   256	        similarity: 50,
   257	        averageSimilarity: 50,
   258	        intentAdjustedScore: 0.4,
   259	        rrfScore: 0.39,
   260	      }),

 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/intent-routing.vitest.ts:15:  it('uses fixed causal edge weight baseline (caused=1.0)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:21:// 5 representative eval queries with ground truth relevance judgments
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:60:    query: 'ablation study channel contribution',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:396:      localTarget: { mrr5: 0.40, ndcg5: 0.42 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:397:      remoteBaseline: { mrr5: 0.58, ndcg5: 0.58 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-session-learning.vitest.ts:191:        expect(result?.content?.[0]?.text).toContain('Preflight baseline captured');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:375:    it('README paths with explicit memory type use baseline memory weight', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:156:  it('keeps broader graph signals active while graph-walk rollout off preserves baseline ordering', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/k-value-optimization.vitest.ts:133:  it('uses baseline K=60 when experimental K optimization is OFF', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:904:      // Should include exact_match bonus (0.3) + baseline from similarity
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:140:  it('accepts eval_run_ablation mode and custom queries', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:142:      validateToolArgs('eval_run_ablation', {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:150:  it('rejects unknown eval_run_ablation modes', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:152:      validateToolArgs('eval_run_ablation', {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:3:// For ground truth expansion.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:40:  mrr5,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:384:      expect(analysis.results[k].mrr5).toBeDefined();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:390:  it('baseline K is 60', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:392:    expect(analysis.baselineK).toBe(60);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:400:  it('K=60 has highest mrr5 (self-retrieval)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:404:    const selfMrr = analysis.results[60].mrr5;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:406:    // K=60 should have the highest or equal MRR since it's the baseline
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:408:      expect(selfMrr).toBeGreaterThanOrEqual(analysis.results[k].mrr5 - 0.001);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:425:      expect(analysis.results[k].mrr5).toBeGreaterThanOrEqual(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:426:      expect(analysis.results[k].mrr5).toBeLessThanOrEqual(1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:467:      accumulator[k] = (first.results[k].mrr5 + second.results[k].mrr5) / 2;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:475:      expect(aggregated.results[k].mrr5).toBeCloseTo(perQueryAverage[k], 10);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:478:    expect(aggregated.results[20].mrr5).not.toBeCloseTo(naive.results[20].mrr5, 10);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:518:    // Because each baseline top-5 item is at its same rank in the candidate
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:519:    expect(mrr5([1, 2, 3, 4, 5], [1, 2, 3, 4, 5])).toBeCloseTo(0.4567, 3);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:522:  it('empty baseline returns 0', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:523:    expect(mrr5([], [1, 2, 3])).toBe(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:529:    const result = mrr5([1, 2, 3, 4, 5], candidateRanking);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:4:// T2: Deduplication works correctly — baseline-first ordering
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:260:    // SearchWithFallback returns different results for baseline vs expansion
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:263:      .mockResolvedValueOnce([{ id: 1, score: 0.9, title: 'baseline' }])
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:270:    // Two channels: baseline + expanded
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:276:  it('T2: deduplication preserves baseline-first ordering', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:289:        { id: 1, score: 0.9, title: 'baseline-version' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:290:        { id: 3, score: 0.7, title: 'baseline-only' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:299:    // Id=1 should appear once with baseline score (0.9), not expanded (0.6)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:303:    expect(id1Rows[0]!.title).toBe('baseline-version');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:341:  it('T5: merges summary-channel candidates with baseline candidates', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:363:    mockSearch.mockResolvedValue([{ id: 1, score: 0.93, title: 'baseline-hit', quality_score: 0.93 }]);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:376:  it('T6: deduplicates summary candidates by memory id and preserves baseline result', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:398:    mockSearch.mockResolvedValue([{ id: 1, score: 0.95, title: 'baseline-version', quality_score: 0.95 }]);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:404:    expect(result.candidates[0]?.title).toBe('baseline-version');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:523:        title: 'baseline',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:581:        { id: 1, title: 'baseline allowed', tenant_id: 'tenant-a', shared_space_id: 'shared-allowed' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:584:        { id: 1, title: 'baseline duplicate', tenant_id: 'tenant-a', shared_space_id: 'shared-allowed' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:604:    const baseline = result.candidates.find((row) => row.id === 1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:605:    expect(baseline?.stage1BranchScores).toMatchObject({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:609:    expect(baseline?.stage1BranchCount).toBe(2);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:619:      { id: 1, title: 'baseline allowed', tenant_id: 'tenant-a', shared_space_id: 'shared-allowed' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:637:    const baseline = result.candidates.find((row) => row.id === 1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:638:    expect(baseline?.stage1BranchScores).toMatchObject({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:642:    expect(baseline?.stage1BranchCount).toBe(2);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:653:        { id: 1, score: 0.42, title: 'baseline variant' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/embedding-expansion.vitest.ts:77:    // Default: vector search returns nothing (safe baseline)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-list-edge.vitest.ts:92:    const baseline = parseResponse(await handler.handleMemoryList({}));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-list-edge.vitest.ts:95:    expect(emptyFilter.data.total).toBe(baseline.data.total);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-list-edge.vitest.ts:96:    expect(emptyFilter.data.count).toBe(baseline.data.count);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-list-edge.vitest.ts:100:      new Set((baseline.data.results as Array<{ filePath: string }>).map((row) => row.filePath)),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:577:      const baselineStats = getShadowStats();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:596:      expect(getShadowStats()).toEqual(baselineStats);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:647:    const baselineShadowTotal = getShadowStats()?.totalComparisons ?? null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:679:    expect(getShadowStats()?.totalComparisons ?? null).toBe(baselineShadowTotal);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:23:  it('T081 resolves postflight against the matching session baseline', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:76:  it('T081 requires sessionId when multiple open baselines share a task_id', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-decomposition.vitest.ts:58:        { id: 1, title: 'baseline', score: 0.9 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:26:  { tool: 'eval_run_ablation', handler: 'handleEvalRunAblation', layer: 'L6' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:53:  { camel: 'handleEvalRunAblation', snake: 'handle_eval_run_ablation' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-metrics.vitest.ts:64:  it('T006-C05: Empty ground truth → MRR = 0', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-metrics.vitest.ts:107:  it('T006-C11: Empty ground truth → NDCG = 0.0', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-metrics.vitest.ts:127:   CORE: Recall@20
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-metrics.vitest.ts:130:describe('Recall@20', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-metrics.vitest.ts:157:  it('T006-C18: No relevant items in ground truth → Recall = 0', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-metrics.vitest.ts:185:  it('T006-C22: Empty ground truth → Hit Rate = 0', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-metrics.vitest.ts:515:  it('T006-F03: Result IDs not in ground truth — treated as relevance 0', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-metrics.vitest.ts:517:    const gt = [makeGT(1, 3)]; // id 999 not in ground truth
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-metrics.vitest.ts:607:  it('MAP-05: Empty ground truth — MAP is 0', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:5:// Unit and integration tests for the ablation study framework.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:6:// Verifies feature flag gating, channel-to-flag mapping, ablation runner
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:8:// And DB persistence of ablation results.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:10:// Acceptance criterion: ablation run shows per-channel Recall@20 delta
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:28:} from '../lib/eval/ablation-framework';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:37:} from '../lib/eval/ablation-framework';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:49: * When all channels active (baseline): returns memoryIds 1..count (high quality).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:52: * @param relevantIds - The set of memory IDs that are "relevant" in ground truth.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:85:    return { baseline: b, ablated: b + delta, delta };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:107:      baselineRecall20: 0.8,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:119:      baselineRecall20: 0.8,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:131:      baselineRecall20: 0.8,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:145:    runId: 'ablation-test-1234',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:230:  describe('ground truth alignment preflight', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:255:      alignmentDbPath = path.join(os.tmpdir(), `ablation-alignment-${Date.now()}-${Math.random()}.sqlite`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:286:    it('throws when ground truth includes chunk-backed or missing IDs for the active DB', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:403:  // 5. runAblation() — computes correct baseline and ablated recalls
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:409:    it('enforces ground-truth alignment before running ablation iterations when an alignment DB is provided', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:447:        expect.stringContaining('[ablation] runAblation failed'),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:455:    it('computes baseline and ablated recalls with mock search', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:456:      // Mock the ground truth data module so we control exactly which queries/relevances exist
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:457:      // We use vi.mock to replace the ground truth imports used inside ablation-framework.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:498:      expect(report.runId).toMatch(/^ablation-/);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:509:        expect(result.baselineRecall20).toBeCloseTo(1.0, 2);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:556:    it('continues when one channel ablation fails and returns partial results', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:610:        expect.stringContaining('[ablation] Channel "vector" failed'),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:617:    it('retains baseline queryCount and records all channel failures when every ablation fails', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:640:          throw new Error(`${disabledChannel} ablation failed`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:676:        expect(failure.error).toContain('ablation failed');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:693:        expect.stringContaining('[ablation] runAblation failed'),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:720:      expect(md).toContain(`**Baseline Recall@20:** 0.8000`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:819:            baselineRecall20: 0.8,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:880:    testDataDir = path.join(os.tmpdir(), `ablation-test-${Date.now()}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:917:      `SELECT * FROM eval_metric_snapshots WHERE metric_name LIKE 'ablation%' ORDER BY id`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:927:    // 1 baseline + 3 channels * (1 recall_delta + 8 metric deltas) = 28 total
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:930:    // First row should be the baseline
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:931:    const baselineRow = rows.find(r => r.metric_name === 'ablation_baseline_recall@20');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:932:    expect(baselineRow).toBeDefined();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:933:    expect(baselineRow!.channel).toBe('all');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:934:    expect(baselineRow!.metric_value).toBeCloseTo(0.8);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:937:    const deltaRows = rows.filter(r => r.metric_name === 'ablation_recall@20_delta');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:953:    expect(meta.runId).toBe('ablation-test-1234');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:954:    expect(meta.baselineRecall20).toBeCloseTo(0.8);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:962:    db.exec(`DELETE FROM eval_metric_snapshots WHERE metric_name LIKE 'ablation%'`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:968:      `SELECT eval_run_id FROM eval_metric_snapshots WHERE metric_name LIKE 'ablation%' LIMIT 1`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:975:  it('storeAblationResults() persists baseline query_count when all channel runs failed', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:977:    db.exec(`DELETE FROM eval_metric_snapshots WHERE metric_name LIKE 'ablation%'`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:991:    const baseline = db.prepare(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:994:       WHERE metric_name = 'ablation_baseline_recall@20'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:999:    expect(baseline).toBeDefined();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1000:    expect(baseline!.query_count).toBe(4);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1002:    const metadata = JSON.parse(baseline!.metadata);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1006:  it('storeAblationResults() prefers evaluatedQueryCount for baseline query_count', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1008:    db.exec(`DELETE FROM eval_metric_snapshots WHERE metric_name LIKE 'ablation%'`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1018:    const baseline = db.prepare(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1021:       WHERE metric_name = 'ablation_baseline_recall@20'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1026:    expect(baseline).toBeDefined();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1027:    expect(baseline!.query_count).toBe(4);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1028:    const metadata = JSON.parse(baseline!.metadata);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1053:  it('ablation can isolate >= 1 channel contribution (acceptance criterion)', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1054:    // ACCEPTANCE CRITERION: ablation run shows per-channel Recall@20 delta
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1057:    // Strategy: Use known ground truth with a mock search function where
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1065:    // Find queries with ground truth
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1071:      console.warn('No queries with ground truth — skipping isolation test');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1120:    // Core assertion: report is not null (ablation ran)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1147:    expect(md).toContain('Recall@20');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1150:  it('ablation report shows distinct per-channel Recall@20 deltas', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1210:  it('report.results[*].metrics contains all 9 metric keys with baseline/ablated/delta', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1217:        expect(typeof entry.baseline).toBe('number');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1220:        expect(entry.delta).toBeCloseTo(entry.ablated - entry.baseline, 6);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1228:      expect(result.metrics!['latency_p50'].baseline).toBeGreaterThanOrEqual(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1229:      expect(result.metrics!['latency_p95'].baseline).toBeGreaterThanOrEqual(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1238:      expect(result.metrics!['token_usage'].baseline).toBe(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1260:      testDataDir = path.join(os.tmpdir(), `ablation-mm-test-${Date.now()}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1275:    it('stores 9 additional metric rows per channel plus baseline + recall delta', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1282:        `SELECT metric_name, channel FROM eval_metric_snapshots WHERE metric_name LIKE 'ablation%' ORDER BY id`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1286:      // 1 baseline + 3 channels * (1 recall_delta + 8 persisted metric deltas) = 1 + 27 = 28
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1291:        r => r.channel === 'vector' && r.metric_name.startsWith('ablation_') && r.metric_name !== 'ablation_recall@20_delta' && r.metric_name !== 'ablation_baseline_recall@20',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1297:      expect(metricNames).toContain('ablation_MRR@5_delta');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1298:      expect(metricNames).toContain('ablation_precision@5_delta');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1299:      expect(metricNames).toContain('ablation_recall@5_delta');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1300:      expect(metricNames).toContain('ablation_NDCG@5_delta');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1301:      expect(metricNames).toContain('ablation_MAP_delta');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1302:      expect(metricNames).toContain('ablation_hit_rate_delta');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1303:      expect(metricNames).toContain('ablation_latency_p50_delta');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1304:      expect(metricNames).toContain('ablation_latency_p95_delta');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1305:      expect(metricNames).not.toContain('ablation_token_usage_delta');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1388:        `[ablation] Requested groundTruthQueryIds not found in the static dataset: ${missingId}`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:25:    source: 'lib/eval/ablation-framework.ts',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-scoring-integration.vitest.ts:296:  it('E5: All flags disabled = baseline behavior (no normalization, no penalty)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:156:  it('completes successfully when all stages succeed (baseline)', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:185:      'eval_run_ablation',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:299:      'eval_run_ablation', 'eval_reporting_dashboard',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1420:      const baselineCalls = errorSpy.mock.calls.length
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1427:      const newCalls = errorSpy.mock.calls.slice(baselineCalls)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1438:      const baselineCalls = errorSpy.mock.calls.length
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1445:      const newCalls = errorSpy.mock.calls.slice(baselineCalls)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2104:      'eval_run_ablation': '[L6:Analysis]',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:229:        { tool: 'task_preflight', desc: 'Capture baseline', prefix: '[L6:Analysis]' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-eval-reporting.vitest.ts:8:} from '../lib/eval/ablation-framework';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-eval-reporting.vitest.ts:63:vi.mock('../lib/eval/ablation-framework', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-eval-reporting.vitest.ts:65:    await vi.importActual<typeof import('../lib/eval/ablation-framework')>(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-eval-reporting.vitest.ts:66:      '../lib/eval/ablation-framework'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-eval-reporting.vitest.ts:92:import { ALL_CHANNELS } from '../lib/eval/ablation-framework';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-eval-reporting.vitest.ts:104:    runId: 'ablation-test-run',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-eval-reporting.vitest.ts:111:        baselineRecall20: 0.82,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-eval-reporting.vitest.ts:173:    mocks.mockFormatAblationReport.mockReturnValue('formatted ablation report');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-eval-reporting.vitest.ts:212:    it('T005-E4: handle_eval_run_ablation alias exported', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-eval-reporting.vitest.ts:213:      expect(typeof evalReporting.handle_eval_run_ablation).toBe('function');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-eval-reporting.vitest.ts:218:    it('T006-A1: throws when ablation disabled', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-eval-reporting.vitest.ts:314:    it('T006-A10: ablation search forces all channels and wires graph search', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-eval-reporting.vitest.ts:325:          context: 'eval_run_ablation',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-eval-reporting.vitest.ts:357:    it('T006-A10b: SPECKIT_EVAL_DB_PATH temporarily swaps the ablation DB and restores MEMORY_DB_PATH', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-eval-reporting.vitest.ts:382:          context: 'eval_run_ablation',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-eval-reporting.vitest.ts:443:        grid: Array<{ k: number; mrr5: number; avgScore: number }>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-eval-reporting.vitest.ts:446:      expect(k20?.mrr5).toBeCloseTo(0.75, 10);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feedback-denylist.vitest.ts:49:  const technicalTerms = ['vector', 'pipeline', 'database', 'embedding', 'reranker', 'checkpoint', 'ablation'];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-calibration.vitest.ts:4:// Unit tests for graph calibration profiles, ablation harness,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-calibration.vitest.ts:256:  it('produces baseline with all features enabled', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-calibration.vitest.ts:259:    expect(result.baseline.featureName).toBe('baseline');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-calibration.vitest.ts:260:    expect(result.baseline.intentMetrics).toHaveLength(2);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-calibration.vitest.ts:261:    expect(result.baseline.aggregateMrr).toBeGreaterThan(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-calibration.vitest.ts:262:    expect(result.baseline.aggregateNdcg).toBeGreaterThan(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-calibration.vitest.ts:265:  it('produces one ablation per enabled toggle (skips disabled)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-calibration.vitest.ts:269:    expect(result.ablations).toHaveLength(2);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-calibration.vitest.ts:270:    const names = result.ablations.map((a) => a.featureName);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-calibration.vitest.ts:276:  it('ablated metrics differ from baseline (feature isolation)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-calibration.vitest.ts:279:    const featureAAblation = result.ablations.find((a) => a.featureName === 'featureA');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-calibration.vitest.ts:283:    expect(featureAAblation!.aggregateMrr).toBeLessThanOrEqual(result.baseline.aggregateMrr);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-calibration.vitest.ts:289:    for (const ablation of result.ablations) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-calibration.vitest.ts:290:      expect(ablation.intentMetrics).toHaveLength(queries.length);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-calibration.vitest.ts:291:      for (const m of ablation.intentMetrics) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-calibration.vitest.ts:301:    expect(result.baseline.aggregateMrr).toBe(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-calibration.vitest.ts:302:    expect(result.baseline.aggregateNdcg).toBe(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-calibration.vitest.ts:303:    expect(result.ablations).toHaveLength(2);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-calibration.vitest.ts:308:    expect(result.baseline.featureName).toBe('baseline');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-calibration.vitest.ts:309:    expect(result.ablations).toHaveLength(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-calibration.vitest.ts:316:    const baseline = result.baseline;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-calibration.vitest.ts:317:    for (const m of baseline.intentMetrics) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/bm25-baseline.vitest.ts:43:} from '../lib/eval/bm25-baseline';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/bm25-baseline.vitest.ts:81:      id: 1000 + i,        // IDs that will NOT match mapped ground truth IDs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/bm25-baseline.vitest.ts:88:/** Build a mock result object representing a complete BM25 baseline run. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/bm25-baseline.vitest.ts:89:function makeMockResult(mrr5: number): BM25BaselineResult {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/bm25-baseline.vitest.ts:92:      mrr5,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/bm25-baseline.vitest.ts:93:      ndcg10: mrr5 * 0.9,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/bm25-baseline.vitest.ts:94:      recall20: mrr5 * 0.8,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/bm25-baseline.vitest.ts:95:      hitRate1: mrr5 > 0 ? 1 : 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/bm25-baseline.vitest.ts:99:    contingencyDecision: evaluateContingency(mrr5),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/bm25-baseline.vitest.ts:354:    expect(parsed.action).toBe('RATIONALIZE'); // mrr5=0.62 falls in RATIONALIZE band
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/bm25-baseline.vitest.ts:402:    expect(typeof result.metrics.mrr5).toBe('number');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/bm25-baseline.vitest.ts:404:    expect(typeof result.metrics.recall20).toBe('number');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/bm25-baseline.vitest.ts:437:    expect(contingencyDecision.bm25MRR).toBe(result.metrics.mrr5);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/bm25-baseline.vitest.ts:456:    // Metrics are all 0 because empty results never match mapped ground truth IDs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/bm25-baseline.vitest.ts:457:    expect(result.metrics.mrr5).toBe(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/bm25-baseline.vitest.ts:489:    const baseline = await runBM25Baseline(mockSearch, { queryLimit: 3 });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/bm25-baseline.vitest.ts:492:    expect(withKOverride.metrics.mrr5).toBeCloseTo(baseline.metrics.mrr5, 10);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/bm25-baseline.vitest.ts:493:    expect(withKOverride.contingencyDecision.bm25MRR).toBeCloseTo(baseline.contingencyDecision.bm25MRR, 10);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/bm25-baseline.vitest.ts:494:    expect(withKOverride.metrics.ndcg10).not.toBeCloseTo(baseline.metrics.ndcg10, 10);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/bm25-baseline.vitest.ts:495:    expect(withKOverride.metrics.recall20).not.toBeCloseTo(baseline.metrics.recall20, 10);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-state-baseline.vitest.ts:6:import { captureMemoryStateBaselineSnapshot } from '../lib/eval/memory-state-baseline';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-state-baseline.vitest.ts:44:describe('Memory state baseline snapshots', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-state-baseline.vitest.ts:48:    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'memory-state-baseline-'));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-state-baseline.vitest.ts:58:  it('captures and persists baseline metrics beside the target context db', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-state-baseline.vitest.ts:87:        WHERE eval_run_id = 42 AND channel = 'memory-state-baseline'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:479:    const baseline = captureAuthoritativeState(db);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:513:    expect(restored).toEqual(baseline);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:55:- Added BM25 baseline with configurable k1/b parameters
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/k-value-judged-sweep.vitest.ts:217:    expect(metrics.mrr5Judged).toBe(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/k-value-judged-sweep.vitest.ts:228:    expect(metrics.mrr5Judged).toBeGreaterThanOrEqual(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/k-value-judged-sweep.vitest.ts:229:    expect(metrics.mrr5Judged).toBeLessThanOrEqual(1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/k-value-judged-sweep.vitest.ts:238:    expect(metrics.mrr5Judged).toBeCloseTo(1.0, 5);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/k-value-judged-sweep.vitest.ts:275:      10:  { ndcg10: 0.5, mrr5Judged: 0.5, queryCount: 1 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/k-value-judged-sweep.vitest.ts:276:      20:  { ndcg10: 0.8, mrr5Judged: 0.7, queryCount: 1 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/k-value-judged-sweep.vitest.ts:277:      40:  { ndcg10: 0.6, mrr5Judged: 0.6, queryCount: 1 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/k-value-judged-sweep.vitest.ts:278:      60:  { ndcg10: 0.3, mrr5Judged: 0.3, queryCount: 1 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/k-value-judged-sweep.vitest.ts:279:      80:  { ndcg10: 0.1, mrr5Judged: 0.1, queryCount: 1 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/k-value-judged-sweep.vitest.ts:280:      100: { ndcg10: 0.4, mrr5Judged: 0.4, queryCount: 1 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/k-value-judged-sweep.vitest.ts:281:      120: { ndcg10: 0.2, mrr5Judged: 0.2, queryCount: 1 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/k-value-judged-sweep.vitest.ts:288:      10:  { ndcg10: 0.7, mrr5Judged: 0.5, queryCount: 1 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/k-value-judged-sweep.vitest.ts:289:      20:  { ndcg10: 0.7, mrr5Judged: 0.5, queryCount: 1 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/k-value-judged-sweep.vitest.ts:290:      40:  { ndcg10: 0.6, mrr5Judged: 0.4, queryCount: 1 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/k-value-judged-sweep.vitest.ts:291:      60:  { ndcg10: 0.7, mrr5Judged: 0.5, queryCount: 1 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/k-value-judged-sweep.vitest.ts:292:      80:  { ndcg10: 0.5, mrr5Judged: 0.3, queryCount: 1 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/k-value-judged-sweep.vitest.ts:293:      100: { ndcg10: 0.4, mrr5Judged: 0.2, queryCount: 1 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/k-value-judged-sweep.vitest.ts:294:      120: { ndcg10: 0.3, mrr5Judged: 0.1, queryCount: 1 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/k-value-judged-sweep.vitest.ts:303:      metrics[k] = { ndcg10: 0.5, mrr5Judged: 0.5, queryCount: 1 };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:411:    // (treatment should be < controlP95 + 10ms, accounting for tiny no-op baseline)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:432:  it('T004b-3: observer effect relative overhead does not exceed 10% of a representative search baseline', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:433:    // Simulate a representative "search baseline" time: 50ms (well within real search latency).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-graph-signals.vitest.ts:265:    // 4-channel baseline

exec
/bin/zsh -lc "rg -n \"memory_search.*trackAccess|trackAccess.*memory_search|last_review = CURRENT_TIMESTAMP|review_count = review_count \\+ 1\" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:572:          last_review = CURRENT_TIMESTAMP,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:573:          review_count = review_count + 1,

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts | sed -n '260,320p;340,410p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   260	    // SearchWithFallback returns different results for baseline vs expansion
   261	    const mockSearch = searchWithFallback as ReturnType<typeof vi.fn>;
   262	    mockSearch
   263	      .mockResolvedValueOnce([{ id: 1, score: 0.9, title: 'baseline' }])
   264	      .mockResolvedValueOnce([{ id: 2, score: 0.8, title: 'expanded' }]);
   265	
   266	    const result = await executeStage1({ config: makeConfig() });
   267	
   268	    // Expansion was called
   269	    expect(mockExpandQueryWithEmbeddings).toHaveBeenCalled();
   270	    // Two channels: baseline + expanded
   271	    expect(result.metadata.channelCount).toBe(2);
   272	    // Both results present
   273	    expect(result.candidates.length).toBe(2);
   274	  });
   275	
   276	  it('T2: deduplication preserves baseline-first ordering', async () => {
   277	    mockIsEmbeddingExpansionEnabled.mockReturnValue(true);
   278	    mockIsExpansionActive.mockReturnValue(true);
   279	    mockExpandQueryWithEmbeddings.mockResolvedValue({
   280	      original: 'test query',
   281	      expanded: ['extra'],
   282	      combinedQuery: 'test query extra',
   283	    });
   284	
   285	    const mockSearch = searchWithFallback as ReturnType<typeof vi.fn>;
   286	    // Both channels return overlapping result (id=1)
   287	    mockSearch
   288	      .mockResolvedValueOnce([
   289	        { id: 1, score: 0.9, title: 'baseline-version' },
   290	        { id: 3, score: 0.7, title: 'baseline-only' },
   291	      ])
   292	      .mockResolvedValueOnce([
   293	        { id: 1, score: 0.6, title: 'expanded-version' },
   294	        { id: 4, score: 0.5, title: 'expanded-only' },
   295	      ]);
   296	
   297	    const result = await executeStage1({ config: makeConfig() });
   298	
   299	    // Id=1 should appear once with baseline score (0.9), not expanded (0.6)
   300	    const id1Rows = result.candidates.filter((r) => r.id === 1);
   301	    expect(id1Rows).toHaveLength(1);
   302	    expect(id1Rows[0]!.score).toBe(0.9);
   303	    expect(id1Rows[0]!.title).toBe('baseline-version');
   304	    expect(id1Rows[0]!.stage1BranchScores).toEqual({
   305	      'test query': 0.9,
   306	      'test query extra': 0.6,
   307	    });
   308	    expect(id1Rows[0]!.stage1BranchCount).toBe(2);
   309	
   310	    // Total should be 3 unique (1, 3, 4)
   311	    expect(result.candidates).toHaveLength(3);
   312	  });
   313	
   314	  it('T3: expansion suppressed for simple queries (R15 mutual exclusion)', async () => {
   315	    mockIsEmbeddingExpansionEnabled.mockReturnValue(true);
   316	    mockIsExpansionActive.mockReturnValue(false); // R15 says "simple"
   317	
   318	    const mockSearch = searchWithFallback as ReturnType<typeof vi.fn>;
   319	    mockSearch.mockResolvedValue([{ id: 1, score: 0.9, title: 'result' }]);
   320	
   340	
   341	  it('T5: merges summary-channel candidates with baseline candidates', async () => {
   342	    mockIsEmbeddingExpansionEnabled.mockReturnValue(false);
   343	    mockIsMemorySummariesEnabled.mockReturnValue(true);
   344	    mockCheckScaleGate.mockReturnValue(true);
   345	    mockQuerySummaryEmbeddings.mockReturnValue([{ memoryId: 2, similarity: 0.82 }]);
   346	    mockRequireDb.mockReturnValue(
   347	      makeSummaryDb({
   348	        2: {
   349	          id: 2,
   350	          title: 'summary-hit',
   351	          spec_folder: 'specs/200-summary',
   352	          file_path: 'specs/200-summary/memory/summary-hit.md',
   353	          importance_tier: 'normal',
   354	          importance_weight: 1,
   355	          quality_score: 0.91,
   356	          created_at: '2026-01-01T00:00:00.000Z',
   357	          is_archived: 0,
   358	        },
   359	      })
   360	    );
   361	
   362	    const mockSearch = searchWithFallback as ReturnType<typeof vi.fn>;
   363	    mockSearch.mockResolvedValue([{ id: 1, score: 0.93, title: 'baseline-hit', quality_score: 0.93 }]);
   364	
   365	    const result = await executeStage1({ config: makeConfig() });
   366	    const ids = result.candidates.map((row) => row.id);
   367	
   368	    expect(ids).toEqual([1, 2]);
   369	    expect(result.metadata.channelCount).toBe(2);
   370	
   371	    const summaryRow = result.candidates.find((row) => row.id === 2);
   372	    expect(summaryRow?.title).toBe('summary-hit');
   373	    expect(summaryRow?.score).toBeCloseTo(0.82, 10);
   374	  });
   375	
   376	  it('T6: deduplicates summary candidates by memory id and preserves baseline result', async () => {
   377	    mockIsEmbeddingExpansionEnabled.mockReturnValue(false);
   378	    mockIsMemorySummariesEnabled.mockReturnValue(true);
   379	    mockCheckScaleGate.mockReturnValue(true);
   380	    mockQuerySummaryEmbeddings.mockReturnValue([{ memoryId: 1, similarity: 0.15 }]);
   381	
   382	    const summaryGetSpy = vi.fn((id: number) => ({
   383	      id,
   384	      title: 'summary-version',
   385	      spec_folder: 'specs/dup',
   386	      file_path: 'specs/dup/memory/dup.md',
   387	      importance_tier: 'normal',
   388	      importance_weight: 1,
   389	      quality_score: 0.99,
   390	      created_at: '2026-01-01T00:00:00.000Z',
   391	      is_archived: 0,
   392	    }));
   393	    mockRequireDb.mockReturnValue({
   394	      prepare: vi.fn(() => ({ get: summaryGetSpy })),
   395	    });
   396	
   397	    const mockSearch = searchWithFallback as ReturnType<typeof vi.fn>;
   398	    mockSearch.mockResolvedValue([{ id: 1, score: 0.95, title: 'baseline-version', quality_score: 0.95 }]);
   399	
   400	    const result = await executeStage1({ config: makeConfig() });
   401	
   402	    expect(result.candidates).toHaveLength(1);
   403	    expect(result.candidates[0]?.id).toBe(1);
   404	    expect(result.candidates[0]?.title).toBe('baseline-version');
   405	    expect(result.metadata.channelCount).toBe(1);
   406	    expect(summaryGetSpy).not.toHaveBeenCalled();
   407	  });
   408	
   409	  it('T7: applies minQualityScore threshold to summary candidates before merge', async () => {
   410	    mockIsEmbeddingExpansionEnabled.mockReturnValue(false);

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts | sed -n '555,620p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   555	  describe('handleMemoryValidate Validation', () => {
   556	    it('T521-V1: Missing id throws', async () => {
   557	      await expect(
   558	        handler.handleMemoryValidate(
   559	          invalidArgs<Parameters<typeof handler.handleMemoryValidate>[0]>({ wasUseful: true }),
   560	        ),
   561	      ).rejects.toThrow(/id.*required/);
   562	    });
   563	
   564	    it('T521-V2: Missing wasUseful throws', async () => {
   565	      await expect(
   566	        handler.handleMemoryValidate(
   567	          invalidArgs<Parameters<typeof handler.handleMemoryValidate>[0]>({ id: 1 }),
   568	        ),
   569	      ).rejects.toThrow(/wasUseful.*required/);
   570	    });
   571	
   572	    it('T521-V3: Non-boolean wasUseful throws', async () => {
   573	      await expect(
   574	        handler.handleMemoryValidate(
   575	          invalidArgs<Parameters<typeof handler.handleMemoryValidate>[0]>({
   576	            id: 1,
   577	            wasUseful: 'yes',
   578	          }),
   579	        ),
   580	      ).rejects.toThrow(/wasUseful.*boolean/);
   581	    });
   582	
   583	    it('T521-V4: Non-integer string id throws', async () => {
   584	      await expect(handler.handleMemoryValidate({ id: '7abc', wasUseful: true })).rejects.toThrow(/id.*integer|id.*number/i);
   585	    });
   586	
   587	    it('T521-V5: Stores resolved query text for adaptive validation signals', async () => {
   588	      const db = vectorIndexMod.getDb();
   589	      const memoryId = 900051;
   590	      const queryLogId = 900151;
   591	      const now = new Date().toISOString();
   592	      const previousAdaptiveFlag = process.env.SPECKIT_MEMORY_ADAPTIVE_RANKING;
   593	
   594	      initConsumptionLog(db);
   595	      db.prepare(`
   596	        INSERT INTO memory_index (id, spec_folder, file_path, created_at, updated_at)
   597	        VALUES (?, ?, ?, ?, ?)
   598	      `).run(memoryId, 'specs/test', `specs/test/memory-${memoryId}.md`, now, now);
   599	      db.prepare(`
   600	        INSERT INTO consumption_log (id, event_type, query_text, result_count, timestamp)
   601	        VALUES (?, 'search', ?, 1, ?)
   602	      `).run(queryLogId, 'resolved validation query', now);
   603	
   604	      try {
   605	        process.env.SPECKIT_MEMORY_ADAPTIVE_RANKING = 'true';
   606	        const response = await handler.handleMemoryValidate({
   607	          id: memoryId,
   608	          wasUseful: true,
   609	          queryId: `consumption:${queryLogId}`,
   610	        });
   611	        const parsed = JSON.parse(response.content[0].text);
   612	        const signal = db.prepare(`
   613	          SELECT query, metadata
   614	          FROM adaptive_signal_events
   615	          WHERE memory_id = ?
   616	          ORDER BY id DESC
   617	          LIMIT 1
   618	        `).get(memoryId) as { query?: string | null; metadata?: string | null } | undefined;
   619	
   620	        expect(response.isError).toBeFalsy();

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts | sed -n '548,590p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-state-baseline.vitest.ts | sed -n '44,110p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    44	describe('Memory state baseline snapshots', () => {
    45	  let tempDir = '';
    46	
    47	  beforeEach(() => {
    48	    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'memory-state-baseline-'));
    49	    closeEvalDb();
    50	  });
    51	
    52	  afterEach(() => {
    53	    closeEvalDb();
    54	    delete process.env.MEMORY_DB_PATH;
    55	    fs.rmSync(tempDir, { recursive: true, force: true });
    56	  });
    57	
    58	  it('captures and persists baseline metrics beside the target context db', () => {
    59	    const contextDbPath = path.join(tempDir, 'nested', 'context-index.sqlite');
    60	    fs.mkdirSync(path.dirname(contextDbPath), { recursive: true });
    61	    createContextDb(contextDbPath);
    62	
    63	    const snapshot = captureMemoryStateBaselineSnapshot({
    64	      contextDbPath,
    65	      evalRunId: 42,
    66	      persist: true,
    67	      specFolder: 'specs/014-hydra-db-based-features',
    68	    });
    69	
    70	    expect(snapshot.evalRunId).toBe(42);
    71	    expect(snapshot.metrics['isolation.memory_rows_total']).toBe(3);
    72	    expect(snapshot.metrics['isolation.distinct_spec_folders']).toBe(1);
    73	    expect(snapshot.metrics['isolation.unscoped_rows']).toBe(1);
    74	    expect(snapshot.metrics['isolation.missing_session_scope_rows']).toBe(1);
    75	    expect(snapshot.metrics['isolation.unknown_context_type_rows']).toBe(1);
    76	    expect(snapshot.metrics['schema.version']).toBe(21);
    77	    expect(snapshot.persistedRows).toBe(Object.keys(snapshot.metrics).length);
    78	
    79	    const evalDbPath = getEvalDbPath();
    80	    expect(evalDbPath).toBe(path.join(path.dirname(contextDbPath), 'speckit-eval.db'));
    81	
    82	    const evalDb = new Database(evalDbPath || ':memory:', { readonly: true });
    83	    try {
    84	      const row = evalDb.prepare(`
    85	        SELECT COUNT(*) AS total
    86	        FROM eval_metric_snapshots
    87	        WHERE eval_run_id = 42 AND channel = 'memory-state-baseline'
    88	      `).get() as { total: number };
    89	      expect(row.total).toBe(Object.keys(snapshot.metrics).length);
    90	    } finally {
    91	      evalDb.close();
    92	    }
    93	  });
    94	
    95	  it('returns zeroed isolation metrics when the target context db is absent', () => {
    96	    const snapshot = captureMemoryStateBaselineSnapshot({
    97	      contextDbPath: path.join(tempDir, 'missing.sqlite'),
    98	      evalRunId: 7,
    99	    });
   100	
   101	    expect(snapshot.metrics['isolation.memory_rows_total']).toBe(0);
   102	    expect(snapshot.metrics['isolation.distinct_spec_folders']).toBe(0);
   103	    expect(snapshot.metrics['schema.version']).toBe(0);
   104	    expect(snapshot.persistedRows).toBeUndefined();
   105	  });
   106	});

codex
I’ve finished the evidence pass and I’m doing one last verification step: checking the phase folder’s current strict-validation state so the iteration note can distinguish source-backed findings from any packet-health assumptions. Then I’ll write up the testing strategy in the exact iteration-033 format you asked for.
exec
/bin/zsh -lc 'cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main" --strict' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1144ms:

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
The validation is still running, so I’m waiting on that result now. After it returns, I’ll fold the outcome into the assessment section and keep the rest of the write-up focused on concrete unit, integration, and judged-regression test plans.
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '668,676p;154,160p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   154	
   155	### rollout_summary_files
   156	
   157	- rollout_summaries/2026-04-09T10-35-53-UGDf-009_post_save_render_fixes_memory_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T12-35-53-019d71d0-0ec5-7c80-a08b-6d336ee5c639.jsonl, updated_at=2026-04-09T12:01:25+00:00, thread_id=019d71d0-0ec5-7c80-a08b-6d336ee5c639)
   158	
   159	### keywords
   160	
   668	
   669	- deep-review-reducer-schema.vitest.ts, release-blocking, .deep-review-pause, scratch/changelog, create:changelog gated
   670	
   671	## User preferences
   672	
   673	- when the user asked for recommendation docs “based on the 90 iterations,” keep documentation in the existing packet `research/` folder with structured sections (exec summary, keep/fix, P0/P1/P2, compatibility, validation/testing, rollout order) [Task 1]
   674	- when the user asked to “run /create:changelog ... in the phase folder used,” place changelog files under packet-local `scratch/changelog/` and include files-changed scope [Task 2][Task 3]
   675	- when the user added “also include files changed in it,” changelog drafts should list full touched-file scope rather than short samples [Task 2][Task 3]
   676	

codex
# Iteration 033: TESTING STRATEGY

## Focus
TESTING STRATEGY: How should we test the adopted patterns? Unit tests, integration tests, memory quality regression tests. Concrete test plans.

## Findings

### Finding 1: Test ranking and review math as deterministic units before testing MCP surfaces
- **Source**: [bm25.go:16](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/bm25.go#L16), [cache.go:10](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go#L10), [search.go:10](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go#L10), [cognitive-gaps.vitest.ts:69](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts#L69), [fsrs-hybrid-decay.vitest.ts:13](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-hybrid-decay.vitest.ts#L13), [stage1-expansion.vitest.ts:276](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts#L276), [stage2-fusion.vitest.ts:332](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts#L332)
- **What it does**: Modus concentrates critical behavior in pure functions: BM25 field weighting/tokenization, Jaccard cache reuse, query expansion fallback, FSRS decay/reinforcement, and connected-result weighting. Public already has the right pattern: table-style tests for FSRS math, decay policy, expansion ordering, and batched access writes.
- **Why it matters**: Adopted patterns like `memory_review`, weak-result lexical fallback, and connected-doc hints will be safest if we freeze their math/routing invariants first. Concrete unit plan:
  1. BM25/tokenization: field-weight ordering, prefix fallback, stemming, OOD threshold, dedup.
  2. Expansion: original-query preservation, parse-failure fallback, max-variant cap, baseline-first dedup.
  3. FSRS/review: `AGAIN/HARD/GOOD/EASY`, retrievability bounds, no-decay overrides, chained reviews.
  4. Connected-doc scoring: subject/entity/tag weights and stable ordering under dedup.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary

### Finding 2: Integration tests should assert side effects, scope boundaries, and idempotent operator behavior
- **Source**: [vault.go:273](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L273), [vault.go:311](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L311), [memory-search-ux-hooks.vitest.ts:136](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts#L136), [memory-context.vitest.ts:300](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts#L300), [tool-input-schema.vitest.ts:243](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts#L243), [handler-checkpoints.vitest.ts:555](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts#L555), [stage2-fusion.ts:552](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L552)
- **What it does**: Modus turns `memory_search` into a recall event by reinforcing returned facts. Public already has adjacent write-on-access plumbing in Stage 2 plus handler tests for cursor-only continuation, scope mismatch rejection, and validation-arg enforcement.
- **Why it matters**: If we add `memory_review` or a doctor/debug overlay, the integration contract matters more than the formatter. Concrete integration plan:
  1. `memory_review`: in-memory DB test proves one graded review updates `stability`, `difficulty`, `last_review`, `review_count`, and leaves other rows untouched.
  2. Search-side strengthening: prove `trackAccess=false` is read-only, `trackAccess=true` writes exactly once per returned row, and failures do not corrupt response payloads.
  3. Cursor/scope: prove continuation cursors are reusable only inside original tenant/user/shared-space scope.
  4. Doctor/debug overlays: prove additive response shape only, never replacing canonical `memory_health`/`memory_search` contracts.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary

### Finding 3: Retrieval changes need a judged memory-quality regression suite, not just unit coverage
- **Source**: [bm25-baseline.vitest.ts:440](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/bm25-baseline.vitest.ts#L440), [memory-state-baseline.vitest.ts:58](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-state-baseline.vitest.ts#L58), [result-confidence-scoring.vitest.ts:106](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts#L106), [result-confidence-scoring.vitest.ts:217](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts#L217), [manual_testing_playbook.md:266](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md#L266)
- **What it does**: Public already has the primitives for judged evaluation: BM25 baseline runs, persisted baseline snapshots, confidence scoring, and manual audit scenarios. That is enough to create a dedicated “memory-quality” gate for adoption work.
- **Why it matters**: Features like weak-result lexical fallback, connected-doc appendix, and explicit review surfaces can look correct locally while hurting actual ranking quality. Concrete regression plan:
  1. Build a fixed judged query set split by behavior: exact fact, stale fact, multi-hop, review/due-state, and weak-result recovery.
  2. Record baseline `MRR@5`, `NDCG@10`, `Recall@20`, top-result confidence mix, and memory-state snapshot.
  3. Require no global regression and targeted improvement on the slice the feature claims to help.
  4. For connected-doc hints, score both ranking metrics and “helpful appendix” metrics separately so appendix wins do not mask core retrieval regressions.
- **Recommendation**: NEW FEATURE
- **Impact**: high
- **Source strength**: primary

### Finding 4: Keep a small manual/e2e pack for sessioned and governance-heavy behaviors
- **Source**: [manual_testing_playbook.md:252](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md#L252), [manual_testing_playbook.md:284](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md#L284), [manual_testing_playbook.md:390](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md#L390), [memory-search-ux-hooks.vitest.ts:164](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts#L164), [memory-context.vitest.ts:358](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts#L358)
- **What it does**: Public already documents real-operator checks for `memory_context`, `memory_search`, `memory_match_triggers`, and `memory_validate`, while handler tests cover cursor and trace edge cases.
- **Why it matters**: A few behaviors are too cross-cutting for pure unit tests: real session reuse, trace-only session transition metadata, governed filtering, progressive disclosure cursors, and operator-visible validation flows. Concrete manual pack:
  1. Resume/session trace scenario.
  2. Search + continuation cursor scenario.
  3. Trigger matching under governed scope.
  4. Validation/review feedback loop scenario.
  5. Doctor/debug overlay scenario once added.
- **Recommendation**: adopt now
- **Impact**: medium
- **Source strength**: secondary

## Sources Consulted
- [external/internal/index/bm25.go:16](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/bm25.go#L16)
- [external/internal/index/cache.go:10](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go#L10)
- [external/internal/librarian/search.go:10](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go#L10)
- [external/internal/index/crossref.go:154](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go#L154)
- [external/internal/vault/facts.go:64](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go#L64), [external/internal/vault/facts.go:160](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go#L160)
- [external/internal/mcp/vault.go:21](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L21), [external/internal/mcp/vault.go:273](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L273), [external/internal/mcp/vault.go:885](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L885)
- [memory-search.ts:15](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L15), [fsrs-scheduler.ts:31](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts#L31), [stage2-fusion.ts:552](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L552)
- [cognitive-gaps.vitest.ts:69](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts#L69), [fsrs-hybrid-decay.vitest.ts:13](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-hybrid-decay.vitest.ts#L13), [stage1-expansion.vitest.ts:276](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts#L276), [stage2-fusion.vitest.ts:332](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts#L332)
- [memory-search-ux-hooks.vitest.ts:136](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts#L136), [memory-context.vitest.ts:300](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts#L300), [tool-input-schema.vitest.ts:243](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts#L243), [handler-checkpoints.vitest.ts:555](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts#L555)
- [bm25-baseline.vitest.ts:440](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/bm25-baseline.vitest.ts#L440), [memory-state-baseline.vitest.ts:58](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-state-baseline.vitest.ts#L58), [result-confidence-scoring.vitest.ts:106](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts#L106)
- [manual_testing_playbook.md:252](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md#L252), [manual_testing_playbook.md:266](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md#L266), [manual_testing_playbook.md:390](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md#L390)

## Assessment
- **New information ratio**: 0.22
- **Questions addressed**: how to test review math; how to test search-side reinforcement; how to test connected-result and expansion behavior; how to catch retrieval-quality regressions; which behaviors still need manual/e2e verification.
- **Questions answered**: pure math/routing belongs in deterministic unit tests; operator side effects and scope belong in mocked DB/handler integration tests; ranking changes need judged regression metrics and persisted baselines; session/governance/response-shape behaviors need a small manual/e2e pack.
- **Novelty justification**: Earlier iterations ranked what to ship; this pass maps those decisions onto a concrete, layered verification strategy using live Public test infrastructure rather than generic advice.
- **Validation check**: `validate.sh --strict` on the phase folder returned `RESULT: PASSED`; in this read-only environment it also emitted `cannot create temp file for here document: Operation not permitted`, but the validator still reported zero errors and zero warnings.

## Ruled Out
- Treating end-to-end MCP tests as the primary gate for ranking/review logic, because they are weaker at isolating math and write-contract failures.
- Approving ranking-affecting features with snapshot-only string assertions, because ordering, score margins, and side effects need behavioral assertions.
- Copying Modus’s search-triggered reinforcement without opt-in write-path tests, because Public has stricter governance and read/write separation expectations.
- Using only manual playbook coverage for retrieval changes, because judged regression metrics already exist and should be used as release gates.

## Reflection
- **What worked**: Reading current Public test files alongside the external source exposed the right seam map quickly: math and routing already have good unit patterns, while session/governance concerns already have handler/manual scaffolding.
- **What did not work**: CocoIndex and memory MCP calls were not usable in this run, so I had to fall back to direct file reads and `rg` sweeps.
- **What I would do differently**: Next pass, convert this layered strategy into a file-by-file test matrix for `memory_review`, doctor/debug overlays, connected-doc appendix, and weak-result lexical fallback.

## Recommended Next Focus
Translate the adopt-now items into an implementation test matrix: `memory_review` contract tests first, doctor/debug additive-response tests second, then a judged regression pack for connected-doc hints and weak-result lexical fallback.


hook: Stop
hook: Stop Completed
tokens used
187,130
# Iteration 033: TESTING STRATEGY

## Focus
TESTING STRATEGY: How should we test the adopted patterns? Unit tests, integration tests, memory quality regression tests. Concrete test plans.

## Findings

### Finding 1: Test ranking and review math as deterministic units before testing MCP surfaces
- **Source**: [bm25.go:16](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/bm25.go#L16), [cache.go:10](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go#L10), [search.go:10](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go#L10), [cognitive-gaps.vitest.ts:69](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts#L69), [fsrs-hybrid-decay.vitest.ts:13](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-hybrid-decay.vitest.ts#L13), [stage1-expansion.vitest.ts:276](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts#L276), [stage2-fusion.vitest.ts:332](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts#L332)
- **What it does**: Modus concentrates critical behavior in pure functions: BM25 field weighting/tokenization, Jaccard cache reuse, query expansion fallback, FSRS decay/reinforcement, and connected-result weighting. Public already has the right pattern: table-style tests for FSRS math, decay policy, expansion ordering, and batched access writes.
- **Why it matters**: Adopted patterns like `memory_review`, weak-result lexical fallback, and connected-doc hints will be safest if we freeze their math/routing invariants first. Concrete unit plan:
  1. BM25/tokenization: field-weight ordering, prefix fallback, stemming, OOD threshold, dedup.
  2. Expansion: original-query preservation, parse-failure fallback, max-variant cap, baseline-first dedup.
  3. FSRS/review: `AGAIN/HARD/GOOD/EASY`, retrievability bounds, no-decay overrides, chained reviews.
  4. Connected-doc scoring: subject/entity/tag weights and stable ordering under dedup.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary

### Finding 2: Integration tests should assert side effects, scope boundaries, and idempotent operator behavior
- **Source**: [vault.go:273](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L273), [vault.go:311](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L311), [memory-search-ux-hooks.vitest.ts:136](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts#L136), [memory-context.vitest.ts:300](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts#L300), [tool-input-schema.vitest.ts:243](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts#L243), [handler-checkpoints.vitest.ts:555](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts#L555), [stage2-fusion.ts:552](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L552)
- **What it does**: Modus turns `memory_search` into a recall event by reinforcing returned facts. Public already has adjacent write-on-access plumbing in Stage 2 plus handler tests for cursor-only continuation, scope mismatch rejection, and validation-arg enforcement.
- **Why it matters**: If we add `memory_review` or a doctor/debug overlay, the integration contract matters more than the formatter. Concrete integration plan:
  1. `memory_review`: in-memory DB test proves one graded review updates `stability`, `difficulty`, `last_review`, `review_count`, and leaves other rows untouched.
  2. Search-side strengthening: prove `trackAccess=false` is read-only, `trackAccess=true` writes exactly once per returned row, and failures do not corrupt response payloads.
  3. Cursor/scope: prove continuation cursors are reusable only inside original tenant/user/shared-space scope.
  4. Doctor/debug overlays: prove additive response shape only, never replacing canonical `memory_health`/`memory_search` contracts.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary

### Finding 3: Retrieval changes need a judged memory-quality regression suite, not just unit coverage
- **Source**: [bm25-baseline.vitest.ts:440](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/bm25-baseline.vitest.ts#L440), [memory-state-baseline.vitest.ts:58](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-state-baseline.vitest.ts#L58), [result-confidence-scoring.vitest.ts:106](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts#L106), [result-confidence-scoring.vitest.ts:217](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts#L217), [manual_testing_playbook.md:266](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md#L266)
- **What it does**: Public already has the primitives for judged evaluation: BM25 baseline runs, persisted baseline snapshots, confidence scoring, and manual audit scenarios. That is enough to create a dedicated “memory-quality” gate for adoption work.
- **Why it matters**: Features like weak-result lexical fallback, connected-doc appendix, and explicit review surfaces can look correct locally while hurting actual ranking quality. Concrete regression plan:
  1. Build a fixed judged query set split by behavior: exact fact, stale fact, multi-hop, review/due-state, and weak-result recovery.
  2. Record baseline `MRR@5`, `NDCG@10`, `Recall@20`, top-result confidence mix, and memory-state snapshot.
  3. Require no global regression and targeted improvement on the slice the feature claims to help.
  4. For connected-doc hints, score both ranking metrics and “helpful appendix” metrics separately so appendix wins do not mask core retrieval regressions.
- **Recommendation**: NEW FEATURE
- **Impact**: high
- **Source strength**: primary

### Finding 4: Keep a small manual/e2e pack for sessioned and governance-heavy behaviors
- **Source**: [manual_testing_playbook.md:252](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md#L252), [manual_testing_playbook.md:284](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md#L284), [manual_testing_playbook.md:390](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md#L390), [memory-search-ux-hooks.vitest.ts:164](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts#L164), [memory-context.vitest.ts:358](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts#L358)
- **What it does**: Public already documents real-operator checks for `memory_context`, `memory_search`, `memory_match_triggers`, and `memory_validate`, while handler tests cover cursor and trace edge cases.
- **Why it matters**: A few behaviors are too cross-cutting for pure unit tests: real session reuse, trace-only session transition metadata, governed filtering, progressive disclosure cursors, and operator-visible validation flows. Concrete manual pack:
  1. Resume/session trace scenario.
  2. Search + continuation cursor scenario.
  3. Trigger matching under governed scope.
  4. Validation/review feedback loop scenario.
  5. Doctor/debug overlay scenario once added.
- **Recommendation**: adopt now
- **Impact**: medium
- **Source strength**: secondary

## Sources Consulted
- [external/internal/index/bm25.go:16](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/bm25.go#L16)
- [external/internal/index/cache.go:10](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go#L10)
- [external/internal/librarian/search.go:10](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go#L10)
- [external/internal/index/crossref.go:154](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go#L154)
- [external/internal/vault/facts.go:64](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go#L64), [external/internal/vault/facts.go:160](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go#L160)
- [external/internal/mcp/vault.go:21](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L21), [external/internal/mcp/vault.go:273](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L273), [external/internal/mcp/vault.go:885](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L885)
- [memory-search.ts:15](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L15), [fsrs-scheduler.ts:31](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts#L31), [stage2-fusion.ts:552](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L552)
- [cognitive-gaps.vitest.ts:69](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts#L69), [fsrs-hybrid-decay.vitest.ts:13](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-hybrid-decay.vitest.ts#L13), [stage1-expansion.vitest.ts:276](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts#L276), [stage2-fusion.vitest.ts:332](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts#L332)
- [memory-search-ux-hooks.vitest.ts:136](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts#L136), [memory-context.vitest.ts:300](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts#L300), [tool-input-schema.vitest.ts:243](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts#L243), [handler-checkpoints.vitest.ts:555](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts#L555)
- [bm25-baseline.vitest.ts:440](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/bm25-baseline.vitest.ts#L440), [memory-state-baseline.vitest.ts:58](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-state-baseline.vitest.ts#L58), [result-confidence-scoring.vitest.ts:106](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts#L106)
- [manual_testing_playbook.md:252](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md#L252), [manual_testing_playbook.md:266](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md#L266), [manual_testing_playbook.md:390](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md#L390)

## Assessment
- **New information ratio**: 0.22
- **Questions addressed**: how to test review math; how to test search-side reinforcement; how to test connected-result and expansion behavior; how to catch retrieval-quality regressions; which behaviors still need manual/e2e verification.
- **Questions answered**: pure math/routing belongs in deterministic unit tests; operator side effects and scope belong in mocked DB/handler integration tests; ranking changes need judged regression metrics and persisted baselines; session/governance/response-shape behaviors need a small manual/e2e pack.
- **Novelty justification**: Earlier iterations ranked what to ship; this pass maps those decisions onto a concrete, layered verification strategy using live Public test infrastructure rather than generic advice.
- **Validation check**: `validate.sh --strict` on the phase folder returned `RESULT: PASSED`; in this read-only environment it also emitted `cannot create temp file for here document: Operation not permitted`, but the validator still reported zero errors and zero warnings.

## Ruled Out
- Treating end-to-end MCP tests as the primary gate for ranking/review logic, because they are weaker at isolating math and write-contract failures.
- Approving ranking-affecting features with snapshot-only string assertions, because ordering, score margins, and side effects need behavioral assertions.
- Copying Modus’s search-triggered reinforcement without opt-in write-path tests, because Public has stricter governance and read/write separation expectations.
- Using only manual playbook coverage for retrieval changes, because judged regression metrics already exist and should be used as release gates.

## Reflection
- **What worked**: Reading current Public test files alongside the external source exposed the right seam map quickly: math and routing already have good unit patterns, while session/governance concerns already have handler/manual scaffolding.
- **What did not work**: CocoIndex and memory MCP calls were not usable in this run, so I had to fall back to direct file reads and `rg` sweeps.
- **What I would do differently**: Next pass, convert this layered strategy into a file-by-file test matrix for `memory_review`, doctor/debug overlays, connected-doc appendix, and weak-result lexical fallback.

## Recommended Next Focus
Translate the adopt-now items into an implementation test matrix: `memory_review` contract tests first, doctor/debug additive-response tests second, then a judged regression pack for connected-doc hints and weak-result lexical fallback.
