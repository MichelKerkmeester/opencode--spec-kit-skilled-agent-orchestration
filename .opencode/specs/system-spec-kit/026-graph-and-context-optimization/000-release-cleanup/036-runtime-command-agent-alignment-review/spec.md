---
title: "Feature Specification: 049 Runtime Command Agent Alignment Review"
description: "Audit supported runtime command and agent definitions for current-reality drift after the recent graph, hook, matrix, and schema changes. Apply doc-level fixes where safe, and record blocked runtime-specific drift honestly."
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
trigger_phrases:
  - "036-runtime-command-agent-alignment-review"
  - "runtime command audit"
  - "agent alignment review"
  - "cross-runtime agent consistency"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/036-runtime-command-agent-alignment-review"
    last_updated_at: "2026-04-30T07:45:00+02:00"
    last_updated_by: "cli-codex"
    recent_action: "Audit scoped"
    next_safe_action: "Review findings"
    blockers:
      - ".codex/agents writes blocked by sandbox EPERM"
    key_files:
      - "audit-findings.md"
      - "remediation-log.md"
      - "cross-runtime-diff.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "036-runtime-command-agent-alignment-review"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: 049 Runtime Command Agent Alignment Review

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-30 |
| **Branch** | `036-runtime-command-agent-alignment-review` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Runtime command and agent docs can drift when tool names, paths, hook contracts, and MCP surfaces change quickly. This packet audits OpenCode commands, OpenCode agents, Claude agents, Codex agents, Gemini agents, and GitHub hook-only coverage for stale claims.

### Purpose

Make command and agent definitions reflect current runtime reality, with a durable audit trail for pass, drift, missing, fixed, and blocked findings.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Audit `.opencode/command/**/*.md` plus relevant YAML assets.
- Audit `.opencode/agent/*.md`, `.claude/agents/*.md`, `.codex/agents/*`, and `.gemini/agents/*.md`.
- Apply minimal documentation fixes for stale tool, path, count, hook, evergreen, and capability references.
- Record cross-runtime equivalence and intentional divergence.

### Out of Scope

- Tool source or schema mutation.
- Behavioral workflow changes beyond doc-level command assets.
- Git commit or staging.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/command/**` | Modify | Refresh command docs and YAML text claims |
| `.opencode/agent/*.md` | Modify | Align hook/runtime/evergreen guidance |
| `.claude/agents/*.md` | Modify | Align equivalent agent claims |
| `.gemini/agents/*.md` | Modify | Align equivalent agent claims |
| `.codex/agents/*.toml` | Audit | Drift recorded; writes blocked by sandbox |
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/036-runtime-command-agent-alignment-review/*` | Create | Packet docs and audit reports |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Produce a complete per-file audit report. | `audit-findings.md` classifies every discovered command and agent file. |
| REQ-002 | Apply safe DRIFT/MISSING fixes. | `remediation-log.md` maps each finding to fixed, blocked, or documented. |
| REQ-003 | Keep edits documentation-only. | No tool schema/source behavior files are modified. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Verify tool and count claims against canonical sources. | Audit cites `tool-schemas.ts`, advisor tool descriptors, and `opencode.json`. |
| REQ-005 | Verify runtime hook claims against current matrix. | Agent wording cites the hook-system trigger matrix. |
| REQ-006 | Check cross-runtime agent equivalence. | `cross-runtime-diff.md` records aligned and divergent agents. |
| REQ-007 | Honor evergreen-doc rule. | Packet-history references are removed or documented as examples/blocked Codex drift. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Audit report exists and covers commands plus agents across all configured runtime dirs.
- **SC-002**: Remediation log records each finding outcome.
- **SC-003**: Cross-runtime diff report distinguishes intentional path-format divergence from stale capability drift.
- **SC-004**: Strict packet validation exits 0.

### Acceptance Scenarios

- **Given** command docs reference MCP runtime prerequisites, **When** the audit compares those claims against command YAML assets, **Then** stale Node floor claims are corrected or logged with evidence.
- **Given** agent docs mention hook delivery, **When** runtime capability claims are checked against the hook-system matrix, **Then** wording uses runtime-generic hook matrix citations.
- **Given** memory and doctor commands omit newly available maintenance tools, **When** the tool should be user-visible for that command, **Then** the command mentions `memory_retention_sweep` or `advisor_rebuild`.
- **Given** Codex TOML agent files are present, **When** sandbox policy blocks edits, **Then** findings are marked blocked with command evidence instead of silently passing.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Prior packets 042, 047, 048 | Source-of-truth docs and path renames must be current | Read implementation summaries and canonical files |
| Risk | `.codex/agents` write denial | Codex agent drift cannot be fully fixed in this sandbox | Record blocked findings with EPERM evidence |
| Risk | YAML assets include historical spec paths | Blind removal can break command workflows | Replace narrative claims, document path examples as scoped |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability

- **NFR-R01**: Reports must cite concrete files and outcomes.
- **NFR-R02**: Validation must use the strict packet validator.

### Maintainability

- **NFR-M01**: Runtime-specific differences should be explicit, not accidental.
- **NFR-M02**: Evergreen docs should cite current source anchors instead of packet-history prose.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Runtime-Specific Formats

- Codex uses TOML agent files, not Markdown.
- GitHub Copilot has hook configuration only and no agent definitions.

### Error Scenarios

- `.codex/agents` writes are blocked by sandbox policy; findings remain open and documented.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Dozens of command, agent, and YAML files |
| Risk | 12/25 | Documentation-only but runtime-facing |
| Research | 16/20 | Requires source-of-truth and cross-runtime comparison |
| **Total** | **46/70** | **Level 2** |
<!-- /ANCHOR:complexity -->
