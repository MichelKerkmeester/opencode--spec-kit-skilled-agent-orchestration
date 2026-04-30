---
title: "AI-003 Provenance Fingerprints and Trust Lanes"
description: "Manual validation that derived entries carry provenance fingerprints and are tagged with the correct trust lane (author, frontmatter, body, examples, local_docs, derived_local)."
trigger_phrases:
  - "ai-003"
  - "provenance fingerprint"
  - "trust lanes"
  - "derived provenance"
---

# AI-003 Provenance Fingerprints and Trust Lanes

## TABLE OF CONTENTS

- [1. SCENARIO](#1-scenario)
- [2. SETUP](#2-setup)
- [3. STEPS](#3-steps)
- [4. EXPECTED](#4-expected)
- [5. FAILURE MODES](#5-failure-modes)
- [6. RELATED](#6-related)

---

## 1. SCENARIO

Validate that `lib/derived/provenance.ts` writes provenance fingerprints for each derived entry and that `lib/derived/trust-lanes.ts` assigns the correct lane among `author`, `frontmatter`, `body`, `examples`, `local_docs`, and `derived_local`.

---

## 2. SETUP

- Disposable workspace copy or read-only inspection against the live repo.
- MCP server built; daemon reachable.
- A target skill with content spanning multiple lane sources (frontmatter, body, a fenced example, and a local references/ or assets/ doc).

---

## 3. STEPS

1. Read the target skill's `graph-metadata.json.derived` block for the current state.
2. Identify at least one derived entry per lane source present in the target.
3. For each entry, confirm the presence of a provenance fingerprint (hash or stable ID) and a `lane` field.
4. Touch the target skill to force a reindex:

```bash
touch .opencode/skill/sk-doc/SKILL.md
```

5. Re-read `graph-metadata.json.derived` and verify fingerprints are stable for unchanged sources and changed for mutated sources.

---

## 4. EXPECTED

- Every derived entry has both `provenance` and `lane` fields.
- Lane assignment matches the source of the extracted token (frontmatter terms → `frontmatter`, fenced code → `examples`, references/assets docs → `local_docs`, n-grams from SKILL.md body → `body` or `derived_local`).
- Fingerprints are stable across reindex for unchanged content and change only when the underlying source bytes change.
- Author-tier tokens (intent_signals in frontmatter) resolve to the `author` lane.

---

## 5. FAILURE MODES

| Symptom | Detection | Action |
| --- | --- | --- |
| Missing provenance | Derived entry lacks fingerprint | Inspect `lib/derived/provenance.ts` write path. |
| Wrong lane tag | Body token shows `author` or vice versa | Audit `trust-lanes.ts` classification rules. |
| Unstable fingerprints | Fingerprint changes without source change | Verify sort order and fingerprint input normalization. |

---

## 6. RELATED

- Scenario [AI-001](./001-derived-extraction.md) — deterministic extraction.
- Scenario [SC-004](../08--scorer-fusion/004-lane-attribution.md) — lane attribution on the read side.
- Feature [`02--auto-indexing/03-provenance-and-trust-lanes.md`](../../feature_catalog/02--auto-indexing/03-provenance-and-trust-lanes.md).
- Source: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/derived/provenance.ts` and `lib/derived/trust-lanes.ts`.
