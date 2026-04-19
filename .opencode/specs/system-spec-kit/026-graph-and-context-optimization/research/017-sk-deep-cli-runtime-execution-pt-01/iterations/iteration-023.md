# Iteration 023

## Focus

Test the contract-first Phase 019+ direction directly: determine whether the current reducers, dashboards, and non-iteration failure-event surfaces can tolerate executor provenance becoming a required field on non-native iteration records, and identify the smallest shared patch set that would make that contract real.

## Actions Taken

1. Re-read the live `executor-audit` helper and `post-dispatch-validate` implementation to confirm the current append order and the exact JSONL fields enforced before reducer sync.
2. Read the active deep-research reducer to see whether iteration parsing, convergence rollups, blocked-stop history, and registry generation inspect `executor` at all.
3. Read the deep-review reducer/dashboard path to check whether the review sibling shares the same tolerance or has renderer assumptions that would break on an added required provenance block.
4. Read the session-resume `schema_mismatch` rejection path to check whether non-iteration failure handling depends on iteration-record shape or only on event reasons/details.
5. Re-read Iteration 022 and the current state-log tail to keep the Phase 019+ recommendation aligned with the existing Q7/Q8 lineage.

## Findings

### P1. Reducers already tolerate an inline `executor` object on iteration records, but the current validation order would fail a "required provenance" contract unless the first JSONL write changes

Reproduction path:
- Read `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:38-74`.
- Read `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts:26-53`.
- Read `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:535-587,833-835`.
- Read `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:597-605,921-949`.

Evidence:
- `validateIterationOutputs()` only checks that the latest appended JSONL object contains the configured required fields before anything else happens; today that helper is blind to executor provenance and only verifies the base iteration contract.
- `appendExecutorAuditToLastRecord()` still performs a post-hoc rewrite of the last JSONL line after it already exists.
- Both reducers simply filter on `record.type === 'iteration'`, derive convergence from the usual ratio/signal fields, and ignore unknown keys like `executor`.

Why this matters:
- Making executor provenance required is compatible with the reducer layer, but not with the current "append first, mutate later" ordering.
- The minimum safe contract-first fix is to emit `executor` in the iteration's initial JSONL write for all non-native executors, then let validation read it as part of the canonical record instead of rewriting the tail afterward.

Risk-ranked remediation candidates:
- P1: change the non-native prompt/dispatcher contract so the iteration delta itself includes `executor: {kind, model, reasoningEffort, serviceTier}` on first write in both research and review flows.
- P1: extend shared validation so non-native executions require the `executor` object and its four child fields before reducer sync.
- P2: keep `appendExecutorAuditToLastRecord()` only as a migration shim for old state logs, then delete it once non-native inline writes are universal.

### P2. Current dashboards also tolerate the richer record shape, but they do not surface executor provenance anywhere, so Phase 019+ needs only a visibility patch, not a schema-defense patch

Reproduction path:
- Read `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:921-949,977-985`.
- Read `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:535-587`.

Evidence:
- The review dashboard progress rows render run, focus, dimensions, ratio, findings, and status only; no executor fields are read, formatted, or required.
- The research reducer metrics and registry rollups count iterations and questions from the same existing fields, again without branching on provenance keys.

Why this matters:
- Adding a required inline `executor` object will not destabilize current dashboards or registry generation.
- The dashboard patch is therefore optional-but-useful: expose executor kind/model in the status header or progress tables if Phase 019+ wants operator-visible provenance, but it is not necessary for reducer correctness.

Risk-ranked remediation candidates:
- P2: add optional executor display to both research and review dashboards so Copilot/Codex/Gemini/Claude runs become observable without opening raw JSONL.
- P2: update reducer/dashboard parity tests to lock in "unknown extra iteration fields are tolerated" plus the new executor visibility if added.

### P1. Non-iteration failure events are shape-tolerant, but they still do not preserve executor provenance when no valid iteration line exists

Reproduction path:
- Read `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:541-549,834-835`.
- Read `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:398-406`.
- Read `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:383-389`.

Evidence:
- Research and review reducers split JSONL into `type === 'iteration'` and `type === 'event'` streams, so event processing is independent from iteration-record shape.
- `session-resume` reacts to `schema_mismatch` via the event reason/detail path rather than any executor-specific payload.
- That means required inline provenance on successful non-native iterations does not break existing failure handling, but it also does nothing for cases where validation fails before a usable iteration record exists.

Why this matters:
- Failure-event consumers can tolerate the contract-first change.
- The remaining observability gap is narrower: when dispatch fails before a valid iteration record exists, the system still loses executor identity unless Phase 019+ adds a typed fallback event or enriches existing failure events with executor metadata.

Risk-ranked remediation candidates:
- P1: add executor kind/model to the emitted non-iteration failure event (`schema_mismatch`, `jsonl_not_appended`, or a new typed dispatch-failure event) so provenance survives malformed-tail cases.
- P2: keep session-resume consumers reason-first and treat executor metadata as advisory so cached continuity rejection semantics stay stable.

## Questions Answered

- Q7/Q8 follow-up answer: yes, the reducer and dashboard layers mostly tolerate executor provenance becoming required on non-native iteration records because they already ignore extra keys. The real blocker is upstream: validation still runs before the post-hoc audit merge, so the contract must move into the first JSONL write or the validator order/shape must change.
- The minimum shared-surface Phase 019+ patch set is now clearer:
  1. Shared non-native iteration contract/write path for research + review.
  2. Shared validator update for required executor subfields on non-native runs.
  3. Shared failure-event provenance fallback for cases where no valid iteration record exists.
- Dashboard changes are optional observability work, not correctness-critical work.

## Questions Remaining

- Where is the narrowest common dispatch surface to inject the inline executor block for both deep-research and deep-review without reintroducing duplicated YAML-only logic?
- Should the fallback provenance carrier be an enriched existing conflict event (`schema_mismatch` with executor metadata) or a new typed `dispatch_failure` event?
- If Phase 019+ adds dashboard provenance, should it show only executor `kind`, or also `model` / `reasoningEffort` / `serviceTier` in the operator-facing summary?

## Next Focus

Inspect the shared dispatch/config surface that feeds both deep-research and deep-review prompt packs so Phase 019+ can name the exact files where inline executor provenance should be injected and where the failure-event fallback should be emitted.
