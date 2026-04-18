# Iteration 021

## Focus

Q8/Wave-D coupling risk: verify whether the executor-audit versus validation ordering gap also exists in the deep-review siblings, and decide whether the fix belongs in shared Phase 019+ deep-loop infrastructure rather than a deep-research-only patch.

## Actions Taken

1. Re-read Iterations 018-020 plus the active research strategy to anchor the already-confirmed deep-research executor-audit findings before revising Q8.
2. Read the live deep-loop workflow assets for `spec_kit_deep-review_auto.yaml`, `spec_kit_deep-review_confirm.yaml`, and `spec_kit_deep-research_confirm.yaml` to compare dispatch, validation, audit, and reducer ordering across siblings.
3. Read the shared runtime helpers `post-dispatch-validate.ts` and `executor-audit.ts` to confirm what the common validator enforces and how executor attribution is actually persisted.
4. Re-read the Phase 017 Wave-D parking-lot packet plus Iteration 009 to compare the earlier "only R55-P2-004 couples" conclusion against the new shared-workflow parity evidence.

## Findings

### P1. The validate-then-audit ordering gap is not deep-research-specific; the deep-review siblings inherit the same shared deep-loop defect shape

Reproduction path:
- Read `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:677-693`.
- Read `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:720-736`.
- Compare with `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:624-639`.

Evidence:
- Deep-review `:auto` runs `post_dispatch_validate` first, then `record_executor_audit`, then later reduces review state.
- Deep-review `:confirm` repeats the same ordering.
- Deep-research `:confirm` matches the same pattern, which means the issue spans the shared command-asset family rather than one workflow branch.

Why this matters:
- Phase 019+ should treat executor provenance ordering as common deep-loop infrastructure debt.
- A deep-research-only fix would leave deep-review non-native runs with the same executor-blind validation path and the same post-hoc audit dependency.

Risk-ranked remediation candidates:
- P1: move non-native executor attribution into the first JSONL append produced by the iteration itself, then validate the already-audited record.
- P1: if post-hoc audit must remain, change the workflow ordering so audit completes before validation in every deep-loop auto/confirm asset.

### P1. The shared validator and shared audit helper still make failure provenance executor-blind across both research and review loops

Reproduction path:
- Read `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:5-74`.
- Read `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts:7-53`.

Evidence:
- `validateIterationOutputs()` only enforces iteration-file existence, state-log growth, JSON parse success, and the caller-supplied required fields.
- The validator has no executor-aware required field and no non-native branch.
- `appendExecutorAuditToLastRecord()` rewrites only the last non-empty JSONL line and throws if that line is missing or malformed.

Why this matters:
- Deep-review parity means the current failure mode is broader than "Copilot deep-research observability."
- When a non-native iteration tail is truncated or malformed, both loops can keep only generic schema failure reasons while losing executor provenance entirely.

Risk-ranked remediation candidates:
- P1: add an executor-aware invariant to post-dispatch validation for non-native runs, at minimum requiring `executor.kind`.
- P1: emit a typed fallback `executor_failure` or `dispatch_failure` event before schema escalation so executor provenance survives even when the iteration record does not.

### P2. This parity pass strengthens the case that only `R55-P2-004` is operationally adjacent to Phase 019+, while `R55-P2-002` and `R55-P2-003` still remain low-coupling parking-lot work

Reproduction path:
- Read `017-review-findings-remediation/plan.md:448-456`.
- Read `017-review-findings-remediation/004-p2-maintainability/spec.md:87-103`.
- Re-read `research/018-deep-loop-cli-executor/iterations/iteration-009.md:16-83`.

Evidence:
- Phase 017 still labels `R55-P2-002`, `R55-P2-003`, and `R55-P2-004` as deferred Wave-D parking-lot items.
- Iteration 009 previously concluded that only `R55-P2-004` had meaningful coupling because it touched the same command/YAML asset family as the Copilot hardening work.
- The new parity evidence widens that same command-asset coupling from "deep-research Copilot branch" to the shared deep-review plus deep-research workflow family, which further strengthens the `R55-P2-004` adjacency signal without pulling the parser/scoring or reconsolidation DRY items into scope.

Why this matters:
- `R55-P2-004` now overlaps a larger common-executor surface than Iteration 009 could prove.
- `R55-P2-002` and `R55-P2-003` still do not help close the active executor-observability gap, so dragging them into Phase 019+ would still be opportunistic scope creep.

Risk-ranked remediation candidates:
- P1: carve Phase 019+ around shared deep-loop executor provenance and ordering first, and explicitly keep `R55-P2-004` sequenced after that hardening unless the same patch is already reopening the YAML quartet.
- P2: continue deferring `R55-P2-002` and `R55-P2-003` until a dedicated metadata-normalization or reconsolidation packet reopens those file families for correctness reasons.

## Questions Answered

- Q8 is revised and tightened. The new evidence shows the ordering gap belongs to the shared deep-loop workflow family, not just deep-research. That increases the operational adjacency of `R55-P2-004` because it touches the same command/YAML asset family across both research and review loops. `R55-P2-002` and `R55-P2-003` remain low-coupling parking-lot items.

## Questions Remaining

- Is there any runtime engine hook that already interprets the declarative `record_executor_audit` stanza outside the searched helper surface, or is the YAML still effectively declarative-only in practice?
- Should Phase 019+ require executor provenance as an atomic first-write contract on every non-native iteration record, or should it preserve provenance through a separate typed fallback event family?
- Do the deep-review reducer and dashboard surfaces need additional assertions once executor provenance becomes mandatory, or will validator-plus-YAML changes be sufficient?

## Next Focus

Stay on Q8/Q7 boundary for one follow-up pass: inspect whether a generic command-runtime hook exists for `record_executor_audit`, because that answer determines whether the Phase 019+ fix is "wire the shared hook" or "change the JSONL contract and delete the post-hoc pattern."
