# Deep-Research Iteration Prompt Pack

Dispatched via `codex exec gpt-5.4 --reasoning-effort=high --service-tier=fast`.

## STATE

STATE SUMMARY:
Segment: 1 | Iteration: 3 of 15
Last 2 ratios: 0.68 -> 0.57 | Stuck count: 0
Status of prior iters: iter 1 Q1 catalogue drafted (ratio 0.68); iter 2 Q2 invariants derived + Q3 H-56-1 scope verified (ratio 0.57). Q1-Q3 have substantial progress.

Research Topic: Canonical-save pipeline invariant research for system-spec-kit. See iteration-001.md and iteration-002.md for prior findings.

Iteration: 3 of 15
Focus Area: Q4 — Observe actual invariant holding across the 26 active 026-tree packets. Select a representative sample of at least 8 packets covering varied lifecycle states (research packets with iteration trees, shipped implementation packets, in-progress packets, recently-updated packets, old/stale packets). For each: read the 4 state layers (frontmatter _memory.continuity last_updated_at + description.json lastUpdated + graph-metadata.json derived.last_save_at + validator drift reports if any). Cross-check against the Q2 invariants derived in iter 2. Classify each observed divergence: expected (docs say so), benign (harmless artifact), latent (could mask real bug), or real (drops state). If ANY real divergence is found, escalate as P0.

Remaining Key Questions:
- Q1 ✓ draft (iter 1) — extend only if Q4 evidence reveals missed fields
- Q2 ✓ derived (iter 2) — may refine after Q4 observation
- Q3 ✓ verified (iter 2) — may re-verify if Q4 surfaces H-56-1-related drift
- Q4 (active focus): Observe invariant holding across 26 packets, classify divergences
- Q5 (blocked on Q4): Validator assertions + migration path

Last 3 Iterations Summary: run 1 Q1 catalogue draft (0.68), run 2 Q2+Q3 (0.57)

## STATE FILES

- Config: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-001-initial-research-001-canonical-save-invariants/deep-research-config.json
- State Log: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-001-initial-research-001-canonical-save-invariants/deep-research-state.jsonl
- Strategy: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-001-initial-research-001-canonical-save-invariants/deep-research-strategy.md
- Registry: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-001-initial-research-001-canonical-save-invariants/findings-registry.json
- Prior iterations: iteration-001.md, iteration-002.md (read these first for context)
- Write findings to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-001-initial-research-001-canonical-save-invariants/iterations/iteration-003.md

## CONSTRAINTS

- LEAF agent. No sub-dispatch. Max 12 tool calls.
- Read iteration-002.md for the Q2 invariants you're now observing.
- Sample 8+ packets from `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/` with varied lifecycle states.
- For each packet: read frontmatter continuity (from spec.md), description.json, graph-metadata.json; compute any lastUpdated/last_save_at delta.
- If a "real" divergence is found: emit P0 finding with reproduction steps.
- graphEvents array MUST include INVARIANT nodes (one per Q2 invariant), OBSERVATION nodes (one per packet audited), and HOLDS/VIOLATES edges.

## OUTPUT CONTRACT

1. Iteration narrative: `.../iterations/iteration-003.md` with Focus, Actions, Findings (per-packet observations + classifications), Questions Answered, Questions Remaining, Next Focus.
2. JSONL delta:
```json
{"type":"iteration","iteration":3,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[...]}
```
