#!/usr/bin/env python3
"""
Refresh per-packet metadata (description.json + graph-metadata.json)
after the topical reorg moved/renumbered packets.

Strategy:
- description.json: delete and regenerate via generate-description.js
  (it derives fresh fields from spec.md frontmatter).
- graph-metadata.json: patch parent_id / packet_id / spec_folder fields
  in place based on the packet's actual disk location, then optionally
  rebuild children_ids by listing immediate child dirs.

This avoids the heavyweight side effects of generate-context.js
(memory save, embeddings, causal-edge regen) while ensuring topology
correctness. A single memory_index_scan in Phase 6 picks up content
changes for the search index.
"""

from __future__ import annotations

import json
import re
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path("/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public")
SPEC_ROOT = REPO_ROOT / ".opencode/specs/system-spec-kit/026-graph-and-context-optimization"
SPEC_REL = "system-spec-kit/026-graph-and-context-optimization"
GENERATE_DESC = REPO_ROOT / ".opencode/skill/system-spec-kit/scripts/dist/spec-folder/generate-description.js"

# Packets to refresh: every packet that moved, was renamed, or had its parent change.
PACKETS = [
    # Root parents (children_ids changed)
    "007-code-graph",
    "008-skill-advisor",
    "009-memory-causal-graph",
    "010-hook-parity",

    # 008 children (from 006 — keep numbering)
    "008-skill-advisor/001-search-and-routing-tuning",
    "008-skill-advisor/002-skill-advisor-graph",
    "008-skill-advisor/003-advisor-phrase-booster-tailoring",
    "008-skill-advisor/004-skill-advisor-docs-and-code-alignment",
    "008-skill-advisor/005-smart-router-remediation-and-opencode-plugin",
    "008-skill-advisor/006-deferred-remediation-and-telemetry-run",

    # 008 children (from 010 — new parent + new slot)
    "008-skill-advisor/007-skill-advisor-hook-surface",
    "008-skill-advisor/008-skill-graph-daemon-and-advisor-unification",
    "008-skill-advisor/009-skill-advisor-plugin-hardening",
    "008-skill-advisor/010-skill-advisor-standards-alignment",
    "008-skill-advisor/011-skill-advisor-hook-improvements",

    # 007 children (existing 001-003 + the 2 newcomers from 010)
    "007-code-graph/001-code-graph-upgrades",
    "007-code-graph/002-code-graph-self-contained-package",
    "007-code-graph/003-code-graph-context-and-scan-scope",
    "007-code-graph/004-code-graph-hook-improvements",
    "007-code-graph/005-code-graph-advisor-refinement",

    # 010-hook-parity surviving children (parent_id same, packet_id renumbered)
    "010-hook-parity/001-hook-parity-remediation",
    "010-hook-parity/002-copilot-hook-parity-remediation",
    "010-hook-parity/003-codex-hook-parity-remediation",
    "010-hook-parity/004-claude-hook-findings-remediation",
    "010-hook-parity/005-opencode-plugin-loader-remediation",
    "010-hook-parity/006-copilot-wrapper-schema-fix",
    "010-hook-parity/007-copilot-writer-wiring",
    "010-hook-parity/008-docs-impact-remediation",
]


def regen_description(packet_dir: Path) -> bool:
    desc_path = packet_dir / "description.json"
    desc_path.unlink(missing_ok=True)
    cmd = ["node", str(GENERATE_DESC), str(packet_dir), "."]
    res = subprocess.run(cmd, capture_output=True, text=True, cwd=str(REPO_ROOT))
    if res.returncode != 0:
        print(f"  description.json: FAILED for {packet_dir.relative_to(SPEC_ROOT)}: {res.stderr.strip()}", file=sys.stderr)
        return False
    return True


def create_minimal_graph_metadata(packet_dir: Path, packet_rel: str, full_packet_id: str, parent_id: str) -> dict:
    """Build a minimal graph-metadata.json from scratch (used when none exists)."""
    spec_path = packet_dir / "spec.md"
    trigger_phrases = []
    key_topics = []
    importance_tier = "important"
    if spec_path.exists():
        text = spec_path.read_text()
        # Extract trigger_phrases and importance_tier from YAML frontmatter
        m = re.search(r"^---\n(.*?)\n---", text, re.DOTALL | re.MULTILINE)
        if m:
            fm = m.group(1)
            tp_match = re.search(r"^trigger_phrases:\s*\n((?:\s+-\s+.*\n)+)", fm, re.MULTILINE)
            if tp_match:
                for line in tp_match.group(1).splitlines():
                    val = line.strip().lstrip("-").strip().strip('"')
                    if val:
                        trigger_phrases.append(val)
            it_match = re.search(r"^importance_tier:\s*['\"]?([^'\"]+)['\"]?", fm, re.MULTILINE)
            if it_match:
                importance_tier = it_match.group(1).strip()
    return {
        "schema_version": 1,
        "packet_id": full_packet_id,
        "spec_folder": full_packet_id,
        "parent_id": parent_id,
        "children_ids": [],
        "migrated": False,
        "migration_source": None,
        "manual": {"depends_on": [], "supersedes": [], "related_to": []},
        "derived": {
            "trigger_phrases": trigger_phrases,
            "key_topics": key_topics,
            "importance_tier": importance_tier,
            "status": "complete",
            "key_files": ["spec.md", "plan.md", "tasks.md", "implementation-summary.md", "decision-record.md"],
        },
    }


def patch_graph_metadata(packet_dir: Path, packet_rel: str) -> tuple[bool, dict]:
    """Patch packet_id, spec_folder, parent_id, and rebuild children_ids from disk."""
    md_path = packet_dir / "graph-metadata.json"
    full_packet_id = f"{SPEC_REL}/{packet_rel}"
    parent_rel = "/".join(packet_rel.split("/")[:-1]) if "/" in packet_rel else ""
    parent_id = f"{SPEC_REL}/{parent_rel}" if parent_rel else SPEC_REL
    if not md_path.exists():
        md = create_minimal_graph_metadata(packet_dir, packet_rel, full_packet_id, parent_id)
        with md_path.open("w") as fh:
            json.dump(md, fh, indent=2)
            fh.write("\n")
        print(f"  graph-metadata.json: CREATED minimal for {packet_rel}")
        return True, {"created": (None, full_packet_id)}

    with md_path.open() as fh:
        md = json.load(fh)

    # Children: list immediate numbered child directories.
    children_ids = []
    for child in sorted(packet_dir.iterdir()):
        if child.is_dir() and re.match(r"^\d{3}-", child.name):
            children_ids.append(f"{full_packet_id}/{child.name}")

    diff = {}
    for key, new_val in [
        ("packet_id", full_packet_id),
        ("spec_folder", full_packet_id),
        ("parent_id", parent_id),
        ("children_ids", children_ids),
    ]:
        old_val = md.get(key)
        if old_val != new_val:
            md[key] = new_val
            diff[key] = (old_val, new_val)

    if diff:
        with md_path.open("w") as fh:
            json.dump(md, fh, indent=2)
            fh.write("\n")

    return True, diff


def main() -> int:
    print(f"Refreshing metadata for {len(PACKETS)} packet(s)")
    desc_ok = 0
    desc_fail = 0
    md_changes = 0

    for rel in PACKETS:
        packet_dir = SPEC_ROOT / rel
        if not packet_dir.exists():
            print(f"  SKIP missing dir: {rel}")
            continue
        print(f"\n{rel}")
        if regen_description(packet_dir):
            desc_ok += 1
        else:
            desc_fail += 1

        ok, diff = patch_graph_metadata(packet_dir, rel)
        if ok and diff:
            md_changes += 1
            for key, (old, new) in diff.items():
                if isinstance(old, list) or isinstance(new, list):
                    print(f"  graph-metadata.{key}: {len(old or [])} -> {len(new or [])} entries")
                else:
                    print(f"  graph-metadata.{key}: {old} -> {new}")

    print()
    print(f"description.json: {desc_ok} regenerated, {desc_fail} failed")
    print(f"graph-metadata.json: {md_changes} files patched")
    return 0 if desc_fail == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
