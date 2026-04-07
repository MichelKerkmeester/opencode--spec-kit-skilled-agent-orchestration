# ITERATION 13 — Public's existing infrastructure deep-inventory

You are **codex** (`gpt-5.4`, reasoning effort `high`), running **iteration 13 of 18 max**. Rigor lane iter 5 of 10.

## Charter

`scratch/deep-research-prompt-master-consolidation.md`

## Why this iter

Iters 1-7 scored Public's stack lightly because they were focused on the 5 external systems. Iter-12's combo stress-test surfaced "hidden prerequisites" — things Public's infrastructure may already provide (or definitely not provide) that affect composition risk. **This iter takes a serious inventory of what Public actually ships in `.opencode/`.** The goal: discover what we missed in iter-4 (capability matrix) and iter-6 (composition risk).

## Spec folder (pre-approved, skip Gate 3)

`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems`

`--cd` set here. `--add-dir .opencode/` is set so you can read Public's code.

---

## Iteration 13 mission: Inventory Public's stack and identify gaps in our prior characterization

### Step 1 — Inventory directories

For each of these directories under `.opencode/`, list every file and characterize what it does (1 line each):

| Directory | Purpose |
|---|---|
| `.opencode/skill/` | Skill definitions (sk-*, mcp-*, cli-*) |
| `.opencode/skill/system-spec-kit/` | Spec Kit Memory + system-spec-kit |
| `.opencode/skill/system-spec-kit/mcp_server/` | MCP server (handlers, lib) |
| `.opencode/skill/mcp-coco-index/` | CocoIndex semantic search |
| `.opencode/agent/` | Agent definitions |
| `.opencode/command/` | Slash commands |
| `.opencode/specs/` | Spec folders (don't enumerate all — note count + structure) |

Don't list all 1000+ files. Group by purpose. Aim for 30-60 logical groupings with file counts.

### Step 2 — Capabilities matrix delta vs iter-4

For each of the 9 capabilities scored in iter-4, re-evaluate Public's score with the new evidence:

| Capability | Iter-4 score | Iter-13 score | Delta | Why |
|---|---|---|---|---|
| Code AST coverage | 1 | ? | ? | (cite specific files) |
| Multimodal support | 1 | ? | ? | ... |
| ... |

Be honest. If Public's score should go UP, say so. If it should go DOWN (missing infrastructure we assumed existed), say so.

### Step 3 — Hidden prerequisites discovery

For each of the 28 Q-C candidates, check whether Public's actual infrastructure has the prerequisites the candidate assumes:
- Does the candidate need a hook system Public has? (yes/no/partial)
- Does it need a database table Public has? (yes/no/partial)
- Does it need an MCP tool Public has? (yes/no/partial)

Output: list of prerequisites that Public DOES NOT have today (gating items for adoption).

### Step 4 — Capabilities Public has that no external system replicates

What does Public uniquely have? (e.g. session bootstrap from compact-cache, drift detection, ablation studies, constitutional memory rules, etc.) These are Public's moats — they should INFORM v2's recommendation language.

---

## Output 1 — `research/iterations/public-infrastructure-iter-13.md`

```markdown
# Iteration 13 — Public Infrastructure Deep-Inventory

> Goal: discover what iters 1-7 missed about Public's actual stack.

## TL;DR
- ≤8 bullets

## .opencode/ directory inventory

### .opencode/skill/
| Subdir | File count | Purpose | Notable files |
| ... |

### .opencode/skill/system-spec-kit/mcp_server/
| Subdir | Files | Purpose |
| handlers/ | <n> | Tool handler implementations |
| lib/ | <n> | Shared libraries |
| ... |

### .opencode/agent/
(list of agent definitions)

### .opencode/command/
(list of slash command groups)

## Capability matrix delta

| Capability | Iter-4 | Iter-13 | Delta | Evidence |
| 1 Code AST | 1 | <n> | <±n> | [SOURCE: ...] |
| ... (all 9) |

### What changed
- (per row: explain why score moved or stayed)

## Hidden prerequisites for Q-C candidates

### Candidates with prerequisites Public DOES NOT have today
- <candidate>: needs <prereq>; Public lacks because <reason>; would block adoption until <fix>
- ... (top 10)

### Candidates whose prerequisites Public DOES have
- <candidate>: needs <prereq>; Public ships <evidence>; safe to adopt

## Public's unique moats (not replicated by any external system)

- <moat>: <description> + [SOURCE: ...]
- ... (top 5-10)

## Recommendations for v2

- Capabilities matrix score updates iter-17 should apply
- Composition risk re-scoring iter-17 should apply
- New "Public moats" section iter-17 should consider adding
```

---

## Output 2 — `research/iterations/iteration-13.md` (≤200 lines)

```markdown
# Iteration 13 — Per-iter report

## Method
- Inventoried .opencode/ tree
- Re-scored Public column on capability matrix

## Inventory totals
- .opencode/skill/: <count> skills
- .opencode/agent/: <count> agents
- .opencode/command/: <count> command groups
- mcp_server/handlers/: <count>

## Delta summary
| Capability | Direction | Magnitude |

## Top 3 surprises
- ...

## Handoff to iter-14
- iter-14 will reality-check S/M/L effort estimates against this infrastructure inventory
```

---

## Output 3 — append to `research/deep-research-state.jsonl`

```json
{"event":"iteration_complete","iteration":13,"timestamp":"<ISO-8601-UTC>","worker":"codex/gpt-5.4/high","scope":"public_infrastructure_inventory","directories_scanned":<int>,"capability_score_changes":<int>,"hidden_prereqs_found":<int>,"public_moats_identified":<int>,"composite_score_estimate":<0..1>,"new_info_ratio":<0..1>,"stop_reason":"iteration_13_done","next_iteration_ready":true,"notes":"<≤200 chars>"}
```

---

## Final stdout line (mandatory)

```
ITERATION_13_COMPLETE dirs=<n> capability_changes=<n> hidden_prereqs=<n> moats=<n>
```

---

## Constraints

- **LEAF-only**
- DO NOT modify v1 deliverables
- DO NOT modify the iter-4 cross-phase-matrix.md (write deltas in the new file)
- Use literal `00N-folder/` paths for any external citations (NOT `phase-N/`)
- For Public files use absolute or workspace-relative paths
- Focus on infrastructure, not implementation details
- Don't enumerate every file — group by purpose
- Be honest if Public is WEAKER than iter-4 claimed (e.g. if Public scored 2 on observability but actually has gaps)

## When done

Exit. Do NOT start iter-14.
