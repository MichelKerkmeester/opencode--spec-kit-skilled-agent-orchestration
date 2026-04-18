---
title: "Verification Checklist: Deep-Loop CLI Executor Selection"
description: "P0/P1/P2 verification gate for Phase 018. Native-path bit-identical required; cli-codex smoke end-to-end; sk-deep-research + sk-deep-review symmetry verified. Follows Phase 017 EVIDENCE-closer convention."
trigger_phrases: ["018 checklist", "deep-loop executor verification"]
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/018-deep-loop-cli-executor"
    last_updated_at: "2026-04-18T00:00:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Checklist scaffolded from spec requirements"
    next_safe_action: "Populate evidence closers post-implementation"
    blockers: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: Deep-Loop CLI Executor Selection

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

**Evidence closer format**: `[EVIDENCE: <short-hash-or-filepath>]` at the end of each checked item. Matches Phase 017 convention.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Problem statement documented in spec.md §2
- [ ] CHK-002 [P0] Scope, files-to-change, and exclusions captured in spec.md §3
- [ ] CHK-003 [P0] P0 + P1 requirements enumerated with acceptance criteria (spec.md §4)
- [ ] CHK-004 [P0] Implementation phases sequenced in plan.md §4
- [ ] CHK-005 [P0] Atomic-ship groups called out in tasks.md
- [ ] CHK-006 [P1] Decision records drafted for key architectural choices (decision-record.md)
- [ ] CHK-007 [P1] Risk matrix populated (spec.md §10)
- [ ] CHK-008 [P0] Dependencies verified: codex CLI on PATH + stdin piping works
- [ ] CHK-009 [P0] No file-path collisions with active Phase 018 commit series

### Config Schema

- [ ] CHK-010 [P0] `deep_research_config.json` has `executor` block with all six fields
- [ ] CHK-011 [P0] `deep_review_config.json` has identical `executor` block
- [ ] CHK-012 [P0] Zod schema rejects `cli-copilot`/`cli-gemini`/`cli-claude-code` with spec-pointer error
- [ ] CHK-013 [P0] Zod schema rejects `cli-codex` when `model` is null
- [ ] CHK-014 [P1] Default config loads with `kind: "native"`
- [ ] CHK-015 [P1] Flag precedence: CLI > file > default (verified in unit tests)

### Prompt-Pack Templates

- [ ] CHK-020 [P0] `sk-deep-research/assets/prompt_pack_iteration.md.tmpl` exists and renders
- [ ] CHK-021 [P0] `sk-deep-review/assets/prompt_pack_iteration.md.tmpl` exists and renders
- [ ] CHK-022 [P0] Template includes LEAF constraint, 3-5 actions guide, 12 tool-call budget
- [ ] CHK-023 [P0] Template includes output contract: iteration-NNN.md + JSONL delta required
- [ ] CHK-024 [P0] Template includes `graphEvents` optional field per sk-deep-research SKILL.md
- [ ] CHK-025 [P0] Renderer throws on unbound variables (tested)
- [ ] CHK-026 [P1] Renderer is deterministic (same input → same output; tested)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

### YAML Dispatch Refactor

- [ ] CHK-030 [P0] `spec_kit_deep-research_auto.yaml` has two-branch dispatch (if_native + if_cli_codex)
- [ ] CHK-031 [P0] `spec_kit_deep-research_confirm.yaml` mirrors auto
- [ ] CHK-032 [P0] `spec_kit_deep-review_auto.yaml` mirrors research auto
- [ ] CHK-033 [P0] `spec_kit_deep-review_confirm.yaml` mirrors review auto
- [ ] CHK-034 [P0] Pre_dispatch (prompt render) shared between branches
- [ ] CHK-035 [P0] Post_dispatch_validate invoked after both branches
- [ ] CHK-036 [P0] record_executor_audit appends to JSONL on non-native path
- [ ] CHK-037 [P0] No hardcoded `model: opus` outside `if_native` branch
- [ ] CHK-038 [P0] cli-codex invocation uses stdin piping (`- < {prompt}`), not `--prompt-file`
- [ ] CHK-039 [P1] Timeout from `executor.timeoutSeconds` wired to YAML step

### Post-Dispatch Validator

- [ ] CHK-040 [P0] Asserts iteration file exists and is non-empty
- [ ] CHK-041 [P0] Asserts JSONL delta appended since previous iteration
- [ ] CHK-042 [P0] Validates required fields (`newInfoRatio`, `status`, `focus`)
- [ ] CHK-043 [P0] Emits `schema_mismatch` canonical conflict event on failure
- [ ] CHK-044 [P1] Failure path wires into existing stuck_recovery after 3 consecutive
- [ ] CHK-045 [P1] Validator adds < 200ms per iteration (NFR-P01)

### Setup Flag Parsing

- [ ] CHK-050 [P0] `.opencode/command/spec_kit/deep-research.md` parses `--executor`, `--model`, `--reasoning-effort`, `--service-tier`, `--executor-timeout`
- [ ] CHK-051 [P0] `.opencode/command/spec_kit/deep-review.md` parses same flags
- [ ] CHK-052 [P0] Consolidated setup prompt includes executor question ONLY when unset in all sources
- [ ] CHK-053 [P1] Unknown flags produce clear error message
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-060 [P0] `executor-config.vitest.ts` green — all config cases pass
- [ ] CHK-061 [P0] `prompt-pack-render.vitest.ts` green
- [ ] CHK-062 [P0] `dispatch-branch.vitest.ts` green
- [ ] CHK-063 [P0] `jsonl-audit-field.vitest.ts` green
- [ ] CHK-064 [P0] `cli-codex-dispatch.int.vitest.ts` green (integration)
- [ ] CHK-065 [P0] Existing iteration tests pass unchanged with native default (regression)
- [ ] CHK-066 [P0] Native-path bit-identical smoke: 1-iter output byte-for-byte match vs. pre-feature baseline
- [ ] CHK-067 [P0] cli-codex smoke: 1-iter on throwaway folder produces valid iteration + JSONL with audit field
- [ ] CHK-068 [P0] sk-deep-review parity: both native and cli-codex smokes pass for review path
- [ ] CHK-069 [P1] 3-consecutive-failure → stuck_recovery integration test passes
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-070 [P0] No secrets embedded in prompt-pack template
- [ ] CHK-071 [P0] Topic user-input not interpolated into shell command (only into prompt file contents)
- [ ] CHK-072 [P0] codex exec uses `--sandbox workspace-write`, not `danger-full-access`
- [ ] CHK-073 [P1] Iteration output paths bounded to `{spec_folder}/research/` or `/review/`
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

### Contract

- [ ] CHK-080 [P0] `sk-deep-research/SKILL.md:61` forward-looking note REPLACED with CONTRACT section
- [ ] CHK-081 [P0] `sk-deep-review/SKILL.md:63` same
- [ ] CHK-082 [P0] Both SKILL.md contract sections include: supported kinds, invariants, failure modes, audit field, template path
- [ ] CHK-083 [P0] `sk-deep-research/references/loop_protocol.md §3` adds Executor Resolution subsection
- [ ] CHK-084 [P0] `sk-deep-review/references/loop_protocol.md §3` same
- [ ] CHK-085 [P1] DQI score ≥ 0.85 on both SKILL.md files (via `validate_document.py`)

### Symmetry (research ↔ review)

- [ ] CHK-090 [P0] Config schema diff between research and review is zero (executor block)
- [ ] CHK-091 [P0] YAML dispatch branch structure is structurally identical between auto+confirm across both skills
- [ ] CHK-092 [P0] SKILL.md contract sections are parallel (only dimension/focus wording differs)
- [ ] CHK-093 [P0] Both prompt-pack templates have matching structure (only content domain differs)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-100 [P1] Temp files in `018-deep-loop-cli-executor/scratch/` only
- [ ] CHK-101 [P1] `scratch/` cleaned before packet completion
- [ ] CHK-102 [P1] All new files use canonical paths under existing `.opencode/skill/` or `mcp_server/lib/` roots
- [ ] CHK-103 [P0] No touched files outside scope listed in spec.md §3

### Spec Folder Hygiene

- [ ] CHK-110 [P0] `description.json` present and up-to-date (refreshed via `generate-context.js`)
- [ ] CHK-111 [P0] `graph-metadata.json` present and reflects completion status
- [ ] CHK-112 [P0] the packet implementation-summary document populated with post-ship details
- [ ] CHK-113 [P0] `validate.sh --strict` exits 0 on 018 packet
- [ ] CHK-114 [P1] Memory indexed: `memory_quick_search("018 deep-loop cli executor")` returns the packet
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

### Summary Gate (final)

- [ ] CHK-120 [P0] All P0 items above verified with evidence closers
- [ ] CHK-121 [P1] All P1 items verified OR deferred with user approval
- [ ] CHK-122 [P0] 25 commits land in single atomic-ship group per plan.md §8 (or user-approved split)
- [ ] CHK-123 [P0] Track 2 (30-iter research) prerequisites satisfied: cli-codex dispatch verified end-to-end

### Counts

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 55 | 0/55 |
| P1 Items | 21 | 0/21 |
| P2 Items | (see spec.md §4 P2 reqs) | - |

**Verification Date**: [POPULATE on completion]

**Verdict**: [DRAFT/CONDITIONAL/PASS — populate post-verification]
<!-- /ANCHOR:summary -->
