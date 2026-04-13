---
title: "Phase 018 Resource Map — Exhaustive Skill Surface Scan"
surface: skill-surface-exhaustive
agent: resmap-F
worker: cli-codex gpt-5.4 high fast
timestamp: 2026-04-11T14:35:35Z
scan_roots:
  - .opencode/skill/
  - .opencode/skill/cli-claude-code/
  - .opencode/skill/cli-codex/
  - .opencode/skill/cli-copilot/
  - .opencode/skill/cli-gemini/
  - .opencode/skill/mcp-chrome-devtools/
  - .opencode/skill/mcp-clickup/
  - .opencode/skill/mcp-coco-index/
  - .opencode/skill/mcp-code-mode/
  - .opencode/skill/mcp-figma/
  - .opencode/skill/sk-code-full-stack/
  - .opencode/skill/sk-code-opencode/
  - .opencode/skill/sk-code-review/
  - .opencode/skill/sk-code-web/
  - .opencode/skill/sk-deep-research/
  - .opencode/skill/sk-deep-review/
  - .opencode/skill/sk-doc/
  - .opencode/skill/sk-git/
  - .opencode/skill/sk-improve-agent/
  - .opencode/skill/sk-improve-prompt/
  - .opencode/skill/system-spec-kit/
excluded:
  - .opencode/skill/sk-deep-research/SKILL.md
  - .opencode/skill/sk-deep-review/SKILL.md
  - .opencode/skill/sk-doc/SKILL.md
  - .opencode/skill/system-spec-kit/SKILL.md
  - .opencode/skill/system-spec-kit/mcp_server/**
rows: 71
---

# Phase 018 Resource Map — Exhaustive Skill Surface Scan

This pass scanned all 20 skill trees with the requested token set and file-type filter, then normalized the raw grep output down to the actionable phase-018 continuity surface. The literal scan produced hundreds of boilerplate-only hits from `ANCHOR:`, `anchor`, and `trigger_phrases`, plus derivative mirrors under `system-spec-kit/scripts/dist/**` and `system-spec-kit/scripts/tests/**`; the table below keeps the source-owned files that phase 018 is most likely to edit while calling derivative mirrors out in `UNCERTAIN`.

| # | path | skill | kind | hits | hit_tokens | phase_018_action | verb | effort |
|---|---|---|---|---:|---|---|---|---|
| 1 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/cli-claude-code/SKILL.md | cli-claude-code | SKILL-entry | 3 | generate-context | Rewrite the delegated save instructions so the handback path still uses JSON-mode generate-context.js but describes the phase-018 canonical continuity contract instead of memory-file-first language. | rewrite | S |
| 2 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/cli-claude-code/assets/prompt_templates.md | cli-claude-code | asset | 4 | generate-context | Rewrite the memory handback epilogue and save snippet that currently points straight at generate-context.js, keeping the delimiter protocol but aligning the save destination and preview language with phase 018. | rewrite | M |
| 3 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/cli-codex/SKILL.md | cli-codex | SKILL-entry | 3 | generate-context | Rewrite the delegated save instructions so the handback path still uses JSON-mode generate-context.js but describes the phase-018 canonical continuity contract instead of memory-file-first language. | rewrite | S |
| 4 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/cli-codex/assets/prompt_templates.md | cli-codex | asset | 4 | generate-context | Rewrite the memory handback epilogue and save snippet that currently points straight at generate-context.js, keeping the delimiter protocol but aligning the save destination and preview language with phase 018. | rewrite | M |
| 5 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/cli-copilot/SKILL.md | cli-copilot | SKILL-entry | 3 | generate-context | Rewrite the delegated save instructions so the handback path still uses JSON-mode generate-context.js but describes the phase-018 canonical continuity contract instead of memory-file-first language. | rewrite | S |
| 6 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/cli-copilot/assets/prompt_templates.md | cli-copilot | asset | 4 | generate-context | Rewrite the memory handback epilogue and save snippet that currently points straight at generate-context.js, keeping the delimiter protocol but aligning the save destination and preview language with phase 018. | rewrite | M |
| 7 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/cli-gemini/SKILL.md | cli-gemini | SKILL-entry | 3 | generate-context | Rewrite the delegated save instructions so the handback path still uses JSON-mode generate-context.js but describes the phase-018 canonical continuity contract instead of memory-file-first language. | rewrite | S |
| 8 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/cli-gemini/assets/prompt_templates.md | cli-gemini | asset | 4 | generate-context | Rewrite the memory handback epilogue and save snippet that currently points straight at generate-context.js, keeping the delimiter protocol but aligning the save destination and preview language with phase 018. | rewrite | M |
| 9 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/SKILL.md | mcp-coco-index | SKILL-entry | 2 | session_bootstrap,session_resume | Refresh the recovery note so session_bootstrap and session_resume match the thinner phase-018 resume ladder and canonical-spec fast path. | rewrite | XS |
| 10 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-code-mode/SKILL.md | mcp-code-mode | SKILL-entry | 3 | memory_search,memory_save | Update the guidance that points users to memory_search and memory_save so it references the phase-018 search and save semantics rather than the pre-refactor contract. | rewrite | S |
| 11 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-code-opencode/references/javascript/quality_standards.md | sk-code-opencode | reference | 1 | memory_search | Refresh the memory-search examples so they point at canonical continuity retrieval rather than older generic memory usage. | rewrite | XS |
| 12 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-code-opencode/references/shared/code_organization.md | sk-code-opencode | reference | 7 | memory-save,memory_search,memory_save,memory-context | Restructure the file-tree examples and handler naming so the shared architecture map reflects the phase-018 reader and writer surface names, especially memory-save, memory-context, and causal-edges. | restructure | M |
| 13 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-code-opencode/references/shared/universal_patterns.md | sk-code-opencode | reference | 1 | memory_search | Refresh the memory-search examples so they point at canonical continuity retrieval rather than older generic memory usage. | rewrite | XS |
| 14 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-code-opencode/references/typescript/style_guide.md | sk-code-opencode | reference | 1 | memory_search | Refresh the memory-search examples so they point at canonical continuity retrieval rather than older generic memory usage. | rewrite | XS |
| 15 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/assets/deep_research_strategy.md | sk-deep-research | asset | 1 | memory_context | Update the state description only if phase 018 adds continuity metadata or changes how prior context is injected into a fresh loop iteration. | add-field | S |
| 16 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/references/loop_protocol.md | sk-deep-research | reference | 6 | memory_context,generate-context | Rewrite the loop save boundary and known-context injection steps that currently anchor on memory_context plus direct generate-context.js calls, so the protocol matches phase-018 continuity and save routing. | rewrite | M |
| 17 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/references/quick_reference.md | sk-deep-research | reference | 4 | memory_context,memory_search,generate-context | Refresh the quick-reference memory calls so deep research points at the canonical continuity reader and routed save contract. | rewrite | S |
| 18 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/references/state_format.md | sk-deep-research | reference | 1 | memory_context | Update the state description only if phase 018 adds continuity metadata or changes how prior context is injected into a fresh loop iteration. | add-field | S |
| 19 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/README.md | sk-deep-review | README | 1 | /memory:save | Refresh the review-mode quick reference so save and resume wording stays aligned with phase-018 continuity behavior. | rewrite | S |
| 20 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/assets/deep_review_strategy.md | sk-deep-review | asset | 1 | memory_context | Refresh the review-mode quick reference so save and resume wording stays aligned with phase-018 continuity behavior. | rewrite | S |
| 21 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/references/loop_protocol.md | sk-deep-review | reference | 5 | generate-context,memory_context | Rewrite the review loop save boundary and known-context sections that currently prescribe generate-context.js and memory_context directly, keeping review read-only semantics intact. | rewrite | M |
| 22 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/references/quick_reference.md | sk-deep-review | reference | 1 | generate-context | Refresh the review-mode quick reference so save and resume wording stays aligned with phase-018 continuity behavior. | rewrite | S |
| 23 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-doc/assets/agents/command_template.md | sk-doc | asset | 1 | /memory:save | Rewrite the command template example that still points to /memory:save, so future generated commands inherit the phase-018 wording. | rewrite | XS |
| 24 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-doc/references/specific/manual_testing_playbook_creation.md | sk-doc | reference | 1 | memory_context | Update the playbook guidance so any memory_context example or recovery setup points at canonical continuity, not the older memory-first phrasing. | rewrite | XS |
| 25 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-git/README.md | sk-git | README | 1 | memory_search | Update git-workflow recovery and finish-work guidance so session-start uses canonical search or resume and session-end save language matches the routed phase-018 contract. | rewrite | S |
| 26 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-git/SKILL.md | sk-git | SKILL-entry | 4 | memory_search,/memory:save | Update git-workflow recovery and finish-work guidance so session-start uses canonical search or resume and session-end save language matches the routed phase-018 contract. | rewrite | S |
| 27 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-improve-agent/references/second_target_evaluation.md | sk-improve-agent | reference | 1 | session_bootstrap | Verify the session_bootstrap mention against phase-018 recovery output, but this looks like parity-only wording rather than a core implementation surface. | no-change | XS |
| 28 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/README.md | system-spec-kit | README | 52 | session_bootstrap,session_resume,generate-context,/memory:save | Large README rewrite. This file is the user-facing source of truth for session_bootstrap, session_resume, /memory:save, /memory:search, and generate-context.js, so phase 018 must reframe the whole continuity story here. | rewrite | L |
| 29 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/assets/template_mapping.md | system-spec-kit | asset | 6 | generate-context,/memory:save | Rewrite the template mapping and memory-template guidance so generated docs and save instructions match phase-018 continuity terminology. | rewrite | S |
| 30 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/constitutional/README.md | system-spec-kit | README | 13 | memory_search,memory_save,memory_match_triggers | Rewrite the constitutional memory guidance so the authoritative reader and writer surfaces match phase 018, especially where memory_search, memory_save, and memory_match_triggers are named. | rewrite | M |
| 31 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/config/environment_variables.md | system-spec-kit | reference | 6 | generate-context,causal_edges,memory_context,memory_save | Add or revise rollout and telemetry fields only if phase 018 introduces new canonical-reader or archived-fallback flags around memory_save, memory_context, or causal_edges. | add-field | M |
| 32 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/config/hook_system.md | system-spec-kit | reference | 6 | session_bootstrap,session_resume,memory_match_triggers,memory_context | Refresh the hook fallback sequence so session_bootstrap, session_resume, and memory_context reflect the new resume ladder and canonical continuity fast path. | rewrite | M |
| 33 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md | system-spec-kit | reference | 21 | memory_search,memory_match_triggers,generate-context,/spec_kit:resume | Rewrite the troubleshooting paths for memory_search, memory_match_triggers, generate-context, and /spec_kit:resume so operators debug the phase-018 contract rather than the pre-refactor flow. | rewrite | M |
| 34 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/memory/embedding_resilience.md | system-spec-kit | reference | 1 | /memory:manage | Verify only. These hits are adjacent to memory or graph language, but they do not look like primary phase-018 edit surfaces unless command names or metrics change. | no-change | XS |
| 35 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/memory/memory_system.md | system-spec-kit | reference | 31 | generate-context,memory_search,memory_save,memory_context | Major continuity-doc rewrite. These files define the canonical save and retrieval model, so phase 018 must update routing transparency, canonical-spec targeting, archived fallback, and the generate-context.js handoff narrative here. | rewrite | L |
| 36 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/memory/save_workflow.md | system-spec-kit | reference | 14 | generate-context,/memory:manage,/memory:save,/memory:search | Major continuity-doc rewrite. These files define the canonical save and retrieval model, so phase 018 must update routing transparency, canonical-spec targeting, archived fallback, and the generate-context.js handoff narrative here. | rewrite | L |
| 37 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/memory/trigger_config.md | system-spec-kit | reference | 11 | /memory:save,memory_match_triggers,generate-context | Update trigger and save guidance so trigger-driven continuity and routed save behavior reflect phase 018. | rewrite | M |
| 38 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/structure/folder_routing.md | system-spec-kit | reference | 9 | generate-context,/memory:save | Update routing and versioning guidance so spec-folder resolution and save destinations match the phase-018 canonical continuity rules. | rewrite | M |
| 39 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/structure/sub_folder_versioning.md | system-spec-kit | reference | 6 | memory-context,generate-context | Update routing and versioning guidance so spec-folder resolution and save destinations match the phase-018 canonical continuity rules. | rewrite | M |
| 40 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/templates/level_specifications.md | system-spec-kit | reference | 6 | /spec_kit:handover,generate-context,/memory:save | Rewrite the template guidance so canonical continuity lives in the right spec docs, handover stays top-of-ladder, and save instructions no longer imply that memory markdown is the only durable source. | rewrite | M |
| 41 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/templates/template_guide.md | system-spec-kit | reference | 8 | /spec_kit:handover,generate-context | Rewrite the template guidance so canonical continuity lives in the right spec docs, handover stays top-of-ladder, and save instructions no longer imply that memory markdown is the only durable source. | rewrite | M |
| 42 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/templates/template_style_guide.md | system-spec-kit | reference | 1 | generate-context | Refresh the style guide only where it shows generate-context or continuity examples so the examples stay phase-018-correct. | rewrite | S |
| 43 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/validation/phase_checklists.md | system-spec-kit | reference | 4 | /memory:save,generate-context | Refresh the completion checklist steps that still mention /memory:save or generate-context, so packet closeout validates the new continuity behavior. | rewrite | S |
| 44 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/workflows/execution_methods.md | system-spec-kit | reference | 5 | generate-context | Refresh the save-execution examples so generate-context.js is described with phase-018 destination semantics and preview behavior. | rewrite | S |
| 45 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/workflows/quick_reference.md | system-spec-kit | reference | 12 | /spec_kit:resume,/spec_kit:handover,/memory:save,/memory:search | Rewrite the operator-facing examples and command matrix so /spec_kit:resume, /spec_kit:handover, /memory:save, and /memory:search all match the phase-018 behavior. | rewrite | M |
| 46 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/workflows/rollback_runbook.md | system-spec-kit | reference | 3 | memory-context,memory_search,memory_context | Update the rollback guidance so reader and writer rollback steps reference the new canonical continuity surfaces and not the older memory-context contract names. | rewrite | S |
| 47 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/workflows/worked_examples.md | system-spec-kit | reference | 4 | /spec_kit:resume,/spec_kit:handover | Rewrite the operator-facing examples and command matrix so /spec_kit:resume, /spec_kit:handover, /memory:save, and /memory:search all match the phase-018 behavior. | rewrite | M |
| 48 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/README.md | system-spec-kit | README | 3 | generate-context | Refresh the script-layer README so the source scripts are described with the phase-018 continuity contract and current save pathway. | rewrite | S |
| 49 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/README.md | system-spec-kit | README | 1 | generate-context | Refresh the script-layer README so the source scripts are described with the phase-018 continuity contract and current save pathway. | rewrite | S |
| 50 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts | system-spec-kit | script | 3 | memory_save | Update the post-save review logic if the save artifact, canonical destination, or continuity quality checks change under phase 018. | update-logic | M |
| 51 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts | system-spec-kit | script | 4 | generate-context,memory_save | Update the core workflow orchestration around memory_save and generate-context so phase 018 can change routed save behavior, preview flow, and post-save review timing in one place. | update-logic | L |
| 52 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/evals/run-performance-benchmarks.ts | system-spec-kit | script | 2 | causal_edges | Verify only. These hits are adjacent to memory or graph language, but they do not look like primary phase-018 edit surfaces unless command names or metrics change. | no-change | XS |
| 53 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/memory-telemetry.ts | system-spec-kit | script | 9 | memory_save | Add or rename telemetry fields only if phase 018 introduces new writer metrics, archived-fallback measurements, or canonical-hit tracking. | add-field | M |
| 54 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts | system-spec-kit | script | 2 | memory-save | Update quality validation only if the writer-side contract changes the accepted memory-save structure or continuation signals. | update-logic | S |
| 55 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts | system-spec-kit | script | 1 | generate-context | Update the implementation details only where phase 018 changes save routing, resume precedence, or continuity field names. | update-logic | S |
| 56 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/README.md | system-spec-kit | README | 6 | memory-save,generate-context | Refresh the script-layer README so the source scripts are described with the phase-018 continuity contract and current save pathway. | rewrite | S |
| 57 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts | system-spec-kit | script | 9 | generate-context | Primary writer-side logic surface. Phase 018 likely needs to change the authoritative generate-context behavior here if the save target, continuity update, or preview contract changes. | update-logic | L |
| 58 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/ops/heal-session-ambiguity.sh | system-spec-kit | script | 3 | memory-save,generate-context | Update the implementation details only where phase 018 changes save routing, resume precedence, or continuity field names. | update-logic | S |
| 59 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/rules/check-spec-doc-integrity.sh | system-spec-kit | script | 1 | /spec_kit:resume | Update the implementation details only where phase 018 changes save routing, resume precedence, or continuity field names. | update-logic | S |
| 60 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/setup/install.sh | system-spec-kit | script | 3 | memory_search,memory_save,memory_context | Update the implementation details only where phase 018 changes save routing, resume precedence, or continuity field names. | update-logic | S |
| 61 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/README.md | system-spec-kit | README | 10 | memory-save,generate-context | Refresh the script-layer README so the source scripts are described with the phase-018 continuity contract and current save pathway. | rewrite | S |
| 62 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts | system-spec-kit | script | 2 | generate-context | Update the implementation details only where phase 018 changes save routing, resume precedence, or continuity field names. | update-logic | S |
| 63 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/types/session-types.ts | system-spec-kit | script | 1 | generate-context | Update the implementation details only where phase 018 changes save routing, resume precedence, or continuity field names. | update-logic | S |
| 64 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/prompt-utils.ts | system-spec-kit | script | 4 | generate-context | Update the implementation details only where phase 018 changes save routing, resume precedence, or continuity field names. | update-logic | S |
| 65 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/validation-utils.ts | system-spec-kit | script | 1 | generate-context | Update the implementation details only where phase 018 changes save routing, resume precedence, or continuity field names. | update-logic | S |
| 66 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared-spaces/README.md | system-spec-kit | README | 4 | /memory:manage | Verify only. These hits are adjacent to memory or graph language, but they do not look like primary phase-018 edit surfaces unless command names or metrics change. | no-change | XS |
| 67 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/README.md | system-spec-kit | README | 3 | generate-context,memory_search | Update the shared subsystem docs where they explain how generated context, memory_search, or trigger matching feed the continuity stack. | rewrite | S |
| 68 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/algorithms/README.md | system-spec-kit | README | 2 | memory_search,memory_match_triggers | Update the shared subsystem docs where they explain how generated context, memory_search, or trigger matching feed the continuity stack. | rewrite | S |
| 69 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/embeddings/README.md | system-spec-kit | README | 2 | generate-context | Update the shared subsystem docs where they explain how generated context, memory_search, or trigger matching feed the continuity stack. | rewrite | S |
| 70 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/README.md | system-spec-kit | README | 1 | generate-context | Rewrite the template mapping and memory-template guidance so generated docs and save instructions match phase-018 continuity terminology. | rewrite | S |
| 71 | /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/memory/README.md | system-spec-kit | README | 8 | generate-context,memory_save | Rewrite the template mapping and memory-template guidance so generated docs and save instructions match phase-018 continuity terminology. | rewrite | S |

## Per-skill hit count summary

| skill | files with hits |
|---|---:|
| cli-claude-code | 2 |
| cli-codex | 2 |
| cli-copilot | 2 |
| cli-gemini | 2 |
| mcp-coco-index | 1 |
| mcp-code-mode | 1 |
| sk-code-opencode | 4 |
| sk-deep-research | 4 |
| sk-deep-review | 4 |
| sk-doc | 2 |
| sk-git | 2 |
| sk-improve-agent | 1 |
| system-spec-kit | 44 |

## High-risk skills

- `system-spec-kit` is the clear P1 surface. It owns the continuity story in `README.md`, the memory references, the workflow references, and the source scripts behind `generate-context`, `memory_save`, and `session_bootstrap`.
- `sk-deep-research` is high risk because its loop protocol hard-codes `memory_context()` plus `generate-context.js` as the live save and recovery boundary.
- `sk-deep-review` is similarly high risk because its review loop documents the same save boundary and needs parity with the research-side continuity contract.
- `cli-claude-code` is high risk because its prompt epilogue explicitly teaches a memory handback protocol that shells directly into `generate-context.js`.
- `cli-copilot` is high risk for the same reason as `cli-claude-code`, and the exact same pattern also exists in `cli-codex` and `cli-gemini`.

## Memory Handback Protocol hits

- `cli-claude-code/assets/prompt_templates.md` and `cli-claude-code/SKILL.md` explicitly append a structured handback epilogue, then call `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json [spec-folder]`.
- `cli-copilot/assets/prompt_templates.md` and `cli-copilot/SKILL.md` document the same JSON handback and `generate-context.js` invocation pattern.
- `cli-codex/assets/prompt_templates.md` and `cli-codex/SKILL.md` mirror the same handback contract.
- `cli-gemini/assets/prompt_templates.md` and `cli-gemini/SKILL.md` mirror the same handback contract.
- `cli-codex/references/agent_delegation.md`, `cli-gemini/references/agent_delegation.md`, and `cli-claude-code/references/agent_delegation.md` also bind delegation to `handover.md` or `implementation-summary.md`, so they are continuity-adjacent even though they were not promoted into the main actionable table.

## ENTIRE SKILL CLEAN

These skills had no substantive phase-018 continuity hits beyond boilerplate `ANCHOR:` or `trigger_phrases` metadata:

- `mcp-chrome-devtools`
- `mcp-clickup`
- `mcp-figma`
- `sk-code-full-stack`
- `sk-code-review`
- `sk-code-web`
- `sk-improve-prompt`

## UNCERTAIN

- The raw literal scan also hit many files under `system-spec-kit/scripts/dist/**`, `system-spec-kit/scripts/tests/**`, and `system-spec-kit/scripts/test-fixtures/**`. I excluded those from the table because they are generated or verification mirrors rather than the source-owned edit surface, but phase 018 will almost certainly need to update some of those tests after source changes land.
- The token set includes `anchor`, `ANCHOR:`, and `trigger_phrases`, which produced boilerplate hits across most skill documentation. I treated those as non-actionable unless the same file also mentioned memory, resume, save, archive, or handback tokens.
- `system-spec-kit/shared-spaces/README.md`, `system-spec-kit/references/memory/embedding_resilience.md`, and `system-spec-kit/scripts/evals/run-performance-benchmarks.ts` mention adjacent memory or graph terms, but they may survive phase 018 unchanged.
- `mcp-coco-index/SKILL.md` and `sk-improve-agent/references/second_target_evaluation.md` only touch `session_bootstrap` or `session_resume` lightly. They look like parity updates, not primary implementation surfaces.
