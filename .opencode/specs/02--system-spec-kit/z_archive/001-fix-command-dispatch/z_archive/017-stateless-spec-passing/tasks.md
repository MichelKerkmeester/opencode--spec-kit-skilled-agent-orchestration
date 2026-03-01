---
title: "Tasks: Stateless Alignment [017-stateless-spec-passing/tasks]"
description: "tasks document for 017-stateless-spec-passing."
trigger_phrases:
  - "tasks"
  - "stateless"
  - "alignment"
  - "017"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Stateless Alignment
<!-- SPECKIT_TEMPLATE_SOURCE: tasks | v2.0.0 -->

## Phase 1: Critical Commands
- [ ] Refactor `.opencode/command/spec_kit/resume.md` (7 refs) @critical
- [ ] Clean up `.opencode/command/spec_kit/research.md` (2 refs - creates marker!) @critical
- [ ] Update `.opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml` (7 refs) @high
- [ ] Update `.opencode/command/spec_kit/assets/spec_kit_resume_confirm.yaml` (7 refs) @high

## Phase 2: Script
- [ ] Remove fallback from `.opencode/skills/system-memory/scripts/generate-context.js` (lines 2251-2283) @critical

## Phase 3: Supporting Commands
- [ ] Update `.opencode/command/memory/save.md` (line 111) @medium
- [ ] Update `.opencode/command/prompt/assets/improve_prompt.yaml` (2 refs) @low

## Phase 4: system-spec-kit Docs
- [ ] Update `.opencode/skills/system-spec-kit/SKILL.md` (2 refs) @medium
- [ ] Update `.opencode/skills/system-spec-kit/references/sub_folder_versioning.md` (2 refs) @low
- [ ] Update `.opencode/skills/system-spec-kit/references/template_guide.md` (2 refs) @low

## Phase 5: system-memory Docs (CRITICAL - missed in original)
- [ ] Update `.opencode/skills/system-memory/README.md` (1 ref) @medium
- [ ] Update `.opencode/skills/system-memory/references/execution_methods.md` (1 ref) @medium
- [ ] **FULL REWRITE** `.opencode/skills/system-memory/references/spec_folder_detection.md` (18+ refs) @critical

## Phase 6: Verification
- [ ] Final Audit: `grep -rn ".spec-active" .opencode/` @critical
- [ ] Functional Test: `generate-context.js` errors without path @high
