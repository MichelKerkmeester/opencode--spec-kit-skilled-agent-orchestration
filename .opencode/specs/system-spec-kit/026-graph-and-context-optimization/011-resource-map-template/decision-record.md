---
title: "Decision Record: Resource Map Template [system-spec-kit/026-graph-and-context-optimization/011-resource-map-template/decision-record]"
description: "Architectural decisions for the resource-map-template packet: local-owner artifact placement, template optionality, and shared extractor design."
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
trigger_phrases:
  - "011-resource-map-template decision record"
  - "resource map template ADR"
  - "resource map template architectural decisions"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-resource-map-template"
    last_updated_at: "2026-04-24T00:00:00Z"
    last_updated_by: "claude-sonnet-4-6"
    recent_action: "Created packet-root decision-record.md with three ADRs"
    next_safe_action: "Run validate.sh --strict on packet root"
    blockers: []
    key_files:
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-resource-map-template/decision-record.md"
    session_dedup:
      fingerprint: "sha256:011-resource-map-template-root-decision-record"
      session_id: "011-resource-map-template-root-scaffold"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Decision Record: Resource Map Template

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Local-Owner vs. Parent-Root Artifact Placement

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-24 |
| **Deciders** | claude-sonnet-4-6, system-spec-kit team |

---

<!-- ANCHOR:adr-001-context -->
### Context

A prior change in `006-integrity-parity-closure` introduced centralized parent-root placement for deep-loop artifacts, so child-phase research and review output landed under the ancestor root rather than beside the owning spec. Reviewers had to traverse ancestor directories to find loop history for a child phase.

### Constraints

- Child and sub-phase packets each have their own `spec.md`; history must be co-located for efficient navigation.
- The path resolver (`review-research-paths.cjs`) is shared across all deep-loop invocations.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Restore local-owner placement — root specs keep root-local `research/` and `review/`; child phases own their own local packet folders.

**How it works**: `review-research-paths.cjs` was rolled back to derive the artifact directory from the `specFolder` stored in the packet config, not from the parent path. A two-script migration (`migrate-deep-loop-local-owner.cjs` and `migrate-deep-loop-legacy-owner-map.cjs`) moved every misplaced child packet to the correct owner folder. All four YAML workflows and their docs were updated to match the restored contract.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Local-owner placement (chosen)** | History beside owning spec; no ancestor traversal; mirrors git blame semantics | Required repo-wide migration; Phase 003 blocked on completion | 9/10 |
| Keep parent-root placement | No migration needed | Breaks local ownership; reviewer must traverse ancestors; fundamentally wrong model | 3/10 |
| Configurable per-packet | Maximum flexibility | Too complex; two code paths forever; no clear default | 5/10 |

**Why this one**: Local-owner placement is the correct mental model — a deep-loop run on a child phase belongs to that child phase, not its parent.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Reviewers find all loop artifacts beside the target spec without ancestor traversal.
- Parent-root `research/` and `review/` folders are no longer polluted by child-phase runs.

**What it costs**:
- Repo-wide migration required (executed and complete). Mitigation: idempotent migration scripts with conflict detection.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Migration accidentally moves root-owned packets | H | Derive ownership from `specFolder` in config before any move |
| Phase 003 emits to wrong path if Phase 001 incomplete | H | Hard dependency gate: Phase 003 blocked until Phase 001 confirmed complete |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Centralized placement was actively breaking reviewer workflow and scattering child-phase history |
| 2 | **Beyond Local Maxima?** | PASS | Three options evaluated; configurable approach rejected as over-engineered |
| 3 | **Sufficient?** | PASS | Single resolver rollback + migration handles all cases; no ongoing complexity added |
| 4 | **Fits Goal?** | PASS | Direct enabler for Phase 003 local-owner emission |
| 5 | **Open Horizons?** | PASS | Local-owner model is extensible to any depth of nesting without logic changes |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `.opencode/skill/system-spec-kit/shared/review-research-paths.cjs` — rolled back to local-owner resolution
- `scripts/migrate-deep-loop-local-owner.cjs` and `scripts/migrate-deep-loop-legacy-owner-map.cjs` — one-shot migration scripts

**How to roll back**: Revert `review-research-paths.cjs` to the parent-root version (git revert the Phase 001 commit); re-run migration in reverse to restore centralized placement; revert YAML changes in all four command YAMLs.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
### ADR-002: Resource Map Template is Optional at All Spec Levels

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-24 |
| **Deciders** | claude-sonnet-4-6, system-spec-kit team |

---

<!-- ANCHOR:adr-002-context -->
### Context

We needed to decide whether resource-map.md should be required (like spec.md or plan.md) or optional (like handover.md and debug-delegation.md). Making it required would add friction to simple, low-complexity packets that don't benefit from a path catalog.

### Constraints

- `validate.sh --strict` gates completion; adding a required file impacts all existing spec folders not yet migrated.
- The resource-map template serves complex and deep-loop packets most; its value diminishes for Level 1 packets.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Keep resource-map.md optional at all levels — it is a cross-cutting template alongside handover.md and debug-delegation.md, not a required Level file.

**How it works**: validate.sh --strict does not block on the absence of resource-map.md. The SPEC_DOCUMENT_FILENAMES constant in spec-doc-paths.ts includes the filename so that when the file is present it is indexed and recognized by the MCP classifier. All level READMEs mention it as optional.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Optional at all levels (chosen)** | No friction for simple packets; additive; consistent with handover.md model | Operators must remember to copy it; auto-emission only triggers in deep-loop context | 9/10 |
| Required at Level 3+ | Ensures coverage for complex packets | Backfill burden for all existing Level 3+ packets; overkill for short-lived packets | 5/10 |
| Required only when deep-loop runs | Targeted | Impossible to enforce statically via validate.sh; would require runtime check | 3/10 |

**Why this one**: Additive beats mandatory for a net-new template; convergence-time auto-emission reduces operator burden for the primary use case.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Zero migration burden on existing spec folders.
- Operators can adopt at their own pace; deep-loop users get it automatically via Phase 003.

**What it costs**:
- Operators running manual deep-loops or simple reviews must remember to copy the template. Mitigation: system-spec-kit SKILL.md and level READMEs surface it prominently.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Template goes undiscovered for manual workflows | L | All five level READMEs, system-spec-kit SKILL.md, feature catalog, and testing playbook all reference it |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Mandatory model would impose backfill burden with no proportional benefit |
| 2 | **Beyond Local Maxima?** | PASS | Three options evaluated; mandatory variants rejected |
| 3 | **Sufficient?** | PASS | Optional + auto-emission at convergence covers both manual and autonomous paths |
| 4 | **Fits Goal?** | PASS | Goal is to make path cataloging easy, not to mandate it |
| 5 | **Open Horizons?** | PASS | Can elevate to required at Level 3+ in a future packet without breaking existing flows |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `.opencode/skill/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts` — resource-map.md added to SPEC_DOCUMENT_FILENAMES
- All five level READMEs and system-spec-kit SKILL.md updated to list the template as optional

**How to roll back**: Remove resource-map.md from SPEC_DOCUMENT_FILENAMES; revert level README changes. No structural impact on existing spec folders.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
### ADR-003: Shared Extractor for Both Deep-Loop Skills

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-24 |
| **Deciders** | claude-sonnet-4-6, system-spec-kit team |

---

<!-- ANCHOR:adr-003-context -->
### Context

Both sk-deep-review and sk-deep-research needed to emit a resource-map.md at convergence. Their per-iteration delta JSON shapes differ slightly (review deltas carry P0/P1/P2 counts; research deltas carry citation counts). We needed to decide whether to duplicate the emission logic in each skill or extract it into a shared script.

### Constraints

- Both `reduce-state.cjs` scripts already had growing convergence logic; adding emission inline would increase file size and divergence risk.
- The extractor must handle both delta shapes without runtime errors if it encounters the wrong one.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: A single shared extractor at `scripts/resource-map/extract-from-evidence.cjs` that exports `emitResourceMap({ shape, deltas, packet, scope })` and handles both delta shapes via a `shape` discriminator.

**How it works**: Each reduce-state.cjs passes a shape argument ("review" or "research") when calling the extractor. The extractor normalizes the delta array into a common path-entry format, categorizes entries into the ten template categories, and fills the per-file column (findings counts for review, citation counts for research). The output is a complete resource-map.md string that the caller writes to {artifact_dir}/resource-map.md.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Shared extractor with shape discriminator (chosen)** | Single maintenance surface; consistent output format; vitest covers both shapes in one suite | Slightly more complex API than two separate functions | 9/10 |
| Duplicate inline in each reduce-state.cjs | Simplest per-file | Two diverging implementations; double the test surface; future format changes must be applied twice | 4/10 |
| Two separate extractors (one per skill) | Isolated blast radius | Identical core logic duplicated; harder to keep output format in sync | 5/10 |

**Why this one**: Two instances is the wrong line to DRY — the path-categorization and markdown-rendering logic is genuinely the same concept for both shapes.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- One code change updates emission behavior for both deep-loop skills simultaneously.
- Single vitest suite covers both delta shapes; snapshot tests catch output regressions.

**What it costs**:
- All consumers must pass the `shape` discriminator correctly. Mitigation: TypeScript-style JSDoc typedefs in the extractor document the expected shape of each input.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Extractor misclassifies paths from unknown executor | M | Normalized input shape; per-executor adapters inside each reduce-state.cjs upstream of the shared call |
| Shared script breaks both skills simultaneously | H | Vitest regression suite runs on every merge; F001–F004 findings addressed normalization gaps |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Two identical emission paths with slight shape differences is a textbook shared-extractor case |
| 2 | **Beyond Local Maxima?** | PASS | Three options evaluated; duplication and two-script variants both rejected |
| 3 | **Sufficient?** | PASS | Single script + shape discriminator is the minimal API that covers all cases |
| 4 | **Fits Goal?** | PASS | Goal is auto-emission at convergence with zero extra scan cost; shared script adds none |
| 5 | **Open Horizons?** | PASS | A third shape (e.g., `"hybrid"`) can be added without touching either reduce-state.cjs |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `.opencode/skill/system-spec-kit/scripts/resource-map/extract-from-evidence.cjs` — new shared extractor
- `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs` — convergence-time call added
- `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs` — convergence-time call added
- Vitest coverage for both delta shapes with snapshot assertions

**How to roll back**: Remove the `emitResourceMap()` call from both `reduce-state.cjs` scripts; delete `extract-from-evidence.cjs`; revert YAML workflow changes. No data migration needed.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!--
Level 3 Decision Record — Three ADRs all Accepted.
ADR-001: Local-owner placement restored (Phase 001).
ADR-002: Template optional at all levels (Phase 002).
ADR-003: Shared extractor for both deep-loop skills (Phase 003).
-->
