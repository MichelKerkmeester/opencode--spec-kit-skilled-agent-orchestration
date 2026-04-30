---
title: Shared Smart-Router Helpers for cli-* Skills
description: Canonical helper-function bodies (_task_text, _guard_in_skill, discover_markdown_resources, score_intents, select_intents, route_<provider>_resources) shared across the five cli-* sibling skills. Each cli-* skill provides its own INTENT_SIGNALS, RESOURCE_MAP, LOADING_LEVELS, UNKNOWN_FALLBACK_CHECKLIST inline.
---

# Shared Smart-Router Helpers (cli-* family)

The five cli-* sibling skills (`cli-claude-code`, `cli-codex`, `cli-copilot`, `cli-gemini`, `cli-opencode`) share an identical smart-router structure. The helper bodies below are byte-identical across all five files (except the `route_<provider>_resources` function name). Each cli-* SKILL.md provides its own provider-specific dictionaries (`INTENT_SIGNALS`, `RESOURCE_MAP`, `LOADING_LEVELS`, `UNKNOWN_FALLBACK_CHECKLIST`) inline; this reference holds the shared procedural code.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Canonical helper-function bodies (_task_text, _guard_in_skill, discover_markdown_resources, score_intents, select_intents, route_<provider>_resources) shared across the five cli-* sibling skills. Each cli-* skill provides its own INTENT_SIGNALS, RESOURCE_MAP, LOADING_LEVELS, UNKNOWN_FALLBACK_CHECKLIST inline.

---

<!-- /ANCHOR:overview -->

<!-- ANCHOR:helper-functions -->
## 2. HELPER FUNCTIONS

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/cli_reference.md"

def _task_text(task) -> str:
    return " ".join([
        str(getattr(task, "text", "")),
        str(getattr(task, "query", "")),
        " ".join(getattr(task, "keywords", []) or []),
    ]).lower()

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown resources are routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def discover_markdown_resources() -> set[str]:
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(p for p in base.rglob("*.md") if p.is_file())
    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}

def score_intents(task) -> dict[str, float]:
    text = _task_text(task)
    scores = {intent: 0.0 for intent in INTENT_SIGNALS}
    for intent, cfg in INTENT_SIGNALS.items():
        for keyword in cfg["keywords"]:
            if keyword in text:
                scores[intent] += cfg["weight"]
    return scores

def select_intents(scores: dict[str, float], ambiguity_delta: float = 1.0, max_intents: int = 2) -> list[str]:
    ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    if not ranked or ranked[0][1] <= 0:
        return ["UNKNOWN"]
    selected = [ranked[0][0]]
    if len(ranked) > 1 and ranked[1][1] > 0 and (ranked[0][1] - ranked[1][1]) <= ambiguity_delta:
        selected.append(ranked[1][0])
    return selected[:max_intents]

def route_<PROVIDER>_resources(task):
    inventory = discover_markdown_resources()
    scores = score_intents(task)
    intents = select_intents(scores, ambiguity_delta=1.0)
    loaded = []
    seen = set()

    def load_if_available(relative_path: str) -> None:
        guarded = _guard_in_skill(relative_path)
        if guarded in inventory and guarded not in seen:
            load(guarded)
            loaded.append(guarded)
            seen.add(guarded)

    # 1. ALWAYS load baseline + fast-path prompt-quality asset
    for relative_path in LOADING_LEVELS["ALWAYS"]:
        load_if_available(relative_path)

    # 2. UNKNOWN FALLBACK: no keywords matched at all
    if max(scores.values()) == 0:
        return {
            "intents": ["UNKNOWN"],
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "resources": loaded,
        }

    # 3. CONDITIONAL: intent-mapped resources
    for intent in intents:
        for relative_path in RESOURCE_MAP.get(intent, []):
            load_if_available(relative_path)

    # 4. ON_DEMAND: explicit keyword triggers
    text = _task_text(task)
    if any(keyword in text for keyword in LOADING_LEVELS["ON_DEMAND_KEYWORDS"]):
        for relative_path in LOADING_LEVELS["ON_DEMAND"]:
            load_if_available(relative_path)

    # 5. Safety net
    if not loaded:
        load_if_available(DEFAULT_RESOURCE)

    return {"intents": intents, "intent_scores": scores, "resources": loaded}
```

Replace `<PROVIDER>` with the provider slug (`claude_code`, `codex`, `copilot`, `gemini`, `opencode`).

---

<!-- /ANCHOR:helper-functions -->

<!-- ANCHOR:loading-level-semantics -->
## 3. LOADING-LEVEL SEMANTICS

| Level         | When to load            | Resources                                                       |
| ------------- | ----------------------- | --------------------------------------------------------------- |
| `ALWAYS`      | Every skill invocation  | `references/cli_reference.md`, `assets/prompt_quality_card.md`  |
| `CONDITIONAL` | If intent signals match | Intent-mapped reference docs from `RESOURCE_MAP`                |
| `ON_DEMAND`   | Only on explicit request| Extended templates and patterns (gated by `ON_DEMAND_KEYWORDS`) |

---

<!-- /ANCHOR:loading-level-semantics -->

<!-- ANCHOR:unknown-fallback-return-contract -->
## 4. UNKNOWN_FALLBACK RETURN CONTRACT

When no keyword matches `score_intents()` returns all-zero scores. The router returns:

```python
{
    "intents": ["UNKNOWN"],
    "load_level": "UNKNOWN_FALLBACK",
    "needs_disambiguation": True,
    "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
    "resources": loaded,  # ALWAYS-tier resources only
}
```

The caller surfaces `disambiguation_checklist` to the user before re-routing.

---

<!-- /ANCHOR:unknown-fallback-return-contract -->

<!-- ANCHOR:provider-specific-dictionaries -->
## 5. PROVIDER-SPECIFIC DICTIONARIES

Each cli-* SKILL.md provides its own:
- `INTENT_SIGNALS` — provider-specific keyword-to-weight intent map
- `RESOURCE_MAP` — provider-specific intent-to-reference-files map
- `LOADING_LEVELS` — provider-specific `ALWAYS` / `ON_DEMAND_KEYWORDS` / `ON_DEMAND` lists
- `UNKNOWN_FALLBACK_CHECKLIST` — provider-specific disambiguation prompts

See the per-skill SKILL.md §2 Smart Routing for these inline dictionaries.

---

<!-- /ANCHOR:provider-specific-dictionaries -->
