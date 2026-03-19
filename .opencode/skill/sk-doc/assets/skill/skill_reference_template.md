---
title: Skill Reference File Templates
description: Comprehensive templates for creating effective reference files for AI agent skills with workflows, decision logic, and validation checkpoints.
---

# Skill Reference File Templates - AI Agent Skills

Templates for creating reference files in AI agent skills with deep-dive technical guidance.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Location & Naming

**Location:** `.opencode/skill/[skill-name]/references/`

**Naming Convention:** snake_case with `.md` extension only

| ✅ Valid Names | ❌ Invalid Names |
|---------------|-----------------|
| `implementation_workflows.md` | `ImplementationWorkflows.md` (PascalCase) |
| `tool_catalog.md` | `tool-catalog.md` (kebab-case) |
| `debugging_guide.md` | `DebuggingGuide.MD` (wrong case) |
| `quick_reference.md` | `quickReference.md` (camelCase) |
| `code_quality_standards.md` | `code quality standards.md` (spaces) |

### When to Create References

**Create a reference file when:**
- Multi-phase workflows with validation checkpoints
- Decision trees with multiple branches
- Pattern libraries with 5+ variations
- Systematic debugging procedures
- Tool integration details
- Content exceeds 200 lines

**Keep in SKILL.md when:**
- Content under 200 lines
- Simple workflows (3-5 steps)
- Overview and "When to Use" sections
- Essential rules (ALWAYS/NEVER/ESCALATE IF)

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:document-structure -->
## 2. DOCUMENT STRUCTURE

### Retrieval Anchor Convention (Required)

Use retrieval anchors for every H2 section so section-level loading can target stable IDs.

**Format**:
- Open marker immediately before each H2: `<!-- ANCHOR:section-slug -->`
- Close marker immediately before the next H2 (or EOF): `<!-- /ANCHOR:section-slug -->`
- Slug rules: kebab-case from H2 text, strip numbering/emojis/punctuation
- Duplicate slugs: append `-2`, `-3`, etc.

**Example**:

```markdown
## 1. OVERVIEW

[Section content]

## 3. WHEN TO CREATE REFERENCE FILES
```

### Document Structure: Title and Intro

**CRITICAL: The intro after the H1 title must be 1-2 SHORT sentences only.**

```markdown
---
title: [Title]
description: [One-line description - same as intro]
---

# [Title]

[1-2 SHORT sentences only. Brief hook/summary. NO subsections, NO headers here.]

---

## 1. OVERVIEW
[All detailed content goes here, NOT in the intro]

```

> **WARNING: DO NOT duplicate content between intro and Section 1.**
> The intro is a hook; Section 1 provides the details.

#### ✅ GOOD Intro Structure

```markdown
# Git Commit Workflows

Step-by-step workflows for creating clean, atomic commits with proper filtering.

---

## 1. OVERVIEW

### Purpose
Provides systematic workflows for analyzing changes, filtering artifacts, and creating well-structured commits.

### When to Use
- Creating commits with multiple file changes
- Filtering generated files from commits
- Writing clear commit messages

### Core Principle
Atomic commits with clear intent + filtered artifacts = maintainable Git history.
```

#### ❌ BAD Intro Structure (duplicates content)

```markdown
# Git Commit Workflows

Step-by-step workflows for creating clean, atomic commits with proper filtering.

### Core Principle   ← WRONG: No headers in intro!
Atomic commits with clear intent + filtered artifacts = maintainable Git history.

### When to Use      ← WRONG: This belongs in Section 1!
- Creating commits with multiple file changes

---

## 1. OVERVIEW

### Purpose
Provides systematic workflows...  ← Now this duplicates the intro!

### Core Principle
Atomic commits...  ← DUPLICATED from intro!
```

#### Intro vs Section 1 Content Placement

| Content Type          | Intro (after H1) | Section 1 OVERVIEW |
| --------------------- | ---------------- | ------------------ |
| 1-2 sentence summary  | ✅ YES            | ❌ NO (don't repeat) |
| Core Principle        | ❌ NO             | ✅ YES              |
| When to Use           | ❌ NO             | ✅ YES              |
| Primary Sources       | ❌ NO             | ✅ YES (as "Key Sources") |
| Purpose (detailed)    | ❌ NO             | ✅ YES              |
| Prerequisites         | ❌ NO             | ✅ YES              |
| Any H3 subsections    | ❌ NEVER          | ✅ YES              |

---

### What Are AI Agent Skill Reference Files?

Reference files are detailed technical documentation in the `references/` directory that provide deep-dive guidance with **explicit reasoning** - making thought processes visible, showing decision logic, and analyzing root causes.

**Core Purpose**:
- **Technical depth** - Step-by-step reasoning with rationale
- **Phased workflows** - Structured processes with validation checkpoints
- **Pattern libraries** - Before/after examples, comparison tables
- **Tool integration** - MCP tools, scripts, asset references
- **Root cause analysis** - Systematic debugging and troubleshooting

**Key Difference from Generic Documentation**:
- AI agent skills = Actionable workflows with explicit reasoning
- Generic docs = Information reference without decision logic

### Progressive Disclosure in Skills

```
Level 1: Metadata (name + description)
         └─ Always in context (~100 words)
            ↓
Level 2: SKILL.md body
         └─ When skill triggers (<5k words)
            ↓
Level 3: Reference files (this document)
         └─ Loaded as needed (500-3000 lines per file)
```

**Reference files = Level 3**: Deep technical guidance loaded only when the agent needs specific workflow details.

---

<!-- /ANCHOR:document-structure -->
<!-- ANCHOR:when-to-create-reference-files -->
## 3. WHEN TO CREATE REFERENCE FILES

### Create Reference File When

**Workflow Complexity**:
- Multi-phase workflows with validation checkpoints
- Decision trees with multiple branches
- Pattern libraries with 5+ variations
- Systematic debugging procedures

**Technical Depth**:
- Root cause analysis required
- Tool integration details (MCP, scripts)
- Before/after code transformations
- Common error patterns and fixes

**Size Threshold**:
- Content exceeds 200 lines
- Multiple related workflows
- Extensive troubleshooting needed

### Keep in SKILL.md When

**Core Content**:
- Overview and "When to Use"
- High-level workflow (3-5 steps)
- Essential rules (ALWAYS/NEVER/ESCALATE IF)
  > **Note**: RULES sections in SKILL.md use semantic emojis on H3/H4: `### ✅ ALWAYS`, `### ❌ NEVER`, `### ⚠️ ESCALATE IF` (or `####` at phase depth). These are the ONLY rule-heading emojis allowed. See [skill_md_template.md](./skill_md_template.md) for the complete pattern.
- Quick reference

**Size**: Content under 200 lines

### Reference File Types for AI Agent Skills

| Type                | Purpose                                | Example (snake_case)          | Size           |
| ------------------- | -------------------------------------- | ----------------------------- | -------------- |
| **Workflow**        | Multi-phase processes with checkpoints | `implementation_workflows.md` | 500-1500 lines |
| **Pattern Library** | Code patterns with before/after        | `shared_patterns.md`          | 300-800 lines  |
| **Standards**       | Rules and conventions                  | `code_quality_standards.md`   | 400-1000 lines |
| **Debugging**       | Systematic troubleshooting             | `debugging_workflows.md`      | 600-1200 lines |
| **Tool Guide**      | MCP/external tool integration          | `devtools_guide.md`           | 200-600 lines  |
| **Quick Reference** | Commands, shortcuts, checklists        | `quick_reference.md`          | 200-400 lines  |

**Note:** All reference file names use snake_case (underscores, lowercase).

---

<!-- /ANCHOR:when-to-create-reference-files -->
<!-- ANCHOR:ai-agent-skill-reference-characteristics -->
## 4. AI AGENT SKILL REFERENCE CHARACTERISTICS

### Core Principle Statements

**Purpose**: Distill philosophy into one-line wisdom

> **PLACEMENT**: Core Principle goes in **Section 1 OVERVIEW**, NOT in the intro paragraph after the H1 title.

**Format**:
```markdown
## 1. OVERVIEW

### Core Principle

[Single powerful statement that captures the workflow's essence]
```

**Examples from Real Skills**:
- "Wait for the actual condition you care about, not a guess about how long it takes"
- "ALWAYS find root cause before attempting fixes. Symptom fixes are failure"
- "Atomic commits with clear intent + filtered artifacts = maintainable Git history"


### Phased Workflows with Validation

**Purpose**: Structured processes with mandatory checkpoints

**Format**:
```markdown
### The [Number] Phases

You MUST complete each phase before proceeding to the next.

#### Phase 1: [Phase Name]

**Purpose**: [What this phase accomplishes]

**Actions**:
1. [Action 1]
2. [Action 2]

**Validation**: `checkpoint_name`

#### Phase 2: [Phase Name]

[Similar structure]
```

**Key Elements**:
- **"You MUST complete"** - Mandatory language
- **Named checkpoints** - `checkpoint_name` for validation
- **Sequential phases** - Cannot skip ahead


### Before/After Code Examples

**Purpose**: Show transformation from wrong to right

**Format**:
```markdown
### [Pattern Name]

❌ **BEFORE**: [Problem description]
\```[language]
// Bad code with issues
// Showing what NOT to do
\```

✅ **AFTER**: [Solution description]
\```[language]
// Good code with fixes
// Showing correct approach
\```

**Why better**: [Explanation of improvement]
```

**Key Elements**:
- ❌ emoji for "before" (wrong way)
- ✅ emoji for "after" (right way)
- Inline comments explaining issues
- "Why better" rationale


### Pattern Comparison Tables

**Purpose**: Compare approaches across scenarios

**Format**:
```markdown
### Common Patterns

| Scenario     | Approach A (Wrong) | Approach B (Right) | Why Better  |
| ------------ | ------------------ | ------------------ | ----------- |
| [Scenario 1] | [Wrong way]        | [Right way]        | [Rationale] |
| [Scenario 2] | [Wrong way]        | [Right way]        | [Rationale] |
```

**Use when**: Multiple scenarios need comparison


### Decision Logic in Markdown

**Purpose**: Explicit if/then logic for workflow decisions

**Format**:
\```markdown
### Decision Logic

\```markdown
IF [condition A]:
  → [Action/Path A]
  → [Expected outcome A]

IF [condition B]:
  → [Action/Path B]
  → [Expected outcome B]

IF [condition C]:
  → [Action/Path C]
  → [Expected outcome C]
\```
\```

**Alternative format** (decision tree):
\```markdown
\```
Analyze situation
├─ Condition A met
│  └─ Execute Workflow A
│     └─ Expected outcome A
├─ Condition B met
│  └─ Execute Workflow B
│     └─ Expected outcome B
└─ Condition C met
   └─ Execute Workflow C
      └─ Expected outcome C
\```
\```


### Validation Checkpoints

**Purpose**: Named checkpoints throughout workflows

**Format**:
```markdown
**Validation**: `checkpoint_name`
```

**Examples**:
- `files_analyzed`
- `artifacts_filtered`
- `strategy_determined`
- `root_cause_identified`

**Usage**: Reference in quality checklists and debugging


### Prerequisites Section

**Purpose**: Link to required standards and context

> **PLACEMENT**: Prerequisites go in **Section 1 OVERVIEW**, NOT in the intro paragraph.

**Format**:
```markdown
# [Workflow Name]

[1-2 sentence summary only - no prerequisites here]

---

## 1. OVERVIEW

### Prerequisites
Follow [standard name] for all implementations:
- **[Standard 1]**: [Brief description]
- **[Standard 2]**: [Brief description]
- See [standard_file.md](./standard_file.md) for complete requirements
```

**Key Elements**:
- Appears in Section 1 OVERVIEW, not intro
- Links to other reference files
- Lists specific requirements


### Tool Integration References

**Purpose**: Show MCP tool usage, script execution, asset references

**Format for MCP Tools**:
\```markdown
**Automated [Task] via MCP:**

Instead of [manual approach], use Chrome DevTools MCP:

\```markdown
1. [Step 1]:
   [Use tool: mcp__chrome_devtools__tool_name]
   - parameter1: "value"
   - parameter2: value

2. [Step 2]:
   [Use tool: mcp__chrome_devtools__tool_name]
\```

**What you'll see:**
- [Expected output 1]
- [Expected output 2]

**Example output:**
\```json
{
  "field": "value",
  "data": "example"
}
\```
\```

**Format for Scripts**:
```markdown
**See also:** [script_name.js](../scripts/script_name.js) for production-ready implementation
```

**Format for Assets**:
```markdown
**See also:** [template_name.md](../assets/template_name.md) for complete templates
```


### Common Error Patterns

**Purpose**: Document actual errors with explanations

**Format**:
\```markdown
**Common [System/Browser] Errors:**

\```javascript
// [Actual error message]
// → [What it means]
// → [How to fix]

// [Another error message]
// → [What it means]
// → [How to fix]
\```
\```

**Example**:
\```markdown
**Common Browser Errors:**

\```javascript
// Uncaught TypeError: Cannot read property 'X' of undefined
// → Variable is undefined, check initialization
// → Verify element exists before accessing properties

// Failed to load resource: net::ERR_BLOCKED_BY_CLIENT
// → Ad blocker or browser extension blocking resource
// → Check Network tab, test with extensions disabled
\```
\```


### Scope Limitations

**Purpose**: Explicitly state what's in/out of scope

**Format**:
```markdown
**Note:** [Clarification of what IS supported]

**Out of scope:** [What is NOT supported]
```

**Example**:
```markdown
**Note:** All browser testing done via Chrome DevTools MCP.

**Out of scope:** Cross-browser testing in Firefox, Safari (MCP is Chrome-only)
```


### Browser Testing Checklists

**Purpose**: Specific viewport tests with checkboxes

**Format**:
\```markdown
**Browser Testing Checklist:**

\```markdown
□ Chrome (via Chrome DevTools MCP)
□ Mobile viewport (375px) - use DevTools emulation
□ Tablet viewport (768px) - use DevTools emulation
□ Desktop viewport (1920px)
□ Test viewport transitions (320px, 768px, 1920px)
\```
\```

---

### Phased Workflow with Checkpoints Example

**Purpose**: Show complete workflow with validation gates

**Format**:
```yaml
implementation_workflow:
  phase_1_preparation:
    purpose: "Gather context and analyze requirements"
    actions:
      - "Read user request carefully"
      - "Identify affected files and systems"
      - "Review relevant documentation"
    checkpoint: "requirements_understood"
    validation_questions:
      - "Can I clearly explain what needs to be done?"
      - "Do I know which files will change?"
      - "Are there any unclear requirements?"

  phase_2_design:
    purpose: "Plan the implementation approach"
    depends_on: "phase_1_preparation"
    actions:
      - "Choose simplest solution that works"
      - "Identify potential edge cases"
      - "Plan validation strategy"
    checkpoint: "design_approved"
    validation_questions:
      - "Is this the simplest approach?"
      - "Have I considered edge cases?"
      - "Can I test this effectively?"

  phase_3_implementation:
    purpose: "Execute the planned changes"
    depends_on: "phase_2_design"
    actions:
      - "Make code changes following standards"
      - "Add necessary tests"
      - "Update documentation"
    checkpoint: "changes_complete"
    validation_questions:
      - "Do all tests pass?"
      - "Is code documented?"
      - "Are standards followed?"

  phase_4_validation:
    purpose: "Verify correctness and quality"
    depends_on: "phase_3_implementation"
    actions:
      - "Run full test suite"
      - "Check code quality metrics"
      - "Review against requirements"
    checkpoint: "quality_verified"
    validation_questions:
      - "Do all tests pass?"
      - "Are quality metrics met?"
      - "Does this satisfy the original request?"
```

**Example in Markdown Reference**:
```markdown
### Implementation Workflow

You MUST complete each phase before proceeding to the next.

#### Phase 1: Preparation

**Purpose**: Gather context and analyze requirements

**Actions**:
1. Read user request carefully
2. Identify affected files and systems
3. Review relevant documentation

**Validation**: `requirements_understood`
- Can I clearly explain what needs to be done?
- Do I know which files will change?
- Are there any unclear requirements?

#### Phase 2: Design

**Purpose**: Plan the implementation approach

**Actions**:
1. Choose simplest solution that works
2. Identify potential edge cases
3. Plan validation strategy

**Validation**: `design_approved`
- Is this the simplest approach?
- Have I considered edge cases?
- Can I test this effectively?

[Continue with remaining phases...]
```

---

<!-- /ANCHOR:ai-agent-skill-reference-characteristics -->
<!-- ANCHOR:converting-logic-to-executable-code -->
## 5. CONVERTING LOGIC TO EXECUTABLE CODE

### When to Extract Logic from Markdown

**Purpose**: Separate documentation from executable code for better maintainability, testability, and reusability.

**Decision Criteria**:

| Pattern Type          | Keep in Markdown  | Extract to Code           | Reasoning                                    |
| --------------------- | ----------------- | ------------------------- | -------------------------------------------- |
| **Python functions**  | ❌ No              | ✅ Yes → `/scripts/*.py`   | Type safety, unit testing, reusability       |
| **YAML configs**      | ❌ No              | ✅ Yes → `/assets/*.yaml`  | Dynamic loading, version control, validation |
| **Decision trees**    | ⚠️ High-level only | ✅ Details → YAML + Python | Machine-readable, can be validated           |
| **Command mappings**  | ⚠️ Examples only   | ✅ Full map → YAML         | Easier maintenance, can be imported          |
| **Workflow diagrams** | ✅ Yes (generated) | ✅ Source → YAML           | YAML = source of truth, diagram = output     |
| **Checklists**        | ✅ Yes             | ❌ No                      | Human-readable is primary use case           |
| **Before/after code** | ✅ Yes             | ❌ No                      | Educational, not executable                  |

### Extraction Pattern

**In Markdown (Reference File)**:
```markdown
### [Workflow Name]

[High-level description of what the workflow does]

**Implementation:** See [workflow_name.py](../scripts/workflow_name.py) for execution logic and [workflow_config.yaml](../assets/workflow_config.yaml) for configuration.

**Quick Overview**:
1. [Step 1 - high level]
2. [Step 2 - high level]
3. [Step 3 - high level]

**Configuration Options:**
- See YAML config for customizable parameters
- Default values optimized for common use cases
```

### Benefits of Separation

- **Type safety** - Python type hints catch errors at development time
- **Testability** - Unit tests for logic, integration tests for workflows
- **Reusability** - Imported by multiple skills or scripts
- **Version control** - Git diffs show logic changes clearly
- **Schema validation** - YAML can be validated against schemas
- **Dynamic loading** - Configuration changes without code edits

### Example: Mode Detection Extraction

**❌ BEFORE** (inline Python in markdown):
\```python
def detect_mode(request):
    if '$quick' in request: return 'quick', 5
    elif '$ticket' in request: return 'ticket', 10
    return 'interactive', 10
\```

**✅ AFTER** (extracted with type safety):

`/scripts/mode_detection.py`:
\```python
from dataclasses import dataclass

@dataclass
class ModeConfig:
    mode: str
    depth_rounds: int

def detect_mode(request: str) -> ModeConfig:
    """Detect mode from command shortcuts."""
    if '$quick' in request:
        return ModeConfig('quick', 5)
    elif '$ticket' in request:
        return ModeConfig('ticket', 10)
    return ModeConfig('interactive', 10)
\```

`/tests/test_mode_detection.py`:
\```python
def test_quick_mode():
    assert detect_mode("$quick fix").mode == 'quick'
\```

**Why better:** Type hints, testable, reusable, separated from docs

---

<!-- /ANCHOR:converting-logic-to-executable-code -->
<!-- ANCHOR:yaml-configuration-patterns -->
## 6. YAML CONFIGURATION PATTERNS

### Purpose

**YAML for configuration data** - Separate configuration from documentation for easier maintenance and dynamic loading.

**When to use YAML**:
- Configuration data (thresholds, mappings, rules)
- Data structures (nested objects, lists)
- Workflow definitions (step sequences, pipelines)
- Decision trees (conditional logic patterns)
- Validation schemas

### Standard YAML Structure

```yaml
# [config_name].yaml
metadata:
  version: "1.0.0"
  description: "Configuration for [feature name]"

config:
  threshold_values:
    low: 1
    medium: 5
    high: 10
  feature_flags:
    enable_feature_x: true
  mappings:
    $quick: "quick_mode"
    $ticket: "ticket_mode"
```

### File Organization

```
.opencode/skill/[skill-name]/
├── assets/
│   ├── workflow_configs/
│   │   ├── canvas_methodology.yaml
│   │   ├── variant_detection.yaml
│   │   └── complexity_scoring.yaml
│   ├── mappings/
│   │   ├── command_mappings.yaml
│   │   ├── mode_recognition.yaml
│   │   └── shortcut_definitions.yaml
│   └── templates/
│       └── [template files]
```

### Loading Pattern (Python)

```python
import yaml
from pathlib import Path

def load_config(config_name: str) -> dict:
    """Load YAML config from assets directory."""
    config_path = Path(__file__).parent.parent / f"assets/{config_name}.yaml"
    with open(config_path) as f:
        return yaml.safe_load(f)['config']

# Usage
config = load_config("canvas_methodology")
```

### Example: Variant Detection Rules

**❌ BEFORE** (markdown table):
```markdown
| Trigger                    | Action             |
| -------------------------- | ------------------ |
| "show options"             | Offer 3-5 variants |
| Complexity 7+ + "not sure" | Offer variants     |
```

**✅ AFTER** (YAML + Python):

`/assets/variant_detection_rules.yaml`:
```yaml
config:
  variant_triggers:
    explicit_keywords: ["show me options", "variations"]
    implicit:
      complexity_threshold: 7
      uncertainty_signals: ["not sure", "what would work"]
  variant_count:
    simple: [2, 3]
    complex: [5, 10]
```

`/scripts/variant_detector.py`:
```python
import yaml

class VariantDetector:
    def __init__(self, config_path: str):
        with open(config_path) as f:
            self.config = yaml.safe_load(f)['config']

    def should_generate_variants(self, request: str, complexity: int) -> bool:
        keywords = self.config['variant_triggers']['explicit_keywords']
        if any(kw in request.lower() for kw in keywords):
            return True

        threshold = self.config['variant_triggers']['implicit']['complexity_threshold']
        if complexity >= threshold:
            signals = self.config['variant_triggers']['implicit']['uncertainty_signals']
            return any(s in request.lower() for s in signals)
        return False
```

**Why better:** Dynamic config loading, easier maintenance, schema validation possible

---

<!-- /ANCHOR:yaml-configuration-patterns -->
<!-- ANCHOR:python-script-integration -->
## 7. PYTHON SCRIPT INTEGRATION

### When to Use Python for Logic

**Use Python scripts when**:
- Procedural logic (workflows, algorithms)
- Complex conditionals (multi-step decisions)
- Data transformation (processing, validation)
- API integration (external services)
- File operations (reading, parsing, generating)

### Type Hints and Docstring Standards

**Always include**:
- Type hints for parameters and return values
- Google-style docstrings (Args, Returns, Raises, Examples)
- Dataclasses for structured data

**Example**:
```python
from dataclasses import dataclass
from pathlib import Path

@dataclass
class ValidationResult:
    is_valid: bool
    errors: list[str]

def validate_config(config_path: Path) -> ValidationResult:
    """
    Validate configuration file.

    Args:
        config_path: Path to YAML config file

    Returns:
        ValidationResult with status and errors

    Raises:
        FileNotFoundError: If config doesn't exist
    """
    if not config_path.exists():
        raise FileNotFoundError(f"Config not found: {config_path}")
    # Validation logic
    return ValidationResult(is_valid=True, errors=[])
```

### Unit Testing Requirements

**Every Python script must have tests**:
- Naming: `test_[script_name].py` in `/tests/` directory
- Coverage: ≥80% line coverage
- Framework: pytest

**Example**:
```python
import pytest
from scripts.config_validator import validate_config

def test_validate_success(tmp_path):
    config = tmp_path / "config.yaml"
    config.write_text("config:\n  threshold: 5")
    result = validate_config(config)
    assert result.is_valid

def test_validate_missing_file():
    with pytest.raises(FileNotFoundError):
        validate_config(Path("nonexistent.yaml"))
```

### Import and Reference Patterns

**Python import order**: Standard library → Third-party → Local

**Markdown references**:
```markdown
**See also:** [script_name.py](../scripts/script_name.py), [config.yaml](../assets/config.yaml)
```

### Example: Workflow Decision Logic

**❌ BEFORE** (text decision tree):
```markdown
IF "$quick": use quick mode (5 rounds)
IF "$ticket": use ticket mode (10 rounds)
OTHERWISE: use interactive mode
```

**✅ AFTER** (Python with type safety):

`/scripts/workflow_router.py`:
```python
from typing import Literal
from dataclasses import dataclass

WorkflowMode = Literal["quick", "ticket", "interactive"]

@dataclass
class WorkflowDecision:
    mode: WorkflowMode
    depth_rounds: int

def route_workflow(request: str) -> WorkflowDecision:
    """Route request to appropriate workflow."""
    if '$quick' in request.lower():
        return WorkflowDecision("quick", 5)
    if '$ticket' in request.lower():
        return WorkflowDecision("ticket", 10)
    return WorkflowDecision("interactive", 10)
```

`/tests/test_workflow_router.py`:
```python
def test_quick_mode():
    assert route_workflow("$quick fix").mode == "quick"

def test_default_mode():
    assert route_workflow("help me").mode == "interactive"
```

**Why better:** Type-safe with Literal, testable, structured with dataclass

---

<!-- /ANCHOR:python-script-integration -->
<!-- ANCHOR:standard-structure-template -->
## 8. STANDARD STRUCTURE TEMPLATE

### Complete Skill Directory Structure

**Path:** `.opencode/skill/` (singular, not `skills` or `openskills`)

```
.opencode/skill/[skill-name]/
├── SKILL.md                    # Main skill file (Level 2 in progressive disclosure)
├── references/                 # Deep-dive technical documentation (Level 3)
│   ├── workflow_name.md        # Multi-phase workflows with checkpoints (snake_case)
│   ├── patterns_library.md     # Before/after code patterns (snake_case)
│   ├── debugging_guide.md      # Systematic troubleshooting (snake_case)
│   └── quick_reference.md      # Commands, shortcuts, checklists (snake_case)
├── scripts/                    # Executable Python logic
│   ├── mode_detection.py       # Procedural logic, algorithms
│   ├── workflow_router.py      # Decision logic
│   ├── config_validator.py     # Data transformation
│   └── __init__.py             # Package initialization
├── assets/                     # Configuration and data files
│   ├── workflow_configs/       # YAML workflow definitions
│   │   ├── canvas_methodology.yaml
│   │   └── complexity_scoring.yaml
│   ├── mappings/               # YAML mapping data
│   │   ├── command_mappings.yaml
│   │   └── mode_recognition.yaml
│   └── templates/              # Markdown/code templates
│       ├── template_name.md
│       └── component_template.tsx
└── tests/                      # Unit and integration tests
    ├── test_mode_detection.py
    ├── test_workflow_router.py
    ├── test_config_validator.py
    └── __init__.py
```

### Directory Purposes

**SKILL.md** (Required): Overview, workflow (3-5 steps), rules. Target: <200 lines

**references/** (Optional): Detailed workflows, patterns, debugging. Target: 500-3000 lines/file. **All filenames must use snake_case.**

**scripts/** (Optional): Python logic - procedural, routing, validation. Requires type hints, tests

**assets/** (Optional): YAML configs, workflow definitions, templates, mappings

**tests/** (Required if scripts/ exists): Unit tests with ≥80% coverage, pytest, `test_[name].py`

### When to Create Each Directory

| Directory     | Create When                                                     | Don't Create When                           |
| ------------- | --------------------------------------------------------------- | ------------------------------------------- |
| `references/` | Content >200 lines, multi-phase workflows, systematic debugging | Simple skills <200 lines total              |
| `scripts/`    | Python logic extracted from markdown, reusable functions        | Pure documentation, no executable logic     |
| `assets/`     | YAML configs, templates, structured data                        | No configuration data, inline examples only |
| `tests/`      | `scripts/` directory exists                                     | No Python scripts to test                   |

### Integration Pattern

**How components work together:**
- SKILL.md references scripts: `[workflow_router.py](./scripts/workflow_router.py)`
- Scripts load configs: `yaml.safe_load(f"../assets/config.yaml")`
- Tests verify scripts: `assert route_workflow("input").mode == "expected"`
- Markdown links to all: "See [script.py](../scripts/), [config.yaml](../assets/)"

---

<!-- /ANCHOR:standard-structure-template -->
<!-- ANCHOR:related-resources -->
## 9. RELATED RESOURCES

### Templates
- [frontmatter_templates.md](../documentation/frontmatter_templates.md) - Frontmatter by document type
- [skill_md_template.md](./skill_md_template.md) - If converting to skill
- [skill_asset_template.md](./skill_asset_template.md) - Asset file creation guide

### Standards
- [core_standards.md](../../references/global/core_standards.md) - Document type rules
- [skill_creation.md](../../references/specific/skill_creation.md) - Complete skill creation workflow
<!-- /ANCHOR:related-resources -->
