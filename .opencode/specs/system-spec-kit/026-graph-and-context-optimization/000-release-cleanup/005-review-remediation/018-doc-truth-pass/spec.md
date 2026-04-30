---
title: "Spec: Doc Truth Pass"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Tier A doc-only remediation for automation truth: hook contracts, CCC docs, handler paths, validation wording, and trigger columns."
trigger_phrases:
  - "018-doc-truth-pass"
  - "doc truth pass"
  - "automation doc fixes"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/018-doc-truth-pass"
    last_updated_at: "2026-04-29T20:35:30+02:00"
    last_updated_by: "cli-codex"
    recent_action: "Resource map indexed"
    next_safe_action: "Use packet for downstream work"
    blockers: []
    completion_pct: 100
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Spec: Doc Truth Pass

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
| **Depends On** | `017-automation-reality-supplemental-research` |
| **Related** | `016-automation-self-management-deep-research` |
| **Mode** | Doc-only remediation |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The 013 supplemental research found that several operator-facing docs describe automation more broadly than the implementation supports. The highest-leverage Tier A fixes are documentation-only:

1. Copilot hook docs conflict: shared hook docs still mention a stale Claude-style wrapper, while the Copilot-local README says Copilot does not use `.claude/settings.local.json`. [EVIDENCE: `../017-automation-reality-supplemental-research/research/research-report.md:41`; `../../../../.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/README.md:27-34`]
2. Codex hook docs blur repo examples with live registration: the current user runtime has `~/.codex/hooks.json` plus `[features].codex_hooks = true`, while repo `.codex/settings.json` is only an example template. [EVIDENCE: `../017-automation-reality-supplemental-research/research/iterations/iteration-004.md:85-89`]
3. CCC command docs and architecture docs point to stale homes or stale paths. [EVIDENCE: `../017-automation-reality-supplemental-research/research/research-report.md:93-94`]
4. Validation docs use "automatic" wording where the real contract is a workflow-required gate backed by `validate.sh`. [EVIDENCE: `../017-automation-reality-supplemental-research/research/research-report.md:95-96`]
5. Broad automation docs lack a trigger column, making manual, half-auto, and runtime-hooked behavior easy to conflate. [EVIDENCE: `../017-automation-reality-supplemental-research/research/research-report.md:11-49`]

### Purpose

Patch the docs so automation claims name their real trigger: runtime hook, slash command, direct MCP call, feature flag, read path, startup path, or no runtime trigger.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Shared hook-system reference under `.opencode/skill/system-spec-kit/references/config/`
- `.opencode/command/memory/README.txt` or `.opencode/command/memory/manage.md`
- System-spec-kit architecture guide
- `AGENTS.md`
- `CLAUDE.md`
- System-spec-kit skill guide
- `.opencode/skill/system-spec-kit/mcp_server/README.md`
- Packet-local docs under this `018-doc-truth-pass/` folder

### Out of Scope

- Runtime code changes (`.ts`, `.js`, `.py`, shell hook implementations)
- Feature implementation for code graph watcher, retention sweep, or hook smoke checks
- Modifying 012 or 013 research artifacts
- Committing changes
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P1 Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Make Copilot-local README authoritative. | The shared hook reference defers Copilot registration to the Copilot-local README and removes stale `.claude/settings.local.json` wrapper claims. |
| REQ-002 | Clarify Codex live registration. | Docs state `.codex/settings.json` is an example template and user/workspace `hooks.json` plus `[features].codex_hooks` is the live registration contract. |
| REQ-003 | Document Codex legacy/current contracts. | The shared hook-system reference lists current native hooks and legacy/fallback behavior with dated/version notes. |
| REQ-004 | Fix CCC command-home mismatch. | Either `/memory:manage` routes CCC tools, or README says CCC tools are MCP-only. |
| REQ-005 | Fix stale CCC architecture paths. | The architecture guide points at `mcp_server/code_graph/handlers/*.ts` and the `index.ts` exports. |
| REQ-006 | Reword validation auto-fire claims. | AGENTS and SKILL docs say validation is workflow-required and show `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <packet> --strict`. |
| REQ-007 | Add trigger columns to broad automation claims. | CLAUDE, SKILL, MCP server README, and hook-system docs include trigger/default/manual-fallback columns where automation claims are summarized. |

### Acceptance Scenarios

1. Given an operator reads Copilot hook setup, when they follow shared docs, then they land on the Copilot README and `.github/hooks`/writer-script path rather than a Claude settings wrapper.
2. Given an operator reads Codex hook setup, when they compare repo `.codex/settings.json` with live runtime, then docs distinguish template examples from `~/.codex/config.toml` and `~/.codex/hooks.json`.
3. Given an operator reads validation gates, when they claim completion, then docs tell them to run strict validation rather than expect a hidden runtime hook.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All seven requested doc remediations are applied without runtime code edits.
- **SC-002**: Strict packet validator exits 0 with `RESULT: PASSED`.
- **SC-003**: Trigger columns cite real operator or runtime triggers from 013 sections 2 and 5.
- **SC-004**: Packet continuity reaches `completion_pct: 100` after implementation.

### Acceptance Scenarios

- **SCN-001**: **Given** an operator reads Copilot hook setup, **when** they follow shared docs, **then** they land on the Copilot-local contract instead of a Claude settings wrapper.
- **SCN-002**: **Given** an operator reads Codex hook setup, **when** they compare repo examples with live runtime, **then** the docs distinguish template examples from user/workspace hook registration.
- **SCN-003**: **Given** an operator reads validation gates, **when** they claim completion, **then** the docs tell them to run strict validation rather than expect a hidden runtime hook.
- **SCN-004**: **Given** an operator reads automation summaries, **when** a behavior is half/manual, **then** the table names the trigger or direct MCP fallback.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | Docs over-correct into implementation choices for packets 032-034 | Keep claims descriptive; no code behavior promises beyond current triggers |
| Risk | Multiple docs contain duplicate hook matrices | Patch the shared reference and the broad summaries that repeat it |
| Risk | User-level Codex config can expose local-only state | Cite paths and contract shape only; do not copy secrets or unrelated config |
| Dependency | 013 research report | Use sections 2 and 5 as source-of-truth for triggers and findings |
| Dependency | Strict validator | Run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/018-doc-truth-pass --strict` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Every broad automation claim changed by this packet must name a trigger or manual fallback.
- **NFR-R02**: Existing command names and tool identifiers must remain exact.

### Maintainability
- **NFR-M01**: Prefer small table/text edits over large rewrites.
- **NFR-M02**: Preserve existing documentation tone and anchors.

### Security
- **NFR-S01**: Do not include secret values from user-level runtime config.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- If `/memory:manage` cannot route CCC tools without command surface expansion, update `README.txt` to say CCC tools are MCP-only.
- If a table already has dense columns, add a compact `Trigger` or `Trigger / default` column rather than duplicating prose.
- If a claim is half-automated, label the operator trigger and the automatic sub-trigger separately.
- If no runtime trigger exists, say so plainly.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Files touched | Medium | Multiple docs, no runtime code |
| Behavioral risk | Low | Documentation-only |
| Verification | Medium | Strict spec validation plus targeted text checks |
| Overall | Level 2 | Several user-facing docs need coordinated truth alignment |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

No blocking questions. The packet follows 013's Tier A recommendation and user-provided scope.
<!-- /ANCHOR:questions -->
