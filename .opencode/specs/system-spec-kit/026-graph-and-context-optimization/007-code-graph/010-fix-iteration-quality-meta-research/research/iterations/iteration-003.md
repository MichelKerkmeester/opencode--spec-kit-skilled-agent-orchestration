# Iteration 003 - Algorithm and Pattern Catalog

## Evidence base

This iteration converts the empirical 009 trajectory and sibling-packet audit into reusable fix patterns. I used iteration 001's finding matrix, iteration 002's packet-frequency audit, the 009 review archives, current clean 009 code, and selected sibling remediation reports from 005 and 008.

The key distinction I am using:

- Mode 1 is a same-class miss inside the local failure family: one error field, string family, literal family, or output field was fixed while sibling sites of that same class remained unfixed.
- Mode 2 is a cross-consumer miss: one handler or consumer was fixed while another public path, status/readiness path, database path, documentation path, or runtime variant still reflected the old contract.
- Mode 4 is not "more sites." It is an incomplete truth table or evidence matrix where the implementation might be right but the proof does not enumerate every required row.

## Failure Mode 1 - Single-site fix when a class-of-bug exists

### WRONG

The wrong pattern is fixing the cited line, not the error class.

Concrete 009 example: FIX-009 handled invalid-`rootDir` errors and scan warnings but missed successful scan `data.errors`. Run 2 found `R2-I7-P0-001`: `handleCodeGraphScan()` was still building returned errors from raw `result.filePath` values. The original wrong shape was visible in the FIX-009-v2 diff:

```ts
errors.push(`${result.filePath}: ${err instanceof Error ? err.message : String(err)}`);
errors.push(...result.parseErrors.map(e => `${result.filePath}: ${e}`));
```

That was a single-site fix failure because all of these are user-visible scan error-string emitters, even though they appear in different branches (`payload.error`, `data.warnings`, `data.errors`).

A smaller 009 example is `R2-I3-P2-001`: the ADR-005 wording sweep checked README/user prose and obvious output strings, but missed readiness metadata text (`candidate manifest drift`) returned in blocked tool payloads. The fix treated "bad vocabulary" as a docs/prose site instead of a class of user-visible strings.

### RIGHT

The right pattern is a class inventory before editing. For 009, the clean state now has:

- `relativize()` for one path value.
- `relativizeScanMessage()` for embedded message strings.
- `relativizeScanWarning()` and exported `relativizeScanError()` as named wrappers.
- `errors: errors.slice(0, 10).map(error => relativizeScanError(error, canonicalWorkspace))`.
- `warnings: ...map(warning => relativizeScanWarning(warning, canonicalWorkspace))`.
- tests for invalid roots, out-of-workspace roots, scan warnings, `data.errors`, and multi-path messages.

The generalized right pattern is: list every producer of the bug class, assign one helper or policy per class, then prove each producer either calls the helper or is not user-visible.

The sibling packet 005 B2 is the same good shape in a different domain. The remediation did not normalize one metrics emission site and stop; it introduced closed-vocabulary label normalization and then applied it to runtime and freshness label emitters before the collector can create new series.

### DETECTION

A FIX prompt or reviewer should suspect this wrong pattern when the fix changes one call site for a repeated concept and the review finding was phrased as a class: "absolute paths in errors," "internal vocabulary in user-visible messages," "unbounded label cardinality," "raw path disclosure," "unsafe string interpolation," "stale docs inventory."

Run a producer inventory, not a diff-only inspection:

```bash
SCAN=.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts
rg -n 'error:|errors:|errors\.push|warnings:|warnings\.push|throw new Error|JSON.stringify' "$SCAN"
rg -n 'relativizeScan(Error|Warning|Message)|relativize\(' "$SCAN"
```

For wording or vocabulary fixes, search across response builders and schemas, not only README text:

```bash
rg -n -i 'preset|capabilit(y|ies)|kind|manifest|candidate manifest' \
  .opencode/skill/system-spec-kit/mcp_server/code_graph \
  --glob '*.ts' --glob '*.md'
```

The wrong pattern is present if new or edited user-facing emitters are not accounted for in the helper/policy grep.

### CHECKLIST

Self-verifying 009 gate for the raw-path class:

```bash
SCAN=.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts
! rg -n 'errors\.push\(`\$\{result\.filePath\}|parseErrors\.map\(e => `\$\{result\.filePath\}' "$SCAN"
cd .opencode/skill/system-spec-kit/mcp_server &&
  npx vitest run code_graph/tests/code-graph-scan.vitest.ts \
    -t 'invalid rootDir|out-of-workspace rootDir|scan warnings|data.errors|relativizeScanError multi-path safety'
```

Self-verifying vocabulary-class gate:

```bash
rg -n -i 'candidate manifest drift|preset|capabilities' \
  .opencode/skill/system-spec-kit/mcp_server/code_graph \
  --glob '*.ts' --glob '*.md'
```

Expected result after a fix: either no user-facing matches, or each match is explicitly documented as an internal schema discriminator or maintainer-only field.

## Failure Mode 2 - One-consumer fix when the change is cross-cutting

### WRONG

The wrong pattern is fixing the producer path while leaving another consumer to recompute, re-state, or re-document the old contract.

Concrete 009 example: FIX-009 correctly made `code_graph_scan({ includeSkills:false })` override `SPECKIT_CODE_GRAPH_INDEX_SKILLS=true`, but Run 2 found `R2-I9-P1-001`: `code_graph_status` still computed active scope from ambient env only. That meant an env-enabled maintainer process could run a one-off end-user scan, then status would immediately report the env-enabled scope instead of the stored scan scope.

The pre-fix wrong consumer shape was:

```ts
const activeScopePolicy = resolveIndexScopePolicy();
```

in the status handler, disconnected from the scan's stored fingerprint/source.

Other 009 examples:

- `R2-I1-P2-001`: the skill-scope contract existed as a new policy constant, but regex/SQL/doc representations still carried sibling forms.
- `R2-I2-P2-001`: `index-scope-policy.ts` became the owner module, but README topology/key-file docs did not name it.
- `R2-I8-P2-001`: precedence was captured in ADR-002, but the requested ADR-001 sub-decision table still had only five rows.

Sibling example from 001: scratch prompts asked for detector provenance on `code_graph_status`, while the live surface was `code_graph_scan`. The wrong surface was being verified.

### RIGHT

The right pattern is an affected-consumers table. For 009, the clean status path now does this:

```ts
const storedScope = graphDb.getStoredCodeGraphScope();
const activeScopePolicy = parseIndexScopePolicyFromFingerprint(storedScope) ?? resolveIndexScopePolicy();
const scopeMismatch = storedScope.fingerprint !== activeScopePolicy.fingerprint;
```

The test then exercises scan plus status in one flow: set env true, scan with `includeSkills:false`, replay the stored policy through `getStoredCodeGraphScope`, call `handleCodeGraphStatus()`, and assert `activeScope === storedScope` with `scopeMismatch:false`.

The strongest good sibling example is packet 005's remediation plan. The review grouped 11 P1 and 3 P2 findings into batches by consumer surface:

- B1: trust-state and freshness consumers.
- B2: metrics label policy and benchmark harness consumers.
- B3: deletion inventory and packet traceability consumers.
- B4: hook settings execution, parity tests, and docs.
- B5: corpus path parity consumers.

That batching prevented a one-finding, one-patch loop. It is the right form of broader-scope remediation.

### DETECTION

Look for a changed policy/function with more than one consumer. If the fix only touches the initially reported handler, assume it is incomplete until a consumer grep proves otherwise.

For the 009 scope policy:

```bash
rg -n 'resolveIndexScopePolicy|parseIndexScopePolicyFromFingerprint|setCodeGraphScope|getStoredCodeGraphScope|activeScope|storedScope|scopeMismatch' \
  .opencode/skill/system-spec-kit/mcp_server/code_graph \
  --glob '*.ts'
```

For any changed function:

```bash
SYMBOL=resolveIndexScopePolicy
rg -n "($SYMBOL|from '../lib/index-scope-policy|from \"../lib/index-scope-policy)" \
  .opencode/skill/system-spec-kit/mcp_server \
  --glob '*.ts'
```

The wrong pattern is present if the consumer list is larger than the test/fix list and the skipped consumers have no explicit unchanged rationale.

### CHECKLIST

Self-verifying 009 gate:

```bash
STATUS=.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts
! rg -n 'activeScopePolicy\s*=\s*resolveIndexScopePolicy\(\)' "$STATUS"
rg -n 'parseIndexScopePolicyFromFingerprint\(storedScope\).*resolveIndexScopePolicy' "$STATUS"
cd .opencode/skill/system-spec-kit/mcp_server &&
  npx vitest run code_graph/tests/code-graph-scan.vitest.ts \
    -t 'reports status activeScope from the stored scan scope|lets includeSkills false override'
```

Generic consumer gate for future FIX prompts:

```bash
SYMBOL='<changedFunctionOrPolicy>'
rg -n "$SYMBOL" . --glob '*.ts' --glob '*.js' --glob '*.md'
```

The FIX response must include a table with every match classified as `updated`, `covered by existing invariant`, `intentionally unchanged`, or `not a consumer`.

## Failure Mode 3 - Algorithm choice with hidden edge cases

### WRONG

The wrong pattern is patching the observed input shape with a local regex or condition when the invariant is actually structural.

Concrete 009 example: FIX-009-v2 added `relativizeScanError()` with a regex-replace strategy:

```ts
return error.replace(/\/[^\s'"`{}\[\],)]+/g, match => relativize(match, workspaceRoot));
```

Run 3 found `RUN3-I3-P0-001`: joined tokens such as `/workspace/src/a.ts:/workspace/src/b.ts` and `/workspace/src/a.ts\0/workspace/src/b.ts` could be treated as one path-like match, so only the first path was relativized and the second absolute path survived. The algorithm was fighting delimiters one exclusion at a time.

Sibling examples:

- Packet 003: full scans and incremental scans shared stale-gate semantics, so a full scan could still behave like an incremental stale-filtered scan.
- Packet 008: canonical path comparison was needed for security, but canonical paths leaked into emitted paths. The invariant needed two channels: canonical for comparison, original/display for output.

### RIGHT

The right pattern is to encode the invariant directly.

For 009, FIX-009-v3 replaced regex-replace with split-then-process:

```ts
const PATH_DELIMITERS = /([\s:'"`{}\[\],()\x00]+)/;

function relativizeScanMessage(message: string, workspaceRoot: string): string {
  return message.split(PATH_DELIMITERS).map(segment => {
    if (segment.startsWith('/')) {
      return relativize(segment, workspaceRoot);
    }
    return segment;
  }).join('');
}
```

The invariant becomes "each absolute-looking segment is independently transformed; delimiters are preserved." The test table covers colon-delimited, NUL-delimited, quoted, bracketed, mixed-delimiter, and no-op inputs.

For packet 008, the right invariant is "canonicalize before containment checks; preserve display/original path semantics for emitted data unless the public contract says otherwise." That would have caught the canonical-path leak earlier.

### DETECTION

Suspect the wrong pattern when:

- The fix uses `.replace(/.../g)` on unstructured messages, paths, SQL, command text, or serialized payloads.
- The test added for a security/string bug has only one happy-path or one regression input.
- The edge case is a delimiter, escaping, casing, symlink, nested config, or fallback path.
- A reviewer can create a failing input by concatenating two valid examples.

Concrete detection for the 009 wrong approach:

```bash
rg -n 'replace\(/\\/\[\^|relativizeScan(Error|Warning)\(.*replace|PATH_DELIMITERS|split\(PATH_DELIMITERS\)' \
  .opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts
```

Wrong smell: regex replacement exists without a structural split/parser and without adversarial table coverage.

### CHECKLIST

Self-verifying 009 gate:

```bash
SCAN=.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts
TEST=.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts
! rg -n 'relativizeScan(Error|Warning).*replace|replace\(/\\/\[\^' "$SCAN"
rg -n 'PATH_DELIMITERS|split\(PATH_DELIMITERS\)' "$SCAN"
rg -n 'colon-delimited|NUL-delimited|quoted path|bracketed path list|mixed delimiters|no abs paths' "$TEST"
cd .opencode/skill/system-spec-kit/mcp_server &&
  npx vitest run code_graph/tests/code-graph-scan.vitest.ts \
    -t 'relativizeScanError multi-path safety'
```

Generic algorithm gate:

```bash
rg -n '\.replace\(|new RegExp|startsWith\(|includes\(|split\(' <changed-files>
```

For every match in the changed algorithm, the FIX response must name the invariant and list adversarial cases. A one-row regression test is not enough for path, redaction, parser, resolver, or precedence logic.

## Failure Mode 4 - Partial test or evidence matrix

### WRONG

The wrong pattern is testing the row that failed in review and assuming neighboring rows are implied.

Concrete 009 examples:

- Run 1 `R1-P1-001`: the original precedence tests missed the env-true plus explicit `includeSkills:false` row, so env could override an explicit one-off end-user scan.
- Run 2 `R2-I5-P1-001`: FIX-009 production code was correct, but `code-graph-indexer.vitest.ts` still did not pin the full six-case scope precedence matrix. Missing examples included `(env=undefined, includeSkills=false)` and `(env=true, includeSkills=true source=scan-argument)`.
- Run 2 resource-map drift: review used a moving `main~1..HEAD` range after HEAD advanced, manufacturing a regression. That is an evidence-matrix bug: the reviewed diff range was not pinned to the remediation SHA.

Sibling examples:

- Packet 008 review found five P0 traceability blockers because implementation docs claimed direct REQ coverage, but tests did not directly execute many REQ-002 through REQ-015 behaviors.
- Packet 004 review had missing runtime parity/evidence rows across query, context, scan, startup hooks, tests, and packet-local reports.

### RIGHT

The right pattern is an explicit matrix before implementation is declared complete.

For 009, the clean unit matrix is:

```ts
it.each([
  [undefined, undefined, false, 'default'],
  [undefined, true, true, 'scan-argument'],
  [undefined, false, false, 'scan-argument'],
  ['true', undefined, true, 'env'],
  ['true', true, true, 'scan-argument'],
  ['true', false, false, 'scan-argument'],
] as const)
```

That table covers the legal input states: env absent vs true, per-call absent vs true vs false, with impossible duplicate absent rows removed. It also asserts not only the boolean output but the source label.

For evidence packets, the right pattern is a pinned source of truth: fix commit SHA or explicit diff range, plus a finding-to-file:line table. Packet 005's applied reports are a good example: each batch records source findings, target files, before/after evidence, and verification commands.

### DETECTION

A FIX prompt or reviewer should identify all independent axes before accepting the test suite:

- env/default/per-call
- true/false/absent/null/rejected
- full/incremental
- fresh/stale/empty/error
- root inside workspace/symlink/outside/broken
- direct handler/status/readiness/database/docs
- native/codex/copilot/claude/gemini runtime variants

The wrong pattern is present if a test name says "matrix" but row count is smaller than the legal state count, or if packet docs claim REQ coverage without direct test evidence.

Concrete 009 matrix-row check:

```bash
TEST=.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts
sed -n '/resolveIndexScopePolicy precedence matrix/,/] as const/p' "$TEST"
```

Concrete evidence-range check:

```bash
git rev-parse --verify HEAD
git diff --name-only <FIX_SHA>^..<FIX_SHA>
```

Wrong smell: the review/checklist refers to `main~1..HEAD` or an unpinned branch-relative range after parallel commits landed.

### CHECKLIST

Self-verifying 009 matrix gate:

```bash
TEST=.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts
rows=$(sed -n '/resolveIndexScopePolicy precedence matrix/,/] as const/p' "$TEST" | rg -c "^\s*\[(undefined|'true')")
test "$rows" -eq 6
cd .opencode/skill/system-spec-kit/mcp_server &&
  npx vitest run code_graph/tests/code-graph-indexer.vitest.ts \
    -t 'resolveIndexScopePolicy precedence matrix'
```

Self-verifying direct-coverage gate for REQ-heavy packets:

```bash
PACKET=.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience
rg -n 'REQ-00[2-9]|REQ-01[0-5]' "$PACKET"/spec.md "$PACKET"/checklist.md "$PACKET"/implementation-summary.md
rg -n 'REQ-00[2-9]|REQ-01[0-5]' .opencode/skill/system-spec-kit/mcp_server --glob '*.{vitest,test}.ts'
```

Expected result: every claimed requirement has direct test evidence or the packet docs explicitly downgrade the claim from direct to indirect coverage.

## Failure Mode 5 - Test isolation regressions

### WRONG

The wrong pattern is adding tests for env-controlled or global-state behavior while inheriting the caller's process state.

Concrete 009 example: Run 2 found `R2-I4-P1-001`. `code-graph-scan.vitest.ts` had a default-scope assertion that assumed `SPECKIT_CODE_GRAPH_INDEX_SKILLS` was unset, but its `beforeEach` reset mocks only. Under the documented maintainer shell state:

```bash
SPECKIT_CODE_GRAPH_INDEX_SKILLS=true npx vitest run code_graph/tests/code-graph-scan.vitest.ts
```

the default-scope test failed because production correctly read the env opt-in.

Sibling examples:

- Packet 005 B2: benchmark tests set `SPECKIT_METRICS_ENABLED=true` and needed explicit restore plus metrics collector reset.
- Packet 005 B6: daemon-hardening changed runtime truth; tests that did not distinguish freshness artifacts from daemon trust collapsed outputs to `unavailable`.

### RIGHT

The right pattern is a full test-state bracket:

```ts
let originalIndexSkillsEnv: string | undefined;

beforeEach(() => {
  originalIndexSkillsEnv = process.env[CODE_GRAPH_INDEX_SKILLS_ENV];
  delete process.env[CODE_GRAPH_INDEX_SKILLS_ENV];
});

afterEach(() => {
  if (originalIndexSkillsEnv === undefined) {
    delete process.env[CODE_GRAPH_INDEX_SKILLS_ENV];
  } else {
    process.env[CODE_GRAPH_INDEX_SKILLS_ENV] = originalIndexSkillsEnv;
  }
});
```

For metrics/global collectors, the bracket also resets in-memory state after restore. Packet 005 B2 did this for `SPECKIT_METRICS_ENABLED` and `speckitMetrics.reset()`.

### DETECTION

Search for process-wide state writes in tests and bench files. Any write must have a same-file capture/restore bracket, and suites that assert default behavior must actively clear the relevant env in `beforeEach`.

```bash
rg -n 'process\.env(\[[^\]]+\]|\.[A-Z0-9_]+)\s*=|delete process\.env|speckitMetrics\.reset|vi\.stubEnv|vi\.unstubAllEnvs' \
  .opencode/skill/system-spec-kit/mcp_server \
  --glob '*.{vitest,test,bench}.ts'
```

Wrong smell: a test sets `process.env.X = ...` inside one case, or relies on default env absence, without top-level `beforeEach` and `afterEach` restoring the original value.

### CHECKLIST

Self-verifying 009 isolation gate:

```bash
cd .opencode/skill/system-spec-kit/mcp_server &&
  SPECKIT_CODE_GRAPH_INDEX_SKILLS=true npx vitest run \
    code_graph/tests/code-graph-scan.vitest.ts \
    code_graph/tests/code-graph-indexer.vitest.ts \
    code_graph/tests/code-graph-scope-readiness.vitest.ts
```

Self-verifying source audit:

```bash
rg -n 'original.*Env|beforeEach\(\(\) => \{|afterEach\(\(\) => \{|delete process\.env\[CODE_GRAPH_INDEX_SKILLS_ENV\]' \
  .opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts \
  .opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts \
  .opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scope-readiness.vitest.ts
```

Generic global-state gate:

```bash
ENV_NAME='<ENV_OR_GLOBAL_NAME>'
rg -n "$ENV_NAME|original.*Env|afterEach|finally|reset\\(" <changed-test-files>
```

Expected result: every env/global write has a restore path that runs on assertion failure, and default-behavior tests pass under the opposite caller environment.

## Universal "fix completeness checklist"

Use this as the default FIX prompt checklist for security-sensitive or cross-cutting code. A narrow "fix this finding" prompt is acceptable only after the fixer proves the finding is instance-only.

1. **Classify the finding.**

   State one of: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. If the answer is unknown, default to class/cross-consumer until grep proves otherwise.

2. **Inventory same-class producers.**

   ```bash
   rg -n '<field|string|helper|literal|error-pattern>' <changed-files-or-module>
   rg -n 'errors\.push|warnings\.push|throw new Error|JSON.stringify|return \{.*error|message:' <changed-files-or-module>
   ```

   Output a table: `site`, `user-visible?`, `fixed?`, `test?`, `rationale`.

3. **Inventory consumers of changed functions or policies.**

   ```bash
   rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.ts' --glob '*.js' --glob '*.md'
   ```

   Every consumer is `updated`, `covered unchanged`, `intentionally unchanged`, or `not a consumer`.

4. **Replace fragile algorithms with invariant-shaped logic.**

   ```bash
   rg -n '\.replace\(|new RegExp|startsWith\(|includes\(|split\(' <changed-files>
   ```

   For each changed algorithm, write adversarial tests before declaring done. Required for path/redaction/parser/resolver/security code: multiple delimiters, two valid examples joined together, outside-root input, empty/no-op input, and one fallback-path input.

5. **Build the full matrix.**

   List every independent axis and row count before testing. The test table must include output and source/provenance labels, not only booleans.

   ```bash
   rg -n 'it\.each|test\.each|describe\.each|REQ-|source:' <changed-tests-and-packet-docs>
   ```

6. **Pin evidence to a SHA or explicit range.**

   ```bash
   git rev-parse --verify HEAD
   git diff --name-only <FIX_SHA>^..<FIX_SHA>
   ```

   Avoid moving ranges such as `main~1..HEAD` in remediation review evidence.

7. **Run the hostile environment variant.**

   ```bash
   env <RELEVANT_ENV>=true <focused-test-command>
   env -u <RELEVANT_ENV> <focused-test-command>
   ```

   If tests mutate env, grep for capture/restore and reset of in-memory singletons.

8. **Re-check every previously closed gate after the fix.**

   For deep-review reruns, the reviewer should not only search for new findings. It should explicitly re-run closed-finding checks and mark each `PASS`, `FAIL`, or `carried forward`.

9. **Declare residual scope explicitly.**

   The final FIX response should include:

   - Changed files.
   - Same-class producer inventory.
   - Consumer inventory.
   - Matrix rows added or verified.
   - Hostile env command.
   - Previously closed gates rechecked.
   - Any intentionally unchanged sibling/consumer with evidence.

## Research question updates

This iteration mainly advances questions 4 and 7, with a refinement to question 5.

Question 4: yes, `sk-deep-review` should require a hard "closed gates rechecked after fix" section for security-sensitive fixes. The 009 run shows rolling convergence alone is insufficient; Run 3 still found a P0 after v2 had apparently closed the prior P0 because the algorithm shape was wrong.

Question 5: yes, fix-oriented planning should require "Affected Surfaces" for policies/functions. The checklist above makes that operational through consumer grep and same-class producer inventory.

Question 7: the default fix prompt should be "fix this finding and prove sibling/consumer/class coverage." Only downgrade to "fix this instance" after the fixer provides evidence that the finding is truly instance-only.

## New findings ratio

I estimate `newFindingsRatio = 0.64` for this iteration. The five failure modes and frequency ranking were known from iterations 001 and 002, but this iteration adds the operational pattern catalog, explicit wrong/right examples, and concrete grep/test gates that can be copied into FIX prompts and review checklists.
