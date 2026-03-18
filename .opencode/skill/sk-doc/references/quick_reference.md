---
title: Markdown Optimizer - Quick Reference
description: One-page cheat sheet for commands, quality gates, and transformation patterns.
---

# Markdown Optimizer - Quick Reference

Commands, quality gates, and patterns at a glance.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

**README Format Validation** (MANDATORY before delivery):
```bash
scripts/validate_document.py document.md
# Exit 0 = valid, Exit 1 = blocking errors
# Checks: TOC, H2 format, anchors, required sections
```

**Extract Structure** (for AI analysis):
```bash
scripts/extract_structure.py document.md
# Outputs JSON: frontmatter, structure, metrics, checklist, questions
```

**Quick Validation** (skill folders):
```bash
scripts/quick_validate.py .opencode/skill/my-skill
# Fast check for essential requirements
```

**Quick Validation with JSON**:
```bash
scripts/quick_validate.py .opencode/skill/my-skill --json
# Machine-readable output
```

**Direct Script Access** (no CLI wrapper required):
```bash
python scripts/validate_document.py document.md     # Format validation (exit 0/1)
python scripts/extract_structure.py document.md   # Extract structure + DQI score
python scripts/quick_validate.py skill-path       # Quick validation
python scripts/init_skill.py skill-name           # Initialize new skill
python scripts/package_skill.py skill-path        # Package skill
```

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Document Type | Target | Checklist | Content |
| --- | --- | --- | --- |
| SKILL.md | Production-ready | Strict (no failures) | High AI-friendliness |
| Command | Acceptable+ | Strict (no failures) | Functional |
| Knowledge | Good | Strict (no failures) | Good AI-friendliness |
| README | Good | Flexible | High AI-friendliness |
| Spec | Acceptable | Loose | N/A |

**Quality Levels**:
- Excellent (90+) → Production-ready
- Good (75-89) → Shareable
- Acceptable (60-74) → Functional
- Needs Work (<60) → Requires revision

---

<!-- /ANCHOR:quality-gates -->
<!-- ANCHOR:dqi-scoring -->
## 3. DQI SCORING

| Component | Max | Measures |
|-----------|-----|----------|
| Structure | 40 | Checklist pass rate |
| Content | 30 | Word count, code examples, links |
| Style | 30 | H2 format, dividers, intro |

**Bands**: Excellent (90+) | Good (75-89) | Acceptable (60-74) | Needs Work (<60)

---

<!-- /ANCHOR:dqi-scoring -->
<!-- ANCHOR:transformation-patterns-top-8 -->
## 4. TRANSFORMATION PATTERNS (TOP 8)

| # | Pattern | Impact | Effort |
|---|---------|--------|--------|
| 1 | API → Usage | High | Medium |
| 2 | Import → Complete | Medium | Low |
| 3 | Consolidate | Medium | Medium |
| 4 | Remove Metadata | Low | Low |
| 5 | Theory → Practical | High | High |
| 6 | Error → Handling | Medium | Medium |
| 7 | Complete Examples | Medium | Medium |
| 8 | Deduplicate | Medium | Low |

---

<!-- /ANCHOR:transformation-patterns-top-8 -->
<!-- ANCHOR:document-types-enforcement -->
## 5. DOCUMENT TYPES & ENFORCEMENT

**SKILL.md** (Strict):
- YAML frontmatter required
- H1 with subtitle
- H3/H4 allowed for RULES subsections (semantic emojis ✅❌⚠️ only)
- Blocks on violations

**Knowledge** (Moderate):
- NO frontmatter
- H1 with subtitle
- Numbered H2 sections
- Blocks on structural issues

**Spec** (Loose):
- Suggestions only
- Never blocks
- Flexible structure

**README** (Flexible):
- Frontmatter optional
- Safe auto-fixes only
- No blocking

**Command** (Strict):
- YAML frontmatter required (description, argument-hint, allowed-tools)
- H1 without subtitle
- Required sections: Purpose, Contract, Instructions, Example Usage
- Template: `assets/command_template.md`

**llms.txt** (Moderate):
- Plain text format (not markdown)
- H1 project name with tagline
- Sections: summary, features, docs links
- Template: `assets/llmstxt_templates.md`

---

<!-- /ANCHOR:document-types-enforcement -->
<!-- ANCHOR:common-issues-quick-fixes -->
## 6. COMMON ISSUES - QUICK FIXES

**Issue**: Checklist failures in JSON output
**Fix**: Review specific failures, address structural issues first

**Issue**: Low content quality rating from AI
**Fix**: Answer "How do I..." questions, add practical examples

**Issue**: Style compliance issues
**Fix**: All H2 must be ALL CAPS, --- separators between H2

**Issue**: Frontmatter issues detected
**Fix**: Keep description on single line, use [Tool1, Tool2] array format

---

<!-- /ANCHOR:common-issues-quick-fixes -->
<!-- ANCHOR:file-structure -->
## 7. FILE STRUCTURE

```
.opencode/skill/sk-doc/
├── SKILL.md (overview + smart routing)
├── references/
│   ├── core_standards.md (filename conventions, document types, violations)
│   ├── hvr_rules.md (Human Voice Rules for documentation style)
│   ├── optimization.md (content optimization patterns)
│   ├── validation.md (quality assessment, gates, interpretation)
│   ├── workflows.md (execution modes, validation patterns, troubleshooting)
│   ├── install_guide_standards.md (install guide standards)
│   ├── skill_creation.md (skill creation workflow)
│   └── quick_reference.md (this file)
├── assets/
│   ├── documentation/
│   │   ├── frontmatter_templates.md (YAML frontmatter examples)
│   │   ├── readme_template.md (README structure and patterns)
│   │   ├── install_guide_template.md (install guide template)
│   │   ├── manual_testing_playbook_template.md (root directory playbook template)
│   │   ├── manual_testing_playbook_snippet_template.md (per-feature snippet template)
│   │   └── llmstxt_templates.md (llms.txt generation examples)
│   ├── skill/
│   │   ├── skill_md_template.md (SKILL.md file template)
│   │   ├── skill_asset_template.md (skill asset template)
│   │   └── skill_reference_template.md (skill reference template)
│   ├── agents/
│   │   ├── command_template.md (slash command template)
│   │   └── agent_template.md (agent definition template)
│   ├── flowcharts/ (ASCII flowchart examples)
│   └── template_rules.json (validation rule definitions)
└── scripts/
    ├── extract_structure.py (document parsing → JSON for AI)
    ├── validate_document.py (full document validation)
    ├── quick_validate.py (fast skill validation)
    ├── init_skill.py (skill scaffolding)
    ├── package_skill.py (skill packaging)
    └── validate_flowchart.sh (flowchart validation)
```

---

<!-- /ANCHOR:file-structure -->
<!-- ANCHOR:content-quality-quick-guide -->
## 8. CONTENT QUALITY QUICK GUIDE

**AI evaluates content for**:
- Clarity and completeness
- Practical usefulness (examples, workflows)
- AI-friendliness (scannable, question-answering format)
- Appropriate level of detail

**Quick Wins for Higher Ratings**:
1. Add complete examples (not just API references)
2. Combine concepts with practical usage
3. Answer "How do I..." questions directly
4. Make content scannable (clear headings, lists)

---

<!-- /ANCHOR:content-quality-quick-guide -->
<!-- ANCHOR:integration-points -->
## 9. INTEGRATION POINTS

**Validation Workflow**:
```
1. Run extract_structure.py → JSON output
2. AI evaluates checklist results + content quality
3. AI provides recommendations
4. Fix issues and re-extract
```

---

<!-- /ANCHOR:integration-points -->
<!-- ANCHOR:install-guide-creation -->
## 10. INSTALL GUIDE CREATION

### Template
`assets/install_guide_template.md`

### Required Sections (0-10)
| # | Section | Required | Validation Gate |
|---|---------|----------|-----------------|
| 0 | AI-First Install Guide | ✅ Yes | - |
| 1 | Overview | ✅ Yes | - |
| 2 | Prerequisites | ✅ Yes | `phase_1_complete` |
| 3 | Installation | ✅ Yes | `phase_2_complete`, `phase_3_complete` |
| 4 | Configuration | ✅ Yes | `phase_4_complete` |
| 5 | Verification | ✅ Yes | `phase_5_complete` |
| 6 | Usage | ✅ Yes | - |
| 7 | Features | ⚠️ Optional | - |
| 8 | Examples | ⚠️ Optional | - |
| 9 | Troubleshooting | ✅ Yes | - |
| 10 | Resources | ✅ Yes | - |

**Key requirements**: Core Principle blockquote in Section 1, STOP block after each validation checkpoint (5+ total).

### Phase Validation Pattern
```markdown
### Validation: `phase_N_complete`

\`\`\`bash
# Verification commands
\`\`\`

**Checklist:**
- [ ] Item 1?
- [ ] Item 2?

❌ **STOP if validation fails**
```

### Troubleshooting Format
| Error | Cause | Fix |
|-------|-------|-----|
| "Error message" | Root cause | Solution |

### Configuration Paths
| Platform | Path |
|----------|------|
| OpenCode | `opencode.json` |
| Claude Code | `.mcp.json` |
| Claude Desktop | `~/Library/Application Support/Claude/claude_desktop_config.json` |

---

<!-- /ANCHOR:install-guide-creation -->
<!-- ANCHOR:skill-creation-quick-steps -->
## 11. SKILL CREATION QUICK STEPS

1. **Understanding** → Get concrete examples (~5 min)
2. **Planning** → Identify scripts/refs/assets (~5 min)
3. **Initialize** → `python scripts/init_skill.py <name>` (~2 min)
4. **Edit** → Populate SKILL.md + resources (~10-15 min)
5. **Package** → `python scripts/package_skill.py <path>` (~2 min)
6. **Iterate** → Test and improve (ongoing)

---

<!-- /ANCHOR:skill-creation-quick-steps -->
<!-- ANCHOR:playbook-creation-quick-steps -->
## 12. PLAYBOOK CREATION QUICK STEPS

### Template
`assets/documentation/manual_testing_playbook_template.md`

### Playbook Layout
| File | Content |
|------|---------|
| `manual_testing_playbook.md` | Root directory playbook, integrated review/orchestration guidance, summary blocks, and cross-references |
| `NN--category-name/*.md` | Required per-feature scenario files referenced from the root playbook |

### Quick Steps
1. **Plan categories** → Define ID prefixes (e.g., CCC, MCP, CFG)
2. **Create directory** → `{SKILL_PATH}/manual_testing_playbook/`
3. **Copy scaffolds** → Fill the main playbook and per-feature file scaffolds from the template
4. **Create per-feature snippets** → Use the snippet template for one file per feature ID
5. **Fill root summaries** → Add Description, Current Reality, and Test Execution blocks per feature
6. **Build cross-reference** → Feature Catalog Index with snippet links at end of main playbook
7. **Plan waves** → Add integrated orchestration guidance and group non-destructive vs destructive scenarios
8. **Validate** → Run playbook checklist (template Section 10)

Validation note: the current validator checks the root playbook, but it does not recurse into the category folders or verify cross-file snippet links.

---

<!-- /ANCHOR:playbook-creation-quick-steps -->
<!-- ANCHOR:related-resources -->
## 13. RELATED RESOURCES

### Reference Files
- [core_standards.md](./core_standards.md) - Document type rules and structural requirements
- [validation.md](./validation.md) - Quality scoring and validation workflows
- [optimization.md](./optimization.md) - Content transformation patterns
- [workflows.md](./workflows.md) - Execution modes and workflows
- [skill_creation.md](./skill_creation.md) - Skill creation workflow
- [install_guide_standards.md](./install_guide_standards.md) - Install guide standards

### Templates
- [skill_md_template.md](../assets/skill/skill_md_template.md) - SKILL.md file templates
- [frontmatter_templates.md](../assets/documentation/frontmatter_templates.md) - Frontmatter by document type
- [command_template.md](../assets/agents/command_template.md) - Command file templates
- [manual_testing_playbook_template.md](../assets/documentation/manual_testing_playbook_template.md) - Playbook creation template
- [manual_testing_playbook_snippet_template.md](../assets/documentation/manual_testing_playbook_snippet_template.md) - Per-feature snippet template

### Related Skills
- `git-commit` - Git commit workflows
- `system-spec-kit` - Context preservation and spec folder management

### External Resources
- [llms.txt specification](https://llmstxt.org/) - Official llms.txt spec
- [CommonMark](https://spec.commonmark.org/) - Markdown specification

---

**For complete documentation**: See [SKILL.md](../SKILL.md)
<!-- /ANCHOR:related-resources -->
