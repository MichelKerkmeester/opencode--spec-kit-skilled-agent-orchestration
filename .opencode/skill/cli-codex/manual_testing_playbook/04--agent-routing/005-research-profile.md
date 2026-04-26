---
title: "CX-026 -- @research profile (web-grounded investigation)"
description: "This scenario validates the codex exec -p research profile for `CX-026`. It focuses on confirming the research profile combines `--search` web grounding with a comparative trade-off analysis."
---

# CX-026 -- @research profile (web-grounded investigation)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CX-026`.

---

## 1. OVERVIEW

This scenario validates the `codex exec -p research` profile for `CX-026`. It focuses on confirming the `research` profile pairs the documented web-search capability (`--search`) with a structured comparative analysis that surfaces at least 2 candidates across at least 3 trade-off dimensions and ends with a recommendation.

### Why This Matters

`agent_delegation.md` §3 defines the `research` profile as the technical investigator with live web access. The unique value of routing through the research profile (instead of `@context` or `@review`) is the combination of `--search` plus structured comparative analysis. If the research profile collapses to a one-sided pitch or skips the web-search call, the evidence-backed-decision contract for cross-AI Codex dispatches is broken and downstream architecture decisions lose their citation trail.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CX-026` and confirm the expected signals without contradictory evidence.

- Objective: Verify `codex exec -p research --search` returns a citation-backed comparative analysis covering at least 2 candidates across at least 3 trade-off dimensions with a recommendation, AND the response cites at least one HTTPS URL as evidence.
- Real user request: `Use Codex with web search to compare the latest Bun and Deno major releases for our backend. Cite sources, end with a recommendation.`
- Prompt: `As a cross-AI orchestrator delegating an evidence-backed investigation, dispatch codex exec -p research --search --model gpt-5.5 -c model_reasoning_effort="high" -c service_tier="fast" --sandbox read-only "Compare current Bun and Deno major releases across runtime performance, package ecosystem, and operational stability. Cite at least one HTTPS source URL per candidate. End with a recommendation plus rationale." Verify the dispatch routes via -p research, cites at least 2 HTTPS URLs, names both candidates with explicit pros and cons, and ends with a recommendation. Return a verdict naming the cited URLs, the trade-off dimensions covered, and the recommendation.`
- Expected execution process: Cross-AI orchestrator dispatches `-p research --search` with a comparative prompt, captures stdout, then validates the response covers >= 2 candidates, >= 3 dimensions, includes >= 2 HTTPS URLs and ends with a recommendation.
- Expected signals: `codex exec -p research --search` exits 0. Stdout names both candidates explicitly. >= 3 trade-off dimensions covered. >= 2 distinct HTTPS URLs cited. Explicit recommendation surfaces in the response. Dispatched command line includes both `-p research` and `--search`.
- Desired user-visible outcome: A citation-backed comparison brief the operator can paste into an architecture-decision-record entry.
- Pass/fail: PASS if exit 0 AND response covers >= 2 candidates across >= 3 dimensions AND cites >= 2 HTTPS URLs AND ends with a recommendation AND dispatch line includes both flags. FAIL if any check misses.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Dispatch `-p research --search` with the comparative prompt.
2. Capture stdout to a temp file.
3. Verify the response covers both candidates and >= 3 dimensions.
4. Verify >= 2 HTTPS URLs are cited.
5. Verify a recommendation is present.
6. Confirm dispatched command line includes both `-p research` and `--search`.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CX-026 | @research profile (web-grounded investigation) | Verify -p research --search returns a citation-backed comparative analysis with a recommendation | `As a cross-AI orchestrator delegating an evidence-backed investigation, dispatch codex exec -p research --search --model gpt-5.5 -c model_reasoning_effort="high" -c service_tier="fast" --sandbox read-only "Compare current Bun and Deno major releases across runtime performance, package ecosystem, and operational stability. Cite at least one HTTPS source URL per candidate. End with a recommendation plus rationale." Verify the dispatch routes via -p research, cites at least 2 HTTPS URLs, names both candidates with explicit pros and cons, and ends with a recommendation. Return a verdict naming the cited URLs, the trade-off dimensions covered, and the recommendation.` | 1. `codex exec -p research --search --model gpt-5.5 -c model_reasoning_effort="high" -c service_tier="fast" --sandbox read-only "Compare current Bun and Deno major releases across runtime performance, package ecosystem, and operational stability. Cite at least one HTTPS source URL per candidate. End with a recommendation plus rationale." </dev/null > /tmp/cli-codex-cx026.txt 2>&1` -> 2. `bash: echo "Exit: $?"` -> 3. `bash: grep -ciE '(bun\|deno)' /tmp/cli-codex-cx026.txt` -> 4. `bash: grep -ciE '(performance\|ecosystem\|stability)' /tmp/cli-codex-cx026.txt` -> 5. `bash: grep -oE 'https://[a-zA-Z0-9./_-]+' /tmp/cli-codex-cx026.txt \| sort -u \| wc -l \| tr -d ' '` -> 6. `bash: grep -ciE '(recommend\|recommendation)' /tmp/cli-codex-cx026.txt` | Step 1: dispatch captured; Step 2: exit 0; Step 3: count of candidate mentions >= 4 (each candidate >= 2 times); Step 4: count of dimension mentions >= 3; Step 5: distinct HTTPS URL count >= 2; Step 6: recommendation count >= 1 | `/tmp/cli-codex-cx026.txt`, terminal exit code, grep counts, URL count | PASS if exit 0 AND >= 2 candidates AND >= 3 dimensions AND >= 2 HTTPS URLs AND recommendation present AND `-p research` plus `--search` in dispatch; FAIL if any check misses | (1) Define `[profiles.research]` in config.toml if missing per agent_delegation.md §3 (sandbox_mode = "workspace-write" but the profile here uses --sandbox read-only as the override); (2) re-run after `codex login` if rate limits or auth errors surface; (3) if URL count is 0, --search may not have engaged, capture stderr and check for `--search` recognition |

### Optional Supplemental Checks

For deeper validation, add `-c model_reasoning_effort="xhigh"` and re-dispatch with the same prompt. The xhigh response should cite at least as many URLs as the high response and surface more nuanced trade-offs per dimension.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../references/agent_delegation.md` (§3 @research) | Documents the research profile contract |
| `../../references/codex_tools.md` | `--search` capability documentation |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/agent_delegation.md` | §3 @research, Technical Investigator |
| `.codex/config.toml` (or `~/.codex/config.toml`) | `[profiles.research]` section |

---

## 5. SOURCE METADATA

- Group: Agent Routing
- Playbook ID: CX-026
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `04--agent-routing/005-research-profile.md`
