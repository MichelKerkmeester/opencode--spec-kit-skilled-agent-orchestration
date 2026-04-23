# 009 Hook Daemon Parity — Merged Impact Report

Consolidated view of external files flagged for update across all 10 sub-packet impact analyses.
Source reports: `impact-analysis/NN-impact.md` (NN = 01..10).

## Summary

- Total raw rows across 10 reports: **34**
- Unique paths after dedup: **13**
- By max severity: HIGH=10, MED=3, LOW=0
- By category: AGENTS.md=1, Document=1, Readme=4, Skill=7

### Per Sub-packet Findings

| Sub-packet | HIGH | MED | LOW |
|---|---|---|---|
| 01 — 001-skill-advisor-hook-surface | 4 | 3 | 0 |
| 02 — 002-skill-graph-daemon-and-advisor-unification | 3 | 1 | 0 |
| 03 — 003-hook-parity-remediation | 1 | 2 | 0 |
| 04 — 004-copilot-hook-parity-remediation | 2 | 2 | 0 |
| 05 — 005-codex-hook-parity-remediation | 2 | 0 | 0 |
| 06 — 006-claude-hook-findings-remediation | 2 | 0 | 0 |
| 07 — 007-opencode-plugin-loader-remediation | 1 | 2 | 0 |
| 08 — 008-skill-advisor-plugin-hardening | 0 | 1 | 0 |
| 09 — 009-skill-advisor-standards-alignment | 2 | 0 | 0 |
| 10 — 010-copilot-wrapper-schema-fix + 011-copilot-writer-wiring | 4 | 2 | 0 |

## Consolidated Files Requiring Updates

Sorted by max severity (HIGH→LOW), then alphabetically by path.

| # | Path | Category | Max Severity | Flagged By | Contributing Reasons | Suggested Changes |
|---|---|---|---|---|---|---|
| 1 | `.opencode/README.md` | Readme | **HIGH** | 01, 02, 07 | [01] The repo overview still describes Gate 2 as explicit `skill_advisor.py` invocation and script-centric routing, while this packet ships automatic hook-based advisor surfacing across Claude, Gemini, Copilot, and Codex.<br><br>[02] The top-level OpenCode docs still describe Gate 2 as automatic via `skill_advisor.py` and still place the routing engine under `skill/scripts/`, but this packet moved the durable advisor surface to the native `mcp_server/skill-advisor/` package with hook-first/runtime-adapter delivery and MCP tools.<br><br>[07] The Gate 2 and framework-usage sections still describe skill routing as `skill_advisor.py`-driven only, which now under-describes hook-capable runtime behavior after OpenCode began surfacing advisor briefs automatically through the plugin bridge. | [01] Rewrite the Gate 2/onboarding text to describe the automatic hook brief as primary and the Python CLI as compatibility fallback.<br><br>[02] Rewrite the Gate 2 and directory-structure sections to describe `advisor_recommend`/hook-first routing as primary, with `skill_advisor.py` as the compat shim inside `mcp_server/skill-advisor/`.<br><br>[07] Revise Gate 2 wording to say runtime hook briefs are primary when available and `skill_advisor.py` is the fallback/scripted path. |
| 2 | `.opencode/install_guides/SET-UP - AGENTS.md` | Document | **HIGH** | 02, 07 | [02] The AGENTS setup guide still teaches Gate 2 as "run `skill_advisor.py`" and validates setup only through the script, but this packet shipped hook-first/native-first routing, daemon probing, native MCP delegation, and new compat controls.<br><br>[07] The Gate 2 setup examples still teach script-only skill routing (`skill_advisor.py`) for OpenCode AGENTS guidance, but this packet restored OpenCode prompt-time advisor brief delivery through the plugin hook path. | [02] Update Gate 2 guidance to prefer the runtime hook brief when present, describe `skill_advisor.py` as fallback/diagnostic shim, and add native-tool/bootstrap verification plus `--force-native` / `--force-local` / disable-flag notes.<br><br>[07] Refresh the Gate 2 examples so they mention the automatic Skill Advisor Hook brief first and keep `skill_advisor.py` as fallback/diagnostics guidance. |
| 3 | `.opencode/skill/system-spec-kit/ARCHITECTURE.md` | Skill | **HIGH** | 04, 08, 09 | [04] This packet changed the documented Copilot hook transport from an implied hook-output path to an explicit file-based custom-instructions path. The runtime integration table and hook narrative need to describe `user-prompt-submit.ts` / `session-prime.ts` as writers to `$HOME/.copilot/copilot-instructions.md`, with `custom-instructions.ts` as a first-class module.<br><br>[08] The audited architecture doc is the only listed external file that directly documents the OpenCode skill-advisor plugin bridge. Packet 008 added bridge-level guarantees that are now part of the operational contract at that surface: per-instance state isolation, in-flight identical-request dedup, and bounded prompt/brief/cache behavior. The current subsection still describes delegation order only.<br><br>[09] The packet explicitly documents that OpenCode plugins must use ESM default export, but this file still labels `.opencode/plugins/spec-kit-skill-advisor.js` as a "CommonJS entrypoint," which would now be incorrect for the plugin bridge contract. | [04] Update the hook integration table and surrounding prose to state that Copilot prompt/startup hooks refresh managed custom instructions and do not use prompt-mutating stdout.<br><br>[08] Extend the "OpenCode plugin bridge" subsection with one short paragraph covering per-instance state, in-flight dedup, and cap/eviction guarantees.<br><br>[09] Update the OpenCode plugin bridge section to describe `spec-kit-skill-advisor.js` as an OpenCode plugin ESM entrypoint/default-export factory, not CommonJS. |
| 4 | `.opencode/skill/system-spec-kit/README.md` | Readme | **HIGH** | 01, 02, 03, 04 | [01] The package overview now needs to reflect hook-primary skill-advisor routing, the native/shim split, and Copilot's file-based prompt path that this packet formalized.<br><br>[02] The Skill Advisor overview is current, but the workspace module profile still says `scripts/` remains CommonJS. Child `001-validator-esm-fix` explicitly flipped `scripts/package.json` to `"type": "module"`, so this README is now factually wrong.<br><br>[03] The overview still compresses runtime integration into a generic "runtime hooks cover ... Codex CLI ... OpenCode plugin bridge" summary. After this packet, the operator-facing summary should mirror the new prompt-vs-lifecycle distinction instead of implying uniform runtime parity.<br><br>[04] The package overview includes the runtime-hooks summary for the native skill-advisor package. This packet changes what that overview needs to say about Copilot: it is no longer "missing parity," but it is also not prompt-mutating parity. | [01] Expand the Skill Advisor section with hook-brief/fallback semantics and point readers to the hook reference/playbook.<br><br>[02] Correct the module-profile section to document `scripts/` as ESM and keep any Node interop notes aligned with the shipped validator migration.<br><br>[03] Tighten the Skill Advisor/runtime overview to call out Codex prompt-only behavior, OpenCode plugin-based startup transport, and Copilot file-based startup refresh, or link directly to the hook matrix.<br><br>[04] Add or tune the Copilot runtime-hooks summary to mention `$HOME/.copilot/copilot-instructions.md`, file-based refresh, and the distinction from true in-turn prompt injection. |
| 5 | `.opencode/skill/system-spec-kit/SKILL.md` | Skill | **HIGH** | 01, 03, 04, 06, 10 | [01] The skill-level startup/recovery section still says Codex participates through `SessionStart` startup hooks, but this packet finalized Codex as prompt-hook only with no lifecycle startup hook and explicit fallback behavior.<br><br>[03] The startup/recovery section still says Codex uses `SessionStart` hook scripts plus `~/.codex/hooks.json`, but this sub-packet explicitly documents the opposite: Codex has prompt hooks only and startup recovery should be described via `session_bootstrap`.<br><br>[04] The startup/recovery guidance includes cross-runtime startup surfaces and Copilot handling. This packet changes that surface from generic startup-helper language to a concrete file-based custom-instructions model with next-prompt freshness limits.<br><br>[06] The Claude runtime-hook section still documents only `PreCompact`, `SessionStart`, and `Stop` in `.claude/settings.local.json`. This packet verified and normalized a four-event Claude surface that also includes `UserPromptSubmit`, so the current guidance understates the actual Claude hook wiring and schema.<br><br>[10] The startup-surface overview treats `.claude/settings.local.json` as Claude-only and describes Copilot only as generic "local hook configuration or wrapper wiring." After packets 010/011, that same file becomes a concrete Copilot integration surface with explicit wrapper fields and writer commands. | [01] Split prompt-hook vs lifecycle-hook behavior explicitly and remove Codex `SessionStart` / startup-hook wording.<br><br>[03] Replace the Codex runtime paragraph with the current capability split: prompt hooks yes, lifecycle startup hook no, recovery via `session_bootstrap` or `/spec_kit:resume`, and keep OpenCode/Copilot wording aligned with the hook matrix.<br><br>[04] Expand the cross-runtime startup section so Copilot guidance explicitly mentions managed custom instructions, wrapper wiring, and fallback expectations.<br><br>[06] Update the Claude hook table and surrounding prose to include `UserPromptSubmit` and clarify that project-local Claude settings now use nested Claude `hooks` groups without outer `bash` / `timeoutSec` wrappers.<br><br>[10] Add a short Copilot note in the startup-surfaces section pointing to the shared `.claude/settings.local.json` wrapper contract and the hook-system reference. |
| 6 | `.opencode/skill/system-spec-kit/feature_catalog/**` | Skill | **HIGH** | 10 | [10] The audited feature catalog bundle includes `feature_catalog/22--context-preservation-and-code-graph/05-cross-runtime-fallback.md`, which still says Copilot uses repo-scoped `.github/hooks/*.json` wiring. Packets 010/011 move the effective Copilot prompt/startup path to top-level `.claude/settings.local.json` matcher wrappers that Copilot also ingests. | [10] Update the Copilot fallback feature entry to name `.claude/settings.local.json` as the effective wrapper surface and note the top-level writer commands on `UserPromptSubmit` and `SessionStart`. |
| 7 | `.opencode/skill/system-spec-kit/mcp_server/**/README.md` | Readme | **HIGH** | 01, 10 | [01] `009` explicitly updated the runtime hook README family under `mcp_server/hooks/` for Claude/Gemini/Copilot/Codex registration and fallback behavior, but the audit only captures them through a wildcard row.<br><br>[10] The audited README bundle includes `mcp_server/hooks/copilot/README.md`, whose registration example still tells operators to use `.github/hooks/scripts/session-start.sh` and `.github/hooks/scripts/user-prompt-submitted.sh`. Packet 011 explicitly replaces the top-level Copilot no-op wrappers in `.claude/settings.local.json` with the real writer commands instead. | [01] Refresh the runtime hook README family with Phase 020 registration snippets, Copilot wrapper notes, and Codex deferred `.codex` config guidance.<br><br>[10] Refresh the Copilot hook registration example to show the Copilot-safe `.claude/settings.local.json` wrapper contract and clarify that Claude nested commands remain alongside the top-level Copilot fields. |
| 8 | `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md` | Skill | **HIGH** | 02, 10 | [02] The MCP server install verification step lists only memory/session/code-graph tools and does not tell operators to verify `advisor_recommend`, `advisor_status`, or `advisor_validate`, even though this packet added those public tools to the live dispatcher.<br><br>[10] The runtime coverage table still describes Copilot startup/recovery as `.github/hooks/superset-notify.json` sessionStart routing through `.github/hooks/scripts/session-start.sh`. Packets 010/011 establish `.claude/settings.local.json` as a checked-in Copilot execution surface via top-level wrapper fields and writer commands. | [02] Expand the verification step to mention the native advisor tools and point installers to the skill-advisor bootstrap/API docs when checking a fresh install.<br><br>[10] Revise the Copilot row to describe merged `.claude/settings.local.json` wrapper execution and mention the top-level `type`/`bash`/`timeoutSec` contract plus writer wiring. |
| 9 | `.opencode/skill/system-spec-kit/references/config/hook_system.md` | Skill | **HIGH** | 01, 04, 05, 06, 07, 10 | [01] This is the authoritative runtime hook matrix; `006-009` defined prompt-time transports, Copilot's file-based prompt path, Codex no-lifecycle behavior, and runtime fallback semantics that must stay synchronized here.<br><br>[04] This is the canonical runtime hook matrix and fallback contract cited by operator guidance. The Copilot row and fallback prose must reflect that prompt parity is now file-based, startup refresh is wrapper-driven/file-based, and hook output remains `{}` rather than model-visible context.<br><br>[05] The runtime hook matrix and cross-runtime fallback text still mark Codex as lacking lifecycle hooks and describe it as recovery-only, which is now wrong after native Codex `SessionStart` parity shipped.<br><br>[06] The canonical hook-system reference still shows a three-hook JSON example and lifecycle text that omits the Claude `UserPromptSubmit` prompt-time hook. This packet changed and verified the project-local Claude hook registration shape across four event blocks, so this reference is now stale.<br><br>[07] The runtime hook matrix still says OpenCode has `n/a (advisor separate)` for prompt hooks and the fallback prose only names the compact plugin, but this packet shipped prompt-time advisor delivery through the OpenCode skill-advisor plugin via `experimental.chat.system.transform` plus `event` lifecycle handling.<br><br>[10] The hook matrix and fallback prose still frame Copilot lifecycle support as "repo wrapper" wiring. Packet 010 adds a cross-runtime schema contract in `.claude/settings.local.json`, and packet 011 uses those same top-level wrapper fields to invoke the Copilot writers on `UserPromptSubmit` and `SessionStart`. | [01] Keep the runtime matrix and fallback narrative aligned with the shipped adapter behavior, disable path, and recovery guidance.<br><br>[04] Revise the Copilot matrix row and cross-runtime fallback text to document file-based custom-instructions parity, wrapper-driven startup refresh, and next-prompt freshness semantics.<br><br>[05] Revise the Codex row and fallback prose to document native `SessionStart` + `UserPromptSubmit`, required `codex_hooks` flag, `~/.codex/hooks.json` registration, and fallback-only use of operator recovery when hooks are unavailable.<br><br>[06] Refresh the `.claude/settings.local.json` example and lifecycle notes to cover `UserPromptSubmit` explicitly and distinguish prompt-hook registration from lifecycle hooks under the normalized Claude schema.<br><br>[07] Update the OpenCode row and fallback prose to document the skill-advisor plugin bridge, prompt-hook availability, and the concrete OpenCode hook surfaces now in use.<br><br>[10] Update the runtime matrix, hook-registration example, and Copilot fallback prose to reflect the merged Claude-wrapper path and its top-level field requirements. |
| 10 | `AGENTS.md` | AGENTS.md | **HIGH** | 01, 05, 09 | [01] `009` changes Gate 2 from script-first to hook-primary/fallback and depends on the prompt-vs-lifecycle runtime split; this instruction surface becomes wrong if it keeps pre-hook guidance.<br><br>[05] The session-start guidance still says Codex has prompt hooks but no lifecycle/startup hook, which conflicts with this sub-packet's shipped native `SessionStart` parity and would misroute operators toward recovery-only behavior.<br><br>[09] The packet adds an OpenCode Plugin Exemption Tier because the blanket JavaScript `require`/`module.exports` rule conflicts with plugin loading. This file still summarizes JavaScript for "ALL OpenCode system code" as `require`/`module.exports`, which is now too broad and misleading for `.opencode/plugins/` and `.opencode/plugin-helpers/`. | [01] Keep Gate 2 and session-recovery rules anchored on hook brief primary, `skill_advisor.py` fallback, and the runtime matrix reference.<br><br>[05] Update the Codex runtime note to state that Codex now supports native `SessionStart` and `UserPromptSubmit` hooks when `codex_hooks` and `~/.codex/hooks.json` wiring are enabled, with `/spec_kit:resume` as fallback.<br><br>[09] Amend the `sk-code-opencode` language table to note the OpenCode plugin ESM exemption, or narrow the row so plugin files are excluded from the blanket CommonJS guidance. |
| 11 | `.opencode/skill/system-spec-kit/manual_testing_playbook/**/*.md` | Skill | **MED** | 10 | [10] The audited playbook bundle includes `manual_testing_playbook/22--context-preservation-and-code-graph/252-cross-runtime-fallback.md`, which still validates Copilot enablement only through `.github/hooks/*.json`. That misses the new `.claude/settings.local.json` wrapper schema and writer-command path introduced by packets 010/011. | [10] Expand the Copilot validation scenario to inspect `.claude/settings.local.json` top-level fields/commands and to smoke the managed-block refresh through that path. |
| 12 | `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Skill | **MED** | 03 | [03] Phase B verification exercises `SPECKIT_CODEX_HOOK_TIMEOUT_MS`, and the timeout behavior now matters because Codex returns a stale advisory instead of empty output on timeout. The env reference documents adjacent Codex/session knobs but does not list this timeout control. | [03] Add `SPECKIT_CODEX_HOOK_TIMEOUT_MS` with default, scope, and the timeout fallback behavior for Codex `UserPromptSubmit` / advisor subprocess execution. |
| 13 | `.opencode/skill/system-spec-kit/mcp_server/README.md` | Readme | **MED** | 01 | [01] The MCP server README documents the native skill-advisor package and acts as an operator entrypoint; this packet adds runtime hook adapters, compatibility fallback behavior, and hook docs that the overview should surface. | [01] Add a short hook-surface summary and cross-links to the runtime hook READMEs and hook reference docs. |

## Action List (Consolidated)

Each bullet = one file to update, with the set of sub-packets driving the update and a merged recommendation.

### [HIGH] `.opencode/README.md` (Readme)

**Flagged by:** 01, 02, 07

**Reasons:**
- [01] The repo overview still describes Gate 2 as explicit `skill_advisor.py` invocation and script-centric routing, while this packet ships automatic hook-based advisor surfacing across Claude, Gemini, Copilot, and Codex.
- [02] The top-level OpenCode docs still describe Gate 2 as automatic via `skill_advisor.py` and still place the routing engine under `skill/scripts/`, but this packet moved the durable advisor surface to the native `mcp_server/skill-advisor/` package with hook-first/runtime-adapter delivery and MCP tools.
- [07] The Gate 2 and framework-usage sections still describe skill routing as `skill_advisor.py`-driven only, which now under-describes hook-capable runtime behavior after OpenCode began surfacing advisor briefs automatically through the plugin bridge.

**Suggested changes:**
- [01] Rewrite the Gate 2/onboarding text to describe the automatic hook brief as primary and the Python CLI as compatibility fallback.
- [02] Rewrite the Gate 2 and directory-structure sections to describe `advisor_recommend`/hook-first routing as primary, with `skill_advisor.py` as the compat shim inside `mcp_server/skill-advisor/`.
- [07] Revise Gate 2 wording to say runtime hook briefs are primary when available and `skill_advisor.py` is the fallback/scripted path.

### [HIGH] `.opencode/install_guides/SET-UP - AGENTS.md` (Document)

**Flagged by:** 02, 07

**Reasons:**
- [02] The AGENTS setup guide still teaches Gate 2 as "run `skill_advisor.py`" and validates setup only through the script, but this packet shipped hook-first/native-first routing, daemon probing, native MCP delegation, and new compat controls.
- [07] The Gate 2 setup examples still teach script-only skill routing (`skill_advisor.py`) for OpenCode AGENTS guidance, but this packet restored OpenCode prompt-time advisor brief delivery through the plugin hook path.

**Suggested changes:**
- [02] Update Gate 2 guidance to prefer the runtime hook brief when present, describe `skill_advisor.py` as fallback/diagnostic shim, and add native-tool/bootstrap verification plus `--force-native` / `--force-local` / disable-flag notes.
- [07] Refresh the Gate 2 examples so they mention the automatic Skill Advisor Hook brief first and keep `skill_advisor.py` as fallback/diagnostics guidance.

### [HIGH] `.opencode/skill/system-spec-kit/ARCHITECTURE.md` (Skill)

**Flagged by:** 04, 08, 09

**Reasons:**
- [04] This packet changed the documented Copilot hook transport from an implied hook-output path to an explicit file-based custom-instructions path. The runtime integration table and hook narrative need to describe `user-prompt-submit.ts` / `session-prime.ts` as writers to `$HOME/.copilot/copilot-instructions.md`, with `custom-instructions.ts` as a first-class module.
- [08] The audited architecture doc is the only listed external file that directly documents the OpenCode skill-advisor plugin bridge. Packet 008 added bridge-level guarantees that are now part of the operational contract at that surface: per-instance state isolation, in-flight identical-request dedup, and bounded prompt/brief/cache behavior. The current subsection still describes delegation order only.
- [09] The packet explicitly documents that OpenCode plugins must use ESM default export, but this file still labels `.opencode/plugins/spec-kit-skill-advisor.js` as a "CommonJS entrypoint," which would now be incorrect for the plugin bridge contract.

**Suggested changes:**
- [04] Update the hook integration table and surrounding prose to state that Copilot prompt/startup hooks refresh managed custom instructions and do not use prompt-mutating stdout.
- [08] Extend the "OpenCode plugin bridge" subsection with one short paragraph covering per-instance state, in-flight dedup, and cap/eviction guarantees.
- [09] Update the OpenCode plugin bridge section to describe `spec-kit-skill-advisor.js` as an OpenCode plugin ESM entrypoint/default-export factory, not CommonJS.

### [HIGH] `.opencode/skill/system-spec-kit/README.md` (Readme)

**Flagged by:** 01, 02, 03, 04

**Reasons:**
- [01] The package overview now needs to reflect hook-primary skill-advisor routing, the native/shim split, and Copilot's file-based prompt path that this packet formalized.
- [02] The Skill Advisor overview is current, but the workspace module profile still says `scripts/` remains CommonJS. Child `001-validator-esm-fix` explicitly flipped `scripts/package.json` to `"type": "module"`, so this README is now factually wrong.
- [03] The overview still compresses runtime integration into a generic "runtime hooks cover ... Codex CLI ... OpenCode plugin bridge" summary. After this packet, the operator-facing summary should mirror the new prompt-vs-lifecycle distinction instead of implying uniform runtime parity.
- [04] The package overview includes the runtime-hooks summary for the native skill-advisor package. This packet changes what that overview needs to say about Copilot: it is no longer "missing parity," but it is also not prompt-mutating parity.

**Suggested changes:**
- [01] Expand the Skill Advisor section with hook-brief/fallback semantics and point readers to the hook reference/playbook.
- [02] Correct the module-profile section to document `scripts/` as ESM and keep any Node interop notes aligned with the shipped validator migration.
- [03] Tighten the Skill Advisor/runtime overview to call out Codex prompt-only behavior, OpenCode plugin-based startup transport, and Copilot file-based startup refresh, or link directly to the hook matrix.
- [04] Add or tune the Copilot runtime-hooks summary to mention `$HOME/.copilot/copilot-instructions.md`, file-based refresh, and the distinction from true in-turn prompt injection.

### [HIGH] `.opencode/skill/system-spec-kit/SKILL.md` (Skill)

**Flagged by:** 01, 03, 04, 06, 10

**Reasons:**
- [01] The skill-level startup/recovery section still says Codex participates through `SessionStart` startup hooks, but this packet finalized Codex as prompt-hook only with no lifecycle startup hook and explicit fallback behavior.
- [03] The startup/recovery section still says Codex uses `SessionStart` hook scripts plus `~/.codex/hooks.json`, but this sub-packet explicitly documents the opposite: Codex has prompt hooks only and startup recovery should be described via `session_bootstrap`.
- [04] The startup/recovery guidance includes cross-runtime startup surfaces and Copilot handling. This packet changes that surface from generic startup-helper language to a concrete file-based custom-instructions model with next-prompt freshness limits.
- [06] The Claude runtime-hook section still documents only `PreCompact`, `SessionStart`, and `Stop` in `.claude/settings.local.json`. This packet verified and normalized a four-event Claude surface that also includes `UserPromptSubmit`, so the current guidance understates the actual Claude hook wiring and schema.
- [10] The startup-surface overview treats `.claude/settings.local.json` as Claude-only and describes Copilot only as generic "local hook configuration or wrapper wiring." After packets 010/011, that same file becomes a concrete Copilot integration surface with explicit wrapper fields and writer commands.

**Suggested changes:**
- [01] Split prompt-hook vs lifecycle-hook behavior explicitly and remove Codex `SessionStart` / startup-hook wording.
- [03] Replace the Codex runtime paragraph with the current capability split: prompt hooks yes, lifecycle startup hook no, recovery via `session_bootstrap` or `/spec_kit:resume`, and keep OpenCode/Copilot wording aligned with the hook matrix.
- [04] Expand the cross-runtime startup section so Copilot guidance explicitly mentions managed custom instructions, wrapper wiring, and fallback expectations.
- [06] Update the Claude hook table and surrounding prose to include `UserPromptSubmit` and clarify that project-local Claude settings now use nested Claude `hooks` groups without outer `bash` / `timeoutSec` wrappers.
- [10] Add a short Copilot note in the startup-surfaces section pointing to the shared `.claude/settings.local.json` wrapper contract and the hook-system reference.

### [HIGH] `.opencode/skill/system-spec-kit/feature_catalog/**` (Skill)

**Flagged by:** 10

**Reasons:**
- [10] The audited feature catalog bundle includes `feature_catalog/22--context-preservation-and-code-graph/05-cross-runtime-fallback.md`, which still says Copilot uses repo-scoped `.github/hooks/*.json` wiring. Packets 010/011 move the effective Copilot prompt/startup path to top-level `.claude/settings.local.json` matcher wrappers that Copilot also ingests.

**Suggested changes:**
- [10] Update the Copilot fallback feature entry to name `.claude/settings.local.json` as the effective wrapper surface and note the top-level writer commands on `UserPromptSubmit` and `SessionStart`.

### [HIGH] `.opencode/skill/system-spec-kit/mcp_server/**/README.md` (Readme)

**Flagged by:** 01, 10

**Reasons:**
- [01] `009` explicitly updated the runtime hook README family under `mcp_server/hooks/` for Claude/Gemini/Copilot/Codex registration and fallback behavior, but the audit only captures them through a wildcard row.
- [10] The audited README bundle includes `mcp_server/hooks/copilot/README.md`, whose registration example still tells operators to use `.github/hooks/scripts/session-start.sh` and `.github/hooks/scripts/user-prompt-submitted.sh`. Packet 011 explicitly replaces the top-level Copilot no-op wrappers in `.claude/settings.local.json` with the real writer commands instead.

**Suggested changes:**
- [01] Refresh the runtime hook README family with Phase 020 registration snippets, Copilot wrapper notes, and Codex deferred `.codex` config guidance.
- [10] Refresh the Copilot hook registration example to show the Copilot-safe `.claude/settings.local.json` wrapper contract and clarify that Claude nested commands remain alongside the top-level Copilot fields.

### [HIGH] `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md` (Skill)

**Flagged by:** 02, 10

**Reasons:**
- [02] The MCP server install verification step lists only memory/session/code-graph tools and does not tell operators to verify `advisor_recommend`, `advisor_status`, or `advisor_validate`, even though this packet added those public tools to the live dispatcher.
- [10] The runtime coverage table still describes Copilot startup/recovery as `.github/hooks/superset-notify.json` sessionStart routing through `.github/hooks/scripts/session-start.sh`. Packets 010/011 establish `.claude/settings.local.json` as a checked-in Copilot execution surface via top-level wrapper fields and writer commands.

**Suggested changes:**
- [02] Expand the verification step to mention the native advisor tools and point installers to the skill-advisor bootstrap/API docs when checking a fresh install.
- [10] Revise the Copilot row to describe merged `.claude/settings.local.json` wrapper execution and mention the top-level `type`/`bash`/`timeoutSec` contract plus writer wiring.

### [HIGH] `.opencode/skill/system-spec-kit/references/config/hook_system.md` (Skill)

**Flagged by:** 01, 04, 05, 06, 07, 10

**Reasons:**
- [01] This is the authoritative runtime hook matrix; `006-009` defined prompt-time transports, Copilot's file-based prompt path, Codex no-lifecycle behavior, and runtime fallback semantics that must stay synchronized here.
- [04] This is the canonical runtime hook matrix and fallback contract cited by operator guidance. The Copilot row and fallback prose must reflect that prompt parity is now file-based, startup refresh is wrapper-driven/file-based, and hook output remains `{}` rather than model-visible context.
- [05] The runtime hook matrix and cross-runtime fallback text still mark Codex as lacking lifecycle hooks and describe it as recovery-only, which is now wrong after native Codex `SessionStart` parity shipped.
- [06] The canonical hook-system reference still shows a three-hook JSON example and lifecycle text that omits the Claude `UserPromptSubmit` prompt-time hook. This packet changed and verified the project-local Claude hook registration shape across four event blocks, so this reference is now stale.
- [07] The runtime hook matrix still says OpenCode has `n/a (advisor separate)` for prompt hooks and the fallback prose only names the compact plugin, but this packet shipped prompt-time advisor delivery through the OpenCode skill-advisor plugin via `experimental.chat.system.transform` plus `event` lifecycle handling.
- [10] The hook matrix and fallback prose still frame Copilot lifecycle support as "repo wrapper" wiring. Packet 010 adds a cross-runtime schema contract in `.claude/settings.local.json`, and packet 011 uses those same top-level wrapper fields to invoke the Copilot writers on `UserPromptSubmit` and `SessionStart`.

**Suggested changes:**
- [01] Keep the runtime matrix and fallback narrative aligned with the shipped adapter behavior, disable path, and recovery guidance.
- [04] Revise the Copilot matrix row and cross-runtime fallback text to document file-based custom-instructions parity, wrapper-driven startup refresh, and next-prompt freshness semantics.
- [05] Revise the Codex row and fallback prose to document native `SessionStart` + `UserPromptSubmit`, required `codex_hooks` flag, `~/.codex/hooks.json` registration, and fallback-only use of operator recovery when hooks are unavailable.
- [06] Refresh the `.claude/settings.local.json` example and lifecycle notes to cover `UserPromptSubmit` explicitly and distinguish prompt-hook registration from lifecycle hooks under the normalized Claude schema.
- [07] Update the OpenCode row and fallback prose to document the skill-advisor plugin bridge, prompt-hook availability, and the concrete OpenCode hook surfaces now in use.
- [10] Update the runtime matrix, hook-registration example, and Copilot fallback prose to reflect the merged Claude-wrapper path and its top-level field requirements.

### [HIGH] `AGENTS.md` (AGENTS.md)

**Flagged by:** 01, 05, 09

**Reasons:**
- [01] `009` changes Gate 2 from script-first to hook-primary/fallback and depends on the prompt-vs-lifecycle runtime split; this instruction surface becomes wrong if it keeps pre-hook guidance.
- [05] The session-start guidance still says Codex has prompt hooks but no lifecycle/startup hook, which conflicts with this sub-packet's shipped native `SessionStart` parity and would misroute operators toward recovery-only behavior.
- [09] The packet adds an OpenCode Plugin Exemption Tier because the blanket JavaScript `require`/`module.exports` rule conflicts with plugin loading. This file still summarizes JavaScript for "ALL OpenCode system code" as `require`/`module.exports`, which is now too broad and misleading for `.opencode/plugins/` and `.opencode/plugin-helpers/`.

**Suggested changes:**
- [01] Keep Gate 2 and session-recovery rules anchored on hook brief primary, `skill_advisor.py` fallback, and the runtime matrix reference.
- [05] Update the Codex runtime note to state that Codex now supports native `SessionStart` and `UserPromptSubmit` hooks when `codex_hooks` and `~/.codex/hooks.json` wiring are enabled, with `/spec_kit:resume` as fallback.
- [09] Amend the `sk-code-opencode` language table to note the OpenCode plugin ESM exemption, or narrow the row so plugin files are excluded from the blanket CommonJS guidance.

### [MED] `.opencode/skill/system-spec-kit/manual_testing_playbook/**/*.md` (Skill)

**Flagged by:** 10

**Reasons:**
- [10] The audited playbook bundle includes `manual_testing_playbook/22--context-preservation-and-code-graph/252-cross-runtime-fallback.md`, which still validates Copilot enablement only through `.github/hooks/*.json`. That misses the new `.claude/settings.local.json` wrapper schema and writer-command path introduced by packets 010/011.

**Suggested changes:**
- [10] Expand the Copilot validation scenario to inspect `.claude/settings.local.json` top-level fields/commands and to smoke the managed-block refresh through that path.

### [MED] `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md` (Skill)

**Flagged by:** 03

**Reasons:**
- [03] Phase B verification exercises `SPECKIT_CODEX_HOOK_TIMEOUT_MS`, and the timeout behavior now matters because Codex returns a stale advisory instead of empty output on timeout. The env reference documents adjacent Codex/session knobs but does not list this timeout control.

**Suggested changes:**
- [03] Add `SPECKIT_CODEX_HOOK_TIMEOUT_MS` with default, scope, and the timeout fallback behavior for Codex `UserPromptSubmit` / advisor subprocess execution.

### [MED] `.opencode/skill/system-spec-kit/mcp_server/README.md` (Readme)

**Flagged by:** 01

**Reasons:**
- [01] The MCP server README documents the native skill-advisor package and acts as an operator entrypoint; this packet adds runtime hook adapters, compatibility fallback behavior, and hook docs that the overview should surface.

**Suggested changes:**
- [01] Add a short hook-surface summary and cross-links to the runtime hook READMEs and hook reference docs.

## Methodology

This report merges the 10 sub-packet impact analyses produced by parallel cli-codex gpt-5.4 high agents dispatched in fast mode. For each unique target file path across the 10 source tables, severity was rolled up using MAX(HIGH=3, MED=2, LOW=1). All reasons and suggestions are preserved (prefixed with the sub-packet ID) so the rationale from every flagging agent stays visible. No cross-validation or on-disk verification was performed at merge time — individual sub-packet reports remain the source of truth for per-analysis evidence.
