---
title: "Tasks: Template Compliance [template:level_1/tasks.md]"
---
# Tasks: Template Compliance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read existing template files under `templates/core/` and `templates/extended/` to inventory fingerprint targets
- [ ] T002 Review current `check-template-headers.sh` WARN-level behavior and identify lines to upgrade (`scripts/validators/check-template-headers.sh`)
- [ ] T003 Review current `check-anchors.sh` to identify extension point for `--fingerprint` flag (`scripts/validators/check-anchors.sh`)
- [ ] T004 Confirm delegation prompt builder file location and interface for REQ-003 (`scripts/lib/delegation-prompt-builder.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Fingerprint Generation (REQ-001)

- [ ] T005 Create `scripts/validators/generate-fingerprint.sh` that extracts ordered header sequence and anchor sequence from a template file (`scripts/validators/generate-fingerprint.sh`)
- [ ] T006 Define fingerprint JSON format with `headers: string[]` and `anchors: string[]` arrays preserving order (`scripts/validators/generate-fingerprint.sh`)
- [ ] T007 [P] Generate `.fingerprint` sidecar files for all templates under `templates/core/` (`templates/core/*.fingerprint`)
- [ ] T008 [P] Generate `.fingerprint` sidecar files for all templates under `templates/extended/` (`templates/extended/*.fingerprint`)

### Anchor Validator Extension (REQ-002)

- [ ] T009 Add `--fingerprint` flag to `check-anchors.sh` (`scripts/validators/check-anchors.sh`)
- [ ] T010 Implement `SPECKIT_TEMPLATE_SOURCE` reading from target file to locate the template fingerprint (`scripts/validators/check-anchors.sh`)
- [ ] T011 Implement anchor sequence comparison: exit non-zero on mismatch, report missing/extra/reordered anchors (`scripts/validators/check-anchors.sh`)

### Header Validator Upgrade (REQ-001, REQ-002)

- [ ] T012 Upgrade `check-template-headers.sh` from WARN to ERROR for missing required headers (`scripts/validators/check-template-headers.sh`)
- [ ] T013 Add header-order validation against fingerprint in `check-template-headers.sh` (`scripts/validators/check-template-headers.sh`)
- [ ] T014 Keep WARN for non-critical deviations (extra custom headers appended after standard sections) (`scripts/validators/check-template-headers.sh`)

### Post-Agent Validation Gate (REQ-004)

- [ ] T015 Add `--strict` flag to `validate.sh` enabling fingerprint comparison after standard validation (`scripts/validators/validate.sh`)
- [ ] T016 Wire `--strict` into post-agent workflow so agent-created spec docs are validated before indexing (`scripts/validators/validate.sh`)
- [ ] T017 Ensure `--strict` returns exit code 2 (error) on structural deviation (`scripts/validators/validate.sh`)

### Delegation Prompt Inlining (REQ-003)

- [ ] T018 Update delegation prompt builder to read full template content and embed inline (`scripts/lib/delegation-prompt-builder.ts`)
- [ ] T019 Remove path-only template references from delegation prompts for external agents (`scripts/lib/delegation-prompt-builder.ts`)
- [ ] T020 Verify inlined templates are complete and untruncated in generated prompts (`scripts/lib/delegation-prompt-builder.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T021 Test fingerprint generation: run `generate-fingerprint.sh` on each template, verify output JSON correctness
- [ ] T022 Test anchor fingerprint comparison: run `check-anchors.sh --fingerprint` on compliant and non-compliant fixture files
- [ ] T023 Test header validator: confirm ERROR on missing required headers, WARN on extra custom headers
- [ ] T024 Test `validate.sh --strict` end-to-end on compliant and non-compliant fixture spec docs
- [ ] T025 Test delegation prompt builder: verify external agent dispatch includes full template markdown inline
- [ ] T026 Verify zero false negatives: run `validate.sh --strict` against all existing compliant spec docs (SC-001)
- [ ] T027 Verify structural deviations produce ERROR-level output before indexing (SC-002)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
