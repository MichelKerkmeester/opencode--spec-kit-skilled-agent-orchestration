---
title: "263 -- Session resume merges memory, graph, and CocoIndex"
description: "This scenario validates Session resume tool for 263. It focuses on verifying session_resume returns a merged result from all three subsystems."
---

# 263 -- Session resume merges memory, graph, and CocoIndex

## 1. OVERVIEW

This scenario validates Session resume tool (session_resume).

---

## 2. CURRENT REALITY

- **Objective**: Verify that session_resume performs three sub-calls (memory_context resume, code graph status, CocoIndex availability) and merges results into a single SessionResumeResult. Each sub-call failure must be captured as an error entry with recovery hints rather than failing the entire call. The response must include memory (resume context), codeGraph (status/ok/empty/error with counts), cocoIndex (available boolean with binary path), and hints array.
- **Prerequisites**:
  - MCP server running and accessible
  - At least one memory saved (for resume context)
  - Code graph database present (even if empty)
- **Prompt**: `Validate 263 Session resume. Call session_resume and confirm: (1) memory field contains resume context from memory_context, (2) codeGraph field has status (ok/empty/error), nodeCount, edgeCount, fileCount, lastScan, (3) cocoIndex field has available boolean and binaryPath, (4) hints array includes guidance when any subsystem is degraded.`
- **Expected signals**:
  - memory field is non-empty object (or error with recovery hint)
  - codeGraph.status is 'ok' or 'empty', counts are non-negative integers
  - cocoIndex.available is boolean, binaryPath is string
  - hints array present (may be empty if all subsystems healthy)
- **Pass/fail criteria**:
  - PASS: All three subsystem results present in response, failures captured as error entries not exceptions
  - FAIL: Missing subsystem in response, unhandled exception from sub-call, or missing type fields

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 263a | Session resume tool | Memory resume sub-call returns context | `Validate 263a memory resume` | Call `session_resume({})` via MCP | memory field is non-empty object with resume data or error + hint | session_resume response JSON memory field | PASS if memory field present with data or graceful error | Check handleMemoryContext() with mode=resume in session-resume.ts |
| 263b | Session resume tool | Code graph status sub-call returns counts | `Validate 263b code graph status` | Call `session_resume({})` via MCP | codeGraph.status in [ok, empty, error], nodeCount/edgeCount/fileCount are integers >= 0 | session_resume response JSON codeGraph field | PASS if codeGraph field has all required fields with valid types | Check graphDb.getStats() and code-graph-db.ts query |
| 263c | Session resume tool | CocoIndex availability check | `Validate 263c cocoindex status` | Call `session_resume({})` via MCP | cocoIndex.available is boolean, binaryPath is string | session_resume response JSON cocoIndex field | PASS if cocoIndex fields present with correct types | Check ccc binary path resolution in session-resume.ts |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation-and-code-graph/18-session-resume-tool.md](../../feature_catalog/22--context-preservation-and-code-graph/18-session-resume-tool.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 263
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation-and-code-graph/263-session-resume.md`
