---
title: "Decision Record: /memory:save Planner-First Default"
description: "ADR ledger for the planner-first /memory:save contract: the trim-targeted verdict, planner-first default output, reconsolidation opt-in, enrichment deferral, router category contract, hard-blocker preservation, and the scoped content-router.ts exception."
trigger_phrases:
  - "decision record"
  - "memory save planner first adr"
  - "planner-first save"
  - "trim-targeted verdict"
  - "content-router scoped exception"
importance_tier: "important"
contextType: "architecture"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/014-memory-save-planner-first-default"
    last_updated_at: "2026-04-15T10:00:01Z"
    last_updated_by: "cli-copilot"
    recent_action: "Rewrote ADR ledger as cohesive planner-first decision sequence"
    next_safe_action: "Packet complete"
    blockers: []
    key_files:
      - "decision-record.md"
      - "spec.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:014-planner-first-adr-2026-04-15"
      session_id: "014-planner-first-adr-2026-04-15"
      parent_session_id: "014-planner-first-seed"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All ADRs reframed under the planner-first delivery arc."
---
# Decision Record: /memory:save Planner-First Default

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Trim-Targeted Verdict — Preserve the Writer Core, Trim the Default-Path Stack

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-15 |
| **Deciders** | Relevance research synthesis |

### Context

The retirement cutover removed the legacy `[spec]/memory/*.md` write path, but it did not answer whether the remaining save-flow backend was still proportionate. The research pass had to decide whether the system should keep its full automation stack, redesign the whole writer, or trim around the proven core.

### Decision

**We chose**: Keep the canonical atomic writer, routed record identity, content-router core, and thin continuity validation, then trim or defer the save-time work that no longer earns default-path cost.

**How it works**: The research classifies the remaining subsystems into load-bearing, partial-value, and over-engineered. Implementation then ships the trim-targeted path instead of rebuilding the writer from scratch.

### Consequences

**Pros**
- Preserved the proven mutation core.
- Created a narrow and testable implementation target.

**Cons**
- Required precise classification of what was truly core versus optional. Mitigation: research answered Q1 through Q10 explicitly.

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

### ADR-002: Planner-First Output Contract for `/memory:save`

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-15 |
| **Deciders** | Implementation lead |

### Context

Research showed that the default save path already had enough information to tell the AI what canonical doc to edit, what legality checks applied, and what follow-up actions remained. The question was whether the system should keep mutating by default or return a plan first.

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

### ADR-003: Keep Reconsolidation-on-Save Behind Explicit Opt-In Behavior

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-15 |
| **Deciders** | Implementation lead |

### Context

Reconsolidation depended on flags, embeddings, and checkpoints, yet it was not a write-core correctness requirement. Research classified it as over-engineered for the default save path.

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

### ADR-004: Defer Post-Insert Enrichment into Follow-Up or Standalone Execution

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-15 |
| **Deciders** | Implementation lead |

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

### ADR-005: Keep the Eight-Category Router Contract While Trimming Classifier Scope

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-15 |
| **Deciders** | Implementation lead |

### Context

Research judged the eight-category contract useful, but it judged the wider classifier stack too large for the simplified save problem. The implementation had to keep target authority while reducing default-path routing complexity.

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

### ADR-006: Keep Hard Legality Checks While Retiring Quality-Loop Auto-Fix from the Default Path

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-15 |
| **Deciders** | Implementation lead |

### Context

The save path mixed hard legality checks with score-heavy or auto-fix behavior. Research concluded that only the first part was required to protect canonical docs.

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

### ADR-007: Record the Scoped `content-router.ts` Preservation Exception

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-15 |
| **Deciders** | Remediation pass |

### Context

Implementation initially claimed the four load-bearing files stayed unchanged, but deep review showed that `content-router.ts` now contained a real control-flow guard for Tier 3 default-disable and manual-review return behavior.

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
<!-- /ANCHOR:adr-001 -->
