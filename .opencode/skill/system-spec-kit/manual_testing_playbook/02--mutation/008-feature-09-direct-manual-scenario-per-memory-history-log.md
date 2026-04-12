---
title: "M-008 -- Feature 09 Direct Manual Scenario (Per-memory History Log)"
description: "This snippet preserves the canonical memory/spec-kit operator workflow for `M-008`."
audited_post_018: true
phase_018_replaces: "legacy memory-file fixture with spec-doc anchored history verification"
---

# M-008 -- Feature 09 Direct Manual Scenario (Per-memory History Log)

## 1. OVERVIEW

This snippet preserves the canonical packet/spec-kit operator workflow for `M-008`.

---

## 2. CURRENT REALITY

This scenario remains prose-first because it carries compound operator logic, supplemental checks, or shared closure rules that are clearer than a single-row matrix.

---

## 3. TEST EXECUTION

### Prompt

`As a mutation validation operator, validate Feature 09 Direct Manual Scenario (Per-memory History Log) against memory_save({ filePath:"<sandbox-spec-doc>", force:true }). Verify repeated save/update activity is observable via retrieval output and packet metadata remains coherent for the same saved document lineage. Return a concise pass/fail verdict with the main reason and cited evidence.`
### Commands
- `memory_save({ filePath:"<sandbox-spec-doc>", force:true })`
  - `memory_save({ filePath:"<sandbox-spec-doc>", force:true })`
  - `memory_search({ query:"<unique phrase from sandbox spec doc>", specFolder:"<sandbox-spec>", includeContent:true, limit:5 })`
### Expected

repeated save/update activity is observable via retrieval output and packet metadata remains coherent for the same saved document lineage.
### Evidence

both save outputs + follow-up search output showing the persisted packet content and metadata continuity.
### Pass/Fail

direct operator run confirms per-memory history behavior without relying only on automated suites.
### Failure Triage

verify sandbox file path and spec scope -> rerun with `force:true` -> inspect memory metadata fields returned from save/search outputs.

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [02--mutation/10-per-memory-history-log.md](../../feature_catalog/02--mutation/10-per-memory-history-log.md)

---

## 5. SOURCE METADATA

- Group: Mutation
- Playbook ID: M-008
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `02--mutation/008-feature-09-direct-manual-scenario-per-memory-history-log.md`
