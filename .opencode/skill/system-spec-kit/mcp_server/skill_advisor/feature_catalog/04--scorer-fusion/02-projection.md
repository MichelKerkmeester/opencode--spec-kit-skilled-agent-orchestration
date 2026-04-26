---
title: "Skill-Nodes / Skill-Edges Projection"
description: "Projection layer that converts the compiled skill graph into the shape consumed by graph-causal scoring without leaking raw graph text."
trigger_phrases:
  - "scorer projection"
  - "skill_nodes skill_edges"
  - "graph causal projection"
  - "projection layer"
---

# Skill-Nodes / Skill-Edges Projection

## TABLE OF CONTENTS

- [1. PURPOSE](#1-purpose)
- [2. CURRENT REALITY](#2-current-reality)
- [3. SOURCE FILES](#3-source-files)
- [4. TEST COVERAGE](#4-test-coverage)
- [5. RELATED](#5-related)

---

## 1. PURPOSE

Expose only the graph data the `graph_causal` lane actually needs, in a stable shape that the scorer can consume directly without traversing the whole compiled graph on every call.

---

## 2. CURRENT REALITY

`lib/scorer/projection.ts` projects the compiled skill graph into `skill_nodes` and `skill_edges` collections shaped for the graph-causal lane. The projection is side-effect-free and does not carry prompt text or raw graph prose. Bounded node counts keep memory usage stable as the corpus grows.

---

## 3. SOURCE FILES

- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/projection.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/graph-causal.ts`

---

## 4. TEST COVERAGE

- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/scorer/native-scorer.vitest.ts` — graph-causal lane behavior.
- Playbook scenario [SC-002](../../manual_testing_playbook/08--scorer-fusion/002-projection.md).

---

## 5. RELATED

- [01-five-lane-fusion.md](./01-five-lane-fusion.md).
- [04-attribution.md](./04-attribution.md).
- [`06--mcp-surface/03-advisor-validate.md`](../06--mcp-surface/03-advisor-validate.md).
