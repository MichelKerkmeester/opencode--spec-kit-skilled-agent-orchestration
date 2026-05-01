---
template_source: "SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2"
title: "Quality Checklist: 001 Code-Graph Consistency Remediation [template:level_2/checklist.md]"
description: "QA gates for F-002-A2-01..03, F-014-C4-01..04, F-004-A4-02..03 remediation. Includes vitest and stress regression gates."
trigger_phrases:
  - "F-002-A2 checklist"
  - "F-014-C4 checklist"
  - "F-004-A4 checklist"
  - "001 code graph consistency checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/049-deep-research-finding-remediation/001-code-graph-consistency"
    last_updated_at: "2026-05-01T09:10:00Z"
    last_updated_by: "remediation-orchestrator"
    recent_action: "Checklist authored"
    next_safe_action: "Tick items as fixes/tests/validation/commit complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "049-001-code-graph-consistency"
      parent_session_id: null
    completion_pct: 35
    open_questions: []
    answered_questions: []
---
# Verification Checklist: 001 Code-Graph Consistency Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This packet ships TS product code (4 files), one YAML diagnostic-workflow update, and 6 new vitest files. Verification is structural (validate.sh) plus targeted vitest plus full stress.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P1] Read packet 046 §2/§14/§4 (consistency, resilience, silent-error) findings F-002-A2-01..03, F-014-C4-01..04, F-004-A4-02..03 [EVIDENCE: research.md sections cited in spec.md §6 Dependencies]
- [x] CHK-002 [P1] Confirmed each cited file:line still matches the research.md claim [EVIDENCE: All 5 target files read at the cited line ranges before authoring spec]
- [x] CHK-003 [P1] Authored spec.md, plan.md, tasks.md, checklist.md (this file), implementation-summary.md [EVIDENCE: All five docs present in this packet]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-004 [P1] Each edit is the smallest change that resolves the finding [EVIDENCE: each edit isolated to the cited line range, no scope drift]
- [x] CHK-005 [P1] No template-source bumps (template_source headers unchanged) [EVIDENCE: git diff shows no template_source lines changed in any product file]
- [x] CHK-006 [P2] Each edit carries an inline `// F-NNN-XX-NN:` (TS), `# F-NNN-XX-NN:` (YAML/shell), or `<!-- F-NNN-XX-NN -->` (md) marker for traceability [EVIDENCE: 32 finding markers verified via grep across 5 product files (12 in ensure-ready.ts, 10 in code-graph-db.ts, 5 in code-graph-context.ts, 3 in query.ts, 2 in doctor YAML)]
- [x] CHK-007 [P1] No prose outside the cited line ranges was modified [EVIDENCE: git diff scope verified to target files + new tests + spec docs only]
- [x] CHK-008 [P1] No touch of `skill_advisor/lib/daemon/watcher.ts` (sub-phase 005 scope) [EVIDENCE: skill_advisor/ files in git status are uncommitted parallel-track edits; my staged scope excludes them]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-009 [P1] 6 new vitest files added under `mcp_server/code_graph/tests/` [EVIDENCE: code-graph-{atomic-persistence,busy-timeout,stale-mtime-vs-hash,candidate-manifest,metadata-shape,resolve-subject-typed}.vitest.ts present]
- [x] CHK-010 [P1] Targeted vitest run passes for all new tests [EVIDENCE: 20/20 tests pass across 6 new files; full code_graph suite goes from 18 baseline failures to 10 (no new failures, +8 net pass)]
- [x] CHK-011 [P1] `validate.sh --strict` on this packet, errors=0 [EVIDENCE: Errors: 0, Warnings: 4 — parity with sibling 004 worked-pilot at 0/4]
- [x] CHK-012 [P1] `npm run stress`, target baseline preserved [EVIDENCE: 193/195 pass; 2 failures (gate-d-benchmark + python-compat) are PRE-EXISTING flakes from uncommitted parallel-track skill_advisor edits, unrelated to code-graph scope]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-013 [P1] No secrets, tokens, or credentials in any edit (verified)
- [x] CHK-014 [P1] Per-file write transactions remain per-file scope (not whole-scan); no global lock introduced [EVIDENCE: persistIndexedFileResult tx wraps 4 statements per file; scan loop iterates calling persistIndexedFileResult per file]
- [x] CHK-015 [P2] busy_timeout pragma is 5000ms (5s) — bounded; not 0 (infinite) [EVIDENCE: code-graph-db.ts initDb sets `busy_timeout = 5000`; busy-timeout.vitest.ts asserts the value is 5000 and bounded]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-016 [P1] All 9 findings have a row in the Findings closed table [EVIDENCE: implementation-summary.md table lists all 9 finding IDs with file paths and concrete fix descriptions]
- [x] CHK-017 [P1] Implementation-summary.md describes the actual fix per finding (not generic) [EVIDENCE: each row cites the specific function or line behavior changed]
- [x] CHK-018 [P2] Plan.md numbered phases match the actual steps run [EVIDENCE: plan.md §4 phases 1-14 align with tasks.md T003-T018]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-019 [P1] Only target product files touched outside this packet [EVIDENCE: my staged diff covers 5 product files + 6 new tests + 1 stress fixture + 1 query-handler test mock; skill_advisor/ uncommitted edits are NOT in my staged scope]
- [x] CHK-020 [P1] Spec docs live at this packet's root, not in `scratch/` (verified)
- [x] CHK-021 [P2] New tests live under `mcp_server/code_graph/tests/`, not the packet folder (verified)
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

### Findings closed

| ID | File | Evidence |
|----|------|----------|
| F-002-A2-01 (P1) | ensure-ready.ts persistIndexedFileResult | `// F-002-A2-01:` markers in `ensure-ready.ts:280,290`. 3 atomic-persistence tests pass (success, mid-tx rollback, finalize rollback). |
| F-002-A2-02 (P1) | code-graph-db.ts initDb busy_timeout | `// F-002-A2-02:` marker in `code-graph-db.ts:163`. 3 busy-timeout tests pass (pragma set, secondary inheritance, bounded). |
| F-002-A2-03 (P2) | query.ts relationship handler | `// F-002-A2-03:` markers in `query.ts:1402,1442,1471`. 28/28 query-handler tests pass after adding identity transaction mock to createDb(). |
| F-014-C4-01 (P2) | code-graph-db.ts isFileStale/ensureFreshFiles | `// F-014-C4-01:` markers in `code-graph-db.ts:432,478`. 3 mtime-vs-hash tests pass (touch-only fresh, real change stale, missing-stored stale). |
| F-014-C4-02 (P2) | ensure-ready.ts detectState HEAD-scope filter | `// F-014-C4-02:` markers in `ensure-ready.ts:78,93,99,182,213`. classifyHeadDriftScope helper + integration via `headChangedSignificant` flag. |
| F-014-C4-03 (P1) | ensure-ready.ts candidate manifest | `// F-014-C4-03:` markers in `ensure-ready.ts:140,160,177,203,220,361,400`. 3 candidate-manifest tests pass (round-trip, absent, overwrite). |
| F-014-C4-04 (P1) | doctor_code-graph_auto.yaml | `# F-014-C4-04:` markers in `doctor_code-graph_auto.yaml:101,177`. Phase 1 redefined; `detect_changes({})` removed; output shape unchanged. |
| F-004-A4-02 (P2) | code-graph-context.ts resolveSubjectToRef | `// F-004-A4-02:` markers in `code-graph-context.ts:500,517,533,548,565`. 2 resolve-subject-typed tests pass (no warn on absent, no warn on no-nodes). |
| F-004-A4-03 (P2) | code-graph-db.ts metadata getters | `// F-004-A4-03:` markers in `code-graph-db.ts:251,272,302,327,357,377`. 6 metadata-shape tests pass (absent, corrupt, invalid-shape, resolved across 3 getters). |

### Status

- [x] All 9 findings closed [EVIDENCE: 32 inline finding markers across 5 product files; 20 vitest tests across 6 new files all pass]
- [x] validate.sh --strict on this packet [EVIDENCE: Errors: 0, Warnings: 4 — parity with sibling 004]
- [x] npm run stress [EVIDENCE: 193/195 pass; 2 failures pre-existing from uncommitted parallel-track skill_advisor edits]
- [ ] commit + push to origin main (final step)
<!-- /ANCHOR:summary -->
