#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: SKILL PACKAGER
# ───────────────────────────────────────────────────────────────

"""
Skill Packager - Creates a distributable zip file of a skill folder

Validates against skill creation standards:
- skill_creation.md: Overall skill requirements
- skill_md_template.md: SKILL.md structure requirements
- skill_reference_template.md: Reference file requirements
- skill_asset_template.md: Asset file requirements

Usage:
    python package_skill.py <path/to/skill-folder> [output-directory]
    python package_skill.py <path/to/skill-folder> --check  # Validate only, don't package

Example:
    python package_skill.py .opencode/skill/my-skill
    python package_skill.py .opencode/skill/my-skill ./dist
    python package_skill.py .opencode/skill/my-skill --check
"""

import argparse
import json
import re
import sys
import zipfile
from pathlib import Path
from typing import Dict, List, Optional, Tuple

# ───────────────────────────────────────────────────────────────
# 1. VALIDATION CONSTANTS (aligned with skill_creation.md)
# ───────────────────────────────────────────────────────────────

# Required frontmatter fields
REQUIRED_FRONTMATTER_FIELDS = ['name', 'description', 'allowed-tools']

# Optional frontmatter fields (validated if present, but not required)
OPTIONAL_FRONTMATTER_FIELDS = ['version']

# Recommended frontmatter fields (warning if missing)
RECOMMENDED_FRONTMATTER_FIELDS = ['version']

# Required SKILL.md sections (from skill_md_template.md)
# Note: HOW IT WORKS and HOW TO USE are treated as equivalent
REQUIRED_SECTIONS = [
    'WHEN TO USE',
    'SMART ROUTING',  # Section 2 per skill_creation.md
    'HOW IT WORKS',  # Also accepts 'HOW TO USE'
    'RULES',
    'REFERENCES',  # Section 5 per skill_creation.md (can be combined with SMART ROUTING)
]

# Alternative section names (for flexible matching)
# REFERENCES can be part of "SMART ROUTING & REFERENCES" combined header
SECTION_ALIASES = {
    'HOW IT WORKS': ['HOW IT WORKS', 'HOW TO USE'],
    'REFERENCES': ['REFERENCES', 'SMART ROUTING & REFERENCES'],
    'SMART ROUTING': ['SMART ROUTING', 'SMART ROUTING & REFERENCES'],
}

# Recommended sections (warning if missing)
RECOMMENDED_SECTIONS = [
    'SUCCESS CRITERIA',
    'INTEGRATION POINTS',
    'RELATED RESOURCES',
]

# Valid file extensions for each resource type
VALID_SCRIPT_EXTENSIONS = ['.py', '.sh', '.bash', '.js']
VALID_REFERENCE_EXTENSIONS = ['.md']
VALID_ASSET_EXTENSIONS = ['.md', '.yaml', '.yml', '.json', '.txt', '.html', '.css', '.js']

# Size limits
MAX_SKILL_MD_WORDS = 5000
RECOMMENDED_MAX_WORDS = 3000
MAX_SKILL_MD_LINES = 3000


# ───────────────────────────────────────────────────────────────
# 2. VALIDATION FUNCTIONS
# ───────────────────────────────────────────────────────────────

def validate_frontmatter(content: str) -> Tuple[bool, str, List[str], Dict[str, str]]:
    """Validate SKILL.md frontmatter against skill_md_template.md requirements.

    Args:
        content: Raw SKILL.md file content.

    Returns:
        Tuple of (is_valid, error_message, warnings, parsed_frontmatter).
    """
    warnings = []
    parsed = {}

    if not content.startswith('---'):
        return False, "No YAML frontmatter found (file should start with ---)", warnings, parsed

    match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
    if not match:
        return False, "Invalid frontmatter format (missing closing ---)", warnings, parsed

    frontmatter = match.group(1)

    for field in REQUIRED_FRONTMATTER_FIELDS:
        if f'{field}:' not in frontmatter:
            return False, f"Missing required field '{field}' in frontmatter", warnings, parsed

    name_match = re.search(r'name:\s*(.+)', frontmatter)
    if name_match:
        name = name_match.group(1).strip().strip('"\'')
        parsed['name'] = name

        # Hyphen-case: lowercase with hyphens only
        if not re.match(r'^[a-z0-9-]+$', name):
            return False, f"Name '{name}' must be hyphen-case (lowercase letters, digits, and hyphens only)", warnings, parsed
        if name.startswith('-') or name.endswith('-'):
            return False, f"Name '{name}' cannot start or end with hyphen", warnings, parsed
        if '--' in name:
            return False, f"Name '{name}' cannot contain consecutive hyphens", warnings, parsed

    # YAML multiline block format not allowed
    if re.search(r'description:\s*\n\s+', frontmatter) or re.search(r'^description:\s*[|>]\s*$', frontmatter, flags=re.MULTILINE):
        return False, "Description uses YAML multiline block format (must be single line after colon)", warnings, parsed

    desc_match = re.search(r'description:\s*(.+)', frontmatter)
    if desc_match:
        description = desc_match.group(1).strip().strip('"\'')
        parsed['description'] = description

        # Angle brackets break OpenCode XML parsing
        if '<' in description or '>' in description:
            return False, "Description cannot contain angle brackets (< or >) - breaks OpenCode parsing", warnings, parsed

        if 'TODO' in description.upper():
            warnings.append("Description contains TODO placeholder - please complete it")

        # Recommended: 150-300 characters
        if len(description) < 50:
            warnings.append(f"Description too short ({len(description)} chars) - recommend 150-300 characters")
        elif len(description) > 500:
            warnings.append(f"Description too long ({len(description)} chars) - recommend 150-300 characters")
    else:
        return False, "Description appears to be empty or multiline (must be single line after colon)", warnings, parsed

    tools_match = re.search(r'allowed-tools:\s*(.+)', frontmatter)
    if tools_match:
        tools_value = tools_match.group(1).strip()
        parsed['allowed-tools'] = tools_value

        # Array format required: [Tool1, Tool2]
        if tools_value and not tools_value.startswith('['):
            if ',' in tools_value:
                return False, f"allowed-tools must use array format [Tool1, Tool2], found: {tools_value}", warnings, parsed

    for field in RECOMMENDED_FRONTMATTER_FIELDS:
        if f'{field}:' not in frontmatter:
            warnings.append(f"Missing recommended field '{field}' in frontmatter")
        else:
            field_match = re.search(rf'{field}:\s*(.+)', frontmatter)
            if field_match:
                parsed[field] = field_match.group(1).strip()

    return True, "Frontmatter valid", warnings, parsed


def validate_sections(content: str) -> Tuple[bool, str, List[str]]:
    """Validate SKILL.md has required sections per skill_md_template.md.

    Args:
        content: Raw SKILL.md file content.

    Returns:
        Tuple of (is_valid, error_message, warnings).
    """
    warnings = []
    h2_pattern = r'^##\s+(?:\d+\.\s*)?(.+?)\s*$'
    headings = re.findall(h2_pattern, content, re.MULTILINE)
    headings_upper = [h.upper().strip() for h in headings]

    missing_required = []
    for section in REQUIRED_SECTIONS:
        aliases = SECTION_ALIASES.get(section, [section])
        found = any(alias in h for h in headings_upper for alias in aliases)
        if not found:
            missing_required.append(section)

    if missing_required:
        return False, f"Missing required sections: {', '.join(missing_required)}", warnings

    for section in RECOMMENDED_SECTIONS:
        found = any(section in h for h in headings_upper)
        if not found:
            warnings.append(f"Missing recommended section: {section}")

    return True, "Sections valid", warnings


def validate_rules_section(content: str) -> Tuple[bool, str, List[str]]:
    """Validate RULES section has required subsections per skill_md_template.md.

    Args:
        content: Raw SKILL.md file content.

    Returns:
        Tuple of (is_valid, error_message, warnings).
    """
    warnings = []
    rules_match = re.search(r'##\s+(?:\d+\.\s*)?(?:[\U0001F300-\U0001F9FF]\s*)?RULES.*?\n(.*?)(?=\n##\s|\Z)', content, re.DOTALL | re.IGNORECASE)

    if not rules_match:
        return True, "No RULES section to validate", warnings

    rules_content = rules_match.group(1)

    # Required subsections per skill_md_template.md
    required_subsections = [
        ('✅', 'ALWAYS'),
        ('❌', 'NEVER'),
        ('⚠️', 'ESCALATE'),
    ]

    for emoji, keyword in required_subsections:
        if keyword not in rules_content.upper():
            warnings.append(f"RULES section missing '{emoji} {keyword}' subsection")

    return True, "RULES section valid", warnings


def validate_content_size(content: str) -> Tuple[bool, str, List[str]]:
    """Validate SKILL.md size constraints per skill_creation.md.

    Args:
        content: Raw SKILL.md file content.

    Returns:
        Tuple of (is_valid, error_message, warnings).
    """
    warnings = []
    
    lines = content.split('\n')
    words = len(content.split())
    
    if len(lines) > MAX_SKILL_MD_LINES:
        warnings.append(f"SKILL.md has {len(lines)} lines (max recommended: {MAX_SKILL_MD_LINES})")
    
    if words > MAX_SKILL_MD_WORDS:
        return False, f"SKILL.md exceeds word limit ({words} words, max: {MAX_SKILL_MD_WORDS})", warnings
    elif words > RECOMMENDED_MAX_WORDS:
        warnings.append(f"SKILL.md has {words} words (recommended max: {RECOMMENDED_MAX_WORDS})")
    
    return True, "Content size valid", warnings


def validate_resources(skill_path: Path) -> Tuple[bool, str, List[str]]:
    """Validate optional resource folders per skill_asset_template.md and skill_reference_template.md.

    Args:
        skill_path: Path to the skill directory.

    Returns:
        Tuple of (is_valid, error_message, warnings).
    """
    warnings = []
    scripts_dir = skill_path / 'scripts'
    refs_dir = skill_path / 'references'
    assets_dir = skill_path / 'assets'

    if scripts_dir.exists():
        for file in scripts_dir.iterdir():
            if file.is_file() and file.suffix not in VALID_SCRIPT_EXTENSIONS:
                warnings.append(f"Unexpected file type in scripts/: {file.name} (expected: {', '.join(VALID_SCRIPT_EXTENSIONS)})")

    if refs_dir.exists():
        for file in refs_dir.iterdir():
            if file.is_file():
                if file.suffix not in VALID_REFERENCE_EXTENSIONS:
                    warnings.append(f"Unexpected file type in references/: {file.name} (expected: .md)")
                # snake_case naming per skill_reference_template.md
                if not re.match(r'^[a-z0-9_]+\.md$', file.name):
                    warnings.append(f"Reference file '{file.name}' should use snake_case naming")

    if assets_dir.exists():
        for file in assets_dir.iterdir():
            if file.is_file():
                # snake_case naming per skill_asset_template.md
                name_without_ext = file.stem
                if not re.match(r'^[a-z0-9_]+$', name_without_ext):
                    warnings.append(f"Asset file '{file.name}' should use snake_case naming")

    placeholder_patterns = ['example_*', 'placeholder_*', 'sample_*']
    for pattern in placeholder_patterns:
        for folder in [scripts_dir, refs_dir, assets_dir]:
            if folder.exists():
                for file in folder.glob(pattern):
                    warnings.append(f"Placeholder file should be removed or renamed: {file}")

    return True, "Resources valid", warnings


def validate_name_matches_folder(skill_path: Path, parsed_frontmatter: Dict[str, str]) -> Tuple[bool, str, List[str]]:
    """Validate that frontmatter 'name' matches the folder name per skill_md_template.md.

    Args:
        skill_path: Path to the skill directory.
        parsed_frontmatter: Dict of parsed frontmatter key-value pairs.

    Returns:
        Tuple of (is_valid, error_message, warnings).
    """
    warnings = []
    
    folder_name = skill_path.name
    frontmatter_name = parsed_frontmatter.get('name', '')
    
    if folder_name != frontmatter_name:
        return False, f"Frontmatter name '{frontmatter_name}' must match folder name '{folder_name}'", warnings
    
    return True, "Name matches folder", warnings


def validate_skill(skill_path: Path) -> Tuple[bool, str, List[str]]:
    """Comprehensive skill validation aligned with all skill creation documentation.

    Args:
        skill_path: Path to the skill directory.

    Returns:
        Tuple of (is_valid, message, warnings).
    """
    skill_path = Path(skill_path)
    all_warnings = []
    skill_md = skill_path / 'SKILL.md'

    if not skill_md.exists():
        return False, "SKILL.md not found", all_warnings

    try:
        content = skill_md.read_text(encoding='utf-8')
    except Exception as e:
        return False, f"Failed to read SKILL.md: {str(e)}", all_warnings

    valid, message, warnings, parsed = validate_frontmatter(content)
    all_warnings.extend(warnings)
    if not valid:
        return False, message, all_warnings

    valid, message, warnings = validate_name_matches_folder(skill_path, parsed)
    all_warnings.extend(warnings)
    if not valid:
        return False, message, all_warnings

    valid, message, warnings = validate_sections(content)
    all_warnings.extend(warnings)
    if not valid:
        return False, message, all_warnings

    valid, message, warnings = validate_rules_section(content)
    all_warnings.extend(warnings)
    if not valid:
        return False, message, all_warnings

    valid, message, warnings = validate_content_size(content)
    all_warnings.extend(warnings)
    if not valid:
        return False, message, all_warnings

    valid, message, warnings = validate_resources(skill_path)
    all_warnings.extend(warnings)
    if not valid:
        return False, message, all_warnings

    return True, "Skill is valid!", all_warnings


# ───────────────────────────────────────────────────────────────
# 3. PACKAGING FUNCTIONS
# ───────────────────────────────────────────────────────────────

def package_skill(skill_path_str: str, output_dir: Optional[str] = None) -> Optional[Path]:
    """Package a skill folder into a zip file.

    Args:
        skill_path_str: Path to the skill folder.
        output_dir: Optional output directory for the zip file (defaults to cwd).

    Returns:
        Path to the created zip file, or None on error.
    """
    skill_path = Path(skill_path_str).resolve()

    if not skill_path.exists():
        print(f"❌ Error: Skill folder not found: {skill_path}")
        return None

    if not skill_path.is_dir():
        print(f"❌ Error: Path is not a directory: {skill_path}")
        return None

    skill_md = skill_path / "SKILL.md"
    if not skill_md.exists():
        print(f"❌ Error: SKILL.md not found in {skill_path}")
        return None

    print("🔍 Validating skill against creation standards...")
    valid, message, warnings = validate_skill(skill_path)

    if not valid:
        print(f"❌ Validation failed: {message}")
        print("   Please fix the validation errors before packaging.")
        return None

    print(f"✅ {message}")

    if warnings:
        print(f"\n⚠️  {len(warnings)} warning(s):")
        for warning in warnings:
            print(f"   • {warning}")
        print()

    skill_name = skill_path.name
    if output_dir:
        output_path = Path(output_dir).resolve()
        output_path.mkdir(parents=True, exist_ok=True)
    else:
        output_path = Path.cwd()

    zip_filename = output_path / f"{skill_name}.zip"

    try:
        with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
            file_count = 0
            for file_path in skill_path.rglob('*'):
                if file_path.is_file():
                    # Skip hidden files and Python cache
                    if file_path.name.startswith('.') or file_path.name == '__pycache__':
                        continue
                    if file_path.suffix in ['.pyc', '.pyo']:
                        continue

                    arcname = file_path.relative_to(skill_path.parent)
                    zipf.write(file_path, arcname)
                    print(f"  📄 Added: {arcname}")
                    file_count += 1

        print(f"\n✅ Successfully packaged {file_count} files to: {zip_filename}")
        return zip_filename

    except OSError as e:
        print(f"❌ Error creating zip file: {e}")
        return None


def check_only(skill_path_str: str) -> bool:
    """Validate a skill without packaging.

    Args:
        skill_path_str: Path to the skill folder.

    Returns:
        True if valid, False otherwise.
    """
    skill_path = Path(skill_path_str).resolve()
    
    if not skill_path.exists():
        print(f"❌ Error: Skill folder not found: {skill_path}")
        return False
    
    if not skill_path.is_dir():
        print(f"❌ Error: Path is not a directory: {skill_path}")
        return False
    
    print(f"🔍 Validating skill: {skill_path.name}")
    print("=" * 50)
    
    valid, message, warnings = validate_skill(skill_path)
    
    if valid:
        print(f"\n✅ {message}")
    else:
        print(f"\n❌ {message}")
    
    if warnings:
        print(f"\n⚠️  {len(warnings)} warning(s):")
        for warning in warnings:
            print(f"   • {warning}")
    
    print("\n" + "=" * 50)
    print(f"Result: {'PASS' if valid else 'FAIL'}")
    
    return valid


# ───────────────────────────────────────────────────────────────
# 4. MAIN
# ───────────────────────────────────────────────────────────────

def main() -> None:
    """CLI entry point for skill packaging."""
    parser = argparse.ArgumentParser(
        description="Validate and optionally package a skill folder into a zip archive."
    )
    parser.add_argument(
        'skill_path',
        help="Path to the skill folder",
    )
    parser.add_argument(
        'output_dir',
        nargs='?',
        default=None,
        help="Optional output directory for the zip package",
    )
    parser.add_argument(
        '--check',
        action='store_true',
        help="Validate only; do not create a package",
    )
    parser.add_argument(
        '--json',
        dest='json_mode',
        action='store_true',
        help="Output validation results as JSON",
    )
    args = parser.parse_args()

    check_mode = args.check
    json_mode = args.json_mode
    skill_path = args.skill_path
    output_dir = args.output_dir

    if json_mode:
        skill_path_obj = Path(skill_path).resolve()
        if not skill_path_obj.exists() or not skill_path_obj.is_dir():
            print(json.dumps({
                'valid': False,
                'message': f'Skill folder not found or not a directory: {skill_path}',
                'warnings': [],
                'path': str(skill_path_obj)
            }, indent=2))
            sys.exit(1)

        valid, message, warnings = validate_skill(skill_path_obj)
        print(json.dumps({
            'valid': valid,
            'message': message,
            'warnings': warnings,
            'path': str(skill_path_obj)
        }, indent=2))
        sys.exit(0 if valid else 1)

    elif check_mode:
        result = check_only(skill_path)
        sys.exit(0 if result else 1)

    else:
        print(f"📦 Packaging skill: {skill_path}")
        if output_dir:
            print(f"   Output directory: {output_dir}")
        print()

        result = package_skill(skill_path, output_dir)
        sys.exit(0 if result else 1)


if __name__ == "__main__":
    main()
