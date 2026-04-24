# Iteration 022

## Focus

Q7/Q8 boundary follow-up: inspect whether a generic command-runtime hook actually exists for `record_executor_audit`, because that determines whether Phase 019+ should wire a shared runtime hook or instead collapse executor provenance into the primary JSONL contract and remove the post-hoc tail-rewrite pattern.

## Actions Taken

1. Re-read the active iteration brief plus Iteration 021 to anchor the shared deep-loop ordering gap already established across deep-research and deep-review.
2. Read the live deep-research and deep-review YAML workflow stanzas to confirm how `post_dispatch_validate` and `record_executor_audit` are declared in the shipped command assets.
3. Read the shared executor-audit helper and its tests to confirm the real persistence behavior available in code.
4. Ran an exact-match repo sweep for `record_executor_audit`, `appendExecutorAuditToLastRecord`, and `post_dispatch_validate`, then checked the deep-research/deep-review skill docs for any statement that a runtime dispatcher enforces these steps.

## Findings

### P1. This repo does not expose a generic production runtime hook for `record_executor_audit`; the only code evidence is a standalone helper plus tests, while the command assets remain declarative

Reproduction path:
- Read `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:561-579`.
- Read `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:677-695`.
- Run `rg -n "record_executor_audit|appendExecutorAuditToLastRecord|post_dispatch_validate" . -g '!**/node_modules/**' -g '!**/dist/**'`.

Evidence:
- The shipped YAML assets declare `post_dispatch_validate` followed by `record_executor_audit`, but they only name a validator export path and a target/field/value block; they do not themselves prove a runtime invocation path.
- The exact-match sweep found `record_executor_audit` only in the deep-research/deep-review YAML assets and changelog/docs, while `appendExecutorAuditToLastRecord` appears only in the helper module and its tests.
- No separate production caller or command-engine code path was found in the searched repo scope that explicitly imports or invokes `appendExecutorAuditToLastRecord`.

Why this matters:
- The best-supported Phase 019+ posture is no longer "wire the already-existing shared runtime hook," because no such hook is visible in the repo evidence gathered this pass.
- The current implementation shape still looks like a declarative workflow contract backed by a fragile helper, not an executor provenance invariant guaranteed by common runtime machinery.

Risk-ranked remediation candidates:
- P1: move non-native executor attribution into the iteration's first JSONL write contract so executor provenance is atomic with the record that validation already inspects.
- P1: if the workflow must keep a separate audit phase, add a real shared dispatcher/runtime implementation that loads and invokes the configured audit step before validation, then prove it with production-path tests.

### P1. The available helper remains a post-hoc last-line rewrite primitive, so Phase 019+ should treat "delete the pattern" as the default direction unless a real runtime caller is introduced

Reproduction path:
- Read `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts:7-54`.

Evidence:
- `appendExecutorAuditToLastRecord()` reads the state log, locates the last non-empty line, parses that one record, merges an `executor` object, and rewrites the file tail in place.
- The helper throws when no JSONL record exists or when the last line is malformed, which means it cannot preserve provenance across exactly the truncated-tail scenarios already under investigation.
- The helper itself contains no dispatch/runtime integration; it is only a file rewrite utility.

Why this matters:
- Even if a hidden caller existed outside the searched scope, the contract would still be "rewrite the already-written tail," not "persist executor identity atomically."
- That keeps the current design fragile under failure, partial writes, and schema-recovery escalation.

Risk-ranked remediation candidates:
- P1: prefer a JSONL contract change over extending the tail-rewrite helper family.
- P2: if compatibility forces a transition period, emit a typed executor-tagged fallback event instead of mutating the prior line.

### P2. The deep-loop skills themselves describe these controls as non-runtime-enforced intent, which weakens the case for a hidden generic hook and strengthens the contract-first Phase 019+ recommendation

Reproduction path:
- Read `.opencode/skill/sk-deep-research/SKILL.md:83-90`.
- Read `.opencode/skill/sk-deep-review/SKILL.md:85-92`.

Evidence:
- Both skills state `Runtime enforcement: NONE` and describe the workflow behavior as documented intent rather than a code path.
- The stated fallback is that `post_dispatch_validate` eventually catches failures through the `schema_mismatch -> stuck_recovery` flow, not that a dispatcher guarantees executor-audit persistence.

Why this matters:
- The docs align with the code sweep: validator behavior exists as a helper/export, but there is still no demonstrated generic runtime hook that guarantees the audit step fires as infrastructure.
- That makes the contract-first answer more defensible for Q7 and clarifies Q8 coupling: Phase 019+ should harden shared deep-loop provenance semantics, not just reshuffle declarative YAML stanzas.

Risk-ranked remediation candidates:
- P1: scope Phase 019+ around shared deep-loop JSONL provenance invariants and validator expectations across research and review together.
- P2: defer pure YAML cleanup (`R55-P2-004`) unless the same patch is already reopening those assets to support a real runtime integration.

## Questions Answered

- Q7 is tightened: within the repo evidence examined this iteration, no generic command-runtime hook for `record_executor_audit` was found. The current observable implementation is a declarative YAML step plus a standalone last-line rewrite helper, so the safer Phase 019+ default is to change the JSONL contract rather than assume an existing shared hook can simply be wired.
- Q8 is further clarified: this reduces the value of carrying forward YAML-only cleanup by itself. The coupling that matters is shared deep-loop provenance hardening; `R55-P2-004` is adjacent only if it is bundled with a real runtime or contract fix, while `R55-P2-002` and `R55-P2-003` still remain parked.

## Questions Remaining

- Is there any command-runner implementation outside the searched repository scope that interprets `record_executor_audit` generically at runtime, or should Phase 019+ explicitly treat the repo-local evidence as authoritative?
- If Phase 019+ moves executor identity into the primary iteration JSONL record, should non-iteration failure cases emit a separate typed `dispatch_failure`/`executor_failure` event to preserve provenance before iteration creation?
- Once executor provenance becomes mandatory, does `post_dispatch_validate` need a non-native executor-aware branch for both research and review schemas, or is a broader reducer/dashboard update also required?

## Next Focus

Use one follow-up pass to test the contract-first direction directly: inspect whether the current reducers, dashboards, and any non-iteration failure events can tolerate executor provenance becoming a required field on non-native iteration records, and identify the minimum shared-surface patch set for Phase 019+.
