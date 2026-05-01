# Iteration 006 — Selective Multi-Agent Targeting

Date: 2026-04-09

## Research question
Does Agent Lightning's selective multi-agent targeting reveal a precise, RL-specific improvement Public could adopt without drifting into phase 005's generic multi-agent loop scope?

## Hypothesis
Agent Lightning probably distinguishes agent selection at the data and adapter layer, not the scheduler layer. If so, Public's reusable lesson will be stable agent-role labeling for evaluation, not new orchestration machinery.

## Method
I read Agent Lightning's public claims around selective optimization, the triplet adapter's agent-name extraction and subtree filtering logic, and the SQL-agent tutorial that shows targeted optimization of specific agents. I compared that to Public's orchestrator and deep-loop role definitions to see whether Public already distinguishes agent roles in a machine-readable way.

## Evidence
- Agent Lightning explicitly promises that users can "selectively optimize one or more agents in a multi-agent system." [SOURCE: external/README.md:20-23]
- The triplet adapter extracts agent identity from framework-specific span attributes such as `agent.name`, `recipient_agent_type`, `langchain.chain.type`, `executor.id`, and other normalized fallbacks. [SOURCE: external/agentlightning/adapter/triplet.py:317-359]
- The adapter then uses `agent_match` to keep only spans within matching agent subtrees when selecting LLM calls for trajectory generation. [SOURCE: external/agentlightning/adapter/triplet.py:398-476] [SOURCE: external/agentlightning/adapter/triplet.py:702-733]
- The SQL-agent guide shows the intended use directly: `agent_match` can target `"write"`, `"write|check"`, or `None`, allowing optimization of only the agents whose behavior matters for the chosen learning objective. [SOURCE: external/docs/how-to/train-sql-agent.md:234-239]
- Public's orchestrator already distinguishes agent roles at the workflow layer, with explicit routing for `@context`, `@deep-research`, `@review`, `@speckit`, and others, plus single-hop depth rules. [SOURCE: .opencode/agent/orchestrate.md:24-36] [SOURCE: .opencode/agent/orchestrate.md:42-46] [SOURCE: .opencode/agent/orchestrate.md:95-117]
- Public's deep-review loop is dimension-aware and structured, but its machine-owned outputs are centered on findings and dimension coverage rather than on stable agent-role identifiers. [SOURCE: .opencode/agent/deep-review.md:23-31] [SOURCE: .opencode/agent/deep-review.md:145-180]
- Public's deep-research state model supports `focusTrack`, but that field is optional topical labeling, not a stable delegated-agent identity carried from orchestrator dispatch into evaluation surfaces. [SOURCE: .opencode/agent/deep-research.md:167-189]

## Analysis
Agent Lightning's selective optimization feature is not primarily about more sophisticated multi-agent scheduling. It is about preserving enough agent identity inside the trace so downstream learning logic can target only the relevant slices. Public already has strong role separation at the prompt and workflow layer, but it does not consistently project those roles into machine-readable evaluation artifacts.

That makes the transferable lesson surprisingly small and useful: if Public wants future evaluator-grade telemetry, it should standardize agent-role labels in the artifacts emitted by delegated workflows. That would preserve the RL-specific part of Agent Lightning's idea, targeted evaluation and optimization, without trespassing into phase 005's more general loop and council patterns.

## Conclusion
confidence: high

finding: Agent Lightning's selective optimization pattern is relevant to Public only at the identity-labeling layer. Public should not import new multi-agent orchestration machinery from this repo, but it should consider projecting stable agent-role identifiers from the orchestrator into downstream research, review, and future telemetry artifacts so targeted evaluation becomes possible later.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/agent/orchestrate.md`
- **Change type:** modified existing
- **Blast radius:** medium
- **Prerequisites:** define a stable agent-role label vocabulary and decide which packet artifacts should carry it
- **Priority:** should-have

## Counter-evidence sought
I looked for an existing machine-readable agent-role field in Public's deep-research and deep-review iteration contracts and found only dimension or focus labels, not stable delegated-agent identifiers. I also looked for evidence that Agent Lightning's selectivity came from scheduler logic rather than trace filtering, and the adapter/tutorial evidence points to trace-level selection instead.

## Follow-up questions for next iteration
- Are Agent Lightning's zero-code-change framework wrappers analogous to Public's hook system, or are they solving different layers?
- Which operational metrics from Agent Lightning would most improve Public's research and review dashboards?
- Should Public adopt any of Agent Lightning's resource versioning ideas, or would that duplicate the current template source-of-truth model?
