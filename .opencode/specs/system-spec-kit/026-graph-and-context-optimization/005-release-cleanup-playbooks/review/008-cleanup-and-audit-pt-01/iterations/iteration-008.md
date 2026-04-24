# Iteration 008

- Timestamp: 2026-04-14T10:03:00.000Z
- Focus dimension: maintainability
- Files reviewed: .opencode/skill/system-spec-kit/manual_testing_playbook/05--lifecycle/097-async-ingestion-job-lifecycle-p0-3.md, .opencode/skill/system-spec-kit/manual_testing_playbook/05--lifecycle/144-advisory-ingest-lifecycle-forecast.md
- Outcome: Found playbook residue that still teaches operators to use specs/<target-spec>/memory/file*.md.

## Findings

### P0
- None.

### P1
- None.

### P2
- F004 - Manual testing playbook still uses retired specs/<target-spec>/memory examples. Lifecycle playbook scenarios 097 and 144 still instruct operators to start ingest jobs with specs/<target-spec>/memory/file*.md paths. Even if compatibility remains, these active playbooks preserve the deprecated surface instead of the canonical spec-document flow. [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/05--lifecycle/097-async-ingestion-job-lifecycle-p0-3.md:19] [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/05--lifecycle/097-async-ingestion-job-lifecycle-p0-3.md:30] [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/05--lifecycle/097-async-ingestion-job-lifecycle-p0-3.md:35] [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/05--lifecycle/144-advisory-ingest-lifecycle-forecast.md:19] [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/05--lifecycle/144-advisory-ingest-lifecycle-forecast.md:30] [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/05--lifecycle/144-advisory-ingest-lifecycle-forecast.md:35]

## Evidence Notes

- Scenario 097 still uses specs/<target-spec>/memory/*.md in prompt, execution, and command text. [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/05--lifecycle/097-async-ingestion-job-lifecycle-p0-3.md:19] [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/05--lifecycle/097-async-ingestion-job-lifecycle-p0-3.md:30] [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/05--lifecycle/097-async-ingestion-job-lifecycle-p0-3.md:35]
- Scenario 144 repeats the same deprecated path pattern. [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/05--lifecycle/144-advisory-ingest-lifecycle-forecast.md:19] [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/05--lifecycle/144-advisory-ingest-lifecycle-forecast.md:30] [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/05--lifecycle/144-advisory-ingest-lifecycle-forecast.md:35]

## State Update

- status: insight
- newInfoRatio: 0.22
- findingsSummary: P0 1, P1 2, P2 1
- findingsNew: P0 0, P1 0, P2 1
- nextFocus: Correctness re-read of test fixtures and index discovery behavior.
