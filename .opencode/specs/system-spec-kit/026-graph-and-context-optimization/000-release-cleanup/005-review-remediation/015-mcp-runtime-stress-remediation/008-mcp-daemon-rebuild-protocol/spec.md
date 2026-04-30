---
# SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2
title: "Feature Specification: MCP daemon rebuild + restart protocol [system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/008-mcp-daemon-rebuild-protocol/spec]"
description: "Meta-fix packet for the 005 phantom-fix problem. Documents the canonical 4-part rebuild + restart contract: source diff -> targeted tests -> npm run build + dist marker check -> MCP-owning client/runtime restart -> live MCP tool probe. No source code changes; documentation + verification protocol only."
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2"
trigger_phrases:
  - "008-mcp-daemon-rebuild-protocol"
  - "MCP daemon restart protocol"
  - "phantom fix problem"
  - "dist marker verification"
  - "live MCP probe contract"
  - "Q1 four-part verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/008-mcp-daemon-rebuild-protocol"
    last_updated_at: "2026-04-27T10:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded packet from 005 post-remediation lesson + 007 §5 Q1 + §11 Rec #1"
    next_safe_action: "Author the rebuild protocol doc"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    completion_pct: 10
    open_questions: []
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
---
# Feature Specification: MCP daemon rebuild + restart protocol

<!-- SPECKIT_LEVEL: 1 -->
<!-- PHASE_LINKS_PARENT: ../spec.md; PREDECESSOR: 007-intent-classifier-stability; SUCCESSOR: 009-memory-search-response-policy -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 (meta) |
| **Status** | Draft |
| **Created** | 2026-04-27 |
| **Sources** | 005 post-remediation verification (2026-04-26 18:49 — fixes NOT live), 007/§5 Q1, 007/§11 Rec #1, 007/§16 troubleshooting row 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 005 packet implementation summary claimed Cluster 1-3 P0 fixes landed. The post-remediation verification (recorded in 005/spec.md §7) showed Probes A and B regressing the original defect: live `memory_context({input:"Semantic Search"})` still emitted `meta.intent.type:"fix_bug"` (0.098) and `data.content[0].text:{count:0,results:[]}`. 007/Q1 (Iteration 001) ruled out a missing dist rebuild — `dist/` markers were present and timestamps were newer than source. The remaining cause was that the MCP-owning client/runtime had not been restarted; the running daemon child process continued using the old code. This is the canonical "phantom fix" failure mode and it is structural, not implementation-specific.

### Purpose
Author a canonical rebuild + restart protocol that becomes the verification contract for every MCP TypeScript fix. Every implementation packet under `mcp_server/` MUST produce 4-part evidence per 007 §5 Q1: source diff paths, targeted test pass output, dist verification (timestamp + marker grep), runtime restart evidence, and live MCP tool probe. Without all 4 parts, completion claims are PROVISIONAL.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Author a single canonical reference document: `references/mcp-rebuild-restart-protocol.md` describing the 4-part verification contract.
- Document the restart procedure for each MCP-owning client: OpenCode, Codex CLI, Claude Code.
- Document the dist marker grep pattern: `grep -l <new-marker> .opencode/skill/system-spec-kit/mcp_server/dist/<file>.js`.
- Add a per-subsystem live-probe template (file path: `references/live-probe-template.md`) with canonical probe queries for memory_context, memory_search, code_graph, and causal_stats.
- Add a verification checklist any implementation packet can copy into its implementation-summary.md.

### Out of Scope
- Automating restart (out-of-band; client owns process lifecycle per 007 §6).
- Modifying any MCP server source.
- Authoring new test fixtures.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `references/mcp-rebuild-restart-protocol.md` | Create | Canonical 4-part verification contract |
| `references/live-probe-template.md` | Create | Per-subsystem probe queries |
| `references/dist-marker-grep-cheatsheet.md` | Create | Marker grep patterns |
| `spec.md` / `plan.md` / `tasks.md` / `implementation-summary.md` | Create | Packet docs |
| `description.json` / `graph-metadata.json` | Create | Spec metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A canonical reference doc MUST exist describing the 4-part verification contract. | After fix, `references/mcp-rebuild-restart-protocol.md` exists with all 5 evidence fields per 007 §5 Q1: sourceDiffPaths, targetedTests, distVerification, runtimeRestart, liveProbe. |
| REQ-002 | A live-probe template MUST exist per subsystem (memory_context, memory_search, code_graph, causal_stats). | After fix, `references/live-probe-template.md` exists with at least 4 probe queries — one per subsystem. |
| REQ-003 | A dist marker grep cheatsheet MUST exist with patterns for each MCP layer. | After fix, `references/dist-marker-grep-cheatsheet.md` exists. |
| REQ-004 | A copy-paste verification checklist MUST exist for implementation packets. | After fix, `references/implementation-verification-checklist.md` exists with a markdown checklist any packet can paste into its implementation-summary.md. |

### Acceptance Scenarios

**Given** a Phase C implementation packet that finishes source patches + tests + build, **when** the implementer reaches the "verification" stage, **then** they reference packet 013's `references/implementation-verification-checklist.md` and produce all 5 evidence fields.

**Given** the user reports "the fix isn't working in live MCP", **when** triage starts, **then** the first action is "did you restart the MCP-owning client?" per packet 013's protocol.

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 4 reference docs exist and pass `validate.sh --strict`.
- **SC-002**: At least 1 sibling packet (008-014) cites packet 013 in their implementation-summary.md "MCP Daemon Restart Required" section.
- **SC-003**: `validate.sh --strict` PASS.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Restart procedure varies by client and may change. | Medium | Document per-client commands; mark as point-in-time accurate. |
| Risk | Documentation drifts from reality. | Medium | Reference 007 research synthesis as authoritative source; cross-link. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should we add an automated `dist-freshness-check.sh` script? Defer to Phase D — protocol first, automation second.
- Should this protocol be enforced via a validation rule in `validate.sh`? Defer; rule would need to detect "MCP source modified" which is heuristic.
<!-- /ANCHOR:questions -->
