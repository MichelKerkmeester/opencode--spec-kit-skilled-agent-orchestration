# Deep Research — 014-skill-advisor-hook-improvements-pt-02

## Summary

Packet-02 confirmed that the remaining skill-advisor improvement work is no longer centered on the already-closed CF-019 scorer bug; it is centered on parity, threshold observability, MCP-surface consistency, and live-feedback blind spots [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-019.md:6-12] [iterations/iteration-01.md#findings]. The highest-signal recommendation-quality drift is now branch-specific: OpenCode still splits threshold handling between native and fallback bridge routes, while OpenCode and Codex both preserve bespoke prompt-time paths outside the fully shared build-and-render contract [iterations/iteration-02.md#findings] [iterations/iteration-03.md#findings]. The public MCP surface is also more asymmetric than the docs imply because workspace selection, validator control, and threshold semantics are not exposed consistently across `advisor_status`, `advisor_recommend`, and `advisor_validate` [iterations/iteration-05.md#findings] [iterations/iteration-06.md#findings]. Telemetry remains prompt-safe, but it is still mostly stderr-plus-memory and lacks the accepted/corrected/ignored outcome signals needed to tune recommendation quality from live use [iterations/iteration-07.md#findings]. Lower-severity but still actionable drift remains in weights/promotion observability claims and OpenCode bridge documentation [iterations/iteration-08.md#findings] [iterations/iteration-09.md#findings]. The packet converged enough for implementation planning, but it hit the 10-iteration cap before novelty dropped below the configured threshold twice in a row.

## Scope

In scope:

- Recommendation quality and threshold drift across shared hooks, OpenCode bridge paths, and validator surfaces [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/spec.md:56-63].
- Cross-runtime brief parity for Claude, Gemini, Copilot, Codex, and OpenCode hook/bridge delivery paths [iterations/iteration-03.md#findings] [iterations/iteration-04.md#findings].
- Public MCP tool-surface behavior for `advisor_status`, `advisor_recommend`, and `advisor_validate` [iterations/iteration-05.md#findings].
- Prompt-safe telemetry, health, and recommendation-feedback surfaces beyond the already-closed CF-019 defect [iterations/iteration-07.md#findings].
- Operator docs, feature docs, playbooks, and nearby tests where they affect runtime parity claims [iterations/iteration-09.md#findings] [iterations/iteration-10.md#findings].

Out of scope:

- Implementing any fixes discovered here.
- Reopening the CF-019 graph-penalty threshold-refresh bug unless packet-02 found a new regression path; it did not [iterations/iteration-01.md#negative-knowledge].
- Redesigning the broader hook engine, memory system, or code graph beyond the skill-advisor surfaces directly under investigation.

## Methodology

The packet ran 10 evidence-bearing iterations and stopped because it reached `max_iterations`, not because the `newInfoRatio < 0.05` convergence rule fired twice consecutively. The investigation started from the originating spec, the applied CF-019 closure, and the pt-01 synthesis/registry, then moved through four evidence layers: runtime build/render code, MCP schemas/handlers, metrics/telemetry primitives, and operator/test surfaces [iterations/iteration-01.md#context-consumed] [iterations/iteration-10.md#context-consumed]. Primary sources were local code and packet documents, with every iteration anchored to specific `path:line` references. The novelty trend moved from 0.32 in iteration 1 to 0.04 in iteration 10, which shows steady convergence but not the two-consecutive-below-threshold early-stop condition.

## Research Charter Recap

Revalidated non-goals:

- No implementation work was performed.
- CF-019 was treated as closed context, not reopened investigation.
- No extra-loop executor orchestration or off-packet writes were used.

Revalidated stop conditions:

- Early stop was reserved for two consecutive `<0.05` novelty iterations plus enough findings for synthesis.
- The packet continued because later passes still answered distinct open questions about validator thresholds, MCP asymmetry, and test coverage.

Revalidated success criteria:

- Packet-02 produced net-new findings beyond pt-01, especially around MCP-surface asymmetry, validator threshold inconsistency, and real-vs-documented runtime parity.
- Every recommended fix names concrete target files.

## Key Findings

### P1

- `F-001` OpenCode still has route-specific threshold drift because the native bridge path ignores configured `thresholdConfidence` while the fallback/shared path applies it [.opencode/plugins/spec-kit-skill-advisor.js:27-29] [.opencode/plugin-helpers/spec-kit-skill-advisor-bridge.mjs:191-197] [.opencode/plugin-helpers/spec-kit-skill-advisor-bridge.mjs:231-239].
- `F-002` OpenCode native mode bypasses the shared renderer, so ambiguity and prompt-boundary brief behavior can diverge from the shared runtime contract [.opencode/plugin-helpers/spec-kit-skill-advisor-bridge.mjs:112-143] [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/render.ts:123-137].
- `F-003` Codex still preserves a bespoke native fast path before the shared builder, which means prompt policy, cache behavior, and shared payload semantics remain branch-dependent [.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:180-241] [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts:339-467].
- `F-004` The public MCP tool surface is asymmetric because `advisor_status` requires `workspaceRoot`, while `advisor_recommend` and `advisor_validate` infer workspace implicitly from process state [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts:66-92] [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts:24-33] [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts:44-58].
- `F-005` `advisor_validate` uses `0.7` aggregate pass thresholds for both corpus and holdout slices even though package docs describe stricter promotion gates and runtime hook routing uses `0.8/0.35` prompt filtering [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts:231-243] [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/README.md:150-158] [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts:120-135].
- `F-006` Hook telemetry is still effectively stderr plus an in-memory collector, so the durable health surface required for live recommendation tuning is missing [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts:263-309] [.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:88-101].
- `F-007` The telemetry/validation surface does not capture accepted/corrected/ignored outcomes, so recommendation quality remains an offline corpus problem instead of a live feedback loop [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts:41-52] [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts:321-369].

### P2

- `F-008` `advisor_status` exposes static default `laneWeights`, and the weights schema is literal-locked, so the public surface cannot represent live or candidate weight drift today [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts:120-129] [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/weights-config.ts:30-42].
- `F-009` Two-cycle promotion docs promise restart-persistent state through telemetry, but the implementation is still helper-plus-callback logic without a built-in durable store [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/05--promotion-gates/04-two-cycle.md:29-32] [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/two-cycle-requirement.ts:30-49] [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/rollback.ts:31-72].
- `F-010` Operator docs and playbooks still reference the old `.opencode/plugins` bridge path even though the live compat tests use `.opencode/plugin-helpers` [.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:133-140] [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts:12-14].

## Evidence Trail

- Iteration 01 re-anchored the packet, confirmed CF-019 closure, and narrowed packet-02 to post-baseline parity, telemetry, and tool-surface drift [iterations/iteration-01.md#findings].
- Iteration 02 localized the strongest remaining threshold drift to the OpenCode bridge's native-vs-fallback split [iterations/iteration-02.md#findings].
- Iteration 03 showed that OpenCode and Codex each preserve bespoke prompt-time paths instead of full shared renderer/build parity [iterations/iteration-03.md#findings].
- Iteration 04 proved the shared contract is real for Claude, Gemini, and Copilot, which keeps the parity problem bounded to specific runtimes [iterations/iteration-04.md#findings].
- Iteration 05 surfaced the MCP workspace-selection and validator-control asymmetry [iterations/iteration-05.md#findings].
- Iteration 06 showed that validator thresholds are not aligned with either documented promotion gates or prompt-time route thresholds [iterations/iteration-06.md#findings].
- Iteration 07 established the telemetry story: prompt-safe but ephemeral and outcome-blind [iterations/iteration-07.md#findings].
- Iteration 08 connected static `laneWeights` reporting and doc-overstated promotion persistence [iterations/iteration-08.md#findings].
- Iteration 09 isolated OpenCode bridge doc/playbook drift against the current test-anchored runtime path [iterations/iteration-09.md#findings].
- Iteration 10 verified that the current tests guard adjacent behavior but leave packet-02 gaps largely untested [iterations/iteration-10.md#findings].

## Recommended Fixes

### Threshold And Recommendation Quality

- `R-001` Severity `P1`. Unify OpenCode threshold handling so the native and fallback bridge branches consume the same threshold config and expose the effective threshold visibly. Target files: `.opencode/plugins/spec-kit-skill-advisor.js`, `.opencode/plugin-helpers/spec-kit-skill-advisor-bridge.mjs`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts`. Diff shape: replace branch-local threshold defaults with a shared threshold helper or pass-through config object and return effective-threshold metadata from the bridge/helper.
- `R-002` Severity `P1`. Align validator aggregate thresholds with the documented promotion gate bundle where intended, and publish runtime-threshold context alongside public validation output. Target files: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/README.md`. Diff shape: add explicit full/holdout threshold constants, surface them in JSON output, and document the difference between aggregate evaluation and prompt-time route gating.

### Runtime Brief Parity

- `R-003` Severity `P1`. Collapse OpenCode onto the shared render contract or explicitly port ambiguity handling and prompt-boundary invariants into the native bridge helper. Target files: `.opencode/plugin-helpers/spec-kit-skill-advisor-bridge.mjs`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/render.ts`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts`. Diff shape: reuse `renderAdvisorBrief()` for native bridge output or duplicate its ambiguity branch and add regression tests.
- `R-004` Severity `P1`. Remove or normalize the Codex native fast path so prompt policy, cache, deleted-skill filtering, and shared payload semantics come from one source. Target files: `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts`. Diff shape: route native Codex through the shared builder or extract a common helper that enforces the same invariants before any renderer runs.

### MCP Tool Surface

- `R-005` Severity `P1`. Normalize workspace selection across advisor tools and turn `confirmHeavyRun` into a real control or remove it. Target files: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-validate.vitest.ts`. Diff shape: add `workspaceRoot` to all public tools, accept optional corpus/runtime-mode controls in validation, and assert semantics in tests.

### Telemetry And Outcome Feedback

- `R-006` Severity `P1`. Add a durable prompt-safe hook-diagnostic sink and publish a real health surface. Target files: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts`. Diff shape: persist serialized diagnostics somewhere packet-safe/daemon-safe and expose rolling health through status or a dedicated metrics tool.
- `R-007` Severity `P1`. Define a minimal accepted/corrected/ignored outcome event so live routing behavior can calibrate recommendation quality. Target files: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts`. Diff shape: extend the diagnostic schema with outcome-safe fields, add a collector/sink, and either enrich `advisor_validate` or add a dedicated runtime-outcome analysis surface.

### Weights, Promotion, And Docs

- `R-008` Severity `P2`. Either expose effective live/candidate lane weights or explicitly document `laneWeights` as static defaults. Target files: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/weights-config.ts`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts`. Diff shape: relax literal-only schemas and source `laneWeights` from real state, or narrow docs and field names.
- `R-009` Severity `P2`. Narrow or implement two-cycle restart persistence. Target files: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/05--promotion-gates/04-two-cycle.md`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/two-cycle-requirement.ts`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/rollback.ts`. Diff shape: either wire persistence explicitly or edit docs to remove the restart-durability promise.
- `R-010` Severity `P2`. Repair OpenCode bridge docs/playbooks and lock the path in regression coverage. Target files: `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/07--hooks-and-plugin/05-opencode-plugin-bridge.md`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/02--cli-hooks-and-plugin/005-opencode-plugin-bridge.md`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts`. Diff shape: update examples/current-reality text and add a path-focused assertion.

## Negative Knowledge

- CF-019 remains closed; packet-02 did not find evidence that the old graph-penalty threshold-refresh defect re-opened [iterations/iteration-01.md#negative-knowledge].
- The shared builder/renderer contract is not broken everywhere; it remains the real path for Claude, Gemini, and Copilot [iterations/iteration-04.md#negative-knowledge].
- The telemetry problem is not privacy leakage; it is persistence and outcome semantics [iterations/iteration-07.md#negative-knowledge].
- The bridge-path drift is documentation debt, not proof that the runtime moved back to the old location [iterations/iteration-09.md#negative-knowledge].
- By the end of iteration 10, the remaining questions were prioritization and implementation choices, not missing code anchors [iterations/iteration-10.md#negative-knowledge].

## Cross-Cutting Themes

- **Centralization gap**: the system describes one shared contract, but OpenCode and Codex still preserve runtime-specific branches that weaken true parity.
- **Threshold opacity**: thresholds exist at multiple layers (bridge config, per-prompt routing, aggregate validator slices, documented promotion gates) without one public "effective threshold" story.
- **Observable but not learnable**: the package records prompt-safe health fragments, but it still cannot learn from live recommendation outcomes.
- **Public-surface mismatch**: schemas, docs, tests, and helper implementations do not all describe the same operator contract.

## Risk Matrix

- Threshold drift in OpenCode native mode.
  Impact: users can see different route decisions in OpenCode than in shared-hook runtimes.
  Mitigation: unify threshold plumbing and expose effective thresholds.
- Runtime-specific render/build divergence.
  Impact: ambiguity and prompt-policy semantics can differ by runtime.
  Mitigation: centralize renderer/build logic or harden equivalent regression tests.
- MCP surface asymmetry.
  Impact: external tooling and parity diagnostics rely on hidden cwd/process assumptions.
  Mitigation: normalize `workspaceRoot` and validation controls across the public tools.
- Outcome-blind telemetry.
  Impact: recommendation quality cannot improve from live user behavior.
  Mitigation: add prompt-safe outcome events and a durable sink.
- Docs ahead of implementation.
  Impact: operators can run the wrong smoke tests or over-trust promotion durability.
  Mitigation: either narrow docs immediately or ship the missing implementation/state surface.

## Alternatives Considered

- Keep runtime-specific fast paths and only document them better.
  Rejected because packet-02 shows the branches already create threshold and ambiguity drift.
- Treat validator thresholds as intentionally separate and leave them opaque.
  Rejected because the public tool surface currently gives operators no way to distinguish aggregate gates from prompt-time thresholds.
- Rely on stderr JSONL plus tests as sufficient telemetry.
  Rejected because that still cannot answer whether surfaced skills were accepted, corrected, or ignored in live routing.
- Narrow docs only and skip implementation work.
  Partially viable for P2 doc drift, but insufficient for the P1 threshold/parity gaps.

## Open Questions

- Should OpenCode keep any product-specific threshold behavior, or should all runtimes consume one effective threshold source?
- Is Codex's native fast path still worth keeping once the shared brief path is performant enough?
- Where should outcome telemetry live: hook adapters, orchestrator/skill invocation, or a dedicated advisor event service?
- Should `advisor_validate` become a broader parity tool, or should runtime parity be split into a new dedicated validator?
- Is live weight mutation intentionally dormant, or is the current static `laneWeights` surface an unfinished public contract?

## Convergence Report

Novelty trended as `0.32, 0.24, 0.19, 0.15, 0.12, 0.09, 0.08, 0.07, 0.06, 0.04`. The highest-yield iterations were 2-6, which surfaced threshold-branch drift, shared-vs-bespoke runtime behavior, MCP schema asymmetry, and validator threshold inconsistencies. Iterations 7-10 were lower-novelty but still useful because they closed the telemetry, docs, and test-coverage questions. The packet stopped because it reached `maxIterationsReached`, not because the low-novelty early-stop rule fired; only the last iteration fell below `0.05`.

## Related Work

- Pt-01 packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/029-skill-advisor-hook-improvements-pt-01/`.
- Originating packet spec: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/spec.md`.
- Applied closure baseline: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-019.md`.
- Relevant sibling implementation packets: `001-skill-advisor-hook-surface`, `008-skill-advisor-plugin-hardening`, `009-skill-advisor-standards-alignment`.

## Next Steps

- Open an implementation packet for threshold unification and OpenCode/Codex runtime-brief parity first; those are the highest-severity user-visible drifts.
- Pair that work with targeted regression tests for native OpenCode ambiguity/threshold behavior and Codex fast-path invariants.
- Follow with an MCP-surface normalization packet that adds explicit `workspaceRoot`, clarifies validator semantics, and turns `confirmHeavyRun` into a real control or removes it.
- Then open a telemetry packet for durable diagnostics plus accepted/corrected/ignored outcome events.
- If implementation capacity is limited, ship the documentation corrections for bridge path and promotion persistence immediately as a small independent cleanup.

## References

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-019.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/029-skill-advisor-hook-improvements-pt-01/research.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/029-skill-advisor-hook-improvements-pt-01/findings-registry.json`
- `.opencode/plugins/spec-kit-skill-advisor.js`
- `.opencode/plugin-helpers/spec-kit-skill-advisor-bridge.mjs`
- `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/render.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/weights-config.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/05--promotion-gates/04-two-cycle.md`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/07--hooks-and-plugin/05-opencode-plugin-bridge.md`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/02--cli-hooks-and-plugin/005-opencode-plugin-bridge.md`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/legacy/advisor-runtime-parity.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-validate.vitest.ts`
