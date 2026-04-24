---
title: "Implementation Summary: Sanitize Key Files in Graph Metadata"
description: "This phase put a real guardrail in front of derived.keyfiles."
trigger_phrases:
  - "sanitize key files"
  - "graph metadata validation"
  - "sanitize key files in graph metadata"
  - "sanitize key files implementation summary"
  - "system spec kit"
importance_tier: "normal"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/002-sanitize-key-files"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled frontmatter (repo-wide gap fill)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["implementation-summary.md"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
---
title: "...ng-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/002-sanitize-key-files/implementation-summary]"
description: "This phase tightened graph metadata key-file extraction so noisy command strings and other non-path tokens stop crowding out real packet files."
trigger_phrases:
  - "phase 002 implementation summary"
  - "sanitize key files summary"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/002-sanitize-key-files"
    last_updated_at: "2026-04-13T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented the frozen key-file predicate and added focused predicate coverage"
    next_safe_action: "Run repo-wide backfill and confirm the sanitized key_files surface still keeps canonical packet docs"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:019-phase-002-sanitize-key-files"
      session_id: "019-phase-002-sanitize-key-files"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Should canonical packet docs be appended after filtering so they always survive"
status: complete
---
# Implementation Summary: Sanitize Key Files in Graph Metadata

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-sanitize-key-files |
| **Completed** | `2026-04-13` |
| **Level** | `2` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase put a real guardrail in front of `derived.key_files`. The parser now rejects command-like strings, version tokens, MIME-style values, pseudo-fields, relative noise, title-like entries, and bare non-canonical filenames before they ever compete for the `key_files` cap, while still appending canonical packet docs afterward so the packet’s real documents always survive.

### Sanitized key-file predicate

You can now rely on the `key_files` list to behave like a file surface instead of a mixed bag of shell commands and prose scraps. The predicate runs on both the preferred implementation-summary references and the fallback document scan, so junk tokens are filtered before dedupe and truncation rather than after the list has already lost useful paths.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` | Modified | Added the key-file predicate, noise regexes, and pre-merge filtering |
| `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts` | Modified | Added predicate coverage for the frozen wave-3 noise classes |
| `tasks.md` | Modified | Recorded the completed phase work and verification |
| `implementation-summary.md` | Created | Published the phase outcome and verification evidence |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The parser already had a clean place to stage the fix, so the work focused on adding the predicate near the extractor and applying it before the `referenced` and `fallbackRefs` merge. Once the canonical-doc append stayed in place after filtering, focused tests were added around the exact miss classes from the research so the predicate shape was locked before broader corpus verification.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Filter before `normalizeUnique(...).slice(0, 20)` | Junk values should never get a chance to evict real file paths from the capped list |
| Keep canonical packet docs appended after filtering | Packet-local docs are always useful and should survive even when all extracted references are noisy |
| Add the title-like guard alongside the research predicate | The user explicitly called out title-shaped false positives, and this stays consistent with the broader “paths only” goal |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit` | PASS |
| `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/graph-metadata-integration.vitest.ts tests/graph-metadata-schema.vitest.ts` | PASS |
| Key-file predicate coverage | PASS: command, version, MIME-like, `_memory.continuity`, pseudo-field, relative, and bare-noise cases covered |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The repo-wide removal count is verified in the shared backfill step.** This phase summary captures the parser and regression-test evidence, while the corpus-wide shape is confirmed after the final regeneration pass.
<!-- /ANCHOR:limitations -->
