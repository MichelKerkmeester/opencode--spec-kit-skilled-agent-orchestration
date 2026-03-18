---
title: "Spec 017: Agent Provider Switching with Primary Runtime Path [017-agent-provider-switch/spec]"
description: "This spec introduces provider-aware agent profile switching while keeping .opencode/agent/*.md as the single runtime path used by commands and orchestration. The system will sta..."
trigger_phrases:
  - "spec"
  - "017"
  - "agent"
  - "provider"
  - "switching"
importance_tier: "important"
contextType: "decision"
---
# Spec 017: Agent Provider Switching with Primary Runtime Path

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

This spec introduces provider-aware agent profile switching while keeping `.opencode/agent/*.md` as the single runtime path used by commands and orchestration. The system will stage provider variants in profile folders (`copilot`, `chatgpt`) and activate one profile into the primary path through a controlled script.

**Key Decisions**: Keep primary runtime path unchanged; use script-based profile activation (copy + verify) instead of path refactors.

**Critical Dependencies**: Existing command and orchestration references to `.opencode/agent/*.md` must remain valid.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-02-16 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Agent and command references are intentionally anchored to `.opencode/agent/*.md`, but provider-specific model configurations differ between GitHub Copilot and ChatGPT/OpenAI. Without a switching mechanism, teams either duplicate references everywhere or manually edit active agent files, both of which are error-prone.

### Purpose
Provide a safe, deterministic provider switch workflow that preserves `.opencode/agent/*.md` as the authoritative runtime path.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Introduce provider profile structure for agent variants (`copilot`, `chatgpt`)
- Implement activation script to sync selected provider into `.opencode/agent/*.md`
- Add validation/reporting for active provider state
- Document operational workflow for switching providers safely

### Out of Scope
- Refactoring existing command references away from `.opencode/agent/*.md`
- Redesigning agent prompts/instructions beyond profile-specific frontmatter
- Runtime model benchmarking between providers

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/agent/copilot/` | Create | Source-of-truth Copilot agent variants |
| `.opencode/agent/chatgpt/` | Update/Verify | Source-of-truth ChatGPT/OpenAI variants |
| `.opencode/agent/scripts/activate-provider.sh` | Create | Activate profile into primary runtime path |
| `.opencode/agent/scripts/provider-status.sh` | Create | Report currently active provider/profile health |
| `.opencode/README.md` | Modify | Document profile switching workflow |
| `.opencode/specs/04--agent-orchestration/z_archive/017-agent-provider-switch/*` | Modify | Level 3 spec documentation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Preserve primary runtime path | All command/orchestrator references continue to target `.opencode/agent/*.md` |
| REQ-002 | Provider activation script | Running activation for `copilot` or `chatgpt` updates all runtime agent files deterministically |
| REQ-003 | Atomic and safe activation | Script creates backup and does not leave mixed-provider partial state on failure |
| REQ-004 | Post-activation verification | Script verifies expected model frontmatter for all 8 agents and exits non-zero on mismatch |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Provider status command | Status output identifies active provider and file health |
| REQ-006 | Idempotent behavior | Re-running activation for active provider produces no unintended diffs |
| REQ-007 | Copilot profile source parity | `.opencode/agent/copilot/*.md` exists and mirrors intended Copilot frontmatter |
| REQ-008 | Documentation update | README or equivalent docs explain switch commands, safety model, and troubleshooting |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `activate-provider.sh copilot` and `activate-provider.sh chatgpt` both complete successfully and produce expected runtime frontmatter.
- **SC-002**: Existing commands that reference `.opencode/agent/*.md` work unchanged after provider switching.
- **SC-003**: Failure path test confirms rollback restores previous runtime state.
- **SC-004**: Documentation enables a contributor to switch providers in under 2 minutes without manual file edits.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Current orchestration assumptions | Incorrect routing if path assumptions change | Keep runtime path fixed and profile switching internal |
| Risk | Partial file update during activation | Mixed provider state; hard-to-debug runtime behavior | Backup + atomic copy + validation + rollback |
| Risk | Profile drift over time | Source and runtime mismatch | Add status/verification command and update checklist |
| Risk | New agent added but not in profile sets | Incomplete activation | Validate exact expected agent file set |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Provider activation completes in under 5 seconds on local workspace.

### Security
- **NFR-S01**: No secrets or tokens are written by activation/status scripts.

### Reliability
- **NFR-R01**: Activation scripts must be deterministic and produce identical results on repeated runs for same profile.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Missing profile folder: script exits with actionable error and does not modify runtime files.
- Missing runtime agent file: script recreates from selected profile set or aborts safely by policy.

### Error Scenarios
- Copy failure mid-run: rollback to backup and non-zero exit.
- Unknown provider argument: usage message + non-zero exit.
- Uncommitted local edits in `.opencode/agent/*.md`: warn and require explicit `--force` (or abort by default).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | 8 agent files + scripts + docs |
| Risk | 19/25 | Runtime path invariants, rollback safety |
| Research | 12/20 | Provider behavior and activation strategy |
| Multi-Agent | 10/15 | Agent profile parity and orchestration impact |
| Coordination | 11/15 | Scripting + documentation + verification |
| **Total** | **70/100** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Runtime path accidentally refactored | H | M | Hard requirement REQ-001 + review gate |
| R-002 | Mixed profile state after failed switch | H | M | Backup/rollback + validation |
| R-003 | Profile file drift over time | M | M | Status command + checklist validation |
| R-004 | Wrapper/command confusion | M | L | Clear docs and explicit command names |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Switch to ChatGPT profile (Priority: P0)

**As a** developer using ChatGPT/OpenAI in OpenCode, **I want** to activate ChatGPT agent frontmatter in one command, **so that** all existing commands continue working with the right provider models.

**Acceptance Criteria**:
1. Given a valid project checkout, When I run `activate-provider.sh chatgpt`, Then `.opencode/agent/*.md` reflects ChatGPT model frontmatter for all managed agents.

---

### US-002: Switch back to Copilot profile (Priority: P0)

**As a** developer using Copilot, **I want** to restore Copilot agent frontmatter quickly, **so that** I can move between providers without hand edits.

**Acceptance Criteria**:
1. Given ChatGPT profile is active, When I run `activate-provider.sh copilot`, Then runtime agents match Copilot profile.

---

### US-003: Verify active provider state (Priority: P1)

**As a** maintainer, **I want** a status command, **so that** I can confirm active provider and detect drift before debugging orchestration issues.

**Acceptance Criteria**:
1. Given any active provider, When I run `provider-status.sh`, Then I get provider identity and per-file verification results.

---

### US-004: Safe failure behavior (Priority: P1)

**As a** maintainer, **I want** rollback on activation failure, **so that** runtime agent state remains consistent.

**Acceptance Criteria**:
1. Given an induced copy/verification failure, When activation fails, Then previous runtime state is restored from backup.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Should activation abort when git working tree has unstaged changes in `.opencode/agent/*.md`, or allow with warning by default?
- Should we store the active provider marker in a file (for faster status checks), or infer from runtime frontmatter every time?
- Do we want launch wrappers (`opencode-copilot`, `opencode-chatgpt`) in this spec or defer to a follow-up?
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:acceptance-scenarios -->
## 13. ACCEPTANCE SCENARIOS

1. **Given** runtime agents are in Copilot mode, **When** `activate-provider.sh chatgpt` runs, **Then** all managed runtime agent files match ChatGPT profile expectations.
2. **Given** runtime agents are in ChatGPT mode, **When** `activate-provider.sh copilot` runs, **Then** all managed runtime agent files match Copilot profile expectations.
3. **Given** a missing provider profile folder, **When** activation is requested, **Then** the script exits non-zero and runtime files remain unchanged.
4. **Given** a copy failure during activation, **When** verification fails, **Then** backup restore is executed and previous runtime state is recovered.
5. **Given** provider activation has completed, **When** `provider-status.sh` runs, **Then** active provider and per-file verification status are reported.
6. **Given** provider activation is run twice for the same provider, **When** no profile source has changed, **Then** the second run is idempotent (no unintended diffs).
<!-- /ANCHOR:acceptance-scenarios -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
