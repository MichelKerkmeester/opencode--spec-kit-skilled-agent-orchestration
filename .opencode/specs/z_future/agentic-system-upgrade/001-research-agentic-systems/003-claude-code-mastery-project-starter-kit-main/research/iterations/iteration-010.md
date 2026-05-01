# Iteration 010 — Specialist Agents And MCP Packaging

## Research question
Do the starter kit's tiny specialist agents and MCP packaging patterns outperform this repo's broader agent and skill-routing system?

## Hypothesis
The local agent system will already be stronger overall, but the external repo may package specialist roles and MCP install guidance more concisely.

## Method
Read the two external agent files and the README package section, then compared them to local agent contracts and `skill_advisor.py`.

## Evidence
- The external repo defines two narrow agents only: `code-reviewer` and `test-writer`, each with short tool lists and crisp role/output expectations. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/agents/code-reviewer.md:1-6] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/agents/code-reviewer.md:18-39] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/agents/test-writer.md:1-6] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/agents/test-writer.md:8-16] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/agents/test-writer.md:32-60]
- The external README also packages MCP integrations as end-user workflow decisions, including ClassMCP and StrictDB-MCP install commands and when each package is auto-included. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/README.md:197-215]
- The local repo already has a much broader agent set with explicit contracts for deep research, handover, and session priming, including LEAF-only rules, recovery behavior, and output verification. [SOURCE: .opencode/agent/deep-research.md:22-32] [SOURCE: .opencode/agent/deep-research.md:36-43] [SOURCE: .opencode/agent/context-prime.md:22-39] [SOURCE: .opencode/agent/context-prime.md:57-65] [SOURCE: .opencode/agent/handover.md:22-31] [SOURCE: .opencode/agent/handover.md:40-58]
- Local skill routing is already formalized through `skill_advisor.py`, which exists specifically to recommend skills using thresholds, synonyms, and intent boosters. [SOURCE: .opencode/skill/scripts/skill_advisor.py:7-16] [SOURCE: .opencode/skill/scripts/skill_advisor.py:32-45] [SOURCE: .opencode/skill/scripts/skill_advisor.py:67-84] [SOURCE: .opencode/skill/scripts/skill_advisor.py:211-218] [SOURCE: .opencode/skill/scripts/skill_advisor.py:221-260]

## Analysis
Directly importing the external agent model would be a regression: `system-spec-kit` already has richer specialization, better stateful workflows, and explicit routing. The external value is not architectural depth; it is brevity. Each external agent communicates role, tool budget, and output style in a few lines. The MCP package section is similarly useful as a packaging pattern: it turns optional integrations into concrete operator guidance. So the right lesson is "borrow concise contracts and install guidance," not "adopt the tiny agent model."

## Conclusion
confidence: high

finding: `system-spec-kit` should reject direct adoption of the external mini-agent architecture, but it should borrow the concise-contract style for agent docs and the plain-language MCP packaging pattern for integration documentation.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/agent/`
- **Change type:** rejected
- **Blast radius:** medium
- **Prerequisites:** none for the rejection; a separate follow-on could selectively tighten local agent intros and MCP install docs
- **Priority:** rejected

## Counter-evidence sought
I looked for evidence that the external repo had a hidden broader routing layer comparable to local skills plus agents. The reviewed sources only showed the two small agents and README-level package guidance.

## Follow-up questions for next iteration
None. This iteration closes the planned coverage across rulebook, MDD, hooks, commands, observability, agents, and MCP packaging.
