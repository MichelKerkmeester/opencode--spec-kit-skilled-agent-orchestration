---
title: Configuration Template
description: Complete .utcp_config.json template for Code Mode UTCP setup with multiple MCP servers.
---

# Configuration Template

Copy-ready `.utcp_config.json` template for Code Mode UTCP with pre-configured MCP servers.

---

## 1. OVERVIEW

### Purpose

Base configuration file for Code Mode UTCP with progressive tool loading and environment variable support. Includes pre-configured templates for Webflow, ClickUp, Figma, Notion, and Chrome DevTools.

### Usage

Copy this template to `.utcp_config.json` in your project root, then customize the `manual_call_templates` array with your desired MCP servers. Reference credentials using `${VARIABLE_NAME}` syntax.

---

## 2. TEMPLATE

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
    },
    {
      "name": "notion",
      "call_template_type": "mcp",
      "config": {
        "mcpServers": {
          "notion": {
            "transport": "stdio",
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-notion"],
            "env": {
              "NOTION_TOKEN": "${NOTION_TOKEN}"
            }
          }
        }
      }
    },
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
  ]
}
```

---

## 3. CONFIGURATION SECTIONS

### load_variables_from

**Purpose**: Load environment variables from external sources for secure credential management.

**Configuration:**
```json
"load_variables_from": [
  {
    "variable_loader_type": "dotenv",
    "env_file_path": ".env"
  }
]
```

**Options:**
- `variable_loader_type`: `"dotenv"` (loads from .env file)
- `env_file_path`: Path to .env file (default: `".env"`)

**Best Practice**: Store all API keys and tokens in `.env` file, never commit to version control.

### tool_repository

**Purpose**: Configure how tools are stored and accessed.

**Configuration:**
```json
"tool_repository": {
  "tool_repository_type": "in_memory"
}
```

**Options:**
- `tool_repository_type`: `"in_memory"` (stores tools in memory for fast access)

**Note**: In-memory storage provides the best performance for Code Mode operations.

### tool_search_strategy

**Purpose**: Define how tool discovery works when using `search_tools()`.

**Configuration:**
```json
"tool_search_strategy": {
  "tool_search_strategy_type": "tag_and_description_word_match"
}
```

**Options:**
- `tool_search_strategy_type`: `"tag_and_description_word_match"` (searches tool names and descriptions)

**Usage**: Enables semantic tool discovery via `search_tools({ task_description: "..." })`.

### manual_call_templates

**Purpose**: Define all MCP servers that Code Mode can access.

**Structure**: Array of manual configurations, each with:
- `name`: Manual name (used as namespace in code: `manual.manual_tool()`)
- `call_template_type`: `"mcp"` (MCP server type)
- `config.mcpServers`: Object with MCP server configuration

**Critical Naming Pattern**: Tools are called as `{manual_name}.{manual_name}_{tool_name}`
- Example: `webflow.webflow_sites_list()`
- See [naming_convention.md](../references/naming_convention.md) for complete guide

---

## 4. MCP SERVER CONFIGURATIONS

### Webflow (Remote MCP)

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

**Features**: 40+ tools for sites, collections, pages, CMS items
**Authentication**: Handled by Webflow's remote MCP server via browser OAuth flow. When first connecting, you'll be prompted to authenticate via Webflow's web interface. Credentials are managed server-side - no local token storage required.
**Transport**: `stdio` (standard input/output)

### ClickUp

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

**Features**: 20+ tools for tasks, lists, workspaces
**Authentication**: Requires `clickup_CLICKUP_API_KEY` and `clickup_CLICKUP_TEAM_ID` in .env (prefixed with the manual name)
**Package**: `@taazkareem/clickup-mcp-server` (installed on-demand via npx)

### Figma

```json
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
```

**Features**: 18 tools for files, comments, images, components, styles
**Authentication**: Requires `figma_FIGMA_API_KEY` in .env (prefixed with the manual name)
**Package**: `figma-developer-mcp` (Framelink third-party)

### Notion

```json
{
  "name": "notion",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "notion": {
        "transport": "stdio",
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-notion"],
        "env": {
          "NOTION_TOKEN": "${NOTION_TOKEN}"
        }
      }
    }
  }
}
```

**Features**: 20+ tools for pages, databases, blocks
**Authentication**: Requires `notion_NOTION_TOKEN` in .env (prefixed with the manual name)
**Package**: `@modelcontextprotocol/server-notion` (official MCP server)

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
}
```

**Features**: 26 tools per instance (navigation, interaction, inspection)
**Authentication**: No credentials needed
**Multiple Instances**: Use unique names (`chrome_devtools_1`, `chrome_devtools_2`) for parallel browser sessions
**Package**: `chrome-devtools-mcp@latest` (always use latest version)

---

## 5. ENVIRONMENT VARIABLES

**Required .env file**: Create `.env` in project root with:

> **⚠️ CRITICAL**: Code Mode requires **prefixed** variable names in your `.env` file. The prefix is the `name` field from your manual configuration below.

```bash
# ClickUp (prefixed with manual name "clickup")
clickup_CLICKUP_API_KEY=pk_your_api_key_here
clickup_CLICKUP_TEAM_ID=your_team_id_here

# Figma (prefixed with manual name "figma")
figma_FIGMA_API_KEY=figd_your_token_here

# Notion (prefixed with manual name "notion")
notion_NOTION_TOKEN=ntn_your_token_here
```

**Why Prefixed?** Code Mode automatically prepends `{manual_name}_` to all environment variable references. If your config has `"name": "clickup"` and references `${CLICKUP_API_KEY}`, Code Mode looks for `clickup_CLICKUP_API_KEY` in your `.env` file.

**Security:**
- Add `.env` to `.gitignore` (never commit credentials)
- Use `${VARIABLE_NAME}` syntax in config to reference env vars
- See [env_template.md](./env_template.md) for complete template

---

## 6. CUSTOMIZATION GUIDE

### Adding a New MCP Server

**Steps:**
1. Find the MCP server package (search npm or MCP directory)
2. Add new object to `manual_call_templates` array
3. Configure `name`, `command`, `args`, and `env` variables
4. Add required credentials to `.env` file
5. Test with `search_tools()` to verify tools are available

**Example: Adding GitHub MCP**

```json
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
          "GITHUB_TOKEN": "${GITHUB_TOKEN}"
        }
      }
    }
  }
}
```

Then add to `.env`:
```bash
GITHUB_TOKEN=ghp_your_token_here
```

### Removing an MCP Server

**Steps:**
1. Remove the manual object from `manual_call_templates` array
2. Remove associated env vars from `.env` (optional)
3. Tools will no longer be available via Code Mode

### Changing Manual Names

**Important**: Manual name determines namespace for tool calls.

**Example:**
- Config: `"name": "webflow_prod"`
- Tool calls: `webflow_prod.webflow_prod_sites_list()`

**Use case**: Multiple instances of same MCP server with different credentials
```json
{"name": "webflow_prod", ...},
{"name": "webflow_staging", ...}
```

---

## 7. VALIDATION

**Validate configuration:**

1. **File syntax**: Ensure valid JSON (use `cat .utcp_config.json | jq` to check)
2. **Environment variables**: Verify all referenced `${VAR_NAME}` exist in `.env`
3. **Tool discovery**: Test with `list_tools()` after setup

**Common mistakes:**
- Missing comma between manual objects
- Incorrect env var syntax (use `${VAR}` not `$VAR`)
- Manual name mismatch between config and code
- Missing npx `-y` flag (causes interactive prompt)

---

## 8. RELATED RESOURCES

### Templates
- [env_template.md](./env_template.md) - Complete .env file template with credential sources

### Reference Files
- [naming_convention.md](../references/naming_convention.md) - Tool naming conventions and invocation patterns (CRITICAL for tool usage)
- [configuration.md](../references/configuration.md) - Comprehensive configuration guide for Code Mode UTCP
- [tool_catalog.md](../references/tool_catalog.md) - Complete catalog of available MCP tools by server

**Template Version**: 1.0.0
**Last Updated**: 2025-01-23
**Compatibility**: Code Mode UTCP v1.x
