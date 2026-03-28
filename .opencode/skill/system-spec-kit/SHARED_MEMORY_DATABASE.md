---
title: Shared Memory
description: Controlled knowledge sharing between users and agents through deny-by-default membership, rollout controls and an emergency kill switch.
trigger_phrases:
  - shared memory
  - shared space
  - deny by default
  - kill switch
  - membership
  - multi-agent sharing
  - shared knowledge
---

# Shared Memory

Control which users and agents can access shared knowledge through deny-by-default spaces, role-based membership and an emergency kill switch.

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. QUICK START](#2--quick-start)
- [3. USE CASES](#3--use-cases)
- [4. FEATURES](#4--features)
- [5. CONFIGURATION](#5--configuration)
- [6. USAGE EXAMPLES](#6--usage-examples)
- [7. TROUBLESHOOTING](#7--troubleshooting)
- [8. FAQ](#8--faq)
- [9. RELATED DOCUMENTS](#9--related-documents)

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Shared memory lets multiple users or agents access the same pool of knowledge inside a controlled space. Picture a shared office with a keycard lock. The office stays locked until an admin activates it. Only people on the access list can enter. And management can lock it down instantly if something goes wrong.

The feature lives inside the same SQLite database as your private memories. It does not create a separate file or move any existing data. It adds an access layer on top of what you already have.

### Key Facts

| Aspect | Detail |
|--------|--------|
| **Tools** | 4 tools: `shared_memory_enable`, `shared_space_upsert`, `shared_space_membership_set`, `shared_memory_status` |
| **Roles** | `owner`, `editor`, `viewer` |
| **Default state** | Disabled. Requires explicit opt-in |
| **Access model** | Deny-by-default. Nobody gets in unless granted membership |
| **Database** | Same `context-index.sqlite` file. No separate database |
| **Command** | `/memory:manage shared` with subcommands: `enable`, `create`, `member`, `status` |

### When You Need This

Shared memory makes sense when multiple people or agents must read and write to a common knowledge pool with controlled access. Two typical cases:

- **Team projects** where agents and humans collaborate on the same codebase and need a shared context pool
- **Multi-agent setups** where you want certain agents to share findings while keeping others out

### When You Do Not Need This

If you work solo and all your agents connect to the same MCP server, every agent can already see every memory by default. Shared memory adds value only when you need controlled access boundaries between different users or agents.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:quick-start -->
## 2. QUICK START

### Prerequisites

- Spec Kit Memory MCP server running (configured in `opencode.json`)
- Admin identity env var configured (see [Configuration](#5--configuration))

### Step 1: Configure admin identity

Add the admin env var to your MCP server config in `opencode.json`. You need this before creating any space:

```json
{
  "spec_kit_memory": {
    "environment": {
      "SPECKIT_SHARED_MEMORY_ADMIN_AGENT_ID": "spec-kit"
    }
  }
}
```

Restart the MCP server after this change. Claude Code restarts it automatically on the next tool call.

### Step 2: Enable the subsystem

Run the command with no arguments. If shared memory is not yet enabled, it walks you through first-time setup:

```text
/memory:manage shared
```

Confirm when prompted. This creates the database tables and persists the enabled state.

### Step 3: Create your first space

```text
/memory:manage shared create my-team my-tenant "Team Alpha" --actor-agent spec-kit
```

The first create auto-grants the acting caller `owner` access so the space is not locked out from the start.

### Step 4: Verify

```text
/memory:manage shared status
```

You should see 1 space with the acting agent listed as owner.

<!-- /ANCHOR:quick-start -->

---

<!-- ANCHOR:use-cases -->
## 3. USE CASES

### Team Knowledge Pool

A team of engineers and AI agents works on the same codebase. One agent discovers a root cause during debugging. Another agent picks up a related task the next day. Without shared memory, the second agent starts from scratch. With a shared space, the debugging findings are already in its search results.

### Controlled Agent Collaboration

You run four AI agents but only two should share context about a sensitive refactor. Create a shared space, grant those two agents `editor` access and leave the others out. The deny-by-default model means the other agents never see the shared content.

### Onboarding New Team Members

A new contributor joins the project. Instead of re-explaining architecture decisions and resolved incidents, you grant them `viewer` access to the team's shared space. They can search the same knowledge pool that the rest of the team built over months.

### Incident Response With Kill Switch

Your shared space contains outdated guidance after a breaking change. Flip the kill switch to block all reads immediately while you update the content. Once the corrections are in place, turn it back off. Nobody acts on stale information during the gap.

<!-- /ANCHOR:use-cases -->

---

<!-- ANCHOR:features -->
## 4. FEATURES

### Spaces

A shared space is a named container for knowledge. Each space belongs to a tenant and holds its own membership list. You create spaces with `shared_space_upsert` and manage them through the `/memory:manage shared create` command.

Spaces store their definition in the `shared_spaces` database table alongside your existing memory tables. Creating a space does not copy or move any memories. It creates an access boundary that you then populate with members.

### Membership

Access is deny-by-default. Nobody can read or write to a shared space unless an owner explicitly grants them a role.

| Role | Can read | Can write | Can manage members | Can flip kill switch |
|------|----------|-----------|-------------------|---------------------|
| **owner** | Yes | Yes | Yes | Yes |
| **editor** | Yes | Yes | No | No |
| **viewer** | Yes | No | No | No |

The person (or agent) who creates a space automatically becomes its owner. After that, only owners can add or change membership for other users and agents.

### Rollout Controls

Each space has two independent switches.

**Rollout enabled** controls whether non-owner members can access the space. When set to `false`, members with `editor` or `viewer` roles are blocked even though they have membership. Owners can still manage the space. This is useful for staging a space before opening it to the team.

**Rollout cohort** is an optional label you attach to a space for organizing groups. The system does not enforce cohort rules automatically. It is metadata for your own tracking during phased rollouts.

### Kill Switch

Every space has an emergency off button. When you flip the kill switch, the system immediately blocks all access for every member. Editors and viewers are locked out. Owners can still modify the space definition to turn the kill switch back off, but they cannot read shared content while it is active.

Use the kill switch for incident response, or when you discover a problem with shared content and need to stop access while you investigate.

### Coexistence With Private Memory

Private and shared memories live in the same database. The `memory_index` table has a `shared_space_id` column. When this column is empty, the memory is private. When it points to a shared space, the memory is accessible to anyone with membership.

```text
┌─────────────────────────────────────────────────────┐
│                  context-index.sqlite               │
│                                                     │
│  ┌──────────────┐    ┌────────────────────────────┐ │
│  │ memory_index │    │  shared_spaces             │ │
│  │              │    │  shared_space_members      │ │
│  │  (private +  │◄───│  shared_space_conflicts     │ │
│  │   shared)    │    │                            │ │
│  └──────────────┘    └────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

Search works the same way it always has. When you run `memory_search`, the system checks which shared spaces you belong to and includes those memories in results alongside your private ones. Collaborator B can find memories that Collaborator A saved to a shared space without needing to be in the same session or conversation.

### Conflict Handling

When two agents write conflicting updates to the same memory in a shared space, the system picks a resolution strategy automatically.

| Situation | Strategy | What happens |
|-----------|----------|-------------|
| First conflict on a key | `append_version` | Both versions stored separately |
| Repeat conflict on same key | `manual_merge` | Flagged for human review |
| High-risk edit (destructive or schema mismatch) | `manual_merge` | Flagged for human review |
| Caller provides explicit strategy | Custom | Uses the caller's choice |

All conflicts are recorded in the `shared_space_conflicts` table with metadata about who wrote what and which strategy was selected.

<!-- /ANCHOR:features -->

---

<!-- ANCHOR:configuration -->
## 5. CONFIGURATION

### Environment Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| `SPECKIT_SHARED_MEMORY_ADMIN_USER_ID` | Admin user identity for space creation and membership changes | One of these two (exactly one) |
| `SPECKIT_SHARED_MEMORY_ADMIN_AGENT_ID` | Admin agent identity for space creation and membership changes | One of these two (exactly one) |
| `SPECKIT_MEMORY_SHARED_MEMORY` | Force-enable shared memory. Set to `true` or `1` | No. Overrides DB state |
| `SPECKIT_HYDRA_SHARED_MEMORY` | Alias for the above | No. Same behavior |

You must configure exactly one admin identity: either user or agent, not both. The server checks this identity on every space creation and membership change.

### opencode.json Example

A complete MCP server configuration with shared memory admin identity:

```jsonc
{
  "spec_kit_memory": {
    "type": "local",
    "command": ["node", ".opencode/skill/system-spec-kit/mcp_server/dist/context-server.js"],
    "environment": {
      "SPECKIT_SHARED_MEMORY_ADMIN_AGENT_ID": "spec-kit",
      "EMBEDDINGS_PROVIDER": "auto",
      "MEMORY_DB_PATH": ".opencode/skill/system-spec-kit/mcp_server/dist/database/context-index.sqlite"
    }
  }
}
```

### Two-Tier Enablement

The system checks whether shared memory is active using two tiers. The first tier always wins.

1. **Tier 1 (env var)**: If `SPECKIT_MEMORY_SHARED_MEMORY` or `SPECKIT_HYDRA_SHARED_MEMORY` is set to `true` or `1`, shared memory is enabled regardless of what the database says.
2. **Tier 2 (database)**: The `config` table stores a `shared_memory_enabled` key. Running `/memory:manage shared enable` sets this to `true` and it persists across restarts.

If neither tier is active, shared memory stays off.

<!-- /ANCHOR:configuration -->

---

<!-- ANCHOR:usage-examples -->
## 6. USAGE EXAMPLES

### Enable and Create a Space

First-time setup followed by space creation:

```text
# Turn on the subsystem (one-time)
/memory:manage shared enable

# Create a space named "research" in tenant "acme"
/memory:manage shared create research acme "Research Team" --actor-agent spec-kit
```

### Add Members

Grant access to agents and users. The acting agent must already own the space:

```text
# Grant an agent editor access (read and write)
/memory:manage shared member research acme agent claude-code editor --actor-agent spec-kit

# Grant a user viewer access (read-only)
/memory:manage shared member research acme user alice viewer --actor-agent spec-kit
```

### Emergency Kill Switch

Block access, verify the block, then restore:

```text
# Block all access immediately
/memory:manage shared create research acme "Research Team" --actor-agent spec-kit --kill-switch

# Confirm access is blocked
/memory:manage shared status

# Restore access by updating without kill switch
/memory:manage shared create research acme "Research Team" --actor-agent spec-kit
```

The kill switch is set through `shared_space_upsert` by passing `killSwitch: true`. The `/memory:manage shared create` command wraps this tool.

### Check Accessible Spaces

Query which spaces are visible to a given identity:

```text
# View all spaces you can access
/memory:manage shared status

# View spaces for a specific user
/memory:manage shared status --user alice

# View spaces for a specific agent
/memory:manage shared status --agent claude-code
```

<!-- /ANCHOR:usage-examples -->

---

<!-- ANCHOR:troubleshooting -->
## 7. TROUBLESHOOTING

### "Shared-memory admin identity is not configured"

**Cause**: Neither `SPECKIT_SHARED_MEMORY_ADMIN_USER_ID` nor `SPECKIT_SHARED_MEMORY_ADMIN_AGENT_ID` is set in your environment.

**Fix**: Add exactly one of these env vars to the `environment` block in `opencode.json` and restart the MCP server.

### "Shared memory is not enabled"

**Cause**: The subsystem has not been turned on yet.

**Fix**: Run `/memory:manage shared enable` or set `SPECKIT_MEMORY_SHARED_MEMORY=true` in your environment.

### "Actor must already own the shared space"

**Cause**: You tried to modify a space or change membership without owner access.

**Fix**: Use the admin identity that originally created the space. Check which identity is configured in your env vars.

### Members cannot access a space that exists

**Cause**: `rolloutEnabled` is set to `false` on the space.

**Fix**: Update the space with `rolloutEnabled: true` via `shared_space_upsert`.

### Everyone is locked out including editors

**Cause**: The kill switch is active on the space.

**Fix**: The space owner must update with `killSwitch: false` to restore access.

### "Provide exactly one of --actor-user or --actor-agent"

**Cause**: You passed both actor flags or neither.

**Fix**: Each command requires exactly one actor identity. Pick either `--actor-user` or `--actor-agent`.

<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:faq -->
## 8. FAQ

**Q: Does shared memory create a separate database?**
A: No. Everything stays in the same `context-index.sqlite` file. Shared memory adds three tables to the existing database: `shared_spaces`, `shared_space_members` and `shared_space_conflicts`.

**Q: Do I need this for solo development?**
A: Probably not. If you work alone and all your AI agents connect to the same MCP server, they already share the same memory database. Shared memory becomes useful when you need controlled access boundaries between different users or agents.

**Q: What happens to my existing private memories?**
A: Nothing changes. Private memories remain private. Shared memory is an additional access dimension, not a replacement for individual memory ownership.

**Q: Can I undo enablement?**
A: Yes. Remove the `SPECKIT_MEMORY_SHARED_MEMORY` env var and the database config reverts to whatever was previously set. You can also clear the `shared_memory_enabled` key in the `config` table directly.

**Q: How do I remove someone from a shared space?**
A: There is no explicit "remove" command. You can change their role to `viewer` to restrict write access. Full removal requires a direct database update to delete the membership row from `shared_space_members`.

**Q: Can a memory belong to both a private scope and a shared space?**
A: Yes. The `shared_space_id` column is an additional dimension on `memory_index`. A memory can have both a `user_id` (private owner) and a `shared_space_id` (shared access). It will be accessible through both paths.

<!-- /ANCHOR:faq -->

---

## 9. RELATED DOCUMENTS

- [Spec Kit Memory README](./README.md) -- Full system overview including all 33 MCP tools
- [Feature Catalog Entry](./feature_catalog/17--governance/04-shared-memory-rollout-deny-by-default-membership-and-kill-switch.md) -- Canonical feature description with source file references
- [Environment Variables Reference](./references/config/environment_variables.md) -- Complete env var documentation
- [MCP Server README](./mcp_server/README.md) -- Full API reference for all tools
