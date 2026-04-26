---
title: "BDG-015 -- Dual-instance parallel"
description: "This scenario validates parallel execution across `chrome_devtools_1` and `chrome_devtools_2` for `BDG-015`. It focuses on confirming `Promise.all` returns both navigate+screenshot results faster than sequential execution."
---

# BDG-015 -- Dual-instance parallel

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `BDG-015`.

---

## 1. OVERVIEW

This scenario validates parallel execution across two MCP browser instances (`chrome_devtools_1` and `chrome_devtools_2`) for `BDG-015`. It focuses on confirming `Promise.all` over both instances returns an array of length 2, both screenshots are valid PNG-sized base64 payloads, and the total wall time is meaningfully less than 2× a single-instance run (parallelism observable). This scenario depends on CM-012 (Promise.all parallel pattern) and CM-014..CM-016 (Chrome via Code Mode).

### Why This Matters

Dual-instance parallel is the value proposition of having two MCP browser instances at all: if it doesn't actually run in parallel (e.g., the MCP transport serializes calls), there's no point provisioning the second instance. Verifying observable parallelism — not just "both calls returned" — is the contract that justifies the doubled MCP cost.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BDG-015` and confirm the expected signals without contradictory evidence.

- Objective: Verify `Promise.all([navigate+shot on _1, navigate+shot on _2])` returns an array of length 2 with both shot byte lengths > 1000, and total wall time < 2× single-instance baseline.
- Real user request: `"Open example.com on one browser and example.org on another at the same time and screenshot both."`
- Prompt: `As a manual-testing orchestrator, navigate chrome_devtools_1 to https://example.com and chrome_devtools_2 to https://example.org in parallel via Promise.all through Code Mode against both MCP instances. Verify both return successfully and total wall time < 2x single-instance time. Cross-reference: depends on CM-012 (Promise.all parallel). Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: build a Code Mode script that runs both navigate+screenshot pairs inside `Promise.all`, measure wall time, assert array shape and byte lengths.
- Expected signals: result is array of length 2; both shot byte lengths > 1000; wall time < 2× the prior single-instance run from BDG-014.
- Desired user-visible outcome: A short report quoting both URLs, both byte lengths, total wall time, and a comparison vs. single-instance baseline with a PASS verdict.
- Pass/fail: PASS if all three signals hold; FAIL if one branch throws, either screenshot is empty/short, or wall time is roughly 2× the single-instance baseline (no observable parallelism).

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, navigate chrome_devtools_1 to https://example.com and chrome_devtools_2 to https://example.org in parallel via Promise.all through Code Mode against both MCP instances. Verify both return successfully and total wall time < 2x single-instance time. Cross-reference: depends on CM-012 (Promise.all parallel). Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. Precondition: both `chrome_devtools_1` and `chrome_devtools_2` are registered; verify with `bash: jq '.manuals | keys' .utcp_config.json | grep chrome_devtools_`
2. Precondition: BDG-014 single-instance baseline has been recorded (call it `T1`)
3. Code Mode script — build and dispatch via `call_tool_chain`:
   ```ts
   const t0 = Date.now();
   const [r1, r2] = await Promise.all([
     (async () => {
       await chrome_devtools_1.chrome_devtools_1_navigate_page({ url: 'https://example.com' });
       return chrome_devtools_1.chrome_devtools_1_take_screenshot({});
     })(),
     (async () => {
       await chrome_devtools_2.chrome_devtools_2_navigate_page({ url: 'https://example.org' });
       return chrome_devtools_2.chrome_devtools_2_take_screenshot({});
     })(),
   ]);
   return {
     wallMs: Date.now() - t0,
     len1: (r1?.data ?? r1)?.length ?? 0,
     len2: (r2?.data ?? r2)?.length ?? 0,
   };
   ```
4. Assert: array shape, both lengths > 1000, `wallMs < 2 * T1`

### Expected

- Step 1: both manuals registered
- Step 3: returns `{ wallMs, len1, len2 }` with both lengths > 1000
- Step 4: `wallMs` clearly less than `2 * T1` (parallelism observable)

### Evidence

Capture the Code Mode script, the returned object, single-instance baseline `T1`, and the parallel `wallMs`.

### Pass / Fail

- **Pass**: array length 2 AND both byte lengths > 1000 AND `wallMs < 2 * T1`.
- **Fail**: one branch throws (cross-reference CM-005 namespace contract); either length too small (cross-reference BDG-014 / CM-015); `wallMs` is approximately `2 * T1` (no parallelism — likely transport serialization or shared resource).

### Failure Triage

1. If one branch throws "manual not found" for `chrome_devtools_2`: the second MCP is not registered — cross-reference CM-005 (manual-namespace contract) and confirm `.utcp_config.json` includes `chrome_devtools_2` with a distinct port/profile from `chrome_devtools_1`.
2. If both calls succeed but `wallMs ~ 2 * T1`: the transport is serializing — cross-reference CM-012 (Promise.all parallel pattern) and confirm both manuals are configured with independent processes / sockets, not a shared bus.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `.opencode/skill/mcp-code-mode/manual_testing_playbook/manual_testing_playbook.md` | CM playbook (CM-012 parallel; CM-014..CM-016 Chrome via CM) |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-chrome-devtools/SKILL.md` | chrome_devtools_1/chrome_devtools_2 MCP reference |
| `.opencode/skill/mcp-code-mode/SKILL.md` | Code Mode parallel patterns |

---

## 5. SOURCE METADATA

- Group: MCP PARALLEL INSTANCES
- Playbook ID: BDG-015
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--mcp-parallel-instances/002-dual-instance-parallel.md`
