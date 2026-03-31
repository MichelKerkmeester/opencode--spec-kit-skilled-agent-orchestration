---
title: "Implementation Plan: Create Command YAML Refinement [03--commands-and-skills/027-cmd-create-yaml-refinement/plan]"
description: "Plan the refinement pass that aligns the create-command YAML assets with a richer spec_kit-style top-level workflow contract."
trigger_phrases:
  - "create yaml refinement plan"
  - "create command yaml standardization plan"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Plan: Create Command YAML Refinement

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | YAML, Markdown |
| **Framework** | OpenCode command assets + `spec_kit` workflow-style normalization |
| **Storage** | Git working tree |
| **Testing** | YAML parse checks, targeted document validation, spec validator |

### Overview
Implementation is organized as one documentation-asset refinement pass. The work first upgrades the feature-catalog and testing-playbook YAML pairs into fully structured auto/confirm workflows, then adds the shared top-level contract sections to the broader create suite so the family of assets more closely mirrors the richer `spec_kit` style.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Target style baseline identified in `.opencode/command/spec_kit/assets/*.yaml`
- [x] The broader create asset suite inspected for structural drift
- [x] Scope limited to create YAML assets plus this spec packet

### Definition of Done
- [x] The targeted create YAML assets share one recognizable top-level contract
- [x] Feature-catalog and testing-playbook auto/confirm pairs are structurally aligned
- [x] YAML parse checks pass for every file in `.opencode/command/create/assets/`
- [x] This Level 3 packet reflects the actual refinement work and verification evidence
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation-asset normalization across one command-family folder.

### Key Components
- **Style baseline**: `.opencode/command/spec_kit/assets/*.yaml`
- **Primary refinement targets**:
  - `create_feature_catalog_*`
  - `create_testing_playbook_*`
- **Broader suite normalization targets**:
  - `create_agent_*`
  - `create_changelog_*`
  - `create_folder_readme_*`
- **Verification scope**:
  - YAML parse pass across all create assets
  - Targeted command README validation
  - Spec validator for this packet

### Data Flow
Inspect `spec_kit` and the existing create assets -> identify missing shared sections -> rewrite the thinner newer assets -> add shared top-level sections to the broader suite -> run parse and validation checks -> record evidence in this packet.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Audit and contract lock
- [x] Compare the create asset suite with `spec_kit` YAML style
- [x] Identify the shared top-level sections the suite should expose
- [x] Freeze the scope to YAML refinement, not command-behavior redesign

### Phase 2: Strengthen the newer YAML pairs
- [x] Rewrite `create_feature_catalog_auto.yaml`
- [x] Rewrite `create_feature_catalog_confirm.yaml`
- [x] Rewrite `create_testing_playbook_auto.yaml`
- [x] Rewrite `create_testing_playbook_confirm.yaml`

### Phase 3: Broader suite normalization
- [x] Add the shared top-level contract sections to `create_agent_*`
- [x] Add the shared top-level contract sections to `create_changelog_*`
- [x] Add the shared top-level contract sections to `create_folder_readme_*`

### Phase 4: Verification and closure
- [x] Parse every file in `.opencode/command/create/assets/`
- [x] Re-validate the relevant command README surfaces
- [x] Validate this spec folder cleanly enough for closure
- [x] Update `implementation-summary.md` and the checklist with actual evidence
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| YAML parse | All create YAML assets | `python3` with `yaml.safe_load` |
| Structural spot-check | Shared top-level keys across create assets | `python3` key inspection |
| Doc validation | `.opencode/command/create/README.txt`, `.opencode/command/README.txt` | `python3 .opencode/skill/sk-doc/scripts/validate_document.py` |
| Spec validation | `027-cmd-create-yaml-refinement` | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh ...` |

### Planned Scenario Checks

- **PC-001 Suite parse**: every file under `.opencode/command/create/assets/` parses successfully
- **PC-002 Pair symmetry**: feature-catalog auto/confirm share the same core contract
- **PC-003 Pair symmetry**: testing-playbook auto/confirm share the same core contract
- **PC-004 Broader normalization**: agent, changelog, and folder_readme now expose the shared top-level sections
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `.opencode/command/spec_kit/assets/*.yaml` | Internal | Available | Defines the richer workflow style we are aligning toward |
| Existing create YAML assets | Internal | Available | Provide the current command-specific behavior that must be preserved |
| `sk-doc` document validator | Internal | Available | Verifies the command README surfaces still validate after the suite cleanup |
| Spec validator | Internal | Available | Verifies this packet is no longer template scaffolding |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: YAML parse failures, structural regressions, or command-specific behavior loss caused by normalization.
- **Procedure**:
  1. Revert the affected YAML assets as one refinement batch.
  2. Re-run parse checks on the full asset folder.
  3. Re-apply the cleanup in smaller file groups if needed.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
<!-- ANCHOR:dependencies -->
## L2: PHASE DEPENDENCIES

```text
Audit and Contract Lock -> Newer Pair Rewrite -> Broader Suite Normalization -> Verification and Closure
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Audit and Contract Lock | None | Newer Pair Rewrite |
| Newer Pair Rewrite | Audit and Contract Lock | Broader Suite Normalization |
| Broader Suite Normalization | Newer Pair Rewrite | Verification and Closure |
| Verification and Closure | All prior phases | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
<!-- /ANCHOR:dependencies -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Audit and Contract Lock | Low | 30-45 minutes |
| Newer Pair Rewrite | Medium | 60-90 minutes |
| Broader Suite Normalization | Medium | 45-75 minutes |
| Verification and Closure | Medium | 30-60 minutes |
| **Total** | | **2.75-4.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Parse baseline and target files before editing
- [x] Keep command-specific behavior in place while normalizing structure
- [x] Validate YAML parsing before claiming success

### Rollback Procedure
1. Revert the YAML asset changes together.
2. Re-run the YAML parse pass and command-doc validation.
3. Re-apply the cleanup in smaller groups if a specific file family caused drift.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: File-level revert only
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
spec_kit YAML style baseline
            |
            v
  feature/testing pair rewrites
            |
            v
 agent/changelog/folder_readme normalization
            |
            v
      full asset parse verification
            |
            v
        spec packet closure
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Style audit | `spec_kit` YAMLs + create assets | Shared section contract | Pair rewrite |
| Pair rewrite | Style audit | Stronger feature/testing YAMLs | Broader normalization |
| Broader normalization | Pair rewrite | Cohesive top-level contract | Verification |
| Verification | All refined assets | Closure evidence | Completion |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Audit the create YAML suite** - establish the shared contract
2. **Rewrite the thinner feature/testing assets** - remove the biggest structural drift
3. **Normalize the broader asset suite** - spread the shared contract
4. **Verify parse and packet closure** - confirm the refinement is safe and documented

**Total Critical Path**: one linear refinement pass across the create asset folder

**Parallel Opportunities**:
- Review and spec-writing support can run in parallel with local implementation.
- YAML parse validation can run in parallel with packet cleanup.
<!-- /ANCHOR:critical-path -->

### Pre-Task Checklist
- [x] Confirm the `spec_kit` YAML suite is the comparison baseline.
- [x] Confirm scope is limited to create-command YAML assets plus this spec packet.
- [x] Confirm command behavior stays intact while structure is normalized.
- [x] Confirm parse and document validators are prepared before closeout.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| Scope lock | Only touch `.opencode/command/create/assets/`, related command README surfaces, and this spec packet |
| Behavioral safety | Normalize structure without changing command identity or hidden execution semantics |
| Validation before close | Re-run full YAML parse, targeted doc validation, and spec validation before finalizing |
| Honest residuals | Record remaining warnings exactly instead of over-claiming cleanliness |

### Status Reporting Format
Use `DONE`, `IN_PROGRESS`, or `BLOCKED`, always paired with the YAML asset family touched and the latest parser or validator evidence.

### Blocked Task Protocol
1. Stop on YAML parse regressions, validator regressions, or evidence mismatches.
2. Record the blocked asset family and the failing check.
3. Resolve the inconsistency before continuing with broader suite normalization claims.
