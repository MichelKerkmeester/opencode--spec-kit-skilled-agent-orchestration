---
title: "Checklist: Stateless Spec Passing & System Alignment [017-stateless-spec-passing/checklist]"
description: "checklist document for 017-stateless-spec-passing."
trigger_phrases:
  - "checklist"
  - "stateless"
  - "spec"
  - "passing"
  - "system"
  - "017"
importance_tier: "normal"
contextType: "implementation"
---
# Checklist: Stateless Spec Passing & System Alignment
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.0.0 -->
<!-- MERGED: 009-stateless-spec-passing + 010-stateless-alignment on 2025-12-22 -->

## Pre-Requisites
- [x] P0: Create spec folder (merged from 009 + 010)
- [x] P0: Read `AGENTS.md` Gate 5 rules
- [x] P0: Deep audit with `grep -rn ".spec-active"` (found 60+ refs, 17 files)
- [x] P0: Verify `create-spec-folder.sh` is clean
- [x] P0: Verify `common.sh` is clean
- [x] P0: Get user confirmation on 3 key decisions

## User Decisions (Confirmed)
- [x] `spec_folder_detection.md`: Rewrite completely (CLI-first)
- [x] `generate-context.js` fallback: REMOVE entirely
- [x] Informational references: KEEP in complete/implement/plan.md

## Phase 1: Critical Commands
- [x] P0: `resume.md` - Remove Phase 1 detection section (CLI-first approach)
- [x] P0: `research.md` - Remove lines 82-85 (was creating .spec-active!)
- [x] P0: `spec_kit_resume_auto.yaml` - Updated session detection to stateless
- [x] P0: `spec_kit_resume_confirm.yaml` - Updated session detection to stateless

## Phase 2: Script
- [x] P0: `generate-context.js` - Fallback was already removed in spec 013

## Phase 3: Supporting Commands
- [x] P1: `save.md` - Updated MCP matrix (line 111)
- [x] P2: `improve_prompt.yaml` - Removed 2 .spec-active references

## Phase 4: system-spec-kit Docs
- [x] P1: `SKILL.md` - Removed .spec-active reference (line 413)
- [x] P2: `sub_folder_versioning.md` - Updated lines 70, 87 to stateless
- [x] P2: `template_guide.md` - Updated lines 672, 683 to stateless

## Phase 5: system-memory Docs (CRITICAL)
- [x] P1: `README.md` - Updated /memory/save section (line 729)
- [x] P1: `execution_methods.md` - Updated detection method (line 137)
- [x] P0: `spec_folder_detection.md` - **FULL REWRITE** completed (CLI-first architecture)

## Phase 6: Verification
- [x] P0: `grep -rn ".spec-active" .opencode/` returns only informational matches
- [x] P0: All active references are now "Stateless - no .spec-active" documentation
- [x] P0: Migration section in spec_folder_detection.md explains cleanup
- [x] P1: AGENTS.md Gate 5 confirms: "NEVER create/write to .spec-active file"

## Remaining References (All Informational - ACCEPTABLE)
| File | Line | Content |
|------|------|---------|
| SKILL.md | 105 | "Stateless - no .spec-active marker" |
| complete.md | 81 | "Stateless - no .spec-active file created" |
| implement.md | 38, 106, 180 | "NEVER infer from .spec-active" |
| plan.md | 81 | "Stateless - no .spec-active file created" |
| resume.md | 45, 326 | "Stateless - no .spec-active marker" |
| research.md | 82 | "Stateless architecture - no .spec-active" |
| YAML files | 31, 38 | "Stateless architecture" notes |
| spec_folder_detection.md | 265-276 | Migration cleanup instructions |

## Post-Implementation
- [x] P1: Save context to memory/ (memory #91 indexed)
- [x] P2: Update spec.md with completion notes
- [x] P1: Merged 009 + 010 spec folders (2025-12-22)
- [x] P1: Updated semantic memory index (#91 → importance: important)
- [x] P0: Deleted stale .spec-active marker files (3 files removed)
