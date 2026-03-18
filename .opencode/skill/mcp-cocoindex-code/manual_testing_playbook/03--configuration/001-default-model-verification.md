# CFG-001 -- Default model verification

## 1. OVERVIEW

This scenario validates Default model verification for `CFG-001`. It focuses on Verify global settings contain the documented default embedding model.

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `CFG-001` and confirm the expected signals without contradictory evidence.

- Objective: Verify global settings contain the documented default embedding model
- Prompt: `Check the CocoIndex Code global settings for the embedding model`
- Expected signals: Settings file exists; `embedding.model` is one of the documented models: `all-MiniLM-L6-v2` (local) or a LiteLLM model like `voyage/voyage-code-3`
- Pass/fail: PASS if embedding model field exists and matches a documented model; FAIL if file missing or model field absent

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CFG-001 | Default model verification | Verify global settings contain the documented default embedding model | `Check the CocoIndex Code global settings for the embedding model` | 1. `bash: cat ~/.cocoindex_code/global_settings.yml` -> 2. Locate `embedding.provider` and `embedding.model` fields | Settings file exists; `embedding.model` is one of the documented models: `all-MiniLM-L6-v2` (local) or a LiteLLM model like `voyage/voyage-code-3` | Contents of `global_settings.yml` with embedding fields highlighted | PASS if embedding model field exists and matches a documented model; FAIL if file missing or model field absent | Check `COCOINDEX_CODE_DIR` env var; verify `~/.cocoindex_code/` directory exists; run `ccc init` if needed |

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../../manual_testing_playbook.md)

## 5. SOURCE METADATA

- Group: Configuration
- Playbook ID: CFG-001
- Canonical root source: `manual_testing_playbook.md`
- Snippet path: `snippets/03--configuration/001-default-model-verification.md`
