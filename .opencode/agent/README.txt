AGENTS DIRECTORY
================

This directory contains agent definitions for the OpenCode runtime.
Each .md file defines one live agent surface with frontmatter (tools, permissions, model)
and behavioral instructions.

Sibling runtimes: .claude/agents/ (.md), .gemini/agents/ (.md), .codex/agents/ (.toml)
Inventory rule: if an agent file is not present in this directory, it is not a live runtime surface here.

Agents:
  code          — Application-code implementation (write-capable LEAF; sk-code stack delegation)
  create    — /create:* documentation executor (write-capable LEAF; sk-doc templates; caller-restricted)
  context       — Retrieval-first codebase exploration
  debug         — Fresh-perspective debugging
  deep-research — Autonomous research iterations
  deep-review   — Autonomous code review iterations
  improve-agent — Evaluator-first bounded agent improvement
  improve-prompt — Prompt engineering
  orchestrate   — Multi-agent coordination
  review        — Code review (read-only)
  multi-ai-council   — Multi-strategy planning
