---
title: "INT-003 -- Session recovery surfaces include CocoIndex availability status"
description: "This scenario validates that session_bootstrap and session_resume expose CocoIndex availability in the integrated recovery flow."
---

# INT-003 -- Session recovery surfaces include CocoIndex availability status

## 1. OVERVIEW

This scenario validates that the integrated recovery flow exposes CocoIndex availability correctly. `session_bootstrap` is the canonical first-call recovery surface and should carry CocoIndex status inside `resume`. `session_resume` remains the detailed follow-up surface and should still expose the direct `cocoIndex` field alongside memory context and code graph status.

---

## 2. CURRENT REALITY

- Objective: Verify that `session_bootstrap` exposes CocoIndex status through `resume.cocoIndex`, that `session_resume` still exposes the direct `cocoIndex` field, and that both surfaces degrade gracefully when the CocoIndex binary is unavailable. `available` reflects whether the `ccc` binary exists at the expected install path, not whether the daemon is currently running. The `binaryPath` must point to the expected `ccc` binary location.
- Prompt: `Call session_bootstrap and session_resume, then examine the CocoIndex status fields. Capture the evidence needed to prove: (1) session_bootstrap.resume.cocoIndex contains available boolean and binaryPath, (2) session_resume.cocoIndex contains available boolean and binaryPath, (3) when the CocoIndex binary is installed at the expected path, available=true on both surfaces, (4) in an environment where the binary is absent, both calls still succeed with available=false, and (5) session_bootstrap also surfaces structuralContext for the first-call recovery path. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: `session_bootstrap.resume.cocoIndex.available` and `session_resume.cocoIndex.available` match binary presence on disk; both `binaryPath` values are non-empty strings; `session_bootstrap` includes `structuralContext`; both calls complete without error regardless of binary availability
- Pass/fail: PASS if both recovery surfaces expose the expected CocoIndex fields with correct types and availability matches binary presence; FAIL if either field is missing, wrong type, or either recovery call crashes when the binary is unavailable


---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| INT-003a | Session bootstrap CocoIndex status | Canonical first-call recovery includes CocoIndex status | `Call session_bootstrap with CocoIndex installed` | 1. `test -x .opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc` 2. `session_bootstrap({})` via MCP | `resume.cocoIndex.available === true`, `resume.cocoIndex.binaryPath` is non-empty, `structuralContext` present | session_bootstrap response JSON resume.cocoIndex + structuralContext | PASS if bootstrap exposes cocoIndex and structuralContext correctly; FAIL if either field is missing while the binary is present | Check session-bootstrap.ts + session-resume.ts integration and session-snapshot contract |
| INT-003b | Session resume CocoIndex status | Detailed recovery surface preserves direct CocoIndex field | `Call session_resume with CocoIndex installed` | 1. `test -x .opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc` 2. `session_resume({})` via MCP | `cocoIndex.available === true`, `binaryPath` is non-empty string | session_resume response JSON cocoIndex field | PASS if direct resume surface still exposes cocoIndex fields; FAIL if fields are missing while the binary is present | Check ccc binary path handling in session-resume.ts and `cocoindex-path.ts` |
| INT-003c | Recovery surfaces degrade gracefully without CocoIndex | Bootstrap and resume succeed when CocoIndex binary is absent | 1. Run in a disposable environment where `.opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc` is absent 2. `session_bootstrap({})` via MCP 3. `session_resume({})` via MCP | Both responses succeed; availability fields become `false`; hints may include recovery/install guidance | session_bootstrap + session_resume response JSON showing graceful degradation | PASS if both calls succeed with `available=false`; FAIL if either call throws or the availability field is missing | Check error handling in the CocoIndex availability probe plus `cocoindex-path.ts` |


---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)


---

## 5. SOURCE METADATA

- Group: Code Graph Integration
- Playbook ID: INT-003
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `07--code-graph-integration/003-session-resume-includes-cocoindex.md`
