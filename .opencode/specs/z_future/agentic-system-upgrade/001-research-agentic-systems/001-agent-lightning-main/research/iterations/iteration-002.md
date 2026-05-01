# Iteration 002 — Rollout And Attempt Control Plane

Date: 2026-04-09

## Research question
Does Agent Lightning's rollout, attempt, worker, and resource lifecycle model offer a control-plane pattern that `system-spec-kit` should adopt for long-running workflows?

## Hypothesis
The full `LightningStore` abstraction is probably too heavy for Public, but its attempt-status and worker-liveness model may be useful for `deep-research` and similar long-running command workflows.

## Method
I read the `LightningStore` contract, the store deep-dive documentation, and the core rollout, attempt, worker, and resource types. I compared those contracts against Public's `/spec_kit:deep-research` command, `session-resume` handler, and `generate-context` workflow to see whether Public already has equivalent lifecycle tracking or would benefit from importing a subset of it.

## Evidence
- Agent Lightning defines `LightningStore` as the persistent control plane that coordinates rollout lifecycle, attempt tracking, span ingest, and immutable resource versioning. It explicitly models rollout status changes, attempt heartbeats and retries, and exposes store capabilities and statistics. [SOURCE: external/agentlightning/store/base.py:59-72] [SOURCE: external/agentlightning/store/base.py:75-123]
- The store contract distinguishes `start_rollout` from `enqueue_rollout`, creates an initial attempt with sequence and timestamps, and treats `dequeue_rollout` as a FIFO claim that also refreshes worker telemetry. [SOURCE: external/agentlightning/store/base.py:158-198] [SOURCE: external/agentlightning/store/base.py:200-232] [SOURCE: external/agentlightning/store/base.py:250-275]
- The store deep-dive makes the outside-versus-inside split explicit: rollouts are the user-facing work unit, attempts are the retried executions, spans are ordered by monotonic sequence per `(rollout_id, attempt_id)`, resources are versioned bundles, and workers track heartbeat, dequeue, busy, and idle transitions. [SOURCE: external/docs/deep-dive/store.md:3-20] [SOURCE: external/docs/deep-dive/store.md:74-82] [SOURCE: external/docs/deep-dive/store.md:129-148]
- Attempt status transitions are small and operationally clear: `preparing -> running -> succeeded|failed|timeout|unresponsive`, with watchdog checks and revival from `unresponsive` back to `running` when spans resume. Rollout status is an aggregated view layered on top of attempts plus requeue and cancel logic. [SOURCE: external/docs/deep-dive/store.md:22-72] [SOURCE: external/docs/deep-dive/store.md:84-127]
- The core types formalize that split: `Rollout` carries input, mode, resources, config, and metadata; `Attempt` carries sequence, worker, heartbeat, and terminal state; `Worker` tracks status plus timestamps and current assignment; `RolloutConfig` controls timeout, unresponsive windows, max attempts, and retry conditions. [SOURCE: external/agentlightning/types/core.py:109-130] [SOURCE: external/agentlightning/types/core.py:136-170] [SOURCE: external/agentlightning/types/core.py:174-207] [SOURCE: external/agentlightning/types/core.py:233-256]
- Agent Lightning's resources are versioned and typed, including prompt templates and proxy-backed LLM endpoints that can encode rollout and attempt identifiers into routed endpoints. [SOURCE: external/agentlightning/types/resources.py:36-72] [SOURCE: external/agentlightning/types/resources.py:101-143] [SOURCE: external/agentlightning/types/resources.py:192-204]
- Public's `/spec_kit:deep-research` command has loop phases, state files, convergence rules, and memory save behavior, but it does not define an explicit attempt or worker status machine. Its outputs are spec-folder files and state logs rather than a queue-backed execution control plane. [SOURCE: .opencode/command/spec_kit/deep-research.md:115-155] [SOURCE: .opencode/command/spec_kit/deep-research.md:177-210] [SOURCE: .opencode/command/spec_kit/deep-research.md:252-260]
- Public's `session-resume` handler uses cached session summaries with freshness and fidelity decisions tied to transcript identity and token metadata, which is a different problem from attempt scheduling or retry control. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:41-85] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:191-249]
- Public's `generate-context` workflow is centered on spec-folder validation and structured session capture, not on execution-attempt coordination, heartbeat tracking, or resource versioning. [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:51-84] [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:85-125]

## Analysis
Agent Lightning's store is built for a very specific control-plane problem: asynchronous runners, retries, versioned resources, and telemetry-heavy training flows need a shared durable substrate. Public does not currently have that problem in full. Its deep-research and memory workflows are phase-local and file-driven, not queue-backed or multi-runner.

What does transfer well is the smaller attempt model. Public already runs long-lived loops such as `/spec_kit:deep-research`, but those loops primarily record coarse file artifacts and convergence state. They do not distinguish cleanly between "queued", "preparing", "running", "stuck", "timeout", and "recovered" execution attempts the way Agent Lightning does. That means overnight research or review runs have weaker operational diagnostics than they could. The resource versioning and routed proxy endpoints, by contrast, would be redundant today because Public is not swapping prompt or model resources through a centralized runtime store.

## Conclusion
confidence: high

finding: Agent Lightning's full `LightningStore` is too large a pattern for direct adoption in `system-spec-kit`, but its attempt-lifecycle subset is highly relevant. Public should not import queue, resource, and multi-runner abstractions wholesale, yet it would benefit from a smaller execution-state vocabulary for long-running workflows such as `/spec_kit:deep-research` and `/spec_kit:deep-review`, especially around preparing, running, timeout, stuck, and retry or resume conditions.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/deep-research.md`
- **Change type:** modified existing
- **Blast radius:** medium
- **Prerequisites:** define a packet-local attempt schema for JSONL state and decide which statuses map to resume, retry, timeout, and stuck recovery in existing YAML workflows
- **Priority:** should-have

## Counter-evidence sought
I looked for an existing Public execution-state model in `/spec_kit:deep-research`, `session-resume`, and `generate-context`, and found only loop phases, cached-summary trust checks, and memory-save validation. I did not find queue-backed scheduling or attempt-heartbeat semantics that would make the Agent Lightning subset redundant. I also looked for evidence that Public needs full resource versioning or proxy endpoint routing now and found none.

## Follow-up questions for next iteration
- Where exactly do reward values enter Agent Lightning's trace and attempt lifecycle, and is that pattern useful for Public evaluator or review signals?
- How does `TracerTraceToTriplet` convert ordered spans into learning-ready data, and could Public use a similar adapter seam for research or review outcomes?
- Does the trainer keep algorithms decoupled enough that Public could borrow its pluggability pattern without inheriting the full RL runtime?
