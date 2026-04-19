# Deep Review Findings

## Review Scope

- **Target packet:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/002-manual-testing-playbook`
- **Corpus read:** all packet `.md` and `.json` files plus all 25 playbook markdown files under `.opencode/skill/skill-advisor/manual_testing_playbook/`
- **Iterations run:** 10
- **Dimensions:** correctness, completeness, consistency, evidence-quality, path-accuracy, template-compliance, cross-reference-integrity, metadata-quality, scope-alignment, actionability

## Summary

- **Verdict:** CONDITIONAL
- **P0:** 0
- **P1:** 4
- **P2:** 3
- **Verified clean checks:** 25 playbook files exist on disk; 24/24 scenario files use the 5-section snippet shape; 24/24 scenario files contain RCAF prompts in both sections 2 and 3; root relative links and snippet `Feature file path` metadata resolve.

## Findings Registry

| ID | Severity | Dimensions | Finding | Evidence | Recommended fix |
|---|---|---|---|---|---|
| P1-01 | P1 | consistency, path-accuracy | The packet still encodes the retired path policy. `spec.md`, `plan.md`, and `checklist.md` say the package should remove `scripts/` references and use only `skill-advisor/`, but the live runtime paths are under `skill-advisor/scripts/`. | [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/002-manual-testing-playbook/spec.md:75,130-132`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/002-manual-testing-playbook/plan.md:113`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/002-manual-testing-playbook/checklist.md:56-69`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/002-manual-testing-playbook/tasks.md:77`] | Rewrite packet acceptance criteria to require `skill-advisor/scripts/` paths, not the pre-migration `skill-advisor/` wording. |
| P1-02 | P1 | path-accuracy, consistency, actionability | All 8 routing-accuracy snippets still embed bare `skill_advisor.py` / `skill-graph.json` references in operator prompts or failure triage, while the executable command blocks already use `.opencode/skill/skill-advisor/scripts/...`. This leaves the most user-facing category only partially migrated. | [SOURCE: `.opencode/skill/skill-advisor/manual_testing_playbook/01--routing-accuracy/001-git-routing.md:28,38,42-44,61`] [SOURCE: `.opencode/skill/skill-advisor/manual_testing_playbook/01--routing-accuracy/006-deep-review-routing.md:28,38,42,59`] [SOURCE: `.opencode/skill/skill-advisor/manual_testing_playbook/01--routing-accuracy/008-semantic-search-routing.md:28,38,42-44`] | Update prompt and triage prose in all `01--routing-accuracy/*.md` files so every path mention matches the command blocks. |
| P1-03 | P1 | cross-reference-integrity, evidence-quality | The root playbook claims that Skill Advisor does not ship a dedicated `feature_catalog/` package, but the repository contains a live `feature_catalog/feature_catalog.md` and supporting feature docs. The cross-reference index is therefore stale and misstates available evidence. | [SOURCE: `.opencode/skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:241-245`] [SOURCE: `.opencode/skill/skill-advisor/feature_catalog/feature_catalog.md:1-24`] | Replace the catalog-gap statement with real links into the existing feature catalog, or explicitly scope why the playbook intentionally ignores it. |
| P1-04 | P1 | completeness, template-compliance | The requested “all 25 playbook files use the 5-section/RCAF contract” check fails at the root file. The 24 scenario snippets follow the snippet template, but `manual_testing_playbook.md` is a multi-section operator guide with 12 numbered content sections plus a TOC rather than a 5-section snippet. | [SOURCE: `.opencode/skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:25-38`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/002-manual-testing-playbook/spec.md:74,124-132`] | Either narrow the acceptance language to “24 scenario files + 1 root operator guide” or refactor the root file to a 5-section contract if uniformity is truly required. |
| P2-01 | P2 | scope-alignment, completeness | Verification scope is narrower than the real corpus. The packet explicitly treats `01--routing-accuracy` as out of scope and measures success against “all 16 snippets,” even though the live playbook corpus contains 24 scenario files plus the root guide. | [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/002-manual-testing-playbook/spec.md:70-81,122-132`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/002-manual-testing-playbook/tasks.md:77-79`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/002-manual-testing-playbook/description.json:2-4`] | Expand verification language so auditors can tell whether the packet is validating only the rewritten subset or the full playbook package. |
| P2-02 | P2 | metadata-quality, consistency | Packet metadata understates progress. `graph-metadata.json` still says `planned`, while the spec is `In Progress` and the task list records the root rewrite plus both verification tasks for the 16 rewritten snippets as complete. | [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/002-manual-testing-playbook/graph-metadata.json:1-6`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/002-manual-testing-playbook/spec.md:38-43`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/002-manual-testing-playbook/tasks.md:69-79`] | Refresh packet metadata so search/index surfaces reflect actual execution state. |
| P2-03 | P2 | evidence-quality, actionability | The remediation trail is incomplete. T018 only names `skill-advisor/skill_advisor.py` migration, but the live drift also includes bare `skill-graph.json` references and multiple prompt/triage surfaces across the routing-accuracy set. | [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/002-manual-testing-playbook/tasks.md:77`] [SOURCE: `.opencode/skill/skill-advisor/manual_testing_playbook/01--routing-accuracy/001-git-routing.md:28,38,61`] [SOURCE: `.opencode/skill/skill-advisor/manual_testing_playbook/01--routing-accuracy/006-deep-review-routing.md:28,38,59`] | Broaden T018 into an explicit “normalize every path mention in 01--routing-accuracy prompts, commands, and triage” task. |

## Iteration Log

### Iteration 1 — Correctness

- No P0 correctness defect found in the scenario command blocks. The audited snippets point at live `skill-advisor/scripts/` commands and their source-metadata file paths resolve.

### Iteration 2 — Completeness

- Logged **P1-04**: root file does not satisfy the same 5-section contract as the 24 scenario snippets.
- Logged **P2-01**: packet success criteria only measure the rewritten 16-file subset, not the full 25-file playbook package.

### Iteration 3 — Consistency

- Logged **P1-01**: packet docs disagree with the live runtime path policy and with T018.

### Iteration 4 — Evidence Quality

- Logged **P1-03**: root cross-reference section makes a false claim about catalog availability.
- Logged **P2-03**: remediation evidence/tasking is too narrow for the remaining drift surface.

### Iteration 5 — Path Accuracy

- Logged **P1-02**: all 8 routing-accuracy files still contain bare path mentions in prompts and/or failure triage.

### Iteration 6 — Template Compliance

- Reconfirmed that the 24 scenario snippets are template-compliant, while the root file intentionally follows a different structure; no additional finding beyond **P1-04**.

### Iteration 7 — Cross-Reference Integrity

- Reconfirmed that root relative links and snippet `Feature file path` metadata resolve.
- Reconfirmed **P1-03** as the only material cross-reference break.

### Iteration 8 — Metadata Quality

- Logged **P2-02**: packet metadata status is stale relative to the packet’s own task/spec state.

### Iteration 9 — Scope Alignment

- Reconfirmed **P2-01**: packet language still scopes verification to 16 rewritten snippets and explicitly excludes `01--routing-accuracy`, which is where the remaining path drift lives.

### Iteration 10 — Actionability

- Reconfirmed **P2-03**: the open remediation task is not specific enough to close the remaining audit gaps in one pass.

## Final Assessment

The playbook corpus is structurally close to done: all 25 files exist, the 24 scenario snippets are consistently formatted, and the root guide links cleanly. The remaining blockers are documentation-state blockers, not missing files: retired path policy still exists in the packet, routing-accuracy prose is only partially migrated, the root cross-reference index is stale, and packet metadata/scope language do not accurately describe what is on disk.
