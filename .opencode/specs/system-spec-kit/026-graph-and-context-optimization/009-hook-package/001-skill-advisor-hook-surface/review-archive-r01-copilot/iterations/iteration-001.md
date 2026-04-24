# Iteration 001 — Dimension(s): D1

## Scope this iteration
Reviewed the prompt-handling privacy boundary for the shipped skill-advisor hook path. Focused on whether raw prompt text is kept out of model-visible output, diagnostics, caches, and runtime control surfaces.

## Evidence read
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts:208-235` → `runAdvisorSubprocess()` builds `commandArgs = [scriptPath, ...thresholdArgs(...), prompt]`, so the raw prompt is passed on the Python argv vector.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:93-99` → renderer explicitly ignores `free-form reasons, descriptions, stdout/stderr, and prompt text`.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-policy.ts:97-99` → prompt policy canonical-folds and whitespace-normalizes the prompt before classification.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-privacy.vitest.ts:78-112` → privacy suite verifies no prompt leakage in envelope, metrics, diagnostic JSONL, health output, or cache keys.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:120-129` → Claude honors `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` and exits early.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:134-143` → Gemini honors the same disable flag and exits early.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:160-169` → Copilot honors the same disable flag and exits early.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:217-226` and `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts:122-129` → Codex honors the disable flag in both JSON hook and wrapper fallback paths.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
[P1-001-01] [D1] Raw user prompts are exposed on the advisor subprocess command line
- **Evidence**: `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts:231-235`; `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:53`; `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-privacy.vitest.ts:78-112`
- **Impact**: The implementation keeps prompts out of caches, metrics, and rendered output, but it still sends the full prompt as a Python argv argument. On shared machines that makes prompt text observable through local process inspection (`ps`, procfs, activity monitors), which weakens the documented privacy boundary.
- **Remediation**: Invoke `skill_advisor.py` with prompt content over stdin (or another non-argv channel with equivalent secrecy) and extend the privacy suite to assert that subprocess invocation does not place raw prompt text on the process command line.

### P2 (Suggestion)
None.

## Metrics
- newInfoRatio: 0.78 (first-pass D1 evidence plus one new privacy finding)
- cumulative_p0: 0
- cumulative_p1: 1
- cumulative_p2: 0
- dimensions_advanced: [D1]
- stuck_counter: 0

## Next iteration focus
Advance D2 correctness next by checking the shared-payload envelope, freshness semantics, and 4-runtime parity against the shipped acceptance contract.
