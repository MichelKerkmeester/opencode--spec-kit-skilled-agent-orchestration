---
title: "Verification Checklist: Phase 001 — Rename legacy workflow-prefixed skill to [001-sk-code--opencode/checklist]"
description: "Verification Date: 2026-02-21"
trigger_phrases:
  - "verification"
  - "checklist"
  - "phase"
  - "001"
  - "rename"
  - "code"
importance_tier: "normal"
contextType: "implementation"
---
# Verification Checklist: Phase 001 — Rename legacy workflow-prefixed skill to `sk-code--opencode`

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
- [x] CHK-003 [P1] Phase 3 dependency marked satisfied and non-blocking for this phase
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:filesystem -->
## Filesystem Rename

- [x] CHK-010 [P0] Legacy workflow-prefixed skill folder renamed to canonical `sk-code--opencode` path (Evidence: `test -d .opencode/skill/sk-code--opencode` = present)
- [x] CHK-011 [P0] No legacy workflow-prefixed folder alias remains under `.opencode/skill/` (Evidence: legacy-alias presence check = missing)
- [x] CHK-012 [P0] All 35 internal files present in new folder (Evidence: `find .opencode/skill/sk-code--opencode -type f | wc -l` = 35)
<!-- /ANCHOR:filesystem -->

---

<!-- ANCHOR:internal-content -->
## Internal Content Updates (35 files)

- [x] CHK-020 [P0] SKILL.md updated — name, title, self-references (Evidence: active-path legacy-token scan returned 0 matches)
- [x] CHK-021 [P0] index.md updated — name, description (Evidence: active-path legacy-token scan returned 0 matches)
- [x] CHK-022 [P0] nodes/*.md updated (~6 files) — cross-refs, self-refs (Evidence: active-path legacy-token scan returned 0 matches)
- [x] CHK-023 [P1] references/*.md updated (~5 files) — hard-coded paths (Evidence: active-path legacy-token scan returned 0 matches)
- [x] CHK-024 [P1] assets/*.md updated (~15 files) — template paths, examples (Evidence: active-path legacy-token scan returned 0 matches)
- [x] CHK-025 [P1] scripts/*.sh updated (~3 files) — hard-coded paths (Evidence: active-path legacy-token scan returned 0 matches)
<!-- /ANCHOR:internal-content -->

---

<!-- ANCHOR:external-refs -->
## External Reference Updates (12 active-path files)

- [x] CHK-030 [P0] skill_advisor.py INTENT_BOOSTERS updated (19 lines) (Evidence: `python3 .opencode/skill/scripts/skill_advisor.py "opencode standards"` routes to `sk-code--opencode`)
- [x] CHK-031 [P0] skill_advisor.py MULTI_SKILL_BOOSTERS updated (Evidence: same smoke output passes threshold for `sk-code--opencode`)
- [x] CHK-032 [P1] .opencode/skill/README.md updated (Evidence: active-path legacy-token scan returned 0 matches)
- [x] CHK-033 [P1] .opencode/skill/sk-code--full-stack/README.md updated (Evidence: active-path legacy-token scan returned 0 matches)
- [x] CHK-034 [P1] .opencode/skill/sk-doc/README.md updated (Evidence: active-path legacy-token scan returned 0 matches)
- [x] CHK-035 [P1] .opencode/skill/sk-git/README.md updated (Evidence: active-path legacy-token scan returned 0 matches)
- [x] CHK-036 [P1] .opencode/skill/system-spec-kit/README.md updated (Evidence: active-path legacy-token scan returned 0 matches)
- [x] CHK-037 [P1] .opencode/skill/system-spec-kit/SKILL.md updated (Evidence: active-path legacy-token scan returned 0 matches)
- [x] CHK-038 [P1] .opencode/skill/system-spec-kit/nodes/rules.md updated (Evidence: active-path legacy-token scan returned 0 matches)
- [x] CHK-039 [P1] .opencode/skill/system-spec-kit/config/config.jsonc updated (Evidence: active-path legacy-token scan returned 0 matches)
- [x] CHK-040 [P1] .opencode/skill/system-spec-kit/mcp_server/tests/skill-ref-config.vitest.ts updated (Evidence: `npm test -- tests/skill-ref-config.vitest.ts` → 1 file passed, 8 tests passed)
- [x] CHK-041 [P1] .opencode/install_guides/README.md updated (Evidence: active-path legacy-token scan returned 0 matches)
- [x] CHK-042 [P1] .opencode/install_guides/SET-UP - AGENTS.md updated (Evidence: active-path legacy-token scan returned 0 matches)
<!-- /ANCHOR:external-refs -->

---

<!-- ANCHOR:cross-refs -->
## Cross-Skill References

- [x] CHK-050 [P1] Active-path skill cross-references to `sk-code--opencode` updated (Evidence: active-path legacy-token scan returned 0 matches, `rg` exit 1)
- [x] CHK-051 [P1] Changelog directory renamed: `07--sk-code--opencode` (Evidence: `test -d .opencode/changelog/07--sk-code--opencode` present and old path missing)
<!-- /ANCHOR:cross-refs -->

---

<!-- ANCHOR:verification -->
## Verification

- [x] CHK-060 [P0] Active-path legacy-token verification returns 0 matches (Evidence: `rg` over active-path target set returned no matches; exit 1)
- [x] CHK-061 [P0] skill_advisor.py returns `sk-code--opencode` for test queries (Evidence: confidence 0.95, passes_threshold true)
- [x] CHK-062 [P0] Folder `.opencode/skill/sk-code--opencode/` exists with complete contents (Evidence: 35 files counted)
- [x] CHK-063 [P1] No broken relative paths from this skill to other skills (Evidence: `.claude/skills/sk-code--opencode` and `.gemini/skills/sk-code--opencode` both repointed to `../../.opencode/skill/sk-code--opencode`)
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-070 [P1] Spec/plan/tasks synchronized for active-path scope (Evidence: tasks/checklist completion aligned to active-path verification commands in plan/spec)
- [x] CHK-071 [P2] Scope preserved (no repo-wide historical cleanup added) (Evidence: verification and claims limited to phase active-path target set)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 19 | 19/19 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-02-21
<!-- /ANCHOR:summary -->
