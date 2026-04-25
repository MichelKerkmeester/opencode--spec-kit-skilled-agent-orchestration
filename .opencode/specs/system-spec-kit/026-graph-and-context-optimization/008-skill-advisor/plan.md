---
title: "Implementation Plan: Skill Advisor [system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/plan]"
description: "Plan for keeping the skill advisor system — search/routing tuning, skill graph + advisor unification, advisor docs and standards, smart-router, hook surface, plugin hardening, and hook improvements — as a parent with direct child phase packets."
trigger_phrases:
  - "008-skill-advisor"
  - "skill advisor"
  - "skill advisor system"
  - "skill advisor hook"
  - "search/routing tuning, skill graph and advisor unification, advisor docs and standards, smart-router, hook surface, plugin hardening, and hook improvements"
  - "001-search-and-routing-tuning"
  - "002-skill-advisor-graph"
  - "003-advisor-phrase-booster-tailoring"
  - "004-skill-advisor-docs-and-code-alignment"
  - "005-smart-router-remediation-and-opencode-plugin"
  - "006-deferred-remediation-and-telemetry-run"
  - "007-skill-advisor-hook-surface"
  - "008-skill-graph-daemon-and-advisor-unification"
  - "009-skill-advisor-plugin-hardening"
  - "010-skill-advisor-standards-alignment"
  - "011-skill-advisor-hook-improvements"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-skill-advisor"
    migration_aliases:
      - "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor"
    last_updated_at: "2026-04-25T11:50:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "2026-04-25 second consolidation: merged 006-search-routing-advisor root + 5 advisor children from 010-hook-package into 008-skill-advisor"
    next_safe_action: "Use context-index.md for local phase navigation"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:78948a62f471e1a3e48d82f2f6c39d36aff20389f67538011b4eb877166431ff"
      session_id: "026-phase-root-flatten-2026-04-21"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
---
# Implementation Plan: Skill Advisor

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
This parent groups the full skill advisor system as direct child folders: `001-search-and-routing-tuning/`, `002-skill-advisor-graph/`, `003-advisor-phrase-booster-tailoring/`, `004-skill-advisor-docs-and-code-alignment/`, `005-smart-router-remediation-and-opencode-plugin/`, `006-deferred-remediation-and-telemetry-run/`, `007-skill-advisor-hook-surface/`, `008-skill-graph-daemon-and-advisor-unification/`, `009-skill-advisor-plugin-hardening/`, `010-skill-advisor-standards-alignment/`, and `011-skill-advisor-hook-improvements/`. It keeps the active theme concise while avoiding an extra archive layer and consolidates advisor work that previously lived under both `006-search-routing-advisor/` and `010-hook-package/`.
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
| Root nine-phase map | Internal | Green | Parent would not have an active navigation role |
| Child phase folders | Internal | Green | Historical context would be incomplete |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Active parent validation fails in a way that cannot be repaired without changing child packet history.
- **Procedure**: Restore the previous folder layout and parent docs from version control.
<!-- /ANCHOR:rollback -->
