# Iteration 016: Enforcement Design Options

## Focus Question(s)

V9/V10 refinement - what enforcement path would make Smart Routing real?

## Tools Used

- Design synthesis from runtime hook review
- Read of runtime config hook surfaces

## Sources Queried

- `.claude/settings.local.json`
- `.gemini/settings.json`
- `.codex/config.toml`
- `.opencode/skill/skill-advisor/scripts/skill_advisor.py`

## Findings

- Prompt-time skill advisor hooks can recommend a skill, but they do not constrain subsequent file reads.
- A true enforcement layer needs either a PreToolUse/BeforeTool hook or a wrapper around file-read tooling that can compare requested paths with a route decision.
- A softer first step is telemetry-only: log out-of-tier reads without blocking, then publish compliance reports by skill and prompt bucket.
- A hard-blocking layer should wait until route parsing is robust across the observed aliases and missing-path issues.
- The best near-term design is "observe first, enforce later": instrument, measure false positives, patch stale route maps, then add warn/block modes.

## Novelty Justification

This converted the enforcement absence into an adoption path instead of a binary reject.

## New-Info-Ratio

0.06

## Next Iteration Focus

Recommendations and decision calls per V question.
