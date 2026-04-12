# Iteration 004 — Adapter Boundary For Reducer Pipelines

Date: 2026-04-09

## Research question
Does Agent Lightning's adapter boundary expose a missing normalization layer between Public's raw deep-research artifacts and its downstream dashboards, registries, and summaries?

## Hypothesis
Agent Lightning probably earns a cleaner downstream architecture by forcing traces through an adapter before algorithms consume them. Public may be missing an equivalent reducer-normalization layer because its loop artifacts flow directly into state and synthesis surfaces.

## Method
I read Agent Lightning's generic adapter contract, the triplet adapter's trajectory conversion path, and the trainer/tutorial material that shows adapters converting spans into algorithm-ready payloads. I compared that pattern against Public's deep-research and deep-review loop contracts, especially the reducer-owned JSONL, dashboard, registry, and synthesis surfaces.

## Evidence
- Agent Lightning defines an explicit adapter protocol: adapters are callable transformation objects whose entire job is to convert source data into a downstream consumer format. `TraceAdapter` specializes that contract for lists of stored spans. [SOURCE: external/agentlightning/adapter/base.py:13-20] [SOURCE: external/agentlightning/adapter/base.py:69-94]
- The architecture guide says algorithms query spans, extract triplets, and then convert those triplets again into the format expected by the underlying RL library. The adapter is a deliberate seam between observation and learning. [SOURCE: external/docs/deep-dive/birds-eye-view.md:312-317] [SOURCE: external/docs/deep-dive/birds-eye-view.md:333-356]
- `TraceTree.to_trajectory()` shows the conversion work is non-trivial: it identifies matching LLM calls, filters by agent subtree, deduplicates calls, attaches rewards, and only then emits ordered triplets. [SOURCE: external/agentlightning/adapter/triplet.py:398-476] [SOURCE: external/agentlightning/adapter/triplet.py:702-758]
- Agent Lightning also ships alternate adapters such as `TraceToMessages`, reinforcing that the downstream payload is intentionally swappable rather than hardwired to one trace consumer. [SOURCE: external/docs/how-to/train-first-agent.md:188-212]
- Public's deep-research contract externalizes state to JSONL and explicitly says the workflow reducer refreshes strategy, registry, and dashboard from the iteration artifact and state record. The loop owns synchronized outputs, but the contract does not name a typed normalization boundary between raw artifacts and reducer outputs. [SOURCE: .opencode/agent/deep-research.md:50-60] [SOURCE: .opencode/agent/deep-research.md:159-165] [SOURCE: .opencode/agent/deep-research.md:212-213]
- The command-level workflow likewise treats registry and dashboard as reducer-owned packet surfaces driven from the same packet state files. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:79-89] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:194-197]
- Public's deep-review loop mirrors the same pattern: iteration artifacts feed a dashboard and registry, but no typed adapter surface is called out between the iteration record and the synchronized review outputs. [SOURCE: .opencode/command/spec_kit/deep-review.md:164-169] [SOURCE: .opencode/agent/deep-review.md:49-57] [SOURCE: .opencode/agent/deep-review.md:231-235]

## Analysis
Agent Lightning's adapter seam matters because it prevents downstream consumers from becoming coupled to the exact trace representation. Public already has a reducer concept, but it is described operationally rather than as a stable data-transformation interface. That is acceptable while the packet surfaces are simple, but it becomes brittle once more consumers appear, such as richer dashboards, evaluators, lineage analyzers, or packet-to-packet comparison tools.

The main lesson is not "convert everything into triplets." It is "insert one typed normalization boundary before synchronized downstream outputs." In Public, that would mean a reducer or adapter module that consumes iteration JSONL plus markdown findings and emits a normalized structure for dashboard, registry, and final synthesis. That would make future metric additions easier and would reduce coupling between author-facing markdown formats and machine-owned state surfaces.

## Conclusion
confidence: high

finding: Agent Lightning's adapter pattern reveals a real architectural gap in Public's deep loop design. Public has reducer-owned outputs, but it does not yet advertise a stable normalization boundary between raw iteration artifacts and downstream machine-owned surfaces. Adding that seam would make dashboards, registries, and future evaluators safer to evolve without overfitting them to today's markdown and JSONL layout.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- **Change type:** new module
- **Blast radius:** medium
- **Prerequisites:** define a normalized research-iteration payload and decide whether deep-review shares the same reducer interface or a sibling one
- **Priority:** should-have

## Counter-evidence sought
I looked for an existing typed reducer or adapter contract in the deep-research and deep-review command or agent docs and found only reducer ownership and synchronized outputs, not a stable transformation interface. I also checked whether Agent Lightning's adapter was trivial glue, but `to_trajectory()` shows it performs substantive normalization work.

## Follow-up questions for next iteration
- Is Agent Lightning's trainer pluggability worth emulating in Public's loop drivers, or is it mostly training-specific overhead?
- How does Agent Lightning isolate one agent or subset of agents inside multi-agent traces, and can Public borrow that without importing generic loop architecture?
- What monitoring metrics from Agent Lightning would most improve Public's research and review dashboards?
