# Iteration 005 — Focus: Adversarial Edge-Case Pressure Test

## Focus

Review dimensions covered in this pass:
- implementation-readiness
- testability

Specific checks performed:
- Simulated a developer mistyping one of the new label additions and checked whether the packet exposes the exact canonical identifiers, typo-detection path, and recovery steps.
- Simulated the CTA token change breaking downstream consumers and checked for caller inventory, compatibility notes, and rollback instructions.
- Simulated the extra-large button edits accidentally cascading into other size tiers and checked for a diff-ready allowlist or pre-change baseline.
- Looked for pre-change verification artifacts (current-value snapshot, baseline diff, or equivalent) and for DS-native assumptions that a zero-context reviewer would not know.

## Findings

### P0

None.

### P1

1. **The task has no blast-radius or rollback workflow for the CTA token change, so a consumer-breaking rollout would be detected too late.**  
   [implementation-readiness] [testability] [traceability]  
   The packet only identifies the two canonical source files to edit and the final CTA token values to assert on those surfaces. It never asks the implementer to inventory downstream consumers, define whether this is strictly a value swap versus a wider token migration, or document how to back out the change if the audit/QA cycle finds an unforeseen consumer after the canonical lines are updated. In the adversarial case where the CTA change lands as a rename/repoint and an existing caller still depends on the prior mapping, the current checklist can still pass while rollout risk remains unknown.  
   [SOURCE: target-snapshot.md:L15-L18] [SOURCE: target-snapshot.md:L59-L64] [SOURCE: target-snapshot.md:L128-L149]  
   **Recommendation:** Add a blast-radius subsection that names the expected consumer-search scope, states whether the CTA task is value-only or includes any token migration, and defines a rollback step (restore the prior mapping or revert the named token lines) if downstream checks fail.

2. **The task lacks a pre-change baseline and typo-detection path, so mistyped label additions or accidental button-tier cascades are not safely detectable or recoverable.**  
   [implementation-readiness] [testability]  
   Requirement 2 still lists label additions as display labels, Requirement 1 changes only the extra-large button pair, and the final validation line only checks for unrelated size-tier edits after implementation. The packet never requires a current-value snapshot of the touched token families, an explicit per-token allowlist, or a before/after diff recipe. That leaves two adversarial failures under-defended: a developer can mistype one added label identifier, or accidentally sweep other button tiers while editing the extra-large tokens, and the reviewer has no baseline artifact to compare against or quick recovery path.  
   [SOURCE: target-snapshot.md:L24-L33] [SOURCE: target-snapshot.md:L41-L51] [SOURCE: target-snapshot.md:L123-L149]  
   **Recommendation:** Before implementation, capture a current-value snapshot for every touched token family, convert the label-addition section into exact canonical CSS/TS identifiers, and require an allowlist diff proving that only the extra-large button lines plus the named label/dropdown entries changed.

### P2

None.

## Scenario Verdicts

1. **Mistyped label token name** — avoid: **no**; detect: **partial**; recover: **no**. The spec still relies on display-label names instead of exact canonical identifiers, and the grouped checklist does not provide a baseline or one-per-token assertion set.  
   [SOURCE: target-snapshot.md:L41-L51] [SOURCE: target-snapshot.md:L126-L127]
2. **CTA token change breaks existing callers** — avoid: **no**; detect: **no**; recover: **no**. The packet validates only the canonical CSS/TS edit surfaces and does not require consumer discovery, compatibility checks, or rollback instructions.  
   [SOURCE: target-snapshot.md:L15-L18] [SOURCE: target-snapshot.md:L59-L64] [SOURCE: target-snapshot.md:L128-L149]
3. **Extra-large edits cascade to other button tiers** — avoid: **partial**; detect: **partial**; recover: **no**. The scope language implies the intended boundary, but there is still no pre-change snapshot or diff allowlist that proves only the extra-large pair changed.  
   [SOURCE: target-snapshot.md:L24-L33] [SOURCE: target-snapshot.md:L148-L149]
4. **Audit flags unforeseen consumers after the change** — avoid: **no**; detect: **partial**; recover: **no**. The task cites audit-approved additions, but it still does not tell the implementer which audit artifact to reopen, what consumer surface to inspect, or how to unwind the change safely if new consumers are discovered.  
   [SOURCE: target-snapshot.md:L41-L41] [SOURCE: target-snapshot.md:L15-L18]

## Ruled Out

- No new separate P0 is filed for the "CTA rename" wording itself. The standing blocker is still the previously recorded CTA hover requirement/checklist contradiction; this pass only tested adjacent rollout-risk scenarios and did not surface a second internal contradiction.  
  [SOURCE: target-snapshot.md:L63-L64] [SOURCE: target-snapshot.md:L128-L129]
- A baseline screenshot is not the missing control here. These risks are token-level and diff-level, so a current-value snapshot plus an allowlist check is the more relevant missing pre-change safeguard.  
  [SOURCE: target-snapshot.md:L123-L149]

## Coverage

- **Blast-radius documentation:** still missing for CTA rollout and any post-audit consumer discovery path.  
  [SOURCE: target-snapshot.md:L15-L18] [SOURCE: target-snapshot.md:L59-L64]
- **Pre-change verification:** still missing; there is no current-value snapshot, diff baseline, or rollback recipe in the packet.  
  [SOURCE: target-snapshot.md:L123-L149]
- **DS-native assumptions surfaced:** the task still assumes the reviewer already knows how Notion display labels normalize into canonical CSS/TS identifiers and how alias resolution should be proved across both surfaces.  
  [SOURCE: target-snapshot.md:L41-L51] [SOURCE: target-snapshot.md:L102-L107] [SOURCE: target-snapshot.md:L139-L148]

## Sources Consulted

- `review/target-snapshot.md`
- `review/deep-review-strategy.md`
- `review/deep-review-state.jsonl`
- `review/iterations/iteration-001.md`
- `review/iterations/iteration-002.md`
- `review/iterations/iteration-003.md`
- `review/iterations/iteration-004.md`
- `.claude/skills/sk-deep-review/references/quick_reference.md`
- `.claude/skills/sk-deep-review/references/state_format.md`

## Assessment

- `newFindingsRatio`: `0.50`
- Findings by severity: `P0=0`, `P1=2`, `P2=0`
- Total findings: `2`
- Adversarial result: **not safe to merge from the packet alone** — typo/cascade failures and downstream-consumer failures still lack avoid/detect/recover instructions.

## Recommended Next Focus

Shift to **convergence + active-finding dedupe**: confirm the final required remediation set is now (1) the standing CTA contradiction, (2) canonical identifier mapping plus per-token checklist/baseline allowlist, (3) CTA consumer-impact plus rollback instructions, with the audit-path omission remaining advisory unless it expands into a distinct execution blocker.
