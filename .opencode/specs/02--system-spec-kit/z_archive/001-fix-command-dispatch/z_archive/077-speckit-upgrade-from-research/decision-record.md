---
title: "Dec [02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/077-speckit-upgrade-from-research/decision-record]"
description: "This document records architectural decisions made during the consolidation of four research specifications (060-063) into a unified SpecKit upgrade implementation plan. Each de..."
trigger_phrases:
  - "decision"
  - "record"
  - "speckit"
  - "upgrade"
  - "from"
  - "decision record"
  - "077"
importance_tier: "important"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: SpecKit Upgrade from Research

> **Spec Folder**: 077-speckit-upgrade-from-research
> **Parent**: 003-memory-and-spec-kit
> **Level**: 3+ (Architecture decisions, multi-source consolidation)
> **Created**: 2026-01-22
> **Last Updated**: 2026-01-22

---

## Overview

This document records architectural decisions made during the consolidation of four research specifications (060-063) into a unified SpecKit upgrade implementation plan. Each decision follows the ADR (Architecture Decision Record) format for traceability and future reference.

---

<!-- ANCHOR:decision -->
## Decision 1: Consolidate 4 Research Specs into Single Implementation Plan

**Date:** 2026-01-22
**Status:** ACCEPTED
**Source:** 060, 061, 062, 063

### Context

Four separate research specifications were created to analyze external repositories for patterns applicable to the SpecKit system:
- **060**: smart-ralph-ai analysis (state management, recovery patterns)
- **061**: empirica-ai analysis (epistemic confidence, uncertainty tracking)
- **062**: opencode-hooks analysis (command hooks, lifecycle events)
- **063**: superego analysis (evaluation frameworks, decision quality)

Each spec produced valuable insights but existed in isolation, making implementation planning fragmented.

### Decision

Consolidate all four research specs into a single implementation specification (077) with a prioritized roadmap that integrates findings into actionable tasks.

### Rationale

- **Reduces fragmentation**: Single source of truth for implementation priorities
- **Clearer implementation path**: Unified roadmap prevents duplicate work
- **Cross-pollination**: Patterns from different sources can be combined (e.g., uncertainty from 061 + five checks from 063)
- **Maintenance efficiency**: One spec to track rather than four

### Alternatives Considered

1. **Implement each research spec separately**: Would create duplicate state tracking systems and conflicting patterns
2. **Cherry-pick individual features**: Loses systemic improvements, harder to track dependencies
3. **Create umbrella spec with sub-tasks**: Adds complexity without clear benefit

### Consequences

**Positive:**
- Single implementation roadmap
- Clear priority ordering (P0 > P1 > P2)
- Dependency tracking between features
- Consolidated memory context for future sessions

**Negative:**
- Large spec folder to manage
- Must carefully track which source each decision came from
- Risk of scope creep without discipline

### References

- `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/077-speckit-upgrade-from-research/research/smart-ralph-synthesis.md`
- `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/077-speckit-upgrade-from-research/research/empirica-synthesis.md`
- `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/077-speckit-upgrade-from-research/research/hooks-synthesis.md`
- `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/077-speckit-upgrade-from-research/research/superego-synthesis.md`

<!-- /ANCHOR:decision -->
---

<!-- ANCHOR:decision -->
## Decision 2: OpenCode Environment Constraint (No Hooks)

**Date:** 2026-01-22
**Status:** ACCEPTED
**Source:** 062

### Context

Research spec 062 analyzed the OpenCode hooks system, which provides command lifecycle events (pre/post hooks) for automation. However, the user's environment runs OpenCode without the hooks feature enabled, meaning hook-based implementations are not available.

### Decision

Mark all hook-based recommendations from 062 as N/A (Not Applicable). Adopt only transferable patterns that work without hooks (Zod validation schemas, structured error handling patterns).

### Rationale

- **Environment reality**: ~80% of 062 research recommendations require hooks
- **No workarounds**: Hook functionality cannot be simulated in current environment
- **Transferable value**: Validation patterns and error handling approaches work independently

### Alternatives Considered

1. **Enable hooks in user's environment**: Requires configuration changes user may not want
2. **Hybrid approach**: Implement hook-ready code that degrades gracefully - adds complexity for uncertain benefit
3. **Full adoption pending hooks**: Delays all value until hooks available

### Consequences

**Positive:**
- Immediate implementation possible for transferable patterns
- No blocked tasks waiting on environment changes
- Clear scope reduction (~20% of 062 is actionable)

**Negative:**
- Cannot use pre-validation hooks for file modifications
- Cannot use post-execution hooks for automatic memory saves
- Must revisit if hooks become available

### References

- `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/077-speckit-upgrade-from-research/research/hooks-synthesis.md`
- OpenCode documentation on hooks configuration

<!-- /ANCHOR:decision -->
---

<!-- ANCHOR:decision -->
## Decision 3: Adopt Uncertainty Tracking Separate from Confidence

**Date:** 2026-01-22
**Status:** ACCEPTED
**Source:** 061 (Empirica)

### Context

The current AGENTS.md confidence framework uses a single percentage (0-100%) to represent certainty. Research from Empirica reveals this conflates two distinct concepts:
- **Confidence**: How sure am I about this answer?
- **Uncertainty**: How much do I NOT know about the domain?

A model can be highly confident (95%) while having high uncertainty (unknown unknowns exist). This creates "confident ignorance" - dangerous for autonomous execution.

### Decision

Add uncertainty as a distinct field (0.0-1.0 scale) separate from confidence. Both must be tracked for significant decisions.

### Rationale

- **Prevents confident ignorance**: High confidence + high uncertainty triggers caution
- **Better calibration**: Model explicitly considers what it doesn't know
- **Empirica-validated**: Pattern proven effective in production AI systems
- **Natural language mapping**: "I'm confident in my answer but uncertain about edge cases"

### Alternatives Considered

1. **Keep single confidence metric**: Simpler but conflates distinct concepts
2. **Add "unknown unknowns" flag**: Binary approach loses nuance
3. **Full 13-vector epistemic system**: Empirica's complete system is overkill for current needs

### Consequences

**Positive:**
- Dual-axis decision quality
- Better gate validation possible
- Explicit "I don't know what I don't know" handling

**Negative:**
- Requires AGENTS.md Section 4 rewrite
- Learning curve for calibration
- Two numbers to track instead of one

### References

- `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/077-speckit-upgrade-from-research/research/empirica-synthesis.md`
- Empirica epistemic vector documentation

<!-- /ANCHOR:decision -->
---

<!-- ANCHOR:decision -->
## Decision 4: Implement Dual-Threshold Validation

**Date:** 2026-01-22
**Status:** ACCEPTED
**Source:** 061 (Empirica)

### Context

Current gates use single-threshold validation (e.g., "confidence >= 80%"). With the adoption of separate uncertainty tracking (Decision 3), a dual-threshold system becomes possible and necessary.

### Decision

Implement dual-threshold validation for file modification gates:
- **Knowledge threshold**: know >= 0.70 (confidence in answer)
- **Uncertainty threshold**: uncertainty <= 0.35 (bounded unknowns)

Both conditions must be met for autonomous execution.

### Rationale

- **Logical complement to Decision 3**: Uncertainty field needs validation rules
- **Empirica-proven thresholds**: 0.70/0.35 values come from production experience
- **Defense in depth**: Two independent checks catch more failure modes
- **Clear semantics**: "I know enough AND don't have too many unknowns"

### Alternatives Considered

1. **Single combined score**: Loses the distinct signal each metric provides
2. **Different thresholds per context**: Adds complexity, harder to remember
3. **Soft thresholds with warnings**: Weaker enforcement, more escape hatches

### Consequences

**Positive:**
- Stronger gate validation
- Explicit uncertainty bounds
- Matches Empirica's production-tested approach

**Negative:**
- More restrictive (may slow execution)
- Requires both metrics for every gated action
- Calibration needed to find right thresholds for this codebase

### References

- `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/077-speckit-upgrade-from-research/research/empirica-synthesis.md`
- Decision 3 (dependency)

<!-- /ANCHOR:decision -->
---

<!-- ANCHOR:decision -->
## Decision 5: State File (.spec-state.json) - SUPERSEDED

**Date:** 2026-01-22
**Status:** SUPERSEDED
**Superseded By:** Memory-based approach with enhanced resume detection
**Source:** 060 (Smart-Ralph)

### Context

Current spec folder state relies on memory files and implicit state (last modified files, checklist status). Smart-Ralph uses explicit `.ralph-state.json` files for reliable state persistence and recovery.

### Original Decision (Now Superseded)

Originally proposed implementing `.spec-state.json` for spec folder state tracking.

### Superseding Decision

After scope refinement, the state file approach was deemed unnecessary complexity. The memory-based approach with enhanced resume detection (using anchor-based priority order) provides sufficient reliability without introducing additional file management overhead.

**New Approach:**
1. Memory files with `status: active` anchor (highest priority)
2. Memory files < 24 hours old in spec folder
3. User-provided spec folder path
4. Last modified spec folder heuristic (fallback)

### Rationale for Superseding

- **Scope reduction**: Memory-based approach is sufficient for current needs
- **Reduced complexity**: No additional state file to manage per spec
- **Existing infrastructure**: Memory files already have anchor system for reliable detection
- **Incremental enhancement**: Can revisit state file if memory approach proves insufficient

### References

- `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/077-speckit-upgrade-from-research/research/smart-ralph-synthesis.md`
- spec.md Section 4: Out-of-Scope (explicitly excludes `.spec-state.json`)

<!-- /ANCHOR:decision -->
---

<!-- ANCHOR:decision -->
## Decision 6: Adopt Five Checks Framework from Superego

**Date:** 2026-01-22
**Status:** ACCEPTED
**Source:** 063 (Superego)

### Context

Superego uses a systematic "Five Checks" framework for evaluating decisions before execution. Current AGENTS.md has ad-hoc validation but lacks structured evaluation questions.

### Decision

Add Five Checks to significant decision points:

1. **Direct Harm**: Does this action risk causing immediate harm?
2. **Manipulation**: Could this be construed as deceptive or manipulative?
3. **Illegal/Unethical**: Does this violate laws, policies, or ethical standards?
4. **User Intent**: Does this align with what the user actually wants?
5. **Reversibility**: Can this action be easily undone if wrong?

### Rationale

- **Systematic evaluation**: Prevents ad-hoc reasoning that misses categories
- **Scope creep prevention**: Question 4 (User Intent) catches drift
- **Safety emphasis**: Questions 1-3 prioritize harm prevention
- **Superego-validated**: Framework proven effective

### Alternatives Considered

1. **Current ad-hoc checks**: Works but inconsistent and easy to skip
2. **Full Superego integration**: Too heavy for current needs
3. **Custom checklist**: Reinvents wheel, not battle-tested

### Consequences

**Positive:**
- Consistent decision evaluation
- Explicit harm/ethics consideration
- User intent check prevents scope creep
- Reversibility encourages safer choices

**Negative:**
- Five questions per significant decision adds overhead
- Must define what "significant" means
- Could become rubber-stamped if not taken seriously

### References

- `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/077-speckit-upgrade-from-research/research/superego-synthesis.md`
- Superego five-checks documentation

<!-- /ANCHOR:decision -->
---

<!-- ANCHOR:decision -->
## Decision 7: Skip Full Hook Integration

**Date:** 2026-01-22
**Status:** ACCEPTED
**Source:** 062

### Context

Research spec 062 analyzed OpenCode command hooks in depth. While the patterns are valuable, the user's environment doesn't support hooks (see Decision 2).

### Decision

Formally skip full hook integration. Adopt only transferable patterns:
- Zod validation schemas for structured data
- Error handling patterns (ErrorPayload, formatError)
- JSON schema validation approaches

Do NOT implement:
- Pre-command hooks
- Post-command hooks
- Command lifecycle events

### Rationale

- **Environment constraint**: Hooks not available (Decision 2)
- **Partial value extraction**: Validation and error patterns work standalone
- **Clean scope**: Clear boundary on what's in/out
- **Future-ready**: Patterns can integrate with hooks if enabled later

### Alternatives Considered

1. **Wait for hooks**: Delays all 062 value indefinitely
2. **Simulate hooks**: Complex, fragile, non-standard
3. **Ignore 062 entirely**: Loses valuable transferable patterns

### Consequences

**Positive:**
- Clear scope reduction
- Immediate value from transferable patterns
- No blocked work waiting on environment changes

**Negative:**
- Cannot use powerful hook automation
- Manual enforcement where hooks would auto-enforce
- Revisit needed if hooks become available

### References

- `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/077-speckit-upgrade-from-research/research/hooks-synthesis.md`
- Decision 2 (dependency)

<!-- /ANCHOR:decision -->
---

<!-- ANCHOR:decision -->
## Decision 8: Defer LanceDB Migration

**Date:** 2026-01-22
**Status:** DEFERRED
**Source:** 063 (Superego mention)

### Context

Superego research mentioned LanceDB as a vector database for scalable semantic search. Current SpecKit Memory uses SQLite + better-sqlite3 with vec0 extension.

### Decision

Keep current SQLite + better-sqlite3 implementation. Defer LanceDB evaluation to future spec.

### Rationale

- **No performance issues**: Current scale (~50-100 memories) works fine
- **Working system**: "Don't fix what isn't broken"
- **Migration cost**: Database migration is non-trivial
- **Insufficient evidence**: Superego mention was passing, not a recommendation

### Alternatives Considered

1. **Immediate migration**: High effort, unclear benefit at current scale
2. **Parallel evaluation**: Adds complexity for uncertain payoff
3. **Hybrid approach**: Maintain two databases - maintenance burden

### Consequences

**Positive:**
- No migration work required
- Current system continues working
- Focus on higher-priority improvements

**Negative:**
- May hit scaling limits eventually
- Deferred technical debt if migration needed later
- Miss potential performance gains

### References

- `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/077-speckit-upgrade-from-research/research/superego-synthesis.md`
- Current SQLite implementation in `.opencode/skill/system-spec-kit/mcp_server/`

<!-- /ANCHOR:decision -->
---

<!-- ANCHOR:decision -->
## Decision Summary Table

| # | Decision | Status | Priority | Source |
|---|----------|--------|----------|--------|
| 1 | Consolidate 4 specs into unified plan | ACCEPTED | P0 | All |
| 2 | OpenCode environment constraint (no hooks) | ACCEPTED | P0 | 062 |
| 3 | Uncertainty tracking separate from confidence | ACCEPTED | P0 | 061 |
| 4 | Dual-threshold validation | ACCEPTED | P0 | 061 |
| 5 | State file (.spec-state.json) | SUPERSEDED | - | 060 |
| 6 | Five Checks framework | ACCEPTED | P1 | 063 |
| 7 | Skip full hook integration | ACCEPTED | P0 | 062 |
| 8 | Defer LanceDB migration | DEFERRED | P2 | 063 |

<!-- /ANCHOR:decision -->
---

## Revision History

| Date | Change | Author |
|------|--------|--------|
| 2026-01-22 | Initial decision record created | Claude |
