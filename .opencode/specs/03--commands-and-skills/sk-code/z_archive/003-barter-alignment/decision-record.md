---
title: "Decision Record: workflows-code Barter Alignment [003-barter-alignment/decision-record]"
description: "The Barter system has a mature workflows-code skill with improved organizational patterns, priority-based loading, and token budget awareness that can benefit anobel.com's imple..."
trigger_phrases:
  - "decision"
  - "record"
  - "workflows"
  - "code"
  - "barter"
  - "decision record"
  - "022"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Decision Record: workflows-code Barter Alignment

<!-- ANCHOR:adr-001 -->
## ADR-001: Selective Adoption of Barter Patterns

<!-- ANCHOR:adr-001-context -->
### Context

The Barter system has a mature `workflows-code` skill with improved organizational patterns, priority-based loading, and token budget awareness that can benefit anobel.com's implementation while preserving its domain-specific content.

<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

Align anobel.com's `workflows-code` skill with organizational patterns from the Barter development environment using **selective adoption**.

**Status**: APPROVED - Analysis complete, ready for implementation

<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Alternative | Pros | Cons | Decision |
|-------------|------|------|----------|
| Keep current structure | No work required, no risk | Misses P1/P2/P3 optimization, flat folders hard to navigate | Rejected |
| Full Barter copy | Complete consistency | Loses anobel.com's domain-specific content | Rejected |
| Selective adoption | Best of both, optimized loading, preserves context | Requires analysis effort | **Selected** |
| Create new structure | Fresh design | Loses proven patterns from both | Rejected |

<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

#### Rationale

- Barter's priority-based loading (P1/P2/P3) optimizes token usage
- Sub-folder organization improves navigation in large skills
- Verification statement templates ensure consistent completion claims
- anobel.com's domain-specific content (Webflow, CDN, Motion.dev) should be preserved

#### Analysis Findings

##### Feature-by-Feature Comparison

| Feature | Barter | anobel.com | Gap | Action |
|---------|--------|------------|-----|--------|
| **Priority Loading (P1/P2/P3)** | Yes - 3-tier system | No | Critical gap | Add to SKILL.md |
| **Token Budget Estimates** | Yes - P1:1.5k, P2:4k, P3:10k | No | Important gap | Add estimates |
| **Keyword-Based Triggers** | Yes - in router | Partial - in "When to Use" only | Minor gap | Add to python router |
| **Sub-folder Organization** | Yes - by repository/domain | No - flat structure | Major gap | Reorganize |
| **Verification Templates** | Yes - structured evidence fields | No | Important gap | Add template |
| **Python Router** | Yes - with load levels | Yes - but missing routes | Minor gap | Fix missing routes |
| **Phase-Based Workflow** | No - stack detection | Yes - 3 phases | Different approach | Preserve anobel.com |
| **The Iron Law** | No | Yes | anobel.com unique | Preserve |
| **Browser Testing Matrix** | No | Yes - Minimum/Standard levels | anobel.com unique | Preserve |
| **Stack Detection** | Yes - 6+ tech stacks | No - Webflow-specific | Different scope | Not applicable |

##### Barter Patterns to Adopt

1. **Priority-Based Loading System**
   - P1 (Core): Always loaded, navigation/routing (~1,500 tokens)
   - P2 (Phase-Specific): Loaded based on detected phase (~4,000 tokens)
   - P3 (Deep Dive): Loaded on specific keyword triggers (~10,000 tokens)

2. **Token Budget Documentation**
   - Clear estimates help users understand loading cost
   - Enables informed decisions about which resources to request

3. **Verification Statement Template**
   - Structured format for completion claims
   - Evidence fields ensure "The Iron Law" compliance

4. **Sub-folder Organization**
   - Assets grouped by type (checklists, patterns, integrations)
   - References grouped by workflow phase + cross-cutting concerns

##### anobel.com Patterns to Preserve

1. **3-Phase Workflow Structure** - Implementation → Debugging → Verification
2. **"The Iron Law"** - NO COMPLETION CLAIMS WITHOUT BROWSER VERIFICATION
3. **Browser Testing Matrix** - Minimum and Standard verification levels
4. **Phase Detection Helper** - Self-assessment for phase confusion
5. **Phase Transitions Table** - Clear guidance on moving between phases
6. **Webflow Platform Constraints** - Collection limits, ID duplication, async rendering
7. **CDN Deployment Workflow** - Cloudflare R2 specific patterns
8. **Animation Strategy** - CSS-first, Motion.dev for complex, prefers-reduced-motion
9. **mcp-chrome-devtools Integration** - Browser verification tooling

##### Not Applicable from Barter

1. **Stack-Agnostic Detection** - anobel.com is Webflow-specific, not multi-stack
2. **Repository-Based Sub-folders** - Single project, phase-based organization is clearer
3. **6+ Technology Stack Templates** - Only need Webflow/JS patterns

#### Trade-offs

| Trade-off | Accepted? | Mitigation |
|-----------|-----------|------------|
| Breaking change to file paths | Yes | Update all SKILL.md references, verify before merge |
| Increased SKILL.md complexity | Yes | Priority loading reduces actual token usage |
| Learning curve for new structure | Yes | Phase-based organization is intuitive |
| Migration effort | Yes | One-time cost, long-term benefit |

<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-impl -->
### Implementation Notes

#### SKILL.md Changes Required

1. **Add Priority Loading Section** (new Section 2.5)
   - Define P1/P2/P3 tiers with token estimates
   - Map existing resources to priority tiers

2. **Update Python Router** (Section 2)
   - Add missing routes: observer_patterns.md, third_party_integrations.md, performance_patterns.md
   - Add priority level comments to each route
   - Add keyword triggers inline

3. **Add Verification Statement Template** (Section 5)
   - Structured completion claim format
   - Evidence fields for browser testing

4. **Update All File References** (Sections 2, 3, 6, 7, 9)
   - 6 asset paths need sub-folder prefix
   - 14 reference paths need sub-folder prefix

#### File Operations Required

- Create 3 sub-folders in assets/
- Create 5 sub-folders in references/
- Move 6 asset files
- Move 14 reference files
- Update ~40+ path references in SKILL.md

<!-- /ANCHOR:adr-001-impl -->

<!-- /ANCHOR:adr-001 -->

---

## Changelog

| Date | Change | Author |
|------|--------|--------|
| 2026-01-01 | Initial decision record created | AI Assistant |
| 2026-01-01 | Completed analysis, added comparison findings | AI Assistant |
| 2026-01-01 | Status updated to APPROVED | AI Assistant |
