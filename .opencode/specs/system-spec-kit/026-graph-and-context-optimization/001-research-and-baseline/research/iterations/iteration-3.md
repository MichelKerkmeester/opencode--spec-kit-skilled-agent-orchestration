# Iteration 3 — Gap closure (Phases 3 + 4 + 5)

## Closure summary
| ID | Gap | Status | Tag | Confidence |
|---|---|---|---|---|
| G3.T93 | 93% token reduction benchmark honesty | partial | phase-1-extended | high |
| G3.MF | Mainframe privacy weakness | closed | phase-1-confirmed | high |
| G3.MX | Matrix room-state contention / lock semantics | closed | phase-1-extended | high |
| G3.GH | GitHub automation hardening | closed | phase-1-extended | high |
| G3.RQ | Repair-queue completion guarantees | closed | phase-1-extended | high |
| G4.T715 | 71.5x token reduction grounding | partial | phase-1-confirmed | high |
| G4.CG | Cache growth / GC / tombstones | closed | phase-1-confirmed | high |
| G4.LP | Cross-language extraction parity | closed | phase-1-confirmed | high |
| G4.IE | INFERRED edge-score inconsistency | closed | phase-1-extended | high |
| G4.MM | Mixed-corpus multimodal claim | partial | phase-1-confirmed | high |
| G4.PT | PreToolUse nudge effectiveness | UNKNOWN | phase-1-confirmed | medium |
| G5.FT | FTS4 creation + PRAGMA probe trustability | closed | phase-1-extended | medium |
| G5.SH | Stop-hook producer gaps for normalized analytics | closed | phase-1-confirmed | low |
| G5.CMD | Per-plugin `CLAUDE.md` direct inspection | closed | phase-1-confirmed | medium |
| G5.FB | `_build_fallback_context()` docstring drift | closed | phase-1-confirmed | high |
| G5.SE | Public `008-signal-extraction` split vs monolithic | closed | new-cross-phase | medium |

## Per-gap detail
### G3.T93 — 93% token reduction is estimated from fixed constants, not benchmarked against Public's typed stack
**Status:** partial
**Closure method:** combined
**Evidence:** [SOURCE: phase-3/research/research.md:145-153] [SOURCE: phase-3/implementation-summary.md:91-91] [SOURCE: 003-contextador/external/src/lib/core/stats.ts:26-28] [SOURCE: 003-contextador/external/README.md:13-19]
**Answer:** The 93% headline is estimate math, not a measured benchmark. `stats.ts` hard-codes both manual exploration and cache savings at 25,000 tokens, and the repo contains no side-by-side task benchmark against Public's CocoIndex+CodeGraph+Memory stack. [SOURCE: 003-contextador/external/src/lib/core/stats.ts:26-28] [SOURCE: 003-contextador/external/src/lib/core/stats.ts:75-85]
**Residual:** A real closure still needs paired task runs measuring answer quality and actual token counts against Public's typed retrieval surfaces. [SOURCE: phase-3/research/research.md:149-153]

### G3.MF — Mainframe privacy model is weakened by public_chat room creation and plaintext local credentials
**Status:** closed
**Closure method:** combined
**Evidence:** [SOURCE: phase-3/research/research.md:135-143] [SOURCE: 003-contextador/external/src/lib/mainframe/bridge.ts:26-55] [SOURCE: 003-contextador/external/src/lib/mainframe/client.ts:182-188] [SOURCE: 003-contextador/external/src/lib/mainframe/rooms.ts:37-53]
**Answer:** The weakness is source-confirmed. Mainframe stores reusable local credentials in `.contextador/mainframe-agent.json`, creates rooms with `visibility: "private"` but `preset: "public_chat"`, and broadcasts raw query text plus scopes, pointers, and token metadata into room history. [SOURCE: 003-contextador/external/src/lib/mainframe/bridge.ts:26-55] [SOURCE: 003-contextador/external/src/lib/mainframe/client.ts:182-188] [SOURCE: 003-contextador/external/src/lib/mainframe/rooms.ts:37-53]
**Residual:** No redaction, retention, or access-audit layer is shown anywhere in the checked-in implementation. [SOURCE: phase-3/research/research.md:138-143]

### G3.MX — Matrix room-state writes use optimistic blind updates with no atomic conflict semantics
**Status:** closed
**Closure method:** combined
**Evidence:** [SOURCE: phase-3/research/research.md:138-143] [SOURCE: phase-3/implementation-summary.md:125-125] [SOURCE: 003-contextador/external/src/lib/mainframe/bridge.ts:169-175] [SOURCE: 003-contextador/external/src/lib/mainframe/bridge.ts:217-237]
**Answer:** The contention story closes negatively. Budget state and janitor locks are optimistic read-modify-write records with no compare-and-swap or version check, and lock acquisition explicitly falls back to local sweeping on error. [SOURCE: 003-contextador/external/src/lib/mainframe/bridge.ts:169-175] [SOURCE: 003-contextador/external/src/lib/mainframe/bridge.ts:217-237]
**Residual:** The code path is clear, but the repo still has no multi-agent contention trace or integration test quantifying lost updates. [SOURCE: phase-3/implementation-summary.md:125-125]

### G3.GH — GitHub webhook automation lacks idempotency tracking, secret rotation, and routed failure notification
**Status:** closed
**Closure method:** combined
**Evidence:** [SOURCE: phase-3/research/research.md:215-223] [SOURCE: 003-contextador/external/src/lib/github/webhook.ts:35-40] [SOURCE: 003-contextador/external/src/lib/github/webhook.ts:73-90] [SOURCE: 003-contextador/external/src/lib/github/webhook.ts:231-275]
**Answer:** The automation is understandable but not hardened. The webhook handler verifies exactly one secret, logs events locally, and sweeps each push directly without any delivery-id dedupe or replay ledger. Failures surface as local action strings or HTTP responses, not a dedicated notification lane. [SOURCE: 003-contextador/external/src/lib/github/webhook.ts:35-40] [SOURCE: 003-contextador/external/src/lib/github/webhook.ts:73-90] [SOURCE: 003-contextador/external/src/lib/github/webhook.ts:231-275]
**Residual:** End-to-end retry, replay, and failure-notification behavior remains unproven because the checkout lacks real integration coverage. [SOURCE: phase-3/research/research.md:218-223]

### G3.RQ — Repair queue has no completion guarantee after regeneration failures
**Status:** closed
**Closure method:** combined
**Evidence:** [SOURCE: phase-3/research/research.md:105-113] [SOURCE: 003-contextador/external/src/lib/core/feedback.ts:73-97] [SOURCE: 003-contextador/external/src/lib/core/janitor.ts:89-146] [SOURCE: 003-contextador/external/src/lib/core/janitor.ts:216-223]
**Answer:** The queue offers eventual reattempt opportunity, not completion guarantees. Feedback only appends repair entries, janitor processes the queue once per run, failed items are written back for later, and some regeneration paths degrade to stubs or stamps rather than proven successful repair. [SOURCE: 003-contextador/external/src/lib/core/feedback.ts:73-97] [SOURCE: 003-contextador/external/src/lib/core/janitor.ts:89-146] [SOURCE: 003-contextador/external/src/lib/core/janitor.ts:216-223]
**Residual:** Regeneration quality and hand-edit preservation are still unmeasured even though queue semantics are now clear. [SOURCE: phase-3/research/research.md:108-113]

### G4.T715 — 71.5x token reduction is heuristic math, not Anthropic count_tokens-grounded
**Status:** partial
**Closure method:** combined
**Evidence:** [SOURCE: phase-4/research/research.md:68-68] [SOURCE: phase-4/implementation-summary.md:118-119] [SOURCE: 004-graphify/external/graphify/benchmark.py:9-18] [SOURCE: 004-graphify/external/graphify/benchmark.py:81-98]
**Answer:** The 71.5x number remains heuristic. The repo estimates tokens with a 4-chars-per-token rule, heuristic corpus-word conversion, and BFS subgraph rendering; there is no Anthropic `count_tokens` or equivalent model-grounded measurement in the checkout. [SOURCE: 004-graphify/external/graphify/benchmark.py:9-18] [SOURCE: 004-graphify/external/graphify/benchmark.py:81-98]
**Residual:** True closure needs model-token API counts on the same corpus and query set. [SOURCE: phase-4/implementation-summary.md:119-119]

### G4.CG — Graphify cache has monotonic growth, mtime-only incremental detection, and no deletion tombstones
**Status:** closed
**Closure method:** combined
**Evidence:** [SOURCE: phase-4/research/research.md:127-131] [SOURCE: phase-4/research/research.md:679-679] [SOURCE: 004-graphify/external/graphify/cache.py:41-63] [SOURCE: 004-graphify/external/graphify/detect.py:237-274]
**Answer:** The cache gap is real. Graphify combines a content-hash cache with an mtime manifest, but cache entries only accumulate until `clear_cache()` deletes everything, and incremental detection never tracks deleted files or orphaned cache records. [SOURCE: 004-graphify/external/graphify/cache.py:41-63] [SOURCE: 004-graphify/external/graphify/detect.py:237-274]
**Residual:** The repo still does not quantify long-run residue or stale-cache accumulation under repeated updates. [SOURCE: phase-4/research/research.md:131-131]

### G4.LP — Cross-language extraction parity is uneven and Swift is detected but never extracted
**Status:** closed
**Closure method:** combined
**Evidence:** [SOURCE: phase-4/research/research.md:621-623] [SOURCE: phase-4/implementation-summary.md:62-62] [SOURCE: 004-graphify/external/graphify/detect.py:19-22] [SOURCE: 004-graphify/external/graphify/extract.py:2367-2477] [SOURCE: 004-graphify/external/graphify/extract.py:2499-2506]
**Answer:** This closes decisively. Python alone gets rationale extraction and cross-file inference, the other 11 language extractors are materially thinner, and Swift is only advertised at detection time because both collection and dispatch omit it. [SOURCE: 004-graphify/external/graphify/detect.py:19-22] [SOURCE: 004-graphify/external/graphify/extract.py:2367-2477] [SOURCE: 004-graphify/external/graphify/extract.py:2499-2506]
**Residual:** No task-quality benchmark per language ships here, but the implementation asymmetry itself is no longer ambiguous. [SOURCE: phase-4/research/research.md:706-706]

### G4.IE — INFERRED confidence-score inconsistency does not drive built-in ranking, but it leaks into reports and exports
**Status:** closed
**Closure method:** combined
**Evidence:** [SOURCE: phase-4/research/research.md:128-128] [SOURCE: 004-graphify/external/graphify/analyze.py:143-146] [SOURCE: 004-graphify/external/graphify/analyze.py:229-236] [SOURCE: 004-graphify/external/graphify/report.py:27-29] [SOURCE: 004-graphify/external/graphify/export.py:250-272]
**Answer:** The inconsistency is real but currently non-fatal for ranking quality. Graphify's built-in ranking and surprise ordering use categorical confidence, not numeric `confidence_score`; the mixed 0.5 vs 0.4-0.9 values mainly affect exported JSON and report-level averages or displays. [SOURCE: 004-graphify/external/graphify/analyze.py:143-146] [SOURCE: 004-graphify/external/graphify/analyze.py:229-236] [SOURCE: 004-graphify/external/graphify/report.py:27-29]
**Residual:** Any downstream consumer that starts ranking directly on numeric scores would inherit the inconsistency immediately. [SOURCE: 004-graphify/external/graphify/export.py:250-272]

### G4.MM — mixed-corpus multimodal claim is not supported by the checked-in worked artifact
**Status:** partial
**Closure method:** combined
**Evidence:** [SOURCE: phase-4/research/research.md:683-685] [SOURCE: phase-4/implementation-summary.md:118-119] [SOURCE: 004-graphify/external/worked/mixed-corpus/GRAPH_REPORT.md:3-10] [SOURCE: 004-graphify/external/worked/karpathy-repos/GRAPH_REPORT.md:7-10] [SOURCE: 004-graphify/external/worked/mixed-corpus/review.md:96-122]
**Answer:** The checked-in artifact is stale or mislabeled relative to the multimodal narrative around it. `mixed-corpus/GRAPH_REPORT.md` is clearly code-only and shows zero token spend, but the repo still contains a different worked corpus with non-zero multimodal cost and a review that narrates image extraction for mixed-corpus. [SOURCE: 004-graphify/external/worked/mixed-corpus/GRAPH_REPORT.md:3-10] [SOURCE: 004-graphify/external/worked/karpathy-repos/GRAPH_REPORT.md:7-10] [SOURCE: 004-graphify/external/worked/mixed-corpus/review.md:96-122]
**Residual:** A fresh rerun or an honest relabel is still required to fully close the documentation gap. [SOURCE: phase-4/implementation-summary.md:118-118]

### G4.PT — PreToolUse Glob|Grep nudge effectiveness is still unmeasured
**Status:** UNKNOWN
**Closure method:** combined
**Evidence:** [SOURCE: phase-4/research/research.md:76-76] [SOURCE: phase-4/implementation-summary.md:46-46] [SOURCE: 004-graphify/external/graphify/__main__.py:9-21] [SOURCE: 004-graphify/external/README.md:54-60]
**Answer:** UNKNOWN. The repo proves the hook exists and documents the intended effect, but it never measures whether callers actually search less, read the graph first more often, or answer better because of the nudge. [SOURCE: 004-graphify/external/graphify/__main__.py:9-21] [SOURCE: 004-graphify/external/README.md:54-60]
**Residual:** Closure requires before/after telemetry or controlled task evaluation, not more source rereading. [SOURCE: phase-4/implementation-summary.md:46-46]

### G5.FT — Claudest truly supports PRAGMA-based FTS4 fallback, but Public's safe v1 remains FTS5 BM25 to LIKE
**Status:** closed
**Closure method:** combined
**Evidence:** [SOURCE: phase-5/research/research.md:107-113] [SOURCE: phase-5/implementation-summary.md:73-73] [SOURCE: phase-5/implementation-summary.md:125-125] [SOURCE: 005-claudest/external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/db.py:115-188] [SOURCE: 005-claudest/external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/db.py:195-205]
**Answer:** The Claudest pattern is source-real: it has alternate FTS5 and FTS4 schemas plus a PRAGMA-driven capability probe. That validates phase 5's narrowed Public recommendation: trust the smallest safe v1 only as `fts5_bm25 -> like_scan` until a packet actually adds alternate FTS4 DDL on the Public side. [SOURCE: 005-claudest/external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/db.py:115-188] [SOURCE: 005-claudest/external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/db.py:195-205] [SOURCE: phase-5/implementation-summary.md:125-125]
**Residual:** This closes the trust question at the documentation and source-pattern level, not as a new live Public runtime retest in iteration 3. [SOURCE: phase-5/implementation-summary.md:73-73]

### G5.SH — Stop hook still omits transcript_path persistence, cache-token carry-forward, and turn-level offsets
**Status:** closed
**Closure method:** phase-1-doc-reread
**Evidence:** [SOURCE: phase-5/research/research.md:613-616] [SOURCE: phase-5/implementation-summary.md:126-126] [SOURCE: phase-5/implementation-summary.md:158-158]
**Answer:** The ambiguity is already closed in phase 5's continuation docs. Public's current Stop hook is not yet a trustworthy producer for normalized analytics because transcript identity is not persisted, cache token fields do not survive, and replay remains session-level rather than turn-level. [SOURCE: phase-5/research/research.md:613-616]
**Residual:** Nothing new to infer from Claudest external files here; this gap remains blocked on a future Public producer patch. [SOURCE: phase-5/implementation-summary.md:158-158]

### G5.CMD — The claude-memory plugin-specific CLAUDE.md is absent in this checkout
**Status:** closed
**Closure method:** combined
**Evidence:** [SOURCE: phase-5/research/research.md:444-444] [SOURCE: 005-claudest/external/CLAUDE.md:1-5]
**Answer:** The anomaly holds. This checkout has a root `external/CLAUDE.md` for the whole marketplace repo, but no `external/plugins/claude-memory/CLAUDE.md`, so any plugin-local instruction layer still has to be reconstructed indirectly. [SOURCE: phase-5/research/research.md:444-444] [SOURCE: 005-claudest/external/CLAUDE.md:1-5]
**Residual:** None for this checkout. The missing file is a direct inspection outcome, not a lingering interpretation gap. [SOURCE: phase-5/research/research.md:444-444]

### G5.FB — Fallback-context docstring contradicts the implemented first-2 plus last-6 renderer
**Status:** closed
**Closure method:** combined
**Evidence:** [SOURCE: phase-5/research/research.md:198-200] [SOURCE: 005-claudest/external/plugins/claude-memory/hooks/memory-context.py:253-257] [SOURCE: 005-claudest/external/plugins/claude-memory/hooks/memory-context.py:311-346] [SOURCE: 005-claudest/external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/summarizer.py:343-349]
**Answer:** The docstring drift is fully source-proven. `_build_fallback_context()` still claims a last-3-exchanges render, but the implementation follows the summarizer's actual contract: render all exchanges for short sessions, otherwise render first 2, gap, and last 6. [SOURCE: 005-claudest/external/plugins/claude-memory/hooks/memory-context.py:253-257] [SOURCE: 005-claudest/external/plugins/claude-memory/hooks/memory-context.py:311-346] [SOURCE: 005-claudest/external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/summarizer.py:343-349]
**Residual:** None. This is a direct code-vs-doc mismatch rather than a measurement gap. [SOURCE: phase-5/research/research.md:198-200]

### G5.SE — Public's 008-signal-extraction packet is a monolithic extractor unification, not an auditor/discoverer split
**Status:** closed
**Closure method:** cross-repo
**Evidence:** [SOURCE: phase-5/research/research.md:219-235] [SOURCE: phase-5/research/research.md:438-438] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/008-signal-extraction/spec.md:69-84] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/008-signal-extraction/implementation-summary.md:35-40]
**Answer:** Public's `008-signal-extraction` packet is a unified semantic-extractor project, not a Claudest-style consolidation split. It centralizes extraction logic into one `SemanticSignalExtractor` and thin adapters, so the auditor/discoverer pattern recommended by phase 5 remains additive rather than already present. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/008-signal-extraction/spec.md:69-84] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/008-signal-extraction/implementation-summary.md:35-40]
**Residual:** None at the packet level; any later split would need to appear in a different Public spec packet. [SOURCE: phase-5/research/research.md:438-438]

## Cross-cutting observations
- Phase 3 and phase 4 both keep their headline token-savings numbers in the "credible direction, weak measurement" bucket: Contextador uses fixed savings constants, while Graphify uses heuristic token math rather than model-grounded counts. [SOURCE: phase-3/research/research.md:145-153] [SOURCE: phase-4/research/research.md:68-68]
- Contextador's most interesting reusable ideas are still ergonomics patterns rather than production-ready transport. Mainframe coordination, privacy, and webhook hardening all close negatively once source is reread carefully. [SOURCE: phase-3/research/research.md:135-143] [SOURCE: phase-3/research/research.md:215-223]
- Graphify's implementation gaps are mostly source-answerable rather than speculative: cache maintenance, cross-language asymmetry, and confidence-score semantics all become clearer with direct file inspection. [SOURCE: phase-4/research/research.md:127-131] [SOURCE: phase-4/research/research.md:621-635]
- The one true UNKNOWN in this iteration is measurement, not code shape: Graphify's PreToolUse nudge may be a good pattern, but the repo never measures its actual effect on agent behavior. [SOURCE: phase-4/research/research.md:76-76] [SOURCE: 004-graphify/external/README.md:54-60]
- Phase 5's remaining gaps were mostly documentation-resolution gaps because the underlying phase packet had already performed a later direct code audit against Public. The main new work here was validating external Claudest files and the cross-repo `008-signal-extraction` packet. [SOURCE: phase-5/implementation-summary.md:125-126] [SOURCE: phase-5/research/research.md:444-447]
- The cross-repo lookup matters: Public's `008-signal-extraction` packet currently unifies extractors into one engine, which is a very different architectural move from Claudest's verifier/discoverer consolidation split. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/008-signal-extraction/spec.md:69-84] [SOURCE: phase-5/research/research.md:219-235]

## Handoff to iteration 4
- Iteration 4 (Q-B Capability matrix) will use the closed/partial gaps as input.
