# Iteration 023: Settings Merge Strategy & Hook Registration

## Focus

Determine how Claude Code merges `~/.claude/settings.json`, `.claude/settings.json`, and `.claude/settings.local.json`; confirm whether hooks stack or override; document the current hook registration schema and failure behavior; and inventory any existing hooks that must be preserved before adding new ones in this repository.

## Findings

1. **Claude Code uses scope precedence plus merged settings, not pure file replacement.**

   The current official settings docs define scope precedence as: managed > command line > local (`.claude/settings.local.json`) > project (`.claude/settings.json`) > user (`~/.claude/settings.json`). They also explicitly say that settings are merged and that array-valued settings are concatenated and deduplicated across scopes rather than replaced. [E1]

   For hooks specifically, the docs do not spell out a separate "hooks merge algorithm" sentence, but the published settings schema defines each hook event (`PreToolUse`, `PostToolUse`, `Stop`, etc.) as an **array** of matcher groups under the top-level `hooks` object. Combined with the generic array-merge rule, the safest reading is:

   - scalar settings follow precedence
   - object settings are merged
   - hook event arrays are additive across scopes and deduplicated where applicable

   This means a user hook in `~/.claude/settings.json` should still be present unless a stronger scope blocks hook loading entirely via managed policy such as `allowManagedHooksOnly`. [E1][E2][E3]

   **Confidence note:** the additive conclusion for hook arrays is a documented-structure inference, not a single sentence quoted verbatim from the hooks page.

2. **Hooks from different files are additive in practice, not last-wins overrides.**

   The hooks reference defines hook configuration as:

   - hook event
   - matcher group
   - one or more hook handlers

   So the model is already "many groups, many handlers" for a single event. The guide and reference also state that when multiple handlers match, they all execute, and multiple hook outputs such as `additionalContext` are concatenated where supported. [E2]

   Given the global settings rule that arrays merge across scopes, the merge-safe expectation is:

   - user-scope hook groups remain active
   - project-scope hook groups are added on top
   - local-scope hook groups are added on top of both
   - identical handlers may be deduplicated at execution time

   So the correct mental model is **stacking/additive**, not **replace the entire hook event with the most specific file**. [E1][E2][E3]

3. **The current hook registration schema is a top-level `hooks` object whose event keys map to arrays of matcher groups, and each matcher group contains an inner `hooks` array of handlers.**

   The official schema and hooks reference align on this shape:

   ```json
   {
     "hooks": {
       "EventName": [
         {
           "matcher": "optional-regex",
           "hooks": [
             {
               "type": "command",
               "command": "..."
             }
           ]
         }
       ]
     }
   }
   ```

   The matcher-group object has:

   - `matcher?: string`
   - `hooks: HookHandler[]`

   The currently documented handler types are:

   - `type: "command"` with `command`, optional `if`, `timeout`, `async`, `statusMessage`, and `shell`
   - `type: "http"` with `url`, optional `headers`, `allowedEnvVars`, `timeout`, and `statusMessage`
   - `type: "prompt"` with `prompt`, optional `model`, `timeout`, and `statusMessage`
   - `type: "agent"` with `prompt`, optional `model`, `timeout`, and `statusMessage`

   Common fields include:

   - `type`
   - `if` for tool-event filtering using permission-rule syntax
   - `timeout`
   - `statusMessage`
   - `once` for skill-defined hooks only

   The published schema is therefore broader than older command-only examples that still appear in search snippets and older mirrors. The current schema should be treated as source of truth. [E2][E3]

4. **Yes, multiple hooks can be registered for the same event.**

   There are two supported ways to do this:

   - multiple matcher groups inside a single event array
   - multiple hook handlers inside a single matcher group's inner `hooks` array

   Example patterns that are valid:

   ```json
   {
     "hooks": {
       "PostToolUse": [
         {
           "matcher": "Edit|Write",
           "hooks": [
             { "type": "command", "command": "prettier --write ..." },
             { "type": "command", "command": "eslint --fix ..." }
           ]
         },
         {
           "matcher": "Bash",
           "hooks": [
             { "type": "command", "command": "echo Bash used" }
           ]
         }
       ]
     }
   }
   ```

   This is not a workaround; it is the intended data model. [E2][E3]

5. **`matcher` is a case-sensitive regex applied to an event-specific field, and unsupported events ignore it.**

   The hooks reference says:

   - `"*"`, `""`, or omitting `matcher` means "match all"
   - for `PreToolUse`, `PostToolUse`, `PostToolUseFailure`, and `PermissionRequest`, the matcher runs against the tool name (for example `Bash`, `Edit|Write`, `mcp__.*`)
   - for `SessionStart`, it matches `startup`, `resume`, `clear`, or `compact`
   - for `ConfigChange`, it matches the config source (`user_settings`, `project_settings`, `local_settings`, `policy_settings`, `skills`)
   - for `FileChanged`, it matches the basename of the changed file

   Important nuance:

   - `UserPromptSubmit`, `Stop`, `TaskCompleted`, `TaskCreated`, `WorktreeCreate`, `WorktreeRemove`, `TeammateIdle`, and `CwdChanged` do **not** support matchers; adding one is silently ignored
   - for tool events, `if` is the more precise filter because it can inspect both tool name and arguments

   So `matcher` is group-level routing, not full predicate logic. Use `if` when the group should only spawn for a subset of matched tool invocations. [E2]

6. **A failing hook only blocks the event in specific cases; failure is not universally blocking.**

   For command hooks, the reference distinguishes:

   - `exit 0`: success
   - `exit 2`: blocking/denial behavior, but only on events that support blocking
   - other non-zero exit codes: non-blocking error; execution continues

   The event table explicitly says `exit 2` can block:

   - `PreToolUse`
   - `PermissionRequest`
   - `UserPromptSubmit`
   - `Stop`
   - `SubagentStop`
   - `TeammateIdle`
   - `TaskCreated`

   And separately, `TaskCompleted` uses exit code 2 to prevent completion. For non-blockable events, a failing command hook is effectively a side-effect failure, not a hard stop. [E2]

   For HTTP hooks, the rule is even clearer:

   - non-2xx response, timeout, or connection failure is **non-blocking**
   - to block, the endpoint must return a **2xx** response with the correct JSON decision payload

   Therefore the answer to "does a failing hook block the event?" is:

   - **not by default**
   - **only when the event supports blocking and the hook deliberately signals a blocking result**

   A broken shell script that exits 1 is not a reliable policy gate. A policy gate should return the documented block signal for that event. [E2]

7. **The merge-safe way to add new hooks is to append a new matcher group or handler in the narrowest appropriate scope, not to rewrite or replace existing hook arrays.**

   Recommended strategy:

   - use `~/.claude/settings.json` only for personal global hooks
   - use `.claude/settings.json` for team-shared repo hooks
   - use `.claude/settings.local.json` for personal repo-specific experiments
   - add a new matcher group or inner handler instead of restructuring the whole event
   - use the narrowest `matcher` possible and add `if` for tool-argument filtering
   - prefer a project-relative script path such as `"$CLAUDE_PROJECT_DIR"/.claude/hooks/...`
   - verify the effective configuration with `/hooks` and `/status`

   Two important implementation implications follow from the docs:

   - because hook arrays stack, you do not need to copy user hooks into project settings
   - because multiple matching hooks can all run, do **not** rely on cross-hook ordering; if ordering matters, create one wrapper script that orchestrates the sequence internally

   This is the safest way to preserve upstream user hooks while introducing repo-specific automation. [E1][E2]

8. **Existing hooks that must be preserved: yes, there are active user-scope notify hooks; there are no project or local repo hooks in the files requested.**

   Current local state:

   - `.claude/settings.json` does not exist in this repo. [L1]
   - `.claude/settings.local.json` exists but contains only `env` and `permissions`; it does **not** define `hooks`. [L2]
   - `~/.claude/settings.json` defines five command hooks, all invoking the same notification script:
     - `UserPromptSubmit`
     - `Stop`
     - `PostToolUse` with `matcher: "*"`
     - `PostToolUseFailure` with `matcher: "*"`
     - `PermissionRequest` with `matcher: "*"` [L3]

   The exact command currently registered in all five places is:

   ```sh
   [ -n "$SUPERSET_HOME_DIR" ] && [ -x "$SUPERSET_HOME_DIR/hooks/notify.sh" ] && "$SUPERSET_HOME_DIR/hooks/notify.sh" || true
   ```

   So if we add repo hooks, the hooks we need to preserve are the five user-scope notify hooks in `~/.claude/settings.json`. There are no existing repo hooks in the files the user asked me to inspect.

   One additional caveat: runtime hooks can also come from plugins, skills, agents, or managed policy, so `/hooks` is still the authoritative runtime inventory. But based strictly on the three requested files, only the user file currently contributes hooks. [E2][L1][L2][L3]

## Evidence

1. **[E1] Claude Code settings docs**  
   URL: https://code.claude.com/docs/en/settings  
   Relevant points:
   - scopes and use cases for user/project/local: lines 87-119
   - scope interaction and precedence: lines 122-131
   - settings file locations: lines 148-155
   - managed drop-in merge semantics: lines 166-167
   - hook-related settings: lines 221-226
   - global precedence list: lines 443-459
   - "settings are merged" summary: lines 467-474

2. **[E2] Hooks reference**  
   URL: https://code.claude.com/docs/en/hooks  
   Relevant points:
   - hook configuration nesting: lines 275-284
   - hook locations: lines 287-297
   - matcher semantics and unsupported events: lines 300-336
   - handler types and common fields: lines 378-405
   - HTTP hook failure behavior: lines 410-415 and 612-621
   - JSON decision control and blocking semantics: lines 624-690
   - event table showing which events can block: lines 584-591

3. **[E3] Official JSON schema for Claude Code settings**  
   URL: https://www.schemastore.org/claude-code-settings.json  
   Relevant points:
   - `$defs.hookCommand` union of `command`, `prompt`, `agent`, and `http`
   - `$defs.hookMatcher` with `matcher` plus inner `hooks` array
   - top-level `hooks` object where each event is an array of matcher groups
   - `httpHookAllowedEnvVars` explicitly marked as an array that merges across settings sources

4. **[L1] Repo project settings file state**  
   Local evidence: `.claude/settings.json` is absent in this repository when checked on 2026-03-30.

5. **[L2] Repo local settings file state**  
   Local evidence: `.claude/settings.local.json` contains `env` and `permissions` only, no `hooks` object.  
   File: `.claude/settings.local.json:1-14`

6. **[L3] Current user-scope hooks that must be preserved**  
   Local evidence: `~/.claude/settings.json` defines hooks for `UserPromptSubmit`, `Stop`, `PostToolUse`, `PostToolUseFailure`, and `PermissionRequest`.  
   File: `~/.claude/settings.json:8-62`

## New Information Ratio (0.0-1.0)

0.86

## Novelty Justification

This iteration adds three pieces of concrete evidence that were not obvious from the repository alone:

- the official scope-precedence and array-merge semantics from the current Claude Code settings docs
- the current published hook schema, including `http`, `prompt`, and `agent` hook types
- the actual local hook inventory on this machine, which shows that the only existing hooks to preserve are user-scope notify hooks in `~/.claude/settings.json`

That combination is materially new because it answers both the abstract merge question and the implementation-specific preservation question for this repo.

## Recommendations for Implementation

1. **Do not modify `~/.claude/settings.json` for repo-specific automation.** Leave the existing notify hooks intact there.

2. **If the new hook should be shared with the repo, add it to `.claude/settings.json`.** That keeps it versioned and team-visible without interfering with the user-scope hooks.

3. **If the new hook is experimental or personal, add it to `.claude/settings.local.json`.** That keeps it repo-scoped but uncommitted.

4. **Register new behavior by appending a new matcher group or new inner handler, not by replacing the whole event array.** This matches Claude Code’s additive model and reduces the chance of wiping out future hook entries.

5. **Use narrow matchers and `if` filters.** Example:

   ```json
   {
     "hooks": {
       "PostToolUse": [
         {
           "matcher": "Edit|Write",
           "hooks": [
             {
               "type": "command",
               "if": "Edit(*.ts)|Write(*.ts)",
               "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/your-hook.sh"
             }
           ]
         }
       ]
     }
   }
   ```

6. **Do not depend on implicit ordering between separate hooks.** If multiple actions must happen in order, wrap them in one script and register one handler.

7. **After adding hooks, verify runtime state with `/hooks` and `/status`.** `/hooks` answers the final "what is actually active right now?" question better than file inspection alone.
