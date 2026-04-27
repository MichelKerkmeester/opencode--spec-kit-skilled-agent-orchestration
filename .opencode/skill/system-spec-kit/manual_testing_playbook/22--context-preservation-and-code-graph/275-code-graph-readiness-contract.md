---
title: "275 -- Code-graph readiness contract"
description: "This scenario validates the shared code-graph readiness contract for `275`. It focuses on proving the sibling handlers emit the same canonical readiness vocabulary."
---

# 275 -- Code-graph readiness contract

## 1. OVERVIEW

This scenario validates the shared code-graph readiness contract for `275`. It focuses on proving the sibling handlers emit the same canonical readiness vocabulary.

---

## 2. SCENARIO CONTRACT

- Objective: Verify the code-graph handlers now emit `canonicalReadiness`, `trustState`, and `lastPersistedAt` through the shared readiness contract
- Prompt: `As a context-and-code-graph validation operator, validate Code-graph readiness contract against the shared readiness helpers. Verify query, scan, status, context, ccc-status, ccc-reindex, and ccc-feedback all emit readiness fields through one shared contract; trustState values stay inside the canonical SharedPayloadTrustState vocabulary; and the CCC trio uses the documented readiness_not_applicable stub behavior. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: shared readiness fields present across the sibling handlers; trustState values align with the canonical vocabulary; CCC trio exposes the documented stub behavior
- Pass/fail: PASS if the sibling handlers now share one readiness contract instead of drifting by handler

---

## 3. TEST EXECUTION

### Prompt

```
As a context-and-code-graph validation operator, validate the shared code-graph readiness contract. Verify query, scan, status, context, ccc-status, ccc-reindex, and ccc-feedback all emit readiness fields through one shared contract; trustState values stay inside the canonical SharedPayloadTrustState vocabulary; and the CCC trio uses the documented readiness_not_applicable stub behavior. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Exercise the query, scan, status, and context handlers and capture their readiness blocks
2. Exercise `ccc_status`, `ccc_reindex`, and `ccc_feedback`
3. Compare the returned readiness fields across the siblings
4. Confirm the CCC trio exposes `reason: "readiness_not_applicable"` with the documented stub trust-state behavior
5. Side-effect freedom of `code_graph_status` (packet 014, criterion E): capture sha256 of `mcp_server/database/code-graph.sqlite` before and after a `code_graph_status()` invocation; assert byte-equal — handler MUST NOT call any write-side `code-graph-db` export (`ensureCodeGraphReady`, `runScan`, etc.)

### Expected

Shared readiness fields present across the sibling handlers; trustState values align with the canonical vocabulary; CCC trio exposes the documented stub behavior; `code_graph_status` invocation is side-effect free (live `code-graph.sqlite` byte-equal pre/post per packet 014 criterion E)

### Evidence

Handler outputs for the six siblings plus the shared readiness test output

### Pass / Fail

- **Pass**: the sibling handlers now share one readiness contract instead of drifting by handler AND `code_graph_status` is byte-equal-safe on the live DB
- **Fail**: a sibling still omits or reshapes the readiness fields, the CCC stub behavior is inconsistent, OR `code_graph_status` mutates the live `code-graph.sqlite`

### Failure Triage

Inspect `mcp_server/code_graph/lib/readiness-contract.ts`, the sibling handler files, and the readiness-contract test suites

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation-and-code-graph/24-code-graph-readiness-contract.md](../../feature_catalog/22--context-preservation-and-code-graph/24-code-graph-readiness-contract.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 275
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation-and-code-graph/275-code-graph-readiness-contract.md`
