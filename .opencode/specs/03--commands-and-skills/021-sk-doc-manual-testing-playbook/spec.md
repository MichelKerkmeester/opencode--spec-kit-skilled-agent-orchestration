# Spec: Manual Testing Playbook Template for sk-doc

## Problem

Two manual testing playbooks exist in the codebase (system-spec-kit with 194 scenarios, mcp-cocoindex-code with 20 scenarios). Both follow an identical 3-file structure and 9-column table format, but were created ad-hoc without a reusable template. Creating new playbooks requires copying and modifying an existing one, which is error-prone.

## Solution

Create a generic manual testing playbook template in sk-doc (`assets/documentation/manual_testing_playbook_template.md`) so any skill can generate a properly formatted playbook. The template covers all 3 files (main playbook, review protocol, subagent utilization ledger) with placeholder variables and copy-paste scaffolds.

## Scope

### In Scope
- Template file with 10 anchored sections covering all 3 playbook files
- Placeholder variable system (`{SKILL_NAME}`, `{SCENARIO_COUNT}`, etc.)
- Copy-paste scaffolds for each of the 3 files
- `template_rules.json` entry for the `playbook` document type
- SKILL.md routing update (PLAYBOOK intent + use case)

### Out of Scope
- Modifications to existing playbooks (system-spec-kit, mcp-cocoindex-code)
- Automated playbook generation scripts
- Validation scripts for playbook format

## Success Criteria
1. Template file exists with frontmatter and 10 anchored sections
2. `template_rules.json` parses clean with `python3 -c "import json; json.load(open('...'))`
3. SKILL.md has PLAYBOOK routing (keyword "playbook" triggers template load)
4. Template scaffolds produce valid markdown when placeholders are filled
