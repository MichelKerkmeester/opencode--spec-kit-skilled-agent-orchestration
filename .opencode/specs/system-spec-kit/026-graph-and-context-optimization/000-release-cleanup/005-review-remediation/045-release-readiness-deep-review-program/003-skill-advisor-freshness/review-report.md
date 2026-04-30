---
title: "Review Report: Skill Advisor Freshness Release-Readiness Audit"
description: "Deep-review angle 3: skill advisor freshness across daemon detection, status/rebuild split, scoring tables, brief cache, Codex cold-start fallback marker, and Python shim parity."
trigger_phrases:
  - "045-003-skill-advisor-freshness"
  - "advisor freshness audit"
  - "daemon freshness review"
  - "advisor rebuild review"
importance_tier: "important"
contextType: "review"
---
# Review Report: Skill Advisor Freshness Release-Readiness Audit

## 1. Executive Summary

**Verdict: CONDITIONAL.** I found no P0 evidence of silent stale-context fallback or runtime scoring corruption in the audited TypeScript path. `advisor_status` is diagnostic-only, `advisor_rebuild({ force: true })` performs a real index and generation publish when invoked against the intended workspace, static boost tables are not prompt-controlled, and the Codex timeout fallback emits the expected stale marker.

The release blocker is narrower: the public `advisor_rebuild` schema does not accept `workspaceRoot`, while the manual status/rebuild playbook tells operators to pass it. That makes the explicit repair path unreliable outside `process.cwd()`. Two P2 issues remain: the Python forced/local fallback is not functionally equivalent to native TS scoring, and scorer weight docs/playbooks drift from runtime weights.

## 2. Planning Trigger

User requested Packet 045/003, read-only deep-review angle 3 for skill advisor freshness. The audit target was `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/` plus related status, rebuild, recommend, validate, daemon, scoring, feature catalog, and manual testing surfaces, with cross-reads from 026/008, 034, and 045/005.

Rubric applied:

| Severity | Meaning in this packet |
|----------|------------------------|
| P0 | Silent stale-context fallback or scoring corruption. |
| P1 | Missing rebuild path or freshness reporting bug. |
| P2 | Optimization, traceability drift, or maintenance risk. |

## 3. Active Finding Registry

### P1-001 - `advisor_rebuild` cannot target the workspace that `advisor_status` and the playbook diagnose

**Impact.** Operators can diagnose a stale alternate workspace with `advisor_status({ workspaceRoot })`, then fail to repair that same workspace through the public MCP tool because `advisor_rebuild` rejects or ignores `workspaceRoot`. In release terms, the rebuild mechanism is real, but the operator-facing repair path is incomplete for non-`process.cwd()` workspaces.

**Evidence.**

- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/schemas/advisor-tool-schemas.ts:115-117` defines `AdvisorRebuildInputSchema` with only optional `force`.
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tools/advisor-rebuild.ts:11-17` exposes only `force` and sets `additionalProperties: false`.
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-rebuild.ts:57-60` resolves the workspace from injected dependencies or `process.cwd()`, not from tool input.
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/manual_testing_playbook/01--native-mcp-tools/006-advisor-status-rebuild-separation.md:54` and `:66-67` instruct manual testers to call `advisor_rebuild({ "workspaceRoot": "...", ... })`.

**Fix.** Add `workspaceRoot?: string` to the rebuild input schema and tool descriptor, pass it into `rebuildAdvisorIndex`, and add a test that `advisor_status({ workspaceRoot })` followed by forced `advisor_rebuild({ workspaceRoot, force: true })` repairs that same workspace. If the intended contract is cwd-only rebuild, fix the playbook and status/rebuild docs instead.

### P2-001 - Python forced/local compatibility fallback is not functionally equivalent to the native TS path

**Impact.** The default shim path delegates to native TS when available, so normal use is aligned. The forced/local fallback still uses a separate Python scoring implementation and separate intent/phrase tables, so it should be documented as a legacy degraded fallback rather than treated as equivalent in release notes or manual expectations.

**Evidence.**

- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py:3278-3298` tries the native advisor by default and prints native results when available.
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py:3299-3309` makes `--force-native` fail hard if the native bridge is unavailable.
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py:3311-3327` falls back to local Python scoring when native is not used.
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py:1184-1436` and `:1448-1620` contain separate Python booster tables and matching logic.
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts:8-133` contains the native TS `TOKEN_BOOSTS` and `PHRASE_BOOSTS` tables used by the current scorer.
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/parity/python-ts-parity.vitest.ts:99-162` checks that TS preserves Python-correct corpus decisions and improves accuracy; it does not prove forced/local Python parity with TS.

**Fix.** Label forced/local Python as a compatibility fallback with weaker parity guarantees, or add golden parity tests that compare forced-local Python and native TS for the supported corpus and fail on unacceptable divergence.

### P2-002 - Scorer weight documentation and manual playbook drift from runtime weights

**Impact.** Runtime scoring is not corrupted because the authoritative weights are in code, but release operators can misread expected fusion behavior during manual validation. This is an evergreen-doc issue: stale manual expectations make correct runtime behavior look suspicious.

**Evidence.**

- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lane-registry.ts:5-10` sets runtime weights to explicit 0.45, lexical 0.30, graph 0.15, derived 0.15, semantic 0.00.
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/README.md:139-145` documents derived as 0.10.
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/manual_testing_playbook/08--scorer-fusion/001-five-lane-fusion.md:3` and `:26` document derived as 0.10.
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/feature_catalog/04--scorer-fusion/06-weights-config.md:31` documents derived as 0.15, matching code.

**Fix.** Update README and manual playbook to match `lane-registry.ts`, and add a lightweight doc check or generated snippet for the lane table.

## 4. Remediation Workstreams

| Workstream | Severity | Owner Surface | Concrete Next Step |
|------------|----------|---------------|--------------------|
| Rebuild workspace contract | P1 | `advisor_rebuild` schema, tool descriptor, handler, tests, playbook | Decide whether `workspaceRoot` is supported. Prefer support because status already accepts it and the playbook already depends on it. |
| Python fallback parity labeling | P2 | `scripts/skill_advisor.py`, compatibility docs, parity tests | Document forced/local fallback as legacy degraded mode or add golden parity tests. |
| Scorer weight docs | P2 | README, manual testing playbook, feature catalog | Sync documented lane weights with `lane-registry.ts`. |

## 5. Spec Seed

Remediation spec should target one P1 behavior change:

- **Problem**: `advisor_status` can inspect an arbitrary workspace, but `advisor_rebuild` cannot explicitly rebuild that same workspace through the public tool contract.
- **Success**: `advisor_rebuild({ workspaceRoot, force: true })` validates, indexes that workspace's skill metadata, publishes a new generation, invalidates advisor caches, and returns before/after generation state for the same workspace.
- **Non-goal**: Changing scoring semantics or daemon watcher behavior.

## 6. Plan Seed

1. Extend `AdvisorRebuildInputSchema` and the MCP tool descriptor with `workspaceRoot?: string`.
2. Thread the parsed workspace root into `rebuildAdvisorIndex`.
3. Add a stale alternate workspace test that fails before the fix and passes after it.
4. Update the status/rebuild playbook only after the runtime contract and test agree.
5. Separately sync scorer weight docs and label Python forced/local fallback parity limits.

## 7. Traceability Status

| Question | Answer | Evidence |
|----------|--------|----------|
| Does `advisor_status` ever side-effect? | No runtime mutation found. It reads generation/artifact/source signatures, scans metadata mtimes, optionally probes a daemon PID with signal 0, and returns diagnostics. | `advisor-status.ts:89-159`; PID probe at `:115-122`; stale downgrade at `:128-147`; error-only catch at `:160-181`. |
| Does `advisor_rebuild({force:true})` actually invalidate caches? | Yes, once invoked for the intended workspace. It calls `indexSkillMetadata`, publishes a generation, and generation publication fans out to advisor cache invalidation. | `advisor-rebuild.ts:78-86`; `skill-graph-db.ts:482-540`, `:576-644`; `generation.ts:110-132`; `cache-invalidation.ts:26-44`; `skill-advisor-brief.ts:41-45`. |
| Are TOKEN_BOOSTS and PHRASE_BOOSTS guaranteed-loaded before scoring? | Yes in the native TS path. They are module constants loaded before `scoreExplicitLane` executes. Missing/corrupt tables would fail module load rather than silently degrade. | `explicit.ts:8-133`; scoring loops at `explicit.ts:144-160`. |
| Can crafted prompts inject boost-table behavior? | No boost-table injection path found. Public recommend input excludes internal affordances and strict schema accepts only prompt/options/workspaceRoot. Adversarial stuffing has explicit tests. | `advisor-tool-schemas.ts:19-41`; `native-scorer.vitest.ts:149-160`. |
| Does Codex hook freshness smoke emit `stale: true, reason: "timeout-fallback"`? | Yes in the direct hook fallback path. Normal-shell live verdict remains a cross-runtime evidence concern from 045/005, not a failure of this marker code. | `hooks/codex/user-prompt-submit.ts:174-203`; `hooks-codex-freshness.vitest.ts:39-72`; `043-hook-plugin-per-runtime-testing/run-output/latest/codex-user-prompt-submit-freshness-direct-smoke.jsonl:1`. |
| Is the Python compatibility shim functionally equivalent to native TS? | Default path delegates to native TS when available. Forced/local fallback is not proven equivalent and uses separate scoring tables. | `skill_advisor.py:3278-3327`; `skill_advisor.py:1184-1436`; `skill_advisor.py:1448-1620`; `python-ts-parity.vitest.ts:99-162`. |
| Cache hit rate under normal use? | Existing timing replay expects 20 hits out of 30 calls, a 66.7% hit rate for 10 unique prompts repeated three times. Production hit rate is not available from checked-in evidence. | `advisor-timing.vitest.ts:133-155`; cache metrics at `metrics.ts:616-626`. |

Additional checks:

- Daemon shutdown and restart discipline is covered by lifecycle code and tests: `lifecycle.ts:49-97`, `daemon-freshness-foundation.vitest.ts:440-484`.
- Prompt cache keys include prompt, source signature, workspace root, runtime, max tokens, and threshold config: `prompt-cache.ts:67-80`.
- Prompt cache invalidates old source signatures and exposes metrics: `prompt-cache.ts:97-119`, `:151-160`.
- Native recommend exact-cache hits return `cache.hit: true`: `advisor-recommend.ts:220-247`; test coverage at `advisor-recommend.vitest.ts:262-335`.

## 8. Deferred Items

- No P0 remediation is needed from this audit.
- P1 remediation should address the rebuild workspace contract before release readiness is claimed for multi-workspace operator flows.
- P2 items can be batched as documentation and compatibility cleanup after the P1 contract is fixed.
- Production cache-hit telemetry remains out of scope; the report uses existing deterministic test evidence.

## 9. Audit Appendix

### Files Reviewed

- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-status.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-rebuild.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-recommend.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/skill-advisor-brief.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/skill-advisor-daemon*.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/*.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/*.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/**/*.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/feature_catalog/`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/manual_testing_playbook/`
- Related tests under `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/` and `.opencode/skill/system-spec-kit/mcp_server/tests/`
- Related history under 026/008, 034, and 045/005.

### Non-Findings

- `advisor_status` diagnostic-only behavior matches packet 034 intent.
- Forced rebuild performs real indexing and generation publication once the correct workspace is selected.
- Native TS boost tables are static trusted code, not prompt-loaded configuration.
- Codex timeout fallback marker is present and tested.
- Daemon shutdown publishes unavailable state and closes watcher/lease resources.

### Validation

- Packet validator: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program/003-skill-advisor-freshness --strict`
- Expected result: exit 0.
