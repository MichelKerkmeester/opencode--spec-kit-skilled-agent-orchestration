---
title: "Decision Record: Scripts vs mcp_server Architecture Refinement [template:level_3/decision-record.md]"
description: "Architecture decisions for boundary contract, compatibility strategy, and dependency consolidation in Phase 8."
SPECKIT_TEMPLATE_SOURCE: "decision-record | v2.2"
trigger_phrases:
  - "decision record"
  - "architecture adr"
  - "boundary contract"
importance_tier: "critical"
contextType: "architecture"
---
# Decision Record: Scripts vs mcp_server Architecture Refinement

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

## ADR-001: API-First Boundary Contract for Cross-Area Consumption
<!-- ANCHOR:adr-001 -->

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-04 |
| **Deciders** | System-spec-kit maintainers |

### Context

Evidence shows scripts consumers currently import runtime internals (`@spec-kit/mcp-server/lib/*`) in multiple files, which weakens encapsulation and increases change coupling.

### Constraints

- Existing workflows depend on current imports and cannot all switch at once.
- Runtime team needs freedom to refactor internal `lib/*` without broad consumer breakage.

### Decision

**We chose**: External consumers in `scripts/` should use `mcp_server/api/*` as the default supported boundary.

**How it works**: Internal runtime modules remain private unless promoted through `api/*` with documentation.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **API-first boundary (Chosen)** | Clear contract, lower coupling | Requires migration effort | 9/10 |
| Keep direct internal imports | No short-term migration cost | Ongoing breakage risk and hidden coupling | 3/10 |
| Duplicate wrappers everywhere | Local flexibility | High drift and maintenance cost | 4/10 |

**Why this one**: It solves long-term maintainability risk while allowing staged migration.

### Consequences

**What improves**:
- Boundary clarity and discoverability.
- Safer runtime refactors.

**What it costs**:
- Migration and enforcement effort. Mitigation: allowlist with expiry criteria.

### Implementation

- Publish boundary contract and API README.
- Add check preventing new `scripts -> lib/*` imports without allowlisted exception.
<!-- /ANCHOR:adr-001 -->

<!-- ANCHOR:adr-002 -->
## ADR-002: Keep Compatibility Wrappers Transitional, Not Canonical

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-04 |
| **Deciders** | System-spec-kit maintainers |

### Context

`mcp_server/scripts/reindex-embeddings.ts` invokes `../../scripts/dist/memory/reindex-embeddings.js`, creating a practical compatibility back-edge. This is useful for continuity but can confuse ownership if treated as canonical.

### Constraints

- Operational users still rely on wrapper entry points.
- Removing wrapper paths immediately may break workflows.

### Decision

**We chose**: Preserve wrappers as transitional compatibility surfaces while moving canonical runbook ownership to root scripts docs.

**How it works**: `scripts/memory/README.md` becomes canonical runbook source, while `mcp_server/scripts/README.md` and `mcp_server/database/README.md` point to it.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Transitional wrappers (Chosen)** | Safe migration, operational continuity | Temporary dual-path complexity | 8/10 |
| Remove wrappers now | Pure architecture boundary | High operational break risk | 5/10 |
| Keep wrappers indefinitely | Low immediate effort | Permanent ownership ambiguity | 2/10 |

**Why this one**: It balances architecture cleanup with operational safety.

### Consequences

**What improves**:
- Reduced documentation drift with one canonical runbook.
- Cleaner ownership model over time.

**What it costs**:
- Short-term documentation maintenance. Mitigation: explicit deprecation and removal criteria.

### Implementation

- Reframe wrapper README scope to compatibility-only.
- Add canonical pointer links in runtime-side docs.
<!-- /ANCHOR:adr-002 -->

<!-- ANCHOR:adr-003 -->
## ADR-003: Consolidate Duplicate Helper Logic Into Shared Modules

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-04 |
| **Deciders** | System-spec-kit maintainers |

### Context

Audit found duplicated concerns in token estimation and quality extraction logic across scripts and runtime modules. Duplicate implementations increase drift and inconsistent behavior risk.

### Constraints

- Existing behavior must remain stable while consolidating.
- Shared modules need clear ownership and compatibility guarantees.

### Decision

**We chose**: Consolidate duplicate helper concerns into shared modules and migrate both sides to consume them.

**How it works**: Add shared token-estimate and quality-extractor utilities, then phase out local copies in scripts and runtime parser/indexer paths.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Shared helper consolidation (Chosen)** | Consistent logic, lower drift | Migration and parity test effort | 9/10 |
| Keep duplicate implementations | Minimal immediate change | Continued divergence risk | 4/10 |
| Runtime-only ownership adapters | Central runtime control | Awkward dependency for scripts layer | 6/10 |

**Why this one**: It delivers consistency and reduces long-term maintenance cost.

### Consequences

**What improves**:
- One source of truth for shared helper concerns.
- Lower chance of behavior divergence across flows.

**What it costs**:
- Refactor effort and test updates. Mitigation: parity tests and staged rollout.

### Implementation

- Create shared helper modules with stable exports.
- Migrate scripts and runtime call sites in small validated increments.
<!-- /ANCHOR:adr-003 -->
