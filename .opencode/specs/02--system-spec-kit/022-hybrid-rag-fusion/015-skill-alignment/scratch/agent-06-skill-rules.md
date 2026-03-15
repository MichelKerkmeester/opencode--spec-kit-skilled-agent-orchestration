## §4 Rules Gaps (numbered, with P0/P1/P2)

1. **[P0] No parent-child phase integrity rule.**  
   Current ALWAYS rules cover level/template/approval mechanics, but not epic-scale decomposition invariants (parent status must derive from child states, no "parent complete" with open FAIL/Draft children).

2. **[P0] No sprint-gate progression rule tied to measurable thresholds.**  
   The epic used explicit sprint gates and metric-based continuation decisions, but §4 has no ALWAYS rule that blocks advancing to next sprint/phase until gate criteria are met.

3. **[P0] Validation rule is too narrow for multi-child programs.**  
   "Run validate.sh before completion" does not require recursive parent+children validation or cross-surface verification (`tsc`, build, tests, alignment/manual checks) used in the epic.

4. **[P0] No feature-flag governance rule for RAG rollout safety.**  
   §4 does not require a governed flag lifecycle (owner, default state, rollout stage, rollback path, sunset criteria), despite heavy flag-based delivery and sunset auditing in 022.

5. **[P1] No campaign-level multi-agent execution rule.**  
   The epic relied on wave-based campaigns with closure verification, but rules do not require wave plans, concurrency limits, acceptance criteria per wave, or revalidation between waves.

6. **[P1] No deferred-work governance rule.**  
   §4 lacks a rule requiring explicit disposition for deferred/skipped items (owner, reason, unblock condition, target phase), which was critical across stubs and deferred findings.

7. **[P1] Approval flow is not phase-program aware.**  
   A/B/C/D/E is required per file-modification trigger, but there is no rule allowing inherited approval boundaries for pre-approved child execution plans, causing ambiguity in large phase trees.

8. **[P1] No rule for metadata/reference freshness after major delivery.**  
   Given epic scale (51 folders, 189 features, 7,500+ tests), §4 should enforce post-campaign synchronization of SKILL metadata, references, and capability statements to prevent drift.

9. **[P2] Escalation triggers miss campaign health signals.**  
   ESCALATE covers template/level/validation failures, but not cross-child drift signals like pass-rate regression, unresolved checklist accumulation, or inconsistent child evidence quality.

## §5 Success Criteria Gaps (numbered, with P0/P1/P2)

1. **[P0] Missing parent-child integrity criteria.**  
   No criteria ensure parent rollup correctness (child counts, statuses, dependency order, no hidden failing children).

2. **[P0] Missing recursive verification evidence criteria.**  
   Criteria only require `validate.sh`; they do not require recursive validation across descendants plus runtime verification suite evidence for program-level completion.

3. **[P0] Missing sprint-gate completion criteria.**  
   No checklist item requires gate metrics/thresholds and go/no-go decisions before progressing to next sprint/phase.

4. **[P0] Missing feature-flag governance compliance criteria.**  
   No requirement verifies per-feature flag contract: documented default, rollout stage, rollback command/path, and sunset status.

5. **[P1] Missing campaign-level checklist closure criteria.**  
   Success criteria do not validate multi-wave campaign closure (planned waves executed, findings triaged, revalidation completed, residual risk documented).

6. **[P1] Missing feature/tool-count traceability criteria.**  
   There is no criterion ensuring claims like capability/tool counts or feature-catalog totals are reconciled to source and updated after large audits.

7. **[P1] Missing deferred/fail accounting criteria.**  
   No mandatory accounting of deferred findings, draft children, or failed children with explicit remediation plan and ownership.

8. **[P2] Missing governance sign-off criteria for high-risk phases.**  
   No criterion captures required Product/Security/Compliance sign-off state for governance-heavy phases.

9. **[P2] Missing cross-phase consistency checks.**  
   No criterion verifies consistency across `spec.md`/`plan.md`/`tasks.md`/`implementation-summary.md` at parent and child levels (scope, status, verification numbers).

## Recommendations

1. Add a new **ALWAYS: Program Integrity** block in §4 (P0): require parent-child rollup rules, recursive validation, and gate-based progression for phased programs.

2. Add a new **ALWAYS: Flag Governance** block in §4 (P0): every rollout-affecting feature must declare flag owner, state, rollout stage, rollback path, and sunset condition.

3. Expand **ALWAYS #12 (validate.sh)** into a tiered verification contract (P0):  
   single spec -> `validate.sh`; phase program -> `validate.sh --recursive` + `tsc/build/tests` evidence + alignment/manual checks when applicable.

4. Add **ESCALATE** triggers for campaign health (P1): unresolved child failures, evidence drift across waves, regression in pass-rate/coverage, or stale program metadata.

5. Update §5 with a **Phase Program Completion** subsection (P0): parent-child integrity checks, sprint-gate artifacts, multi-child verification matrix, and fail/defer ledger.

6. Update §5 with a **Flag Governance Compliance** subsection (P0): flag inventory, rollout status, rollback test evidence, and sunset audit completed.

7. Add a **Campaign Verification** subsection in §5 (P1): wave plan vs executed waves, finding closure counts, and post-wave revalidation proof.

8. Add a **Metadata Freshness** subsection in §5 (P1): claimed tool/feature counts and references must match current audited state before completion can be claimed.

9. Capture one lesson-learned rule explicitly (P1): when epics end with alignment phases (like 015/016), documentation alignment is a required closeout gate, not optional follow-up.
