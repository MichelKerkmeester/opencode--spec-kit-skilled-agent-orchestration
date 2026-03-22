---
title: "Post-save quality review"
description: "After a memory file is written, a post-save quality review compares saved frontmatter against the original JSON payload and emits machine-readable severity-graded findings before indexing begins."
---

# Post-save quality review

## 1. OVERVIEW

The post-save quality review runs after the memory file is written (Step 10.5 in the save workflow) and before indexing starts (Step 11). It compares the saved frontmatter and MEMORY METADATA block against the original JSON payload to detect propagation failures and field-level quality issues.

This is a verification step that catches cases where the rendering pipeline silently dropped or degraded caller-supplied fields — generic titles, path-fragment trigger phrases, missing decisions, wrong contextType — before those problems become permanent in the index. Think of it as a proof-reader who checks the printed form against the original application to make sure nothing was lost in transcription.

---

## 2. CURRENT REALITY

The post-save quality review runs as Step 10.5 in the save workflow, between file write and indexing. It is always active.

Current detection checks:

1. **Generic title** — The saved `title` frontmatter field matches a known generic pattern (e.g., derived from a file path fragment or is a placeholder) rather than reflecting the caller's `sessionSummary`.
2. **Path-fragment trigger phrases** — One or more entries in `trigger_phrases` frontmatter are file system path fragments rather than natural-language phrases.
3. **importance_tier mismatch** — The saved `importance_tier` differs from the value in the JSON payload, indicating that a heuristic override silently replaced the caller's explicit choice.
4. **decision_count = 0** — The saved frontmatter records zero decisions when the JSON payload contained `keyDecisions` entries, indicating a propagation failure.
5. **contextType mismatch** — The saved `context_type` frontmatter field does not match the `contextType` value from the JSON payload.
6. **Generic description** — The saved `description` frontmatter field is a short generic fallback rather than a meaningful summary derived from the session content.

Each finding is emitted with a severity level:

- **HIGH** — Title and `trigger_phrases` propagation failures that would materially mislabel the saved memory.
- **MEDIUM** — `importance_tier` mismatch or `decision_count = 0` when the payload carried `keyDecisions`.
- **LOW** — Advisory `context_type` or `description` degradation that does not block the save path.

The review output is machine-readable so callers and downstream quality monitors can surface actionable per-field failures without parsing prose.

---

## 3. FEATURE BREAKDOWN

### 3.1 Placement in the save workflow

- Runs after `writeMemoryFile()` confirms the file exists on disk.
- Runs before `indexMemoryFile()` embeds and persists the entry.
- Failure findings are reported back to the caller in the save response. The save always proceeds to indexing — findings are advisory, not blocking.

### 3.2 Severity model

- **HIGH**: Title or `trigger_phrases` drift that materially misstates the saved memory.
- **MEDIUM**: `importance_tier` or `decision_count` drift that should be fixed before trusting indexing quality.
- **LOW**: `context_type` or `description` drift that is worth tightening but is not treated as a blocking propagation failure.

### 3.3 Activation

- The review always runs after a successful file write.
- The original JSON payload is the authoritative source for all comparisons.

### 3.4 Cross-references

- Complements the **pre-storage quality gate** (entry `05-pre-storage-quality-gate.md`) which validates structure and semantic deduplication before write. The post-save review validates propagation fidelity after write.
- Complements the **verify-fix-verify memory quality loop** (entry `01-verify-fix-verify-memory-quality-loop.md`) which handles iterative quality improvement. The post-save review is a single-pass snapshot check, not an iterative loop.
- The RC1–RC5 propagation fixes documented in `16--tooling-and-scripts/16-json-mode-hybrid-enrichment.md` address the root causes that this review detects.

### 3.5 Score penalty computation (Phase 002)

- `computeReviewScorePenalty()` computes a numeric `quality_score` adjustment from review findings.
- Penalty per severity: HIGH=-0.10, MEDIUM=-0.05, LOW=-0.02, capped at -0.30 total.
- Advisory logging — the penalty is logged to stdout but does NOT modify the saved file.
- This preserves content-hash-based duplicate detection at the file-write level.

---

## 4. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `scripts/core/post-save-review.ts` | Script | Post-save review logic: frontmatter comparison, severity classification, machine-readable output, `computeReviewScorePenalty()` export |
| `scripts/core/workflow.ts` | Script | Invokes post-save review at Step 10.5, passes original JSON payload and saved file path |
| `scripts/memory/generate-context.ts` | Script | CLI entrypoint; delegates save workflow to `workflow.ts` |
| `scripts/utils/input-normalizer.ts` | Script | Normalizes JSON payload fields before comparison (snake_case/camelCase parity) |

### Tests

| File | Focus |
|------|-------|
| `scripts/tests/post-save-review.vitest.ts` | Severity classification, detection checks, machine-readable output shape, score-penalty computation |
| `scripts/tests/workflow-e2e.vitest.ts` | End-to-end coverage of Step 10.5 placement within the save workflow |

---

## 5. SOURCE METADATA

- Group: Memory quality and indexing
- Source feature title: Post-save quality review
- Current reality source: spec 009-perfect-session-capturing / RC1-RC5 propagation fixes in `scripts/core/post-save-review.ts`
