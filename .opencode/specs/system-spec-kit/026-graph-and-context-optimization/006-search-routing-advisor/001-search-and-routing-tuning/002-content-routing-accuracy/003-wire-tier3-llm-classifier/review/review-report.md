# Deep Review Report

## 1. Executive summary
**Verdict: FAIL.** The loop ran the full 10 iterations and ended at `maxIterationsReached` with **1 P0**, **3 P1**, and **2 P2** findings still active. The release-blocking issue is a trust-boundary defect: full-auto canonical saves can still send packet content to the Tier 3 LLM endpoint even though the packet documents the feature as rollout-gated.

The strongest secondary risks are a correctness flaw in the shipped cache key, two traceability mismatches in the packet metadata/docs, and two maintainability issues around cache lifetime and packet closure hygiene. Convergence attempts at iterations 8 and 9 were vetoed by the active P0.

## 2. Scope
Reviewed packet docs:
- `spec.md`
- `plan.md`
- `tasks.md`
- `checklist.md`
- `decision-record.md`
- `implementation-summary.md`
- `description.json`
- `graph-metadata.json`

Reviewed implementation and verification surfaces:
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/content-router-cache.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts`
- `.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md`

## 3. Method
The loop followed the requested 4-dimension rotation:
1. correctness
2. security
3. traceability
4. maintainability

That cycle repeated until iteration 10. Each pass re-read the packet state, isolated one dimension, and only recorded file-cited findings. Focused TypeScript and Vitest verification passed during the review, so the report distinguishes passing tests from contract drift and hidden runtime behavior.

## 4. Findings by severity

### P0

| ID | Dimension | Finding | Evidence | Why it matters |
|---|---|---|---|---|
| F001 | security | Full-auto canonical saves bypass the advertised Tier 3 rollout gate and can exfiltrate content to the LLM endpoint. | [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1040`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1343`] [SOURCE: `implementation-summary.md:53`] | The handler forces `tier3Enabled` on when `plannerMode === 'full-auto'`, then posts the raw save chunk to the configured endpoint. That is a hidden outbound path on real saves under a configuration the packet documents as gated. |

### P1

| ID | Dimension | Finding | Evidence | Why it matters |
|---|---|---|---|---|
| F002 | correctness | Built-in Tier 3 cache keys ignore routing context and can replay stale destinations. | [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:313`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:334`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:756`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/content-router-cache.vitest.ts:26`] | The shipped cache key omits `packet_level`, `packet_kind`, `save_mode`, and `likely_phase_anchor`, even though the prompt contract and the dedicated cache test treat those fields as route-defining. Identical ambiguous text can therefore reuse the wrong prior Tier 3 decision. |
| F003 | traceability | The phase packet documents the wrong Tier 3 enable flag and rollout model. | [SOURCE: `implementation-summary.md:53`] [SOURCE: `implementation-summary.md:94`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1366`] [SOURCE: `.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md:130`] | Operators cannot tell which knob is authoritative: the packet says `SPECKIT_TIER3_ROUTING`, the code reads `SPECKIT_ROUTER_TIER3_ENABLED`, and the feature catalog says the old flag is removed. |
| F004 | traceability | `description.json` parentChain still points at the pre-renumbered phase slug. | [SOURCE: `description.json:15`] | The packet moved under `001-search-and-routing-tuning`, but `parentChain` still encodes `010-search-and-routing-tuning`. That misstates ancestry for tools that trust `description.json` after the migration. |

### P2

| ID | Dimension | Finding | Evidence | Why it matters |
|---|---|---|---|---|
| F005 | maintainability | Shared Tier 3 cache keeps session entries forever with no bound or eviction. | [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:171`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:310`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:806`] | The process-wide singleton cache stores session entries with infinite TTL, so a long-lived MCP server accumulates chunk hashes without a cap or cleanup strategy. |
| F006 | maintainability | Packet closure documents are internally inconsistent after completion. | [SOURCE: `decision-record.md:1`] [SOURCE: `spec.md:1`] [SOURCE: `checklist.md:1`] [SOURCE: `graph-metadata.json:31`] | The packet is marked complete overall, but the decision record still says `planned` and the checklist still carries unresolved should-fix/advisory items with no closure note. That makes follow-on maintenance state harder to trust. |

## 5. Findings by dimension

| Dimension | Findings | Summary |
|---|---|---|
| correctness | F002 | The shipped in-memory cache does not preserve the routing context that the Tier 3 prompt and test contract assume, so stale route reuse remains possible. |
| security | F001 | Planner mode currently doubles as a hidden Tier 3 transport enablement path, which exposes save content to the configured LLM endpoint outside the packet’s documented rollout contract. |
| traceability | F003, F004 | Both the rollout flag story and the packet’s migrated ancestry metadata drift from the current repository state. |
| maintainability | F005, F006 | Runtime cache lifetime is unbounded, and the packet closure surfaces disagree on whether the phase is fully settled. |

## 6. Adversarial self-check for P0
**Challenge:** F001 only triggers when two conditions are true: `LLM_REFORMULATION_ENDPOINT` must be configured and the caller must run a full-auto save. That could mean the behavior is operator-intentional rather than a blocker.

**Re-read result:** The code still hard-wires `tier3Enabled = params.plannerMode === 'full-auto' || isTier3RoutingEnabled()` in `memory-save.ts`, while the packet explicitly says the live path is gated behind `SPECKIT_TIER3_ROUTING=true` and the feature catalog says the old flag was removed. The outbound POST is also performed on the raw save chunk in `classifyWithTier3Llm()`. The two conditions narrow the trigger, but they do not neutralize the trust-boundary problem because planner mode is not the documented Tier 3 enablement gate.

**Conclusion:** Keep **F001 as P0**. The packet promises one activation model while the shipped handler uses another and can disclose canonical save content when the documented gate is still assumed off.

## 7. Remediation order
1. **Fix F001 first.** Separate Tier 3 transport enablement from `plannerMode === 'full-auto'`, and make the live routing path obey one explicit, documented rollout contract.
2. **Fix F002 next.** Expand the built-in cache key to include the same prompt-shaping context the dedicated cache test already treats as part of the contract (`packet_level`, `packet_kind`, `save_mode`, `likely_phase_anchor`, and prompt version).
3. **Repair the rollout documentation.** Reconcile the phase packet, feature catalog, and code on a single Tier 3 enable flag story (F003).
4. **Regenerate packet metadata after migration.** Refresh `description.json` so `parentChain` matches the current packet path (F004).
5. **Bound the cache.** Add finite TTL and/or LRU eviction for the process-wide Tier 3 cache (F005).
6. **Close the packet coherently.** Update the decision record/checklist closure semantics so the packet’s final state is internally consistent (F006).

## 8. Verification suggestions
1. Add a regression that proves a full-auto save does **not** invoke Tier 3 unless the intended router rollout flag is enabled.
2. Add an `InMemoryRouterCache` regression that reuses identical text across different `packet_kind` / `save_mode` / `likely_phase_anchor` values and asserts distinct cache misses.
3. Regenerate packet metadata and then re-run whatever indexing/discovery path consumes `description.json` to confirm the parent chain updates cleanly.
4. Add a focused packet-closure check that rejects `status: complete` packets when sibling closure surfaces still advertise `planned` state without an explicit justification.
5. Re-run the packet’s existing verification surface after the fixes: `npx tsc --noEmit` and `npx vitest run tests/content-router.vitest.ts tests/handler-memory-save.vitest.ts`.

## 9. Appendix (iteration list + delta churn)

| Iteration | Dimension | New finding refs | newFindingsRatio | Notes |
|---|---|---|---:|---|
| 001 | correctness | F002 (initially P2) | 0.18 | Flagged cache-key scope risk. |
| 002 | security | F001 | 0.58 | Found release-blocking rollout-gate bypass. |
| 003 | traceability | F003 | 0.31 | Flag/docs drift surfaced. |
| 004 | maintainability | F005 | 0.07 | Infinite session cache surfaced. |
| 005 | correctness | F002 upgraded to P1 | 0.22 | Dedicated cache-contract test raised severity. |
| 006 | security | none | 0.09 | Adversarial self-check upheld F001. |
| 007 | traceability | F004 | 0.27 | Migrated parent-chain metadata drift surfaced. |
| 008 | maintainability | F006 | 0.07 | Packet closure inconsistency surfaced; blocked stop. |
| 009 | correctness | none | 0.04 | Stabilization pass; blocked stop. |
| 010 | security | none | 0.04 | Final blocker confirmation; max iterations reached. |

**Blocked-stop churn**

| Iteration | Stop score | blockedBy | Recovery |
|---|---:|---|---|
| 008 | 0.72 | `p0ResolutionGate` | Keep focus on blocker confirmation and registry hardening. |
| 009 | 0.74 | `p0ResolutionGate` | Spend the final pass confirming the blocker rather than synthesizing early. |
