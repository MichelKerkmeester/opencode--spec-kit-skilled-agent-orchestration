---
title: "Decision Record: Codex Memory MCP [02--system-spec-kit/022-hybrid-rag-fusion/024-codex-memory-mcp-fix/decision-record]"
description: "Why packet 024 exists: we opened a focused follow-on packet for the landed Codex MCP startup fix instead of stretching the broader 020 remediation packet further."
trigger_phrases:
  - "codex spec kit memory adr"
  - "packet 024 decision record"
  - "why open new remediation packet"
importance_tier: "important"
contextType: "implementation"
---
# Decision Record: Codex Memory MCP Fix

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Open a focused Codex remediation packet instead of extending `020`

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-28 |
| **Deciders** | Michel Kerkmeester, Codex |

---

<!-- ANCHOR:adr-001-context -->
### Context

The Codex-facing `spec_kit_memory` startup failure was fixed with a narrow set of runtime and launcher changes, and this session also landed a second narrow runtime fix in `vector-index-store` so `initializeDb(':memory:')` or custom-path initialization promotes the active shared DB connection instead of letting later default operations drift back into the persistent live DB. A follow-up caveat around spec-doc indexing tests was also fixed. Those fixes lived inside the broader `020-pre-release-remediation` packet, which still intentionally holds the overall `022` program in an open, non-release-ready state.

We needed a cleaner resume surface for Codex-specific memory MCP work without rewriting the canonical broader remediation packet or pretending the whole program was done.

### Constraints

- `../020-pre-release-remediation/review/review-report.md` remains the broader remediation source of truth.
- The new packet must be honest about the difference between a landed narrow slice and broader later-wave follow-on work.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Open `024-codex-memory-mcp-fix` as a dedicated Level 3 packet under `022-hybrid-rag-fusion`.

**How it works**: This packet records the already-landed Codex startup stabilization work, the in-session DB-isolation fix, the follow-up caveat fix, and the broader unresolved runtime, docs, and release-control work as focused follow-on recommendations. `020` remains the broader packet for the open remediation verdict and the canonical review artifacts.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Open `024`** | Clean resume surface, clear scope boundary, honest about what is green | Adds another packet to maintain | 9/10 |
| Extend `020` | No new folder required | Keeps Codex slice buried inside a broader open packet and muddies status | 5/10 |
| Write only a scratch note | Fastest short-term move | Not durable, not validator-friendly, poor resume ergonomics | 3/10 |

**Why this one**: Opening `024` keeps the Codex MCP story precise. It lets future work start from an auditable packet while preserving `020` as the broader review and verdict surface.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Future sessions get a dedicated packet for Codex memory MCP work.
- The landed startup fix, DB-isolation fix, and the still-open broader follow-on work stop competing for the same status line.

**What it costs**:
- Another numbered packet needs to stay in sync with `020`. Mitigation: cross-reference `020` directly in spec, tasks, checklist, and summary.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Readers assume `024` replaces `020` | High | Repeat that `020` remains the broader remediation source of truth |
| The follow-on recommendations in `024` grow too large | Medium | Open a new numbered packet if future implementation no longer fits focused Codex remediation |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The landed Codex slice needed a durable packet instead of remaining buried inside `020` |
| 2 | **Beyond Local Maxima?** | PASS | We considered extending `020` and using scratch-only notes |
| 3 | **Sufficient?** | PASS | A focused Level 3 packet is simpler than re-scoping the canonical broader remediation packet |
| 4 | **Fits Goal?** | PASS | The goal is a clean resume surface and follow-on control, not a verdict rewrite |
| 5 | **Open Horizons?** | PASS | The packet can carry near-term follow-on recommendations and still hand off to a future numbered packet if scope expands |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Create a new Level 3 packet under `022-hybrid-rag-fusion` with packet-local docs and `description.json`.
- Map the landed Codex MCP startup remediation, DB-isolation remediation, and broader follow-on recommendations into that packet without changing the canonical `020` review position.

**How to roll back**: Revert the `024-codex-memory-mcp-fix` folder if the packet scope is wrong. Keep previously landed runtime fixes separate unless runtime evidence itself is disproved.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---
