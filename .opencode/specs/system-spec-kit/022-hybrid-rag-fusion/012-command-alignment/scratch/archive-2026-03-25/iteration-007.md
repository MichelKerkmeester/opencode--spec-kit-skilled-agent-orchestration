# Review Findings: Wave 4, Agent A4

## Metadata
- Dimension: traceability
- Files Reviewed: 8 target docs + canonical schema sources + 012 spec
- Model: gpt-5.3-codex
- Effort: xhigh
- Wave: 4 of 5

## Findings

### [F-039] [P1] Broken skill path in deep-review YAML assets
- **File**: spec_kit_deep-research_review_auto.yaml:359, review_confirm.yaml:410
- **Evidence**: References .opencode/skill/sk-code-review/references/review_core.md; actual path is .agents/skills/sk-code-review/references/review_core.md
- **Impact**: Review doctrine load path orphaned; traceability to review baseline broken.

### [F-040] [P1] Deep-research YAML hardcodes Claude agent paths, violating runtime path routing
- **File**: spec_kit_deep-research_auto.yaml:68, confirm.yaml:68, review_auto.yaml:70, review_confirm.yaml:70
- **Evidence**: YAMLs reference .claude/agents/ exclusively. AGENTS.md defines runtime-specific directories.
- **Impact**: Cross-runtime traceability drift; YAML points to one runtime-specific location only.

### [F-041] [P2] spec_kit/README.txt assets inventory omits review YAML files
- **File**: spec_kit/README.txt:102-105
- **Evidence**: Lists only spec_kit_deep-research_auto/confirm.yaml. Review variants exist but unlisted.
- **Impact**: Command-to-asset trace matrix incomplete.

### [F-042] [P2] spec_kit/README.txt command overview omits deep-review mode suffixes
- **File**: spec_kit/README.txt:54
- **Evidence**: Shows only :auto/:confirm. deep-research.md documents :review, :review:auto, :review:confirm.
- **Impact**: README command contract out of sync with implementation.

### [F-043] [P2] /memory:manage health sample schema version is stale
- **File**: manage.md:572,576
- **Evidence**: Shows Schema v13; actual SCHEMA_VERSION = 23 in vector-index-schema.ts:143.
- **Impact**: Runtime traceability drift in diagnostics guidance.

### [F-044] [P2] /memory:save examples conflict with its own filePath contract
- **File**: save.md:565, save.md:543,546
- **Evidence**: filePath documented as absolute path; examples use relative paths.
- **Impact**: Parameter-contract traceability mismatch.

## Validated as Correct
- analyze.md tool names match canonical 33-tool schema
- README.txt 33-tool coverage matrix aligns with 012 decisions
- save.md generate-context.js references resolve correctly
- No orphan references to context.md or removed commands

## Summary
- Total findings: 6 (P0=0, P1=2, P2=4)
- newFindingsRatio: 0.14
