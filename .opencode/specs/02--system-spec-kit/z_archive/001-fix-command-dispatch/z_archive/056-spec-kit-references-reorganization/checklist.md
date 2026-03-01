---
title: "Verification Checklist: system-spec-kit References Reorganization [056-spec-kit-references-reorganization/checklist]"
description: "grep -E '\\\\\\\\./references/[^/]+\\\\\\\\.md' .opencode/skill/system-spec-kit/SKILL.md"
trigger_phrases:
  - "verification"
  - "checklist"
  - "system"
  - "spec"
  - "kit"
  - "056"
importance_tier: "normal"
contextType: "implementation"
---
# Verification Checklist: system-spec-kit References Reorganization

## P0 - Critical (Must Complete)

- [x] All file references in SKILL.md are valid and resolve correctly
  - Evidence: `grep -E "references/[a-z_]+\.md"` returns 0 old-style paths
- [x] No broken links after reorganization (verified via grep + read tests)
  - Evidence: All 18 files exist in new sub-folder locations
- [x] All original reference files accounted for (no files lost)
  - Evidence: `ls -la references/*/` shows 18 .md files across 7 sub-folders
- [x] Internal links within reference files are valid
  - Evidence: Fixed 69 broken links across 17 reference files (see implementation-summary.md)

## P1 - Required

- [x] References organized into logical sub-folders
  - Evidence: 7 sub-folders created (memory, templates, validation, structure, workflows, debugging, config)
- [x] SKILL.md routing section updated with new paths
  - Evidence: "Reference Sub-folders" and "Keyword-Based Routing" tables added
- [x] Sub-folder naming follows consistent conventions
  - Evidence: All use lowercase with underscores, match domain purpose
- [x] File mappings documented (old path → new path)
  - Evidence: See implementation-summary.md for complete mapping table
- [x] SKILL.md Sub-folders table lists all files per folder
  - Evidence: Table updated to show complete file inventory per sub-folder
- [x] Keyword routing table includes all relevant terms
  - Evidence: Added missing keywords: embeddings, vector, semantic, decay, anchor, snapshot, scripts

## P2 - Recommended

- [x] Documentation updated to reflect new structure
  - Evidence: SKILL.md References table restructured with sub-folder column
- [x] Pattern consistency with workflows-code skill verified
  - Evidence: Same sub-folder organization pattern applied
- [x] Script permissions fixed
  - Evidence: `chmod +x check-completion.sh` executed
- [x] Template priority consistency fixed
  - Evidence: P3 → P2 in 3 template files (spec.md, tasks.md, plan.md)
- [ ] README or index file in references/ explaining structure (if beneficial)
  - Note: Not needed - SKILL.md routing tables serve this purpose

## Verification Phase (Phase 2)

- [x] P0: 4-agent deep verification audit completed
  - Evidence: Parallel Opus agents with specialized focus areas + sequential thinking orchestration
- [x] P0: 10 additional broken links fixed (quick_reference.md, troubleshooting.md)
  - Evidence: Root cause was `../` instead of `../../` for paths to templates/ and README.md
- [x] P1: folder_structure.md updated - implementation-summary.md now required for all levels
  - Evidence: Added to Level 1/2/3 with note about post-implementation creation
- [x] P1: constitutional/gate-enforcement.md fixed - memory_search example now has required query param
  - Evidence: Added `query: "session context"` parameter to example
- [x] P2: README.md fixed - removed P3 from priority list
  - Evidence: Changed P0/P1/P2/P3 to P0/P1/P2
- [x] P2: template_mapping.md fixed - Level 1 now includes implementation-summary.md
  - Evidence: Updated Required Files column for Level 1
- [x] P2: setup.sh shebang fixed for portability
  - Evidence: Changed `#!/bin/bash` to `#!/usr/bin/env bash`

## Verification Commands

```bash
# Check for broken paths in SKILL.md
grep -E '\./references/[^/]+\.md' .opencode/skill/system-spec-kit/SKILL.md

# List new structure
find .opencode/skill/system-spec-kit/references -type f -name "*.md"

# Verify no old flat-structure references remain
grep -r 'references/[a-z_]*\.md' .opencode/skill/system-spec-kit/

# Check internal links in reference files
grep -r '\[.*\](\./' .opencode/skill/system-spec-kit/references/
```

## Sign-off

| Item | Status | Evidence | Date |
|------|--------|----------|------|
| P0 Complete | [x] | All 4 items verified (including 69 link fixes) | 2026-01-01 |
| P1 Complete | [x] | All 6 items verified | 2026-01-01 |
| P2 Complete | [x] | 4 of 5 items (README deferred as unnecessary) | 2026-01-01 |
| Phase 1 Review | [x] | All verifications passed | 2026-01-01 |
| Phase 2 Verification | [x] | 4-agent audit complete, 10 additional fixes | 2026-01-01 |
| Final Review | [x] | All phases complete | 2026-01-01 |
