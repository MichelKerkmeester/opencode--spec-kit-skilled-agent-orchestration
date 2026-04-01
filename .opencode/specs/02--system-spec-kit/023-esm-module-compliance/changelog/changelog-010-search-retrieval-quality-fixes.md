## [v0.10.0] - 2026-04-01

This release makes search answers easier to trust when the system has to guess the right work area, recover from an overly narrow first pass, or fit many matches into a limited response. It covers six search improvements, adds verification work that confirmed the server restarted cleanly and the core tools still responded, and records the phase documentation needed to close the work with evidence.

> Spec folder: `.opencode/specs/02--system-spec-kit/023-esm-module-compliance/010-search-retrieval-quality-fixes/` (Level 2)

---

## Search (6)

These changes focus on making search more dependable when the system guesses intent, narrows to a likely folder, or has to shorten a crowded response.

### Search now keeps the original goal through deeper lookups

**Problem:** Some searches began with the right intent (the system's guess about what kind of help a question needs) but lost that context during deeper lookups or resume searches (follow-up searches used when returning to earlier work). When that happened, the system could treat a specific question as if it were more general, which made the result order less helpful.

**Fix:** Search now keeps the same goal from the start of the request through the later passes that gather and order results. Users get answers that stay aligned with the kind of help they asked for, even when the system takes a longer route to find them.

### Search now recovers when a likely folder guess is too narrow

**Problem:** Folder discovery (the step that guesses which work folder is most relevant) could point search at the wrong place and then stop there. That was like checking one drawer in a filing cabinet and assuming the document did not exist anywhere else. Useful matches outside that guessed folder could disappear even when a broader search would have found them.

**Fix:** When the first narrowed search comes back empty, the system now widens the search and tries again instead of giving up. A wrong folder guess is treated as a clue that needs a second look, not as a dead end.

### Large matches are shortened before they are dropped

**Problem:** Token budget (the response size limit) could remove full results too early when one or two matches were unusually long. Users lost whole matches even when a shorter version would have been enough to show why those results mattered.

**Fix:** Search now shortens oversized passages before it starts hiding results completely. That keeps more useful matches visible in the same reply and makes crowded searches feel less abrupt.

### Folder hints now guide result order without blocking nearby matches

**Problem:** A likely folder is helpful, but it is not always the whole answer. When search treated that hint too strongly, relevant matches from nearby folders could be pushed aside even when they still fit the question well.

**Fix:** The likely folder now helps guide result order instead of acting like a locked gate. The system still gives that folder an initial look so it can detect when the first guess was too narrow, but strong matches from elsewhere can still stay in view.

### Search now keeps short result listings when full text will not fit

**Problem:** Once a response filled up, lower-ranked matches could vanish completely. That made it look as if only a few items matched, when the real limit was only how much full text could fit in one reply.

**Fix:** When space runs short, search now keeps short result listings (result names and locations without the full text) for additional matches. Users can still see that more relevant material exists and where it came from, even when the full passages cannot fit.

### Low-confidence guesses now fall back to the safer general path

**Problem:** Automatic intent detection can be uncertain on short or ambiguous questions. When search acted on a weak guess anyway, it could send the request down a path that sounded precise but was actually a poor fit.

**Fix:** Search now falls back to a safer general path when the automatic guess is too weak to trust. Direct instructions still win, so an explicitly requested search mode keeps full control.

---

## Testing (2)

This phase also verified that the updated behavior worked after restart and did not break the surrounding tool surface.

### Server restart checks confirmed the tools still respond

**Problem:** Search improvements are not enough on their own if the MCP server (the background service that exposes memory tools) fails to start cleanly or stops responding after the update. A fix that only works during development still creates risk for users.

**Fix:** The updated server was restarted and the core memory tools were checked again. That confirmed the release still responds to real requests after restart, not just to isolated development checks.

### Regression checks confirmed the main memory tools still work

**Problem:** Changes in one part of search can accidentally damage nearby tools, especially the ones people use to inspect memories, list results, or check system health. Without follow-up checks, a focused fix can quietly create a broader support problem.

**Fix:** This phase rechecked the main search and memory tools and confirmed they still return healthy results. Users get better confidence that the improvements helped the targeted paths without breaking the everyday tool surface.

---

## Documentation (1)

### Phase records now show the finished verification state

**Problem:** A change set is harder to trust when the supporting records stop at implementation notes and do not show that the verification work was completed. That leaves future readers to reconstruct whether the final checks actually happened.

**Fix:** The phase records now capture the completed verification state, including the checked items that show the release is ready. That makes the work easier to audit and easier to hand off later.

---

## Test Impact

| Metric | Before | After |
| ------ | ------ | ----- |
| Core MCP tools verified after restart | 0 | 4 |
| Regression checks confirmed passing | 0 | 4 |
| Checklist items marked complete with evidence | 0 | 14 |
| TypeScript new errors introduced | 0 | 0 |

Phase verification confirmed that four core memory tools were still passing after restart, with no new TypeScript errors introduced.

---

<details>
<summary>Technical Details: Files Changed (6 total)</summary>

### Source (2 files)

| File | Changes |
| ---- | ------- |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts` | Forwarded explicit intent into deep and resume flows, added zero-result recovery after folder discovery, updated token-budget enforcement to truncate content before dropping results, preserved initial discovered-folder seeding for over-narrow-search recovery, and appended metadata-only fallback entries after budget drops. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts` | Accepted `folderBoost` as a ranking hint, applied the discovered-folder similarity boost after pipeline execution, and added the low-confidence intent fallback to the safer general path. |

### Tests (0 files)

No dedicated test files were added in this phase. Verification used MCP server restart checks, live tool calls, and regression checks against the existing memory tool surface.

### Documentation (4 files)

| File | Changes |
| ---- | ------- |
| `.opencode/specs/02--system-spec-kit/023-esm-module-compliance/010-search-retrieval-quality-fixes/tasks.md` | Recorded completion of implementation, restart verification, regression checks, and documentation tasks. |
| `.opencode/specs/02--system-spec-kit/023-esm-module-compliance/010-search-retrieval-quality-fixes/checklist.md` | Marked all 14 verification items complete with evidence, including restart checks and core tool verification. |
| `.opencode/specs/02--system-spec-kit/023-esm-module-compliance/010-search-retrieval-quality-fixes/implementation-summary.md` | Captured the six fixes, verification evidence, passing tool checks, and TypeScript status for the phase. |
| `.opencode/specs/02--system-spec-kit/023-esm-module-compliance/scratch/changelog-010-search-retrieval-quality-fixes.md` | Rewrote the changelog in expanded format with plain-language release notes and a complete technical appendix. |

</details>

---

## Upgrade

No migration required.

Existing users do not need to change their setup. Search now recovers more gracefully from narrow first guesses and keeps more visible context when results are crowded.
