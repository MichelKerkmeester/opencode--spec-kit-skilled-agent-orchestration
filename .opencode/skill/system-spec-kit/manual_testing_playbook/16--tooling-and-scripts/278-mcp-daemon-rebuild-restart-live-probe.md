---
title: "278 -- MCP daemon rebuild, restart, and live-probe protocol"
description: "This scenario validates the canonical 4-part rebuild + restart + live-probe contract for MCP TypeScript fixes (packet 008). Source diff -> targeted vitest -> dist marker check + restart -> live MCP probe. Codifies the phantom-fix prevention loop."
---

# 278 -- MCP daemon rebuild, restart, and live-probe protocol

## 1. OVERVIEW

This scenario validates the canonical rebuild + restart + live-probe contract authored in packet 008. It focuses on confirming a TypeScript fix in `mcp_server/` is actually live in the running daemon, not just compiled to `dist/` or only passing in vitest. The contract codifies the v1.0.2 phantom-fix lesson where a fix passed targeted tests but the daemon kept serving stale code because the runtime had not been restarted.

---

## 2. SCENARIO CONTRACT

- **Objective**: Verify a representative MCP TypeScript fix passes the 4-part contract end-to-end: source diff captured, targeted vitest pass, `dist/` marker grep finds the new code, runtime restarted by the appropriate per-client procedure, and a live MCP probe returns the new contract field/behavior.
- **Prerequisites**:
  - Reference docs available: `references/mcp-rebuild-restart-protocol.md`, `references/live-probe-template.md`, `references/dist-marker-grep-cheatsheet.md`, `references/implementation-verification-checklist.md` (under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/008-mcp-daemon-rebuild-protocol/`)
  - A pending or recently landed MCP TypeScript change with a known new code marker (e.g. a new payload field, helper export, or log string)
  - Per-client restart command for the active runtime (OpenCode reload tools / Claude Code restart / Codex CLI restart / Gemini CLI restart)
- **Prompt**: `As a tooling validation operator, validate the canonical MCP daemon rebuild + restart + live-probe contract against a representative TypeScript fix. Verify the 4 parts in order: (1) source diff capture, (2) targeted vitest pass, (3) dist marker grep + runtime restart, (4) live MCP probe surfaces the new contract field. Return a concise pass/fail verdict with the main reason and cited evidence.`
- **Expected signals**:
  - Step 1: `git diff mcp_server/` shows the expected file paths for the change
  - Step 2: `cd mcp_server && npx vitest run <suite>` exits 0
  - Step 3: `npm run build && grep -l <new-marker> mcp_server/dist/<file>.js` returns 1 hit AND `dist/` mtime > source mtime
  - Step 4: per-client runtime restart completes (output confirms reload, not a silent no-op)
  - Step 5: live MCP probe (per `live-probe-template.md`) returns the new contract field/behavior, not the pre-fix shape
- **Pass/fail criteria**:
  - PASS: all 4 parts verified in order; live probe returns post-fix payload
  - FAIL: any part skipped, dist marker missing despite vitest pass (means stale dist), or live probe still returns pre-fix payload (means stale daemon)

---

## 3. TEST EXECUTION

### Prompt

```
As a tooling validation operator, validate the 4-part MCP rebuild + restart + live-probe contract for a representative TypeScript fix. Capture source diff, run targeted vitest, rebuild dist + grep for the new marker, restart the runtime per client, then issue a live MCP probe and assert the post-fix contract field appears. Return a concise pass/fail verdict.
```

### Commands

1. `git diff mcp_server/ > /tmp/278-source-diff.txt && wc -l /tmp/278-source-diff.txt` — confirm source diff non-empty and on expected paths
2. `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run <suite> 2>&1 | tee /tmp/278-vitest.txt` — confirm exit 0
3. `cd .opencode/skill/system-spec-kit/mcp_server && npm run build && grep -l "<new-marker>" dist/<file>.js && stat -f "%m" dist/<file>.js src/<file>.ts` — confirm marker present and dist mtime > source mtime
4. Restart the MCP-owning runtime per `references/mcp-rebuild-restart-protocol.md` (OpenCode: reload tools; Claude Code: restart binary; Codex/Gemini CLI: restart binary)
5. Issue the live MCP probe per `references/live-probe-template.md` for the affected subsystem (`memory_context`, `memory_search`, `code_graph_query`, or `memory_causal_stats`) and assert the post-fix contract field is present

### Expected

Source diff non-empty on expected paths; targeted vitest exits 0; `dist/` carries the new marker and is newer than source; runtime restart confirmed; live probe returns post-fix payload (e.g. new envelope field, new helper output, or new routing decision).

### Evidence

`/tmp/278-source-diff.txt` (source diff), `/tmp/278-vitest.txt` (vitest transcript), grep + stat output (dist verification), runtime restart confirmation, and the live MCP probe response with the post-fix field highlighted

### Pass / Fail

- **Pass**: all 4 parts verified, live probe surfaces post-fix contract
- **Fail**: vitest passes but dist marker missing (stale build), dist marker present but live probe returns pre-fix payload (stale daemon — the phantom-fix pathology), or any step skipped

### Failure Triage

If dist marker missing: re-run `npm run build`, check `tsc -b` errors. If marker present but live probe pre-fix: confirm runtime restart actually happened (some IDEs cache the MCP daemon process). If live probe still pre-fix after confirmed restart: check whether multiple `mcp_server/dist/` copies exist on the search path (workspace cache, plugin folder, etc.) and which one the runtime is actually loading.

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Reference (canonical contract): `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/008-mcp-daemon-rebuild-protocol/references/mcp-rebuild-restart-protocol.md`
- Reference (probe queries): `.opencode/specs/.../008-mcp-daemon-rebuild-protocol/references/live-probe-template.md`
- Reference (grep patterns): `.opencode/specs/.../008-mcp-daemon-rebuild-protocol/references/dist-marker-grep-cheatsheet.md`
- Reference (verification checklist): `.opencode/specs/.../008-mcp-daemon-rebuild-protocol/references/implementation-verification-checklist.md`
- Sibling: [243-setup-native-module-health-and-mcp-installation.md](./243-setup-native-module-health-and-mcp-installation.md) (covers prerequisites and installer; this entry covers the post-fix verification loop)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 278
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/278-mcp-daemon-rebuild-restart-live-probe.md`
