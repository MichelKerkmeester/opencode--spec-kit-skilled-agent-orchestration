---
title: "Session resume tool"
description: "Composite MCP tool (session_resume) that merges memory resume context, code graph status, and CocoIndex availability into a single call for session recovery."
---

# Session resume tool

## 1. OVERVIEW

Composite MCP tool (session_resume) that merges memory resume context, code graph status, and CocoIndex availability into a single call for session recovery.

The session_resume handler performs three sub-calls: (1) memory_context with mode=resume and profile=resume to recover session state, (2) code graph database query for node/edge/file counts and last scan timestamp, (3) CocoIndex binary availability check via filesystem probe. Results are merged into a SessionResumeResult with memory, codeGraph, cocoIndex, and hints fields. Failures in any sub-call are captured as error entries with recovery hints rather than failing the entire call.

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
| `mcp_server/tools/lifecycle-tools.ts` | Dispatch | Tool dispatch registration for session_resume |

---

## 4. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Source feature title: Session resume tool
- Current reality source: spec 024-compact-code-graph phase 020
