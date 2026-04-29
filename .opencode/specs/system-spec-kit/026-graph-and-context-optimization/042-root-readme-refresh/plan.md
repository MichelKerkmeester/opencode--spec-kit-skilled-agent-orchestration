---
title: "Implementation Plan: 042 root README refresh"
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2"
description: "Plan for verifying runtime counts, patching root README.md, and validating evergreen compliance."
trigger_phrases:
  - "042-root-readme-refresh"
  - "root readme update"
  - "framework readme refresh"
  - "tool count refresh"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/042-root-readme-refresh"
    last_updated_at: "2026-04-29T20:52:18+02:00"
    last_updated_by: "codex-gpt-5.5"
    recent_action: "Strict validation passed"
    next_safe_action: "Ready for commit"
    blockers: []
    key_files:
      - "README.md"
      - "verification-notes.md"
      - "audit-findings.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: 042 Root README Refresh

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON metadata |
| **Framework** | system-spec-kit Level 2 docs |
| **Storage** | Root README and packet-local spec docs |
| **Testing** | Evergreen grep, strict spec validator, markdown link checks |

### Overview
Verify current runtime counts from source files and directory listings, then patch only the stale README paragraphs and tables. Record count evidence and evergreen grep findings in packet-local evidence files before running strict validation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Root README read.
- [x] Evergreen packet-ID rule read.
- [x] Canonical tool and advisor schema files read.
- [x] Runtime count commands executed.

### Definition of Done
- [x] README reflects verified counts and current features.
- [x] `verification-notes.md` records count sources.
- [x] `audit-findings.md` records evergreen grep results.
- [x] Strict validator exits 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation refresh with source-count verification.

### Key Components
- **Count verification**: `TOOL_DEFINITIONS`, advisor descriptors, runtime agent directories, skill directories, and command markdown files.
- **README patching**: surgical markdown edits to existing sections.
- **Evergreen audit**: regex scan for packet-history references, with exemptions recorded only for instructional examples.
- **Validation**: strict spec-folder validation plus markdown wiki-link check.

### Data Flow
Canonical source files and directory listings produce verified numbers, README receives only current-state prose, and packet evidence captures the commands and audit results.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Verify Counts
- [x] Count `TOOL_DEFINITIONS` entries and advisor descriptors.
- [x] Count runtime agents, skills, and commands.
- [x] Record canonical numbers in `verification-notes.md`.

### Phase 2: Apply README Fixes
- [x] Replace stale tool, agent, command, and date/version references.
- [x] Add brief current-feature mentions.
- [x] Remove packet-folder hardlink from narrative README content.

### Phase 3: Verification
- [x] Run evergreen grep and record findings.
- [x] Run markdown wiki-link check.
- [x] Run strict validator.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Count verification | Tool, agent, skill, command counts | `node`, `grep`, `find`, `wc` |
| Evergreen audit | README packet-history references | `grep -nE` |
| Spec validation | Packet structure and docs | `validate.sh --strict` |
| Link check | Markdown wiki links | `rg '\[\['` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `README.md` | Internal doc | Green | Target document for refresh. |
| `tool-schemas.ts` | Internal source | Green | Canonical `spec_kit_memory` count. |
| `advisor-tool-schemas.ts` and advisor descriptors | Internal source | Green | Advisor tool breakdown. |
| `opencode.json` | Runtime config | Green | Native MCP server bindings. |
| Strict validator | Internal script | Green | Completion gate. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: README count source is wrong, evergreen audit finds narrative packet history, or strict validation fails.
- **Procedure**: Correct the affected README or packet doc section, rerun the relevant audit, then rerun strict validation.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Verify counts -> Patch README -> Audit evergreen refs -> Validate packet
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Verify Counts | None | README Patch |
| README Patch | Verify Counts | Audit |
| Audit | README Patch | Validation |
| Validation | Audit | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Verify Counts | Medium | 30 minutes |
| README Patch | Medium | 45 minutes |
| Verification | Medium | 30 minutes |
| **Total** | | **~2 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Doc-only scope confirmed.
- [x] Canonical count files read.
- [x] Existing README structure preserved.

### Rollback Procedure
1. Repair the incorrect README or packet evidence section.
2. Rerun count verification or evergreen grep as applicable.
3. Rerun strict validator.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->
