# Iteration 4 — Recommendation Survival Audit

## Focus
This pass re-audited the surviving recommendation set against two fresh pressures: repo drift since 2026-04-07 and the six blind spots surfaced in iteration 3.
The main question was whether the current Public substrate now falsifies any surviving recommendation, or whether the prior keep/downgrade/replace posture still holds.

## Actions Taken
- Read `research/recommendations.md` to recover the v2-ranked `R1`-`R10` recommendation set.
- Read `research/iterations/iteration-12.md` to reuse the combo stress-test verdicts.
- Read `research/iterations/iteration-16.md` to reuse the counter-evidence keep/downgrade/replace split.
- Read `research/001-research-and-baseline-pt-01/iterations/iteration-3.md` Part B to recover blind spots `BS-001` through `BS-006`.
- Ran `git log --since=2026-04-07` for `.opencode/skill/system-spec-kit/mcp_server`.
- Ran `git log --since=2026-04-07` for `.opencode/skill/sk-deep-research`.
- Ran `git log --since=2026-04-07` for `.opencode/specs/system-spec-kit/026-graph-and-context-optimization`.
- Ran `git log --since=2026-04-07 --oneline --stat --max-count=30` for a repo-wide macro drift snapshot.

## Findings

### Pressure 1 — Temporal Drift (since 2026-04-07)

| Path | Commits since 2026-04-07 | Net effect on surviving recs |
|------|--------------------------|------------------------------|
| system-spec-kit/mcp_server | 199 | Heavy movement in code-graph context, hook schema wiring, freshness tracking, and session plumbing made trust/freshness recommendations stronger, but did not solve summary lossiness. |
| sk-deep-research | 48 | The research loop itself hardened around executor selection and delta-file contracts, which keeps the research substrate fresher but does not reverse the recommendation logic it previously produced. |
| specs/.../026-graph-and-context-optimization | 348 | Child phases kept shipping remediation, docs, and follow-on research, confirming substrate churn and making fragile warm-start packaging look riskier than governance-first moves. |
| repo top-30 | 30 | The macro picture is remediation and hook/graph hardening, not a substrate rewrite; governance/trust rails got stronger, while freshness-lossiness bundles stayed the weakest lane. |

**Per-rec drift verdict:**

| Rec | Temporal drift verdict | Rationale |
|-----|------------------------|-----------|
| R1 | STRONGER | `162a6cb16` and `6cd00aa51` widened hook, writer, and freshness-exposed surfaces, so the repo needs an explicit uncertainty contract more than it did on 2026-04-07. |
| R2 | STRONGER | `162a6cb16` added more Copilot session-prime and writer wiring, which makes a bounded freshness-scoped summary wrapper more useful as an input, while still not making it authoritative. |
| R3 | WEAKER | `162a6cb16` improved live startup and session-prime infrastructure, so cached SessionStart summaries now look even more like a conditional optimization than a high-leverage primary lane. |
| R4 | STRONGER | `a06d733f2` remediated code-graph context and scan scope, improving the readiness substrate that a narrow graph-first nudge depends on. |
| R5 | STRONGER | `a06d733f2` added structural-contract and scan-recovery work, making payload-boundary validation plus split trust fields easier to justify and place. |
| R6 | NEUTRAL | Recent movement such as `a06d733f2` and `6cd00aa51` concentrated on graph and hook surfaces rather than detector fixtures, so the regression-harness recommendation still stands as written. |
| R7 | NEUTRAL | Recent commits like `6cd00aa51` and `a06d733f2` touched hooks and graph context, not the FTS fallback truthfulness lane, so this remains low-priority hardening rather than newly urgent work. |
| R8 | WEAKER | `162a6cb16` and `f1a751c89` expanded continuity plumbing and handover research, but no recent commit resolved lossy summaries or freshness divergence, so the warm-start package is less defensible as a bundle. |
| R9 | STRONGER | `162a6cb16` and `6cd00aa51` added more hook and freshness surfaces that can be published or summarized incorrectly, increasing the need for an auditable savings stack before dashboard claims. |
| R10 | STRONGER | `a06d733f2` and `6cd00aa51` both added freshness-sensitive graph/advisor outputs, reinforcing the replacement recommendation to split trust axes before packaging structural artifacts. |
| Combo 1 | WEAKER | `162a6cb16` and `f1a751c89` increased continuity surface area without fixing stale-or-lossy summary authority, so the bundle degrades further under fresh inspection. |
| Combo 2 | STRONGER | `162a6cb16` and `6cd00aa51` widened the number of measurable and publishable surfaces, which makes governance-first rails more robust rather than less. |

### Pressure 2 — Blind-Spot-Informed Adversarial Test

Matrix of recs x blind spots (from iter-3 Part B). Each cell: "holds" / "weakens" / "invalidates" + 1-sentence rationale.

|       | BS-001 multi-tenant deployment model | BS-002 team governance and access control | BS-003 rollback / corruption recovery behavior | BS-004 cost of discarded recommendations | BS-005 Public substrate churn risk | BS-006 retention / deletion obligations |
|-------|--------------------------------------|-------------------------------------------|-----------------------------------------------|------------------------------------------|------------------------------------|----------------------------------------|
| R1 | holds - BS-001 changes rollout topology, not the need to label measurements honestly. | holds - BS-002 makes shared publication riskier, which strengthens contract-first measurement rather than undermining it. | holds - BS-003 affects substrate recovery, but uncertainty labeling still applies on degraded runs. | holds - BS-004 changes sequencing cost, not the need to stop precision laundering. | holds - BS-005 makes versioned metric labels more necessary, not less. | holds - BS-006 may narrow retained fields, but the measurement contract itself survives. |
| R2 | weakens - BS-001 makes a persisted summary wrapper riskier because cross-tenant scope errors become more damaging. | weakens - BS-002 leaves summary authority under-specified, so the wrapper is less safe unless RBAC and audit rules exist. | weakens - BS-003 means stale or corrupt summaries could outrank live recovery, which is exactly the failure mode this rec must fence. | weakens - BS-004 raises the implementation cost of a new summary surface relative to other bounded fixes. | weakens - BS-005 means a wrapper tied to moving hook/bootstrap seams can stale quickly. | weakens - BS-006 adds deletion and redaction burden to any persisted summary artifact. |
| R3 | weakens - BS-001 makes cached startup summaries harder to trust across multiple operators or tenants. | weakens - BS-002 leaves the access policy for reused startup state unclear, which narrows safe rollout. | weakens - BS-003 means cached summaries can start fast from corrupted or stale state, cutting directly against the recommendation's safety gates. | holds - BS-004 changes ROI but does not by itself falsify the idea of a tightly gated cache. | weakens - BS-005 says the startup substrate is still moving, so the cache consumer can drift faster than its validity checks. | weakens - BS-006 adds retention obligations to any startup cache that copies session memory. |
| R4 | holds - BS-001 changes who sees the nudge, not whether structural-first hints help known `Glob|Grep` misfires. | weakens - BS-002 leaves authority for tool-routing nudges under-specified in shared environments. | weakens - BS-003 means graph-first hints can be wrong if graph freshness or rebuild recovery is weak. | holds - BS-004 does not change the narrowness of the nudge or its bounded cost. | weakens - BS-005 means the hook plus graph seam may keep moving under the nudge. | holds - BS-006 is mostly orthogonal because the nudge can be ephemeral and non-retentive. |
| R5 | holds - BS-001 does not change the value of validating payload trust fields before they cross boundaries. | holds - BS-002 actually increases the value of separate provenance/evidence/freshness fields. | holds - BS-003 makes split trust metadata more important because recovery and freshness must stay explicit. | holds - BS-004 changes priority math, not the correctness of payload hardening. | holds - BS-005 raises API churn, which is exactly why a strict payload contract helps. | holds - BS-006 may constrain some fields, but not the need to keep trust axes separate. |
| R6 | holds - BS-001 does not affect the usefulness of a detector regression floor. | holds - BS-002 does not change the need for frozen fixtures to catch regressions. | holds - BS-003 is downstream of detection; a harness still helps even if recovery paths are weak. | holds - BS-004 may reprioritize the lane, but it does not invalidate fixture coverage as a floor. | holds - BS-005 makes a regression floor more valuable because detector seams can drift. | holds - BS-006 is largely orthogonal to detector fixture work. |
| R7 | holds - BS-001 changes deployment context, not the truthfulness requirement around lexical fallback status. | holds - BS-002 is mostly orthogonal because this lane is substrate hardening, not shared authority. | weakens - BS-003 means fallback-path truth matters more, but also makes this lane insufficient on its own without recovery evidence. | weakens - BS-004 hurts this already-low-priority lane because sunk-cost pressure can push it further down. | weakens - BS-005 says the substrate is still moving, so small lexical hardening can churn before paying back. | holds - BS-006 has limited impact because this lane mostly reports retrieval path choice rather than copying long-lived memory. |
| R8 | weakens - BS-001 makes the warm-start package harder to justify because cross-tenant summaries and graphs widen the failure radius. | weakens - BS-002 leaves authority for bundled startup state unclear, which makes the package harder to defend. | weakens - BS-003 means the package can start warm from unrecoverable or stale state unless every component proves recovery semantics. | weakens - BS-004 raises the opportunity cost of a bundle that already sits below its prerequisites. | weakens - BS-005 means the package depends on multiple fast-moving seams at once, making it fragile. | weakens - BS-006 adds extra retention burden to exactly the copied-memory paths this package uses. |
| R9 | holds - BS-001 changes deployment scope, not the need to block publication without auditable methodology. | weakens - BS-002 means dashboard publication also needs access control and audit boundaries, raising implementation scope. | holds - BS-003 strengthens the case for provenance-rich analytics because recovery failures must be visible. | holds - BS-004 changes sequencing cost but not the need for auditable publication rules. | holds - BS-005 makes governance rails more necessary because the measured substrate is still moving. | weakens - BS-006 means any savings stack that stores session-linked analytics needs deletion-aware contracts. |
| R10 | holds - BS-001 does not remove the need to split provenance, evidence, and freshness before packaging structural outputs. | holds - BS-002 increases the need for separate trust axes because shared consumers need clearer authority boundaries. | holds - BS-003 strengthens this replacement rec because recovery and freshness cannot be collapsed into one score. | holds - BS-004 changes ordering cost but not the prerequisite nature of the trust-axis split. | holds - BS-005 makes a stable trust contract more important on a moving substrate. | holds - BS-006 may trim what is persisted, but not the need to keep authority axes distinct. |
| Combo 1 | weakens - BS-001 enlarges the blast radius of a warm-but-wrong startup package. | weakens - BS-002 leaves no clear authority model for the bundle's copied state and routing hints. | invalidates - BS-003 is fatal here because a lossy summary plus weak recovery can start the whole package from corrupted premises. | weakens - BS-004 makes an already-fragile bundle harder to justify against cheaper bounded fixes. | invalidates - BS-005 says the package spans too many moving seams at once to defend as a current recommendation. | weakens - BS-006 adds deletion obligations across the exact copied-memory surfaces the bundle aggregates. |
| Combo 2 | holds - BS-001 changes adoption shape, but governance-first rails still survive in single-user and shared deployments. | holds - BS-002 is the reason this combo survives: missing access control evidence makes governance rails more, not less, necessary. | holds - BS-003 makes auditable provenance and uncertainty labels more important for degraded runs. | holds - BS-004 may delay some pieces, but the combo remains the safest publication-facing package. | holds - BS-005 increases the need for stable measurement and publication contracts on a moving substrate. | weakens - BS-006 means the combo needs deletion-aware analytics handling, but not a different strategic direction. |

### Combined Verdict

| Rec | v2 counter-evidence verdict | + Temporal | + Blind-spot | FINAL verdict |
|-----|----------------------------|-----------|--------------|---------------|
| R1 | KEEP | STRONGER | HOLDS | KEEP |
| R2 | DOWNGRADE | STRONGER | WEAKENS (BS-001/002/003/005/006) | DOWNGRADE |
| R3 | DOWNGRADE | WEAKER | WEAKENS (BS-001/002/003/005/006) | DOWNGRADE |
| R4 | KEEP | STRONGER | WEAKENS (BS-002/003/005) | KEEP |
| R5 | KEEP | STRONGER | HOLDS | KEEP |
| R6 | KEEP | NEUTRAL | HOLDS | KEEP |
| R7 | DOWNGRADE | NEUTRAL | WEAKENS (BS-003/004/005) | DOWNGRADE |
| R8 | DOWNGRADE | WEAKER | WEAKENS (BS-001/002/003/004/005/006) | DOWNGRADE |
| R9 | KEEP | STRONGER | WEAKENS (BS-002/006) | KEEP |
| R10 | REPLACE | STRONGER | HOLDS | REPLACE |
| Combo 1 | WEAKENED | WEAKER | INVALIDATES (BS-003/005) | WITHDRAW |
| Combo 2 | SURVIVED | STRONGER | HOLDS with BS-006 caveat | KEEP |

Summary counts: KEEP=6, DOWNGRADE=4, REPLACE=1, WITHDRAW=1.

## Questions Answered
- [x] Q1, Q2, Q3 unchanged.
- [x] Q4 — survival verdict produced per rec with temporal + blind-spot pressure. KEEP=6, WITHDRAW=1.
- [ ] Q5 remains.

## Questions Remaining
- [ ] Q5: cheapest next action for marginal convergence.

## Next Focus
Iteration 5 — Q5 cheapest-next-action synthesis. Rank the P0/P1 remediations from iter-3 plus the newly-WITHDRAWN recs from this iteration by (impact_on_convergence / effort_hours). Produce the top-5 candidates as "do this single thing and the v2 deliverables become materially more defensible".
