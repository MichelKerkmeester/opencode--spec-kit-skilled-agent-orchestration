---
title: "Checklist: 085 Alignment File Paths [085-alignment-file-paths/checklist]"
description: "=== TEST SUITE: Alignment File Paths Fix ==="
trigger_phrases:
  - "checklist"
  - "085"
  - "alignment"
  - "file"
  - "paths"
importance_tier: "normal"
contextType: "implementation"
---
# Checklist: 085 Alignment File Paths

## P0 - Must Complete

- [x] `detect_work_domain()` correctly identifies infrastructure work
  - Evidence: Test passes - identifies `skill/system-spec-kit` subpath with confidence 1.0
- [x] `calculate_alignment_score_with_domain()` applies bonus to matching folders
  - Evidence: 003-memory-and-spec-kit scores 40, 005-anobel.com scores 0 with spec-kit work
- [x] Infrastructure mismatch triggers warning in `validate_content_alignment()`
  - Evidence: Shows "INFRASTRUCTURE MISMATCH" warning with suggested patterns
- [x] Infrastructure mismatch triggers warning in `validate_folder_alignment()`
  - Evidence: Shows mismatch warning and lists better alternatives
- [x] `continue.md` step numbering is sequential (no half-steps)
  - Evidence: Step 2.5 renamed to Step 3, subsequent steps renumbered
- [x] Module syntax is valid (node -c passes)
  - Evidence: `node -c alignment-validator.js` exits with code 0
- [x] All new functions are exported
  - Evidence: `detect_work_domain`, `calculate_alignment_score_with_domain` in exports

## P1 - Should Complete

- [x] Test: spec-kit files → 003-memory-and-spec-kit scores higher than 005-anobel.com
  - Evidence: 90% vs 0% in integration test
- [x] Test: project files → no infrastructure bonus applied
  - Evidence: Project domain returns `domain: 'project'`, no bonus
- [x] Test: mixed files (50/50) → threshold works correctly
  - Evidence: 50% triggers infrastructure, 33% stays project
- [x] Test: command files → correct patterns matched
  - Evidence: `command/memory` detected with patterns ['memory', 'spec-kit', 'opencode']
- [x] Test: agent files → correct patterns matched
  - Evidence: `agent/` detected with patterns ['agent', 'opencode']

## P2 - Nice to Have

- [x] Recovery summary displays key files
  - Evidence: Added KEY FILES section to Step 4 display template
- [x] Mismatch warning shows suggested patterns
  - Evidence: Shows "Suggested patterns: memory, spec-kit, speckit, spec, opencode"

## Test Results Summary

```
=== TEST SUITE: Alignment File Paths Fix ===

✅ detect_work_domain identifies spec-kit work
✅ detect_work_domain identifies project work
✅ Infrastructure bonus applied to memory-and-spec-kit
✅ No infrastructure bonus for project work
✅ detect_work_domain identifies command work
✅ detect_work_domain identifies agent work
✅ Mixed files at 50% threshold triggers infrastructure
✅ Mixed files below 50% threshold is project
✅ Empty observations returns project domain
✅ Spec-kit patterns include memory, spec-kit, opencode

Passed: 10/10
Failed: 0
```

## Integration Test Results

```
Test 1: validate_content_alignment with spec-kit work → 005-anobel.com
  📊 Phase 1B Alignment: 005-anobel.com (0% match)
  ⚠️  INFRASTRUCTURE MISMATCH: Work is on .opencode/skill/system-spec-kit
  Better matching folders found:
    1. 003-memory-and-spec-kit (90% match)

Test 2: validate_content_alignment with spec-kit work → 003-memory-and-spec-kit
  📊 Phase 1B Alignment: 003-memory-and-spec-kit (50% match)
  ✓ Content aligns with target folder
```

## Verification Complete

All P0, P1, and P2 items verified. The fix correctly:
1. Detects infrastructure work from file paths
2. Applies bonus to appropriate spec folders
3. Warns when infrastructure work is filed under project folders
4. Suggests better alternatives with domain-aware scoring
