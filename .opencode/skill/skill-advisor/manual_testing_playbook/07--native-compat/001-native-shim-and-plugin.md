---
title: "Native Compat Shim And Plugin Bridge"
description: "Manual scenarios for native advisor delegation, Python fallback, redirect metadata, and H5 operator alerting."
---

# Native Compat Shim And Plugin Bridge

## NC-001 Native CLI Path

```bash
python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py --force-native "save this conversation context to memory"
```

Pass when stdout is a JSON array, the top entry is `system-spec-kit`, and the entry includes `source: "native"`.

## NC-002 Python Fallback Path

```bash
python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py --force-local "help me commit my changes"
```

Pass when stdout is a JSON array and the top entry is `sk-git` from the Python scorer.

## NC-003 `--stdin` Regression

```bash
printf '%s' "save this conversation context to memory" | \
  python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py --force-native --stdin
```

Pass when the native path returns a JSON array and no prompt text is echoed in diagnostic metadata.

## NC-004 Plugin Bridge Delegation

```bash
printf '%s' '{"prompt":"save this conversation context to memory","workspaceRoot":"'"$PWD"'","maxTokens":80}' | \
  node .opencode/plugins/spec-kit-skill-advisor-bridge.mjs
```

Pass when the bridge returns `status: "ok"`, an `Advisor:` brief, and `metadata.route: "native"`.

## NC-005 Redirect And Lifecycle Surfaces

Run the compat unit tests:

```bash
npm --prefix .opencode/skill/system-spec-kit/mcp_server run build
cd .opencode/skill/system-spec-kit/mcp_server
../scripts/node_modules/.bin/vitest run mcp_server/skill-advisor/tests/compat/redirect-metadata.vitest.ts --reporter=default
```

Pass when superseded skills render `redirect_from` and `redirect_to`, archived and future skills render `status` plus `default_routable: false`, and rolled-back skills render `schema_version: 1` with `note: "v1 restored"`.

## H5 Operator Alerting Playbook

Use `advisor_status({"workspaceRoot":"..."})` as the health metric source for external monitoring.

| State | Detection | Remediation |
| --- | --- | --- |
| `degraded` | `freshness: "stale"` or `trustState.reason` such as `SOURCE_NEWER_THAN_SKILL_GRAPH` | Inspect changed SKILL.md / graph-metadata files, run `skill_graph_scan`, then re-run `advisor_status`. |
| `quarantined` | Daemon watcher reports active quarantines or malformed SKILL.md diagnostics | Identify the offending skill, repair or revert the malformed file, and confirm quarantine count returns to zero. |
| `unavailable` | `freshness: "unavailable"` or `advisor_status.errors[]` present | Rebuild from source, restart the MCP server, and verify `advisor_recommend` returns a prompt-safe result. |

Last-resort escape hatch:

```bash
export SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1
```

Use the escape hatch only while a degraded, quarantined, or unavailable daemon state is being remediated. Unset it when the native path is healthy.

