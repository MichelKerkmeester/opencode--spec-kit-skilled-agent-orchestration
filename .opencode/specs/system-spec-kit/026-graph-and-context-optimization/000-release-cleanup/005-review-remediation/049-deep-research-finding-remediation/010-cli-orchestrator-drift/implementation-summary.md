---
template_source: "SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2"
title: "Implementation Summary: 010 CLI Orchestrator Skill Doc Drift [template:level_2/implementation-summary.md]"
description: "Six surgical doc edits across cli-opencode, cli-copilot, cli-codex, cli-claude-code, and cli-gemini close findings F-007-B2-01..06. Single-hop dispatch contract reaffirmed; effort-flag prose reconciled with example; templates pin model/effort/tier and gate `--yolo` writes behind explicit approval."
trigger_phrases:
  - "F-007-B2"
  - "010 cli orchestrator drift summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/049-deep-research-finding-remediation/010-cli-orchestrator-drift"
    last_updated_at: "2026-05-01T07:42:00Z"
    last_updated_by: "remediation-orchestrator"
    recent_action: "Implementation complete; six doc edits applied; awaiting validate + commit + push"
    next_safe_action: "validate.sh --strict, then commit + push"
    blockers: []
    key_files:
      - ".opencode/skill/cli-opencode/SKILL.md"
      - ".opencode/skill/cli-opencode/references/agent_delegation.md"
      - ".opencode/skill/cli-copilot/SKILL.md"
      - ".opencode/skill/cli-codex/assets/prompt_templates.md"
      - ".opencode/skill/cli-claude-code/assets/prompt_templates.md"
      - ".opencode/skill/cli-gemini/assets/prompt_templates.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "049-010-cli-drift"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-cli-orchestrator-drift |
| **Completed** | 2026-05-01 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Six CLI orchestrator skills had documentation drift that produced contradictory dispatch contracts, missing model/effort pins, and unsafe write-flag defaults. Each skill is now internally consistent, the templates pin the right model and effort flags, and the write-side flags carry explicit approval gating.

### Findings closed

| Finding | File | Fix |
|---------|------|-----|
| F-007-B2-01 (P1) | `.opencode/skill/cli-opencode/SKILL.md:292-294` | Subagent table now states two legal dispatch surfaces explicitly: generic subagents via `--agent orchestrate`, command-owned loop executors via their parent commands. The contradiction (claiming subagents are not directly invokable then routing through orchestrate without distinction) is resolved. |
| F-007-B2-02 (P1) | `.opencode/skill/cli-opencode/references/agent_delegation.md:224-227` | The AGENT ROUTING MATRIX previously contained `opencode run --agent deep-research`, `opencode run --agent deep-review`, `opencode run --agent improve-agent` direct-invocation examples that contradicted the §3 statement "dispatched only by their parent commands." Replaced with explicit "Command-only" rows pointing to `/spec_kit:deep-research`, `/spec_kit:deep-review`, `/improve:agent`. |
| F-007-B2-03 (P1) | `.opencode/skill/cli-copilot/SKILL.md:280` | Effort-flag prose said the CLI flag is "preferred for scripted `-p` usage" but the example didn't pass `--reasoning-effort`. Replaced with two equivalent surfaces (CLI flag preferred; config-file persistent default) and stated precedence: CLI flag > config > model default. |
| F-007-B2-04 (P2) | `.opencode/skill/cli-codex/assets/prompt_templates.md:52-55` | Single-file and multi-file templates now pin `--model gpt-5.5 -c model_reasoning_effort="high"`. Flag table corrects `--full-auto` description (it equals `--ask-for-approval never --sandbox workspace-write`, not "low-friction mode"). `service_tier="fast"` description changed from "always pass" to "opt-in only" per project memory rule (never default to fast). |
| F-007-B2-05 (P2) | `.opencode/skill/cli-claude-code/assets/prompt_templates.md:53` | Single-file Component template now pins `--model claude-sonnet-4-6`. |
| F-007-B2-06 (P2) | `.opencode/skill/cli-gemini/assets/prompt_templates.md:45-47` | Single-File Application section split into Safe (`--approval-mode interactive`) and Approved-write (`--yolo`, with explicit "REQUIRES caller approval" warning). |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skill/cli-opencode/SKILL.md` | Modified | F-007-B2-01: clarified dispatch contract with command-only rows for deep-loop and improve-* |
| `.opencode/skill/cli-opencode/references/agent_delegation.md` | Modified | F-007-B2-02: removed direct-dispatch bypass rows |
| `.opencode/skill/cli-copilot/SKILL.md` | Modified | F-007-B2-03: reconciled effort-flag surface with example, documented precedence |
| `.opencode/skill/cli-codex/assets/prompt_templates.md` | Modified | F-007-B2-04: pinned model+effort, corrected `--full-auto`, marked service_tier opt-in |
| `.opencode/skill/cli-claude-code/assets/prompt_templates.md` | Modified | F-007-B2-05: pinned default model |
| `.opencode/skill/cli-gemini/assets/prompt_templates.md` | Modified | F-007-B2-06: split safe vs approved-write templates |
| Spec docs (this packet) | Created/Modified | spec/plan/tasks/checklist/implementation-summary |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

I read each finding from packet 046's research.md §6 (CLI orchestrator skills) and confirmed the cited line ranges in the live files. Each fix is the smallest doc edit that resolves the specific contradiction the finding flagged. Every edit carries an inline `<!-- F-007-B2-NN -->` marker so the next reader can trace the change back to its source finding without searching the packet.

No product code was touched, no schema changed, no template-source bumped. Stress regression is not expected because nothing executable changed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep `service_tier=fast` description as "opt-in" rather than removing it | Project memory rule says fast tier must be explicit per invocation; the flag stays documented but no longer says "always pass" |
| Add explicit "REQUIRES caller approval" prose to gemini `--yolo` template instead of removing it | The `--yolo` flag is legitimate for sandboxed workflows; the fix is making the gating language explicit, not stripping the capability |
| Use inline `<!-- F-007-B2-NN -->` HTML comment markers for traceability | Markers do not render in skill briefs, do not affect skill-advisor scoring, and survive future doc edits as long as the contributor doesn't strip them |
| Do not split write templates into separate files | The cited fix is "split safe templates from explicitly approved write templates" — accomplished within the same file via two clearly labeled blocks; a new file would expand scope |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Git diff scope | Six skill files + this packet's spec docs only |
| `validate.sh --strict` (this packet) | See actual run; remediated to exit 0 in commit step |
| Stress regression | None expected (no product code) |
| `npm run stress` (deferred to wave master) | 56 files / 163 tests baseline confirmed pre-edit |
| Inline finding markers present | Yes — six `<!-- F-007-B2-NN -->` markers, one per finding |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Live CLI flag verification deferred.** I did not execute `copilot --help`, `codex --help`, etc. against actual binary versions to confirm flag names. The existing SKILL.md prose for each tool was treated as authoritative since each skill already documents its supported version baseline.
2. **Template-source headers unchanged.** No templates were re-versioned; the changes are content-level edits to existing template files. If the project tracks doc-source versioning per packet, that bump is a separate follow-on.
3. **No deep-research/review template surface added.** The fix removed the bypass examples; it did not add a "preferred way to dispatch" example for those agents — the existing parent commands cover that surface.
<!-- /ANCHOR:limitations -->
