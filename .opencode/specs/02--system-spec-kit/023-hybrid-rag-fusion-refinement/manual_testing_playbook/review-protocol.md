# Main-Agent Review Protocol (Merged)

## Inputs Required
1. `manual-test-playbooks.md`
2. Scenario execution evidence (logs, tool outputs, artifacts)
3. Feature-to-scenario coverage map
4. Triage notes for all non-pass outcomes

## Scenario Acceptance Rules
For each executed scenario, check:
1. Preconditions were satisfied.
2. Prompt and command sequence were executed as written.
3. Expected signals are present.
4. Evidence is complete and readable.
5. Outcome rationale is explicit.

Scenario verdict:
- `PASS`: all acceptance checks true
- `PARTIAL`: core behavior works but non-critical evidence or metadata is incomplete
- `FAIL`: expected behavior missing, contradictory output, or critical check failed

## Feature Verdict Rules
- `PASS`: all mapped scenarios for feature are `PASS`
- `PARTIAL`: at least one mapped scenario is `PARTIAL`, none are `FAIL`
- `FAIL`: any mapped scenario is `FAIL`

Hard rule:
- Any critical-path scenario `FAIL` forces feature verdict to `FAIL`.

## Release Readiness Rule
Release is `READY` only when:
1. No feature verdict is `FAIL`.
2. All critical scenarios are `PASS`.
3. Coverage remains 128/128.
4. No unresolved blocking triage item remains.

Otherwise release is `NOT READY`.

## Memory/Spec-Kit Mandatory Flows
### Context recovery and continuation
- `/memory:continue specs/<target-spec>`
- `memory_search({ query: "state next-steps blockers decisions", specFolder: "specs/<target-spec>", anchors: ["state", "next-steps", "blockers", "decisions"] })`

### Targeted lookup
- `memory_search({ query: "<specific decision rationale>", specFolder: "specs/<target-spec>", anchors: ["decision-record", "rationale"] })`

### Save + index update
- `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js specs/<target-spec>`
- `memory_index_scan({ specFolder: "specs/<target-spec>" })`

### Review handoff
- `@review findings-first review with severity ranking and final verdict`
