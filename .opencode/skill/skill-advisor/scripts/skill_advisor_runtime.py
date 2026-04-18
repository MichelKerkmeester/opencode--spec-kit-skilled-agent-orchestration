#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: SKILL ADVISOR RUNTIME
# ───────────────────────────────────────────────────────────────

"""Runtime helpers for skill_advisor.py.

Usage: imported by `.opencode/skill/scripts/skill_advisor.py`
Output: cached skill records with normalized metadata and mtime invalidation.
"""

from __future__ import annotations

# ───────────────────────────────────────────────────────────────
# 1. IMPORTS
# ───────────────────────────────────────────────────────────────

import glob
import os
import re
from typing import Any, Dict, Iterable, Optional, Set, Tuple


# ───────────────────────────────────────────────────────────────
# 2. CACHE STATE
# ───────────────────────────────────────────────────────────────

_CACHE: Dict[str, Any] = {
    "signature": None,
    "records": None,
    "skipped": [],
}

KEYWORDS_COMMENT_RE = re.compile(
    r"^\s*<!--\s*Keywords\s*:\s*(.*?)\s*-->\s*$",
    re.IGNORECASE,
)


def _split_keywords(raw_value: str) -> list[str]:
    """Split comma-separated keyword metadata while trimming blanks."""
    return [
        keyword.strip()
        for keyword in raw_value.split(",")
        if keyword.strip()
    ]


# ───────────────────────────────────────────────────────────────
# 3. FRONTMATTER PARSING
# ───────────────────────────────────────────────────────────────

def parse_frontmatter_fast(file_path: str) -> Optional[Dict[str, str]]:
    """Parse only the frontmatter block from SKILL.md."""
    try:
        with open(file_path, "r", encoding="utf-8") as handle:
            first_line = handle.readline()
            if first_line.strip() != "---":
                return None

            data: Dict[str, str] = {}
            for line in handle:
                stripped = line.rstrip("\n")
                if stripped.strip() == "---":
                    break

                if ":" not in stripped:
                    continue

                key, value = stripped.split(":", 1)
                value = value.strip()
                if len(value) >= 2 and value[0] == value[-1] and value[0] in ('"', "'"):
                    value = value[1:-1]
                data[key.strip()] = value
            else:
                return None

            for line in handle:
                stripped = line.strip()
                if not stripped:
                    continue

                keyword_match = KEYWORDS_COMMENT_RE.match(stripped)
                if keyword_match:
                    discovered_keywords = _split_keywords(keyword_match.group(1))
                    if discovered_keywords:
                        existing_keywords = _split_keywords(data.get("keywords", ""))
                        merged_keywords: list[str] = []
                        seen_keywords: Set[str] = set()
                        for keyword in existing_keywords + discovered_keywords:
                            normalized = keyword.lower()
                            if normalized in seen_keywords:
                                continue
                            seen_keywords.add(normalized)
                            merged_keywords.append(keyword)
                        if merged_keywords:
                            data["keywords"] = ", ".join(merged_keywords)
                    continue

                if stripped.startswith("<!--") and stripped.endswith("-->"):
                    continue

                return data

            return data

    except (OSError, UnicodeDecodeError, ValueError):
        return None

    return None


# ───────────────────────────────────────────────────────────────
# 4. METADATA NORMALIZATION
# ───────────────────────────────────────────────────────────────

def _normalize_terms(text: str, stop_words: Set[str]) -> Set[str]:
    """Normalize free-form text into comparable lowercase term tokens."""
    terms = re.findall(r"\b\w+\b", text.lower())
    return {term for term in terms if len(term) > 2 and term not in stop_words}


def _build_variants(skill_name: str) -> Set[str]:
    """Build slash, dollar, and spacing variants for a skill identifier."""
    lowered = skill_name.lower()
    return {
        lowered,
        f"${lowered}",
        f"/{lowered}",
        lowered.replace("-", " "),
        lowered.replace("-", "_"),
    }


def _build_keyword_variants(keywords: str) -> Set[str]:
    """Build normalized phrase variants from keyword metadata."""
    variants: Set[str] = set()
    for keyword in _split_keywords(keywords):
        lowered = keyword.lower()
        variants.update({
            lowered,
            lowered.replace("-", " "),
            lowered.replace("_", " "),
            lowered.replace("-", "_"),
        })
    return {variant for variant in variants if variant}


# ───────────────────────────────────────────────────────────────
# 5. SKILL RECORD BUILDERS
# ───────────────────────────────────────────────────────────────

def _discover_skill_files(skills_dir: str) -> list[str]:
    """Discover every `SKILL.md` file under the top-level skills directory."""
    pattern = os.path.join(skills_dir, "*/SKILL.md")
    return sorted(glob.glob(pattern))


def _compute_signature(file_paths: Iterable[str]) -> Tuple[Tuple[str, int, int], ...]:
    """Capture file mtimes and sizes for cache invalidation."""
    signature: list[Tuple[str, int, int]] = []
    for path in file_paths:
        try:
            stats = os.stat(path)
            signature.append((path, int(stats.st_mtime_ns), int(stats.st_size)))
        except OSError:
            signature.append((path, -1, -1))
    return tuple(signature)


def _build_skill_record(
    file_path: str,
    stop_words: Set[str],
) -> Optional[Tuple[str, Dict[str, Any]]]:
    """Build one normalized cache record from a skill frontmatter file."""
    meta = parse_frontmatter_fast(file_path)
    if not meta:
        return None

    name = meta.get("name", "").strip()
    if not name:
        return None

    description = meta.get("description", "")
    keywords = meta.get("keywords", "")
    name_terms = _normalize_terms(name.replace("-", " "), stop_words)
    corpus_terms = _normalize_terms(description, stop_words)
    variants = _build_variants(name)
    keyword_variants = _build_keyword_variants(keywords)

    return (
        name,
        {
            "name": name,
            "description": description,
            "keywords": keywords,
            "keyword_variants": keyword_variants,
            "kind": "skill",
            "source": "skill",
            "path": file_path,
            "name_terms": name_terms,
            "corpus_terms": corpus_terms,
            "variants": variants,
        },
    )


def _clone_records(records: Dict[str, Dict[str, Any]]) -> Dict[str, Dict[str, Any]]:
    """Clone cached records so callers cannot mutate shared cache state."""
    cloned: Dict[str, Dict[str, Any]] = {}
    for name, record in records.items():
        cloned[name] = {
            "name": record.get("name", name),
            "description": record.get("description", ""),
            "keywords": record.get("keywords", ""),
            "keyword_variants": set(record.get("keyword_variants", set())),
            "kind": record.get("kind", "skill"),
            "source": record.get("source", "skill"),
            "path": record.get("path"),
            "name_terms": set(record.get("name_terms", set())),
            "corpus_terms": set(record.get("corpus_terms", set())),
            "variants": set(record.get("variants", set())),
        }
    return cloned


# ───────────────────────────────────────────────────────────────
# 6. PUBLIC CACHE API
# ───────────────────────────────────────────────────────────────

def get_cached_skill_records(
    skills_dir: str,
    stop_words: Set[str],
    force_refresh: bool = False,
) -> Dict[str, Dict[str, Any]]:
    """Return cached skill records with mtime invalidation.

    Tracks SKILL.md files that were discovered but could not be parsed,
    exposing them via ``get_cache_status()`` so callers can detect
    degraded state instead of assuming a healthy cache.
    """
    skill_files = _discover_skill_files(skills_dir)
    signature = _compute_signature(skill_files)

    if not force_refresh and _CACHE["signature"] == signature and _CACHE["records"] is not None:
        return _clone_records(_CACHE["records"])

    records: Dict[str, Dict[str, Any]] = {}
    skipped: list[str] = []
    for file_path in skill_files:
        built = _build_skill_record(file_path, stop_words)
        if built is None:
            skipped.append(file_path)
            continue
        name, record = built
        records[name] = record

    _CACHE["signature"] = signature
    _CACHE["records"] = records
    _CACHE["skipped"] = skipped

    if skipped:
        print(
            f"WARNING: {len(skipped)} SKILL.md file(s) could not be parsed "
            f"and were dropped: {', '.join(skipped)}",
            file=__import__('sys').stderr,
        )

    return _clone_records(records)


def get_cache_status() -> Dict[str, Any]:
    """Expose cache diagnostics for health output."""
    records = _CACHE.get("records")
    skipped = _CACHE.get("skipped") or []
    cached = records is not None
    return {
        "cached": cached,
        "cached_records": len(records or {}),
        "skipped_files": len(skipped),
        "skipped_paths": list(skipped),
        "healthy": cached and len(skipped) == 0,
        "status": "ok" if cached and len(skipped) == 0 else "degraded",
    }


# ───────────────────────────────────────────────────────────────
# 7. INVENTORY COMPARISON (T-SAR-01 / R42-002)
# ───────────────────────────────────────────────────────────────

def compare_inventories(
    skill_names: Iterable[str],
    graph_skill_ids: Iterable[str],
) -> Dict[str, Any]:
    """Compare SKILL.md discovery against a compiled-graph skill-ID inventory.

    R42-002 flagged that `health_check()` previously returned ``ok`` even when
    the two authoritative routing inventories disagreed:

    * SKILL.md discovery (this module's cache) drives the per-skill record
      lookup used in ``analyze_request``'s keyword/corpus scoring.
    * The compiled skill graph (loaded in ``skill_advisor.py``) drives the
      adjacency / signal / conflict boosts.

    A skill present in one inventory but not the other silently disables a
    layer of routing signal with no log or error. This helper normalizes
    both inputs and returns a structured parity report that ``health_check``
    can surface as ``degraded`` status.
    """
    skill_set = {str(name) for name in skill_names if isinstance(name, str) and name}
    graph_set = {str(ident) for ident in graph_skill_ids if isinstance(ident, str) and ident}
    missing_in_graph = sorted(skill_set - graph_set)
    missing_in_discovery = sorted(graph_set - skill_set)
    return {
        "in_sync": not missing_in_graph and not missing_in_discovery,
        "skill_discovery_count": len(skill_set),
        "graph_skill_count": len(graph_set),
        "missing_in_graph": missing_in_graph,
        "missing_in_discovery": missing_in_discovery,
    }
