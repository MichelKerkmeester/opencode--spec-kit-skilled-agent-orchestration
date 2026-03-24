# Iteration 002 - JSON Mode Content Thinness (Q2)

- Focus: Q2 field-by-field gap analysis for JSON mode content thinness.
- Status: complete.
- newInfoRatio: 0.72
- noveltyJustification: This iteration turned the existing "messages are sparse" hypothesis into an end-to-end field map showing which JSON inputs are compressed into one synthetic prompt, which remain side-channel metadata, and which never reach the semantic summarizer. [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:224-230] [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:620-689] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:905-941]

## Direct Answer

JSON mode produces thin semantic summaries because the semantic summarizer is fed almost entirely by `allMessages`, and Step 7.5 builds `allMessages` only from `collectedData.userPrompts`. In the common slow-path JSON payload, `normalizeInputData()` collapses scalar inputs into one synthetic `userPrompt` built from `sessionSummary` (or the fallback `"Manual context save"`), while most other fields become observations, side-channel metadata, or template-only data. That leaves `generateImplementationSummary()` with one low-diversity message, so its `task`, `solution`, and `outcomes` logic frequently falls back to generic text such as `"Development session"`, `"Implementation and updates"`, and `"Session completed"`. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:571-689] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:905-941] [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts:474-607]

## End-to-End Trace

1. `generate-context.ts` accepts structured JSON via `--json`, `--stdin`, or a JSON file, parses it as an object, resolves `specFolder`, and passes the payload into `runWorkflow()` as `collectedData`. There is no separate JSON enrichment stage before workflow execution. [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:314-371] [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:377-416] [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:530-550]
2. `normalizeInputData()` has two branches:
   - Fast path: if `userPrompts`/`observations`/`recentContext` already exist, it preserves them and only backfills missing structures.
   - Slow path: if the payload is the documented scalar JSON shape, it synthesizes `observations`, exactly one `userPrompt`, and exactly one `recentContext` entry from `sessionSummary`. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:444-568] [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:571-689]
3. The slow path is lossy in two important ways:
   - `buildSessionSummaryObservation()` truncates `sessionSummary` to a 100-character title and a 200-character narrative. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:272-287]
   - `normalized.userPrompts` becomes a one-element array whose `prompt` is only `sessionSummary` or `"Manual context save"`. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:657-665]
4. Step 7.5 in `workflow.ts` ignores most normalized structures and reconstructs `allMessages` only from `collectedData.userPrompts`, then sends those filtered prompt strings into `generateImplementationSummary()`. Observations are passed separately, which helps file/decision extraction but does not materially enrich the summarizer's main message corpus. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:905-941]
5. `generateImplementationSummary()` derives `task`, `solution`, and `outcomes` from message classification results. When intent/plan/implementation/result buckets are empty or too weak, it falls back to `"Development session"`, `"Implementation and updates"`, and `"Session completed"`. [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts:474-607]
6. Title generation is somewhat richer than body generation because workflow seeds title selection from raw JSON `sessionSummary`, `QUICK_SUMMARY`, `TITLE`, and `SUMMARY`, then builds a slug and finally truncates to 110 characters. This can improve titles, but it does not repair thin semantic body content. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:886-899] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1000-1004] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1000-1027] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/title-builder.ts:23-58]

## Typical JSON Payload to Normalized Form

The documented JSON mode accepts a broad scalar/object payload shape including `sessionSummary`, `filesModified`, `keyDecisions`, `nextSteps`, `technicalContext`, `triggerPhrases`, `toolCalls`, and `exchanges`. Those are all valid raw input fields. [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:84-117] [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:705-719]

For a typical payload shaped like:

```json
{
  "specFolder": "...",
  "sessionSummary": "...",
  "filesModified": ["a.ts - changed parsing"],
  "keyDecisions": ["Chose X because Y"],
  "nextSteps": ["Add tests"],
  "technicalContext": {"stack":"ts"},
  "triggerPhrases": ["json mode", "semantic summary"],
  "toolCalls": [{"tool":"Read"}],
  "exchanges": [{"userInput":"...", "assistantResponse":"..."}]
}
```

the slow-path normalized output is effectively:

```text
userPrompts: 1 synthetic entry from sessionSummary
recentContext: 1 synthetic entry from sessionSummary
observations: sessionSummary + decisions + technicalContext + nextSteps
FILES: converted from filesModified
_manualTriggerPhrases: copied side-channel list
toolCalls/exchanges: retained raw, not promoted to messages
```

That transformation is lossy because multiple semantically distinct fields are not promoted into the message stream that the summarizer actually reads. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:581-689] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:905-941]

## Gap Analysis Table

| JSON input field | Normalized form | Primary pipeline consumer | Output quality / enrichment gap |
| --- | --- | --- | --- |
| `sessionSummary` / `session_summary` | Slow path: one `feature` observation, one synthetic `userPrompt`, one synthetic `recentContext`; fast path: left as-is if richer arrays already exist. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:622-665] | Step 7.5 reads it through `userPrompts`; collect-session-data also passes raw `sessionSummary` into title candidates as `_JSON_SESSION_SUMMARY`. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:908-915] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1000-1004] | Medium quality but lossy: many sessions are compressed to one message, and the observation copy is truncated to 200 chars. This is the main root cause of thin summaries. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:272-287] |
| `filesModified` / `files_modified` | Converted into `FILES[]` with synthetic `DESCRIPTION` and `ACTION: Modified`. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:476-513] [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:581-618] | Used for file sections and semantic file enhancement, not for message generation. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:943-949] | Low for content depth: it can improve file listings, but it does not enrich `task` or `solution`. Opportunity: turn file entries into implementation/result messages. |
| `keyDecisions` / `key_decisions` | Converted into decision observations and `_manualDecisions`. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:545-563] [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:630-639] [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:671-672] | Decision extractors and the summarizer's decision section. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:938-940] [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts:478-480] | Medium: decisions survive reasonably well, but they do not materially enrich intent/plan/result buckets unless re-expressed as messages. |
| `nextSteps` / `next_steps` | Converted into one `followup` observation with narrative plus `Next:` facts. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:343-358] [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:517-519] [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:650-651] | Status/blocker heuristics and observation rendering, not Step 7.5 message construction. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:408-420] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:908-915] | Medium-low: it preserves follow-up intent, but the summarizer cannot reuse it for `outcomes` or plan text. Strong enrichment candidate for result/plan messages. |
| `technicalContext` | Converted into an `implementation` observation and structured `TECHNICAL_CONTEXT`. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:295-318] [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:527-528] [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:644-648] | Template technical-context section and session characterization. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:855-876] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1007-1009] | Medium-low: useful metadata survives, but it never becomes implementation messages for the semantic summarizer. Good enrichment candidate for `solution` text. |
| `triggerPhrases` / `trigger_phrases` | Copied into `_manualTriggerPhrases`; also attached as `facts` on the session summary observation. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:460-464] [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:520-521] [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:667-668] | Memory indexer and post-save review, not semantic summarization. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1068-1069] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:251-280] | Low for body content: helps retrieval, not summary richness. |
| `userPrompts` / `user_prompts` | Preserved as-is on fast path. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:450-454] [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:467-568] | This is the only direct source for `allMessages` in Step 7.5. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:908-915] | High quality when callers provide multiple rich prompts. This is the clearest existing escape hatch from thin summaries. |
| `observations` | Preserved or synthesized; deduped by narrative. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:321-340] [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:466-568] [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:620-655] | Helps file/decision extraction and session snapshots. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:938-946] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:901-905] | Partial: observations help secondary extractors, but they are not merged into `allMessages`, so most semantic text generation does not benefit. |
| `recentContext` / `recent_context` | Preserved as-is on fast path; slow path synthesizes one entry from `sessionSummary`. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:455-459] [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:662-665] | Used to build `sessionInfo`, `QUICK_SUMMARY`, and overview text. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:886-899] | Medium for overview/title selection, low for semantic summary. It enriches titles more than body text. |
| `toolCalls` | Accepted raw input field and retained on payload; not normalized into `userPrompts` or observations. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:705-719] | Used for activity counting and compact template rendering only. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:402-417] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1213-1221] | High missed opportunity: tool traces contain implementation evidence, but current JSON mode does not promote them into semantic messages. |
| `exchanges` | Accepted raw input field and retained on payload; not normalized into `userPrompts` or observations. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:705-719] | Used for activity counts and compact template rendering only. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:405-417] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1222-1233] | Highest missed opportunity: these already contain user/assistant dialogue, but Step 7.5 ignores them completely. Best enrichment target for intent/plan/result message reconstruction. |
| `FILES` | Preserved and normalized on fast path or used directly on slow path. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:472-475] [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:587-589] | File listings and downstream file extractors. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:943-949] | Low for narrative richness unless converted into implementation/result messages. |
| `importanceTier`, `contextType`, `projectPhase` | Passed through as metadata. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:530-543] [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:675-689] | Session characterization, expiry, frontmatter, and phase inference. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:844-876] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1015-1018] | Useful classification metadata, but no effect on semantic content depth. |
| `specFolder` / `SPEC_FOLDER` | Passed through to normalized `SPEC_FOLDER`. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:523-525] [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:577-579] | Spec affinity, title fallback, and topic extraction. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1000-1027] | Structural only; not relevant for content enrichment except indirectly through title/key-topic generation. |

## Best Enrichment Candidates

1. `exchanges`: They already contain user intent and assistant result text, so they can be converted directly into multi-message semantic input with minimal inference. [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:94-117] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1222-1233]
2. `toolCalls`: They carry concrete implementation evidence and should be promotable into implementation/result messages. [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:90-117] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1213-1221]
3. `nextSteps` and `technicalContext`: These are already structured and should seed plan/implementation message classes instead of remaining observation-only. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:295-318] [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:343-358]
4. `filesModified` / `FILES`: These can support richer implementation/result summaries if translated into textual change messages rather than file-list-only metadata. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:476-513] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:943-949]

## Key Conclusions

- The root problem is not that JSON mode lacks input fields; it is that the workflow's semantic-summary stage consumes only one narrow channel: `userPrompts`. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:908-915]
- The common scalar JSON payload is transformed into one prompt plus several observations, which is materially lossy for semantic summary generation. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:620-689]
- Titles can be somewhat richer than body summaries because they also consider raw `sessionSummary` and quick-summary candidates before 110-character truncation, but truncation is a secondary issue rather than the primary cause of thin content. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1000-1027] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/title-builder.ts:23-58]
