#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: SKILL ADVISOR
# ───────────────────────────────────────────────────────────────

"""
Skill Advisor - Analyzes user requests and recommends appropriate skills.
Used by Gate 2 in AGENTS.md for skill routing.

Usage: python skill_advisor.py "user request" [--threshold 0.8]
Output: JSON array of skill recommendations with confidence scores

Options:
    --stdin      Read the single prompt from stdin instead of argv
    --stdin-preferred  Prefer stdin for the single-prompt mode, falling back to argv when stdin is empty
    --health      Run health check diagnostics
    --validate-only  Run strict skill-graph validation
    --threshold   Confidence threshold used by default dual-threshold filtering (default: 0.8)
    --confidence-only  Explicitly bypass uncertainty filtering
"""

import argparse
import importlib.util
import json
import os
import re
import shutil
import sqlite3
import subprocess
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional, Set


# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────

# Path to skill directory.
# This script lives in .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/.
SCRIPT_DIR = os.path.dirname(os.path.realpath(__file__))
SKILLS_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, "..", "..", "..", ".."))
REPO_ROOT = os.path.dirname(os.path.dirname(SKILLS_DIR))
LOCAL_CCC_BIN = os.path.join(
    SKILLS_DIR,
    "mcp-coco-index",
    "mcp_server",
    ".venv",
    "bin",
    "ccc",
)
DISABLE_BUILTIN_SEMANTIC_ENV = "SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC"
DISABLE_ADVISOR_ENV = "SPECKIT_SKILL_ADVISOR_HOOK_DISABLED"
FORCE_LOCAL_ENV = "SPECKIT_SKILL_ADVISOR_FORCE_LOCAL"
NATIVE_TIMEOUT_SECONDS = 2.5
NATIVE_ADVISOR_STATUS = os.path.join(
    REPO_ROOT,
    ".opencode",
    "skill",
    "system-spec-kit",
    "mcp_server",
    "dist",
    "skill-advisor",
    "handlers",
    "advisor-status.js",
)
NATIVE_ADVISOR_COMPAT = os.path.join(
    REPO_ROOT,
    ".opencode",
    "skill",
    "system-spec-kit",
    "mcp_server",
    "dist",
    "skill-advisor",
    "compat",
    "index.js",
)

NATIVE_ADVISOR_BRIDGE = r"""
import { readFileSync } from 'node:fs';
import { readAdvisorStatus, handleAdvisorRecommend } from 'ADVISOR_COMPAT_MODULE';

const input = JSON.parse(readFileSync(0, 'utf8') || '{}');
const workspaceRoot = input.workspaceRoot || process.cwd();

function unavailable(reason) {
  return {
    available: false,
    freshness: 'unavailable',
    generation: 0,
    trustState: {
      state: 'unavailable',
      reason,
      generation: 0,
      checkedAt: new Date().toISOString(),
      lastLiveAt: null,
    },
    reason,
  };
}

function probe() {
  if (process.env.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED === '1') {
    return unavailable('ADVISOR_DISABLED');
  }
  try {
    const status = readAdvisorStatus({ workspaceRoot });
    return {
      available: status.freshness === 'live' || status.freshness === 'stale',
      freshness: status.freshness,
      generation: status.generation,
      trustState: status.trustState,
      daemonPid: status.daemonPid || null,
      reason: (status.errors && status.errors[0]) || status.trustState.reason || null,
    };
  } catch (error) {
    return unavailable((error && error.name ? error.name : 'PROBE_FAILED').toUpperCase().replace(/[^A-Z0-9_]/g, '_'));
  }
}

const probeResult = probe();
if (input.mode === 'status') {
  process.stdout.write(JSON.stringify({ status: 'ok', data: probeResult }));
} else if (!probeResult.available) {
  process.stdout.write(JSON.stringify({ status: 'unavailable', data: probeResult }));
} else {
  const response = await handleAdvisorRecommend({
    prompt: String(input.prompt || ''),
    options: {
      topK: Number.isFinite(input.topK) ? input.topK : 10,
      includeAbstainReasons: true,
      includeAttribution: false,
      confidenceThreshold: Number.isFinite(input.confidenceThreshold) ? input.confidenceThreshold : undefined,
      uncertaintyThreshold: Number.isFinite(input.uncertaintyThreshold) ? input.uncertaintyThreshold : undefined,
    },
  });
  const parsed = JSON.parse(response.content[0].text);
  process.stdout.write(JSON.stringify({
    status: parsed.status || 'ok',
    data: parsed.data,
    probe: probeResult,
  }));
}
"""

RUNTIME_PATH = os.path.join(SCRIPT_DIR, "skill_advisor_runtime.py")
_RUNTIME_SPEC = None
_runtime_module = None
_runtime_load_error: Optional[Exception] = None
try:
    _RUNTIME_SPEC = importlib.util.spec_from_file_location("skill_advisor_runtime", RUNTIME_PATH)
    if _RUNTIME_SPEC and _RUNTIME_SPEC.loader:
        _runtime_module = importlib.util.module_from_spec(_RUNTIME_SPEC)
        _RUNTIME_SPEC.loader.exec_module(_runtime_module)
except Exception as exc:  # pragma: no cover - startup safety
    _runtime_load_error = exc
    _runtime_module = None

if _runtime_module is None:
    raise RuntimeError(f"Failed to load runtime helpers from {RUNTIME_PATH}") from _runtime_load_error

# Compiled skill graph for relationship-aware routing
SKILL_GRAPH_PATH = os.path.join(SCRIPT_DIR, "skill-graph.json")
SKILL_GRAPH_COMPILER_PATH = os.path.join(SCRIPT_DIR, "skill_graph_compiler.py")
SKILL_GRAPH_SQLITE_PATH = os.path.normpath(os.path.join(
    os.path.dirname(__file__),
    '..',
    '..',
    'system-spec-kit',
    'mcp_server',
    'database',
    'skill-graph.sqlite',
))
GRAPH_ADJACENCY_EDGE_TYPES = ("depends_on", "enhances", "siblings", "prerequisite_for")
STRICT_TOPOLOGY_HEADERS = (
    ("DEPENDENCY CYCLE ERRORS", "dependency cycles"),
    ("SYMMETRY WARNINGS", "asymmetric edges"),
    ("ZERO-EDGE WARNINGS", "orphan skills"),
)
_SKILL_GRAPH: Optional[Dict[str, Any]] = None
_SKILL_GRAPH_SOURCE: Optional[str] = None
_SOURCE_METADATA_DIAGNOSTICS: Dict[str, List[Dict[str, str]]] = {
    "signal_map": [],
    "conflict_declarations": [],
}


def _file_url(path: str) -> str:
    """Return a minimal file URL for Node ESM dynamic imports."""
    return Path(path).resolve().as_uri()


def _native_bridge_source() -> str:
    """Render the inline Node bridge with absolute module URLs."""
    return (
        NATIVE_ADVISOR_BRIDGE
        .replace("ADVISOR_COMPAT_MODULE", _file_url(NATIVE_ADVISOR_COMPAT))
    )


def _native_bridge_available() -> bool:
    """Return True when compiled native advisor handlers are present."""
    return os.path.exists(NATIVE_ADVISOR_COMPAT)


def _sanitize_native_label(value: Any) -> Optional[str]:
    """Sanitize native labels before translating public compat output."""
    if not isinstance(value, str):
        return None
    cleaned = " ".join(value.split()).strip()
    if not cleaned or len(cleaned) > 160:
        return None
    if re.search(r"\b(ignore|override|forget|bypass|disable|execute|run|call|tool|developer|assistant|previous instructions|all instructions)\b", cleaned, re.I):
        return None
    if re.search(r"<!--|-->|```|<script\b|</script>|^\s*(system|instruction|developer|assistant)\s*:", cleaned, re.I):
        return None
    return cleaned


def _sanitize_native_label_list(value: Any) -> List[str]:
    """Return prompt-safe native label arrays."""
    if not isinstance(value, list):
        return []
    labels: List[str] = []
    for item in value:
        sanitized = _sanitize_native_label(item)
        if sanitized:
            labels.append(sanitized)
    return labels


def _run_native_bridge(payload: Dict[str, Any], timeout: float = NATIVE_TIMEOUT_SECONDS) -> Dict[str, Any]:
    """Call the compiled native MCP advisor handlers through a tiny Node bridge."""
    if not _native_bridge_available():
        return {
            "status": "unavailable",
            "data": {
                "available": False,
                "freshness": "unavailable",
                "generation": 0,
                "reason": "NATIVE_DIST_MISSING",
            },
        }

    try:
        result = subprocess.run(
            ["node", "--input-type=module", "-e", _native_bridge_source()],
            input=json.dumps(payload),
            capture_output=True,
            text=True,
            timeout=timeout,
            cwd=REPO_ROOT,
            env=os.environ.copy(),
        )
    except (FileNotFoundError, subprocess.TimeoutExpired, OSError) as exc:
        return {
            "status": "unavailable",
            "data": {
                "available": False,
                "freshness": "unavailable",
                "generation": 0,
                "reason": exc.__class__.__name__.upper(),
            },
        }

    if result.returncode != 0:
        return {
            "status": "unavailable",
            "data": {
                "available": False,
                "freshness": "unavailable",
                "generation": 0,
                "reason": "NATIVE_BRIDGE_NONZERO",
            },
        }

    try:
        parsed = json.loads(result.stdout or "{}")
    except json.JSONDecodeError:
        return {
            "status": "unavailable",
            "data": {
                "available": False,
                "freshness": "unavailable",
                "generation": 0,
                "reason": "NATIVE_BRIDGE_PARSE_FAILED",
            },
        }
    return parsed if isinstance(parsed, dict) else {"status": "unavailable", "data": {"available": False}}


def probe_native_advisor() -> Dict[str, Any]:
    """Probe native advisor availability without exposing prompt content."""
    if os.environ.get(FORCE_LOCAL_ENV) == "1":
        return {
            "available": False,
            "freshness": "unavailable",
            "generation": 0,
            "reason": "FORCE_LOCAL",
        }
    payload = {
        "mode": "status",
        "workspaceRoot": REPO_ROOT,
    }
    response = _run_native_bridge(payload)
    data = response.get("data") if isinstance(response, dict) else None
    return data if isinstance(data, dict) else {
        "available": False,
        "freshness": "unavailable",
        "generation": 0,
        "reason": "INVALID_NATIVE_PROBE",
    }


def _legacy_kind(skill_id: str) -> str:
    """Infer legacy CLI kind from the native skill id."""
    return "command" if skill_id.startswith("command-") else "skill"


def _legacy_recommendations_from_native(output: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Translate advisor_recommend output to the legacy JSON-array CLI contract."""
    recommendations = output.get("recommendations")
    if not isinstance(recommendations, list):
        return []

    legacy: List[Dict[str, Any]] = []
    for recommendation in recommendations:
        if not isinstance(recommendation, dict):
            continue
        skill_id = _sanitize_native_label(recommendation.get("skillId"))
        if not skill_id:
            continue
        item: Dict[str, Any] = {
            "skill": skill_id,
            "kind": _legacy_kind(skill_id),
            "confidence": recommendation.get("confidence", 0),
            "uncertainty": recommendation.get("uncertainty", 0.0),
            "passes_threshold": True,
            "reason": "Matched by native advisor_recommend",
            "source": "native",
        }
        if "score" in recommendation:
            item["score"] = recommendation["score"]
        if "dominantLane" in recommendation:
            item["dominant_lane"] = recommendation["dominantLane"]
        if "status" in recommendation:
            status = _sanitize_native_label(recommendation["status"])
            if status:
                item["status"] = status
        if "redirectFrom" in recommendation:
            item["redirect_from"] = _sanitize_native_label_list(recommendation["redirectFrom"])
        if "redirectTo" in recommendation:
            redirect_to = _sanitize_native_label(recommendation["redirectTo"])
            if redirect_to:
                item["redirect_to"] = redirect_to
        legacy.append(item)
    return legacy


def recommend_with_native_advisor(
    prompt: str,
    confidence_threshold: float = 0.8,
    uncertainty_threshold: float = 0.35,
    confidence_only: bool = False,
) -> Optional[List[Dict[str, Any]]]:
    """Return native recommendations when the MCP advisor surface is available."""
    response = _run_native_bridge({
        "mode": "recommend",
        "workspaceRoot": REPO_ROOT,
        "prompt": prompt,
        "topK": 10,
        "confidenceThreshold": confidence_threshold,
        "uncertaintyThreshold": 1.0 if confidence_only else uncertainty_threshold,
    })
    data = response.get("data") if isinstance(response, dict) else None
    if not isinstance(data, dict):
        return None
    if response.get("status") != "ok":
        return None
    return _legacy_recommendations_from_native(data)


def _log_skill_graph_warning(message: str) -> None:
    """Emit skill graph status messages to stderr for CLI visibility."""
    print(message, file=sys.stderr)


def _compute_hub_skills(adjacency: Dict[str, Dict[str, Dict[str, float]]]) -> List[str]:
    """Compute hub skills using the compiled-graph median inbound-degree rule."""
    inbound_counts: Dict[str, int] = {}

    for edge_groups in adjacency.values():
        for targets in edge_groups.values():
            for target in targets:
                inbound_counts[target] = inbound_counts.get(target, 0) + 1

    if not inbound_counts:
        return []

    counts = sorted(inbound_counts.values())
    median = counts[len(counts) // 2]
    return sorted(skill for skill, count in inbound_counts.items() if count > median)


def _normalize_signal_phrase(signal: str) -> str:
    """Normalize graph-declared signal phrases for stable matching."""
    return " ".join(signal.strip().lower().split())


def _expand_signal_variants(signal: str) -> Set[str]:
    """Build phrase variants from graph metadata signals and trigger phrases."""
    normalized = _normalize_signal_phrase(signal)
    if not normalized:
        return set()
    return {
        normalized,
        normalized.replace("-", " "),
        normalized.replace("_", " "),
        normalized.replace("-", "_"),
    }


def _extend_signal_map(
    signal_map: Dict[str, List[str]],
    skill_id: str,
    raw_signals: Any,
) -> None:
    """Merge normalized signal variants into a per-skill routing map."""
    if not isinstance(raw_signals, list) or not raw_signals:
        return

    existing = signal_map.setdefault(skill_id, [])
    seen = set(existing)
    for raw_signal in raw_signals:
        if not isinstance(raw_signal, str):
            continue
        for variant in sorted(_expand_signal_variants(raw_signal)):
            if variant and variant not in seen:
                existing.append(variant)
                seen.add(variant)


def _record_source_metadata_issue(surface: str, file_path: str, reason: str) -> None:
    """Record malformed source metadata so health checks cannot look green."""
    _SOURCE_METADATA_DIAGNOSTICS.setdefault(surface, []).append({
        "path": file_path,
        "reason": reason,
    })


def _source_metadata_health() -> Dict[str, Any]:
    """Summarize source metadata diagnostics collected by fallback loaders."""
    issues: List[Dict[str, str]] = []
    for surface, surface_issues in _SOURCE_METADATA_DIAGNOSTICS.items():
        for issue in surface_issues:
            issues.append({
                "surface": surface,
                "path": issue.get("path", ""),
                "reason": issue.get("reason", "unknown"),
            })
    return {
        "healthy": len(issues) == 0,
        "issue_count": len(issues),
        "issues": issues[:25],
    }


def _load_source_graph_signal_map() -> Dict[str, List[str]]:
    """Load intent signals and derived trigger phrases from source metadata files."""
    _SOURCE_METADATA_DIAGNOSTICS["signal_map"] = []
    signal_map: Dict[str, List[str]] = {}

    try:
        skill_entries = sorted(os.scandir(SKILLS_DIR), key=lambda entry: entry.name)
    except OSError as exc:
        _record_source_metadata_issue("signal_map", SKILLS_DIR, f"scan_failed:{exc.__class__.__name__}")
        return signal_map

    for entry in skill_entries:
        if not entry.is_dir():
            continue

        graph_metadata_path = os.path.join(entry.path, "graph-metadata.json")
        if not os.path.exists(graph_metadata_path):
            continue

        try:
            with open(graph_metadata_path, "r", encoding="utf-8") as handle:
                graph_metadata = json.load(handle)
        except (OSError, ValueError, json.JSONDecodeError) as exc:
            _record_source_metadata_issue("signal_map", graph_metadata_path, f"parse_failed:{exc.__class__.__name__}")
            continue

        if not isinstance(graph_metadata, dict):
            _record_source_metadata_issue("signal_map", graph_metadata_path, "invalid_shape")
            continue

        skill_id = str(graph_metadata.get("skill_id") or entry.name)
        _extend_signal_map(signal_map, skill_id, graph_metadata.get("intent_signals"))

        derived = graph_metadata.get("derived")
        if isinstance(derived, dict):
            _extend_signal_map(signal_map, skill_id, derived.get("trigger_phrases"))
        elif derived is not None:
            _record_source_metadata_issue("signal_map", graph_metadata_path, "invalid_derived")

    return signal_map


def _load_source_conflict_declarations() -> Dict[str, Set[str]]:
    """Read per-skill `graph-metadata.json` to recover directional conflict edges.

    T-SAP-04 (R46-002): defense-in-depth for the runtime conflict penalty. The
    compiled graph's `conflicts` is flattened into undirected pairs, so the
    runtime cannot detect unilateral-declaration asymmetry from that payload
    alone. The compiler's T-SGC-03 symmetry check gates against unilateral
    declarations at build time, but if a compiled graph is shipped that
    bypassed validation (e.g. a legacy JSON artifact), the runtime must
    refuse to penalize a non-declaring skill. This helper replays the
    per-skill `conflicts_with` arrays so the runtime can cross-check.
    """
    _SOURCE_METADATA_DIAGNOSTICS["conflict_declarations"] = []
    declarations: Dict[str, Set[str]] = {}

    try:
        skill_entries = sorted(os.scandir(SKILLS_DIR), key=lambda entry: entry.name)
    except OSError as exc:
        _record_source_metadata_issue("conflict_declarations", SKILLS_DIR, f"scan_failed:{exc.__class__.__name__}")
        return declarations

    for entry in skill_entries:
        if not entry.is_dir():
            continue

        graph_metadata_path = os.path.join(entry.path, "graph-metadata.json")
        if not os.path.exists(graph_metadata_path):
            continue

        try:
            with open(graph_metadata_path, "r", encoding="utf-8") as handle:
                graph_metadata = json.load(handle)
        except (OSError, ValueError, json.JSONDecodeError) as exc:
            _record_source_metadata_issue("conflict_declarations", graph_metadata_path, f"parse_failed:{exc.__class__.__name__}")
            continue

        if not isinstance(graph_metadata, dict):
            _record_source_metadata_issue("conflict_declarations", graph_metadata_path, "invalid_shape")
            continue

        skill_id = str(graph_metadata.get("skill_id") or entry.name)
        edges = graph_metadata.get("edges")
        if not isinstance(edges, dict):
            continue

        conflicts = edges.get("conflicts_with")
        if not isinstance(conflicts, list):
            continue

        for edge in conflicts:
            if not isinstance(edge, dict):
                continue
            target = edge.get("target")
            if isinstance(target, str) and target:
                declarations.setdefault(skill_id, set()).add(target)

    return declarations


def _load_skill_graph_sqlite() -> Optional[Dict[str, Any]]:
    """Load compiled-equivalent skill graph data from SQLite."""
    if not os.path.exists(SKILL_GRAPH_SQLITE_PATH):
        return None

    try:
        with sqlite3.connect(SKILL_GRAPH_SQLITE_PATH) as connection:
            connection.row_factory = sqlite3.Row

            node_rows = connection.execute(
                "SELECT id, family, intent_signals, derived FROM skill_nodes ORDER BY id ASC"
            ).fetchall()
            if not node_rows:
                return None

            edge_rows = connection.execute(
                """
                SELECT source_id, target_id, edge_type, weight
                FROM skill_edges
                ORDER BY source_id ASC, edge_type ASC, target_id ASC
                """
            ).fetchall()

            schema_row = connection.execute(
                "SELECT version FROM schema_version LIMIT 1"
            ).fetchone()
            generated_at_row = connection.execute(
                "SELECT value FROM skill_graph_metadata WHERE key = 'last_scan_timestamp'"
            ).fetchone()
            # T-SGC-02 / R45-003: durable topology-warning payload.
            topology_warnings_row = connection.execute(
                "SELECT value FROM skill_graph_metadata WHERE key = 'topology_warnings'"
            ).fetchone()
    except sqlite3.Error:
        return None

    try:
        families: Dict[str, List[str]] = {}
        adjacency: Dict[str, Dict[str, Dict[str, float]]] = {}
        signals: Dict[str, List[str]] = {}
        conflicts: Set[tuple[str, str]] = set()

        for node_row in node_rows:
            skill_id = str(node_row["id"])
            family = str(node_row["family"])
            families.setdefault(family, []).append(skill_id)

            raw_signals = node_row["intent_signals"]
            if raw_signals:
                _extend_signal_map(signals, skill_id, json.loads(raw_signals))

            raw_derived = node_row["derived"]
            if raw_derived:
                parsed_derived = json.loads(raw_derived)
                if isinstance(parsed_derived, dict):
                    _extend_signal_map(signals, skill_id, parsed_derived.get("trigger_phrases"))

        for edge_row in edge_rows:
            source_id = str(edge_row["source_id"])
            target_id = str(edge_row["target_id"])
            edge_type = str(edge_row["edge_type"])
            weight = float(edge_row["weight"])

            if edge_type == "conflicts_with":
                conflicts.add(tuple(sorted((source_id, target_id))))
                continue

            if edge_type not in GRAPH_ADJACENCY_EDGE_TYPES:
                continue

            adjacency.setdefault(source_id, {}).setdefault(edge_type, {})[target_id] = weight

        for family_name in families:
            families[family_name] = sorted(families[family_name])

        generated_at = (
            str(generated_at_row["value"])
            if generated_at_row and generated_at_row["value"]
            else None
        )

        schema_version = int(schema_row["version"]) if schema_row and schema_row["version"] is not None else 1

        # T-SGC-02: decode persisted topology warnings (best-effort; missing or
        # malformed payload degrades gracefully to empty).
        topology_warnings_payload: Dict[str, List[str]] = {}
        if topology_warnings_row and topology_warnings_row["value"]:
            try:
                decoded = json.loads(str(topology_warnings_row["value"]))
            except (TypeError, ValueError, json.JSONDecodeError):
                decoded = None
            if isinstance(decoded, dict):
                for category, messages in decoded.items():
                    if not isinstance(category, str):
                        continue
                    if not isinstance(messages, list):
                        continue
                    cleaned = sorted(str(m) for m in messages if isinstance(m, str) and m.strip())
                    if cleaned:
                        topology_warnings_payload[category] = cleaned

        return {
            "schema_version": schema_version,
            "generated_at": generated_at,
            "skill_count": len(node_rows),
            "families": dict(sorted(families.items())),
            "adjacency": dict(sorted(adjacency.items())),
            "signals": dict(sorted(signals.items())),
            "conflicts": [list(pair) for pair in sorted(conflicts)],
            "hub_skills": _compute_hub_skills(adjacency),
            "topology_warnings": dict(sorted(topology_warnings_payload.items())),
        }
    except (TypeError, ValueError, json.JSONDecodeError):
        return None


def _load_skill_graph_json() -> Optional[Dict[str, Any]]:
    """Load the legacy compiled JSON graph."""
    try:
        with open(SKILL_GRAPH_PATH, "r", encoding="utf-8") as f:
            graph = json.load(f)
    except (OSError, json.JSONDecodeError):
        return None

    if not isinstance(graph, dict):
        return None

    signal_map: Dict[str, List[str]] = {}
    for skill_id, raw_signals in (graph.get("signals") or {}).items():
        if isinstance(skill_id, str):
            _extend_signal_map(signal_map, skill_id, raw_signals)

    source_signal_map = _load_source_graph_signal_map()
    for skill_id, raw_signals in source_signal_map.items():
        _extend_signal_map(signal_map, skill_id, raw_signals)

    graph["signals"] = dict(sorted(signal_map.items()))

    # T-SGC-02 (R45-003): Normalize topology_warnings (older graphs may omit).
    raw_warnings = graph.get("topology_warnings")
    normalized_warnings: Dict[str, List[str]] = {}
    if isinstance(raw_warnings, dict):
        for category, messages in raw_warnings.items():
            if not isinstance(category, str) or not isinstance(messages, list):
                continue
            cleaned = sorted(str(m) for m in messages if isinstance(m, str) and m.strip())
            if cleaned:
                normalized_warnings[category] = cleaned
    graph["topology_warnings"] = dict(sorted(normalized_warnings.items()))
    return graph


def _load_skill_graph() -> Optional[Dict[str, Any]]:
    """Load compiled skill graph, preferring SQLite with JSON fallback."""
    global _SKILL_GRAPH, _SKILL_GRAPH_SOURCE
    if _SKILL_GRAPH is not None:
        return _SKILL_GRAPH

    sqlite_exists = os.path.exists(SKILL_GRAPH_SQLITE_PATH)
    json_exists = os.path.exists(SKILL_GRAPH_PATH)

    sqlite_graph = _load_skill_graph_sqlite()
    if sqlite_graph is not None:
        _SKILL_GRAPH = sqlite_graph
        _SKILL_GRAPH_SOURCE = "sqlite"
        _log_skill_graph_warning("Skill graph: loaded from SQLite")
        return _SKILL_GRAPH

    json_graph = _load_skill_graph_json()
    if json_graph is not None:
        _SKILL_GRAPH = json_graph
        _SKILL_GRAPH_SOURCE = "json"
        _log_skill_graph_warning("Skill graph: SQLite unavailable, using JSON fallback")
        return _SKILL_GRAPH

    if not sqlite_exists and not json_exists:
        compile_result = subprocess.run(
            [sys.executable, SKILL_GRAPH_COMPILER_PATH, '--export-json'],
            capture_output=True,
            text=True,
        )
        if compile_result.returncode == 0:
            json_graph = _load_skill_graph_json()
            if json_graph is not None:
                _SKILL_GRAPH = json_graph
                _SKILL_GRAPH_SOURCE = "json"
                _log_skill_graph_warning(
                    "Skill graph: auto-compiled JSON (run init-skill-graph.sh for full setup)"
                )
                return _SKILL_GRAPH
        else:
            compiler_error = (compile_result.stderr or compile_result.stdout).strip()
            if compiler_error:
                _log_skill_graph_warning(f"Skill graph: auto-compile failed ({compiler_error})")

    _SKILL_GRAPH_SOURCE = None
    return None


def _collect_strict_topology_violations(output: str) -> Dict[str, List[str]]:
    """Extract topology issues that strict validation must treat as fatal."""
    collected: Dict[str, List[str]] = {}
    active_category: Optional[str] = None
    header_to_category = dict(STRICT_TOPOLOGY_HEADERS)
    reset_headers = {
        "WEIGHT-BAND WARNINGS",
        "WEIGHT-PARITY WARNINGS",
        "VALIDATION PASSED",
        "VALIDATION FAILED",
    }

    for raw_line in output.splitlines():
        line = raw_line.rstrip()
        matched_header = next(
            (header for header in header_to_category if line.startswith(header)),
            None,
        )
        if matched_header is not None:
            active_category = header_to_category[matched_header]
            collected.setdefault(active_category, [])
            continue

        if any(line.startswith(header) for header in reset_headers):
            active_category = None
            continue

        if active_category and line.startswith("  - "):
            collected[active_category].append(line[4:])
            continue

        if line and not line.startswith(" "):
            active_category = None

    return {category: issues for category, issues in collected.items() if issues}


def run_skill_graph_validation(strict_topology: bool = False) -> int:
    """Run compiler validation and optionally fail hard on topology issues."""
    try:
        result = subprocess.run(
            [sys.executable, SKILL_GRAPH_COMPILER_PATH, "--validate-only"],
            capture_output=True,
            text=True,
        )
    except OSError as exc:
        print(f"Failed to run skill graph validator: {exc}", file=sys.stderr)
        return 2

    if result.stdout:
        print(result.stdout, end="")
    if result.stderr:
        print(result.stderr, end="", file=sys.stderr)

    if strict_topology:
        combined_output = "\n".join(part for part in (result.stdout, result.stderr) if part)
        topology_violations = _collect_strict_topology_violations(combined_output)
        if topology_violations:
            summary = ", ".join(
                f"{category}={len(topology_violations[category])}"
                for _, category in STRICT_TOPOLOGY_HEADERS
                if topology_violations.get(category)
            )
            print(
                f"STRICT TOPOLOGY VALIDATION FAILED: {summary}",
                file=sys.stderr,
            )
            return 2

    return result.returncode


def _apply_graph_boosts(
    skill_boosts: Dict[str, float],
    boost_reasons: Dict[str, List[str]],
) -> None:
    """Apply transitive boosts from skill graph relationships."""
    graph = _load_skill_graph()
    if not graph:
        return

    adjacency = graph.get("adjacency", {})
    snapshot = dict(skill_boosts)

    for skill_name, current_boost in snapshot.items():
        if current_boost <= 0:
            continue
        edges = adjacency.get(skill_name, {})

        for target, weight in edges.get("enhances", {}).items():
            transitive = current_boost * weight * 0.3
            if snapshot.get(target, 0) <= 0:
                continue
            if transitive >= 0.1:
                skill_boosts[target] = skill_boosts.get(target, 0) + transitive
                boost_reasons.setdefault(target, []).append(
                    f"!graph:enhances({skill_name},{weight:.1f})"
                )

        for target, weight in edges.get("siblings", {}).items():
            transitive = current_boost * weight * 0.15
            if snapshot.get(target, 0) <= 0:
                continue
            if transitive >= 0.1:
                skill_boosts[target] = skill_boosts.get(target, 0) + transitive
                boost_reasons.setdefault(target, []).append(
                    f"!graph:sibling({skill_name},{weight:.1f})"
                )

        for target, weight in edges.get("depends_on", {}).items():
            transitive = current_boost * weight * 0.2
            if snapshot.get(target, 0) <= 0:
                continue
            if transitive >= 0.1:
                skill_boosts[target] = skill_boosts.get(target, 0) + transitive
                boost_reasons.setdefault(target, []).append(
                    f"!graph:depends({skill_name},{weight:.1f})"
                )


def _apply_family_affinity(
    skill_boosts: Dict[str, float],
    boost_reasons: Dict[str, List[str]],
) -> None:
    """When one family member has a strong signal, lightly boost siblings."""
    graph = _load_skill_graph()
    if not graph:
        return
    families = graph.get("families", {})

    for family_name, members in families.items():
        boosted = [(m, skill_boosts.get(m, 0)) for m in members if skill_boosts.get(m, 0) > 1.0]
        if not boosted:
            continue
        max_boost = max(b for _, b in boosted)
        for member in members:
            if 0 < skill_boosts.get(member, 0) < 1.0 and max_boost > 1.5:
                affinity = max_boost * 0.08
                if affinity >= 0.1:
                    skill_boosts[member] = skill_boosts.get(member, 0) + affinity
                    boost_reasons.setdefault(member, []).append(f"!graph:family({family_name})")


def _signal_match_boost(signal_phrase: str) -> float:
    """Weight exact graph-signal matches by phrase specificity."""
    token_count = max(1, len(re.findall(r'\b\w+\b', signal_phrase)))
    return min(0.9 + 0.35 * (token_count - 1), 1.8)


def _apply_signal_boosts(
    prompt_lower: str,
    skill_boosts: Dict[str, float],
    boost_reasons: Dict[str, List[str]],
) -> None:
    """Apply routing boosts from graph intent signals and trigger phrases."""
    graph = _load_skill_graph()
    if not graph:
        return

    for skill_name, signal_phrases in (graph.get("signals") or {}).items():
        if not isinstance(signal_phrases, list):
            continue

        matched_signals: List[str] = []
        total_boost = 0.0
        for signal_phrase in signal_phrases:
            if not isinstance(signal_phrase, str):
                continue
            normalized = _normalize_signal_phrase(signal_phrase)
            if not normalized or normalized in matched_signals:
                continue
            if not _matches_phrase_boundary(prompt_lower, normalized):
                continue

            total_boost += max(_signal_match_boost(normalized) - 0.15 * len(matched_signals), 0.2)
            matched_signals.append(normalized)

        if not matched_signals:
            continue

        skill_boosts[skill_name] = skill_boosts.get(skill_name, 0.0) + min(total_boost, 3.0)
        reasons = boost_reasons.setdefault(skill_name, [])
        for matched_signal in matched_signals:
            reasons.append(f"!{matched_signal}(signal)")


def _apply_graph_conflict_penalty(recommendations: List[Dict[str, Any]]) -> None:
    """Increase uncertainty when conflicting skills are both recommended.

    T-SAP-04 (R46-002): defense-in-depth reciprocity check. The compiled graph
    promises that `conflicts` pairs are mutually declared (T-SGC-03 compiler
    gate), but the runtime re-verifies by reading per-skill
    `graph-metadata.json` before penalizing. If a pair is unilateral, the
    penalty is skipped — a unilateral metadata edit must not silently
    create a bilateral runtime penalty.
    """
    graph = _load_skill_graph()
    if not graph:
        return
    conflicts = graph.get("conflicts", [])
    if not conflicts:
        return

    declarations = _load_source_conflict_declarations()

    def _is_mutually_declared(a: str, b: str) -> bool:
        # Empty declarations map means per-skill metadata was unreadable;
        # trust the compiled graph in that case (backwards compat) so we
        # don't silently break existing routing when running outside the
        # repo checkout.
        if not declarations:
            return True
        return b in declarations.get(a, set()) and a in declarations.get(b, set())

    passing = {r["skill"] for r in recommendations if r.get("passes_threshold")}
    conflict_set: Set[str] = set()
    for pair in conflicts:
        if len(pair) != 2:
            continue
        a, b = pair[0], pair[1]
        if a not in passing or b not in passing:
            continue
        if not _is_mutually_declared(a, b):
            continue
        conflict_set.update(pair)

    for rec in recommendations:
        if rec["skill"] in conflict_set:
            rec["uncertainty"] = min(rec["uncertainty"] + 0.15, 1.0)

get_cache_status = _runtime_module.get_cache_status
get_cached_skill_records = _runtime_module.get_cached_skill_records
parse_frontmatter_fast = _runtime_module.parse_frontmatter_fast

# Comprehensive stop words - filtered from BOTH query AND corpus
# These words have no semantic meaning for skill matching
STOP_WORDS = frozenset({
    'a', 'about', 'able', 'actually', 'agent', 'all', 'also', 'an', 'and', 'any',
    'are', 'as', 'at', 'be', 'been', 'being', 'but', 'by', 'can', 'could', 'did',
    'do', 'does', 'even', 'for', 'from', 'get', 'give', 'go', 'going', 'had',
    'has', 'have', 'he', 'help', 'her', 'him', 'how', 'i', 'if', 'in', 'into',
    'is', 'it', 'its', 'just', 'let', 'like', 'may', 'me', 'might', 'more',
    'most', 'must', 'my', 'need', 'no', 'not', 'now', 'of', 'on', 'only', 'or',
    'other', 'our', 'please', 'really', 'she', 'should', 'skill',
    'so', 'some', 'tell', 'that', 'the', 'them', 'then', 'these', 'they',
    'thing', 'things', 'this', 'those', 'to', 'tool', 'try', 'us',
    'used', 'using', 'very', 'want', 'was', 'way', 'we', 'were', 'what', 'when',
    'where', 'which', 'who', 'why', 'will', 'with', 'would', 'you', 'your'
})

# Synonym expansion - maps user intent to technical terms in SKILL.md
SYNONYM_MAP = {
    # Code structure & analysis
    "ast": ["treesitter", "syntax", "parse", "structure"],
    "codebase": ["code", "project", "repository", "source"],
    "functions": ["methods", "definitions", "symbols"],
    "classes": ["types", "definitions", "structure"],
    "symbols": ["definitions", "functions", "classes", "exports"],
    
    # Git & version control
    "branch": ["git", "commit", "merge", "checkout"],
    "commit": ["git", "version", "push", "branch", "changes"],
    "merge": ["git", "branch", "commit", "rebase"],
    "push": ["git", "commit", "remote", "branch"],
    "rebase": ["git", "branch", "commit", "history"],
    "stash": ["git", "changes", "temporary"],
    "worktree": ["git", "branch", "workspace", "isolation"],
    "git": ["commit", "branch", "version", "push", "merge", "worktree"],
    "pull": ["git", "fetch", "merge", "remote"],
    "clone": ["git", "repository", "download"],
    
    # Memory & context preservation
    "context": ["memory", "session", "save"],
    "remember": ["memory", "context", "save", "store"],
    "save": ["context", "memory", "preserve", "store"],
    "recall": ["memory", "search", "find", "retrieve"],
    "forget": ["memory", "delete", "remove"],
    "checkpoint": ["memory", "save", "restore", "backup"],
    "history": ["memory", "context", "past", "previous"],
    "memory": ["context", "session", "save", "store", "database", "vector", "embedding", "index"],
    "session": ["memory", "context", "conversation"],
    "preserve": ["memory", "save", "context", "store"],
    "store": ["memory", "save", "context", "persist"],
    
    # Documentation
    "doc": ["documentation", "explain", "describe", "markdown"],
    "docs": ["documentation", "explain", "describe", "markdown"],
    "document": ["documentation", "markdown", "write"],
    "write": ["documentation", "create", "generate"],
    "readme": ["documentation", "markdown", "explain"],
    "flowchart": ["documentation", "diagram", "ascii"],
    "diagram": ["documentation", "flowchart", "visual"],
    
    # Spec & planning
    "plan": ["spec", "architect", "design", "roadmap", "breakdown"],
    "spec": ["specification", "plan", "document", "folder"],
    "folder": ["spec", "directory", "create", "organize"],
    "scaffold": ["create", "generate", "new", "template"],
    "template": ["scaffold", "create", "generate"],
    
    # Debugging & browser
    "bug": ["debug", "error", "issue", "defect", "verification"],
    "console": ["chrome", "browser", "debug", "log"],
    "devtools": ["chrome", "browser", "debug", "inspect"],
    "network": ["chrome", "browser", "requests", "debug"],
    "inspect": ["chrome", "browser", "debug", "devtools"],
    "breakpoint": ["debug", "chrome", "devtools"],
    "screenshot": ["capture", "image", "browser", "chrome", "devtools"],
    "error": ["bug", "debug", "fix", "issue"],
    "issue": ["bug", "debug", "error", "problem"],

    # Web development, accessibility & cross-cutting concerns
    "layout": ["css", "frontend", "responsive", "grid", "flexbox"],
    "accessibility": ["aria", "wcag", "a11y", "semantic", "keyboard"],
    "aria": ["accessibility", "wcag", "a11y", "role", "label"],
    "audit": ["validate", "verify", "check", "review", "inspect"],
    "deployment": ["deploy", "release", "publish", "cdn", "build"],
    "handler": ["function", "callback", "listener", "event", "hook"],
    "export": ["download", "output", "generate", "har", "asset"],
    "toolchain": ["call_tool_chain", "code_mode", "utcp", "mcp"],
    "conflict": ["merge", "rebase", "resolution", "branch", "diverge"],

    # Gemini CLI & cross-AI
    "gemini": ["gemini-cli", "google-ai", "cross-ai", "second-opinion", "delegate"],

    # Autoresearch
    "autoresearch": ["research", "loop", "iterative", "deep", "autonomous", "convergence"],
    "improvement": ["optimize", "refine", "candidate", "score", "loop"],
    "candidate": ["proposal", "variant", "experiment", "score"],
    "proposal": ["candidate", "experiment", "loop", "score"],
    "evaluator": ["score", "judge", "contract", "rubric"],
    "handover": ["continuation", "resume", "session", "document"],

    # Search & discovery
    "find": ["search", "locate", "explore", "lookup"],
    "search": ["find", "locate", "explore", "query", "lookup"],
    "where": ["find", "search", "locate", "navigate"],
    "lookup": ["find", "search", "locate"],
    "explore": ["search", "find", "navigate", "discover"],
    "navigate": ["find", "search", "locate", "goto"],
    "locate": ["find", "search", "where"],
    
    # Actions & creation
    "create": ["implement", "build", "generate", "new", "add", "scaffold"],
    "make": ["create", "implement", "build", "generate"],
    "new": ["create", "implement", "scaffold", "generate"],
    "add": ["create", "implement", "new", "insert"],
    "build": ["create", "implement", "generate"],
    "generate": ["create", "build", "scaffold"],
    
    # Code quality & fixes
    "check": ["verify", "validate", "test"],
    "fix": ["debug", "correct", "resolve", "code", "implementation"],
    "refactor": ["structure", "organize", "clean", "improve", "code"],
    "test": ["verify", "validate", "check", "spec", "quality"],
    "verify": ["check", "validate", "test", "confirm"],
    "validate": ["check", "verify", "test"],
    
    # Prompt engineering
    "prompt": ["enhance", "improve", "optimize", "engineering", "framework"],
    "enhance": ["prompt", "improve", "optimize", "refine"],

    # Understanding & explanation
    "help": ["guide", "assist", "documentation", "explain"],
    "how": ["understand", "explain", "works", "meaning"],
    "what": ["definition", "structure", "outline", "list"],
    "why": ["understand", "explain", "reason", "purpose"],
    "explain": ["understand", "how", "works", "describe"],
    "understand": ["how", "explain", "learn", "works"],
    "works": ["how", "understand", "explain", "function"],
    
    # Display & output
    "show": ["list", "display", "outline", "tree"],
    "list": ["show", "display", "enumerate"],
    "display": ["show", "list", "output"],
    "print": ["show", "display", "output"],
}

# Intent boosters - High-confidence keyword → skill direct mapping
# These keywords strongly indicate a specific skill, adding bonus score
# Format: keyword -> (skill_name, boost_amount)
# NOTE: These are checked BEFORE stop word filtering, so question words work here
# Score formula: Two-tiered based on intent boost presence
#   - With intent boost: confidence = min(0.50 + score * 0.15, 0.95)
#   - Without intent boost: confidence = min(0.25 + score * 0.15, 0.95)
# To reach 0.8 threshold with intent boost: need score >= 2.0
INTENT_BOOSTERS = {
    # ─────────────────────────────────────────────────────────────────
    # SYSTEM-SPEC-KIT: Context preservation, recall, and specification
    # (Memory functionality merged into system-spec-kit)
    # ─────────────────────────────────────────────────────────────────
    "checkpoint": ("system-spec-kit", 0.6),
    "context": ("system-spec-kit", 0.6),
    "database": ("system-spec-kit", 0.4),
    "embedding": ("system-spec-kit", 0.5),
    "embeddings": ("system-spec-kit", 0.5),
    "forget": ("system-spec-kit", 0.4),
    "history": ("system-spec-kit", 0.4),
    "index": ("system-spec-kit", 0.4),
    "memory": ("system-spec-kit", 0.8),
    "preserve": ("system-spec-kit", 0.5),
    "recall": ("system-spec-kit", 0.6),
    "reindex": ("system-spec-kit", 0.6),
    "remember": ("system-spec-kit", 0.6),
    "restore": ("system-spec-kit", 0.4),
    "session": ("system-spec-kit", 0.4),
    "store": ("system-spec-kit", 0.4),
    "vector": ("system-spec-kit", 0.5),
    "voyage": ("system-spec-kit", 0.5),

    # ─────────────────────────────────────────────────────────────────
    # SYSTEM-SPEC-KIT: Specification and planning
    # ─────────────────────────────────────────────────────────────────
    "checklist": ("system-spec-kit", 0.5),
    "folder": ("system-spec-kit", 0.4),
    "plan": ("system-spec-kit", 0.5),
    "scaffold": ("system-spec-kit", 0.4),
    "spec": ("system-spec-kit", 0.6),
    "specification": ("system-spec-kit", 0.5),
    "speckit": ("system-spec-kit", 0.8),
    "task": ("system-spec-kit", 0.3),
    "tasks": ("system-spec-kit", 0.4),
    
    # ─────────────────────────────────────────────────────────────────
    # SK-AUTORESEARCH: Autonomous deep research loop
    # ─────────────────────────────────────────────────────────────────
    "autoresearch": ("sk-deep-research", 2.0),
    "convergence": ("sk-deep-research", 0.8),

    # ─────────────────────────────────────────────────────────────────
    # WORKFLOWS-GIT: Version control operations
    # ─────────────────────────────────────────────────────────────────
    "git": ("sk-git", 1.0),
    "branch": ("sk-git", 0.4),
    "checkout": ("sk-git", 0.5),
    "clone": ("sk-git", 0.5),
    "commit": ("sk-git", 0.5),
    "conflict": ("sk-git", 0.6),
    "deploy": ("sk-git", 0.5),
    "diff": ("sk-git", 0.5),
    "fetch": ("sk-git", 0.4),
    "gh": ("sk-git", 1.5),
    "github": ("sk-git", 2.0),
    "issue": ("sk-git", 0.8),
    "log": ("sk-git", 0.4),
    "merge": ("sk-git", 0.5),
    "pr": ("sk-git", 0.8),
    "pull": ("sk-git", 0.5),
    "push": ("sk-git", 0.5),
    "rebase": ("sk-git", 0.8),
    "repo": ("sk-git", 0.6),
    "repository": ("sk-git", 0.5),
    "stash": ("sk-git", 0.5),
    "worktree": ("sk-git", 1.2),

    # ─────────────────────────────────────────────────────────────────
    # SK-CODE--REVIEW: Stack-agnostic code review baseline
    # ─────────────────────────────────────────────────────────────────
    "review": ("sk-code-review", 1.2),
    "findings": ("sk-code-review", 1.1),
    "blocker": ("sk-code-review", 0.9),
    "blockers": ("sk-code-review", 0.9),
    "vulnerability": ("sk-code-review", 1.0),
    "regression": ("sk-code-review", 0.8),
    "audit": ("sk-code-review", 1.0),
    "solid": ("sk-code-review", 0.9),
    "readiness": ("sk-code-review", 0.8),

    # ─────────────────────────────────────────────────────────────────
    # MCP-CHROME-DEVTOOLS: Browser debugging
    # ─────────────────────────────────────────────────────────────────
    "bdg": ("mcp-chrome-devtools", 1.0),
    "breakpoint": ("mcp-chrome-devtools", 0.6),
    "browser": ("mcp-chrome-devtools", 1.2),
    "chrome": ("mcp-chrome-devtools", 1.0),
    "console": ("mcp-chrome-devtools", 1.0),
    "debug": ("mcp-chrome-devtools", 0.6),
    "debugger": ("mcp-chrome-devtools", 1.0),
    "devtools": ("mcp-chrome-devtools", 1.2),
    "dom": ("mcp-chrome-devtools", 0.5),
    "elements": ("mcp-chrome-devtools", 0.5),
    "inspect": ("mcp-chrome-devtools", 1.0),
    "network": ("mcp-chrome-devtools", 0.8),
    "performance": ("mcp-chrome-devtools", 0.5),
    "screenshot": ("mcp-chrome-devtools", 2.0),
    
    # ─────────────────────────────────────────────────────────────────
    # WORKFLOWS-DOCUMENTATION: Documentation and diagrams
    # ─────────────────────────────────────────────────────────────────
    "ascii": ("sk-doc", 0.4),
    "diagram": ("sk-doc", 0.4),
    "document": ("sk-doc", 0.5),
    "documentation": ("sk-doc", 0.6),
    "flowchart": ("sk-doc", 0.7),
    "markdown": ("sk-doc", 0.5),
    "readme": ("sk-doc", 0.5),
    "template": ("sk-doc", 0.4),

    # ─────────────────────────────────────────────────────────────────
    # WORKFLOWS-CODE--WEB-DEV: Implementation and verification (frontend/Webflow)
    # ─────────────────────────────────────────────────────────────────
    "a11y": ("sk-code-web", 0.6),
    "accessibility": ("sk-code-web", 0.6),
    "animation": ("sk-code-web", 0.8),
    "aria": ("sk-code-web", 0.6),
    "bug": ("sk-code-web", 0.5),
    "css": ("sk-code-web", 0.9),
    "debugging": ("sk-code-web", 0.7),
    "error": ("sk-code-web", 0.4),
    "frontend": ("sk-code-web", 0.5),
    "implement": ("sk-code-web", 0.6),
    "layout": ("sk-code-web", 0.6),
    "networking": ("sk-code-web", 0.5),
    "refactor": ("sk-code-web", 0.5),
    "responsive": ("sk-code-web", 0.6),
    "tracing": ("sk-code-web", 0.5),
    "verification": ("sk-code-web", 0.5),
    "wcag": ("sk-code-web", 0.5),

    # ─────────────────────────────────────────────────────────────────
    # SK-CODE--OPENCODE: OpenCode system code standards
    # (JavaScript MCP, Python scripts, Shell scripts, JSONC configs)
    # ─────────────────────────────────────────────────────────────────
    "opencode": ("sk-code-opencode", 2.0),
    "mcp": ("sk-code-opencode", 1.5),
    "python": ("sk-code-opencode", 1.0),
    "shell": ("sk-code-opencode", 1.0),
    "bash": ("sk-code-opencode", 1.0),
    "jsonc": ("sk-code-opencode", 1.5),
    "shebang": ("sk-code-opencode", 1.2),
    "snake_case": ("sk-code-opencode", 1.0),
    "docstring": ("sk-code-opencode", 0.8),
    "jsdoc": ("sk-code-opencode", 0.8),
    "commonjs": ("sk-code-opencode", 1.0),
    "require": ("sk-code-opencode", 0.6),
    "strict": ("sk-code-opencode", 0.5),

    # ─────────────────────────────────────────────────────────────────
    # CLI-GEMINI: Cross-AI orchestration via Gemini CLI
    # ─────────────────────────────────────────────────────────────────
    "gemini": ("cli-gemini", 2.0),
    "grounding": ("cli-gemini", 1.0),

    # ─────────────────────────────────────────────────────────────────────────────────
    # CLI-CODEX: Cross-AI orchestration via OpenAI Codex CLI
    # ─────────────────────────────────────────────────────────────────────────────────
    "codex": ("cli-codex", 2.0),

    # ─────────────────────────────────────────────────────────────────────────────────
    # CLI-CLAUDE-CODE: Cross-AI orchestration via Anthropic Claude Code CLI
    # ─────────────────────────────────────────────────────────────────────────────────

    # ─────────────────────────────────────────────────────────────────────────────────
    # CLI-COPILOT: Cross-AI orchestration via GitHub Copilot CLI
    # ─────────────────────────────────────────────────────────────────────────────────
    "copilot": ("cli-copilot", 2.0),

    # ─────────────────────────────────────────────────────────────────
    # MCP-CODE-MODE: External tool integration
    # ─────────────────────────────────────────────────────────────────
    "clickup": ("mcp-clickup", 2.5),
    "cu": ("mcp-clickup", 2.0),
    "sprint": ("mcp-clickup", 1.0),
    "standup": ("mcp-clickup", 1.0),
    "cms": ("mcp-code-mode", 0.5),
    "component": ("mcp-code-mode", 0.4),
    "external": ("mcp-code-mode", 0.4),
    "figma": ("mcp-figma", 2.2),
    "notion": ("mcp-code-mode", 2.5),
    "page": ("mcp-code-mode", 0.4),
    "pages": ("mcp-code-mode", 0.4),
    "site": ("mcp-code-mode", 0.6),
    "sites": ("mcp-code-mode", 0.6),
    "toolchain": ("mcp-code-mode", 0.6),
    "typescript": ("sk-code-opencode", 0.8),
    "utcp": ("mcp-code-mode", 0.8),
    "webflow": ("mcp-code-mode", 2.5),

    # ─────────────────────────────────────────────────────────────────
    # SK-PROMPT-IMPROVER: Prompt engineering and enhancement
    # ─────────────────────────────────────────────────────────────────
    "prompt": ("sk-improve-prompt", 1.5),
    "prompts": ("sk-improve-prompt", 1.2),
    "enhance": ("sk-improve-prompt", 1.2),
    "rcaf": ("sk-improve-prompt", 2.0),
    "costar": ("sk-improve-prompt", 2.0),
    "crispe": ("sk-improve-prompt", 2.0),
    "craft": ("sk-improve-prompt", 1.5),
    "depth": ("sk-improve-prompt", 1.5),
    "ricce": ("sk-improve-prompt", 1.5),
    "scoring": ("sk-improve-prompt", 0.8),

    # ─────────────────────────────────────────────────────────────────
    # MCP-COCO-INDEX: Semantic code search via vector embeddings
    # ─────────────────────────────────────────────────────────────────
    "cocoindex": ("mcp-coco-index", 2.5),
    "coco": ("mcp-coco-index", 1.5),
    "ccc": ("mcp-coco-index", 2.0),
    "semantic": ("mcp-coco-index", 1.5),
    "discover": ("mcp-coco-index", 0.6),
    "implementation": ("mcp-coco-index", 0.5),
}

# Ambiguous keywords that should boost MULTIPLE skills
# Format: keyword -> list of (skill_name, boost_amount)
MULTI_SKILL_BOOSTERS = {
    "api": [("mcp-code-mode", 0.2), ("sk-code-web", 0.5)],
    "audit": [("sk-code-review", 0.6), ("system-spec-kit", 0.3), ("mcp-chrome-devtools", 0.3), ("sk-code-web", 0.2)],
    "chain": [("mcp-code-mode", 0.3)],
    "changes": [("sk-git", 0.4), ("system-spec-kit", 0.2)],
    "discover": [("mcp-coco-index", 0.5)],
    "css": [("sk-code-web", 0.6), ("mcp-chrome-devtools", 0.3)],
    "code": [("sk-code-web", 0.2), ("sk-code-opencode", 0.1)],
    "context": [("system-spec-kit", 0.4)],
    "deployment": [("sk-code-web", 0.4), ("sk-git", 0.3)],
    "export": [("mcp-figma", 0.3), ("mcp-chrome-devtools", 0.2)],
    "handler": [("sk-code-web", 0.3), ("mcp-code-mode", 0.2)],
    "layout": [("sk-code-web", 0.5), ("mcp-chrome-devtools", 0.2)],
    "mobile": [("sk-code-web", 0.3), ("mcp-chrome-devtools", 0.2)],
    "mcp": [("mcp-code-mode", 0.3), ("sk-code-opencode", 0.4)],
    "plan": [("system-spec-kit", 0.3), ("sk-code-web", 0.2)],
    "save": [("system-spec-kit", 0.4), ("sk-git", 0.2)],
    "script": [("sk-code-opencode", 0.4)],
    "server": [("sk-code-opencode", 0.3), ("mcp-code-mode", 0.2)],
    "session": [("system-spec-kit", 0.5)],
    "standards": [("sk-code-opencode", 0.4), ("sk-code-web", 0.2)],
    "style": [("sk-code-opencode", 0.2), ("sk-code-web", 0.4)],
    "task": [("system-spec-kit", 0.3)],
    "test": [("sk-code-web", 0.3), ("mcp-chrome-devtools", 0.2)],
    "update": [("mcp-code-mode", 0.3), ("sk-git", 0.2), ("sk-code-web", 0.2)],
    "review": [("sk-code-review", 0.8)],
    "delegate": [("cli-gemini", 0.5), ("cli-codex", 0.5), ("cli-claude-code", 0.5), ("cli-copilot", 0.5)],
    "opinion": [("cli-gemini", 0.3), ("cli-codex", 0.3), ("cli-claude-code", 0.3), ("cli-copilot", 0.3), ("sk-code-review", 0.2)],
    "validate": [("cli-gemini", 0.2), ("cli-codex", 0.2), ("cli-claude-code", 0.2), ("cli-copilot", 0.2), ("sk-code-review", 0.3)],
    "improve": [("sk-improve-prompt", 0.6), ("sk-code-web", 0.2)],
    "enhance": [("sk-improve-prompt", 0.8)],
    "refine": [("sk-improve-prompt", 0.6), ("sk-code-web", 0.2)],
    "framework": [("sk-improve-prompt", 0.5)],
}

# Phrase-level intent boosters for high-signal multi-token requests
# Format: phrase -> list of (skill_name, boost_amount)
# NOTE: INTENT_BOOSTERS only matches single-word tokens after
# `all_tokens = re.findall(r'\b\w+\b', prompt_lower)` tokenizes the raw prompt.
# PHRASE_INTENT_BOOSTERS matches multi-word phrases against the raw prompt text
# before tokenization via `if phrase in prompt_lower`.
# NEVER add keys containing spaces or hyphens to INTENT_BOOSTERS - the tokenizer
# splits them, making those keys unreachable at runtime.
# When in doubt, if the key has any whitespace OR hyphen, use
# PHRASE_INTENT_BOOSTERS.
PHRASE_INTENT_BOOSTERS = {
    "create documentation": [("sk-doc", 1.0)],
    "write documentation": [("sk-doc", 1.5)],
    "write docs": [("sk-doc", 1.2)],
    "generate documentation": [("sk-doc", 1.2)],
    "save context": [("system-spec-kit", 1.0)],
    "save memory": [("system-spec-kit", 1.0)],
    "save this context": [("system-spec-kit", 1.0)],
    "save conversation": [("system-spec-kit", 1.0)],
    "save conversation context": [("system-spec-kit", 1.0)],
    "save this conversation context": [("system-spec-kit", 1.0)],
    "code review": [("sk-code-review", 2.4)],
    "pr review": [("sk-code-review", 2.3), ("sk-git", 0.4)],
    "security review": [("sk-code-review", 2.2)],
    "review this pr": [("sk-code-review", 2.4)],
    "review this diff": [("sk-code-review", 2.2)],
    "quality gate": [("sk-code-review", 2.0)],
    "quality gate validation": [("sk-code-review", 1.8)],
    "request changes": [("sk-code-review", 2.0)],
    "race conditions": [("sk-code-review", 1.5)],
    "auth bugs": [("sk-code-review", 1.5)],
    "code audit": [("sk-code-review", 2.2)],
    "audit this code": [("sk-code-review", 2.3)],
    "check this code": [("sk-code-review", 2.0)],
    "check for issues": [("sk-code-review", 2.0)],
    "solid violations": [("sk-code-review", 2.2)],
    "solid principles": [("sk-code-review", 2.0)],
    "merge readiness": [("sk-code-review", 2.2), ("sk-git", 0.4)],
    "ready to merge": [("sk-code-review", 2.2), ("sk-git", 0.4)],
    "implement feature": [("sk-code-web", 0.9)],
    "responsive css": [("sk-code-web", 1.2)],
    "responsive css layout": [("sk-code-web", 1.4)],
    "responsive css layout fix": [("sk-code-web", 2.2)],
    "layout fix": [("sk-code-web", 1.0)],
    "browser verification checklist": [("sk-code-web", 1.6)],
    "css animation": [("sk-code-web", 0.8)],
    "api network": [("sk-code-web", 0.7), ("mcp-chrome-devtools", 0.4)],
    "webflow deployment guidance": [("sk-code-web", 1.8)],
    "external tool integration via code mode": [("mcp-code-mode", 2.0)],
    "template level validation": [("system-spec-kit", 0.8)],
    "spec folder workflow": [("system-spec-kit", 1.8)],
    "resume prior session context": [("system-spec-kit", 1.8)],
    "validate spec packet": [("system-spec-kit", 1.6)],
    "constitutional memory": [("system-spec-kit", 1.7)],
    # --- Autoresearch deep research loop ---
    "deep research": [("sk-deep-research", 2.5)],
    "research loop": [("sk-deep-research", 2.5)],
    "autoresearch": [("sk-deep-research", 3.0)],
    "/autoresearch": [("sk-deep-research", 3.0)],
    "auto research": [("sk-deep-research", 2.8)],
    "autonomous research": [("sk-deep-research", 2.5)],
    "iterative research": [("sk-deep-research", 2.5)],
    "multi-round research": [("sk-deep-research", 2.0)],
    "overnight research": [("sk-deep-research", 2.0)],
    # --- Agent improvement loop ---
    "agent improvement": [("sk-improve-agent", 2.8)],
    "recursive agent": [("sk-improve-agent", 2.8)],
    "improvement loop": [("sk-improve-agent", 2.8)],
    "agent improvement loop": [("sk-improve-agent", 3.2)],
    "proposal-only improvement": [("sk-improve-agent", 2.6)],
    "proposal only improvement": [("sk-improve-agent", 2.6)],
    "proposal only": [("sk-improve-agent", 1.4)],
    "evaluator-first": [("sk-improve-agent", 2.4)],
    "bounded mutator": [("sk-improve-agent", 2.2)],
    "candidate scoring": [("sk-improve-agent", 2.3)],
    "promotion gate": [("sk-improve-agent", 2.0)],
    "handover target": [("sk-improve-agent", 2.0)],
    "sk-improve-agent": [("sk-improve-agent", 3.2)],
    "/sk-improve-agent": [("sk-improve-agent", 3.2)],
    "sk-agent-improvement-loop": [("sk-improve-agent", 3.0)],
    "/sk-agent-improvement-loop": [("sk-improve-agent", 3.0)],
    "5-dimension": [("sk-improve-agent", 1.8)],
    "5-dimension agent scoring": [("sk-improve-agent", 2.8)],
    "5-dimension evaluation": [("sk-improve-agent", 2.8)],
    "5d agent scoring": [("sk-improve-agent", 2.8)],
    "5d scoring": [("sk-improve-agent", 1.8)],
    "integration scanning": [("sk-improve-agent", 2.6)],
    "integration scan": [("sk-improve-agent", 1.6)],
    "dynamic profiling": [("sk-improve-agent", 2.6)],
    "dynamic profile": [("sk-improve-agent", 1.6)],
    "evaluate agent quality": [("sk-improve-agent", 2.8)],
    "score agent dimensions": [("sk-improve-agent", 2.8)],
    "agent integration surface": [("sk-improve-agent", 2.6)],
    "/improve:agent": [("sk-improve-agent", 3.2)],
    "/improve:prompt": [("sk-improve-prompt", 3.2)],
    "improve agent": [("sk-improve-agent", 2.8)],
    "score agent": [("sk-improve-agent", 2.6)],
    "evaluate agent": [("sk-improve-agent", 2.6)],
    "agent evaluation": [("sk-improve-agent", 2.6)],
    # --- CocoIndex semantic code search ---
    "semantic search": [("mcp-coco-index", 2.5)],
    "code search": [("mcp-coco-index", 2.0)],
    "vector search": [("mcp-coco-index", 2.0)],
    "concept search": [("mcp-coco-index", 2.0)],
    "cocoindex search": [("mcp-coco-index", 2.8)],
    "coco index": [("mcp-coco-index", 2.5)],
    "find implementation": [("mcp-coco-index", 1.5)],
    "find usage": [("mcp-coco-index", 1.2)],
    "find code that": [("mcp-coco-index", 1.8)],
    "similar code": [("mcp-coco-index", 2.0)],
    "where is the logic": [("mcp-coco-index", 1.5)],
    "search codebase": [("mcp-coco-index", 2.2)],
    "code that handles": [("mcp-coco-index", 1.5)],
    "find implementations": [("mcp-coco-index", 2.0)],
    "find similar": [("mcp-coco-index", 1.8)],
    "semantic code search": [("mcp-coco-index", 2.5)],
    "how is.*implemented": [("mcp-coco-index", 1.2)],
    "how does.*work": [("mcp-coco-index", 1.0)],
    "mcp-coco-index": [("mcp-coco-index", 2.8)],
    "/mcp-coco-index": [("mcp-coco-index", 2.8)],
    ".opencode/skill/mcp-coco-index": [("mcp-coco-index", 3.0)],
    "convergence detection": [("sk-deep-research", 2.0)],
    # --- Deep review mode (iterative code audit) ---
    "deep review": [("sk-deep-review", 2.5)],
    "review loop": [("sk-deep-review", 2.5)],
    "iterative review": [("sk-deep-review", 2.5)],
    "code audit loop": [("sk-deep-review", 2.5)],
    "review mode": [("sk-deep-review", 2.0)],
    "release readiness review": [("sk-deep-review", 2.0)],
    "spec folder review": [("sk-deep-review", 2.0), ("sk-code-review", 0.8)],
    "review convergence": [("sk-deep-review", 2.5)],
    "auto review release readiness": [("sk-deep-review", 7.0)],
    "auto review security audit": [("sk-deep-review", 2.5)],
    "auto review audit": [("sk-deep-review", 2.2)],
    "auto review loop": [("sk-deep-review", 2.5)],
    ":review": [("sk-deep-review", 3.0)],
    ":review:auto": [("sk-deep-review", 3.0)],
    ":review:confirm": [("sk-deep-review", 3.0)],
    "figma css": [("mcp-figma", 0.8), ("sk-code-web", 0.4)],
    "mcp server code": [("sk-code-opencode", 1.8)],
    "system code style guidance": [("sk-code-opencode", 1.7)],
    "python shell json standards": [("sk-code-opencode", 1.9)],
    "full stack development workflow": [("sk-code-full-stack", 2.1)],
    "implementation testing verification flow": [("sk-code-full-stack", 1.8)],
    "detect project stack automatically": [("sk-code-full-stack", 1.6)],
    "full stack typescript": [("sk-code-opencode", 0.8)],
    "sk-code-review": [("sk-code-review", 2.8)],
    "/sk-code-review": [("sk-code-review", 2.8)],
    ".opencode/skill/sk-code-review": [("sk-code-review", 3.0)],
    # --- Gemini CLI cross-AI orchestration ---
    "use gemini": [("cli-gemini", 2.5)],
    "gemini cli": [("cli-gemini", 2.5)],
    "gemini agent": [("cli-gemini", 2.0)],
    "google search grounding": [("cli-gemini", 2.0)],
    "second opinion": [("cli-gemini", 1.5)],
    "cross-ai validation": [("cli-gemini", 2.0)],
    "cross-ai review": [("cli-gemini", 2.0), ("sk-code-review", 0.4)],
    "codebase investigator": [("cli-gemini", 2.0)],
    "delegate to gemini": [("cli-gemini", 2.5)],
    "cli-gemini": [("cli-gemini", 2.8)],
    "/cli-gemini": [("cli-gemini", 2.8)],
    ".opencode/skill/cli-gemini": [("cli-gemini", 3.0)],
    # --- Codex CLI cross-AI orchestration ---
    "use codex": [("cli-codex", 2.5)],
    "codex cli": [("cli-codex", 2.5)],
    "codex agent": [("cli-codex", 2.0)],
    "codex review": [("cli-codex", 2.0), ("sk-code-review", 0.4)],
    "cross-ai codex": [("cli-codex", 2.0)],
    "delegate to codex": [("cli-codex", 2.5)],
    "cli-codex": [("cli-codex", 2.8)],
    "/cli-codex": [("cli-codex", 2.8)],
    ".opencode/skill/cli-codex": [("cli-codex", 3.0)],
    # --- Claude Code CLI cross-AI orchestration ---
    "use claude code": [("cli-claude-code", 2.5)],
    "claude code cli": [("cli-claude-code", 2.5)],
    "delegate to claude code": [("cli-claude-code", 2.5)],
    "extended thinking": [("cli-claude-code", 2.0)],
    "deep reasoning": [("cli-claude-code", 1.5)],
    "claude code review": [("cli-claude-code", 2.0), ("sk-code-review", 0.4)],
    "cross-ai claude": [("cli-claude-code", 2.0)],
    "cli-claude-code": [("cli-claude-code", 2.8)],
    "/cli-claude-code": [("cli-claude-code", 2.8)],
    ".opencode/skill/cli-claude-code": [("cli-claude-code", 3.0)],
    # --- Copilot CLI cross-AI orchestration ---
    "use copilot": [("cli-copilot", 2.5)],
    "copilot cli": [("cli-copilot", 2.5)],
    "delegate to copilot": [("cli-copilot", 2.5)],
    "cloud delegation": [("cli-copilot", 2.0)],
    "copilot plan mode": [("cli-copilot", 2.0)],
    "copilot agent": [("cli-copilot", 2.0)],
    "copilot autopilot": [("cli-copilot", 2.0)],
    "cli-copilot": [("cli-copilot", 2.8)],
    "/cli-copilot": [("cli-copilot", 2.8)],
    ".opencode/skill/cli-copilot": [("cli-copilot", 3.0)],
    # --- Prompt Improver: prompt engineering and enhancement ---
    "improve my prompt": [("sk-improve-prompt", 2.5)],
    "improve this prompt": [("sk-improve-prompt", 2.5)],
    "enhance this prompt": [("sk-improve-prompt", 2.5)],
    "enhance my prompt": [("sk-improve-prompt", 2.5)],
    "prompt engineering": [("sk-improve-prompt", 2.5)],
    "prompt improvement": [("sk-improve-prompt", 2.5)],
    "create a prompt": [("sk-improve-prompt", 2.0)],
    "optimize this prompt": [("sk-improve-prompt", 2.2)],
    "optimize prompt": [("sk-improve-prompt", 2.2)],
    "refine this prompt": [("sk-improve-prompt", 2.2)],
    "clear scoring": [("sk-improve-prompt", 2.0)],
    "depth processing": [("sk-improve-prompt", 2.0)],
    "sk-improve-prompt": [("sk-improve-prompt", 2.8)],
    "/sk-improve-prompt": [("sk-improve-prompt", 2.8)],
    ".opencode/skill/sk-improve-prompt": [("sk-improve-prompt", 3.0)],

    # ─────────────────────────────────────────────────────────────────
    # FOLLOW-UP: Hyphenated-token migrations from INTENT_BOOSTERS
    # (tokenizer splits on hyphen via \b\w+\b — same bug as whitespace keys)
    # ─────────────────────────────────────────────────────────────────
    "proposal-only": [("sk-improve-agent", 1.4)],
    "openai-cli": [("cli-codex", 1.5)],
    "claude-code": [("cli-claude-code", 2.0)],
    "claude-cli": [("cli-claude-code", 1.5)],
    "extended-thinking": [("cli-claude-code", 1.0)],
    "copilot-cli": [("cli-copilot", 1.5)],
    "cloud-delegation": [("cli-copilot", 1.0)],
    "clickup-cli": [("mcp-clickup", 1.5)],
    "task-management": [("mcp-clickup", 1.0)],
    "tidd-ec": [("sk-improve-prompt", 2.0)],
}

DEFAULT_CONFIDENCE_THRESHOLD = 0.8
DEFAULT_UNCERTAINTY_THRESHOLD = 0.35

COMMAND_BRIDGES = {
    # ─────────────────────────────────────────────────────────────────
    # T-SAP-03 (R46-001): per-subcommand bridges for /spec_kit family.
    # Previously all /spec_kit:* subcommands collapsed to `command-spec-kit`
    # at `kind_priority=2`, so `/spec_kit:deep-research` lost its owning-skill
    # signal (should route to `sk-deep-research`, not `command-spec-kit`).
    # Dict insertion order IS iteration order in Python 3.7+, so the specific
    # subcommand markers MUST appear BEFORE the deprecated generic bridge —
    # `detect_explicit_command_intent()` returns on the first marker match.
    # Execution-mode suffixes (:auto, :confirm, :with-phases, :with-research)
    # are substring-matched inside each bridge and do NOT need separate entries.
    # ─────────────────────────────────────────────────────────────────
    "command-spec-kit-plan": {
        "description": "Run the SpecKit 8-step planning workflow using /spec_kit:plan.",
        "slash_markers": ["/spec_kit:plan", "spec_kit:plan"],
        "owning_skill": "system-spec-kit",
    },
    "command-spec-kit-complete": {
        "description": "Run the full SpecKit 14+ step lifecycle using /spec_kit:complete.",
        "slash_markers": ["/spec_kit:complete", "spec_kit:complete"],
        "owning_skill": "system-spec-kit",
    },
    "command-spec-kit-implement": {
        "description": "Run the SpecKit 9-step implementation workflow using /spec_kit:implement.",
        "slash_markers": ["/spec_kit:implement", "spec_kit:implement"],
        "owning_skill": "system-spec-kit",
    },
    "command-spec-kit-deep-research": {
        "description": "Run the autonomous deep-research loop using /spec_kit:deep-research.",
        "slash_markers": ["/spec_kit:deep-research", "spec_kit:deep-research"],
        "owning_skill": "sk-deep-research",
    },
    "command-spec-kit-deep-review": {
        "description": "Run the autonomous deep-review loop using /spec_kit:deep-review.",
        "slash_markers": ["/spec_kit:deep-review", "spec_kit:deep-review"],
        "owning_skill": "sk-deep-review",
    },
    "command-spec-kit-resume": {
        "description": "Resume an existing spec folder using /spec_kit:resume.",
        "slash_markers": ["/spec_kit:resume", "spec_kit:resume"],
        "owning_skill": "system-spec-kit",
    },
    # Legacy bridge retained for 1-release compatibility; deprecated.
    # MUST come AFTER the per-subcommand bridges so specific markers win.
    "command-spec-kit": {
        "description": "[DEPRECATED: use per-subcommand bridges] /spec_kit slash-command family; routes generic /spec_kit or spec_kit: prompts without a specific subcommand.",
        "slash_markers": ["/spec_kit", "spec_kit:"],
        "deprecated": True,
        "owning_skill": "system-spec-kit",
    },
    "command-memory-save": {
        "description": "Save conversation context to memory using /memory:save.",
        "slash_markers": ["/memory:save", "memory:save"],
        "owning_skill": "system-spec-kit",
    },
    "command-improve-agent": {
        "description": "Evaluate and improve any agent across 5 dimensions using /improve:agent.",
        "slash_markers": ["/improve:agent", "improve:agent"],
    },
    "command-improve-prompt": {
        "description": "Create or improve AI prompts using /improve:prompt.",
        "slash_markers": ["/improve:prompt", "improve:prompt"],
    },
    "command-create-agent": {
        "description": "Create a new OpenCode agent using /create:agent.",
        "slash_markers": ["/create:agent", "create:agent"],
    },
    "command-create-changelog": {
        "description": "Create a changelog entry using /create:changelog.",
        "slash_markers": ["/create:changelog", "create:changelog"],
    },
    "command-create-sk-skill": {
        "description": "Create or update an OpenCode skill using /create:sk-skill.",
        "slash_markers": ["/create:sk-skill", "create:sk-skill"],
    },
    "command-create-feature-catalog": {
        "description": "Create or update a feature catalog using /create:feature-catalog.",
        "slash_markers": ["/create:feature-catalog", "create:feature-catalog"],
    },
    "command-create-testing-playbook": {
        "description": "Create or update a testing playbook using /create:testing-playbook.",
        "slash_markers": ["/create:testing-playbook", "create:testing-playbook"],
    },
    "command-create-folder-readme": {
        "description": "Create folder README documentation using /create:folder_readme.",
        "slash_markers": ["/create:folder_readme", "create:folder_readme"],
    },
}

COMMAND_BRIDGE_OWNER_NORMALIZATION = {
    "command-spec-kit-resume": "system-spec-kit",
    "command-spec-kit-deep-research": "sk-deep-research",
    "command-spec-kit-deep-review": "sk-deep-review",
}

COMMAND_BRIDGE_EXPLICIT_ALIASES = {
    # The canonical Python regression contract treats /spec_kit:plan as the
    # command family bridge. Deep loop/resume subcommands keep their narrower
    # owners because they enforce distinct skill-owned state machines.
    "command-spec-kit-plan": "command-spec-kit",
}

COMMAND_TARGET_IMPLEMENTATION_MARKERS = (
    "add",
    "bridge",
    "carve-out",
    "carve out",
    "command bridge",
    "command target",
    "command-only",
    "command-surface",
    "command surface",
    "guard",
    "implement",
    "implementation",
    "mapping",
    "modify",
    "normalize",
    "normalization",
    "refactor",
    "router",
    "scorer",
    "test",
    "unit test",
    "update",
)

COMMAND_WORKFLOW_INVOCATION_MARKERS = (
    "execute",
    "kick off",
    "launch",
    "run",
    "start",
    "use",
)

# ───────────────────────────────────────────────────────────────
# 1b. COCOINDEX SEMANTIC SEARCH CONFIGURATION
# ───────────────────────────────────────────────────────────────

# Multiplier applied to CocoIndex relevance score (0-1) to produce an advisor boost.
# With score=0.95 and multiplier=3.0 → boost=2.85 (enough for intent-boosted 0.80+ confidence).
SEMANTIC_BOOST_MULTIPLIER = 3.0

# Rank-decay factor: earlier results get more weight. Position 0 → 1.0, position 4 → 0.4.
SEMANTIC_RANK_DECAY = 0.15

# Subprocess timeout for built-in ccc search (seconds).
COCOINDEX_TIMEOUT = 5

# Max results from CocoIndex when using built-in search.
COCOINDEX_LIMIT = 5

AUTO_SEMANTIC_PHRASES = (
    "find code that",
    "search the codebase",
    "search the code base",
    "search semantically",
    "how does",
    "how is",
    "where is the logic",
    "where is",
    "implementation of",
    "implemented across",
    "patterns for",
    "graceful error",
)

AUTO_SEMANTIC_DISCOVERY_TOKENS = {
    "auth",
    "authentication",
    "authorization",
    "code",
    "codebase",
    "feature",
    "graceful",
    "implementation",
    "implemented",
    "logic",
    "middleware",
    "pattern",
    "patterns",
    "recovery",
    "retry",
}

AUTO_SEMANTIC_TRIGGER_TOKENS = {
    "find",
    "how",
    "search",
    "semantic",
    "where",
}

EXACT_MATCH_PHRASES = (
    "exact string",
    "exact text",
    "literal string",
    "regular expression",
    "regex pattern",
    "todo comments",
    "import statements",
    "find usages of",
    "find references to",
)

# Pattern to extract skill folder name from file paths within the skill directory.
_SKILL_PATH_RE = re.compile(r'\.opencode/skill/([^/]+)/')

INTENT_NORMALIZATION_RULES = {
    "review": {
        "phrases": ["code review", "pr review", "security review", "quality gate", "request changes"],
        "tokens": {"review", "audit", "regression", "findings", "readiness", "vulnerability"},
        "boosts": [("sk-code-review", 0.8)],
    },
    "implementation": {
        "phrases": ["implement feature", "fix bug", "refactor module", "build feature"],
        "tokens": {"implement", "fix", "refactor", "build", "bug", "feature"},
        "boosts": [("sk-code-web", 0.35)],
    },
    "documentation": {
        "phrases": ["create documentation", "write readme", "install guide", "markdown docs"],
        "tokens": {"documentation", "document", "readme", "markdown", "guide", "flowchart", "diagram"},
        "boosts": [("sk-doc", 0.45)],
    },
    "memory": {
        "phrases": ["save context", "save memory", "remember this", "restore checkpoint"],
        "tokens": {"memory", "context", "checkpoint", "remember", "restore", "session", "preserve"},
        "boosts": [("system-spec-kit", 0.6)],
    },
    "tooling": {
        "phrases": ["use mcp", "code mode", "chrome devtools", "use figma", "use webflow"],
        "tokens": {"mcp", "devtools", "chrome", "figma", "webflow", "clickup", "notion", "toolchain"},
        "boosts": [("mcp-code-mode", 0.3), ("mcp-chrome-devtools", 0.3), ("mcp-clickup", 0.3)],
    },
}


# ───────────────────────────────────────────────────────────────
# 2. SKILL LOADING
# ───────────────────────────────────────────────────────────────

def parse_frontmatter(file_path: str) -> Optional[Dict[str, str]]:
    """Extract frontmatter using fast parser (frontmatter-only reads)."""
    try:
        return parse_frontmatter_fast(file_path)
    except (ValueError, AttributeError, TypeError, KeyError) as exc:  # pragma: no cover - safety fallback
        print(
            f"Warning: Failed to parse frontmatter from {file_path} "
            f"({type(exc).__name__}: {exc})",
            file=sys.stderr,
        )
        return None


def _normalize_terms(text: str) -> Set[str]:
    """Split text into normalized search terms while filtering stop words."""
    terms = re.findall(r'\b\w+\b', text.lower())
    return {term for term in terms if len(term) > 2 and term not in STOP_WORDS}


def _build_variants(skill_name: str) -> Set[str]:
    """Build slash, dollar, and spacing variants for a skill identifier."""
    lowered = skill_name.lower()
    return {
        lowered,
        f"${lowered}",
        f"/{lowered}",
        lowered.replace('-', ' '),
        lowered.replace('-', '_'),
    }


def _matches_phrase_boundary(text: str, phrase: str) -> bool:
    """Return True when a keyword phrase appears on token boundaries."""
    if not phrase:
        return False
    pattern = re.compile(rf"(?<!\w){re.escape(phrase)}(?!\w)")
    return pattern.search(text) is not None


def _build_inline_record(
    name: str,
    description: str,
    kind: str,
    source: str,
    path: Optional[str] = None,
    extra_variants: Optional[Set[str]] = None,
) -> Dict[str, Any]:
    """Create an in-memory skill or command record with normalized metadata."""
    variants = _build_variants(name)
    if extra_variants:
        variants.update(extra_variants)

    return {
        "name": name,
        "description": description,
        "kind": kind,
        "source": source,
        "path": path,
        "name_terms": _normalize_terms(name.replace('-', ' ')),
        "corpus_terms": _normalize_terms(description),
        "variants": variants,
    }


def get_skills(force_refresh: bool = False) -> Dict[str, Dict[str, Any]]:
    """Return skill + command records with cached discovery metadata."""
    skills = get_cached_skill_records(SKILLS_DIR, STOP_WORDS, force_refresh=force_refresh)

    for command_name, command_config in COMMAND_BRIDGES.items():
        markers = set(command_config.get("slash_markers", []))
        skills[command_name] = _build_inline_record(
            name=command_name,
            description=command_config["description"],
            kind="command",
            source="bridge",
            path=None,
            extra_variants=markers,
        )

    return skills


# ───────────────────────────────────────────────────────────────
# 2b. COCOINDEX SEMANTIC SEARCH
# ───────────────────────────────────────────────────────────────

def _resolve_skill_from_path(
    file_path: str,
    skills: Dict[str, Dict[str, Any]],
) -> Optional[str]:
    """Map a CocoIndex result file path to a known skill name.

    Extracts the skill folder name from paths like
    ``.opencode/skill/sk-git/SKILL.md`` and matches against loaded skills.
    """
    match = _SKILL_PATH_RE.search(file_path)
    if not match:
        return None
    folder_name = match.group(1)

    # Direct match (most common — folder name equals skill name)
    if folder_name in skills:
        return folder_name

    # Fallback: check if a skill's source path contains this folder
    for name, config in skills.items():
        skill_path = config.get("path", "")
        if skill_path and folder_name in skill_path:
            return name

    return None


def _cocoindex_search_builtin(
    query: str,
    project_root: str,
    limit: int = COCOINDEX_LIMIT,
) -> List[Dict[str, Any]]:
    """Run semantic search via ``ccc search`` and return parsed hits.

    Returns a list of ``{"path": str, "score": float}`` dicts.
    Falls back to an empty list on any error (binary missing, daemon down,
    timeout, unexpected output).

    Searches the entire codebase (no path filter) because skill SKILL.md
    files may not be indexed, but other files reference them.
    """
    ccc_bin = resolve_cocoindex_binary()
    if not ccc_bin:
        return []

    try:
        env = os.environ.copy()
        env["COCOINDEX_CODE_ROOT_PATH"] = project_root
        result = subprocess.run(
            [ccc_bin, "search", query, "--limit", str(limit * 2)],
            capture_output=True,
            text=True,
            timeout=COCOINDEX_TIMEOUT,
            cwd=project_root,
            env=env,
        )
        if result.returncode != 0:
            return []
        return _parse_ccc_output(result.stdout, limit)
    except (FileNotFoundError, subprocess.TimeoutExpired, OSError):
        return []


# Pattern for ``--- Result N (score: X.XXX) ---`` header lines.
_CCC_RESULT_RE = re.compile(r'---\s*Result\s+\d+\s*\(score:\s*([0-9.]+)\)\s*---')
# Pattern for ``File: path:lines [language]`` lines.
_CCC_FILE_RE = re.compile(r'^File:\s*(\S+)')


def _parse_ccc_output(stdout: str, limit: int = COCOINDEX_LIMIT) -> List[Dict[str, Any]]:
    """Extract skill references from ``ccc search`` text output.

    Output format per result::

        --- Result N (score: X.XXX) ---
        File: path/to/file.ext:start-end [language]
        <content snippet>

    We scan both the ``File:`` path AND the content snippet for
    ``.opencode/skill/<name>/`` references, mapping each to a skill hit.
    """
    hits: List[Dict[str, Any]] = []
    seen_folders: set = set()
    current_score: float = 0.5

    for line in stdout.splitlines():
        # Check for result header with score
        score_match = _CCC_RESULT_RE.match(line)
        if score_match:
            current_score = float(score_match.group(1))
            continue

        # Check for File: line — the file path itself might be a skill file
        file_match = _CCC_FILE_RE.match(line)
        if file_match:
            file_path = file_match.group(1)
            skill_match = _SKILL_PATH_RE.search(file_path)
            if skill_match:
                folder = skill_match.group(1)
                if folder not in seen_folders:
                    seen_folders.add(folder)
                    hits.append({"path": f".opencode/skill/{folder}/SKILL.md", "score": min(current_score, 1.0)})
            continue

        # Scan content lines for skill path references
        for skill_ref in _SKILL_PATH_RE.finditer(line):
            folder = skill_ref.group(1)
            if folder not in seen_folders:
                seen_folders.add(folder)
                hits.append({"path": f".opencode/skill/{folder}/SKILL.md", "score": min(current_score, 1.0)})

        if len(hits) >= limit:
            break

    return hits[:limit]


def _apply_semantic_boosts(
    semantic_hits: List[Dict[str, Any]],
    skills: Dict[str, Dict[str, Any]],
    skill_boosts: Dict[str, float],
    boost_reasons: Dict[str, List[str]],
) -> None:
    """Blend CocoIndex semantic search results into keyword scoring.

    Each hit contributes a boost proportional to its relevance score and
    inversely proportional to its rank position (earlier = more boost).
    Semantic hits are treated as intent evidence (``has_intent_boost=True``).
    """
    for rank, hit in enumerate(semantic_hits):
        path = hit.get("path", "")
        score = float(hit.get("score", 0.5))
        skill_name = _resolve_skill_from_path(path, skills)
        if not skill_name:
            continue

        # Rank decay: position 0 → 1.0, position 4 → 0.4
        rank_factor = max(0.3, 1.0 - rank * SEMANTIC_RANK_DECAY)
        boost = score * SEMANTIC_BOOST_MULTIPLIER * rank_factor

        skill_boosts[skill_name] = skill_boosts.get(skill_name, 0) + boost
        boost_reasons.setdefault(skill_name, []).append(
            f"!semantic(rank={rank + 1},score={score:.2f})"
        )


def resolve_cocoindex_binary() -> Optional[str]:
    """Return the preferred CocoIndex binary path, favoring the repo-local install."""
    if os.path.isfile(LOCAL_CCC_BIN) and os.access(LOCAL_CCC_BIN, os.X_OK):
        return LOCAL_CCC_BIN
    return shutil.which("ccc")


def built_in_semantic_search_disabled() -> bool:
    """Return True when external CocoIndex lookup is disabled via environment."""
    value = os.environ.get(DISABLE_BUILTIN_SEMANTIC_ENV, "").strip().lower()
    return value in {"1", "true", "yes", "on"}


def is_exact_match_prompt(prompt_lower: str, tokens: List[str]) -> bool:
    """Return True when the prompt is explicitly asking for exact-text search."""
    if any(phrase in prompt_lower for phrase in EXACT_MATCH_PHRASES):
        return True
    exact_tokens = {"exact", "identifier", "identifiers", "literal", "regex", "regexp", "symbol", "symbols"}
    return bool(exact_tokens.intersection(tokens))


def should_auto_use_semantic_search(prompt: str) -> bool:
    """Decide whether semantic search should run automatically for this prompt."""
    prompt_lower = prompt.lower()
    tokens = re.findall(r'\b\w+\b', prompt_lower)

    if not prompt.strip():
        return False
    if is_exact_match_prompt(prompt_lower, tokens):
        return False
    if not resolve_cocoindex_binary():
        return False

    if any(phrase in prompt_lower for phrase in AUTO_SEMANTIC_PHRASES):
        return True

    token_set = set(tokens)
    return bool(AUTO_SEMANTIC_TRIGGER_TOKENS.intersection(token_set)) and bool(
        AUTO_SEMANTIC_DISCOVERY_TOKENS.intersection(token_set)
    )


def expand_query(prompt_tokens: List[str]) -> List[str]:
    """Expand user tokens with synonyms for better matching."""
    expanded = set(prompt_tokens)
    for token in prompt_tokens:
        if token in SYNONYM_MAP:
            expanded.update(SYNONYM_MAP[token])
    return list(expanded)


def detect_explicit_command_intent(prompt_lower: str) -> Optional[str]:
    """Return targeted command bridge when explicit slash markers are present."""
    for command_name, command_config in COMMAND_BRIDGES.items():
        for marker in command_config.get("slash_markers", []):
            if marker and marker in prompt_lower:
                return COMMAND_BRIDGE_EXPLICIT_ALIASES.get(command_name, command_name)
    return None


def _command_bridge_references(command_name: str) -> Set[str]:
    """Return command bridge strings that can appear as quoted implementation refs."""
    command_config = COMMAND_BRIDGES.get(command_name, {})
    references = {command_name, command_name.replace("-", " ")}
    for marker in command_config.get("slash_markers", []):
        if isinstance(marker, str) and marker:
            references.add(marker.lower())
    return references


def _has_quoted_command_reference(prompt_lower: str, references: Set[str]) -> bool:
    """Detect command strings quoted as text rather than invoked as workflows."""
    if not references:
        return False

    quoted_segments = re.findall(r"`[^`]+`|\"[^\"]+\"|'[^']+'", prompt_lower)
    return any(any(reference in segment for reference in references) for segment in quoted_segments)


def _quoted_command_reference_is_workflow_invocation(
    prompt_lower: str,
    references: Set[str],
) -> bool:
    """Return True when a quoted command is still being invoked as a workflow."""
    stripped = prompt_lower.strip()
    quote_prefixed_command = any(
        any(stripped.startswith(f"{quote}{reference}") for quote in ("`", '"', "'"))
        for reference in references
    )
    if quote_prefixed_command:
        return True

    return any(marker in prompt_lower for marker in COMMAND_WORKFLOW_INVOCATION_MARKERS)


def _should_guard_command_bridge_normalization(prompt_lower: str, command_name: str) -> bool:
    """Return True when a command bridge is itself the implementation target.

    Command-surface normalization is intended for workflow invocation prompts
    (for example "run /memory:save"), not prompts that quote a command string
    or ask to edit/test the command bridge implementation itself.
    """
    references = _command_bridge_references(command_name)
    if _has_quoted_command_reference(prompt_lower, references) and not (
        _quoted_command_reference_is_workflow_invocation(prompt_lower, references)
    ):
        return True

    command_name_referenced = command_name in prompt_lower or command_name.replace("-", " ") in prompt_lower
    if not command_name_referenced:
        return False

    return any(marker in prompt_lower for marker in COMMAND_TARGET_IMPLEMENTATION_MARKERS)


def normalize_command_bridge_recommendations(
    ranked: List[Dict[str, Any]],
    prompt_lower: str,
) -> List[Dict[str, Any]]:
    """Normalize top command bridge recommendations back to owning skills."""
    if not ranked:
        return ranked

    top = ranked[0]
    command_name = str(top.get("skill", ""))
    owning_skill = COMMAND_BRIDGE_OWNER_NORMALIZATION.get(command_name)
    if not owning_skill:
        return ranked
    if _should_guard_command_bridge_normalization(prompt_lower, command_name):
        return ranked

    owner_index = next(
        (index for index, item in enumerate(ranked) if item.get("skill") == owning_skill),
        None,
    )
    owner = ranked[owner_index] if owner_index is not None else None
    normalized = dict(owner or top)

    normalized["skill"] = owning_skill
    normalized["kind"] = "skill"
    normalized["confidence"] = max(
        float(top.get("confidence", 0.0)),
        float(normalized.get("confidence", 0.0)),
    )
    normalized["uncertainty"] = min(
        float(top.get("uncertainty", 1.0)),
        float(normalized.get("uncertainty", 1.0)),
    )
    normalized["passes_threshold"] = bool(top.get("passes_threshold")) or bool(
        normalized.get("passes_threshold")
    )
    reason = str(normalized.get("reason", "")).strip()
    note = f"[command-normalized: {command_name}->{owning_skill}]"
    normalized["reason"] = f"{reason} {note}".strip()
    normalized["_kind_priority"] = max(
        int(top.get("_kind_priority", 0)),
        int(normalized.get("_kind_priority", 0)),
    )
    normalized["_explicit_skill_match"] = bool(top.get("_explicit_skill_match")) or bool(
        normalized.get("_explicit_skill_match")
    )

    removed = {0}
    if owner_index is not None:
        removed.add(owner_index)
    return [normalized] + [item for index, item in enumerate(ranked) if index not in removed]


def apply_intent_normalization(
    prompt_lower: str,
    tokens: List[str],
    skill_boosts: Dict[str, float],
    boost_reasons: Dict[str, List[str]],
) -> List[str]:
    """Apply lightweight canonical intent boosts before main scoring."""
    detected: List[str] = []
    token_set = set(tokens)

    for intent_name, config in INTENT_NORMALIZATION_RULES.items():
        matched = any(phrase in prompt_lower for phrase in config["phrases"]) or bool(token_set.intersection(config["tokens"]))
        if not matched:
            continue

        detected.append(intent_name)
        for skill_name, boost in config["boosts"]:
            skill_boosts[skill_name] = skill_boosts.get(skill_name, 0.0) + boost
            boost_reasons.setdefault(skill_name, []).append(f"!intent:{intent_name}")

    return detected


# ───────────────────────────────────────────────────────────────
# 3. SCORING
# ───────────────────────────────────────────────────────────────

def calculate_confidence(score: float, has_intent_boost: bool) -> float:
    """
    Calculate confidence score using two-tiered formula.

    The formula distinguishes between queries that match explicit intent keywords
    (INTENT_BOOSTERS) versus those that only match description corpus terms.

    With intent boost (keyword directly matched in INTENT_BOOSTERS):
        confidence = min(0.50 + score * 0.15, 0.95)
        Examples:
        - score=2.0 → 0.80 (meets 0.8 threshold)
        - score=3.0 → 0.95 (max)
        - score=4.0 → 0.95 (capped)

    Without intent boost (corpus matching only):
        confidence = min(0.25 + score * 0.15, 0.95)
        Examples:
        - score=2.0 → 0.55 (below threshold)
        - score=3.0 → 0.70 (below threshold)
        - score=4.0 → 0.85 (meets threshold)
        - score=5.0 → 0.95 (capped)

    The 0.8 threshold in Gate 2 means:
    - With intent boost: Only needs score >= 2.0 to trigger skill routing
    - Without intent boost: Needs score >= 4.0 to trigger skill routing

    This design favors explicit domain keywords while remaining conservative
    for generic corpus matches that may be coincidental.

    Args:
        score: Accumulated match score from corpus matching and intent boosters.
               Higher scores come from matching more terms or important keywords.
        has_intent_boost: Whether an INTENT_BOOSTER keyword was matched.
                         True enables the higher-confidence formula.

    Returns:
        float: Confidence score between 0.0 and 0.95
    """
    if has_intent_boost:
        # Intent booster matched - higher confidence curve
        confidence = min(0.50 + score * 0.15, 0.95)
    else:
        # No explicit boosters - conservative (corpus matches only)
        confidence = min(0.25 + score * 0.15, 0.95)

    return confidence


def calculate_uncertainty(num_matches: int, has_intent_boost: bool, num_ambiguous_matches: int) -> float:
    """
    Calculate uncertainty score for skill recommendation.

    Uncertainty measures "how much we don't know" - separate from confidence.
    High confidence + high uncertainty = "confident ignorance" (dangerous state).

    Formula factors:
    - Fewer matches = higher uncertainty (less evidence)
    - No intent boost = higher uncertainty (less clear intent)
    - More ambiguous matches = higher uncertainty (competing interpretations)

    Examples:
    - 5 matches, intent boost, 0 ambiguous: 0.15 (LOW - proceed)
    - 3 matches, intent boost, 1 ambiguous: 0.35 (LOW - proceed)
    - 1 match, no intent boost, 0 ambiguous: 0.55 (MEDIUM - verify)
    - 1 match, no intent boost, 2 ambiguous: 0.75 (HIGH - clarify)
    - 0 matches, no intent boost, 0 ambiguous: 0.85 (HIGH - clarify)

    Args:
        num_matches: Total number of keyword/corpus matches found.
        has_intent_boost: Whether an INTENT_BOOSTER keyword was matched.
        num_ambiguous_matches: Count of MULTI_SKILL_BOOSTER matches (ambiguous keywords).

    Returns:
        float: Uncertainty score between 0.0 and 1.0
               <= 0.35: LOW (proceed)
               0.36-0.60: MEDIUM (verify first)
               > 0.60: HIGH (require clarification)
    """
    # Base uncertainty decreases with more matches
    if num_matches >= 5:
        base_uncertainty = 0.15
    elif num_matches >= 3:
        base_uncertainty = 0.20
    elif num_matches >= 1:
        base_uncertainty = 0.30
    else:
        base_uncertainty = 0.70

    # No intent boost increases uncertainty (less clear intent)
    intent_penalty = 0.0 if has_intent_boost else 0.15

    # Ambiguous matches increase uncertainty (competing interpretations)
    ambiguity_penalty = min(num_ambiguous_matches * 0.08, 0.24)

    uncertainty = min(base_uncertainty + intent_penalty + ambiguity_penalty, 1.0)
    return round(uncertainty, 2)


def passes_dual_threshold(
    confidence: float,
    uncertainty: float,
    conf_threshold: float = 0.8,
    uncert_threshold: float = 0.35,
) -> bool:
    """
    Check if recommendation passes dual-threshold validation.

    READINESS = (confidence >= threshold) AND (uncertainty <= uncert_threshold)

    Note on thresholds:
    - AGENTS.md Gate 1 defines READINESS as: (confidence >= 0.70) AND (uncertainty <= 0.35)
    - Gate 2 skill routing typically uses conf_threshold=0.8 (stricter for routing decisions)
    - The uncertainty threshold of 0.35 matches AGENTS.md exactly

    Args:
        confidence: Confidence score (0.0-1.0)
        uncertainty: Uncertainty score (0.0-1.0)
        conf_threshold: Minimum confidence required (default 0.8 for skill routing)
        uncert_threshold: Maximum uncertainty allowed (default 0.35 per AGENTS.md)

    Returns:
        bool: True if both thresholds pass
    """
    return confidence >= conf_threshold and uncertainty <= uncert_threshold


def apply_confidence_calibration(recommendations: List[Dict[str, Any]]) -> None:
    """Adjust confidence using score margin and ambiguity pressure."""
    if not recommendations:
        return

    ordered = sorted(recommendations, key=lambda item: item["_score"], reverse=True)
    score_map: Dict[str, float] = {}
    for index, current in enumerate(ordered):
        next_score = ordered[index + 1]["_score"] if index + 1 < len(ordered) else 0.0
        score_map[current["skill"]] = current["_score"] - next_score

    for recommendation in recommendations:
        confidence = recommendation["confidence"]
        num_matches = max(1, recommendation.get("_num_matches", 1))
        num_ambiguous = recommendation.get("_num_ambiguous", 0)
        margin = score_map.get(recommendation["skill"], 0.0)

        margin_penalty = 0.0
        if margin < 0.6:
            margin_penalty = min((0.6 - margin) * 0.2, 0.12)

        ambiguity_ratio = num_ambiguous / num_matches
        ambiguity_penalty = min(ambiguity_ratio * 0.1, 0.1)
        evidence_bonus = min(max(num_matches - 3, 0) * 0.01, 0.05)

        calibrated = confidence - margin_penalty - ambiguity_penalty + evidence_bonus
        recommendation["confidence"] = round(max(0.0, min(0.95, calibrated)), 2)


def filter_recommendations(
    recommendations: List[Dict[str, Any]],
    confidence_threshold: float,
    uncertainty_threshold: float,
    confidence_only: bool,
    show_rejections: bool,
) -> List[Dict[str, Any]]:
    """Filter recommendations under default dual-threshold or explicit confidence-only mode."""
    filtered: List[Dict[str, Any]] = []

    for recommendation in recommendations:
        passes = passes_dual_threshold(
            recommendation["confidence"],
            recommendation["uncertainty"],
            conf_threshold=confidence_threshold,
            uncert_threshold=uncertainty_threshold,
        )
        recommendation["passes_threshold"] = passes

        if confidence_only:
            if recommendation["confidence"] >= confidence_threshold:
                filtered.append(recommendation)
            continue

        if show_rejections or passes:
            filtered.append(recommendation)

    return filtered


# Iteration-loop phrases that imply skill-owned workflow (deep-research / deep-review)
# When these match AND command-spec-kit is a candidate alongside cli-*, promote the command.
# See CLAUDE.md / AGENTS.md Gate 4: SKILL-OWNED WORKFLOW ENFORCEMENT.
ITERATION_LOOP_PHRASES = (
    "deep-research", "deep research", "deep-review", "deep review",
    "autoresearch", "auto research", "research loop", "review loop",
    "iterative research", "iterative review", "autonomous research", "autonomous review",
    "iterations of", ":auto", "convergence detection",
    "/spec_kit:deep-research", "/spec_kit:deep-review",
    "spec_kit:deep-research", "spec_kit:deep-review",
)

# T-SAP-02 (R45-002): Deep-research disambiguation phrases. When the prompt
# contains one of these and both `sk-deep-research` and `sk-code-review`
# appear as candidates within a thin margin, enforce a ≥ 0.10 confidence gap
# so `sk-deep-research` keeps the primary slot. Wording-sensitive audit/review
# tokens must not steal a deep-research prompt back into the generic review
# lane.
DEEP_RESEARCH_DISAMBIGUATION_PHRASES = (
    "deep research",
    "deep-research",
    "autoresearch",
    "/autoresearch",
    "research loop",
    "iterative research",
    "autonomous research",
    "auto research",
    "/spec_kit:deep-research",
    "spec_kit:deep-research",
)

# Symmetric guard for deep-review vs code-review wording collisions.
# NOTE: "auto review" is intentionally omitted because the shipped regression
# corpus treats "auto review this PR" as an sk-code-review prompt. Strong
# sk-deep-review phrases (e.g. "auto review release readiness") are already
# covered by explicit multi-token PHRASE_INTENT_BOOSTERS entries that win
# on raw score before this disambiguation tier executes.
DEEP_REVIEW_DISAMBIGUATION_PHRASES = (
    "deep review",
    "deep-review",
    "review loop",
    "iterative review",
    "autonomous review",
    "/spec_kit:deep-review",
    "spec_kit:deep-review",
)

DISAMBIGUATION_MARGIN = 0.10


def _apply_deep_research_disambiguation(
    recommendations: List[Dict[str, Any]],
    prompt_lower: str,
) -> None:
    """Ensure sk-deep-research beats sk-code-review by ≥ 0.10 on deep-research prompts.

    T-SAP-02 (R45-002): audit/review-token overlap between deep-research prompts
    and code-review prompts produced sub-0.02 confidence ties. When the prompt
    contains an unambiguous deep-research marker AND both `sk-deep-research`
    and `sk-code-review` appear as candidates, widen the margin to at least
    ``DISAMBIGUATION_MARGIN`` so the router returns a stable deep-research
    recommendation instead of a wording-sensitive tie.

    Symmetric handling is applied for `sk-deep-review` vs `sk-code-review` via
    ``DEEP_REVIEW_DISAMBIGUATION_PHRASES``.
    """
    if not prompt_lower or not recommendations:
        return

    def _find(skill_name: str) -> Optional[Dict[str, Any]]:
        for rec in recommendations:
            if rec.get("skill") == skill_name:
                return rec
        return None

    def _enforce_margin(
        winner: Dict[str, Any],
        loser: Dict[str, Any],
        reason_label: str,
    ) -> None:
        winner_conf = float(winner.get("confidence", 0.0))
        loser_conf = float(loser.get("confidence", 0.0))
        gap = winner_conf - loser_conf
        if gap >= DISAMBIGUATION_MARGIN:
            return
        adjusted = max(0.0, round(winner_conf - DISAMBIGUATION_MARGIN, 2))
        if adjusted >= loser_conf:
            return
        loser["confidence"] = adjusted
        existing_reason = str(loser.get("reason", ""))
        note = f" [disambiguation: {reason_label} reserved for this prompt]"
        if note not in existing_reason:
            loser["reason"] = f"{existing_reason}{note}"

    if any(phrase in prompt_lower for phrase in DEEP_RESEARCH_DISAMBIGUATION_PHRASES):
        winner = _find("sk-deep-research")
        loser = _find("sk-code-review")
        if winner and loser:
            _enforce_margin(winner, loser, "sk-deep-research")

    if any(phrase in prompt_lower for phrase in DEEP_REVIEW_DISAMBIGUATION_PHRASES):
        winner = _find("sk-deep-review")
        loser = _find("sk-code-review")
        if winner and loser:
            _enforce_margin(winner, loser, "sk-deep-review")


def _apply_iteration_loop_tiebreaker(
    recommendations: List[Dict[str, Any]],
    prompt_lower: str,
) -> None:
    """Promote command-spec-kit over cli-* when iteration-loop phrases are present.

    Background: when a user asks to run iterations of deep-research or deep-review with
    a specific CLI executor (e.g. "use cli-copilot for 50 iterations"), the skill advisor
    previously returned command-spec-kit and cli-copilot with similar confidence. Picking
    cli-copilot as the primary route bypasses the skill's state machine, convergence
    detection, and deltas — see the post-mortem in Phase 016 FINAL synthesis.

    Rule: if the prompt contains iteration-loop phrases AND both a command-spec-kit
    recommendation and a cli-* skill recommendation are present, penalize the cli-*
    confidence so the command wins the primary slot. The CLI executor is still a valid
    tool INSIDE the command's YAML workflow — it just can't BE the workflow.
    """
    if not prompt_lower:
        return

    has_iteration_phrase = any(phrase in prompt_lower for phrase in ITERATION_LOOP_PHRASES)
    if not has_iteration_phrase:
        return

    has_command = any(r.get("skill") == "command-spec-kit" for r in recommendations)
    cli_recs = [r for r in recommendations if r.get("skill", "").startswith("cli-")]
    if not has_command or not cli_recs:
        return

    # Penalize cli-* confidence by 0.20 (capped at 0.60 floor) so command-spec-kit
    # ranks ahead. This preserves the cli-* as an available tool for the command's
    # internal use but removes it as a competing primary route.
    for rec in cli_recs:
        current = rec.get("confidence", 0.0)
        penalized = max(0.60, current - 0.20)
        if penalized < current:
            rec["confidence"] = round(penalized, 2)
            reason = rec.get("reason", "")
            rec["reason"] = f"{reason} [iteration-loop tiebreaker: -0.20; command-spec-kit owns loop, cli-* is tool inside it]"


# ───────────────────────────────────────────────────────────────
# 4. ANALYSIS
# ───────────────────────────────────────────────────────────────

def analyze_request(
    prompt: str,
    semantic_hits: Optional[List[Dict[str, Any]]] = None,
) -> List[Dict[str, Any]]:
    """Analyze user request and return ranked skill recommendations.

    Args:
        prompt: The user request text.
        semantic_hits: Optional CocoIndex search results as a list of
            ``{"path": str, "score": float}`` dicts. When provided, these
            are blended into keyword scoring as additional intent evidence.
    """
    if not prompt:
        return []

    prompt_lower = prompt.lower()
    all_tokens = re.findall(r'\b\w+\b', prompt_lower)
    skills = get_skills()
    explicit_command_intent = detect_explicit_command_intent(prompt_lower)

    # Intent boosts calculated BEFORE stop word filtering - question words (how, why, what)
    # are important signals for semantic search but would otherwise be filtered
    skill_boosts = {}
    boost_reasons = {}

    apply_intent_normalization(
        prompt_lower=prompt_lower,
        tokens=all_tokens,
        skill_boosts=skill_boosts,
        boost_reasons=boost_reasons,
    )

    if should_auto_use_semantic_search(prompt):
        skill_boosts["mcp-coco-index"] = skill_boosts.get("mcp-coco-index", 0.0) + 1.8
        boost_reasons.setdefault("mcp-coco-index", []).append("!intent:semantic-code-search")

    # Blend CocoIndex semantic search results when available
    if semantic_hits:
        _apply_semantic_boosts(semantic_hits, skills, skill_boosts, boost_reasons)

    for token in all_tokens:
        if token in INTENT_BOOSTERS:
            skill, boost = INTENT_BOOSTERS[token]
            skill_boosts[skill] = skill_boosts.get(skill, 0) + boost
            if skill not in boost_reasons:
                boost_reasons[skill] = []
            boost_reasons[skill].append(f"!{token}")

        if token in MULTI_SKILL_BOOSTERS:
            for skill, boost in MULTI_SKILL_BOOSTERS[token]:
                skill_boosts[skill] = skill_boosts.get(skill, 0) + boost
                if skill not in boost_reasons:
                    boost_reasons[skill] = []
                boost_reasons[skill].append(f"!{token}(multi)")

    for phrase, boosts in PHRASE_INTENT_BOOSTERS.items():
        if phrase in prompt_lower:
            for skill, boost in boosts:
                skill_boosts[skill] = skill_boosts.get(skill, 0) + boost
                if skill not in boost_reasons:
                    boost_reasons[skill] = []
                boost_reasons[skill].append(f"!{phrase}(phrase)")

    _apply_signal_boosts(prompt_lower, skill_boosts, boost_reasons)

    # Graph-derived boosts: transitive relationships and family affinity
    _apply_graph_boosts(skill_boosts, boost_reasons)
    _apply_family_affinity(skill_boosts, boost_reasons)

    # Strongly prefer the explicitly named skill when users mention it directly.
    # This protects routing in mixed prompts that also contain broad terms like "opencode".
    for skill_name, config in skills.items():
        variants = set(config.get("variants", set())) or _build_variants(skill_name)
        matched_variants = sorted({v for v in variants if v in prompt_lower})
        if not matched_variants:
            continue

        explicit_boost = 2.5 + 0.3 * (len(matched_variants) - 1)
        skill_boosts[skill_name] = skill_boosts.get(skill_name, 0) + explicit_boost
        if skill_name not in boost_reasons:
            boost_reasons[skill_name] = []
        for variant in matched_variants:
            boost_reasons[skill_name].append(f"!{variant}(explicit)")

    for skill_name, config in skills.items():
        keyword_variants = set(config.get("keyword_variants", set()))
        matched_keywords = sorted({
            variant
            for variant in keyword_variants
            if _matches_phrase_boundary(prompt_lower, variant)
        })
        if not matched_keywords:
            continue

        keyword_boost = 1.0 + 0.2 * (len(matched_keywords) - 1)
        skill_boosts[skill_name] = skill_boosts.get(skill_name, 0) + keyword_boost
        if skill_name not in boost_reasons:
            boost_reasons[skill_name] = []
        for keyword in matched_keywords:
            boost_reasons[skill_name].append(f"!{keyword}(keyword)")

    # Stop words filtered for corpus matching only
    tokens = [t for t in all_tokens if t not in STOP_WORDS and len(t) > 2]

    if not tokens and not skill_boosts:
        return []

    search_terms = expand_query(tokens) if tokens else []
    recommendations = []
    for name, config in skills.items():
        score = skill_boosts.get(name, 0.0)
        matches = boost_reasons.get(name, []).copy()

        name_parts_filtered = set(config.get("name_terms", set())) or _normalize_terms(name.replace('-', ' '))
        corpus = set(config.get("corpus_terms", set())) or _normalize_terms(config["description"])
        kind = config.get("kind", "skill")

        for term in search_terms:
            if term in name_parts_filtered:
                score += 1.5
                matches.append(f"{term}(name)")
            elif term in corpus:
                score += 1.0
                matches.append(term)
            elif len(term) >= 4:
                for corpus_word in corpus:
                    if len(corpus_word) >= 4 and (term in corpus_word or corpus_word in term):
                        score += 0.5
                        matches.append(f"{term}~")
                        break

        if kind == "command" and explicit_command_intent != name:
            score -= 0.35
            if score > 0:
                matches.append("command_penalty")

        if score <= 0:
            continue

        total_intent_boost = skill_boosts.get(name, 0.0)
        has_boost = total_intent_boost > 0
        confidence = calculate_confidence(
            score=score,
            has_intent_boost=has_boost,
        )

        num_matches = len(matches)
        num_ambiguous = sum(1 for m in matches if '(multi)' in m)
        graph_boost_count = len([m for m in matches if m.startswith('!graph:')])
        uncertainty = calculate_uncertainty(
            num_matches=num_matches,
            has_intent_boost=has_boost,
            num_ambiguous_matches=num_ambiguous
        )

        if explicit_command_intent:
            kind_priority = 2 if name == explicit_command_intent else (1 if kind == "command" else 0)
        else:
            kind_priority = 1 if kind == "skill" else 0

        recommendations.append({
            "skill": name,
            "kind": kind,
            "confidence": round(confidence, 2),
            "uncertainty": uncertainty,
            "passes_threshold": False,
            "reason": f"Matched: {', '.join(sorted(set(matches))[:5])}",
            "_score": round(score, 4),
            "_explicit_skill_match": any('(explicit)' in m for m in matches),
            "_kind_priority": kind_priority,
            "_num_matches": num_matches,
            "_num_ambiguous": num_ambiguous,
            "_graph_boost_count": graph_boost_count,
        })

    apply_confidence_calibration(recommendations)
    for recommendation in recommendations:
        graph_boost_count = recommendation.get("_graph_boost_count", 0)
        total_matches = recommendation.get("_num_matches", 1)
        if total_matches > 0 and graph_boost_count / total_matches > 0.5:
            recommendation["confidence"] = round(recommendation["confidence"] * 0.90, 2)

    # T-SAP-02 (R45-002): disambiguate deep-research vs code-review and
    # deep-review vs code-review before the iteration-loop tiebreaker so the
    # primary-slot selection is stable on audit/review-token prompts.
    _apply_deep_research_disambiguation(recommendations, prompt_lower)

    # Iteration-loop tiebreaker: when the query mentions iterative investigation/review
    # phrases AND command-spec-kit matches alongside a cli-* executor skill, promote
    # command-spec-kit. The CLI executor is a tool INSIDE the command's workflow, not
    # a replacement for it. Prevents custom bash dispatchers bypassing skill-owned state.
    # See CLAUDE.md / AGENTS.md Gate 4: SKILL-OWNED WORKFLOW ENFORCEMENT.
    _apply_iteration_loop_tiebreaker(recommendations, prompt_lower)

    for recommendation in recommendations:
        recommendation["passes_threshold"] = passes_dual_threshold(
            recommendation["confidence"],
            recommendation["uncertainty"],
            conf_threshold=DEFAULT_CONFIDENCE_THRESHOLD,
            uncert_threshold=DEFAULT_UNCERTAINTY_THRESHOLD,
        )

    _apply_graph_conflict_penalty(recommendations)

    ranked = sorted(
        recommendations,
        key=lambda x: (
            x['_kind_priority'],
            x['_explicit_skill_match'],
            x['passes_threshold'],
            x['confidence'],
            x['_score'],
        ),
        reverse=True,
    )
    ranked = normalize_command_bridge_recommendations(ranked, prompt_lower)

    # Internal sort metadata should not leak in advisor output.
    for rec in ranked:
        rec.pop('_score', None)
        rec.pop('_explicit_skill_match', None)
        rec.pop('_kind_priority', None)
        rec.pop('_num_matches', None)
        rec.pop('_num_ambiguous', None)

    return ranked


# ───────────────────────────────────────────────────────────────
# 5. DIAGNOSTICS
# ───────────────────────────────────────────────────────────────

def load_all_skills() -> List[Dict[str, Any]]:
    """Load all skills for diagnostics."""
    loaded = []
    for name, config in get_skills(force_refresh=True).items():
        loaded.append({
            "name": name,
            "description": config.get("description", ""),
            "kind": config.get("kind", "skill"),
        })
    return loaded


def _collect_graph_skill_ids(graph: Optional[Dict[str, Any]]) -> Set[str]:
    """Extract the union of skill IDs mentioned anywhere in a compiled graph."""
    graph_ids: Set[str] = set()
    if not isinstance(graph, dict):
        return graph_ids
    for family_members in (graph.get("families") or {}).values():
        if isinstance(family_members, list):
            graph_ids.update(
                str(member) for member in family_members if isinstance(member, str)
            )
    for source_id, edge_groups in (graph.get("adjacency") or {}).items():
        if isinstance(source_id, str):
            graph_ids.add(str(source_id))
        if isinstance(edge_groups, dict):
            for targets in edge_groups.values():
                if isinstance(targets, dict):
                    graph_ids.update(
                        str(target) for target in targets.keys() if isinstance(target, str)
                    )
    for signal_id in (graph.get("signals") or {}).keys():
        if isinstance(signal_id, str):
            graph_ids.add(str(signal_id))
    return graph_ids


def _compare_inventories(
    skill_names: List[str],
    graph: Optional[Dict[str, Any]],
) -> Dict[str, Any]:
    """Thin wrapper around ``skill_advisor_runtime.compare_inventories``.

    T-SAR-01 (R42-002): the primitive set-comparison lives in
    ``skill_advisor_runtime.py`` so it can be reused from other harnesses;
    this wrapper extracts the compiled-graph skill IDs and forwards to the
    runtime helper.
    """
    graph_ids = _collect_graph_skill_ids(graph)
    return _runtime_module.compare_inventories(skill_names, graph_ids)


def health_check() -> Dict[str, Any]:
    """Return skill count and status for diagnostics."""
    skills = load_all_skills()
    real_skills = [s for s in skills if s.get("kind") == "skill"]
    command_bridges = [s for s in skills if s.get("kind") == "command"]
    graph = _load_skill_graph()
    graph_loaded = graph is not None
    _load_source_graph_signal_map()
    _load_source_conflict_declarations()
    source_metadata = _source_metadata_health()
    cache_status = get_cache_status()

    # T-SGC-02 (R45-003): surface persisted topology-warning payload (if any).
    topology_warnings: Dict[str, List[str]] = {}
    if isinstance(graph, dict):
        raw = graph.get("topology_warnings")
        if isinstance(raw, dict):
            for category, messages in raw.items():
                if isinstance(category, str) and isinstance(messages, list):
                    cleaned = [str(m) for m in messages if isinstance(m, str) and m.strip()]
                    if cleaned:
                        topology_warnings[category] = cleaned
    has_topology_warnings = any(topology_warnings.values())

    # T-SAR-01 (R42-002): inventory parity check between SKILL.md discovery
    # (authoritative for analyze_request's skill records) and the compiled
    # graph (authoritative for adjacency/signal-based boosts). Any mismatch
    # downgrades health to `degraded` even when both sources loaded cleanly.
    skill_discovery_names = [s.get("name", "") for s in real_skills if s.get("name")]
    inventory_parity = _compare_inventories(skill_discovery_names, graph)
    inventory_synced = bool(inventory_parity["in_sync"])

    # Determine status. Error if no skills. Otherwise degraded when any runtime
    # input surface is incomplete or malformed.
    if not real_skills:
        status = "error"
    elif (
        not graph_loaded
        or has_topology_warnings
        or not inventory_synced
        or not bool(cache_status.get("healthy"))
        or not bool(source_metadata.get("healthy"))
    ):
        status = "degraded"
    else:
        status = "ok"

    result = {
        "status": status,
        "skills_found": len(real_skills),
        "command_bridges_found": len(command_bridges),
        "skill_names": [s.get('name', 'unknown') for s in real_skills],
        "command_bridge_names": [s.get('name', 'unknown') for s in command_bridges],
        "skills_dir": SKILLS_DIR,
        "skills_dir_exists": os.path.exists(SKILLS_DIR),
        "cache": cache_status,
        "source_metadata": source_metadata,
        "skill_graph_loaded": graph_loaded,
        "skill_graph_source": _SKILL_GRAPH_SOURCE,
        "skill_graph_skill_count": graph.get("skill_count", 0) if graph else 0,
        "skill_graph_path": (
            SKILL_GRAPH_SQLITE_PATH
            if _SKILL_GRAPH_SOURCE == "sqlite"
            else SKILL_GRAPH_PATH
            if _SKILL_GRAPH_SOURCE == "json"
            else None
        ),
        "skill_graph_sqlite_path": SKILL_GRAPH_SQLITE_PATH,
        "skill_graph_json_path": SKILL_GRAPH_PATH,
        "topology_warnings": topology_warnings,
        "inventory_parity": inventory_parity,
    }

    if not graph_loaded:
        sqlite_path_exists = os.path.exists(SKILL_GRAPH_SQLITE_PATH)
        graph_path_exists = os.path.exists(SKILL_GRAPH_PATH)
        if sqlite_path_exists:
            result["skill_graph_error"] = "sqlite_unavailable"
        else:
            result["skill_graph_error"] = "corrupt" if graph_path_exists else "missing"

    return result


def analyze_prompt(
    prompt: str,
    confidence_threshold: float = DEFAULT_CONFIDENCE_THRESHOLD,
    uncertainty_threshold: float = DEFAULT_UNCERTAINTY_THRESHOLD,
    confidence_only: bool = False,
    show_rejections: bool = False,
    semantic_hits: Optional[List[Dict[str, Any]]] = None,
) -> List[Dict[str, Any]]:
    """Analyze one prompt and apply requested filtering mode."""
    recommendations = analyze_request(prompt, semantic_hits=semantic_hits)
    return filter_recommendations(
        recommendations=recommendations,
        confidence_threshold=confidence_threshold,
        uncertainty_threshold=uncertainty_threshold,
        confidence_only=confidence_only,
        show_rejections=show_rejections,
    )


def analyze_batch(
    prompts: List[str],
    confidence_threshold: float,
    uncertainty_threshold: float,
    confidence_only: bool,
    show_rejections: bool,
    semantic_mode: bool = False,
) -> List[Dict[str, Any]]:
    """Analyze multiple prompts in a single process for lower overhead."""
    results = []
    for prompt in prompts:
        trimmed = prompt.strip()
        if not trimmed:
            continue

        hits = None
        if semantic_mode and not built_in_semantic_search_disabled():
            hits = _cocoindex_search_builtin(trimmed, REPO_ROOT)
        elif should_auto_use_semantic_search(trimmed) and not built_in_semantic_search_disabled():
            hits = _cocoindex_search_builtin(trimmed, REPO_ROOT)

        results.append({
            "prompt": trimmed,
            "recommendations": analyze_prompt(
                prompt=trimmed,
                confidence_threshold=confidence_threshold,
                uncertainty_threshold=uncertainty_threshold,
                confidence_only=confidence_only,
                show_rejections=show_rejections,
                semantic_hits=hits,
            ),
        })
    return results


# ───────────────────────────────────────────────────────────────
# 6. CLI ENTRY POINT
# ───────────────────────────────────────────────────────────────

def main() -> int:
    """Parse CLI arguments and run the requested advisor mode."""
    parser = argparse.ArgumentParser(
        description='Analyze user requests and recommend appropriate skills.',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
Examples:
  python skill_advisor.py "how does authentication work"
  printf '%s' "how does authentication work" | python skill_advisor.py --stdin
  python skill_advisor.py "create a git commit" --threshold 0.8
  python skill_advisor.py "api chain mcp" --threshold 0.8 --confidence-only
  python skill_advisor.py --batch-file prompts.txt
  cat prompts.txt | python skill_advisor.py --batch-stdin
  python skill_advisor.py --health
  python skill_advisor.py --validate-only

  # CocoIndex semantic search (built-in, requires ccc daemon):
  python skill_advisor.py "deploy to production" --semantic
  python skill_advisor.py "deploy to production" --cocoindex

  # CocoIndex semantic search (pre-computed MCP results):
  python skill_advisor.py "deploy to production" --semantic-hits '[{"path":".opencode/skill/sk-git/SKILL.md","score":0.92}]'
  python skill_advisor.py "deploy to production" --cocoindex-hits '[{"path":".opencode/skill/sk-git/SKILL.md","score":0.92}]'
        '''
    )
    parser.add_argument('prompt', nargs='?', default='',
                        help='User request to analyze')
    parser.add_argument('--stdin', action='store_true',
                        help='Read the single prompt from stdin instead of process arguments.')
    parser.add_argument('--stdin-preferred', action='store_true',
                        help='Prefer stdin for single-prompt input and fall back to argv when stdin is empty.')
    parser.add_argument('--health', action='store_true',
                        help='Run health check diagnostics')
    parser.add_argument('--validate-only', action='store_true',
                        help='Run strict skill-graph validation and fail on topology issues.')
    parser.add_argument('--threshold', type=float, default=DEFAULT_CONFIDENCE_THRESHOLD,
                        help='Confidence threshold for recommendations (default: 0.8).')
    parser.add_argument('--uncertainty', type=float, default=DEFAULT_UNCERTAINTY_THRESHOLD,
                        help='Maximum uncertainty threshold for recommendations in dual-threshold mode (default: 0.35).')
    parser.add_argument('--confidence-only', action='store_true',
                        help='Use confidence-only filtering and bypass uncertainty checks explicitly.')
    parser.add_argument('--show-rejections', action='store_true',
                        help='Include recommendations that failed dual-threshold validation')
    parser.add_argument('--force-local', action='store_true',
                        help='Bypass native advisor_recommend and force the local Python scorer path.')
    parser.add_argument('--force-native', action='store_true',
                        help='Require native advisor_recommend; exit non-zero if the native path is unavailable.')
    parser.add_argument('--batch-file', type=str, default='',
                        help='Analyze prompts from file (one prompt per line) in one process.')
    parser.add_argument('--batch-stdin', action='store_true',
                        help='Analyze prompts from stdin (one prompt per line) in one process.')
    parser.add_argument('--force-refresh', action='store_true',
                        help='Force refresh of skill discovery cache before analysis.')
    parser.add_argument('--semantic', '--cocoindex', dest='semantic', action='store_true',
                         help='Run CocoIndex semantic search (via ccc CLI) to supplement keyword matching.')
    parser.add_argument('--semantic-hits', '--cocoindex-hits', dest='semantic_hits', type=str, default='',
                         help='Pre-computed CocoIndex results as JSON array of {"path": str, "score": float} objects.')

    args = parser.parse_args()

    if args.force_local and args.force_native:
        print(json.dumps({"error": "Use only one of --force-local or --force-native."}, indent=2))
        return 2

    if args.force_refresh:
        get_skills(force_refresh=True)

    if args.health:
        cocoindex_binary = resolve_cocoindex_binary()
        health = health_check()
        health["cocoindex_available"] = cocoindex_binary is not None
        health["cocoindex_binary"] = cocoindex_binary or ""
        print(json.dumps(health, indent=2))
        return 0

    if args.validate_only:
        return run_skill_graph_validation(strict_topology=True)

    if sum(bool(value) for value in [args.batch_file, args.batch_stdin, args.stdin]) > 1:
        print(json.dumps({"error": "Use only one of --batch-file, --batch-stdin, or --stdin."}, indent=2))
        return 2

    # Parse pre-computed semantic hits (JSON array from MCP search results)
    pre_computed_hits = None
    if args.semantic_hits:
        try:
            pre_computed_hits = json.loads(args.semantic_hits)
            if not isinstance(pre_computed_hits, list):
                print(json.dumps({"error": "--semantic-hits/--cocoindex-hits must be a JSON array"}), file=sys.stderr)
                return 2
        except json.JSONDecodeError as exc:
            print(json.dumps({"error": f"Invalid --semantic-hits/--cocoindex-hits JSON: {exc}"}), file=sys.stderr)
            return 2

    if args.batch_file:
        try:
            with open(args.batch_file, 'r', encoding='utf-8') as handle:
                batch_prompts = [line.rstrip('\n') for line in handle]
        except OSError as exc:
            print(json.dumps({"error": f"Failed to read --batch-file: {exc}"}, indent=2))
            return 2

        print(json.dumps(analyze_batch(
            prompts=batch_prompts,
            confidence_threshold=args.threshold,
            uncertainty_threshold=args.uncertainty,
            confidence_only=args.confidence_only,
            show_rejections=args.show_rejections,
            semantic_mode=args.semantic,
        ), indent=2))
        return 0

    if args.batch_stdin:
        batch_prompts = [line.rstrip('\n') for line in sys.stdin]
        print(json.dumps(analyze_batch(
            prompts=batch_prompts,
            confidence_threshold=args.threshold,
            uncertainty_threshold=args.uncertainty,
            confidence_only=args.confidence_only,
            show_rejections=args.show_rejections,
            semantic_mode=args.semantic,
        ), indent=2))
        return 0

    if args.stdin or args.stdin_preferred:
        stdin_prompt = sys.stdin.read()
        if args.stdin or stdin_prompt:
            args.prompt = stdin_prompt

    if not args.prompt:
        print(json.dumps([]))
        return 0

    if os.environ.get(DISABLE_ADVISOR_ENV) == "1":
        print(json.dumps([]))
        return 0

    if not args.force_local and pre_computed_hits is None and not args.semantic:
        probe = probe_native_advisor()
        if probe.get("available"):
            native_results = recommend_with_native_advisor(
                args.prompt,
                confidence_threshold=args.threshold,
                uncertainty_threshold=args.uncertainty,
                confidence_only=args.confidence_only,
            )
            if native_results is not None:
                print(json.dumps(native_results, indent=2))
                return 0
        elif args.force_native:
            print(json.dumps({
                "error": "Native advisor unavailable",
                "reason": probe.get("reason", "UNKNOWN"),
                "freshness": probe.get("freshness", "unavailable"),
            }, indent=2))
            return 2

    if args.force_native:
        print(json.dumps({"error": "Native advisor unavailable", "reason": "NATIVE_CALL_FAILED"}, indent=2))
        return 2

    # Resolve semantic hits: pre-computed > built-in search > none
    semantic_hits = pre_computed_hits
    if semantic_hits is None and args.semantic and not built_in_semantic_search_disabled():
        semantic_hits = _cocoindex_search_builtin(args.prompt, REPO_ROOT)
    elif semantic_hits is None and should_auto_use_semantic_search(args.prompt) and not built_in_semantic_search_disabled():
        semantic_hits = _cocoindex_search_builtin(args.prompt, REPO_ROOT)

    results = analyze_prompt(
        prompt=args.prompt,
        confidence_threshold=args.threshold,
        uncertainty_threshold=args.uncertainty,
        confidence_only=args.confidence_only,
        show_rejections=args.show_rejections,
        semantic_hits=semantic_hits,
    )

    print(json.dumps(results, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
