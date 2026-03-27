---
title: "Implementation Plan: Bulk Changelog Refresh From 60 Specs + 100 Commits"
description: "Audit the last 60 relevant OpenCode specs and last 100 commits, then apply the minimum changelog mutations needed to reflect real uncovered work."
trigger_phrases:
  - "bulk changelog refresh plan"
  - "60 specs"
  - "100 commits"
importance_tier: "normal"
contextType: "general"
---
# Implementation Plan: Bulk Changelog Refresh From 60 Specs + 100 Commits

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, git history, spec metadata |
| **Primary Contract** | `.opencode/command/create/changelog.md` plus the changelog YAML assets |
| **Working Packet** | `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/020-hybrid-raf-fusion-related-changelogs` |
| **Mutation Strategy** | Update existing same-release notes in place; create new files only when the current latest component entry predates the work |

### Technical Context

- The packet follows the repository's canonical changelog structure from `.opencode/command/create/changelog.md` and the paired YAML assets.
- The audit ranks recent specs deterministically and uses commit history only as supporting evidence for release-note truthfulness.
- The final output set is intentionally small relative to the source audit: 3 in-place changelog updates plus 4 new CLI patch files.

### Overview

The implementation follows a four-step loop:

1. rank recent specs deterministically,
2. filter recent commits for meaningful evidence,
3. compare that evidence against the latest published changelog files,
4. repair only the existing release notes and component folders that the evidence shows are incomplete.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Canonical changelog format understood
- [x] Working packet confirmed
- [x] Latest relevant changelog files identified
- [x] Commit chronology established for the shipped omissions and the CLI README rewrite wave

### Definition of Done

- [x] The latest sk-deep-research changelog covers the spec-034 review-folder contract
- [x] The latest commands changelog covers the spec-033 command README rewrite wave
- [x] The environment v3 changelog covers the same shipped review-folder work
- [x] The 4 CLI patch changelog files exist at the expected sequential versions
- [ ] Validation commands pass
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Audit-first changelog repair with narrow mutation scope

### Key Inputs

- Ranked 60-spec source set
- Filtered 100-commit history
- Existing latest environment, commands, sk-deep-research, and CLI changelog files
- Spec `033-skill-command-readme-rewrite`
- Spec `034-sk-deep-research-review-folders`
- Commit chronology for the v3 release sweep

### Decision Rules

- **Update existing latest file** when the missing work shipped in the same release commit as the current latest changelog.
- **Create a new file** when the relevant component work is real and the current latest component changelog still predates it.
- **Prefer the smallest truthful repair** over broader umbrella or micro-release expansion.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- Confirm the packet path and read the current packet docs.
- Read the latest relevant changelog files before any edits.

### Phase 2: Implementation

- Rank the last 60 relevant specs using metadata fallback rules.
- Filter the last 100 commits for useful changelog evidence.
- Update `.opencode/changelog/12--sk-deep-research/v1.2.1.0.md`.
- Update `.opencode/changelog/04--commands/v2.6.1.0.md`.
- Update `.opencode/changelog/00--opencode-environment/v3.0.0.0.md`.
- Create the 4 CLI patch changelog files.
- Rewrite the 020 packet docs and implementation summary to describe the audited outcome.

### Phase 3: Verification

- Run strict packet validation.
- Run `git diff --check`.
- Verify canonical changelog sections remain present in the edited and created release notes.
- Verify new CLI patch versions are sequential and collision-free.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Source-set reproducibility | Ranked 60-spec audit | Python ranking script + manual spot-check |
| Commit chronology | Same-release omission vs later work | `git show --format=fuller` |
| Changelog format | Edited and created release-note files | `rg` for required section headers + manual review |
| Version sequencing | New CLI patch files | `find ... | sort -V` |
| Packet validation | 020 spec folder | `spec/validate.sh --strict` |
| Diff hygiene | All modified files | `git diff --check` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing latest changelog files | Internal | Green | Needed to compare published coverage vs missing coverage |
| Spec 033 artifacts | Internal | Green | Needed to summarize the README rewrite wave accurately |
| Spec 034 artifacts | Internal | Green | Needed to summarize the review-folder contract accurately |
| Release commit chronology | Internal | Green | Needed to decide update-vs-create behavior correctly |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Incorrect chronology, incorrect changelog narrative, or failed validation
- **Procedure**: Revert the edited packet files and changelog files, then rerun the audit before trying again
<!-- /ANCHOR:rollback -->
