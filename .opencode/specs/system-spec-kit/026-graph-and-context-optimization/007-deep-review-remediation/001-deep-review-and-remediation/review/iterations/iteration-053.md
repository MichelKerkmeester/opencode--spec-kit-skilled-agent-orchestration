# Iteration 53 - traceability - command-yamls-part2

## Dispatcher
- iteration: 53 of 70
- dispatcher: cli-copilot gpt-5.4 high (operational doc review)
- timestamp: 2026-04-16T06:49:23.895Z

## Files Reviewed
- .opencode/command/improve/assets/improve_improve-agent_auto.yaml
- .opencode/command/improve/assets/improve_improve-agent_confirm.yaml
- .opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml
- .opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml
- .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml
- .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml
- .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml
- .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml
- .opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml
- .opencode/command/spec_kit/assets/spec_kit_implement_confirm.yaml
- .opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml
- .opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml
- .opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml
- .opencode/command/spec_kit/assets/spec_kit_resume_confirm.yaml

## Findings - New
### P0 Findings
- None.

### P1 Findings
1. **The save/index instructions in 10 reviewed SpecKit YAMLs point agents at a non-existent MCP symbol, `spec_kit_memory_memory_save(...)`, even though the live native tool is `memory_save`.** Because the same blocks also say "Call semantic memory MCP DIRECTLY - NEVER through Code Mode," an agent following these docs literally will try to call the wrong tool name during post-save indexing and break the documented command contract. Evidence: `.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml:1009-1012`, `.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml:1095-1098`, `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:550-554`, `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:607-611`, `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:509-511`, `.opencode/command/spec_kit/assets/spec_kit_implement_confirm.yaml:578-580`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:644-647`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:822-825`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:863-866`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:995-998`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:215-218`.

```json
{"claim":"Multiple reviewed SpecKit YAMLs instruct agents to invoke `spec_kit_memory_memory_save(...)` after canonical save routing, but the live MCP server registers the tool as `memory_save`, so the documented direct-call contract is wrong.","evidenceRefs":[".opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml:1009-1012",".opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml:1095-1098",".opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:550-554",".opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:607-611",".opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:509-511",".opencode/command/spec_kit/assets/spec_kit_implement_confirm.yaml:578-580",".opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:644-647",".opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:822-825",".opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:863-866",".opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:995-998",".opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:215-218"],"counterevidenceSought":"Searched the repo for a live `spec_kit_memory_memory_save` tool alias and found only YAML-doc references; the MCP schema still exposes `memory_save` as the actual tool name.","alternativeExplanation":"The invocation string may have been copied from an older namespaced/manual-call convention, but the surrounding prose explicitly says to call the native MCP tool directly rather than via Code Mode.","finalSeverity":"P1","confidence":0.96,"downgradeTrigger":"Downgrade if the runtime exposes a documented alias named `spec_kit_memory_memory_save` or the YAML executor rewrites this symbol to `memory_save` before tool dispatch."}
```

2. **Both deep-review YAMLs require a doctrine file from a dead root path, `.agents/skills/sk-code-review/references/review_core.md`, while the actual doctrine lives under `.opencode/skill/sk-code-review/references/review_core.md`.** The instruction is part of the per-iteration dispatch context immediately before final severity adjudication, so an agent following the YAML literally cannot load the cited doctrine from the documented location. Evidence: `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:553-580`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:596-626`, `.opencode/skill/sk-code-review/references/review_core.md:1`, `repo-glob:.agents/skills/sk-code-review/references/review_core.md (no matches)`.

```json
{"claim":"`spec_kit_deep-review_auto.yaml` and `spec_kit_deep-review_confirm.yaml` tell the dispatched reviewer to load `.agents/skills/sk-code-review/references/review_core.md` before final severity calls, but that root path is not shipped in this repo; the live doctrine is under `.opencode/skill/sk-code-review/references/review_core.md`.","evidenceRefs":[".opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:553-580",".opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:596-626",".opencode/skill/sk-code-review/references/review_core.md:1","repo-glob:.agents/skills/sk-code-review/references/review_core.md (no matches)"],"counterevidenceSought":"Checked for a root-level `.agents/skills/sk-code-review/references/review_core.md` surface and found no live match in this repository; only archived/external fixture `.agents/**` paths exist under future-spec research material.","alternativeExplanation":"The YAML may have preserved a legacy runtime-root convention after the doctrine was consolidated under `.opencode/skill/`, but the current instruction still points reviewers to a file that does not exist at runtime.","finalSeverity":"P1","confidence":0.94,"downgradeTrigger":"Downgrade if a runtime-managed `.agents/skills/sk-code-review/references/review_core.md` mirror is intentionally restored at repo root or the dispatch layer remaps the legacy path automatically."}
```

### P2 Findings
- None.

## Traceability Checks
- **Cross-runtime consistency:** `improve_improve-agent_{auto,confirm}.yaml` and `spec_kit_resume_{auto,confirm}.yaml` are internally consistent with live `.opencode`, `.claude`, `.gemini`, and `.codex` surfaces where they make explicit runtime/tool claims. `spec_kit_deep-review_{auto,confirm}.yaml` still carries legacy `.agents` runtime language in scope discovery and overlay protocols (`:203-212`, `:959-960` auto; `:202-205`, `:1057-1059` confirm), which matches earlier repo-level runtime-drift findings and reinforces the doctrine-path defect above.
- **Skill↔code alignment:** Referenced deep-research/deep-review/improve skill assets and scripts resolve under `.opencode/skill/...`; the only broken skill handoff in this slice is the deep-review doctrine path, which names a missing `.agents/skills/...` location instead of the live `.opencode/skill/...` path.
- **Command↔implementation alignment:** `/memory:search` references resolve (`.opencode/command/memory/search.md` exists), resume tool names line up with the live MCP schema (`memory_list`, `memory_match_triggers`, `session_bootstrap`, `memory_context`), and `task_preflight` / `task_postflight` match registered tool names. The only direct MCP name mismatch in this slice is the repeated `spec_kit_memory_memory_save(...)` invocation string versus live `memory_save`.

## Confirmed-Clean Surfaces
- `.opencode/command/improve/assets/improve_improve-agent_auto.yaml` and `.opencode/command/improve/assets/improve_improve-agent_confirm.yaml`: skill/script references, state paths, and `/memory:search` linkage resolve cleanly.
- `.opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml` and `.opencode/command/spec_kit/assets/spec_kit_resume_confirm.yaml`: resume ladder ordering, tool names, and command references align with the live Spec Kit MCP/tool surface.
- The shell-script references used by `spec_kit_complete_*`, `spec_kit_plan_*`, and `spec_kit_implement_*` (`recommend-level.sh`, `create.sh`, `validate.sh`, `nested-changelog.js`, `generate-context.js`) all resolve; the break in those files is the post-save MCP invocation string, not the referenced script paths.

## Next Focus
- Inspect the markdown command entrypoints that hand off into these YAMLs, especially memory-save examples and any remaining legacy runtime-root references (`.agents/**`) in deep-review/deep-research command docs.
