---
title: "Context Index: Hook Parity"
description: "Bridge index for runtime hook parity across Claude / Codex / Copilot / OpenCode plugin after renumbering hook-parity phases inside the phase root."
trigger_phrases:
  - "009-hook-parity"
  - "hook parity"
  - "runtime hook parity"
  - "claude codex copilot opencode hook parity"
  - "001-hook-parity-remediation"
  - "002-copilot-hook-parity-remediation"
  - "003-codex-hook-parity-remediation"
  - "004-claude-hook-findings-remediation"
  - "005-opencode-plugin-loader-remediation"
  - "006-copilot-wrapper-schema-fix"
  - "007-copilot-writer-wiring"
  - "008-docs-impact-remediation"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-parity"
    last_updated_at: "2026-04-25T11:50:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "2026-04-25 second consolidation: 7 children moved out (5 to 008-skill-advisor, 2 to 007-code-graph); renamed from 009-hook-parity; 8 hook-parity children renumbered 001-008"
    next_safe_action: "Use this index for navigation, then reapply 006 and 007"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:06a0efc1cdfc58c718646fe26e4d3a2ad0d8d8ec42c13f484479211d0d9dd3c6"
      session_id: "026-phase-root-flatten-2026-04-21"
      parent_session_id: null
    completion_pct: 85
    open_questions: []
    answered_questions: []
    migration_aliases:
      - "system-spec-kit/026-graph-and-context-optimization/009-hook-parity"
      - "system-spec-kit/026-graph-and-context-optimization/009-hook-parity"
---
# Context Index: Hook Parity

<!-- SPECKIT_LEVEL: 1 -->

## Theme

Runtime hook parity across Claude / Codex / Copilot / OpenCode plugin: schema fixes, wiring fixes, and parity remediations. The 8 hook-parity phase packets are direct child folders of this phase root.

## Child Phase Map

| Child Phase | Old Title | Status Before Consolidation | Current Path |
|-------------|-----------|-----------------------|--------------|
| `001-hook-parity-remediation/` | Feature Specification: 029 — Runtime Hook Parity Remediation | Complete | `009-hook-parity/001-hook-parity-remediation/` |
| `002-copilot-hook-parity-remediation/` | Feature Specification: Copilot CLI Hook Parity Remediation | Complete | `009-hook-parity/002-copilot-hook-parity-remediation/` |
| `003-codex-hook-parity-remediation/` | Feature Specification: Codex CLI Hook Parity Remediation | Complete | `009-hook-parity/003-codex-hook-parity-remediation/` |
| `004-claude-hook-findings-remediation/` | Feature Specification: Claude Hook Findings Remediation | Partial Verification | `009-hook-parity/004-claude-hook-findings-remediation/` |
| `005-opencode-plugin-loader-remediation/` | Feature Specification: OpenCode Plugin Loader Remediation | Complete | `009-hook-parity/005-opencode-plugin-loader-remediation/` |
| `006-copilot-wrapper-schema-fix/` | Feature Specification: Copilot Wrapper Schema Fix | Reverted - Reapply Required | `009-hook-parity/006-copilot-wrapper-schema-fix/` |
| `007-copilot-writer-wiring/` | Feature Specification: Copilot Writer Wiring | Reverted - Reapply Required | `009-hook-parity/007-copilot-writer-wiring/` |
| `008-docs-impact-remediation/` | Feature Specification: Documentation Impact Remediation for 009 Hook/Daemon Parity | Planning | `009-hook-parity/008-docs-impact-remediation/` |

## Key Implementation Summaries

- **`001-hook-parity-remediation/`**: **Implemented with documented blockers.** Phases A–D are complete at the targeted source/test layer, and Phase E captured remediation evidence. The whole-repo vitest gate is not green because broader baseline suites still fail outside this packet's implementation surface.
- **`002-copilot-hook-parity-remediation/`**: Outcome B custom-instructions transport shipped for Copilot CLI because customer hook output cannot mutate prompts.
- **`003-codex-hook-parity-remediation/`**: Outcome A native Codex SessionStart/UserPromptSubmit parity shipped and was re-verified.
- **`004-claude-hook-findings-remediation/`**: Freshness persistence, Claude hook schema normalization, and multi-turn harness docs shipped; live Claude parity remains environment-blocked.
- **`005-opencode-plugin-loader-remediation/`**: OpenCode helper isolation, legacy parser hardening, and skill-advisor OpenCode hook remap shipped; full-suite Vitest remains blocked by the parent-tracked Copilot hook wiring mismatch.
- **`006-copilot-wrapper-schema-fix/`**: Landed in `162a6cb16c` but was reverted in `6cd00aa51b`; current `.claude/settings.local.json` no longer has the top-level Copilot-safe wrapper fields, so reapply is required.
- **`007-copilot-writer-wiring/`**: Landed in `162a6cb16c` but was reverted in `6cd00aa51b`; current `.claude/settings.local.json` no longer points the top-level wrappers at the Copilot writers, so reapply is required after packet 006.
- **`008-docs-impact-remediation/`**: Documentation impact remediation for the hook-parity packets; planning stage with consolidated external doc updates flagged by the merged impact report.

## Open Or Deferred Items

- **`001-hook-parity-remediation/`**: status before migration was Complete at source/test layer; whole-repo vitest gate remains red on broader baseline suites outside this packet.
- **`002-copilot-hook-parity-remediation/`**: status before migration was Complete; 1 unchecked checklist item remains for degraded memory indexing.
- **`003-codex-hook-parity-remediation/`**: status before migration was Complete; no unchecked task/checklist items remain.
- **`004-claude-hook-findings-remediation/`**: status before migration was Partial Verification; 4 unchecked completion items remain because live Claude auth/user-global hook state blocked AS-003/AS-004.
- **`005-opencode-plugin-loader-remediation/`**: status before migration was Complete; 1 unchecked full-suite Vitest item remains because `copilot-hook-wiring.vitest.ts` is blocked outside this packet.
- **`006-copilot-wrapper-schema-fix/`**: patch landed, then reverted in `6cd00aa51b`; top-level wrapper fields must be restored before any smoke is meaningful.
- **`007-copilot-writer-wiring/`**: landed, then reverted in `6cd00aa51b`; depends on packet 006 being reapplied first, then the writer commands being restored.
- **`008-docs-impact-remediation/`**: status is Planning; sub-packets/tasks for external doc updates still need to be carved from the merged impact report.

## Related

Work that previously sat alongside hook parity has moved out of this packet:

- **Skill-advisor work** moved to `008-skill-advisor/`: skill-advisor hook surface, skill-graph daemon + advisor unification, plugin hardening, standards alignment, and skill-advisor hook improvements.
- **Code-graph hook work** moved to `007-code-graph/`: code-graph hook improvements and code-graph advisor refinement.

## Root Support References

The root `research/`, `review/`, and `scratch/` folders remain at `system-spec-kit/026-graph-and-context-optimization/`. Historical citations inside child packets intentionally remain local evidence unless this wrapper points to an active path.
