# 01--retrieval

- Total: 16
- PASS: 3
- FAIL: 0
- SKIP: 0
- UNAUTOMATABLE: 13

## PASS Scenarios

- `EX-001` | status: PASS | handler calls: `session_resume({"specFolder": "specs/001-manual-fixture-auth-resume"})`; `memory_context({"includeContent": true, "input": "fix flaky index scan retry logic", "mode": "resume", "specFolder": "specs/001-manual-fixture-auth-resume"})`; `memory_context({"input": "fix flaky index scan retry logic", "mode": "focused"})`
- `EX-002` | status: PASS | handler calls: `memory_search({"bypassCache": true, "limit": 20, "query": "checkpoint restore clearExisting transaction rollback"})`; `memory_search({"limit": 20, "query": "checkpoint restore clearExisting transaction rollback"})`
- `EX-005` | status: PASS | handler calls: `memory_search({"intent": "understand", "limit": 10, "query": "Stage4Invariant score snapshot verifyScoreInvariant", "specFolder": "specs/001-manual-fixture-auth-resume"})`

## UNAUTOMATABLE Scenarios

- `M-001` | status: UNAUTOMATABLE | handler calls: none | reason: Prose-first operator workflow requires manual/source cross-checks beyond direct handler output.
- `M-002` | status: UNAUTOMATABLE | handler calls: none | reason: Prose-first operator workflow requires manual/source cross-checks beyond direct handler output.
- `EX-003` | status: UNAUTOMATABLE | handler calls: `memory_match_triggers({"include_cognitive": true, "prompt": "Run trigger matching for resume previous session blockers with cognitive=true", "sessionId": "ex003", "specFolder": "specs/001-manual-fixture-auth-resume"})` | reason: Scenario includes shell/source-inspection work that cannot be truthfully executed through direct handlers only.
- `EX-004` | status: UNAUTOMATABLE | handler calls: `memory_search({"bypassCache": true, "includeTrace": true, "limit": 10, "query": "graph rollout trace check"})`; `memory_search({"bypassCache": true, "includeTrace": true, "limit": 10, "query": "graph rollout trace check", "useGraph": false})` | reason: Scenario includes shell/source-inspection work that cannot be truthfully executed through direct handlers only.
- `086` | status: UNAUTOMATABLE | handler calls: none | reason: Scenario depends on shell commands, source inspection, or narrative-only validation.
- `109` | status: UNAUTOMATABLE | handler calls: none | reason: Scenario depends on shell commands, source inspection, or narrative-only validation.
- `142` | status: UNAUTOMATABLE | handler calls: `memory_context({"includeTrace": true, "input": "resume previous work on rollout hardening", "mode": "resume"})` | reason: Scenario includes shell/source-inspection work that cannot be truthfully executed through direct handlers only.
- `143` | status: UNAUTOMATABLE | handler calls: `memory_search({"includeTrace": true, "limit": 10, "query": "graph diagnostics stable ordering"})` | reason: Scenario includes shell/source-inspection work that cannot be truthfully executed through direct handlers only.
- `185` | status: UNAUTOMATABLE | handler calls: none | reason: Slash command does not have a direct handler-equivalent contract in this runner.
- `187` | status: UNAUTOMATABLE | handler calls: `memory_quick_search({"query": "authentication"})`; `memory_quick_search({"query": "authentication", "specFolder": "specs/specs/001-manual-fixture-auth-resume"})`; `memory_quick_search({"limit": 3, "query": "authentication"})`; `memory_quick_search({"query": "authentication", "tenantId": "tenant-1"})` | reason: Scenario includes shell/source-inspection work that cannot be truthfully executed through direct handlers only.
- `188` | status: UNAUTOMATABLE | handler calls: none | reason: Scenario includes shell/source-inspection work that cannot be truthfully executed through direct handlers only.
- `189` | status: UNAUTOMATABLE | handler calls: none | reason: Scenario includes shell/source-inspection work that cannot be truthfully executed through direct handlers only.
- `190` | status: UNAUTOMATABLE | handler calls: `session_resume({"specFolder": "specs/001-manual-fixture-auth-resume"})` | reason: Scenario includes shell/source-inspection work that cannot be truthfully executed through direct handlers only.
