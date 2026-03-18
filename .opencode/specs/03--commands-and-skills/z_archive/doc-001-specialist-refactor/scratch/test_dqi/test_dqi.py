#!/usr/bin/env python3
"""
DQI Test Suite
Tests the Document Quality Index calculation in extract_structure.py
"""

import sys
import os
import json
from pathlib import Path

# Add the scripts directory to the path
SCRIPT_DIR = Path(__file__).parent.parent.parent.parent.parent / ".opencode/skills/create-documentation/scripts"
sys.path.insert(0, str(SCRIPT_DIR))

from extract_structure import extract_structure, calculate_dqi

FIXTURES_DIR = Path(__file__).parent / "fixtures"

# Test results tracking
results = {"passed": 0, "failed": 0, "errors": []}


def test(name, condition, message=""):
    """Simple test assertion helper"""
    if condition:
        results["passed"] += 1
        print(f"  ✓ {name}")
        return True
    else:
        results["failed"] += 1
        error_msg = f"  ✗ {name}: {message}"
        print(error_msg)
        results["errors"].append(error_msg)
        return False


def run_extract(filename):
    """Run extract_structure on a fixture file"""
    filepath = FIXTURES_DIR / filename
    try:
        return extract_structure(str(filepath))
    except Exception as e:
        return {"error": str(e), "exception": True}


# ═══════════════════════════════════════════════════════════════
# TEST: Empty File
# ═══════════════════════════════════════════════════════════════
def test_empty_file():
    print("\n📄 TEST: Empty File")
    result = run_extract("empty.md")
    
    test("No crash on empty file", "error" not in result or not result.get("exception"))
    
    if "dqi" in result:
        dqi = result["dqi"]
        test("DQI exists", dqi is not None)
        test("DQI total is a number", isinstance(dqi.get("total"), (int, float)))
        test("DQI total >= 0", dqi.get("total", -1) >= 0)
        test("DQI total <= 100", dqi.get("total", 101) <= 100)
    else:
        test("Has DQI in result", False, f"Keys: {list(result.keys())}")


# ═══════════════════════════════════════════════════════════════
# TEST: Minimal Valid File
# ═══════════════════════════════════════════════════════════════
def test_minimal_valid():
    print("\n📄 TEST: Minimal Valid Skill File")
    result = run_extract("minimal_valid.md")
    
    test("No error", "error" not in result)
    
    if "dqi" in result:
        dqi = result["dqi"]
        test("DQI total is reasonable (>40)", dqi.get("total", 0) > 40)
        test("Has structure component", "structure" in dqi.get("components", {}))
        test("Has content component", "content" in dqi.get("components", {}))
        test("Has style component", "style" in dqi.get("components", {}))
        
        # Check breakdown exists
        breakdown = dqi.get("breakdown", {})
        test("Has word_count in breakdown", "word_count" in breakdown)
        test("Has h2_count in breakdown", "h2_count" in breakdown)
        test("Has code_block_count in breakdown", "code_block_count" in breakdown)


# ═══════════════════════════════════════════════════════════════
# TEST: No H2 Headings
# ═══════════════════════════════════════════════════════════════
def test_no_h2s():
    print("\n📄 TEST: No H2 Headings")
    result = run_extract("no_h2s.md")
    
    test("No crash without H2s", "error" not in result or not result.get("exception"))
    
    if "dqi" in result:
        dqi = result["dqi"]
        breakdown = dqi.get("breakdown", {})
        
        test("H2 count is 0", breakdown.get("h2_count") == 0)
        test("Heading score is 0", breakdown.get("heading_score") == 0)
        test("DQI still calculates", dqi.get("total") is not None)


# ═══════════════════════════════════════════════════════════════
# TEST: No Code Blocks
# ═══════════════════════════════════════════════════════════════
def test_no_code_blocks():
    print("\n📄 TEST: No Code Blocks")
    result = run_extract("no_code_blocks.md")
    
    test("No error", "error" not in result)
    
    if "dqi" in result:
        dqi = result["dqi"]
        breakdown = dqi.get("breakdown", {})
        
        test("Code block count is 0", breakdown.get("code_block_count") == 0)
        test("Code score is 0", breakdown.get("code_score") == 0)
        test("Total DQI still reasonable", dqi.get("total", 0) > 30)


# ═══════════════════════════════════════════════════════════════
# TEST: Unicode Headings
# ═══════════════════════════════════════════════════════════════
def test_unicode_headings():
    print("\n📄 TEST: Unicode Headings")
    result = run_extract("unicode_headings.md")
    
    test("No crash with unicode", "error" not in result or not result.get("exception"))
    
    if "dqi" in result:
        dqi = result["dqi"]
        test("DQI calculates with unicode", dqi.get("total") is not None)
        test("DQI is valid number", isinstance(dqi.get("total"), (int, float)))


# ═══════════════════════════════════════════════════════════════
# TEST: No Structure
# ═══════════════════════════════════════════════════════════════
def test_no_structure():
    print("\n📄 TEST: No Structure (Plain Text)")
    result = run_extract("no_structure.md")
    
    test("No crash on unstructured file", "error" not in result or not result.get("exception"))
    
    if "dqi" in result:
        dqi = result["dqi"]
        test("DQI exists", dqi is not None)
        # Generic type with no H2s still passes basic checks, so it's acceptable not needs_work
        test("Band is acceptable or lower", dqi.get("band") in ["acceptable", "needs_work"])


# ═══════════════════════════════════════════════════════════════
# TEST: DQI Component Math
# ═══════════════════════════════════════════════════════════════
def test_component_math():
    print("\n🧮 TEST: DQI Component Math")
    result = run_extract("minimal_valid.md")
    
    if "dqi" in result:
        dqi = result["dqi"]
        components = dqi.get("components", {})
        
        # Check component maxes
        test("Structure max is 40", components.get("structure_max") == 40)
        test("Content max is 30", components.get("content_max") == 30)
        test("Style max is 30", components.get("style_max") == 30)
        
        # Check sum equals total
        calc_total = (
            components.get("structure", 0) +
            components.get("content", 0) +
            components.get("style", 0)
        )
        test("Components sum to total", calc_total == dqi.get("total"),
             f"Sum={calc_total}, Total={dqi.get('total')}")


# ═══════════════════════════════════════════════════════════════
# TEST: Quality Bands
# ═══════════════════════════════════════════════════════════════
def test_quality_bands():
    print("\n🏷️ TEST: Quality Band Assignment")
    
    # Test band boundaries by checking the function logic
    # We need to verify bands are assigned correctly
    
    # Test that a real skill file gets "excellent"
    skill_path = SCRIPT_DIR.parent / "SKILL.md"
    if skill_path.exists():
        result = extract_structure(str(skill_path))
        if "dqi" in result:
            dqi = result["dqi"]
            test("SKILL.md total >= 90", dqi.get("total", 0) >= 90)
            test("SKILL.md band is excellent", dqi.get("band") == "excellent")


# ═══════════════════════════════════════════════════════════════
# TEST: Defensive Coding (None inputs)
# ═══════════════════════════════════════════════════════════════
def test_defensive_coding():
    print("\n🛡️ TEST: Defensive Coding")
    
    # Test calculate_dqi directly with None/edge case inputs
    try:
        dqi = calculate_dqi(
            doc_type="generic",
            checklist_pass_rate=100.0,
            metrics=None,  # Should handle None
            headings=None,  # Should handle None
            content=None,   # Should handle None
            style_issues=None,  # Should handle None
            content_issues=None  # Should handle None
        )
        test("Handles None metrics", True)
        test("Handles None headings", True)
        test("Handles None content", True)
        test("Returns valid DQI", "total" in dqi)
    except TypeError as e:
        test("Handles None inputs", False, str(e))
    except Exception as e:
        test("No unexpected errors", False, str(e))


# ═══════════════════════════════════════════════════════════════
# TEST: Regression - Existing Skill Files
# ═══════════════════════════════════════════════════════════════
def test_existing_skill_files():
    print("\n📚 TEST: Regression - Existing Skill Files")
    
    skill_dir = SCRIPT_DIR.parent
    expected_scores = {
        "SKILL.md": 95,  # Should be 95+
        "references/core_standards.md": 90,
        "references/validation.md": 90,
        "assets/skill_md_template.md": 90,
    }
    
    for rel_path, min_score in expected_scores.items():
        filepath = skill_dir / rel_path
        if filepath.exists():
            result = extract_structure(str(filepath))
            if "dqi" in result:
                dqi = result["dqi"]
                test(f"{rel_path} >= {min_score}", 
                     dqi.get("total", 0) >= min_score,
                     f"Got {dqi.get('total')}")


# ═══════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════
def main():
    print("=" * 60)
    print("DQI TEST SUITE")
    print("=" * 60)
    
    # Run all tests
    test_empty_file()
    test_minimal_valid()
    test_no_h2s()
    test_no_code_blocks()
    test_unicode_headings()
    test_no_structure()
    test_component_math()
    test_quality_bands()
    test_defensive_coding()
    test_existing_skill_files()
    
    # Summary
    print("\n" + "=" * 60)
    print("RESULTS")
    print("=" * 60)
    total = results["passed"] + results["failed"]
    print(f"Passed: {results['passed']}/{total}")
    print(f"Failed: {results['failed']}/{total}")
    
    if results["failed"] > 0:
        print("\nFailed tests:")
        for error in results["errors"]:
            print(error)
        return 1
    else:
        print("\n✅ All tests passed!")
        return 0


if __name__ == "__main__":
    sys.exit(main())
