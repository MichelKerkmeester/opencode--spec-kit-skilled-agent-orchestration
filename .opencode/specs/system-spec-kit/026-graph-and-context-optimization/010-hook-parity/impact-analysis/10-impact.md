# 009 Impact Analysis — 10 (010-copilot-wrapper-schema-fix AND 011-copilot-writer-wiring)

## Sub-packet Summary
- Sub-packet: 010-copilot-wrapper-schema-fix AND 011-copilot-writer-wiring
- Spec docs read:
  - `010-copilot-wrapper-schema-fix/spec.md` (depth 1)
  - `010-copilot-wrapper-schema-fix/plan.md` (depth 1)
  - `010-copilot-wrapper-schema-fix/tasks.md` (depth 1)
  - `010-copilot-wrapper-schema-fix/implementation-summary.md` (depth 1)
  - `011-copilot-writer-wiring/spec.md` (depth 1)
  - `011-copilot-writer-wiring/plan.md` (depth 1)
  - `011-copilot-writer-wiring/tasks.md` (depth 1)
  - `011-copilot-writer-wiring/implementation-summary.md` (depth 1)
- Work performed:
  - Documented that Copilot merges `.github/hooks/*.json` and `.claude/settings.local.json`, and that Claude-style matcher wrappers crash Copilot unless the outer wrapper adds top-level `type`, `bash`, and `timeoutSec`.
  - Introduced a Copilot-safe wrapper contract for `.claude/settings.local.json` on `UserPromptSubmit`, `SessionStart`, `Stop`, and `PreCompact`.
  - Replaced the top-level no-op `bash: "true"` on `UserPromptSubmit` and `SessionStart` with real writer invocations to `dist/hooks/copilot/user-prompt-submit.js` and `dist/hooks/copilot/session-prime.js`.
  - Raised wrapper `timeoutSec` from `3` to `5` for the two writer-backed Copilot paths.
  - Shifted the effective Copilot-side writer execution path away from the Superset-clobbered `.github/hooks/superset-notify.json` surface and into top-level `.claude/settings.local.json` wrapper commands.
  - Preserved Claude's nested `hooks[0].command` behavior while layering Copilot-safe top-level fields on the same matcher groups.
  - Packet docs record that this landed in `162a6cb16c` and was later removed by `6cd00aa51b`; the impact below is the documentation fallout from that introduced surface.
- Key surfaces touched: hooks, schema, wiring, runtime-integration, advisor/custom-instructions transport

## Files Requiring Updates
| Path | Category | Reason | Severity | Suggested Change |
|---|---|---|---|---|
| `.opencode/skill/system-spec-kit/feature_catalog/**` | Skill | The audited feature catalog bundle includes `feature_catalog/22--context-preservation-and-code-graph/05-cross-runtime-fallback.md`, which still says Copilot uses repo-scoped `.github/hooks/*.json` wiring. Packets 010/011 move the effective Copilot prompt/startup path to top-level `.claude/settings.local.json` matcher wrappers that Copilot also ingests. | HIGH | Update the Copilot fallback feature entry to name `.claude/settings.local.json` as the effective wrapper surface and note the top-level writer commands on `UserPromptSubmit` and `SessionStart`. |
| `.opencode/skill/system-spec-kit/mcp_server/**/README.md` | README | The audited README bundle includes `mcp_server/hooks/copilot/README.md`, whose registration example still tells operators to use `.github/hooks/scripts/session-start.sh` and `.github/hooks/scripts/user-prompt-submitted.sh`. Packet 011 explicitly replaces the top-level Copilot no-op wrappers in `.claude/settings.local.json` with the real writer commands instead. | HIGH | Refresh the Copilot hook registration example to show the Copilot-safe `.claude/settings.local.json` wrapper contract and clarify that Claude nested commands remain alongside the top-level Copilot fields. |
| `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md` | Skill | The runtime coverage table still describes Copilot startup/recovery as `.github/hooks/superset-notify.json` sessionStart routing through `.github/hooks/scripts/session-start.sh`. Packets 010/011 establish `.claude/settings.local.json` as a checked-in Copilot execution surface via top-level wrapper fields and writer commands. | HIGH | Revise the Copilot row to describe merged `.claude/settings.local.json` wrapper execution and mention the top-level `type`/`bash`/`timeoutSec` contract plus writer wiring. |
| `.opencode/skill/system-spec-kit/references/config/hook_system.md` | Skill | The hook matrix and fallback prose still frame Copilot lifecycle support as "repo wrapper" wiring. Packet 010 adds a cross-runtime schema contract in `.claude/settings.local.json`, and packet 011 uses those same top-level wrapper fields to invoke the Copilot writers on `UserPromptSubmit` and `SessionStart`. | HIGH | Update the runtime matrix, hook-registration example, and Copilot fallback prose to reflect the merged Claude-wrapper path and its top-level field requirements. |
| `.opencode/skill/system-spec-kit/SKILL.md` | Skill | The startup-surface overview treats `.claude/settings.local.json` as Claude-only and describes Copilot only as generic "local hook configuration or wrapper wiring." After packets 010/011, that same file becomes a concrete Copilot integration surface with explicit wrapper fields and writer commands. | MED | Add a short Copilot note in the startup-surfaces section pointing to the shared `.claude/settings.local.json` wrapper contract and the hook-system reference. |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/**/*.md` | Skill | The audited playbook bundle includes `manual_testing_playbook/22--context-preservation-and-code-graph/252-cross-runtime-fallback.md`, which still validates Copilot enablement only through `.github/hooks/*.json`. That misses the new `.claude/settings.local.json` wrapper schema and writer-command path introduced by packets 010/011. | MED | Expand the Copilot validation scenario to inspect `.claude/settings.local.json` top-level fields/commands and to smoke the managed-block refresh through that path. |

## Files Not Requiring Updates (from audit)
- The `Commands`, `Agents`, and `AGENTS.md` audit sections were checked and are orthogonal; packets 010/011 do not change command syntax, agent routing contracts, or gate behavior.
- The `Documents` section and the top-level audit rows such as `.opencode/README.md` and `.opencode/skill/system-spec-kit/README.md` remain broadly accurate because they describe high-level capabilities, not the specific Copilot wrapper path.
- Audit entries for memory/search/code-graph/storage/schema/tooling files under `mcp_server/lib/**`, `mcp_server/schemas/*`, `mcp_server/tools/*`, `scripts/**`, `shared/**`, and env/config references were checked and deemed unaffected; this sub-packet only changes hook wrapper schema and Copilot writer invocation routing.

## Evidence
- `.opencode/skill/system-spec-kit/feature_catalog/**`
  Source: `010-copilot-wrapper-schema-fix/spec.md:52-68` documents that Copilot ingests `.claude/settings.local.json` and requires top-level wrapper fields; `011-copilot-writer-wiring/spec.md:47-60` documents replacing top-level `bash: "true"` with real Copilot writer commands.
  Target: `feature_catalog/22--context-preservation-and-code-graph/05-cross-runtime-fallback.md:12-18` still says Copilot uses repo-scoped `.github/hooks/*.json` wiring and that `enabled` means repo hooks refresh custom instructions.
- `.opencode/skill/system-spec-kit/mcp_server/**/README.md`
  Source: `011-copilot-writer-wiring/spec.md:49-60` defines the new top-level writer commands in `.claude/settings.local.json`; `011-copilot-writer-wiring/implementation-summary.md:67-90` shows the exact historical landing shape for `UserPromptSubmit` and `SessionStart`.
  Target: `mcp_server/hooks/copilot/README.md:25-49` still publishes `.github/hooks/scripts/session-start.sh` and `.github/hooks/scripts/user-prompt-submitted.sh` as the registration contract.
- `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md`
  Source: `010-copilot-wrapper-schema-fix/spec.md:52-69` establishes `.claude/settings.local.json` as Copilot-ingested config, and `011-copilot-writer-wiring/spec.md:49-60` makes it the active writer path.
  Target: `mcp_server/INSTALL_GUIDE.md:129-139` still describes Copilot's visible repo surface as `.github/hooks/superset-notify.json` sessionStart routing through `.github/hooks/scripts/session-start.sh`.
- `.opencode/skill/system-spec-kit/references/config/hook_system.md`
  Source: `010-copilot-wrapper-schema-fix/spec.md:52-59` explains the wrapper-schema collision and required top-level fields; `011-copilot-writer-wiring/spec.md:49-60` explains that Copilot executes the top-level `bash` from the same wrappers.
  Target: `references/config/hook_system.md:9-19` shows `.claude/settings.local.json` only as Claude registration, and `references/config/hook_system.md:52-62` still summarizes Copilot lifecycle support as repo-wrapper wiring rather than merged Claude-wrapper execution.

## Uncertainty
- NEEDS VERIFICATION: `.opencode/skill/system-spec-kit/feature_catalog/**` — impact is confirmed for `feature_catalog/22--context-preservation-and-code-graph/05-cross-runtime-fallback.md`; other feature-catalog members in the wildcard audit row were not re-read.
- NEEDS VERIFICATION: `.opencode/skill/system-spec-kit/mcp_server/**/README.md` — impact is confirmed for `mcp_server/hooks/copilot/README.md`; other README members in the wildcard audit row were not re-read.
- NEEDS VERIFICATION: `.opencode/skill/system-spec-kit/manual_testing_playbook/**/*.md` — impact is confirmed for `manual_testing_playbook/22--context-preservation-and-code-graph/252-cross-runtime-fallback.md`; other playbook members in the wildcard audit row were not re-read.
