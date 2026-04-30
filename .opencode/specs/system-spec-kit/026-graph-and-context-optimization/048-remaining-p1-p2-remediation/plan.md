---
title: "Implementation Plan: 048 Remaining P1/P2 Remediation"
description: "Plan for conservative remediation of the remaining P1/P2 release-readiness backlog after packet 046."
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
trigger_phrases:
  - "048-remaining-p1-p2-remediation"
  - "P1 P2 backlog"
  - "release polish"
  - "conservative defaults pass"
importance_tier: "important"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/048-remaining-p1-p2-remediation"
    last_updated_at: "2026-04-30T00:00:00+02:00"
    last_updated_by: "codex"
    recent_action: "Planned remediation"
    next_safe_action: "Run verification"
    blockers: []
    key_files:
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:048-plan"
      session_id: "048-remaining-p1-p2-remediation"
      parent_session_id: "026-graph-and-context-optimization"
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 048 Remaining P1/P2 Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Bash, Markdown, YAML |
| **Framework** | MCP server, Vitest, Spec Kit validator |
| **Storage** | SQLite-backed memory and graph stores |
| **Testing** | `npm run build`, targeted `npx vitest`, strict validator |

### Overview

Apply the backlog in risk order: source-report read, doc quick wins, design
defaults, surgical engineering work, P2 sweep, then verification. The plan
optimizes for correctness and traceability over breadth; anything that needs a
larger design call is deferred with a specific follow-up note.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done

- [ ] Remediation log covers all requested P1 items
- [ ] Tests passing for affected code paths
- [ ] Strict validator passes on this packet
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Surgical remediation packet.

### Key Components

- **Command docs and YAML**: Align autonomous modes and memory command contracts.
- **MCP server runtime**: Strengthen schema validation, memory health, retention, and deep-loop checks.
- **Validator scripts**: Improve JSON diagnostics and explicit legacy policy.
- **Catalog/playbook docs**: Add missing current tool coverage.
- **Packet docs**: Record decisions, outcomes, deferrals, and verification.

### Data Flow

046 synthesis identifies findings. Source review reports supply evidence. Code
and doc edits address each bounded finding. Packet ledgers preserve the mapping
from finding ID to outcome and verification.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Source Read

- [x] Read 046 synthesis and remediation log
- [x] Read all 10 review reports
- [x] Read evergreen packet ID rule

### Phase 2: Beta Doc Fixes

- [x] Patch OpenCode/Codex hook docs
- [x] Patch tool counts, advisor docs, Node floor docs
- [x] Add Skill Graph catalog and playbook entries
- [x] Repair local release-note link

### Phase 3: Gamma Defaults

- [x] Remove auto-mode waits from plan/complete auto variants
- [x] Document markdown-only memory command contracts
- [x] Align `/memory:save` to plan-only default
- [x] Implement retention cache-delete default
- [x] Keep hidden planner inputs internal-only with JSDoc
- [x] Extend governed-ingest validation entry points
- [x] Validate MCP args before pre-dispatch behavior
- [x] Grandfather legacy strict-warning packet explicitly

### Phase 4: Engineering Work

- [x] Add memory health consistency object
- [x] Add file-backed retention multi-connection test
- [x] Align deep-review failure taxonomy and JSONL schema validation
- [x] Support VS Code `servers` and `mcpServers` doctor shapes

### Phase 5: P2 Sweep

- [x] Apply safe doc/code P2s adjacent to touched files
- [x] Document deferred P2s

### Phase 6: Verification

- [ ] Build passes
- [ ] Targeted tests pass
- [ ] Strict validators pass
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Build | MCP server TypeScript | `npm run build` |
| Unit | Retention, schema, deep-loop, doctor-adjacent runtime changes | `npx vitest run <affected files>` |
| Validator | Packet docs and touched legacy packet | `validate.sh --strict` |
| Static | Evergreen grep and link checks where practical | `rg`, shell probes |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 046 synthesis | Internal | Green | Backlog source unavailable |
| Review reports | Internal | Green | Evidence citations unavailable |
| Normal-shell hook test | Operator | Red | 045/005-P1-1 remains deferred |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Build, targeted tests, or strict validators fail in a way that cannot be repaired inside scope.
- **Procedure**: Revert this packet's touched files as a single integration unit and keep the packet docs as failure evidence for the next remediation pass.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Source read -> Beta docs -> Gamma defaults -> Engineering -> P2 sweep -> Verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Source read | None | All remediation |
| Beta docs | Source read | Verification |
| Gamma defaults | Source read | Engineering |
| Engineering | Gamma defaults | Verification |
| P2 sweep | Source read | Verification |
| Verify | All implementation | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Source read | Medium | 1 hour |
| Docs | Medium | 1-2 hours |
| Design defaults | Medium | 1-2 hours |
| Engineering | High | 2-4 hours |
| Verification | Medium | 1 hour |
| **Total** | | **6-10 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [ ] Build passed
- [ ] Targeted tests passed
- [ ] Strict validation passed

### Rollback Procedure

1. Revert touched runtime files from this packet.
2. Revert packet-local docs if the packet is abandoned.
3. Re-run the failing verification command to confirm rollback.
4. Preserve failure details in the orchestrator handoff.

### Data Reversal

- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
