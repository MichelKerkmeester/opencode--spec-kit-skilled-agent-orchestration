# Deep-Research Iteration 1 of 10

## STATE

STATE SUMMARY:
Segment: 1 | Iteration: 1 of 10
Questions: 0/10 answered | Last focus: none yet
Last 2 ratios: N/A -> N/A | Stuck count: 0
Next focus: Ground-truth the current Copilot CLI 1.0.34 hook-config schema from primary sources.

Research Topic: Copilot CLI 1.0.34 hook-config JSON schema. Resolve the `"Neither 'bash' nor 'powershell' specified in hook command configuration"` execution failure blocking 026/007/007 copilot-hook-parity-remediation. Identify the schema Copilot CLI accepts for sessionStart / userPromptSubmitted / sessionEnd / postToolUse / preToolUse hooks, confirm the config-file discovery rules, and produce a concrete JSON patch to `.github/hooks/superset-notify.json` with an empirical reproducer.

Iteration: 1 of 10
Focus Area: Ground-truth the current Copilot CLI 1.0.34 hook-config schema from primary sources

Remaining Key Questions:
- KQ-1: What is the current (Copilot CLI 1.0.34) hook-config JSON schema? Field names, nesting, required vs optional keys, allowed values for each of the 6 hook events.
- KQ-2: Why does `sessionStart` succeed at 11:08 UTC while `userPromptSubmitted` fails at 13:30 UTC in the same config file?
- KQ-3: Is there a new required key (e.g., `command`, `run`, `shell`, or nested `command: { bash: ... }`) that replaced the flat `"bash": "..."` form?
- KQ-4: Which config-file path is Copilot CLI 1.0.34 actually reading?
- KQ-5: Does Copilot CLI emit a schema-validation trace that names the expected field?
- KQ-6: Does the Copilot CLI ship a JSON-schema file?
- KQ-7: What is the corrected JSON patch for `.github/hooks/superset-notify.json`?
- KQ-8: Does the old `"bash": "path"` schema produce a deprecation warning when parsed or does it fail silently?
- KQ-9: Is the ACP (`copilot --acp`) path viable as a fallback?
- KQ-10: After patching, does `$HOME/.copilot/copilot-instructions.md` `Refreshed:` timestamp advance on each prompt?

Last 3 Iterations Summary: (none yet — this is iteration 1)

## STATE FILES

All paths are relative to the repo root.

- Config: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-03/deep-research-config.json
- State Log: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-03/deep-research-state.jsonl
- Strategy: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-03/deep-research-strategy.md
- Registry: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-03/findings-registry.json
- Write iteration narrative to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-03/iterations/iteration-001.md
- Write per-iteration delta file to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-03/deltas/iter-001.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 3-5 research actions. Max 12 tool calls total.
- Write ALL findings to files. Do not hold in context.
- The workflow reducer owns strategy machine-owned sections, registry, and dashboard synchronization.

## OUTPUT CONTRACT

You MUST produce THREE artifacts per iteration:

1. **Iteration narrative markdown** at `iterations/iteration-001.md`. Structure: headings for Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Next Focus.

2. **Canonical JSONL iteration record** APPENDED to `deep-research-state.jsonl`. Use `"type":"iteration"` EXACTLY. Required schema:
```json
{"type":"iteration","iteration":1,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[/* optional */]}
```
Append single-line JSON with newline terminator: `echo '<single-line-json>' >> <path>`.

3. **Per-iteration delta file** at `deltas/iter-001.jsonl` with one `{"type":"iteration",...}` record plus per-event records (one JSON line each) for each finding, invariant, observation, edge, or ruled_out direction.

All three artifacts are REQUIRED.

## BACKGROUND CONTEXT FOR THIS ITERATION

**The failing scenario**: Copilot CLI 1.0.34 installed via `@github/copilot`. Repository has `.github/hooks/superset-notify.json`:
```json
{
  "version": 1,
  "hooks": {
    "sessionStart": [
      { "type": "command", "bash": ".github/hooks/scripts/session-start.sh", "timeoutSec": 5 }
    ],
    "sessionEnd": [
      { "type": "command", "bash": "/Users/michelkerkmeester/.superset/hooks/copilot-hook.sh sessionEnd", "timeoutSec": 5 }
    ],
    "userPromptSubmitted": [
      { "type": "command", "bash": ".github/hooks/scripts/user-prompt-submitted.sh", "timeoutSec": 5 }
    ],
    "postToolUse": [
      { "type": "command", "bash": "/Users/michelkerkmeester/.superset/hooks/copilot-hook.sh postToolUse", "timeoutSec": 5 }
    ]
  }
}
```

**Log error** from `~/.copilot/logs/process-1776864631540-59265.log`:
```
2026-04-22T13:30:37.080Z [ERROR] Hook execution failed: Error: Neither 'bash' nor 'powershell' specified in hook command configuration
2026-04-22T13:30:48.469Z [ERROR] Hook execution failed: Error: Neither 'bash' nor 'powershell' specified in hook command configuration
```

**Paradox**: at 11:08 UTC (earlier same day), the `sessionStart` hook DID fire — `$HOME/.copilot/copilot-instructions.md` has `Source: "system-spec-kit copilot sessionStart hook"`. So the same schema parsed at 11:08 but fails at 13:30. Either a Copilot upgrade happened, or event-specific validation differs.

`~/.copilot/config.json` has NO `hooks` field — only `banner`, `firstLaunchAt`, `lastLoggedInUser`, `trustedFolders`.

`@github/copilot` NPM package is installed. Find the binary and inspect its internal hook schema if possible.

## RESEARCH ACTIONS FOR ITERATION 1

Focus: primary-source schema discovery.

1. **Locate the copilot binary and inspect embedded schema**:
   - `which copilot`
   - `readlink -f $(which copilot)`
   - Find the NPM package: `npm root -g`, then `ls $(npm root -g)/@github/copilot/`
   - Look for `.json` files, `hooks.schema.json`, or any embedded schema
   - Grep the package for `"bash"` and `"powershell"` and `"Neither"` to find the validator source file
2. **Full log inspection**: `cat ~/.copilot/logs/process-1776864631540-59265.log` — look for clues about which event failed, full stack trace, expected schema fields.
3. **Try debug env vars**: `COPILOT_DEBUG=1 copilot -p "test hook schema" --allow-all-tools --no-ask-user 2>&1 | head -60` (non-interactive) — capture any extra diagnostic about the hook parse.
4. **Consult docs with WebFetch**: fetch `https://docs.github.com/en/copilot/github-copilot-in-the-cli` landing, look for hooks page. Also fetch the Copilot CLI changelog / releases notes for 1.0.34.
5. **Inspect existing working hook files**: `~/.superset/hooks/copilot-hook.sh` has a comment header describing the schema it was written for — compare against what we see.

## CITATION POLICY

Every finding MUST cite a source: file path + line, shell-command output with timestamp, or URL. No claims without cites.

## EXECUTION

Begin the iteration now. Write the iteration-001.md, append the state-log line, and drop `deltas/iter-001.jsonl`. End with a proposed next focus for iteration 2.
