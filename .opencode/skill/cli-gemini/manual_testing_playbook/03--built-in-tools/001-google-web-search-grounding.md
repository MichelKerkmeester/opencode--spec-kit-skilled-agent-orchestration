---
title: "CG-006 -- Google web search grounding"
description: "This scenario validates the `google_web_search` built-in tool for `CG-006`. It focuses on confirming Gemini CLI returns live, citable web information when explicitly asked to use Google Search and that the JSON envelope records the tool call."
---

# CG-006 -- Google web search grounding

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CG-006`.

---

## 1. OVERVIEW

This scenario validates the `google_web_search` built-in tool for `CG-006`. It focuses on confirming the tool actually fires when the prompt explicitly requests Google Search grounding and that the JSON envelope's `toolCalls` array records the invocation so downstream auditors can prove the answer was grounded against live web data.

### Why This Matters

`google_web_search` is one of the tools cli-gemini routes to specifically because Claude Code lacks an exact equivalent. If the tool silently degrades to model-internal knowledge, the calling AI will receive stale answers and treat them as fresh research, defeating the entire reason for delegating.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CG-006` and confirm the expected signals without contradictory evidence.

- Objective: Confirm an explicit `Use google_web_search to ...` prompt produces an answer that includes at least one URL citation AND the JSON envelope records a `google_web_search` tool call
- Real user request: `Get the latest official Node.js LTS version straight from Google instead of from training data; show me the source URL.`
- RCAF Prompt: `As a cross-AI orchestrator needing fresh web evidence, invoke Gemini CLI against the cli-gemini skill in this repository and explicitly request the google_web_search built-in tool. Verify the answer is grounded in at least one citable URL and the JSON toolCalls array records a google_web_search invocation. Return a concise pass/fail verdict with the main reason, the answer text, and the cited source URL.`
- Expected execution process: orchestrator dispatches the JSON-mode call with an explicit `Use google_web_search` instruction, then inspects `.response` for a URL and `.toolCalls[].name` for `google_web_search`
- Expected signals: command exits 0. `.response` mentions at least one `https://` URL. `.toolCalls` contains an entry whose `name` equals `google_web_search`. The answer references the queried topic
- Desired user-visible outcome: PASS verdict + the LTS version string + the cited URL line such as `source: https://nodejs.org/...`
- Pass/fail: PASS if the URL is present in `.response` AND `google_web_search` is recorded in `.toolCalls`. FAIL if no URL appears, the tool was not invoked or the answer is obviously stale relative to the current Node.js release schedule

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the request as "verify google_web_search actually fires and the answer is grounded against a live URL".
2. Stay local. This is a direct CLI dispatch.
3. Always use `-o json` so the tool-call envelope is machine-checkable rather than relying on the natural-language answer alone.
4. Treat absence of a URL in `.response` as a failure even if `.toolCalls` shows the tool fired, grounding without citation is not useful for cross-AI orchestration.
5. Surface both the answer and the cited URL in the verdict so the operator can sanity-check the grounding.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CG-006 | Google web search grounding | Confirm `google_web_search` fires for an explicit web-grounded prompt and the answer cites at least one URL | `As a cross-AI orchestrator needing fresh web evidence, invoke Gemini CLI against the cli-gemini skill in this repository and explicitly request the google_web_search built-in tool. Verify the answer is grounded in at least one citable URL and the JSON toolCalls array records a google_web_search invocation. Return a concise pass/fail verdict with the main reason, the answer text, and the cited source URL.` | 1. `bash: gemini "Use google_web_search to find the current official Node.js LTS major version. Answer in one sentence and include the source URL." -m gemini-3.1-pro-preview -o json 2>&1 > /tmp/cg-006.json; echo EXIT=$?` -> 2. `bash: jq -r '.response' /tmp/cg-006.json` -> 3. `bash: jq -r '.toolCalls[] \| .name' /tmp/cg-006.json` -> 4. `bash: jq -r '.response' /tmp/cg-006.json \| grep -oE 'https?://[^[:space:]]+' \| head -3` | Step 1: `EXIT=0`, `/tmp/cg-006.json` parses; Step 2: non-empty answer mentioning Node.js LTS; Step 3: at least one line equals `google_web_search`; Step 4: at least one HTTPS URL printed | `/tmp/cg-006.json` saved + outputs from Steps 2, 3, and 4 | PASS if Step 3 includes `google_web_search` AND Step 4 prints at least one URL AND Step 2 names a plausible Node.js LTS major version; FAIL if any of those checks miss | 1. Re-run with the explicit phrasing `Use the google_web_search tool` if Gemini routed to the model's internal knowledge; 2. Inspect `.toolCalls` raw JSON to see whether a different web tool fired; 3. If the cell is rate-limited, wait per `references/cli_reference.md` §10 and retry once |

### Optional Supplemental Checks

If `.toolCalls` shows multiple `google_web_search` entries, that is fine, the model may issue follow-up queries. Just confirm at least one of them ran and at least one URL surfaced.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | cli-gemini skill surface (`google_web_search` listed as Unique Gemini Capability in §3) |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/gemini_tools.md` | §2 UNIQUE TOOLS → google_web_search documents capability and invocation pattern |
| `../../references/cli_reference.md` | §6 OUTPUT FORMATS confirms `.toolCalls` envelope shape used for verification |

---

## 5. SOURCE METADATA

- Group: Built-in Tools
- Playbook ID: CG-006
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--built-in-tools/001-google-web-search-grounding.md`
