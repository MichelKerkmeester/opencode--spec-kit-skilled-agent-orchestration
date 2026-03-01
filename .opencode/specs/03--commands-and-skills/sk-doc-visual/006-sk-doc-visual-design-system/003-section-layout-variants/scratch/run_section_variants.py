#!/usr/bin/env python3

import argparse
import concurrent.futures
import json
import random
import re
import subprocess
import textwrap
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Tuple


SCRIPT_PATH = Path(__file__).resolve()
WORKSPACE = next((parent for parent in SCRIPT_PATH.parents if (parent / ".opencode").is_dir()), Path.cwd())
SKILL_ROOT = WORKSPACE / ".opencode/skill/sk-doc-visual"
SECTIONS_DIR = SKILL_ROOT / "assets/sections"
PHASE_ROOT = SCRIPT_PATH.parent.parent

RESEARCH_BRIEF = PHASE_ROOT / "scratch/research/layout-best-practices.md"
SHADCN_BRIEF = PHASE_ROOT / "scratch/research/shadcn-layout-brief.md"
OUTPUT_DIR = PHASE_ROOT / "scratch/outputs"
LOG_DIR = PHASE_ROOT / "scratch/logs"
PROMPT_DIR = PHASE_ROOT / "scratch/prompts"
QA_DIR = PHASE_ROOT / "scratch/qa"

DEFAULT_MODEL = "gemini-3.1-pro-preview"


@dataclass(frozen=True)
class SectionSpec:
    key: str
    filename: str
    purpose: str


SECTIONS: List[SectionSpec] = [
    SectionSpec("hero", "hero-section.html", "Top-level hero introducing the document with immediate context and identity."),
    SectionSpec("quick-start", "quick-start-section.html", "Fast onboarding path with prerequisites and first executable steps."),
    SectionSpec("feature-grid", "feature-grid-section.html", "Feature overview block highlighting capabilities in scannable cards."),
    SectionSpec(
        "operations-overview",
        "operations-overview-section.html",
        "Operational summary combining governance, lifecycle steps, and action examples.",
    ),
    SectionSpec(
        "setup-and-usage",
        "setup-and-usage-section.html",
        "Detailed setup and practical usage section with config and command examples.",
    ),
    SectionSpec("support", "support-section.html", "Troubleshooting and FAQ section for self-serve support."),
    SectionSpec("extensibility", "extensibility-section.html", "Extension model section explaining customization and adaptation paths."),
    SectionSpec(
        "related-documents",
        "related-documents-section.html",
        "Cross-reference and index section linking adjacent documentation resources.",
    ),
]


DIRECTIONS: Dict[str, List[Tuple[int, str, str]]] = {
    "hero": [
        (1, "Editorial Monument", "Large typographic hierarchy with restrained metadata rail."),
        (2, "Product Signal Strip", "Compact status strip plus concise centered narrative."),
        (3, "Split Narrative Canvas", "Left narrative with right supporting panel."),
        (4, "Diagrammatic Masthead", "Header integrated with subtle schematic framing."),
        (5, "Signal Ledger Panel", "Top signal row with split body and metadata ledger."),
        (6, "Command Capsule Hero", "Condensed hero built around command and outcome capsules."),
        (7, "Narrative Timeline Hero", "Timeline-led hero sequence introducing context and next action."),
    ],
    "quick-start": [
        (1, "Checklist Console", "Prerequisites and setup commands in a compact console rhythm."),
        (2, "Two-Lane Onboarding", "Parallel lanes for new and existing users."),
        (3, "Progressive Steps Rail", "Vertical step rail with concise command inserts."),
        (4, "Recipe Card Sequence", "Action-oriented stacked cards with minimal explanation."),
        (5, "Milestone Tracker", "Milestone checkpoints with command snippets and verification."),
        (6, "Dependency Gate Cards", "Prerequisite gates followed by setup cards in controlled sequence."),
        (7, "Contextual Command Flow", "Flow-style onboarding where each command block references next context."),
    ],
    "feature-grid": [
        (1, "Evidence Matrix", "Claim-proof-impact framing using a structured matrix grid."),
        (2, "Tiered Value Bands", "Grouped capabilities by maturity or depth bands."),
        (3, "Workflow Capability Grid", "Map features to an explicit workflow sequence."),
        (4, "Comparative Pillars", "Pillar-style presentation emphasizing distinctions."),
        (5, "Use-Case Columns", "Columns organized by user use-case instead of feature taxonomy."),
        (6, "Capability Heatmap Cards", "Card matrix with low-contrast heatmap emphasis per capability."),
        (7, "Outcome Ribbon Grid", "Grid sections grouped by outcomes with restrained ribbon headers."),
    ],
    "operations-overview": [
        (1, "Command Center Ledger", "Ledger-like operational table with calm status emphasis."),
        (2, "Lifecycle Railboard", "Horizontal lifecycle rail with linked operational snippets."),
        (3, "Policy Procedure Split", "Two-pane governance rules and execution examples."),
        (4, "Audit Snapshot Panel", "Top summary panel followed by detailed operations breakdown."),
        (5, "Ops Scenario Matrix", "Scenario matrix crossing operations state and response patterns."),
        (6, "Governance Timeline Stack", "Vertical governance timeline with action evidence blocks."),
        (7, "Execution Board Split", "Execution board on one side and command rationale on the other."),
    ],
    "setup-and-usage": [
        (1, "Guided Pipeline Stack", "Sequential setup stack with explicit checkpoints."),
        (2, "Decision-First Config", "Mode selection first, then tailored config and commands."),
        (3, "Environment Tabbed Manual", "Environment-specific usage tracks with equal emphasis."),
        (4, "Failure-Aware Cookbook", "Each step paired with quick failure diagnosis."),
        (5, "Checklist and Verify Rail", "Checklist-driven setup with dedicated verification rail."),
        (6, "Mode Matrix Setup", "Matrix-based setup where mode and environment intersect."),
        (7, "Progressive Sandbox Flow", "Sandbox-first walkthrough that graduates to production usage."),
    ],
    "support": [
        (1, "Triage Desk", "Issue prioritization table with direct next-action paths."),
        (2, "Assurance Center", "FAQ grouped by confidence and escalation guidance."),
        (3, "Troubleshooting Atlas", "Symptom-to-resolution map in compact blocks."),
        (4, "Service Playbook", "Support process cards with escalation checkpoints."),
        (5, "Incident Paths Board", "Incident categories linked to response paths and owners."),
        (6, "Resolution Ladder", "Progressive resolution ladder from quick fix to escalation."),
        (7, "SLA Signal Matrix", "Support matrix mapping severity to response targets and channels."),
    ],
    "extensibility": [
        (1, "Contract-First Extensions", "Extension points organized by interface contracts."),
        (2, "Module Catalog", "Catalog-style extension inventory with compatibility signals."),
        (3, "Pattern Library Lens", "Patterns organized by when-to-use guidance."),
        (4, "Philosophy Practice Split", "Balanced conceptual and practical extension guidance."),
        (5, "Extension Lifecycle Track", "Lifecycle track from design to release for extension modules."),
        (6, "Adapters and Contracts Board", "Adapter overview paired with contract responsibilities."),
        (7, "Customization Playbook Grid", "Playbook grid of customization strategies and tradeoffs."),
    ],
    "related-documents": [
        (1, "Knowledge Hub Index", "Intent-based document hub with clear categories."),
        (2, "Journey Reading Map", "Beginner-to-advanced reading progression."),
        (3, "Dependency Links Board", "Documents grouped by dependency relevance."),
        (4, "Curated Shelf", "Editorial shelves for start-here and deep-dive paths."),
        (5, "Reference Journey Cards", "Card journey that maps user intent to target documents."),
        (6, "Dependency Chain Index", "Index emphasizing dependency chain relationships."),
        (7, "Role-Based Resource Lanes", "Resources organized by role-specific usage lanes."),
    ],
}


def rel(path: Path) -> str:
    return path.relative_to(WORKSPACE).as_posix()


def strip_fences(text: str) -> str:
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```[a-zA-Z0-9_-]*\n", "", cleaned)
        cleaned = re.sub(r"\n```$", "", cleaned)
    return cleaned.strip() + "\n"


def validate_html(html: str) -> List[str]:
    required_signals = [
        '<meta name="color-scheme" content="light dark">',
        "prefers-reduced-motion",
        "<section",
        "var(--bg)",
        "var(--surface)",
        "var(--text)",
        "var(--accent)",
        "var(--border)",
    ]
    missing: List[str] = []
    for signal in required_signals:
        if signal not in html:
            missing.append(signal)
    flashy_signals = ["neon", "particle", "parallax", "3d transform", "setInterval("]
    lowered = html.lower()
    for signal in flashy_signals:
        if signal in lowered:
            missing.append(f"flashy_or_forbidden:{signal}")
    return missing


def build_prompt(section: SectionSpec, variant_number: int, direction_name: str, direction_desc: str, retry_hint: str = "") -> str:
    return textwrap.dedent(
        f"""
        As @write agent, generate one complete standalone HTML file for a documentation section layout variant.

        TASK
        - Section key: {section.key}
        - Variant: v{variant_number}
        - Direction: {direction_name}
        - Direction intent: {direction_desc}
        - Section purpose: {section.purpose}

        HARD REQUIREMENTS
        1) Adhere to style tokens and variables from supplied files (colors, typography, layout).
        2) Keep visual style non-flashy, calm, and deliberate.
        3) Allow meaningful structural divergence from the current baseline layout.
        4) Produce desktop + mobile responsive behavior.
        5) Include reduced-motion support and dual-theme compatibility signals.
        6) Use semantic structure and keep the section readable/scannable.
        7) You are NOT constrained to existing component composition patterns.
        8) Reference shadcn pre-built layout motifs from the supplied brief for structural inspiration only.
           Do NOT copy exact classes or component markup.

        OUTPUT FORMAT
        - Return ONLY raw HTML (no markdown fences, no explanation).
        - Full standalone HTML document is required.

        UNIQUENESS CONTROLS
        - Make this variant materially different in at least 3 axes:
          information flow, container strategy, grouping logic, emphasis model, or navigation treatment.
        - Do not do color-only or icon-only changes.

        QUALITY CONTROLS
        - Avoid aggressive visual effects.
        - Avoid decorative noise.
        - Maintain clear hierarchy and implementation practicality.

        {retry_hint}
        """
    ).strip()


def get_direction(section: SectionSpec, variant_number: int) -> Tuple[str, str]:
    for number, name, desc in DIRECTIONS[section.key]:
        if number == variant_number:
            return name, desc
    raise ValueError(f"No direction configured for {section.key} v{variant_number}")


def run_job(
    section: SectionSpec,
    variant_number: int,
    model: str,
    max_attempts: int,
    timeout_seconds: int,
    force: bool,
) -> Dict[str, object]:
    section_out_dir = OUTPUT_DIR / section.key
    section_out_dir.mkdir(parents=True, exist_ok=True)
    PROMPT_DIR.mkdir(parents=True, exist_ok=True)
    LOG_DIR.mkdir(parents=True, exist_ok=True)

    output_file = section_out_dir / f"{section.key}-v{variant_number}.html"
    prompt_file = PROMPT_DIR / f"{section.key}-v{variant_number}.prompt.txt"
    log_file = LOG_DIR / f"{section.key}-v{variant_number}.log"

    direction_name, direction_desc = get_direction(section, variant_number)

    if output_file.exists() and not force:
        return {
            "section": section.key,
            "variant": variant_number,
            "direction": direction_name,
            "success": True,
            "skipped": True,
            "output": rel(output_file),
            "attempts": 0,
        }

    retry_hint = ""
    last_missing: List[str] = []
    for attempt in range(1, max_attempts + 1):
        prompt = build_prompt(section, variant_number, direction_name, direction_desc, retry_hint)
        prompt_file.write_text(prompt, encoding="utf-8")

        refs = [
            f"@{rel(SECTIONS_DIR / section.filename)}",
            f"@{rel(RESEARCH_BRIEF)}",
            "@.opencode/skill/sk-doc-visual/references/quick_reference.md",
            "@.opencode/skill/sk-doc-visual/assets/variables/colors.css",
            "@.opencode/skill/sk-doc-visual/assets/variables/typography.css",
            "@.opencode/skill/sk-doc-visual/assets/variables/layout.css",
        ]
        if SHADCN_BRIEF.exists():
            refs.append(f"@{rel(SHADCN_BRIEF)}")

        cmd = [
            "gemini",
            prompt,
            "-m",
            model,
            "-o",
            "text",
            *refs,
        ]

        try:
            proc = subprocess.run(
                cmd,
                cwd=WORKSPACE,
                text=True,
                capture_output=True,
                timeout=timeout_seconds,
            )
        except subprocess.TimeoutExpired:
            proc = subprocess.CompletedProcess(cmd, 124, "", "timeout")

        log_body = textwrap.dedent(
            f"""
            attempt: {attempt}
            section: {section.key}
            variant: v{variant_number}
            direction: {direction_name}
            return_code: {proc.returncode}

            ---- STDERR ----
            {proc.stderr}

            ---- STDOUT PREVIEW ----
            {proc.stdout[:3000]}
            """
        ).strip()

        with log_file.open("a", encoding="utf-8") as f:
            f.write(log_body + "\n\n")

        if proc.returncode != 0:
            retry_hint = "Previous attempt returned a non-zero exit code. Regenerate complete HTML only and satisfy all constraints."
            if attempt < max_attempts:
                time.sleep(2 + random.random() * 4)
            continue

        html = strip_fences(proc.stdout)
        missing = validate_html(html)
        if missing:
            last_missing = missing
            retry_hint = (
                "Previous attempt failed validation. Missing/forbidden signals: "
                + ", ".join(missing)
                + ". Regenerate complete HTML only and satisfy all constraints exactly."
            )
            if attempt < max_attempts:
                time.sleep(1 + random.random() * 2)
            continue

        output_file.write_text(html, encoding="utf-8")
        return {
            "section": section.key,
            "variant": variant_number,
            "direction": direction_name,
            "success": True,
            "skipped": False,
            "output": rel(output_file),
            "attempts": attempt,
        }

    return {
        "section": section.key,
        "variant": variant_number,
        "direction": direction_name,
        "success": False,
        "skipped": False,
        "output": rel(output_file),
        "attempts": max_attempts,
        "missing": last_missing,
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate section HTML variants via Gemini in controlled waves.")
    parser.add_argument("--start-variant", type=int, default=1, help="First variant number to generate.")
    parser.add_argument("--end-variant", type=int, default=4, help="Last variant number to generate.")
    parser.add_argument("--concurrency", type=int, default=4, help="Maximum concurrent Gemini calls.")
    parser.add_argument("--max-attempts", type=int, default=2, help="Max attempts per job.")
    parser.add_argument("--timeout-seconds", type=int, default=480, help="Timeout per Gemini call.")
    parser.add_argument("--model", default=DEFAULT_MODEL, help="Gemini model.")
    parser.add_argument("--force", action="store_true", help="Regenerate variants even if output exists.")
    return parser.parse_args()


def main() -> None:
    args = parse_args()

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    PROMPT_DIR.mkdir(parents=True, exist_ok=True)
    QA_DIR.mkdir(parents=True, exist_ok=True)

    if args.start_variant > args.end_variant:
        raise SystemExit("start-variant must be <= end-variant")

    waves = list(range(args.start_variant, args.end_variant + 1))
    all_results: List[Dict[str, object]] = []

    for wave in waves:
        jobs = [(section, wave) for section in SECTIONS]
        print(
            f"Starting wave {wave} with {len(jobs)} jobs (concurrency={args.concurrency}, model={args.model})",
            flush=True,
        )

        with concurrent.futures.ThreadPoolExecutor(max_workers=args.concurrency) as executor:
            futures = [
                executor.submit(
                    run_job,
                    section,
                    variant_number,
                    args.model,
                    args.max_attempts,
                    args.timeout_seconds,
                    args.force,
                )
                for section, variant_number in jobs
            ]
            for future in concurrent.futures.as_completed(futures):
                result = future.result()
                all_results.append(result)
                if result.get("skipped"):
                    status = "SKIP"
                else:
                    status = "OK" if result["success"] else "FAIL"
                print(
                    f"[{status}] {result['section']} v{result['variant']} ({result['direction']}) attempts={result['attempts']}",
                    flush=True,
                )

    succeeded = [r for r in all_results if r["success"]]
    failed = [r for r in all_results if not r["success"]]
    skipped = [r for r in all_results if r.get("skipped")]

    manifest = {
        "total": len(all_results),
        "succeeded": len(succeeded),
        "failed": len(failed),
        "skipped": len(skipped),
        "concurrency": args.concurrency,
        "model": args.model,
        "start_variant": args.start_variant,
        "end_variant": args.end_variant,
        "results": all_results,
    }

    manifest_path = QA_DIR / f"generation-manifest-v{args.start_variant}-v{args.end_variant}.json"
    manifest_latest = QA_DIR / "generation-manifest.latest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    manifest_latest.write_text(json.dumps(manifest, indent=2), encoding="utf-8")

    print("---", flush=True)
    print(f"Done. succeeded={len(succeeded)} failed={len(failed)} skipped={len(skipped)}", flush=True)
    print(f"Manifest: {rel(manifest_path)}", flush=True)
    if failed:
        print("Failed jobs:", flush=True)
        for row in failed:
            print(f"- {row['section']} v{row['variant']} ({row['direction']})", flush=True)


if __name__ == "__main__":
    main()
