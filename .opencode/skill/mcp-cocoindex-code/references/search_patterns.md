---
title: CocoIndex Code Search Patterns
description: Effective semantic search strategies for getting the best results from CocoIndex Code, including query writing, filters, and when to choose semantic search over Grep.
trigger_phrases:
  - search strategies
  - write better queries
  - semantic search tips
  - cocoindex search patterns
  - when to use semantic search
---

# CocoIndex Code Search Patterns

Strategies for writing effective semantic queries and getting the best results from CocoIndex Code.

---

<!-- ANCHOR:overview -->
## OVERVIEW

Strategies and patterns for effective semantic code search using CocoIndex Code. Covers query writing, language and path filters, score interpretation, comparison with Grep, result verification workflows, and common query patterns by domain.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:writing-good-queries -->
## 1. WRITING GOOD QUERIES

Semantic search understands meaning, not just keywords. Write queries as you would describe what you are looking for to a colleague.

### Use Natural Language

| Good Query (semantic)                        | Bad Query (keyword-style)    |
| -------------------------------------------- | ---------------------------- |
| "how does user authentication work"          | "auth"                       |
| "error handling in API route handlers"       | "try catch"                  |
| "database connection pooling setup"          | "pool"                       |
| "file upload processing and validation"      | "upload"                     |
| "rate limiting middleware implementation"     | "rate limit"                 |

### Be Specific About Intent

The more specific your query, the better the results.

| Vague (many irrelevant results)         | Specific (targeted results)                           |
| --------------------------------------- | ----------------------------------------------------- |
| "config"                                | "database configuration with connection parameters"   |
| "test"                                  | "unit test setup with mock dependencies"              |
| "error"                                 | "error recovery when external API calls fail"         |
| "middleware"                            | "authentication middleware that validates JWT tokens"  |

### Describe Intent, Not Syntax

Semantic search finds code by what it does, not how it looks.

```
Instead of: "async function"
Write:      "asynchronous request handlers"

Instead of: "for loop array"
Write:      "iterating over collection items"

Instead of: "if err != nil"
Write:      "error checking in Go functions"
```

---

<!-- /ANCHOR:writing-good-queries -->
<!-- ANCHOR:using-language-filters -->
## 2. USING LANGUAGE FILTERS

Filter by language when you know which language you need results from. CocoIndex Code supports **28+ languages** (see tool_reference.md for the full list).

### When to Filter

- You are working in a specific language and want only relevant results
- The codebase has multiple implementations of the same concept in different languages
- You want to avoid noise from documentation or config files

### Examples

The `--lang` flag is **repeatable** -- specify it multiple times to filter by multiple languages.

```bash
# Find Python database models
ccc search "database model definitions" --lang python

# Find TypeScript React components
ccc search "form validation component" --lang tsx

# Find Go error handling patterns
ccc search "error handling and recovery" --lang go

# Find SQL migration scripts
ccc search "table creation with foreign keys" --lang sql

# Filter by multiple languages at once
ccc search "authentication middleware" --lang python --lang typescript

# Three languages
ccc search "data serialization" --lang python --lang rust --lang go
```

**MCP equivalent:** The MCP `search` tool uses `languages` (a list of strings) instead of `--lang`:
```json
{
  "query": "authentication middleware",
  "languages": ["python", "typescript"]
}
```

### When NOT to Filter

- You want to understand a concept across the whole codebase
- You are exploring unfamiliar code and do not know what language to expect
- You want to find documentation alongside implementation code

---

<!-- /ANCHOR:using-language-filters -->
<!-- ANCHOR:using-path-filters -->
## 3. USING PATH FILTERS

Scope searches to specific directories when you know where to look.

### Examples

```bash
# Search only in API handlers
ccc search "request validation" --path src/api/

# Search only in tests
ccc search "mock database setup" --path tests/

# Search in a specific module
ccc search "user permissions" --path src/auth/

# Combine with language filter (--lang is repeatable)
ccc search "error handling" --path src/services/ --lang typescript
ccc search "error handling" --path src/services/ --lang typescript --lang python
```

### When to Use Path Filters

- You know the feature lives in a specific directory
- You want to avoid matches from unrelated parts of the codebase
- You are investigating a specific module or package

---

<!-- /ANCHOR:using-path-filters -->
<!-- ANCHOR:combining-filters-for-precision -->
## 4. COMBINING FILTERS FOR PRECISION

Combine query specificity, language filters, and path filters for the most targeted results.

```bash
# Highly targeted: TypeScript error handling in API layer
ccc search "error handling with retry logic" --lang typescript --path src/api/ --limit 5

# Find Python tests for database operations
ccc search "database integration test fixtures" --lang python --path tests/

# Find Rust memory management in core library
ccc search "memory allocation and deallocation" --lang rust --path src/core/

# Multi-language search scoped to a directory
ccc search "configuration loading" --lang python --lang typescript --path src/config/
```

---

<!-- /ANCHOR:combining-filters-for-precision -->
<!-- ANCHOR:interpreting-relevance-scores -->
## 5. INTERPRETING RELEVANCE SCORES

Each result includes a relevance score from 0.0 to 1.0.

| Score Range | Meaning                                           | Action                      |
| ----------- | ------------------------------------------------- | --------------------------- |
| 0.8 - 1.0  | Strong match: very likely what you are looking for | Read this first             |
| 0.6 - 0.8  | Good match: probably relevant                     | Worth reviewing             |
| 0.4 - 0.6  | Moderate match: somewhat related                  | Scan for usefulness         |
| 0.0 - 0.4  | Weak match: tangentially related at best          | Usually skip                |

**Tips:**
- If top results score below 0.5, try rephrasing your query
- If all results score above 0.8, your query is well-targeted
- Scores are relative to the query, not absolute quality measures

---

<!-- /ANCHOR:interpreting-relevance-scores -->
<!-- ANCHOR:semantic-search-vs-grep -->
## 6. SEMANTIC SEARCH VS. GREP

### When Semantic Search Wins

| Scenario                                        | Why Semantic Search                               |
| ----------------------------------------------- | ------------------------------------------------- |
| "How does authentication work?"                 | Finds auth code even without the word "auth"      |
| Finding implementation of a concept             | Understands meaning across naming conventions     |
| Exploring unfamiliar codebase                   | No need to know exact variable/function names     |
| Finding similar patterns across files           | Groups semantically related code                  |
| Understanding feature implementation            | Finds all pieces of a feature across modules      |

### When Grep Wins

| Scenario                                        | Why Grep                                          |
| ----------------------------------------------- | ------------------------------------------------- |
| Find all usages of `processPayment()`           | Exact function name match                         |
| Find all TODO comments                          | Exact string pattern                              |
| Find import statements for a package            | Known exact text                                  |
| Find all files with a specific error message    | Exact error string match                          |
| Find regex patterns (e.g., email validation)    | Regex support                                     |
| Count occurrences of a specific term            | Precise counting                                  |

### Decision Guide

```
Do you know the exact text?
  YES --> Use Grep
  NO  --> Do you know what the code DOES (but not how it looks)?
           YES --> Use CocoIndex Code (semantic)
           NO  --> Use both: CocoIndex Code first to explore, then Grep to verify
```

---

<!-- /ANCHOR:semantic-search-vs-grep -->
<!-- ANCHOR:verifying-results-with-read -->
## 7. VERIFYING RESULTS WITH READ

Semantic search returns snippets. Always verify with the Read tool before acting on results.

**Workflow:**
1. Run semantic search to find relevant files and locations
2. Use Read to view the full context around the match
3. Confirm the code does what you expected
4. Make your changes based on verified understanding

```bash
# Step 1: Search
ccc search "database connection setup"
# Result: src/db/connection.py, lines 15-40

# Step 2: Verify with Read tool
# Read src/db/connection.py to see the full context
```

---

<!-- /ANCHOR:verifying-results-with-read -->
<!-- ANCHOR:common-query-patterns -->
## 8. COMMON QUERY PATTERNS

### Architecture and Design

```bash
ccc search "how is the application structured"
ccc search "entry point and initialization"
ccc search "dependency injection setup"
ccc search "module boundaries and exports"
```

### Error Handling

```bash
ccc search "error handling and recovery patterns"
ccc search "custom error classes and types"
ccc search "logging errors with context"
ccc search "retry logic for failed operations"
```

### Data and Database

```bash
ccc search "database connection and pooling"
ccc search "data validation before saving"
ccc search "database migration scripts"
ccc search "query optimization and indexing"
```

### Authentication and Security

```bash
ccc search "user authentication flow"
ccc search "authorization and permissions"
ccc search "password hashing and verification"
ccc search "API key validation"
```

### Testing

```bash
ccc search "test setup and fixtures"
ccc search "mocking external dependencies"
ccc search "integration test configuration"
ccc search "test data factories"
```

### Configuration

```bash
ccc search "application configuration loading"
ccc search "environment variable handling"
ccc search "feature flags implementation"
ccc search "configuration validation"
```

---

<!-- /ANCHOR:common-query-patterns -->
<!-- ANCHOR:related-resources -->
## 9. RELATED RESOURCES

| Resource        | Location                                                           |
| --------------- | ------------------------------------------------------------------ |
| Tool Reference  | `.opencode/skill/mcp-cocoindex-code/references/tool_reference.md`  |
| INSTALL_GUIDE   | `.opencode/skill/mcp-cocoindex-code/INSTALL_GUIDE.md`             |
| Config Templates| `.opencode/skill/mcp-cocoindex-code/assets/config_templates.md`    |

<!-- /ANCHOR:related-resources -->
