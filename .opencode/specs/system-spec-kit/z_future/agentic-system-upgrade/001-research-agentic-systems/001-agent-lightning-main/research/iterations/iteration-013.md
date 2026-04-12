# Iteration 013 — Recovery State Machine For Deep Loops

Date: 2026-04-10

## Research question
Does Agent Lightning's explicit readiness, error, and shutdown model suggest that `system-spec-kit`'s deep-loop runtime should be restructured around a richer state machine?

## Hypothesis
The external repo likely treats runtime readiness and failure as first-class events rather than as mostly post-hoc logs. If so, Public should refactor deep-research and deep-review around structured attempt events rather than relying so heavily on JSONL summaries after the fact.

## Method
I read the external server launcher, focusing on launch modes, child events, health checks, and shutdown semantics. I compared that with `system-spec-kit`'s deep-research command and deep-research agent contracts, especially the JSONL state model and documented error handling.

## Evidence
- Agent Lightning models server launch as explicit modes: `asyncio`, `thread`, and `mp`, with typed startup and shutdown parameters. [SOURCE: external/agentlightning/utils/server_launcher.py:32-70]
- The launcher emits structured child events with `ready` and `error` kinds plus exception metadata. [SOURCE: external/agentlightning/utils/server_launcher.py:73-84]
- Startup waits for readiness, optionally probes a health endpoint, and can kill an unhealthy server after timeout. [SOURCE: external/agentlightning/utils/server_launcher.py:138-208]
- Threaded and subprocess modes both wait for explicit ready/error events and treat missing startup signals as hard failures that trigger shutdown. [SOURCE: external/agentlightning/utils/server_launcher.py:845-889] [SOURCE: external/agentlightning/utils/server_launcher.py:911-1007]
- Shutdown paths are also explicit, including graceful stop, join timeouts, escalation to kill, and queue cleanup. [SOURCE: external/agentlightning/utils/server_launcher.py:833-841] [SOURCE: external/agentlightning/utils/server_launcher.py:891-907] [SOURCE: external/agentlightning/utils/server_launcher.py:1009-1045]
- `system-spec-kit`'s deep-research loop is documented as YAML-managed init/loop/synth/save phases with a simpler error table. [SOURCE: .opencode/command/spec_kit/deep-research.md:147-173] [SOURCE: .opencode/command/spec_kit/deep-research.md:252-259]
- The deep-research agent appends JSONL records with statuses such as `complete`, `timeout`, `error`, `stuck`, `insight`, and `thought`, but the model is still centered on iteration summaries rather than active runtime events. [SOURCE: .opencode/agent/deep-research.md:167-200]

## Analysis
Phase 1 already showed that Agent Lightning's attempt lifecycle is useful. The deeper discovery here is why: the external runtime does not merely record terminal states. It has explicit startup contracts, active health probing, error/ready event channels, and disciplined shutdown semantics. That architecture gives operators much clearer answers about what the system is doing right now.

Public's deep loops are not servers, but they do have analogous problems: long initialization, iterative dispatch, stuck recovery, partial failure, and synthesis handoff. Today those concerns are described in YAML phases and later summarized in JSONL, but they are not modeled as a rich active state machine. That makes overnight runs harder to reason about than they need to be.

## Conclusion
confidence: high

finding: `system-spec-kit` should refactor deep-loop runtime state around explicit attempt events and readiness transitions. Keep JSONL for durable history, but add a richer runtime state model so deep-research and deep-review can distinguish initialization, ready, running, blocked, timeout, failed, recovering, and finalized states in a first-class way.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/deep-research.md` and loop workflow assets
- **Change type:** architectural refactor
- **Blast radius:** large
- **Prerequisites:** define a durable attempt-state schema, reducer ownership, and compatibility behavior for current JSONL consumers
- **Priority:** should-have

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** Deep loops emphasize externalized files and end-of-iteration JSONL summaries, with only light runtime failure taxonomy.
- **External repo's approach:** Runtime readiness, failure, and shutdown are modeled as explicit events with mode-aware control paths.
- **Why the external approach might be better:** It gives stronger operator visibility, safer recovery, and clearer reducer behavior for long-running unattended workflows.
- **Why system-spec-kit's approach might still be correct:** File-first state is simpler, auditable, and works well for research packets where human-readable artifacts are the main deliverable.
- **Verdict:** REFACTOR
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** Preserve JSONL and markdown artifacts, but introduce a reducer-owned runtime state channel with explicit attempt lifecycle events and health checkpoints.
- **Blast radius of the change:** large
- **Migration path:** Start by enriching reducer-owned state with non-breaking attempt-state metadata; once stable, promote that state into dashboards, resume surfaces, and timeout handling.

## Counter-evidence sought
I looked for evidence that Public already has an equivalent active state machine hidden behind the current loop docs and did not find one. I also checked whether Agent Lightning's event model is only necessary because it launches servers, but the readiness/error discipline still generalizes well to unattended research loops.

## Follow-up questions for next iteration
- If runtime state becomes explicit, should Gate 1 or Gate 2 still be user-visible?
- Should resume surfaces show active attempt state separately from historical JSONL summaries?
- Which deep-loop failures should be treated as resumable rather than terminal?
