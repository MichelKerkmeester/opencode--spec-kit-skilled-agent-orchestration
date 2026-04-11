---
title: "JSON Output File via --output Flag"
feature_id: "IS-004"
category: "Integration Scanner"
---

# JSON Output File via --output Flag

Validates that the --output flag writes scan results to a valid JSON file at the specified path.

## Prompt / Command

```bash
node .opencode/skill/sk-improve-agent/scripts/scan-integration.cjs --agent=debug --output=/tmp/test-scan-output.json && cat /tmp/test-scan-output.json | python3 -c "import sys,json; json.load(sys.stdin); print('Valid JSON')"
```

### Verification (copy-paste)

```bash
node .opencode/skill/sk-improve-agent/scripts/scan-integration.cjs --agent=debug --output=/tmp/test-scan-output.json && python3 -c "import json; d=json.load(open('/tmp/test-scan-output.json')); assert d['status']=='complete'; assert 'surfaces' in d; assert 'summary' in d; print('PASS: valid JSON with expected structure')"
```

## Expected Signals

- File `/tmp/test-scan-output.json` is created after the command completes
- The file contains valid JSON (parseable without errors)
- JSON structure matches stdout output: `status`, `surfaces`, `summary` top-level fields
- `surfaces.canonical.exists: true`, `surfaces.mirrors` array present
- `summary.totalSurfaces`, `summary.mirrorSyncStatus` fields present

## Pass Criteria

File exists at `/tmp/test-scan-output.json`, parses as valid JSON, and contains the same structure as stdout output (`status`, `surfaces`, `summary` fields).

## Failure Triage

- If the file is not created: check file write permissions and path resolution in the `--output` handler
- If JSON is invalid: inspect the serialization logic for unescaped characters or truncated output
- If structure differs from stdout: verify the `--output` code path serializes the same result object as the stdout code path
- If the file is empty: verify that results are being passed to the file writer, not only to stdout

## Evidence Template

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste relevant output]
```
