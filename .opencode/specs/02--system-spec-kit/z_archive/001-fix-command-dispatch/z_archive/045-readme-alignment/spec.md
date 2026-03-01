---
title: "Spec: README & Install Guide Alignment [045-readme-alignment/spec]"
description: "Fix documentation misalignments, incorrect counts, and inconsistencies discovered by 10 parallel Opus agents auditing README files and install guides across the skill system."
trigger_phrases:
  - "spec"
  - "readme"
  - "install"
  - "guide"
  - "alignment"
  - "045"
importance_tier: "important"
contextType: "decision"
---
# Spec: README & Install Guide Alignment

## 1. Metadata

| Field | Value |
|-------|-------|
| **Spec ID** | 045-readme-alignment |
| **Category** | Documentation |
| **Priority** | P1 |
| **Status** | Complete |
| **Level** | 2 (Verification) |
| **Created** | 2025-12-26 |
| **LOC Estimate** | ~150 lines |

---

## 2. Objective

Fix documentation misalignments, incorrect counts, and inconsistencies discovered by 10 parallel Opus agents auditing README files and install guides across the skill system.

### Problem Statement

The README files contain multiple factual errors that cause user confusion:
- Template counts claim 10 but only 9 are listed
- Script counts claim 11 but only 10 exist
- Library module counts are inconsistent (22 vs 23)
- Version numbers conflict (v12.x vs V16.0)
- Command counts are contradictory (12 vs 7)
- MCP tool naming patterns are incorrect in critical sections

### Success Criteria

1. All count claims match actual file counts
2. All version references are consistent
3. All MCP tool naming follows correct patterns
4. All referenced files exist
5. No contradictions between install guides and READMEs

---

## 3. Scope

### In Scope

| Category | Items |
|----------|-------|
| **Files to Fix** | 5 README/install guide files |
| **HIGH Issues** | 7 critical documentation errors |
| **MEDIUM Issues** | 4 moderate documentation errors |
| **Verification** | All fixes validated against actual files |

### Out of Scope

- Creating missing files (test-fixtures, execution_methods.md)
- Code changes to MCP servers
- LOW severity issues (can be deferred)

---

## 4. Files to Modify

| File | Issues | Priority |
|------|--------|----------|
| `.opencode/skill/system-spec-kit/README.md` | T-001, S-001, C-001 | HIGH |
| `.opencode/skill/system-spec-kit/mcp_server/README.md` | L-001, V-001, P-001 | HIGH |
| `.opencode/skill/mcp-narsil/README.md` | N-005 | HIGH |
| `.opencode/install_guides/MCP/MCP - Code Mode.md` | I-013, I-005 | HIGH |
| `.opencode/skill/mcp-leann/README.md` | X-001 | MEDIUM |

---

## 5. Issue Summary

### HIGH Severity (Must Fix)

| ID | Issue | File |
|----|-------|------|
| T-001 | Template count claims 10, lists 9, missing context_template.md | system-spec-kit/README.md |
| S-001 | Script count claims 11, actual 10, Section 5 lists only 7 | system-spec-kit/README.md |
| C-001 | Command count claims 12, Section 6 says 7 TOTAL | system-spec-kit/README.md |
| L-001 | Library module TOC says 22, should be 23, errors.js undocumented | mcp_server/README.md |
| V-001 | Version mismatch: v12.x vs V16.0 Architecture | mcp_server/README.md |
| N-005 | Feature section uses unprefixed tool names | mcp-narsil/README.md |
| I-013 | Wrong naming pattern: dots instead of underscores | MCP - Code Mode.md |

### MEDIUM Severity (Should Fix)

| ID | Issue | File |
|----|-------|------|
| P-001 | Reference to non-existent execution_methods.md | mcp_server/README.md |
| P-002 | Documents non-existent test-fixtures directory | system-spec-kit/README.md |
| I-005 | UTCP_CONFIG_PATH vs UTCP_CONFIG_FILE inconsistency | MCP - Code Mode.md |
| X-001 | URL-encoded paths (%20) in install guide references | mcp-leann/README.md |

---

## 6. Dependencies

- Read access to all template files for count verification
- Read access to all script files for count verification
- Read access to all library modules for count verification

---

## 7. Risks

| Risk | Mitigation |
|------|------------|
| Breaking existing links | Verify all changed references |
| Introducing new errors | Use checklist verification |
| Missing related files | Cross-reference all changes |
