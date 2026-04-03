---
title: "Tasks: Upgrade create:changelog with GitHub [03--commands-and-skills/038-cmd-create-changelog-and-releases/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "changelog release tasks"
  - "create changelog task list"
  - "038 tasks"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Upgrade create:changelog with GitHub Release Creation

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

- [x] T001 Read `.opencode/command/create/changelog.md` in full — confirm current phase structure and insertion points (`.opencode/command/create/changelog.md`)
- [x] T002 Read `changelog.toml` in full — confirm it mirrors the markdown (`.agents/commands/create/changelog.toml`)
- [x] T003 Read `.opencode/skill/sk-git/references/finish_workflows.md` Step 6 — confirm ANCHOR structure and existing release instructions (`.opencode/skill/sk-git/references/finish_workflows.md`)
- [x] T004 [P] Read `PUBLIC_RELEASE.md` Sections 4–7 — confirm release notes format rules (`PUBLIC_RELEASE.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### changelog.md — Release Phase Addition

- [ ] T005 Add `:release` suffix detection to the Setup Phase mode-checking block in `.opencode/command/create/changelog.md` — after the `:auto`/`:confirm` detection logic, add: if `:release` suffix detected → `release_mode = TRUE` (`.opencode/command/create/changelog.md`)
- [ ] T006 Add `## RELEASE PHASE (Optional)` section to `.opencode/command/create/changelog.md` — positioned after the INSTRUCTIONS block, before CONSTRAINTS. Gate: only entered if `release_mode = TRUE` or user opts in after changelog generation (`.opencode/command/create/changelog.md`)
- [ ] T007 Implement Phase R1 in the release section: version detection — read `vX.X.X.X` from changelog filename; if not available, prompt user with `git tag --sort=-v:refname | head -5` suggestion (`.opencode/command/create/changelog.md`)
- [ ] T008 Implement Phase R2 in the release section: release notes composition — load generated changelog file, strip wrapper lines matching `^# v`, `^> Part of`, `^## \[\*\*`, compose plain-English notes per PUBLIC_RELEASE.md §7 (`.opencode/command/create/changelog.md`)
- [ ] T009 Implement Phase R3 in the release section: tag creation — pre-check with `git tag -l vX.X.X.X`, create `git tag -a vX.X.X.X -m "vX.X.X.X: [title]"`, push with `git push origin <branch> --tags` (`.opencode/command/create/changelog.md`)
- [ ] T010 Implement Phase R4 in the release section: GitHub release creation — pre-check `gh auth status`, run `gh release create vX.X.X.X --title "..." --notes "$(cat <<'EOF' ... EOF)"` with HEREDOC notes, include link back to changelog file (`.opencode/command/create/changelog.md`)
- [ ] T011 Add error recovery guidance: document partial-state scenario (tag pushed, `gh release create` failed) with exact manual recovery command (`gh release create vX.X.X.X --notes "..." --title "..."`) (`.opencode/command/create/changelog.md`)
- [ ] T012 Add rollback instruction for dangling tag: if `gh release create` fails, delete tag with `git tag -d vX.X.X.X && git push origin --delete vX.X.X.X` (`.opencode/command/create/changelog.md`)

### changelog.toml — Mirror Update

- [ ] T013 [B:T012] Update `changelog.toml` `prompt` field to match the full updated `.opencode/command/create/changelog.md` instruction body — replace entire prompt string value (`.agents/commands/create/changelog.toml`)
- [ ] T014 Verify TOML syntax: confirm no unescaped quotes, no truncated content, prompt value starts and ends correctly (`.agents/commands/create/changelog.toml`)

### finish_workflows.md — Cross-Reference Addition

- [ ] T015 [P] Locate Action 2 ("Locate or create changelog") in Step 6 of `.opencode/skill/sk-git/references/finish_workflows.md` under the `complete-workflow` anchor section (`.opencode/skill/sk-git/references/finish_workflows.md`)
- [ ] T016 Add cross-reference paragraph at the top of Step 6 Action 2: "Use `/create:changelog [spec-or-component] :auto :release` to generate the changelog file and publish the GitHub release in one step. If you only need the changelog file, omit the `:release` suffix." (`.opencode/skill/sk-git/references/finish_workflows.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T017 Read all three modified files in full — verify no placeholder text, no truncation, all sections present
- [ ] T018 Verify `changelog.toml` prompt matches `.opencode/command/create/changelog.md` instruction body — diff key sections for consistency
- [ ] T019 Verify Phase R1–R4 in `.opencode/command/create/changelog.md` form a coherent sequential flow — each phase output is required for the next
- [ ] T020 Verify `.opencode/skill/sk-git/references/finish_workflows.md` Step 6 cross-reference reads naturally in workflow context — does not disrupt existing instructions
- [ ] T021 Verify wrapper-line strip rules are explicit: `^# v`, `^> Part of`, `^## \[\*\*` — confirm these cover all local changelog wrapper lines per existing changelog format
- [ ] T022 Run `validate.sh` on spec folder and confirm exit code 0 or 1
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed (T017–T021)
- [ ] `validate.sh` exit code 0 or 1 (T022)
- [ ] `checklist.md` all P0 items verified with evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Source files**:
  - `.opencode/command/create/changelog.md`
  - `.agents/commands/create/changelog.toml`
  - `.opencode/skill/sk-git/references/finish_workflows.md`
- **Format reference**: `PUBLIC_RELEASE.md` Section 7
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
