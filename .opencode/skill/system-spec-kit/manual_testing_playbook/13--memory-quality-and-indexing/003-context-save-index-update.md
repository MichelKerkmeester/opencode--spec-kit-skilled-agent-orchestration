---
title: "M-003 -- Context Save + Index Update"
description: "This snippet preserves the canonical memory/spec-kit operator workflow for `M-003`."
---

# M-003 -- Context Save + Index Update

## 1. OVERVIEW

This snippet preserves the canonical memory/spec-kit operator workflow for `M-003`.

---

## 2. CURRENT REALITY

This scenario remains prose-first because it carries compound operator logic, supplemental checks, or shared closure rules that are clearer than a single-row matrix.

- Prompt: `Save fresh context for the target spec folder, run an index scan immediately after the save, and verify the saved artifacts are discoverable in retrieval results. Capture the save and index evidence, and return a concise user-facing pass/fail verdict with the main reason.`

---

## 3. TEST EXECUTION

- Commands:
  - `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/<target-spec>`
  - `memory_index_scan({ specFolder: "specs/<target-spec>" })`
- Expected: saved context artifacts are discoverable.
- Evidence: save output + index output.
- Pass: context appears in retrieval post-index.
- Fail triage: rerun save; inspect path/permissions.

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [02--mutation/01-memory-indexing-memorysave.md](../../feature_catalog/02--mutation/01-memory-indexing-memorysave.md)

---

## 5. SOURCE METADATA

- Group: Memory Quality and Indexing
- Playbook ID: M-003
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `13--memory-quality-and-indexing/003-context-save-index-update.md`
