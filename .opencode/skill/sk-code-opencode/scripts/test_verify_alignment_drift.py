#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: ALIGNMENT DRIFT VERIFIER TESTS
# ───────────────────────────────────────────────────────────────

"""Unit-style coverage for verify_alignment_drift.py behavior."""

from __future__ import annotations

import importlib.util
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


SCRIPT_PATH = Path(__file__).resolve().parent / "verify_alignment_drift.py"


def load_module():
    spec = importlib.util.spec_from_file_location("verify_alignment_drift", SCRIPT_PATH)
    if spec is None or spec.loader is None:
        raise RuntimeError("Unable to load verifier module spec.")
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


class VerifyAlignmentDriftTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.module = load_module()

    def write_file(self, path: Path, content: str) -> None:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")

    def run_cli(self, root: Path, extra_args: list[str] | None = None) -> subprocess.CompletedProcess[str]:
        args = [sys.executable, str(SCRIPT_PATH), "--root", str(root)]
        if extra_args:
            args.extend(extra_args)
        return subprocess.run(args, capture_output=True, text=True, check=False)

    def test_discovers_mts_files(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            file_path = root / "example.mts"
            self.write_file(file_path, "export const value = 1;\n")

            discovered = list(self.module.iter_code_files([str(root)]))
            self.assertIn(str(file_path.resolve()), discovered)

            findings = self.module.check_file(str(file_path))
            self.assertTrue(any(item.rule_id == "TS-MODULE-HEADER" for item in findings))

    def test_deduplicates_overlapping_roots(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            file_path = root / "dedup.ts"
            self.write_file(file_path, "// MODULE: test\nexport const x = 1;\n")

            roots = [str(root), str(root / ".")]
            discovered = list(self.module.iter_code_files(roots))
            self.assertEqual(1, len(discovered))

    def test_tsconfig_comments_are_accepted(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            file_path = root / "tsconfig.json"
            self.write_file(
                file_path,
                '{\n'
                '  "compilerOptions": {\n'
                '    // keep strict mode enabled\n'
                '    "strict": true\n'
                "  }\n"
                "}\n",
            )

            findings = self.module.check_file(str(file_path))
            self.assertFalse(any(item.rule_id == "JSON-PARSE" for item in findings))

    def test_jsonc_block_comment_preserves_line_numbers(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            file_path = root / "bad.jsonc"
            self.write_file(
                file_path,
                "/* line 1\n"
                "line 2 */\n"
                "{\n"
                '  "a": 1,\n'
                "}\n",
            )

            findings = self.module.check_file(str(file_path))
            finding = next(item for item in findings if item.rule_id == "JSONC-PARSE")
            self.assertEqual(5, finding.line)

    def test_mjs_skips_use_strict_enforcement(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            file_path = root / "esm.mjs"
            self.write_file(file_path, "export const value = 1;\n")

            findings = self.module.check_file(str(file_path))
            self.assertFalse(any(item.rule_id == "JS-USE-STRICT" for item in findings))

    def test_vitest_files_skip_ts_module_header_enforcement(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            file_path = root / "example.vitest.ts"
            self.write_file(file_path, "export const testValue = 1;\n")

            findings = self.module.check_file(str(file_path))
            self.assertFalse(any(item.rule_id == "TS-MODULE-HEADER" for item in findings))

    def test_warning_only_exit_code_is_zero_by_default(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            self.write_file(root / "warning.js", "const value = 1;\n")

            result = self.run_cli(root)
            self.assertEqual(0, result.returncode)
            self.assertIn("[JS-USE-STRICT] [WARN]", result.stdout)

    def test_fail_on_warn_exit_code_is_one(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            self.write_file(root / "warning.js", "const value = 1;\n")

            result = self.run_cli(root, ["--fail-on-warn"])
            self.assertEqual(1, result.returncode)

    def test_context_paths_downgrade_integrity_findings_to_warning(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            file_path = root / "scratch" / "malformed.json"
            self.write_file(file_path, "{\n  bad\n}\n")

            findings = self.module.check_file(str(file_path))
            finding = next(item for item in findings if item.rule_id == "JSON-PARSE")
            self.assertEqual("WARN", finding.severity)


if __name__ == "__main__":
    unittest.main()
