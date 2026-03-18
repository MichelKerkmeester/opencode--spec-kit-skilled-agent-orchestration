---
title: "Tasks: GPT-5.4 Agent Model Upgrade"
description: "Task Format: T### [P?] Description (file path)"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: GPT-5.4 Agent Model Upgrade

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Research and Inventory

- [x] T001 Confirm Copilot and Codex config requirements from docs and local patterns
- [x] T002 Inventory all target files and exclude non-pinned markdown agents from scope
- [x] T003 Create Level 2 spec artifacts in spec folder `027-copilot-gpt-5.4-agents`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: OpenCode Agent Updates

- [x] T004 Update Copilot OpenCode targets to `github-copilot/gpt-5.4` with explicit role-tuned `reasoningEffort` values (`.opencode/agent/*.md` subset)
- [x] T005 Update ChatGPT OpenCode targets to `openai/gpt-5.4` while preserving original `reasoningEffort` values (`.opencode/agent/chatgpt/*.md` subset)
- [x] T006 Update stale hardcoded review-model prose in both review agent files
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Codex Agent Updates and Verification

- [x] T007 [P] Add `model = "gpt-5.4"` to all `.codex/agents/*.toml` files
- [x] T008 Add top-level `model = "gpt-5.4"` to `.codex/config.toml` for direct Codex sessions
- [x] T009 Verify reasoning-effort values remain unchanged across ChatGPT and Codex surfaces
- [x] T010 Parse updated markdown frontmatter and TOML files successfully
- [x] T011 Verify no stale targeted model references remain in the changed scope
- [x] T012 Run spec validation and update checklist evidence
- [x] T013 Create `implementation-summary.md`
- [x] T014 Add changelog documenting final GPT-5.4 rollout and follow-up reasoning-tier tweaks
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Validation passes with no blocking errors
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
