# Iteration 001 — Backend-Agnostic Tracer Contract

Date: 2026-04-09

## Research question
Does Agent Lightning define a minimal, backend-agnostic tracing seam that `system-spec-kit` could prototype around existing agent workflows without rewriting agent logic?

## Hypothesis
Agent Lightning likely separates tracing from agent business logic cleanly enough that Public could borrow the seam as an optional instrumentation layer, but only as a prototype because Public's current agent stack is prompt-and-protocol driven rather than runtime-span driven.

## Method
I read the Agent Lightning README architecture section, the tracer base contract, the tracer type definitions, the bird's-eye architecture walkthrough, and the Claude Code example README. I compared those sources against Public's orchestration and deep-research agent contracts plus the `system-spec-kit` skill contract. CocoIndex was unavailable in this checkout, so I used direct line-numbered reads and exact file inspection instead.

## Evidence
- Agent Lightning's README says agents keep running "as usual," while users can either drop in lightweight `agl.emit_xxx()` helpers or let the tracer collect prompts, tool calls, and rewards, which then flow into `LightningStore`; the algorithm reads those spans and the trainer ties store, runner, algorithm, and inference updates together. [SOURCE: external/README.md:65-69]
- The abstract `Tracer` contract is backend-agnostic and centers on `trace_context(...)`, `get_last_trace()`, `create_span(...)`, `operation_context(...)`, optional framework handlers like `get_langchain_handler()`, and a `lifespan(...)` wrapper that binds a store and worker lifecycle. [SOURCE: external/agentlightning/tracer/base.py:27-39] [SOURCE: external/agentlightning/tracer/base.py:64-81] [SOURCE: external/agentlightning/tracer/base.py:108-115] [SOURCE: external/agentlightning/tracer/base.py:134-174] [SOURCE: external/agentlightning/tracer/base.py:193-226]
- Agent Lightning's tracer data model is explicitly an OpenTelemetry-aligned serialization layer: `SpanContext`, `TraceStatus`, `Event`, `SpanCoreFields`, `SpanRecordingContext`, and `Span` normalize timestamps, context, status, attributes, and extra fields for persistence and analytics. [SOURCE: external/agentlightning/types/tracer.py:42-53] [SOURCE: external/agentlightning/types/tracer.py:95-140] [SOURCE: external/agentlightning/types/tracer.py:143-185] [SOURCE: external/agentlightning/types/tracer.py:213-248] [SOURCE: external/agentlightning/types/tracer.py:251-257]
- The architecture guide says the tracer lives inside the runner, automatically instruments key methods, enters `trace_context` before agent invocation, streams finished spans back to the store, and can capture an additional reward span when the rollout returns a numeric reward. [SOURCE: external/docs/deep-dive/birds-eye-view.md:93-125]
- The Claude Code example reinforces the "wrap, don't rewrite" claim: the example launches a Lightning Store, an LLM proxy, and a Claude Code controller around the agent, then turns collected traces into datasets when richer token metadata exists. [SOURCE: external/examples/claude_code/README.md:5-12] [SOURCE: external/examples/claude_code/README.md:37-43] [SOURCE: external/examples/claude_code/README.md:105-112]
- Public's orchestrator contract is prompt-protocol oriented: it is the single point of accountability, primarily orchestrates through task delegation, and is instructed not to perform implementation or direct exploration itself. There is no comparable runtime tracing seam or span schema in the orchestration contract. [SOURCE: .opencode/agent/orchestrate.md:22-37] [SOURCE: .opencode/agent/orchestrate.md:49-60]
- Public's deep-research agent likewise describes a file-based iteration loop that reads state, performs 3-5 research actions, writes iteration markdown, appends JSONL, and progressively updates synthesis. Its core state is externalized artifacts rather than runtime traces. [SOURCE: .opencode/agent/deep-research.md:22-33] [SOURCE: .opencode/agent/deep-research.md:48-60] [SOURCE: .opencode/agent/deep-research.md:121-172]
- `system-spec-kit` itself is centered on documentation, validation, and context preservation contracts for file modifications. It mandates spec folders and reserves `research/research.md` for deep-research output, but it does not define any span or trace lifecycle comparable to Agent Lightning's tracer contract. [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:10-13] [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:61-73]

## Analysis
Agent Lightning's tracer seam is genuinely narrow: it does not require the agent to adopt the full training stack, only to run inside a traced context where spans can be created, recorded, and forwarded into a store. That is what makes the README's near-zero-code-change claim plausible rather than purely aspirational. The seam is also more than just a callback hook, because it standardizes span identity, status, attributes, and operation recording in a way that downstream adapters and algorithms can consume.

Public does not currently have an equivalent runtime seam. Its agents are specified as behavioral contracts in markdown and operate through command workflows, file state, and memory or validation surfaces. That means the tracer pattern is not an `adopt now` fit: there is no existing span consumer, no store for trace events, and no agreed Public trace schema. But the seam is still relevant because it shows how Public could add observability around agent executions without rewriting the prompt contracts themselves. A small optional tracing layer around orchestrated agent runs would be complementary to current spec-folder and memory flows, not a replacement for them.

## Conclusion
confidence: medium

finding: Agent Lightning does define a minimal, backend-agnostic tracer contract that could be prototyped around Public's existing agent workflows without rewriting the agents themselves. The key transferable idea is not "adopt OpenTelemetry everywhere" but "introduce one optional trace context plus a canonical span envelope so agent workflows can emit structured execution evidence." Public is not ready for direct adoption because it lacks a trace consumer and a runtime store, but the contract is strong enough to justify a prototype around `.opencode/agent/` workflows if future phases want RL or evaluator-grade execution telemetry.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/agent/orchestrate.md`
- **Change type:** architectural shift
- **Blast radius:** medium
- **Prerequisites:** define a Public span schema, identify a trace consumer, and decide whether traces live alongside Spec Kit Memory artifacts or in a separate telemetry store
- **Priority:** should-have

## Counter-evidence sought
I looked for an existing Public runtime tracing seam in `.opencode/agent/orchestrate.md`, `.opencode/agent/deep-research.md`, and `.opencode/skill/system-spec-kit/SKILL.md` and did not find one. I also looked for evidence that Agent Lightning requires invasive agent rewrites, but the tracer contract and Claude Code example both support a wrapper-style integration instead. None found that would overturn the prototype-later recommendation.

## Follow-up questions for next iteration
- How does `LightningStore` model rollout, attempt, worker, and span identifiers, and would any subset map cleanly to Public's phase or session concepts?
- Where do reward values attach relative to spans and attempts, and could Public reuse that pattern for evaluator or review feedback?
- Does Agent Lightning's store or runner contract expose a better separation between lifecycle hooks and finalization than Public's current file-based workflows?
