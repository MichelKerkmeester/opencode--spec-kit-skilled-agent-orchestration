# Manual Test Playbooks (Merged)

This merged playbook combines:
- Codex 5.3 xhigh canonical per-feature matrix (full 151-feature mapping)
- Gemini 3.1 Pro Preview scenario-pack overlays (operator execution bundles)

Canonical source artifacts:
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/manual-testing-playbook/memory/05-03-26_13-48__generic-memory-filename-fix.md`
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/manual-testing-playbook/memory/05-03-26_15-17__spec-memory-search-state-filter-fix.md`
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/manual-testing-playbook/subagent-utilization-ledger.md`

## Global Preconditions
1. Working directory is project root.
2. Feature summary files are accessible.
3. Spec/memory commands are available in the runtime.
4. Manual execution logging is enabled (terminal transcript capture).
5. Destructive scenarios (`EX-008`, `EX-009`, `EX-018`, `EX-021`) MUST run only in a disposable sandbox spec folder (for example `specs/test-sandbox`), never in active project folders.
6. Before each destructive scenario, create and record a named checkpoint for rollback evidence.

## Global Evidence Requirements
- Command transcript
- Prompt used
- Output snippets
- Artifact path or output reference
- Scenario verdict with rationale

## Deterministic Command Notation
- Replace placeholders before execution: `<target-spec>`, `<sandbox-spec>`, `<memory-id>`, `<checkpoint-name>`.
- Do not execute literal ellipsis (`...`) or omitted-argument forms; transcripts must contain fully resolved commands.
- For shorthand tool syntax, execute with explicit argument keys in runtime calls.

## Existing Features (`EX-001..EX-034`)

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| EX-001 | Unified context retrieval (memory_context) | Intent-aware context pull | `Use memory_context in auto mode for: fix flaky index scan retry logic` | `memory_match_triggers(...)` -> `memory_context(mode:auto,sessionId:ex001)` -> `memory_context(mode:focused,sessionId:ex001)` | Relevant bounded context returned; no empty response | Tool outputs + mode selection | PASS if relevant context returned in both calls | Check specFolder/intent mismatch, retry with explicit intent |
| EX-002 | Semantic and lexical search (memory_search) | Hybrid precision check | `Search for checkpoint restore clearExisting transaction rollback` | `memory_search(query,...limit:20)` -> rerank variant | Relevant ranked results with hybrid signals | Search output snapshot | PASS if top results match query intent | Lower minState; disable cache and retry |
| EX-003 | Trigger phrase matching (memory_match_triggers) | Fast recall path | `Run trigger matching for resume previous session blockers with cognitive=true` | `memory_match_triggers(prompt,include_cognitive:true,sessionId:ex003)` | Fast trigger hits + cognitive enrichment | Trigger output | PASS if matched triggers returned with cognitive fields | Retry with higher-quality trigger phrase |
| EX-004 | Hybrid search pipeline | Channel fusion sanity | `Validate graph search fallback tiers behavior` | `memory_search(query,limit:25)` -> `memory_search(bypassCache:true)` | Non-empty diverse results; fallback not empty | Both run outputs | PASS if channels contribute and no empty tail | Force fallback tier, inspect flags |
| EX-005 | 4-stage pipeline architecture | Stage invariant verification | `Search Stage4Invariant score snapshot verifyScoreInvariant` | `memory_search(query,intent:understand)` | No invariant errors; stable final scoring | Output + logs | PASS if no score-mutation symptoms | Inspect stage metadata and flags |
| EX-006 | Memory indexing (memory_save) | New memory ingestion | `Index memory file and report action` | `memory_save(filePath)` -> `memory_stats()` -> `memory_search(title)` | Save action reported; searchable result appears | Save output + follow-up search | PASS if indexed and retrievable | Validate file path/type and content quality |
| EX-007 | Memory metadata update (memory_update) | Metadata + re-embed update | `Update memory title and triggers` | `memory_update(id,title,triggers)` -> `memory_search(new title)` | Updated metadata reflected in retrieval | Update output + search | PASS if updated title retrievable | Retry with allowPartialUpdate if embedding fails |
| EX-008 | Single and folder delete (memory_delete) | Atomic single delete | `Delete memory ID and verify removal` | `checkpoint_create(name:"pre-ex008-delete",specFolder:"<sandbox-spec>")` -> `memory_delete(id)` -> `memory_search(old title)` | Deleted item absent from retrieval | Delete output + search | PASS if deleted item not found and checkpoint exists | Restore `pre-ex008-delete`; verify sandbox folder |
| EX-009 | Tier-based bulk deletion (memory_bulk_delete) | Tier cleanup with safety | `Delete deprecated tier in scoped folder` | `checkpoint_create(name:"pre-ex009-bulk-delete",specFolder:"<sandbox-spec>")` -> `memory_bulk_delete(tier,specFolder:"<sandbox-spec>")` -> `checkpoint_list(specFolder:"<sandbox-spec>")` | Deletion count + checkpoint created | Bulk delete output | PASS if scoped deletions in sandbox and checkpoint present | Re-run with explicit scope; restore `pre-ex009-bulk-delete` if needed |
| EX-010 | Validation feedback (memory_validate) | Feedback learning loop | `Record positive validation with queryId` | `memory_validate(memoryId,helpful:true,queryId)` | Confidence/promotion metadata updates | Validation response | PASS if feedback persisted and metadata returned | Retry with valid memoryId/queryId |
| EX-011 | Memory browser (memory_list) | Folder inventory audit | `List memories in target spec folder` | `memory_list(specFolder,limit,offset)` | Paginated list and totals | List output | PASS if browsable inventory returned | Reduce filters; verify specFolder path |
| EX-012 | System statistics (memory_stats) | System baseline snapshot | `Return stats with composite ranking` | `memory_stats(ranking:composite,includeScores:true)` | Counts, tiers, folder ranking present | Stats output | PASS if dashboard fields populated | Retry with default ranking on scoring error |
| EX-013 | Health diagnostics (memory_health) | Index/FTS integrity check | `Run full health and divergent_aliases` | `memory_health(reportMode:full)` -> `memory_health(reportMode:divergent_aliases)` | healthy/degraded status and diagnostics | Health outputs | PASS if report completes with actionable diagnostics | Run index_scan(force) if FTS mismatch |
| EX-014 | Workspace scanning and indexing (memory_index_scan) | Incremental sync run | `Run index scan for changed docs` | `memory_index_scan(force:false)` -> `memory_stats()` | Scan summary and updated index state | Scan output | PASS if changed files reflected | Retry force:true if drift remains |
| EX-015 | Checkpoint creation (checkpoint_create) | Pre-destructive backup | `Create checkpoint pre-bulk-delete` | `checkpoint_create(name,specFolder)` -> `checkpoint_list()` | New checkpoint listed | Create/list outputs | PASS if checkpoint discoverable | Validate folder and naming rules |
| EX-016 | Checkpoint listing (checkpoint_list) | Recovery asset discovery | `List checkpoints newest first` | `checkpoint_list(specFolder,limit)` | Available restore points displayed | List output | PASS if checkpoints returned | Remove spec filter if empty |
| EX-017 | Checkpoint restore (checkpoint_restore) | Rollback restore drill | `Restore checkpoint with merge mode` | `checkpoint_restore(name,clearExisting:false)` -> `memory_health()` | Restored data + healthy state | Restore output + search proof | PASS if known record restored | Retry with clearExisting based on conflict |
| EX-018 | Checkpoint deletion (checkpoint_delete) | Old snapshot cleanup | `Delete stale checkpoint by name` | `checkpoint_list(specFolder:"<sandbox-spec>")` -> `checkpoint_delete(name:"<checkpoint-name>",confirmName:"<checkpoint-name>")` -> `checkpoint_list(specFolder:"<sandbox-spec>")` | Removed checkpoint absent from list | Before/after list outputs | PASS if checkpoint removed from sandbox list | Validate name, `confirmName`, and sandbox scope; retry |
| EX-019 | Causal edge creation (memory_causal_link) | Causal provenance linking | `Link source->target supports strength 0.8` | `memory_causal_link(...)` -> `memory_drift_why(...)` | Edge appears in chain trace | Link + trace outputs | PASS if relation visible in trace | Validate IDs/relation type |
| EX-020 | Causal graph statistics (memory_causal_stats) | Graph coverage review | `Return causal stats and coverage` | `memory_causal_stats()` | Coverage and edge metrics present | Stats output | PASS if metrics returned | Rebuild causal edges if empty |
| EX-021 | Causal edge deletion (memory_causal_unlink) | Edge correction | `Delete edge and re-trace` | `checkpoint_create(name:"pre-ex021-causal-unlink",specFolder:"<sandbox-spec>")` -> `memory_causal_unlink(edgeId)` -> `memory_drift_why(...)` | Removed edge absent in trace | Unlink + trace outputs | PASS if edge removed and checkpoint exists | Verify edgeId exists; restore `pre-ex021-causal-unlink` if wrong edge removed |
| EX-022 | Causal chain tracing (memory_drift_why) | Decision why-trace | `Trace both directions to depth 4` | `memory_drift_why(memoryId,direction:both,maxDepth:4)` | Chain includes expected relations | Trace output | PASS if causal path returned | Lower depth/rel filters if empty |
| EX-023 | Epistemic baseline capture (task_preflight) | Pre-task baseline logging | `Create preflight for pipeline-v2-audit` | `task_preflight(specFolder,taskId,knowledge,uncertainty,contextCompleteness)` | Baseline record created | Preflight output | PASS if baseline persisted | Retry with complete fields |
| EX-024 | Post-task learning measurement (task_postflight) | Learning closeout | `Complete postflight for pipeline-v2-audit` | `task_postflight(...)` | Delta/learning record saved | Postflight output | PASS if completion recorded | Verify taskId matches preflight |
| EX-025 | Learning history (memory_get_learning_history) | Trend review | `Show completed learning history` | `memory_get_learning_history(specFolder,onlyComplete:true)` | Historical entries returned | History output | PASS if completed cycles listed | Remove filter if no results |
| EX-026 | Ablation studies (eval_run_ablation) | Channel impact experiment | `Run ablation on retrieval channels` | `eval_run_ablation(...)` -> `eval_reporting_dashboard(...)` | Per-channel deltas reported | Ablation + dashboard outputs | PASS if run produces metrics/verdict | Validate eval dataset setup |
| EX-027 | Reporting dashboard (eval_reporting_dashboard) | Eval reporting pass | `Generate latest markdown dashboard` | `eval_reporting_dashboard(format:markdown)` | Trend/channel/summary data present | Dashboard output | PASS if report generated without error | Fallback JSON format if markdown fails |
| EX-028 | 1. Search Pipeline Features (SPECKIT_*) | Flag catalog verification | `List SPECKIT flags active/inert/deprecated` | `memory_search("SPECKIT_* ...")` + `memory_context(deep)` | Accurate flag classification | Search/context outputs | PASS if classifications are internally consistent | Validate against code/config docs |
| EX-029 | 2. Session and Cache | Session policy audit | `Retrieve dedup/cache policy settings` | `memory_search("DISABLE_SESSION_DEDUP ...")` | Session/cache controls found | Search output | PASS if all required keys surfaced | Expand query terms |
| EX-030 | 3. MCP Configuration | MCP limits audit | `Find MCP validation settings defaults` | `memory_search("MCP_MAX_MEMORY_TOKENS ...")` | MCP guardrails returned | Search output | PASS if defaults + keys identified | Verify in config files directly |
| EX-031 | 4. Memory and Storage | Storage precedence check | `Explain DB path precedence env vars` | `memory_search("SPEC_KIT_DB_DIR ...")` + `memory_context(focused)` | Precedence chain identified | Search/context output | PASS if precedence is unambiguous | Cross-check startup config loader |
| EX-032 | 5. Embedding and API | Provider selection audit | `Retrieve embedding provider selection rules` | `memory_search("EMBEDDINGS_PROVIDER auto ...")` | Provider rules and key precedence shown | Search output | PASS if provider routing is clear | Verify env in runtime |
| EX-033 | 6. Debug and Telemetry | Observability toggle check | `List telemetry/debug vars and inert flags` | `memory_search("DEBUG_TRIGGER_MATCHER ... inert")` | Debug/telemetry controls identified | Search output | PASS if active vs inert clearly separated | Check feature flag governance section |
| EX-034 | 7. CI and Build (informational) | Branch metadata source audit | `Find branch env vars used in checkpoint metadata` | `memory_search("GIT_BRANCH BRANCH_NAME ...")` | Branch source vars surfaced | Search output | PASS if all listed vars are found | Search CI scripts and runtime helpers |

## New Features (`NEW-001..NEW-119`)

Note: Each NEW scenario uses this evidence+verdict baseline unless overridden:
- Evidence: command transcript + key output snapshot + any DB/log artifact
- PASS: expected feature behavior observed with no contradictory signal
- FAIL: missing/contradictory behavior; triage with likely cause + retry + escalation owner

| Feature ID | Feature Name | Scenario + Objective | Exact Prompt | Exact Command Sequence |
|---|---|---|---|---|
| NEW-001 | Graph channel ID fix (G1) | Confirm graph hits are non-zero when edges exist | `Verify Graph channel ID fix (G1) manually with causal-edge data.` | 1) Create linked memories 2) Run graph-capable query 3) Verify graph hits |
| NEW-002 | Chunk collapse deduplication (G3) | Confirm dedup in default mode | `Validate chunk collapse deduplication (G3) in default search mode.` | 1) Save multi-chunk overlap 2) `memory_search(includeContent:false)` 3) Verify no duplicates |
| NEW-003 | Co-activation fan-effect divisor (R17) | Confirm hub dampening | `Verify co-activation fan-effect divisor (R17).` | 1) Create high-degree hub 2) Run repeated queries 3) Compare dominance |
| NEW-004 | SHA-256 content-hash deduplication (TM-02) | Confirm identical re-save skips embedding | `Check SHA-256 dedup (TM-02) on re-save.` | 1) Save once 2) Save identical payload 3) Verify embedding skipped |
| NEW-005 | Evaluation database and schema (R13-S1) | Confirm eval data isolation | `Verify evaluation DB/schema writes.` | 1) Trigger retrieval events 2) Query eval DB tables 3) Confirm isolation |
| NEW-006 | Core metric computation (R13-S1) | Confirm metric battery outputs | `Validate core metric computation (R13-S1).` | 1) Seed ground truth 2) Run eval metrics 3) Verify metric set |
| NEW-007 | Observer effect mitigation (D4) | Confirm non-blocking logging failures | `Check observer effect mitigation (D4).` | 1) Induce eval logging failure 2) Run search 3) Confirm search unaffected |
| NEW-008 | Full-context ceiling evaluation (A2) | Confirm ceiling benchmark run | `Run full-context ceiling evaluation (A2).` | 1) Build title/summary corpus 2) Run ceiling ranking 3) Compare with hybrid/BM25 |
| NEW-009 | Quality proxy formula (B7) | Confirm proxy formula correctness | `Compute and verify quality proxy formula (B7).` | 1) Export logs 2) Compute formula manually 3) Compare stored value |
| NEW-010 | Synthetic ground truth corpus (G-NEW-1, G-NEW-3 phase A) | Confirm corpus coverage and hard negatives | `Audit synthetic ground-truth corpus coverage.` | 1) Open corpus 2) Count intents/tiers 3) Verify hard negatives/non-trigger prompts |
| NEW-011 | BM25-only baseline (G-NEW-1) | Confirm baseline reproducibility | `Run BM25-only baseline measurement.` | 1) Disable non-BM25 channels 2) Run corpus 3) Record MRR@5 |
| NEW-012 | Agent consumption instrumentation (G-NEW-2) | Confirm wiring with inert runtime | `Validate G-NEW-2 instrumentation behavior.` | 1) Trigger retrieval handlers 2) Inspect logger gate 3) Confirm no-op telemetry |
| NEW-013 | Scoring observability (T010) | Confirm sample logging + fail-safe | `Verify scoring observability (T010).` | 1) Run many searches 2) Inspect sampled rows 3) Force write error and confirm safety |
| NEW-014 | Full reporting and ablation study framework (R13-S3) | Confirm ablation+report workflow | `Execute manual ablation run (R13-S3).` | 1) Run ablation channel-off 2) Check snapshots 3) Validate dashboard |
| NEW-015 | Shadow scoring and channel attribution (R13-S2) | Confirm shadow deactivation and attribution continuity | `Verify shadow scoring deactivation and attribution continuity.` | 1) Trigger shadow flags 2) Confirm inert behavior 3) Check attribution metadata |
| NEW-016 | Typed-weighted degree channel (R4) | Confirm bounded typed-degree boost | `Test typed-weighted degree channel (R4).` | 1) Create varied edge types 2) Query 3) Verify caps/fallback |
| NEW-017 | Co-activation boost strength increase (A7) | Confirm multiplier impact | `Compare co-activation strength values for A7.` | 1) Baseline run 2) Increase strength 3) Compare contribution |
| NEW-018 | Edge density measurement | Confirm edges-per-node thresholding | `Verify edge density measurement and gate behavior.` | 1) Query edge+node counts 2) Compute ratio 3) Check threshold handling |
| NEW-019 | Weight history audit tracking | Confirm edge change logging + rollback | `Validate weight history audit tracking.` | 1) Mutate edge strengths 2) Inspect audit rows 3) Run rollback |
| NEW-020 | Graph momentum scoring (N2a) | Confirm 7-day delta bonus | `Verify graph momentum scoring (N2a).` | 1) Seed snapshots now/7d 2) Query 3) Verify capped bonus |
| NEW-021 | Causal depth signal (N2b) | Confirm normalized depth scoring | `Test causal depth signal (N2b).` | 1) Build multi-level graph 2) Score depth 3) Verify normalized output |
| NEW-022 | Community detection (N2c) | Confirm community boost injection | `Validate community detection (N2c).` | 1) Create communities 2) Recompute 3) Verify co-member injection/caps |
| NEW-023 | Score normalization | Confirm batch min-max behavior | `Verify score normalization output ranges.` | 1) Run varied-score query 2) Inspect normalized range 3) Check equal/single cases |
| NEW-024 | Cold-start novelty boost (N4) | Confirm novelty removed from hot path | `Confirm N4 novelty hot-path removal.` | 1) Inspect code path 2) Run search 3) Verify telemetry fixed to zero |
| NEW-025 | Interference scoring (TM-01) | Confirm cluster penalty | `Validate interference scoring (TM-01).` | 1) Save near-duplicates 2) Query 3) Verify penalty impact |
| NEW-026 | Classification-based decay (TM-03) | Confirm class+tier decay matrix | `Verify TM-03 classification-based decay.` | 1) Save tier/class mix 2) Query scoring path 3) Validate multipliers |
| NEW-027 | Folder-level relevance scoring (PI-A1) | Confirm folder-first retrieval | `Validate folder-level relevance scoring (PI-A1).` | 1) Create varied folders 2) Run global query 3) Verify folder pre-ranking |
| NEW-028 | Embedding cache (R18) | Confirm cache hit/miss behavior | `Verify embedding cache (R18).` | 1) Embed content/model pair 2) Repeat 3) Confirm hit and metadata update |
| NEW-029 | Double intent weighting investigation (G2) | Confirm no hybrid double-weight | `Validate G2 guard in active pipeline.` | 1) Run hybrid query 2) Inspect stage trace 3) Confirm stage-2 intent skip |
| NEW-030 | RRF K-value sensitivity analysis (FUT-5) | Confirm K sensitivity measurements | `Run RRF K sensitivity analysis.` | 1) Run K grid 2) Compare metrics 3) Select best K rationale |
| NEW-031 | Negative feedback confidence signal (A4) | Confirm demotion floor+recovery | `Verify negative feedback confidence (A4).` | 1) Submit negatives 2) Query multiplier 3) Verify floor/half-life recovery |
| NEW-032 | Auto-promotion on validation (T002a) | Confirm promotion thresholds/throttle | `Validate auto-promotion on validation (T002a).` | 1) Submit positive validations 2) Check tier changes 3) Verify throttle/audit |
| NEW-033 | Query complexity router (R15) | Confirm query-class routing | `Verify query complexity router (R15).` | 1) Run simple/moderate/complex 2) Inspect selected channels 3) Disable flag fallback |
| NEW-034 | Relative score fusion in shadow mode (R14/N1) | Confirm RSF inert in live ranking | `Check RSF shadow behavior post-cleanup.` | 1) Inspect branch conditions 2) Run queries 3) Confirm RRF live ranking |
| NEW-035 | Channel min-representation (R2) | Confirm top-k channel diversity rule | `Validate channel min-representation (R2).` | 1) Run dominance query 2) Inspect pre/post representation 3) Verify quality floor |
| NEW-036 | Confidence-based result truncation (R15-ext) | Confirm relevance-cliff cutoff | `Verify confidence-based truncation (R15-ext).` | 1) Run long-tail query 2) Inspect cutoff math 3) Verify min-result guarantee |
| NEW-037 | Dynamic token budget allocation (FUT-7) | Confirm complexity-tier budgets | `Verify dynamic token budgets (FUT-7).` | 1) Run classed queries 2) Inspect budgets 3) Disable flag fallback |
| NEW-038 | Query expansion (R12) | Confirm parallel expansion + dedup | `Validate query expansion (R12).` | 1) Complex query expansion 2) Parallel baseline+expanded 3) dedup + simple-query skip |
| NEW-039 | Verify-fix-verify memory quality loop (PI-A5) | Confirm retry then reject path | `Verify PI-A5 quality loop behavior.` | 1) Submit low-quality memory 2) Observe retries 3) Confirm final reject |
| NEW-040 | Signal vocabulary expansion (TM-08) | Confirm signal category detection | `Validate signal vocabulary expansion (TM-08).` | 1) Use correction/preference prompts 2) Trigger matching 3) Verify categories |
| NEW-041 | Pre-flight token budget validation (PI-A3) | Confirm truncation/summarization fallback | `Verify pre-flight token budget validation (PI-A3).` | 1) Force overflow candidates 2) Run retrieval 3) verify truncation/summary |
| NEW-042 | Spec folder description discovery (PI-B3) | Confirm per-folder + aggregated routing | `Validate PI-B3 folder description discovery.` | 1) Create spec folder via create.sh → verify description.json exists 2) Edit spec.md → verify isPerFolderDescriptionStale detects change 3) Run generateFolderDescriptions → verify per-folder files preferred over spec.md 4) Mixed mode: some folders with/without description.json → verify aggregation 5) Run memory_context query → verify short-circuit folder routing |
| NEW-043 | Pre-storage quality gate (TM-04) | Confirm 3-layer gate behavior | `Verify pre-storage quality gate (TM-04).` | 1) Submit each failure class 2) observe warn/reject behavior 3) check decision logs |
| NEW-044 | Reconsolidation-on-save (TM-06) | Confirm merge/deprecate thresholds | `Validate reconsolidation-on-save (TM-06).` | 1) Save near neighbors 2) verify >=0.88 merge 3) verify 0.75-0.88 supersede |
| NEW-045 | Smarter memory content generation (S1) | Confirm quality/structure output | `Assess smarter memory content generation (S1).` | 1) Generate from mixed content 2) inspect structure retention 3) verify concise coherence |
| NEW-046 | Anchor-aware chunk thinning (R7) | Confirm anchor-priority thinning | `Validate anchor-aware chunk thinning (R7).` | 1) Index long doc with anchors/filler 2) run thinning 3) verify non-empty retained set |
| NEW-047 | Encoding-intent capture at index time (R16) | Confirm persisted intent labels | `Verify encoding-intent capture (R16).` | 1) Save doc/code/structured examples 2) inspect metadata 3) verify read-only intent field |
| NEW-048 | Auto entity extraction (R10) | Confirm entity pipeline persistence | `Validate auto entity extraction (R10).` | 1) Save entity-rich content 2) inspect entity tables 3) verify normalization/denylist |
| NEW-049 | 4-stage pipeline refactor (R6) | Confirm stage flow and invariant | `Trace one query through all 4 stages.` | 1) Run verbose stage metadata 2) inspect stage transitions 3) confirm stage-4 immutability |
| NEW-050 | MPAB chunk-to-memory aggregation (R1) | Confirm MPAB formula | `Verify MPAB chunk aggregation (R1).` | 1) Create parent+chunks 2) run stage-3 aggregation 3) compare manual formula |
| NEW-051 | Chunk ordering preservation (B2) | Confirm ordered reassembly | `Validate chunk ordering preservation (B2).` | 1) Save ordered marker chunks 2) collapse 3) verify original order preserved |
| NEW-052 | Template anchor optimization (S2) | Confirm anchor metadata enrichment | `Verify template anchor optimization (S2).` | 1) Save anchored memory 2) query pipeline metadata 3) verify no score mutation |
| NEW-053 | Validation signals as retrieval metadata (S3) | Confirm bounded multiplier | `Validate S3 retrieval metadata weighting.` | 1) Prepare docs with varied validations 2) run stage-2 3) verify 0.8-1.2 bounds |
| NEW-054 | Learned relevance feedback (R11) | Confirm learned trigger safeguards | `Verify learned relevance feedback (R11).` | 1) submit helpful validation/queryId 2) inspect learned triggers 3) verify safeguards |
| NEW-055 | Dual-scope memory auto-surface (TM-05) | Confirm auto-surface hooks | `Validate dual-scope auto-surface (TM-05).` | 1) invoke non-memory-aware tool path 2) trigger compaction 3) verify surfaced memories |
| NEW-056 | Constitutional memory as expert knowledge injection (PI-A4) | Confirm directive enrichment | `Verify constitutional memory directive injection (PI-A4).` | 1) save constitutional directive 2) run retrieval 3) inspect directive metadata |
| NEW-057 | Spec folder hierarchy as retrieval structure (S4) | Confirm hierarchy-aware retrieval | `Validate spec-folder hierarchy retrieval (S4).` | 1) create nested hierarchy 2) query 3) verify self/parent/sibling scoring |
| NEW-058 | Lightweight consolidation (N3-lite) | Confirm maintenance cycle behavior | `Run lightweight consolidation cycle (N3-lite).` | 1) trigger cycle 2) inspect contradiction/hebbian/staleness outputs 3) verify logs |
| NEW-059 | Memory summary search channel (R8) | Confirm scale-gated summary channel | `Verify memory summary search channel (R8).` | 1) check corpus size threshold 2) run stage-1 3) verify channel activation rules |
| NEW-060 | Cross-document entity linking (S5) | Confirm guarded supports-edge linking | `Validate cross-document entity linking (S5).` | 1) ensure shared entities across docs 2) run linker 3) verify density guards |
| NEW-061 | Tree thinning for spec folder consolidation (PI-B1) | Confirm small-file merge thinning | `Validate tree thinning behavior (PI-B1).` | 1) prepare mixed-size tree 2) run thinning path 3) verify merged output/tokens saved |
| NEW-062 | Progressive validation for spec documents (PI-B2) | Confirm level 1-4 behavior | `Run progressive validation (PI-B2).` | 1) run level1..4 2) inspect fixes/diffs 3) verify exit/report behavior |
| NEW-063 | Feature flag governance | Confirm governance policy conformance | `Audit feature flag governance conformance.` | 1) enumerate flags 2) verify age/limits/review cadence 3) record compliance gaps |
| NEW-064 | Feature flag sunset audit | Confirm sunset dispositions | `Verify feature flag sunset audit outcomes.` | 1) compare documented disposition vs code 2) verify deprecated/no-op states 3) record deltas |
| NEW-065 | Database and schema safety | Confirm Sprint 8 DB safety bundle | `Validate database and schema safety bundle.` | 1) run affected mutation paths 2) inspect SQL outcomes 3) confirm no partial corruption |
| NEW-066 | Scoring and ranking corrections | Confirm Sprint 8 scoring fixes | `Validate scoring and ranking corrections bundle.` | 1) run targeted queries 2) inspect score/rank outputs 3) verify corrected behavior |
| NEW-067 | Search pipeline safety | Confirm Sprint 8 pipeline safety fixes | `Validate search pipeline safety bundle.` | 1) run summary/lexical heavy queries 2) inspect filters/tokenization 3) verify safety outcomes |
| NEW-068 | Guards and edge cases | Confirm edge-case guard fixes | `Validate guards and edge-cases bundle.` | 1) trigger known edge cases 2) verify no double-count/wrong fallback 3) capture outcomes |
| NEW-069 | Entity normalization consolidation | Confirm shared normalization path | `Validate entity normalization consolidation.` | 1) feed unicode entities 2) compare extractor/linker outputs 3) verify parity |
| NEW-070 | Dead code removal | Confirm dead path elimination | `Audit dead code removal outcomes.` | 1) search removed symbols 2) run representative flows 3) confirm no runtime references |
| NEW-071 | Performance improvements | Confirm key perf remediations active | `Verify performance improvements (Sprint 8).` | 1) inspect optimized code paths 2) run heavy queries 3) capture timing notes |
| NEW-072 | Test quality improvements | Confirm test quality remediations | `Audit test quality improvements.` | 1) inspect changed tests 2) verify teardown/assertion patterns 3) record reliability signals |
| NEW-073 | Quality gate timer persistence | Confirm restart persistence | `Verify quality gate timer persistence.` | 1) set activation timestamp 2) restart service 3) verify persisted timestamp |
| NEW-074 | Stage 3 effectiveScore fallback chain | Confirm fallback order correctness | `Validate Stage 3 effectiveScore fallback chain.` | 1) craft rows missing score fields 2) run stage 3 3) verify fallback order |
| NEW-075 | Canonical ID dedup hardening | Confirm mixed-format ID dedup | `Verify canonical ID dedup hardening.` | 1) produce mixed IDs 2) run dedup 3) confirm single canonical output |
| NEW-076 | Activation window persistence | Confirm warn-only window persistence | `Verify activation window persistence.` | 1) initialize window timestamp 2) restart 3) confirm no reset |
| NEW-077 | Tier-2 fallback channel forcing | Confirm force-all-channels in tier-2 | `Validate tier-2 fallback channel forcing.` | 1) trigger tier-2 fallback 2) inspect options 3) confirm all channels forced |
| NEW-078 | Legacy V1 pipeline removal | Confirm V2-only runtime | `Verify legacy V1 removal.` | 1) search removed symbols 2) run queries 3) confirm V2-only execution |
| NEW-079 | Scoring and fusion corrections | Confirm phase-017 correction bundle | `Validate phase-017 scoring and fusion corrections.` | 1) run correction-specific queries 2) inspect math/normalization 3) verify expected outputs |
| NEW-080 | Pipeline and mutation hardening | Confirm mutation hardening bundle | `Validate phase-017 pipeline and mutation hardening.` | 1) execute CRUD/mutation paths 2) inspect cleanup/error handling 3) verify atomicity behavior |
| NEW-081 | Graph and cognitive memory fixes | Confirm graph/cognitive fix bundle | `Validate graph and cognitive memory fixes.` | 1) trigger self-loop/depth/cache scenarios 2) verify clamps/invalidations 3) capture results |
| NEW-082 | Evaluation and housekeeping fixes | Confirm eval/housekeeping reliability | `Validate evaluation and housekeeping fixes.` | 1) restart+eval runs 2) verify run-id and upsert behavior 3) inspect boundary guards |
| NEW-083 | Math.max/min stack overflow elimination | Confirm large-array safety | `Validate Math.max/min stack overflow elimination.` | 1) run large-array paths 2) verify no RangeError 3) compare numeric outputs |
| NEW-084 | Session-manager transaction gap fixes | Confirm transactional limit enforcement | `Validate session-manager transaction gap fixes.` | 1) simulate concurrent writes 2) inspect transactions 3) confirm limits enforced |
| NEW-085 | Transaction wrappers on mutation handlers | Confirm atomic wrapper behavior | `Validate mutation transaction wrappers.` | 1) inject mid-step fault 2) verify rollback 3) confirm consistent state |
| NEW-086 | BM25 trigger phrase re-index gate | Confirm trigger edit causes re-index | `Validate BM25 trigger phrase re-index gate.` | 1) edit trigger phrases 2) verify re-index activity 3) query new trigger |
| NEW-087 | DB_PATH extraction and import standardization | Confirm shared DB path resolution | `Validate DB_PATH extraction/import standardization.` | 1) vary DB env vars 2) run scripts/tools 3) confirm shared resolver output |
| NEW-088 | Cross-AI validation fixes (Tier 4) | Confirm tier-4 fix pack behavior | `Validate Phase 018 Tier-4 cross-AI fixes.` | 1) inspect each fix location 2) run representative flows 3) record behavior |
| NEW-089 | Code standards alignment | Confirm standards conformance | `Validate code standards alignment outcomes.` | 1) inspect affected files 2) verify naming/comments/import order 3) record mismatches |
| NEW-090 | INT8 quantization evaluation (R5) | Confirm no-go decision remains valid | `Re-evaluate INT8 quantization decision criteria.` | 1) gather thresholds metrics 2) compare go/no-go criteria 3) record decision |
| NEW-091 | Implemented: graph centrality and community detection (N2) | Confirm deferred->implemented status | `Verify N2 implemented and active.` | 1) inspect tables/flags 2) run graph queries 3) verify N2 contributions |
| NEW-092 | Implemented: auto entity extraction (R10) | Confirm deferred->implemented status | `Verify R10 implemented and active.` | 1) save entity-rich memory 2) inspect entity outputs 3) verify defaults |
| NEW-093 | Implemented: memory summary generation (R8) | Confirm deferred->implemented status | `Verify R8 implemented and gated.` | 1) save long memory 2) inspect summary persistence 3) verify scale-gated usage |
| NEW-094 | Implemented: cross-document entity linking (S5) | Confirm deferred->implemented status | `Verify S5 implemented and guarded.` | 1) run entity linker 2) inspect supports edges 3) verify density guards |
| NEW-095 | Strict Zod schema validation (P0-1) | Confirm schema enforcement rejects hallucinated params | `Validate SPECKIT_STRICT_SCHEMAS enforcement.` | 1) call any MCP tool with an extra unknown parameter (e.g., `memory_search({query:"test", bogus:1})`) 2) verify Zod strict error is returned 3) set `SPECKIT_STRICT_SCHEMAS=false` and confirm `.passthrough()` allows the extra param 4) verify validation runs per-tool in handler, not duplicated at server dispatch | Tool outputs + Zod error messages | PASS if strict mode rejects unknown params and passthrough mode allows them | Inspect `tool-schemas.ts` for `.strict()` vs `.passthrough()` branching |
| NEW-096 | Provenance-rich response envelopes (P0-2) | Confirm includeTrace opt-in exposes scores/source/trace | `Validate SPECKIT_RESPONSE_TRACE includeTrace behavior.` | **Precondition:** ensure `SPECKIT_RESPONSE_TRACE` is unset or `false` before running the "absent" assertion (env var forces trace inclusion regardless of arg). 1) `memory_search({query:"test", includeTrace:true})` → verify `scores`, `source`, `trace` objects in response 2) `memory_search({query:"test"})` (no includeTrace, env unset) → verify these objects are absent 3) set `SPECKIT_RESPONSE_TRACE=true` and repeat without arg → verify trace objects appear due to env override 4) inspect score fields: semantic, lexical, fusion, intentAdjusted, composite | Search outputs with/without includeTrace + env override | PASS if trace objects present when opt-in or env-forced and absent otherwise | Check `handlers/memory-search.ts` for includeTrace and env branching |
| NEW-097 | Async ingestion job lifecycle (P0-3) | Confirm job state machine and crash recovery | `Validate memory_ingest_start/status/cancel lifecycle.` | 1) `memory_ingest_start({paths:["specs/<target-spec>/memory/file1.md","specs/<target-spec>/memory/file2.md"]})` → capture jobId (must be explicit `.md` file paths, not directories) 2) `memory_ingest_status({jobId})` → verify state transitions (queued→parsing→embedding→indexing→complete) 3) start a new job, then `memory_ingest_cancel({jobId})` → verify cancelled state 4) verify job IDs are nanoid-style (`job_` prefix + 12 alphanumeric chars) 5) restart server → verify incomplete jobs re-enqueue via `resetIncompleteJobsToQueued` | Ingest tool outputs + job state sequence | PASS if state machine transitions correctly through all 5 states and cancel works | Inspect `lib/ops/job-queue.ts` for state machine logic and `resetIncompleteJobsToQueued` |
| NEW-098 | Local GGUF reranker via node-llama-cpp (P1-5) | Confirm reranker gating and graceful fallback | `Validate RERANKER_LOCAL strict check and memory thresholds.` | 1) set `RERANKER_LOCAL=1` (truthy but not `'true'`) → verify reranker is NOT activated (strict string equality) 2) set `RERANKER_LOCAL=true` without model file → verify silent fallback 3) set `SPECKIT_RERANKER_MODEL=/custom/path` → verify 512MB memory threshold applies instead of 4GB 4) with valid model, verify sequential scoring (not parallel) in logs | Reranker log output + fallback behavior | PASS if strict `=== 'true'` check works, custom model lowers threshold, and scoring is sequential | Check `lib/search/local-reranker.ts` for `canUseLocalReranker()` and `rerankLocal()` |
| NEW-099 | Real-time filesystem watching (P1-7) | Confirm file watcher debounce, hash seeding, and ENOENT grace | `Validate SPECKIT_FILE_WATCHER behavior.` | 1) set `SPECKIT_FILE_WATCHER=true` and start server 2) create a new `.md` file in a watched spec directory → verify `add` event seeds the hash cache 3) modify the file → verify reindex triggers after 2s debounce 4) modify with identical content → verify NO redundant reindex (hash dedup) 5) rapidly create then delete a file → verify no ENOENT crash (graceful handling) | Server logs for `[file-watcher]` messages | PASS if debounce works, hash dedup prevents redundant reindex, and ENOENT is handled silently | Inspect `lib/ops/file-watcher.ts` for `seedHash`, `scheduleReindex`, and ENOENT catch |
| NEW-100 | Async shutdown with deadline (server lifecycle) | Confirm graceful shutdown completes async cleanup | `Validate server shutdown deadline behavior.` | 1) start server with file watcher and local reranker enabled 2) send SIGTERM 3) verify file watcher closes, local reranker disposes, and vector index closes 4) verify shutdown completes within 2s deadline (no hang) 5) if async cleanup exceeds 2s, verify force exit fires | Process exit behavior + cleanup logs | PASS if all async resources are cleaned up within deadline | Check `context-server.ts` for `SHUTDOWN_DEADLINE_MS` and `gracefulShutdown()` |
| NEW-101 | memory_delete confirm schema tightening | Confirm confirm field accepts only literal true | `Validate memory_delete confirm:z.literal(true) enforcement.` | 1) `memory_delete({id:1, confirm:true})` → verify accepted 2) `memory_delete({id:1, confirm:false})` → verify Zod rejection (literal true required) 3) `memory_delete({specFolder:"test", confirm:true})` → verify bulk delete path accepts 4) `memory_delete({specFolder:"test"})` (no confirm) → verify Zod rejection for bulk path | Tool validation outputs | PASS if only `confirm:true` is accepted, `confirm:false` is rejected | Inspect `tool-schemas.ts` memory_delete union schema |
| NEW-102 | node-llama-cpp optionalDependencies | Confirm install succeeds without native build tools | `Validate node-llama-cpp as optionalDependency.` | 1) inspect `mcp_server/package.json` → verify `node-llama-cpp` is in `optionalDependencies` not `dependencies` 2) run `npm install` on a clean environment without C++ build tools → verify install completes without error 3) verify `local-reranker.ts` uses dynamic `import()` and gracefully degrades when module is absent | package.json content + install output | PASS if install succeeds and reranker gracefully falls back when module missing | Check `package.json` optionalDependencies section |
| NEW-103 | UX hook module coverage (`mutation-feedback`, `response-hints`) | Confirm new hook modules return the finalized metadata and hint shape | `Validate NEW-103 hook module behavior for mutation feedback and response hints.` | 1) `npx vitest run tests/hooks-ux-feedback.vitest.ts` | Test output shows suite pass, including latency/cache-clear booleans and finalized hint payload assertions | Test transcript + snippet for passing assertions | PASS if `tests/hooks-ux-feedback.vitest.ts` passes with no failing assertions | Inspect hook exports and fixture payloads if assertion fails |
| NEW-104 | Mutation save-path UX parity and no-op hardening | Confirm duplicate-save no-op behavior and atomic-save parity/hints | `Run save-path UX scenarios and verify duplicate-save no-op behavior plus atomic-save parity.` | 1) `npx vitest run tests/memory-save-ux-regressions.vitest.ts` 2) inspect assertions covering duplicate-content save no-op responses 3) inspect assertions covering atomic-save `postMutationHooks`, hints, and partial-indexing guidance parity | Suite passes and assertions show no false `postMutationHooks` on no-op saves, cache-left-unchanged messaging, and parity between standard and atomic save responses | Test transcript + highlighted assertion names or output snippets | PASS if duplicate-save no-ops suppress false hook metadata and atomic-save responses match the primary save contract | Inspect `tests/memory-save-ux-regressions.vitest.ts` and handler save-path wiring |
| NEW-105 | Context-server success-envelope finalization | Confirm `appendAutoSurfaceHints(...)` runs before budget enforcement and preserves the finalized envelope contract | `Validate the finalized context-server success-envelope path, including token metadata recomputation.` | 1) `npx vitest run tests/context-server.vitest.ts` 2) inspect assertions covering appended success hints 3) inspect assertions covering preserved `autoSurfacedContext` 4) inspect assertions covering final token metadata after hint append and before budget enforcement | Context-server suite passes with end-to-end assertions for appended hints, preserved `autoSurfacedContext`, and finalized token metadata | Test transcript + key assertion output | PASS if `tests/context-server.vitest.ts` passes and the assertions cover the final success-envelope path end to end | Inspect `context-server.ts` success-path assembly and expected envelope fields |
| NEW-106 | Hooks barrel + README synchronization | Confirm hooks index exports and docs cover the finalized modules and contract fields | `Validate hook barrel and README coverage for the finalized UX-hook surface.` | 1) `rg "mutation-feedback|response-hints" .opencode/skill/system-spec-kit/mcp_server/hooks/index.ts` 2) `rg "mutation-feedback|response-hints|MutationHookResult|postMutationHooks" .opencode/skill/system-spec-kit/mcp_server/hooks/README.md` | Barrel includes both module exports and README includes usage plus contract references | `rg` output snippets from both files | PASS if both files reference the new modules and contract fields | Update hooks barrel/doc text and rerun `rg` checks |
| NEW-107 | Checkpoint confirmName and schema enforcement | Confirm delete safety is required across handler and validation layers | `Validate checkpoint delete confirmName enforcement across handler and schema layers.` | 1) `npx vitest run tests/handler-checkpoints.vitest.ts tests/tool-input-schema.vitest.ts tests/mcp-input-validation.vitest.ts` 2) inspect rejection assertions for missing `confirmName` 3) inspect success assertions for `safetyConfirmationUsed=true` | Validation and handler suites pass with missing-`confirmName` rejection plus successful delete confirmation reporting | Test transcript + assertion snippets | PASS if the three suites pass and prove required `confirmName` enforcement end to end | Inspect checkpoint handler, schemas, and tool typing alignment |
| NEW-108 | Phase 014 finalized verification command suite evidence | Confirm the recorded verification set matches the final phase evidence | `Run the finalized Phase 014 verification command suite and record evidence.` | 1) `npx tsc -b` 2) `npm run lint` 3) `npx vitest run tests/hooks-ux-feedback.vitest.ts tests/context-server.vitest.ts tests/handler-checkpoints.vitest.ts tests/tool-input-schema.vitest.ts tests/mcp-input-validation.vitest.ts tests/memory-crud-extended.vitest.ts tests/memory-save-ux-regressions.vitest.ts` 4) `npx vitest run tests/embeddings.vitest.ts tests/stdio-logging-safety.vitest.ts` 5) run MCP SDK stdio smoke test against `node .opencode/skill/system-spec-kit/mcp_server/dist/context-server.js` | `npx tsc -b` PASS, `npm run lint` PASS, UX suite PASS with 7 files / 460 tests, stdio plus embeddings suite PASS with 2 files / 15 tests, and MCP SDK stdio smoke PASS with 28 tools listed | Build/lint/test/smoke transcripts with totals and tool count | PASS if all five verification steps match the recorded Phase 014 evidence exactly | Re-run the failing verification step in isolation and inspect the corresponding Phase 014 handler or test coverage |
| NEW-109 | Quality-aware 3-tier search fallback | Confirm 3-tier degradation chain triggers correctly | `Validate SPECKIT_SEARCH_FALLBACK tiered degradation.` | 1) `memory_search({query:"zzz_nonexistent_term_zzz", limit:20})` with default settings (Tier 1) 2) inspect `_degradation` property on result — if topScore < 0.02 AND relativeGap < 0.2, OR resultCount < 3, confirm Tier 2 triggered 3) verify Tier 2 uses minSimilarity=0.1 and forces all channels 4) if Tier 2 also fails quality check, confirm Tier 3 structural SQL fallback fires 5) verify Tier 3 scores capped at 50% of existing top score 6) set `SPECKIT_SEARCH_FALLBACK=false` and verify single-tier only |
| NEW-110 | Prediction-error save arbitration | Confirm 5-action PE decision engine during save | `Validate prediction-error save arbitration actions.` | 1) save a memory with unique content → expect CREATE action 2) save identical content → expect REINFORCE (similarity >=0.95) 3) save slightly modified content (no contradiction) → expect UPDATE (0.85-0.94) 4) save modified content with contradiction → expect SUPERSEDE (0.85-0.94 + contradiction) 5) save loosely related content → expect CREATE_LINKED (0.70-0.84) 6) query `memory_conflicts` table entries for action/similarity/contradiction columns 7) save with `force:true` → verify PE arbitration bypassed |
| NEW-111 | Deferred lexical-only indexing | Confirm embedding-failure fallback and BM25 searchability | `Validate deferred lexical-only indexing fallback.` | 1) simulate embedding failure (e.g., set invalid `OPENAI_API_KEY`) 2) `memory_save(filePath)` → verify memory saved with `embedding_status='pending'` 3) `memory_search({query:"<title of saved memory>"})` → verify BM25/FTS5 retrieval works (lexical match) 4) restore valid API key 5) run `node cli.js reindex` → verify `embedding_status` transitions to `'success'` and `retry_count` increments 6) `memory_search({query:"<semantic query>"})` → verify vector search now works |
| NEW-112 | Cross-process DB hot rebinding | Confirm marker-file triggers DB reinitialization | `Validate cross-process DB hot rebinding via marker file.` | 1) start MCP server 2) create a test memory via MCP: `memory_save(filePath)` and note its title 3) from a separate terminal, run `node cli.js bulk-delete --tier scratch --folder specs/test-sandbox` (non-dry-run — this mutates the DB and writes the `DB_UPDATED_FILE` marker) 4) immediately call `memory_stats()` via MCP → verify server detects marker and reinitializes DB 5) verify no stale data from pre-rebind state 6) run `memory_health()` → verify healthy status post-rebind |
| NEW-113 | Standalone admin CLI | Confirm 4 CLI commands execute correctly | `Validate standalone admin CLI commands.` | 1) `node cli.js stats` → verify tier distribution, top folders, schema version displayed 2) `node cli.js bulk-delete --tier scratch --folder specs/test-sandbox --dry-run` → verify dry-run shows deletion plan without executing 3) `node cli.js reindex --force` → verify full reindex completes 4) `node cli.js schema-downgrade --to 15` (without --confirm) → verify safety prompt 5) verify checkpoint auto-created before bulk-delete (non-dry-run) |
| NEW-114 | Path traversal validation (P0-4) | Verify memory_ingest_start rejects paths outside allowed base directories and paths containing traversal segments | "Ingest a file using a path with ../ segments and verify rejection" | **Precondition:** sandbox spec folder with test files. 1) Call `memory_ingest_start({ paths: ["../../etc/passwd"] })` 2) Expect E_VALIDATION error with clear rejection message 3) Call `memory_ingest_start({ paths: ["/tmp/outside-base/file.md"] })` 4) Expect E_VALIDATION error for path outside allowed base 5) Call `memory_ingest_start({ paths: ["specs/test-sandbox/valid.md"] })` 6) Expect success (job created) |
| NEW-115 | Transaction atomicity on rename failure (P0-5) | Verify that pending file is preserved (not deleted) when rename fails after DB commit, enabling recovery on next startup | "Simulate rename failure after DB commit and verify pending file survives" | **Precondition:** Read transaction-manager.ts to understand pendingPath logic. 1) Trigger `executeAtomicSave()` with a path that will cause rename to fail (e.g., read-only target directory) 2) Verify the function returns `{ success: false, dbCommitted: true }` 3) Verify the pending file still exists on disk (not deleted) 4) Verify `recoverAllPendingFiles()` can find and recover the pending file |
| NEW-116 | Chunking safe swap atomicity (P0-6) | Verify re-chunking indexes new chunks before deleting old ones, and old chunks survive if new indexing fails | "Re-chunk a parent memory and verify old children survive indexing failure" | **Precondition:** Create a parent memory with child chunks via `memory_save()`. 1) Trigger re-chunk on the parent 2) Verify new chunks are indexed in staged state before old deletion 3) Verify old children are deleted only after new chunks succeed 4) Simulate embedding failure for all new chunks 5) Verify old children remain intact and handler returns error status |
| NEW-117 | SQLite datetime session cleanup (P0-7) | Verify cleanupOldSessions() correctly identifies expired sessions using SQLite-native datetime comparison regardless of timestamp format | "Create sessions with known timestamps and verify cleanup deletes only expired ones" | **Precondition:** Working memory database accessible. 1) Insert a session with `last_focused` = 45 minutes ago (expired) 2) Insert a session with `last_focused` = 5 minutes ago (active) 3) Run `cleanupOldSessions()` with 30-minute threshold 4) Verify expired session deleted, active session preserved 5) Verify comparison works with both `YYYY-MM-DD HH:MM:SS` and ISO format timestamps |
| NEW-118 | Stage-2 score field synchronization (P0-8) | Verify intentAdjustedScore reflects all downstream signal modifications after non-hybrid intent weighting | "Run a non-hybrid search with intent weighting and verify score fields stay synchronized" | **Precondition:** Memory database with varied content. 1) Call `memory_search({ query: "...", includeTrace: true })` targeting non-hybrid flow 2) Inspect trace: verify `intentAdjustedScore` is set at Step 4 3) Verify subsequent artifact routing and feedback signals modify `score` 4) Verify final `intentAdjustedScore >= score` (Math.max sync applied) 5) Verify `resolveEffectiveScore()` returns the synchronized value |
| NEW-119 | Memory filename uniqueness (ensureUniqueMemoryFilename) | Confirm collision resolution | `Validate memory filename collision prevention.` | 1) Save memory to a folder 2) Save again with same slug within same minute 3) Verify two distinct filenames (second has -1 suffix) 4) Verify memorySequence increments in description.json 5) Verify memoryNameHistory updated |
| NEW-120 | Description.json batch backfill validation (PI-B3) | Confirm batch-generated folder descriptions exist and conform to schema | `Validate PI-B3 batch backfill results.` | 1) Count spec folders with spec.md 2) Count description.json files — numbers must match 3) Validate JSON syntax of all files 4) Spot-check schema fields at depth 1, 3, 5+ 5) Run generateFolderDescriptions → verify per-folder files preferred over spec.md |
| NEW-121 | description.json schema field validation | Confirm per-folder description metadata matches schema contract | `Validate description.json required fields and types.` | 1) Create sandbox spec folder via create.sh → verify description.json generated 2) Assert 9 required fields: specId, folderSlug, parentChain, memorySequence, memoryNameHistory, specFolder, description, keywords, lastUpdated 3) Verify types: specId string, parentChain array, memorySequence number, keywords array 4) Save memory → verify memorySequence and memoryNameHistory update 5) Corrupt a field → verify regeneration repairs it |

## Feature Catalog Cross-Reference Index

Bidirectional mapping between playbook scenarios and feature catalog entries.
Catalog base path: `feature-catalog/` (relative to `022-hybrid-rag-fusion/`)

### Existing Features (EX-001..034)

| Playbook ID | Catalog Entry |
|---|---|
| EX-001 | [01-retrieval/01-unified-context-retrieval-memorycontext.md](../feature-catalog/01-retrieval/01-unified-context-retrieval-memorycontext.md) |
| EX-002 | [01-retrieval/02-semantic-and-lexical-search-memorysearch.md](../feature-catalog/01-retrieval/02-semantic-and-lexical-search-memorysearch.md) |
| EX-003 | [01-retrieval/03-trigger-phrase-matching-memorymatchtriggers.md](../feature-catalog/01-retrieval/03-trigger-phrase-matching-memorymatchtriggers.md) |
| EX-004 | [01-retrieval/04-hybrid-search-pipeline.md](../feature-catalog/01-retrieval/04-hybrid-search-pipeline.md) |
| EX-005 | [01-retrieval/05-4-stage-pipeline-architecture.md](../feature-catalog/01-retrieval/05-4-stage-pipeline-architecture.md) |
| EX-006 | [02-mutation/01-memory-indexing-memorysave.md](../feature-catalog/02-mutation/01-memory-indexing-memorysave.md) |
| EX-007 | [02-mutation/02-memory-metadata-update-memoryupdate.md](../feature-catalog/02-mutation/02-memory-metadata-update-memoryupdate.md) |
| EX-008 | [02-mutation/03-single-and-folder-delete-memorydelete.md](../feature-catalog/02-mutation/03-single-and-folder-delete-memorydelete.md) |
| EX-009 | [02-mutation/04-tier-based-bulk-deletion-memorybulkdelete.md](../feature-catalog/02-mutation/04-tier-based-bulk-deletion-memorybulkdelete.md) |
| EX-010 | [02-mutation/05-validation-feedback-memoryvalidate.md](../feature-catalog/02-mutation/05-validation-feedback-memoryvalidate.md) |
| EX-011 | [03-discovery/01-memory-browser-memorylist.md](../feature-catalog/03-discovery/01-memory-browser-memorylist.md) |
| EX-012 | [03-discovery/02-system-statistics-memorystats.md](../feature-catalog/03-discovery/02-system-statistics-memorystats.md) |
| EX-013 | [03-discovery/03-health-diagnostics-memoryhealth.md](../feature-catalog/03-discovery/03-health-diagnostics-memoryhealth.md) |
| EX-014 | [04-maintenance/01-workspace-scanning-and-indexing-memoryindexscan.md](../feature-catalog/04-maintenance/01-workspace-scanning-and-indexing-memoryindexscan.md) |
| EX-015 | [05-lifecycle/01-checkpoint-creation-checkpointcreate.md](../feature-catalog/05-lifecycle/01-checkpoint-creation-checkpointcreate.md) |
| EX-016 | [05-lifecycle/02-checkpoint-listing-checkpointlist.md](../feature-catalog/05-lifecycle/02-checkpoint-listing-checkpointlist.md) |
| EX-017 | [05-lifecycle/03-checkpoint-restore-checkpointrestore.md](../feature-catalog/05-lifecycle/03-checkpoint-restore-checkpointrestore.md) |
| EX-018 | [05-lifecycle/04-checkpoint-deletion-checkpointdelete.md](../feature-catalog/05-lifecycle/04-checkpoint-deletion-checkpointdelete.md) |
| EX-019 | [06-analysis/01-causal-edge-creation-memorycausallink.md](../feature-catalog/06-analysis/01-causal-edge-creation-memorycausallink.md) |
| EX-020 | [06-analysis/02-causal-graph-statistics-memorycausalstats.md](../feature-catalog/06-analysis/02-causal-graph-statistics-memorycausalstats.md) |
| EX-021 | [06-analysis/03-causal-edge-deletion-memorycausalunlink.md](../feature-catalog/06-analysis/03-causal-edge-deletion-memorycausalunlink.md) |
| EX-022 | [06-analysis/04-causal-chain-tracing-memorydriftwhy.md](../feature-catalog/06-analysis/04-causal-chain-tracing-memorydriftwhy.md) |
| EX-023 | [06-analysis/05-epistemic-baseline-capture-taskpreflight.md](../feature-catalog/06-analysis/05-epistemic-baseline-capture-taskpreflight.md) |
| EX-024 | [06-analysis/06-post-task-learning-measurement-taskpostflight.md](../feature-catalog/06-analysis/06-post-task-learning-measurement-taskpostflight.md) |
| EX-025 | [06-analysis/07-learning-history-memorygetlearninghistory.md](../feature-catalog/06-analysis/07-learning-history-memorygetlearninghistory.md) |
| EX-026 | [07-evaluation/01-ablation-studies-evalrunablation.md](../feature-catalog/07-evaluation/01-ablation-studies-evalrunablation.md) |
| EX-027 | [07-evaluation/02-reporting-dashboard-evalreportingdashboard.md](../feature-catalog/07-evaluation/02-reporting-dashboard-evalreportingdashboard.md) |
| EX-028 | [20-feature-flag-reference/01-1-search-pipeline-features-speckit.md](../feature-catalog/20-feature-flag-reference/01-1-search-pipeline-features-speckit.md) |
| EX-029 | [20-feature-flag-reference/02-2-session-and-cache.md](../feature-catalog/20-feature-flag-reference/02-2-session-and-cache.md) |
| EX-030 | [20-feature-flag-reference/03-3-mcp-configuration.md](../feature-catalog/20-feature-flag-reference/03-3-mcp-configuration.md) |
| EX-031 | [20-feature-flag-reference/04-4-memory-and-storage.md](../feature-catalog/20-feature-flag-reference/04-4-memory-and-storage.md) |
| EX-032 | [20-feature-flag-reference/05-5-embedding-and-api.md](../feature-catalog/20-feature-flag-reference/05-5-embedding-and-api.md) |
| EX-033 | [20-feature-flag-reference/06-6-debug-and-telemetry.md](../feature-catalog/20-feature-flag-reference/06-6-debug-and-telemetry.md) |
| EX-034 | [20-feature-flag-reference/07-7-ci-and-build-informational.md](../feature-catalog/20-feature-flag-reference/07-7-ci-and-build-informational.md) |

### New Features (NEW-001..113)

| Playbook ID | Catalog Entry |
|---|---|
| NEW-001 | [08-bug-fixes-and-data-integrity/01-graph-channel-id-fix.md](../feature-catalog/08-bug-fixes-and-data-integrity/01-graph-channel-id-fix.md) |
| NEW-002 | [08-bug-fixes-and-data-integrity/02-chunk-collapse-deduplication.md](../feature-catalog/08-bug-fixes-and-data-integrity/02-chunk-collapse-deduplication.md) |
| NEW-003 | [08-bug-fixes-and-data-integrity/03-co-activation-fan-effect-divisor.md](../feature-catalog/08-bug-fixes-and-data-integrity/03-co-activation-fan-effect-divisor.md) |
| NEW-004 | [08-bug-fixes-and-data-integrity/04-sha-256-content-hash-deduplication.md](../feature-catalog/08-bug-fixes-and-data-integrity/04-sha-256-content-hash-deduplication.md) |
| NEW-005 | [09-evaluation-and-measurement/01-evaluation-database-and-schema.md](../feature-catalog/09-evaluation-and-measurement/01-evaluation-database-and-schema.md) |
| NEW-006 | [09-evaluation-and-measurement/02-core-metric-computation.md](../feature-catalog/09-evaluation-and-measurement/02-core-metric-computation.md) |
| NEW-007 | [09-evaluation-and-measurement/03-observer-effect-mitigation.md](../feature-catalog/09-evaluation-and-measurement/03-observer-effect-mitigation.md) |
| NEW-008 | [09-evaluation-and-measurement/04-full-context-ceiling-evaluation.md](../feature-catalog/09-evaluation-and-measurement/04-full-context-ceiling-evaluation.md) |
| NEW-009 | [09-evaluation-and-measurement/05-quality-proxy-formula.md](../feature-catalog/09-evaluation-and-measurement/05-quality-proxy-formula.md) |
| NEW-010 | [09-evaluation-and-measurement/06-synthetic-ground-truth-corpus.md](../feature-catalog/09-evaluation-and-measurement/06-synthetic-ground-truth-corpus.md) |
| NEW-011 | [09-evaluation-and-measurement/07-bm25-only-baseline.md](../feature-catalog/09-evaluation-and-measurement/07-bm25-only-baseline.md) |
| NEW-012 | [09-evaluation-and-measurement/08-agent-consumption-instrumentation.md](../feature-catalog/09-evaluation-and-measurement/08-agent-consumption-instrumentation.md) |
| NEW-013 | [09-evaluation-and-measurement/09-scoring-observability.md](../feature-catalog/09-evaluation-and-measurement/09-scoring-observability.md) |
| NEW-014 | [09-evaluation-and-measurement/10-full-reporting-and-ablation-study-framework.md](../feature-catalog/09-evaluation-and-measurement/10-full-reporting-and-ablation-study-framework.md) |
| NEW-015 | [09-evaluation-and-measurement/11-shadow-scoring-and-channel-attribution.md](../feature-catalog/09-evaluation-and-measurement/11-shadow-scoring-and-channel-attribution.md) |
| NEW-016 | [10-graph-signal-activation/01-typed-weighted-degree-channel.md](../feature-catalog/10-graph-signal-activation/01-typed-weighted-degree-channel.md) |
| NEW-017 | [10-graph-signal-activation/02-co-activation-boost-strength-increase.md](../feature-catalog/10-graph-signal-activation/02-co-activation-boost-strength-increase.md) |
| NEW-018 | [10-graph-signal-activation/03-edge-density-measurement.md](../feature-catalog/10-graph-signal-activation/03-edge-density-measurement.md) |
| NEW-019 | [10-graph-signal-activation/04-weight-history-audit-tracking.md](../feature-catalog/10-graph-signal-activation/04-weight-history-audit-tracking.md) |
| NEW-020 | [10-graph-signal-activation/05-graph-momentum-scoring.md](../feature-catalog/10-graph-signal-activation/05-graph-momentum-scoring.md) |
| NEW-021 | [10-graph-signal-activation/06-causal-depth-signal.md](../feature-catalog/10-graph-signal-activation/06-causal-depth-signal.md) |
| NEW-022 | [10-graph-signal-activation/07-community-detection.md](../feature-catalog/10-graph-signal-activation/07-community-detection.md) |
| NEW-023 | [11-scoring-and-calibration/01-score-normalization.md](../feature-catalog/11-scoring-and-calibration/01-score-normalization.md) |
| NEW-024 | [11-scoring-and-calibration/02-cold-start-novelty-boost.md](../feature-catalog/11-scoring-and-calibration/02-cold-start-novelty-boost.md) |
| NEW-025 | [11-scoring-and-calibration/03-interference-scoring.md](../feature-catalog/11-scoring-and-calibration/03-interference-scoring.md) |
| NEW-026 | [11-scoring-and-calibration/04-classification-based-decay.md](../feature-catalog/11-scoring-and-calibration/04-classification-based-decay.md) |
| NEW-027 | [11-scoring-and-calibration/05-folder-level-relevance-scoring.md](../feature-catalog/11-scoring-and-calibration/05-folder-level-relevance-scoring.md) |
| NEW-028 | [11-scoring-and-calibration/06-embedding-cache.md](../feature-catalog/11-scoring-and-calibration/06-embedding-cache.md) |
| NEW-029 | [11-scoring-and-calibration/07-double-intent-weighting-investigation.md](../feature-catalog/11-scoring-and-calibration/07-double-intent-weighting-investigation.md) |
| NEW-030 | [11-scoring-and-calibration/08-rrf-k-value-sensitivity-analysis.md](../feature-catalog/11-scoring-and-calibration/08-rrf-k-value-sensitivity-analysis.md) |
| NEW-031 | [11-scoring-and-calibration/09-negative-feedback-confidence-signal.md](../feature-catalog/11-scoring-and-calibration/09-negative-feedback-confidence-signal.md) |
| NEW-032 | [11-scoring-and-calibration/10-auto-promotion-on-validation.md](../feature-catalog/11-scoring-and-calibration/10-auto-promotion-on-validation.md) |
| NEW-033 | [12-query-intelligence/01-query-complexity-router.md](../feature-catalog/12-query-intelligence/01-query-complexity-router.md) |
| NEW-034 | [12-query-intelligence/02-relative-score-fusion-in-shadow-mode.md](../feature-catalog/12-query-intelligence/02-relative-score-fusion-in-shadow-mode.md) |
| NEW-035 | [12-query-intelligence/03-channel-min-representation.md](../feature-catalog/12-query-intelligence/03-channel-min-representation.md) |
| NEW-036 | [12-query-intelligence/04-confidence-based-result-truncation.md](../feature-catalog/12-query-intelligence/04-confidence-based-result-truncation.md) |
| NEW-037 | [12-query-intelligence/05-dynamic-token-budget-allocation.md](../feature-catalog/12-query-intelligence/05-dynamic-token-budget-allocation.md) |
| NEW-038 | [12-query-intelligence/06-query-expansion.md](../feature-catalog/12-query-intelligence/06-query-expansion.md) |
| NEW-039 | [13-memory-quality-and-indexing/01-verify-fix-verify-memory-quality-loop.md](../feature-catalog/13-memory-quality-and-indexing/01-verify-fix-verify-memory-quality-loop.md) |
| NEW-040 | [13-memory-quality-and-indexing/02-signal-vocabulary-expansion.md](../feature-catalog/13-memory-quality-and-indexing/02-signal-vocabulary-expansion.md) |
| NEW-041 | [13-memory-quality-and-indexing/03-pre-flight-token-budget-validation.md](../feature-catalog/13-memory-quality-and-indexing/03-pre-flight-token-budget-validation.md) |
| NEW-042 | [13-memory-quality-and-indexing/04-spec-folder-description-discovery.md](../feature-catalog/13-memory-quality-and-indexing/04-spec-folder-description-discovery.md) |
| NEW-043 | [13-memory-quality-and-indexing/05-pre-storage-quality-gate.md](../feature-catalog/13-memory-quality-and-indexing/05-pre-storage-quality-gate.md) |
| NEW-044 | [13-memory-quality-and-indexing/06-reconsolidation-on-save.md](../feature-catalog/13-memory-quality-and-indexing/06-reconsolidation-on-save.md) |
| NEW-045 | [13-memory-quality-and-indexing/07-smarter-memory-content-generation.md](../feature-catalog/13-memory-quality-and-indexing/07-smarter-memory-content-generation.md) |
| NEW-046 | [13-memory-quality-and-indexing/08-anchor-aware-chunk-thinning.md](../feature-catalog/13-memory-quality-and-indexing/08-anchor-aware-chunk-thinning.md) |
| NEW-047 | [13-memory-quality-and-indexing/09-encoding-intent-capture-at-index-time.md](../feature-catalog/13-memory-quality-and-indexing/09-encoding-intent-capture-at-index-time.md) |
| NEW-048 | [13-memory-quality-and-indexing/10-auto-entity-extraction.md](../feature-catalog/13-memory-quality-and-indexing/10-auto-entity-extraction.md) |
| NEW-049 | [14-pipeline-architecture/01-4-stage-pipeline-refactor.md](../feature-catalog/14-pipeline-architecture/01-4-stage-pipeline-refactor.md) |
| NEW-050 | [14-pipeline-architecture/02-mpab-chunk-to-memory-aggregation.md](../feature-catalog/14-pipeline-architecture/02-mpab-chunk-to-memory-aggregation.md) |
| NEW-051 | [14-pipeline-architecture/03-chunk-ordering-preservation.md](../feature-catalog/14-pipeline-architecture/03-chunk-ordering-preservation.md) |
| NEW-052 | [14-pipeline-architecture/04-template-anchor-optimization.md](../feature-catalog/14-pipeline-architecture/04-template-anchor-optimization.md) |
| NEW-053 | [14-pipeline-architecture/05-validation-signals-as-retrieval-metadata.md](../feature-catalog/14-pipeline-architecture/05-validation-signals-as-retrieval-metadata.md) |
| NEW-054 | [14-pipeline-architecture/06-learned-relevance-feedback.md](../feature-catalog/14-pipeline-architecture/06-learned-relevance-feedback.md) |
| NEW-055 | [15-retrieval-enhancements/01-dual-scope-memory-auto-surface.md](../feature-catalog/15-retrieval-enhancements/01-dual-scope-memory-auto-surface.md) |
| NEW-056 | [15-retrieval-enhancements/02-constitutional-memory-as-expert-knowledge-injection.md](../feature-catalog/15-retrieval-enhancements/02-constitutional-memory-as-expert-knowledge-injection.md) |
| NEW-057 | [15-retrieval-enhancements/03-spec-folder-hierarchy-as-retrieval-structure.md](../feature-catalog/15-retrieval-enhancements/03-spec-folder-hierarchy-as-retrieval-structure.md) |
| NEW-058 | [15-retrieval-enhancements/04-lightweight-consolidation.md](../feature-catalog/15-retrieval-enhancements/04-lightweight-consolidation.md) |
| NEW-059 | [15-retrieval-enhancements/05-memory-summary-search-channel.md](../feature-catalog/15-retrieval-enhancements/05-memory-summary-search-channel.md) |
| NEW-060 | [15-retrieval-enhancements/06-cross-document-entity-linking.md](../feature-catalog/15-retrieval-enhancements/06-cross-document-entity-linking.md) |
| NEW-061 | [16-tooling-and-scripts/01-tree-thinning-for-spec-folder-consolidation.md](../feature-catalog/16-tooling-and-scripts/01-tree-thinning-for-spec-folder-consolidation.md) |
| NEW-062 | [16-tooling-and-scripts/03-progressive-validation-for-spec-documents.md](../feature-catalog/16-tooling-and-scripts/03-progressive-validation-for-spec-documents.md) |
| NEW-063 | [17-governance/01-feature-flag-governance.md](../feature-catalog/17-governance/01-feature-flag-governance.md) |
| NEW-064 | [17-governance/02-feature-flag-sunset-audit.md](../feature-catalog/17-governance/02-feature-flag-sunset-audit.md) |
| NEW-065 | [08-bug-fixes-and-data-integrity/05-database-and-schema-safety.md](../feature-catalog/08-bug-fixes-and-data-integrity/05-database-and-schema-safety.md) |
| NEW-066 | [11-scoring-and-calibration/11-scoring-and-ranking-corrections.md](../feature-catalog/11-scoring-and-calibration/11-scoring-and-ranking-corrections.md) |
| NEW-067 | [14-pipeline-architecture/07-search-pipeline-safety.md](../feature-catalog/14-pipeline-architecture/07-search-pipeline-safety.md) |
| NEW-068 | [08-bug-fixes-and-data-integrity/06-guards-and-edge-cases.md](../feature-catalog/08-bug-fixes-and-data-integrity/06-guards-and-edge-cases.md) |
| NEW-069 | [13-memory-quality-and-indexing/13-entity-normalization-consolidation.md](../feature-catalog/13-memory-quality-and-indexing/13-entity-normalization-consolidation.md) |
| NEW-070 | [16-tooling-and-scripts/04-dead-code-removal.md](../feature-catalog/16-tooling-and-scripts/04-dead-code-removal.md) |
| NEW-071 | [14-pipeline-architecture/08-performance-improvements.md](../feature-catalog/14-pipeline-architecture/08-performance-improvements.md) |
| NEW-072 | [09-evaluation-and-measurement/12-test-quality-improvements.md](../feature-catalog/09-evaluation-and-measurement/12-test-quality-improvements.md) |
| NEW-073 | [13-memory-quality-and-indexing/14-quality-gate-timer-persistence.md](../feature-catalog/13-memory-quality-and-indexing/14-quality-gate-timer-persistence.md) |
| NEW-074 | [11-scoring-and-calibration/12-stage-3-effectivescore-fallback-chain.md](../feature-catalog/11-scoring-and-calibration/12-stage-3-effectivescore-fallback-chain.md) |
| NEW-075 | [08-bug-fixes-and-data-integrity/07-canonical-id-dedup-hardening.md](../feature-catalog/08-bug-fixes-and-data-integrity/07-canonical-id-dedup-hardening.md) |
| NEW-076 | [14-pipeline-architecture/09-activation-window-persistence.md](../feature-catalog/14-pipeline-architecture/09-activation-window-persistence.md) |
| NEW-077 | [15-retrieval-enhancements/07-tier-2-fallback-channel-forcing.md](../feature-catalog/15-retrieval-enhancements/07-tier-2-fallback-channel-forcing.md) |
| NEW-078 | [14-pipeline-architecture/10-legacy-v1-pipeline-removal.md](../feature-catalog/14-pipeline-architecture/10-legacy-v1-pipeline-removal.md) |
| NEW-079 | [11-scoring-and-calibration/13-scoring-and-fusion-corrections.md](../feature-catalog/11-scoring-and-calibration/13-scoring-and-fusion-corrections.md) |
| NEW-080 | [14-pipeline-architecture/11-pipeline-and-mutation-hardening.md](../feature-catalog/14-pipeline-architecture/11-pipeline-and-mutation-hardening.md) |
| NEW-081 | [10-graph-signal-activation/08-graph-and-cognitive-memory-fixes.md](../feature-catalog/10-graph-signal-activation/08-graph-and-cognitive-memory-fixes.md) |
| NEW-082 | [09-evaluation-and-measurement/13-evaluation-and-housekeeping-fixes.md](../feature-catalog/09-evaluation-and-measurement/13-evaluation-and-housekeeping-fixes.md) |
| NEW-083 | [08-bug-fixes-and-data-integrity/08-mathmax-min-stack-overflow-elimination.md](../feature-catalog/08-bug-fixes-and-data-integrity/08-mathmax-min-stack-overflow-elimination.md) |
| NEW-084 | [08-bug-fixes-and-data-integrity/09-session-manager-transaction-gap-fixes.md](../feature-catalog/08-bug-fixes-and-data-integrity/09-session-manager-transaction-gap-fixes.md) |
| NEW-085 | [02-mutation/06-transaction-wrappers-on-mutation-handlers.md](../feature-catalog/02-mutation/06-transaction-wrappers-on-mutation-handlers.md) |
| NEW-086 | [01-retrieval/06-bm25-trigger-phrase-re-index-gate.md](../feature-catalog/01-retrieval/06-bm25-trigger-phrase-re-index-gate.md) |
| NEW-087 | [14-pipeline-architecture/12-dbpath-extraction-and-import-standardization.md](../feature-catalog/14-pipeline-architecture/12-dbpath-extraction-and-import-standardization.md) |
| NEW-088 | [09-evaluation-and-measurement/14-cross-ai-validation-fixes.md](../feature-catalog/09-evaluation-and-measurement/14-cross-ai-validation-fixes.md) |
| NEW-089 | [16-tooling-and-scripts/05-code-standards-alignment.md](../feature-catalog/16-tooling-and-scripts/05-code-standards-alignment.md) |
| NEW-090 | [19-decisions-and-deferrals/01-int8-quantization-evaluation.md](../feature-catalog/19-decisions-and-deferrals/01-int8-quantization-evaluation.md) |
| NEW-091 | [19-decisions-and-deferrals/02-implemented-graph-centrality-and-community-detection.md](../feature-catalog/19-decisions-and-deferrals/02-implemented-graph-centrality-and-community-detection.md) |
| NEW-092 | [19-decisions-and-deferrals/03-implemented-auto-entity-extraction.md](../feature-catalog/19-decisions-and-deferrals/03-implemented-auto-entity-extraction.md) |
| NEW-093 | [19-decisions-and-deferrals/04-implemented-memory-summary-generation.md](../feature-catalog/19-decisions-and-deferrals/04-implemented-memory-summary-generation.md) |
| NEW-094 | [19-decisions-and-deferrals/05-implemented-cross-document-entity-linking.md](../feature-catalog/19-decisions-and-deferrals/05-implemented-cross-document-entity-linking.md) |
| NEW-095 | [14-pipeline-architecture/13-strict-zod-schema-validation.md](../feature-catalog/14-pipeline-architecture/13-strict-zod-schema-validation.md) |
| NEW-096 | [15-retrieval-enhancements/08-provenance-rich-response-envelopes.md](../feature-catalog/15-retrieval-enhancements/08-provenance-rich-response-envelopes.md) |
| NEW-097 | [05-lifecycle/05-async-ingestion-job-lifecycle.md](../feature-catalog/05-lifecycle/05-async-ingestion-job-lifecycle.md) |
| NEW-098 | [11-scoring-and-calibration/14-local-gguf-reranker-via-node-llama-cpp.md](../feature-catalog/11-scoring-and-calibration/14-local-gguf-reranker-via-node-llama-cpp.md) |
| NEW-099 | [16-tooling-and-scripts/06-real-time-filesystem-watching-with-chokidar.md](../feature-catalog/16-tooling-and-scripts/06-real-time-filesystem-watching-with-chokidar.md) |
| NEW-100 | *(server lifecycle — no dedicated catalog entry)* |
| NEW-101 | *(memory_delete confirm schema — covered by `02-mutation/03`)* |
| NEW-102 | *(node-llama-cpp optionalDependencies — covered by `11-scoring-and-calibration/14`)* |
| NEW-103 | [18-ux-hooks/05-dedicated-ux-hook-modules.md](../feature-catalog/18-ux-hooks/05-dedicated-ux-hook-modules.md) |
| NEW-104 | [18-ux-hooks/09-duplicate-save-no-op-feedback-hardening.md](../feature-catalog/18-ux-hooks/09-duplicate-save-no-op-feedback-hardening.md) |
| NEW-105 | [18-ux-hooks/08-context-server-success-hint-append.md](../feature-catalog/18-ux-hooks/08-context-server-success-hint-append.md) |
| NEW-106 | [18-ux-hooks/12-hooks-readme-and-export-alignment.md](../feature-catalog/18-ux-hooks/12-hooks-readme-and-export-alignment.md) |
| NEW-107 | [18-ux-hooks/03-checkpoint-delete-confirmname-safety.md](../feature-catalog/18-ux-hooks/03-checkpoint-delete-confirmname-safety.md) |
| NEW-108 | *(Phase 014 verification suite — no dedicated catalog entry)* |
| NEW-109 | [01-retrieval/08-quality-aware-3-tier-search-fallback.md](../feature-catalog/01-retrieval/08-quality-aware-3-tier-search-fallback.md) |
| NEW-110 | [02-mutation/08-prediction-error-save-arbitration.md](../feature-catalog/02-mutation/08-prediction-error-save-arbitration.md) |
| NEW-111 | [13-memory-quality-and-indexing/15-deferred-lexical-only-indexing.md](../feature-catalog/13-memory-quality-and-indexing/15-deferred-lexical-only-indexing.md) |
| NEW-112 | [14-pipeline-architecture/17-cross-process-db-hot-rebinding.md](../feature-catalog/14-pipeline-architecture/17-cross-process-db-hot-rebinding.md) |
| NEW-113 | [16-tooling-and-scripts/07-standalone-admin-cli.md](../feature-catalog/16-tooling-and-scripts/07-standalone-admin-cli.md) |
| NEW-114 | [05-lifecycle/05-async-ingestion-job-lifecycle.md](../feature-catalog/05-lifecycle/05-async-ingestion-job-lifecycle.md) |
| NEW-115 | [08-bug-fixes-and-data-integrity/09-session-manager-transaction-gap-fixes.md](../feature-catalog/08-bug-fixes-and-data-integrity/09-session-manager-transaction-gap-fixes.md) |
| NEW-116 | [08-bug-fixes-and-data-integrity/10-chunking-orchestrator-safe-swap.md](../feature-catalog/08-bug-fixes-and-data-integrity/10-chunking-orchestrator-safe-swap.md) |
| NEW-117 | [08-bug-fixes-and-data-integrity/11-working-memory-timestamp-fix.md](../feature-catalog/08-bug-fixes-and-data-integrity/11-working-memory-timestamp-fix.md) |
| NEW-118 | [11-scoring-and-calibration/13-scoring-and-fusion-corrections.md](../feature-catalog/11-scoring-and-calibration/13-scoring-and-fusion-corrections.md) |
| NEW-119 | [13-memory-quality-and-indexing/04-spec-folder-description-discovery.md](../feature-catalog/13-memory-quality-and-indexing/04-spec-folder-description-discovery.md) |

### Catalog Entries Without Playbook Coverage (19 entries)

These catalog entries have no dedicated playbook scenario. They are either deferred/planned features, cross-cutting concerns tested implicitly via other scenarios, or documentation-only entries:

| Catalog Entry | Reason |
|---|---|
| `01-retrieval/07-ast-level-section-retrieval-tool.md` | DEFERRED — not yet implemented |
| `02-mutation/07-namespace-management-crud-tools.md` | DEFERRED — not yet implemented |
| `10-graph-signal-activation/09-anchor-tags-as-graph-nodes.md` | DEFERRED — planned for Sprint 019, not yet implemented |
| `13-memory-quality-and-indexing/11-content-aware-memory-filename-generation.md` | Tested implicitly via NEW-045 (smarter content generation) |
| `13-memory-quality-and-indexing/12-generation-time-duplicate-and-empty-content-prevention.md` | Tested implicitly via NEW-004 (SHA-256 dedup) |
| `14-pipeline-architecture/14-dynamic-server-instructions-at-mcp-initialization.md` | Server startup concern — tested implicitly |
| `14-pipeline-architecture/15-warm-server-daemon-mode.md` | DEFERRED — not yet implemented |
| `14-pipeline-architecture/16-backend-storage-adapter-abstraction.md` | DEFERRED — not yet implemented |
| `15-retrieval-enhancements/09-contextual-tree-injection.md` | Tested implicitly via context retrieval scenarios |
| `16-tooling-and-scripts/02-architecture-boundary-enforcement.md` | Build-time enforcement — not runtime testable |
| `18-ux-hooks/01-shared-post-mutation-hook-wiring.md` | Tested via NEW-085, NEW-103, NEW-104 |
| `18-ux-hooks/02-memory-health-autorepair-metadata.md` | Tested via EX-013 (health diagnostics) |
| `18-ux-hooks/04-schema-and-type-contract-synchronization.md` | Build-time concern — tested via NEW-095 |
| `18-ux-hooks/06-mutation-hook-result-contract-expansion.md` | Tested via NEW-103 |
| `18-ux-hooks/07-mutation-response-ux-payload-exposure.md` | Tested via NEW-104 |
| `18-ux-hooks/10-atomic-save-parity-and-partial-indexing-hints.md` | Tested via NEW-104 |
| `18-ux-hooks/11-final-token-metadata-recomputation.md` | Tested via NEW-105 |
| `18-ux-hooks/13-end-to-end-success-envelope-verification.md` | Tested via NEW-105 |
| `20-feature-flag-reference/*` (7 entries) | Reference docs — tested via EX-028..034 |

## Dedicated Memory/Spec-Kit Scenarios (Required)

### M-001 Context Recovery and Continuation
- Prompt: `/memory:continue specs/<target-spec>`
- Commands:
  - `memory_search({query:"state next-steps blockers decisions", specFolder:"specs/<target-spec>", anchors:["state","next-steps","blockers","decisions"]})`
- Expected: Resume-ready state summary and next steps.
- Evidence: returned context + extracted next actions.
- Pass: Continuation context is actionable and specific.
- Fail triage: broaden anchors; verify spec folder path.

### M-002 Targeted Memory Lookup
- Prompt: `Find rationale for <specific decision>`
- Commands:
  - `memory_search({query:"<decision rationale>", specFolder:"specs/<target-spec>", anchors:["decision-record","rationale"]})`
- Expected: precise fact-level retrieval.
- Evidence: fact + source snippet.
- Pass: question answered with traceable result.
- Fail triage: refine query terms; use focused mode.

### M-003 Context Save + Index Update
- Commands:
  - `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js specs/<target-spec>`
  - `memory_index_scan({ specFolder: "specs/<target-spec>" })`
- Expected: saved context artifacts are discoverable.
- Evidence: save output + index output.
- Pass: context appears in retrieval post-index.
- Fail triage: rerun save; inspect path/permissions.

### M-004 Main-Agent Review and Verdict Handoff
- Prompt:
  - `@review findings-first review with severity + verdict APPROVE/CHANGES_REQUESTED`
- Expected: severity-ranked findings and final verdict.
- Evidence: review output with file:line findings.
- Pass: deterministic verdict issued with rationale.
- Fail triage: collect missing evidence and rerun review.

## Gemini Overlay Scenario Packs

Use these as execution bundles over the canonical per-feature matrix:

1. Full-Pipeline Search Routing
2. Cognitive Fast-Path and Triggers
3. Memory Storage, Quality and Deduplication
4. Chunking and Rendering
5. Graph Traversals and Topology
6. Feedback and System Intelligence
7. Lifecycle, Folders and Administration
8. Evaluation and Telemetry

Overlay source section:
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/manual-testing-playbook/memory/05-03-26_14-56__spec-memory-search-state-filter-fix.md`
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/manual-testing-playbook/memory/05-03-26_15-17__spec-memory-search-state-filter-fix.md`
