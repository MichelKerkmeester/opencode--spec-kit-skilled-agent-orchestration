---
title: "017-temporal-knowledge-graph-investigation: Investigate Temporal Knowledge Graphs"
description: "Designs the narrowest safe temporal-fact sidecar inspired by MemPalace without creating a second truth authority."
---

# 017-temporal-knowledge-graph-investigation: Investigate Temporal Knowledge Graphs

## 1. Scope
This sub-phase investigates whether Public should ever add a bounded temporal-fact sidecar inspired by MemPalace's separate temporal knowledge graph. It focuses on schema boundaries, citation requirements, invalidation workflow, and maintenance contracts so the idea can be judged as a narrow utility rather than a second memory authority. It does not ship temporal fact storage.

## 2. Research Sources
- `001-research-hybrid-rag-fusion-systems/005-mempalace/research/iterations/iteration-022.md:61-65`
- `001-research-hybrid-rag-fusion-systems/005-mempalace/research/iterations/iteration-038.md:55-59`
- `001-research-hybrid-rag-fusion-systems/005-mempalace/research/iterations/iteration-040.md:72-76`

## 3. Architecture Constraints
- The temporal sidecar, if it ever exists, must stay separate from ordinary memory writes and searches.
- Evidence citation, invalidation, and correction review are mandatory from day one.
- The sidecar must not compete with current `memory_search`, `memory_context`, or save authority.

## 4. Investigation Questions
- Which fact shapes belong in a temporal sidecar at all: only time-bounded facts, or broader assertions?
- What is the minimum schema for valid-from, valid-to, evidence links, authority tiers, invalidation reason, and correction provenance?
- How should timeline queries surface without becoming a second general-purpose retrieval path?
- What maintenance and governance workflow would keep temporal facts accurate and revocable?

## 5. Success Criteria
- The packet defines a minimal schema and authority boundary for temporal facts.
- The packet defines evidence, invalidation, and correction requirements strong enough to avoid a second truth surface.
- The packet ends with a clear exit condition: open a dedicated NEW FEATURE design packet, keep the idea deferred, or reject it.

## 6. Out of Scope
- Shipping a knowledge-graph database.
- Writing uncited fact rows from ordinary save flows.
- Adding timeline or fact search to the primary memory retrieval path.
