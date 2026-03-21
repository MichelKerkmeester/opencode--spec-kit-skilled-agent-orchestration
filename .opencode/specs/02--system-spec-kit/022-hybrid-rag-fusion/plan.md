---
title: "Implementation Plan: 022-hybrid-rag-fusion"
description: "Root packet normalization plan for the 022 direct-child layer."
trigger_phrases:
  - "022 root plan"
  - "packet normalization plan"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Plan: 022-hybrid-rag-fusion

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, shell-based validation |
| **Framework** | system-spec-kit packet templates |
| **Storage** | Spec folder markdown only |
| **Testing** | Deferred in this pass by request |

### Overview
This pass normalizes only the 022 root packet and the root-facing phase-navigation layer for direct child packets `002-018`. It creates the missing companion docs, replaces the oversized root spec with a concise 3+ packet, and standardizes direct-child links back to the root and neighboring phases.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Root scope confirmed
- [x] Verified count and status facts already established
- [x] Target child phase list identified

### Definition of Done
- [ ] Root companion docs exist
- [ ] Root spec is concise and template-compatible
- [ ] Child `spec.md` files `002-018` include normalized phase-navigation tables
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Coordination-layer documentation normalization

### Key Components
- **Root packet docs**: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`
- **Direct child packets**: `002-018/spec.md`

### Data Flow
Read current root truths -> write concise root docs -> append or replace child phase-navigation blocks -> return touched-file inventory without validation in this pass.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Root Packet
- [x] Rewrite root `spec.md`
- [x] Add missing companion docs
- [x] Replace stale implementation summary

### Phase 2: Direct Child Navigation
- [x] Map neighboring folders for `002-018`
- [x] Normalize `Parent Spec`, `Previous Phase`, and `Next Phase` rows

### Phase 3: Handoff
- [ ] Return touched-file list
- [ ] Record residual blockers without running validation
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual readback | Root docs and child phase tables | `sed`, `tail`, `rg` |
| Formal validation | Deferred by user request | Not run |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing child packet status truth | Internal | Green | Root facts could drift if wrong |
| Direct child folder names `002-018` | Internal | Green | Navigation rows would be wrong |
| Deeper subtree cleanup | Deferred | Yellow | Full-tree validation still expected to fail later |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Root packet rewrite misstates counts or phase neighbors.
- **Procedure**: Restore the affected markdown files from git and reapply only the verified facts.
<!-- /ANCHOR:rollback -->

---

## AI Execution Protocol

### Pre-Task Checklist
- Confirm the file is in the allowed root or direct-child scope.
- Read the existing markdown before editing.
- Preserve the verified 107-count and direct-child count facts.

### Execution Rules
| Rule | Action |
|------|--------|
| AI-001 | Do not touch nested subtree files |
| AI-002 | Use explicit relative links in child phase navigation |
| AI-003 | Keep root docs concise and coordination-focused |

### Status Reporting Format
- `DONE`: markdown edit landed
- `PENDING`: follow-up validation or subtree cleanup still needed

### Blocked Task Protocol
1. Record the blocker in `tasks.md`.
2. Return the blocker explicitly in the completion summary.
3. Do not broaden scope inside this pass.
