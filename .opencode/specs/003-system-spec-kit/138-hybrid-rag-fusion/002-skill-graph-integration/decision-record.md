# Decision Record: Skill Graphs Integration

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:metadata -->
| Attribute   | Details |
| ----------- | ------- |
| **Status**  | Proposed |
| **Date**    | 2026-02-20 |
| **Authors** | OpenCode AI |
| **Domain**  | Skills System Architecture |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:context -->
## Context and Problem Statement

Currently, our `skills` architecture relies on monolithic markdown files (`SKILL.md`) that contain massive amounts of context. As skills grow in complexity (e.g., adding comprehensive cognitive behavioral therapy concepts or extensive programming knowledge), a single skill file becomes unwieldy. It hits attention limits and token boundaries, and lacks composability.

We need a way to break down large monolithic skills into smaller, composable pieces that reference each other, forming a "skill graph". This allows progressive disclosure of information: the agent reads an index, understands the topology, and traverses links dynamically as context requires. SKILL.md files remain the primary entrypoint and authoritative source. The graph supplements them with optional deep-dive navigation.
<!-- /ANCHOR:context -->

---

<!-- ANCHOR:decision -->
## Decision

We will implement a **Skill Graph Architecture** as a supplemental layer for the OpenCode skill system, enhancing the existing SKILL.md-based system.

The architecture consists of:
1. **Nodes**: Small, composable Markdown files representing single complete thoughts, techniques, or claims.
2. **YAML Frontmatter**: Each node contains a YAML header with a brief description, allowing agents to scan content without loading the full file.
3. **Wikilinks**: Nodes are connected using wikilinks embedded in prose (e.g., `[[agent-cognition]]`), carrying semantic meaning for traversal.
4. **Index Files / MOCs**: Maps of Content (MOCs) that cluster related skills into navigable sub-topics.
5. **Progressive Disclosure**: Agents start at the index, read descriptions, follow links, scan sections, and selectively load full content.

<!-- /ANCHOR:decision -->

---

<!-- ANCHOR:consequences -->
## Consequences

### Positive
- **Extreme Scalability**: Can build massive knowledge bases (e.g., 250+ files) without exceeding token limits on initial load.
- **Context Efficiency**: Only relevant information is injected into the prompt context.
- **Composability**: Skill nodes can be reused across different domains (e.g., a "logging" skill node used by multiple distinct programming skills).
- **Native AI Traversal**: AI agents naturally understand and traverse wikilinks in prose.

### Negative
- **Latency**: Traversing a graph dynamically requires multiple sequential `Read` tool calls, increasing time to first meaningful action.
- **Complex Authoring**: Building a coherent graph is harder than writing a single file. (Mitigated by adopting graph generation tools like `arscontexta`).
- **Discovery Tooling**: We must ensure our current `memory_search` or `glob` tools can effectively traverse or surface these links when needed.
<!-- /ANCHOR:consequences -->

---

<!-- ANCHOR:alternatives -->
## Alternatives Considered

1. **Keep Monolithic Files**: Continue adding to `SKILL.md`. Rejected because it scales poorly and leads to token exhaustion and attention decay for complex domains.
2. **Hardcoded Context Servers (RAG)**: Pure vector search. Rejected because vector search loses the semantic relationships and author-intended structure that wikilinks in prose provide. 
3. **Programmatic Dispatch (Code Mode)**: Using MCP Code Mode to dynamically fetch pieces. While Code Mode is great for execution, Skill Graphs provide a better declarative, knowledge-first approach for domain expertise.
<!-- /ANCHOR:alternatives -->
