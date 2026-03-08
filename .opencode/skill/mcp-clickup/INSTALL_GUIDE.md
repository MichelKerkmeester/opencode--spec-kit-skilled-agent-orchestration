# ClickUp MCP Installation Guide

Complete installation and configuration guide for ClickUp integration, enabling project management through CLI (cu) for daily task operations and MCP (Code Mode) for enterprise features. Two installation paths: CLI for speed and sprint management, MCP for documents, goals, webhooks, time tracking, and bulk operations.

> **Part of OpenCode Installation.** See [Master Installation Guide](../README.md) for complete setup.

**Two approaches available:**

| Approach | Tool | Type | Auth | Best For |
|----------|------|------|------|----------|
| **CLI** | `@krodak/clickup-cli` (cu) | npm global | API Token + Team ID | Speed, sprints, daily ops |
| **MCP** | `@taazkareem/clickup-mcp-server` | Code Mode | API Key + Team ID | Docs, goals, webhooks, bulk |

**Recommendation:** Install both for full coverage. CLI handles daily task operations; MCP adds enterprise features.

---

## 0. AI-First Install Guide

Copy and paste this prompt to your AI assistant to get installation help:

```
I want to install ClickUp integration for project management.

Please help me set up both tools:

CLI (cu) - for daily task ops and sprints:
- npm install -g @krodak/clickup-cli
- Requires Node >= 22

MCP (Code Mode) - for enterprise features:
- Already in .utcp_config.json
- Needs CLICKUP_API_KEY and CLICKUP_TEAM_ID

My ClickUp API token is: [paste from ClickUp Settings > Apps > API Token]
My Team ID is: [paste from ClickUp Settings > Workspaces]

I'm using: [Claude Code / OpenCode / VS Code Copilot / Cursor]
```

---

## 1. Prerequisites

### ClickUp API Token

1. Open [ClickUp Settings](https://app.clickup.com/settings)
2. Navigate to **Apps** section
3. Click **API Token**
4. Copy the token (starts with `pk_`)

### ClickUp Team ID

1. Open [ClickUp Settings](https://app.clickup.com/settings)
2. Navigate to **Workspaces**
3. Copy the Team ID (numeric)

### Node.js

| Tool | Minimum | Recommended |
|------|---------|-------------|
| CLI | 22.0.0 | Latest LTS |
| MCP | 18.0.0 | 22+ |

Check your version: `node --version`

---

## 2. CLI Installation (cu)

### Install via npm

```bash
npm install -g @krodak/clickup-cli
```

### Install via Homebrew (macOS)

```bash
brew tap krodak/tap && brew install clickup-cli
```

### Configure

```bash
# Interactive setup (recommended)
cu init
# Prompts for: API token, Team ID
```

### Manual Configuration

Config file: `~/.config/cu/config.json`

```json
{
  "apiToken": "pk_your_token_here",
  "teamId": "your_team_id"
}
```

### Environment Variable Overrides

```bash
export CU_API_TOKEN="pk_your_token_here"
export CU_TEAM_ID="your_team_id"
```

### Verify

```bash
cu auth       # Should show authenticated
cu tasks      # Should list your tasks
```

### PATH Troubleshooting

If `cu --version` shows "Taylor UUCP" instead of the ClickUp CLI, the system UUCP binary is being found first:

```bash
# Check which cu is being used
which cu

# Ensure npm global bin comes first in PATH
echo 'export PATH="$(npm config get prefix)/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Verify
which cu  # Should now point to npm global
cu auth   # Should work
```

---

## 3. MCP Installation (Code Mode)

### Configuration

Already configured in `.utcp_config.json`:

```json
{
  "name": "clickup",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "clickup": {
        "transport": "stdio",
        "command": "npx",
        "args": ["-y", "@taazkareem/clickup-mcp-server@latest"],
        "env": {
          "CLICKUP_API_KEY": "${CLICKUP_API_KEY}",
          "CLICKUP_TEAM_ID": "${CLICKUP_TEAM_ID}"
        }
      }
    }
  }
}
```

### Environment Variables

Add to `.env`:

```bash
# CRITICAL: Code Mode requires PREFIXED variable names!
# The prefix is the "name" field from .utcp_config.json (e.g., "clickup")
clickup_CLICKUP_API_KEY=pk_your_token_here
clickup_CLICKUP_TEAM_ID=your_team_id_here
```

### Verify

```typescript
// Discover ClickUp tools via Code Mode
search_tools({ task_description: "clickup" });
// Expected: List of clickup.clickup_* tools (46 total)

// Test workspace access
call_tool_chain({
  code: `
    const ws = await clickup.clickup_get_workspace({});
    return ws;
  `
});
```

---

## 4. MCP Client Configurations

### OpenCode (`opencode.json`)

```json
{
  "mcp": {
    "code-mode": {
      "type": "local",
      "command": ["npx", "-y", "utcp-mcp"],
      "env": {
        "UTCP_CONFIG_PATH": ".utcp_config.json"
      }
    }
  }
}
```

### Claude Desktop (`claude_desktop_config.json`)

```json
{
  "mcpServers": {
    "code-mode": {
      "command": "npx",
      "args": ["-y", "utcp-mcp"],
      "env": {
        "UTCP_CONFIG_PATH": "/path/to/.utcp_config.json"
      }
    }
  }
}
```

---

## 5. Verification Checklist

| Check | CLI | MCP |
|-------|-----|-----|
| Tool installed | `cu auth` succeeds | `search_tools("clickup")` returns tools |
| Auth configured | `cu tasks` returns data | `get_workspace` returns data |
| Correct binary | `cu --version` shows ClickUp version | N/A |
| Node version | `node --version` >= 22 | >= 18 |

---

## 6. Troubleshooting

### CLI Issues

| Issue | Solution |
|-------|----------|
| `cu (Taylor UUCP)` shown | Wrong binary - fix PATH (see section 2) |
| `Error: Invalid API token` | Re-run `cu init` with correct token |
| `command not found: cu` | `npm install -g @krodak/clickup-cli` |
| Node version too old | Upgrade to Node >= 22 for CLI |

### MCP Issues

| Issue | Solution |
|-------|----------|
| `Variable not found` | Use prefixed names: `clickup_CLICKUP_API_KEY` |
| `Tool not found` | Verify `.utcp_config.json` has clickup entry |
| `Authentication failed` | Check API key starts with `pk_` |
| `Team not found` | Verify Team ID (numeric) in `.env` |

---

## 7. Related

- [SKILL.md](./SKILL.md) - AI agent instructions
- [README.md](./README.md) - User documentation
- [mcp-code-mode INSTALL_GUIDE](../mcp-code-mode/INSTALL_GUIDE.md) - Code Mode setup
