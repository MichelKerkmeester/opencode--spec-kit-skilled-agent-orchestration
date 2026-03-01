---
title: "Verification Checklist: Task 04 — Agent Configs Audit [task-04-agent-alignment/checklist]"
description: "Verification Date: 2026-02-16 (manual re-check)"
trigger_phrases:
  - "verification"
  - "checklist"
  - "task"
  - "agent"
  - "configs"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Verification Checklist: Task 04 — Agent Configs Audit

<!-- SPECKIT_LEVEL: 3+ -->

---

## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

---

## P0 — Model Assignments

- [x] CHK-001 [P0] Handover agent = Haiku on OpenCode (`.opencode/agent/handover.md`) [Evidence: Agent A16 verified cross-platform alignment]
- [x] CHK-002 [P0] Handover agent = Haiku on Claude Code (`.claude/agents/handover.md`) [Evidence: Agent A17 switched model from sonnet to haiku]
- [x] CHK-003 [P0] Handover agent = fast profile on Codex (`.codex/agents/handover.md`) [Evidence: Agent A18 verified Codex frontmatter alignment]
- [x] CHK-004 [P0] Review agent model-agnostic on OpenCode (`.opencode/agent/review.md`) [Evidence: Agent A16 added spec-015 note about model-agnostic frontmatter]
- [x] CHK-005 [P0] Review agent model-agnostic on Claude Code (`.claude/agents/review.md`) [Evidence: Agent A17 updated frontmatter descriptions]
- [x] CHK-006 [P0] Review agent = readonly profile on Codex (`.codex/agents/review.md`) [Evidence: Agent A18 verified Codex profile alignment]

## P0 — Codex Frontmatter

- [x] CHK-007 [P0] All 8 `.codex/agents/*.md` files use Codex-native frontmatter [Evidence: Agent A18 preserved Codex frontmatter while updating bodies]
- [ ] CHK-008 [P0] `.codex/config.toml` has 4 profiles (fast, balanced, powerful, readonly) [PENDING: config.toml not modified in wave1]
- [ ] CHK-009 [P0] `.codex/config.toml` has sub-agent dispatch MCP [PENDING: config.toml not modified in wave1]

## P1 — AGENTS.md + Consistency

- [x] CHK-010 [P1] `AGENTS.md` routing rules include all spec 014 additions [Evidence: Agent A20 added cross-platform mapping and tier details]
- [x] CHK-011 [P1] `AGENTS.md` notes handover = Haiku [Evidence: Agent A20 documented fast-tier routing including handover]
- [x] CHK-012 [P1] `AGENTS.md` notes review = model-agnostic [Evidence: Agent A20 documented read-only tier with model-agnostic behavior]
- [x] CHK-013 [P1] Agent body content consistent across all 3 platforms [Evidence: Agent A16/A17/A18 synchronized bodies with explicit parity notes]

## P2 — Description Consistency

- [x] CHK-020 [P2] Agent descriptions match between platforms [Evidence: Agents A17 and A18 aligned frontmatter descriptions]
- [x] CHK-021 [P2] All 8 agents listed in AGENTS.md [Evidence: Agent A20 updated agent routing table]

## Output Verification

- [x] CHK-030 [P0] changes.md populated with all required edits [Evidence: changes.md contains 25 file updates across 4 agents]
- [x] CHK-031 [P0] No placeholder text in changes.md [Evidence: All entries contain concrete evidence from agent notes]

---

## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 9/11 |
| P1 Items | 4 | 4/4 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-02-16 (manual re-check)

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P1] Audit methodology documented in plan.md
- [ ] CHK-101 [P1] Cross-platform agent strategy clearly defined in spec.md
- [ ] CHK-102 [P2] Rationale for model assignments documented (spec 016)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-110 [P0] All Codex agent configs use Codex-native frontmatter format
- [ ] CHK-111 [P0] Handover agent = Haiku across all 3 platforms
- [ ] CHK-112 [P0] Review agent model-agnostic across all 3 platforms
- [ ] CHK-113 [P1] Profile-to-agent mapping correct for Codex platform
- [ ] CHK-114 [P1] Agent body content consistent across platforms
- [ ] CHK-115 [P2] Agent descriptions match between platforms
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-120 [P0] changes.md contains before/after text for each edit
- [ ] CHK-121 [P0] All edits have priority markers (P0/P1/P2)
- [ ] CHK-122 [P1] Rationale provided for each change
- [ ] CHK-123 [P1] File paths in changes.md are accurate
- [ ] CHK-124 [P2] Changes organized by platform for easy implementation
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Spec Owner | Documentation Lead | [ ] Approved | |
| Tech Lead | System Architect | [ ] Approved | |
| Platform Maintainers | OpenCode/Claude/Codex | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
