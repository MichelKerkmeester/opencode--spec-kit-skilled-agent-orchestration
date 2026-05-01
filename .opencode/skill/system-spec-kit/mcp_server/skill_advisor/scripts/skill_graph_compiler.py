#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: SKILL GRAPH COMPILER
# ───────────────────────────────────────────────────────────────

"""
Skill Graph Compiler - Scans skill folders for graph-metadata.json,
validates schema, and compiles into a single skill-graph.json.

Usage:
    python skill_graph_compiler.py                    # Validate + compile in memory
    python skill_graph_compiler.py --validate-only    # Validate without writing
    python skill_graph_compiler.py --export-json      # Write compiled JSON to default output
    python skill_graph_compiler.py --pretty           # Human-readable output
    python skill_graph_compiler.py --output PATH      # Custom output path
"""

import argparse
import json
import os
import re
import sys
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Set, Tuple


# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────

SCRIPT_DIR = os.path.dirname(os.path.realpath(__file__))
SKILLS_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, "..", "..", "..", ".."))
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
# R-007-8 contract decision: affordance derived inputs MAY declare
# routing-direction edges (`depends_on`, `enhances`, `siblings`,
# `prerequisite_for`) but MUST NOT declare `conflicts_with`.
#
# Conflict semantics require authoritative reciprocal declarations
# in `edges.conflicts_with` (validated by `validate_edge_symmetry`),
# not derived/inferred affordance lanes. Allowing affordances to
# inject conflict edges would (a) bypass the bilateral-declaration
# invariant and (b) silently no-op anyway in `compile_graph` —
# either path violates the explicitness rule.
#
# Therefore we VALIDATE: any `conflicts_with`/`conflictsWith` field
# on an affordance is reported as `derived.affordances[i] has
# unsupported field(s)` by `validate_derived_affordances`. This
# closes R-007-8 with an explicit (validate, do not serialize)
# contract that mirrors `derived.entities` constraints.
AFFORDANCE_RELATION_FIELDS = {
    "dependsOn": "depends_on",
    "depends_on": "depends_on",
    "enhances": "enhances",
    "siblings": "siblings",
    "prerequisiteFor": "prerequisite_for",
    "prerequisite_for": "prerequisite_for",
}
# Reserved (rejected by validation) — kept here so the key set is
# explicit at the call site rather than implicit through a missing
# entry. Listed in `AFFORDANCE_REJECTED_RELATION_FIELDS` below.
AFFORDANCE_REJECTED_RELATION_FIELDS = frozenset({
    "conflictsWith",
    "conflicts_with",
})
AFFORDANCE_ALLOWED_FIELDS = {
    "skillId", "skill_id", "name", "triggers", "category",
    *AFFORDANCE_RELATION_FIELDS.keys(),
}
# R-007-9: broadened prompt-injection denylist. Mirrors the TS-side
# `INSTRUCTION_PATTERN` in `affordance-normalizer.ts` so both compile-
# time (Python) and score-time (TypeScript) input paths reject the
# same set of injection-shaped phrases. Real-world corpora include
# synonyms (disregard/override/forget), directional variants
# (above/prior/earlier/all/any), reveal-prompt probes, role-prefix
# variants (user:/human:), and bracketed/angled role markers
# (`[INST]`, `<system>`). Anchoring matches the TS pattern: keyword
# branches use `(?:^|\s|\b)` so legitimate phrases like "ignore the
# cache" or "system call audit" pass.
AFFORDANCE_INSTRUCTION_PATTERN = re.compile(
    r"(?:"
    r"(?:^|\s|\b)(?:"
    r"(?:ignore|disregard|forget|skip|bypass|override)\s+"
    r"(?:the\s+)?(?:previous|prior|earlier|above|all|any)"
    r"(?:\s+(?:and\s+)?(?:previous|prior|earlier|above|all|any))*\s+"
    r"(?:instruction|instructions|prompt|prompts|directions?|"
    r"rule|rules|context|guidance|message|messages|system\s+prompt)|"
    r"override\s+system\s+(?:prompt|message|instructions)|"
    r"new\s+instructions?\s*:|"
    r"reveal\s+(?:the\s+)?(?:system|developer)\s+"
    r"(?:prompt|instruction|instructions)|"
    r"system\s*:|developer\s*:|assistant\s*:|user\s*:|human\s*:|"
    r"execute\s*:|instruction\s*:"
    r")|"
    r"\[\s*(?:system|developer|assistant|user|human|inst|instruction)\s*\]|"
    r"<\s*(?:system|developer|assistant|user|human)\s*>"
    r")",
    re.IGNORECASE,
)
AFFORDANCE_EMAIL_PATTERN = re.compile(r"\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b", re.IGNORECASE)
AFFORDANCE_URL_PATTERN = re.compile(r"\bhttps?://\S+|\bwww\.\S+", re.IGNORECASE)
AFFORDANCE_TOKEN_PATTERN = re.compile(r"\b(?:bearer|token|secret|apikey|api_key)\s*[:=]\s*\S+", re.IGNORECASE)


# ───────────────────────────────────────────────────────────────
# R-007-P2-9: Affordance normalization debug counters
# ───────────────────────────────────────────────────────────────
# Mirror of the TS-side counters in
# `skill_advisor/lib/affordance-normalizer.ts`. Operators can read these via
# `get_affordance_normalizer_counters()` to diagnose why affordance evidence
# does or does not reach the compiled graph. Counters are monotonic across
# the lifetime of the process; tests may call
# `reset_affordance_normalizer_counters()` between cases.
#
# Drop category semantics:
#   - `received`             : raw affordance inputs handed to
#                              `normalize_affordance_input()`
#   - `accepted`             : inputs that produced a normalized affordance
#   - `dropped_unknown_skill`: skillId missing or scrubbed to empty
#   - `dropped_unsafe`       : retained for future prompt-injection / sanitizer
#                              drop tracking (currently unused because the
#                              sanitizer scrubs at the phrase level rather
#                              than rejecting whole inputs)
#   - `dropped_empty`        : skillId resolved but no triggers + no edges

AFFORDANCE_NORMALIZER_COUNTERS: Dict[str, int] = {
    "received": 0,
    "accepted": 0,
    "dropped_unsafe": 0,
    "dropped_empty": 0,
    "dropped_unknown_skill": 0,
}


def get_affordance_normalizer_counters() -> Dict[str, int]:
    """Return a copy of the affordance-normalizer drop counters."""
    return dict(AFFORDANCE_NORMALIZER_COUNTERS)


def reset_affordance_normalizer_counters() -> None:
    """Reset the affordance-normalizer drop counters (test helper)."""
    for key in AFFORDANCE_NORMALIZER_COUNTERS:
        AFFORDANCE_NORMALIZER_COUNTERS[key] = 0


# ───────────────────────────────────────────────────────────────
# 2. DISCOVERY
# ───────────────────────────────────────────────────────────────

def discover_graph_metadata(skills_dir: str) -> List[Tuple[str, str, dict]]:
    """Scan skill folders for graph-metadata.json files.

    Returns list of (skill_folder_name, file_path, parsed_json) tuples.
    Skills without graph-metadata.json are silently skipped.

    Raises:
        RuntimeError: If any graph-metadata.json file is corrupt or unreadable,
            to prevent downstream consumers from operating on an incomplete graph.
    """
    results = []
    corrupt: List[Tuple[str, str]] = []

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
            corrupt.append((meta_path, str(exc)))

    advisor_meta_path = os.path.join(
        skills_dir,
        "system-spec-kit",
        "mcp_server",
        "skill_advisor",
        "graph-metadata.json",
    )
    # Folder + skill_id are both snake_case after commit 7dfd108 ("align skill_id
    # with folder name (skill_advisor)"). The injected entry must use the same
    # snake_case form so the validator's folder_name == skill_id check passes.
    if os.path.isfile(advisor_meta_path) and not any(folder == "skill_advisor" for folder, _, _ in results):
        try:
            with open(advisor_meta_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            results.append(("skill_advisor", advisor_meta_path, data))
        except (json.JSONDecodeError, OSError) as exc:
            corrupt.append((advisor_meta_path, str(exc)))

    if corrupt:
        details = "; ".join(f"{path}: {err}" for path, err in corrupt)
        raise RuntimeError(
            f"Corrupt or unreadable graph-metadata.json files detected "
            f"({len(corrupt)} file(s)): {details}"
        )

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
        errors.extend(validate_derived_metadata(folder_name, data.get("derived"), all_skill_ids))

    return errors


def validate_derived_metadata(folder_name: str, derived: Any, all_skill_ids: Set[str]) -> List[str]:
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
    # The advisor's own metadata lives under the nested mcp_server tree, not at the
    # top-level skills_dir. Fall back to the canonical path when the flat lookup misses.
    if folder_name == "skill_advisor" and not os.path.isdir(skill_dir):
        skill_dir = os.path.join(SKILLS_DIR, "system-spec-kit", "mcp_server", "skill_advisor")
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
        candidate = os.path.normpath(os.path.join(skill_dir, rel_path))
        if not candidate.startswith(os.path.normpath(skill_dir) + os.sep) and candidate != os.path.normpath(skill_dir):
            errors.append(f"derived.source_docs[{index}] path traversal detected: {rel_path}")
            continue
        if not os.path.isfile(candidate):
            errors.append(f"derived.source_docs[{index}] path does not exist: {rel_path}")

    for index, file_path in enumerate(derived.get("key_files", [])):
        if not isinstance(file_path, str) or not file_path.strip():
            errors.append(f"derived.key_files[{index}] must be a non-empty string")
            continue
        resolved_path = os.path.normpath(os.path.join(repo_root, file_path))
        if not resolved_path.startswith(os.path.normpath(repo_root) + os.sep) and resolved_path != os.path.normpath(repo_root):
            errors.append(f"derived.key_files[{index}] path traversal detected: {file_path}")
            continue
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
            resolved_path = os.path.normpath(os.path.join(repo_root, entity_path))
            if not resolved_path.startswith(os.path.normpath(repo_root) + os.sep) and resolved_path != os.path.normpath(repo_root):
                errors.append(f"derived.entities[{index}].path traversal detected: {entity_path}")
            elif not os.path.isfile(resolved_path):
                errors.append(f"derived.entities[{index}].path does not exist: {entity_path}")

    errors.extend(validate_derived_affordances(folder_name, derived, all_skill_ids))

    return errors


def sanitize_affordance_phrase(value: Any) -> Optional[str]:
    """Return a privacy-stripped, prompt-safe affordance phrase."""
    if not isinstance(value, str):
        return None
    stripped = AFFORDANCE_URL_PATTERN.sub(" ", value)
    stripped = AFFORDANCE_EMAIL_PATTERN.sub(" ", stripped)
    stripped = AFFORDANCE_TOKEN_PATTERN.sub(" ", stripped)
    if AFFORDANCE_INSTRUCTION_PATTERN.search(stripped):
        return None
    cleaned = re.sub(r"[\x00-\x1f\x7f]", " ", stripped)
    cleaned = re.sub(r"[^A-Za-z0-9:/._ -]+", " ", cleaned)
    cleaned = re.sub(r"\s+", " ", cleaned).strip().lower()
    if len(cleaned) < 2:
        return None
    return cleaned[:80]


def sanitize_affordance_skill_id(value: Any) -> Optional[str]:
    """Normalize a skill id without creating a compiler entity kind."""
    if not isinstance(value, str):
        return None
    cleaned = re.sub(r"[^a-z0-9_-]+", "-", value.strip().lower()).strip("-")
    return cleaned or None


def normalize_affordance_edges(raw_affordance: dict) -> List[dict]:
    """Convert allowlisted relation fields into existing edge types."""
    normalized: List[dict] = []
    for field_name, edge_type in AFFORDANCE_RELATION_FIELDS.items():
        raw_edges = raw_affordance.get(field_name)
        if raw_edges is None:
            continue
        if not isinstance(raw_edges, list):
            continue
        for raw_edge in raw_edges:
            if isinstance(raw_edge, str):
                target = sanitize_affordance_skill_id(raw_edge)
                weight = 0.7
            elif isinstance(raw_edge, dict):
                target = sanitize_affordance_skill_id(
                    raw_edge.get("targetSkillId")
                    or raw_edge.get("target_skill_id")
                    or raw_edge.get("target")
                )
                raw_weight = raw_edge.get("weight")
                weight = raw_weight if isinstance(raw_weight, (int, float)) else 0.7
            else:
                continue
            if target:
                normalized.append({
                    "edge_type": edge_type,
                    "target": target,
                    "weight": max(0.0, min(1.0, float(weight))),
                })
    return normalized[:12]


def normalize_affordance_input(raw_affordance: Any) -> Optional[dict]:
    """Normalize one allowlisted affordance object for derived inputs.

    R-007-P2-9: Bumps `AFFORDANCE_NORMALIZER_COUNTERS` to give operators
    visibility into how many affordance inputs are received, accepted, and
    dropped (and why) when compiling the skill graph.
    """
    AFFORDANCE_NORMALIZER_COUNTERS["received"] += 1

    if not isinstance(raw_affordance, dict):
        AFFORDANCE_NORMALIZER_COUNTERS["dropped_unknown_skill"] += 1
        return None

    skill_id = sanitize_affordance_skill_id(
        raw_affordance.get("skillId")
        or raw_affordance.get("skill_id")
    )
    if not skill_id:
        AFFORDANCE_NORMALIZER_COUNTERS["dropped_unknown_skill"] += 1
        return None

    triggers: List[str] = []
    for raw_phrase in (
        raw_affordance.get("name"),
        raw_affordance.get("category"),
    ):
        phrase = sanitize_affordance_phrase(raw_phrase)
        if phrase:
            triggers.append(phrase)

    raw_triggers = raw_affordance.get("triggers")
    if isinstance(raw_triggers, list):
        for raw_trigger in raw_triggers:
            phrase = sanitize_affordance_phrase(raw_trigger)
            if phrase:
                triggers.append(phrase)

    deduped_triggers = list(dict.fromkeys(triggers))[:12]
    edges = normalize_affordance_edges(raw_affordance)
    if not deduped_triggers and not edges:
        AFFORDANCE_NORMALIZER_COUNTERS["dropped_empty"] += 1
        return None
    AFFORDANCE_NORMALIZER_COUNTERS["accepted"] += 1
    return {
        "skill_id": skill_id,
        "derived_triggers": deduped_triggers,
        "edges": edges,
    }


def normalized_affordances(derived: Any) -> List[dict]:
    """Return normalized affordances from a derived metadata object."""
    if not isinstance(derived, dict):
        return []
    raw_affordances = derived.get("affordances")
    if raw_affordances is None:
        return []
    if not isinstance(raw_affordances, list):
        return []
    return [
        affordance for affordance in (
            normalize_affordance_input(raw_affordance)
            for raw_affordance in raw_affordances
        )
        if affordance is not None
    ]


def validate_derived_affordances(folder_name: str, derived: dict, all_skill_ids: Set[str]) -> List[str]:
    """Validate affordance-derived inputs without extending entity kinds."""
    errors = []
    raw_affordances = derived.get("affordances")
    if raw_affordances is None:
        return errors
    if not isinstance(raw_affordances, list):
        return ["derived.affordances must be an array when present"]

    for index, raw_affordance in enumerate(raw_affordances):
        if not isinstance(raw_affordance, dict):
            errors.append(f"derived.affordances[{index}] must be an object")
            continue
        # R-007-8: conflict edges from affordances are explicitly
        # rejected. Report them BEFORE the generic "unsupported
        # field" message so operators see a contract reason, not a
        # generic allowlist miss.
        rejected = AFFORDANCE_REJECTED_RELATION_FIELDS & set(raw_affordance.keys())
        if rejected:
            errors.append(
                f"derived.affordances[{index}] declares reserved field(s) "
                f"{sorted(rejected)}: conflict edges require an authoritative "
                f"reciprocal declaration in `edges.conflicts_with` and cannot "
                f"be derived from affordances"
            )
        unexpected = (
            set(raw_affordance.keys())
            - AFFORDANCE_ALLOWED_FIELDS
            - AFFORDANCE_REJECTED_RELATION_FIELDS
            - {"description"}
        )
        if unexpected:
            errors.append(
                f"derived.affordances[{index}] has unsupported field(s): "
                f"{sorted(unexpected)}"
            )
        normalized = normalize_affordance_input(raw_affordance)
        if normalized is None:
            errors.append(f"derived.affordances[{index}] has no usable allowlisted fields")
            continue
        if normalized["skill_id"] != folder_name:
            errors.append(
                f"derived.affordances[{index}].skillId must match owning skill "
                f"{folder_name!r}, got {normalized['skill_id']!r}"
            )
        for edge in normalized["edges"]:
            target = edge["target"]
            if target not in all_skill_ids:
                errors.append(
                    f"derived.affordances[{index}].{edge['edge_type']} "
                    f"target {target!r} is not a known skill"
                )
    return errors


def normalized_edges(data: dict) -> Dict[str, List[dict]]:
    """Return only well-formed edge lists for cross-file validators."""
    raw_edges = data.get("edges", {})
    if not isinstance(raw_edges, dict):
        return {}

    edge_groups: Dict[str, List[dict]] = {}
    for edge_type in EDGE_TYPES:
        raw_edge_list = raw_edges.get(edge_type, [])
        if not isinstance(raw_edge_list, list):
            edge_groups[edge_type] = []
            continue
        edge_groups[edge_type] = [
            edge for edge in raw_edge_list
            if isinstance(edge, dict)
        ]
    return edge_groups


def validate_edge_symmetry(
    all_metadata: List[Tuple[str, str, dict]],
) -> List[str]:
    """Cross-validate edge symmetry across all skills.

    Checks:
    - if A depends_on B, B should have prerequisite_for A
    - if A has sibling B, B should have sibling A
    - if A conflicts_with B, B should have conflicts_with A

    Returns list of warning-shaped messages. These are emitted as symmetry
    warnings, and the CLI treats them as topology violations.
    """
    warnings = []

    # Build lookup
    skill_edges = {}
    for folder_name, _, data in all_metadata:
        skill_id = data.get("skill_id", folder_name)
        skill_edges[skill_id] = normalized_edges(data)

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

    # Check conflicts_with symmetry
    for skill_id, edges in skill_edges.items():
        for edge in edges.get("conflicts_with", []):
            target = edge.get("target")
            if not target or target not in skill_edges:
                continue
            target_conflicts = {
                e.get("target") for e in skill_edges[target].get("conflicts_with", [])
            }
            if skill_id not in target_conflicts:
                warnings.append(
                    f"SYMMETRY: {skill_id} conflicts_with {target}, "
                    f"but {target} missing conflicts_with {skill_id}"
                )

    return warnings


# Per-edge-type recommended weight bands (spec-defined)
WEIGHT_BANDS: Dict[str, Tuple[float, float]] = {
    "depends_on": (0.7, 1.0),
    "prerequisite_for": (0.7, 1.0),
    "enhances": (0.3, 0.7),
    "siblings": (0.4, 0.6),
    "conflicts_with": (0.5, 1.0),
}


def validate_weight_bands(
    all_metadata: List[Tuple[str, str, dict]],
) -> List[str]:
    """Warn when edge weights fall outside their per-type recommended bands.

    Returns list of warnings (soft validation - does not block compilation).
    """
    warnings = []

    for folder_name, _, data in all_metadata:
        skill_id = data.get("skill_id", folder_name)
        edges = normalized_edges(data)
        for edge_type, (lo, hi) in WEIGHT_BANDS.items():
            for i, edge in enumerate(edges.get(edge_type, [])):
                weight = edge.get("weight")
                if isinstance(weight, (int, float)) and not (lo <= weight <= hi):
                    warnings.append(
                        f"WEIGHT-BAND: {skill_id} edges.{edge_type}[{i}] "
                        f"weight {weight} outside recommended band [{lo}, {hi}]"
                    )

    return warnings


def validate_weight_parity(
    all_metadata: List[Tuple[str, str, dict]],
) -> List[str]:
    """Warn when reciprocal edge weights differ by more than 0.1.

    Checks depends_on/prerequisite_for and siblings pairs.
    Returns list of warnings (soft validation).
    """
    warnings = []

    # Build lookup: skill_id -> edges dict
    skill_edges: Dict[str, dict] = {}
    for folder_name, _, data in all_metadata:
        skill_id = data.get("skill_id", folder_name)
        skill_edges[skill_id] = normalized_edges(data)

    # Check depends_on <-> prerequisite_for weight parity
    for skill_id, edges in skill_edges.items():
        for edge in edges.get("depends_on", []):
            target = edge.get("target")
            weight = edge.get("weight")
            if not target or target not in skill_edges or not isinstance(weight, (int, float)):
                continue
            for recip in skill_edges[target].get("prerequisite_for", []):
                if recip.get("target") == skill_id:
                    recip_weight = recip.get("weight")
                    if isinstance(recip_weight, (int, float)) and abs(weight - recip_weight) > 0.1:
                        warnings.append(
                            f"WEIGHT-PARITY: {skill_id} depends_on {target} "
                            f"weight={weight} vs {target} prerequisite_for "
                            f"{skill_id} weight={recip_weight} (diff > 0.1)"
                        )
                    break

    # Check siblings weight parity
    for skill_id, edges in skill_edges.items():
        for edge in edges.get("siblings", []):
            target = edge.get("target")
            weight = edge.get("weight")
            if not target or target not in skill_edges or not isinstance(weight, (int, float)):
                continue
            if target <= skill_id:
                continue  # Check each pair only once
            for recip in skill_edges[target].get("siblings", []):
                if recip.get("target") == skill_id:
                    recip_weight = recip.get("weight")
                    if isinstance(recip_weight, (int, float)) and abs(weight - recip_weight) > 0.1:
                        warnings.append(
                            f"WEIGHT-PARITY: {skill_id} siblings {target} "
                            f"weight={weight} vs {target} siblings "
                            f"{skill_id} weight={recip_weight} (diff > 0.1)"
                        )
                    break

    return warnings


def validate_zero_edge_skills(
    all_metadata: List[Tuple[str, str, dict]],
) -> List[str]:
    """Warn when a skill has no graph edges across any supported edge type."""
    warnings = []

    for folder_name, _, data in all_metadata:
        skill_id = data.get("skill_id", folder_name)
        edges = normalized_edges(data)

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
    """Detect arbitrary-length depends_on cycles via DFS color marking."""
    errors = []
    depends_on_lookup: Dict[str, Set[str]] = {}
    seen_cycles: Set[Tuple[str, ...]] = set()
    white, gray, black = 0, 1, 2

    for folder_name, _, data in all_metadata:
        skill_id = data.get("skill_id", folder_name)
        edges = normalized_edges(data)
        targets: Set[str] = set()

        for edge in edges.get("depends_on", []):
            target = edge.get("target")
            if target:
                targets.add(target)

        depends_on_lookup[skill_id] = targets

    node_colors = {
        skill_id: white
        for skill_id in depends_on_lookup
    }
    stack: List[str] = []
    stack_positions: Dict[str, int] = {}

    def canonicalize_cycle(cycle_nodes: List[str]) -> Tuple[str, ...]:
        open_cycle = cycle_nodes[:-1]
        rotations = [
            tuple(open_cycle[index:] + open_cycle[:index])
            for index in range(len(open_cycle))
        ]
        return min(rotations)

    def visit(skill_id: str) -> None:
        node_colors[skill_id] = gray
        stack_positions[skill_id] = len(stack)
        stack.append(skill_id)

        for target in sorted(depends_on_lookup.get(skill_id, set())):
            if target not in node_colors:
                continue

            if node_colors[target] == white:
                visit(target)
                continue

            if node_colors[target] != gray:
                continue

            cycle = canonicalize_cycle(stack[stack_positions[target]:] + [target])
            if cycle in seen_cycles:
                continue

            seen_cycles.add(cycle)
            cycle_path = " -> ".join((*cycle, cycle[0]))
            errors.append(f"depends_on cycle detected: {cycle_path}")

        stack.pop()
        stack_positions.pop(skill_id, None)
        node_colors[skill_id] = black

    for skill_id in sorted(depends_on_lookup):
        if node_colors[skill_id] == white:
            visit(skill_id)

    return errors


def emit_validation_messages(
    title: str,
    messages: List[str],
    *,
    stream: Optional[Any] = None,
) -> None:
    """Emit a formatted validation block to the selected stream."""
    if not messages:
        return

    if stream is None:
        stream = sys.stderr

    print(f"\n{title} ({len(messages)}):", file=stream)
    for message in messages:
        print(f"  - {message}", file=stream)


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


def compile_graph(
    all_metadata: List[Tuple[str, str, dict]],
    topology_warnings: Optional[Dict[str, List[str]]] = None,
) -> dict:
    """Compile all per-skill metadata into a single skill-graph.json.

    Args:
        all_metadata: Per-skill parsed graph-metadata.json tuples.
        topology_warnings: Optional dict of advisory warning-category → messages
            captured during validation (R45-003 T-SGC-02 durability fix).
            When supplied, the compiled output serializes them under the
            ``topology_warnings`` key so downstream consumers
            (``health_check()``) can detect degraded topology state without
            re-running validation.
    """
    families: Dict[str, List[str]] = {}
    adjacency: Dict[str, dict] = {}
    known_skill_ids = {
        data.get("skill_id", folder_name)
        for folder_name, _, data in all_metadata
    }
    # T-SGC-03 / T-SAP-04 (R46-002): only emit `conflicts` pairs when BOTH
    # sides declared `conflicts_with` for each other. Unilateral declarations
    # are upstream-gated to exit 2 by `validate_edge_symmetry()`, but the
    # serialized contract makes reciprocity explicit so runtime consumers
    # (`_apply_graph_conflict_penalty`) cannot accidentally penalize a
    # non-declaring skill if validation is bypassed.
    declared_conflicts: Dict[str, Set[str]] = {}

    for folder_name, _, data in all_metadata:
        skill_id = data.get("skill_id", folder_name)
        family = data.get("family", "unknown")

        # Build families
        if family not in families:
            families[family] = []
        families[family].append(skill_id)

        # Build sparse adjacency
        edges = normalized_edges(data)
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

        for affordance in normalized_affordances(data.get("derived")):
            for edge in affordance.get("edges", []):
                edge_type = edge.get("edge_type")
                if edge_type not in ("depends_on", "enhances", "siblings", "prerequisite_for"):
                    continue
                target = edge.get("target")
                weight = edge.get("weight", 0.0)
                if target in known_skill_ids and isinstance(weight, (int, float)) and weight > 0.0:
                    skill_adj.setdefault(edge_type, {})[target] = weight

        if skill_adj:
            adjacency[skill_id] = skill_adj

        # Record directional conflict declarations for the reciprocity pass.
        for edge in edges.get("conflicts_with", []):
            target = edge.get("target")
            if target:
                declared_conflicts.setdefault(skill_id, set()).add(target)

    # Now emit only mutually-declared conflict pairs.
    conflicts: List[List[str]] = []
    seen_conflicts: Set[tuple] = set()
    for skill_id, targets in declared_conflicts.items():
        for target in targets:
            if skill_id not in declared_conflicts.get(target, set()):
                # Defensive: upstream validation should have caught this.
                continue
            pair = tuple(sorted([skill_id, target]))
            if pair not in seen_conflicts:
                seen_conflicts.add(pair)
                conflicts.append(list(pair))

    signals = {}
    for folder_name, _, data in all_metadata:
        skill_id = data.get("skill_id", folder_name)
        sigs = list(data.get("intent_signals", []))
        for affordance in normalized_affordances(data.get("derived")):
            sigs.extend(affordance.get("derived_triggers", []))
        if sigs:
            signals[skill_id] = list(dict.fromkeys(sigs))

    # Sort family members
    for family in families:
        families[family] = sorted(families[family])

    hub_skills = compute_hub_skills(adjacency)

    # Normalize and embed topology warnings so that `health_check()` can
    # report degraded state without re-running validation (R45-003).
    serialized_warnings: Dict[str, List[str]] = {}
    if topology_warnings:
        for category, messages in topology_warnings.items():
            if not messages:
                continue
            # Copy to break aliasing; sort for stable output.
            serialized_warnings[str(category)] = sorted(str(m) for m in messages)

    return {
        "schema_version": COMPILED_SCHEMA_VERSION,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "skill_count": len(all_metadata),
        "families": dict(sorted(families.items())),
        "adjacency": dict(sorted(adjacency.items())),
        "signals": dict(sorted(signals.items())),
        "conflicts": sorted(conflicts),
        "hub_skills": hub_skills,
        "topology_warnings": dict(sorted(serialized_warnings.items())),
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
    parser.add_argument(
        "--export-json",
        action="store_true",
        help="Write compiled JSON output to disk",
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
    topology_violations = 0
    for folder_name, file_path, data in all_metadata:
        errors = validate_skill_metadata(folder_name, data, all_skill_ids)
        if errors:
            emit_validation_messages(f"ERRORS in {folder_name}", errors)
            total_errors += len(errors)

    dependency_cycle_errors = validate_dependency_cycles(all_metadata)
    if dependency_cycle_errors:
        emit_validation_messages("DEPENDENCY CYCLE ERRORS", dependency_cycle_errors)
        total_errors += len(dependency_cycle_errors)

    # Symmetry and zero-edge warnings remain warning-shaped output, but they now
    # fail validation because the compiled graph is used as routing authority.
    symmetry_warnings = validate_edge_symmetry(all_metadata)
    emit_validation_messages("SYMMETRY WARNINGS", symmetry_warnings)
    topology_violations += len(symmetry_warnings)

    weight_band_warnings = validate_weight_bands(all_metadata)
    emit_validation_messages("WEIGHT-BAND WARNINGS", weight_band_warnings)

    weight_parity_warnings = validate_weight_parity(all_metadata)
    emit_validation_messages("WEIGHT-PARITY WARNINGS", weight_parity_warnings)

    zero_edge_warnings = validate_zero_edge_skills(all_metadata)
    emit_validation_messages("ZERO-EDGE WARNINGS", zero_edge_warnings)
    topology_violations += len(zero_edge_warnings)

    if total_errors > 0 or topology_violations > 0:
        total_failures = total_errors + topology_violations
        print(f"\nVALIDATION FAILED: {total_failures} error(s)", file=sys.stderr)
        return 2

    print("VALIDATION PASSED: all metadata files are valid")

    if args.validate_only:
        return 0

    # T-SGC-02 (R45-003): Serialize advisory warnings into the compiled graph so
    # downstream `health_check()` consumers can report degraded state without
    # re-running validation. Hard-blocking categories (SYMMETRY, ZERO-EDGE,
    # DEPENDENCY CYCLE) already gate this path via the exit above; only truly
    # advisory warnings (WEIGHT-BAND, WEIGHT-PARITY) remain at this point.
    topology_warnings_payload: Dict[str, List[str]] = {}
    if weight_band_warnings:
        topology_warnings_payload["weight_band"] = list(weight_band_warnings)
    if weight_parity_warnings:
        topology_warnings_payload["weight_parity"] = list(weight_parity_warnings)

    # Compile
    graph = compile_graph(all_metadata, topology_warnings=topology_warnings_payload)
    output_json = None
    size_bytes = None
    if args.export_json:
        indent = 2 if args.pretty else None
        output_json = json.dumps(graph, indent=indent, ensure_ascii=False)

        with open(args.output, "w", encoding="utf-8") as f:
            f.write(output_json)
            f.write("\n")

        size_bytes = len(output_json.encode("utf-8"))
        print(f"Compiled skill-graph.json: {size_bytes} bytes ({graph['skill_count']} skills)")
    else:
        print(f"Compiled skill graph in memory ({graph['skill_count']} skills)")

    print(f"  Families: {len(graph['families'])}")
    print(f"  Adjacency entries: {len(graph['adjacency'])}")
    print(f"  Conflicts: {len(graph['conflicts'])}")
    print(f"  Hub skills: {graph['hub_skills']}")
    if args.export_json:
        print(f"  Output: {args.output}")
    else:
        print("  Output: skipped (use --export-json to write skill-graph.json)")

    if size_bytes is not None and size_bytes > 4096:
        print(f"WARNING: Output exceeds 4KB target ({size_bytes} bytes)", file=sys.stderr)

    return 0


if __name__ == "__main__":
    sys.exit(main())
