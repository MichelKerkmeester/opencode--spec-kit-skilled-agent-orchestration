---
title: "Feature Specification: Deferred Remediation + Telemetry Measurement Run"
description: "Address the consolidated deferred items across Phases 020-023. Scope: (1) apply .codex settings + policy registration; (2) build static corpus measurement harness; (3) build live-session instrumentation wrapper; (4) run 019/004 corpus through harness and emit compliance report; (5) answer what can be answered without live AI (advisor top-1 accuracy, savings ceiling, predicted vs labeled)."
trigger_phrases:
  - "024 deferred remediation"
  - "telemetry measurement run"
  - "codex config registration"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/024-deferred-remediation-and-telemetry-run"
    last_updated_at: "2026-04-19T20:15:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Phase 024 scaffolded — closes 020/021/022/023 deferrals"
    next_safe_action: "Dispatch cli-codex gpt-5.4 high fast"
    dispatch_policy: "cli-codex gpt-5.4 high fast primary; cli-copilot gpt-5.4 high fallback"

---
# Feature Specification: Deferred Remediation + Telemetry Measurement Run

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

| Field | Value |
|-------|-------|
| **Parent Track** | 026-graph-and-context-optimization |
| **Predecessors** | 020, 021/001, 021/002, 022, 023 (all shipped) |

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 (close deferred items; enable measurement) |
| **Status** | Spec Ready |
| **Created** | 2026-04-19 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Six phases shipped with a consolidated list of deferred items:

**Phase 020 deferrals**: `.codex/settings.json` + `.codex/policy.json` registration files never written (codex sandbox blocked during 020/008 dispatch).

**Phase 021/001 prototype-later**: V4 miss-rate analysis + V7 SKILL.md-skip behavior — both need transcript-level telemetry.

**Phase 021/002 prototype-later**: V3 behavioral signal, V4 intent accuracy, V5 compliance gap, V9 enforcement decision — all need the same harness.

**Phase 023 Area E shipped the primitive** (`smart-router-telemetry.ts` with `recordSmartRouterCompliance`) but no actual measurement runs have been done.

### Purpose

Close what can be closed deterministically now: (a) apply .codex configs; (b) build a static corpus measurement harness that runs 200 prompts through the advisor + smart-router parsers; (c) emit a compliance/savings report; (d) ship a user-runnable live-session wrapper template so the user (or future session) can collect real transcript telemetry.

What we CANNOT close without live AI sessions: empirical proof that AIs skip SKILL.md reads or override low-confidence briefs. We ship the instrumentation so it's measurable; we do not claim measurement results.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (4 sub-tracks)

**Track 1 — .codex config registration**
- Create `.codex/settings.json` with hooks.UserPromptSubmit + hooks.PreToolUse entries per Phase 020/009 reference doc §3
- Create `.codex/policy.json` with an initial Bash denylist (conservative starter set: `rm -rf /`, `git push --force main`, `sudo shutdown`, etc.)
- Register the Codex runtime per 020/008 adapter spec
- Document in Phase 024's implementation-summary which snippets came from 020/009

**Track 2 — Static corpus measurement harness**
- Script: `scripts/observability/smart-router-measurement.ts`
- For each of 200 prompts in 019/004 corpus:
  - Run advisor via `buildSkillAdvisorBrief` in-process → capture top-1 skill + confidence
  - Parse the selected skill's SMART ROUTING section
  - Compute predicted route (intent scoring), allowed resources (ALWAYS + CONDITIONAL-matched + ON_DEMAND-matched)
  - Compare advisor top-1 vs corpus `skill_top_1` label
  - Record compliance prediction via Phase 023 Area E `recordSmartRouterCompliance`
- Emit aggregate JSONL: per-prompt results + per-skill summary
- Output a report: `smart-router-measurement-report.md` with: advisor accuracy vs corpus labels, ON_DEMAND hit rate per skill, predicted-resource distribution, projected savings distribution

**Track 3 — Live-session wrapper template**
- Script: `scripts/observability/live-session-wrapper.ts` (or `.sh`)
- Template the user can invoke inside a Claude Code / Codex / Gemini / Copilot session to:
  - Hook Read tool calls (or log from the advisor hook)
  - Emit `recordSmartRouterCompliance` per user prompt
  - Accumulate JSONL in `.opencode/skill/.smart-router-telemetry/`
- Provide documentation showing how a user enables this in their settings for each runtime
- No live execution in this phase — just the template + docs

**Track 4 — Telemetry analysis report generator**
- Script: `scripts/observability/smart-router-analyze.ts`
- Reads `.opencode/skill/.smart-router-telemetry/compliance.jsonl`
- Aggregates: per-skill compliance-class distribution, over/under-load ratios, ON_DEMAND trigger rate, advisor accuracy (if ground-truth available)
- Emits markdown report with decision-support data: "Should we enforce tier compliance? Based on N records, answer is..."

### Out of Scope

- Phase 020 hook surface changes
- Phase 021 research re-opening
- Live AI session execution (user must initiate; phase provides the wrapper)
- Empirical claims about AI behavior — we provide data collection, not conclusions

### Files to Change / Create

| File Path | Action | Track |
|-----------|--------|-------|
| `.codex/settings.json` | Create | 1 |
| `.codex/policy.json` | Create | 1 |
| `.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts` | Create | 2 |
| `.opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts` | Create | 3 |
| `.opencode/skill/system-spec-kit/scripts/observability/smart-router-analyze.ts` | Create | 4 |
| `.opencode/skill/system-spec-kit/mcp_server/tests/smart-router-measurement.vitest.ts` | Create | 2 tests |
| `.opencode/skill/system-spec-kit/mcp_server/tests/smart-router-analyze.vitest.ts` | Create | 4 tests |
| `scripts/observability/smart-router-measurement-report.md` | Create | 2 output |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### 4.1 P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Track 1: .codex registration shipped | Both files valid JSON; Codex hook path points to 020/008 adapter |
| REQ-002 | Track 2: measurement harness runs on full corpus | 200/200 prompts processed; report emitted |
| REQ-003 | Track 2: advisor accuracy reported vs corpus labels | Per-skill top-1 match rate computed |
| REQ-004 | Track 3: live-session wrapper template + per-runtime docs | Invocation instructions per runtime |
| REQ-005 | Track 4: analyzer generates compliance report from JSONL | Input: JSONL file; output: markdown report |
| REQ-006 | All new tests pass | Phase 020 118/118 still green; new tests pass |

### 4.2 P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | Report documents WHAT we measured vs WHAT we didn't | Honest methodology section |
| REQ-011 | Analyzer handles empty JSONL gracefully | Report says "no telemetry data yet; run live-session wrapper first" |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `.codex/settings.json` + `.codex/policy.json` exist and validate
- **SC-002**: Static measurement runs clean on 200-prompt corpus
- **SC-003**: Advisor vs corpus accuracy reported per-skill
- **SC-004**: Live-session wrapper template + per-runtime setup docs
- **SC-005**: Analyzer produces coherent report on empty + populated JSONL
- **SC-006**: 118/118 Phase 020 tests remain green; all new tests pass
- **SC-007**: validate.sh --strict clean on 024 folder
- **SC-008**: Honest reporting — no overclaiming empirical AI behavior

---

## RELATED DOCUMENTS

- Predecessors: `../020-skill-advisor-hook-surface/` through `../023-smart-router-remediation-and-opencode-plugin/`
- Research inputs:
  - `../021-smart-router-context-efficacy/001-initial-research/research/research.md` (V4/V7 open)
  - `../021-smart-router-context-efficacy/002-skill-md-intent-router-efficacy/research/research.md` (V3/V4/V5/V9 open)
- Reference doc: `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md`
- Telemetry primitive: `.opencode/skill/system-spec-kit/scripts/observability/smart-router-telemetry.ts` (023 Area E)
- Corpus: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-pt-03/corpus/labeled-prompts.jsonl`
