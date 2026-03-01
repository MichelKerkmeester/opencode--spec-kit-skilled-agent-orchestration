---
title: "Feature Specification: Phase 007 — Finalize mcp-chrome-devtools Rename [007-mcp-chrome-devtools/spec]"
description: "This is Phase 7 of the Skill Rename (038) specification. It is the only phase using the mcp- prefix instead of sk-, because Chrome DevTools is an MCP integration, not a standard..."
trigger_phrases:
  - "feature"
  - "specification"
  - "phase"
  - "007"
  - "finalize"
  - "spec"
  - "mcp"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: Phase 007 — Finalize mcp-chrome-devtools Rename

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + phase-child-header | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Completed |
| **Created** | 2026-02-21 |
| **Completed** | 2026-02-21 |
| **Verified** | 2026-02-21 |
| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 7 of 7 |
| **Predecessor** | 002-sk-code--web |
| **Successor** | 004-sk-doc |
| **Handoff Criteria** | `rg -n "workflows-.*chrome-devtools"` returns 0 matches in active files |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
### Phase Context

This is **Phase 7** of the Skill Rename (038) specification. It is the only phase using the `mcp-` prefix instead of `sk-`, because Chrome DevTools is an MCP integration, not a standard skill.

**Scope Boundary**: All rename and reference updates from the legacy workflows-prefixed chrome-devtools name to `mcp-chrome-devtools`.

**Dependencies**:
- Phases 3, 1, 2 must complete first (execution order)

**Deliverables**:
- Renamed skill folder: `.opencode/skill/mcp-chrome-devtools/`
- All internal references updated (21 files)
- All external references updated (36 files)
- skill_advisor.py entries updated (20 lines)
- Renamed changelog directory: `11--mcp-chrome-devtools`
- Active-target grep verification: 0 matches for old name
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Chrome DevTools skill previously used a workflows-prefixed identifier, which incorrectly categorized it as a standard workflow skill. In reality, it is an MCP integration that provides Chrome DevTools access through MCP protocol.

### Purpose
Complete migration to `mcp-chrome-devtools`, categorizing it correctly as MCP and aligning with `mcp-figma` and `mcp-code-mode`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Filesystem rename verified: `.opencode/skill/mcp-chrome-devtools` exists and legacy workflows-prefixed folder is absent
- Update all 21 internal files
- Update 36 external files
- Update 20 lines in skill_advisor.py
- Changelog rename verified: `11--mcp-chrome-devtools` exists and legacy workflows-prefixed changelog folder is absent

### Out of Scope
- Renaming other skills, functional changes, memory files, changelog content

### Files to Change

| Category | File Path | Change Type | Ref Count |
|----------|-----------|-------------|-----------|
| Folder | `.opencode/skill/mcp-chrome-devtools/` | Verify rename | — |
| Internal | `mcp-chrome-devtools/SKILL.md` | Modify | ~5 |
| Internal | `mcp-chrome-devtools/index.md` | Modify | ~3 |
| Internal | `mcp-chrome-devtools/nodes/*.md` (~5 files) | Modify | ~15 |
| Internal | `mcp-chrome-devtools/references/*.md` (~3 files) | Modify | ~8 |
| Internal | `mcp-chrome-devtools/assets/*.md` (~5 files) | Modify | ~10 |
| Internal | `mcp-chrome-devtools/scripts/*.sh` (~3 files) | Modify | ~6 |
| skill_advisor | `.opencode/skill/scripts/skill_advisor.py` | Modify | 20 lines |
| Agent | `.opencode/agent/orchestrate.md` | Modify | ~5 refs |
| Agent | `.opencode/agent/chatgpt/orchestrate.md` | Modify | ~5 refs |
| Agent | `.claude/agents/orchestrate.md` | Modify | ~5 refs |
| Agent | `.gemini/agents/orchestrate.md` | Modify | ~5 refs |
| Install | `.opencode/install_guides/README.md` | Modify | ~5 refs |
| Install | `.opencode/install_guides/SET-UP - AGENTS.md` | Modify | ~3 refs |
| Install | `.opencode/install_guides/SET-UP - Opencode Agents.md` | Modify | ~3 refs |
| Install | `.opencode/install_guides/SET-UP - Skill Creation.md` | Modify | ~3 refs |
| Root | `CLAUDE.md` | Modify | ~5 refs |
| Root | `README.md` | Modify | ~3 refs |
| Root | `.opencode/README.md` | Modify | ~3 refs |
| spec-kit | `system-spec-kit/SKILL.md` | Modify | ~2 refs |
| spec-kit | `system-spec-kit/nodes/rules.md` | Modify | ~2 refs |
| Changelog | `.opencode/changelog/11--mcp-chrome-devtools/` | Verify rename | — |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Rename skill folder | `ls .opencode/skill/mcp-chrome-devtools/` exists |
| REQ-002 | Update all internal refs | old-name grep = 0 in active targets |
| REQ-003 | Update skill_advisor.py (20 lines) | `python3 skill_advisor.py "take screenshot"` returns `mcp-chrome-devtools` |
| REQ-004 | Update agent files | All 4 runtime orchestrate.md use `mcp-chrome-devtools` |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Update install guides (4 files) | All updated |
| REQ-006 | Update root docs (3 files) | All updated |
| REQ-007 | Update system-spec-kit refs | SKILL.md, rules.md updated |
| REQ-008 | Rename changelog dir | `11--mcp-chrome-devtools` exists |
| REQ-009 | Update cross-refs in other skills | All updated |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg -n "workflows-.*chrome-devtools"` in active files returns 0 - **PASS**
- **SC-002**: `python3 skill_advisor.py "take screenshot"` returns `mcp-chrome-devtools` - **PASS** (confidence `0.95`, uncertainty `0.25`)
- **SC-003**: Folder `.opencode/skill/mcp-chrome-devtools/` exists with all files - **PASS** (21 files)
- **SC-004**: Naming aligns with existing `mcp-figma` and `mcp-code-mode` conventions - **PASS**
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `mcp-` prefix differs from the primary `sk-` rename pattern | M | Intentional MCP categorization |
| Risk | 36 external files are cross-cutting | M | Evidence-backed verification |
| Risk | Phrase routing regressions in advisor matching | M | Verified with direct smoke test for `take screenshot` and `devtools` |
| Dependency | Phases 3, 1, 2 must complete | Execution order | Complete |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Consistency
- **NFR-C01**: `mcp-chrome-devtools` naming aligns with `mcp-figma`, `mcp-code-mode`
- **NFR-C02**: Agent files consistent across 4 runtimes
- **NFR-C03**: Folder name matches skill_advisor.py entries

### Categorization
- **NFR-CT01**: MCP integrations use `mcp-*` prefix to distinguish from standard `sk-*` skills
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Prefix Change
- Unlike other phases (`workflows-` -> `sk-`), this phase uses `workflows-` -> `mcp-`
- Wildcard patterns like `workflows-*` should not include this skill after rename

### MCP Alignment
- The new name `mcp-chrome-devtools` joins existing `mcp-figma` and `mcp-code-mode`
- skill_advisor intent routing validated for `take screenshot` and `devtools`
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | 21 internal + 36 external |
| Risk | 10/25 | MCP prefix shift; phrase-level verification complete |
| Research | 18/20 | Reference coverage verified |
| **Total** | **44/70** | **Level 2 - Medium-High** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None
<!-- /ANCHOR:questions -->
