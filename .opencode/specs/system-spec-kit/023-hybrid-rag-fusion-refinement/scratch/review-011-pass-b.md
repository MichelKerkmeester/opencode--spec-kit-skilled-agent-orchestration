## Review: Phase 011 — Pass B (Quality & Format)

### Verdict: NEEDS_REVISION

### Format Compliance
| Check | Result | Notes |
|---|---|---|
| Expanded format | Fail | It uses `Problem`/`Fix` paragraphs, but it does not fully match the expanded template. The template requires a `## Test Impact` section with a Before/After metrics table and a structured technical details block split into Source, Tests, and Documentation. The changelog uses `## Verification` instead and a single combined Files Changed table. |
| Version header | Pass | Starts with `## [v0.11.0] - 2026-04-01`, which matches the required header style. |
| No H1/banner | Pass | There is no H1 title and no `Part of OpenCode` banner line. |
| Spec folder path | Pass | The spec folder path is included in the body and in the `> Spec folder:` line. |
| Plain categories | Pass | `Search` is a plain, reader-friendly category name and matches the recommended vocabulary. |

### Writing Style
| Check | Result | Notes |
|---|---|---|
| Non-developer voice | Pass | The draft generally explains the release in plain English and uses helpful analogies. |
| Active/direct voice | Pass | The summary leads with the user-facing problem and the sections are written in a direct, confident voice. |
| Jargon explained | Fail | Some terms are still too insider-facing or unexplained on first use, especially `CocoIndex Code`, `Code Graph`, `MCP`, and `FTS5`. BM25 and RRF are explained well, but the same standard is not applied consistently. |
| Problem/Fix structure | Fail | The structure exists, but several `Fix` paragraphs drift into implementation detail such as exact environment variable names, internal mechanisms, and rebuild counts. Those details belong in the Files Changed or verification sections, not the reader-facing explanation. |

### Issues Found
- The expanded-template `## Test Impact` section is missing and has been replaced with `## Verification`. Use the template's Before/After metric table and add the one-sentence test coverage note.
- The technical details block does not follow the template layout. It should be split into `### Source`, `### Tests`, and `### Documentation` inside the `<details>` section.
- The summary and several `Fix` paragraphs include implementation detail that should move to the technical details table, including exact config keys, rebuild counts, and low-level behavior descriptions.
- Some first-use jargon is still unexplained. Replace or define terms like `CocoIndex Code`, `Code Graph`, `MCP`, and `FTS5` for a smart non-developer reader.
- The release is strongest when it explains behavior change and trust impact. A few passages still read like engineering notes rather than release notes.

### Summary
This changelog is close on voice and overall structure, but it does not fully comply with the expanded template yet. Tightening the format to match the required sections and moving technical specifics out of the `Problem` and `Fix` prose should make it ready.
