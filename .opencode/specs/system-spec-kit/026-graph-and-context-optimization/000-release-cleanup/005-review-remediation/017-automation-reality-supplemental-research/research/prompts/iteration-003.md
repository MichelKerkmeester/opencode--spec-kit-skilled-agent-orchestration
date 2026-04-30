## Deep Research Iteration 3 (013 — Automation Reality Supplemental, continuation of 012)

You are deep-research agent dispatched for iteration 3 of 5. Iters 1-2 completed (deep-loop graph automation reality + CCC + eval + ablation reality).

### State summary

- Segment: 1 | Iteration: 3 of 5
- Read prior iterations from `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/017-automation-reality-supplemental-research/research/iterations/iteration-001.md` and `iteration-002.md` to avoid duplicate ground.
- Next focus: Validator auto-fire surface

### Iteration 3 focus

**Validator auto-fire surface** (RQ3)

Pin file:line for every "validation auto-fires" claim across the codebase. Specifically answer:

1. Does `validate.sh --strict` auto-fire on PostToolUse for spec doc edits in any runtime hook config (Claude / Codex / Copilot / Gemini / OpenCode)?
2. Does `generate-context.js` auto-fire after spec edits, or only when `/memory:save` is invoked?
3. Are there any hooks under `.opencode/skill/system-spec-kit/mcp_server/dist/hooks/` or `.opencode/hooks/` or per-runtime config dirs that fire validation OR context generation automatically?
4. Are there any background daemons / file watchers / cron paths that re-validate spec docs on change?
5. What gets re-indexed on memory_save / generate-context.js — and is THAT auto-triggered?

For each finding:

- Tool/path: where the validation/generation code lives (file:line)
- Auto-fire trigger: file:line of the hook config / YAML step / handler that fires it (or "manual: only via slash command / explicit invocation")
- Class: `auto` / `half` / `manual` / `aspirational`
- Severity if aspirational

### Source files to read (representative)

- `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`
- `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js` (and source `.ts`)
- `.opencode/skill/system-spec-kit/mcp_server/dist/hooks/`
- `.opencode/hooks/` (if present)
- `.claude/settings.local.json`, `.claude/settings.json`
- `.codex/settings.json`, `.codex/hooks.json` (if present)
- `.opencode/opencode.json` (hooks config)
- `.gemini/settings.json` (if hook config exists)
- Any docs in `.opencode/skill/system-spec-kit/references/hooks/` or `references/config/`
- CLAUDE.md, AGENTS.md, SKILL.md (search for "auto-validate" / "auto-fires" / "auto-reindex" claims)

### Constraints

- READ ONLY. No source code mutations.
- Per-finding file:line citations MANDATORY (or `speculation: true` flag with severity ≤ P2).
- Adversarial honesty: if a doc says "validation auto-fires" but no hook config triggers it, mark `aspirational` with appropriate severity.

### Output contract — write EXACTLY these files

#### 1. `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/017-automation-reality-supplemental-research/research/iterations/iteration-003.md`

Markdown file with these sections:

```markdown
# Iteration 3: Validator Auto-Fire Surface

## Status
[converged | thought | insight | error | timeout]

## Focus
Validator auto-fire surface (validate.sh PostToolUse, generate-context.js auto-trigger conditions)

## Sources read
- file:line — what was found

## Findings (4-class reality map rows)

| Trigger surface | Auto-fire path (file:line) | Manual entry | Class | Severity |
|-----------------|----------------------------|--------------|-------|----------|
| validate.sh on PostToolUse (Claude) | ... | /spec_kit:validate | manual | n/a |
| generate-context.js after spec edit | ... | /memory:save | manual | n/a |
| ... | ... | ... | ... | ... |

## NEW gap-findings (P0/P1/P2)
For each "documented but absent" finding (e.g., "validate auto-fires" with no hook), give 2-3 sentence rationale + severity.

## Cross-runtime contradictions
If different runtime configs claim different validation behaviors, surface the conflict.

## newInfoRatio estimate
[0.0 - 1.0]

## Next focus
What iteration 4 should drill into.
```

#### 2. `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/017-automation-reality-supplemental-research/research/deltas/iter-003.jsonl`

```jsonl
{"type":"iteration","run":3,"focus":"Validator auto-fire surface","status":"insight","findingsCount":<N>,"newInfoRatio":<0.0-1.0>,"timestamp":"<ISO 8601 NOW>"}
{"type":"finding","run":3,"id":"F-013-NNN","kind":"reality_map_row","tool":"<tool>","class":"<class>","severity":"<sev>","fileRef":"<file:line>","summary":"<one-line>"}
```

#### 3. Append ONE line to `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/017-automation-reality-supplemental-research/research/deep-research-state.jsonl`

```jsonl
{"event":"iteration_complete","at":"<ISO 8601 NOW>","iter":3,"focus":"Validator auto-fire surface","newInfoRatio":<0.0-1.0>,"status":"insight"}
```

Output ONLY the file writes. Do not narrate. Do not summarize. Just write the three files and exit.
