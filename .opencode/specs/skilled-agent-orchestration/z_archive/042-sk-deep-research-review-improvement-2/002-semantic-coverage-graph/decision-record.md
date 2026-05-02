---
title: "Deci [skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/decision-record]"
description: "Accepted architecture decision for the coverage-graph substrate that powers deep-loop convergence."
trigger_phrases:
  - "042.002"
  - "decision record"
  - "semantic coverage graph"
importance_tier: "important"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["decision-record.md"]
---
# Decision Record: Semantic Coverage Graph

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Reuse the existing graph substrate and add a dedicated coverage ontology with explicit fallback

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-11 |
| **Deciders** | Packet 042 closeout |

---

<!-- ANCHOR:adr-001-context -->
### Context

We needed a graph substrate that could explain semantic coverage for deep research and deep review without creating a second hidden runtime model. The repo already had mature graph primitives for edges, signals, contradiction reporting, and SQLite lifecycle management under the Spec Kit Memory MCP server, but it did not have a loop-native ontology with question, claim, evidence, dimension, and remediation semantics. At the same time, JSONL packet state had to remain the upstream authority, so the persistence layer could not depend entirely on MCP availability.

### Constraints

- Phase 001 stop legality had to remain the canonical stop-decision envelope.
- Research and review semantics could not be flattened into one generic graph vocabulary.
- The graph store had to isolate research and review sessions by `spec_folder`, `loop_type`, and `session_id`.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: extract reusable graph primitives into shared coverage-graph helpers, persist graph projection in a dedicated `deep-loop-graph.sqlite` store, and preserve the authority chain `JSONL -> local JSON graph -> SQLite projection`.

**How it works**: Common behavior such as edge management, self-loop prevention, signal computation, contradiction scanning, and SQLite lifecycle setup moves into explicit coverage-graph helpers. Research and review keep separate node kinds, relation sets, and convergence formulas, while reducer integration preserves packet-local truth and falls back cleanly when MCP is unavailable.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Reuse shared graph primitives with a coverage ontology and explicit fallback** | Keeps proven behavior, supports rich queries, and preserves packet-local truth | Requires careful adaptation work and explicit reducer/MCP seam design | 9/10 |
| Build a brand-new coverage graph stack | Clean slate for ontology design | Throws away proven graph behavior and duplicates storage/query logic | 5/10 |
| Reuse the memory causal graph directly without adaptation | Fastest on paper | Hides semantic mismatches and risks pretending coverage semantics are identical to causal memory semantics | 3/10 |

**Why this one**: It preserves the repo's graph investment while making the genuinely new deep-loop semantics explicit and keeping graph projection subordinate to packet-local truth.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Shared graph logic is implemented once and reused consistently across handlers, reducer integration, and tests.
- Research and review keep explicit ontologies, so future convergence work can evolve without re-litigating the storage layer.
- Query, status, and convergence surfaces can use a dedicated SQLite projection without treating it as the source of truth.

**What it costs**:
- Adaptation work is more visible than a copy-paste implementation. Mitigation: track reuse posture explicitly in spec, plan, and tasks.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Reuse is overstated and hides adaptation work | H | Keep reuse percentages and calibration work explicit in the phase docs and tests |
| One loop type leaks ontology rules into the other | M | Centralize allowed relation maps and loop-type-aware convergence formulas |
| MCP loss causes missing graph summaries | H | Keep the local JSON fallback path explicit and replayable |
| Projection latency slows iteration closeout | M | Define and enforce a latency budget in the reducer/MCP seam |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The phase needed a concrete semantic substrate, not just more stop-score prose |
| 2 | **Beyond Local Maxima?** | PASS | The alternatives include greenfield, direct causal reuse, and explicit fallback thinking |
| 3 | **Sufficient?** | PASS | Reusing the common substrate is simpler than building a second graph stack |
| 4 | **Fits Goal?** | PASS | The decision keeps Phase 002 focused on semantic coverage, not unrelated platform work |
| 5 | **Open Horizons?** | PASS | Explicit ontologies and fallback semantics leave room for later wave and optimizer phases |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Extract `coverage-graph-core.cjs`, `coverage-graph-signals.cjs`, `coverage-graph-contradictions.cjs`, and `coverage-graph-convergence.cjs`
- Add `coverage-graph-db.ts`, query/status/convergence handlers, and tool schema entries
- Document the reducer/MCP seam, namespace boundaries, and fallback authority chain in the phase docs

**How to roll back**: Stop using the extracted coverage-graph helper layer, keep Phase 001 stop logic authoritative, disable the coverage-graph tool wiring, and fall back to reducer-only JSON artifacts until the projection path is corrected.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
