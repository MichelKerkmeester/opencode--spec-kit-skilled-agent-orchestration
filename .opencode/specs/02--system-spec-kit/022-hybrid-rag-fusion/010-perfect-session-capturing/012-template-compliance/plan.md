---
title: "Implementation Plan: Template Compliance"
---
# Implementation Plan: Template Compliance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Shell (Bash), TypeScript |
| **Framework** | system-spec-kit validator pipeline |
| **Storage** | `.fingerprint` sidecar files alongside templates |
| **Testing** | Shell script assertions, manual validation runs |

### Overview

This plan implements a fingerprint validation pattern: generate structural fingerprints (header sequence + anchor sequence) from each template file, add fingerprint comparison to the existing anchor validator, upgrade template-header checks from WARN to ERROR for critical deviations, and wire a `--strict` post-agent gate into `validate.sh`. The delegation prompt builder will also be updated to inline template content rather than referencing paths, ensuring external agents without filesystem access generate from the actual template structure.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (none -- builds on existing R-12 work)

### Definition of Done

- [ ] All acceptance criteria met (REQ-001 through REQ-004)
- [ ] Fingerprint files generated for all templates under `templates/`
- [ ] `validate.sh --strict` catches structural deviations in test fixtures
- [ ] Docs updated (spec/plan in this folder)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Fingerprint validation -- generate reference fingerprints from templates, compare generated output against reference at validation time.

### Key Components

- **Fingerprint generator**: Shell script that extracts ordered header sequence (`## N. TITLE`) and ordered anchor pairs (`ANCHOR:id`) from a template file and writes a `.fingerprint` sidecar
- **`check-anchors.sh --fingerprint`**: Extended anchor validator that loads the template fingerprint (via `SPECKIT_TEMPLATE_SOURCE` comment) and compares the generated file's anchor sequence against it
- **`check-template-headers.sh`**: Existing header validator upgraded from WARN to ERROR for missing required headers and wrong header order
- **`validate.sh --strict`**: New flag that adds fingerprint comparison to the standard validation pipeline as a post-agent gate
- **Delegation prompt builder**: Updated to embed full template markdown inline when dispatching to external agents

### Data Flow

1. At build time: fingerprint generator reads each template, extracts header + anchor sequences, writes `.fingerprint` sidecar files
2. At validation time: `validate.sh --strict` reads `SPECKIT_TEMPLATE_SOURCE` from the generated file, locates the matching `.fingerprint`, and runs `check-anchors.sh --fingerprint` to compare sequences
3. `check-template-headers.sh` independently validates header presence and order against the fingerprint, emitting ERROR for critical deviations
4. At delegation time: prompt builder reads full template content and embeds it in the agent dispatch prompt
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Fingerprint Generation

- [ ] Create `scripts/validators/generate-fingerprint.sh` that extracts header sequence and anchor sequence from a template file
- [ ] Generate `.fingerprint` sidecar files for all templates under `templates/core/` and `templates/extended/`
- [ ] Fingerprint format: JSON with `headers: string[]` and `anchors: string[]` arrays preserving order

### Phase 2: Anchor Validator Extension

- [ ] Add `--fingerprint` flag to `check-anchors.sh`
- [ ] When `--fingerprint` is set, read `SPECKIT_TEMPLATE_SOURCE` from the target file to locate the template fingerprint
- [ ] Compare generated file's anchor sequence against the template fingerprint; exit non-zero on mismatch
- [ ] Report which anchors are missing, extra, or out of order

### Phase 3: Header Validator Upgrade

- [ ] Upgrade `check-template-headers.sh` from WARN to ERROR for: missing required headers, headers in wrong order relative to fingerprint
- [ ] Keep WARN for non-critical deviations (e.g., extra custom headers appended after standard sections)

### Phase 4: Post-Agent Validation Gate

- [ ] Add `--strict` flag to `validate.sh` that enables fingerprint comparison after standard validation passes
- [ ] Wire `--strict` into the post-agent workflow so any agent-created spec docs are validated before indexing
- [ ] Ensure `--strict` returns exit code 2 (error) on structural deviation, not just exit code 1 (warning)

### Phase 5: Delegation Prompt Inlining

- [ ] Update delegation prompt builder to read full template content and embed it inline in dispatch prompts
- [ ] Remove path-only template references from delegation prompts for external agents (Copilot, Gemini)
- [ ] Verify inlined templates are complete and untruncated in generated prompts
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Fingerprint generation correctness for each template | Shell assertions comparing output against expected JSON |
| Unit | Anchor sequence comparison: match, mismatch, missing, extra, reordered | Shell assertions on `check-anchors.sh --fingerprint` exit codes |
| Integration | `validate.sh --strict` end-to-end on compliant and non-compliant fixtures | Shell script with fixture files |
| Manual | External agent delegation produces structurally valid output | Generate spec docs via Copilot/Gemini and run `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing `check-template-headers.sh` | Internal | Green | Already implemented in R-12 partial; this phase upgrades severity |
| Existing `check-anchors.sh` | Internal | Green | Already validates anchor balance; this phase adds fingerprint mode |
| Template files under `templates/` | Internal | Green | Source of truth for fingerprint generation |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Fingerprint comparison produces false positives on legitimate spec docs, blocking validation for existing compliant files
- **Procedure**: Remove `--strict` flag from post-agent gate calls; revert `check-template-headers.sh` severity back to WARN; fingerprint sidecar files can remain without impact since they are only consumed in `--fingerprint` mode
<!-- /ANCHOR:rollback -->
