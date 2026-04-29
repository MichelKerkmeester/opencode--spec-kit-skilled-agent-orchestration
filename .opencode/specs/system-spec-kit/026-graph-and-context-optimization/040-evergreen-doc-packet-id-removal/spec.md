---
title: "Feature Specification: Evergreen Doc Packet ID Removal"
description: "Add a sk-doc rule that prevents evergreen docs from citing mutable packet IDs. Audit recently touched evergreen docs and replace packet-history references with current runtime anchors where practical."
trigger_phrases:
  - "040-evergreen-doc-packet-id-removal"
  - "evergreen doc rule"
  - "no packet ids in readmes"
  - "sk-doc evergreen rule"
  - "packet id audit"
importance_tier: "important"
contextType: "general"
template_source_marker: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/040-evergreen-doc-packet-id-removal"
    last_updated_at: "2026-04-29T20:35:30+02:00"
    last_updated_by: "cli-codex"
    recent_action: "Resource map indexed"
    next_safe_action: "Use packet for downstream work"
    blockers: []
    key_files:
      - ".opencode/skill/sk-doc/references/global/evergreen packet ID rule"
      - "specs/system-spec-kit/026-graph-and-context-optimization/040-evergreen-doc-packet-id-removal/audit findings"
    session_dedup:
      fingerprint: "sha256:040evergreendocpacketidremoval0000000000000000000000000000"
      session_id: "040-evergreen-doc-packet-id-removal"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Evergreen Doc Packet ID Removal

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
| **Created** | 2026-04-29 |
| **Branch** | `040-evergreen-doc-packet-id-removal` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Evergreen docs were carrying mutable packet and phase references. Those references rot when packet folders are renumbered, archived, or consolidated, even though the runtime behavior they describe remains current.

### Purpose
Teach `sk-doc` to keep runtime docs packet-history free, then audit and fix recently touched evergreen docs that violate the rule.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a reusable sk-doc evergreen packet-ID rule.
- Update README, install guide, feature catalog, and manual testing playbook templates.
- Audit recently touched evergreen docs.
- Rewrite high-confidence packet-history references to current behavior and source anchors.
- Record fixed, passed, and deferred audit findings.

### Out of Scope
- Code changes.
- Rewriting packet-local spec docs outside this packet.
- Full cleanup of every legacy catalog/playbook generated identifier in the repo.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/sk-doc/sk-doc skill` | Modify | Route doc quality work to the evergreen rule |
| `.opencode/skill/sk-doc/references/global/evergreen packet ID rule` | Create | Rule defining spec-local vs evergreen docs |
| `.opencode/skill/sk-doc/assets/documentation/**/* markdown` | Modify | Add template reminders |
| `.opencode/skill/system-spec-kit/**/* markdown` | Modify | Surgical evergreen wording fixes |
| `.opencode/skill/cli-opencode/**/* markdown` | Modify | Replace example packet IDs with approved spec-folder wording |
| `specs/system-spec-kit/026-graph-and-context-optimization/040-evergreen-doc-packet-id-removal/*` | Create | Packet docs and audit findings |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Add sk-doc evergreen rule | Rule covers doc classes, examples, grep self-check, and migration guidance |
| REQ-002 | Update sk-doc templates | README, install guide, feature catalog, and manual playbook templates mention the rule |
| REQ-003 | Create packet docs | Level 2 docs plus `audit findings` exist under the packet folder |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Audit recent evergreen docs | `audit findings` lists PASS, VIOLATION_FIXED, and VIOLATION_DEFERRED outcomes |
| REQ-005 | Run verification | Strict validator passes and grep self-check output is captured with documented exceptions |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Future sk-doc authored evergreen docs have an explicit no-packet-ID rule.
- **SC-002**: Recently touched, high-confidence packet-history references are removed or rewritten.
- **SC-003**: Remaining grep hits are documented as stable IDs or deferred legacy cleanup.

### Acceptance Scenarios

1. **Given** a README author uses sk-doc, **When** they start from the template, **Then** the author instructions forbid mutable packet IDs in evergreen prose.
2. **Given** a feature catalog author finds packet-history wording, **When** they revise the entry, **Then** they replace it with current behavior and source-file anchors.
3. **Given** a manual playbook keeps stable scenario IDs, **When** the audit scans that file, **Then** provenance prose is removed while the current artifact ID remains documented.
4. **Given** the broad grep finds numeric identifiers, **When** an identifier is a stable file or scenario ID, **Then** the audit records it as a documented exception instead of rewriting unrelated content.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 037/004, 038, 039 outputs | Audit needs their docs present | Declared in `graph-metadata.json` |
| Risk | Broad grep matches stable IDs | False positives can dwarf real violations | Audit records exceptions separately |
| Risk | Large generated catalogs | Full cleanup can become broad rewrite | Surgical fixes plus deferred audit notes |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Audit commands run with grep/rg only.

### Security
- **NFR-S01**: No code or runtime behavior changes.

### Reliability
- **NFR-R01**: Strict spec validation exits 0 before completion.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Stable feature IDs such as `001-feature-name`: keep when they identify current files.
- Spec-local packet docs: excluded from evergreen cleanup.
- Public examples using "packet 047": rewrite to approved spec-folder examples.

### Error Scenarios
- Broad grep remains non-empty: document false positives and deferred legacy cleanup in `audit findings`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | Multiple doc families, doc-only |
| Risk | 7/25 | No runtime changes |
| Research | 10/20 | Requires audit of recent docs |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
