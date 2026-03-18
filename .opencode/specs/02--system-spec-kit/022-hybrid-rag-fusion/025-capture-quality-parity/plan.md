# Plan: Capture Quality Parity

## Phase A: Pre-Research Safe Fixes (completed)

### A1. Centralize sanitizeToolInputPaths [DONE]
- Moved most complete implementation (from Codex: single + array keys) to `tool-sanitizer.ts`
- Removed local copies from Codex, Copilot, Gemini extractors
- Added import and application to Claude Code extractor (previously missing)
- Cleaned up unused `toWorkspaceRelativePath` and `relativeProjectPath` imports

### A2. Add API error content filtering [DONE]
- Added `isApiErrorContent()` to shared `tool-sanitizer.ts`
- Applied to Codex (assistant messages), Copilot (assistant.message events), Gemini (gemini-type messages)
- Patterns match contamination-filter high-severity rules: `API Error: NNN`, JSON error payloads

### A3. Normalize tool status to shared enum [DONE]
- Added `normalizeToolStatus()` and `ToolStatus` type to `tool-sanitizer.ts`
- Applied to Gemini extractor (replaced inline allowlist check)
- Handles aliases: success/done/ok -> completed, failed/failure -> error, running/in_progress -> pending

### A4. Soften contamination severity default [DONE]
- Changed `contaminationSeverity || 'high'` to `contaminationSeverity || 'medium'` in both scorers
- Updated test from "treats null severity as high" to "treats null severity as medium"

### A5. Fix Gemini agent path reference [DONE]
- `.agents/agents/*.md` -> `.gemini/agents/*.md` in `.gemini/agents/deep-research.md:23`

## Phase B: Deep Research Investigation (future)
## Phase C: Post-Research Enhancements (future, scope TBD by Phase B)
