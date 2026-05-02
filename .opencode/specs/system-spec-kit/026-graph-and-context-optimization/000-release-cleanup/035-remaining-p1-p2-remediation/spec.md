---
title: "Feature Specification: 048 Remaining P1/P2 Remediation"
description: "Works through the remaining P1 and P2 release-readiness findings after packet 046. Applies conservative fixes where scope is clear, records Tier gamma defaults, and defers operator-only or larger P2 work."
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
trigger_phrases:
  - "035-remaining-p1-p2-remediation"
  - "P1 P2 backlog"
  - "release polish"
  - "conservative defaults pass"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/035-remaining-p1-p2-remediation"
    last_updated_at: "2026-04-30T00:00:00+02:00"
    last_updated_by: "codex"
    recent_action: "Completed packet"
    next_safe_action: "Orchestrator commit"
    blockers: []
    key_files:
      - "spec.md"
      - "remediation-log.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "035-remaining-p1-p2-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Tier gamma defaults are conservative and documented."
---
# Feature Specification: 048 Remaining P1/P2 Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-30 |
| **Branch** | `035-remaining-p1-p2-remediation` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Packet 046 fixed the release-blocking P0s and a small Tier beta set, but 24 P1
findings and 15 P2 findings remained in the release-readiness synthesis. The
remaining work spans docs, command contracts, validator output, memory
consistency, schema governance, deep-loop validation, and operability.

### Purpose

Apply conservative, source-cited remediation for clear P1/P2 findings and
record deferrals where the requested fix is operator-only or would expand beyond
the packet scope.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Tier beta 5 and beta 6 doc fixes from 046 synthesis.
- Tier gamma conservative defaults with explicit decision rationale.
- Surgical Tier delta code/test changes where the fix is bounded.
- P2 fixes that are doc-only, under 10 lines, or directly adjacent to touched code.
- Packet-local remediation log, decision record, deferred P2 ledger, and verification docs.

### Out of Scope

- Normal-shell hook verdicts for 045/005-P1-1 because the sandbox cannot supply
  live runtime evidence.
- Broad P2 work that requires a design call or substantial code changes.
- Re-fixing the 046 Tier beta items already listed in 046 remediation log.
- Git commit or PR creation because the orchestrator owns integration.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/command/**` | Modify | Command contract and doctor workflow updates |
| `.opencode/skill/system-spec-kit/**` | Modify/Create | Docs, validator, memory, schema, deep-loop, catalog, playbook updates |
| `.opencode/plugins/spec-kit-skill-advisor.js` | Modify | OpenCode missing-prompt diagnostic |
| `README.md` | Modify | Broken local release-note link repair |
| `specs/.../005-memory-indexer-invariants/graph-metadata.json` | Modify | Legacy grandfather flag |
| `specs/.../035-remaining-p1-p2-remediation/` | Create | Packet docs and ledgers |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Do not re-apply items already fixed by packet 046 | Remediation log marks 046-fixed IDs as skipped |
| REQ-002 | Keep evergreen docs free of packet-history references | Evergreen edits use current runtime anchors instead of packet IDs |
| REQ-003 | Verify build, targeted tests, and strict packet validation | Verification table records command results |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | Apply Tier beta doc and completeness fixes | Remediation log records each beta finding outcome |
| REQ-011 | Apply Tier gamma conservative defaults | `decision-record.md` records ID, default, rationale, and alternative |
| REQ-012 | Apply bounded Tier delta engineering fixes | Code changes compile and affected tests pass |
| REQ-013 | Walk P2 backlog safely | Safe P2s applied and larger/design-call P2s recorded in `deferred-p2.md` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `remediation-log.md` shows an outcome for each requested P1 item.
- **SC-002**: `decision-record.md` documents every Tier gamma conservative default.
- **SC-003**: `deferred-p2.md` lists P2 items that were not safe to auto-apply.
- **SC-004**: `npm run build`, affected Vitest files, and strict validation pass or any failure is recorded with evidence.

### Acceptance Scenarios

1. **Doc quick wins**: **Given** the Tier beta doc findings, the touched evergreen docs describe current runtime behavior without packet-history references.
2. **Design defaults**: **Given** a Tier gamma finding, `decision-record.md` names the default, rationale, and rejected alternative.
3. **Engineering fixes**: **Given** an affected runtime path, targeted build and Vitest checks pass after the change.
4. **P2 deferral**: **Given** a P2 requiring a design call or larger code change, `deferred-p2.md` records why it was not auto-applied.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 046 synthesis and review reports | Wrong source interpretation could mis-fix findings | Read all 10 review reports and cite finding IDs |
| Risk | Large backlog touches many surfaces | Scope drift and unrelated refactors | Keep edits finding-bound and defer broad P2s |
| Risk | Validator and MCP schema changes can break build | Release gate fails | Run build and targeted tests before completion |
| Dependency | Normal-shell hook evidence | Sandbox cannot produce live CLI verdicts | Record operator-only action |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Pre-dispatch validation must not add tool-side mutations before schema rejection.
- **NFR-P02**: Memory health consistency checks must remain read-only unless `autoRepair` is confirmed.

### Security

- **NFR-S01**: Destructive or governance-sensitive surfaces must preserve existing confirmation and provenance gates.
- **NFR-S02**: Runtime config docs must not imply permissive local profiles are general install defaults.

### Reliability

- **NFR-R01**: Strict validator JSON output must include operator-actionable details and remediation fields.
- **NFR-R02**: Legacy grandfathering must be explicit in metadata, not implicit path allowlisting.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries

- Empty P2 safe-fix set: record all P2s in `deferred-p2.md`.
- Legacy packet validation: strict warnings remain visible even when grandfathered.
- Missing embedding cache table: retention delete should still delete primary rows.

### Error Scenarios

- Build failure: stop and record failing command output.
- Test failure: stop and record failed suite.
- Strict validator failure: patch packet docs or record blocker.

### State Transitions

- Partial P1 coverage: remediation log must identify partial versus complete.
- Operator-only hook evidence: deferred until normal-shell run.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 22/25 | Many docs plus several MCP/runtime files |
| Risk | 18/25 | Validator, schema, memory, and deep-loop code touched |
| Research | 18/20 | Requires 046 synthesis and 10 source reports |
| **Total** | **58/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. Conservative defaults were supplied in the packet brief.
<!-- /ANCHOR:questions -->
