---
title: "279 -- Advisor status and rebuild separation"
description: "Operator validation for packet 034 advisor_status diagnostic-only behavior and explicit advisor_rebuild repair."
---

# 279 -- Advisor status and rebuild separation

## 1. OVERVIEW

This scenario validates packet 034's Skill Advisor repair contract from the system-spec-kit operator surface. `advisor_status` reports stale state and never rebuilds; `advisor_rebuild` is the explicit repair path and skips live state unless `force:true` is supplied.

---

## 2. SCENARIO CONTRACT

- **Goal**: Reproduce advisor stale state, prove `advisor_status` is diagnostic-only, then prove `advisor_rebuild` repairs it.
- **Prerequisites**:
  - Working directory is the repository root.
  - Skill Advisor MCP tools are available: `advisor_status` and `advisor_rebuild`.
  - Run in a disposable copy when touching metadata mtimes.
- **Prompt**: `As a Skill Advisor operator, make the advisor graph stale by touching a skill graph-metadata.json in a disposable workspace, call advisor_status twice to prove it reports but does not rebuild, then call advisor_rebuild and verify rebuilt:true plus generationAfter >= generationBefore. Return PASS/FAIL with the before/status/after evidence.`

---

## 3. TEST EXECUTION

### Commands

1. Create a disposable workspace copy and make source metadata newer than the advisor artifact:

```bash
WORK="/tmp/spec-kit-advisor-rebuild-$(date +%s)"
rsync -a --exclude node_modules --exclude .git ./ "$WORK/"
cd "$WORK"
npm --prefix .opencode/skill/system-spec-kit/mcp_server run build
touch .opencode/skill/system-spec-kit/graph-metadata.json
```

2. Check status once:

```text
advisor_status({ "workspaceRoot": "/tmp/spec-kit-advisor-rebuild-<timestamp>" })
```

3. Check status a second time without rebuilding:

```text
advisor_status({ "workspaceRoot": "/tmp/spec-kit-advisor-rebuild-<timestamp>" })
```

4. Rebuild explicitly:

```text
advisor_rebuild({ "workspaceRoot": "/tmp/spec-kit-advisor-rebuild-<timestamp>" })
```

5. Verify live status after rebuild:

```text
advisor_status({ "workspaceRoot": "/tmp/spec-kit-advisor-rebuild-<timestamp>" })
```

6. Verify the live-skip branch:

```text
advisor_rebuild({ "workspaceRoot": "/tmp/spec-kit-advisor-rebuild-<timestamp>" })
```

7. Verify force rebuild:

```text
advisor_rebuild({ "workspaceRoot": "/tmp/spec-kit-advisor-rebuild-<timestamp>", "force": true })
```

### Expected Output / Verification

- Steps 2 and 3 both report `freshness: "stale"` or a stale trust-state reason, and `generation` is unchanged.
- Step 4 reports `status: "ok"`, `data.rebuilt: true`, `data.skipped: false`, and a `reason` of `stale`, `absent`, `unavailable`, or `force` depending on the engineered state.
- Step 5 reports `freshness: "live"` or the expected post-rebuild healthy state for the disposable workspace.
- Step 6 reports `rebuilt: false`, `skipped: true`, `reason: "status-live"`.
- Step 7 reports `rebuilt: true`, `reason: "force"`.

### Cleanup

```bash
cd -
rm -rf "$WORK"
```

### Variant Scenarios

- Absent artifact: delete the copied `skill-graph.sqlite` and verify `advisor_rebuild` repairs an `absent` or `unavailable` state.
- Corrupt artifact: replace copied SQLite with invalid bytes and verify `advisor_status` reports diagnostic failure while `advisor_rebuild` is the only repair action.
- Prompt safety: confirm neither status nor rebuild diagnostics contain raw user prompt text.

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Packet 034 spec: [034-half-auto-upgrades/spec.md](../../../../../specs/system-spec-kit/026-graph-and-context-optimization/034-half-auto-upgrades/spec.md)
- Skill Advisor playbook scenario: [006-advisor-status-rebuild-separation.md](../../mcp_server/skill_advisor/manual_testing_playbook/01--native-mcp-tools/006-advisor-status-rebuild-separation.md)
- Source: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-status.ts`
- Source: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-rebuild.ts`

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 279
- Packet: 034-half-auto-upgrades
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/279-advisor-status-rebuild-separation.md`
