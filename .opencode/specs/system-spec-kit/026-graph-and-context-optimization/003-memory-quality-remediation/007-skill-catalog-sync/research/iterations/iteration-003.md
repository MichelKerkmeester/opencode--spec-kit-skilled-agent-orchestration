---
title: "Review Iteration 003: system-spec-kit SKILL.md"
description: "Phase 7 drift audit of the system-spec-kit skill entrypoint against the post-Phase-6 memory-save baseline"
trigger_phrases:
  - "phase 7 review iteration 003"
  - "system-spec-kit skill drift"
  - "generate-context runtime entrypoint drift"
importance_tier: important
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-quality-remediation/007-skill-catalog-sync"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["research/iterations/iteration-003.md"]

---

# Review Iteration 003: system-spec-kit SKILL.md

## Surface Audited
- `.opencode/skill/system-spec-kit/SKILL.md`

## Findings

### P1 — should update; defer only with rationale
- **F003.1** — SKILL resource inventory still points readers at the TypeScript source instead of the canonical runtime save entrypoint
  - **Location**: `.opencode/skill/system-spec-kit/SKILL.md:964-969`
  - **Stale content**: ``| Memory gen | `scripts/memory/generate-context.ts` → `scripts/dist/` | Memory file creation |``
  - **Why stale**: The same SKILL file and the governing repo docs now treat `scripts/dist/memory/generate-context.js` as the canonical save command surface. Leaving the inventory row on the TypeScript source makes the resource table disagree with the operational guidance.
  - **Required update**: Rewrite the inventory row to name `scripts/dist/memory/generate-context.js` as the runtime entrypoint and, if needed, mention the `.ts` file only as the compiled source.

## Negative Cases (confirmed still accurate)
- `.opencode/skill/system-spec-kit/SKILL.md:526-539` already documents `generate-context.js --json` and nested spec-folder targets correctly.
- `.opencode/skill/system-spec-kit/SKILL.md:631` still gives the correct post-save indexing follow-up (`memory_index_scan()` or `memory_save()`).

## Confidence
**0.95** — Single-file audit with direct line verification. The stale inventory row conflicts with multiple correct runtime examples in the same document.

## Cross-Surface Notes
- The same TypeScript-versus-runtime-entrypoint fossil appears across the `references/` and README surfaces and should be deduped into a shared matrix theme.
