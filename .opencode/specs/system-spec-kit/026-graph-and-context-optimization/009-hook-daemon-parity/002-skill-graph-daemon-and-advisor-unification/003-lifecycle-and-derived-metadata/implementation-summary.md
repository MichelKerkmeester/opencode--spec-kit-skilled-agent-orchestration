---
title: "Implementation Summary — 027/002"
description: "This implementation summary captures Implementation Summary , 027/002 for lifecycle and derived metadata."
trigger_phrases:
  - "lifecycle and derived metadata"
  - "skill graph daemon and advisor unification"
  - "implementation summary 027/002"
  - "lifecycle and derived metadata implementation summary"
  - "system spec kit"
importance_tier: "normal"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/003-lifecycle-and-derived-metadata"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled frontmatter (repo-wide gap fill)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["implementation-summary.md"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
---
title: "...emon-parity/002-skill-graph-daemon-and-advisor-unification/003-lifecycle-and-derived-metadata/implementation-summary]"
description: "Populated post-implementation."
trigger_phrases:
  - "027/002 implementation summary"
  - "lifecycle derived metadata implementation"
  - "skill graph daemon advisor unification summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/003-lifecycle-and-derived-metadata"
    last_updated_at: "2026-04-20T15:49:40Z"
    last_updated_by: "codex"
    recent_action: "Completed lifecycle derived metadata"
    next_safe_action: "Orchestrator can review the local commit, then push after external verification."
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/derived/extract.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/derived/sync.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/derived/sanitizer.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/lifecycle/schema-migration.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/lifecycle/rollback.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/corpus/df-idf.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/skill-derived-v2.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/lifecycle-derived-metadata.vitest.ts"
    session_dedup:
      fingerprint: "sha256:97dc99c6d70ab892a42b01f14ad4787e9de5a46d70307ce398157ffb0e0b6e25"
      session_id: "027-002-implementation-r01"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Commit-message derived signals remain excluded from the first slice per 027/002 scope."
---
# Implementation Summary — 027/002

<!-- SPECKIT_LEVEL: 2 -->

<!-- ANCHOR:status -->
## Status
Complete. 027/002 shipped lifecycle + derived metadata in the scoped advisor package, with all P0 and P1 checklist items marked complete and targeted verification green.
<!-- /ANCHOR:status -->

<!-- ANCHOR:completion-impact -->
## Completion Impact
- Added deterministic derived extraction from SKILL.md author metadata, headings, body n-grams, examples, references headings, assets filenames, graph `intent_signals`, prior `derived.source_docs`, and prior `derived.key_files`.
- Added schema-v2 `graph-metadata.json.derived` validation with provenance fingerprints, source/key file tracking, lifecycle status, redirects, trust lane, and `sanitizer_version`.
- Added additive v1 -> v2 migration and additive rollback that strips `derived` while preserving author-maintained metadata.
- Added lifecycle routing primitives: derived-lane-only age/status haircuts, asymmetric supersession, and `z_archive`/`z_future` indexed-but-not-default-routable policy.
- Added anti-stuffing caps and repetition demotion/rejection before derived lane scoring contribution.
- Added DF/IDF corpus stats for active skills only, with startup recompute API and debounced updater.
- Wired the 027/001 watcher path in tests through `reindexSkill` -> derived refresh -> generation bump within the under-10s acceptance window.
<!-- /ANCHOR:completion-impact -->

<!-- ANCHOR:files-changed -->
## Files Changed
- `mcp_server/skill-advisor/schemas/skill-derived-v2.ts`
- `mcp_server/skill-advisor/lib/derived/extract.ts`
- `mcp_server/skill-advisor/lib/derived/sync.ts`
- `mcp_server/skill-advisor/lib/derived/sanitizer.ts`
- `mcp_server/skill-advisor/lib/derived/provenance.ts`
- `mcp_server/skill-advisor/lib/derived/trust-lanes.ts`
- `mcp_server/skill-advisor/lib/derived/anti-stuffing.ts`
- `mcp_server/skill-advisor/lib/lifecycle/age-haircut.ts`
- `mcp_server/skill-advisor/lib/lifecycle/supersession.ts`
- `mcp_server/skill-advisor/lib/lifecycle/archive-handling.ts`
- `mcp_server/skill-advisor/lib/lifecycle/schema-migration.ts`
- `mcp_server/skill-advisor/lib/lifecycle/rollback.ts`
- `mcp_server/skill-advisor/lib/corpus/df-idf.ts`
- `mcp_server/skill-advisor/tests/lifecycle-derived-metadata.vitest.ts`
- `mcp_server/skill-advisor/tests/fixtures/lifecycle/index.ts`
- `tasks.md`
- `checklist.md`
<!-- /ANCHOR:files-changed -->

<!-- ANCHOR:verification -->
## Verification
- Baseline before edits: `vitest run mcp_server/skill-advisor/tests/daemon-freshness-foundation.vitest.ts mcp_server/tests/advisor-freshness.vitest.ts --reporter=default` => 2 files, 27 tests passed.
- New acceptance suite: `vitest run mcp_server/skill-advisor/tests/lifecycle-derived-metadata.vitest.ts --reporter=default` => 1 file, 13 tests passed.
- Targeted advisor suite: `vitest run mcp_server/skill-advisor/tests/ --reporter=default` => 2 files, 29 tests passed.
- Typecheck/build: `npm run typecheck && npm run build` => exit 0.
- SKILL.md write audit: `grep -rn "SKILL\.md" mcp_server/skill-advisor/lib/derived/ --include="*.ts" | grep -v "read\|source\|comment"` => 0 lines.
- Direct SKILL write audit: `grep -rn "writeFileSync.*SKILL" mcp_server/skill-advisor/ --include="*.ts"` => 0 lines.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:sanitizer-coverage -->
## A7 Sanitizer Coverage

| Boundary | Coverage |
| --- | --- |
| SQLite insert | `sanitizeDerivedValue(value, "sqlite")` rejects instruction-shaped values before persistence handoff; regression covered in `lifecycle-derived-metadata.vitest.ts`. |
| `graph-metadata.json.derived` | `syncDerivedMetadata()` validates sanitized arrays and schema-v2 before atomic write. |
| Envelope publication | `sanitizeEnvelopeSkillLabel()` wraps redirect metadata surfaced by supersession routing. |
| Diagnostic emit | `sanitizeDiagnostic()` replaces unsafe diagnostics with `SANITIZED_DIAGNOSTIC`. |
<!-- /ANCHOR:sanitizer-coverage -->

<!-- ANCHOR:lifecycle-fixtures -->
## Lifecycle Fixtures

- `superseded`: deprecated skill with `redirectTo`.
- `successor`: active replacement with `redirectFrom`.
- `archived`: `z_archive` source path fixture.
- `future`: `z_future` source path fixture.
- `rolledBack`: schema-v1 rollback fixture.
- `mixedVersion`: paired v1/v2 transition fixture.
<!-- /ANCHOR:lifecycle-fixtures -->

<!-- ANCHOR:carry-over -->
## Carry-Over

- Commit-message signal integration remains a P2 suggestion and is intentionally excluded from the 027/002 first slice.
- 200-prompt corpus parity was not run because the phase contract requested the targeted 027/001 + 027/002 advisor tests only.
<!-- /ANCHOR:carry-over -->
