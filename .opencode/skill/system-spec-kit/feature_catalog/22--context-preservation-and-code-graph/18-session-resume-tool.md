---
title: "Session resume tool"
description: "Composite MCP tool (session_resume) that merges memory resume context, code graph status, CocoIndex availability, and structural bootstrap hints into a detailed recovery payload."
audited_post_018: true
phase_018_change: "Clarified that session_resume is the detailed merged recovery surface after the phase-018 canonical /spec_kit:resume ladder and session_bootstrap first-call path."
---

# Session resume tool

## 1. OVERVIEW

Composite MCP tool (session_resume) that merges memory resume context, code graph status, CocoIndex availability, and structural bootstrap hints into a single recovery payload.

The `session_resume` handler performs three recovery steps: (1) a filesystem-first resume ladder via `buildResumeLadder()` that reconstructs session state from `handover.md -> _memory.continuity -> spec docs`, (2) code graph status lookup returning freshness-aware `fresh | stale | empty | error` values plus counts and last scan timestamp, and (3) CocoIndex binary availability probing. It also appends the shared structural `ready | stale | missing` contract from `session-snapshot.ts`, so callers can tell when a deeper refresh is needed. Results are merged into a `SessionResumeResult` with `memory`, `codeGraph`, `cocoIndex`, optional `structuralContext`, and `hints` fields. For the canonical first-call recovery step, use `session_bootstrap`; for operator-facing packet recovery, start from `handover.md -> _memory.continuity -> spec docs`; `session_resume` remains the detailed merged surface.

---

## 2. CURRENT REALITY

mcp_server/handlers/session-resume.ts

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/session-resume.ts` | Handler | Composite resume merging 3 subsystems |
| `mcp_server/lib/resume/resume-ladder.ts` | Lib | Filesystem-first packet recovery ladder (`handover.md -> _memory.continuity -> spec docs`) |
| `mcp_server/lib/code-graph/code-graph-db.ts` | Lib | Code graph status query |
| `mcp_server/lib/session/session-snapshot.ts` | Lib | Shared structural context contract used for recovery hints |
| `mcp_server/tools/lifecycle-tools.ts` | Dispatch | Tool dispatch registration for session_resume |

---

## 4. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Source feature title: Session resume tool
- Current reality source: spec 024-compact-code-graph phases 020 and 027
