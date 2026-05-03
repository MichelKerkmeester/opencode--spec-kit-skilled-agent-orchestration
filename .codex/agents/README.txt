AGENTS DIRECTORY
================

This directory contains agent definitions for the OpenCode Copilot runtime.
Each .md file defines one agent with frontmatter (tools, permissions, model)
and behavioral instructions.

Mirrored to: .claude/agents/, .gemini/agents/, .codex/agents/

Agents:
  code          — Application-code implementation (write-capable LEAF; sk-code stack delegation)
  create-doc    — /create:* documentation executor (write-capable LEAF; sk-doc templates; caller-restricted)
  context       — Retrieval-first codebase exploration
  debug         — Fresh-perspective debugging
  deep-research — Autonomous research iterations
  deep-review   — Autonomous code review iterations
  handover      — Session continuation
  orchestrate   — Multi-agent coordination
  review        — Code review (read-only)
  speckit       — Spec folder documentation
  multi-ai-council   — Multi-strategy planning
  improve-prompt — Prompt engineering
