---
title: "BDG-018 -- Page-context isolation cross-instance"
description: "This scenario validates cookie/storage isolation between `chrome_devtools_1` and `chrome_devtools_2` for `BDG-018`. It focuses on confirming a cookie set in instance 1 does not appear in instance 2."
---

# BDG-018 -- Page-context isolation cross-instance

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `BDG-018`.

---

## 1. OVERVIEW

This scenario validates cross-instance state isolation for `BDG-018`. It focuses on confirming that a cookie set inside `chrome_devtools_1` is visible only to instance 1 and is absent from `chrome_devtools_2` — the canonical proof that the two instances are genuinely independent browser profiles, not shared sessions. This depends on CM-014..CM-016 for the via-Code-Mode pattern.

### Why This Matters

Cross-instance isolation is the core security and correctness contract for parallel browsers: the entire reason for two instances is to run independent sessions (e.g., logged in as user A on instance 1, user B on instance 2). If a cookie set in one instance leaks to the other, every authenticated parallel workflow is broken — sessions cross-contaminate, tests interfere with each other, and credentials become unsafe. This is the most important MCP-parallel scenario after the basic round-trip in BDG-014.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `BDG-018` and confirm the expected signals without contradictory evidence.

- Objective: Verify a cookie `bdg_test=BDG-018` set in `chrome_devtools_1` appears in `chrome_devtools_1`'s `getCookies` output and does NOT appear in `chrome_devtools_2`'s `getCookies` output.
- Real user request: `"Confirm that cookies set in one MCP browser don't leak to the other one."`
- Prompt: `As a manual-testing orchestrator, set a cookie in chrome_devtools_1 then check it does NOT appear in chrome_devtools_2 through Code Mode against both MCP instances. Verify cookie isolation. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: navigate both instances to the same origin; set cookie in instance 1 via `dom eval`; call `getCookies` on both; assert cookie present in 1, absent in 2.
- Expected signals: cookie set succeeds in instance 1; `getCookies` on instance 1 includes `bdg_test`; `getCookies` on instance 2 does NOT include `bdg_test`.
- Desired user-visible outcome: A short report listing the cookie name in instance 1, "absent in instance 2", and "ISOLATION CONFIRMED" with a PASS verdict.
- Pass/fail: PASS if all three signals hold; FAIL if the cookie set fails, instance 1 doesn't see the cookie, or instance 2 sees it (isolation broken).

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, set a cookie in chrome_devtools_1 then check it does NOT appear in chrome_devtools_2 through Code Mode against both MCP instances. Verify cookie isolation. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. Precondition: both `chrome_devtools_1` and `chrome_devtools_2` registered (cross-reference BDG-014, BDG-015)
2. Code Mode script — build and dispatch via `call_tool_chain`:
   ```ts
   await chrome_devtools_1.chrome_devtools_1_navigate_page({ url: 'https://example.com' });
   await chrome_devtools_2.chrome_devtools_2_navigate_page({ url: 'https://example.com' });
   await chrome_devtools_1.chrome_devtools_1_evaluate_script({
     script: "document.cookie = 'bdg_test=BDG-018; path=/'"
   });
   const c1 = await chrome_devtools_1.chrome_devtools_1_get_cookies({});
   const c2 = await chrome_devtools_2.chrome_devtools_2_get_cookies({});
   const has = (cs: any) => JSON.stringify(cs).includes('bdg_test');
   return { in1: has(c1), in2: has(c2) };
   ```
3. Assert: `in1 === true` AND `in2 === false`

### Expected

- Step 2: returns `{ in1, in2 }`
- Step 3: `in1` is `true` AND `in2` is `false`

### Evidence

Capture the Code Mode script, returned object, and explicit boolean values for both instances.

### Pass / Fail

- **Pass**: cookie set succeeds AND `in1 === true` AND `in2 === false`.
- **Fail**: cookie set throws (cross-reference BDG-014 single-instance baseline); `in1 === false` (cookie didn't persist within instance 1); `in2 === true` (ISOLATION BROKEN — both instances share storage).

### Failure Triage

1. If `in2 === true`: ISOLATION BROKEN. Confirm `chrome_devtools_2` is configured with a distinct user-data-dir / profile path in `.utcp_config.json` — both instances cannot share the same Chrome profile directory. Cross-reference CM-014 (Chrome via CM) for the canonical separated-profile config.
2. If `in1 === false` despite a clean set: cookies set via `document.cookie` may not persist across the round-trip if the page is `about:blank` or has a `data:` scheme — confirm the navigation to `https://example.com` actually completed by adding a `console.log(location.href)` eval before the cookie set; cross-reference BDG-009 for the eval contract.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `.opencode/skill/mcp-code-mode/manual_testing_playbook/manual_testing_playbook.md` | CM playbook (CM-014..CM-016 Chrome via CM) |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-chrome-devtools/SKILL.md` | get_cookies / evaluate_script reference |
| `.opencode/skill/mcp-code-mode/SKILL.md` | Code Mode invocation contract |

---

## 5. SOURCE METADATA

- Group: MCP PARALLEL INSTANCES
- Playbook ID: BDG-018
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--mcp-parallel-instances/005-page-context-isolation.md`
