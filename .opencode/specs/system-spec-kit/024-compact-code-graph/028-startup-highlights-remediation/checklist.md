---
title: "Checklist: Startup Highlights [system-spec-kit/024-compact-code-graph/028-startup-highlights-remediation/checklist]"
description: "QA verification checklist for P1 fixes."
trigger_phrases:
  - "028 checklist"
importance_tier: "normal"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/028-startup-highlights-remediation"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["checklist.md"]
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: Startup Highlights Remediation

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | Hard blocker | Cannot close the phase until complete |
| **[P1]** | Required | Must complete or be explicitly deferred |
| **[P2]** | Advisory | Safe to defer with documentation |
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The spec clearly captures the three deep-review findings being remediated. [EVIDENCE: `spec.md` defines duplicate, path-filter, and ranking issues in the problem/requirements sections.]
- [x] CHK-002 [P1] The plan keeps the work scoped to startup-highlight SQL plus focused verification. [EVIDENCE: `plan.md` limits implementation to the query rewrite, validation, and rollback path.]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `queryStartupHighlights(5)` returns 0 duplicate `(name, kind, file_path)` tuples. [EVIDENCE: Live verification reported five unique startup-highlight entries.]
- [x] CHK-011 [P0] No vendored paths (`site-packages/`, `node_modules/`, `.venv/`) appear in the startup highlights output. [EVIDENCE: Live verification returned only project-code paths.]
- [x] CHK-012 [P0] No test paths (`tests/`, `test_`, `__tests__`) appear in the startup highlights output. [EVIDENCE: Live verification reported zero test-file entries.]
- [x] CHK-013 [P1] Incoming-call-count ranking surfaces depended-upon symbols rather than chatty callers. [EVIDENCE: Returned highlights were core project symbols such as `getDb` and `ensureSchema`, not harness functions.]
- [x] CHK-014 [P1] The diversity rule remains intact after the SQL rewrite. [EVIDENCE: The ranked CTE still enforces `ROW_NUMBER() ... PARTITION BY file_path` with `file_rank <= 2`.]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Existing `startup-brief.vitest.ts` coverage remains green after the remediation. [EVIDENCE: Focused vitest run passed with the startup-brief suite included.]
- [x] CHK-021 [P0] Workspace TypeScript/build verification remains green after the query change. [EVIDENCE: Workspace build/typecheck evidence is captured in the implementation summary.]
- [x] CHK-022 [P1] Live verification confirms the top startup highlights are recognizable project symbols. [EVIDENCE: `normalizeWhitespace`, `getDb`, `ensureSchema`, `hasTable`, and `Finding` were observed in the top results.]
- [x] CHK-023 [P1] Edge direction was verified before switching to incoming-call ranking. [EVIDENCE: The structural indexer confirms `source_id = caller` and `target_id = callee`.]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P1] The path exclusion rules reduce noisy third-party/test output without exposing extra workspace detail. [EVIDENCE: The result set is narrower and more relevant, with no additional sensitive metadata added.]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md`, and `implementation-summary.md` all describe the same remediation scope. [EVIDENCE: Each packet document now references the same three deep-review findings and the same focused verification path.]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] The remediation stays limited to the startup-highlight query, focused tests, and the phase packet docs. [EVIDENCE: No unrelated packet folders or runtime surfaces were reopened for this phase.]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 5 | 5/5 |
| P1 Items | 7 | 7/7 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-04-02
<!-- /ANCHOR:summary -->
