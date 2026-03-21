---
title: "153 -- JSON mode structured summary hardening"
description: "This scenario validates the structured JSON summary contract for generate-context.js, including toolCalls/exchanges fields, file-backed JSON authority, and Wave 2 hardening."
---

# 153 -- JSON mode structured summary hardening

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. TEST EXECUTION](#3--test-execution)
- [4. REFERENCES](#4--references)
- [5. SOURCE METADATA](#5--source-metadata)

## 1. OVERVIEW

This scenario validates the phase 016 structured JSON summary contract for `generate-context.js`. It covers acceptance of `toolCalls` and `exchanges` fields, file-backed JSON authority preservation, snake_case field compatibility, and Wave 2 hardening for decision confidence, truncated titles, `git_changed_file_count` stability, and template count preservation.

---

## 2. CURRENT REALITY

Operators verify that structured JSON inputs produce correct memory output and that the hardening fixes prevent data loss from sparse conversation arrays or missing explicit values.

- Objective: Verify structured JSON summary contract and Wave 2 hardening
- Prompt: `Save a memory using generate-context.js --json with a payload containing toolCalls, exchanges, and snake_case fields. Verify the rendered output preserves all structured fields, decision confidence, and explicit counts. Return a pass/fail verdict.`
- Expected signals: Structured fields preserved in rendered output, counts match explicit input, file-backed JSON stays on the structured path
- Pass/fail: PASS if all structured fields survive rendering and hardening fixes hold; FAIL if any field is lost or overwritten by heuristics

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 153 | JSON mode structured summary hardening | Verify structured JSON summary contract | `Save a memory using generate-context.js --json with a payload containing toolCalls, exchanges, and snake_case fields (user_prompts, recent_context, trigger_phrases). Verify the rendered output preserves all structured fields, decision confidence, and explicit counts. Return a pass/fail verdict.` | 1) Compose JSON payload with `toolCalls`, `exchanges`, `user_prompts`, `trigger_phrases` 2) `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>` 3) Inspect rendered .md output for field preservation 4) Verify decision confidence matches input 5) Verify git_changed_file_count matches explicit count | All structured fields present in output, counts match, file-backed JSON stays on the structured path | Rendered memory file content, CLI exit code 0 | PASS if structured fields preserved and hardening fixes hold | Check input-normalizer mapping, collect-session-data count handling, and workflow routing for structured inputs |
| 153-A | JSON mode structured summary hardening | Post-save quality review output verification | `Run generate-context.js --json with a fully-populated payload. Confirm the CLI prints a POST-SAVE QUALITY REVIEW block and that the block reports PASSED with 0 issues. Return a pass/fail verdict.` | 1) Compose a complete JSON payload with `sessionSummary`, `triggerPhrases`, `keyDecisions`, `importanceTier`, `contextType` 2) `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>` 3) Capture full stdout 4) Locate the `POST-SAVE QUALITY REVIEW` block 5) Verify it reads `PASSED` with 0 issues | `POST-SAVE QUALITY REVIEW -- PASSED` header visible in stdout, `issues: 0` or equivalent no-issue indicator | CLI stdout log showing REVIEW block | PASS if REVIEW block is present and reports 0 issues; FAIL if block is absent or reports any issues | Check `scripts/core/post-save-review.ts`, `scripts/core/workflow.ts`, and CLI response rendering in `scripts/memory/generate-context.ts` |
| 153-B | JSON mode structured summary hardening | sessionSummary propagates to frontmatter title | `Run generate-context.js --json with sessionSummary set to a meaningful task title (not "Next Steps"). Confirm the rendered memory file's frontmatter title matches the sessionSummary and is not a generic fallback such as "Next Steps".` | 1) Set `sessionSummary` to a descriptive, non-generic string (e.g., "Refactor auth pipeline for token refresh") 2) `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>` 3) Read the rendered .md frontmatter 4) Assert `title` field matches provided sessionSummary | Frontmatter `title` equals the sessionSummary value; no occurrence of "Next Steps" as the title | Rendered .md frontmatter | PASS if title matches sessionSummary; FAIL if title is "Next Steps" or any other fallback | Inspect input-normalizer title derivation and frontmatter assembly in workflow.ts |
| 153-C | JSON mode structured summary hardening | triggerPhrases propagate to frontmatter trigger_phrases | `Run generate-context.js --json with an explicit triggerPhrases array. Confirm the rendered memory file's frontmatter trigger_phrases matches the supplied array and contains no file-path fragments.` | 1) Set `triggerPhrases` to meaningful keyword phrases (e.g., ["auth refactor", "token refresh"]) 2) `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>` 3) Read the rendered .md frontmatter 4) Assert `trigger_phrases` matches the provided array 5) Assert no entry looks like a file path (contains `/` or `.ts`) | Frontmatter `trigger_phrases` contains only the supplied keyword phrases; no path fragments present | Rendered .md frontmatter | PASS if trigger_phrases matches payload; FAIL if path fragments appear or array is replaced by heuristic output | Inspect trigger-extractor heuristic fallback and input-normalizer trigger_phrases passthrough |
| 153-D | JSON mode structured summary hardening | keyDecisions propagate to non-zero decision_count | `Run generate-context.js --json with a keyDecisions array containing at least 2 items. Confirm the rendered memory metadata decision_count is greater than 0 and matches the number of supplied decisions.` | 1) Set `keyDecisions` to an array of 2+ decision strings 2) `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>` 3) Read the rendered .md file, including the `## MEMORY METADATA` YAML block 4) Assert `decision_count` > 0 and equals `keyDecisions.length` | Memory metadata `decision_count` equals the number of items in the `keyDecisions` array | Rendered .md metadata block | PASS if decision_count > 0 and matches array length; FAIL if decision_count is 0 despite supplied decisions | Check collect-session-data decision counting, input-normalizer keyDecisions mapping, and metadata-block rendering |
| 153-E | JSON mode structured summary hardening | importanceTier propagates to frontmatter importance_tier | `Run generate-context.js --json with importanceTier set to "important". Confirm the rendered memory file's frontmatter importance_tier matches "important" and is not overridden to "normal".` | 1) Set `importanceTier` to `"important"` 2) `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>` 3) Read the rendered .md frontmatter 4) Assert `importance_tier` equals `"important"` | Frontmatter `importance_tier` equals the payload value | Rendered .md frontmatter | PASS if importance_tier matches payload; FAIL if overridden to "normal" or another default | Inspect importance_tier assignment in workflow.ts and input-normalizer passthrough |
| 153-F | JSON mode structured summary hardening | contextType propagates to frontmatter context_type | `Run generate-context.js --json with contextType set to a specific type (e.g., "implementation"). Confirm the rendered memory file's frontmatter context_type matches the payload value and is not defaulted to "general".` | 1) Set `contextType` to `"implementation"` 2) `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>` 3) Read the rendered .md frontmatter 4) Assert `context_type` equals `"implementation"` | Frontmatter `context_type` equals the payload value; not "general" | Rendered .md frontmatter | PASS if context_type matches payload; FAIL if defaulted to "general" | Inspect contextType passthrough in input-normalizer and frontmatter builder |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [16--tooling-and-scripts/16-json-mode-hybrid-enrichment.md](../../feature_catalog/16--tooling-and-scripts/16-json-mode-hybrid-enrichment.md)
- Source spec: [016-json-mode-hybrid-enrichment/spec.md](../../../specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/016-json-mode-hybrid-enrichment/spec.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 153
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/153-json-mode-hybrid-enrichment.md`
