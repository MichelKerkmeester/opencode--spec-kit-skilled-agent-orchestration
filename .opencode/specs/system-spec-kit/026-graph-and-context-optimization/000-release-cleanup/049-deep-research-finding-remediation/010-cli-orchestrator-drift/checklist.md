---
template_source: "SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2"
title: "Quality Checklist: 010 CLI Orchestrator Skill Doc Drift [template:level_2/checklist.md]"
description: "QA gates for F-007-B2-01..06 remediation. Doc-only changes, no stress regression expected."
trigger_phrases:
  - "F-007-B2 checklist"
  - "010 cli orchestrator drift checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/049-deep-research-finding-remediation/010-cli-orchestrator-drift"
    last_updated_at: "2026-05-01T07:39:00Z"
    last_updated_by: "remediation-orchestrator"
    recent_action: "Checklist authored"
    next_safe_action: "Tick items as validation/commit/push complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "049-010-cli-drift"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions: []
---
# Verification Checklist: 010 CLI Orchestrator Skill Doc Drift

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This is a doc-only remediation packet. Verification is structural (validate.sh) plus diff-scope review. No automated tests are added because no product code changes.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] [P1] Read packet 046 §6 (CLI orchestrator skills) findings F-007-B2-01..06
- [x] [P1] Confirmed each cited file:line still matches the research.md claim
- [x] [P1] Authored spec.md, plan.md, tasks.md, checklist.md (this file), implementation-summary.md
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] [P1] Each edit is the smallest doc change that resolves the finding
- [x] [P1] No template-source bumps (template_source headers unchanged)
- [x] [P2] Each edit carries an inline `<!-- F-007-B2-NN -->` marker for traceability
- [x] [P1] No prose outside the cited line ranges was modified
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] [P1] No automated tests added (doc-only change)
- [ ] [P1] `validate.sh --strict` on this packet exits 0
- [ ] [P2] Wave master `npm run stress` confirms no regression after Wave 1 (deferred to wave master)
<!-- /ANCHOR:testing -->

<!-- ANCHOR:security -->
## Security

- [x] [P1] No secrets, tokens, or credentials in any edit
- [x] [P1] `--yolo` and `--full-auto` flag descriptions now carry explicit approval-required language
- [x] [P1] No external links added; all references stay within the repo
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] [P1] All six findings have a row in the Findings closed table
- [x] [P1] Implementation-summary.md describes the actual fix per finding (not generic)
- [x] [P2] Plan.md numbered phases match the eight steps actually run
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] [P1] Only six skill files modified outside this packet
- [x] [P1] No `mcp_server/**` files touched (no product code surface affected)
- [x] [P1] Spec docs live at this packet's root, not in `scratch/`
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

### Findings closed

| ID | File | Evidence |
|----|------|----------|
| F-007-B2-01 (P1) | cli-opencode/SKILL.md | Subagent contract clarified at line 292 with `<!-- F-007-B2-01 -->` marker |
| F-007-B2-02 (P1) | cli-opencode/references/agent_delegation.md | Deep-loop rows say "Command-only" at lines 224-227 with `<!-- F-007-B2-02 -->` markers |
| F-007-B2-03 (P1) | cli-copilot/SKILL.md | Effort-flag has two surfaces and explicit precedence at line 280 with `<!-- F-007-B2-03 -->` marker |
| F-007-B2-04 (P2) | cli-codex/assets/prompt_templates.md | Templates pin model+effort; `--full-auto` corrected; `service_tier=fast` marked opt-in with `<!-- F-007-B2-04 -->` markers |
| F-007-B2-05 (P2) | cli-claude-code/assets/prompt_templates.md | Single-file template pins `--model claude-sonnet-4-6` with `<!-- F-007-B2-05 -->` marker |
| F-007-B2-06 (P2) | cli-gemini/assets/prompt_templates.md | Splits safe vs approved-write with `<!-- F-007-B2-06 -->` marker |

### Status

- [x] All six findings closed
- [ ] validate.sh --strict exit 0 (pending — final step before commit)
- [ ] commit + push to origin main
<!-- /ANCHOR:summary -->
