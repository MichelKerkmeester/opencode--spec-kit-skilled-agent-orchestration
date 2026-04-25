---
title: "LC-005 Lifecycle-Level Rollback"
description: "Manual validation that lib/lifecycle/rollback.ts can revert lifecycle metadata changes atomically without leaving partial state."
trigger_phrases:
  - "lc-005"
  - "lifecycle rollback"
  - "atomic rollback"
  - "lifecycle revert"
---

# LC-005 Lifecycle-Level Rollback

## TABLE OF CONTENTS

- [1. SCENARIO](#1--scenario)
- [2. SETUP](#2--setup)
- [3. STEPS](#3--steps)
- [4. EXPECTED](#4--expected)
- [5. FAILURE MODES](#5--failure-modes)
- [6. RELATED](#6--related)

---

## 1. SCENARIO

Validate that `lib/lifecycle/rollback.ts` can revert lifecycle changes (supersession, archive status, schema version) to a prior consistent state atomically without leaving partial data.

---

## 2. SETUP

- Disposable workspace copy.
- MCP server built.
- Known lifecycle checkpoint or pre-change snapshot captured before the mutation under test.

---

## 3. STEPS

1. Capture a pre-mutation snapshot of lifecycle metadata.
2. Apply a lifecycle mutation (example: mark a skill as superseded by another in graph-metadata or via admin path).
3. Trigger rollback through the documented lifecycle rollback entry point.
4. Compare post-rollback lifecycle state against the pre-mutation snapshot.
5. Call `advisor_recommend` with a prompt that exercises the affected pair and verify pre-mutation routing behavior returns.

---

## 4. EXPECTED

- Post-rollback lifecycle metadata matches the pre-mutation snapshot.
- Routing behavior reverts to pre-mutation expectations (superseded pair no longer applies).
- No residual `redirect_to` or `redirect_from` metadata from the rolled-back mutation.
- No partial state (for example, half-applied supersession) observable in any reader.

---

## 5. FAILURE MODES

| Symptom | Detection | Action |
| --- | --- | --- |
| Partial rollback | Some fields revert, others retain mutation | Block release; rollback must be atomic. |
| Rollback leaves residue in derived | Graph-metadata derived block still reflects mutation | Audit derived-sync integration with lifecycle rollback. |
| Rollback fails silently | State does not change | Confirm rollback entry point is wired to lifecycle subsystem. |

---

## 6. RELATED

- Scenario [LC-004](./004-schema-migration.md) — schema migration rollback.
- Feature [`03--lifecycle-routing/05-rollback.md`](../../feature_catalog/03--lifecycle-routing/05-rollback.md).
- Source: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/lifecycle/rollback.ts`.
