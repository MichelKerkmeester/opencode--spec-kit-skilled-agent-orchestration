---
title: "Tasks: Rewrite Repo README [system-spec-kit/022-hybrid-rag-fusion/019-rewrite-repo-readme/tasks]"
description: "Task breakdown for complete rewrite of the repository root README."
trigger_phrases:
  - "tasks"
  - "rewrite"
  - "repo"
  - "readme"
  - "019"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_LEVEL: 1 -->
# Tasks: 019-rewrite-repo-readme

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

- [x] T001 Enumerate all 12 agents with roles and capabilities [EVIDENCE: 10 codex agents confirmed 2 built-in + 10 custom across 4 runtimes]
- [x] T002 [P] Enumerate all 18 skills with descriptions [EVIDENCE: codex agent inventoried all 18 skill folders]
- [x] T003 [P] Extract gate system summary from CLAUDE.md [EVIDENCE: codex agent extracted 3 gates + 2 post-rules + 6 lenses]
- [x] T004 [P] Inventory command architecture from command directory [EVIDENCE: 8+6+7+1=22 commands confirmed]
- [x] T005 [P] Catalog MCP tools (42 total: 33+7+1+1) [EVIDENCE: opencode.json lists 4 native servers, tool-schemas.ts confirms 33]
- [x] T006 Research brief compiled from 10 parallel agents [EVIDENCE: /tmp/research-01 through research-10.md]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T007 Write Overview section (what OpenCode is, key numbers) [EVIDENCE: 928-line README with comparison table, key stats, ASCII architecture, role-based navigation]
- [x] T008 Write Quick Start section (first steps for new users) [EVIDENCE: Installation, embedding setup, verification, first-use example]
- [x] T009 Write Spec Kit Documentation section 4.1 (summary, link to D3) [EVIDENCE: Doc levels table, CORE+ADDENDUM explanation, folder layout, link to Spec Kit README]
- [x] T010 Write Memory Engine section 4.2 (summary, link to D1) [EVIDENCE: 'What Makes It Smart' table with 8 power features, channels table, link to MCP README]
- [x] T011 Write Agent Network section 4.3 (all 12 agents with roles) [EVIDENCE: 12-row agent table with model, type, role. Runtime directory table with file counts]
- [x] T012 Write Command Architecture section 4.4 [EVIDENCE: 4 namespace tables (8+6+7+1=22), modes listed]
- [x] T013 Write Skills Library section 4.5 (all 18 skills with descriptions) [EVIDENCE: 5 category tables with 18 skills, versions, descriptions]
- [x] T014 Write Gate System section 4.6 (3 gates from CLAUDE.md) [EVIDENCE: Gate table, ASCII flow diagram, post-rules table, 6 analysis lenses]
- [x] T015 Write Code Mode MCP section 4.7 [EVIDENCE: 4-server native MCP table (42 total), 7 tools, 6 external integrations, performance comparison]
- [x] T016 Write Configuration section [EVIDENCE: 6 config files table, env vars, opencode.json example with all 4 servers]
- [x] T017 Write Usage Examples section [EVIDENCE: 6 examples with code blocks + common patterns table]
- [x] T018 Write Troubleshooting, FAQ, and Related Documents [EVIDENCE: 4 troubleshooting entries with 'What you see/Common causes/Fix', 10 FAQ, internal+external links]
- [x] T019 Add TOC and role-based navigation paths [EVIDENCE: 15-item TOC with nested 4.x entries, 10-row role-based navigation table]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Structural verification via 3 parallel codex agents [EVIDENCE: counts, dedup, structure agents all pass]
- [x] T021 [P] Verify all 18 skills and 12 agents present [EVIDENCE: grep confirms 18 agent refs, 51 skill name mentions across tables]
- [x] T022 [P] Verify MCP tool count = 42 [EVIDENCE: 7 mentions of "42" in README, consistent breakdown 33+7+1+1]
- [x] T023 [P] Verify all 9 cross-references resolve [EVIDENCE: all 9 referenced paths confirmed to exist on disk]
- [x] T024 [P] Check for content duplication with D1 and D3 [EVIDENCE: codex dedup agent confirms summary+link pattern, no tool tables duplicated]
- [x] T025 [P] Verify ANCHOR pairs balanced [EVIDENCE: 10 pairs, each appears exactly twice (open+close)]
- [x] T026 Apply review fixes [EVIDENCE: no fixes needed, all checks passed]
- [x] T027 Replace current README with rewritten version [EVIDENCE: README.md.bak created, 928-line v4.0 README written]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All 18 skills, 12 agents, and 42 MCP tools documented
- [x] All cross-references resolve, ANCHOR pairs balanced
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **MCP README (D1)**: `.opencode/skill/system-spec-kit/mcp_server/README.md`
- **Spec Kit README (D3)**: `.opencode/skill/system-spec-kit/README.md`
- **Agent definitions**: `.claude/agents/`, `.opencode/agent/`
- **Skill directory**: `.opencode/skill/`
<!-- /ANCHOR:cross-refs -->

---

<!--
TASKS: 019-rewrite-repo-readme
27/27 tasks complete — Complete (2026-03-25)
-->
