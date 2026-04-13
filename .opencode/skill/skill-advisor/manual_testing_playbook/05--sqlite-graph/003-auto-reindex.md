---
title: "SG-003 -- Auto reindex"
description: "This scenario validates Auto reindex for `SG-003`. It focuses on watcher-driven SQLite updates landing after a metadata edit without manual recompilation."
---

# SG-003 -- Auto reindex

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SG-003`.

---

## 1. OVERVIEW

This scenario validates Auto reindex for `SG-003`. It focuses on watcher-driven SQLite updates landing after a metadata edit without manual recompilation.

### Why This Matters

If watcher-driven reindexing fails, the live graph drifts away from source metadata and operators are forced back to manual rebuild steps for simple graph edits.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `SG-003` and confirm the expected signals without contradictory evidence.

- Objective: Verify a metadata edit updates the live SQLite graph without rerunning the compiler
- Real user request: `"confirm the live skill graph picks up a metadata weight change on its own"`
- Prompt: `As a SQLite auto-index validation operator, temporarily edit .opencode/skill/mcp-figma/graph-metadata.json, wait three seconds for the watcher debounce window, then call skill_graph_query({queryType:"depends_on",skillId:"mcp-figma"}). Verify the updated edge weight appears in SQLite without running skill_graph_compiler.py. Restore the file after capturing evidence. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: after the edit and wait window, `skill_graph_query` reports the updated edge weight without any manual compiler run
- Pass/fail: PASS if the live query reflects the temporary metadata edit after the watcher delay and the file is restored; FAIL if the weight stays stale or the source file is not restored

---

## 3. TEST EXECUTION

### Prompt

`As a SQLite auto-index validation operator, temporarily edit .opencode/skill/mcp-figma/graph-metadata.json, wait three seconds for the watcher debounce window, then call skill_graph_query({queryType:"depends_on",skillId:"mcp-figma"}). Verify the updated edge weight appears in SQLite without running skill_graph_compiler.py. Restore the file after capturing evidence. Return a concise pass/fail verdict with the main reason and cited evidence.`

### Commands

1. `cp .opencode/skill/mcp-figma/graph-metadata.json /tmp/mcp-figma.graph-metadata.json.bak`
2. `python3 -c "import json, pathlib; p = pathlib.Path('.opencode/skill/mcp-figma/graph-metadata.json'); data = json.loads(p.read_text()); data['edges']['depends_on'][0]['weight'] = 0.8; p.write_text(json.dumps(data, indent=2) + '\n')"`
3. `sleep 3`
4. `skill_graph_query({queryType:"depends_on",skillId:"mcp-figma"})`
5. `mv /tmp/mcp-figma.graph-metadata.json.bak .opencode/skill/mcp-figma/graph-metadata.json`

### Expected

After the three-second wait, the live `skill_graph_query` response shows the temporary `0.8` weight from the edited metadata file even though `skill_graph_compiler.py` was not run. The source file is then restored to its original contents.

### Evidence

Capture the temporary metadata diff or edited file snippet, the waited interval, the full `skill_graph_query` response showing the temporary weight, and proof that the original file was restored.

### Pass/Fail

- **Pass**: the live query reflects the temporary weight change after the watcher delay and the source file is restored
- **Fail**: the query still shows the old weight, the watcher does not update SQLite, or the source file is not restored

### Failure Triage

Inspect watcher scheduling in `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`. Review hash-skip logic in `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts` to confirm the changed file was not skipped incorrectly. Re-run `skill_graph_status({})` after the edit to check whether the source file is flagged as stale.

---

## 4. SOURCE FILES

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/context-server.ts` | Runs the startup scan, watcher, and 2-second debounce that should trigger reindexing |
| `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts` | Computes SHA-256 hashes, skips unchanged files, and writes changed rows into SQLite |
| `.opencode/skill/mcp-figma/graph-metadata.json` | Temporary edit target used to prove watcher-driven reindexing updates the live store |

---

## 5. SOURCE METADATA

- Group: SQLite Graph
- Playbook ID: SG-003
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--sqlite-graph/003-auto-reindex.md`
