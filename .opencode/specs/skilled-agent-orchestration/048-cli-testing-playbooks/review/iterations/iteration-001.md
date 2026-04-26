---
title: "Iteration 001 — Correctness Review"
description: "Correctness audit of the five cli-* manual testing playbooks and spec 048 Level 3 documentation."
---

# Iteration 001: Correctness Review

## Metadata
- Dimension: correctness
- Executor: cli-copilot/gpt-5.5/high
- Files inspected: 126
- Spot-checks per playbook: 5

## Findings

### P0 (Blockers)

- [P0] [.opencode/specs/skilled-agent-orchestration/048-cli-testing-playbooks/spec.md:142] Spec-folder strict validation is failing even though SC-004 requires `validate.sh ... --strict` to exit 0. The run reports `RESULT: FAILED`, 20 `SPEC_DOC_INTEGRITY` issues, missing `TEMPLATE_SOURCE` headers in 5 files, and template-header deviations. Remediation: make strict validation pass before release, or explicitly update the success criterion and checklist to a supported non-strict contract with an accepted waiver.
- [P0] [.opencode/skill/cli-claude-code/manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md:28] The requested root invariant says every root playbook has 10 numbered all-caps H2 sections plus TOC/frontmatter, but the five roots have 15, 16, 16, 14, and 17 numbered H2s respectively. Remediation: either collapse variable category H2s under a single category section to satisfy the 10-section scaffold, or amend the invariant/spec to state that category sections expand the base scaffold.
- [P0] [.opencode/skill/cli-claude-code/manual_testing_playbook/02--permission-modes/001-plan-mode-read-only-enforcement.md:49] `CC-005` does not preserve the 9-column scenario row: the row parses as 10 unescaped-pipe columns because the `grep -E '(Edit|Write) tool'` command contains an unescaped `|` inside a table cell. Remediation: escape the pipe as `Edit\|Write`, avoid pipe alternation, or move the command out of the table cell.
- [P0] [.opencode/skill/cli-codex/manual_testing_playbook/01--cli-invocation/001-default-invocation.md:48] The cli-codex per-feature table contract is systemically broken: 24 of 25 scenario rows parse as more or fewer than 9 unescaped-pipe columns (sample `CX-001` parses as 14 columns). Remediation: escape all literal shell/regex pipes in table cells across the affected `CX-*` files, then rerun the 9-column parser.
- [P0] [.opencode/skill/cli-copilot/manual_testing_playbook/04--agent-routing/003-mid-session-model-switch.md:49] The cli-copilot per-feature table contract is systemically broken: 19 of 21 scenario rows parse as more or fewer than 9 unescaped-pipe columns (sample `CP-012` parses as 21 columns). Remediation: escape all literal shell/regex pipes in table cells across the affected `CP-*` files, then rerun the 9-column parser.
- [P0] [.opencode/skill/cli-gemini/manual_testing_playbook/03--built-in-tools/001-google-web-search-grounding.md:48] The cli-gemini per-feature table contract is partially broken: 7 of 18 scenario rows parse as more than 9 unescaped-pipe columns (sample `CG-006` parses as 11 columns). Remediation: escape all literal shell/regex pipes in table cells across the affected `CG-*` files, then rerun the 9-column parser.

### P1 (Required)

None

### P2 (Suggestions)

None

## Evidence

Commands run:

```bash
python3 .opencode/skill/sk-doc/scripts/validate_document.py <root-playbook>
python3 .opencode/skill/sk-doc/scripts/validate_document.py <spec-doc>
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/048-cli-testing-playbooks --strict
grep -Ec '^## [0-9]+\. ' <root-playbook>
find <5 playbook roots> \( -name review_protocol.md -o -name subagent_utilization_ledger.md -o -name snippets \) -print
python3 - <<'PY'
# Parsed root feature-index links, per-feature frontmatter/H2 scaffolds,
# 9-column scenario rows, non-empty Exact Prompt/Command Sequence cells,
# and 2+ Failure Triage steps.
PY
```

Relevant output snippets:

```text
== root validators ==
✅ VALID: .opencode/skill/cli-claude-code/manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md
Total issues: 0
✅ VALID: .opencode/skill/cli-codex/manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md
Total issues: 0
✅ VALID: .opencode/skill/cli-copilot/manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md
Total issues: 0
✅ VALID: .opencode/skill/cli-gemini/manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md
Total issues: 0
✅ VALID: .opencode/skill/cli-opencode/manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md
Total issues: 0

== spec document validators ==
spec.md / plan.md / tasks.md / checklist.md / decision-record.md / implementation-summary.md:
✅ VALID
Total issues: 0

== spec strict validation ==
✗ SPEC_DOC_INTEGRITY: 20 spec documentation integrity issue(s) found
✗ TEMPLATE_SOURCE: Template source header missing in 5 file(s)
✗ TEMPLATE_HEADERS: 5 structural template deviation(s) found in 6 file(s)
  RESULT: FAILED
```

```text
== root H2 counts + cross CLI invariant dirs ==
.opencode/skill/cli-claude-code/manual_testing_playbook: H2 numbered count: 15
.opencode/skill/cli-codex/manual_testing_playbook: H2 numbered count: 16
.opencode/skill/cli-copilot/manual_testing_playbook: H2 numbered count: 16
.opencode/skill/cli-gemini/manual_testing_playbook: H2 numbered count: 14
.opencode/skill/cli-opencode/manual_testing_playbook: H2 numbered count: 17
OK 01--cli-invocation
OK 06--integration-patterns
OK 07--prompt-templates
```

```text
== root feature index list counts ==
.opencode/skill/cli-claude-code/manual_testing_playbook: files=20 index_entries=20 broken_links=0
.opencode/skill/cli-codex/manual_testing_playbook: files=25 index_entries=25 broken_links=0
.opencode/skill/cli-copilot/manual_testing_playbook: files=21 index_entries=21 broken_links=0
.opencode/skill/cli-gemini/manual_testing_playbook: files=18 index_entries=18 broken_links=0
.opencode/skill/cli-opencode/manual_testing_playbook: files=31 index_entries=31 broken_links=0

== forbidden sidecars ==
# no output
```

```text
== per-feature table column counts using unescaped-pipe parser ==
.opencode/skill/cli-claude-code/manual_testing_playbook {'files': 20, 'bad_rows': 1, 'bad_files': 1, 'missing_header': 0, 'frontmatter': 0, 'section': 0, 'triage': 0, 'prompt_cmd': 0}
.opencode/skill/cli-codex/manual_testing_playbook {'files': 25, 'bad_rows': 24, 'bad_files': 24, 'missing_header': 0, 'frontmatter': 0, 'section': 0, 'triage': 0, 'prompt_cmd': 0}
.opencode/skill/cli-copilot/manual_testing_playbook {'files': 21, 'bad_rows': 19, 'bad_files': 19, 'missing_header': 0, 'frontmatter': 0, 'section': 0, 'triage': 0, 'prompt_cmd': 0}
.opencode/skill/cli-gemini/manual_testing_playbook {'files': 18, 'bad_rows': 7, 'bad_files': 7, 'missing_header': 0, 'frontmatter': 0, 'section': 0, 'triage': 0, 'prompt_cmd': 0}
.opencode/skill/cli-opencode/manual_testing_playbook {'files': 31, 'bad_rows': 0, 'bad_files': 0, 'missing_header': 0, 'frontmatter': 0, 'section': 0, 'triage': 0, 'prompt_cmd': 0}
total_issues 51
```

Representative bad rows:

```text
.opencode/skill/cli-claude-code/manual_testing_playbook/02--permission-modes/001-plan-mode-read-only-enforcement.md:49: columns=10
.opencode/skill/cli-codex/manual_testing_playbook/01--cli-invocation/001-default-invocation.md:48: columns=14
.opencode/skill/cli-copilot/manual_testing_playbook/04--agent-routing/003-mid-session-model-switch.md:49: columns=21
.opencode/skill/cli-gemini/manual_testing_playbook/03--built-in-tools/001-google-web-search-grounding.md:48: columns=11
```

Spot-check files read directly during review included:

```text
.opencode/skill/cli-claude-code/manual_testing_playbook/01--cli-invocation/001-base-non-interactive-invocation.md
.opencode/skill/cli-claude-code/manual_testing_playbook/02--permission-modes/001-plan-mode-read-only-enforcement.md
.opencode/skill/cli-codex/manual_testing_playbook/01--cli-invocation/001-default-invocation.md
.opencode/skill/cli-copilot/manual_testing_playbook/04--agent-routing/003-mid-session-model-switch.md
.opencode/skill/cli-gemini/manual_testing_playbook/01--cli-invocation/001-direct-prompt-text-output.md
.opencode/skill/cli-opencode/manual_testing_playbook/01--cli-invocation/001-base-non-interactive-invocation.md
```

## newFindingsRatio
1.0

## Convergence Signal
Correctness review should continue. The main blocker class is already clear (invalid 9-column table rows caused by unescaped table-cell pipes), but further correctness iterations would likely uncover additional concrete row-level instances and should verify the repaired table cells after remediation. Root link integrity, ID-count parity, forbidden-sidecar checks, frontmatter, required per-feature H2 scaffolds, non-empty prompt/command cells, and 2+ triage-step checks were clean in this pass.
