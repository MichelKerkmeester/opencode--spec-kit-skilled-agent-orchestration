---
title: "155 -- Post-save quality review"
description: "This scenario validates the POST-SAVE QUALITY REVIEW hook that runs after every JSON mode memory save, confirming correct field propagation, issue detection, and AI patch compliance."
audited_post_018: true
---

# 155 -- Post-save quality review

## 1. OVERVIEW

This scenario validates the POST-SAVE QUALITY REVIEW hook that fires after a JSON mode `generate-context.js` save. It confirms that a fully-populated payload produces a PASSED review with 0 issues, that field-level mismatches (generic titles, path-fragment triggers, mismatched importance_tier, zero decision_count) are surfaced with severity-graded instructions, and that the AI can follow the emitted fix instructions to bring frontmatter into alignment with the payload.

---

## 2. SCENARIO CONTRACT

Operators invoke `generate-context.js --json` with controlled payloads and inspect the POST-SAVE QUALITY REVIEW block in stdout as well as the rendered frontmatter of the produced memory file.

- Objective: Verify that the post-save quality review correctly identifies field-propagation failures and guides AI remediation
- Prompt: `As a spec-doc record-quality validation operator, validate Post-save quality review against sessionSummary. Verify the post-save quality review correctly identifies field-propagation failures and guides AI remediation. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: REVIEW block present in stdout; issue count and severity match the scenario; fix instructions are actionable
- Pass/fail: PASS if review output matches expected status for each scenario and AI-applied patches resolve all reported issues

---

## 3. TEST EXECUTION

### Prompt

```
As a spec-doc record-quality validation operator, validate JSON mode save with all fields populated correctly against sessionSummary. Verify pOST-SAVE QUALITY REVIEW -- PASSED with 0 issues. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Compose full JSON payload: `sessionSummary` = descriptive title, `triggerPhrases` = keyword array, `keyDecisions` = 2+ items, `importanceTier` = "important", `contextType` = "implementation"
2. `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>`
3. Capture stdout
4. Locate `POST-SAVE QUALITY REVIEW` block
5. Assert status = PASSED and issues = 0

### Expected

`POST-SAVE QUALITY REVIEW -- PASSED` with 0 issues

### Evidence

CLI stdout REVIEW block

### Pass / Fail

- **Pass**: REVIEW shows PASSED and 0 issues
- **Fail**: any issue is reported for a fully valid payload

### Failure Triage

Check `scripts/core/post-save-review.ts` for false-positive conditions

---

### Prompt

```
As a spec-doc record-quality validation operator, validate JSON mode save with generic title against node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>. Verify [HIGH] severity issue for title; fix instruction references sessionSummary. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Compose payload that would yield a generic title
2. `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>`
3. Capture stdout
4. Locate `POST-SAVE QUALITY REVIEW` block
5. Assert a `[HIGH]` issue is reported for the title field
6. Assert a fix instruction is present

### Expected

[HIGH]` severity issue for title; fix instruction references `sessionSummary

### Evidence

CLI stdout REVIEW block

### Pass / Fail

- **Pass**: HIGH title issue reported with fix
- **Fail**: no issue or wrong severity

### Failure Triage

Inspect title-quality check in `scripts/core/post-save-review.ts` and the generic-title detection list

---

### Prompt

```
As a spec-doc record-quality validation operator, validate JSON mode save with path fragment triggers against triggerPhrases. Verify [HIGH] severity issue for trigger_phrases; fix instruction present. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Compose payload with `triggerPhrases` = ["auth refactor"] but arrange for heuristic override
2. `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>`
3. Capture stdout
4. Assert a `[HIGH]` issue for `trigger_phrases` containing path fragments

### Expected

`[HIGH]` severity issue for trigger_phrases; fix instruction present

### Evidence

CLI stdout REVIEW block

### Pass / Fail

- **Pass**: HIGH trigger_phrases issue reported
- **Fail**: path fragments pass undetected

### Failure Triage

Check path-fragment detection regex in `scripts/core/post-save-review.ts`

---

### Prompt

```
As a spec-doc record-quality validation operator, validate JSON mode save with mismatched importance_tier against importanceTier. Verify [MEDIUM] severity issue for importance_tier; expected vs actual values shown. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Compose payload with `importanceTier` = "important"
2. Force or simulate a pipeline override to "normal"
3. `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>`
4. Capture stdout
5. Assert a `[MEDIUM]` issue for `importance_tier`

### Expected

`[MEDIUM]` severity issue for importance_tier; expected vs actual values shown

### Evidence

CLI stdout REVIEW block

### Pass / Fail

- **Pass**: MEDIUM importance_tier issue reported
- **Fail**: mismatch goes unreported

### Failure Triage

Inspect importance_tier comparison in `scripts/core/post-save-review.ts` and input-normalizer passthrough

---

### Prompt

```
As a spec-doc record-quality validation operator, validate JSON mode save with 0 decisions when payload has keyDecisions against keyDecisions. Verify [MEDIUM] severity issue for decision_count; notes expected count from payload. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Compose payload with `keyDecisions` = ["Decision A", "Decision B"]
2. `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>`
3. Capture stdout
4. Assert a `[MEDIUM]` issue for `decision_count` = 0 despite non-empty payload

### Expected

`[MEDIUM]` severity issue for decision_count; notes expected count from payload

### Evidence

CLI stdout REVIEW block

### Pass / Fail

- **Pass**: MEDIUM decision_count issue reported
- **Fail**: zero count is not detected

### Failure Triage

Check decision counting in `scripts/extractors/collect-session-data.ts` and the metadata-block parser in `scripts/core/post-save-review.ts`

---

### Prompt

```
As a spec-doc record-quality validation operator, validate AI follows fix instructions to resolve HIGH issues against [HIGH]. Verify frontmatter fields match payload values after patch; no remaining mismatches for patched fields. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Perform a save that produces at least one `[HIGH]` issue (e.g., title or trigger_phrases)
2. Read the emitted fix instructions from the REVIEW block
3. Apply the patch to the rendered spec-doc record file frontmatter
4. Re-read the file
5. Assert patched field matches the payload value

### Expected

Frontmatter fields match payload values after patch; no remaining mismatches for patched fields

### Evidence

Before/after frontmatter diff

### Pass / Fail

- **Pass**: all patched fields match payload
- **Fail**: any patched field still differs

### Failure Triage

Verify fix instruction precision — instructions must name the exact field and target value

---

### Prompt

```
As a spec-doc record-quality validation operator, validate Score penalty advisory logging against the documented validation surface. Verify "Post-save review: quality_score penalty" present in stdout with negative value. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Compose payload that produces a generic title (triggers HIGH issue)
2. Run generate-context.js --json
3. Capture stdout
4. Locate "Post-save review: quality_score penalty" log line
5. Assert penalty value is negative (e.g., -0.10)

### Expected

"Post-save review: quality_score penalty" present in stdout with negative value

### Evidence

CLI stdout

### Pass / Fail

- **Pass**: penalty log line present with correct value
- **Fail**: no penalty log despite HIGH issue

### Failure Triage

Check computeReviewScorePenalty in post-save-review.ts and advisory logging in workflow.ts

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [13--memory-quality-and-indexing/19-post-save-quality-review.md](../../feature_catalog/13--memory-quality-and-indexing/19-post-save-quality-review.md)
- Related entry: [16--tooling-and-scripts/153-json-mode-hybrid-enrichment.md](../16--tooling-and-scripts/153-json-mode-hybrid-enrichment.md)
- Workflow hook: `scripts/core/post-save-review.ts`
- Save pipeline: `scripts/core/workflow.ts`
- CLI surface: `scripts/memory/generate-context.ts`

---

## 5. SOURCE METADATA

- Group: Memory Quality and Indexing
- Playbook ID: 155
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `13--memory-quality-and-indexing/155-post-save-quality-review.md`
