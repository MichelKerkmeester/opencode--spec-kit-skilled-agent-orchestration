---
title: "NC-006 Advisor Status and Rebuild Separation"
description: "Manual validation that advisor_status is diagnostic-only and advisor_rebuild is the explicit repair path for stale Skill Advisor state."
trigger_phrases:
  - "nc-006"
  - "advisor_status diagnostic only"
  - "advisor_rebuild explicit repair"
  - "skill advisor stale rebuild"
---

# NC-006 Advisor Status and Rebuild Separation

## 1. OVERVIEW

Validate the packet 034 separation between `advisor_status` and `advisor_rebuild`. `advisor_status` must report stale, absent, or unavailable state without repair side effects; `advisor_rebuild` must perform the rebuild only when explicitly called.

---

## 2. SCENARIO CONTRACT

- **Goal**: Reproduce stale advisor state, verify status calls are diagnostic-only, and verify explicit rebuild behavior.
- **Prerequisites**:
  - Disposable workspace copy.
  - MCP server build available.
  - Skill Advisor MCP tools reachable.
- **Prompt**: `As a Skill Advisor native MCP operator, reproduce stale state in a disposable workspace, call advisor_status twice to prove it does not rebuild, call advisor_rebuild to repair, verify live status, then confirm live rebuild skips unless force:true is supplied. Return PASS/FAIL with before/status/after JSON excerpts.`

---

## 3. TEST EXECUTION

### Commands

1. Create a disposable copy and make source metadata newer than the copied advisor graph:

```bash
WORK="/tmp/skill-advisor-nc-006-$(date +%s)"
rsync -a --exclude node_modules --exclude .git ./ "$WORK/"
cd "$WORK"
npm --prefix .opencode/skill/system-spec-kit/mcp_server run build
touch .opencode/skill/system-spec-kit/graph-metadata.json
```

2. Capture diagnostic status twice:

```text
advisor_status({ "workspaceRoot": "/tmp/skill-advisor-nc-006-<timestamp>" })
advisor_status({ "workspaceRoot": "/tmp/skill-advisor-nc-006-<timestamp>" })
```

3. Rebuild explicitly:

```text
advisor_rebuild({ "workspaceRoot": "/tmp/skill-advisor-nc-006-<timestamp>" })
```

4. Confirm status after rebuild:

```text
advisor_status({ "workspaceRoot": "/tmp/skill-advisor-nc-006-<timestamp>" })
```

5. Confirm live skip and force rebuild:

```text
advisor_rebuild({ "workspaceRoot": "/tmp/skill-advisor-nc-006-<timestamp>" })
advisor_rebuild({ "workspaceRoot": "/tmp/skill-advisor-nc-006-<timestamp>", "force": true })
```

### Expected Output / Verification

- The two initial `advisor_status` responses both report stale or degraded freshness and do not advance generation.
- The explicit `advisor_rebuild` response reports `rebuilt: true`, `skipped: false`, `freshnessBefore`, `freshnessAfter`, `generationBefore`, `generationAfter`, and `skillCount`.
- Post-rebuild `advisor_status` reports healthy freshness for the copied workspace.
- A second rebuild on live state reports `rebuilt: false`, `skipped: true`, and `reason: "status-live"`.
- `force:true` reports `rebuilt: true` and `reason: "force"`.

### Cleanup

```bash
cd -
rm -rf "$WORK"
```

### Variant Scenarios

- Replace copied `skill-graph.sqlite` with invalid bytes and verify `advisor_status` remains diagnostic while `advisor_rebuild` is the repair path.
- Remove the copied skill graph artifact and verify absent-state repair.
- Run with a dead `SPECKIT_SKILL_GRAPH_DAEMON_PID` and verify status includes daemon evidence without leaking prompt text.

---

## 4. SOURCE FILES

| File | Role |
| --- | --- |
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../handlers/advisor-status.ts` | Diagnostic-only status handler |
| `../../handlers/advisor-rebuild.ts` | Explicit rebuild handler |
| `../../schemas/advisor-tool-schemas.ts` | Tool input/output schemas |

---

## 5. SOURCE METADATA

- Group: Native MCP Tools
- Playbook ID: NC-006
- Packet: 034-half-auto-upgrades
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--native-mcp-tools/006-advisor-status-rebuild-separation.md`
