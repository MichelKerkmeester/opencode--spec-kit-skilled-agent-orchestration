# Iteration 003: Scripts Correctness

## Findings

### SCR-001
- ID: `SCR-001`
- Severity: `P1`
- Title: Next-step sessions cannot reach `COMPLETED`
- File: `.opencode/skill/system-spec-kit/scripts/dist/extractors/collect-session-data.js:271`
- Evidence: `hasNextSteps` is true when `collectedData.nextSteps` exists or a `Next Steps` observation is present (`271-272`), and `hasUnresolvedNextSteps` is defined with the same predicates plus a length check (`275-277`). Inside the completion branch (`280-284`), any non-empty `nextSteps` array or `Next Steps` observation always forces `IN_PROGRESS`, so the `COMPLETED` return is unreachable for the exact case the surrounding comment describes.
- Impact: JSON-mode sessions that include explicit follow-up steps are systematically under-classified as `IN_PROGRESS`, which skews saved state, completion percentages, and resume behavior.
- Fix: Separate “has next steps” from “has unresolved next steps”. For example, only downgrade when steps are explicitly marked unresolved, or remove the downgrade until the payload has a real completion/resolution signal.

### SCR-002
- ID: `SCR-002`
- Severity: `P1`
- Title: `--dry-run` still writes the mapping artifact
- File: `.opencode/skill/system-spec-kit/scripts/dist/evals/map-ground-truth-ids.js:58`
- Evidence: The script parses `DRY_RUN` at `58-60`, prints `Mode: DRY RUN` at `363-365`, but unconditionally writes `/tmp/ground-truth-id-mapping.json` at `428-439`. There is no branch that suppresses the write when `--dry-run` is set.
- Impact: The CLI contract is wrong: callers asking for a side-effect-free preview still mutate `/tmp`, which can overwrite prior outputs and mislead automation that relies on dry-run semantics.
- Fix: Guard the write behind `if (!DRY_RUN)`, and print a separate preview message when dry-run mode is active.

### SCR-003
- ID: `SCR-003`
- Severity: `P1`
- Title: Redaction calibration depends on the caller's current working directory
- File: `.opencode/skill/system-spec-kit/scripts/dist/evals/run-redaction-calibration.js:55`
- Evidence: `loadRedactionGate()` resolves `redaction-gate.js` from `path.join(process.cwd(), 'mcp_server', 'dist', 'lib', 'extraction', 'redaction-gate.js')` (`55-59`). In this repository, that path is missing from the repo root, while the actual module exists at `.opencode/skill/system-spec-kit/mcp_server/dist/lib/extraction/redaction-gate.js`. So the script fails when invoked from the repository root instead of the skill root.
- Impact: The script is fragile outside one specific launch directory and crashes before evaluation starts, even though the dependency exists in the workspace.
- Fix: Resolve the gate module relative to `__dirname`/the script root (or an explicit package root), then validate the loaded export before using it.

### SCR-004
- ID: `SCR-004`
- Severity: `P2`
- Title: Description metadata uses unresolved paths after validating canonical paths
- File: `.opencode/skill/system-spec-kit/scripts/dist/spec-folder/generate-description.js:56`
- Evidence: The script validates containment with canonical paths via `realpathSync()` (`61-71`), but then computes `relativePath` from the original unresolved `basePath` and `folderPath` (`89-92`). If a caller mixes symlinked and real paths, validation succeeds against `realBase`/`realFolder` while the stored `specFolder` metadata can fall back to the bare folder name or an incorrect relative path.
- Impact: `description.json` can record inconsistent `specFolder`/`parentChain` metadata even when the folder was accepted as valid, which degrades later folder lookup and alignment logic.
- Fix: Derive relative metadata from `realBase` and `realFolder` after the canonical containment check.

### SCR-005
- ID: `SCR-005`
- Severity: `P2`
- Title: Fixture generation aborts with raw sync I/O/JSON failures
- File: `.opencode/skill/system-spec-kit/scripts/dist/tests/fixtures/generate-phase1-5-dataset.js:21`
- Evidence: `loadBaseDataset()` calls `readFileSync()` and `JSON.parse()` directly (`21-24`) with no error handling or schema validation.
- Impact: A missing or malformed `scratch/eval-dataset-100.json` crashes the generator with an unhelpful stack instead of a targeted failure message, which makes fixture regeneration and CI triage slower than necessary.
- Fix: Wrap the read/parse step in `try/catch`, validate that the payload is the expected row array, and exit with a clear error that includes the dataset path.

## Summary

Reviewed all `101` compiled `.js` files under `.opencode/skill/system-spec-kit/scripts/dist/`, including `memory/`, `validation-related utilities`, `extractors/`, `generators/spec-folder`, `evals/`, `renderers/`, and misc helpers.

Material correctness findings were limited to five issues: three `P1` defects and two `P2` defects. The highest-signal problems were in extractor state classification and eval-script CLI/runtime behavior.

`memory/generate-context.js` itself did not surface a material correctness defect in this pass. Its explicit-target precedence, spec-folder validation flow, and structured-input parsing looked internally consistent after direct inspection.

## JSONL

```jsonl
{"type":"iteration","run":3,"mode":"review","dimensions":["correctness"],"filesReviewed":101,"findingIds":["SCR-001","SCR-002","SCR-003","SCR-004","SCR-005"],"severityCounts":{"P1":3,"P2":2},"summary":"Reviewed all compiled dist JS files. Found 5 material correctness issues: unreachable COMPLETED classification for sessions with next steps, ignored --dry-run write behavior, cwd-dependent redaction gate loading, canonical/unresolved path mismatch in generate-description metadata, and unhandled fixture dataset read/parse failures."}
```
