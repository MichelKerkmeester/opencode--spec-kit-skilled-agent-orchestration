---
title: "...6-graph-and-context-optimization/006-search-routing-advisor/002-skill-advisor-graph/001-research-findings-fixes/plan]"
description: "Plan for fixing P0 and P1 issues from the deep research audit."
trigger_phrases:
  - "001-research-findings-fixes"
  - "implementation"
  - "plan"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/002-skill-advisor-graph/001-research-findings-fixes"
    last_updated_at: "2026-04-13T16:00:00Z"
    last_updated_by: "claude-opus-4-6"
    recent_action: "Created plan"
    next_safe_action: "Implement fixes"
    key_files: ["plan.md"]
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
---
# Implementation Plan: Skill Graph Research Findings Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python (advisor + compiler), JSON (metadata) |
| **Framework** | skill_advisor.py routing pipeline |
| **Testing** | Regression harness (skill_advisor_regression.py) |

### Overview
Fix the 5 P0 blocking issues and 5 P1 issues found by the deep research audit to bring the skill graph from "experimental assist" to "production-ready" status.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:approach -->
## 2. APPROACH

### Phase 1: Guard Against Ghost Candidates (P0-1)

**What:** Prevent graph-only candidate creation.

**How:** In `_apply_graph_boosts()` and `_apply_family_affinity()`, only apply boosts to skills that already have a non-zero score from non-graph sources. The snapshot already captures pre-graph scores, so the check is: skip if `snapshot.get(target, 0) <= 0`.

```python
# In _apply_graph_boosts(), before applying transitive boost:
if skill_boosts.get(target, 0) <= 0 and snapshot.get(target, 0) <= 0:
    continue  # Don't create candidates from graph alone
```

Same pattern for `_apply_family_affinity()`: change the condition from `skill_boosts.get(member, 0) <= 0` to requiring the member already has some evidence.

**Files:** `skill_advisor.py` — `_apply_graph_boosts()` and `_apply_family_affinity()`

---

### Phase 2: Fill Edge Gaps (P0-2)

**What:** Add outbound edges to the 4 orphan skills.

**Changes:**

| Skill | Add Edge | Type | Weight | Context |
|-------|----------|------|--------|---------|
| `system-spec-kit` | `sk-doc` | enhances | 0.4 | spec folder docs |
| `system-spec-kit` | `sk-git` | enhances | 0.3 | git workflow integration |
| `system-spec-kit` | `sk-code-opencode` | enhances | 0.3 | opencode standards |
| `sk-doc` | `system-spec-kit` | enhances | 0.5 | doc creation for specs |
| `mcp-coco-index` | `system-spec-kit` | enhances | 0.3 | semantic search for specs |
| `sk-improve-prompt` | `cli-claude-code` | enhances | 0.4 | prompt quality card |
| `sk-improve-prompt` | `cli-codex` | enhances | 0.4 | prompt quality card |
| `sk-improve-prompt` | `cli-copilot` | enhances | 0.4 | prompt quality card |
| `sk-improve-prompt` | `cli-gemini` | enhances | 0.4 | prompt quality card |

**Files:** 4 `graph-metadata.json` files

---

### Phase 3: Include Routing Metadata in Compiled Output (P0-3)

**What:** Add `intent_signals` to `skill-graph.json`. Relax size target from 2KB to 4KB.

**How:** In `compile_graph()`, collect `intent_signals` from each skill's metadata and include as a `signals` field:

```json
{
  "signals": {
    "sk-code-review": ["code review", "pr review", "security review"],
    "sk-git": ["git workflow", "worktree", "conventional commit"]
  }
}
```

**Files:** `skill_graph_compiler.py` — `compile_graph()` function

---

### Phase 4: Resolve prerequisite_for (P0-4)

**What:** Compile `prerequisite_for` into runtime adjacency instead of dropping it.

**How:** Re-add `"prerequisite_for"` to the edge types iterated in `compile_graph()`. This adds ~200 bytes but makes mcp-code-mode's downstream edges active.

**Files:** `skill_graph_compiler.py` — the edge type filter line

---

### Phase 5: Separate Graph Evidence in Scoring (P0-5)

**What:** Make graph-derived boosts contribute less to confidence than direct evidence.

**How:** Add a `_graph_boost_count` field to each recommendation tracking how many of its reasons came from graph propagation. In calibration, apply a small penalty when a large fraction of evidence is graph-derived:

```python
graph_fraction = graph_boost_count / max(num_matches, 1)
if graph_fraction > 0.5:
    confidence *= 0.90  # 10% penalty when majority of evidence is graph-derived
```

**Files:** `skill_advisor.py` — `_apply_graph_boosts()`, `_apply_family_affinity()`, and `apply_confidence_calibration()`

---

### Phase 6: Harden Compiler Validation (P1-1)

**What:** Add warnings for common metadata mistakes.

**Checks to add:**
- Zero-edge skills: warn when a skill has empty edges across all 5 types
- Self-referencing edges: error when target == skill_id
- Dependency cycles: detect A→B→A chains in depends_on
- Enhances weight asymmetry: warn when A→B and B→A differ by >0.3

**Files:** `skill_graph_compiler.py` — `validate_skill_metadata()` and new `validate_cycles()`

---

### Phase 7: Add Drift Audit Flag (P1-2)

**What:** `--audit-drift` flag that compares PHRASE_INTENT_BOOSTERS with graph intent_signals.

**Output:** List of exact duplicates, partially-backed phrases, and un-backed phrases.

**Files:** `skill_graph_compiler.py` — new `audit_phrase_drift()` function

---

### Phase 8: Fix Deep Review ↔ Deep Research Sibling (P1-3)

**What:** Remove the sibling edge between sk-deep-review and sk-deep-research to prevent mode leakage.

**Files:** `sk-deep-review/graph-metadata.json`, `sk-deep-research/graph-metadata.json`

---

### Phase 9: Fix Reason Ordering (P1-4)

**What:** Sort reasons by score contribution instead of alphabetically. Group by source type (direct, semantic, graph).

**Files:** `skill_advisor.py` — recommendation formatting near the end of `analyze_request()`

---

### Phase 10: Add CocoIndex Failure Diagnostics (P1-5)

**What:** When semantic search subprocess fails, log the failure reason to boost_reasons as a diagnostic trace instead of silently returning `[]`.

**Files:** `skill_advisor.py` — `_apply_semantic_boosts()` error handling
<!-- /ANCHOR:approach -->

---

<!-- ANCHOR:verification -->
## 3. VERIFICATION

1. `python3 skill_graph_compiler.py --validate-only` — zero errors, warnings for P1-1 checks
2. `python3 skill_graph_compiler.py` — regenerated skill-graph.json includes intent_signals and prerequisite_for
3. `python3 skill_advisor.py --health` — graph loaded with updated skill count
4. Regression suite — 44+ cases pass with zero failures
5. Ghost candidate test: `"build something"` should NOT surface unrelated family members
6. Edge gap test: `"use figma"` should show mcp-code-mode via prerequisite_for boost
7. `python3 skill_graph_compiler.py --audit-drift` — reports overlap between boosters and graph
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:risks -->
## 4. RISKS

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Ghost candidate guard too aggressive | Medium | Only blocks zero-evidence skills; any lexical/phrase/semantic signal still allows graph boost |
| Compiled graph exceeds 4KB with intent_signals | Low | 20 skills x ~3 signals each = ~60 entries; compact JSON stays under 4KB |
| prerequisite_for creates over-boosting | Low | Uses same damping as depends_on (0.20); mcp-code-mode only has 3 edges |
| Removing deep-review ↔ deep-research sibling hurts recall | Low | They're different autonomous loop types; direct name matching still works |
<!-- /ANCHOR:risks -->
