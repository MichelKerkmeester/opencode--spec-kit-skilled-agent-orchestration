# 05--lifecycle

- Total: 10
- PASS: 3
- FAIL: 0
- SKIP: 0
- UNAUTOMATABLE: 7

## PASS Scenarios

- `EX-015` | status: PASS | handler calls: `checkpoint_create({"name": "gate-i-checkpoint", "specFolder": "specs/002-test-sandbox"})`; `checkpoint_list({"specFolder": "specs/002-test-sandbox"})`
- `EX-016` | status: PASS | handler calls: `checkpoint_list({"specFolder": "specs/002-test-sandbox"})`
- `EX-018` | status: PASS | handler calls: `checkpoint_list({"specFolder": "002-test-sandbox"})`; `checkpoint_delete({"confirmName": "gate-i-checkpoint", "name": "gate-i-checkpoint"})`; `checkpoint_list({"specFolder": "002-test-sandbox"})`

## UNAUTOMATABLE Scenarios

- `EX-017` | status: UNAUTOMATABLE | handler calls: none | reason: Lifecycle scenario requires checkpoint/async-worker barrier orchestration or restart semantics beyond this direct-handler runner.
- `097` | status: UNAUTOMATABLE | handler calls: none | reason: Lifecycle scenario requires checkpoint/async-worker barrier orchestration or restart semantics beyond this direct-handler runner.
- `100` | status: UNAUTOMATABLE | handler calls: none | reason: Scenario depends on shell commands, source inspection, or narrative-only validation.
- `114` | status: UNAUTOMATABLE | handler calls: none | reason: Lifecycle scenario requires checkpoint/async-worker barrier orchestration or restart semantics beyond this direct-handler runner.
- `124` | status: UNAUTOMATABLE | handler calls: none | reason: Scenario depends on shell commands, source inspection, or narrative-only validation.
- `134` | status: UNAUTOMATABLE | handler calls: none | reason: Scenario depends on shell commands, source inspection, or narrative-only validation.
- `144` | status: UNAUTOMATABLE | handler calls: none | reason: Lifecycle scenario requires checkpoint/async-worker barrier orchestration or restart semantics beyond this direct-handler runner.
