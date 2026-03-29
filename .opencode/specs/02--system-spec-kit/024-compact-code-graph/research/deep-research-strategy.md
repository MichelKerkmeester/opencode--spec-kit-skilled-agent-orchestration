# Deep Research Strategy — Codex-CLI-Compact Evaluation

## 2. TOPIC
Evaluate Codex-CLI-Compact (https://github.com/kunal12203/Codex-CLI-Compact) for upgrading our Spec Kit Memory MCP system vs installing/using theirs. Assess usefulness in our multi-skill, multi-agent repo context with system-spec-kit.

---

## 3. KEY QUESTIONS (remaining)
- [x] Q1: What is Codex-CLI-Compact's architecture, core functionality, and code graph approach? (iteration 1)
- [x] Q2: How does its compact/code-graph logic compare to our Spec Kit Memory MCP system's approach? (iterations 2-3)
- [x] Q3: Can we extract and integrate its core logic? (iteration 4) — NO, proprietary
- [x] Q4: Would installing standalone be more practical? (iterations 5, 9) — NO, critical blockers
- [x] Q5: How well does it fit our multi-skill architecture? (iteration 6) — POOR FIT (2/10)

---

## 4. NON-GOALS
- Not evaluating Codex CLI itself (already have cli-codex skill) — only the Compact extension
- Not redesigning our entire memory system from scratch
- Not benchmarking performance metrics (focus on architectural fit)
- Not implementing any changes — research only

---

## 5. STOP CONDITIONS
- All 5 key questions answered with evidence
- Source code of Codex-CLI-Compact fully analyzed
- Clear recommendation formed (integrate logic / install standalone / skip)
- Convergence detected (newInfoRatio drops below threshold)

---

## 6. ANSWERED QUESTIONS
- [x] Q1 (iteration 1): Dual-Graph builds semantic code graph via proprietary "graperoot" Python lib. Three-stage pipeline: graph construction → context injection → session memory. Core engine is closed-source. Open-source part is launchers + benchmarks only.

---

## 7. WHAT WORKED
- WebFetch for README, CLAUDE.md, CODEX.md, install.sh, dashboard/server.py: comprehensive overview (iteration 1)
- GitHub API for file tree: revealed project structure quickly (iteration 1)

---

## 8. WHAT FAILED
- Cannot inspect graperoot source code (proprietary) — limits understanding of core graph algorithm (iteration 1)

---

## 9. EXHAUSTED APPROACHES (do not retry)
[None yet]

---

## 10. RULED OUT DIRECTIONS
[None yet]

---

## 11. NEXT FOCUS
Wave 1 (iterations 2-4 parallel):
- Iteration 2: Deep analysis of our Spec Kit Memory MCP architecture
- Iteration 3: Feature comparison between Dual-Graph and Spec Kit Memory
- Iteration 4: Integration feasibility — can we extract graperoot logic or build our own?
Wave 2 (iterations 5-7): Standalone assessment, multi-skill fit, open-source alternatives
Wave 3 (iterations 8-10): Final recommendation, risk analysis, implementation roadmap

---

## 12. KNOWN CONTEXT
- Our repo has 16+ skills in `.opencode/skill/`, including `system-spec-kit` for spec folder lifecycle
- Spec Kit Memory MCP provides: semantic search, memory_context, memory_search, memory_save, JSONL state, trigger matching
- Memory MCP is at `.opencode/skill/system-spec-kit/shared/mcp_server/`
- We already have `cli-codex` skill for Codex CLI delegation (v1.1.0)
- Prior spec folder exists: `022-hybrid-rag-fusion/024-codex-memory-mcp-fix` (related memory MCP work)
- No prior research found on Codex-CLI-Compact specifically

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Current segment: 1
- Started: 2026-03-29T09:09:00.000Z
