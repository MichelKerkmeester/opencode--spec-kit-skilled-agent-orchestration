---
title: "002-hybrid-rag-adoption: Hybrid RAG Adoption"
description: "Executive synthesis of the completed five-system research into nine adopt-now sub-phases plus nine investigation sub-phases for Public."
---

# 002-hybrid-rag-adoption: Hybrid RAG Adoption

## 1. Scope
This packet converts the completed `001-research-hybrid-rag-fusion-systems` work into two coordinated tracks: nine implementation-ready adopt-now sub-phases and nine investigation sub-phases that answer the remaining prototype-later, measurement, and new-feature questions without widening current scope. It preserves Public's current authorities and only imports proven patterns as thin facades. The adopt-now track covers authority freezing, `memory_review`, JSON-primary save ergonomics, compaction preservation, bootstrap guidance, doctor/debug overlays, workflow routing guidance, rollout evidence gates, and a bounded prototype backlog. The investigation track covers passive capture, tool-profile bundling, drift-checker applicability, FSRS decay defaults, BM25 field weighting, RRF/hybrid evaluation, connected-doc hints, temporal facts, and wake-up layering.

### Sub-Phases And Dependencies
#### Adoption Track
- `001-architecture-boundary-freeze`: prerequisite for every other sub-phase because it locks the "import patterns, not backends" rule.
- `002-memory-review-tool`: depends on `001`; establishes the first new helper surface using existing FSRS and validation primitives.
- `003-save-ergonomics`: depends on `001`; wraps `generate-context.js` without changing save authority.
- `004-compaction-checkpointing`: depends on `001` and `003`; reuses JSON-primary save authority during compaction.
- `005-bootstrap-guidance`: depends on `001`; teaches at existing `session_bootstrap` and startup surfaces.
- `006-doctor-debug-overlay`: depends on `001`; summarizes existing health, validation, and routing evidence without creating a new repair authority.
- `007-workflow-guidance-map`: depends on `001`; maps operator tasks to existing tools and new thin facades.
- `008-rollout-evidence-gates`: depends on `001` and should be finalized after `002` through `007` define the surfaces being gated.
- `009-prototype-backlog`: depends on `001` and `008`; records flag-only prototypes such as connected-doc hints, bounded lexical fallback, and temporal-fact follow-up candidates.

#### Investigation Track
- `010-passive-capture-investigation`: depends on `001`; evaluates whether Engram-style close-session or passive capture can wrap `generate-context.js` without creating a second save authority.
- `011-tool-profile-split-investigation`: depends on `001`; evaluates whether Engram-style agent/admin tool bundles should exist only as a delivery-layer packaging experiment.
- `012-drift-detection-evaluation`: depends on `001`; determines which Mex checker families belong on Public spec and memory surfaces beyond the already-approved advisory trio.
- `013-fsrs-memory-decay-study`: depends on `001` and `002`; measures whether any Modus-inspired FSRS default changes are justified before adopting a due-state or review-queue contract.
- `014-bm25-field-weight-evaluation`: depends on `001`; measures whether Modus-style field weighting would improve constrained lexical retrieval without re-architecting hybrid search.
- `015-rrf-hybrid-retrieval-evaluation`: depends on `001`; benchmarks Mnemosyne's documented BM25/vector/RRF story against Public's current hybrid stack and retrieval-regression lanes.
- `016-connected-doc-hints-investigation`: depends on `001` and `009`; measures whether Modus-style connected-doc appendices improve operator trust without competing with graph or causal authority.
- `017-temporal-knowledge-graph-investigation`: depends on `001` and `009`; designs the narrowest safe temporal-fact sidecar and authority boundary before any NEW FEATURE proposal advances.
- `018-wake-up-context-layering-study`: depends on `001` and `005`; evaluates whether a bounded wake-up formatter on top of `session_bootstrap` improves recovery versus today's bootstrap surfaces.

## 2. Research Basis
- Cross-phase consensus on scoped surfaces, layered continuity, explicit hygiene, and backend rejection: `001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-039.md:7-45`, `001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-039.md:7-45`, `001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-039.md:7-53`, `001-research-hybrid-rag-fusion-systems/005-mempalace/research/iterations/iteration-039.md:7-53`.
- Ranked delivery portfolio and first-move ordering: `001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-040.md:1-44`, `001-research-hybrid-rag-fusion-systems/005-mempalace/research/iterations/iteration-040.md:88-158`.
- Mnemosyne late-iteration adoption boundary for compaction guidance, safe aliases, and non-goals: `001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-039.md:224-235`, `001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-040.md:117-137`.
- Investigation backlog for prototype-later and NEW FEATURE seams: `001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-038.md:31-35`, `001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-038.md:8-27`, `001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-038.md:16-36`, `001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-038.md:9218-9261`, `001-research-hybrid-rag-fusion-systems/005-mempalace/research/iterations/iteration-038.md:39-59`.

## 3. Architecture Constraints
- Keep `memory_search`, `memory_context`, `memory_match_triggers`, `session_bootstrap`, `generate-context.js`, CocoIndex, code graph, causal links, and health/status tooling as the authorities.
- New UX must compile into existing authorities instead of introducing a competing backend, router, or lifecycle owner.
- Retrieval and code intelligence stay separate: memory helpers must not absorb CocoIndex or code-graph ownership.
- Compaction and bootstrap improvements must be fail-open, provenance-aware, and governance-backed.

## 4. Success Criteria
- All eighteen sub-phases have `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` files grounded in cited research.
- The adoption track remains implementation-oriented, while the investigation track names measurable experiments, decision criteria, and exit conditions instead of premature implementation commitments.
- Parent docs make sequencing and dependency order explicit enough that a future implementation pass can start with `001` and proceed without reopening the research.
- Decision records lock the six architectural choices the research settled.
- The packet names explicit non-goals so future work does not reinterpret the research as backend-replacement approval.

## 5. Explicit Non-Goals
- Replacing Public's retrieval, save, bootstrap, graph, or governance backends with Engram, Mex, Modus, Mnemosyne, or MemPalace substrates.
- Treating investigation-track phases as approval to ship those ideas immediately.
- Treating markdown-first authority, raw-verbatim-by-default storage, palace taxonomy, `core=true`, basename scope, or periodic blocking hooks as approved Public architecture.
- Modifying any files outside `002-hybrid-rag-adoption/` in this packet-creation pass.
