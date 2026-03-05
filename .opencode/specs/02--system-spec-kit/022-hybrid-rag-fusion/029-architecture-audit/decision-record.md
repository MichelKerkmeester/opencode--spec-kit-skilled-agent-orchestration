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

### Five Checks Evaluation

1. **Necessary now?** Yes — scripts already import `lib/*` internals in 4+ files, creating active coupling risk.
2. **Alternatives (≥2)?** Yes — 3 alternatives evaluated in table above.
3. **Simplest sufficient?** Yes — policy + allowlist is lighter than rewriting all imports immediately.
4. **On critical path?** Yes — boundary clarity is prerequisite for Phase 2 structural cleanup and Phase 3 enforcement.
5. **No tech debt?** Controlled — allowlist creates temporary tech debt with explicit owner and expiry criteria.

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

### Five Checks Evaluation

1. **Necessary now?** Yes — reindex runbook is split across 3 locations, causing active documentation drift.
2. **Alternatives (≥2)?** Yes — 3 alternatives evaluated in table above.
3. **Simplest sufficient?** Yes — pointer docs + canonical location is minimal change with maximum clarity.
4. **On critical path?** Partially — not blocking code changes, but blocking accurate contributor onboarding.
5. **No tech debt?** Yes — transitional wrappers have explicit deprecation criteria; no hidden cost.

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

Audit found duplicated concerns in **token estimation** (`estimateTokenCount` / `estimateTokens` — `Math.ceil(text.length/4)` heuristic in tree-thinning.ts and token-metrics.ts) and **quality extraction** (`extractQualityScore` / `extractQualityFlags` in memory-indexer.ts and memory-parser.ts) logic across scripts and runtime modules. Duplicate implementations increase drift and inconsistent behavior risk.

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

### Five Checks Evaluation

1. **Necessary now?** Yes — both token estimation (`estimateTokenCount`/`estimateTokens`, now consolidated in `shared/utils/token-estimate.ts`) and quality extraction (`extractQualityScore`/`extractQualityFlags`) had duplicate implementations, creating active drift risk.
2. **Alternatives (≥2)?** Yes — 3 alternatives evaluated in table above.
3. **Simplest sufficient?** Yes — shared module with stable exports; existing call sites change only import paths.
4. **On critical path?** Yes — prerequisite for consistent behavior across scripts and runtime parser paths.
5. **No tech debt?** Controlled — parity tests required to prevent regression during migration.

### Implementation

- Create shared helper modules with stable exports.
- Migrate scripts and runtime call sites in small validated increments.

### Review Addendum (2026-03-04)

Triple ultra-think review (Claude Opus) noted that ADR-003 Five Checks item 1 only names `extractQualityScore`/`extractQualityFlags` but omits `estimateTokenCount` which was also consolidated into `shared/utils/token-estimate.ts`. The context section above has been updated to reflect both concerns. See T036 for Five Checks update.
<!-- /ANCHOR:adr-003 -->

<!-- ANCHOR:adr-004 -->
## ADR-004: Enforcement Script Hardening Based on Cross-AI Review

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-04 |
| **Deciders** | System-spec-kit maintainers |
| **Source** | Triple ultra-think review (Codex 5.3 adversarial analysis, confidence 93/100) |
| **Note** | Accepted per cross-AI review verification (2026-03-05) |

### Context

The triple ultra-think cross-AI review identified 4 CRITICAL evasion vectors in the import-policy enforcement script (`check-no-mcp-lib-imports.ts`):
1. Dynamic `import()` expressions completely undetected
2. Relative path variants: only `../../mcp_server/lib/` matched; other depths bypass
3. Multi-line imports/requires bypass line-by-line scanning
4. Boundary narrower than architecture intent: only `lib/*` blocked, `core/*` paths pass through

A subsequent 10-agent cross-AI review (2026-03-05, 5 Codex + 5 Gemini) identified 3 additional vectors documented in 030/decision-record.md ADR-001:
5. Template literal imports bypass regex extraction
6. Same-line block comments (`/* ... */`) hide import tokens from line scanners
7. Transitive barrel re-export checks limited to 1 hop (no deep graph traversal)

Additionally, allowlist governance gaps were identified: no TTL/expiry enforcement (now addressed by `check-allowlist-expiry.ts`), broad wildcard exceptions, and missing approval metadata.

### Constraints

- Enforcement script must remain fast (<2s for full scan) per NFR-P01.
- Changes must not break existing CI pipeline integration.
- Must handle allowlist backward compatibility (existing entries without new governance fields).

### Decision

**We propose**: Incremental hardening in 3 tiers:

1. **Immediate (P0)**: Expand `PROHIBITED_PATTERNS` to cover `core/*`, integrate `check-api-boundary.sh` into pipeline, fix documentation drift.
2. **Short-term (P1)**: Add dynamic import detection, path variant coverage, and allowlist governance schema.
3. **Long-term (P2)**: Evaluate AST-based parsing upgrade for comprehensive detection including multi-line, re-exports, and computed paths.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Incremental hardening (Proposed)** | Low risk per increment, immediate P0 wins | Full coverage delayed | 8/10 |
| Immediate AST rewrite | Complete coverage now | High effort, risk of breaking pipeline, blocks P0 fixes | 5/10 |
| Accept current limitations | Zero effort | Known evasion vectors persist | 2/10 |

**Why this one**: Delivers immediate P0 safety while building toward comprehensive coverage.

### Consequences

**What improves**:
- Enforcement coverage expands from ~60% to ~85% of import evasion vectors (P0+P1).
- Allowlist governance prevents unbounded exception growth.
- Documentation drift eliminated.

**What it costs**:
- ~4-6h additional implementation effort across P0/P1/P2.
- P2 AST upgrade requires dependency evaluation.

### Five Checks Evaluation

1. **Necessary now?** Yes — 7 evasion vectors confirmed by adversarial analysis (4 original + 3 from cross-AI review).
2. **Alternatives (≥2)?** Yes — 3 alternatives evaluated above.
3. **Simplest sufficient?** Yes — incremental approach delivers safety without over-engineering.
4. **On critical path?** P0 items are critical; P1/P2 are important but not blocking.
5. **No tech debt?** P2 AST upgrade is deferred tech debt. Current regex has known evasion vectors documented in 030/decision-record.md ADR-001.

### Implementation

- Phase 4 tasks T021-T038 in `tasks.md`.
- Verification via checklist items CHK-200 through CHK-225 in `checklist.md`.
<!-- /ANCHOR:adr-004 -->

<!-- ANCHOR:adr-005 -->
## ADR-005: Handler-Utils Structural Consolidation

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted (retroactive) |
| **Date** | 2026-03-05 |
| **Deciders** | System-spec-kit maintainers |

### Context

During Phase 2 structural cleanup, handler helper logic was consolidated from scattered handler files into a single module:

- `escapeLikePattern` was extracted from `memory-save.ts` (T013a).
- `detectSpecLevelFromParsed` was extracted from `causal-links-processor.ts` (T013b).
- Consumer imports were migrated to `handler-utils.ts` (T014), removing the documented handler cycle (CHK-013).

The implementation happened during audit remediation, but the architectural rationale was not fully documented in ADR form.

### Constraints

- Existing runtime behavior had to remain stable while moving helper ownership.
- Consolidation had to break handler cycle edges, not create new dependency direction violations.
- Handler-domain helpers needed a local canonical module; general-purpose utilities should remain in `shared/`.
- Module growth needed guardrails so `handler-utils.ts` would not become an unbounded catch-all.

### Decision

**We chose**: Accept `mcp_server/handlers/handler-utils.ts` as the canonical consolidation module for shared handler-domain helper logic.

**How it works**: Handler helpers that are shared across multiple handlers are extracted into `handler-utils.ts`, and handler consumers import from that module. Growth is constrained by the documented add-vs-split policy (T033) to keep scope bounded.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Consolidate into `handler-utils.ts` (Chosen)** | Breaks handler cycles, clear local ownership, low migration friction | Requires explicit growth governance | 9/10 |
| Keep helpers in source handlers with cross-imports | Minimal code movement | Preserves coupling and cycle risk, weaker ownership clarity | 4/10 |
| Move extracted helpers directly to `shared/` | Centralized utility location | Over-generalizes handler-specific concerns, higher boundary churn | 6/10 |
| Duplicate helper logic per handler | Maximum local autonomy | Drift, inconsistent behavior, repeated fixes | 2/10 |

**Why this one**: It solves the active handler coupling problem with the smallest structural change while preserving a clear path to split modules later if growth exceeds policy limits.

### Consequences

**What improves**:
- Handler dependency flow is cleaner and cycle-free for the extracted concerns.
- Shared handler logic has a single canonical import path.
- Follow-up fixes (for example `escapeLikePattern` hardening) land in one place.

**What it costs**:
- Adds governance overhead to prevent utility-module sprawl.
- Requires import-path migration and ongoing discipline to keep non-handler utilities in `shared/`.

### Five Checks Evaluation

1. **Necessary now?** Yes — handler cycle risk and god-object pressure in `memory-save.ts` required immediate extraction and consolidation.
2. **Alternatives (≥2)?** Yes — 4 alternatives evaluated in table above.
3. **Simplest sufficient?** Yes — a single handler-scoped utility module is simpler than broader shared-layer restructuring.
4. **On critical path?** Yes — this consolidation was prerequisite to confirming the handler cycle removal objective (CHK-013).
5. **No tech debt?** Controlled — catch-all risk is mitigated by the explicit growth policy and split criteria documented in T033/CHK-223.

### Implementation

- Implemented via Phase 2 tasks `T013a`, `T013b`, `T013c`, and `T014` (extraction + import migration + cycle verification).
- Governance guardrail added via `T033` (documented `handler-utils.ts` growth policy).
- Reinforced by `T039` and checklist verification `CHK-203` for `escapeLikePattern` correctness in the consolidated module.
- Verified through checklist items `CHK-013` (cycle removed) and `CHK-223` (growth policy documented).
<!-- /ANCHOR:adr-005 -->
