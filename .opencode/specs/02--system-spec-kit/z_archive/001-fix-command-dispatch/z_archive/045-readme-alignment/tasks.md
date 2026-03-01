---
title: "Tasks: README & Install Guide Alignment [045-readme-alignment/tasks]"
description: "tasks document for 045-readme-alignment."
trigger_phrases:
  - "tasks"
  - "readme"
  - "install"
  - "guide"
  - "alignment"
  - "045"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: README & Install Guide Alignment

## Task Overview

| Phase | File | Tasks | Priority |
|-------|------|-------|----------|
| 1 | system-spec-kit/README.md | 8 | HIGH |
| 2 | mcp_server/README.md | 5 | HIGH |
| 3 | mcp-narsil/README.md | 5 | HIGH |
| 4 | MCP - Code Mode.md | 3 | HIGH |
| 5 | mcp-leann/README.md | 3 | MEDIUM |
| **Total** | **5 files** | **24 tasks** | - |

---

## Phase 1: system-spec-kit/README.md

### T1.1: Fix Overview Template Count
- **Location**: Line ~26
- **Current**: "10 templates"
- **Action**: Verify count is accurate (actual: 10 templates exist)
- **Status**: [ ] Pending

### T1.2: Fix Key Statistics Table
- **Location**: Lines ~63-69
- **Current**: Various counts
- **Action**: Update Templates to 10, Scripts to 10, Commands to accurate count
- **Status**: [ ] Pending

### T1.3: Fix Template Features Claim
- **Location**: Lines ~76-77
- **Current**: "12 structured templates"
- **Action**: Change to "10 structured templates"
- **Status**: [ ] Pending

### T1.4: Update Directory Structure
- **Location**: Lines ~114-122
- **Current**: Lists 8 templates
- **Action**: Add implementation-summary.md and context_template.md to listing
- **Status**: [ ] Pending

### T1.5: Add context_template.md to Template Table
- **Location**: Lines ~375-385
- **Current**: 9 templates listed
- **Action**: Add context_template.md as 10th template
- **Status**: [ ] Pending

### T1.6: Fix Script Section Count
- **Location**: Lines ~559-576
- **Current**: Claims "seven" scripts, lists 7
- **Action**: Update to "ten" scripts, add missing: setup.sh, check-completion.sh, test-validation.sh
- **Status**: [ ] Pending

### T1.7: Fix Command Section Header
- **Location**: Lines ~37, ~1022
- **Current**: "COMMANDS (7 TOTAL)"
- **Action**: Clarify: 7 spec_kit commands documented (memory commands are separate MCP tools)
- **Status**: [ ] Pending

### T1.8: Fix FAQ Template List
- **Location**: Lines ~1733-1743
- **Current**: Lists 9 templates
- **Action**: Add 10th template (context_template.md)
- **Status**: [ ] Pending

---

## Phase 2: mcp_server/README.md

### T2.1: Update Version Number
- **Location**: Line ~3
- **Current**: "Version: Spec Kit Memory MCP v12.x"
- **Action**: Update to "Version: Spec Kit Memory MCP v16.x" (matches system-spec-kit)
- **Status**: [ ] Pending

### T2.2: Fix TOC Module Count
- **Location**: Line ~21
- **Current**: "LIBRARY MODULES (22)"
- **Action**: Change to "LIBRARY MODULES (23)"
- **Status**: [ ] Pending

### T2.3: Verify Section Header
- **Location**: Line ~205
- **Current**: Should say "(23)"
- **Action**: Confirm or fix to "(23)"
- **Status**: [ ] Pending

### T2.4: Add errors.js to Module Table
- **Location**: Lines ~243-252 (Infrastructure Modules)
- **Current**: 6 modules listed
- **Action**: Add `errors.js | Custom error types and error handling utilities`
- **Status**: [ ] Pending

### T2.5: Fix execution_methods.md Reference
- **Location**: Line ~389
- **Current**: References non-existent file
- **Action**: Change to `save-workflow.md` (which exists) or remove row
- **Status**: [ ] Pending

---

## Phase 3: mcp-narsil/README.md

### T3.1: Fix Security Scanning Tool Names
- **Location**: Lines ~207-214
- **Current**: `scan_security`, `find_injection_vulnerabilities`, etc.
- **Action**: Add `narsil.narsil_` prefix to all tool names
- **Status**: [ ] Pending

### T3.2: Fix Call Graph Tool Names
- **Location**: Lines ~219-226
- **Current**: `get_call_graph`, `get_callers`, etc.
- **Action**: Add `narsil.narsil_` prefix to all tool names
- **Status**: [ ] Pending

### T3.3: Fix Type Inference Tool Names
- **Location**: Lines ~253-255
- **Current**: `infer_types`, `check_type_errors`, etc.
- **Action**: Add `narsil.narsil_` prefix to all tool names
- **Status**: [ ] Pending

### T3.4: Fix Supply Chain Tool Names
- **Location**: Lines ~265-276
- **Current**: `generate_sbom`, `check_dependencies`, etc.
- **Action**: Add `narsil.narsil_` prefix to all tool names
- **Status**: [ ] Pending

### T3.5: Fix Common Patterns Table
- **Location**: Lines ~496-506
- **Current**: Missing namespace prefix
- **Action**: Update pattern column to show full `narsil.narsil_*` invocation
- **Status**: [ ] Pending

---

## Phase 4: MCP - Code Mode.md (Install Guide)

### T4.1: Fix Environment Variable Name
- **Location**: Line ~319
- **Current**: `UTCP_CONFIG_PATH`
- **Action**: Change to `UTCP_CONFIG_FILE` (matches README)
- **Status**: [ ] Pending

### T4.2: Fix Naming Convention Documentation
- **Location**: Lines ~679-704
- **Current**: Uses `{manual}.{manual}.{tool}` pattern
- **Action**: Change to `{manual}.{manual_name}_{tool_name}` pattern
- **Status**: [ ] Pending

### T4.3: Fix Tool Call Examples
- **Location**: Lines ~691-694
- **Current**: `webflow.webflow.sites_list({})`
- **Action**: Change to `webflow.webflow_sites_list({})`
- **Status**: [ ] Pending

---

## Phase 5: mcp-leann/README.md

### T5.1: Fix Install Guide Reference (Line 10-11)
- **Location**: Lines ~10-11
- **Current**: `../../install_guides/MCP/MCP%20-%20LEANN.md`
- **Action**: Remove URL encoding: `../../install_guides/MCP/MCP - LEANN.md`
- **Status**: [ ] Pending

### T5.2: Fix Install Guide Reference (Line 106)
- **Location**: Line ~106
- **Current**: URL-encoded path
- **Action**: Remove URL encoding
- **Status**: [ ] Pending

### T5.3: Fix Install Guide Reference (Line 787)
- **Location**: Line ~787
- **Current**: URL-encoded path
- **Action**: Remove URL encoding
- **Status**: [ ] Pending

---

## Progress Tracking

| Phase | Total | Complete | Remaining |
|-------|-------|----------|-----------|
| 1 | 8 | 0 | 8 |
| 2 | 5 | 0 | 5 |
| 3 | 5 | 0 | 5 |
| 4 | 3 | 0 | 3 |
| 5 | 3 | 0 | 3 |
| **Total** | **24** | **0** | **24** |
