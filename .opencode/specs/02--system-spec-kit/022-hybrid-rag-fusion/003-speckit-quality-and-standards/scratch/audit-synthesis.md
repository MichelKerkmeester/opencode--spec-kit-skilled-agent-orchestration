# Audit Synthesis Report

**Date:** 2026-03-08
**Source:** 20 audit files (H01-H20), covering 515+ files across TypeScript source, shell scripts, tests, READMEs, and configuration
**Auditors:** Codex GPT-5.4, Claude Opus 4.6 (leaf agents, read-only)

---

## Aggregate Findings

### P0 Issues by Category

| Category | Count | Files Affected | Mechanical Fix? |
|----------|-------|----------------|-----------------|
| File headers (missing/malformed 3-line MODULE block) | ~168 | ~160 files across H01-H13, H15 | YES -- scripted: prepend 3-line block |
| WHY comments missing AI- prefix | ~48 | ~20 files (concentrated in lib/search/, lib/cognitive/, lib/scoring/) | YES -- regex replace `// WHY:` with `// AI-WHY:` |
| Commented-out code blocks | ~18 | ~15 files (fsrs-scheduler, composite-scoring, attention-decay, working-memory, etc.) | MANUAL -- review each block for removal vs restoration |
| No `any` in exports | 1 | eval-ceiling.ts (H07) | MANUAL -- replace `any` with proper type |
| PascalCase types | 2 | session-types.ts, input-normalizer.ts (H13) | YES -- rename types to PascalCase |
| COMPONENT header missing (shell) | 7 | ops/*.sh, wrap-all-templates.sh (H14) | YES -- add COMPONENT label to header |
| Conditional strict mode (shell) | 3 | lib/git-branch.sh, lib/shell-common.sh, lib/template-utils.sh (H14) | MANUAL -- documented exception, may accept |
| Unquoted variables (shell) | 3 | lib/git-branch.sh, rules/check-anchors.sh (H14) | MANUAL -- convert to array iteration |
| SQL string interpolation | 7 | causal-boost.ts, entity-linker.ts, folder-relevance.ts, checkpoints.ts, learned-triggers-schema.ts, consumption-logger.ts (H03, H08) | MANUAL -- verify parameterized; add safety comments |
| Non-AI comment blocks | ~18 | lib/search/ files (H03) | YES -- add AI- prefix or remove |

**Total P0 issues: ~275**

### P1 Issues by Category

| Category | Count | Files Affected | Mechanical Fix? |
|----------|-------|----------------|-----------------|
| Missing TSDoc on exports | ~490 | ~100+ files across all TS audits | SEMI -- scaffolding scriptable, content manual |
| Catch blocks lacking instanceof narrowing | ~270 | ~70+ files (worst: vector-index-schema 66, checkpoints 27) | YES -- add `if (error instanceof Error)` pattern |
| Non-null assertions without justification | ~40 | ~20 files (community-detection, corrections, co-activation, etc.) | MANUAL -- add `// AI-SAFETY:` comment or refactor |
| Missing explicit return types | ~35 | ~15 files (vector-index-*, temporal-contiguity, interference-scoring, etc.) | YES -- add `: ReturnType` annotations |
| Inline object params (should be named interfaces) | ~25 | ~12 files (hybrid-search, pe-gating, startup-checks, preflight, etc.) | MANUAL -- extract to named interface |
| Missing exit code docs (shell) | 24 | 24 shell scripts (H14) | YES -- add exit code block to header |
| Errors not to stderr (shell) | 6 | 6 shell scripts (H14) | YES -- append `>&2` |
| Transaction pattern incomplete | 3 | mutation-ledger.ts, schema-downgrade.ts, transaction-manager.ts (H08) | MANUAL -- verify tx flow |
| Missing return type on exported fn (evals) | 4 | 3 eval files (H15) | YES -- add `: void` or `: Promise<void>` |
| Catch param not typed `unknown` | ~10 | 6 eval/embedding files (H11, H15) | YES -- add `: unknown` annotation |

**Total P1 issues: ~907**

### Test Quality Issues (H16-H18)

| Issue | Estimated Count (extrapolated) | Severity |
|-------|-------------------------------|----------|
| `@ts-nocheck` blanket suppression | ~120 files (50% of ~249 test files) | P1 |
| `any` typed variables in tests | ~165 occurrences (33% of test files) | P1 |
| Stub tests (`expect(true).toBe(true)`) | 35+ tests (crash-recovery: 31, memory-context: 4) | P0 |
| Early-return guards instead of `.skip` | ~30 tests in handler-helpers | P2 |
| Tautological assertions (`expect(x).toBe(x)`) | ~4 tests | P2 |
| 4-level nesting (exceeds guideline) | 1 file (retry-manager) | P2 |

### README Quality Issues (H19)

| Issue | Count | Severity |
|-------|-------|----------|
| HVR violations ("comprehensive", "elevated") | 3 genuine | P2 |
| Missing referenced files (speckit-exclusivity.md, VERIFICATION_REPORT.md) | 2 | P1 |
| Broken markdown (scoring/README.md TOC) | 1 | P2 |
| Stale test/tool counts (3-4 different numbers across READMEs) | 4 inconsistencies | P1 |
| Tool count inconsistency (23/25/28 cited) | 1 systemic | P1 |

### Configuration Issues (H20)

| Issue | ID | Severity |
|-------|-----|----------|
| Inconsistent dependency pin style (^ vs exact) | H20-01 | P2 |
| shared/package.json missing `engines` | H20-02 | P2 |
| No vitest coverage thresholds | H20-03 | P2 |
| Minimal shared/package.json | H20-04 | P3 |
| Redundant resolveJsonModule | H20-05 | P3 |
| Root overrides need periodic review | H20-06 | P3 |
| Inconsistent `"type": "commonjs"` declaration | H20-07 | P3 |

---

## Remediation Queue (Priority Order)

### Tier 1: P0 Mechanical Fixes (estimated effort: 2-3 hours with scripts)

| # | Category | Issues | Fix Type | Effort |
|---|----------|--------|----------|--------|
| 1 | File headers -- prepend 3-line MODULE block | ~168 | **Mechanical** (script) | 30 min |
| 2 | WHY comments -- add AI- prefix | ~48 | **Mechanical** (regex) | 15 min |
| 3 | PascalCase type names | 2 | **Mechanical** (rename) | 5 min |
| 4 | Non-AI comment blocks in lib/search/ | ~18 | **Mechanical** (add prefix) | 10 min |
| 5 | Shell COMPONENT headers | 7 | **Mechanical** (add label) | 10 min |

### Tier 2: P0 Manual Fixes (estimated effort: 2-4 hours)

| # | Category | Issues | Fix Type | Effort |
|---|----------|--------|----------|--------|
| 6 | Commented-out code removal | ~18 | **Manual** (review each) | 45 min |
| 7 | SQL interpolation safety verification | 7 | **Manual** (verify + comment) | 30 min |
| 8 | `any` in exports (eval-ceiling.ts) | 1 | **Manual** (type properly) | 15 min |
| 9 | Shell unquoted variables | 3 | **Manual** (convert to arrays) | 15 min |
| 10 | Shell conditional strict mode | 3 | **Manual** (document exception or fix) | 15 min |
| 11 | Stub tests (crash-recovery, memory-context) | 35 | **Manual** (implement or mark .todo) | 60 min |

### Tier 3: P1 Mechanical Fixes (estimated effort: 4-6 hours with scripts)

| # | Category | Issues | Fix Type | Effort |
|---|----------|--------|----------|--------|
| 12 | Catch blocks -- add instanceof narrowing | ~270 | **Mechanical** (pattern script) | 90 min |
| 13 | Missing explicit return types | ~35 | **Semi-mechanical** (add annotations) | 30 min |
| 14 | Catch param `: unknown` annotation | ~10 | **Mechanical** (regex) | 10 min |
| 15 | Shell exit code documentation | 24 | **Mechanical** (template) | 30 min |
| 16 | Shell stderr redirect | 6 | **Mechanical** (append `>&2`) | 10 min |

### Tier 4: P1 Manual Fixes (estimated effort: 8-12 hours)

| # | Category | Issues | Fix Type | Effort |
|---|----------|--------|----------|--------|
| 17 | TSDoc on exported declarations | ~490 | **Semi-mechanical** (scaffold) then manual content | 6-8 hrs |
| 18 | Non-null assertion justifications | ~40 | **Manual** (add comment or refactor) | 60 min |
| 19 | Inline object params to named interfaces | ~25 | **Manual** (extract interfaces) | 45 min |
| 20 | Transaction pattern verification | 3 | **Manual** (verify flow) | 30 min |
| 21 | README stale counts reconciliation | 4 | **Manual** (update all) | 30 min |
| 22 | Missing referenced files | 2 | **Manual** (create or remove reference) | 15 min |

### Tier 5: P2/P3 (estimated effort: 3-5 hours)

| # | Category | Issues | Fix Type | Effort |
|---|----------|--------|----------|--------|
| 23 | Test `@ts-nocheck` removal | ~120 files | **Manual** (type each file) | 4+ hrs (phased) |
| 24 | Test `any` cleanup | ~165 occurrences | **Manual** (type variables) | 3+ hrs (phased) |
| 25 | HVR word replacements in READMEs | 3 | **Mechanical** | 5 min |
| 26 | Broken markdown fixes | 1 | **Mechanical** | 2 min |
| 27 | Config consistency (pin style, engines, type) | 3 | **Manual** | 20 min |
| 28 | Vitest coverage thresholds | 1 | **Manual** | 15 min |
| 29 | Early-return guards to .skip | ~30 | **Semi-mechanical** | 30 min |

---

## Health Scorecard

### Source Code Quality (H01-H13, H15)

| Category | Compliant | Total | % | Grade |
|----------|-----------|-------|---|-------|
| File Headers (P0) | ~87 | ~255 | 34% | F |
| No `any` Exports (P0) | ~254 | ~255 | 99.6% | A+ |
| PascalCase (P0) | ~253 | ~255 | 99.2% | A+ |
| No Commented Code (P0) | ~240 | ~255 | 94% | A |
| WHY Comments AI-prefixed (P0) | ~207 | ~255 | 81% | B- |
| Non-AI Comment Blocks (P0) | ~237 | ~255 | 93% | A |
| TSDoc Coverage (P1) | ~155 | ~255 | 61% | D |
| Return Types (P1) | ~220 | ~255 | 86% | B |
| Catch Blocks (P1) | ~185 | ~255 | 73% | C |
| Non-null Assertions (P1) | ~215 | ~255 | 84% | B |
| Named Object Params (P1) | ~230 | ~255 | 90% | A- |

### Shell Script Quality (H14)

| Category | Compliant | Total | % | Grade |
|----------|-----------|-------|---|-------|
| Shebang (P0) | 51 | 51 | 100% | A+ |
| Strict Mode (P0) | 48 | 51 | 94% | A |
| Quoted Variables (P0) | 49 | 51 | 96% | A |
| COMPONENT Header (P0) | 44 | 51 | 86% | B |
| No Commented Code (P0) | 51 | 51 | 100% | A+ |
| Function Naming (P1) | 51 | 51 | 100% | A+ |
| Local Variables (P1) | 51 | 51 | 100% | A+ |
| Exit Codes Documented (P1) | 27 | 51 | 53% | F |
| Errors to stderr (P1) | 45 | 51 | 88% | B+ |

### Test Quality (H16-H18)

| Category | Compliant | Total | % | Grade |
|----------|-----------|-------|---|-------|
| File Headers | ~90% | ~249 | 90% | A- |
| Naming/IDs | ~100% | ~249 | 100% | A+ |
| Mock Hygiene | ~95% | ~249 | 95% | A |
| No `any` Leaks | ~67% | ~249 | 67% | D+ |
| No `@ts-nocheck` | ~50% | ~249 | 50% | F |
| No Stub Tests | ~99% | ~249 | 99% | A |
| Nesting Depth (<=3) | ~99% | ~249 | 99% | A |
| Specific Assertions | ~95% | ~249 | 95% | A |

### README Quality (H19)

| Category | Compliant | Total | % | Grade |
|----------|-----------|-------|---|-------|
| HVR Compliance | 19 | 22 sampled | 86% | B |
| Link Integrity | 20 | 22 sampled | 91% | A- |
| Accuracy/Consistency | 16 | 22 sampled | 73% | C |
| Structure/Formatting | 21 | 22 sampled | 95% | A |

### Configuration Quality (H20)

| Category | Compliant | Total | % | Grade |
|----------|-----------|-------|---|-------|
| Strict Mode (tsconfig) | 4 | 4 | 100% | A+ |
| Security (.env, .gitignore) | 2 | 2 | 100% | A+ |
| Cross-Config Consistency | 11 | 13 | 85% | B |
| Version Alignment | 4 | 4 | 100% | A+ |

---

## Overall Health Score: 68/100

### Score Breakdown

| Domain | Weight | Score | Weighted |
|--------|--------|-------|----------|
| Source Code P0 Compliance | 25% | 55/100 (file headers drag score down) | 13.8 |
| Source Code P1 Compliance | 20% | 65/100 (TSDoc and catch blocks are main gaps) | 13.0 |
| Shell Script Quality | 10% | 82/100 (strong except exit code docs) | 8.2 |
| Test Quality | 20% | 65/100 (@ts-nocheck and any leaks) | 13.0 |
| README Quality | 10% | 78/100 (stale counts, minor HVR issues) | 7.8 |
| Configuration Quality | 15% | 88/100 (well-structured, minor gaps) | 13.2 |
| **Total** | **100%** | | **69.0** |

### Key Observations

1. **File headers are the single largest P0 issue.** ~168 files lack the exact 3-line MODULE header format. This is entirely mechanical to fix with a script and would immediately raise the overall health score by ~8 points.

2. **TSDoc coverage is the largest P1 gap.** ~490 missing TSDoc blocks across exported functions/interfaces/types. The vector-index-* files alone account for ~150 of these. A scaffolding script could generate stubs, but meaningful content requires manual authoring.

3. **Catch blocks are the second-largest P1 gap.** ~270 catch blocks lack instanceof narrowing. This is a highly scriptable fix using a standard pattern (`if (error instanceof Error) { ... } else { throw error; }`).

4. **Test type safety is the biggest systemic risk.** 50% of test files use `@ts-nocheck`, which masks real type errors and allows `any` to proliferate. This should be addressed incrementally, prioritizing integration tests over unit tests for pure-logic modules.

5. **The codebase excels at:** naming conventions (PascalCase 99%+, function naming 100%), avoiding `any` in production exports (99.6%), security hygiene (100%), and test structure/naming (100%).

6. **Highest-ROI remediation:** Fixing file headers (~30 min, scripted) + catch blocks (~90 min, scripted) + WHY prefixes (~15 min, scripted) would resolve ~490 issues (~41% of all issues) in under 2.5 hours.
