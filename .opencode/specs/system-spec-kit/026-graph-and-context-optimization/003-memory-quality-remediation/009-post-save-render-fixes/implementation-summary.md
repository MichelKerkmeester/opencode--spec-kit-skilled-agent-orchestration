---
title: "Implementation Summary: Post-Save Render Fixes"
description: "Closeout for the nine render-layer fixes that make fresh memory saves match the compact-wrapper contract without reopening 003/006-owned runtime surfaces."
trigger_phrases:
  - "009 implementation summary"
  - "post-save render fixes closeout"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-quality-remediation/009-post-save-render-fixes"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["implementation-summary.md"]

---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-post-save-render-fixes |
| **Completed** | 2026-04-09 |
| **Level** | 3 |
| **Status** | Implemented |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Packet `009` now closes the nine render-layer defects that were still visible after `003/006-memory-duplication-reduction` shipped. Fresh memory saves now render a clean dashboard title, populate canonical packet docs, carry truthful file counts, keep authored trigger phrases instead of prose bigrams, deduplicate anchored distinguishing evidence, honor explicit phase and status, auto-link to prior packet saves, resolve `parent_spec` honestly, and expose two clearly named quality scores instead of one overloaded label.

The boundary stayed narrow on purpose. The compact-wrapper body, the single-word junk sanitizer, the `DUP1-DUP7` reviewer checks, and the collector-to-contract flow owned by `003/006` remain intact. `009` fixes the render helpers around that contract rather than reopening the contract itself.

### Lane Ownership and Real Fix Locations

Lane A landed in `scripts/core/title-builder.ts`, where `buildMemoryDashboardTitle()` now emits the clean memory title instead of appending `[folder/file]` suffix garbage.

Lane B turned out to span three render-adjacent owners rather than `generate-context.ts`: `scripts/extractors/session-extractor.ts` now detects the canonical packet docs, `scripts/extractors/collect-session-data.ts` builds ordered canonical-source entries, and the memory context template renders them additively in the wrapper.

Lane C fixed the structured JSON file path plumbing in `scripts/extractors/file-extractor.ts` and `scripts/extractors/collect-session-data.ts`, so `filesModified`, `filesChanged`, and git fallback all feed the saved file counters correctly.

Lane D did not live in `topic-extractor.ts`. The real bug was the trigger merge inside `scripts/core/workflow.ts`, where prose-derived auto triggers were still being merged even when authored trigger phrases already existed. The fix makes authored trigger phrases authoritative for the saved frontmatter.

Lane E and Lane F both landed in `scripts/extractors/collect-session-data.ts`: distinguishing evidence now deduplicates and sorts anchored bullets first, while phase, status, and completion percent honor explicit structured-payload fields before falling back to repository heuristics.

Lanes G and H landed in `scripts/core/memory-metadata.ts` and `scripts/core/workflow.ts`, which now auto-populate lineage from earlier packet saves and resolve `parent_spec` to the real parent packet instead of self-referencing the current folder.

Lane I renamed the two scorer outputs at their actual serialization points: rendered wrapper quality now surfaces as `render_quality_score` in frontmatter, while metadata now carries `input_completeness_score`, with reviewer output documenting both meanings.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skill/system-spec-kit/scripts/core/title-builder.ts` | Modified | Removed filename-suffix garbage from the rendered dashboard title |
| `.opencode/skill/system-spec-kit/scripts/core/frontmatter-editor.ts` | Modified | Renamed rendered frontmatter quality fields to `render_quality_*` |
| `.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts` | Modified | Added packet-local lineage and parent-spec resolution helpers |
| `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts` | Modified | Reported render and input scores as distinct review surfaces |
| `.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts` | Modified | Added `buildRenderQualityScoreFields()` |
| `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` | Modified | Fixed authored-trigger precedence and wired canonical-source, lineage, parent-spec, and score fields into render output |
| `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts` | Modified | Fixed canonical-doc discovery output, evidence dedup, file counts, and phase/status capture |
| `.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts` | Modified | Accepted additional structured file-path keys and descriptions |
| `.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts` | Modified | Added canonical-doc detection for review, decision, implementation, spec, and plan docs |
| `.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts` | Modified | Added `buildInputCompletenessScoreFields()` |
| `.opencode/skill/system-spec-kit/templates/context_template.md` | Modified additively | Rendered discovered canonical-source entries |
| `.opencode/skill/system-spec-kit/scripts/tests/*.vitest.ts` | Added | Added nine focused lane tests plus one end-to-end round-trip test |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The delivery followed the packet's requested order. I scaffolded the Level 3 packet first, validated it strictly, then fixed the P0 lanes before moving through the P1 and P2 surfaces. Each lane landed with its own focused vitest, and the final proof used the real `generate-context` entrypoint against a throwaway packet fixture under `scripts/tests/fixtures/post-save-render/`.

Two root-cause corrections mattered during implementation. First, the trigger-noise bug was not owned by `topic-extractor.ts`; it was the authored-versus-auto merge in `workflow.ts`. Second, canonical sources were not a template-only failure; the section stayed empty because detection and session-data assembly were not producing ordered canonical entries for the renderer. Fixing the real owners kept the patch set small and truthful.

The final round-trip test validates the wrapper contract directly: the rendered file shows canonical sources, anchored evidence, explicit trigger phrases, truthful counts and continuation state, empty first-save lineage, non-self-referential `parent_spec`, and two distinct score names. That proof matters more than any single unit test because it exercises the same render path operators use in live saves.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep `009` render-layer only | The operator explicitly scoped this packet away from the wrapper body, sanitizer, reviewer duplication checks, runtime packets, and broader data-flow changes owned by `003/006`. |
| Fix all nine render defects in one pass | These bugs all corrupt the same saved wrapper surface, so shipping half-fixes would still leave fresh saves internally inconsistent. |
| Trust authored trigger phrases over auto-generated prose triggers when both exist | Structured payload trigger phrases are higher-signal than bigrams inferred from prose summaries, so the saved frontmatter should preserve the authored list exactly. |
| Separate rendered wrapper quality from input completeness by field name | Both scorers still serve useful purposes, but operators need to know immediately which number describes the rendered file and which describes the input-data quality. |
| Prove the packet with lane tests plus a real round-trip save | The lane tests isolate each regression, while the round-trip save proves the live wrapper contract without manual patching. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `cd .opencode/skill/system-spec-kit/mcp_server && TMPDIR=./.tmp/tsc-tmp npm run typecheck` | PASS |
| `cd .opencode/skill/system-spec-kit/scripts && TMPDIR=./.tmp/vitest-tmp npx vitest run --config ../mcp_server/vitest.config.ts --root . tests/title-builder-no-filename-suffix.vitest.ts tests/canonical-sources-auto-discovery.vitest.ts tests/file-capture-structured-mode.vitest.ts tests/trigger-phrase-no-prose-bigrams.vitest.ts tests/distinguishing-evidence-dedup.vitest.ts tests/phase-status-from-payload.vitest.ts tests/causal-links-auto-populate.vitest.ts tests/parent-spec-resolver.vitest.ts tests/quality-scorer-disambiguation.vitest.ts tests/post-save-render-round-trip.vitest.ts tests/memory-quality-phase1.vitest.ts tests/memory-pipeline-regressions.vitest.ts tests/memory-save-pipeline-enforcement.vitest.ts` | PASS (12 files, 20 tests) |
| `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --strict .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-remediation/009-post-save-render-fixes` | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Historical 014 memory saves remain unchanged on purpose.** This packet proves the repaired pipeline on fresh saves only; the two 014 saves still stand as the motivating regression evidence until an operator decides whether to patch or regenerate them.
2. **Git fallback stays heuristic.** When structured payloads omit file lists or explicit phase and status values, the fallback now behaves sensibly, but it still cannot infer the same level of intent that authored structured fields provide.
3. **Canonical sources remain bounded to static packet docs.** This packet intentionally does not expand canonical-source discovery into broader sibling-packet or external-doc search.
<!-- /ANCHOR:limitations -->
