---
title: "263 -- Session resume returns detailed recovery state"
description: "This scenario validates Session resume tool for 263. It focuses on verifying session_resume returns a detailed merged recovery payload, including structural readiness hints."
audited_post_018: true
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
- **Prompt**: `As a context-and-code-graph validation operator, validate Session resume returns detailed recovery state against session_resume({}). Verify session_resume performs its recovery sub-calls (memory_context resume, code graph status, CocoIndex availability), appends the shared structural ready/stale/missing contract, and merges everything into a single SessionResumeResult. Each sub-call failure must be captured as an error entry with recovery hints rather than failing the entire call. The response must include memory (resume context), codeGraph (status/ok/empty/error with counts), cocoIndex (available boolean with binary path), structuralContext (status, summary, recommendedAction, sourceSurface, plus freshness guidance), and hints array. Return a concise pass/fail verdict with the main reason and cited evidence.`
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

### Prompt

```
As a context-and-code-graph validation operator, validate Memory resume sub-call returns context against session_resume({}). Verify memory field is non-empty object with resume data or error + hint. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Call `session_resume({})` via MCP

### Expected

memory field is non-empty object with resume data or error + hint

### Evidence

session_resume response JSON memory field

### Pass / Fail

- **Pass**: memory field present with data or graceful error
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check handleMemoryContext() with mode=resume in session-resume.ts

---

### Prompt

```
As a context-and-code-graph validation operator, validate Code graph status sub-call returns counts against session_resume({}). Verify codeGraph.status in [ok, empty, error], nodeCount/edgeCount/fileCount are integers >= 0. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Call `session_resume({})` via MCP

### Expected

codeGraph.status in [ok, empty, error], nodeCount/edgeCount/fileCount are integers >= 0

### Evidence

session_resume response JSON codeGraph field

### Pass / Fail

- **Pass**: codeGraph field has all required fields with valid types
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check graphDb.getStats() and code-graph-db.ts query

---

### Prompt

```
As a context-and-code-graph validation operator, validate CocoIndex availability check against session_resume({}). Verify cocoIndex.available is boolean, binaryPath is string. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Call `session_resume({})` via MCP

### Expected

cocoIndex.available is boolean, binaryPath is string

### Evidence

session_resume response JSON cocoIndex field

### Pass / Fail

- **Pass**: cocoIndex fields present with correct types
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check `cocoindex-path.ts` plus the availability probe used by session-resume.ts

---

### Prompt

```
As a context-and-code-graph validation operator, validate Structural readiness and recovery hinting against session_resume({}). Verify structuralContext.status in [ready, stale, missing]; structuralContext.summary/recommendedAction/sourceSurface present; degraded states mention session_bootstrap in hints. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Call `session_resume({})` via MCP in both healthy and degraded graph states

### Expected

structuralContext.status in [ready, stale, missing]; structuralContext.summary/recommendedAction/sourceSurface present; degraded states mention session_bootstrap in hints

### Evidence

session_resume response JSON structuralContext + hints

### Pass / Fail

- **Pass**: structural contract fields are surfaced and degraded states recommend session_bootstrap
- **Fail**: required contract fields are missing or recovery hint is wrong

### Failure Triage

Check buildStructuralBootstrapContract() and degraded hint injection in session-resume.ts

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation-and-code-graph/18-session-resume-tool.md](../../feature_catalog/22--context-preservation-and-code-graph/18-session-resume-tool.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 263
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation-and-code-graph/263-session-resume.md`
