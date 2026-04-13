# Deep Review Findings: Repo-Wide Path Migration

## Scope and execution

- Target packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/005-repo-wide-path-migration/`
- Reviewed all packet `*.md` and `*.json` files.
- Ran required commands:
  - `python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py --health` -> PASS (`status: ok`, `skills_found: 20`, `command_bridges_found: 10`)
  - `python3 .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py --validate-only` -> PASS (`VALIDATION PASSED` with 2 non-failing zero-edge warnings)
- Ran supporting verification:
  - `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .../005-repo-wide-path-migration --strict` -> PASS
  - `python3 .opencode/skill/skill-advisor/scripts/skill_advisor_regression.py --dataset .opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl` -> PASS (`44/44`)
  - Active-spec and README stale-path sweeps -> FAIL

## Verdict

**FAIL**. The packet is structurally valid and the runtime checks pass, but the closeout claim is not currently true: active 007 packet docs still contain retired path literals, and README cleanup is still incomplete.

## Active finding registry

| ID | Severity | Dimensions | Summary |
|---|---|---|---|
| F001 | P0 | correctness, consistency, path-accuracy, cross-reference-integrity | The packet claims the broader `007-skill-advisor-graph/` tree has zero stale legacy-path literals, but the current sweep still finds retired `skill-advisor/*.py` and fixture paths across 7 active 007 docs. This directly contradicts REQ-004, CHK-023, and the implementation summary closeout claim. |
| F002 | P1 | completeness, path-accuracy, scope-alignment | Repo-wide README cleanup is incomplete: two README surfaces still instruct the retired `.opencode/skill/scripts/skill_advisor.py` path, so `description.json` overstates repo-wide migration closure. |
| F003 | P2 | metadata-quality, actionability | The packet is marked complete everywhere, but all spec docs still leave `closed_by_commit: TBD`, so closeout metadata remains partially unresolved. |

### F001 - P0

The packet's own acceptance contract requires zero stale literals anywhere under the broader `007-skill-advisor-graph/` tree, and the checklist plus implementation summary both say that condition was satisfied. Current repo state disproves that claim. Active 007 docs still carry retired path literals in packet state, task notes, and handover content.  
[SOURCE: spec.md:113-117; checklist.md:65-68; implementation-summary.md:84-88; ../002-manual-testing-playbook/spec.md:17-18; ../002-manual-testing-playbook/tasks.md:77-77; ../003-skill-advisor-packaging/spec.md:17-18; ../003-skill-advisor-packaging/tasks.md:90-92; ../001-research-findings-fixes/spec.md:133-142; ../001-research-findings-fixes/implementation-summary.md:82-91; ../handover.md:44-55]

### F002 - P1

The packet description says Phase 005 closes stale legacy references across playbooks, READMEs, spec folders, and changelog notes, but README cleanup is still incomplete. The install guide and `sk-code-web` README still point to the retired `.opencode/skill/scripts/skill_advisor.py` entrypoint.  
[SOURCE: description.json:2-3; ../../../../../install_guides/README.md:1150-1155; ../../../../../install_guides/README.md:1221-1226; ../../../../../skill/sk-code-web/README.md:358-360]

### F003 - P2

Every packet doc reports `status: complete`, but each frontmatter block still leaves `closed_by_commit: TBD`. That does not block validation, but it weakens metadata quality and makes closeout provenance less actionable than the rest of the packet suggests.  
[SOURCE: spec.md:10-12; plan.md:10-11; tasks.md:10-11; checklist.md:10-11; decision-record.md:10-11; implementation-summary.md:10-11,94-97]

## 10-iteration review log

### Iteration 1 - Correctness

- **New finding:** F001 (P0)
- The packet's closeout claim is false under current repo state because active 007 docs still contain retired literals.  
  [SOURCE: spec.md:113-117; checklist.md:65-68; implementation-summary.md:84-88; ../handover.md:44-55]

### Iteration 2 - Completeness

- **New finding:** F002 (P1)
- Repo-wide cleanup is incomplete because README surfaces still reference the retired entrypoint.  
  [SOURCE: description.json:2-3; ../../../../../install_guides/README.md:1150-1155; ../../../../../skill/sk-code-web/README.md:358-360]

### Iteration 3 - Consistency

- **No new finding**
- The same contradiction appears consistently across requirements, checklist evidence, and summary text, reinforcing F001 rather than creating a separate defect.  
  [SOURCE: spec.md:113-117; checklist.md:65-68; implementation-summary.md:84-88]

### Iteration 4 - Evidence Quality

- **No new finding**
- Command-backed evidence for health, compiler validation, regression, and strict packet validation reproduced successfully during this review. The evidence-quality problem is limited to the stale-path cleanup claim already captured in F001/F002.

### Iteration 5 - Path Accuracy

- **No new finding**
- The stale-path sweep confirmed active 007 hits in 7 files and README hits in 2 files, so the path-migration cleanup is incomplete even though the current runtime paths themselves are healthy.

### Iteration 6 - Template Compliance

- **No new finding**
- Strict packet validation passed with 0 errors and 0 warnings, so the packet is template-compliant despite the inaccurate closeout claims.

### Iteration 7 - Cross-Reference Integrity

- **No new finding**
- Packet-local references resolve cleanly under strict validation. The integrity issue is semantic rather than syntactic: cross-packet active docs still preserve retired literals, which sustains F001.  
  [SOURCE: ../002-manual-testing-playbook/spec.md:17-18; ../003-skill-advisor-packaging/spec.md:17-18]

### Iteration 8 - Metadata Quality

- **New finding:** F003 (P2)
- Completion metadata is only partially resolved because `closed_by_commit` is still unset across all six packet docs.  
  [SOURCE: spec.md:10-12; plan.md:10-11; tasks.md:10-11; checklist.md:10-11; decision-record.md:10-11; implementation-summary.md:10-11,94-97]

### Iteration 9 - Scope Alignment

- **No new finding**
- Packet-local edit scope is documented narrowly, but the packet also claims repo-wide cleanup completion. That broader claim is what fails, so this iteration reinforces F002 instead of adding a new issue.  
  [SOURCE: spec.md:77-88; description.json:2-3]

### Iteration 10 - Actionability

- **No new finding**
- Remediation is straightforward: remove retired literals from the 7 active 007 docs, update the 2 README surfaces, rerun the stale-path sweeps, and then replace `closed_by_commit: TBD` once the closeout commit exists.

## Commands and current status

| Check | Result | Review assessment |
|---|---|---|
| `skill_advisor.py --health` | PASS | Runtime entrypoint is healthy |
| `skill_graph_compiler.py --validate-only` | PASS | Metadata valid; zero-edge warnings are non-blocking |
| `validate.sh ... --strict` | PASS | Packet structure and links are valid |
| `skill_advisor_regression.py --dataset ...` | PASS | Regression surface matches packet claims |
| Active 007 stale-path sweep | FAIL | Blocks closeout truthfulness (F001) |
| README stale-path sweep | FAIL | Leaves repo-wide cleanup incomplete (F002) |

## Recommended remediation order

1. Fix the 7 active 007 docs still carrying retired literals.
2. Fix the 2 README files still pointing at `.opencode/skill/scripts/skill_advisor.py`.
3. Rerun the stale-path sweeps and update the packet evidence.
4. Replace `closed_by_commit: TBD` after the closing commit exists.
