---
title: "LC-003 Archive and Future Skills Indexed But Not Routed"
description: "Manual validation that skills under z_archive/ and z_future/ are indexed for visibility but are not surfaced as active routing candidates."
trigger_phrases:
  - "lc-003"
  - "z_archive skills"
  - "z_future skills"
  - "indexed not routed"
---

# LC-003 Archive and Future Skills Indexed But Not Routed

## TABLE OF CONTENTS

- [1. SCENARIO](#1--scenario)
- [2. SETUP](#2--setup)
- [3. STEPS](#3--steps)
- [4. EXPECTED](#4--expected)
- [5. FAILURE MODES](#5--failure-modes)
- [6. RELATED](#6--related)

---

## 1. SCENARIO

Validate that `lib/lifecycle/archive-handling.ts` keeps `z_archive/` and `z_future/` skills visible to inspection queries but excludes them from live routing recommendations.

---

## 2. SETUP

- Workspace containing at least one skill under `z_archive/` and one under `z_future/`.
- MCP server built; daemon reachable.

---

## 3. STEPS

1. Call `advisor_status` and capture `skillCount`:

```text
advisor_status({"workspaceRoot":"/absolute/path/to/repo"})
```

2. Manually enumerate skills under `.opencode/skill/` plus any nested `z_archive/` and `z_future/` locations.
3. Call `advisor_recommend` with a prompt that historically mapped to the archived skill and capture the top-k recommendations.
4. Inspect whether any archived or future slug appears in `recommendations[]`.

---

## 4. EXPECTED

- `advisor_status.skillCount` includes archived and future skills for visibility purposes, or is documented to exclude them if `skillCount` is defined as active-only.
- Archived and future skill slugs do not appear in `recommendations[]` under `advisor_recommend`.
- IDF computed by `lib/corpus/df-idf.ts` uses the active corpus only (see AI-004).
- Lifecycle metadata on archived entries is available via inspection tools.

---

## 5. FAILURE MODES

| Symptom | Detection | Action |
| --- | --- | --- |
| Archived skill routed | Slug appears in recommendations | Block release; audit `archive-handling.ts` filter. |
| Archived skill not indexed | Inspection tool cannot find slug | Verify indexing policy allows archive discovery without routing. |
| Future skill routed prematurely | `z_future/` slug appears as top-1 | Block release; future gating must hold until activation. |

---

## 6. RELATED

- Scenario [AI-004](../06--auto-indexing/004-corpus-df-idf.md) — active-only corpus.
- Scenario [LC-002](./002-supersession.md) — supersession routing.
- Feature [`03--lifecycle-routing/03-archive-handling.md`](../../feature_catalog/03--lifecycle-routing/03-archive-handling.md).
- Source: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/lifecycle/archive-handling.ts`.
