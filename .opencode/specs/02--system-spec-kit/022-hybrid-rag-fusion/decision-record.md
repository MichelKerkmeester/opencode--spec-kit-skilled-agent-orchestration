---
title: "Decision Record: 022-hybrid-rag-fusion"
description: "Root packet ADRs for 022 coordination and navigation normalization."
trigger_phrases:
  - "022 root adr"
importance_tier: "critical"
contextType: "implementation"
---
# Decision Record: 022-hybrid-rag-fusion

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Root Packet Uses Current Tree Truth, Not Historical Synthesis

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-21 |
| **Deciders** | Root packet maintainer |

---

<!-- ANCHOR:adr-001-context -->
### Context

The root packet had accumulated large volumes of historical synthesis prose. That prose no longer matched the current tree and obscured the few facts that actually matter at the root level: the live phase counts, direct child statuses, and the boundary between current truth and unfinished subtree cleanup.

### Constraints

- Root packet facts must stay aligned with the on-disk packet tree.
- This pass cannot widen into full subtree normalization.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: replace the root packet with a concise coordination document that records only current tree truths and root-facing navigation.

**How it works**: the root `spec.md` now acts as a coordination layer. Detailed implementation history remains in child packets rather than being duplicated in the root.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Concise coordination packet** | Clear root truth, smaller maintenance surface | Loses some historical synthesis prose | 9/10 |
| Preserve historical synthesis | Rich context in one file | Keeps stale counts and status drift alive | 4/10 |

**Why this one**: the root packet needs to be trustworthy first. Child packets already hold the detailed history.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Root facts are easier to verify.
- Future packet-family normalization work has a clean coordination anchor.

**What it costs**:
- Historical synthesis detail is no longer centralized at the root. Mitigation: keep that detail in child packets.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Readers want the old synthesis detail at the root | Medium | Point them to the relevant child packet |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Root facts had drifted |
| 2 | **Beyond Local Maxima?** | PASS | Considered preserving the old prose |
| 3 | **Sufficient?** | PASS | Root-only rewrite fits the narrowed scope |
| 4 | **Fits Goal?** | PASS | Directly supports packet navigation and truthfulness |
| 5 | **Open Horizons?** | PASS | Leaves subtree normalization for later |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Root packet docs become concise and current-state focused.
- Direct child packets get normalized root-facing navigation rows.

**How to roll back**: restore the prior root docs from git and reapply only the verified count corrections.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
