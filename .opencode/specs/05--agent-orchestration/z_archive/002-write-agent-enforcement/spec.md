---
title: "Spec: @write Agent Enforcement for /create Commands [002-write-agent-enforcement/spec]"
description: "Enforce @write agent requirement for all /create commands to ensure template-first workflow, DQI scoring, and quality gates are consistently applied."
trigger_phrases:
  - "spec"
  - "write"
  - "agent"
  - "enforcement"
  - "for"
  - "002"
importance_tier: "important"
contextType: "decision"
---
# Spec: @write Agent Enforcement for /create Commands

<!-- ANCHOR:overview -->
## Overview

Enforce `@write` agent requirement for all `/create` commands to ensure template-first workflow, DQI scoring, and quality gates are consistently applied.

<!-- /ANCHOR:overview -->


<!-- ANCHOR:problem-statement -->
## Problem Statement

The 5 `/create` commands in `.opencode/command/create/` lack enforcement of the `@write` agent requirement. This means:
- Commands can be executed without proper template loading
- DQI scoring may not be applied
- Quality gates from sk-doc skill may be bypassed

<!-- /ANCHOR:problem-statement -->


<!-- ANCHOR:scope -->
## Scope

### In Scope
- Add PHASE 0: WRITE AGENT VERIFICATION to all 5 commands
- Update Phase Status Verification tables
- Update Violation Self-Detection sections
- Fix emoji inconsistencies per command_template.md Section 6
- Sync changes to public repo

### Out of Scope
- Changes to YAML workflow files
- Changes to command_template.md internal inconsistencies
- New command creation

<!-- /ANCHOR:scope -->


<!-- ANCHOR:files-affected -->
## Files Affected

**anobel.com repo (5 files):**
```
.opencode/command/create/
├── skill.md           (non-chained)
├── skill_reference.md (chained variant)
├── skill_asset.md     (chained variant)
├── install_guide.md   (non-chained)
└── folder_readme.md   (non-chained)
```

**Public repo (same 5 files):**
```
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/command/create/
```

<!-- /ANCHOR:files-affected -->


<!-- ANCHOR:success-criteria -->
## Success Criteria

1. All 5 commands have PHASE 0 with @write verification
2. Phase tables include PHASE 0 row
3. Violation sections include @write check
4. Emoji usage aligns with command_template.md Section 6
5. Changes synced to public repo
6. Commands function correctly with @write agent

<!-- /ANCHOR:success-criteria -->
