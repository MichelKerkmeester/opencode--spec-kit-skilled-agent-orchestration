---
title: Install Guide Creation - Templates and Standards
description: Templates for creating consistent, AI-friendly installation guides for MCP servers, plugins, CLI tools, and development dependencies.
---

# Install Guide Creation - Templates and Standards

Templates for creating phased installation guides with validation checkpoints.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

**Purpose**: Install guides provide step-by-step instructions for installing, configuring, and verifying software tools. They take users from "download this" to "now use it successfully."

**Key Characteristics**:
- **Phase-based**: Installation broken into clear phases with validation
- **AI-friendly**: Copy-paste prompt for AI-assisted installation
- **Self-contained**: All commands, configs, and troubleshooting in one place
- **Platform-aware**: Supports OpenCode, Claude Code, Claude Desktop

**Location**: `.opencode/install_guides/`

**Core Philosophy**: "Install once, verify at each step"

Each phase has a validation checkpoint - do not proceed until the checkpoint passes. This prevents cascading failures and makes debugging dramatically easier.

**Benefits**:
- Users succeed on first attempt (when following validation)
- Troubleshooting is guided, not guesswork
- AI assistants can execute installation reliably
- Consistent experience across different tools

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:when-to-create-install-guides -->
## 2. WHEN TO CREATE INSTALL GUIDES

**Create install guides when**:
- Installing MCP servers that connect to AI assistants
- Installing CLI tools that require configuration
- Installing plugins with multi-step setup
- Setting up development dependencies with specific versions
- Any tool requiring configuration beyond `npm install`

**Keep simple when**:
- Single command install with no configuration: `brew install tool`
- Tool is well-documented elsewhere (link to official docs)
- No platform-specific setup required
- Tool works immediately after install with sensible defaults

**Create vs. Link Decision**:
```
Is tool already well-documented? → Link to official docs
Requires AI platform configuration? → Create guide
Has project-specific settings? → Create guide
Simple one-liner install? → Just document the command inline
```

---

<!-- /ANCHOR:when-to-create-install-guides -->
<!-- ANCHOR:install-guide-types -->
## 3. INSTALL GUIDE TYPES

### MCP Server Guides
**Purpose**: Install and configure Model Context Protocol servers for AI assistants

**Examples**: Spec-kit-memory, browser-debugger, Webflow MCP, Figma MCP

**Key Sections**:
- AI-First prompt for assisted installation
- Platform configuration (OpenCode, Claude Code, Claude Desktop)
- MCP tool verification
- Index/database initialization (if applicable)

### CLI Tool Guides
**Purpose**: Install command-line tools that support AI workflows

**Examples**: browser-debugger-cli (bdg), uv

**Key Sections**:
- Binary installation and PATH setup
- Command reference
- Shell integration (aliases, completions)

### Plugin Guides
**Purpose**: Install extensions that modify AI assistant behavior

**Examples**: OpenCode hooks, custom slash commands

**Key Sections**:
- Plugin registration
- Hook configuration
- Activation verification

### Development Dependency Guides
**Purpose**: Install language runtimes, package managers, and build tools

**Examples**: Ollama + models, uv Python manager, Homebrew dependencies

**Key Sections**:
- Version requirements
- Platform-specific installation
- Integration with other tools

---

<!-- /ANCHOR:install-guide-types -->
<!-- ANCHOR:standard-install-guide-structure -->
## 4. STANDARD INSTALL GUIDE STRUCTURE

Every install guide follows an 11-section structure (sections 0-10), with 9 required and 2 optional:

| #   | Section                    | Purpose                                        | Required   |
| --- | -------------------------- | ---------------------------------------------- | ---------- |
| 0   | **AI-First Install Guide** | Copy-paste prompt for AI-assisted install      | ✅ Yes      |
| 1   | **Overview**               | What it does, key features, architecture       | ✅ Yes      |
| 2   | **Prerequisites**          | Required tools, versions, Phase 1 validation   | ✅ Yes      |
| 3   | **Installation**           | Step-by-step commands, Phase 2-3 validation    | ✅ Yes      |
| 4   | **Configuration**          | Platform configs, env vars, Phase 4 validation | ✅ Yes      |
| 5   | **Verification**           | End-to-end test, Phase 5 success criteria      | ✅ Yes      |
| 6   | **Usage**                  | Daily workflow, common operations              | ✅ Yes      |
| 7   | **Features**               | Detailed tool/command documentation            | ⚠️ Optional |
| 8   | **Examples**               | Real-world usage scenarios                     | ⚠️ Optional |
| 9   | **Troubleshooting**        | Common errors with fixes                       | ✅ Yes      |
| 10  | **Resources**              | File locations, command reference, links       | ✅ Yes      |

**Section Purposes**:

**AI-First Install Guide**: The "TL;DR" that lets users paste a prompt to their AI assistant and get guided through installation. Include what the AI will do and expected time.

**Overview**: Explain what the tool does, why it's valuable, and show an architecture diagram. Include comparison table if relevant alternatives exist.

**Prerequisites (Phase 1)**: List required software with version requirements and verification commands. End with `phase_1_complete` validation checkpoint.

**Installation (Phases 2-3)**: Step-by-step install commands. Verify binaries exist. Initialize any indexes/databases. End with validation checkpoints.

**Configuration (Phase 4)**: Platform-specific JSON configs for OpenCode, Claude Code, Claude Desktop. Include environment variables. End with validation checkpoint.

**Verification (Phase 5)**: Prove the entire system works end-to-end. Test MCP connection. Run sample query.

**Usage**: Daily workflow patterns. When to rebuild/refresh. Management commands.

**Features**: Document each exposed tool/command with parameters, examples, and expected output.

**Examples**: 4-6 realistic scenarios showing the tool in action.

**Troubleshooting**: Common errors in table format with cause and fix.

**Resources**: File paths, command reference, external links, configuration templates.

---

<!-- /ANCHOR:standard-install-guide-structure -->
<!-- ANCHOR:phase-validation-pattern -->
## 5. PHASE VALIDATION PATTERN

**Core Principle**: Never proceed to the next phase without validation. This prevents cascading failures.

### Checkpoint Naming Convention

```
phase_1_complete  → Prerequisites verified
phase_2_complete  → Binaries installed
phase_3_complete  → Index/initialization done
phase_4_complete  → Configuration valid
phase_5_complete  → End-to-end verified
```

### Validation Block Format

```markdown
### Validation: `phase_N_complete`

```bash
# All commands should succeed:
command_1     # → expected output
command_2     # → expected output
```

**Checklist:**
- [ ] `command_1` returns expected?
- [ ] `command_2` returns expected?

❌ **STOP if validation fails** - [Brief instruction on what to check]
```

### STOP Condition Pattern

Always include a STOP condition after validation checklists:

```markdown
❌ **STOP if validation fails** - Fix prerequisites before continuing.
❌ **STOP if validation fails** - Check installation output for errors.
❌ **STOP if validation fails** - Fix configuration syntax or paths.
❌ **STOP if validation fails** - Check MCP configuration, restart client.
```

---

<!-- /ANCHOR:phase-validation-pattern -->
<!-- ANCHOR:platform-configuration-patterns -->
## 6. PLATFORM CONFIGURATION PATTERNS

### OpenCode Configuration (`opencode.json`)

```json
{
  "mcp": {
    "[tool-id]": {
      "type": "local",
      "command": ["/path/to/binary"],
      "environment": {
        "ENV_VAR": "value",
        "_NOTE_TOOLS": "Description of what this provides",
        "_NOTE_DOCS": "https://docs-url"
      },
      "enabled": true
    }
  }
}
```

**Notes**:
- `type` is usually `"local"` for installed binaries
- `_NOTE_*` keys are documentation hints (not used by runtime)
- `environment` passes env vars to the MCP server process

### Claude Code Configuration (`.mcp.json`)

```json
{
  "mcpServers": {
    "[tool-id]": {
      "command": "/path/to/binary",
      "args": [],
      "env": {}
    }
  }
}
```

### Claude Desktop Configuration

**File Location**:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "[tool-id]": {
      "command": "/path/to/binary",
      "args": [],
      "env": {}
    }
  }
}
```

### Path Placeholders

Always use `YOUR_USERNAME` as a placeholder and remind users to replace it:

```markdown
> **Note**: Replace `YOUR_USERNAME` with your actual username. Find it with `whoami`.
```

---

<!-- /ANCHOR:platform-configuration-patterns -->
<!-- ANCHOR:troubleshooting-patterns -->
## 7. TROUBLESHOOTING PATTERNS

### Error Table Format (Required)

Use 3-column format: Error → Cause → Fix

```markdown
### Common Errors

**❌ "Error message here"**
- **Cause**: Brief explanation of why this happens.
- **Fix**: 
  ```bash
  specific command to fix
  ```
```

### Standard Error Categories

**1. Path/Binary Errors**
```markdown
**❌ "Command not found: [binary]"**
- **Cause**: Binary not in PATH after installation.
- **Fix**: 
  ```bash
  source "$HOME/.local/bin/env"
  # Or add to ~/.zshrc: export PATH="$HOME/.local/bin:$PATH"
  ```
```

**2. Dependency Errors**
```markdown
**❌ "Error building with [library]"**
- **Cause**: Missing system dependencies.
- **Fix**:
  ```bash
  brew install dependency1 dependency2
  ```
```

**3. Connection Errors**
```markdown
**❌ "Cannot connect to [service]"**
- **Cause**: Service not running.
- **Fix**:
  ```bash
  brew services start servicename
  service-command list  # Verify running
  ```
```

**4. Configuration Errors**
```markdown
**❌ "MCP server not appearing in tools"**
- **Cause**: Configuration file issue or path incorrect.
- **Fix**:
  1. Check configuration file syntax:
     ```bash
     python3 -m json.tool < configfile.json
     ```
  2. Verify binary path exists:
     ```bash
     ls -la /path/to/binary
     ```
  3. Restart your AI client completely.
```

**5. API Errors**
```markdown
**❌ "[API] API error"**
- **Cause**: Invalid or missing API key.
- **Fix**:
  ```bash
  export API_KEY_VAR="your-key"
  echo $API_KEY_VAR  # Verify it's set
  ```
```

### Troubleshooting Quality

**Bad** (vague): `Fix: Check your configuration`

**Good** (actionable): `Fix: Open opencode.json, verify "command" path exists: which binary_name`

---

<!-- /ANCHOR:troubleshooting-patterns -->
<!-- ANCHOR:template-guidelines -->
## 8. TEMPLATE GUIDELINES

### Naming Conventions

**File Names**:
- Format: `MCP - [Tool Name].md` or `CLI - [Tool Name].md`
- Use title case for tool names
- Examples:
  - ✅ `MCP - Spec Kit Memory.md`
  - ✅ `MCP - Figma.md`
  - ✅ `CLI - Browser Debugger.md`
  - ❌ `spec-kit-memory-install.md` (wrong format)

### Command Block Standards

**One command per purpose**:
```bash
# Install the package
uv tool install package-name

# Verify installation
package --version
```

**Always include expected output**:
```bash
tool-name --version
# → tool-name 1.0.0
```

**Comment complex commands**:
```bash
# Start server with recommended flags for production use
tool-mcp --config /path/to/config --persist --watch
```

### H1 Description Standards

The description paragraph under the H1 title should be **2-4 sentences** that:

1. **State what the guide covers**: "Complete installation and configuration guide for..."
2. **List key features/capabilities**: 3-5 specific items with brief explanations
3. **Mention the workflow or approach**: If relevant (e.g., "via Code Mode", "CLI primary")
4. **Explain the value proposition**: Why this tool matters

**Pattern**:
```
Complete installation and configuration guide for [tool name], [primary purpose]. 
[Key features - 3-5 items with parenthetical explanations]. 
[Workflow/approach if relevant]. [Value proposition].
```

**Good Example (Code Mode)**:
```
Complete installation and configuration guide for the Code Mode MCP server, enabling 
TypeScript-based orchestration of external MCP tools. Provides unified access to 
Webflow, Figma, ClickUp, GitHub, Chrome DevTools, and other MCP servers through a 
single `call_tool_chain()` interface. Delivers 98.7% context reduction and 60% 
faster execution compared to individual tool calls.
```

**Bad Example** (too brief):
```
A guide to installing the MCP server.
```

### Writing Style

- **Imperative mood**: "Install the package" not "The package should be installed"
- **Direct instructions**: "Run this command" not "You might want to run"
- **Specific over vague**: "Python 3.9+" not "recent Python version"
- **Test everything**: Every command you write should be copy-pasteable and work
- **Human Voice Rules (HVR)**: Follow the full HVR ruleset in [hvr_rules.md](../../references/global/hvr_rules.md). Key points: no em dashes (use commas or periods), no semicolons, no banned words (leverage, robust, seamless, utilize, holistic), active voice throughout

### Placeholder Format

Use `[PLACEHOLDER]` format with SCREAMING_SNAKE_CASE:

```markdown
[TOOL_NAME]           # Name of the tool
[REPOSITORY_URL]      # GitHub/npm URL
[BINARY_PATH]         # Full path to binary
[CONFIG_FILE]         # Configuration file name
[EXPECTED_OUTPUT]     # What the command should print
```

---

<!-- /ANCHOR:template-guidelines -->
<!-- ANCHOR:install-guide-checklist -->
## 9. INSTALL GUIDE CHECKLIST

Before publishing an install guide, verify:

```markdown
Structure:
□ H1 description is 2-4 sentences with features list (see H1 Description Standards)
□ AI-First Install Guide section at top
□ All 11 sections present (9 required + 2 optional)
□ Table of contents with anchor links
□ Horizontal rules (---) between major sections

Content:
□ Prerequisites have version requirements
□ Every phase has validation checkpoint
□ All commands have expected output
□ Platform configs for OpenCode, Claude Code, Claude Desktop
□ 5+ troubleshooting errors documented

Quality:
□ All code blocks specify language
□ Commands are copy-pasteable (tested)
□ STOP conditions after each validation
□ Placeholders are obviously placeholders
□ Time estimate in AI-First section
□ HVR compliance verified (see hvr_rules.md)

Integration:
□ File in `.opencode/install_guides/` folder
□ Linked from relevant SKILL.md files
□ Referenced in AGENTS.md if mandatory tool
```

---

<!-- /ANCHOR:install-guide-checklist -->
<!-- ANCHOR:patterns-from-existing-guides -->
## 10. PATTERNS FROM EXISTING GUIDES

### MCP Server Guide Patterns

**What works well**:
- AI-First prompt is comprehensive and specific
- Architecture diagram shows data flow clearly
- Comparison table vs. alternatives
- Multiple configuration options documented
- `phase_N_complete` naming is consistent
- Troubleshooting covers 10+ common errors

**Patterns to reuse**:
```markdown
### Recommended: [Setup Name]

**[Setup description]**:

```bash
# Step 1 description
command_1

# Step 2 description  
command_2
```

> **Why [recommendation]?** [Brief rationale]

### Alternative: [Alternative Name]

**Option A: [Name]**
```bash
export ENV_VAR="value"
```

**Option B: [Name]**
```bash
export OTHER_VAR="value"
```

> **Note**: [When to use alternatives]
```

### Backend/Provider Selection Pattern

```markdown
### Selection Guide

| Option    | Best For   | Metric 1 | Metric 2 |
| --------- | ---------- | -------- | -------- |
| `option1` | Use case 1 | Value    | Value    |
| `option2` | Use case 2 | Value    | Value    |

**Decision Logic:**
```
IF condition_1:
  → Use "option1" (reason)

IF condition_2:
  → Use "option2" (reason)
```
```

---

<!-- /ANCHOR:patterns-from-existing-guides -->
<!-- ANCHOR:install-guide-maintenance -->
## 11. INSTALL GUIDE MAINTENANCE

### When to Update

**Update install guides when**:
- Tool releases new major version
- Installation method changes
- New platform support added
- User feedback reveals confusion
- Dependency requirements change

### Deprecation

If a tool is deprecated:

1. Add deprecation notice at top:
```markdown
> ⚠️ **DEPRECATED**: This tool has been replaced by [New Tool]. 
> See [New Tool Install Guide](./MCP%20-%20New%20Tool.md).
```

2. Keep guide available for legacy users
3. Remove from AGENTS.md mandatory tools

---

<!-- /ANCHOR:install-guide-maintenance -->
<!-- ANCHOR:best-practices-summary -->
## 12. BEST PRACTICES SUMMARY

**DO**:
- ✅ Start with AI-First prompt for quick setup
- ✅ Include validation checkpoint after every phase
- ✅ Document all three platforms (OpenCode, Claude Code, Claude Desktop)
- ✅ Show expected output for every command
- ✅ Use consistent `phase_N_complete` naming
- ✅ Include architecture diagram for MCP servers
- ✅ Test every command before publishing
- ✅ Include 5+ troubleshooting entries

**DON'T**:
- ❌ Skip validation checkpoints (leads to cascading failures)
- ❌ Use vague fixes ("check your config")
- ❌ Assume user knows their PATH or username
- ❌ Mix commands for different platforms in same block
- ❌ Omit time estimates (users need to plan)
- ❌ Write untested commands
- ❌ Forget STOP conditions after validation
- ❌ Leave placeholders in published guides

---

<!-- /ANCHOR:best-practices-summary -->
<!-- ANCHOR:complete-template -->
## 13. COMPLETE TEMPLATE

Copy and customize this template for new install guides. Replace all `[PLACEHOLDERS]` with actual values.

```markdown
# [TOOL_NAME] Installation Guide

Complete installation and configuration guide for [TOOL_NAME], [PRIMARY_PURPOSE - what it enables]. [KEY_FEATURES - list 3-5 specific capabilities with parenthetical explanations]. [WORKFLOW_APPROACH - how it's accessed/used]. [VALUE_PROPOSITION - why it matters].

---

## AI-FIRST INSTALL GUIDE

**Copy and paste this prompt to your AI assistant to get installation help:**

```
I want to install [TOOL_NAME] from [REPOSITORY_URL]

Please help me:
1. Verify I have [PREREQUISITE_1] and [PREREQUISITE_2] installed
2. Install required dependencies ([DEPENDENCY_LIST])
3. Install [TOOL_NAME] using [INSTALL_COMMAND]
4. Configure for my environment (I'm using: [Claude Code / Claude Desktop / OpenCode])
5. Verify the installation with a test [VERIFICATION_TYPE]

My project is located at: [your project path]
[OPTIONAL_CONFIG_QUESTION]: [default value / option 1 / option 2]

Guide me through each step with the exact commands I need to run.
```

**What the AI will do:**
- Verify [PREREQUISITE_1] and [PREREQUISITE_2] are available
- Install [TOOL_NAME] dependencies
- Install [TOOL_NAME] via [INSTALL_METHOD]
- Configure the [TOOL_TYPE] for your AI platform
- Test [VERIFICATION_TYPE] with a sample [TEST_ITEM]

**Expected setup time:** [N-M] minutes

---

## TABLE OF CONTENTS

0. [AI-FIRST INSTALL GUIDE](#-ai-first-install-guide)
1. [OVERVIEW](#1--overview)
2. [PREREQUISITES](#2--prerequisites)
3. [INSTALLATION](#3--installation)
4. [CONFIGURATION](#4--configuration)
5. [VERIFICATION](#5--verification)
6. [USAGE](#6--usage)
7. [FEATURES](#7--features) *(optional)*
8. [EXAMPLES](#8--examples) *(optional)*
9. [TROUBLESHOOTING](#9--troubleshooting)
10. [RESOURCES](#10--resources)

---

## 1. OVERVIEW

[TOOL_NAME] is [DESCRIPTION]. It provides [KEY_BENEFIT_1] and [KEY_BENEFIT_2].

### Core Principle

> **Install once, verify at each step.** Each phase has a validation checkpoint - do not proceed until the checkpoint passes.

### Key Features

| Feature         | Description   |
| --------------- | ------------- |
| **[FEATURE_1]** | [DESCRIPTION] |
| **[FEATURE_2]** | [DESCRIPTION] |
| **[FEATURE_3]** | [DESCRIPTION] |

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLI AI Agents (OpenCode)                     │
└─────────────────────────────────┬───────────────────────────────┘
                                  │ [PROTOCOL]
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    [TOOL_NAME] ([RUNTIME])                      │
│  [COMPONENT_DESCRIPTION]                                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. PREREQUISITES

**Phase 1** focuses on installing required software dependencies.

### Required Software

1. **[PREREQUISITE_1]** ([VERSION_REQUIREMENT])
   ```bash
   [VERIFICATION_COMMAND]
   # Should show [EXPECTED_OUTPUT]
   ```

2. **[PREREQUISITE_2]** ([VERSION_REQUIREMENT])
   ```bash
   # Install if not present
   [INSTALL_COMMAND]
   
   # Verify installation
   [VERIFICATION_COMMAND]
   ```

### Actions

1. **Install Dependencies**
   ```bash
   [DEPENDENCY_INSTALL_COMMAND]
   ```

### Validation: `phase_1_complete`

```bash
# All commands should succeed:
[VERIFY_COMMAND_1]    # → [EXPECTED_OUTPUT]
[VERIFY_COMMAND_2]    # → [EXPECTED_OUTPUT]
```

**Checklist:**
- [ ] `[VERIFY_COMMAND_1]` returns [EXPECTED]?
- [ ] `[VERIFY_COMMAND_2]` returns [EXPECTED]?

❌ **STOP if validation fails** - Fix prerequisites before continuing.

---

## 3. INSTALLATION

This section covers **Phase 2 (Install)** and **Phase 3 (Initialize)**.

### Step 1: Install [TOOL_NAME]

```bash
[INSTALL_COMMAND]
```

### Step 2: Verify Installation

```bash
which [BINARY_NAME]
# → [EXPECTED_PATH]

[BINARY_NAME] --version
# → [EXPECTED_VERSION]
```

### Validation: `phase_2_complete`

```bash
[BINARY_NAME] --version    # → [VERSION]
which [BINARY_NAME]        # → [PATH]
```

**Checklist:**
- [ ] `[BINARY_NAME] --version` returns version?
- [ ] `which [BINARY_NAME]` shows correct path?

❌ **STOP if validation fails** - Check installation output for errors.

### Step 3: Initialize (if applicable)

```bash
[INIT_COMMAND]
```

### Validation: `phase_3_complete`

```bash
[VERIFY_INIT_COMMAND]
# → [EXPECTED_OUTPUT]
```

❌ **STOP if validation fails** - Check initialization output for errors.

---

## 4. CONFIGURATION

Connect [TOOL_NAME] to your AI assistant (Phase 4).

### Option A: Configure for OpenCode

Add to `opencode.json` in your project root:

```json
{
  "mcp": {
    "[TOOL_ID]": {
      "type": "local",
      "command": ["/Users/YOUR_USERNAME/.local/bin/[BINARY]"],
      "environment": {
        "_NOTE_TOOLS": "[TOOL_DESCRIPTION]"
      },
      "enabled": true
    }
  }
}
```

> **Note**: Replace `YOUR_USERNAME` with your actual username. Find it with `whoami`.

### Option B: Configure for Claude Code CLI

Add to `.mcp.json` in your project root:

```json
{
  "mcpServers": {
    "[TOOL_ID]": {
      "command": "/Users/YOUR_USERNAME/.local/bin/[BINARY]",
      "args": []
    }
  }
}
```

### Option C: Configure for Claude Desktop

Add to `claude_desktop_config.json`:

**Location**:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "[TOOL_ID]": {
      "command": "/Users/YOUR_USERNAME/.local/bin/[BINARY]",
      "args": []
    }
  }
}
```

### Validation: `phase_4_complete`

```bash
cat [CONFIG_FILE] | python3 -m json.tool
ls -la /Users/YOUR_USERNAME/.local/bin/[BINARY]
```

**Checklist:**
- [ ] Configuration file has valid JSON syntax?
- [ ] Binary path in config exists?
- [ ] Username replaced with actual username?

❌ **STOP if validation fails** - Fix configuration syntax or paths.

---

## 5. VERIFICATION

Verify end-to-end connection in your AI assistant.

### Step 1: Restart Your AI Client

```bash
opencode  # Or restart Claude Code/Desktop
```

### Step 2: Check MCP Server Is Loaded

Ask your AI assistant:
```
What MCP tools are available?
```

Expected: Should list [TOOL_NAME] tools.

### Step 3: Test with a Query

```bash
[TEST_COMMAND]
```

### Success Criteria (`phase_5_complete`)

- [ ] ✅ MCP server appears in tool list
- [ ] ✅ [PRIMARY_COMMAND] returns results
- [ ] ✅ No connection errors in responses

❌ **STOP if validation fails** - Check MCP configuration, restart client.

---

## 6. USAGE

### Daily Workflow

```bash
# Start your AI client - MCP starts automatically
opencode

# Or use CLI directly
[CLI_COMMAND]
```

### Common Operations

```bash
# [OPERATION_1_DESCRIPTION]
[OPERATION_1_COMMAND]

# [OPERATION_2_DESCRIPTION]
[OPERATION_2_COMMAND]
```

---

## 7. TROUBLESHOOTING

### Common Errors

**❌ "Command not found: [BINARY]"**
- **Cause**: Binary not in PATH after installation.
- **Fix**: 
  ```bash
  source "$HOME/.local/bin/env"
  # Or add to ~/.zshrc: export PATH="$HOME/.local/bin:$PATH"
  ```

**❌ "MCP server not appearing in tools"**
- **Cause**: Configuration file issue or path incorrect.
- **Fix**:
  1. Check config syntax: `python3 -m json.tool < [CONFIG_FILE]`
  2. Verify path exists: `ls -la [BINARY_PATH]`
  3. Restart AI client completely.

**❌ "[ERROR_MESSAGE]"**
- **Cause**: [CAUSE_DESCRIPTION]
- **Fix**:
  ```bash
  [FIX_COMMAND]
  ```

---

## 8. RESOURCES

### File Locations

| Path            | Purpose          |
| --------------- | ---------------- |
| `[BINARY_PATH]` | [BINARY_PURPOSE] |
| `[CONFIG_PATH]` | [CONFIG_PURPOSE] |

### CLI Command Reference

```bash
# [COMMAND_1_DESCRIPTION]
[COMMAND_1]

# [COMMAND_2_DESCRIPTION]
[COMMAND_2]
```

### External Resources

- **GitHub Repository**: [REPOSITORY_URL]
- **Documentation**: [DOCS_URL]

---

## Quick Start Summary

```bash
# 1. Prerequisites
[PREREQUISITE_COMMAND]

# 2. Install
[INSTALL_COMMAND]

# 3. Initialize (if applicable)
[INIT_COMMAND]

# 4. Configure MCP (add to opencode.json)
# See Configuration section above

# 5. Restart AI client and start using!
```

---

**Installation Complete!**

You now have [TOOL_NAME] installed and configured. [BRIEF_USAGE_INSTRUCTION]

---

## 14. RELATED RESOURCES

### Templates
- [skill_asset_template.md](../opencode/skill_asset_template.md) - Pattern reference for this document
- [frontmatter_templates.md](./frontmatter_templates.md) - YAML frontmatter examples

### Standards
- [install_guide_creation.md](../../references/specific/install_guide_creation.md) - Phase validation rules and creation workflow
- [core_standards.md](../../references/global/core_standards.md) - Document formatting standards

### Examples
- [MCP - Spec Kit Memory.md](../../../../install_guides/MCP%20-%20Spec%20Kit%20Memory.md) - MCP server example
- [MCP - Code Mode.md](../../../../install_guides/MCP%20-%20Code%20Mode.md) - Code Mode installation

### Skill Reference
- [sk-doc SKILL.md](../../SKILL.md) - Mode 4: Install Guide Creation

<!-- /ANCHOR:complete-template -->
