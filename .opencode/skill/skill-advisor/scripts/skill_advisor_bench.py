#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: SKILL ADVISOR BENCHMARK HARNESS
# ───────────────────────────────────────────────────────────────

"""Benchmark harness for skill_advisor latency and throughput.

Usage: python3 skill_advisor_bench.py --dataset <jsonl-path> [--runs N] [--out report.json]
Output: JSON report with subprocess, in-process, and batch latency/throughput metrics.
"""

from __future__ import annotations

# ───────────────────────────────────────────────────────────────
# 1. IMPORTS
# ───────────────────────────────────────────────────────────────

import argparse
import importlib.util
import json
import os
import statistics
import subprocess
import sys
import tempfile
import time
from typing import Any, Dict, List


# ───────────────────────────────────────────────────────────────
# 2. CONFIGURATION
# ───────────────────────────────────────────────────────────────

SCRIPT_DIR = os.path.dirname(os.path.realpath(__file__))
ADVISOR_PATH = os.path.join(SCRIPT_DIR, "skill_advisor.py")
BENCH_ENV_FLAG = "SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC"


# ───────────────────────────────────────────────────────────────
# 3. DATA LOADING
# ───────────────────────────────────────────────────────────────

def load_advisor_module() -> Any:
    """Load the advisor module from disk for in-process benchmarks."""
    spec = importlib.util.spec_from_file_location("skill_advisor", ADVISOR_PATH)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"Failed to load advisor module from {ADVISOR_PATH}")

    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def load_prompts_from_dataset(path: str) -> List[str]:
    """Read prompt strings from a JSONL benchmark dataset."""
    prompts: List[str] = []
    with open(path, "r", encoding="utf-8") as handle:
        for line_number, raw in enumerate(handle, start=1):
            stripped = raw.strip()
            if not stripped:
                continue
            try:
                row = json.loads(stripped)
            except json.JSONDecodeError as exc:
                raise ValueError(f"Invalid JSONL at line {line_number}: {exc}") from exc
            prompt = row.get("prompt", "").strip()
            if prompt:
                prompts.append(prompt)
    return prompts


# ───────────────────────────────────────────────────────────────
# 4. METRICS
# ───────────────────────────────────────────────────────────────

def summarize(samples_ms: List[float]) -> Dict[str, float]:
    """Summarize latency samples using median, p95, and mean statistics."""
    if not samples_ms:
        return {"count": 0, "p50_ms": 0.0, "p95_ms": 0.0, "min_ms": 0.0, "max_ms": 0.0, "mean_ms": 0.0}

    p95 = statistics.quantiles(samples_ms, n=20)[18] if len(samples_ms) >= 20 else max(samples_ms)
    return {
        "count": len(samples_ms),
        "p50_ms": round(statistics.median(samples_ms), 4),
        "p95_ms": round(p95, 4),
        "min_ms": round(min(samples_ms), 4),
        "max_ms": round(max(samples_ms), 4),
        "mean_ms": round(statistics.mean(samples_ms), 4),
    }


# ───────────────────────────────────────────────────────────────
# 5. BENCHMARK RUNNERS
# ───────────────────────────────────────────────────────────────

def benchmark_subprocess(prompts: List[str], runs: int, threshold: float, uncertainty: float) -> Dict[str, Any]:
    """Benchmark one-shot subprocess execution for advisor prompts."""
    latencies: List[float] = []
    total_prompts = 0
    run_env = os.environ.copy()
    run_env[BENCH_ENV_FLAG] = "1"
    t0 = time.perf_counter()
    for _ in range(runs):
        for prompt in prompts:
            start = time.perf_counter()
            subprocess.run(
                [
                    "python3",
                    ADVISOR_PATH,
                    prompt,
                    "--threshold",
                    str(threshold),
                    "--uncertainty",
                    str(uncertainty),
                ],
                check=True,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                env=run_env,
            )
            latencies.append((time.perf_counter() - start) * 1000)
            total_prompts += 1
    elapsed = time.perf_counter() - t0
    summary = summarize(latencies)
    summary["throughput_prompts_per_sec"] = round((total_prompts / elapsed) if elapsed else 0.0, 4)
    summary["total_prompts"] = total_prompts
    return summary


def benchmark_inprocess(prompts: List[str], runs: int, threshold: float, uncertainty: float) -> Dict[str, Any]:
    """Benchmark warm in-process advisor calls after module load."""
    advisor = load_advisor_module()
    latencies: List[float] = []
    total_prompts = 0
    t0 = time.perf_counter()
    for _ in range(runs):
        for prompt in prompts:
            start = time.perf_counter()
            advisor.analyze_prompt(
                prompt=prompt,
                confidence_threshold=threshold,
                uncertainty_threshold=uncertainty,
                confidence_only=False,
                show_rejections=False,
            )
            latencies.append((time.perf_counter() - start) * 1000)
            total_prompts += 1
    elapsed = time.perf_counter() - t0
    summary = summarize(latencies)
    summary["throughput_prompts_per_sec"] = round((total_prompts / elapsed) if elapsed else 0.0, 4)
    summary["total_prompts"] = total_prompts
    return summary


def benchmark_batch_mode(prompts: List[str], runs: int, threshold: float, uncertainty: float) -> Dict[str, Any]:
    """Benchmark batch-file execution to measure amortized throughput."""
    batch_latencies: List[float] = []
    total_prompts = 0
    run_env = os.environ.copy()
    run_env[BENCH_ENV_FLAG] = "1"
    with tempfile.NamedTemporaryFile("w", encoding="utf-8", delete=False) as handle:
        for prompt in prompts:
            handle.write(prompt)
            handle.write("\n")
        batch_path = handle.name

    try:
        t0 = time.perf_counter()
        for _ in range(runs):
            start = time.perf_counter()
            subprocess.run(
                [
                    "python3",
                    ADVISOR_PATH,
                    "--batch-file",
                    batch_path,
                    "--threshold",
                    str(threshold),
                    "--uncertainty",
                    str(uncertainty),
                ],
                check=True,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                env=run_env,
            )
            batch_latencies.append((time.perf_counter() - start) * 1000)
            total_prompts += len(prompts)
        elapsed = time.perf_counter() - t0
    finally:
        try:
            os.unlink(batch_path)
        except OSError:
            pass

    summary = summarize(batch_latencies)
    summary["throughput_prompts_per_sec"] = round((total_prompts / elapsed) if elapsed else 0.0, 4)
    summary["total_prompts"] = total_prompts
    summary["batch_size"] = len(prompts)
    return summary


# ───────────────────────────────────────────────────────────────
# 6. OUTPUT HELPERS
# ───────────────────────────────────────────────────────────────

def ensure_parent_dir(path: str) -> None:
    """Create the destination parent directory when an output path is nested."""
    parent = os.path.dirname(path)
    if parent:
        os.makedirs(parent, exist_ok=True)


# ───────────────────────────────────────────────────────────────
# 7. CLI ENTRY POINT
# ───────────────────────────────────────────────────────────────

def main() -> int:
    """Run the benchmark suite and emit a JSON report."""
    parser = argparse.ArgumentParser(description="Benchmark skill advisor latency and throughput.")
    parser.add_argument("--dataset", required=True, help="Path to JSONL dataset containing prompt fields.")
    parser.add_argument("--runs", type=int, default=7, help="Number of benchmark iterations.")
    parser.add_argument("--threshold", type=float, default=0.8, help="Confidence threshold for advisor runs.")
    parser.add_argument("--uncertainty", type=float, default=0.35, help="Uncertainty threshold for advisor runs.")
    parser.add_argument("--out", default="", help="Optional path to write JSON report.")
    parser.add_argument("--max-warm-p95-ms", type=float, default=20.0, help="Warm-mode p95 gate (in-process).")
    parser.add_argument("--max-cold-p95-ms", type=float, default=60.0, help="Cold-mode p95 gate (subprocess one-shot).")
    parser.add_argument("--min-throughput-multiplier", type=float, default=2.0, help="Minimum batch throughput multiplier over subprocess one-shot.")
    args = parser.parse_args()

    prompts = load_prompts_from_dataset(args.dataset)
    if not prompts:
        print(json.dumps({"error": "Dataset produced no prompts."}, indent=2))
        return 2

    subprocess_summary = benchmark_subprocess(prompts, args.runs, args.threshold, args.uncertainty)
    inprocess_summary = benchmark_inprocess(prompts, args.runs, args.threshold, args.uncertainty)
    batch_summary = benchmark_batch_mode(prompts, args.runs, args.threshold, args.uncertainty)

    throughput_multiplier = (
        batch_summary["throughput_prompts_per_sec"] / subprocess_summary["throughput_prompts_per_sec"]
        if subprocess_summary["throughput_prompts_per_sec"]
        else 0.0
    )

    gates = {
        "warm_p95": inprocess_summary["p95_ms"] <= args.max_warm_p95_ms,
        "cold_p95": subprocess_summary["p95_ms"] <= args.max_cold_p95_ms,
        "throughput_multiplier": throughput_multiplier >= args.min_throughput_multiplier,
    }
    overall_pass = all(gates.values())

    report = {
        "dataset": args.dataset,
        "runs": args.runs,
        "prompts": len(prompts),
        "threshold": args.threshold,
        "uncertainty": args.uncertainty,
        "subprocess_one_shot": subprocess_summary,
        "inprocess_warm": inprocess_summary,
        "batch_mode": batch_summary,
        "throughput_multiplier": round(throughput_multiplier, 4),
        "gates": gates,
        "overall_pass": overall_pass,
    }

    if args.out:
        ensure_parent_dir(args.out)
        with open(args.out, "w", encoding="utf-8") as handle:
            json.dump(report, handle, indent=2)

    print(json.dumps(report, indent=2))
    return 0 if overall_pass else 1


if __name__ == "__main__":
    sys.exit(main())
