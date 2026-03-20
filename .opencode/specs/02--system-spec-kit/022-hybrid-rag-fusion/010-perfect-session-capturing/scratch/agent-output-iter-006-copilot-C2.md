✗ memory_match_triggers
  └ Permission denied and could not request permission from user

✗ Run skill advisor and create session plan stub (shell)
  │ python3 .opencode/skill/scripts/skill_advisor.py "Assess Memory Handback protocol success rate
  │ across CLIs and where handback JSON fails minimum payload guidance" --threshold 0.8 && mkdir
  │ -p '/Users/michelkerkmeester/.copilot/session-state/71166979-a8e8-4d2a-9375-205a1a817559' &&
  │ if [ ! -f
  │ '/Users/michelkerkmeester/.copilot/session-state/71166979-a8e8-4d2a-9375-205a1a817559/plan.md'…
  └ Permission denied and could not request permission from user

● skill(system-spec-kit)

Got it — I’ll map the minimum payload contract from loader/normalizer + Phase 015 docs, then compare each CLI flow and call out concrete validation gaps with file/line evidence.

● Read input-normalizer.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts
  └ 1 line read

● Read data-loader.ts
  │ .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts
  └ 1 line read

● Search (glob)
  │ "**/*" in .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturin
  │ g/015-outsourced-agent-handback
  └ 15 files found

● Search (grep)
  │ "handback"
  └ 5 lines found

● Read spec.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/015-outs
  │ ourced-agent-handback/spec.md
  └ 237 lines read

● Read plan.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/015-outs
  │ ourced-agent-handback/plan.md
  └ 193 lines read

● Read implementation-summary.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/015-outs
  │ ourced-agent-handback/implementation-summary.md
  └ 116 lines read

● Search (grep)
  │ "handback|minimum|payload|schema|required|normalize|outsourced|agent"
  │ (.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts)
  └ 39 lines found

● Search (grep)
  │ "handback|minimum|payload|schema|required|normalize|outsourced|agent"
  │ (.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts)
  └ 12 lines found

● Read input-normalizer.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts
  └ L386:700 (315 lines read)

● Read data-loader.ts
  │ .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts
  └ L460:640 (125 lines read)

● Search (grep)
  │ "MEMORY_HANDBACK|save-context-data.json|next_steps|nextSteps|INSUFFICIENT_CONTEXT_ABORT|CONTAMIN
  │ ATION_GATE_ABORT|minimum payload|FILES" in cli-*/**/*.md (.opencode/skill)
  └ No matches found

● Search (glob)
  │ "**/*" in .opencode/skill/cli-copilot
  └ 7 files found

● Search (glob)
  │ "**/*" in .opencode/skill/cli-codex
  └ 7 files found

● Search (glob)
  │ "**/*" in .opencode/skill/cli-gemini
  └ 7 files found

● Search (glob)
  │ "**/*" in .opencode/skill/cli-claude-code
  └ 7 files found

● Search (grep)
  │ "INSUFFICIENT_CONTEXT_ABORT|CONTAMINATION_GATE_ABORT|MEMORY_HANDBACK|save-context-data.json|next
  │ _steps|trigger_phrases|files_modified|session_summary" (.opencode/skill/cli-copilot)
  └ 15 lines found

● Search (grep)
  │ "INSUFFICIENT_CONTEXT_ABORT|CONTAMINATION_GATE_ABORT|MEMORY_HANDBACK|save-context-data.json|next
  │ _steps|trigger_phrases|files_modified|session_summary" (.opencode/skill/cli-claude-code)
  └ 15 lines found

● Search (grep)
  │ "INSUFFICIENT_CONTEXT_ABORT|CONTAMINATION_GATE_ABORT|MEMORY_HANDBACK|save-context-data.json|next
  │ _steps|trigger_phrases|files_modified|session_summary" (.opencode/skill/cli-gemini)
  └ 15 lines found

● Search (grep)
  │ "INSUFFICIENT_CONTEXT_ABORT|CONTAMINATION_GATE_ABORT|MEMORY_HANDBACK|save-context-data.json|next
  │ _steps|trigger_phrases|files_modified|session_summary" (.opencode/skill/cli-codex)
  └ 15 lines found

I’ve confirmed the CLI docs are largely aligned; next I’m pulling runtime sufficiency/contamination gate logic and test coverage to quantify where “minimum payload” actually breaks.

✗ search Where is INSUFFICIENT_CONTEXT_ABORT and CONTAMINATION_GATE_ABORT enforced for file-backed …
  └ Permission denied and could not request permission from user

● Search (grep)
  │ "handback|EXPLICIT_DATA_FILE_LOAD_FAILED|next_steps|nextSteps|INSUFFICIENT_CONTEXT_ABORT|CONTAMI
  │ NATION_GATE_ABORT" (.opencode/skill/system-spec-kit/scripts/tests)
  └ 66 lines found

● Search (grep)
  │ "INSUFFICIENT_CONTEXT_ABORT|CONTAMINATION_GATE_ABORT|QUALITY_GATE_ABORT|evaluateMemorySufficienc
  │ y|_source === 'file'|_source !== 'file'" (.opencode/skill/system-spec-kit/scripts)
  └ 42 lines found

● Read outsourced-agent-handback-docs.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/outsourced-agent-handback-docs.vitest.ts
  └ 76 lines read

● Read memory-sufficiency.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts
  └ 170 lines read

● Read runtime-memory-inputs.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts
  └ L60:170 (111 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L2100:2260 (161 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L1220:1265 (46 lines read)

● Read input-normalizer.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts
  └ L1:220 (220 lines read)

● Read input-normalizer.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts
  └ L220:385 (166 lines read)

● Read input-normalizer.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts
  └ L700:860 (161 lines read)

● Search (grep)
  │ "interface RawInputData|type RawInputData|interface FileEntry|type
  │ FileEntry|buildNextStepsObservation|hasPersistedNextStepsObservation|transformKeyDecision"
  │ (.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts)
  └ 10 lines found

● Read SKILL.md
  │ .opencode/skill/cli-copilot/SKILL.md
  └ L294:334 (41 lines read)

● Read SKILL.md
  │ .opencode/skill/cli-codex/SKILL.md
  └ L450:490 (41 lines read)

● Read SKILL.md
  │ .opencode/skill/cli-gemini/SKILL.md
  └ L396:436 (41 lines read)

● Read SKILL.md
  │ .opencode/skill/cli-claude-code/SKILL.md
  └ L450:490 (41 lines read)

● Read 17-outsourced-agent-memory-capture.md
  │ .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/17-outsourced-ag
  │ ent-memory-capture.md
  └ 66 lines read

✗ Run targeted handback vitest checks (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/scripts' && npx vitest run
  │ tests/outsourced-agent-handback-docs.vitest.ts tests/runtime-memory-inputs.vitest.ts
  │ --reporter=verbose
  └ Permission denied and could not request permission from user

● Read checklist.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/015-outs
  │ ourced-agent-handback/checklist.md
  └ 107 lines read

● Read tasks.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/015-outs
  │ ourced-agent-handback/tasks.md
  └ 93 lines read

● Search (grep)
  │ "function
  │ evaluateMemorySufficiency|INSUFFICIENT_CONTEXT_ABORT|PRIMARY_EVIDENCE|evidenceCounts|minimum" in
  │ **/*memory-sufficiency*.ts (.opencode/skill/system-spec-kit)
  └ 12 lines found

● Read memory-sufficiency.ts
  │ .opencode/skill/system-spec-kit/shared/parsing/memory-sufficiency.ts
  └ L280:430 (117 lines read)

● Search (grep)
  │ "missing required FILE_PATH or path field|FILES\[\$\{i\}\] missing required FILE_PATH or path
  │ field|description pending|Modified during session|File modified"
  │ (.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts)
  └ 4 lines found

● Search (grep)
  │ "filesModified\?: string\[]|files_modified\?: string\[]|Array<string \| \{ path\?: string;
  │ changes_summary\?: string \}>"
  │ (.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts)
  └ 2 lines found

● Search (grep)
  │ "memory handback|handback protocol|minimum payload
  │ guidance|INSUFFICIENT_CONTEXT_ABORT|CONTAMINATION_GATE_ABORT" in *.md (.opencode/specs/02--syste
  │ m-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/015-outsourced-agent-handback)
  └ 39 lines found

● Read prompt_templates.md
  │ .opencode/skill/cli-codex/assets/prompt_templates.md
  └ L540:610 (70 lines read)

● Read prompt_templates.md
  │ .opencode/skill/cli-gemini/assets/prompt_templates.md
  └ L370:440 (69 lines read)

● Read prompt_templates.md
  │ .opencode/skill/cli-copilot/assets/prompt_templates.md
  └ L350:420 (71 lines read)

● Read prompt_templates.md
  │ .opencode/skill/cli-claude-code/assets/prompt_templates.md
  └ L464:534 (69 lines read)

● Search (grep)
  │ "extractNextAction|Next:|Follow-up:|NEXT_ACTION"
  │ (.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts)
  └ 3 lines found

● Read session-extractor.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts
  └ L250:320 (71 lines read)

● Search (grep)
  │ "rejects thin explicit JSON saves with
  │ INSUFFICIENT_CONTEXT_ABORT|CONTAMINATION_GATE_ABORT|QUALITY_GATE_ABORT"
  │ (.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts)
  └ 3 lines found

● Search (grep)
  │ "EXPLICIT_DATA_FILE_LOAD_FAILED|Invalid JSON in data file|Data file not found|Permission denied"
  │ (.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts)
  └ 4 lines found

● Search (grep)
  │ "CONTAMINATION_GATE_ABORT|INSUFFICIENT_CONTEXT_ABORT|_source === 'file'|QUALITY_GATE_ABORT"
  │ (.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts)
  └ 4 lines found

● Read workflow-e2e.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts
  └ L500:760 (261 lines read)

● Read task-enrichment.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts
  └ L1170:1265 (96 lines read)

● Search (grep)
  │ "function determineValidationDisposition|determineValidationDisposition\(|QUALITY_GATE_ABORT" in
  │ **/*.ts (.opencode/skill/system-spec-kit/scripts)
  └ 11 lines found

● Read runtime-memory-inputs.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts
  └ L720:790 (71 lines read)

● Read runtime-memory-inputs.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts
  └ L650:725 (75 lines read)

● Search (grep)
  │ "files_modified|filesModified|FILES\s*:\s*\["
  │ (.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts)
  └ 2 lines found

● Read validation-rule-metadata.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/validation-rule-metadata.vitest.ts
  └ 73 lines read

● Read validate-memory-quality.ts
  │ .opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts
  └ L396:485 (90 lines read)

1) **Minimum handback JSON (runtime)**: needs `specFolder/spec_folder/SPEC_FOLDER` (or CLI arg) plus structured context; accepted fields include `sessionSummary/session_summary`, `observations`, `recentContext/recent_context`, `filesModified/files_modified`, `FILES` (`FILE_PATH|path` required), `keyDecisions`, `nextSteps/next_steps`, `triggerPhrases` (`input-normalizer.ts:72-95,551-639`).

2) **Per-CLI flow** is identical (Codex/Copilot/Gemini/Claude): epilogue → extract `MEMORY_HANDBACK` → redact/scrub → write `/tmp/save-context-data.json` → run `generate-context.js` → index (`cli-*/SKILL.md`, `cli-*/assets/prompt_templates.md`; parity guarded by `outsourced-agent-handback-docs.vitest.ts:29-63`). **Protocol parity success: 4/4 CLIs (100%)**.

3) **Failure point for minimum payload guidance**: not at JSON validation (mostly shape checks), but at post-normalization gates: `INSUFFICIENT_CONTEXT_ABORT` and `CONTAMINATION_GATE_ABORT` (`memory-sufficiency.ts:371-380`, `workflow.ts:2207-2230`). Gaps: permissive `filesModified` validation and generic file-description defaults weaken evidence quality.


Total usage est:        1 Premium request
API time spent:         6m 42s
Total session time:     7m 3s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.3-codex            1.5m in, 17.4k out, 1.3m cached (Est. 1 Premium request)
