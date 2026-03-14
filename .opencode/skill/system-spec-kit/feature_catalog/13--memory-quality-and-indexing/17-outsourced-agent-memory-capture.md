# Outsourced agent memory capture

## 1. OVERVIEW

Outsourced agent memory capture enforces hard-fail validation for explicit JSON data files and persists `nextSteps` fields into memory observations.

When work is delegated to an external helper (like a different AI tool), the results need to come back in a clean format the memory system can understand. This feature makes sure that incoming data files are properly validated and that follow-up actions are captured, so nothing important gets lost when work passes between different tools.

---

## 2. CURRENT REALITY

Outsourced-agent memory capture is now implemented and aligned across runtime behavior, regression tests and CLI handback documentation.

Current behavior is enforced in three slices:
1. `EXPLICIT_DATA_FILE_LOAD_FAILED` hard-fail in `data-loader.ts` for missing files, invalid JSON and validation failures when `dataFile` is provided explicitly.
2. `nextSteps` / `next_steps` persistence in normalization and extraction flow, producing `Next: ...`, `Follow-up: ...` and `NEXT_ACTION`.
3. 8 CLI handback docs (`cli-codex`, `cli-copilot`, `cli-claude-code`, `cli-gemini` `SKILL.md` + `prompt_templates.md`) documenting redact/scrub guidance before writing `/tmp/save-context-data.json`.

Status: Implemented. Spec folder `013-outsourced-agent-memory` is complete.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| scripts/loaders/data-loader.ts | Scripts | JSON-mode data loading with EXPLICIT_DATA_FILE_LOAD_FAILED hard-fail (3 throw paths) |
| scripts/utils/input-normalizer.ts | Scripts | nextSteps/next_steps field normalization into NEXT_ACTION observations |
| scripts/extractors/session-extractor.ts | Scripts | Next:/Follow-up: pattern extraction from session transcripts |

### Tests

| File | Focus |
|------|-------|
| scripts/tests/runtime-memory-inputs.vitest.ts | Targeted regression coverage for explicit JSON-mode hard-fail behavior plus `nextSteps` / `next_steps` persistence into `NEXT_ACTION` |

### CLI Handback Docs

| File | Focus |
|------|-------|
| .opencode/skill/cli-codex/SKILL.md | Caller-side handback flow, redact/scrub guidance, explicit JSON-mode hard-fail behavior |
| .opencode/skill/cli-codex/assets/prompt_templates.md | Prompt template for MEMORY_HANDBACK extraction and `/tmp/save-context-data.json` save flow |
| .opencode/skill/cli-copilot/SKILL.md | Caller-side handback flow, redact/scrub guidance, explicit JSON-mode hard-fail behavior |
| .opencode/skill/cli-copilot/assets/prompt_templates.md | Prompt template for MEMORY_HANDBACK extraction and `/tmp/save-context-data.json` save flow |
| .opencode/skill/cli-claude-code/SKILL.md | Caller-side handback flow, redact/scrub guidance, explicit JSON-mode hard-fail behavior |
| .opencode/skill/cli-claude-code/assets/prompt_templates.md | Prompt template for MEMORY_HANDBACK extraction and `/tmp/save-context-data.json` save flow |
| .opencode/skill/cli-gemini/SKILL.md | Caller-side handback flow, redact/scrub guidance, explicit JSON-mode hard-fail behavior |
| .opencode/skill/cli-gemini/assets/prompt_templates.md | Prompt template for MEMORY_HANDBACK extraction and `/tmp/save-context-data.json` save flow |

---

## 4. SOURCE METADATA

- Group: Memory quality and indexing
- Source feature title: Outsourced agent memory capture
- Current reality source: spec 013-outsourced-agent-memory (Complete)
