---
title: Python Quick Reference
description: Fast lookup for Python coding patterns, naming conventions, and common structures in OpenCode.
---

# Python Quick Reference

Fast lookup for Python coding patterns, naming conventions, and common structures in OpenCode.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Quick-access reference card for Python patterns. For detailed explanations, see:
- [style_guide.md](./style_guide.md) - Full style documentation
- [quality_standards.md](./quality_standards.md) - Quality requirements

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:file-template -->
## 2. FILE TEMPLATE

```python
#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: [COMPONENT NAME]
# ───────────────────────────────────────────────────────────────

"""
Brief description of what this module does.

Usage: python script_name.py [arguments]
Output: Description of output

Options:
    --flag      Description of flag
"""

import sys
import json
from pathlib import Path
from typing import Tuple, List, Dict, Optional


# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────

CONSTANT_VALUE = "value"


# ───────────────────────────────────────────────────────────────
# 2. MAIN FUNCTIONS
# ───────────────────────────────────────────────────────────────

def main_function(param: str) -> Tuple[bool, str]:
    """
    Brief description.

    Args:
        param: Description of param

    Returns:
        Tuple of (success, result_or_error)
    """
    if not param:
        return False, "Parameter required"

    return True, "Success"


# ───────────────────────────────────────────────────────────────
# 3. ENTRY POINT
# ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python script.py <argument>")
        sys.exit(1)

    success, result = main_function(sys.argv[1])
    if not success:
        print(f"Error: {result}", file=sys.stderr)
        sys.exit(1)

    print(result)
```

---

<!-- /ANCHOR:file-template -->
<!-- ANCHOR:naming-conventions -->
## 3. NAMING CONVENTIONS

| Element | Convention | Example |
|---------|------------|---------|
| Functions | snake_case | `validate_input()` |
| Variables | snake_case | `user_input`, `file_path` |
| Constants | UPPER_SNAKE | `MAX_SIZE`, `DEFAULT_VALUE` |
| Classes | PascalCase | `ValidationResult` |
| Private | _prefix | `_internal_helper()` |
| Modules | snake_case | `skill_advisor.py` |

---

<!-- /ANCHOR:naming-conventions -->
<!-- ANCHOR:type-hints -->
## 4. TYPE HINTS

### Common Patterns

```python
from typing import Tuple, List, Dict, Optional, Any, Union
from pathlib import Path

# Basic types
def func(text: str, count: int, flag: bool) -> str:
    pass

# Optional (can be None)
def func(value: Optional[str] = None) -> Optional[int]:
    pass

# Collections
def func(items: List[str], mapping: Dict[str, Any]) -> List[int]:
    pass

# Tuple return
def func() -> Tuple[bool, str, List[str]]:
    pass

# Union types
def func(value: Union[str, int]) -> Union[str, None]:
    pass

# Path objects
def func(path: Path) -> Optional[Path]:
    pass
```

---

<!-- /ANCHOR:type-hints -->
<!-- ANCHOR:docstring-format -->
## 5. DOCSTRING FORMAT

### Function Docstring

```python
def function_name(param1: str, param2: int = 0) -> Tuple[bool, str]:
    """
    Brief one-line description.

    Longer description if needed, explaining the function's
    behavior and any important details.

    Args:
        param1: Description of first parameter
        param2: Description of second parameter (default: 0)

    Returns:
        Tuple of (success_flag, result_or_error_message)

    Raises:
        ValueError: When param1 is empty
        FileNotFoundError: When referenced file doesn't exist
    """
    pass
```

### Class Docstring

```python
class ClassName:
    """
    Brief one-line description.

    Longer description of the class purpose and behavior.

    Attributes:
        attr1: Description of attribute
        attr2: Description of attribute
    """
    pass
```

---

<!-- /ANCHOR:docstring-format -->
<!-- ANCHOR:common-patterns -->
## 6. COMMON PATTERNS

### Early Return / Guard Clauses

```python
def process(data: Dict) -> Optional[str]:
    # Guard clauses at the top
    if not data:
        return None

    if "required_field" not in data:
        return None

    if not isinstance(data["required_field"], str):
        return None

    # Main logic after all guards pass
    return data["required_field"].upper()
```

### Validation Function Pattern

```python
def validate_input(data: Any) -> Tuple[bool, str, List[str]]:
    """
    Validate input data.

    Returns:
        Tuple of (is_valid, error_message, warnings)
    """
    warnings = []

    if not data:
        return False, "Data is required", warnings

    if not isinstance(data, dict):
        return False, "Data must be a dictionary", warnings

    if "name" not in data:
        return False, "Missing required field 'name'", warnings

    # Optional checks (warnings)
    if "description" not in data:
        warnings.append("Consider adding a description")

    return True, "", warnings
```

### File Processing Pattern

```python
def process_file(file_path: Path) -> Tuple[bool, str, Dict]:
    """
    Process a file safely.

    Returns:
        Tuple of (success, content_or_error, metadata)
    """
    if not file_path.exists():
        return False, f"File not found: {file_path}", {}

    if not file_path.is_file():
        return False, f"Not a file: {file_path}", {}

    try:
        content = file_path.read_text(encoding="utf-8")
    except UnicodeDecodeError as e:
        return False, f"Encoding error: {e}", {}

    metadata = {"size": file_path.stat().st_size}
    return True, content, metadata
```

---

<!-- /ANCHOR:common-patterns -->
<!-- ANCHOR:exception-handling -->
## 7. EXCEPTION HANDLING

### Specific Exceptions

```python
# Good - specific exception
try:
    data = json.loads(content)
except json.JSONDecodeError as e:
    return False, f"Invalid JSON at line {e.lineno}: {e.msg}"

# Good - multiple specific exceptions
try:
    content = path.read_text()
except FileNotFoundError:
    return False, f"File not found: {path}"
except PermissionError:
    return False, f"Permission denied: {path}"
except UnicodeDecodeError as e:
    return False, f"Encoding error: {e}"
```

### Never Use Bare Except

```python
# WRONG
try:
    risky_operation()
except:
    pass

# CORRECT
try:
    risky_operation()
except Exception as e:
    logger.error(f"Operation failed: {e}")
    raise
```

---

<!-- /ANCHOR:exception-handling -->
<!-- ANCHOR:constants -->
## 8. CONSTANTS

### Definition Pattern

```python
# Module-level constants at top of file
MAX_FILE_SIZE = 5000
DEFAULT_TIMEOUT = 30

REQUIRED_FIELDS = ['name', 'description']

VALID_EXTENSIONS = ['.py', '.sh', '.js']

# Use frozenset for immutable sets
STOP_WORDS = frozenset({
    'a', 'an', 'the', 'is', 'are', 'was', 'were'
})

# Configuration dict
CONFIG = {
    'max_retries': 3,
    'timeout': 30,
    'debug': False,
}
```

---

<!-- /ANCHOR:constants -->
<!-- ANCHOR:string-formatting -->
## 9. STRING FORMATTING

### F-Strings (Preferred)

```python
# Simple substitution
message = f"Processing file: {filename}"

# Expressions
message = f"Found {len(items)} items"

# Format specifiers
message = f"Progress: {progress:.1%}"
message = f"Value: {value:>10}"

# Multi-line
message = (
    f"Error in file {filename}:\n"
    f"  Line {line_number}: {error_message}"
)
```

---

<!-- /ANCHOR:string-formatting -->
<!-- ANCHOR:imports -->
## 10. IMPORTS

### Standard Order

```python
# 1. Standard library (alphabetical)
import json
import os
import re
import sys
from pathlib import Path
from typing import Dict, List, Optional, Tuple

# 2. Third-party packages
import yaml
import requests

# 3. Local imports
from .utils import helper_function
from ..common import shared_constant
```

---

<!-- /ANCHOR:imports -->
<!-- ANCHOR:quality-checklist -->
## 11. QUALITY CHECKLIST

```markdown
P0 - Must Fix:
[ ] #!/usr/bin/env python3
[ ] File header (COMPONENT block)
[ ] Module docstring
[ ] snake_case functions
[ ] UPPER_SNAKE constants
[ ] No commented code
[ ] WHY-focused comments only (max 3/10 lines)

P1 - Required:
[ ] Type hints
[ ] Google docstrings
[ ] Specific exceptions
[ ] Early returns
[ ] TODO with context

P2 - Recommended:
[ ] Import order
[ ] Line length < 120
[ ] Full docstring coverage
```

---

<!-- /ANCHOR:quality-checklist -->
<!-- ANCHOR:related-resources -->
## 12. RELATED RESOURCES

- [style_guide.md](./style_guide.md) - Detailed style documentation
- [quality_standards.md](./quality_standards.md) - Quality requirements and validation
<!-- /ANCHOR:related-resources -->
