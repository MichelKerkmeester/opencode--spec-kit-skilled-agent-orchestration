# 06--analysis

- Total: 7
- PASS: 6
- FAIL: 0
- SKIP: 0
- UNAUTOMATABLE: 1

## PASS Scenarios

- `EX-020` | status: PASS | handler calls: `memory_causal_stats({})`
- `EX-021` | status: PASS | handler calls: `checkpoint_create({"name": "pre-ex021-causal-unlink", "specFolder": "002-test-sandbox"})`; `memory_causal_unlink({"edgeId": "1"})`; `memory_drift_why({"direction": "both", "maxDepth": 4, "memoryId": "1"})`
- `EX-022` | status: PASS | handler calls: `memory_drift_why({"direction": "both", "maxDepth": 4, "memoryId": "2"})`
- `EX-023` | status: PASS | handler calls: `task_preflight({"contextScore": 72, "knowledgeScore": 70, "specFolder": "specs/001-manual-fixture-auth-resume", "taskId": "pipeline-v2-audit", "uncertaintyScore": 28})`
- `EX-024` | status: PASS | handler calls: `task_postflight({"contextScore": 84, "knowledgeScore": 85, "specFolder": "specs/001-manual-fixture-auth-resume", "taskId": "pipeline-v2-audit", "uncertaintyScore": 18})`
- `EX-025` | status: PASS | handler calls: `memory_get_learning_history({"includeSummary": true, "onlyComplete": true, "specFolder": "specs/001-manual-fixture-auth-resume"})`

## UNAUTOMATABLE Scenarios

- `EX-019` | status: UNAUTOMATABLE | handler calls: `memory_causal_link({"relation": "supports", "sourceId": "1", "strength": 0.8, "targetId": "2"})`; `memory_drift_why({"direction": "both", "maxDepth": 4, "memoryId": "2"})` | reason: Scenario includes shell/source-inspection work that cannot be truthfully executed through direct handlers only.
