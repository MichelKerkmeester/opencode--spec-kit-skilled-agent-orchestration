#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: ALIGNMENT DRIFT VERIFIER
# ───────────────────────────────────────────────────────────────

"""Lightweight recurring alignment checks for OpenCode codebases.

This verifier is intentionally behavior-neutral: it only inspects files and
reports actionable findings. It exits non-zero when violations are found.

Coverage:
- TypeScript (.ts, .tsx, .mts)
- JavaScript (.js, .mjs, .cjs)
- Python (.py)
- Shell (.sh)
- JSON (.json)
- JSONC (.jsonc)
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
from dataclasses import dataclass
from typing import Dict, Iterable, List, Set


SUPPORTED_EXTENSIONS: Dict[str, str] = {
    ".ts": "typescript",
    ".tsx": "typescript",
    ".mts": "typescript",
    ".js": "javascript",
    ".mjs": "javascript",
    ".cjs": "javascript",
    ".py": "python",
    ".sh": "shell",
    ".json": "json",
    ".jsonc": "jsonc",
}

EXCLUDED_DIRS = {
    ".git",
    "node_modules",
    "dist",
    "build",
    "coverage",
    "__pycache__",
    ".next",
    ".venv",
    "venv",
}

INTEGRITY_RULE_PREFIXES = ("COMMON-", "JSON-", "JSONC-")
CONTEXT_ADVISORY_SEGMENTS = {
    "z_archive",
    "scratch",
    "memory",
    "research",
    "context",
    "assets",
    "examples",
    "fixtures",
}
TS_TEST_SUFFIXES = (
    ".test.ts",
    ".spec.ts",
    ".vitest.ts",
    ".test.tsx",
    ".spec.tsx",
    ".vitest.tsx",
)
TSCONFIG_JSON_RE = re.compile(r"^tsconfig(\..+)?\.json$")
KNOWN_MALFORMED_JSON_FIXTURE_SUFFIXES = (
    "/.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/"
    "z_archive/044-speckit-test-suite/scratch/001-test-agent-08/malformed.json",
)


@dataclass
class Finding:
    path: str
    rule_id: str
    message: str
    fix_hint: str
    line: int = 1
    severity: str = "WARN"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Verify recurring alignment drift across languages.")
    parser.add_argument(
        "--root",
        action="append",
        default=[],
        help="Root directory to scan (repeatable). Defaults to current directory.",
    )
    parser.add_argument(
        "--fail-on-warn",
        action="store_true",
        help="Treat warning findings as build-breaking failures.",
    )
    return parser.parse_args()


def iter_code_files(roots: Iterable[str]) -> Iterable[str]:
    seen_paths: Set[str] = set()
    for root in roots:
        abs_root = os.path.realpath(root)
        for current_root, dirs, files in os.walk(abs_root):
            dirs[:] = [entry for entry in dirs if entry not in EXCLUDED_DIRS]
            for filename in files:
                extension = os.path.splitext(filename)[1].lower()
                if extension in SUPPORTED_EXTENSIONS:
                    candidate = os.path.realpath(os.path.join(current_root, filename))
                    if candidate in seen_paths:
                        continue
                    seen_paths.add(candidate)
                    yield candidate


def find_line(lines: List[str], pattern: str) -> int:
    regex = re.compile(pattern)
    for index, value in enumerate(lines, start=1):
        if regex.search(value):
            return index
    return 0


def strip_jsonc_comments(content: str) -> str:
    result: List[str] = []
    in_string = False
    string_delim = ""
    escaping = False
    in_line_comment = False
    in_block_comment = False
    i = 0
    length = len(content)

    while i < length:
        char = content[i]
        next_char = content[i + 1] if i + 1 < length else ""

        if in_line_comment:
            if char == "\n":
                in_line_comment = False
                result.append(char)
            i += 1
            continue

        if in_block_comment:
            if char == "*" and next_char == "/":
                in_block_comment = False
                i += 2
            else:
                if char == "\n":
                    # Preserve newlines for line-accurate parser errors.
                    result.append("\n")
                i += 1
            continue

        if in_string:
            result.append(char)
            if escaping:
                escaping = False
            elif char == "\\":
                escaping = True
            elif char == string_delim:
                in_string = False
            i += 1
            continue

        if char in {'"', "'"}:
            in_string = True
            string_delim = char
            result.append(char)
            i += 1
            continue

        if char == "/" and next_char == "/":
            in_line_comment = True
            i += 2
            continue

        if char == "/" and next_char == "*":
            in_block_comment = True
            i += 2
            continue

        result.append(char)
        i += 1

    return "".join(result)


def normalize_path(path: str) -> str:
    return path.replace("\\", "/").lower()


def is_path_segment_present(path: str, segment: str) -> bool:
    normalized = f"/{normalize_path(path).strip('/')}/"
    return f"/{segment.lower()}/" in normalized


def is_context_advisory_path(path: str) -> bool:
    if is_test_heavy_path(path):
        return True
    return any(is_path_segment_present(path, segment) for segment in CONTEXT_ADVISORY_SEGMENTS)


def is_test_heavy_path(path: str) -> bool:
    normalized = normalize_path(path)
    basename = os.path.basename(normalized)
    if "/tests/" in f"/{normalized.strip('/')}/":
        return True
    return basename.endswith(TS_TEST_SUFFIXES)


def is_ts_pattern_asset(path: str) -> bool:
    normalized = normalize_path(path)
    return "/assets/" in normalized and "/patterns/" in normalized


def is_known_malformed_json_fixture(path: str) -> bool:
    normalized = normalize_path(path)
    return any(normalized.endswith(suffix) for suffix in KNOWN_MALFORMED_JSON_FIXTURE_SUFFIXES)


def should_skip_ts_module_header(path: str) -> bool:
    return is_test_heavy_path(path) or is_ts_pattern_asset(path)


def classify_severity(path: str, rule_id: str) -> str:
    base_severity = "ERROR" if rule_id.startswith(INTEGRITY_RULE_PREFIXES) else "WARN"
    if is_context_advisory_path(path):
        return "WARN"
    return base_severity


def check_javascript(path: str, lines: List[str], extension: str) -> List[Finding]:
    findings: List[Finding] = []
    if extension == ".mjs":
        return findings

    strict_line = find_line(lines[:40], r"^\s*['\"]use strict['\"];\s*$")
    if strict_line == 0:
        findings.append(
            Finding(
                path=path,
                line=1,
                rule_id="JS-USE-STRICT",
                message="Missing `'use strict';` near file top.",
                fix_hint="Add `'use strict';` within the first 40 lines for JS runtime scripts.",
            )
        )
    return findings


def check_typescript(path: str, lines: List[str]) -> List[Finding]:
    findings: List[Finding] = []
    if should_skip_ts_module_header(path):
        return findings

    module_marker = find_line(lines[:40], r"MODULE:")
    if module_marker == 0:
        findings.append(
            Finding(
                path=path,
                line=1,
                rule_id="TS-MODULE-HEADER",
                message="Missing TypeScript module header marker (`MODULE:`) near file top.",
                fix_hint="Add the standard TS header block with `MODULE:` in the first 40 lines.",
            )
        )
    return findings


def check_python(path: str, lines: List[str]) -> List[Finding]:
    findings: List[Finding] = []
    first_line = lines[0].strip() if lines else ""
    if first_line != "#!/usr/bin/env python3":
        findings.append(
            Finding(
                path=path,
                line=1,
                rule_id="PY-SHEBANG",
                message="Missing canonical Python shebang.",
                fix_hint="Set first line to `#!/usr/bin/env python3`.",
            )
        )

    content = "".join(lines[:80])
    if not re.search(r'"""|\'\'\'', content):
        findings.append(
            Finding(
                path=path,
                line=1,
                rule_id="PY-DOCSTRING",
                message="Missing top-level module docstring near file top.",
                fix_hint="Add a short module docstring describing purpose and usage.",
            )
        )
    return findings


def check_shell(path: str, lines: List[str]) -> List[Finding]:
    findings: List[Finding] = []
    first_line = lines[0].strip() if lines else ""
    if first_line != "#!/usr/bin/env bash":
        findings.append(
            Finding(
                path=path,
                line=1,
                rule_id="SH-SHEBANG",
                message="Missing canonical bash shebang.",
                fix_hint="Set first line to `#!/usr/bin/env bash`.",
            )
        )

    strict_line = find_line(lines[:80], r"^\s*set\s+-euo\s+pipefail\s*$")
    if strict_line == 0:
        findings.append(
            Finding(
                path=path,
                line=1,
                rule_id="SH-STRICT-MODE",
                message="Missing `set -euo pipefail` strict mode declaration.",
                fix_hint="Add `set -euo pipefail` near the top of the script.",
            )
        )
    return findings


def check_json(path: str, content: str) -> List[Finding]:
    findings: List[Finding] = []
    if is_known_malformed_json_fixture(path):
        return findings

    try:
        json.loads(content)
    except json.JSONDecodeError as error:
        fallback_error = error
        if TSCONFIG_JSON_RE.match(os.path.basename(path).lower()):
            cleaned = strip_jsonc_comments(content)
            try:
                json.loads(cleaned)
                return findings
            except json.JSONDecodeError as second_error:
                fallback_error = second_error

        findings.append(
            Finding(
                path=path,
                line=fallback_error.lineno,
                rule_id="JSON-PARSE",
                message=f"Invalid JSON: {fallback_error.msg}",
                fix_hint="Fix JSON syntax so standard parsers can load this file.",
            )
        )
    return findings


def check_jsonc(path: str, content: str) -> List[Finding]:
    findings: List[Finding] = []
    cleaned = strip_jsonc_comments(content)
    try:
        json.loads(cleaned)
    except json.JSONDecodeError as error:
        findings.append(
            Finding(
                path=path,
                line=error.lineno,
                rule_id="JSONC-PARSE",
                message=f"Invalid JSONC structure after comment stripping: {error.msg}",
                fix_hint="Fix JSONC commas/braces/quotes while keeping comments JSONC-compatible.",
            )
        )
    return findings


def check_common(path: str, content: str) -> List[Finding]:
    findings: List[Finding] = []
    if "\r\n" in content:
        findings.append(
            Finding(
                path=path,
                line=1,
                rule_id="COMMON-LINE-ENDINGS",
                message="CRLF line endings detected.",
                fix_hint="Normalize to LF line endings for deterministic cross-platform diffs.",
            )
        )
    return findings


def check_file(path: str) -> List[Finding]:
    extension = os.path.splitext(path)[1].lower()
    raw_findings: List[Finding] = []

    try:
        with open(path, "r", encoding="utf-8") as handle:
            content = handle.read()
    except UnicodeDecodeError:
        return [
            Finding(
                path=path,
                line=1,
                rule_id="COMMON-UTF8",
                message="File is not valid UTF-8 text.",
                fix_hint="Re-encode the file as UTF-8.",
            )
        ]

    lines = content.splitlines(keepends=True)
    raw_findings.extend(check_common(path, content))

    if extension in {".js", ".mjs", ".cjs"}:
        raw_findings.extend(check_javascript(path, lines, extension))
    elif extension in {".ts", ".tsx", ".mts"}:
        raw_findings.extend(check_typescript(path, lines))
    elif extension == ".py":
        raw_findings.extend(check_python(path, lines))
    elif extension == ".sh":
        raw_findings.extend(check_shell(path, lines))
    elif extension == ".json":
        raw_findings.extend(check_json(path, content))
    elif extension == ".jsonc":
        raw_findings.extend(check_jsonc(path, content))

    findings: List[Finding] = []
    for finding in raw_findings:
        finding.severity = classify_severity(path, finding.rule_id)
        findings.append(finding)
    return findings


def relpath(path: str) -> str:
    try:
        return os.path.relpath(path, os.getcwd())
    except ValueError:
        return path


def main() -> int:
    args = parse_args()
    roots = args.root or [os.getcwd()]
    findings: List[Finding] = []
    scanned = 0

    for file_path in sorted(iter_code_files(roots)):
        scanned += 1
        findings.extend(check_file(file_path))

    error_count = sum(1 for item in findings if item.severity == "ERROR")
    warning_count = sum(1 for item in findings if item.severity == "WARN")
    should_fail = error_count > 0 or (args.fail_on_warn and warning_count > 0)

    if should_fail:
        print("[alignment-drift] FAIL")
    else:
        print("[alignment-drift] PASS")

    print(f"Scanned files: {scanned}")
    print(f"Findings: {len(findings)}")
    print(f"Errors: {error_count}")
    print(f"Warnings: {warning_count}")

    if findings:
        print("")
        print("Actionable findings:")
        for item in findings:
            print(
                f"- {relpath(item.path)}:{item.line} [{item.rule_id}] [{item.severity}] {item.message} "
                f"Fix: {item.fix_hint}"
            )
    else:
        print("Violations: 0")

    if not should_fail and warning_count > 0 and not args.fail_on_warn:
        print("")
        print("Note: warnings are non-blocking by default. Use --fail-on-warn to make warnings fail.")

    return 1 if should_fail else 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except BrokenPipeError:
        # Support pipelines like `... | rg ...` without stack traces.
        try:
            sys.stdout.close()
        except Exception:
            pass
        sys.exit(0)
