---
title: "Verification Checklist: CLI Skill Prompt-Quality Integration via Mirror Cards"
description: "Verification Date: 2026-04-11 Current Packet State: Implemented and packet-closeout docs verified from landed surfaces and static command evidence."
trigger_phrases:
  - "cli skill improved prompting"
  - "skilled agent orchestration"
  - "cli skill prompt quality integration via"
  - "cli skill improved prompting checklist"
importance_tier: "normal"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/043-cli-skill-improved-prompting"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled frontmatter (repo-wide gap fill)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["checklist.md"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
---
title: "Verification Checklist: CLI Skill [skilled-agent-orchestration/043-cli-skill-improved-prompting/checklist]"
description: "Verification Date: 2026-04-11 closeout"
trigger_phrases:
  - "043 checklist"
  - "prompt quality verification"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/043-cli-skill-improved-prompting"
    last_updated_at: "2026-04-11T19:30:00Z"
    last_updated_by: "codex"
    recent_action: "Closed packet verification with current command evidence"
    next_safe_action: "Re-run strict validation if packet docs change again"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/043-cli-skill-improved-prompting/checklist.md"
      - ".opencode/skill/skill-advisor/scripts/check-prompt-quality-card-sync.sh"
    session_dedup:
      fingerprint: "sha256:043-cli-skill-improved-prompting"
      session_id: "043-cli-skill-improved-prompting"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Static verification and packet validation were completed for closeout"
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: CLI Skill Prompt-Quality Integration via Mirror Cards

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim packet completion until complete |
| **[P1]** | Required | Must complete or receive user-approved deferral |
| **[P2]** | Optional | May defer with a documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements are documented in `spec.md` [Evidence: `.opencode/specs/skilled-agent-orchestration/043-cli-skill-improved-prompting/spec.md`]
- [x] CHK-002 [P0] Technical approach is defined in `plan.md` [Evidence: `.opencode/specs/skilled-agent-orchestration/043-cli-skill-improved-prompting/plan.md`]
- [x] CHK-003 [P1] Current guard constraints and active runtime directories were inspected from real repo files [Evidence: `rg -n "prompt_quality_card\\.md|LOADING_LEVELS\\[\\\"ALWAYS\\\"\\]" .opencode/skill/cli-*/SKILL.md`; `ls .opencode/agent/improve-prompt.md .claude/agents/improve-prompt.md .codex/agents/improve-prompt.toml .gemini/agents/improve-prompt.md`]
- [x] CHK-004 [P1] Optional drift-fixture decision is recorded before packet closeout [Evidence: `.opencode/skill/skill-advisor/scripts/check-prompt-quality-card-sync.sh`; `bash .opencode/skill/skill-advisor/scripts/check-prompt-quality-card-sync.sh -> SYNC OK`]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The canonical prompt-quality card exists under `sk-improve-prompt/assets/` [Evidence: `ls .opencode/skill/sk-improve-prompt/assets/cli_prompt_quality_card.md`]
- [x] CHK-011 [P0] Four local mirror cards exist under the CLI skill `assets/` folders [Evidence: `ls .opencode/skill/cli-claude-code/assets/prompt_quality_card.md .opencode/skill/cli-codex/assets/prompt_quality_card.md .opencode/skill/cli-copilot/assets/prompt_quality_card.md .opencode/skill/cli-gemini/assets/prompt_quality_card.md`]
- [x] CHK-012 [P0] Every CLI skill adds the local prompt-quality card to the `ALWAYS` loading block [Evidence: `.opencode/skill/cli-claude-code/SKILL.md:112,146`; `.opencode/skill/cli-codex/SKILL.md:108,142`; `.opencode/skill/cli-copilot/SKILL.md:106,140`; `.opencode/skill/cli-gemini/SKILL.md:105,139`]
- [x] CHK-013 [P0] No CLI skill uses a `..` routable path for prompt-quality resources [Evidence: `if grep -H 'prompt_quality_card' .opencode/skill/cli-*/SKILL.md | grep '\\.\\.'; then echo FOUND; else echo NO_DOTDOT_MATCHES; fi` -> `NO_DOTDOT_MATCHES`]
- [x] CHK-014 [P1] Each CLI skill documents the CLEAR pre-dispatch check and escalation trigger rule [Evidence: `.opencode/skill/cli-claude-code/assets/prompt_quality_card.md:29,39`; `.opencode/skill/cli-codex/assets/prompt_quality_card.md:29,39`; `.opencode/skill/cli-copilot/assets/prompt_quality_card.md:29,39`; `.opencode/skill/cli-gemini/assets/prompt_quality_card.md:29,39`; skill rule lines at `429`, `446`, `299`, `373`]
- [x] CHK-015 [P1] The `sk-improve-prompt` skill definition documents the agent invocation contract and fast-path asset [Evidence: `.opencode/skill/sk-improve-prompt/SKILL.md:343,424-426`; `rg -n "FRAMEWORK:|CLEAR_SCORE:|ENHANCED_PROMPT:|ESCALATION_NOTES:" .opencode/skill/sk-improve-prompt/SKILL.md`]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Presence checks pass for the canonical card, four mirror cards, and four runtime agent definitions [Evidence: `ls .opencode/skill/sk-improve-prompt/assets/cli_prompt_quality_card.md .opencode/skill/cli-claude-code/assets/prompt_quality_card.md .opencode/skill/cli-codex/assets/prompt_quality_card.md .opencode/skill/cli-copilot/assets/prompt_quality_card.md .opencode/skill/cli-gemini/assets/prompt_quality_card.md .opencode/agent/improve-prompt.md .claude/agents/improve-prompt.md .codex/agents/improve-prompt.toml .gemini/agents/improve-prompt.md`]
- [x] CHK-021 [P0] Framework-tag presence checks pass for all four CLI prompt-template assets [Evidence: `grep -c '^Framework:' .opencode/skill/cli-*/assets/prompt_templates.md` -> `25`, `34`, `20`, `24`]
- [x] CHK-022 [P1] Guard-safety checks confirm no prompt-quality path in CLI skills contains `..` [Evidence: `if grep -H 'prompt_quality_card' .opencode/skill/cli-*/SKILL.md | grep '\\.\\.'; then echo FOUND; else echo NO_DOTDOT_MATCHES; fi` -> `NO_DOTDOT_MATCHES`]
- [x] CHK-023 [P1] Manual contract review confirms the CLI skills, `@improve-prompt`, and `/improve:prompt` all describe the same structured escalation output [Evidence: `rg -n "FRAMEWORK:|CLEAR_SCORE:|ENHANCED_PROMPT:|ESCALATION_NOTES:" .opencode/agent/improve-prompt.md .claude/agents/improve-prompt.md .codex/agents/improve-prompt.toml .gemini/agents/improve-prompt.md`; `rg -n "dispatch_mode|@improve-prompt|complexity_hint" .opencode/command/improve/prompt.md`; `rg -n "prompt_quality_card\\.md" .opencode/skill/cli-*/SKILL.md`]
- [x] CHK-024 [P1] Strict packet validation passes for `.opencode/specs/skilled-agent-orchestration/043-cli-skill-improved-prompting/` [Evidence: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --strict .opencode/specs/skilled-agent-orchestration/043-cli-skill-improved-prompting` -> `RESULT: PASSED`]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Compliance/security-sensitive prompts are documented as escalation triggers, not fast-path-only cases [Evidence: `.opencode/skill/cli-claude-code/assets/prompt_quality_card.md:39`; same wording present in the three other mirror cards]
- [x] CHK-031 [P1] The `@improve-prompt` agent remains read-only and leaf-only across all runtime mirrors [Evidence: `.opencode/agent/improve-prompt.md:4,20`; `.claude/agents/improve-prompt.md:3,21`; `.codex/agents/improve-prompt.toml:4,6`; `.gemini/agents/improve-prompt.md:3,23`]
- [x] CHK-032 [P1] No change weakens the existing runtime sandbox or routing constraints described in the current agent formats [Evidence: `.codex/agents/improve-prompt.toml:6` retains `sandbox_mode = "read-only"`; CLI skills continue to use local card paths under `.opencode/skill/cli-*/assets/` only]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md`, and `decision-record.md` describe the same two-tier architecture [Evidence: packet root docs all describe mirror-card fast path plus `@improve-prompt` deep path]
- [x] CHK-041 [P1] The implementation summary is updated from placeholder to delivery summary once implementation completes [Evidence: `.opencode/specs/skilled-agent-orchestration/043-cli-skill-improved-prompting/implementation-summary.md`]
- [x] CHK-042 [P1] The packet explicitly records whether the drift fixture landed or was deferred [Evidence: `spec.md` open-questions closeout note plus `.opencode/skill/skill-advisor/scripts/check-prompt-quality-card-sync.sh`]
- [x] CHK-043 [P1] The command and skill docs both point to the same `@improve-prompt` escalation surface [Evidence: `.opencode/command/improve/prompt.md:296-297,367-381`; `.opencode/skill/cli-claude-code/assets/prompt_quality_card.md:39-41`; parallel mirror-card wording in the other three CLI skills]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] New assets stay inside the correct skill trees and do not introduce shared cross-skill routing paths [Evidence: all prompt-quality cards live under `.opencode/skill/.../assets/`; `NO_DOTDOT_MATCHES` guard check passed]
- [x] CHK-051 [P1] Runtime mirrors exist only in the active runtime directories already present in this repo [Evidence: `ls .opencode/agent/improve-prompt.md .claude/agents/improve-prompt.md .codex/agents/improve-prompt.toml .gemini/agents/improve-prompt.md`]
- [x] CHK-052 [P1] Packet-local docs remain synchronized with the final implementation scope [Evidence: closeout updates landed in `tasks.md`, `checklist.md`, `implementation-summary.md`, and minimal consistency notes in `spec.md`]
- [x] CHK-053 [P2] Any temporary analysis or smoke-test notes stay in `scratch/` only [Evidence: no new packet-local scratch notes were added during this closeout update]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 26 | 26/26 |
| P2 Items | 7 | 7/7 |

**Verification Date**: 2026-04-11
**Current Packet State**: Implemented and packet-closeout docs verified from landed surfaces and static command evidence.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions are captured in `decision-record.md` [Evidence: `.opencode/specs/skilled-agent-orchestration/043-cli-skill-improved-prompting/decision-record.md`]
- [x] CHK-101 [P1] Mirror-card versus cross-skill-reference tradeoffs are documented with rejection rationale [Evidence: ADR-001 alternatives table in `decision-record.md`]
- [x] CHK-102 [P1] Fast-path versus deep-path behavior is documented consistently across spec, plan, and command surfaces [Evidence: `spec.md`, `plan.md`, and `.opencode/command/improve/prompt.md:217,296-297,367-381`]
- [x] CHK-103 [P2] Drift-management guidance is documented and reviewed [Evidence: mirror `<!-- sync: ... -->` footers plus `.opencode/skill/skill-advisor/scripts/check-prompt-quality-card-sync.sh`]
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] Routine CLI dispatches document the lightweight fast-path token budget goal [Evidence: `spec.md` NFR-P01 and success criteria]
- [x] CHK-111 [P1] Agent escalation remains reserved for high-complexity or compliance-heavy prompts [Evidence: `.opencode/command/improve/prompt.md:89-91,296-297`; mirror-card escalation wording at line `39` in each CLI card]
- [x] CHK-112 [P2] Mirror-card size stays intentionally compact after implementation [Evidence: each mirror card contains only the framework table, task map, CLEAR check, escalation block, and sync footer]
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Runtime agent mirrors are present in all active runtime directories [Evidence: `ls .opencode/agent/improve-prompt.md .claude/agents/improve-prompt.md .codex/agents/improve-prompt.toml .gemini/agents/improve-prompt.md`]
- [x] CHK-121 [P1] `/improve:prompt` inline mode remains the default for ordinary prompt work [Evidence: `.opencode/command/improve/prompt.md:91,204,381`]
- [x] CHK-122 [P1] Agent mode auto-selection is documented for complexity or isolation signals [Evidence: `.opencode/command/improve/prompt.md:89-90,296-297,367-381`]
- [x] CHK-123 [P2] A rollback note exists for removing the mirror-card system if needed [Evidence: `plan.md` rollback section]
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] Compliance/security triggers explicitly route to agent mode [Evidence: mirror-card escalation wording at line `39` in all four CLI cards]
- [x] CHK-131 [P1] The packet preserves the decision to leave `skill_advisor.py` unchanged [Evidence: `spec.md` out-of-scope section and ADR-001 decision bundle D-006]
- [x] CHK-132 [P2] Optional drift-check automation is reviewed for maintenance cost before landing [Evidence: implementation summary decision table plus landed `.opencode/skill/skill-advisor/scripts/check-prompt-quality-card-sync.sh`]
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] All planning docs exist in the packet root [Evidence: `rg --files .opencode/specs/skilled-agent-orchestration/043-cli-skill-improved-prompting`]
- [x] CHK-141 [P1] All planning docs reflect the same file inventory and requirement numbering [Evidence: packet root docs after closeout update]
- [x] CHK-142 [P2] The implementation summary is converted from placeholder to final summary at closeout [Evidence: `.opencode/specs/skilled-agent-orchestration/043-cli-skill-improved-prompting/implementation-summary.md`]
- [x] CHK-143 [P2] Memory save is completed after implementation if the user requests context preservation [Evidence: not requested in this doc-only closeout, so no packet memory save was required]
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| [User] | Packet Owner | [ ] Pending packet-owner confirmation | |
| [AI assistant] | Implementation Operator | [x] Packet docs updated to reflect landed implementation | 2026-04-11 |
| [AI assistant] | Verification Owner | [x] Static evidence and strict validation completed | 2026-04-11 |
<!-- /ANCHOR:sign-off -->
