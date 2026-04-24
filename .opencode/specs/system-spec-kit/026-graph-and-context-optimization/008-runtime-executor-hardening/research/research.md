---
title: "...graph-and-context-optimization/008-runtime-executor-hardening/research/008-runtime-executor-hardening-pt-01/research]"
description: "This investigation focused on the shipped CLI executor stack for sk-deep-research and sk-deep-review, especially the gap between documented guarantees and executable behavior. T..."
trigger_phrases:
  - "graph"
  - "and"
  - "context"
  - "optimization"
  - "008"
  - "research"
  - "runtime"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/research/008-runtime-executor-hardening-pt-01"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["research.md"]
---
# Deep Research — 008-runtime-executor-hardening

## Summary
This investigation focused on the shipped CLI executor stack for `sk-deep-research` and `sk-deep-review`, especially the gap between documented guarantees and executable behavior. The strongest evidence shows two correctness failures at the core of the runtime: non-native provenance is validated as if it were written inline on the canonical iteration record, while the published prompt contract omits that field, and timeout/crash helpers exist without a live dispatch path that uses them. The security picture is less about a single exploit and more about control-plane drift: executor config accepts sandbox choices that the YAML branches ignore, while Copilot remains permanently broad via `--allow-all-tools`. The Copilot large-prompt wrapper is present syntactically but still lacks live proof that it can satisfy the full artifact contract. Overall, the executor matrix looks shipped from a command-shape perspective but only partially hardened as an operational runtime.

## Scope
Investigated:
- Phase `008-runtime-executor-hardening` root docs plus nested packet docs under `001-foundational-runtime`, `002-sk-deep-cli-runtime-execution`, and `003-system-hardening`.
- The core executor modules: `executor-config.ts`, `executor-audit.ts`, `post-dispatch-validate.ts`, and the deep-research reducer and prompt-pack assets.
- The four deep-research/deep-review YAML dispatch assets and their command-doc references.
- Prior executor research in `research/017-sk-deep-cli-runtime-execution-pt-01/research.md` for unresolved carry-over risk.

Did not investigate:
- Off-repo CLI behavior or vendor documentation.
- Live execution of Copilot, Gemini, Claude, or Codex CLIs in this session.

## Key Findings
### P0
- `F-001` correctness: Non-native first-write provenance is internally inconsistent. `iteration-01.md` and `iteration-10.md` show that the prompt pack omits `executor`, validation requires it on the final iteration record, and YAML only records executor audit after validation, creating a fail-by-design path for spec-compliant non-native runs. [Evidence: `iterations/iteration-01.md`, `iterations/iteration-10.md`; .opencode/skill/sk-deep-research/assets/prompt_pack_iteration.md.tmpl:38-48; .opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:145-150; .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:586-617]
- `F-002` correctness/reliability: Timeout and crash handling are documented but not wired. `iteration-05.md`, `iteration-06.md`, and `iteration-10.md` show that `emitDispatchFailure`, `iteration_timeout`, and retry behavior exist in helpers or prose, yet the live YAML steps never invoke them, so executor failures collapse into generic validator outcomes. [Evidence: `iterations/iteration-05.md`, `iterations/iteration-06.md`, `iterations/iteration-10.md`; .opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts:128-149; .opencode/skill/sk-deep-research/references/loop_protocol.md:232-241; .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:836-840]

### P1
- `F-003` security/architecture: `sandboxMode` is accepted in config for multiple CLI kinds but ignored by the executor branches, while Copilot always runs with `--allow-all-tools`. `iteration-02.md` and `iteration-04.md` show config-to-command drift that can mislead operators about the actual permission posture. [Evidence: `iterations/iteration-02.md`, `iterations/iteration-04.md`; .opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:30-35; .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:516-585]
- `F-004` correctness/docs: Copilot's large-prompt `@path` wrapper remains a stuck-wrapper risk because only command-shape tests cover it. `iteration-03.md` and `iteration-08.md` show that the wrapper path is documented and string-tested, but not proven to write iteration artifacts in a real run. [Evidence: `iterations/iteration-03.md`, `iterations/iteration-08.md`; .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:528-551; .opencode/skill/system-spec-kit/mcp_server/tests/deep-loop/cli-matrix.vitest.ts:8-160]
- `F-005` architecture/docs: stop-reason and recovery naming drift persists between YAML, references, and reducer behavior. `iteration-07.md` shows the live path expects `stuckRecovery`, while some references still describe persisted `stuck_recovery`. [Evidence: `iterations/iteration-07.md`; .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:454-470; .opencode/skill/sk-deep-research/references/convergence.md:711-757; .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:324-383]
- `F-006` performance/reliability: the shipped matrix still lacks live smoke coverage for the main failure paths that the specs/checklists promised, including executor timeout wiring, consecutive-failure recovery, and non-native artifact success. `iteration-08.md` and `iteration-09.md` show the release evidence is still unit-heavy and grep-heavy. [Evidence: `iterations/iteration-08.md`, `iterations/iteration-09.md`; .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/002-sk-deep-cli-runtime-execution/001-executor-feature/checklist.md:86-119; .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/002-sk-deep-cli-runtime-execution/002-runtime-matrix/implementation-summary.md:180-199]

### P2
- `F-007` docs/other: merged skill and command surfaces still mix "Reserved", "Shipped", and deferred-language artifacts in ways that make operator expectations fuzzy, especially around timeout defaults and cross-CLI recursion. [Evidence: `iterations/iteration-05.md`, `iterations/iteration-09.md`; .opencode/skill/sk-deep-research/SKILL.md:68-71; .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/002-sk-deep-cli-runtime-execution/002-runtime-matrix/implementation-summary.md:194-199]

## Evidence Trail
- `iterations/iteration-01.md`: "literal implementation of that contract cannot satisfy non-native validation." This is the core provenance mismatch, backed by the prompt pack, validator, and YAML ordering.
- `iterations/iteration-02.md`: "sandboxMode ... is parseable but operationally ignored." This anchors the config-to-command security drift.
- `iterations/iteration-03.md`: "wrapper path depends on Copilot honoring `@PROMPT_PATH` ... as an assumption." This is the main stuck-wrapper root cause.
- `iterations/iteration-05.md`: "helpers exist, but no live path calls them." This is the timeout/retry wiring gap.
- `iterations/iteration-06.md`: "crash ... collapses into `jsonl_wrong_type` or `jsonl_not_appended`." This explains why failures look generic.
- `iterations/iteration-07.md`: "docs describe a path the reducer no longer expects." This captures the stop-reason normalization drift.
- `iterations/iteration-08.md`: "string shape" versus real CLI execution. This is the release-evidence gap.
- `iterations/iteration-09.md`: prior research already recommended provenance-first hardening, which remained only partially closed.
- `iterations/iteration-10.md`: final severity ranking tying provenance, timeout handling, sandbox drift, and wrapper risk together.

## Recommended Fixes
- `[P0][shared deep-loop]` Move executor provenance into the first canonical iteration write. Update the prompt-pack JSONL contract to require `executor` for non-native runs, or inject it before validation in a shared writer that the YAML branches call before `post_dispatch_validate`.
- `[P0][shared deep-loop]` Wire typed dispatch-failure handling into the actual command runner. Every non-zero exit, timeout, or missing-output branch should emit `dispatch_failure` with executor provenance before validation runs, and loop-protocol timeout docs should match the live behavior.
- `[P1][config/security]` Either honor `config.executor.sandboxMode` in the Codex/Gemini/Claude branches or remove the field from the public schema until it is real. Copilot should get an explicit non-configurable permission warning if `--allow-all-tools` remains mandatory.
- `[P1][Copilot executor]` Add a real large-prompt smoke test that forces the `@path` wrapper branch and verifies `iteration-NN.md`, state-log append, and delta creation under the Copilot executor.
- `[P1][docs/contracts]` Normalize all deep-research/deep-review references to the frozen camelCase stop-reason vocabulary and remove prose that still implies snake_case persisted events or unwired retry behavior.
- `[P1][tests]` Add at least three end-to-end harness tests: non-native provenance success, typed timeout/crash failure logging, and consecutive-failure escalation into `stuckRecovery`.

## Convergence Report
The investigation did not early-stop; it completed all 10 iterations. Convergence was partial rather than absolute: iterations 01-04 established the main correctness/security surfaces, iterations 05-07 showed that timeout and recovery guarantees are only partly executable, and iterations 08-10 mainly reinforced those earlier findings with test and cross-phase evidence. The highest-value new information came from iterations 01, 02, 05, and 06. By iterations 09 and 10, the research was mostly synthesizing and severity-ranking already-established evidence rather than opening new code paths.

## Open Questions
- Can the executor provenance fix and dispatch-failure fix share a single first-write helper without breaking reducer assumptions or historical JSONL consumers?
- Should Copilot remain in the matrix if its only large-prompt safety path still relies on natural-language `@path` behavior instead of a stronger transport?
- Is `sandboxMode` intended to be a real operator control, or was it only added for future flexibility and never meant to be exposed yet?
- Which packet should own live CLI smoke coverage if the broader `@spec-kit/mcp-server` suite remains noisy and partially red?

## References
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/002-sk-deep-cli-runtime-execution/001-executor-feature/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/002-sk-deep-cli-runtime-execution/001-executor-feature/decision-record.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/002-sk-deep-cli-runtime-execution/001-executor-feature/implementation-summary.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/002-sk-deep-cli-runtime-execution/002-runtime-matrix/plan.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/002-sk-deep-cli-runtime-execution/002-runtime-matrix/decision-record.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/002-sk-deep-cli-runtime-execution/002-runtime-matrix/implementation-summary.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/003-system-hardening/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/017-sk-deep-cli-runtime-execution/001-executor-feature/research/017-sk-deep-cli-runtime-execution-pt-01/research.md`
- `.opencode/skill/sk-deep-research/SKILL.md`
- `.opencode/skill/sk-deep-research/assets/prompt_pack_iteration.md.tmpl`
- `.opencode/skill/sk-deep-research/references/loop_protocol.md`
- `.opencode/skill/sk-deep-research/references/convergence.md`
- `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs`
- `.opencode/command/spec_kit/deep-research.md`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/deep-loop/executor-config.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/deep-loop/cli-matrix.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/deep-loop/dispatch-failure.vitest.ts`
