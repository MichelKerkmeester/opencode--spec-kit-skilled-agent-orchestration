---
title: "Tasks: Post-Save Render Fixes"
description: "Task breakdown for the nine render-layer memory-save fixes and the round-trip verification."
trigger_phrases:
  - "009 render tasks"
  - "post-save render tasks"
importance_tier: "important"
contextType: "tasks"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/009-post-save-render-fixes"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["tasks.md"]

---
# Tasks: Post-Save Render Fixes

<!-- SPECKIT_LEVEL: 3 -->
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

**Task Format**: `T### Description`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T011 Scaffold the `009-post-save-render-fixes` packet docs and update the parent phase map in `../spec.md`. [SOURCE: spec.md:29-41; ../spec.md:78-93]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T001 Fix Lane A in `.opencode/skill/system-spec-kit/scripts/core/title-builder.ts` and add `title-builder-no-filename-suffix.vitest.ts`. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/title-builder.ts:61-65; .opencode/skill/system-spec-kit/scripts/tests/title-builder-no-filename-suffix.vitest.ts:12-28]
- [x] T002 Fix Lane B across canonical-source discovery and render bindings, and add `canonical-sources-auto-discovery.vitest.ts`. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:463-500; .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:757-840; .opencode/skill/system-spec-kit/templates/context_template.md:240-250; .opencode/skill/system-spec-kit/scripts/tests/canonical-sources-auto-discovery.vitest.ts:19-50]
- [x] T003 Fix Lane C across structured JSON file capture and fallback counts, and add `file-capture-structured-mode.vitest.ts`. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:243-272; .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1094-1271; .opencode/skill/system-spec-kit/scripts/tests/file-capture-structured-mode.vitest.ts:13-46]
- [x] T004 Fix Lane D in the real trigger-merge owner `workflow.ts` and add `trigger-phrase-no-prose-bigrams.vitest.ts`. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1270-1367; .opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-no-prose-bigrams.vitest.ts:56-96]
- [x] T005 Fix Lane E in distinguishing-evidence extraction, and add `distinguishing-evidence-dedup.vitest.ts`. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:847-909; .opencode/skill/system-spec-kit/scripts/tests/distinguishing-evidence-dedup.vitest.ts:5-27]
- [x] T006 Fix Lane F in phase and session-status derivation, and add `phase-status-from-payload.vitest.ts`. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:360-563; .opencode/skill/system-spec-kit/scripts/tests/phase-status-from-payload.vitest.ts:5-28]
- [x] T007 Fix Lane G in lineage auto-population, and add `causal-links-auto-populate.vitest.ts`. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:292-335; .opencode/skill/system-spec-kit/scripts/tests/causal-links-auto-populate.vitest.ts:37-90]
- [x] T008 Fix Lane H in parent packet resolution, and add `parent-spec-resolver.vitest.ts`. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:337-350; .opencode/skill/system-spec-kit/scripts/tests/parent-spec-resolver.vitest.ts:9-36]
- [x] T009 Fix Lane I in score naming and reviewer wording, and add `quality-scorer-disambiguation.vitest.ts`. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/frontmatter-editor.ts:27-75; .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:65-100; .opencode/skill/system-spec-kit/scripts/tests/quality-scorer-disambiguation.vitest.ts:12-33]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Add `post-save-render-round-trip.vitest.ts` and prove the wrapper contract with a real save. [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/post-save-render-round-trip.vitest.ts:60-140]
- [x] T011b Replace the placeholder implementation summary and update `plan.md`, `tasks.md`, `checklist.md`, and `spec.md` with final evidence and status. [SOURCE: implementation-summary.md:1-96; checklist.md:32-156]
<!-- /ANCHOR:phase-3 -->

---

### Task Dependencies

| Task | Depends On | Reason |
|------|------------|--------|
| `T001-T009` | `T011` | Packet scaffold and strict validation must exist first |
| `T010` | `T001-T009` | Round-trip depends on the shipped helper fixes |
| `T011b` | `T010` | Final docs need real verification evidence |

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All shipped-scope tasks from `T001-T011b` are marked `[x]`
- [x] Each lane has a focused test
- [x] Round-trip verification passes
- [x] Strict packet validation passes
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
