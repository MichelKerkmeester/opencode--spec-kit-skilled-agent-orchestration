---
title: "Phase Parent: Follow-up Quality Pass for 031-036"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Phase parent for the 6-child follow-up quality and alignment pass after packets 031-036 shipped. Children: sk-code-opencode audit, feature catalog trio, manual testing playbook trio, sk-doc template alignment, dedicated stress-test folder migration, README cascade refresh."
trigger_phrases:
  - "037-followup-quality-pass"
  - "follow-up quality pass"
  - "post-031-036 quality alignment"
  - "stress-test folder migration"
  - "feature catalog trio"
  - "testing playbook trio"
importance_tier: "important"
contextType: "phase-parent"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/037-followup-quality-pass"
    last_updated_at: "2026-04-29T20:35:30+02:00"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Resource map indexed"
    next_safe_action: "Use packet for downstream work"
    blockers: []
    completion_pct: 100
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: phase-parent -->

# Phase Parent: Follow-up Quality Pass

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Type** | Phase parent (lean manifest only) |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-04-29 |
| **Branch** | `main` |
| **Parent** | `026-graph-and-context-optimization` |
| **Children** | 6 child packets (Level 2 each) |
| **Executor** | cli-codex `gpt-5.5` reasoning=`high` service-tier=`fast` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Packets 031-036 shipped a wave of remediation work (5 packets implementing 013's research findings + 035's CONDITIONAL verdict + 036's CLI matrix adapters). That work touched ~30+ docs, added ~10 new code files, and implemented multiple new MCP tools and runtime behaviors.

Before declaring the 026-wrapper packet truly release-ready, this phase parent runs a 6-child quality and alignment pass:

1. Verify all newly-created code aligns with sk-code-opencode standards; update sk-code-opencode itself if patterns are missing.
2. Update the feature catalogs in system-spec-kit, skill_advisor, and code_graph to reflect the new tools/handlers/runners.
3. Update the manual testing playbooks in system-spec-kit, skill_advisor, and code_graph for reproducible operator testing of the new surfaces.
4. Verify all touched documentation aligns with sk-doc templates; fix non-compliance.
5. Migrate the stress-test logic out of `mcp_server/tests/` into a dedicated `mcp_server/stress_test/` folder so it can be maintained from a single place.
6. Cascade README refreshes through `mcp_server/`, parent skill docs, and related references.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### Children Manifest

| Child | Slug | Tier | Effort | Deps |
|-------|------|------|--------|------|
| 001 | sk-code-opencode-audit | A audit | 30-60 min cli-codex | (gates 002-006) |
| 002 | feature-catalog-trio | B doc | 30-60 min cli-codex | 001 |
| 003 | testing-playbook-trio | B doc | 30-60 min cli-codex | 001 |
| 004 | sk-doc-template-alignment | B doc | 45-90 min cli-codex | 001 |
| 005 | stress-test-folder-migration | C code+config | 45-90 min cli-codex | 001 |
| 006 | readme-cascade-refresh | B doc | 30-60 min cli-codex | 002, 003, 004, 005 |

### Out of Scope

- Implementing additional remediation features (covered by 031-036; new work goes to 038+)
- Re-running the full automation matrix (035's CONDITIONAL stands until 036's runners enable a re-run)
- Modifying any spec/plan docs of 031-036 (already shipped)
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

The phase parent inherits requirements from each child packet's spec.md. Aggregate requirements:

- All 6 children ship with strict validator green
- All children's deps are honored (001 gates 002-005; 006 depends on 002-005)
- No regression in packets 031-036's validators
- Build green; new tests pass; no broken cross-references after stress-test folder migration
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:dependencies -->
## 5. DEPENDENCIES

| Source | Type | Status |
|--------|------|--------|
| Packet 031 doc-truth-pass | Internal | Shipped (`004b5c9c2`) |
| Packet 032 watcher retraction | Internal | Shipped (`9c3da0496`) |
| Packet 033 retention sweep | Internal | Shipped (`9c3da0496`) |
| Packet 034 half-auto upgrades | Internal | Shipped (`f1167567a`) |
| Packet 035 full-matrix execution | Internal | Shipped (`6655b67db`) |
| Packet 036 CLI matrix adapters | Internal | In flight (parallel agent) |
| sk-code-opencode skill | Internal | Active reference |
| sk-doc skill | Internal | Active reference |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All 6 child packets ship with strict validator green
- 037/001 produces an audit report; any sk-code-opencode violations are either fixed or documented as accepted exceptions
- Feature catalogs (3) reflect all new MCP tools and runtime surfaces from 031-036
- Manual testing playbooks (3) have new entries for memory_retention_sweep, advisor_rebuild, codex freshness-smoke-check, CLI matrix adapters
- All 30+ touched docs pass sk-doc template alignment
- Stress-test logic lives at `.opencode/skill/system-spec-kit/mcp_server/stress_test/` (NOT in tests/); imports updated; build green
- README cascade is consistent: tool counts, file paths, capability matrix all current

### Acceptance Scenarios

- **SCN-001**: **Given** sub-task 037/001 completes, **when** a reviewer reads the audit report, **then** every new file from 033/034/036 is checked against sk-code-opencode + at least one finding (PASS or fix-applied) is recorded.
- **SCN-002**: **Given** sub-task 037/005 completes, **when** an operator runs the stress test from `mcp_server/stress_test/`, **then** the test runs successfully without any reference to `mcp_server/tests/stress*` paths.
- **SCN-003**: **Given** sub-task 037/006 completes, **when** a reviewer reads the mcp_server README at `.opencode/skill/system-spec-kit/mcp_server/README.md`, **then** the tool count, capability matrix, and file structure references are all current as of 036's completion.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:phase-doc-map -->
## 6. PHASE DOCUMENTATION MAP

| Child | spec.md | plan.md | tasks.md | checklist.md | implementation-summary.md |
|-------|---------|---------|----------|--------------|---------------------------|
| 001-sk-code-opencode-audit | [001/spec.md](001-sk-code-opencode-audit/spec.md) | [plan](001-sk-code-opencode-audit/plan.md) | [tasks](001-sk-code-opencode-audit/tasks.md) | [checklist](001-sk-code-opencode-audit/checklist.md) | [impl](001-sk-code-opencode-audit/implementation-summary.md) |
| 002-feature-catalog-trio | [002/spec.md](002-feature-catalog-trio/spec.md) | [plan](002-feature-catalog-trio/plan.md) | [tasks](002-feature-catalog-trio/tasks.md) | [checklist](002-feature-catalog-trio/checklist.md) | [impl](002-feature-catalog-trio/implementation-summary.md) |
| 003-testing-playbook-trio | [003/spec.md](003-testing-playbook-trio/spec.md) | [plan](003-testing-playbook-trio/plan.md) | [tasks](003-testing-playbook-trio/tasks.md) | [checklist](003-testing-playbook-trio/checklist.md) | [impl](003-testing-playbook-trio/implementation-summary.md) |
| 004-sk-doc-template-alignment | [004/spec.md](004-sk-doc-template-alignment/spec.md) | [plan](004-sk-doc-template-alignment/plan.md) | [tasks](004-sk-doc-template-alignment/tasks.md) | [checklist](004-sk-doc-template-alignment/checklist.md) | [impl](004-sk-doc-template-alignment/implementation-summary.md) |
| 005-stress-test-folder-migration | [005/spec.md](005-stress-test-folder-migration/spec.md) | [plan](005-stress-test-folder-migration/plan.md) | [tasks](005-stress-test-folder-migration/tasks.md) | [checklist](005-stress-test-folder-migration/checklist.md) | [impl](005-stress-test-folder-migration/implementation-summary.md) |
| 006-readme-cascade-refresh | [006/spec.md](006-readme-cascade-refresh/spec.md) | [plan](006-readme-cascade-refresh/plan.md) | [tasks](006-readme-cascade-refresh/tasks.md) | [checklist](006-readme-cascade-refresh/checklist.md) | [impl](006-readme-cascade-refresh/implementation-summary.md) |
<!-- /ANCHOR:phase-doc-map -->

---

<!-- ANCHOR:children -->
## 7. CHILDREN STATUS

| Child | Status | Last update |
|-------|--------|-------------|
| 001-sk-code-opencode-audit | Planned | 2026-04-29 |
| 002-feature-catalog-trio | Planned | 2026-04-29 |
| 003-testing-playbook-trio | Planned | 2026-04-29 |
| 004-sk-doc-template-alignment | Planned | 2026-04-29 |
| 005-stress-test-folder-migration | Planned | 2026-04-29 |
| 006-readme-cascade-refresh | Planned | 2026-04-29 |
<!-- /ANCHOR:children -->

---

<!-- ANCHOR:risks -->
## 7. RISKS

| Type | Item | Mitigation |
|------|------|------------|
| Risk | Stress-test folder migration (005) breaks vitest config | Verify build + test runs before commit; capture before/after import diffs |
| Risk | Feature catalogs in 3 skills may not exist yet at fixed paths | 037/002 prompt instructs cli-codex to discover catalog locations first |
| Risk | sk-doc template alignment could surface drift in pre-existing docs | Scope to docs touched by 031-036 only; pre-existing drift is out of scope |
| Risk | README cascade misses references | 037/006 runs after 002-005 to capture all migrations |
<!-- /ANCHOR:risks -->
