---
title: "Implementation Plan: OpenCode Graph Plugin Phased Execution [system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/plan]"
description: "Captures the completed packet 030 runtime delivery, including Phase 031 Copilot startup-hook wiring repair."
trigger_phrases:
  - "packet 030 plan"
  - "phase coordination"
  - "opencode graph plugin plan"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Plan: OpenCode Graph Plugin Phased Execution

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript runtime helpers, Markdown, JSON, Vitest |
| **Framework** | Packet 024 compact code graph runtime plus System Spec Kit phased packet workflow |
| **Storage** | Existing packet 030 folder under packet 024 |
| **Testing** | `npm run typecheck`, targeted `vitest`, strict packet validation, JSON/TOML validation |

### Overview
Packet 030 shipped Phases 1-5 already and now also closes Phase 031, which repairs the repo-local Copilot startup-hook wiring and aligns runtime detection with the actual hook configuration. This parent plan now records the clean Level 3 packet closeout for all six phases.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Packet 030 runtime implementation is already complete
- [x] Backup snapshots exist for the parent and child phase baselines
- [x] Existing implementation summaries provide evidence-backed runtime claims

### Definition of Done
- [x] Parent and completed child phases contain clean Level 3 docs
- [x] The Phase 5 child phase exists as a Level 3 implementation and verification record
- [x] The Phase 031 child phase exists as a Level 3 implementation and verification record
- [x] Parent and child decision records are populated truthfully
- [x] Parent and child checklists are evidence-backed
- [x] Strict recursive validation passes
- [x] Upgrade backup directories are removed from the packet tree
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Completed phased runtime delivery with Level 3 documentation closeout

### Key Components
- **Phase 1**: Shared payload/provenance contract across startup, recovery, and compaction
- **Phase 2**: Real OpenCode plugin transport shell and `opencode.json` registration
- **Phase 3**: Graph-operations hardening contract below the transport shell
- **Phase 4**: Cross-runtime startup/status parity across Claude, Gemini, Copilot, and Codex
- **Phase 5**: Code graph auto-reindex parity so structural reads mimic CocoIndex-style first-use refresh where safe
- **Phase 031**: Copilot repo-local sessionStart wiring, runtime-detection truth-sync, and packet documentation repair
- **Level 3 closeout**: Parent and child decision records, checklists, and validator-clean docs

### Data Flow
Research established the execution order. Implementation summaries captured the runtime evidence. This plan closes the packet by ensuring the documentation layer now reflects that same runtime truth without template-generated corruption.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Repair the Parent Packet
- [x] Rebuild the parent `spec.md` as a clean Level 3 spec
- [x] Rebuild the parent `plan.md` as a clean Level 3 plan
- [x] Populate the parent `checklist.md` and `decision-record.md` truthfully

### Phase 2: Repair the Child Phases
- [x] Rebuild each phase `spec.md` and `plan.md` as clean Level 3 docs
- [x] Populate each phase `checklist.md` and `decision-record.md` truthfully
- [x] Keep all runtime claims aligned with the existing implementation summaries

### Phase 3: Validation and Cleanup
- [x] Update remaining Level metadata and AI execution protocol sections
- [x] Remove backup directories after the repaired packet validates cleanly
- [x] Rerun strict recursive validation and report the result

### Phase 4: Queue the Next Follow-On Cleanly
- [x] Add Phase 5 as a child phase with full Level 3 docs
- [x] Thread Phase 5 through the parent packet without rewriting completed runtime claims
- [x] Implement and verify the Phase 5 runtime behavior
- [x] Add Phase 031 as a child phase with full Level 3 docs
- [x] Implement and verify the Copilot startup-hook wiring repair and packet truth-sync
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural Validation | Parent and child packet docs meet strict Spec Kit rules | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh ... --recursive --strict` |
| Metadata Validation | Packet metadata remains valid after the Level 3 repair | `jq empty` on packet `description.json` files |
| Consistency Review | Runtime claims remain unchanged in meaning | Direct compare against existing implementation summaries |
| Cleanup Verification | Backup directories removed after successful repair | `find ... -name '.backup-*'` |
<!-- /ANCHOR:testing -->

---

### AI EXECUTION PROTOCOL

### Pre-Task Checklist
- Confirm edits stay inside packet `030-opencode-graph-plugin` and its child phase folders.
- Confirm runtime claims come from existing implementation summaries and prior packet evidence.
- Confirm Level 3 additions are documentation-only and do not invent new runtime work.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| `DOC-SCOPE` | Touch only packet-local markdown and metadata files. |
| `TRUTH-FIRST` | Keep runtime claims unchanged in meaning and evidence-backed. |
| `VALIDATE-LAST` | Treat strict recursive validation as the final completion gate. |

### Status Reporting Format
- `in-progress`: state which packet or phase docs are being repaired.
- `blocked`: state the validator error or missing evidence and the next repair step.
- `completed`: report changed files plus strict recursive validation result.

### Blocked Task Protocol
- If strict validation fails, keep the packet open and fix the documented blocker before claiming completion.
- If a checklist or ADR cannot be populated truthfully, mark the specific item deferred with evidence instead of fabricating completion.

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `research/research.md` | Internal | Green | Packet boundaries could drift from the locked synthesis |
| Existing implementation summaries | Internal | Green | Runtime claims could drift from delivered reality |
| Packet-local backup snapshots | Internal | Green | Repair would lose the clean pre-upgrade baseline |
| Spec Kit validator | Internal | Green | Packet could not be proven Level 3 compliant |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Repaired docs still fail strict validation or drift from existing runtime evidence.
- **Procedure**: Revert to the clean packet-local backup baseline, reapply only the validator-required Level 3 additions, and rerun validation before closing the packet.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Repair Parent Docs ──► Repair Child Docs ──► Validate and Clean Up
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Repair Parent Docs | Clean parent baseline | Child truth-sync |
| Repair Child Docs | Clean parent wording | Final validation |
| Validate and Clean Up | Parent + child repairs | Packet closeout |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Repair Parent Docs | Medium | Completed in this repair pass |
| Repair Child Docs | Medium | Completed in this repair pass |
| Validate and Clean Up | Medium | Completed in this repair pass |
| **Total** | | **Packet Level 3 repair complete** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup baseline available before edits
- [x] Runtime evidence source identified
- [x] Validation command selected as final gate

### Rollback Procedure
1. Restore the affected packet docs from the packet-local backup snapshot.
2. Reapply only the Level 3 sections needed for validation and truth-sync.
3. Re-run strict recursive validation.
4. Remove backup directories only after validation passes.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Restore docs from the packet-local backups and rerun validation
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
Research Synthesis ──► Runtime Delivery ──► Implementation Summaries
                                    │
                                    └──► Level 3 Packet Repair ──► Clean Validation
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Parent Packet Repair | Parent backup + runtime evidence | Clean parent docs | Child repair |
| Child Phase Repair | Child backups + phase summaries | Clean phase docs | Final validation |
| Final Validation | Parent + child repairs | Validator-clean packet | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Repair parent spec, plan, checklist, and ADR** - completed - CRITICAL
2. **Repair phase specs, plans, checklists, and ADRs** - completed - CRITICAL
3. **Rerun strict recursive validation and remove backups** - completed - CRITICAL

**Total Critical Path**: One full documentation repair pass

**Parallel Opportunities**:
- Child checklists and child ADRs can be populated independently once the parent wording is stable.
- Metadata refresh and backup cleanup can happen after doc content is finalized.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Parent packet repaired | Parent spec/plan/checklist/ADR are clean Level 3 docs | Completed |
| M2 | Child phases repaired | All six phases have clean Level 3 docs | Completed |
| M3 | Packet validated | Strict recursive validation passes and backups are removed | Completed |
| M4 | Phase 5 delivered | Parent packet and child phase describe the bounded auto-reindex behavior truthfully | Completed |
| M5 | Phase 031 delivered | Copilot repo hook wiring, runtime detection, and packet truth-sync all match live behavior | Completed |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Repair the Packet from Clean Backup Baselines

**Status**: Accepted

**Context**: The automated Level 3 upgrade introduced raw template frontmatter and placeholders into the body of the packet docs.

**Decision**: Rebuild the packet docs from the packet-local backup baselines and existing implementation evidence, then add clean Level 3 sections manually.

**Consequences**:
- Positive: The repaired packet remains truthful and validator-clean.
- Negative: The repair is more manual than the automated upgrade. Mitigation: keep the repair scoped to packet 030 and phase-local docs.

**Alternatives Rejected**:
- Re-run the upgrader and patch the output: rejected because it already caused the template bleed-through.
