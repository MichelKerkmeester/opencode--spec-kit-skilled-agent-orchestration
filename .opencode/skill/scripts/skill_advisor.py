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
    --threshold   Confidence threshold used by default dual-threshold filtering (default: 0.8)
    --confidence-only  Explicitly bypass uncertainty filtering
"""
import sys
import json
import os
import re
import argparse
import subprocess
import shutil
from typing import Any, Dict, List, Optional, Set


# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────

# Path to skill directory.
# This script lives in .opencode/skill/scripts/, so skills are in the parent dir.
SCRIPT_DIR = os.path.dirname(os.path.realpath(__file__))
SKILLS_DIR = os.path.dirname(SCRIPT_DIR)
REPO_ROOT = os.path.dirname(os.path.dirname(SKILLS_DIR))
LOCAL_CCC_BIN = os.path.join(
    SKILLS_DIR,
    "mcp-coco-index",
    "mcp_server",
    ".venv",
    "bin",
    "ccc",
)

RUNTIME_PATH = os.path.join(SCRIPT_DIR, "skill_advisor_runtime.py")
_RUNTIME_SPEC = None
_runtime_module = None
try:
    import importlib.util

    _RUNTIME_SPEC = importlib.util.spec_from_file_location("skill_advisor_runtime", RUNTIME_PATH)
    if _RUNTIME_SPEC and _RUNTIME_SPEC.loader:
        _runtime_module = importlib.util.module_from_spec(_RUNTIME_SPEC)
        _RUNTIME_SPEC.loader.exec_module(_runtime_module)
except Exception as _runtime_exc:  # pragma: no cover - startup safety
    _runtime_module = None

if _runtime_module is None:
    raise RuntimeError(f"Failed to load runtime helpers from {RUNTIME_PATH}")

get_cache_status = _runtime_module.get_cache_status
get_cached_skill_records = _runtime_module.get_cached_skill_records
parse_frontmatter_fast = _runtime_module.parse_frontmatter_fast

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

    # Autoresearch
    "autoresearch": ["research", "loop", "iterative", "deep", "autonomous", "convergence"],

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
    # SK-AUTORESEARCH: Autonomous deep research loop
    # ─────────────────────────────────────────────────────────────────
    "autoresearch": ("sk-deep-research", 2.0),
    "deep research": ("sk-deep-research", 1.5),
    "research loop": ("sk-deep-research", 1.5),
    "iterative research": ("sk-deep-research", 1.2),
    "convergence": ("sk-deep-research", 0.8),
    "autonomous research": ("sk-deep-research", 1.5),
    "deep review": ("sk-deep-research", 1.5),
    "review mode": ("sk-deep-research", 1.2),
    "iterative review": ("sk-deep-research", 1.2),
    "code audit": ("sk-deep-research", 1.0),
    "review loop": ("sk-deep-research", 1.2),

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
    "clickup": ("mcp-clickup", 2.5),
    "clickup-cli": ("mcp-clickup", 1.5),
    "cu": ("mcp-clickup", 2.0),
    "sprint": ("mcp-clickup", 1.0),
    "task-management": ("mcp-clickup", 1.0),
    "standup": ("mcp-clickup", 1.0),
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

    # ─────────────────────────────────────────────────────────────────
    # MCP-COCO-INDEX: Semantic code search via vector embeddings
    # ─────────────────────────────────────────────────────────────────
    "cocoindex": ("mcp-coco-index", 2.5),
    "ccc": ("mcp-coco-index", 2.0),
    "semantic": ("mcp-coco-index", 1.5),
    "vector search": ("mcp-coco-index", 2.0),
    "similar code": ("mcp-coco-index", 1.8),
    "concept search": ("mcp-coco-index", 2.0),
    "discover": ("mcp-coco-index", 0.6),
    "implementation": ("mcp-coco-index", 0.5),
}

# Ambiguous keywords that should boost MULTIPLE skills
# Format: keyword -> list of (skill_name, boost_amount)
MULTI_SKILL_BOOSTERS = {
    "api": [("mcp-code-mode", 0.2), ("sk-code--web", 0.5)],
    "audit": [("sk-code--review", 0.6), ("system-spec-kit", 0.3), ("mcp-chrome-devtools", 0.3), ("sk-code--web", 0.2)],
    "chain": [("mcp-code-mode", 0.3)],
    "changes": [("sk-git", 0.4), ("system-spec-kit", 0.2)],
    "discover": [("mcp-coco-index", 0.5)],
    "css": [("sk-code--web", 0.6), ("mcp-chrome-devtools", 0.3)],
    "code": [("sk-code--web", 0.2), ("sk-code--opencode", 0.1)],
    "context": [("system-spec-kit", 0.4)],
    "deployment": [("sk-code--web", 0.4), ("sk-git", 0.3)],
    "export": [("mcp-figma", 0.3), ("mcp-chrome-devtools", 0.2)],
    "fix": [("sk-code--web", 0.3), ("sk-git", 0.1)],
    "handler": [("sk-code--web", 0.3), ("mcp-code-mode", 0.2)],
    "layout": [("sk-code--web", 0.5), ("mcp-chrome-devtools", 0.2)],
    "mobile": [("sk-code--web", 0.3), ("mcp-chrome-devtools", 0.2)],
    "mcp": [("mcp-code-mode", 0.3), ("sk-code--opencode", 0.4)],
    "plan": [("system-spec-kit", 0.3), ("sk-code--web", 0.2)],
    "save": [("system-spec-kit", 0.4), ("sk-git", 0.2)],
    "script": [("sk-code--opencode", 0.4)],
    "server": [("sk-code--opencode", 0.3), ("mcp-code-mode", 0.2)],
    "session": [("system-spec-kit", 0.5)],
    "standards": [("sk-code--opencode", 0.4), ("sk-code--web", 0.2)],
    "style": [("sk-code--opencode", 0.2), ("sk-code--web", 0.4)],
    "task": [("system-spec-kit", 0.3)],
    "test": [("sk-code--web", 0.3), ("mcp-chrome-devtools", 0.2)],
    "update": [("mcp-code-mode", 0.3), ("sk-git", 0.2), ("sk-code--web", 0.2)],
    "review": [("sk-code--review", 0.8)],
    "delegate": [("cli-gemini", 0.5), ("cli-codex", 0.5), ("cli-claude-code", 0.5), ("cli-copilot", 0.5)],
    "opinion": [("cli-gemini", 0.3), ("cli-codex", 0.3), ("cli-claude-code", 0.3), ("cli-copilot", 0.3), ("sk-code--review", 0.2)],
    "validate": [("cli-gemini", 0.2), ("cli-codex", 0.2), ("cli-claude-code", 0.2), ("cli-copilot", 0.2), ("sk-code--review", 0.3)],
    "improve": [("sk-prompt-improver", 0.6), ("sk-code--web", 0.2)],
    "enhance": [("sk-prompt-improver", 0.8)],
    "refine": [("sk-prompt-improver", 0.6), ("sk-code--web", 0.2)],
    "framework": [("sk-prompt-improver", 0.5)],
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
    # --- Autoresearch deep research loop ---
    "deep research": [("sk-deep-research", 2.5)],
    "research loop": [("sk-deep-research", 2.5)],
    "autoresearch": [("sk-deep-research", 3.0)],
    "/autoresearch": [("sk-deep-research", 3.0)],
    "autonomous research": [("sk-deep-research", 2.5)],
    "iterative research": [("sk-deep-research", 2.5)],
    "multi-round research": [("sk-deep-research", 2.0)],
    "overnight research": [("sk-deep-research", 2.0)],
    # --- CocoIndex semantic code search ---
    "find code that": [("mcp-coco-index", 1.8)],
    "similar code": [("mcp-coco-index", 2.0)],
    "where is the logic": [("mcp-coco-index", 1.5)],
    "search codebase": [("mcp-coco-index", 2.2)],
    "code that handles": [("mcp-coco-index", 1.5)],
    "find implementations": [("mcp-coco-index", 2.0)],
    "find similar": [("mcp-coco-index", 1.8)],
    "semantic code search": [("mcp-coco-index", 2.5)],
    "how is.*implemented": [("mcp-coco-index", 1.2)],
    "how does.*work": [("mcp-coco-index", 1.0)],
    "convergence detection": [("sk-deep-research", 2.0)],
    # --- Deep review mode (iterative code audit) ---
    "deep review": [("sk-deep-research", 2.5)],
    "review loop": [("sk-deep-research", 2.5)],
    "iterative review": [("sk-deep-research", 2.5)],
    "code audit loop": [("sk-deep-research", 2.5)],
    "review mode": [("sk-deep-research", 2.0)],
    "release readiness review": [("sk-deep-research", 2.0)],
    "spec folder review": [("sk-deep-research", 2.0), ("sk-code--review", 0.8)],
    "review convergence": [("sk-deep-research", 2.5)],
    ":review": [("sk-deep-research", 3.0)],
    ":review:auto": [("sk-deep-research", 3.0)],
    ":review:confirm": [("sk-deep-research", 3.0)],
    "figma css": [("mcp-figma", 0.8), ("sk-code--web", 0.4)],
    "full stack typescript": [("sk-code--opencode", 0.8)],
    "sk-code--review": [("sk-code--review", 2.8)],
    "/sk-code--review": [("sk-code--review", 2.8)],
    ".opencode/skill/sk-code--review": [("sk-code--review", 3.0)],
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

DEFAULT_CONFIDENCE_THRESHOLD = 0.8
DEFAULT_UNCERTAINTY_THRESHOLD = 0.35

COMMAND_BRIDGES = {
    "command-spec-kit": {
        "description": "Create specifications and plans using /spec_kit slash command for new features or complex changes.",
        "slash_markers": ["/spec_kit", "spec_kit:"],
    },
    "command-memory-save": {
        "description": "Save conversation context to memory using /memory:save.",
        "slash_markers": ["/memory:save", "memory:save"],
    },
}

# ───────────────────────────────────────────────────────────────
# 1b. COCOINDEX SEMANTIC SEARCH CONFIGURATION
# ───────────────────────────────────────────────────────────────

# Multiplier applied to CocoIndex relevance score (0-1) to produce an advisor boost.
# With score=0.95 and multiplier=3.0 → boost=2.85 (enough for intent-boosted 0.80+ confidence).
SEMANTIC_BOOST_MULTIPLIER = 3.0

# Rank-decay factor: earlier results get more weight. Position 0 → 1.0, position 4 → 0.4.
SEMANTIC_RANK_DECAY = 0.15

# Subprocess timeout for built-in ccc search (seconds).
COCOINDEX_TIMEOUT = 5

# Max results from CocoIndex when using built-in search.
COCOINDEX_LIMIT = 5

AUTO_SEMANTIC_PHRASES = (
    "find code that",
    "search the codebase",
    "search the code base",
    "search semantically",
    "how does",
    "how is",
    "where is the logic",
    "where is",
    "implementation of",
    "implemented across",
    "patterns for",
    "graceful error",
)

AUTO_SEMANTIC_DISCOVERY_TOKENS = {
    "auth",
    "authentication",
    "authorization",
    "code",
    "codebase",
    "feature",
    "graceful",
    "implementation",
    "implemented",
    "logic",
    "middleware",
    "pattern",
    "patterns",
    "recovery",
    "retry",
}

AUTO_SEMANTIC_TRIGGER_TOKENS = {
    "find",
    "how",
    "search",
    "semantic",
    "where",
}

EXACT_MATCH_PHRASES = (
    "exact string",
    "exact text",
    "literal string",
    "regular expression",
    "regex pattern",
    "todo comments",
    "import statements",
    "find usages of",
    "find references to",
)

# Pattern to extract skill folder name from file paths within the skill directory.
_SKILL_PATH_RE = re.compile(r'\.opencode/skill/([^/]+)/')

INTENT_NORMALIZATION_RULES = {
    "review": {
        "phrases": ["code review", "pr review", "security review", "quality gate", "request changes"],
        "tokens": {"review", "audit", "regression", "findings", "readiness", "vulnerability"},
        "boosts": [("sk-code--review", 0.8)],
    },
    "implementation": {
        "phrases": ["implement feature", "fix bug", "refactor module", "build feature"],
        "tokens": {"implement", "fix", "refactor", "build", "bug", "feature"},
        "boosts": [("sk-code--web", 0.35)],
    },
    "documentation": {
        "phrases": ["create documentation", "write readme", "install guide", "markdown docs"],
        "tokens": {"documentation", "document", "readme", "markdown", "guide", "flowchart", "diagram"},
        "boosts": [("sk-doc", 0.45)],
    },
    "memory": {
        "phrases": ["save context", "save memory", "remember this", "restore checkpoint"],
        "tokens": {"memory", "context", "checkpoint", "remember", "restore", "session", "preserve"},
        "boosts": [("system-spec-kit", 0.6)],
    },
    "tooling": {
        "phrases": ["use mcp", "code mode", "chrome devtools", "use figma", "use webflow"],
        "tokens": {"mcp", "devtools", "chrome", "figma", "webflow", "clickup", "notion", "toolchain"},
        "boosts": [("mcp-code-mode", 0.3), ("mcp-chrome-devtools", 0.3), ("mcp-clickup", 0.3)],
    },
}


# ───────────────────────────────────────────────────────────────
# 2. SKILL LOADING
# ───────────────────────────────────────────────────────────────

def parse_frontmatter(file_path: str) -> Optional[Dict[str, str]]:
    """Extract frontmatter using fast parser (frontmatter-only reads)."""
    try:
        return parse_frontmatter_fast(file_path)
    except Exception as exc:  # pragma: no cover - safety fallback
        print(
            f"Warning: Failed to parse frontmatter from {file_path} "
            f"({type(exc).__name__}: {exc})",
            file=sys.stderr,
        )
        return None


def _normalize_terms(text: str) -> Set[str]:
    terms = re.findall(r'\b\w+\b', text.lower())
    return {term for term in terms if len(term) > 2 and term not in STOP_WORDS}


def _build_variants(skill_name: str) -> Set[str]:
    lowered = skill_name.lower()
    return {
        lowered,
        f"${lowered}",
        f"/{lowered}",
        lowered.replace('-', ' '),
        lowered.replace('-', '_'),
    }


def _build_inline_record(
    name: str,
    description: str,
    kind: str,
    source: str,
    path: Optional[str] = None,
    extra_variants: Optional[Set[str]] = None,
) -> Dict[str, Any]:
    variants = _build_variants(name)
    if extra_variants:
        variants.update(extra_variants)

    return {
        "name": name,
        "description": description,
        "kind": kind,
        "source": source,
        "path": path,
        "name_terms": _normalize_terms(name.replace('-', ' ')),
        "corpus_terms": _normalize_terms(description),
        "variants": variants,
    }


def get_skills(force_refresh: bool = False) -> Dict[str, Dict[str, Any]]:
    """Return skill + command records with cached discovery metadata."""
    skills = get_cached_skill_records(SKILLS_DIR, STOP_WORDS, force_refresh=force_refresh)

    for command_name, command_config in COMMAND_BRIDGES.items():
        markers = set(command_config.get("slash_markers", []))
        skills[command_name] = _build_inline_record(
            name=command_name,
            description=command_config["description"],
            kind="command",
            source="bridge",
            path=None,
            extra_variants=markers,
        )

    return skills


# ───────────────────────────────────────────────────────────────
# 2b. COCOINDEX SEMANTIC SEARCH
# ───────────────────────────────────────────────────────────────

def _resolve_skill_from_path(
    file_path: str,
    skills: Dict[str, Dict[str, Any]],
) -> Optional[str]:
    """Map a CocoIndex result file path to a known skill name.

    Extracts the skill folder name from paths like
    ``.opencode/skill/sk-git/SKILL.md`` and matches against loaded skills.
    """
    match = _SKILL_PATH_RE.search(file_path)
    if not match:
        return None
    folder_name = match.group(1)

    # Direct match (most common — folder name equals skill name)
    if folder_name in skills:
        return folder_name

    # Fallback: check if a skill's source path contains this folder
    for name, config in skills.items():
        skill_path = config.get("path", "")
        if skill_path and folder_name in skill_path:
            return name

    return None


def _cocoindex_search_builtin(
    query: str,
    project_root: str,
    limit: int = COCOINDEX_LIMIT,
) -> List[Dict[str, Any]]:
    """Run semantic search via ``ccc search`` and return parsed hits.

    Returns a list of ``{"path": str, "score": float}`` dicts.
    Falls back to an empty list on any error (binary missing, daemon down,
    timeout, unexpected output).

    Searches the entire codebase (no path filter) because skill SKILL.md
    files may not be indexed, but other files reference them.
    """
    ccc_bin = resolve_cocoindex_binary()
    if not ccc_bin:
        return []

    try:
        env = os.environ.copy()
        env["COCOINDEX_CODE_ROOT_PATH"] = project_root
        result = subprocess.run(
            [ccc_bin, "search", query, "--limit", str(limit * 2)],
            capture_output=True,
            text=True,
            timeout=COCOINDEX_TIMEOUT,
            cwd=project_root,
            env=env,
        )
        if result.returncode != 0:
            return []
        return _parse_ccc_output(result.stdout, limit)
    except (FileNotFoundError, subprocess.TimeoutExpired, OSError):
        return []


# Pattern for ``--- Result N (score: X.XXX) ---`` header lines.
_CCC_RESULT_RE = re.compile(r'---\s*Result\s+\d+\s*\(score:\s*([0-9.]+)\)\s*---')
# Pattern for ``File: path:lines [language]`` lines.
_CCC_FILE_RE = re.compile(r'^File:\s*(\S+)')


def _parse_ccc_output(stdout: str, limit: int = COCOINDEX_LIMIT) -> List[Dict[str, Any]]:
    """Extract skill references from ``ccc search`` text output.

    Output format per result::

        --- Result N (score: X.XXX) ---
        File: path/to/file.ext:start-end [language]
        <content snippet>

    We scan both the ``File:`` path AND the content snippet for
    ``.opencode/skill/<name>/`` references, mapping each to a skill hit.
    """
    hits: List[Dict[str, Any]] = []
    seen_folders: set = set()
    current_score: float = 0.5

    for line in stdout.splitlines():
        # Check for result header with score
        score_match = _CCC_RESULT_RE.match(line)
        if score_match:
            current_score = float(score_match.group(1))
            continue

        # Check for File: line — the file path itself might be a skill file
        file_match = _CCC_FILE_RE.match(line)
        if file_match:
            file_path = file_match.group(1)
            skill_match = _SKILL_PATH_RE.search(file_path)
            if skill_match:
                folder = skill_match.group(1)
                if folder not in seen_folders:
                    seen_folders.add(folder)
                    hits.append({"path": f".opencode/skill/{folder}/SKILL.md", "score": min(current_score, 1.0)})
            continue

        # Scan content lines for skill path references
        for skill_ref in _SKILL_PATH_RE.finditer(line):
            folder = skill_ref.group(1)
            if folder not in seen_folders:
                seen_folders.add(folder)
                hits.append({"path": f".opencode/skill/{folder}/SKILL.md", "score": min(current_score, 1.0)})

        if len(hits) >= limit:
            break

    return hits[:limit]


def _apply_semantic_boosts(
    semantic_hits: List[Dict[str, Any]],
    skills: Dict[str, Dict[str, Any]],
    skill_boosts: Dict[str, float],
    boost_reasons: Dict[str, List[str]],
) -> None:
    """Blend CocoIndex semantic search results into keyword scoring.

    Each hit contributes a boost proportional to its relevance score and
    inversely proportional to its rank position (earlier = more boost).
    Semantic hits are treated as intent evidence (``has_intent_boost=True``).
    """
    for rank, hit in enumerate(semantic_hits):
        path = hit.get("path", "")
        score = float(hit.get("score", 0.5))
        skill_name = _resolve_skill_from_path(path, skills)
        if not skill_name:
            continue

        # Rank decay: position 0 → 1.0, position 4 → 0.4
        rank_factor = max(0.3, 1.0 - rank * SEMANTIC_RANK_DECAY)
        boost = score * SEMANTIC_BOOST_MULTIPLIER * rank_factor

        skill_boosts[skill_name] = skill_boosts.get(skill_name, 0) + boost
        boost_reasons.setdefault(skill_name, []).append(
            f"!semantic(rank={rank + 1},score={score:.2f})"
        )


def resolve_cocoindex_binary() -> Optional[str]:
    """Return the preferred CocoIndex binary path, favoring the repo-local install."""
    if os.path.isfile(LOCAL_CCC_BIN) and os.access(LOCAL_CCC_BIN, os.X_OK):
        return LOCAL_CCC_BIN
    return shutil.which("ccc")


def is_exact_match_prompt(prompt_lower: str, tokens: List[str]) -> bool:
    """Return True when the prompt is explicitly asking for exact-text search."""
    if any(phrase in prompt_lower for phrase in EXACT_MATCH_PHRASES):
        return True
    exact_tokens = {"exact", "identifier", "identifiers", "literal", "regex", "regexp", "symbol", "symbols"}
    return bool(exact_tokens.intersection(tokens))


def should_auto_use_semantic_search(prompt: str) -> bool:
    """Decide whether semantic search should run automatically for this prompt."""
    prompt_lower = prompt.lower()
    tokens = re.findall(r'\b\w+\b', prompt_lower)

    if not prompt.strip():
        return False
    if is_exact_match_prompt(prompt_lower, tokens):
        return False
    if not resolve_cocoindex_binary():
        return False

    if any(phrase in prompt_lower for phrase in AUTO_SEMANTIC_PHRASES):
        return True

    token_set = set(tokens)
    return bool(AUTO_SEMANTIC_TRIGGER_TOKENS.intersection(token_set)) and bool(
        AUTO_SEMANTIC_DISCOVERY_TOKENS.intersection(token_set)
    )


def expand_query(prompt_tokens: List[str]) -> List[str]:
    """Expand user tokens with synonyms for better matching."""
    expanded = set(prompt_tokens)
    for token in prompt_tokens:
        if token in SYNONYM_MAP:
            expanded.update(SYNONYM_MAP[token])
    return list(expanded)


def detect_explicit_command_intent(prompt_lower: str) -> Optional[str]:
    """Return targeted command bridge when explicit slash markers are present."""
    for command_name, command_config in COMMAND_BRIDGES.items():
        for marker in command_config.get("slash_markers", []):
            if marker and marker in prompt_lower:
                return command_name
    return None


def apply_intent_normalization(
    prompt_lower: str,
    tokens: List[str],
    skill_boosts: Dict[str, float],
    boost_reasons: Dict[str, List[str]],
) -> List[str]:
    """Apply lightweight canonical intent boosts before main scoring."""
    detected: List[str] = []
    token_set = set(tokens)

    for intent_name, config in INTENT_NORMALIZATION_RULES.items():
        matched = any(phrase in prompt_lower for phrase in config["phrases"]) or bool(token_set.intersection(config["tokens"]))
        if not matched:
            continue

        detected.append(intent_name)
        for skill_name, boost in config["boosts"]:
            skill_boosts[skill_name] = skill_boosts.get(skill_name, 0.0) + boost
            boost_reasons.setdefault(skill_name, []).append(f"!intent:{intent_name}")

    return detected


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
    - Gate 2 skill routing typically uses conf_threshold=0.8 (stricter for routing decisions)
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


def apply_confidence_calibration(recommendations: List[Dict[str, Any]]) -> None:
    """Adjust confidence using score margin and ambiguity pressure."""
    if not recommendations:
        return

    ordered = sorted(recommendations, key=lambda item: item["_score"], reverse=True)
    score_map: Dict[str, float] = {}
    for index, current in enumerate(ordered):
        next_score = ordered[index + 1]["_score"] if index + 1 < len(ordered) else 0.0
        score_map[current["skill"]] = current["_score"] - next_score

    for recommendation in recommendations:
        confidence = recommendation["confidence"]
        num_matches = max(1, recommendation.get("_num_matches", 1))
        num_ambiguous = recommendation.get("_num_ambiguous", 0)
        margin = score_map.get(recommendation["skill"], 0.0)

        margin_penalty = 0.0
        if margin < 0.6:
            margin_penalty = min((0.6 - margin) * 0.2, 0.12)

        ambiguity_ratio = num_ambiguous / num_matches
        ambiguity_penalty = min(ambiguity_ratio * 0.1, 0.1)
        evidence_bonus = min(max(num_matches - 3, 0) * 0.01, 0.05)

        calibrated = confidence - margin_penalty - ambiguity_penalty + evidence_bonus
        recommendation["confidence"] = round(max(0.0, min(0.95, calibrated)), 2)


def filter_recommendations(
    recommendations: List[Dict[str, Any]],
    confidence_threshold: float,
    uncertainty_threshold: float,
    confidence_only: bool,
    show_rejections: bool,
) -> List[Dict[str, Any]]:
    """Filter recommendations under default dual-threshold or explicit confidence-only mode."""
    filtered: List[Dict[str, Any]] = []

    for recommendation in recommendations:
        passes = passes_dual_threshold(
            recommendation["confidence"],
            recommendation["uncertainty"],
            conf_threshold=confidence_threshold,
            uncert_threshold=uncertainty_threshold,
        )
        recommendation["passes_threshold"] = passes

        if confidence_only:
            if recommendation["confidence"] >= confidence_threshold:
                filtered.append(recommendation)
            continue

        if show_rejections or passes:
            filtered.append(recommendation)

    return filtered


# ───────────────────────────────────────────────────────────────
# 4. ANALYSIS
# ───────────────────────────────────────────────────────────────

def analyze_request(
    prompt: str,
    semantic_hits: Optional[List[Dict[str, Any]]] = None,
) -> List[Dict[str, Any]]:
    """Analyze user request and return ranked skill recommendations.

    Args:
        prompt: The user request text.
        semantic_hits: Optional CocoIndex search results as a list of
            ``{"path": str, "score": float}`` dicts. When provided, these
            are blended into keyword scoring as additional intent evidence.
    """
    if not prompt:
        return []

    prompt_lower = prompt.lower()
    all_tokens = re.findall(r'\b\w+\b', prompt_lower)
    skills = get_skills()
    explicit_command_intent = detect_explicit_command_intent(prompt_lower)

    # Intent boosts calculated BEFORE stop word filtering - question words (how, why, what)
    # are important signals for semantic search but would otherwise be filtered
    skill_boosts = {}
    boost_reasons = {}

    apply_intent_normalization(
        prompt_lower=prompt_lower,
        tokens=all_tokens,
        skill_boosts=skill_boosts,
        boost_reasons=boost_reasons,
    )

    if should_auto_use_semantic_search(prompt):
        skill_boosts["mcp-coco-index"] = skill_boosts.get("mcp-coco-index", 0.0) + 1.8
        boost_reasons.setdefault("mcp-coco-index", []).append("!intent:semantic-code-search")

    # Blend CocoIndex semantic search results when available
    if semantic_hits:
        _apply_semantic_boosts(semantic_hits, skills, skill_boosts, boost_reasons)

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
    for skill_name, config in skills.items():
        variants = set(config.get("variants", set())) or _build_variants(skill_name)
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
        score = skill_boosts.get(name, 0.0)
        matches = boost_reasons.get(name, []).copy()

        name_parts_filtered = set(config.get("name_terms", set())) or _normalize_terms(name.replace('-', ' '))
        corpus = set(config.get("corpus_terms", set())) or _normalize_terms(config["description"])
        kind = config.get("kind", "skill")

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

        if kind == "command" and explicit_command_intent != name:
            score -= 0.35
            if score > 0:
                matches.append("command_penalty")

        if score <= 0:
            continue

        total_intent_boost = skill_boosts.get(name, 0.0)
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

        if explicit_command_intent:
            kind_priority = 2 if name == explicit_command_intent else (1 if kind == "command" else 0)
        else:
            kind_priority = 1 if kind == "skill" else 0

        recommendations.append({
            "skill": name,
            "kind": kind,
            "confidence": round(confidence, 2),
            "uncertainty": uncertainty,
            "passes_threshold": False,
            "reason": f"Matched: {', '.join(sorted(set(matches))[:5])}",
            "_score": round(score, 4),
            "_explicit_skill_match": any('(explicit)' in m for m in matches),
            "_kind_priority": kind_priority,
            "_num_matches": num_matches,
            "_num_ambiguous": num_ambiguous,
        })

    apply_confidence_calibration(recommendations)

    for recommendation in recommendations:
        recommendation["passes_threshold"] = passes_dual_threshold(
            recommendation["confidence"],
            recommendation["uncertainty"],
            conf_threshold=DEFAULT_CONFIDENCE_THRESHOLD,
            uncert_threshold=DEFAULT_UNCERTAINTY_THRESHOLD,
        )

    ranked = sorted(
        recommendations,
        key=lambda x: (
            x['_kind_priority'],
            x['_explicit_skill_match'],
            x['passes_threshold'],
            x['confidence'],
            x['_score'],
        ),
        reverse=True,
    )

    # Internal sort metadata should not leak in advisor output.
    for rec in ranked:
        rec.pop('_score', None)
        rec.pop('_explicit_skill_match', None)
        rec.pop('_kind_priority', None)
        rec.pop('_num_matches', None)
        rec.pop('_num_ambiguous', None)

    return ranked


# ───────────────────────────────────────────────────────────────
# 5. DIAGNOSTICS
# ───────────────────────────────────────────────────────────────

def load_all_skills() -> List[Dict[str, Any]]:
    """Load all skills for diagnostics."""
    loaded = []
    for name, config in get_skills(force_refresh=True).items():
        loaded.append({
            "name": name,
            "description": config.get("description", ""),
            "kind": config.get("kind", "skill"),
        })
    return loaded


def health_check() -> Dict[str, Any]:
    """Return skill count and status for diagnostics."""
    skills = load_all_skills()
    real_skills = [s for s in skills if s.get("kind") == "skill"]
    command_bridges = [s for s in skills if s.get("kind") == "command"]
    return {
        "status": "ok" if real_skills else "error",
        "skills_found": len(real_skills),
        "command_bridges_found": len(command_bridges),
        "skill_names": [s.get('name', 'unknown') for s in real_skills],
        "command_bridge_names": [s.get('name', 'unknown') for s in command_bridges],
        "skills_dir": SKILLS_DIR,
        "skills_dir_exists": os.path.exists(SKILLS_DIR),
        "cache": get_cache_status(),
    }


def analyze_prompt(
    prompt: str,
    confidence_threshold: float = DEFAULT_CONFIDENCE_THRESHOLD,
    uncertainty_threshold: float = DEFAULT_UNCERTAINTY_THRESHOLD,
    confidence_only: bool = False,
    show_rejections: bool = False,
    semantic_hits: Optional[List[Dict[str, Any]]] = None,
) -> List[Dict[str, Any]]:
    """Analyze one prompt and apply requested filtering mode."""
    recommendations = analyze_request(prompt, semantic_hits=semantic_hits)
    return filter_recommendations(
        recommendations=recommendations,
        confidence_threshold=confidence_threshold,
        uncertainty_threshold=uncertainty_threshold,
        confidence_only=confidence_only,
        show_rejections=show_rejections,
    )


def analyze_batch(
    prompts: List[str],
    confidence_threshold: float,
    uncertainty_threshold: float,
    confidence_only: bool,
    show_rejections: bool,
    semantic_mode: bool = False,
) -> List[Dict[str, Any]]:
    """Analyze multiple prompts in a single process for lower overhead."""
    results = []
    for prompt in prompts:
        trimmed = prompt.strip()
        if not trimmed:
            continue

        hits = None
        if semantic_mode:
            hits = _cocoindex_search_builtin(trimmed, REPO_ROOT)
        elif should_auto_use_semantic_search(trimmed):
            hits = _cocoindex_search_builtin(trimmed, REPO_ROOT)

        results.append({
            "prompt": trimmed,
            "recommendations": analyze_prompt(
                prompt=trimmed,
                confidence_threshold=confidence_threshold,
                uncertainty_threshold=uncertainty_threshold,
                confidence_only=confidence_only,
                show_rejections=show_rejections,
                semantic_hits=hits,
            ),
        })
    return results


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
  python skill_advisor.py "api chain mcp" --threshold 0.8 --confidence-only
  python skill_advisor.py --batch-file prompts.txt
  cat prompts.txt | python skill_advisor.py --batch-stdin
  python skill_advisor.py --health

  # CocoIndex semantic search (built-in, requires ccc daemon):
  python skill_advisor.py "deploy to production" --semantic

  # CocoIndex semantic search (pre-computed MCP results):
  python skill_advisor.py "deploy to production" --semantic-hits '[{"path":".opencode/skill/sk-git/SKILL.md","score":0.92}]'
        '''
    )
    parser.add_argument('prompt', nargs='?', default='',
                        help='User request to analyze')
    parser.add_argument('--health', action='store_true',
                        help='Run health check diagnostics')
    parser.add_argument('--threshold', type=float, default=DEFAULT_CONFIDENCE_THRESHOLD,
                        help='Confidence threshold for recommendations (default: 0.8).')
    parser.add_argument('--uncertainty', type=float, default=DEFAULT_UNCERTAINTY_THRESHOLD,
                        help='Maximum uncertainty threshold for recommendations in dual-threshold mode (default: 0.35).')
    parser.add_argument('--confidence-only', action='store_true',
                        help='Use confidence-only filtering and bypass uncertainty checks explicitly.')
    parser.add_argument('--show-rejections', action='store_true',
                        help='Include recommendations that failed dual-threshold validation')
    parser.add_argument('--batch-file', type=str, default='',
                        help='Analyze prompts from file (one prompt per line) in one process.')
    parser.add_argument('--batch-stdin', action='store_true',
                        help='Analyze prompts from stdin (one prompt per line) in one process.')
    parser.add_argument('--force-refresh', action='store_true',
                        help='Force refresh of skill discovery cache before analysis.')
    parser.add_argument('--semantic', action='store_true',
                        help='Run CocoIndex semantic search (via ccc CLI) to supplement keyword matching.')
    parser.add_argument('--semantic-hits', type=str, default='',
                        help='Pre-computed CocoIndex results as JSON array of {"path": str, "score": float} objects.')

    args = parser.parse_args()

    if args.force_refresh:
        get_skills(force_refresh=True)

    if args.health:
        cocoindex_binary = resolve_cocoindex_binary()
        health = health_check()
        health["cocoindex_available"] = cocoindex_binary is not None
        health["cocoindex_binary"] = cocoindex_binary or ""
        print(json.dumps(health, indent=2))
        sys.exit(0)

    if args.batch_file and args.batch_stdin:
        print(json.dumps({"error": "Use either --batch-file or --batch-stdin, not both."}, indent=2))
        sys.exit(2)

    # Parse pre-computed semantic hits (JSON array from MCP search results)
    pre_computed_hits = None
    if args.semantic_hits:
        try:
            pre_computed_hits = json.loads(args.semantic_hits)
            if not isinstance(pre_computed_hits, list):
                print(json.dumps({"error": "--semantic-hits must be a JSON array"}), file=sys.stderr)
                pre_computed_hits = None
        except json.JSONDecodeError as exc:
            print(json.dumps({"error": f"Invalid --semantic-hits JSON: {exc}"}), file=sys.stderr)

    if args.batch_file:
        try:
            with open(args.batch_file, 'r', encoding='utf-8') as handle:
                batch_prompts = [line.rstrip('\n') for line in handle]
        except OSError as exc:
            print(json.dumps({"error": f"Failed to read --batch-file: {exc}"}, indent=2))
            sys.exit(2)

        print(json.dumps(analyze_batch(
            prompts=batch_prompts,
            confidence_threshold=args.threshold,
            uncertainty_threshold=args.uncertainty,
            confidence_only=args.confidence_only,
            show_rejections=args.show_rejections,
            semantic_mode=args.semantic,
        ), indent=2))
        sys.exit(0)

    if args.batch_stdin:
        batch_prompts = [line.rstrip('\n') for line in sys.stdin]
        print(json.dumps(analyze_batch(
            prompts=batch_prompts,
            confidence_threshold=args.threshold,
            uncertainty_threshold=args.uncertainty,
            confidence_only=args.confidence_only,
            show_rejections=args.show_rejections,
            semantic_mode=args.semantic,
        ), indent=2))
        sys.exit(0)

    if not args.prompt:
        print(json.dumps([]))
        sys.exit(0)

    # Resolve semantic hits: pre-computed > built-in search > none
    semantic_hits = pre_computed_hits
    if semantic_hits is None and args.semantic:
        semantic_hits = _cocoindex_search_builtin(args.prompt, REPO_ROOT)
    elif semantic_hits is None and should_auto_use_semantic_search(args.prompt):
        semantic_hits = _cocoindex_search_builtin(args.prompt, REPO_ROOT)

    results = analyze_prompt(
        prompt=args.prompt,
        confidence_threshold=args.threshold,
        uncertainty_threshold=args.uncertainty,
        confidence_only=args.confidence_only,
        show_rejections=args.show_rejections,
        semantic_hits=semantic_hits,
    )

    print(json.dumps(results, indent=2))
