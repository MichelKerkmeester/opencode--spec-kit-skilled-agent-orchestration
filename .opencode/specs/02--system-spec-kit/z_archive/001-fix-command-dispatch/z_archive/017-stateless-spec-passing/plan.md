---
title: "Stateless Spec Passing & System Alignment Plan [017-stateless-spec-passing/plan]"
description: "Core commands that actively read/write .spec-active - MUST be refactored."
trigger_phrases:
  - "stateless"
  - "spec"
  - "passing"
  - "system"
  - "alignment"
  - "plan"
  - "017"
importance_tier: "important"
contextType: "decision"
---
# Stateless Spec Passing & System Alignment Plan
<!-- SPECKIT_TEMPLATE_SOURCE: plan | v2.0.0 -->
<!-- MERGED: 009-stateless-spec-passing + 010-stateless-alignment on 2025-12-22 -->

## Phase 1: Critical Commands (High Impact)

Core commands that actively read/write `.spec-active` - MUST be refactored.

- [ ] **Refactor `resume.md`** (7 refs):
    - Remove entire "Phase 1: Active Spec Detection" section
    - Replace with CLI-first approach: spec folder passed as argument
    - Remove `cat .spec-active`, `echo ... > .spec-active`
    - Update Output formats

- [ ] **Refactor `research.md`** (2 refs):
    - Remove lines 83-85 (`echo ... > .spec-active`)
    - This file actively CREATES the marker (Gate 5 violation)

- [ ] **Update `spec_kit_resume_auto.yaml`** (7 refs):
    - Remove "Check .spec-active" step
    - Update to CLI-first detection

- [ ] **Update `spec_kit_resume_confirm.yaml`** (7 refs):
    - Remove "Check .spec-active" step
    - Update to CLI-first detection

## Phase 2: Script Cleanup

Remove fallback code from generate-context.js (user confirmed: REMOVE).

- [ ] **Remove `generate-context.js` fallback** (lines 2251-2283):
    - Delete the entire fallback block that reads `.spec-active`
    - Script should ONLY accept explicit path argument
    - Error if no path provided (no silent fallback)

## Phase 3: Supporting Commands

Update commands with minor references.

- [ ] **Update `save.md`** (line 111):
    - Update MCP enforcement matrix reference
    - Already mostly stateless, just cleanup

- [ ] **Update `improve_prompt.yaml`** (2 refs):
    - Remove instructions to check `.spec-active`

## Phase 4: system-spec-kit Documentation

Update skill documentation to reflect stateless workflow.

- [ ] **Update `SKILL.md`** (2 refs):
    - Remove "Check: .spec-active marker" references
    - Document CLI-first approach

- [ ] **Update `references/sub_folder_versioning.md`** (2 refs):
    - Remove ".spec-active marker updated" references

- [ ] **Update `references/template_guide.md`** (2 refs):
    - Remove ".spec-active marker" references

## Phase 5: system-memory Documentation (MAJOR)

**Critical**: This entire directory was missed in the original plan.

- [ ] **Update `README.md`** (1 ref):
    - Remove `.spec-active` reference

- [ ] **Update `references/execution_methods.md`** (1 ref):
    - Update detection method documentation

- [ ] **FULL REWRITE `references/spec_folder_detection.md`** (18+ refs):
    - Complete rewrite around CLI-first detection
    - Remove ALL references to `.spec-active` marker file
    - Document: "Spec folder MUST be passed as CLI argument"
    - Remove fallback detection methods
    - Simplify to single source of truth

## Phase 6: Verification

- [ ] **Grep Audit**: Run `grep -rn ".spec-active" .opencode/` 
    - Expected: Zero matches in active code
    - Exception: Informational lines in complete/implement/plan.md (document "Stateless - no .spec-active")

- [ ] **Functional Test**: Verify `generate-context.js` errors without path argument

- [ ] **Review**: Confirm Gate 5 compliance across all commands
