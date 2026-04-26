---
title: "BDG-016 -- Close + select page"
description: "This scenario validates page-level lifecycle operations for `BDG-016`. It focuses on confirming `close_page` and `select_page` correctly manage multiple pages within a single MCP instance."
---

# BDG-016 -- Close + select page

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `BDG-016`.

---

## 1. OVERVIEW

This scenario validates page-level lifecycle operations for `BDG-016`. It focuses on confirming that within `chrome_devtools_1`, an operator can open two pages, close the first, switch to the second via `select_page`, and successfully take a screenshot of the surviving page. This depends on the via-Code-Mode pattern from CM-014..CM-016.

### Why This Matters

Multi-page workflows are how operators run a "navigate / read / navigate again / compare" pattern without paying the cost of opening a fresh browser instance. If `close_page` leaves the instance in an unrecoverable state, or `select_page` fails to switch context, every multi-page workflow inside a single MCP instance breaks. This scenario is the lifecycle contract for in-instance page management; BDG-017 covers `new_page` and BDG-018 covers cross-instance isolation.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BDG-016` and confirm the expected signals without contradictory evidence.

- Objective: Verify two pages can be opened in `chrome_devtools_1`; `close_page` succeeds for the first; `select_page` succeeds for the second; and `take_screenshot` on the surviving page returns base64 of length > 1000.
- Real user request: `"Open two tabs in chrome_devtools_1, close the first one, and screenshot the second."`
- Prompt: `As a manual-testing orchestrator, open 2 pages in chrome_devtools_1, close the first, and confirm the second is still accessible through Code Mode against the chrome_devtools_1 MCP instance. Verify select_page can switch back to the surviving page. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: navigate first page; open second page via `new_page`; close first via `close_page`; select second via `select_page`; screenshot.
- Expected signals: 2 page IDs allocated; close returns success for the first ID; select returns success for the second ID; screenshot returns base64 length > 1000.
- Desired user-visible outcome: A short report listing both page IDs, the closed page, and the surviving screenshot byte length with a PASS verdict.
- Pass/fail: PASS if all four signals hold; FAIL if any step throws or the surviving screenshot returns empty/short payload.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, open 2 pages in chrome_devtools_1, close the first, and confirm the second is still accessible through Code Mode against the chrome_devtools_1 MCP instance. Verify select_page can switch back to the surviving page. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. Precondition: `chrome_devtools_1` registered (cross-reference BDG-014); BDG-014 has passed (single-instance round-trip works)
2. Code Mode script — build and dispatch via `call_tool_chain`:
   ```ts
   const p1 = await chrome_devtools_1.chrome_devtools_1_navigate_page({ url: 'https://example.com' });
   const p2 = await chrome_devtools_1.chrome_devtools_1_new_page({ url: 'https://example.org' });
   const id1 = (p1 as any)?.pageId ?? (p1 as any)?.id;
   const id2 = (p2 as any)?.pageId ?? (p2 as any)?.id;
   await chrome_devtools_1.chrome_devtools_1_close_page({ pageId: id1 });
   await chrome_devtools_1.chrome_devtools_1_select_page({ pageId: id2 });
   const shot = await chrome_devtools_1.chrome_devtools_1_take_screenshot({});
   return { id1, id2, shotLen: (shot?.data ?? shot)?.length ?? 0 };
   ```
3. Assert: both IDs distinct; `shotLen > 1000`

### Expected

- Step 2: both `id1` and `id2` are non-empty and distinct; close + select succeed without throwing
- Step 3: `shotLen > 1000`

### Evidence

Capture the Code Mode script, both page IDs, and the surviving screenshot byte length.

### Pass / Fail

- **Pass**: two distinct page IDs allocated AND close succeeds AND select succeeds AND `shotLen > 1000`.
- **Fail**: `new_page` or `close_page` throws (cross-reference CM-014 Chrome via CM); select fails; surviving screenshot returns short payload (page may have been closed by mistake — verify ID handling).

### Failure Triage

1. If `new_page` returns a result without a recognizable ID field: dump the raw result with `console.log(JSON.stringify(p2))` and update the ID extraction path; cross-reference CM-016 for the canonical multi-page response shape.
2. If `select_page` throws "page not found" for `id2`: confirm `id2` was actually persisted (sometimes `new_page` returns a wrapper with `data.id`); cross-reference CM-014 for the via-Code-Mode call shape and BDG-014 to confirm the single-instance baseline still passes.

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
| `.opencode/skill/mcp-chrome-devtools/SKILL.md` | new_page / close_page / select_page reference |
| `.opencode/skill/mcp-code-mode/SKILL.md` | Code Mode invocation contract |

---

## 5. SOURCE METADATA

- Group: MCP PARALLEL INSTANCES
- Playbook ID: BDG-016
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--mcp-parallel-instances/003-close-and-select-page.md`
