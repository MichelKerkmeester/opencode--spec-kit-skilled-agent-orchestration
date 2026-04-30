---
title: Memory Handback Protocol for cli-* Skills
description: Canonical 7-step Memory Handback procedure shared across the five cli-* sibling skills. Covers MEMORY_HANDBACK extraction, structured-JSON normalization, generate-context.js dispatch modes, and the post-010 save gates.
---

# Memory Handback Protocol (cli-* family)

When a calling AI delegates a task to one of the cli-* skills (`cli-claude-code`, `cli-codex`, `cli-copilot`, `cli-gemini`, `cli-opencode`) and needs to preserve the resulting session context, the agent runs the same 7-step procedure documented below. This procedure is byte-identical across all five sibling skills; this reference holds the canonical copy. Each cli-* SKILL.md cites the prompt_templates.md §N anchor for its own Memory Epilogue template — see the skill's SKILL.md §4 Memory Handback Protocol for the file-specific anchor reference.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Canonical 7-step Memory Handback procedure shared across the five cli-* sibling skills. Covers MEMORY_HANDBACK extraction, structured-JSON normalization, generate-context.js dispatch modes, and the post-010 save gates.

---

<!-- /ANCHOR:overview -->

<!-- ANCHOR:procedure-7-steps -->
## 2. PROCEDURE (7 STEPS)

1. **Include epilogue**: Append the Spec-Doc Record Epilogue template (see the cli-* skill's `assets/prompt_templates.md` §N — the section number is cited inline in the skill's §4) to the delegated prompt.
2. **Extract section**: After receiving agent output, extract the `MEMORY_HANDBACK` section using: `/<!-- MEMORY_HANDBACK_START -->([\s\S]*?)<!-- MEMORY_HANDBACK_END -->/`
3. **Convert to structured JSON**: Build the JSON-primary payload that `generate-context.js` documents. Use `specFolder`, `user_prompts`, `observations`, and `recent_context` as the canonical field names in new examples. Add `FILES`, `sessionSummary`, `keyDecisions`, `nextSteps`, `triggerPhrases`, `toolCalls`, `exchanges`, `preflight`, and `postflight` when the delegated run produced that evidence.
4. **Redact and scrub**: Remove secrets, tokens, credentials, and any unnecessary sensitive values before writing the JSON file or sending the payload to the save script.
5. **Choose a structured-input mode**: Save the scrubbed payload to `/tmp/save-context-data-<session-id>.json`, pipe it with `--stdin`, or pass it inline with `--json`.
6. **Invoke generate-context.js**: Use one of:
   - `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data-<session-id>.json [spec-folder]`
   - `printf '%s' "$JSON_PAYLOAD" | node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --stdin [spec-folder]`
   - `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json "$JSON_PAYLOAD" [spec-folder]`
7. **Index**: Run `memory_index_scan({ specFolder })` for immediate MCP visibility.

---

<!-- /ANCHOR:procedure-7-steps -->

<!-- ANCHOR:caveats -->
## 3. CAVEATS

**Delimiter missing**: If agent output lacks `MEMORY_HANDBACK` delimiters, the calling AI manually constructs the structured JSON payload and saves it through the same JSON-primary path. The save flow normalizes `nextSteps` or `next_steps`; the first entry persists as `Next: ...` and drives `NEXT_ACTION`, and remaining entries persist as `Follow-up: ...`.

**Structured JSON only**: Direct spec-folder-only invocation is no longer supported. Always call `generate-context.js` with `--stdin`, `--json`, or a JSON temp file.

**Explicit target precedence**: If you pass `[spec-folder]` on the CLI, that explicit target wins over any `specFolder` value inside the payload.

**Explicit JSON mode failures**: If the explicit data file cannot be loaded, `generate-context.js` fails with `EXPLICIT_DATA_FILE_LOAD_FAILED: ...`. Do not fall back to OpenCode capture in that case; surface the error and stop.

**Post-010 save gates**: Valid JSON can still be rejected after normalization. File-backed handbacks skip the stateless alignment and `QUALITY_GATE_ABORT` checks, but they still fail with `INSUFFICIENT_CONTEXT_ABORT` when the payload is too thin and with `CONTAMINATION_GATE_ABORT` when it includes content from another spec.

**Compatibility aliases**: The normalizer still accepts documented camelCase and snake_case pairs such as `sessionSummary` / `session_summary`, `nextSteps` / `next_steps`, `userPrompts` / `user_prompts`, and `recentContext` / `recent_context`. Prefer the canonical field names shown above in new handback payloads.

**Minimum payload guidance**: Include a specific `sessionSummary`, at least one meaningful `recent_context` entry or equivalent observation, and rich `FILES` entries with a descriptive `DESCRIPTION`. Add `ACTION`, `MODIFICATION_MAGNITUDE`, and `_provenance` when known so the saved memory carries durable evidence instead of bare filenames.

---

<!-- /ANCHOR:caveats -->

<!-- ANCHOR:per-skill-template-anchor -->
## 4. PER-SKILL TEMPLATE ANCHOR

Each cli-* skill cites a specific `assets/prompt_templates.md §N` anchor for its Memory Epilogue. Look in the skill's §4 Memory Handback Protocol for the cited section number — the reference paths are otherwise identical.

---

<!-- /ANCHOR:per-skill-template-anchor -->
