---
title: "Implementation Summary: cli-opencode provider realignment + auth pre-flight"
description: "Removed github-copilot as a provider from the cli-opencode skill, promoted opencode-go/deepseek-v4-pro to the documented default, preserved the direct deepseek API surface, and added a Provider Auth Pre-Flight smart-fallback protocol."
trigger_phrases:
  - "cli-opencode 051"
  - "provider realignment summary"
  - "auth pre-flight"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "051-cli-opencode-providers"
    last_updated_at: "2026-04-29T11:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Auth pre-flight protocol added to SKILL.md, cli_reference.md, README.md FAQ; spec docs updated"
    next_safe_action: "Run /memory:save to refresh canonical continuity, then commit on main"
    blockers: []
    key_files:
      - ".opencode/skill/cli-opencode/SKILL.md"
      - ".opencode/skill/cli-opencode/README.md"
      - ".opencode/skill/cli-opencode/references/cli_reference.md"
      - ".opencode/skill/cli-opencode/manual_testing_playbook/manual_testing_playbook.md"
      - ".opencode/skill/cli-opencode/graph-metadata.json"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Default model after github-copilot removal? -> opencode-go/deepseek-v4-pro --variant high"
      - "Smart fallback when default isn't logged in? -> Pre-flight detects + ASKS user; never silent substitution"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec** | specs/051-cli-opencode-providers/ |
| **Branch** | `main` (originally `051-cli-opencode-providers`, branch deleted post-merge to main) |
| **Level** | 1 |
| **Status** | Complete |
| **Date** | 2026-04-29 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The cli-opencode skill no longer documents the `github-copilot` provider. Default invocation, model tables, agent dispatch examples, and test scenarios all use `opencode-go/deepseek-v4-pro --variant high` instead. The direct DeepSeek API surface (`deepseek/deepseek-v4-pro`, `deepseek/deepseek-v4-flash`) stays exactly as before.

A new **Provider Auth Pre-Flight (Smart Fallback)** protocol was added so the skill detects missing credentials before dispatching: a one-shot `opencode providers list` check at session start, a 3-state decision table (default available / default missing with fallback ready / both missing), and explicit user-prompt templates that ASK the user before substituting a model. ALWAYS rule 11 mandates the pre-flight; the error-handling table now points auth errors back to the protocol.

**Verification at completion:**
- `grep -ri "github-copilot" .opencode/skill/cli-opencode/` -> 0 hits (REQ-001, SC-001)
- `grep -ri "deepseek" .opencode/skill/cli-opencode/` -> 150+ hits preserved (REQ-003)
- `manual_testing_playbook/03--multi-provider/` -> 2 files (`003-deepseek-direct-api.md`, `004-variant-levels-comparison.md`); the two github-copilot-only entries deleted (REQ-004, SC-004)
- `graph-metadata.json` -> valid JSON, causal_summary updated (REQ-005)
- SKILL.md frontmatter Keywords HTML comment -> github-copilot dropped (REQ-006)
- SKILL.md §3 contains "Provider Auth Pre-Flight (Smart Fallback)" with bash pre-flight + 3-state table + user-prompt templates; cli_reference.md §4 mirrors it; README.md §8 FAQ has the Q/A (REQ-007, SC-005)
- SKILL.md ALWAYS rule 11 documents the pre-flight + cache invalidation contract (SC-006)
- SKILL.md error-handling table: `provider/model not found` row points to pre-flight; new `401 Unauthorized` row covers mid-dispatch credential expiry (REQ-008)
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

**Modified files:**
- `.opencode/skill/cli-opencode/SKILL.md` — frontmatter keywords; new §3 "Provider Auth Pre-Flight (Smart Fallback)" subsection; default invocation block; model selection table; agent dispatch invocation patterns; ALWAYS rule 3 + new ALWAYS rule 11; error-handling table (added `provider/model not found` revision + `401 Unauthorized` row); essential commands block
- `.opencode/skill/cli-opencode/README.md` — §1 key statistics; requirements row; §3.2 models table; §5 authentication + model defaults; §6 example commands; §8 FAQ (provider question + new auth pre-flight Q/A)
- `.opencode/skill/cli-opencode/references/cli_reference.md` — §4 default invocation table; §4 new "Provider Auth Pre-Flight (smart fallback)" subsection; §5 models table; §5 variant ranges
- `.opencode/skill/cli-opencode/references/integration_patterns.md` — example commands
- `.opencode/skill/cli-opencode/references/opencode_tools.md` — example commands
- `.opencode/skill/cli-opencode/references/agent_delegation.md` — example commands
- `.opencode/skill/cli-opencode/assets/prompt_templates.md` — example commands
- `.opencode/skill/cli-opencode/manual_testing_playbook/manual_testing_playbook.md` — coverage note; §9 multi-provider header + CO-009/CO-010 entries removed; root index updated
- `.opencode/skill/cli-opencode/manual_testing_playbook/03--multi-provider/003-deepseek-direct-api.md` — provider count narrative + cross-reference table
- `.opencode/skill/cli-opencode/manual_testing_playbook/03--multi-provider/004-variant-levels-comparison.md` — variant range narrative + troubleshooting note
- 25 other manual_testing_playbook entries — `--model github-copilot/{gpt-5.4,claude-sonnet-4.6}` substituted with `--model opencode-go/deepseek-v4-pro` (single bulk replacement)
- `.opencode/skill/cli-opencode/graph-metadata.json` — causal_summary names default provider opencode-go and surfaces direct deepseek

**Deleted files:**
- `.opencode/skill/cli-opencode/manual_testing_playbook/03--multi-provider/001-copilot-default-gpt-5-4.md`
- `.opencode/skill/cli-opencode/manual_testing_playbook/03--multi-provider/002-copilot-claude-sonnet-4-6.md`

**New files:**
- `specs/051-cli-opencode-providers/` — spec.md, plan.md, tasks.md, implementation-summary.md, description.json, graph-metadata.json (auto-generated)
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **New default model**: `opencode-go/deepseek-v4-pro --variant high` was chosen because the README FAQ already recommended it and it provides the highest-capability reasoning model on the opencode-go gateway at low cost.
- **Bulk replacement strategy**: 28 playbook files contained the same `--model github-copilot/gpt-5.4` and `--model github-copilot/claude-sonnet-4.6` strings inline in shell commands. A single `find … -exec sed -i ''` call replaced both strings across all files.
- **Multi-provider section renumbering**: CO-009 and CO-010 (the two github-copilot-only test scenarios) were deleted entirely rather than retitled. CO-011 (deepseek direct API) and CO-012 (variant levels) keep their existing IDs so cross-references stay valid; the multi-provider section header now reads `CO-011..CO-012`.
- **Smart fallback policy is ASK-not-substitute**: the pre-flight protocol surfaces a 3-option menu when the default is missing (use configured fallback, log in to default and retry, or name a different model) rather than silently swapping providers. This protects the user from unexpected costs, latency profiles, or capability mismatches when a model gets substituted.
- **One-shot pre-flight + auth-error cache invalidation**: the pre-flight runs once per session, not per dispatch, to avoid repeated `opencode providers list` calls. Auth errors mid-dispatch invalidate the cache and rerun the protocol.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- **REQ-001 / SC-001**: `grep -ri "github-copilot" .opencode/skill/cli-opencode/` returns 0 hits.
- **REQ-002 / SC-002**: SKILL.md §3 Default Invocation block shows `opencode-go/deepseek-v4-pro --variant high`. README.md §1 key statistics row matches.
- **REQ-003**: `deepseek/deepseek-v4-pro` and `deepseek/deepseek-v4-flash` rows still present in SKILL.md §3 Model Selection, README.md §3.2 Models, cli_reference.md §5 model table.
- **REQ-004 / SC-004**: `manual_testing_playbook/03--multi-provider/` directory contains only `003-deepseek-direct-api.md` and `004-variant-levels-comparison.md`.
- **REQ-005**: graph-metadata.json `causal_summary` reads "Defaults to provider opencode-go (model deepseek-v4-pro, variant high) and additionally surfaces the direct deepseek API."
- **REQ-006**: SKILL.md frontmatter HTML comment Keywords list reads `..., agent-delegation, opencode-go, deepseek -->` (no github-copilot provider token).
- **REQ-007 / SC-005**: SKILL.md §3 has a "Provider Auth Pre-Flight (Smart Fallback)" subsection with the bash pre-flight, 3-state decision table, and user-prompt templates. cli_reference.md §4 has a matching "Provider Auth Pre-Flight (smart fallback)" subsection. README.md §8 FAQ has "Q: What if the default provider isn't logged in on this machine?".
- **REQ-008**: SKILL.md error-handling table contains `provider/model not found` (→ run pre-flight) and `401 Unauthorized` mid-dispatch (→ invalidate cache, rerun pre-flight, ask before fallback).
- **SC-006**: SKILL.md ALWAYS section has rule 11: "Run the Provider Auth Pre-Flight once per session…"
- **JSON validity**: graph-metadata.json passes `python3 -m json.tool`.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- The skill's `version` frontmatter field in SKILL.md was not bumped (still `1.2.0.0`); a follow-on patch could bump to `1.3.0.0` to mark the provider-removal + auth-pre-flight change.
- The skill advisor index has not been rebuilt; the keyword changes in SKILL.md frontmatter take effect on next `doctor:skill-advisor` run.
- The pre-flight script assumes `opencode providers list` returns plain text matchable by `grep`. If the binary's output format changes (different version), the detection regex would need an update — this is documented as a v1.3.17-pinned dependency in cli_reference.md §9.
<!-- /ANCHOR:limitations -->

---
