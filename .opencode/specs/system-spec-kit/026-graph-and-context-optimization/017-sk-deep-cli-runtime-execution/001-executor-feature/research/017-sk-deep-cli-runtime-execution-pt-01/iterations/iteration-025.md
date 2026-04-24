# Iteration 025

## Focus

Inspect whether the command-runtime layer beneath the YAML assets exposes any reusable conflict-event builder or variable-expansion helper. That determines whether Phase 019+ can land this as one shared runtime patch plus parity edits, or whether the safest scope is explicit four-asset wiring with tests.

## Actions Taken

1. Re-read [iteration-024.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/017-sk-deep-cli-runtime-execution-001-executor-feature/iterations/iteration-024.md) to anchor the already-localized prompt-pack, validator, and executor-audit surfaces before narrowing the runtime question further.
2. Read the shared deep-loop helpers in [prompt-pack.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/prompt-pack.ts), [executor-audit.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts), and [post-dispatch-validate.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts).
3. Re-read the live deep-research and deep-review command assets at the `render_prompt_pack`, `post_dispatch_validate.on_failure`, and `record_executor_audit` blocks to confirm what is still YAML-declared versus implemented in shared TypeScript.
4. Read the focused tests in [prompt-pack.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/deep-loop/prompt-pack.vitest.ts) and [executor-audit.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/deep-loop/executor-audit.vitest.ts) to verify runtime boundaries around token expansion and post-hoc audit merging.
5. Re-checked the `schema_mismatch` consumer path in [session-resume.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts) to confirm whether any executor-aware conflict builder already exists downstream.

## Findings

### P1. No shared conflict-event builder exists beneath the four YAML assets today

Reproduction path:
- Read `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` and `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` at `post_dispatch_validate.on_failure`.
- Read `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` and `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` at `post_dispatch_validate.on_failure`.
- Read `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts`.
- Read `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts` at the `schema_mismatch` rejection branch.

Evidence:
- The only concrete references to `"emit schema_mismatch canonical conflict event"` are the four YAML assets; the shared validator only returns `{ reason, details }` for failure cases and does not build or persist any event payload.
- `session-resume.ts` still treats `schema_mismatch` as a reason code for cached-summary rejection and does not reveal a reusable event-construction helper or executor-aware conflict envelope.
- `buildExecutorAuditRecord()` exists, but it only feeds `appendExecutorAuditToLastRecord()` after a successful append; nothing in the shared runtime uses it to build malformed-tail fallback records.

Why this matters:
- Phase 019+ cannot solve the failure-path provenance gap with a YAML-only patch.
- If the packet wants executor-aware `schema_mismatch` output, it needs either a new shared TypeScript emitter/helper or a deliberately new failure-event contract, not just parity edits across the four assets.

Risk-ranked remediation candidates:
- P1: add a shared deep-loop failure-emitter helper that accepts validator failure reason/details plus executor metadata and is called by both research and review flows.
- P1: if canonical `schema_mismatch` payload shape must stay frozen, add a sibling typed event (for example `dispatch_failure`) rather than overloading a generic conflict comment in YAML.
- P2: keep the YAML `on_failure` declarations as policy, but move event-shape ownership into TypeScript so future assets stop carrying string-only pseudo-contracts.

### P2. A shared variable-expansion helper exists, but it is only a flat token renderer and does not remove four-asset wiring

Reproduction path:
- Read `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/prompt-pack.ts`.
- Read `.opencode/skill/system-spec-kit/mcp_server/tests/deep-loop/prompt-pack.vitest.ts`.
- Read the `render_prompt_pack.variables` maps in the four deep-research/deep-review YAML assets.

Evidence:
- `PromptPackVariables` is `Record<string, string | number>`, and `renderPromptPack()` performs direct `{token}` replacement from that flat map.
- The renderer test explicitly treats `{foo.bar}` as literal text, proving dotted or nested object-style token access is not supported.
- The four YAML assets still enumerate their own `variables:` lists; there is no shared helper that injects an executor object or auto-expands a common variable bundle across all siblings.

Why this matters:
- There is a reusable runtime helper for prompt substitution, but it is too small to eliminate the explicit `research/review x auto/confirm` variable-map edits.
- Phase 019+ can reuse the same renderer, but it still needs parity-safe wiring in each asset unless it first introduces a new shared variable-bundle abstraction.

Risk-ranked remediation candidates:
- P2: scope executor inline-provenance prompt-pack work as explicit four-asset variable-map edits plus tests; that matches current runtime capabilities and has the lowest behavioral risk.
- P2: if maintainers want less duplication later, add a new shared helper that materializes a common executor variable bundle before YAML render, but treat that as a follow-on refactor rather than a prerequisite for Phase 019.
- P2: prefer flat executor tokens or a pre-serialized string token over nested-object syntax, because the current renderer cannot consume dotted paths.

### P2. `buildExecutorAuditRecord()` is reusable vocabulary, but only for post-hoc last-line mutation

Reproduction path:
- Read `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts`.
- Read `.opencode/skill/system-spec-kit/mcp_server/tests/deep-loop/executor-audit.vitest.ts`.
- Read the `record_executor_audit` blocks in the four YAML assets.

Evidence:
- `buildExecutorAuditRecord()` already defines the desired four-field executor shape: `kind`, `model`, `reasoningEffort`, `serviceTier`.
- `appendExecutorAuditToLastRecord()` mutates only the last successfully appended JSONL line and is a no-op for `native`, which keeps it downstream of post-dispatch validation by design.
- Exact-match usage stays limited to the helper module and its tests; no other shared runtime caller exposes it as a generic failure-event builder or pre-dispatch variable helper.

Why this matters:
- Phase 019+ does not need a new provenance schema.
- The reusable part is the object shape, not the lifecycle hook. Shared-runtime reuse is possible only if a new emitter or pre-render helper is added around this existing block.

Risk-ranked remediation candidates:
- P2: reuse `buildExecutorAuditRecord()` as the canonical provenance object if a new failure-emitter helper is added.
- P2: keep `appendExecutorAuditToLastRecord()` for backward compatibility or migration-only duty once first-write provenance becomes universal.
- P3: add a small contract test that asserts any new failure-emitter helper and the post-hoc merge helper stay field-identical.

## Questions Answered

- Q7/Q8 follow-up answer: the runtime answer is mixed. A reusable shared variable-expansion helper exists (`renderPromptPack()`), but it is only flat-token substitution and does not eliminate the need for explicit four-asset variable wiring.
- There is no reusable shared conflict-event builder beneath the YAML assets today. The failure contract remains policy text in the four YAML files, while the shared validator only returns reason/details.
- The practical Phase 019+ scope is therefore:
  - explicit prompt-pack parity edits in the four deep-research/deep-review auto/confirm assets,
  - parity tests around those edits,
  - plus a small shared TypeScript addition if the packet wants executor-aware malformed-tail fallback events instead of leaving that gap open.

## Questions Remaining

- Should Phase 019+ enrich the existing canonical `schema_mismatch` payload, or introduce a sibling typed failure event so session-resume and other reason-first consumers stay untouched?
- For prompt-pack provenance, is it better to pass four flat executor variables, or one pre-serialized executor block token that still rides the existing flat renderer?
- If the packet chooses the minimal-risk path now, should shared variable-bundle DRY work be explicitly deferred as a follow-on P2 rather than coupled into the provenance fix?

## Next Focus

Shift back to one of the unresolved empirical questions after this runtime-shape branch closes, with Q10 (continuity freshness threshold calibration) or Q5 (retry-budget empirical basis) as the highest-value next passes.
