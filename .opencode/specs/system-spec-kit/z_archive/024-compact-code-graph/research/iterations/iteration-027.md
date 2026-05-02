# Iteration 027: Gemini CLI Hooks API Analysis

## Focus

Verify the current Gemini CLI hooks API against official public documentation and release history, then map that reality onto this repo's current Gemini runtime setup and the 024 packet's hook-adapter assumptions.

## Findings (numbered)

1. Gemini CLI currently documents a first-class hook system with 11 total hook events. The full supported event list is: `BeforeTool`, `AfterTool`, `BeforeAgent`, `AfterAgent`, `BeforeModel`, `BeforeToolSelection`, `AfterModel`, `SessionStart`, `SessionEnd`, `Notification`, and `PreCompress`. If this packet only wants the lifecycle/system subset, that subset is `SessionStart`, `SessionEnd`, `Notification`, and `PreCompress`. This is materially broader than the old packet phrasing that treated Gemini as effectively "no hooks in practice." Sources: `https://geminicli.com/docs/hooks/`, `https://geminicli.com/docs/hooks/reference/`.

2. The previously mentioned `/hooks` UI is a slash-command panel inside Gemini CLI, not a separate web or desktop UI. The docs describe `/hooks` as the hook-management surface with `list`/`show`/`panel`, plus `enable`, `disable`, `enable-all`, and `disable-all`. The overview page also says "`/hooks panel`" is the runtime inventory view. The v0.24.0 release notes mention a "Hooks list" UI and related security-warning improvements, which strongly suggests this is an in-terminal management panel for currently registered hooks and their trust/status. Sources: `https://geminicli.com/docs/reference/commands/`, `https://geminicli.com/docs/hooks/`, `https://github.com/google-gemini/gemini-cli/releases`.

3. Gemini hook registration lives in `settings.json` under a top-level `"hooks"` object. Each event key maps to an array of hook-definition groups. Each group can contain:
   - `matcher`: regex for tool events, exact string for lifecycle events, `*`/empty for match-all
   - `sequential`: optional boolean controlling serial vs parallel execution within the group
   - `hooks`: required array of hook configs
   Each hook config currently documents only `type: "command"` plus `command`, and optional `name`, `timeout`, and `description`. Public docs currently do not document Gemini hook types equivalent to Claude Code's HTTP, prompt, or agent hooks. Example:

   ```json
   {
     "hooks": {
       "BeforeTool": [
         {
           "matcher": "write_file|replace",
           "hooks": [
             {
               "name": "security-check",
               "type": "command",
               "command": "$GEMINI_PROJECT_DIR/.gemini/hooks/security.sh",
               "timeout": 5000
             }
           ]
         }
       ]
     }
   }
   ```

   Sources: `https://geminicli.com/docs/hooks/`, `https://geminicli.com/docs/hooks/reference/`.

4. Gemini hooks can inject content into the active conversation, but the mechanism is event-specific and structured. The clearest injection surfaces are:
   - `SessionStart`: `hookSpecificOutput.additionalContext` is injected as the first turn in interactive mode, or prepended to the prompt in non-interactive mode.
   - `BeforeAgent`: `hookSpecificOutput.additionalContext` is appended to the prompt for that turn only.
   - `AfterTool`: `hookSpecificOutput.additionalContext` is appended to the tool result sent back to the agent.
   - `BeforeModel`: can override the outgoing request or provide a synthetic `llm_response`, which is even stronger than plain text injection.
   So the answer is "yes," but not in the same Claude-specific way as `SessionStart(source=compact)` or plain-text stdout injection. The public Gemini docs push structured JSON as the real contract. Sources: `https://geminicli.com/docs/hooks/`, `https://geminicli.com/docs/hooks/reference/`.

5. The Gemini stdin/stdout contract is strict JSON-over-stdin/stdout for command hooks. Common stdin fields are `session_id`, `transcript_path`, `cwd`, `hook_event_name`, and `timestamp`, plus event-specific fields like `prompt`, `tool_input`, `tool_response`, `llm_request`, or `source`. For stdout, Gemini expects a final JSON object only; `stderr` is reserved for logs/debug output. Exit-code semantics are:
   - `0`: success; stdout is parsed as JSON
   - `2`: hard block/system block; stderr is used as the rejection reason
   - other non-zero: warning; Gemini continues
   The docs explicitly say polluted stdout breaks parsing. In the overview docs, polluted stdout causes Gemini to fall back to "allow" behavior and treat the output as a `systemMessage`, so adapter scripts must be exceptionally disciplined about writing only JSON to stdout. Sources: `https://geminicli.com/docs/hooks/`, `https://geminicli.com/docs/hooks/reference/`.

6. Compared with Claude Code, Gemini's hook system is narrower in transport and broader in some model-stage interception points. The main differences are:
   - Gemini currently documents only `command` hooks; Claude documents `command`, `http`, `prompt`, and `agent` hook types.
   - Gemini has 11 events; Claude currently documents 25 lifecycle/event hooks.
   - Gemini has explicit `BeforeModel`, `AfterModel`, and `BeforeToolSelection` hooks; Claude's model/tool-governance story is more distributed across prompt/agent hooks and lifecycle events.
   - Claude supports `SessionStart(source="compact")`; Gemini `SessionStart` only documents `startup`, `resume`, and `clear`.
   - Claude has `PreCompact` and `PostCompact`; Gemini has `PreCompress`, but it is advisory-only and cannot block or modify compression.
   - Both systems use JSON on stdin/stdout for command hooks, matchers, and decision fields, so the mental model is similar, but the event names and guarantees are not interchangeable.
   Sources: `https://geminicli.com/docs/hooks/reference/`, `https://code.claude.com/docs/en/hooks`.

7. A future Gemini hook adapter could reuse our shared hook business logic, but it should not assume direct reuse of Claude-specific wrapper scripts. Repo reality today:
   - `.gemini/settings.json` does not contain a `"hooks"` block, so this repo currently configures zero Gemini hooks.
   - `.opencode/skill/cli-gemini/SKILL.md` and its bundled references do not document Gemini hooks.
   - `.opencode/skill/system-spec-kit/mcp_server/hooks/README.md` explicitly says `hooks/` is a helper/utility layer and "not a standalone MCP hook registration system."
   That means the reusable layer is our shared memory/context logic, not a finished runtime adapter. Gemini does provide `GEMINI_PROJECT_DIR`, `GEMINI_SESSION_ID`, `GEMINI_CWD`, and even a `CLAUDE_PROJECT_DIR` alias for compatibility, which helps with path portability. But a Gemini adapter still needs its own event translation because Gemini lacks Claude's `compact` session source and does not expose Claude-specific fields like `stop_hook_active`, `last_assistant_message`, or `custom_instructions` on compaction. Sources: `/.gemini/settings.json`, `/.opencode/skill/cli-gemini/SKILL.md`, `/.opencode/skill/system-spec-kit/mcp_server/hooks/README.md`, `https://geminicli.com/docs/hooks/`, `https://geminicli.com/docs/hooks/reference/`.

8. The packet's current `v0.33.1+` version claim appears stale. I did not find evidence that hooks were introduced specifically in v0.33.1. Public release history shows hooks were already present no later than stable `v0.23.0` on January 7, 2026, because that release already includes multiple hook-related changes (docs/reference/security/telemetry hardening). Stable `v0.24.0` then adds folder-trust support for hooks and a "Hooks list" UI improvement. As of March 30, 2026, the public docs site has a dedicated hooks overview/reference section, and the GitHub releases page shows current stable `v0.35.3` and preview `v0.36.0-preview.6`, both dated March 28, 2026. The safest correction for this packet is:
   - replace "Gemini CLI v0.33.1+ has a first-class hook system"
   - with "Gemini CLI has a first-class documented hook system, verified current as of March 30, 2026, and present by at least stable v0.23.0."
   Sources: `/.opencode/specs/system-spec-kit/024-compact-code-graph/decision-record.md`, `https://github.com/google-gemini/gemini-cli/releases`, `https://geminicli.com/docs/hooks/`, `https://geminicli.com/docs/hooks/reference/`.

## Evidence (cite sources/URLs)

- Official hooks overview: `https://geminicli.com/docs/hooks/`
- Official hooks reference and schemas: `https://geminicli.com/docs/hooks/reference/`
- Official slash-command reference for `/hooks`: `https://geminicli.com/docs/reference/commands/`
- Official release history: `https://github.com/google-gemini/gemini-cli/releases`
- Claude Code hooks reference for comparison: `https://code.claude.com/docs/en/hooks`
- Repo Gemini runtime config shows no `"hooks"` block: `.gemini/settings.json`
- Repo Gemini skill has no hook guidance: `.opencode/skill/cli-gemini/SKILL.md`
- Repo shared hook layer is utility-only, not runtime registration: `.opencode/skill/system-spec-kit/mcp_server/hooks/README.md`
- Packet currently contains stale version wording: `.opencode/specs/system-spec-kit/024-compact-code-graph/decision-record.md`
- Prior packet framing that Gemini is hook-capable but v1-suppressed: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-015.md`

## New Information Ratio (0.0-1.0)

0.86

## Novelty Justification

This iteration adds concrete operational detail that earlier packet notes did not pin down: the exact 11-event Gemini hook matrix, the command-only registration schema, the stdin/stdout/exit-code contract, the specific conversation-injection surfaces, and the fact that this repo currently ships no Gemini hooks at all. It also corrects a packet-level versioning assumption: public release history shows hooks existed by stable `v0.23.0`, so `v0.33.1+` is not a safe "introduced in" claim.

## Recommendations for Implementation

- Update 024 packet wording from "Gemini CLI v0.33.1+" to "Gemini CLI hooks are officially documented and verified current; present by at least stable v0.23.0."
- Keep `hookPolicy: "disabled_by_scope"` for Gemini in v1, but describe that as a product-scope choice, not a runtime limitation.
- If a Gemini adapter is built, target Gemini-native surfaces first: `SessionStart`, `BeforeAgent`, and `AfterTool`.
- Do not assume Claude's `PreCompact -> SessionStart(source=compact)` lifecycle maps directly to Gemini. Gemini's closest lifecycle event is `PreCompress`, but it is advisory-only and does not document a `compact` restart source.
- Reuse shared context/business logic from `system-spec-kit` helpers or MCP tools, but implement a Gemini-specific translation layer for hook payloads and outputs.
- Add the adapter only when `.gemini/settings.json` grows an explicit `"hooks"` block, then verify runtime state with `/hooks panel` instead of file inspection alone.
