## Packet 048: remaining-p1-p2-remediation — Tier C bulk remediation

You are cli-codex (gpt-5.5 high fast) implementing **035-remaining-p1-p2-remediation**.

### CRITICAL: Spec folder path

The packet folder is: `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/035-remaining-p1-p2-remediation/` — write ALL packet files there. Do NOT ask for the spec folder.

### Goal

Work through the 24 remaining P1 findings + 15 P2 findings from 046's synthesis (those NOT already fixed in 046's Tier β). Apply conservative, scope-disciplined fixes. Where a design call is needed, apply the conservative default (described below) and document rationale.

### Read these first

- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/033-release-readiness-synthesis-and-remediation/synthesis.md` (full P1 + P2 registries)
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/033-release-readiness-synthesis-and-remediation/remediation-log.md` (what 046 already fixed; do NOT re-do)
- `.opencode/skill/sk-doc/references/global/evergreen_packet_id_rule.md` (honor)
- All 10 review-reports under `032-release-readiness-deep-review-program/00X-*/review-report.md` for full context

### Already fixed in 046 (do NOT re-do)

P1: 045/003-P1-1, 045/004-P1-1, 045/004-P1-2, 045/006-P1-1
P2: 045/004-P2-1

### P1 backlog (24 items) — work plan

#### Tier β.5 — small doc fixes (apply directly)
- **045/005-P1-2**: update OpenCode plugin output shape doc in `references/hooks/skill-advisor-hook.md:66`
- **045/005-P1-3**: align Codex README snippet `hooks/codex/README.md:63` with template + hooks.json caveat
- **045/009-P1-2**: tool counts in `memory_system.md:101`, `SKILL.md:571` → 50 local + 4 advisor (54 spec_kit_memory)
- **045/009-P1-5**: add `advisor_rebuild` to `skill_advisor/README.md:38` + install guide
- **045/010-P1-1**: align Node floor to `>=20.11.0` in `package.json` engines, INSTALL_GUIDE, doctor YAML

#### Tier β.6 — doc completeness (apply directly)
- **045/009-P1-1**: replace packet-history refs in `ENV_REFERENCE.md:128`, `ARCHITECTURE.md:404` with current-runtime anchors (file:line citations)
- **045/009-P1-3**: add Skill Graph tools (4 tools at `tool-schemas.ts:680`) to feature catalog as new entries
- **045/009-P1-4**: add manual playbook scenarios for Skill Graph + coverage-graph reads
- **045/009-P1-6**: repair broken local markdown links in `README.md:1318` and generated indexes
- **045/008-P1-1**: enrich `validate.sh:299, :574` JSON output with details/remediation fields

#### Tier γ — design calls (apply CONSERVATIVE DEFAULT + document rationale)
- **045/001-P1-1**: move waits/pauses out of auto modes in `spec_kit_plan_auto.yaml:616`, `spec_kit_complete_auto.yaml:1080` — DEFAULT: remove waits from auto, keep them only in confirm variants
- **045/001-P1-2**: memory commands lack YAML contracts — DEFAULT: KEEP markdown-only (do NOT add YAML); document the markdown-only contract explicitly so it's not "missing"
- **045/001-P1-3**: `/memory:save` default contract self-contradicts (`memory/save.md:130` vs `:341`) — DEFAULT: pick **plan-only-by-default** (safer, matches Gate 3 hard-block intent); align both lines
- **045/002-P1-3**: retention embedding-cache policy undefined (`embedding-cache.ts:45`, `vector-index-mutations.ts:590`) — DEFAULT: **delete on retention sweep** (matches deletion semantics; documented in code comment)
- **045/006-P1-2**: `memory_save` hidden planner inputs in `save/types.ts:286` — DEFAULT: keep internal-only (do NOT expose; document in JSDoc)
- **045/006-P1-3**: governed-ingest policy uneven across `scope-governance.ts:225`, `memory-ingest.ts:36` — DEFAULT: extend governance to all ingest paths (require provenanceActor everywhere it isn't already required); document in scope-governance JSDoc
- **045/006-P1-4**: raw args influence pre-dispatch behavior in `context-server.ts:943, :1010` — DEFAULT: add Zod schema validation BEFORE pre-dispatch logic; reject malformed args earlier
- **045/010-P1-3**: legacy packet `005-memory-indexer-invariants` strict validation fails — DEFAULT: grandfather (add explicit `legacy_grandfathered: true` flag in graph-metadata.json, validator skips strict checks for grandfathered packets); document grandfather policy in validator README

#### Tier δ — engineering work (apply where surgical)
- **045/002-P1-1**: `memory_health` overstate consistency at `memory-crud-health.ts:379`, `vector-index-queries.ts:1285` — add structured `consistency: { rowsTotal, ftsRowsTotal, vecRowsTotal, mismatchedIds }` field
- **045/002-P1-2**: retention/save race test isn't true multi-writer in `memory-retention-sweep.vitest.ts:180` — extend test with file-backed multi-connection fixture
- **045/007-P1-1**: deep-review failure taxonomy drift in `post-dispatch-validate.ts:27` + review YAML — port the audited executor wrapper reason lists from research YAML to review YAML
- **045/007-P1-2**: review JSONL schema incomplete in `prompt_pack_iteration.md.tmpl:70` + validator — align prompt pack with full schema validation
- **045/010-P1-2**: doctor misreads VS Code `servers` key in `.vscode/mcp.json:3` + doctor scripts — add support for both `servers` (modern) and `mcpServers` (legacy) shapes; doctor reads either

#### Operator-only (defer; document)
- **045/005-P1-1**: no normal-shell live runtime verdicts — operator runs `npm run hook-tests` from non-sandboxed shell. Document the operator action; do NOT attempt in this packet.

### P2 backlog (15 items)

Read 046/synthesis.md Section 4 for the full list. Apply each P2 fix that is:
- Doc-only with clear edit path
- < 10 lines of code change
- No design call required

For P2 items requiring design calls or > 10-line changes, document in `deferred-p2.md` for follow-up.

### Implementation phases

#### Phase 1: Read all 10 review-reports + 046 synthesis
Familiarize with each finding's exact file:line and recommended remediation. Don't fabricate; cite the source review-report for each finding ID.

#### Phase 2: Apply Tier β.5 + β.6 (low-risk doc fixes)
Surgical edits per finding. Re-validate strict on touched packets.

#### Phase 3: Apply Tier γ (design calls with conservative defaults)
For each design call, apply the DEFAULT specified above. Document in `decision-record.md` at packet root with: ID, default chosen, rationale, alternative considered.

#### Phase 4: Apply Tier δ (engineering work)
Per item, edit code surgically. Add tests where indicated. Run affected vitest files.

#### Phase 5: Apply P2 (auto-apply safe ones; defer the rest)
Walk P2 list; apply safe ones; document deferred ones.

#### Phase 6: Verification
- `cd .opencode/skill/system-spec-kit/mcp_server && npm run build` — must pass
- `npx vitest run <affected test files>` — must pass
- Strict validators on touched spec packets — must exit 0

### Packet structure to create (Level 2)

7-file structure under this packet folder.

PLUS: `decision-record.md` (Tier γ defaults), `remediation-log.md` (per-finding fix log), `deferred-p2.md` (P2 items not auto-applied).

**Deps**: `manual.depends_on=["system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/033-release-readiness-synthesis-and-remediation"]`.

**Trigger phrases**: `["035-remaining-p1-p2-remediation","P1 P2 backlog","release polish","conservative defaults pass"]`.

**Causal summary**: `"Works through the 24 P1 + 15 P2 findings remaining after 046. Tier β.5 + β.6 doc fixes applied directly; Tier γ design calls apply documented conservative defaults; Tier δ engineering work applied surgically. Operator action 005-P1-1 deferred to non-sandboxed shell run. P2 cleanups applied where safe."`.

**Frontmatter**: compact `recent_action` / `next_safe_action` rules. < 80 chars.

### Constraints

- Strict validator MUST exit 0 on this packet.
- Build MUST pass; affected tests MUST pass.
- Do NOT re-fix items already in 046's remediation-log.md.
- Do NOT commit; orchestrator commits.
- Honor evergreen-doc rule (no packet IDs in evergreen content).
- Tier γ defaults are documented choices — be explicit in decision-record.md.
- If a fix expands scope beyond the documented finding, STOP and document as deferred.
- Be honest about which items succeeded, which were skipped (and why), and which got partial coverage.

When done, last action: strict validator + build + tests passing + remediation-log.md showing per-finding outcome. No narration; just write files and exit.
