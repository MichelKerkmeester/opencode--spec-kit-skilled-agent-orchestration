---
title: "Implementation Plan: Advisor Brief Producer + Cache Policy"
description: "Four new lib files composing buildSkillAdvisorBrief(): producer orchestration, prompt policy, HMAC exact cache, subprocess wrapper. Depends on 002 envelope + 003 freshness."
trigger_phrases:
  - "020 004 plan"
  - "advisor brief producer plan"
importance_tier: "critical"
contextType: "plan"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/004-advisor-brief-producer-cache-policy"
    last_updated_at: "2026-04-19T09:30:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Plan scaffolded"
    next_safe_action: "Dispatch /spec_kit:implement :auto after 003 converges"
    blockers: []
    key_files: []

---
# Implementation Plan: Advisor Brief Producer + Cache Policy

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (strict, ESM) + Python subprocess |
| **New Module** | `mcp_server/lib/skill-advisor/` (4 new files + existing freshness from 003) |
| **Testing** | vitest |
| **Pattern Reference** | `lib/code-graph/startup-brief.ts` orchestration |
| **Subprocess** | `python3 skill_advisor.py --threshold 0.8 --format json <prompt>` |

### Overview

`buildSkillAdvisorBrief()` orchestrates prompt policy → normalization → cache → subprocess → parse → envelope. Each stage has explicit fail-open semantics mapping to `AdvisorHookResult`. Enforces research-derived rules: no similarity cache, no raw-prompt persistence, NFKC fold before hashing, deleted-skill suppression.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] 002 (shared-payload envelope) merged
- [ ] 003 (freshness + source cache) merged
- [x] Research synthesis rules confirmed

### Definition of Done
- [ ] 10 acceptance scenarios green
- [ ] `tsc --noEmit` clean
- [ ] Warm cache p95 ≤ 10 ms recorded
- [ ] All P0 checklist items `[x]`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Compose pure functions where possible; `buildSkillAdvisorBrief()` is the single impure entrypoint orchestrating subprocess + cache writes.

### Key Components

```
mcp_server/
  lib/skill-advisor/
    freshness.ts              (from 003)
    source-cache.ts           (from 003)
    generation.ts             (from 003)
    prompt-policy.ts          NEW — shouldFireAdvisor(prompt)
    prompt-cache.ts           NEW — HMAC exact prompt cache
    subprocess.ts             NEW — runAdvisorSubprocess() with timeout
    skill-advisor-brief.ts    NEW — buildSkillAdvisorBrief() orchestrator
  tests/
    advisor-brief-producer.vitest.ts   NEW
    advisor-prompt-policy.vitest.ts    NEW
    advisor-prompt-cache.vitest.ts     NEW
    advisor-subprocess.vitest.ts       NEW
```

### Data Flow

```
buildSkillAdvisorBrief(prompt, options)
  ├─ canonical = canonicalFold(prompt)  // Phase 019/003
  ├─ policy = shouldFireAdvisor(canonical)
  ├─ if (!policy.fire) → { status: "skipped", brief: null }
  ├─ freshness = options.freshness ?? await getAdvisorFreshness(options.workspaceRoot)
  ├─ cacheKey = HMAC(canonical + freshness.sourceSignature + runtime + threshold + semanticMode, sessionSecret)
  ├─ cached = promptCache.get(cacheKey)
  ├─ if (cached && cached.skillStillExists(freshness.skillFingerprints)) → return cached
  ├─ subprocess = runAdvisorSubprocess(canonical, { timeoutMs, retry })
  ├─ if (subprocess.error) → fail-open result
  ├─ parsed = parseAdvisorJson(subprocess.stdout)
  ├─ recommendations = filterThresholdPassing(parsed, threshold)
  ├─ brief = renderBrief(recommendations.top1, freshness, tokenCap)  // placeholder; 005 provides real renderer
  ├─ envelope = createSharedPayloadEnvelope({ producer: "advisor", metadata: {...}, sources: [...freshness sources] })
  ├─ promptCache.set(cacheKey, result, ttl=5min)
  └─ return { status, freshness, brief, recommendations, diagnostics, metrics, envelope, generatedAt }
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Prompt policy + normalization
- [ ] Create `prompt-policy.ts` with `shouldFireAdvisor()` + 6 prompt-class classifier
- [ ] Wire NFKC canonical fold from `shared/unicode-normalization.ts`
- [ ] Write `advisor-prompt-policy.vitest.ts`

### Phase 2: Exact prompt cache
- [ ] Create `prompt-cache.ts` with HMAC-keyed LRU + 5-min TTL
- [ ] Session-secret derivation from PID + launch time
- [ ] Signature-gated invalidation
- [ ] Write `advisor-prompt-cache.vitest.ts`

### Phase 3: Subprocess wrapper
- [ ] Create `subprocess.ts` with `runAdvisorSubprocess(canonical, opts)`
- [ ] 1000ms timeout; SIGKILL on expiry
- [ ] Strict JSON schema parse; stderr capture (not stdout intermingle)
- [ ] SQLite-busy single-retry logic (75-125ms, ≥500ms budget)
- [ ] Write `advisor-subprocess.vitest.ts`

### Phase 4: Producer orchestration
- [ ] Create `skill-advisor-brief.ts` with `buildSkillAdvisorBrief()` orchestrator
- [ ] Map all fail-open branches to `AdvisorHookResult`
- [ ] Integrate envelope wrapping from 002
- [ ] Enforce token caps at producer (60/80/120)
- [ ] Diagnostics: metalinguistic suppression log
- [ ] Write `advisor-brief-producer.vitest.ts` (10 acceptance scenarios)

### Phase 5: Verification
- [ ] All 4 vitest files green
- [ ] `tsc --noEmit` clean
- [ ] Bench warm/cold lanes; record p50/p95/p99
- [ ] Privacy audit: grep test fixtures for raw prompts
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Prompt classifier | vitest |
| Unit | HMAC cache | vitest |
| Unit | Subprocess + timeout | vitest (with mock spawn) |
| Integration | Full producer orchestration | vitest |
| Bench | Warm vs cold | vitest bench |
| Privacy | No raw prompt in serialized state | grep + vitest expect |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status |
|------------|------|--------|
| 002 shared-payload advisor envelope | Predecessor | Pending merge |
| 003 freshness + source cache | Predecessor | Pending merge |
| `shared/unicode-normalization.ts` (Phase 019/003) | Internal | Live |
| `skill_advisor.py` subprocess | Python, external | Live (019/004 hardened) |
| `node:child_process` + `node:crypto` | Node stdlib | Live |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

**Trigger**: any acceptance scenario fails OR warm cache p95 > 20 ms.

**Procedure**: revert commits for 004. Children 005-008 not yet implemented, so no downstream impact. If 002 or 003 commits need reverting, order: 004 → 003 → 002.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Policy) ──┐
Phase 2 (Cache) ───┼──► Phase 4 (Producer) ──► Phase 5 (Verify)
Phase 3 (Subproc) ─┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Policy | 003 merged | Producer |
| Cache | 003 merged | Producer |
| Subprocess | 003 merged | Producer |
| Producer | Policy, Cache, Subproc | Verify |
| Verify | Producer | Child 005 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Prompt policy | Med | 2-3 hours |
| Exact prompt cache | Med | 2-3 hours |
| Subprocess wrapper | Med-High | 3-4 hours |
| Producer orchestration | High | 3-5 hours |
| Verification | Med | 2-3 hours |
| **Total** | | **12-18 hours (1.25-2 days)** |
<!-- /ANCHOR:effort -->
