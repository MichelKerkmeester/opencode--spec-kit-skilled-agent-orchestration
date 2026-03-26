---
title: "Constitutional Gate-Enforcement Rule Pack"
description: "Always-surface constitutional rule pack that keeps Spec Kit gate behavior visible through trigger phrases, gate cross-references, and continuation/compaction edge-case handling."
---

# Constitutional Gate-Enforcement Rule Pack

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

Constitutional Gate-Enforcement Rule Pack is the always-surface governance bundle that keeps Spec Kit gate behavior visible during memory retrieval and continuation workflows.

In practice, this pack gives the memory system a compact "do not forget these rules" layer. The core gate-enforcement file is intentionally lean: it does not restate every gate in full, but instead keeps the most important trigger phrases, a gate cross-reference, quick-reference tables, and edge-case rules for continuation validation and compaction recovery. The companion constitutional README explains why this works operationally: constitutional memories are pinned to the top of search results, do not decay, and are designed to surface even when the user query is only loosely related.

---

## 2. CURRENT REALITY

The current implementation is a two-file constitutional pack backed by the broader gate definitions in `AGENTS.md` Section 2.

`gate-enforcement.md` is the operational rule surface. Its frontmatter declares `importanceTier: constitutional`, marks the content as a `decision`, and registers trigger phrases spanning file-modification intent, continuation cues, compaction/context-loss cues, completion claims, and memory-save requests. The body adds three practical overlays on top of the AGENTS contract: a gate cross-reference table, a continuation-validation workflow that cross-checks handoff messages against recent memory, and a quick-reference index that ties gate triggers back to their governing source.

`constitutional/README.md` defines the behavior of the constitutional tier itself. It documents that constitutional memories always appear at the top of `memory_search()` results, receive a fixed `similarity: 100`, never decay, remain permanently available, and use fast trigger-phrase matching for proactive surfacing. It also documents the operational envelope around this pack, including the shared constitutional token budget, authoring template, and verification flow after adding or updating a constitutional memory.

Together, these files make gate enforcement resilient to context drift. The detailed policy still lives in the main instructions, but this rule pack keeps the most critical routing and recovery behaviors continuously retrievable in the memory layer.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `AGENTS.md` | Governance contract | Authoritative source for Gate 1, Gate 2, Gate 3, memory-save rules, and completion-verification rules that the constitutional pack cross-references |
| `.opencode/skill/system-spec-kit/constitutional/gate-enforcement.md` | Constitutional memory | Always-surface rule file defining trigger phrases, gate cross-reference, continuation validation, compaction recovery, and quick-reference behavior |
| `.opencode/skill/system-spec-kit/constitutional/README.md` | Constitutional tier docs | Documents how constitutional memories are surfaced, scored, budgeted, created, and verified |

---

## 4. SOURCE METADATA

- Group: Governance
- Source feature title: Constitutional Gate-Enforcement Rule Pack
- Source spec: Deep research remediation 2026-03-26
- Current reality source: direct audit of constitutional gate-enforcement surfaces and governing gate contract
