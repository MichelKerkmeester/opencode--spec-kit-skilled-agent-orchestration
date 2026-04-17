---
title: "271 -- Research metadata backfill"
description: "This scenario validates the research metadata backfill script for `271`. It focuses on proving missing iteration metadata is created without rewriting already-complete folders."
---

# 271 -- Research metadata backfill

## 1. OVERVIEW

This scenario validates the research metadata backfill script for `271`. It focuses on proving missing iteration metadata is created without rewriting already-complete folders.

---

## 2. CURRENT REALITY

- Objective: Verify the research backfill script creates missing `description.json` and `graph-metadata.json` files while leaving complete iteration folders untouched
- Prompt: `As a tooling validation operator, validate Research metadata backfill against scripts/memory/backfill-research-metadata.ts. Verify missing metadata files are created under research iteration folders, complete folders are not rewritten, and canonical save follow-up coverage for research trees is restored. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: missing metadata files created; complete folders unchanged; output identifies only the folders that needed repair
- Pass/fail: PASS if the script repairs incomplete research iteration folders without rewriting the complete ones

---

## 3. TEST EXECUTION

### Prompt

```
As a tooling validation operator, validate the research metadata backfill script. Verify missing description.json and graph-metadata.json files are created under research iteration folders, complete folders are not rewritten, and output identifies only the folders that needed repair. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Prepare or use a fixture tree with both missing-metadata and complete research iteration folders
2. Run the backfill script against the fixture or packet
3. Inspect the created metadata files in the incomplete folders
4. Confirm the complete folders were left untouched

### Expected

Missing metadata files created; complete folders unchanged; output identifies only the folders that needed repair

### Evidence

Script output plus before/after file listings for incomplete and complete iteration folders

### Pass / Fail

- **Pass**: the script repairs incomplete research iteration folders without rewriting the complete ones
- **Fail**: it rewrites complete folders or leaves missing metadata behind

### Failure Triage

Inspect `scripts/memory/backfill-research-metadata.ts`, the workflow follow-up integration, and the backfill test fixtures

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [16--tooling-and-scripts/34-research-metadata-backfill.md](../../feature_catalog/16--tooling-and-scripts/34-research-metadata-backfill.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 271
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/271-research-metadata-backfill.md`
