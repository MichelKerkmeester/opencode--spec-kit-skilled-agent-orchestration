# Iteration 016 — Should Memory Pivot To A Store-Centric Runtime?

Date: 2026-04-10

## Research question
Should `system-spec-kit` pivot its memory architecture away from file-first markdown plus SQLite indexing and toward an Agent-Lightning-style store-centric runtime?

## Hypothesis
The external store model is powerful for training rollouts and telemetry-heavy execution, but it is probably the wrong center of gravity for Public's auditable, human-readable memory system.

## Method
I revisited the external store contract and compared it against `system-spec-kit`'s memory architecture, especially the role of generated memory files, indexed spec docs, constitutional rules, and the JSON-primary `generate-context` workflow.

## Evidence
- Agent Lightning's `LightningStore` is explicitly the persistent control plane for rollout lifecycle, attempt tracking, span ingest, and immutable resource versioning. [SOURCE: external/agentlightning/store/base.py:104-124]
- The store expects queueing, attempts, sequence IDs, OTLP traces, and resource snapshots as central runtime concepts. [SOURCE: external/agentlightning/store/base.py:158-220] [SOURCE: external/agentlightning/store/base.py:330-384] [SOURCE: external/agentlightning/store/base.py:681-710]
- `system-spec-kit`'s memory system is built around indexed memory files, constitutional rules, and spec documents, with SQLite acting as search/index infrastructure rather than the user-facing source of truth. [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:17-27] [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:38-57]
- The memory system already distinguishes generated memory files from the runtime index, and `memory_save()` is described as an indexing step after `generate-context.js`. [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:103-110]
- `generate-context.js` is explicitly JSON-primary and writes a human-readable memory artifact into the spec folder's `memory/` directory. [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:51-79]

## Analysis
The external repo's store makes sense because Agent Lightning is optimizing live execution and training trajectories. Its control plane is the product. In `system-spec-kit`, the product is different: durable, inspectable, auditable context aligned to spec folders and human workflows. The search index matters, but it is not the artifact humans collaborate around.

That means a direct architectural pivot would be a mistake. Moving Public to a store-centric runtime would make memory less transparent, would weaken spec-folder locality, and would blur the distinction between human-authored or AI-authored context and machine-owned search infrastructure. The transferable lesson is smaller: continue clarifying the boundary between source artifacts and derived indexes, but do not invert the architecture.

## Conclusion
confidence: high

finding: `system-spec-kit` should reject a store-centric memory pivot. The current file-first, auditable memory architecture is better aligned to Public's purpose. Improvements should happen in projection layers, indexing, and reducer boundaries, not by replacing markdown plus spec-folder locality with a runtime store as the new source of truth.

## Adoption recommendation for system-spec-kit
- **Target file or module:** memory architecture
- **Change type:** rejected pivot
- **Blast radius:** architectural
- **Prerequisites:** none
- **Priority:** rejected

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** Memory is anchored in generated markdown artifacts, constitutional docs, and indexed spec documents, with SQLite used as a retrieval backend.
- **External repo's approach:** A runtime store is the canonical control plane for attempts, spans, resources, and trajectory reconstruction.
- **Why the external approach might be better:** It is stronger for live execution telemetry, queueing, and training-oriented runtime control.
- **Why system-spec-kit's approach might still be correct:** Public's memories need to be inspectable, reviewable, path-local, and durable in repo-like workflows rather than opaque runtime state.
- **Verdict:** KEEP
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** n/a
- **Blast radius of the change:** n/a
- **Migration path:** n/a

## Counter-evidence sought
I looked for evidence that Public's current memory system is already collapsing under its file-first model, but the strongest pain points observed elsewhere in the repo are around validation, routing, and indexing quality rather than the existence of markdown artifacts. I also looked for an external pattern that preserved human-readable artifacts as first-class outputs while still using the store as the source of truth and did not find a convincing equivalent.

## Follow-up questions for next iteration
- If memory stays file-first, which agent/runtime surfaces are still over-factored?
- Can Public define a cleaner adapter boundary between memory artifacts and search/index projections?
- Which parts of the current memory workflow feel heavyweight because of UX rather than architecture?
