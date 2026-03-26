---
title: "155 -- Post-save quality review"
description: "This scenario validates the POST-SAVE QUALITY REVIEW hook that runs after every JSON mode memory save, confirming correct field propagation, issue detection, and AI patch compliance."
---

# 155 -- Post-save quality review

## 1. OVERVIEW

This scenario validates the POST-SAVE QUALITY REVIEW hook that fires after a JSON mode `generate-context.js` save. It confirms that a fully-populated payload produces a PASSED review with 0 issues, that field-level mismatches (generic titles, path-fragment triggers, mismatched importance_tier, zero decision_count) are surfaced with severity-graded instructions, and that the AI can follow the emitted fix instructions to bring frontmatter into alignment with the payload.

---

## 2. CURRENT REALITY

Operators invoke `generate-context.js --json` with controlled payloads and inspect the POST-SAVE QUALITY REVIEW block in stdout as well as the rendered frontmatter of the produced memory file.

- Objective: Verify that the post-save quality review correctly identifies field-propagation failures and guides AI remediation
- Prompt: `Run generate-context.js --json with varied payloads to exercise the post-save quality review hook. For each scenario confirm whether the review reports PASSED, SKIPPED, or specific issues at the correct severity. Return a pass/fail verdict for each scenario.`
- Expected signals: REVIEW block present in stdout; issue count and severity match the scenario; fix instructions are actionable
- Pass/fail: PASS if review output matches expected status for each scenario and AI-applied patches resolve all reported issues

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 155 | Post-save quality review | JSON mode save with all fields populated correctly | `Run generate-context.js --json with a complete payload containing a meaningful sessionSummary, explicit triggerPhrases, at least 2 keyDecisions, importanceTier="important", and contextType="implementation". Confirm the POST-SAVE QUALITY REVIEW block reports PASSED with 0 issues.` | 1) Compose full JSON payload: `sessionSummary` = descriptive title, `triggerPhrases` = keyword array, `keyDecisions` = 2+ items, `importanceTier` = "important", `contextType` = "implementation" 2) `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>` 3) Capture stdout 4) Locate `POST-SAVE QUALITY REVIEW` block 5) Assert status = PASSED and issues = 0 | `POST-SAVE QUALITY REVIEW -- PASSED` with 0 issues | CLI stdout REVIEW block | PASS if REVIEW shows PASSED and 0 issues; FAIL if any issue is reported for a fully valid payload | Check `scripts/core/post-save-review.ts` for false-positive conditions |
| 155 | Post-save quality review | JSON mode save with generic title | `Run generate-context.js --json where the pipeline produces a generic title instead of a meaningful one. Confirm the POST-SAVE QUALITY REVIEW block reports a [HIGH] title issue with a fix instruction referencing the sessionSummary field.` | 1) Compose payload that would yield a generic title 2) `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>` 3) Capture stdout 4) Locate `POST-SAVE QUALITY REVIEW` block 5) Assert a `[HIGH]` issue is reported for the title field 6) Assert a fix instruction is present | `[HIGH]` severity issue for title; fix instruction references `sessionSummary` | CLI stdout REVIEW block | PASS if HIGH title issue reported with fix; FAIL if no issue or wrong severity | Inspect title-quality check in `scripts/core/post-save-review.ts` and the generic-title detection list |
| 155 | Post-save quality review | JSON mode save with path fragment triggers | `Run generate-context.js --json where triggerPhrases are provided but the pipeline generates path-fragment values instead. Confirm the POST-SAVE QUALITY REVIEW block reports a [HIGH] trigger_phrases issue with a fix instruction.` | 1) Compose payload with `triggerPhrases` = ["auth refactor"] but arrange for heuristic override 2) `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>` 3) Capture stdout 4) Assert a `[HIGH]` issue for `trigger_phrases` containing path fragments | `[HIGH]` severity issue for trigger_phrases; fix instruction present | CLI stdout REVIEW block | PASS if HIGH trigger_phrases issue reported; FAIL if path fragments pass undetected | Check path-fragment detection regex in `scripts/core/post-save-review.ts` |
| 155 | Post-save quality review | JSON mode save with mismatched importance_tier | `Run generate-context.js --json with importanceTier="important" in the payload but where the pipeline outputs "normal" in the rendered frontmatter. Confirm the POST-SAVE QUALITY REVIEW block reports a [MEDIUM] importance_tier mismatch.` | 1) Compose payload with `importanceTier` = "important" 2) Force or simulate a pipeline override to "normal" 3) `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>` 4) Capture stdout 5) Assert a `[MEDIUM]` issue for `importance_tier` | `[MEDIUM]` severity issue for importance_tier; expected vs actual values shown | CLI stdout REVIEW block | PASS if MEDIUM importance_tier issue reported; FAIL if mismatch goes unreported | Inspect importance_tier comparison in `scripts/core/post-save-review.ts` and input-normalizer passthrough |
| 155 | Post-save quality review | JSON mode save with 0 decisions when payload has keyDecisions | `Run generate-context.js --json with 2 keyDecisions in the payload but where the rendered memory metadata has decision_count=0. Confirm the POST-SAVE QUALITY REVIEW block reports a [MEDIUM] decision_count issue.` | 1) Compose payload with `keyDecisions` = ["Decision A", "Decision B"] 2) `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>` 3) Capture stdout 4) Assert a `[MEDIUM]` issue for `decision_count` = 0 despite non-empty payload | `[MEDIUM]` severity issue for decision_count; notes expected count from payload | CLI stdout REVIEW block | PASS if MEDIUM decision_count issue reported; FAIL if zero count is not detected | Check decision counting in `scripts/extractors/collect-session-data.ts` and the metadata-block parser in `scripts/core/post-save-review.ts` |
| 155 | Post-save quality review | AI follows fix instructions to resolve HIGH issues | `After a save that produces HIGH issues in the POST-SAVE QUALITY REVIEW, apply the emitted fix instructions to patch the frontmatter fields. Re-read the memory file and confirm all patched fields now match the original payload values.` | 1) Perform a save that produces at least one `[HIGH]` issue (e.g., title or trigger_phrases) 2) Read the emitted fix instructions from the REVIEW block 3) Apply the patch to the rendered memory file frontmatter 4) Re-read the file 5) Assert patched field matches the payload value | Frontmatter fields match payload values after patch; no remaining mismatches for patched fields | Before/after frontmatter diff | PASS if all patched fields match payload; FAIL if any patched field still differs | Verify fix instruction precision — instructions must name the exact field and target value |
| 155-F | Post-save quality review | Score penalty advisory logging | `Run generate-context.js --json with a payload designed to trigger at least one HIGH post-save review issue. Confirm the CLI stdout includes a "Post-save review: quality_score penalty" log line with the computed penalty value.` | 1) Compose payload that produces a generic title (triggers HIGH issue) 2) Run generate-context.js --json 3) Capture stdout 4) Locate "Post-save review: quality_score penalty" log line 5) Assert penalty value is negative (e.g., -0.10) | "Post-save review: quality_score penalty" present in stdout with negative value | CLI stdout | PASS if penalty log line present with correct value; FAIL if no penalty log despite HIGH issue | Check computeReviewScorePenalty in post-save-review.ts and advisory logging in workflow.ts |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [13--memory-quality-and-indexing/19-post-save-quality-review.md](../../feature_catalog/13--memory-quality-and-indexing/19-post-save-quality-review.md)
- Related entry: [16--tooling-and-scripts/153-json-mode-hybrid-enrichment.md](../16--tooling-and-scripts/153-json-mode-hybrid-enrichment.md)
- Workflow hook: `scripts/core/post-save-review.ts`
- Save pipeline: `scripts/core/workflow.ts`
- CLI surface: `scripts/memory/generate-context.ts`

---

## 5. SOURCE METADATA

- Group: Memory Quality and Indexing
- Playbook ID: 155
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `13--memory-quality-and-indexing/155-post-save-quality-review.md`
