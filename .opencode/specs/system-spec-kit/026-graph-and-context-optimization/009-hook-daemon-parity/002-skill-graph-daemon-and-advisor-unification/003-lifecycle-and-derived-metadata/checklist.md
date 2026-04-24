---
title: "Verification Checklist: 027/002 Lifecycle and Derived Metadata"
description: "This verification checklist captures 027/002 Lifecycle and Derived Metadata."
trigger_phrases:
  - "lifecycle and derived metadata"
  - "skill graph daemon and advisor unification"
  - "027/002 lifecycle and derived metadata"
  - "lifecycle and derived metadata checklist"
  - "system spec kit"
importance_tier: "normal"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/003-lifecycle-and-derived-metadata"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled frontmatter (repo-wide gap fill)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["checklist.md"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
---
title: "...n/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/003-lifecycle-and-derived-metadata/checklist]"
description: "Acceptance verification for lifecycle + derived metadata."
trigger_phrases:
  - "027/002 checklist"
  - "lifecycle derived metadata checklist"
  - "skill graph daemon advisor unification verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/003-lifecycle-and-derived-metadata"
    last_updated_at: "2026-04-20T15:49:40Z"
    last_updated_by: "codex"
    recent_action: "Recorded verification evidence"
    next_safe_action: "Review local commit and push after orchestrator verification"
    blockers: []
    key_files:
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:97dc99c6d70ab892a42b01f14ad4787e9de5a46d70307ce398157ffb0e0b6e25"
      session_id: "027-002-implementation-r01"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "P0 and P1 acceptance evidence recorded"
---
# Verification Checklist: 027/002 Lifecycle and Derived Metadata

<!-- SPECKIT_LEVEL: 2 -->

<!-- ANCHOR:verification-protocol -->
## Verification Protocol

| Priority | Handling |
| --- | --- |
| P0 | Hard blocker for phase completion |
| P1 | Required verification for phase completion |
| P2 | Follow-on suggestion or deferred enhancement |
<!-- /ANCHOR:verification-protocol -->

<!-- ANCHOR:acceptance -->
## P0 (HARD BLOCKER)
- [x] Derived extraction pipeline deterministic + regenerable from full B1 input set (SKILL.md frontmatter/headings/body/examples + references/** headings + assets/** filenames + intent_signals + prior source_docs/key_files). [EVIDENCE: `lib/derived/extract.ts:181`, `lib/derived/extract.ts:194`, `lib/derived/extract.ts:199`, `lib/derived/extract.ts:204`, `lib/derived/extract.ts:206`, `lib/derived/extract.ts:207`, `tests/lifecycle-derived-metadata.vitest.ts:127`.]
- [x] Trust lanes: `explicit_author` vs `derived_generated`; author intent never decays. [EVIDENCE: `lib/derived/trust-lanes.ts:40`, `lib/lifecycle/age-haircut.ts:39`, `tests/lifecycle-derived-metadata.vitest.ts:241`.]
- [x] Schema-v2 `derived` block includes `key_files[]` + `source_docs[]` + `sanitizer_version` (Zod validator + spec). [EVIDENCE: `schemas/skill-derived-v2.ts:35`, `schemas/skill-derived-v2.ts:42`.]
- [x] v1→v2 backfill additive; rollback additive strip. [EVIDENCE: `lib/lifecycle/schema-migration.ts:32`, `lib/lifecycle/rollback.ts:22`, `tests/lifecycle-derived-metadata.vitest.ts:255`, `tests/lifecycle-derived-metadata.vitest.ts:272`.]
- [x] Mixed-version reads during migration (v1 still routable). [EVIDENCE: `lib/lifecycle/schema-migration.ts:45`, `tests/lifecycle-derived-metadata.vitest.ts:255`.]
- [x] Supersession asymmetry: successor default + explicit-name redirect. [EVIDENCE: `lib/lifecycle/supersession.ts:36`, `tests/lifecycle-derived-metadata.vitest.ts:289`.]
- [x] `z_archive` + `z_future` excluded from routing + corpus stats. [EVIDENCE: `lib/lifecycle/archive-handling.ts:22`, `lib/lifecycle/archive-handling.ts:40`, `tests/lifecycle-derived-metadata.vitest.ts:303`.]
- [x] Anti-stuffing caps enforced before derived lane contributes to scoring. [EVIDENCE: `lib/derived/anti-stuffing.ts:48`, `lib/derived/sync.ts:80`, `tests/lifecycle-derived-metadata.vitest.ts:225`.]
- [x] **A7 sanitizer applied before every write boundary** (SQLite insert, graph-metadata.json.derived write, envelope publication, diagnostic emit). Instruction-shaped fixture rejected; regression test present. [EVIDENCE: `lib/derived/sanitizer.ts:12`, `lib/derived/sanitizer.ts:41`, `lib/derived/sanitizer.ts:75`, `lib/derived/sync.ts:85`, `tests/lifecycle-derived-metadata.vitest.ts:215`.]
- [x] Targeted invalidation: editing any single B1 input refreshes ONLY the affected skill's derived row — per-input-category tests pass. [EVIDENCE: `lib/derived/provenance.ts:67`, `tests/lifecycle-derived-metadata.vitest.ts:147`, `tests/lifecycle-derived-metadata.vitest.ts:176`.]

## P1 (Required)
- [x] Provenance fingerprint per skill invalidates derived rows on change. [EVIDENCE: `lib/derived/provenance.ts:67`, `lib/derived/provenance.ts:90`, `tests/lifecycle-derived-metadata.vitest.ts:147`.]
- [x] Age haircut applied to derived lane only (advisor-side). [EVIDENCE: `lib/lifecycle/age-haircut.ts:39`, `tests/lifecycle-derived-metadata.vitest.ts:241`.]
- [x] DF/IDF corpus stats recomputed on startup + debounced. [EVIDENCE: `lib/corpus/df-idf.ts:44`, `lib/corpus/df-idf.ts:70`, `tests/lifecycle-derived-metadata.vitest.ts:321`.]
- [x] Rollback tooling verified via test. [EVIDENCE: `lib/lifecycle/rollback.ts:22`, `tests/lifecycle-derived-metadata.vitest.ts:272`.]
- [x] Lifecycle fixtures exported for 027/003. [EVIDENCE: `tests/fixtures/lifecycle/index.ts:5`, `tests/lifecycle-derived-metadata.vitest.ts:338`.]
<!-- /ANCHOR:acceptance -->

## P2 (Suggestion)
- [ ] Commit-message signal integration
- [ ] Adversarial fixture library growth
- [ ] Debounced DF/IDF warm-cache

<!-- ANCHOR:regression -->
## Integration / Regression
- [x] Focused suite passes. Evidence: `vitest run mcp_server/skill-advisor/tests/ --reporter=default` => 2 files, 29 tests passed.
- [x] TS build OK. Evidence: `npm run typecheck && npm run build` => exit 0.
- [x] 027/001 baseline still passes. Evidence: pre-edit `daemon-freshness-foundation.vitest.ts` + `advisor-freshness.vitest.ts` => 2 files, 27 tests passed.
- [ ] No regressions in 200-prompt corpus parity (not part of 027/002 targeted validation; full corpus parity deferred to orchestrator).
<!-- /ANCHOR:regression -->

<!-- ANCHOR:research-conformance -->
## Research conformance
- [x] B1 deterministic local extraction; no commit messages in first slice. Evidence: `lib/derived/extract.ts:181`, `tests/lifecycle-derived-metadata.vitest.ts:127`.
- [x] B2 hybrid pipeline: explicit + n-gram/pattern + corpus-aware DF/IDF. Evidence: `lib/derived/extract.ts:145`, `lib/derived/extract.ts:210`, `lib/corpus/df-idf.ts:44`.
- [x] B3 write to `graph-metadata.json.derived`; never overwrite frontmatter. Evidence: `lib/derived/sync.ts:75`, `tests/lifecycle-derived-metadata.vitest.ts:199`; grep audit returned 0 write paths to SKILL.md.
- [x] B4 trust-lane separation + caps + haircuts + corpus precision checks. Evidence: `lib/derived/trust-lanes.ts:40`, `lib/derived/anti-stuffing.ts:48`, `lib/lifecycle/age-haircut.ts:39`, `lib/corpus/df-idf.ts:44`.
- [x] B5 A3 graph + content-hash authority; mtimes are wake signals only. Evidence: `lib/derived/provenance.ts:43`, `lib/derived/provenance.ts:67`, `tests/lifecycle-derived-metadata.vitest.ts:147`.
- [x] B6 DF/IDF recomputed on startup + graph debounced changes. Evidence: `lib/corpus/df-idf.ts:44`, `lib/corpus/df-idf.ts:70`, `tests/lifecycle-derived-metadata.vitest.ts:321`.
- [x] B7 anti-stuffing lanes + demotions. Evidence: `lib/derived/anti-stuffing.ts:48`, `tests/lifecycle-derived-metadata.vitest.ts:225`.
- [x] F1 age/status haircuts on derived lane only. Evidence: `lib/lifecycle/age-haircut.ts:27`, `lib/lifecycle/age-haircut.ts:39`.
- [x] F2 asymmetric supersession routing. Evidence: `lib/lifecycle/supersession.ts:36`, `tests/lifecycle-derived-metadata.vitest.ts:289`.
- [x] F3 mixed-version v1/v2 reads + daemon additive backfill. Evidence: `lib/lifecycle/schema-migration.ts:32`, `lib/lifecycle/schema-migration.ts:45`.
- [x] F4 reversible rollback. Evidence: `lib/lifecycle/rollback.ts:22`, `tests/lifecycle-derived-metadata.vitest.ts:272`.
- [x] F5 z_archive/z_future indexed but not routed. Evidence: `lib/lifecycle/archive-handling.ts:29`, `tests/lifecycle-derived-metadata.vitest.ts:303`.
- [x] Y1 lifecycle backfill fits daemon control plane. Evidence: `lib/derived/sync.ts:75`, `tests/lifecycle-derived-metadata.vitest.ts:147`.
- [x] Y3 lifecycle-normalized inputs exposed for 027/003. Evidence: `tests/fixtures/lifecycle/index.ts:5`, `tests/lifecycle-derived-metadata.vitest.ts:338`.
<!-- /ANCHOR:research-conformance -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CQ-001 [P0] TypeScript typecheck passes. [EVIDENCE: `npm run typecheck` exited 0.]
- [x] CQ-002 [P0] Build passes. [EVIDENCE: `npm run build` exited 0.]
- [x] CQ-003 [P1] Scope stayed inside 027/002 authority. [EVIDENCE: `git status --short` shows only scoped new files plus unrelated pre-existing routing-accuracy deletions not staged.]
<!-- /ANCHOR:code-quality -->
