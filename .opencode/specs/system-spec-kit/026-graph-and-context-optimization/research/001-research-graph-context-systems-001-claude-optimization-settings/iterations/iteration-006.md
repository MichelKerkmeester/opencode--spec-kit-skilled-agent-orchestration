# Iteration 006 -- Phase-005 boundary, prioritization tiers, and gap matrix

## Iteration metadata
- run: 6
- focus: phase-005 boundary + prioritization tier table + gap matrix
- timestamp: 2026-04-06T10:27:13.042Z
- toolCallsUsed: 6
- status: insight
- newInfoRatio: 0.38
- findingsCount: 4

## Phase-005 overlap evidence
Phase `005-claudest` currently exposes prompt-level overlap evidence rather than a checked-in `spec.md` or `README`. The key implementation-overlap text is in its `phase-research-prompt.md`:

> "The same plugin also contains `get-token-insights`, the observability feature referenced indirectly by phase `001`. Treat Claudest as the implementation packet behind the audit narrative surfaced earlier in phase `001`, not as a separate unrelated tool." [SOURCE: `../005-claudest/phase-research-prompt.md:34-35`]

> "Phase 001 extracts patterns from the Reddit post; 005 examines the implementation." [SOURCE: `../005-claudest/phase-research-prompt.md:40-45`]

That matches this phase's own scope statement:

> "This phase does not own the plugin implementation. It owns the audit method, the waste taxonomy, the hook concepts, and the configuration implications for `Code_Environment/Public`." [SOURCE: `phase-research-prompt.md:19-20`]

## Deliverable ownership split
| Owned by phase 001 (`001-claude-optimization-settings`) | Owned by phase 005 (`005-claudest`) |
|---|---|
| Reddit-post evidence extraction and discrepancy handling | Source-proven Claudest implementation walkthrough |
| Repo-local config/hook/process recommendations for Public | `claude-memory` plugin internals, marketplace structure, plugin manifests |
| Waste taxonomy, hook-fit analysis, and adoption labels | `get-token-insights` ingestion pipeline, dashboard contracts, SQLite/FTS details |
| Prioritization framework and tier ranking for what to adopt now vs later | Implementation-backed proof for how the auditor actually works |
| Cross-check against Public's current `.claude/settings.local.json` and `CLAUDE.md` | Cross-check against Claudest source paths under `external/plugins/` and `.claude-plugin/` |

## Boundary paragraph for later synthesis
Phase `001-claude-optimization-settings` owns the **problem framing and repo decision layer**: extract what the Reddit post proves, preserve source discrepancies, classify waste patterns, decide which config, hook, and behavior changes Public should adopt now versus prototype later, and keep the analysis aligned with Public's current Claude rulebook. Phase `005-claudest` owns the **implementation provenance layer**: inspect the Claudest marketplace, `claude-memory`, and `get-token-insights` source to explain how the auditor, memory layer, and dashboard are actually built. The allowed overlap is therefore one-way and narrow: phase `001` may cite phase `005` only to point at the concrete implementation home of the auditor, while phase `005` may cite phase `001` only to explain why the implementation matters. [SOURCE: `phase-research-prompt.md:19-20,25,52,104,157-160`; `../005-claudest/phase-research-prompt.md:34-35,40-45,63,141-169`]

## Ranked priority table across iterations 1-5
The governing order remains the prompt's section 10.3 sequence: config baselines first, hook prototypes second, behavioral rules third, instrumentation-heavy work last. [SOURCE: `phase-research-prompt.md:163-170`]

| Tier | Finding ref | Title | Recommendation | Affected area | Source iteration |
|---|---|---|---|---|---|
| 1 | I1-F1 | ENABLE_TOOL_SEARCH is already the highest-leverage baseline | adopt now after light validation | `.claude/settings.local.json` | iteration-001 |
| 1 | I5-F1 | ENABLE_TOOL_SEARCH is now a validation question, not a missing config | adopt now after light validation | `.claude/settings.local.json`, `/context` validation | iteration-005 |
| 1 | I5-F2 | Do not infer latency or discoverability gains from the Reddit claim alone | adopt now as a config-scoping rule | research synthesis, validation plan | iteration-005 |
| 1 | I5-F4 | Treat additional cache-warning flags as repo-local experiments, not post-backed settings | adopt now as a config-scoping rule | settings checklist, hook planning | iteration-005 |
| 2 | I1-F2 | Cache expiry is the dominant waste pattern | prototype later via warning hooks | Claude hook surface | iteration-001 |
| 2 | I1-F3 | The three-hook cache-warning design only partially fits current architecture | prototype later | Claude hooks + settings | iteration-001 |
| 2 | I2-F1 | Merge Stop timestamp capture into the existing async Stop handler | prototype later inside existing hook | `session-stop.js`, hook state | iteration-002 |
| 2 | I2-F2 | Add a dedicated UserPromptSubmit warning hook instead of overloading existing hooks | prototype later | new pre-send hook + settings | iteration-002 |
| 2 | I2-F3 | Put resume-cost estimation inside `session-prime.js` | prototype later inside existing hook | `session-prime.js`, `session-stop.js` | iteration-002 |
| 2 | I2-F4 | Keep `compact-inject.js` as mitigation target, not warning owner | reject as hook placement | `compact-inject.js` boundary | iteration-002 |
| 2 | I2-F5 | Reuse the shared hook-state file as the cache-warning seam | prototype later as hook-state extension | `hook-state.js` + Claude hooks | iteration-002 |
| 3 | I1-F4 | Prefer fresh-session recovery over blind stale resume | adopt now via workflow guidance | `CLAUDE.md`, recovery guidance | iteration-001 |
| 3 | I1-F7 | Treat redundant rereads as cache-multiplied behavioral waste | adopt now via read-discipline guidance | `CLAUDE.md` read workflow | iteration-001 |
| 3 | I1-F8 | Reinforce native-tool usage before automating detection | adopt now via workflow rules | `CLAUDE.md` tool routing | iteration-001 |
| 3 | I3-F1 | Bash-vs-native is primarily a prompt-rule reinforcement problem | adopt now via documentation | `CLAUDE.md`, `.claude/CLAUDE.md` | iteration-003 |
| 3 | I3-F6 | Gate 2 helps distribute policy but is not a detector | adopt now as routing clarification | skill routing docs | iteration-003 |
| 3 | I4-F3 | Preserve the 926-vs-858 discrepancy explicitly in synthesis | adopt now in research/reporting rules | `research/research.md`, decision records | iteration-004 |
| 3 | I5-F3 | Break edit-retry chains with reread/replan guidance after first miss | adopt now via guardrail messaging | `CLAUDE.md`, edit workflow | iteration-005 |
| 4 | I1-F5 | JSONL -> SQLite -> dashboard audit pipeline is the missing observability layer | prototype later | transcript auditor, dashboard | iteration-001 |
| 4 | I1-F6 | Low-usage skill decisions need usage telemetry, not intuition | prototype later | skill-usage analytics | iteration-001 |
| 4 | I3-F2 | Reread detection needs normalized per-file telemetry | prototype later | metrics + postflight audit | iteration-003 |
| 4 | I3-F3 | Edit retry chains need failure-sequence telemetry | prototype later | edit-failure metrics + reducer | iteration-003 |
| 4 | I3-F4 | Waste enforcement should be offline-first and reducer-driven | prototype later | JSONL reducer + metric taxonomy | iteration-003 |
| 4 | I3-F5 | RTK-style output filtering is only a secondary shell mitigation | prototype later | shell-wrapper tooling | iteration-003 |
| 4 | I4-F1 | Share analysis layers, keep transcript ingest runtime-specific | prototype later | shared schema + adapters | iteration-004 |
| 4 | I4-F2 | Reverse-engineered Claude JSONL must stay a volatile adapter, not core infra | prototype later with fail-closed parser guards | transcript ingest boundary | iteration-004 |
| 4 | I4-F4 | Rank rereads by cache-amplified exposure, not flat counts | prototype later | ranking methodology | iteration-004 |
| 4 | I4-F5 | Cross-agent rollout should start with shared schema/dashboard, not unified ingest | prototype later | cross-CLI observability | iteration-004 |

## Findings
### Finding S1: Phase 005 is the implementation packet; this phase is the adoption-and-boundary packet
- Supporting prior refs: I1-F5, I2-F1, I2-F3, I4-F1, I5-F4.
- Source quote: "Treat Claudest as the implementation packet behind the audit narrative surfaced earlier in phase `001`..." and "Phase 001 extracts patterns from the Reddit post; 005 examines the implementation." [SOURCE: `../005-claudest/phase-research-prompt.md:34-35,40-45`]
- What it changes in synthesis: future `research.md` prose should cite phase `005` only when naming where `get-token-insights` lives or when deferring implementation detail, not when restating Public-facing adoption decisions.
- Recommendation label: adopt now.
- Affected area: cross-phase boundary language in `research/research.md`.

### Finding S2: Tier-1 work is intentionally narrow because the only post-backed config move is already present
- Supporting prior refs: I1-F1, I5-F1, I5-F2, I5-F4.
- Source quote: "high-impact / low-effort config changes such as `ENABLE_TOOL_SEARCH` -> adopt now after light validation" [SOURCE: `phase-research-prompt.md:167-168`]
- What it means: iteration 6 collapses the "config" lane to baseline validation, honest claim-scoping, and refusal to invent additional post-backed settings that the source never actually specified.
- Recommendation label: adopt now.
- Affected area: config checklist and final recommendation ordering.

### Finding S3: The prompt's tiering cleanly separates immediate documentation changes from later hook work
- Supporting prior refs: I1-F4, I1-F7, I1-F8, I2-F1, I2-F2, I2-F3, I2-F5, I3-F1, I3-F6, I5-F3.
- Source quote: "high-impact / medium-effort hooks ... -> prototype later" and "behavioral changes ... -> adopt now via documentation and workflow rules" [SOURCE: `phase-research-prompt.md:168-169`]
- What it means: stale-session guidance, bash discipline, reread discipline, discrepancy preservation, and edit-miss re-anchoring belong in the "adopt now" lane, while Stop/UserPromptSubmit/SessionStart cache-warning mechanics stay in prototype planning.
- Recommendation label: adopt now for documentation; prototype later for hooks.
- Affected area: final prioritized recommendation set.

### Finding S4: The remaining hard questions are measurement questions, not conceptual ones
- Supporting prior refs: I1-F6, I3-F2, I3-F3, I3-F4, I4-F1, I4-F2, I4-F5.
- Source quote: "instrumentation-heavy or format-fragile ideas ... -> prototype later unless the observability gap is severe" [SOURCE: `phase-research-prompt.md:170-170`]
- What it means: the unresolved work is mostly empirical and systems-heavy: local deferred-loading A/Bs, low-usage skill thresholds, cache-safe cost modeling, reread/edit-retry reducers, and guarded JSONL adapters.
- Recommendation label: prototype later.
- Affected area: iteration-7 scope selection and later implementation planning.

## Research-question gap matrix
| Q# | Status | Evidence / remaining gap |
|---|---|---|
| 1 | Answered | `ENABLE_TOOL_SEARCH` proof and credibility are covered by I1-F1, I5-F1, and I5-F2. |
| 2 | Partially answered | I5-F1 and I5-F2 define the risk inventory, but Public still lacks repo-local A/B evidence for first-tool latency, discoverability, and workflow ergonomics. |
| 3 | Partially answered | I1-F2 establishes cache expiry as the dominant directional waste source, and I4-F3 preserves the denominator mismatch, but Public still lacks local modeling/calibration. |
| 4 | Answered | Config vs hook vs behavior separation is covered by I1-F2, I1-F3, I1-F4, I2-F1 through I2-F5, and I5-F4. |
| 5 | Partially answered | I1-F6, I4-F1, and I4-F5 define the telemetry-first method, but the repo still lacks a local disable threshold beyond usage plus impact review. |
| 6 | Answered | I1-F7, I3-F2, and I4-F4 cover prompt rules, detector shape, and cache-amplified ranking. |
| 7 | Answered | I1-F8, I3-F1, I3-F4, and I3-F6 cover seriousness, policy reinforcement, and the layered enforcement model. |
| 8 | Partially answered | I3-F3 and I5-F3 clarify guardrail implications, but root-cause partitioning between prompt quality, workflow design, and messaging remains open. |
| 9 | Answered | I1-F3 plus I2-F1 through I2-F5 fully cover fit with the current hook architecture. |
| 10 | Answered | Iteration 003's Q10 note plus I4-F1 and I4-F2 separate direct JSONL signals from heuristic cost models. |
| 11 | Answered | I4-F1 and I4-F5 cover portability, shared-schema reuse, and the need for per-runtime adapters. |
| 12 | Answered | I4-F2 directly answers JSONL fragility risk and its effect on adoption priority. |

## Recommended iteration-7 focus
Iteration 7 should concentrate on the still-open empirical gaps: Q2 (deferred-loading ergonomics), Q3 (repo-local cache-expiry modeling), Q5 (skill-disable evidence threshold), and Q8 (edit-retry root-cause partitioning). Those are the only questions still blocked on missing measurement rather than missing synthesis.
