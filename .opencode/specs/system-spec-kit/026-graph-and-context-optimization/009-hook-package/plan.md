---
title: "Implementation Plan: Hook Package [system-spec-kit/026-graph-and-context-optimization/009-hook-package/plan]"
description: "Plan for the hook-package parent holding 14 direct child phase packets covering skill-advisor hook surface, skill-graph daemon, cross-runtime hook parity, plugin-loader hardening, writer wiring, and code-graph hook improvements."
trigger_phrases:
  - "009-hook-package"
  - "hook-package"
  - "hook daemon parity"
  - "skill graph daemon, hook parity, plugin/runtime parity, and parity remediation"
  - "001-skill-advisor-hook-surface"
  - "002-skill-graph-daemon-and-advisor-unification"
  - "003-hook-parity-remediation"
  - "004-copilot-hook-parity-remediation"
  - "005-codex-hook-parity-remediation"
  - "006-claude-hook-findings-remediation"
  - "007-opencode-plugin-loader-remediation"
  - "008-skill-advisor-plugin-hardening"
  - "009-skill-advisor-standards-alignment"
  - "010-copilot-wrapper-schema-fix"
  - "011-copilot-writer-wiring"
  - "012-docs-impact-remediation"
  - "013-code-graph-hook-improvements"
  - "014-skill-advisor-hook-improvements"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-package"
    last_updated_at: "2026-04-24T17:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Packet renamed to 009-hook-package (prior slug: hook+daemon+parity); 388 path refs + 7 slug/title residues rewritten; frontmatter resynced to 14 direct children"
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
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
---
# Implementation Plan: Hook Daemon Parity

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
This parent groups `001-skill-advisor-hook-surface/`, `002-skill-graph-daemon-and-advisor-unification/`, `003-hook-parity-remediation/`, `004-copilot-hook-parity-remediation/`, `005-codex-hook-parity-remediation/`, `006-claude-hook-findings-remediation/`, `007-opencode-plugin-loader-remediation/`, `008-skill-advisor-plugin-hardening/`, `009-skill-advisor-standards-alignment/`, `010-copilot-wrapper-schema-fix/`, and `011-copilot-writer-wiring/` as direct child folders. It keeps the active theme concise while avoiding an extra archive layer.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Original phase list identified.
- [x] Existing child packets preserved before consolidationing.
- [x] Root consolidation map available.

### Definition of Done
- [x] Child packets moved to direct phase-root children.
- [x] `context-index.md` records status, summaries, open items, and current paths.
- [x] Metadata files parse after path updates.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Active thematic parent over direct child phase packets.

### Key Components
- **Parent docs**: active spec, plan, tasks, implementation summary, and context index.
- **Direct children**: original phase packet folders.
- **Migration metadata**: aliases and migration fields in moved metadata JSON.

### Data Flow
Root navigation points to this parent. The parent points to child folders directly. Metadata aliases preserve old packet IDs for graph and memory traversal.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read source packet roots.
- [x] Capture status and summary evidence.

### Phase 2: Core Implementation
- [x] Move child packets to direct children.
- [x] Regenerate parent docs and context bridge.
- [x] Migrate hook-specific remediation packets from the former deep-review parent into this parent as children 004-006.
- [x] Migrate skill-advisor / plugin-loader infrastructure packets from the former deep-review parent into this parent as children 007-009.
- [x] Migrate Copilot wrapper schema and writer-wiring packets from the former deep-review parent into this parent as children 010-011.

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
| Root eleven-phase map | Internal | Green | Parent would not have an active navigation role |
| Child phase folders | Internal | Green | Historical context would be incomplete |
| Migrated hook remediation packets | Internal | Green | Runtime-specific hook remediation would remain split across the wrong parent |
| Migrated skill-advisor / plugin-loader packets | Internal | Green | OpenCode loader and skill-advisor infrastructure would remain split across the wrong parent |
| Migrated Copilot wrapper packets | Internal | Green | Copilot hook schema and writer wiring would remain split across the wrong parent |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Active parent validation fails in a way that cannot be repaired without changing child packet history.
- **Procedure**: Restore the previous folder layout and parent docs from version control.
<!-- /ANCHOR:rollback -->
