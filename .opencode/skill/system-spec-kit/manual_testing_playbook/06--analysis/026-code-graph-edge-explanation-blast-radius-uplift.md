---
title: "EX-026 -- Code Graph edge explanation and blast radius uplift"
description: "This scenario validates Code Graph edge explanation and blast radius uplift for `EX-026`. It focuses on explanation display, impact grouping, risk and fallback fields."
---

# EX-026 -- Code Graph edge explanation and blast radius uplift

## 1. OVERVIEW

This scenario validates Code Graph edge explanation and blast radius uplift for `EX-026`. It focuses on explanation display, impact grouping, risk and fallback fields.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `EX-026` and confirm the expected signals without contradicting evidence.

- Objective: Validate Code Graph explanation metadata and enriched impact output.
- Real user request: `Show me why this Code Graph relationship exists and what the blast radius looks like with confidence filtering.`
- Prompt: `As an analysis validation operator, validate code_graph_query relationship and blast_radius output for edge reason/step metadata, depthGroups, riskLevel, minConfidence, ambiguityCandidates and failureFallback. Return a concise pass/fail verdict with cited output fields.`
- Expected execution process: Run a fresh scan when needed, query a relationship with known edges, then run `blast_radius` with and without `minConfidence`.
- Expected signals: Edge rows include `reason` and `step`; blast-radius output includes grouped depths, risk level, confidence threshold, ambiguity candidates and structured fallback when a subject is ambiguous or unresolved.
- Desired user-visible outcome: The operator can audit why graph edges exist and can judge impact risk without silent default selection.
- Pass/fail: PASS if all required fields appear with plausible values; FAIL if any bare blast-radius error string replaces `failureFallback` or ambiguity is silently resolved.

---

## 3. TEST EXECUTION

### Prompt

```text
As an analysis validation operator, validate code_graph_query relationship and blast_radius output for edge reason/step metadata, depthGroups, riskLevel, minConfidence, ambiguityCandidates and failureFallback. Return a concise pass/fail verdict with cited output fields.
```

### Commands

1. `code_graph_scan`
2. `code_graph_query({ operation: "calls_from", subject: "<known-symbol>" })`
3. `code_graph_query({ operation: "blast_radius", subject: "<known-file-or-symbol>", maxDepth: 2, minConfidence: 0.75 })`
4. `code_graph_query({ operation: "blast_radius", subject: "<ambiguous-fq-name>" })`

### Expected

Relationship output includes `reason` and `step` next to confidence fields. Blast-radius output includes `depthGroups`, `riskLevel`, `minConfidence`, `ambiguityCandidates` and `failureFallback` when resolution cannot safely continue.

### Evidence

Capture the JSON payloads for the relationship query, the filtered blast-radius query and the ambiguous or unresolved blast-radius query.

### Pass / Fail

- **Pass**: Required fields are present, risk follows the documented depth-one fanout rule and ambiguous subjects return candidates.
- **Fail**: Any expected field is absent, an ambiguous subject is silently selected or a blast-radius failure returns only a bare error string.

### Failure Triage

1. Run `code_graph_scan` and repeat the query if readiness blocks the first attempt.
2. If no known ambiguous symbol exists, create two same-fq-name fixtures in a scratch test workspace or use the automated query-handler test as the evidence source.
3. If `minConfidence` appears ineffective, compare affected files from runs at `0` and `0.75`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../feature_catalog/06--analysis/08-code-graph-edge-explanation-blast-radius-uplift.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|------|------|
| `mcp_server/code_graph/handlers/query.ts` | Blast-radius and relationship query output |
| `mcp_server/code_graph/lib/structural-indexer.ts` | Edge metadata writer |
| `mcp_server/code_graph/lib/code-graph-context.ts` | Context propagation |
| `mcp_server/code_graph/tests/code-graph-query-handler.vitest.ts` | Automated coverage for risk, filtering, ambiguity and fallback |
| `mcp_server/code_graph/tests/code-graph-indexer.vitest.ts` | Automated coverage for reason and step metadata |

---

## 5. SOURCE METADATA

- Group: Analysis
- Playbook ID: EX-026
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `06--analysis/026-code-graph-edge-explanation-blast-radius-uplift.md`
