---
title: "Session resume tool"
description: "Composite MCP tool (session_resume) that merges memory resume context, code graph status, CocoIndex availability, and structural bootstrap hints into a detailed recovery payload."
---

# Session resume tool

## 1. OVERVIEW

Composite MCP tool (session_resume) that merges memory resume context, code graph status, CocoIndex availability, and structural bootstrap hints into a single recovery payload.

The session_resume handler performs three sub-calls: (1) `memory_context` with `mode=resume` and `profile=resume` to recover session state, (2) code graph database query for node/edge/file counts and last scan timestamp, and (3) CocoIndex binary availability check via filesystem probe. It also appends the shared structural ready/stale/missing contract from `session-snapshot.ts`, so callers can tell when a deeper refresh is needed. Results are merged into a `SessionResumeResult` with `memory`, `codeGraph`, `cocoIndex`, optional `structuralContext`, and `hints` fields. Failures in any sub-call are captured as error entries with recovery hints rather than failing the entire call. For the canonical first-call recovery step, use `session_bootstrap`; `session_resume` remains the detailed merged surface.

---

## 2. CURRENT REALITY

mcp_server/handlers/session-resume.ts

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/session-resume.ts` | Handler | Composite resume merging 3 subsystems |
| `mcp_server/handlers/memory-context.ts` | Handler | Sub-call target for memory resume |
| `mcp_server/lib/code-graph/code-graph-db.ts` | Lib | Code graph status query |
| `mcp_server/lib/session/session-snapshot.ts` | Lib | Shared structural context contract used for recovery hints |
| `mcp_server/tools/lifecycle-tools.ts` | Dispatch | Tool dispatch registration for session_resume |

---

## 4. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Source feature title: Session resume tool
- Current reality source: spec 024-compact-code-graph phases 020 and 027
