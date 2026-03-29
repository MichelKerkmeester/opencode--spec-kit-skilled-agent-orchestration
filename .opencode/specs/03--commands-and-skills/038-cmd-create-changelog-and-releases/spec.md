---
title: "Feature Specification: Upgrade create:changelog with GitHub Release Creation"
description: "The create:changelog command only generates changelog files. It cannot create git tags, push them, or publish GitHub releases — meaning users must manually complete the release workflow after every changelog generation."
trigger_phrases:
  - "changelog release creation"
  - "github release command"
  - "create changelog release"
  - "tag and release workflow"
  - "gh release create command"
importance_tier: "normal"
contextType: "implementation"
---
# Feature Specification: Upgrade create:changelog with GitHub Release Creation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-03-29 |
| **Branch** | `038-cmd-create-changelog-and-releases` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The `create:changelog` command generates changelog markdown files but stops there. Publishing a GitHub release requires separate manual steps: create a git tag, push it, then run `gh release create` with properly formatted release notes. Users must do this every time after running the changelog command, which is error-prone and creates a gap where a changelog exists locally but no GitHub release has been published.

The sk-git `.opencode/skill/sk-git/references/finish_workflows.md` Step 6 documents the full release creation procedure but currently has no automated link back to the `create:changelog` command — the two workflows are aware of the same problem but do not coordinate.

### Purpose

Extend `create:changelog` to optionally create a git tag, push it, and publish a GitHub release with properly formatted plain-English release notes — and cross-reference this capability from the sk-git finish Step 6 workflow.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Add release creation phases to `.opencode/command/create/changelog.md` (the command instruction document)
- Mirror all additions to `changelog.toml` (the `.agents/` TOML mirror)
- Update `.opencode/skill/sk-git/references/finish_workflows.md` Step 6 to cross-reference `create:changelog` for release note sourcing
- Two execution modes: `:auto` (autonomous, no prompts) and `:confirm` (interactive, confirm at each step)
- Changelog file is always generated FIRST; release creation is an optional subsequent phase
- Release notes formatted per PUBLIC_RELEASE.md Section 7 plain-English style
- GitHub release body strips local wrapper lines (`# vX.X.X`, `> Part of ...`, `## [**X.X.X**]`)
- Version format `v{MAJOR}.{MINOR}.{SERIES}.{PATCH}` (4-segment, numeric, `v` prefix)

### Out of Scope

- Creating or modifying the YAML workflow asset files (`create_changelog_auto.yaml`, `create_changelog_confirm.yaml`) — this spec covers the command instruction layer only; YAML asset updates are a follow-on task
- Changes to changelog format or version calculation logic — existing behavior is preserved
- Automated testing infrastructure — this is a documentation/command workflow change

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/command/create/changelog.md` | Modify | Add release creation phases (Phase R1–R4) after changelog generation |
| `.agents/commands/create/changelog.toml` | Modify | Mirror the markdown additions in the TOML prompt field |
| `.opencode/skill/sk-git/references/finish_workflows.md` | Modify | Add cross-reference to `create:changelog` in Step 6 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `create:changelog` must support an optional release creation phase triggered by a `:release` suffix or explicit user choice | Running `/create:changelog :release` or `/create:changelog :auto :release` enters the release phase after changelog generation |
| REQ-002 | GitHub release body must NOT include local wrapper lines | Release notes sent to `gh release create --notes` never start with `# vX.X.X` or `> Part of ...` or `## [**X.X.X**]` |
| REQ-003 | `gh release create` is mandatory — pushing a tag alone is not sufficient | The release phase always calls `gh release create`, never only `git tag` + `git push` |
| REQ-004 | Release notes must follow PUBLIC_RELEASE.md Section 7 plain-English format | Notes explain "what was broken, what we did, why it matters" — no jargon-only bullets |
| REQ-005 | `changelog.toml` mirrors all changes made to `.opencode/command/create/changelog.md` | The TOML `prompt` field contains an identical copy of the markdown instruction content |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | `.opencode/skill/sk-git/references/finish_workflows.md` Step 6 cross-references `create:changelog` as the preferred tool for generating release notes | Step 6 contains a note directing users to `/create:changelog` when a changelog file does not exist |
| REQ-007 | Release phase must present a clear summary before tagging so users can verify the version and notes | In `:confirm` mode, the user sees the tag name and release notes preview before any git operations |
| REQ-008 | Release phase handles the case where `gh` CLI is not authenticated or unavailable | Error message is clear, suggests `gh auth login`, and does not leave a dangling tag |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Running `/create:changelog [spec] :auto :release` generates a changelog file and publishes a GitHub release in a single uninterrupted flow
- **SC-002**: The GitHub release page shows properly formatted plain-English notes with no local wrapper markup
- **SC-003**: The `changelog.toml` prompt field is character-for-character identical to the `.opencode/command/create/changelog.md` instruction body
- **SC-004**: `.opencode/skill/sk-git/references/finish_workflows.md` Step 6 includes a cross-reference to `create:changelog` that a user following the finish workflow would encounter naturally
- **SC-005**: All three modified files pass a manual read-through confirming no placeholder text remains and content is internally consistent
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `gh` CLI installed and authenticated | Release phase fails silently or with confusing error | Add pre-check in release phase: verify `gh auth status` before attempting `gh release create` |
| Risk | TOML and markdown drift over time | Command behaves differently under Claude vs `.agents/` runners | Enforce in checklist: verify TOML mirrors markdown before marking complete |
| Risk | Release phase runs before changelog is confirmed | Tag and release reference a changelog that was not accepted | Require changelog generation to complete and return STATUS=OK before entering release phase |
| Risk | Stripping wrapper lines incorrectly removes real content | Release notes are incomplete or malformed | Define exact strip rules: skip lines matching `^# v`, `^> Part of`, `^## \[\*\*` — test against a real changelog file |
| Dependency | PUBLIC_RELEASE.md Section 7 format stays stable | Release notes format diverges from standard | Document the format inline in the release phase so the command is self-contained |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The release phase adds at most two bash commands (`git tag` + `gh release create`) beyond the existing changelog workflow — no additional latency from new tooling

### Security
- **NFR-S01**: No secrets, tokens, or credentials are hardcoded in command files — authentication is handled entirely by the `gh` CLI using its existing credential store
- **NFR-S02**: The `git tag -a` command must use the `-a` (annotated) form, not lightweight tags, to preserve release metadata

### Reliability
- **NFR-R01**: If `gh release create` fails, the git tag MUST be deleted before returning an error — no dangling tags without corresponding releases
- **NFR-R02**: The `:confirm` mode must block on user approval at each of the four release sub-steps: (1) version confirm, (2) notes preview, (3) tag creation, (4) `gh release create`
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Tag already exists: detect with `git tag -l vX.X.X.X` before creating — if found, offer to increment BUILD segment or abort
- No changelog file generated: abort release phase with clear message — changelog file is a hard prerequisite
- Version not in 4-segment format: validate format before tagging; reject and report error if `v{MAJOR}.{MINOR}.{SERIES}.{PATCH}` pattern not matched

### Error Scenarios
- `gh` CLI not installed: detect before tag creation; show install instructions (`brew install gh` / `apt install gh`)
- `gh auth status` fails: prompt user to run `gh auth login`; do not proceed to release
- `git push --tags` fails (e.g., no remote, auth error): roll back tag deletion, report error clearly
- Network timeout during `gh release create`: tag has already been pushed; report partial state clearly and provide manual recovery command

### State Transitions
- Partial release (tag pushed, `gh release create` failed): log exact recovery command so user can complete manually
- Changelog generated but release declined: command completes normally with STATUS=OK; no tag is created
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 3 files, all documentation/command layer — no runtime code |
| Risk | 10/25 | External tool dependency (`gh`), tag/release ordering risk |
| Research | 6/20 | Format already documented in PUBLIC_RELEASE.md and finish_workflows.md |
| **Total** | **28/70** | **Level 2 — verification needed due to cross-file consistency requirement** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:acceptance -->
## 7. ACCEPTANCE SCENARIOS

**Given** a user runs `/create:changelog [spec] :auto :release` with a valid spec folder, **when** the changelog file is generated with STATUS=OK, **then** the command proceeds to the release phase, creates an annotated git tag, pushes it, and calls `gh release create` without requiring additional user input.

**Given** the generated changelog file contains local wrapper lines (`# v2.1.0.0`, `> Part of OpenCode Dev Environment`, `## [**2.1.0.0**] - 2026-03-29`), **when** the release phase composes release notes for `gh release create --notes`, **then** those wrapper lines are stripped and the release body starts directly with the plain-English summary paragraph.

**Given** a user runs `/create:changelog [spec] :confirm :release`, **when** the release phase reaches Phase R3 (tag creation), **then** the user is shown the proposed tag name and release notes preview and must explicitly confirm before any git tag command is executed.

**Given** `gh auth status` returns a non-zero exit code (user not authenticated), **when** the release phase performs its pre-check, **then** the command aborts with a clear error message ("GitHub CLI not authenticated — run `gh auth login` and retry") and no git tag is created.

**Given** `gh release create` fails after the tag has already been pushed, **when** the error is detected, **then** the command reports the partial state, logs the exact manual recovery command, and instructs the user to delete the dangling tag with `git tag -d vX.X.X.X && git push origin --delete vX.X.X.X`.
<!-- /ANCHOR:acceptance -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should the release phase also update `PUBLIC_RELEASE.md` Section 5 (CURRENT RELEASE) automatically, or is that out of scope for this command?
- The YAML asset files (`create_changelog_auto.yaml`, `create_changelog_confirm.yaml`) are not in scope for this spec — should a follow-on spec be created to add the release steps to those files?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
