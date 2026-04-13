---
title: "Implementation Plan: Skill Graph Auto-Setup"
description: "Plan for automatic graph creation on install and auto-update on skill changes."
---
# Implementation Plan: Skill Graph Auto-Setup

---

## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Shell (init script), Python (advisor), TypeScript (MCP server) |
| **Testing** | Existing regression harness + manual verification |

---

## 2. APPROACH

### Step 1: Init Script
Create `init-skill-graph.sh`:
- Detect if SQLite exists, if JSON exists
- Run compiler validation
- Generate JSON fallback
- Report health status

### Step 2: Advisor Lazy Auto-Init
Update `_load_skill_graph()` in `skill_advisor.py`:
- SQLite first → JSON second → auto-compile JSON as last resort
- Clear warning messages for each fallback path

### Step 3: MCP Startup Logging
Improve `context-server.ts` startup scan output:
- Distinguish "created fresh" vs "loaded existing" vs "reindexed stale"
- Report skill count and staleness

### Step 4: New Skill Detection Logging
Enhance the Chokidar watcher callback:
- Log skill name when added/removed
- Re-validate edge targets after addition

### Step 5: Setup Guide
Update `SET-UP_GUIDE.md` with graph-specific sections:
- First-time setup, verification, troubleshooting, new skill checklist

---

## 3. QUALITY GATES

- [ ] Fresh install scenario works end-to-end
- [ ] 44/44 regression tests pass
- [ ] Setup guide covers all verification steps
