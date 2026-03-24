#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: DOCUMENT STRUCTURE EXTRACTOR
# ───────────────────────────────────────────────────────────────

"""
Document Structure Extractor for Script-Assisted AI Analysis

Extracts structured data from markdown documents for AI consumption:
- Frontmatter parsing with issue detection
- Heading and section extraction
- Code block extraction
- Metrics calculation
- Type-specific checklist validation (skill, readme, asset, reference, command)
- Content quality validation (placeholders, code languages, dividers)
- Style validation (H2 ALL CAPS, H3 semantic emoji, section dividers)
- Evaluation question generation

Output: JSON to stdout for AI agent processing
"""

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple


# ───────────────────────────────────────────────────────────────
# 1. FRONTMATTER PARSER
# ───────────────────────────────────────────────────────────────

def parse_frontmatter(content: str) -> Tuple[Dict[str, Any], List[str], str]:
    """Extract and parse YAML frontmatter from markdown content.

    Args:
        content: Raw markdown file content.

    Returns:
        Tuple of (parsed_dict, issues_list, raw_frontmatter).
    """
    issues = []
    parsed = {}
    raw = ""
    
    # Check if content starts with frontmatter
    if not content.startswith('---'):
        issues.append("No frontmatter found (file should start with ---)")
        return parsed, issues, raw
    
    # Find closing ---
    lines = content.split('\n')
    end_idx = None
    for i, line in enumerate(lines[1:], start=1):
        if line.strip() == '---':
            end_idx = i
            break
    
    if end_idx is None:
        issues.append("Frontmatter not closed (missing closing ---)")
        return parsed, issues, raw
    
    # Extract raw frontmatter
    raw = '\n'.join(lines[1:end_idx])
    
    # Parse key-value pairs (simple regex-based parsing)
    for line in lines[1:end_idx]:
        if ':' in line and not line.strip().startswith('#'):
            key, _, value = line.partition(':')
            key = key.strip()
            value = value.strip()
            
            # Handle array format [item1, item2]
            if value.startswith('[') and value.endswith(']'):
                # Parse inline array
                array_content = value[1:-1]
                parsed[key] = [item.strip() for item in array_content.split(',') if item.strip()]
            elif value:
                parsed[key] = value
            else:
                # Empty value - might be multiline or YAML list following
                parsed[key] = value
    
    # Check for multiline description (YAML block format)
    # Covers:
    # - description: \n  indented...
    # - description: |\n  indented...
    # - description: >\n  indented...
    if re.search(r'description:\s*\n\s+', raw) or re.search(r'^description:\s*[|>]\s*$', raw, flags=re.MULTILINE):
        issues.append("Description uses YAML multiline block format (must be single line after colon)")
    
    # Check for allowed-tools format
    tools_match = re.search(r'allowed-tools:\s*(.+)', raw)
    if tools_match:
        tools_value = tools_match.group(1).strip()
        if tools_value and not tools_value.startswith('['):
            # Check if it's a comma-separated string without brackets
            if ',' in tools_value and not tools_value.startswith('-'):
                issues.append(f"allowed-tools should use array format [Tool1, Tool2], found: {tools_value}")
    
    # Check for TODO placeholders
    if 'description' in parsed and 'TODO' in str(parsed.get('description', '')):
        issues.append("Description contains TODO placeholder")
    
    # Check name format (hyphen-case)
    if 'name' in parsed:
        name = parsed['name']
        if not re.match(r'^[a-z0-9-]+$', name):
            issues.append(f"Name '{name}' should be hyphen-case (lowercase letters, digits, and hyphens only)")
        if name.startswith('-') or name.endswith('-'):
            issues.append(f"Name '{name}' cannot start or end with hyphen")
        if '--' in name:
            issues.append(f"Name '{name}' cannot contain consecutive hyphens")
    
    return parsed, issues, raw


# ───────────────────────────────────────────────────────────────
# 2. MARKDOWN PARSER
# ───────────────────────────────────────────────────────────────

def extract_headings(content: str) -> List[Dict[str, Any]]:
    """Extract all headings with metadata, skipping headings inside code blocks.

    Args:
        content: Raw markdown file content.

    Returns:
        List of heading dicts with level, text, line, has_emoji, has_number.
    """
    headings = []
    lines = content.split('\n')
    in_code_block = False

    for i, line in enumerate(lines, start=1):
        stripped = line.strip()

        # Treat non-empty fence markers inside code blocks as literal example content.
        # Only plain ``` closes an open code block.
        if stripped.startswith('```'):
            if not in_code_block:
                in_code_block = True
                continue
            if stripped == '```':
                in_code_block = False
            continue

        if in_code_block:
            continue

        match = re.match(r'^(#{1,6})\s+(.+)$', line)
        if match:
            level = len(match.group(1))
            text = match.group(2).strip()
            has_emoji = bool(re.search(r'[\U0001F300-\U0001F9FF\u2600-\u26FF\u2700-\u27BF]', text))
            has_number = bool(re.match(r'^\d+\.', text))

            headings.append({
                'level': level,
                'text': text,
                'line': i,
                'has_emoji': has_emoji,
                'has_number': has_number
            })

    return headings


def extract_sections(content: str, headings: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Extract sections (content between headings).

    Args:
        content: Raw markdown file content.
        headings: List of heading dicts from extract_headings.

    Returns:
        List of section dicts with heading, level, line range, word count.
    """
    sections = []
    lines = content.split('\n')

    for i, heading in enumerate(headings):
        start_line = heading['line']
        end_line = headings[i + 1]['line'] - 1 if i + 1 < len(headings) else len(lines)

        section_lines = lines[start_line:end_line]
        section_content = '\n'.join(section_lines)
        words = len(re.findall(r'\b\w+\b', section_content))
        has_code = '```' in section_content
        preview = section_content[:500].strip()
        if len(section_content) > 500:
            preview += '...'

        sections.append({
            'heading': heading['text'],
            'level': heading['level'],
            'line_start': start_line,
            'line_end': end_line,
            'word_count': words,
            'has_code_blocks': has_code,
            'content_preview': preview
        })

    return sections


def extract_code_blocks(content: str) -> List[Dict[str, Any]]:
    """Extract all code blocks with metadata, handling nested examples.

    Args:
        content: Raw markdown file content.

    Returns:
        List of code block dicts with language, line_start, line_count, preview.
    """
    code_blocks = []
    lines = content.split('\n')

    i = 0
    in_code_block = False
    current_block = None

    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        if stripped.startswith('```'):
            if not in_code_block:
                language = stripped[3:].strip()
                current_block = {
                    'language': language or 'unknown',
                    'line_start': i + 1,
                    'code_lines': []
                }
                in_code_block = True
                i += 1
                continue

            if stripped == '```':
                if current_block is not None:
                    code_blocks.append(current_block)
                    current_block = None
                in_code_block = False
                i += 1
                continue

            # Keep fence-like example lines (for example ```python) as content
            # while still inside the currently open block.
            if current_block is not None:
                current_block['code_lines'].append(line)
        elif current_block is not None and in_code_block:
            current_block['code_lines'].append(line)

        i += 1

    # Preserve unclosed trailing block content for analysis robustness.
    if in_code_block and current_block is not None:
        code_blocks.append(current_block)

    result = []
    for block in code_blocks:
        code_content = '\n'.join(block.get('code_lines', []))
        preview = code_content[:100].strip()
        if len(code_content) > 100:
            preview += '...'

        result.append({
            'language': block['language'],
            'line_start': block['line_start'],
            'line_count': len(block.get('code_lines', [])),
            'preview': preview
        })

    return result


# ───────────────────────────────────────────────────────────────
# 3. CONTENT QUALITY VALIDATORS
# ───────────────────────────────────────────────────────────────

# Placeholder patterns to detect
PLACEHOLDER_PATTERNS = [
    r'\[PLACEHOLDER[:\s]?[^\]]*\]',
    r'\[TODO[:\s]?[^\]]*\]',
    r'\[NEEDS CLARIFICATION[:\s]?[^\]]*\]',
    r'\[TBD[:\s]?[^\]]*\]',
    r'\[FIXME[:\s]?[^\]]*\]',
    r'\{\{[A-Z_]+\}\}',  # {{PLACEHOLDER}} style
]

# Semantic emojis allowed on H3 in RULES sections
# Include both base emoji and with variation selector (️)
SEMANTIC_EMOJIS = ['✅', '❌', '⚠️', '⚠', '✔', '✗', '⚡', '✔️', '❎']

# Standard section emojis for template-based documents
# Used to validate H2 headers have proper emoji formatting
SECTION_EMOJIS = {
    # README sections
    '📖', '🚀', '📁', '⚡', '⚙️', '💡', '🛠️', '❓', '📚',
    # SKILL sections  
    '🎯', '🧭', '🔍', '📋', '🏆', '🔌', '🔗',
    # Agent sections
    '🔄', '🚫',
    # Install guide sections
    '🤖', '✅', '📥',
    # Other common
    '📝', '💾', '⚠️', '🔀', '🏗️', '✍️', '🎨', '📄', '🗺️', '📊', '🔧',
}

# Document types that require H2 emojis (blocking error if missing)
# Emoji enforcement has been removed — no document types require H2 emojis
EMOJI_REQUIRED_TYPES = set()


def detect_placeholders(content: str) -> List[Dict[str, Any]]:
    """Detect placeholder markers in content, skipping code blocks.

    Args:
        content: Raw markdown file content.

    Returns:
        List of issue dicts with type, line, text, severity.
    """
    issues = []
    lines = content.split('\n')
    in_code_block = False

    for i, line in enumerate(lines, start=1):
        stripped = line.strip()

        if stripped.startswith('```'):
            if not in_code_block:
                in_code_block = True
                continue
            if stripped == '```':
                in_code_block = False
            continue

        if in_code_block:
            continue

        for pattern in PLACEHOLDER_PATTERNS:
            matches = re.finditer(pattern, line, re.IGNORECASE)
            for match in matches:
                issues.append({
                    'type': 'placeholder',
                    'line': i,
                    'text': match.group(0),
                    'severity': 'error'
                })

    return issues


def check_section_dividers(content: str, headings: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Check for --- dividers between H2 sections.

    Args:
        content: Raw markdown file content.
        headings: List of heading dicts from extract_headings.

    Returns:
        List of issue dicts for missing dividers.
    """
    issues = []
    lines = content.split('\n')
    h2_headings = [h for h in headings if h['level'] == 2]

    for i, h2 in enumerate(h2_headings[:-1]):
        next_h2 = h2_headings[i + 1]
        section_content = '\n'.join(lines[h2['line']:next_h2['line']-1])
        has_divider = bool(re.search(r'\n---\s*\n', section_content)) or section_content.strip().endswith('---')

        if not has_divider:
            issues.append({
                'type': 'missing_divider',
                'line': next_h2['line'] - 1,
                'text': f"Missing --- divider before '{next_h2['text']}'",
                'severity': 'warning'
            })

    return issues


def check_code_block_languages(code_blocks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Check that all code blocks have language tags.

    Args:
        code_blocks: List of code block dicts from extract_code_blocks.

    Returns:
        List of issue dicts for blocks missing language tags.
    """
    issues = []
    
    for block in code_blocks:
        if block['language'] == 'unknown':
            issues.append({
                'type': 'missing_language',
                'line': block['line_start'],
                'text': 'Code block missing language tag',
                'severity': 'warning'
            })
    
    return issues


def check_h2_formatting(headings: List[Dict[str, Any]], doc_type: str) -> List[Dict[str, Any]]:
    """Check H2 formatting: number + emoji + ALL CAPS for template-based types.

    For EMOJI_REQUIRED_TYPES (skill, readme, asset, reference):
    - Missing emoji returns 'error' severity (BLOCKING)
    - Missing number returns 'warning' severity
    - Wrong case returns 'warning' severity

    Args:
        headings: List of heading dicts from extract_headings.
        doc_type: Document type string (skill, readme, asset, reference, etc.).

    Returns:
        List of issue dicts for formatting violations.
    """
    issues = []
    requires_emoji = doc_type in EMOJI_REQUIRED_TYPES

    if doc_type not in ['skill', 'asset', 'readme', 'reference']:
        return issues

    for h in headings:
        if h['level'] != 2:
            continue

        text = h['text']

        if not h['has_number']:
            issues.append({
                'type': 'h2_missing_number',
                'line': h['line'],
                'text': f"H2 '{text}' missing number prefix (e.g., '1. ')",
                'severity': 'warning'
            })

        if not h['has_emoji']:
            severity = 'error' if requires_emoji else 'warning'
            after_number = re.sub(r'^\d+\.\s*', '', text)
            found_char = after_number[0] if after_number else 'nothing'

            issues.append({
                'type': 'h2_missing_emoji',
                'line': h['line'],
                'text': f"H2 '{text}' missing emoji (found: '{found_char}' where emoji expected)",
                'severity': severity
            })

        # ALL CAPS check: extract text after number and emoji
        section_text = re.sub(r'^\d+\.\s*', '', text)
        section_text = re.sub(r'^[\U0001F300-\U0001F9FF\u2600-\u26FF\u2700-\u27BF]\s*', '', section_text)

        if section_text and not section_text.isupper():
            issues.append({
                'type': 'h2_not_caps',
                'line': h['line'],
                'text': f"H2 section name '{section_text}' should be ALL CAPS",
                'severity': 'warning'
            })

    return issues


def check_h3_emoji_usage(headings: List[Dict[str, Any]], content: str) -> List[Dict[str, Any]]:
    """Check H3 emoji usage: only semantic emojis allowed, and only in RULES sections.

    Args:
        headings: List of heading dicts from extract_headings.
        content: Raw markdown file content.

    Returns:
        List of issue dicts for emoji violations.
    """
    issues = []
    rules_start = None
    rules_end = None

    for i, h in enumerate(headings):
        if h['level'] == 2 and 'RULES' in h['text'].upper():
            rules_start = h['line']
            for j in range(i + 1, len(headings)):
                if headings[j]['level'] == 2:
                    rules_end = headings[j]['line']
                    break
            if rules_end is None:
                rules_end = float('inf')
            break

    for h in headings:
        if h['level'] != 3 or not h['has_emoji']:
            continue

        in_rules = rules_start is not None and rules_start < h['line'] < rules_end
        emoji_match = re.search(r'[\U0001F300-\U0001F9FF\u2600-\u26FF\u2700-\u27BF✅❌⚠️✔✗⚡]', h['text'])

        if emoji_match:
            emoji = emoji_match.group(0)
            is_semantic = emoji in SEMANTIC_EMOJIS

            if in_rules and not is_semantic:
                issues.append({
                    'type': 'h3_non_semantic_emoji_in_rules',
                    'line': h['line'],
                    'text': f"H3 in RULES section has non-semantic emoji '{emoji}'. Use only ✅❌⚠️",
                    'severity': 'warning'
                })
            elif not in_rules:
                issues.append({
                    'type': 'h3_emoji_outside_rules',
                    'line': h['line'],
                    'text': f"H3 '{h['text']}' has emoji outside RULES section (decorative emoji on H3 not allowed)",
                    'severity': 'warning'
                })

    return issues


def check_intro_paragraph(content: str, headings: List[Dict[str, Any]], min_words: int = 10) -> bool:
    """Check if there's an introduction paragraph after H1 and before first H2.

    Args:
        content: Raw markdown file content.
        headings: List of heading dicts from extract_headings.
        min_words: Minimum word count for intro to be considered present.

    Returns:
        True if intro paragraph with sufficient words exists.
    """
    if not headings:
        return False

    h1_headings = [h for h in headings if h['level'] == 1]
    h2_headings = [h for h in headings if h['level'] == 2]

    if not h1_headings:
        return False

    h1_line = h1_headings[0]['line']
    first_h2_line = None
    for h in h2_headings:
        if h['line'] > h1_line:
            first_h2_line = h['line']
            break

    if first_h2_line is None:
        first_h2_line = len(content.split('\n'))

    lines = content.split('\n')
    intro_content = '\n'.join(lines[h1_line:first_h2_line-1])
    intro_text = re.sub(r'---', '', intro_content)
    intro_words = len(re.findall(r'\b\w+\b', intro_text))

    return intro_words >= min_words


def check_intro_brief(content: str, headings: List[Dict[str, Any]]) -> bool:
    """Check for brief introduction (5+ words) - used for flowcharts and examples.

    Args:
        content: Raw markdown file content.
        headings: List of heading dicts from extract_headings.

    Returns:
        True if brief intro paragraph exists.
    """
    return check_intro_paragraph(content, headings, min_words=5)


# ───────────────────────────────────────────────────────────────
# 4. METRICS CALCULATOR
# ───────────────────────────────────────────────────────────────

def calculate_metrics(content: str, headings: List[Dict[str, Any]], code_blocks: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Calculate document metrics.

    Args:
        content: Raw markdown file content.
        headings: List of heading dicts from extract_headings.
        code_blocks: List of code block dicts from extract_code_blocks.

    Returns:
        Dict with total_words, total_lines, heading_count, code_block_count, etc.
    """
    lines = content.split('\n')
    words = len(re.findall(r'\b\w+\b', content))
    max_depth = max((h['level'] for h in headings), default=0)

    sections_with_code = 0
    for i, heading in enumerate(headings):
        start = heading['line']
        end = headings[i + 1]['line'] if i + 1 < len(headings) else len(lines)
        section_content = '\n'.join(lines[start:end])
        if '```' in section_content:
            sections_with_code += 1

    return {
        'total_words': words,
        'total_lines': len(lines),
        'heading_count': len(headings),
        'code_block_count': len(code_blocks),
        'max_heading_depth': max_depth,
        'sections_with_code': sections_with_code
    }


# ───────────────────────────────────────────────────────────────
# 5. DOCUMENT TYPE DETECTOR
# ───────────────────────────────────────────────────────────────

def detect_document_type(filepath: str) -> Tuple[str, str]:
    """Detect document type from filepath.

    Args:
        filepath: Path to the markdown file.

    Returns:
        Tuple of (document_type, detection_method).
    """
    path = Path(filepath)
    filename = path.name.lower()
    filepath_str = str(path)

    # Templates have different validation rules (placeholders allowed)
    if 'template' in filename:
        return 'template', 'filename'

    # Flowcharts use ASCII diagrams with flexible structure
    if '/flowcharts/' in filepath_str or '\\flowcharts\\' in filepath_str:
        return 'flowchart', 'path'

    if path.name == 'SKILL.md':
        return 'skill', 'filename'
    elif path.name == 'README.md':
        return 'readme', 'filename'
    elif '/command/' in filepath_str or '\\command\\' in filepath_str or '/commands/' in filepath_str or '\\commands\\' in filepath_str:
        return 'command', 'path'
    elif '/specs/' in filepath_str or '\\specs\\' in filepath_str:
        return 'spec', 'path'
    elif '/assets/' in filepath_str or '\\assets\\' in filepath_str:
        return 'asset', 'path'
    elif '/references/' in filepath_str or '\\references\\' in filepath_str:
        return 'reference', 'path'
    elif '/knowledge/' in filepath_str or '\\knowledge\\' in filepath_str:
        return 'knowledge', 'path'
    else:
        return 'generic', 'default'


# ───────────────────────────────────────────────────────────────
# 6. CHECKLIST RUNNER
# ───────────────────────────────────────────────────────────────

# Type-specific checklists
SKILL_CHECKLIST = [
    ('frontmatter_exists', 'Has YAML frontmatter', lambda fm, h, c: bool(fm.get('raw'))),
    ('name_present', 'Has name field', lambda fm, h, c: 'name' in fm.get('parsed', {})),
    ('name_hyphen_case', 'Name is hyphen-case', lambda fm, h, c: bool(re.match(r'^[a-z0-9-]+$', fm.get('parsed', {}).get('name', '')))),
    ('description_present', 'Has description field', lambda fm, h, c: 'description' in fm.get('parsed', {})),
    ('description_single_line', 'Description is single line', lambda fm, h, c: not any('multiline' in issue.lower() for issue in fm.get('issues', []))),
    ('allowed_tools_present', 'Has allowed-tools field', lambda fm, h, c: 'allowed-tools' in fm.get('parsed', {})),
    ('allowed_tools_array', 'allowed-tools in array format', lambda fm, h, c: not any('array format' in issue.lower() for issue in fm.get('issues', []))),
    ('has_when_to_use', 'Has WHEN TO USE section', lambda fm, h, c: any('WHEN TO USE' in heading['text'].upper() for heading in h)),
    ('has_how_it_works', 'Has HOW IT WORKS section', lambda fm, h, c: any('HOW IT WORKS' in heading['text'].upper() or 'HOW TO USE' in heading['text'].upper() or 'SMART ROUTING' in heading['text'].upper() for heading in h)),
    ('has_rules', 'Has RULES section', lambda fm, h, c: any('RULES' in heading['text'].upper() for heading in h)),
    ('h2_numbered', 'H2s have number prefix', lambda fm, h, c: all(heading['has_number'] for heading in h if heading['level'] == 2)),
    ('no_toc', 'No table of contents', lambda fm, h, c: not any('TABLE OF CONTENTS' in heading['text'].upper() or 'TOC' == heading['text'].upper() for heading in h)),
    ('no_placeholders', 'No placeholder markers', lambda fm, h, c: len(detect_placeholders(c)) == 0),
    ('code_has_language', 'Code blocks have language tags', lambda fm, h, c: all(b['language'] != 'unknown' for b in extract_code_blocks(c)) if extract_code_blocks(c) else True),
]

README_CHECKLIST = [
    ('has_title', 'Has H1 title', lambda fm, h, c: any(heading['level'] == 1 for heading in h)),
    ('h1_no_emoji', 'H1 has no emoji', lambda fm, h, c: not any(heading['has_emoji'] for heading in h if heading['level'] == 1)),
    ('has_blockquote', 'Has blockquote description after H1', lambda fm, h, c: bool(re.search(r'^>\s+.+', c, re.MULTILINE))),
    ('has_toc', 'Has TABLE OF CONTENTS section', lambda fm, h, c: any('TABLE OF CONTENTS' in heading['text'].upper() or heading['text'].upper() == 'TOC' for heading in h)),
    ('h2_numbered', 'H2s have number prefix', lambda fm, h, c: all(heading['has_number'] for heading in h if heading['level'] == 2 and 'TABLE OF CONTENTS' not in heading['text'].upper()) if any(heading['level'] == 2 for heading in h) else True),
]

COMMAND_CHECKLIST = [
    ('frontmatter_exists', 'Has YAML frontmatter', lambda fm, h, c: bool(fm.get('raw'))),
    ('description_present', 'Has description field', lambda fm, h, c: 'description' in fm.get('parsed', {})),
    ('argument_hint_present', 'Has argument-hint field', lambda fm, h, c: 'argument-hint' in fm.get('parsed', {})),
]

GENERIC_CHECKLIST = [
    ('has_content', 'Has content', lambda fm, h, c: len(c) > 100),
]

ASSET_CHECKLIST = [
    ('has_h1_title', 'Has H1 title', lambda fm, h, c: any(heading['level'] == 1 for heading in h)),
    ('h1_no_emoji', 'H1 has no emoji', lambda fm, h, c: not any(heading['has_emoji'] for heading in h if heading['level'] == 1)),
    ('has_intro', 'Has introduction paragraph', lambda fm, h, c: check_intro_paragraph(c, h)),
    ('h2_numbered', 'H2s have number prefix', lambda fm, h, c: all(heading['has_number'] for heading in h if heading['level'] == 2)),
    ('no_placeholders', 'No placeholder markers', lambda fm, h, c: len(detect_placeholders(c)) == 0),
    ('code_has_language', 'Code blocks have language tags', lambda fm, h, c: all(b['language'] != 'unknown' for b in extract_code_blocks(c)) if extract_code_blocks(c) else True),
    ('has_examples', 'Contains code examples', lambda fm, h, c: '```' in c),
]

REFERENCE_CHECKLIST = [
    ('has_h1_title', 'Has H1 title', lambda fm, h, c: any(heading['level'] == 1 for heading in h)),
    ('has_intro', 'Has introduction paragraph', lambda fm, h, c: check_intro_paragraph(c, h)),
    ('h2_numbered', 'H2s have number prefix', lambda fm, h, c: all(heading['has_number'] for heading in h if heading['level'] == 2) if any(heading['level'] == 2 for heading in h) else True),
    ('no_placeholders', 'No placeholder markers', lambda fm, h, c: len(detect_placeholders(c)) == 0),
    ('has_depth', 'Has substantial content (>200 words)', lambda fm, h, c: len(re.findall(r'\b\w+\b', c)) > 200),
]

KNOWLEDGE_CHECKLIST = [
    ('has_h1_title', 'Has H1 title', lambda fm, h, c: any(heading['level'] == 1 for heading in h)),
    ('no_frontmatter', 'No frontmatter (knowledge files)', lambda fm, h, c: not fm.get('raw')),
    ('no_placeholders', 'No placeholder markers', lambda fm, h, c: len(detect_placeholders(c)) == 0),
    ('has_content', 'Has content', lambda fm, h, c: len(c) > 100),
]

# Template files - like assets but placeholders are ALLOWED (they're meant to be filled in)
TEMPLATE_CHECKLIST = [
    ('has_h1_title', 'Has H1 title', lambda fm, h, c: any(heading['level'] == 1 for heading in h)),
    ('h1_no_emoji', 'H1 has no emoji', lambda fm, h, c: not any(heading['has_emoji'] for heading in h if heading['level'] == 1)),
    ('has_intro', 'Has introduction paragraph', lambda fm, h, c: check_intro_paragraph(c, h)),
    ('h2_numbered', 'H2s have number prefix', lambda fm, h, c: all(heading['has_number'] for heading in h if heading['level'] == 2) if any(heading['level'] == 2 for heading in h) else True),
    ('code_has_language', 'Code blocks have language tags', lambda fm, h, c: all(b['language'] != 'unknown' for b in extract_code_blocks(c)) if extract_code_blocks(c) else True),
    ('has_examples', 'Contains code examples or templates', lambda fm, h, c: '```' in c),
]

# Flowchart files - ASCII diagrams with flexible structure (examples, not strict docs)
# Uses check_intro_brief for shorter intro requirement (5 words vs 10)
FLOWCHART_CHECKLIST = [
    ('has_h1_title', 'Has H1 title', lambda fm, h, c: any(heading['level'] == 1 for heading in h)),
    ('has_intro', 'Has brief introduction', lambda fm, h, c: check_intro_brief(c, h)),
    ('has_ascii_diagram', 'Contains ASCII diagram', lambda fm, h, c: any(char in c for char in ['┌', '├', '│', '└', '╭', '╰', '▼', '▶'])),
    ('has_content', 'Has substantial content', lambda fm, h, c: len(c) > 500),
]


def run_checklist(doc_type: str, frontmatter_data: Dict[str, Any], headings: List[Dict[str, Any]], content: str) -> Dict[str, Any]:
    """Run type-specific checklist and return results.

    Args:
        doc_type: Document type string (skill, readme, asset, etc.).
        frontmatter_data: Dict with parsed, issues, and raw keys.
        headings: List of heading dicts from extract_headings.
        content: Raw markdown file content.

    Returns:
        Dict with type, results, passed, failed, pass_rate.
    """
    
    checklist_map = {
        'skill': SKILL_CHECKLIST,
        'readme': README_CHECKLIST,
        'command': COMMAND_CHECKLIST,
        'asset': ASSET_CHECKLIST,
        'reference': REFERENCE_CHECKLIST,
        'knowledge': KNOWLEDGE_CHECKLIST,
        'template': TEMPLATE_CHECKLIST,
        'flowchart': FLOWCHART_CHECKLIST,
        'generic': GENERIC_CHECKLIST,
        'spec': GENERIC_CHECKLIST,
    }
    
    checklist = checklist_map.get(doc_type, GENERIC_CHECKLIST)
    results = []
    passed = 0
    failed = 0
    
    fm_data = {
        'parsed': frontmatter_data.get('parsed', {}),
        'issues': frontmatter_data.get('issues', []),
        'raw': frontmatter_data.get('raw', '')
    }
    
    for check_id, check_name, check_fn in checklist:
        exception_detail = None
        try:
            status = 'pass' if check_fn(fm_data, headings, content) else 'fail'
        except Exception as exc:
            status = 'fail'
            exception_detail = f"{type(exc).__name__}: {exc}"
        
        if status == 'pass':
            passed += 1
            details = None
        else:
            failed += 1
            details = f"Check failed: {check_name}"
            if exception_detail:
                details = f"{details} ({exception_detail})"
        
        results.append({
            'id': check_id,
            'check': check_name,
            'status': status,
            'details': details
        })
    
    total = passed + failed
    pass_rate = (passed / total * 100) if total > 0 else 0
    
    return {
        'type': doc_type,
        'results': results,
        'passed': passed,
        'failed': failed,
        'pass_rate': round(pass_rate, 1)
    }


# ───────────────────────────────────────────────────────────────
# 7. QUESTION GENERATOR
# ───────────────────────────────────────────────────────────────

SKILL_QUESTIONS = [
    ('q1', 'When should I use this skill?', 'WHEN TO USE', 'critical'),
    ('q2', 'How does this skill work?', 'HOW IT WORKS', 'critical'),
    ('q3', 'What are the rules for using this skill?', 'RULES', 'high'),
    ('q4', 'Can you show me an example?', 'EXAMPLES', 'high'),
    ('q5', 'What tools does this skill require?', 'frontmatter.allowed-tools', 'medium'),
    ('q6', 'What does this skill integrate with?', 'INTEGRATION', 'medium'),
]

README_QUESTIONS = [
    ('q1', 'How do I install this?', 'Installation', 'critical'),
    ('q2', 'How do I get started?', 'Usage/Getting Started', 'critical'),
    ('q3', 'What are the main features?', 'Features', 'high'),
    ('q4', 'How do I configure this?', 'Configuration', 'medium'),
    ('q5', 'Where can I get help?', 'Support/Contributing', 'low'),
]

GENERIC_QUESTIONS = [
    ('q1', 'What is this document about?', 'Introduction', 'high'),
    ('q2', 'What are the key points?', 'Main Content', 'high'),
]

ASSET_QUESTIONS = [
    ('q1', 'What templates does this asset provide?', 'Templates', 'critical'),
    ('q2', 'How do I use these templates?', 'Usage/Guidelines', 'critical'),
    ('q3', 'Can you show me a complete example?', 'Examples', 'high'),
    ('q4', 'What are the field requirements?', 'Field Guidelines', 'high'),
    ('q5', 'Are there any variations for different scenarios?', 'Variations', 'medium'),
]

REFERENCE_QUESTIONS = [
    ('q1', 'What is this reference about?', 'Introduction', 'critical'),
    ('q2', 'What are the step-by-step instructions?', 'Workflow/Steps', 'critical'),
    ('q3', 'What patterns or examples are shown?', 'Patterns/Examples', 'high'),
    ('q4', 'What are the common issues and solutions?', 'Troubleshooting', 'high'),
    ('q5', 'What are the key decision points?', 'Decision Logic', 'medium'),
]


def generate_questions(doc_type: str) -> List[Dict[str, Any]]:
    """Generate evaluation questions based on document type.

    Args:
        doc_type: Document type string (skill, readme, asset, etc.).

    Returns:
        List of question dicts with id, question, target_section, importance.
    """
    
    questions_map = {
        'skill': SKILL_QUESTIONS,
        'readme': README_QUESTIONS,
        'asset': ASSET_QUESTIONS,
        'reference': REFERENCE_QUESTIONS,
        'generic': GENERIC_QUESTIONS,
        'spec': GENERIC_QUESTIONS,
        'command': GENERIC_QUESTIONS,
        'knowledge': GENERIC_QUESTIONS,
    }
    
    questions = questions_map.get(doc_type, GENERIC_QUESTIONS)
    
    return [
        {
            'id': q[0],
            'question': q[1],
            'target_section': q[2],
            'importance': q[3]
        }
        for q in questions
    ]


# ───────────────────────────────────────────────────────────────
# 8. DOCUMENT QUALITY INDEX (DQI)
# ───────────────────────────────────────────────────────────────

# Type-specific content thresholds
CONTENT_THRESHOLDS = {
    'skill': {
        'word_count': (2000, 8000),      # SKILL.md files are comprehensive
        'min_headings': 6,
        'heading_density': (1.0, 6.0),   # headings per 500 words (lowered from 1.5 for long docs)
    },
    'readme': {
        'word_count': (500, 3000),
        'min_headings': 4,
        'heading_density': (2.0, 8.0),
    },
    'reference': {
        'word_count': (300, 2500),
        'min_headings': 3,
        'heading_density': (1.5, 6.0),
    },
    'asset': {
        'word_count': (200, 1500),
        'min_headings': 3,
        'heading_density': (2.0, 8.0),
    },
    'template': {
        'word_count': (100, 2000),
        'min_headings': 2,
        'heading_density': (1.0, 10.0),
    },
    'flowchart': {
        'word_count': (100, 5000),
        'min_headings': 1,
        'heading_density': (0.5, 5.0),
    },
    'command': {
        'word_count': (50, 500),
        'min_headings': 1,
        'heading_density': (1.0, 10.0),
    },
    'generic': {
        'word_count': (100, 5000),
        'min_headings': 1,
        'heading_density': (1.0, 8.0),
    },
}


def calculate_dqi(
    doc_type: str,
    checklist_pass_rate: float,
    metrics: Dict[str, Any],
    headings: List[Dict[str, Any]],
    content: str,
    style_issues: List[Dict[str, Any]],
    content_issues: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """Calculate Document Quality Index (DQI) - a 100% deterministic score.

    Components: Structure (40pts), Content (30pts), Style (30pts) = 100pts total.

    Args:
        doc_type: Document type string for threshold lookup.
        checklist_pass_rate: Percentage of checklist items passed (0-100).
        metrics: Dict from calculate_metrics.
        headings: List of heading dicts from extract_headings.
        content: Raw markdown file content.
        style_issues: List of style issue dicts.
        content_issues: List of content issue dicts.

    Returns:
        Dict with total, band, band_description, components, breakdown.
    """
    # Defensive: ensure inputs are valid
    metrics = metrics or {}
    headings = headings or []
    content = content or ""
    style_issues = style_issues or []
    content_issues = content_issues or []
    
    thresholds = CONTENT_THRESHOLDS.get(doc_type, CONTENT_THRESHOLDS['generic'])
    breakdown = {}
    
    # ═══════════════════════════════════════════════════════════════
    # STRUCTURE SCORE (40 points max)
    # Based entirely on checklist pass rate
    # ═══════════════════════════════════════════════════════════════
    structure_score = round(checklist_pass_rate / 100 * 40)
    breakdown['checklist_pass_rate'] = checklist_pass_rate
    
    # ═══════════════════════════════════════════════════════════════
    # CONTENT SCORE (30 points max)
    # ═══════════════════════════════════════════════════════════════
    content_score = 0
    
    # Word count (10 points)
    word_count = metrics.get('total_words', 0)
    min_words, max_words = thresholds['word_count']
    breakdown['word_count'] = word_count
    breakdown['word_count_range'] = [min_words, max_words]
    
    if min_words <= word_count <= max_words:
        word_score = 10
    elif word_count < min_words:
        # Partial credit: 0-9 points based on how close to minimum
        word_score = max(0, int(word_count / min_words * 10))
    else:
        # Over max: slight penalty, cap at 8 points
        word_score = 8
    breakdown['word_count_score'] = word_score
    content_score += word_score
    
    # Heading count and density (8 points)
    heading_count = len([h for h in headings if h['level'] == 2])
    breakdown['h2_count'] = heading_count
    
    # Calculate heading density (H2s per 500 words)
    if word_count > 0:
        heading_density = heading_count / (word_count / 500)
    else:
        heading_density = 0
    breakdown['heading_density'] = round(heading_density, 2)
    
    min_density, max_density = thresholds['heading_density']
    if heading_count >= thresholds['min_headings'] and min_density <= heading_density <= max_density:
        heading_score = 8
    elif heading_count >= thresholds['min_headings']:
        heading_score = 5
    else:
        heading_score = max(0, heading_count * 2)  # 2 points per heading up to min
    breakdown['heading_score'] = min(8, heading_score)
    content_score += breakdown['heading_score']
    
    # Code examples (6 points)
    code_blocks = metrics.get('code_block_count', 0)
    breakdown['code_block_count'] = code_blocks
    
    if code_blocks >= 3:
        code_score = 6
    elif code_blocks >= 1:
        code_score = code_blocks * 2
    else:
        code_score = 0
    breakdown['code_score'] = code_score
    content_score += code_score
    
    # Tables and lists (3 points)
    has_tables = '|' in content and '---' in content
    has_lists = bool(re.search(r'^\s*[-*]\s+', content, re.MULTILINE))
    breakdown['has_tables'] = has_tables
    breakdown['has_lists'] = has_lists
    
    structure_data_score = 0
    if has_tables:
        structure_data_score += 2
    if has_lists:
        structure_data_score += 1
    breakdown['structure_data_score'] = structure_data_score
    content_score += structure_data_score
    
    # Links (3 points)
    internal_links = len(re.findall(r'\[.*?\]\((?!http).*?\)', content))
    external_links = len(re.findall(r'\[.*?\]\(https?://.*?\)', content))
    breakdown['internal_links'] = internal_links
    breakdown['external_links'] = external_links
    
    link_score = 0
    if internal_links >= 2:
        link_score += 2
    elif internal_links >= 1:
        link_score += 1
    if external_links >= 1:
        link_score += 1
    breakdown['link_score'] = min(3, link_score)
    content_score += breakdown['link_score']
    
    # ═══════════════════════════════════════════════════════════════
    # STYLE SCORE (30 points max)
    # ═══════════════════════════════════════════════════════════════
    style_score = 0
    
    # H2 formatting: number + ALL CAPS (12 points)
    h2_headings = [h for h in headings if h['level'] == 2]
    if h2_headings:
        h2_with_number = sum(1 for h in h2_headings if h['has_number'])
        h2_all_caps = sum(1 for h in h2_headings if re.sub(r'^\d+\.\s*', '', re.sub(r'^[\U0001F300-\U0001F9FF\u2600-\u26FF\u2700-\u27BF]\s*', '', h['text'])).isupper())

        h2_format_rate = (h2_with_number + h2_all_caps) / (len(h2_headings) * 2)
        h2_format_score = round(h2_format_rate * 12)
    else:
        h2_format_score = 12  # No H2s = no penalty
    breakdown['h2_format_score'] = h2_format_score
    style_score += h2_format_score
    
    # Section dividers (6 points)
    divider_count = content.count('\n---\n') + content.count('\n---')
    expected_dividers = max(0, len(h2_headings) - 1)
    breakdown['divider_count'] = divider_count
    breakdown['expected_dividers'] = expected_dividers
    
    if expected_dividers == 0 or divider_count >= expected_dividers:
        divider_score = 6
    else:
        divider_score = round(divider_count / expected_dividers * 6) if expected_dividers > 0 else 6
    breakdown['divider_score'] = divider_score
    style_score += divider_score
    
    # Style issues penalty (8 points - deduct for issues)
    style_issue_count = len(style_issues)
    breakdown['style_issue_count'] = style_issue_count
    style_issue_score = max(0, 8 - style_issue_count * 2)
    breakdown['style_issue_score'] = style_issue_score
    style_score += style_issue_score
    
    # Intro paragraph (4 points)
    has_intro = check_intro_paragraph(content, headings)
    breakdown['has_intro'] = has_intro
    intro_score = 4 if has_intro else 0
    breakdown['intro_score'] = intro_score
    style_score += intro_score
    
    # ═══════════════════════════════════════════════════════════════
    # TOTAL DQI
    # ═══════════════════════════════════════════════════════════════
    total_dqi = structure_score + content_score + style_score
    
    # Determine quality band
    if total_dqi >= 90:
        band = 'excellent'
        band_description = 'Production-ready documentation'
    elif total_dqi >= 75:
        band = 'good'
        band_description = 'Minor improvements recommended'
    elif total_dqi >= 60:
        band = 'acceptable'
        band_description = 'Several areas need attention'
    else:
        band = 'needs_work'
        band_description = 'Significant improvements required'
    
    return {
        'total': total_dqi,
        'band': band,
        'band_description': band_description,
        'components': {
            'structure': structure_score,
            'structure_max': 40,
            'content': content_score,
            'content_max': 30,
            'style': style_score,
            'style_max': 30,
        },
        'breakdown': breakdown
    }


# ───────────────────────────────────────────────────────────────
# 9. MAIN EXTRACTION FUNCTION
# ───────────────────────────────────────────────────────────────

def extract_structure(filepath: str) -> Dict[str, Any]:
    """Main extraction function - parses document and returns structured JSON.

    Args:
        filepath: Path to the markdown file to extract.

    Returns:
        Dict with file, type, frontmatter, structure, code_blocks, metrics,
        checklist, content_issues, style_issues, dqi, evaluation_questions.
    """
    path = Path(filepath)

    if not path.exists():
        return {'error': f"File not found: {filepath}"}

    if not path.is_file():
        return {'error': f"Path is not a file: {filepath}"}

    try:
        content = path.read_text(encoding='utf-8')
    except Exception as exc:
        return {'error': f"Failed to read file ({type(exc).__name__}): {exc}"}

    doc_type, detected_from = detect_document_type(filepath)
    parsed_fm, fm_issues, raw_fm = parse_frontmatter(content)
    frontmatter_data = {
        'raw': raw_fm,
        'parsed': parsed_fm,
        'issues': fm_issues
    }

    headings = extract_headings(content)
    sections = extract_sections(content, headings)
    code_blocks = extract_code_blocks(content)
    metrics = calculate_metrics(content, headings, code_blocks)
    checklist = run_checklist(doc_type, frontmatter_data, headings, content)

    content_issues = []
    content_issues.extend(detect_placeholders(content))
    content_issues.extend(check_code_block_languages(code_blocks))

    style_issues = []
    if doc_type in EMOJI_REQUIRED_TYPES:
        style_issues.extend(check_h2_formatting(headings, doc_type))
        style_issues.extend(check_section_dividers(content, headings))
    if doc_type == 'skill':
        style_issues.extend(check_h3_emoji_usage(headings, content))

    questions = generate_questions(doc_type)
    dqi = calculate_dqi(
        doc_type=doc_type,
        checklist_pass_rate=checklist['pass_rate'],
        metrics=metrics,
        headings=headings,
        content=content,
        style_issues=style_issues,
        content_issues=content_issues
    )

    return {
        'file': str(path.absolute()),
        'type': doc_type,
        'detected_from': detected_from,
        'frontmatter': frontmatter_data,
        'structure': {
            'headings': headings,
            'sections': sections
        },
        'code_blocks': code_blocks,
        'metrics': metrics,
        'checklist': checklist,
        'content_issues': content_issues,
        'style_issues': style_issues,
        'dqi': dqi,
        'evaluation_questions': questions
    }


# ───────────────────────────────────────────────────────────────
# 10. CLI ENTRY POINT
# ───────────────────────────────────────────────────────────────

def main() -> None:
    """CLI entry point for document structure extraction."""
    parser = argparse.ArgumentParser(
        description="Extract structured analysis data from a markdown document."
    )
    parser.add_argument(
        'filepath',
        help="Path to the markdown file to analyze",
    )
    args = parser.parse_args()

    result = extract_structure(args.filepath)
    
    # Output JSON to stdout
    print(json.dumps(result, indent=2))
    
    # Exit with error code if extraction failed
    if 'error' in result:
        sys.exit(1)


if __name__ == "__main__":
    main()
