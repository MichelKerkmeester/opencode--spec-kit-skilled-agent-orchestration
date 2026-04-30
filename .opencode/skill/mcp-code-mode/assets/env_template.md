---
title: Environment Variables Template
description: Complete .env file template with placeholders for all MCP server credentials and API tokens.
---

# Environment Variables Template

Copy-ready `.env` template for Code Mode UTCP authentication with all supported MCP servers.

---

## 1. OVERVIEW

### Purpose

Centralized environment variables for Code Mode UTCP authentication and configuration. Use this template to securely manage credentials for ClickUp, Figma, Notion, GitHub, Webflow, and Chrome DevTools MCP servers.

### Usage

Copy this template to `.env` in your project root, then replace placeholder values with your actual credentials. Never commit `.env` to version control - add it to `.gitignore` immediately.

---

## 2. TEMPLATE

```bash
# Code Mode UTCP - Environment Variables Template
# Copy this to .env and fill in your actual credentials
#
# ⚠️ CRITICAL: Code Mode uses PREFIXED variable names!
# Format: {manual_name}_{VAR} where manual_name is from .utcp_config.json
# Example: If your config has "name": "clickup", use clickup_CLICKUP_API_KEY

# ClickUp Configuration
# (Code Mode prefixes all env vars with the manual name from .utcp_config.json)
clickup_CLICKUP_API_KEY=pk_your_api_key_here
clickup_CLICKUP_TEAM_ID=your_team_id_here

# Figma Configuration
# (Code Mode prefixes all env vars with the manual name from .utcp_config.json)
figma_FIGMA_API_KEY=figd_your_token_here

# Notion Configuration
# (Code Mode prefixes all env vars with the manual name from .utcp_config.json)
notion_NOTION_TOKEN=ntn_your_token_here

# GitHub Configuration (Optional - add GitHub MCP to .utcp_config.json if needed)
# See config_template.md Section 5 for GitHub MCP setup
# (Code Mode prefixes all env vars with the manual name from .utcp_config.json)
github_GITHUB_TOKEN=ghp_your_token_here

# Webflow Configuration (if using direct API, not remote MCP)
# (Code Mode prefixes all env vars with the manual name from .utcp_config.json)
webflow_WEBFLOW_API_TOKEN=your_webflow_token_here

# Chrome DevTools (usually no auth needed)
# No environment variables required

# Add additional MCP server credentials below as needed
# Remember: Always prefix with the manual name from your .utcp_config.json!
```

---

## 3. CREDENTIAL SOURCES

### ClickUp

**Required Variables:**
- `clickup_CLICKUP_API_KEY` - Personal API key for ClickUp workspace (prefixed)
- `clickup_CLICKUP_TEAM_ID` - ClickUp team/workspace ID (prefixed)

**How to Obtain:**
1. Log in to ClickUp
2. Go to Settings → Apps → API
3. Generate new API key
4. Copy your Team ID from workspace settings

**Format (Code Mode prefixed):**
```bash
# Code Mode requires prefixed variable names: {manual_name}_{VAR}
clickup_CLICKUP_API_KEY=pk_1234567890_ABCDEFGHIJKLMNOP
clickup_CLICKUP_TEAM_ID=12345678
```

**Permissions**: Ensure API key has necessary scopes for task management

### Figma

**Required Variables:**
- `figma_FIGMA_API_KEY` - Personal access token for Figma API (prefixed)

**How to Obtain:**
1. Log in to Figma
2. Go to Settings → Account → Personal Access Tokens
3. Click "Generate new token"
4. Copy token immediately (shown only once)

**Format (Code Mode prefixed):**
```bash
# Code Mode requires prefixed variable names: {manual_name}_{VAR}
figma_FIGMA_API_KEY=figd_abcdefghijklmnopqrstuvwxyz1234567890
```

**Permissions**: Token inherits your Figma account permissions

### Notion

**Required Variables:**
- `notion_NOTION_TOKEN` - Integration token for Notion API (prefixed)

**How to Obtain:**
1. Go to https://www.notion.so/my-integrations
2. Click "New integration"
3. Configure integration settings
4. Copy the "Internal Integration Token"
5. Share relevant Notion pages/databases with your integration

**Format (Code Mode prefixed):**
```bash
# Code Mode requires prefixed variable names: {manual_name}_{VAR}
notion_NOTION_TOKEN=ntn_1234567890abcdefghijklmnopqrstuvwxyz
```

**Important**: Must share pages/databases with integration before accessing via API

### GitHub (Optional)

**Required Variables:**
- `github_GITHUB_TOKEN` or `github_GITHUB_PERSONAL_ACCESS_TOKEN` - Personal access token for GitHub API (prefixed)

**How to Obtain:**
1. Log in to GitHub
2. Go to Settings → Developer settings → Personal access tokens → Tokens (classic)
3. Click "Generate new token"
4. Select scopes (repo, workflow, etc.)
5. Copy token immediately

**Format (Code Mode prefixed):**
```bash
# Code Mode requires prefixed variable names: {manual_name}_{VAR}
github_GITHUB_TOKEN=ghp_1234567890abcdefghijklmnopqrstuvwxyz
```

**Scopes**: Select based on needed permissions (read/write repos, issues, PRs, etc.)

### Webflow (Optional - for direct API access)

**Required Variables:**
- `webflow_WEBFLOW_API_TOKEN` - API token for Webflow workspace (prefixed)

**How to Obtain:**
1. Log in to Webflow
2. Go to Account Settings → API Access
3. Generate new API token
4. Copy token

**Format (Code Mode prefixed):**
```bash
# Code Mode requires prefixed variable names: {manual_name}_{VAR}
webflow_WEBFLOW_API_TOKEN=your_webflow_api_token_here
```

**Note**: Webflow remote MCP (`mcp-remote https://mcp.webflow.com/sse`) doesn't require local token

### Chrome DevTools

**Required Variables:** None

**Configuration:**
```bash
# Chrome DevTools - No authentication required
# Launches local Chrome instance with debugging enabled
```

**Note**: Chrome DevTools MCP runs locally and doesn't require API credentials

---

## CRITICAL: Variable Naming Convention

### Code Mode Prefixes All Environment Variables

**⚠️ IMPORTANT**: Code Mode automatically prefixes all environment variables with the `{manual_name}_` from your `.utcp_config.json` configuration.

**The Pattern:**
```
{manual_name}_{VARIABLE_NAME}
```

**Example:**
- Config has `"name": "clickup"` in `.utcp_config.json`
- Config references `${CLICKUP_API_KEY}` in the env section
- Your `.env` file MUST use: `clickup_CLICKUP_API_KEY=pk_xxx`

### Why This Matters

When Code Mode loads environment variables, it prefixes them with the manual name to avoid conflicts between different MCP servers that might use the same variable names.

**Common Error:**
```
Error: Variable 'clickup_CLICKUP_API_KEY' referenced in call template configuration not found
```

This error occurs when your `.env` uses `CLICKUP_API_KEY` (non-prefixed) but Code Mode expects `clickup_CLICKUP_API_KEY` (prefixed).

### Quick Reference Table

| Manual Name (in config) | Config Reference | .env Variable Name |
|-------------------------|------------------|-------------------|
| `clickup` | `${CLICKUP_API_KEY}` | `clickup_CLICKUP_API_KEY` |
| `figma` | `${FIGMA_API_KEY}` | `figma_FIGMA_API_KEY` |
| `notion` | `${NOTION_TOKEN}` | `notion_NOTION_TOKEN` |
| `github` | `${GITHUB_TOKEN}` | `github_GITHUB_TOKEN` |

### Validation

Before starting Code Mode, verify your `.env` variables match the expected prefixed format:
```bash
# Check what prefix your config uses
grep '"name":' .utcp_config.json

# Verify your .env has the prefixed variables
grep '_CLICKUP_API_KEY' .env  # Should show: clickup_CLICKUP_API_KEY=...
grep '_FIGMA_API_KEY' .env    # Should show: figma_FIGMA_API_KEY=...
```

---

## 4. SECURITY BEST PRACTICES

### .gitignore Configuration

**Add to `.gitignore`:**

```gitignore
# Environment variables
.env
.env.local
.env.*.local

# Code Mode UTCP
.utcp_config.json
```

**Why**: Prevents accidental commit of credentials to version control

### Environment File Security

**DO:**
- ✅ Use `.env` for local development only
- ✅ Use separate `.env` files for different environments (dev, staging, prod)
- ✅ Rotate tokens regularly (every 90 days recommended)
- ✅ Use minimum required permissions for each token
- ✅ Store production credentials in secure secret management (Vault, AWS Secrets Manager, etc.)

**DON'T:**
- ❌ Commit `.env` to version control
- ❌ Share `.env` files via email or chat
- ❌ Use production credentials in development
- ❌ Grant unnecessary permissions to API tokens
- ❌ Hard-code credentials in config files

### Token Rotation

**Schedule:**
- Development tokens: Every 90 days
- Production tokens: Every 30-60 days
- Compromised tokens: Immediately

**Process:**
1. Generate new token
2. Update `.env` file
3. Test connections
4. Revoke old token
5. Update documentation

---

## 5. CONFIGURATION REFERENCE

### Variable Syntax in .utcp_config.json

**Correct:**
```json
"env": {
  "CLICKUP_API_KEY": "${CLICKUP_API_KEY}"
}
```

**Incorrect:**
```json
"env": {
  "CLICKUP_API_KEY": "$CLICKUP_API_KEY"  // Missing braces
}
```

**Pattern**: Always use `${VARIABLE_NAME}` for environment variable references

### Loading Environment Variables

**Automatic loading** (configured in `.utcp_config.json`):
```json
"load_variables_from": [
  {
    "variable_loader_type": "dotenv",
    "env_file_path": ".env"
  }
]
```

**Manual loading** (if needed):
```bash
# Export variables manually
export CLICKUP_API_KEY=pk_your_key
export CLICKUP_TEAM_ID=12345
```

### Multiple Environment Files

**Use case**: Different environments (dev, staging, prod)

**Setup:**
```bash
.env.development
.env.staging
.env.production
```

**Configuration:**
```json
"load_variables_from": [
  {
    "variable_loader_type": "dotenv",
    "env_file_path": ".env.development"
  }
]
```

**Best Practice**: Use `.env` for local development, CI/CD for other environments

---

## 6. TROUBLESHOOTING

### Variable Not Found Error

**Error:**
```
Error: Environment variable CLICKUP_API_KEY not found
```

**Solutions:**
1. Verify variable exists in `.env` file
2. Check variable name spelling (case-sensitive)
3. Ensure `.env` file is in correct location
4. Verify `.utcp_config.json` references correct `.env` path
5. Check for syntax errors in `.env` (no spaces around `=`)

### Invalid Token Error

**Error:**
```
Error: Authentication failed: Invalid API token
```

**Solutions:**
1. Verify token hasn't expired
2. Check token has necessary permissions
3. Ensure no extra whitespace in token value
4. Confirm token format matches expected pattern
5. Try regenerating token

### Permission Denied Error

**Error:**
```
Error: Access denied to resource
```

**Solutions:**
1. Verify token has required scopes/permissions
2. For Notion: Ensure integration has access to pages/databases
3. For GitHub: Check token scopes include needed permissions
4. For Figma: Verify token has access to files/projects

---

## 7. TEMPLATE CUSTOMIZATION

### Adding New MCP Server Credentials

**Example: Adding Slack MCP**

```bash
# Slack Configuration
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_APP_TOKEN=xapp-your-app-token
SLACK_WORKSPACE_ID=your-workspace-id
```

Then reference in `.utcp_config.json`:
```json
{
  "name": "slack",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "slack": {
        "env": {
          "SLACK_BOT_TOKEN": "${SLACK_BOT_TOKEN}",
          "SLACK_APP_TOKEN": "${SLACK_APP_TOKEN}"
        }
      }
    }
  }
}
```

### Removing Unused Credentials

**Steps:**
1. Comment out or remove variables from `.env`
2. Remove corresponding manual from `.utcp_config.json`
3. Revoke token in service provider (optional but recommended)

**Example:**
```bash
# Figma Configuration (removed - no longer using)
# FIGMA_API_KEY=figd_old_token
```

---

## 8. VALIDATION CHECKLIST

**Before using Code Mode, verify:**

- [ ] `.env` file exists in project root
- [ ] All required variables are set (no placeholder values)
- [ ] `.env` is added to `.gitignore`
- [ ] Variable names match references in `.utcp_config.json`
- [ ] No extra whitespace around `=` in `.env`
- [ ] Tokens have necessary permissions
- [ ] Tokens are valid and not expired

**Test configuration:**
```typescript
// Run this to verify environment loading
call_tool_chain({
  code: `
    const tools = await list_tools();
    console.log(\`Found \${tools.tools.length} tools\`);
    return { success: true, toolCount: tools.tools.length };
  `
});
```

**Expected result**: Should return tool count without authentication errors

---

## 9. RELATED RESOURCES

### Templates
- [config_template.md](./config_template.md) - Complete .utcp_config.json configuration template

### Reference Files
- [configuration.md](../references/configuration.md) - Comprehensive configuration guide for Code Mode UTCP
- [naming_convention.md](../references/naming_convention.md) - Tool naming conventions and patterns for Code Mode

**Template Version**: 1.0.0
**Last Updated**: 2025-01-23
**Compatibility**: Code Mode UTCP v1.x
