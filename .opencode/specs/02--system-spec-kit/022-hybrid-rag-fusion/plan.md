---
title: "Implementation Plan: 022-hybrid-rag-fusion"
description: "Root packet normalization plan for the 022 coordination layer and direct-child navigation."
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
| **Language/Stack** | Markdown and shell-based validation |
| **Framework** | system-spec-kit packet templates |
| **Storage** | Spec-folder markdown only |
| **Testing** | Focused spec validation |

### Overview
This pass normalizes the 022 root packet and its direct-child navigation layer. It keeps the root packet concise, syncs counts and status to the live tree, and leaves deeper subtree rewrites explicit rather than implicit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Root scope confirmed
- [x] Verified count and status facts available
- [x] Direct child phase inventory identified

### Definition of Done
- [x] Root packet validates at the parent level with warnings only
- [x] Direct-child navigation remains validator-friendly
- [x] Residual subtree debt is documented truthfully
<!-- /ANCHOR:quality-gates -->

---

### AI Execution Protocol

### Pre-Task Checklist
- Confirm the edit scope is limited to the 022 packet family and requested child packet layers.
- Read the touched packet docs before rewriting them.
- Re-check live phase counts and statuses before summarizing them in the root packet.
- Run focused validation after structural packet edits.

### Execution Rules

| Rule ID | Rule | Why |
|---------|------|-----|
| ROOT-SEQ-001 | Rewrite the root packet before final validation | Validation should reflect the current packet shape |
| ROOT-SCOPE-001 | Keep changes inside the 022 packet family | The task is packet-family normalization, not runtime code work |
| ROOT-TRUTH-001 | Use live child packet metadata as the source of truth | Root summaries must not flatten or invent packet state |

### Status Reporting Format
- Report the root and child packet files changed.
- Report the focused validator results for the root and `001` parent packets.
- Separate root-level closure from remaining subtree debt.

### Blocked Task Protocol
- If validation reports parent-level structural errors, patch the parent docs and re-run validation.
- If validation reports deeper child drift, record it explicitly and keep the root packet truthful about the residual work.

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Coordination-layer documentation normalization

### Key Components
- **Root packet docs**: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`
- **Direct child packets**: direct child packet specs for phases `002` through `020`

### Data Flow
Read the live tree -> reconcile root facts -> normalize root docs -> preserve direct-child navigation truth -> validate the parent packet.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Root Packet Truth
- [x] Reconcile counts and direct-phase statuses against the live tree
- [x] Keep the root spec concise and template-compatible
- [x] Remove broken doc references created by historical wording

### Phase 2: Direct Child Navigation
- [x] Normalize root-facing phase navigation for direct child packets
- [x] Keep neighboring direct-phase references consistent

### Phase 3: Verification
- [x] Re-run focused root validation
- [x] Record residual subtree blockers if they remain
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Focused parent validation | Root packet only | `validate.sh --no-recursive` |
| Spot readback | Root and direct child docs | `sed`, `rg` |

Acceptance rule: the root packet must pass without structural errors, and any remaining warnings must describe real residual work rather than stale metadata drift.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing child packet status truth | Internal | Green | Root facts could drift if wrong |
| Direct child folder names and order | Internal | Green | Navigation rows would be wrong |
| Deeper subtree cleanup | Deferred | Yellow | Full-tree normalization remains incomplete |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Root packet rewrite misstates counts, status, or direct-child navigation.
- **Procedure**: Restore the affected markdown files from git, then reapply only the verified tree facts.
<!-- /ANCHOR:rollback -->

---

## 8. COMMUNICATION PLAN

- Record root validator results in the root packet checklist and implementation summary.
- Keep residual subtree warnings scoped to the affected child packet family instead of inflating the root status.
- Use the root packet as the entry point for future normalization passes in `001`, `009`, and `014`.
