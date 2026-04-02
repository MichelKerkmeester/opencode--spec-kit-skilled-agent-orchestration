---
title: "263 -- Session resume returns detailed recovery state"
description: "This scenario validates Session resume tool for 263. It focuses on verifying session_resume returns a detailed merged recovery payload, including structural readiness hints."
---

# 263 -- Session resume returns detailed recovery state

## 1. OVERVIEW

This scenario validates the detailed Session resume tool (`session_resume`). It focuses on the lower-level merged payload returned by the direct resume surface, while the higher-level bootstrap/recovery guidance is documented separately.

---

## 2. CURRENT REALITY

- **Objective**: Verify that session_resume performs its recovery sub-calls (memory_context resume, code graph status, CocoIndex availability), appends the shared structural ready/stale/missing contract, and merges everything into a single SessionResumeResult. Each sub-call failure must be captured as an error entry with recovery hints rather than failing the entire call. The response must include memory (resume context), codeGraph (status/ok/empty/error with counts), cocoIndex (available boolean with binary path), structuralContext (`status`, `summary`, `recommendedAction`, `sourceSurface`, plus freshness guidance), and hints array.
- **Prerequisites**:
  - MCP server running and accessible
  - At least one memory saved (for resume context)
  - Code graph database present (even if empty)
- **Prompt**: `Validate 263 Session resume. Call session_resume and confirm: (1) memory field contains resume context from memory_context, (2) codeGraph field has status (ok/empty/error), nodeCount, edgeCount, fileCount, lastScan, (3) cocoIndex field has available boolean and binaryPath, (4) structuralContext reports ready/stale/missing correctly and includes summary, recommendedAction, and sourceSurface, and (5) hints array includes session_bootstrap guidance when structural context is degraded.`
- **Expected signals**:
  - memory field is non-empty object (or error with recovery hint)
  - codeGraph.status is 'ok' or 'empty', counts are non-negative integers
  - cocoIndex.available is boolean, binaryPath is string
  - structuralContext.status is one of `ready`, `stale`, `missing`
  - structuralContext.summary is a string, `recommendedAction` is a string, and `sourceSurface === "session_resume"`
  - hints array present (may be empty if all subsystems healthy; should point to `session_bootstrap` when structure is degraded)
- **Pass/fail criteria**:
  - PASS: All subsystem results and structuralContext fields are present in response, failures are captured as error entries not exceptions, and degraded structural states emit the expected bootstrap guidance
  - FAIL: Missing subsystem or structuralContext in response, unhandled exception from sub-call, or missing type fields

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 263a | Session resume tool | Memory resume sub-call returns context | `Validate 263a memory resume` | Call `session_resume({})` via MCP | memory field is non-empty object with resume data or error + hint | session_resume response JSON memory field | PASS if memory field present with data or graceful error | Check handleMemoryContext() with mode=resume in session-resume.ts |
| 263b | Session resume tool | Code graph status sub-call returns counts | `Validate 263b code graph status` | Call `session_resume({})` via MCP | codeGraph.status in [ok, empty, error], nodeCount/edgeCount/fileCount are integers >= 0 | session_resume response JSON codeGraph field | PASS if codeGraph field has all required fields with valid types | Check graphDb.getStats() and code-graph-db.ts query |
| 263c | Session resume tool | CocoIndex availability check | `Validate 263c cocoindex status` | Call `session_resume({})` via MCP | cocoIndex.available is boolean, binaryPath is string | session_resume response JSON cocoIndex field | PASS if cocoIndex fields present with correct types | Check `cocoindex-path.ts` plus the availability probe used by session-resume.ts |
| 263d | Session resume tool | Structural readiness and recovery hinting | `Validate 263d structural context` | Call `session_resume({})` via MCP in both healthy and degraded graph states | structuralContext.status in [ready, stale, missing]; structuralContext.summary/recommendedAction/sourceSurface present; degraded states mention session_bootstrap in hints | session_resume response JSON structuralContext + hints | PASS if structural contract fields are surfaced and degraded states recommend session_bootstrap; FAIL if required contract fields are missing or recovery hint is wrong | Check buildStructuralBootstrapContract() and degraded hint injection in session-resume.ts |

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
