#!/usr/bin/env python3
"""Fix missing ANCHOR markers in spec folder documents.

Scans markdown files for H2 sections and adds <!-- ANCHOR:name --> / <!-- /ANCHOR:name -->
markers where they're missing, based on known section-to-anchor mappings per file type.

Usage: python3 fix-anchors.py <spec-folder-path> [--dry-run] [--recursive]
"""

import os
import re
import sys
import json

# Anchor mappings: H2 header pattern -> anchor name
# Keys are regex patterns matching the H2 text (case-insensitive)
SPEC_ANCHORS = {
    r'1\.\s*METADATA|METADATA': 'metadata',
    r'2\.\s*PROBLEM|PROBLEM\s*&?\s*PURPOSE': 'problem',
    r'3\.\s*SCOPE|SCOPE': 'scope',
    r'4\.\s*REQUIREMENTS|REQUIREMENTS': 'requirements',
    r'5\.\s*SUCCESS|SUCCESS\s*CRITERIA': 'success-criteria',
    r'6\.\s*RISKS|RISKS\s*&?\s*DEPENDENCIES': 'risks',
    r'7\.\s*OPEN\s*QUESTIONS|10\.\s*OPEN\s*QUESTIONS|OPEN\s*QUESTIONS': 'questions',
    r'L2:\s*NON-FUNCTIONAL|NON-FUNCTIONAL\s*REQUIREMENTS': 'nfr',
    r'L2:\s*EDGE\s*CASES|EDGE\s*CASES': 'edge-cases',
    r'L2:\s*COMPLEXITY|COMPLEXITY\s*ASSESSMENT': 'complexity',
}

PLAN_ANCHORS = {
    r'1\.\s*SUMMARY|SUMMARY': 'summary',
    r'2\.\s*QUALITY\s*GATES|QUALITY\s*GATES': 'quality-gates',
    r'3\.\s*ARCHITECTURE|ARCHITECTURE': 'architecture',
    r'4\.\s*IMPLEMENTATION\s*PHASES|IMPLEMENTATION\s*PHASES': 'phases',
    r'5\.\s*TESTING\s*STRATEGY|TESTING\s*STRATEGY': 'testing',
    r'6\.\s*DEPENDENCIES|DEPENDENCIES': 'dependencies',
    r'7\.\s*ROLLBACK|ROLLBACK\s*PLAN': 'rollback',
    r'L2:\s*PHASE\s*DEPENDENCIES|PHASE\s*DEPENDENCIES': 'phase-deps',
    r'L2:\s*EFFORT|EFFORT\s*ESTIMATION': 'effort',
    r'L2:\s*ENHANCED\s*ROLLBACK|ENHANCED\s*ROLLBACK': 'enhanced-rollback',
}

TASKS_ANCHORS = {
    r'Task\s*Notation': 'notation',
    r'Phase\s*1': 'phase-1',
    r'Phase\s*2': 'phase-2',
    r'Phase\s*3': 'phase-3',
    r'Completion\s*Criteria': 'completion',
    r'Cross-References|Cross\s*References': 'cross-refs',
}

CHECKLIST_ANCHORS = {
    r'Verification\s*Protocol': 'protocol',
    r'Pre-Implementation': 'pre-impl',
    r'Code\s*Quality': 'code-quality',
    r'Testing': 'testing',
    r'Security': 'security',
    r'Documentation': 'docs',
    r'File\s*Organization': 'file-org',
    r'Verification\s*Summary': 'summary',
}

IMPL_SUMMARY_ANCHORS = {
    r'Metadata': 'metadata',
    r'What\s*Was\s*Built': 'what-built',
    r'How\s*It\s*Was\s*Delivered': 'how-delivered',
    r'Key\s*Decisions': 'decisions',
    r'Verification': 'verification',
    r'Known\s*Limitations': 'limitations',
}

DECISION_RECORD_ANCHORS = {
    r'1\.\s*METADATA|METADATA': 'metadata',
    r'Context|CONTEXT': 'context',
    r'Decision|DECISION': 'decision',
    r'Options|OPTIONS\s*CONSIDERED': 'options',
    r'Rationale|RATIONALE': 'rationale',
    r'Consequences|CONSEQUENCES': 'consequences',
}

FILE_ANCHOR_MAP = {
    'spec.md': SPEC_ANCHORS,
    'plan.md': PLAN_ANCHORS,
    'tasks.md': TASKS_ANCHORS,
    'checklist.md': CHECKLIST_ANCHORS,
    'implementation-summary.md': IMPL_SUMMARY_ANCHORS,
    'decision-record.md': DECISION_RECORD_ANCHORS,
}


def find_h2_sections(lines):
    """Find all H2 section positions and their text."""
    sections = []
    for i, line in enumerate(lines):
        m = re.match(r'^##\s+(.+)$', line.rstrip())
        if m:
            sections.append((i, m.group(1).strip()))
    return sections


def has_anchor(lines, line_idx, anchor_name):
    """Check if an ANCHOR comment exists near the given line."""
    # Check up to 5 lines before the H2 header
    start = max(0, line_idx - 5)
    for i in range(start, line_idx):
        if f'ANCHOR:{anchor_name}' in lines[i]:
            return True
    return False


def has_closing_anchor(lines, start_idx, next_section_idx, anchor_name):
    """Check if a closing /ANCHOR comment exists between sections."""
    end = next_section_idx if next_section_idx else len(lines)
    for i in range(start_idx, end):
        if f'/ANCHOR:{anchor_name}' in lines[i]:
            return True
    return False


def fix_file(filepath, anchor_map, dry_run=False):
    """Fix missing anchors in a single file. Returns (changes_made, details)."""
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    sections = find_h2_sections(lines)
    changes = []
    insertions = []  # (line_index, text, is_before)

    for sec_idx, (line_num, header_text) in enumerate(sections):
        # Try to match this header to an anchor
        matched_anchor = None
        for pattern, anchor_name in anchor_map.items():
            if re.search(pattern, header_text, re.IGNORECASE):
                matched_anchor = anchor_name
                break

        if not matched_anchor:
            continue

        # Check if opening anchor exists
        if not has_anchor(lines, line_num, matched_anchor):
            insertions.append((line_num, f'<!-- ANCHOR:{matched_anchor} -->\n', 'before'))
            changes.append(f'  + Added <!-- ANCHOR:{matched_anchor} --> before "{header_text}"')

        # Check if closing anchor exists
        next_line = sections[sec_idx + 1][0] if sec_idx + 1 < len(sections) else len(lines)
        if not has_closing_anchor(lines, line_num, next_line, matched_anchor):
            # Insert closing anchor before the next section (or before --- separator)
            insert_pos = next_line
            # Look for a --- separator before next section
            for i in range(next_line - 1, line_num, -1):
                if lines[i].strip() == '---':
                    insert_pos = i
                    break
                elif lines[i].strip() == '':
                    continue
                else:
                    insert_pos = i + 1
                    break
            insertions.append((insert_pos, f'<!-- /ANCHOR:{matched_anchor} -->\n', 'before'))
            changes.append(f'  + Added <!-- /ANCHOR:{matched_anchor} --> (closing)')

    if not changes:
        return 0, []

    if dry_run:
        return len(changes), changes

    # Apply insertions in reverse order (to preserve line indices)
    insertions.sort(key=lambda x: x[0], reverse=True)
    for pos, text, _ in insertions:
        lines.insert(pos, text)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(lines)

    return len(changes), changes


def process_folder(folder_path, dry_run=False):
    """Process a single spec folder."""
    total_changes = 0
    details = []

    for filename, anchor_map in FILE_ANCHOR_MAP.items():
        filepath = os.path.join(folder_path, filename)
        if os.path.exists(filepath):
            count, file_details = fix_file(filepath, anchor_map, dry_run)
            if count > 0:
                details.append(f'{filename}: {count} anchor(s) added')
                details.extend(file_details)
                total_changes += count

    return total_changes, details


def main():
    if len(sys.argv) < 2:
        print("Usage: python3 fix-anchors.py <path> [--dry-run] [--recursive]")
        sys.exit(1)

    path = sys.argv[1]
    dry_run = '--dry-run' in sys.argv
    recursive = '--recursive' in sys.argv

    if not os.path.isdir(path):
        print(f"Not a directory: {path}")
        sys.exit(1)

    folders = []
    if recursive:
        # Walk through all spec folders
        for root, dirs, files in os.walk(path):
            if 'spec.md' in files or 'plan.md' in files or 'tasks.md' in files:
                folders.append(root)
    else:
        folders.append(path)

    total_folders_fixed = 0
    total_changes = 0
    mode = "DRY-RUN" if dry_run else "APPLY"

    print(f"=== Anchor Fix [{mode}] ===")
    print(f"Scanning {len(folders)} folder(s)...\n")

    for folder in sorted(folders):
        count, details = process_folder(folder, dry_run)
        if count > 0:
            rel = os.path.relpath(folder)
            print(f"[{count:3d} fixes] {rel}")
            for d in details:
                print(f"  {d}")
            total_folders_fixed += 1
            total_changes += count

    print(f"\n=== Summary ===")
    print(f"Folders scanned: {len(folders)}")
    print(f"Folders with fixes: {total_folders_fixed}")
    print(f"Total anchor changes: {total_changes}")
    if dry_run:
        print("(dry-run — no files modified)")


if __name__ == '__main__':
    main()
