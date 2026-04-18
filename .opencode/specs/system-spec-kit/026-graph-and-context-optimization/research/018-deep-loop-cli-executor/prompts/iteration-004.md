# Deep-Research Iteration Prompt Pack

## STATE

STATE SUMMARY (auto-generated): Session dr-20260418T120854Z-9c57f9 | Iteration: 4 of 30 | Last iteration completed: 3

Research Topic: Post-Phase-017 refinement, improvement, bug, and follow-up surface under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/017-review-findings-remediation/`. Investigate: metadata-freshness regen stability (H-56-1 aftermath + description.json auto-regen preserve-field gaps), code-graph readiness vocabulary completeness across the 7 sibling handlers, NFKC + evidence-marker + lint false-positive surfaces, retry-budget policy calibration (N=3 empirical basis), AsyncLocalStorage caller-context propagation edge cases, Copilot autonomous-execution hardening preconditions, Wave-D deferred P2 coupling risk (R55-P2-002/003/004), + 16-folder canonical-save sweep ordering invariants. Deliverable: Phase-019+ scoping document with prioritized findings (P0/P1/P2), reproduction paths, + risk-ranked remediation candidates.

Iteration: 4 of 30
Focus Area: Q9: evidence-marker bracket-depth lint false-positive surface. Inspect whether nested fences, mismatched fenced content, or parenthesis-heavy evidence blocks can trigger invalid bracket-depth diagnostics despite syntactically acceptable markdown.

Remaining Key Questions:
- Q1. Does H-56-1's two-batch 16-folder metadata refresh introduce clock-skew or concurrent-save ordering inconsistencies in `description.json.lastUpdated` vs `graph-metadata.json.derived.last_save_at`?
- Q2. What are the root causes + mitigation options for `generate-description.js` auto-regen overwriting hand-authored rich content in spec folders?
- Q3. Are all 8 `SharedPayloadTrustState` enum values actually reachable from each of the 7 code-graph sibling handlers, or is there dead-code vocabulary?
- Q4. How robust is NFKC unicode sanitization against homoglyph attacks beyond the 5 tested scripts (Cyrillic, zero-width, Greek, soft hyphen, combined)?
- Q5. Is the N=3 retry budget for `partial_causal_link_unresolved` empirically justified or arbitrary? What's the actual failure-resolution distribution?
- Q6. Does AsyncLocalStorage caller-context propagation survive across all async boundaries (setTimeout, Promise.all, event loop migrations)?
- Q7. What are the remaining Copilot-specific observability gaps post-Cluster E (compact-cache + session-prime), and how do they affect autonomous execution?
- Q8. What's the coupling risk of Wave-D deferred P2 items (R55-P2-002 importance-tier helper, R55-P2-003 executeConflict DRY, R55-P2-004 YAML evolution gap) being carried forward into Phase 019?
- Q9. Does evidence-marker bracket-depth lint produce false positives in edge cases (nested code blocks, fenced content with mismatched fences, paren-heavy content)?
- Q10. Is the 10-minute continuity-freshness threshold for `_memory.continuity.last_updated_at` vs `graph-metadata.derived.last_save_at` calibrated to real metadata-refresh latency, or is it a guess?

Last 3 Iterations Summary:
- Iter 1: focus='H-56-1 cascade consistency across the 16-folder sweep' status='q1-partial-original-sweep-split-and-current-drift-confirmed' newInfoRatio=0.38
- Iter 2: focus='Q2: description.json auto-regeneration preserve-field gaps' status='q2-partial-generator-overwrite-contract-and-stub-shape-confirmed' newInfoRatio=0.33
- Iter 3: focus='Q3: code-graph readiness vocabulary completeness' status='q3-partial-handler-reachability-matrix-and-dead-vocabulary-subset-confirmed' newInfoRatio=0.29

## STATE FILES

All paths are relative to the repo root.

- Config: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/018-deep-loop-cli-executor/deep-research-config.json
- State Log: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/018-deep-loop-cli-executor/deep-research-state.jsonl
- Strategy: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/018-deep-loop-cli-executor/deep-research-strategy.md
- Registry: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/018-deep-loop-cli-executor/findings-registry.json
- Write findings to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/018-deep-loop-cli-executor/iterations/iteration-004.md

You may read prior iterations from `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/018-deep-loop-cli-executor/iterations/` to understand context.

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 3-5 research actions. Max 12 tool calls total.
- Write ALL findings to files. Do not hold in context.
- The workflow reducer owns strategy machine-owned sections, registry, and dashboard synchronization.
- When emitting the iteration JSONL record, include an optional `graphEvents` array of objects describing coverage graph nodes and edges discovered this iteration. Omit the field when no graph events are produced.
- Working directory for all reads/writes: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`

## OUTPUT CONTRACT

You MUST produce TWO artifacts per iteration. The post-dispatch validator will fail if either is missing or malformed.

1. **Iteration narrative markdown** at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/018-deep-loop-cli-executor/iterations/iteration-004.md`. Structure: headings for Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Next Focus.

2. **JSONL delta record** appended to `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/018-deep-loop-cli-executor/deep-research-state.jsonl` with the required schema:

```
{"type":"iteration","iteration":4,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[/* optional */]}
```

Both artifacts are REQUIRED.
