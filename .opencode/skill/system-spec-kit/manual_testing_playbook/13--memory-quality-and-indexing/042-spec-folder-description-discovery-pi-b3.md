---
title: "042 -- Spec folder description discovery (PI-B3)"
description: "This scenario validates Spec folder description discovery (PI-B3) for `042`. It focuses on Confirm per-folder + aggregated routing."
---

# 042 -- Spec folder description discovery (PI-B3)

## 1. OVERVIEW

This scenario validates Spec folder description discovery (PI-B3) for `042`. It focuses on Confirm per-folder + aggregated routing.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `042` and confirm the expected signals without contradicting evidence.

- Objective: Confirm per-folder + aggregated routing
- Prompt: `Validate PI-B3 folder description discovery. Capture the evidence needed to prove description.json exists after create.sh; stale detection triggers on spec.md edit; per-folder files preferred over spec.md fallback; mixed-mode aggregation works; invalid JSON or schema-invalid description.json files are ignored, spec.md fallback is used, and existing files are repaired in place; missing description.json falls back cleanly without implicit backfill; out-of-base or prefix-bypass paths are rejected by realpath containment checks; YAML frontmatter is stripped before description extraction, including CRLF-heavy frontmatter cases; memory_context uses folder routing; regeneration leaves valid JSON on disk with no leftover temp files. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: description.json exists after create.sh; stale detection triggers on spec.md edit; per-folder files preferred over spec.md fallback; mixed-mode aggregation works; invalid JSON or schema-invalid description.json files are ignored, spec.md fallback is used, and existing files are repaired in place; missing description.json falls back cleanly without implicit backfill; out-of-base or prefix-bypass paths are rejected by realpath containment checks; YAML frontmatter is stripped before description extraction, including CRLF-heavy frontmatter cases; memory_context uses folder routing; regeneration leaves valid JSON on disk with no leftover temp files
- Pass/fail: PASS: description.json created, stale detection works, per-folder preferred, mixed aggregation correct, no crash on corrupt description.json, invalid metadata repaired on regeneration, missing files fall back without implicit writes, traversal attempts rejected, frontmatter stripping works for CRLF-heavy files, folder routing active, and regenerated files are valid JSON with no leftover temp files; FAIL: Any of the scenario checks fails

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 042 | Spec folder description discovery (PI-B3) | Confirm per-folder + aggregated routing | `Validate PI-B3 folder description discovery. Capture the evidence needed to prove description.json exists after create.sh; stale detection triggers on spec.md edit; per-folder files preferred over spec.md fallback; mixed-mode aggregation works; invalid JSON or schema-invalid description.json files are ignored, spec.md fallback is used, and existing files are repaired in place; missing description.json falls back cleanly without implicit backfill; out-of-base or prefix-bypass paths are rejected by realpath containment checks; YAML frontmatter is stripped before description extraction, including CRLF-heavy frontmatter cases; memory_context uses folder routing; regeneration leaves valid JSON on disk with no leftover temp files. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Create spec folder via create.sh → verify description.json exists 2) Edit spec.md → verify isPerFolderDescriptionStale detects change 3) Run generateFolderDescriptions → verify per-folder files preferred over spec.md 4) Mixed mode: some folders with/without description.json → verify aggregation 5) Corrupt description.json with invalid JSON and schema-invalid field types → run generateFolderDescriptions() and verify spec.md fallback plus repaired description.json 6) Verify missing description.json falls back to spec.md without forcing a write 7) Attempt generation against an out-of-base or prefix-bypass path → verify rejection and no file written 8) Use spec.md with large YAML frontmatter and CRLF-heavy line endings → verify extracted description comes from post-frontmatter content 9) Run memory_context query → verify short-circuit folder routing | description.json exists after create.sh; stale detection triggers on spec.md edit; per-folder files preferred over spec.md fallback; mixed-mode aggregation works; invalid JSON or schema-invalid description.json files are ignored, spec.md fallback is used, and existing files are repaired in place; missing description.json falls back cleanly without implicit backfill; out-of-base or prefix-bypass paths are rejected by realpath containment checks; YAML frontmatter is stripped before description extraction, including CRLF-heavy frontmatter cases; memory_context uses folder routing; regeneration leaves valid JSON on disk with no leftover temp files | description.json content + stale detection output + folder routing trace in memory_context + recovery evidence for corrupt/schema-invalid description.json files + missing-file fallback evidence + rejection evidence for traversal attempts + proof of valid regenerated JSON with no leftover temp files | PASS: description.json created, stale detection works, per-folder preferred, mixed aggregation correct, no crash on corrupt description.json, invalid metadata repaired on regeneration, missing files fall back without implicit writes, traversal attempts rejected, frontmatter stripping works for CRLF-heavy files, folder routing active, and regenerated files are valid JSON with no leftover temp files; FAIL: Any of the scenario checks fails | Verify create.sh generates description.json → Check stale detection mtime comparison → Inspect generateFolderDescriptions preference logic and repair path → Confirm missing-file fallback does not backfill unexpectedly → Verify realpath containment rejects traversal/prefix-bypass paths → Confirm frontmatter stripping happens before description extraction → Verify memory_context folder routing |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [13--memory-quality-and-indexing/04-spec-folder-description-discovery.md](../../feature_catalog/13--memory-quality-and-indexing/04-spec-folder-description-discovery.md)

---

## 5. SOURCE METADATA

- Group: Memory Quality and Indexing
- Playbook ID: 042
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `13--memory-quality-and-indexing/042-spec-folder-description-discovery-pi-b3.md`
