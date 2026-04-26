You are running iteration 1 of a 5-iteration deep review on spec folder `.opencode/specs/skilled-agent-orchestration/048-cli-testing-playbooks/`.

## Iteration 1 Dimension: CORRECTNESS

Audit the structural correctness of the deliverables produced in the recent session:

1. The 5 manual_testing_playbook packages:
   - `.opencode/skill/cli-claude-code/manual_testing_playbook/`
   - `.opencode/skill/cli-codex/manual_testing_playbook/`
   - `.opencode/skill/cli-copilot/manual_testing_playbook/`
   - `.opencode/skill/cli-gemini/manual_testing_playbook/`
   - `.opencode/skill/cli-opencode/manual_testing_playbook/`
2. The Level 3 spec docs at `.opencode/specs/skilled-agent-orchestration/048-cli-testing-playbooks/`

## What to verify (structural correctness)

- Every root playbook has 10 numbered all-caps H2 sections + TOC + frontmatter
- Every per-feature file has the 5 numbered H2 sections (`## 1. OVERVIEW`, `## 2. SCENARIO CONTRACT`, `## 3. TEST EXECUTION`, `## 4. SOURCE FILES`/`REFERENCES`, `## 5. SOURCE METADATA`)
- Every per-feature file has frontmatter (`title` + `description`)
- Every per-feature file has the 9-column scenario table in section 3 (Feature ID | Feature Name | Scenario Name/Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage)
- Feature ID count in root cross-reference index equals per-feature file count for each playbook
- Every per-feature file link in each root playbook resolves to an existing file
- No forbidden sidecar files (`review_protocol.md`, `subagent_utilization_ledger.md`, `snippets/`)
- Each scenario row has Exact Prompt + Exact Command Sequence + 2+ Failure Triage steps
- Cross-CLI invariants: categories `01--cli-invocation`, `06--integration-patterns`, `07--prompt-templates` at canonical positions in all 5 playbooks

## Severity contract

- **P0 (Blocker)**: any structural template violation, validator failure, broken cross-reference, ID-count mismatch, forbidden sidecar present, missing required section, missing 9-column table
- **P1 (Required)**: bad section ordering, missing frontmatter field, weak scaffold field on a single file
- **P2 (Suggestion)**: stylistic inconsistency, redundant scaffolding

## Method

Use Read, Glob, Bash, and Grep extensively. Spot-check 3-5 per-feature files per playbook (not all 115). Run validate_document.py on each root. Verify counts via `find` + `grep`. DO NOT modify any file — read-only review.

## Output (REQUIRED)

Write your findings to `.opencode/specs/skilled-agent-orchestration/048-cli-testing-playbooks/review/iterations/iteration-001.md` using this exact structure:

```markdown
---
title: "Iteration 001 — Correctness Review"
description: "..."
---

# Iteration 001: Correctness Review

## Metadata
- Dimension: correctness
- Executor: cli-copilot/gpt-5.5/high
- Files inspected: <count>
- Spot-checks per playbook: <count>

## Findings

### P0 (Blockers)
<list — or "None">

### P1 (Required)
<list — or "None">

### P2 (Suggestions)
<list — or "None">

## Evidence
<bash commands run + their relevant output snippets>

## newFindingsRatio
<number — proportion of findings new to this iteration; 1.0 since first iter>

## Convergence Signal
<your read of whether further correctness review would yield more findings>
```

For every finding, include: `[severity] [feature-id-or-file:line] description + remediation`.

Be aggressive — surface real issues. Do not paper over problems. The audit just claimed everything passes; verify or refute that claim.
