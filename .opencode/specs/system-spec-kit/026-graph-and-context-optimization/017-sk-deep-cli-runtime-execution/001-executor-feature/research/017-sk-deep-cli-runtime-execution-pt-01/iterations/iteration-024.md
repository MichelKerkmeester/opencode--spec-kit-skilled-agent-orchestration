# Iteration 024

## Focus

Inspect the shared dispatch/config surface that feeds both deep-research and deep-review prompt packs so Phase 019+ can name the exact files where inline executor provenance should be injected and where the failure-event fallback should be emitted.

## Actions Taken

1. Re-read the shared deep-loop library under `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/` to confirm which parts are generic plumbing (`prompt-pack.ts`, `executor-config.ts`) versus which parts still enforce the current post-hoc provenance flow (`post-dispatch-validate.ts`, `executor-audit.ts`).
2. Read the live deep-research and deep-review command assets (`spec_kit_deep-research_auto.yaml`, `spec_kit_deep-research_confirm.yaml`, `spec_kit_deep-review_auto.yaml`, `spec_kit_deep-review_confirm.yaml`) around `render_prompt_pack`, executor branching, `post_dispatch_validate`, and `record_executor_audit`.
3. Read the research and review prompt templates to verify whether the current output contract even gives non-native executors a place to emit executor provenance on the first JSONL write.
4. Re-checked `session-resume.ts` only at the `schema_mismatch` consumer edge to confirm that the existing failure path is still reason/detail-driven rather than executor-aware.

## Findings

### P1. The first-write executor provenance injection point is the prompt-template plus YAML-variable layer, not the shared renderer

Reproduction path:
- Read `.opencode/skill/sk-deep-research/assets/prompt_pack_iteration.md.tmpl`.
- Read `.opencode/skill/sk-deep-review/assets/prompt_pack_iteration.md.tmpl`.
- Read `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` and `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` at `pre_dispatch.render_prompt_pack.variables`.
- Read `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` and `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` at `pre_dispatch.render_prompt_pack.variables`.
- Read `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/prompt-pack.ts`.

Evidence:
- Both prompt templates still describe iteration JSONL schemas with no `executor` field and expose no executor section or tokens.
- All executor facts already exist in the YAML dispatch context (`config.executor.kind`, `model`, `reasoningEffort`, `serviceTier`), but the variable maps only pass state/topic/paths data into the prompt packs.
- `renderPromptPack()` is intentionally generic string substitution; it does not know anything about research vs review schemas and does not block adding new executor tokens.

Why this matters:
- If Phase 019+ wants the LEAF executor to write provenance inline on the first JSONL append, the authoritative patch surface is the two prompt templates plus the four YAML variable maps, not the reducer layer.
- The shared renderer only needs more variables supplied to it; it is not the bottleneck.

Risk-ranked remediation candidates:
- P1: add executor tokens to both prompt templates and update the JSONL schema examples so non-native runs are instructed to emit `executor` inline on the initial iteration record.
- P1: plumb `executor_kind`, `executor_model`, `executor_reasoning_effort`, and `executor_service_tier` through all four command assets (`research/review x auto/confirm`) so prompt packs stay runtime-parity-safe.
- P2: add prompt-pack parity tests that assert both templates mention the inline executor contract when non-native execution is active.

### P1. The current failure-event fallback is declared in the command assets, but no shared deep-loop emitter currently owns executor-enriched `schema_mismatch` records

Reproduction path:
- Read `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` and `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` at `post_dispatch_validate.on_failure`.
- Read `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` and `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` at `post_dispatch_validate.on_failure`.
- Read `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts`.
- Read `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts` at the `schema_mismatch` rejection branch.

Evidence:
- Both workflows declare the fallback only as YAML policy: `emit schema_mismatch canonical conflict event`.
- `validateIterationOutputs()` returns only `reason` and `details`; it has no executor-aware payload path.
- `session-resume` consumes `schema_mismatch` through reason/detail semantics, which means the consumer side is tolerant, but there is still no shared deep-loop code path that injects executor metadata into the failure event itself.

Why this matters:
- Phase 019+ cannot finish the malformed-tail provenance gap just by changing prompt packs or validators.
- A second shared contract change is needed at the failure path so non-iteration `schema_mismatch` events can carry executor identity when no valid iteration record exists.

Risk-ranked remediation candidates:
- P1: introduce a shared executor-aware failure payload contract for `schema_mismatch`/`jsonl_not_appended` branches and wire it into both research and review command assets.
- P1: keep `session-resume` reason-first so cached-continuity behavior stays stable, but allow optional executor metadata to flow through as advisory context.
- P2: if the command runtime cannot enrich canonical conflict events directly, add a typed sibling event such as `dispatch_failure` rather than relying on the current tail-rewrite helper.

### P2. The shared deep-loop TypeScript already has the needed executor vocabulary; the contract gap is ordering and propagation, not missing schema fields

Reproduction path:
- Read `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts`.
- Read `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts`.
- Read `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts`.

Evidence:
- `ExecutorConfig` already normalizes `kind`, `model`, `reasoningEffort`, and `serviceTier` for every shipped executor kind.
- `buildExecutorAuditRecord()` already defines the exact four-field provenance block Phase 019+ wants, but only `appendExecutorAuditToLastRecord()` uses it today, and only after validation.
- The validator remains field-list-driven and executor-blind.

Why this matters:
- Phase 019+ does not need a new executor vocabulary type.
- The leverage is to reuse the existing four-field block earlier in the lifecycle and to extend failure propagation, not to design a new metadata shape.

Risk-ranked remediation candidates:
- P2: reuse `buildExecutorAuditRecord()` as the canonical object shape for prompt-pack docs, first-write validation, and fallback-event enrichment.
- P2: retire `appendExecutorAuditToLastRecord()` to migration-only duty once first-write provenance is universal.

## Questions Answered

- Q7/Q8 follow-up answer: yes, the exact shared file surface is now localized. First-write inline provenance belongs in:
  - `.opencode/skill/sk-deep-research/assets/prompt_pack_iteration.md.tmpl`
  - `.opencode/skill/sk-deep-review/assets/prompt_pack_iteration.md.tmpl`
  - `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
  - `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`
  - `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`
  - `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml`
- The shared TypeScript helpers that Phase 019+ should reference, but probably not redesign, are:
  - `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/prompt-pack.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts`
- The failure-event fallback is still configuration-declared rather than owned by a shared deep-loop emitter, which is why the malformed-tail provenance gap survived the earlier reducer-safe conclusion.

## Questions Remaining

- Can the command runtime inject an executor object into canonical `schema_mismatch` conflict events directly, or does Phase 019+ need a new typed event to avoid changing generic conflict payload shape?
- Should prompt packs receive one pre-rendered executor JSON blob, or four flat executor variables mirroring the current audit record fields?
- Is there a single runtime abstraction beneath the YAML assets that can remove the four-file `auto/confirm` duplication, or should Phase 019+ scope that duplication as explicit parity work?

## Next Focus

Inspect whether the command-runtime layer beneath the YAML assets exposes any reusable conflict-event builder or variable-expansion helper. That determines whether Phase 019+ can land this as one shared runtime patch plus parity edits, or whether the safest scope is explicit four-asset wiring with tests.
