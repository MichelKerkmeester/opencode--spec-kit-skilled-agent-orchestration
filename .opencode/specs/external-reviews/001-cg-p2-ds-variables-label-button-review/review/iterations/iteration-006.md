# Iteration 006 — Focus: Remediation Feasibility Matrix

## Focus

Review dimensions covered in this pass:
- completeness
- implementation-readiness

Specific checks performed:
- Converted the standing P0/P1 registry into a remediation-feasibility matrix.
- Judged whether each open blocker can be fixed by editing the packet in place or whether it depends on external coordination.
- Tested the smallest edit set that would flip the packet from FAIL to PASS across all four review dimensions.
- Looked for remaining structural gaps that would still weaken the packet even after the minimum PASS edits land.

## Findings

### P0

None new. This pass did not surface a new blocker; it tested the feasibility of remediating the standing CTA contradiction from iteration 001.

### P1

None new. The prior P1 registry collapses into three remediation bundles rather than separate new defects.

## Remediation Matrix

| finding_id | severity | fix-location | minimum-edit-description | any-blockers |
| --- | --- | --- | --- | --- |
| F-001-cta-hover-target-contradiction | P0 | external | Choose one authoritative end-state for `label-content-hover-cta`, then rewrite both Requirement 3 and the checklist to the same token/value. | Cannot be fixed honestly from the packet alone because the current text names two incompatible outcomes and the approval source is not embedded. Needs DS/task-owner confirmation or audit-source re-check. [SOURCE: target-snapshot.md:L63-L64] [SOURCE: target-snapshot.md:L129-L129] |
| F-002-label-addition-identifier-mapping | P1 | in-spec | Replace the seven display-label bullets with a compact mapping table: display label -> canonical CSS variable -> canonical TS identifier -> expected alias/value family; keep one worked normalization example. | The edit lands in the packet, but the author still has to pull the exact canonical identifiers from the referenced CSS/TS surfaces or the audit source. [SOURCE: target-snapshot.md:L41-L51] [SOURCE: iteration-001.md:L27-L31] |
| F-003-cross-surface-parity-rule | P1 | in-spec | Collapse the parity/naming checks into one explicit normalization-and-diff rule, and spell the exact transparent alias identifiers that must match across CSS and TS. | Shares the same identifier-source dependency as F-002, but does not need broader team review once those identifiers are known. [SOURCE: target-snapshot.md:L131-L149] [SOURCE: iteration-002.md:L23-L27] |
| F-004-per-token-acceptance-traceability | P1 | in-spec | Expand grouped checklist lines `L126-L127` into one-per-token assertions, or use one row per required token in the same mapping table added for F-002. | No organizational dependency; this is a straight packet rewrite once the canonical identifiers are known. [SOURCE: target-snapshot.md:L45-L51] [SOURCE: target-snapshot.md:L126-L127] [SOURCE: iteration-003.md:L22-L26] |
| F-005-cta-consumer-audit-rollback | P1 | external | Add a CTA rollout subsection that names the downstream consumer-search scope, states whether the task is value-only vs migration, and defines a rollback action if consumer checks fail. | The packet can host the instructions, but the search scope and rollback owner come from outside this snapshot. Requires consumer-audit coordination or team review. [SOURCE: target-snapshot.md:L15-L18] [SOURCE: target-snapshot.md:L59-L64] [SOURCE: iteration-005.md:L23-L27] |
| F-006-baseline-and-allowlist-diff | P1 | in-spec | Add a pre-change baseline step plus an explicit allowlist diff covering only the extra-large button pair, the named label additions/aliases, the CTA pair, the close-icon rows, and the large dropdown top padding line. | Author must enumerate the allowlisted identifiers; otherwise no extra coordination is needed. [SOURCE: target-snapshot.md:L24-L33] [SOURCE: target-snapshot.md:L123-L149] [SOURCE: iteration-005.md:L29-L33] |

## Minimum PASS Delta

The packet flips from **FAIL -> PASS** with four edits:

1. **Resolve the CTA hover contradiction** by choosing one approved target and making Requirement 3 and the checklist match.
2. **Add one canonical token mapping table** that covers all seven label additions, the transparent alias rows, and the close-icon identifiers, then point the checklist at that table.
3. **Replace grouped parity/scope language with executable rules**: one normalization-and-diff parity rule plus one explicit allowlist/baseline diff step.
4. **Add rollout provenance and failure handling**: name the audit artifact path and add a CTA consumer-audit/rollback subsection.

Everything else is secondary wording polish, not a PASS blocker.

## Second-Order Effects

1. **Resolving F-001 can expose an approval-source dispute.** If the audit artifact, task owner, and checklist history disagree on the CTA hover target, the packet needs an approval refresh rather than a one-line correction.
2. **Resolving F-002/F-003/F-004 can expose stale canonical naming.** Once the packet names exact CSS/TS identifiers, any mismatch between the audit labels and the real canonical keys becomes visible and may require an audit-report refresh.
3. **Resolving F-006 can expose pre-existing drift.** An explicit allowlist diff may reveal unrelated token edits already sitting in the canonical files, which would force the implementer to split cleanup from this task.
4. **Resolving F-005 can expand downstream work.** A real consumer audit may discover callers that require a follow-up task or coordinated rollout window even if the packet itself becomes review-passable.

## PASS Test

| Dimension | Would pass after the minimum edits? | Why |
| --- | --- | --- |
| completeness | Yes | Inputs, edit targets, audit provenance, rollback path, and scope controls would all be named explicitly instead of implied. |
| clarity | Yes | The only internal contradiction would be removed, and the display-label -> canonical-identifier translation would stop being tribal knowledge. |
| testability | Yes | Grouped assertions would become per-token checks, and parity/scope checks would become mechanical normalization/diff steps. |
| implementation-readiness | Yes, conditionally | A zero-context implementer could execute the packet once the CTA target and consumer-audit scope are supplied by the responsible owner. |

Bottom line: **the packet can pass all four dimensions after the four edits above, but it cannot pass honestly without one external decision on the CTA hover target and one externally informed CTA consumer-audit scope.**

## Remaining Structural Gap

Advisory only, not part of the minimum PASS delta: the packet still lacks durable approval metadata such as an explicit approver/owner, audit version or approval date, and any related decision reference. That does not block this task from becoming implementable once the remediation bundle lands, but it leaves future reviewers with weak provenance if the same token set is revisited later.  
[SOURCE: target-snapshot.md:L1-L18] [SOURCE: target-snapshot.md:L41-L41]

## Sources Consulted

- `review/target-snapshot.md`
- `review/deep-review-strategy.md`
- `review/deep-review-state.jsonl`
- `review/iterations/iteration-001.md`
- `review/iterations/iteration-002.md`
- `review/iterations/iteration-003.md`
- `review/iterations/iteration-004.md`
- `review/iterations/iteration-005.md`

## Assessment

- `newFindingsRatio`: `0.0`
- Findings by severity: `P0=0`, `P1=0`, `P2=0`
- Total new findings: `0`
- Remediation verdict: **feasible, but not fully in-packet** — two inputs still require external truth (`CTA hover target` and `CTA consumer-audit scope`).

## Recommended Next Focus

Shift to **convergence + stop-condition testing**: verify that no new P0/P1 findings remain after the active registry is reduced to the CTA decision, the packet-local mapping/allowlist rewrite, and the CTA rollout subsection.
