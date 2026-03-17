#!/usr/bin/env python3
"""
Automated test runner for validate_document.py

Validates that the documentation validator correctly identifies:
- Valid documents (exit code 0)
- Invalid documents with specific error types (exit code 1)

Usage:
    python test_validator.py
    python test_validator.py --verbose

Exit Codes:
    0 - All tests passed
    1 - One or more tests failed
"""

import json
import subprocess
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

# ───────────────────────────────────────────────────────────────
# 1. TEST CONFIGURATION
# ───────────────────────────────────────────────────────────────

TEST_CASES: List[Dict[str, Any]] = [
    {
        "file": "valid_readme.md",
        "doc_type": "readme",
        "expected_exit": 0,
        "expected_errors": [],
        "description": "Valid README with TOC and double-dash anchors"
    },
    {
        "file": "valid_skill.md",
        "doc_type": "skill",
        "expected_exit": 0,
        "expected_errors": [],
        "description": "Valid SKILL.md with all required sections"
    },
    {
        "file": "missing_toc.md",
        "doc_type": "readme",
        "expected_exit": 1,
        "expected_errors": ["missing_toc"],
        "description": "README missing TABLE OF CONTENTS section"
    },
    {
        "file": "single_dash_anchors.md",
        "doc_type": "readme",
        "expected_exit": 1,
        "expected_errors": ["toc_single_dash_anchor"],
        "description": "README with single-dash TOC anchors instead of double-dash"
    },
    {
        "file": "missing_emojis.md",
        "doc_type": "readme",
        "expected_exit": 0,
        "expected_errors": [],
        "description": "README without H2 emojis (valid - emojis not required)"
    },
    {
        "file": "missing_sections.md",
        "doc_type": "skill",
        "expected_exit": 1,
        "expected_errors": ["missing_required_section"],
        "description": "SKILL.md missing required sections (smart_routing, how_it_works, rules)"
    },
    {
        "file": "valid_command.md",
        "doc_type": "command",
        "expected_exit": 0,
        "expected_errors": [],
        "expected_document_type": "command",
        "description": "Valid command doc using explicit --type command"
    },
    {
        "file": "valid_install_guide.md",
        "doc_type": "install_guide",
        "expected_exit": 0,
        "expected_errors": [],
        "expected_document_type": "install_guide",
        "description": "Valid install guide doc using explicit --type install_guide"
    },
    {
        "file": "command/auto_detect_command.md",
        "doc_type": None,
        "expected_exit": 0,
        "expected_errors": [],
        "expected_document_type": "command",
        "description": "Command doc auto-detects from /command/ path"
    },
    {
        "file": "valid_spec.md",
        "doc_type": "spec",
        "expected_exit": 0,
        "expected_errors": [],
        "expected_document_type": "spec",
        "description": "Valid spec doc using explicit --type spec"
    },
    {
        "file": "specs/auto_detect_spec.md",
        "doc_type": None,
        "expected_exit": 0,
        "expected_errors": [],
        "expected_document_type": "spec",
        "description": "Spec doc auto-detects from /specs/ path"
    }
]


# ───────────────────────────────────────────────────────────────
# 2. TEST RUNNER
# ───────────────────────────────────────────────────────────────

class TestResult:
    """Container for individual test results."""
    
    def __init__(
        self,
        name: str,
        passed: bool,
        message: str,
        details: Optional[Dict[str, Any]] = None,
    ) -> None:
        self.name = name
        self.passed = passed
        self.message = message
        self.details = details or {}


def run_validator(
    test_file: Path,
    doc_type: Optional[str],
    validator_path: Path,
) -> Tuple[int, Optional[Dict[str, Any]], Optional[str]]:
    """
    Run the validator on a test file.
    
    Returns:
        tuple: (exit_code, json_output, error_message)
    """
    cmd = [
        sys.executable,  # Use same Python interpreter
        str(validator_path),
        str(test_file),
        "--json"
    ]
    if doc_type:
        cmd.extend(["--type", doc_type])
    
    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=30
        )
        
        # Parse JSON output
        if result.stdout.strip():
            try:
                json_output = json.loads(result.stdout)
            except json.JSONDecodeError as exc:
                return (
                    result.returncode,
                    None,
                    f"JSON parse error: {exc}\nStdout: {result.stdout}",
                )
        else:
            json_output = None
            
        return (result.returncode, json_output, result.stderr if result.stderr else None)
        
    except subprocess.TimeoutExpired:
        return (-1, None, "Timeout: validator took more than 30 seconds")
    except OSError as exc:
        return (-1, None, f"Execution error: {exc}")


def run_test(
    test_case: Dict[str, Any],
    tests_dir: Path,
    validator_path: Path,
    verbose: bool = False,
) -> TestResult:
    """
    Run a single test case and return the result.
    """
    test_file = tests_dir / test_case["file"]
    doc_type = test_case.get("doc_type")
    expected_exit = test_case["expected_exit"]
    expected_errors = test_case["expected_errors"]
    expected_document_type = test_case.get("expected_document_type")
    description = test_case.get("description", test_case["file"])
    
    # Check test file exists
    if not test_file.exists():
        return TestResult(
            name=test_case["file"],
            passed=False,
            message=f"Test fixture not found: {test_file}",
            details={"test_file_missing": True}
        )
    
    # Run validator
    exit_code, json_output, error_msg = run_validator(test_file, doc_type, validator_path)
    
    # Check exit code
    if exit_code != expected_exit:
        return TestResult(
            name=test_case["file"],
            passed=False,
            message=f"Exit code mismatch: expected {expected_exit}, got {exit_code}",
            details={
                "expected_exit": expected_exit,
                "actual_exit": exit_code,
                "json_output": json_output,
                "stderr": error_msg
            }
        )
    
    # For invalid documents, verify error types
    if expected_errors and json_output:
        blocking_errors = json_output.get("blocking_errors", [])
        found_error_types = {e.get("type") for e in blocking_errors}
        
        missing_errors = []
        for expected_error in expected_errors:
            if expected_error not in found_error_types:
                missing_errors.append(expected_error)
        
        if missing_errors:
            return TestResult(
                name=test_case["file"],
                passed=False,
                message=f"Missing expected error types: {missing_errors}",
                details={
                    "expected_errors": expected_errors,
                    "found_errors": list(found_error_types),
                    "missing": missing_errors,
                    "json_output": json_output
                }
            )
    
    # For valid documents, ensure no blocking errors
    if expected_exit == 0 and json_output:
        blocking_errors = json_output.get("blocking_errors", [])
        if blocking_errors:
            found_types = [e.get("type") for e in blocking_errors]
            return TestResult(
                name=test_case["file"],
                passed=False,
                message=f"Valid document has blocking errors: {found_types}",
                details={
                    "unexpected_errors": blocking_errors,
                    "json_output": json_output
                }
            )

    if expected_document_type and json_output:
        actual_document_type = json_output.get("document_type")
        if actual_document_type != expected_document_type:
            return TestResult(
                name=test_case["file"],
                passed=False,
                message=f"Document type mismatch: expected {expected_document_type}, got {actual_document_type}",
                details={
                    "expected_document_type": expected_document_type,
                    "actual_document_type": actual_document_type,
                    "json_output": json_output
                }
            )
    
    return TestResult(
        name=test_case["file"],
        passed=True,
        message=f"PASS: {description}",
        details={"json_output": json_output} if verbose else {}
    )


# ───────────────────────────────────────────────────────────────
# 3. MAIN ENTRY POINT
# ───────────────────────────────────────────────────────────────

def main() -> None:
    verbose = "--verbose" in sys.argv or "-v" in sys.argv
    
    # Determine paths
    tests_dir = Path(__file__).parent
    scripts_dir = tests_dir.parent
    validator_path = scripts_dir / "validate_document.py"
    
    # Verify validator exists
    if not validator_path.exists():
        print(f"ERROR: Validator not found at {validator_path}")
        sys.exit(2)
    
    print("=" * 60)
    print("DOCUMENTATION VALIDATOR TEST SUITE")
    print("=" * 60)
    print(f"Validator: {validator_path}")
    print(f"Test files: {tests_dir}")
    print(f"Test cases: {len(TEST_CASES)}")
    print("-" * 60)
    
    # Run all tests
    results: List[TestResult] = []
    for test_case in TEST_CASES:
        result = run_test(test_case, tests_dir, validator_path, verbose)
        results.append(result)
        
        # Print result
        status = "PASS" if result.passed else "FAIL"
        icon = "✓" if result.passed else "✗"
        print(f"  [{status}] {icon} {result.name}")
        
        if not result.passed:
            print(f"        {result.message}")
            if verbose and result.details:
                for key, value in result.details.items():
                    if key != "json_output":
                        print(f"        {key}: {value}")
    
    # Summary
    print("-" * 60)
    passed = sum(1 for r in results if r.passed)
    failed = len(results) - passed
    
    print(f"SUMMARY: {passed}/{len(results)} tests passed")
    
    if failed > 0:
        print(f"\nFailed tests ({failed}):")
        for result in results:
            if not result.passed:
                print(f"  - {result.name}: {result.message}")
        print("\n" + "=" * 60)
        print("TEST SUITE FAILED")
        print("=" * 60)
        sys.exit(1)
    else:
        print("\n" + "=" * 60)
        print("ALL TESTS PASSED")
        print("=" * 60)
        sys.exit(0)


if __name__ == "__main__":
    main()
