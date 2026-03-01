# Hooks Research Synthesis

> **Source Analysis:** opencode-command-hooks repository (spec 062)
> **Applicability:** LIMITED (~20% transferable)

---

## Metadata

| Field              | Value                                                                                   |
| ------------------ | --------------------------------------------------------------------------------------- |
| **Source Spec**    | `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/077-speckit-upgrade-from-research/research/hooks-synthesis.md` |
| **Source Repo**    | https://github.com/shanebishop1/opencode-command-hooks                                  |
| **Version**        | 0.1.8                                                                                   |
| **Analysis Date**  | 2026-01-15                                                                              |
| **Original Confidence** | 92% (HIGH) - for hook-based implementation                                         |
| **Synthesis Confidence** | 75% (MEDIUM) - for pattern transfer only                                           |

---

## Applicability Assessment

> **WARNING: ~80% of the original 062 research is NOT APPLICABLE to this project.**

### Why Most Research Does Not Apply

The original research analyzed `opencode-command-hooks` for installation alongside the spec-kit MCP server. However:

| Assumption in 062           | Reality in This Project       | Impact                     |
| --------------------------- | ----------------------------- | -------------------------- |
| User has OpenCode plugin API | User runs OpenCode WITHOUT hooks | All hook automation N/A  |
| Bun runtime available       | Node.js environment only       | Plugin cannot execute      |
| Toast notifications work    | No plugin API access           | UI notifications N/A       |
| Event hooks fire            | No event interception          | All lifecycle hooks N/A    |

**Bottom Line:** The plugin itself cannot be installed or used. Only the **design patterns** observed in the codebase are transferable.

---

## What IS Transferable (Design Patterns)

These patterns can be adopted in the spec-kit codebase regardless of hooks:

| Pattern                      | Description                                      | Apply To                    | Priority |
| ---------------------------- | ------------------------------------------------ | --------------------------- | -------- |
| **Zod Schema Validation**    | Safe parse with defaults, runtime type checking  | Memory file validation      | P1       |
| **Non-Blocking Error Semantics** | Return results object, never throw           | Async MCP operations        | P1       |
| **Result Object Pattern**    | `{ success, data, error }` consistent format     | All MCP tool responses      | P2       |
| **Flexible Pattern Matching** | String/array/wildcard support in matchers       | Config filtering, triggers  | P2       |
| **Type Guard Pattern**       | Runtime type discrimination for unions           | Discriminated union handling| P3       |

### Pattern Code Examples

**1. Zod Safe Parsing**
```typescript
// Safe parse with defaults - apply to memory file validation
function parseConfig(input: unknown): Config {
  const result = ConfigSchema.safeParse(input);
  return result.success ? result.data : { tool: [], session: [] };
}
```

**2. Non-Blocking Error Semantics**
```typescript
// Return results, never throw - apply to async operations
async function executeOperation(): Promise<Result> {
  try {
    const data = await operation();
    return { success: true, data, error: null };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}
```

**3. Flexible Pattern Matching**
```typescript
// String, array, wildcard matching - apply to config filtering
function matches(pattern: string | string[] | undefined, value: string): boolean {
  if (pattern === undefined || pattern === "*") return true;
  if (Array.isArray(pattern)) return pattern.includes(value);
  return pattern === value;
}
```

---

## What is NOT Applicable

These features require the OpenCode plugin API which is not available:

| Feature                       | Requires              | Why N/A                              |
| ----------------------------- | --------------------- | ------------------------------------ |
| `session.created` hook        | Plugin API            | No event interception in plain OpenCode |
| `session.idle` hook           | Plugin API            | No idle detection available          |
| `tool.execute.before` hook    | Plugin API            | Cannot intercept tool calls          |
| `tool.execute.after` hook     | Plugin API            | Cannot intercept tool results        |
| Toast notifications           | Plugin API + UI       | No notification system access        |
| Context injection             | Plugin API            | Cannot inject into conversation      |
| Shell command execution       | Bun runtime           | Node.js only environment             |
| Agent-specific hook config    | Plugin API            | Agent events not exposed             |

---

## Reason for Non-Applicability

The `opencode-command-hooks` plugin relies on:

1. **`@opencode-ai/plugin` SDK** - Provides lifecycle event hooks
2. **`@opencode-ai/sdk` SDK** - Provides conversation/session access
3. **Bun runtime** - Required for the plugin's shell execution

Without these, the plugin cannot:
- Intercept any lifecycle events
- Execute shell commands on events
- Show toast notifications
- Inject context into conversations

**The plugin is designed for users who have the full OpenCode plugin ecosystem. This project uses OpenCode in a standard configuration without plugin support.**

---

## Limited Implementation Recommendations

Given the ~20% applicability, recommended actions:

| Priority | Action                           | Effort   | Benefit                    |
| -------- | -------------------------------- | -------- | -------------------------- |
| P1       | Adopt Zod for memory validation  | 2-4 hrs  | Safer config parsing       |
| P1       | Implement non-blocking errors    | 4-8 hrs  | Better error recovery      |
| P2       | Use result object pattern        | 4-8 hrs  | Consistent API responses   |
| P2       | Add flexible pattern matching    | 2-4 hrs  | Better trigger matching    |
| SKIP     | Install opencode-command-hooks   | N/A      | **NOT POSSIBLE**           |
| SKIP     | Configure hook automation        | N/A      | **NOT POSSIBLE**           |

---

## References

| Document                  | Path                                                                                     |
| ------------------------- | ---------------------------------------------------------------------------------------- |
| Original Research         | `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/077-speckit-upgrade-from-research/research/hooks-synthesis.md` |
| Decision Record           | `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/077-speckit-upgrade-from-research/decision-record.md` |
| Source Repository         | https://github.com/shanebishop1/opencode-command-hooks                                   |

---

## Summary

The 062 research on `opencode-command-hooks` is high-quality but **largely inapplicable** to this project due to the lack of OpenCode plugin API access.

**Transferable:** Design patterns (Zod validation, non-blocking errors, result objects, flexible matching)

**Not Transferable:** All hook-based automation, toast notifications, context injection, shell execution on events

**Recommendation:** Extract the design patterns listed above into spec-kit improvements. Do NOT attempt to install or configure the hooks plugin.
