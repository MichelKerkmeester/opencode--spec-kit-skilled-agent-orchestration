---
title: "Implementation Plan: Code Graph Upgrades [template:level_3/plan.md]"
description: "Plan the bounded post-R5/R6 code-graph upgrade packet using the §20 roadmap as the direct source of truth."
trigger_phrases:
  - "014-code-graph-upgrades"
  - "implementation"
  - "plan"
importance_tier: "important"
contextType: "planning"
---
# Implementation Plan: Code Graph Upgrades

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript runtime surfaces plus Markdown packet docs |
| **Framework** | system-spec-kit Code Graph MCP and packet workflow |
| **Storage** | Existing code-graph payloads, detector metadata, query envelopes, and optional additive graph metadata |
| **Testing** | Frozen detector fixtures, blast-radius corpora, payload snapshots, `validate.sh --strict` |

### Overview
Ship the bounded code-graph upgrade lane that improves detector fidelity, graph payload richness, and code-graph-local query ergonomics while explicitly depending on existing trust and routing packets instead of competing with them. [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:930-932]
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The §20 roadmap is the canonical source of truth and does not need re-derivation.
- [x] Hard predecessors `007` and `011` are named explicitly.
- [x] Packet `008` remains out of scope for startup, resume, compact, and response-surface nudges.

### Definition of Done
- [ ] Packet docs are synchronized and placeholder-free.
- [ ] The nine roadmap tasks remain bounded to graph-local detector, payload, and query surfaces.
- [ ] `validate.sh --strict` passes on the packet folder before any implementation claim.
<!-- /ANCHOR:quality-gates -->

---

### AI Execution Protocol

### Pre-Task Checklist

- Re-read §20.5 through §20.8 before any implementation work starts.
- Confirm packet `007` still owns detector regression floors.
- Confirm packet `011` still owns additive trust-axis validation and payload preservation.
- Confirm packet `008` still owns readiness-gated structural nudges on startup, resume, compact, and response surfaces.

### Execution Rules

| Rule ID | Rule | Why |
|---------|------|-----|
| AI-SCOPE-001 | Keep work inside detector, payload, and query surfaces already owned by the Code Graph MCP | Prevents graph-authority sprawl |
| AI-BOUNDARY-001 | Treat `007` and `011` as hard predecessors | Keeps provenance and trust vocabulary aligned to the existing train |
| AI-NONOVERLAP-001 | Reject startup, resume, compact, or response-surface nudges in this packet | Preserves packet `008` authority |
| AI-VERIFY-001 | Require frozen fixtures, payload snapshots, and strict packet validation before rollout claims | Keeps the packet honest about graph precision |

### Status Reporting Format

- Start state: `007` and `011` dependency status, packet boundary, and the first graph-local seam to touch
- Work state: detector, payload, or query lane underway plus any scope or dependency blockers
- End state: focused verification results, strict packet validator result, and parent-DAG handoff notes

### Blocked Task Protocol

1. Stop immediately if `007` or `011` no longer provide the prerequisite floor this packet assumes.
2. Do not widen scope to solve the blocker; record the dependency gap and keep the packet draft bounded.
3. Resume only after the dependency contradiction is resolved and packet docs are updated accordingly.

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive code-graph upgrade packet

### Key Components
- Detector provenance taxonomy and serialization seams
- Blast-radius traversal and hot-file breadcrumb query outputs
- Existing graph payload owners that can absorb edge evidence classes and numeric confidence
- Optional graph-local fallback tiering, clustering metadata, and export contracts behind bounded flags

### Data Flow
The packet upgrades graph-local detector metadata, traversal semantics, and additive payload richness on current owners, then verifies those changes with frozen fixtures and packet validation without creating a second graph authority or replacing packet `008` or `011`. [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:936-945] [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:1008-1011]
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Re-read the §20 roadmap, packet `007`, packet `011`, and packet `008` boundary notes.
- [ ] Confirm the graph-local detector, payload, and query seams that match the adopt-now lane.
- [ ] Verify the packet still sits as a post-R5/R6 side branch rather than a new prerequisite.

### Phase 2: Core Implementation
- [ ] Implement detector provenance taxonomy plus AST or structured-fallback discipline.
- [ ] Implement blast-radius depth-cap correction, multi-file union semantics, and honest hot-file breadcrumbs.
- [ ] Add additive edge evidence classes and numeric confidence backfill after `011`.
- [ ] Keep optional fallback, clustering, and export work behind explicit gating and non-authority wording.

### Phase 3: Verification
- [ ] Run frozen provenance fixtures, blast-radius corpora, and payload snapshot checks.
- [ ] Run strict packet validation.
- [ ] Record any follow-on or deferred prototype-later work without reclassifying it as day-one scope.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Frozen detector fixtures | Provenance taxonomy and fallback serialization | Vitest or packet-local fixtures under `007` discipline |
| Query-shape verification | Blast-radius depth behavior, multi-file union, hot-file breadcrumbs | Packet-local runtime checks and fixture corpora |
| Payload snapshots | Edge evidence classes and numeric confidence on current owners | Snapshot or contract tests after `011` |
| Packet validation | Spec-doc compliance and checklist alignment | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `007-detector-regression-floor` | Internal | Required | Provenance and traversal changes cannot ship without the frozen regression-floor discipline |
| `011-graph-payload-validator-and-trust-preservation` | Internal | Required | Edge evidence and numeric confidence must stay additive on current owners after `011` |
| `008-graph-first-routing-nudge` boundary notes | Internal | Required boundary | Startup-surface nudge work must be rejected or deferred to avoid scope overlap |
| Claudest/R7 fallback pattern | Internal optional | Optional | Graph-local fallback tiering can borrow the pattern but does not block the packet |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The packet creates a competing graph authority, overlaps packet `008`, or bypasses `007` or `011` dependency boundaries.
- **Procedure**: Revert packet-local runtime changes, keep current owner payloads authoritative, and re-open implementation only after the dependency or scope issue is resolved.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Research charter -> 014 packet docs -> implementation activation
007 detector regression floor -> 014 detector and traversal work
011 graph payload validator -> 014 additive payload richness
014 code-graph upgrades -> sibling lane to 008 (explicit non-overlap)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | §20 roadmap plus `007`/`011`/`008` boundary review | Core work |
| Core work | Setup, `007`, `011` | Verification |
| Verification | Core work | Activation or closeout |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | 0.5-1 day |
| Core Implementation | Medium-High | 2-4 days |
| Verification | Medium | 1-2 days |
| **Total** | | **3.5-7 days** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] `007` re-verified as the detector regression floor
- [ ] `011` re-verified as the additive payload validator
- [ ] `008` non-overlap boundary re-read

### Rollback Procedure
1. Revert packet-local runtime changes.
2. Re-run frozen fixtures and packet validation to confirm the previous behavior is restored.
3. Update packet docs if dependency or scope assumptions changed.

### Data Reversal
- **Has data migrations?** No by default for this planning packet.
- **Reversal procedure**: Remove additive metadata or gated optional lanes if later implementation adds them.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
Research root
  -> 007-detector-regression-floor
  -> 011-graph-payload-validator-and-trust-preservation
       -> 014-code-graph-upgrades
            -> optional future graph-local rollout

008-graph-first-routing-nudge stays a sibling lane and is not extended by 014
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Packet contract | §20 roadmap, `007`, `011`, `008` boundary | Stable graph-local scope | Runtime implementation |
| Detector and query changes | Packet contract, `007` | Honest provenance and bounded traversal semantics | Payload verification |
| Payload enrichment | Detector/query changes, `011` | Additive edge evidence and numeric confidence | Closeout |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. Lock `007` and `011` as hard predecessors and keep `008` out of scope.
2. Implement the adopt-now lane: provenance taxonomy, blast-radius hardening, hot-file breadcrumbs, and additive edge evidence richness.
3. Prove the graph-local changes with frozen fixtures, payload snapshots, and strict packet validation.

**Total Critical Path**: 3 sequential steps

**Parallel Opportunities**:
- Optional fallback tiering research can stay behind gating while the adopt-now lane is implemented.
- Prototype-later clustering/export notes can be maintained in docs without blocking the P0/P1 path.
<!-- /ANCHOR:critical-path -->
