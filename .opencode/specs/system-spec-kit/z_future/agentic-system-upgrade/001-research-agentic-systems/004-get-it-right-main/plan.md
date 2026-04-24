---
title: "Implementation [system-spec-kit/z_future/agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/plan]"
description: "Phase 3 continues the existing Get It Right research packet by focusing on command UX, templates, agent architecture, skills, hooks, and end-to-end workflow friction."
trigger_phrases:
  - "004-get-it-right-main plan"
  - "get it right phase 3 plan"
importance_tier: "important"
contextType: "planning"
---
# Implementation Plan: 004-get-it-right-main Research Phase

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown plus JSONL research artifacts |
| **Framework** | Spec Kit phase workflow |
| **Storage** | Phase-local docs under `research/` |
| **Verification** | `validate.sh --strict` and `git diff --check` |

### Overview
The work sequence is: re-read the first 20 iterations and merged report, inspect the unresolved operator-facing surfaces inside `.opencode/`, author iterations `021-030`, append Phase 3 state lines, rewrite the merged research and dashboard for all 30 iterations, repair the narrow packet-shell issues the validator exposes, and then close out with an implementation summary.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase folder pre-bound to `004-get-it-right-main`
- [x] Existing Phase 1 and 2 artifacts present
- [x] `external/` treated as read-only

### Definition of Done
- [x] Iterations `021-030` written
- [x] State log, dashboard, and merged report refreshed
- [x] Packet shell validates under strict mode
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Research packet continuation with packet-local synthesis and validation

### Key Components
- **Iteration artifacts**: Ten Phase 3 markdown reports under `research/iterations/`
- **Merged synthesis**: One canonical `research/research.md` that combines all three phases
- **State and dashboard**: One append-only JSONL log plus one markdown dashboard for totals and iteration tracking
- **Packet shell**: Level 1 spec docs that keep the research folder structurally valid

### Data Flow
Existing packet context and external evidence are re-read first, then distilled into new iteration files, appended into the Phase 3 state log, merged into the canonical synthesis/dashboard pair, and finally checked through strict spec validation and whitespace hygiene.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Context Recovery
- [x] Read existing report, dashboard, state log, and representative prior iterations
- [x] Re-read `phase-research-prompt.md`
- [x] Inspect command, template, agent, skill, and hook surfaces relevant to Phase 3

### Phase 2: Research Artifacts
- [x] Write iteration files `021-030`
- [x] Append Phase 3 JSONL entries
- [x] Rewrite merged `research/research.md`
- [x] Rewrite merged `research/deep-research-dashboard.md`

### Phase 3: Verification
- [x] Repair stale packet-local references and add missing baseline docs
- [x] Run strict validation and whitespace checks
- [x] Write `implementation-summary.md`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural validation | Phase packet docs and research artifacts | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --strict <phase>` |
| Formatting sanity | Whitespace and patch hygiene | `git diff --check -- <phase>` |
| Artifact verification | Iterations, state rows, dashboard, merged report | `ls`, `sed`, `tail`, `rg` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing Phase 1 and Phase 2 artifacts | Internal | Green | Without them, Phase 3 would repeat work instead of continuing it |
| Get It Right checkout under `external/` | Internal | Green | Missing files would weaken the evidence base |
| Spec Kit validator | Internal | Green | Required for honest packet closeout |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: packet docs or merged synthesis become inconsistent, or strict validation fails after research is otherwise complete
- **Procedure**: revert only the Phase 3 packet-shell and research-artifact edits inside `004-get-it-right-main`, then rerun the closeout with corrected paths or docs
<!-- /ANCHOR:rollback -->
