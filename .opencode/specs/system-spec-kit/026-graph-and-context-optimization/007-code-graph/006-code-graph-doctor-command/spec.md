---
title: "Feature Specification: Code Graph Doctor Command [system-spec-kit/026-graph-and-context-optimization/007-code-graph/006-code-graph-doctor-command/spec]"
description: "New /doctor:code-graph slash command (diagnostic-first) that audits code graph index health, detects stale + missed files, recommends exclude rules and language filters, and optionally applies them after research-packet 007-code-graph-resilience-research validates the verification battery."
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
trigger_phrases:
  - "code graph doctor command"
  - "/doctor:code-graph"
  - "code graph doctor setup"
  - "006-code-graph-doctor-command"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-code-graph/006-code-graph-doctor-command"
    last_updated_at: "2026-04-25T20:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Created spec.md"
    next_safe_action: "Create remaining packet docs"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0260000000007006000000000000000000000000000000000000000000000000"
      session_id: "006-code-graph-doctor-command"
      parent_session_id: "026-graph-and-context-optimization"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Code Graph Doctor Command

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-04-25 |
| **Parent** | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/` |
| **Parent Spec** | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/spec.md` |
| **Related** | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/007-code-graph-resilience-research/` (research dependency), `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/` (pattern source) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Code graph operations have no doctor surface. When the index goes stale or bloats with `node_modules/`, `dist/`, generated artifacts, etc., users have to manually inspect `code_graph_status`, edit scanner config blind, run `code_graph_scan`, and spot-check queries. There is no command that walks them through diagnosis-first remediation with the same safety guarantees `/doctor:skill-advisor` provides (canonical-path validator, per-run rollback, dry-run preview, build-status branching).

### Purpose

Deliver a diagnostic-first `/doctor:code-graph` command that audits index health, computes a stale/missed file delta, proposes exclude rules + language filters, and optionally applies them after the resilience-research packet (007-code-graph-resilience-research) has produced the verification battery needed to detect closure regressions. Initial release is **Phase A: diagnostic-only** (no mutations); Phase B promotes to apply mode once the verification battery exists.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (Phase A — diagnostic-only release)

- New slash command the planned .opencode/command/doctor/code-graph.md (created by T001) with `:auto` and `:confirm` modes
- Two YAML workflow assets: `doctor_code-graph_auto.yaml` and `doctor_code-graph_confirm.yaml`
- Update `.opencode/command/doctor/` listing (add to README.txt if one exists, otherwise to `.opencode/README.md` Doctor Commands section)
- Update `.opencode/install_guides/` with `SET-UP - Code Graph.md` (user-facing guide)
- Command reads code_graph_status, code_graph_query, detect_changes via MCP tools
- Command computes file-on-disk vs file-in-graph delta
- Command identifies bloat directories (node_modules, dist, __pycache__, etc.)
- Command outputs a markdown diagnostic report under packet-local scratch
- Command returns STATUS=OK with the report path

### In Scope (Phase B — apply mode, gated by research packet)

- Phase 3 Apply step that writes to a `code-graph-config.json` (or equivalent) and triggers re-scan
- Mutation_boundaries.validator on the config file path (mirrors skill-advisor)
- Per-run rollback script generation
- Verification battery (gold-set query that must still resolve after re-scan) — sourced from 007-code-graph-resilience-research

### Out of Scope

- Modifying code_graph_scan logic itself
- Re-implementing the SQLite schema
- Cross-language symbol resolution improvements (separate concern)
- Auto-applying changes without explicit user approval in confirm mode

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| the planned .opencode/command/doctor/code-graph.md (created by T001) | Create | Command markdown definition |
| `.opencode/command/doctor/assets/doctor_code-graph_auto.yaml` | Create | Autonomous diagnostic workflow |
| `.opencode/command/doctor/assets/doctor_code-graph_confirm.yaml` | Create | Interactive diagnostic workflow |
| `.opencode/install_guides/SET-UP - Code Graph.md` | Create | User-facing diagnostic guide |
| `.opencode/README.md` | Modify | Add `/doctor:code-graph` to Doctor Commands section, bump counts |
| `.opencode/specs/.../007-code-graph/{context-index,spec,tasks}.md` | Modify | Add 006 child phase entry |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Command file exists and follows existing doctor command conventions | the planned .opencode/command/doctor/code-graph.md (created by T001) loads on `/doctor:code-graph` mirroring the existing `.opencode/command/doctor/mcp_install.md` + the existing `.opencode/command/doctor/skill-advisor.md` patterns |
| REQ-002 | Auto and confirm YAML workflows exist | Both YAML files parse cleanly via `python3 yaml.safe_load`; structure mirrors doctor_skill-advisor_*.yaml |
| REQ-003 | Phase A is diagnostic-only with no mutations | Both YAMLs declare `mutation_boundaries.allowed_targets: []` + `phase_3_apply.skip_in_phase_a: true` |
| REQ-004 | Command reads code_graph_status via MCP tool | Phase 0 Discovery invokes `code_graph_status({})` and surfaces skill_count, lastScanAt, edge_count |
| REQ-005 | Command computes stale/missed file delta | Phase 1 Analysis returns `{stale: [paths], missed: [paths], bloat_dirs: [paths]}` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Diagnostic report written to packet-local scratch | `<packet_scratch>/code-graph-diagnostic-<timestamp>.md` with discovery + analysis + proposal sections |
| REQ-007 | Bloat-dir detection covers common patterns | Detects `node_modules/`, `dist/`, `__pycache__/`, `.git/`, `.opencode/scripts/dist/`, `.opencode/skill/system-spec-kit/mcp_server/dist/`, `tmp/` at minimum |
| REQ-008 | Confirm mode pauses at `pre_phase_2 (Proposal)` gate | User can review the analysis before the proposal is generated |
| REQ-009 | Phase B gating documented | YAML refers to 007-code-graph-resilience-research as the prerequisite for promotion to apply mode |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Typing `/doctor:code-graph:auto` produces a markdown diagnostic report in under 60 seconds for repos with <10k files
- **SC-002**: The report identifies all common bloat dirs present in the repo
- **SC-003**: The report's stale/missed delta matches `detect_changes({})` output 1:1
- **SC-004**: In confirm mode, the user can approve/reject proposed exclude rules at the `pre_phase_2` gate
- **SC-005**: Phase A release does NOT modify any code-graph config or trigger any re-scan
- **SC-006**: Documentation clearly states Phase B (apply mode) is gated on the research packet
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `code_graph_status` MCP tool | High | Verify tool availability in Phase 0; degrade to `code_graph_scan --status` CLI fallback if unavailable |
| Dependency | `detect_changes` MCP tool | High | Same — fallback to git status + glob comparison |
| Dependency | 007-code-graph-resilience-research findings (verification battery) | Medium | Phase B gated; Phase A ships diagnostic-only and is fully usable without the battery |
| Risk | Bloat-dir detection over-flags valid dirs (e.g., user has a legitimate `dist/`) | Medium | Surface as proposals, not auto-applies; confirm mode lets user reject |
| Risk | Stale-file detection mistakes (filesystem vs index timestamp drift) | Medium | Use file content hash, not just mtime |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should Phase A include a "Phase 4 Verify" step that re-runs `code_graph_status` to confirm no state changed? (low risk, useful audit trail)
- Should the diagnostic report include per-language coverage histograms?
- Where does the eventual `code-graph-config.json` live for Phase B? (`.opencode/skill/system-spec-kit/mcp_server/code-graph-config.json` is the natural location)
- Should there be a `--scope=stale|missed|bloat|all` flag in Phase A to focus the diagnostic?
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Phase 0 + Phase 1 complete within 60 seconds for repos with <10k files
- **NFR-P02**: Memory footprint stays under 200MB during analysis (large repos may have 100k+ symbols)

### Security
- **NFR-S01**: No mutations to source files in Phase A; mutation_boundaries.allowed_targets must be empty
- **NFR-S02**: Diagnostic report is written under packet scratch with umask 077 (no world-readable temp files)

### Reliability
- **NFR-R01**: Command degrades gracefully if MCP tools unavailable (fallback to git + glob)
- **NFR-R02**: Re-runnable: invoking the command twice produces identical reports (deterministic ordering)
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty repo (no source files): Command reports "no files to analyze" and exits STATUS=OK
- Code graph never indexed: Phase 0 detects empty index; recommends running `code_graph_scan` first
- Code graph index is more than 30 days stale: warn at the head of the report

### Error Scenarios
- `code_graph_status` returns timeout: fallback to filesystem-only diagnosis with warning
- `detect_changes` unavailable: compute delta via direct file comparison
- Disk full when writing scratch report: surface error, no partial report

### State Transitions
- Phase A used to gather diagnostics → user decides not to apply → no state changes anywhere
- Phase B (when added later) requires explicit `--apply` flag to proceed past Phase 2

### Acceptance Scenarios

**Scenario 1 — First-time diagnostic**

**Given** a repo where `code_graph_status` shows 1200 indexed files, **When** the user runs `/doctor:code-graph:auto`, **Then** the command produces a report at `<packet_scratch>/code-graph-diagnostic-<ts>.md` listing stale + missed files, detected bloat dirs, and proposed exclude rules with no mutations performed.

**Scenario 2 — Bloat detection**

**Given** a repo with `node_modules/`, `.opencode/skill/system-spec-kit/mcp_server/node_modules/`, and `dist/` indexed, **When** the user runs `/doctor:code-graph:auto`, **Then** the report flags all three as bloat candidates with proposed exclude rule entries.

**Scenario 3 — Stale detection**

**Given** files modified after the last `code_graph_scan` run, **When** the user runs `/doctor:code-graph:auto`, **Then** the report's `stale` set matches `detect_changes({})` output exactly.

**Scenario 4 — Confirm-mode review gate**

**Given** the user invokes `/doctor:code-graph:confirm`, **When** Phase 1 Analysis completes, **Then** the command pauses at `pre_phase_2 (Proposal)` and waits for user approval before generating exclude rules.

**Scenario 5 — Phase A is read-only**

**Given** any state of the repo, **When** the user runs `/doctor:code-graph:auto`, **Then** zero files outside packet scratch are modified, `git status -- .opencode/skill/system-spec-kit/mcp_server/` shows no changes, and `code_graph_scan` is NOT triggered.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | 4 files to create, 1 to modify, no source-code mutations |
| Risk | 4/25 | Diagnostic-only; mutations gated to Phase B which depends on research packet |
| Research | 12/20 | Phase B verification battery requires real research output; Phase A doesn't |
| **Total** | **24/70** | **Level 2** |
<!-- /ANCHOR:complexity -->
