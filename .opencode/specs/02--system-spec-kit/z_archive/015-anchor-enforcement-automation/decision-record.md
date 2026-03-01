---
title: "Decision Record: Anchor Enforcement Automation [132-anchor-enforcement-automation/decision-record]"
description: "Spec folder documentation can be created without template compliance or proper ANCHOR tags. Need enforcement mechanism to guarantee 100% compliance. Critical question: implement..."
trigger_phrases:
  - "decision"
  - "record"
  - "anchor"
  - "enforcement"
  - "automation"
  - "decision record"
  - "132"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: Anchor Enforcement Automation

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record + level3-arch + level3plus-govern | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Three-Layer Enforcement vs Single Validation Point

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-17 |
| **Deciders** | System Architect, Agent Framework Lead |
| **Impact** | High (affects all spec creation workflows) |

---

<!-- ANCHOR:adr-001-context -->
### Context

Spec folder documentation can be created without template compliance or proper ANCHOR tags. Need enforcement mechanism to guarantee 100% compliance. Critical question: implement single validation point (e.g., only at file write) or multiple independent layers?

### Constraints
- Cannot break existing legitimate workflows (false positive rate must be <1%)
- Performance overhead must be acceptable (<200ms per file validation)
- Must handle emergency scenarios (need bypass mechanism)
- Agent dispatch protocol cannot be overly rigid
- Validation logic maintainability (avoid code duplication)
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**Summary**: Implement three independent validation layers with defense-in-depth approach.

**Details**: Layer 1 (Agent Dispatch) enforces routing to @speckit exclusively via orchestrator Gate 3 HARD BLOCK. Layer 2 (Template Generation) embeds ANCHOR tags automatically during template creation. Layer 3 (Runtime Validation) runs pre-flight checks in validate.sh before file writes. All three layers operate independently — if one fails or is bypassed, the others still catch violations.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Three-Layer Defense-in-Depth** | Redundancy ensures compliance even with failures; clear errors at each layer; can disable individual layers | More code to maintain (3 implementations) | 9/10 |
| Single Validation at File Write | Simple, single code path; easy to maintain | Too late (files already generated); harder to debug; can be bypassed by manual creation | 4/10 |
| Only Agent Dispatch Enforcement | Early prevention; blocks at source | Can be bypassed by manual file creation or script execution; no fallback | 5/10 |
| Only Template Generation | Zero-effort for users; automatic compliance | Doesn't catch manual edits or alternative creation paths; no validation fallback | 6/10 |
| Validation-Only (no auto-generation) | Clear separation of concerns; validation independent | Doesn't solve root cause (forgetting to add tags); higher manual effort | 5/10 |

**Why Chosen**: Three-layer approach provides defense-in-depth with redundancy. Even if one layer is disabled or bypassed (e.g., emergency scenarios, bugs), the other two layers still enforce compliance. Clear error messages at each layer improve debugging. Shared validation logic in `check-anchors.sh` reduces maintenance burden.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**Positive**:
- Guarantees 100% compliance even with single-layer failures
- Clear error messages at each layer improve user experience and debugging
- Can disable individual layers without breaking entire enforcement system
- Redundancy catches edge cases missed by single-layer approaches
- Defense-in-depth aligns with security best practices

**Negative**:
- More code to maintain (3 validation implementations across different codebases)
- Mitigation: Share validation logic in `check-anchors.sh`, call from all layers
- Slightly higher performance overhead (3 checks vs 1)
- Mitigation: Cache template data, optimize ANCHOR parsing, run checks in parallel
- More complex testing surface (need to test all 3 layers + interactions)
- Mitigation: Integration test suite covering all layer combinations

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Inconsistent validation across layers | Medium | Share validation logic in check-anchors.sh |
| Performance degradation | Low | Profile and optimize, cache template hashes |
| Maintenance burden increases | Medium | Comprehensive test suite, clear documentation |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Solving ACTUAL need: specs currently created without compliance, causing memory retrieval failures |
| 2 | **Beyond Local Maxima?** | PASS | Explored 4 alternatives (single validation, dispatch-only, template-only, validation-only) |
| 3 | **Sufficient?** | PASS | Three layers is simplest approach guaranteeing 100% compliance with redundancy |
| 4 | **Fits Goal?** | PASS | Directly addresses problem statement: prevent non-compliant spec creation |
| 5 | **Open Horizons?** | PASS | Extensible: can add more layers (e.g., pre-commit hooks) or disable layers without breaking system |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**Affected Systems**:
- Agent dispatch system (`orchestrate.md`, `speckit.md`)
- Template generation (`anchor-generator.ts`, `templates/level_N/`)
- Validation system (`validate.sh`, `check-anchors.sh`)
- MCP Memory Server (`memory/save.ts`)

**Rollback**: Set `SPECKIT_SKIP_VALIDATION=true` to disable all 3 layers. Revert commits to `orchestrate.md`, `speckit.md`, `validate.sh`, `anchor-generator.ts`. Re-deploy previous template versions.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Auto-Generate vs Require Manual ANCHOR Tags

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-17 |
| **Deciders** | System Architect, Template System Owner |
| **Impact** | High (affects all template users) |

---

<!-- ANCHOR:adr-002-context -->
### Context

ANCHOR tags are required for structured memory retrieval (spec 129), enabling LLM agents to extract specific sections without full file reads. However, manual tagging is error-prone — users frequently forget to add tags or create malformed tag pairs.

### Constraints
- Must maintain backward compatibility with existing manually-tagged specs
- ANCHOR IDs must be unique and searchable
- Auto-generation must not overwrite user customizations
- Performance overhead must be negligible (<50ms per file)
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**Summary**: Auto-generate ANCHOR tags for all major sections (## headings) in templates, preserve existing tags on regeneration.

**Details**: Enhance `anchor-generator.ts` to detect all major sections (## headings) in template files and automatically wrap them with properly formatted `<!-- ANCHOR:id -->` and `<!-- /ANCHOR:id -->` tags. ANCHOR IDs follow format: `{category}-{semantic-slug}-{8char-hash}`. On regeneration, existing ANCHOR tags are preserved (no overwrites). New sections get auto-generated tags.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Auto-generate + preserve existing** | Zero-effort compliance; consistent format; allows customization | Less flexibility for custom IDs (mitigated by preserving existing) | 9/10 |
| Require manual tags | Full flexibility; explicit intent | High error rate; poor compliance; manual effort | 3/10 |
| Validate-only without auto-generation | Clear separation: validation vs generation | Doesn't solve root cause (forgetting to add tags); friction in workflow | 5/10 |
| Auto-generate on ALL headings | Maximum coverage; no ambiguity | Too granular (### and #### create noise); clutters memory queries | 6/10 |
| Template-time generation only | Simple one-time operation | Doesn't handle new sections added during editing | 7/10 |

**Why Chosen**: Auto-generation provides zero-effort compliance while preserving user customizations. Consistent ANCHOR ID format improves searchability. Preserving existing tags on regeneration respects user customizations without forcing overwrites.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**Positive**:
- Zero-effort compliance for template users (tags added automatically)
- Consistent ANCHOR ID format across all specs (improves searchability)
- Backward compatible (preserves existing manually-created tags)
- Reduces cognitive load (users don't need to remember ANCHOR syntax)

**Negative**:
- Less flexibility for custom ANCHOR IDs (e.g., user wants specific ID name)
- Mitigation: Preserve existing tags, so users can manually override if needed
- Auto-generated IDs may not be as semantic as hand-crafted ones
- Mitigation: Use semantic slug generation (filter stop words, action verbs)
- Template regeneration required to add ANChORS to existing files
- Mitigation: Provide migration script for one-time bulk update

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| ANCHOR ID collisions | Low | Add 8-char hash suffix for uniqueness |
| Performance overhead | Low | Profile and optimize; cache slug generation |
| User confusion about auto-generated IDs | Medium | Document ANCHOR ID format in system-spec-kit SKILL.md |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Solving ACTUAL need: manual tagging has high error rate, causing memory retrieval failures |
| 2 | **Beyond Local Maxima?** | PASS | Explored 4 alternatives (manual, validate-only, all headings, template-time only) |
| 3 | **Sufficient?** | PASS | Auto-generation on major sections (##) is simplest approach achieving compliance |
| 4 | **Fits Goal?** | PASS | Directly enables structured memory retrieval (spec 129 requirement) |
| 5 | **Open Horizons?** | PASS | Extensible: can adjust granularity (add ###) or ID format without breaking existing tags |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**Affected Systems**:
- ANCHOR generator (`scripts/lib/anchor-generator.ts`)
- Template files (`templates/level_1-3+/*.md`)
- Validation system (`scripts/rules/check-anchors.sh`)
- Template composition (`scripts/templates/compose.sh`)

**Rollback**: Revert `anchor-generator.ts` changes. Remove ANCHOR tags from template files (restore previous template versions from git history).
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Hard Block vs Warning for Violations

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-17 |
| **Deciders** | System Architect, Validation System Owner |
| **Impact** | High (affects user experience on validation failures) |

---

<!-- ANCHOR:adr-003-context -->
### Context

When validation detects template/anchor violations, system can either block file writes (hard block) or allow writes with warnings (soft enforcement). Critical question: which approach guarantees compliance without excessive friction?

### Constraints
- Must guarantee 100% compliance for critical requirements (P0)
- Cannot frustrate users with false positives (target <1% false positive rate)
- Must allow flexibility for legitimate edge cases
- Error messages must be clear and actionable
- Rollback must be possible if enforcement too strict
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**Summary**: Hard block on P0 violations (missing template source, mismatched ANCHORS), warnings on P1/P2 (missing optional sections).

**Details**: `validate.sh` returns exit code 2 (error) for P0 violations, blocking file writes. Exit code 1 (warning) for P1/P2 violations, allowing writes but logging warnings. P0 violations include: missing `SPECKIT_TEMPLATE_SOURCE` header, orphaned/unclosed ANCHOR tags, missing required files per level. P1/P2 violations include: missing optional sections, placeholder text unfilled, template hash mismatches (informational only).
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Tiered (P0 block, P1/P2 warn)** | Guarantees critical compliance; allows flexibility; clear priority distinction | Requires defining P0 vs P1 boundary | 9/10 |
| All Warnings (no blocking) | User-friendly; no workflow disruption | Poor compliance; defeats purpose of enforcement | 2/10 |
| All Hard Blocks | Maximum compliance; zero violations | Too rigid; blocks legitimate edge cases; frustrating UX | 5/10 |
| User-Configurable per Spec | Ultimate flexibility; per-spec control | Too complex; inconsistent enforcement across project | 4/10 |
| Block on Create, Warn on Edit | Strict on new, lenient on existing | Inconsistent behavior confuses users; doesn't solve legacy compliance | 6/10 |

**Why Chosen**: Tiered approach balances compliance guarantee (P0 hard blocks) with flexibility (P1/P2 warnings). Clear distinction between blockers and nice-to-haves improves user understanding. Emergency bypass flag (`SPECKIT_SKIP_VALIDATION=true`) handles edge cases.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**Positive**:
- Guarantees 100% compliance for critical requirements (P0)
- Clear distinction between blockers (P0) and nice-to-haves (P1/P2)
- Users understand severity based on exit code (2=must fix, 1=should fix)
- Emergency bypass available for legitimate edge cases
- Flexible enough to handle evolving requirements (can reclassify P1↔P2)

**Negative**:
- Can frustrate users if P0 false positives occur
- Mitigation: Extensive test suite to minimize false positives; clear error messages with fix guidance
- Requires careful P0 boundary definition (what is truly a blocker?)
- Mitigation: Document P0 criteria in system-spec-kit SKILL.md; review with stakeholders
- Emergency bypass can be misused (users skip validation entirely)
- Mitigation: Log all bypass attempts for audit trail; require explicit flag

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| P0 false positives block legitimate workflows | High | Comprehensive test suite; monitoring false positive rate; rollback flag |
| Users abuse emergency bypass | Medium | Audit logging; periodic review of bypass usage; educate users on proper use |
| P0 boundary definition disputes | Low | Document criteria; review with stakeholders; allow reclassification |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Solving ACTUAL need: soft enforcement has proven ineffective (low compliance) |
| 2 | **Beyond Local Maxima?** | PASS | Explored 4 alternatives (all warnings, all blocks, per-spec config, create vs edit) |
| 3 | **Sufficient?** | PASS | Tiered approach is simplest guaranteeing P0 compliance without excessive rigidity |
| 4 | **Fits Goal?** | PASS | Directly achieves success criteria: 100% compliance on critical requirements |
| 5 | **Open Horizons?** | PASS | Extensible: can reclassify priorities, adjust exit codes, add P3 tier if needed |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**Affected Systems**:
- Validation system (`scripts/spec/validate.sh`)
- Rule scripts (`scripts/rules/check-*.sh`)
- Speckit agent (`orchestrate.md`, `speckit.md`)
- Documentation (`AGENTS.md`, system-spec-kit SKILL.md)

**Rollback**: Set `SPECKIT_SKIP_VALIDATION=true` to disable all blocking. Modify `validate.sh` to return exit code 1 (warning) for all violations instead of exit code 2 (error).
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:risk-summary -->
## Risk Summary

| ADR | Primary Risk | Mitigation Status |
|-----|--------------|-------------------|
| ADR-001 | Maintenance burden of 3 validation implementations | Mitigated: Share logic in check-anchors.sh |
| ADR-002 | ANCHOR ID collisions in auto-generation | Mitigated: 8-char hash suffix ensures uniqueness |
| ADR-003 | P0 false positives frustrate users | Mitigation planned: Comprehensive test suite, monitoring |

**Overall Risk Level**: Medium (manageable with planned mitigations)
<!-- /ANCHOR:risk-summary -->

---

<!-- ANCHOR:governance -->
## L3+: GOVERNANCE NOTES

### Decision Authority Matrix

| Decision Type | Authority | Review Required |
|---------------|-----------|-----------------|
| Validation Logic Changes | Validation System Owner | Yes (System Architect) |
| Template Format Changes | Template System Owner | Yes (System Architect + Docs Lead) |
| Agent Routing Changes | Agent Framework Lead | Yes (System Architect) |
| P0/P1/P2 Boundary Changes | Product Owner | Yes (System Architect + QA Lead) |

### Change Impact Assessment

All three ADRs have HIGH impact (affect all spec creation workflows). Phased rollout recommended:
1. Phase 1: Deploy validation enhancements (ADR-003) with monitoring
2. Phase 2: Enable ANCHOR auto-generation (ADR-002) after validation stable
3. Phase 3: Enforce agent routing (ADR-001) after auto-generation proven

### Compliance Tracking

| ADR | Compliance Requirement | Verification Method |
|-----|------------------------|---------------------|
| ADR-001 | All spec writes route through @speckit | Audit log review |
| ADR-002 | All template sections have ANCHOR tags | validate.sh check-anchors rule |
| ADR-003 | Zero P0 validation failures | Validation dashboard metrics |
<!-- /ANCHOR:governance -->

---

<!--
Level 3+ Decision Record (~380 lines)
3 ADRs with full context, alternatives, consequences
Five Checks evaluation for each decision
Risk summary and governance controls
Comprehensive ANCHOR coverage
-->
