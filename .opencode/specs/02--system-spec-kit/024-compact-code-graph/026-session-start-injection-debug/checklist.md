---
title: "Verification Checklist: Startup Context Injection Debug — Hook Runtime Brief + Sibling Handoff"
description: "Verification Date: 2026-04-02"
trigger_phrases:
  - "026 checklist"
importance_tier: "critical"
contextType: "verification"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: Startup Context Injection Debug — Hook Runtime Brief + Sibling Handoff

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md` for hook-runtime startup injection [EVIDENCE: Verified against the packet requirements and success criteria in `spec.md`.] [SOURCE: spec.md:95-101] [SOURCE: spec.md:129-146]
- [x] CHK-002 [P0] Technical approach defined in `plan.md` and kept separate from `027-opencode-structural-priming` [EVIDENCE: The implementation plan explicitly isolates hook-runtime startup work from the sibling non-hook packet.] [SOURCE: plan.md:34-40] [SOURCE: plan.md:74-78]
- [x] CHK-003 [P1] Dependencies on code graph DB, hook state, and sibling packet handoff are stated clearly [EVIDENCE: Packet scope and dependency text names the graph DB, hook state loader, and 027 handoff.] [SOURCE: spec.md:33-37]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Shared `buildStartupBrief()` returns graph outline when DB exists with nodes [EVIDENCE: The builder composes graph summary/highlights and the focused startup-brief test exercises the ready-graph path.] [SOURCE: mcp_server/lib/code-graph/startup-brief.ts:47-81] [SOURCE: mcp_server/tests/startup-brief.vitest.ts:49-58]
- [x] CHK-011 [P0] Shared `buildStartupBrief()` returns session continuity when prior state `<24h` exists [EVIDENCE: The implementation loads recent state under the 24-hour window and injects continuity text from that result.] [SOURCE: mcp_server/lib/code-graph/startup-brief.ts:91-105] [SOURCE: mcp_server/hooks/claude/hook-state.ts:71-100]
- [x] CHK-012 [P1] Startup-highlight query/helper returns meaningful startup highlights without assuming missing schema fields [EVIDENCE: The query avoids nonexistent schema assumptions and the builder consumes the returned highlights safely.] [SOURCE: mcp_server/lib/code-graph/code-graph-db.ts:350-402] [SOURCE: mcp_server/lib/code-graph/startup-brief.ts:65-75]
- [x] CHK-013 [P1] `026` no longer claims `PrimePackage` / `session_bootstrap` payload ownership [EVIDENCE: The packet narrative limits itself to hook-runtime startup injection and handoff to 027 for hookless payload ownership.] [SOURCE: spec.md:79-82] [SOURCE: plan.md:96-98]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Claude `handleStartup()` injects graph outline at session start [EVIDENCE: Claude startup now calls the shared startup brief and appends the resulting graph context before normal continuation logic.] [SOURCE: mcp_server/hooks/claude/session-prime.ts:100-155]
- [x] CHK-021 [P0] Gemini `handleStartup()` injects graph outline at session start [EVIDENCE: Gemini startup mirrors the shared startup-brief injection flow for the same ready/empty/missing graph states.] [SOURCE: mcp_server/hooks/gemini/session-prime.ts:86-130]
- [x] CHK-022 [P0] No crash when code graph DB missing or empty [EVIDENCE: The startup brief handles missing and empty graph states explicitly, and the focused tests cover both degraded paths.] [SOURCE: mcp_server/lib/code-graph/startup-brief.ts:57-63] [SOURCE: mcp_server/lib/code-graph/startup-brief.ts:82-87] [SOURCE: mcp_server/tests/startup-brief.vitest.ts:60-90]
- [x] CHK-023 [P1] No crash when no prior session state exists [EVIDENCE: The builder short-circuits safely when no recent state is found, and the tests confirm the empty-state path stays stable.] [SOURCE: mcp_server/lib/code-graph/startup-brief.ts:92-95] [SOURCE: mcp_server/tests/startup-brief.vitest.ts:80-90]
- [x] CHK-024 [P1] Compaction, resume, and clear paths remain unchanged [EVIDENCE: Startup-only edits stay inside the startup handlers and leave the resume/clear branches intact.] [SOURCE: mcp_server/hooks/claude/session-prime.ts:44-88] [SOURCE: mcp_server/hooks/claude/session-prime.ts:158-224] [SOURCE: mcp_server/hooks/gemini/session-prime.ts:41-83] [SOURCE: mcp_server/hooks/gemini/session-prime.ts:133-196]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Startup brief avoids exposing unnecessary sensitive workspace details [EVIDENCE: The generated brief stays compact and scoped to graph/continuity summaries rather than dumping raw workspace state.] [SOURCE: mcp_server/lib/code-graph/startup-brief.ts:34-45]
- [x] CHK-031 [P0] Recovery guidance does not bypass established tool-safety or scope rules [EVIDENCE: Both runtime handlers direct recovery through the approved bootstrap/resume guidance instead of bypassing tool routing.] [SOURCE: mcp_server/hooks/claude/session-prime.ts:106-113] [SOURCE: mcp_server/hooks/claude/session-prime.ts:124-127] [SOURCE: mcp_server/hooks/gemini/session-prime.ts:91-97] [SOURCE: mcp_server/hooks/gemini/session-prime.ts:108-111]
- [x] CHK-032 [P1] Empty graph DB is distinguished from injection failure [EVIDENCE: The builder emits different copy for empty graph state versus unavailable graph state.] [SOURCE: mcp_server/lib/code-graph/startup-brief.ts:57-63] [SOURCE: mcp_server/lib/code-graph/startup-brief.ts:82-87]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` stay synchronized [EVIDENCE: All packet docs describe the same hook-runtime startup scope, shared builder approach, and focused verification set.] [SOURCE: spec.md:95-109] [SOURCE: plan.md:34-40] [SOURCE: tasks.md:45-50]
- [x] CHK-041 [P1] `026-session-start-injection-debug` and `027-opencode-structural-priming` stay distinct in packet docs [EVIDENCE: The packet explicitly reserves hookless structural bootstrap ownership for 027 and keeps 026 limited to hook-runtime startup injection.] [SOURCE: spec.md:79-82] [SOURCE: spec.md:109-109] [SOURCE: plan.md:38-40]
- [x] CHK-042 [P2] Helper reuse expectations are documented without pre-deciding Phase 027 payload details [EVIDENCE: Reuse guidance is recorded while leaving non-hook payload evolution to the sibling phase.] [SOURCE: spec.md:145-145]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Work remains scoped to hook startup files plus packet docs [EVIDENCE: The implementation summary and packet scope list only hook startup files and synchronized packet documents.] [SOURCE: spec.md:111-119]
- [x] CHK-051 [P1] No unrelated packet files modified while clarifying the 026/027 split [EVIDENCE: The documented file set stays inside the startup brief path and the packet coordination docs.] [SOURCE: spec.md:111-119] [SOURCE: tasks.md:49-50]
- [x] CHK-052 [P2] Context preservation follow-up considered if implementation proceeds later [EVIDENCE: The packet notes future context-preservation follow-up without broadening the current implementation scope.] [SOURCE: spec.md:23-24]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 9 | 9/9 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-04-02
<!-- /ANCHOR:summary -->
