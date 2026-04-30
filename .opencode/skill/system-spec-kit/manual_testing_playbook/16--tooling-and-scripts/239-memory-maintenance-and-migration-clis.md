---
title: "239 -- Memory Maintenance and Migration CLIs"
description: "This scenario validates memory maintenance and migration CLIs for `239`. It focuses on confirming dry-run reporting, cleanup and parser regression coverage, and ranking output."
---

# 239 -- Memory Maintenance and Migration CLIs

## 1. OVERVIEW

This scenario validates memory maintenance and migration CLIs for `239`. It focuses on confirming dry-run reporting, cleanup and parser regression coverage, and ranking output.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm dry-run migration reporting, cleanup/parser regression coverage, and ranking output.
- Real user request: `Please validate Memory Maintenance and Migration CLIs against node .opencode/skill/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js --dry-run --include-archive --report /tmp/frontmatter-dry-run.json and tell me whether the expected signals are present: backfill dry-run writes a JSON report; cleanup and parser regression scripts pass; rank-memories prints a structured summary for the sample JSON input.`
- RCAF Prompt: `As a tooling validation operator, validate Memory Maintenance and Migration CLIs against node .opencode/skill/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js --dry-run --include-archive --report /tmp/frontmatter-dry-run.json. Verify dry-run migration reporting, cleanup/parser regression coverage, and ranking output. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: backfill dry-run writes a JSON report; cleanup and parser regression scripts pass; rank-memories prints a structured summary for the sample JSON input
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the maintenance surface behaves deterministically in dry-run and regression-driven validation modes

---

## 3. TEST EXECUTION

### Prompt

```
As a tooling validation operator, confirm dry-run migration reporting, cleanup/parser regression coverage, and ranking output against node .opencode/skill/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js --dry-run --include-archive --report /tmp/frontmatter-dry-run.json. Verify backfill dry-run succeeds and writes /tmp/frontmatter-dry-run.json; cleanup and parser scripts pass; rank-memories prints structured ranking output for the sample dataset. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `node .opencode/skill/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js --dry-run --include-archive --report /tmp/frontmatter-dry-run.json`
2. `node .opencode/skill/system-spec-kit/scripts/tests/test-frontmatter-backfill.js`
3. `node .opencode/skill/system-spec-kit/scripts/tests/test-cleanup-orphaned-vectors.js`
4. `node .opencode/skill/system-spec-kit/scripts/tests/test-ast-parser.js`
5. `printf '[{\"path\":\"memory/demo.md\",\"title\":\"Demo Memory\",\"importance_tier\":\"important\",\"updated_at\":\"2026-03-26T00:00:00.000Z\"}]' > /tmp/memories.json`
6. `node .opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js /tmp/memories.json`

### Expected

Backfill dry-run succeeds and writes `/tmp/frontmatter-dry-run.json`; cleanup and parser scripts pass; rank-memories prints structured ranking output for the sample dataset

### Evidence

Dry-run report file, regression-script transcripts, and rank-memories stdout

### Pass / Fail

- **Pass**: the dry-run/report path works, the regression scripts pass, and ranking output is produced without crashing
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect `scripts/memory/backfill-frontmatter.ts`, `cleanup-orphaned-vectors.ts`, `ast-parser.ts`, and `rank-memories.ts` if one command fails or returns malformed output

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [16--tooling-and-scripts/25-memory-maintenance-and-migration-clis.md](../../feature_catalog/16--tooling-and-scripts/25-memory-maintenance-and-migration-clis.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 239
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/239-memory-maintenance-and-migration-clis.md`
