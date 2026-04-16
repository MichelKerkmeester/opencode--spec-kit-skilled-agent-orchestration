# Iteration 52 - correctness - command-yamls-part1

## Dispatcher
- iteration: 52 of 70
- dispatcher: cli-copilot gpt-5.4 high (operational doc review)
- timestamp: 2026-04-16T06:45:54.758Z

## Files Reviewed
- .opencode/command/create/assets/create_agent_auto.yaml
- .opencode/command/create/assets/create_agent_confirm.yaml
- .opencode/command/create/assets/create_changelog_auto.yaml
- .opencode/command/create/assets/create_changelog_confirm.yaml
- .opencode/command/create/assets/create_feature_catalog_auto.yaml
- .opencode/command/create/assets/create_feature_catalog_confirm.yaml
- .opencode/command/create/assets/create_folder_readme_auto.yaml
- .opencode/command/create/assets/create_folder_readme_confirm.yaml
- .opencode/command/create/assets/create_sk_skill_auto.yaml
- .opencode/command/create/assets/create_sk_skill_confirm.yaml
- .opencode/command/create/assets/create_testing_playbook_auto.yaml
- .opencode/command/create/assets/create_testing_playbook_confirm.yaml
- .opencode/command/doctor/assets/doctor_mcp_debug.yaml
- .opencode/command/doctor/assets/doctor_mcp_install.yaml

## Findings - New
### P0 Findings
- None.

### P1 Findings
- **`doctor_mcp_install.yaml` hard-codes runtime `guide_section` labels that do not exist across the install guides the workflow tells the agent to read.** Step 4 says the agent should read each server guide's Configuration section and present the correct snippet, and the only runtime-specific locator in the YAML is `config_files[*].guide_section` [SOURCE: .opencode/command/doctor/assets/doctor_mcp_install.yaml:113-139; .opencode/command/doctor/assets/doctor_mcp_install.yaml:228-247]. Those labels diverge from the actual guides: the YAML maps OpenCode to `Option B: Copilot / OpenCode`, but Spec Kit Memory uses `Option A: OpenCode`, Code Mode uses `Option B: Configure for OpenCode`, and Sequential Thinking uses `Option A: Configure for OpenCode`; the YAML also maps VS Code/Copilot to `Option A: Claude Code / Option B`, which matches none of the reviewed MCP guides [SOURCE: .opencode/install_guides/MCP - Spec Kit Memory.md:275-318; .opencode/install_guides/MCP - Code Mode.md:320-388; .opencode/install_guides/MCP - Sequential Thinking.md:180-236; .opencode/install_guides/MCP - CocoIndex Code.md:339-418]. Following the workflow literally can therefore send the agent to the wrong section or no section at all when it tries to wire configs for non-CocoIndex servers.

```json
{
  "claim": "doctor_mcp_install.yaml's runtime guide_section mapping is not aligned with the real install-guide section names, so the workflow's Step 4 cannot reliably locate the promised config snippets across the supported MCP guides.",
  "evidenceRefs": [
    ".opencode/command/doctor/assets/doctor_mcp_install.yaml:113-139",
    ".opencode/command/doctor/assets/doctor_mcp_install.yaml:228-247",
    ".opencode/install_guides/MCP - Spec Kit Memory.md:275-318",
    ".opencode/install_guides/MCP - Code Mode.md:320-388",
    ".opencode/install_guides/MCP - Sequential Thinking.md:180-236",
    ".opencode/install_guides/MCP - CocoIndex Code.md:339-418"
  ],
  "counterevidenceSought": "I checked whether the YAML or the paired mcp_install command doc defined a separate normalization layer that translates guide_section labels before lookup; none was present in the reviewed operational-doc slice.",
  "alternativeExplanation": "A human operator could manually skim the guide and ignore the guide_section labels, but that is weaker than the deterministic section lookup the YAML contract describes.",
  "finalSeverity": "P1",
  "confidence": 0.96,
  "downgradeTrigger": "Downgrade if runtime code ignores guide_section entirely and always performs a broader full-guide search, or if a separate non-reviewed normalizer rewrites these labels before Step 4 consumes them."
}
```

### P2 Findings
- **The changelog workflow's scale claim is stale.** Both changelog variants still say they should match `370+ existing changelogs`, but the current tree contains 355 versioned changelog files, so the agent-loaded guidance is no longer factually current [SOURCE: .opencode/command/create/assets/create_changelog_auto.yaml:41; .opencode/command/create/assets/create_changelog_confirm.yaml:41; Bash probe on 2026-04-16 in `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public` using `find .opencode/changelog -type f -name 'v*.md' | wc -l` -> `355`].

## Traceability Checks
- **Command -> implementation alignment:** `doctor_mcp_debug.yaml` still matches the live diagnostic script's four-server scope and server names (`spec_kit_memory`, `cocoindex_code`, `code_mode`, `sequential_thinking`) [SOURCE: .opencode/command/doctor/assets/doctor_mcp_debug.yaml:21-31; .opencode/command/doctor/assets/doctor_mcp_debug.yaml:97-116; .opencode/command/doctor/scripts/mcp-doctor.sh:16; .opencode/command/doctor/scripts/mcp-doctor.sh:50; .opencode/command/doctor/scripts/mcp-doctor.sh:59-62; .opencode/command/doctor/scripts/mcp-doctor.sh:489-524].
- **Command -> asset/file existence:** the reviewed create workflows mostly point at live assets: `agent_template.md`, `feature_catalog_template.md`, `manual_testing_playbook_template.md`, `skill_md_template.md`, `changelog_template.md`, `validate_document.py`, `extract_structure.py`, `quick_validate.py`, and `package_skill.py` are all present, and the README/install-guide workflow's linked Code Mode and Chrome Dev Tools guides resolve on disk [SOURCE: .opencode/command/create/assets/create_agent_auto.yaml:167-177; .opencode/command/create/assets/create_feature_catalog_auto.yaml:146-157; .opencode/command/create/assets/create_testing_playbook_auto.yaml:146-157; .opencode/command/create/assets/create_sk_skill_auto.yaml:191-200; .opencode/command/create/assets/create_changelog_auto.yaml:252-303; .opencode/command/create/assets/create_folder_readme_auto.yaml:908-909].
- **Cross-runtime entrypoint check:** spot checks show the Gemini doctor command wrappers still route to these YAML assets first, and the Codex write agent still advertises the same create-command surfaces, so the `.opencode/command/**/assets/*.yaml` files remain the live source of truth across runtimes for this slice [SOURCE: .gemini/commands/doctor/mcp_debug.toml:1-2; .gemini/commands/doctor/mcp_install.toml:1-2; .codex/agents/write.toml:174-186].

## Confirmed-Clean Surfaces
- **`create_feature_catalog_auto.yaml` + `create_feature_catalog_confirm.yaml`** — sk-doc references, templates, validators, and corresponding command entrypoint wiring are present and internally consistent.
- **`create_sk_skill_auto.yaml` + `create_sk_skill_confirm.yaml`** — supported operations, template sources, validator scripts, and command entrypoint examples line up with the current repo layout.
- **`create_testing_playbook_auto.yaml` + `create_testing_playbook_confirm.yaml`** — rooted playbook contract, template paths, and validation hooks resolve cleanly.
- **`create_folder_readme_auto.yaml` + `create_folder_readme_confirm.yaml`** — dual README/install routing is intact, and the linked Code Mode / Chrome Dev Tools guides exist at the referenced paths.
- **`doctor_mcp_debug.yaml`** — server list, script path, and repair-oriented flow still line up with `mcp-doctor.sh`.

## Next Focus
- Iteration 53 should continue operational-doc correctness on the remaining command/runtime wrappers, especially places where runtime-specific docs duplicate YAML-controlled routing or config-section labels.
