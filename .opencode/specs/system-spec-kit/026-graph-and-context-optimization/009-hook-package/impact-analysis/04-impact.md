# 009 Impact Analysis — 04 (004-copilot-hook-parity-remediation)

## Sub-packet Summary
- Sub-packet: `004-copilot-hook-parity-remediation`
- Spec docs read: `spec.md` (depth 0), `plan.md` (depth 0), `tasks.md` (depth 0), `implementation-summary.md` (depth 0), `decision-record.md` (depth 0), `checklist.md` (depth 0)
- Work performed:
- Classified Copilot parity as outcome `B` because Copilot customer hooks cannot mutate prompts, while custom instructions provide a viable file-based surface.
- Introduced `hooks/copilot/custom-instructions.ts` to render and merge a managed `SPEC-KIT-COPILOT-CONTEXT` block into `$HOME/.copilot/copilot-instructions.md`.
- Reworked `hooks/copilot/user-prompt-submit.ts` and `hooks/copilot/session-prime.ts` so both refresh the managed custom-instructions block and return `{}` instead of model-visible prompt payloads.
- Wired repository-side `userPromptSubmitted` execution through `.github/hooks/scripts/user-prompt-submitted.sh` and added a programmatic `copilot -p` shell-wrapper pattern.
- Updated the documented parity model to say Copilot is file-based and next-prompt fresh rather than true in-turn `additionalContext`.
- Key surfaces touched: `hooks`, `advisor`, `wiring`, `runtime integration`, `config`, `docs`

## Files Requiring Updates
| Path | Category | Reason | Severity | Suggested Change |
|---|---|---|---|---|
| `.opencode/skill/system-spec-kit/ARCHITECTURE.md` | Skill | This packet changed the documented Copilot hook transport from an implied hook-output path to an explicit file-based custom-instructions path. The runtime integration table and hook narrative need to describe `user-prompt-submit.ts` / `session-prime.ts` as writers to `$HOME/.copilot/copilot-instructions.md`, with `custom-instructions.ts` as a first-class module. | HIGH | Update the hook integration table and surrounding prose to state that Copilot prompt/startup hooks refresh managed custom instructions and do not use prompt-mutating stdout. |
| `.opencode/skill/system-spec-kit/references/config/hook_system.md` | Skill | This is the canonical runtime hook matrix and fallback contract cited by operator guidance. The Copilot row and fallback prose must reflect that prompt parity is now file-based, startup refresh is wrapper-driven/file-based, and hook output remains `{}` rather than model-visible context. | HIGH | Revise the Copilot matrix row and cross-runtime fallback text to document file-based custom-instructions parity, wrapper-driven startup refresh, and next-prompt freshness semantics. |
| `.opencode/skill/system-spec-kit/README.md` | README | The package overview includes the runtime-hooks summary for the native skill-advisor package. This packet changes what that overview needs to say about Copilot: it is no longer "missing parity," but it is also not prompt-mutating parity. | MED | Add or tune the Copilot runtime-hooks summary to mention `$HOME/.copilot/copilot-instructions.md`, file-based refresh, and the distinction from true in-turn prompt injection. |
| `.opencode/skill/system-spec-kit/SKILL.md` | Skill | The startup/recovery guidance includes cross-runtime startup surfaces and Copilot handling. This packet changes that surface from generic startup-helper language to a concrete file-based custom-instructions model with next-prompt freshness limits. | MED | Expand the cross-runtime startup section so Copilot guidance explicitly mentions managed custom instructions, wrapper wiring, and fallback expectations. |

## Files Not Requiring Updates (from audit)
- The audited `Commands`, `Documents`, and `Agents` sections are orthogonal to this packet because it did not change command syntax, agent-role contracts, or the install-guide surface catalogued there.
- Most audited `README` and `Skill` entries concern memory/indexing, templates, validation, or generic routing; they do not document Copilot hook transport, advisor-brief delivery, or custom-instructions wiring.
- The audited root `AGENTS.md` entry delegates runtime-hook truth to `references/config/hook_system.md`; this packet changes that source-of-truth doc, not the broader workflow gate text itself.

## Evidence
- `.opencode/skill/system-spec-kit/ARCHITECTURE.md`
- Source change evidence: `implementation-summary.md:61-75` records the managed custom-instructions design and says `user-prompt-submit.ts` / `session-prime.ts` refresh the file-backed block; `implementation-summary.md:83-91` says Copilot hook outputs are ignored for prompt injection and that docs were updated for the file-based parity model; `decision-record.md:59-65` records the accepted switch to `$HOME/.copilot/copilot-instructions.md`.
- Target section: `ARCHITECTURE.md:333-344` is the runtime hook integration matrix and narrative that must carry the Copilot transport contract.
- `.opencode/skill/system-spec-kit/references/config/hook_system.md`
- Source change evidence: `decision-record.md:59-65` states that `sessionStart` / `userPromptSubmitted` outputs are ignored and that the accepted path is a static-file rewrite at `$HOME/.copilot/copilot-instructions.md`; `tasks.md:53-56` records the writer, the freshness trade-off, and the Copilot smoke result; `implementation-summary.md:63-75` records the final file-based parity model.
- Target section: `references/config/hook_system.md:48-62` is the canonical runtime hook matrix plus cross-runtime fallback text that must describe Copilot's file-based prompt/startup behavior.

## Uncertainty
- NEEDS VERIFICATION: The supplied audit file at `009-hook-package/path-references-audit.md` is headed `005 Release Cleanup Playbooks — Path References Audit` and appears to catalogue a different packet. I therefore treated its listed paths as authoritative but used overlap-only reasoning.
- NEEDS VERIFICATION: The packet implementation summary says feature-catalog and manual-testing docs were updated, but the supplied audit only lists broad wildcard rows (`.opencode/skill/system-spec-kit/feature_catalog/**`, `.opencode/skill/system-spec-kit/manual_testing_playbook/`, `.opencode/skill/system-spec-kit/manual_testing_playbook/**`, `.opencode/skill/system-spec-kit/manual_testing_playbook/**/*.md`) rather than the concrete Copilot files. Those rows are plausibly impacted, but the exact audit-listed target cannot be narrowed further without a corrected audit.
- NEEDS VERIFICATION: Packet-explicit Copilot docs such as `.opencode/skill/cli-copilot/SKILL.md`, `.opencode/skill/cli-copilot/README.md`, `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/README.md`, and `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md` are not present in the supplied audit, so they could not be listed in `Files Requiring Updates` despite being part of the documented change set.
