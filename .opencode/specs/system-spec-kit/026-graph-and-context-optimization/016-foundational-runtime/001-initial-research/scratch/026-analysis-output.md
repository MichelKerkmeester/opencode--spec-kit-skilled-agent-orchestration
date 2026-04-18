# 026 Analysis: Candidates for Deep Review and Research

## Summary
I found **19 strong candidates** for deeper review or follow-up research across the 026 train: **7 HIGH**, **8 MEDIUM**, and **4 LOW**. The highest-value next work is concentrated in foundational runtime seams that either predate the 015 audit or remain risky even after it: hook-state production, graph/trust metadata, adaptive fusion's hidden continuity profile, and save-time governance in the planner-first `/memory:save` path.

## HIGH Priority — Likely needs attention

### Phase 002: cache-warning-hooks
- **`.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts`** — Parses Claude stop-hook transcripts, detects spec folders, computes transcript fingerprints and cache-token carry-forward, then invokes context autosave.
  - Why: This is the producer-side continuity seam that later resume and analytics work builds on. The regex-based spec-folder detection, 4-second autosave timeout, and transcript fingerprint contract deserve adversarial review because subtle failures here will look like downstream continuity bugs.
  - Priority: HIGH

- **`.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts`** — Persists per-session hook state, including producer metadata, pending compact payloads, and recent-state lookup.
  - Why: It is a temp-file authority surface for startup and recovery behavior, not just a cache. Deeper review should stress stale-state selection, scoped recent-state lookup, and atomic save semantics under concurrent or reused sessions.
  - Priority: HIGH

### Phase 005: code-graph-upgrades
- **`.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts`** — Defines detector provenance, structural trust, measurement authority, graph edge enrichment, and hot-file breadcrumb contracts shared by graph-owned payloads.
  - Why: This file is the trust vocabulary for later graph and continuity surfaces. The enum-heavy contract is now load-bearing, so it merits a forward-compatibility review before more producers and consumers depend on it.
  - Priority: HIGH

### Phase 008: cleanup-and-audit
- **`.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`** — Parses, normalizes, repairs, and refreshes packet-local `graph-metadata.json`, including legacy import paths and derived/manual field handling.
  - Why: This parser now governs metadata integrity across hundreds of packets. The manual-vs-derived merge behavior, legacy normalization path, and implicit status derivation deserve deeper review because mistakes here will silently distort packet discovery and graph traversal.
  - Priority: HIGH

### Phase 010: search-and-routing-tuning
- **`.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts`** — Adds the internal `continuity` fusion profile and reweights semantic, keyword, recency, and graph channels for resume-oriented retrieval.
  - Why: The continuity profile is intentionally hidden from the public intent surface, which makes drift harder to notice. It needs deeper review to confirm that only resume/continuation flows use it and that its private weighting does not quietly diverge from public search expectations.
  - Priority: HIGH

### Phase 014: memory-save-rewrite
- **`.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts`** — Gates save-time reconsolidation, loads candidate memories, and filters them by governed scope before merge/update.
  - Why: This is the patch point for the former scope-boundary P0 in the save pipeline. Even with the current exact-match filter, it deserves direct adversarial review with mixed tenant/user/agent/session combinations because a mistake here becomes a cross-boundary data-integrity failure.
  - Priority: HIGH

- **`.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts`** — Runs or defers post-insert enrichment based on planner mode and opt-in flags, and reports `deferred` follow-up behavior.
  - Why: Planner-first `/memory:save` depends on this file being contract-honest about when mutations did not run. It needs deeper review to ensure env-flag combinations cannot accidentally make the default "plan-only" path look non-mutating while still performing side effects.
  - Priority: HIGH

## MEDIUM Priority — Hardening opportunities

### Phase 003: memory-quality-remediation
- **`.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts`** — Reviews saved memory output, surfaces reviewer warnings, and performs predecessor/continuity discovery.
  - Why: It encodes subtle heuristics around lineage and quality feedback rather than hard schema rules. That makes it a good candidate for deeper review with real packet histories to see whether it over-links or under-links saves.
  - Priority: MEDIUM

- **`.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts`** — Normalizes and filters trigger phrases before they are reused by indexing and retrieval flows.
  - Why: The current defense is still regex/allowlist driven, so it would benefit from fuzzing against unicode, HTML, control characters, and prompt-shaped contamination. This is more hardening than suspected breakage, but it is a worthwhile next pass.
  - Priority: MEDIUM

### Phase 005: code-graph-upgrades
- **`.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts`** — Executes structural queries, bounded blast-radius traversal, multi-file union mode, numeric confidence attachment, and hot-file breadcrumbs.
  - Why: The logic is correct-looking but behaviorally dense: `maxDepth`, `unionMode`, breadcrumb thresholds, and graph-edge enrichment all interact in one handler. It merits deeper review and scenario testing, especially on cyclic graphs and multi-source blast-radius requests.
  - Priority: MEDIUM

### Phase 008: cleanup-and-audit
- **`.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts`** — Bulk backfills packet metadata across the repo and refreshes derived graph state at scale.
  - Why: This script carries rollout and repair risk rather than day-to-day runtime risk. It deserves review because it can silently entrench bad derived metadata across the whole packet corpus if assumptions drift.
  - Priority: MEDIUM

### Phase 011: skill-advisor-graph
- **`.opencode/skill/skill-advisor/scripts/skill_advisor.py`** — Loads skill graph state from SQLite or JSON, applies graph boosts/family affinity/conflict penalties, and routes skills accordingly.
  - Why: The routing behavior now depends on dual graph sources plus damped transitive boosts. It would benefit from deeper review around source divergence, rollout observability, and whether graph boosts remain subordinate to direct intent evidence.
  - Priority: MEDIUM

- **`.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py`** — Validates per-skill graph metadata and compiles the graph used by `skill_advisor.py`.
  - Why: The compiler does have symmetry and weight-parity checks, but they are warnings, not blockers. That makes it a good candidate for follow-up research into whether some graph integrity checks should become release-gating instead of advisory.
  - Priority: MEDIUM

### Phase 012: command-graph-consolidation
- **`.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml`** — Executes the canonical `/spec_kit:plan` workflow, including the `--intake-only` path that replaced `/spec_kit:start`.
  - Why: This command surface absorbed a lot of formerly separate intake behavior. It deserves deeper review for concurrency, idempotence, and folder-state edge cases because manual integration tests were explicitly deferred in the packet closeout.
  - Priority: MEDIUM

### Phase 015: implementation-deep-review
- **`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-packets-009-014-audit/implementation-summary.md`** — Summarizes the 120-iteration review, the 243 findings, and the planned remediation workstreams.
  - Why: This is not runtime code, but it remains the best concentration point for what 026 still knows is fragile. It deserves another research pass because the audit focused heavily on 009/010/012/014, while foundational earlier runtime packets received much less cross-cutting follow-up.
  - Priority: MEDIUM

## LOW Priority — Nice-to-have improvements

### Phase 001: research-graph-context-systems
- **`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/001-research-graph-context-systems/recommendations.md`** — Captures the cross-phase recommendations that shaped later graph, continuity, and measurement work.
  - Why: It is still worth revisiting as a decision baseline, especially for trust and measurement language, but the document itself is stable and research-oriented rather than a likely source of shipped defects.
  - Priority: LOW

### Phase 004: agent-execution-guardrails
- **`AGENTS.md`** — Holds the main execution-policy contract that Phase 004 aligned with sibling mirrors.
  - Why: The residual risk is drift, not current breakage. A periodic parity review is useful because the phase touched multiple AGENTS surfaces, but this is a nice-to-have compared with runtime handler review.
  - Priority: LOW

### Phase 006: continuity-refactor-gates
- **`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-continuity-refactor-gates/implementation-summary.md`** — Documents the repaired gates-only root after the 006 split and promotion of later work into 007-010.
  - Why: It would benefit from a cleanup pass for historical narrative consistency, but the packet is mostly coordination metadata now. Review value here is in documentation hygiene, not likely runtime bugs.
  - Priority: LOW

### Phase 009: playbook-and-remediation
- **`.opencode/skill/system-spec-kit/scripts/tests/manual-playbook-runner.ts`** — Executes automatable parts of the large manual-testing playbook and reports coverage.
  - Why: The main gap is that most scenarios remain intentionally unautomatable, so this is a nice-to-have target for future research into better coverage accounting rather than an urgent correctness concern.
  - Priority: LOW

## Cross-Cutting Observations
- **015 did not evenly cover the whole train.** Its deepest audit pressure landed on 009, 010, 012, and 014, while earlier foundational runtime packets such as 002, 003, and 005 still carry high leverage with comparatively less follow-on scrutiny.
- **Most residual risk is contract drift, not obvious broken logic.** The recurring pattern is "soft" or hidden semantics: planner-first save mode, internal continuity fusion weights, trust/provenance enums, manual-vs-derived graph metadata, and advisory graph integrity warnings.
- **Compatibility and deferred paths are recurring debt magnets.** Examples include reserved planner modes, no-op compatibility flags, advisory-only graph symmetry checks, deferred manual integration tests, and wrapper/mirror docs that lag authoritative sources.
- **Cross-runtime and cross-surface parity is still fragile.** Commands, skills, hooks, and spec metadata often have multiple mirrors or consumers; the next review investment should keep prioritizing surfaces where one change fans out to many runtimes or retrieval paths.
