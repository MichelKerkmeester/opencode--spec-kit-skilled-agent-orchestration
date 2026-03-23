---
title: "Feature Specification: Manual Testing — Retrieval Enhancements (Phase 015)"
description: "Manual test execution tracking for 11 retrieval enhancement scenarios covering dual-scope auto-surface, constitutional memory injection, spec folder hierarchy retrieval, lightweight consolidation, memory summary channel, cross-document entity linking, tier-2 fallback, provenance envelopes, and contextual tree injection."
trigger_phrases:
  - "retrieval enhancements testing"
  - "015 retrieval enhancements"
  - "phase 015 manual testing"
  - "dual scope auto surface test"
importance_tier: "normal"
contextType: "implementation"
---
# Feature Specification: Manual Testing — Retrieval Enhancements (Phase 015)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Not Started |
| **Created** | 2026-03-22 |
| **Branch** | `015-manual-testing-per-playbook` |
| **Parent Spec** | [../spec.md](../spec.md) |
| **Predecessor** | [014-pipeline-architecture](../014-pipeline-architecture/spec.md) |
| **Successor** | [016-tooling-and-scripts](../016-tooling-and-scripts/spec.md) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The retrieval enhancements category (15--retrieval-enhancements) contains 9 features covering dual-scope surfacing, constitutional memory injection, spec folder hierarchy retrieval, lightweight consolidation, memory summary channel, cross-document entity linking, tier-2 fallback, provenance envelopes, and contextual tree injection. These features have never been manually verified against the published playbook scenarios, so conformance is unknown.

### Purpose
Execute all 11 playbook scenarios for the retrieval enhancements category and record PASS/FAIL/SKIP per scenario, producing a verified conformance record.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Execute all 11 playbook scenarios listed in section 4
- Record result (PASS / FAIL / SKIP) and evidence for each scenario
- Capture any defects found during execution

### Out of Scope
- Fixing defects (tracked separately)
- Testing scenarios outside the 15--retrieval-enhancements category
- Automated test creation

### Scenario Inventory

| ID | Playbook File | Title |
|----|--------------|-------|
| 055 | 055-dual-scope-memory-auto-surface-tm-05.md | Dual-scope memory auto-surface (TM-05) |
| 056 | 056-constitutional-memory-as-expert-knowledge-injection-pi-a4.md | Constitutional memory as expert knowledge injection (PI-A4) |
| 057 | 057-spec-folder-hierarchy-as-retrieval-structure-s4.md | Spec folder hierarchy as retrieval structure (S4) |
| 058 | 058-lightweight-consolidation-n3-lite.md | Lightweight consolidation (N3-lite) |
| 059 | 059-memory-summary-search-channel-r8.md | Memory summary search channel (R8) |
| 060 | 060-cross-document-entity-linking-s5.md | Cross-document entity linking (S5) |
| 077 | 077-tier-2-fallback-channel-forcing.md | Tier-2 fallback channel forcing |
| 093 | 093-implemented-memory-summary-generation-r8.md | Implemented: memory summary generation (R8) |
| 094 | 094-implemented-cross-document-entity-linking-s5.md | Implemented: cross-document entity linking (S5) |
| 096 | 096-provenance-rich-response-envelopes-p0-2.md | Provenance-rich response envelopes (P0-2) |
| 145 | 145-contextual-tree-injection-p1-4.md | Contextual tree injection (P1-4) |

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Rewrite | Clean-slate Level 2 specification for Phase 015 manual test execution |
| `plan.md` | Rewrite | Execution plan for all 11 scenarios |
| `tasks.md` | Rewrite | One task per scenario, all pending |
| `checklist.md` | Rewrite | P0 checklist items per scenario, all unchecked |
| `implementation-summary.md` | Rewrite | Blank template, Not Started |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-055 | Execute scenario 055 — Dual-scope memory auto-surface (TM-05) | PASS: auto-surface hook fires on non-memory-aware tool path; compaction event surfaces context-relevant memories. FAIL: hook does not fire or wrong memories surfaced |
| REQ-056 | Execute scenario 056 — Constitutional memory as expert knowledge injection (PI-A4) | PASS: constitutional directives injected into retrieval results with correct metadata and tier classification. FAIL: directives absent or tier metadata missing |
| REQ-057 | Execute scenario 057 — Spec folder hierarchy as retrieval structure (S4) | PASS: retrieval respects folder hierarchy with self > parent > sibling scoring. FAIL: hierarchy ordering not observed |
| REQ-058 | Execute scenario 058 — Lightweight consolidation (N3-lite) | PASS: all three consolidation sub-processes (contradiction detection, Hebbian edge strengthening, staleness decay) execute and produce expected outputs without errors. FAIL: any sub-process skipped or errors thrown |
| REQ-059 | Execute scenario 059 — Memory summary search channel (R8) | PASS: summary channel activates above corpus size threshold and remains inert below it. FAIL: channel active below threshold or absent above it |
| REQ-060 | Execute scenario 060 — Cross-document entity linking (S5) | PASS: supports-edges created for shared entities; density guards cap edge count appropriately. FAIL: no edges created or density guard not enforced |
| REQ-077 | Execute scenario 077 — Tier-2 fallback channel forcing | PASS: tier-2 fallback sets forceAllChannels=true; results show multi-channel contribution. FAIL: fallback does not force all channels |
| REQ-093 | Execute scenario 093 — Implemented: memory summary generation (R8) | PASS: summaries generated and persisted for long memories; scale gate correctly controls activation. FAIL: summaries absent or scale gate bypassed |
| REQ-094 | Execute scenario 094 — Implemented: cross-document entity linking (S5) | PASS: entity linker produces correctly typed supports edges; density guards enforce limits. FAIL: edges maltyped or density guard absent |
| REQ-096 | Execute scenario 096 — Provenance-rich response envelopes (P0-2) | PASS: scores/source/trace objects present when includeTrace=true or SPECKIT_RESPONSE_TRACE=true; absent when neither set; all 7 score sub-fields verified. FAIL: trace objects absent when requested or present when not requested |
| REQ-145 | Execute scenario 145 — Contextual tree injection (P1-4) | PASS: enabled mode injects [parent > child — description] headers truncated at 100 chars; disabled mode injects nothing. FAIL: headers malformatted, not truncated, or not suppressed when disabled |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 11 scenarios executed (PASS, FAIL, or SKIP — no "Not Started" remaining)
- **SC-002**: Every result has an evidence note (observation, command output, or explicit skip reason)
- **SC-003**: All FAIL results have a defect note capturing the observed vs expected behaviour
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Playbook scenario files for IDs 055–060, 077, 093, 094, 096, 145 | Cannot execute without scenario steps | Locate files before starting |
| Dependency | `../../manual_testing_playbook/manual_testing_playbook.md` | Exact prompts and pass criteria source | Treat playbook as source of truth |
| Dependency | `../../manual_testing_playbook/manual_testing_playbook.md` | Verdict rubric (PASS/PARTIAL/FAIL) | Load before any verdict assignment |
| Dependency | `../../feature_catalog/15--retrieval-enhancements/` | Feature context per scenario | Link every scenario to its feature file |
| Risk | Scenario 058 triggers N3-lite consolidation — mutates edge weights in graph DB | Medium | Run only against sandbox/disposable corpus; record baseline before triggering |
| Risk | Scenario 059 requires corpus exceeding 5,000 memories to activate summary channel | Medium | Capture corpus size before execution; document threshold outcome encountered |
| Risk | Scenario 060 requires shared entities across distinct spec folders for entity linker | Medium | Prepare cross-document entity fixture before executing |
| Risk | Scenario 096 depends on SPECKIT_RESPONSE_TRACE env var — shared environments may have it set globally | Medium | Record env var state before testing; restore defaults after |
| Risk | Scenario 145 requires runtime restart to toggle SPECKIT_CONTEXT_HEADERS | Low | Use stable sandbox corpus; capture both flag states in sequence |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Which sandbox corpus or disposable memory fixtures should be used for scenario 058 (consolidation) and 060 (entity linking) so edge-mutation evidence is reproducible across machines?
- Which minimum corpus size should be pre-populated for scenario 059 to push above the 5,000-memory threshold needed to activate the summary channel?
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each scenario execution must complete or time out within 5 minutes

### Reliability
- **NFR-R01**: Test environment must be reset to clean state before each stateful scenario (058, 060)
- **NFR-R02**: Env var state must be recorded before and restored after scenarios 096 and 145
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Scenario Boundaries
- Scenarios 058 and 060 mutate graph DB state — must run in sandbox only
- Scenarios 096 and 145 require env var toggling — document pre/post state
- If corpus size for 059 cannot reach 5,000 memories: record SKIP with reason and document actual corpus size

### Error Scenarios
- If the playbook scenario file is missing: record SKIP with note "scenario file not found"
- If the MCP server is unavailable: halt execution and record environment issue
- If sandbox isolation fails for stateful scenarios: mark blocked rather than proceeding
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | 11 scenarios, varied tool surface |
| Risk | 12/25 | 2 stateful scenarios need sandbox; 2 need env var control |
| Research | 4/20 | Playbook steps are pre-defined |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---
