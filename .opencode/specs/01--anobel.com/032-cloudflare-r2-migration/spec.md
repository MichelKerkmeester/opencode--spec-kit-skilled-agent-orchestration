---
title: "Feature Specification: Cloudflare R2 + Worker Migration [01--anobel.com/032-cloudflare-r2-migration/spec]"
description: "Document the Cloudflare account migration setup needed to move the upload Worker and R2 storage from a personal account into A. Nobel's company account."
trigger_phrases:
  - "spec"
  - "cloudflare"
  - "worker"
  - "migration"
  - "032"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: Cloudflare R2 + Worker Migration

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-02-14 |
| **Branch** | `032-cloudflare-r2-migration` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The upload Worker and public R2 assets still live in the personal `cloudflare-decorated911` account instead of A. Nobel's company Cloudflare account. The team needs a step-by-step dashboard guide before any production URLs can be replaced safely.

### Purpose
Produce a migration guide that documents the current state, target setup steps, and follow-up sequence for moving the Worker and R2 storage into the company-owned account.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create a step-by-step Cloudflare Dashboard setup guide for the Worker and R2 migration.
- Capture the current personal-account Worker and CDN bucket details.
- Document the migration sequence needed before codebase URL replacements happen.

### Out of Scope
- Actual URL replacement in application files, which is a follow-up task after the new account is ready.
- DNS or custom-domain configuration.
- Custom domain setup for the Worker or R2 bucket.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/01--anobel.com/032-cloudflare-r2-migration/spec.md` | Modify | Normalize the feature specification to the Level 1 template |
| `.opencode/specs/01--anobel.com/032-cloudflare-r2-migration/plan.md` | Modify | Document the migration-guide approach and sequencing |
| `.opencode/specs/01--anobel.com/032-cloudflare-r2-migration/tasks.md` | Modify | Break the documentation work into setup, drafting, and verification tasks |
| `.opencode/specs/01--anobel.com/032-cloudflare-r2-migration/cloudflare-setup-guide.md` | Preserve | Primary deliverable referenced by this spec |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The documentation must describe the current Worker and R2 hosting state in the personal Cloudflare account. | The guide names the current Worker URL, the current public R2 URL, and the migration context they represent. |
| REQ-002 | The migration documentation must provide a dashboard-oriented setup sequence for the company account. | A reader can follow the guide to recreate the Worker and R2 setup in the company account without relying on undocumented assumptions. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The spec package must identify which follow-up work depends on this guide being complete. | The docs state that codebase URL replacement is a separate task that starts after the company account setup is finished. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The migration guide clearly explains how to move the upload Worker and R2 storage from the personal account into the company account.
- **SC-002**: The documentation preserves the current-state references that future implementation work will need for verification and cutover planning.

### Acceptance Scenarios
- **Given** the current personal-account setup, **when** someone reviews this spec package, **then** they can identify the existing Worker and R2 endpoints that need to be replaced later.
- **Given** the company Cloudflare account is ready for setup, **when** someone follows the linked migration guide, **then** they can execute the dashboard steps without changing application code yet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Access to A. Nobel's company Cloudflare account | Migration guide cannot be executed without the target account | Keep the guide focused on dashboard steps and prerequisites so account owners can execute it later |
| Dependency | Accurate inventory of current Worker and R2 resources | Follow-up cutover work may miss references if the inventory is incomplete | Preserve the current Worker URL, bucket URL, and noted file-reference count in the docs |
| Risk | Migration work starts before the target account is ready | Team could mix setup work with URL replacement and create partial cutover state | Keep the docs explicit that code changes happen only after account setup completes |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What exact company-account naming conventions should be used for the migrated Worker and R2 resources?
- Will custom-domain and DNS configuration be documented in a separate follow-up spec after the base migration is complete?
<!-- /ANCHOR:questions -->

---
