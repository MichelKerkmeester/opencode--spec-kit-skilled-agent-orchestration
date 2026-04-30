---
title: "Tasks: Remove mcp-clickup skill"
description: "Task tracking for the skill removal sweep — deletions, advisor edits, doc edits, verification."
trigger_phrases: ["tasks mcp-clickup removal", "053 tasks"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/053-cli-skill-removal-mcp-clickup"
    last_updated_at: "2026-04-30T08:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored task list"
    next_safe_action: "Execute T002 onward"
    blockers: []
    completion_pct: 10
---
# Tasks: Remove mcp-clickup skill

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Author spec.md, plan.md, tasks.md, checklist.md, description.json, graph-metadata.json
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Sub-phase 2a: Deletions
- [ ] T002 [P] Delete skill folder (`.opencode/skill/mcp-clickup/`)
- [ ] T003 [P] Delete changelog folder (`.opencode/changelog/mcp-clickup/`)

### Sub-phase 2b: Advisor data edits
- [ ] T004 Remove entry from `mcp_server/skill_advisor/lib/scorer/lanes/lexical.ts` (line 37)
- [ ] T005 Remove two entries from `mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts` (lines 14, 61)
- [ ] T006 Remove 7 routing entries from `mcp_server/skill_advisor/scripts/skill_advisor.py` (lines 1358–1361, 1660–1661, 1902)
- [ ] T007 Edit `mcp_server/skill_advisor/scripts/skill-graph.json` — count, families, adjacency, signals
- [ ] T008 Edit `mcp_server/skill_advisor/graph-metadata.json` — drop routing edge (line 16)
- [ ] T009 [P] `python3 -m json.tool` round-trip on both JSON files

### Sub-phase 2c: Doc edits
- [ ] T010 [P] Edit `.opencode/skill/mcp-code-mode/graph-metadata.json` (line 18)
- [ ] T011 [P] Edit `.opencode/skill/README.md` (lines 58, 159, 205, 262)
- [ ] T012 [P] Edit `.opencode/install_guides/README.md` (lines 822, 1469)
- [ ] T013 [P] Edit `.opencode/install_guides/SET-UP - AGENTS.md` (line 1221)
- [ ] T014 [P] Edit `README.md` root (line 809)
- [ ] T014a [P] Edit 7 mcp-code-mode playbook anchors removing dead `mcp-clickup/SKILL.md` rows
- [ ] T014b Remove `P1-GRAPH-003` regression case from advisor fixtures
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T015 Repo-wide `grep -rn "mcp-clickup"` excluding `.opencode/specs/` and observability returns zero
- [ ] T016 Run `validate.sh --strict` against this spec folder
- [ ] T017 Author `implementation-summary.md` with file-by-file evidence
- [ ] T018 Mark `checklist.md` items with evidence
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed (T015 + T016)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
