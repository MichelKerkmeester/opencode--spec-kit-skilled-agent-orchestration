#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: SKILL ADVISOR
# ───────────────────────────────────────────────────────────────

"""
Skill Advisor - Analyzes user requests and recommends appropriate skills.
Used by Gate 2 in AGENTS.md for skill routing.

Usage: python skill_advisor.py "user request" [--threshold 0.8]
Output: JSON array of skill recommendations with confidence scores

Options:
    --health      Run health check diagnostics
    --threshold   Filter results to only show recommendations >= threshold (default: 0.0)
"""
import sys
import json
import os
import re
import glob
import argparse
from typing import Any, Dict, List, Optional


# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────

# Path to skill directory.
# This script lives in .opencode/skill/scripts/, so skills are in the parent dir.
SCRIPT_DIR = os.path.dirname(os.path.realpath(__file__))
SKILLS_DIR = os.path.dirname(SCRIPT_DIR)

# Comprehensive stop words - filtered from BOTH query AND corpus
# These words have no semantic meaning for skill matching
STOP_WORDS = frozenset({
    'a', 'about', 'able', 'actually', 'agent', 'all', 'also', 'an', 'and', 'any',
    'are', 'as', 'at', 'be', 'been', 'being', 'but', 'by', 'can', 'could', 'did',
    'do', 'does', 'even', 'for', 'from', 'get', 'give', 'go', 'going', 'had',
    'has', 'have', 'he', 'help', 'her', 'him', 'how', 'i', 'if', 'in', 'into',
    'is', 'it', 'its', 'just', 'let', 'like', 'may', 'me', 'might', 'more',
    'most', 'must', 'my', 'need', 'no', 'not', 'now', 'of', 'on', 'only', 'or',
    'other', 'our', 'please', 'really', 'she', 'should', 'skill',
    'so', 'some', 'tell', 'that', 'the', 'them', 'then', 'these', 'they',
    'thing', 'things', 'this', 'those', 'to', 'tool', 'try', 'us',
    'used', 'using', 'very', 'want', 'was', 'way', 'we', 'were', 'what', 'when',
    'where', 'which', 'who', 'why', 'will', 'with', 'would', 'you', 'your'
})

# Synonym expansion - maps user intent to technical terms in SKILL.md
SYNONYM_MAP = {
    # Code structure & analysis
    "ast": ["treesitter", "syntax", "parse", "structure"],
    "codebase": ["code", "project", "repository", "source"],
    "functions": ["methods", "definitions", "symbols"],
    "classes": ["types", "definitions", "structure"],
    "symbols": ["definitions", "functions", "classes", "exports"],
    
    # Git & version control
    "branch": ["git", "commit", "merge", "checkout"],
    "commit": ["git", "version", "push", "branch", "changes"],
    "merge": ["git", "branch", "commit", "rebase"],
    "push": ["git", "commit", "remote", "branch"],
    "rebase": ["git", "branch", "commit", "history"],
    "stash": ["git", "changes", "temporary"],
    "worktree": ["git", "branch", "workspace", "isolation"],
    "git": ["commit", "branch", "version", "push", "merge", "worktree"],
    "pull": ["git", "fetch", "merge", "remote"],
    "clone": ["git", "repository", "download"],
    
    # Memory & context preservation
    "context": ["memory", "session", "save"],
    "remember": ["memory", "context", "save", "store"],
    "save": ["context", "memory", "preserve", "store"],
    "recall": ["memory", "search", "find", "retrieve"],
    "forget": ["memory", "delete", "remove"],
    "checkpoint": ["memory", "save", "restore", "backup"],
    "history": ["memory", "context", "past", "previous"],
    "memory": ["context", "session", "save", "store", "database", "vector", "embedding", "index"],
    "session": ["memory", "context", "conversation"],
    "preserve": ["memory", "save", "context", "store"],
    "store": ["memory", "save", "context", "persist"],
    
    # Documentation
    "doc": ["documentation", "explain", "describe", "markdown"],
    "docs": ["documentation", "explain", "describe", "markdown"],
    "document": ["documentation", "markdown", "write"],
    "write": ["documentation", "create", "generate"],
    "readme": ["documentation", "markdown", "explain"],
    "flowchart": ["documentation", "diagram", "ascii"],
    "diagram": ["documentation", "flowchart", "visual"],
    
    # Spec & planning
    "plan": ["spec", "architect", "design", "roadmap", "breakdown"],
    "spec": ["specification", "plan", "document", "folder"],
    "folder": ["spec", "directory", "create", "organize"],
    "scaffold": ["create", "generate", "new", "template"],
    "template": ["scaffold", "create", "generate"],
    
    # Debugging & browser
    "bug": ["debug", "error", "issue", "defect", "verification"],
    "console": ["chrome", "browser", "debug", "log"],
    "devtools": ["chrome", "browser", "debug", "inspect"],
    "network": ["chrome", "browser", "requests", "debug"],
    "inspect": ["chrome", "browser", "debug", "devtools"],
    "breakpoint": ["debug", "chrome", "devtools"],
    "screenshot": ["capture", "image", "browser", "chrome", "devtools"],
    "error": ["bug", "debug", "fix", "issue"],
    "issue": ["bug", "debug", "error", "problem"],

    # Web development, accessibility & cross-cutting concerns
    "layout": ["css", "frontend", "responsive", "grid", "flexbox"],
    "accessibility": ["aria", "wcag", "a11y", "semantic", "keyboard"],
    "aria": ["accessibility", "wcag", "a11y", "role", "label"],
    "audit": ["validate", "verify", "check", "review", "inspect"],
    "deployment": ["deploy", "release", "publish", "cdn", "build"],
    "handler": ["function", "callback", "listener", "event", "hook"],
    "export": ["download", "output", "generate", "har", "asset"],
    "toolchain": ["call_tool_chain", "code_mode", "utcp", "mcp"],
    "conflict": ["merge", "rebase", "resolution", "branch", "diverge"],

    # Gemini CLI & cross-AI
    "gemini": ["gemini-cli", "google-ai", "cross-ai", "second-opinion", "delegate"],

    # Search & discovery
    "find": ["search", "locate", "explore", "lookup"],
    "search": ["find", "locate", "explore", "query", "lookup"],
    "where": ["find", "search", "locate", "navigate"],
    "lookup": ["find", "search", "locate"],
    "explore": ["search", "find", "navigate", "discover"],
    "navigate": ["find", "search", "locate", "goto"],
    "locate": ["find", "search", "where"],
    
    # Actions & creation
    "create": ["implement", "build", "generate", "new", "add", "scaffold"],
    "make": ["create", "implement", "build", "generate"],
    "new": ["create", "implement", "scaffold", "generate"],
    "add": ["create", "implement", "new", "insert"],
    "build": ["create", "implement", "generate"],
    "generate": ["create", "build", "scaffold"],
    
    # Code quality & fixes
    "check": ["verify", "validate", "test"],
    "fix": ["debug", "correct", "resolve", "code", "implementation"],
    "refactor": ["structure", "organize", "clean", "improve", "code"],
    "test": ["verify", "validate", "check", "spec", "quality"],
    "verify": ["check", "validate", "test", "confirm"],
    "validate": ["check", "verify", "test"],
    
    # Prompt engineering
    "prompt": ["enhance", "improve", "optimize", "engineering", "framework"],
    "enhance": ["prompt", "improve", "optimize", "refine"],

    # Understanding & explanation
    "help": ["guide", "assist", "documentation", "explain"],
    "how": ["understand", "explain", "works", "meaning"],
    "what": ["definition", "structure", "outline", "list"],
    "why": ["understand", "explain", "reason", "purpose"],
    "explain": ["understand", "how", "works", "describe"],
    "understand": ["how", "explain", "learn", "works"],
    "works": ["how", "understand", "explain", "function"],
    
    # Display & output
    "show": ["list", "display", "outline", "tree"],
    "list": ["show", "display", "enumerate"],
    "display": ["show", "list", "output"],
    "print": ["show", "display", "output"],
}

# Intent boosters - High-confidence keyword → skill direct mapping
# These keywords strongly indicate a specific skill, adding bonus score
# Format: keyword -> (skill_name, boost_amount)
# NOTE: These are checked BEFORE stop word filtering, so question words work here
# Score formula: Two-tiered based on intent boost presence
#   - With intent boost: confidence = min(0.50 + score * 0.15, 0.95)
#   - Without intent boost: confidence = min(0.25 + score * 0.15, 0.95)
# To reach 0.8 threshold with intent boost: need score >= 2.0
INTENT_BOOSTERS = {
    # ─────────────────────────────────────────────────────────────────
    # SYSTEM-SPEC-KIT: Context preservation, recall, and specification
    # (Memory functionality merged into system-spec-kit)
    # ─────────────────────────────────────────────────────────────────
    "checkpoint": ("system-spec-kit", 0.6),
    "context": ("system-spec-kit", 0.6),
    "database": ("system-spec-kit", 0.4),
    "embedding": ("system-spec-kit", 0.5),
    "embeddings": ("system-spec-kit", 0.5),
    "forget": ("system-spec-kit", 0.4),
    "history": ("system-spec-kit", 0.4),
    "index": ("system-spec-kit", 0.4),
    "memory": ("system-spec-kit", 0.8),
    "preserve": ("system-spec-kit", 0.5),
    "recall": ("system-spec-kit", 0.6),
    "reindex": ("system-spec-kit", 0.6),
    "remember": ("system-spec-kit", 0.6),
    "restore": ("system-spec-kit", 0.4),
    "session": ("system-spec-kit", 0.4),
    "store": ("system-spec-kit", 0.4),
    "vector": ("system-spec-kit", 0.5),
    "voyage": ("system-spec-kit", 0.5),

    # ─────────────────────────────────────────────────────────────────
    # SYSTEM-SPEC-KIT: Specification and planning
    # ─────────────────────────────────────────────────────────────────
    "checklist": ("system-spec-kit", 0.5),
    "folder": ("system-spec-kit", 0.4),
    "plan": ("system-spec-kit", 0.5),
    "scaffold": ("system-spec-kit", 0.4),
    "spec": ("system-spec-kit", 0.6),
    "specification": ("system-spec-kit", 0.5),
    "speckit": ("system-spec-kit", 0.8),
    "task": ("system-spec-kit", 0.3),
    "tasks": ("system-spec-kit", 0.4),
    
    # ─────────────────────────────────────────────────────────────────
    # WORKFLOWS-GIT: Version control operations
    # ─────────────────────────────────────────────────────────────────
    "git": ("sk-git", 1.0),
    "branch": ("sk-git", 0.4),
    "checkout": ("sk-git", 0.5),
    "clone": ("sk-git", 0.5),
    "commit": ("sk-git", 0.5),
    "conflict": ("sk-git", 0.6),
    "deploy": ("sk-git", 0.5),
    "diff": ("sk-git", 0.5),
    "fetch": ("sk-git", 0.4),
    "gh": ("sk-git", 1.5),
    "github": ("sk-git", 2.0),
    "issue": ("sk-git", 0.8),
    "log": ("sk-git", 0.4),
    "merge": ("sk-git", 0.5),
    "pr": ("sk-git", 0.8),
    "pull": ("sk-git", 0.5),
    "push": ("sk-git", 0.5),
    "rebase": ("sk-git", 0.8),
    "repo": ("sk-git", 0.6),
    "repository": ("sk-git", 0.5),
    "stash": ("sk-git", 0.5),
    "worktree": ("sk-git", 1.2),

    # ─────────────────────────────────────────────────────────────────
    # SK-CODE--REVIEW: Stack-agnostic code review baseline
    # ─────────────────────────────────────────────────────────────────
    "review": ("sk-code--review", 1.2),
    "findings": ("sk-code--review", 1.1),
    "blocker": ("sk-code--review", 0.9),
    "blockers": ("sk-code--review", 0.9),
    "vulnerability": ("sk-code--review", 1.0),
    "regression": ("sk-code--review", 0.8),
    "audit": ("sk-code--review", 1.0),
    "solid": ("sk-code--review", 0.9),
    "readiness": ("sk-code--review", 0.8),

    # ─────────────────────────────────────────────────────────────────
    # MCP-CHROME-DEVTOOLS: Browser debugging
    # ─────────────────────────────────────────────────────────────────
    "bdg": ("mcp-chrome-devtools", 1.0),
    "breakpoint": ("mcp-chrome-devtools", 0.6),
    "browser": ("mcp-chrome-devtools", 1.2),
    "chrome": ("mcp-chrome-devtools", 1.0),
    "console": ("mcp-chrome-devtools", 1.0),
    "debug": ("mcp-chrome-devtools", 0.6),
    "debugger": ("mcp-chrome-devtools", 1.0),
    "devtools": ("mcp-chrome-devtools", 1.2),
    "dom": ("mcp-chrome-devtools", 0.5),
    "elements": ("mcp-chrome-devtools", 0.5),
    "inspect": ("mcp-chrome-devtools", 1.0),
    "network": ("mcp-chrome-devtools", 0.8),
    "performance": ("mcp-chrome-devtools", 0.5),
    "screenshot": ("mcp-chrome-devtools", 2.0),
    
    # ─────────────────────────────────────────────────────────────────
    # WORKFLOWS-DOCUMENTATION: Documentation and diagrams
    # ─────────────────────────────────────────────────────────────────
    "ascii": ("sk-doc", 0.4),
    "diagram": ("sk-doc", 0.4),
    "document": ("sk-doc", 0.5),
    "documentation": ("sk-doc", 0.6),
    "flowchart": ("sk-doc", 0.7),
    "markdown": ("sk-doc", 0.5),
    "readme": ("sk-doc", 0.5),
    "template": ("sk-doc", 0.4),

    # ─────────────────────────────────────────────────────────────────
    # SK-DOC-VISUAL: Visual HTML diagrams and pages
    # ─────────────────────────────────────────────────────────────────
    "visual": ("sk-doc-visual", 1.2),
    "visualization": ("sk-doc-visual", 1.0),
    "html": ("sk-doc-visual", 1.0),
    "mermaid": ("sk-doc-visual", 1.5),
    "architecture": ("sk-doc-visual", 0.8),
    "sequence": ("sk-doc-visual", 0.8),
    "chart": ("sk-doc-visual", 0.8),
    "timeline": ("sk-doc-visual", 0.8),
    "dashboard": ("sk-doc-visual", 0.6),
    "render": ("sk-doc-visual", 1.0),
    "explainer": ("sk-doc-visual", 0.9),
    "aesthetic": ("sk-doc-visual", 1.0),
    "recap": ("sk-doc-visual", 1.2),

    # ─────────────────────────────────────────────────────────────────
    # WORKFLOWS-CODE--WEB-DEV: Implementation and verification (frontend/Webflow)
    # ─────────────────────────────────────────────────────────────────
    "a11y": ("sk-code--web", 0.6),
    "accessibility": ("sk-code--web", 0.6),
    "animation": ("sk-code--web", 0.8),
    "aria": ("sk-code--web", 0.6),
    "bug": ("sk-code--web", 0.5),
    "css": ("sk-code--web", 0.9),
    "debugging": ("sk-code--web", 0.7),
    "error": ("sk-code--web", 0.4),
    "frontend": ("sk-code--web", 0.5),
    "implement": ("sk-code--web", 0.6),
    "layout": ("sk-code--web", 0.6),
    "networking": ("sk-code--web", 0.5),
    "refactor": ("sk-code--web", 0.5),
    "responsive": ("sk-code--web", 0.6),
    "tracing": ("sk-code--web", 0.5),
    "verification": ("sk-code--web", 0.5),
    "wcag": ("sk-code--web", 0.5),

    # ─────────────────────────────────────────────────────────────────
    # SK-CODE--OPENCODE: OpenCode system code standards
    # (JavaScript MCP, Python scripts, Shell scripts, JSONC configs)
    # ─────────────────────────────────────────────────────────────────
    "opencode": ("sk-code--opencode", 2.0),
    "mcp": ("sk-code--opencode", 1.5),
    "python": ("sk-code--opencode", 1.0),
    "shell": ("sk-code--opencode", 1.0),
    "bash": ("sk-code--opencode", 1.0),
    "jsonc": ("sk-code--opencode", 1.5),
    "shebang": ("sk-code--opencode", 1.2),
    "snake_case": ("sk-code--opencode", 1.0),
    "docstring": ("sk-code--opencode", 0.8),
    "jsdoc": ("sk-code--opencode", 0.8),
    "commonjs": ("sk-code--opencode", 1.0),
    "require": ("sk-code--opencode", 0.6),
    "strict": ("sk-code--opencode", 0.5),

    # ─────────────────────────────────────────────────────────────────
    # CLI-GEMINI: Cross-AI orchestration via Gemini CLI
    # ─────────────────────────────────────────────────────────────────
    "gemini": ("cli-gemini", 2.0),
    "grounding": ("cli-gemini", 1.0),

    # ─────────────────────────────────────────────────────────────────────────────────
    # CLI-CODEX: Cross-AI orchestration via OpenAI Codex CLI
    # ─────────────────────────────────────────────────────────────────────────────────
    "codex": ("cli-codex", 2.0),
    "openai-cli": ("cli-codex", 1.5),

    # ─────────────────────────────────────────────────────────────────────────────────
    # CLI-CLAUDE-CODE: Cross-AI orchestration via Anthropic Claude Code CLI
    # ─────────────────────────────────────────────────────────────────────────────────
    "claude-code": ("cli-claude-code", 2.0),
    "claude-cli": ("cli-claude-code", 1.5),
    "extended-thinking": ("cli-claude-code", 1.0),

    # ─────────────────────────────────────────────────────────────────────────────────
    # CLI-COPILOT: Cross-AI orchestration via GitHub Copilot CLI
    # ─────────────────────────────────────────────────────────────────────────────────
    "copilot": ("cli-copilot", 2.0),
    "copilot-cli": ("cli-copilot", 1.5),
    "cloud-delegation": ("cli-copilot", 1.0),

    # ─────────────────────────────────────────────────────────────────
    # MCP-CODE-MODE: External tool integration
    # ─────────────────────────────────────────────────────────────────
    "clickup": ("mcp-code-mode", 2.5),
    "cms": ("mcp-code-mode", 0.5),
    "component": ("mcp-code-mode", 0.4),
    "external": ("mcp-code-mode", 0.4),
    "figma": ("mcp-figma", 2.2),
    "notion": ("mcp-code-mode", 2.5),
    "page": ("mcp-code-mode", 0.4),
    "pages": ("mcp-code-mode", 0.4),
    "site": ("mcp-code-mode", 0.6),
    "sites": ("mcp-code-mode", 0.6),
    "toolchain": ("mcp-code-mode", 0.6),
    "typescript": ("sk-code--opencode", 0.8),
    "utcp": ("mcp-code-mode", 0.8),
    "webflow": ("mcp-code-mode", 2.5),

    # ─────────────────────────────────────────────────────────────────
    # SK-PROMPT-IMPROVER: Prompt engineering and enhancement
    # ─────────────────────────────────────────────────────────────────
    "prompt": ("sk-prompt-improver", 1.5),
    "prompts": ("sk-prompt-improver", 1.2),
    "enhance": ("sk-prompt-improver", 1.2),
    "rcaf": ("sk-prompt-improver", 2.0),
    "costar": ("sk-prompt-improver", 2.0),
    "tidd-ec": ("sk-prompt-improver", 2.0),
    "crispe": ("sk-prompt-improver", 2.0),
    "craft": ("sk-prompt-improver", 1.5),
    "depth": ("sk-prompt-improver", 1.5),
    "ricce": ("sk-prompt-improver", 1.5),
    "scoring": ("sk-prompt-improver", 0.8),
}

# Ambiguous keywords that should boost MULTIPLE skills
# Format: keyword -> list of (skill_name, boost_amount)
MULTI_SKILL_BOOSTERS = {
    "api": [("mcp-code-mode", 0.2), ("sk-code--web", 0.5), ("sk-code--full-stack", 0.4)],
    "audit": [("sk-code--review", 0.6), ("system-spec-kit", 0.3), ("mcp-chrome-devtools", 0.3), ("sk-code--web", 0.2)],
    "chain": [("mcp-code-mode", 0.3)],
    "changes": [("sk-git", 0.4), ("system-spec-kit", 0.2)],
    "css": [("sk-code--web", 0.6), ("mcp-chrome-devtools", 0.3)],
    "code": [("sk-code--web", 0.2), ("sk-code--full-stack", 0.2), ("sk-code--opencode", 0.1)],
    "context": [("system-spec-kit", 0.4)],
    "deployment": [("sk-code--web", 0.4), ("sk-git", 0.3)],
    "export": [("mcp-figma", 0.3), ("mcp-chrome-devtools", 0.2)],
    "fix": [("sk-code--web", 0.3), ("sk-code--full-stack", 0.3), ("sk-git", 0.1)],
    "handler": [("sk-code--web", 0.3), ("mcp-code-mode", 0.2)],
    "layout": [("sk-code--web", 0.5), ("mcp-chrome-devtools", 0.2)],
    "mobile": [("sk-code--web", 0.3), ("mcp-chrome-devtools", 0.2)],
    "mcp": [("mcp-code-mode", 0.3), ("sk-code--opencode", 0.4)],
    "plan": [("system-spec-kit", 0.3), ("sk-code--web", 0.2), ("sk-code--full-stack", 0.2)],
    "save": [("system-spec-kit", 0.4), ("sk-git", 0.2)],
    "script": [("sk-code--opencode", 0.4)],
    "server": [("sk-code--opencode", 0.3), ("mcp-code-mode", 0.2)],
    "session": [("system-spec-kit", 0.5)],
    "standards": [("sk-code--opencode", 0.4), ("sk-code--web", 0.2), ("sk-code--full-stack", 0.2)],
    "style": [("sk-code--opencode", 0.2), ("sk-code--web", 0.4), ("sk-code--full-stack", 0.3)],
    "task": [("system-spec-kit", 0.3)],
    "test": [("sk-code--web", 0.3), ("sk-code--full-stack", 0.3), ("mcp-chrome-devtools", 0.2)],
    "update": [("mcp-code-mode", 0.3), ("sk-git", 0.2), ("sk-code--web", 0.2), ("sk-code--full-stack", 0.2)],
    "diagram": [("sk-doc-visual", 0.6)],
    "flowchart": [("sk-doc-visual", 0.8)],
    "generate": [("sk-doc-visual", 0.4)],
    "table": [("sk-doc-visual", 0.3)],
    "review": [("sk-code--review", 0.8), ("sk-doc-visual", 0.3)],
    "delegate": [("cli-gemini", 0.5), ("cli-codex", 0.5), ("cli-claude-code", 0.5), ("cli-copilot", 0.5)],
    "opinion": [("cli-gemini", 0.3), ("cli-codex", 0.3), ("cli-claude-code", 0.3), ("cli-copilot", 0.3), ("sk-code--review", 0.2)],
    "validate": [("cli-gemini", 0.2), ("cli-codex", 0.2), ("cli-claude-code", 0.2), ("cli-copilot", 0.2), ("sk-code--review", 0.3)],
    "improve": [("sk-prompt-improver", 0.6), ("sk-code--web", 0.2)],
    "enhance": [("sk-prompt-improver", 0.8)],
    "refine": [("sk-prompt-improver", 0.6), ("sk-code--web", 0.2)],
    "framework": [("sk-prompt-improver", 0.5), ("sk-code--full-stack", 0.3)],
}

# Phrase-level intent boosters for high-signal multi-token requests
# Format: phrase -> list of (skill_name, boost_amount)
PHRASE_INTENT_BOOSTERS = {
    "create documentation": [("sk-doc", 1.0)],
    "code review": [("sk-code--review", 2.4)],
    "pr review": [("sk-code--review", 2.3), ("sk-git", 0.4)],
    "security review": [("sk-code--review", 2.2)],
    "review this pr": [("sk-code--review", 2.4)],
    "review this diff": [("sk-code--review", 2.2)],
    "quality gate": [("sk-code--review", 2.0)],
    "request changes": [("sk-code--review", 2.0)],
    "race conditions": [("sk-code--review", 1.5)],
    "auth bugs": [("sk-code--review", 1.5)],
    "code audit": [("sk-code--review", 2.2)],
    "audit this code": [("sk-code--review", 2.3)],
    "check this code": [("sk-code--review", 2.0)],
    "check for issues": [("sk-code--review", 2.0)],
    "solid violations": [("sk-code--review", 2.2)],
    "solid principles": [("sk-code--review", 2.0)],
    "merge readiness": [("sk-code--review", 2.2), ("sk-git", 0.4)],
    "ready to merge": [("sk-code--review", 2.2), ("sk-git", 0.4)],
    "implement feature": [("sk-code--web", 0.9)],
    "css animation": [("sk-code--web", 0.8)],
    "api network": [("sk-code--web", 0.7), ("mcp-chrome-devtools", 0.4)],
    "template level validation": [("system-spec-kit", 0.8)],
    "figma css": [("mcp-figma", 0.8), ("sk-code--web", 0.4)],
    "full stack typescript": [("sk-code--full-stack", 0.8), ("sk-code--opencode", 0.4)],
    "sk-code--review": [("sk-code--review", 2.8)],
    "/sk-code--review": [("sk-code--review", 2.8)],
    ".opencode/skill/sk-code--review": [("sk-code--review", 3.0)],
    "visual review": [("sk-doc-visual", 1.6), ("sk-code--review", 0.4)],
    # Explicit doc-visual intents and path references
    "sk-doc-visual": [("sk-doc-visual", 2.2)],
    "/doc-visual": [("sk-doc-visual", 2.2)],
    "styled html": [("sk-doc-visual", 1.8)],
    "html diagram": [("sk-doc-visual", 2.0)],
    "html page": [("sk-doc-visual", 1.5)],
    "generate html": [("sk-doc-visual", 1.2)],
    ".codex/skills/sk-doc-visual": [("sk-doc-visual", 2.8)],
    ".opencode/skill/sk-doc-visual": [("sk-doc-visual", 2.8)],
    # --- Gemini CLI cross-AI orchestration ---
    "use gemini": [("cli-gemini", 2.5)],
    "gemini cli": [("cli-gemini", 2.5)],
    "gemini agent": [("cli-gemini", 2.0)],
    "google search grounding": [("cli-gemini", 2.0)],
    "second opinion": [("cli-gemini", 1.5)],
    "cross-ai validation": [("cli-gemini", 2.0)],
    "cross-ai review": [("cli-gemini", 2.0), ("sk-code--review", 0.4)],
    "codebase investigator": [("cli-gemini", 2.0)],
    "delegate to gemini": [("cli-gemini", 2.5)],
    "cli-gemini": [("cli-gemini", 2.8)],
    "/cli-gemini": [("cli-gemini", 2.8)],
    ".opencode/skill/cli-gemini": [("cli-gemini", 3.0)],
    # --- Codex CLI cross-AI orchestration ---
    "use codex": [("cli-codex", 2.5)],
    "codex cli": [("cli-codex", 2.5)],
    "codex agent": [("cli-codex", 2.0)],
    "codex review": [("cli-codex", 2.0), ("sk-code--review", 0.4)],
    "cross-ai codex": [("cli-codex", 2.0)],
    "delegate to codex": [("cli-codex", 2.5)],
    "cli-codex": [("cli-codex", 2.8)],
    "/cli-codex": [("cli-codex", 2.8)],
    ".opencode/skill/cli-codex": [("cli-codex", 3.0)],
    # --- Claude Code CLI cross-AI orchestration ---
    "use claude code": [("cli-claude-code", 2.5)],
    "claude code cli": [("cli-claude-code", 2.5)],
    "delegate to claude code": [("cli-claude-code", 2.5)],
    "extended thinking": [("cli-claude-code", 2.0)],
    "deep reasoning": [("cli-claude-code", 1.5)],
    "claude code review": [("cli-claude-code", 2.0), ("sk-code--review", 0.4)],
    "cross-ai claude": [("cli-claude-code", 2.0)],
    "cli-claude-code": [("cli-claude-code", 2.8)],
    "/cli-claude-code": [("cli-claude-code", 2.8)],
    ".opencode/skill/cli-claude-code": [("cli-claude-code", 3.0)],
    # --- Copilot CLI cross-AI orchestration ---
    "use copilot": [("cli-copilot", 2.5)],
    "copilot cli": [("cli-copilot", 2.5)],
    "delegate to copilot": [("cli-copilot", 2.5)],
    "cloud delegation": [("cli-copilot", 2.0)],
    "copilot plan mode": [("cli-copilot", 2.0)],
    "copilot agent": [("cli-copilot", 2.0)],
    "copilot autopilot": [("cli-copilot", 2.0)],
    "cli-copilot": [("cli-copilot", 2.8)],
    "/cli-copilot": [("cli-copilot", 2.8)],
    ".opencode/skill/cli-copilot": [("cli-copilot", 3.0)],
    # --- Prompt Improver: prompt engineering and enhancement ---
    "improve my prompt": [("sk-prompt-improver", 2.5)],
    "improve this prompt": [("sk-prompt-improver", 2.5)],
    "enhance this prompt": [("sk-prompt-improver", 2.5)],
    "enhance my prompt": [("sk-prompt-improver", 2.5)],
    "prompt engineering": [("sk-prompt-improver", 2.5)],
    "prompt improvement": [("sk-prompt-improver", 2.5)],
    "create a prompt": [("sk-prompt-improver", 2.0)],
    "optimize this prompt": [("sk-prompt-improver", 2.2)],
    "optimize prompt": [("sk-prompt-improver", 2.2)],
    "refine this prompt": [("sk-prompt-improver", 2.2)],
    "clear scoring": [("sk-prompt-improver", 2.0)],
    "depth processing": [("sk-prompt-improver", 2.0)],
    "sk-prompt-improver": [("sk-prompt-improver", 2.8)],
    "/sk-prompt-improver": [("sk-prompt-improver", 2.8)],
    ".opencode/skill/sk-prompt-improver": [("sk-prompt-improver", 3.0)],
}


# ───────────────────────────────────────────────────────────────
# 2. SKILL LOADING
# ───────────────────────────────────────────────────────────────

def parse_frontmatter(file_path: str) -> Optional[Dict[str, str]]:
    """Extract name and description fields from SKILL.md frontmatter."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            match = re.search(r'^---\s*\n(.*?)\n---', content, re.DOTALL)
            if match:
                yaml_block = match.group(1)
                data = {}
                for line in yaml_block.split('\n'):
                    if ':' in line:
                        key, val = line.split(':', 1)
                        val = val.strip()
                        # Remove one matching pair of quotes (preserves inner content)
                        if len(val) >= 2 and val[0] == val[-1] and val[0] in ('"', "'"):
                            val = val[1:-1]
                        data[key.strip()] = val
                return data
    except (OSError, UnicodeDecodeError, ValueError) as exc:
        print(
            f"Warning: Failed to parse frontmatter from {file_path} "
            f"({type(exc).__name__}: {exc})",
            file=sys.stderr,
        )
        return None
    return None


def get_skills() -> Dict[str, Dict[str, Any]]:
    """Scan the skills directory and return discovered skill configurations."""
    skills = {}
    
    if os.path.exists(SKILLS_DIR):
        for skill_file in glob.glob(os.path.join(SKILLS_DIR, "*/SKILL.md")):
            meta = parse_frontmatter(skill_file)
            if meta and 'name' in meta:
                skills[meta['name']] = {
                    "description": meta.get('description', ''),
                }
    
    # Hardcoded command bridges (slash commands)
    skills["command-spec-kit"] = {
        "description": "Create specifications and plans using /spec_kit slash command for new features or complex changes.",
    }

    skills["command-memory-save"] = {
        "description": "Save conversation context to memory using /memory:save.",
    }

    return skills


def expand_query(prompt_tokens: List[str]) -> List[str]:
    """Expand user tokens with synonyms for better matching."""
    expanded = set(prompt_tokens)
    for token in prompt_tokens:
        if token in SYNONYM_MAP:
            expanded.update(SYNONYM_MAP[token])
    return list(expanded)


# ───────────────────────────────────────────────────────────────
# 3. SCORING
# ───────────────────────────────────────────────────────────────

def calculate_confidence(score: float, has_intent_boost: bool) -> float:
    """
    Calculate confidence score using two-tiered formula.

    The formula distinguishes between queries that match explicit intent keywords
    (INTENT_BOOSTERS) versus those that only match description corpus terms.

    With intent boost (keyword directly matched in INTENT_BOOSTERS):
        confidence = min(0.50 + score * 0.15, 0.95)
        Examples:
        - score=2.0 → 0.80 (meets 0.8 threshold)
        - score=3.0 → 0.95 (max)
        - score=4.0 → 0.95 (capped)

    Without intent boost (corpus matching only):
        confidence = min(0.25 + score * 0.15, 0.95)
        Examples:
        - score=2.0 → 0.55 (below threshold)
        - score=3.0 → 0.70 (below threshold)
        - score=4.0 → 0.85 (meets threshold)
        - score=5.0 → 0.95 (capped)

    The 0.8 threshold in Gate 2 means:
    - With intent boost: Only needs score >= 2.0 to trigger skill routing
    - Without intent boost: Needs score >= 4.0 to trigger skill routing

    This design favors explicit domain keywords while remaining conservative
    for generic corpus matches that may be coincidental.

    Args:
        score: Accumulated match score from corpus matching and intent boosters.
               Higher scores come from matching more terms or important keywords.
        has_intent_boost: Whether an INTENT_BOOSTER keyword was matched.
                         True enables the higher-confidence formula.

    Returns:
        float: Confidence score between 0.0 and 0.95
    """
    if has_intent_boost:
        # Intent booster matched - higher confidence curve
        confidence = min(0.50 + score * 0.15, 0.95)
    else:
        # No explicit boosters - conservative (corpus matches only)
        confidence = min(0.25 + score * 0.15, 0.95)

    return confidence


def calculate_uncertainty(num_matches: int, has_intent_boost: bool, num_ambiguous_matches: int) -> float:
    """
    Calculate uncertainty score for skill recommendation.

    Uncertainty measures "how much we don't know" - separate from confidence.
    High confidence + high uncertainty = "confident ignorance" (dangerous state).

    Formula factors:
    - Fewer matches = higher uncertainty (less evidence)
    - No intent boost = higher uncertainty (less clear intent)
    - More ambiguous matches = higher uncertainty (competing interpretations)

    Examples:
    - 5 matches, intent boost, 0 ambiguous: 0.15 (LOW - proceed)
    - 3 matches, intent boost, 1 ambiguous: 0.35 (LOW - proceed)
    - 1 match, no intent boost, 0 ambiguous: 0.55 (MEDIUM - verify)
    - 1 match, no intent boost, 2 ambiguous: 0.75 (HIGH - clarify)
    - 0 matches, no intent boost, 0 ambiguous: 0.85 (HIGH - clarify)

    Args:
        num_matches: Total number of keyword/corpus matches found.
        has_intent_boost: Whether an INTENT_BOOSTER keyword was matched.
        num_ambiguous_matches: Count of MULTI_SKILL_BOOSTER matches (ambiguous keywords).

    Returns:
        float: Uncertainty score between 0.0 and 1.0
               <= 0.35: LOW (proceed)
               0.36-0.60: MEDIUM (verify first)
               > 0.60: HIGH (require clarification)
    """
    # Base uncertainty decreases with more matches
    if num_matches >= 5:
        base_uncertainty = 0.15
    elif num_matches >= 3:
        base_uncertainty = 0.20
    elif num_matches >= 1:
        base_uncertainty = 0.30
    else:
        base_uncertainty = 0.70

    # No intent boost increases uncertainty (less clear intent)
    intent_penalty = 0.0 if has_intent_boost else 0.15

    # Ambiguous matches increase uncertainty (competing interpretations)
    ambiguity_penalty = min(num_ambiguous_matches * 0.08, 0.24)

    uncertainty = min(base_uncertainty + intent_penalty + ambiguity_penalty, 1.0)
    return round(uncertainty, 2)


def passes_dual_threshold(
    confidence: float,
    uncertainty: float,
    conf_threshold: float = 0.8,
    uncert_threshold: float = 0.35,
) -> bool:
    """
    Check if recommendation passes dual-threshold validation.

    READINESS = (confidence >= threshold) AND (uncertainty <= uncert_threshold)

    Note on thresholds:
    - AGENTS.md Gate 1 defines READINESS as: (confidence >= 0.70) AND (uncertainty <= 0.35)
    - Gate 3 skill routing uses conf_threshold=0.8 (stricter for routing decisions)
    - The uncertainty threshold of 0.35 matches AGENTS.md exactly

    Args:
        confidence: Confidence score (0.0-1.0)
        uncertainty: Uncertainty score (0.0-1.0)
        conf_threshold: Minimum confidence required (default 0.8 for skill routing)
        uncert_threshold: Maximum uncertainty allowed (default 0.35 per AGENTS.md)

    Returns:
        bool: True if both thresholds pass
    """
    return confidence >= conf_threshold and uncertainty <= uncert_threshold


# ───────────────────────────────────────────────────────────────
# 4. ANALYSIS
# ───────────────────────────────────────────────────────────────

def analyze_request(prompt: str) -> List[Dict[str, Any]]:
    """Analyze user request and return ranked skill recommendations."""
    if not prompt:
        return []

    prompt_lower = prompt.lower()
    all_tokens = re.findall(r'\b\w+\b', prompt_lower)
    skills = get_skills()

    # Intent boosts calculated BEFORE stop word filtering - question words (how, why, what)
    # are important signals for semantic search but would otherwise be filtered
    skill_boosts = {}
    boost_reasons = {}
    for token in all_tokens:
        if token in INTENT_BOOSTERS:
            skill, boost = INTENT_BOOSTERS[token]
            skill_boosts[skill] = skill_boosts.get(skill, 0) + boost
            if skill not in boost_reasons:
                boost_reasons[skill] = []
            boost_reasons[skill].append(f"!{token}")

        if token in MULTI_SKILL_BOOSTERS:
            for skill, boost in MULTI_SKILL_BOOSTERS[token]:
                skill_boosts[skill] = skill_boosts.get(skill, 0) + boost
                if skill not in boost_reasons:
                    boost_reasons[skill] = []
                boost_reasons[skill].append(f"!{token}(multi)")

    for phrase, boosts in PHRASE_INTENT_BOOSTERS.items():
        if phrase in prompt_lower:
            for skill, boost in boosts:
                skill_boosts[skill] = skill_boosts.get(skill, 0) + boost
                if skill not in boost_reasons:
                    boost_reasons[skill] = []
                boost_reasons[skill].append(f"!{phrase}(phrase)")

    # Strongly prefer the explicitly named skill when users mention it directly.
    # This protects routing in mixed prompts that also contain broad terms like "opencode".
    for skill_name in skills:
        skill_lower = skill_name.lower()
        variants = {
            skill_lower,
            f"${skill_lower}",
            f"/{skill_lower}",
            skill_lower.replace('-', ' '),
            skill_lower.replace('-', '_'),
        }
        matched_variants = sorted({v for v in variants if v in prompt_lower})
        if not matched_variants:
            continue

        explicit_boost = 2.5 + 0.3 * (len(matched_variants) - 1)
        skill_boosts[skill_name] = skill_boosts.get(skill_name, 0) + explicit_boost
        if skill_name not in boost_reasons:
            boost_reasons[skill_name] = []
        for variant in matched_variants:
            boost_reasons[skill_name].append(f"!{variant}(explicit)")

    # Stop words filtered for corpus matching only
    tokens = [t for t in all_tokens if t not in STOP_WORDS and len(t) > 2]

    if not tokens and not skill_boosts:
        return []

    search_terms = expand_query(tokens) if tokens else []
    recommendations = []
    for name, config in skills.items():
        score = skill_boosts.get(name, 0)
        matches = boost_reasons.get(name, []).copy()

        name_parts = name.replace('-', ' ').split()
        desc_parts = re.findall(r'\b\w+\b', config['description'].lower())
        corpus = set(desc_parts)
        corpus = {k for k in corpus if len(k) > 2 and k not in STOP_WORDS}
        name_parts_filtered = [p for p in name_parts if p not in STOP_WORDS and len(p) > 2]

        for term in search_terms:
            if term in name_parts_filtered:
                score += 1.5
                matches.append(f"{term}(name)")
            elif term in corpus:
                score += 1.0
                matches.append(term)
            elif len(term) >= 4:
                for corpus_word in corpus:
                    if len(corpus_word) >= 4 and (term in corpus_word or corpus_word in term):
                        score += 0.5
                        matches.append(f"{term}~")
                        break

        if score > 0:
            total_intent_boost = skill_boosts.get(name, 0)
            has_boost = total_intent_boost > 0
            confidence = calculate_confidence(
                score=score,
                has_intent_boost=has_boost,
            )

            num_matches = len(matches)
            num_ambiguous = sum(1 for m in matches if '(multi)' in m)
            uncertainty = calculate_uncertainty(
                num_matches=num_matches,
                has_intent_boost=has_boost,
                num_ambiguous_matches=num_ambiguous
            )

            passes = passes_dual_threshold(confidence, uncertainty)

            recommendations.append({
                "skill": name,
                "confidence": round(confidence, 2),
                "uncertainty": uncertainty,
                "passes_threshold": passes,
                "reason": f"Matched: {', '.join(list(set(matches))[:5])}",
                "_score": round(score, 4),
                "_explicit_skill_match": any('(explicit)' in m for m in matches),
            })

    ranked = sorted(
        recommendations,
        key=lambda x: (x['_explicit_skill_match'], x['confidence'], x['_score']),
        reverse=True,
    )

    # Internal sort metadata should not leak in advisor output.
    for rec in ranked:
        rec.pop('_score', None)
        rec.pop('_explicit_skill_match', None)

    return ranked


# ───────────────────────────────────────────────────────────────
# 5. DIAGNOSTICS
# ───────────────────────────────────────────────────────────────

def load_all_skills() -> List[Dict[str, Any]]:
    """Load all skills for diagnostics."""
    skills = []
    if os.path.exists(SKILLS_DIR):
        for skill_file in glob.glob(os.path.join(SKILLS_DIR, "*/SKILL.md")):
            meta = parse_frontmatter(skill_file)
            if meta:
                skills.append(meta)
    return skills


def health_check() -> Dict[str, Any]:
    """Return skill count and status for diagnostics."""
    skills = load_all_skills()
    return {
        "status": "ok" if skills else "error",
        "skills_found": len(skills),
        "skill_names": [s.get('name', 'unknown') for s in skills],
        "skills_dir": SKILLS_DIR,
        "skills_dir_exists": os.path.exists(SKILLS_DIR)
    }


# ───────────────────────────────────────────────────────────────
# 6. CLI ENTRY POINT
# ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description='Analyze user requests and recommend appropriate skills.',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
Examples:
  python skill_advisor.py "how does authentication work"
  python skill_advisor.py "create a git commit" --threshold 0.8
  python skill_advisor.py --health
        '''
    )
    parser.add_argument('prompt', nargs='?', default='',
                        help='User request to analyze')
    parser.add_argument('--health', action='store_true',
                        help='Run health check diagnostics')
    parser.add_argument('--threshold', type=float, default=None,
                        help='Confidence threshold for recommendations (typical: 0.8). When explicitly set, uses confidence-only filtering (bypasses dual-threshold uncertainty check).')
    parser.add_argument('--uncertainty', type=float, default=1.0,
                        help='Maximum uncertainty threshold for recommendations (default: 1.0, typical: 0.5)')
    parser.add_argument('--show-rejections', action='store_true',
                        help='Include recommendations that failed dual-threshold validation')

    args = parser.parse_args()
    
    if args.health:
        print(json.dumps(health_check(), indent=2))
        sys.exit(0)
    
    if not args.prompt:
        print(json.dumps([]))
        sys.exit(0)
    
    results = analyze_request(args.prompt)

    # Determine filtering mode based on whether --threshold was explicitly passed.
    # When explicit: confidence-only filtering (user override — matches AGENTS.md Gate 2:
    #   "confidence >= 0.8 → MUST invoke"). The dual-threshold uncertainty check is bypassed.
    # When implicit (None): use dual-threshold passes_threshold field as the filter.
    explicit_threshold = args.threshold is not None

    if explicit_threshold:
        # User explicitly set --threshold: filter by confidence alone
        results = [r for r in results if r['confidence'] >= args.threshold]
    elif not args.show_rejections:
        # No explicit threshold: use dual-threshold (confidence + uncertainty)
        results = [r for r in results if r.get('passes_threshold', True)]

    # Apply uncertainty threshold filtering (only when explicitly set below 1.0)
    if args.uncertainty < 1.0:
        results = [r for r in results if r['uncertainty'] <= args.uncertainty]

    print(json.dumps(results, indent=2))
