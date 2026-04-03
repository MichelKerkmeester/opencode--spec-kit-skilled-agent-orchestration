---
title: "Verification Checklist: sk-git Superset Worktree [03--commands-and-skills/006-sk-git-superset-worktrees/checklist]"
description: "Verification Date: 2026-02-28"
trigger_phrases:
  - "sk-git superset checklist"
  - "worktree alignment verification"
importance_tier: "normal"
contextType: "general"
---
# Verification Checklist: sk-git Superset Worktree Alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

---

---
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Superset reference research complete (3-agent findings)

---

---
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Centralized directory convention documented: `~/.opencode/worktrees/<project>/<branch>/`
- [ ] CHK-011 [P0] worktree.json lifecycle hooks: `{ "setup": [...], "teardown": [...] }` with examples
- [ ] CHK-012 [P0] Security gate: AI shows lifecycle commands and gets user confirmation before executing
- [ ] CHK-013 [P0] Config vs auto-detect rule: worktree.json replaces auto-detect when non-empty
- [ ] CHK-014 [P0] Init flow adapted from Superset phases: verify → fetch → create → copy config → setup → ready
- [ ] CHK-015 [P0] Base branch multi-step fallback: remote → local tracking → local → common names
- [ ] CHK-016 [P0] Backward compatibility: `.worktrees/` project-local still supported
- [ ] CHK-017 [P0] Directory resolution priority consistent across plan.md and decision-record.md
- [ ] CHK-018 [P1] Gitignored config copying: `.opencode/` dir copied from main repo to worktree
- [ ] CHK-019 [P1] Pre-deletion safety checks: uncommitted changes, unpushed commits
- [ ] CHK-020 [P1] Configurable teardown: reads from worktree.json teardown array (with security gate)
- [ ] CHK-021 [P1] Worktree recommended as default workspace choice (Option B)
- [ ] CHK-022 [P1] Hook tolerance: worktree creation continues if post-checkout hook fails
- [ ] CHK-023 [P1] Migration note: document path change from `~/.config/superpowers/worktrees/` to `~/.opencode/worktrees/`

### Deferred Items (NOT in scope — tracked for follow-up)

- [ ] CHK-D01 [P2] Branch name sanitization pipeline (deferred to follow-up spec)
- [ ] CHK-D02 [P2] Environment variable injection: SK_GIT_ROOT_PATH, SK_GIT_WORKSPACE_NAME (deferred)
- [ ] CHK-D03 [P2] Multi-level config resolution hierarchy (deferred)

---

- [ ] CHK-040 [P0] All git commands have exact syntax (no ambiguous placeholders)
- [ ] CHK-041 [P0] No broken internal references between files
- [ ] CHK-042 [P0] Naming consistent: `.opencode/worktree.json` (NOT config.json) throughout
- [ ] CHK-043 [P1] Terminology consistent: "workspace" = worktree throughout
- [ ] CHK-044 [P1] Each in-scope Superset concept has documented sk-git equivalent
- [ ] CHK-045 [P1] No references to "1:1 aligned" — use "adapted from Superset" instead
- [ ] CHK-046 [P2] Examples cover common stacks (Node.js, Python, Docker)

---

---
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Manual validation complete
- [ ] CHK-022 [P1] Edge cases reviewed
- [ ] CHK-023 [P1] Error scenarios documented

---
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-050 [P0] worktree.json lifecycle scripts require explicit user confirmation
- [ ] CHK-051 [P0] Documentation warns about malicious worktree.json in cloned repos
- [ ] CHK-052 [P1] User can decline script execution without blocking worktree creation

---

---
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-060 [P1] spec.md, plan.md, checklist.md synchronized
- [ ] CHK-061 [P1] Decision records documented (ADR-001 Accepted, ADR-002 Accepted, ADR-003 Deferred)
- [ ] CHK-062 [P2] Memory context saved to spec folder

---

---

- [ ] CHK-140 [P1] All spec documents synchronized
- [ ] CHK-141 [P1] Usage docs updated where needed
- [ ] CHK-142 [P2] User-facing docs updated where needed
- [ ] CHK-143 [P2] Handover notes prepared if needed

---
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

### File Changes

- [ ] CHK-030 [P0] SKILL.md updated (lifecycle map, routing, workspace enforcement)
- [ ] CHK-031 [P0] references/worktree_workflows.md rewritten (9-step adapted-from-Superset flow)
- [ ] CHK-032 [P1] references/finish_workflows.md updated (teardown with security gate, safety checks)
- [ ] CHK-033 [P1] references/shared_patterns.md updated (worktree.json lifecycle, base branch resolution, gitignored copy)
- [ ] CHK-034 [P1] references/quick_reference.md updated (centralized dirs, worktree.json)
- [ ] CHK-035 [P1] assets/worktree_checklist.md updated (aligned with new flow)
- [ ] CHK-036 [P1] `assets/worktree_config_template.json` created (example .opencode/worktree.json)

---

---
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 0/13 |
| P1 Items | 13 | 0/13 |
| P2 Items | 5 | 0/5 |

**Verification Date**: [pending implementation]

---

---
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Architecture decisions documented (ADR-001: centralized storage, ADR-002: config lifecycle + security gate, ADR-003: branch sanitization — deferred)
- [ ] CHK-101 [P1] ADR-001 and ADR-002 have "Accepted" status; ADR-003 has "Deferred" status
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale
- [ ] CHK-103 [P2] Migration path from `~/.config/superpowers/worktrees/` documented

---

---
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Performance expectations reviewed
- [ ] CHK-111 [P1] Throughput or latency expectations documented
- [ ] CHK-112 [P2] Benchmarks captured if applicable
- [ ] CHK-113 [P2] Performance notes documented

---
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented
- [ ] CHK-121 [P0] Backward compatibility reviewed
- [ ] CHK-122 [P1] Monitoring or runbook updated if applicable
- [ ] CHK-123 [P1] Deployment notes documented
- [ ] CHK-124 [P2] Release checklist reviewed

---
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Security review completed
- [ ] CHK-131 [P1] Dependency and compatibility review completed
- [ ] CHK-132 [P2] Abuse and edge-case coverage documented
- [ ] CHK-133 [P2] Sensitive data handling reviewed

---
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All spec documents synchronized
- [ ] CHK-141 [P1] Usage docs updated where needed
- [ ] CHK-142 [P2] User-facing docs updated where needed
- [ ] CHK-143 [P2] Handover notes prepared if needed
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| TBD | Technical Lead | [ ] Approved | |
| TBD | Product Owner | [ ] Approved | |
| TBD | QA Lead | [ ] Approved | |

---
<!-- /ANCHOR:sign-off -->

---
