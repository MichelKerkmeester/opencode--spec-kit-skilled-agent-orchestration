---
title: "Spec: Code Graph Watcher Retraction"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Tier B-beta doc retraction for the structural code-graph watcher overclaim."
trigger_phrases:
  - "032-code-graph-watcher-retraction"
  - "code-graph watcher retraction"
  - "structural watcher doc fix"
  - "read-path graph freshness"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/032-code-graph-watcher-retraction"
    last_updated_at: "2026-04-29T13:58:12Z"
    last_updated_by: "cli-codex"
    recent_action: "Watcher claim retracted"
    next_safe_action: "Plan packet 033 next"
    blockers: []
    completion_pct: 100
---

# Spec: Code Graph Watcher Retraction

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-29 |
| **Branch** | `main` |
| **Parent** | `026-graph-and-context-optimization` |
| **Depends On** | `031-doc-truth-pass` |
| **Related** | `013-automation-reality-supplemental-research` |
| **Mode** | Doc-only remediation |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

013 validated P1-1: the MCP server README had claimed real-time structural code-graph watching, but the adversarial retest found only markdown/spec-doc and skill-graph watcher paths. The actual code-graph contract is read-path selective repair plus operator-triggered full repair. [EVIDENCE: `../013-automation-reality-supplemental-research/research/research-report.md:84`; `../013-automation-reality-supplemental-research/research/iterations/iteration-004.md:67-72`]

### Purpose

Retract the structural watcher claim and document the real freshness model: `ensureCodeGraphReady()` can selectively reindex changed tracked files during query/context reads, `code_graph_scan` performs manual full repair, `code_graph_status` diagnoses without mutating, and `code_graph_query` blocks with required action when a full scan is needed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `.opencode/skill/system-spec-kit/mcp_server/README.md`
- Targeted checks in `.opencode/skill/system-spec-kit/SKILL.md`
- Targeted checks in `CLAUDE.md`
- Targeted checks in `.opencode/skill/system-spec-kit/references/config/hook_system.md`
- Packet-local docs under this `032-code-graph-watcher-retraction/` folder

### Out of Scope

- Runtime code changes
- Implementing a structural code-graph source watcher
- Modifying historical 012/013 research artifacts that record the prior finding
- Committing changes
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P1 Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Replace the README watcher wording with a code-graph freshness model. | README names read-path self-heal, manual full repair, read-only status, and blocked required-action behavior. |
| REQ-002 | Cite implementation evidence. | README references `ensure-ready.ts`, `scan.ts`, `status.ts`, `query.ts`, and the 013 report. |
| REQ-003 | Sweep inherited doc claims. | Targeted `rg` checks over watcher/real-time/code-graph wording find no current docs that promise a structural source watcher. |
| REQ-004 | Preserve doc-only scope. | No runtime `.ts`, `.js`, `.py`, or shell implementation files are modified. |
| REQ-005 | Complete Level 2 validation. | Strict validator exits 0 with `RESULT: PASSED`. |

### Acceptance Scenarios

- **SCN-001**: **Given** an operator reads indexing infrastructure docs, **when** they look for code-graph freshness behavior, **then** they see read-path/manual repair rather than real-time watcher promises.
- **SCN-002**: **Given** a graph read requires a broad rebuild, **when** the query handler cannot run a full scan inline, **then** docs point to `requiredAction: "code_graph_scan"`.
- **SCN-003**: **Given** an operator reads status docs, **when** they run `code_graph_status`, **then** docs describe it as diagnostic/read-only.
- **SCN-004**: **Given** an operator reads watcher docs, **when** they see `SPECKIT_FILE_WATCHER=true`, **then** docs scope it to markdown/spec-doc indexing rather than structural source watching.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: README freshness model documents the actual code-graph contract.
- **SC-002**: Related target docs are confirmed clean or patched.
- **SC-003**: Packet continuity reaches `completion_pct: 100` after validation.
- **SC-004**: Strict packet validator exits 0 with `RESULT: PASSED`.

### Acceptance Scenarios

- **SCN-005**: **Given** current operator docs mention structural graph freshness, **when** a reader follows the claim, **then** the docs name either read-path selective repair or operator-triggered `code_graph_scan`.
- **SCN-006**: **Given** historical research artifacts mention the old watcher overclaim, **when** they are encountered in search, **then** packet 032 docs explain they are evidence records, not current operator guidance.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | Historical research artifacts still mention the old claim | Treat them as evidence records, not current operator docs |
| Risk | README over-corrects and hides selective read-path repair | Name both selective self-heal and manual full repair |
| Dependency | 013 research report | Use section 4 P1-1 and section 6 Packet 032 as source-of-truth |
| Dependency | Strict validator | Run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/system-spec-kit/026-graph-and-context-optimization/032-code-graph-watcher-retraction --strict` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Every edited freshness claim must name its trigger or operator action.
- **NFR-R02**: File:line evidence must point at current implementation surfaces.

### Maintainability
- **NFR-M01**: Prefer a small README subsection over broad doc rewrites.
- **NFR-M02**: Keep command/tool names exact.

### Security
- **NFR-S01**: No secrets, local credentials, or user-specific config values are copied.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Historical research docs can preserve old wording when they are documenting the old finding.
- `SPECKIT_FILE_WATCHER=true` remains valid for markdown/spec-doc watching only.
- Query/context read paths can selectively self-heal, but full-scan states must remain operator-triggered.
- `code_graph_status` can surface readiness and quality metadata, but it must not be described as repair.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Files touched | Low | One primary README edit plus packet docs |
| Behavioral risk | Low | Documentation-only |
| Verification | Medium | Requires targeted wording sweep plus strict validator |
| Overall | Level 2 | User-facing P1 doc correction with validation checklist |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

No blocking questions. The user selected the beta path: retract the watcher claim and document read-path/manual freshness.
<!-- /ANCHOR:questions -->
