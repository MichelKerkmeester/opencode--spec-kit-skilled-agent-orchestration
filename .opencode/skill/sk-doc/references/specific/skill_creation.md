---
title: Skill Creation Workflow
description: Complete guide for creating, validating, and distributing AI agent skills with bundled resources.
---

# Skill Creation Workflow - Complete Development Guide

Step-by-step guide from concept to packaged skill with validation standards and best practices.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Level 3 reference for the full skill lifecycle: creation, validation, and distribution.

**Core Principle**: Progressive disclosure maximizes value, minimizes cost.

```
Level 1: SKILL.md metadata (name + description) — Always in context (~100 words)
Level 2: SKILL.md body — When skill triggers (<5k words)
Level 3: Bundled resources (this document) — Loaded as needed
```

Skills are modular packages that extend an AI agent with specialized workflows, tool integrations, domain expertise, and bundled resources (scripts, references, assets).

**See also**: [SET-UP - Skill Creation.md](../../../../install_guides/SET-UP - Skill Creation.md) for interactive creation workflow.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:skill-anatomy -->
## 2. SKILL ANATOMY

Every skill consists of a required SKILL.md file and optional bundled resources:

```
skill-name/
├── SKILL.md (required)
│   ├── YAML frontmatter metadata (required)
│   │   ├── name: (required)
│   │   └── description: (required)
│   └── Markdown instructions (required)
└── Bundled Resources (optional)
    ├── scripts/          - Executable code (Python/Bash/etc.)
    ├── references/       - Documentation (flat or domain subfolders)
    └── assets/           - Files used in output (subfolders OK for organization)
        ├── skill/         - Skill creation templates (SKILL.md, reference, asset)
        ├── agents/        - Agent and command creation templates
        └── documentation/ - Document templates (README, install guides)
```

**Folder Organization Principle**:
- **references/** = flat for small skills, domain subfolders for medium/complex skills
  - Grouped example: `references/global/core_standards.md`, `references/global/validation.md`
  - Domain example: `references/backend/go/`, `references/frontend/react/`
- **assets/** = Subfolders ALLOWED when organizing many files by category
  - Group related templates together for clarity
  - Example: `assets/skill/`, `assets/agents/`, `assets/documentation/`, `assets/flowcharts/`
- **scripts/** = Typically flat, but subfolders OK for large script collections

### SKILL.md Requirements

**Metadata Quality**: The `name` and `description` in YAML frontmatter determine when the AI agent will use the skill. Be specific about what the skill does and when to use it.

**Writing Style Guidelines**:
- Use **third-person** in descriptions (e.g., "This skill should be used when..." instead of "Use this skill when...")
- Write using **imperative/infinitive form** (verb-first instructions), not second person
- Use objective, instructional language (e.g., "To accomplish X, do Y" rather than "You should do X")
- Keep SKILL.md body under **5k words**

**Required Sections** (enforced by markdown-document-specialist validation):
1. WHEN TO USE (activation triggers and use cases ONLY)
2. SMART ROUTING (detection guidance + merged resource domains/mapping + loading levels + authoritative pseudocode)
3. HOW IT WORKS
4. RULES (ALWAYS/NEVER/ESCALATE IF)
5. REFERENCES (or combined `SMART ROUTING & REFERENCES`)

Validation reminder:
- `scripts/package_skill.py` fails if `REFERENCES` is missing and no approved combined heading variant is present.

**Recommended Sections**:
6. SUCCESS CRITERIA
7. INTEGRATION POINTS
8. RELATED RESOURCES

### Routing Authority Standard

Intent scoring and the in-code resource map in SMART ROUTING are the authoritative routing source. Do not maintain separate use-case routing tables.

Router parity checklist for modern skills:
- Guarded in-skill loading (`_guard_in_skill`)
- Recursive markdown discovery (`discover_markdown_resources`)
- Weighted intent scoring (`score_intents`)
- Ambiguity handling (`select_intents`)
- Explicit loading levels with ON_DEMAND triggers
- Optional `UNKNOWN_FALLBACK_CHECKLIST` for low-confidence requests

**Section Boundary Rules:**
```
❌ WRONG: File references or routing logic in "WHEN TO USE"
❌ WRONG: Separate use-case routing tables or navigation guides
✅ RIGHT: Detection context plus merged domains/mapping and one authoritative pseudocode block

"WHEN TO USE" = WHEN (triggers, conditions, use cases)
"SMART ROUTING" = HOW resources are selected and loaded (authoritative)
```

### Bundled Resources (Optional)

#### Scripts Directory (`scripts/`)

Executable code for tasks requiring deterministic reliability or repeatedly rewritten.

**When to include scripts**:
- Same code being rewritten repeatedly by the agent
- Deterministic reliability needed
- Performance optimization required
- Complex logic better handled by programming language

**Examples**:
- `scripts/rotate_pdf.py` - PDF rotation tasks
- `scripts/extract_structure.py` - Document structure extraction
- `scripts/init_skill.py` - Skill scaffolding

**Benefits**:
- Token efficient (may execute without loading into context)
- Deterministic behavior
- Reusable across skill invocations

**Note**: Scripts may still need to be read for patching or environment adjustments.

#### References Directory (`references/`)

Documentation loaded as needed to inform the agent's process and thinking.

**When to include references**:
- Documentation the agent should reference while working
- Detailed domain knowledge
- API specifications
- Database schemas
- Company policies

**Examples**:
- `references/schema.md` - Database schema documentation
- `references/api_docs.md` - API endpoint specifications
- `references/policies.md` - Company policies and guidelines
- `references/global/workflows.md` - Detailed workflow documentation

**Benefits**:
- Keeps SKILL.md lean
- Loaded only when needed
- Supports deep, detailed documentation

**Best practice**:
- If files are large (>10k words), include grep search patterns in SKILL.md
- Avoid duplication between SKILL.md and references
- Keep only essential instructions in SKILL.md
- Move detailed reference material to references files

#### Assets Directory (`assets/`)

Files used within the output the agent produces (not loaded into context).

**When to include assets**:
- Skill needs files for final output
- Templates for document generation
- Boilerplate code
- Images, icons, logos

**Examples**:
- `assets/logo.png` - Brand logo
- `assets/template.html` - HTML template
- `assets/font.ttf` - Custom font
- `assets/frontmatter_templates.md` - YAML frontmatter examples

**Benefits**:
- Separates output resources from documentation
- Keeps context window clean
- Provides consistent output resources

---

<!-- /ANCHOR:skill-anatomy -->
<!-- ANCHOR:skill-creation-process -->
## 3. SKILL CREATION PROCESS

Follow these steps in order, skipping only if there is a clear reason they are not applicable.

### Step 1: Understanding the Skill with Concrete Examples (~5 min)

**Objective**: Gain clear understanding of skill's purpose through concrete examples.

**Skip only when**: Skill's usage patterns are already clearly understood.

**Process**:
1. Understand concrete examples of how skill will be used
2. Examples can come from direct user input or generated and validated
3. Ask focused questions about functionality and use cases

**Example Questions** (for image-editor skill):
- "What functionality should the image-editor skill support?"
- "Can you give examples of how this would be used?"
- "What would a user say that should trigger this skill?"

**Best Practice**: Avoid overwhelming users—ask most important questions first, follow up as needed.

**Conclude when**: Clear sense of functionality the skill should support.

**Example Dialogue**:
```
AI: What functionality should the markdown-editor skill support?
User: I want to enforce markdown structure and optimize content for AI.

AI: Can you give specific examples of what you want enforced?
User: Filename conventions, frontmatter format, heading hierarchy.

AI: What optimization do you want for AI readability?
User: Convert documentation to question-answering format, remove metadata.
```


### Step 2: Planning Reusable Skill Contents (~5 min)

**Objective**: Identify scripts, references, and assets that will be reused across skill invocations.

**Process**:
1. Consider how to execute each example from scratch
2. Identify scripts, references, and assets helpful for repeated execution
3. Categorize resources by type (scripts/references/assets)

**Example 1: PDF Editor Skill**
- **Query**: "Help me rotate this PDF"
- **Analysis**: Rotating PDF requires re-writing same code each time
- **Solution**: Create `scripts/rotate_pdf.py`
- **Rationale**: Deterministic operation, same code repeatedly needed

**Example 2: Frontend Webapp Builder**
- **Query**: "Build me a todo app"
- **Analysis**: Requires same boilerplate HTML/React each time
- **Solution**: Create `assets/hello-world/` template
- **Rationale**: Starting point for every app, consistent structure

**Example 3: BigQuery Skill**
- **Query**: "How many users logged in today?"
- **Analysis**: Re-discovering table schemas each time
- **Solution**: Create `references/schema.md`
- **Rationale**: Schema documentation needed for query construction

**Example 4: Markdown Optimizer Skill**
- **Query**: "Optimize this documentation for AI"
- **Analysis**: Need to parse document structure consistently
- **Solution**: Create `scripts/extract_structure.py` and `references/global/optimization.md`
- **Rationale**: Document parsing better in Python, AI evaluates the output

**Output**: List of reusable resources (scripts, references, assets) with rationale.


### Step 3: Initializing the Skill (~2 min)

**Objective**: Create skill directory structure with template files.

**Skip only when**: Skill already exists and iteration is needed.

**Command**:
```bash
scripts/init_skill.py <skill-name> --path <output-directory>
```

**Default path**: If `--path` not specified, creates in current directory.

**Script Actions**:
1. Creates skill directory at specified path
2. Generates SKILL.md template with proper frontmatter and TODO placeholders
3. Creates example resource directories: `scripts/`, `references/`, `assets/`
4. Adds example files that can be customized or deleted

**Generated SKILL.md**: `init_skill.py` creates a starter SKILL.md. Normalize it to the required section order (WHEN TO USE, SMART ROUTING, HOW IT WORKS, RULES, REFERENCES) and add recommended sections (SUCCESS CRITERIA, INTEGRATION POINTS, RELATED RESOURCES) as you complete the skill.

**After initialization**: Customize or remove generated files as needed.

**Example Usage**:
```bash
# Create skill in .opencode/skill/ directory
scripts/init_skill.py markdown-optimizer --path .opencode/skill

# Creates:
# .opencode/skill/markdown-optimizer/
# ├── SKILL.md (with TODO placeholders)
# ├── scripts/example_script.py
# ├── references/example_reference.md
# └── assets/example_asset.txt
```


### Step 4: Edit the Skill (~10-15 min)

**Objective**: Populate skill with instructions and bundled resources.

**Remember**: Creating this skill for another AI agent instance to use. Focus on information that would be beneficial and non-obvious.

#### Start with Reusable Skill Contents

Begin with resources identified in Step 2: `scripts/`, `references/`, and `assets/` files.

**Process**:
1. Create scripts identified in planning phase
2. Add reference documentation
3. Include asset files
4. Delete example files generated during initialization

**Note**: May require user input (e.g., brand assets, documentation templates).

**Important**: Delete example files and directories not needed for the skill.

**Example - Markdown Optimizer Skill**:
```bash
# Keep needed directories
scripts/
  ├── extract_structure.py    # Created
  └── example_script.py       # DELETE

references/
  ├── core_standards.md       # Created
  ├── workflows.md            # Created
  ├── optimization.md         # Created
  ├── validation.md           # Created
  └── example_reference.md    # DELETE

assets/
  ├── frontmatter_templates.md  # Created
  └── example_asset.txt         # DELETE
```

#### Update SKILL.md

Answer these questions in SKILL.md:

1. **What is the purpose of the skill, in a few sentences?**
   - Write clear, concise summary
   - Include in subtitle under H1

2. **When should the skill be used?**
   - Section 1: WHEN TO USE
   - **ONLY activation triggers and use cases belong here**
   - Include: Activation triggers, Use cases, When NOT to use, Keyword triggers
   - **DO NOT include**: File references, navigation guides, resource paths
   - Example content:
     ```markdown
     ## 1. WHEN TO USE
     
     ### Activation Triggers
     - User requests document quality review
     - After Write/Edit operations on markdown files
     
     ### Use Cases
     - Validating markdown structure before commits
     - Optimizing documentation for AI readability
     
     ### When NOT to Use
     - Simple text edits without structural changes
     - Non-markdown file types
     ```

3. **How should the agent route to the right resources?**
   - Section 2: SMART ROUTING
   - Follow the SMART ROUTING template generated in Step 3. Populate the five subsections: Primary Detection Signal, Phase Detection, Resource Domains, Resource Loading Levels, and Smart Router Pseudocode.
   - **Anti-pattern**: Do NOT duplicate routing logic in separate lookup tables

4. **How should bundled resources be organized for routing clarity?**
   - Keep domain structure explicit (for example `references/backend/go/`)
   - Mirror key domains under `assets/` when templates/checklists are stack-specific
   - Keep one source of truth for mapping in `Resource Domains`

5. **How should the agent use the skill in practice?**
   - Section 3: HOW IT WORKS
   - Reference all bundled resources
   - Explain workflow and decision points

6. **What rules govern skill usage?**
   - Section 4: RULES
   - ALWAYS rules (required actions)
   - NEVER rules (forbidden actions)
   - ESCALATE IF (when to ask user)

7. **What references should the skill expose explicitly?**
   - Section 5: REFERENCES
   - Include core references and templates, or use combined `SMART ROUTING & REFERENCES` if preferred.

**Writing Style Reminders**:
- Use imperative/infinitive form (verb-first: "Run validation", "Check structure")
- Third-person descriptions ("This skill should be used when...")
- Objective, instructional language
- Keep total under 5k words

**Frontmatter Completion**:

| Field           | Required | Quick Note                                     |
| --------------- | -------- | ---------------------------------------------- |
| `name`          | ✅        | Must match folder name, lowercase-with-hyphens |
| `description`   | ✅        | Single line, specific about capabilities       |
| `allowed-tools` | ✅        | Array format (`[Read, Write, ...]`)           |
| `version`       | ⚪        | Semantic versioning (e.g., `1.0.0`)            |

```yaml
---
name: markdown-optimizer
description: Complete document quality pipeline with structure enforcement, content optimization (AI-friendly), and style guide compliance
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
version: 1.0.0
---
```

> **Complete Reference**: For validation rules, format specifications, and all document types, see [frontmatter_templates.md](../../assets/documentation/frontmatter_templates.md)


### Step 5: Packaging a Skill (~2 min)

**Objective**: Validate skill and package into distributable zip file.

**Command**:
```bash
scripts/package_skill.py <path/to/skill-folder>
```

**Optional output directory**:
```bash
scripts/package_skill.py <path/to/skill-folder> ./dist
```

**Packaging Process**:

**Phase 1: Validation** (automatic):
- YAML frontmatter format and required fields
- Skill naming conventions (hyphen-case)
- Description completeness and quality (no angle brackets, no generic text)
- Directory structure validation
- File organization check

**Validation Checks**:
1. SKILL.md exists
2. Frontmatter starts with `---`
3. Frontmatter has closing `---`
4. Required fields present: `name`, `description`
5. Name is hyphen-case (lowercase, hyphens, no underscores)
6. Name doesn't start/end with hyphen
7. No consecutive hyphens
8. No angle brackets in description (e.g., `<skill-name>`)
9. Description is complete (not just TODO placeholder)

**Phase 2: Packaging** (if validation passes):
- Creates zip file named after skill (e.g., `markdown-optimizer.zip`)
- Includes all files with proper directory structure
- Preserves executable permissions for scripts
- Creates in output directory or skill parent directory

**If validation fails**:
- Error messages printed to console
- Specific issues highlighted
- Fix errors and run packaging command again

**Success Output**:
```
✅ Validation passed
📦 Packaging skill: markdown-optimizer
✅ Successfully packaged skill to: ./dist/markdown-optimizer.zip

💡 Recommended next step:
   Do a final quality pass to ensure production readiness:
   markdown-document-specialist extract markdown-optimizer/SKILL.md
   Review the JSON output + re-read the doc for clarity and completeness
```


### Step 6: Iterate (ongoing)

**Objective**: Test and improve based on real usage.

**Iteration Workflow**:
1. Use skill on real tasks
2. Notice struggles or inefficiencies
3. Identify SKILL.md or bundled resource updates needed
4. Implement changes
5. Repackage and test again

**Best Time to Iterate**: Right after using skill, with fresh context of performance.

**Common Iteration Patterns**:

**Pattern 1: Unclear Instructions**
- Symptom: The agent misinterprets skill guidance
- Fix: Add examples to SKILL.md, clarify wording
- Location: Typically in HOW IT WORKS or RULES sections

**Pattern 2: Missing Resources**
- Symptom: The agent recreates same code/content repeatedly
- Fix: Add script or reference file
- Location: New file in scripts/ or references/

**Pattern 3: Overly Detailed SKILL.md**
- Symptom: SKILL.md exceeds 5k words, context window strain
- Fix: Move detailed content to references/ files
- Location: Extract sections to references/, add pointers in SKILL.md

**Pattern 4: Skill Not Triggering**
- Symptom: The agent doesn't use skill when appropriate
- Fix: Improve description in frontmatter, be more specific about triggers
- Location: YAML frontmatter `description` field

**Iteration Example - Markdown Optimizer**:
```
Initial Version:
- SKILL.md: 800 words
- description: "Optimizes markdown files"
- Problem: Too generic, skill didn't trigger

Iteration 1:
- Updated description: "Complete document quality pipeline with structure enforcement, content optimization (AI-friendly), and style guide compliance"
- Result: Better triggering, but users confused about modes

Iteration 2:
- Added workflows.md reference with detailed mode explanations
- Added examples section with before/after
- Result: Clear usage, high adoption

Iteration 3:
- Added extract_structure.py script for document parsing
- Result: AI can now evaluate structured JSON output reliably
```

---

<!-- /ANCHOR:skill-creation-process -->
<!-- ANCHOR:validation-requirements -->
## 4. VALIDATION REQUIREMENTS

### Minimal Validation (quick_validate.py)

**Purpose**: Pre-packaging sanity check for essential frontmatter requirements.

**Checks**:
1. SKILL.md file exists
2. YAML frontmatter present
3. Required fields: name, description
4. Name format: hyphen-case
5. No angle brackets in description
6. **Platform compatibility** - Features work across different AI agent environments

**Output**: Pass/fail with error messages

**When to use**: Automatically during packaging


### Comprehensive Validation (markdown-document-specialist)

**Purpose**: Full quality assurance for production-ready skills.

**What “comprehensive validation” means in this repo**:

- **Structure checklist (script)**: Deterministic checks from `extract_structure.py` (frontmatter, headings, required sections, fenced code blocks).
- **Content quality (AI)**: Judgement based on the extracted JSON + the actual text (clarity, completeness, examples).
- **Style compliance (AI)**: Judgement against `core_standards.md` (headings format, bullets, emoji rules, consistency).

**Quality gate (qualitative)**:
- **SKILL.md must have zero checklist failures**.
- If content is unclear/incomplete, iterate until the doc is production-ready (no major gaps).

**When to use**: After packaging, before distribution

**Command**:
```bash
scripts/extract_structure.py .opencode/skill/my-skill/SKILL.md
# AI evaluates the JSON output and provides quality assessment
```

---

<!-- /ANCHOR:validation-requirements -->
<!-- ANCHOR:common-pitfalls -->
## 5. COMMON PITFALLS

### Pitfall 1: Generic Descriptions

**Problem**: Skill doesn't trigger because description is too vague.

**Example**:
```yaml
# Bad
description: Helps with markdown files

# Good
description: Complete document quality pipeline with structure enforcement, content optimization (AI-friendly), and style guide compliance
```

**Fix**: Be specific about capabilities and use cases.


### Pitfall 2: Bloated SKILL.md

**Problem**: SKILL.md exceeds 5k words, straining context window.

**Example**:
```markdown
# Bad - Everything in SKILL.md
## 4. HOW IT WORKS
[2000 words of detailed documentation]
[500 lines of examples]
[1000 words of API specs]

# Good - Progressive disclosure
## 4. HOW IT WORKS
See [workflows.md](../global/workflows.md) for execution modes.
See [optimization.md](../global/optimization.md) for transformation patterns.
```

**Fix**: Move detailed content to references/, keep SKILL.md lean.


### Pitfall 3: Missing Bundled Resources

**Problem**: The agent recreates same code repeatedly instead of using scripts.

**Example**:
```markdown
# Bad - No script provided
## HOW IT WORKS
Rotate PDF by writing Python code using PyPDF2...

# Good - Script provided
## HOW IT WORKS
Use scripts/rotate_pdf.py to rotate PDF files.
```

**Fix**: Identify repeatedly needed code, create scripts.


### Pitfall 4: Unclear Triggers

**Problem**: Skill exists but never triggers because conditions are unclear.

**Example**:
```markdown
# Bad
## 1. WHEN TO USE
Use this skill for documents.

# Good
## 1. WHEN TO USE
Use this skill when validating markdown files after Write/Edit operations.
Manual optimization when:
- README needs major AI-friendliness improvements
- Creating critical documentation
- Quality assurance before sharing
```

**Fix**: Be specific about automatic vs manual triggers, clear use cases.


### Pitfall 5: Second-Person Language

**Problem**: Skill uses "you" instead of imperative form.

**Example**:
```markdown
# Bad
You should validate the file before processing.

# Good
Validate the file before processing.
```

**Fix**: Use imperative/infinitive form throughout.


### Pitfall 6: Platform Compatibility

**Problem**: Skill references automatic triggers or platform-specific features that don't work in OpenCode.

**Context**: Skills should be platform-agnostic. OpenCode uses AGENTS.md discipline for enforcement, not automatic triggers.

**Example**:
```markdown
# Bad - Claims automatic behavior
#### Automatic Enforcement
Enforcement runs automatically via triggers:
- After Write/Edit operations
- Before AI processes prompts

# Good - Manual workflow documentation
#### Validation Workflow
**Filename Validation** (after Write/Edit operations):
- Purpose: Filename enforcement
- Apply: After creating or editing files
- Verify: Before claiming completion
```

**Fix**: When documenting enforcement features:
1. Replace "runs automatically" with "verify manually"
2. Replace "blocks commits" with "verify before commits"
3. Replace "Automatic activation" with "Use this skill when"
4. Focus on AGENTS.md discipline, not automatic triggers

**Validation Check**: Search for outdated patterns before packaging:
```bash
grep -E "runs automatically|blocks commits|Automatic.*via|auto-enforced" SKILL.md
```


### Pitfall 7: Multiline YAML Description

**Problem**: Skill description uses YAML multiline block format which isn't parsed correctly.

**Example**:
```yaml
# Bad - Multiline block format (parser fails)
description:
  This is my skill description
  spanning multiple lines.

# Good - Single line after colon
description: This is my skill description all on one line.
```

**Cause**: Prettier and other formatters may auto-format long descriptions to multiline.

**Fix**: Keep description on a single line after the colon. If a formatter changes it, manually revert.


### Pitfall 8: File References in Wrong Section or Redundant Navigation Guide

**Problem**: File references placed in "WHEN TO USE" section, or routing logic duplicated across multiple tables/snippets.

**Example**:
```markdown
# Bad - File references in "When to Use"
## 1. WHEN TO USE
See `references/guide.md` for details...

# Bad - Separate lookup table duplicates router logic
## 2. SMART ROUTING

### Routing Table
| Intent     | Path                           |
| ---------- | ------------------------------ |
| Validation | `references/global/core_standards.md` |

### Smart Router Pseudocode
...

# Good - Detection + domains + one authoritative pseudocode block
## 1. WHEN TO USE

### Activation Triggers
- User requests validation...

## 2. SMART ROUTING

### [Primary Detection Signal]
```bash
[ -f "package.json" ] && STACK="NODEJS"
```

### Resource Domains
```text
references/[domain]/...
assets/[domain]/...
```

### Smart Router Pseudocode
```python
def route_request(context):
    if context.needs_validation:
        return load("references/global/core_standards.md")  # Validation rules
```
```

**Rule**:
```
"When to Use" = WHEN (triggers, conditions, use cases)
"Smart Routing" = HOW resources are selected and loaded

⚠️ ANTI-PATTERN: Do NOT duplicate routing logic in separate lookup tables
```

**Fix**: Keep Section 2 cohesive with detection context, merged resource domains/mapping, loading levels, and one authoritative Smart Router Pseudocode block.

---

<!-- /ANCHOR:common-pitfalls -->
<!-- ANCHOR:example-skills -->
## 6. EXAMPLE SKILLS

### Example 1: PDF Editor Skill

**Purpose**: Rotate, crop, and edit PDF files

**Directory Structure**:
```
pdf-editor/
├── SKILL.md
├── scripts/
│   ├── rotate_pdf.py
│   ├── crop_pdf.py
│   └── merge_pdfs.py
└── references/
    └── pdf_operations.md
```

**SKILL.md Highlights**:
- When to use: PDF manipulation tasks
- How it works: References scripts for operations
- Rules: Always validate PDF before processing
- Success criteria: Operation completes without corruption

**Bundled Resources**:
- `scripts/rotate_pdf.py` - Rotate PDF pages
- `scripts/crop_pdf.py` - Crop PDF regions
- `scripts/merge_pdfs.py` - Merge multiple PDFs
- `references/pdf_operations.md` - PyPDF2 documentation


### Example 2: Brand Guidelines Skill

**Purpose**: Apply company branding to documents

**Directory Structure**:
```
brand-guidelines/
├── SKILL.md
├── assets/
│   ├── logo.png
│   ├── logo-dark.png
│   └── color_palette.json
└── references/
    └── brand_guidelines.md
```

**SKILL.md Highlights**:
- When to use: Creating customer-facing documents
- How it works: Apply branding from assets/
- Rules: Always use official logo, follow color palette
- Success criteria: Document matches brand guidelines

**Bundled Resources**:
- `assets/logo.png` - Primary logo
- `assets/logo-dark.png` - Dark mode logo
- `assets/color_palette.json` - Official colors
- `references/brand_guidelines.md` - Detailed brand rules


### ️ Example 3: Database Query Skill

**Purpose**: Query company database with proper schemas

**Directory Structure**:
```
database-query/
├── SKILL.md
└── references/
    ├── schema.md
    └── common_queries.md
```

**SKILL.md Highlights**:
- When to use: Querying company database
- How it works: Reference schema, construct queries
- Rules: Always use prepared statements, check permissions
- Success criteria: Query executes successfully, returns expected data

**Bundled Resources**:
- `references/schema.md` - Database schema documentation
- `references/common_queries.md` - Query pattern examples

---

<!-- /ANCHOR:example-skills -->
<!-- ANCHOR:skill-maintenance -->
## 7. SKILL MAINTENANCE

### When to Update Skills

**Update triggers**:
1. Skill struggles with common use cases
2. User feedback indicates confusion
3. New features needed
4. Bundled resources become outdated
5. Writing style inconsistencies discovered

### ️ Update Workflow

1. **Identify Issue**: Use skill, notice problem
2. **Diagnose**: SKILL.md unclear? Missing resource? Outdated info?
3. **Fix**: Update relevant files
4. **Validate**: Run quality validation
5. **Repackage**: Create new zip file
6. **Test**: Try skill on real task
7. **Document**: Note changes in version history

### Versioning

**Semantic Versioning** (recommended):
- Major (1.0.0 → 2.0.0): Breaking changes, complete restructure
- Minor (1.0.0 → 1.1.0): New features, new bundled resources
- Patch (1.0.0 → 1.0.1): Bug fixes, typo corrections

**Update frontmatter version field**:
```yaml
---
name: markdown-optimizer
description: Complete document quality pipeline...
version: 2.0.0
---
```

---

<!-- /ANCHOR:skill-maintenance -->
<!-- ANCHOR:distribution -->
## 8. DISTRIBUTION

### Packaging for Distribution

**Command**:
```bash
scripts/package_skill.py <path/to/skill> <output-directory>
```

**Output**: Zip file ready for distribution

**Distribution Checklist**:
- ✅ Validation passed
- ✅ Final review completed (no critical gaps)
- ✅ All bundled resources included
- ✅ README or documentation provided
- ✅ Version number in frontmatter
- ✅ License information (if applicable)

### Installation

**User installation**:
1. Download skill zip file
2. Extract to `.opencode/skill/` directory
3. Skill automatically available to the agent

**Verification**:
- Check skill appears in the agent's skill list
- Test skill with example use case
- Verify bundled resources accessible

---

<!-- /ANCHOR:distribution -->
<!-- ANCHOR:skill-structure-system -->
## 9. SKILL STRUCTURE SYSTEM

### Why Layered Skill Docs

Large skills eventually outgrow one `SKILL.md` file. The maintainable pattern is to keep routing in `SKILL.md` and split depth into focused reference files that can be loaded on demand.

### Core Structure

```
skill-name/
├── SKILL.md                # Primary entrypoint (activation rules, routing, core behavior)
├── references/
│   ├── topic-a.md
│   ├── topic-b.md
│   └── topic-c.md
├── assets/
└── scripts/
```

### Design Logic

1. Start with `SKILL.md` for trigger/routing behavior.
2. Use `README.md` or the SKILL navigation section as a concise map.
3. Load only the specific `references/` files required by the active task.
4. Keep progressive disclosure strict to control context size.

### How AI Should Use Layered Skills

Use this operating pattern:

1. Read `SKILL.md` for trigger and routing rules.
2. Open `README.md` if additional navigation is needed.
3. Read one focused reference at a time and summarize locally.
4. Follow markdown links only when they advance the current objective.
5. Stop once confidence is high and required context is complete.

### Authoring Rules

- Keep each reference file scoped to one complete concept.
- Keep reference content concise and practical.
- Add one-line YAML `description` to long-form docs.
- Put links inside meaningful prose, not isolated link dumps.
- Validate markdown links after edits.

### Templates

Use these templates when authoring layered skills:
- Skill template: `../../assets/skill/skill_md_template.md`
- Reference template: `../../assets/skill/skill_reference_template.md`
- Asset template: `../../assets/skill/skill_asset_template.md`

---

<!-- /ANCHOR:skill-structure-system -->
<!-- ANCHOR:related-resources -->
## 10. RELATED RESOURCES

### Templates
- [skill_md_template.md](../../assets/skill/skill_md_template.md) - SKILL.md file templates
- [skill_reference_template.md](../../assets/skill/skill_reference_template.md) - Reference file templates
- [skill_asset_template.md](../../assets/skill/skill_asset_template.md) - Asset file templates
- [frontmatter_templates.md](../../assets/documentation/frontmatter_templates.md) - Frontmatter by document type

### Reference Files
- [core_standards.md](../global/core_standards.md) - Document type rules and structural requirements
- [validation.md](../global/validation.md) - Quality scoring and validation workflows
- [quick_reference.md](../global/quick_reference.md) - Quick command reference
- [install_guide_creation.md](./install_guide_creation.md) - Install guide standards and workflow

---

*End of Skill Creation Workflow*
<!-- /ANCHOR:related-resources -->
