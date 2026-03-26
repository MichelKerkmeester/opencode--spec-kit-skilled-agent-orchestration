---
title: "239 -- Memory Maintenance and Migration CLIs"
description: "This scenario validates memory maintenance and migration CLIs for `239`. It focuses on confirming dry-run reporting, cleanup and parser regression coverage, and ranking output."
---

# 239 -- Memory Maintenance and Migration CLIs

## 1. OVERVIEW

This scenario validates memory maintenance and migration CLIs for `239`. It focuses on confirming dry-run reporting, cleanup and parser regression coverage, and ranking output.

---

## 2. CURRENT REALITY

Operators verify the maintenance surface through dry-run migrations, targeted regression scripts, and a simple ranking input so the command cluster can be exercised without destructive corpus changes.

- Objective: Confirm dry-run migration reporting, cleanup/parser regression coverage, and ranking output
- Prompt: `Validate the memory maintenance and migration CLIs. Capture the evidence needed to prove backfill-frontmatter emits a dry-run report, cleanup-orphaned-vectors and ast-parser regression scripts still pass, and rank-memories produces structured output for a small fixture dataset. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: backfill dry-run writes a JSON report; cleanup and parser regression scripts pass; rank-memories prints a structured summary for the sample JSON input
- Pass/fail: PASS if the maintenance surface behaves deterministically in dry-run and regression-driven validation modes

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 239 | Memory Maintenance and Migration CLIs | Confirm dry-run migration reporting, cleanup/parser regression coverage, and ranking output | `Validate the memory maintenance and migration CLIs. Capture the evidence needed to prove backfill-frontmatter emits a dry-run report, cleanup-orphaned-vectors and ast-parser regression scripts still pass, and rank-memories produces structured output for a small fixture dataset. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `node .opencode/skill/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js --dry-run --include-archive --report /tmp/frontmatter-dry-run.json` 2) `node .opencode/skill/system-spec-kit/scripts/tests/test-frontmatter-backfill.js` 3) `node .opencode/skill/system-spec-kit/scripts/tests/test-cleanup-orphaned-vectors.js` 4) `node .opencode/skill/system-spec-kit/scripts/tests/test-ast-parser.js` 5) `printf '[{\"path\":\"memory/demo.md\",\"title\":\"Demo Memory\",\"importance_tier\":\"important\",\"updated_at\":\"2026-03-26T00:00:00.000Z\"}]' > /tmp/memories.json` 6) `node .opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js /tmp/memories.json` | Backfill dry-run succeeds and writes `/tmp/frontmatter-dry-run.json`; cleanup and parser scripts pass; rank-memories prints structured ranking output for the sample dataset | Dry-run report file, regression-script transcripts, and rank-memories stdout | PASS if the dry-run/report path works, the regression scripts pass, and ranking output is produced without crashing | Inspect `scripts/memory/backfill-frontmatter.ts`, `cleanup-orphaned-vectors.ts`, `ast-parser.ts`, and `rank-memories.ts` if one command fails or returns malformed output |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [16--tooling-and-scripts/25-memory-maintenance-and-migration-clis.md](../../feature_catalog/16--tooling-and-scripts/25-memory-maintenance-and-migration-clis.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 239
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `16--tooling-and-scripts/239-memory-maintenance-and-migration-clis.md`
