---
title: "Decision Record: Save-Flow Unified Journey"
description: "Aggregate ADR surface for the save-flow journey across packets 013, 014, and 015, including the final merge-packet rationale."
trigger_phrases:
  - "decision record"
  - "save-flow unified journey"
  - "adr"
  - "planner-first save"
  - "trim-targeted verdict"
importance_tier: "important"
contextType: "architecture"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-save-flow-unified-journey"
    last_updated_at: "2026-04-15T10:00:01Z"
    last_updated_by: "cli-copilot"
    recent_action: "Aggregated packet 014 and 015 ADRs and added a merge-packet ADR"
    next_safe_action: "Packet complete"
    blockers: []
    key_files:
      - "decision-record.md"
      - "spec.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "016-save-flow-unified-journey-merge"
      parent_session_id: "015-save-flow-planner-first-trim-seed"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Packet 016 preserves the source ADR story and adds a merge-packet ADR for the consolidated packet purpose."
---
# Decision Record: Save-Flow Unified Journey

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Packet 014 trim-targeted verdict becomes the decision bridge into implementation

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-15 |
| **Deciders** | Packet 014 research synthesis |
| **Source Packet** | `014-save-flow-backend-relevance-review` |

### Context

Packet 013 retired the legacy memory-file write path in the release, but it did not answer whether the remaining save-flow backend was still proportionate. Packet 014 had to decide whether the system should keep its full automation stack, redesign the whole writer, or trim around the proven core.

### Decision

**We chose**: Keep the canonical atomic writer, routed record identity, content-router core, and thin continuity validation, then trim or defer the save-time work that no longer earns default-path cost.

**How it works**: The research classifies the remaining subsystems into load-bearing, partial-value, and over-engineered. Packet 015 then implements the trim-targeted path instead of rebuilding the writer from scratch.

### Consequences

**Pros**
- Preserved the proven mutation core.
- Created a narrow and testable implementation target for packet 015.

**Cons**
- Required precise classification of what was truly core versus optional. Mitigation: packet 014 answered Q1 through Q10 explicitly.

**Neutral**
- The legacy CLI wrapper kept partial value but stopped being treated as the write engine.

### Alternatives

| Option | Why Not Chosen |
|--------|----------------|
| Keep the whole stack untouched | Research showed the default path was heavier than the remaining contract |
| Replace the writer completely | Rebuilt safety logic that already worked |

### Related ADRs

- ADR-002
- ADR-003
- ADR-004
- ADR-005
- ADR-006

---

### ADR-002: Planner-first output contract for `/memory:save`

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-15 |
| **Deciders** | Packet 015 implementation |
| **Source Packet** | `015-save-flow-planner-first-trim` |

### Context

Packet 014 showed that the default save path already had enough information to tell the AI what canonical doc to edit, what legality checks applied, and what follow-up actions remained. The question was whether the system should keep mutating by default or return a plan first.

### Decision

**We chose**: Make planner-first output the default `/memory:save` contract and preserve `full-auto` as explicit fallback.

**How it works**: The handler computes the same route and legality data as before, but the default path stops short of mutation and returns structured planner output instead.

### Consequences

**Pros**
- Made the default path reviewable and non-mutating.
- Removed default-path dependence on multiple optional subsystems.

**Cons**
- Required schema stability between handler, CLI, and docs. Mitigation: shared types plus focused tests.

**Neutral**
- The full writer remained in the codebase for explicit fallback.

### Alternatives

| Option | Why Not Chosen |
|--------|----------------|
| Keep full-auto as default | Preserved unnecessary hot-path cost |
| Replace the save system with a new planner service | Wider scope and safety risk |

### Related ADRs

- ADR-001
- ADR-003
- ADR-004
- ADR-005
- ADR-006

---

### ADR-003: Keep reconsolidation-on-save behind explicit opt-in behavior

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-15 |
| **Deciders** | Packet 015 implementation |
| **Source Packet** | `015-save-flow-planner-first-trim` |

### Context

Reconsolidation depended on flags, embeddings, and checkpoints, yet it was not a write-core correctness requirement. Packet 014 classified it as over-engineered for the default save path.

### Decision

**We chose**: Remove reconsolidation from the default path and keep it available only through explicit opt-in or fallback behavior.

**How it works**: Planner mode surfaces reconsolidation as follow-up capability. `full-auto` or explicit flags preserve access when operators want it.

### Consequences

**Pros**
- Reduced default-path cost.
- Preserved a niche maintenance capability.

**Cons**
- Added some operator choice and documentation complexity. Mitigation: planner follow-up guidance and env-reference alignment.

**Neutral**
- Same-path identity remained protected by the core writer and lineage logic.

### Alternatives

| Option | Why Not Chosen |
|--------|----------------|
| Keep reconsolidation on every save | Cost too high for the remaining contract |
| Delete reconsolidation entirely | Removed a capability some operators still may want |

### Related ADRs

- ADR-001
- ADR-002
- ADR-004

---

### ADR-004: Defer post-insert enrichment into follow-up or standalone execution

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-15 |
| **Deciders** | Packet 015 implementation |
| **Source Packet** | `015-save-flow-planner-first-trim` |

### Context

Post-insert enrichment already behaved like optional work. Each step was flag-guarded and wrapped so failures would not block the save, which meant the runtime already treated it as non-core behavior.

### Decision

**We chose**: Take enrichment out of the default save path and represent it as explicit follow-up or standalone work.

**How it works**: The planner surfaces enrichment opportunities, and the follow-up APIs or explicit fallback path handle the actual execution when it is wanted.

### Consequences

**Pros**
- Reduced default-path latency and complexity.
- Matched runtime behavior to the real importance of enrichment.

**Cons**
- Immediate graph richness can arrive later. Mitigation: follow-up actions stay explicit.

**Neutral**
- The write core did not change because enrichment was not its safety mechanism.

### Alternatives

| Option | Why Not Chosen |
|--------|----------------|
| Keep enrichment on every save | Preserved cost without strengthening correctness |
| Keep only one enrichment step on the default path | Hard to justify a special case |

### Related ADRs

- ADR-001
- ADR-002
- ADR-005

---

### ADR-005: Keep the eight-category router contract while trimming classifier scope

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-15 |
| **Deciders** | Packet 015 implementation |
| **Source Packet** | `015-save-flow-planner-first-trim` |

### Context

Packet 014 judged the eight-category contract useful, but it judged the wider classifier stack too large for the simplified save problem. The implementation had to keep target authority while reducing default-path routing complexity.

### Decision

**We chose**: Preserve the eight routing categories and deterministic Tier 1 or Tier 2 behavior, while removing Tier 3 from the default path and trimming Tier 2 scope.

**How it works**: Category-to-target mapping stays intact. Only classifier participation changes.

### Consequences

**Pros**
- Preserved target authority and compatibility.
- Made the default path more deterministic.

**Cons**
- Borderline cases can now require manual review more often. Mitigation: transcript validation and explicit warnings.

**Neutral**
- Route overrides and audit behavior stayed part of the router contract.

### Alternatives

| Option | Why Not Chosen |
|--------|----------------|
| Keep all classifier tiers untouched | Too heavy for the new default path |
| Replace the router with only handcrafted rules | Risked category coverage loss without proof |

### Related ADRs

- ADR-001
- ADR-002
- ADR-006

---

### ADR-006: Keep hard legality checks while retiring quality-loop auto-fix from the default path

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-15 |
| **Deciders** | Packet 015 implementation |
| **Source Packet** | `015-save-flow-planner-first-trim` |

### Context

The save path mixed hard legality checks with score-heavy or auto-fix behavior. Packet 014 concluded that only the first part was required to protect canonical docs.

### Decision

**We chose**: Keep structural and legality checks as blockers and move quality-loop auto-fix out of the default path.

**How it works**: The planner reports advisory quality issues, but malformed or unsafe saves still block.

### Consequences

**Pros**
- Preserved correctness guarantees.
- Removed surprise mutation-time rewrites from the default path.

**Cons**
- Some fixes now require explicit edits. Mitigation: planner output shows them clearly.

**Neutral**
- Opt-in quality automation can still exist later if evidence supports it.

### Alternatives

| Option | Why Not Chosen |
|--------|----------------|
| Keep auto-fix on every save | Preserved hot-path complexity the research rejected |
| Remove both blockers and auto-fix | Unsafe for canonical docs |

### Related ADRs

- ADR-001
- ADR-002
- ADR-005

---

### ADR-007: Record the scoped `content-router.ts` preservation exception

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-15 |
| **Deciders** | Packet 015 remediation pass |
| **Source Packet** | `015-save-flow-planner-first-trim` remediation |

### Context

Packet 015 initially claimed the four load-bearing files stayed unchanged, but deep review showed that `content-router.ts` now contained a real control-flow guard for Tier 3 default-disable and manual-review return behavior.

### Decision

**We chose**: Keep the guard in `content-router.ts` and document it as a scoped preservation exception instead of pretending the whole file remained unchanged.

**How it works**: The eight-category switch, Tier 1 logic, Tier 2 matching, and target selection remain the preserved contract. The documented exception is the Tier 3 default-disable and manual-review guard.

### Consequences

**Pros**
- Fixed the documentation and changelog honesty gap.
- Kept route-selection authority in one place.

**Cons**
- We lost the simpler "bit-for-bit preserved" story. Mitigation: ADR-007 and release-note updates preserve the honest story.

**Neutral**
- Other core files stayed unchanged.

### Alternatives

| Option | Why Not Chosen |
|--------|----------------|
| Move the guard outside the router | Added coordination complexity and duplicated control flow |
| Ignore the contradiction | Left packet docs and release notes inaccurate |

### Related ADRs

- ADR-005
- ADR-008

---

### ADR-008: Create a unified merge packet while leaving source packets authoritative

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-15 |
| **Deciders** | Packet 016 merge author |
| **Source Packet** | `016-save-flow-unified-journey` |

### Context

The save-flow story was spread across an audit packet, a research packet, an implementation packet, a review packet, transcript artifacts, and release notes. Future readers would need to hop across multiple packets to answer simple narrative questions.

### Decision

**We chose**: Build packet 016 as a self-contained merge packet with copied artifact snapshots and unified primary docs, while leaving packets 013, 014, and 015 in place as authoritative phase records.

**How it works**: Packet 016 copies the key evidence surfaces into packet-local folders and writes a unified set of six docs that describe the whole journey without claiming new runtime work.

### Consequences

**Pros**
- Future readers can stay in one packet.
- Source packets remain untouched and authoritative.
- The release narrative, packet narrative, and remediation narrative can stay aligned.

**Cons**
- The project now has one more packet to maintain. Mitigation: packet 016 is additive and archive-friendly.
- Copied artifacts can be mistaken for originals. Mitigation: snapshot headers point back to the source packet.

**Neutral**
- Packet 016 does not change runtime behavior or source packet ownership.

### Alternatives

| Option | Why Not Chosen |
|--------|----------------|
| Leave the story split across 013, 014, and 015 only | Future readers would keep redoing synthesis work |
| Move all source artifacts into 016 | Violated the source-packet preservation rule |
| Write only a short changelog note instead of a merge packet | Too shallow for the amount of phase history and evidence involved |

### Related ADRs

- ADR-001
- ADR-002
- ADR-007
<!-- /ANCHOR:adr-001 -->
