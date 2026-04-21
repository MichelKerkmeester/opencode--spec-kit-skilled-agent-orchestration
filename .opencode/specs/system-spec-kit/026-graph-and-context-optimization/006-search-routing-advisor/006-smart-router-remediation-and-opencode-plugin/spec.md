---
title: "Feature Specification: Smart-Router Remediation + OpenCode Plugin"
description: "Act on all 6 recommendations from 021/002 Smart-Router research + build spec-kit-skill-advisor OpenCode plugin per 021/001 V8/V9. Scope: fix stale paths, tune ON_DEMAND keywords, replace CLI silent fallbacks, build CI check, ship observe-only telemetry harness, ship advisor plugin."
trigger_phrases:
  - "023 smart router remediation"
  - "spec-kit-skill-advisor plugin"
  - "smart router ci check"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/006-smart-router-remediation-and-opencode-plugin"
    last_updated_at: "2026-04-19T19:55:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Phase 023 scaffolded — acts on all 021/001+021/002 research recommendations"
    next_safe_action: "Dispatch cli-codex gpt-5.4 high fast"
    dispatch_policy: "cli-codex gpt-5.4 high fast primary; cli-copilot gpt-5.4 high fallback"

---
# Feature Specification: Smart-Router Remediation + OpenCode Plugin

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

| Field | Value |
|-------|-------|
| **Parent Track** | 026-graph-and-context-optimization |
| **Predecessors** | 021/001 (advisor-hook efficacy), 021/002 (skill-manifest smart-router efficacy) |

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 (research-driven remediations) |
| **Status** | Spec Ready |
| **Created** | 2026-04-19 |
| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Predecessor** | ../005-skill-advisor-docs-and-code-alignment/spec.md |
| **Successor** | ../007-deferred-remediation-and-telemetry-run/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Two research packets just shipped with 10+ concrete recommendations:
- **021/001** (advisor hook efficacy): V8 + V9 adopt-now → build `spec-kit-skill-advisor` OpenCode plugin using the `spec-kit-compact-code-graph.js` pattern.
- **021/002** (skill-manifest smart-router efficacy): 6 recommendations spanning stale paths, keyword tuning, fallback safety, CI check, observe-only harness.

None are being acted on. Without remediation, the smart-router pattern stays pure advisory, the OpenCode plugin surface is missing, and the 76.3% theoretical savings ceiling from 021/002 remains unrealized.

### Purpose

Ship all 6 recommendations + the OpenCode plugin in a single remediation packet. Executor: cli-codex gpt-5.4 high fast.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (5 work areas)

**Area A — Stale route paths**
- Fix `mcp-code-mode` SKILL.md router references pointing to nonexistent files
- Fix `sk-improve-agent` SKILL.md router references pointing to nonexistent files
- Add any other stale paths discovered during implementation

**Area B — ON_DEMAND keyword tuning**
- Per skill, analyze 019/004 200-prompt corpus for actual user phrasing
- Update ON_DEMAND keyword lists to reflect real prompt language
- Target: raise hit rate from 5.5% baseline toward 20%+ on common-case prompts

**Area C — CLI silent-fallback replacement**
- `cli-codex`, `cli-copilot`, `cli-gemini` skill manifests: replace silent `GENERATION` zero-score default with explicit `UNKNOWN_FALLBACK` + disambiguation checklist (pattern from non-CLI skills)
- `cli-claude-code` skill manifest: same for `DEEP_REASONING` default
- Preserve behavior when intents DO score — only change the zero-score path

**Area D — Static CI check**
- New script: `.opencode/skill/system-spec-kit/scripts/spec/check-smart-router.sh` (or similar)
- Validates: every route path exists on disk
- Reports: per-skill ALWAYS tier size + percentage of loadable resource tree (flag >50%)
- Wires into existing validate.sh or runs standalone

**Area E — Observe-only telemetry harness**
- New script: `.opencode/skill/system-spec-kit/scripts/observability/smart-router-telemetry.ts` (or similar language)
- Logs per-prompt: `{prompt_id, selected_skill, predicted_route, allowed_resources, actual_reads, compliance_class}`
- Compliance classes: `always`, `conditional_expected`, `on_demand_expected`, `extra`, `missing_expected`, `unknown_unparsed`
- Observe-only — NO enforcement in this phase

**Area F — OpenCode Plugin: spec-kit-skill-advisor**
- New `.opencode/plugins/spec-kit-skill-advisor.js` (default export plugin function)
- New `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs` (bridge process)
- Mirror `spec-kit-compact-code-graph.js` architecture: session cache, event-driven invalidation, prompt-safe status tool, cache TTL, thresholds
- Reuse Phase 020 producer + renderer (no format reinvention)
- Install flow: plugin auto-activates when placed in `.opencode/plugins/`; opt-out via `SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED=1` env OR `enabled: false` in plugin config
- Settings: `cacheTTLMs`, `thresholdConfidence`, `maxTokens`, `nodeBinaryOverride`, `bridgeTimeoutMs`
- Tests: unit tests for cache invalidation + status tool + opt-out behavior

### Out of Scope

- Enforcement of smart-router tiers (observe-only per Area E; enforcement is a follow-up phase)
- Changes to the Phase 020 hook surface producer/renderer/metrics
- Changes to skill_advisor.py (Python ranker)

### Files to Change / Create

| File Path | Action | Area |
|-----------|--------|------|
| `.opencode/skill/mcp-code-mode/SKILL.md` | Modify | A |
| `.opencode/skill/sk-improve-agent/SKILL.md` | Modify | A |
| `.opencode/skill/*/SKILL.md` (as needed) | Modify | A, B |
| `.opencode/skill/cli-codex/SKILL.md` | Modify | C |
| `.opencode/skill/cli-copilot/SKILL.md` | Modify | C |
| `.opencode/skill/cli-gemini/SKILL.md` | Modify | C |
| `.opencode/skill/cli-claude-code/SKILL.md` | Modify | C |
| `.opencode/skill/system-spec-kit/scripts/spec/check-smart-router.sh` | Create | D |
| `.opencode/skill/system-spec-kit/scripts/observability/smart-router-telemetry.*` | Create | E |
| `.opencode/plugins/spec-kit-skill-advisor.js` | Create | F |
| `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs` | Create | F |
| `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts` | Create | F |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### 4.1 P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Area A: stale paths fixed | Zero broken route paths per static CI check (Area D) |
| REQ-002 | Area B: ON_DEMAND tuned | Measurable hit-rate improvement on 019/004 corpus (target ≥ 15%) |
| REQ-003 | Area C: CLI fallbacks use UNKNOWN | All 4 CLI skills no longer silent-default to productive intent |
| REQ-004 | Area D: CI check exists + passes | Script catches stale paths + reports ALWAYS bloat |
| REQ-005 | Area E: Observe-only harness shipped | Script logs compliance data without enforcing |
| REQ-006 | Area F: OpenCode plugin shipped | Plugin + bridge + tests; opt-out verified |

### 4.2 P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | Plugin mirrors compact-code-graph pattern | Same architecture (bridge, cache, status tool) |
| REQ-011 | Plugin reuses Phase 020 producer/renderer | No format reinvention; imports from `mcp_server/lib/skill-advisor/` |
| REQ-012 | No runtime-code breakage | 118/118 Phase 020 tests + full test suite green |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 6 recommendations from 021/002 addressed
- **SC-002**: OpenCode plugin installed + bridge works + opt-out verified
- **SC-003**: ON_DEMAND hit rate on 200-prompt corpus ≥ 15% (up from 5.5% baseline)
- **SC-004**: Static CI check catches stale paths (verify by running pre-fix vs post-fix)
- **SC-005**: Observe-only harness produces valid compliance records
- **SC-006**: 118/118 Phase 020 tests green; tsc clean; validate.sh --strict clean
- **SC-007**: Plugin tests pass (unit tests for cache + status tool + opt-out)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 020 advisor dist output | Plugin bridge cannot load canonical producer/renderer | Use compiled dist path and fail open when unavailable |
| Dependency | 019 corpus | ON_DEMAND hit-rate measurement loses evidence | Use the committed JSONL corpus path from the spec |
| Risk | Router parser misses a pseudocode variant | Static checker may under-report stale paths | Support documented aliases and validate current skills with test-like local runs |
| Risk | Plugin exposes prompt text in status | Privacy regression | Status tool reports only configuration, cache, and health fields |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Plugin bridge timeout defaults to 1000ms and fails open.
- **NFR-P02**: Static checker should run from shell without requiring a TypeScript build.

### Security
- **NFR-S01**: Plugin status output must not contain raw prompts, stdout, stderr, secrets, or recommendations derived from prompt text.
- **NFR-S02**: Telemetry must record caller-supplied resource paths and compliance class without storing raw prompts.

### Reliability
- **NFR-R01**: Area D missing-path failures exit 1; bloat warnings exit 0.
- **NFR-R02**: Area F plugin opt-out must avoid bridge invocation through both env and config flags.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Acceptance Scenarios
- **Given** a router references a missing markdown file, **When** `check-smart-router.sh` runs, **Then** it exits 1 and names the missing path.
- **Given** a router has an ALWAYS tier larger than 50% of its loadable tree, **When** `check-smart-router.sh` runs, **Then** it emits a bloat warning but exits 0 if no paths are missing.
- **Given** a CLI skill has no matching route score, **When** its pseudocode fallback executes, **Then** it returns UNKNOWN and a disambiguation checklist instead of a productive intent.
- **Given** the plugin is disabled by env or config, **When** a user prompt arrives, **Then** no bridge process is invoked and no additional context is returned.

### Error Scenarios
- Bridge timeout: plugin returns no brief and status reflects fail-open health.
- Missing telemetry directory: recorder creates it before appending JSONL.
- Empty actual reads: telemetry classifies missing expected resources when allowed resources were predicted.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 22/25 | Six work areas touch skill docs, scripts, tests, and plugin code |
| Risk | 18/25 | Main risks are Phase 020 regression and prompt-safe plugin behavior |
| Research | 18/20 | Work is driven by 021/001 and 021/002 research packets |
| **Total** | **58/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None at implementation start. Runtime enforcement is intentionally deferred until telemetry data exists.
<!-- /ANCHOR:questions -->

---

### Related Documents

- Parent: `../../009-hook-daemon-parity/001-skill-advisor-hook-surface/` (shipped)
- Research inputs:
  - `../004-smart-router-context-efficacy/001-initial-research/research/research.md` (V8+V9 plugin recommendations)
  - `../004-smart-router-context-efficacy/002-skill-md-intent-router-efficacy/research/research.md` (6 smart-router recommendations)
- Reference plugin pattern: `.opencode/plugins/spec-kit-compact-code-graph.js` + `.mjs` bridge
- Phase 020 producer/renderer to reuse: `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/`
