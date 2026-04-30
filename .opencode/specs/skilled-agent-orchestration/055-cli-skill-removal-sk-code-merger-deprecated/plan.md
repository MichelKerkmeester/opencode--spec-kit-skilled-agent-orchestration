---
title: "Implementation Plan: Remove sk-code-full-stack and sk-code-web"
description: "Phased removal mirroring 053 — delete both skill trees, neutralize sk-code placeholders, sweep advisor data, doc surfaces, agent definitions, and SQLite indexes."
trigger_phrases: ["plan 055", "sk-code-merger cleanup plan"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/055-cli-skill-removal-sk-code-merger-deprecated"
    last_updated_at: "2026-04-30T10:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored implementation plan"
    next_safe_action: "Execute Phase A deletions"
    blockers: []
    completion_pct: 10
---
# Implementation Plan: Remove sk-code-full-stack and sk-code-web

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON, TypeScript, Python, JSONL, SQLite |
| **Framework** | OpenCode Spec Kit |
| **Storage** | SQLite (skill-graph, code-graph, voyage context-index) |
| **Testing** | `validate.sh --strict`, JSON parse round-trip, post-edit grep, Python AST parse |

### Overview
Delete the two deprecated skill trees, neutralize sk-code's placeholder pointers, sweep ~50 reference files across docs / advisor data / cross-skill READMEs / agent definitions / SQLite indexes. Pattern mirrors `053-cli-skill-removal-mcp-clickup`; widened scope due to broader cross-skill entanglement.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] User decision recorded: hard-delete both, accept content loss
- [x] Three Explore agents mapped surface area
- [x] Reference inventory complete (352 hits across 70+ files)

### Definition of Done
- [ ] Both directories deleted
- [ ] All ~50 reference files edited
- [ ] sk-code placeholder pointers neutralized
- [ ] SQLite DBs pruned
- [ ] `grep -rn "sk-code-full-stack\|sk-code-web"` outside specs/observability/this packet returns zero (modulo the intentional `supersedes` historical residual)
- [ ] `validate.sh --strict` exits 0 errors 0 warnings on the spec folder
- [ ] `implementation-summary.md` written with file-by-file evidence
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Pure deletion + targeted text edits + SQL DELETE statements. No new abstractions.

### Key Components
- **Skill folder deletion**: `rm -rf` against the two trees.
- **Targeted edits**: `Edit` tool with surgical `old_string`/`new_string` for each reference.
- **JSON validation**: Python `json.tool` round-trip after each JSON modification.
- **SQLite cleanup**: surgical `DELETE FROM` against skill-graph, code-graph, and voyage context-index.

### Data Flow
spec.md → plan.md → tasks.md → execute (delete + edit + sql) → validator → implementation-summary.md.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Spec folder created
- [x] Surface area inventoried (352 hits across 70+ files)
- [x] description.json + graph-metadata.json scaffolded

### Phase 2: Implementation
- **Sub-phase 2A — Skill tree deletions**: `rm -rf` both folders (128 files total)
- **Sub-phase 2B — sk-code self-references**: 10 `_placeholder.md` files + SKILL.md + README.md + graph-metadata.json + CHANGELOG.md + a handful of references/*.md and assets/*.md that mention deprecated names
- **Sub-phase 2C — Advisor data**: skill_advisor.py (DEPRECATED_SKILLS frozenset, comments) + skill-graph.json (Python json round-trip: count 22→20, families, adjacency, signals) + advisor graph-metadata.json
- **Sub-phase 2D — Eval / telemetry / regression fixtures**: skill_advisor_regression_cases.jsonl (retarget P1-FULLSTACK-001) + labeled-prompts.jsonl + compliance.jsonl
- **Sub-phase 2E — Doc surfaces**: root README, .opencode/skill/README, .opencode/install_guides/* (3 files), AGENTS.md, CLAUDE.md
- **Sub-phase 2F — Cross-skill refs**: sk-code-review (SKILL.md, README.md, graph-metadata.json, references/*.md), sk-code-opencode, mcp-chrome-devtools, cli-claude-code, cli-codex, cli-gemini, cli-opencode, sk-doc, sk-git, sk-improve-prompt, system-spec-kit references
- **Sub-phase 2G — Agent definitions**: four runtime deep-review files
- **Sub-phase 2H — SQLite DBs**: skill-graph (DELETE 2 nodes + cascade edges), code-graph (DELETE files under deprecated paths), voyage memory_index/lineage purge

### Phase 3: Verification
- Repo-wide `grep -rn "sk-code-full-stack\|sk-code-web"` excluding specs/observability/055/intentional-historical → zero hits
- `python3 -m json.tool` on every edited JSON
- `python3 -c "import ast; ast.parse(...)"` on skill_advisor.py
- `validate.sh --strict` on this spec folder
- Per-DB `sqlite3 .dump | grep -c` confirms zero hits outside this packet
- Author `implementation-summary.md`
- Mark checklist items with evidence
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static parse | All edited JSON | `python3 -m json.tool` |
| Static parse | skill_advisor.py | `python3 -c "import ast; ast.parse(...)"` |
| Cross-file consistency | Repo-wide reference scan | `grep -rn` |
| SQL state | All DBs | `sqlite3 <db> ".dump" | grep -c` |
| Spec validation | This spec folder | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `validate.sh` | Internal | Green | Cannot claim completion |
| `sqlite3` CLI | Internal | Green | Cannot prune DBs |
| Edit tool | Internal | Green | Manual edits required |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: skill-graph fails JSON parse OR validate.sh shows hard errors after edits OR sqlite ROLLBACK fails.
- **Procedure**: `git checkout HEAD -- <affected-files>` to revert each file individually; restore deleted folders with `git restore .opencode/skill/sk-code-full-stack .opencode/skill/sk-code-web` (assumes deletions not yet committed). For SQLite — `cp` from a pre-edit `.bak` (created at start of Phase 2H).
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2A (Delete) ──┐
                    Phase 2B (sk-code)  │
                    Phase 2C (Advisor) ─┼─► Phase 3 (Verify)
                    Phase 2D (Eval)     │
                    Phase 2E (Docs)     │
                    Phase 2F (Cross)    │
                    Phase 2G (Agents)   │
                    Phase 2H (SQL) ─────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | All |
| 2A Delete | Setup | Verify |
| 2B sk-code | Setup | Verify |
| 2C Advisor | Setup | Verify |
| 2D Eval | Setup | Verify |
| 2E Docs | Setup | Verify |
| 2F Cross | Setup | Verify |
| 2G Agents | Setup | Verify |
| 2H SQL | 2A | Verify |
| Verify | All | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15 min |
| 2A Deletions | Low | 5 min |
| 2B sk-code self | Medium | 30 min |
| 2C Advisor | Medium | 25 min |
| 2D Eval/telemetry | Low | 10 min |
| 2E Doc surfaces | Medium | 25 min |
| 2F Cross-skill | Medium | 40 min |
| 2G Agents | Low | 10 min |
| 2H SQLite | Medium | 20 min |
| Verification | Low | 15 min |
| **Total** | | **~3.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No production data touched (config + docs + indexes only)
- [x] No feature flag needed
- [x] No external monitoring impact

### Rollback Procedure
1. `git status --short` to identify changed files
2. `git checkout HEAD -- <file>` for each unwanted edit
3. `git restore <deleted-paths>` to recover skill folders if needed
4. Restore SQLite from `.bak` snapshots created at Phase 2H start
5. Re-run `validate.sh` to confirm pre-state

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
