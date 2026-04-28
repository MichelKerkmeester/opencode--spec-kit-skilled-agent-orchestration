---
title: Runtime Hooks - Spec Kit MCP Hook Entrypoints
description: Reference for the system-spec-kit runtime hook entrypoints (Claude, Codex, Gemini, Copilot), the dynamic-load registration pattern, and maintenance rules for editing or adding hooks.
---

# Runtime Hooks - Spec Kit MCP Hook Entrypoints

Reference for the four runtime hook surfaces that wire `mcp_server/hooks/` entrypoints into Claude, Codex, Gemini, and Copilot via runtime settings files.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

This reference documents the runtime hook entrypoints under `.opencode/skill/system-spec-kit/mcp_server/hooks/` and the per-runtime settings that wire them. Hook source files have no static `import` callers inside the MCP server - they are reached by runtime command strings invoking the compiled `dist/hooks/<runtime>/*.js` artifacts. Static dead-code analyzers see them as unused; they are not.

### Core Principle

> **Hook entrypoints are runtime-loaded, not statically imported.** Their reachability lives in `settings.json` files, not in `import` statements. Treat the settings file as part of the contract.

### When to Use

- Editing an existing hook entrypoint and verifying its runtime wiring still resolves
- Adding a new hook to one or more runtimes
- Removing a hook (must update both source and settings.json)
- Triaging a static analysis report flagging hook code as dead
- Reviewing parity across the four runtimes

### Key Sources (Evidence)

| Source | Path | Purpose |
|---|---|---|
| Dead-code audit | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/003-dead-code-audit/dead-code-audit-report.md` | Canonical evidence: 15 hook entrypoints classified `dynamic-only-reference`, all KEEP |
| Skill Advisor hook reference | `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md` | Per-runtime advisor hook contract, smoke tests, control flags |
| Hook system reference | `.opencode/skill/system-spec-kit/references/config/hook_system.md` | Runtime-specific hook system deep-dive |
| Copilot hook README | `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/README.md` | Canonical contract for managed custom-instructions writer |

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:dynamic-load-pattern -->
## 2. DYNAMIC-LOAD PATTERN

### Why Hooks Look Dead

Static `import` analysis (e.g. `tsc --noUnusedLocals`, `ts-prune`, `knip`) walks the import graph from `context-server.ts`. Hook entrypoints under `mcp_server/hooks/<runtime>/` are NOT imported by any other module - the runtime invokes them as standalone Node processes. The wiring lives in:

| Runtime | Settings file | Wiring shape |
|---|---|---|
| Claude | `.claude/settings.local.json` | Nested `hooks.<Event>[].hooks[]` array; each entry has `type: "command"` + `command` string |
| Codex | `.codex/settings.json` | Nested `hooks.<Event>[].hooks[]` array; same shape as Claude |
| Gemini | `.gemini/settings.json` | Nested `hooks.<Event>[].hooks[]` array; entries also carry a `name` field |
| Copilot | `mcp_server/hooks/copilot/README.md` | Custom-instructions writer (no native hook contract); invoked from a Copilot-supported command surface |

The audit at packet `003-dead-code-audit` reached the same conclusion: 15 hook entrypoints classified `dynamic-only-reference` with `keep-with-rationale` (audit report §"Category: `dynamic-only-reference`"). KEEP unless a hook-removal packet proves the wiring is gone.

### Reachability Rule

A hook source file is alive iff:
1. The compiled `dist/hooks/<runtime>/<name>.js` artifact exists after `npm run build`, AND
2. Some `settings.json` (or runtime contract README, for Copilot) references that compiled path.

Removing the source without removing the settings entry produces a runtime error at session start. Removing the settings entry without removing the source produces an orphan that future audits will surface.

---

<!-- /ANCHOR:dynamic-load-pattern -->
<!-- ANCHOR:claude-hooks -->
## 3. CLAUDE HOOKS

`mcp_server/hooks/claude/` - 4 wired entrypoints + shared helpers.

| Entrypoint | Runtime event | Settings line |
|---|---|---|
| `user-prompt-submit.ts` | `UserPromptSubmit` | `.claude/settings.local.json:31` |
| `compact-inject.ts` | `PreCompact` | `.claude/settings.local.json:43` |
| `session-prime.ts` | `SessionStart` | `.claude/settings.local.json:55` |
| `session-stop.ts` | `Stop` | `.claude/settings.local.json:67` |

Helper modules (statically imported by the entrypoints, NOT directly wired): `claude-transcript.ts`, `hook-state.ts`, `shared.ts`.

### Wiring Shape

```jsonc
"UserPromptSubmit": [
  {
    "matcher": "",
    "hooks": [
      {
        "type": "command",
        "command": "bash -c 'cd \"<repo>\" && /opt/homebrew/bin/node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/user-prompt-submit.js'",
        "timeout": 3
      }
    ]
  }
]
```

The nested shape (`hooks.<Event>[].hooks[]`) is required. A flat shape with top-level `command` is rejected by Claude Code at session start with `Expected array, received undefined`.

---

<!-- /ANCHOR:claude-hooks -->
<!-- ANCHOR:codex-hooks -->
## 4. CODEX HOOKS

`mcp_server/hooks/codex/` - 3 wired entrypoints + 1 fallback wrapper + setup helper.

| Entrypoint | Runtime event | Settings line |
|---|---|---|
| `session-start.ts` | `SessionStart` | `.codex/settings.json:8` |
| `user-prompt-submit.ts` | `UserPromptSubmit` | `.codex/settings.json:19` |
| `pre-tool-use.ts` | `PreToolUse` | `.codex/settings.json:30` |
| `prompt-wrapper.ts` | (fallback) | Documented in `references/hooks/skill-advisor-hook.md:60`; runs only when Codex hook policy reports hooks unavailable |

`setup.ts` is a configuration helper for the Codex hook system (not a runtime entrypoint).

### Wiring Shape

```jsonc
"SessionStart": [
  {
    "hooks": [
      {
        "type": "command",
        "command": "bash -c 'cd \"$(git rev-parse --show-toplevel 2>/dev/null || pwd)\" && node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/codex/session-start.js'",
        "timeout": 3
      }
    ]
  }
]
```

Codex hook stdin JSON wins over argv JSON when both are present (per advisor hook reference §2).

---

<!-- /ANCHOR:codex-hooks -->
<!-- ANCHOR:gemini-hooks -->
## 5. GEMINI HOOKS

`mcp_server/hooks/gemini/` - 5 wired entrypoints + shared helpers.

| Entrypoint | Runtime event | Settings line |
|---|---|---|
| `session-prime.ts` | `SessionStart` | `.gemini/settings.json:77` |
| `compact-cache.ts` | `PreCompress` | `.gemini/settings.json:89` |
| `compact-inject.ts` | `BeforeAgent` | `.gemini/settings.json:101` |
| `user-prompt-submit.ts` | `BeforeAgent` (paired with `compact-inject`) | `.gemini/settings.json:107` |
| `session-stop.ts` | `SessionEnd` | `.gemini/settings.json:119` |

Helper module: `shared.ts`.

### Wiring Shape

```jsonc
"BeforeAgent": [
  {
    "hooks": [
      {
        "name": "speckit-compact-inject",
        "type": "command",
        "command": "bash -c 'cd \"$(git rev-parse --show-toplevel 2>/dev/null || pwd)\" && node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/gemini/compact-inject.js'",
        "timeout": 3000
      },
      {
        "name": "speckit-user-prompt-advisor",
        "type": "command",
        "command": "bash -c 'cd \"$(git rev-parse --show-toplevel 2>/dev/null || pwd)\" && node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/gemini/user-prompt-submit.js'",
        "timeout": 3000
      }
    ]
  }
]
```

Gemini accepts a `name` field on each hook entry - Claude and Codex do not.

---

<!-- /ANCHOR:gemini-hooks -->
<!-- ANCHOR:copilot-hooks -->
## 6. COPILOT HOOKS

`mcp_server/hooks/copilot/` - managed custom-instructions writer pattern, NOT a native hook contract.

GitHub's Copilot CLI hook contract currently ignores `sessionStart` output and ignores `userPromptSubmitted` output for prompt modification. Copilot hooks therefore do not return model-visible `additionalContext`. They refresh Copilot's supported custom-instructions surface (`$HOME/.copilot/copilot-instructions.md`) inside a managed block bounded by `SPEC-KIT-COPILOT-CONTEXT` markers.

| Helper | Role | Canonical doc |
|---|---|---|
| `custom-instructions.ts` | Owns the managed block in `$HOME/.copilot/copilot-instructions.md` | `mcp_server/hooks/copilot/README.md:18` |
| `session-prime.ts` | Builds startup context, refreshes managed block during `sessionStart` | `mcp_server/hooks/copilot/README.md:18` |
| `user-prompt-submit.ts` | Builds advisor brief during `userPromptSubmitted`, refreshes managed block, returns `{}` | `mcp_server/hooks/copilot/README.md:18` |
| `compact-cache.ts` | Keeps compact recovery state available for wrapper surfaces | `mcp_server/hooks/copilot/README.md:18` |

### Invocation

Copilot does NOT use `.claude/settings.local.json` or its nested hook block. Wire Copilot through a Copilot-supported command surface that executes the compiled writers:

```bash
node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/copilot/session-prime.js
printf '%s' '{"prompt":"<prompt>","cwd":"'"$PWD"'"}' | \
  node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/copilot/user-prompt-submit.js
```

Control flags: `SPECKIT_COPILOT_INSTRUCTIONS_DISABLED=1` skips the writer; `SPECKIT_COPILOT_INSTRUCTIONS_PATH` overrides the target file (useful for tests).

See `mcp_server/hooks/copilot/README.md` for the full contract; do NOT duplicate that content here.

---

<!-- /ANCHOR:copilot-hooks -->
<!-- ANCHOR:maintenance-checklist -->
## 7. MAINTENANCE CHECKLIST

### Editing an Existing Hook

```
□ Read the source file before editing
□ Verify the dist/ path in settings.json still resolves after `npm --prefix .opencode/skill/system-spec-kit/mcp_server run build`
□ Run the per-runtime smoke test from `references/hooks/skill-advisor-hook.md §4`
□ Confirm fail-open behavior: errors must return `{}` or empty `additionalContext`, never throw to the runtime
```

### Adding a Hook

```
□ Author the TypeScript source under `mcp_server/hooks/<runtime>/<name>.ts`
□ Register the wiring entry in the matching settings.json (Claude/Codex/Gemini) or document in the Copilot README
□ Build to confirm the dist artifact emits: `npm --prefix .opencode/skill/system-spec-kit/mcp_server run build`
□ Smoke-test with the runtime's documented invocation form (advisor hook ref §4 has examples)
□ Consider parity: if the feature applies to other runtimes, register there too (see §8)
```

### Removing a Hook

```
□ Delete the source file under `mcp_server/hooks/<runtime>/`
□ Delete the wiring entry from the matching settings.json (or Copilot README reference)
□ Rebuild to remove the stale dist artifact
□ Verify no other hook helper imports the deleted module
□ If skipping either step: future dead-code audits will surface the orphan
```

### Cross-Runtime Parity

Hooks are RUNTIME-SPECIFIC. Adding `compact-inject` to Claude does NOT auto-add it to Codex/Gemini/Copilot. Each runtime has different events (Claude uses `PreCompact`, Gemini uses `PreCompress` + `BeforeAgent`, Codex uses `PreToolUse`, Copilot has no native compact contract). Parity decisions are explicit:

| Question | Action |
|---|---|
| Does the feature need session-start priming? | Add to Claude (`session-prime`), Gemini (`session-prime`), Codex (`session-start`), Copilot (`session-prime`) |
| Does the feature run per-prompt? | Add to Claude/Codex/Gemini `user-prompt-submit` and Copilot's writer |
| Does the feature run on compaction? | Map runtime-specific event names: Claude `PreCompact`, Gemini `PreCompress`/`BeforeAgent`, Codex no native event, Copilot via cache helper |

---

<!-- /ANCHOR:maintenance-checklist -->
<!-- ANCHOR:related-resources -->
## 8. RELATED RESOURCES

### Canonical Evidence

- Dead-code audit (003): `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/003-dead-code-audit/dead-code-audit-report.md` - 15 hook entrypoints classified `dynamic-only-reference`, KEEP
- Per-runtime hook directories: `mcp_server/hooks/{claude,codex,gemini,copilot}/README.md`

### Runtime-Specific Deep-Dives (do not duplicate)

- Skill Advisor hook contract + smoke tests: `system-spec-kit/references/hooks/skill-advisor-hook.md`
- Skill Advisor hook validation procedures: `system-spec-kit/references/hooks/skill-advisor-hook-validation.md`
- Runtime hook system internals: `system-spec-kit/references/config/hook_system.md`

### Settings Files (wiring source-of-truth)

- `.claude/settings.local.json`
- `.codex/settings.json`
- `.gemini/settings.json`
- `mcp_server/hooks/copilot/README.md` (Copilot has no settings.json contract)

### Framework Context

- `CLAUDE.md` §"Session Start & Recovery" notes hook-capable runtimes auto-inject startup context; this reference is the implementation-side complement.
<!-- /ANCHOR:related-resources -->
