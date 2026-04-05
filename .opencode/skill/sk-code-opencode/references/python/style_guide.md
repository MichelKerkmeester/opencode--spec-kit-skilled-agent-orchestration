---
title: Python Style Guide
description: Coding conventions and formatting standards for Python scripts in the OpenCode development environment.
---

# Python Style Guide

Coding conventions and formatting standards for Python scripts in the OpenCode development environment.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Defines consistent styling rules for Python code to ensure readability, maintainability, and alignment across all OpenCode Python scripts.

### Scope

Applies to all Python files in:
- `.opencode/skill/scripts/` - Skill routing scripts (skill_advisor.py)
- `.opencode/skill/*/scripts/` - Skill-specific scripts
- `scripts/` - Project-level automation

### Key Sources

| File | Evidence |
|------|----------|
| `skill_advisor.py` | Header format, naming conventions, docstrings |
| `package_skill.py` | Function structure, early returns, type hints |

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:file-structure -->
## 2. FILE STRUCTURE

### Shebang Line

**ALWAYS** start Python scripts with the portable shebang:

```python
#!/usr/bin/env python3
```

**Evidence**: `skill_advisor.py:1`

### File Header

Use the box-style header for component identification:

```python
#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: [COMPONENT NAME]
# ───────────────────────────────────────────────────────────────
```

**Alternative** (full box for major scripts):

```python
#!/usr/bin/env python3
# ╔══════════════════════════════════════════════════════════════════════════╗
# ║ [Script Name]                                                             ║
# ╚══════════════════════════════════════════════════════════════════════════╝
```

**Evidence**: `skill_advisor.py:1-4`

### Module Docstring

Place immediately after the header, before imports:

```python
"""
Brief description of what this module does.

Usage: python script_name.py [arguments]
Output: Description of output format

Options:
    --flag      Description of flag
    --option    Description of option
"""
```

**Evidence**: `skill_advisor.py:6-16`

### Import Order

Follow PEP 8 import ordering:

```python
# 1. Standard library imports
import sys
import json
import os
import re
from pathlib import Path
from typing import Tuple, List, Dict, Optional

# 2. Third-party imports (if any)
import yaml

# 3. Local imports (if any)
from .utils import helper_function
```

**Evidence**: `skill_advisor.py:17-22`, `package_skill.py:25-30`

### Section Comments

Organize code into logical sections using consistent dividers:

```python
# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────

CONSTANT_VALUE = "value"

# ───────────────────────────────────────────────────────────────
# 2. VALIDATION FUNCTIONS
# ───────────────────────────────────────────────────────────────

def validate_something():
    pass
```

**Evidence**: `skill_advisor.py:25-27`, `package_skill.py:32-34`

---

<!-- /ANCHOR:file-structure -->
<!-- ANCHOR:naming-conventions -->
## 3. NAMING CONVENTIONS

### Functions and Variables

**Use**: `snake_case` (lowercase with underscores)

```python
# Functions
def validate_frontmatter(content: str) -> Tuple[bool, str]:
    pass

def get_script_dir() -> Path:
    pass

# Variables
user_request = "input"
file_path = Path("/some/path")
is_valid = True
```

**Evidence**: `skill_advisor.py:379`, `package_skill.py:87`

### Classes

**Use**: `PascalCase`

```python
class SkillValidator:
    pass

class ValidationResult:
    pass
```

### Constants

**Use**: `UPPER_SNAKE_CASE`

```python
STOP_WORDS = {'a', 'an', 'the'}
REQUIRED_FRONTMATTER_FIELDS = ['name', 'description']
MAX_SKILL_MD_WORDS = 5000
```

**Evidence**: `skill_advisor.py:31-49`, `package_skill.py:37-81`

### Private Functions

**Use**: Single leading underscore for internal/helper functions:

```python
def _parse_frontmatter(content: str) -> dict:
    """Internal helper - not part of public API."""
    pass
```

---

<!-- /ANCHOR:naming-conventions -->
<!-- ANCHOR:type-hints -->
## 4. TYPE HINTS

### Function Signatures

**ALWAYS** include type hints for function parameters and return values:

```python
def validate_config(config_path: Path) -> Tuple[bool, str, List[str]]:
    """Validate configuration file."""
    pass

def process_data(data: Dict[str, Any], strict: bool = True) -> Optional[str]:
    """Process data with optional strict mode."""
    pass
```

**Evidence**: `package_skill.py:87-93`

### Common Type Patterns

```python
from typing import Tuple, List, Dict, Optional, Any, Union
from pathlib import Path

# Return tuple with multiple values
def func() -> Tuple[bool, str, List[str]]:
    pass

# Optional return (can be None)
def func() -> Optional[str]:
    pass

# Dictionary with typed values
def func() -> Dict[str, Any]:
    pass
```

---

<!-- /ANCHOR:type-hints -->
<!-- ANCHOR:docstrings -->
## 5. DOCSTRINGS

### Google-Style Format

Use Google-style docstrings for all public functions:

```python
def validate_frontmatter(content: str) -> Tuple[bool, str, List[str], Dict]:
    """
    Validate SKILL.md frontmatter against skill_md_template.md requirements.

    Args:
        content: The full file content as a string

    Returns:
        Tuple of (is_valid, error_message, warnings, parsed_frontmatter)

    Raises:
        ValueError: If content is empty
    """
    pass
```

**Evidence**: `package_skill.py:87-93`

### Class Docstrings

```python
class SkillPackager:
    """
    Creates distributable packages from skill folders.

    Validates against skill creation standards and produces
    a zip file ready for distribution.

    Attributes:
        skill_path: Path to the skill directory
        output_dir: Directory for packaged output
    """
    pass
```

### Module Docstrings

```python
"""
Skill Packager - Creates a distributable zip file of a skill folder

Validates against skill creation standards:
- skill_creation.md: Overall skill requirements
- skill_md_template.md: SKILL.md structure requirements

Usage:
    python package_skill.py <path/to/skill-folder> [output-directory]
    python package_skill.py <path/to/skill-folder> --check

Example:
    python package_skill.py .opencode/skill/my-skill
"""
```

**Evidence**: `package_skill.py:6-23`

### Inline Comments

Follow the universal commenting principles (see `../shared/universal_patterns.md`):

1. **Quantity limit:** Maximum 3 comments per 10 lines of code
2. **Focus on purposeful semantics:** Explain WHY something is done, not WHAT it does
3. **Focus on WHY, not WHAT:** Explain intent, constraints, reasoning
4. **No commented-out code:** Delete unused code (git preserves history)

**Good - explains reasoning:**

```python
# Sort by recency so newest memories surface first
results.sort(key=lambda x: x['timestamp'], reverse=True)

# Skip if already processed to prevent duplicate work
if item_id in processed_set:
    continue

# REQ-033: transaction manager for pending file recovery
transaction_manager = TransactionManager(db_path)
```

**Bad - narrates implementation:**

```python
# Set value to 42
value = 42

# Loop through items
for item in items:
    pass
```

### Capitalization

All comment text MUST start with a capital letter:

```python
# Sort by recency so newest memories surface first     # correct
# sort by recency so newest memories surface first     # wrong
```

**Exceptions**: Directives like `type: ignore`, `noqa:`, `pylint: disable`, and inline code references.

---

<!-- /ANCHOR:docstrings -->
<!-- ANCHOR:code-patterns -->
## 6. CODE PATTERNS

### Early Return Pattern

Exit early for invalid conditions rather than deep nesting:

```python
def validate(data):
    # Early exit for invalid input
    if not data:
        return False, "No data provided"

    if not isinstance(data, dict):
        return False, "Data must be dictionary"

    # Main logic after guards
    return True, None
```

**Evidence**: `package_skill.py:98-104`

### Guard Clauses

Place validation checks at function start:

```python
def process_file(file_path: Path) -> Optional[str]:
    # Guard clauses first
    if not file_path.exists():
        return None

    if not file_path.is_file():
        return None

    # Main processing
    content = file_path.read_text()
    return content
```

### String Formatting

Prefer f-strings for readability:

```python
# Good - f-strings
message = f"Missing required field '{field}' in frontmatter"
path = f"{base_dir}/{filename}"

# Avoid - .format() or % formatting
message = "Missing required field '{}' in frontmatter".format(field)
message = "Missing required field '%s' in frontmatter" % field
```

---

<!-- /ANCHOR:code-patterns -->
<!-- ANCHOR:error-handling -->
## 7. ERROR HANDLING

### Specific Exceptions

Catch specific exceptions, not bare `except`:

```python
# Good
try:
    data = json.loads(content)
except json.JSONDecodeError as e:
    return False, f"Invalid JSON: {e}"

# Avoid
try:
    data = json.loads(content)
except:  # Too broad
    return False, "Error"
```

### Error Messages

Include context in error messages:

```python
# Good - includes context
return False, f"Name '{name}' must be hyphen-case (lowercase letters, digits, and hyphens only)"

# Avoid - vague
return False, "Invalid name format"
```

**Evidence**: `package_skill.py:117`

---

<!-- /ANCHOR:error-handling -->
<!-- ANCHOR:line-length-and-formatting -->
## 8. LINE LENGTH AND FORMATTING

### Line Length

- **Maximum**: 120 characters (soft limit)
- **Target**: 88-100 characters for readability
- Break long lines at logical points

### Line Breaks

```python
# Function with many parameters
def complex_function(
    param1: str,
    param2: int,
    param3: Optional[List[str]] = None,
    param4: bool = True,
) -> Tuple[bool, str]:
    pass

# Long string
message = (
    f"This is a long error message that describes "
    f"what went wrong with {variable} in detail"
)

# Long list/dict
REQUIRED_SECTIONS = [
    'WHEN TO USE',
    'SMART ROUTING',
    'HOW IT WORKS',
    'RULES',
    'REFERENCES',
]
```

---

<!-- /ANCHOR:line-length-and-formatting -->
<!-- ANCHOR:related-resources -->
## 9. RELATED RESOURCES

### Internal References
- [quality_standards.md](./quality_standards.md) - Code quality requirements
- [quick_reference.md](./quick_reference.md) - Quick lookup for common patterns

### External Standards
- [PEP 8](https://peps.python.org/pep-0008/) - Python Style Guide
- [PEP 257](https://peps.python.org/pep-0257/) - Docstring Conventions
- [Google Python Style Guide](https://google.github.io/styleguide/pyguide.html)
<!-- /ANCHOR:related-resources -->
