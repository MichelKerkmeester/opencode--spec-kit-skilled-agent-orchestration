---
title: "...9-hook-package/014-skill-advisor-hook-improvements/research/029-skill-advisor-hook-improvements-pt-01/research]"
description: "This packet found multiple net-new gaps beyond the already-closed CF-019 threshold-refresh issue. The highest-signal problems are no longer baseline wiring failures; they are pa..."
trigger_phrases:
  - "hook"
  - "daemon"
  - "parity"
  - "014"
  - "skill"
  - "research"
  - "029"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-package/014-skill-advisor-hook-improvements/research/029-skill-advisor-hook-improvements-pt-01"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["research.md"]
---
# Deep Research — 014-skill-advisor-hook-improvements

## Summary
This packet found multiple net-new gaps beyond the already-closed CF-019 threshold-refresh issue. The highest-signal problems are no longer baseline wiring failures; they are parity and observability drifts that emerged after the shared hook surface landed. OpenCode currently diverges from the shared runtime contract in both threshold handling and cache invalidation, Codex has a separate native fast path that bypasses the shared brief pipeline, and the MCP/telemetry surfaces overstate how much live state they actually expose. The recommendation-quality loop also remains mostly offline: validation is corpus-driven, while runtime telemetry does not capture whether suggested skills were actually used or corrected. Those issues are concrete enough to support a follow-up implementation packet without another full discovery round.

## Scope
Investigated the skill-advisor system and hook wiring beyond the shipped 001/008/009 packets and beyond the already-applied CF-019 fix. The research covered native MCP handlers, shared brief/cache/render code, Python compatibility behavior where it still affects the live path, Claude/Gemini/Copilot/Codex hook adapters, the OpenCode plugin bridge, runtime/operator docs, and promotion/telemetry surfaces where they affect tuning and parity.

## Key Findings
### P1
- `F-001` OpenCode uses a lower default threshold (`0.7`) than the shared runtime path (`0.8`), and the native bridge path ignores configured `thresholdConfidence`, so OpenCode recommendation quality can drift even when the rest of the stack agrees. Evidence: [iteration-02.md](./iterations/iteration-02.md), `.opencode/plugins/spec-kit-skill-advisor.js:28`, `.opencode/plugin-helpers/spec-kit-skill-advisor-bridge.mjs:191`.
- `F-002` OpenCode cache invalidation is keyed to bridge build files instead of advisor freshness/generation, so plugin users can receive stale guidance for the full five-minute TTL after skill graph/source changes. Evidence: [iteration-03.md](./iterations/iteration-03.md), `.opencode/plugins/spec-kit-skill-advisor.js:72`, `.opencode/plugins/spec-kit-skill-advisor.js:491`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts:384`.
- `F-003` Codex native-hook mode bypasses the shared brief pipeline and therefore skips prompt policy, prompt-cache behavior, deleted-skill suppression, and shared payload construction; Codex behavior depends on hook availability instead of only transport. Evidence: [iteration-04.md](./iterations/iteration-04.md), `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:180`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts:339`.
- `F-004` `advisor_status.laneWeights` is still a static default object even though promotion code/models already describe richer live/candidate weight state, so the public status surface cannot reveal real weight drift. Evidence: [iteration-05.md](./iterations/iteration-05.md), `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts:127`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/weights-config.ts:30`.
- `F-005` Hook telemetry is effectively write-only: hooks serialize prompt-safe diagnostics to stderr, but the rolling health/alert surfaces are not wired to a durable consumer, and there is no runtime outcome signal to connect recommendations to corrections or accepted routes. Evidence: [iteration-06.md](./iterations/iteration-06.md), [iteration-07.md](./iterations/iteration-07.md), `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts:41`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts:282`.

### P2
- `F-006` `advisor_validate` remains scorer-centric: it has no runtime-hook parity slice, no bridge-only check, and no corpus-path override, so it cannot validate the exact cross-runtime surfaces this packet cares about. Evidence: [iteration-08.md](./iterations/iteration-08.md), `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts:89`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts:54`.
- `F-007` Promotion telemetry/persistence claims are ahead of implementation: docs say the two-cycle state survives daemon restarts, but the core implementation is still an in-memory helper plus callback-shaped telemetry hooks. Evidence: [iteration-09.md](./iterations/iteration-09.md), `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/05--promotion-gates/04-two-cycle.md:31`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/two-cycle-requirement.ts:30`.
- `F-008` Operator docs still reference the OpenCode bridge at the old `.opencode/plugins/` path even though the runtime and tests use `.opencode/plugin-helpers/`, so smoke-test instructions are currently wrong. Evidence: [iteration-10.md](./iterations/iteration-10.md), `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:136`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts:13`.

## Evidence Trail
- [iteration-01.md](./iterations/iteration-01.md) re-established packet scope, proved CF-019 is already closed, and narrowed the search to post-landing parity/observability drift.
- [iteration-02.md](./iterations/iteration-02.md) showed the strongest threshold mismatch: OpenCode defaults to `0.7`, while shared/native surfaces remain `0.8`, and the native bridge path drops the configured threshold.
- [iteration-03.md](./iterations/iteration-03.md) compared OpenCode plugin cache invalidation with the shared brief cache and found the plugin tied to bridge-file signatures rather than freshness source signatures.
- [iteration-04.md](./iterations/iteration-04.md) isolated Codex’s fast path and confirmed it bypasses the shared brief builder that other runtimes use.
- [iteration-05.md](./iterations/iteration-05.md) connected the public `laneWeights` surface to immutable defaults while promotion code already models richer live/candidate state.
- [iteration-06.md](./iterations/iteration-06.md) and [iteration-07.md](./iterations/iteration-07.md) showed that runtime telemetry exists only as prompt-safe stderr records and offline validation inputs, not as a usable feedback loop.
- [iteration-08.md](./iterations/iteration-08.md) documented the validator’s missing runtime-parity coverage and its hard-coded dependency on the Phase 019 corpus.
- [iteration-09.md](./iterations/iteration-09.md) confirmed the “telemetry-backed persistence” claims for promotion are ahead of what the implementation currently stores.
- [iteration-10.md](./iterations/iteration-10.md) captured the remaining operator-doc drift around the OpenCode bridge path.

## Recommended Fixes
### Recommendation Quality And Threshold Parity
- `[P1]` Unify threshold defaults across shared hooks, OpenCode, and the bridge. Prefer one source of truth for the effective confidence/uncertainty defaults, and make the native bridge path honor `thresholdConfidence`. Target files: `.opencode/plugins/spec-kit-skill-advisor.js`, `.opencode/plugin-helpers/spec-kit-skill-advisor-bridge.mjs`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/subprocess.ts`, `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md`.
- `[P1]` Add an operator-visible “effective threshold” field to `advisor_status` or `advisor_recommend` metadata so future drift is observable without code inspection. Target files: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts`.

### Cache And Freshness Parity
- `[P1]` Re-key OpenCode cache invalidation on advisor freshness state or shared `sourceSignature`/generation instead of bridge code mtimes. Target files: `.opencode/plugins/spec-kit-skill-advisor.js`, `.opencode/plugin-helpers/spec-kit-skill-advisor-bridge.mjs`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness.ts`.
- `[P1]` Expose last-brief freshness/generation in the OpenCode status tool so stale plugin cache behavior becomes visible. Target files: `.opencode/plugins/spec-kit-skill-advisor.js`.

### Cross-Runtime Brief Parity
- `[P1]` Route Codex native mode through the shared `buildSkillAdvisorBrief()` contract, or explicitly port prompt policy, cache behavior, deleted-skill suppression, and shared payload semantics into the fast path. Target files: `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts`.

### Telemetry And Feedback
- `[P1]` Add a durable prompt-safe sink for advisor hook diagnostics and wire the existing health/alert rollups to a production surface rather than leaving them test-only. Target files: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts`.
- `[P1]` Define a minimal prompt-safe outcome event for “advisor suggestion accepted/corrected/ignored” so recommendation quality can be tuned from real routing behavior instead of only offline corpora. Target files: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts`, plus the eventual orchestrator/skill-invocation sink chosen by follow-up design.
- `[P2]` Either implement persistence for promotion telemetry/two-cycle state or narrow the docs so they do not promise restart durability yet. Target files: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/two-cycle-requirement.ts`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/rollback.ts`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/05--promotion-gates/04-two-cycle.md`.

### MCP Tool Surface
- `[P1]` Make `advisor_status` report actual live/effective lane weights if promotion/adaptive weights are meant to exist. Target files: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/weights-config.ts`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts`.
- `[P2]` Extend `advisor_validate` with runtime-hook parity slices and a corpus-path override, or introduce a separate parity-focused validation tool. Target files: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts`.

### Docs And Operator Workflow
- `[P2]` Fix the OpenCode bridge path in feature docs and smoke-test docs, then add a small regression check so path drift cannot silently recur. Target files: `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/07--hooks-and-plugin/05-opencode-plugin-bridge.md`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/02--cli-hooks-and-plugin/005-opencode-plugin-bridge.md`.

## Convergence Report
The packet did not early-stop because new information stayed above the `0.05` threshold through iteration 10, but it was clearly converging by iterations 6-10. The highest-yield iterations were 2-5, which surfaced the OpenCode threshold/cache drift, Codex fast-path divergence, and static `laneWeights` reporting. Iterations 6-9 mostly confirmed that observability and adaptive-tuning claims are ahead of what the shipped code actually wires, which reduced uncertainty but added less net-new surface area. The work is converged enough for implementation planning without another ten-iteration loop.

## Open Questions
- Should OpenCode keep any product-specific threshold behavior at all, or should every runtime consume a single effective threshold source?
- Where is the right home for outcome telemetry: hook adapters, orchestrator/skill invocation, or a separate advisor event service?
- Is promotion/live-weight mutation intentionally dormant, or is the static `laneWeights` surface simply unfinished?
- Should Codex retain any fast path once the shared brief pipeline is performant enough for prompt-time use?
- Would a dedicated `advisor_validate_hooks` command/tool produce a cleaner contract than expanding the existing scorer-focused validator?

## References
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/014-skill-advisor-hook-improvements/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-019.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/001-skill-advisor-hook-surface/implementation-summary.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/008-skill-advisor-plugin-hardening/implementation-summary.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/009-skill-advisor-standards-alignment/implementation-summary.md`
- `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md`
- `.opencode/skill/system-spec-kit/references/config/hook_system.md`
- `.opencode/plugins/spec-kit-skill-advisor.js`
- `.opencode/plugin-helpers/spec-kit-skill-advisor-bridge.mjs`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/render.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/fusion.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/weights-config.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/two-cycle-requirement.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/rollback.ts`
