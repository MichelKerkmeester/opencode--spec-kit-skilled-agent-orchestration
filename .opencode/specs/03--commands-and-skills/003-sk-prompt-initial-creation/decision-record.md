---
title: "Decision Record: sk-prompt-improver Initial Creation"
---
# Decision Record: sk-prompt-improver Initial Creation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

## Overview

This document captures key architectural and design decisions for the sk-prompt-improver skill creation project.

---

## DR-001: Progressive Disclosure Architecture

**Context:**
Source Prompt Improver knowledge base contains ~250KB of content distributed across 7+ documents including System Prompt guidelines, DEPTH Framework specifications, pattern evaluation systems, and multiple operating mode (interactive, visual, image, video) documentation.

**Problem:**
How do we structure the skill while maintaining usability in a context-limited environment (Claude's token budget)?

**Decision:**
Adopt **Progressive Disclosure** architecture:
- SKILL.md serves as orchestrator and entry point (<5000 words)
- references/ directory contains adapted deep-dive documentation
- Each reference file addresses a specific domain (e.g., system_prompt.md, depth_framework.md)
- SKILL.md links to references; users access full content on-demand

**Rationale:**
- Keeps primary SKILL.md lean and context-window friendly
- Follows established OpenCode skill best practices (e.g., sk-doc, sk-code--review)
- Enables progressive learning: start with SKILL.md overview, deep-dive into references as needed
- Reduces initial cognitive load when learning the skill

**Alternatives Considered:**
1. **Single monolithic file** - Rejected: exceeds 5000-word guideline, reduces usability in context-limited scenarios
2. **Minimal subset only** - Rejected: loses key functionality (DEPTH Framework, multi-mode documentation), reduces skill coverage
3. **External URL references** - Rejected: breaks offline functionality, dependency on external availability

**Status:** ACCEPTED

**Decision Date:** 2026-03-01

---

## DR-002: Reference Adaptation vs. Verbatim Copy

**Context:**
Source Prompt Improver documentation was designed as a standalone Claude Project with custom system instructions. It assumes direct integration into Claude's system prompt or use as persistent context.

**Problem:**
Should we copy source material verbatim or adapt it for OpenCode skill architecture?

**Decision:**
**Adapt** source documents rather than copy verbatim. Adaptations include:
- Remove standalone context assumptions; integrate with AGENTS.md patterns
- Convert first-person guidance ("I recommend") to third-person imperative ("Use")
- Refactor for skill invocation paradigm rather than persistent context paradigm
- Maintain original content fidelity while restructuring for skill consumption

**Rationale:**
- Source assumes custom instructions model; skills require orchestrated dispatch
- OpenCode has different execution context than standalone Claude Project
- Adaptation improves integration with existing CLAUDE.md, AGENTS.md, and SKILL.md conventions
- Maintains intellectual honesty: adaptation credit preserves original author attribution

**Alternatives Considered:**
1. **Verbatim copy** - Rejected: creates impedance mismatch with OpenCode architecture
2. **Complete rewrite** - Rejected: loses proven methodologies and precision of original content
3. **Summary extraction** - Rejected: oversimplifies nuanced guidance, loses depth

**Status:** ACCEPTED

**Decision Date:** 2026-03-01

---

## DR-003: Consolidated Format Guides

**Context:**
Source documentation includes 3 separate format guide files:
- Format Guide: JSON
- Format Guide: YAML
- Format Guide: Markdown

These documents are complementary (covering different serialization formats) but distributed as separate files.

**Problem:**
Should we maintain 3 separate files or consolidate?

**Decision:**
**Consolidate** the 3 format guide documents into a single `references/format_guides.md` file with sections for each format.

**Rationale:**
- Reduces file count (3 files → 1 file)
- Content is intrinsically cross-referenced (users typically need multiple formats)
- Easier discovery: single reference file for "how do I format my prompt?"
- Maintains parallel structure: each format gets equal treatment with dedicated subsection
- Reduces directory clutter; improves navigation

**Alternatives Considered:**
1. **Keep 3 separate files** - Rejected: distribution creates discovery friction
2. **Fold into SKILL.md** - Rejected: adds unnecessary length to primary file
3. **Create meta-index file** - Rejected: adds one more file; consolidated version is simpler

**Status:** ACCEPTED

**Decision Date:** 2026-03-01

---

## DR-004: Operating Mode Categorization

**Context:**
Source Prompt Improver defines 10+ operating modes that serve different user scenarios:
- Core: System Prompt, DEPTH Framework, Patterns Evaluation
- Interactive: 7 named variants (discovery, challenge, deepening, integration, cross-domain, refinement, mastery)
- Visual/Multimedia: Visual mode, Image mode, Video mode

**Problem:**
How do we organize documentation for so many modes?

**Decision:**
Organize operating modes across multiple reference files with clear categorical boundaries:
- Core modes → references/ (system_prompt.md, depth_framework.md, patterns_evaluation.md)
- Interactive modes → references/interactive_mode.md (7 variants as subsections)
- Visual/multimedia modes → dedicated files per modality (visual_mode.md, image_mode.md, video_mode.md)
- Cross-cutting concerns → format_guides.md (format specifications)

**Rationale:**
- Groups related modes together; improves discovery and organization
- Interactive modes share common patterns (dialogue structure, feedback loops) → single file with subsections
- Distinct modalities (visual, image, video) merit separate files due to unique implementation requirements
- Allows users to navigate to their use case efficiently

**Status:** ACCEPTED

**Decision Date:** 2026-03-01

---

## DR-005: skill_advisor.py Integration

**Context:**
OpenCode uses skill_advisor.py to route user requests to appropriate skills based on intent matching and confidence scoring.

**Problem:**
How do we ensure sk-prompt-improver is discovered and routed correctly?

**Decision:**
Update skill_advisor.py with sk-prompt-improver entries including:
- Skill name: "sk-prompt-improver"
- Intent boosters: trigger phrases for prompt refinement, improvement, clarity, effectiveness, quality
- Confidence tuning: ensure sk-prompt-improver scores >= 0.85 for on-target queries
- Uncertainty bounds: configure uncertainty thresholds appropriately

**Rationale:**
- Skill discovery depends on skill_advisor.py configuration
- Intent boosters ensure high precision matching for prompt-related queries
- Confidence tuning ensures skill invocation when appropriate
- Follows established OpenCode pattern (skills like sk-doc, sk-code--review already configured)

**Status:** ACCEPTED

**Decision Date:** 2026-03-01

---

## DR-006: DEPTH Framework as First-Class Citizen

**Context:**
The DEPTH Framework is a central component of sk-prompt-improver but can be perceived as secondary to System Prompt guidance.

**Problem:**
How prominent should DEPTH Framework be in skill documentation?

**Decision:**
Treat DEPTH Framework as a **first-class citizen** with:
- Dedicated references/depth_framework.md file
- Explicit documentation of all depth levels (Surface, Intermediate, Expert, Mastery)
- Integration into SMART ROUTING logic (offer DEPTH Framework mode as explicit routing option)
- Cross-references from System Prompt and Interactive mode documentation

**Rationale:**
- DEPTH Framework is a core methodological contribution, not supporting material
- Users solving "how do I structure complex prompts?" benefit from DEPTH Framework first
- DEPTH Framework enables progressive elaboration, essential for skill effectiveness
- Explicit routing ensures user awareness and availability

**Status:** ACCEPTED

**Decision Date:** 2026-03-01

---

## Summary Table

| Decision | Status | Key Insight |
|----------|--------|-------------|
| DR-001: Progressive Disclosure | ACCEPTED | Lean orchestrator + deep references = better UX |
| DR-002: Adaptation vs. Copy | ACCEPTED | Respect original; adapt for context |
| DR-003: Format Consolidation | ACCEPTED | Group cross-referenced content |
| DR-004: Mode Organization | ACCEPTED | Categorical grouping improves navigation |
| DR-005: skill_advisor.py Integration | ACCEPTED | Discovery requires explicit configuration |
| DR-006: DEPTH as First-Class | ACCEPTED | Core methodology deserves prominence |

---

## Implementation Notes

- All decisions support the specification in spec.md
- Implementation plan in plan.md aligns with decision rationales
- Task breakdown in tasks.md respects architectural boundaries set by these decisions
- Checklist in checklist.md verifies decision implementation

---

## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Tasks**: See `tasks.md`
- **Checklist**: See `checklist.md`
