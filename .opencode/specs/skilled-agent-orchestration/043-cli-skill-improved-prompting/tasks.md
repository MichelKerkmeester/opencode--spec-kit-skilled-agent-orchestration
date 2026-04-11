<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
---
title: "Tasks: CLI Skill Prompt-Quality Integration via Mirror Cards [043]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "043 tasks"
  - "mirror card tasks"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/043-cli-skill-improved-prompting"
    last_updated_at: "2026-04-11T19:30:00Z"
    last_updated_by: "codex"
    recent_action: "Marked all implementation and verification tasks complete with evidence"
    next_safe_action: "Preserve task evidence during commit and changelog publication"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/043-cli-skill-improved-prompting/tasks.md"
      - ".opencode/specs/skilled-agent-orchestration/043-cli-skill-improved-prompting/checklist.md"
    session_dedup:
      fingerprint: "sha256:043-cli-skill-improved-prompting"
      session_id: "043-cli-skill-improved-prompting"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All 34 planned tasks are complete and evidence-backed"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
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

- [x] T001 Create the canonical prompt-quality card (sk-improve-prompt asset surface) `[Evidence: ls .opencode/skill/sk-improve-prompt/assets/cli_prompt_quality_card.md]`
- [x] T002 Update the `sk-improve-prompt` skill definition with the canonical-card reference `[Evidence: rg -n "cli_prompt_quality_card\\.md|External consumption entry point" .opencode/skill/sk-improve-prompt/SKILL.md]`
- [x] T003 Add the `@improve-prompt` agent invocation contract to the `sk-improve-prompt` skill definition `[Evidence: rg -n "Agent Invocation Contract|FRAMEWORK:|CLEAR_SCORE:|ENHANCED_PROMPT:|ESCALATION_NOTES:" .opencode/skill/sk-improve-prompt/SKILL.md]`
- [x] T004 Add the fast-path asset section and trigger-language update, then bump the skill version to `1.3.0.0` `[Evidence: rg -n "version: 1\\.3\\.0\\.0|FAST-PATH ASSET|invoked indirectly via" .opencode/skill/sk-improve-prompt/SKILL.md]`
- [x] T005 Decide whether the optional drift fixture lands in this packet or is deferred with rationale `[Evidence: ls .opencode/skill/scripts/check-prompt-quality-card-sync.sh; bash .opencode/skill/scripts/check-prompt-quality-card-sync.sh -> SYNC OK]`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 [P] Create the Claude Code mirror card (Claude Code asset surface) `[Evidence: ls .opencode/skill/cli-claude-code/assets/prompt_quality_card.md; rg -n "^<!-- sync:|^Source of truth:" .opencode/skill/cli-claude-code/assets/prompt_quality_card.md]`
- [x] T011 [P] Create the Codex mirror card (Codex asset surface) `[Evidence: ls .opencode/skill/cli-codex/assets/prompt_quality_card.md; rg -n "^<!-- sync:|^Source of truth:" .opencode/skill/cli-codex/assets/prompt_quality_card.md]`
- [x] T012 [P] Create the Copilot mirror card (Copilot asset surface) `[Evidence: ls .opencode/skill/cli-copilot/assets/prompt_quality_card.md; rg -n "^<!-- sync:|^Source of truth:" .opencode/skill/cli-copilot/assets/prompt_quality_card.md]`
- [x] T013 [P] Create the Gemini mirror card (Gemini asset surface) `[Evidence: ls .opencode/skill/cli-gemini/assets/prompt_quality_card.md; rg -n "^<!-- sync:|^Source of truth:" .opencode/skill/cli-gemini/assets/prompt_quality_card.md]`
- [x] T014 Update Claude Code skill routing and rules for local-card loading `[Evidence: .opencode/skill/cli-claude-code/SKILL.md:105,112,146,429]`
- [x] T015 Update Codex skill routing and rules for local-card loading `[Evidence: .opencode/skill/cli-codex/SKILL.md:101,108,142,446]`
- [x] T016 Update Copilot skill routing and rules for local-card loading `[Evidence: .opencode/skill/cli-copilot/SKILL.md:99,106,140,299]`
- [x] T017 Update Gemini skill routing and rules for local-card loading `[Evidence: .opencode/skill/cli-gemini/SKILL.md:98,105,139,373]`
- [x] T018 [P] Add framework tags to Claude Code prompt templates `[Evidence: grep -c '^Framework:' .opencode/skill/cli-claude-code/assets/prompt_templates.md -> 25]`
- [x] T019 [P] Add framework tags to Codex prompt templates `[Evidence: grep -c '^Framework:' .opencode/skill/cli-codex/assets/prompt_templates.md -> 34]`
- [x] T020 [P] Add framework tags to Copilot prompt templates `[Evidence: grep -c '^Framework:' .opencode/skill/cli-copilot/assets/prompt_templates.md -> 20]`
- [x] T021 [P] Add framework tags to Gemini prompt templates `[Evidence: grep -c '^Framework:' .opencode/skill/cli-gemini/assets/prompt_templates.md -> 24]`

- [x] T022 Create the canonical OpenCode runtime agent for `@improve-prompt` `[Evidence: ls .opencode/agent/improve-prompt.md; rg -n "name: improve-prompt|FRAMEWORK:|CLEAR_SCORE:|ENHANCED_PROMPT:|ESCALATION_NOTES:" .opencode/agent/improve-prompt.md]`
- [x] T023 Create the Claude runtime mirror for `@improve-prompt` `[Evidence: ls .claude/agents/improve-prompt.md; rg -n "name: improve-prompt|FRAMEWORK:|CLEAR_SCORE:|ENHANCED_PROMPT:|ESCALATION_NOTES:" .claude/agents/improve-prompt.md]`
- [x] T024 Create the Codex runtime mirror for `@improve-prompt` `[Evidence: ls .codex/agents/improve-prompt.toml; rg -n "name = \"improve-prompt\"|FRAMEWORK:|CLEAR_SCORE:|ENHANCED_PROMPT:|ESCALATION_NOTES:" .codex/agents/improve-prompt.toml]`
- [x] T025 Create the Gemini runtime mirror after confirming the runtime directory is active `[Evidence: ls .gemini/agents/improve-prompt.md; rg -n "name: improve-prompt|FRAMEWORK:|CLEAR_SCORE:|ENHANCED_PROMPT:|ESCALATION_NOTES:" .gemini/agents/improve-prompt.md]`
- [x] T026 Verify all four runtime mirrors share the same input contract, guardrails, and structured output shape `[Evidence: rg -n "FRAMEWORK:|CLEAR_SCORE:|ENHANCED_PROMPT:|ESCALATION_NOTES:" .opencode/agent/improve-prompt.md .claude/agents/improve-prompt.md .codex/agents/improve-prompt.toml .gemini/agents/improve-prompt.md]`

- [x] T027 Add dispatch-mode selection to `/improve:prompt` `[Evidence: .opencode/command/improve/prompt.md:89-91,138,178]`
- [x] T028 Document auto-routing to agent mode when complexity or isolation signals require it `[Evidence: .opencode/command/improve/prompt.md:89-91,296-297,367-381]`
- [x] T029 Keep inline mode as the default for ordinary interactive prompt work `[Evidence: .opencode/command/improve/prompt.md:91,204,217,381]`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T030 Run static file-presence checks for the canonical card, mirror cards, runtime agents, and drift-check script `[Evidence: ls .opencode/skill/sk-improve-prompt/assets/cli_prompt_quality_card.md .opencode/skill/cli-claude-code/assets/prompt_quality_card.md .opencode/skill/cli-codex/assets/prompt_quality_card.md .opencode/skill/cli-copilot/assets/prompt_quality_card.md .opencode/skill/cli-gemini/assets/prompt_quality_card.md .opencode/agent/improve-prompt.md .claude/agents/improve-prompt.md .codex/agents/improve-prompt.toml .gemini/agents/improve-prompt.md .opencode/skill/scripts/check-prompt-quality-card-sync.sh -> all present]`
- [x] T031 Run guard-safety checks that confirm no routable prompt-quality path contains `..` `[Evidence: if grep -H 'prompt_quality_card' .opencode/skill/cli-*/SKILL.md | grep '\\.\\.'; then echo FOUND; else echo NO_DOTDOT_MATCHES; fi -> NO_DOTDOT_MATCHES]`
- [x] T032 Run framework-tag presence checks against the four CLI prompt-template files `[Evidence: grep -c '^Framework:' .opencode/skill/cli-*/assets/prompt_templates.md -> 25/34/20/24]`
- [x] T033 Review the escalation contract manually across CLI skills, `@improve-prompt`, and `/improve:prompt` `[Evidence: rg -n "FRAMEWORK:|CLEAR_SCORE:|ENHANCED_PROMPT:|ESCALATION_NOTES:" .opencode/agent/improve-prompt.md .claude/agents/improve-prompt.md .codex/agents/improve-prompt.toml .gemini/agents/improve-prompt.md; rg -n "dispatch_mode|@improve-prompt|complexity_hint" .opencode/command/improve/prompt.md; rg -n "prompt_quality_card\\.md" .opencode/skill/cli-*/SKILL.md -> contract fields, dispatch-mode routing, and local-card loading all present]`
- [x] T034 Run strict packet validation on `.opencode/specs/skilled-agent-orchestration/043-cli-skill-improved-prompting/` `[Evidence: bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --strict .opencode/specs/skilled-agent-orchestration/043-cli-skill-improved-prompting -> RESULT: PASSED (Errors: 0, Warnings: 0)]`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remain without an explicit user-approved deferral
- [x] Guard-safe path rules, runtime parity, and command-contract alignment are all verified
- [x] Packet docs still match the final landed scope
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
