<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
---
title: "Implementation Plan: Phase 015 Full Playbook Execution"
description: "Run the system-spec-kit manual playbook against the current Phase 006 codebase, capture packet-local evidence, and pair that with automated-suite failure signals."
trigger_phrases:
  - "phase 015 plan"
  - "full playbook execution plan"
  - "manual playbook execution"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/003-playbook-and-remediation/002-full-playbook-execution"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Completed the Phase 015 execution plan and packet reporting pass"
    next_safe_action: "Address the two automated-suite failures or expand manual automation coverage"
    blockers:
      - "handler-helpers mock no longer exports resolveDatabasePaths"
      - "spec-doc-structure strict fixture now exits 2 instead of 0"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:phase015-plan"
      session_id: "phase015-full-playbook"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Can the existing runner execute the live playbook format end to end"
---
# Implementation Plan: Phase 015 Full Playbook Execution

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js |
| **Framework** | Vitest + packet-local markdown reporting |
| **Storage** | Disposable fixture SQLite DBs plus packet scratch JSON |
| **Testing** | Manual runner + Vitest |

### Overview
This phase executes the live `system-spec-kit` playbook inventory rather than trusting earlier audit counts or stale packet notes. The plan keeps code changes narrow: fix the runner only where it blocks truthful execution, then record exactly what the current tool surfaces can and cannot automate.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All active playbook files classified
- [x] Requested automated suite command executed
- [x] Packet docs updated with real evidence
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Packet-local verification audit

### Key Components
- **Manual runner**: parses scenario docs, seeds a disposable fixture, dispatches direct handler calls, and writes packet-local JSON results.
- **Automated suite**: runs the Vitest surfaces configured by `mcp_server/vitest.config.ts`.
- **Phase packet docs**: summarize the execution outcome and make the blockers explicit.

### Data Flow
Playbook markdown feeds the manual runner, which seeds the fixture DB, invokes handlers, and emits JSON/JSONL into this phase scratch folder. Packet docs then summarize those artifacts alongside the automated-suite output.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Inspect live playbook inventory and current packet state
- [x] Read the existing runner and fixture before editing

### Phase 2: Core Implementation
- [x] Retarget runner output to Phase 015
- [x] Extend parser support for current prose-style scenario files
- [x] Rerun until all active playbook files are accounted for

### Phase 3: Verification
- [x] Run the requested automated suite command
- [x] Capture the first failing automated wave with a stable rerun
- [x] Write plan, tasks, checklist, and implementation summary
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Build | Final runner patches | `npm run build` |
| Automated | Packet-requested suite plus per-file failure isolation | Vitest |
| Manual | All active playbook scenario files | `manual-playbook-runner.ts` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `mcp_server/dist` handlers | Internal | Green | Runner cannot dispatch live handlers without them |
| `scripts/node_modules/vitest` | Internal | Green | Automated verification would be unavailable |
| Fixture embeddings provider | Internal | Green | Manual runner setup would fail |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Runner patches introduce build failures or corrupt packet-local reporting
- **Procedure**: Revert the two runner/fixture edits, rerun `npm run build`, and restore the previous packet docs from git if needed
<!-- /ANCHOR:rollback -->
