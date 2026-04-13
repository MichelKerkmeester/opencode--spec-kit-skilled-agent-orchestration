# 02--mutation

- Total: 11
- PASS: 5
- FAIL: 0
- SKIP: 0
- UNAUTOMATABLE: 6

## PASS Scenarios

- `EX-006` | status: PASS | handler calls: `memory_save({"asyncEmbedding": true, "filePath": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/.tmp/gate-i-manual-playbook-PospIR/specs/001-manual-fixture-auth-resume/decision-record.md", "skipPreflight": true})`; `memory_stats({"limit": 10})`; `memory_search({"limit": 10, "query": "Save a spec doc and report action", "specFolder": "specs/001-manual-fixture-auth-resume"})`
- `EX-007` | status: PASS | handler calls: `memory_update({"allowPartialUpdate": true, "id": 1, "title": "Checkpoint Rollback Runbook Updated", "triggerPhrases": ["checkpoint rollback", "clearExisting transaction rollback"]})`; `memory_search({"limit": 10, "query": "Update memory title and triggers", "specFolder": "specs/001-manual-fixture-auth-resume"})`
- `EX-008` | status: PASS | handler calls: `checkpoint_create({"name": "pre-ex008-delete", "specFolder": "002-test-sandbox"})`; `memory_delete({"confirm": true, "id": 1})`; `memory_search({"limit": 10, "query": "Checkpoint Rollback Runbook", "specFolder": "specs/001-manual-fixture-auth-resume"})`
- `EX-009` | status: PASS | handler calls: `checkpoint_create({"name": "pre-ex009-bulk-delete", "specFolder": "002-test-sandbox"})`; `memory_bulk_delete({"confirm": true, "specFolder": "002-test-sandbox", "tier": "temporary"})`; `checkpoint_list({"specFolder": "002-test-sandbox"})`
- `EX-010` | status: PASS | handler calls: `memory_validate({"helpful": true, "id": 1, "resultRank": 1, "totalResultsShown": 5, "wasUseful": true})`

## UNAUTOMATABLE Scenarios

- `M-008` | status: UNAUTOMATABLE | handler calls: none | reason: Prose-first operator workflow requires manual/source cross-checks beyond direct handler output.
- `085` | status: UNAUTOMATABLE | handler calls: none | reason: Scenario depends on shell commands, source inspection, or narrative-only validation.
- `101` | status: UNAUTOMATABLE | handler calls: none | reason: Scenario validates MCP schema enforcement, which raw handler calls do not exercise.
- `110` | status: UNAUTOMATABLE | handler calls: none | reason: Scenario depends on shell commands, source inspection, or narrative-only validation.
- `191` | status: UNAUTOMATABLE | handler calls: none | reason: Shared-memory admin lifecycle scenario uses actor-hint narrative flows that need manual scope verification beyond direct handler output.
- `192` | status: UNAUTOMATABLE | handler calls: none | reason: Scenario explicitly requires direct library invocation rather than MCP handler dispatch.
