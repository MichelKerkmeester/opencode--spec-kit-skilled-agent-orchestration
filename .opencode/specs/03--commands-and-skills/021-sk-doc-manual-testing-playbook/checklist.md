# Checklist: Manual Testing Playbook Template

## P0 - Critical

- [ ] Template file exists at `assets/documentation/manual_testing_playbook_template.md`
- [ ] Template has YAML frontmatter (title + description)
- [ ] Template has 10 anchored sections (overview through related-resources)
- [ ] `template_rules.json` parses clean (`python3 -c "import json; json.load(open(...))"`)
- [ ] `template_rules.json` has `playbook` document type entry
- [ ] SKILL.md Section 1 includes playbook use case
- [ ] SKILL.md Section 2 includes PLAYBOOK intent with keywords

## P1 - Important

- [ ] Main playbook scaffold includes 9-column table format
- [ ] Main playbook scaffold includes TOC, preconditions, evidence requirements, command notation
- [ ] Review protocol scaffold includes scenario/feature verdict rules and release readiness
- [ ] Subagent ledger scaffold includes wave planning table and operational rules
- [ ] Placeholder variables are documented with examples
- [ ] Evidence and verdict patterns section included

## P2 - Nice to Have

- [ ] Template references both existing playbooks as examples
- [ ] Playbook checklist section included for pre-release validation
- [ ] Coverage check script uses parametric `{FEATURE_ID_PATTERN}`
