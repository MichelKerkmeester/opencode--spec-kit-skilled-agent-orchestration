# CFG-002 -- Project settings inspection

## 1. OVERVIEW

This scenario validates Project settings inspection for `CFG-002`. It focuses on Verify project settings contain language extension patterns.

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `CFG-002` and confirm the expected signals without contradictory evidence.

- Objective: Verify project settings contain language extension patterns
- Prompt: `Inspect the CocoIndex Code project settings for language coverage`
- Expected signals: `include_patterns` field present; contains patterns covering multiple language extensions (e.g., `*.py`, `*.ts`, `*.js`, `*.go`, `*.rs`, etc.)
- Pass/fail: PASS if `include_patterns` contains patterns for 28+ language extensions (matching supported languages list); PARTIAL if patterns present but fewer than 28; FAIL if `include_patterns` missing

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CFG-002 | Project settings inspection | Verify project settings contain language extension patterns | `Inspect the CocoIndex Code project settings for language coverage` | 1. `bash: cat .cocoindex_code/settings.yml` -> 2. Locate `include_patterns` field -> 3. Count unique file extension patterns | `include_patterns` field present; contains patterns covering multiple language extensions (e.g., `*.py`, `*.ts`, `*.js`, `*.go`, `*.rs`, etc.) | Contents of `settings.yml` with include_patterns section; count of extension patterns | PASS if `include_patterns` contains patterns for 28+ language extensions (matching supported languages list); PARTIAL if patterns present but fewer than 28; FAIL if `include_patterns` missing | Run `ccc init -f` to regenerate defaults; compare against supported languages in tool_reference.md |

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../../manual_testing_playbook.md)

## 5. SOURCE METADATA

- Group: Configuration
- Playbook ID: CFG-002
- Canonical root source: `manual_testing_playbook.md`
- Snippet path: `snippets/03--configuration/002-project-settings-inspection.md`
