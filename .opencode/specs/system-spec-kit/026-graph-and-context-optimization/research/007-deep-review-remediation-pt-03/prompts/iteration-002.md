# Deep-Research Iteration 2 of 10

## STATE

STATE SUMMARY:
Segment: 1 | Iteration: 2 of 10
Questions: ~5/10 partially answered | Last focus: Ground-truth the current hook-config schema from primary sources
Last 2 ratios: N/A -> 0.74 | Stuck count: 0
Next focus: Identify the exact config entry (or other file) that Copilot rejects with "Neither 'bash' nor 'powershell'", and extract the Copilot binary's hook validator source.

Research Topic (unchanged): Copilot CLI 1.0.34 hook-config JSON schema resolution.

## PRIOR ITERATION SUMMARY (iteration-001, newInfoRatio=0.74)

Key findings from iteration 1:
- **F1**: Official docs still document the flat `{ "type": "command", "bash": "...", "powershell": "...", "cwd": "...", "timeoutSec": N }` schema (https://docs.github.com/en/copilot/reference/hooks-configuration lines 541-558, https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/copilot-cli/customize-copilot/use-hooks lines 513-589). **No schema migration detected.**
- **F3**: `.github/hooks/superset-notify.json` IS schema-valid on disk — every entry has the `bash` key. Yet the error persists.
- **F4**: `/Users/michelkerkmeester/.superset/bin/copilot:30-69` REWRITES `.github/hooks/superset-notify.json` on every launch when `SUPERSET_TAB_ID` is set — replacing the content with direct `.superset/hooks/copilot-hook.sh <event>` entries, bypassing `.github/hooks/scripts/*.sh`.
- **F5**: The `"Neither 'bash' nor 'powershell'"` error predates Copilot 1.0.34 — it appears in logs for versions 1.0.14, 1.0.15, 1.0.19, 1.0.20, 1.0.25, 1.0.29, 1.0.32. So it's NOT a 1.0.34 regression. Cleanest hypothesis: Copilot loads additional config from somewhere we haven't identified yet, and THAT somewhere has an entry missing `bash`/`powershell`.
- **F6**: Debug run `COPILOT_DEBUG=1 copilot -p "test" --allow-all-tools --no-ask-user` fails with `SecItemCopyMatching -50` (Keychain inaccessible) inside the sandbox — can't get live schema-validation trace this way.

### Proposed patch from iter-1 (for future implementation, NOT to apply now)
Revert `.github/hooks/superset-notify.json` to point at `.github/hooks/scripts/<event>.sh` wrappers with `cwd: .github/hooks` and `timeoutSec: 10` + add preToolUse. BUT: superset wrapper will clobber it, so durable fix needs wrapper patch too.

## STATE FILES

- Config: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-03/deep-research-config.json
- State Log: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-03/deep-research-state.jsonl
- Strategy: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-03/deep-research-strategy.md
- Registry: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-03/findings-registry.json
- Write iteration narrative to: iterations/iteration-002.md
- Write per-iteration delta file to: deltas/iter-002.jsonl

## FOCUS FOR ITERATION 2

Nail down **which config object** Copilot is rejecting. Two parallel attacks:

### Attack A: Extract Copilot's bundled JS and read the validator source
- `/opt/homebrew/Caskroom/copilot-cli/0.0.420/copilot` is a 134MB Mach-O arm64 binary. Likely a Node.js SEA (single-executable application) or pkg/nexe bundle with embedded JS.
- Try extracting the embedded JS:
  - `strings -a -n 4 /opt/homebrew/Caskroom/copilot-cli/0.0.420/copilot | grep -iE "Neither|hook command configuration" | head` — may fail if compressed
  - Look for SEA blob markers: `xxd -s <offset>` scanning for `NODE_SEA_FUSE`, `nexe`, or `pkg`
  - `unzip -l /opt/homebrew/Caskroom/copilot-cli-0.0.420.zip 2>/dev/null` if a pre-install archive exists in `/opt/homebrew/Caskroom/`
  - `brew list --cask copilot-cli --verbose` to find install artifacts
  - Check `~/Library/Application Support/Code/User/globalStorage/github.copilot-chat/copilotCli/copilot` — possibly a cached older variant we CAN grep as text.
  - Try `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/node_modules/@github/copilot-sdk/node_modules/@github/copilot/node_modules/@github/copilot-darwin-arm64/copilot` — this local SDK copy may be a different arch or version but might still contain the validator text as gzipped or uncompressed JS.
- Once the validator is found, read the code path that throws `"Neither 'bash' nor 'powershell' specified"` — it will reveal what shape the entry must have.

### Attack B: Find the offending config object via log archaeology + hook discovery
- The error has NO file path or event name in `~/.copilot/logs/process-*.log`. Maybe Copilot logs more verbose context when started with `LOG_LEVEL=debug` or a specific env var. Try:
  - `COPILOT_LOG_LEVEL=debug`, `DEBUG=copilot:*`, `NODE_DEBUG=copilot`, `LOG_LEVEL=trace`
  - `copilot --help` + `copilot --help-hooks` if such subcommand exists
- Check if Copilot merges hooks from MULTIPLE locations in priority order. Possible additional paths:
  - `$HOME/.copilot/hooks.json` (doesn't exist now, but maybe merged as empty)
  - `.copilot/hooks.json` (per-repo alt location)
  - `.github/hooks/` *ANY* `.json` file (only `superset-notify.json` exists — but maybe IDE-installed Copilot adds hooks from somewhere else)
  - VSCode extension's `github.copilot-chat` install dir has a `copilot` binary; maybe it ships its own hook config that `copilot-cli` inherits.
- Check the IDE copilot binary at `/Users/michelkerkmeester/Library/Application Support/Code/User/globalStorage/github.copilot-chat/copilotCli/copilot`:
  - Is it a different version? (`--version`)
  - Does it have the same bug?
  - If it's a plain Node script (not Mach-O), GREP IT for the error message.
- Check for any embedded default hook config INSIDE the 1.0.34 binary that ships with bad entries. Maybe the binary has a DEFAULT hooks config shipped with it that's syntactically broken.
- Revisit the superset-wrapper-generated content one more time: the version at line 30-69 of `/Users/michelkerkmeester/.superset/bin/copilot` — does it generate ALL 4 events with proper bash keys? Or are some entries dropped?

### Don't re-do
- The docs schema discovery (covered in iter 1).
- The superset wrapper's clobber behavior (covered in iter 1 F4).
- Historical log archaeology across versions (covered in iter 1 F5).

## OUTPUT CONTRACT

Same as iteration 1:
1. **Iteration narrative markdown** at `iterations/iteration-002.md` with Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Next Focus sections.
2. **Canonical JSONL iteration record** APPENDED to `deep-research-state.jsonl`:
```json
{"type":"iteration","iteration":2,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[...]}
```
3. **Per-iteration delta file** at `deltas/iter-002.jsonl` with one `type:"iteration"` record + per-event records.

## KEY ASKS

Answer as many as possible:
- **KQ-2 concretely**: What's the config object Copilot rejects? (Name the file path and the entry JSON fragment, or at least narrow it to ≤2 candidates.)
- **KQ-5/KQ-6**: Do you have Copilot's validator source text? If yes, paste the validator function and cite file+line.
- **KQ-9**: What does `copilot --acp` look like today (0.122.0 codex parity was outcome A — is there a parallel ACP surface in copilot 1.0.34)? Run `copilot --acp --help` if possible.

Begin iteration now. Write the 3 artifacts.
