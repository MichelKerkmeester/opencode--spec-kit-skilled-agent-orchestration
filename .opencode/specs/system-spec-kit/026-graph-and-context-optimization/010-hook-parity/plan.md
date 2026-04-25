---
title: "Implementation Plan: Hook Parity [system-spec-kit/026-graph-and-context-optimization/010-hook-parity/plan]"
description: "Plan for the hook-parity parent holding 8 direct child phase packets covering runtime hook parity across Claude / Codex / Copilot / OpenCode plugin: schema fixes, wiring fixes, and parity remediations."
trigger_phrases:
  - "010-hook-parity"
  - "hook parity"
  - "runtime hook parity"
  - "claude codex copilot opencode hook parity"
  - "001-hook-parity-remediation"
  - "002-copilot-hook-parity-remediation"
  - "003-codex-hook-parity-remediation"
  - "004-claude-hook-findings-remediation"
  - "005-opencode-plugin-loader-remediation"
  - "006-copilot-wrapper-schema-fix"
  - "007-copilot-writer-wiring"
  - "008-docs-impact-remediation"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-hook-parity"
    last_updated_at: "2026-04-25T11:50:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "2026-04-25 second consolidation: 7 children moved out (5 to 008-skill-advisor, 2 to 007-code-graph); renamed from 010-hook-package; 8 hook-parity children renumbered 001-008"
    next_safe_action: "Run validate.sh --strict on the packet, then refresh DB via generate-context.js to re-index under the new slug"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:fdc4f6fc83631204f3d20540a8c5d32fbf2d6c997be340a007a3e4d4b50a03a9"
      session_id: "026-phase-root-flatten-2026-04-21"
      parent_session_id: null
    completion_pct: 85
    open_questions: []
    answered_questions: []
    migration_aliases:
      - "system-spec-kit/026-graph-and-context-optimization/009-hook-package"
      - "system-spec-kit/026-graph-and-context-optimization/010-hook-package"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
---
# Implementation Plan: Hook Parity

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown and JSON metadata |
| **Framework** | Spec Kit Level 1 parent inside Level 3 root packet |
| **Storage** | Direct child phase folders |
| **Testing** | Strict parent validation and JSON parse checks |

### Overview
This parent groups `001-hook-parity-remediation/`, `002-copilot-hook-parity-remediation/`, `003-codex-hook-parity-remediation/`, `004-claude-hook-findings-remediation/`, `005-opencode-plugin-loader-remediation/`, `006-copilot-wrapper-schema-fix/`, `007-copilot-writer-wiring/`, and `008-docs-impact-remediation/` as direct child folders. Scope is narrow: runtime hook parity across Claude / Codex / Copilot / OpenCode plugin — schema fixes, wiring fixes, and parity remediations.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Hook-parity phase list identified.
- [x] Existing child packets preserved before consolidation.
- [x] Root consolidation map available.

### Definition of Done
- [x] Hook-parity child packets placed as direct phase-root children 001-008.
- [x] `context-index.md` records status, summaries, open items, and current paths for all 8 children.
- [x] Metadata files parse after path updates.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Active thematic parent over direct child phase packets, scoped to runtime hook parity.

### Key Components
- **Parent docs**: active spec, plan, tasks, implementation summary, and context index.
- **Direct children**: 8 hook-parity phase packet folders.
- **Migration metadata**: aliases and migration fields in moved metadata JSON.

### Data Flow
Root navigation points to this parent. The parent points to the 8 hook-parity child folders directly. Metadata aliases preserve old packet IDs (including prior `009-hook-package` and `010-hook-package` slugs) for graph and memory traversal.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read source packet roots for hook-parity remediations.
- [x] Capture status and summary evidence.

### Phase 2: Core Implementation
- [x] Move hook-parity child packets to direct children 001-008.
- [x] Regenerate parent docs and context bridge.
- [x] Migrate central + per-runtime hook-parity remediation packets into this parent (Copilot, Codex, Claude, OpenCode plugin loader).
- [x] Migrate Copilot wrapper schema and writer-wiring packets into this parent as children 006-007.
- [x] Place documentation impact remediation packet as child 008.

### Phase 3: Verification
- [x] Validate parent structure.
- [x] Parse migrated metadata JSON.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structure | Parent docs | `validate.sh --strict --no-recursive` |
| Metadata | JSON files | `JSON.parse` scan |
| Continuity | Old phase names and paths | `context-index.md` review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Root phase map | Internal | Green | Parent would not have an active navigation role |
| Hook-parity child phase folders | Internal | Green | Historical hook-parity context would be incomplete |
| Migrated per-runtime hook remediation packets | Internal | Green | Runtime-specific hook remediation would remain split across the wrong parent |
| Migrated Copilot wrapper packets | Internal | Green | Copilot hook schema and writer wiring would remain split across the wrong parent |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Active parent validation fails in a way that cannot be repaired without changing child packet history.
- **Procedure**: Restore the previous folder layout and parent docs from version control.
<!-- /ANCHOR:rollback -->
