---
title: "Implementation Plan: Smart-Router Remediation + OpenCode Plugin"
description: "Implements the six research recommendations from 021/002 and the 021/001 V8/V9 OpenCode plugin proposal. The plan keeps Phase 020 runtime code unchanged while adding router validation, telemetry, plugin integration, tests, and phase documentation."
trigger_phrases:
  - "023 smart router remediation plan"
  - "spec-kit-skill-advisor plugin plan"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/023-smart-router-remediation-and-opencode-plugin"
    last_updated_at: "2026-04-19T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Initialized Phase 023 implementation plan"
    next_safe_action: "Execute Area A stale path remediation first, then Area D checker"
    blockers: []
    key_files:
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/023-smart-router-remediation-and-opencode-plugin/spec.md"
      - ".opencode/plugins/spec-kit-compact-code-graph.js"
      - ".opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts"
    completion_pct: 5
    open_questions: []
    answered_questions:
      - "Gate 3 spec folder was pre-approved by the user for the full packet."
---
# Implementation Plan: Smart-Router Remediation + OpenCode Plugin

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, Bash, TypeScript, JavaScript, Node.js |
| **Framework** | OpenCode plugin API, Vitest, Spec Kit Memory MCP server |
| **Storage** | JSONL telemetry under `.opencode/skill/.smart-router-telemetry/` |
| **Testing** | Vitest, `tsc --noEmit`, static router check, spec validation |

### Overview

Phase 023 turns the 021 smart-router research into concrete safeguards and a plugin. The work is ordered to reduce breakage: fix broken router paths first, add the static checker that proves path hygiene, tune conservative ON_DEMAND keywords from the corpus, replace unsafe CLI fallbacks, then add observe-only telemetry and the OpenCode advisor plugin.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented in `spec.md`
- [x] Success criteria measurable across Areas A-F
- [x] Required research and plugin/runtime reference files read before coding

### Definition of Done
- [ ] Area A stale paths fixed and Area D check exits 0 for missing paths
- [ ] Area B ON_DEMAND hit rate measured before and after with target >= 15%
- [ ] Area C updates all 4 CLI skills to UNKNOWN fallback
- [ ] Area E telemetry helper and tests pass
- [ ] Area F plugin, bridge, and tests pass
- [ ] Phase 020 tests remain green, `tsc --noEmit` is clean, and 023 validation is strict-clean
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Thin declarative-router remediation plus bridge-backed plugin. The plugin stays fail-open and does not import native MCP server modules into the OpenCode host process.

### Key Components
- **Smart-router skill manifests**: Correct routable paths, ON_DEMAND keywords, and CLI ambiguity behavior.
- **Static checker**: Bash CI utility that parses current router pseudocode variants and validates markdown route paths.
- **Telemetry harness**: TypeScript observe-only logger that classifies allowed resource reads without enforcing behavior.
- **Skill advisor plugin**: Default-export OpenCode plugin that invokes a Node bridge, caches per session, and surfaces prompt-safe status.
- **Bridge process**: Loads Phase 020 advisor producer and renderer from the compiled MCP server dist output and returns a bounded brief.

### Data Flow

User prompt enters OpenCode, the plugin checks opt-out flags, then invokes the bridge with prompt and settings. The bridge builds the Phase 020 advisor result, renders the prompt-safe brief, and returns JSON. The plugin caches that response by session and injects `additionalContext` while status tooling exposes only configuration and health metadata.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Documentation and Discovery
- [x] Create Level 2 plan/tasks/checklist scaffolding
- [ ] Scan all smart-routing skill manifests for routable markdown paths
- [ ] Measure baseline ON_DEMAND keyword hits on the 200-prompt corpus

### Phase 2: Remediation
- [ ] Fix stale route paths
- [ ] Add static checker
- [ ] Tune ON_DEMAND keywords conservatively
- [ ] Replace CLI silent fallbacks

### Phase 3: New Surfaces
- [ ] Add observe-only telemetry helper and tests
- [ ] Add OpenCode plugin and bridge
- [ ] Add plugin tests for cache, status, opt-out, and timeout behavior

### Phase 4: Verification
- [ ] Run static checker
- [ ] Run targeted and Phase 020 tests
- [ ] Run `tsc --noEmit`
- [ ] Run `validate.sh` on the 023 folder with `--strict`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static validation | Router path existence and ALWAYS bloat reporting | `check-smart-router.sh` |
| Unit | Telemetry classification and JSONL roundtrip | Vitest |
| Unit | Skill-advisor plugin cache/status/opt-out/timeout | Vitest |
| Regression | Phase 020 advisor and hook tests | Existing Vitest suite |
| Typecheck | TypeScript scripts and tests | `tsc --noEmit` |
| Spec validation | 023 documentation completeness | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 020 advisor producer and renderer | Internal | Green | Plugin cannot reuse canonical brief format |
| Compact code graph plugin pattern | Internal | Green | Plugin architecture would lack local precedent |
| 019 200-prompt corpus | Internal | Green | ON_DEMAND tuning cannot be measured |
| Vitest and TypeScript config | Internal | Green | Test and typecheck verification blocked |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Static checker fails on current tree, Phase 020 tests regress, plugin fails closed, or TypeScript cannot compile.
- **Procedure**: Revert the relevant Area A-F file set, rerun the same verification command that exposed the issue, and keep the 023 docs honest about the failing check.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Area A stale paths -> Area D static checker -> Area B keyword tuning
                                      \
                                       -> Area C fallback safety
Area E telemetry -----------------------> final verification
Area F plugin --------------------------/
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Area A | Required reads | Area D validation |
| Area D | Area A clean path state | Final static check |
| Area B | Corpus read and route parser understanding | Hit-rate acceptance |
| Area C | CLI skill reads | Fallback safety acceptance |
| Area E | Test harness conventions | Telemetry acceptance |
| Area F | Plugin pattern and Phase 020 dist imports | Plugin acceptance |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Documentation and discovery | Medium | 1 hour |
| Areas A-D router remediation | High | 3-5 hours |
| Area E telemetry | Medium | 1-2 hours |
| Area F plugin | High | 3-5 hours |
| Verification | High | 2-3 hours |
| **Total** | | **10-16 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Static checker reports no missing route paths
- [ ] Plugin can be disabled by env and config
- [ ] Telemetry remains observe-only

### Rollback Procedure
1. Disable the plugin with `SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED=1`.
2. Remove or revert Area E/F files if they cause verification failures.
3. Revert only the affected skill-manifest router edits if static validation indicates a bad path.
4. Rerun the failing test or validation command.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Delete generated telemetry JSONL if created locally; the telemetry directory is ignored.
<!-- /ANCHOR:enhanced-rollback -->
