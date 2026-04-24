# Iteration 003 — Focus: Q3 + Q5 Fence-Contract Edge Cases and REQ Gaps

## Focus
Pressure-test the iteration-002 marker-based `spec.md` write-back recommendation against rollback, duplicate markers, human-edited generated blocks, concurrent sessions, and partial-failure recovery, then map the gaps back onto `REQ-001` through `REQ-010`.

## Findings
1. Marker-missing and duplicate-marker cases need explicit fail-closed semantics, not repair-in-place. The closest local mutator contract uses exact begin/end generated markers plus an `idempotent: true` replacement model, which only remains deterministic when there is exactly one replaceable span. The packet spec currently requires anchor-bounded post-synthesis edits and idempotency, but it does not say what happens when the fenced span is absent, duplicated, or mismatched. Recommendation: extend `REQ-004` and `REQ-010` so the mutation contract requires exactly one begin/end pair with matching labels and emits a blocking conflict/audit event rather than attempting heuristic repair. [SOURCE: .opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:9-12] [SOURCE: .opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:172-176] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/spec.md:124-135] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/spec.md:183-184]
2. Human edits inside the generated span need explicit mixed-ownership conflict handling. Local precedent puts generated ranges inside mixed-ownership targets while simultaneously warning that generated sections are not for manual editing. The current packet spec promises that no user-authored `spec.md` content will be overwritten silently, but it does not define how the workflow should distinguish "user edited outside the generated block" from "user edited inside the machine-owned block." Recommendation: the contract should treat the host anchor as mixed ownership, the fenced generated span as machine-owned, and any manual drift inside that span as a `spec_mutation_conflict` that requires confirm-mode approval or a recovery command instead of silent merge logic. [SOURCE: .opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:9-13] [SOURCE: .opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:352-358] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/spec.md:159-160] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/spec.md:183-184]
3. Rollback is still underspecified at the file-operation layer. The deep-research loop protocol documents checkpoint commits only as a reference-only recovery pattern, and the packet's own state-transition section only covers the higher-level case where synthesis is interrupted before post-synthesis write-back completes. Neither source defines the runtime behavior when a generated-block replacement fails halfway through the `spec.md` write itself. Recommendation: add acceptance language requiring temp-sibling write plus atomic rename where available, plus explicit recovery output when rename/replace fails after temp creation; checkpoint commits can remain optional operator rollback, not the primary contract. [SOURCE: .opencode/skill/sk-deep-research/references/loop_protocol.md:253-272] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/spec.md:188-189] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/spec.md:211-214] [SOURCE: pre-training knowledge - temp-file plus atomic rename replacement semantics]
4. Parallel sessions writing the same `spec.md` need single-writer enforcement before any detection or mutation step. The live deep-research skill still treats same-lineage parallel fan-out as reference-only, and a prior deep-research refinement proposal already identified concurrent runs on one spec folder as a source of JSONL corruption and strategy races, with a concrete `scratch/.deep-research.lock` pattern plus stale-lock recovery. The current packet spec mentions audit logging and idempotency, but it does not say when the lock is acquired, how a second session behaves, or whether stale-lock override is auto or confirm only. Recommendation: require lock acquisition before `REQ-001` path detection, treat second-writer attempts as blocking errors, and allow stale-lock override only with explicit confirm/recovery semantics. [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:268-274] [SOURCE: .opencode/specs/skilled-agent-orchestration/024-sk-deep-research-refinement/scratch/improvement-proposals-v3.md:188-198] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/spec.md:184-189] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/spec.md:211-214]
5. `REQ-001` through `REQ-010` still encode the happy path more clearly than the failure path. The requirements table, success criteria, integrity NFRs, and edge-case/state-transition sections collectively imply the right direction, but they never convert marker conflicts, partial-write rollback, or second-writer contention into testable acceptance criteria. The concrete gaps are:

| REQ | Acceptance-criteria gap |
|-----|-------------------------|
| `REQ-001` | Detection has no explicit "after lock acquisition" rule and no distinction between "true empty folder" and "folder with stale/generated partial research artifacts". |
| `REQ-002` | Create-if-absent does not say what happens if another session creates `spec.md` after detection but before write, or how to roll back if follow-on init steps fail after the file is created. |
| `REQ-003` | Pre-init update does not define behavior when `<!-- ANCHOR:questions -->` is missing, duplicated, or already contains a manually edited prior "Research Context" block. |
| `REQ-004` | Post-synthesis write-back does not define exact generated markers, duplicate-marker handling, human-edited-block conflict behavior, or temp-file/rename rollback semantics. |
| `REQ-005` | The three-artifact contract is strong, but it never tests the transactional cleanup path promised by `NFR-R02` when one of the writes fails mid-sequence. |
| `REQ-006` | Delegation does not define how `/plan` or `/complete` should behave when an empty-folder handoff collides with a lock, a partially generated `spec.md`, or a deep-research-created placeholder packet. |
| `REQ-007` | Manual relationship capture has no dedupe/conflict acceptance criteria for repeated answers, symmetric relationships, or repair-mode re-entry after partial failure. |
| `REQ-008` | Level suggestion covers normal confirmation flow, but not retry/rollback behavior when `recommend-level.sh` fails after the draft `spec.md` has already been staged. |
| `REQ-009` | `:auto` and `:confirm` share output expectations, but there is no explicit parity requirement that both modes honor the same lock, rollback, duplicate-marker, and repair contracts. |
| `REQ-010` | Idempotency only covers duplicate semantic content for the same topic; it does not cover duplicate generated markers, normalized-topic matching, or reruns after interrupted partial writes. |

[SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/spec.md:121-135] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/spec.md:143-149] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/spec.md:183-189] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/spec.md:204-214]

## Ruled Out
- Auto-healing duplicate or missing generated markers by scanning nearby prose and "best guessing" the intended replaceable span.
- Lock-free concurrent deep-research writes to the same spec folder, even if the content diff would appear idempotent.
- Treating optional checkpoint commits as the primary rollback contract for `spec.md` mutation.

## Dead Ends
- `rg -n "lock|concurrent|parallel|race" .opencode/skill/sk-deep-research/ .opencode/skill/system-spec-kit/ | head -30` did not reveal a live `spec.md` single-writer contract in the current command surfaces; most hits were adjacent or reference-only.
- CocoIndex semantic search was attempted twice for generated-block/rollback/lock precedents, but both tool calls were cancelled before returning results, so this iteration relied on exact local evidence plus pre-training patterns.
- The current repo exposes strong generated-marker precedent (`sk-deep-review`) and rollback commentary (`loop_protocol.md`), but not a ready-made `spec.md` mutation implementation that could be copied directly.

## Sources
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/deep-research-config.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/deep-research-strategy.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/deep-research-state.jsonl`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/iterations/iteration-001.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/iterations/iteration-002.md`
- `.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml`
- `.opencode/skill/sk-deep-research/references/loop_protocol.md`
- `.opencode/skill/sk-deep-research/SKILL.md`
- `.opencode/skill/sk-deep-research/assets/deep_research_config.json`
- `.opencode/specs/skilled-agent-orchestration/024-sk-deep-research-refinement/scratch/improvement-proposals-v3.md`
- Pre-training knowledge: temp-file plus atomic rename replacement semantics
- Pre-training knowledge: append-only JSONL state patterns
- Pre-training knowledge: generated-block workflows in CI/doc tooling

## Assessment
- `newInfoRatio`: `0.38`
- Questions addressed: `Q3`, `Q5`, `Q6`
- Questions answered: `Q3`, `Q5`
- Missing acceptance criteria are concentrated in `REQ-003`, `REQ-004`, `REQ-006`, and `REQ-010`, with supporting transactional gaps in `REQ-002`, `REQ-005`, `REQ-008`, and `REQ-009`.

## Reflection
- What worked: using the repo's marker-based review contract as the ownership model, then stress-testing it against rollback and contention, turned an abstract "use fences" recommendation into a concrete mutation contract.
- What failed: there is still no live command-layer precedent for `spec.md` locking or atomic replacement, so the concurrency and rollback rules remain inferred from adjacent contracts rather than copied from an existing implementation.
- What to do differently: the next pass should translate these gaps into packet-ready acceptance language for `spec_check_protocol.md` and the auto/confirm YAML steps, especially around lock acquisition order, audit-event types, and recovery messaging.

## Next Focus
Q4 + Q7 — pin down the minimum viable `/spec_kit:start` interview and delegation UX once the fence/rollback/lock contract is fixed, so `/plan` and `/complete` can absorb start-intake questions without hidden coupling or prompt fatigue.
