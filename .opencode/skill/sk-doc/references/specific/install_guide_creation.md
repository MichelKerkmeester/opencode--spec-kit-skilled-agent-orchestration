---
title: Install Guide Creation - Phase-Based Installation Documentation
description: Standards and workflow for clear, reliable install guides with phase-based validation checkpoints.
---

# Install Guide Creation - Phase-Based Installation Documentation

Standards and workflow for clear, reliable install guides with validation checkpoints at each phase.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

This reference defines standards for install guide documentation. Install guides require special consideration: unclear instructions lead to failed setups, wasted time, and frustrated users.

**Core Philosophy**: "Install once, verify at each step"

**Goals**:
- **Reliability** - Users succeed on first attempt
- **Debuggability** - When issues occur, users can identify and fix them
- **Platform-awareness** - Clear paths for different environments
- **AI-friendly** - Parseable structure with copyable commands

**Requirements**:
- All guides follow an 11-section structure (sections 0-10)
- Section 1 (Overview) must include a Core Principle blockquote
- Every validation checkpoint must be followed by a STOP block
- Guides should contain 5+ STOP blocks across all phases

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:core-principles -->
## 2. Core Principles

### Phase-Based Installation

```
Phase 1: Prerequisites    → Validate: Tools exist
    ↓
Phase 2: Installation     → Validate: Binaries installed
    ↓
Phase 3: Initialization   → Validate: Index/database initialized (if applicable)
    ↓
Phase 4: Configuration    → Validate: Config files created
    ↓
Phase 5: Verification     → Validate: System works end-to-end
```

**Note:** Troubleshooting is a reference section, not a phase.

### Key Rules

- **NEVER** proceed to next phase without validation
- Each phase ends with explicit validation checkpoint
- Failed validation → Troubleshooting section, not next phase
- Commands in fenced code blocks with language tags
- One command per block (for easy copying)
- STOP conditions clearly marked

---

<!-- /ANCHOR:core-principles -->
<!-- ANCHOR:required-sections -->
## 3. REQUIRED SECTIONS

Every install guide follows an 11-section structure (sections 0-10), with 9 required and 2 optional:

| # | Section | Required | Validation Gate |
|---|---------|----------|-----------------|
| 0 | **AI-First Install Guide** | ✅ Yes | - |
| 1 | **Overview** | ✅ Yes | - |
| 2 | **Prerequisites** | ✅ Yes | `phase_1_complete` |
| 3 | **Installation** | ✅ Yes | `phase_2_complete`, `phase_3_complete` |
| 4 | **Configuration** | ✅ Yes | `phase_4_complete` |
| 5 | **Verification** | ✅ Yes | `phase_5_complete` |
| 6 | **Usage** | ✅ Yes | - |
| 7 | **Features** | ⚠️ Optional | - |
| 8 | **Examples** | ⚠️ Optional | - |
| 9 | **Troubleshooting** | ✅ Yes | - |
| 10 | **Resources** | ✅ Yes | - |

### Section Examples

**Section 0 - AI-First Install Guide** (copy-paste prompt):
```markdown
## AI-FIRST INSTALL GUIDE

**Copy and paste this prompt to your AI assistant:**
I want to install [Tool] from [URL]. Please help me...
```

**Section 1 - Overview** (must include Core Principle blockquote):
```markdown
## 1. OVERVIEW

[Tool] is [description]. It provides [benefits].

### Core Principle

> **Install once, verify at each step.** Each phase has a validation checkpoint - do not proceed until the checkpoint passes.
```

**Section 2 - Prerequisites** (checklist format required):
```markdown
## 2. PREREQUISITES
- [ ] Node.js v18+ installed (`node --version`)
- [ ] npm v9+ installed (`npm --version`)
- [ ] Terminal access with standard permissions

### Validation: `phase_1_complete`
...
❌ **STOP if validation fails** - Fix prerequisites before continuing.
```

Each validation checkpoint MUST be followed by a STOP block:
```markdown
❌ **STOP if validation fails** - [Brief instruction on what to check]
```

Install guides should contain 5+ STOP blocks across all validation checkpoints.

---

<!-- /ANCHOR:required-sections -->
<!-- ANCHOR:phase-validation-pattern -->
## 4. PHASE VALIDATION PATTERN

### Validation Checkpoint Format

```markdown
### Validation: `phase_N_complete`

```bash
<validation-command>
```

**Expected output**:
```
<expected-output-pattern>
```

**Checklist**:
- [ ] Output matches expected pattern
- [ ] No error messages displayed

❌ **STOP if validation fails** - See [Troubleshooting](#troubleshooting)
```

### Requirements

- **Format**: Use `- [ ]` checkbox syntax
- **Criteria**: Specific, verifiable conditions
- **STOP condition**: Always present when validation can fail

---

<!-- /ANCHOR:phase-validation-pattern -->
<!-- ANCHOR:platform-configuration -->
## 5. PLATFORM CONFIGURATION

### Multi-Platform Instructions

**Option A: Conditional blocks**
```markdown
**macOS/Linux**:
```bash
export MCP_PATH="$HOME/.mcp"
```

**Windows (PowerShell)**:
```powershell
$env:MCP_PATH = "$HOME\.mcp"
```
```

### Tool-Specific Config Patterns

**OpenCode** (`opencode.json`):
```json
{
  "mcp": {
    "server-name": {
      "type": "local",
      "command": ["/path/to/binary"],
      "environment": {
        "_NOTE_TOOLS": "Description of what this provides"
      },
      "enabled": true
    }
  }
}
```

**Claude Desktop** (`claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "@example/server"]
    }
  }
}
```

---

<!-- /ANCHOR:platform-configuration -->
<!-- ANCHOR:troubleshooting-standards -->
## 6. TROUBLESHOOTING STANDARDS

### Error Table Format (3-column required)

```markdown
| Error | Cause | Fix |
|-------|-------|-----|
| `command not found: mcp-server` | Not in PATH | Run `npm install -g` again, check PATH |
| `EACCES: permission denied` | Missing permissions | Use `sudo` or fix npm permissions |
| `Connection refused` | Server not running | Start server: `mcp-server start` |
| `Invalid configuration` | Malformed JSON | Validate JSON syntax, check quotes |
```

### Error Categories

1. **Installation Errors** - Package manager failures, permission issues
2. **Configuration Errors** - Invalid JSON, missing files, wrong paths
3. **Runtime Errors** - Connection failures, version mismatches
4. **Environment Errors** - Missing variables, PATH issues

### Fix Quality

**Bad** (vague): `Fix: Check your configuration`

**Good** (actionable): `Fix: Open opencode.json, verify "command" path exists: which npx`

---

<!-- /ANCHOR:troubleshooting-standards -->
<!-- ANCHOR:quality-criteria -->
## 7. QUALITY CRITERIA

### DQI Components for Install Guides

| Component | Weight | What It Measures |
|-----------|--------|------------------|
| **Structure** | 40% | Phase organization, validation checkpoints |
| **Content** | 35% | Commands complete, expected outputs, platform coverage |
| **Style** | 25% | Copyable commands, STOP conditions, consistent format |

### Minimum Requirements

| Section | Requirements |
|---------|-------------|
| **Prerequisites** | Checklist format, version requirements, validation commands |
| **Installation** | Numbered steps, one command per block, validation checkpoint |
| **Configuration** | File paths explicit, example configs complete |
| **Verification** | End-to-end test, expected output, success criteria |
| **Troubleshooting** | 5+ errors, 3-column table, actionable fixes |

### Common Issues

| Issue | Fix |
|-------|-----|
| Missing validation checkpoints | Add `### Validation: \`phase_N_complete\`` |
| Commands without expected output | Add `**Expected output**:` block |
| Vague troubleshooting | Use 3-column table with specific fixes |
| Platform assumptions | Add platform-specific alternatives |
| Missing STOP conditions | Add `❌ **STOP if validation fails**` |

---

<!-- /ANCHOR:quality-criteria -->
<!-- ANCHOR:cross-references -->
## 8. CROSS-REFERENCES

- **[core_standards.md](../global/core_standards.md)** - Filename conventions, heading format, emoji rules
- **[validation.md](../global/validation.md)** - DQI scoring methodology, quality bands
- **[workflows.md](../global/workflows.md)** - Document creation workflows
- **[quick_reference.md](../global/quick_reference.md)** - Quick command reference
- **[skill_creation.md](./skill_creation.md)** - Skill creation workflow
- **[install_guide_template.md](../../assets/documentation/install_guide_template.md)** - Template for new install guides

### Pre-Publish Checklist

- [ ] All 11 sections present (0-10, with 7 and 8 optional)
- [ ] Core Principle blockquote in Section 1 (Overview)
- [ ] All phases have validation checkpoints
- [ ] 5+ STOP blocks after validation checkpoints
- [ ] Prerequisites testable (commands provided)
- [ ] Troubleshooting table has 5+ entries
- [ ] Platform requirements in overview
- [ ] Time estimate included
- [ ] All code blocks have language tags
<!-- /ANCHOR:cross-references -->
