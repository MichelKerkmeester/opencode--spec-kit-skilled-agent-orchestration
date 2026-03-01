---
title: "Task 01 — README Audit & Alignment [task-01-readme-alignment/spec]"
description: "Audit every README.md file in the .opencode/ directory tree to ensure all statistics, feature descriptions, version numbers, and cross-references reflect the post-implementation..."
trigger_phrases:
  - "task"
  - "readme"
  - "audit"
  - "alignment"
  - "spec"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 3+ -->
# Task 01 — README Audit & Alignment

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Parent Spec** | 130 — Memory Overhaul & Agent Upgrade Release |
| **Task** | 01 of 07 |
| **Level** | 3+ |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-02-16 |
| **Depends On** | None (parallel with Tasks 02–04) |
| **Blocks** | Task 05 (Changelog Updates) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:purpose -->
## Purpose

Audit every README.md file in the `.opencode/` directory tree to ensure all statistics, feature descriptions, version numbers, and cross-references reflect the post-implementation state of specs 014–016 and 122–129. Produce a changes.md file documenting every required edit.
<!-- /ANCHOR:purpose -->

---

<!-- ANCHOR:scope -->
## Scope

### High-Priority README Files (P0)

| File | Key Audit Points |
|------|-----------------|
| `.opencode/README.md` | Statistics table: agent count, skill count, command count, template count, test count |
| `.opencode/skill/system-spec-kit/README.md` | 5-source pipeline (not 4), 7 intents (not 5), schema v13, document-type scoring, `includeSpecDocs` parameter, check-placeholders.sh, upgrade-level.sh, auto-populate workflow, spec 126 MCP server hardening (import paths, specFolder filtering, metadata preservation) |
| `.opencode/skill/system-spec-kit/mcp_server/README.md` | Same as above + `includeSpecDocs` parameter documentation, feature flags, schema v13 structure, MCP server hardening details |

### Medium-Priority README Files (P1)

| File | Key Audit Points |
|------|-----------------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/README.md` | 7 intents reference, search module updates |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md` | 7 intents, find_spec + find_decision |
| `.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md` | Document-type scoring multipliers |
| `.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md` | Causal chains, spec document edges |
| `.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md` | Document types, schema v13 |
| `.opencode/skill/system-spec-kit/mcp_server/tests/README.md` | Test count, spec126 tests |
| `.opencode/skill/system-spec-kit/scripts/README.md` | Script listing (upgrade-level.sh, check-placeholders.sh, check-anchors.sh) |
| `.opencode/skill/system-spec-kit/scripts/spec/README.md` | upgrade-level.sh, check-placeholders.sh, validate.sh |
| `.opencode/skill/system-spec-kit/scripts/core/README.md` | subfolder-utils.ts, memory-indexer.ts |
| `.opencode/skill/system-spec-kit/scripts/tests/README.md` | test-upgrade-level.sh, test-subfolder-resolution.js |
| `.opencode/skill/system-spec-kit/scripts/memory/README.md` | generate-context.ts subfolder handling |
| `.opencode/skill/system-spec-kit/shared/README.md` | normalization.ts updates |
| `.opencode/skill/system-spec-kit/templates/README.md` | Template count, anchor tag conventions |
| `.opencode/skill/README.md` | Global skills library — 9 skills, cross-references current |
| `.opencode/install_guides/README.md` | Node modules relocation (spec 120) |

### Low-Priority README Files (P2) — HVR + Anchor Compliance

All 60+ system-spec-kit sub-READMEs:
- Verify `<!-- ANCHOR:name -->` / `<!-- /ANCHOR:name -->` pairs present (spec 013/129)
- Verify no HVR violations (spec 122)
- Verify YAML frontmatter present

Workflow skill READMEs (6 files):
- `.opencode/skill/sk-doc/README.md`
- `.opencode/skill/sk-code--opencode/README.md`
- `.opencode/skill/workflows-code--web-dev/README.md`
- `.opencode/skill/sk-code--full-stack/README.md`
- `.opencode/skill/sk-git/README.md`
- `.opencode/skill/mcp-chrome-devtools/README.md`

MCP skill READMEs (2 files):
- `.opencode/skill/mcp-code-mode/README.md`
- `.opencode/skill/mcp-figma/README.md`
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:audit-criteria -->
## Audit Criteria

### What to Look For

1. **Stale source counts**: "4 sources" should be "5 sources" (spec 126 added spec folder documents)
2. **Stale intent counts**: "5 intents" should be "7 intents" (spec 126 added find_spec + find_decision)
3. **Outdated schema versions**: Should reference schema v13 (spec 126)
4. **Missing feature references**:
   - upgrade-level.sh (spec 124)
   - check-placeholders.sh (spec 128)
   - check-anchors.sh (spec 129, if implemented)
   - AI auto-populate workflow (spec 128)
   - Document-type scoring (spec 126)
   - `includeSpecDocs` parameter (spec 126)
5. **Missing spec 126 hardening details**:
   - MCP server import path regression fixes (context-server.ts, attention-decay.ts)
   - memory-index specFolder boundary filtering + incremental chain coverage
   - memory-save document_type/spec_level preservation in update/reinforce paths
   - vector-index metadata update plumbing
   - causal edge conflict-update semantics for stable edge IDs
6. **Missing anchor tags**: Every H2 section should have `<!-- ANCHOR:name -->` / `<!-- /ANCHOR:name -->` pairs (specs 013/129)
7. **HVR violations**: No three-item inline lists, no superlatives, no marketing language (spec 122)
8. **Stale file/test counts**: Counts should reflect current state after all implementations
<!-- /ANCHOR:audit-criteria -->

---

<!-- ANCHOR:output -->
## Expected Output

The implementer should populate `changes.md` with:
- One section per file requiring changes
- Each section listing the specific line(s) or content to update
- Before/after text for each change
- Priority (P0/P1/P2) for each change
<!-- /ANCHOR:output -->

---

<!-- ANCHOR:acceptance -->
## Acceptance Criteria

1. Every README.md file in `.opencode/` has been audited
2. All stale "4 sources" references updated to "5 sources" in changes.md
3. All stale "5 intents" references updated to "7 intents" in changes.md
4. All missing feature references documented in changes.md
5. All anchor tag gaps documented in changes.md
6. changes.md has no placeholder text
<!-- /ANCHOR:acceptance -->

---

<!-- ANCHOR:approval-workflow -->
## Approval Workflow

| Checkpoint | Approver | Status | Date |
|------------|----------|--------|------|
| Audit Scope Review | User | Pending | |
| changes.md Review | User | Pending | |
| Implementation Approval | User | Pending | |
<!-- /ANCHOR:approval-workflow -->

---

<!-- ANCHOR:compliance -->
## Compliance Checkpoints

### Documentation Compliance
- [ ] All README audit findings documented in changes.md
- [ ] Before/after text provided for each change
- [ ] Priority (P0/P1/P2) assigned to each change
- [ ] No placeholder text remains

### Process Compliance
- [ ] Audit systematic (all 60+ files checked)
- [ ] Priority tiers followed (P0 first, then P1, then P2)
- [ ] Self-contained (no external dependencies)
<!-- /ANCHOR:compliance -->

---

<!-- ANCHOR:stakeholders -->
## Stakeholder Matrix

| Stakeholder | Role | Interest | Communication |
|-------------|------|----------|---------------|
| Michel | Maintainer | High | Review changes.md before implementation |
| Agent System | Executor | High | Self-contained spec for audit execution |
<!-- /ANCHOR:stakeholders -->

---

## Related Documents

- **Parent**: [../spec.md](../spec.md)
- **Plan**: [plan.md](plan.md)
- **Tasks**: [tasks.md](tasks.md)
- **Checklist**: [checklist.md](checklist.md)
- **Decisions**: [decision-record.md](decision-record.md)
- **Changes**: [changes.md](changes.md)

---

<!--
Level 3+ specification for Task 01
README audit across 60+ files with 3-tier priority system
Produces changes.md with explicit before/after text for implementer
-->
