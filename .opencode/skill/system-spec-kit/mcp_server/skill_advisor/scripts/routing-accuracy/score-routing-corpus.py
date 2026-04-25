#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: ROUTING ACCURACY CORPUS SCORER
# ───────────────────────────────────────────────────────────────

"""Score Gate 3 and skill-advisor routing against the labeled 200-prompt corpus."""

from __future__ import annotations

import argparse
import importlib.util
import json
import os
import re
import subprocess
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

SCRIPT_DIR = Path(__file__).resolve().parent
# Path layout: .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/routing-accuracy/<script>
# parents[0]=scripts, [1]=skill-advisor, [2]=mcp_server, [3]=system-spec-kit, [4]=skill, [5]=.opencode, [6]=repo root
REPO_ROOT = SCRIPT_DIR.parents[6]
DEFAULT_DATASET = SCRIPT_DIR / "labeled-prompts.jsonl"
ADVISOR_PATH = (
    REPO_ROOT
    / ".opencode"
    / "skill"
    / "system-spec-kit"
    / "mcp_server"
    / "skill_advisor"
    / "scripts"
    / "skill_advisor.py"
)
GATE3_RUNNER = SCRIPT_DIR / "gate3-corpus-runner.mjs"

HISTORICAL_FALSE_POSITIVE_TOKENS = ("analyze", "decompose", "phase")


def load_jsonl(path: Path) -> List[Dict[str, Any]]:
    """Load corpus rows with line-numbered validation."""
    rows: List[Dict[str, Any]] = []
    with path.open("r", encoding="utf-8") as handle:
        for line_number, raw_line in enumerate(handle, start=1):
            stripped = raw_line.strip()
            if not stripped:
                continue
            row = json.loads(stripped)
            if not isinstance(row, dict):
                raise ValueError(f"Line {line_number}: expected object")
            if not isinstance(row.get("prompt"), str) or not row["prompt"].strip():
                raise ValueError(f"Line {line_number}: missing prompt")
            rows.append(row)
    return rows


def load_advisor_module() -> Any:
    """Load skill_advisor.py without requiring package installation."""
    spec = importlib.util.spec_from_file_location("skill_advisor", ADVISOR_PATH)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"Cannot load advisor module at {ADVISOR_PATH}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def run_gate3_predictions(dataset: Path) -> Dict[str, Dict[str, Any]]:
    """Run the compiled Gate 3 classifier over the corpus in one Node process."""
    env = os.environ.copy()
    env.setdefault("TMPDIR", "/tmp")

    completed = subprocess.run(
        ["node", str(GATE3_RUNNER), str(dataset)],
        cwd=REPO_ROOT,
        env=env,
        capture_output=True,
        text=True,
        check=False,
    )
    if completed.returncode != 0:
        raise RuntimeError(
            "Gate 3 runner failed: "
            f"exit={completed.returncode} stderr={completed.stderr.strip()}"
        )

    predictions = json.loads(completed.stdout)
    return {str(item["id"]): item for item in predictions}


def safe_divide(numerator: int, denominator: int) -> float:
    """Return 0.0 for empty denominators."""
    return numerator / denominator if denominator else 0.0


def score_gate3(rows: List[Dict[str, Any]], predictions: Dict[str, Dict[str, Any]]) -> Dict[str, Any]:
    """Score Gate 3 precision, recall, F1, and historical FP regressions."""
    tp = fp = fn = tn = 0
    false_positive_regressions: List[Dict[str, str]] = []

    for index, row in enumerate(rows, start=1):
        row_id = str(row.get("id") or f"line-{index}")
        predicted = bool(predictions[row_id]["triggersGate3"])
        expected = str(row.get("gate3_triggers", "")).lower() == "yes"

        if expected and predicted:
            tp += 1
        elif not expected and predicted:
            fp += 1
        elif expected and not predicted:
            fn += 1
        else:
            tn += 1

        prompt_lower = str(row["prompt"]).lower()
        has_historical_token = any(
            re.search(rf"\b{re.escape(token)}\b", prompt_lower)
            for token in HISTORICAL_FALSE_POSITIVE_TOKENS
        )
        if has_historical_token and not expected and predicted:
            false_positive_regressions.append({
                "id": row_id,
                "prompt": row["prompt"],
                "reason": str(predictions[row_id].get("reason", "")),
            })

    precision = safe_divide(tp, tp + fp)
    recall = safe_divide(tp, tp + fn)
    f1 = safe_divide(2 * tp, (2 * tp) + fp + fn)

    return {
        "tp": tp,
        "fp": fp,
        "fn": fn,
        "tn": tn,
        "precision": round(precision, 4),
        "recall": round(recall, 4),
        "f1": round(f1, 4),
        "historical_false_positive_regressions": false_positive_regressions,
    }


def score_advisor(rows: List[Dict[str, Any]], advisor: Any) -> Tuple[Dict[str, Any], Dict[str, str]]:
    """Score advisor exact-match top-1 accuracy."""
    correct = 0
    missed_skill_fires = 0
    wrong_skill_fires = 0
    false_none_fires = 0
    predictions: Dict[str, str] = {}

    for index, row in enumerate(rows, start=1):
        row_id = str(row.get("id") or f"line-{index}")
        gold = str(row.get("skill_top_1") or "none")
        recommendations = advisor.analyze_prompt(
            prompt=row["prompt"],
            confidence_threshold=0.8,
            uncertainty_threshold=0.35,
            confidence_only=False,
            show_rejections=False,
        )
        predicted = str(recommendations[0]["skill"]) if recommendations else "none"
        predictions[row_id] = predicted

        if predicted == gold:
            correct += 1
        elif gold != "none" and predicted == "none":
            missed_skill_fires += 1
        elif gold != "none":
            wrong_skill_fires += 1
        else:
            false_none_fires += 1

    total = len(rows)
    return (
        {
            "total": total,
            "correct": correct,
            "accuracy": round(safe_divide(correct, total), 4),
            "missed_skill_fires": missed_skill_fires,
            "wrong_skill_fires": wrong_skill_fires,
            "false_fires_on_none": false_none_fires,
        },
        predictions,
    )


def score_joint(
    rows: List[Dict[str, Any]],
    gate3_predictions: Dict[str, Dict[str, Any]],
    advisor_predictions: Dict[str, str],
) -> Dict[str, int]:
    """Compute joint correctness matrix for Gate 3 and advisor."""
    matrix = {"TT": 0, "TF": 0, "FT": 0, "FF": 0}

    for index, row in enumerate(rows, start=1):
        row_id = str(row.get("id") or f"line-{index}")
        gate3_expected = str(row.get("gate3_triggers", "")).lower() == "yes"
        gate3_correct = bool(gate3_predictions[row_id]["triggersGate3"]) == gate3_expected
        advisor_correct = advisor_predictions[row_id] == str(row.get("skill_top_1") or "none")

        if gate3_correct and advisor_correct:
            matrix["TT"] += 1
        elif gate3_correct and not advisor_correct:
            matrix["TF"] += 1
        elif not gate3_correct and advisor_correct:
            matrix["FT"] += 1
        else:
            matrix["FF"] += 1

    return matrix


def threshold_failures(report: Dict[str, Any], args: argparse.Namespace) -> List[str]:
    """Return threshold names that failed."""
    failures: List[str] = []
    if args.min_advisor_accuracy is not None and report["advisor"]["accuracy"] < args.min_advisor_accuracy:
        failures.append("advisor_accuracy")
    if args.min_gate3_f1 is not None and report["gate3"]["f1"] < args.min_gate3_f1:
        failures.append("gate3_f1")
    if args.min_joint_tt is not None and report["joint"]["TT"] < args.min_joint_tt:
        failures.append("joint_TT")
    if args.max_joint_ft is not None and report["joint"]["FT"] > args.max_joint_ft:
        failures.append("joint_FT")
    if args.max_joint_ff is not None and report["joint"]["FF"] > args.max_joint_ff:
        failures.append("joint_FF")
    if args.require_historical_clean and report["gate3"]["historical_false_positive_regressions"]:
        failures.append("historical_false_positive_regressions")
    return failures


def main() -> int:
    """CLI entry point."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dataset", type=Path, default=DEFAULT_DATASET)
    parser.add_argument("--out", type=Path, default=None)
    parser.add_argument("--enable-semantic", action="store_true")
    parser.add_argument("--min-advisor-accuracy", type=float, default=None)
    parser.add_argument("--min-gate3-f1", type=float, default=None)
    parser.add_argument("--min-joint-tt", type=int, default=None)
    parser.add_argument("--max-joint-ft", type=int, default=None)
    parser.add_argument("--max-joint-ff", type=int, default=None)
    parser.add_argument("--require-historical-clean", action="store_true")
    args = parser.parse_args()

    if not args.enable_semantic:
        os.environ[advisor_env_name()] = "true"

    rows = load_jsonl(args.dataset)
    advisor = load_advisor_module()
    gate3_predictions = run_gate3_predictions(args.dataset)
    advisor_metrics, advisor_predictions = score_advisor(rows, advisor)

    report = {
        "dataset": str(args.dataset),
        "rows": len(rows),
        "advisor": advisor_metrics,
        "gate3": score_gate3(rows, gate3_predictions),
        "joint": score_joint(rows, gate3_predictions, advisor_predictions),
        "semantic_enabled": bool(args.enable_semantic),
    }
    failures = threshold_failures(report, args)
    report["threshold_failures"] = failures
    report["overall_pass"] = not failures

    if args.out is not None:
        args.out.parent.mkdir(parents=True, exist_ok=True)
        args.out.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")

    print(json.dumps(report, indent=2))
    return 0 if not failures else 1


def advisor_env_name() -> str:
    """Keep the semantic-disable env var in one place."""
    return "SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC"


if __name__ == "__main__":
    sys.exit(main())
