# T000b: Feature Flag Governance Rules

**Spec**: 02--system-spec-kit/022-hybrid-rag-fusion-refinement
**Captured**: 2026-02-27

---

## 1. Governance Rules

### Maximum Simultaneous Active Flags
- **Cap: 6 active flags** at any one time (excluding always-on infrastructure flags like `SPECKIT_DB_PATH`, `SPECKIT_SKIP_API_VALIDATION`).
- Flags that are permanently on (default=true, no planned sunset) do not count toward the cap.
- Flags being evaluated for a sprint experiment count toward the cap.

### Flag Lifespan
- **90-day maximum lifespan** per flag from first introduction to mandatory hard-deadline decision.
- Extension: INCONCLUSIVE state allows a **one-time 14-day extension** (hard max; no second extension).
- After extension deadline, a binary decision must be recorded: **ADOPT** (remove flag, hardcode behavior) or **RETIRE** (remove flag and code path).

### Naming Convention
- Format: `SPECKIT_[FEATURE]` (uppercase, underscore-separated)
- Example: `SPECKIT_ADAPTIVE_FUSION`, `SPECKIT_CAUSAL_BOOST`
- No version suffixes; no abbreviations that obscure meaning

### INCONCLUSIVE State Protocol
1. Measurement window produces ambiguous results (neither clearly positive nor clearly negative)
2. Extend window by **14 days maximum** (one extension per flag, ever)
3. Record extension decision with rationale in spec scratch
4. Set hard-deadline date (original deadline + 14 days)
5. Hard-deadline decision is **mandatory and binary** — no second extension

### B8 Signal Ceiling
- Maximum **12 active scoring signals** until R13 automated eval pipeline is operational
- Current active signals are enumerated in Section 3
- Adding a new scoring signal requires retiring an existing one if at or above ceiling

### Monthly Sunset Audit
- Performed on the first Monday of each month
- For each flag: verify current state, confirm decision timeline, update status
- Flags past 90-day deadline with no decision → escalate immediately
- Flags with INCONCLUSIVE + extension expired → force binary decision

---

## 2. Flag Lifecycle States

```
INTRODUCED → MEASURING → INCONCLUSIVE (14-day extension) → ADOPT | RETIRE
                       → ADOPT (clear positive)
                       → RETIRE (clear negative)
```

| State        | Description                                              |
| ------------ | -------------------------------------------------------- |
| INTRODUCED   | Flag added to codebase, not yet actively measured        |
| MEASURING    | Active A/B or pre/post measurement in progress           |
| INCONCLUSIVE | Measurement ambiguous; 14-day extension available        |
| ADOPT        | Behavior hardcoded, flag removed                         |
| RETIRE       | Code path removed, flag removed                          |

---

## 3. Current Flag Inventory

Sourced from: `mcp_server/**/*.ts` grep for `process.env.SPECKIT_`

### Infrastructure Flags (exempt from 6-flag cap, no sunset)

| Flag                             | Default  | Source File                        | Purpose                                              |
| -------------------------------- | -------- | ---------------------------------- | ---------------------------------------------------- |
| `SPECKIT_DB_PATH`                | (unset)  | `lib/errors/recovery-hints.ts`     | Override DB file path; infrastructure plumbing       |
| `SPECKIT_SKIP_API_VALIDATION`    | false    | `context-server.ts:464`            | Bypass API key validation (CI/testing use only)      |
| `SPECKIT_EAGER_WARMUP`           | false    | `context-server.ts:502`            | Legacy eager warmup (deprecated behavior restore)    |
| `SPECKIT_DEBUG`                  | false    | `lib/cognitive/co-activation.ts:358`| Enable debug-mode console logging                   |
| `SPECKIT_DEBUG_INDEX_SCAN`       | false    | `handlers/memory-index.ts:467`     | Verbose index scan logging                           |
| `SPECKIT_LAZY_LOADING`           | (unset)  | tests only                         | Lazy loading behavior gate (test fixture)            |
| `SPECKIT_ROLLOUT_PERCENT`        | 100      | `lib/cognitive/rollout-policy.ts:8`| Global rollout gate (0-100); controls all rollout-gated flags |
| `SPECKIT_LEVEL`                  | (marker) | `handlers/memory-save.ts:615`      | HTML comment marker in memory files, not an env var  |
| `SPECKIT_INDEX_SPEC_DOCS`        | true     | `handlers/memory-index-discovery.ts:42` | Enable spec document indexing in scan          |

### Active Feature Flags (count toward 6-flag cap)

| Flag                              | Default | Source File                          | Purpose                                                                   | State       | Added     |
| --------------------------------- | ------- | ------------------------------------ | ------------------------------------------------------------------------- | ----------- | --------- |
| `SPECKIT_ADAPTIVE_FUSION`         | true    | `lib/search/adaptive-fusion.ts:82`   | Intent-aware weighted RRF with 7 task-type profiles                       | ADOPTED     | Sprint 138|
| `SPECKIT_MMR`                     | true    | `lib/search/search-flags.ts:12`      | Graph-guided MMR diversity reranking                                      | MEASURING   | Sprint 138|
| `SPECKIT_TRM`                     | true    | `lib/search/search-flags.ts:20`      | Transparent Reasoning Module (evidence-gap detection)                     | MEASURING   | Sprint 138|
| `SPECKIT_MULTI_QUERY`             | true    | `lib/search/search-flags.ts:28`      | Multi-query expansion for deep-mode retrieval                             | MEASURING   | Sprint 138|
| `SPECKIT_CROSS_ENCODER`           | true    | `lib/search/search-flags.ts:36`      | Cross-encoder reranking (requires provider config)                        | MEASURING   | Sprint 139|
| `SPECKIT_GRAPH_UNIFIED`           | true    | `lib/search/graph-flags.ts:12`       | Unified graph channel in search pipeline                                  | MEASURING   | Sprint 140|
| `SPECKIT_RRF`                     | true    | `lib/search/rrf-fusion.ts:332`       | RRF search fusion (core infrastructure)                                   | ADOPTED     | Sprint 139|

### Cognitive / Session Flags (rollout-gated via SPECKIT_ROLLOUT_PERCENT)

| Flag                              | Default | Source File                             | Purpose                                                    | State     |
| --------------------------------- | ------- | --------------------------------------- | ---------------------------------------------------------- | --------- |
| `SPECKIT_SESSION_BOOST`           | true    | `lib/search/session-boost.ts:29`        | Session-attention score boost (working_memory signals)     | MEASURING |
| `SPECKIT_CAUSAL_BOOST`            | true    | `lib/search/causal-boost.ts:58`         | 2-hop causal-neighbor score boost                          | MEASURING |
| `SPECKIT_EVENT_DECAY`             | true    | `lib/cognitive/working-memory.ts:491`   | Attention decay on working memory events                   | MEASURING |
| `SPECKIT_AUTO_RESUME`             | true    | `handlers/memory-context.ts:414`        | Auto-inject resume context into memory_context output      | MEASURING |
| `SPECKIT_PRESSURE_POLICY`         | true    | `handlers/memory-context.ts:413`        | Token pressure mode override in memory_context             | MEASURING |
| `SPECKIT_EXTRACTION`              | true    | `lib/extraction/extraction-adapter.ts:71`| Extraction pipeline adapter                               | MEASURING |
| `SPECKIT_RELATIONS`               | true    | `lib/learning/corrections.ts:119`       | Causal memory graph (CHK-069)                              | MEASURING |
| `SPECKIT_WORKING_MEMORY`          | true    | `lib/cognitive/working-memory.ts:30`    | Working memory session feature                             | ADOPTED   |
| `SPECKIT_ARCHIVAL`                | true    | `lib/cognitive/archival-manager.ts:71`  | Archival manager for cold/dormant memory promotion         | MEASURING |
| `SPECKIT_COACTIVATION`            | true    | `lib/cognitive/co-activation.ts:13`     | Co-activation scoring in trigger matching                  | MEASURING |

### Telemetry Flags

| Flag                              | Default | Source File                           | Purpose                                    | State     |
| --------------------------------- | ------- | ------------------------------------- | ------------------------------------------ | --------- |
| `SPECKIT_EXTENDED_TELEMETRY`      | true    | `lib/telemetry/retrieval-telemetry.ts:21`| 4-dimension retrieval metrics             | MEASURING |
| `SPECKIT_EVAL_LOGGING`            | false   | `lib/eval/eval-logger.ts:22`          | Write to eval DB (speckit-eval.db); T005 hook | INTRODUCED (T005) |

### Cognitive Config Flags (structured, not boolean)

| Flag                               | Default | Source File              | Purpose                           |
| ---------------------------------- | ------- | ------------------------ | --------------------------------- |
| `SPECKIT_COGNITIVE_COACTIVATION_PATTERN` | `\b(coactivation)\b` | `configs/cognitive.ts:45` | Regex pattern for co-activation matching |
| `SPECKIT_COGNITIVE_COACTIVATION_FLAGS`   | (empty) | `configs/cognitive.ts:46` | Regex flags for pattern above    |

---

## 4. B8 Signal Ceiling Inventory

Current active scoring signals (count toward 12-signal ceiling):

1. Vector similarity score (semantic embedding distance)
2. BM25 keyword score
3. FTS5 full-text score
4. RRF fusion score (SPECKIT_RRF)
5. MMR diversity reranking (SPECKIT_MMR)
6. Adaptive fusion intent weights (SPECKIT_ADAPTIVE_FUSION)
7. Session attention boost (SPECKIT_SESSION_BOOST)
8. Causal neighbor boost (SPECKIT_CAUSAL_BOOST)
9. Recency/decay score (FSRS v4 power-law)
10. Document type multiplier (10 types with weights)
11. Constitutional tier boost (3.0x constant)
12. Evidence-gap TRM signal (SPECKIT_TRM)

**Current count: 12 / 12 maximum.** At ceiling. Adding a new signal requires retiring an existing one until R13 automated eval is operational.

---

## 5. Monthly Audit Template

```
## Feature Flag Audit — [YYYY-MM-DD]

### Flags Reviewed
| Flag | State | Age (days) | Decision Due | Action |
| ---- | ----- | ---------- | ------------ | ------ |
| ... | ... | ... | ... | ... |

### Flags Past Deadline
[List any flags past 90-day or extension deadline]

### Flags Promoted
[List any flags promoted to ADOPT or RETIRE this cycle]

### Signal Ceiling Check
Active signals: X / 12
```
