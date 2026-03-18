# CFG-003 -- Status verification

## 1. OVERVIEW

This scenario validates Status verification for `CFG-003`. It focuses on Verify `ccc status` shows indexed file count, chunk count, embedding model, and project root.

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `CFG-003` and confirm the expected signals without contradictory evidence.

- Objective: Verify `ccc status` shows indexed file count, chunk count, embedding model, and project root
- Prompt: `Check the full CocoIndex Code status`
- Expected signals: Output shows numeric file count > 0; numeric chunk count > 0; embedding model name matches `global_settings.yml`; project root matches current directory
- Pass/fail: PASS if all 4 fields present and non-zero/non-empty; PARTIAL if some fields present but others missing; FAIL if status command errors or shows zero counts

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CFG-003 | Status verification | Verify `ccc status` shows indexed file count, chunk count, embedding model, and project root | `Check the full CocoIndex Code status` | 1. `bash: ccc status` -> 2. Verify output contains: file count, chunk count, embedding model name, project root path | Output shows numeric file count > 0; numeric chunk count > 0; embedding model name matches `global_settings.yml`; project root matches current directory | Full `ccc status` output | PASS if all 4 fields present and non-zero/non-empty; PARTIAL if some fields present but others missing; FAIL if status command errors or shows zero counts | Run `ccc index` to populate index; check daemon connectivity; verify `.cocoindex_code/` exists |

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../../manual_testing_playbook.md)

## 5. SOURCE METADATA

- Group: Configuration
- Playbook ID: CFG-003
- Canonical root source: `manual_testing_playbook.md`
- Snippet path: `snippets/03--configuration/003-status-verification.md`
