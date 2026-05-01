---
title: "01 [system-spec-kit/z_future/hybrid-rag-fusion-upgrade/002-hybrid-rag-adoption/015-rrf-hybrid-retrieval-evaluation/spec]"
description: "Benchmarks Mnemosyne's documented BM25/vector/RRF story against Public's existing hybrid retrieval stack."
trigger_phrases:
  - "spec"
  - "015"
  - "rrf"
importance_tier: "important"
contextType: "implementation"
---
# 015-rrf-hybrid-retrieval-evaluation: Evaluate RRF Hybrid Retrieval

## 1. Scope
This sub-phase investigates whether Mnemosyne's documented BM25/vector/RRF pattern exposes any retrieval or operability gap that Public has not already closed. It is a measurement packet, not a plugin or wrapper proposal: the core question is whether current Public hybrid retrieval already covers the value, and what benchmark lanes are required to prove that. It does not ship a Mnemosyne-style facade.

## 2. Research Sources
- `001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-022.md:54-57`
- `001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-029.md:2945-2950`
- `001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-038.md:9218-9220`
- `001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-038.md:9257-9261`

## 3. Architecture Constraints
- Public's existing hybrid retrieval remains authoritative throughout the study.
- Any evaluation must distinguish wrapper ergonomics from backend ranking claims.
- A future facade, if any, must delegate to current Public handlers instead of introducing a second retrieval engine.

## 4. Investigation Questions
- Does Public's current RRF-based hybrid stack already outperform or match the documented Mnemosyne contract on representative memory queries?
- Which benchmark lanes are still missing: contract-fast, sqlite-integration, retrieval-regression, cold-start, or compaction-continuity?
- What p50/p95, recall, ablation, and operability thresholds would make a future facade worth considering?
- Are any remaining gaps actually about retrieval, or are they operator ergonomics and cold-start costs only?

## 5. Success Criteria
- The packet defines a benchmark pack that compares current Public hybrid retrieval against a Mnemosyne-shaped contract without duplicating runtime code.
- The packet names the exact retrieval, eval, and RRF test files that would host follow-on work.
- The packet ends with a clear decision gate: keep current retrieval as sufficient, prototype a bounded evaluation harness, or reject further work.

## 6. Out of Scope
- Shipping an OpenCode Mnemosyne plugin for Public.
- Replacing current hybrid retrieval with a second RRF engine.
- Treating README-level backend claims as already-proven runtime behavior.
