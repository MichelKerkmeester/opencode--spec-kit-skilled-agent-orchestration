---
title: "Implementation Plan: Upgrade create:changelog [03--commands-and-skills/038-cmd-create-changelog-and-releases/plan]"
description: "Adds optional release creation phases (tag + gh release create) to the create:changelog command instruction files, and cross-references the command from sk-git finish Step 6."
trigger_phrases:
  - "changelog release plan"
  - "create changelog implementation"
  - "release phase implementation"
  - "gh release create integration"
importance_tier: "normal"
contextType: "implementation"
---
# Implementation Plan: Upgrade create:changelog with GitHub Release Creation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (command instructions), TOML (agent command mirror) |
| **Framework** | OpenCode command system — instruction files loaded by AI agents |
| **Storage** | None — file edits only |
| **Testing** | Manual read-through and behavioral verification |

### Overview

Three files need modification. The core work is adding release creation phases (R1–R4) to `.opencode/command/create/changelog.md` immediately after the existing changelog generation steps. The TOML mirror must be updated to match. The `.opencode/skill/sk-git/references/finish_workflows.md` Step 6 gets a one-paragraph cross-reference directing users to `create:changelog` when no changelog file exists yet. No YAML asset files are in scope — the release phases live in the command instruction layer only.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented in spec.md
- [x] Success criteria measurable
- [x] Source files read and understood (changelog.md, changelog.toml, finish_workflows.md, PUBLIC_RELEASE.md)

### Definition of Done
- [ ] All three target files modified with no placeholder text
- [ ] `changelog.toml` prompt field mirrors `.opencode/command/create/changelog.md` content exactly
- [ ] `.opencode/skill/sk-git/references/finish_workflows.md` Step 6 references `create:changelog` naturally in the workflow
- [ ] Checklist verified — all P0 and P1 items marked with evidence
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Command instruction layer — no runtime code, no dependencies to install. All changes are to markdown/TOML instruction files consumed by AI agents at runtime.

### Key Components

- **`.opencode/command/create/changelog.md`**: The primary command instruction file. The release phase (Phases R1–R4) is appended as a named section after the existing INSTRUCTIONS block. It is gated by a `:release` suffix or user choice — changelog generation must complete successfully before the gate opens.
- **`changelog.toml`**: The `.agents/` mirror. The `prompt` field must be a verbatim copy of the markdown instruction content. Updated last, after `.opencode/command/create/changelog.md` is finalized.
- **`.opencode/skill/sk-git/references/finish_workflows.md`**: The sk-git finish workflow reference. Step 6 ("Create Release") is extended with a cross-reference paragraph explaining that `create:changelog` can generate changelog files and optionally the GitHub release in one command.

### Data Flow

```
User invokes /create:changelog [spec] :auto :release
         │
         ▼
Phase 0: @write agent verification
         │
         ▼
Setup Phase: gather source, version bump, mode
         │
         ▼
Phases 1–7 (existing): generate changelog file → STATUS=OK
         │
         ▼ (only if :release suffix or user opts in)
Phase R1: detect version from changelog filename
         │
Phase R2: compose release notes (strip wrapper, apply PUBLIC_RELEASE.md §7 format)
         │
Phase R3: git tag -a vX.X.X.X + git push origin <branch> --tags
         │
Phase R4: gh release create vX.X.X.X --title "..." --notes "..."
         │
         ▼
STATUS=OK | FAIL
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Read and Understand All Source Files

- [x] Read `.opencode/command/create/changelog.md` — understand existing phase structure and where to add release phases
- [x] Read `changelog.toml` — confirm it is a TOML mirror of the markdown
- [x] Read `.opencode/skill/sk-git/references/finish_workflows.md` Step 6 — understand existing release instructions and tone
- [x] Read `PUBLIC_RELEASE.md` Sections 4–7 — understand release notes format requirements

### Phase 2: Edit changelog.md

- [ ] Identify the exact insertion point — after the existing INSTRUCTIONS block, before CONSTRAINTS
- [ ] Add a `## RELEASE PHASE (Optional)` section with Phases R1–R4
- [ ] R1: Version detection — read from changelog filename or prompt user
- [ ] R2: Release notes composition — strip local wrapper lines, apply PUBLIC_RELEASE.md §7 format
- [ ] R3: Tag creation and push — `git tag -a` + `git push --tags`, with pre-check for existing tag
- [ ] R4: `gh release create` — with pre-auth check, HEREDOC notes, link back to changelog file
- [ ] Add `:release` suffix detection to the Setup Phase mode-checking logic
- [ ] Add error recovery guidance: partial-state recovery commands

### Phase 3: Update changelog.toml

- [ ] Replace the `prompt` field value with the complete updated `.opencode/command/create/changelog.md` content
- [ ] Verify character-for-character match between TOML prompt and markdown content
- [ ] Verify TOML syntax is valid (no unescaped quotes in the prompt string)

### Phase 4: Update finish_workflows.md Step 6

- [ ] Locate Step 6 under the `ANCHOR:complete-workflow` section
- [ ] Add a cross-reference paragraph at the top of Step 6 Action 2 ("Locate or create changelog")
- [ ] Cross-reference text: "Use `/create:changelog [spec-or-component] :auto :release` to generate the changelog file and publish the GitHub release in one step. If you only need the changelog file, omit the `:release` suffix."
- [ ] Preserve all existing Step 6 content — this is an additive edit only

### Phase 5: Verification

- [ ] Read all three modified files — confirm no placeholder text
- [ ] Verify `changelog.toml` prompt matches `.opencode/command/create/changelog.md` instruction body
- [ ] Verify `.opencode/skill/sk-git/references/finish_workflows.md` Step 6 cross-reference appears naturally in the workflow narrative
- [ ] Run `validate.sh` on the spec folder
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual read-through | All three modified files — check for missing sections, placeholder text, format errors | Read tool |
| Content consistency | `changelog.toml` prompt vs `.opencode/command/create/changelog.md` instruction body | Diff comparison |
| Format validation | Release notes sample in Phase R4 matches PUBLIC_RELEASE.md §7 template | Manual checklist |
| Integration check | `.opencode/skill/sk-git/references/finish_workflows.md` Step 6 cross-reference reads naturally in context | Read tool |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `.opencode/command/create/changelog.md` must be finalized before updating `changelog.toml` | Internal ordering | Green | TOML update cannot happen until markdown is done |
| `PUBLIC_RELEASE.md` Section 7 format | Internal reference | Green | Already read and understood — format is stable |
| `.opencode/skill/sk-git/references/finish_workflows.md` ANCHOR structure | Internal reference | Green | ANCHOR tag `complete-workflow` confirmed present at Step 3 |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Post-edit validation reveals structural errors, missing sections, or TOML syntax failure
- **Procedure**: Git revert is the cleanest path — all three files are version-controlled. Run `git diff` to review, then `git checkout -- <file>` for individual file revert or `git revert HEAD` for full rollback.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Read sources) ──────────────┐
                                     ├──► Phase 2 (Edit changelog.md) ──► Phase 3 (Update TOML) ──► Phase 5 (Verify)
Phase 1 (Read sources) ──────────────┘                                                               ↑
                                                                       Phase 4 (Update finish_workflows.md) ─┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Read sources | None | All editing phases |
| Edit changelog.md | Phase 1 | Phase 3 (TOML), Phase 5 |
| Update changelog.toml | Phase 2 finalized | Phase 5 |
| Update finish_workflows.md | Phase 1 | Phase 5 |
| Verification | Phases 2, 3, 4 | Completion claim |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Read sources | Low | 15–20 min |
| Edit changelog.md | Medium | 45–60 min |
| Update changelog.toml | Low | 20–30 min |
| Update finish_workflows.md | Low | 15–20 min |
| Verification | Low | 15–20 min |
| **Total** | | **1.5–2.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] All source files read before editing
- [ ] No YAML asset files modified (out of scope)
- [ ] TOML syntax valid before claiming complete

### Rollback Procedure
1. Run `git diff .opencode/command/create/changelog.md` to confirm scope of changes
2. `git checkout -- .opencode/command/create/changelog.md` to revert markdown
3. `git checkout -- .agents/commands/create/changelog.toml` to revert TOML
4. `git checkout -- .opencode/skill/sk-git/references/finish_workflows.md` to revert cross-reference
5. Verify `git status` shows clean working tree

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — all changes are to instruction/documentation files with no state
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
