# Sequential Thinking MCP Server Installation Guide

Complete installation and configuration guide for the Sequential Thinking MCP server, enabling dynamic and reflective problem-solving through structured reasoning chains. Supports thought branching, revision of previous conclusions, hypothesis generation and verification, and adaptive thought count adjustment. Ideal for complex multi-step analysis, planning with course correction, debugging stuck issues, and problems requiring iterative refinement where the full scope may not be clear initially.

> **Part of OpenCode Installation.** See the [Master Installation Guide](../README.md) for complete setup.
> **Package:** `@modelcontextprotocol/server-sequential-thinking` | **Dependencies:** Node.js 18+ | **License:** MIT

---

## 0. AI-First Install Guide

Copy and paste this prompt to your AI assistant to get installation help:

```
I want to install the Sequential Thinking MCP server (@modelcontextprotocol/server-sequential-thinking).

Please help me:
1. Check if I have Node.js 18+ installed
2. Configure the MCP server for my environment (I'm using: [OpenCode / VS Code Copilot / Claude Desktop])
3. Verify the installation is working

This is an npx package, no manual installation needed. Guide me through the configuration.
```

The AI will:
- Verify Node.js 18+ is available on your system
- Add the correct configuration to your platform's config file
- Test that the `sequential_thinking_sequentialthinking` tool is accessible
- Show you how to use dynamic thinking with branching and revisions

**Expected setup time:** 2 to 3 minutes

### Quick Success Check (30 seconds)

After configuration, run this test immediately:

1. Open your AI client (OpenCode, VS Code Copilot, or Claude Desktop)
2. Ask: `Use sequential thinking to analyze: "What is the best approach to organize a complex task?"`
3. The AI invokes `sequential_thinking_sequentialthinking` and shows structured output

Not working? Go to [Troubleshooting](#9-troubleshooting).

---

## Table of Contents

0. [AI-First Install Guide](#0-ai-first-install-guide)
1. [Overview](#1-overview)
2. [Prerequisites](#2-prerequisites)
3. [Installation](#3-installation)
4. [Configuration](#4-configuration)
5. [Verification](#5-verification)
6. [Usage](#6-usage)
7. [Features](#7-features)
8. [Examples](#8-examples)
9. [Troubleshooting](#9-troubleshooting)
10. [Resources](#10-resources)

---

## 1. Overview

Sequential Thinking is an official Model Context Protocol (MCP) server that enables dynamic, reflective problem-solving through structured thought sequences. Unlike rigid frameworks, it allows flexible thinking that can adapt and evolve as understanding deepens.

### Core Principle

> **Install once, verify at each step.** Each phase has a validation checkpoint. Do not proceed until the checkpoint passes.

### Source Repository

| Property    | Value                                                                                                                              |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **GitHub**  | [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking)                   |
| **npm**     | [@modelcontextprotocol/server-sequential-thinking](https://www.npmjs.com/package/@modelcontextprotocol/server-sequential-thinking) |
| **License** | MIT                                                                                                                                |
| **Runtime** | Node.js 18+                                                                                                                        |

> **Note:** This is an official MCP server maintained by the Model Context Protocol organization.

### Key Features

- **Dynamic Thought Sequences**: Adjust the number of thoughts as needed during analysis
- **Branching Exploration**: Explore alternative approaches from any thought point
- **Revision Support**: Reconsider and revise previous thoughts when new insights emerge
- **Flexible Structure**: No predefined stages. Adapt the thinking process to your problem
- **Progress Tracking**: Monitor your position in the thought sequence
- **Zero Installation**: Runs via npx, no manual installation required

### How It Works

```
Start Thinking → Record Thought 1 → Record Thought 2 → ... → Final Conclusion
                      ↓                    ↓
                 [Revise if needed]   [Branch to explore alternatives]
```

The tool supports:
- **Linear progression**: Move through thoughts sequentially
- **Revisions**: Go back and reconsider earlier assumptions
- **Branching**: Explore multiple solution paths simultaneously
- **Dynamic adjustment**: Increase or decrease total thoughts as needed

---

## 2. Prerequisites

### Required Tools

- **Node.js 18 or higher**
  ```bash
  node --version
  # Should show v18.x.x or higher
  ```

- **npm/npx** (included with Node.js)
  ```bash
  npx --version
  ```

- **OpenCode CLI**, **VS Code with GitHub Copilot**, or **Claude Desktop**

### That's It

No additional installation is needed. The server runs via `npx`, which downloads and executes it automatically.

### Validation: `phase_1_complete`

Run these prerequisite checks before continuing:

```bash
node --version    # Must be v18.x or higher
npx --version     # Must return a version number
```

**Checklist:**
- [ ] `node --version` returns v18 or higher
- [ ] `npx --version` returns a version number
- [ ] An AI client is available (OpenCode, VS Code Copilot, or Claude Desktop)

❌ **STOP if validation fails** - install or upgrade Node.js 18+ before continuing.

---

## 3. Installation

Sequential Thinking runs via npx. No manual installation is required beyond having Node.js 18+.

### Verify npx Can Reach the Package

```bash
npx -y @modelcontextprotocol/server-sequential-thinking --help 2>&1 | head -5
```

This command downloads and runs the package once to confirm connectivity and availability. The first run may take a few seconds while npx fetches the package.

### Validation: `phase_2_complete`

```bash
npx -y @modelcontextprotocol/server-sequential-thinking --help 2>&1 | head -5
```

**Checklist:**
- [ ] Command runs without network errors
- [ ] No `npm ERR!` or `ENOTFOUND` output

❌ **STOP if validation fails** - check your network connection or npm registry access.

### Initialize (No Action Required)

The Sequential Thinking server starts on demand via your MCP configuration. There is no initialization step, no database to create, and no service to start manually. Proceed directly to configuration.

### Validation: `phase_3_complete`

No explicit initialization is required for this package. `phase_3_complete` is satisfied when `phase_2_complete` passes and your config file is ready to be updated in Section 4.

❌ **STOP if validation fails** - do not proceed to configuration until the npx connectivity check succeeds.

---

## 4. Configuration

Sequential Thinking MCP can be configured for different AI platforms. Choose the option that matches your environment.

### Option A: Configure for OpenCode

Add to `opencode.json` in your project root:

```json
{
  "mcp": {
    "sequential_thinking": {
      "type": "local",
      "command": [
        "npx",
        "-y",
        "@modelcontextprotocol/server-sequential-thinking"
      ]
    }
  }
}
```

### Option B: Configure for VS Code Copilot

#### Method 1: Workspace Configuration

Create `.vscode/mcp.json` in your workspace:

```json
{
  "mcpServers": {
    "sequential_thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    }
  }
}
```

#### Method 2: User Settings

Add to `.vscode/settings.json`:

```json
{
  "github.copilot.chat.mcp.enabled": true,
  "github.copilot.chat.mcp.servers": {
    "sequential_thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    }
  }
}
```

### Option C: Configure for Claude Desktop

Add to `claude_desktop_config.json`:

**Location:**
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- Linux: `~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "sequential_thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    }
  }
}
```

### Option D: Docker Installation

For containerized environments, you can run Sequential Thinking via Docker.

**Configuration:**

```json
{
  "mcpServers": {
    "sequentialthinking": {
      "command": "docker",
      "args": ["run", "--rm", "-i", "mcp/sequentialthinking"]
    }
  }
}
```

**Build the Docker image:**

```bash
docker build -t mcp/sequentialthinking -f src/sequentialthinking/Dockerfile .
```

**Environment Variables:**

| Variable                  | Description                       | Default |
| ------------------------- | --------------------------------- | ------- |
| `DISABLE_THOUGHT_LOGGING` | Set to `true` to disable logging  | `false` |

**Example with logging disabled:**

```json
{
  "mcpServers": {
    "sequentialthinking": {
      "command": "docker",
      "args": ["run", "--rm", "-i", "-e", "DISABLE_THOUGHT_LOGGING=true", "mcp/sequentialthinking"]
    }
  }
}
```

### Validation: `phase_4_complete`

Validate that your configuration file has correct JSON syntax:

```bash
# For OpenCode
python3 -m json.tool < opencode.json > /dev/null && echo "JSON valid"

# For VS Code workspace config
python3 -m json.tool < .vscode/mcp.json > /dev/null && echo "JSON valid"

# For VS Code user settings
python3 -m json.tool < .vscode/settings.json > /dev/null && echo "JSON valid"
```

**Checklist:**
- [ ] JSON validation command exits with no errors
- [ ] Server name is `sequential_thinking` (underscore, not hyphen)
- [ ] Package name `@modelcontextprotocol/server-sequential-thinking` has no typos
- [ ] Config file is saved in the correct location for your platform

❌ **STOP if validation fails** - fix the JSON syntax error reported by `python3 -m json.tool` before restarting your AI client.

---

## 5. Verification

### Check 1: Verify in OpenCode

```bash
# Start OpenCode session
opencode

# Check MCP servers
> List available MCP tools

# Expected: sequential_thinking_sequentialthinking should appear
```

### Check 2: Verify in VS Code Copilot

1. Open VS Code in the configured workspace
2. Open Copilot Chat (Cmd+I or Ctrl+I)
3. Select **Agent Mode** from the popup menu
4. Click the **tools icon** (top left)
5. Look for `sequential_thinking_sequentialthinking` in the tools list

### Check 3: Test the Tool

Ask your AI assistant:

```
Use sequential thinking to analyze: "What is the best approach to organize this task?"
```

Expected: The AI invokes the tool and shows structured thinking output with numbered thoughts.

### Validation: `phase_5_complete`

```bash
# No shell command is needed. Verify through your AI client directly.
# Your AI client successfully lists and invokes sequential_thinking_sequentialthinking.
```

**Checklist:**
- [ ] `sequential_thinking_sequentialthinking` appears in the tools list
- [ ] AI client invokes the tool when asked to think step by step
- [ ] Tool returns numbered thought output (thought 1, thought 2, etc.)
- [ ] No `tool not found` or `MCP server error` messages appear

❌ **STOP if validation fails** - restart your AI client after saving the config. If the tool still does not appear, check [Troubleshooting](#9-troubleshooting).

---

## 6. Usage

### Invocation

Sequential Thinking is a native MCP tool. Call it directly:

```typescript
sequential_thinking_sequentialthinking({
  thought: "Your current thinking step",
  thoughtNumber: 1,
  totalThoughts: 5,
  nextThoughtNeeded: true
})
```

### Natural Language Triggers

The AI will typically invoke this tool when you use phrases like:

```
Think through this step by step...
Analyze this systematically...
I need to work through a complex decision about...
Help me reason through this problem...
Think hard about this...
```

### Thinking Patterns

**Linear Analysis:**
```
Thought 1 → Thought 2 → Thought 3 → Conclusion
```

**With Revision:**
```
Thought 1 → Thought 2 → Revise Thought 1 → Thought 3 → Conclusion
```

**With Branching:**
```
Thought 1 → Thought 2 → Branch A: Thought 3a → ...
                      ↘ Branch B: Thought 3b → ...
```

### When to Use Sequential Thinking

| Scenario                        | Why It Helps                                           |
| ------------------------------- | ------------------------------------------------------ |
| **Multi-step debugging**        | Standard approaches failed. Systematic analysis needed |
| **Architectural decisions**     | Significant trade-offs require structured evaluation   |
| **Complex refactoring**         | Changes span 3+ files with dependencies                |
| **User requests deep analysis** | Keywords: "think hard", "multiaicouncil", "analyze deeply" |
| **Unfamiliar territory**        | Need to explore options before committing              |

### When to Skip Sequential Thinking

| Scenario                  | Why Skip                                      |
| ------------------------- | --------------------------------------------- |
| **Simple fixes**          | Single-file changes with obvious solutions    |
| **Straightforward tasks** | Clear path forward, no trade-offs             |
| **Near context limit**    | Already using significant context             |
| **Speed priority**        | Quick response matters more than thoroughness |
| **Routine operations**    | File operations, simple refactors             |

### Token Cost

**Typical usage:** approximately 1,500 to 2,500 tokens per thinking session.

Consider this overhead when deciding whether to invoke the tool.

---

## 7. Features

### Required Parameters

| Parameter           | Type    | Description                                       |
| ------------------- | ------- | ------------------------------------------------- |
| `thought`           | string  | Your current thinking step content                |
| `thoughtNumber`     | integer | Position in sequence (1, 2, 3...)                 |
| `totalThoughts`     | integer | Estimated total thoughts needed (can adjust)      |
| `nextThoughtNeeded` | boolean | `true` if more thinking needed, `false` when done |

### Optional Parameters

| Parameter           | Type    | Description                                                |
| ------------------- | ------- | ---------------------------------------------------------- |
| `isRevision`        | boolean | Set `true` when reconsidering a previous thought           |
| `revisesThought`    | integer | Which thought number is being revised                      |
| `branchFromThought` | integer | Thought number where branch starts                         |
| `branchId`          | string  | Identifier for the current branch (e.g., "alternative-a") |
| `needsMoreThoughts` | boolean | Signal that more thoughts are needed beyond current total  |

### Dynamic Adjustment

The `totalThoughts` parameter can be adjusted at any point during a session:

```typescript
// Started with 3 thoughts, realized more are needed
sequential_thinking_sequentialthinking({
  thought: "This is more complex than expected...",
  thoughtNumber: 3,
  totalThoughts: 6,  // Increased from 3
  needsMoreThoughts: true,
  nextThoughtNeeded: true
})
```

---

## 8. Examples

### Example 1: Basic Analysis

```typescript
// Thought 1
sequential_thinking_sequentialthinking({
  thought: "Analyzing the authentication flow. Current implementation uses JWT tokens stored in localStorage, which has XSS vulnerability concerns.",
  thoughtNumber: 1,
  totalThoughts: 4,
  nextThoughtNeeded: true
})

// Thought 2
sequential_thinking_sequentialthinking({
  thought: "Alternative approaches: 1) HttpOnly cookies (better security), 2) Session tokens (stateful), 3) Token rotation (complexity trade-off).",
  thoughtNumber: 2,
  totalThoughts: 4,
  nextThoughtNeeded: true
})

// Thought 3
sequential_thinking_sequentialthinking({
  thought: "HttpOnly cookies provide XSS protection with minimal implementation changes. Need to handle CSRF separately.",
  thoughtNumber: 3,
  totalThoughts: 4,
  nextThoughtNeeded: true
})

// Thought 4 - Conclusion
sequential_thinking_sequentialthinking({
  thought: "Recommendation: Migrate to HttpOnly cookies with SameSite=Strict. Add CSRF token for state-changing requests. Implementation effort: ~4 hours.",
  thoughtNumber: 4,
  totalThoughts: 4,
  nextThoughtNeeded: false
})
```

### Example 2: With Revision

```typescript
// Thought 1
sequential_thinking_sequentialthinking({
  thought: "Initial assumption: The performance issue is in the database query.",
  thoughtNumber: 1,
  totalThoughts: 5,
  nextThoughtNeeded: true
})

// Thought 2
sequential_thinking_sequentialthinking({
  thought: "Query profiling shows 50ms response time, actually quite fast.",
  thoughtNumber: 2,
  totalThoughts: 5,
  nextThoughtNeeded: true
})

// Thought 3 - Revising Thought 1
sequential_thinking_sequentialthinking({
  thought: "Revising my earlier assumption: The bottleneck is NOT in the database. Looking at network waterfall, the issue is N+1 API calls from the frontend.",
  thoughtNumber: 3,
  totalThoughts: 5,
  isRevision: true,
  revisesThought: 1,
  nextThoughtNeeded: true
})

// Continue with corrected understanding...
```

### Example 3: With Branching

```typescript
// Thought 1
sequential_thinking_sequentialthinking({
  thought: "Need to choose between microservices and monolith for the new e-commerce platform.",
  thoughtNumber: 1,
  totalThoughts: 6,
  nextThoughtNeeded: true
})

// Thought 2 - Branch A: Microservices
sequential_thinking_sequentialthinking({
  thought: "Branch A - Microservices: Better scalability, independent deployments. But: Team of 5 developers, 3-month timeline. Risk of over-engineering.",
  thoughtNumber: 2,
  totalThoughts: 6,
  branchFromThought: 1,
  branchId: "microservices",
  nextThoughtNeeded: true
})

// Thought 3 - Branch B: Monolith
sequential_thinking_sequentialthinking({
  thought: "Branch B - Monolith: Faster initial development, simpler deployment. Can extract services later when team and scale grow.",
  thoughtNumber: 3,
  totalThoughts: 6,
  branchFromThought: 1,
  branchId: "monolith",
  nextThoughtNeeded: true
})

// Thought 4 - Compare branches and conclude
sequential_thinking_sequentialthinking({
  thought: "Comparing branches: Given team size and timeline, monolith wins. Can adopt 'modular monolith' pattern for future extraction.",
  thoughtNumber: 4,
  totalThoughts: 6,
  nextThoughtNeeded: true
})
```

---

## 9. Troubleshooting

### Tool Not Appearing

**Problem:** `sequential_thinking_sequentialthinking` tool not visible in your AI client.

**Solutions:**

1. **Restart your AI client** (OpenCode, VS Code, Claude Desktop)

2. **Verify Node.js version**
   ```bash
   node --version  # Must be 18+
   ```

3. **Test npx directly**
   ```bash
   npx -y @modelcontextprotocol/server-sequential-thinking --help
   ```

4. **Check configuration syntax**
   ```bash
   python3 -m json.tool < opencode.json
   ```

5. **Check for typos in config**
   - Server name: `sequential_thinking` (underscore, not hyphen)
   - Args: `["-y", "@modelcontextprotocol/server-sequential-thinking"]`

### npx Errors

**Problem:** npx fails to run the package.

**Solutions:**

1. **Clear npm cache**
   ```bash
   npm cache clean --force
   ```

2. **Check network or proxy settings**
   ```bash
   npm config get proxy
   npm config get https-proxy
   ```

3. **Try global install as fallback**
   ```bash
   npm install -g @modelcontextprotocol/server-sequential-thinking
   ```

### Tool Invocation Fails

**Problem:** Tool appears in the tools list but returns an error when called.

**Solutions:**

1. **Check parameter types**. Ensure `thoughtNumber` and `totalThoughts` are integers, not strings

2. **Verify required parameters**. All four required parameters must be present in every call

3. **Check boolean values**. Use `true` or `false`, not quoted strings

### Timeout or Slow Startup

**Problem:** First invocation of the tool is very slow or times out.

**Cause:** The first `npx` run downloads the package from the npm registry. On a slow network or cold cache, this can take longer than the MCP client's startup timeout.

**Solutions:**

1. **Pre-cache the package** by running it once before starting your AI client:
   ```bash
   npx -y @modelcontextprotocol/server-sequential-thinking --help
   ```

2. **Check network speed**. If on a restricted or slow network, consider the global install fallback:
   ```bash
   npm install -g @modelcontextprotocol/server-sequential-thinking
   ```
   Then update your config to use `node` instead of `npx`:
   ```json
   {
     "mcp": {
       "sequential_thinking": {
         "type": "local",
         "command": ["sequential-thinking"]
       }
     }
   }
   ```

### MCP Server Not in Tools List After Config Change

**Problem:** You updated the configuration file but the tool still does not appear after restarting.

**Cause:** Config file has a JSON syntax error, or the server name does not match what the client expects.

**Solutions:**

1. **Validate JSON syntax**
   ```bash
   python3 -m json.tool < opencode.json
   # or
   python3 -m json.tool < .vscode/mcp.json
   ```

2. **Confirm the server name uses an underscore**
   - Correct: `"sequential_thinking"` (underscore)
   - Incorrect: `"sequential-thinking"` (hyphen)

3. **Fully quit and reopen your AI client**. A simple reload is not always enough for MCP config changes to take effect in VS Code or Claude Desktop

### JSON Validation Error on Config Save

**Problem:** `python3 -m json.tool` reports a parse error on your config file.

**Common causes and fixes:**

| Symptom                          | Likely Cause                      | Fix                                                     |
| -------------------------------- | --------------------------------- | ------------------------------------------------------- |
| `Expecting ',' delimiter`        | Missing comma between properties  | Add the missing comma                                   |
| `Expecting property name`        | Trailing comma after last item    | Remove the trailing comma                               |
| `Expecting value`                | Empty value or unclosed string    | Check for missing closing quote or missing value        |
| `Extra data after JSON document` | Two JSON objects in the same file | Merge into one object rather than two separate blocks   |

---

## 10. Resources

### Official Documentation

| Resource          | URL                                                                                                                  |
| ----------------- | -------------------------------------------------------------------------------------------------------------------- |
| MCP Protocol      | https://modelcontextprotocol.io                                                                                      |
| MCP Specification | https://spec.modelcontextprotocol.io                                                                                 |
| MCP GitHub        | https://github.com/modelcontextprotocol                                                                              |
| npm Package       | https://www.npmjs.com/package/@modelcontextprotocol/server-sequential-thinking                                       |
| Source Code       | https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking                                     |

### Related MCP Servers

| Server              | Purpose                  |
| ------------------- | ------------------------ |
| **Spec Kit Memory** | Context preservation     |

### When to Combine Tools

```
Complex debugging      → Sequential Thinking + Grep/Glob (search for related code)
Architecture decisions → Sequential Thinking + Memory (recall past decisions)
Code exploration       → Grep/Glob (search codebase before changing)
```

### Validation Checkpoints Summary

| Checkpoint         | Meaning                                                    |
| ------------------ | ---------------------------------------------------------- |
| `phase_1_complete` | Node.js 18+ and npx are available                         |
| `phase_2_complete` | npx can reach and download the package                     |
| `phase_3_complete` | No initialization needed. Ready for configuration          |
| `phase_4_complete` | Config file is valid JSON with correct server name         |
| `phase_5_complete` | Tool appears in client and responds to invocation          |

---

**Need help?** See [Troubleshooting](#9-troubleshooting) or check the [MCP Protocol documentation](https://modelcontextprotocol.io) for server-level diagnostics.
