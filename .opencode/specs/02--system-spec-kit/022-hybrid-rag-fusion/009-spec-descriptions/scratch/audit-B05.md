# Audit B-05: Code Quality — evals/ + tests/

## Summary
Observed file set: **16** `.ts` files in `evals/` and **7** `.ts` files in `tests/` (23 total).

| Metric | evals/ | tests/ | Total |
|--------|--------|--------|-------|
| Files | 16 | 7 | 23 |
| Naming violations | 15 | 7 | 22 |
| Missing coverage | 8 | 3 | 11 |
| Mock issues | 0 | 2 | 2 |

## Eval Quality Assessment
- Scoring criteria defined? **NO** (inconsistent across eval files)
- Thresholds documented? **NO** (present in some, absent in many)
- Reproducible results? **NO** (time-/state-dependent outputs in multiple scripts)

## Test Quality Assessment
- Fixture management | **FAIR** |
- Mock patterns | **FAIR** |
- Edge case coverage | **GOOD** |

## Per-File Findings
### evals/
- [check-allowlist-expiry.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/evals/check-allowlist-expiry.ts)  
  Clear binary gate and 30-day rule; date-dependent behavior reduces strict reproducibility.
- [check-architecture-boundaries.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/evals/check-architecture-boundaries.ts)  
  Has explicit max-line boundary logic; naming is clear; not `*-eval.ts`.
- [check-handler-cycles-ast.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/evals/check-handler-cycles-ast.ts)  
  Deterministic AST cycle check; no explicit scored thresholding model.
- [check-no-mcp-lib-imports-ast.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/evals/check-no-mcp-lib-imports-ast.ts)  
  Strong violation detection; binary pass/fail only; naming not aligned to `*-eval.ts`.
- [check-no-mcp-lib-imports.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/evals/check-no-mcp-lib-imports.ts)  
  Similar to AST variant; duplicate policy surface can drift without shared test matrix.
- [collect-redaction-calibration-inputs.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/evals/collect-redaction-calibration-inputs.ts)  
  Data collection utility, not an eval scorer; no thresholds/gates.
- [import-policy-rules.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/evals/import-policy-rules.ts)  
  Utility function file; no eval scoring criteria; naming mismatch vs eval convention.
- [map-ground-truth-ids.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts)  
  Uses heuristic scoring/boost constants inline; no documented acceptance thresholds.
- [run-ablation.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/evals/run-ablation.ts)  
  Delegates to ablation engine; local file lacks explicit pass/fail threshold checks.
- [run-bm25-baseline.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/evals/run-bm25-baseline.ts)  
  Reports metrics and calibration threshold output; no enforced gate decision.
- [run-chk210-quality-backfill.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/evals/run-chk210-quality-backfill.ts)  
  Backfill/remediation script, not evaluation logic; DB field snake_case is domain-appropriate.
- [run-performance-benchmarks.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/evals/run-performance-benchmarks.ts)  
  Best-structured eval: clear p95 thresholds and PASS/FAIL gates.
- [run-phase1-5-shadow-eval.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/evals/run-phase1-5-shadow-eval.ts)  
  Good explicit thresholds/targets and telemetry; naming matches `*-eval.ts`.
- [run-phase3-telemetry-dashboard.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/evals/run-phase3-telemetry-dashboard.ts)  
  Defines threshold strings and status alerts; still snapshot-dependent.
- [run-quality-legacy-remediation.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/evals/run-quality-legacy-remediation.ts)  
  Compares before/after but lacks explicit success threshold criteria.
- [run-redaction-calibration.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/evals/run-redaction-calibration.ts)  
  Reports FP rate and notes threshold tuning, but no formal pass/fail gate.

### tests/
- [fixtures/generate-phase1-5-dataset.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/tests/fixtures/generate-phase1-5-dataset.ts)  
  Fixture generator script in test tree; not a test file by naming convention.
- [generate-context-cli-authority.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts)  
  Good describe/it structure with happy + rejection path; cleanup is solid.
- [import-policy-rules.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/tests/import-policy-rules.vitest.ts)  
  Clear and readable; limited malformed-input/error-path coverage.
- [memory-render-fixture.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts)  
  Strong regression scenarios; very large inline fixture object increases brittleness.
- [progressive-validation.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/tests/progressive-validation.vitest.ts)  
  Excellent breadth/edge coverage; major type safety issue (`@ts-nocheck`, 4x `any`).
- [task-enrichment.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts)  
  Wide scenario coverage; heavy, mostly untyped mocks and large harness state.
- [tree-thinning.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.ts)  
  Strong boundary-focused tests and clear descriptions; mostly happy/boundary over failure-mode inputs.

## Issues [ISS-B05-NNN]
- **ISS-B05-001**: Naming convention drift (`.vitest.ts`, non-`*-eval.ts`) across both folders.
- **ISS-B05-002**: `evals/` mixes true evals with utilities/backfills, weakening eval quality consistency.
- **ISS-B05-003**: Type safety bypass in [`progressive-validation.vitest.ts`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/tests/progressive-validation.vitest.ts) (`@ts-nocheck`, `any`).
- **ISS-B05-004**: Large inline fixtures in test files hurt maintainability and reuse.
- **ISS-B05-005**: Mock strategy is cleanup-aware but not consistently strongly typed in complex suites.
- **ISS-B05-006**: Several eval scripts lack explicit scoring thresholds or enforceable pass/fail criteria.
- **ISS-B05-007**: Reproducibility gaps from current-time/live-state dependence and timestamped outputs.
- **ISS-B05-008**: Smaller suites (notably import-policy tests) under-cover malformed/error inputs.

## Recommendations
1. Standardize naming: `*.spec.ts` for tests, `*-eval.ts` for eval executables, move generators to `scripts/tools/` or `tests/utils/`.
2. Remove `@ts-nocheck` and replace `any` with typed parsed-report interfaces in progressive validation tests.
3. Extract large inline fixtures into versioned fixture files under `tests/fixtures/data/`.
4. Introduce typed mock factories and a common `afterEach(() => vi.restoreAllMocks())` policy.
5. Add per-eval metadata header (`metric`, `threshold`, `gate`, `determinism notes`) and enforce at least one pass/fail gate for eval runners.
6. Separate non-eval operational scripts from `evals/` to keep quality bars clear.
 -n "$pattern" "$file" 2>/dev/null | wc -l | tr -d '"' '
}
while IFS= read -r f; do
  lines="'$(wc -l < "$f" | tr -d '"' ')
  describe="'$(count_matches "'"\\\\bdescribe\\\\s*\\\\(\" \""'$f")
  itc=$(count_matches "'"\\\\bit\\\\s*\\\\(\" \""'$f")
  testc=$(count_matches "'"\\\\btest\\\\s*\\\\(\" \""'$f")
  anyc=$(count_matches "'"\\\\bany\\\\b\" \""'$f")
  mockc=$(count_matches "'"\\\\b(vi|jest)\\\\.mock\\\\s*\\\\(\" \""'$f")
  afterc=$(count_matches "'"\\\\bafterEach\\\\s*\\\\(\" \""'$f")
  printf '"'%-95s %6s %8s %6s %6s %8s %10s %10s\\n' \""'$f" "$lines" "$describe" "$itc" "$testc" "$anyc" "$mockc" "$afterc"
done < <(rg --files .opencode/skill/system-spec-kit/scripts/evals .opencode/skill/system-spec-kit/scripts/tests -g '"'*.ts' | sort)" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 51ms:
FILE                                                                                             LINES DESCRIBE     IT   TEST      ANY      MOCKS  AFTEREACH
exec
/bin/zsh -lc "set -euo pipefail
printf '%-95s %6s %8s %6s %6s %8s %10s %10s\\n' 'FILE' 'LINES' 'DESCRIBE' 'IT' 'TEST' 'ANY' 'MOCKS' 'AFTEREACH'
count_matches() {
  local pattern=\""'$1"
  local file="$2"
  (rg -n "$pattern" "$file" 2>/dev/null || true) | wc -l | tr -d '"' '
}
while IFS= read -r f; do
  lines="'$(wc -l < "$f" | tr -d '"' ')
  describe="'$(count_matches "'"\\\\bdescribe\\\\s*\\\\(\" \""'$f")
  itc=$(count_matches "'"\\\\bit\\\\s*\\\\(\" \""'$f")
  testc=$(count_matches "'"\\\\btest\\\\s*\\\\(\" \""'$f")
  anyc=$(count_matches "'"\\\\bany\\\\b\" \""'$f")
  mockc=$(count_matches "'"\\\\b(vi|jest)\\\\.mock\\\\s*\\\\(\" \""'$f")
  afterc=$(count_matches "'"\\\\bafterEach\\\\s*\\\\(\" \""'$f")
  printf '"'%-95s %6s %8s %6s %6s %8s %10s %10s\\n' \""'$f" "$lines" "$describe" "$itc" "$testc" "$anyc" "$mockc" "$afterc"
done < <(rg --files .opencode/skill/system-spec-kit/scripts/evals .opencode/skill/system-spec-kit/scripts/tests -g '"'*.ts' | sort)" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 581ms:
.opencode/skill/system-spec-kit/scripts/evals/check-no-mcp-lib-imports-ast.ts                      372        0      0      0        0          0          0
.opencode/skill/system-spec-kit/scripts/evals/check-no-mcp-lib-imports.ts                          368        0      0      0        0          0          0
.opencode/skill/system-spec-kit/scripts/evals/collect-redaction-calibration-inputs.ts               88        0      0      0        0          0          0
.opencode/skill/system-spec-kit/scripts/evals/import-policy-rules.ts                                40        0      0      1        0          0          0
.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts                              617        0      0      0        1          0          0
.opencode/skill/system-spec-kit/scripts/evals/run-ablation.ts                                      176        0      0      0        0          0          0
.opencode/skill/system-spec-kit/scripts/evals/run-bm25-baseline.ts                                 181        0      0      0        0          0          0
.opencode/skill/system-spec-kit/scripts/evals/run-chk210-quality-backfill.ts                       128        0      0      1        0          0          0
.opencode/skill/system-spec-kit/scripts/evals/run-performance-benchmarks.ts                        490        0      0      0        0          0          0
.opencode/skill/system-spec-kit/scripts/evals/run-phase1-5-shadow-eval.ts                          256        0      0      0        0          0          0
.opencode/skill/system-spec-kit/scripts/evals/run-phase3-telemetry-dashboard.ts                    252        0      0      0        0          0          0
.opencode/skill/system-spec-kit/scripts/evals/run-quality-legacy-remediation.ts                    283        0      0      0        0          0          0
.opencode/skill/system-spec-kit/scripts/evals/run-redaction-calibration.ts                         150        0      0      1        0          0          0
.opencode/skill/system-spec-kit/scripts/tests/fixtures/generate-phase1-5-dataset.ts                108        0      0      0        0          0          0
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts             105        1      3      0        0          3          1
.opencode/skill/system-spec-kit/scripts/tests/import-policy-rules.vitest.ts                         38        1      4      0        0          0          0
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts                      348        1      3      0        0          3          1
.opencode/skill/system-spec-kit/scripts/tests/progressive-validation.vitest.ts                    1103       13     52      0        4          0          5
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts                            771        7     30      0        0         11          1
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.ts                              402       10     39      0        0          0          0
exec
/bin/zsh -lc "echo '=== describe/it titles ==='
rg -n \"\\b(describe|it|test)\\s*\\(\\s*['\\\""'`]" .opencode/skill/system-spec-kit/scripts/tests -g '"'*.ts' | sort

echo '\\n=== any usages ==='
rg -n \"\\bany\\b\" .opencode/skill/system-spec-kit/scripts/tests -g '*.ts' || true

echo '\\n=== mocks and cleanup ==='
rg -n \"\\b(vi|jest)\\.(mock|fn|spyOn|resetAllMocks|clearAllMocks|restoreAllMocks)\\b|\\b(beforeEach|afterEach|afterAll)\\s*\\(\" .opencode/skill/system-spec-kit/scripts/tests -g '*.ts' | sort" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 52ms:
zsh:8: unmatched "
codex
I’m now extracting test case titles plus `any` and mock lifecycle patterns so we can score structure, edge coverage, and cleanup quality consistently across files.
exec
/bin/zsh -lc "echo '=== describe/it titles ==='
rg -n \"\\\\b(describe|it|test)\\\\s*\\\\(\\\\s*['\\\"\\"'`]" .opencode/skill/system-spec-kit/scripts/tests -g '"'*.ts' | sort || true

echo '\\n=== any usages ==='
rg -n \"\\\\bany\\\\b\" .opencode/skill/system-spec-kit/scripts/tests -g '*.ts' || true

echo '\\n=== mocks and cleanup ==='
rg -n \"\\\\b(vi|jest)\\\\.(mock|fn|spyOn|resetAllMocks|clearAllMocks|restoreAllMocks)\\\\b|\\\\b(beforeEach|afterEach|afterAll)\\\\s*\\\\(\" .opencode/skill/system-spec-kit/scripts/tests -g '*.ts' | sort || true" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
=== describe/it titles ===
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:35:describe('generate-context CLI authority', () => {
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:50:  it('passes direct CLI spec-folder mode through main() as an authoritative workflow target', async () => {
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:66:  it('passes JSON-mode data and explicit CLI spec-folder override through main()', async () => {
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:83:  it('rejects an explicit phase-folder CLI target before workflow save', async () => {
.opencode/skill/system-spec-kit/scripts/tests/import-policy-rules.vitest.ts:10:  it('blocks package imports for internal runtime roots and descendants', () => {
.opencode/skill/system-spec-kit/scripts/tests/import-policy-rules.vitest.ts:18:  it('blocks relative imports for internal runtime roots and descendants', () => {
.opencode/skill/system-spec-kit/scripts/tests/import-policy-rules.vitest.ts:26:  it('blocks normalized relative bypass attempts into internal runtime roots', () => {
.opencode/skill/system-spec-kit/scripts/tests/import-policy-rules.vitest.ts:31:  it('allows public API and shared imports', () => {
.opencode/skill/system-spec-kit/scripts/tests/import-policy-rules.vitest.ts:9:describe('isProhibitedImportPath', () => {
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:137:describe('rendered memory fixture regression', () => {
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:138:  it('renders a specific filename and non-contaminated title that passes the quality gate', async () => {
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:214:  it('falls back to the folder-base slug when prompt and spec title are contaminated or generic', async () => {
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:286:  it('renders direct preloaded saves without placeholder leakage and with a non-zero tool count', async () => {
.opencode/skill/system-spec-kit/scripts/tests/progressive-validation.vitest.ts:1013:    it('T-PB2-13: --level 3 output contains Level 3 heading but NOT Level 4 report', () => {
.opencode/skill/system-spec-kit/scripts/tests/progressive-validation.vitest.ts:1026:    it('T-PB2-14: invalid --level value (0 or 5) causes exit 2', () => {
.opencode/skill/system-spec-kit/scripts/tests/progressive-validation.vitest.ts:1042:  describe('T-PB2-15: Edge cases', () => {
.opencode/skill/system-spec-kit/scripts/tests/progressive-validation.vitest.ts:1044:    it('T-PB2-15a: missing folder argument exits 2 with error message', () => {
.opencode/skill/system-spec-kit/scripts/tests/progressive-validation.vitest.ts:1052:    it('T-PB2-15b: non-existent folder exits 2 with error message', () => {
.opencode/skill/system-spec-kit/scripts/tests/progressive-validation.vitest.ts:1060:    it('T-PB2-15c: unknown flag exits 2 with error message', () => {
exec
/bin/zsh -lc "echo '=== eval signals: score/threshold/pass/fail ==='
for f in "'$(rg --files .opencode/skill/system-spec-kit/scripts/evals -g '"'*.ts' | sort); do
  score="'$(rg -n "score|scor(e|ing)|qualityScore" "$f" | wc -l | tr -d '"' ')
  thresh="'$(rg -n "threshold|cutoff|min|max|target|gate" "$f" | wc -l | tr -d '"' ')
  passfail="'$(rg -n "'"\\b(pass|fail|failed|passed|error|warn)\\b\" \""'$f" | wc -l | tr -d '"' ')
  printf '%-90s score=%-4s threshold=%-4s passFailTerms=%-4s\\n' \""'$f" "$score" "$thresh" "$passfail"
done

echo '"'\\n=== eval title and exports quick view ==='
for f in "'$(rg --files .opencode/skill/system-spec-kit/scripts/evals -g '"'*.ts' | sort); do
  echo \"\\n--- "'$f ---"
  rg -n "''^(export'"\\s+)?(async\\s+)?function\\s+|"'^const'"\\s+.*=\\s*\\(|"'^interface'"\\s+|"'^type'"\\s+|"'^if '"\\(import\\.meta\\.url\" \""'$f" | head -n 12 || true
done' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 299ms:
.opencode/skill/system-spec-kit/scripts/evals/import-policy-rules.ts                       score=0    threshold=0    passFailTerms=0   
.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts                      score=20   threshold=4    passFailTerms=7   
.opencode/skill/system-spec-kit/scripts/evals/run-ablation.ts                              score=1    threshold=0    passFailTerms=7   
.opencode/skill/system-spec-kit/scripts/evals/run-bm25-baseline.ts                         score=1    threshold=1    passFailTerms=3   
.opencode/skill/system-spec-kit/scripts/evals/run-chk210-quality-backfill.ts               score=12   threshold=1    passFailTerms=2   
.opencode/skill/system-spec-kit/scripts/evals/run-performance-benchmarks.ts                score=8    threshold=20   passFailTerms=8   
.opencode/skill/system-spec-kit/scripts/evals/run-phase1-5-shadow-eval.ts                  score=2    threshold=11   passFailTerms=6   
.opencode/skill/system-spec-kit/scripts/evals/run-phase3-telemetry-dashboard.ts            score=0    threshold=9    passFailTerms=5   
.opencode/skill/system-spec-kit/scripts/evals/run-quality-legacy-remediation.ts            score=10   threshold=7    passFailTerms=0   
.opencode/skill/system-spec-kit/scripts/evals/run-redaction-calibration.ts                 score=0    threshold=7    passFailTerms=0   

=== eval title and exports quick view ===

--- .opencode/skill/system-spec-kit/scripts/evals/check-allowlist-expiry.ts ---
10:interface AllowlistException {
21:interface Allowlist {
26:interface ExpiryFinding {
33:interface InvalidExpiry {
39:function resolveAllowlistPath(): string | null {
60:function loadAllowlist(): Allowlist {
codex
I’m drilling into eval-specific quality signals now: explicit thresholds, scoring formulas, and whether outputs are deterministic/reproducible (fixed inputs, stable sorting, etc.).
exec
/bin/zsh -lc 'for f in $(rg --files .opencode/skill/system-spec-kit/scripts/evals -g '"'*.ts' | sort); do
  echo \"\\n===== "'$f ====="
  rg -n "threshold|cutoff|min|max|target|score|weight|precision|recall|f1|spearman|latency|p95|p99|json|report|seed|random|Date'"\\.now|new Date\\(|Math\\.random|process\\.exit|console\\.log\" \""'$f" || true
done' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:

===== .opencode/skill/system-spec-kit/scripts/evals/check-allowlist-expiry.ts =====
42:    path.resolve(__dirname, 'import-policy-allowlist.json'),
44:    path.resolve(__dirname, '../../evals/import-policy-allowlist.json'),
46:    path.resolve(process.cwd(), 'evals/import-policy-allowlist.json'),
47:    path.resolve(process.cwd(), 'scripts/evals/import-policy-allowlist.json'),
65:      path.resolve(__dirname, 'import-policy-allowlist.json'),
66:      path.resolve(__dirname, '../../evals/import-policy-allowlist.json'),
67:      path.resolve(process.cwd(), 'evals/import-policy-allowlist.json'),
68:      path.resolve(process.cwd(), 'scripts/evals/import-policy-allowlist.json'),
71:    process.exit(2);
92:    process.exit(2);
98:  const parsed = new Date(`${dateText}T00:00:00Z`);
114:  const now = new Date();
157:    process.exit(2);
175:    process.exit(1);
179:    console.log('Allowlist expiry check passed: no entries expiring within 30 days and no expired entries found.');
181:    console.log('Allowlist expiry check passed with warnings (no expired entries).');
184:  process.exit(0);

exec
/bin/zsh -lc "rg -n \"\\bany\\b\" .opencode/skill/system-spec-kit/scripts/evals .opencode/skill/system-spec-kit/scripts/tests -g '*.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/scripts/tests/progressive-validation.vitest.ts:591:      let parsed: any;
.opencode/skill/system-spec-kit/scripts/tests/progressive-validation.vitest.ts:684:      let parsed: any;
.opencode/skill/system-spec-kit/scripts/tests/progressive-validation.vitest.ts:724:      let parsed: any;
.opencode/skill/system-spec-kit/scripts/tests/progressive-validation.vitest.ts:847:      let parsed: any;
.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts:233:    'covering', 'including', 'plus', 'also', 'any', 'tests', 'whether',
codex
I’ve confirmed `any` usage is concentrated in one test file; next I’m reading the test files themselves to evaluate fixture organization, mock typing/lifecycle, and whether happy/error paths are actually present.
exec
/bin/zsh -lc 'for f in $(rg --files .opencode/skill/system-spec-kit/scripts/tests -g '"'*.ts' | sort); do
  echo \"\\n===== "'$f ====="
  sed -n '"'1,260p' \""'$f"
done' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:

===== .opencode/skill/system-spec-kit/scripts/tests/fixtures/generate-phase1-5-dataset.ts =====
// ---------------------------------------------------------------
// MODULE: Phase 1.5 Dataset Generator (T027a-T027b)
// ---------------------------------------------------------------

import fs from 'fs';
import path from 'path';

interface EvalRow {
  query: string;
  intent: string;
  baselineRanks: string[];
  humanReviewed?: boolean;
}

const REQUIRED_INTENTS = ['add_feature', 'fix_bug', 'refactor', 'understand', 'find_spec'];
const TARGET_PER_INTENT = 200;
const HUMAN_REVIEW_RATIO = 0.10;

codex
I’m using one final scan to detect naming-style and typing bypass patterns (`snake_case` locals, `@ts-nocheck`, unsafe casts) so the issue list can be concrete.
exec
/bin/zsh -lc "echo '=== ts-nocheck / ts-ignore ==='
rg -n \"@ts-nocheck|@ts-ignore\" .opencode/skill/system-spec-kit/scripts/evals .opencode/skill/system-spec-kit/scripts/tests -g '*.ts' || true

echo '\\n=== potential snake_case identifiers (const/let/function params rough scan) ==='
rg -n \"\\b(const|let|function)\\s+[a-z]+_[a-zA-Z0-9_]*\\b|\\b[a-z]+_[a-zA-Z0-9_]*\\s*:\\s*\" .opencode/skill/system-spec-kit/scripts/evals .opencode/skill/system-spec-kit/scripts/tests -g '*.ts' | head -n 200 || true

echo '\\n=== typed JSON parsing patterns ==='
rg -n \"JSON\\.parse\\(|as\\s+any|as\\s+unknown|Record<string,\\s*unknown>|unknown\\)\\s*=>\" .opencode/skill/system-spec-kit/scripts/evals .opencode/skill/system-spec-kit/scripts/tests -g '*.ts' | head -n 200 || true" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
=== ts-nocheck / ts-ignore ===
.opencode/skill/system-spec-kit/scripts/tests/progressive-validation.vitest.ts:1:// @ts-nocheck

=== potential snake_case identifiers (const/let/function params rough scan) ===
.opencode/skill/system-spec-kit/scripts/evals/run-chk210-quality-backfill.ts:12:type DbRow = { id: number; file_path: string };
.opencode/skill/system-spec-kit/scripts/evals/run-chk210-quality-backfill.ts:33:  return /\nquality_score:\s*[0-9.]+/i.test(content) && /\nquality_flags:\s*(?:\n|$)/i.test(content);
.opencode/skill/system-spec-kit/scripts/evals/run-chk210-quality-backfill.ts:44:    `quality_score: ${qualityScore.toFixed(2)}`,
.opencode/skill/system-spec-kit/scripts/evals/run-chk210-quality-backfill.ts:45:    'quality_flags:',
.opencode/skill/system-spec-kit/scripts/evals/run-chk210-quality-backfill.ts:60:  const messageCount = Number(content.match(/\nmessage_count:\s*(\d+)/i)?.[1] ?? '0');
.opencode/skill/system-spec-kit/scripts/evals/run-chk210-quality-backfill.ts:61:  const toolCount = Number(content.match(/\ntool_count:\s*(\d+)/i)?.[1] ?? '0');
.opencode/skill/system-spec-kit/scripts/evals/run-chk210-quality-backfill.ts:62:  const decisionCount = Number(content.match(/\ndecision_count:\s*(\d+)/i)?.[1] ?? '0');
.opencode/skill/system-spec-kit/scripts/evals/run-phase1-5-shadow-eval.ts:36:  add_feature: 'deep',
.opencode/skill/system-spec-kit/scripts/evals/run-phase1-5-shadow-eval.ts:38:  security_audit: 'deep',
.opencode/skill/system-spec-kit/scripts/evals/run-phase1-5-shadow-eval.ts:39:  fix_bug: 'focused',
.opencode/skill/system-spec-kit/scripts/evals/run-phase1-5-shadow-eval.ts:41:  find_spec: 'focused',
.opencode/skill/system-spec-kit/scripts/evals/run-phase1-5-shadow-eval.ts:42:  find_decision: 'focused',
.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts:378:          matchStrategy: `file_match:${fileName}`,
.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts:439:          matchStrategy: `spec_folder:${pattern}`,
.opencode/skill/system-spec-kit/scripts/evals/run-phase3-telemetry-dashboard.ts:57:  add_feature: 'deep',
.opencode/skill/system-spec-kit/scripts/evals/run-phase3-telemetry-dashboard.ts:59:  security_audit: 'deep',
