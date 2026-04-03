---
title: "Verification Checklist: sk-deep-research [03--commands-and-skills/028-sk-deep-research-testing-playbook/checklist]"
description: "Verification date: 2026-03-19"
trigger_phrases:
  - "deep research playbook checklist"
  - "manual testing playbook checklist"
importance_tier: "important"
contextType: "implementation"
---
# Verification Checklist: sk-deep-research Manual Testing Playbook

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim the playbook implementation done until complete |
| **[P1]** | Required | Must complete or get explicit approval to defer |
| **[P2]** | Optional | Can defer with a documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements are documented in `spec.md` [EVIDENCE: REQ-001 through REQ-010 capture greenfield scope, 19 scenarios, 6 categories, and no-catalog handling]
- [x] CHK-002 [P0] Technical approach is defined in `plan.md` [EVIDENCE: five implementation phases, dependency graph, and testing strategy are documented]
- [x] CHK-003 [P0] Task breakdown is frozen before implementation [EVIDENCE: `tasks.md` defines root-doc, category-folder, per-feature, and validation work]
- [x] CHK-004 [P0] Architecture decisions are recorded [EVIDENCE: `decision-record.md` contains accepted ADRs for playbook-first inventory and approved package shape]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The root playbook uses the integrated root-guidance contract and no canonical sidecar docs [EVIDENCE: future root playbook file]
- [ ] CHK-011 [P0] The 6 approved category folders and all `DR-001` through `DR-019` files exist [EVIDENCE: future directory tree under `manual_testing_playbook/`]
- [ ] CHK-012 [P0] The package handles the missing feature catalog explicitly and never fabricates catalog links [EVIDENCE: root cross-reference section plus per-feature metadata]
- [ ] CHK-013 [P1] Runtime-agent references use `.codex/agents/deep-research.toml` as the canonical runtime anchor [EVIDENCE: root and per-feature source-reference sections]
- [ ] CHK-014 [P1] Live behavior and reference-only notes are separated cleanly [EVIDENCE: future `DR-019` guardrail scenario]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Every feature file contains a realistic user request, exact prompt, exact command sequence, expected signals, evidence, pass or fail rules, and triage [EVIDENCE: per-feature execution tables]
- [ ] CHK-021 [P1] Prompt text is synchronized between root summaries and per-feature execution tables [EVIDENCE: manual prompt-sync review]
- [ ] CHK-022 [P1] Every scenario includes at least one live source anchor to the current deep-research docs or assets [EVIDENCE: source files sections in per-feature docs]
- [ ] CHK-023 [P1] `DR-019` marks reference-only features honestly instead of treating them as shipped behavior [EVIDENCE: live-vs-reference-only scenario notes]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] The root playbook passes `validate_document.py` [EVIDENCE: validator output]
- [ ] CHK-031 [P1] Link and path sweeps pass across the root doc and category files [EVIDENCE: path-sweep output]
- [ ] CHK-032 [P1] Feature-count parity matches the root index and `DR-001` through `DR-019` per-feature files [EVIDENCE: feature inventory audit]
- [ ] CHK-033 [P1] The package documents the current non-recursive validator limitation honestly [EVIDENCE: root validation workflow section]
- [ ] CHK-034 [P2] Release-readiness notes identify any destructive or state-mutating scenarios that need isolation [EVIDENCE: root review protocol]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md`, and `decision-record.md` describe the same future package shape [EVIDENCE: root package path, 6 category folders, and 19 per-feature files are consistent across the packet]
- [ ] CHK-041 [P1] The finished playbook remains synchronized with this spec packet after authoring [EVIDENCE: implementation review]
- [ ] CHK-042 [P2] Future feature-catalog work reuses or maps the published playbook IDs cleanly [EVIDENCE: follow-up catalog decision]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] This packet stays scoped to the target spec folder only [EVIDENCE: current task modified only spec-folder files]
- [ ] CHK-051 [P1] The playbook implementation limits writes to the `manual_testing_playbook/` package and related evidence locations only [EVIDENCE: implementation review]
- [ ] CHK-052 [P2] Context or evidence artifacts are stored in approved locations if needed [EVIDENCE: implementation review]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 4/10 |
| P1 Items | 10 | 3/10 |
| P2 Items | 3 | 0/3 |

**Verification Date**: 2026-03-19
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions are documented in `decision-record.md` [EVIDENCE: ADR-001 and ADR-002 are accepted and implementation-oriented]
- [x] CHK-101 [P1] ADRs have explicit status and date fields [EVIDENCE: each ADR metadata table]
- [x] CHK-102 [P1] Alternatives are documented with rejection rationale [EVIDENCE: alternatives tables in ADR-001 and ADR-002]
- [ ] CHK-103 [P2] A future migration path is documented if a feature catalog is added later [EVIDENCE: follow-up decision or implementation summary]
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Root indexing remains concise enough for one-scan scenario discovery [EVIDENCE: manual review of root category sections]
- [ ] CHK-111 [P1] Authoring and validation steps remain executable in a single review session [EVIDENCE: implementation timing notes]
- [ ] CHK-112 [P2] Optional timing notes or benchmarks are captured if the package becomes unusually large [EVIDENCE: implementation review]
- [ ] CHK-113 [P2] Any measured authoring bottlenecks are documented for follow-up tooling work [EVIDENCE: implementation summary]
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure for the playbook package is documented and tested conceptually [EVIDENCE: `plan.md` rollback sections]
- [ ] CHK-121 [P0] Greenfield package boundaries are preserved without accidental legacy migration assumptions [EVIDENCE: implementation review]
- [ ] CHK-122 [P1] Handoff notes capture any unresolved follow-up for future catalog work [EVIDENCE: implementation summary or handoff]
- [ ] CHK-123 [P1] Review-ready evidence bundle is assembled for the playbook package [EVIDENCE: validator output, path sweeps, and parity report]
- [ ] CHK-124 [P2] Optional reviewer runbook is added if the package requires multi-wave execution planning [EVIDENCE: implementation review]
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Source references stay within the approved source-of-truth set [EVIDENCE: source matrix review]
- [ ] CHK-131 [P1] No fabricated file paths, catalog links, or runtime claims appear in the package [EVIDENCE: manual source audit]
- [ ] CHK-132 [P2] Optional wording cleanup removes any stale references that look executable but are not [EVIDENCE: implementation review]
- [ ] CHK-133 [P2] Data-handling or destructive-scenario notes are explicit where applicable [EVIDENCE: root protocol and scenario notes]
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] The Level 3 packet is internally synchronized today [EVIDENCE: spec, plan, tasks, checklist, and ADRs all reference the same 19-scenario, 6-category package shape]
- [ ] CHK-141 [P1] The playbook package has complete operator-facing documentation after implementation [EVIDENCE: implementation review]
- [ ] CHK-142 [P2] Any future user-facing overview docs are updated if the package becomes an advertised workflow surface [EVIDENCE: follow-up review]
- [ ] CHK-143 [P2] Knowledge-transfer notes are written if future maintainers need catalog linkage guidance [EVIDENCE: implementation summary]
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Documentation Owner | Technical Lead | Pending | |
| Skill Maintainer | Product Owner | Pending | |
| Manual Test Reviewer | QA Lead | Pending | |
<!-- /ANCHOR:sign-off -->

---

<!--
Level 3 verification checklist for the approved playbook implementation.
Current checkmarks reflect packet-readiness work completed on 2026-03-19.
-->
