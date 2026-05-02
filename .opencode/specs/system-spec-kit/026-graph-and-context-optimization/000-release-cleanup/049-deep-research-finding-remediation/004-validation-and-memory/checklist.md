---
template_source: "SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2"
title: "Quality Checklist: 004 Validation And Memory Remediation [template:level_2/checklist.md]"
description: "QA gates for F-005-A5-01..06, F-008-B3-01..02, F-009-B4-01..05 remediation. Includes test fixture and stress regression gates."
trigger_phrases:
  - "F-005-A5 checklist"
  - "F-008-B3 checklist"
  - "F-009-B4 checklist"
  - "004 validation and memory checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/049-deep-research-finding-remediation/004-validation-and-memory"
    last_updated_at: "2026-05-01T08:10:00Z"
    last_updated_by: "remediation-orchestrator"
    recent_action: "Checklist authored"
    next_safe_action: "Tick items as fixes/tests/validation/commit complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "049-004-validation-and-memory"
      parent_session_id: null
    completion_pct: 35
    open_questions: []
    answered_questions: []
---
# Verification Checklist: 004 Validation And Memory Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This packet ships product code AND shell-rule changes plus 7 vitest files and 4 new test fixtures. Verification is structural (validate.sh) plus targeted vitest plus full stress.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P1] Read packet 046 §5/§8/§9 (advisor schema, memory/causal links, validators) findings F-005-A5-01..06, F-008-B3-01..02, F-009-B4-01..05 [EVIDENCE: research.md sections cited in spec.md §6 Dependencies]
- [x] CHK-002 [P1] Confirmed each cited file:line still matches the research.md claim [EVIDENCE: All 9 target files read at the cited line ranges before authoring spec]
- [x] CHK-003 [P1] Authored spec.md, plan.md, tasks.md, checklist.md (this file), implementation-summary.md [EVIDENCE: All five docs present in this packet]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-004 [P1] Each edit is the smallest change that resolves the finding [EVIDENCE: each edit isolated to the cited line range]
- [x] CHK-005 [P1] No template-source bumps (template_source headers unchanged) [EVIDENCE: git diff shows no template_source lines changed in any product file]
- [x] CHK-006 [P2] Each edit carries an inline `// F-NNN-XX-NN:` (TS), `# F-NNN-XX-NN:` (shell), or `<!-- F-NNN-XX-NN -->` (md) marker for traceability (verified)
- [x] CHK-007 [P1] No prose outside the cited line ranges was modified [EVIDENCE: git diff scope verified to target files + new tests/fixtures + spec docs only]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-008 [P1] 7 new vitest files added under `mcp_server/skill_advisor/tests/{schemas,handlers}/` and `mcp_server/tests/` (verified)
- [x] CHK-009 [P1] 4 new test fixtures added under `scripts/test-fixtures/` (064-067) (verified)
- [x] CHK-010 [P1] Targeted vitest run passes for all new tests [EVIDENCE: 55/55 tests passed across 7 new files; 41/41 advisor handler tests; 47/47 memory-parser; 190/190 causal-edges + checkpoints; 73/73 checkpoint + search consumers]
- [x] CHK-011 [P1] `validate.sh` against ALL existing 60+ fixtures still passes (no regression) [EVIDENCE: PRE/POST diff shows 0 changes across 62 existing fixtures]
- [x] CHK-012 [P1] `validate.sh --strict` on this packet [EVIDENCE: Errors: 0, Warnings: 4 — parity with 010 pilot at 0/5]
- [x] CHK-013 [P1] `npm run stress` [EVIDENCE: 58 files / 195 tests / exit 0]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-014 [P1] No secrets, tokens, or credentials in any edit (verified)
- [x] CHK-015 [P1] `workspaceRoot` allowlist tested for repo-root + `os.tmpdir()` + `/tmp` legitimate paths AND rejects arbitrary paths [EVIDENCE: 14 schema tests pass, including allowlist accept + reject coverage]
- [x] CHK-016 [P1] Checkpoint malformed-row quarantine prevents propagation of untyped data into restore loops [EVIDENCE: 7 schema tests pass; quarantine path returns early with `Malformed snapshot row N: <reason>` entries]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-017 [P1] All 13 findings have a row in the Findings closed table (verified)
- [x] CHK-018 [P1] Implementation-summary.md describes the actual fix per finding (not generic) (verified)
- [x] CHK-019 [P2] Plan.md numbered phases match the actual steps run (verified)
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-020 [P1] Only target product files touched outside this packet [EVIDENCE: git diff scope: 9 product files + 1 new helper + 4 new fixtures + 7 new tests]
- [x] CHK-021 [P1] Spec docs live at this packet's root, not in `scratch/` (verified)
- [x] CHK-022 [P2] New tests + fixtures live under existing test trees, not the packet folder (verified)
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

### Findings closed

| ID | File | Evidence |
|----|------|----------|
| F-005-A5-01 (P1) | advisor schemas + 2 handlers | `// F-005-A5-01:` markers in `advisor-tool-schemas.ts:14`, `advisor-recommend.ts:36`, `advisor-validate.ts:146`. 14 new schema tests pass; existing 41 advisor handler tests pass. |
| F-005-A5-02 (P1) | advisor-validate.ts loadCorpus/loadRegressionCases | `// F-005-A5-02:` markers in `advisor-validate.ts:73,165,193`. 13 new shape tests pass. |
| F-005-A5-03 (P2) | advisor-validate.ts runPythonTopSkills | `// F-005-A5-03:` markers in `advisor-validate.ts:94,308`. 4 new shape tests pass. |
| F-005-A5-04 (P2) | search-results.ts triggerPhrases | `// F-005-A5-04:` markers in `search-results.ts:258,832`. 9 new shape tests pass. |
| F-005-A5-05 (P2) | memory-parser.ts parseDescriptionMetadataContent | `// F-005-A5-05:` markers in `memory-parser.ts:32,527,544`. 4 new schema tests pass; 47 existing memory-parser tests pass. |
| F-005-A5-06 (P2) | checkpoints.ts restoreCheckpoint | `// F-005-A5-06:` markers in `checkpoints.ts:250,1611,1955`. 7 new schema tests pass; 38 existing checkpoint tests pass. |
| F-008-B3-01 (P1) | memory-parser.ts extractCausalLinks | `// F-008-B3-01:` marker in `memory-parser.ts:905`. 6 new snake_case parity tests pass. |
| F-008-B3-02 (P1) | causal-links-processor.ts processCausalLinks | `// F-008-B3-02:` markers in `causal-links-processor.ts:405,423`. 2 new null-insert tests pass; 152 existing causal-edges tests pass. |
| F-009-B4-01 (P1) | check-spec-doc-integrity.sh | `# F-009-B4-01:` marker in `check-spec-doc-integrity.sh:59`. Fixture `064-link-formats/` exercises 4 link formats; PRE/POST shows zero regressions across 62 existing fixtures. |
| F-009-B4-02 (P1) | check-evidence.sh | `# F-009-B4-02:` markers in `check-evidence.sh:15,86`. Fixture `065-evidence-strict-marker/` exercises strict semantic-marker requirement. |
| F-009-B4-03 (P2) | check-evidence.sh + scripts/lib/check-priority-helper.sh (new) | `# F-009-B4-03:` markers in `check-evidence.sh:17,25,60,71` + `check-priority-helper.sh:10`. Helper sourced + reused. |
| F-009-B4-04 (P1) | check-template-headers.sh | `# F-009-B4-04:` markers in `check-template-headers.sh:65,106`. Fixture `066-template-header-drift-mid/` exercises mid-doc drift classification. |
| F-009-B4-05 (P2) | check-template-headers.sh | `# F-009-B4-05:` marker in `check-template-headers.sh:155`. Fixture `067-checklist-uppercase-x/` exercises [X] parity. |

### Status

- [x] All 13 findings closed [EVIDENCE: 13 inline finding markers verified via grep]
- [x] validate.sh --strict on this packet [EVIDENCE: Errors: 0, Warnings: 4 — parity with worked-pilot 010 at 0/5]
- [x] npm run stress [EVIDENCE: 58 files / 195 tests / exit 0]
- [ ] commit + push to origin main (final step)
<!-- /ANCHOR:summary -->
