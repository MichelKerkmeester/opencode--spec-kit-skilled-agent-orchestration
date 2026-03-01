#!/usr/bin/env python3
"""
Test runner for broken files - demonstrates DQI detection capabilities
"""

import sys
import json
from pathlib import Path

# Add the scripts directory to the path
SCRIPT_DIR = Path(__file__).parent.parent.parent.parent.parent / ".opencode/skills/create-documentation/scripts"
sys.path.insert(0, str(SCRIPT_DIR))

from extract_structure import extract_structure

BROKEN_FILES_DIR = Path(__file__).parent / "broken_files"

def print_separator(title):
    print("")
    print("═" * 70)
    print(f" {title}")
    print("═" * 70)

def analyze_file(filepath):
    """Analyze a file and print detailed results"""
    result = extract_structure(str(filepath))
    
    filename = filepath.name
    if filepath.parent.name in ['references', 'assets']:
        filename = f"{filepath.parent.name}/{filepath.name}"
    
    print(f"\nFILE: {filename}")
    print(f"TYPE: {result['type']} (detected from: {result['detected_from']})")
    
    # DQI Score
    dqi = result['dqi']
    print(f"\n┌─ DQI SCORE ─────────────────────────────────────────────────┐")
    print(f"│  TOTAL: {dqi['total']:>3}/100  ({dqi['band'].upper():^12})                      │")
    print(f"├─────────────────────────────────────────────────────────────┤")
    print(f"│  Structure: {dqi['components']['structure']:>2}/{dqi['components']['structure_max']}  (checklist pass rate)              │")
    print(f"│  Content:   {dqi['components']['content']:>2}/{dqi['components']['content_max']}  (words, headings, code, links)      │")
    print(f"│  Style:     {dqi['components']['style']:>2}/{dqi['components']['style_max']}  (H2 format, dividers, intro)         │")
    print(f"└─────────────────────────────────────────────────────────────┘")
    
    # Checklist Results
    checklist = result['checklist']
    print(f"\n┌─ CHECKLIST ({checklist['pass_rate']:.0f}% pass rate) ─────────────────────────────┐")
    for item in checklist['results']:
        status = "✓" if item['status'] == 'pass' else "✗"
        check = item['check'][:50]
        print(f"│  {status} {check:<55} │")
    print(f"└─────────────────────────────────────────────────────────────┘")
    
    # Content Issues (placeholders, code blocks without language)
    if result.get('content_issues'):
        print(f"\n┌─ CONTENT ISSUES ({len(result['content_issues'])} found) ─────────────────────────────┐")
        for issue in result['content_issues'][:10]:  # Limit to 10
            line = issue.get('line', '?')
            typ = issue.get('type', 'unknown')
            txt = issue.get('text', issue.get('message', ''))[:40]
            print(f"│  Line {line:>3}: {typ:<12} {txt:<32} │")
        print(f"└─────────────────────────────────────────────────────────────┘")
    
    # Style Issues
    if result.get('style_issues'):
        print(f"\n┌─ STYLE ISSUES ({len(result['style_issues'])} found) ───────────────────────────────┐")
        for issue in result['style_issues'][:10]:  # Limit to 10
            typ = issue.get('type', 'unknown')
            msg = issue.get('message', issue.get('heading', ''))[:45]
            print(f"│  {typ:<18} {msg:<38} │")
        print(f"└─────────────────────────────────────────────────────────────┘")
    
    # DQI Breakdown
    b = dqi['breakdown']
    print(f"\n┌─ DQI BREAKDOWN ──────────────────────────────────────────────┐")
    print(f"│  Word count:     {b['word_count']:>5}  (expected: {b['word_count_range'][0]}-{b['word_count_range'][1]})       │")
    print(f"│  H2 count:       {b['h2_count']:>5}                                      │")
    print(f"│  Code blocks:    {b['code_block_count']:>5}                                      │")
    print(f"├─────────────────────────────────────────────────────────────┤")
    print(f"│  Word score:     {b['word_count_score']:>2}/10                                    │")
    print(f"│  Heading score:  {b['heading_score']:>2}/8                                     │")
    print(f"│  Code score:     {b['code_score']:>2}/6                                     │")
    print(f"│  H2 format:      {b['h2_format_score']:>2}/12                                    │")
    print(f"│  Style issues:   {b['style_issue_count']:>2} (penalty: -{b['style_issue_count']*2})                           │")
    print(f"└─────────────────────────────────────────────────────────────┘")
    
    return result

def main():
    print("=" * 70)
    print(" DQI TEST OUTPUT - BROKEN FILES ANALYSIS")
    print(" Demonstrates detection of document quality issues")
    print("=" * 70)
    
    # Analyze broken SKILL.md
    print_separator("TEST 1: BROKEN SKILL.md")
    skill_path = BROKEN_FILES_DIR / "SKILL.md"
    if skill_path.exists():
        analyze_file(skill_path)
    
    # Analyze broken reference
    print_separator("TEST 2: BROKEN REFERENCE (references/validation.md)")
    ref_path = BROKEN_FILES_DIR / "references" / "validation.md"
    if ref_path.exists():
        analyze_file(ref_path)
    
    # Analyze broken asset
    print_separator("TEST 3: BROKEN ASSET (assets/templates.md)")
    asset_path = BROKEN_FILES_DIR / "assets" / "templates.md"
    if asset_path.exists():
        analyze_file(asset_path)
    
    # Summary comparison with valid files
    print_separator("COMPARISON: BROKEN vs VALID FILES")
    
    # Use absolute paths from script location
    project_root = Path(__file__).parent.parent.parent.parent.parent
    valid_skill = project_root / ".opencode/skills/create-documentation/SKILL.md"
    valid_ref = project_root / ".opencode/skills/create-documentation/references/validation.md"
    valid_asset = project_root / ".opencode/skills/create-documentation/assets/skill_md_template.md"
    
    print("\n┌─────────────────────────────────────────────────────────────────────┐")
    print("│  FILE                          │ BROKEN │ VALID  │ DIFFERENCE      │")
    print("├─────────────────────────────────────────────────────────────────────┤")
    
    comparisons = [
        ("SKILL.md", skill_path, valid_skill),
        ("references/validation.md", ref_path, valid_ref),
        ("assets/templates.md", asset_path, valid_asset),
    ]
    
    for name, broken_path, valid_path in comparisons:
        if broken_path.exists() and valid_path.exists():
            broken_result = extract_structure(str(broken_path))
            valid_result = extract_structure(str(valid_path))
            
            broken_dqi = broken_result['dqi']['total']
            valid_dqi = valid_result['dqi']['total']
            diff = valid_dqi - broken_dqi
            
            print(f"│  {name:<30} │  {broken_dqi:>3}   │  {valid_dqi:>3}   │   +{diff:<3} points   │")
    
    print("└─────────────────────────────────────────────────────────────────────┘")
    
    print("\n" + "=" * 70)
    print(" TEST COMPLETE")
    print("=" * 70)

if __name__ == "__main__":
    main()
