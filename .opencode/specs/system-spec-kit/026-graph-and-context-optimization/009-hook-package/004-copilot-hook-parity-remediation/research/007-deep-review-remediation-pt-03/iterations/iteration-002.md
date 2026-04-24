# Iteration 002 - Locate Rejected Hook Object and Validator Source

## Focus

Identify the exact hook config object Copilot rejects with `Neither 'bash' nor 'powershell' specified in hook command configuration`, extract the Copilot 1.0.34 hook validator source, and check whether the current CLI exposes an ACP surface comparable to Codex ACP.

## Actions Taken

1. Re-read the active research packet, iteration-001 narrative, the current project hook file, and `/Users/michelkerkmeester/.superset/bin/copilot`.
2. Re-checked the generated `.github/hooks/superset-notify.json` and the Superset wrapper generator. The wrapper emits all four events with `bash` fields and `timeoutSec: 5`.
3. Searched likely local hook/config locations:
   - `.github/hooks/`
   - `.github/copilot/`
   - `~/.copilot/config.json`
   - `~/.copilot/hooks*`
   - `~/.codex/hooks.json`
   - installed Codex plugin hook files
4. Checked Copilot logs around the current failures. The process logs contain repeated hook execution failures, but still no file path, event name, or hook command context.
5. Inspected the Homebrew binary and current extracted package:
   - `/opt/homebrew/Caskroom/copilot-cli/0.0.420/copilot` is a Mach-O arm64 Node SEA launcher.
   - The launcher contains a `NODE_SEA_FUSE` marker and extraction logic for bundled JS.
   - The active readable package exists at `/Users/michelkerkmeester/.copilot/pkg/universal/1.0.34/`.
6. Read the current 1.0.34 hook schema and executor source in `/Users/michelkerkmeester/.copilot/pkg/universal/1.0.34/app.js`.
7. Ran ACP help through the extracted package with isolated writable home/cache directories:
   - `COPILOT_HOME=/tmp/copilot-home-iter2 COPILOT_CACHE_HOME=/tmp/copilot-cache-iter2 node ~/.copilot/pkg/universal/1.0.34/app.js --acp --help`

## Findings

### F8 - Current 1.0.34 hook validator source was found

The current source is readable in:

`/Users/michelkerkmeester/.copilot/pkg/universal/1.0.34/app.js`

The bundled file is packed onto long lines, so the line citations are coarse but reproducible by line and column:

- Validator/normalizer helpers: `app.js:223:66844` and nearby.
- Executor throw site: `app.js:1194:2793`.
- ACP flag registration/help: `app.js:5450:3839`.

Relevant validator snippets:

```js
function C1e(t){t.command!==void 0&&(t.bash===void 0&&(t.bash=t.command),t.powershell===void 0&&(t.powershell=t.command)),t.timeout!==void 0&&t.timeoutSec===void 0&&(t.timeoutSec=t.timeout);let{timeout:e,command:r,...n}=t;return n}
```

```js
function m2t(t){let e={};for(let[r,n]of Object.entries(t)){if(!Array.isArray(n))throw new Error(`Expected array for hook event ${r}`);let i=[];for(let o of n)if(Array.isArray(o.hooks)){for(let s of o.hooks){if("hooks"in s)throw new Error("Nested hooks deeper than one level are not supported");let a=o.matcher!==void 0?{...s,matcher:o.matcher}:s;i.push(a)}}else i.push(o);e[r]=i}return e}
```

```js
let A1e=t=>t.bash!==void 0||t.powershell!==void 0||t.command!==void 0,y1e="At least one of 'bash', 'powershell', or 'command' must be specified",QU=b1e.refine(A1e,{message:y1e}).transform(C1e);
```

The key schema consequence: Copilot 1.0.34 accepts `command` as an alias and normalizes it into both `bash` and `powershell`. It also accepts one level of nested VS Code/Codex-style hook wrappers.

### F9 - The executor still throws only after normalization has failed or been bypassed

The execution path still requires `bash` or `powershell` by the time the command object reaches the hook runner:

```js
async function jer(t,e,r,n){let o,s;if(t.bash&&t.powershell)o=process.platform==="win32"?"powershell":"bash",s=o==="powershell"?t.powershell:t.bash;else if(t.bash)o="bash",s=t.bash;else if(t.powershell)o="powershell",s=t.powershell;else throw new Error("Neither 'bash' nor 'powershell' specified in hook command configuration");
```

This means the observed error is not thrown by the schema validator itself. It is thrown by the hook executor when it receives an object without `bash` or `powershell`.

### F10 - The visible project hook file is not the rejected object

Current project hook file:

`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.github/hooks/superset-notify.json`

It contains four flat command entries and every entry has `bash`:

- `sessionStart`
- `sessionEnd`
- `userPromptSubmitted`
- `postToolUse`

The Superset wrapper at `/Users/michelkerkmeester/.superset/bin/copilot` regenerates the same shape when `SUPERSET_TAB_ID` is present. It does not drop an event entry or omit `bash`.

### F11 - Local candidates exist, but 1.0.34 should normalize them if they enter through the config parser

Two concrete local hook files contain `command` fields rather than direct `bash` fields:

`/Users/michelkerkmeester/.codex/hooks.json`

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "/Users/michelkerkmeester/.superset/hooks/notify.sh"
          }
        ]
      }
    ]
  }
}
```

`/Users/michelkerkmeester/.codex/.tmp/plugins/plugins/figma/hooks.json`

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "./scripts/post_write_figma_parity_check.sh"
          }
        ]
      }
    ]
  }
}
```

These are not sufficient proof of the failing object because the 1.0.34 parser explicitly supports this shape:

- VS Code/Codex event aliases are mapped to Copilot event names.
- One nested `hooks` wrapper is flattened.
- `command` is copied to both `bash` and `powershell`.

Therefore, if these files are loaded through `hKo`/`E1e`, they should not reach the executor in the rejected form. The remaining likely failure mode is that an extension/settings hook object is injected into the executor without passing through this normalizer.

### F12 - Logs still do not name the rejected file or event

The active log shows repeated failures like:

`Hook execution failed: Error: Neither 'bash' nor 'powershell' specified in hook command configuration`

but no surrounding `Executing hook:` debug line, event name, path, or JSON object. Attempts to inspect current logs did not surface a hidden path or event marker.

### F13 - Current settings search narrows the config surface

No `~/.copilot/hooks*` file or directory was found. `~/.copilot/config.json` contains account/trust/banner data and no hook objects.

The 1.0.34 source contains settings path names for:

- `.github/copilot/settings.json`
- `.github/copilot/settings.local.json`
- `.claude/settings.json`
- `.claude/settings.local.json`

No `.github/copilot/config.json` or `.github/copilot/settings*.json` was present in this repo during this iteration.

### F14 - ACP exists as a global flag in Copilot 1.0.34

`--acp` is present in the current 1.0.34 help text:

```text
--acp                         Start as Agent Client Protocol server
```

Running `node ~/.copilot/pkg/universal/1.0.34/app.js --acp --help` prints the normal global help and does not expose a separate ACP-specific help surface. Direct Homebrew binary execution remains unreliable in the sandbox because the binary tries to access user cache/keychain paths.

## Questions Answered

### KQ-5/KQ-6: Do we have Copilot's validator source text?

Yes. The current 1.0.34 source is in `/Users/michelkerkmeester/.copilot/pkg/universal/1.0.34/app.js`.

The validator accepts:

- `bash`
- `powershell`
- `command` alias
- `timeoutSec`
- `timeout` alias
- one level of nested `hooks`
- event aliases such as `SessionStart`, `UserPromptSubmit`, `PostToolUse`, and `Stop`

The executor still throws `Neither 'bash' nor 'powershell' specified...` if an object reaches execution without normalized shell fields.

### KQ-9: What does `copilot --acp` look like today?

Copilot 1.0.34 has a global `--acp` flag:

```text
--acp                         Start as Agent Client Protocol server
```

`--acp --help` does not show a dedicated ACP subcommand contract; it renders the global CLI help.

### KQ-2: What config object is rejected?

Not fully answered. The visible project hook file is ruled out. The exact rejected runtime object is narrowed to at most two practical classes:

1. A hook object from settings or an extension path that bypasses the `hKo`/`E1e` config normalizer before reaching the executor.
2. A local Codex/plugin hook object such as `~/.codex/hooks.json` or `.codex/.tmp/plugins/plugins/figma/hooks.json`, but only if Copilot imports it through a non-normalizing path. If it enters through the 1.0.34 parser, it should be valid.

## Questions Remaining

1. Which loader path is responsible for merging extension or settings hooks into the executor input?
2. Does Copilot load `~/.codex/hooks.json` or plugin `hooks.json` directly, or are those merely adjacent Codex configs?
3. Can the hook executor be instrumented locally in the extracted package to log the rejected object before the throw, using isolated `COPILOT_HOME`/`COPILOT_CACHE_HOME` to avoid keychain/cache failures?
4. Are `.claude/settings.json` or `.claude/settings.local.json` contributing hook config through a settings schema distinct from `.github/hooks/*.json`?

## Next Focus

Instrument the extracted 1.0.34 package or locate the hook merge call path so the rejected object can be printed before `jer()` throws. The highest-yield path is to patch a scratch copy of `/Users/michelkerkmeester/.copilot/pkg/universal/1.0.34/app.js` in `/tmp`, adding a diagnostic log immediately before the executor throw and running it with isolated `COPILOT_HOME` and `COPILOT_CACHE_HOME`. In parallel, trace references to `hKo`, `E1e`, and `jer` to identify every hook ingestion path and determine which one bypasses normalization.
