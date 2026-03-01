---
title: "Command Logic Improvement Checklist [004-command-logic-improvement/checklist]"
description: "checklist document for 004-command-logic-improvement."
trigger_phrases:
  - "command"
  - "logic"
  - "improvement"
  - "checklist"
  - "004"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Command Logic Improvement Checklist

<!-- ANCHOR:phase-1 -->
## Research Phase
- [x] P0: Fetch and analyze GitHub Gist commands
- [x] P0: Inventory all existing commands
- [x] P0: Load prior command analysis work
- [x] P0: Research command design best practices

<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Synthesis Phase
- [x] P0: Compare external vs internal patterns
- [x] P0: Identify transferable improvements
- [x] P1: Prioritize recommendations
- [x] P1: Document findings in research.md

<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Implementation Phase
- [x] P0: Add plain-language gates to all commands (16 files updated, ~50+ gates)
- [x] P0: Standardize phase numbering (Phase 0 kept as pre-check, correct design)
- [x] P0: Add confidence checkpoints to 9 YAML files
- [x] P1: Add auto/confirm modes to /create commands (6 commands updated)
- [x] P1: Add "What Next?" sections to completion commands (14 commands)
- [x] P1: Migrate LEANN references to Narsil (already complete, verified)
- [x] P2: Implement command chaining syntax (14 commands with → syntax)
- [x] P2: Add session behavior modes to AGENTS.md Section 8

<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:optional-chaining -->
## Optional Workflow Chaining (Added)
- [x] P1: Make research an optional chained workflow of complete
  - [x] Add `:with-research` flag to complete.md frontmatter
  - [x] Add Phase 2.5: Optional Research Phase with smart-detect (confidence <60%)
  - [x] Add checkpoint prompt after research completes
  - [x] Update spec_kit_complete_auto.yaml with research trigger
  - [x] Update spec_kit_complete_confirm.yaml with research trigger
- [x] P1: Make debug an optional chained workflow of complete
  - [x] Add `:auto-debug` flag to complete.md frontmatter
  - [x] Add Step 10 Debug Integration with failure tracking (3+ failures)
  - [x] Add checkpoint prompt after debug completes
  - [x] Update both YAML files with debug integration

<!-- /ANCHOR:optional-chaining -->

<!-- ANCHOR:verification -->
## Verification
- [x] All P0 items complete
- [x] All P1 items complete
- [x] All P2 items complete
- [x] Optional workflow chaining complete (research + debug)

<!-- /ANCHOR:verification -->
