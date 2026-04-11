---
title: "016-connected-doc-hints-investigation: Investigate Connected-Doc Hints"
description: "Evaluates whether Modus-style connected-doc appendices belong in Public only as low-authority result hints."
---

# 016-connected-doc-hints-investigation: Investigate Connected-Doc Hints

## 1. Scope
This sub-phase investigates whether Modus-style connected-doc hints should exist in Public only as a low-authority appendix to search results. It focuses on hint labeling, trigger thresholds, merge rules, and benchmark design so that any future hint layer stays subordinate to current graph and causal authorities. It does not ship a new result channel.

## 2. Research Sources
- `001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-022.md:47-51`
- `001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-038.md:32-36`
- `001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-040.md:19-20`
- `001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-040.md:40-41`

## 3. Architecture Constraints
- Connected-doc material remains an appendix, not a ranked retrieval lane.
- Existing causal and graph surfaces keep semantic authority; hinting must not compete with them.
- Any future hint layer must be explicitly labeled as low-authority and bounded to `memory_search`.

## 4. Investigation Questions
- What should trigger connected-doc hints: weak-result recovery, explicit debug mode, always-on appendix, or none?
- How should hint provenance and labeling work so operators can tell appendix material from ranked results?
- Which merge rules prevent duplicate or contradictory context when graph, causal, and memory hints overlap?
- What judged-relevance and latency thresholds would justify a prototype?

## 5. Success Criteria
- The packet defines a hint trigger matrix and appendix labeling contract.
- The packet points to the exact search, graph, and schema files that would host follow-on work.
- The packet ends with a clear exit condition: prototype a flag-only appendix, keep the idea deferred, or reject it.

## 6. Out of Scope
- Promoting connected-doc hints to a first-class ranking channel.
- Replacing graph or causal traversal with adjacency hints.
- Shipping lexical fallback as part of this packet.
