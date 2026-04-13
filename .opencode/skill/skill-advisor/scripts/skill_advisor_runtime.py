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
}


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
                    return data

                if ":" not in stripped:
                    continue

                key, value = stripped.split(":", 1)
                value = value.strip()
                if len(value) >= 2 and value[0] == value[-1] and value[0] in ('"', "'"):
                    value = value[1:-1]
                data[key.strip()] = value

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
    name_terms = _normalize_terms(name.replace("-", " "), stop_words)
    corpus_terms = _normalize_terms(description, stop_words)
    variants = _build_variants(name)

    return (
        name,
        {
            "name": name,
            "description": description,
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
    """Return cached skill records with mtime invalidation."""
    skill_files = _discover_skill_files(skills_dir)
    signature = _compute_signature(skill_files)

    if not force_refresh and _CACHE["signature"] == signature and _CACHE["records"] is not None:
        return _clone_records(_CACHE["records"])

    records: Dict[str, Dict[str, Any]] = {}
    for file_path in skill_files:
        built = _build_skill_record(file_path, stop_words)
        if built is None:
            continue
        name, record = built
        records[name] = record

    _CACHE["signature"] = signature
    _CACHE["records"] = records

    return _clone_records(records)


def get_cache_status() -> Dict[str, Any]:
    """Expose cache diagnostics for health output."""
    records = _CACHE.get("records") or {}
    return {
        "cached": bool(records),
        "cached_records": len(records),
    }
