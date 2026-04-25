---
title: "Fe [system-spec-kit/026-graph-and-context-optimization/010-hook-parity/004-claude-hook-findings-remediation/spec]"
description: "Three findings from end-to-end Claude Code hook testing (SessionStart + UserPromptSubmit): (A) advisor freshness stuck in stale-loop because sourceSignature is null so the source/graph comparison never reconciles; (B) .claude/settings.local.json mixes Copilot-schema fields (bash, timeoutSec) with Claude-schema fields inside nested hook blocks, producing surplus hook invocations; (C) no documented multi-turn regression harness for hook testing, causing fresh-session cache-creation tax (~41K tokens = ~$0.17/run) when operators run the playbook."
trigger_phrases:
  - "claude hook findings"
  - "advisor freshness stuck stale"
  - "sourcesignature null"
  - "settings.local.json schema mismatch"
  - "copilot bash field in claude hooks"
  - "hook regression harness"
  - "multi-turn stream-json testing"
  - "026/009/006"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-hook-parity/004-claude-hook-findings-remediation"
    last_updated_at: "2026-04-23T13:55:57Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Implemented T004-T013; AS-003/AS-004 blocked"
    next_safe_action: "User review of spec/plan, then dispatch implementation"
    blockers: []
    key_files:
      - ".claude/settings.local.json"
      - ".opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness.ts"
      - ".opencode/skill/.advisor-state/skill-graph-generation.json"
      - ".opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook-validation.md"
    completion_pct: 86
    open_questions:
      - "Is skill-graph-generation.json sourceSignature null by design (not populated yet) or a bug in the scanner write path?"
      - "Is the outer 'bash'/'timeoutSec' block in settings.local.json dead weight or silently firing through an undocumented Claude Code path?"
    answered_questions:
      - "Three hooks fire per UserPromptSubmit event: confirmed via stream-json in session b06fd791 (hook_ids 3168e6e3, 1ad9485f, 4b14a8cd)"
      - "Disable flag works end-to-end: SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 returned {} and model replied 'NO ADVISOR BRIEF' in session 17e651f5"
      - "SessionStart brief and UserPromptSubmit advisor additionalContext both reach the model: session b06fd791 quoted both back verbatim"
      - "Fresh claude -p sessions cost ~$0.165 each due to 41313 tokens of cache-creation; continuation sessions cost ~$0.02"
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->"
---
# Feature Specification: Claude Hook Findings Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

End-to-end hook testing on 2026-04-23 (two real `claude -p` sessions + five direct hook-script smokes) surfaced three concrete findings. This packet remediates all three in a single focused pass.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-04-23 |
| **Branch** | `006-claude-hook-findings-remediation` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `../005-codex-hook-parity-remediation/spec.md` |
| **Successor** | `../007-opencode-plugin-loader-remediation/spec.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Hook testing surfaced three defects. (A) The skill-advisor freshness contract is split: `skill-graph-generation.json` reports `state: "live"` but every advisor probe returns `freshness: "stale"` with `errorCode: SOURCE_NEWER_THAN_SKILL_GRAPH` because `sourceSignature` is persisted as `null`, so the source/graph comparison has no anchor to reconcile against. Every advisor call pays the stale-fallback path. (B) `.claude/settings.local.json` UserPromptSubmit/SessionStart/PreCompact/Stop blocks use a nested structure where the outer object carries `bash`/`timeoutSec` (a Copilot CLI schema) and the inner `hooks` array carries Claude's documented `command`/`timeout`. Three hooks fire per UserPromptSubmit in practice; the duplicated invocations make hook behavior hard to reason about. (C) There is no documented multi-turn harness for the skill-advisor testing playbook — operators running the 17-test pack pay cache-creation (~$0.17) on every fresh `claude -p` invocation, ~5-10x what a single reused session would cost.

### Purpose
Restore a trustworthy advisor freshness contract, normalize Claude hook registration to the documented schema, and document a multi-turn regression harness so future hook testing is affordable and parity-checkable.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Investigate and fix the `sourceSignature: null` persistence so advisor freshness probes can resolve `live` after a successful `skill_graph_scan`.
- Normalize `.claude/settings.local.json` hook schema: remove unused outer `bash`/`timeoutSec` fields, keep exactly one Claude-schema hook per event, preserve GitKraken and SUPERSET integrations from user-level settings.
- Extend the skill-advisor manual testing playbook with a multi-turn `--input-format stream-json` harness section (cost-optimized regression pattern).

### Out of Scope
- Tuning advisor lane weights for "ambiguous" briefs — these are working as designed; the advisor honestly reports close scores and the threshold is correct.
- PreCompact → SessionStart:compact replay testing path — requires interactive session; will be covered in a separate phase if prioritized.
- Copilot CLI hook surface changes — Copilot has its own `$HOME/.copilot/copilot-instructions.md` managed block; not in scope here.
- User-global `~/.claude/settings.json` GitKraken hooks — not ours to modify.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness.ts` (or peer) | Modify | Ensure `sourceSignature` is persisted during graph scan so freshness probe can reconcile. |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/advisor-state.ts` (if applicable) | Modify | Write `sourceSignature` into `skill-graph-generation.json` when scan completes. |
| `.claude/settings.local.json` | Modify | Remove outer `bash`/`timeoutSec` fields; keep nested Claude-schema `hooks` array only. |
| `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook-validation.md` | Modify | Add §9 "Multi-turn regression harness" with `--input-format stream-json` pattern. |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/manual_testing_playbook.md` | Modify | Add cross-reference to §9 and cost-optimization callout. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Advisor freshness probe returns `live` after a successful `skill_graph_scan` with no intervening source changes. | Run `skill_graph_scan` → wait for completion → run direct advisor hook smoke with a work-intent prompt → confirm `freshness: "live"` in JSONL stderr (not `stale`). |
| REQ-002 | `sourceSignature` in `skill-graph-generation.json` is non-null after a successful scan. | After `skill_graph_scan` completes, `cat .opencode/skill/.advisor-state/skill-graph-generation.json` shows a non-null signature string. |
| REQ-003 | `.claude/settings.local.json` hook entries contain only Claude-documented schema fields (`type`, `command`, `timeout`, optional `matcher`, optional `hooks` array for nesting). | `jq` query against settings.local.json confirms no `bash` or `timeoutSec` fields at any nesting level. |
| REQ-004 | UserPromptSubmit fires exactly 2 hooks in a fresh `claude -p` session (Spec Kit claude hook + user-global GitKraken hook). | `claude -p "test" --output-format stream-json --include-hook-events` shows exactly 2 `hook_started` events for `UserPromptSubmit` (was 3). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Skill-advisor validation playbook documents a multi-turn stream-json harness. | New §9 in `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook-validation.md` with working `claude -p --input-format stream-json` example, stated cost reduction vs N one-shot sessions, and disable-flag note (env var cannot flip mid-session). |
| REQ-006 | Rollback path documented for the freshness-fix change. | `plan.md` §7 lists revert steps and a smoke command to confirm rollback leaves the system in its prior stale-but-functional state. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Direct advisor hook smoke for "help me commit my changes" returns `freshness: "live"` (was `stale`) after `skill_graph_scan`, with `status: "ok"` and no `SOURCE_NEWER_THAN_SKILL_GRAPH` errorDetails.
- **SC-002**: `jq '.hooks | keys[]' .claude/settings.local.json | xargs -I{} jq '.hooks.{}[].hooks | length' .claude/settings.local.json` confirms one entry per event; `jq 'recurse | objects | select(has("bash") or has("timeoutSec"))'` returns empty.
- **SC-003**: Fresh `claude -p` session stream-json shows `hook_started` for UserPromptSubmit = 2 (Spec Kit + GitKraken global); for SessionStart = 2; for Stop = 2.
- **SC-004**: Playbook §9 runnable end-to-end: one `claude -p --input-format stream-json < fixture.jsonl` run covers ≥5 advisor prompts at total cost ≤ $0.30 (verified via final `result` event's `total_cost_usd`).

### Acceptance Scenarios

**AS-001 — Freshness reconciles to live (REQ-001, REQ-002)**
- **Given** a completed `skill_graph_scan` with no intervening source changes
- **When** the direct advisor hook smoke fires with a work-intent prompt
- **Then** JSONL stderr reports `freshness: "live"` and `.opencode/skill/.advisor-state/skill-graph-generation.json` contains a non-null `sourceSignature`

**AS-002 — Schema is Claude-canonical (REQ-003)**
- **Given** the normalized `.claude/settings.local.json`
- **When** `jq 'recurse | objects | select(has("bash") or has("timeoutSec"))'` is run against it
- **Then** the result set is empty

**AS-003 — Hook count is 2 per event (REQ-004)**
- **Given** a fresh `claude -p` session with `--include-hook-events`
- **When** the stream-json output is filtered for `UserPromptSubmit` `hook_started` events
- **Then** exactly 2 distinct `hook_id` values appear (was 3 pre-fix)

**AS-004 — Playbook harness is runnable (REQ-005)**
- **Given** the new §9 fixture in `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook-validation.md`
- **When** an operator runs the example `claude -p --input-format stream-json < fixture.jsonl` with 5 advisor prompts
- **Then** the final `result` event reports `total_cost_usd ≤ 0.30` and all advisor prompts produce a recognizable `Advisor:` brief or a documented skip reason

**AS-005 — Disable flag still halts (negative case)**
- **Given** `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` is set in the environment
- **When** the direct advisor hook smoke fires with a work-intent prompt
- **Then** stdout is `{}` and JSONL reports `status: "skipped"` with `freshness: "unavailable"`
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Skill Advisor freshness module internals (not yet read in detail) | Med: fix location unknown until investigation task completes | Spike task T001 reads freshness.ts + advisor-state.ts before implementing T002 |
| Risk | Editing `.claude/settings.local.json` could break hooks for active sessions | Med | Create a local backup before edit; smoke via direct script invocation before trusting live session |
| Risk | `sourceSignature` null may be intentional (signature disabled) rather than a bug | Low | T001 investigation includes checking git log / ADR / commit history for any decision to leave it null |
| Risk | GitKraken global hook count assumption may be wrong | Low | REQ-004 verification is empirical via stream-json; adjust expected count if 2 isn't actual post-fix value |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Advisor hook duration p95 remains ≤ 50ms on cache hit after the freshness fix (baseline per validation playbook §5: cache-hit p95 = 0.016ms).
- **NFR-P02**: SessionStart prime output ≤ 1800ms (`HOOK_TIMEOUT_MS`); no regression from current ~1.5s observed.

### Reliability
- **NFR-R01**: Disable flag rollback (`SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1`) must continue to return `{}` and skip producer call — verified in REQ-004's smoke.
- **NFR-R02**: Hook fail-open rate ≤ 5% (per playbook §3 troubleshooting); fix must not push rate above threshold.

### Security
- **NFR-S01**: No raw prompt text introduced into diagnostics, JSONL, or metrics labels by the fix. Privacy audit (`advisor-privacy.vitest.ts`) must remain green.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- `skill-graph-generation.json` missing: freshness must return `absent`, advisor must fail open with `{}`.
- `sourceSignature` present but source files changed after: freshness returns `stale` with `SOURCE_NEWER_THAN_SKILL_GRAPH` — expected behavior, not a bug.
- `.claude/settings.local.json` missing entirely: hooks don't register, advisor runs through user-global path only.

### Error Scenarios
- Graph scan fails mid-write: `sourceSignature` should not be half-written; scan must be atomic (tmp-rename pattern already used in hook-state.ts at line 246).
- Multi-turn stream-json harness encounters budget cap: should emit `result` with `error_max_budget_usd` and exit cleanly (observed working: session e628acad).

### State Transitions
- During active development (source files churning): freshness will flap between `live` and `stale` depending on scan cadence. Expected; not a regression.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | 3-4 files, ~50-150 LOC modifications, single repo |
| Risk | 10/25 | Hook wiring and advisor state are both live-session surfaces; edits need smoke tests before trust |
| Research | 8/20 | Freshness internals unread; spike task required; rest is well-understood from testing evidence |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Is `sourceSignature: null` an unimplemented feature, a regression, or an intentional opt-out? Need to read `freshness.ts` + recent commits touching `.advisor-state/`.
- Should GitKraken hooks be counted in REQ-004's expected hook count, or are they unrelated noise to tolerate? (Currently counting them; revisit if user wants stricter isolation.)
- Do we want to add a test fixture (`tests/fixtures/claude-hook-parity.jsonl`) to lock in the expected hook count as a regression test, or keep verification manual?
<!-- /ANCHOR:questions -->

---
