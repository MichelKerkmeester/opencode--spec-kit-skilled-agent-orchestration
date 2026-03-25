---
title: Trigger Configuration
description: Complete configuration guide for memory trigger phrases and the fast trigger matching system.
---

# Trigger Configuration - Keywords and Manual Save Settings

Complete configuration guide for memory trigger phrases and the fast trigger matching system.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

**Core Principle:** Trigger detection must be fast (<50ms) and reliable, using optimized phrase matching to surface relevant memories without impacting conversation flow.

The memory workflow supports manual activation mechanisms:
1. **Command Trigger** - `/memory:save` command for explicit saves
2. **Phrase Triggers** - User phrases that directly invoke memory operations

> **OpenCode Note:** Automatic interval-based saves (e.g., "every 20 messages") are NOT supported in OpenCode because OpenCode lacks the hooks system required to count messages and trigger saves automatically. All context preservation must be manually triggered.

This reference covers trigger phrase configuration, the MCP-based matching system, and best practices for custom trigger design.

### Key Components

| Component | Purpose | Performance Target |
|-----------|---------|-------------------|
| `/memory:save` Command | Primary save trigger | Immediate |
| Trigger Phrases | Explicit memory activation | <50ms detection |
| MCP Tool | Fast phrase matching | <50ms response |
| Custom Config | Project-specific triggers | Configurable |

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:trigger-phrases -->
## 2. TRIGGER PHRASES

The following phrases activate memory operations (case-insensitive matching):

### Primary Triggers

| Category | Primary Phrase | Alternatives |
|----------|----------------|--------------|
| **Save** | "save context" | "save conversation", "save session" |
| **Document** | "document this" | "preserve context", "save this discussion" |
| **Remember** | "remember this" | "store this", "keep this context" |
| **Checkpoint** | "checkpoint" | "save checkpoint", "create checkpoint" |

### Detection Logic

```typescript
const TRIGGER_PHRASES: readonly string[] = [
  // Save category
  'save context',
  'save conversation',
  'save session',
  'save this discussion',

  // Document category
  'document this',
  'preserve context',

  // Remember category
  'remember this',
  'store this',
  'keep this context',

  // Checkpoint category
  'checkpoint',
  'save checkpoint',
  'create checkpoint'
] as const;

function detectTrigger(userMessage: string): boolean {
  const normalized = userMessage.toLowerCase();
  return TRIGGER_PHRASES.some(phrase => normalized.includes(phrase));
}
```

### MCP Tool Integration

The `memory_match_triggers` MCP tool provides fast trigger phrase matching without requiring embeddings:

```typescript
// Fast trigger matching (<50ms) - no embeddings required
const result = await spec_kit_memory_memory_match_triggers({
  prompt: "I want to save context for this session",
  limit: 3  // Maximum matching memories to return
});

// Returns matching memories based on trigger phrases
// Ideal for proactive memory surfacing during conversation
```

**Usage Scenarios:**
- Quick keyword-based memory lookup before semantic search
- Proactive memory surfacing during conversation
- Fallback when semantic search is unavailable

### Gate 3 Enforcement Triggers

The constitutional memory for Gate 3 enforcement uses 33 trigger phrases to detect file modification intent:

| Category | Trigger Phrases |
|----------|-----------------|
| **Create** | `create`, `add`, `generate`, `build`, `implement`, `write` |
| **Modify** | `modify`, `edit`, `update`, `change`, `refactor`, `fix` |
| **Delete** | `delete`, `remove`, `cleanup` |
| **Move** | `rename`, `move`, `migrate` |
| **Scale Indicators** | `comprehensive`, `all bugs`, `multiple files`, `codebase`, `entire`, `full`, `everything` |
| **Agent Patterns** | `parallel agents`, `15 agents`, `10 agents`, `dispatch agents`, `opus agents` |
| **Compound Actions** | `analyze and fix`, `find and fix`, `fix all`, `update all`, `modify all`, `check and fix` |
| **Gate Keywords** | `spec folder`, `gate 3`, `file modification` |

**How Gate 3 Trigger Matching Works:**

1. AI calls `memory_match_triggers({ prompt: "user message" })`
2. If prompt matches any Gate 3 trigger, constitutional memory surfaces
3. AI sees reminder to ask spec folder question before file modifications

**Example:**

```typescript
// User says: "refactor the authentication module"
const matches = await memory_match_triggers({
  prompt: "refactor the authentication module"
});
// Returns: Gate 3 enforcement constitutional memory 
// matchedPhrases: ["refactor"]
// AI then asks: "Spec Folder (required): A) Existing | B) New | C) Update related | D) Skip"
```

**Trigger Design Guidelines for Constitutional Memories:**

| Guideline | Description |
|-----------|-------------|
| **Cover action verbs** | Include all verbs that indicate file modification intent |
| **Include scale words** | Words like "comprehensive", "all", "entire" suggest large changes |
| **Add domain terms** | Include project-specific terms for your enforcement use case |
| **Test coverage** | Verify triggers match common user phrases |
| **Limit count** | 20-40 triggers recommended for constitutional memories |

---

### Signal Vocabulary Expansion

Beyond the default trigger phrases, the system recognizes expanded signal types for contextual trigger matching:

| Signal | Purpose | Example Phrases |
|--------|---------|----------------|
| `CORRECTION` | Tracks when a memory is corrected or superseded | "actually", "correction", "that was wrong", "update previous" |
| `PREFERENCE` | Captures user preference signals | "I prefer", "use this instead", "default to", "always do" |
| `REINFORCEMENT` | Positive validation of existing memories | "that's right", "confirmed", "keep this" |
| `DEPRECATION` | Marks memories as outdated | "no longer valid", "deprecated", "removed", "obsolete" |

These signals are detected during `memory_match_triggers()` processing and influence save-time arbitration (prediction-error scoring) and correction tracking.

---

<!-- /ANCHOR:trigger-phrases -->
<!-- ANCHOR:manual-save-methods -->
## 3. MANUAL SAVE METHODS

### Primary Method: Command

```
/memory:save
```

This is the most reliable way to save context in OpenCode.

### Alternative: Trigger Phrases

Include any of these phrases in your message:
- "save context"
- "save conversation" 
- "please save this session"
- "checkpoint"

### When to Save Context

| Scenario | Recommendation |
|----------|----------------|
| Feature complete | Save after implementation milestones |
| Complex discussion | Save after major architectural decisions |
| Team sharing | Save before handoff to colleagues |
| Session ending | Save at end of work session |
| Research findings | Save valuable discoveries immediately |

### Save Location

- **Save location:** `{spec_folder}/memory/` (spec-folder boundary enforced)

**Filename pattern:** `DD-MM-YY_HH-MM__short-description.md`

---

<!-- /ANCHOR:manual-save-methods -->
<!-- ANCHOR:customization -->
## 4. CUSTOMIZATION

### Adding Custom Triggers

Create or modify `config.jsonc` in your project root:

```jsonc
{
  "memory": {
    "triggers": {
      // Add custom trigger phrases
      "custom": [
        "my custom phrase",
        "another trigger",
        "project-specific term"
      ],
      
      // Disable default triggers (optional)
      "disableDefaults": false,
      
      // Case sensitivity (default: false)
      "caseSensitive": false
    }
  }
}
```

### Custom Trigger Function

```typescript
// Extended detection with custom triggers
interface TriggerResult {
  matched: boolean;
  source: 'default' | 'custom' | null;
}

const CUSTOM_TRIGGERS: readonly string[] = [
  'my custom phrase',
  'another trigger',
  'project-specific term'
] as const;

function detectCustomTrigger(userMessage: string, customPhrases: readonly string[] = CUSTOM_TRIGGERS): TriggerResult {
  const normalized = userMessage.toLowerCase();

  // Check default triggers first
  if (TRIGGER_PHRASES.some(phrase => normalized.includes(phrase))) {
    return { matched: true, source: 'default' };
  }

  // Check custom triggers
  if (customPhrases.some(phrase => normalized.includes(phrase))) {
    return { matched: true, source: 'custom' };
  }

  return { matched: false, source: null };
}
```

### Per-Project Configuration

Override defaults in your spec folder's memory settings:

```markdown
<!-- specs/001-feature/memory/config.md -->
# Memory Configuration

## Custom Triggers
- "feature complete"
- "milestone reached"
- "ready for review"
```

---

<!-- /ANCHOR:customization -->
<!-- ANCHOR:performance-targets -->
## 5. PERFORMANCE TARGETS

### Trigger Matching Performance

| Operation | Target | Acceptable | Degraded |
|-----------|--------|------------|----------|
| Phrase detection | <10ms | <50ms | >100ms |
| MCP tool call | <50ms | <100ms | >200ms |
| Custom trigger check | <20ms | <50ms | >100ms |

### Optimization Strategies

```typescript
// Pre-compile regex for frequently-used triggers
interface CompiledTrigger {
  phrase: string;
  regex: RegExp;
}

const COMPILED_TRIGGERS: readonly CompiledTrigger[] = TRIGGER_PHRASES.map(phrase => ({
  phrase,
  regex: new RegExp(phrase.replace(/\s+/g, '\\s+'), 'i')
}));

function optimizedDetection(userMessage: string): CompiledTrigger | undefined {
  // Use pre-compiled regex for faster matching
  return COMPILED_TRIGGERS.find(t => t.regex.test(userMessage));
}
```

---

<!-- /ANCHOR:performance-targets -->
<!-- ANCHOR:best-practices -->
## 6. BEST PRACTICES

### Good vs Bad Trigger Phrases

| Category | Good Example | Bad Example | Reason |
|----------|--------------|-------------|--------|
| Specificity | "save this debug context" | "save" | Too generic causes false positives |
| Clarity | "checkpoint: auth complete" | "done" | Clear intent vs ambiguous |
| Action-oriented | "remember the API decision" | "this is important" | Explicit action vs vague |
| Scoped | "document the fix for #123" | "document" | Context-aware vs generic |

### Trigger Phrase Design Guidelines

1. **Be Specific** - Use action verbs with context
   - ✅ "save context for the auth refactor"
   - ❌ "save this"

2. **Avoid Common Words** - Prevent false positives
   - ✅ "checkpoint session"
   - ❌ "save" (too common)

3. **Include Context Type** - Help categorization
   - ✅ "document decision: chose JWT over sessions"
   - ❌ "document this"

4. **Use Consistent Patterns** - Establish team conventions
   - ✅ "memory: [type] - [description]"
   - ❌ Ad-hoc phrases per person

### When to Save (Manual Guidelines)

```markdown
## Save More Frequently When:
- Complex multi-file refactoring
- Debugging sessions with many iterations
- Research with valuable discoveries
- Architecture decisions in progress

## Save Less Frequently When:
- Simple, repetitive tasks
- Well-understood changes
- Batch file operations
```

### Integration Checklist

Before deploying custom triggers:

- [ ] Test trigger phrases don't conflict with common conversation
- [ ] Verify MCP tool response times meet <50ms target
- [ ] Document custom triggers in project README
- [ ] Establish team convention for save frequency

---

<!-- /ANCHOR:best-practices -->
<!-- ANCHOR:related-resources -->
## 7. RELATED RESOURCES

### Reference Files
- [SKILL.md](../../SKILL.md) - Main workflow-memory skill documentation

### Scripts
- [generate-context.ts](../../scripts/memory/generate-context.ts) - Context generation script

### Related Skills
- `spec_kit_memory` - Integrated MCP tools for context preservation
<!-- /ANCHOR:related-resources -->
