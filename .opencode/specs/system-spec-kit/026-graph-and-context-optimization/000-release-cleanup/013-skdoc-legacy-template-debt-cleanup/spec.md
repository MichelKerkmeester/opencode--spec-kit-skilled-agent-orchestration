---
title: "Spec: sk-doc Legacy Template Debt Cleanup (Tier 4)"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Address 93 HIGH + 177 MED findings from sk-doc template alignment audit on older spec folders. Pre-existing legacy debt; not regression-driven. Bulk fix via grouped pattern remediation."
trigger_phrases:
  - "013-skdoc-legacy-template-debt-cleanup"
  - "tier 4 legacy template cleanup"
  - "sk-doc audit remediation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/013-skdoc-legacy-template-debt-cleanup"
    last_updated_at: "2026-04-29T11:05:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Completed eligible Tier 4 sk-doc template alignment cleanup"
    next_safe_action: "Defer remaining prose-heavy MED issues to Tier 5"
    blockers: []
    completion_pct: 100
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Spec: sk-doc Legacy Template Debt Cleanup

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-04-29 |
| **Branch** | `main` |
| **Parent** | `005-review-remediation` |
| **Source** | sk-doc template alignment audit (`/tmp/audit-skdoc-alignment-report.md`) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The sk-doc template alignment audit on the last 40 commits scanned 384 documentation files and surfaced **93 MISALIGN-HIGH + 177 MISALIGN-MEDIUM**. Most findings are pre-existing legacy debt: spec folders authored under earlier sk-doc template versions that never got upgraded to current frontmatter / anchor / template-source-marker requirements.

The 93 HIGH findings cluster into 15 pattern groups in the audit:

- Groups 1, 2, 13-15: missing `_memory.continuity` frontmatter block (~33 files)
- Groups 3-10: missing required anchors per template (`agents`, `commands`, `config`, `meta`, `readmes`, `scripts`, `skills`, `tests`, `when-to-use`, etc.) (~36 files)
- Groups 11-12: missing `SPECKIT_TEMPLATE_SOURCE` body marker (~2 files)

Most affected folders:
- `040-sk-deep-research-review-improvement-1/`
- `041-sk-recursive-agent-loop/`
- `042-sk-deep-research-review-improvement-2/`
- `022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/{...}`

These folders predate the current template surface. They produce strict-validator warnings but don't block production behavior; they hurt long-term maintainability.

### Purpose

Bulk-fix the legacy debt by applying grouped pattern remediations:

1. **_memory.continuity additions**: insert minimal valid block based on current packet state
2. **Missing anchor additions**: insert template-aligned anchor stubs (with placeholder content if no real content exists)
3. **TEMPLATE_SOURCE marker additions**: insert the body marker

Goal: drop the audit's HIGH count from 93 → 0 and MED count from 177 → < 50 (pure legacy noise that can't be cleanly fixed without rewriting older docs).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- All 93 MISALIGN-HIGH files in the audit report (`/tmp/audit-skdoc-alignment-report.md`)
- The actionable subset of 177 MISALIGN-MEDIUM files (likely 80-100 fixable; rest require rewrites and become Tier 5+ deferred)
- Grouped pattern fixes:
  - Group 1+2+13-15: add `_memory.continuity` block to ~33 files
  - Group 3-10: add missing anchors per the relevant template (~36 files)
  - Group 11+12: add `SPECKIT_TEMPLATE_SOURCE` body marker (~2 files)
- Re-run sk-doc audit after batch; iterate if HIGH count > 0
- Strict validator green on this packet

### Out of Scope

- Today's 9 packets (022-028 + 005/009 + 005/010): they're already aligned per their own validators
- Files in scope of `011-stale-doc-and-readme-fixes`: hand off to that packet
- Files in scope of `012-broad-suite-vitest-honesty`: hand off
- Top-level project README, license, contributor docs
- `node_modules/`, `dist/`, `z_archive/`, `z_future/`
- Rewriting legacy spec narrative (substantive content); only template-shape alignment
- ALIGNED files

### Approach: pattern-grouped batches

Don't iterate file-by-file. Group by pattern:

1. **Batch A — _memory.continuity additions**: identify all files missing `_memory.continuity`; for each, infer a minimal block from current state (packet folder name, last modified date, status) and insert before closing frontmatter `---`.
2. **Batch B — anchor additions**: identify which anchors each file is missing (per category — spec, plan, tasks, etc.); for each anchor, insert a stub `ANCHOR:name` block with a section header and brief placeholder. If real content exists elsewhere in the file but isn't anchored, wrap it.
3. **Batch C — TEMPLATE_SOURCE marker**: insert `<!-- SPECKIT_TEMPLATE_SOURCE: <inferred-template> | v2.2 -->` based on file type and location.

After all 3 batches: re-run audit; iterate.

### Files to Change (categories)

| Category | Approx Count | Action |
|---|---|---|
| Files missing `_memory.continuity` | ~35 | Add block (Batch A) |
| Files missing required anchors | ~40 | Add stubs (Batch B) |
| Files missing TEMPLATE_SOURCE marker | ~5 | Add marker (Batch C) |
| Misaligned-medium files | ~80-100 | Address opportunistically; remainder deferred |
| Audit report (read-only reference) | 1 | `/tmp/audit-skdoc-alignment-report.md` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (none)

### P1 — Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All MISALIGN-HIGH `_memory.continuity` findings resolved. | Re-run audit (or equivalent grep): 0 HIGH in Group 1, 2, 13-15. |
| REQ-002 | All MISALIGN-HIGH missing-anchor findings resolved. | Re-run audit: 0 HIGH in Groups 3-10. |
| REQ-003 | All MISALIGN-HIGH missing-TEMPLATE_SOURCE findings resolved. | Re-run audit: 0 HIGH in Groups 11-12. |
| REQ-004 | MED count reduced. | Final MED count < 50 (or rationale documented for higher counts). |
| REQ-005 | Strict validator green on this packet. | `validate.sh <packet> --strict` exits 0. |
| REQ-006 | No regression in any of today's 9 packets. | Re-validate each: 028, 027, 026, 025, 024, 023, 022, 005/009, 005/010. All exit 0. |

### Acceptance Scenarios

1. **Given** the sk-doc audit re-runs after this packet, **when** the report's HIGH section is checked, **then** it has 0 entries (or only entries that were explicitly noted as deferred in implementation-summary).
2. **Given** any of today's 9 packets is re-validated, **when** the strict validator runs, **then** it exits 0 (no regression introduced by Tier 4 cleanup).
3. **Given** an audit finding points into a protected packet, **when** remediation scope is computed, **then** the file is excluded and documented rather than modified.
4. **Given** a MED finding requires substantive narrative rewrite, **when** Batch D triages it, **then** it is deferred to Tier 5 with rationale.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Re-run audit HIGH count = 0 (or fully documented if any deferred).
- **SC-002**: MED count reduced.
- **SC-003**: No regression in today's batch.
- **SC-004**: Strict validator green.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | Bulk anchor additions accidentally damage real content | Insert stubs ABOVE existing content, not in place; never delete |
| Risk | _memory.continuity blocks become stale immediately | Use minimal valid blocks with `last_updated_at` = now and `next_safe_action: "Refresh on next packet edit"` |
| Risk | Some legacy folders are intentionally minimal (e.g., archives) | Skip if path matches `z_archive/` or `z_future/` (already excluded) |
| Risk | Regression in today's batch | REQ-006 enforces re-validation |
| Dependency | sk-doc audit report at `/tmp/audit-skdoc-alignment-report.md` | Already produced today |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Bulk operations should batch file writes to minimize tool-call overhead.

### Reliability
- **NFR-R01**: Every change must preserve the existing markdown content; only ADDITIVE changes (no deletions of substantive prose).
- **NFR-R02**: After each batch (A, B, C), run a sanity grep to confirm no file became invalid.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- A file is in scope but doesn't fit a template cleanly (e.g., a one-off note that got picked up by the audit): mark OUT-OF-SCOPE in implementation-summary; no edit.
- A spec folder is mid-refactor or has parallel changes in another packet: skip with note.
- A YAML frontmatter is malformed (parser failure): skip + flag as separate fix.
- Some MED findings cannot be cleanly addressed without rewriting the file: defer to a future Tier 5 packet.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | 130-200 files; broad cleanup |
| Risk | 12/25 | Mostly additive; regression risk on today's batch managed via REQ-006 |
| Research | 8/20 | Audit report is the playbook |
| **Total** | **38/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Q1: How many MED findings can realistically be closed in this packet vs deferred? **Default**: aim for 60-80%; document the rest as Tier 5 follow-up.
- Q2: Should anchor stubs include real content or just empty placeholders? **Default**: empty placeholders with a `<!-- TODO: fill with real content -->` comment so future authors know to populate.
<!-- /ANCHOR:questions -->
