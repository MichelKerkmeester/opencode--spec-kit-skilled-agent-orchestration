# Iteration 008 — Operational Metrics And Convergence Signals

Date: 2026-04-10

## Research question
Can Agent Lightning's explicit rollout, worker, and metric surfaces improve Public's deep-research and deep-review dashboard design enough to justify immediate adoption?

## Hypothesis
This is likely one of the strongest low-risk transfers because Public already has dashboard concepts, but its loop-specific metrics appear thinner than Agent Lightning's operational telemetry.

## Method
I read Agent Lightning's store statistics and telemetry docs plus one concrete training loop and one metrics-export script. I compared those signals against Public's existing deep-research state model, command-level dashboard expectations, and the generic reporting-dashboard module.

## Evidence
- Agent Lightning defines explicit store statistics including total rollouts, attempts, spans, resources, workers, uptime, and span memory footprints. [SOURCE: external/agentlightning/store/base.py:75-101]
- The store documentation tracks worker activity timestamps, worker status transitions, and span-driven liveness. It also treats spans as heartbeats and attempt state as a first-class operational diagnostic surface. [SOURCE: external/docs/deep-dive/store.md:74-82] [SOURCE: external/docs/deep-dive/store.md:129-153]
- The Tinker training example records per-batch progress, learning rate, completion fraction, evaluation metrics, training-step metrics, and total time, then logs them as a unified metrics payload per batch. [SOURCE: external/examples/tinker/agl_tinker/train.py:162-176] [SOURCE: external/examples/tinker/agl_tinker/train.py:177-185] [SOURCE: external/examples/tinker/agl_tinker/train.py:218-221]
- Agent Lightning also ships a utility that downloads selected metrics from Weights and Biases and emits chart-ready JSON, showing that metrics aggregation and visualization are part of the intended workflow rather than incidental logging. [SOURCE: external/scripts/wandb_download_result.py:3-10] [SOURCE: external/scripts/wandb_download_result.py:22-27]
- Public's deep-research loop already records structured iteration state such as status, `newInfoRatio`, focus, ruled-out approaches, sources queried, and duration, and the command explicitly expects a persistent dashboard and convergence detection. [SOURCE: .opencode/agent/deep-research.md:167-189] [SOURCE: .opencode/agent/deep-research.md:212-213] [SOURCE: .opencode/command/spec_kit/deep-research.md:167-173] [SOURCE: .opencode/command/spec_kit/deep-research.md:263-269]
- The autonomous deep-research asset initializes a reducer-owned findings registry with coverage and convergence fields, confirming that Public already has a machine-owned place to accumulate richer loop metrics. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:79-89] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:194-197]
- Public already has a generic reporting-dashboard module that knows how to summarize metrics, per-channel views, and trends across runs. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:31-41] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:59-112]

## Analysis
This is the cleanest adopt-now opportunity in the whole phase. Public already believes in iterative dashboards and already owns a reusable trend-reporting primitive. What it lacks is a richer operational vocabulary for the deep loops themselves. Agent Lightning demonstrates the value of making work-unit counts, liveness, timing, and coverage metrics explicit rather than leaving the dashboard to infer progress from sparse state rows.

The direct transfer should stay modest: Public does not need rollout stores or worker heartbeats. But it should elevate loop metrics such as files read, cited-source count, distinct-source count, no-signal streak, blocked-approach count, duration, and maybe per-focus coverage into first-class dashboard fields. That would make overnight research and review runs much easier to judge without rereading the whole packet.

## Conclusion
confidence: high

finding: Agent Lightning's operational-metrics discipline is immediately useful to Public. Public already has the loop framework and even a trend-reporting module; it mostly needs to enrich the deep-research and deep-review dashboards with a more explicit metric vocabulary. This is a low-risk, high-leverage improvement because it strengthens observability without changing the core loop model.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/deep-research.md`
- **Change type:** modified existing
- **Blast radius:** small
- **Prerequisites:** agree on a standard set of loop metrics and thread them into the reducer-owned dashboard surfaces
- **Priority:** must-have

## Counter-evidence sought
I looked for existing deep-loop metrics in Public that already matched Agent Lightning's operational richness and found only a thinner set centered on iteration status, ratio, and counts. I also checked whether Agent Lightning's metrics story was only W&B-specific, but the store statistics and training-loop metrics exist independently of the export helper.

## Follow-up questions for next iteration
- Should Public adopt Agent Lightning's resource versioning for templates and prompts, or is that the wrong fit for `system-spec-kit`?
- Which recommendations from this phase should be explicitly rejected because they duplicate phase 005's generic loop concerns?
- Can the final synthesis clearly separate adopt-now metrics work from prototype-later telemetry work?
