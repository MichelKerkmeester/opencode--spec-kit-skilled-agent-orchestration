---
title: "Plan: Phase 6 — Documentation Alignment [02--system-spec-kit/024-compact-code-graph/006-documentation-alignment/plan]"
description: "1. Create feature catalog entries"
trigger_phrases:
  - "plan"
  - "phase"
  - "documentation"
  - "alignment"
  - "006"
importance_tier: "important"
contextType: "decision"
---
# Plan: Phase 6 — Documentation Alignment

## Steps

1. **Create feature catalog entries:**
   - Create entries for: PreCompact hook, SessionStart priming, Stop token tracking, cross-runtime fallback, runtime detection
   - Follow existing feature catalog format and conventions
   - Include usage examples, configuration, and integration points
2. **Create manual testing playbook scenarios:**
   - Write test scenarios for each hook (PreCompact, SessionStart, Stop)
   - Write cross-runtime fallback test scenarios
   - Include expected results, prerequisites, and verification steps
3. **Update SKILL.md with hook system section:**
   - Add "Hook System" section describing lifecycle integration
   - Document hook registration process (`.claude/settings.local.json`)
   - Document hook script locations and build process
   - Explain design principle: hooks = transport, not business logic
4. **Update ARCHITECTURE.md with hook architecture:**
   - Add hook lifecycle diagram (ASCII flowchart)
   - Document hook state management (temp files, session mapping)
   - Document runtime adapter pattern
   - Document token tracking data flow
5. **Update README files:**
   - Root `README.md` — mention new context preservation capabilities
   - `.opencode/skill/system-spec-kit/README.md` — list hook features
   - `.opencode/skill/README.md` — update system-spec-kit description
6. **Update AGENTS.md if needed:**
   - Check if Phase 5 agent changes require AGENTS.md updates
   - Update agent capability descriptions
7. **Verify documentation quality:**
   - Run sk-doc quality checks on all updated files
   - Ensure consistent terminology (hooks, context injection, runtime detection)
   - Verify no stale references to pre-hook compaction approach

<!-- ANCHOR:dependencies -->
## Dependencies
- Phase 1-4 (all hook implementations must be designed for accurate documentation)
- Phase 5 (agent definition changes affect AGENTS.md)
- Can begin drafts in parallel with Phases 1-5, finalize after implementation
<!-- /ANCHOR:dependencies -->
