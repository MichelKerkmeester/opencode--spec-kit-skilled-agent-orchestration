---
title: Level Specifications
description: Complete specifications for all documentation levels using the manifest-backed Level contract architecture.
---

# Level Specifications - Complete Level 1-3+ Requirements

Complete specifications for all documentation levels using the manifest-backed Level contract architecture where higher levels add value, not just length.

---

## 1. OVERVIEW

### Template Architecture: Manifest-Backed Level Contracts

Templates use a manifest-backed model where `templates/manifest/spec-kit-docs.json` selects rendered `*.md.tmpl` documents for each Level:

```
templates/manifest/
├── spec-kit-docs.json       # Level contract and document membership
├── spec.md.tmpl             # Requirements and scope
├── plan.md.tmpl             # Technical approach
├── tasks.md.tmpl            # Task breakdown
├── checklist.md.tmpl        # Verification gates
├── decision-record.md.tmpl  # Architecture decisions
└── implementation-summary.md.tmpl
├── Level extension                # Level-specific VALUE additions
│   ├── level2-verify/       # +Verification (~185 LOC)
│   ├── level3-arch/         # +Architecture (~220 LOC)
│   └── level3-plus-govern/   # +Governance (~190 LOC)
│
├── Level 1 template contract                 # Composed Level 1: Core only (5 files incl. README)
├── Level 2 template contract                 # Composed Level 2: Core + L2 (6 files incl. README)
├── Level 3 template contract                 # Composed Level 3: Core + L2 + L3 (7 files incl. README)
└── Level 3+ template contract                # Composed Level 3+: All addendums (7 files incl. README)
```

### Template Paths - Quick Reference

| Path | Purpose | When to Use |
|------|---------|-------------|
| `Level template contract` | Ready-to-use templates | **ALWAYS use this for new specs** (N = 1, 2, 3, or 3+) |
| Level source contract | Source components | Reference only (understanding architecture) |
| Level extension contract | Level additions | Reference only (understanding architecture) |

> **IMPORTANT:** Always copy templates from `Level template contract` (where N is 1, 2, 3, or 3+). The Level contract resolution selects and renders the correct template set for new spec folders.

### Progressive Enhancement Model (Value-Based)

```
Level 1 (Core):         Essential what/why/how (~455 LOC)
         ↓ +Verify
Level 2 (Verification): +Quality gates, NFRs, edge cases (~875 LOC)
         ↓ +Arch
Level 3 (Full):         +Architecture decisions, ADRs, risk matrix (~1090 LOC)
         ↓ +Govern
Level 3+ (Extended):    +Enterprise governance, AI protocols (~1075 LOC)
```

### What Each Level ADDS (Value Scaling)

| Level | Adds | New Content |
|-------|------|-------------|
| **L1 (Core)** | Essential what/why/how | Problem, scope, requirements, success criteria |
| **L2 (+Verify)** | Quality gates | NFRs, edge cases, checklist, effort estimation |
| **L3 (+Arch)** | Architecture decisions | Executive summary, ADRs, risk matrix, milestones |
| **L3+ (+Govern)** | Enterprise governance | Approval workflow, compliance, AI protocols |

**Key Points:**
- LOC thresholds are **SOFT GUIDANCE** (not enforcement)
- **Higher levels add VALUE** - not just more boilerplate
- **Verification is script-assisted** - use `validate.sh`, `check-completion.sh`, and `check-placeholders.sh` where applicable
- When in doubt, choose higher level

**Note:** Single typo/whitespace fixes (<5 characters in one file) are exempt from spec folder requirements.

---

## 2. LEVEL 1: BASELINE DOCUMENTATION (LOC GUIDANCE: <100)

### When to Use

- **All features start here** - this is the minimum documentation for any work
- Localized to one component or module
- Includes trivial changes (typos, single-line fixes)
- Clear, well-defined requirements
- Low to moderate complexity

### Required Files (Baseline)

- `spec.md` - Requirements and user stories (scaffolded from `templates/manifest/spec.md.tmpl`)
- `plan.md` - Technical implementation plan (copy template from `level_contract_plan.md`)
- `tasks.md` - Task breakdown by user story (copy template from `level_contract_tasks.md`)
- `implementation-summary.md` - Post-implementation documentation (copy template from `level_contract_implementation-summary.md`)

### Optional Files

- `resource-map.md` - lean path catalog (cross-cutting, see §9)

### Content Expectations

**spec.md required sections:**
- Problem statement or feature description
- Proposed solution
- Files to change
- Testing approach
- Success criteria

**plan.md required sections:**
- Implementation approach
- File changes breakdown
- Testing strategy
- Dependencies

**tasks.md required sections:**
- Task breakdown by user story
- Dependencies between tasks
- Estimated effort per task

**Enforcement:** Hard block if any required file missing

### Example Scenarios

**Good fits for Level 1:**
- Fix "Error" → "Eror" typo
- Update comment for clarity
- Add email validation to contact form
- Fix bug in calculation logic
- Add loading spinner to form submission
- Update error message formatting
- Add new API endpoint (simple CRUD)
- Refactor single component for clarity

**Escalate to Level 2 if:**
- Needs systematic QA validation
- Affects multiple systems (not localized)
- High risk (security, config cascades)
- LOC estimate increases to 100+

### Template Sources

**Manifest templates (scaffolded by `create.sh`):**
- `templates/manifest/spec.md.tmpl`
- `templates/manifest/plan.md.tmpl`
- `templates/manifest/tasks.md.tmpl`
- `templates/manifest/implementation-summary.md.tmpl`

**Core source (for reference):**
- `Level template contract`
- `Level template contract`
- `Level template contract`
- `Level template contract`

### Template Adaptation

1. Fill metadata block (created date, status, level, estimated LOC)
2. Replace `[PROBLEM]` with clear problem statement
3. Replace `[SOLUTION]` with proposed approach
4. List specific files to modify
5. Define testing approach (unit tests, manual verification)
6. State clear success criteria
7. Fill plan.md with implementation steps
8. Fill tasks.md with task breakdown
9. Fill implementation-summary.md at end of implementation
10. Remove all sample content and placeholders

---

## 3. LEVEL 2: VERIFICATION ADDED (LOC GUIDANCE: 100-499)

### When to Use

- Features needing systematic QA validation
- Multiple files or components affected
- Moderate complexity
- High risk areas (security, config cascades)
- Requires validation checklists

### Required Files (Level 1 + checklist)

- `spec.md` (from Level 1) - Requirements and user stories
- `plan.md` (from Level 1) - Technical implementation plan
- `tasks.md` (from Level 1) - Task breakdown by user story
- `implementation-summary.md` (from Level 1) - Post-implementation documentation
- `checklist.md` (NEW at Level 2) - Validation/QA checklists

### Optional Files

- `resource-map.md` - lean path catalog (cross-cutting, see §9)

### Content Expectations

**All Level 1 content expectations PLUS:**

**checklist.md required sections:**
- Pre-implementation validation
- Per-task verification
- Integration testing steps
- Security review checklist (if applicable)
- Deployment verification

**Enforcement:** Hard block if `checklist.md` missing

### Example Scenarios

**Good fits for Level 2:**
- Create reusable modal component with animations
- Implement form validation framework
- Add authentication flow
- Migrate from library A to library B
- Build file upload feature with progress tracking
- Refactor state management approach
- Config changes affecting multiple systems
- Security-related changes

**Escalate to Level 3 if:**
- Requires architectural decisions to be documented
- Discover >500 LOC during implementation
- Complexity increases substantially
- Need multiple developers for coordination
- Architectural impact broader than anticipated

### Template Sources

**Manifest templates (scaffolded by `create.sh`):**
- `templates/manifest/spec.md.tmpl`
- `templates/manifest/plan.md.tmpl`
- `templates/manifest/tasks.md.tmpl`
- `templates/manifest/implementation-summary.md.tmpl`
- `templates/manifest/checklist.md.tmpl`

**Addendum source (+Verify):**
- `Level template contract`
- `Level template contract`
- `Level template contract`

### Template Adaptation

**All Level 1 adaptations PLUS:**

**checklist.md:**
1. Fill pre-implementation checks specific to feature
2. Add implementation validation steps
3. Define testing checklist items
4. Include deployment verification steps
5. Add security checks if applicable
6. Remove all sample content

### Level 2 Example: API Endpoint Feature

**Scenario:** Adding a new REST API endpoint (~200 LOC)

**Folder Structure:**
```
012-user-profile-api/
├── spec.md                    # Requirements and scope
├── plan.md                    # Technical approach
├── tasks.md                   # Implementation tasks
├── implementation-summary.md  # Post-implementation outcomes
├── checklist.md               # Verification checklist (Level 2+)
├── memory/                    # Session context
└── scratch/                   # Temporary files
```

**Checklist Example:**
```markdown
## Implementation Checklist

### P0 - Blockers
- [x] API endpoint responds to GET /users/:id [EVIDENCE: api.test.js:45-67]
- [x] Authentication middleware applied [EVIDENCE: routes/users.js:12]

### P1 - Required
- [x] Input validation implemented [EVIDENCE: validators/user.js]
- [x] Error responses follow API standard [EVIDENCE: manual test]

### P2 - Nice to Have
- [ ] Rate limiting (deferred to next sprint)
```

---

## 4. LEVEL 3: FULL DOCUMENTATION (LOC GUIDANCE: ≥500)

### When to Use

- Complex features, architecture changes, major decisions
- High complexity
- Multiple systems or components involved
- Requires coordination across teams
- Significant architectural impact
- Major technical decisions need to be documented

### Required Files (Level 2 + decision-record)

- `spec.md` (from Level 2) - Requirements and user stories
- `plan.md` (from Level 2) - Technical implementation plan
- `tasks.md` (from Level 2) - Task breakdown by user story
- `checklist.md` (from Level 2) - Validation/QA checklists
- `decision-record.md` (NEW at Level 3) - Architecture Decision Records/ADRs
- `implementation-summary.md` (from Level 2) - Post-implementation outcomes and verification evidence

### Optional Files

- `resource-map.md` - lean path catalog (cross-cutting, see §9)
- `research/research.md` - Comprehensive research documentation

### Content Expectations

**All Level 2 content expectations PLUS:**

**decision-record.md required sections:**
- Context and problem
- Options considered (2-4 typically)
- Decision made
- Rationale
- Consequences and trade-offs

**Enforcement:** Hard block if `decision-record.md` missing

### Example Scenarios

**Good fits for Level 3:**
- Major feature implementation (user dashboard with analytics)
- System redesign (payment flow v2)
- Architecture changes (microservices migration)
- Multi-team projects (integration with external systems)
- New product vertical (marketplace feature)
- Performance overhaul (real-time collaboration)
- Database or framework choices
- Major refactoring approaches

### Template Sources

**Manifest templates (scaffolded by `create.sh`):**
- `templates/manifest/spec.md.tmpl`
- `templates/manifest/plan.md.tmpl`
- `templates/manifest/tasks.md.tmpl`
- `templates/manifest/checklist.md.tmpl`
- `templates/manifest/decision-record.md.tmpl`
- `templates/manifest/implementation-summary.md.tmpl`

**Addendum source (+Arch):**
- `Level template contract`
- `Level template contract`
- `Level template contract`

**Optional:**
- `level_contract_optional_research.md` (copy into `research/research.md` from root templates/)

### Template Adaptation

**All Level 2 adaptations PLUS:**

**decision-record.md:**
1. Document context and problem clearly
2. Present 2-4 viable options (not every possible choice)
3. Fair comparison (pros/cons for each)
4. State clear decision with rationale
5. Document trade-offs honestly
6. Note what was sacrificed for chosen path
7. Use the canonical required filename `decision-record.md` (topic-specific ADR files are supplemental)
8. Remove all sample content

---

## 5. LEVEL 3+: EXTENDED DOCUMENTATION (COMPLEXITY SCORE: 80-100)

### When to Use

Level 3+ is auto-detected via complexity scoring for highly complex tasks:
- Multi-agent coordination required
- Complex architectural changes with high stakes
- Large-scale migrations or rewrites
- Tasks requiring explicit AI execution protocols
- High coordination needs across multiple systems

### Required Files (Level 3 + Extended Features)

- `spec.md` (from Level 3) - With Complexity Assessment section
- `plan.md` (from Level 3) - With AI Execution Framework, dependency graphs
- `tasks.md` (from Level 3) - With 3-Tier Task Format, AI Execution Protocol
- `checklist.md` (from Level 3) - Extended (100-150 items) with sign-off section
- `decision-record.md` (from Level 3) - Architecture Decision Records
- `implementation-summary.md` (from Level 3) - Required completion artifact for all levels

### Optional Files

- `resource-map.md` - lean path catalog (cross-cutting, see §9)

### Extended Features (Auto-Enabled)

| Feature | Description | Template Section |
|---------|-------------|------------------|
| AI Execution Protocol | Pre-task checklist, execution rules, status format | tasks.md, plan.md |
| Dependency Graph | Full DAG visualization of task dependencies | plan.md |
| Effort Estimation | Story points/hours per phase with totals | plan.md |
| Extended Checklist | 100-150 items with P0/P1/P2 prioritization | checklist.md |
| Sign-Off Section | Technical Lead, Product Owner, QA Lead sign-offs | checklist.md |
| Workstream Organization | Parallel workstream tracking and coordination | tasks.md |

### AI Execution Protocol Components

**Pre-Task Checklist (9 steps):**
1. Load spec.md and verify scope hasn't changed
2. Load plan.md and identify current phase
3. Load tasks.md and find next uncompleted task
4. Verify task dependencies are satisfied
5. Load checklist.md and identify relevant P0/P1 items
6. Check for blocking issues in decision-record.md
7. Verify memory/ folder for context from previous sessions
8. Confirm understanding of success criteria
9. Begin implementation only after all checks pass

**Execution Rules Table:**
| Rule | Description |
|------|-------------|
| TASK-SEQ | Complete tasks in dependency order |
| TASK-SCOPE | Stay within task boundary, no scope creep |
| TASK-VERIFY | Verify each task against acceptance criteria |
| TASK-DOC | Update status immediately on completion |

**Status Reporting Format:**
```
## Status Update - [TIMESTAMP]
- **Task**: T### - [Description]
- **Status**: [IN_PROGRESS | COMPLETED | BLOCKED]
- **Evidence**: [Link to code/test/artifact]
- **Blockers**: [None | Description]
- **Next**: T### - [Next task]
```

### Content Expectations

**All Level 3 content expectations PLUS:**

**spec.md additions:**
- Complexity Assessment table with 5-dimension scores
- Executive Summary (2-3 paragraphs for stakeholders)

**plan.md additions:**
- AI Execution Framework section
- Full dependency graph (ASCII or DAG)
- Effort estimation per phase
- Phase execution flowcharts (complex phases)

**tasks.md additions:**
- 3-Tier Task Format with full metadata
- AI Execution Protocol section
- Workstream organization (if parallel work)
- Status reporting format

**checklist.md additions:**
- Extended Verification section (Level 3+)
- Sign-Off section with Technical Lead, Product Owner, QA Lead
- Verification Summary table

### Example Scenarios

**Good fits for Level 3+:**
- Multi-agent implementation with 10+ parallel workstreams
- Platform migration affecting 50+ files
- Security audit remediation with compliance requirements
- Real-time collaboration feature with complex state management
- Database migration with zero-downtime requirements
- API versioning with backward compatibility constraints

### Template Sources

**Manifest templates (scaffolded by `create.sh`):**
- `templates/manifest/spec.md.tmpl`
- `templates/manifest/plan.md.tmpl`
- `templates/manifest/tasks.md.tmpl`
- `templates/manifest/checklist.md.tmpl`
- `templates/manifest/decision-record.md.tmpl`
- `level_contract_implementation-summary.md`

**Addendum source (+Govern):**
- `Level template contract`
- `Level template contract`
- `Level template contract`

**Optional:**
- `level_contract_optional_research.md` (copy into `research/research.md` from root templates/)

### Creating Level 3+ Spec Folder

```bash
# Specify level directly (recommended)
./scripts/spec/create.sh "Complex migration" --level 3+
```

### Template Adaptation

**All Level 3 adaptations PLUS:**

1. Fill Complexity Assessment table with actual scores
2. Write Executive Summary for stakeholder communication
3. Create AI Execution Protocol with project-specific rules
4. Build dependency graph showing all task relationships
5. Add effort estimates per phase
6. Expand checklist to 100+ items covering all validation areas
7. Add approval tracking section with reviewers
8. Organize workstreams if parallel work streams exist
9. Remove all sample content and placeholders

### Coordination-Root Profile

When the spec folder serves as a coordination root for a multi-phase effort, Level 3+ additionally requires:
- Point-in-time directory snapshot (total dirs, top-level, numbered)
- Direct-phase documentation map with current status values
- ADR record establishing source-of-truth precedence (e.g., current tree truth over historical synthesis)

---

## 6. LEVEL MIGRATION

### Script-Assisted Upgrade (Recommended)

Use `upgrade-level.sh` to upgrade existing spec folders to a higher documentation level:

```bash
# Upgrade to Level 2 (auto-detects current level)
bash upgrade-level.sh specs/042-feature/ --to 2

# Upgrade to Level 3 (chains through intermediate levels automatically)
bash upgrade-level.sh specs/042-feature/ --to 3

# Upgrade to Level 3+ (approval workflow + compliance)
bash upgrade-level.sh specs/042-feature/ --to 3+

# Preview changes without modifying files
bash upgrade-level.sh specs/042-feature/ --to 3 --dry-run
```

**Supported upgrade paths:**

| From   | To   | Files Added                                            |
| ------ | ---- | ------------------------------------------------------ |
| L1 → L2 | +Verify | `checklist.md` + addendum sections in existing files |
| L2 → L3 | +Arch   | `decision-record.md` + addendum sections             |
| L3 → L3+ | +Govern | Extended governance sections + AI protocols          |
| L1 → L3 | Skip-level | Chains through L2 automatically                 |

**Post-Upgrade: AI Auto-Populate (Mandatory)**

After `upgrade-level.sh` runs, newly injected template sections contain `<placeholder_token>` text. The AI agent **must** auto-populate these placeholders by:

1. Reading existing spec context (spec.md, plan.md, tasks.md, etc.)
2. Deriving appropriate content for each placeholder from that context
3. Replacing all `<placeholder_token>` markers with populated content
4. Running `check-placeholders.sh` to verify none remain

```bash
.opencode/skill/system-spec-kit/scripts/spec/check-placeholders.sh specs/042-feature/
```

> **Note:** The script handles structural changes (file creation, addendum injection, backups). The AI handles semantic content — filling placeholders with project-specific information derived from existing documentation.

### Manual Upgrade (Fallback)

If the script is unavailable, manually add the required files:

| From   | To                         | Action                                                 | Files to Add |
| ------ | -------------------------- | ------------------------------------------------------ | ------------ |
| 1 → 2  | Add verification           | Copy `checklist.md` from `Level 2 template contract`          |              |
| 2 → 3  | Add decision documentation | Copy `decision-record.md` from `Level 3 template contract`    |              |
| 3 → 3+ | Add governance             | Copy extended sections from `Level 3+ template contract`      |              |

**Changelog example:**

```markdown
## Change Log
- 2025-11-15: Created as Level 1 (simple feature) - spec.md, plan.md, tasks.md
- 2025-11-16: Escalated to Level 2 (discovered validation needs) - added checklist.md
- 2025-11-17: Escalated to Level 3 (architectural decision required) - added decision-record.md
```

**Rules:**
- Keep existing documentation (progressive enhancement - don't delete lower-level files)
- Update `level:` field in metadata
- Document reason for escalation
- Inform user of level change and implications

### When to Stay at Current Level

**Don't escalate unnecessarily:**
- Minor scope increase (50 → 95 LOC still Level 1)
- Complexity didn't actually increase (just took longer than expected)
- One additional file doesn't change coordination needs

**Stability preferred:**
- Once started, try to stay at chosen level
- Only escalate if genuinely needed
- Inform user before escalating

---

## 7. STATUS FIELD CONVENTION

Every spec.md should include a status field to track lifecycle:

```yaml
---
title: Feature Name
created: 2025-11-15
status: active  # ← Add this field
level: 2
---
```

### Valid Status Values

| Status     | Meaning                 | When to Use                        | Reuse Priority              |
| ---------- | ----------------------- | ---------------------------------- | --------------------------- |
| `draft`    | Planning phase          | Initial spec creation, not started | 2 (can start)               |
| `active`   | Work in progress        | Currently implementing             | 1 (highest - continue here) |
| `paused`   | Temporarily on hold     | Blocked or deprioritized           | 3 (can resume)              |
| `complete` | Implementation finished | Feature deployed and stable        | 4 (avoid reopening)         |
| `archived` | Historical record       | Deprecated or superseded           | 5 (do not reuse)            |

### Status Lifecycle

```
draft → active → complete → archived
   ↓       ↓
paused  paused
   ↓
active (resume)
```

**Update status as work progresses:**
- Create spec → `draft`
- Start implementation → `active`
- Blocked/paused → `paused`
- Deployment complete → `complete`
- Feature deprecated → `archived`

---

## 8. RELATED SPECS: UPDATE VS CREATE

### When to UPDATE Existing Spec

Update an existing spec folder when:

✅ **Iterative development** - Continuing work on same feature across sessions
- Example: Initial implementation → bug fixes → enhancements

✅ **Bug fixes** - Fixing issues in existing implementation
- Example: "Fix alignment bug in markdown-c7-optimizer" → Update markdown-c7-optimizer spec

✅ **Scope escalation** - Work grows beyond original estimate
- Example: Level 1 bug fix → Requires Level 2 refactor → Add plan.md to same folder

✅ **Feature enhancement** - Adding to existing functionality
- Example: "Add dark mode to modal" → Update modal-component spec

✅ **Resuming paused work** - Continuing previously paused implementation
- Example: Spec status: paused → active (add continuation notes)

### When to CREATE New Spec

Create a new spec folder when:

❌ **Distinct feature** - Completely separate functionality
- Example: "markdown-c7-optimizer" ≠ "markdown-validator" (different purposes)

❌ **Different approach** - Alternative implementation strategy
- Example: "hero-animation-css" vs "hero-animation-js" (different approaches)

❌ **Separate user story** - Different requirement or use case
- Example: "user-authentication" ≠ "user-profile" (separate stories)

❌ **Complete redesign** - Starting over with new architecture
- Example: "payment-flow-v2" (complete rewrite of v1)

❌ **Unrelated work** - No connection to existing specs
- Example: "add-search-feature" ≠ "fix-form-validation" (different areas)

### Decision Flowchart

```
User requests modification
    ↓
Extract keywords from request
    ↓
Search existing specs (folder names, titles)
    ↓
    ├─→ No matches found
    │      ↓
    │   Create new spec folder
    │
    └─→ Related specs found
           ↓
        Check status field
           ↓
           ├─→ status: active or draft
           │      ↓
           │   Recommend: UPDATE existing spec
           │   Reason: Work in progress, maintain continuity
           │
           ├─→ status: paused
           │      ↓
           │   ASK user: Resume paused work or create new?
           │   Reason: Context exists, but was stopped intentionally
           │
           └─→ status: complete or archived
                  ↓
               ASK user: Reopen completed work or create new?
               Reason: Feature was finished, ensure not regression
```

---

## 9. CROSS-CUTTING TEMPLATES (ANY LEVEL)

Some templates are not level-specific but can be used at any documentation level. These support session management, context preservation, and work summaries.

### Session Management Templates

| Template | Purpose | When to Use | Created By |
|----------|---------|-------------|------------|
| `handover.md` | Session context transfer | End of work session requiring handoff | Main-agent narrative with `/memory:save` handover_state routing |
| `debug-delegation.md` | Debug task delegation | When stuck debugging (3+ failed attempts) | Task tool -> `@debug` |

**Template Sources:**
- `level_contract_optional_handover.md`
- `level_contract_optional_debug-delegation.md`

### Summary Templates (REQUIRED for ALL Levels)

| Template | Purpose | When to Use | Created By |
|----------|---------|-------------|------------|
| `implementation-summary.md` | Post-implementation documentation | End of implementation phase (REQUIRED all levels) | Manual or context save |
| `resource-map.md` | Lean path catalog | Any level, when reviewers need a scannable file ledger | Manual (optional) |

**Template Sources:**
- Level 1: `level_contract_implementation-summary.md`
- Level 2: `level_contract_implementation-summary.md`
- Level 3: `level_contract_implementation-summary.md`
- Level 3+: `level_contract_implementation-summary.md`
- `level_contract_optional_resource-map.md`

**Why Required for ALL Levels:**
- `implementation-summary.md` documents outcomes, lessons learned, and deviations from plan
- Ensures proper documentation trail for future sessions, handoffs, and audits
- Even simple Level 1 tasks benefit from documenting what was actually done
- Each level's template is progressively more detailed to match the complexity expectations

### Canonical Continuity (Not Templates)

| Surface | Purpose | Creation Method |
|---------|---------|-----------------|
| `_memory.continuity` in `implementation-summary.md` | Thin packet continuity state for resume and handoff recovery | `generate-context.js` runtime script via `/memory:save` |
| `scratch/` | Temporary workspace (disposable) | Manual creation (no template needed) |

**Important:**
- Canonical continuity is script-managed and should NOT be authored manually
- Use `/memory:save` or `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"...","sessionSummary":"..."}' specs/###-folder/`
- Recovery should follow `handover.md -> _memory.continuity -> spec docs`
- Scratch folder contents are temporary and should be cleaned up after work completes

---

## 10. PHASE-AWARE SPECIFICATIONS

### Phases as a Behavioral Overlay

Phases are a **behavioral overlay** on the existing level system, not a new level tier. Any documentation level can technically use phases, though Level 3 and Level 3+ specifications are the most common candidates due to their inherent complexity.

### How Phases Interact with Levels

| Level | Phase Usage | Typical Scenario |
|-------|-------------|-----------------|
| Level 1 | Rare | Simple tasks rarely need decomposition |
| Level 2 | Uncommon | Moderate complexity usually fits one folder |
| Level 3 | Common | Complex features benefit from parallel work streams |
| Level 3+ | Very common | Enterprise-scale work often requires phase decomposition |

### Phase Detection Thresholds

Phase decomposition is suggested when BOTH conditions are met:
- Complexity score >= 25 (from 5-dimension scoring)
- Documentation level >= 3

### What Phases Add to a Level

Phases do not change the documentation requirements for a given level. Each phase child folder independently follows the level requirements:
- A Level 3 parent with phases produces Level 3 child folders (each with spec.md, plan.md, tasks.md, checklist.md, decision-record.md)
- The parent folder adds a **Phase Documentation Map** section to its spec.md
- Child folders add a **parent back-reference** to their spec.md metadata

### Full Documentation

See [phase_definitions.md](../structure/phase_definitions.md) for complete phase system documentation including scoring dimensions, folder structure, lifecycle, and validation rules.

---

## 11. RELATED RESOURCES

### Reference Files
- [quick_reference.md](../workflows/quick_reference.md) - Commands, checklists, and troubleshooting
- [template_guide.md](./template_guide.md) - Template selection, adaptation, and quality standards
- [level_selection_guide.md](./level_selection_guide.md) - 5-dimension complexity scoring and auto-detection
- [path_scoped_rules.md](../validation/path_scoped_rules.md) - Path-scoped validation rules reference

### Templates (Manifest-Backed Level Contracts)

**Manifest Templates:**
- [spec.md.tmpl](../../templates/manifest/spec.md.tmpl) - Essential what/why/how
- [plan.md.tmpl](../../templates/manifest/plan.md.tmpl) - Technical approach
- [tasks.md.tmpl](../../templates/manifest/tasks.md.tmpl) - Task breakdown
- [implementation-summary.md.tmpl](../../templates/manifest/implementation-summary.md.tmpl) - Outcomes

**Composed Level 1 (Core only ~455 LOC):**
- [spec template](../../templates/manifest/spec.md.tmpl) - Requirements and scope
- [plan.md.tmpl](../../templates/manifest/plan.md.tmpl) - Technical plan
- [tasks.md.tmpl](../../templates/manifest/tasks.md.tmpl) - Task breakdown
- [implementation-summary.md.tmpl](../../templates/manifest/implementation-summary.md.tmpl) - Outcomes

**Level 2 (verification):**
- All Level 1 templates + quality gates, NFRs
- [checklist.md.tmpl](../../templates/manifest/checklist.md.tmpl) - Verification checklist

**Level 3 (architecture):**
- All Level 2 templates + architecture decisions
- [decision-record.md.tmpl](../../templates/manifest/decision-record.md.tmpl) - ADRs
- [research.md.tmpl](../../templates/manifest/research.md.tmpl) - Optional research template copied into `research/research.md`

**Level 3+ (governance):**
- All Level 3 templates + approval workflow, compliance, stakeholders
- Extended checklist with approval tracking

**Session Management Templates (Any Level):**
- [handover.md.tmpl](../../templates/manifest/handover.md.tmpl) - Session context transfer
- [debug-delegation.md.tmpl](../../templates/manifest/debug-delegation.md.tmpl) - Debug task delegation
- [resource-map.md.tmpl](../../templates/manifest/resource-map.md.tmpl) - Optional lean path catalog

**Non-Template Helpers:**
- canonical continuity inside packet docs, primarily `_memory.continuity` in `implementation-summary.md`
- `scratch/` - Temporary workspace (create ad-hoc files as needed)

### Related Skills
- `sk-code` - Implementation, debugging, and verification lifecycle
- `system-spec-kit` - Context preservation with semantic memory
- `sk-git` - Git workspace setup and clean commits

---
