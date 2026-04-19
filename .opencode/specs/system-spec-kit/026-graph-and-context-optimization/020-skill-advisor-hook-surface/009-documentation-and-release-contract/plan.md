---
title: "Implementation Plan: Documentation + Release Contract"
description: "New hook-surface reference doc + CLAUDE.md update + runtime README updates + release checklist in 020 parent implementation-summary."
trigger_phrases:
  - "020 009 plan"
  - "skill advisor hook doc plan"
importance_tier: "critical"
contextType: "plan"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/009-documentation-and-release-contract"
    last_updated_at: "2026-04-19T14:53:13Z"
    last_updated_by: "codex"
    recent_action: "Plan executed and verified"
    next_safe_action: "Dispatch T9 integration gauntlet"
    blockers: []
    key_files: []

---
# Implementation Plan: Documentation + Release Contract

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Output** | 1 new reference doc + CLAUDE.md edit + 4 runtime READMEs + parent implementation-summary release section |
| **Skill** | sk-doc (DQI ≥ 0.85 gate) |
| **Depends on** | 006/007/008 implementation-summary.md for capability matrix |

### Overview

Doc-only final child. Aggregates artifacts from the 7 prior children into a single operator-facing reference doc. Updates CLAUDE.md Gate 2 to reference the hook as primary advisor path. Closes release contract with a release-prep section in 020's parent implementation-summary.md.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 006 + 007 + 008 merged with implementation-summary.md fields populated
- [x] sk-doc skill available

### Definition of Done
- [x] Reference doc exists + DQI ≥ 0.85
- [x] CLAUDE.md updated
- [x] 4 runtime READMEs updated (where present)
- [x] 020 parent implementation-summary.md release section filled with evidence
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Authoring-only: no code. Uses sk-doc skill for DQI compliance. Cross-references each prior child's implementation-summary.md as authoritative source.

### Key Components

```
.opencode/skill/system-spec-kit/references/hooks/
  skill-advisor-hook.md              NEW
CLAUDE.md                            EDIT — §Mandatory Tools + §Gate 2
Claude runtime README                EDIT (if present)
Gemini runtime README                EDIT (if present)
.opencode/runtime/copilot/README.md  EDIT (or equivalent)
Codex runtime README                 EDIT (if present)
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/implementation-summary.md   EDIT — release section
```

### Authoring Flow

```
gather: read 006/007/008 implementation-summary.md → capability matrix
       read 002/003/004/005 for contract + bench data
       read research.md + research-extended.md
draft: 11-section reference doc
validate: sk-doc DQI validator
edit CLAUDE.md §Gate 2
edit runtime READMEs
update 020 parent implementation-summary.md release section
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Reference doc
- [x] Gather artifacts (prior children's implementation-summary.md + research)
- [x] Draft 11 sections per spec.md §3.1
- [x] Validate via sk-doc; fix until DQI ≥ 0.85

### Phase 2: CLAUDE.md
- [x] Update §Mandatory Tools to mention hook as primary advisor path
- [x] Update §Gate 2 discussion (hook → fallback)
- [x] Add cross-reference to reference doc

### Phase 3: Runtime READMEs
- [x] Update Claude runtime README (if present)
- [x] Update Gemini runtime README
- [x] Update Copilot runtime README
- [x] Update Codex runtime README

### Phase 4: Release checklist
- [x] Fill 020 parent implementation-summary.md release-prep section
- [x] Link each item to evidence

### Phase 5: Verification
- [x] sk-doc DQI ≥ 0.85 on reference doc
- [x] Capability matrix cross-referenced child-by-child
- [x] Manual read-through for accuracy
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| DQI validation | Reference doc | sk-doc |
| Cross-reference audit | Capability matrix | Manual |
| Link check | All internal references | Manual or grep |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status |
|------------|------|--------|
| 006/007/008 implementation-summary.md | Authoritative source | Pending |
| sk-doc skill | Dev | Live |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

**Trigger**: major doc inaccuracy flagged post-merge.

**Procedure**: revert doc commit; republish after fix. No runtime impact.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Reference doc | Med | 3-4 hours |
| CLAUDE.md update | Low | 30 min |
| Runtime READMEs | Low | 1 hour |
| Release checklist | Low | 30 min |
| Verification | Low | 30 min |
| **Total** | | **5-7 hours (0.5-1 day)** |
<!-- /ANCHOR:effort -->
