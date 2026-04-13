---
title: "Skill discovery"
description: "Describes how the advisor loads cached skill records and overlays command bridges before scoring."
---

# Skill discovery

## 1. OVERVIEW

Describes how the advisor loads cached skill records and overlays command bridges before scoring.

The advisor cannot rank anything until it knows the current skill and command surface. This feature turns the live `.opencode/skill/` tree into normalized records that the scorer can compare against prompt terms, explicit skill mentions, and slash markers.

---

## 2. CURRENT REALITY

`get_skills()` starts from the cached skill inventory returned by the runtime helper and then appends inline bridge records for slash-command surfaces such as `command-spec-kit`, `command-memory-save`, and the create or improve commands. Each synthesized record carries a normalized name, description, variants, kind, and optional path so the rest of the pipeline can score skills and command bridges with the same machinery.

`skill_advisor.py` also keeps the discovery entry points that the rest of the advisor depends on. `parse_frontmatter()` is the safe wrapper for frontmatter extraction, `_build_variants()` adds slash, dollar-sign, space, and underscore spellings, and `load_all_skills()` forces a fresh scan for diagnostics. That keeps discovery lightweight during normal routing while still exposing a full refresh path for health reporting.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `skill_advisor.py` | Runtime | Defines `get_skills()`, variant building, inline bridge records, and diagnostic skill loading. |
| `skill_advisor.py` | Runtime | Wraps frontmatter parsing so discovery failures degrade safely instead of aborting routing. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `skill_advisor.py` | Diagnostic CLI | `--health` forces fresh discovery and reports how many skills and command bridges were found. |
| `skill_advisor_regression.py` | Regression harness | Imports the advisor module and exercises discovery before scoring every fixture prompt. |

---

## 4. SOURCE METADATA

- Group: Routing pipeline
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `01--routing-pipeline/01-skill-discovery.md`
