# 009 Impact Analysis — 05 (005-codex-hook-parity-remediation)

## Sub-packet Summary
- Sub-packet: `005-codex-hook-parity-remediation`
- Spec docs read: `spec.md` (depth 0), `plan.md` (depth 0), `tasks.md` (depth 0), `implementation-summary.md` (depth 0), `decision-record.md` (depth 0), `checklist.md` (depth 0)
- Work performed:
- Confirmed Codex CLI 0.122.0 supports developer-context injection for both `SessionStart` and `UserPromptSubmit`, including `hookSpecificOutput.additionalContext`, feature-flag gating, and concurrent multi-hook dispatch.
- Shipped native Codex adapters under `mcp_server/hooks/codex/` for startup context and advisor brief delivery.
- Added Codex-focused regression coverage and smoke validation while preserving Claude behavior.
- Wired live user-local Codex config through `~/.codex/hooks.json` and `~/.codex/config.toml`, preserving existing Superset `notify.sh` entries.
- Added a Codex hook authoring contract reference and updated Codex-facing docs to treat native hooks as the primary path.
- Recorded follow-up documentation sync for manual testing playbooks, feature catalogs, and README-style operator docs.
- Key surfaces touched: `hooks`, `advisor`, `wiring`, `config`, `runtime integration`, `contract docs`

## Files Requiring Updates
| Path | Category | Reason | Severity | Suggested Change |
|---|---|---|---|---|
| `AGENTS.md` | `AGENTS.md` | The session-start guidance still says Codex has prompt hooks but no lifecycle/startup hook, which conflicts with this sub-packet's shipped native `SessionStart` parity and would misroute operators toward recovery-only behavior. | HIGH | Update the Codex runtime note to state that Codex now supports native `SessionStart` and `UserPromptSubmit` hooks when `codex_hooks` and `~/.codex/hooks.json` wiring are enabled, with `/spec_kit:resume` as fallback. |
| `.opencode/skill/system-spec-kit/references/config/hook_system.md` | `Skill` | The runtime hook matrix and cross-runtime fallback text still mark Codex as lacking lifecycle hooks and describe it as recovery-only, which is now wrong after native Codex `SessionStart` parity shipped. | HIGH | Revise the Codex row and fallback prose to document native `SessionStart` + `UserPromptSubmit`, required `codex_hooks` flag, `~/.codex/hooks.json` registration, and fallback-only use of operator recovery when hooks are unavailable. |

## Files Not Requiring Updates (from audit)
- The audited README and command surfaces are mostly release-cleanup, memory, template, or generic routing docs; they do not describe Codex hook wiring, advisor brief delivery, or the Codex runtime hook contract changed here.
- The audited tool-routing feature catalog and manual testing playbook entries focus on CocoIndex and Code Graph routing enforcement, not hook transport parity, so they are orthogonal to this sub-packet.
- The audited agent references and generic memory/indexing docs do not document Codex `SessionStart`/`UserPromptSubmit` behavior or the `codex_hooks` activation path touched here.

## Evidence
- `AGENTS.md`
- Source change evidence: `decision-record.md:69-86` documents accepted full Codex parity and the actual hook contract; `decision-record.md:120-126` records the implemented native `SessionStart` + `UserPromptSubmit` path; `implementation-summary.md:50-66` says Codex now receives startup context and advisor brief through native hooks and that docs should treat prompt-wrapper language as fallback only.
- Target evidence: `AGENTS.md:92-98` still says "Codex has prompt hooks but no lifecycle startup hook" and routes operators directly to fallback recovery guidance.
- `.opencode/skill/system-spec-kit/references/config/hook_system.md`
- Source change evidence: `decision-record.md:75-86` records that Codex `SessionStart` injects developer context and requires `codex_hooks = true`; `decision-record.md:120-126` records the shipped native wiring; `implementation-summary.md:50-58` records live `SessionStart`/`UserPromptSubmit` delivery plus config activation.
- Target evidence: `references/config/hook_system.md:52-62` still lists Codex as `Prompt hook=yes`, `Lifecycle hook=no`, `Compaction=no`, `Stop=no` and says Codex "does not support lifecycle hooks; it relies on the explicit operator recovery path instead."

## Uncertainty
- NEEDS VERIFICATION: The supplied audit file at `009-hook-parity/path-references-audit.md` is headed `005 Release Cleanup Playbooks — Path References Audit` and appears to catalog a different packet. This analysis therefore used overlap-only reasoning against the files actually listed in that mismatched audit. Codex-specific docs mentioned by this sub-packet, especially `.opencode/skill/cli-codex/SKILL.md`, `.opencode/skill/cli-codex/README.md`, and `.opencode/skill/cli-codex/references/hook_contract.md`, are not present in the supplied audit and could not be listed here despite being explicitly touched by the implementation record.
