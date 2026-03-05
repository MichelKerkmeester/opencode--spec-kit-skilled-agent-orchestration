---
title: "Decision Record: Architecture Boundary Remediation [template:level_2/decision-record.md]"
description: "Architecture decision for regex-enforcement evasion vectors and AST upgrade timing."
SPECKIT_TEMPLATE_SOURCE: "decision-record | v2.2"
trigger_phrases:
  - "regex evasion"
  - "boundary enforcement decision"
  - "ast upgrade timeline"
importance_tier: "critical"
contextType: "architecture"
---
# Decision Record: Architecture Boundary Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

## ADR-001: Regex Evasion Vector Acceptance
<!-- ANCHOR:adr-001 -->

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-05 |
| **Deciders** | System-spec-kit maintainers |
| **Source** | Cross-AI review (spec 013, Phase 0) |

### Context

Cross-AI review (2026-03-05, 5 Codex xhigh + 5 Gemini 3.1 Pro) found five bypass vectors in regex-based import enforcement. Combined with 029 ADR-004's original 4 vectors, there are 7 known evasion vectors total:

**Vectors identified in this review (5):**
1. Template literal imports can avoid current extraction in some forms.
2. Same-line block comments (`/* ... */`) can hide import-like tokens from line scanners.
3. Transitive checks currently stop at one hop and can miss deeper relay chains.
4. `core/*` boundary violations were previously unblocked in documented threat scenarios.
5. Dynamic `import()` usage was previously undetected in documented threat scenarios.

**Additional vectors from 029 ADR-004 (2 unique):**
6. Relative path variants: only `../../mcp_server/lib/` matched; other depths bypass.
7. Multi-line imports/requires bypass line-by-line scanning.

See 012-architecture-audit/decision-record.md ADR-004 for the original analysis. Both ADRs accept the same P2 AST-upgrade timeline.

### Constraints

- P0/P1 remediation must keep checks fast and CI-friendly.
- Immediate AST migration would expand Phase 0 scope and delivery risk.
- Existing allowlist workflows must remain compatible while remediation proceeds.

### Decision

**We accept**: Short-term residual risk in regex enforcement, with an explicit P2 AST-upgrade timeline.

**How it works**:
- Keep regex enforcement active for immediate guardrails.
- Track the five vectors as accepted, temporary risk.
- Execute AST-based parsing hardening in P2 to close structural evasion gaps (comment-aware parsing, multi-line handling, and deeper transitive traversal).

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Accept risk + P2 AST timeline (Accepted)** | Maintains delivery momentum; explicit risk ledger | Temporary known bypass surface remains | 8/10 |
| Immediate AST fast-track in P0 | Better near-term detection coverage | Higher implementation scope and regression risk | 5/10 |
| Keep regex checks indefinitely | Lowest immediate effort | Known evasion vectors remain unresolved | 2/10 |

**Why this one**: It balances immediate policy enforcement with a bounded upgrade path instead of a rushed rewrite.

### Consequences

**What improves**:
- Cross-AI findings are formally captured in an ADR with explicit ownership.
- P2 AST hardening now has a documented rationale and timeline anchor.

**What it costs**:
- Temporary exposure to known regex-evasion paths until P2 implementation completes.

### Five Checks Evaluation

1. **Necessary now?** Yes — five bypass vectors are already documented by cross-AI review.
2. **Alternatives (≥2)?** Yes — immediate AST fast-track and indefinite regex were evaluated.
3. **Simplest sufficient?** Yes — risk acceptance plus timeline avoids premature high-risk rewrite.
4. **On critical path?** Yes — required evidence for CHK-051 and T020 traceability.
5. **No tech debt?** Controlled — debt is explicit, scoped, and time-bounded to P2.

### Implementation

- Add this ADR for T020 completion evidence in spec 013.
- Pair with allowlist-expiry enforcement (T021) and track AST hardening in Phase 5 P2 tasks.
<!-- /ANCHOR:adr-001 -->
