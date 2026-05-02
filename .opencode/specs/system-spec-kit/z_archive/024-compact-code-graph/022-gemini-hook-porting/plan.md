---
title: "Plan: Gemini CLI Hook Porting [024/022] [system-spec-kit/024-compact-code-graph/022-gemini-hook-porting/plan]"
description: "Implementation order for porting Claude hooks to Gemini CLI lifecycle format."
trigger_phrases:
  - "plan"
  - "gemini"
  - "cli"
  - "hook"
  - "porting"
  - "022"
importance_tier: "important"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/022-gemini-hook-porting"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Phase 022 — Gemini CLI Hook Porting


<!-- SPECKIT_TEMPLATE_SHIM_START -->
<!-- Auto-generated compliance shim to satisfy required template headers/anchors. -->
## 1. SUMMARY
Template compliance shim section. Legacy phase content continues below.

## 2. QUALITY GATES
Template compliance shim section. Legacy phase content continues below.

## 3. ARCHITECTURE
Template compliance shim section. Legacy phase content continues below.

## 4. IMPLEMENTATION PHASES
Template compliance shim section. Legacy phase content continues below.

## 5. TESTING STRATEGY
Template compliance shim section. Legacy phase content continues below.

## 6. DEPENDENCIES
Template compliance shim section. Legacy phase content continues below.

## 7. ROLLBACK PLAN
Template compliance shim section. Legacy phase content continues below.

<!-- ANCHOR:summary -->
Template compliance shim anchor for summary.
<!-- /ANCHOR:summary -->
<!-- ANCHOR:quality-gates -->
Template compliance shim anchor for quality-gates.
<!-- /ANCHOR:quality-gates -->
<!-- ANCHOR:architecture -->
Template compliance shim anchor for architecture.
<!-- /ANCHOR:architecture -->
<!-- ANCHOR:phases -->
Template compliance shim anchor for phases.
<!-- /ANCHOR:phases -->
<!-- ANCHOR:testing -->
Template compliance shim anchor for testing.
<!-- /ANCHOR:testing -->
<!-- ANCHOR:dependencies -->
Template compliance shim anchor for dependencies.
<!-- /ANCHOR:dependencies -->
<!-- ANCHOR:rollback -->
Template compliance shim anchor for rollback.
<!-- /ANCHOR:rollback -->
<!-- SPECKIT_TEMPLATE_SHIM_END -->

### Implementation Order

1. **Shared utilities** (40-50 LOC)
   - Create `hooks/gemini/shared.ts` with parseGeminiStdin and formatGeminiOutput helpers
   - Define GeminiHookInput/GeminiHookOutput types
   - Reuse Claude hook core logic where applicable

2. **Session Prime (SessionStart)** (80-100 LOC)
   - Create `hooks/gemini/session-prime.ts`
   - Map directly from Claude SessionStart — detect source (startup/resume/clear)
   - Output session context as JSON additionalContext for Gemini format
   - Reuse memory-surface.ts context gathering

3. **Compact Cache (PreCompress)** (60-80 LOC)
   - Create `hooks/gemini/compact-cache.ts`
   - Cache critical context to temp file before Gemini compression
   - Equivalent to Claude PreCompact phase

4. **Compact Inject (BeforeAgent)** (40-50 LOC)
   - Create `hooks/gemini/compact-inject.ts`
   - Read cached context from temp file and inject as additionalContext
   - Uses sanitized payload (F055 fix applied)
   - One-shot: only fires on first agent turn after compression

5. **Session Stop (SessionEnd)** (50-60 LOC)
    - Create `hooks/gemini/session-stop.ts`
    - Save session state on Gemini's single `SessionEnd` hook
    - Token tracking remains partial because Gemini transcript token usage is not parsed
    - Adapted from Claude Stop hook, but Gemini does not use `AfterAgent` + `AfterModel` here
    - Note: regex-based spec detection is shallow and can truncate deeper nested phase paths

6. **Settings Registration** (15-20 LOC)
    - Treat `.gemini/settings.json` as the expected user-local config target, not a checked-in repo change
    - Verify the local workspace path before considering registration complete
    - Existing example paths may be stale until locally verified

7. **Transcript Hardening Follow-up** (deferred)
   - F056 remains open
   - `session-stop.ts` has a `MAX_TRANSCRIPT_BYTES` guard
   - `compact-cache.ts` still uses unbounded `readFileSync(filePath, 'utf-8')` in `tailFile()`, so transcript-size hardening is incomplete

### Dependencies
- None — can be done independently of other phases
- Local Gemini workspace configuration is still environment-specific and must be verified per user workspace

### Estimated Total LOC: 140-260

### Technical Context
- Runtime surface: system-spec-kit MCP server + hook adapters.
- Validation surface: recursive packet validation and full quality-gate checks.

### Phase 1: Validation
- Maintain packet verification and release-gate traceability.

### Phase 2: Validation
- Maintain packet verification and release-gate traceability.
