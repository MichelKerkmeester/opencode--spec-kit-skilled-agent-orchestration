---
title: "Iteration 026 — Failure mode deep dive: detectors, recovery, error surface"
iteration: 26
band: C
timestamp: 2026-04-11T12:12:40Z
worker: codex-gpt-5.4
scope: q7_q9_failure_deep_dive
status: complete
focus: "Deepen the phase-018 failure taxonomy with exact detectors, rollback order, user text, log format, reproducible tests, and probability."
maps_to_questions: [Q7, Q9]
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-continuity-refactor-gates"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["research/iterations/iteration-026.md"]

---

# Iteration 026 — Q7 + Q9: Failure Mode Deep Dive

This pass deepens the explicit failure modes named in iteration 017. Detector paths point to either live code that phase 018 adapts or to the phase-018 module boundary that will own the check.

Exact user-facing strings below should be treated as implementation targets. Where phase 018 already proposed wording, that wording is preserved verbatim.

## Category 1 — Classifier failures

### CF-1 Low-confidence refusal
- Detector: planned `contentRouter.classifyContent()` from iteration 002 after Tier 1 rule match, Tier 2 prototype similarity, and Tier 3 LLM classification all stay below the refusal floor `< 0.50`; response shape mirrors current reject flow in `memory-save.ts:623-677`.
- Recovery: do not enter `anchorMergeOperation`; persist the unrouted chunk plus classifier scores to `scratch/pending-route-<ts>.json`; leave target docs and `_memory.continuity` untouched; return override choices.
- User text: `Chunk [3] refused to route (confidence 0.42). Choose drop, force-route, or save to scratch.`
- Log entry: `{"ts":"ISO-8601","component":"content-router","code":"CR001","chunk":3,"confidence":0.42,"topCandidate":"narrative_progress","action":"refuse","specFolder":"026-.../006-canonical-continuity-refactor"}`
- Repro: feed one chunk with mixed decision and task language, no structured type, and prototypes that all score below `0.50`.
- Probability: occasional.

### CF-2 Tier 3 LLM unavailable
- Detector: planned Tier 3 `llmClassifyChunk()` throws or times out after Tier 2 stays in the ambiguous band `0.50-0.69`; this follows the current fail-soft pattern used by `memory-context.ts:1142-1203`.
- Recovery: emit a warning, skip Tier 3, fall back to Tier 1 plus Tier 2 result only; if final confidence is still `< 0.50`, downgrade to CF-1 refusal; preserve the chunk, routing candidates, and session id.
- User text: `Classifier unavailable, falling back to rule-based and prototype routing.`
- Log entry: `[content-router] code=CR002 tier=3 action=fallback error="<sanitized provider error>" chunk=3`
- Repro: stub the Tier 3 provider to throw `503` while sending a chunk that intentionally misses Tier 1 and lands in Tier 2 ambiguity.
- Probability: rare.

### CF-3 Ambiguous multi-category chunk
- Detector: planned `contentRouter.classifyContent()` sees top-two categories within a narrow delta, for example `abs(score1 - score2) <= 0.05`, after Tier 2 or Tier 3; category inventory comes from iteration 002.
- Recovery: split the chunk on sentence boundaries if a clean split yields two high-confidence children; otherwise hold the original chunk, write neither child nor parent, and ask the user to pick one route; preserve original text and split proposals.
- User text: `Chunk [4] matches 2 categories equally. Split it or choose one target.`
- Log entry: `{"ts":"ISO-8601","component":"content-router","code":"CR003","chunk":4,"candidates":[["decision",0.68],["task_update",0.66]],"action":"needs_split"}`
- Repro: use a paragraph that says both `Chose X because...` and `Marked T023 complete with evidence...`.
- Probability: occasional.

### CF-4 User override conflicts with classifier
- Detector: `/memory:save --route-as <category>` requests a target that differs from the classifier winner and the classifier confidence for the requested target is low; override semantics come from iteration 002 and save UX from `findings/save-journey.md`.
- Recovery: honor the explicit override, but mark the operation as expert-forced; skip auto-refusal, keep the original classifier explanation in the response, and append an audit row so later review can reconstruct why the misroute risk was accepted.
- User text: `Override applied despite low match (confidence 0.30). Proceeding because you explicitly selected decision.`
- Log entry: `{"ts":"ISO-8601","component":"content-router","code":"CR004","action":"override_accept","requested":"decision","predicted":"narrative_progress","requestedConfidence":0.30}`
- Repro: call interactive save, then redirect a narrative progress chunk into `decision`.
- Probability: rare.

## Category 2 — Merge failures

### MF-1 Target anchor missing
- Detector: planned `anchorMergeOperation()` regex scan cannot find `<!-- ANCHOR:x --> ... <!-- /ANCHOR:x -->`; this is specified in iteration 003 and becomes `MERGE_002` in `findings/validation-contract.md`.
- Recovery: abort before any pending-file promotion; preserve the original doc bytes, routing decision, and pending chunk; return suggestions to regenerate docs, create the anchor, or pick a different target.
- User text: `Target anchor 'what-built' not found in implementation-summary.md. Did you mean to create it?`
- Log entry: `[anchor-merge] code=MG001 doc=implementation-summary.md anchor=what-built action=abort reason=anchor_missing`
- Repro: remove the `what-built` anchor from a valid `implementation-summary.md` and save a `narrative_progress` chunk.
- Probability: occasional during rollout, rare after templates stabilize.

### MF-2 Target document missing
- Detector: planned structure gate in `lib/validation/spec-doc-structure.ts` fails the `doc exists` check before merge planning; this extends the current file-presence checks around `generate-context.ts:439-545`.
- Recovery: refuse the write before classification results are applied; preserve extracted chunks and continuity update candidates in scratch; instruct the operator to backfill the canonical doc first.
- User text: `Target doc implementation-summary.md not found. Complete the root-packet backfill before saving here.`
- Log entry: `[anchor-merge] code=MG002 doc=implementation-summary.md action=abort reason=doc_missing specFolder=...`
- Repro: point save at a packet that lacks `implementation-summary.md`.
- Probability: occasional during migration, rare after Gate A.

### MF-3 Anchor integrity broken after merge
- Detector: post-merge `ANCHORS_VALID` pass fails after the merge is computed but before completion; detector is planned in `lib/validation/spec-doc-structure.ts` and adapts current rollback machinery in `memory-save.ts:1569-1707`.
- Recovery: 1) keep the per-spec-folder mutex; 2) restore the captured pre-merge file bytes; 3) remove the pending file; 4) leave indexing and continuity updates uncommitted; 5) surface manual inspection guidance.
- User text: `Save rolled back: ANCHORS_VALID validation failed. Pre-merge state restored.`
- Log entry: `[anchor-merge] code=MG003 action=rollback doc=implementation-summary.md failedRule=ANCHORS_VALID restored=true`
- Repro: craft a merge mode that accidentally removes `<!-- /ANCHOR:decisions -->` from the rebuilt document.
- Probability: rare.

### MF-4 Frontmatter corruption
- Detector: YAML parse of the target doc frontmatter fails before merge application; the planned memory-block validator from `findings/validation-contract.md` owns the check, and the current analog is `session-resume.ts` parse/fidelity rejection.
- Recovery: no merge attempt, no file promotion, no auto-fix; preserve original file and routed content only; ask the user to repair the YAML because the canonical doc identity is unsafe to mutate automatically.
- User text: `Frontmatter parse error in handover.md. Fix YAML before retrying save.`
- Log entry: `[anchor-merge] code=MG004 doc=handover.md action=abort reason=frontmatter_parse_error`
- Repro: break the opening YAML block in `handover.md` with an unclosed quote, then save a `handover_state` chunk.
- Probability: rare.

### MF-5 External edit during merge
- Detector: planned mtime check from iteration 015 sees `mtime_after_read !== mtime_before_promote` just before pending-file promotion; current atomic promotion path is `memory-save.ts:1571-1576`.
- Recovery: 1) abort the promote; 2) re-read the target doc; 3) re-run merge planning against the new bytes; 4) retry with exponential backoff `50ms → 100ms → 200ms`; 5) after 3 failures, preserve chunk in `scratch/pending-save-<ts>.md`.
- User text: `Concurrent edit detected. Re-reading target doc and retrying save.`
- Log entry: `[anchor-merge] code=MG005 doc=implementation-summary.md action=retry attempt=2 oldMtime=... newMtime=...`
- Repro: start a save, then write to the same target doc from an editor between the initial read and pending-file promote.
- Probability: rare.

## Category 3 — Save pipeline failures

### SP-1 Preflight validation fails
- Detector: live `handleMemorySave()` calls `preflight.runPreflight()` at `memory-save.ts:1273-1418`; any `preflightResult.pass === false` throws `PreflightError`.
- Recovery: stop before indexing or embedding; preserve input file content as-is; return concrete validation errors plus the bypass option; no DB or doc mutation occurs.
- User text: `Pre-flight validation failed: <joined errors>. Fix the validation errors and retry, or use skipPreflight=true to bypass.`
- Log entry: `[preflight] <validatedPath>: error code=PF0xx message="<text>"`
- Repro: save a memory/spec doc with duplicate anchors or content shorter than `PREFLIGHT_CONFIG.min_content_length`.
- Probability: common in early authoring, occasional in normal use.

### SP-2 Sufficiency gate fails
- Detector: live `evaluateMemorySufficiency()` at `memory-sufficiency.ts:311-412`; `memory-save.ts:655-660` turns `pass === false` into a rejection unless warn-only mode is active.
- Recovery: do not write or index; preserve parsed content and warnings; ask for concrete evidence additions such as files, decisions, blockers, or next actions; continuity is unchanged.
- User text: `Not enough context was available to save a durable memory. Add concrete file, tool, decision, blocker, next action, or outcome evidence and retry.`
- Log entry: `[memory-save] code=SV002 action=reject gate=sufficiency reasons="No primary evidence was captured; Fewer than two spec-relevant evidence items were captured"`
- Repro: save content with a generic title and only one vague paragraph without file references, decisions, or blockers.
- Probability: common for weak manual saves, occasional for generated saves.

### SP-3 Quality loop does not converge
- Detector: live `runQualityLoop()` at `quality-loop.ts:581-688`; rejection reason is emitted when score stays below threshold after `maxRetries`.
- Recovery: if `qualityGateMode=enforce`, reject before persistence; if `warn-only`, keep the best-scoring content but mark it as degraded; in phase 018 UX, also write the rejected chunk to scratch for review.
- User text: `Quality loop hit max iterations without passing. Best attempt preserved in scratch; no canonical write was made.`
- Log entry: `[quality-loop] code=SV003 passed=false attempts=3 score=0.41 rejected=true issues="..."`
- Repro: feed content full of contamination chatter and malformed anchors so auto-fixes improve it but never lift it above threshold.
- Probability: occasional.

### SP-4 Contamination gate trips
- Detector: current contamination cleanup is `filterContamination()` in `contamination-filter.ts:161-205`; phase 018 adds cross-anchor contamination in iteration 009 when routed content semantically mismatches the target anchor.
- Recovery: strip orchestration chatter first; if residual content still looks like the wrong anchor, do not merge automatically; hold the chunk for reroute or scratch review; preserve cleaned and raw forms for audit.
- User text: `Content appears to target the wrong anchor. Review the routing decision before writing.`
- Log entry: `{"ts":"ISO-8601","component":"save-pipeline","code":"SV004","anchor":"decisions","matchedPatterns":["analysis preamble"],"crossAnchorSimilarity":0.43,"action":"hold_for_review"}`
- Repro: route a task checklist update into `decision-record.md::adr-007` or include orchestration chatter like `I'll analyze this step by step`.
- Probability: occasional.

### SP-5 PE arbitration rejects near-duplicate content
- Detector: live dedup and PE gates run in `memory-save.ts:797-829`; exact duplicate check is in `save/dedup.ts:245-309`, while phase-018 reconsolidation thresholds come from iteration 009.
- Recovery: exact duplicate `> identical hash + secondary verification` becomes a no-op; near-duplicate `0.88-0.96` logs review-recommended but may proceed; preserve existing canonical target and return the prior memory/document id.
- User text: `Near-duplicate detected at 0.96 similarity. Existing canonical content was kept.`
- Log entry: `[memory-save] code=SV005 action=dedup existingId=123 similarity=0.96 outcome=skip_or_review`
- Repro: replay the same save twice, then try a lightly edited version that changes wording but not substance.
- Probability: common for replayed saves, occasional for true near-duplicates.

## Category 4 — Schema / index failures

### SI-1 UNIQUE constraint violation
- Detector: planned anchor-level uniqueness on `(spec_folder, doc, anchor[, relation])` fails during insert/update; current analog is the causal-edge UPSERT and dedup transaction discipline in `causal-edges.ts:202-241` and `memory-save.ts:725-830`.
- Recovery: convert the failed insert into update-in-place when the logical key already exists; if row contents disagree, return the conflicting row id and keep the original row authoritative; preserve pending content for manual merge if needed.
- User text: `Duplicate key for this anchor already exists. Updated the existing record instead of inserting a second one.`
- Log entry: `[continuity-index] code=SI001 action=upsert_conflict key="026/...::implementation-summary.md::what-built" existingId=456`
- Repro: insert the same continuity or anchor node twice with the same logical key during a migration replay.
- Probability: occasional during migration, rare after steady state.

### SI-2 FTS5 sync failure
- Detector: phase 018 assumes lexical index update fails after the canonical doc write succeeds but before search projections are consistent; iteration 017 names this as `FTS5 index out of sync`.
- Recovery: keep the promoted doc on disk, mark the index state degraded, enqueue `memory_index_scan --repair` or equivalent repair action, and suppress stale search results until reindex completes; preserve canonical docs and the failing projection metadata.
- User text: `FTS5 index out of sync with memory_index. Canonical write succeeded; reindex required.`
- Log entry: `[continuity-index] code=SI002 action=degraded_index repair=memory_index_scan reason="fts_sync_failed"`
- Repro: simulate a write to the canonical doc while forcing the FTS projection update to throw.
- Probability: rare.

### SI-3 Embedding model mismatch
- Detector: phase 018 semantic search still uses embeddings; mismatch is detected when stored embedding metadata no longer matches `embeddings.getModelName()` or dimension expectations, analogous to `embedding-pipeline.ts:128-170`.
- Recovery: keep lexical indexing and canonical docs live, mark semantic retrieval pending, enqueue a re-embedding pass, and return partial-service hints instead of blocking the save.
- User text: `Embedding model changed; lexical indexing completed, but re-embedding is required for semantic search.`
- Log entry: `[embedding-pipeline] code=SI003 action=defer_reembed model=current!=stored file=implementation-summary.md`
- Repro: change the configured embedding model or vector dimension, then resume against rows generated under the old model.
- Probability: rare.

### SI-4 Causal edge insert fails
- Detector: current `insertEdge()` in `causal-edges.ts:158-255` returns `null` for self-loops, edge-bound violations, non-finite strength, or caught DB errors.
- Recovery: keep the canonical doc save; skip only the edge mutation; emit a warning with source and target ids; preserve the raw edge payload so a later repair pass can retry it.
- User text: `Causal edge references could not be indexed. Canonical content was saved, but the causal link was skipped.`
- Log entry: `[causal-edges] code=SI004 action=skip source=123 target=456 relation=supersedes reason="insertEdge rejected non-finite strength"`
- Repro: save a doc whose `_memory.causal_links` produces a self-loop or invalid strength value.
- Probability: rare.

## Category 5 — Resume / read failures

### RR-1 Packet pointer invalid
- Detector: planned `resumeLadder.resolvePacketPointer()` cannot resolve the target spec folder, or current `session-resume` scope validation rejects the requested scope at `session-resume.ts:300-324`.
- Recovery: do not guess; stop the fast path immediately; ask for `--spec-folder`; preserve cached continuity and any discovered fallback clues but do not hydrate them into the main resume output.
- User text: `Packet folder not found. Re-run /spec_kit:resume with --spec-folder <path>.`
- Log entry: `[resume-ladder] code=RR001 action=abort reason=packet_pointer_invalid requested="<path>"`
- Repro: resume from a renamed or deleted packet path that still appears in continuity metadata.
- Probability: occasional during refactors, rare otherwise.

### RR-2 `_memory.continuity` block missing
- Detector: planned fast path reads frontmatter successfully but `_memory.continuity` is absent; iteration 013 explicitly defines this fall-through.
- Recovery: skip the continuity layer, read `handover.md` if available, then spec docs, then archived memory; preserve the fact that the packet is legacy so the next save can backfill continuity.
- User text: `No continuity block found; falling through to full doc read.`
- Log entry: `[resume-ladder] code=RR002 action=fallback reason=continuity_missing doc=implementation-summary.md`
- Repro: run resume on a packet that predates the continuity frontmatter block.
- Probability: common during migration, rare after backfill.

### RR-3 `handover.md` malformed
- Detector: planned `resumeLadder.readHandover()` cannot parse the latest session section or frontmatter; current analog is cached summary fidelity rejection in `session-resume.ts:211-279`.
- Recovery: ignore `handover.md` only; continue with continuity, spec docs, and archived fallback; preserve a warning so the next handover write can repair the structure.
- User text: `handover.md parse error; skipping to spec docs.`
- Log entry: `[resume-ladder] code=RR003 action=fallback reason=handover_parse_error doc=handover.md`
- Repro: corrupt the latest handover session heading or YAML block, then call resume.
- Probability: rare.

### RR-4 All canonical docs missing
- Detector: `resumeLadder` fails every rung: no handover, no continuity, no usable spec docs; iteration 013 names this as the root-packet backfill gap.
- Recovery: fall back to archived memory only if available; if archived is also empty, return a hard prerequisite failure and suggest `/spec_kit:plan`; preserve the packet pointer and failure audit.
- User text: `No canonical docs found; archived memory fallback active.`
- Log entry: `[resume-ladder] code=RR004 action=archived_fallback reason=canonical_docs_missing specFolder=...`
- Repro: create a packet folder with no canonical docs and no continuity block, then call `/spec_kit:resume`.
- Probability: occasional before Gate A, rare after rollout.

## Category 6 — Silent failures

### SF-1 Save appears successful but bytes never persist
- Detector: planned `POST_SAVE_FINGERPRINT` re-reads the target doc and compares the persisted fingerprint to the expected merge fingerprint; this mirrors the identity check in `session-resume.ts:264-279`.
- Recovery: 1) detect mismatch immediately after write; 2) roll back to pre-merge bytes under the same mutex; 3) mark the save failed; 4) preserve the expected fingerprint, actual fingerprint, and pending chunk for forensic replay.
- User text: `Post-save verification failed. The write was rolled back because the saved fingerprint did not match the expected result.`
- Log entry: `[continuity-guard] code=SF001 action=rollback expected=sha256:... actual=sha256:... doc=implementation-summary.md`
- Repro: monkey-patch the post-write file before verification or corrupt the write pipeline so the promoted bytes differ from the planned merge output.
- Probability: rare.

### SF-2 Misroute accepted without immediate detection
- Detector: routing decision confidence lands in the warn band `0.50-0.69`; no hard failure occurs, so the only detector is the routing audit log defined in `findings/save-journey.md`.
- Recovery: keep the canonical write, but emit a visible warning and record the route in `scratch/routing-log.jsonl`; later audits can replay low-confidence routes and either accept or revert them; preserve classifier explanation and target anchor.
- User text: `Routed with warning: low-confidence decision logged for review.`
- Log entry: `{"ts":"ISO-8601","component":"content-router","code":"SF002","chunk":2,"confidence":0.61,"target":"implementation-summary.md::what-built","action":"warn_only_route"}`
- Repro: classify a chunk with confidence `0.61` and run auto mode.
- Probability: occasional.

### SF-3 FSRS decay expires the wrong row
- Detector: iteration 017 assigns this to periodic `memory_health`; the symptom is a suspicious state transition or decay timestamp that conflicts with recent access history.
- Recovery: do not rewrite canonical docs; mark the FSRS state suspect, rebuild the decay state from access logs or last-reviewed metadata, and preserve the pre-repair state for comparison; retrieval may temporarily ignore the decayed row.
- User text: `Memory state anomaly detected. Decay metadata is being re-evaluated before the row is archived.`
- Log entry: `[memory-health] code=SF003 action=quarantine memoryId=789 reason=fsrs_decay_anomaly`
- Repro: inject a future timestamp or negative interval into the FSRS state, then run `memory_health`.
- Probability: rare.

### SF-4 External race overwrites human content without a visible merge failure
- Detector: the phase-018 mitigation is the iteration-015 mtime guard plus post-save fingerprint verification; absence of either is what makes this silent.
- Recovery: with the guard enabled, abort and retry as MF-5; without it, the last-resort recovery is git-based restoration using the last good doc version plus the preserved pending save in scratch; preserve both human and agent variants.
- User text: `External edit conflict could not be resolved automatically. Your save payload was preserved for manual recovery.`
- Log entry: `[continuity-guard] code=SF004 action=manual_recovery doc=implementation-summary.md pending=scratch/pending-save-<ts>.md`
- Repro: disable or bypass the mtime check, then save the target doc from an editor during pending-file promotion.
- Probability: rare but high impact.

## Findings

- **F26.1**: The failure surface is still dominated by four checkpoints: classifier confidence, merge legality, save-time atomicity, and resume ladder fidelity.
- **F26.2**: The most important state-preservation rule is consistent across categories: preserve the original canonical doc bytes first, preserve the unrouted or unmerged chunk second, and only then expose override or repair options.
- **F26.3**: Resume/read failures degrade cleanly if the ladder order from iteration 013 is enforced strictly: `handover -> continuity -> spec docs -> archived`.
- **F26.4**: The dangerous failures remain the silent class. Post-save fingerprint verification and low-confidence routing audit logs are the two controls that keep Option C inspectable.
