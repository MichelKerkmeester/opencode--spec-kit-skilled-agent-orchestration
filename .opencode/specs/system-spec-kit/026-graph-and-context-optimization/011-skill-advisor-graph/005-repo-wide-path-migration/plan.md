---
title: "Implementation Plan: Repo-Wide Path Migration"
description: "Packet-closeout plan for restoring Level 3 structure, attaching current repo evidence, and finishing the Phase 005 documentation surface without touching non-spec files."
trigger_phrases:
  - "005-repo-wide-path-migration"
  - "path migration plan"
  - "packet closeout plan"
importance_tier: "important"
contextType: "implementation"
status: complete
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-skill-advisor-graph/005-repo-wide-path-migration"
    last_updated_at: "2026-04-13T00:00:00Z"
    last_updated_by: "gpt-5"
    recent_action: "Replaced the packet plan with the active Level 3 structure"
    next_safe_action: "Sync tasks, checklist, and closeout evidence to this plan"
    key_files: ["plan.md", "tasks.md", "checklist.md"]
---
# Implementation Plan: Repo-Wide Path Migration

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown and JSON packet artifacts with Python-based runtime verification |
| **Framework** | system-spec-kit Level 3 packet validation |
| **Storage** | Packet-local markdown plus `graph-metadata.json` |
| **Testing** | Strict packet validation, scoped grep, health check, compiler metadata validation, regression suite |

### Overview

The repo-wide path migration is already implemented outside this packet. The plan for Phase 005 is therefore a closeout plan, not a code-delivery plan: restore the packet to the active Level 3 scaffold, record the shipped evidence honestly, repair packet metadata, and remove forbidden literal legacy path tokens from the full `011-skill-advisor-graph/` tree.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] The packet path is confirmed: `005-repo-wide-path-migration/`.
- [x] The target scope is limited to spec-doc and packet-JSON files.
- [x] The required Level 3 scaffold was read from `templates/level_3/`.
- [x] Current repo evidence exists for playbooks, READMEs, graph metadata, and runtime checks.

### Definition of Done

- [x] Strict packet validation exits `0` or `1`.
- [x] Forbidden legacy literals are absent from the full `011-skill-advisor-graph/` root.
- [x] Packet docs and packet metadata match the shipped repo state.
- [x] The packet contains `decision-record.md` and `implementation-summary.md`.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Spec-first closeout with evidence-backed completion.

### Key Components

- **Packet docs**: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md` provide the canonical closeout narrative.
- **Packet metadata**: `graph-metadata.json` and `description.json` provide retrieval and packet-identity support.
- **Evidence sources**: README files, playbook docs, skill-advisor graph metadata, and runtime command output prove the migration already shipped.

### Data Flow

Template requirements drive document structure. Repo reads and command output provide evidence. Packet docs then summarize that evidence, and strict validation confirms the packet is structurally usable again.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Read the Level 3 templates and current packet docs.
- [x] Inspect packet validation failures and the scoped forbidden-path grep output.
- [x] Confirm that the shipped repo state already covers playbooks, READMEs, changelog note, runtime verification, and skill graph metadata.

### Phase 2: Core Implementation

- [x] Rewrite packet docs onto the required template headers and anchor structure.
- [x] Add the missing Level 3 files.
- [x] Normalize packet metadata JSON.
- [x] Rephrase historical notes in sibling 007 packet docs so the forbidden literals disappear from the full root.

### Phase 3: Verification

- [x] Run strict packet validation after each major spec-doc update.
- [x] Run scoped grep across `011-skill-advisor-graph/`.
- [x] Re-run the skill-advisor health, metadata validation, and regression commands.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Packet template compliance and file presence | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <packet> --strict` |
| Repository evidence | Shipped path usage in playbooks and READMEs | `rg`, `view` |
| Runtime | Skill-advisor entrypoint and metadata validation | `python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py --health`, `python3 .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py --validate-only` |
| Regression | Skill-advisor behavior after migration | `python3 .opencode/skill/skill-advisor/scripts/skill_advisor_regression.py --dataset .opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `../../../../../skill/skill-advisor/README.md` | Internal evidence source | Green | README completion cannot be marked honestly |
| `../../../../../skill/README.md` | Internal evidence source | Green | Parent skill documentation state becomes unknown |
| `../../../../../skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md` | Internal evidence source | Green | Playbook completion cannot be verified |
| `../../../../../skill/skill-advisor/graph-metadata.json` | Internal evidence source | Green | Metadata completion evidence is incomplete |
| `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh` | Internal validation tool | Green | Packet closeout cannot be validated |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A packet rewrite introduces validation errors, bad cross-references, or an inaccurate completion claim.
- **Procedure**: Revert the affected packet docs or packet JSON, restore the last validated state, and rerun strict validation before proceeding.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Implementation) ──► Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation, Verification |
| Implementation | Setup | Verification |
| Verification | Setup, Implementation | Packet closeout |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 30-45 minutes |
| Core Implementation | Medium | 90-120 minutes |
| Verification | Medium | 30-60 minutes |
| **Total** | | **2.5-3.75 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-closeout Checklist

- [x] Packet edits remain inside the allowed spec-doc and packet-JSON surface.
- [x] Repo evidence was gathered before completion status changed.
- [x] Strict validation was rerun after each major document update.

### Rollback Procedure

1. Restore the last known-good packet docs.
2. Reapply only the minimal packet-local changes.
3. Re-run strict validation and scoped grep.
4. Re-check any runtime evidence claimed in the packet.

### Data Reversal

- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
README evidence ─┐
Playbook evidence ├──► Packet docs ───► Strict validation
Runtime evidence ─┘            │
Packet metadata ───────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Packet docs | Templates, repo evidence | Canonical closeout narrative | Validation |
| Packet metadata | Packet docs | Searchable packet identity | Validation, resume quality |
| Runtime checks | Migrated skill-advisor scripts | Closeout evidence | Checklist and implementation summary |
| Strict validation | Packet docs, packet metadata | Final closure signal | Completion claim |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Restore spec/plan/tasks/checklist structure** - critical because all later validation depends on it.
2. **Add the missing closeout files** - critical because Level 3 file presence gates validation.
3. **Normalize packet metadata and remove forbidden literals from 007** - critical because grep-zero and schema checks both gate completion.
4. **Run final validation and runtime verification** - critical because the packet cannot close on assumptions.

**Total Critical Path**: 4 sequential closeout stages.

**Parallel Opportunities**:
- Historical-note rephrasing and packet metadata normalization can happen while packet docs are being rewritten.
- README evidence review and runtime commands can run independently once the doc rewrite is stable.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Packet scaffold restored | Required headers and anchors exist in the four core docs | Phase 2 |
| M2 | Closeout files and metadata added | Level 3 file set and packet schema are complete | Phase 2 |
| M3 | Phase 005 closed honestly | Strict validation and scoped grep pass, with runtime evidence attached | Phase 3 |
<!-- /ANCHOR:milestones -->
