---
title: "Decision Record: OpenCode Graph [system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/decision-record]"
description: "Architecture decisions for packet 030: keep the runtime split intact, keep memory durability out of scope, and queue code graph auto-reindex parity as the next bounded follow-on."
trigger_phrases:
  - "packet 030 adr"
  - "opencode graph plugin decision record"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["decision-record.md"]
---
# Decision Record: OpenCode Graph Plugin Phased Execution

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/global/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Keep Packet 030 as a Runtime-and-Transport Packet

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-03 |
| **Deciders** | Packet 030 research synthesis and implementation closeout |

---

<!-- ANCHOR:adr-001-context -->
### Context

Packet 030 started as research into `opencode-lcm`, then became a phased runtime packet. By the time the OpenCode plugin, graph hardening, startup parity work, and bounded auto-reindex parity shipped, the packet needed a durable architecture story. The key risk was blurring packet 030 into a second memory-backend project instead of preserving it as a bounded runtime-and-transport delivery.

### Constraints

- Packet 030 already had completed runtime claims that had to stay unchanged in meaning.
- The broader memory-durability work had already been intentionally kept outside packet 030.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Keep packet 030 focused on shared payloads, the live OpenCode transport shell, graph-operations hardening, and cross-runtime startup parity only.

**How it works**: The parent packet describes the four shipped phases, each child phase records one phase of the delivered runtime, and the packet keeps memory durability as an explicit out-of-packet follow-on. That preserves architectural clarity and keeps the docs aligned with what was actually implemented.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Keep packet 030 bounded to runtime/transport work** | Matches shipped implementation, keeps architecture clear | Requires explicit follow-on language for memory durability | 9/10 |
| Expand packet 030 to include memory durability | Single packet for related ideas | Would overstate what shipped and blur packet boundaries | 4/10 |
| Collapse the child phases back into one packet narrative | Simpler doc tree | Loses recovery value and phase-local verification context | 5/10 |

**Why this one**: It is the only option that preserves the completed runtime evidence without overstating scope.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Packet 030 stays a trustworthy source of truth for the shipped runtime surfaces.
- Future work on memory durability can be scoped separately instead of muddying this packet.
- Code graph auto-reindex parity is now tracked as an explicit child-phase follow-on instead of getting lost in implementation notes.

**What it costs**:
- The packet must carry explicit follow-on wording. Mitigation: keep that wording in the spec, plan, ADR, and implementation summary.
- Parent packet closure becomes phased rather than one-and-done. Mitigation: keep completed phases marked complete and queue new work as new child phases.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Future sessions treat packet 030 as a memory-durability packet | M | Keep the out-of-scope statement explicit in every major doc |
| Future sessions reopen a completed phase instead of creating a new bounded follow-on | M | Record new runtime gaps as new child phases under the same parent packet |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Packet 030 already shipped as a bounded runtime packet. |
| 2 | **Beyond Local Maxima?** | PASS | Alternatives considered included collapsing or expanding the packet. |
| 3 | **Sufficient?** | PASS | The six-phase model fully explains the shipped work. |
| 4 | **Fits Goal?** | PASS | The packet goal is truthful runtime closeout, not speculative backend redesign. |
| 5 | **Open Horizons?** | PASS | It leaves room for a separate memory-durability follow-on. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Parent and child docs describe packet 030 as a six-phase runtime delivery.
- Parent and child ADRs/checklists preserve the in-packet and out-of-packet boundary.
- The Level 3 repair is grounded in the clean packet-local backup baseline rather than the broken upgrader output.
- The code graph auto-reindex parity gap is recorded as Phase 5 under the same parent packet rather than reopening a shipped child phase.
- The Copilot startup-hook wiring repair is recorded as Phase 031 under the same parent packet rather than leaving startup parity overstated.

**How to roll back**: Restore the packet-local backups or version-control baseline and reapply only the bounded packet wording.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
