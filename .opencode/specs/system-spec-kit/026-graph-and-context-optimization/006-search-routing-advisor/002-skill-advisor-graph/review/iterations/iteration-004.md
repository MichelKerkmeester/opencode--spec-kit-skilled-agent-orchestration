# Iteration 004: maintainability

## State Read

- Prior iterations considered: 001-003
- Registry before pass: 6 open finding(s)
- Focus dimension: maintainability

## Scope Reviewed

- spec.md
- plan.md
- tasks.md
- checklist.md
- implementation-summary.md
- description.json
- graph-metadata.json
- handover.md
- memory/13-04-26_18-25__completed-20-iteration-deep-review-via-gpt-5-4.md
- 001-research-findings-fixes/{spec,plan,tasks,checklist,implementation-summary}.md
- 002-manual-testing-playbook/{spec,plan,tasks,checklist,decision-record}.md
- 003-skill-advisor-packaging/{spec,plan,tasks,checklist,decision-record,implementation-summary}.md
- Additional implementation and child packet evidence listed in `deep-review-strategy.md`

## Findings

### F006 [P1] Child phase packets mix planned state, implemented runtime state, and incomplete Level 3 scaffolds

Dimension: maintainability

Evidence:
- Phase 006 says SQLite migration is planned and has unchecked tasks, while the repo contains `skill-graph.sqlite` with 21 nodes and advisor health loads from SQLite.
- Phase 006 is Level 3 but lacks `decision-record.md`; strict validation also reports missing anchors and template sections.
- Phase 008 has feature catalog tasks unchecked while the three target feature_catalog directories and files exist; it also lacks Level 3 decision-record scaffolding.

Impact: Maintainers cannot tell whether these phases are backlog, implemented-but-unclosed, or failed closeout work without re-auditing the repository.

Remediation: Split truly planned work from completed runtime evidence, close implemented phases with required Level 3 docs, and move remaining tasks into explicit follow-up packets.

### F007 [P1] Validation and closeout claims are duplicated with stale command paths and obsolete counts

Dimension: maintainability

Evidence:
- Multiple packet docs still claim 44/44 regression cases; the current regression run passes 104/104 total cases with 24/24 P0 cases.
- Phase 005 claims repo-wide path migration completion, but scoped search still finds `.opencode/skill/skill-advisor/scripts/*` references across root and child docs.
- Several child checklists mark command evidence against paths that are now nonexistent, so the evidence cannot be rerun as written.

Impact: The packet has become expensive to maintain because completion evidence is scattered and stale rather than centralized around the live commands.

Remediation: Create a single current verification block for compiler, health, regression, and path inventory; reference it from child packets instead of repeating mutable command text.


## Dimension Assessment

Child phase ledgers are difficult to maintain because they mix backlog, completed runtime changes, and incomplete spec scaffolds. Validation and command evidence are duplicated across many docs with stale paths and stale counts.

Evidence highlights:
- Phase 006 planned ledger coexists with a real SQLite DB and SQLite-first advisor behavior.
- Phase 008 tasks are unchecked while feature catalog files exist on disk.
- Strict validation reports missing Level 3 decision records and template deviations in child phases.

## Delta

- New finding IDs: F006, F007
- Severity-weighted newFindingsRatio: 0.52
- Convergence note: New material finding(s) keep the loop active.
