## Scenario I1 — cli-copilot-1

| Dimension | Score | Evidence |
|-----------|-------|----------|
| Correctness | 0 | Took 9.6 minutes (576s) — likely tried to invoke /memory:save and got stuck in tool-loop, eventually returned descriptive text |
| Tool Selection | 0 | Wrong tool fit: copilot has no /memory:save command; spent 2.1M tokens exploring |
| Latency | 0 | 576s (~9.6 min — catastrophic outlier) (576455ms) |
| Token Efficiency | 0 | 2,115,900 tokens (highest in entire sweep, 7x next-highest) (real tokens: 2115900) |
| Hallucination | 1 | Description okay but invented intermediate state along the way |
| **Total** | **1/10** | |

**Notable**: WORST CELL OF SWEEP: copilot autonomous-mode failure-mode on a vague intent. Cost 9.6 min and 2M tokens for low-quality output. Strong recommendation: don't dispatch ambiguous intent prompts to copilot in autonomous mode.
