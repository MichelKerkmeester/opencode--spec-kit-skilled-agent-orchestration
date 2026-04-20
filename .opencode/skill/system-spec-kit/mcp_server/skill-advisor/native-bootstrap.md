---
title: "Skill Advisor Native Bootstrap"
description: "Bootstrap, verification, and rollback notes for the native advisor_recommend architecture."
---

# Skill Advisor Native Bootstrap

## Bootstrap

1. Install Node dependencies and build the MCP server:

```bash
npm --prefix .opencode/skill/system-spec-kit/mcp_server install
npm --prefix .opencode/skill/system-spec-kit/mcp_server run build
```

2. Start or refresh the system-spec-kit MCP server in the active runtime. The advisor tools live in the existing server; do not register a second MCP server.

3. Verify native tool registration:

```text
advisor_status({"workspaceRoot":"/absolute/path/to/repo"})
advisor_recommend({"prompt":"save this conversation context to memory","options":{"topK":1}})
advisor_validate({"skillSlug":null})
```

Expected:
- `advisor_status` returns `freshness`, `generation`, `trustState`, and `laneWeights`.
- `advisor_recommend` returns prompt-safe `recommendations[]` without raw prompt text.
- `advisor_validate` returns corpus, holdout, parity, safety, and latency slices.

## Compat Shims

`skill_advisor.py` remains the CLI compatibility surface. In one-shot mode it probes the native advisor first and translates `advisor_recommend` output back to the legacy JSON-array shape. If the native probe is unavailable, it falls back to the local Python scorer.

```bash
python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "help me commit my changes"
printf '%s' "help me commit my changes" | python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py --stdin
```

Testing controls:

```bash
python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py --force-native "save this context"
python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py --force-local "save this context"
```

The OpenCode plugin bridge follows the same pattern: native probe, `advisor_recommend` delegation, then Python-backed brief fallback.

## Rollback

Use rollback only long enough to diagnose or recover the native path.

```bash
# Disable all prompt-time advisor surfaces.
export SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1

# Keep hooks enabled but force the Python compatibility path.
export SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1

# CLI-only Python path.
python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py --force-local "your prompt"
```

Unset the variables after recovery:

```bash
unset SPECKIT_SKILL_ADVISOR_HOOK_DISABLED
unset SPECKIT_SKILL_ADVISOR_FORCE_LOCAL
```

## Operator Checks

Run these before declaring a bootstrap complete:

```bash
npm --prefix .opencode/skill/system-spec-kit/mcp_server run typecheck
npm --prefix .opencode/skill/system-spec-kit/mcp_server run build
python3 .opencode/skill/skill-advisor/scripts/skill_advisor_regression.py \
  --dataset .opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl
```

