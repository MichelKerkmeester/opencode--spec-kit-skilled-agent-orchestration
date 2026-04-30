---
title: "Tasks: cli-opencode provider realignment"
description: "Numbered task list for the 051 packet."
trigger_phrases:
  - "cli-opencode tasks"
  - "provider realignment tasks"
importance_tier: "normal"
contextType: "general"
---
# Tasks: cli-opencode provider realignment

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` pending, `[x]` complete
- `[P]` parallel-eligible (independent file edit)
- `T###` task id, sequential

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Top-Level Docs

- [x] T001 Edit `.opencode/skill/cli-opencode/SKILL.md`: replace all `github-copilot/*` model references with `opencode-go/deepseek-v4-pro`; drop copilot rows from §3 model table; update §3 default invocation block; rewrite ALWAYS rule 3; remove copilot from frontmatter Keywords HTML comment; update §3 OpenCode Agent Delegation invocation patterns.
- [x] T002 [P] Edit `.opencode/skill/cli-opencode/README.md`: update §1 key statistics row "Default invocation" and "Supported providers"; rewrite §3.2 Models table; update §5 Model Defaults; update §6 example commands; update §8 FAQ Models Q/A.

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: References

- [x] T003 [P] Edit `.opencode/skill/cli-opencode/references/cli_reference.md`: update §6 default invocation; drop github-copilot rows from model + variant tables; ensure deepseek rows remain.
- [x] T004 [P] Edit `.opencode/skill/cli-opencode/references/integration_patterns.md`: replace `--model github-copilot/*` lines with `--model opencode-go/deepseek-v4-pro`.
- [x] T005 [P] Edit `.opencode/skill/cli-opencode/references/opencode_tools.md`: replace `--model github-copilot/*` example.
- [x] T006 [P] Edit `.opencode/skill/cli-opencode/references/agent_delegation.md`: replace `--model github-copilot/*` lines.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Templates and Playbook

- [x] T007 Edit `.opencode/skill/cli-opencode/assets/prompt_templates.md`: replace `--model github-copilot/*` examples with `--model opencode-go/deepseek-v4-pro`.
- [x] T008 Delete `.opencode/skill/cli-opencode/manual_testing_playbook/03--multi-provider/001-copilot-default-gpt-5-4.md`.
- [x] T009 Delete `.opencode/skill/cli-opencode/manual_testing_playbook/03--multi-provider/002-copilot-claude-sonnet-4-6.md`.
- [x] T010 Edit `.opencode/skill/cli-opencode/manual_testing_playbook/manual_testing_playbook.md`: update root index; drop the two deleted entries; update any opencode-go/deepseek language.
- [x] T011 Edit `.opencode/skill/cli-opencode/manual_testing_playbook/03--multi-provider/004-variant-levels-comparison.md`: replace github-copilot variant comparison with opencode-go/deepseek-v4-pro variant comparison.
- [x] T012 Sweep all remaining playbook entries and replace `github-copilot/*` model identifiers in example commands with `opencode-go/deepseek-v4-pro`.

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Metadata + Verification

- [x] T013 Edit `.opencode/skill/cli-opencode/graph-metadata.json`: update causal_summary to drop github-copilot from the provider list; drop copilot from intent_signals/derived.trigger_phrases if present in provider context.
- [x] T014 Run `grep -ri "github-copilot" .opencode/skill/cli-opencode/` and confirm zero hits.
- [x] T015 Run `grep -ri "cli-copilot" .opencode/skill/cli-opencode/` and confirm sibling-skill references still present.
- [x] T016 Run `grep -ri "deepseek" .opencode/skill/cli-opencode/` and confirm direct DeepSeek API references preserved.

<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Provider Auth Pre-Flight (Smart Fallback)

- [x] T017 Add "Provider Auth Pre-Flight (Smart Fallback)" subsection to SKILL.md §3 with pre-flight bash script, 3-state decision table, and two user-prompt templates (default-missing-with-fallback, both-missing).
- [x] T018 Add ALWAYS rule 11 to SKILL.md mandating the pre-flight on first dispatch + cache invalidation on auth error.
- [x] T019 Update SKILL.md §3 Error Handling table: replace generic `provider/model not found` row with one that points to the pre-flight; add a `401 Unauthorized` mid-dispatch row.
- [x] T020 Add "Provider Auth Pre-Flight (smart fallback)" subsection to cli_reference.md §4 with pre-flight commands, 3-state decision table, login command shapes, and the auth-error contract.
- [x] T021 Add FAQ entry "What if the default provider isn't logged in on this machine?" to README.md §8.
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- All 16 tasks marked `[x]`
- REQ-001 through REQ-007 satisfied
- `implementation-summary.md` written with file diff inventory
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- spec.md (REQ-001..REQ-007, SC-001..SC-004)
- plan.md (Phase 1..6 mapping)
<!-- /ANCHOR:cross-refs -->

---
