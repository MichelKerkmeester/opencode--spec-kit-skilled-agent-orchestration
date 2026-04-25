# Iteration 001 - Copilot CLI Hook Schema Ground Truth

## Focus

Ground-truth the current Copilot CLI 1.0.34 hook-config schema from primary sources, with special attention to the `"Neither 'bash' nor 'powershell' specified in hook command configuration"` failure.

## Actions Taken

1. Located the active `copilot` command path and package sources:
   - `which copilot` resolves first to `/Users/michelkerkmeester/.superset/bin/copilot`.
   - `type -a copilot` shows the Superset wrapper first and `/opt/homebrew/bin/copilot` second.
   - `/opt/homebrew/bin/copilot` is a symlink to `/opt/homebrew/Caskroom/copilot-cli/0.0.420/copilot`.
   - `brew info --cask copilot-cli` reports `copilot-cli (GitHub Copilot CLI): 1.0.34 (auto_updates)` and the installed artifact path `/opt/homebrew/Caskroom/copilot-cli/0.0.420`.
   - The npm packages under nvm are `@github/copilot` `0.0.334` and `0.0.354`, not the active Homebrew 1.0.34 binary; neither package exposed a hook schema file or the exact error string in direct package scans.

2. Inspected the active wrapper and local hook files:
   - `/Users/michelkerkmeester/.superset/bin/copilot:28` says Copilot CLI supports project-level hooks in `.github/hooks/*.json` in the current working directory.
   - `/Users/michelkerkmeester/.superset/bin/copilot:31-69` rewrites `.github/hooks/superset-notify.json` whenever `SUPERSET_TAB_ID` is set.
   - The rewritten file uses direct Superset lifecycle commands, not the system-spec-kit hook scripts.
   - The current repo config is schema-shaped correctly: `.github/hooks/superset-notify.json:4-30` has `type: "command"` and flat `bash` fields for `sessionStart`, `sessionEnd`, `userPromptSubmitted`, and `postToolUse`.

3. Inspected the failure log and nearby runtime data:
   - `~/.copilot/logs/process-1776864631540-59265.log:45` reports current version `1.0.34`.
   - The same log records the target failure at `:69`, `:93`, `:132`, `:134`, `:156`, `:158`, `:171`, and `:190`.
   - `COPILOT_DEBUG=1 /opt/homebrew/bin/copilot -p "test hook schema" --allow-all-tools --no-ask-user` did not reach hook parsing in this sandbox; it failed immediately with `ERROR: SecItemCopyMatching failed -50`.
   - Historical log search found the same hook error in older Copilot versions, including 1.0.14, 1.0.15, 1.0.19, 1.0.20, 1.0.25, 1.0.29, and 1.0.32. This weakens the "1.0.34 schema regression" hypothesis.

4. Consulted official GitHub docs:
   - The GitHub Enterprise Cloud "Use hooks" page says hook config files are named by choice under `.github/hooks/`; Copilot CLI loads hooks from the current working directory, and hook syntax is configured under `bash` or `powershell` keys. Source: https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/copilot-cli/customize-copilot/use-hooks lines 513-543.
   - The same page examples show flat `"type": "command"`, `"bash": "..."`, `"powershell": "..."`, `"cwd": "..."`, and `"timeoutSec": ...`. Source: same page lines 547-589.
   - The hooks reference shows the same flat command shape for `sessionStart`: `type`, `bash`, `powershell`, `cwd`, `timeoutSec`. Source: https://docs.github.com/en/copilot/reference/hooks-configuration lines 541-558.
   - The CLI command reference lists the broader hook event surface and confirms `sessionStart`, `sessionEnd`, `userPromptSubmitted`, `preToolUse`, `postToolUse`, `postToolUseFailure`, `agentStop`, `subagentStop`, `subagentStart`, `preCompact`, `permissionRequest`, `errorOccurred`, and `notification`. Source: https://docs.github.com/en/enterprise-cloud@latest/copilot/reference/copilot-cli-reference/cli-command-reference lines 910-923.
   - The command reference says event payload format is selected by the configured event name: camelCase names get camelCase fields; PascalCase names get VS Code-compatible snake_case fields. Source: same page lines 924-930.

5. Inspected system-spec-kit hook scripts:
   - `.github/hooks/scripts/session-start.sh:17-21` calls `.opencode/skill/system-spec-kit/mcp_server/dist/hooks/copilot/session-prime.js` and falls back only if that script fails.
   - `.github/hooks/scripts/user-prompt-submitted.sh:17-23` calls `.opencode/skill/system-spec-kit/mcp_server/dist/hooks/copilot/user-prompt-submit.js`, then prints `{}`.
   - `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts:168-190` writes `$HOME/.copilot/copilot-instructions.md` with source `system-spec-kit copilot sessionStart hook`.
   - `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:120-129` writes the same managed instructions file with source `system-spec-kit copilot userPromptSubmitted hook`.
   - `$HOME/.copilot/copilot-instructions.md:5-6` currently shows `Refreshed: 2026-04-22T11:08:14.595Z` and `Source: system-spec-kit copilot sessionStart hook`, proving the session-start writer ran before the current inspection.

## Findings

### F1 - The accepted command schema still uses flat `bash` / `powershell`

Official GitHub docs still document flat hook command entries:

```json
{
  "type": "command",
  "bash": "./scripts/session-start.sh",
  "powershell": "./scripts/session-start.ps1",
  "cwd": "scripts",
  "timeoutSec": 30
}
```

Sources: GitHub hooks reference lines 541-558; GitHub "Use hooks" page lines 543-589.

Conclusion: KQ-3 is answered negatively for now. I found no primary-source evidence that `command`, `run`, `shell`, or `command: { bash: ... }` replaced flat `bash`.

### F2 - Config discovery is repository `.github/hooks/*.json` from the CLI current working directory

GitHub docs say the hooks file lives in `.github/hooks/` and that Copilot CLI loads hooks from the current working directory. Source: GitHub "Use hooks" page lines 513-516.

The local Superset wrapper independently encodes the same assumption at `/Users/michelkerkmeester/.superset/bin/copilot:28-32`.

Conclusion: KQ-4 is mostly answered. `~/.copilot/config.json` is not the hook source in this run; it has no `hooks` field, and the active repository file is `.github/hooks/superset-notify.json`.

### F3 - The current root hook file is schema-valid but no longer calls system-spec-kit scripts

`.github/hooks/superset-notify.json:4-30` contains flat `bash` fields, so it is not missing `bash` on disk. However, its current content calls `/Users/michelkerkmeester/.superset/hooks/copilot-hook.sh ...` directly for all events. That script only emits `{}` and posts Superset notifications; it does not refresh `$HOME/.copilot/copilot-instructions.md`. Sources: `.github/hooks/superset-notify.json:4-30`, `/Users/michelkerkmeester/.superset/hooks/copilot-hook.sh:15-40`.

The intended per-prompt refresh path appears to be `.github/hooks/scripts/user-prompt-submitted.sh:17-23`, which calls `user-prompt-submit.js`; that compiled hook writes source `system-spec-kit copilot userPromptSubmitted hook` via `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:120-129`.

Conclusion: KQ-10 cannot pass with the currently inspected root config, even if the missing-`bash` error is resolved, because the userPromptSubmitted event no longer invokes the system-spec-kit writer.

### F4 - The Superset wrapper is clobbering `.github/hooks/superset-notify.json`

The active PATH entry is `/Users/michelkerkmeester/.superset/bin/copilot`. That wrapper creates `.github/hooks` and rewrites `.github/hooks/superset-notify.json` on every run with `SUPERSET_TAB_ID` set. Sources: `/Users/michelkerkmeester/.superset/bin/copilot:22-23` for real-binary resolution and `:30-69` for rewrite behavior.

Conclusion: Any patch applied only to `.github/hooks/superset-notify.json` will be fragile unless either the wrapper is patched or Copilot is invoked without that wrapper/environment. This likely explains why the config differs from the background sample that used `.github/hooks/scripts/session-start.sh` and `.github/hooks/scripts/user-prompt-submitted.sh`.

### F5 - The specific failure is not proven to be a 1.0.34 schema change

The target 1.0.34 log has repeated `"Neither 'bash' nor 'powershell' specified in hook command configuration"` errors, but no stack trace or event name. Source: `~/.copilot/logs/process-1776864631540-59265.log:69`, `:93`, `:132`, `:134`, `:156`, `:158`, `:171`, `:190`.

Historical logs show the same error across older versions, including 1.0.14 through 1.0.32. Source: local `rg` over `~/.copilot/logs` at `2026-04-22T13:58:12Z`, which returned older process logs such as `process-1774966622513-35174.log:7466`, `process-1775060244008-4259.log:8716`, `process-1775557404814-76469.log:182`, `process-1776356284481-31498.log:13093`, and `process-1776584430541-70071.log:14542`.

Conclusion: KQ-2 remains only partially answered. The cleanest current hypothesis is not a same-day schema change. It is either a different loaded hook file at runtime, a wrapper/clobber race, or a Copilot internal hook entry from a config layer not surfaced by the root `.github/hooks/superset-notify.json` inspection.

### F6 - No schema-validation trace was obtained in this sandbox

`COPILOT_DEBUG=1 /opt/homebrew/bin/copilot -p "test hook schema" --allow-all-tools --no-ask-user` failed before hook loading with `ERROR: SecItemCopyMatching failed -50`. Source: shell output at `2026-04-22T13:57:41Z`.

Conclusion: KQ-5 remains open. A live terminal with Keychain access is needed to get an empirical parser trace.

### F7 - NPM package inspection did not reveal the active schema

`npm root -g` points to `/opt/homebrew/lib/node_modules`, which does not contain `@github/copilot`. NVM has `@github/copilot` versions `0.0.334` and `0.0.354`, but active PATH resolution reaches the Homebrew Cask binary. The Cask reports Copilot CLI 1.0.34. Source: shell outputs at `2026-04-22T13:56:38Z`, `2026-04-22T13:57:01Z`, and `2026-04-22T13:57:20Z`.

Conclusion: KQ-6 is partially answered. No JSON schema file was found in the npm packages, but the active binary is not inspectable as plain JS with `rg`; further binary extraction would be a separate iteration.

## Questions Answered

- KQ-1: Partially answered. The command schema for current docs is flat `type: "command"`, `bash`, `powershell`, optional `cwd`, optional `timeoutSec`, optional `env`, and event arrays under top-level `hooks`. The docs also name additional events beyond the original 5/6.
- KQ-3: Answered for current public docs: no replacement key found; flat `bash` remains documented.
- KQ-4: Mostly answered: Copilot CLI loads `.github/hooks/*.json` from the current working directory; local wrapper confirms the project-level path assumption.
- KQ-6: Partially answered: no schema file found in npm packages; active Homebrew binary remains opaque.
- KQ-7: Proposed patch below.
- KQ-8: Partially answered: flat `bash` is current documented schema, not deprecated in docs. No live parser warning was obtained.

## Questions Remaining

- KQ-2: Need direct evidence of which hook event/config object produced the missing `bash` error. Current log does not name the event.
- KQ-5: Need a debug trace from a non-sandboxed terminal where Copilot can access Keychain.
- KQ-6: Need either official source package, release artifact source map, or binary extraction if the internal validator must be cited.
- KQ-9: ACP fallback not investigated in this iteration.
- KQ-10: Needs live patched-session verification.

## Proposed JSON Patch

This patch restores the system-spec-kit writer scripts while keeping Superset notifications through `superset-notify.sh`. It also adds `preToolUse` coverage, uses docs-aligned `cwd`, and avoids absolute Superset hook commands in the JSON.

```diff
--- a/.github/hooks/superset-notify.json
+++ b/.github/hooks/superset-notify.json
@@
 {
   "version": 1,
   "hooks": {
     "sessionStart": [
       {
         "type": "command",
-        "bash": "/Users/michelkerkmeester/.superset/hooks/copilot-hook.sh sessionStart",
-        "timeoutSec": 5
+        "bash": "./scripts/session-start.sh",
+        "cwd": ".github/hooks",
+        "timeoutSec": 10
       }
     ],
     "sessionEnd": [
       {
         "type": "command",
-        "bash": "/Users/michelkerkmeester/.superset/hooks/copilot-hook.sh sessionEnd",
+        "bash": "./scripts/superset-notify.sh sessionEnd",
+        "cwd": ".github/hooks",
         "timeoutSec": 5
       }
     ],
     "userPromptSubmitted": [
       {
         "type": "command",
-        "bash": "/Users/michelkerkmeester/.superset/hooks/copilot-hook.sh userPromptSubmitted",
-        "timeoutSec": 5
+        "bash": "./scripts/user-prompt-submitted.sh",
+        "cwd": ".github/hooks",
+        "timeoutSec": 10
+      }
+    ],
+    "preToolUse": [
+      {
+        "type": "command",
+        "bash": "./scripts/superset-notify.sh preToolUse",
+        "cwd": ".github/hooks",
+        "timeoutSec": 5
       }
     ],
     "postToolUse": [
       {
         "type": "command",
-        "bash": "/Users/michelkerkmeester/.superset/hooks/copilot-hook.sh postToolUse",
+        "bash": "./scripts/superset-notify.sh postToolUse",
+        "cwd": ".github/hooks",
         "timeoutSec": 5
       }
     ]
   }
 }
```

Important implementation caveat: the active Superset wrapper at `/Users/michelkerkmeester/.superset/bin/copilot:31-69` will overwrite this file when `SUPERSET_TAB_ID` is present. A durable fix must update the wrapper generation template as well as the checked repo file.

## Empirical Reproducer

Because this sandbox cannot run Copilot past Keychain auth (`SecItemCopyMatching failed -50`), the live reproducer should be run from a normal terminal where `copilot -p` already works:

```bash
set -euo pipefail

cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public

jq . .github/hooks/superset-notify.json >/dev/null
chmod +x .github/hooks/scripts/session-start.sh \
  .github/hooks/scripts/user-prompt-submitted.sh \
  .github/hooks/scripts/superset-notify.sh

before="$(awk -F': ' '/^Refreshed:/ {print $2; exit}' "$HOME/.copilot/copilot-instructions.md" 2>/dev/null || true)"

COPILOT_DEBUG=1 copilot -p "hook schema smoke: answer OK only" --allow-all-tools --no-ask-user

latest_log="$(ls -t "$HOME"/.copilot/logs/process-*.log | head -1)"
! rg -n "Neither 'bash' nor 'powershell' specified in hook command configuration" "$latest_log"

after="$(awk -F': ' '/^Refreshed:/ {print $2; exit}' "$HOME/.copilot/copilot-instructions.md")"
test "$after" != "$before"
rg -n "Source: system-spec-kit copilot userPromptSubmitted hook" "$HOME/.copilot/copilot-instructions.md"
```

Expected result:

- `jq` passes.
- Copilot completes the prompt.
- Latest Copilot log does not contain the missing `bash`/`powershell` error.
- `$HOME/.copilot/copilot-instructions.md` has a later `Refreshed:` timestamp and source `system-spec-kit copilot userPromptSubmitted hook`.

## Next Focus

Iteration 2 should determine the exact runtime object that is missing `bash`/`powershell`. Best next actions:

1. Run the empirical reproducer from a normal authenticated terminal.
2. Patch or bypass `/Users/michelkerkmeester/.superset/bin/copilot` temporarily to stop clobbering `.github/hooks/superset-notify.json`.
3. Add a deliberately invalid second hook file in a disposable repo to confirm whether Copilot logs the file/event name with any verbose flag.
4. If still opaque, inspect Homebrew Cask release metadata or binary extraction paths for the internal hook validator.
