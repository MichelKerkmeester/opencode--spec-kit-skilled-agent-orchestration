---
title: "280 -- CLI matrix adapter runner smoke"
description: "Operator validation for CLI matrix adapters: one cell per adapter, JSONL output shape, and timeout handling."
---

# 280 -- CLI matrix adapter runner smoke

## 1. OVERVIEW

This scenario validates the matrix runner surface. It exercises one cell through each shipped external CLI adapter, verifies the JSONL record shape, and uses the mocked adapter suites to prove timeout normalization returns `TIMEOUT_CELL`.

---

## 2. SCENARIO CONTRACT


- Objective: Run a single matrix cell through `cli-codex`, `cli-copilot`, `cli-gemini`, `cli-claude-code`, and `cli-opencode`, then verify per-cell JSONL and timeout behavior.
- Real user request: `` Please validate CLI matrix adapter runner smoke against the documented validation surface and tell me whether the expected signals are present: Step 1 writes five files under `$OUT`: one each for `F5-cli-codex`, `F5-cli-copilot`, `F5-cli-gemini`, `F5-cli-claude-code`, and `F5-cli-opencode`.; Live cells may be `PASS`, `FAIL`, or `BLOCKED` depending on local CLI auth; `NA` is not expected for F5.; Every JSONL record has `cell_id`, `featureId`, `featureName`, `executor`, `status`, `durationMs`, `evidence.stdout`, `evidence.stderr`, and `evidence.exitCode`.; `summary.tsv` contains per-feature and per-executor aggregate rows.; The timeout test command passes and includes `TIMEOUT_CELL` assertions for every adapter suite. ``
- RCAF Prompt: `` As a tooling validation operator, validate CLI matrix adapter runner smoke against the documented validation surface. Verify Step 1 writes five files under `$OUT`: one each for `F5-cli-codex`, `F5-cli-copilot`, `F5-cli-gemini`, `F5-cli-claude-code`, and `F5-cli-opencode`.; Live cells may be `PASS`, `FAIL`, or `BLOCKED` depending on local CLI auth; `NA` is not expected for F5.; Every JSONL record has `cell_id`, `featureId`, `featureName`, `executor`, `status`, `durationMs`, `evidence.stdout`, `evidence.stderr`, and `evidence.exitCode`.; `summary.tsv` contains per-feature and per-executor aggregate rows.; The timeout test command passes and includes `TIMEOUT_CELL` assertions for every adapter suite. Return a concise pass/fail verdict with the main reason and cited evidence. ``
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Step 1 writes five files under `$OUT`: one each for `F5-cli-codex`, `F5-cli-copilot`, `F5-cli-gemini`, `F5-cli-claude-code`, and `F5-cli-opencode`.; Live cells may be `PASS`, `FAIL`, or `BLOCKED` depending on local CLI auth; `NA` is not expected for F5.; Every JSONL record has `cell_id`, `featureId`, `featureName`, `executor`, `status`, `durationMs`, `evidence.stdout`, `evidence.stderr`, and `evidence.exitCode`.; `summary.tsv` contains per-feature and per-executor aggregate rows.; The timeout test command passes and includes `TIMEOUT_CELL` assertions for every adapter suite
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the expected signals are present without contradicting evidence; FAIL if required signals are missing or execution cannot complete.

---

## 3. TEST EXECUTION

### Commands

1. Run one F5 cell through every shipped adapter:

```bash
OUT="/tmp/spec-kit-matrix-smoke-$(date +%s)"
cd .opencode/skill/system-spec-kit
npx tsx mcp_server/matrix_runners/run-matrix.ts \
  --output "$OUT" \
  --filter F5 \
  --executors cli-codex,cli-copilot,cli-gemini,cli-claude-code,cli-opencode \
  --working-dir "$(pwd)/../../.."
```

2. Verify JSONL shape:

```bash
for file in "$OUT"/F5-*.jsonl; do
  jq -e '
    has("cell_id") and
    has("featureId") and
    has("featureName") and
    has("executor") and
    has("status") and
    has("durationMs") and
    has("evidence") and
    (.featureId == "F5") and
    (.status | IN("PASS","FAIL","TIMEOUT_CELL","NA","BLOCKED"))
  ' "$file"
done
```

3. Inspect aggregate summary:

```bash
cat "$OUT/summary.tsv"
```

4. Verify adapter timeout handling with mocked subprocesses:

```bash
cd .opencode/skill/system-spec-kit/mcp_server
npx vitest run \
  tests/matrix-adapter-codex.vitest.ts \
  tests/matrix-adapter-copilot.vitest.ts \
  tests/matrix-adapter-gemini.vitest.ts \
  tests/matrix-adapter-claude-code.vitest.ts \
  tests/matrix-adapter-opencode.vitest.ts \
  --testNamePattern 'TIMEOUT_CELL'
```

### Expected Output / Verification

- Step 1 writes five files under `$OUT`: one each for `F5-cli-codex`, `F5-cli-copilot`, `F5-cli-gemini`, `F5-cli-claude-code`, and `F5-cli-opencode`.
- Live cells may be `PASS`, `FAIL`, or `BLOCKED` depending on local CLI auth; `NA` is not expected for F5.
- Every JSONL record has `cell_id`, `featureId`, `featureName`, `executor`, `status`, `durationMs`, `evidence.stdout`, `evidence.stderr`, and `evidence.exitCode`.
- `summary.tsv` contains per-feature and per-executor aggregate rows.
- The timeout test command passes and includes `TIMEOUT_CELL` assertions for every adapter suite.

### Cleanup

```bash
rm -rf "$OUT"
```

### Variant Scenarios

- Run F11 with all executors and verify `F11-cli-gemini` records `NA` from the manifest applicability rule.
- Run `--filter F5,F6` to prove multiple code-graph cells produce separate JSONL records.
- Run with one missing CLI binary and verify the adapter records `BLOCKED` rather than crashing the meta-runner.

---

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Runner docs: `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/README.md`
- Manifest: `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/matrix-manifest.json`
- Adapter common: `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/adapter-common.ts`

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 280
- Current behavior: matrix runners execute external CLI adapter cells and write normalized JSONL.
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/280-cli-matrix-adapter-runner-smoke.md`
