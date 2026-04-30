# Provider Auth Pre-Flight donor template (extracted from cli-opencode SKILL.md §3)

This is the canonical block that the 4 sibling skills (cli-claude-code, cli-codex, cli-copilot, cli-gemini) adapt. Substitution rules per recipient skill are listed below.

## Donor block (verbatim from cli-opencode)

```markdown
### Provider Auth Pre-Flight (Smart Fallback)

**MANDATORY before any first dispatch in a session.** The default provider may not be logged in on this machine — silently failing with `provider/model not found` or `401 Unauthorized` mid-dispatch wastes a round-trip. Run this check once per session, cache the result, and re-run it only if a dispatch fails with an auth error.

```bash
# One-shot pre-flight: list configured providers, capture for routing
PROVIDERS=$(<DETECT_CMD> 2>&1)
echo "$PROVIDERS" | grep -q "<PRIMARY>" && <PRIMARY_OK>=1 || <PRIMARY_OK>=0
echo "$PROVIDERS" | grep -q "<FALLBACK>" && <FALLBACK_OK>=1 || <FALLBACK_OK>=0
```

**Decision tree** (apply in order — first match wins):

| State | <PRIMARY_OK> | <FALLBACK_OK> | Action |
|-------|--------------|---------------|--------|
| Default available | 1 | * | Proceed with `<DEFAULT_MODEL_INVOCATION>` |
| Default missing, fallback ready | 0 | 1 | **ASK user** before substituting — never auto-fall-back silently. Surface options A/B/C below. |
| Both missing | 0 | 0 | **ASK user** to configure a provider — surface the login commands, do NOT dispatch. |

**User prompt template — default missing, fallback configured:**

\`\`\`
The skill default `<PRIMARY_MODEL>` is not configured on this machine.
A configured fallback is available. Pick one:
  A) Use `<FALLBACK_MODEL_INVOCATION>` (configured now)
  B) Run `<PRIMARY_LOGIN_CMD>` first, then retry the original dispatch
  C) Name a different model — paste the `<MODEL_FLAG>` you want to use
\`\`\`

**User prompt template — both providers missing:**

\`\`\`
No supported providers are configured on this machine. Run one:
  - `<PRIMARY_LOGIN_CMD>`  (recommended — default for cli-<NAME>)
  - `<FALLBACK_LOGIN_CMD>` (alternative)
Which would you like to set up? Confirm when login finishes; the skill will retry the original dispatch.
\`\`\`

**Error-recovery contract.** If a dispatch returns an auth error after pre-flight passed (credential expired or rotated), invalidate the cache, rerun the pre-flight, and apply the same decision tree before retrying. Never substitute a model the user didn't approve.
```

## Per-recipient substitution table

| Slot | cli-claude-code | cli-codex | cli-copilot | cli-gemini |
|------|-----------------|-----------|-------------|------------|
| `<DETECT_CMD>` | `claude config list 2>&1; env | grep -E '^ANTHROPIC_API_KEY'` | `codex auth status 2>&1; env | grep -E '^OPENAI_API_KEY'` | `gh auth status 2>&1` | `gemini auth status 2>&1; env | grep -E '^GEMINI_API_KEY'` |
| `<PRIMARY>` | `anthropic-api-key\|OAuth` (regex of detection output) | `openai-api-key\|chatgpt-oauth` | `Logged in to github.com` | `oauth\|GEMINI_API_KEY` |
| `<FALLBACK>` | `setup-token\|claude-token` | `OPENAI_API_KEY` env-var fallback | `GH_TOKEN` PAT fallback | `Vertex AI` enterprise fallback |
| `<PRIMARY_OK>` var name | `ANTHROPIC_OK` | `OPENAI_OK` | `GH_OAUTH_OK` | `GOOGLE_OAUTH_OK` |
| `<FALLBACK_OK>` var name | `ANTHROPIC_TOKEN_OK` | `OPENAI_ENV_OK` | `GH_TOKEN_OK` | `GEMINI_API_KEY_OK` |
| `<DEFAULT_MODEL_INVOCATION>` | `--model claude-opus-4-7 --effort high` | `--model gpt-5.5 -c model_reasoning_effort="medium" -c service_tier="fast"` | `--model gpt-5.4` | `--model gemini-3.1-pro-preview` |
| `<PRIMARY_MODEL>` | `claude-opus-4-7` | `gpt-5.5` | `gpt-5.4` | `gemini-3.1-pro-preview` |
| `<FALLBACK_MODEL_INVOCATION>` | `--model claude-opus-4-7 --effort high` (same model, different auth) | `--model gpt-5.5` (with env-var auth) | `--model claude-sonnet-4.6` (Anthropic alternative via Copilot) | `--model gemini-3.1-pro-preview` (with API key) |
| `<PRIMARY_LOGIN_CMD>` | `claude auth login` | `codex login` | `gh auth login` | `gemini auth login` |
| `<FALLBACK_LOGIN_CMD>` | `claude setup-token` (non-interactive CI) | `export OPENAI_API_KEY=...` | `export GH_TOKEN=ghp_...` | `export GEMINI_API_KEY=...` |
| `<MODEL_FLAG>` | `--model <id>` | `--model <id>` | `--model <id>` | `--model <id>` |
| `<NAME>` | `claude-code` | `codex` | `copilot` | `gemini` |

## Adaptation rule

- Keep identical: ASK-not-substitute language, cache-invalidation contract, 3-state decision-table column structure, the bold "MANDATORY" header line.
- Substitute: detection command, var names, model invocations, login commands, provider names in the regex matchers.
- The substitution should produce a block that's structurally identical to the donor but uses the recipient CLI's native auth-detection commands and provider names.
