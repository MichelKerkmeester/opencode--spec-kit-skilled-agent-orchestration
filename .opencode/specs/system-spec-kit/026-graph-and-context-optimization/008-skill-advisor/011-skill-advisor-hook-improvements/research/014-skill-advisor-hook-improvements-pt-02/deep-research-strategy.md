# Strategy — 014-skill-advisor-hook-improvements-pt-02

## Research Charter

### Non-Goals

- This packet will not implement any fixes; it only prepares evidence-backed recommendations for follow-up packets.
- This packet will not reopen the already-applied CF-019 graph-penalty threshold-refresh fix unless a new regression path proves the closure incomplete.
- This packet will not redesign the broader hook engine, memory system, or code-graph system beyond the parts the skill-advisor surfaces consume directly.
- This packet will not re-score the full routing corpus or run external executor loops; it will inspect the shipped code, docs, schemas, and prior packet outputs.

### Stop Conditions

- Stop early only if `newInfoRatio < 0.05` for two consecutive evidence-bearing iterations and the packet already has enough findings to justify synthesis.
- Stop if the remaining open questions collapse into documentation drift or already-known pt-01 findings with no new code-level differentiator.
- Continue through the cap when low-novelty iterations still close distinct open questions around threshold drift, runtime parity, or telemetry surfaces.

### Success Criteria

- Produce packet-local evidence that goes deeper than pt-01 on recommendation quality, threshold drift, cross-runtime brief parity, MCP tool surface, and telemetry.
- Every finding must cite concrete `path:line` evidence or packet-local document anchors.
- Final recommendations must name concrete target files that a downstream implementation packet can edit without re-investigating.

## Known Context

- The originating packet explicitly asks where recommendation quality, threshold/fusion drift, runtime brief staleness, cross-runtime cache/render parity, telemetry, and MCP-tool scoping can still improve after the 001/008/009 hook phases landed [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/011-skill-advisor-hook-improvements/spec.md:48-63].
- CF-019 already fixed the old Python path where `passes_threshold` froze before graph-conflict penalties and post-normalization, so this packet should treat that defect as closed baseline context rather than open work [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-019.md:6-12].
- Pt-01 already established that OpenCode uses a `0.7` default threshold while shared hook paths center on `0.8`, and that the native bridge path ignores configured threshold input [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/011-skill-advisor-hook-improvements/research/029-skill-advisor-hook-improvements-pt-01/research.md:9-15].
- Pt-01 also established that OpenCode cache invalidation is tied to bridge build files instead of shared advisor freshness, and that Codex still has a native fast path outside the shared brief builder [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/011-skill-advisor-hook-improvements/research/029-skill-advisor-hook-improvements-pt-01/research.md:12-15].
- Pt-01 found that `advisor_status.laneWeights` reports immutable defaults and that hook telemetry is mostly stderr-only without outcome feedback [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/011-skill-advisor-hook-improvements/research/029-skill-advisor-hook-improvements-pt-01/research.md:14-19].
- The public hook reference still describes a single shared flow where adapters call `buildSkillAdvisorBrief(prompt, { runtime, workspaceRoot })`, native advisor runs when freshness is live or stale, and the renderer returns a short `Advisor:` brief [.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:30-41].
- The same reference documents `advisor_status` as exposing freshness, generation, trust state, skill count, and lane weights, and `advisor_validate` as exposing corpus, holdout, parity, safety, and latency slices [.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:45-49].
- `buildSkillAdvisorBrief()` enforces prompt policy, freshness gating, prompt-cache invalidation on `sourceSignature`, deleted-skill cache suppression, subprocess scoring, and shared-payload generation for the common hook path [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts:333-470].
- Claude, Gemini, and Copilot all call `buildSkillAdvisorBrief()` and then `renderAdvisorBrief()`, but Codex still tries a native scorer fast path before falling back to the shared brief producer [.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:156-181] [.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:170-195] [.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:186-207] [.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:180-241].
- OpenCode spawns a bridge helper from the plugin and caches results for five minutes using a signature derived from the bridge and compat build artifacts, not the shared advisor freshness snapshot [.opencode/plugins/spec-kit-skill-advisor.js:27-41] [.opencode/plugins/spec-kit-skill-advisor.js:72-89] [.opencode/plugins/spec-kit-skill-advisor.js:488-525].
- `advisor_status` requires `workspaceRoot`, but `advisor_recommend` and `advisor_validate` currently find the workspace implicitly from process state or directory walking, which already hints at an MCP-surface asymmetry [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts:66-92] [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts:24-33] [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts:44-58].
- The hook metrics package defines a prompt-safe schema plus an in-memory collector, while the hooks themselves emit diagnostics via `process.stderr.write()` line-by-line [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts:41-72] [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts:263-309] [.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:88-101].

## Initial Hypotheses

1. OpenCode still has route-specific threshold drift beyond pt-01 because its native bridge path and fallback path apply different threshold plumbing.
   How to test: compare plugin defaults and bridge branches against shared `buildSkillAdvisorBrief()` threshold behavior.
2. Cross-runtime brief parity is not actually centralized because OpenCode and Codex retain bespoke fast paths outside the shared builder/renderer contract.
   How to test: compare Claude/Gemini/Copilot/Codex/OpenCode call graphs and rendering code.
3. The public MCP tool surface is internally asymmetric, which makes external/runtime parity tooling harder than docs imply.
   How to test: inspect schemas and handlers for `workspaceRoot`, threshold, and validation-control inputs.
4. Validation success metrics are not directly comparable to prompt-time hook behavior because the public validator measures offline corpus slices rather than the runtime brief contract.
   How to test: compare `advisor_validate` slices and thresholds to hook-time pass logic and render-time gating.
5. Telemetry remains mostly offline or ephemeral because hooks emit prompt-safe diagnostics, but no durable surface records recommendation outcomes.
   How to test: inspect metrics schemas, collectors, handlers, and hook emitters for persistence or outcome fields.
6. Promotion/weights documentation still overstates what is live in the observable tool surface.
   How to test: compare feature docs with `advisor_status`, weights config, and promotion helper implementations.
7. Operator documentation still has runtime-bridge drift that could mislead smoke tests or parity checks.
   How to test: compare docs/playbooks against current plugin bridge paths and tests.

## Iteration Plan

1. Re-anchor on the spec, pt-01 registry, and CF-019 closure; define packet-02 fronts and rule out reopened baseline bugs.
2. Inspect threshold surfaces across shared hooks, OpenCode plugin defaults, native bridge routing, and fallback routing.
3. Compare renderer/build parity across shared hooks, OpenCode bridge, and Codex native fast path.
4. Map cross-runtime delivery differences for Claude, Gemini, Copilot, and Codex with emphasis on what stays inside the shared pipeline.
5. Audit MCP schemas and handlers for workspace selection, threshold visibility, and validation surface asymmetry.
6. Trace hook diagnostics and health rollups to determine whether they reach any durable or operator-visible sink.
7. Compare runtime telemetry fields with recommendation-quality needs to see whether accepted/corrected/ignored outcomes can be learned from live use.
8. Revisit weights/promotion and validator surfaces together to identify observability gaps that make threshold drift hard to see.
9. Inspect operator docs, feature docs, playbooks, and tests for bridge-path or runtime-contract drift.
10. Run a convergence pass: consolidate unique findings, confirm negative knowledge, and prepare synthesis/registry outputs.

## Risks and Mitigations

- Risk: packet-02 collapses into a restatement of pt-01.
  Mitigation: prioritize findings that add new code-level differentiators, especially MCP-surface asymmetry and renderer-path divergence.
- Risk: threshold observations conflate aggregate validation gates with per-prompt route thresholds.
  Mitigation: keep those layers distinct and cite both the aggregate slice thresholds and the hook-time pass logic explicitly.
- Risk: telemetry conclusions overreach from absence.
  Mitigation: limit claims to concrete evidence: current schemas, collector lifetime, hook emit paths, and handler outputs.
- Risk: stale documentation path references contaminate code conclusions.
  Mitigation: separate implementation findings from doc/playbook drift and cite tests when current runtime paths matter.
