---
title: "Feature Specification: 016-Tooling-and-Scripts Manual Testing"
description: "Manual test execution tracking for 60 exact scenario IDs across 28 tooling-and-scripts playbook scenarios, covering phase workflow, session capturing pipeline quality, tooling utilities, and JSON mode structured summary hardening."
trigger_phrases:
  - "tooling scripts manual testing"
  - "016 testing"
  - "016 tooling and scripts"
  - "tooling and scripts manual test"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: 016-Tooling-and-Scripts Manual Testing

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-03-22 |
| **Branch** | `014-manual-testing-per-playbook` |
| **Parent Spec** | [../spec.md](../spec.md) |
| **Predecessor** | [015-retrieval-enhancements](../015-retrieval-enhancements/spec.md) |
| **Successor** | [017-governance](../017-governance/spec.md) |
| **Playbook Category** | 16--tooling-and-scripts |
| **Scenario Files** | 28 |
| **Total Exact IDs** | 60 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The tooling-and-scripts category (16) contains 28 scenario files covering 60 exact scenario IDs that have not been manually tested against the live system. This is the second-largest phase by exact ID count, with two major sub-scenario expansions: M-007 (session capturing pipeline quality) with 17 sub-IDs and 153 (JSON mode structured summary hardening) with 15 sub-IDs. Each requires systematic validation with documented evidence.

### Purpose
Execute every scenario in the 16--tooling-and-scripts playbook category, verify each produces the expected outcome, and record pass/fail evidence for all 60 exact IDs.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- All 60 exact scenario IDs from 16--tooling-and-scripts playbook category
- Phase workflow scenarios (PHASE-001 through PHASE-005)
- Main-agent review and verdict handoff (M-004)
- Session capturing pipeline quality parent and sub-scenarios (M-007, M-007a through M-007q)
- Tooling and script utility scenarios (061, 062, 070, 089, 099, 108, 113, 127, 128, 135, 136, 137, 138, 139, 147, 149, 150, 151, 152, 154)
- JSON mode structured summary hardening parent and sub-scenarios (153, 153-A through 153-O)

### Out of Scope
- Modifying tooling source code (testing only)
- Scenarios belonging to other playbook categories
- Automated test creation (manual testing phase)

### Scenario ID Master List (60 IDs)

#### Group A: Phase Workflow (5 IDs)

| # | ID | Scenario | Source File |
|---|-----|----------|-------------|
| 1 | PHASE-001 | Phase detection scoring | 001-phase-detection-scoring.md |
| 2 | PHASE-002 | Phase folder creation | 002-phase-folder-creation.md |
| 3 | PHASE-003 | Recursive phase validation | 003-recursive-phase-validation.md |
| 4 | PHASE-004 | Phase link validation | 004-phase-link-validation.md |
| 5 | PHASE-005 | Phase command workflow | 005-phase-command-workflow.md |

#### Group B: Main-Agent Review (1 ID)

| # | ID | Scenario | Source File |
|---|-----|----------|-------------|
| 6 | M-004 | Main-Agent Review and Verdict Handoff | 004-main-agent-review-and-verdict-handoff.md |

#### Group C: Session Capturing Pipeline Quality (18 IDs: 1 parent + 17 sub-scenarios)

| # | ID | Scenario | Source File |
|---|-----|----------|-------------|
| 7 | M-007 | Session Capturing Pipeline Quality (parent) | 007-session-capturing-pipeline-quality.md |
| 8 | M-007a | JSON authority and successful indexing | (sub-scenario of M-007) |
| 9 | M-007b | Thin JSON insufficiency rejection | (sub-scenario of M-007) |
| 10 | M-007c | Explicit-CLI mis-scoped captured-session warning | (sub-scenario of M-007) |
| 11 | M-007d | Spec-folder and git-context enrichment presence | (sub-scenario of M-007) |
| 12 | M-007e | OpenCode precedence | (sub-scenario of M-007) |
| 13 | M-007f | Claude fallback | (sub-scenario of M-007) |
| 14 | M-007g | Codex fallback | (sub-scenario of M-007) |
| 15 | M-007h | Copilot fallback | (sub-scenario of M-007) |
| 16 | M-007i | Gemini fallback | (sub-scenario of M-007) |
| 17 | M-007j | Final NO_DATA_AVAILABLE hard-fail | (sub-scenario of M-007) |
| 18 | M-007k | V10-only captured-session save warns | (sub-scenario of M-007) |
| 19 | M-007l | V8/V9 captured-session contamination abort | (sub-scenario of M-007) |
| 20 | M-007m | --stdin structured JSON with explicit CLI target | (sub-scenario of M-007) |
| 21 | M-007n | --json structured JSON with payload-target fallback | (sub-scenario of M-007) |
| 22 | M-007o | Claude tool-path downgrade vs non-Claude capped path | (sub-scenario of M-007) |
| 23 | M-007p | Structured-summary JSON coverage and file-backed authority | (sub-scenario of M-007) |
| 24 | M-007q | Phase 018 output-quality hardening | (sub-scenario of M-007) |

#### Group D: Tooling and Script Utilities (20 IDs)

| # | ID | Scenario | Source File |
|---|-----|----------|-------------|
| 25 | 061 | Tree thinning for spec folder consolidation (PI-B1) | 061-tree-thinning-for-spec-folder-consolidation-pi-b1.md |
| 26 | 062 | Progressive validation for spec documents (PI-B2) | 062-progressive-validation-for-spec-documents-pi-b2.md |
| 27 | 070 | Dead code removal | 070-dead-code-removal.md |
| 28 | 089 | Code standards alignment | 089-code-standards-alignment.md |
| 29 | 099 | Real-time filesystem watching (P1-7) | 099-real-time-filesystem-watching-p1-7.md |
| 30 | 108 | Spec 007 finalized verification command suite evidence | 108-spec-007-finalized-verification-command-suite-evidence.md |
| 31 | 113 | Standalone admin CLI | 113-standalone-admin-cli.md |
| 32 | 127 | Migration checkpoint scripts | 127-migration-checkpoint-scripts.md |
| 33 | 128 | Schema compatibility validation | 128-schema-compatibility-validation.md |
| 34 | 135 | Grep traceability for feature catalog code references | 135-grep-traceability-for-feature-catalog-code-references.md |
| 35 | 136 | Feature catalog annotation name validity | 136-feature-catalog-annotation-name-validity.md |
| 36 | 137 | Multi-feature annotation coverage | 137-multi-feature-annotation-coverage.md |
| 37 | 138 | MODULE: header compliance via verify_alignment_drift.py | 138-module-header-compliance-via-verify-alignment-drift-py.md |
| 38 | 139 | Session capturing pipeline quality | 139-session-capturing-pipeline-quality.md |
| 39 | 147 | Constitutional memory manager command | 147-constitutional-memory-manager-command.md |
| 40 | 149 | Rendered memory template contract | 149-rendered-memory-template-contract.md |
| 41 | 150 | Source-dist alignment validation | 150-source-dist-alignment-validation.md |
| 42 | 151 | MODULE_MAP.md accuracy validation | 151-module-map-accuracy.md |
| 43 | 152 | No symlinks in lib/ tree | 152-no-symlinks-in-lib-tree.md |
| 44 | 154 | JSON-primary deprecation posture | 154-json-primary-deprecation-posture.md |

#### Group E: JSON Mode Structured Summary Hardening (16 IDs: 1 parent + 15 sub-scenarios)

| # | ID | Scenario | Source File |
|---|-----|----------|-------------|
| 45 | 153 | JSON mode structured summary hardening (parent) | 153-json-mode-hybrid-enrichment.md |
| 46 | 153-A | Post-save quality review output verification | (sub-scenario of 153) |
| 47 | 153-B | sessionSummary propagates to frontmatter title | (sub-scenario of 153) |
| 48 | 153-C | triggerPhrases propagate to frontmatter trigger_phrases | (sub-scenario of 153) |
| 49 | 153-D | keyDecisions propagate to non-zero decision_count | (sub-scenario of 153) |
| 50 | 153-E | importanceTier propagates to frontmatter importance_tier | (sub-scenario of 153) |
| 51 | 153-F | contextType propagates for full documented valid enum | (sub-scenario of 153) |
| 52 | 153-G | Contamination filter cleans hedging in sessionSummary | (sub-scenario of 153) |
| 53 | 153-H | Fast-path filesModified to FILES conversion | (sub-scenario of 153) |
| 54 | 153-I | Unknown field warning for typos | (sub-scenario of 153) |
| 55 | 153-J | contextType enum rejection | (sub-scenario of 153) |
| 56 | 153-K | Quality score discriminates contaminated vs clean | (sub-scenario of 153) |
| 57 | 153-L | Trigger phrase filter removes path fragments | (sub-scenario of 153) |
| 58 | 153-M | Embedding retry stats visible in memory_health | (sub-scenario of 153) |
| 59 | 153-N | Default-on pre-save overlap warning uses exact content match | (sub-scenario of 153) |
| 60 | 153-O | projectPhase override propagates to frontmatter | (sub-scenario of 153) |

### Feature Catalog Cross-Reference (17 features)

| # | Feature Catalog Entry | Mapped Scenario IDs |
|---|----------------------|---------------------|
| 1 | 01-tree-thinning-for-spec-folder-consolidation.md | 061 |
| 2 | 02-architecture-boundary-enforcement.md | (no dedicated scenario) |
| 3 | 03-progressive-validation-for-spec-documents.md | 062 |
| 4 | 04-dead-code-removal.md | 070 |
| 5 | 05-code-standards-alignment.md | 089 |
| 6 | 06-real-time-filesystem-watching-with-chokidar.md | 099 |
| 7 | 07-standalone-admin-cli.md | 113 |
| 8 | 08-watcher-delete-rename-cleanup.md | (covered by 099) |
| 9 | 09-migration-checkpoint-scripts.md | 127 |
| 10 | 10-schema-compatibility-validation.md | 128 |
| 11 | 11-feature-catalog-code-references.md | 135, 136, 137 |
| 12 | 12-session-capturing-pipeline-quality.md | M-007 group, 139 |
| 13 | 13-constitutional-memory-manager-command.md | 147 |
| 14 | 14-source-dist-alignment-enforcement.md | 150 |
| 15 | 15-module-boundary-map.md | 138, 151 |
| 16 | 16-json-mode-hybrid-enrichment.md | 153 group |
| 17 | 17-json-primary-deprecation-posture.md | 154 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Execute all 5 PHASE-xxx scenarios (PHASE-001 through PHASE-005) | Each produces documented pass/fail evidence |
| REQ-002 | Execute M-004 main-agent review scenario | Pass/fail evidence recorded |
| REQ-003 | Execute M-007 parent + all 17 sub-scenarios (M-007a through M-007q) | Each sub-scenario individually verified with evidence |
| REQ-004 | Execute all 20 tooling utility scenarios (061, 062, 070, 089, 099, 108, 113, 127, 128, 135, 136, 137, 138, 139, 147, 149, 150, 151, 152, 154) | Each produces documented pass/fail evidence |
| REQ-005 | Execute 153 parent + all 15 sub-scenarios (153-A through 153-O) | Each sub-scenario individually verified with evidence |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Record blockers or environmental prerequisites discovered during testing | Documented in implementation-summary.md |
| REQ-007 | Cross-reference feature catalog entries for each scenario | Verified scenario maps to correct feature catalog item |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 60 exact scenario IDs executed with individual pass/fail evidence
- **SC-002**: Zero untested scenarios remaining in 16--tooling-and-scripts
- **SC-003**: Checklist fully populated with evidence references for each scenario group
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Playbook scenario files in manual_testing_playbook/16--tooling-and-scripts/ | Cannot test without source scenarios | Verify files exist before starting |
| Dependency | generate-context.js script availability | M-007 sub-scenarios require working save pipeline | Verify script runs before M-007 group |
| Risk | M-007 sub-scenarios require multiple CLI environments (OpenCode, Claude, Codex, Copilot, Gemini) | High -- may not have all 5 CLI targets available | Test available CLIs, defer unavailable with documentation |
| Risk | 153 sub-scenarios require specific JSON payloads to trigger exact code paths | Med -- payloads must be carefully constructed | Prepare test fixtures from scenario descriptions |
| Risk | Phase workflow scenarios (PHASE-002 through PHASE-005) create temporary artifacts | Med -- could affect other spec folders | Use sandbox folders, clean up after evidence capture |
| Risk | 139 scenario overlaps with M-007 coverage | Low -- may produce duplicate evidence | Use M-007 as canonical source, 139 as cross-validation |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each individual scenario should complete within 120 seconds
- **NFR-P02**: Full phase execution target under 6 hours (60 scenarios with sub-scenarios)

### Reliability
- **NFR-R01**: Evidence must be reproducible (exact commands documented)
- **NFR-R02**: Failures must include exact error output verbatim
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Sub-Scenario Boundaries
- M-007 sub-scenarios (a through q) may have ordering dependencies -- test sequentially
- 153 sub-scenarios (A through O) test independent JSON field propagation paths -- can be parallelized
- Some sub-scenarios share setup state (e.g., M-007e through M-007i all test CLI fallback paths)

### Environmental Dependencies
- M-007e (OpenCode), M-007f (Claude), M-007g (Codex), M-007h (Copilot), M-007i (Gemini) each require a specific CLI environment
- 153-M requires embedding retry configuration to be active
- PHASE scenarios require create.sh and validate.sh scripts to be functional
- 150 requires source and dist directories to be present and aligned
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 23/25 | 60 exact IDs across 28 scenario files, 5 distinct groups |
| Risk | 15/25 | Multi-CLI dependencies, JSON pipeline complexity, sandbox management |
| Research | 7/20 | Scenarios are pre-defined in playbook, minimal discovery needed |
| **Total** | **45/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None at this time. All 60 scenario IDs and their groupings are defined by the playbook.
<!-- /ANCHOR:questions -->
