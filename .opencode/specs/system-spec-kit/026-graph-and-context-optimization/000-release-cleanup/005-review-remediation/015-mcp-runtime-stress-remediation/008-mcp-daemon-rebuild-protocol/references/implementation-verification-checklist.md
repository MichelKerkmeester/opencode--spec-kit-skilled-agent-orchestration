# Implementation Verification Checklist (Copy-Paste)

> Paste this into your packet's `implementation-summary.md` "Verification" section. Replace placeholders with actual evidence.

---

## Standard Verification Block

```markdown
## Verification

| Check | Result | Evidence |
|-------|--------|----------|
| Source diff captured | PASS | <list of files changed> |
| Targeted vitest PASS | PASS | `cd mcp_server && npx vitest run tests/<file>.vitest.ts` → N tests PASS |
| `npm run build` clean | PASS | `cd mcp_server && npm run build` → tsc --build completed |
| dist marker grep | PASS | `grep -l <new-marker> dist/<file>.js` → matched |
| dist timestamp newer than source | PASS | `stat -f "%m %N" both files` shows dist > source |
| MCP-owning client restart | PENDING | Requires user restart per packet 013 |
| Live MCP probe response | PENDING | Will run after restart per packet 013/references/live-probe-template.md |

REQ acceptance:

| REQ | Status | Evidence |
|-----|--------|----------|
| REQ-001 | PASS | <one-line evidence> |
| REQ-002 | PASS | <one-line evidence> |
| REQ-003 | PASS | <one-line evidence> |
```

---

## When Live Probe Has Run

After the user restarts the MCP-owning client and you've captured the live probe response, update the row to:

```markdown
| Live MCP probe response | PASS | Recorded at <ISO timestamp> after restart. Verbatim response: <copy-paste> |
```

---

## When Anything Is FAIL

Be honest. The 005 phantom-fix lesson showed that hiding FAIL results means the bug doesn't actually get fixed. Use:

```markdown
| <check> | FAIL | <error message verbatim>. Root cause: <one sentence>. Mitigation: <one sentence or "deferred to follow-up packet">. |
```

---

## Cross-Reference

Always cite packet 013 in your "Known Limitations" or "How It Was Delivered" section:

```markdown
## Known Limitations

1. **Daemon restart is out-of-band.** This packet patches source and rebuilds dist, but the running MCP daemon must be restarted by the MCP-owning client (OpenCode/Codex/Claude). See packet 008-mcp-daemon-rebuild-protocol for the canonical 4-part verification contract.
```
