## Packet 041: resource-maps-and-memory-finalization — Tier B finalization

You are cli-codex (gpt-5.5 high fast) implementing **041-resource-maps-and-memory-finalization**.

### Goal

Finalize all session spec folders by:
1. Generating `resource-map.md` for each packet (per the sk-doc resource-map template)
2. Indexing each packet via `generate-context.js` so memory search picks them up

### Read these first

- `.opencode/skill/system-spec-kit/templates/resource-map.md` (the canonical template)
- `.opencode/skill/sk-doc/references/global/evergreen_packet_id_rule.md` (resource-maps are evergreen-class — packet ID in self-reference is OK; cross-refs to OTHER packets should use feature-name + path)
- A reference resource-map example: `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/resource-map.md`

### Target packets (17 total)

Session-touched spec folders that need resource-map.md:

```
specs/system-spec-kit/026-graph-and-context-optimization/
├── 013-automation-reality-supplemental-research/
├── 031-doc-truth-pass/
├── 032-code-graph-watcher-retraction/
├── 033-memory-retention-sweep/
├── 034-half-auto-upgrades/
├── 035-full-matrix-execution-validation/
├── 036-cli-matrix-adapter-runners/
├── 037-followup-quality-pass/                          ← phase parent
│   ├── 001-sk-code-opencode-audit/
│   ├── 002-feature-catalog-trio/
│   ├── 003-testing-playbook-trio/
│   ├── 004-sk-doc-template-alignment/
│   ├── 005-stress-test-folder-migration/
│   └── 006-readme-cascade-refresh/
├── 038-stress-test-folder-completion/
├── 039-code-graph-catalog-and-playbook/
└── 040-evergreen-doc-packet-id-removal/
```

For the **037 phase parent**: emit ONE parent-aggregate map listing children's touched paths (per template's "phase-heavy packets" guidance — pick parent-aggregate mode and state it in the Scope line). The 6 children get their own per-child maps too.

So total: 17 resource-map.md files (10 leaf packets + 6 037 children + 1 037 parent).

### Phase 1: Per-packet path discovery

For each packet, derive the touched paths from git history filtered to that packet's commits:

```bash
# Find commits matching packet ID
PACKET=033-memory-retention-sweep
COMMIT=$(git --no-pager log --oneline --grep="$PACKET" | tail -1 | awk '{print $1}')
# Use commit SHA reference to extract files
git --no-pager show --name-only --format='' "$COMMIT" | sort -u
```

Or, more accurate for multi-commit packets, use commit messages or grep for `feat\(026/<packet-id-prefix>` — adjust per packet structure.

For 037 children: each child has its own commit (or shares a batched commit like 002+003+004). Trace per-child via the commit body if shared.

Classify each touched path into one of the 10 categories per the template:
1. READMEs
2. Documents
3. Commands
4. Agents
5. Skills
6. Specs
7. Scripts
8. Tests
9. Config
10. Meta

Honor the precedence rules from the template:
- Specs > Config (for spec-folder JSON)
- Meta > READMEs (for root-level README.md)
- Skills > Documents (for `.opencode/skill/**` markdown)
- Tests > Scripts (for `*.vitest.ts` / `*.test.*` / `*.spec.*`)

### Phase 2: Author resource-map.md per packet

For each of the 17 target paths, create resource-map.md following the template.

Template anchors to include:
- Summary (counts + scope + generated timestamp)
- Categories with at least one entry (omit empty categories per template guidance — DO NOT renumber)
- Author Instructions section is part of the template; include it

Action vocabulary (per template): Created, Updated, Analyzed, Removed, Cited, Validated, Moved, Renamed.
Status vocabulary: OK / MISSING / PLANNED.

For the **037 phase parent map**:
- Scope line: "Parent-aggregate map across the 6 children of 037-followup-quality-pass"
- Aggregate paths from all 6 children
- Don't duplicate the per-child entries verbatim — summarize at the parent level

### Phase 3: Memory indexing

After all resource-maps are written, run `generate-context.js` per packet so the memory index picks up the new resource-map.md entries plus the latest spec-doc state.

Compose minimal save-context JSON per packet (one-liner narrative is fine):

```bash
for PACKET_PATH in <list of 17>; do
  cat > /tmp/save-$BASENAME.json <<EOF
  {
    "specFolder": "$PACKET_PATH",
    "sessionSummary": "Resource map authored; packet finalized.",
    "recentAction": "Resource map authored",
    "nextSafeAction": "Use packet for downstream work",
    "status": "complete",
    "completionPct": 100
  }
EOF
  node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-$BASENAME.json $PACKET_PATH
done
```

The `generate-context.js` invocation also refreshes `description.json` + `graph-metadata.json` per packet — this is the canonical save-and-index path.

### Phase 4: Verification

For each packet:
- Confirm resource-map.md exists and is non-empty
- Confirm `generate-context.js` exited 0 (memory index updated)
- Confirm `description.json` and `graph-metadata.json` were refreshed (timestamps updated)
- Run strict validator on each packet (must still PASS)

### Packet structure to create (Level 2)

7-file structure under `specs/system-spec-kit/026-graph-and-context-optimization/041-resource-maps-and-memory-finalization/`.

PLUS: `finalization-log.md` at packet root showing per-packet status (resource-map size + indexing exit code + validator result).

**Deps**: depends on all 17 target packets (013, 031-036, 037 + 6 children, 038, 039, 040). For brevity in graph-metadata, list only the most recent 3-4.

**Trigger phrases**: `["041-resource-maps-and-memory-finalization","resource maps cycle","memory finalization","session packet indexing"]`.

**Causal summary**: `"Generates resource-map.md for 17 session-touched spec folders + indexes each via generate-context.js. Refreshes description.json + graph-metadata.json across all packets. Closes the session's memory finalization."`.

**Frontmatter**: compact `recent_action` / `next_safe_action` rules. < 80 chars. NEVER reference packet IDs in description/keywords other than self-reference (per evergreen-doc rule from 040; resource-maps describe their own packet's scope, so 'self' references are fine).

### Constraints

- DOC-ONLY for the resource-maps. The `generate-context.js` indexing IS allowed to mutate description.json/graph-metadata.json across all 17 packets (canonical save behavior).
- Strict validator MUST exit 0 on this packet.
- Each generated resource-map MUST pass any sk-doc resource-map validator if one exists.
- DO NOT commit; orchestrator will commit.
- Be honest about path counts; don't pad with paths that weren't actually touched.
- For packets that touched FEW paths (e.g., 032 was almost pure doc retract on README.md): a small but accurate map is correct.

When done, last action is strict validator passing + finalization-log.md showing 17/17 indexed. No narration; just write files and exit.
