# 010 Hook Parity — Merged Impact Report

Consolidated view of external files flagged for update across hook-parity sub-packet impact analyses. Advisor and code-graph impact entries have moved out of this packet:

- Skill-advisor work (former sub-packets 01, 02, 08, 09) → now under `008-skill-advisor/`.
- Code-graph hook work → now under `007-code-graph/`.

This report retains only the hook-parity entries. Source reports (renumbered to match current children):

- `impact-analysis/03-impact.md` → child 001 (Hook Parity Remediation)
- `impact-analysis/04-impact.md` → child 002 (Copilot Hook Parity Remediation)
- `impact-analysis/05-impact.md` → child 003 (Codex Hook Parity Remediation)
- `impact-analysis/06-impact.md` → child 004 (Claude Hook Findings Remediation)
- `impact-analysis/07-impact.md` → child 005 (OpenCode Plugin Loader Remediation)
- `impact-analysis/10-impact.md` → children 006 + 007 (Copilot Wrapper Schema Fix + Writer Wiring)

## Summary

- Total raw rows across hook-parity reports: **15**
- Unique paths after dedup (hook-parity only): **9**
- By max severity: HIGH=8, MED=1, LOW=0
- By category: AGENTS.md=1, Document=1, Readme=2, Skill=5

### Per Sub-packet Findings (hook-parity only)

| Sub-packet | HIGH | MED | LOW |
|---|---|---|---|
| 03 — 001-hook-parity-remediation | 1 | 2 | 0 |
| 04 — 002-copilot-hook-parity-remediation | 2 | 2 | 0 |
| 05 — 003-codex-hook-parity-remediation | 2 | 0 | 0 |
| 06 — 004-claude-hook-findings-remediation | 2 | 0 | 0 |
| 07 — 005-opencode-plugin-loader-remediation | 1 | 2 | 0 |
| 10 — 006-copilot-wrapper-schema-fix + 007-copilot-writer-wiring | 4 | 2 | 0 |

## Consolidated Files Requiring Updates

Sorted by max severity (HIGH→LOW), then alphabetically by path. Sub-packet IDs reflect the original report numbers in `impact-analysis/NN-impact.md`; current child folders are listed parenthetically.

| # | Path | Category | Max Severity | Flagged By | Contributing Reasons | Suggested Changes |
|---|---|---|---|---|---|---|
| 1 | `.opencode/install_guides/SET-UP - AGENTS.md` | Document | **HIGH** | 07 | [07] The Gate 2 setup examples still teach script-only skill routing (`skill_advisor.py`) for OpenCode AGENTS guidance, but this packet restored OpenCode prompt-time advisor brief delivery through the plugin hook path. | [07] Refresh the Gate 2 examples so they mention the automatic Skill Advisor Hook brief first and keep `skill_advisor.py` as fallback/diagnostics guidance. |
| 2 | `.opencode/skill/system-spec-kit/ARCHITECTURE.md` | Skill | **HIGH** | 04 | [04] This packet changed the documented Copilot hook transport from an implied hook-output path to an explicit file-based custom-instructions path. The runtime integration table and hook narrative need to describe `user-prompt-submit.ts` / `session-prime.ts` as writers to `$HOME/.copilot/copilot-instructions.md`, with `custom-instructions.ts` as a first-class module. | [04] Update the hook integration table and surrounding prose to state that Copilot prompt/startup hooks refresh managed custom instructions and do not use prompt-mutating stdout. |
| 3 | `.opencode/skill/system-spec-kit/README.md` | Readme | **HIGH** | 03, 04 | [03] The overview still compresses runtime integration into a generic "runtime hooks cover ... Codex CLI ... OpenCode plugin bridge" summary. After this packet, the operator-facing summary should mirror the new prompt-vs-lifecycle distinction instead of implying uniform runtime parity.<br><br>[04] The package overview includes the runtime-hooks summary for the native skill-advisor package. This packet changes what that overview needs to say about Copilot: it is no longer "missing parity," but it is also not prompt-mutating parity. | [03] Tighten the runtime overview to call out Codex prompt-only behavior, OpenCode plugin-based startup transport, and Copilot file-based startup refresh, or link directly to the hook matrix.<br><br>[04] Add or tune the Copilot runtime-hooks summary to mention `$HOME/.copilot/copilot-instructions.md`, file-based refresh, and the distinction from true in-turn prompt injection. |
| 4 | `.opencode/skill/system-spec-kit/SKILL.md` | Skill | **HIGH** | 03, 04, 06, 10 | [03] The startup/recovery section still says Codex uses `SessionStart` hook scripts plus `~/.codex/hooks.json`, but this sub-packet explicitly documents the opposite: Codex has prompt hooks only and startup recovery should be described via `session_bootstrap`.<br><br>[04] The startup/recovery guidance includes cross-runtime startup surfaces and Copilot handling. This packet changes that surface from generic startup-helper language to a concrete file-based custom-instructions model with next-prompt freshness limits.<br><br>[06] The Claude runtime-hook section still documents only `PreCompact`, `SessionStart`, and `Stop` in `.claude/settings.local.json`. This packet verified and normalized a four-event Claude surface that also includes `UserPromptSubmit`, so the current guidance understates the actual Claude hook wiring and schema.<br><br>[10] The startup-surface overview treats `.claude/settings.local.json` as Claude-only and describes Copilot only as generic "local hook configuration or wrapper wiring." After packets 006/007, that same file becomes a concrete Copilot integration surface with explicit wrapper fields and writer commands. | [03] Replace the Codex runtime paragraph with the current capability split: prompt hooks yes, lifecycle startup hook no, recovery via `session_bootstrap` or `/spec_kit:resume`, and keep OpenCode/Copilot wording aligned with the hook matrix.<br><br>[04] Expand the cross-runtime startup section so Copilot guidance explicitly mentions managed custom instructions, wrapper wiring, and fallback expectations.<br><br>[06] Update the Claude hook table and surrounding prose to include `UserPromptSubmit` and clarify that project-local Claude settings now use nested Claude `hooks` groups without outer `bash` / `timeoutSec` wrappers.<br><br>[10] Add a short Copilot note in the startup-surfaces section pointing to the shared `.claude/settings.local.json` wrapper contract and the hook-system reference. |
| 5 | `.opencode/skill/system-spec-kit/feature_catalog/**` | Skill | **HIGH** | 10 | [10] The audited feature catalog bundle includes `feature_catalog/22--context-preservation-and-code-graph/05-cross-runtime-fallback.md`, which still says Copilot uses repo-scoped `.github/hooks/*.json` wiring. Packets 006/007 move the effective Copilot prompt/startup path to top-level `.claude/settings.local.json` matcher wrappers that Copilot also ingests. | [10] Update the Copilot fallback feature entry to name `.claude/settings.local.json` as the effective wrapper surface and note the top-level writer commands on `UserPromptSubmit` and `SessionStart`. |
| 6 | `.opencode/skill/system-spec-kit/mcp_server/**/README.md` | Readme | **HIGH** | 10 | [10] The audited README bundle includes `mcp_server/hooks/copilot/README.md`, whose registration example still tells operators to use `.github/hooks/scripts/session-start.sh` and `.github/hooks/scripts/user-prompt-submitted.sh`. Packet 007 explicitly replaces the top-level Copilot no-op wrappers in `.claude/settings.local.json` with the real writer commands instead. | [10] Refresh the Copilot hook registration example to show the Copilot-safe `.claude/settings.local.json` wrapper contract and clarify that Claude nested commands remain alongside the top-level Copilot fields. |
| 7 | `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md` | Skill | **HIGH** | 10 | [10] The runtime coverage table still describes Copilot startup/recovery as `.github/hooks/superset-notify.json` sessionStart routing through `.github/hooks/scripts/session-start.sh`. Packets 006/007 establish `.claude/settings.local.json` as a checked-in Copilot execution surface via top-level wrapper fields and writer commands. | [10] Revise the Copilot row to describe merged `.claude/settings.local.json` wrapper execution and mention the top-level `type`/`bash`/`timeoutSec` contract plus writer wiring. |
| 8 | `.opencode/skill/system-spec-kit/references/config/hook_system.md` | Skill | **HIGH** | 04, 05, 06, 07, 10 | [04] This is the canonical runtime hook matrix and fallback contract cited by operator guidance. The Copilot row and fallback prose must reflect that prompt parity is now file-based, startup refresh is wrapper-driven/file-based, and hook output remains `{}` rather than model-visible context.<br><br>[05] The runtime hook matrix and cross-runtime fallback text still mark Codex as lacking lifecycle hooks and describe it as recovery-only, which is now wrong after native Codex `SessionStart` parity shipped.<br><br>[06] The canonical hook-system reference still shows a three-hook JSON example and lifecycle text that omits the Claude `UserPromptSubmit` prompt-time hook. This packet changed and verified the project-local Claude hook registration shape across four event blocks, so this reference is now stale.<br><br>[07] The runtime hook matrix still says OpenCode has `n/a (advisor separate)` for prompt hooks and the fallback prose only names the compact plugin, but this packet shipped prompt-time advisor delivery through the OpenCode skill-advisor plugin via `experimental.chat.system.transform` plus `event` lifecycle handling.<br><br>[10] The hook matrix and fallback prose still frame Copilot lifecycle support as "repo wrapper" wiring. Packet 006 adds a cross-runtime schema contract in `.claude/settings.local.json`, and packet 007 uses those same top-level wrapper fields to invoke the Copilot writers on `UserPromptSubmit` and `SessionStart`. | [04] Revise the Copilot matrix row and cross-runtime fallback text to document file-based custom-instructions parity, wrapper-driven startup refresh, and next-prompt freshness semantics.<br><br>[05] Revise the Codex row and fallback prose to document native `SessionStart` + `UserPromptSubmit`, required `codex_hooks` flag, `~/.codex/hooks.json` registration, and fallback-only use of operator recovery when hooks are unavailable.<br><br>[06] Refresh the `.claude/settings.local.json` example and lifecycle notes to cover `UserPromptSubmit` explicitly and distinguish prompt-hook registration from lifecycle hooks under the normalized Claude schema.<br><br>[07] Update the OpenCode row and fallback prose to document the skill-advisor plugin bridge, prompt-hook availability, and the concrete OpenCode hook surfaces now in use.<br><br>[10] Update the runtime matrix, hook-registration example, and Copilot fallback prose to reflect the merged Claude-wrapper path and its top-level field requirements. |
| 9 | `AGENTS.md` | AGENTS.md | **HIGH** | 05 | [05] The session-start guidance still says Codex has prompt hooks but no lifecycle/startup hook, which conflicts with this sub-packet's shipped native `SessionStart` parity and would misroute operators toward recovery-only behavior. | [05] Update the Codex runtime note to state that Codex now supports native `SessionStart` and `UserPromptSubmit` hooks when `codex_hooks` and `~/.codex/hooks.json` wiring are enabled, with `/spec_kit:resume` as fallback. |
| 10 | `.opencode/skill/system-spec-kit/manual_testing_playbook/**/*.md` | Skill | **MED** | 10 | [10] The audited playbook bundle includes `manual_testing_playbook/22--context-preservation-and-code-graph/252-cross-runtime-fallback.md`, which still validates Copilot enablement only through `.github/hooks/*.json`. That misses the new `.claude/settings.local.json` wrapper schema and writer-command path introduced by packets 006/007. | [10] Expand the Copilot validation scenario to inspect `.claude/settings.local.json` top-level fields/commands and to smoke the managed-block refresh through that path. |
| 11 | `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Skill | **MED** | 03 | [03] Phase B verification exercises `SPECKIT_CODEX_HOOK_TIMEOUT_MS`, and the timeout behavior now matters because Codex returns a stale advisory instead of empty output on timeout. The env reference documents adjacent Codex/session knobs but does not list this timeout control. | [03] Add `SPECKIT_CODEX_HOOK_TIMEOUT_MS` with default, scope, and the timeout fallback behavior for Codex `UserPromptSubmit` / advisor subprocess execution. |

## Action List (Consolidated, hook-parity only)

Each bullet = one file to update, with the set of sub-packets driving the update and a merged recommendation. Sub-packet IDs reflect the original `NN-impact.md` numbering.

### [HIGH] `.opencode/install_guides/SET-UP - AGENTS.md` (Document)

**Flagged by:** 07

**Reasons:**
- [07] The Gate 2 setup examples still teach script-only skill routing (`skill_advisor.py`) for OpenCode AGENTS guidance, but this packet restored OpenCode prompt-time advisor brief delivery through the plugin hook path.

**Suggested changes:**
- [07] Refresh the Gate 2 examples so they mention the automatic Skill Advisor Hook brief first and keep `skill_advisor.py` as fallback/diagnostics guidance.

### [HIGH] `.opencode/skill/system-spec-kit/ARCHITECTURE.md` (Skill)

**Flagged by:** 04

**Reasons:**
- [04] This packet changed the documented Copilot hook transport from an implied hook-output path to an explicit file-based custom-instructions path. The runtime integration table and hook narrative need to describe `user-prompt-submit.ts` / `session-prime.ts` as writers to `$HOME/.copilot/copilot-instructions.md`, with `custom-instructions.ts` as a first-class module.

**Suggested changes:**
- [04] Update the hook integration table and surrounding prose to state that Copilot prompt/startup hooks refresh managed custom instructions and do not use prompt-mutating stdout.

### [HIGH] `.opencode/skill/system-spec-kit/README.md` (Readme)

**Flagged by:** 03, 04

**Reasons:**
- [03] The overview still compresses runtime integration into a generic "runtime hooks cover ... Codex CLI ... OpenCode plugin bridge" summary. After this packet, the operator-facing summary should mirror the new prompt-vs-lifecycle distinction instead of implying uniform runtime parity.
- [04] The package overview includes the runtime-hooks summary for the native skill-advisor package. This packet changes what that overview needs to say about Copilot: it is no longer "missing parity," but it is also not prompt-mutating parity.

**Suggested changes:**
- [03] Tighten the runtime overview to call out Codex prompt-only behavior, OpenCode plugin-based startup transport, and Copilot file-based startup refresh, or link directly to the hook matrix.
- [04] Add or tune the Copilot runtime-hooks summary to mention `$HOME/.copilot/copilot-instructions.md`, file-based refresh, and the distinction from true in-turn prompt injection.

### [HIGH] `.opencode/skill/system-spec-kit/SKILL.md` (Skill)

**Flagged by:** 03, 04, 06, 10

**Reasons:**
- [03] The startup/recovery section still says Codex uses `SessionStart` hook scripts plus `~/.codex/hooks.json`, but this sub-packet explicitly documents the opposite: Codex has prompt hooks only and startup recovery should be described via `session_bootstrap`.
- [04] The startup/recovery guidance includes cross-runtime startup surfaces and Copilot handling. This packet changes that surface from generic startup-helper language to a concrete file-based custom-instructions model with next-prompt freshness limits.
- [06] The Claude runtime-hook section still documents only `PreCompact`, `SessionStart`, and `Stop` in `.claude/settings.local.json`. This packet verified and normalized a four-event Claude surface that also includes `UserPromptSubmit`, so the current guidance understates the actual Claude hook wiring and schema.
- [10] The startup-surface overview treats `.claude/settings.local.json` as Claude-only and describes Copilot only as generic "local hook configuration or wrapper wiring." After packets 006/007, that same file becomes a concrete Copilot integration surface with explicit wrapper fields and writer commands.

**Suggested changes:**
- [03] Replace the Codex runtime paragraph with the current capability split: prompt hooks yes, lifecycle startup hook no, recovery via `session_bootstrap` or `/spec_kit:resume`, and keep OpenCode/Copilot wording aligned with the hook matrix.
- [04] Expand the cross-runtime startup section so Copilot guidance explicitly mentions managed custom instructions, wrapper wiring, and fallback expectations.
- [06] Update the Claude hook table and surrounding prose to include `UserPromptSubmit` and clarify that project-local Claude settings now use nested Claude `hooks` groups without outer `bash` / `timeoutSec` wrappers.
- [10] Add a short Copilot note in the startup-surfaces section pointing to the shared `.claude/settings.local.json` wrapper contract and the hook-system reference.

### [HIGH] `.opencode/skill/system-spec-kit/feature_catalog/**` (Skill)

**Flagged by:** 10

**Reasons:**
- [10] The audited feature catalog bundle includes `feature_catalog/22--context-preservation-and-code-graph/05-cross-runtime-fallback.md`, which still says Copilot uses repo-scoped `.github/hooks/*.json` wiring. Packets 006/007 move the effective Copilot prompt/startup path to top-level `.claude/settings.local.json` matcher wrappers that Copilot also ingests.

**Suggested changes:**
- [10] Update the Copilot fallback feature entry to name `.claude/settings.local.json` as the effective wrapper surface and note the top-level writer commands on `UserPromptSubmit` and `SessionStart`.

### [HIGH] `.opencode/skill/system-spec-kit/mcp_server/**/README.md` (Readme)

**Flagged by:** 10

**Reasons:**
- [10] The audited README bundle includes `mcp_server/hooks/copilot/README.md`, whose registration example still tells operators to use `.github/hooks/scripts/session-start.sh` and `.github/hooks/scripts/user-prompt-submitted.sh`. Packet 007 explicitly replaces the top-level Copilot no-op wrappers in `.claude/settings.local.json` with the real writer commands instead.

**Suggested changes:**
- [10] Refresh the Copilot hook registration example to show the Copilot-safe `.claude/settings.local.json` wrapper contract and clarify that Claude nested commands remain alongside the top-level Copilot fields.

### [HIGH] `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md` (Skill)

**Flagged by:** 10

**Reasons:**
- [10] The runtime coverage table still describes Copilot startup/recovery as `.github/hooks/superset-notify.json` sessionStart routing through `.github/hooks/scripts/session-start.sh`. Packets 006/007 establish `.claude/settings.local.json` as a checked-in Copilot execution surface via top-level wrapper fields and writer commands.

**Suggested changes:**
- [10] Revise the Copilot row to describe merged `.claude/settings.local.json` wrapper execution and mention the top-level `type`/`bash`/`timeoutSec` contract plus writer wiring.

### [HIGH] `.opencode/skill/system-spec-kit/references/config/hook_system.md` (Skill)

**Flagged by:** 04, 05, 06, 07, 10

**Reasons:**
- [04] This is the canonical runtime hook matrix and fallback contract cited by operator guidance. The Copilot row and fallback prose must reflect that prompt parity is now file-based, startup refresh is wrapper-driven/file-based, and hook output remains `{}` rather than model-visible context.
- [05] The runtime hook matrix and cross-runtime fallback text still mark Codex as lacking lifecycle hooks and describe it as recovery-only, which is now wrong after native Codex `SessionStart` parity shipped.
- [06] The canonical hook-system reference still shows a three-hook JSON example and lifecycle text that omits the Claude `UserPromptSubmit` prompt-time hook. This packet changed and verified the project-local Claude hook registration shape across four event blocks, so this reference is now stale.
- [07] The runtime hook matrix still says OpenCode has `n/a (advisor separate)` for prompt hooks and the fallback prose only names the compact plugin, but this packet shipped prompt-time advisor delivery through the OpenCode skill-advisor plugin via `experimental.chat.system.transform` plus `event` lifecycle handling.
- [10] The hook matrix and fallback prose still frame Copilot lifecycle support as "repo wrapper" wiring. Packet 006 adds a cross-runtime schema contract in `.claude/settings.local.json`, and packet 007 uses those same top-level wrapper fields to invoke the Copilot writers on `UserPromptSubmit` and `SessionStart`.

**Suggested changes:**
- [04] Revise the Copilot matrix row and cross-runtime fallback text to document file-based custom-instructions parity, wrapper-driven startup refresh, and next-prompt freshness semantics.
- [05] Revise the Codex row and fallback prose to document native `SessionStart` + `UserPromptSubmit`, required `codex_hooks` flag, `~/.codex/hooks.json` registration, and fallback-only use of operator recovery when hooks are unavailable.
- [06] Refresh the `.claude/settings.local.json` example and lifecycle notes to cover `UserPromptSubmit` explicitly and distinguish prompt-hook registration from lifecycle hooks under the normalized Claude schema.
- [07] Update the OpenCode row and fallback prose to document the skill-advisor plugin bridge, prompt-hook availability, and the concrete OpenCode hook surfaces now in use.
- [10] Update the runtime matrix, hook-registration example, and Copilot fallback prose to reflect the merged Claude-wrapper path and its top-level field requirements.

### [HIGH] `AGENTS.md` (AGENTS.md)

**Flagged by:** 05

**Reasons:**
- [05] The session-start guidance still says Codex has prompt hooks but no lifecycle/startup hook, which conflicts with this sub-packet's shipped native `SessionStart` parity and would misroute operators toward recovery-only behavior.

**Suggested changes:**
- [05] Update the Codex runtime note to state that Codex now supports native `SessionStart` and `UserPromptSubmit` hooks when `codex_hooks` and `~/.codex/hooks.json` wiring are enabled, with `/spec_kit:resume` as fallback.

### [MED] `.opencode/skill/system-spec-kit/manual_testing_playbook/**/*.md` (Skill)

**Flagged by:** 10

**Reasons:**
- [10] The audited playbook bundle includes `manual_testing_playbook/22--context-preservation-and-code-graph/252-cross-runtime-fallback.md`, which still validates Copilot enablement only through `.github/hooks/*.json`. That misses the new `.claude/settings.local.json` wrapper schema and writer-command path introduced by packets 006/007.

**Suggested changes:**
- [10] Expand the Copilot validation scenario to inspect `.claude/settings.local.json` top-level fields/commands and to smoke the managed-block refresh through that path.

### [MED] `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md` (Skill)

**Flagged by:** 03

**Reasons:**
- [03] Phase B verification exercises `SPECKIT_CODEX_HOOK_TIMEOUT_MS`, and the timeout behavior now matters because Codex returns a stale advisory instead of empty output on timeout. The env reference documents adjacent Codex/session knobs but does not list this timeout control.

**Suggested changes:**
- [03] Add `SPECKIT_CODEX_HOOK_TIMEOUT_MS` with default, scope, and the timeout fallback behavior for Codex `UserPromptSubmit` / advisor subprocess execution.

## Methodology

This report merges the hook-parity sub-packet impact analyses produced by parallel cli-codex gpt-5.4 high agents dispatched in fast mode. Sub-packets that no longer belong to this packet (skill-advisor: original 01, 02, 08, 09; code-graph hook work) have been dropped — see `008-skill-advisor/` and `007-code-graph/` for those impact entries. For each unique target file path across the remaining hook-parity source tables, severity was rolled up using MAX(HIGH=3, MED=2, LOW=1). All reasons and suggestions are preserved (prefixed with the original sub-packet ID) so the rationale from every flagging agent stays visible. Original per-sub-packet reports under `impact-analysis/NN-impact.md` remain the source of truth for per-analysis evidence.
