#!/usr/bin/env python3
"""Run Phase 1 Untitled UI section prompts through Gemini CLI."""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import threading
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import Iterable


SCRIPT_PATH = Path(__file__).resolve()
SCRATCH_DIR = SCRIPT_PATH.parent
PHASE_DIR = SCRATCH_DIR / "phase-1—untitled-ui"
PROMPTS_DIR = PHASE_DIR / "prompts"
MASTER_PROMPT_PATH = PROMPTS_DIR / "00-master-template.prompt.md"
OUTPUT_DIR = PHASE_DIR / "output-from-gemini"
LOGS_DIR = PHASE_DIR / "logs"
PROJECT_ROOT = next((parent for parent in SCRIPT_PATH.parents if (parent / ".opencode").is_dir()), SCRATCH_DIR)

MODEL = "gemini-3.1-pro-preview"
OUTPUT_FORMAT = "text"
DEFAULT_CONCURRENCY = 2
TIMEOUT_SECONDS = 900
INTER_WAVE_DELAY_SECONDS = 5
RETRY_BACKOFF_SECONDS = 20
MAX_ATTEMPTS = 3
EXPECTED_VARIANTS = 5
VARIANT_SEPARATOR = "---VARIANT-SEPARATOR---"

FORBIDDEN_PATTERNS = [
    "neon",
    "particle",
    "parallax",
    "3d transform",
    "<script",
    "setinterval",
    "requestanimationframe",
    "addeventlistener",
    "classname=",
    "onclick=",
]

SHADCN_MARKERS = ["hsl(var(", "geist", "ring-1"]
SEED_COUNT = 5

SECTION_FILES = [
    ("hero", "01-hero.prompt.md"),
    ("quick-start", "02-quick-start.prompt.md"),
    ("feature-grid", "03-feature-grid.prompt.md"),
    ("operations-overview", "04-operations-overview.prompt.md"),
    ("setup-and-usage", "05-setup-and-usage.prompt.md"),
    ("support", "06-support.prompt.md"),
    ("extensibility", "07-extensibility.prompt.md"),
    ("related-documents", "08-related-documents.prompt.md"),
]

_PRINT_LOCK = threading.Lock()


@dataclass(frozen=True)
class SectionJob:
    slug: str
    prompt_path: Path


@dataclass
class AttemptRecord:
    attempt: int
    success: bool
    error: str = ""
    validation_issues: list[str] = field(default_factory=list)
    variants_saved: int = 0
    stdout_chars: int = 0
    stderr_chars: int = 0
    elapsed_seconds: float = 0.0
    output_files: list[str] = field(default_factory=list)


@dataclass
class SectionResult:
    slug: str
    success: bool
    attempts: list[AttemptRecord]


def log(message: str) -> None:
    with _PRINT_LOCK:
        print(message, flush=True)


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def extract_prompt_content(prompt_text: str) -> str:
    marker = "## Prompt"
    marker_index = prompt_text.find(marker)
    if marker_index == -1:
        return prompt_text.strip()

    remainder = prompt_text[marker_index + len(marker):]
    separator_index = remainder.find("---")
    if separator_index == -1:
        return remainder.strip()

    return remainder[separator_index + 3 :].strip()


def inject_master_template(section_prompt: str, master_template: str) -> str:
    placeholder_pattern = re.compile(
        r"\*\*\[The Master Template CSS vocabulary.*?\]\*\*",
        re.DOTALL,
    )
    injected_context = (
        "--- BEGIN INJECTED MASTER TEMPLATE CONTEXT ---\n\n"
        f"{master_template.strip()}\n\n"
        "--- END INJECTED MASTER TEMPLATE CONTEXT ---"
    )
    if placeholder_pattern.search(section_prompt):
        return placeholder_pattern.sub(injected_context, section_prompt, count=1)
    return f"{injected_context}\n\n{section_prompt.strip()}"


def build_retry_hint(previous_issues: Iterable[str]) -> str:
    issues = list(dict.fromkeys(issue.strip() for issue in previous_issues if issue.strip()))
    if not issues:
        return ""

    bullets = "\n".join(f"- {issue}" for issue in issues)
    return (
        "\n\n### RETRY CORRECTIONS\n"
        "You are regenerating because the previous attempt failed validation.\n"
        "Fix every issue below across all 5 variants before outputting:\n"
        f"{bullets}\n"
        "Return exactly 5 complete raw HTML documents separated only by the required separator line."
    )


def strip_fences(text: str) -> str:
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```[a-zA-Z0-9_-]*\n", "", cleaned)
        cleaned = re.sub(r"\n```$", "", cleaned)
    return cleaned.strip()


def sanitize_output(text: str) -> str:
    fixed = strip_fences(text)
    doctype_index = fixed.find("<!DOCTYPE html>")
    if doctype_index > 0:
        fixed = fixed[doctype_index:]
    fixed = re.sub(
        r"@[^\s(]+\.(md|css|html|js|ts|json)\s+\(prefers-reduced-motion",
        "@media (prefers-reduced-motion",
        fixed,
    )
    fixed = re.sub(
        r"@[^\s(]+\.(md|css|html|js|ts|json)\s+\((?:min|max)-width",
        lambda match: "@media (" + match.group(0).split("(", 1)[1],
        fixed,
    )
    return fixed.strip()


def split_variants(output: str) -> list[str]:
    raw_parts = re.split(rf"(?m)^\s*{re.escape(VARIANT_SEPARATOR)}\s*$", output)
    return [sanitize_output(part) for part in raw_parts if sanitize_output(part)]


def strip_root_blocks(text: str) -> str:
    return re.sub(r":root\s*\{[\s\S]*?\}", "", text, count=1)


def validate_variant(html: str) -> list[str]:
    issues: list[str] = []
    lowered = html.lower()
    line_count = len(html.splitlines())

    if "<!DOCTYPE html>" not in html and "<!doctype html>" not in lowered:
        issues.append("Missing <!DOCTYPE html> declaration")
    if '<meta name="viewport"' not in lowered:
        issues.append("Missing viewport meta tag")
    if '<meta name="color-scheme" content="light dark">' not in lowered:
        issues.append("Missing color-scheme meta tag for light dark")
    if "prefers-reduced-motion" not in lowered:
        issues.append("Missing prefers-reduced-motion media query")
    if "<section" not in lowered:
        issues.append("Missing semantic <section> element")
    if "fonts.googleapis.com" not in lowered or "inter" not in lowered or "roboto+mono" not in lowered:
        issues.append("Missing Google Fonts links for Inter and Roboto Mono")
    if "::before" not in html:
        issues.append("Missing skeumorphic ::before styling")
    if "var(--" not in html:
        issues.append("Missing CSS variable usage")
    if "--bg-primary" not in html or "--text-primary" not in html or "--border-primary" not in html:
        issues.append("Missing required Untitled UI token vocabulary")
    if "var(--shadow-" not in html:
        issues.append("Missing shadow token usage")
    if line_count < 600 or line_count > 900:
        issues.append(f"Line count out of range: {line_count} (expected 600-900)")

    for marker in FORBIDDEN_PATTERNS:
        if marker in lowered:
            issues.append(f"Forbidden pattern found: {marker}")
    for marker in SHADCN_MARKERS:
        if marker in lowered:
            issues.append(f"Shadcn marker found: {marker}")

    non_root = strip_root_blocks(html)
    if re.search(r"#[0-9a-fA-F]{3,8}\b", non_root):
        issues.append("Found raw hex color outside :root block")
    if re.search(r"rgba?\s*\(", non_root, re.IGNORECASE):
        issues.append("Found raw rgb/rgba color outside :root block")

    return issues


def save_attempt_files(section_dir: Path, attempt: int, prompt: str, stdout: str, stderr: str) -> None:
    prompt_path = section_dir / f"attempt-{attempt:02d}.prompt.txt"
    stdout_path = section_dir / f"attempt-{attempt:02d}.stdout.txt"
    stderr_path = section_dir / f"attempt-{attempt:02d}.stderr.txt"
    prompt_path.write_text(prompt, encoding="utf-8")
    stdout_path.write_text(stdout, encoding="utf-8")
    stderr_path.write_text(stderr, encoding="utf-8")


def run_gemini(prompt: str) -> subprocess.CompletedProcess[str]:
    command = ["gemini", "-p", prompt, "-m", MODEL, "-o", OUTPUT_FORMAT]
    return subprocess.run(
        command,
        capture_output=True,
        text=True,
        timeout=TIMEOUT_SECONDS,
        cwd=str(PROJECT_ROOT),
    )


def build_single_seed_prompt(base_prompt: str, seed_number: int, previous_issues: Iterable[str]) -> str:
    seed_override = (
        "CRITICAL OVERRIDE FOR THIS RETRY:\n"
        f"- Generate ONLY Seed {seed_number}.\n"
        "- Return exactly one complete standalone HTML document.\n"
        "- Do NOT output the variant separator.\n"
        "- Ignore all instructions that ask for 5 files in this retry; this retry is for one file only.\n"
        "- Target 650-850 lines for this single document.\n"
        "- Preserve Untitled UI light-theme token discipline.\n"
    )
    retry_hint = build_retry_hint(previous_issues)
    return f"{seed_override}\n\n{base_prompt}{retry_hint}"


def save_single_variant(job: SectionJob, seed_number: int, html: str, validation_issues: list[str], output_files: list[str]) -> None:
    if validation_issues:
        return

    output_path = OUTPUT_DIR / job.slug / f"{job.slug}-v{seed_number}.html"
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(html.strip() + "\n", encoding="utf-8")
    output_files.append(str(output_path.relative_to(PHASE_DIR)))


def run_seed_fallback(job: SectionJob, base_prompt: str) -> tuple[bool, list[str], list[str], list[AttemptRecord]]:
    fallback_attempts: list[AttemptRecord] = []
    aggregated_issues: list[str] = []
    output_files: list[str] = []

    for seed_number in range(1, SEED_COUNT + 1):
        seed_issues: list[str] = []
        seed_success = False
        for attempt in range(1, MAX_ATTEMPTS + 1):
            prompt = build_single_seed_prompt(base_prompt, seed_number, seed_issues)
            label = f"{job.slug}/seed-{seed_number}"
            log(f"[{label}] fallback attempt {attempt}/{MAX_ATTEMPTS} starting")
            start = time.time()
            try:
                result = run_gemini(prompt)
                elapsed = time.time() - start
            except subprocess.TimeoutExpired as error:
                elapsed = time.time() - start
                record = AttemptRecord(
                    attempt=attempt,
                    success=False,
                    error=f"Seed {seed_number} timeout after {elapsed:.1f}s",
                    elapsed_seconds=elapsed,
                )
                fallback_attempts.append(record)
                save_attempt_files(LOGS_DIR / job.slug, 100 * seed_number + attempt, prompt, "", f"TIMEOUT: {error}")
                seed_issues = [record.error]
                time.sleep(RETRY_BACKOFF_SECONDS)
                continue

            stdout = result.stdout or ""
            stderr = result.stderr or ""
            save_attempt_files(LOGS_DIR / job.slug, 100 * seed_number + attempt, prompt, stdout, stderr)

            if result.returncode != 0:
                error_text = (stderr or stdout or f"Gemini exited {result.returncode}").strip()
                record = AttemptRecord(
                    attempt=attempt,
                    success=False,
                    error=f"Seed {seed_number}: {error_text[:1000]}",
                    stdout_chars=len(stdout),
                    stderr_chars=len(stderr),
                    elapsed_seconds=elapsed,
                )
                fallback_attempts.append(record)
                seed_issues = [record.error]
                time.sleep(RETRY_BACKOFF_SECONDS)
                continue

            html = sanitize_output(stdout)
            issues = validate_variant(html)
            record = AttemptRecord(
                attempt=attempt,
                success=not issues,
                validation_issues=[f"v{seed_number}: {issue}" for issue in issues],
                stdout_chars=len(stdout),
                stderr_chars=len(stderr),
                elapsed_seconds=elapsed,
            )
            fallback_attempts.append(record)

            if issues:
                seed_issues = [f"v{seed_number}: {issue}" for issue in issues]
                time.sleep(RETRY_BACKOFF_SECONDS)
                continue

            save_single_variant(job, seed_number, html, issues, output_files)
            seed_success = True
            break

        if not seed_success:
            aggregated_issues.extend(seed_issues or [f"v{seed_number}: fallback generation failed"])

    return len(output_files) == SEED_COUNT, aggregated_issues, output_files, fallback_attempts


def process_section(job: SectionJob, master_template: str) -> SectionResult:
    section_log_dir = LOGS_DIR / job.slug
    section_output_dir = OUTPUT_DIR / job.slug
    section_log_dir.mkdir(parents=True, exist_ok=True)
    section_output_dir.mkdir(parents=True, exist_ok=True)

    base_prompt = extract_prompt_content(read_text(job.prompt_path))
    base_prompt = inject_master_template(base_prompt, master_template)

    attempts: list[AttemptRecord] = []
    previous_issues: list[str] = []

    for attempt in range(1, MAX_ATTEMPTS + 1):
        prompt = f"{base_prompt}{build_retry_hint(previous_issues)}"
        log(f"[{job.slug}] attempt {attempt}/{MAX_ATTEMPTS} starting")
        start = time.time()

        try:
            result = run_gemini(prompt)
            elapsed = time.time() - start
        except subprocess.TimeoutExpired as error:
            elapsed = time.time() - start
            record = AttemptRecord(
                attempt=attempt,
                success=False,
                error=f"Timeout after {elapsed:.1f}s",
                elapsed_seconds=elapsed,
            )
            attempts.append(record)
            save_attempt_files(section_log_dir, attempt, prompt, "", f"TIMEOUT: {error}")
            previous_issues = [record.error]
            log(f"[{job.slug}] attempt {attempt} timed out")
            time.sleep(RETRY_BACKOFF_SECONDS)
            continue

        stdout = result.stdout or ""
        stderr = result.stderr or ""
        save_attempt_files(section_log_dir, attempt, prompt, stdout, stderr)

        if result.returncode != 0:
            error_text = (stderr or stdout or f"Gemini exited {result.returncode}").strip()
            record = AttemptRecord(
                attempt=attempt,
                success=False,
                error=error_text[:1000],
                stdout_chars=len(stdout),
                stderr_chars=len(stderr),
                elapsed_seconds=elapsed,
            )
            attempts.append(record)
            previous_issues = [record.error]
            log(f"[{job.slug}] attempt {attempt} failed: exit {result.returncode}")
            if "429" in error_text or "rate limit" in error_text.lower():
                time.sleep(RETRY_BACKOFF_SECONDS * attempt)
            continue

        variants = split_variants(stdout)
        if len(variants) != EXPECTED_VARIANTS:
            issue = f"Expected {EXPECTED_VARIANTS} variants but parsed {len(variants)}"
            record = AttemptRecord(
                attempt=attempt,
                success=False,
                error=issue,
                stdout_chars=len(stdout),
                stderr_chars=len(stderr),
                elapsed_seconds=elapsed,
            )
            attempts.append(record)
            previous_issues = [issue]
            log(f"[{job.slug}] attempt {attempt} parse failure: {issue}")
            time.sleep(RETRY_BACKOFF_SECONDS)
            continue

        validation_issues: list[str] = []
        output_files: list[str] = []
        for index, variant_html in enumerate(variants, start=1):
            issues = validate_variant(variant_html)
            if issues:
                validation_issues.extend([f"v{index}: {issue}" for issue in issues])
                continue

            output_path = section_output_dir / f"{job.slug}-v{index}.html"
            output_path.write_text(variant_html.strip() + "\n", encoding="utf-8")
            output_files.append(str(output_path.relative_to(PHASE_DIR)))

        record = AttemptRecord(
            attempt=attempt,
            success=not validation_issues,
            validation_issues=validation_issues,
            variants_saved=len(output_files),
            stdout_chars=len(stdout),
            stderr_chars=len(stderr),
            elapsed_seconds=elapsed,
            output_files=output_files,
        )
        attempts.append(record)

        summary_path = section_log_dir / f"attempt-{attempt:02d}.summary.json"
        summary_path.write_text(json.dumps(asdict(record), indent=2), encoding="utf-8")

        if record.success:
            log(f"[{job.slug}] attempt {attempt} succeeded with 5 variants")
            return SectionResult(slug=job.slug, success=True, attempts=attempts)

        previous_issues = validation_issues
        log(f"[{job.slug}] attempt {attempt} validation failed ({len(validation_issues)} issues)")
        time.sleep(RETRY_BACKOFF_SECONDS)

    log(f"[{job.slug}] switching to per-seed fallback generation")
    fallback_success, fallback_issues, fallback_files, fallback_attempts = run_seed_fallback(job, base_prompt)
    attempts.extend(fallback_attempts)
    attempts.append(
        AttemptRecord(
            attempt=MAX_ATTEMPTS + 1,
            success=fallback_success,
            validation_issues=fallback_issues,
            variants_saved=len(fallback_files),
            output_files=fallback_files,
        )
    )
    return SectionResult(slug=job.slug, success=fallback_success, attempts=attempts)


def build_jobs(section_filter: str | None) -> list[SectionJob]:
    jobs = [SectionJob(slug=slug, prompt_path=PROMPTS_DIR / filename) for slug, filename in SECTION_FILES]
    if section_filter:
        filtered = [job for job in jobs if job.slug == section_filter or job.prompt_path.stem == section_filter]
        return filtered
    return jobs


def run_wave(jobs: list[SectionJob], master_template: str, concurrency: int) -> list[SectionResult]:
    results: list[SectionResult] = []
    with ThreadPoolExecutor(max_workers=concurrency) as executor:
        future_map = {executor.submit(process_section, job, master_template): job for job in jobs}
        for future in as_completed(future_map):
            results.append(future.result())
    return results


def save_manifest(results: list[SectionResult]) -> None:
    manifest = {
        "model": MODEL,
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S"),
        "phase": "phase-1-untitled-ui",
        "sections": [
            {
                "slug": result.slug,
                "success": result.success,
                "attempts": [asdict(attempt) for attempt in result.attempts],
            }
            for result in sorted(results, key=lambda item: item.slug)
        ],
    }
    manifest_path = LOGS_DIR / "manifest.json"
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    manifest_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    log(f"Manifest saved: {manifest_path}")


def print_report(results: list[SectionResult]) -> None:
    succeeded = [result.slug for result in results if result.success]
    failed = [result for result in results if not result.success]
    log("\n============================================================")
    log("PHASE 1 UNTITLED UI REPORT")
    log("============================================================")
    log(f"Succeeded: {len(succeeded)}")
    log(f"Failed:    {len(failed)}")
    if succeeded:
        log(f"Successful sections: {', '.join(sorted(succeeded))}")
    if failed:
        log("Failed sections:")
        for result in failed:
            last_attempt = result.attempts[-1] if result.attempts else None
            message = last_attempt.error if last_attempt and last_attempt.error else "; ".join(last_attempt.validation_issues[:3]) if last_attempt else "unknown"
            log(f"- {result.slug}: {message}")


def main() -> int:
    parser = argparse.ArgumentParser(description="Run Phase 1 Untitled UI Gemini generation")
    parser.add_argument("--section", help="Run only one section slug")
    parser.add_argument("--dry-run", action="store_true", help="Show planned sections without executing Gemini")
    parser.add_argument("--concurrency", type=int, default=DEFAULT_CONCURRENCY, help="Concurrent Gemini section runs")
    args = parser.parse_args()

    jobs = build_jobs(args.section)
    if not jobs:
        log("No matching sections found.")
        return 1

    master_template = read_text(MASTER_PROMPT_PATH)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    LOGS_DIR.mkdir(parents=True, exist_ok=True)

    if args.dry_run:
        log("Planned sections:")
        for job in jobs:
            log(f"- {job.slug}: {job.prompt_path}")
        return 0

    all_results: list[SectionResult] = []
    if len(jobs) > 1 and jobs[0].slug == "hero":
        log("Running hero canary before remaining sections.")
        canary_results = run_wave([jobs[0]], master_template, concurrency=1)
        all_results.extend(canary_results)
        if not canary_results[0].success:
            save_manifest(all_results)
            print_report(all_results)
            return 1
        remaining_jobs = jobs[1:]
        if remaining_jobs:
            log(f"Waiting {INTER_WAVE_DELAY_SECONDS}s before remaining waves.")
            time.sleep(INTER_WAVE_DELAY_SECONDS)
            all_results.extend(run_wave(remaining_jobs, master_template, concurrency=max(1, args.concurrency)))
    else:
        all_results.extend(run_wave(jobs, master_template, concurrency=max(1, args.concurrency)))

    save_manifest(all_results)
    print_report(all_results)
    return 0 if all(result.success for result in all_results) else 1


if __name__ == "__main__":
    raise SystemExit(main())
