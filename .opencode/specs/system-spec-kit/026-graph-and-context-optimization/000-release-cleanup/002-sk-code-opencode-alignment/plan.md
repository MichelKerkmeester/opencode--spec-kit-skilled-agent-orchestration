---
title: "Implementation Plan: sk-code-opencode Alignment"
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
description: "Audit sk-code-opencode standards against the current system-spec-kit runtime, then align docs, checklists, verifier claims, and metadata without broad behavior changes."
trigger_phrases:
  - "sk-code-opencode alignment plan"
  - "002-sk-code-opencode-alignment plan"
importance_tier: "important"
contextType: "implementation-plan"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/002-sk-code-opencode-alignment"
    last_updated_at: "2026-04-28T11:20:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Implemented alignment plan"
    next_safe_action: "Review final diff or commit"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: sk-code-opencode Alignment

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown standards docs, Python verifier, TypeScript/JavaScript evidence paths |
| **Framework** | OpenCode skills plus system-spec-kit MCP server package |
| **Storage** | Source files and spec metadata only |
| **Testing** | `verify_alignment_drift.py`, verifier unit tests if script changes, package config reads, spec validation |

### Overview

Plan a release-cleanup alignment pass over `sk-code-opencode`. The pass starts with a drift inventory across skill docs, checklists, verifier behavior, and current system-spec-kit package configuration. Implementation should then make the smallest targeted edits that remove contradictions, refresh stale evidence, and keep future OpenCode system-code edits governed by accurate standards.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Parent spec folder selected: `system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/002-sk-code-opencode-alignment`
- [x] Resource-map and skill-surface audits completed by read-only sub-agents.
- [x] Scope bounded to `sk-code-opencode` standards plus parent packet metadata.

### Definition of Done

- [x] TypeScript module-system guidance reflects current NodeNext ESM package behavior.
- [x] Verifier documentation matches script behavior or script/tests are updated.
- [x] Header examples and checklists agree per language.
- [x] OpenCode plugin ESM exemption remains explicit.
- [x] Parent release-cleanup metadata points at this child.
- [x] Verification commands pass or failures are documented as blockers.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Standards-overlay alignment, not lifecycle orchestration.

### Key Components

- **Skill surface**: primary skill instructions, README, language references, shared references, checklists.
- **Verifier surface**: `verify_alignment_drift.py`, verifier contract docs, verifier tests.
- **Evidence surface**: current system-spec-kit package config, hook docs, command-plan ownership references.
- **Packet metadata**: child docs, parent phase map, parent aggregate resource map, graph metadata.

### Data Flow

```
current runtime/config + verifier behavior
              |
              v
     standards drift inventory
              |
              v
 targeted docs/checklist/script updates
              |
              v
 verifier + tests + spec validation
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Drift Inventory

- [x] T001 Read the primary `sk-code-opencode` instructions for routing, quality gates, and quick-reference examples.
- [x] T002 Read `README.md`, shared references, and all language checklists.
- [x] T003 Read `verify_alignment_drift.py` and `test_verify_alignment_drift.py`; record what is automatically enforced.
- [x] T004 Read current MCP server `package.json` and `tsconfig.json` to confirm module-system facts.
- [x] T005 Inventory stale evidence citations and missing-path references.
- [x] T006 Inventory parent release-cleanup pointers that still name `002-feature-catalog`.

### Phase 2: Targeted Alignment

- [x] T101 Update TypeScript standards for NodeNext ESM versus legacy CommonJS boundaries.
- [x] T102 Update JavaScript/plugin guidance so CommonJS and plugin ESM rules are path-aware.
- [x] T103 Align verifier claims with actual checks, or expand verifier behavior with tests if that is the smaller honest fix.
- [x] T104 Normalize header examples across primary skill instructions, style guides, quick references, and checklists.
- [x] T105 Refresh stale evidence citations in shared references.
- [x] T106 Update parent phase map, parent resource map, and parent graph metadata for this child.

### Phase 3: Verification

- [x] T201 Run `python3 .opencode/skill/sk-code-opencode/scripts/verify_alignment_drift.py --root .opencode/skill/sk-code-opencode`
- [x] T202 If verifier code changed, run `python3 .opencode/skill/sk-code-opencode/scripts/test_verify_alignment_drift.py`
- [x] T203 Run targeted text checks for old contradictions: CommonJS TypeScript baseline, plugin `module.exports` requirement, stale `002-feature-catalog`.
- [x] T204 Run strict spec validation on this child packet.
- [x] T205 Refresh `description.json` and `graph-metadata.json` for this child and parent metadata if needed.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Verifier smoke | Changed `sk-code-opencode` scope | `verify_alignment_drift.py --root .opencode/skill/sk-code-opencode` |
| Verifier unit | Only if script changes | `test_verify_alignment_drift.py` |
| Text regression | Known stale claims and parent pointers | `rg` targeted queries |
| Spec validation | Child packet and parent phase map | `validate.sh --strict` |

The key verification distinction: if only docs/checklists change, verifier unit tests are optional. If verifier behavior changes, tests become P0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Current MCP server package config | Internal evidence | Available | Cannot update TypeScript module guidance honestly. |
| `verify_alignment_drift.py` | Internal script | Available | Cannot validate or clarify verifier claims. |
| Parent `000-release-cleanup` packet metadata | Spec metadata | Stale | Resume surfaces keep pointing at `002-feature-catalog`. |
| `sk-code-opencode` checklists | Skill assets | Available | Standards can remain inconsistent with docs. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: verifier/test failures caused by behavior changes, or standards edits that contradict live package configuration.
- **Procedure**: revert the narrow docs/script edits for the failing requirement, keep the drift inventory, and document the blocked item in the implementation summary.
- **Metadata rollback**: if parent metadata changes break validation, restore the previous parent JSON and keep only the child packet docs until metadata can be regenerated safely.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Inventory) -> Phase 2 (Alignment) -> Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Inventory | Existing skill docs and verifier script | Alignment |
| Alignment | Drift inventory | Verification |
| Verification | Alignment edits | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Drift Inventory | Medium | 45-75 min |
| Targeted Alignment | Medium | 1-2 hours |
| Verification | Low-Medium | 30-60 min |
| **Total** | | **2-4 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [ ] Confirm whether edits are docs-only or include verifier behavior.
- [ ] Run baseline verifier before script changes.
- [ ] Keep parent metadata edits separate from skill standards edits where practical.

### Rollback Procedure

1. Identify the failing validation class: verifier, script test, text regression, or spec metadata.
2. Revert the smallest affected edit group.
3. Re-run the failing command.
4. Document the deferral or blocker in the packet summary.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Source/spec docs only; use normal git diff review and targeted reverts.
<!-- /ANCHOR:enhanced-rollback -->
