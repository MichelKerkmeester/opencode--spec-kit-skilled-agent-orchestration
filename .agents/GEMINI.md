## Tool Routing Enforcement

This runtime does not have hook support for automatic tool routing. Follow this decision tree for ALL code search tasks:

### Code Search Decision Tree (MANDATORY)
| Query Type | Tool | When to Use |
|-----------|------|-------------|
| Semantic/concept | `mcp__cocoindex_code__search` | "find auth logic", "code that handles X", "implementation of Y" |
| Structural (callers, deps) | `code_graph_query` | "what calls X", "imports of Y", "dependency graph" |
| Exact text/regex | `Grep` | "find TODO", "occurrences of API_KEY", "lines matching pattern" |

### Anti-Patterns
- Do NOT default to Grep for concept searches — use CocoIndex
- Do NOT use memory_search for code search — it searches memory, not code
- Check CocoIndex availability first: if unavailable, fall back to Grep
