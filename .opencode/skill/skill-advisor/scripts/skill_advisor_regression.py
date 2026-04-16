#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: SKILL ADVISOR REGRESSION HARNESS
# ───────────────────────────────────────────────────────────────

"""Regression harness for skill_advisor routing quality.

Usage: python3 skill_advisor_regression.py --dataset <jsonl-path> [--out report.json]
Output: JSON report with routing metrics, gate checks, and pass/fail status.
"""

from __future__ import annotations

# ───────────────────────────────────────────────────────────────
# 1. IMPORTS
# ───────────────────────────────────────────────────────────────

import argparse
import importlib.util
import json
import os
import sys
from typing import Any, Dict, List


# ───────────────────────────────────────────────────────────────
# 2. CONFIGURATION
# ───────────────────────────────────────────────────────────────

SCRIPT_DIR = os.path.dirname(os.path.realpath(__file__))
ADVISOR_PATH = os.path.join(SCRIPT_DIR, "skill_advisor.py")


# ───────────────────────────────────────────────────────────────
# 3. DATA LOADING
# ───────────────────────────────────────────────────────────────

def load_advisor_module() -> Any:
    """Load the advisor module from disk for regression checks."""
    spec = importlib.util.spec_from_file_location("skill_advisor", ADVISOR_PATH)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"Failed to load advisor module from {ADVISOR_PATH}")

    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def load_jsonl(path: str) -> List[Dict[str, Any]]:
    """Load a JSONL dataset and surface line-numbered parse failures.

    Validates that each row is an object with a non-empty ``prompt``
    field, matching the same contract enforced by the bench harness.
    """
    rows: List[Dict[str, Any]] = []
    with open(path, "r", encoding="utf-8") as handle:
        for line_number, raw in enumerate(handle, start=1):
            stripped = raw.strip()
            if not stripped:
                continue
            try:
                row = json.loads(stripped)
            except json.JSONDecodeError as exc:
                raise ValueError(f"Invalid JSONL at line {line_number}: {exc}") from exc
            if not isinstance(row, dict):
                raise ValueError(f"JSONL line {line_number}: expected object, got {type(row).__name__}")
            prompt = row.get("prompt", "").strip() if isinstance(row.get("prompt"), str) else ""
            if not prompt:
                raise ValueError(f"JSONL line {line_number}: missing or empty 'prompt' field")
            rows.append(row)
    return rows


# ───────────────────────────────────────────────────────────────
# 4. EVALUATION LOGIC
# ───────────────────────────────────────────────────────────────

def evaluate_case(advisor: Any, case: Dict[str, Any], threshold: float, uncertainty: float) -> Dict[str, Any]:
    """Run a single regression case and record its expectation checks."""
    prompt = case["prompt"]
    confidence_only = bool(case.get("confidence_only", False))
    recommendations = advisor.analyze_prompt(
        prompt=prompt,
        confidence_threshold=threshold,
        uncertainty_threshold=uncertainty,
        confidence_only=confidence_only,
        show_rejections=False,
    )

    top = recommendations[0] if recommendations else None
    expected_top = case.get("expected_top_any", [])
    expect_result = bool(case.get("expect_result", True))
    expect_kind = case.get("expect_kind")

    result_ok = bool(top) == expect_result
    top_ok = True
    kind_ok = True

    if expect_result and top is not None and expected_top:
        top_ok = top["skill"] in expected_top

    if expect_result and top is not None and expect_kind:
        kind_ok = top.get("kind") == expect_kind

    passed = result_ok and top_ok and kind_ok

    return {
        "id": case.get("id", "unknown"),
        "priority": case.get("priority", "P1"),
        "prompt": prompt,
        "confidence_only": confidence_only,
        "expect_result": expect_result,
        "expected_top_any": expected_top,
        "expected_kind": expect_kind,
        "top": top,
        "passed": passed,
        "checks": {
            "result_ok": result_ok,
            "top_ok": top_ok,
            "kind_ok": kind_ok,
        },
        "allow_command_bridge": bool(case.get("allow_command_bridge", False)),
        "non_slash": bool(case.get("non_slash", "/" not in prompt)),
    }


def compute_metrics(results: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Aggregate pass rates and command-bridge error metrics."""
    total = len(results)
    passed = sum(1 for item in results if item["passed"])

    p0_results = [item for item in results if item.get("priority") == "P0"]
    p0_passed = sum(1 for item in p0_results if item["passed"])

    top1_cases = [
        item
        for item in results
        if item["expect_result"]
        and item["expected_top_any"]
    ]
    top1_correct = sum(1 for item in top1_cases if item["checks"]["top_ok"]) if top1_cases else 0

    command_bridge_eval = [
        item
        for item in results
        if item["non_slash"]
        and item["top"] is not None
    ]
    command_bridge_fp = sum(
        1
        for item in command_bridge_eval
        if item["top"].get("kind") == "command" and not item["allow_command_bridge"]
    )

    return {
        "total_cases": total,
        "passed_cases": passed,
        "failed_cases": total - passed,
        "pass_rate": round((passed / total) if total else 0.0, 4),
        "p0_total": len(p0_results),
        "p0_passed": p0_passed,
        "p0_pass_rate": round((p0_passed / len(p0_results)) if p0_results else 0.0, 4),
        "top1_cases": len(top1_cases),
        "top1_accuracy": round((top1_correct / len(top1_cases)) if top1_cases else 0.0, 4),
        "command_bridge_eval_cases": len(command_bridge_eval),
        "command_bridge_fp": command_bridge_fp,
        "command_bridge_fp_rate": round(
            (command_bridge_fp / len(command_bridge_eval)) if command_bridge_eval else 0.0,
            4,
        ),
    }


# ───────────────────────────────────────────────────────────────
# 5. OUTPUT HELPERS
# ───────────────────────────────────────────────────────────────

def ensure_parent_dir(path: str) -> None:
    """Create the destination parent directory when an output path is nested."""
    parent = os.path.dirname(path)
    if parent:
        os.makedirs(parent, exist_ok=True)


# ───────────────────────────────────────────────────────────────
# 6. CLI ENTRY POINT
# ───────────────────────────────────────────────────────────────

def main() -> int:
    """Execute the regression suite and emit a JSON report."""
    parser = argparse.ArgumentParser(description="Run skill advisor regression suite.")
    parser.add_argument("--dataset", required=True, help="Path to JSONL regression dataset.")
    parser.add_argument("--out", default="", help="Optional path to write JSON report.")
    parser.add_argument("--threshold", type=float, default=0.8, help="Confidence threshold for evaluations.")
    parser.add_argument("--uncertainty", type=float, default=0.35, help="Uncertainty threshold for dual-threshold evaluations.")
    parser.add_argument("--min-top1-accuracy", type=float, default=0.92, help="Minimum acceptable top-1 accuracy.")
    parser.add_argument("--max-command-bridge-fp-rate", type=float, default=0.05, help="Maximum command bridge FP rate on non-slash prompts.")
    parser.add_argument("--min-p0-pass-rate", type=float, default=1.0, help="Minimum P0 pass rate.")
    parser.add_argument("--mode", choices=["both", "default", "confidence-only"], default="both", help="Which dataset cases to execute by mode.")
    args = parser.parse_args()

    advisor = load_advisor_module()
    dataset = load_jsonl(args.dataset)

    filtered_dataset: List[Dict[str, Any]] = []
    for case in dataset:
        confidence_only = bool(case.get("confidence_only", False))
        if args.mode == "default" and confidence_only:
            continue
        if args.mode == "confidence-only" and not confidence_only:
            continue
        filtered_dataset.append(case)

    results = [
        evaluate_case(
            advisor=advisor,
            case=case,
            threshold=args.threshold,
            uncertainty=args.uncertainty,
        )
        for case in filtered_dataset
    ]

    metrics = compute_metrics(results)
    gates = {
        "top1_accuracy": metrics["top1_accuracy"] >= args.min_top1_accuracy,
        "command_bridge_fp_rate": metrics["command_bridge_fp_rate"] <= args.max_command_bridge_fp_rate,
        "p0_pass_rate": metrics["p0_pass_rate"] >= args.min_p0_pass_rate,
        "all_cases_passed": metrics["failed_cases"] == 0,
    }
    overall_pass = all(gates.values())

    report = {
        "dataset": args.dataset,
        "mode": args.mode,
        "thresholds": {
            "confidence": args.threshold,
            "uncertainty": args.uncertainty,
            "min_top1_accuracy": args.min_top1_accuracy,
            "max_command_bridge_fp_rate": args.max_command_bridge_fp_rate,
            "min_p0_pass_rate": args.min_p0_pass_rate,
        },
        "metrics": metrics,
        "gates": gates,
        "overall_pass": overall_pass,
        "failures": [item for item in results if not item["passed"]],
    }

    if args.out:
        ensure_parent_dir(args.out)
        with open(args.out, "w", encoding="utf-8") as handle:
            json.dump(report, handle, indent=2)

    print(json.dumps(report, indent=2))
    return 0 if overall_pass else 1


if __name__ == "__main__":
    sys.exit(main())
