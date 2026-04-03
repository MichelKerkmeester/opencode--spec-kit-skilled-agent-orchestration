# Deep Review Strategy: 012-memory-save-quality-pipeline

## Review Target
- **Target**: 012-memory-save-quality-pipeline (6 recommendations, 9 files, 253 LOC)
- **Type**: spec-folder
- **Spec Folder**: .opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/012-memory-save-quality-pipeline

## Dimension Queue (risk-ordered)
1. correctness — Logic errors, data flow, type safety, edge cases
2. security — Input validation, injection, path traversal, data exposure
3. traceability — Spec↔code, checklist↔evidence, decision↔implementation
4. maintainability — Code clarity, coupling, naming, error handling
5. completeness — Missing edge cases, untested paths, spec gaps

## Scope Files (9 implementation + 6 spec docs)
### Implementation
- scripts/types/session-types.ts (Rec 1: filesChanged field)
- scripts/utils/input-normalizer.ts (Rec 1: filesChanged mapping, validation)
- scripts/core/workflow.ts (Rec 1: normalizeInputData call)
- scripts/extractors/conversation-extractor.ts (Rec 2: extractFromJsonPayload)
- scripts/extractors/collect-session-data.ts (Rec 3: title/summary from sessionSummary)
- scripts/extractors/decision-extractor.ts (Rec 4: compact decisions)
- scripts/core/workflow-path-utils.ts (Rec 4: key_files cap)
- scripts/lib/validate-memory-quality.ts (Rec 5: V8 sibling allowlist)
- scripts/core/quality-scorer.ts (Rec 6: JSON quality floor)

### Spec Documents
- spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md, decision-record.md

## Traceability Protocols
- **Core**: spec_code (spec→implementation mapping), checklist_evidence (checklist→code evidence)
- **Overlay**: None (not a skill/agent/feature-catalog review)

## Configuration
- Max iterations: 5
- Convergence threshold: 0.10
- Stuck threshold: 2

## Dimension Coverage
| Dimension | Status | Iteration | Findings |
|-----------|--------|-----------|----------|
| correctness | reviewed | 1 | P1:1, P2:3 |
| security | reviewed | 2 | P2:3 |
| traceability | reviewed | 3 | P1:1, P2:4 |
| maintainability | reviewed | 4 | P2:4 |
| completeness | reviewed | 5 | P2:2 (new) + P2:1 (refined) |

## Running Findings
- **P1-001**: Unsafe union-type spread merge may produce CollectedDataFull with residual raw fields (correctness, workflow.ts:618-619)
- **P2-001**: filesChanged empty-array not explicitly mapped to FILES:[] on fast-path (correctness, input-normalizer.ts:519-536)
- **P2-002**: Slow-path filesChanged mapping lacks object-entry handling (correctness, input-normalizer.ts:641-664)
- **P2-003**: Quality floor comment-to-code mismatch (correctness, quality-scorer.ts:265-270)
- **P2-004**: No array-length or item-length limits on keyDecisions and filesChanged/filesModified inputs (security, input-normalizer.ts:893-904)
- **P2-005**: resolveSpecFolderPath walks entire directory tree from cwd to filesystem root (security, validate-memory-quality.ts:498-531)
- **P2-006**: Sibling scan adds all matching directories from parent without depth limit (security, validate-memory-quality.ts:562-583)

- **P1-002**: DR-002 claims _source:'json' flag but code implements no such property (traceability, decision-record.md:17 vs conversation-extractor.ts:57-127)
- **P2-007T**: Checklist references filesChanged at line 754 but actual location is line 797 (traceability, checklist.md:13 vs input-normalizer.ts:797)
- **P2-008T**: Checklist references !jsonModeHandled at line 324 but actual location is line 327 (traceability, checklist.md:21 vs conversation-extractor.ts:327)
- **P2-009T**: Spec.md lists data-loader.ts as modified file but it was never changed (traceability, spec.md:120 vs tasks.md)
- **P2-010T**: Multiple checklist line references have minor 1-3 line offsets (systematic pattern) (traceability, checklist.md multiple lines)

- **P2-007M**: Six undocumented magic numbers in quality-scorer.ts JSON quality floor (maintainability, quality-scorer.ts:265-276)
- **P2-008M**: "Rec N:" comment convention creates implicit cross-file coupling without an index (maintainability, 7 files / 12 locations)
- **P2-009M**: Workflow line 618-619 uses double type cast chain obscuring type narrowing (maintainability, workflow.ts:618-619)
- **P2-010M**: input-normalizer.ts fast-path field propagation follows repetitive copy-paste pattern (maintainability, input-normalizer.ts:544-565)

- **P2-011**: Null/undefined sessionSummary edge case -- non-string truthy values produce garbled messages (completeness, conversation-extractor.ts:62)
- **P2-012**: Empty keyDecisions produces only 2 messages, may trigger low quality scores despite floor (completeness, conversation-extractor.ts:87-107)

**Totals**: P0=0, P1=2, P2=16

**P1 Re-Verification (Iteration 5)**:
- P1-001: RETAINED -- spread merge with double cast chain is a real maintenance hazard; conversation-extractor.ts:65 uses untyped cast that could read residual raw fields.
- P1-002: RETAINED -- DR-002 _source:'json' flag not in ConversationMessage type (session-types.ts:426-431) or implementation. No DR amendment records intentional deferral.

## What Worked
- [Iter 1] Tracing data flow from workflow.ts merge point through both fast-path and slow-path in input-normalizer.ts revealed union-type safety gap.
- [Iter 2] Targeted grep for security-sensitive patterns (readdir, path.resolve, regex, sanitize, validate) efficiently identified all relevant code paths without reading entire large files.
- [Iter 3] Systematic cross-referencing of decision-record.md claims against actual code was most productive -- immediately surfaced DR-002 _source:'json' mismatch. Spot-checking checklist line references by grepping for the claimed identifiers caught the 43-line offset on filesChanged.
- [Iter 4] Grep for "Rec N:" across all scripts surfaced the cross-file comment convention (12 hits, 7 files) and focused review on the comment-as-traceability pattern. Reading quality-scorer.ts quality floor block efficiently identified the magic-number cluster.
- [Iter 5] Systematic spec recommendation checklist (Recs 1-6 status) was efficient for completeness assessment. Grep for _source/_jsonSourced across scripts definitively confirmed DR-002 flag absence. Re-reading ConversationMessage type definition (4 fields, no _source) was the fastest evidence for P1-002 re-verification.

## What Failed
- (none yet)

## Exhausted Approaches
- (none yet)

## Next Focus
**REVIEW COMPLETE** -- All 5 dimensions reviewed across 5 iterations. Final verdict pending synthesis.

## Known Context
Implementation completed in current session. 4 parallel agents executed Waves 1-4. TypeScript compiles with zero errors. Memory save achieved 100/100 quality score (was 0/100 pre-fix). No automated tests written yet (deferred to P3).

## Final Summary (5 iterations)
- **Dimensions**: correctness (iter 1), security (iter 2), traceability (iter 3), maintainability (iter 4), completeness (iter 5)
- **Totals**: P0=0, P1=2, P2=16
- **P1-001**: Unsafe spread merge with double cast chain (workflow.ts:618-619) -- RETAINED after adversarial re-check
- **P1-002**: DR-002 _source:'json' flag unimplemented (conversation-extractor.ts) -- RETAINED after adversarial re-check
- **Verdict**: CONDITIONAL (no P0, active P1s remain)


## 2026-04-02 Strategy Update

- Review target: `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/012-memory-save-quality-pipeline`
- This pass runs 4 iterations across: correctness, traceability, completeness, synthesis.
- Strict validation status at start: `PASS`.
- Unchecked tasks/checklist: 7/26.
- Existing active review iterations before this pass: 5.
