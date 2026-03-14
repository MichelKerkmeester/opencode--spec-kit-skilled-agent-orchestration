---
title: "Feature Specification: feature-flag-reference [template:level_2/spec.md]"
description: "Audit closeout for Feature Flag Reference after corrected source-file mappings and automated mapping validation guard were established."
# SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2
trigger_phrases:
  - "feature-flag-reference"
  - "feature flag reference"
  - "mapping guard"
  - "catalog alignment"
importance_tier: "high"
contextType: "general"
---
# Feature Specification: feature-flag-reference

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-03-14 |
| **Branch** | `020-feature-flag-reference` |
| **Parent Spec** | ../spec.md |
| **Previous Phase** | ../019-decisions-and-deferrals/spec.md |
| **Next Phase** | ../021-remediation-revalidation/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
This phase packet was left in stale draft/pending mode after mapping corrections had already landed in the feature catalog and mapping-validation tests. As a result, the docs no longer reflected current repository truth.

### Purpose
Publish a completed, verification-backed phase packet where mapping outcomes and guard evidence match current implementation and tests.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Align phase 020 docs to current feature catalog location: `feature_catalog/19--feature-flag-reference/`.
- Capture corrected mappings for `SPECKIT_ABLATION`, `SPECKIT_RRF`, `SPECKIT_LAZY_LOADING`, `MEMORY_DB_*`, `EMBEDDINGS_PROVIDER`, and `EMBEDDING_DIM`.
- Record automated mapping-validation guard evidence from `tests/feature-flag-reference-docs.vitest.ts`.

### Out of Scope
- Runtime code changes in `mcp_server/` or `shared/`.
- Edits to memory artifacts or unrelated phase folders.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/013-code-audit-per-feature-catalog/020-feature-flag-reference/spec.md` | Modify | Convert stale draft state to completed closeout state |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/013-code-audit-per-feature-catalog/020-feature-flag-reference/plan.md` | Modify | Mark completed execution and verification evidence |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/013-code-audit-per-feature-catalog/020-feature-flag-reference/tasks.md` | Modify | Move pending remediation tasks to completed closure tasks |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/013-code-audit-per-feature-catalog/020-feature-flag-reference/checklist.md` | Modify | Replace stale FAIL/WARN claims with current PASS evidence |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/013-code-audit-per-feature-catalog/020-feature-flag-reference/implementation-summary.md` | Modify | Document closeout and guard-validation outcome |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All seven feature docs in `feature_catalog/19--feature-flag-reference/` are represented in this phase packet | `spec.md`, `tasks.md`, and `checklist.md` reference all seven feature domains |
| REQ-002 | Corrected source-file mappings are reflected as closed outcomes | F-01, F-04, and F-05 mapping findings are documented as resolved with concrete evidence |
| REQ-003 | Automated mapping-validation guard evidence is recorded | `npm run test -- tests/feature-flag-reference-docs.vitest.ts` is captured as PASS |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Stale draft/pending claims are removed | Metadata and task/checklist states reflect complete closeout |
| REQ-005 | Markdown references in this folder resolve | `validate.sh --no-recursive` reports no missing markdown targets |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Phase 020 status is complete and no longer tracks resolved mapping issues as open FAIL/WARN.
- **SC-002**: Mapping guard test passes and is cited in checklist and summary evidence.
- **SC-003**: Folder validation passes with no missing markdown references.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:acceptance-scenarios -->
## 6. ACCEPTANCE SCENARIOS

1. **Given** corrected catalog mappings exist under `19--feature-flag-reference`, **When** phase docs are reviewed, **Then** path references and status claims align with those files.
2. **Given** the docs guard test validates critical env-var mappings, **When** the command runs, **Then** all checks pass and evidence is recorded.
3. **Given** this phase was previously left in draft/pending state, **When** tasks and checklist are reviewed, **Then** completed closure status is explicit and traceable.
4. **Given** markdown reference integrity requirements, **When** folder validation runs, **Then** no missing-markdown issues remain.
<!-- /ANCHOR:acceptance-scenarios -->

---

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `feature_catalog/19--feature-flag-reference/*.md` | Incorrect source paths would stale mapping claims again | Keep references pinned to current catalog folder and filenames |
| Dependency | `mcp_server/tests/feature-flag-reference-docs.vitest.ts` | Guard evidence unavailable if test is removed or broken | Retain guard command as required verification evidence |
| Risk | Future mapping drift after this closeout | Docs can become stale again | Keep test guard in active verification workflow |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Mapping verification should complete quickly enough for routine doc updates.
- **NFR-P02**: Evidence lookup from checklist to command output should be one hop.

### Security
- **NFR-S01**: No secrets or runtime-sensitive values are added to this phase packet.
- **NFR-S02**: Source references remain repository-internal and auditable.

### Reliability
- **NFR-R01**: Completed states reflect actual command and validation outputs only.
- **NFR-R02**: Mapping guard command remains reproducible in `mcp_server`.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: If a feature has no open findings, closure status is still explicitly documented.
- Maximum length: Long mapping evidence is summarized with command-level proof.
- Invalid format: Any broken path or missing markdown target blocks closeout.

### Error Scenarios
- External service failure: N/A for docs-only closeout.
- Network timeout: N/A for local repository validation.
- Concurrent access: Re-run validation if files change during closeout updates.

### State Transitions
- Partial completion: Keep pending markers until guard + validation commands complete.
- Session expiry: Tasks/checklist retain command evidence so closure can resume safely.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Five phase docs reconciled to current mapping reality |
| Risk | 15/25 | Main risk is future mapping drift if guard is ignored |
| Research | 9/20 | Current catalog/test evidence was already available |
| **Total** | **42/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should the mapping guard test be added to the default CI gate for every PR touching `feature_catalog/19--feature-flag-reference/`?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
