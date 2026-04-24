# Iteration 005: Create-command traceability sweep

## Focus
Traceability re-verification of the create-command folder-readme, agent workflow, and neighboring manual surfaces after confirming convergence is still blocked by active P0s.

## Findings
### P1 - Required
- **F011**: `create/agent.md` still falls back to retired memory-file loading language. The prior-session prompt is framed in canonical-doc terms, but the execution steps still say "Load most recent memory file" / "Load up to 3 recent memory files," which asks operators to rely on legacy memory-file semantics instead of only canonical spec docs and continuity anchors. [SOURCE: .opencode/command/create/agent.md:126] [SOURCE: .opencode/command/create/agent.md:128] [SOURCE: .opencode/command/create/agent.md:147] [SOURCE: .opencode/command/create/agent.md:148]

## Closure Checks
- F010 is closed: both folder-readme workflows now save and index `[SPEC_FOLDER]/implementation-summary.md` and explicitly say standalone `memory/*.md` files are retired. [SOURCE: .opencode/command/create/assets/create_folder_readme_auto.yaml:661] [SOURCE: .opencode/command/create/assets/create_folder_readme_auto.yaml:663] [SOURCE: .opencode/command/create/assets/create_folder_readme_confirm.yaml:663] [SOURCE: .opencode/command/create/assets/create_folder_readme_confirm.yaml:665]
- NF001 remains closed: both `create_agent` workflows still save the canonical `implementation-summary.md` and explicitly reject standalone `memory/*.md` targets. [SOURCE: .opencode/command/create/assets/create_agent_auto.yaml:577] [SOURCE: .opencode/command/create/assets/create_agent_auto.yaml:579] [SOURCE: .opencode/command/create/assets/create_agent_confirm.yaml:665] [SOURCE: .opencode/command/create/assets/create_agent_confirm.yaml:667]

## Ruled Out
- `create_agent_auto.yaml` does not route save/index steps to retired memory files; it targets `specs/[NNN]-[agent-name]/implementation-summary.md`. [SOURCE: .opencode/command/create/assets/create_agent_auto.yaml:577]
- `create_agent_confirm.yaml` does not reintroduce legacy save targets; it uses the same canonical implementation-summary target and retirement note. [SOURCE: .opencode/command/create/assets/create_agent_confirm.yaml:665] [SOURCE: .opencode/command/create/assets/create_agent_confirm.yaml:667]
- `create/testing-playbook.md` uses canonical prior-session sources (`handover.md`, `_memory.continuity`, canonical spec docs) rather than legacy memory files. [SOURCE: .opencode/command/create/testing-playbook.md:112] [SOURCE: .opencode/command/create/testing-playbook.md:113]

## Dead Ends
- Variable names like `memory_loaded` and `memory_choice` in the YAML/docs are legacy-flavored terminology, but in this pass they were not enough on their own to prove a legacy memory-file dependency in the workflow assets. [SOURCE: .opencode/command/create/assets/create_agent_auto.yaml:119] [SOURCE: .opencode/command/create/assets/create_agent_confirm.yaml:120]

## Recommended Next Focus
Re-check the remaining operator-facing lifecycle docs and cross-runtime agent manuals to confirm F003/F004 closure and narrow the remaining traceability drift to a final set of documentation surfaces.
