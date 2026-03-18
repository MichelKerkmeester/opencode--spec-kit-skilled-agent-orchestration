---
title: CocoIndex Code Settings Reference
description: Complete reference for global settings, project settings, embedding models, chunking configuration, root path discovery, and environment variables.
trigger_phrases:
  - cocoindex settings
  - cocoindex embedding model
  - cocoindex configuration reference
  - ccc global settings
  - cocoindex environment variables
---

# CocoIndex Code Settings Reference

Complete reference for all CocoIndex Code configuration files, embedding model options, chunking parameters, and environment variables.

---

## 1. GLOBAL SETTINGS

**File:** `~/.cocoindex_code/global_settings.yml`

Controls the embedding model and daemon environment. This file is per-user (shared across all projects).

### Schema

```yaml
embedding:
  provider: <string>    # "sentence-transformers" | "litellm"
  model: <string>       # Model identifier (see Embedding Model Options below)
  device: <string|null> # "cpu" | "cuda" | "mps" | null (auto-detect)

envs:                   # Dict of environment variables injected into daemon
  VOYAGE_API_KEY: <string>
  OPENAI_API_KEY: <string>
  # ... any key-value pairs
```

### Fields

| Field                | Type          | Default                                     | Description                                      |
| -------------------- | ------------- | ------------------------------------------- | ------------------------------------------------ |
| `embedding.provider` | string        | `sentence-transformers`                     | Embedding backend: `sentence-transformers` (local) or `litellm` (API) |
| `embedding.model`    | string        | `sentence-transformers/all-MiniLM-L6-v2`   | Model identifier passed to the provider          |
| `embedding.device`   | string / null | `null`                                      | Compute device. `null` auto-detects (GPU if available, else CPU) |
| `envs`               | dict          | `{}`                                        | Environment variables injected into the daemon process. Used for API keys |

### Example: Voyage Code 3 (recommended)

```yaml
embedding:
  provider: litellm
  model: voyage/voyage-code-3
envs:
  VOYAGE_API_KEY: your-key-here
```

### Example: Local Model (default, offline)

```yaml
embedding:
  provider: sentence-transformers
  model: sentence-transformers/all-MiniLM-L6-v2
```

> **CRITICAL**: Changing the embedding model requires `ccc reset && ccc index` to rebuild the index. Different models produce different vector dimensions and cannot be mixed.

---

## 2. PROJECT SETTINGS

**File:** `<project-root>/.cocoindex_code/settings.yml`

Controls per-project indexing behavior. Created automatically by `ccc init`.

### Schema

```yaml
include_patterns:      # List of glob patterns for files to index
  - "*.py"
  - "*.ts"
  # ...

exclude_patterns:      # List of glob patterns for files to skip
  - "node_modules/**"
  - "__pycache__/**"
  # ...

language_overrides:    # List of {ext, lang} mappings for custom extensions
  - ext: ".pyx"
    lang: "python"
```

### Fields

| Field                | Type       | Default          | Description                                              |
| -------------------- | ---------- | ---------------- | -------------------------------------------------------- |
| `include_patterns`   | list[str]  | 28+ file types   | Glob patterns for files to index (see default list below) |
| `exclude_patterns`   | list[str]  | Common excludes  | Glob patterns for files to skip during indexing           |
| `language_overrides` | list[dict] | `[]`             | Map custom extensions to known languages                  |

### Default Include Patterns (28+ file types)

```
*.py, *.ts, *.js, *.tsx, *.jsx, *.rs, *.go, *.java, *.c, *.h,
*.cpp, *.cc, *.cxx, *.hpp, *.cs, *.sql, *.sh, *.bash, *.md, *.txt,
*.kt, *.kts, *.scala, *.swift, *.dart, *.lua, *.r, *.R, *.jl,
*.ex, *.exs, *.hs, *.ml, *.mli, *.pl, *.pm, *.php, *.rb,
*.yml, *.yaml, *.toml
```

### Default Exclude Patterns

```
node_modules/**, __pycache__/**, .git/**, .venv/**, venv/**,
dist/**, build/**, .next/**, target/**, *.min.js, *.min.css,
*.lock, package-lock.json, yarn.lock, *.pyc, *.pyo,
.cocoindex_code/**, .opencode/skill/*/mcp_server/.venv/**
```

---

## 3. EMBEDDING MODEL OPTIONS

| Model | Provider | Key Required | Dimensions | Notes |
| ----- | -------- | ------------ | ---------- | ----- |
| `voyage/voyage-code-3` | litellm | `VOYAGE_API_KEY` | 1024 | Best code search quality, recommended |
| `sentence-transformers/all-MiniLM-L6-v2` | sentence-transformers | None | 384 | Local, offline, current default |
| `text-embedding-3-small` | litellm | `OPENAI_API_KEY` | 1536 | OpenAI, general-purpose |
| `gemini/gemini-embedding-001` | litellm | `GEMINI_API_KEY` | 768 | Google Gemini |
| `cohere/embed-v4.0` | litellm | `COHERE_API_KEY` | 1024 | Cohere |
| `ollama/nomic-embed-text` | litellm | None | 768 | Local via Ollama (requires Ollama running) |
| `nomic-ai/CodeRankEmbed` | litellm | `NOMIC_API_KEY` | 768 | Nomic, code-optimized |

### Provider Details

**`sentence-transformers`** -- Runs models locally using the sentence-transformers Python library. No API key needed. Models are downloaded on first use and cached locally. Best for offline use or when API costs are a concern.

**`litellm`** -- Routes to external embedding APIs (Voyage, OpenAI, Gemini, Cohere, Nomic) or local servers (Ollama). Requires the appropriate API key set in the `envs` section of `global_settings.yml` or as an environment variable in the MCP config.

---

## 4. CHUNKING CONFIGURATION

CocoIndex Code splits source files into chunks for embedding and search. Chunking parameters are built-in and not user-configurable.

| Parameter          | Value                  | Description                                     |
| ------------------ | ---------------------- | ----------------------------------------------- |
| Chunk size         | 1,000 characters       | Target size for each chunk                      |
| Minimum chunk size | 250 characters         | Chunks smaller than this are merged with neighbors |
| Overlap            | 150 characters         | Overlap between adjacent chunks for context     |
| Algorithm          | RecursiveSplitter      | CocoIndex engine's recursive splitting algorithm |

### Language-Aware Boundaries

The chunker respects language structure when splitting:
- Prefers splitting at function/method boundaries
- Prefers splitting at class/struct boundaries
- Falls back to line boundaries when no structural boundary is found within the chunk size
- Preserves import/include blocks as single chunks when possible

---

## 5. ROOT PATH DISCOVERY

CocoIndex Code determines the project root using the following priority order:

| Priority | Method | Description |
| -------- | ------ | ----------- |
| 1 | `COCOINDEX_CODE_ROOT_PATH` env var | Explicit override, always takes precedence |
| 2 | Nearest parent with `.cocoindex_code/` | Walks up from cwd looking for initialized project |
| 3 | Nearest parent with project markers | Looks for `.git`, `pyproject.toml`, `package.json`, `Cargo.toml`, `go.mod` |
| 4 | Current working directory | Fallback when no markers found |

### Example

```
/home/user/projects/my-app/          <-- has .git/ and .cocoindex_code/
  src/
    api/
      handlers.py                    <-- cwd here
```

Running `ccc search "handler"` from `src/api/` finds `/home/user/projects/my-app/` as root (Priority 2: `.cocoindex_code/` found).

---

## 6. ENVIRONMENT VARIABLES

### Runtime Variables

| Variable | Default | Description |
| -------- | ------- | ----------- |
| `COCOINDEX_CODE_DIR` | `~/.cocoindex_code` | Override the global config directory location |
| `COCOINDEX_CODE_ROOT_PATH` | (auto-detected) | Override project root detection (see Root Path Discovery) |

### API Key Variables

Set these in `global_settings.yml` under `envs:` or in the MCP config's `env` section:

| Variable | Required For |
| -------- | ------------ |
| `VOYAGE_API_KEY` | `voyage/voyage-code-3` |
| `OPENAI_API_KEY` | `text-embedding-3-small` |
| `GEMINI_API_KEY` | `gemini/gemini-embedding-001` |
| `COHERE_API_KEY` | `cohere/embed-v4.0` |
| `NOMIC_API_KEY` | `nomic-ai/CodeRankEmbed` |

### Legacy Variables

These older variable names are mapped automatically for backward compatibility:

| Legacy Variable | Maps To |
| --------------- | ------- |
| `COCOSEARCH_DIR` | `COCOINDEX_CODE_DIR` |
| `COCOSEARCH_ROOT_PATH` | `COCOINDEX_CODE_ROOT_PATH` |

---

## 7. RELATED RESOURCES

| Resource         | Location                                                            |
| ---------------- | ------------------------------------------------------------------- |
| INSTALL_GUIDE    | `.opencode/skill/mcp-cocoindex-code/INSTALL_GUIDE.md`              |
| SKILL.md         | `.opencode/skill/mcp-cocoindex-code/SKILL.md`                      |
| Tool Reference   | `.opencode/skill/mcp-cocoindex-code/references/tool_reference.md`  |
| Search Patterns  | `.opencode/skill/mcp-cocoindex-code/references/search_patterns.md` |
| Config Templates | `.opencode/skill/mcp-cocoindex-code/assets/config_templates.md`    |
