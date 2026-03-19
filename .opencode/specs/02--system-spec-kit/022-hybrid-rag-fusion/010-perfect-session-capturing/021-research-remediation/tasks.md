<!-- SPECKIT_TEMPLATE_SOURCE: .opencode/skill/system-spec-kit/templates/tasks.md -->
<!-- anchor:tasks:start -->

# Tasks: Research Remediation — Wave 1

<!-- anchor:task-list:start -->
## Agent 1: Source Integrity (8 items) — ALL DONE (prior sessions)

- [x] 1.1 Session-ID-first transcript resolution — add expectedSessionId parameter (R-11 A0.1) [MEDIUM]
- [x] 1.2 Persist _sourceTranscriptPath, _sourceSessionId, _sourceSessionCreated in frontmatter (R-11 A0.1) [SMALL]
- [x] 1.3 Add filesystem_file_count alongside captured_file_count (R-11 A0.4) [SMALL]
- [x] 1.4 Surface security path-validation failures in data-loader (P0-04) [TRIVIAL]
- [x] 1.5 Add explicit rejection when data-file failures fall through to simulation (P0-06) [SMALL]
- [x] 1.6 Scope prompt history to active session (P1-01) [MEDIUM]
- [x] 1.7 Mark prompts as consumed after matching (P1-02) [SMALL]
- [x] 1.8 Isolate per-session JSON parse errors (P1-05) [SMALL]

## Agent 2: Detection & Quality Gates (9 items) — ALL DONE (prior sessions)

- [x] 2.1 Git-status Priority 2.7 signal in folder-detector cascade (R-13 A0.6) [MEDIUM]
- [x] 2.2 Parent-folder affinity boost for parents with >3 active children (R-13 B7) [SMALL]
- [x] 2.3 Contamination score penalty in both v1 and v2 scorers (R-11 A0.2) [SMALL]
- [x] 2.4 V10 same-spec wrong-session validator (R-11 A0.3) [MEDIUM]
- [x] 2.5 Quality gate enforcement — QUALITY_GATE_FAIL must block file generation (P0-01) [SMALL]
- [x] 2.6 Quality metadata injection/extraction incompatibility fix (P0-03) [MEDIUM]
- [x] 2.7 Strengthen V8 to inspect frontmatter for foreign-spec signals (R-02) [SMALL]
- [x] 2.8 Broaden V9 beyond 3-title denylist (R-02) [SMALL]
- [x] 2.9 content-filter noise.patterns config — actually consult it (R-02) [TRIVIAL]

## Agent 3: Data Flow & Types (10 items) — 9 DONE, 1 DEFERRED

- [x] 3.1 Decision dedup — suppress observation-type decisions when _manualDecisions exists (R-13 A0.7) [TRIVIAL]
- [x] 3.2 Preserve file metadata through normalization (R-03 A2) [LOW]
- [x] 3.3 Canonicalize type ownership into session-types.ts (R-04 A1) [LOW]
- [x] 3.4 Blocker extraction content validation (R-13 B9) [LOW]
- [x] 3.5 userPrompts/recentContext spec-folder relevance filtering (P0-05) [SMALL]
- [x] 3.6 Relevance keywords over-broad fix (P1-07) [MEDIUM] — THIS SESSION: Added RELEVANCE_KEYWORD_STOPWORDS
- [x] 3.7 Invalid timestamp RangeError guard (P1-08) [SMALL]
- [ ] 3.8 File-format detection heuristic improvement (P1-09) [MEDIUM] — DEFERRED: unclear scope, dual-format support works
- [x] 3.9 Long-path elision dedup key collision fix (P1-15) [MEDIUM] — F-20 full canonical path
- [x] 3.10 HAS_POSTFLIGHT_DELTA sync with delta fields (P1-17) [SMALL]

## Agent 4: Signal Extraction (6 items) — ALL DONE (prior sessions)

- [x] 4.1 Trigger input sanitization — stop feeding raw file paths (R-11 A0.5) [SMALL]
- [x] 4.2 Weighted embedding input — title + decisions×3 + outcomes×2 + general×1 (R-09 B3) [MEDIUM]
- [x] 4.3 Route embedding through generateDocumentEmbedding() (R-09 B3) [SMALL]
- [x] 4.4 Merge stopword lists — unify session-extractor and trigger-extractor sets (R-08 prep) [MEDIUM]
- [x] 4.5 Add observation types: test, documentation, performance (R-07 C3) [LOW]
- [x] 4.6 SessionActivitySignal interface (R-13 B6) [MEDIUM]

## Agent 5: Workflow Integration & Tests (8 items) — ALL DONE

- [x] 5.1 key_files filesystem fallback when post-thinning is empty (R-13 A0.8) [SMALL]
- [x] 5.2 Fix tree-thinning input — use file content not f.DESCRIPTION (R-13 A0.8) [MEDIUM]
- [x] 5.3 Template-to-workflow field contract wiring (R-13 B8) [MEDIUM]
- [x] 5.4 Workflow E2E test (R-10 A4) [MEDIUM]
- [x] 5.5 Template injection fix — escape {{...}} values (P1-11) [SMALL] — THIS SESSION: escapeMustacheValue()
- [x] 5.6 Tree-thinning merged content carried to rendered output (P1-12) [MEDIUM]
- [x] 5.7 Custom renderer Mustache compliance gaps (P1-10) [MEDIUM] — THIS SESSION: comment syntax
- [x] 5.8 Wire contamination score penalty through workflow (R-11 integration) [SMALL]

## Test Fixes (THIS SESSION)

- [x] Fix runtime-memory-inputs.vitest.ts: mock prompts must include spec-relevant content for relevance filter
- [x] Fix workflow-e2e.vitest.ts: intermittent mock timing issue (flaky, resolved on rerun)
<!-- anchor:task-list:end -->

<!-- anchor:tasks:end -->
