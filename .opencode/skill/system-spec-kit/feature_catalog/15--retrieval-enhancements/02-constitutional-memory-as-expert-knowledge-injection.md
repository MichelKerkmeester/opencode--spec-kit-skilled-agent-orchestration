# Constitutional memory as expert knowledge injection

## 1. OVERVIEW

Constitutional-tier memories receive retrieval directive metadata that instructs the LLM when to surface them.

Some memories are fundamental rules that should always come up when relevant, like "never delete production data." This feature tags those high-priority memories with instructions about when to surface them. It works like sticky notes on a filing cabinet that say "pull this file whenever someone asks about X."

---

## 2. CURRENT REALITY

Constitutional-tier memories receive a `retrieval_directive` metadata field formatted as explicit instruction prefixes for LLM consumption. Examples: "Always surface when: user asks about memory save rules" or "Prioritize when: debugging search quality."

Rule patterns are extracted from content using a ranked list of imperative verbs (must, always, never, should, require) and condition-introducing words (when, if, for, during). Scanning is capped at 2,000 characters from the start of content, and each directive component is capped at 120 characters. The `enrichWithRetrievalDirectives()` function maps over results without filtering or reordering. The enrichment is wired into `hooks/memory-surface.ts` before returning results.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/retrieval-directives.ts` | Lib | Constitutional retrieval injection |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/retrieval-directives.vitest.ts` | Retrieval directive tests |

---

## 4. SOURCE METADATA

- Group: Retrieval enhancements
- Source feature title: Constitutional memory as expert knowledge injection
- Current reality source: feature_catalog.md
