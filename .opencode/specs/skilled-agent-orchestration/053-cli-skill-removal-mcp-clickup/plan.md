---
title: "Implementation Plan: Remove mcp-clickup skill"
description: "Sequenced removal of the mcp-clickup skill folder, changelog, advisor data, skill graphs, and README references — all on main, no feature branch."
trigger_phrases: ["plan mcp-clickup removal", "053 plan"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/053-cli-skill-removal-mcp-clickup"
    last_updated_at: "2026-04-30T08:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored implementation plan"
    next_safe_action: "Execute Phase 2 deletions and reference edits"
    blockers: []
    completion_pct: 10
---
# Implementation Plan: Remove mcp-clickup skill

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON, TypeScript, Python (read-only edits) |
| **Framework** | OpenCode Spec Kit |
| **Storage** | None |
| **Testing** | `validate.sh --strict`, JSON parse round-trip, post-edit grep |

### Overview
Decommission the `mcp-clickup` skill cleanly: delete the skill and changelog trees, prune entries from advisor scoring tables and skill graphs, and update doc lists/counts so the published skill set (was 22, becomes 21; install-guide-visible count was 18, becomes 17) is internally consistent. ClickUp-as-a-service references that travel through Code Mode are preserved.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Reference inventory complete (12 files identified across 6 categories)
- [x] Service-vs-skill distinction documented in spec.md scope
- [x] Skill graph file structure understood (count, families, adjacency, signals)

### Definition of Done
- [ ] Both directories deleted
- [ ] All 10 reference files edited
- [ ] `grep -rn "mcp-clickup"` outside `.opencode/specs/` and observability returns zero
- [ ] `validate.sh --strict` exits ≤ 1 on the spec folder
- [ ] `python3 -m json.tool` passes on every edited JSON file
- [ ] `implementation-summary.md` written with file-by-file evidence
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Pure deletion + targeted text edits. No new abstractions.

### Key Components
- **Skill folder deletion**: `rm -rf` against the two trees.
- **Targeted edits**: `Edit` tool with surgical `old_string`/`new_string` for each reference.
- **JSON validation**: Python json.tool round-trip after each JSON edit.
- **Post-edit verification**: repo-wide grep + spec validator.

### Data Flow
spec.md → plan.md → tasks.md → execute (delete + edit) → validator → implementation-summary.md → memory save.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Spec folder created with Level 2 docs
- [x] Reference inventory complete
- [x] `description.json` and `graph-metadata.json` created (will be refreshed by `generate-context.js` on save)

### Phase 2: Deletions
- [ ] Delete `.opencode/skill/mcp-clickup/` (recursive)
- [ ] Delete `.opencode/changelog/mcp-clickup/` (recursive)

### Phase 3: Advisor data edits
- [ ] Remove `mcp-clickup` entries from `lexical.ts` (1 line)
- [ ] Remove `mcp-clickup` entries from `explicit.ts` (2 lines)
- [ ] Remove `mcp-clickup` entries from `skill_advisor.py` (7 lines across 3 dicts)
- [ ] Edit `skill-graph.json` — count 22→21, drop `families.mcp[mcp-clickup]`, drop `adjacency.mcp-clickup`, drop `mcp-code-mode.prerequisite_for[mcp-clickup]`, drop `skill-advisor.enhances[mcp-clickup]`, drop `signals.mcp-clickup`
- [ ] Edit advisor `graph-metadata.json` — drop one routing edge

### Phase 4: Doc edits
- [ ] `.opencode/skill/mcp-code-mode/graph-metadata.json` — drop one cross-link
- [ ] `.opencode/skill/README.md` — 4 edits (count 5→4, table row, tree, runtime matrix)
- [ ] `.opencode/install_guides/README.md` — 2 edits (install row + 18→17)
- [ ] `.opencode/install_guides/SET-UP - AGENTS.md` — 1 edit (18→17)
- [ ] `README.md` (root) — 1 edit (skill listing line)

### Phase 5: Verification
- [ ] `python3 -m json.tool` on every edited JSON file
- [ ] `grep -rn "mcp-clickup" --include="*.md" --include="*.json" --include="*.ts" --include="*.py"` outside of `.opencode/specs/` and observability reports → zero matches
- [ ] `validate.sh --strict` exits ≤ 1
- [ ] Author `implementation-summary.md`
- [ ] Mark `checklist.md` items complete with evidence
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static parse | All edited JSON files | `python3 -m json.tool` |
| Cross-file consistency | Repo-wide reference scan | `grep -rn` |
| Spec validation | This spec folder | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `validate.sh` | Internal | Green | Cannot claim completion |
| Edit tool | Internal | Green | Manual edits required |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Skill graph fails JSON parse OR validate.sh shows hard errors after edits.
- **Procedure**: `git checkout HEAD -- <affected-files>` to revert each file individually; restore deleted directories with `git restore --staged --worktree .opencode/skill/mcp-clickup .opencode/changelog/mcp-clickup` (assumes deletions not yet committed).
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Delete) ──┐
                                       ├──► Phase 5 (Verify)
                    Phase 3 (Advisor) ─┤
                    Phase 4 (Docs) ────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Delete, Advisor, Docs |
| Delete | Setup | Verify |
| Advisor | Setup | Verify |
| Docs | Setup | Verify |
| Verify | Delete + Advisor + Docs | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15 min |
| Deletions | Low | 5 min |
| Advisor data | Medium | 20 min (5 files, JSON edits) |
| Doc edits | Low | 15 min |
| Verification | Low | 10 min |
| **Total** | | **~65 min** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No production data touched (config + docs only)
- [x] No feature flag needed
- [x] No external monitoring impact

### Rollback Procedure
1. `git status --short` to identify changed files
2. `git checkout HEAD -- <file>` for each unwanted edit
3. `git restore <deleted-paths>` to recover skill folder if needed
4. Re-run `validate.sh` to confirm pre-state

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
