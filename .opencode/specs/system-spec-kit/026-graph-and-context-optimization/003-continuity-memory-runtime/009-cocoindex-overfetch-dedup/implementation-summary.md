---
# SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2
title: "Implementation Summary: CocoIndex over-fetch + dedup [system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/009-cocoindex-overfetch-dedup/implementation-summary]"
description: "Placeholder until cli-codex implementation lands."
trigger_phrases:
  - "cocoindex dedup summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/009-cocoindex-overfetch-dedup"
    last_updated_at: "2026-04-27T10:15:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Located CocoIndex source in pipx; deferred to Phase D pending vendor-vs-fork decision"
    next_safe_action: "Phase D — apply settings.yml exclude rule standalone OR initiate vendor-vs-fork decision"
    blockers:
      - "CocoIndex source is in pipx site-packages outside repo — vendor-vs-fork decision required from user"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    completion_pct: 30
    open_questions:
      - "Vendor or fork CocoIndex source? Vendor=copy .py files into repo. Fork=patch upstream + reinstall via pipx."
    answered_questions:
      - "Where is CocoIndex source? Answer: ~/.local/pipx/venvs/cocoindex-code/lib/python3.11/site-packages/cocoindex_code"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-cocoindex-overfetch-dedup |
| **Completed** | PENDING |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

DEFERRED to Phase D. The packet remains scaffolded with full spec/plan/tasks ready for execution. Implementation is deferred because the CocoIndex source-of-truth lives outside the repo:

```text
$ python3 -c "import cocoindex_code; print(cocoindex_code.__file__)"
ModuleNotFoundError: No module named 'cocoindex_code'

$ find ~/.local -name "cocoindex_code" -type d
/Users/michelkerkmeester/.local/pipx/venvs/cocoindex-code/lib/python3.11/site-packages/cocoindex_code
```

CocoIndex is installed as a pipx-managed package (`cocoindex-code v0.2.3`). The 007 research (§12 Open Questions, §6 Runtime Limitations) anticipated this case and recommended that implementation locate the source-of-truth and decide vendor-vs-fork strategy with the user before patching. Phase C does NOT do that decision for the user; the safe, autonomous next step is to defer this packet and surface the decision in the orchestrator summary.

### Recommended Phase D Strategy
1. Decide vendor-vs-fork: (a) vendor `cocoindex_code/*.py` into the repo at a chosen path and patch in-place, OR (b) fork the upstream `cocoindex-code` package, patch the fork, install the fork via pipx.
2. If vendoring: copy `~/.local/pipx/venvs/cocoindex-code/lib/python3.11/site-packages/cocoindex_code/{indexer.py,query.py,project.py,server.py}` to a chosen repo path; update CocoIndex bootstrap to import from the vendor path.
3. Apply the patches per 009 spec.md REQ-001..006.
4. Reindex via `ccc reindex`.
5. Run live probes per 009 tasks.md Phase 3.

### Settings.yml Mitigation (low-risk partial fix)
Even without the source-of-truth decision, the user can apply the settings exclude rule alone. This single change recovers ~80% of REQ-018 dedup benefit without touching the indexer or query layer:

```yaml
# .cocoindex_code/settings.yml — add to exclude list
exclude:
  - ".gemini/specs/**"
  - ".codex/specs/**"
  - ".claude/specs/**"
  - ".agents/specs/**"
```

After settings change, run `ccc reindex` to drop the alias chunks. This is a 1-line config change with no Python source modification needed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.cocoindex_code/settings.yml` | DEFERRED | Settings-only mitigation possible standalone |
| `cocoindex_code/indexer.py` (in pipx site-packages) | DEFERRED | Requires vendor-vs-fork decision |
| `cocoindex_code/query.py` (in pipx site-packages) | DEFERRED | Requires vendor-vs-fork decision |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

NOT delivered in this session. CocoIndex source-of-truth is in pipx site-packages, not in the repo. Per 007 §12 open question and §6 mutation cost (HIGH for canonical-identity changes), this packet defers to Phase D where the user can decide vendor-vs-fork strategy.

The settings.yml exclude rule (Phase 2 partial mitigation above) can land standalone without source modification and recovers most of the REQ-018 dedup benefit.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Layered fix (settings → indexer → query) | Settings alone covers 80%; indexer + query handles the long tail. |
| Bounded boost/penalty (+0.05 / -0.05) | Avoid flipping rankings entirely; preserve raw score signal. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result | Evidence |
|-------|--------|----------|
| Source location identified | PASS | pipx site-packages at `~/.local/pipx/venvs/cocoindex-code/lib/python3.11/site-packages/cocoindex_code` |
| Vendor-vs-fork decision | DEFERRED to Phase D | Requires user input |
| Reindex | DEFERRED | `ccc reindex` after schema change |
| pytest | DEFERRED | `cd cocoindex_code && pytest tests/` (if test suite exists) |
| ccc search REQ-018 repro | DEFERRED | `ccc search "semantic search vector embedding implementation" --limit 10` — assert ≤ 1 unique chunk per logical location |
| ccc search REQ-019 repro | DEFERRED | `ccc search "code graph traversal callers query" --limit 10` — assert implementation source in top 3 |
| Settings-only partial mitigation | AVAILABLE | 1-line edit to `.cocoindex_code/settings.yml` covers ~80% of REQ-018 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **DEFERRED to Phase D.** CocoIndex source is in pipx site-packages outside the repo. Patching requires vendor-vs-fork decision the user owns. See "How It Was Delivered" above.
2. **Settings-only mitigation is independently valid.** The user can apply the `.cocoindex_code/settings.yml` exclude rule today without source changes; that alone recovers ~80% of REQ-018 dedup benefit. The remaining 20% (REQ-019 path-class reranking, REQ-002 source_realpath canonical identity) requires the source-of-truth decision.
3. **Reindex required after any change.** Schema migration means a full `ccc reindex` is needed before any query-side dedup or rerank takes effect.
<!-- /ANCHOR:limitations -->
