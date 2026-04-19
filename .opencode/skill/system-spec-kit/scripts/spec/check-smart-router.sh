#!/usr/bin/env bash
# ---------------------------------------------------------------
# SPECKIT: CHECK SMART ROUTER
# ---------------------------------------------------------------
# Static CI check for SKILL.md smart-router resource references.
#
# Usage: check-smart-router.sh [--json]
#
# CI wiring: run this script from repository root after smart-router
# reference updates. Exit 1 means missing routable resources; bloat
# findings are warnings only.

set -euo pipefail

json_mode=false

show_help() {
  cat <<'EOF'
check-smart-router.sh - Validate SKILL.md smart-router resource paths

USAGE:
  check-smart-router.sh [--json]

Checks every top-level .opencode/skill/*/SKILL.md smart-router block for
referenced references/*.md and assets/*.md resources, reports missing files,
and flags skills whose ALWAYS tier exceeds 50% of the loadable markdown tree.

EXIT CODES:
  0 clean or warnings only
  1 missing resource paths
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --json)
      json_mode=true
      shift
      ;;
    --help|-h)
      show_help
      exit 0
      ;;
    *)
      printf 'ERROR: Unknown option %s\n' "$1" >&2
      exit 1
      ;;
  esac
done

root_dir="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
export SMART_ROUTER_ROOT="$root_dir"
export SMART_ROUTER_JSON_MODE="$json_mode"

python3 <<'PY'
from __future__ import annotations

import json
import os
import re
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable


ROOT_DIR = Path(os.environ.get("SMART_ROUTER_ROOT", os.getcwd())).resolve()
SKILL_ROOT = ROOT_DIR / ".opencode" / "skill"
JSON_MODE = os.environ.get("SMART_ROUTER_JSON_MODE") == "true"
RESOURCE_RE = re.compile(r"(?<![\w.-])((?:\./)?(?:references|assets)/[A-Za-z0-9_./{}-]+\.md)")
CODE_BLOCK_RE = re.compile(r"```(?:python|text|bash)?\s*\n(.*?)```", re.DOTALL)
BLOAT_THRESHOLD = 0.50


@dataclass(frozen=True)
class SkillResult:
    skill: str
    variant: str
    referenced_paths: list[str]
    always_paths: list[str]
    missing_paths: list[str]
    always_bytes: int
    tree_bytes: int
    ratio: float


def supports_color() -> bool:
    return sys.stdout.isatty() and os.environ.get("NO_COLOR") is None and not JSON_MODE


USE_COLOR = supports_color()


def color(value: str, code: str) -> str:
    if not USE_COLOR:
        return value
    return f"\033[{code}m{value}\033[0m"


def normalize_resource(value: str) -> str | None:
    cleaned = value.strip().strip("\"'`").replace("\\", "/")
    while cleaned.startswith("./"):
        cleaned = cleaned[2:]
    if not cleaned.endswith(".md"):
        return None
    if not (cleaned.startswith("references/") or cleaned.startswith("assets/")):
        return None
    return cleaned


def unique_sorted(values: Iterable[str]) -> list[str]:
    return sorted(set(values))


def find_router_block(skill_text: str) -> str:
    marker = re.search(r"^### Smart Router Pseudocode\s*$", skill_text, re.MULTILINE)
    if marker:
        remainder = skill_text[marker.end():]
        block = CODE_BLOCK_RE.search(remainder)
        if block:
            return block.group(1)

    smart_section = re.search(
        r"<!-- ANCHOR:smart-routing -->(.*?)<!-- /ANCHOR:smart-routing -->",
        skill_text,
        re.DOTALL,
    )
    if smart_section:
        blocks = CODE_BLOCK_RE.findall(smart_section.group(1))
        return "\n\n".join(blocks) if blocks else smart_section.group(1)

    return skill_text


def detect_variant(router_text: str) -> str:
    has_canonical = "INTENT_SIGNALS" in router_text and "RESOURCE_MAP" in router_text
    if has_canonical:
        return "canonical"
    if "INTENT_MODEL" in router_text and "LOAD_LEVELS" in router_text:
        return "intent_model_load_levels"
    if "DEFAULT_RESOURCES" in router_text and "ON_DEMAND_KEYWORDS" in router_text:
        return "default_resources_on_demand_keywords"
    return "unknown"


def extract_stack_folder_pairs(router_text: str) -> list[tuple[str, str]]:
    pairs: list[tuple[str, str]] = []
    for match in re.finditer(r'"[A-Z_]+":\s*\("([^"]+)",\s*"([^"]+)"\)', router_text):
        pairs.append((match.group(1), match.group(2)))
    return pairs


def expand_dynamic_resource(resource: str, router_text: str) -> list[str]:
    normalized = normalize_resource(resource)
    if normalized is None:
        return []

    if "{category}" in normalized and "{folder}" in normalized:
        return [
            normalized.replace("{category}", category).replace("{folder}", folder)
            for category, folder in extract_stack_folder_pairs(router_text)
        ]

    if "{" in normalized or "}" in normalized:
        return []

    return [normalized]


def extract_resources(text: str, router_text: str) -> list[str]:
    paths: list[str] = []
    for match in RESOURCE_RE.finditer(text):
        paths.extend(expand_dynamic_resource(match.group(1), router_text))
    return unique_sorted(paths)


def find_assignment_block(router_text: str, name: str) -> str | None:
    pattern = re.compile(
        rf"^\s*{re.escape(name)}\s*=\s*(?P<value>\[.*?\]|[\"'].*?[\"'])",
        re.MULTILINE | re.DOTALL,
    )
    match = pattern.search(router_text)
    return match.group("value") if match else None


def resolve_named_assignments(router_text: str, names: Iterable[str]) -> list[str]:
    paths: list[str] = []
    for name in names:
        block = find_assignment_block(router_text, name)
        if block:
            paths.extend(extract_resources(block, router_text))
    return paths


def extract_initial_selected_block(router_text: str) -> str | None:
    match = re.search(r"^\s*selected\s*=\s*\[(?P<body>.*?)\]", router_text, re.MULTILINE | re.DOTALL)
    return match.group("body") if match else None


def extract_loading_levels_always(router_text: str) -> list[str]:
    paths: list[str] = []
    for match in re.finditer(
        r"(?:[\"']?ALWAYS[\"']?\s*:\s*\[)(?P<body>.*?)]",
        router_text,
        re.DOTALL,
    ):
        paths.extend(extract_resources(match.group("body"), router_text))
    return paths


def extract_always_paths(router_text: str) -> list[str]:
    paths: list[str] = []
    paths.extend(resolve_named_assignments(
        router_text,
        [
            "DEFAULT_RESOURCE",
            "DEFAULT_RESOURCES",
            "BASELINE_RESOURCE",
            "BASELINE_RESOURCES",
            "ALWAYS_RESOURCE",
            "ALWAYS_RESOURCES",
        ],
    ))
    paths.extend(extract_loading_levels_always(router_text))

    selected_block = extract_initial_selected_block(router_text)
    if selected_block:
        paths.extend(extract_resources(selected_block, router_text))

    return unique_sorted(paths)


def markdown_tree_bytes(skill_dir: Path) -> int:
    total = (skill_dir / "SKILL.md").stat().st_size
    for base_name in ("references", "assets"):
        base = skill_dir / base_name
        if not base.exists():
            continue
        for resource in base.rglob("*.md"):
            if resource.is_file():
                total += resource.stat().st_size
    return total


def bytes_for_paths(skill_dir: Path, paths: Iterable[str]) -> int:
    total = (skill_dir / "SKILL.md").stat().st_size
    for resource in paths:
        full_path = skill_dir / resource
        if full_path.exists() and full_path.is_file():
            total += full_path.stat().st_size
    return total


def analyze_skill(skill_dir: Path) -> SkillResult:
    skill_text = (skill_dir / "SKILL.md").read_text(encoding="utf-8")
    router_text = find_router_block(skill_text)
    variant = detect_variant(router_text)
    referenced_paths = extract_resources(router_text, router_text)
    always_paths = extract_always_paths(router_text)
    missing_paths = [
        resource for resource in referenced_paths
        if not (skill_dir / resource).exists()
    ]
    tree_bytes = markdown_tree_bytes(skill_dir)
    always_bytes = bytes_for_paths(skill_dir, always_paths)
    ratio = always_bytes / tree_bytes if tree_bytes > 0 else 0.0

    return SkillResult(
        skill=skill_dir.name,
        variant=variant,
        referenced_paths=referenced_paths,
        always_paths=always_paths,
        missing_paths=missing_paths,
        always_bytes=always_bytes,
        tree_bytes=tree_bytes,
        ratio=ratio,
    )


def iter_skill_dirs() -> list[Path]:
    if not SKILL_ROOT.exists():
        return []
    return sorted(
        path for path in SKILL_ROOT.iterdir()
        if path.is_dir() and (path / "SKILL.md").is_file()
    )


def build_payload(results: list[SkillResult]) -> dict[str, object]:
    errors = [
        {"skill": result.skill, "missing_paths": result.missing_paths}
        for result in results
        if result.missing_paths
    ]
    warnings = [
        {
            "skill": result.skill,
            "always_bytes": result.always_bytes,
            "tree_bytes": result.tree_bytes,
            "ratio": round(result.ratio, 4),
        }
        for result in results
        if result.ratio > BLOAT_THRESHOLD
    ]
    return {"errors": errors, "warnings": warnings}


def print_human(results: list[SkillResult], payload: dict[str, object]) -> None:
    errors = payload["errors"]
    warnings = payload["warnings"]
    print(f"Smart-router check: {len(results)} top-level skills scanned")

    if errors:
        missing_count = sum(len(item["missing_paths"]) for item in errors)  # type: ignore[index]
        print(color(f"PATHS: FAIL ({missing_count} missing resources)", "31;1"))
        for item in errors:  # type: ignore[assignment]
            for missing_path in item["missing_paths"]:
                print(color("ERROR", "31;1") + f" {item['skill']}: {missing_path}")
    else:
        print(color("PATHS: PASS (no missing references/*.md or assets/*.md resources)", "32;1"))

    if warnings:
        print(color(f"BLOAT: WARN ({len(warnings)} skills exceed 50% ALWAYS tier share)", "33;1"))
        for item in warnings:  # type: ignore[assignment]
            percent = item["ratio"] * 100
            print(
                color("WARN", "33;1")
                + f" {item['skill']}: ALWAYS {item['always_bytes']}/{item['tree_bytes']} bytes ({percent:.2f}%)"
            )
    else:
        print(color("BLOAT: PASS (no ALWAYS tier exceeds 50% of loadable markdown tree)", "32;1"))


def main() -> int:
    results = [analyze_skill(skill_dir) for skill_dir in iter_skill_dirs()]
    payload = build_payload(results)

    if JSON_MODE:
        print(json.dumps(payload, indent=2, sort_keys=True))
    else:
        print_human(results, payload)

    return 1 if payload["errors"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
PY
