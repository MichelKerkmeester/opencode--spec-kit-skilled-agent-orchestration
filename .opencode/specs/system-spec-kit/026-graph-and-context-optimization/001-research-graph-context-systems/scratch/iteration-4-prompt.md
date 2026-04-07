# ITERATION 4 — Q-B Capability matrix (cross-phase synthesis #1, foundational)

You are **codex** (`gpt-5.4`, reasoning effort `high`), running **iteration 4 of 12 max** in a deep-research consolidation orchestrated by Claude.

This iteration kicks off **cross-phase synthesis** (charter §3.1, iterations 4–6). Q-B is foundational because Q-A (token honesty) and Q-E/Q-C (gating + composition) build on the capability picture.

## Charter (read fully first)

`scratch/deep-research-prompt-master-consolidation.md`

## Folder layout

```
research/
├── deep-research-config.json     # state (orchestrator)
├── deep-research-state.jsonl     # state (orchestrator) — append iter event here
├── deep-research-strategy.md     # state (orchestrator)
├── deep-research-dashboard.md    # state (orchestrator)
├── phase-1-inventory.json        # FOUNDATION (do not modify)
├── iterations/                   # per-iteration outputs LIVE HERE
│   ├── iteration-1.md
│   ├── iteration-2.md
│   ├── gap-closure-phases-1-2.json
│   ├── iteration-3.md
│   ├── gap-closure-phases-3-4-5.json
│   └── (iter-4 outputs land here)
└── (final deliverables — go in research/ ROOT)
    ├── cross-phase-matrix.md     # ← iter 4 produces this
    ├── research.md
    ├── findings-registry.json
    └── recommendations.md
```

**Critical:** `cross-phase-matrix.md` is a FINAL DELIVERABLE → goes in `research/` ROOT, NOT `iterations/`. The per-iter report (`iteration-4.md`) goes in `iterations/`.

## Prior iteration outputs (context)

- `research/phase-1-inventory.json` — 274-item dedup baseline.
- `research/iterations/iteration-1.md` — anomalies + per-phase counts.
- `research/iterations/iteration-2.md` + `research/iterations/gap-closure-phases-1-2.json` — phase 1+2 gap closures (4 closed / 5 partial / 1 UNKNOWN, 7 new findings).
- `research/iterations/iteration-3.md` + `research/iterations/gap-closure-phases-3-4-5.json` — phase 3+4+5 gap closures (12 closed / 3 partial / 1 UNKNOWN, 5 new findings).
- `research/deep-research-strategy.md` — full charter recap.

## Spec folder (pre-approved, skip Gate 3)

`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems`

`--cd` is set here. **Permission:** read any of the 5 phase folders + their `external/` subfolders for evidence. You may also read **Public's own retrieval-stack code** (CocoIndex, Code Graph MCP, Spec Kit Memory) for the Public baseline column — see §"Public baseline" below.

---

## Iteration 4 mission: Build the Capability Matrix (Q-B)

Per charter §2.4 Q-B and §4.4: score each system + Public against a unified rubric across **9 capabilities**, identify the dominant system per row, and identify capability rows that **no system fills** (Public's true gaps).

### The 9 capabilities (charter §2.4 Q-B)

1. **Code AST coverage** — How much of the codebase does the system parse to a real AST (vs regex / heuristic / not at all), and across how many languages?
2. **Multimodal support** — Can the system extract context from non-code artifacts (docs, images, configs, data files, screenshots, conversations)?
3. **Structural query** — Can you ask "who calls X / what does X depend on / show me the call chain" with line-level precision?
4. **Semantic query** — Can you ask "find code that does X" via embeddings / NL search / concept retrieval?
5. **Memory / continuity** — Does the system persist context across sessions (search history, prior decisions, user preferences)?
6. **Observability** — Does the system instrument its own behavior (tokens spent, retrieval quality, hit/miss rates, audit logs)?
7. **Hook integration** — Does the system integrate with Claude Code / OpenCode hooks (PreToolUse, Stop, etc.)?
8. **License compatibility** — Is the source license compatible with Public's stack (MIT/Apache vs GPL/AGPL vs proprietary)?
9. **Runtime portability** — Does it run in Node, Python, Bun, Rust, or require a specific runtime that Public doesn't already have?

### Score scale

- `0` = absent
- `1` = partial (works for narrow cases or with significant caveats)
- `2` = full (production-grade, broad coverage)
- `–` = N/A (capability genuinely doesn't apply to this system's mission)

Every score MUST cite at least one `[SOURCE: ...]` evidence pointer per the charter §3.5 grammar.

### Public baseline column

For the "Public (baseline)" column, score Public's existing stack:
- **CocoIndex** for semantic query — read `.opencode/skill/mcp-coco-index/SKILL.md` and `.opencode/skill/mcp-coco-index/scripts/` if needed
- **Code Graph MCP** for structural query — search for `code_graph_*` references
- **Spec Kit Memory** for memory/continuity — read `.opencode/skill/system-spec-kit/SKILL.md` and `mcp_server/lib/`
- For other capabilities, score Public conservatively based on what currently exists in `.opencode/` (do not assume capabilities that aren't shipped)

If Public's score is `–` because the capability doesn't fit Public's design, mark it `–` and note why in a footnote.

### Dominant column

For each row, identify the system with the highest score. If two systems tie, pick the one with broader coverage and note the tie. If Public ties or wins, say so explicitly.

---

## Output 1 — `research/cross-phase-matrix.md` (the FINAL DELIVERABLE)

```markdown
# Cross-Phase Capability Matrix

> Iteration 4 of master consolidation. Scoring rubric: 0 = absent, 1 = partial, 2 = full, – = N/A.
> Every score is cited; see footnote refs.

## Capability scores

| # | Capability | 001 Settings | 002 CodeSight | 003 Contextador | 004 Graphify | 005 Claudest | Public (baseline) | Dominant |
|---|------------|--------------|---------------|-----------------|--------------|--------------|-------------------|----------|
| 1 | Code AST coverage | … | … | … | … | … | … | … |
| 2 | Multimodal support | … | … | … | … | … | … | … |
| 3 | Structural query | … | … | … | … | … | … | … |
| 4 | Semantic query | … | … | … | … | … | … | … |
| 5 | Memory / continuity | … | … | … | … | … | … | … |
| 6 | Observability | … | … | … | … | … | … | … |
| 7 | Hook integration | … | … | … | … | … | … | … |
| 8 | License compatibility | … | … | … | … | … | … | … |
| 9 | Runtime portability | … | … | … | … | … | … | … |

## Per-capability rationale

### 1. Code AST coverage
- **001 Settings** = X. [SOURCE: …] (one-sentence justification)
- **002 CodeSight** = X. [SOURCE: …] …
- … (all 7 columns)
- **Dominant:** … because …

(repeat for all 9 capabilities)

## Public's true gaps (no system fills)

Capabilities where the highest score across all 5 systems + Public is `0` or `1`:
- **Capability X**: highest score = 1; reason no one solves it: …; what would solve it: …

If no row qualifies, state explicitly: "Every capability has at least one system scoring 2."

## Aggregate dominance count

| System | Capabilities where dominant |
|---|---|
| 001 | … |
| 002 | … |
| 003 | … |
| 004 | … |
| 005 | … |
| Public | … |

## Footnotes / caveats

- (any tied scores, edge cases, or N/A justifications)
```

---

## Output 2 — `research/iterations/iteration-4.md` (≤500 lines)

```markdown
# Iteration 4 — Q-B Capability matrix

## Method
- Inputs read: …
- Scoring approach: …

## Scoring summary
| Capability | Top score | Dominant system | Public score | Public gap? |

## Surprises
- Bullet observations from cross-comparison (e.g. "002 CodeSight scored 2 on AST despite the Go regex mislabel — its other 11 languages compensate")

## Handoff to iteration 5 (Q-A token honesty)
- Cite which matrix rows iter-5 will need most (semantic, structural, observability)
```

---

## Output 3 — append to `research/deep-research-state.jsonl`

Append exactly **one** JSONL line:

```json
{"event":"iteration_complete","iteration":4,"timestamp":"<ISO-8601-UTC>","worker":"codex/gpt-5.4/high","scope":"q_b_capability_matrix","capabilities_scored":9,"systems_scored":6,"dominant_per_system":{"001":<int>,"002":<int>,"003":<int>,"004":<int>,"005":<int>,"public":<int>},"true_gaps_count":<int>,"composite_score_estimate":<0..1>,"new_info_ratio":<0..1>,"stop_reason":"iteration_4_done","next_iteration_ready":true,"notes":"<≤200 chars>"}
```

---

## Final stdout line (mandatory)

```
ITERATION_4_COMPLETE matrix=9x6 dominant_001=<n> 002=<n> 003=<n> 004=<n> 005=<n> public=<n> public_gaps=<n>
```

---

## Constraints

- **LEAF-only** — no sub-agent dispatch
- Do NOT re-attempt earlier gap closures
- Do NOT modify any phase folder or phase doc
- `cross-phase-matrix.md` MUST go in `research/` ROOT (final deliverable, not in iterations/)
- `iteration-4.md` MUST go in `research/iterations/`
- Every score must trace to at least one `[SOURCE: ...]` citation
- For the Public baseline: read `.opencode/skill/` files in this same workspace; do NOT score Public on assumed capabilities
- If a capability is genuinely N/A for a system (e.g. "001 is a Reddit field-report audit, not a runtime — Hook integration is N/A"), mark `–` and footnote
- Confidence — every score should be defensible from at least one source line; if unsure, score conservatively (lower) and note the uncertainty

## When done

Exit. Do NOT start iteration 5. Claude orchestrator will validate and dispatch iteration 5 (Q-A Token honesty audit, which depends on this matrix).
