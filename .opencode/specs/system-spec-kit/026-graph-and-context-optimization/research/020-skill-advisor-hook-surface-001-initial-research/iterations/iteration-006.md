# Iteration 006 - Snapshot Harness, Privacy Audit, Prompt-Length Policy

## Focus

Answer Q6, Q7, and Q8 for the 020 skill-advisor hook surface:

- Q6: when should prompt-time advisor hooks run?
- Q7: where can prompt fingerprints live without creating a privacy liability?
- Q8: how should cross-runtime snapshot tests prevent brief-format drift across Claude, Gemini, and Copilot surfaces?

This iteration treats the advisor brief as an advisory context producer. It should be observable enough to debug drift, but it must not persist raw user prompts or turn the hook-state cache into a prompt-history store.

## Source Evidence

- The active strategy still had Q6, Q7, and Q8 open after iteration 5. It also identified phase 018 R4 shared-payload as the cross-runtime transport and noted that unknown producer labels are currently rejected. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/deep-research-strategy.md:20-54`]
- Iteration 003 measured single-prompt advisor subprocess cost around 52-58 ms and batch cost around 15.5 ms per prompt, then proposed a partial Q6 answer: skip short casual prompts, but fire for command-like, governance-sensitive, or work-intent prompts. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/iterations/iteration-003.md:47-211`]
- Iteration 004 established modern Codex `UserPromptSubmit` as a prompt-time injection candidate and kept prompt wrapping as compatibility fallback only. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/iterations/iteration-004.md:97-170`]
- Iteration 005 defined `AdvisorHookResult`, fail-open behavior, and the rule that `fail_open` always means `brief: null`; it also said prompt fingerprints must be salted, non-reversible hashes when exposed in metrics. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/iterations/iteration-005.md:83-236`]
- Existing Claude hook utilities reserve stdout for hook output, log diagnostics to stderr, and enforce a 1800 ms hook timeout. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:8-93`]
- Current hook-state persists per-session JSON under temp state, hashes the project path and session id for file placement, creates the state dir with `0700`, writes files with `0600`, and currently stores compact payload, producer metadata, metrics, and timestamps. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:1-52`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:321-459`]
- Hook-state readers reject unscoped most-recent lookups, isolate invalid files, and rank states by logical `updatedAt` rather than filesystem mtime. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:769-860`]
- Shared provenance wraps recovered compact context with explicit `[SOURCE]` and `[PROVENANCE]` markers, escapes marker fields, strips instruction-shaped recovered lines, and carries `sanitizerVersion` plus `runtimeFingerprint`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/shared-provenance.ts:20-101`]
- Gemini hook output uses JSON with `hookSpecificOutput.additionalContext`; plain text stdout is not the injection path for Gemini context. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/shared.ts:41-100`]
- Gemini compact-inject is one-shot, reads a cached compact payload from hook-state, emits JSON `additionalContext`, and clears only after stdout write succeeds. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:1-110`]
- Copilot has configured `userPromptSubmitted` and compact/session hooks, but the repo-owned Copilot session-prime surface emits plain stdout banners and recovers compact context through hook-state. [SOURCE: `.github/hooks/superset-notify.json:1-32`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts:1-190`]
- Shared payload currently accepts only `startup`, `resume`, `health`, `bootstrap`, and `compaction` kinds, only the current producer enum, and section sources limited to memory, code-graph, semantic, session, or operational. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:8-18`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:190-219`]
- Transport tests already reject invalid shared-payload producer values, so `skill_advisor_brief` cannot be emitted as a first-class producer without enum/test updates. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:168-180`]

## Part A - Snapshot Test Design (Q8)

### Recommendation

Use a two-layer test harness:

1. **Renderer contract tests** for a pure function such as `renderAdvisorBrief(result, options)`.
2. **Runtime adapter tests** for Claude, Gemini, and Copilot output wrappers.

The renderer contract should be the canonical comparison point. Runtime adapters are allowed to differ in outer transport shape, but after normalization they must yield the same advisor brief, freshness, pass/fail status, and provenance label.

### Fixture Shape

Create one shared fixture module:

```text
.opencode/skill/system-spec-kit/mcp_server/tests/fixtures/advisor-hook-fixtures.ts
```

Recommended fixtures:

| Fixture | Purpose | Expected model-visible output |
| --- | --- | --- |
| `livePassingSkill` | Normal happy path | 80-token advisor brief, `freshness=live`, passing top-1 |
| `staleHighConfidenceSkill` | Degraded but still useful | Brief includes `Advisor: stale`; no mandatory wording |
| `noPassingSkill` | Valid advisor result but below gates | No model-visible brief by default |
| `failOpenTimeout` | Fail-open subprocess timeout | No model-visible brief; stderr/metrics only |
| `skippedShortCasual` | Prompt below Q6 threshold | No model-visible brief; status `skipped` |
| `ambiguousTopTwo` | Top-2 close or dual-pass case | 120-token debug/ambiguous form only when enabled |

Each fixture should include:

```ts
{
  promptLabel: 'work-intent-long',
  promptText: 'redacted fixture prompt',
  promptPolicy: { shouldRun: true, reason: 'work_intent' },
  result: AdvisorHookResult,
  expectedBrief: 'Advisor: live; use sk-code-opencode 0.95/0.23 pass.',
}
```

The `promptText` is a test fixture, not a production log example. Production snapshots must not record real prompts.

### Vitest Snapshot Format vs Custom Diff

Use **custom normalized diff as the primary assertion** and keep Vitest inline snapshots only for short golden examples.

Why:

- Claude and Copilot currently emit plain stdout-style strings.
- Gemini emits JSON with `hookSpecificOutput.additionalContext`.
- Future Codex likely emits JSON with `hookSpecificOutput.additionalContext`.
- JSON key order, shell escaping, and Gemini HTML escaping should not create false failures.

Recommended normalizers:

```ts
type NormalizedAdvisorRuntimeOutput = {
  runtime: 'claude' | 'gemini' | 'copilot' | 'codex';
  transport: 'plain_stdout' | 'json_additional_context' | 'prompt_wrapper';
  additionalContext: string | null;
  stderrVisible: boolean;
  decision?: 'allow' | 'block' | 'deny';
};
```

Test pattern:

```ts
const normalized = normalizeAdvisorRuntimeOutput(runtime, rawOutput);
expect(normalized.additionalContext).toBe(fixture.expectedBrief);
expect(stripRuntimeTransport(normalized)).toEqual({
  additionalContext: fixture.expectedBrief,
  freshness: 'live',
  injected: true,
});
expect(rawOutput).toMatchInlineSnapshot();
```

The custom diff owns semantic equality; the inline snapshot only makes intentional outer-format changes visible in review.

### Per-Runtime Adapter Expectations

| Runtime | Current transport pattern | Advisor hook expectation |
| --- | --- | --- |
| Claude | `formatHookOutput()` writes plain text to stdout; compact state is cached in hook-state. | `UserPromptSubmit` adapter may emit plain context text if Claude accepts plain stdout. The normalized test should assert the same brief text as other runtimes, not identical JSON. |
| Gemini | Hook stdout must be JSON with `hookSpecificOutput.additionalContext`; comments say plain text becomes a displayed systemMessage, not injected context. | Adapter must wrap advisor brief in `additionalContext`. Snapshot should parse JSON and compare the field. |
| Copilot | Repo config exposes `userPromptSubmitted`; current session-prime emits plain stdout banner and compact recovery uses hook-state. | Adapter should preserve whatever Copilot command hook expects, but the normalized test should require model-visible advisory text only for passing, non-fail-open results. |
| Codex | Iteration 004 found `UserPromptSubmit` and `additionalContext` evidence, but repo has no adapter yet. | Include Codex in design fixtures, but make the first automated comparison optional until 020/006 adds the adapter. |

### Regression Budget

Run these automatically on every PR that touches advisor hooks, shared payload, or runtime detection:

- Pure renderer tests for all six fixtures.
- Runtime adapter tests for Claude, Gemini, and Copilot.
- Shared payload vocabulary tests that reject unknown producers until the enum is intentionally extended.
- Privacy tests that assert no raw prompt appears in stdout, stderr, persisted hook-state, or snapshots.

Recommended tolerance:

| Surface | Auto-compared? | Tolerance |
| --- | --- | --- |
| Normalized advisor brief content | Yes | Zero semantic drift. Whitespace normalized only at line boundaries. |
| Runtime wrapper shape | Yes | JSON key order ignored; field names and injection field are exact. |
| Token budget | Yes | 80-token target, 120-token hard cap for normal prompt hook output. |
| Fail-open output | Yes | Exact null/empty model-visible context. |
| Latency | No in snapshot test | Separate timing test/manual or nightly budget: p95 under 200 ms, hard cap 1800 ms. |
| Full 200-prompt corpus | Not every PR | Run nightly/manual or when advisor scoring/cache changes. |

Answer to Q8: use a normalized, custom-diff harness as the authoritative cross-runtime comparison, with small inline snapshots for reviewed adapter wrappers. Auto-compare Claude, Gemini, and Copilot immediately; add Codex once 020/006 lands the native adapter.

## Part B - Privacy Audit (Q7)

### Privacy Boundary

The safe default is:

- **In-memory only** for prompt-result cache entries.
- **Persisted hook-state only** for source freshness, aggregate counters, last failure code, and non-prompt producer metadata.
- **No raw prompt text** in hook-state, JSONL state, stdout, stderr, snapshots, or shared-payload provenance.

The existing hook-state file is protected reasonably for compact recovery (`0700` directory, `0600` file, hashed session path), but that does not make it appropriate for prompt history. Prompt text has higher privacy sensitivity than compact-producer metadata because short prompts can contain credentials, names, customer data, or exact private instructions.

### Hash Strategy

Do not use plain `sha256(promptText)`.

Plain SHA-256 is vulnerable to dictionary attacks for low-entropy prompts such as `/help`, `fix login`, `use sk-doc`, or names. Stable tokenized forms are not better: they can increase linkability across runtimes and can expose routing-relevant words if debug output leaks token lists.

Recommended cache key:

```ts
HMAC_SHA256(
  sessionSecret,
  [
    canonicalFold(prompt).trim().replace(/\s+/g, ' '),
    sourceSignature,
    runtime,
    thresholdConfigVersion,
    semanticMode,
  ].join('\0')
)
```

Rules:

- `sessionSecret` is random per runtime session and memory-only by default.
- If a process-per-hook runtime needs cross-process exact-cache reuse, persisted fingerprint caching must be opt-in, TTL-capped to 5 minutes, and stored with no raw prompt, no normalized prompt, no token list, and no full recommendation reason.
- Persisted hashes should be labelled `promptFingerprint`, not `promptHash`, to avoid implying reversibility safety from SHA alone.
- Never include prompt fingerprints in `SharedPayloadProvenance.sourceRefs`; source refs should identify advisor source artifacts such as the script, graph metadata, and skill graph artifact, not user text.

### Hook-State JSON Contents

Allowed in persisted hook-state:

- Advisor source signature: SKILL.md discovery signature, graph artifact signature, advisor script/runtime signature.
- Last source freshness state: `live | stale | absent | unavailable`.
- Last success/failure timestamps.
- Last error code and retry counters.
- Aggregate metrics such as invocation count, fail-open count, p95 duration bucket, and cache hit counters.
- Compact payload state already governed by provenance wrappers.

Not allowed by default:

- Raw prompt text.
- Normalized prompt text.
- Tokenized prompt text.
- Full prompt-result cache entries.
- Full recommendation reason strings derived from prompt terms.
- Full stdout/stderr from advisor subprocess.
- Prompt fingerprint in shared-payload provenance or long-lived memory saves.

Conditional opt-in only:

- TTL-capped exact prompt-result cache keyed by HMAC fingerprint.
- Debug packet-local scratch logs for fixture prompts only, never live user prompts.

### Phase 018 R4 Shared-Provenance Implications

Phase 018/R4-style provenance strengthens the privacy argument rather than weakening it. The existing recovered-context contract requires explicit producer, source surface, trust state, source refs, sanitizer version, and runtime fingerprint before cached content is emitted. Advisor brief payloads should follow that pattern, but prompt fingerprints are not source refs.

Recommended shared-payload extension for implementation:

- Add producer: `skill_advisor_brief`.
- Prefer section source `operational` unless a dedicated `advisor` source is intentionally added.
- Keep `sourceRefs` to static or local source artifacts:
  - `skill_advisor.py`
  - `skill_advisor_runtime.py`
  - `skill-graph.sqlite` or fallback artifact label
  - `advisor-source-signature`
- Require `sanitizerVersion` and `runtimeFingerprint` whenever advisor output is cached or recovered.
- Add a test that a payload with `sourceRefs: ['promptFingerprint:...']` is rejected by the advisor producer helper even if the generic shared-payload type would allow it.

Answer to Q7: prompt fingerprints should be HMAC-SHA256 over a canonical prompt plus source/runtime config fields, keyed by a session-only secret and kept in memory by default. Persisted hook-state should store source freshness and aggregate diagnostics, not prompt fingerprints. Persisted exact prompt-result cache is an opt-in 5-minute TTL path only.

## Part C - Prompt-Length Threshold (Q6)

### Policy

Do not fire on every prompt. Use a dual gate:

1. **Marker override**: fire regardless of length when the prompt has an explicit skill, command, governance, memory, or deep-loop marker.
2. **Work-intent threshold**: fire for ordinary prompts only when they are long enough and intent-shaped.

Recommended function:

```ts
function shouldRunAdvisor(prompt: string): AdvisorPromptPolicy {
  const normalized = canonicalFold(prompt).trim();
  if (normalized.length === 0) return { shouldRun: false, reason: 'empty' };
  if (/^\/(?:help|clear|exit|quit)\b/.test(normalized)) return { shouldRun: false, reason: 'control_command' };
  if (/^(?:hi|hello|thanks|thank you|ok|yes|no|y|n|d)$/i.test(normalized)) {
    return { shouldRun: false, reason: 'short_casual' };
  }
  if (hasExplicitSkillOrCommandMarker(normalized)) return { shouldRun: true, reason: 'explicit_marker' };
  if (hasGovernanceOrDeepLoopMarker(normalized)) return { shouldRun: true, reason: 'governance_marker' };
  if (hasWorkIntentVerb(normalized) && meaningfulTokenCount(normalized) >= 3) {
    return { shouldRun: true, reason: 'work_intent' };
  }
  if (normalized.length >= 20 && meaningfulTokenCount(normalized) >= 4) {
    return { shouldRun: true, reason: 'length_and_tokens' };
  }
  if (normalized.length >= 50 && !looksCasual(normalized)) {
    return { shouldRun: true, reason: 'long_prompt' };
  }
  return { shouldRun: false, reason: 'below_threshold' };
}
```

### Threshold Answer

| Prompt class | Example | Policy |
| --- | --- | --- |
| Empty/whitespace | `""` | Skip. |
| 1-3 chars | `?`, `ok`, `D` | Skip unless it is a supported explicit marker. |
| Control command | `/help`, `/clear` | Skip. |
| Short explicit governance | `/memory:save`, `deep-review` | Fire. |
| Short work intent | `review PR #12`, `fix failing CI` | Fire via work-intent marker even if under 20 chars. |
| General prompt >=20 chars and >=4 meaningful tokens | `update the hook docs` | Fire. |
| Long prompt >=50 chars | ordinary implementation/research request | Fire unless classified casual. |

The effective minimum is not "3 characters" or "50 characters"; it is **explicit marker OR 20 visible characters plus 4 meaningful tokens OR work-intent verb plus 3 meaningful tokens**.

This policy avoids wasting 50-60 ms on `/help`-style commands and acknowledgements while still catching legitimate routing requests such as `review PR #12`, `use sk-doc`, `/memory:save`, and `deep-research`.

Answer to Q6: skip empty, casual, and control prompts; fire on explicit skill/command/governance markers; otherwise use a 20-character plus 4-meaningful-token threshold, with a 3-token work-intent override.

## Answers

### Q6: Prompt-Length Threshold

The hook should not fire on every prompt. It should skip empty, casual, and control prompts, fire for explicit skill/command/governance markers, and fire for ordinary work prompts at either `>=20` visible chars plus `>=4` meaningful tokens or a work-intent verb plus `>=3` meaningful tokens. A pure 3-character threshold is too noisy; a pure 50-character threshold misses real short routing requests.

### Q7: Privacy

Prompt fingerprints should be session-scoped HMAC-SHA256 keys over canonicalized prompt text plus source/runtime config fields. They should remain in memory by default. Persisted hook-state should keep source freshness and aggregate diagnostics only; persisted prompt-result cache is opt-in, exact-match only, and TTL-capped to 5 minutes. Raw prompts, normalized prompts, token lists, and prompt fingerprints must not enter shared-payload provenance, JSONL, or memory saves.

### Q8: Snapshot Harness

Use normalized custom diff as the primary cross-runtime assertion and inline Vitest snapshots only for small, canonicalized wrapper examples. Auto-compare Claude, Gemini, and Copilot runtime adapters against the same renderer fixtures. Require zero semantic drift in normalized advisor brief content, tolerate only JSON key order and whitespace wrapper differences, and run corpus/latency checks outside the snapshot suite.

## Findings

1. The test harness needs a pure renderer layer because runtime wrappers differ too much for raw snapshot equality.
2. Gemini is the strictest adapter: JSON `hookSpecificOutput.additionalContext` is required for injected context, so a plain-text snapshot would be a false pass.
3. Copilot has a `userPromptSubmitted` hook config, but current repo-owned Copilot session output is plain stdout. The normalized harness should compare model-visible context, not transport syntax.
4. Shared-payload producer/source vocabulary must be extended before `skill_advisor_brief` can be a first-class envelope.
5. Prompt fingerprints are more sensitive than existing compact producer metadata; `0600` temp-state files are helpful but not enough to justify default prompt-history persistence.
6. HMAC with a session secret is preferable to plain SHA-256 because many prompts are short and guessable.
7. Q6 should use marker and intent rules, not a single character count.
8. The automatic regression budget should cover renderer, adapter, fail-open, and privacy redaction tests on every PR; latency and full corpus tests belong to focused or nightly validation.

## Next Focus

Iteration 7 should answer Q9 and Q10 together: final implementation-cluster decomposition, which child folders are truly needed, and exactly which shared-payload vocabulary extension belongs in the first implementation wave.

## Ruled Out

- Raw Vitest snapshots as the only cross-runtime drift detector.
- Persisting raw prompts or normalized prompt strings in hook-state.
- Plain SHA-256 prompt hashes.
- Treating prompt fingerprints as shared-payload source refs.
- Firing the advisor hook for `/help`, empty prompts, or short acknowledgements.
- A pure 50-character threshold, because it misses short but legitimate routing requests.
