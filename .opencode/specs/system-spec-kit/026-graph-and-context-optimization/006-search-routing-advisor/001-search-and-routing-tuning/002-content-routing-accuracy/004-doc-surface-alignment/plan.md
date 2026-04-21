<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
---
title: "Implementation Plan: Doc Surface Alignment for Research Content Routing Accuracy"
description: "This phase is a documentation-parity pass anchored to the shipped canonical save router. The approach is to verify runtime behavior first, patch only routing-aware surfaces, then close the phase with strict packet validation."
trigger_phrases:
  - "001 002 004 plan"
  - "doc surface alignment plan"
  - "routing doc parity plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/004-doc-surface-alignment"
    last_updated_at: "2026-04-13T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Documented the implementation plan for the routing doc-alignment pass"
    next_safe_action: "Use implementation-summary.md as the resume point for any future routing-doc follow-on"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts"
      - ".opencode/command/memory/save.md"
      - ".opencode/skill/system-spec-kit/ARCHITECTURE.md"
    session_dedup:
      fingerprint: "sha256:001-002-004-doc-surface-alignment-plan"
      session_id: "001-002-004-doc-surface-alignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "What is the safe order of operations for the doc-surface alignment pass"
---
# Implementation Plan: Doc Surface Alignment for Research Content Routing Accuracy

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON/JSONC, TypeScript runtime used as source-of-truth |
| **Framework** | OpenCode system-spec-kit docs + MCP config surfaces |
| **Storage** | File-based docs and config only |
| **Testing** | `jq`, targeted `rg`, `validate.sh --strict` |

### Overview
This phase does not change runtime behavior. It reads the shipped canonical router and save handler first, updates only the named documentation surfaces that actually describe routing behavior, and then brings the packet-local docs up to strict-validator shape so the phase can close cleanly.
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
Documentation parity pass

### Key Components
- **Runtime routing source-of-truth**: `content-router.ts` and `memory-save.ts`, which define the shipped canonical routing contract.
- **Doc surfaces**: commands, skill docs, references, feature catalog, playbook, and MCP config notes that present routing behavior to users and operators.
- **Packet-local closeout docs**: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md`.

### Data Flow
Read the runtime router and save-handler implementation, translate those verified behaviors into the routing-aware documentation surfaces, then verify both config syntax and packet-doc validity before recording completion evidence locally.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Source-of-Truth Review
- [x] Read the phase `spec.md`
- [x] Read `content-router.ts` and `memory-save.ts`
- [x] Confirm the exact routing changes that must appear in docs

### Phase 2: Doc Surface Alignment
- [x] Patch the command, architecture, skill, reference, playbook, feature-catalog, and config surfaces that describe routing behavior
- [x] Leave scanned-but-non-routing surfaces untouched
- [x] Create the packet-local execution docs required for this phase

### Phase 3: Verification
- [x] Run JSON config validation
- [x] Run targeted routing-string sweeps
- [x] Run strict packet validation and update closeout docs with evidence
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Syntax | MCP config JSON/JSONC compatibility | `jq empty` |
| Targeted parity sweep | Updated routing terminology across edited docs | `rg -n` |
| Packet validation | Level 2 packet-doc compliance for this phase | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh ... --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Shipped 018 runtime changes | Internal | Green | Without them, the doc claims cannot be verified |
| Level 2 spec templates | Internal | Green | Needed to backfill packet docs into validator-compliant shape |
| Strict validator script | Internal | Green | Required to prove the phase folder closes cleanly |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: If verification shows a doc claim disagrees with the live router or the packet docs break strict validation.
- **Procedure**: Re-read the runtime code or templates, patch only the inaccurate doc sections, and rerun the same verification commands until the packet closes cleanly.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Review runtime) ──► Phase 2 (Align docs) ──► Phase 3 (Verify + close packet)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Review runtime | User scope + parent phase spec | Doc alignment, verification |
| Align docs | Review runtime | Verification |
| Verify + close packet | Align docs | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Runtime review | Low | 20-30 minutes |
| Doc alignment | Medium | 60-90 minutes |
| Verification + packet closeout | Medium | 30-45 minutes |
| **Total** | | **110-165 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No runtime code changes are included
- [x] No stale `SPECKIT_TIER3_ROUTING` operator note is reintroduced on config surfaces
- [x] Verification commands are defined before closeout

### Rollback Procedure
1. Remove or correct the inaccurate documentation wording.
2. Re-run `jq`, `rg`, and strict packet validation.
3. Re-open the packet-local docs if the validator still flags missing anchors or evidence.
4. Only declare completion once all verification outputs are clean.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
