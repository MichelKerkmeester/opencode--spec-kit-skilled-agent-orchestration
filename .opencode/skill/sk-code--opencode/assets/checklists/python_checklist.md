---
title: Python Code Quality Checklist
description: Quality validation checklist for Python code in the OpenCode development environment.
---

# Python Code Quality Checklist

Quality validation checklist for Python code in the OpenCode development environment.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Specific quality checks for Python files. Use alongside the [universal_checklist.md](./universal_checklist.md) for complete validation.

### Priority Levels

| Level | Meaning | Enforcement |
|-------|---------|-------------|
| P0 | HARD BLOCKER | Must fix before commit |
| P1 | Required | Must fix or get explicit approval |
| P2 | Recommended | Can defer with justification |

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:p0-hard-blockers -->
## 2. P0 - HARD BLOCKERS

These items MUST be fixed before any commit.

### Shebang Line

```markdown
[ ] File starts with portable shebang
```

**Required**:
```python
#!/usr/bin/env python3
```

### File Header

```markdown
[ ] COMPONENT comment block present after shebang
```

**Required format**:
```python
#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: [COMPONENT NAME]
# ───────────────────────────────────────────────────────────────
```

### Module Docstring

```markdown
[ ] Module has docstring explaining purpose and usage
```

**Required**:
```python
"""
Brief description of what this module does.

Usage: python script.py [arguments]
Output: Description of output format

Options:
    --flag      Description of flag
"""
```

### Function Naming

```markdown
[ ] All functions use snake_case
```

**Correct**:
```python
def validate_input(data):
    pass

def process_file(path):
    pass
```

**Wrong**:
```python
def validateInput(data):    # camelCase
    pass

def ProcessFile(path):      # PascalCase
    pass
```

### Constant Naming

```markdown
[ ] Module-level constants use UPPER_SNAKE_CASE
```

**Correct**:
```python
MAX_FILE_SIZE = 5000
REQUIRED_FIELDS = ['name', 'description']
DEFAULT_TIMEOUT = 30
```

### No Commented-Out Code

```markdown
[ ] No commented-out code blocks
```

### WHY Comments

```markdown
[ ] Purposeful WHY comments only (max 3 comments per 10 LOC)
    - Comments explain WHY, not WHAT
    - No narrative comments describing obvious mechanics
```

### Numbered ALL-CAPS Sections

```markdown
[ ] Numbered ALL-CAPS section headers are preserved (`## N. SECTION NAME`)
```

---

<!-- /ANCHOR:p0-hard-blockers -->
<!-- ANCHOR:p1-required -->
## 3. P1 - REQUIRED

These must be addressed or receive approval to defer.

### Type Hints

```markdown
[ ] All function signatures have type hints
```

**Required**:
```python
def validate_input(data: Dict[str, Any]) -> Tuple[bool, str, List[str]]:
    pass

def process_file(path: Path, strict: bool = True) -> Optional[str]:
    pass
```

### Google-Style Docstrings

```markdown
[ ] Public functions have Google-style docstrings
```

**Required format**:
```python
def validate_config(config_path: Path) -> Tuple[bool, str]:
    """
    Validate configuration file against schema.

    Args:
        config_path: Path to the configuration file

    Returns:
        Tuple of (is_valid, error_message)

    Raises:
        FileNotFoundError: If config_path doesn't exist
    """
    pass
```

### Specific Exception Handling

```markdown
[ ] No bare except clauses
[ ] Catches specific exceptions only
```

**Correct**:
```python
try:
    data = json.loads(content)
except json.JSONDecodeError as e:
    return False, f"Invalid JSON: {e}"
```

**Wrong**:
```python
try:
    data = json.loads(content)
except:  # Too broad!
    return False, "Error"
```

### Early Return Pattern

```markdown
[ ] Functions use guard clauses and early returns
```

**Correct**:
```python
def process(data):
    if not data:
        return None

    if not validate(data):
        return None

    # Main logic
    return transform(data)
```

### TODO Format

```markdown
[ ] TODOs include owner or ticket number
```

**Correct**:
```python
# TODO(username): Add input validation
# TODO(TICKET-123): Handle edge case
```

### KISS / DRY / SOLID Checks

```markdown
[ ] KISS: avoid extra layers and keep function boundaries simple
[ ] DRY: repeated parsing/validation logic extracted
[ ] SOLID: SRP/OCP/LSP/ISP/DIP impacts reviewed for module boundaries
```

---

<!-- /ANCHOR:p1-required -->
<!-- ANCHOR:p2-recommended -->
## 4. P2 - RECOMMENDED

These improve quality but can be deferred.

### Import Ordering

```markdown
[ ] Imports follow PEP 8 order with blank lines
```

**Order**:
```python
# 1. Standard library
import os
import sys
from pathlib import Path

# 2. Third-party
import yaml

# 3. Local
from .utils import helper
```

### String Formatting

```markdown
[ ] Uses f-strings for formatting
```

**Preferred**:
```python
message = f"Processing file: {filename}"
error = f"Invalid value: {value} (expected {expected})"
```

### Line Length

```markdown
[ ] Lines under 120 characters
[ ] Target: 88-100 characters
```

### Dataclasses

```markdown
[ ] Dataclasses used for structured data
```

**Good**:
```python
from dataclasses import dataclass

@dataclass
class ValidationResult:
    is_valid: bool
    errors: List[str]
```

---

<!-- /ANCHOR:p2-recommended -->
<!-- ANCHOR:checklist-template -->
## 5. CHECKLIST TEMPLATE

For formal findings-first review output, use `sk-code--review` as the baseline and treat this file as the Python standards overlay.

```markdown
## Python Standards Overlay Notes (sk-code--opencode)

- [ ] Python standards validated in `python_checklist.md`
- [ ] Universal standards validated in `universal_checklist.md`
- [ ] Findings severity/order produced with `sk-code--review/references/quick_reference.md`
- [ ] Baseline security, quality, and test checks sourced from `sk-code--review`
- [ ] Overlay-only deviations documented with file:line evidence
```

---

<!-- /ANCHOR:checklist-template -->
<!-- ANCHOR:validation-commands -->
## 6. VALIDATION COMMANDS

```bash
# Syntax check
python -m py_compile file.py

# Type checking
python -m mypy file.py

# Style check
python -m flake8 file.py

# Format check
python -m black --check file.py

# All checks
python -m flake8 file.py && python -m mypy file.py && python -m black --check file.py
```

---

<!-- /ANCHOR:validation-commands -->
<!-- ANCHOR:related-resources -->
## 7. RELATED RESOURCES

### Checklists
- [universal_checklist.md](./universal_checklist.md) - Language-agnostic checks

### Style Guide
- [Python Style Guide](../python/style_guide.md)
- [Python Quality Standards](../python/quality_standards.md)
<!-- /ANCHOR:related-resources -->
