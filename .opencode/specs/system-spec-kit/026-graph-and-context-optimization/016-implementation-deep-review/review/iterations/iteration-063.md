# Iteration 63 - correctness - skill-refs-spec-kit

## Dispatcher
- iteration: 63 of 70
- dispatcher: cli-copilot gpt-5.4 high (operational doc review)
- timestamp: 2026-04-16T07:09:44.038Z

## Files Reviewed
- .opencode/skill/system-spec-kit/references/config/environment_variables.md
- .opencode/skill/system-spec-kit/references/config/hook_system.md
- .opencode/skill/system-spec-kit/references/debugging/troubleshooting.md
- .opencode/skill/system-spec-kit/references/debugging/universal_debugging_methodology.md
- .opencode/skill/system-spec-kit/references/intake-contract.md
- .opencode/skill/system-spec-kit/references/memory/embedding_resilience.md
- .opencode/skill/system-spec-kit/references/memory/epistemic_vectors.md
- .opencode/skill/system-spec-kit/references/memory/memory_system.md
- .opencode/skill/system-spec-kit/references/memory/save_workflow.md
- .opencode/skill/system-spec-kit/references/memory/trigger_config.md
- .opencode/skill/system-spec-kit/references/structure/folder_routing.md
- .opencode/skill/system-spec-kit/references/structure/folder_structure.md
- .opencode/skill/system-spec-kit/references/structure/phase_definitions.md
- .opencode/skill/system-spec-kit/references/structure/sub_folder_versioning.md
- .opencode/skill/system-spec-kit/references/templates/level_selection_guide.md

## Findings - New
### P0 Findings
- None.

### P1 Findings
- **folder_routing.md still documents a retired `[packet]/memory/` save contract instead of the live packet-first canonical save path.** The runtime-loaded routing guide says `generate-context.js` writes a generated continuity artifact under `specs/.../memory/`, creates `memory/` directories as part of routing, and validates saves by inspecting those artifact files (`.opencode/skill/system-spec-kit/references/structure/folder_routing.md:244-299`, `.opencode/skill/system-spec-kit/references/structure/folder_routing.md:517-555`). The live save contract says retired `[spec]/memory/*.md` writes are no longer part of the workflow, recovery is packet-first, and `memory_save` only accepts canonical spec docs rather than packet memory notes (`.opencode/skill/system-spec-kit/references/memory/save_workflow.md:254-303`, `.opencode/skill/system-spec-kit/references/memory/memory_system.md:40-53`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:388-389`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2503-2504`). An agent following the loaded routing reference will look for and operationalize files the canonical save path no longer produces.

```json
{
  "claim": "folder_routing.md still teaches the deprecated memory-directory save flow even though the live save stack routes continuity into canonical packet docs and rejects non-canonical memory note inputs.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/references/structure/folder_routing.md:244-299",
    ".opencode/skill/system-spec-kit/references/structure/folder_routing.md:517-555",
    ".opencode/skill/system-spec-kit/references/memory/save_workflow.md:254-303",
    ".opencode/skill/system-spec-kit/references/memory/memory_system.md:40-53",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:388-389",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2503-2504"
  ],
  "counterevidenceSought": "Checked the canonical save references and the live memory-save handler for any current write path that still emits packet-local memory artifacts as the primary save output.",
  "alternativeExplanation": "The routing reference preserved a pre-Phase-018 alignment-scoring narrative after the save engine and recovery contract moved to packet-first canonical docs.",
  "finalSeverity": "P1",
  "confidence": 0.99,
  "downgradeTrigger": "Downgrade if generate-context.js still intentionally emits [spec]/memory artifacts as the supported primary surface via a live path outside the reviewed save_workflow/memory_system/memory-save surfaces."
}
```

- **The structure references still present `memory/` directories as the normal child-packet surface and miss current metadata expectations.** `folder_structure.md`, `phase_definitions.md`, and `sub_folder_versioning.md` all model normal/phase/versioned packet layouts around `memory/` directories and per-child support artifacts (`.opencode/skill/system-spec-kit/references/structure/folder_structure.md:86-180`, `.opencode/skill/system-spec-kit/references/structure/phase_definitions.md:86-109`, `.opencode/skill/system-spec-kit/references/structure/sub_folder_versioning.md:17-22`, `.opencode/skill/system-spec-kit/references/structure/sub_folder_versioning.md:36-53`, `.opencode/skill/system-spec-kit/references/structure/sub_folder_versioning.md:107-113`, `.opencode/skill/system-spec-kit/references/structure/sub_folder_versioning.md:217-221`). The live creator instead provisions packet metadata like `description.json` and `graph-metadata.json`, reports `scratch/` as the working directory surface, and the save handler indexes canonical packet docs rather than child `memory/` artifacts (`.opencode/skill/system-spec-kit/scripts/spec/create.sh:20`, `.opencode/skill/system-spec-kit/scripts/spec/create.sh:352-356`, `.opencode/skill/system-spec-kit/scripts/spec/create.sh:1140-1150`, `.opencode/skill/system-spec-kit/scripts/spec/create.sh:1219-1251`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2503-2504`). That drifts the folder-creation contract across the exact docs agents load when deciding what to create and where continuity should live.

```json
{
  "claim": "folder_structure.md, phase_definitions.md, and sub_folder_versioning.md still teach memory-directory-centric packet layouts even though current creation/save flows center canonical docs plus generated metadata files.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/references/structure/folder_structure.md:86-180",
    ".opencode/skill/system-spec-kit/references/structure/phase_definitions.md:86-109",
    ".opencode/skill/system-spec-kit/references/structure/sub_folder_versioning.md:17-22",
    ".opencode/skill/system-spec-kit/references/structure/sub_folder_versioning.md:36-53",
    ".opencode/skill/system-spec-kit/references/structure/sub_folder_versioning.md:107-113",
    ".opencode/skill/system-spec-kit/references/structure/sub_folder_versioning.md:217-221",
    ".opencode/skill/system-spec-kit/scripts/spec/create.sh:20",
    ".opencode/skill/system-spec-kit/scripts/spec/create.sh:352-356",
    ".opencode/skill/system-spec-kit/scripts/spec/create.sh:1140-1150",
    ".opencode/skill/system-spec-kit/scripts/spec/create.sh:1219-1251",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2503-2504"
  ],
  "counterevidenceSought": "Checked the live folder creator for automatic memory-directory provisioning and checked the save handler for acceptance of those directories as first-class save targets.",
  "alternativeExplanation": "The structure references were only partially updated after packet-first continuity and per-folder metadata generation replaced memory-directory-centric workflows.",
  "finalSeverity": "P1",
  "confidence": 0.96,
  "downgradeTrigger": "Downgrade if the live create.sh path still provisions memory/ directories as standard output for normal, phase, or subfolder creation and those directories remain an active supported continuity surface."
}
```

### P2 Findings
- **troubleshooting.md still assumes current packets use `memory/` note files.** It prescribes `mkdir -p specs/###-feature/memory/`, treats "memory folder empty" as a current retrieval problem, and tells operators to grep `specs/*/memory/*.md` for anchors (`.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:53`, `.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:124`, `.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:198-227`). Current save/recovery docs say those artifacts are retired compatibility only and packet docs are the active continuity surface (`.opencode/skill/system-spec-kit/references/memory/memory_system.md:40-53`, `.opencode/skill/system-spec-kit/references/memory/save_workflow.md:254-303`).
- **folder_routing.md's "moderate alignment" worked example is internally impossible.** It labels a 1/3 keyword overlap as a 50-69% case while also computing the score as 33%, then shows the moderate-alignment warning path (`.opencode/skill/system-spec-kit/references/structure/folder_routing.md:398-423`).
- **environment_variables.md narrows `AUTO_SAVE_MODE` to hooks even though the live selector uses it in folder auto-detect and prompt suppression.** The reference says `AUTO_SAVE_MODE` "Skip[s] alignment check in hooks" (`.opencode/skill/system-spec-kit/references/config/environment_variables.md:108-110`), but `folder-detector.ts` uses it to disable interactive TTY prompting and to return the deterministic auto-detected candidate before alignment prompting (`.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts:144-146`, `.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts:1538-1540`).
- **hook_system.md overstates Codex runtime parity.** It says Codex CLI is hook-capable and uses shell-script `session-prime.ts` hooks alongside Claude/Copilot/Gemini (`.opencode/skill/system-spec-kit/references/config/hook_system.md:48-50`), but the shipped hook subtree documents Claude/Copilot/Gemini implementations only (`.opencode/skill/system-spec-kit/mcp_server/hooks/README.md:36-44`, `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/README.md:13-17`, `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/README.md:13-18`) and the checked Codex runtime config exposes MCP servers/profiles/agents but no hook registration surface (`.codex/config.toml:1-124`).

## Traceability Checks
- **Cross-runtime consistency:** compared `hook_system.md` against the shipped hook subtree and `.codex/config.toml`; Claude/Copilot/Gemini/OpenCode surfaces are evidenced locally, while the Codex hook claim is not.
- **Skill↔code alignment:** compared structure/save references against `create.sh`, `folder-detector.ts`, `memory_system.md`, `save_workflow.md`, and the live `memory-save.ts` handler; packet-first references align, while `folder_routing.md` and the structure docs still describe deprecated memory-directory behavior.
- **Command↔implementation alignment:** verified that the current save references match the canonical-doc-only `memory_save` validation gate and the `generate-context.js` packet-first narrative.

## Confirmed-Clean Surfaces
- .opencode/skill/system-spec-kit/references/debugging/universal_debugging_methodology.md
- .opencode/skill/system-spec-kit/references/intake-contract.md
- .opencode/skill/system-spec-kit/references/memory/embedding_resilience.md
- .opencode/skill/system-spec-kit/references/memory/epistemic_vectors.md
- .opencode/skill/system-spec-kit/references/memory/memory_system.md
- .opencode/skill/system-spec-kit/references/memory/save_workflow.md
- .opencode/skill/system-spec-kit/references/templates/level_selection_guide.md

## Next Focus
- Check the next operational-doc slice for the same failure mode: workflow/validation references that still operationalize retired `memory/` artifacts or overstate cross-runtime parity that the shipped runtime surfaces no longer provide.
