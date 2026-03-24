#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: SKILL INITIALIZER
# ───────────────────────────────────────────────────────────────

"""
Skill Initializer - Creates a new skill from template

Usage:
    init_skill.py <skill-name> --path <path>

Examples:
    init_skill.py my-new-skill --path skills/public
    init_skill.py my-api-helper --path skills/private
    init_skill.py custom-skill --path /custom/location
"""

import argparse
import re
import sys
from pathlib import Path
from typing import Final, Optional


# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────

SKILL_TEMPLATE: Final[str] = """---
name: {skill_name}
description: This skill [TODO: Complete - what does it do?]. This skill should be used when [TODO: Complete - when to use it? Specific scenarios, file types, or tasks that trigger it.]
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
---

# {skill_title}

[TODO: 1-2 sentences explaining what this skill enables and its primary purpose]

---

## 1. WHEN TO USE

**This skill should be used when**:
- [TODO: List specific scenarios when this skill applies]
- [TODO: File types or tasks that trigger it]
- [TODO: User goals or requirements]

**This skill should NOT be used for**:
- [TODO: List scenarios where skill is not appropriate]
- [TODO: Alternative approaches or tools]

---

## 2. SMART ROUTING

### Activation Detection

```
User Request
    ↓
[Condition Check]
    ├─ YES → Load: references/[relevant].md
    └─ NO → Skip this skill
```

### Resource Router

| Condition | Resource | Purpose |
|-----------|----------|---------|
| [condition_1] | `references/[file].md` | [purpose] |
| [condition_2] | `scripts/[script].py` | [purpose] |

---

## 3. REFERENCES

### Core References

| Document | Purpose | Key Insight |
|----------|---------|-------------|
| [TODO: reference-name.md](references/reference-name.md) | [TODO: What it documents] | [TODO: Key takeaway] |

### Templates

| Template | Purpose | Usage |
|----------|---------|-------|
| [TODO: template-name.md](assets/template-name.md) | [TODO: What it provides] | [TODO: When to use] |

---

## 4. HOW IT WORKS

[TODO: Brief explanation of the skill's process/workflow]

**Process**:
1. [TODO: Step 1]
2. [TODO: Step 2]
3. [TODO: Step 3]

**Output**: [TODO: What the skill produces/delivers]

[TODO: Add your main content here:
- Code samples for technical skills
- Step-by-step procedures for workflows
- Concrete examples with realistic user requests
- Decision trees for complex processes
- References to scripts/references/assets as needed]

---

## 5. RULES

### ✅ ALWAYS

- [TODO: List required behaviors]
- [TODO: Best practices to follow]
- [TODO: Quality standards]

### ❌ NEVER

- [TODO: List forbidden actions]
- [TODO: Common mistakes to avoid]
- [TODO: Anti-patterns]

### ⚠️ ESCALATE IF

- [TODO: When to ask user for help]
- [TODO: Situations requiring clarification]
- [TODO: Blockers or edge cases]

---

## 6. SUCCESS CRITERIA

**Task complete when**:
- ✅ [TODO: First success criterion]
- ✅ [TODO: Second success criterion]
- ✅ [TODO: Third success criterion]

---

## 7. INTEGRATION POINTS

**Triggers**: [TODO: What activates this skill]

**Pairs With**:
- [TODO: Related skills or tools]
- [TODO: Complementary functionality]

**Related Resources**:
- [reference-name.md](./references/reference-name.md) - [TODO: Description]
- [template-name.md](./assets/template-name.md) - [TODO: Description]
- `related-skill-name` - [TODO: How it relates to this skill]

---

## 8. QUICK REFERENCE

[TODO: Add quick lookup information:
- Key commands or syntax
- Common patterns
- File locations
- Important rules or constraints]

---

## 9. BUNDLED RESOURCES

This skill includes example resource directories. Delete any you don't need:

### scripts/
Executable code (Python/Bash/etc.) for deterministic operations or repeatedly rewritten code.

**Examples**: `example.py` (see scripts/ directory)

**When to use**: Code that needs consistent execution, data processing, file manipulation

### references/
Documentation loaded into context to inform the agent's process.

**Examples**: `api_reference.md` (see references/ directory)

**When to use**: API docs, schemas, detailed workflows, domain knowledge

### assets/
Files used in output (not loaded into context).

**Examples**: `example_asset.txt` (see assets/ directory)

**When to use**: Templates, images, fonts, boilerplate code, sample data

**Note**: Delete unneeded directories - not every skill requires all three types.
"""

EXAMPLE_SCRIPT: Final[str] = '''#!/usr/bin/env python3
"""
Example helper script for {skill_name}

This is a placeholder script that can be executed directly.
Replace with actual implementation or delete if not needed.

Example real scripts from other skills:
- pdf/scripts/fill_fillable_fields.py - Fills PDF form fields
- pdf/scripts/convert_pdf_to_images.py - Converts PDF pages to images
"""

def main():
    print("This is an example script for {skill_name}")
    # TODO: Add actual script logic here
    # This could be data processing, file conversion, API calls, etc.

if __name__ == "__main__":
    main()
'''

EXAMPLE_REFERENCE: Final[str] = """# Reference Documentation for {skill_title}

This is a placeholder for detailed reference documentation.
Replace with actual reference content or delete if not needed.

Example real reference docs from other skills:
- product-management/references/communication.md - Comprehensive guide for status updates
- product-management/references/context_building.md - Deep-dive on gathering context
- bigquery/references/ - API references and query examples

## When Reference Docs Are Useful

Reference docs are ideal for:
- Comprehensive API documentation
- Detailed workflow guides
- Complex multi-step processes
- Information too lengthy for main SKILL.md
- Content that's only needed for specific use cases

## Structure Suggestions

### API Reference Example
- Overview
- Authentication
- Endpoints with examples
- Error codes
- Rate limits

### Workflow Guide Example
- Prerequisites
- Step-by-step instructions
- Common patterns
- Troubleshooting
- Best practices
"""

EXAMPLE_ASSET: Final[str] = """# Example Asset File

This placeholder represents where asset files would be stored.
Replace with actual asset files (templates, images, fonts, etc.) or delete if not needed.

Asset files are NOT intended to be loaded into context, but rather used within
the output the agent produces.

Example asset files from other skills:
- Brand guidelines: logo.png, slides_template.pptx
- Frontend builder: hello-world/ directory with HTML/React boilerplate
- Typography: custom-font.ttf, font-family.woff2
- Data: sample_data.csv, test_dataset.json

## Common Asset Types

- Templates: .pptx, .docx, boilerplate directories
- Images: .png, .jpg, .svg, .gif
- Fonts: .ttf, .otf, .woff, .woff2
- Boilerplate code: Project directories, starter files
- Icons: .ico, .svg
- Data files: .csv, .json, .xml, .yaml

Note: This is a text placeholder. Actual assets can be any file type.
"""


# ───────────────────────────────────────────────────────────────
# 2. VALIDATION
# ───────────────────────────────────────────────────────────────

def validate_skill_name(skill_name: str) -> tuple[bool, str]:
    """Validate skill name format (hyphen-case).

    Args:
        skill_name: The skill name to validate.

    Returns:
        Tuple of (is_valid, error_message). Error message is empty if valid.
    """
    if not re.match(r'^[a-z][a-z0-9-]*[a-z0-9]$', skill_name):
        return False, (
            f"Skill name '{skill_name}' must be hyphen-case:\n"
            "   - Start with a lowercase letter\n"
            "   - End with a lowercase letter or number\n"
            "   - Contain only lowercase letters, numbers, and hyphens\n"
            "   Examples: my-skill, pdf-editor, code-review-v2"
        )

    if len(skill_name) > 40:
        return False, f"Skill name '{skill_name}' exceeds 40 character limit ({len(skill_name)} chars)"

    if '--' in skill_name:
        return False, f"Skill name '{skill_name}' cannot contain consecutive hyphens (--)"

    return True, ""


def title_case_skill_name(skill_name: str) -> str:
    """Convert hyphenated skill name to Title Case for display.

    Args:
        skill_name: Hyphen-case skill name (e.g., 'my-skill').

    Returns:
        Title-cased string (e.g., 'My Skill').
    """
    return ' '.join(word.capitalize() for word in skill_name.split('-'))


# ───────────────────────────────────────────────────────────────
# 3. SCAFFOLDING
# ───────────────────────────────────────────────────────────────

def init_skill(skill_name: str, path: str) -> Optional[Path]:
    """Initialize a new skill directory with template SKILL.md.

    Args:
        skill_name: Hyphen-case skill name (e.g., 'my-skill').
        path: Parent directory path where skill folder will be created.

    Returns:
        Path to created skill directory, or None on failure.
    """
    is_valid, error_msg = validate_skill_name(skill_name)
    if not is_valid:
        print(f"❌ Error: {error_msg}")
        return None

    skill_dir = Path(path).resolve() / skill_name

    if skill_dir.exists():
        print(f"❌ Error: Skill directory already exists: {skill_dir}")
        return None

    try:
        skill_dir.mkdir(parents=True, exist_ok=False)
        print(f"✅ Created skill directory: {skill_dir}")
    except OSError as exc:
        print(f"❌ Error creating directory: {exc}")
        return None

    skill_title = title_case_skill_name(skill_name)
    skill_content = SKILL_TEMPLATE.format(
        skill_name=skill_name,
        skill_title=skill_title
    )

    skill_md_path = skill_dir / 'SKILL.md'
    try:
        skill_md_path.write_text(skill_content)
        print("✅ Created SKILL.md")
    except OSError as exc:
        print(f"❌ Error creating SKILL.md: {exc}")
        return None

    try:
        scripts_dir = skill_dir / 'scripts'
        scripts_dir.mkdir(exist_ok=True)
        example_script = scripts_dir / 'example.py'
        example_script.write_text(EXAMPLE_SCRIPT.format(skill_name=skill_name))
        example_script.chmod(0o755)
        print("✅ Created scripts/example.py")

        references_dir = skill_dir / 'references'
        references_dir.mkdir(exist_ok=True)
        example_reference = references_dir / 'api_reference.md'
        example_reference.write_text(EXAMPLE_REFERENCE.format(skill_title=skill_title))
        print("✅ Created references/api_reference.md")

        assets_dir = skill_dir / 'assets'
        assets_dir.mkdir(exist_ok=True)
        example_asset = assets_dir / 'example_asset.txt'
        example_asset.write_text(EXAMPLE_ASSET)
        print("✅ Created assets/example_asset.txt")
    except OSError as exc:
        print(f"❌ Error creating resource directories: {exc}")
        return None

    print(f"\n✅ Skill '{skill_name}' initialized successfully at {skill_dir}")
    print("\nNext steps:")
    print("1. Edit SKILL.md to complete the TODO items and update the description")
    print("2. Customize or delete the example files in scripts/, references/, and assets/")
    print("3. Run the validator when ready to check the skill structure")

    return skill_dir


# ───────────────────────────────────────────────────────────────
# 4. MAIN
# ───────────────────────────────────────────────────────────────

def main() -> None:
    """CLI entry point for skill initialization."""
    parser = argparse.ArgumentParser(
        description="Create a new skill from the sk-doc template."
    )
    parser.add_argument(
        'skill_name',
        help="Hyphen-case skill name (e.g., my-new-skill)",
    )
    parser.add_argument(
        '--path',
        required=True,
        help="Destination parent directory for the skill",
    )
    args = parser.parse_args()

    skill_name = args.skill_name
    path = args.path

    print(f"🚀 Initializing skill: {skill_name}")
    print(f"   Location: {path}")
    print()

    result = init_skill(skill_name, path)

    if result:
        sys.exit(0)
    else:
        sys.exit(1)


if __name__ == "__main__":
    main()
