---
title: "Stateless Spec Passing & System Alignment [017-stateless-spec-passing/spec]"
description: "Remove all system reliance on the .spec-active marker file, enforcing a strictly stateless architecture. This aligns with AGENTS.md Gate 5: \"NEVER create/write to .spec-active f..."
trigger_phrases:
  - "stateless"
  - "spec"
  - "passing"
  - "system"
  - "alignment"
  - "017"
importance_tier: "important"
contextType: "decision"
---
# Stateless Spec Passing & System Alignment

> Merged spec combining initial stateless implementation (009) and full system alignment (010).

## 1. Overview

Remove all system reliance on the `.spec-active` marker file, enforcing a strictly stateless architecture. This aligns with `AGENTS.md` Gate 5: "NEVER create/write to .spec-active file (Stateless only)".

## 2. Problem Statement

### Initial Discovery (009)
Multiple concurrent agents overwrite a single `.spec-active` file to signal which spec folder they are working in. This causes "context pollution" where an agent might save memories to another agent's spec folder.

### Deep Audit Findings (010)
Deep audit (`grep -rn ".spec-active"`) revealed **60+ references across 17 files** - far more than initially estimated. The original plan missed the entire `.opencode/skills/system-memory/` directory.

**Critical Issues:**
- `spec_folder_detection.md` has 18+ references and needs FULL REWRITE
- `research.md` actively CREATES `.spec-active` (violates Gate 5)
- `generate-context.js` has fallback code that reads `.spec-active`
- Multiple YAML prompts reference the marker file

## 3. Goals

1. **Eliminate `.spec-active`**: Remove ALL code that reads/writes this file (60+ refs)
2. **Stateless Detection**: CLI-first approach - spec folder passed as argument
3. **Documentation Rewrite**: `spec_folder_detection.md` needs complete rewrite
4. **Full Compliance**: Zero matches for `.spec-active` in active code/prompts

## 4. Scope

### In Scope (13 files across 5 directories)

**Commands:**
- `.opencode/command/spec_kit/resume.md` (7 refs) - Rewrite Phase 1
- `.opencode/command/spec_kit/research.md` (2 refs) - Remove lines 83-85
- `.opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml` (7 refs)
- `.opencode/command/spec_kit/assets/spec_kit_resume_confirm.yaml` (7 refs)
- `.opencode/command/prompt/assets/improve_prompt.yaml` (2 refs)
- `.opencode/command/memory/save.md` (1 ref) - Update MCP matrix

**Scripts:**
- `.opencode/skills/system-memory/scripts/generate-context.js` (lines 2251-2283) - Remove fallback

**system-spec-kit:**
- `.opencode/skills/system-spec-kit/SKILL.md` (2 refs)
- `.opencode/skills/system-spec-kit/references/sub_folder_versioning.md` (2 refs)
- `.opencode/skills/system-spec-kit/references/template_guide.md` (2 refs)

**system-memory (CRITICAL - missed in original plan):**
- `.opencode/skills/system-memory/README.md` (1 ref)
- `.opencode/skills/system-memory/references/execution_methods.md` (1 ref)
- `.opencode/skills/system-memory/references/spec_folder_detection.md` (18+ refs) - **FULL REWRITE**

### Out of Scope
- `create-spec-folder.sh` (verified clean)
- `common.sh` (verified clean)
- Informational lines in `complete.md`, `implement.md`, `plan.md` (document "Stateless - no .spec-active")

## 5. User Decisions (Confirmed)

1. **spec_folder_detection.md**: Rewrite completely around CLI-first detection
2. **generate-context.js fallback**: REMOVE entirely (lines 2251-2283)
3. **Informational references**: KEEP in complete/implement/plan.md

## 6. Success Criteria

- `grep -rn ".spec-active" .opencode/` returns zero matches in active code
- `/spec_kit:resume` works purely via CLI argument
- `generate-context.js` has no fallback reading `.spec-active`
- `spec_folder_detection.md` documents CLI-first approach only
- All commands pass `AGENTS.md` Gate 5 validation

## 7. Merge Note

This spec folder was created by merging:
- `009-stateless-spec-passing` - Initial implementation spec
- `010-stateless-alignment` - Comprehensive system alignment spec

Merged on: 2025-12-22
