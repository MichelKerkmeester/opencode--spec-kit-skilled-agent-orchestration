---
title: "Decision Record: Post-Save Render Fixes"
description: "Decision record for the scoped render-layer remediation packet 009."
trigger_phrases:
  - "009 render adr"
  - "post-save render decisions"
importance_tier: "important"
contextType: "decision-record"
---
# Decision Record: Post-Save Render Fixes

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Scope 009 to render-layer fixes only

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-09 |
| **Deciders** | Current packet implementation pass |

---

### Context

The sibling research packet defines the compact-wrapper contract, and `003/006` already shipped the wrapper-template runtime plus the Phase 6 sanitizer and duplication-review guardrails. The 014 audit shows that the remaining defects are visible at the render surface, not in the wrapper body contract itself. [SOURCE: ../../001-research-graph-context-systems/006-research-memory-redundancy/research/research.md:103-120] [SOURCE: ../006-memory-duplication-reduction/implementation-summary.md:25-67] [SOURCE: ../../005-code-graph-upgrades/memory/09-04-26_10-30__implemented-the-014-code-graph-upgrade-runtime.md:107-139]

### Decision

**We chose**: Keep `009` strictly inside the render layer of `generate-context.js` and its extractor helpers.

**How it works**: `009` may modify title building, canonical-source discovery, file-count plumbing, trigger extraction, evidence selection, phase/status capture, lineage assembly, parent-spec resolution, and score naming. It does not alter the wrapper-template body contract, the single-word sanitizer, or the Phase 6 `DUP1-DUP7` review logic.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Render-layer only** | Fixes the visible save defects without reopening shipped Phase 6 ownership | Requires careful helper-level boundaries | 10/10 |
| Reopen the wrapper-template body | One place to change many surfaces | Violates the explicit packet scope and 003/006 ownership | 2/10 |
| Rework collector-to-contract data flow broadly | Might simplify future work | Creates a new subsystem-sized packet and blows scope | 1/10 |

**Why this one**: It matches the operator-approved boundary and keeps the fix auditable.

### Consequences

**What improves**:
- The save surface becomes truthful without reopening shipped packet ownership.
- Tests can map one-to-one to the requested lanes.

**What it costs**:
- Some helper logic may need careful fallback handling rather than broad rewrites.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A root cause sits just outside the allowed helper boundary | H | Report the real location and fix the nearest permitted render owner only if safe |
| A helper fix accidentally reopens Phase 6 behavior | H | Keep the existing regression guards green |
<!-- /ANCHOR:adr-001 -->

---

### ADR-002: Fix all nine render bugs in one packet

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-09 |
| **Deciders** | Current packet implementation pass |

---

### Context

All nine defects corrupt the same saved compact-wrapper surface. Splitting them into separate follow-ons would leave the operator with half-correct memories: for example, canonical sources could still be empty while title, file counts, or score names remained wrong. [SOURCE: ../../005-code-graph-upgrades/memory/09-04-26_08-46__created-the-new-level-3-planning-packet-014-code.md:2-35] [SOURCE: ../../005-code-graph-upgrades/memory/09-04-26_10-30__implemented-the-014-code-graph-upgrade-runtime.md:2-39]

### Decision

**We chose**: Land the nine requested render fixes in a single packet.

**How it works**: The packet groups the work by lane A-I, but verification closes on the saved wrapper as one surface. The round-trip test is the final proof that the fixes work together.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **One packet for all nine render defects** | Produces one coherent saved wrapper surface | Slightly larger verification pass | 9/10 |
| Split each bug into its own follow-on | Small diffs | Leaves partial wrappers in the meantime and adds packet churn | 4/10 |
| Fix only P0/P1 now and ignore P2 | Faster | Leaves lineage and score confusion unresolved in the same save surface | 6/10 |

**Why this one**: The same packet output is broken in nine ways, so one closeout packet is the cleanest truth surface.

---

### ADR-003: Verify with focused lane tests plus one end-to-end round-trip

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-09 |
| **Deciders** | Current packet implementation pass |

---

### Context

Some bugs are helper-local, but the user explicitly wants proof through a real memory-save round-trip. A lane-only test set would miss integration failures in template binding, metadata rendering, or score naming. A round-trip-only test would make root-cause isolation harder when one lane regresses. [SOURCE: spec.md:74-87] [SOURCE: plan.md:103-108]

### Decision

**We chose**: Add one focused test per lane plus one end-to-end round-trip test.

**How it works**: The per-lane tests isolate the exact helper behavior for A-I. The round-trip test creates a throwaway packet, invokes `generate-context.js`, reads the saved memory, and asserts every wrapper-contract requirement together.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Lane tests plus round-trip** | Best balance of isolation and integration proof | More test files | 10/10 |
| Round-trip only | Realistic | Harder to debug and attribute failures | 5/10 |
| Lane tests only | Fast isolation | Misses render-binding and CLI orchestration integration | 4/10 |

**Why this one**: It gives both confidence and debuggability without widening into a new harness subsystem.
