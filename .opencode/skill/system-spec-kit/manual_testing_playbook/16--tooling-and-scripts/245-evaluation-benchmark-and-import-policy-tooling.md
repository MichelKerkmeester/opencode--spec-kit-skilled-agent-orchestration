---
title: "245 -- Evaluation, benchmark, and import-policy tooling"
description: "This scenario validates evaluation, benchmark, and import-policy tooling for `245`. It focuses on confirming ablation, BM25 baseline, performance benchmarks, and policy regression coverage."
---

# 245 -- Evaluation, benchmark, and import-policy tooling

## 1. OVERVIEW

This scenario validates evaluation, benchmark, and import-policy tooling for `245`. It focuses on confirming ablation, BM25 baseline, performance benchmarks, and policy regression coverage.

---

## 2. CURRENT REALITY

Operators validate the evaluation surface through the three main runners plus the dedicated policy tests that guard architecture boundaries and prohibited imports.

- Objective: Confirm ablation, BM25 baseline, performance benchmark, and import-policy tooling coverage
- Prompt: `Validate the evaluation, benchmark, and import-policy tooling surface. Capture the evidence needed to prove the ablation runner completes with SPECKIT_ABLATION enabled, the BM25 baseline runner emits its benchmark output, the performance benchmark runner writes artifacts into the target spec scratch directory, and the architecture-boundary plus import-policy suites pass. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: ablation run succeeds and writes JSON; BM25 baseline run completes; performance benchmark writes scratch artifacts; policy suites pass
- Pass/fail: PASS if the runners and policy checks behave consistently with the current CLI and import-boundary contract

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 245 | Evaluation, benchmark, and import-policy tooling | Confirm ablation, BM25 baseline, performance benchmark, and import-policy tooling coverage | `Validate the evaluation, benchmark, and import-policy tooling surface. Capture the evidence needed to prove the ablation runner completes with SPECKIT_ABLATION enabled, the BM25 baseline runner emits its benchmark output, the performance benchmark runner writes artifacts into the target spec scratch directory, and the architecture-boundary plus import-policy suites pass. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `SPECKIT_ABLATION=true npx tsx .opencode/skill/system-spec-kit/scripts/evals/run-ablation.ts --channels vector,bm25` 2) `npx tsx .opencode/skill/system-spec-kit/scripts/evals/run-bm25-baseline.ts --verbose` 3) `npx tsx --tsconfig .opencode/skill/system-spec-kit/scripts/tsconfig.json .opencode/skill/system-spec-kit/scripts/evals/run-performance-benchmarks.ts 02--system-spec-kit/022-hybrid-rag-fusion` 4) `cd .opencode/skill/system-spec-kit/scripts && npx vitest run tests/architecture-boundary-enforcement.vitest.ts tests/import-policy-rules.vitest.ts` | Ablation and BM25 runners complete with report output; performance benchmark writes `performance-benchmark-metrics.json` and `performance-benchmark-report.md` into the target scratch directory; policy suites pass | Runner stdout plus the generated benchmark artifacts under the target spec folder's `scratch/` directory and the Vitest transcript | PASS if all four steps complete and the benchmark artifacts plus policy checks match the documented current behavior | Inspect `scripts/evals/run-ablation.ts`, `run-bm25-baseline.ts`, `run-performance-benchmarks.ts`, `check-architecture-boundaries.ts`, and `import-policy-rules.ts` if a runner or policy check fails |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [16--tooling-and-scripts/31-evaluation-benchmark-and-import-policy-tooling.md](../../feature_catalog/16--tooling-and-scripts/31-evaluation-benchmark-and-import-policy-tooling.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 245
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `16--tooling-and-scripts/245-evaluation-benchmark-and-import-policy-tooling.md`
