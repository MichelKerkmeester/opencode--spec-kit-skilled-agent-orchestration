# Deep-Research Iteration 5 - Stream 03 Internal Agent Inventory

## STATE

Iteration 5 of 8. Q1, Q3, Q4, Q5 answered. One open: Q2 (sk-code stack detection).

Iteration: 5 of 8
Focus Area: Q2 stack-agnostic detection - how does sk-code detect Webflow vs Next.js vs Go vs Swift, where is the marker-file probing logic, can a future @code reuse without hardcoding stack assumptions?

Last 3 Iterations Summary:
- Iter 2 (Q4): Write-safety = workflow/prose/script convention only.
- Iter 3 (Q5): permission.task = per-agent Task-tool boundary; LEAF / single-hop depth via prompt+YAML conventions.
- Iter 4 (Q1): No frontmatter auto-load; agents declare skill needs via body prose + Skill Advisor recommendation hook (advisor only injects a brief, doesn't read SKILL.md for the agent).

Remaining Key Question:
- Q2 (open): sk-code stack detection mechanism

## STATE FILES

All paths are relative to repo root.

- Config: specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-03-internal-agent-inventory/research/deep-research-config.json
- State Log: specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-03-internal-agent-inventory/research/deep-research-state.jsonl
- Strategy: specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-03-internal-agent-inventory/research/deep-research-strategy.md
- Registry: specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-03-internal-agent-inventory/research/findings-registry.json
- Iteration narrative: specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-03-internal-agent-inventory/research/iterations/iteration-005.md
- Per-iteration delta: specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-03-internal-agent-inventory/research/deltas/iter-005.jsonl

## CONSTRAINTS

- LEAF agent. NO sub-agent dispatch. Max 12 tool calls.
- Read iter 1-4 narratives first.

## TASK FOR THIS ITERATION

Focus Q2 — sk-code stack detection:

1. Read `.opencode/skill/sk-code/SKILL.md` end-to-end. Identify:
   - The "smart router" that detects stack
   - The list of detection markers per stack (AGENTS.md table says: Webflow → src/2_javascript/, *.webflow.js, motion.dev/GSAP/Lenis/HLS/Swiper/FilePond, wrangler.toml; OpenCode → .opencode/skill/, .opencode/agent/, MCP server folders; Go → go.mod; Swift → Package.swift, *.xcodeproj; React Native → app.json + expo / package.json + react-native; React/Next.js → next.config.* / package.json + react/next; Node.js → package.json fallback)
   - The detection ORDER and conflict-resolution policy
2. List the directory contents of `.opencode/skill/sk-code/` — find any router script, references, or assets.
3. Look at `.opencode/skill/sk-code/references/` for `router/stack_detection.md` (mentioned in iter 4) or similar. Is the detection logic implemented as a script or as docs only?
4. Read whatever stack-detection logic exists — is it executable code, structured JSON markers, or prose? File:line cite each.
5. What does sk-code return after detection? Is there a stack-aware resource list (e.g. `references/webflow/`, `references/nextjs/`, `references/go/`)? List them.
6. UNKNOWN/disambiguation behavior: what does sk-code do when no markers match or multiple markers match? Cite.
7. From `@code` perspective: D4 commits to delegating stack detection to sk-code. What does the contract look like — does @code pass the task to sk-code, or does it Read SKILL.md and apply the detection logic itself? Find the canonical invocation pattern.

## OUTPUT CONTRACT

Same structure as prior iterations. Three artifacts. JSONL append uses exact `"type":"iteration"` form.
```json
{"type":"iteration","run":5,"iteration":5,"status":"complete","focus":"...","findingsCount":<n>,"newInfoRatio":<0..1>,"keyQuestions":["q2"],"answeredQuestions":[<['q2'] if confident>],"ruledOut":[],"focusTrack":"stack-detection","toolsUsed":[...],"sourcesQueried":[...],"timestamp":"<ISO>","durationMs":<ms>}
```

newInfoRatio expectation: 0.40-0.60 (last open question, may overlap with sk-code SKILL.md surface previously surveyed).

iteration-005.md headings: Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Sources Consulted, Reflection (with three labeled sub-bullets), Recommended Next Focus. Optional Ruled Out / Dead Ends.

Begin now.
