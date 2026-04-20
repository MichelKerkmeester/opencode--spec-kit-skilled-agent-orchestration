---
title: "NC-002 Native advisor_status Transitions"
description: "Manual validation of advisor_status freshness transitions and status fields."
---

# NC-002 Native advisor_status Transitions

## 1. OVERVIEW

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

## 6. SOURCE FILES

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness/`
