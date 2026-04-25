---
title: "AI-001 Deterministic Derived Extraction"
description: "Manual validation that derived/extract.ts produces deterministic n-gram and pattern extractions from SKILL.md frontmatter, body, examples, references, assets, intent_signals, source_docs, and key_files."
trigger_phrases:
  - "ai-001"
  - "derived extraction"
  - "deterministic n-gram"
  - "graph-metadata derived"
---

# AI-001 Deterministic Derived Extraction

## TABLE OF CONTENTS

- [1. SCENARIO](#1--scenario)
- [2. SETUP](#2--setup)
- [3. STEPS](#3--steps)
- [4. EXPECTED](#4--expected)
- [5. FAILURE MODES](#5--failure-modes)
- [6. RELATED](#6--related)

---

## 1. SCENARIO

Validate that derived extraction in `lib/derived/extract.ts` produces deterministic, stable output from SKILL.md frontmatter, body, fenced examples, `references/**`, `assets/**`, `intent_signals`, `source_docs`, and declared `key_files`, and that `lib/derived/sync.ts` writes the result only to `graph-metadata.json.derived` without mutating SKILL.md.

---

## 2. SETUP

- Disposable workspace copy.
- MCP server built.
- A target skill with a SKILL.md plus `references/` and `assets/` content (for example `sk-doc`).
- `diff` available.

---

## 3. STEPS

1. Capture pre-state of the target skill:

```bash
cp .opencode/skill/sk-doc/graph-metadata.json /tmp/pre-derived.json
cp .opencode/skill/sk-doc/SKILL.md /tmp/pre-skill.md
```

2. Touch the target skill to force reindex:

```bash
touch .opencode/skill/sk-doc/SKILL.md
```

3. Wait for debounce + reindex.
4. Recompute with a repeat touch and capture again:

```bash
touch .opencode/skill/sk-doc/SKILL.md
cp .opencode/skill/sk-doc/graph-metadata.json /tmp/post-derived.json
```

5. Diff `graph-metadata.json` pre vs post and compare `SKILL.md` pre vs post.

---

## 4. EXPECTED

- `graph-metadata.json.derived` section is populated with n-grams, patterns, and provenance fingerprints.
- Two consecutive touches produce identical derived output for unchanged source content (deterministic).
- `SKILL.md` is byte-identical pre vs post (never mutated by derived extraction).
- Extracted tokens are scoped to the configured inputs: frontmatter, body, examples, `references/**`, `assets/**`, `intent_signals`, `source_docs`, and `derived.key_files`.

---

## 5. FAILURE MODES

| Symptom | Detection | Action |
| --- | --- | --- |
| Non-deterministic output | Diff shows shuffled arrays or timestamps | Inspect `extract.ts` sort order and provenance fingerprints. |
| SKILL.md mutated | `SKILL.md` byte diff non-empty | Block release; derived writes must never touch SKILL.md. |
| Unexpected inputs scraped | Tokens include paths outside allowed inputs | Audit `extract.ts` input enumeration. |

---

## 6. RELATED

- Scenario [AI-002](./002-sanitizer-boundaries.md) — A7 sanitizer boundary enforcement.
- Scenario [AI-003](./003-provenance-and-trust-lanes.md) — provenance and trust lane tagging.
- Feature [`02--auto-indexing/01-derived-extraction.md`](../../feature_catalog/02--auto-indexing/01-derived-extraction.md).
- Source: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/derived/extract.ts` and `lib/derived/sync.ts`.
