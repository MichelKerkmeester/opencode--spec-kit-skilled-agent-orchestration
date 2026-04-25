---
title: "Context Index: Skill Advisor"
description: "Bridge index for the skill advisor system — search/routing tuning, skill graph + advisor unification, advisor docs and standards, smart-router, hook surface, plugin hardening, hook improvements, and the /doctor:skill-advisor setup command — after consolidating original phases inside the phase root. Active parent for 12 direct child phase packets."
trigger_phrases:
  - "008-skill-advisor"
  - "skill advisor"
  - "skill advisor system"
  - "skill advisor hook"
  - "search/routing tuning, skill graph and advisor unification, advisor docs and standards, smart-router, hook surface, plugin hardening, and hook improvements"
  - "001-search-and-routing-tuning"
  - "002-skill-advisor-graph"
  - "003-advisor-phrase-booster-tailoring"
  - "004-skill-advisor-docs-and-code-alignment"
  - "005-smart-router-remediation-and-opencode-plugin"
  - "006-deferred-remediation-and-telemetry-run"
  - "007-skill-advisor-hook-surface"
  - "008-skill-graph-daemon-and-advisor-unification"
  - "009-skill-advisor-plugin-hardening"
  - "010-skill-advisor-standards-alignment"
  - "011-skill-advisor-hook-improvements"
  - "012-skill-advisor-setup-command"
  - "/doctor:skill-advisor"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-skill-advisor"
    migration_aliases:
      - "system-spec-kit/026-graph-and-context-optimization/008-skill-advisor"
    last_updated_at: "2026-04-25T11:50:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "2026-04-25 second consolidation: merged 008-skill-advisor root + 5 advisor children from 009-hook-parity into 008-skill-advisor"
    next_safe_action: "Use context-index.md for local phase navigation"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:324fa5d537563231703b2043a4ebd560203519c06ac7b507c4683a220d224705"
      session_id: "026-phase-root-flatten-2026-04-21"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Context Index: Skill Advisor

<!-- SPECKIT_LEVEL: 1 -->

## Theme

The skill advisor system: search/routing tuning, skill graph + advisor unification, advisor docs and standards, smart-router, hook surface, plugin hardening, hook improvements, and the `/doctor:skill-advisor` setup command. The original phase packets — six from `008-skill-advisor/` and five advisor packets from `009-hook-parity/` — are direct child folders of this phase root, joined by the new 012-skill-advisor-setup-command packet.

## Child Phase Map

| Child Phase | Title | Origin | Status Before Consolidation | Current Path |
|-------------|-------|--------|-----------------------|--------------|
| `001-search-and-routing-tuning/` | Feature Specification: Search and Routing Tuning Coordination Parent | 006/001 | Planned | `008-skill-advisor/001-search-and-routing-tuning/` |
| `002-skill-advisor-graph/` | Feature Specification: Skill Advisor Graph | 006/002 | In Progress | `008-skill-advisor/002-skill-advisor-graph/` |
| `003-advisor-phrase-booster-tailoring/` | Feature Specification: Advisor Phrase-Booster Tailoring | 006/003 | Planned | `008-skill-advisor/003-advisor-phrase-booster-tailoring/` |
| `004-skill-advisor-docs-and-code-alignment/` | Feature Specification: Skill-Advisor Docs + Phase 020 Code Alignment | 006/005 | Complete | `008-skill-advisor/004-skill-advisor-docs-and-code-alignment/` |
| `005-smart-router-remediation-and-opencode-plugin/` | Feature Specification: Smart-Router Remediation + OpenCode Plugin | 006/006 | In Progress | `008-skill-advisor/005-smart-router-remediation-and-opencode-plugin/` |
| `006-deferred-remediation-and-telemetry-run/` | Feature Specification: Deferred Remediation + Telemetry Measurement Run | 006/007 | Partial | `008-skill-advisor/006-deferred-remediation-and-telemetry-run/` |
| `007-skill-advisor-hook-surface/` | Feature Specification: Skill-Advisor Hook Surface | 010/001 | In Progress | `008-skill-advisor/007-skill-advisor-hook-surface/` |
| `008-skill-graph-daemon-and-advisor-unification/` | Feature Specification: 027 - Skill Graph Daemon and Advisor Unification | 010/002 | In Progress | `008-skill-advisor/008-skill-graph-daemon-and-advisor-unification/` |
| `009-skill-advisor-plugin-hardening/` | Feature Specification: Skill-Advisor Plugin Hardening | 010/008 | Complete | `008-skill-advisor/009-skill-advisor-plugin-hardening/` |
| `010-skill-advisor-standards-alignment/` | Feature Specification: Skill-Advisor Standards Alignment | 010/009 | Complete | `008-skill-advisor/010-skill-advisor-standards-alignment/` |
| `011-skill-advisor-hook-improvements/` | Feature Specification: Skill-Advisor Hook Improvements | 010/014 | Research Queued | `008-skill-advisor/011-skill-advisor-hook-improvements/` |
| `012-skill-advisor-setup-command/` | Feature Specification: Skill Advisor Setup Command | 026/008/012 | Implemented | `008-skill-advisor/012-skill-advisor-setup-command/` |

## Key Implementation Summaries

- **`001-search-and-routing-tuning/`**: This packet root was active in the 026 phase map, but its root identity lived only in `description.json`, `graph-metadata.json`, and the child folders. Without a root `spec.md`, canonical-save and validator flows could not treat the folder as a fully normal...
- **`002-skill-advisor-graph/`**: Added a structured graph metadata system to all 20 skill folders and integrated graph-derived relationship boosts into the skill advisor routing pipeline.
- **`003-advisor-phrase-booster-tailoring/`**: The skill advisor's multi-word phrase routing now actually works as designed. 24 tokenizer-broken entries that were silently sitting dead in `INTENT_BOOSTERS` — because the tokenizer `\b\w+\b` splits on whitespace before dict lookup — have been migrated to ...
- **`004-skill-advisor-docs-and-code-alignment/`**: Phase 022 brings the skill-advisor package into line with the hook surface that Phase 020 shipped. Operators now see prompt-time hook invocation as the primary Gate 2 path, still have the direct Python CLI documented as a fallback, and have a packet-local a...
- **`005-smart-router-remediation-and-opencode-plugin/`**: Phase 023 shipped all six work areas from the 021 smart-router research packet and added the OpenCode `spec-kit-skill-advisor` plugin. The packet fixes stale route resources, adds static router validation, tunes conservative ON_DEMAND routing keywords, repl...
- **`006-deferred-remediation-and-telemetry-run/`**: Phase 024 now has the measurement machinery that Phases 020-023 deferred: a static 200-prompt harness, an observe-only live-session wrapper, and a JSONL analyzer. The static report is deliberately honest: it measures predicted routes and advisor top-1 label...
- **`007-skill-advisor-hook-surface/`**: Cross-runtime proactive skill-advisor hook surface. Each `UserPromptSubmit` event in Claude, Gemini, Copilot, and Codex runtimes runs `buildSkillAdvisorBrief(prompt, {runtime})` and renders a typed `AdvisorHookResult` to the model with sanitized recommendation, freshness, confidence, and uncertainty fields.
- **`008-skill-graph-daemon-and-advisor-unification/`**: Phase 027 shipped a unified advisor architecture across seven child packets, moving durable advisor behavior into the system-spec-kit MCP server while preserving legacy Python and plugin caller compatibility. Covers daemon freshness, derived metadata, native scorer, MCP surface, and promotion gates.
- **`009-skill-advisor-plugin-hardening/`**: `.opencode/plugins/spec-kit-skill-advisor.js` now keeps all plugin runtime state inside a `SpecKitSkillAdvisorPlugin(ctx, opts)` closure with concurrent-cache-miss dedup, configurable prompt/brief/cache caps, eviction, and 30 focused Vitest cases.
- **`010-skill-advisor-standards-alignment/`**: Added the `opencode-plugin-exemption-tier` section to the JavaScript quality standards reference, scoped the plugin-loader ESM exemption to `.opencode/plugins/*` and `.opencode/plugin-helpers/*`, and updated `spec-kit-skill-advisor.js` with the structured header + JSDoc layout.
- **`011-skill-advisor-hook-improvements/`**: One explicit threshold contract across plugin defaults, native bridge routing, fallback routing, and operator-facing bridge metadata. OpenCode native bridge rendering flows through shared `renderAdvisorBrief(...)` invariants, Codex paths share the same builder, and `advisor_recommend`/`advisor_validate` accept explicit `workspaceRoot` with durable JSONL diagnostics.
- **`012-skill-advisor-setup-command/`**: New `/doctor:skill-advisor` slash command (auto + confirm YAML workflows) that interactively walks the AI through analyzing all skills, proposing optimized scoring tables (TOKEN_BOOSTS, PHRASE_BOOSTS, graph-metadata triggers, CATEGORY_HINTS), applying changes, re-indexing the skill graph, and validating with the advisor test suite. Paired with a user-facing install guide at `.opencode/install_guides/SET-UP - Skill Advisor.md`.

## Open Or Deferred Items

- **`001-search-and-routing-tuning/`**: status before consolidation was Planned; 0 unchecked task/checklist item(s) remain in the child packet docs.
- **`002-skill-advisor-graph/`**: status before consolidation was In Progress; 1 unchecked task/checklist item(s) remain in the child packet docs.
- **`003-advisor-phrase-booster-tailoring/`**: status before consolidation was Planned; 25 unchecked task/checklist item(s) remain in the child packet docs.
- **`004-skill-advisor-docs-and-code-alignment/`**: status before consolidation was Complete; 0 unchecked task/checklist item(s) remain in the child packet docs.
- **`005-smart-router-remediation-and-opencode-plugin/`**: status before consolidation was In Progress; 0 unchecked task/checklist item(s) remain in the child packet docs.
- **`006-deferred-remediation-and-telemetry-run/`**: status before consolidation was Partial; 1 unchecked task/checklist item(s) remain in the child packet docs.
- **`007-skill-advisor-hook-surface/`**: status before consolidation was In Progress; refer to the child packet for any unchecked items.
- **`008-skill-graph-daemon-and-advisor-unification/`**: status before consolidation was In Progress; refer to the child packet for any unchecked items.
- **`009-skill-advisor-plugin-hardening/`**: status before consolidation was Complete; refer to the child packet for any unchecked items.
- **`010-skill-advisor-standards-alignment/`**: status before consolidation was Complete; refer to the child packet for any unchecked items.
- **`011-skill-advisor-hook-improvements/`**: status before consolidation was Research Queued; refer to the child packet for any unchecked items.
- **`012-skill-advisor-setup-command/`**: created 2026-04-25; level 2; status Implemented; refer to the child packet for any unchecked items.

## Root Support References

The root `research/`, `review/`, and `scratch/` folders remain at `system-spec-kit/026-graph-and-context-optimization/`. Historical citations inside child packets intentionally remain local evidence unless this wrapper points to an active path.
