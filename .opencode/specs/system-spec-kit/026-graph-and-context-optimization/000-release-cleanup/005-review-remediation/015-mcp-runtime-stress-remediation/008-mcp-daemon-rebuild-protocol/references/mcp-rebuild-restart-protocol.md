# MCP Daemon Rebuild + Restart Protocol

> Canonical 4-part verification contract for every MCP TypeScript fix landing under `.opencode/skill/system-spec-kit/mcp_server/`. Without all 4 parts, completion claims are PROVISIONAL.

---

## The 005 Phantom-Fix Lesson

The 005 packet implementation summary claimed Cluster 1-3 P0 fixes had landed (truncation wrapper, intent classifier, vocabulary). The post-remediation verification (recorded in 005/spec.md §7, 2026-04-26 18:49) showed Probes A and B regressing the original defects:

```text
memory_context({input:"Semantic Search", mode:"deep"})
→ meta.intent.type        = "fix_bug"     ← expected "understand" per fix
  meta.intent.confidence  = 0.0980        ← below 0.30 threshold; fallback should fire
```

007/Q1 Iteration 001 ruled out a missing dist rebuild — the dist files had updated timestamps and contained the new code markers. The remaining cause was that the MCP-owning client/runtime had not been restarted; the running daemon child process continued using the old code.

This is the canonical phantom-fix failure mode. It is structural, not implementation-specific.

---

## The 4-Part Contract (per 007 §5 Q1)

Every MCP source patch MUST produce 5 evidence fields before completion is claimed:

| Field | Meaning | Example |
|-------|---------|---------|
| `sourceDiffPaths` | List of MCP source files changed | `mcp_server/handlers/memory-context.ts` |
| `targetedTests` | Test command + pass output | `npx vitest run tests/memory-context.vitest.ts` → 137 PASS |
| `distVerification` | `npm run build` clean + dist marker grep | `grep -l preEnforcementTokens dist/handlers/memory-context.js` |
| `runtimeRestart` | MCP-owning client/runtime restart evidence | "User restarted Claude Code at 10:42" |
| `liveProbe` | Actual MCP tool response after restart | `memory_context(...)` returned `taskIntent.intent === "understand"` |

---

## Per-Client Restart Procedures

### OpenCode (default profile)
The OpenCode runtime owns the MCP child process. Restart by:
1. Quit OpenCode entirely (Cmd+Q on macOS).
2. Relaunch.
3. Verify: the first MCP tool call after relaunch reflects the new code.

### Codex CLI
The codex CLI spawns its own MCP child per session. Restart by:
1. Exit the current `codex exec` invocation.
2. Start a new one.
3. The new child loads the rebuilt dist.

### Claude Code (claude.ai/code)
Claude Code owns its MCP child via the MCP server config in settings. Restart by:
1. Run `/restart` slash command if available.
2. Or quit + relaunch the host application (terminal session for CLI; app for desktop).

---

## The Verification Workflow

```text
source patched
  -> targeted vitest pass (npx vitest run <files>)
  -> npm run build (cd .opencode/skill/system-spec-kit/mcp_server && npm run build)
  -> dist marker grep (grep -l <new-marker> dist/<file>.js)
  -> dist timestamp newer than source (stat -f "%m %N" both files)
  -> restart MCP-owning client/runtime
  -> live MCP tool probe (record verbatim response)
  -> completion claim allowed
```

---

## Why npm test Often Fails (and what to use instead)

The `npm test` script in `mcp_server/` runs full `test:core` before `test:file-watcher`, which can take many minutes and often surfaces unrelated failures from concurrent worktree state. Use targeted `npx vitest run <files>` instead:

```bash
cd .opencode/skill/system-spec-kit/mcp_server
npx vitest run tests/<your-target-file>.vitest.ts
```

This runs only the files that matter and avoids the pretest hook chain.

---

## Anti-Patterns (DO NOT do these)

1. Claim completion after `npm run build` succeeds. Build success does not mean the daemon loaded the new code.
2. Claim completion after a direct `node` import probe of the dist file. The running daemon may still have the old child process.
3. Skip restart and assume the MCP server hot-reloads. It does not.
4. Use `npm test` (full suite) instead of `npx vitest run` (targeted) — the pretest hook will block on unrelated failures.

---

## See Also

- [`live-probe-template.md`](./live-probe-template.md) — canonical probe queries per subsystem
- [`dist-marker-grep-cheatsheet.md`](./dist-marker-grep-cheatsheet.md) — grep patterns per layer
- [`implementation-verification-checklist.md`](./implementation-verification-checklist.md) — copy-paste checklist for implementation-summary.md
- 007 research §5 Q1 — origin of the 4-part contract
- 005 spec.md §7 — origin of the phantom-fix lesson
