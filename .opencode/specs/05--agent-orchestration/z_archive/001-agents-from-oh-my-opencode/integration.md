# Agent System Integration Guide

> How to use the agent system in the anobel.com environment.

---

<!-- ANCHOR:overview -->
## Overview

The agent system consists of:
- **4 specialized agents**: Librarian, Front-end Debug, Documentation Writer, Webflow MCP
- **Agent advisor script**: Routes requests to appropriate agents
- **Orchestrator integration**: Gate 2.5 for agent routing

---

<!-- /ANCHOR:overview -->


<!-- ANCHOR:quick-start -->
## Quick Start

### 1. Check Agent Recommendation

```bash
python3 .opencode/scripts/agent_advisor.py "research existing patterns for notifications"
```

**Output:**
```json
{
  "agent": "librarian",
  "confidence": 0.85,
  "reasoning": "Recommend: Matched 4 triggers (research, existing, pattern, pattern:research.*before)",
  "triggers_matched": ["research", "existing", "pattern", "pattern:research.*before"],
  "alternative": null,
  "description": "Research and context gathering for evidence-based planning",
  "action": "dispatch"
}
```

### 2. Dispatch Agent via Task Tool

```markdown
## Agent Dispatch: Librarian

### Task
Research existing patterns for implementing a notification system

### Context
- Spec folder: .opencode/specs/01--anobel.com/z_archive/007-notification-system/
- Looking for: Toast notifications, alerts, overlays
- Platform: Webflow with custom JavaScript

### Expected Output
Research Findings document with prior work, existing patterns, recommendations

### Constraints
- Focus on frontend notification patterns
- Check for existing toast/alert implementations
```

---

<!-- /ANCHOR:quick-start -->


<!-- ANCHOR:agent-selection-guide -->
## Agent Selection Guide

| If you need to... | Use Agent | Confidence Threshold |
|-------------------|-----------|---------------------|
| Research before planning | Librarian | 0.6+ |
| Debug browser issues | Front-end Debug | 0.6+ |
| Create/improve documentation | Documentation Writer | 0.6+ |
| Manage Webflow CMS/sites | Webflow MCP | 0.6+ |

---

<!-- /ANCHOR:agent-selection-guide -->


<!-- ANCHOR:confidence-levels -->
## Confidence Levels

| Confidence | Action | Meaning |
|------------|--------|---------|
| 0.6+ | `dispatch` | Automatically dispatch agent |
| 0.4-0.6 | `suggest` | Suggest agent, ask user to confirm |
| <0.4 | `skip` | No agent recommended |

---

<!-- /ANCHOR:confidence-levels -->


<!-- ANCHOR:gate-25-integration -->
## Gate 2.5 Integration

Gate 2.5 runs after skill routing (Gate 2) and before spec folder question (Gate 3).

**Flow:**
```
Gate 2 (Skill Routing)
    |
Gate 2.5 (Agent Routing)
    |-- Run: python3 .opencode/scripts/agent_advisor.py "$REQUEST"
    |-- If confidence >= 0.6 -> Dispatch agent
    |-- If confidence 0.4-0.6 -> Suggest agent, ask user
    |-- If confidence < 0.4 -> Continue to Gate 3
    |
Gate 3 (Spec Folder Question)
```

---

<!-- /ANCHOR:gate-25-integration -->


<!-- ANCHOR:librarian-first-planning -->
## Librarian-First Planning

When Gate 3 Option B (new spec folder) is selected:

1. **Dispatch Librarian** for research
2. **Librarian returns** Research Findings
3. **Create spec folder** with evidence-based plan
4. **User approves** plan
5. **Proceed** to implementation

**Example:**
```
User: "I want to add a notification system"
    |
Gate 3: "Spec folder? A) Existing B) New C) Update D) Skip"
    |
User: "B"
    |
Orchestrator: Dispatches Librarian
    |
Librarian: Returns Research Findings
    |
Orchestrator: Creates .opencode/specs/01--anobel.com/z_archive/007-notification-system/ with evidence-based plan
    |
User: Reviews and approves plan
    |
Implementation begins with full context
```

---

<!-- /ANCHOR:librarian-first-planning -->


<!-- ANCHOR:agent-dispatch-format -->
## Agent Dispatch Format

All agents use the same 4-section dispatch format:

```markdown
## Agent Dispatch: [AGENT_NAME]

### Task
[Specific, atomic goal - one sentence]

### Context
- Spec folder: [path if applicable]
- Relevant files: [list]
- Prior decisions: [from memory]
- Constraints: [platform limits, patterns to follow]

### Expected Output
[What the agent should return - format and content]

### Constraints
- [What NOT to do]
- [Boundaries to respect]
```

---

<!-- /ANCHOR:agent-dispatch-format -->


<!-- ANCHOR:testing-the-system -->
## Testing the System

### Test Librarian Routing
```bash
python3 .opencode/scripts/agent_advisor.py "research existing authentication patterns"
# Expected: agent=librarian, confidence>=0.6

python3 .opencode/scripts/agent_advisor.py "find prior work on form validation"
# Expected: agent=librarian, confidence>=0.6
```

### Test Front-end Debug Routing
```bash
python3 .opencode/scripts/agent_advisor.py "debug console error on contact page"
# Expected: agent=frontend-debug, confidence>=0.6

python3 .opencode/scripts/agent_advisor.py "inspect why button is not working"
# Expected: agent=frontend-debug, confidence>=0.6
```

### Test Documentation Writer Routing
```bash
python3 .opencode/scripts/agent_advisor.py "create readme for the notification system"
# Expected: agent=documentation-writer, confidence>=0.6

python3 .opencode/scripts/agent_advisor.py "document this feature"
# Expected: agent=documentation-writer, confidence>=0.6
```

### Test Webflow MCP Routing
```bash
python3 .opencode/scripts/agent_advisor.py "update the blog collection in webflow"
# Expected: agent=webflow-mcp, confidence>=0.6

python3 .opencode/scripts/agent_advisor.py "publish the site to production"
# Expected: agent=webflow-mcp, confidence>=0.6
```

---

<!-- /ANCHOR:testing-the-system -->


<!-- ANCHOR:troubleshooting -->
## Troubleshooting

### Agent Not Recommended
If no agent is recommended (confidence < 0.4):
- The request may be too general
- Try adding specific keywords (research, debug, document, webflow)
- The task may not need an agent

### Wrong Agent Recommended
If the wrong agent is recommended:
- Check the triggers_matched in the output
- The request may contain keywords from multiple domains
- Be more specific in the request

### Low Confidence
If confidence is 0.4-0.6 (suggest mode):
- The request is ambiguous
- User should confirm the agent selection
- Consider rephrasing the request

---

<!-- /ANCHOR:troubleshooting -->


<!-- ANCHOR:agent-files-location -->
## Agent Files Location

```
.opencode/
├── agents/
│   ├── AGENT_TEMPLATE.md
│   ├── librarian/AGENT.md
│   ├── frontend-debug/AGENT.md
│   ├── documentation-writer/AGENT.md
│   └── webflow-mcp/AGENT.md
└── scripts/
    ├── skill_advisor.py
    └── agent_advisor.py
```

---

<!-- /ANCHOR:agent-files-location -->


<!-- ANCHOR:next-steps -->
## Next Steps

1. **Test the routing** with various requests
2. **Refine triggers** based on real usage
3. **Add new agents** as needed using AGENT_TEMPLATE.md
4. **Monitor confidence scores** and adjust thresholds

<!-- /ANCHOR:next-steps -->
