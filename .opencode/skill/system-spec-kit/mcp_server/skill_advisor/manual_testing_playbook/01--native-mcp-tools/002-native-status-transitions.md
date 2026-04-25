---
title: "NC-002 Native advisor_status Transitions"
description: "Manual validation of advisor_status freshness transitions and status fields."
trigger_phrases:
  - "nc-002"
  - "native advisor_status transitions"
  - "native advisor_status"
  - "native"
---

# NC-002 Native advisor_status Transitions

## TABLE OF CONTENTS

- [1. SCENARIO](#1--scenario)
- [2. SETUP](#2--setup)
- [3. STEPS](#3--steps)
- [4. EXPECTED](#4--expected)
- [5. FAILURE MODES](#5--failure-modes)
- [6. RELATED](#6--related)

---

## 1. SCENARIO

Validate that `advisor_status` reports live, stale, and absent states with the Phase 027 `skillCount` and `lastScanAt` fields.

---

## 2. SETUP

- Repo root is the working directory.
- Use a disposable copy for stale or absent transition simulation.
- Native package build exists in `mcp_server/dist`.

---

## 3. STEPS

1. Live check:

```text
advisor_status({"workspaceRoot":"/absolute/path/to/repo"})
```

2. Stale check in a disposable copy: touch a copied `.opencode/skill/*/graph-metadata.json` after the copied SQLite artifact timestamp, then call `advisor_status` with that copy as `workspaceRoot`.
3. Absent check in a disposable copy: move the copied `skill-graph.sqlite` out of the way, ensure no usable generation metadata is present, then call `advisor_status`.

---

## 4. EXPECTED

- Live response includes `freshness`, `generation`, `trustState`, `lastGenerationBump`, `lastScanAt`, `skillCount`, and `laneWeights`.
- `skillCount` is a nonzero integer that matches discovered `graph-metadata.json` files.
- `lastScanAt` is an ISO timestamp or `null` when no scan has occurred.
- Stale response reports `freshness: "stale"` or a stale trust-state reason such as `SOURCE_NEWER_THAN_SKILL_GRAPH`.
- Absent response reports `freshness: "absent"` when graph sources exist but the artifact/generation state is missing.

---

## 5. FAILURE MODES

| Symptom | Detection | Action |
| --- | --- | --- |
| Missing `skillCount` | Field absent from JSON | Rebuild MCP server and verify `advisor-status.ts` is current. |
| Missing `lastScanAt` | Field absent from JSON | Rebuild and rerun; block release if still absent. |
| Transition cannot be simulated | Write sandbox prevents temp copy setup | Mark `SKIP` with sandbox evidence, not `PASS`. |

---

## 6. RELATED

- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-status.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/`
