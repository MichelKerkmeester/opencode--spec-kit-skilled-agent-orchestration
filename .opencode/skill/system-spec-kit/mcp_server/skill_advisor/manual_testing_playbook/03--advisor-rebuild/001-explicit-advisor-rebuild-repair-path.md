---
title: "SAD-004 -- Explicit Advisor Rebuild Repair Path"
description: "Canonical manual scenario validating that advisor_rebuild is the explicit repair path while advisor_status remains diagnostic-only."
---

# SAD-004 -- Explicit Advisor Rebuild Repair Path

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SAD-004`.

---

## 1. OVERVIEW

This scenario validates the explicit `advisor_rebuild` repair workflow. It confirms that `advisor_status` reports state without hidden repair side effects and that `advisor_rebuild` repairs stale or absent state only when explicitly called.

### Why This Matters

Hidden rebuilds make operator evidence hard to trust. The advisor must keep diagnostics separate from repair so release validation and runtime hooks can explain what happened.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SAD-004` and confirm the expected signals without contradictory evidence.

- Objective: Confirm diagnostic-only status and explicit rebuild behavior.
- Real user request: `The Skill Advisor says freshness is stale. Rebuild the advisor index and prove status does not repair it implicitly.`
- RCAF Prompt:
  - Role: Skill Advisor operator validating rebuild semantics.
  - Context: A disposable workspace copy can be made and the MCP server build is current.
  - Action: Produce stale or absent advisor state, call `advisor_status` twice, call `advisor_rebuild`, inspect before/after freshness and generation fields, then verify live rebuild skips unless `force:true` is supplied.
  - Format: Return `PASS` or `FAIL` with before/status/after JSON excerpts and cleanup evidence.
- Expected execution process: Operator creates a disposable workspace, reproduces stale or absent state, captures status responses before repair, calls rebuild explicitly, and confirms post-rebuild freshness.
- Expected signals: Two pre-rebuild `advisor_status` responses do not advance generation. `advisor_rebuild` reports `rebuilt: true` when repair is needed. A live non-forced rebuild reports `skipped: true` and `reason: "status-live"`. A forced rebuild reports `reason: "force"`.
- Desired user-visible outcome: A short verdict proving repair was explicit and state changed only after `advisor_rebuild`.
- Pass/fail: PASS if status is diagnostic-only, explicit rebuild repairs state, live skip behavior is present, and cleanup occurs. FAIL if status repairs implicitly, rebuild output omits before/after evidence, or cleanup is skipped.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Create a disposable workspace copy under `/tmp`.
2. Build the MCP server in the copy.
3. Produce stale or absent state.
4. Capture two `advisor_status` responses before rebuild.
5. Call `advisor_rebuild`, then `advisor_status`.
6. Check live skip and forced rebuild behavior.
7. Remove the disposable workspace.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SAD-004 | Explicit advisor_rebuild repair path | Confirm status is diagnostic-only and rebuild is explicit | `Role: Skill Advisor operator. Context: disposable workspace copy and current MCP server build. Action: produce stale or absent advisor state, call advisor_status twice, call advisor_rebuild, inspect before/after freshness and generation fields, then verify live rebuild skips unless force:true is supplied. Format: return PASS or FAIL with before/status/after JSON excerpts and cleanup evidence.` | 1. `bash: WORK="/tmp/skill-advisor-sad-004-$(date +%s)"` -> 2. `bash: rsync -a --exclude node_modules --exclude .git ./ "$WORK/"` -> 3. `bash: npm --prefix "$WORK/.opencode/skill/system-spec-kit/mcp_server" run build` -> 4. `advisor_status({"workspaceRoot":"$WORK"})` -> 5. `advisor_status({"workspaceRoot":"$WORK"})` -> 6. `advisor_rebuild({"workspaceRoot":"$WORK"})` -> 7. `advisor_status({"workspaceRoot":"$WORK"})` -> 8. `advisor_rebuild({"workspaceRoot":"$WORK"})` -> 9. `advisor_rebuild({"workspaceRoot":"$WORK","force":true})` -> 10. `bash: rm -rf "$WORK"` | Status responses do not repair state; rebuild output includes before/after freshness and generation fields; live rebuild skips with `reason: "status-live"`; forced rebuild returns `reason: "force"` | Captured JSON for each MCP call, workspace path, build transcript, and cleanup transcript | PASS if status has no repair side effect, rebuild repairs explicitly, live skip and force behavior match contract, and cleanup runs; FAIL otherwise | 1. Confirm disposable workspace path is passed literally to MCP calls; 2. Check `handlers/advisor-rebuild.ts`; 3. Check `handlers/advisor-status.ts`; 4. Re-run automated rebuild tests; 5. Inspect source-signature freshness state |

### Optional Supplemental Checks

Replace the copied skill graph artifact with invalid bytes and verify `advisor_status` remains diagnostic while `advisor_rebuild` is the repair path.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/06--mcp-surface/05-advisor-rebuild.md` | Feature-catalog source for explicit rebuild behavior |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../handlers/advisor-status.ts` | Diagnostic-only status handler |
| `../../handlers/advisor-rebuild.ts` | Explicit rebuild handler |
| `../../schemas/advisor-tool-schemas.ts` | Tool input/output schema |
| `../../../tests/advisor-rebuild.vitest.ts` | Automated rebuild coverage |
| `../../../tests/tool-input-schema.vitest.ts` | Tool schema coverage |

---

## 5. SOURCE METADATA

- Group: Advisor Rebuild
- Playbook ID: SAD-004
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--advisor-rebuild/001-explicit-advisor-rebuild-repair-path.md`
