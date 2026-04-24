---
title: "...stem-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/003-system-hardening/decision-record]"
description: "ADRs for 019-system-hardening umbrella packet: research-first ordering and cluster-per-child layout."
trigger_phrases:
  - "019 decision record"
  - "system hardening adr"
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/003-system-hardening"
    last_updated_at: "2026-04-18T17:15:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Decision record scaffolded"
    next_safe_action: "Charter approval"
    key_files: ["decision-record.md"]
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
---
# Decision Record: System Hardening

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Research-first ordering — no implementation child before 001 convergence

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-18 |
| **Deciders** | 019 charter author; user approval pending |

---

<!-- ANCHOR:adr-001-context -->
### Context

`../scratch/deep-review-research-suggestions.md` lists six Tier 1 candidates that span security-sensitive surfaces (Q4 NFKC canonical-equivalence attacks, canonical-save invariants) and audit-sensitive surfaces (015 243-finding delta, Gate 3 + skill-advisor classifier accuracy). Several candidates could surface data-integrity findings that invalidate speculative implementation scope. Without research grounding, implementation children risk duplicating fixes or missing root causes.

### Constraints

- Gate 4 HARD-block requires iterative investigation at scale to run through the canonical `/spec_kit:deep-research` and `/spec_kit:deep-review` command surfaces.
- Umbrella packet must enforce ordering without relying on manual user gatekeeping.
- Research effort (~8-11 days) is acceptable; speculative implementation rework would cost more.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: structural research-first ordering.

**How it works**: The umbrella packet defines exactly one child at scaffold time (`001-initial-research`). No `002+` sibling may be created until `implementation-summary.md §Sub-phase summaries` converges with a findings registry. The charter records this as REQ-002 and reinforces it via AI execution rule `AI-SCOPE-002` in `plan.md`.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Research-first (one child at scaffold)** | Grounds every implementation in evidence; prevents duplicate or phantom fixes | Delays implementation ship by 8-11 days | 9/10 |
| Parallel research + speculative implementation | Shortens wall-clock time if scope is correct | Risks duplicating fixes; risks implementing wrong scope for RR-1/RR-2/SSK-RR-2 findings | 4/10 |
| Research-first but with reserved implementation children pre-scaffolded | Signals scope intent | Scope intent may not match what research produces; creates rework | 5/10 |

**Why this one**: The risk-adjusted cost of parallel speculation exceeds the wall-clock cost of research-first. Especially true for RR-1 and SSK-RR-2, where attacker-controlled inputs or pipeline invariants could invalidate speculative fixes.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Every implementation child carries explicit finding citations — easy to audit and defer.
- Speculative scope is eliminated at the charter level.
- If research surfaces a P0 finding, the umbrella packet can interrupt the wave without discarding speculative work-in-progress.

**What it costs**:
- Implementation ship is gated on research convergence (~8-11 days wall clock).
- User must tolerate a visible "nothing shipping yet" period during the research wave.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Research fails to converge for one or more items | M | Cap iteration budget per item; defer with documented reason |
| User impatience drives early speculation | L | ADR-001 + REQ-002 + AI-SCOPE-002 make the constraint explicit at charter level |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Speculative implementation risks duplicating fixes when research invalidates scope |
| 2 | **Beyond Local Maxima?** | PASS | Parallel-speculation alternative considered and rejected |
| 3 | **Sufficient?** | PASS | One child at scaffold + structural gate prevents premature implementation |
| 4 | **Fits Goal?** | PASS | Goal is grounded hardening, not speed-at-all-costs |
| 5 | **Open Horizons?** | PASS | Cluster-per-child layout (ADR-002) preserves future flexibility |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Umbrella packet scaffolds only `001-initial-research/` at creation time.
- AI execution rule `AI-SCOPE-002` blocks `019/002+` creation until convergence.

**How to roll back**: Relax REQ-002 and `AI-SCOPE-002` if the user explicitly approves parallel speculation. Document the override in a new ADR.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

### ADR-002: Cluster-per-child implementation layout

#### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-18 |
| **Deciders** | 019 charter author; user approval pending |

---

### Context

Six Tier 1 research items may produce anywhere from ~10 to 50+ distinct findings. Mapping 1:1 to implementation children would fragment the packet tree unnecessarily (some findings share files, tests, or invariants). Mapping all to one giant child would block partial ships and mix unrelated fixes.

### Constraints

- Each implementation child must pass strict validation independently.
- The umbrella packet must retain the ability to ship remediation incrementally.
- Clusters must be derivable from the findings registry, not predeclared.

---

### Decision

**We chose**: one implementation child per remediation cluster, where a cluster is a group of findings sharing files, invariants, tests, or wavelike ship dependencies. Clusters are defined by the research wave's findings registry, not by the umbrella packet's initial scaffold.

**How it works**: The research convergence step produces the findings registry. A subsequent planning step (T033) proposes the cluster layout. Each approved cluster becomes one sibling child (`019/002-<cluster-slug>`, `019/003-<cluster-slug>`, ...).

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Cluster-per-child** | Aligns with how fixes actually ship; flexible child count | Requires research to converge before child layout is known | 9/10 |
| One child per Tier 1 candidate (fixed 6 children) | Predictable structure | Some candidates may produce zero findings; fragments shared-file fixes | 5/10 |
| One child per individual finding | Maximum granularity | Over-fragmented; tests and files span findings | 3/10 |

**Why this one**: Matches the shipping reality — fixes cluster by file and test, not by research question.

---

### Consequences

**What improves**:
- Child packet count is flexible; matches actual remediation surface.
- Each child is meaningfully scoped and can ship independently.

**What it costs**:
- Child layout cannot be predeclared; must wait for research.
- Findings registry must include explicit cluster boundaries.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Cluster boundary disputes during planning | M | T032 registry review reconciles scope before children created |
| Cross-cluster coupling discovered mid-implementation | M | Umbrella packet retains cross-cluster coordination authority; explicit handoff rules in child specs |

---

### Implementation

**What changes**:
- Research wave produces a findings registry with cluster boundaries.
- T033 planning step proposes the cluster-to-child mapping.
- Each child packet's `spec.md §2 Problem Statement` cites its originating cluster.

**How to roll back**: If cluster-per-child proves too flexible in practice, collapse into a fixed one-child-per-candidate layout in a follow-on packet. Not an immediate concern.
