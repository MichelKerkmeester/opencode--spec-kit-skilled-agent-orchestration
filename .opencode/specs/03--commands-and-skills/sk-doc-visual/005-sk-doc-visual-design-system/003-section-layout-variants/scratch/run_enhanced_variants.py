#!/usr/bin/env python3
"""
Enhanced Section Variant Generator
===================================
Runs the TIDD-EC enhanced prompts through Gemini CLI to generate
layout variants for all 8 documentation sections.

Usage:
    python3 run_enhanced_variants.py                    # Run all sections
    python3 run_enhanced_variants.py --section hero     # Run one section
    python3 run_enhanced_variants.py --dry-run          # Show commands without executing
    python3 run_enhanced_variants.py --test             # Test with one variant only

Output:
    scratch/outputs-v2/{section}/{section}-enhanced-v{N}.html
"""

import subprocess
import sys
import os
import re
import time
import json
import argparse
from pathlib import Path
from dataclasses import dataclass
from typing import Optional, List, Dict, Tuple
from concurrent.futures import ThreadPoolExecutor, as_completed

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

SCRIPT_DIR = Path(__file__).resolve().parent
SPEC_DIR = SCRIPT_DIR.parent
PROJECT_ROOT = SPEC_DIR.parents[3]  # .opencode/specs/002.../049.../003.../scratch -> project root

MODEL = "gemini-3.1-pro-preview"
OUTPUT_FORMAT = "text"
TIMEOUT_SECONDS = 480  # 8 minutes per variant
WAVE_CONCURRENCY = 2   # max concurrent Gemini calls
INTER_CALL_DELAY = 3   # seconds between calls to respect rate limits

PROMPTS_DIR = SCRIPT_DIR / "enhanced-prompts"
OUTPUT_DIR = SCRIPT_DIR / "outputs-v2"
LOG_DIR = SCRIPT_DIR / "logs-v2"

# Section template files in the sk-doc-visual assets
SECTIONS_DIR = PROJECT_ROOT / ".opencode" / "skill" / "sk-doc-visual" / "assets" / "sections"
VARIABLES_DIR = PROJECT_ROOT / ".opencode" / "skill" / "sk-doc-visual" / "assets" / "variables"
REFERENCES_DIR = PROJECT_ROOT / ".opencode" / "skill" / "sk-doc-visual" / "references"

# File reference mapping: prompt file -> section template file
SECTION_MAP = {
    "01-hero": {
        "template": "hero-section.html",
        "slug": "hero",
        "style": "choose_one",
        "directions": 5,
    },
    "02-quick-start": {
        "template": "quick-start-section.html",
        "slug": "quick-start",
        "style": "choose_one",
        "directions": 5,
    },
    "03-feature-grid": {
        "template": "feature-grid-section.html",
        "slug": "feature-grid",
        "style": "choose_one",
        "directions": 5,
    },
    "04-operations-overview": {
        "template": "operations-overview-section.html",
        "slug": "operations-overview",
        "style": "choose_one",
        "directions": 5,
    },
    "05-setup-and-usage": {
        "template": "setup-and-usage-section.html",
        "slug": "setup-and-usage",
        "style": "all_five",
        "directions": 5,
    },
    "06-support": {
        "template": "support-section.html",
        "slug": "support",
        "style": "all_five",
        "directions": 5,
    },
    "07-extensibility": {
        "template": "extensibility-section.html",
        "slug": "extensibility",
        "style": "choose_one",
        "directions": 5,
    },
    "08-related-documents": {
        "template": "related-documents-section.html",
        "slug": "related-documents",
        "style": "choose_one",
        "directions": 5,
    },
}


# ---------------------------------------------------------------------------
# Prompt Extraction
# ---------------------------------------------------------------------------

def extract_prompt_content(prompt_path: Path) -> str:
    """Extract the actual prompt text from a .prompt.md file.

    The prompt content starts after the line '---' that follows '## Prompt'.
    """
    text = prompt_path.read_text(encoding="utf-8")

    # Find the marker: "## Prompt" followed by a line, then "---"
    marker = "## Prompt"
    idx = text.find(marker)
    if idx == -1:
        # Fallback: try to find the first "---" after the Usage section
        # Split on the first "---" that appears after line 15
        lines = text.split("\n")
        for i, line in enumerate(lines):
            if i > 10 and line.strip() == "---":
                return "\n".join(lines[i + 1:]).strip()
        # Last resort: return everything
        return text.strip()

    # Find the "---" separator after "## Prompt"
    rest = text[idx + len(marker):]
    sep_idx = rest.find("---")
    if sep_idx == -1:
        return rest.strip()

    return rest[sep_idx + 3:].strip()


def make_direction_override(direction_num: int) -> str:
    """Create an instruction that overrides 'Choose ONE' to specify a direction."""
    return (
        f"CRITICAL INSTRUCTION: You MUST implement direction number {direction_num} "
        f"from the EXAMPLES section below. Do NOT choose a different direction. "
        f"Implement ONLY direction {direction_num}.\n\n"
    )


def strip_html_fences(text: str) -> str:
    """Remove markdown code fences from Gemini output."""
    text = text.strip()
    # Remove ```html ... ``` wrapping
    if text.startswith("```"):
        first_newline = text.find("\n")
        if first_newline != -1:
            text = text[first_newline + 1:]
    if text.endswith("```"):
        text = text[:-3].rstrip()
    return text.strip()


def sanitize_output(html: str) -> str:
    """Fix known Gemini output artifacts.

    Gemini CLI sometimes replaces @media with @filepath references
    from the project context. This detects and corrects those.
    """
    # Fix corrupted @media rules where @media was replaced with a file path
    # Pattern: @<some/file/path> (prefers-reduced-motion...) -> @media (prefers-reduced-motion...)
    html = re.sub(
        r'@[^\s(]+\.(md|css|html|js|ts|json)\s+\(prefers-reduced-motion',
        '@media (prefers-reduced-motion',
        html
    )
    # Also catch @<path> (max-width...) etc.
    html = re.sub(
        r'@[^\s(]+\.(md|css|html|js|ts|json)\s+\((?:min|max)-width',
        lambda m: '@media (' + m.group(0).split('(', 1)[1],
        html
    )
    return html


# ---------------------------------------------------------------------------
# File Context Loading
# ---------------------------------------------------------------------------

def load_file_context(section_key: str) -> str:
    """Load the CSS variables and section template as inline context.

    Since @ file references may not work reliably in non-interactive mode,
    we embed the file contents directly in the prompt.
    """
    config = SECTION_MAP[section_key]
    template_path = SECTIONS_DIR / config["template"]

    context_parts = []

    # Load CSS variable files
    for css_file in ["colors.css", "typography.css", "layout.css"]:
        css_path = VARIABLES_DIR / css_file
        if css_path.exists():
            content = css_path.read_text(encoding="utf-8")
            context_parts.append(f"--- FILE: {css_file} ---\n{content}\n--- END FILE ---")

    # Load section template
    if template_path.exists():
        content = template_path.read_text(encoding="utf-8")
        context_parts.append(f"--- FILE: {config['template']} (baseline) ---\n{content}\n--- END FILE ---")

    # Load quick reference
    qr_path = REFERENCES_DIR / "quick_reference.md"
    if qr_path.exists():
        content = qr_path.read_text(encoding="utf-8")
        context_parts.append(f"--- FILE: quick_reference.md ---\n{content}\n--- END FILE ---")

    return "\n\n".join(context_parts)


# ---------------------------------------------------------------------------
# Gemini CLI Execution
# ---------------------------------------------------------------------------

def run_gemini(prompt: str, label: str, log_path: Path) -> Tuple[bool, str]:
    """Execute a prompt via Gemini CLI and return (success, output)."""
    cmd = [
        "gemini",
        "-p", prompt,
        "-m", MODEL,
        "-o", OUTPUT_FORMAT,
    ]

    log_path.parent.mkdir(parents=True, exist_ok=True)

    print(f"  [{label}] Starting generation...")
    start = time.time()

    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=TIMEOUT_SECONDS,
            cwd=str(PROJECT_ROOT),
        )
        elapsed = time.time() - start

        # Log everything
        with open(log_path, "w", encoding="utf-8") as f:
            f.write(f"Label: {label}\n")
            f.write(f"Model: {MODEL}\n")
            f.write(f"Elapsed: {elapsed:.1f}s\n")
            f.write(f"Return code: {result.returncode}\n")
            f.write(f"Stdout length: {len(result.stdout)}\n")
            f.write(f"Stderr length: {len(result.stderr)}\n")
            f.write(f"\n--- STDERR ---\n{result.stderr}\n")
            f.write(f"\n--- STDOUT ---\n{result.stdout}\n")

        if result.returncode != 0:
            print(f"  [{label}] FAILED (exit {result.returncode}, {elapsed:.1f}s)")
            print(f"    stderr: {result.stderr[:200]}")
            return False, result.stderr

        output = strip_html_fences(result.stdout)
        output = sanitize_output(output)

        if not output or len(output) < 100:
            print(f"  [{label}] FAILED (empty/short output, {elapsed:.1f}s)")
            return False, output

        print(f"  [{label}] OK ({len(output)} chars, {elapsed:.1f}s)")
        return True, output

    except subprocess.TimeoutExpired:
        elapsed = time.time() - start
        print(f"  [{label}] TIMEOUT ({elapsed:.1f}s)")
        with open(log_path, "w", encoding="utf-8") as f:
            f.write(f"Label: {label}\nTIMEOUT after {elapsed:.1f}s\n")
        return False, "TIMEOUT"


# ---------------------------------------------------------------------------
# Validation
# ---------------------------------------------------------------------------

REQUIRED_TOKENS = [
    "var(--bg)", "var(--surface)", "var(--text)", "var(--accent)", "var(--border)"
]

FORBIDDEN_PATTERNS = [
    "neon", "particle", "parallax", "3d transform", "setInterval"
]

def validate_html(html: str, label: str) -> List[str]:
    """Validate an HTML output against theme and quality rules.
    Returns a list of issues (empty = passed).
    """
    issues = []
    html_lower = html.lower()

    # Check required tokens
    for token in REQUIRED_TOKENS:
        if token not in html:
            issues.append(f"Missing required token: {token}")

    # Check forbidden patterns
    for pattern in FORBIDDEN_PATTERNS:
        if pattern in html_lower:
            issues.append(f"Forbidden pattern found: {pattern}")

    # Check meta tags
    if 'color-scheme' not in html_lower:
        issues.append("Missing <meta name='color-scheme'>")

    if 'prefers-reduced-motion' not in html_lower:
        issues.append("Missing @media (prefers-reduced-motion)")

    # Check basic HTML structure
    if '<!doctype html>' not in html_lower and '<!DOCTYPE html>' not in html:
        issues.append("Missing <!DOCTYPE html>")

    if '<section' not in html_lower:
        issues.append("Missing <section> element")

    return issues


# ---------------------------------------------------------------------------
# Generation Pipeline
# ---------------------------------------------------------------------------

@dataclass
class Job:
    section_key: str
    direction: int  # 1-5
    label: str
    prompt: str
    output_path: Path
    log_path: Path


def build_jobs(section_filter: Optional[str] = None, test_mode: bool = False) -> List[Job]:
    """Build the list of generation jobs."""
    jobs = []

    for section_key, config in SECTION_MAP.items():
        slug = config["slug"]

        # Apply section filter
        if section_filter and slug != section_filter and section_key != section_filter:
            continue

        prompt_path = PROMPTS_DIR / f"{section_key}.prompt.md"
        if not prompt_path.exists():
            print(f"WARNING: Prompt file not found: {prompt_path}")
            continue

        base_prompt = extract_prompt_content(prompt_path)
        file_context = load_file_context(section_key)

        output_section_dir = OUTPUT_DIR / slug
        log_section_dir = LOG_DIR / slug

        if config["style"] == "all_five":
            # Single job that produces all 5 variants
            full_prompt = (
                f"ATTACHED REFERENCE FILES:\n\n{file_context}\n\n"
                f"--- PROMPT ---\n\n{base_prompt}"
            )

            label = f"{slug}/all-5"
            jobs.append(Job(
                section_key=section_key,
                direction=0,  # 0 = all five
                label=label,
                prompt=full_prompt,
                output_path=output_section_dir,  # directory; will split
                log_path=log_section_dir / f"{slug}-all.log",
            ))

            if test_mode:
                break
        else:
            # One job per direction
            for d in range(1, config["directions"] + 1):
                direction_override = make_direction_override(d)
                full_prompt = (
                    f"ATTACHED REFERENCE FILES:\n\n{file_context}\n\n"
                    f"--- PROMPT ---\n\n{direction_override}{base_prompt}"
                )

                label = f"{slug}/v{d}"
                jobs.append(Job(
                    section_key=section_key,
                    direction=d,
                    label=label,
                    prompt=full_prompt,
                    output_path=output_section_dir / f"{slug}-enhanced-v{d}.html",
                    log_path=log_section_dir / f"{slug}-v{d}.log",
                ))

                if test_mode:
                    break

        if test_mode:
            break

    return jobs


def run_job(job: Job) -> dict:
    """Execute a single generation job."""
    success, output = run_gemini(job.prompt, job.label, job.log_path)

    result = {
        "label": job.label,
        "section_key": job.section_key,
        "direction": job.direction,
        "success": success,
        "output_length": len(output),
        "validation_issues": [],
        "output_path": str(job.output_path),
    }

    if not success:
        result["error"] = output[:500]
        return result

    if job.direction == 0:
        # All-five style: split on separator and save individually
        config = SECTION_MAP[job.section_key]
        slug = config["slug"]
        variants = output.split("---VARIANT-SEPARATOR---")

        # Clean and save each variant
        saved = 0
        for i, variant_html in enumerate(variants, 1):
            variant_html = strip_html_fences(variant_html.strip())
            variant_html = sanitize_output(variant_html)
            if not variant_html or len(variant_html) < 100:
                print(f"  [{job.label}] Variant {i} too short ({len(variant_html)} chars), skipping")
                continue

            issues = validate_html(variant_html, f"{slug}/v{i}")
            if issues:
                result["validation_issues"].extend([f"v{i}: {iss}" for iss in issues])

            out_path = job.output_path / f"{slug}-enhanced-v{i}.html"
            out_path.parent.mkdir(parents=True, exist_ok=True)
            out_path.write_text(variant_html, encoding="utf-8")
            saved += 1

        result["variants_saved"] = saved
        result["success"] = saved > 0
    else:
        # Single variant: validate and save
        issues = validate_html(output, job.label)
        result["validation_issues"] = issues

        job.output_path.parent.mkdir(parents=True, exist_ok=True)
        job.output_path.write_text(output, encoding="utf-8")

    return result


def run_pipeline(jobs: List[Job], concurrency: int = WAVE_CONCURRENCY) -> List[Dict]:
    """Run all jobs with controlled concurrency."""
    results = []
    total = len(jobs)

    print(f"\n{'='*60}")
    print(f"Running {total} generation job(s) with concurrency={concurrency}")
    print(f"Model: {MODEL}")
    print(f"Output: {OUTPUT_DIR}")
    print(f"{'='*60}\n")

    # Process in waves
    wave_size = concurrency
    for wave_start in range(0, total, wave_size):
        wave_jobs = jobs[wave_start:wave_start + wave_size]
        wave_num = (wave_start // wave_size) + 1
        total_waves = (total + wave_size - 1) // wave_size

        print(f"--- Wave {wave_num}/{total_waves} ({len(wave_jobs)} jobs) ---")

        with ThreadPoolExecutor(max_workers=concurrency) as executor:
            futures = {executor.submit(run_job, job): job for job in wave_jobs}
            for future in as_completed(futures):
                try:
                    result = future.result()
                    results.append(result)
                except Exception as e:
                    job = futures[future]
                    print(f"  [{job.label}] EXCEPTION: {e}")
                    results.append({
                        "label": job.label,
                        "success": False,
                        "error": str(e),
                    })

        # Delay between waves to respect rate limits
        if wave_start + wave_size < total:
            print(f"  (waiting {INTER_CALL_DELAY}s between waves...)")
            time.sleep(INTER_CALL_DELAY)

    return results


# ---------------------------------------------------------------------------
# Reporting
# ---------------------------------------------------------------------------

def print_report(results: List[Dict]):
    """Print a summary report of all generation results."""
    print(f"\n{'='*60}")
    print("GENERATION REPORT")
    print(f"{'='*60}")

    succeeded = [r for r in results if r.get("success")]
    failed = [r for r in results if not r.get("success")]

    print(f"\nTotal jobs: {len(results)}")
    print(f"Succeeded:  {len(succeeded)}")
    print(f"Failed:     {len(failed)}")

    if failed:
        print(f"\n--- FAILURES ---")
        for r in failed:
            error = r.get("error", "unknown")[:200]
            print(f"  {r['label']}: {error}")

    # Validation warnings
    warnings = [r for r in results if r.get("validation_issues")]
    if warnings:
        print(f"\n--- VALIDATION WARNINGS ---")
        for r in warnings:
            for issue in r["validation_issues"]:
                print(f"  {r['label']}: {issue}")

    print(f"\n{'='*60}")

    # Save manifest
    manifest_path = OUTPUT_DIR / "manifest.json"
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump({
            "model": MODEL,
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S"),
            "total_jobs": len(results),
            "succeeded": len(succeeded),
            "failed": len(failed),
            "results": results,
        }, f, indent=2)
    print(f"Manifest saved: {manifest_path}")


# ---------------------------------------------------------------------------
# Entry Point
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="Enhanced Section Variant Generator")
    parser.add_argument("--section", help="Generate for a specific section only (e.g., 'hero')")
    parser.add_argument("--dry-run", action="store_true", help="Show jobs without executing")
    parser.add_argument("--test", action="store_true", help="Test mode: run only the first job")
    parser.add_argument("--concurrency", type=int, default=WAVE_CONCURRENCY, help="Max concurrent Gemini calls")
    parser.add_argument("--model", default=MODEL, help=f"Gemini model (default: {MODEL})")
    args = parser.parse_args()

    # Update module-level MODEL if overridden
    if args.model != MODEL:
        globals()["MODEL"] = args.model

    # Build jobs
    jobs = build_jobs(section_filter=args.section, test_mode=args.test)

    if not jobs:
        print("No jobs to run. Check --section filter.")
        sys.exit(1)

    print(f"Built {len(jobs)} generation job(s):")
    for job in jobs:
        style = "all-5" if job.direction == 0 else f"direction-{job.direction}"
        print(f"  {job.label} ({style}, prompt: {len(job.prompt)} chars)")

    if args.dry_run:
        print("\n[DRY RUN] No Gemini calls made.")
        sys.exit(0)

    # Ensure output dirs exist
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    LOG_DIR.mkdir(parents=True, exist_ok=True)

    # Run pipeline
    results = run_pipeline(jobs, concurrency=args.concurrency)

    # Report
    print_report(results)


if __name__ == "__main__":
    main()
