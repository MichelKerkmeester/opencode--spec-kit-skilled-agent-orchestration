---
title: "282 -- Code graph matrix cell coverage evidence"
description: "Operator reference for code-graph-related matrix evidence files F5, F6, F7, and F8."
---

# 282 -- Code graph matrix cell coverage evidence

## 1. OVERVIEW

This scenario is an evidence-led manual check for code-graph-adjacent matrix cells. Operators verify the per-cell JSONL records and logs for F5, F6, F7, and F8 rather than rerunning the full matrix by default.

---

## 2. SCENARIO CONTRACT

- **Goal**: Reference and inspect stored evidence for code-graph cells F5, F6, F7, and F8.
- **Prerequisites**:
  - Working directory is the repository root.
  - Matrix evidence files exist under `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/`.
  - `jq` is available.
- **Prompt**: `As a matrix evidence operator, inspect stored evidence for F5 code_graph_query, F6 code_graph_scan/verify, F7 causal graph, and F8 CocoIndex search. Verify each feature has native and inline PASS records where applicable, external CLI records are explicit PASS/BLOCKED/RUNNER_MISSING, and every referenced evidence file exists. Return PASS/FAIL with the decisive file paths.`

---

## 3. TEST EXECUTION

### Commands

1. Set the matrix evidence root:

```bash
EVIDENCE="specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation"
```

2. Verify focused runner logs exist:

```bash
ls "$EVIDENCE/logs/feature-runs/F5-code-graph-query.log" \
   "$EVIDENCE/logs/feature-runs/F6-code-graph-verify.log" \
   "$EVIDENCE/logs/feature-runs/F7-causal-graph.log" \
   "$EVIDENCE/logs/feature-runs/F8-cocoindex-calibration.log"
```

3. Verify JSONL result files exist for all F5-F8 executors:

```bash
for feature in F5 F6 F7 F8; do
  ls "$EVIDENCE"/results/"$feature"-*.jsonl
done
```

4. Verify JSONL shape and status enum:

```bash
for file in "$EVIDENCE"/results/F{5,6,7,8}-*.jsonl; do
  jq -e '
    has("cell_id") and
    has("feature") and
    has("feature_name") and
    has("executor") and
    has("status") and
    has("category") and
    has("result") and
    has("output_summary") and
    has("evidence_files") and
    (.status | IN("PASS","BLOCKED","RUNNER_MISSING","NA","FAIL","TIMEOUT_CELL"))
  ' "$file"
done
```

5. Verify native and inline local evidence passed:

```bash
jq -r '[.cell_id, .status, .runner, .evidence_files[]?] | @tsv' \
  "$EVIDENCE"/results/F{5,6,7,8}-native.jsonl \
  "$EVIDENCE"/results/F{5,6,7,8}-inline.jsonl
```

6. Cross-check referenced evidence files:

```bash
for file in "$EVIDENCE"/results/F{5,6,7,8}-*.jsonl; do
  jq -r '.evidence_files[]?' "$file" | while read -r rel; do
    test -e "$EVIDENCE/$rel" || { echo "missing evidence: $file -> $rel"; exit 1; }
  done
done
```

### Expected Output / Verification

- F5 references `logs/feature-runs/F5-code-graph-query.log`.
- F6 references `logs/feature-runs/F6-code-graph-verify.log`.
- F7 references `logs/feature-runs/F7-causal-graph.log`.
- F8 references `logs/feature-runs/F8-cocoindex-calibration.log`.
- Native and inline F5-F8 records are `PASS` where local focused runners executed.
- External CLI records are explicit and non-silent: `PASS`, `BLOCKED`, `RUNNER_MISSING`, or another normalized status with a concrete `output_summary`.
- Every `evidence_files` path resolves under the matrix evidence root.

### Cleanup

No cleanup. This scenario is read-only.

### Variant Scenarios

- Compare `logs/feature-runs/summary.tsv` and `summary-rerun.tsv` to check rerun drift.
- Inspect one blocked external CLI record and verify `manual_fallback` names the next operator action.
- Rerun F5-F8 through `matrix-runners/run-matrix.ts` and compare the new JSONL shape with stored records.

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Evidence root: `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/`

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 282
- Current behavior: stored matrix evidence records F5-F8 local/native and external CLI outcomes.
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation-and-code-graph/282-code-graph-cell-coverage-evidence.md`
