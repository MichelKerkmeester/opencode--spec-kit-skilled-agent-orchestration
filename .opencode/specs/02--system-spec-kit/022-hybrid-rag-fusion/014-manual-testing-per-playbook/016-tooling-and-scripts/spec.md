---
title: "Feature Specification: 016-tooling-and-scripts manual testing"
description: "Manual test scenarios for tooling-and-scripts are distributed across the hybrid-rag-fusion playbook and related feature sources. This phase packet consolidates the 21 assigned scenarios into one structured spec with exact coverage, links, and acceptance criteria."
trigger_phrases:
  - "manual testing"
  - "tooling and scripts"
  - "phase 016"
  - "NEW-061"
  - "PHASE-005"
importance_tier: "high"
contextType: "general"
---
# Feature Specification: 016-tooling-and-scripts manual testing

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-03-16 |
| **Branch** | `main` |
| **Parent** | [`../spec.md`](../spec.md) |
| **Predecessor Phase** | `015-retrieval-enhancements` |
| **Successor Phase** | `017-governance` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Manual test scenarios for tooling-and-scripts need structured per-phase documentation instead of remaining spread across the monolithic playbook and mixed feature references. Operators need one canonical packet that preserves exact prompts, command sequences, evidence expectations, and verdict criteria for all 21 phase-016 scenarios.

### Purpose
Create a phase-specific specification for tooling-and-scripts so every assigned test can be executed, evidenced, and reviewed consistently under the manual testing playbook and review protocol.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Consolidate all 21 phase-016 scenarios: `NEW-061`, `NEW-062`, `NEW-070`, `NEW-089`, `NEW-099`, `NEW-108`, `NEW-113`, `NEW-127`, `NEW-128`, `NEW-135`, `NEW-136`, `NEW-137`, `NEW-138`, `NEW-139`, `NEW-147`, `NEW-149`, `PHASE-001`, `PHASE-002`, `PHASE-003`, `PHASE-004`, and `PHASE-005`.
- Preserve exact playbook-derived prompts, command flows, evidence expectations, and pass/fail verdict rules.
- Link each scenario to its feature catalog source or, for cross-cutting phase work, to the canonical phase-system catalog section.
- Capture source-aware caveats where the playbook index and detailed scenario text are not perfectly aligned.

### Out of Scope
- Executing the manual tests or recording live verdicts.
- Editing playbook rows, feature catalog entries, or phase-system source specs.
- Creating `tasks.md`, `checklist.md`, or `implementation-summary.md` in this phase folder.

### Test Inventory

| Test ID | Scenario | Feature Link |
|---|---|---|
| `NEW-061` | Tree thinning for spec folder consolidation | [01-tree-thinning-for-spec-folder-consolidation.md](../../feature_catalog/16--tooling-and-scripts/01-tree-thinning-for-spec-folder-consolidation.md) |
| `NEW-062` | Progressive validation for spec documents | [03-progressive-validation-for-spec-documents.md](../../feature_catalog/16--tooling-and-scripts/03-progressive-validation-for-spec-documents.md) |
| `NEW-070` | Dead code removal | [04-dead-code-removal.md](../../feature_catalog/16--tooling-and-scripts/04-dead-code-removal.md) |
| `NEW-089` | Code standards alignment | [05-code-standards-alignment.md](../../feature_catalog/16--tooling-and-scripts/05-code-standards-alignment.md) |
| `NEW-099` | Real-time filesystem watching with chokidar | [06-real-time-filesystem-watching-with-chokidar.md](../../feature_catalog/16--tooling-and-scripts/06-real-time-filesystem-watching-with-chokidar.md) |
| `NEW-108` | Spec 007 finalized verification command suite evidence | [feature_catalog.md#20-ux-hooks](../../feature_catalog/feature_catalog.md#20-ux-hooks) |
| `NEW-113` | Standalone admin CLI | [07-standalone-admin-cli.md](../../feature_catalog/16--tooling-and-scripts/07-standalone-admin-cli.md) |
| `NEW-127` | Migration checkpoint scripts | [09-migration-checkpoint-scripts.md](../../feature_catalog/16--tooling-and-scripts/09-migration-checkpoint-scripts.md) |
| `NEW-128` | Schema compatibility validation | [10-schema-compatibility-validation.md](../../feature_catalog/16--tooling-and-scripts/10-schema-compatibility-validation.md) |
| `NEW-135` | Grep traceability for feature catalog code references | [11-feature-catalog-code-references.md](../../feature_catalog/16--tooling-and-scripts/11-feature-catalog-code-references.md) |
| `NEW-136` | Feature catalog annotation name validity | [11-feature-catalog-code-references.md](../../feature_catalog/16--tooling-and-scripts/11-feature-catalog-code-references.md) |
| `NEW-137` | Multi-feature annotation coverage | [11-feature-catalog-code-references.md](../../feature_catalog/16--tooling-and-scripts/11-feature-catalog-code-references.md) |
| `NEW-138` | MODULE: header compliance via `verify_alignment_drift.py` | [11-feature-catalog-code-references.md](../../feature_catalog/16--tooling-and-scripts/11-feature-catalog-code-references.md) |
| `NEW-139` | Session capturing pipeline quality | [12-session-capturing-pipeline-quality.md](../../feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md) |
| `NEW-147` | Constitutional memory manager command | [13-constitutional-memory-manager-command.md](../../feature_catalog/16--tooling-and-scripts/13-constitutional-memory-manager-command.md) |
| `NEW-149` | Rendered memory template contract | [12-session-capturing-pipeline-quality.md](../../feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md) |
| `PHASE-001` | Phase detection scoring | [feature_catalog.md#phase-detection-and-scoring-recommend-levelsh---recommend-phases](../../feature_catalog/feature_catalog.md#phase-detection-and-scoring-recommend-levelsh---recommend-phases) |
| `PHASE-002` | Phase folder creation | [feature_catalog.md#phase-folder-creation-createsh---phase](../../feature_catalog/feature_catalog.md#phase-folder-creation-createsh---phase) |
| `PHASE-003` | Recursive phase validation | [feature_catalog.md#recursive-phase-validation-validatesh---recursive](../../feature_catalog/feature_catalog.md#recursive-phase-validation-validatesh---recursive) |
| `PHASE-004` | Phase link validation | [feature_catalog.md#phase-link-validation-check-phase-linkssh](../../feature_catalog/feature_catalog.md#phase-link-validation-check-phase-linkssh) |
| `PHASE-005` | Phase command workflow | [feature_catalog.md#21-phase-system](../../feature_catalog/feature_catalog.md#21-phase-system) |

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Create | Phase 016 testing specification with scenario coverage and acceptance criteria |
| `plan.md` | Create | Phase 016 execution plan with prompts, phases, dependencies, and rollback guidance |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| `REQ-NEW-061` | Document `NEW-061` tree thinning coverage with its prompt, command sequence, evidence, and troubleshooting notes. | PASS if small files are merged, token savings are positive, and content integrity is preserved. |
| `REQ-NEW-062` | Document `NEW-062` progressive validation coverage across levels 1-4. | PASS if levels 1-4 produce progressively stricter validation and exit codes match severity. |
| `REQ-NEW-070` | Document `NEW-070` dead-code-removal verification steps and regression guardrails. | PASS if removed symbols have zero references and representative flows execute cleanly. |
| `REQ-NEW-089` | Document `NEW-089` code-standards-alignment checks for naming, comments, and import ordering. | PASS if all affected files conform to naming, commenting, and import order standards with zero mismatches. |
| `REQ-NEW-099` | Document `NEW-099` watcher validation including debounce, hash dedup, and ENOENT grace. | PASS if debounce works, hash dedup prevents redundant reindex, and ENOENT is handled silently. |
| `REQ-NEW-108` | Document `NEW-108` finalized Spec 007 verification command suite evidence. | PASS if build, lint, both Vitest suites, and MCP SDK stdio smoke checks match the recorded evidence totals and all pass. |
| `REQ-NEW-113` | Document `NEW-113` standalone admin CLI validation for stats, bulk-delete, reindex, and downgrade safety. | PASS if all 4 CLI commands execute correctly with expected output and safety features work (dry-run, safety prompt, best-effort checkpoint attempt). |
| `REQ-NEW-127` | Document `NEW-127` migration checkpoint script verification. | PASS if `migration-checkpoint-scripts.vitest.ts` completes with all tests passing and no failures. |
| `REQ-NEW-128` | Document `NEW-128` schema compatibility validation coverage. | PASS if `vector-index-schema-compatibility.vitest.ts` completes with all tests passing and no failures. |
| `REQ-NEW-135` | Document `NEW-135` grep traceability checks for feature-catalog annotations. | PASS if all 3 features return multi-layer hits with no orphaned file references. |
| `REQ-NEW-136` | Document `NEW-136` annotation-name validation against feature catalog H3 headings. | PASS if cross-reference produces 0 mismatches. |
| `REQ-NEW-137` | Document `NEW-137` multi-feature annotation coverage checks. | PASS if all checked multi-feature files have >= 2 annotations and no obviously-missing features. |
| `REQ-NEW-138` | Document `NEW-138` MODULE header compliance validation. | PASS if 0 `TS-MODULE-HEADER` findings are reported. |
| `REQ-NEW-139` | Document `NEW-139` session-capturing-pipeline-quality coverage using the canonical session-capturing quality section in the playbook. | PASS if all automated commands pass, package-clean MCP verification passes alongside the scripts-side closure suite, aligned baseline payload validates and indexes, thin aligned payloads fail with `INSUFFICIENT_CONTEXT_ABORT` and no new memory file write, mis-scoped stateless runs hard-fail `ALIGNMENT_BLOCK`, enrichment and rendered-memory contract checks pass, fallback paths remain deterministic across runtimes, and the terminal no-data path returns `NO_DATA_AVAILABLE`. |
| `REQ-NEW-147` | Document `NEW-147` `/memory:learn` constitutional manager workflow and doc-alignment checks. | PASS if all command flows match the constitutional contract and no active docs advertise the legacy learning/corrections behavior. |
| `REQ-NEW-149` | Document `NEW-149` rendered-memory contract enforcement and remediation coverage. | PASS if malformed files are rejected before write/index, apply-mode final reports are validator-clean for repairable sandbox cases, and the active audit reports no remaining structural violations. |
| `REQ-PHASE-001` | Document `PHASE-001` phase-detection scoring validation. | PASS if all three top-level fields are present and correctly typed, 5 dimensions are scored, and simple vs complex specs produce differentiated results. |
| `REQ-PHASE-002` | Document `PHASE-002` phase-folder creation validation. | PASS if parent contains Phase Documentation Map listing all 3 children, each child has parent back-reference, middle child has both predecessor and successor links, and all folders contain Level 3 templates. |
| `REQ-PHASE-003` | Document `PHASE-003` recursive phase-validation coverage. | PASS if `--recursive` discovers all `[0-9][0-9][0-9]-*/` child folders, validates each independently, produces aggregated JSON with per-phase status, and combined exit code escalates to highest severity. |
| `REQ-PHASE-004` | Document `PHASE-004` phase-link validation coverage. | PASS if all 4 link types are checked, valid folders exit 0, missing/broken links exit 1 with warn-level messages, and no link issue produces error severity. |
| `REQ-PHASE-005` | Document `PHASE-005` end-to-end `/spec_kit:phase` workflow coverage. | PASS if all 7 workflow steps complete without error, created folders match expected structure, link validation reports no warnings, and recursive validation exits 0. |

### P1 - Required (complete OR user-approved deferral)

All requested phase-016 scenarios are treated as blocking coverage items for this documentation packet; no additional P1-only scenarios are defined.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 21 assigned scenarios are documented with source-linked scope entries and per-test acceptance criteria.
- **SC-002**: The paired `plan.md` includes the exact prompt for every scenario in the testing-strategy table.
- **SC-003**: The documentation explicitly captures expected commands, evidence artifacts, and review-protocol verdict handling (`PASS`, `PARTIAL`, `FAIL`).
- **SC-004**: Cross-cutting exceptions are transparent, including the session-capturing playbook-row gap for `NEW-139` and the phase-system catalog anchors used for `PHASE-001` through `PHASE-005`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `../../manual_testing_playbook/manual_testing_playbook.md` | Canonical prompts, commands, evidence, and pass/fail rules come from this source. | Treat the playbook as the source of truth and preserve its wording where possible. |
| Dependency | `../../manual_testing_playbook/review_protocol.md` | Verdict semantics determine how evidence converts into `PASS`, `PARTIAL`, or `FAIL`. | Carry verdict rules into the plan's execution pipeline and evidence expectations. |
| Dependency | `../../feature_catalog/16--tooling-and-scripts/` and `../../feature_catalog/feature_catalog.md` | Scenario-to-feature traceability depends on correct relative links. | Link every scenario to its feature source and note cross-cutting phase anchors explicitly. |
| Dependency | MCP runtime, shell tooling, and sandbox spec folders | Several scenarios create folders, modify files, invoke MCP tools, or rely on runtime logs. | Run destructive scenarios only in sandbox targets with checkpoints or disposable folders. |
| Risk | `NEW-139` exists in the cross-reference index but lacks a dedicated main scenario-table row | Documentation could drift if a prompt or acceptance rule is invented. | Use the detailed session-capturing quality section in the playbook as the canonical source and state that choice explicitly. |
| Risk | `PHASE-005` is broader than a single leaf feature entry | The command workflow spans scoring, creation, link validation, and recursive validation. | Link to the phase-system catalog section and describe the workflow as cross-cutting command coverage. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should `NEW-139` be promoted from the cross-reference index into the main scenario table so future phase packets do not need to source it from the session-capturing quality section?
- Should the phase-system section eventually gain a dedicated catalog leaf for `/spec_kit:phase` so `PHASE-005` can point to a single feature file instead of the section anchor?
<!-- /ANCHOR:questions -->

---
