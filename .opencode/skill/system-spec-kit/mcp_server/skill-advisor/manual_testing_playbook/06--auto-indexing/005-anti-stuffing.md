---
title: "AI-005 Anti-Stuffing and Cardinality Caps"
description: "Manual validation that derived lane anti-stuffing enforces cardinality caps, demotes repetition-dense tokens, and rejects adversarial fixtures."
trigger_phrases:
  - "ai-005"
  - "anti stuffing"
  - "cardinality cap"
  - "repetition density demote"
---

# AI-005 Anti-Stuffing and Cardinality Caps

## TABLE OF CONTENTS

- [1. SCENARIO](#1--scenario)
- [2. SETUP](#2--setup)
- [3. STEPS](#3--steps)
- [4. EXPECTED](#4--expected)
- [5. FAILURE MODES](#5--failure-modes)
- [6. RELATED](#6--related)

---

## 1. SCENARIO

Validate that `lib/derived/anti-stuffing.ts` enforces cardinality caps on derived entries, demotes tokens with suspicious repetition density, and rejects adversarial fixtures designed to stuff the routing surface.

---

## 2. SETUP

- Disposable workspace copy.
- MCP server built.
- Pre-built adversarial fixtures under `scripts/fixtures/` or equivalent; otherwise generate a SKILL.md with >500 repeated trigger phrases as an isolated fixture.

---

## 3. STEPS

1. Copy an existing active skill into the disposable copy and duplicate a trigger phrase 1000 times in its body.
2. Add a second fixture where a single n-gram is repeated with only punctuation variation.
3. Trigger reindex:

```bash
touch /tmp/path-to-copy/.opencode/skill/adversarial-fixture/SKILL.md
```

4. Read the fixture's `graph-metadata.json.derived` block.
5. Call `advisor_recommend` with a prompt that would match the stuffed n-gram; compare the fixture's derived lane score against a normal skill.

---

## 4. EXPECTED

- The fixture's derived entries respect a hard cardinality cap (not every repetition is stored).
- Tokens with high repetition density receive demoted weights relative to normal skills.
- Known adversarial fixtures (per the bundled test suite) are rejected and excluded from routing.
- The fixture does not outrank an honest candidate in `advisor_recommend` output.

---

## 5. FAILURE MODES

| Symptom | Detection | Action |
| --- | --- | --- |
| Cardinality cap ineffective | Derived list is unbounded | Inspect `lib/derived/anti-stuffing.ts` cap enforcement. |
| No repetition demotion | Stuffed fixture outranks normals | Audit density-weighted scoring. |
| Adversarial fixture routed | Fixture slug appears as top-1 | Block release; update rejection list. |

---

## 6. RELATED

- Scenario [AI-002](./002-sanitizer-boundaries.md) — sanitizer at write boundaries.
- Feature [`02--auto-indexing/05-anti-stuffing.md`](../../feature_catalog/02--auto-indexing/05-anti-stuffing.md).
- Source: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/derived/anti-stuffing.ts`.
