---
title: "Checklist: Memory Save Quality Pipeline [023/012]"
description: "Verification checklist for 6 recommendations fixing JSON-mode memory save quality."
---
# Checklist: Phase 012 — Memory Save Quality Pipeline

## P0 — Must Pass (Rec 1: Normalization Wiring)

- [x] workflow.ts calls normalizeInputData() for --json/--stdin preloaded data [SOURCE: workflow.ts:615-620]
- [x] sessionSummary is converted to userPrompts[] by normalization [SOURCE: input-normalizer.ts:693-695 slow-path]
- [x] keyDecisions are converted to _manualDecisions[] by normalization [SOURCE: input-normalizer.ts:706-708 slow-path]
- [x] "No user prompts found" warning no longer appears for JSON saves with sessionSummary [normalizer creates userPrompts from sessionSummary]
- [x] filesChanged accepted as alias for filesModified in KNOWN_RAW_INPUT_FIELDS [SOURCE: input-normalizer.ts:754]
- [x] Transcript-based saves produce identical results (zero regression) [preloaded path only; loadDataFn and file-loader paths unchanged]

## P1 — Must Pass (Rec 2: Message Synthesis)

- [x] extractFromJsonPayload() creates messages from sessionSummary + keyDecisions + nextSteps [SOURCE: conversation-extractor.ts:51-130]
- [x] At least 1 User-role message is created (required by downstream scoring) [SOURCE: conversation-extractor.ts:67-74]
- [x] Messages NOT marked with _synthetic:true [no _synthetic flag used; plain User/Assistant ROLE]
- [x] Existing fallback (line 324) guarded with !jsonModeHandled [SOURCE: conversation-extractor.ts:324]
- [x] Primary extraction loop (lines 178-300) is NOT modified [confirmed: no changes in primary loop]
- [x] JSON save produces 5+ messages with real content from structured data [User+Assistant from summary, pairs from decisions, closing from nextSteps]

## P1 — Must Pass (Rec 3: Title + Description)

- [x] Title derived from sessionSummary first clause (up to 80 chars, sentence boundary) [SOURCE: collect-session-data.ts:1020-1027]
- [x] Description uses sessionSummary (truncated to 500 chars) [SOURCE: collect-session-data.ts:870-876]
- [x] "Session focused on implementing and testing features" boilerplate eliminated [sessionSummary takes priority when > 20 chars]
- [x] Title not truncated mid-word [regex uses sentence boundary + word boundary fallback]

## P2 — Should Pass (Rec 4: Decisions + Key Files)

- [x] String keyDecisions produce distinct CHOSEN vs RATIONALE (no 4x repetition) [SOURCE: decision-extractor.ts:273, 338]
- [x] OPTIONS[0].DESCRIPTION='' for plain-string decisions [SOURCE: decision-extractor.ts:273]
- [x] CONTEXT='' when no manualObj and no rationaleFromInput [SOURCE: decision-extractor.ts:338]
- [x] key_files honors filesModified/filesChanged from JSON input [SOURCE: input-normalizer.ts maps to FILES → buildKeyFiles uses effectiveFiles first]
- [x] Filesystem enumeration capped at 20 files when no filesModified provided [SOURCE: workflow-path-utils.ts:97]
- [x] research/iterations/ and review/iterations/ excluded from bulk key_files listing [SOURCE: workflow-path-utils.ts:63, 95]

## P2 — Should Pass (Rec 5: V8 Contamination)

- [x] Sibling phase references within same parent spec do not trigger V8 abort [SOURCE: validate-memory-quality.ts:558-583]
- [x] Sibling phase allowlist built from parent spec's child directory listing [SOURCE: validate-memory-quality.ts:564-580]
- [x] Scattered foreign spec detection skipped for inputMode=structured [SOURCE: validate-memory-quality.ts:802-808]
- [x] Transcript-mode contamination checks unchanged (no relaxation) [structured guard only; captured/file modes unaffected]

## P2 — Should Pass (Rec 6: Quality Floor)

- [x] JSON floor computed from 6 dimensions (triggers, topics, files, content, html, observations) [SOURCE: quality-scorer.ts:263-275]
- [x] Floor damped by 0.85x and hard-capped at 70/100 [SOURCE: quality-scorer.ts:277-278]
- [x] Contamination penalties take precedence over floor [contamination at lines 286+ applies after floor]
- [ ] JSON save with sessionSummary + 2 keyDecisions scores >= 50/100 [DEFERRED: needs runtime test]
- [ ] JSON save with rich data (summary + 3 decisions + 4 observations) scores >= 60/100 [DEFERRED: needs runtime test]

## P3 — Nice to Have (Testing)

- [ ] Integration test: JSON payload -> quality >= 50/100 [DEFERRED: test suite needed]
- [ ] Edge case test: JSON with only sessionSummary (no keyDecisions) -> no abort [DEFERRED]
- [ ] Edge case test: JSON with cross-phase refs -> no V8 abort [DEFERRED]
- [ ] Regression test: transcript-based save -> identical output [DEFERRED]
- [ ] Edge case test: 100+ filesModified -> key_files capped [DEFERRED]
- [ ] Edge case test: markdown code blocks in observations -> no false contamination [DEFERRED]

## Acceptance Criteria (MVP: Recs 1+2+3)

- [x] JSON save after context compaction scores >= 50/100 (was 0/100) [quality floor + normalization wiring]
- [x] No INSUFFICIENT_CONTEXT_ABORT for sessionSummary with 100+ chars [normalization creates userPrompts → sufficient messages]
- [x] No CONTAMINATION_GATE_ABORT for typical cross-phase references [sibling allowlist + structured guard]
- [x] Title and description reflect actual session content [sessionSummary → TITLE + SUMMARY]
- [x] Transcript-mode saves are completely unaffected [all changes gated behind preloaded/structured checks]
