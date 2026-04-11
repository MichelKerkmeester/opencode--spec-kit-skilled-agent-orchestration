---
title: "Tasks: CLI Skill Prompt-Quality Integration via Mirror Cards [043]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "043 tasks"
  - "mirror card tasks"
importance_tier: "important"
contextType: "planning"
---
# Tasks: CLI Skill Prompt-Quality Integration via Mirror Cards

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

### AI Execution Protocol

### Pre-Task Checklist

- Confirm the packet scope stays inside the spec folder plus the implementation surfaces listed in `spec.md`.
- Confirm the `_guard_in_skill()` same-tree routing invariant remains unchanged.
- Confirm whether the optional drift fixture is in or out before closeout.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| `GUARD-SAFE` | Do not introduce routable `..` paths for prompt-quality assets. |
| `FAST-PATH-FIRST` | Keep routine CLI prompt improvement on the mirror-card path. |
| `AGENT-ONLY-ON-ESCALATION` | Reserve `@improve-prompt` for complexity, compliance, stakeholder spread, or ambiguity triggers. |
| `RUNTIME-PARITY` | Keep OpenCode, Claude, Codex, and Gemini agent surfaces aligned. |
| `NO-ADVISOR-CHURN` | Leave `skill_advisor.py` untouched in this packet. |

### Status Reporting Format

- `pending`: task not started
- `in-progress`: work is active
- `blocked`: waiting on a prerequisite or explicit decision
- `completed`: change landed and verification evidence recorded

### Blocked Task Protocol

- If the optional drift-fixture decision blocks closeout, mark only that task blocked instead of widening packet scope.
- If runtime parity cannot be achieved in one surface, stop and record the exact runtime gap before continuing.

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Create the canonical prompt-quality card (sk-improve-prompt asset surface)
- [ ] T002 Update the `sk-improve-prompt` skill definition with the canonical-card reference
- [ ] T003 Add the `@improve-prompt` agent invocation contract to the `sk-improve-prompt` skill definition
- [ ] T004 Add the fast-path asset section and trigger-language update, then bump the skill version to `1.3.0.0`
- [ ] T005 Decide whether the optional drift fixture lands in this packet or is deferred with rationale
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T010 [P] Create the Claude Code mirror card (Claude Code asset surface)
- [ ] T011 [P] Create the Codex mirror card (Codex asset surface)
- [ ] T012 [P] Create the Copilot mirror card (Copilot asset surface)
- [ ] T013 [P] Create the Gemini mirror card (Gemini asset surface)
- [ ] T014 Update Claude Code skill routing and rules for local-card loading
- [ ] T015 Update Codex skill routing and rules for local-card loading
- [ ] T016 Update Copilot skill routing and rules for local-card loading
- [ ] T017 Update Gemini skill routing and rules for local-card loading
- [ ] T018 [P] Add framework tags to Claude Code prompt templates
- [ ] T019 [P] Add framework tags to Codex prompt templates
- [ ] T020 [P] Add framework tags to Copilot prompt templates
- [ ] T021 [P] Add framework tags to Gemini prompt templates

- [ ] T022 Create the canonical OpenCode runtime agent for `@improve-prompt`
- [ ] T023 Create the Claude runtime mirror for `@improve-prompt`
- [ ] T024 Create the Codex runtime mirror for `@improve-prompt`
- [ ] T025 Create the Gemini runtime mirror after confirming the runtime directory is active
- [ ] T026 Verify all four runtime mirrors share the same input contract, guardrails, and structured output shape

- [ ] T027 Add dispatch-mode selection to `/improve:prompt`
- [ ] T028 Document auto-routing to agent mode when complexity or isolation signals require it
- [ ] T029 Keep inline mode as the default for ordinary interactive prompt work
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T030 Run static file-presence checks for the canonical card, mirror cards, and runtime agents
- [ ] T031 Run guard-safety checks that confirm no routable prompt-quality path contains `..`
- [ ] T032 Run framework-tag presence checks against the four CLI prompt-template files
- [ ] T033 Review the escalation contract manually across CLI skills, `@improve-prompt`, and `/improve:prompt`
- [ ] T034 Run strict packet validation on `.opencode/specs/skilled-agent-orchestration/043-cli-skill-improved-prompting/`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remain without an explicit user-approved deferral
- [ ] Guard-safe path rules, runtime parity, and command-contract alignment are all verified
- [ ] Packet docs still match the final landed scope
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
