#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: README/DOCUMENTATION FORMAT VALIDATOR
# ───────────────────────────────────────────────────────────────

"""
README/Documentation Format Validator

Validates markdown documentation against template rules to ensure
consistent formatting with proper TOC, H2 emojis, and section structure.

Usage:
    python validate_document.py <document.md> [--type readme|skill|reference|asset|agent|command|install_guide|spec]
    python validate_document.py <document.md> --json
    python validate_document.py <document.md> --fix [--dry-run]
    python validate_document.py <document.md> --blocking-only

Exit Codes:
    0 - Valid (no blocking errors)
    1 - Invalid (blocking errors found)
    2 - File not found or parse error

Examples:
    python validate_document.py README.md
    python validate_document.py SKILL.md --type skill
    python validate_document.py doc.md --json
    python validate_document.py doc.md --fix --dry-run
"""

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple


# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────

EMOJI_PATTERN = re.compile(
    "["
    "\U0001F300-\U0001F9FF"
    "\U00002600-\U000026FF"
    "\U00002700-\U000027BF"
    "\U0001F600-\U0001F64F"
    "\U0001F680-\U0001F6FF"
    "\U0001F1E0-\U0001F1FF"
    "]"
)

# Paths to exclude from validation (auto-generated, third-party, etc.)
EXCLUDED_PATH_PATTERNS = [
    '.pytest_cache',
    'node_modules',
    '__pycache__',
    '.git',
    'vendor',
    'dist',
    'build',
    '.venv',
    'venv',
]

# Third-party directories that use different README conventions
THIRD_PARTY_PATTERNS = [
    # Add third-party patterns here if needed
]

# Template directories with intentionally minimal placeholder READMEs
TEMPLATE_PATTERNS = [
    'system-spec-kit/templates/',  # Spec folder templates are minimal by design
]


def should_exclude_path(file_path: str) -> Tuple[bool, Optional[str]]:
    """Check if file path should be excluded from validation."""
    path_str = str(file_path)

    # Check excluded patterns (auto-generated, dependencies)
    for pattern in EXCLUDED_PATH_PATTERNS:
        if f'/{pattern}/' in path_str or f'\\{pattern}\\' in path_str:
            return True, f"Excluded: matches pattern '{pattern}'"

    # Check third-party patterns
    for pattern in THIRD_PARTY_PATTERNS:
        if pattern in path_str:
            return True, f"Third-party: matches pattern '{pattern}'"

    # Check template patterns (intentionally minimal)
    for pattern in TEMPLATE_PATTERNS:
        if pattern in path_str:
            return True, f"Template: matches pattern '{pattern}' (intentionally minimal)"

    return False, None


# ───────────────────────────────────────────────────────────────
# 2. UTILITIES
# ───────────────────────────────────────────────────────────────

def load_template_rules(script_dir: Path) -> Dict[str, Any]:
    """Load template_rules.json from assets folder."""
    rules_path = script_dir.parent / "assets" / "template_rules.json"
    if not rules_path.exists():
        print(f"Error: template_rules.json not found at {rules_path}", file=sys.stderr)
        sys.exit(2)

    with open(rules_path, 'r', encoding='utf-8') as f:
        return json.load(f)


def detect_document_type(file_path: str, content: str, rules: Dict[str, Any]) -> str:
    """Detect document type from file path or content."""
    path_lower = str(file_path).lower()

    if '/command/' in path_lower or '\\command\\' in path_lower or '/commands/' in path_lower or '\\commands\\' in path_lower:
        return 'command'
    if '/install_guides/' in path_lower or '\\install_guides\\' in path_lower:
        return 'install_guide'
    if 'install_guide' in Path(path_lower).stem:
        return 'install_guide'
    if path_lower.endswith('readme.md'):
        return 'readme'
    if path_lower.endswith('skill.md'):
        return 'skill'
    if '/specs/' in path_lower or '\\specs\\' in path_lower:
        return 'spec'
    if '/agent/' in path_lower or '\\agent\\' in path_lower:
        return 'agent'
    if '/references/' in path_lower or '\\references\\' in path_lower:
        return 'reference'
    if '/assets/' in path_lower or '\\assets\\' in path_lower:
        return 'asset'

    # Default to readme for general markdown
    return 'readme'


def has_emoji(text: str) -> bool:
    """Check if text contains an emoji."""
    return bool(EMOJI_PATTERN.search(text))


def extract_first_emoji(text: str) -> Optional[str]:
    """Extract the first emoji from text."""
    match = EMOJI_PATTERN.search(text)
    return match.group(0) if match else None


def normalize_section_name(name: str) -> str:
    """Normalize section name for lookup in rules."""
    name = EMOJI_PATTERN.sub('', name)
    name = name.strip().lower().replace(' ', '_')
    name = re.sub(r'[^a-z0-9_]', '', name)
    return name


def extract_section_name_text(text: str) -> str:
    """
    Extract the section name text after removing number prefix and emoji.

    Examples:
        "1. 📖 Overview" -> "Overview"
        "📖 OVERVIEW" -> "OVERVIEW"
        "1. Overview" -> "Overview"
    """
    # Remove leading number and dot (e.g., "1. ")
    text = re.sub(r'^\d+\.\s*', '', text)
    # Remove emoji
    text = EMOJI_PATTERN.sub('', text)
    # Clean up whitespace
    return text.strip()


def is_uppercase_section(text: str) -> bool:
    """
    Check if section name is ALL CAPS.

    Handles special characters like &, ', -, etc.
    Only checks alphabetic characters for case.

    Examples:
        "OVERVIEW" -> True
        "Overview" -> False
        "INSTALLATION & SETUP" -> True
        "WHAT'S NEXT?" -> True
        "MCP TOOLS" -> True
    """
    section_name = extract_section_name_text(text)
    # Check if all alphabetic characters are uppercase
    alpha_chars = [c for c in section_name if c.isalpha()]
    if not alpha_chars:
        return True  # No alphabetic chars, consider valid
    return all(c.isupper() for c in alpha_chars)


def make_uppercase_section(text: str) -> str:
    """
    Convert section name to ALL CAPS while preserving structure.

    Examples:
        "Overview" -> "OVERVIEW"
        "Quick Start" -> "QUICK START"
        "What's Next?" -> "WHAT'S NEXT?"
    """
    return text.upper()


# ───────────────────────────────────────────────────────────────
# 3. TOC VALIDATION
# ───────────────────────────────────────────────────────────────

def validate_toc(content: str, doc_type_rules: Dict[str, Any], rules: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Validate TABLE OF CONTENTS section."""
    errors = []

    if not doc_type_rules.get('tocRequired', False):
        return errors

    # Accept variations with emoji (📑) or without
    # Pattern: ## [optional emoji] TABLE OF CONTENTS
    toc_match = re.search(
        r'## (?:[^\w\s]\s+)?TABLE OF CONTENTS\s*\n(.*?)(?=\n---|\n## |\Z)',
        content,
        re.DOTALL | re.IGNORECASE
    )

    if not toc_match:
        errors.append({
            'type': 'missing_toc',
            'severity': 'blocking',
            'message': 'Missing TABLE OF CONTENTS section',
            'fix_hint': 'Add "## TABLE OF CONTENTS" section with linked entries'
        })
        return errors

    toc_content = toc_match.group(1)

    for line_num, line in enumerate(toc_content.strip().split('\n'), start=1):
        line = line.strip()
        if not line.startswith('- ['):
            continue

        # Double-dash anchors required for GitHub compatibility
        anchor_match = re.search(r'\(#(\d+)-([a-z])', line)
        if anchor_match:
            errors.append({
                'type': 'toc_single_dash_anchor',
                'severity': 'blocking',
                'message': f'TOC anchor uses single dash instead of double dash',
                'line': line,
                'fix_hint': f'Change "#N-" to "#N--" in anchor',
                'auto_fixable': True,
                'fix': line.replace(f'#{anchor_match.group(1)}-', f'#{anchor_match.group(1)}--')
            })

        entry_match = re.search(r'\[(.+?)\]', line)
        if entry_match:
            entry_text = entry_match.group(1)

            # Check for ALL CAPS (only for readme type which requires it)
            uppercase_required = doc_type_rules.get('tocUppercaseRequired', False)
            if uppercase_required and not is_uppercase_section(entry_text):
                section_text = extract_section_name_text(entry_text)
                # Build fixed entry: preserve number and emoji, uppercase the name
                # Pattern: "N. EMOJI name" -> "N. EMOJI NAME"
                fixed_entry = re.sub(
                    r'^(\d+\.\s*)([^\w\s]\s*)?(.+)$',
                    lambda m: f"{m.group(1)}{m.group(2) or ''}{m.group(3).upper()}",
                    entry_text
                )
                fixed_line = line.replace(f'[{entry_text}]', f'[{fixed_entry}]')

                errors.append({
                    'type': 'toc_not_uppercase',
                    'severity': 'blocking',
                    'message': f'TOC entry not ALL CAPS: "{entry_text}"',
                    'line': line,
                    'auto_fixable': True,
                    'fix': fixed_line,
                    'fix_hint': f'Change "{section_text}" to "{section_text.upper()}"'
                })

    return errors


# ───────────────────────────────────────────────────────────────
# 4. HEADER VALIDATION
# ───────────────────────────────────────────────────────────────

def validate_h2_headers(content: str, doc_type_rules: Dict[str, Any], rules: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Validate H2 header format and emojis."""
    errors = []

    h2_pattern = re.compile(r'^## (\d+)\.\s+(.+)$', re.MULTILINE)
    matches = list(h2_pattern.finditer(content))

    if not matches:
        # No numbered H2 headers found - check if this is expected
        # Some documents might use different header styles
        return errors

    expected_num = 1
    emoji_required = doc_type_rules.get('h2EmojiRequired', True)
    section_emojis = doc_type_rules.get('sectionEmojis', {})
    section_aliases = doc_type_rules.get('sectionAliases', {})

    for match in matches:
        num = int(match.group(1))
        title = match.group(2).strip()
        line = match.group(0)

        if num != expected_num:
            errors.append({
                'type': 'non_sequential_numbering',
                'severity': 'warning',
                'message': f'Non-sequential section number: expected {expected_num}, found {num}',
                'line': line
            })
        expected_num = num + 1

        if emoji_required:
            title_has_emoji = has_emoji(title)

            if not title_has_emoji:
                section_name = normalize_section_name(title)

                if section_name in section_aliases:
                    section_name = section_aliases[section_name]

                expected_emoji = section_emojis.get(section_name)

                # Fallback: match ignoring underscores for flexibility
                if not expected_emoji:
                    section_name_no_underscore = section_name.replace('_', '')
                    for key, emoji in section_emojis.items():
                        if key.replace('_', '') == section_name_no_underscore:
                            expected_emoji = emoji
                            break

                errors.append({
                    'type': 'missing_h2_emoji',
                    'severity': 'blocking',
                    'message': f'H2 header missing emoji: "{line}"',
                    'line': line,
                    'section_name': section_name,
                    'expected_emoji': expected_emoji,
                    'auto_fixable': expected_emoji is not None,
                    'fix': f'## {num}. {expected_emoji} {title}' if expected_emoji else None,
                    'fix_hint': f'Add {expected_emoji} after "{num}."' if expected_emoji else 'Add appropriate emoji after section number'
                })

        # Check for ALL CAPS (only for document types that require it)
        uppercase_required = doc_type_rules.get('h2UppercaseRequired', False)
        if uppercase_required and not is_uppercase_section(title):
            section_text = extract_section_name_text(title)
            # Extract emoji if present
            emoji = extract_first_emoji(title)

            if emoji:
                # Has emoji: "EMOJI name" -> "EMOJI NAME"
                title_after_emoji = EMOJI_PATTERN.sub('', title).strip()
                fixed_title = f'{emoji} {title_after_emoji.upper()}'
            else:
                # No emoji: just uppercase
                fixed_title = title.upper()

            errors.append({
                'type': 'h2_not_uppercase',
                'severity': 'blocking',
                'message': f'H2 header not ALL CAPS: "{line}"',
                'line': line,
                'auto_fixable': True,
                'fix': f'## {num}. {fixed_title}',
                'fix_hint': f'Change "{section_text}" to "{section_text.upper()}"'
            })

    return errors


# ───────────────────────────────────────────────────────────────
# 5. SECTION VALIDATION
# ───────────────────────────────────────────────────────────────

def validate_required_sections(content: str, doc_type_rules: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Check that required sections are present."""
    errors = []

    required = doc_type_rules.get('requiredSections', [])
    section_aliases = doc_type_rules.get('sectionAliases', {})

    # Build reverse alias map
    reverse_aliases = {}
    for alias, canonical in section_aliases.items():
        reverse_aliases.setdefault(canonical, []).append(alias)

    h2_pattern = re.compile(r'^## \d+\.\s+[^\n]+', re.MULTILINE)
    headers = h2_pattern.findall(content)

    # Keep both normalized and raw names for partial matching fallback
    found_sections = set()
    found_sections_raw = []
    for header in headers:
        match = re.search(r'^## \d+\.\s+(?:[^\w\s]\s+)?(.+)$', header)
        if match:
            raw_name = match.group(1).strip().lower()
            section_name = normalize_section_name(raw_name)
            found_sections.add(section_name)
            found_sections_raw.append(raw_name)

            if section_name in section_aliases:
                found_sections.add(section_aliases[section_name])

    for req_section in required:
        found = req_section in found_sections

        if not found:
            aliases = reverse_aliases.get(req_section, [])
            for alias in aliases:
                if alias.replace(' ', '_') in found_sections:
                    found = True
                    break

        # Fuzzy match: accept if all required words appear in section name
        if not found:
            req_words = req_section.replace('_', ' ').split()
            for raw_section in found_sections_raw:
                if all(word in raw_section for word in req_words):
                    found = True
                    break

        if not found:
            errors.append({
                'type': 'missing_required_section',
                'severity': 'blocking',
                'message': f'Missing required section: {req_section}',
                'fix_hint': f'Add section with name containing "{req_section}"'
            })

    return errors


# ───────────────────────────────────────────────────────────────
# 6. AUTO-FIX
# ───────────────────────────────────────────────────────────────

def apply_fixes(content: str, errors: List[Dict[str, Any]]) -> Tuple[str, List[Dict[str, Any]]]:
    """
    Apply auto-fixes to content.

    Uses iterative approach: after each fix, re-validates and applies more fixes
    until no more fixes can be applied. This handles cases where multiple fixes
    affect the same line (e.g., single-dash anchor AND missing emoji).
    """
    fixed_content = content
    all_fixes_applied = []
    max_iterations = 10  # Safety limit

    for iteration in range(max_iterations):
        fixes_this_round = []

        for error in errors:
            if not error.get('auto_fixable'):
                continue

            fix = error.get('fix')
            original = error.get('line')

            if fix and original and original in fixed_content:
                fixed_content = fixed_content.replace(original, fix, 1)
                fixes_this_round.append({
                    'type': error['type'],
                    'original': original,
                    'fixed': fix
                })

        if not fixes_this_round:
            # No more fixes could be applied
            break

        all_fixes_applied.extend(fixes_this_round)

        # Re-validate to get updated error list with new line content
        # This allows subsequent fixes to find the modified lines
        # Re-run validation on the fixed content to get fresh errors
        script_dir = Path(__file__).parent
        rules = load_template_rules(script_dir)

        # Detect doc type from original errors or default to readme
        doc_type = 'readme'
        for e in errors:
            if 'skill' in str(e.get('line', '')).lower():
                doc_type = 'skill'
                break

        # Get fresh errors based on current fixed content
        doc_type_rules = rules.get('documentTypes', {}).get(doc_type, {})
        errors = []
        errors.extend(validate_toc(fixed_content, doc_type_rules, rules))
        errors.extend(validate_h2_headers(fixed_content, doc_type_rules, rules))

    return fixed_content, all_fixes_applied


# ───────────────────────────────────────────────────────────────
# 7. MAIN VALIDATION
# ───────────────────────────────────────────────────────────────

def validate_document(
    file_path: str,
    doc_type: Optional[str] = None,
    rules: Optional[Dict[str, Any]] = None,
    skip_exclusions: bool = False,
) -> Dict[str, Any]:
    """
    Validate a markdown document against template rules.

    Args:
        file_path: Path to the markdown file
        doc_type: Document type (readme, skill, etc.) - auto-detected if None
        rules: Template rules dict - loaded from JSON if None
        skip_exclusions: If True, validate even excluded paths

    Returns:
        dict: Validation result with errors, warnings, and summary
    """
    # Check path exclusions (unless explicitly skipped)
    if not skip_exclusions:
        excluded, reason = should_exclude_path(file_path)
        if excluded:
            return {
                'valid': True,
                'skipped': True,
                'skip_reason': reason,
                'document_type': 'unknown',
                'file_path': str(file_path),
                'blocking_errors': [],
                'warnings': [],
                'info': [],
                'total_issues': 0,
                'auto_fixable_count': 0,
                'exit_code': 0
            }

    if rules is None:
        script_dir = Path(__file__).parent
        rules = load_template_rules(script_dir)

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        return {
            'valid': False,
            'error': f'File not found: {file_path}',
            'exit_code': 2
        }
    except Exception as exc:
        return {
            'valid': False,
            'error': f"Error reading file ({type(exc).__name__}): {exc}",
            'exit_code': 2
        }

    if doc_type is None:
        doc_type = detect_document_type(file_path, content, rules)

    doc_type_rules = rules.get('documentTypes', {}).get(doc_type, {})

    if not doc_type_rules:
        return {
            'valid': True,
            'warnings': [f'Unknown document type: {doc_type}, using minimal validation'],
            'exit_code': 0
        }

    all_errors = []
    all_errors.extend(validate_toc(content, doc_type_rules, rules))
    all_errors.extend(validate_h2_headers(content, doc_type_rules, rules))
    all_errors.extend(validate_required_sections(content, doc_type_rules))

    blocking_errors = [e for e in all_errors if e.get('severity') == 'blocking']
    warnings = [e for e in all_errors if e.get('severity') == 'warning']
    info = [e for e in all_errors if e.get('severity') == 'info']

    valid = len(blocking_errors) == 0
    exit_code = 0 if valid else 1

    return {
        'valid': valid,
        'document_type': doc_type,
        'file_path': str(file_path),
        'blocking_errors': blocking_errors,
        'warnings': warnings,
        'info': info,
        'total_issues': len(all_errors),
        'auto_fixable_count': sum(1 for e in all_errors if e.get('auto_fixable')),
        'exit_code': exit_code
    }


# ───────────────────────────────────────────────────────────────
# 8. CLI ENTRY POINT
# ───────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(
        description='Validate markdown documentation against template rules',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__
    )
    parser.add_argument('file', help='Markdown file to validate')
    parser.add_argument('--type', choices=['readme', 'skill', 'reference', 'asset', 'agent', 'command', 'install_guide', 'spec'],
                        help='Document type (auto-detected if not specified)')
    parser.add_argument('--json', action='store_true', help='Output results as JSON')
    parser.add_argument('--blocking-only', action='store_true', help='Show only blocking errors')
    parser.add_argument('--fix', action='store_true', help='Apply auto-fixes')
    parser.add_argument('--dry-run', action='store_true', help='Show fixes without applying (use with --fix)')
    parser.add_argument('--no-exclude', action='store_true',
                        help='Validate even excluded paths (pytest_cache, node_modules, etc.)')

    args = parser.parse_args()

    # Load rules
    script_dir = Path(__file__).parent
    rules = load_template_rules(script_dir)

    # Validate document
    result = validate_document(args.file, args.type, rules, skip_exclusions=args.no_exclude)

    # Handle file errors
    if 'error' in result:
        if args.json:
            print(json.dumps(result, indent=2))
        else:
            print(f"Error: {result['error']}", file=sys.stderr)
        sys.exit(result['exit_code'])

    # Handle skipped files
    if result.get('skipped'):
        if args.json:
            print(json.dumps(result, indent=2))
        else:
            print(f"\n⏭️  SKIPPED: {args.file}")
            print(f"Reason: {result.get('skip_reason', 'Unknown')}")
            print("Use --no-exclude to validate anyway")
        sys.exit(0)

    # Apply fixes if requested
    if args.fix and result.get('auto_fixable_count', 0) > 0:
        with open(args.file, 'r', encoding='utf-8') as f:
            content = f.read()

        all_errors = result.get('blocking_errors', []) + result.get('warnings', [])
        fixed_content, fixes_applied = apply_fixes(content, all_errors)

        if fixes_applied:
            if args.dry_run:
                print("Fixes that would be applied (dry-run):")
                for fix in fixes_applied:
                    print(f"  - {fix['type']}")
                    print(f"    Original: {fix['original']}")
                    print(f"    Fixed:    {fix['fixed']}")
            else:
                with open(args.file, 'w', encoding='utf-8') as f:
                    f.write(fixed_content)
                print(f"Applied {len(fixes_applied)} fixes to {args.file}")

                # Re-validate after fixes
                result = validate_document(args.file, args.type, rules, skip_exclusions=args.no_exclude)

    # Output results
    if args.json:
        # Clean up result for JSON output
        output = {
            'valid': result['valid'],
            'document_type': result['document_type'],
            'file_path': result['file_path'],
            'total_issues': result['total_issues'],
            'auto_fixable_count': result['auto_fixable_count'],
            'blocking_errors': result['blocking_errors'],
            'warnings': result['warnings'] if not args.blocking_only else []
        }
        print(json.dumps(output, indent=2))
    else:
        # Human-readable output
        status = "✅ VALID" if result['valid'] else "❌ INVALID"
        print(f"\n{status}: {args.file}")
        print(f"Document type: {result['document_type']}")
        print(f"Total issues: {result['total_issues']}")

        if result['blocking_errors']:
            print(f"\n🚫 Blocking errors ({len(result['blocking_errors'])}):")
            for error in result['blocking_errors']:
                print(f"  - [{error['type']}] {error['message']}")
                if error.get('line'):
                    print(f"    Line: {error['line'][:60]}...")
                if error.get('fix_hint'):
                    print(f"    Fix: {error['fix_hint']}")
                if error.get('auto_fixable'):
                    print(f"    Auto-fixable: Yes (use --fix)")

        if result['warnings'] and not args.blocking_only:
            print(f"\n⚠️ Warnings ({len(result['warnings'])}):")
            for warning in result['warnings']:
                print(f"  - [{warning['type']}] {warning['message']}")

        if result['auto_fixable_count'] > 0 and not args.fix:
            print(f"\n💡 {result['auto_fixable_count']} issues can be auto-fixed. Run with --fix")

    sys.exit(result['exit_code'])


if __name__ == '__main__':
    main()
