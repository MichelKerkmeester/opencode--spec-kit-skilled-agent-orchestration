---
title: "122 -- Governed ingest and scope isolation (Phase 5)"
description: "This scenario validates Governed ingest and scope isolation (Phase 5) for `122`. It focuses on Confirm governed saves require provenance and scope markers and scoped retrieval blocks cross-actor leakage."
audited_post_018: true
---

# 122 -- Governed ingest and scope isolation (Phase 5)

## 1. OVERVIEW

This scenario validates Governed ingest and scope isolation (Phase 5) for `122`. It focuses on Confirm governed saves require provenance and scope markers and scoped retrieval blocks cross-actor leakage.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `122` and confirm the expected signals without contradicting evidence.

- Objective: Confirm governed saves require provenance and scope markers and scoped retrieval blocks cross-actor leakage
- Prompt: `As a governance validation operator, validate Governed ingest and scope isolation (Phase 5) against memory_save(). Verify governed saves require provenance and scope markers and scoped retrieval blocks cross-actor leakage. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: agentId,sessionId,provenanceSource,provenanceActor}` metadata 3) Query with matching scope and verify hit appears 4) Query with mismatched user/agent or tenant and verify hit is filtered out 5) Review `governance_audit` rows
- Pass/fail: Save/search outputs + DB query of scoped columns + audit rows showing allow/deny decisions

---

## 3. TEST EXECUTION

### Prompt

```
As a governance validation operator, confirm governed saves require provenance and scope markers and scoped retrieval blocks cross-actor leakage against `memory_save()`. Verify governed ingest rejects missing provenance, a correctly scoped save is retrievable within scope, mismatched user, agent, or tenant queries are filtered out, and `governance_audit` rows capture the allow or deny decisions. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Attempt `memory_save()` with `tenantId/sessionId` but missing provenance fields and verify rejection
2. Save with full `{tenantId,userId or agentId,sessionId,provenanceSource,provenanceActor}` metadata
3. Query with matching scope and verify hit appears
4. Query with mismatched user/agent or tenant and verify hit is filtered out
5. Review `governance_audit` rows

### Expected

Missing provenance rejects governed ingest; successful governed ingest persists scope metadata; mismatched scope cannot retrieve the spec-doc record; allow/deny decisions are written to `governance_audit`.

### Evidence

Save/search outputs + DB query of scoped columns + audit rows showing allow/deny decisions.

### Pass / Fail

- **Pass**: Missing provenance rejected, valid governed save succeeds, cross-scope retrieval returns no hit, and audit rows exist
- **Fail**: Ungoverned save slips through or cross-scope retrieval leaks data

### Failure Triage

Inspect the governed save validation path, scope-filtering logic, and `governance_audit` writes if provenance or isolation behavior regresses.

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [17--governance/03-hierarchical-scope-governance-governed-ingest-retention-and-audit.md](../../feature_catalog/17--governance/03-hierarchical-scope-governance-governed-ingest-retention-and-audit.md)

---

## 5. SOURCE METADATA

- Group: Governance
- Playbook ID: 122
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `17--governance/122-governed-ingest-and-scope-isolation-phase-5.md`
