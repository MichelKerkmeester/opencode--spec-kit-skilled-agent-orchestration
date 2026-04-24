---
title: "Implementation Plan: Doc Surface Alignment: Search Fusion Changes"
description: "The workflow starts from the packet spec, moves through a read-only verification pass on the implementation, applies surgical patches only where doc drift exists, then runs packet-local verification and strict validation before the packet is marked complete."
trigger_phrases:
  - "doc surface alignment"
  - "search fusion tuning"
  - "doc surface alignment search fusion changes"
  - "doc surface alignment plan"
  - "system spec kit"
importance_tier: "normal"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/005-doc-surface-alignment"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled frontmatter (repo-wide gap fill)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
---
title: "...ion/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/005-doc-surface-alignment/plan]"
description: "This plan performs a targeted doc-only alignment across the requested search surfaces, then closes the packet with Level 2 execution docs and strict validation. The approach keeps scope tight by editing only files that still describe stale runtime behavior."
trigger_phrases:
  - "search fusion plan"
  - "doc alignment plan"
  - "continuity profile plan"
  - "level 2 plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/005-doc-surface-alignment"
    last_updated_at: "2026-04-13T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Recorded the finished implementation plan after the search-fusion doc surfaces were aligned"
    next_safe_action: "Reuse this plan if a follow-on search doc packet opens under the same parent phase"
    blockers: []
    key_files:
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:017-phase-005-doc-surface-alignment-plan"
      session_id: "017-phase-005-doc-surface-alignment-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "How to close the packet cleanly after the doc sweep"
status: complete
---
# Implementation Plan: Doc Surface Alignment: Search Fusion Changes

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown plus TypeScript source comments as verification anchors |
| **Framework** | system-spec-kit doc and packet workflow |
| **Storage** | Repo markdown surfaces plus packet-local Level 2 docs |
| **Testing** | Focused source reads, `git diff --check`, strict packet validation |

### Overview
The plan is a doc-alignment pass, not a runtime feature build. It starts by reading the packet spec and verifying the current search behavior in code, then scans each requested surface, patches only the files that still describe stale behavior, and closes the packet with Level 2 companion docs plus strict validation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done

- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Other

### Key Components

- **Requested doc surfaces**: repo docs, command docs, skill docs, config docs, feature catalog entries, and playbook entries that describe search behavior.
- **Runtime source of truth**: search implementation files under `.opencode/skill/system-spec-kit/mcp_server/lib/search/` and adaptive fusion logic under `.opencode/skill/system-spec-kit/shared/algorithms/`.
- **Packet closeout docs**: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md`.

### Data Flow

The workflow starts from the packet spec, moves through a read-only verification pass on the implementation, applies surgical patches only where doc drift exists, then runs packet-local verification and strict validation before the packet is marked complete.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Read the packet spec first.
- [x] Verify the runtime facts for neutral length scaling, cache telemetry, continuity adaptive fusion, the raised rerank threshold, and continuity MMR lambda behavior.
- [x] Scan every requested surface and identify which files still describe stale behavior.

### Phase 2: Core Implementation

- [x] Patch repo, command, skill, config, feature catalog, and playbook docs that still describe outdated search behavior.
- [x] Leave scan-only files unchanged when they do not directly describe the changed runtime contract.
- [x] Add packet-local `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md`.

### Phase 3: Verification

- [x] Run focused `rg` sweeps and read-backs to confirm the updated contract language appears where expected.
- [x] Run `git diff --check` on the touched files.
- [x] Run strict packet validation and repair packet docs until the validator passes.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Source verification | Runtime search behavior facts | `sed`, `rg` |
| Formatting check | Patched files only | `git diff --check` |
| Packet validation | This spec folder | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Current search implementation files | Internal | Green | Doc claims would become unverifiable if runtime facts were unclear |
| Active Level 2 templates | Internal | Green | Packet docs fail strict validation if headers or markers drift |
| Requested surface list from `spec.md` | Internal | Green | Scope expands ambiguously without the explicit scan list |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A doc patch misstates runtime behavior or the packet fails strict validation after a change.
- **Procedure**: Re-read the implementation source of truth, restore the inaccurate doc section to the last accurate wording, and rerun focused verification plus strict packet validation.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 1 (Read + Scan) ──► Phase 2 (Patch + Packet Docs) ──► Phase 3 (Verify + Repair)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Read + Scan | None | Patch + Packet Docs |
| Patch + Packet Docs | Read + Scan | Verify + Repair |
| Verify + Repair | Patch + Packet Docs | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Read + Scan | Medium | 30-45 minutes |
| Patch + Packet Docs | Medium | 45-60 minutes |
| Verify + Repair | Medium | 20-30 minutes |
| **Total** | | **95-135 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [x] No runtime code changes are required for this packet
- [x] Scope is limited to the requested surfaces plus packet-local docs
- [x] Verification commands were identified before patching

### Rollback Procedure

1. Revert the inaccurate doc wording in the affected surface.
2. Re-read the runtime source of truth for the disputed behavior.
3. Re-run focused `rg` sweeps and strict packet validation.
4. Re-check packet-local summary docs so they still match the shipped edit set.

### Data Reversal

- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
