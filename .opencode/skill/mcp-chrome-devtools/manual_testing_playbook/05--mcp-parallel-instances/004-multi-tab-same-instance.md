---
title: "BDG-017 -- Multi-tab same instance"
description: "This scenario validates `new_page` for `BDG-017`. It focuses on confirming additional pages can be opened within a single `chrome_devtools_1` instance and switched between via `select_page`."
---

# BDG-017 -- Multi-tab same instance

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `BDG-017`.

---

## 1. OVERVIEW

This scenario validates `new_page` for `BDG-017`. It focuses on confirming an operator can open an additional page (beyond the initial one) inside `chrome_devtools_1`, that a list-pages call shows >= 2 pages, and that `select_page` works for both. This depends on CM-014..CM-016 (Chrome via Code Mode patterns).

### Why This Matters

`new_page` is how operators model multi-tab user flows (e.g., "open the product page in tab 1, the cart in tab 2") inside a single MCP instance, avoiding the cost of provisioning a second instance. If `new_page` only sometimes returns an ID, or if listing pages drops the new entry, every multi-tab workflow becomes unreliable. BDG-016 validated close + select; this scenario isolates the additive (open new) contract.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `BDG-017` and confirm the expected signals without contradictory evidence.

- Objective: Verify `new_page` returns a new page ID; the page list shows >= 2 pages; `select_page` succeeds for both IDs.
- Real user request: `"Open a new tab in the same browser instance and confirm both tabs are reachable."`
- Prompt: `As a manual-testing orchestrator, open a new page in chrome_devtools_1 (additional to the initial page) through Code Mode against the chrome_devtools_1 MCP instance. Verify both pages are accessible via select_page. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: navigate first page; call `new_page` for second; list pages; switch via `select_page` for both IDs.
- Expected signals: `new_page` returns success with non-empty ID; list-pages output length >= 2; both `select_page` calls succeed.
- Desired user-visible outcome: A short report listing both page IDs, the page count, and "both pages reachable" with a PASS verdict.
- Pass/fail: PASS if all three signals hold; FAIL if `new_page` throws, list shows < 2 pages, or `select_page` throws for either ID.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, open a new page in chrome_devtools_1 (additional to the initial page) through Code Mode against the chrome_devtools_1 MCP instance. Verify both pages are accessible via select_page. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. Precondition: `chrome_devtools_1` registered (cross-reference BDG-014)
2. Code Mode script — build and dispatch via `call_tool_chain`:
   ```ts
   const p1 = await chrome_devtools_1.chrome_devtools_1_navigate_page({ url: 'https://example.com' });
   const p2 = await chrome_devtools_1.chrome_devtools_1_new_page({ url: 'https://example.org' });
   const id1 = (p1 as any)?.pageId ?? (p1 as any)?.id;
   const id2 = (p2 as any)?.pageId ?? (p2 as any)?.id;
   const list = await chrome_devtools_1.chrome_devtools_1_list_pages({});
   const pageCount = Array.isArray(list) ? list.length : (list?.pages?.length ?? 0);
   const sel1 = await chrome_devtools_1.chrome_devtools_1_select_page({ pageId: id1 });
   const sel2 = await chrome_devtools_1.chrome_devtools_1_select_page({ pageId: id2 });
   return { id1, id2, pageCount, sel1: !!sel1, sel2: !!sel2 };
   ```
3. Assert: both IDs distinct; `pageCount >= 2`; both `sel1` and `sel2` truthy

### Expected

- Step 2: returns `{ id1, id2, pageCount, sel1, sel2 }`
- Step 3: `pageCount >= 2` AND both selects truthy

### Evidence

Capture the Code Mode script, returned object, and the resolved page count.

### Pass / Fail

- **Pass**: distinct IDs allocated AND `pageCount >= 2` AND both `select_page` calls succeed.
- **Fail**: `new_page` throws (cross-reference CM-014); list shows only 1 page (the new page wasn't persisted to the instance's tab list); either `select_page` throws.

### Failure Triage

1. If `new_page` succeeds but the list shows only 1 page: the instance may be returning the active-tab list rather than all tabs — dump full result with `console.log(JSON.stringify(list))` and check for nested arrays; cross-reference CM-016 for the canonical multi-page response shape.
2. If `select_page` throws for the new ID despite a clean `new_page` return: confirm the ID extraction path matches what `new_page` actually returned (the field can be `pageId`, `id`, `data.id`, or `data.pageId`); cross-reference BDG-016 (close + select) for the canonical ID handling.

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
| `.opencode/skill/mcp-chrome-devtools/SKILL.md` | new_page / list_pages / select_page reference |
| `.opencode/skill/mcp-code-mode/SKILL.md` | Code Mode invocation contract |

---

## 5. SOURCE METADATA

- Group: MCP PARALLEL INSTANCES
- Playbook ID: BDG-017
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--mcp-parallel-instances/004-multi-tab-same-instance.md`
