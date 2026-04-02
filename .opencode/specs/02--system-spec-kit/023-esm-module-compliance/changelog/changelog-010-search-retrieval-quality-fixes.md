## [v0.10.0] - 2026-04-01

This phase implemented six retrieval-quality fixes across the `memory_context` and `memory_search` handlers, then received a structural doc-alignment pass on 2026-04-02. The code changes are in place, but the phase packet still marks fresh restart and cache-sensitive reruns as pending, so this changelog records the shipped implementation work without claiming final rerun closure.

> Spec folder: `.opencode/specs/02--system-spec-kit/023-esm-module-compliance/010-search-retrieval-quality-fixes/` (Level 2)

---

## Search (6)

These changes focused on making search more dependable when the system guesses intent, narrows to a likely folder, or has to shorten a crowded response.

### Search now keeps the original goal through deeper lookups

**Problem:** Some searches began with the right intent but lost that context during deeper or resume-oriented lookups. That made specific questions drift toward a more generic retrieval path.

**Fix:** The handler now forwards explicit intent through the deeper lookup paths so the later passes keep the same goal as the original request.

### Search now recovers when a likely folder guess is too narrow

**Problem:** Folder discovery could point search at the wrong place and stop there. Valid matches outside that first guess could disappear even when a broader retry would have found them.

**Fix:** When a discovered-folder pass comes back empty, the handler now retries without that narrow scope instead of treating the first guess as final.

### Large matches are shortened before they are dropped

**Problem:** Token-budget enforcement could remove whole results too early when one or two matches were unusually long.

**Fix:** The response builder now truncates oversized content before it starts dropping results, which keeps more relevant matches visible in a crowded reply.

### Folder hints now guide ranking without acting as a permanent hard filter

**Problem:** A likely folder can be helpful, but treating it too strongly can hide nearby matches that still fit the question.

**Fix:** The phase keeps folder discovery as a ranking hint and retry signal rather than letting it permanently over-constrain the search.

### Search now keeps metadata-only entries when full content does not fit

**Problem:** Once a response filled up, lower-ranked matches could vanish completely.

**Fix:** The response now keeps compact metadata-only entries for additional matches after full-content slots are exhausted.

### Weak auto-detection now falls back to the safer general path

**Problem:** Auto-detected intent can be too uncertain to trust on short or ambiguous prompts.

**Fix:** The search path now falls back to `understand` when intent confidence is too low, while still honoring explicit caller intent.

---

## Verification State (2)

### Structural packet alignment is complete

**Problem:** The phase docs had drifted away from the required Level 2 template shape and were blocking strict recursive validation.

**Fix:** The phase `plan.md`, `checklist.md`, and `implementation-summary.md` were realigned on 2026-04-02 so the packet records the work in the current template format.

### Fresh runtime reruns are still tracked as follow-up evidence

**Problem:** The implementation landed before the phase packet finished its fresh-restart verification pass.

**Fix:** The changelog now says that plainly. The phase checklist still leaves restart-sensitive runtime checks and final evidence references open instead of pretending they already ran.

---

## Test Impact

| Metric | Before | After |
| ------ | ------ | ----- |
| Retrieval fixes implemented | `0/6` | `6/6` |
| Source files changed | `0` | `3` |
| Structural phase docs aligned to current template | `0/3` | `3/3` |
| Fresh restart and cache-sensitive reruns | `0/5` | `Pending in phase checklist` |

This phase changed three source files and completed the structural spec-doc cleanup. Fresh runtime reruns remain intentionally open in the phase packet.

---

<details>
<summary>Technical Details: Files Changed (7 total)</summary>

### Source (3 files)

| File | Changes |
| ---- | ------- |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts` | Forwarded explicit intent into deeper strategies, added zero-result recovery after folder discovery, improved token-budget truncation, and kept metadata-only fallback entries when content budget is exhausted. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts` | Added the low-confidence intent fallback and applied folder-boost ranking behavior after pipeline execution. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts` | Supported the discovered-folder signal that the handlers now use as a ranking and recovery hint. |

### Tests (0 files)

No dedicated test files were added in this phase. Verification in the packet is currently split between completed structural alignment and pending fresh runtime reruns.

### Documentation (4 files)

| File | Changes |
| ---- | ------- |
| `.opencode/specs/02--system-spec-kit/023-esm-module-compliance/010-search-retrieval-quality-fixes/plan.md` | Preserved the six-fix implementation sequence and current verification-state wording. |
| `.opencode/specs/02--system-spec-kit/023-esm-module-compliance/010-search-retrieval-quality-fixes/checklist.md` | Kept structural items complete while leaving fresh runtime reruns marked pending. |
| `.opencode/specs/02--system-spec-kit/023-esm-module-compliance/010-search-retrieval-quality-fixes/implementation-summary.md` | Synced the phase summary to the actual code scope and current verification state. |
| `.opencode/specs/02--system-spec-kit/023-esm-module-compliance/changelog/changelog-010-search-retrieval-quality-fixes.md` | Updated the release notes to match the implementation and the still-open rerun evidence. |

</details>

---

## Upgrade

No migration required.

Search now keeps intent and fallback behavior more safely through the retrieval path. The phase packet still expects a fresh-restart verification pass before it can claim fully closed rerun evidence.
