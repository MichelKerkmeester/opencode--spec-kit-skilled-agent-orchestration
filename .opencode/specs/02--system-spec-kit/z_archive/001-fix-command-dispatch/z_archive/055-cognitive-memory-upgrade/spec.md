---
title: "Spec: Cognitive Memory Upgrade Research [055-cognitive-memory-upgrade/spec]"
description: "Research upgrading Spec Kit Memory system with ideas and principles from the claude-cognitive repository, adapted for OpenCode's hook-less architecture."
trigger_phrases:
  - "spec"
  - "cognitive"
  - "memory"
  - "upgrade"
  - "research"
  - "055"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: CORE -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: Cognitive Memory Upgrade Research

<!-- ANCHOR:metadata -->
## Overview
Research upgrading Spec Kit Memory system with ideas and principles from the claude-cognitive repository, adapted for OpenCode's hook-less architecture.

<!-- /ANCHOR:metadata -->
## Scope
- **In Scope:** Analysis of claude-cognitive concepts, feasibility assessment, recommendations
- **Out of Scope:** Implementation (research only)

## Constraints
- OpenCode does not have hooks - all hook-dependent features need alternative approaches
- Must maintain backward compatibility with existing memory system
- Analysis and recommendations only - no code changes

## Success Criteria
- Comprehensive analysis of claude-cognitive architecture
- Clear mapping of transferable vs non-transferable concepts
- Actionable recommendations with implementation paths

## References
- Source: https://github.com/GMaN1911/claude-cognitive
- Current system: .opencode/skill/system-spec-kit/
