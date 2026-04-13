#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: SKILL GRAPH COMPILER
# ───────────────────────────────────────────────────────────────

"""
Skill Graph Compiler - Scans skill folders for graph-metadata.json,
validates schema, and compiles into a single skill-graph.json.

Usage:
    python skill_graph_compiler.py                    # Compile to default output
    python skill_graph_compiler.py --validate-only    # Validate without writing
    python skill_graph_compiler.py --pretty           # Human-readable output
    python skill_graph_compiler.py --output PATH      # Custom output path
"""

import argparse
import json
import os
import sys
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Set, Tuple


# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────

SCRIPT_DIR = os.path.dirname(os.path.realpath(__file__))
SKILLS_DIR = os.path.dirname(os.path.dirname(SCRIPT_DIR))
DEFAULT_OUTPUT = os.path.join(SCRIPT_DIR, "skill-graph.json")

COMPILED_SCHEMA_VERSION = 1
ALLOWED_METADATA_SCHEMA_VERSIONS = {1, 2}

ALLOWED_FAMILIES = {"cli", "mcp", "sk-code", "sk-deep", "sk-util", "system"}
ALLOWED_CATEGORIES = {
    "cli-orchestrator", "mcp-tool", "code-quality",
    "autonomous-loop", "utility", "system",
}
EDGE_TYPES = {"depends_on", "enhances", "siblings", "conflicts_with", "prerequisite_for"}
ALLOWED_ENTITY_KINDS = {"skill", "agent", "script", "config", "reference"}


# ───────────────────────────────────────────────────────────────
# 2. DISCOVERY
# ───────────────────────────────────────────────────────────────

def discover_graph_metadata(skills_dir: str) -> List[Tuple[str, str, dict]]:
    """Scan skill folders for graph-metadata.json files.

    Returns list of (skill_folder_name, file_path, parsed_json) tuples.
    Skills without graph-metadata.json are silently skipped.
    """
    results = []
    if not os.path.isdir(skills_dir):
        return results

    for entry in sorted(os.listdir(skills_dir)):
        meta_path = os.path.join(skills_dir, entry, "graph-metadata.json")
        if not os.path.isfile(meta_path):
            continue

        # Skip the scripts directory itself
        if entry == "scripts":
            continue

        try:
            with open(meta_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            results.append((entry, meta_path, data))
        except (json.JSONDecodeError, OSError) as exc:
            print(f"WARNING: Failed to parse {meta_path}: {exc}", file=sys.stderr)

    return results


# ───────────────────────────────────────────────────────────────
# 3. VALIDATION
# ───────────────────────────────────────────────────────────────

def validate_skill_metadata(
    folder_name: str,
    data: dict,
    all_skill_ids: Set[str],
) -> List[str]:
    """Validate a single skill's graph-metadata.json against the schema.

    Returns list of error messages (empty = valid).
    """
    errors = []

    # Required top-level fields
    schema_version = data.get("schema_version")
    if schema_version not in ALLOWED_METADATA_SCHEMA_VERSIONS:
        errors.append(
            "schema_version must be one of "
            f"{sorted(ALLOWED_METADATA_SCHEMA_VERSIONS)}, got {schema_version}"
        )

    skill_id = data.get("skill_id")
    if not skill_id:
        errors.append("missing required field: skill_id")
    elif skill_id != folder_name:
        errors.append(f"skill_id '{skill_id}' does not match folder name '{folder_name}'")

    family = data.get("family")
    if not family:
        errors.append("missing required field: family")
    elif family not in ALLOWED_FAMILIES:
        errors.append(f"family '{family}' not in allowed set: {sorted(ALLOWED_FAMILIES)}")

    category = data.get("category")
    if not category:
        errors.append("missing required field: category")
    elif category not in ALLOWED_CATEGORIES:
        errors.append(f"category '{category}' not in allowed set: {sorted(ALLOWED_CATEGORIES)}")

    # Edges validation
    edges = data.get("edges")
    if not isinstance(edges, dict):
        errors.append("missing or invalid 'edges' object")
    else:
        for edge_type in EDGE_TYPES:
            edge_list = edges.get(edge_type, [])
            if not isinstance(edge_list, list):
                errors.append(f"edges.{edge_type} must be an array")
                continue
            for i, edge in enumerate(edge_list):
                if not isinstance(edge, dict):
                    errors.append(f"edges.{edge_type}[{i}] must be an object")
                    continue

                target = edge.get("target")
                if not target:
                    errors.append(f"edges.{edge_type}[{i}] missing 'target'")
                elif target not in all_skill_ids:
                    errors.append(f"edges.{edge_type}[{i}] target '{target}' is not a known skill")
                elif target == skill_id:
                    errors.append(f"edges.{edge_type}[{i}] is a self-referencing edge")

                weight = edge.get("weight")
                if not isinstance(weight, (int, float)):
                    errors.append(f"edges.{edge_type}[{i}] missing or invalid 'weight'")
                elif weight < 0.0 or weight > 1.0:
                    errors.append(f"edges.{edge_type}[{i}] weight {weight} out of range [0.0, 1.0]")

                if "context" not in edge:
                    errors.append(f"edges.{edge_type}[{i}] missing 'context'")

        # Check for unexpected edge types
        for key in edges:
            if key not in EDGE_TYPES:
                errors.append(f"unexpected edge type: '{key}'")

    # Domains and intent_signals
    if not isinstance(data.get("domains"), list):
        errors.append("missing or invalid 'domains' array")
    if not isinstance(data.get("intent_signals"), list):
        errors.append("missing or invalid 'intent_signals' array")

    if schema_version == 2:
        errors.extend(validate_derived_metadata(folder_name, data.get("derived")))

    return errors


def validate_derived_metadata(folder_name: str, derived: Any) -> List[str]:
    """Validate additive schema-version-2 derived metadata."""
    errors = []

    if not isinstance(derived, dict):
        return ["schema_version 2 requires a 'derived' object"]

    for field_name in ("trigger_phrases", "key_topics", "key_files", "entities", "source_docs"):
        field_value = derived.get(field_name)
        if not isinstance(field_value, list) or not field_value:
            errors.append(f"derived.{field_name} must be a non-empty array")

    causal_summary = derived.get("causal_summary")
    if not isinstance(causal_summary, str) or not causal_summary.strip():
        errors.append("derived.causal_summary must be a non-empty string")

    for field_name in ("created_at", "last_updated_at"):
        timestamp = derived.get(field_name)
        if not isinstance(timestamp, str) or not timestamp.strip():
            errors.append(f"derived.{field_name} must be a non-empty ISO timestamp string")
            continue
        try:
            datetime.fromisoformat(timestamp.replace("Z", "+00:00"))
        except ValueError:
            errors.append(f"derived.{field_name} must be valid ISO 8601, got {timestamp!r}")

    skill_dir = os.path.join(SKILLS_DIR, folder_name)
    repo_root = os.path.dirname(os.path.dirname(SKILLS_DIR))

    for index, phrase in enumerate(derived.get("trigger_phrases", [])):
        if not isinstance(phrase, str) or not phrase.strip():
            errors.append(f"derived.trigger_phrases[{index}] must be a non-empty string")

    for index, topic in enumerate(derived.get("key_topics", [])):
        if not isinstance(topic, str) or not topic.strip():
            errors.append(f"derived.key_topics[{index}] must be a non-empty string")

    for index, rel_path in enumerate(derived.get("source_docs", [])):
        if not isinstance(rel_path, str) or not rel_path.strip():
            errors.append(f"derived.source_docs[{index}] must be a non-empty string")
            continue
        if os.path.isabs(rel_path):
            errors.append(f"derived.source_docs[{index}] must be skill-relative, got absolute path")
            continue
        candidate = os.path.join(skill_dir, rel_path)
        if not os.path.isfile(candidate):
            errors.append(f"derived.source_docs[{index}] path does not exist: {rel_path}")

    for index, file_path in enumerate(derived.get("key_files", [])):
        if not isinstance(file_path, str) or not file_path.strip():
            errors.append(f"derived.key_files[{index}] must be a non-empty string")
            continue
        resolved_path = os.path.join(repo_root, file_path)
        if not os.path.isfile(resolved_path):
            errors.append(f"derived.key_files[{index}] path does not exist: {file_path}")

    for index, entity in enumerate(derived.get("entities", [])):
        if not isinstance(entity, dict):
            errors.append(f"derived.entities[{index}] must be an object")
            continue

        for field_name in ("name", "kind", "path", "source"):
            field_value = entity.get(field_name)
            if not isinstance(field_value, str) or not field_value.strip():
                errors.append(f"derived.entities[{index}].{field_name} must be a non-empty string")

        entity_kind = entity.get("kind")
        if entity_kind and entity_kind not in ALLOWED_ENTITY_KINDS:
            errors.append(
                f"derived.entities[{index}].kind must be one of "
                f"{sorted(ALLOWED_ENTITY_KINDS)}, got {entity_kind!r}"
            )

        entity_path = entity.get("path")
        if isinstance(entity_path, str) and entity_path.strip():
            resolved_path = os.path.join(repo_root, entity_path)
            if not os.path.isfile(resolved_path):
                errors.append(f"derived.entities[{index}].path does not exist: {entity_path}")

    return errors


def validate_edge_symmetry(
    all_metadata: List[Tuple[str, str, dict]],
) -> List[str]:
    """Cross-validate edge symmetry across all skills.

    Checks: if A depends_on B, B should have prerequisite_for A.
    Returns list of warnings (soft validation).
    """
    warnings = []

    # Build lookup
    skill_edges = {}
    for folder_name, _, data in all_metadata:
        skill_id = data.get("skill_id", folder_name)
        edges = data.get("edges", {})
        skill_edges[skill_id] = edges

    # Check depends_on <-> prerequisite_for symmetry
    for skill_id, edges in skill_edges.items():
        for edge in edges.get("depends_on", []):
            target = edge.get("target")
            if not target or target not in skill_edges:
                continue
            target_prereqs = {
                e.get("target") for e in skill_edges[target].get("prerequisite_for", [])
            }
            if skill_id not in target_prereqs:
                warnings.append(
                    f"SYMMETRY: {skill_id} depends_on {target}, "
                    f"but {target} missing prerequisite_for {skill_id}"
                )

    # Check siblings symmetry
    for skill_id, edges in skill_edges.items():
        for edge in edges.get("siblings", []):
            target = edge.get("target")
            if not target or target not in skill_edges:
                continue
            target_siblings = {
                e.get("target") for e in skill_edges[target].get("siblings", [])
            }
            if skill_id not in target_siblings:
                warnings.append(
                    f"SYMMETRY: {skill_id} has sibling {target}, "
                    f"but {target} missing sibling {skill_id}"
                )

    return warnings


def validate_zero_edge_skills(
    all_metadata: List[Tuple[str, str, dict]],
) -> List[str]:
    """Warn when a skill has no graph edges across any supported edge type."""
    warnings = []

    for folder_name, _, data in all_metadata:
        skill_id = data.get("skill_id", folder_name)
        edges = data.get("edges", {})
        if not isinstance(edges, dict):
            continue

        total_edges = 0
        for edge_type in EDGE_TYPES:
            edge_list = edges.get(edge_type, [])
            if isinstance(edge_list, list):
                total_edges += len(edge_list)

        if total_edges == 0:
            warnings.append(f"{skill_id}: skill has zero edges (orphan)")

    return warnings


def validate_dependency_cycles(
    all_metadata: List[Tuple[str, str, dict]],
) -> List[str]:
    """Detect simple two-node depends_on cycles (A -> B -> A)."""
    errors = []
    depends_on_lookup: Dict[str, Set[str]] = {}
    seen_cycles: Set[Tuple[str, str]] = set()

    for folder_name, _, data in all_metadata:
        skill_id = data.get("skill_id", folder_name)
        edges = data.get("edges", {})
        targets: Set[str] = set()

        if isinstance(edges, dict):
            for edge in edges.get("depends_on", []):
                if not isinstance(edge, dict):
                    continue
                target = edge.get("target")
                if target:
                    targets.add(target)

        depends_on_lookup[skill_id] = targets

    for skill_id, targets in depends_on_lookup.items():
        for target in targets:
            if skill_id not in depends_on_lookup.get(target, set()):
                continue

            cycle = tuple(sorted((skill_id, target)))
            if cycle in seen_cycles:
                continue

            seen_cycles.add(cycle)
            errors.append(f"depends_on cycle detected: {skill_id} -> {target} -> {skill_id}")

    return errors


# ───────────────────────────────────────────────────────────────
# 4. COMPILATION
# ───────────────────────────────────────────────────────────────

def compute_hub_skills(adjacency: Dict[str, dict]) -> List[str]:
    """Compute hub skills by counting inbound edges across all types."""
    inbound_counts: Dict[str, int] = {}

    for skill_id, edge_groups in adjacency.items():
        for edge_type, targets in edge_groups.items():
            for target in targets:
                inbound_counts[target] = inbound_counts.get(target, 0) + 1

    if not inbound_counts:
        return []

    # Return skills with above-median inbound degree
    counts = sorted(inbound_counts.values())
    median = counts[len(counts) // 2]
    hubs = [
        skill for skill, count in inbound_counts.items()
        if count > median
    ]
    return sorted(hubs)


def compile_graph(all_metadata: List[Tuple[str, str, dict]]) -> dict:
    """Compile all per-skill metadata into a single skill-graph.json."""
    families: Dict[str, List[str]] = {}
    adjacency: Dict[str, dict] = {}
    conflicts: List[List[str]] = []
    seen_conflicts: Set[tuple] = set()

    for folder_name, _, data in all_metadata:
        skill_id = data.get("skill_id", folder_name)
        family = data.get("family", "unknown")

        # Build families
        if family not in families:
            families[family] = []
        families[family].append(skill_id)

        # Build sparse adjacency
        edges = data.get("edges", {})
        skill_adj: Dict[str, dict] = {}

        # Keep core sparse edge groups in compiled output.
        for edge_type in ("depends_on", "enhances", "siblings", "prerequisite_for"):
            edge_list = edges.get(edge_type, [])
            if edge_list:
                targets = {}
                for edge in edge_list:
                    target = edge.get("target")
                    weight = edge.get("weight", 0.0)
                    if target and weight > 0.0:
                        targets[target] = weight
                if targets:
                    skill_adj[edge_type] = targets

        if skill_adj:
            adjacency[skill_id] = skill_adj

        # Collect conflicts
        for edge in edges.get("conflicts_with", []):
            target = edge.get("target")
            if target:
                pair = tuple(sorted([skill_id, target]))
                if pair not in seen_conflicts:
                    seen_conflicts.add(pair)
                    conflicts.append(list(pair))

    signals = {}
    for folder_name, _, data in all_metadata:
        skill_id = data.get("skill_id", folder_name)
        sigs = data.get("intent_signals", [])
        if sigs:
            signals[skill_id] = sigs

    # Sort family members
    for family in families:
        families[family] = sorted(families[family])

    hub_skills = compute_hub_skills(adjacency)

    return {
        "schema_version": COMPILED_SCHEMA_VERSION,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "skill_count": len(all_metadata),
        "families": dict(sorted(families.items())),
        "adjacency": dict(sorted(adjacency.items())),
        "signals": dict(sorted(signals.items())),
        "conflicts": sorted(conflicts),
        "hub_skills": hub_skills,
    }


# ───────────────────────────────────────────────────────────────
# 5. CLI
# ───────────────────────────────────────────────────────────────

def main() -> int:
    """Validate skill graph metadata and optionally compile the aggregated graph."""
    parser = argparse.ArgumentParser(
        description="Compile skill graph-metadata.json files into skill-graph.json",
    )
    parser.add_argument(
        "--validate-only",
        action="store_true",
        help="Validate all metadata files without writing output",
    )
    parser.add_argument(
        "--output",
        default=DEFAULT_OUTPUT,
        help=f"Output path (default: {DEFAULT_OUTPUT})",
    )
    parser.add_argument(
        "--pretty",
        action="store_true",
        help="Pretty-print JSON output",
    )
    args = parser.parse_args()

    # Discover
    all_metadata = discover_graph_metadata(SKILLS_DIR)
    print(f"Discovered {len(all_metadata)} skill graph-metadata.json files")

    if not all_metadata:
        print("ERROR: No graph-metadata.json files found", file=sys.stderr)
        return 2

    # Collect all skill IDs for cross-validation
    all_skill_ids = {data.get("skill_id", folder) for folder, _, data in all_metadata}

    # Validate
    total_errors = 0
    for folder_name, file_path, data in all_metadata:
        errors = validate_skill_metadata(folder_name, data, all_skill_ids)
        if errors:
            print(f"\nERRORS in {folder_name}:")
            for err in errors:
                print(f"  - {err}")
            total_errors += len(errors)

    dependency_cycle_errors = validate_dependency_cycles(all_metadata)
    if dependency_cycle_errors:
        print(f"\nDEPENDENCY CYCLE ERRORS ({len(dependency_cycle_errors)}):")
        for err in dependency_cycle_errors:
            print(f"  - {err}")
        total_errors += len(dependency_cycle_errors)

    # Symmetry warnings
    symmetry_warnings = validate_edge_symmetry(all_metadata)
    if symmetry_warnings:
        print(f"\nSYMMETRY WARNINGS ({len(symmetry_warnings)}):")
        for warn in symmetry_warnings:
            print(f"  - {warn}")

    zero_edge_warnings = validate_zero_edge_skills(all_metadata)
    if zero_edge_warnings:
        print(f"\nZERO-EDGE WARNINGS ({len(zero_edge_warnings)}):")
        for warn in zero_edge_warnings:
            print(f"  - {warn}")

    if total_errors > 0:
        print(f"\nVALIDATION FAILED: {total_errors} error(s)")
        return 2

    print("VALIDATION PASSED: all metadata files are valid")

    if args.validate_only:
        return 0

    # Compile
    graph = compile_graph(all_metadata)
    indent = 2 if args.pretty else None
    output_json = json.dumps(graph, indent=indent, ensure_ascii=False)

    # Write
    with open(args.output, "w", encoding="utf-8") as f:
        f.write(output_json)
        f.write("\n")

    size_bytes = len(output_json.encode("utf-8"))
    print(f"Compiled skill-graph.json: {size_bytes} bytes ({graph['skill_count']} skills)")
    print(f"  Families: {len(graph['families'])}")
    print(f"  Adjacency entries: {len(graph['adjacency'])}")
    print(f"  Conflicts: {len(graph['conflicts'])}")
    print(f"  Hub skills: {graph['hub_skills']}")
    print(f"  Output: {args.output}")

    if size_bytes > 4096:
        print(f"WARNING: Output exceeds 4KB target ({size_bytes} bytes)", file=sys.stderr)

    return 0


if __name__ == "__main__":
    sys.exit(main())
