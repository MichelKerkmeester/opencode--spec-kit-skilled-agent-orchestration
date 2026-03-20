● skill(system-spec-kit)

I’m auditing the two Vitest suites now: inventorying tests, mapping them to source areas, and then checking for coverage gaps, flaky patterns, and config quality.

● Search (grep)
  │ "\b(fixtures?|__fixtures__|mock[A-Z]|fake[A-Z]|vi\.mock|setTimeout|Date\.|performance\.now|Math\
  │ .random|sleep|waitFor|beforeAll|afterAll|describe\.serial|test\.concurrent|it\.concurrent)\b" in
  │ **/*.{test,spec,vitest}.ts (.opencode/skill/system-spec-kit)
  └ 5 lines found

● Search (grep)
  │ "\b(describe|it|test)\s*\(" in **/*.{test,spec,vitest}.ts (.opencode/skill/system-spec-kit)
  └ 5 lines found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/scripts/**/*.ts"
  └ 138 files found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/mcp_server/tests/**/*"
  └ 6 files found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/mcp_server/**/*.ts"
  └ 6 files found

● Search (glob)
  │ "**/vitest.config.ts"
  └ 1 file found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/scripts/tests/**/*"
  └ 154 files found

I’ve got the inventory; next I’m sampling representative tests plus package/config files so I can judge naming, fixture style, and how the suites are actually organized.

● Read package.json
  │ .opencode/skill/system-spec-kit/mcp_server/package.json
  └ 59 lines read

● Read package.json
  │ .opencode/skill/system-spec-kit/scripts/package.json
  └ 28 lines read

● Read README.md
  │ .opencode/skill/system-spec-kit/scripts/tests/README.md
  └ 115 lines read

● Read vitest.config.ts
  │ .opencode/skill/system-spec-kit/mcp_server/vitest.config.ts
  └ 23 lines read

● Read workflow-e2e.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts
  └ L1:260 (260 lines read)

● Read test-integration.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/test-integration.vitest.ts
  └ L1:260 (260 lines read)

● Read memory-render-fixture.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts
  └ L1:240 (240 lines read)

● Read input-normalizer-unit.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/input-normalizer-unit.vitest.ts
  └ L1:220 (194 lines read)

● Search (glob)
  │ ".opencode/skill/system-spec-kit/mcp_server/tests/*.vitest.ts"
  └ 6 files found

I’m switching from spot checks to a repo-wide pass now: generating an import-based source→test map so the coverage-gap findings are evidence-backed rather than just filename guesses.

● Search (grep)
  │ "\b(not\.toThrow|toThrow|toBeTruthy\(|toBeDefined\(|toBeGreaterThan\(0\)|toContain\(|toEqual\(|t
  │ oMatchObject\(|toStrictEqual\()" in **/*.{vitest,js,py,sh}.ts
  │ (.opencode/skill/system-spec-kit/scripts/tests)
  └ 5 lines found

● Search (grep)
  │ "\b(not\.toThrow|toThrow|toBeTruthy\(|toBeDefined\(|toBeGreaterThan\(0\)|toContain\(|toEqual\(|t
  │ oMatchObject\(|toStrictEqual\()" in **/*.vitest.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 5 lines found

● Summarize tests and import-based source coverage (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && python3 - <<'PY'
  │ from pathlib import Path
  │ import json, re
  │ root = Path('.opencode/skill/system-spec-kit')…
  └ 82 lines...

The first coverage script tripped on a path-normalization bug, so I’m rerunning it with a stricter parser and also pulling the specific files that look most likely to reveal flakiness or weak assertions.

● Search (grep)
  │ "\b(beforeAll|afterAll|beforeEach|afterEach|describe\.skip|it\.skip|test\.skip|describe\.concurr
  │ ent|it\.concurrent|test\.concurrent)\b" (.opencode/skill/system-spec-kit/scripts/tests)
  └ 64 lines found

● Search (grep)
  │ "\b(Date\.now|new
  │ Date\(|setTimeout|setInterval|performance\.now|Math\.random|process\.hrtime|sleep|waitFor)\b"
  │ (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 5 lines found

● Search (grep)
  │ "\b(beforeAll|afterAll|beforeEach|afterEach|describe\.skip|it\.skip|test\.skip|describe\.concurr
  │ ent|it\.concurrent|test\.concurrent)\b" (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 5 lines found

● Search (grep)
  │ "\b(Date\.now|new
  │ Date\(|setTimeout|setInterval|performance\.now|Math\.random|process\.hrtime|sleep|waitFor)\b"
  │ (.opencode/skill/system-spec-kit/scripts/tests)
  └ 71 lines found

● Compute categorized tests and uncovered sources (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && python3 - <<'PY'
  │ from pathlib import Path
  │ import json, re
  │ root = (Path('.opencode/skill/system-spec-kit')).resolve()
  │ import_re = re.compile(r"(?:import\s+(?:type\s+)?(?:[^'\"]+?from\s+)?|export\s+[^'\"]+?from\s+…
  └ 88 lines...

● Read copilot-tool-output-1774014904560-m52ysy.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774014904560-m52ysy.txt
  └ L1:260 (260 lines read)

● Read copilot-tool-output-1774014904560-m52ysy.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774014904560-m52ysy.txt
  └ L261:520 (260 lines read)

● Read copilot-tool-output-1774014901269-j5cuso.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774014901269-j5cuso.txt
  └ L1:220 (181 lines read)

● Read copilot-tool-output-1774014901269-has2de.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774014901269-has2de.txt
  └ L1:220 (140 lines read)

I’ve got enough breadth now; I’m tightening the evidence on two places that matter most for the final callout list: the “missing coverage” map and whether any suites lean on weak, performance, or timing-based assertions.

● Read tool-input-schema.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts
  └ L260:340 (46 lines read)

● Read interfaces.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/interfaces.vitest.ts
  └ L120:150 (31 lines read)

● Read memory-save-extended.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts
  └ L620:740 (121 lines read)

● Read search-limits-scoring.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts
  └ L130:190 (61 lines read)

● Count weak assertion patterns (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit' && python3 - <<'PY'
  │ from pathlib import Path
  │ import re
  │ for workspace in ['scripts/tests','mcp_server/tests']:…
  └ 90 lines...

● Refine direct coverage gaps excluding node_modules (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && python3 - <<'PY'
  │ from pathlib import Path
  │ import json, re
  │ root = (Path('.opencode/skill/system-spec-kit')).resolve()
  │ static_import_re = re.compile(r"(?:import\s+(?:type\s+)?(?:[^'\"]+?from\s+)?|export\s+[^'\"]+?…
  └ 149 lines...

One last pass: I’m checking fixture layout in both workspaces so the report can distinguish “realistic but heavy” from genuinely brittle fixture strategy.

● Read session-data-factory.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/fixtures/session-data-factory.ts
  └ L1:240 (202 lines read)

● Read full-spec-doc-indexing.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts
  └ L1:240 (240 lines read)

● Read checkpoints-extended.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts
  └ L1:220 (220 lines read)

● Search (grep)
  │ "fixtures?|mkdtempSync|tmpdir\(|writeFileSync\(|mkdirSync\(|createTemp|tempDir" in
  │ **/*.vitest.ts (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 5 lines found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/mcp_server/tests/**/*fixture*"
  └ No matches found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/mcp_server/tests/**/fixtures/**/*"
  └ 3 files found

I’ve confirmed the fixture split too: `scripts` leans on rich hand-built repo fixtures, while `mcp_server` mixes a few reusable JSON fixtures with lots of per-test temp DB setup. I’m grabbing the actual fixture contents now so I can judge realism and maintainability instead of hand-waving.

● Read contradiction-pairs.json
  │ .opencode/skill/system-spec-kit/mcp_server/tests/fixtures/contradiction-pairs.json
  └ L1:220 (116 lines read)

● Read similarity-test-cases.json
  │ .opencode/skill/system-spec-kit/mcp_server/tests/fixtures/similarity-test-cases.json
  └ L1:220 (147 lines read)

● Read sample-memories.json
  │ .opencode/skill/system-spec-kit/mcp_server/tests/fixtures/sample-memories.json
  └ L1:220 (106 lines read)

● Read test-validation-system.js
  │ .opencode/skill/system-spec-kit/scripts/tests/test-validation-system.js
  └ L1:220 (220 lines read)

● Read progressive-validation.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/progressive-validation.vitest.ts
  └ L1:260 (259 lines read)

I’ve got the core evidence. I’m doing a final normalization step now so the report has clean counts instead of rough estimates, especially where the suites mix Vitest, Bash, Node, and Python.

● Read checkpoints-extended.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts
  └ L220:420 (201 lines read)

● Read runtime-memory-inputs.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts
  └ L130:175 (46 lines read)

● Read hybrid-search.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts
  └ L600:760 (161 lines read)

● Count test runners by workspace (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ root = Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit')
  │ for workspace in ['scripts/tests','mcp_server/tests']:…
  └ 23 lines...

● Find likely duplicated test clusters (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ import re
  │ root = Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit')…
  └ 29 lines...

● Read interfaces.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/interfaces.vitest.ts
  └ L1:260 (260 lines read)

● Read recovery-hints.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts
  └ L1:220 (219 lines read)

● Read vector-index-impl.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts
  └ L1:220 (220 lines read)

● Search (grep)
  │ "toBeTruthy\(|toBeDefined\(|not\.toThrow\("
  │ (.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts)
  └ 38 lines found

● Search (grep)
  │ "toBeTruthy\(|toBeDefined\(|not\.toThrow\("
  │ (.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts)
  └ 54 lines found

● Search (grep)
  │ "setFailRate|_failRate|Math\.random\("
  │ (.opencode/skill/system-spec-kit/mcp_server/tests/interfaces.vitest.ts)
  └ 6 lines found

● Read interfaces.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/interfaces.vitest.ts
  └ L450:478 (28 lines read)

I’m converting the coverage-gap section to “no obvious dedicated test” instead of pretending import analysis is perfect. That gives a fairer audit, especially where some behavior is exercised indirectly through integration suites.

● Read semantic-signal-golden.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/semantic-signal-golden.vitest.ts
  └ L1:180 (159 lines read)

● Read quality-scorer-calibration.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/quality-scorer-calibration.vitest.ts
  └ L1:180 (180 lines read)

● Read workspace-identity.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/workspace-identity.vitest.ts
  └ L1:120 (79 lines read)

● Find source files lacking obvious dedicated tests (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ import re
  │ root = Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit')…
  └ 125 lines...

# System-spec-kit test audit

## Inventory

| Workspace | Inventory | Main themes |
|---|---:|---|
| `scripts/tests/` | `38` Vitest + `24` Node JS + `4` shell + `1` Python, plus compiled `.js/.map` artifacts | validation/phase workflows, capture adapters, workflow save path, utility regressions |
| `mcp_server/tests/` | `284` Vitest files + `3` reusable JSON fixture files | search/scoring, handlers, storage/checkpoints, graph/causal, session/learning, integration pipeline |

`scripts/tests/` is mixed-runner and flat. `mcp_server/tests/` is all Vitest, also flat, but much broader.

## Findings

### 1. Test naming

Overall: **good in modern Vitest files, weak in legacy script tests**.

Good examples:
- `input-normalizer-unit.vitest.ts`
- `workflow-e2e.vitest.ts`
- `quality-scorer-calibration.vitest.ts`
- `full-spec-doc-indexing.vitest.ts`

Weaker names:
- `test-bug-fixes.js`
- `test-scripts-modules.js`
- `test-utils.js`

In `mcp_server`, file names are usually precise, but many `it(...)` names drift into generic contract wording like “returns object”, “has expected fields”, or “loads without error”, which explains the high volume of `toBeDefined()`/`toBeTruthy()` checks.

### 2. Test organization: unit vs integration vs e2e

**Biggest organizational issue is `scripts/tests/`.**

`scripts` mixes:
- Vitest unit tests
- Node custom-runner tests
- shell tests
- one Python test
- compiled JS outputs inside the same folder

Also, `scripts/package.json` runs:

```json
"test": "vitest run --config ../mcp_server/vitest.config.ts --root ."
```

That means **`npm test` only runs `*.vitest.ts`**. The JS/shell/Python suites in `scripts/tests/README.md` are outside the default test command, so a large part of the suite is easy to miss in automation.

`mcp_server` is cleaner because everything is Vitest, but unit/integration/e2e are still separated only by filename conventions (`integration-*`, `file-watcher`, `cli`) rather than folders or Vitest projects.

### 3. Test fixtures: maintainability and realism

**Scripts fixtures are realistic and mostly strong.**

Good:
- repo-shaped markdown fixture trees under `scripts/tests/fixtures/phase-*`
- typed builder in `scripts/tests/fixtures/session-data-factory.ts`

That gives realistic inputs and stable reuse.

Weakness:
- many tests still build large inline temp repos/workspaces by hand
- fixture logic is duplicated across validation/workflow tests
- compiled test artifacts in `scripts/tests/` add clutter

**MCP fixtures are realistic but under-centralized.**

Good:
- small reusable JSON fixtures in `mcp_server/tests/fixtures/*.json`
- lots of temp DB/temp dir setup mirrors production behavior

Weakness:
- most stateful DB fixtures are rebuilt inline per file instead of shared helpers
- suites like `checkpoints-extended.vitest.ts` and `vector-index-impl.vitest.ts` carry a lot of custom setup/seed code, which raises maintenance cost

### 4. Missing coverage: source files with no obvious corresponding test

This is based on a **dedicated-test heuristic** (filename/subject match), not a strict statement that behavior is never exercised indirectly.

**Scripts gaps are substantial.** Biggest areas without obvious dedicated tests:
- `scripts/evals/*` — essentially the whole eval/tooling layer
- `scripts/utils/*` — e.g. `data-validator.ts`, `logger.ts`, `memory-frontmatter.ts`, `message-utils.ts`, `path-utils.ts`, `tool-detection.ts`
- `scripts/extractors/*` — e.g. `conversation-extractor.ts`, `collect-session-data.ts`, `git-context-extractor.ts`, `file-extractor.ts`, `session-activity-signal.ts`, `spec-folder-extractor.ts`, `diagram-extractor.ts`
- `scripts/core/*` — especially `file-writer.ts`, `subfolder-utils.ts`, `topic-extractor.ts`, `config.ts`
- `scripts/spec-folder/*` — `directory-setup.ts`, `generate-description.ts`, `index.ts`

**MCP gaps are narrower but still real.** Notable areas without obvious dedicated tests:
- `mcp_server/api/*` — especially `providers.ts`, `index.ts`
- `mcp_server/hooks/*` — `index.ts`, `memory-surface.ts`, `response-hints.ts`, `mutation-feedback.ts`
- handler split files such as `memory-bulk-delete.ts`, `shared-memory.ts`, `handler-utils.ts`, `memory-index-alias.ts`, `memory-index-discovery.ts`, `pe-gating.ts`
- lower-level search/storage utility modules like `vector-index-queries.ts`, `vector-index-mutations.ts`, `vector-index-store.ts`, `vector-index-types.ts`, `lib/utils/path-security.ts`, `lib/utils/logger.ts`

### 5. Flaky or environment-sensitive patterns

I did **not** find widespread obvious flake, but I did find several risk patterns.

Higher-risk:
- `mcp_server/tests/tool-input-schema.vitest.ts` includes a wall-clock assertion: schema validation must finish in `<5ms` per tool. That is benchmark-like and can flap under CI load.
- `mcp_server/tests/checkpoints-extended.vitest.ts` and `vector-index-impl.vitest.ts` use shared temp DB state created in `beforeAll`, then mutate it across many tests. That creates order/leakage risk.
- `scripts/tests/runtime-memory-inputs.vitest.ts` skips one permission test when running as root, so coverage varies by environment.

Moderate-risk:
- many tests use `Date.now()` for thresholds or timestamps (`composite-scoring.vitest.ts`, `interference.vitest.ts`, retry/timing-oriented script tests)
- `test-embeddings-behavioral.js` uses real `setTimeout`
- many suites mutate `process.env` and restore it manually

Low-risk:
- many `Date.now()` uses are only for unique temp filenames, which is fine

### 6. Test duplication

There is meaningful duplication that could be parameterized.

Best candidates:
- capture adapter suites in `scripts`: `claude-code-capture`, `codex-cli-capture`, `copilot-cli-capture`, `gemini-cli-capture`, `opencode-capture`
- validation-related scripts: `test-validation.sh`, `test-validation-extended.sh`, `test-validation-system.js`, `progressive-validation.vitest.ts`, `test-phase-validation.js`
- `mcp_server` “base + extended + integration” families:
  - `access-tracker`
  - `checkpoints`
  - `cross-encoder`
  - `memory-parser`
  - `memory-save`
  - `session-manager`
  - `transaction-manager`

A positive note: `full-spec-doc-indexing.vitest.ts` already uses table-driven cases well. More of the suite should look like that.

### 7. Assertion quality

This is the second biggest quality issue after organization.

**Scripts:** mostly okay in modern Vitest files. Strong examples include:
- `quality-scorer-calibration.vitest.ts`
- `memory-render-fixture.vitest.ts`
- `workflow-e2e.vitest.ts`
- `progressive-validation.vitest.ts`

Those assert outputs, content, filenames, warnings, and side effects.

**MCP:** there is too much existence/shape testing. Rough signal from the suite:
- `90` uses of `not.toThrow()`
- `175` uses of `toBeTruthy()`
- `589` uses of `toBeDefined()`

Concrete weak spots:
- `recovery-hints.vitest.ts` is very export/existence heavy
- `checkpoints-extended.vitest.ts` repeatedly checks `result`/`content` are defined without always asserting semantics
- `vector-index-impl.vitest.ts` spends a lot of effort on export presence and alias parity
- `tool-input-schema.vitest.ts` often proves “accepts shape” via `not.toThrow()` rather than validating normalized/returned behavior

So: **coverage breadth is high, but semantic depth is uneven**.

### 8. `vitest.config.ts`

Current config is serviceable, not optimal.

Good:
- explicit include
- Node environment
- alias support
- reasonable default timeout

Not optimal:
- one shared config is reused by `scripts`, even though `scripts` has a mixed test strategy
- no coverage config or thresholds
- no clear mock/env reset policy (`restoreMocks`, `clearMocks`, `unstubEnvs`, etc.)
- no project split for unit vs integration vs e2e
- the `30s` blanket timeout masks slow tests rather than classifying them

## Bottom line

`mcp_server` has **broad coverage but too many shallow contract/existence assertions**.

`scripts` has **some excellent realistic tests**, but the suite is **fragmented across runners**, and a large portion is **not covered by the default `npm test` path**.

If you want, I can turn this into a prioritized remediation plan next.

