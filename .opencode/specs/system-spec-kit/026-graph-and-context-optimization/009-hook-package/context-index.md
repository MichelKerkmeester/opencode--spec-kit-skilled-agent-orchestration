---
title: "Context Index: Hook Daemon Parity"
description: "Bridge index for skill graph daemon, hook parity, plugin/runtime parity, and parity remediation after renumbering original phases inside the phase root."
trigger_phrases:
  - "009-hook-package"
  - "skill graph daemon, hook parity, plugin/runtime parity, and parity remediation"
  - "001-skill-advisor-hook-surface"
  - "002-skill-graph-daemon-and-advisor-unification"
  - "003-hook-parity-remediation"
  - "004-copilot-hook-parity-remediation"
  - "005-codex-hook-parity-remediation"
  - "006-claude-hook-findings-remediation"
  - "007-opencode-plugin-loader-remediation"
  - "008-skill-advisor-plugin-hardening"
  - "009-skill-advisor-standards-alignment"
  - "010-copilot-wrapper-schema-fix"
  - "011-copilot-writer-wiring"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-package"
    last_updated_at: "2026-04-23T15:20:00Z"
    last_updated_by: "codex-gpt-5.4"
    recent_action: "009 packet truth-sync applied; 010 and 011 marked reverted-needs-reapply"
    next_safe_action: "Use this index for navigation, then reapply 010 and 011"
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
---
# Context Index: Hook Daemon Parity

<!-- SPECKIT_LEVEL: 1 -->

## Theme

Skill graph daemon, hook parity, plugin/runtime parity, and parity remediation. The original phase packets are direct child folders of this phase root.

## Child Phase Map

| Child Phase | Old Title | Status Before Consolidation | Current Path |
|-------------|-----------|-----------------------|--------------|
| `001-skill-advisor-hook-surface/` | Feature Specification: Skill-Advisor Hook Surface | In Progress | `009-hook-package/001-skill-advisor-hook-surface/` |
| `002-skill-graph-daemon-and-advisor-unification/` | Feature Specification: Phase 027 — Skill-Graph Auto-Update Daemon + Advisor Unification | In Progress | `009-hook-package/002-skill-graph-daemon-and-advisor-unification/` |
| `003-hook-parity-remediation/` | Feature Specification: 029 — Runtime Hook Parity Remediation | Scaffolded | `009-hook-package/003-hook-parity-remediation/` |
| `004-copilot-hook-parity-remediation/` | Feature Specification: Copilot CLI Hook Parity Remediation | Complete | `009-hook-package/004-copilot-hook-parity-remediation/` |
| `005-codex-hook-parity-remediation/` | Feature Specification: Codex CLI Hook Parity Remediation | Complete | `009-hook-package/005-codex-hook-parity-remediation/` |
| `006-claude-hook-findings-remediation/` | Feature Specification: Claude Hook Findings Remediation | Partial Verification | `009-hook-package/006-claude-hook-findings-remediation/` |
| `007-opencode-plugin-loader-remediation/` | Feature Specification: OpenCode Plugin Loader Remediation | Complete | `009-hook-package/007-opencode-plugin-loader-remediation/` |
| `008-skill-advisor-plugin-hardening/` | Feature Specification: Skill-Advisor Plugin Hardening | Complete | `009-hook-package/008-skill-advisor-plugin-hardening/` |
| `009-skill-advisor-standards-alignment/` | Feature Specification: Skill-Advisor Standards Alignment | Complete | `009-hook-package/009-skill-advisor-standards-alignment/` |
| `010-copilot-wrapper-schema-fix/` | Feature Specification: Copilot Wrapper Schema Fix | Reverted - Reapply Required | `009-hook-package/010-copilot-wrapper-schema-fix/` |
| `011-copilot-writer-wiring/` | Feature Specification: Copilot Writer Wiring | Reverted - Reapply Required | `009-hook-package/011-copilot-writer-wiring/` |

## Key Implementation Summaries

- **`001-skill-advisor-hook-surface/`**: > **Release ready.** All 8 implementation children converged; T9 integration gauntlet PASS.
- **`002-skill-graph-daemon-and-advisor-unification/`**: - **r01 main** (iters 1-40, cli-codex): 29 `adopt_now` / 2 `prototype_later` / 0 `reject` across Tracks A-D - **Follow-up** (iters 41-60, cli-copilot): 14 `adopt_now` / 1 `prototype_later` / 0 `reject` across Tracks E/F/G + Y/Z - **Total:** 43 `adopt_now` /...
- **`003-hook-parity-remediation/`**: **Implemented with documented blockers.** Phases A–D are complete at the targeted source/test layer, and Phase E captured remediation evidence. The whole-repo vitest gate is not green because broader baseline suites still fail outside this packet's implemen...
- **`004-copilot-hook-parity-remediation/`**: Outcome B custom-instructions transport shipped for Copilot CLI because customer hook output cannot mutate prompts.
- **`005-codex-hook-parity-remediation/`**: Outcome A native Codex SessionStart/UserPromptSubmit parity shipped and was re-verified.
- **`006-claude-hook-findings-remediation/`**: Freshness persistence, Claude hook schema normalization, and multi-turn harness docs shipped; live Claude parity remains environment-blocked.
- **`007-opencode-plugin-loader-remediation/`**: OpenCode helper isolation, legacy parser hardening, and skill-advisor OpenCode hook remap shipped; full-suite Vitest remains blocked by the parent-tracked Copilot hook wiring mismatch.
- **`008-skill-advisor-plugin-hardening/`**: Per-instance plugin state, in-flight bridge dedup, prompt/brief caps, cache LRU eviction, and 30-test focused coverage shipped.
- **`009-skill-advisor-standards-alignment/`**: OpenCode Plugin Exemption Tier and skill-advisor plugin header/JSDoc/section-divider alignment shipped with no behavior change.
- **`010-copilot-wrapper-schema-fix/`**: Landed in `162a6cb16c` but was reverted in `6cd00aa51b`; current `.claude/settings.local.json` no longer has the top-level Copilot-safe wrapper fields, so reapply is required.
- **`011-copilot-writer-wiring/`**: Landed in `162a6cb16c` but was reverted in `6cd00aa51b`; current `.claude/settings.local.json` no longer points the top-level wrappers at the Copilot writers, so reapply is required after packet 010.

## Open Or Deferred Items

- **`001-skill-advisor-hook-surface/`**: status before consolidation was In Progress; 24 unchecked task/checklist item(s) remain in the child packet docs.
- **`002-skill-graph-daemon-and-advisor-unification/`**: status before consolidation was In Progress; 30 unchecked task/checklist item(s) remain in the child packet docs.
- **`003-hook-parity-remediation/`**: status before consolidation was Scaffolded; 50 unchecked task/checklist item(s) remain in the child packet docs.
- **`004-copilot-hook-parity-remediation/`**: status before migration was Complete; 1 unchecked checklist item remains for degraded memory indexing.
- **`005-codex-hook-parity-remediation/`**: status before migration was Complete; no unchecked task/checklist items remain.
- **`006-claude-hook-findings-remediation/`**: status before migration was Partial Verification; 4 unchecked completion items remain because live Claude auth/user-global hook state blocked AS-003/AS-004.
- **`007-opencode-plugin-loader-remediation/`**: status before migration was Complete; 1 unchecked full-suite Vitest item remains because `copilot-hook-wiring.vitest.ts` is blocked outside this packet.
- **`008-skill-advisor-plugin-hardening/`**: status before migration was Complete; no unchecked task/checklist items remain.
- **`009-skill-advisor-standards-alignment/`**: status before migration was Complete; no checklist file exists for this Level 1 packet.
- **`010-copilot-wrapper-schema-fix/`**: patch landed, then reverted in `6cd00aa51b`; top-level wrapper fields must be restored before any smoke is meaningful.
- **`011-copilot-writer-wiring/`**: landed, then reverted in `6cd00aa51b`; depends on packet 010 being reapplied first, then the writer commands being restored.

## Root Support References

The root `research/`, `review/`, and `scratch/` folders remain at `system-spec-kit/026-graph-and-context-optimization/`. Historical citations inside child packets intentionally remain local evidence unless this wrapper points to an active path.
