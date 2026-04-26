---
title: "CG-012 -- @deep-research agent with web grounding"
description: "This scenario validates routing a research task to the Gemini `@deep-research` agent for `CG-012`. It focuses on confirming the agent uses `google_web_search` for evidence gathering and returns a citation-backed comparison."
---

# CG-012 -- @deep-research agent with web grounding

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CG-012`.

---

## 1. OVERVIEW

This scenario validates the `@deep-research` agent routing for `CG-012`. It focuses on confirming the documented `As @deep-research agent: ...` prefix routes a research task that benefits from web grounding (per `references/agent_delegation.md` §3, Unique capability: `google_web_search`) and returns a citation-backed comparison.

### Why This Matters

`@deep-research` is the cli-gemini delegation for tasks that need real-time web evidence. The orchestrator routes to it specifically when Claude Code's training data may be stale (latest framework releases, current security advisories, recent migration guides). If the agent silently skips web grounding, the answer is no better than what the calling AI could produce locally.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CG-012` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `As @deep-research agent: ...` returns a comparison answer that includes at least two `https://` citations AND `.toolCalls` records at least one `google_web_search` invocation
- Real user request: `Have Gemini's @deep-research agent compare the current Bun and Deno major versions and tell me which one shipped a TypeScript-by-default story first — cite the official release notes URLs.`
- Prompt: `As a cross-AI orchestrator delegating a fresh-evidence research task, dispatch the @deep-research agent against the cli-gemini skill in this repository to compare the current Bun and Deno runtime major versions. Verify the response includes at least two HTTPS source URLs and that the JSON toolCalls array records at least one google_web_search invocation. Return a concise pass/fail verdict with the main reason, the comparison answer, and the cited URLs.`
- Expected execution process: orchestrator dispatches the JSON-mode `@deep-research` call, captures the JSON envelope, then greps `.response` for HTTPS URLs and `.toolCalls` for `google_web_search`
- Expected signals: command exits 0. `.response` contains at least two `https://` URLs. `.toolCalls` includes at least one entry whose `name` is `google_web_search`. The answer names plausible current major versions for both Bun and Deno
- Desired user-visible outcome: PASS verdict + a 2-3 sentence comparison + the cited URLs
- Pass/fail: PASS if at least two HTTPS URLs appear in `.response` AND `google_web_search` is recorded in `.toolCalls` AND the comparison names plausible current versions. FAIL if URL count < 2, no web search fired or the answer is obviously generic / training-data-shaped

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the request as "verify @deep-research routes to web-grounded research and cites real URLs".
2. Stay local. This is a direct CLI dispatch with Gemini-internal agent routing.
3. Use `-o json` so the tool-call envelope is machine-checkable rather than relying on the natural-language answer alone.
4. Treat absence of HTTPS URLs in `.response` as a hard fail even if `google_web_search` fired, research without citations is not actionable.
5. Surface the comparison answer + cited URLs in the verdict so the operator can sanity-check against current public information.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CG-012 | @deep-research agent | Confirm `As @deep-research agent:` returns a citation-backed comparison and `google_web_search` is recorded in `.toolCalls` | `As a cross-AI orchestrator delegating a fresh-evidence research task, dispatch the @deep-research agent against the cli-gemini skill in this repository to compare the current Bun and Deno runtime major versions. Verify the response includes at least two HTTPS source URLs and that the JSON toolCalls array records at least one google_web_search invocation. Return a concise pass/fail verdict with the main reason, the comparison answer, and the cited URLs.` | 1. `bash: gemini "As @deep-research agent: Use google_web_search to find the current major version numbers of Bun and Deno as of today. Compare them in 2-3 sentences and include at least one official source URL per runtime." -m gemini-3.1-pro-preview -o json 2>&1 > /tmp/cg-012.json; echo EXIT=$?` -> 2. `bash: jq -r '.response' /tmp/cg-012.json` -> 3. `bash: jq -r '.toolCalls[] | .name' /tmp/cg-012.json | sort -u` -> 4. `bash: jq -r '.response' /tmp/cg-012.json | grep -oE 'https?://[^[:space:]]+' | sort -u | wc -l` | Step 1: `EXIT=0`; Step 2: prints a 2-3 sentence comparison naming both runtimes; Step 3: includes `google_web_search`; Step 4: distinct URL count >= 2 | `/tmp/cg-012.json` saved + outputs from Steps 2, 3, and 4 | PASS if Step 3 includes `google_web_search` AND Step 4 reports >= 2 distinct URLs AND Step 2 names plausible current versions; FAIL if any of those checks miss | 1. If `google_web_search` is absent from `.toolCalls`, re-run with explicit `Use the google_web_search tool first`; 2. If URL count < 2, re-run with `Cite official release notes URLs for both runtimes`; 3. If the answer reads as generic training-data text, the agent may have ignored the routing prefix — verify the agent name spelling and Gemini CLI version |

### Optional Supplemental Checks

If `.stats.toolCallCount` is suspiciously low (e.g. 0 or 1), the agent likely answered from training data. Treat that as a soft warning even if the URL grep happens to pass.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../SKILL.md` | cli-gemini skill surface (agent routing table in §3 HOW IT WORKS) |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/agent_delegation.md` | §3 AGENT CATALOG → @deep-research (Unique capability: google_web_search) |
| `../../references/gemini_tools.md` | §2 UNIQUE TOOLS → google_web_search (the underlying tool) |

---

## 5. SOURCE METADATA

- Group: Agent Routing
- Playbook ID: CG-012
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `04--agent-routing/003-deep-research-agent-grounding.md`
