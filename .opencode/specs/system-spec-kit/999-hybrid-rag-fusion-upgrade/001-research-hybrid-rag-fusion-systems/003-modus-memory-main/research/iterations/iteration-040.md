## Executive summary

Forty iterations converge on one rule: **import patterns, not backends**. Public should keep `memory_context`, `memory_search`, `session_bootstrap`, CocoIndex, code graph, and `generate-context.js` as the authorities, then add workflow guidance and narrowly scoped helper surfaces on top. The clearest first new API is **`memory_review`**. The safest near-term wins are **guidance, diagnostics, save ergonomics, and rollout gates**. The stable non-goals are now clear: **default write-on-read reinforcement, fuzzy cache reuse, monolithic `vault_*` routing, and markdown-first authority for spec memory**.  
[SOURCE: `research/research.md:90119-90183`; `research/iterations/iteration-035.md:8-45`; `research/iterations/iteration-036.md:8-45`; `research/iterations/iteration-038.md:8-46`; `research/iterations/iteration-039.md:7-53`]

## Top 10 recommendations ranked by impact x feasibility

*Score uses a 5x5 impact x feasibility scale.*

| Rank | Recommendation | Class | Score | Key evidence |
|---|---|---:|---:|---|
| 1 | Ship explicit graded `memory_review` first | adopt now | 25/25 | `research/research.md:90119-90125`; `tool-schemas.ts:297-317`; `fsrs-scheduler.ts:39-72,177-215` |
| 2 | Keep new UX as a thin facade over existing authorities and publish a workflow map | adopt now | 20/25 | `iteration-035.md:8-14`; `iteration-036.md:8-14`; `tool-schemas.ts:41-50,638-757` |
| 3 | Add a compact doctor/debug overlay over existing health and routing data | adopt now | 20/25 | `research/research.md:90127-90132`; `iteration-038.md:24-30` |
| 4 | Preserve one canonical retrieval core for all new memory-lane helpers | adopt now | 20/25 | `research/research.md:90134-90139`; `memory-search.ts:771-809` |
| 5 | Keep `generate-context.js` authoritative and wrap it with JSON-primary save ergonomics only | adopt now | 20/25 | `iteration-036.md:40-46`; `generate-context.js:61-93,333-345,379-382` |
| 6 | Require a rollout evidence pack before any public-surface change ships | adopt now | 20/25 | `iteration-038.md:40-46`; `iteration-039.md:23-29`; `iteration-034.md:32-45` |
| 7 | Improve continuity at startup and compaction boundaries | adopt now | 16/25 | `iteration-039.md:31-37`; `session-bootstrap.ts:150-190` |
| 8 | Prototype connected-doc hints as a low-authority appendix only | prototype later | 12/25 | `iteration-035.md:16-22`; `crossref.go:154-214`; `vault.go:75-101,901-924` |
| 9 | Prototype lexical expansion only for weak-result recovery inside `memory_search` | prototype later | 9/25 | `iteration-034.md:24-29`; `iteration-035.md:40-45`; `memory-search.ts:812-859` |
| 10 | Define `memory_due` only after `memory_review` stabilizes | NEW FEATURE | 8/25 | `research/research.md:90141-90146`; `iteration-038.md:16-22`; `fsrs-scheduler.ts:177-215` |

## Implementation priority order

1. Freeze the architecture boundary: wrappers only, no new competing authority lane.
2. Design and ship `memory_review`.
3. Publish the task-to-tool workflow map.
4. Add the doctor/debug overlay.
5. Add save ergonomics that compile to `generate-context --json/--stdin`.
6. Build the rollout evidence pack.
7. Improve startup and compaction continuity surfaces.
8. Write the `memory_due` ADR and public contract.
9. Prototype connected-doc appendix behavior behind a flag.
10. Prototype bounded lexical fallback behind a flag.

## One-page decision brief

- **Decision:** keep Public’s routed multi-lane architecture. Do not replace the hybrid retrieval core.
- **Build now:** `memory_review`, workflow guidance, doctor/debug summary, save ergonomics, and rollout gates.
- **Design next:** `memory_due` as an ADR-backed workflow, not an extension of `memory_validate` or `trackAccess`.
- **Prototype later:** connected-doc appendix and weak-result lexical fallback, both memory-lane only and explicitly non-authoritative.
- **Reject now:** default write-on-read reinforcement (`tool-schemas.ts:164-169`; `vault.go:311-316`), fuzzy Jaccard cache reuse (`research/research.md:90162-90167`; `iteration-034.md:16-20`), monolithic `vault_*` routing (`iteration-036.md:8-14`), and markdown-first authority for spec memory (`iteration-036.md:40-46`; `generate-context.js:379-382`).

**Blocked operational closeout:** packet file writes, strict validation rerun, and memory save could not be completed in this environment because workspace writes are currently denied.


Total usage est:        1 Premium request
API time spent:         6m 49s
Total session time:     7m 13s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  1.6m in, 27.3k out, 1.5m cached, 13.0k reasoning (Est. 1 Premium request)
 gpt-5.4-mini             258.2k in, 2.0k out, 217.1k cached, 1.1k reasoning (Est. 0 Premium
 requests)
