---
description: Shared-memory space lifecycle: create spaces, manage memberships, and inspect rollout status
argument-hint: "enable | create <spaceId> <tenantId> <name> (--actor-user <id> | --actor-agent <id>) | member <spaceId> <tenantId> <subjectType> <subjectId> <role> (--actor-user <id> | --actor-agent <id>) | status [--tenant <id>] [--user <id>] [--agent <id>]"
allowed-tools: Read, spec_kit_memory_shared_space_upsert, spec_kit_memory_shared_space_membership_set, spec_kit_memory_shared_memory_status, spec_kit_memory_shared_memory_enable
---

# 🚨 MANDATORY FIRST ACTION - DO NOT SKIP

## Section 0: FEATURE ENABLEMENT CHECK

**BEFORE routing any subcommand, check enablement:**

```text
1. Call shared_memory_status() (no args)
2. IF data.enabled is false:
   → Display:

     MEMORY:SHARED — FIRST-TIME SETUP
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

       Shared memory is not yet enabled for this workspace.

       This will:
       • Create shared-memory infrastructure tables
       • Persist enablement in the database
       • Generate a README in shared-spaces/

       Enable shared memory? (yes/no)

   → WAIT for user confirmation
   → On "yes": call shared_memory_enable()
   → Display:

     MEMORY:SHARED — SETUP COMPLETE
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

       Shared memory is now enabled.
       Use /memory:shared to manage spaces and memberships.

     STATUS=OK ACTION=enable

   → On "no": STATUS=OK ACTION=skipped MESSAGE="Setup skipped. Run /memory:shared enable when ready."
   → STOP (do not proceed to subcommand routing)
3. IF data.enabled is true:
   → Continue to argument routing below
```

---

**AFTER enablement check passes, CHECK `$ARGUMENTS`:**

```text
IF $ARGUMENTS is empty, undefined, or contains only whitespace:
    → STOP IMMEDIATELY
    → Display the OVERVIEW DASHBOARD (Section 5)
    → WAIT for user to select a subcommand

IF $ARGUMENTS starts with a recognized subcommand:
    → Route per Section 4

IF $ARGUMENTS is unrecognized:
    → STATUS=FAIL ERROR="Unknown subcommand. Valid: create, member, status, enable"
```

---

# /memory:shared: Shared-Memory Space Manager

> [L5:Lifecycle] Command home for shared-memory space creation, membership management, and rollout status inspection.

---

```yaml
role: Shared-Memory Space Manager
purpose: Manage shared-memory spaces with deny-by-default membership model
action: Route through create, member, and status subcommands
operating_mode:
  workflow: subcommand_routing
  approvals: none_required
```

---

## 1. PURPOSE

Manage the shared-memory space lifecycle:

- **Create/update spaces:** Create or update shared-memory spaces with rollout controls (`shared_space_upsert`)
- **Manage membership:** Set deny-by-default membership for users or agents (`shared_space_membership_set`)
- **Inspect status:** View current rollout state and accessible spaces (`shared_memory_status`)

> **Deny-by-default model:** Shared spaces require explicit membership before access. The first successful `create` call auto-grants the acting caller `owner` access for that space. After that bootstrap step, all additional access still requires explicit membership changes by an existing owner. This is a rollout-dependent feature; the shared-memory subsystem is opt-in.

---

## 2. CONTRACT

**Inputs:** `$ARGUMENTS`: Subcommand with parameters
**Outputs:** `STATUS=<OK|FAIL>` with subcommand-specific output

---

## 3. QUICK REFERENCE

| Command | Result |
|---------|--------|
| `/memory:shared` | Overview dashboard (triggers first-run setup if disabled) |
| `/memory:shared enable` | Enable shared memory (first-time setup) |
| `/memory:shared create team-alpha tenant-1 "Team Alpha" --actor-user user-1` | Create shared space and bootstrap owner access for the acting user |
| `/memory:shared member team-alpha tenant-1 user user-42 editor --actor-user user-1` | Grant editor access as an existing owner |
| `/memory:shared status` | View all accessible spaces |
| `/memory:shared status --user user-42` | View spaces for specific user |

---

## 4. ARGUMENT ROUTING

```text
$ARGUMENTS
    │
    ├─ Empty (no args)                                        → OVERVIEW DASHBOARD (Section 5)
    ├─ "enable"                                               → ENABLE SHARED MEMORY (call shared_memory_enable)
    ├─ "create <spaceId> <tenantId> <name> (--actor-user <id> | --actor-agent <id>)"
    │                                                       → CREATE/UPDATE SPACE (Section 6)
    ├─ "member <spaceId> <tenantId> <subjectType> <subjectId> <role> (--actor-user <id> | --actor-agent <id>)"
    │                                                       → SET MEMBERSHIP (Section 7)
    └─ "status [--tenant <id>] [--user <id>] [--agent <id>]" → INSPECT STATUS (Section 8)
```

---

## 5. OVERVIEW DASHBOARD

**Trigger:** `/memory:shared` (no arguments)

```text
MEMORY:SHARED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

→ Available Subcommands ──────────────────────────

  [enable]   Enable shared memory (first-time setup)
  [create]   Create or update a shared-memory space
  [member]   Set deny-by-default membership
  [status]   Inspect rollout state and accessible spaces

  Note: Shared memory requires first-run setup via "enable".
  Spaces use a deny-by-default model. First create auto-grants owner access
  to the acting caller, and later access changes require an existing owner.

STATUS=OK ACTION=overview
```

---

## 6. CREATE/UPDATE SPACE

**Trigger:** `/memory:shared create <spaceId> <tenantId> <name> (--actor-user <id> | --actor-agent <id>)`

Creates a new shared-memory space or updates an existing one.

### Workflow

1. Parse `spaceId`, `tenantId`, `name`, and exactly one actor identity from arguments
2. Validate that one and only one actor identity is present: `--actor-user <id>` or `--actor-agent <id>`
3. Apply optional rollout parameters (`rolloutEnabled`, `rolloutCohort`, `killSwitch`)
4. Call `shared_space_upsert()` with all parameters
5. Display confirmation with space details

### Behavior

- The first successful create for a new space auto-grants `owner` access to the acting caller.
- Later updates require the acting caller to already hold `owner` access.
- Creating or updating a space does not grant access to any additional users or agents.

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `spaceId` | string | Yes | Stable shared-space identifier |
| `tenantId` | string | Yes | Owning tenant for the shared space |
| `name` | string | Yes | Display name for the shared space |
| `actorUserId` | string | Exactly one actor | Acting user identity for bootstrap/update operations |
| `actorAgentId` | string | Exactly one actor | Acting agent identity for bootstrap/update operations |
| `rolloutEnabled` | boolean | No | Enable this space for rollout (default: false) |
| `rolloutCohort` | string | No | Rollout cohort label |
| `killSwitch` | boolean | No | Immediately disable access for this space (default: false) |

### Output

```text
MEMORY:SHARED CREATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Space       <spaceId>
  Tenant      <tenantId>
  Name        <name>
  Actor       <user:<actorUserId>|agent:<actorAgentId>>
  Rollout     <enabled|disabled>
  Kill Switch <off|ON>
  Owner Grant <bootstrap owner granted|existing owner verified>

STATUS=OK ACTION=create SPACE=<spaceId>
```

---

## 7. SET MEMBERSHIP

**Trigger:** `/memory:shared member <spaceId> <tenantId> <subjectType> <subjectId> <role> (--actor-user <id> | --actor-agent <id>)`

Sets membership for a user or agent in a shared-memory space.

### Workflow

1. Parse `spaceId`, `tenantId`, actor identity, `subjectType`, `subjectId`, and `role` from arguments
2. Validate exactly one actor identity is present: `--actor-user <id>` or `--actor-agent <id>`
3. Validate `subjectType` is `user` or `agent`
4. Validate `role` is `owner`, `editor`, or `viewer`
5. Call `shared_space_membership_set()` with all parameters
6. Display confirmation

### Behavior

- Membership mutations are deny-by-default and must be performed by an existing owner.
- The actor identity is the caller performing the admin mutation.
- The membership subject is the user or agent receiving the requested role.

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `spaceId` | string | Yes | Shared-space identifier |
| `tenantId` | string | Yes | Tenant boundary for the membership mutation |
| `actorUserId` | string | Exactly one actor | Acting user identity performing the change |
| `actorAgentId` | string | Exactly one actor | Acting agent identity performing the change |
| `subjectType` | string | Yes | `user` or `agent` |
| `subjectId` | string | Yes | Subject identifier |
| `role` | string | Yes | `owner`, `editor`, or `viewer` |

### Output

```text
MEMORY:SHARED MEMBER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Space       <spaceId>
  Tenant      <tenantId>
  Actor       <user:<actorUserId>|agent:<actorAgentId>>
  Subject     <subjectType>:<subjectId>
  Role        <role>

STATUS=OK ACTION=member SPACE=<spaceId>
```

---

## 8. INSPECT STATUS

**Trigger:** `/memory:shared status [--tenant <id>] [--user <id>] [--agent <id>]`

Inspects current shared-memory rollout and the spaces accessible to a user or agent.

> SECURITY: When querying with --user or --agent filters, the caller should provide their own actor identity. Status queries without actor binding may expose cross-principal visibility.

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `tenantId` | string | No | Tenant scope |
| `userId` | string | No | User scope |
| `agentId` | string | No | Agent scope |

### Output

```text
MEMORY:SHARED STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

→ Rollout ────────────────────────────────────────
  Feature     <enabled|disabled>
  Spaces      <N> total

→ Accessible Spaces ─────────────────────────────
  <spaceId>   <name>   <role>
  <spaceId>   <name>   <role>

STATUS=OK ACTION=status
```

---

## 9. ERROR HANDLING

| Condition | Action |
|-----------|--------|
| Unknown subcommand | `STATUS=FAIL`: list valid subcommands |
| Missing required parameter | `STATUS=FAIL ERROR="Missing <param> for <subcommand>"` |
| Missing actor identity | `STATUS=FAIL ERROR="Provide exactly one of --actor-user or --actor-agent"` |
| Multiple actor identities | `STATUS=FAIL ERROR="Provide only one actor identity"` |
| Space not found | `STATUS=FAIL ERROR="Space '<spaceId>' not found"` |
| Invalid subject type | `STATUS=FAIL ERROR="subjectType must be 'user' or 'agent'"` |
| Invalid role | `STATUS=FAIL ERROR="role must be 'owner', 'editor', or 'viewer'"` |
| Membership mutation by non-owner | `STATUS=FAIL ERROR="Actor must already own the shared space"` |
| Shared memory rollout disabled | Warn that feature is not yet enabled |

---

## 10. RELATED COMMANDS

- `/memory:analyze`: Intent-aware context retrieval and analysis tools
- `/memory:save`: Save conversation context
- `/memory:manage`: Database management, checkpoints, ingest
- `/memory:learn`: Constitutional memories
- `/memory:continue`: Session recovery

---
<!-- APPENDIX: Reference material for AI agent implementation -->

## APPENDIX A: MCP TOOL REFERENCE

### Enforcement Matrix

| MODE       | REQUIRED CALLS                    | PATTERN | ON FAILURE     |
| ---------- | --------------------------------- | ------- | -------------- |
| ENABLE     | `shared_memory_enable()`          | SINGLE  | Show error msg |
| CREATE     | `shared_space_upsert()`           | SINGLE  | Show error msg |
| MEMBER     | `shared_space_membership_set()`   | SINGLE  | Show error msg |
| STATUS     | `shared_memory_status()`          | SINGLE  | Show error msg |

### Tool Signatures

```javascript
spec_kit_memory_shared_memory_enable({})
spec_kit_memory_shared_space_upsert({
  spaceId,
  tenantId,
  name,
  actorUserId,   // exactly one of actorUserId or actorAgentId
  actorAgentId,
  rolloutEnabled,
  rolloutCohort,
  killSwitch
})
spec_kit_memory_shared_space_membership_set({
  spaceId,
  tenantId,
  actorUserId,   // exactly one of actorUserId or actorAgentId
  actorAgentId,
  subjectType,
  subjectId,
  role
})
spec_kit_memory_shared_memory_status({ tenantId, userId, agentId })
```

### Tool Coverage

| Tool | Layer | Subcommand | Description |
|------|-------|------------|-------------|
| `shared_memory_enable` | L5 | `enable` | Enable shared-memory subsystem (first-run setup) |
| `shared_space_upsert` | L5 | `create` | Create or update a shared-memory space; first create auto-grants owner access to the actor |
| `shared_space_membership_set` | L5 | `member` | Set deny-by-default membership; actor must already own the space |
| `shared_memory_status` | L5 | `status` | Inspect rollout state and accessible spaces |
