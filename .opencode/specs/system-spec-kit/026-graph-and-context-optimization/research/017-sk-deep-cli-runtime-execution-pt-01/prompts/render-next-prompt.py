#!/usr/bin/env python3
"""Render the next iteration prompt by reading the previous iteration's Next Focus section."""
import re
import sys
import json
from pathlib import Path

ARTIFACT_DIR = Path(".opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/017-sk-deep-cli-runtime-execution/001-executor-feature")

def count_iterations():
    state_log = ARTIFACT_DIR / "deep-research-state.jsonl"
    count = 0
    with open(state_log) as f:
        for line in f:
            try:
                rec = json.loads(line)
                if rec.get("type") == "iteration":
                    count = max(count, rec.get("iteration", 0))
            except Exception:
                continue
    return count

def extract_next_focus(iter_file):
    content = iter_file.read_text()
    match = re.search(r"##\s+Next Focus\s*\n+(.+?)(?=\n##|\Z)", content, re.DOTALL)
    if not match:
        return "Continue with the next highest-priority question from the strategy."
    return match.group(1).strip()

def extract_brief_summaries(n=3):
    """Return last N iterations' focus + status as terse bullets."""
    state_log = ARTIFACT_DIR / "deep-research-state.jsonl"
    iters = []
    with open(state_log) as f:
        for line in f:
            try:
                rec = json.loads(line)
                if rec.get("type") == "iteration":
                    iters.append(rec)
            except Exception:
                continue
    last = iters[-n:] if len(iters) >= n else iters
    return "\n".join([
        f"- Iter {it['iteration']}: focus='{it.get('focus', '?')}' status='{it.get('status', '?')}' newInfoRatio={it.get('newInfoRatio', '?')}"
        for it in last
    ])

def extract_remaining_questions():
    strategy = (ARTIFACT_DIR / "deep-research-strategy.md").read_text()
    match = re.search(r"<!--\s*ANCHOR:key-questions\s*-->\s*##.*?\n(.*?)<!--\s*/ANCHOR:key-questions", strategy, re.DOTALL)
    if not match:
        return ""
    qs = re.findall(r"- \[[ xX]\]\s+(Q\d+.*)", match.group(1))
    return "\n".join([f"- {q}" for q in qs])

def main():
    prev_n = count_iterations()
    next_n = prev_n + 1
    if next_n > 30:
        print(f"ERROR: already at iteration {prev_n}; max 30")
        sys.exit(1)
    prev_file = ARTIFACT_DIR / "iterations" / f"iteration-{prev_n:03d}.md"
    if not prev_file.exists():
        print(f"ERROR: {prev_file} does not exist")
        sys.exit(1)
    next_focus = extract_next_focus(prev_file)
    summaries = extract_brief_summaries(3)
    remaining = extract_remaining_questions() or "See strategy.md key-questions anchor."

    prompt_path = ARTIFACT_DIR / "prompts" / f"iteration-{next_n:03d}.md"
    iter_path = f".opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/017-sk-deep-cli-runtime-execution/001-executor-feature/iterations/iteration-{next_n:03d}.md"
    state_log = ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/017-sk-deep-cli-runtime-execution/001-executor-feature/deep-research-state.jsonl"
    config = ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/017-sk-deep-cli-runtime-execution/001-executor-feature/deep-research-config.json"
    strategy_path = ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/017-sk-deep-cli-runtime-execution/001-executor-feature/deep-research-strategy.md"
    registry = ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/017-sk-deep-cli-runtime-execution/001-executor-feature/findings-registry.json"

    prompt = f"""# Deep-Research Iteration Prompt Pack

## STATE

STATE SUMMARY (auto-generated): Session dr-20260418T120854Z-9c57f9 | Iteration: {next_n} of 30 | Last iteration completed: {prev_n}

Research Topic: Post-Phase-017 refinement, improvement, bug, and follow-up surface under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime/`. Investigate: metadata-freshness regen stability (H-56-1 aftermath + description.json auto-regen preserve-field gaps), code-graph readiness vocabulary completeness across the 7 sibling handlers, NFKC + evidence-marker + lint false-positive surfaces, retry-budget policy calibration (N=3 empirical basis), AsyncLocalStorage caller-context propagation edge cases, Copilot autonomous-execution hardening preconditions, Wave-D deferred P2 coupling risk (R55-P2-002/003/004), + 16-folder canonical-save sweep ordering invariants. Deliverable: Phase-019+ scoping document with prioritized findings (P0/P1/P2), reproduction paths, + risk-ranked remediation candidates.

Iteration: {next_n} of 30
Focus Area: {next_focus}

Remaining Key Questions:
{remaining}

Last 3 Iterations Summary:
{summaries}

## STATE FILES

All paths are relative to the repo root.

- Config: {config}
- State Log: {state_log}
- Strategy: {strategy_path}
- Registry: {registry}
- Write findings to: {iter_path}

You may read prior iterations from `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/017-sk-deep-cli-runtime-execution/001-executor-feature/iterations/` to understand context.

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 3-5 research actions. Max 12 tool calls total.
- Write ALL findings to files. Do not hold in context.
- The workflow reducer owns strategy machine-owned sections, registry, and dashboard synchronization.
- When emitting the iteration JSONL record, include an optional `graphEvents` array of objects describing coverage graph nodes and edges discovered this iteration. Omit the field when no graph events are produced.
- Working directory for all reads/writes: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`

## OUTPUT CONTRACT

You MUST produce TWO artifacts per iteration. The post-dispatch validator will fail if either is missing or malformed.

1. **Iteration narrative markdown** at `{iter_path}`. Structure: headings for Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Next Focus.

2. **JSONL delta record** appended to `{state_log}` with the required schema:

```
{{"type":"iteration","iteration":{next_n},"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[/* optional */]}}
```

Both artifacts are REQUIRED.
"""
    prompt_path.write_text(prompt)
    print(f"RENDERED prompts/iteration-{next_n:03d}.md (next_n={next_n}, prev_focus_excerpt={next_focus[:100]}...)")

if __name__ == "__main__":
    main()
