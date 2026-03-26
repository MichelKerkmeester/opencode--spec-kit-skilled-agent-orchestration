---
title: "Tasks: Template Compliance Enforcement"
description: "Task breakdown for 3-layer template compliance enforcement across 4 implementation phases (A-D), 11 tasks total."
trigger_phrases:
  - "template compliance tasks"
  - "enforcement tasks"
  - "contract injection tasks"
importance_tier: "important"
contextType: "implementation"
---
# Tasks: Template Compliance Enforcement

<!-- SPECKIT_LEVEL: 2 -->
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

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

Phase A: High-Impact, Low-Risk -- create foundational artifacts.

- [ ] T001 Create shared compliance reference file (references/template-compliance-contract.md) -- 140-line canonical source with L1-L3 contracts, sync protocol, version metadata. Content drafted in scratch/iteration-009.md Finding 2.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Phase B: Contract Injection -- embed compact structural contract in all agent definitions.

- [ ] T004 Replace 12-line spec.md-only scaffold with full 49-line compact contract in `.claude/agents/speckit.md` (Section 8 "Inline Scaffold Contract"). Contract covers all 5 L2 doc types + L3 decision-record.md.
- [ ] T005 [P] Replicate T004 contract injection to `.opencode/agent/speckit.md` and .opencode/agent/chatgpt/speckit.md
- [ ] T006 [P] Replicate T004 contract injection to `.codex/agents/speckit.toml` (TOML multi-line string format with triple-quoted literals)

Phase C: Directive Consolidation -- eliminate conflicting validation timing instructions.

- [ ] T007 Collapse 3 conflicting timing directives into 1 in all 4 agent definitions. Remove "once at end" (workflow diagram) and "per workflow step" (scaffold section) variants. Keep "after each write" as the single directive.
- [ ] T008 Add Post-Write Validation Protocol section to all 4 agent definitions: exit code parsing (0=pass, 1=warnings, 2=errors), fix loop (max 3 attempts per file), proceed/stop logic.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

Phase D: End-to-end testing across all enforcement layers.

- [ ] T009 Create a test Level 2 spec folder using @speckit agent; verify all 5 files pass `validate.sh --strict` with exit code 0 on first generation (no post-hoc fixes)
- [ ] T010 Audit agent conversation log to verify validate.sh is executed after each individual file write (not just once at end)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks T001-T010 marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] `validate.sh --strict` passes on this spec folder (010-template-compliance-enforcement)
- [ ] All 4 CLI @speckit agent definitions contain identical contract content (minus TOML formatting)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md` -- requirements REQ-001 through REQ-010
- **Plan**: See `plan.md` -- 4 phases (A-D) with architecture and testing strategy
- **Research**: See `research.md` -- 9 iterations, 8/8 questions answered, per-document failure analysis
- **Contract Draft**: See `scratch/iteration-009.md` Finding 2 -- complete 140-line reference file content
- **Validation System**: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`
- **Template Engine**: `.opencode/skill/system-spec-kit/scripts/utils/template-structure.js`
<!-- /ANCHOR:cross-refs -->

---
