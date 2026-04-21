# Implementation Deep Review Report - 003-deduplicate-entities

## 1. Executive summary

Verdict: CONDITIONAL PASS. The implementation-focused loop found no P0 release blockers, but it found 2 P1 implementation issues and 3 P2 test/robustness gaps.

Confidence: high for the reviewed scope. The packet listed two code files, both were read directly, git history was checked, and the focused vitest file passed in all 10 iterations.

Counts:

| Severity | Count |
|----------|-------|
| P0 | 0 |
| P1 | 2 |
| P2 | 3 |

## 2. Scope

Audited code files:

| File | Role |
|------|------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` | Production parser and metadata derivation |
| `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts` | Focused regression tests |

Supporting code read for context:

| File | Role |
|------|------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts` | Schema cap permissiveness check |
| `.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts` | Entity extraction behavior context |

Not audited as findings evidence: spec docs, `description.json`, `graph-metadata.json`, and the prior `review/review-report.md`.

## 3. Method

The loop ran 10 iterations with dimensions rotated as requested: correctness, security, robustness, testing, then repeat. Each iteration read the parser and focused test file, checked git log for the implementation files, and ran:

`cd .opencode/skill/system-spec-kit/mcp_server && ../scripts/node_modules/.bin/vitest run tests/graph-metadata-schema.vitest.ts --reporter=default`

Result: PASS in every iteration, 22 tests passed each run.

Git log evidence was checked with:

`git log --oneline --max-count=5 -- .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts .opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts`

Recent commits observed included `9d18b61f50`, `1bdd1ed035`, `6fd8d5b210`, `af106be0bc`, and `fb5340399c`.

## 4. Findings by severity

### P0

| ID | Dimension | Finding | Evidence |
|----|-----------|---------|----------|
| None | - | No P0 findings. | - |

### P1

| ID | Dimension | Finding | Required code evidence |
|----|-----------|---------|------------------------|
| FIMPL-001 | correctness | Name-keyed entity dedupe drops distinct same-basename code files. | `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:872`; `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:879`; `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:889`; `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:445` |
| FIMPL-002 | security | Internal dot-dot path segments are not rejected before key-file existence checks. | `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:521`; `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:557`; `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:730`; `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:784` |

### P2

| ID | Dimension | Finding | Required code evidence |
|----|-----------|---------|------------------------|
| FIMPL-003 | robustness | Legacy metadata migration path bypasses the 12 trigger-phrase cap. | `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:262`; `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:289`; `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1053`; `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts:37` |
| FIMPL-004 | testing | Regression tests cover canonical doc basename collisions but not distinct non-canonical file basename collisions. | `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:445`; `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:461`; `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:872`; `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:889` |
| FIMPL-005 | testing | Key-file sanitization tests reject leading `../` but miss internal `../` traversal segments. | `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:386`; `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:400`; `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:557`; `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:730` |

## 5. Findings by dimension

| Dimension | Iterations | Findings | Summary |
|-----------|------------|----------|---------|
| correctness | 001, 005, 009 | FIMPL-001 | Canonical doc dedupe is valid, but the same lowercased-name map also collapses distinct implementation files with shared basenames. |
| security | 002, 006, 010 | FIMPL-002 | No arbitrary read/write P0 was found, but traversal-shaped key-file references can pass into existence checks and metadata. |
| robustness | 003, 007 | FIMPL-003 | Fresh derivation caps trigger phrases, but legacy fallback migration remains uncapped. |
| testing | 004, 008 | FIMPL-004, FIMPL-005 | Tests cover the intended happy regressions but miss the two edge cases behind the P1s. |

## 6. Adversarial self-check for P0

Candidate P0: FIMPL-002 could look like path traversal.

Recheck: the reviewed code calls existence/stat checks and returns a display path; it does not read the referenced file content. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:680`, `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:685`, and `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:784`.

Decision: not P0. It remains P1 because spec-controlled traversal-shaped references should fail closed before lookup and should not enter generated metadata.

Candidate P0: FIMPL-001 could hide code-file graph references.

Recheck: it can drop graph entities for same-basename files, but `derived.key_files` can still contain the paths and the issue does not crash or corrupt user data. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:938` and `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:942`.

Decision: not P0. It remains P1 wrong semantics for graph entity precision.

## 7. Remediation order

1. Fix FIMPL-001 by narrowing name-key dedupe to canonical packet docs, or by using a path-aware key for non-canonical file entities.
2. Fix FIMPL-002 by rejecting any normalized path segment equal to `..` before `buildKeyFileLookupPaths()` runs.
3. Add FIMPL-004 regression coverage for distinct same-basename implementation files.
4. Add FIMPL-005 regression coverage for internal traversal segments.
5. Fix FIMPL-003 by applying `.slice(0, 12)` in the legacy fallback trigger phrase construction or by centralizing trigger phrase normalization.

## 8. Test additions needed

| Test | Purpose |
|------|---------|
| `preserves distinct non-canonical same-basename entities` | Guards FIMPL-001. Fixture should create two real files with the same basename under different directories and expect both paths to be represented. |
| `rejects key-file candidates containing dot-dot path segments` | Guards FIMPL-002/FIMPL-005. Exercise `nested/../target.ts` and `nested/../../target.ts`. |
| `caps migrated legacy trigger phrases at 12` | Guards FIMPL-003. Validate legacy fallback output rather than only fresh derivation. |

## 9. Appendix: iteration list + churn

| Iteration | Dimension | New findings ratio | Churn | Findings |
|-----------|-----------|--------------------|-------|----------|
| 001 | correctness | 0.45 | 0.45 | FIMPL-001 |
| 002 | security | 0.33 | 0.33 | FIMPL-002 |
| 003 | robustness | 0.18 | 0.18 | FIMPL-003 |
| 004 | testing | 0.14 | 0.14 | FIMPL-004 |
| 005 | correctness | 0.08 | 0.04 | none; refined FIMPL-001 |
| 006 | security | 0.07 | 0.04 | none; refined FIMPL-002 |
| 007 | robustness | 0.06 | 0.04 | none; refined FIMPL-003 |
| 008 | testing | 0.11 | 0.11 | FIMPL-005 |
| 009 | correctness | 0.05 | 0.03 | none; refined FIMPL-001 |
| 010 | security | 0.05 | 0.03 | none; refined FIMPL-002/FIMPL-005 |

Stop reason: max iterations reached.
