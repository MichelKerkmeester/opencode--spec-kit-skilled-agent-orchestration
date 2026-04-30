---
title: Configuration Guide - .utcp_config.json and Environment Setup
description: Configure MCP servers, environment variables, and credentials for Code Mode UTCP.
---

# Configuration Guide - .utcp_config.json and Environment Setup

Set up Code Mode UTCP with MCP servers, environment variables, and credentials.

---

## 1. OVERVIEW

### Required Files

**Two files required:**

1. **`.utcp_config.json`** - MCP server definitions and tool configuration
2. **`.env`** - API keys, tokens, and credentials

**File locations:** Both should be in the same directory (typically project root)

---

## 2. CONFIGURATION STRUCTURE

### Complete Example

```json
{
  "load_variables_from": [
    {
      "variable_loader_type": "dotenv",
      "env_file_path": ".env"
    }
  ],
  "tool_repository": {
    "tool_repository_type": "in_memory"
  },
  "tool_search_strategy": {
    "tool_search_strategy_type": "tag_and_description_word_match"
  },
  "manual_call_templates": [
    {
      "name": "webflow",
      "call_template_type": "mcp",
      "config": {
        "mcpServers": {
          "webflow": {
            "transport": "stdio",
            "command": "npx",
            "args": ["mcp-remote", "https://mcp.webflow.com/sse"],
            "env": {}
          }
        }
      }
    },
    {
      "name": "clickup",
      "call_template_type": "mcp",
      "config": {
        "mcpServers": {
          "clickup": {
            "transport": "stdio",
            "command": "npx",
            "args": ["-y", "@taazkareem/clickup-mcp-server"],
            "env": {
              "CLICKUP_API_KEY": "${CLICKUP_API_KEY}",
              "CLICKUP_TEAM_ID": "${CLICKUP_TEAM_ID}"
            }
          }
        }
      }
    },
    {
      "name": "figma",
      "call_template_type": "mcp",
      "config": {
        "mcpServers": {
          "figma": {
            "transport": "stdio",
            "command": "npx",
            "args": ["-y", "figma-developer-mcp", "--stdio"],
            "env": {
              "FIGMA_API_KEY": "${FIGMA_API_KEY}"
            }
          }
        }
      }
    }
  ]
}
```

---

## 3. CONFIGURATION ELEMENTS

### 1. Variable Loading

```json
"load_variables_from": [
  {
    "variable_loader_type": "dotenv",
    "env_file_path": ".env"
  }
]
```

**Purpose:** Load environment variables from `.env` file

**Options:**
- `"variable_loader_type": "dotenv"` - Load from .env file
- `"variable_loader_type": "system"` - Load from system environment

**File path:**
- Relative to `.utcp_config.json` location
- Can be absolute path if needed

### 2. Tool Repository

```json
"tool_repository": {
  "tool_repository_type": "in_memory"
}
```

**Purpose:** Define where tool schemas are stored

**Options:**
- `"in_memory"` - Store in memory (recommended, faster)
- `"file"` - Store in file system (persistent)

**Recommendation:** Use `"in_memory"` for best performance

### 3. Tool Search Strategy

```json
"tool_search_strategy": {
  "tool_search_strategy_type": "tag_and_description_word_match"
}
```

**Purpose:** Define how `search_tools()` finds tools

**Options:**
- `"tag_and_description_word_match"` - Keyword matching (fast, simple)
- `"semantic"` - Semantic search (slower, more accurate)
- `"exact"` - Exact name matching only

**Recommendation:** Use `"tag_and_description_word_match"` for balance of speed and accuracy

### 4. Manual Call Templates

**Structure:**

```json
"manual_call_templates": [
  {
    "name": "manual_name",           // TypeScript namespace
    "call_template_type": "mcp",      // Integration type
    "config": {                       // Type-specific config
      "mcpServers": {
        "server_key": {
          "transport": "stdio",
          "command": "npx",
          "args": ["package-name"],
          "env": {
            "VAR_NAME": "${ENV_VAR}"
          }
        }
      }
    }
  }
]
```

**Key fields explained:**

#### `name` Field

- **Purpose:** TypeScript namespace for tool calls
- **Usage:** `await {name}.{name}_{tool}(...)`
- **Rules:**
  - Must be valid JavaScript identifier
  - No hyphens, spaces, or special characters
  - Use underscores for word separation
  - Case-sensitive

**Examples:**
```json
"name": "webflow"           // ✅ Good
"name": "clickup"           // ✅ Good
"name": "chrome_devtools_1" // ✅ Good (with instance number)
"name": "webflow-api"       // ❌ Bad (hyphens not allowed)
"name": "my server"         // ❌ Bad (spaces not allowed)
```

#### `call_template_type` Field

**Options:**

1. **`"mcp"`** - MCP server integration (most common)
   ```json
   {
     "call_template_type": "mcp",
     "config": {
       "mcpServers": { /* MCP config */ }
     }
   }
   ```

2. **`"http"`** - HTTP API integration
   ```json
   {
     "call_template_type": "http",
     "config": {
       "base_url": "https://api.example.com",
       "headers": { "Authorization": "Bearer ${API_KEY}" }
     }
   }
   ```

3. **`"cli"`** - CLI tool integration
   ```json
   {
     "call_template_type": "cli",
     "config": {
       "command": "git",
       "args_template": ["status"]
     }
   }
   ```

4. **`"file"`** - File-based tool configuration
   ```json
   {
     "call_template_type": "file",
     "config": {
       "file_path": "./tools/custom_tools.json"
     }
   }
   ```

#### MCP Server Configuration

**Transport types:**

1. **`"stdio"`** (Standard Input/Output)
   ```json
   {
     "transport": "stdio",
     "command": "npx",
     "args": ["-y", "figma-developer-mcp", "--stdio"],
     "env": {
       "FIGMA_API_KEY": "${FIGMA_API_KEY}"
     }
   }
   ```
   - **Use when:** Running Node.js/npm packages
   - **Benefits:** Simple setup, wide compatibility

2. **`"sse"`** (Server-Sent Events)
   ```json
   {
     "transport": "sse",
     "url": "https://mcp.service.com/sse",
     "headers": {
       "Authorization": "Bearer ${API_KEY}"
     }
   }
   ```
   - **Use when:** Remote MCP server endpoints
   - **Benefits:** No local installation needed

#### Environment Variables

**Syntax:** `"${VARIABLE_NAME}"`

**Examples:**
```json
"env": {
  "CLICKUP_API_KEY": "${CLICKUP_API_KEY}",
  "CLICKUP_TEAM_ID": "${CLICKUP_TEAM_ID}",
  "FIGMA_API_KEY": "${FIGMA_API_KEY}"
}
```

**Variable substitution:**
- Loaded from `.env` file
- System environment variables
- Nested variable references supported

---

## 4. ENVIRONMENT VARIABLES

### Critical: Prefixed Variable Names

> **⚠️ IMPORTANT**: Code Mode prefixes ALL environment variables with `{manual_name}_` from your `.utcp_config.json`. You MUST use prefixed variable names in your `.env` file.

### Structure

```bash
# ⚠️ Code Mode requires PREFIXED variable names: {manual_name}_{VAR}
# The prefix comes from the "name" field in .utcp_config.json

# ClickUp Configuration (prefix: clickup)
clickup_CLICKUP_API_KEY=pk_your_api_key_here
clickup_CLICKUP_TEAM_ID=90151466006

# Figma Configuration (prefix: figma)
figma_FIGMA_API_KEY=figd_your_token_here

# Notion Configuration (prefix: notion)
notion_NOTION_TOKEN=ntn_your_token_here

# GitHub Configuration (prefix: github)
github_GITHUB_TOKEN=ghp_your_token_here

# Webflow (prefix: webflow, if using direct API)
webflow_WEBFLOW_API_TOKEN=your_webflow_token_here

# Chrome DevTools (usually no auth needed)
# No environment variables required for Chrome DevTools
```

### Best Practices

1. **Never commit `.env` to version control**
   ```bash
   echo ".env" >> .gitignore
   ```

2. **Always use prefixed variable names**
   ```bash
   # CORRECT (prefixed with manual name)
   clickup_CLICKUP_API_KEY=pk_123...
   figma_FIGMA_API_KEY=figd_abc...

   # WRONG (non-prefixed - will cause errors)
   CLICKUP_API_KEY=pk_123...
   FIGMA_API_KEY=figd_abc...
   ```

3. **Group by service with prefix**
   ```bash
   # ClickUp (manual name: clickup)
   clickup_CLICKUP_API_KEY=...
   clickup_CLICKUP_TEAM_ID=...

   # Figma (manual name: figma)
   figma_FIGMA_API_KEY=...
   ```

4. **Provide example file with prefixes**
   ```bash
   # Create .env.example
   cat > .env.example <<EOF
   clickup_CLICKUP_API_KEY=your_api_key_here
   clickup_CLICKUP_TEAM_ID=your_team_id_here
   figma_FIGMA_API_KEY=your_token_here
   EOF
   ```

---

## 5. ADDING MCP SERVERS

### Step-by-Step Guide

**Example:** Adding GitHub MCP server

**Step 1:** Find MCP server package

```bash
# Search npm for MCP servers
npm search @modelcontextprotocol/server-

# Or check https://github.com/modelcontextprotocol/servers
```

**Step 2:** Add to `.utcp_config.json`

```json
{
  "manual_call_templates": [
    {
      "name": "github",
      "call_template_type": "mcp",
      "config": {
        "mcpServers": {
          "github": {
            "transport": "stdio",
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-github"],
            "env": {
              "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
            }
          }
        }
      }
    }
  ]
}
```

**Step 3:** Add credentials to `.env`

```bash
# GitHub Configuration
GITHUB_TOKEN=ghp_your_personal_access_token_here
```

**Step 4:** Restart Code Mode MCP server

```bash
# If running as service, restart it
# Restart your AI application to pick up configuration changes
```

**Step 5:** Discover available tools

```typescript
// Search for GitHub tools
const tools = await search_tools({
  task_description: "github pull request",
  limit: 10
});

console.log(tools.map(t => t.name));
// Output: ["github.github_get_pull_request", "github.github_create_pr", ...]
```

**Step 6:** Use the new tools

```typescript
call_tool_chain({
  code: `
    // Get pull request
    const pr = await github.github_get_pull_request({
      owner: "microsoft",
      repo: "vscode",
      pull_number: 12345
    });

    console.log('PR Title:', pr.title);
    console.log('PR State:', pr.state);

    return pr;
  `
});
```

---

## 6. COMMON SERVER CONFIGURATIONS

### Webflow (Remote SSE)

```json
{
  "name": "webflow",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "webflow": {
        "transport": "stdio",
        "command": "npx",
        "args": ["mcp-remote", "https://mcp.webflow.com/sse"],
        "env": {}
      }
    }
  }
}
```

**Notes:**
- Uses `mcp-remote` wrapper for SSE transport
- No authentication in env (handled via OAuth in Webflow dashboard)
- Remote endpoint, no local installation

### ClickUp (stdio with npm)

```json
{
  "name": "clickup",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "clickup": {
        "transport": "stdio",
        "command": "npx",
        "args": ["-y", "@taazkareem/clickup-mcp-server"],
        "env": {
          "CLICKUP_API_KEY": "${CLICKUP_API_KEY}",
          "CLICKUP_TEAM_ID": "${CLICKUP_TEAM_ID}"
        }
      }
    }
  }
}
```

**Notes:**
- Uses `-y` flag to auto-install if not cached
- Requires API key and team ID
- Get API key from ClickUp Settings → Apps

### Chrome DevTools (Multiple Instances)

```json
{
  "name": "chrome_devtools_1",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "chrome-devtools-1": {
        "transport": "stdio",
        "command": "npx",
        "args": ["chrome-devtools-mcp@latest"],
        "env": {}
      }
    }
  }
},
{
  "name": "chrome_devtools_2",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "chrome-devtools-2": {
        "transport": "stdio",
        "command": "npx",
        "args": ["chrome-devtools-mcp@latest"],
        "env": {}
      }
    }
  }
}
```

**Notes:**
- Multiple instances for managing separate browser sessions
- No authentication needed
- Use instance numbers in manual names to prevent conflicts

---

## 7. TROUBLESHOOTING

### Problem: Variable '{manual_name}_{VAR}' Not Found

**Symptoms:**
```
Error: Variable 'clickup_CLICKUP_API_KEY' referenced in call template configuration not found
```

**Cause:** Code Mode prefixes all environment variables with the manual name from your configuration. If your `.env` file uses non-prefixed variable names, Code Mode won't find them.

**Solution:**

In your `.env` file, use the **prefixed format**:
```bash
# WRONG (non-prefixed)
CLICKUP_API_KEY=pk_xxx

# CORRECT (prefixed with manual name)
clickup_CLICKUP_API_KEY=pk_xxx
```

The prefix comes from the `"name"` field in your `.utcp_config.json`:
```json
{
  "name": "clickup",  // ← This becomes the prefix
  ...
}
```

**Quick Fix:**
1. Find your manual name: `grep '"name":' .utcp_config.json`
2. Update `.env` to use prefixed format: `{manual_name}_{VAR_NAME}=value`
3. Restart Code Mode MCP server

**Reference Table:**

| Manual Name | Config Reference | Required .env Variable |
|-------------|-----------------|----------------------|
| `clickup` | `${CLICKUP_API_KEY}` | `clickup_CLICKUP_API_KEY` |
| `figma` | `${FIGMA_API_KEY}` | `figma_FIGMA_API_KEY` |
| `notion` | `${NOTION_TOKEN}` | `notion_NOTION_TOKEN` |
| `github` | `${GITHUB_TOKEN}` | `github_GITHUB_TOKEN` |

### Problem: Environment Variables Not Loading

**Symptoms:**
```
Error: Environment variable CLICKUP_API_KEY not found
```

**Solutions:**
1. Check `.env` file exists in same directory as `.utcp_config.json`
2. Verify variable name matches exactly (case-sensitive)
3. **Use prefixed format**: `{manual_name}_{VAR}` (see above)
4. Restart Code Mode MCP server after changing `.env`
5. Check `load_variables_from` config is correct:
   ```json
   "load_variables_from": [
     {
       "variable_loader_type": "dotenv",
       "env_file_path": ".env"
     }
   ]
   ```

### Problem: MCP Server Fails to Start

**Symptoms:**
```
Error: Failed to start MCP server: webflow
```

**Solutions:**
1. Check `command` and `args` are correct
2. Test command manually:
   ```bash
   npx -y figma-developer-mcp --stdio
   ```
3. Verify npm/npx is in PATH
4. Check for missing dependencies
5. Review server logs for specific errors

### Problem: Tools Not Discovered

**Symptoms:**
```typescript
const tools = await list_tools();
// Returns: { tools: [] }
```

**Solutions:**
1. Verify MCP server started successfully
2. Check manual name in config matches expected namespace
3. Restart Code Mode MCP server
4. Test with `search_tools()` instead of `list_tools()`
5. Review Code Mode MCP server logs

---

## 8. VALIDATION

**Use validation script:**

```bash
# Validate configuration file
python scripts/validate_config.py .utcp_config.json
```

**Manual validation checklist:**

- [ ] JSON is valid (no syntax errors)
- [ ] All manual names are valid JavaScript identifiers
- [ ] All required env variables are defined in `.env`
- [ ] No duplicate manual names
- [ ] `load_variables_from` points to correct `.env` path
- [ ] MCP server commands are executable
- [ ] All required fields present in each manual template

---

## 9. BEST PRACTICES

### 1. Organize Manual Names Logically

**Good:**
```json
"manual_call_templates": [
  { "name": "webflow", ... },
  { "name": "clickup", ... },
  { "name": "figma", ... },
  { "name": "notion", ... },
  { "name": "chrome_devtools_1", ... },
  { "name": "chrome_devtools_2", ... }
]
```

**Bad:**
```json
"manual_call_templates": [
  { "name": "tool1", ... },  // Not descriptive
  { "name": "server", ... },  // Too generic
  { "name": "api-client", ... }  // Invalid (hyphen)
]
```

### 2. Use Consistent Naming

**For services with multiple instances:**
```json
{ "name": "chrome_devtools_1", ... }
{ "name": "chrome_devtools_2", ... }
{ "name": "database_prod", ... }
{ "name": "database_dev", ... }
```

### 3. Document Required Environment Variables

```json
{
  "name": "clickup",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "clickup": {
        "transport": "stdio",
        "command": "npx",
        "args": ["-y", "@taazkareem/clickup-mcp-server"],
        "env": {
          "CLICKUP_API_KEY": "${CLICKUP_API_KEY}",      // Required: Get from ClickUp Settings
          "CLICKUP_TEAM_ID": "${CLICKUP_TEAM_ID}"        // Required: Your workspace ID
        }
      }
    }
  }
}
```

### 4. Keep Configuration Modular

**Separate concerns:**
- Core config (`.utcp_config.json`)
- Secrets (`.env`)
- Examples (`.env.example`)
- Documentation (this file)

---

## 10. SUMMARY

**Configuration checklist:**
1. ✅ `.utcp_config.json` with all MCP servers defined
2. ✅ `.env` with all required API keys/tokens
3. ✅ Manual names are valid JavaScript identifiers
4. ✅ Environment variable substitution syntax correct (`${VAR}`)
5. ✅ All MCP server commands are executable
6. ✅ Configuration validated (no JSON errors)
7. ✅ Code Mode MCP server restarted after config changes

**When in doubt:** Use the template files in `assets/` and validation script in `scripts/` to ensure correct configuration.

---

## 11. RELATED RESOURCES

### Reference Files
- [architecture.md](./architecture.md) - System architecture and data flow
- [naming_convention.md](./naming_convention.md) - Critical naming patterns for tool calls
- [tool_catalog.md](./tool_catalog.md) - Complete list of available MCP tools

### Templates
- [config_template.md](../assets/config_template.md) - Configuration template
- [env_template.md](../assets/env_template.md) - Environment variables example
