---
title: "Feature Specification: Remove mcp-clickup skill"
description: "Remove the mcp-clickup skill folder and decommission all references to the skill across the repo, while preserving service-level ClickUp/UTCP references that flow through Code Mode."
trigger_phrases:
  - "remove mcp-clickup"
  - "decommission mcp-clickup"
  - "delete mcp-clickup skill"
  - "053 mcp-clickup removal"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/053-cli-skill-removal-mcp-clickup"
    last_updated_at: "2026-04-30T08:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored spec/plan/tasks/checklist for skill removal"
    next_safe_action: "Execute deletions and reference edits"
    blockers: []
    key_files:
      - ".opencode/skill/mcp-clickup/"
      - ".opencode/changelog/mcp-clickup/"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/graph-metadata.json"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/lexical.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts"
      - ".opencode/skill/mcp-code-mode/graph-metadata.json"
      - ".opencode/skill/README.md"
      - ".opencode/install_guides/README.md"
      - ".opencode/install_guides/SET-UP - AGENTS.md"
      - "README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "053-skill-removal"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Remove mcp-clickup skill

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-04-30 |
| **Branch** | `main` (no feature branch — per-user policy) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `mcp-clickup` skill is being decommissioned. Its presence in the skill registry, advisor scoring tables, skill graphs, and READMEs creates routing edges and counts that no longer correspond to any executable skill, which would surface broken recommendations to operators.

### Purpose
Remove the `mcp-clickup` skill folder, its changelog entry, and every repo-wide reference to the skill (advisor data, graphs, READMEs, install guides) so the skill set is internally consistent. ClickUp-as-a-service references that flow through Code Mode (UTCP `clickup` manual, `cu` CLI examples, ClickUp env vars) are preserved — they describe the underlying upstream tool, not the removed orchestrator.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Delete the entire `.opencode/skill/mcp-clickup/` directory (37 files)
- Delete `.opencode/changelog/mcp-clickup/` directory (1 file)
- Strip `mcp-clickup` entries from skill advisor data (`skill_advisor.py`, `lexical.ts`, `explicit.ts`)
- Strip `mcp-clickup` from skill graphs (`skill-graph.json`, `graph-metadata.json` for advisor + mcp-code-mode)
- Update README/install-guide listings, counts, and tree diagrams across 4 docs
- Validate the resulting spec folder with `validate.sh --strict`

### Out of Scope
- ClickUp-as-a-service references in `mcp-code-mode` SKILL.md / README.md / playbooks — these document Code Mode's interaction with the upstream `clickup` UTCP manual and remain functional even without the orchestrator skill.
- AGENTS.md sibling entries that reference `clickup.clickup_get_teams({})` as a UTCP naming example — these are tool-naming illustrations, not skill references.
- Historical `mcp-clickup` mentions inside other spec packets in `.opencode/specs/...` and observability reports — those are frozen artifacts of completed work.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/mcp-clickup/**` | Delete | Whole skill tree (37 files) |
| `.opencode/changelog/mcp-clickup/**` | Delete | Skill changelog (1 file) |
| `README.md` | Modify | Remove single skill listing line (~809) |
| `.opencode/skill/README.md` | Modify | 4 lines (counts, table, tree, runtime matrix) |
| `.opencode/install_guides/README.md` | Modify | 2 lines (install table + 18→17 skill count) |
| `.opencode/install_guides/SET-UP - AGENTS.md` | Modify | 1 line (18→17 skill count) |
| `.opencode/skill/mcp-code-mode/graph-metadata.json` | Modify | Drop one cross-skill link |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py` | Modify | Drop 7 routing entries |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json` | Modify | Decrement count, drop family + adjacency + signals |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/graph-metadata.json` | Modify | Drop one routing edge |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/lexical.ts` | Modify | Drop one phrase entry |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts` | Modify | Drop two routing entries |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Skill folder removed | `ls .opencode/skill/mcp-clickup` returns "No such file or directory" |
| REQ-002 | Changelog folder removed | `ls .opencode/changelog/mcp-clickup` returns "No such file or directory" |
| REQ-003 | Advisor scoring tables coherent | `grep -rn "mcp-clickup" .opencode/skill/system-spec-kit/mcp_server/skill_advisor/` returns zero matches |
| REQ-004 | Skill graph self-consistent | `skill-graph.json` parses as valid JSON; `skill_count` matches the number of populated `families.*` entries; no orphan adjacency targets |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | All listed READMEs/install guides updated | `grep -rn "mcp-clickup"` across the 4 doc files returns zero matches |
| REQ-006 | Service-level ClickUp references preserved | `grep "clickup\." mcp-code-mode/SKILL.md` still returns the UTCP examples |
| REQ-007 | spec validates strict | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh skilled-agent-orchestration/053-cli-skill-removal-mcp-clickup --strict` exits 0 or 1 (warnings tolerated, errors not) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Repo-wide `grep -rn "mcp-clickup"` returns zero hits outside historical spec packets and observability reports.
- **SC-002**: Skill advisor still loads (`python3 .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py "test"` exits cleanly) with mcp-clickup absent from outputs.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Accidentally stripping ClickUp service references and breaking mcp-code-mode docs | Medium | Scope rule: only remove tokens equal to `mcp-clickup`; keep bare `clickup` and `cu` references intact |
| Risk | `skill-graph.json` count/family drift if hand-edited incorrectly | Medium | Re-run `python3 -c "import json; json.load(open(...))"` after edit; verify `skill_count` decrement and family list cleanup |
| Risk | Advisor stale cache surfaces removed skill | Low | Advisor reads from disk per invocation; restart not required |
| Dependency | None — repo-internal cleanup | None | N/A |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: N/A — no runtime perf change from documentation/skill removal.

### Security
- **NFR-S01**: No secrets or credentials touched. Removed skill scripts contained installer commands only; deletion is safe.

### Reliability
- **NFR-R01**: After removal, skill advisor must continue to score and route the remaining 21 skills without raising on missing nodes.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- **Empty skill graph families.mcp**: After removal, `families.mcp` still has 4 members — never empty, no special-case needed.
- **Adjacency orphans**: `mcp-code-mode.prerequisite_for` and `skill-advisor.enhances` both contain `mcp-clickup` — must be pruned in the same edit pass.

### Error Scenarios
- **JSON parse failure post-edit**: re-run `python3 -m json.tool` against `skill-graph.json` and `graph-metadata.json` immediately after each edit.
- **Stray reference missed**: post-edit `grep -rn "mcp-clickup" .opencode/skill .opencode/install_guides .opencode/changelog README.md` to catch leftovers (excluding historical specs).

### State Transitions
- Partial completion (skill folder deleted, advisor data still mentions it): advisor would point to a missing skill. Mitigation — execute advisor edits before validating, and re-grep at the end.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | ~12 file edits + 38 deletions; bounded |
| Risk | 5/25 | Low-risk cleanup; risk of accidental over-deletion of clickup-service refs is the main hazard |
| Research | 4/20 | All references already located; no investigation needed |
| **Total** | **17/70** | **Level 2** (verification needed for cross-doc consistency) |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

(none)
<!-- /ANCHOR:questions -->
