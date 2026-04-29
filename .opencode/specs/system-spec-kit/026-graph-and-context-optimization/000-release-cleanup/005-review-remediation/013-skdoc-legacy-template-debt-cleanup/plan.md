---
title: "Implementation Plan: sk-doc Legacy Template Debt Cleanup [template:level_2/plan.md]"
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
description: "Batched remediation plan for older spec docs flagged by the sk-doc template alignment audit. The work computes protected exclusions first, then applies additive continuity, anchor, template-source, and low-risk metadata fixes."
trigger_phrases:
  - "013-skdoc-legacy-template-debt-cleanup plan"
  - "sk-doc audit remediation plan"
  - "tier 4 legacy template cleanup plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/013-skdoc-legacy-template-debt-cleanup"
    last_updated_at: "2026-04-29T11:10:00Z"
    last_updated_by: "codex-gpt-5.5"
    recent_action: "Completed grouped sk-doc audit remediation and verification"
    next_safe_action: "Use implementation-summary.md for Tier 5 deferral context"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
    completion_pct: 100
---
# Implementation Plan: sk-doc Legacy Template Debt Cleanup

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, YAML frontmatter |
| **Framework** | system-spec-kit v2.2 templates |
| **Storage** | Spec docs under `.opencode/specs/**` via `specs` symlink |
| **Testing** | sk-doc audit grep checks plus `validate.sh --strict` |

### Overview

This packet remediates legacy template-shape debt surfaced by `/tmp/audit-skdoc-alignment-report.md`. The work is intentionally additive: compute exclusions, insert missing continuity blocks, add missing anchor scaffolds or wrappers, restore template-source body markers, and only apply MED fixes that do not rewrite old narrative content.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Packet spec identifies REQ-001 through REQ-006.
- [x] Audit report exists at `/tmp/audit-skdoc-alignment-report.md`.
- [x] Protected folders are explicitly excluded before remediation.

### Definition of Done
- [ ] Eligible HIGH findings are remediated or documented as protected/deferred.
- [ ] MED findings are reduced where the fix is metadata-only or scaffold-only.
- [ ] `013` packet strict validation exits 0.
- [ ] Today's protected packets validate with exit 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Deterministic batch transformer over Markdown files.

### Key Components
- **Audit parser**: Extracts HIGH and MED groups, file paths, missing anchors, and template hints from `/tmp/audit-skdoc-alignment-report.md`.
- **Exclusion filter**: Removes audit paths under protected packets, `011`, `012`, `013`, generated folders, archives, and audit out-of-scope entries.
- **Additive mutators**: Insert frontmatter fields, body markers, or anchor blocks without deleting prose.
- **Verification harness**: Re-checks HIGH/MED signatures and runs strict validators.

### Data Flow
Audit report rows become scoped remediation candidates. Each candidate is filtered, read from disk, patched with additive text, then verified through parser checks and packet validators.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Scope and Packet Setup
- [x] Read packet spec, audit, templates, and skill docs.
- [x] Author `plan.md`, `tasks.md`, and `checklist.md`.
- [ ] Compute excluded paths from spec out-of-scope rules, audit out-of-scope entries, and protected packet prefixes.

### Phase 2: HIGH Remediation Batches
- [ ] Batch A: add `_memory.continuity` blocks to eligible files missing them.
- [ ] Batch C: restore `SPECKIT_TEMPLATE_SOURCE` body markers.
- [ ] Batch B: add missing anchor wrappers or additive stubs.

### Phase 3: MED Remediation
- [ ] Add low-risk `template_source` and `trigger_phrases` frontmatter where template identity is clear.
- [ ] Defer HVR and cross-reference rewrite findings to Tier 5.

### Phase 4: Verification and Closeout
- [ ] Recompute HIGH/MED counts after edits.
- [ ] Validate protected packets and the `013` packet.
- [ ] Write `implementation-summary.md` and update `spec.md` continuity/status.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Parser sanity | Audit candidate counts, exclusions, unresolved HIGH/MED signatures | Node one-off parser |
| YAML sanity | Frontmatter after continuity and metadata edits | Node frontmatter parse checks |
| Spec validation | Packet docs and protected packets | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <packet> --strict` |
| Regression guard | No edits under protected packet prefixes except required `013` docs | `git diff --name-only` and path filter |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `/tmp/audit-skdoc-alignment-report.md` | Local artifact | Green | Without it, candidate extraction becomes speculative. |
| system-spec-kit templates | Local templates | Green | Needed for anchor names and body markers. |
| `validate.sh` | Local script | Green | Required for REQ-005 and REQ-006 evidence. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Validator failure caused by this packet's edits, YAML parse failure, or accidental protected-path mutation.
- **Procedure**: Revert only the specific file hunk introduced by this packet, then rerun the affected parser check and validator.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Scope + docs -> HIGH batches -> MED triage -> verification -> summary
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Scope and Packet Setup | Audit and templates | All remediation |
| HIGH Remediation | Exclusion list | Re-audit |
| MED Remediation | Exclusion list | MED count reduction |
| Verification | Remediation batches | Completion claim |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Scope and Packet Setup | Medium | 20-30 minutes |
| HIGH Remediation | High | 45-70 minutes |
| MED Remediation | Medium | 20-40 minutes |
| Verification and Closeout | Medium | 20-30 minutes |
| **Total** | | **105-170 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No runtime, test, harness, archive, or protected packet file is in the initial write set.
- [ ] Capture changed file list after remediation.
- [ ] Validate protected packets before completion.

### Rollback Procedure
1. Identify the failing path from validator or parser output.
2. Inspect `git diff -- <path>`.
3. Remove only the added continuity, marker, metadata, or anchor stub that caused the failure.
4. Rerun the failed check.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Markdown-only additive edits can be reverted hunk by hunk.
<!-- /ANCHOR:enhanced-rollback -->
