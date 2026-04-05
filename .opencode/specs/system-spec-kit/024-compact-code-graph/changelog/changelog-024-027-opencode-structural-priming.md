# Changelog: 024/027-opencode-structural-priming

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration)

---

## 027-opencode-structural-priming — 2026-04-02

Hookless runtimes needed a clearer answer than "the code graph exists". They needed to know whether the graph was ready, stale, or missing, and they needed that answer to stay consistent across auto-prime, bootstrap, resume, and health checks. This phase delivered that shared structural bootstrap contract, with OpenCode-first wording and a single canonical recovery recommendation.

> Spec folder: `.opencode/specs/system-spec-kit/024-compact-code-graph/027-opencode-structural-priming/`

---

## New Features (3)

### Shared structural-context contract

**Problem:** Different recovery surfaces described structural readiness differently, which made hookless recovery easy to misread and hard to automate around.

**Fix:** Added a shared contract in `session-snapshot.ts` that reports structural context as `ready`, `stale`, or `missing`, giving every caller the same vocabulary and the same degraded-state model.

### Structural context inside startup and recovery payloads

**Problem:** PrimePackage and session bootstrap flows could tell the AI that tools existed, but not whether structural retrieval was in a shape worth using right now.

**Fix:** Propagated the structural contract into `primePackage.structuralContext`, `session_bootstrap`, `session_resume`, and `session_health`, so startup and recovery payloads now carry concrete graph-readiness information instead of vague availability hints.

### Canonical non-hook recovery guidance

**Problem:** Hookless runtimes still relied too much on scattered instructions and ad hoc tool choice after startup.

**Fix:** Updated first-turn server instructions and the OpenCode-oriented `@context-prime` output to recommend `session_bootstrap` as the canonical recovery step whenever structural context is stale or missing.

---

## Documentation (2)

### OpenCode-first wording in AGENTS and context-prime

**Problem:** The non-hook guidance existed, but it was not yet expressed as a clean contract aimed at OpenCode-style flows.

**Fix:** Updated `AGENTS.md` and `.opencode/agent/context-prime.md` so the startup and recovery narrative uses the same structural-context contract as the runtime surfaces themselves.

### Phase-map synchronization

**Problem:** Follow-on packet phases are easy to implement faster than the phase map catches up.

**Fix:** Synced the parent `spec.md` plus the child phase docs so `027-opencode-structural-priming` is explicitly registered in the packet history rather than implied by runtime changes alone.

---

## Testing (2)

### Dedicated structural-contract suite

**Problem:** Contract drift can slip through broad integration tests because each surface may still look plausible in isolation.

**Fix:** Added `tests/structural-contract.vitest.ts` to cover all three statuses and all four surfaces that consume the contract.

### Cross-surface regression pass

**Problem:** The contract needed to survive contact with startup-brief and existing hook-state behavior.

**Fix:** Re-ran `startup-brief`, `hook-state`, and `structural-contract` tests together to confirm the contract stays stable across the bootstrap and recovery stack.

---

<details>
<summary>Files Changed (8)</summary>

| File | What changed |
|------|-------------|
| `mcp_server/lib/session/session-snapshot.ts` | Added structural bootstrap contract type and builder. |
| `mcp_server/hooks/memory-surface.ts` | Added `primePackage.structuralContext`. |
| `mcp_server/handlers/session-bootstrap.ts` | Added structural context to the composite bootstrap response. |
| `mcp_server/handlers/session-resume.ts` | Added structural context and recovery hints. |
| `mcp_server/handlers/session-health.ts` | Added structural context plus stale/missing recovery hints. |
| `mcp_server/context-server.ts` | Added Phase 027 structural bootstrap guidance to server instructions. |
| `AGENTS.md` | Updated hookless startup/recovery wording to match the shared contract. |
| `.opencode/agent/context-prime.md` | Added structural-context guidance to PrimePackage output. |

</details>

---

## Upgrade

No migration required. This phase is additive and contract-focused: it standardizes how hookless runtimes describe and recover structural context without changing the core graph tools themselves.
