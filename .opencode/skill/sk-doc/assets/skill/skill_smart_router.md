---
title: Skill Smart Router - Resilience Pattern
description: Canonical resilient smart-router pattern for skill resource discovery, guarded loading, runtime routing keys, and graceful fallback.
---

# Skill Smart Router - Resilience Pattern

Copy-paste pseudocode patterns that make a skill's smart router survive reference and asset changes (renames, deletes, new project folders, missing files) without crashing or silently degrading.

## 1. OVERVIEW

### Purpose

Smart routers fail when resource paths drift, reference folders are deleted, static file lists go stale, or routing logic assumes one hardcoded project or mode forever. This asset packages the canonical four-pattern fix: every routing call discovers the current markdown inventory, guards paths inside the skill folder, loads only files that still exist, selects resources from a runtime-derived routing key, and returns useful fallback guidance instead of crashing or silently loading nothing.

### Usage

Copy the four pseudocode patterns from §2 into your skill's SMART ROUTING section. Adapt the routing key (e.g., git remote → project; intent label → workflow; stack marker → tooling; env var → runtime mode) per §3 Generalization Guide. Preserve your skill's domain-specific `INTENT_MODEL`, `RESOURCE_MAP`, and load levels — only swap the **discovery + load + fallback** mechanics. Apply the structural safeguards from §4 to every router-driven `load()` call. Audit your draft against §5 Anti-Patterns before merging.

---

## 2. THE 4 PATTERNS

### Pattern 1: Runtime Discovery

**Key Points:**
- Discover routable markdown at every routing call
- Do not maintain static lists of every reference or asset file
- Recursive `rglob("*.md")` under `references/` and `assets/`

**Template:**

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")

def discover_markdown_resources() -> set[str]:
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(path for path in base.rglob("*.md") if path.is_file())
    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}
```

### Pattern 2: Existence-Check Before Load

**Key Points:**
- Guard each path against the discovered inventory before loading
- Suppress duplicate loads via a `seen` set
- Missing files just don't load; no crash

**Template:**

```python
loaded = []
seen = set()
inventory = discover_markdown_resources()

def load_if_available(relative_path: str) -> None:
    guarded = _guard_in_skill(relative_path)
    if guarded in inventory and guarded not in seen:
        load(guarded)
        loaded.append(guarded)
        seen.add(guarded)
```

### Pattern 3: Extensible Routing Key

**Key Points:**
- Routing key derives from a runtime signal (git remote, intent label, stack marker, env var, command, task field)
- Key selects a subdirectory under `references/<key>/` and `assets/<key>/`
- Add a new project or mode by dropping a new keyed folder; no router code change

**Template:**

```python
def get_routing_key(task) -> str:
    override = str(getattr(task, "routing_key", "")).strip().lower()
    if override:
        return override
    return detect_runtime_key(task) or "unknown"

routing_key = get_routing_key(task)
reference_prefix = f"references/{routing_key}/"
asset_prefix = f"assets/{routing_key}/"
keyed_refs = sorted(path for path in inventory if path.startswith(reference_prefix))
keyed_assets = sorted(path for path in inventory if path.startswith(asset_prefix))
```

### Pattern 4: Multi-Tier Graceful Fallback

**Key Points:**
- Tier 1: low intent confidence → return UNKNOWN_FALLBACK with disambiguation checklist
- Tier 2: known key but no keyed resources → return helpful "no knowledge base for X" notice
- Tier 3: happy path — load keyed refs + assets

**Template:**

```python
UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm the routing key or runtime surface",
    "Confirm the task intent",
    "Provide one concrete input, error, or expected output",
    "Confirm the verification command set before completion",
]

if max(intent_scores.values() or [0]) < 0.5:
    load_if_available(DEFAULT_RESOURCE)
    return {
        "routing_key": routing_key,
        "load_level": "UNKNOWN_FALLBACK",
        "needs_disambiguation": True,
        "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
        "resources": loaded,
    }

if routing_key == "unknown" or not keyed_refs:
    load_if_available(DEFAULT_RESOURCE)
    return {
        "routing_key": routing_key,
        "notice": f"No knowledge base found for routing key '{routing_key}'",
        "resources": loaded,
    }

for path in keyed_refs:
    load_if_available(path)
for path in keyed_assets:
    load_if_available(path)

return {"routing_key": routing_key, "resources": loaded}
```

---

## 3. GENERALIZATION GUIDE

| Routing Key Type | Use Case | Example Resource Shape |
| --- | --- | --- |
| Git remote | Project or repository routing | `references/<repo>/`, `assets/<repo>/` |
| Intent label | Workflow or document-family routing | `references/<intent>/`, `assets/<intent>/` |
| Stack marker | Tooling or language routing | `references/<stack>/`, `assets/<stack>/` |
| Environment variable | Runtime mode or deployment routing | `references/<mode>/`, `assets/<mode>/` |
| Command suffix | Subcommand variant routing | `references/<variant>/`, `assets/<variant>/` |
| Task field override | Explicit caller-supplied routing | `references/<override>/`, `assets/<override>/` |

---

## 4. STRUCTURAL SAFEGUARDS

**Key Points:**
- Resolve every relative path against `SKILL_ROOT` before loading
- Reject non-markdown resources from router-driven `load()` calls
- Build `RESOURCE_BASES` from skill-local `references/` and `assets/` only
- Check `if base.exists()` before recursive discovery so deleted folders do not fail routing
- Return the original path list from `_filter_paths()` when keywords are empty so filtering never degrades to an empty result

**Template:**

```python
def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown resources are routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def _filter_paths(paths: list[str], keywords: list[str]) -> list[str]:
    if not keywords:
        return paths
    lowered = [keyword.lower() for keyword in keywords]
    return [path for path in paths if any(keyword in path.lower() for keyword in lowered)]
```

---

## 5. ANTI-PATTERNS

- Hardcoded file inventories that must be updated after every resource move
- Raw `load("references/file.md")` calls without guard, inventory check, or duplicate suppression
- Pseudocode with absolute paths or hardcoded project names where a runtime routing key belongs
- Routing that returns an empty result on low confidence instead of an `UNKNOWN_FALLBACK` checklist
- Loading from `references/` or `assets/` without sandboxing paths to the current skill folder
- Building `RESOURCE_BASES` without `if base.exists()` — deleted folders break the entire router
- `_filter_paths()` returning `[]` on empty keyword list instead of returning input unchanged

---

## 6. RELATED RESOURCES

- `skill_md_template.md` — canonical SKILL.md skeleton; embeds this pattern in the SMART ROUTING section
- `skill_asset_template.md` — naming + structure rules for skill assets (this file follows them)
- `skill_reference_template.md` — sibling format for reference files
- Source pattern: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/barter/coder/.opencode/skill/sk-code/SKILL.md` §2 SMART ROUTING (the battle-tested implementation across 8 projects + 84 markdown files)
