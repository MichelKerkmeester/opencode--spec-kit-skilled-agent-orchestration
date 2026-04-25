# 009 Impact Analysis — 06 (006-claude-hook-findings-remediation)

## Sub-packet Summary
- Sub-packet: `006-claude-hook-findings-remediation`
- Spec docs read: `spec.md` (depth 0), `plan.md` (depth 0), `tasks.md` (depth 0), `checklist.md` (depth 0), `implementation-summary.md` (depth 0)
- Work performed:
  - Persisted scan-time `sourceSignature` so skill-advisor freshness can reconcile to `live` after a successful scan instead of staying in a stale loop.
  - Extended the freshness publication path beyond the scan handler into context-server and daemon-triggered reindex flows, and updated status/freshness readers to consume the persisted signature.
  - Normalized `.claude/settings.local.json` to Claude-canonical nested hook groups across `UserPromptSubmit`, `SessionStart`, `PreCompact`, and `Stop`, removing outer `bash` and `timeoutSec` fields.
  - Added a multi-turn `claude -p --input-format stream-json` regression harness to the hook validation docs with cost guidance and a disable-flag caveat.
  - Added a cross-reference from the skill-advisor manual testing playbook to the new multi-turn harness.
- Key surfaces touched: `hooks`, `advisor`, `daemon`, `renderer/status`, `wiring`, `docs`

## Files Requiring Updates
| Path | Category | Reason | Severity | Suggested Change |
|---|---|---|---|---|
| `.opencode/skill/system-spec-kit/SKILL.md` | Skill | The Claude runtime-hook section still documents only `PreCompact`, `SessionStart`, and `Stop` in `.claude/settings.local.json`. This packet verified and normalized a four-event Claude surface that also includes `UserPromptSubmit`, so the current guidance understates the actual Claude hook wiring and schema. | HIGH | Update the Claude hook table and surrounding prose to include `UserPromptSubmit` and clarify that project-local Claude settings now use nested Claude `hooks` groups without outer `bash` / `timeoutSec` wrappers. |
| `.opencode/skill/system-spec-kit/references/config/hook_system.md` | Skill | The canonical hook-system reference still shows a three-hook JSON example and lifecycle text that omits the Claude `UserPromptSubmit` prompt-time hook. This packet changed and verified the project-local Claude hook registration shape across four event blocks, so this reference is now stale. | HIGH | Refresh the `.claude/settings.local.json` example and lifecycle notes to cover `UserPromptSubmit` explicitly and distinguish prompt-hook registration from lifecycle hooks under the normalized Claude schema. |

## Files Not Requiring Updates (from audit)
- Commands and agents were checked and found orthogonal: the packet changed Claude hook wiring, advisor freshness publication, and validation docs, not command entrypoints or agent-role contracts.
- Most audited READMEs and the single audited document were checked for hook/advisor/runtime guidance; at their current abstraction level they remain accurate or do not describe the changed surfaces directly.
- The audited root manual-testing-playbook package under `.opencode/skill/system-spec-kit/manual_testing_playbook/` was checked and left out because this packet updated the separate skill-advisor package playbook and hook-validation docs instead.
- `AGENTS.md` was checked and left out because it references the hook system generically but does not describe the stale Claude hook schema or the new `sourceSignature` freshness contract in enough detail to become incorrect.

## Evidence
- `.opencode/skill/system-spec-kit/SKILL.md`
  - Source spec evidence: [spec.md §3](../006-claude-hook-findings-remediation/spec.md) defines normalization across `UserPromptSubmit`, `SessionStart`, `PreCompact`, and `Stop` plus playbook updates; see especially lines 83-85 and 99-101.
  - Source implementation evidence: [tasks.md](../006-claude-hook-findings-remediation/tasks.md) marks the settings normalization and doc additions complete at lines 62-65.
  - Source verification evidence: [implementation-summary.md](../006-claude-hook-findings-remediation/implementation-summary.md) says the project-local Claude settings were normalized across the four event blocks at lines 76-90.
  - Target file currently stale: [SKILL.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/SKILL.md:735) lists only `PreCompact`, `SessionStart`, and `Stop`, with no `UserPromptSubmit` row through line 745.
- `.opencode/skill/system-spec-kit/references/config/hook_system.md`
  - Source spec evidence: [spec.md §4-5](../006-claude-hook-findings-remediation/spec.md) makes `UserPromptSubmit` hook-count verification and Claude-schema normalization explicit; see lines 115-116, 132-135, and 148-156.
  - Source implementation evidence: [implementation-summary.md](../006-claude-hook-findings-remediation/implementation-summary.md) records the normalized `.claude/settings.local.json` shape and the new multi-turn hook harness at lines 76-90.
  - Target file currently stale: [hook_system.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/config/hook_system.md:7) shows a three-hook registration example at lines 7-19 and lifecycle text at lines 21-29 that omits `UserPromptSubmit`.

## Uncertainty
- NEEDS VERIFICATION: the audit file located at `010-hook-parity/path-references-audit.md` is titled `005 Release Cleanup Playbooks` and its source inventory also points at `005-*` packet paths. I used the audited path rows as authoritative, but the packet-level heading/content mismatch suggests the audit artifact itself may be stale.
- NEEDS VERIFICATION: the audit includes the wildcard README row `.opencode/skill/system-spec-kit/mcp_server/**/README.md`. The concrete nested README most plausibly impacted by this packet is `mcp_server/skill-advisor/README.md`, but because the audit catalogs it only via a wildcard row and not as a single concrete file entry, I did not promote it into the required-update table.
