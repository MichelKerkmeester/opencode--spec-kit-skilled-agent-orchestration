#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: SKILL VALIDATOR
# ───────────────────────────────────────────────────────────────

"""
Quick validation script for skills - enhanced version

Validates:
- SKILL.md exists
- YAML frontmatter present and valid
- Required fields: name, description
- Optional fields: allowed-tools, version
- Name format: hyphen-case
- Description: single line (no YAML block format)
- allowed-tools (if present): array format [Tool1, Tool2]
- No angle brackets in description
- No TODO placeholders in description

Output formats:
- Human-readable (default)
- JSON (with --json flag)
"""

import argparse
import sys
import json
import re
from pathlib import Path
from typing import Any, Dict, List, Tuple, Union


# ───────────────────────────────────────────────────────────────
# 1. VALIDATION
# ───────────────────────────────────────────────────────────────

def strip_matching_quotes(value: str) -> str:
    """Strip one matching pair of wrapping single/double quotes."""
    value = value.strip()
    if len(value) >= 2 and value[0] == value[-1] and value[0] in ('"', "'"):
        return value[1:-1]
    return value


def validate_skill(skill_path: Union[str, Path]) -> Tuple[bool, str, List[str]]:
    """
    Validate a skill directory.
    
    Returns:
        Tuple of (is_valid: bool, message: str, warnings: list)
    """
    skill_path = Path(skill_path)
    warnings: List[str] = []

    skill_md = skill_path / 'SKILL.md'
    if not skill_md.exists():
        return False, "SKILL.md not found", warnings

    try:
        content = skill_md.read_text(encoding='utf-8')
    except OSError as exc:
        return False, f"Failed to read SKILL.md: {exc}", warnings

    if not content.startswith('---'):
        return False, "No YAML frontmatter found (file should start with ---)", warnings

    match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
    if not match:
        return False, "Invalid frontmatter format (missing closing ---)", warnings

    frontmatter = match.group(1)

    if 'name:' not in frontmatter:
        return False, "Missing 'name' in frontmatter", warnings
    if 'description:' not in frontmatter:
        return False, "Missing 'description' in frontmatter", warnings

    name_match = re.search(r'name:\s*(.+)', frontmatter)
    if name_match:
        name = strip_matching_quotes(name_match.group(1))
        # Hyphen-case: lowercase with hyphens only
        if not re.match(r'^[a-z0-9-]+$', name):
            return False, f"Name '{name}' should be hyphen-case (lowercase letters, digits, and hyphens only)", warnings
        if name.startswith('-') or name.endswith('-'):
            return False, f"Name '{name}' cannot start or end with hyphen", warnings
        if '--' in name:
            return False, f"Name '{name}' cannot contain consecutive hyphens", warnings

    # Reject YAML multiline block formats (|, >, or newline+indent)
    if re.search(r'description:\s*\n\s+', frontmatter) or re.search(r'^description:\s*[|>]\s*$', frontmatter, flags=re.MULTILINE):
        return False, "Description uses YAML multiline block format (must be single line after colon)", warnings

    desc_match = re.search(r'description:\s*(.+)', frontmatter)
    if desc_match:
        description = strip_matching_quotes(desc_match.group(1))

        if '<' in description or '>' in description:
            return False, "Description cannot contain angle brackets (< or >)", warnings

        if 'TODO' in description.upper():
            warnings.append("Description contains TODO placeholder - please complete it")
    else:
        return False, "Description appears to be empty or multiline (must be single line after colon)", warnings

    # allowed-tools is optional but must use array format if present
    tools_match = re.search(r'allowed-tools:\s*(.+)', frontmatter)
    if tools_match:
        tools_value = tools_match.group(1).strip()
        if tools_value and not tools_value.startswith('['):
            if ',' in tools_value:
                return False, f"allowed-tools must use array format [Tool1, Tool2], found: {tools_value}", warnings

    return True, "Skill is valid!", warnings


# ───────────────────────────────────────────────────────────────
# 2. MAIN
# ───────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Quick validator for SKILL.md frontmatter and structure."
    )
    parser.add_argument(
        'skill_directory',
        help="Path to the skill directory to validate",
    )
    parser.add_argument(
        '--json',
        dest='json_output',
        action='store_true',
        help="Output result as JSON",
    )
    args = parser.parse_args()

    json_output = args.json_output
    skill_path = args.skill_directory
    valid, message, warnings = validate_skill(skill_path)
    
    if json_output:
        result: Dict[str, Any] = {
            'valid': valid,
            'message': message,
            'warnings': warnings,
            'path': str(Path(skill_path).absolute())
        }
        print(json.dumps(result, indent=2))
    else:
        if valid:
            print(f"✅ {message}")
        else:
            print(f"❌ {message}")
        
        for warning in warnings:
            print(f"⚠️  {warning}")
    
    sys.exit(0 if valid else 1)


if __name__ == "__main__":
    main()
