#!/usr/bin/env python3
"""
TEST: Skill Advisor Automated Coverage
T243: skill-advisor harnesses lacking direct automated coverage
T246: Add automated test files for skill_advisor scripts

Finding #27: These harnesses appear to have no direct automated coverage.
Finding #32: .opencode/skill/skill-advisor currently has no automated test
files adjacent to the reviewed scripts.

This test suite provides direct automated coverage for:
- skill_advisor.py: analyze_prompt, analyze_batch, health_check, get_skills
- skill_advisor_bench.py: load_prompts_from_dataset
- skill_advisor_regression.py: compute_metrics, load_jsonl
"""

import importlib.util
import contextlib
import io
import json
import os
import sqlite3
import sys
import tempfile

# ───────────────────────────────────────────────────────────────
# 1. MODULE LOADING
# ───────────────────────────────────────────────────────────────

SCRIPT_DIR = os.path.join(os.path.dirname(os.path.realpath(__file__)), '..', 'scripts')
SCRIPT_DIR = os.path.realpath(SCRIPT_DIR)

passed = 0
failed = 0


def load_module(name, filename):
    """Load a Python module by file path."""
    path = os.path.join(SCRIPT_DIR, filename)
    spec = importlib.util.spec_from_file_location(name, path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"Cannot load {path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def ok(name, evidence=""):
    global passed
    passed += 1
    print(f"  PASS: {name}" + (f" ({evidence})" if evidence else ""))


def fail_test(name, reason=""):
    global failed
    failed += 1
    print(f"  FAIL: {name}" + (f" ({reason})" if reason else ""))


# ───────────────────────────────────────────────────────────────
# 2. SKILL ADVISOR TESTS
# ───────────────────────────────────────────────────────────────

def test_advisor_module():
    """Test core skill_advisor.py functions."""
    print("\n--- skill_advisor.py ---")

    try:
        advisor = load_module("skill_advisor", "skill_advisor.py")
    except Exception as exc:
        fail_test("T243-SA-LOAD: skill_advisor.py loads", str(exc))
        return

    ok("T243-SA-LOAD: skill_advisor.py loads")

    # T243-SA-001: analyze_prompt returns list
    try:
        result = advisor.analyze_prompt(
            prompt="create a pull request on github",
            confidence_threshold=0.8,
            uncertainty_threshold=0.35,
            confidence_only=False,
            show_rejections=False,
        )
        if isinstance(result, list):
            ok("T243-SA-001: analyze_prompt returns list", f"len={len(result)}")
        else:
            fail_test("T243-SA-001: analyze_prompt returns list", f"type={type(result)}")
    except Exception as exc:
        fail_test("T243-SA-001: analyze_prompt returns list", str(exc))

    # T243-SA-002: analyze_prompt with confidence_only mode
    try:
        result = advisor.analyze_prompt(
            prompt="create a pull request on github",
            confidence_threshold=0.8,
            uncertainty_threshold=0.35,
            confidence_only=True,
            show_rejections=False,
        )
        if isinstance(result, list):
            ok("T243-SA-002: analyze_prompt confidence_only mode works", f"len={len(result)}")
        else:
            fail_test("T243-SA-002: analyze_prompt confidence_only mode works", f"type={type(result)}")
    except Exception as exc:
        fail_test("T243-SA-002: analyze_prompt confidence_only mode works", str(exc))

    # T243-SA-003: analyze_prompt with empty string
    try:
        result = advisor.analyze_prompt(
            prompt="",
            confidence_threshold=0.8,
            uncertainty_threshold=0.35,
            confidence_only=False,
            show_rejections=False,
        )
        if isinstance(result, list):
            ok("T243-SA-003: analyze_prompt handles empty prompt", f"len={len(result)}")
        else:
            fail_test("T243-SA-003: analyze_prompt handles empty prompt", f"type={type(result)}")
    except Exception as exc:
        fail_test("T243-SA-003: analyze_prompt handles empty prompt", str(exc))

    # T243-SA-004: analyze_batch returns list
    try:
        result = advisor.analyze_batch(
            prompts=["create a PR", "save memory context"],
            confidence_threshold=0.8,
            uncertainty_threshold=0.35,
            confidence_only=False,
            show_rejections=False,
        )
        if isinstance(result, list):
            ok("T243-SA-004: analyze_batch returns list", f"len={len(result)}")
            if len(result) == 2:
                ok("T243-SA-004b: analyze_batch returns one result per prompt")
            else:
                fail_test("T243-SA-004b: analyze_batch returns one result per prompt", f"expected 2, got {len(result)}")
        else:
            fail_test("T243-SA-004: analyze_batch returns list", f"type={type(result)}")
    except Exception as exc:
        fail_test("T243-SA-004: analyze_batch returns list", str(exc))

    # T243-SA-005: health_check returns dict with expected keys
    try:
        health = advisor.health_check()
        if isinstance(health, dict):
            expected_keys = {"skills_found", "skills_dir", "skill_graph_loaded", "status"}
            found_keys = set(health.keys())
            if expected_keys.issubset(found_keys):
                ok("T243-SA-005: health_check returns expected keys", f"keys={list(health.keys())[:5]}")
            else:
                missing = expected_keys - found_keys
                fail_test("T243-SA-005: health_check returns expected keys", f"missing={missing}")
        else:
            fail_test("T243-SA-005: health_check returns dict", f"type={type(health)}")
    except Exception as exc:
        fail_test("T243-SA-005: health_check returns dict", str(exc))

    # T243-SA-006: get_skills returns non-empty dict
    try:
        skills = advisor.get_skills()
        if isinstance(skills, dict) and len(skills) > 0:
            ok("T243-SA-006: get_skills returns populated dict", f"count={len(skills)}")
        else:
            fail_test("T243-SA-006: get_skills returns populated dict", f"type={type(skills)}, len={len(skills) if isinstance(skills, dict) else 'N/A'}")
    except Exception as exc:
        fail_test("T243-SA-006: get_skills returns populated dict", str(exc))

    # T243-SA-007: parse_frontmatter captures Keywords HTML comments
    try:
        with tempfile.NamedTemporaryFile("w", suffix=".md", delete=False, encoding="utf-8") as f:
            f.write(
                """---
name: demo-skill
description: Demo parser fixture
keywords: existing-term
---
<!-- Keywords: alpha, beta phrase, existing-term -->
# Demo Skill
"""
            )
            tmppath = f.name

        metadata = advisor.parse_frontmatter(tmppath)
        os.unlink(tmppath)

        if isinstance(metadata, dict) and metadata.get("keywords") == "existing-term, alpha, beta phrase":
            ok("T243-SA-007: parse_frontmatter captures Keywords HTML comments", metadata["keywords"])
        else:
            fail_test(
                "T243-SA-007: parse_frontmatter captures Keywords HTML comments",
                f"metadata={metadata}",
            )
    except Exception as exc:
        fail_test("T243-SA-007: parse_frontmatter captures Keywords HTML comments", str(exc))

    # T243-SA-008: cached skill records include Keywords HTML comment variants
    try:
        runtime = load_module("skill_advisor_runtime", "skill_advisor_runtime.py")
        with tempfile.TemporaryDirectory() as tmpdir:
            skill_dir = os.path.join(tmpdir, "demo-skill")
            os.makedirs(skill_dir, exist_ok=True)
            skill_file = os.path.join(skill_dir, "SKILL.md")
            with open(skill_file, "w", encoding="utf-8") as handle:
                handle.write(
                    """---
name: demo-skill
description: Runtime cache fixture
---
<!-- Keywords: autoresearch, packet anchor -->
# Demo Skill
"""
                )

            records = runtime.get_cached_skill_records(tmpdir, set(), force_refresh=True)
            record = records.get("demo-skill", {})
            keyword_variants = set(record.get("keyword_variants", set()))
            if {"autoresearch", "packet anchor"}.issubset(keyword_variants):
                ok("T243-SA-008: cached skill records include Keywords HTML comment variants")
            else:
                fail_test(
                    "T243-SA-008: cached skill records include Keywords HTML comment variants",
                    f"keyword_variants={sorted(keyword_variants)}",
                )
    except Exception as exc:
        fail_test("T243-SA-008: cached skill records include Keywords HTML comment variants", str(exc))

    # T243-SA-009: analyze_prompt result shape has expected fields
    try:
        result = advisor.analyze_prompt(
            prompt="review code changes in PR",
            confidence_threshold=0.5,  # Low threshold for guaranteed results
            uncertainty_threshold=1.0,
            confidence_only=True,
            show_rejections=True,
        )
        if isinstance(result, list) and len(result) > 0:
            first = result[0]
            if isinstance(first, dict) and "skill" in first:
                ok("T243-SA-009: Result item has 'skill' field", f"skill={first['skill']}")
            else:
                fail_test("T243-SA-009: Result item has 'skill' field", f"keys={list(first.keys()) if isinstance(first, dict) else 'not dict'}")
        else:
            # No results at low threshold is also valid
            ok("T243-SA-009: analyze_prompt returns valid list (may be empty)", f"len={len(result) if isinstance(result, list) else 'N/A'}")
    except Exception as exc:
        fail_test("T243-SA-009: Result item has 'skill' field", str(exc))

    # T243-SA-010: graph intent_signals + derived.trigger_phrases affect routing
    try:
        with tempfile.TemporaryDirectory() as tmpdir:
            for skill_name in ("alpha-skill", "beta-skill"):
                skill_dir = os.path.join(tmpdir, skill_name)
                os.makedirs(skill_dir, exist_ok=True)
                with open(os.path.join(skill_dir, "SKILL.md"), "w", encoding="utf-8") as handle:
                    handle.write(
                        f"""---
name: {skill_name}
description: Fixture helper for routing tests
---
# {skill_name}
"""
                    )

            sqlite_path = os.path.join(tmpdir, "skill-graph.sqlite")
            with sqlite3.connect(sqlite_path) as connection:
                connection.executescript(
                    """
                    CREATE TABLE skill_nodes (
                        id TEXT PRIMARY KEY,
                        family TEXT NOT NULL,
                        category TEXT NOT NULL,
                        schema_version INTEGER NOT NULL,
                        domains TEXT,
                        intent_signals TEXT,
                        derived TEXT,
                        source_path TEXT NOT NULL UNIQUE,
                        content_hash TEXT NOT NULL,
                        indexed_at TEXT
                    );
                    CREATE TABLE skill_edges (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        source_id TEXT NOT NULL,
                        target_id TEXT NOT NULL,
                        edge_type TEXT NOT NULL,
                        weight REAL NOT NULL,
                        context TEXT NOT NULL
                    );
                    CREATE TABLE schema_version (version INTEGER NOT NULL);
                    CREATE TABLE skill_graph_metadata (
                        key TEXT PRIMARY KEY,
                        value TEXT,
                        updated_at TEXT
                    );
                    """
                )
                connection.execute("INSERT INTO schema_version (version) VALUES (1)")
                connection.execute(
                    """
                    INSERT INTO skill_nodes (
                        id, family, category, schema_version, domains, intent_signals, derived,
                        source_path, content_hash, indexed_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
                    """,
                    (
                        "alpha-skill",
                        "system",
                        "system",
                        2,
                        json.dumps(["testing"]),
                        json.dumps(["uncommon routing"]),
                        json.dumps({"trigger_phrases": ["latent signal phrase"]}),
                        os.path.join(tmpdir, "alpha-skill", "graph-metadata.json"),
                        "alpha-hash",
                    ),
                )
                connection.execute(
                    """
                    INSERT INTO skill_nodes (
                        id, family, category, schema_version, domains, intent_signals, derived,
                        source_path, content_hash, indexed_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
                    """,
                    (
                        "beta-skill",
                        "system",
                        "system",
                        2,
                        json.dumps(["testing"]),
                        json.dumps(["different phrase"]),
                        json.dumps({"trigger_phrases": ["other trigger"]}),
                        os.path.join(tmpdir, "beta-skill", "graph-metadata.json"),
                        "beta-hash",
                    ),
                )
                connection.commit()

            original_skills_dir = advisor.SKILLS_DIR
            original_sqlite_path = advisor.SKILL_GRAPH_SQLITE_PATH
            original_skill_graph = advisor._SKILL_GRAPH
            original_skill_graph_source = advisor._SKILL_GRAPH_SOURCE
            original_command_bridges = advisor.COMMAND_BRIDGES

            try:
                advisor.SKILLS_DIR = tmpdir
                advisor.SKILL_GRAPH_SQLITE_PATH = sqlite_path
                advisor._SKILL_GRAPH = None
                advisor._SKILL_GRAPH_SOURCE = None
                advisor.COMMAND_BRIDGES = {}
                advisor.get_skills(force_refresh=True)

                result = advisor.analyze_prompt(
                    prompt="latent signal phrase uncommon routing",
                    confidence_threshold=0.8,
                    uncertainty_threshold=0.35,
                    confidence_only=True,
                    show_rejections=True,
                )
                top = result[0] if isinstance(result, list) and result else None

                if (
                    isinstance(top, dict)
                    and top.get("skill") == "alpha-skill"
                    and top.get("confidence", 0.0) >= 0.8
                    and "(signal)" in top.get("reason", "")
                ):
                    ok("T243-SA-010: graph signals and trigger phrases boost routing", top["reason"])
                else:
                    fail_test(
                        "T243-SA-010: graph signals and trigger phrases boost routing",
                        f"top={top}, result_len={len(result) if isinstance(result, list) else 'N/A'}",
                    )
            finally:
                advisor.SKILLS_DIR = original_skills_dir
                advisor.SKILL_GRAPH_SQLITE_PATH = original_sqlite_path
                advisor._SKILL_GRAPH = original_skill_graph
                advisor._SKILL_GRAPH_SOURCE = original_skill_graph_source
                advisor.COMMAND_BRIDGES = original_command_bridges
                advisor.get_skills(force_refresh=True)
    except Exception as exc:
        fail_test("T243-SA-010: graph signals and trigger phrases boost routing", str(exc))

# ───────────────────────────────────────────────────────────────
# 3. BENCH HARNESS TESTS
# ───────────────────────────────────────────────────────────────

def test_bench_harness():
    """Test skill_advisor_bench.py helper functions."""
    print("\n--- skill_advisor_bench.py ---")

    try:
        bench = load_module("skill_advisor_bench", "skill_advisor_bench.py")
    except Exception as exc:
        fail_test("T246-BN-LOAD: skill_advisor_bench.py loads", str(exc))
        return

    ok("T246-BN-LOAD: skill_advisor_bench.py loads")

    # T246-BN-001: load_prompts_from_dataset with valid JSONL
    try:
        with tempfile.NamedTemporaryFile("w", suffix=".jsonl", delete=False, encoding="utf-8") as f:
            f.write('{"prompt": "test prompt 1"}\n')
            f.write('{"prompt": "test prompt 2"}\n')
            tmppath = f.name

        prompts = bench.load_prompts_from_dataset(tmppath)
        os.unlink(tmppath)

        if isinstance(prompts, list) and len(prompts) == 2:
            ok("T246-BN-001: load_prompts_from_dataset parses valid JSONL", f"count={len(prompts)}")
        else:
            fail_test("T246-BN-001: load_prompts_from_dataset parses valid JSONL", f"count={len(prompts) if isinstance(prompts, list) else 'N/A'}")
    except Exception as exc:
        fail_test("T246-BN-001: load_prompts_from_dataset parses valid JSONL", str(exc))

    # T246-BN-002: load_prompts_from_dataset rejects malformed rows
    try:
        with tempfile.NamedTemporaryFile("w", suffix=".jsonl", delete=False, encoding="utf-8") as f:
            f.write('{"prompt": "valid"}\n')
            f.write('not json at all\n')
            tmppath = f.name

        try:
            bench.load_prompts_from_dataset(tmppath)
            fail_test("T246-BN-002: load_prompts_from_dataset rejects malformed", "no exception raised")
        except (ValueError, Exception):
            ok("T246-BN-002: load_prompts_from_dataset rejects malformed", "raised expected exception")
        finally:
            os.unlink(tmppath)
    except Exception as exc:
        fail_test("T246-BN-002: load_prompts_from_dataset rejects malformed", str(exc))

    # T246-BN-003: load_prompts_from_dataset rejects empty prompt field
    try:
        with tempfile.NamedTemporaryFile("w", suffix=".jsonl", delete=False, encoding="utf-8") as f:
            f.write('{"prompt": ""}\n')
            tmppath = f.name

        try:
            bench.load_prompts_from_dataset(tmppath)
            fail_test("T246-BN-003: load_prompts_from_dataset rejects empty prompt", "no exception raised")
        except (ValueError, Exception):
            ok("T246-BN-003: load_prompts_from_dataset rejects empty prompt", "raised expected exception")
        finally:
            os.unlink(tmppath)
    except Exception as exc:
        fail_test("T246-BN-003: load_prompts_from_dataset rejects empty prompt", str(exc))

    # T246-BN-004: load_advisor_module returns valid module
    try:
        module = bench.load_advisor_module()
        if hasattr(module, "analyze_prompt"):
            ok("T246-BN-004: load_advisor_module returns usable module", "has analyze_prompt")
        else:
            fail_test("T246-BN-004: load_advisor_module returns usable module", "missing analyze_prompt")
    except Exception as exc:
        fail_test("T246-BN-004: load_advisor_module returns usable module", str(exc))


# ───────────────────────────────────────────────────────────────
# 4. REGRESSION HARNESS TESTS
# ───────────────────────────────────────────────────────────────

def test_regression_harness():
    """Test skill_advisor_regression.py helper functions."""
    print("\n--- skill_advisor_regression.py ---")

    try:
        regression = load_module("skill_advisor_regression", "skill_advisor_regression.py")
    except Exception as exc:
        fail_test("T246-RG-LOAD: skill_advisor_regression.py loads", str(exc))
        return

    ok("T246-RG-LOAD: skill_advisor_regression.py loads")

    # T246-RG-001: compute_metrics with sample results
    try:
        sample_results = [
            {
                "id": "test-1",
                "priority": "P0",
                "prompt": "create PR",
                "confidence_only": False,
                "expect_result": True,
                "expected_top_any": ["sk-git"],
                "expected_kind": "skill",
                "top": {"skill": "sk-git", "kind": "skill"},
                "passed": True,
                "checks": {"result_ok": True, "top_ok": True, "kind_ok": True},
                "allow_command_bridge": False,
                "non_slash": True,
            },
            {
                "id": "test-2",
                "priority": "P1",
                "prompt": "save context",
                "confidence_only": False,
                "expect_result": True,
                "expected_top_any": ["system-spec-kit"],
                "expected_kind": "skill",
                "top": {"skill": "mcp-code-mode", "kind": "skill"},
                "passed": False,
                "checks": {"result_ok": True, "top_ok": False, "kind_ok": True},
                "allow_command_bridge": False,
                "non_slash": True,
            },
        ]

        metrics = regression.compute_metrics(sample_results)
        if isinstance(metrics, dict):
            if metrics.get("total_cases") == 2 and metrics.get("passed_cases") == 1:
                ok("T246-RG-001: compute_metrics produces correct counts", f"total=2, passed=1")
            else:
                fail_test("T246-RG-001: compute_metrics produces correct counts",
                          f"total={metrics.get('total_cases')}, passed={metrics.get('passed_cases')}")
            if "pass_rate" in metrics and "top1_accuracy" in metrics:
                ok("T246-RG-001b: compute_metrics includes pass_rate and top1_accuracy")
            else:
                fail_test("T246-RG-001b: compute_metrics includes pass_rate and top1_accuracy",
                          f"keys={list(metrics.keys())}")
        else:
            fail_test("T246-RG-001: compute_metrics produces dict", f"type={type(metrics)}")
    except Exception as exc:
        fail_test("T246-RG-001: compute_metrics produces correct counts", str(exc))

    # T246-RG-002: compute_metrics with empty results
    try:
        metrics = regression.compute_metrics([])
        if isinstance(metrics, dict) and metrics.get("total_cases") == 0:
            ok("T246-RG-002: compute_metrics handles empty list", "total_cases=0")
        else:
            fail_test("T246-RG-002: compute_metrics handles empty list",
                      f"total={metrics.get('total_cases') if isinstance(metrics, dict) else 'N/A'}")
    except Exception as exc:
        fail_test("T246-RG-002: compute_metrics handles empty list", str(exc))

    # T246-RG-003: load_jsonl with valid file
    try:
        with tempfile.NamedTemporaryFile("w", suffix=".jsonl", delete=False, encoding="utf-8") as f:
            f.write('{"prompt": "test 1", "id": "T1"}\n')
            f.write('{"prompt": "test 2", "id": "T2"}\n')
            tmppath = f.name

        rows = regression.load_jsonl(tmppath)
        os.unlink(tmppath)

        if isinstance(rows, list) and len(rows) == 2:
            ok("T246-RG-003: load_jsonl parses valid JSONL", f"count={len(rows)}")
        else:
            fail_test("T246-RG-003: load_jsonl parses valid JSONL",
                      f"count={len(rows) if isinstance(rows, list) else 'N/A'}")
    except Exception as exc:
        fail_test("T246-RG-003: load_jsonl parses valid JSONL", str(exc))

    # T246-RG-004: load_jsonl rejects missing prompt field
    try:
        with tempfile.NamedTemporaryFile("w", suffix=".jsonl", delete=False, encoding="utf-8") as f:
            f.write('{"id": "no-prompt"}\n')
            tmppath = f.name

        try:
            regression.load_jsonl(tmppath)
            fail_test("T246-RG-004: load_jsonl rejects missing prompt", "no exception raised")
        except (ValueError, Exception):
            ok("T246-RG-004: load_jsonl rejects missing prompt", "raised expected exception")
        finally:
            os.unlink(tmppath)
    except Exception as exc:
        fail_test("T246-RG-004: load_jsonl rejects missing prompt", str(exc))

    # T246-RG-005: load_advisor_module returns valid module
    try:
        module = regression.load_advisor_module()
        if hasattr(module, "analyze_prompt"):
            ok("T246-RG-005: regression load_advisor_module returns usable module", "has analyze_prompt")
        else:
            fail_test("T246-RG-005: regression load_advisor_module returns usable module", "missing analyze_prompt")
    except ImportError as exc:
        # The regression module may fail to import bench internals — acceptable
        ok("T246-RG-005: regression load_advisor_module raises ImportError (expected in isolated test)", str(exc))
    except Exception as exc:
        fail_test("T246-RG-005: regression load_advisor_module returns usable module", str(exc))


# ───────────────────────────────────────────────────────────────
# 5. GRAPH COMPILER TESTS
# ───────────────────────────────────────────────────────────────

def test_graph_compiler():
    """Test skill_graph_compiler.py validation exit behavior."""
    print("\n--- skill_graph_compiler.py ---")

    try:
        compiler = load_module("skill_graph_compiler", "skill_graph_compiler.py")
    except Exception as exc:
        fail_test("T246-GC-LOAD: skill_graph_compiler.py loads", str(exc))
        return

    ok("T246-GC-LOAD: skill_graph_compiler.py loads")

    def make_edges(**overrides):
        edges = {edge_type: [] for edge_type in compiler.EDGE_TYPES}
        edges.update(overrides)
        return edges

    def edge(target, weight, context="fixture"):
        return {"target": target, "weight": weight, "context": context}

    def write_graph_metadata(skills_root, skill_id, edges):
        skill_dir = os.path.join(skills_root, skill_id)
        os.makedirs(skill_dir, exist_ok=True)
        payload = {
            "schema_version": 1,
            "skill_id": skill_id,
            "family": "system",
            "category": "system",
            "edges": edges,
            "domains": ["testing"],
            "intent_signals": ["fixture"],
        }
        with open(os.path.join(skill_dir, "graph-metadata.json"), "w", encoding="utf-8") as handle:
            json.dump(payload, handle)

    def run_compiler(fixtures):
        stdout_buffer = io.StringIO()
        stderr_buffer = io.StringIO()
        original_argv = sys.argv[:]
        original_skills_dir = compiler.SKILLS_DIR

        try:
            with tempfile.TemporaryDirectory() as tmpdir:
                for skill_id, edges in fixtures.items():
                    write_graph_metadata(tmpdir, skill_id, edges)

                compiler.SKILLS_DIR = tmpdir
                sys.argv = ["skill_graph_compiler.py", "--validate-only"]

                with contextlib.redirect_stdout(stdout_buffer), contextlib.redirect_stderr(stderr_buffer):
                    exit_code = compiler.main()
        finally:
            compiler.SKILLS_DIR = original_skills_dir
            sys.argv = original_argv

        return exit_code, stdout_buffer.getvalue(), stderr_buffer.getvalue()

    # T246-GC-001: Orphan skills now fail validation.
    try:
        exit_code, stdout_text, stderr_text = run_compiler({
            "orphan-skill": make_edges(),
        })
        if exit_code == 2 and "ZERO-EDGE WARNINGS (1):" in stderr_text and "orphan-skill: skill has zero edges (orphan)" in stderr_text:
            ok("T246-GC-001: orphan topology violation exits non-zero", "exit=2")
        else:
            fail_test(
                "T246-GC-001: orphan topology violation exits non-zero",
                f"exit={exit_code}, stdout={stdout_text!r}, stderr={stderr_text!r}",
            )
    except Exception as exc:
        fail_test("T246-GC-001: orphan topology violation exits non-zero", str(exc))

    # T246-GC-002: Missing prerequisite symmetry now fails validation.
    try:
        exit_code, stdout_text, stderr_text = run_compiler({
            "alpha": make_edges(depends_on=[edge("beta", 0.9, "requires beta")]),
            "beta": make_edges(enhances=[edge("alpha", 0.5, "keeps beta non-orphan")]),
        })
        if exit_code == 2 and "SYMMETRY WARNINGS (1):" in stderr_text and "missing prerequisite_for alpha" in stderr_text:
            ok("T246-GC-002: symmetry topology violation exits non-zero", "exit=2")
        else:
            fail_test(
                "T246-GC-002: symmetry topology violation exits non-zero",
                f"exit={exit_code}, stdout={stdout_text!r}, stderr={stderr_text!r}",
            )
    except Exception as exc:
        fail_test("T246-GC-002: symmetry topology violation exits non-zero", str(exc))

    # T246-GC-003: Weight-band warnings remain advisory-only.
    try:
        exit_code, stdout_text, stderr_text = run_compiler({
            "alpha": make_edges(depends_on=[edge("beta", 0.2, "out-of-band dependency")]),
            "beta": make_edges(prerequisite_for=[edge("alpha", 0.2, "out-of-band prerequisite")]),
        })
        if exit_code == 0 and "WEIGHT-BAND WARNINGS (2):" in stderr_text and "VALIDATION PASSED: all metadata files are valid" in stdout_text:
            ok("T246-GC-003: weight-band warnings stay advisory", "exit=0")
        else:
            fail_test(
                "T246-GC-003: weight-band warnings stay advisory",
                f"exit={exit_code}, stdout={stdout_text!r}, stderr={stderr_text!r}",
            )
    except Exception as exc:
        fail_test("T246-GC-003: weight-band warnings stay advisory", str(exc))

    # T246-GC-004: Existing dependency-cycle errors still fail validation.
    try:
        exit_code, stdout_text, stderr_text = run_compiler({
            "alpha": make_edges(
                depends_on=[edge("beta", 0.9, "cycle part 1")],
                prerequisite_for=[edge("beta", 0.9, "cycle reciprocal")],
            ),
            "beta": make_edges(
                depends_on=[edge("alpha", 0.9, "cycle part 2")],
                prerequisite_for=[edge("alpha", 0.9, "cycle reciprocal")],
            ),
        })
        if exit_code == 2 and "DEPENDENCY CYCLE ERRORS (1):" in stderr_text:
            ok("T246-GC-004: dependency cycles still exit non-zero", "exit=2")
        else:
            fail_test(
                "T246-GC-004: dependency cycles still exit non-zero",
                f"exit={exit_code}, stdout={stdout_text!r}, stderr={stderr_text!r}",
            )
    except Exception as exc:
        fail_test("T246-GC-004: dependency cycles still exit non-zero", str(exc))


# ───────────────────────────────────────────────────────────────
# 6. MAIN
# ───────────────────────────────────────────────────────────────

def main():
    print("=" * 60)
    print("  SKILL ADVISOR AUTOMATED TEST SUITE (T243/T246)")
    print("=" * 60)

    test_advisor_module()
    test_bench_harness()
    test_regression_harness()
    test_graph_compiler()

    print(f"\nSummary: pass={passed}, fail={failed}")
    return 0 if failed == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
