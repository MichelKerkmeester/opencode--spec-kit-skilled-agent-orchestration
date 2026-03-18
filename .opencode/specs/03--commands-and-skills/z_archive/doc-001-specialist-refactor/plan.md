---
title: "Plan: Document Specialist Refactor [001-doc-specialist-refactor/plan]"
description: "┌─────────────────────────────────────────────────────────────────┐"
trigger_phrases:
  - "plan"
  - "document"
  - "specialist"
  - "refactor"
  - "015"
  - "doc"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Plan: Document Specialist Refactor

> Technical implementation plan for script-assisted AI analysis.

---

<!-- ANCHOR:summary -->
## 1. Overview

| Attribute | Value |
|-----------|-------|
| Spec | .opencode/specs/03--commands-and-skills/z_archive/doc-001-specialist-refactor/spec.md |
| Target | `.opencode/skills/create-documentation/` |
| Estimated LOC | ~500 (new) + ~200 (modifications) |
| Documentation Level | Level 2 (with checklist.md) |
| Estimated Time | 5-6 hours |

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:architecture -->
## 2. Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      extract_structure.py                        │
│  - Parse markdown → structured JSON                              │
│  - Calculate metrics (deterministic)                             │
│  - Run type-specific checklists                                  │
│  - Generate evaluation questions                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ JSON output
┌─────────────────────────────────────────────────────────────────┐
│                     AI Agent (OpenCode)                          │
│  - Read structured JSON                                          │
│  - Evaluate questions against content                            │
│  - Assess quality (judgment)                                     │
│  - Generate recommendations                                      │
└─────────────────────────────────────────────────────────────────┘
```

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 3. Implementation Phases

### Phase 1: Build extract_structure.py (~2 hours)

**File:** `scripts/extract_structure.py`

**Components:**

1. **Frontmatter Parser**
   - Extract YAML between `---` markers
   - Parse into dict
   - Detect issues (multiline description, invalid allowed-tools)

2. **Markdown Parser**
   - Extract headings (level, text, line number)
   - Detect heading format (emoji, number prefix)
   - Extract sections (content between headings)
   - Extract code blocks (language, content, line numbers)

3. **Metrics Calculator**
   - Word count (total and per section)
   - Line count
   - Heading count and max depth
   - Code block count

4. **Document Type Detector**
   ```python
   def detect_type(filepath: str) -> str:
       filename = Path(filepath).name
       if filename == "SKILL.md":
           return "skill"
       elif filename == "README.md":
           return "readme"
       elif "/commands/" in filepath:
           return "command"
       elif "/specs/" in filepath:
           return "spec"
       elif "/references/" in filepath:
           return "reference"
       else:
           return "generic"
   ```

5. **Checklist Runner**
   - Type-specific checks (see Section 4)
   - Returns pass/fail with details
   - Calculates structure score

6. **Question Generator**
   - Standard questions per document type
   - Maps questions to target sections

**Output Schema:** See spec.md Section 3.1

### Phase 2: Enhance quick_validate.py (~30 min)

**File:** `scripts/quick_validate.py`

**Additions:**

```python
# Add to validate_skill() function:

# Check for multiline description
desc_match = re.search(r'description:\s*\n', frontmatter)
if desc_match:
    return False, "Description uses YAML multiline block format (must be single line)"

# Check for allowed-tools format
tools_match = re.search(r'allowed-tools:\s*(.+)', frontmatter)
if tools_match:
    tools_value = tools_match.group(1).strip()
    if not (tools_value.startswith('[') or tools_value.startswith('\n')):
        return False, f"allowed-tools must be array format [Tool1, Tool2], found: {tools_value}"

# Add --json flag support
if '--json' in sys.argv:
    print(json.dumps({"valid": valid, "message": message}))
else:
    print(message)
```

### Phase 3: Update CLI Wrapper (~30 min)

**File:** `markdown-document-specialist`

**Changes:**

```bash
# Remove --phase handling entirely
# Add extract subcommand

case "${1:-}" in
    extract)
        shift
        python3 "$SCRIPT_DIR/scripts/extract_structure.py" "$@"
        ;;
    validate|--validate-skill)
        # Keep existing behavior
        ;;
    init|--init-skill)
        # Keep existing behavior
        ;;
    package|--package-skill)
        # Keep existing behavior
        ;;
    *)
        # Default to extract for .md files
        if [[ "$1" == *.md ]]; then
            python3 "$SCRIPT_DIR/scripts/extract_structure.py" "$@"
        else
            show_usage
        fi
        ;;
esac
```

### Phase 4: Update SKILL.md (~1 hour)

**File:** `SKILL.md`

**Sections to Add:**

1. **Script-Assisted Analysis Workflow** (new section)
   - Step 1: Run extraction script
   - Step 2: Review checklist results
   - Step 3: Evaluate questions
   - Step 4: Assess content quality
   - Step 5: Generate recommendations
   - Step 6: Output report

2. **Updated SMART ROUTING**
   ```python
   def route_request(context):
       if context.task == "analyze_document":
           execute("scripts/extract_structure.py", context.file)
           # Then follow AI workflow in SKILL.md
       elif context.task == "create_skill":
           execute("scripts/init_skill.py", context.name, context.path)
       elif context.task == "package_skill":
           execute("scripts/package_skill.py", context.path)
       elif context.task == "validate_skill":
           execute("scripts/quick_validate.py", context.path)
   ```

**Sections to Remove:**
- References to c7score calculation
- Triple dimension scoring claims
- Phase-based pipeline descriptions

### Phase 5: Update Reference Docs (~1 hour)

**workflows.md:**
- Replace phase descriptions with script-assisted workflow
- Add JSON output examples
- Document AI evaluation process

**validation.md:**
- Update with checklist IDs from extract_structure.py
- Document each check and its criteria
- Remove fake scoring claims

**quick_reference.md:**
- Update command list
- Add `extract` command
- Remove `--phase` references

**skill_creation.md:**
- Update CLI examples
- Remove analyze_docs.py references
- Add extract_structure.py usage

### Phase 6: Delete Old Script (~5 min)

```bash
rm .opencode/skills/create-documentation/scripts/analyze_docs.py
```

Then grep and remove any references in documentation.

<!-- /ANCHOR:phases -->

---

## 4. Type-Specific Checklists

### SKILL.md Checklist

| ID | Check | Criteria |
|----|-------|----------|
| `frontmatter_exists` | Has YAML frontmatter | Starts with `---` |
| `name_present` | Has name field | `name:` in frontmatter |
| `name_hyphen_case` | Name is hyphen-case | Matches `^[a-z0-9-]+$` |
| `description_present` | Has description | `description:` in frontmatter |
| `description_single_line` | Description on one line | No `description:\n` pattern |
| `allowed_tools_present` | Has allowed-tools | `allowed-tools:` in frontmatter |
| `allowed_tools_array` | Tools in array format | Starts with `[` or is YAML list |
| `has_when_to_use` | Has WHEN TO USE section | H2 contains "WHEN TO USE" |
| `has_how_it_works` | Has HOW IT WORKS section | H2 contains "HOW IT WORKS" |
| `has_rules` | Has RULES section | H2 contains "RULES" |
| `h2_numbered_emoji` | H2s have number + emoji | Pattern: `## N. 🎯` |
| `no_toc` | No table of contents | No "Table of Contents" H2 |

### README.md Checklist

| ID | Check | Criteria |
|----|-------|----------|
| `has_title` | Has H1 title | First heading is H1 |
| `has_description` | Has description | Content after H1 before next heading |
| `has_installation` | Has installation section | H2 contains "install" |
| `has_usage` | Has usage section | H2 contains "usage" or "getting started" |

### Command File Checklist

| ID | Check | Criteria |
|----|-------|----------|
| `frontmatter_exists` | Has YAML frontmatter | Starts with `---` |
| `description_present` | Has description | `description:` in frontmatter |
| `argument_hint_present` | Has argument-hint | `argument-hint:` in frontmatter |

---

## 5. Evaluation Questions by Type

### SKILL.md Questions

| ID | Question | Target Section | Importance |
|----|----------|----------------|------------|
| q1 | When should I use this skill? | WHEN TO USE | critical |
| q2 | How does this skill work? | HOW IT WORKS | critical |
| q3 | What are the rules for using this skill? | RULES | high |
| q4 | Can you show me an example? | EXAMPLES | high |
| q5 | What tools does this skill require? | frontmatter | medium |
| q6 | What does this skill integrate with? | INTEGRATION | medium |

### README.md Questions

| ID | Question | Target Section | Importance |
|----|----------|----------------|------------|
| q1 | How do I install this? | Installation | critical |
| q2 | How do I get started? | Usage/Getting Started | critical |
| q3 | What are the main features? | Features | high |
| q4 | How do I configure this? | Configuration | medium |
| q5 | Where can I get help? | Support/Contributing | low |

---

<!-- ANCHOR:dependencies -->
## 6. Dependencies

| Dependency | Purpose | Status |
|------------|---------|--------|
| Python 3 | Script execution | Required (already available) |
| PyYAML | YAML parsing | Optional (use regex fallback) |
| json | JSON output | Built-in |
| re | Regex parsing | Built-in |
| pathlib | Path handling | Built-in |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Complex markdown edge cases | Medium | Low | Use conservative parsing, handle gracefully |
| YAML parsing without PyYAML | Low | Low | Regex-based extraction works for simple frontmatter |
| Breaking existing workflows | Low | Medium | Keep init/package/validate unchanged |
| Large files slow to parse | Low | Low | Stream processing if needed |

<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:testing -->
## 8. Testing Strategy

1. **Unit Tests** (optional but recommended)
   - Test each parser component independently
   - Test checklist logic per document type

2. **Integration Tests**
   - Run extract on existing SKILL.md files
   - Verify JSON output schema
   - Test CLI routing

3. **Manual Verification**
   - Run full analysis workflow on create-documentation skill
   - Verify AI can use output effectively

<!-- /ANCHOR:testing -->

---

## 9. Rollback Plan

If issues discovered post-implementation:
1. Restore analyze_docs.py from git
2. Revert CLI changes
3. Keep extract_structure.py but don't route to it

---

## 10. Success Metrics

- [ ] All 15 P0 checklist items pass
- [ ] CLI `--help` shows accurate commands
- [ ] No "not implemented" errors
- [ ] AI produces consistent analysis using JSON output
- [ ] Documentation matches implementation
