---
title: "263 -- Session resume returns detailed recovery state"
description: "This scenario validates Session resume tool for 263. It focuses on verifying session_resume returns a detailed merged recovery payload, including structural readiness hints."
audited_post_018: true
---

# 263 -- Session resume returns detailed recovery state

## 1. OVERVIEW

This scenario validates the detailed Session resume tool (`session_resume`). It focuses on the lower-level merged payload returned by the direct resume surface, while the higher-level bootstrap/recovery guidance is documented separately.

---

## 2. SCENARIO CONTRACT


- Objective: Verify that `session_resume` rebuilds recovery state from the current resume ladder (`handover.md -> _memory.continuity -> spec docs`), reports freshness-aware code graph status (`fresh | stale | empty | error`), checks CocoIndex availability, appends the shared structural `ready | stale | missing` contract, binds explicit `args.sessionId` to the transport caller context by default, and merges everything into a single `SessionResumeResult`; Failures must degrade into hints and status fields instead of crashing the tool, except for strict auth mismatches which should reject cleanly; The response must include `memory` (ladder-backed recovery context), `codeGraph` (freshness status with counts), `cocoIndex` (available boolean with binary path), `structuralContext` (`status`, `summary`, `recommendedAction`, `sourceSurface`), and `hints`.
- Real user request: `` Please validate Session resume returns detailed recovery state against session_resume({}) and tell me whether the expected signals are present: `memory.source` is one of `handover`, `continuity`, `spec-docs`, or `none`; `memory.summary` and `memory.documents` reflect the winning ladder source when packet docs exist; `codeGraph.status` is `fresh`, `stale`, `empty`, or `error`, and counts are non-negative integers; cocoIndex.available is boolean, binaryPath is string; structuralContext.status is one of `ready`, `stale`, `missing`; structuralContext.summary is a string, `recommendedAction` is a string, and `sourceSurface === "session_resume"`; hints array present (may be empty if all subsystems healthy; degraded states should point to `session_bootstrap` and/or `code_graph_scan`); strict mode rejects mismatched caller/session IDs; permissive mode logs and continues. ``
- RCAF Prompt: `As a context-and-code-graph validation operator, validate Session resume returns detailed recovery state against session_resume({}). Verify session_resume rebuilds memory from the resume ladder (handover.md -> _memory.continuity -> spec docs), reports freshness-aware code graph status (fresh, stale, empty, or error), checks CocoIndex availability, appends the shared structural ready/stale/missing contract, rejects mismatched args.sessionId values in strict mode, allows them only under the permissive rollout flag, and merges everything else into a single SessionResumeResult. The response must include memory, codeGraph, cocoIndex, structuralContext, and hints when the auth check passes. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: `memory.source` is one of `handover`, `continuity`, `spec-docs`, or `none`; `memory.summary` and `memory.documents` reflect the winning ladder source when packet docs exist; `codeGraph.status` is `fresh`, `stale`, `empty`, or `error`, and counts are non-negative integers; cocoIndex.available is boolean, binaryPath is string; structuralContext.status is one of `ready`, `stale`, `missing`; structuralContext.summary is a string, `recommendedAction` is a string, and `sourceSurface === "session_resume"`; hints array present (may be empty if all subsystems healthy; degraded states should point to `session_bootstrap` and/or `code_graph_scan`); strict mode rejects mismatched caller/session IDs; permissive mode logs and continues
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: All subsystem results and structuralContext fields are present in response when auth passes, the spec-doc record payload follows the resume ladder contract, degraded structural states emit the expected bootstrap guidance without throwing, and strict-vs-permissive session binding matches the documented contract; FAIL: Missing subsystem or structuralContext in response, unhandled exception from sub-call, missing type fields, or incorrect auth-binding behavior

---

## 3. TEST EXECUTION

### Prompt

```
As a context-and-code-graph validation operator, validate the resume ladder payload against session_resume({}). Verify memory.source reflects the canonical ladder (handover.md -> _memory.continuity -> spec docs), and memory.summary/documents are populated when packet docs exist. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Call `session_resume({})` via MCP

### Expected

memory field includes ladder-backed recovery data with source, summary, and documents

### Evidence

session_resume response JSON memory field

### Pass / Fail

- **Pass**: memory field present with ladder-backed data and valid source
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check `buildResumeLadder()` and `session-resume.ts`

---

### Prompt

```
As a context-and-code-graph validation operator, validate Code graph status against session_resume({}). Verify codeGraph.status in [fresh, stale, empty, error], and nodeCount/edgeCount/fileCount are integers >= 0. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Call `session_resume({})` via MCP

### Expected

codeGraph.status in [fresh, stale, empty, error], nodeCount/edgeCount/fileCount are integers >= 0

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
As a context-and-code-graph validation operator, validate Structural readiness and recovery hinting against session_resume({}). Verify structuralContext.status in [ready, stale, missing]; structuralContext.summary/recommendedAction/sourceSurface present; degraded states mention session_bootstrap and/or code_graph_scan in hints. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Call `session_resume({})` via MCP in both healthy and degraded graph states

### Expected

structuralContext.status in [ready, stale, missing]; structuralContext.summary/recommendedAction/sourceSurface present; degraded states mention session_bootstrap and/or code_graph_scan in hints

### Evidence

session_resume response JSON structuralContext + hints

### Pass / Fail

- **Pass**: structural contract fields are surfaced and degraded states recommend `session_bootstrap` and/or `code_graph_scan`
- **Fail**: required contract fields are missing or recovery hint is wrong

### Failure Triage

Check buildStructuralBootstrapContract() and degraded hint injection in session-resume.ts

---

### Prompt

```
As a context-and-code-graph validation operator, validate session-resume auth binding against session_resume({ sessionId: "<session-id>" }). Verify a mismatched caller/session pair is rejected in strict mode, the same mismatch is allowed only when MCP_SESSION_RESUME_AUTH_MODE=permissive, and the permissive path still returns the normal merged payload shape. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Call `session_resume({ sessionId: "<mismatched-session-id>" })` in strict mode
2. Re-run with `MCP_SESSION_RESUME_AUTH_MODE=permissive`
3. Compare the strict rejection against the permissive merged payload

### Expected

Strict mode rejects the mismatch; permissive mode logs and returns the normal merged payload shape

### Evidence

Strict-mode rejection output plus permissive-mode response JSON

### Pass / Fail

- **Pass**: strict mode rejects the mismatch and permissive mode allows the same request while preserving the normal payload shape
- **Fail**: strict mode silently allows the mismatch or permissive mode fails to return the documented payload

### Failure Triage

Check `caller-context.ts`, `context-server.ts`, and the strict-vs-permissive branch in `session-resume.ts`

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation-and-code-graph/18-session-resume-tool.md](../../feature_catalog/22--context-preservation-and-code-graph/18-session-resume-tool.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 263
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation-and-code-graph/263-session-resume.md`
