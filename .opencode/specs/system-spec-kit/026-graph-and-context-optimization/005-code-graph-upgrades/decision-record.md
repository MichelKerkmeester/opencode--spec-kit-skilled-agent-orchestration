---
title: "Decision Record: Code Graph Upgrades"
description: "Decision record for 005-code-graph-upgrades."
trigger_phrases:
  - "005-code-graph-upgrades"
  - "decision"
  - "record"
importance_tier: "important"
contextType: "decision-record"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-code-graph-upgrades"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["decision-record.md"]

---
# Decision Record: Code Graph Upgrades

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Depend on packet 011 instead of replacing it

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-09 |
| **Deciders** | Current packet planning pass |

---

<!-- ANCHOR:adr-001-context -->
### Context

The roadmap explicitly states that packet `011` remains the validator owner and that this packet must add graph schema and query richness only after the validator contract is in place. Packet `011` already exists to validate graph and bridge payload trust metadata at emission time while preserving separate provenance, evidence, and freshness fields end to end on existing owner surfaces. [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:919-922] [SOURCE: ../z_archive/research-governance-contracts/011-graph-payload-validator-and-trust-preservation/spec.md:20-24]

### Constraints

- Must keep `011` authoritative for fail-closed trust validation.
- Must add graph richness only on current owner payloads.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Make `011` a hard predecessor and keep `014` additive on top of its payload contract instead of replacing it.

**How it works**: `014` can add edge evidence classes, numeric confidence backfill, detector provenance states, and graph-local query behavior, but only after `011` has stabilized the current owner payloads and trust-axis preservation seam. [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:952-953] [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:1008-1011]
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Depend on 011 and enrich current owners additively** | Preserves the shipped train and avoids a second graph authority | Requires sequencing discipline across packets | 9/10 |
| **Fold 011 into 014** | Fewer packet folders | Duplicates validator scope and breaks the planned train | 2/10 |
| **Create a graph-only replacement payload family** | Feels locally tidy for graph upgrades | Violates the roadmap's authority boundary | 1/10 |

**Why this one**: It preserves the current 026 train ordering and lets this packet focus on graph-local richness rather than trust-axis ownership.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The packet stays narrow and executable.
- Additive graph richness composes cleanly with the validator contract.

**What it costs**:
- Implementation must stop if `011` is incomplete. Mitigation: keep the dependency explicit in spec, plan, checklist, and parent DAG notes.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Scope drift into validator territory | H | Keep `011` named as a hard predecessor and reject replacement wording. |
| Payload richness lands before trust preservation is stable | H | Block implementation until `011` is complete enough for additive enrichment. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The roadmap makes `011` the validator owner and keeps this packet additive. |
| 2 | **Beyond Local Maxima?** | PASS | Replacement and graph-only-family alternatives were considered and rejected. |
| 3 | **Sufficient?** | PASS | The dependency is enough to protect trust-axis ownership while enabling graph-local upgrades. |
| 4 | **Fits Goal?** | PASS | The packet exists to improve graph quality without competing with the validator owner. |
| 5 | **Open Horizons?** | PASS | Later graph-local work can build on the preserved owner contract. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Packet-local planning docs and parent-DAG placement.
- Later runtime work only after `011` is verified complete enough to support additive graph richness.

**How to roll back**: Remove the packet entry from the parent DAG and archive `014` if the train changes or `011` absorbs the work formally.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

### ADR-002: Reject or defer PreToolUse and startup-surface nudges to packet 008

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-09 |
| **Deciders** | Current packet planning pass |

---

### Context

Packet `008` already owns readiness-gated structural hints on existing startup, resume, compact, and response-hint surfaces, and it explicitly keeps new graph routers or replacement retrieval owners out of scope. The roadmap therefore rejects or defers any PreToolUse or startup-surface nudge that would duplicate `008` and confines `014` to code-graph-local detector, schema, and query upgrades. [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:921-922] [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:1001-1002] [SOURCE: ../z_archive/research-governance-contracts/008-graph-first-routing-nudge/spec.md:58-67]

### Decision

**We chose**: Keep all startup, resume, compact, and response-surface nudges outside `014` and defer them to `008`.

**How it works**: `014` may improve graph-local outputs such as hot-file breadcrumbs or fallback metadata on code-graph-owned surfaces, but it cannot introduce routing nudges or PreToolUse behavior on shared startup or response surfaces. [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:917-917]

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Keep startup-surface nudges in 008 only** | Preserves clear packet authority | Requires one more packet boundary to remember | 9/10 |
| **Let 014 add graph-first nudges anywhere useful** | Seems convenient during implementation | Directly overlaps `008` scope | 2/10 |
| **Create a new routing facade in 014** | Unifies some graph-first behavior ideas | Reintroduces router sprawl and authority drift | 1/10 |

**Why this one**: The roadmap is explicit that `014` is a sibling side branch, not a routing packet.

### Consequences

**What improves**:
- The packet stays graph-local and easier to validate.
- Parent DAG placement remains stable.

**What it costs**:
- Some useful nudges remain outside day-one scope. Mitigation: preserve them as separate `008` or prototype-later work rather than mixing authorities.
---

### ADR-003: Keep routing facade, Leiden clustering, and GraphML/Cypher exports as prototype-later

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-09 |
| **Deciders** | Current packet planning pass |

---

### Context

The decision matrix classifies the `routeQuery()`-style facade, Leiden community clustering, and GraphML/Cypher export contracts as prototype-later rather than adopt-now. The same section also keeps additive rationale-node support and other larger graph-structure experiments out of the initial packet lane. [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:907-909] [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:913-913]

### Decision

**We chose**: Keep routing facade, Leiden clustering, and GraphML/Cypher exports out of the P0 lane and treat them as optional prototype-later work only.

**How it works**: The P0 packet focuses on provenance taxonomy, blast-radius hardening, hot-file breadcrumbs, and additive edge evidence richness. Larger routing and graph-structure expansions may be staged later behind explicit feature flags and non-authority wording. [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:1015-1025]

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Prototype-later for facade, clustering, and exports** | Keeps the adopt-now lane executable | Defers some appealing capabilities | 9/10 |
| **Ship all of them in P0** | Maximizes immediate surface area | Increases risk, complexity, and authority drift | 3/10 |
| **Reject them entirely** | Keeps the packet very small | Loses useful future lanes already supported by research | 5/10 |

**Why this one**: The matrix already scored these patterns as later candidates, so the packet should preserve that sequencing instead of reopening it.
---

### ADR-004: Place 014 as a post-R5/R6 side branch instead of a new prerequisite

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-09 |
| **Deciders** | Current packet planning pass |

---

### Context

The roadmap's DAG notes explicitly recommend inserting `005-code-graph-upgrades` as a post-R5/R6 side branch inside 026, not as a new prerequisite for the existing R1-R10 chain and not as a replacement for `013`'s warm-start bundle path. [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:1008-1011]

### Decision

**We chose**: Update the parent packet DAG with a side-branch entry under the existing R5/R6 work instead of assigning a new R-number or changing the current chain.

**How it works**: The parent packet records `014` as depending on `007` and `011`, remaining a sibling to `008` with explicit non-overlap, while the current R1-R10 order stays intact.
