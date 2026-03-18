---
title: "NEW-122 -- Governed ingest and scope isolation (Phase 5)"
description: "This scenario validates Governed ingest and scope isolation (Phase 5) for `NEW-122`. It focuses on Confirm governed saves require provenance and scope markers and scoped retrieval blocks cross-actor leakage."
---

# NEW-122 -- Governed ingest and scope isolation (Phase 5)

## 1. OVERVIEW

This scenario validates Governed ingest and scope isolation (Phase 5) for `NEW-122`. It focuses on Confirm governed saves require provenance and scope markers and scoped retrieval blocks cross-actor leakage.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `NEW-122` and confirm the expected signals without contradicting evidence.

- Objective: Confirm governed saves require provenance and scope markers and scoped retrieval blocks cross-actor leakage
- Prompt: `Validate Phase 5 governed ingest and retrieval isolation.`
- Expected signals: agentId,sessionId,provenanceSource,provenanceActor}` metadata 3) Query with matching scope and verify hit appears 4) Query with mismatched user/agent or tenant and verify hit is filtered out 5) Review `governance_audit` rows
- Pass/fail: Save/search outputs + DB query of scoped columns + audit rows showing allow/deny decisions

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| NEW-122 | Governed ingest and scope isolation (Phase 5) | Confirm governed saves require provenance and scope markers and scoped retrieval blocks cross-actor leakage | `Validate Phase 5 governed ingest and retrieval isolation.` | 1) Attempt `memory_save()` with `tenantId/sessionId` but missing provenance fields and verify rejection 2) Save with full `{tenantId,userId | agentId,sessionId,provenanceSource,provenanceActor}` metadata 3) Query with matching scope and verify hit appears 4) Query with mismatched user/agent or tenant and verify hit is filtered out 5) Review `governance_audit` rows | Missing provenance rejects governed ingest; successful governed ingest persists scope metadata; mismatched scope cannot retrieve the memory; allow/deny decisions are written to `governance_audit` | Save/search outputs + DB query of scoped columns + audit rows showing allow/deny decisions | PASS: Missing provenance rejected, valid governed save succeeds, cross-scope retrieval returns no hit, and audit rows exist; FAIL: Ungoverned save slips through or cross-scope retrieval leaks data |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [17--governance/03-hierarchical-scope-governance-governed-ingest-retention-and-audit.md](../../feature_catalog/17--governance/03-hierarchical-scope-governance-governed-ingest-retention-and-audit.md)

---

## 5. SOURCE METADATA

- Group: New Features
- Playbook ID: NEW-122
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--new-features/122-governed-ingest-and-scope-isolation-phase-5.md`
