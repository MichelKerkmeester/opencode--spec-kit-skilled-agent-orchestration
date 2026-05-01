---
template_source: "SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2"
title: "Quality Checklist: 006 Architecture Cleanup Remediation [template:level_2/checklist.md]"
description: "QA gates for F-016-D1-01..08, F-017-D2-01..03, F-018-D3-01..04 remediation. Includes typecheck, watcher API parity, and stress regression gates."
trigger_phrases:
  - "F-016-D1 checklist"
  - "F-017-D2 checklist"
  - "F-018-D3 checklist"
  - "006 architecture cleanup checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/049-deep-research-finding-remediation/006-architecture-cleanup"
    last_updated_at: "2026-05-01T10:30:00Z"
    last_updated_by: "remediation-orchestrator"
    recent_action: "Checklist authored alongside spec/plan/tasks/implementation-summary"
    next_safe_action: "validate.sh --strict; commit + push"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "049-006-architecture-cleanup"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Verification Checklist: 006 Architecture Cleanup Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This packet ships product code refactors only (no shell-rule changes). Verification is structural (typecheck) plus targeted vitest plus full stress plus watcher public-API parity check (every existing export still resolvable from the original path).
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P2] Read packet 046 §16/§17/§18 (boundary discipline, dependency graph, schema duplication) findings F-016-D1-01..08, F-017-D2-01..03, F-018-D3-01..04 [EVIDENCE: research.md sections cited in spec.md §6 Dependencies]
- [x] CHK-002 [P2] Confirmed each cited file:line still matches the research.md claim [EVIDENCE: All 15 target files read at the cited line ranges before authoring spec]
- [x] CHK-003 [P2] Authored spec.md, plan.md, tasks.md, checklist.md (this file), implementation-summary.md [EVIDENCE: All five docs present in this packet]
- [x] CHK-004 [P2] Pulled latest origin main to integrate sub-phase 005 watcher.ts changes [EVIDENCE: `git pull origin main` reports Already up to date]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-005 [P2] Each refactor preserves the public API of the touched module [EVIDENCE: architecture-seam.vitest.ts asserts reference-identical exports across seam + impl paths for every new utility]
- [x] CHK-006 [P2] No template-source bumps (template_source headers unchanged in product code)
- [x] CHK-007 [P2] Each edit carries an inline `// F-NNN-XX-NN:` marker for traceability [EVIDENCE: grep -rn 'F-016-D1\|F-017-D2\|F-018-D3' returns markers in every touched product file]
- [x] CHK-008 [P2] No prose outside the cited line ranges was modified
- [x] CHK-009 [P2] Watcher refactor (F-016-D1-06) preserves every sub-phase 005 feature (`unwatch?`, ring buffer, `onMalformed`) [EVIDENCE: watcher.ts public API unchanged; daemon-watcher-resource-leaks-049-005 vitest 7/7 passing]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-010 [P2] 2 new vitest files added (`architecture-seam.vitest.ts`, `architecture-cleanup-cycles.vitest.ts`) [EVIDENCE: 17/17 tests passing]
- [x] CHK-011 [P2] Targeted vitest run passes for new tests
- [x] CHK-012 [P2] Existing watcher tests pass after orchestrator extraction (`daemon-watcher-resource-leaks-049-005`) [EVIDENCE: 7/7 passing]
- [x] CHK-013 [P2] `npm run typecheck` exit 0 after each finding group (D3, D2, D1) [EVIDENCE: typecheck after every group reported clean]
- [ ] CHK-014 [P2] `validate.sh --strict` exit 0 on this packet
- [x] CHK-015 [P2] `npm run stress` 57+/58 files passing [EVIDENCE: 1 failure is pre-existing `gate-d-benchmark-memory-search` p95 latency flake (433-481ms vs 300ms threshold), reproducible on baseline with `git stash`]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-016 [P2] No secrets, tokens, or credentials in any edit (verified during authoring)
- [x] CHK-017 [P2] Removed `getDetectedRuntime` confirmed dead [EVIDENCE: grep returned only its own definition + `dist/context-server.d.ts` declaration; no live consumers]
- [x] CHK-018 [P2] Watcher orchestrator extraction does not expand attack surface [EVIDENCE: orchestrator is internal; no new external entry point; export shape on watcher.ts unchanged]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-019 [P2] All 15 findings have a row in the Findings closed table (1 partial-with-reason for F-018-D3-04)
- [x] CHK-020 [P2] Implementation-summary.md describes the actual refactor per finding (not generic)
- [x] CHK-021 [P2] Plan.md numbered phases match the actual steps run (D3 → D2 → D1)
- [x] CHK-022 [P2] F-018-D3-04 deferred reason documented in Known Limitations
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-023 [P2] Only target product files touched outside this packet [EVIDENCE: `git diff --stat` lists only the 15 target product files + 17 new seam/test modules]
- [x] CHK-024 [P2] Spec docs live at this packet's root, not in `scratch/`
- [x] CHK-025 [P2] New seam modules live alongside their domain owner with clear semantic naming [EVIDENCE: `lib/utils/`, `lib/discovery/`, `lib/session/`, `lib/graph/`, `skill_advisor/lib/utils/`, `skill_advisor/lib/scorer/`, `skill_advisor/lib/freshness/`, `skill_advisor/lib/lifecycle/`, `skill_advisor/lib/daemon/`, `skill_advisor/tools/`]
- [x] CHK-026 [P2] New tests live under existing test trees, not the packet folder [EVIDENCE: `mcp_server/tests/architecture-*.vitest.ts`]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

### Findings closed

| ID | File | Evidence |
|----|------|----------|
| F-016-D1-01 (P2) | sqlite-integrity seam + skill-graph-db | `// F-016-D1-01:` markers in `lib/utils/sqlite-integrity.ts` and `lib/skill-graph/skill-graph-db.ts:13`. Seam reference-identity verified. |
| F-016-D1-02 (P2) | skill-label-sanitizer seam + shared-payload | `// F-016-D1-02:` markers in `lib/utils/skill-label-sanitizer.ts` and `lib/context/shared-payload.ts:9`. |
| F-016-D1-03 (P2) | spec-document-finder seam + resume-ladder | `// F-016-D1-03:` markers in `lib/discovery/spec-document-finder.ts` and `lib/resume/resume-ladder.ts:9`. |
| F-016-D1-04 (P2) | advisor-status-reader seam + daemon-probe | `// F-016-D1-04:` markers in `skill_advisor/lib/compat/advisor-status-reader.ts` and `daemon-probe.ts:8`. |
| F-016-D1-05 (P2) | busy-retry seam + rebuild-from-source | `// F-016-D1-05:` markers in `skill_advisor/lib/utils/busy-retry.ts` and `rebuild-from-source.ts:7`. |
| F-016-D1-06 (P2) | watcher-orchestrator + watcher | `// F-016-D1-06:` markers in `daemon/watcher-orchestrator.ts` and `daemon/watcher.ts`. Public API parity verified; 7/7 watcher tests pass. |
| F-016-D1-07 (P2) | age-policy seam + derived lane | `// F-016-D1-07:` markers in `scorer/age-policy.ts` and `scorer/lanes/derived.ts:5`. |
| F-016-D1-08 (P2) | df-idf predicate parameter | `// F-016-D1-08:` markers in `corpus/df-idf.ts`. Default predicate keeps existing behavior. |
| F-017-D2-01 (P2) | structural-bootstrap-contract seam | `// F-017-D2-01:` markers in `lib/session/structural-bootstrap-contract.ts`, `session-snapshot.ts`, `hooks/memory-surface.ts:13`. |
| F-017-D2-02 (P2) | community-types seam | `// F-017-D2-02:` markers in `lib/graph/community-types.ts` and 3 import sites. |
| F-017-D2-03 (P2) | remove `getDetectedRuntime` | `// F-017-D2-03:` marker in `context-server.ts`; dead export removed. |
| F-018-D3-01 (P2) | trust-state-values + schemas | `// F-018-D3-01:` markers in `freshness/trust-state-values.ts` and `trust-state.ts`. |
| F-018-D3-02 (P2) | lifecycle status-values + downstream | `// F-018-D3-02:` markers in `lifecycle/status-values.ts`, `scorer/types.ts:10`, `age-haircut.ts`, `supersession.ts`. |
| F-018-D3-03 (P2) | advisor-runtime-values | `// F-018-D3-03:` markers in `advisor-runtime-values.ts` and `skill-advisor-brief.ts:47`. |
| F-018-D3-04 (P2, partial) | advisor-contract-keys + 3 sites | `// F-018-D3-04:` markers in `tools/advisor-contract-keys.ts`, `advisor-recommend.ts`, `advisor-validate.ts`, `tool-input-schemas.ts`. Two critical contracts deduplicated; broader 60+-tool surface deferred to follow-on packet. |

### Status

- [x] All 15 findings closed (1 partial, deferred reason documented)
- [x] npm run typecheck — exit 0
- [x] new vitest tests — 17/17 passing
- [x] existing watcher tests — 7/7 passing
- [x] npm run stress — 57/58 (1 latency flake reproducible on baseline)
- [ ] validate.sh --strict on this packet
- [ ] commit + push to origin main (final step)
<!-- /ANCHOR:summary -->
