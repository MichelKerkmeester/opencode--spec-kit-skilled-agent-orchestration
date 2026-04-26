---
title: "153 -- JSON mode structured summary hardening"
description: "This scenario validates the structured JSON summary contract for generate-context.js, including toolCalls/exchanges fields, file-backed JSON authority, and Wave 2 hardening."
---

# 153 -- JSON mode structured summary hardening

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. SCENARIO CONTRACT](#2--scenario-contract)
- [3. TEST EXECUTION](#3--test-execution)
- [4. REFERENCES](#4--references)
- [5. SOURCE METADATA](#5--source-metadata)

## 1. OVERVIEW

This scenario validates the phase 016 structured JSON summary contract for `generate-context.js`. It covers acceptance of `toolCalls` and `exchanges` fields, file-backed JSON authority preservation, snake_case field compatibility, and Wave 2 hardening for decision confidence, truncated titles, `git_changed_file_count` stability, and template count preservation.

---

## 2. SCENARIO CONTRACT

Operators verify that structured JSON inputs produce correct memory output and that the hardening fixes prevent data loss from sparse conversation arrays or missing explicit values.

- Objective: Verify structured JSON summary contract and Wave 2 hardening
- Prompt: `As a tooling validation operator, validate JSON mode structured summary hardening against toolCalls. Verify structured JSON summary contract and Wave 2 hardening. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Structured fields preserved in rendered output, counts match explicit input, file-backed JSON stays on the structured path
- Pass/fail: PASS if all structured fields survive rendering and hardening fixes hold; FAIL if any field is lost or overwritten by heuristics

---

## 3. TEST EXECUTION

### Prompt

```
As a tooling validation operator, verify structured JSON summary contract against toolCalls. Verify all structured fields present in output, counts match, file-backed JSON stays on the structured path. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Compose JSON payload with `toolCalls`, `exchanges`, `user_prompts`, `trigger_phrases`
2. `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>`
3. Inspect rendered .md output for field preservation
4. Verify decision confidence matches input
5. Verify git_changed_file_count matches explicit count

### Expected

All structured fields present in output, counts match, file-backed JSON stays on the structured path

### Evidence

Rendered memory file content, CLI exit code 0

### Pass / Fail

- **Pass**: structured fields preserved and hardening fixes hold
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check input-normalizer mapping, collect-session-data count handling, and workflow routing for structured inputs

---

### Prompt

```
As a tooling validation operator, validate Post-save quality review output verification against sessionSummary. Verify pOST-SAVE QUALITY REVIEW -- PASSED header visible in stdout, issues: 0 or equivalent no-issue indicator. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Compose a complete JSON payload with `sessionSummary`, `triggerPhrases`, `keyDecisions`, `importanceTier`, `contextType`
2. `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>`
3. Capture full stdout
4. Locate the `POST-SAVE QUALITY REVIEW` block
5. Verify it reads `PASSED` with 0 issues

### Expected

`POST-SAVE QUALITY REVIEW -- PASSED` header visible in stdout, `issues: 0` or equivalent no-issue indicator

### Evidence

CLI stdout log showing REVIEW block

### Pass / Fail

- **Pass**: REVIEW block is present and reports 0 issues
- **Fail**: block is absent or reports any issues

### Failure Triage

Check `scripts/core/post-save-review.ts`, `scripts/core/workflow.ts`, and CLI response rendering in `scripts/memory/generate-context.ts`

---

### Prompt

```
As a tooling validation operator, validate sessionSummary propagates to frontmatter title against sessionSummary. Verify frontmatter title equals the sessionSummary value; no occurrence of "Next Steps" as the title. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Set `sessionSummary` to a descriptive, non-generic string (e.g., "Refactor auth pipeline for token refresh")
2. `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>`
3. Read the rendered .md frontmatter
4. Assert `title` field matches provided sessionSummary

### Expected

Frontmatter `title` equals the sessionSummary value; no occurrence of "Next Steps" as the title

### Evidence

Rendered .md frontmatter

### Pass / Fail

- **Pass**: title matches sessionSummary
- **Fail**: title is "Next Steps" or any other fallback

### Failure Triage

Inspect input-normalizer title derivation and frontmatter assembly in workflow.ts

---

### Prompt

```
As a tooling validation operator, validate triggerPhrases propagate to frontmatter trigger_phrases against triggerPhrases. Verify frontmatter trigger_phrases contains only the supplied keyword phrases; no path fragments present. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Set `triggerPhrases` to meaningful keyword phrases (e.g., ["auth refactor", "token refresh"])
2. `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>`
3. Read the rendered .md frontmatter
4. Assert `trigger_phrases` matches the provided array
5. Assert no entry looks like a file path (contains `/` or `.ts`)

### Expected

Frontmatter `trigger_phrases` contains only the supplied keyword phrases; no path fragments present

### Evidence

Rendered .md frontmatter

### Pass / Fail

- **Pass**: trigger_phrases matches payload
- **Fail**: path fragments appear or array is replaced by heuristic output

### Failure Triage

Inspect trigger-extractor heuristic fallback and input-normalizer trigger_phrases passthrough

---

### Prompt

```
As a tooling validation operator, validate keyDecisions propagate to non-zero decision_count against keyDecisions. Verify memory metadata decision_count equals the number of items in the keyDecisions array. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Set `keyDecisions` to an array of 2+ decision strings
2. `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>`
3. Read the rendered .md file, including the `## MEMORY METADATA` YAML block
4. Assert `decision_count` > 0 and equals `keyDecisions.length`

### Expected

Memory metadata `decision_count` equals the number of items in the `keyDecisions` array

### Evidence

Rendered .md metadata block

### Pass / Fail

- **Pass**: decision_count > 0 and matches array length
- **Fail**: decision_count is 0 despite supplied decisions

### Failure Triage

Check collect-session-data decision counting, input-normalizer keyDecisions mapping, and metadata-block rendering

---

### Prompt

```
As a tooling validation operator, validate importanceTier propagates to frontmatter importance_tier against importanceTier. Verify frontmatter importance_tier equals the payload value. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Set `importanceTier` to `"important"`
2. `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>`
3. Read the rendered .md frontmatter
4. Assert `importance_tier` equals `"important"`

### Expected

Frontmatter `importance_tier` equals the payload value

### Evidence

Rendered .md frontmatter

### Pass / Fail

- **Pass**: importance_tier matches payload
- **Fail**: overridden to "normal" or another default

### Failure Triage

Inspect importance_tier assignment in workflow.ts and input-normalizer passthrough

---

### Prompt

```
As a tooling validation operator, validate contextType propagates for the full documented valid enum against contextType. Verify frontmatter context_type equals the payload value for every documented valid test case. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Save separate JSON payloads using `contextType` values `"implementation"`, `"review"`, `"debugging"`, and `"planning"`
2. `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>` for each case
3. Read each rendered .md frontmatter
4. Assert `context_type` matches the payload value every time

### Expected

Frontmatter `context_type` equals the payload value for every documented valid test case

### Evidence

Rendered .md frontmatter across the saved files

### Pass / Fail

- **Pass**: every valid test case preserves its explicit context_type
- **Fail**: any valid value is rewritten or defaulted

### Failure Triage

Inspect contextType passthrough in input-normalizer, detectSessionCharacteristics in session-extractor, and frontmatter assembly in workflow.ts

---

### Prompt

```
As a tooling validation operator, validate Contamination filter cleans hedging in sessionSummary against the documented validation surface. Verify saved memory free of hedging and meta-commentary phrases. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Compose payload with hedging text in sessionSummary and meta-commentary in recentContext
2. Run generate-context.js --json
3. Read saved memory file
4. grep for "I think" and "As an AI"
5. Assert neither phrase appears

### Expected

Saved memory free of hedging and meta-commentary phrases

### Evidence

grep output showing zero matches

### Pass / Fail

- **Pass**: hedging phrases absent from saved memory
- **Fail**: any contamination survives

### Failure Triage

Check contamination-filter.ts pattern list and workflow.ts cleaning call sites

---

### Prompt

```
As a tooling validation operator, validate Fast-path filesModified to FILES conversion against the documented validation surface. Verify fILES section populated with filesModified entries. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Compose payload with userPrompts (triggers fast-path) and filesModified=["src/foo.ts"]
2. Run generate-context.js --json
3. Read saved memory
4. Assert FILES section contains src/foo.ts

### Expected

FILES section populated with filesModified entries

### Evidence

Rendered memory file

### Pass / Fail

- **Pass**: FILES contains all filesModified entries
- **Fail**: FILES is empty or missing

### Failure Triage

Check input-normalizer.ts fast-path filesModified conversion

---

### Prompt

```
As a tooling validation operator, validate Unknown field warning for typos against the documented validation surface. Verify console WARN naming the unknown field. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Compose payload with sesionSummary (missing 's')
2. Run generate-context.js --json
3. Capture stderr/stdout
4. Assert WARN message contains "sesionSummary"

### Expected

Console WARN naming the unknown field

### Evidence

CLI stdout/stderr

### Pass / Fail

- **Pass**: warning emitted
- **Fail**: typo passes silently

### Failure Triage

Check KNOWN_RAW_INPUT_FIELDS in input-normalizer.ts

---

### Prompt

```
As a tooling validation operator, validate contextType enum rejection against the documented validation surface. Verify validation error with invalid value and valid options listed. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Set contextType to "bogus"
2. Run generate-context.js --json
3. Assert validation error mentions "bogus" and lists valid values

### Expected

Validation error with invalid value and valid options listed

### Evidence

CLI error output

### Pass / Fail

- **Pass**: validation error with enum list
- **Fail**: bogus value accepted silently

### Failure Triage

Check VALID_CONTEXT_TYPES in input-normalizer.ts

---

### Prompt

```
As a tooling validation operator, validate Quality score discriminates contaminated vs clean against the documented validation surface. Verify contaminated quality_score < 0.80; clean quality_score > 0.80. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Save contaminated payload
2. Save clean payload
3. Compare quality_score in both files

### Expected

Contaminated quality_score < 0.80; clean quality_score > 0.80

### Evidence

Two saved memory files

### Pass / Fail

- **Pass**: contaminated < clean and contaminated < 0.80
- **Fail**: scores are indistinguishable

### Failure Triage

Check quality-scorer.ts bonus removal and penalty weights

---

### Prompt

```
As a tooling validation operator, validate Trigger phrase filter removes path fragments against the documented validation surface. Verify no trigger phrases containing "/" in auto-extracted set (manual phrases may contain them). Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Save memory for a deeply nested spec folder
2. Read saved memory trigger_phrases
3. Check for path separator characters

### Expected

No trigger phrases containing "/" in auto-extracted set (manual phrases may contain them)

### Evidence

Saved memory frontmatter

### Pass / Fail

- **Pass**: no path-fragment trigger phrases in auto-extracted set
- **Fail**: path fragments survive filtering

### Failure Triage

Check filterTriggerPhrases in workflow.ts

---

### Prompt

```
As a tooling validation operator, validate Embedding retry stats visible in memory_health against the documented validation surface. Verify embeddingRetry block present with all fields. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Call memory_health MCP tool
2. Inspect response for embeddingRetry block
3. Verify all 6 fields present

### Expected

embeddingRetry block present with all fields

### Evidence

memory_health MCP response

### Pass / Fail

- **Pass**: embeddingRetry block present with all fields
- **Fail**: missing or incomplete

### Failure Triage

Check retry-manager.ts getEmbeddingRetryStats() and memory-crud-health.ts handler

---

### Prompt

```
As a tooling validation operator, validate Default-on pre-save overlap warning uses exact content match against SPECKIT_PRE_SAVE_DEDUP. Verify advisory overlap warning appears only when the flag is enabled/defaulted. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Save a JSON payload once
2. Save the exact same payload again with `SPECKIT_PRE_SAVE_DEDUP` unset
3. Capture stdout/stderr and confirm a PRE-SAVE OVERLAP warning
4. Repeat the second save with `SPECKIT_PRE_SAVE_DEDUP=false`
5. Confirm the warning is absent

### Expected

Advisory overlap warning appears only when the flag is enabled/defaulted

### Evidence

CLI stdout/stderr from repeated saves

### Pass / Fail

- **Pass**: default-on behavior emits the warning and explicit disable suppresses it
- **Fail**: the warning never appears or cannot be disabled

### Failure Triage

Check `workflow.ts` SHA1 overlap check and env-flag gate

---

### Prompt

```
As a tooling validation operator, validate projectPhase override propagates to frontmatter against the documented validation surface. Verify pROJECT_PHASE: IMPLEMENTATION in frontmatter. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Set projectPhase to "IMPLEMENTATION" in JSON payload
2. Run generate-context.js --json
3. Read frontmatter
4. Assert PROJECT_PHASE equals IMPLEMENTATION

### Expected

PROJECT_PHASE: IMPLEMENTATION in frontmatter

### Evidence

Rendered .md frontmatter

### Pass / Fail

- **Pass**: PROJECT_PHASE matches
- **Fail**: shows RESEARCH

### Failure Triage

Check resolveProjectPhase() in session-extractor.ts and projectPhase propagation in input-normalizer.ts

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [16--tooling-and-scripts/16-json-mode-hybrid-enrichment.md](../../feature_catalog/16--tooling-and-scripts/16-json-mode-hybrid-enrichment.md)
- Source spec: [016-json-mode-hybrid-enrichment/spec.md](../../../../specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/016-json-mode-hybrid-enrichment/spec.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 153
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `16--tooling-and-scripts/153-json-mode-hybrid-enrichment.md`
