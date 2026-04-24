# 009 Impact Analysis — 07 (007-opencode-plugin-loader-remediation)

## Sub-packet Summary
- Sub-packet: `007-opencode-plugin-loader-remediation`
- Spec docs read: `spec.md` (depth 0), `plan.md` (depth 0), `tasks.md` (depth 0), `implementation-summary.md` (depth 0), `decision-record.md` (depth 0), `checklist.md` (depth 0)
- Work performed:
- Moved non-plugin helper modules out of `.opencode/plugins/` into `.opencode/plugin-helpers/`, leaving `.opencode/plugins/` as an entrypoints-only folder.
- Updated both OpenCode plugin entrypoints to resolve relocated bridge/schema helpers from `../plugin-helpers/...`.
- Hardened `parseTransportPlan()` so legacy loader invocation returns `{}` instead of `null`, removing the null-hook crash class.
- Added a folder-purity vitest guard plus a plugin-folder README that documents the entrypoints-only convention and OpenCode 1.3.17 upgrade probe.
- Remapped the skill-advisor plugin from ignored Claude-style hook names to OpenCode `event` plus `experimental.chat.system.transform`, while keeping the `tool` surface intact.
- Corrected OpenCode status semantics so `runtime_ready` reflects lifecycle readiness, added `advisor_lookups`, guarded `output.system`, and normalized session IDs for cache keys.
- Key surfaces touched: `plugin-loader`, `hooks`, `advisor`, `runtime integration`, `cache/status semantics`, `wiring`, `docs`, `tests`

## Files Requiring Updates
| Path | Category | Reason | Severity | Suggested Change |
|---|---|---|---|---|
| `.opencode/skill/system-spec-kit/references/config/hook_system.md` | `Skill` | The runtime hook matrix still says OpenCode has `n/a (advisor separate)` for prompt hooks and the fallback prose only names the compact plugin, but this packet shipped prompt-time advisor delivery through the OpenCode skill-advisor plugin via `experimental.chat.system.transform` plus `event` lifecycle handling. | HIGH | Update the OpenCode row and fallback prose to document the skill-advisor plugin bridge, prompt-hook availability, and the concrete OpenCode hook surfaces now in use. |
| `.opencode/README.md` | `README` | The Gate 2 and framework-usage sections still describe skill routing as `skill_advisor.py`-driven only, which now under-describes hook-capable runtime behavior after OpenCode began surfacing advisor briefs automatically through the plugin bridge. | MED | Revise Gate 2 wording to say runtime hook briefs are primary when available and `skill_advisor.py` is the fallback/scripted path. |
| `.opencode/install_guides/SET-UP - AGENTS.md` | `Document` | The Gate 2 setup examples still teach script-only skill routing (`skill_advisor.py`) for OpenCode AGENTS guidance, but this packet restored OpenCode prompt-time advisor brief delivery through the plugin hook path. | MED | Refresh the Gate 2 examples so they mention the automatic Skill Advisor Hook brief first and keep `skill_advisor.py` as fallback/diagnostics guidance. |

## Files Not Requiring Updates (from audit)
- Checked all audited `README`, `Document`, `Command`, `Agent`, `Skill`, and `AGENTS.md` sections.
- The audited command docs are memory/spec-kit workflow references and do not document OpenCode plugin-loader behavior, advisor-hook wiring, or status-tool semantics changed here.
- The audited agent entries, most MCP server source/test references, memory/indexing docs, template docs, and manual-testing/playbook references are orthogonal to this sub-packet's OpenCode plugin and advisor-hook remediation.
- `AGENTS.md`, `.opencode/skill/system-spec-kit/SKILL.md`, and `.opencode/skill/system-spec-kit/README.md` stay accurate at their current abstraction level; they do not currently assert the stale OpenCode hook details that require correction in the rows above.

## Evidence
- `.opencode/skill/system-spec-kit/references/config/hook_system.md`
- Source change evidence: `implementation-summary.md:58-66` records the shipped remap from `onUserPromptSubmitted`/`onSessionStart`/`onSessionEnd` to OpenCode `experimental.chat.system.transform` plus `event`, and the Phase 5 status-metric/readiness changes; `decision-record.md:193-207` records the accepted OpenCode hook-surface mapping; `tasks.md:90-105` records the implemented hook/API verification and the new `advisor_lookups` accounting.
- Target evidence: `.opencode/skill/system-spec-kit/references/config/hook_system.md:52-62` still marks OpenCode prompt hooks as `n/a (advisor separate)` and only documents the compact plugin in the cross-runtime fallback prose.

## Uncertainty
- NEEDS VERIFICATION: The supplied audit file at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/path-references-audit.md` is headed `005 Release Cleanup Playbooks — Path References Audit` and appears to catalog a different packet. This analysis therefore used only the paths actually listed in that mismatched audit.
- NEEDS VERIFICATION: Non-audited files explicitly touched by this sub-packet, especially `.opencode/plugins/README.md`, `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md`, and the Skill Advisor package README under `mcp_server/skill-advisor/`, could also warrant documentation sync but cannot be listed here because they do not appear as concrete paths in the supplied audit.
