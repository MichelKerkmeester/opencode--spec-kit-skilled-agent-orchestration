## [v0.12.0] - 2026-04-01

Memories saved through the automated pipeline now contain useful context instead of empty templates. This phase focused on structured save requests (save inputs submitted as organized fields instead of a full chat transcript), with six behavior fixes across nine source files so JSON-based saves (saves submitted as structured data) keep clear summaries, decisions, file references, and fair quality scores while the normal transcript-based path stays unchanged.

> Spec folder: `.opencode/specs/02--system-spec-kit/023-esm-module-compliance/012-memory-save-quality-pipeline` (Level 3)

---

## Saving Memories (4)

These changes repair the part of the save pipeline that was dropping useful context before it could be turned into a readable memory.

### Structured save requests now keep the details they were given

**Problem:** Structured save requests arrived with the right information, but not in the shape the rest of the save pipeline expected. That caused later stages to treat real summaries, decisions, and changed files as if they were missing, so the final memory read like a blank template instead of a record of real work.

**Fix:** The system now converts structured save requests into the format the pipeline expects before extraction begins. As a result, structured saves now carry forward the important session details that transcript-based saves already preserved.

### JSON-only saves can now tell a readable story

**Problem:** Many JSON-based saves do not include a transcript (the back-and-forth conversation between a user and an assistant). Without that conversation shape, the memory generator had very little material to explain what happened, so it produced thin placeholder text instead of a useful narrative.

**Fix:** The system now builds a simple conversation from the structured fields when no transcript is present. That gives JSON-only saves enough context to explain what work happened and why, instead of falling back to an empty shell.

### Titles and summaries now reflect the actual work

**Problem:** Even when a save request included a strong session summary, the final memory often used a generic title and description. That made different saves look interchangeable and forced readers to search through the body to understand what the session was actually about.

**Fix:** Saved memories now use the session's own summary to produce specific titles and opening descriptions. Readers can tell what changed and why from the top of the memory instead of decoding boilerplate text.

### Decision and file lists are easier to trust

**Problem:** Decision lists could repeat the same point several times, and file lists could grow noisy enough to bury the most important references. That made saved memories feel less reliable and harder to scan during later review.

**Fix:** Saved memories now remove repeated decisions and keep file references focused on the most relevant work. The result is a cleaner summary that is easier to review and more useful as future context.

---

## Bug Fixes (2)

These changes fix quality checks that were unfairly dragging down good structured saves.

### Related phase references no longer look like contamination

**Problem:** Structured saves often mention nearby phases from the same workstream. The internal quality checker that prevents cross-contamination (unrelated material leaking in from another documentation area) sometimes treated those valid references as foreign content, which lowered scores even when the memory was accurate and on topic.

**Fix:** The checker now allows valid references to closely related phase work when evaluating structured saves. It still guards against real cross-contamination, but it no longer penalizes memories for mentioning nearby work that belongs in the same story.

### Useful structured saves now receive a fair baseline score

**Problem:** A structured save could show clear value across most quality checks and still end up with a near-zero score. That made good saves look broken, hid real progress, and pushed the pipeline toward generic output.

**Fix:** The scoring system now gives clearly useful structured saves a fair minimum score when they show strong signal across most quality dimensions. This keeps quality reports aligned with what a reader would actually see: a useful memory should no longer be scored like an empty one.

---

## Test Impact

| Metric | Before | After |
| ------ | ------ | ----- |
| Structured save quality | `0/100` | `55-75/100` |
| TypeScript errors | `0` | `0` |
| Phase sub-tasks complete | `0/22` | `22/22` |

Verification focused on restoring useful structured-save output and keeping the codebase at zero TypeScript errors. No new automated test files were added in this phase.

---

<details>
<summary>Technical Details: Files Changed (9 total)</summary>

### Source (9 files)

| File | Changes |
| ---- | ------- |
| `scripts/types/session-types.ts` | Added `filesChanged` support to the structured session payload type. |
| `scripts/utils/input-normalizer.ts` | Normalized `sessionSummary`, `keyDecisions`, and `filesChanged` into the fields expected by the save workflow. |
| `scripts/core/workflow.ts` | Routed preloaded structured data through `normalizeInputData()` before downstream extraction. |
| `scripts/extractors/conversation-extractor.ts` | Added `extractFromJsonPayload()` so JSON-only saves can produce a synthetic conversation when no transcript exists. |
| `scripts/extractors/collect-session-data.ts` | Derived title and summary fields from `sessionSummary` instead of boilerplate text. |
| `scripts/extractors/decision-extractor.ts` | Deduplicated plain-string decisions across repeated output fields. |
| `scripts/core/workflow-path-utils.ts` | Limited `key_files` discovery, filtered research and review iteration folders, and kept file lists focused. |
| `scripts/lib/validate-memory-quality.ts` | Relaxed V8 allowlist behavior for sibling phase references and adjusted structured-input mode contamination checks. |
| `scripts/core/quality-scorer.ts` | Added the structured-save scoring floor, including threshold mechanics and the capped fairness rule. |

### Tests (0 files)

No new test files were listed in the implementation summary for this phase.

### Documentation (0 files)

No documentation files were listed in the implementation summary for this phase.

</details>

---

## Upgrade

No migration required.

Behavior changes to expect:

- JSON-based saves created through `--json` and `--stdin` now preserve specific titles, summaries, decisions, and focused file references instead of boilerplate.
- Structured saves that are clearly useful now receive quality scores that better match the content they contain.
