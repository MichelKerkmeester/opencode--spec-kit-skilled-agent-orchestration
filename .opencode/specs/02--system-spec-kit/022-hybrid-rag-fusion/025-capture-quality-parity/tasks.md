# Tasks

## Phase A: Pre-Research Safe Fixes

- [x] A1: Centralize `sanitizeToolInputPaths` into `scripts/utils/tool-sanitizer.ts`
- [x] A1: Remove local copies from Codex, Copilot, Gemini extractors
- [x] A1: Add path sanitization to Claude Code extractor
- [x] A1: Clean up unused imports (`toWorkspaceRelativePath`, `relativeProjectPath`)
- [x] A2: Add `isApiErrorContent()` to shared utility
- [x] A2: Apply API error filtering to Codex assistant messages
- [x] A2: Apply API error filtering to Copilot assistant.message events
- [x] A2: Apply API error filtering to Gemini gemini-type messages
- [x] A3: Add `normalizeToolStatus()` and `ToolStatus` type to shared utility
- [x] A3: Apply to Gemini extractor (replaced inline allowlist)
- [x] A4: Change null severity default from 'high' to 'medium' in core quality-scorer
- [x] A4: Change null severity default from 'high' to 'medium' in extractor quality-scorer
- [x] A4: Update test to expect 'medium' behavior
- [x] A5: Fix `.gemini/agents/deep-research.md` path reference
- [x] Write new test: `tool-sanitizer.vitest.ts` (18 tests)
- [x] Add API error exclusion test to Codex capture tests
- [x] Add API error exclusion test to Copilot capture tests
- [x] Add API error exclusion test to Gemini capture tests
- [x] TypeScript compilation: clean
- [x] All 44 tests pass (23 existing + 21 new)

## Phase B: Deep Research Investigation

- [ ] Run deep research loop with 8 iterations max
- [ ] Review convergence report
- [ ] Adjust Phase C scope

## Phase C: Post-Research Enhancements

- [ ] C1: Activity richness dimension (conditional)
- [ ] C2: Cross-CLI quality parity test suite
- [ ] C3: Reasoning content exclusion alignment (conditional)
