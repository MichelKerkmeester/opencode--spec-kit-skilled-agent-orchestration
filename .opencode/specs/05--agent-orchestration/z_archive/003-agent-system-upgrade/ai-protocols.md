# AI Protocols: Research & Debug Agent Improvements

<!-- ANCHOR:agent-routing-rules -->
## Agent Routing Rules

### Research Agent Routing
| Trigger | Route To | Confidence |
|---------|----------|------------|
| "research", "investigate", "analyze" | @research | 0.9 |
| "find evidence", "gather information" | @research | 0.85 |
| "understand how", "explore" | @research | 0.8 |

### Debug Agent Routing
| Trigger | Route To | Confidence |
|---------|----------|------------|
| "debug", "fix error", "troubleshoot" | @debug | 0.9 |
| "3+ failed attempts" | @debug | 0.95 |
| "error persists", "still broken" | @debug | 0.85 |
| "/spec_kit:debug" | @debug | 1.0 |

<!-- /ANCHOR:agent-routing-rules -->


<!-- ANCHOR:tool-selection-matrix -->
## Tool Selection Matrix

### Research Tasks
| Need | Primary | Fallback | Avoid |
|------|---------|----------|-------|
| Understand code meaning | Narsil neural | Grep + Read | - |
| Map code structure | Narsil structural | Glob + Read | - |
| Find text patterns | Grep | Narsil neural | - |
| Find files | Glob | Bash find | - |
| Web research | WebSearch | WebFetch | - |

### Debug Tasks
| Need | Primary | Fallback | Avoid |
|------|---------|----------|-------|
| Trace error path | Narsil call graph | Manual trace | - |
| Find similar errors | Narsil neural | Grep | - |
| Check syntax | Bash (lint) | Read | - |
| Verify fix | Bash (tests) | Manual | - |

<!-- /ANCHOR:tool-selection-matrix -->


<!-- ANCHOR:error-handling-patterns -->
## Error Handling Patterns

### Research Agent Errors
| Error | Action | Escalation |
|-------|--------|------------|
| Source unavailable | Try alternate source | After 3 failures |
| Conflicting evidence | Grade both, report | Request user resolution |
| Insufficient data | Expand search scope | Report with partials |

### Debug Agent Errors
| Error | Action | Escalation |
|-------|--------|------------|
| Cannot reproduce | Request more context | Immediately |
| Multiple root causes | Prioritize by impact | After ranking |
| Fix causes regression | Revert, re-analyze | After 2 attempts |
| 3+ hypotheses fail | Document all attempts | Immediately |

<!-- /ANCHOR:error-handling-patterns -->


<!-- ANCHOR:escalation-procedures -->
## Escalation Procedures

### Research Escalation
1. Document current findings
2. List what's missing
3. Propose alternative approaches
4. Request user guidance

### Debug Escalation
1. Document all hypotheses tested
2. Show evidence for each
3. Identify knowledge gaps
4. Propose: different agent, user intervention, or expert consultation

<!-- /ANCHOR:escalation-procedures -->


<!-- ANCHOR:multi-agent-coordination -->
## Multi-Agent Coordination

### Research → Debug Handoff
When research identifies a bug:
1. Research agent documents findings in research.md
2. Orchestrator reviews findings
3. If fix needed, dispatch @debug with structured handoff
4. Debug agent receives: error, files, prior attempts (none for fresh bugs)

### Debug → Research Handoff
When debug needs more context:
1. Debug agent reports: "Need research on [topic]"
2. Orchestrator dispatches @research
3. Research returns findings
4. Orchestrator synthesizes and re-dispatches @debug

<!-- /ANCHOR:multi-agent-coordination -->


<!-- ANCHOR:response-format-protocols -->
## Response Format Protocols

### Research Agent Response
```markdown
## Research Complete

### Findings
[Structured findings with evidence grades]

### Recommendations
[Prioritized action items]

### Sources
[All sources with reliability grades]
```

### Debug Agent Response
```markdown
## Debug Resolution

**Root Cause**: [One sentence]
**Category**: [error type]

### Changes Made
- `file:line` - [change]

### Verification
- [ ] Tests pass
- [ ] Error resolved
```

<!-- /ANCHOR:response-format-protocols -->
