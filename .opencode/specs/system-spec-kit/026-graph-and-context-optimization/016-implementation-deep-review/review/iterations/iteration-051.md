# Iteration 51 - correctness - command-mds

## Dispatcher
- iteration: 51 of 70
- dispatcher: cli-copilot gpt-5.4 high (operational doc review)
- timestamp: 2026-04-16T06:45:30.790Z

## Files Reviewed
- `.opencode/command/agent_router.md`
- `.opencode/command/create/agent.md`
- `.opencode/command/create/changelog.md`
- `.opencode/command/create/feature-catalog.md`
- `.opencode/command/create/folder_readme.md`
- `.opencode/command/create/sk-skill.md`
- `.opencode/command/create/testing-playbook.md`
- `.opencode/command/doctor/mcp_debug.md`
- `.opencode/command/doctor/mcp_install.md`
- `.opencode/command/improve/agent.md`
- `.opencode/command/improve/prompt.md`
- `.opencode/command/memory/learn.md`

## Findings - New
### P0 Findings
- None.

### P1 Findings
1. **`/create:feature-catalog` documents the wrong root filename, so the command markdown and routed YAML disagree on the file the executor must create and validate.** The markdown contract requires `feature_catalog/FEATURE_CATALOG.md`, but both YAML workflows create and validate `feature_catalog/feature_catalog.md` instead. An executor following the command body will target the wrong root artifact.
   - Evidence: `.opencode/command/create/feature-catalog.md:260`, `.opencode/command/create/feature-catalog.md:264`, `.opencode/command/create/feature-catalog.md:292`, `.opencode/command/create/feature-catalog.md:337`; `.opencode/command/create/assets/create_feature_catalog_auto.yaml:136-145`, `.opencode/command/create/assets/create_feature_catalog_auto.yaml:174-175`; `.opencode/command/create/assets/create_feature_catalog_confirm.yaml:150-156`, `.opencode/command/create/assets/create_feature_catalog_confirm.yaml:188-189`

```json
{"claim":"`/create:feature-catalog` tells the executor to create and validate `FEATURE_CATALOG.md`, but the routed auto/confirm YAMLs target `feature_catalog.md`, so the command contract points at the wrong root file.","evidenceRefs":[".opencode/command/create/feature-catalog.md:260",".opencode/command/create/feature-catalog.md:264",".opencode/command/create/feature-catalog.md:292",".opencode/command/create/feature-catalog.md:337",".opencode/command/create/assets/create_feature_catalog_auto.yaml:136-145",".opencode/command/create/assets/create_feature_catalog_auto.yaml:174-175",".opencode/command/create/assets/create_feature_catalog_confirm.yaml:150-156",".opencode/command/create/assets/create_feature_catalog_confirm.yaml:188-189"],"counterevidenceSought":"Checked both routed YAML files and the shipped lowercase-root surfaces already present under `.opencode/skill/**/feature_catalog/feature_catalog.md`; did not find any runtime workflow that still targets `FEATURE_CATALOG.md`.","alternativeExplanation":"The markdown appears to preserve an older uppercase-root contract after the YAML workflows and shipped packages were migrated to lowercase roots.","finalSeverity":"P1","confidence":0.99,"downgradeTrigger":"Downgrade if the routed YAMLs and shipped package contract are changed back to `FEATURE_CATALOG.md` before runtime use."}
```

2. **`/create:testing-playbook` has the same command↔YAML filename split and points the operator at a non-runtime root file.** The markdown requires `manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md`, but the routed YAMLs create and validate `manual_testing_playbook/manual_testing_playbook.md`.
   - Evidence: `.opencode/command/create/testing-playbook.md:260`, `.opencode/command/create/testing-playbook.md:264`, `.opencode/command/create/testing-playbook.md:298`, `.opencode/command/create/testing-playbook.md:348`; `.opencode/command/create/assets/create_testing_playbook_auto.yaml:136-143`, `.opencode/command/create/assets/create_testing_playbook_auto.yaml:180-181`; `.opencode/command/create/assets/create_testing_playbook_confirm.yaml:150-156`, `.opencode/command/create/assets/create_testing_playbook_confirm.yaml:194-195`

```json
{"claim":"`/create:testing-playbook` documents `MANUAL_TESTING_PLAYBOOK.md` as the canonical root, but the routed YAML workflows operate on lowercase `manual_testing_playbook.md`, so the markdown contract does not match the executable flow.","evidenceRefs":[".opencode/command/create/testing-playbook.md:260",".opencode/command/create/testing-playbook.md:264",".opencode/command/create/testing-playbook.md:298",".opencode/command/create/testing-playbook.md:348",".opencode/command/create/assets/create_testing_playbook_auto.yaml:136-143",".opencode/command/create/assets/create_testing_playbook_auto.yaml:180-181",".opencode/command/create/assets/create_testing_playbook_confirm.yaml:150-156",".opencode/command/create/assets/create_testing_playbook_confirm.yaml:194-195"],"counterevidenceSought":"Checked both routed YAML files and current lowercase-root package references under `.opencode/skill/**/manual_testing_playbook/manual_testing_playbook.md`; did not find any active workflow using `MANUAL_TESTING_PLAYBOOK.md` as the generated root.","alternativeExplanation":"The command markdown likely retained the legacy uppercase filename after the implementation and shipped packages standardized on lowercase roots.","finalSeverity":"P1","confidence":0.99,"downgradeTrigger":"Downgrade if the routed YAMLs and live package contract are reverted to uppercase root filenames."}
```

3. **`/create:changelog` requires a pre-existing `.opencode/changelog/` tree that is not present in this checkout, so its documented happy path cannot execute as written.** Both the markdown contract and the routed YAML assume component folders already exist under `.opencode/changelog/` and even describe “370+ existing files”, but there is no `.opencode/changelog` surface in the repo, so component discovery and version resolution fail before generation.
   - Evidence: `.opencode/command/create/changelog.md:241-249`, `.opencode/command/create/changelog.md:282-289`, `.opencode/command/create/changelog.md:292-294`; `.opencode/command/create/assets/create_changelog_auto.yaml:138`, `.opencode/command/create/assets/create_changelog_auto.yaml:173-197`, `.opencode/command/create/assets/create_changelog_auto.yaml:315`, `.opencode/command/create/assets/create_changelog_auto.yaml:411-432`, `.opencode/command/create/assets/create_changelog_auto.yaml:573`, `.opencode/command/create/assets/create_changelog_auto.yaml:709`

```json
{"claim":"`/create:changelog` promises a dynamic component scan over `.opencode/changelog/`, but this repo has no `.opencode/changelog` tree, so the documented discovery, folder resolution, and version sequencing flow is broken on entry.","evidenceRefs":[".opencode/command/create/changelog.md:241-249",".opencode/command/create/changelog.md:282-289",".opencode/command/create/changelog.md:292-294",".opencode/command/create/assets/create_changelog_auto.yaml:138",".opencode/command/create/assets/create_changelog_auto.yaml:173-197",".opencode/command/create/assets/create_changelog_auto.yaml:315",".opencode/command/create/assets/create_changelog_auto.yaml:411-432",".opencode/command/create/assets/create_changelog_auto.yaml:573",".opencode/command/create/assets/create_changelog_auto.yaml:709"],"counterevidenceSought":"Looked for `.opencode/changelog` and `.opencode/changelog/*` in the workspace and found no matching directory or component folders.","alternativeExplanation":"The command may have been copied from an environment where a populated changelog tree exists, but that bootstrap assumption is no longer valid in this repo.","finalSeverity":"P1","confidence":0.96,"downgradeTrigger":"Downgrade if the repo restores a populated `.opencode/changelog/` tree or the command/YAMLs are updated to bootstrap the tree when absent."}
```

4. **`/improve:agent` overstates runtime-parity coverage: it says the scanner checks all four runtimes, but the implementation still hardcodes `.agents/agents` instead of the repo’s Gemini runtime surface.** That means a user relying on this command’s parity promise can miss `.gemini/agents` drift entirely.
   - Evidence: `.opencode/command/improve/agent.md:406`; `.opencode/skill/sk-improve-agent/scripts/scan-integration.cjs:15-19`; `.opencode/skill/sk-improve-agent/feature_catalog/02--integration-scanning/02-runtime-mirrors.md:29`; `.opencode/command/create/agent.md:221-224`; `.opencode/command/create/folder_readme.md:294-297`

```json
{"claim":"`/improve:agent` says runtime parity covers four runtimes and that the scanner checks them all, but the live scanner still looks for `.agents/agents/{name}.md` rather than the Gemini runtime surface described elsewhere in the operational docs, so the command promise is false in this repo.","evidenceRefs":[".opencode/command/improve/agent.md:406",".opencode/skill/sk-improve-agent/scripts/scan-integration.cjs:15-19",".opencode/skill/sk-improve-agent/feature_catalog/02--integration-scanning/02-runtime-mirrors.md:29",".opencode/command/create/agent.md:221-224",".opencode/command/create/folder_readme.md:294-297"],"counterevidenceSought":"Checked for a `.agents/**` runtime surface in this repo and found none; also checked adjacent operational docs and found Gemini consistently documented as `.gemini/agents`.","alternativeExplanation":"`.agents/agents` may be a legacy packaging surface that survived in the scanner after the broader runtime docs moved to `.gemini/agents`.","finalSeverity":"P1","confidence":0.9,"downgradeTrigger":"Downgrade if the runtime model is intentionally standardized back to `.agents/agents` or the scanner is updated to include `.gemini/agents` and the command docs are synchronized."}
```

### P2 Findings
- **Stale runtime note:** `/create:agent` and `/create:folder_readme` say Gemini uses a “runtime-facing symlink to `.agents/agents`”, but there is no `.agents/**` surface in this repo. The primary `.gemini/agents` path is correct; the symlink explanation is stale and confusing. Evidence: `.opencode/command/create/agent.md:221-224`, `.opencode/command/create/folder_readme.md:294-297`.
- **Wrong follow-up command name:** `/doctor:mcp_install` tells users to run ``mcp_doctor:debug`` instead of the actual `/doctor:mcp_debug` command surface. Evidence: `.opencode/command/doctor/mcp_install.md:146`, `.opencode/command/doctor/mcp_debug.md:18`.
- **Missing reference guide:** `/create:folder_readme` points install-guide generation at `.opencode/install_guides/MCP - Chrome Dev Tools.md`, but no Chrome install guide exists under `.opencode/install_guides/*.md` in this repo. Evidence: `.opencode/command/create/folder_readme.md:496-499`.
- **Incomplete mode menu:** `/improve:prompt` advertises `$deep` in error recovery and the shipped `sk-improve-prompt` skill still supports `$deep`/`$d`, but the setup menu and mode table never expose Deep mode when the user has not already supplied the prefix. Evidence: `.opencode/command/improve/prompt.md:105-110`, `.opencode/command/improve/prompt.md:245-254`, `.opencode/command/improve/prompt.md:335`; `.opencode/skill/sk-improve-prompt/README.md:219`, `.opencode/skill/sk-improve-prompt/references/depth_framework.md:41`.

## Traceability Checks
- **Command↔implementation alignment:** Failed on `/create:feature-catalog`, `/create:testing-playbook`, and `/create:changelog`. The command markdowns are not authoritative for the file paths / surfaces their routed YAMLs actually use.
- **Cross-runtime consistency:** Failed on improve-agent mirror coverage. The operational-doc set is split between Gemini-at-`.gemini/agents` and legacy `.agents/agents`, and the scanner still follows the legacy branch.
- **Skill↔code alignment:** Held for `/doctor:mcp_debug`, `/memory:learn`, and `/create:sk-skill`; their referenced assets and primary helper surfaces are present and consistent.

## Confirmed-Clean Surfaces
- `.opencode/command/agent_router.md`
- `.opencode/command/create/sk-skill.md`
- `.opencode/command/doctor/mcp_debug.md`
- `.opencode/command/memory/learn.md`

## Next Focus
- Iteration 52 should stay on operational correctness and inspect runtime agent definitions / mirror-management docs, especially remaining `.gemini` vs `.agents` drift and any create-command companions that still encode legacy file-name or path contracts.
