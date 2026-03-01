---
title: "Verification Checklist: Phase 007 — Finalize mcp-chrome-devtools Rename [007-mcp-chrome-devtools/checklist]"
description: "Verification Date: 2026-02-21"
trigger_phrases:
  - "verification"
  - "checklist"
  - "phase"
  - "007"
  - "finalize"
  - "mcp"
importance_tier: "normal"
contextType: "implementation"
---
# Verification Checklist: Phase 007 — Finalize mcp-chrome-devtools Rename

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies: Phases 3, 1, 2 must complete first
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:filesystem -->
## Filesystem Rename

- [x] CHK-010 [P0] Legacy workflows-prefixed chrome-devtools name migrated to `mcp-chrome-devtools` — Evidence: `new_skill_dir=present`
- [x] CHK-011 [P0] No old folder remains — Evidence: `old_skill_dir=missing`
- [x] CHK-012 [P0] All 21 internal files present — Evidence: `find .opencode/skill/mcp-chrome-devtools -type f | wc -l` => `21`
<!-- /ANCHOR:filesystem -->

---

<!-- ANCHOR:internal-content -->
## Internal Content Updates (21 files)

- [x] CHK-020 [P0] SKILL.md updated (including MCP designation) — Evidence: active-target old-name grep returned 0 matches (`EXIT:1`)
- [x] CHK-021 [P0] index.md updated — Evidence: active-target old-name grep returned 0 matches (`EXIT:1`)
- [x] CHK-022 [P0] nodes/*.md (~5 files) updated — Evidence: active-target old-name grep returned 0 matches (`EXIT:1`)
- [x] CHK-023 [P1] references/*.md (~3 files) updated — Evidence: active-target old-name grep returned 0 matches (`EXIT:1`)
- [x] CHK-024 [P1] assets/*.md (~5 files) updated — Evidence: active-target old-name grep returned 0 matches (`EXIT:1`)
- [x] CHK-025 [P1] scripts/*.sh (~3 files) updated — Evidence: active-target old-name grep returned 0 matches (`EXIT:1`)
<!-- /ANCHOR:internal-content -->

---

<!-- ANCHOR:external-refs -->
## External Reference Updates (36 files)

- [x] CHK-030 [P0] skill_advisor.py updated (20 lines) — Evidence: `rg -n "mcp-chrome-devtools" .opencode/skill/scripts/skill_advisor.py` => `20`
- [x] CHK-031 [P0] orchestrate.md updated (4 runtimes) — Evidence: active-target old-name grep returned 0 matches (`EXIT:1`)
- [x] CHK-032 [P1] Install guides updated (4 files) — Evidence: active-target old-name grep returned 0 matches (`EXIT:1`)
- [x] CHK-033 [P1] Root docs updated (3 files) — Evidence: active-target old-name grep returned 0 matches (`EXIT:1`)
- [x] CHK-034 [P1] system-spec-kit refs updated (2 files) — Evidence: active-target old-name grep returned 0 matches (`EXIT:1`)
<!-- /ANCHOR:external-refs -->

---

<!-- ANCHOR:mcp-alignment -->
## MCP Categorization

- [x] CHK-040 [P0] Folder name uses `mcp-` prefix (not `sk-`) — Evidence: `.opencode/skill/mcp-chrome-devtools/` exists
- [x] CHK-041 [P1] Naming aligns with existing `mcp-figma`, `mcp-code-mode` — Evidence: `ls -d .opencode/skill/mcp-* | sort`
- [x] CHK-042 [P1] skill_advisor.py categorizes as MCP integration — Evidence: `"devtools"` resolves to `mcp-chrome-devtools`
<!-- /ANCHOR:mcp-alignment -->

---

<!-- ANCHOR:cross-refs -->
## Cross-Skill References

- [x] CHK-050 [P1] Cross-refs in other skills updated — Evidence: active-target old-name grep returned 0 matches (`EXIT:1`)
- [x] CHK-051 [P1] Changelog dir renamed: `11--mcp-chrome-devtools` — Evidence: `new_changelog_dir=present`, `old_changelog_dir=missing`
<!-- /ANCHOR:cross-refs -->

---

<!-- ANCHOR:verification -->
## Verification

- [x] CHK-060 [P0] grep: 0 matches for `workflows-.*chrome-devtools` — Evidence: active-target `rg` returned `EXIT:1`
- [x] CHK-061 [P0] skill_advisor.py: `take screenshot` → `mcp-chrome-devtools` — Evidence: confidence `0.95`, uncertainty `0.25`
- [x] CHK-062 [P0] skill_advisor.py: `devtools` → `mcp-chrome-devtools` — Evidence: confidence `0.95`
- [x] CHK-063 [P0] Folder exists with all contents — Evidence: skill folder exists with 21 files
- [x] CHK-064 [P1] `ls .opencode/skill/mcp-*` shows 3 MCP skills — Evidence: includes `mcp-chrome-devtools`, `mcp-code-mode`, `mcp-figma`
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-070 [P1] Spec/plan/tasks synchronized — Evidence: phase docs updated to current completion state
- [x] CHK-071 [P2] Memory saved — Evidence: phase 007 included in `generate-context.js` indexed batch `#87-#93`
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 15/15 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-02-21
<!-- /ANCHOR:summary -->
