# C5 Audit: Scripts Lib and Utilities

### C5-001: Default `npm run check` leaves AST-only import-policy bypasses unguarded
Severity: High
Category: Enforcement Script Gap
Location: `scripts/package.json:15`
Description: The default `check` pipeline executes the regex-based import-policy checker, but the deeper AST checker is only wired into the separate `check:ast` script. The regex checker only follows one local re-export hop and only scans `.ts` files, so multi-hop barrel chains and non-`.ts` TypeScript source files are outside the default merge gate.
Evidence: `scripts/package.json:14-15` wires `evals/check-no-mcp-lib-imports-ast.ts` only into `check:ast`. `scripts/evals/check-no-mcp-lib-imports.ts:288-317` only inspects immediate local imports via `findForbiddenReExports(targetFile)`, while `scripts/evals/check-no-mcp-lib-imports.ts:319-337` only walks `.ts` files.
Impact: A prohibited `scripts -> mcp_server` dependency can survive CI as long as it is hidden behind a second barrel hop or introduced in `tsx/mts/cts` source.
Recommended Fix: Move the AST checker into the default `check` path, demote the regex checker to an optional fast precheck, and expand file discovery if `tsx/mts/cts` are meant to be governed.

### C5-002: AST import-policy checker still misses `import = require(...)` and `import("...")` type references
Severity: High
Category: Enforcement Script Gap
Location: `scripts/evals/check-no-mcp-lib-imports-ast.ts:207`
Description: `parseFile()` visits `ImportDeclaration`, `ExportDeclaration`, and `CallExpression`, but it never inspects `ImportEqualsDeclaration` or `ImportTypeNode`. That leaves two valid TypeScript import forms outside the only deep checker.
Evidence: `scripts/evals/check-no-mcp-lib-imports-ast.ts:207-247` contains no handling for `ImportEqualsDeclaration` or `ImportTypeNode`. The neighboring boundary checker already handles both forms in `scripts/evals/check-architecture-boundaries.ts:175-180` and `scripts/evals/check-architecture-boundaries.ts:320-326`.
Impact: Internal runtime imports can bypass the AST policy checker by switching syntax instead of fixing the boundary.
Recommended Fix: Add `ImportEqualsDeclaration` and `ImportTypeNode` handling to `parseFile()`, then add regression tests that cover both syntaxes.

### C5-003: Both import-policy checkers silently scan `scripts/dist` when run from compiled JS
Severity: High
Category: Enforcement Script Gap
Location: `scripts/evals/check-no-mcp-lib-imports.ts:55`
Description: Both checkers define `SCRIPTS_ROOT` as `path.resolve(__dirname, '..')`. That is correct in source mode (`scripts/evals -> scripts`), but wrong in compiled mode (`scripts/dist/evals -> scripts/dist`). The code comments explicitly claim compiled-layout support, but the root resolution does not match it.
Evidence: `scripts/evals/check-no-mcp-lib-imports.ts:55-65` and `scripts/evals/check-no-mcp-lib-imports-ast.ts:64-75` both describe a compiled layout while keeping `SCRIPTS_ROOT = path.resolve(__dirname, '..')`. Their walkers then scan `SCRIPTS_ROOT` at `scripts/evals/check-no-mcp-lib-imports.ts:319-337` and `scripts/evals/check-no-mcp-lib-imports-ast.ts:255-273`.
Impact: Running the built JS checker can produce a false clean pass after scanning the wrong tree.
Recommended Fix: Resolve the package root from required directories, or detect `dist/evals` explicitly and jump back to the real `scripts/` root before walking files.

### C5-004: Wrapper-only boundary enforcement ignores nested `mcp_server/scripts` files
Severity: Medium
Category: Enforcement Script Gap
Location: `scripts/evals/check-architecture-boundaries.ts:398`
Description: GAP B enforcement intentionally performs a non-recursive top-level scan of `mcp_server/scripts/`. Any nested wrapper directories are never inspected.
Evidence: `scripts/evals/check-architecture-boundaries.ts:398-401` states `// Non-recursive scan — only top-level wrappers, not nested dirs` and then filters to direct child `.ts` files only.
Impact: Wrapper-only policy can be bypassed by moving substantive logic into nested files while the check still reports success.
Recommended Fix: Recurse through `mcp_server/scripts/` and decide explicitly whether `.js/.mjs/.cjs` wrappers should be governed too.

### C5-005: Redaction calibration underreports false-positive rate by dividing by all tokens
Severity: High
Category: Eval Correctness
Location: `scripts/evals/run-redaction-calibration.ts:84`
Description: The script computes false-positive rate as `totalFalsePositives / totalTokens`, where `totalTokens` is every whitespace token in the corpus. That is not a redaction precision metric and will understate failure rates whenever the corpus is large but the detector fires rarely.
Evidence: Tokenization is defined at `scripts/evals/run-redaction-calibration.ts:39-41`; false positives are counted from `result.matches` at `scripts/evals/run-redaction-calibration.ts:52-57`; the denominator and hard gate are computed at `scripts/evals/run-redaction-calibration.ts:84-87` and `scripts/evals/run-redaction-calibration.ts:111-115`.
Impact: The script can print `PASS` for a detector that is mostly false positives, making the reported calibration unsafe to trust.
Recommended Fix: Report precision-style FP rate against detections or a labeled benign set, and keep corpus-size metrics separate from gate decisions.

### C5-006: Benchmark gates `CHK-113` and `CHK-114` do not enforce performance, only finiteness
Severity: High
Category: Eval Correctness
Location: `scripts/evals/run-performance-benchmarks.ts:426`
Description: The last two gates pass when sample counts match and numbers are finite. They do not check any latency ceiling or acceptable slowdown. The "baseline" used for the delta comparison is also just an in-memory score sort, not an equivalent retrieval workload.
Evidence: The baseline path is a plain `sort()` at `scripts/evals/run-performance-benchmarks.ts:322-330`. `CHK-113` and `CHK-114` only test counts and `Number.isFinite(...)` at `scripts/evals/run-performance-benchmarks.ts:430-440`.
Impact: The report can claim PASS even if the boosted path is materially slower or the "baseline vs boosted" delta is operationally unacceptable.
Recommended Fix: Add explicit latency/slowness thresholds for `CHK-113` and `CHK-114`, and compare boosted execution against an equivalent non-boosted retrieval path instead of a trivial array sort.

### C5-007: Redaction calibration bypasses the import policy and points at a currently wrong runtime path
Severity: High
Category: Import Policy Violation
Location: `scripts/evals/run-redaction-calibration.ts:75`
Description: The script builds an absolute path to `mcp_server/dist/lib/extraction/redaction-gate.js` and then `require()`s it. Because the path is assembled dynamically, neither import-policy checker sees it. In this workspace the constructed path is also wrong.
Evidence: The dynamic load is at `scripts/evals/run-redaction-calibration.ts:75-79`. A filesystem check showed `mcp_server/dist/lib/extraction/redaction-gate.js` is missing from the workspace root, while `.opencode/skill/system-spec-kit/mcp_server/dist/lib/extraction/redaction-gate.js` exists.
Impact: The script both violates the intended scripts->runtime boundary and fails at runtime in the current layout.
Recommended Fix: Resolve the package root like the other eval scripts and consume the redaction gate through an allowed API surface or an explicit, governed allowlist entry.

### C5-008: Redaction input collector still hardcodes a deleted spec path
Severity: Medium
Category: Stale Reference
Location: `scripts/evals/collect-redaction-calibration-inputs.ts:56`
Description: One of the calibration input commands still targets `.opencode/specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/scratch`, which no longer exists in this workspace. The script then repeats the entire 10-command block five times.
Evidence: The hardcoded path appears in `scripts/evals/collect-redaction-calibration-inputs.ts:45-63`, specifically line 56. A filesystem check showed the `020-mcp-working-memory-hybrid-rag/scratch` directory is missing, while the current `022-hybrid-rag-fusion/005-architecture-audit/scratch` directory exists.
Impact: The calibration corpus is padded with repeated failure output, which biases the report and reduces the value of the sample set.
Recommended Fix: Parameterize the target spec folder and stop duplicating a fixed command block just to hit an arbitrary file count.

### C5-009: Ground-truth mapper parses a TypeScript source file with brittle line regexes and only warns on total failure
Severity: High
Category: Eval Correctness
Location: `scripts/evals/map-ground-truth-ids.ts:79`
Description: The ground-truth corpus is loaded by scraping `ground-truth-data.ts` with regexes that assume single quotes, fixed field names, and specific multiline concatenation patterns. Partial parse drift is not treated as an error.
Evidence: The regex loader is implemented at `scripts/evals/map-ground-truth-ids.ts:79-205`, including field-specific matches at `scripts/evals/map-ground-truth-ids.ts:98-175`. The only failure signal is a warning when zero queries are parsed at `scripts/evals/map-ground-truth-ids.ts:204-206`.
Impact: The mapper can silently operate on a truncated or malformed query set, contaminating every metric that depends on those mappings.
Recommended Fix: Import structured data directly or parse the TypeScript module with an AST, then fail hard on schema drift or missing required fields.

### C5-010: Ground-truth spec-folder heuristics target legacy spec names that no longer exist
Severity: Medium
Category: Stale Reference
Location: `scripts/evals/map-ground-truth-ids.ts:391`
Description: The heuristic path scorer hardcodes historical spec-name fragments that are no longer present in `.opencode/specs`.
Evidence: The patterns are added at `scripts/evals/map-ground-truth-ids.ts:391-413` for `139-hybrid-rag-fusion`, `140-hybrid-rag-fusion`, `138-spec-kit-phase-system`, `143-index-tier-anomalies`, `140-sqlite-to-libsql`, `005-frontmatter-indexing`, and `001-deprecated-skill-graph`. Filesystem searches found no matching directories for any of those names.
Impact: Candidate ranking carries dead branches, hides current naming reality, and can mis-rank mappings toward historical phantom specs.
Recommended Fix: Derive spec candidates from the live filesystem or index tables instead of hardcoding legacy names.

### C5-011: `cli-capture-shared.ts` is a stale extracted utility library with zero consumers
Severity: Medium
Category: Dead Code
Location: `scripts/lib/cli-capture-shared.ts:8`
Description: The file exists as a deduplication extraction, but the planned migration never happened. The four capture extractors still carry their own local implementations.
Evidence: The file itself says the capture modules "can be updated to import from here in a follow-up pass" at `scripts/lib/cli-capture-shared.ts:12-14`. Repository search for `cli-capture-shared` imports returned no matches, while the extractor files still define local `readJsonl`, `normalizeToolName`, `buildSessionTitle`, `parseToolArguments`, and related helpers.
Impact: Fixes made in the shared helper will not affect production capture paths, and the unused library increases maintenance surface and reviewer confusion.
Recommended Fix: Either migrate the extractors to this shared module and delete the duplicate helpers, or remove the unused library until the migration is scheduled.

### C5-012: `readJsonl()` drops malformed records and file-read failures without any signal
Severity: Medium
Category: Error Handling Quality
Location: `scripts/lib/cli-capture-shared.ts:63`
Description: The helper returns `[]` when the file cannot be read and silently drops malformed JSONL lines by mapping them to `null`. There is no warning, count, or path-level context.
Evidence: The inner parse failure is swallowed at `scripts/lib/cli-capture-shared.ts:71-77`, and the outer file-read failure is swallowed at `scripts/lib/cli-capture-shared.ts:78-80`.
Impact: Transcript capture can lose data while appearing successful, which is especially risky for audit-oriented ingestion utilities.
Recommended Fix: Return structured diagnostics, log the file path and malformed line count, or make the caller choose between strict and lenient parsing.

### C5-013: The source-dist alignment checker advertises allowlists but has no runtime allowlist mechanism
Severity: Medium
Category: Enforcement Script Gap
Location: `scripts/evals/check-source-dist-alignment.ts:36`
Description: The script suggests adding a "time-bounded allowlist entry," but the only allowlist is a hardcoded empty array inside the source file. There is no JSON loader or external configuration path.
Evidence: `ALLOWLIST_EXCEPTIONS` is defined as `[]` at `scripts/evals/check-source-dist-alignment.ts:36`. Lookup is hardwired to that array at `scripts/evals/check-source-dist-alignment.ts:98-100`, and the failure message still tells operators to "add a time-bounded allowlist entry" at `scripts/evals/check-source-dist-alignment.ts:157`.
Impact: Emergency exceptions require source edits instead of governed metadata updates, and the operator guidance is misleading as written.
Recommended Fix: Load a dedicated JSON allowlist file with owner/date/reason metadata, mirroring the import-policy allowlist workflow.

### C5-014: Multiple helper branches are truly unused and now just add audit noise
Severity: Low
Category: Dead Code
Location: `scripts/lib/topic-keywords.ts:26`
Description: Several branches/helpers in scope are declaration-only leftovers: `tokenizeTopicWords()` in `topic-keywords.ts`, `filterContent()` in `content-filter.ts`, `extractImportPath()` in `check-no-mcp-lib-imports.ts`, `asciiBoxesAvailable` in `decision-tree-generator.ts`, and `DRY_RUN` in `map-ground-truth-ids.ts`.
Evidence: Repository searches found declaration-only matches for `tokenizeTopicWords`, `filterContent`, and `extractImportPath`. `asciiBoxesAvailable` appears only at `scripts/lib/decision-tree-generator.ts:35` and `scripts/lib/decision-tree-generator.ts:47`. `DRY_RUN` appears only at `scripts/evals/map-ground-truth-ids.ts:25` and `scripts/evals/map-ground-truth-ids.ts:529`.
Impact: These leftovers do not break behavior on their own, but they increase maintenance cost and make it harder to tell which branches are still authoritative.
Recommended Fix: Delete the unused helpers/flags or wire them into tested behavior so their presence is justified.
