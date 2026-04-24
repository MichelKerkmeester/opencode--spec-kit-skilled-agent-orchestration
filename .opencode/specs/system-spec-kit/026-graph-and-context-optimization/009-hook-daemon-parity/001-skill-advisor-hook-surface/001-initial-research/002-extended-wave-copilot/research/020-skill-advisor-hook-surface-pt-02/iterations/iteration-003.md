# Iteration 003 - X3 Copilot `userPromptSubmitted` Model-Visible Behavior

## Focus

Determine whether the current Copilot `userPromptSubmitted` surface in this repo injects advisor context the model can see, or only emits an external notification, then design the correct adapter or workaround path.

## Inputs Read

- Packet prompt and state:
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/prompts/iteration-3.md`
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/deep-research-state.jsonl`
- Wave-1 synthesis:
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/research.md`
- Checked-in Copilot runtime surface:
  - `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/README.md`
  - `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/compact-cache.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/copilot-hook-wiring.vitest.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/copilot-compact-cycle.vitest.ts`
- Superset wrapper evidence:
  - `.github/hooks/superset-notify.json`
  - `.github/hooks/scripts/session-start.sh`
  - `.github/hooks/scripts/superset-notify.sh`
- Cross-runtime / authoritative comparison:
  - `https://github.com/github/docs/blob/main/content/copilot/how-tos/copilot-sdk/use-hooks/user-prompt-submitted.md`
  - `https://github.com/github/docs/blob/main/content/copilot/how-tos/copilot-sdk/use-copilot-sdk/working-with-hooks.md`

## Live Repo Surface Confirmed

### 1. The checked-in Copilot hook implementation is startup-first, not prompt-submit-first

The packet's checked-in Copilot docs say `hooks/copilot/` currently contains the **SessionStart banner hook**, and `session-prime.ts` only parses `session_id` / `sessionId` plus `source`, then emits either a startup banner or compact-recovery text to stdout. There is no checked-in `userPromptSubmitted` adapter file and no prompt field in the Copilot hook input type. [SOURCE: file:.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/README.md:13-18] [SOURCE: file:.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts:31-36] [SOURCE: file:.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts:167-179]

### 2. `userPromptSubmitted` is wired today as a Superset notification path

The only checked-in registration for `userPromptSubmitted` is the Superset command hook entry in `.github/hooks/superset-notify.json`, which points to `copilot-hook.sh userPromptSubmitted`. The local wrapper test only asserts that this hook is wired through the external Superset entrypoint; it does not assert any prompt mutation or context injection behavior. [SOURCE: file:.github/hooks/superset-notify.json:18-23] [SOURCE: file:.opencode/skill/system-spec-kit/mcp_server/tests/copilot-hook-wiring.vitest.ts:15-22]

### 3. The checked-in non-banner wrapper discards input and returns empty JSON

`superset-notify.sh` throws away stdin with `cat > /dev/null`, prints `{}`, and only then asynchronously shells out to the external Superset hook. That means the checked-in non-banner path is notification-shaped: it preserves a valid hook response envelope but injects no content back into the session. The companion test locks that behavior in by asserting the non-banner wrapper returns exactly `{}`. [SOURCE: file:.github/hooks/scripts/superset-notify.sh:4-13] [SOURCE: file:.opencode/skill/system-spec-kit/mcp_server/tests/copilot-hook-wiring.vitest.ts:35-43]

### 4. SessionStart output is model-adjacent startup text, not per-prompt routing

The startup script and startup-brief builder produce the banner `Session context received. Current state:` plus the snapshot note. That is useful for startup orientation and compact recovery, but it is emitted on `sessionStart`, not on each user prompt, so it cannot safely own per-prompt advisor routing. [SOURCE: file:.github/hooks/scripts/session-start.sh:17-18] [SOURCE: file:.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:119-128]

## Authoritative Copilot Hook Contract

GitHub's Copilot SDK docs explicitly document `onUserPromptSubmitted` as a hook that can **modify prompts** and **add context before processing**. Its output contract includes `modifiedPrompt` and `additionalContext`, which means the platform hook itself is capable of model-visible prompt-time injection when implemented on the SDK surface. The same docs recommend using `additionalContext` over `modifiedPrompt` when possible. [SOURCE: https://github.com/github/docs/blob/main/content/copilot/how-tos/copilot-sdk/use-hooks/user-prompt-submitted.md] [SOURCE: https://github.com/github/docs/blob/main/content/copilot/how-tos/copilot-sdk/use-copilot-sdk/working-with-hooks.md]

## Determination

**For this repository's current checked-in Copilot path, `userPromptSubmitted` is notification-only, not model-visible advisor injection.** The proof is local: the event is registered to an external Superset hook, and the checked-in non-banner wrapper returns `{}` after discarding stdin. However, the broader Copilot SDK hook contract is *not* the blocker: GitHub's documented `onUserPromptSubmitted` surface can inject `additionalContext` or replace the prompt. So X3 resolves to a split conclusion:

1. **Current repo integration:** notification-only.
2. **Underlying Copilot platform capability:** model-visible injection is supported on the SDK hook surface.

## Adapter Design

### Preferred adapter: first-class Copilot prompt hook

If packet 026 targets the documented Copilot SDK hook surface, add a checked-in Copilot prompt adapter that mirrors the Claude/Gemini neutral-brief pattern:

1. Accept `{ timestamp, cwd, prompt }` from `onUserPromptSubmitted`.
2. Build the shared skill-advisor brief from the submitted prompt plus current packet/session context.
3. Return:

```ts
return {
  additionalContext: advisorBrief,
};
```

4. Keep prompt rewrites for explicit guardrail cases only; prefer `additionalContext` for normal routing because GitHub's docs call that the less intrusive path. [SOURCE: https://github.com/github/docs/blob/main/content/copilot/how-tos/copilot-sdk/use-hooks/user-prompt-submitted.md]

### Transport split: preserve Superset side effects separately

Do **not** overload the notification wrapper with model injection responsibilities. Instead:

1. The checked-in prompt adapter returns `additionalContext` to Copilot.
2. A fire-and-forget notifier (Superset, metrics, audit) runs as a side-effect after the brief is generated.
3. The advisor brief payload and the notification event should share the same prompt hash / session ID so observability stays correlated.

This keeps model-visible behavior deterministic and avoids treating `{}` notification success as proof that injection happened.

## Plan B for Notification-Only Surfaces

If the target Copilot runtime cannot expose the SDK `onUserPromptSubmitted` return object and only offers the shell-style notification hook currently modeled in this repo, use a **prompt-wrapper fallback**:

1. Intercept the outbound user prompt in the Copilot launcher or wrapper before it reaches the session.
2. Compute the advisor brief locally.
3. Prepend a compact, renderer-owned advisor envelope to the user prompt:

```text
[Advisor brief]
- Primary owner: system-spec-kit
- Secondary owner: sk-code-opencode
- Packet: 026 / X3
[/Advisor brief]

<original user prompt>
```

4. Send the wrapped prompt to Copilot.
5. Still emit the Superset notification for audit/telemetry only.

SessionStart reinforcement can remain as a coarse startup reminder ("spec packet active", "resume available"), but it should stay **secondary** because the startup banner is not prompt-specific and may be stale by later turns. [SOURCE: file:.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:119-128]

## Ruled Out

### 1. Treating the current `userPromptSubmitted` registration as model-visible by default

Ruled out because the checked-in wrapper returns `{}` and discards stdin before calling the external Superset hook. That is enough for telemetry, not enough for prompt enrichment. [SOURCE: file:.github/hooks/scripts/superset-notify.sh:7-13]

### 2. Using SessionStart banners as the primary advisor channel

Ruled out because SessionStart output is a startup snapshot, not a per-turn hook. It cannot guarantee prompt-specific routing fidelity. [SOURCE: file:.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:125-127]

## Decisions

- **Record X3 as answered with a split verdict.** The repo's current shell-wrapper path is notification-only, but the Copilot SDK hook surface can inject model-visible context.
- **Prefer `additionalContext` over `modifiedPrompt` for the future Copilot adapter.** That matches GitHub's documented best practice and keeps user intent intact.
- **Keep Superset as telemetry, not transport.** Model-visible prompt enrichment must come from the Copilot hook return object or the prompt wrapper, not from `{}` notification hooks.
- **Use prompt wrapping only as the fallback path.** It is the right plan-B when the SDK hook return object is unavailable, but it should not replace a first-class prompt hook where one exists.

## Question Status

- **X3 answered**: the packet now has direct proof that the checked-in repo surface is notification-only, plus authoritative Copilot docs showing the actual hook API can inject `additionalContext`, which yields a clear preferred adapter and a wrapper-based fallback.

## Next Focus

Iteration 4 should move to X4 and inspect Codex `PreToolUse` / `PostToolUse` semantics for future enforcement-mode advisor routing, using the same split between checked-in repo behavior and upstream hook capability.
