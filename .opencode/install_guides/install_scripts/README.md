# Component Install Scripts

> Automated installation scripts for OpenCode MCP servers and related tools. Provides idempotent setup with validation checkpoints.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1--overview)
- [2. QUICK START](#2--quick-start)
- [3. STRUCTURE](#3--structure)
- [4. FEATURES](#4--features)
- [5. CONFIGURATION](#5--configuration)
- [6. USAGE EXAMPLES](#6--usage-examples)
- [7. TROUBLESHOOTING](#7--troubleshooting)
- [8. FAQ](#8--faq)
- [9. RELATED DOCUMENTS](#9--related-documents)

<!-- /ANCHOR:table-of-contents -->

---

## 1. OVERVIEW
<!-- ANCHOR:overview -->

### What are Component Install Scripts?

These scripts automate installation and configuration of OpenCode components (MCP servers plus related tooling). Each script handles prerequisites, installation, configuration, and verification in a single command.

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| Install Scripts | 8 | 3 real + 5 symlinks (component installers + 1 master installer) |
| Shared Utilities | 36 | Functions in `_utils.sh` |
| Platforms | 3 | macOS, Linux, Windows (WSL) |
| Install Time | 2-10 min | Per component, depending on complexity |

### Key Features

| Feature | Description |
|---------|-------------|
| **Idempotent** | Safe to run multiple times. Detects existing installations |
| **Validated** | Each phase has verification checkpoints |
| **Configurable** | Supports `--verbose`, `--skip-verify`, `--dry-run` flags |
| **Backup-Safe** | Creates timestamped backups before modifying configs |
| **Cross-Platform** | Works on macOS, Linux and Windows (WSL) |

### Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| Node.js | 18+ | 20+ |
| npm | 9+ | 10+ |
| Bash | 4.0+ | 5.0+ |

<!-- /ANCHOR:overview -->

---

## 2. QUICK START
<!-- ANCHOR:quick-start -->

### 30-Second Setup

```bash
# 1. Navigate to project root
cd /path/to/your/project

# 2. Make scripts executable
chmod +x .opencode/install_guides/install_scripts/*.sh

# 3. Install core MCPs (recommended order)
.opencode/install_guides/install_scripts/install-code-mode.sh
.opencode/install_guides/install_scripts/install-spec-kit-memory.sh
.opencode/install_guides/install_scripts/install-sequential-thinking.sh
```

### Verify Installation

```bash
# Check all MCPs are configured
cat opencode.json | python3 -m json.tool | grep -A2 '"mcp"'

# Expected: Shows configured MCP entries
```

### First Use

```bash
# Start OpenCode - MCPs load automatically
opencode

# Test Sequential Thinking
# Ask: "Use sequential thinking to analyze this problem..."
```

<!-- /ANCHOR:quick-start -->

---

## 3. STRUCTURE
<!-- ANCHOR:structure -->

```
install_scripts/
├── _utils.sh                      # Shared utility functions (36 functions)
├── install-sequential-thinking.sh # Sequential Thinking MCP
├── install-spec-kit-memory.sh     # Spec Kit Memory MCP
├── install-code-mode.sh           # Code Mode MCP
├── install-chrome-devtools.sh     # Chrome DevTools MCP (bdg CLI)
├── install-clickup.sh             # ClickUp CLI + ClickUp MCP for Code Mode
├── install-cocoindex-code.sh      # CocoIndex Code MCP (symlink)
├── install-all.sh                 # Master installer with --skip/--only flags
├── logs/                          # Installation logs
└── README.md                      # This file
```

### Key Files

| File | Purpose |
|------|---------|
| `_utils.sh` | 36 shared functions for logging, JSON, prerequisites |
| `install-all.sh` | Master installer with `--skip` and `--only` flags |

<!-- /ANCHOR:structure -->

---

## 4. FEATURES
<!-- ANCHOR:features -->

### Available Scripts

| Script | Component | Description | Prerequisites |
|--------|-----------|-------------|---------------|
| `install-sequential-thinking.sh` | Sequential Thinking MCP | Structured problem-solving via flexible thinking | Node.js 18+ |
| `install-spec-kit-memory.sh` | Spec Kit Memory MCP | Semantic vector search for conversation context | Node.js 18+, npm |
| `install-code-mode.sh` | Code Mode MCP | MCP orchestration via TypeScript execution | Node.js 18+ |
| `install-chrome-devtools.sh` | Chrome DevTools CLI | Browser debugging via CDP (bdg CLI) | Node.js 18+, Chrome |
| `install-clickup.sh` | ClickUp MCP | ClickUp CLI + MCP server installation for Code Mode | Node.js 18+ (22+ for CLI), npm |
| `install-cocoindex-code.sh` | CocoIndex Code MCP | Semantic code search via vector embeddings | Node.js 18+, Python 3.10+ |

### Shared Utilities (_utils.sh)

| Category | Functions | Purpose |
|----------|-----------|---------|
| **Logging** | `_log`, `log_info`, `log_success`, `log_error`, `log_warn`, `log_step`, `log_debug` | Colored terminal output |
| **Prerequisites** | `check_command`, `check_node_version`, `check_npx`, `check_npm`, `check_jq`, `check_code_mode` | Dependency verification |
| **JSON** | `json_validate`, `json_has_key`, `json_set_value`, `json_add_mcp_entry`, `json_add_utcp_entry` | Config file manipulation |
| **Files** | `backup_file`, `find_project_root`, `get_project_root`, `ensure_dir`, `mcp_entry_exists`, `add_mcp_entry` | File operations |
| **User Input** | `confirm`, `confirm_action`, `prompt_value`, `prompt_secret`, `prompt_choice` | Interactive prompts |
| **Platform** | `detect_platform`, `detect_arch` | Environment detection |
| **Environment** | `env_add_var`, `env_has_var` | .env file management |
| **Verification** | `verify_command` | Command verification |
| **Help** | `show_header`, `show_help_footer` | Usage display |

### Master Installer (install-all.sh)

```bash
# Install all MCPs
./install-all.sh

# Skip specific MCPs
./install-all.sh --skip chrome-devtools

# Install only specific MCPs
./install-all.sh --only code-mode --only spec-kit-memory

# Dry-run mode (preview without installing)
./install-all.sh --dry-run
```

<!-- /ANCHOR:features -->

---

## 5. CONFIGURATION
<!-- ANCHOR:configuration -->

### Configuration Files

**Location**: Project root

| File | Purpose | Modified By |
|------|---------|-------------|
| `opencode.json` | MCP server definitions | All scripts |
| `.utcp_config.json` | Code Mode provider configs | Code Mode |
| `.env` | API keys and secrets | Code Mode |
| `.env.example` | API key templates | Code Mode |

### Common Options

All scripts support these standard options:

| Option | Description |
|--------|-------------|
| `-h, --help` | Show help message |
| `-v, --verbose` | Enable verbose output |
| `--skip-verify` | Skip verification step |
| `--dry-run` | Preview changes without making them |

### Script-Specific Options

**install-chrome-devtools.sh**:
| Option | Description |
|--------|-------------|
| `--force` | Force reinstallation |
| `--add-profile` | Add CHROME_PATH to shell profile |

<!-- /ANCHOR:configuration -->

---

## 6. USAGE EXAMPLES
<!-- ANCHOR:usage-examples -->

### Example 1: Install Core MCPs

```bash
# Install the three core MCPs in recommended order
./install-code-mode.sh
./install-spec-kit-memory.sh
./install-sequential-thinking.sh
```

**Result**: Core MCPs configured in `opencode.json`, ready for use.

### Example 2: CI/CD Installation

```bash
# Dry-run to preview installation
./install-all.sh --dry-run

# Install specific MCPs only
./install-all.sh --only code-mode --only sequential-thinking

# Verbose mode to see all output
./install-all.sh -v
```

**Result**: MCPs installed with appropriate flags for automation.

### Common Patterns

| Pattern | Command | When to Use |
|---------|---------|-------------|
| Core setup | `./install-all.sh --only code-mode --only spec-kit-memory --only sequential-thinking` | New project setup |
| Full setup | `./install-all.sh` | Complete MCP installation |
| Reinstall | `./install-<component>.sh --force` | Fix broken installation |
| Debug | `./install-<component>.sh -v` | Troubleshoot issues |

<!-- /ANCHOR:usage-examples -->

---

## 7. TROUBLESHOOTING
<!-- ANCHOR:troubleshooting -->

### Common Issues

#### Node.js not found

**Symptom**: `command not found: node`

**Cause**: Node.js not installed or not in PATH

**Solution**:
```bash
# Install Node.js 18+ from nodejs.org
# Or via nvm:
nvm install 18
nvm use 18
```

#### Permission denied

**Symptom**: `Permission denied` when running script

**Cause**: Script not executable

**Solution**:
```bash
chmod +x .opencode/install_guides/install_scripts/*.sh
```

#### opencode.json not found

**Symptom**: `Error: opencode.json not found`

**Cause**: Running from wrong directory

**Solution**:
```bash
# Run from project root containing opencode.json
cd /path/to/your/project
./install-<component>.sh
```

#### JSON validation failed

**Symptom**: `Error: JSON validation failed`

**Cause**: Syntax error in config file

**Solution**:
```bash
# Check JSON syntax
python3 -m json.tool < opencode.json

# Restore from backup if needed
cp opencode.json.bak.YYYYMMDD_HHMMSS opencode.json
```

### Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Node.js not found | Install from [nodejs.org](https://nodejs.org/) |
| npx not found | `npm install -g npx` |
| Chrome not found | Set `CHROME_PATH` environment variable |
| Code Mode not configured | Run `install-code-mode.sh` first |
| MCP not appearing | Restart OpenCode/Claude Code |

### Diagnostic Commands

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Validate opencode.json
python3 -m json.tool < opencode.json

# Check MCP package accessibility
npx -y @modelcontextprotocol/server-sequential-thinking --help

# Check bdg installation
bdg --version
```

<!-- /ANCHOR:troubleshooting -->

---

## 8. FAQ
<!-- ANCHOR:faq -->

### General Questions

**Q: What order should I install MCPs?**

A: Install Code Mode first (foundation). Otherwise, order doesn't matter. Recommended: Code Mode → Spec Kit Memory → Sequential Thinking → others.

---

**Q: Are the scripts safe to run multiple times?**

A: Yes. All scripts are idempotent. They detect existing installations and skip redundant work. Config files are backed up before modification.

---

**Q: Do I need all 5 component installers?**

A: No. Install based on your needs:
- **Core**: Code Mode MCP, Spec Kit Memory MCP, Sequential Thinking MCP
- **Optional**: Chrome DevTools CLI (debugging), ClickUp CLI + MCP (task management)

---

### Technical Questions

**Q: Where are backups stored?**

A: In the same directory as the original file, with timestamp suffix:
```
opencode.json.bak.20260101_120000
.utcp_config.json.bak.20260101_120000
```

---

**Q: How do I add a new MCP script?**

A: Follow the template pattern:
```bash
#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/_utils.sh"

# Check prerequisites → Install → Configure → Verify
```

See the Contributing section in the source for the full template.

---

**Q: Can I run these in Docker/CI?**

A: Yes. Use `--dry-run` to preview changes without installing:
```bash
./install-all.sh --dry-run
```

<!-- /ANCHOR:faq -->

---

## 9. RELATED DOCUMENTS
<!-- ANCHOR:related-documents -->

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [MCP - Code Mode.md](../MCP%20-%20Code%20Mode.md) | Code Mode installation guide |
| [MCP - Sequential Thinking.md](../MCP%20-%20Sequential%20Thinking.md) | Sequential Thinking guide |
| [MCP - Spec Kit Memory.md](../MCP%20-%20Spec%20Kit%20Memory.md) | Spec Kit Memory guide |
| [MCP - Chrome Dev Tools.md](../MCP%20-%20Chrome%20Dev%20Tools.md) | Chrome DevTools guide |

### External Resources

| Resource | Description |
|----------|-------------|
| [Model Context Protocol](https://modelcontextprotocol.io/) | Official MCP documentation |
| [OpenCode](https://github.com/sst/opencode) | OpenCode CLI documentation |
| [Code Mode](https://github.com/universal-tool-calling-protocol/code-mode) | UTCP Code Mode |

---

*Part of the [OpenCode Development Environment](https://github.com/MichelKerkmeester/opencode-dev-environment)*

<!-- /ANCHOR:related-documents -->
