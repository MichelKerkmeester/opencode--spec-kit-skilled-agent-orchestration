---
title: "SG-004 -- JSON fallback"
description: "This scenario validates JSON fallback for `SG-004`. It focuses on the advisor switching from SQLite to the JSON snapshot when the database file is temporarily unavailable."
---

# SG-004 -- JSON fallback

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SG-004`.

---

## 1. OVERVIEW

This scenario validates JSON fallback for `SG-004`. It focuses on the advisor switching from SQLite to the JSON snapshot when the database file is temporarily unavailable.

### Why This Matters

If the fallback path breaks, a missing or locked SQLite database can take down graph-aware routing even when the exported JSON snapshot is still present.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `SG-004` and confirm the expected signals without contradictory evidence.

- Objective: Verify `skill_advisor.py` falls back to `skill-graph.json` when `skill-graph.sqlite` is unavailable
- Real user request: `"confirm the advisor still loads graph data if the SQLite store is temporarily missing"`
- Prompt: `As a graph fallback validation operator, temporarily rename .opencode/skill/system-spec-kit/mcp_server/database/skill-graph.sqlite, then run python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "test" --health. Verify the health payload reports skill_graph_source as "json" while the SQLite file is absent, then restore the database file. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: the health payload reports `skill_graph_source: "json"` and `skill_graph_path` points to `skill-graph.json` while SQLite is unavailable
- Pass/fail: PASS if the advisor reports JSON fallback and the SQLite file is restored; FAIL if the advisor does not fall back cleanly or the database file is not restored

---

## 3. TEST EXECUTION

### Prompt

`As a graph fallback validation operator, temporarily rename .opencode/skill/system-spec-kit/mcp_server/database/skill-graph.sqlite, then run python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "test" --health. Verify the health payload reports skill_graph_source as "json" while the SQLite file is absent, then restore the database file. Return a concise pass/fail verdict with the main reason and cited evidence.`

### Commands

1. `mv .opencode/skill/system-spec-kit/mcp_server/database/skill-graph.sqlite /tmp/skill-graph.sqlite.bak`
2. `python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "test" --health`
3. `mv /tmp/skill-graph.sqlite.bak .opencode/skill/system-spec-kit/mcp_server/database/skill-graph.sqlite`

### Expected

While the SQLite file is renamed away, the health payload reports `skill_graph_loaded: true`, `skill_graph_source: "json"`, and a JSON graph path. After evidence capture, the SQLite database file is restored to its original location.

### Evidence

Capture the temporary database rename, the full health payload showing `skill_graph_source: "json"`, and proof that `skill-graph.sqlite` was restored after the check.

### Pass/Fail

- **Pass**: the advisor reports `skill_graph_source: "json"` during the temporary rename and the SQLite database file is restored
- **Fail**: the advisor does not fall back to JSON, the health payload contradicts the expected source, or the SQLite file is not restored

### Failure Triage

Inspect `_load_skill_graph()` in `.opencode/skill/skill-advisor/scripts/skill_advisor.py` for SQLite-first and JSON fallback behavior. Verify `.opencode/skill/skill-advisor/scripts/skill-graph.json` is present and readable. Re-run the health check after restoring the database to confirm the source flips back to SQLite.

---

## 4. SOURCE FILES

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/skill-advisor/scripts/skill_advisor.py` | Loads SQLite first, falls back to JSON, and reports the active graph source in `--health` output |
| `.opencode/skill/skill-advisor/scripts/skill-graph.json` | JSON export snapshot used for fallback when SQLite is unavailable |
| `.opencode/skill/system-spec-kit/mcp_server/database/skill-graph.sqlite` | Live SQLite graph database whose temporary removal triggers the fallback path |

---

## 5. SOURCE METADATA

- Group: SQLite Graph
- Playbook ID: SG-004
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--sqlite-graph/004-json-fallback.md`
