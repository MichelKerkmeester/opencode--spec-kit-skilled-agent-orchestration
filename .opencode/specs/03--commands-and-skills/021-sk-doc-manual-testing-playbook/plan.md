# Plan: Manual Testing Playbook Template

## Approach

Analyze both existing playbooks to extract the common structure, then create a single template file that captures all patterns with placeholder variables.

## Steps

1. **Analyze existing playbooks** - Read both system-spec-kit and mcp-cocoindex-code playbooks to identify the shared structure (3 files, 9-column format, TOC pattern, preconditions, evidence requirements)
2. **Create template file** - Write `manual_testing_playbook_template.md` in `assets/documentation/` with 10 anchored sections covering the main playbook scaffold, review protocol scaffold, and subagent ledger scaffold
3. **Update template_rules.json** - Add `playbook` document type with required/recommended sections and validation flags
4. **Update SKILL.md routing** - Add PLAYBOOK intent to smart routing and playbook use case to Section 1

## Key Decisions

- **Single template file**: All 3 playbook files covered in one template (matching sk-doc convention where install_guide_template.md covers the full guide)
- **Placeholder variables**: Use `{VARIABLE}` format consistent with other templates
- **Copy-paste scaffolds**: Each section provides ready-to-copy markdown that works when placeholders are filled

## Files Modified

| File | Action |
|------|--------|
| `.opencode/skill/sk-doc/assets/documentation/manual_testing_playbook_template.md` | Create |
| `.opencode/skill/sk-doc/assets/template_rules.json` | Update |
| `.opencode/skill/sk-doc/SKILL.md` | Update |
