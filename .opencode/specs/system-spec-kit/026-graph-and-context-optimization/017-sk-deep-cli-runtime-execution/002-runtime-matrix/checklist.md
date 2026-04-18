---
title: "Verification Checklist: CLI Runtime Matrix"
description: "P0/P1/P2 gate for Phase 019. Wire cli-copilot + cli-gemini + cli-claude-code with per-kind flag validation. Cross-CLI delegation documented."
trigger_phrases: ["019 checklist", "cli matrix verification"]
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/017-sk-deep-cli-runtime-execution/002-runtime-matrix"
    last_updated_at: "2026-04-18T11:30:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Checklist scaffolded"
    next_safe_action: "Populate evidence post-implementation"
    blockers: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: CLI Runtime Matrix

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR user-approve deferral |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Problem + scope documented in spec.md §2, §3
- [ ] CHK-002 [P0] Per-CLI invocation matrix in spec.md §12 researched
- [ ] CHK-003 [P0] Decision records drafted for per-kind vs union schema
- [ ] CHK-004 [P0] No file-path collisions with active parallel tracks

### Config Schema

- [ ] CHK-010 [P0] `ExecutorNotWiredError` rejection REMOVED for cli-copilot, cli-gemini, cli-claude-code
- [ ] CHK-011 [P0] `EXECUTOR_KIND_FLAG_SUPPORT` map declares per-kind supported flags
- [ ] CHK-012 [P0] Validator rejects unsupported-flag-for-kind combinations with clear messages
- [ ] CHK-013 [P0] cli-gemini model whitelist enforced
- [ ] CHK-014 [P1] Config tests cover all 4 CLI kinds + rejection cases
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

### YAML Dispatch

- [ ] CHK-020 [P0] `if_cli_copilot` branch in all 4 YAMLs
- [ ] CHK-021 [P0] `if_cli_gemini` branch in all 4 YAMLs
- [ ] CHK-022 [P0] `if_cli_claude_code` branch in all 4 YAMLs
- [ ] CHK-023 [P0] cli-copilot handles prompt-as-positional (no stdin)
- [ ] CHK-024 [P0] cli-claude-code uses `--permission-mode acceptEdits` (not `plan` which is read-only)
- [ ] CHK-025 [P0] All new branches share existing pre_dispatch / post_dispatch_validate / record_executor_audit steps
- [ ] CHK-026 [P1] Branch structure symmetric across research + review YAMLs
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-040 [P0] `executor-config.vitest.ts` extended cases green (cli-copilot/gemini/claude-code accept + reject)
- [ ] CHK-041 [P0] `cli-matrix.vitest.ts` new suite green (per-CLI dispatch command shapes)
- [ ] CHK-042 [P0] All 40 existing tests still pass (regression)
- [ ] CHK-043 [P0] Native-path behavior unchanged
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-050 [P0] Each CLI dispatch uses minimum permissions that allow iteration writes
- [ ] CHK-051 [P0] No cross-CLI auth mediation attempted (each CLI uses its own env)
- [ ] CHK-052 [P1] Prompt content not interpolated into shell command outside of quoted args (safe against command injection)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

### Contract

- [ ] CHK-060 [P0] Both SKILL.md contract sections updated with 4 shipped kinds (no "reserved, not wired" entries)
- [ ] CHK-061 [P0] Cross-CLI Delegation subsection added to both SKILL.md files
- [ ] CHK-062 [P0] Executor Resolution subsection in both loop_protocol.md files lists all 4 CLI kinds

### Setup flags

- [ ] CHK-070 [P0] deep-research.md Q-Exec options include all 4 CLI kinds
- [ ] CHK-071 [P0] deep-review.md same
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-080 [P1] Scratch files for 019 only in `017-sk-deep-cli-runtime-execution/002-runtime-matrix/scratch/`
- [ ] CHK-081 [P0] No modifications outside scope listed in spec.md §3
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

### Summary Gate

- [ ] CHK-090 [P0] All P0 items above verified with evidence closers
- [ ] CHK-091 [P1] All P1 items verified OR user-approved deferral
- [ ] CHK-092 [P0] Both changelogs follow canonical template
- [ ] CHK-093 [P0] Commit + push successful

### Counts

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 26 | 0/26 |
| P1 Items | 7 | 0/7 |

**Verification Date**: [populate on completion]

**Verdict**: [DRAFT → CONDITIONAL → PASS per Phase 018 convention]
<!-- /ANCHOR:summary -->
