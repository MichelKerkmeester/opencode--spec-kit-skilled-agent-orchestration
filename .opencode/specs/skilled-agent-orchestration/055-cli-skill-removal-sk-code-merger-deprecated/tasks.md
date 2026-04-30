---
title: "Tasks: Remove sk-code-full-stack and sk-code-web"
description: "Task tracking for the hard-removal sweep — deletions, sk-code self-cleanup, advisor edits, doc edits, cross-skill edits, agent edits, SQLite, verification."
trigger_phrases: ["tasks 055", "055 sk-code-merger cleanup"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/055-cli-skill-removal-sk-code-merger-deprecated"
    last_updated_at: "2026-04-30T10:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored task list"
    next_safe_action: "Execute T002 onward"
    blockers: []
    completion_pct: 10
---
# Tasks: Remove sk-code-full-stack and sk-code-web

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

### Sub-phase 2A: Skill tree deletions
- [ ] T002 [P] Delete `.opencode/skill/sk-code-full-stack/` (82 files)
- [ ] T003 [P] Delete `.opencode/skill/sk-code-web/` (46 files)

### Sub-phase 2B: sk-code self-references
- [ ] T004 [P] Neutralize 10 `_placeholder.md` files (5 references/<stack>/ + 5 assets/<stack>/)
- [ ] T005 Edit `sk-code/SKILL.md` — drop sk-code-full-stack/sk-code-web mentions
- [ ] T006 Edit `sk-code/README.md` — drop "Legacy skill content remains on disk" note
- [ ] T007 Edit `sk-code/graph-metadata.json` — drop adjacency siblings; preserve `supersedes` historical
- [ ] T008 Edit `sk-code/CHANGELOG.md` — append packet 055 entry
- [ ] T009 Edit `sk-code/changelog/v1.0.0.0.md` — drop deprecated names if present
- [ ] T010 Edit `sk-code/description.json` — drop deprecated names if present
- [ ] T011 [P] Edit references/router/*.md, references/universal/*.md, references/webflow/*.md, assets/universal/checklists/*.md, assets/webflow/checklists/*.md — strip deprecated names

### Sub-phase 2C: Advisor data
- [ ] T012 Edit `skill_advisor.py` — empty DEPRECATED_SKILLS frozenset, drop stale comment
- [ ] T013 Python json round-trip on `skill-graph.json` — count 22→20, drop families/adjacency/signals
- [ ] T014 Edit advisor `graph-metadata.json` — drop edges if any
- [ ] T015 [P] `python3 -m json.tool` round-trip on edited JSON files
- [ ] T016 [P] `python3 -c "import ast; ast.parse(...)"` on skill_advisor.py

### Sub-phase 2D: Eval / telemetry / regression
- [ ] T017 Retarget `P1-FULLSTACK-001` in `skill_advisor_regression_cases.jsonl` from `["sk-code-full-stack","sk-code-opencode"]` to `["sk-code","sk-code-opencode"]`
- [ ] T018 Retarget any `skill_top_1` rows in `labeled-prompts.jsonl` naming the deprecated pair
- [ ] T019 Delete deprecated rows in `.smart-router-telemetry/compliance.jsonl`

### Sub-phase 2E: Doc surfaces
- [ ] T020 Edit root `README.md` — drop deprecated skill sections
- [ ] T021 Edit `.opencode/skill/README.md` — drop table rows, tree lines, runtime matrix rows; update counts
- [ ] T022 Edit `.opencode/install_guides/README.md` — drop rows, update Skills count 17→15
- [ ] T023 Edit `.opencode/install_guides/SET-UP - AGENTS.md` — drop sections, update Skills count
- [ ] T024 Edit `.opencode/install_guides/SET-UP - Opencode Agents.md` — drop deprecated rows
- [ ] T025 Edit root `AGENTS.md` — drop sk-code-full-stack pointer mention
- [ ] T026 Edit root `CLAUDE.md` — drop deprecated names

### Sub-phase 2F: Cross-skill refs
- [ ] T027 Edit `sk-code-review/SKILL.md` (6 hits) — overlay-target swap
- [ ] T028 Edit `sk-code-review/README.md` (6 hits)
- [ ] T029 Edit `sk-code-review/graph-metadata.json` — causal_summary
- [ ] T030 [P] Edit `sk-code-review/references/*.md` (~7 files)
- [ ] T031 Edit `sk-code-opencode/{SKILL.md, README.md}`
- [ ] T032 [P] Edit `mcp-chrome-devtools/{SKILL.md, README.md, examples/README.md}`
- [ ] T033 [P] Edit `cli-{claude-code,codex,gemini}/SKILL.md` and `cli-opencode/assets/prompt_templates.md`
- [ ] T034 [P] Edit `sk-doc/assets/skill/skill_md_template.md`
- [ ] T035 [P] Edit `sk-git/README.md`
- [ ] T036 [P] Edit `sk-improve-prompt/SKILL.md`
- [ ] T037 [P] Edit `system-spec-kit/assets/level_decision_matrix.md` and `system-spec-kit/references/**/*.md`
- [ ] T038 [P] Edit `system-spec-kit/.../tests/shadow-sink.vitest.ts` and stress-test file

### Sub-phase 2G: Agent definitions
- [ ] T039 [P] Edit `.claude/agents/deep-review.md`
- [ ] T040 [P] Edit `.codex/agents/deep-review.toml`
- [ ] T041 [P] Edit `.gemini/agents/deep-review.md`
- [ ] T042 [P] Edit `.opencode/agent/deep-review.md`

### Sub-phase 2H: SQLite DBs
- [ ] T043 Backup all DBs to `.bak`
- [ ] T044 `DELETE FROM skill_nodes WHERE id IN ('sk-code-web','sk-code-full-stack')` in skill-graph.sqlite (cascade)
- [ ] T045 `DELETE FROM code_nodes / code_files` rows under deprecated paths in code-graph.sqlite
- [ ] T046 Purge voyage `memory_index` + `memory_lineage` rows for deprecated content
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T047 Repo-wide `grep -rn "sk-code-full-stack\|sk-code-web"` excluding specs/observability/055/intentional returns zero
- [ ] T048 `validate.sh --strict` against this spec folder exits 0 errors 0 warnings
- [ ] T049 Per-DB `sqlite3 .dump | grep -c` confirms zero outside 055
- [ ] T050 Author `implementation-summary.md` with file-by-file evidence
- [ ] T051 Mark `checklist.md` items with evidence
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed (T047 + T048 + T049)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
