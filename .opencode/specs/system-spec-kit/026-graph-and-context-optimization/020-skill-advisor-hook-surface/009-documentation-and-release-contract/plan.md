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
    last_updated_at: "2026-04-19T09:30:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Plan scaffolded"
    next_safe_action: "Dispatch /spec_kit:implement :auto after 006/007/008 converge"
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
- [ ] 006 + 007 + 008 merged with implementation-summary.md fields populated
- [ ] sk-doc skill available

### Definition of Done
- [ ] Reference doc exists + DQI ≥ 0.85
- [ ] CLAUDE.md updated
- [ ] 4 runtime READMEs updated (where present)
- [ ] 020 parent implementation-summary.md release section filled with evidence
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
.claude/README.md                    EDIT (if present)
.gemini/README.md                    EDIT (if present)
.opencode/runtime/copilot/README.md  EDIT (or equivalent)
.codex/README.md                     EDIT (if present)
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
- [ ] Gather artifacts (prior children's implementation-summary.md + research)
- [ ] Draft 11 sections per spec.md §3.1
- [ ] Validate via sk-doc; fix until DQI ≥ 0.85

### Phase 2: CLAUDE.md
- [ ] Update §Mandatory Tools to mention hook as primary advisor path
- [ ] Update §Gate 2 discussion (hook → fallback)
- [ ] Add cross-reference to reference doc

### Phase 3: Runtime READMEs
- [ ] Update .claude/README.md (if present)
- [ ] Update .gemini/README.md
- [ ] Update Copilot runtime README
- [ ] Update .codex/README.md

### Phase 4: Release checklist
- [ ] Fill 020 parent implementation-summary.md release-prep section
- [ ] Link each item to evidence

### Phase 5: Verification
- [ ] sk-doc DQI ≥ 0.85 on reference doc
- [ ] Capability matrix cross-referenced child-by-child
- [ ] Manual read-through for accuracy
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
