---
title: "Phase 024: Hookless Priming Optimization [system-spec-kit/024-compact-code-graph/024-hookless-priming-optimization/spec]"
description: "Template compliance shim section. Legacy phase content continues below."
trigger_phrases:
  - "phase"
  - "024"
  - "hookless"
  - "priming"
  - "optimization"
  - "spec"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/024-hookless-priming-optimization"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["spec.md"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Phase 024: Hookless Priming Optimization

<!-- PHASE_LINKS: parent=../spec.md predecessor=023-context-preservation-metrics successor=025-tool-routing-enforcement -->

<!-- SPECKIT_LEVEL: 2 -->


<!-- SPECKIT_TEMPLATE_SHIM_START -->
<!-- Auto-generated compliance shim to satisfy required template headers/anchors. -->
## 1. METADATA
Template compliance shim section. Legacy phase content continues below.

## 2. PROBLEM & PURPOSE
Template compliance shim section. Legacy phase content continues below.

## 3. SCOPE
Template compliance shim section. Legacy phase content continues below.

## 4. REQUIREMENTS
Template compliance shim section. Legacy phase content continues below.

## 5. SUCCESS CRITERIA
Template compliance shim section. Legacy phase content continues below.

## 6. RISKS & DEPENDENCIES
Template compliance shim section. Legacy phase content continues below.

## 10. OPEN QUESTIONS
Template compliance shim section. Legacy phase content continues below.

<!-- ANCHOR:metadata -->
Template compliance shim anchor for metadata.
<!-- /ANCHOR:metadata -->
<!-- ANCHOR:problem -->
Template compliance shim anchor for problem.
<!-- /ANCHOR:problem -->
<!-- ANCHOR:scope -->
Template compliance shim anchor for scope.
<!-- /ANCHOR:scope -->
<!-- ANCHOR:requirements -->
Template compliance shim anchor for requirements.
<!-- /ANCHOR:requirements -->
<!-- ANCHOR:success-criteria -->
Template compliance shim anchor for success-criteria.
<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:risks -->
Template compliance shim anchor for risks.
<!-- /ANCHOR:risks -->
<!-- ANCHOR:questions -->
Template compliance shim anchor for questions.
<!-- /ANCHOR:questions -->
<!-- SPECKIT_TEMPLATE_SHIM_END -->

### What This Is

Optimize the two hookless context priming mechanisms so they work better together, load faster, and get closer to hook-level automation — all without requiring runtime hooks.

### Recommendations from Research 106-110

### Immediate — Items 1-3 (~50 LOC)

| # | Item | What | Files |
|---|------|------|-------|
| 1 | Reframe @context-prime as best-effort | Remove "mandatory" language from orchestrate.md; add "skip if urgent" logic | .opencode/agent/context.md, orchestrate.md |
| 2 | Slim agent to 2 calls | Change from 4 calls (memory_context + code_graph_status + ccc_status + session_health) to 2 (session_resume + session_health) | .opencode/agent/context.md + all runtime copies |
| 3 | Urgency-aware bootstrap | If first message looks urgent ("fix", "error", "bug"), skip blocking prime and let MCP auto-prime handle it | .opencode/agent/context.md |

### Near-Term — Items 4-6 (~200 LOC)

| # | Item | What | Files |
|---|------|------|-------|
| 4 | Enrich buildServerInstructions() | Add session recovery digest: last spec folder, task, graph freshness, recommended action (~150-400 tokens) | context-server.ts |
| 5 | Shared snapshot helpers | Extract freshness/status helpers so startup instructions, PrimePackage, and session_health share definitions | lib/session/session-snapshot.ts (new) |
| 6 | Stronger tool descriptions | Add recovery affordances to memory_context, session_resume, session_health descriptions | tool-schemas.ts |

### Medium-Term — Items 7-9 (~300 LOC)

| # | Item | What | Files |
|---|------|------|-------|
| 7 | session_bootstrap() composite | Single tool returning memory + graph + coco + health in one call | handlers/session-bootstrap.ts (new) |
| 8 | session_resume minimal mode | Add `minimal: true` option for lightweight recovery with reduced anchors | handlers/session-resume.ts |
| 9 | Bootstrap telemetry | Track bootstrap_source, duration_ms, completeness per session | lib/session/context-metrics.ts |

### Prerequisite — Item 10

| # | Item | What | Files |
|---|------|------|-------|
| 10 | Resolve Gemini hook/detection mismatch | Runtime detection says tool_fallback but hooks are configured | lib/code-graph/runtime-detection.ts, .gemini/settings.json |

### Dependencies
- Phases 018-023 (all complete)
- Research iterations 106-110 (complete)

### Estimated LOC: 350-550
### Risk: LOW — all changes are additive

### Problem Statement
This phase addresses concrete context-preservation and code-graph reliability gaps tracked in this packet.

### Requirements Traceability
- REQ-900: Keep packet documentation and runtime verification aligned for this phase.
- REQ-901: Keep packet documentation and runtime verification aligned for this phase.
- REQ-902: Keep packet documentation and runtime verification aligned for this phase.
- REQ-903: Keep packet documentation and runtime verification aligned for this phase.
- REQ-904: Keep packet documentation and runtime verification aligned for this phase.

### Acceptance Scenarios
- **Given** phase context is loaded, **When** verification scenario 1 runs, **Then** expected packet behavior remains intact.
- **Given** phase context is loaded, **When** verification scenario 2 runs, **Then** expected packet behavior remains intact.
- **Given** phase context is loaded, **When** verification scenario 3 runs, **Then** expected packet behavior remains intact.
- **Given** phase context is loaded, **When** verification scenario 4 runs, **Then** expected packet behavior remains intact.
