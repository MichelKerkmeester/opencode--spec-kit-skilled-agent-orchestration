---
title: "Context Index: Search Routing Advisor"
description: "Bridge index for search/routing tuning, skill advisor graph, phrase boosters, and smart-router work after renumbering original phases inside the phase root."
trigger_phrases:
  - "006-search-routing-advisor"
  - "search/routing tuning, skill advisor graph, phrase boosters, and smart-router work"
  - "001-search-and-routing-tuning"
  - "002-skill-advisor-graph"
  - "003-advisor-phrase-booster-tailoring"
  - "004-smart-router-context-efficacy"
  - "005-skill-advisor-docs-and-code-alignment"
  - "006-smart-router-remediation-and-opencode-plugin"
  - "007-deferred-remediation-and-telemetry-run"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor"
    last_updated_at: "2026-04-21T13:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Renumbered nested phases"
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
# Context Index: Search Routing Advisor

<!-- SPECKIT_LEVEL: 1 -->

## Theme

Search/routing tuning, skill advisor graph, phrase boosters, and smart-router work. The original phase packets are direct child folders of this phase root.

## Child Phase Map

| Child Phase | Old Title | Status Before Consolidation | Current Path |
|-------------|-----------|-----------------------|--------------|
| `001-search-and-routing-tuning/` | Feature Specification: Search and Routing Tuning Coordination Parent | Planned | `006-search-routing-advisor/001-search-and-routing-tuning/` |
| `002-skill-advisor-graph/` | Feature Specification: Skill Advisor Graph | In Progress | `006-search-routing-advisor/002-skill-advisor-graph/` |
| `003-advisor-phrase-booster-tailoring/` | Feature Specification: Advisor Phrase-Booster Tailoring | Planned | `006-search-routing-advisor/003-advisor-phrase-booster-tailoring/` |
| `004-smart-router-context-efficacy/` | Feature Specification: Smart-Router Context-Load Efficacy Investigation | Research Dispatched | `006-search-routing-advisor/004-smart-router-context-efficacy/` |
| `005-skill-advisor-docs-and-code-alignment/` | Feature Specification: Skill-Advisor Docs + Phase 020 Code Alignment | Complete | `006-search-routing-advisor/005-skill-advisor-docs-and-code-alignment/` |
| `006-smart-router-remediation-and-opencode-plugin/` | Feature Specification: Smart-Router Remediation + OpenCode Plugin | In Progress | `006-search-routing-advisor/006-smart-router-remediation-and-opencode-plugin/` |
| `007-deferred-remediation-and-telemetry-run/` | Feature Specification: Deferred Remediation + Telemetry Measurement Run | Partial | `006-search-routing-advisor/007-deferred-remediation-and-telemetry-run/` |

## Key Implementation Summaries

- **`001-search-and-routing-tuning/`**: This packet root was active in the 026 phase map, but its root identity lived only in `description.json`, `graph-metadata.json`, and the child folders. Without a root `spec.md`, canonical-save and validator flows could not treat the folder as a fully normal...
- **`002-skill-advisor-graph/`**: Added a structured graph metadata system to all 20 skill folders and integrated graph-derived relationship boosts into the skill advisor routing pipeline.
- **`003-advisor-phrase-booster-tailoring/`**: The skill advisor's multi-word phrase routing now actually works as designed. 24 tokenizer-broken entries that were silently sitting dead in `INTENT_BOOSTERS` — because the tokenizer `\b\w+\b` splits on whitespace before dict lookup — have been migrated to ...
- **`004-smart-router-context-efficacy/`**: Phase 020 shipped a cross-runtime advisor hook surface that injects a brief (`Advisor: <state>; use <skill> <confidence>/<uncertainty>`) into every `UserPromptSubmit` event. The advisor's stated value proposition is that it steers the AI to the right skill ...
- **`005-skill-advisor-docs-and-code-alignment/`**: Phase 022 brings the skill-advisor package into line with the hook surface that Phase 020 shipped. Operators now see prompt-time hook invocation as the primary Gate 2 path, still have the direct Python CLI documented as a fallback, and have a packet-local a...
- **`006-smart-router-remediation-and-opencode-plugin/`**: Phase 023 shipped all six work areas from the 021 smart-router research packet and added the OpenCode `spec-kit-skill-advisor` plugin. The packet fixes stale route resources, adds static router validation, tunes conservative ON_DEMAND routing keywords, repl...
- **`007-deferred-remediation-and-telemetry-run/`**: Phase 024 now has the measurement machinery that Phases 020-023 deferred: a static 200-prompt harness, an observe-only live-session wrapper, and a JSONL analyzer. The static report is deliberately honest: it measures predicted routes and advisor top-1 label...

## Open Or Deferred Items

- **`001-search-and-routing-tuning/`**: status before consolidation was Planned; 0 unchecked task/checklist item(s) remain in the child packet docs.
- **`002-skill-advisor-graph/`**: status before consolidation was In Progress; 1 unchecked task/checklist item(s) remain in the child packet docs.
- **`003-advisor-phrase-booster-tailoring/`**: status before consolidation was Planned; 25 unchecked task/checklist item(s) remain in the child packet docs.
- **`004-smart-router-context-efficacy/`**: status before consolidation was Research Dispatched; 0 unchecked task/checklist item(s) remain in the child packet docs.
- **`005-skill-advisor-docs-and-code-alignment/`**: status before consolidation was Complete; 0 unchecked task/checklist item(s) remain in the child packet docs.
- **`006-smart-router-remediation-and-opencode-plugin/`**: status before consolidation was In Progress; 0 unchecked task/checklist item(s) remain in the child packet docs.
- **`007-deferred-remediation-and-telemetry-run/`**: status before consolidation was Partial; 1 unchecked task/checklist item(s) remain in the child packet docs.

## Root Support References

The root `research/`, `review/`, and `scratch/` folders remain at `system-spec-kit/026-graph-and-context-optimization/`. Historical citations inside child packets intentionally remain local evidence unless this wrapper points to an active path.
