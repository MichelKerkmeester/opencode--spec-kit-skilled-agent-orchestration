---
template_source: "SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2"
title: "Quality Checklist: 009 Test Reliability Remediation [template:level_2/checklist.md]"
description: "QA gates for F-015-C5-01..06 remediation. Test-only changes; full stress + sample unit suite + validate strict."
trigger_phrases:
  - "F-015-C5 checklist"
  - "009 test reliability checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/049-deep-research-finding-remediation/009-test-reliability"
    last_updated_at: "2026-05-01T07:36:00Z"
    last_updated_by: "remediation-orchestrator"
    recent_action: "Checklist authored"
    next_safe_action: "Tick items as edits/tests/validate/commit complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "049-009-test-reliability"
      parent_session_id: null
    completion_pct: 25
    open_questions: []
    answered_questions: []
---
# Verification Checklist: 009 Test Reliability Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This is a test-only remediation packet. Verification has three layers: per-test isolation, sample unit-suite invocation, and full stress suite. The validate.sh strict pass + diff scope review remain the structural gate.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] [P1] Read packet 046 §C5 (test reliability) findings F-015-C5-01..06
- [x] [P1] Confirmed each cited file:line still matches the research.md claim
- [x] [P1] Authored spec.md, plan.md, tasks.md, checklist.md (this file), implementation-summary.md
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] [P1] Each edit is the smallest test-only change that resolves the finding
- [ ] [P1] No product-code files touched (no `handlers/**`, no `lib/response/**`, no `lib/search/**`, no `lib/parsing/**`)
- [ ] [P2] Each edit carries an inline `// F-015-C5-NN` marker for traceability
- [ ] [P2] Shared helper `env-snapshot.ts` is ~30 LOC, zero runtime deps, pure ESM
- [ ] [P1] No prose outside the cited line ranges was modified
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] [P1] Each modified test passes in isolation via `npx vitest run <file>`
- [ ] [P1] Sample unit-test invocation `cd mcp_server && npx vitest run tests/envelope.vitest.ts tests/hybrid-search-flags.vitest.ts tests/memory-save-pipeline-enforcement.vitest.ts` exit 0
- [ ] [P1] Full `npm run stress` exit 0 (56+ files / 163+ tests)
- [ ] [P1] `validate.sh --strict` on this packet exits 0
- [ ] [P2] envelope.vitest.ts T154 still asserts latency relationship correctly (latencyMs >= simulated elapsed)
- [ ] [P2] BENCHMARK=1 path verified at least conceptually (gate present; absolute thresholds preserved inside the gate)
<!-- /ANCHOR:testing -->

<!-- ANCHOR:security -->
## Security

- [x] [P1] No secrets, tokens, or credentials in any edit
- [x] [P1] No new external dependencies added
- [x] [P1] No external links added; all references stay within the repo
- [ ] [P2] mkdtemp roots clean up via afterAll/afterEach to avoid disk leaks across runs
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] [P1] All six findings have a row in the Findings closed table
- [ ] [P1] Implementation-summary.md describes the actual fix per finding (not generic)
- [ ] [P2] Plan.md numbered phases match the eleven steps actually run
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] [P1] Six test files modified plus one new helper (`mcp_server/lib/test-helpers/env-snapshot.ts`)
- [ ] [P1] No `mcp_server/handlers/**` or product `lib/**` (non-test-helpers) files touched
- [ ] [P1] Spec docs live at this packet's root, not in `scratch/`
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

### Findings closed

| ID | File | Evidence |
|----|------|----------|
| F-015-C5-01 (P1) | gate-d-resume-perf.vitest.ts | Hard-coded REPO_ROOT replaced with `const ORIGINAL_CWD = process.cwd()` captured at module load; `// F-015-C5-01` marker |
| F-015-C5-02 (P2) | gate-d-benchmark-session-resume.vitest.ts | Absolute p50/p95 asserts wrapped in `if (process.env.BENCHMARK === '1')`; `// F-015-C5-02` marker |
| F-015-C5-03 (P2) | envelope.vitest.ts | T154 latency tests use `vi.useFakeTimers()` + `vi.setSystemTime`; `vi.useRealTimers()` in `afterEach`; `// F-015-C5-03` marker |
| F-015-C5-04 (P1) | opencode-plugin-bridge-stress.vitest.ts | `snapshotEnv([...])` in `beforeEach`, `restore()` in `afterEach`; `// F-015-C5-04` marker |
| F-015-C5-05 (P2) | hybrid-search-flags.vitest.ts | `snapshotEnv(['SPECKIT_MMR'])` + `restore()`; `// F-015-C5-05` marker |
| F-015-C5-06 (P2) | memory-save-pipeline-enforcement.vitest.ts | FIXTURE_ROOT now `fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-pipeline-fixture-'))`; `// F-015-C5-06` marker |

### Status

- [ ] All six findings closed
- [ ] Each modified test passes in isolation
- [ ] Sample unit-test invocation exit 0
- [ ] Full `npm run stress` exit 0 (56+ files / 163+ tests)
- [ ] validate.sh --strict exit 0
- [ ] commit + push to origin main
<!-- /ANCHOR:summary -->
