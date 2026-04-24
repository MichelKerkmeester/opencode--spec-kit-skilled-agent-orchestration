#!/usr/bin/env python3
"""Enumerate canonical spec docs that have no frontmatter delimiters."""
from pathlib import Path

ROOT = Path('/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs')
CANONICAL_BASENAMES = {
    'spec.md', 'plan.md', 'tasks.md', 'checklist.md',
    'decision-record.md', 'implementation-summary.md',
    'handover.md', 'research.md',
}

no_frontmatter = []
for p in sorted(ROOT.rglob('*.md')):
    if p.name not in CANONICAL_BASENAMES:
        continue
    s = str(p)
    if any(seg in s for seg in ('/z_archive/', '/z_future/', '/node_modules/',
                                 '/research/iterations/', '/review/iterations/',
                                 '/.tmp/', '/tmp-test-fixtures/')):
        continue
    try:
        text = p.read_text(encoding='utf-8', errors='replace')
    except Exception:
        continue
    if not text.startswith('---\n'):
        # Also record file size and first line
        first_line = text.split('\n', 1)[0][:120] if text else '(empty)'
        no_frontmatter.append({
            'path': str(p.relative_to(ROOT.parent.parent.parent)),
            'size': len(text),
            'first_line': first_line,
        })

print(f'Total: {len(no_frontmatter)}')
for entry in no_frontmatter:
    print(f"{entry['size']:>6}b | {entry['path']}")
