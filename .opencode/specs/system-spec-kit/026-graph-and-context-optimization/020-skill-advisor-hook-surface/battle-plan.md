---
title: "Battle Plan: 020 Skill-Advisor Hook Surface Implementation Train"
description: "Sequenced delegation plan for implementing all 8 children (002-009), with executor assignments, per-child validation gates, parallelism rules, hard-gate enforcement (005), rollback playbook, and explicit release criteria. Target: 100% release readiness."
trigger_phrases:
  - "020 battle plan"
  - "020 delegation sequence"
  - "020 implementation train"
  - "020 release criteria"
importance_tier: "critical"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface"
    last_updated_at: "2026-04-19T12:00:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Battle plan authored"
    next_safe_action: "Execute T1 (dispatch 020/002 implement)"
    blockers: []

---
# Battle Plan: Phase 020 Implementation Train

## 0. Mission

Take Phase 020 (`skill-advisor-hook-surface`) from **patched + implementation-ready** state to **shipped + release-verified** across all 4 runtimes (Claude / Gemini / Copilot / Codex). Definition of "100% perfection" is the release criteria checklist in §9.

No architecture changes, no new research waves, no additional children. The 8-child decomposition is frozen. Every action below is either implementation, test, review, integration, or sign-off against an existing spec.

---

## 1. Preconditions (verified 2026-04-19T11:45:00Z)

| Precondition | State |
|--------------|-------|
| Wave-1 research (cli-codex gpt-5.4 high fast, 10 iter) | Converged |
| Wave-2 extended research (cli-copilot gpt-5.4 high, 10 iter) | Converged |
| Wave-3 validation research (cli-copilot gpt-5.4 high, 13/20 iter) | Converged |
| 8 child packets scaffolded (002-009) | Done, metadata generated |
| Wave-3 P0 patch (005 impossible cache-hit gate) | Landed in commit `f37b9253b` |
| Wave-3 P1 patches (9 items across 003/004/005/007/008/009) | Landed in commit `f37b9253b` |
| `validate.sh --strict` on all 6 patched children | 0 errors |
| 019/004 200-prompt corpus | Present at `research/019-system-hardening-pt-03/corpus/labeled-prompts.jsonl` |
| Executor policy | cli-codex gpt-5.4 high fast (primary); cli-copilot gpt-5.4 high (fallback) |

If any row above is not true when resuming this plan, **STOP** and re-validate before dispatching any campaign below.

---

## 2. Critical Path (ASCII Gantt)

```
Time ─────────────────────────────────────────────────────────────────────►

T1  [002 contract]────►
                      │
T2                    └►[003 freshness]────►
                                            │
T3                                          └►[004 producer]────►
                                                                 │
T4                                                               └►[005 HARD GATE]────┐
                                                                                       │
T5                                                                                     └►[006 Claude]────┐
                                                                                                          │
T6,T7                                                                                                     ├►[007 Gemini+Copilot] ──┐
                                                                                                          └►[008 Codex]           ──┤
                                                                                                                                     │
T8                                                                                                                                   └►[009 docs + release]
                                                                                                                                                          │
T9                                                                                                                                                        └►[final integration + release prep]
                                                                                                                                                                                                │
T10                                                                                                                                                                                             └►[release sign-off]

```

Dependency rules:
- **Serial**: T1 → T2 → T3 → T4 → T5 (cannot start next until predecessor's sign-off criteria met)
- **Hard gate at T4**: runtime-adapter campaigns (T5/T6/T7) MUST NOT dispatch before 005 converges with all P0 checklist items checked
- **Parallel**: T6 (007 Gemini+Copilot) and T7 (008 Codex) can run concurrently after T5 lands, subject to shared-file coordination rules in §6
- **Final close**: T8 (009 docs) drafts can begin after T3 converges but final polish happens after T6+T7; sign-off at T9 requires all 8 children green

Estimated wall-clock (optimistic → realistic):
- T1 — T4: 4-7 days serial
- T5 — T7: 2-4 days (with T6/T7 parallel)
- T8 — T10: 1-2 days
- **Total: 7-13 days** (matches wave-1 §Implementation Cluster Decomposition)

---

## 3. Per-Child Campaign Template

Each campaign below follows this 6-phase template. Where a child has unique rules (e.g., 005's hard gate), those are called out in that child's section.

### Phase A — Pre-flight (≤ 5 min)

Before dispatching, manual check:
```
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/<child-folder> \
  --strict --no-recursive
```
Must return 0 errors. Warnings from RELATED DOCUMENTS / implementation-summary baseline are expected and acceptable.

Also verify: predecessor child's `checklist.md` has every P0 item marked `[x]` with evidence. If predecessor isn't signed off, do not dispatch.

### Phase B — Implementation dispatch

**Primary:**
```
/spec_kit:implement :auto "Implement 020/<child-folder> per spec.md/plan.md/tasks.md" \
  --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast \
  --spec-folder=.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/<child-folder>
```

**Fallback** (if cli-codex fails mid-run or exhausts budget):
```
/spec_kit:implement :auto "Resume 020/<child-folder> implementation" \
  --executor=cli-copilot --model=gpt-5.4 --reasoning-effort=high \
  --spec-folder=.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/<child-folder>
```

Note: cli-copilot does not accept `--service-tier` via CLI; the copilot runtime uses its own default. Do not pass the flag.

### Phase C — Local validation (automated post-implementation)

The `/spec_kit:implement :auto` workflow already runs these internally. This phase confirms they passed:

1. `tsc --noEmit` clean across `mcp_server/`
2. All new vitest suites added by the child pass (see child's tasks.md for exact suite names)
3. `bash validate.sh --strict --no-recursive` on the child — 0 errors
4. `checklist.md` updated with evidence links

If any sub-step fails, `/spec_kit:implement :auto` halts with a diagnostic. Investigate the failure, patch, and redispatch the workflow on the same child.

### Phase D — Deep review (autonomous quality audit)

After implementation converges, dispatch an **autonomous deep-review pass** (one per child):
```
/spec_kit:deep-review :auto "Review 020/<child-folder> implementation against spec.md requirements; surface P0/P1/P2 findings across security/correctness/maintainability/observability dimensions" \
  --executor=cli-copilot --model=gpt-5.4 --reasoning-effort=high \
  --max-iterations=10 --convergence=0.05 \
  --spec-folder=.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/<child-folder>
```

Why cli-copilot here (not cli-codex): review benefits from a different executor than implementation — catches blind spots. cli-codex implements; cli-copilot reviews. This is the opposite of the wave-1/wave-2 pairing and gives a genuine cross-tool audit.

Deep-review convergence target: rolling avg new-finding ratio < 0.05 over last 3 iterations. Early convergence (≤ 7 iterations) is acceptable if all P0/P1 categories are covered.

If deep-review surfaces:
- **P0 findings**: fix before sign-off; redispatch `/spec_kit:implement :auto` on the child with patch scope
- **P1 findings**: decide per-finding — fix now if < 2 hr of work, or log in a deferred-followups markdown file at packet root with target window
- **P2 findings**: log only; do not block sign-off

### Phase E — Integration check

For children that expose cross-cutting contracts (002, 004, 005), run the relevant integration tests after deep review clears:

- **002**: `advisor-envelope-*.vitest.ts` (shared-payload contract) + manual grep `grep -r "producer: 'advisor'"` in `mcp_server/lib/` to confirm envelope creation is centralized
- **004**: `advisor-brief-producer.vitest.ts` + `advisor-prompt-cache.vitest.ts` + subprocess smoke (real `skill_advisor.py` invocation with 3 canonical prompts)
- **005**: full 4-lane timing harness + 200-prompt corpus parity + observability integration test against real metric emission
- **006/007/008**: `advisor-runtime-parity.vitest.ts` expanded to include the new adapter (4 runtimes × 5+ fixtures)

### Phase F — Sign-off

Sign-off criteria for each child:
1. ☑ `checklist.md` every P0 item checked with evidence citation
2. ☑ `implementation-summary.md` populated post-impl (table: Files Changed, bench numbers, known limitations)
3. ☑ `_memory.continuity` frontmatter updated (`recent_action`, `next_safe_action`, `blockers: []`)
4. ☑ Git commit lands on main with Conventional Commits message (`feat(020/<N>): ...`)
5. ☑ 020 parent `implementation-summary.md` Dispatch Log + Children Convergence Log updated
6. ☑ No open P0/P1 from deep-review

Once all 6 criteria are true, the child is **signed off** and the next campaign can dispatch.

---

## 4. Campaign T1 — Child 002 (shared-payload advisor contract)

**Scope:** Extend `createSharedPayloadEnvelope()` with advisor producer + source enum + `AdvisorEnvelopeMetadata` whitelist. Transport tests.

**Predecessor**: None (first in chain).
**Blocker risk**: Low — pure TypeScript types + unit tests; no subprocess, no filesystem, no runtime integration.
**Effort**: 0.5-1 day.

### Dispatch

```
/spec_kit:implement :auto "Implement 020/002-shared-payload-advisor-contract per spec.md/plan.md/tasks.md" \
  --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast \
  --spec-folder=.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/002-shared-payload-advisor-contract
```

### Validation gate (Phase C + D)

- `mcp_server/tests/advisor-envelope.vitest.ts` green
- `tsc --noEmit` clean
- Deep-review: no P0 findings; zero free-text fields pass the advisor metadata schema

### Sign-off artifact

Commit message: `feat(020/002): shared-payload advisor contract + envelope typing`

---

## 5. Campaign T2 — Child 003 (advisor freshness + source cache)

**Scope:** `getAdvisorFreshness()` + `AdvisorFreshnessResult` + per-skill fingerprints + generation counter + 15-min source cache. Plus wave-3 P1: malformed `generation.json` recovery path.

**Predecessor**: 002 must be signed off (envelope types are imported).
**Blocker risk**: Medium — file-atomic write + concurrency + fallback branches.
**Effort**: 0.75-1.25 days.

### Dispatch

```
/spec_kit:implement :auto "Implement 020/003-advisor-freshness-and-source-cache per spec.md/plan.md/tasks.md including wave-3 P1 generation.json malformed recovery (REQ-013/014, AS9/AS10)" \
  --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast \
  --spec-folder=.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/003-advisor-freshness-and-source-cache
```

### Validation gate

- `advisor-freshness.vitest.ts` all 10 acceptance scenarios green (including AS9/AS10 for corrupt-counter recovery)
- Corrupt-counter read-only FS test: probe returns `state: "unavailable"` + `GENERATION_COUNTER_CORRUPT`
- Benchmark: cold probe p95 ≤ 200 ms, warm probe p95 ≤ 30 ms — recorded in implementation-summary.md

### Sign-off artifact

Commit: `feat(020/003): advisor freshness + source cache + generation.json recovery`

---

## 6. Campaign T3 — Child 004 (advisor brief producer + cache + fail-open)

**Scope:** `buildSkillAdvisorBrief()` orchestration + prompt policy + HMAC exact cache + 5-min TTL + subprocess invocation + token caps (80/120) + fail-open error table. Plus wave-3 P1: remove `semanticModeEnabled`, remove 60-token-floor, pin non-live freshness behavior.

**Predecessor**: 002 + 003 signed off.
**Blocker risk**: High — subprocess timeouts + cache invalidation + fail-open orchestration. Also: most spec-surface changes from wave-3 P1 land here; implementers need to read the non-live posture table carefully.
**Effort**: 1.25-2 days.

### Dispatch

```
/spec_kit:implement :auto "Implement 020/004-advisor-brief-producer-cache-policy per spec.md/plan.md/tasks.md. Wave-3 P1 scope: SkillAdvisorBriefOptions does NOT include semanticModeEnabled; token caps are 80 default / 120 ambiguity (no 60-token floor); non-live freshness branches map per §3 posture table" \
  --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast \
  --spec-folder=.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/004-advisor-brief-producer-cache-policy
```

### Validation gate

- 4 vitest suites green (producer, prompt-policy, prompt-cache, subprocess)
- Every row in non-live posture table covered by a dedicated unit test
- Warm cache hit p95 ≤ 10 ms (producer only, excl. subprocess)
- Privacy test: no raw prompt substring in any serialized state
- grep: `semanticModeEnabled` does not appear in `mcp_server/lib/skill-advisor/`
- grep: no code path enforces 60-token floor

### Sign-off artifact

Commit: `feat(020/004): buildSkillAdvisorBrief producer + HMAC cache + fail-open contract`

---

## 7. Campaign T4 — Child 005 (renderer + 200-prompt harness) **HARD GATE**

**Scope:** Pure `renderAdvisorBrief()` + Unicode label sanitization + 10 fixtures (7 baseline + 3 wave-3 additions) + 200-prompt parity harness + 4-lane timing harness + observability contract + privacy audit.

**Predecessor**: 002 + 003 + 004 signed off.
**Blocker risk**: Very high — this is the hard gate for everything downstream. Four separate hard gates inside one child:
  1. Renderer purity + sanitization correctness
  2. 200/200 corpus parity (top-1 match)
  3. Cache-hit lane p95 ≤ 50 ms + cache hit rate ≥ 60% on corrected 10u+20r replay
  4. Observability contract + privacy audit

**Effort**: 1-2.25 days.

### Dispatch

```
/spec_kit:implement :auto "Implement 020/005-advisor-renderer-and-regression-harness per spec.md/plan.md/tasks.md. CRITICAL: the replay gate uses the corrected trace of 10 unique prompts + 20 repeats = 20/30 = 66.7% hits nominal (do NOT use the old impossible 20u+10r trace). Latency gate is cache-hit-lane-only; cold/warm/miss lanes are measured but NOT hard-gated. Include all 10 fixtures (baseline + skipPolicyEmptyPrompt + skipPolicyCommandOnly + promptPoisoningAdversarial). Observability contract is exact per §3.6 (metric table, JSONL schema, alert thresholds)" \
  --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast \
  --spec-folder=.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/005-advisor-renderer-and-regression-harness
```

### Hard-gate go/no-go decision matrix

Every row must be **GO** before 005 is signed off. A single NO-GO blocks all downstream campaigns (T5-T7).

| Gate | GO criterion | NO-GO action |
|------|--------------|--------------|
| Renderer purity | `advisor-renderer.vitest.ts` 10/10 green; grep confirms no I/O in `render.ts` | Patch renderer; redispatch implement |
| Label sanitization | `unicodeInstructionalSkillLabel` + `promptPoisoningAdversarial` fixtures → `null` brief | Tighten sanitizer denylist; redispatch |
| 200-prompt parity | 200/200 top-1 match between hook path and direct CLI | Investigate per-prompt deltas; patch producer or corpus; redispatch |
| Cache-hit lane p95 | ≤ 50 ms across 50 invocations | Profile cache path; investigate HMAC hot-spot; redispatch with perf fix |
| Replay cache hit rate | ≥ 60% on corrected 10u+20r trace | Investigate cache invalidation frequency; check for source-signature thrash; patch |
| Observability contract | All metric names + label tuples match §3.6; JSONL schema validated | Patch `metrics.ts`; add missing labels; redispatch |
| Privacy audit | No raw prompt substring in any serialized surface (envelope, metrics, stderr, session_health, cache) | Fix the leak; redispatch |

### Deep-review dispatch (Phase D for 005 — stronger than default)

005 warrants **two** deep-review passes (not one), because of its hard-gate status:

**Pass 1** — security + correctness:
```
/spec_kit:deep-review :auto "Review 005 implementation focusing on: (a) renderer purity (no side effects, deterministic output), (b) label sanitization completeness (canonical-fold + single-line + instruction-regex + label-denylist), (c) privacy audit (no raw prompt in any serialized surface), (d) cache-key derivation correctness (HMAC, source signature, runtime, threshold config), (e) 200-prompt corpus parity edge cases (whitespace-only prompts, Unicode edge cases, commands)" \
  --executor=cli-copilot --model=gpt-5.4 --reasoning-effort=high \
  --max-iterations=10 --convergence=0.05 \
  --spec-folder=.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/005-advisor-renderer-and-regression-harness
```

**Pass 2** — performance + observability:
```
/spec_kit:deep-review :auto "Review 005 implementation focusing on: (a) timing-harness methodology correctness (50 invocations per lane, p50/p95/p99 calculation, warm-up handling), (b) corrected 10u+20r replay pattern (verify 66.7% nominal hit rate, no off-by-one in pattern generation), (c) observability metric emission correctness (label cardinality, closed-enum enforcement, alert threshold configurability via env), (d) JSONL diagnostic schema (no forbidden fields, exact ISO 8601 timestamp), (e) cold/warm/miss lane measurement honesty (these are diagnostic only, not hard-gated — verify harness does not accidentally gate on them)" \
  --executor=cli-gemini --model=gemini-3.1-pro-preview \
  --max-iterations=10 --convergence=0.05 \
  --spec-folder=.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/005-advisor-renderer-and-regression-harness
```

Two executors (copilot + gemini) = maximum cross-tool coverage on the gate.

### Sign-off artifact

Commit: `feat(020/005): renderer + 200-prompt harness + observability + privacy audit [HARD GATE]`

Additional sign-off requirement: add a row to 020/implementation-summary.md `Children Convergence Log` marking 005 as **GATE LIFTED**. Downstream campaigns (T5+) cannot dispatch until this row appears.

---

## 8. Campaign T5 — Child 006 (Claude hook wiring)

**Scope:** `hooks/claude/user-prompt-submit.ts` adapter using Claude `UserPromptSubmit` event + JSON `hookSpecificOutput.additionalContext`.

**Predecessor**: 005 hard gate lifted.
**Blocker risk**: Low-medium — reuses 005's renderer + comparator; thin adapter.
**Effort**: 0.75-1.25 days.

### Dispatch

```
/spec_kit:implement :auto "Implement 020/006-claude-hook-wiring per spec.md/plan.md/tasks.md" \
  --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast \
  --spec-folder=.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/006-claude-hook-wiring
```

### Validation gate

- `claude-user-prompt-submit-hook.vitest.ts` green
- Fixture snapshot matches wave-2 documented Claude payload shape
- Manual smoke test: real Claude session with a live-passing prompt → brief appears

### Sign-off artifact

Commit: `feat(020/006): Claude UserPromptSubmit advisor adapter`

---

## 9. Campaigns T6 + T7 — Parallel runtime expansion (007 Gemini+Copilot, 008 Codex)

After T5 lands, T6 and T7 **may run in parallel**. Both depend on 006's parity baseline but not on each other's implementation; they do share one test file (`advisor-runtime-parity.vitest.ts`).

### Coordination rules (critical for parallel execution)

- `advisor-runtime-parity.vitest.ts` is owned by 007; 008 **extends** it to include Codex as 4th runtime
- If 008 lands first: 008 must extend the (pre-007) 3-runtime version of the file and 007 must rebase the final 4-runtime version
- If 007 lands first: 008 extends cleanly
- **Recommended**: dispatch T6 (007) first, let it converge, then dispatch T7 (008) — avoids merge complexity. The "parallel" framing in wave-1 was a resource-parallelism claim; file ownership is still serial on the parity file
- Runtime registration files are disjoint (`.gemini/settings.json` vs `.codex/settings.json` vs Copilot runtime config) — no coordination needed for those

### T6 dispatch (007 Gemini + Copilot)

```
/spec_kit:implement :auto "Implement 020/007-gemini-copilot-hook-wiring per spec.md/plan.md/tasks.md. Wave-3 P1 scope: Copilot SDK proof IS A MERGE GATE — commit a runtime-capture fixture proving onUserPromptSubmitted return-object path lands model-visible text; wrapper-fallback-only ship is not acceptable. Include Gemini schema-version fixture matrix (≥ v1 + v2). Implement brief:null no-emit rule per runtime. Wrapper-fallback rewritten prompt lives only in memory; never logged or persisted" \
  --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast \
  --spec-folder=.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/007-gemini-copilot-hook-wiring
```

### T7 dispatch (008 Codex) — after 007 converges

```
/spec_kit:implement :auto "Implement 020/008-codex-integration-and-hook-policy per spec.md/plan.md/tasks.md. Wave-3 P1 scope: include PostToolUse audit/repair slice (non-enforcement; §3.5); implement stdin-vs-argv precedence rule (stdin wins when both present; §3.6); replace hard-coded hookPolicy:'unavailable' with dynamic detector. Bash-only PreToolUse deny stays narrow. Extend advisor-runtime-parity.vitest.ts to 4 runtimes" \
  --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast \
  --spec-folder=.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/008-codex-integration-and-hook-policy
```

### Validation gate (T6 + T7)

- All 3 new adapter test files green (gemini, copilot, codex)
- `advisor-runtime-parity.vitest.ts` — 5 fixtures × 4 runtimes = 20 assertions, all identical text after normalization
- Gemini schema matrix — both v1 + v2 fixtures produce correct adapter output
- Copilot SDK capture fixture committed (proves the SDK path, not just wrapper fallback)
- Codex `hookPolicy` dynamic detector: grep for hard-coded `"unavailable"` literal → 0 results
- Codex stdin-vs-argv precedence: 4 unit tests (stdin-only, argv-only, both-stdin-wins, both-stdin-unparseable-still-fails-open)

### Sign-off artifacts

Commits (in order):
1. `feat(020/007): Gemini + Copilot advisor hooks with SDK merge gate`
2. `feat(020/008): Codex integration + dynamic hook policy + PostToolUse slice`

---

## 10. Campaign T8 — Child 009 (documentation + release contract)

**Scope:** Reference doc (skill-advisor-hook.md, to be created under references/hooks/) + validation playbook (skill-advisor-hook-validation.md, same folder) + troubleshooting section + prompt-artifact privacy contract + CLAUDE.md §Gate 2 updates + cross-runtime READMEs + release checklist execution.

**Predecessor**: 006 + 007 + 008 all signed off.
**Blocker risk**: Low — doc-only, but thorough.
**Effort**: 0.5-1 day.

### Dispatch

```
/spec_kit:implement :auto "Implement 020/009-documentation-and-release-contract per spec.md/plan.md/tasks.md. Create skill-advisor-hook.md (11 sections) + skill-advisor-hook-validation.md (8 manual steps) + troubleshooting table (5 top symptoms). Update CLAUDE.md §Gate 2. Update 4 cross-runtime READMEs. Populate 020 parent Release Prep checklist with evidence links" \
  --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast \
  --spec-folder=.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/009-documentation-and-release-contract
```

Alternate executor (doc-heavy work): **cli-claude-code with Opus 4.7** may be preferred for documentation quality. If cli-codex's output needs polish, re-dispatch with:
```
/spec_kit:implement :auto "Polish 020/009 reference doc for DQI ≥ 0.85 via sk-doc" \
  --executor=cli-claude-code --model=claude-opus-4-7 --effort=high \
  --spec-folder=.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/009-documentation-and-release-contract
```

### Validation gate

- Reference doc exists at path: .opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md — all 11 sections per §3.1 list
- Validation playbook exists at path: .opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook-validation.md — 8 steps
- sk-doc DQI validator ≥ 0.85 on both docs
- CLAUDE.md §Gate 2 references hook as primary
- 020 parent `implementation-summary.md` Release Prep section has every item `[x]` with evidence link
- Disable flag tested: `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` + manual smoke in each runtime → no advisor output

### Sign-off artifact

Commit: `feat(020/009): hook-surface documentation + release contract + validation playbook`

---

## 11. Campaign T9 — Final integration + release prep

After all 8 children are signed off individually, run the integration gauntlet:

### Automated checks

1. **Full test suite** at `mcp_server/`:
   ```
   cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run
   ```
   Expect: 0 failures, full coverage of new advisor code paths.

2. **TypeScript clean**:
   ```
   cd .opencode/skill/system-spec-kit && npx tsc --noEmit
   ```
   Expect: 0 errors.

3. **Parent validation (recursive)**:
   ```
   bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh \
     .opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface \
     --strict
   ```
   Expect: 0 errors across all 8 children + parent.

4. **200-prompt corpus parity (end-to-end)**: re-run `advisor-corpus-parity.vitest.ts` from a cold start (`rm -rf mcp_server/node_modules/.cache` first) to catch cache-dependent regressions.

### Manual smoke (mandatory per runtime)

For each of Claude / Gemini / Copilot / Codex:
- Start a session with advisor hook enabled
- Submit 3 canonical prompts: (a) clear work-intent ("refactor the auth middleware"), (b) short casual ("thanks"), (c) command-only ("/help")
- Verify: (a) brief appears with live/stale wording; (b) no brief (skip); (c) no brief (skip)
- Set `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1`, repeat — verify no brief appears for any prompt
- Unset the flag, verify briefs return

### Memory save + graph refresh

After T9 passes all checks:
```
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface","sessionSummary":"Phase 020 shipped: 8 children converged, all runtime adapters green, 200/200 corpus parity, hard gate lifted, release documentation published"}'
```

---

## 12. Campaign T10 — Release sign-off

Final gate. Every row must be `[x]` with evidence.

### Release checklist

- [ ] All 8 children have `[x]` across every P0 item in their `checklist.md`
- [ ] Cross-runtime parity: 4 runtimes × 5+ fixtures = identical `additionalContext` string per fixture (`advisor-runtime-parity.vitest.ts` green)
- [ ] 019/004 200-prompt corpus: 200/200 top-1 parity (owned by 005; re-verified in T9)
- [ ] Cache hit lane p95 ≤ 50 ms + cache hit rate ≥ 60% on 10u+20r replay (owned by 005; re-verified in T9)
- [ ] Disable flag verified: `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` stops all adapter work across all 4 runtimes
- [ ] Documentation published: reference doc (skill-advisor-hook.md) + validation playbook (skill-advisor-hook-validation.md) exist under references/hooks/ and pass DQI ≥ 0.85
- [ ] CLAUDE.md §Gate 2 references hook as primary path
- [ ] 4 runtime READMEs updated (or noted as absent where N/A)
- [ ] `generate-context.js` re-run on 020 parent → description.json + graph-metadata.json refreshed
- [ ] 020 `implementation-summary.md` continuity frontmatter: `blockers: []`, `recent_action: "Shipped"`, `next_safe_action: "Monitor observability dashboards"`
- [ ] Git tag: `git tag -a 020-skill-advisor-hook-surface-v1.0 -m "Phase 020 shipped"` (after user confirmation)

### Sign-off commit

Final commit: `chore(020): phase 020 skill-advisor-hook-surface shipped`
- Updates 020 parent docs to reflect shipped state
- Closes the umbrella packet

---

## 13. Rollback Playbook

### Per-child rollback triggers

A child should be rolled back (not just patched) if:
- Any P0 finding from deep-review is systemic (e.g., renderer has been leaking prompt content into labels across multiple fixtures)
- Implementation diverges materially from spec and cannot be reconciled by editing code alone
- Integration breaks a predecessor child's tests (`vitest --reporter=verbose` surface)

### Rollback procedure (template)

1. **Identify boundary commits**: `git log --oneline 020-skill-advisor-hook-surface/<child>/` — find the first commit of the child's implementation work
2. **Verify predecessor is clean**: `git log --oneline 020-skill-advisor-hook-surface/<predecessor>/` — confirm predecessor's final commit is older than the rollback target
3. **Revert in reverse order**: `git revert <newest-commit-sha> <...> <oldest-commit-sha>` (one revert per commit, reverse chronological)
4. **Verify state**: `bash validate.sh --strict --no-recursive` on the rolled-back child + `vitest run` to confirm no residual test breakage
5. **Update 020 parent**: record rollback in `implementation-summary.md` Dispatch Log with reason + evidence
6. **Redispatch implement** with revised prompt explaining what to change

### Hard-gate rollback (005)

If 005 fails its hard gate after 2 redispatch attempts:
1. **Stop** — do not dispatch T5-T8
2. Escalate: full deep-research wave-4 dispatch targeted at whatever failed (parity, timing, observability, privacy)
3. User decision: patch + retry vs. re-architect (would re-open research)
4. Resume T4 only after wave-4 converges

This is the only scenario where research dispatch is allowed post-wave-3.

---

## 14. Observability During Execution

Where to look during long autonomous runs:

| Signal | Location | What it tells you |
|--------|----------|-------------------|
| Implement dispatch state | `<child>/implementation-summary.md` continuity frontmatter | Last step completed, current blocker |
| Tasks progress | `<child>/tasks.md` | Which T-numbers are `[x]` |
| Validation status | `<child>/checklist.md` | Which P0/P1 items are verified |
| Deep-review state | `research/020-skill-advisor-hook-surface-pt-04/deep-research-state.jsonl` | Per-iteration findings count + novelty |
| Deep-review findings | research artifact folder 020-skill-advisor-hook-surface-pt-04 (review-report.md inside, created by deep-review workflow) | Severity-tagged findings after convergence |
| Test suite output | stdout of `/spec_kit:implement` dispatch | Vitest pass/fail per suite |
| Git commit cadence | `git log --oneline main ^origin/main` | How much code has landed this session |

Detection of stuck runs:
- If `_memory.continuity.last_updated_at` on a child hasn't moved in 30 minutes during an active dispatch → run is likely stuck
- Check child's `scratch/` folder for error logs (if the workflow wrote any)
- Kill the dispatch (if still running) and redispatch with the fallback executor

---

## 15. "100% Perfection" Release Criteria

### P0 (hard-block release; cannot ship without)

- [ ] All 8 children signed off per §3 Phase F criteria
- [ ] Hard gate at 005 lifted with evidence
- [ ] 200/200 corpus parity green on final integration run
- [ ] Cache hit lane p95 ≤ 50 ms + hit rate ≥ 60% on corrected replay
- [ ] `tsc --noEmit` clean across `mcp_server/`
- [ ] `vitest run` — 0 failures
- [ ] Privacy audit green on all 4 runtimes
- [ ] Disable flag verified across all 4 runtimes

### P1 (ship-block unless explicit waiver; defaults to blocking)

- [ ] Cross-runtime parity: 4/4 runtimes × 5+ fixtures identical
- [ ] Observability contract: metric names + label cardinality + JSONL schema + alert thresholds all match §3.6 of 005 spec
- [ ] Deep-review findings: 0 P0, ≤ 3 P1 (each with assigned follow-up or explicit waiver)
- [ ] Documentation: reference doc skill-advisor-hook.md + validation playbook skill-advisor-hook-validation.md exist under references/hooks/, DQI ≥ 0.85
- [ ] CLAUDE.md + runtime READMEs updated

### P2 (defer to follow-up phase)

- [ ] Claude reconnect/replay semantics (noted P2 in research-validation.md §3)
- [ ] Codex `session-prime.ts` optional cleanup
- [ ] Cache-only network invariant restatement in 004 (wave-3 P2)
- [ ] Parity-threshold wording cleanup in 005 (wave-3 P2)

### Release definition

**020 is at 100% perfection when**:
- All P0 criteria checked with evidence
- All P1 criteria checked or explicitly waived (waiver recorded in `decision-record.md` ADR-005+)
- P2 items logged in a follow-up tracking doc but not blocking
- Release commit landed + git tag applied
- Observability dashboards show sustained green across a 24h soak window (optional post-release but recommended)

---

## 16. Command Reference (copy-paste)

### Implement dispatches (T1-T8)

```bash
# T1 — 002
/spec_kit:implement :auto "Implement 020/002-shared-payload-advisor-contract per spec.md/plan.md/tasks.md" --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --spec-folder=.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/002-shared-payload-advisor-contract

# T2 — 003
/spec_kit:implement :auto "Implement 020/003-advisor-freshness-and-source-cache per spec.md/plan.md/tasks.md including wave-3 P1 generation.json malformed recovery" --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --spec-folder=.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/003-advisor-freshness-and-source-cache

# T3 — 004
/spec_kit:implement :auto "Implement 020/004-advisor-brief-producer-cache-policy per spec.md/plan.md/tasks.md. NO semanticModeEnabled; token caps 80/120 (no 60-floor); non-live posture per §3 table" --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --spec-folder=.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/004-advisor-brief-producer-cache-policy

# T4 — 005 HARD GATE
/spec_kit:implement :auto "Implement 020/005-advisor-renderer-and-regression-harness per spec.md/plan.md/tasks.md. Corrected replay trace is 10u+20r (NOT 20u+10r). 50ms gate is cache-hit-lane-only. 10 fixtures. Exact observability contract per §3.6" --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --spec-folder=.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/005-advisor-renderer-and-regression-harness

# T5 — 006 (Claude)
/spec_kit:implement :auto "Implement 020/006-claude-hook-wiring per spec.md/plan.md/tasks.md" --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --spec-folder=.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/006-claude-hook-wiring

# T6 — 007 (Gemini + Copilot)
/spec_kit:implement :auto "Implement 020/007-gemini-copilot-hook-wiring per spec.md/plan.md/tasks.md. Copilot SDK proof IS a merge gate. Gemini schema matrix v1+v2. brief:null no-emit rules per runtime. Wrapper-fallback in-memory-only" --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --spec-folder=.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/007-gemini-copilot-hook-wiring

# T7 — 008 (Codex)
/spec_kit:implement :auto "Implement 020/008-codex-integration-and-hook-policy per spec.md/plan.md/tasks.md. Include PostToolUse audit slice + stdin-vs-argv precedence (stdin wins). Dynamic hookPolicy detector replaces hard-coded unavailable" --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --spec-folder=.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/008-codex-integration-and-hook-policy

# T8 — 009 (Documentation)
/spec_kit:implement :auto "Implement 020/009-documentation-and-release-contract per spec.md/plan.md/tasks.md. Create skill-advisor-hook.md (11 sections) + skill-advisor-hook-validation.md (8 steps). Update CLAUDE.md + 4 runtime READMEs" --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --spec-folder=.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/009-documentation-and-release-contract
```

### Deep-review dispatches (one per child, Phase D)

Template (substitute `<child-folder>` and review focus):
```bash
/spec_kit:deep-review :auto "Review 020/<child-folder> implementation against spec.md requirements; surface P0/P1/P2 findings across security/correctness/maintainability/observability dimensions" --executor=cli-copilot --model=gpt-5.4 --reasoning-effort=high --max-iterations=10 --convergence=0.05 --spec-folder=.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/<child-folder>
```

### Fallback dispatch (any child, cli-copilot)

```bash
/spec_kit:implement :auto "Resume 020/<child-folder> implementation" --executor=cli-copilot --model=gpt-5.4 --reasoning-effort=high --spec-folder=.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/<child-folder>
```

### Validation commands

```bash
# Single child, strict
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/<child-folder> --strict --no-recursive

# Full umbrella (recursive)
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface --strict

# TypeScript + tests
cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit && npx vitest run
```

---

## 17. Related Documents

- Parent spec: `./spec.md`
- Parent plan: `./plan.md`
- Parent tasks: `./tasks.md`
- Parent checklist: `./checklist.md`
- Decision record (ADRs): `./decision-record.md`
- Implementation summary: `./implementation-summary.md`
- Handover: `./handover.md`
- Wave-3 research: `../research/020-skill-advisor-hook-surface-pt-03/research-validation.md`
- Per-child specs: `./002-*/spec.md` through `./009-*/spec.md`
