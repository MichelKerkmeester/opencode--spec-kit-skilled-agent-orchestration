---
title: "Iteration 039 — Fingerprint mismatch forensics and retry loop safeguards"
iteration: 39
band: F
timestamp: 2026-04-11T13:13:08Z
worker: cli-codex gpt-5.4 xhigh fast
scope: q2_q7_q9_fingerprint_forensics
status: complete
focus: "Design the detector that distinguishes real concurrent edits from logic bugs, the retry-loop circuit breaker, telemetry for normal vs pathological retries, post-save verification window, and index-doc divergence recovery."
maps_to_questions: [Q2, Q7, Q9]
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/003-continuity-refactor-gates"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["research/iterations/iteration-039.md"]

---

# Iteration 039 — Fingerprint mismatch forensics and retry loop safeguards

## 1. Goal
Iteration 015 established the `mtime`-based retry path for external edits. Iteration 017 added post-save fingerprint verification so "save returned success" no longer implies "expected bytes reached disk." Iteration 023 defined the merge envelope that produces a single rebuilt document. Iteration 026 classified silent post-write mismatches as the dangerous failure class.
This pass closes the missing forensic split: when `expected_post_merge_fingerprint != actual_post_merge_fingerprint`, is that because another writer raced us or because our own merge/write pipeline is wrong?
That distinction matters because the retry policy must be asymmetric:
- Retry only when evidence points to a transient race.
- Halt immediately when evidence points to a deterministic logic bug.
- Halt immediately when evidence is ambiguous enough that retry would only hide the problem.
The core rule is therefore: bounded retries are a recovery tool, not a substitute for diagnosis. A loud stop is safer than an infinite "helpful" loop.

## 2. Fingerprint computation
Iteration 023's envelope implies the right hash unit: the whole serialized target document, not the anchor body in isolation. The hash input must be the exact bytes the save path intends to persist.
Definitions:
- `pre_merge_fingerprint`: hash of the raw bytes from the first read of `docPath`.
- `expected_post_merge_fingerprint`: hash of the exact bytes passed to `writePendingFile()` after `joinFrontmatterAndBody(parsed.frontmatter, rebuiltBody)`.
- `actual_post_merge_fingerprint`: hash of the raw bytes from the immediate post-promote re-read of `docPath`.
Exact-byte rules:
1. Hash the full document payload, including YAML delimiters, anchor comments, blank lines, and the final newline if present.
2. Do not hash a parsed AST, normalized text, or only the modified anchor.
3. If line-ending normalization exists, do it once before computing `expected_post_merge_fingerprint`; do not normalize again after re-read.
4. The post-save check hashes raw bytes from disk, not a reparsed representation.
Canonical formula:
```text
pre_merge_bytes = readFileBytes(docPath)
pre_merge_fingerprint = "sha256:" + sha256(pre_merge_bytes)
rebuilt_doc_text = joinFrontmatterAndBody(parsed.frontmatter, rebuiltBody)
expected_post_merge_bytes = utf8Encode(rebuilt_doc_text)
expected_post_merge_fingerprint = "sha256:" + sha256(expected_post_merge_bytes)
actual_post_merge_bytes = readFileBytes(docPath)
actual_post_merge_fingerprint = "sha256:" + sha256(actual_post_merge_bytes)
```
Why it matters:
- It keeps `POST_SAVE_FINGERPRINT` from iteration 017 exact.
- It makes mismatches directly comparable to the planned write envelope from iteration 023.
- It prevents semantic-equality hand-waving; the question here is byte identity, not meaning.

## 3. Mismatch detector
The verifier must collect more than hashes. A single mismatch says "something went wrong," but not what went wrong.
Required capture points:
- `read_stat`: `mtimeNs`, `ctimeNs`, `size`, `ino` from the first read.
- `pre_promote_stat`: stat of the target file immediately before `renamePendingToFinal()`.
- `promoted_stat`: stat of the final path immediately after rename.
- `promoted_inode`: inode observed immediately after rename.
- `actual_stat`: stat of the final path at verification re-read.
- `diff_pattern`: reduced summary of how `actual_post_merge_bytes` differs from `expected_post_merge_bytes`.
Detector pseudocode:
```text
function verify_post_save(plan, ctx):
  fp_expected = plan.expected_post_merge_fingerprint
  pre_promote_stat = statFile(ctx.docPath)
  if pre_promote_stat.mtimeNs != ctx.read_stat.mtimeNs:
    return race("pre_promote_mtime_drift")
  if pre_promote_stat.size != ctx.read_stat.size:
    return race("pre_promote_size_drift")
  writePendingFile(ctx.docPath, plan.expected_post_merge_bytes)
  fsyncPendingFile(ctx.docPath)
  renamePendingToFinal(ctx.docPath)
  fsyncParentDirectory(ctx.docPath)
  promoted_stat = statFile(ctx.docPath)
  promoted_inode = promoted_stat.ino
  actual_post_merge_bytes = readFileBytes(ctx.docPath)
  actual_stat = statFile(ctx.docPath)
  fp_actual = "sha256:" + sha256(actual_post_merge_bytes)
  if fp_expected == fp_actual:
    return success(fp_actual)
  diff_pattern = classify_diff(plan.expected_post_merge_bytes, actual_post_merge_bytes, ctx.anchorId)
  diff_pattern = classify_diff(plan.expected_post_merge_bytes, actual_post_merge_bytes, ctx.anchorId)
  if external_edit_detected(ctx.read_stat, pre_promote_stat, promoted_stat, actual_stat, promoted_inode, diff_pattern):
    return race("post_save_mismatch", fp_expected, fp_actual, diff_pattern)
  if our_merge_wrote_different_bytes(promoted_stat, actual_stat, promoted_inode, diff_pattern):
    return logic_bug("deterministic_self_mismatch", fp_expected, fp_actual, diff_pattern)
  return unknown("mixed_or_ambiguous_mismatch", fp_expected, fp_actual, diff_pattern)
```
Concrete discriminator rules:
- Classify as `race` if pre-promote `mtimeNs`, `ctimeNs`, or `size` drifted after the initial read.
- Classify as `race` if `actual_stat.ino != promoted_inode`; we just promoted that inode, so a swap before verify means another writer intervened.
- Classify as `race` if `actual_stat.mtimeNs > promoted_stat.mtimeNs` or `actual_stat.ctimeNs > promoted_stat.ctimeNs`; another write landed after promote.
- Classify as `race` if the diff is concentrated outside the target anchor or looks like a whole-document replacement.
- Classify as `logic_bug` only when there is no stat drift, `actual_stat.ino == promoted_inode`, and the diff is confined to the target anchor, the fingerprint line, newline style, or another deterministic serializer artifact.
- Classify as `unknown` when the signal mix is contradictory, such as no metadata drift but a foreign edit pattern outside the anchor.
Diff buckets:
- `outside_target_anchor_only`: likely real concurrent edit.
- `mixed_anchor_plus_foreign_edits`: likely real race with collision.
- `whole_doc_replaced`: likely real concurrent edit.
- `target_anchor_only`: likely merge logic bug.
- `fingerprint_line_only`: likely serializer or merge bug.
- `newline_only`: likely write-path normalization bug.
- `serializer_only`: likely deterministic self-mismatch.
- `mixed_or_unclassified`: unknown.
Clue interpretation:
- Large size delta plus foreign edits outside the anchor points to a real race.
- Stable size, stable inode, and a different fingerprint points to a logic bug.
- Repeated identical wrong bytes with no inode or timestamp drift is the strongest self-bug signal.
Policy:
- `race` -> retry allowed.
- `logic_bug` -> halt, preserve pending, page.
- `unknown` -> halt, preserve pending, page.

## 4. Retry-loop circuit breaker
Iterations 015 and 026 already chose the backoff sequence. This pass adds the stop logic that keeps retries bounded and diagnostic.
Backoff schedule:
- Retry attempt 1: 50ms
- Retry attempt 2: 100ms
- Retry attempt 3: 200ms
- Attempt 4: STOP; fire the circuit breaker instead of executing another write
Each failed retry emits a normalized mismatch signature:
```text
retry_pattern = {
  mismatch_kind,              # race | logic_bug | unknown
  diff_scope,                 # bucket from section 3
  actual_post_merge_fingerprint,
  size_delta_bucket,          # same | small | medium | large
  inode_changed,              # true | false
  pre_promote_drift,          # true | false
  post_promote_drift          # true | false
}
```
If `retry_pattern` is identical to the previous failed attempt, the retry loop is pathological. The environment is not changing, so continuing is more likely to mask a deterministic bug than to recover from a race.
Circuit-breaker pseudocode:
```text
function save_with_retry_guard(initial_plan, ctx):
  plan = initial_plan
  previous_pattern = null
  for retry_number in [0, 1, 2, 3]:
    result = attempt_save_and_verify(plan, ctx)
    if result.kind == "success":
      record_success(retry_number)
      return success
    if result.kind == "logic_bug":
      preserve_pending_and_halt("logic_bug", result)
      page_operator(result)
      return failure
    if result.kind == "unknown":
      preserve_pending_and_halt("unknown_mismatch", result)
      page_operator(result)
      return failure
    current_pattern = build_retry_pattern(result)
    if previous_pattern is not null and current_pattern == previous_pattern:
      preserve_pending_and_halt("sticky_retry_pattern", result)
      emit_circuit_breaker("sticky")
      return failure
    if retry_number == 3:
      preserve_pending_and_halt("retry_budget_exhausted", result)
      emit_circuit_breaker("budget")
      return failure
    previous_pattern = current_pattern
    sleep([50ms, 100ms, 200ms][retry_number])
    ctx = refresh_target_state(ctx.docPath, ctx.anchorId)
    plan = replan_merge_against_current_doc(ctx)
```
Preservation contract:
- Write `scratch/pending-save-{ts}.md`.
- Include original payload, target `docPath`, `anchorId`, expected and actual fingerprints, retry history, mismatch class, and continuation hint.
- Do not keep retrying after the breaker fires; canonical doc truth wins over optimism.

## 5. Normal-retry vs pathological-retry telemetry
The telemetry must separate "retry helped" from "retry hid a broken system for several rounds."
Required metrics:
- `save.retry.count` histogram for retries per save attempt.
- `save.retry.pattern{pattern=transient|sticky}` counter.
- `save.retry.succeeded_eventually` counter for saves that recovered after at least one retry.
- `save.retry.gave_up` counter for saves that entered retry and still terminated in preserve+halt.
- `save.retry.logic_bug` counter for deterministic self-mismatches.
- `save.retry.unknown` counter for ambiguous mismatches.
Pattern semantics:
- `transient`: mismatch signature changed across attempts or the save later verified.
- `sticky`: the same mismatch signature repeated on consecutive attempts.
Alert policy:
- Page immediately if `save.retry.logic_bug > 0`.
- Page immediately if `save.circuit_breaker.fired > 0`.
- Alert when sticky retries exceed `N = 3` in a rolling 10-minute window.
- Warn when `save.retry.count` p95 rises above `1`, because the healthy baseline should be near zero.
Operator split:
- "Retried and recovered" proves the guard handled a real race safely.
- "Retried and gave up" proves the guard prevented silent corruption but still exposed a reliability problem.
Those two rates must stay separate in dashboards and release gates.

## 6. Post-save verification window
Recommendation: sync-then-verify immediately.
The exact sequence is:
1. write pending file,
2. `fsync` pending file,
3. rename pending to final,
4. `fsync` parent directory,
5. reopen final path,
6. re-read final bytes immediately,
7. compute `actual_post_merge_fingerprint`,
8. classify success or mismatch immediately.
Why not delay:
- Delayed verification makes deterministic write bugs harder to classify.
- Waiting gives more time for external writers to blur the evidence.
- The save path already owns the mutex and the forensic context, so that is the best moment to diagnose.
Cost:
- One extra final-path open,
- one full-byte re-read,
- file and directory syncs,
- roughly `+50-100ms` on local SSD-backed packets.
That cost is acceptable because it turns SF-1 from "maybe happened" into an exact yes/no check. A delayed second verification sample can exist later as a debug-only tool, not as the default save path.

## 7. Index-doc divergence recovery
Fingerprint verification proves the canonical doc on disk matches the write plan. It does not prove the projection rows in `memory_index`, FTS, or vector state still match doc truth.
Phase 018 therefore needs a second invariant:
- canonical docs are source of truth,
- index rows are derived projections,
- recovery always flows from docs to index, never the reverse.
Divergence detector:
1. read raw doc bytes,
2. compute `doc_truth_fingerprint = sha256(doc_bytes)`,
3. parse `_memory.fingerprint` from frontmatter if present,
4. compare against `memory_index.canonical_doc_fingerprint`,
5. compare extracted anchor projections against indexed anchor projections.
Cross-check pseudocode:
```text
function cross_check_doc_vs_index(docPath, row):
  doc_bytes = readFileBytes(docPath)
  doc_truth_fingerprint = "sha256:" + sha256(doc_bytes)
  frontmatter_fingerprint = parseMemoryFingerprint(doc_bytes)
  if row.canonical_doc_fingerprint == doc_truth_fingerprint and frontmatter_fingerprint == doc_truth_fingerprint:
    if extracted_anchor_projection(doc_bytes) == row.anchor_projection:
      return in_sync
  emit_divergence(docPath, row.id, doc_truth_fingerprint, row.canonical_doc_fingerprint)
  return out_of_sync
```
Recovery path:
- mark the row degraded,
- re-extract anchor units from canonical doc truth,
- rebuild `memory_index`, FTS, and vector projections from that truth,
- clear degraded state only after fingerprints and projections realign.
Alert policy:
- `divergence_rate > 0` is `crit`.
- The baseline for doc-vs-index disagreement is zero because projection drift is already correctness drift.

## 8. User-facing error surface
When the circuit breaker fires, the user should see:
```text
⚠ Save protection triggered
   Your content was not overwritten. Three attempts produced conflicting fingerprints:
   - Attempt 1: mismatch (transient race, retried)
   - Attempt 2: mismatch (transient race, retried)
   - Attempt 3: same mismatch pattern -> halted

   Pending save preserved at: scratch/pending-save-2026-04-11T18-30.md

   Next steps:
   1. Review the pending file
   2. Run /memory:save --continue scratch/pending-save-...
   3. If this recurs, run /doctor:mcp_debug
```
UX rules:
- Never say "save succeeded with warnings" once the breaker fires.
- Always state that canonical content was not overwritten.
- Always include the preserved path.
- Always name the stop reason: `sticky pattern`, `logic bug suspected`, `unknown mismatch`, or `retry budget exhausted`.
If the detector classifies `logic_bug` on the first failed attempt, use the same shape with `Attempt 1: mismatch (logic bug suspected, halted immediately)` and keep the same preservation and continuation guidance.

## 9. Observability
Iteration 033 defined the broader instrumentation contract. This forensics path needs four always-on surfaces inside that contract:
- `save.fingerprint.verify`: span plus counter for `ok|mismatch|logic_bug|unknown`; maps to `validator.post_save.fingerprint`.
- `save.retry.attempt`: span or event per retry with `attempt`, `backoff_ms`, and `pattern`; aligns with `save.retry.external_edit`.
- `save.pending.preserved`: terminal event when the scratch artifact is written.
- `save.circuit_breaker.fired`: terminal counter or event for `sticky`, `budget`, `logic_bug`, or `unknown`.
Required tags:
- `spec_folder`
- `doc_path`
- `anchor_id` bucket or family
- `attempt`
- `result_kind`
- `pattern = transient | sticky`
- `stop_reason = budget | sticky | logic_bug | unknown`
Sampling policy:
- Unsampled, always on.
- These are safety signals, not high-volume search traces.
Interpretation:
- `save.fingerprint.verify` mismatch without later success is a page.
- `save.retry.attempt` with changing `pattern=transient` and later success is normal guarded recovery.
- `save.pending.preserved` without `save.circuit_breaker.fired` should be impossible.
- `save.circuit_breaker.fired` is the proof that the guard stopped a bad write from turning into silent corruption.

## 10. Ruled Out
Rejected retry strategies:
- Unbounded retry: masks deterministic bugs, extends lock hold time, and creates the exact silent-loop failure this phase is trying to prevent.
- No retry: turns every real editor race into manual recovery even when a safe re-read and replan would succeed.
- Immediate halt on any mismatch: safer than infinite retry, but too brittle for transient races.
- Delayed verification instead of immediate verification: weakens forensics and makes self-mismatches harder to classify.
- Treating doc-vs-index divergence as warning-only: wrong, because index drift is already correctness drift once canonical docs and retrieval disagree.
