# Iteration 001 - D1 Correctness

## Findings

- ID: CHK-001
  severity: P2
  title: Constitutional memory row still lists `list`, `edit`, `remove`, and `budget` in all three AGENTS targets
  file:line: `AGENTS.md:66`; `AGENTS_example_fs_enterprises.md:92`; `../Barter/coder/AGENTS.md:98`
  evidence: Each file still contains the row `| **Constitutional memory** | \`/memory:learn\` → Constitutional memory manager: create, list, edit, remove, budget |`.
  status: PASS

- ID: CHK-002
  severity: P2
  title: Database maintenance row still includes `ingest` in all three AGENTS targets
  file:line: `AGENTS.md:62`; `AGENTS_example_fs_enterprises.md:88`; `../Barter/coder/AGENTS.md:94`
  evidence: Each file still contains the row `| **Database maintenance** | \`/memory:manage\` → stats, health, cleanup, checkpoint, ingest operations |`.
  status: PASS

- ID: CHK-003
  severity: P2
  title: `/memory:analyze` row remains present in all three AGENTS targets
  file:line: `AGENTS.md:65`; `AGENTS_example_fs_enterprises.md:91`; `../Barter/coder/AGENTS.md:97`
  evidence: Each file still contains the row `| **Analysis/evaluation** | \`/memory:analyze\` → preflight, postflight, causal graph, ablation, dashboard, history |`.
  status: PASS

- ID: CHK-004
  severity: P2
  title: `/memory:shared` row remains present in all three AGENTS targets
  file:line: `AGENTS.md:67`; `AGENTS_example_fs_enterprises.md:93`; `../Barter/coder/AGENTS.md:99`
  evidence: Each file still contains the row `| **Shared memory** | \`/memory:shared\` → Shared-memory lifecycle: create spaces, manage memberships, inspect rollout |`.
  status: PASS

- ID: CHK-005
  severity: P2
  title: Barter read-only git policy remains explicit
  file:line: `../Barter/coder/AGENTS.md:87`; `../Barter/coder/AGENTS.md:323`
  evidence: The Barter file still states `| **Git analysis** | sk-git skill → Read-only operations only → Enforces Git Operations Policy |` and also keeps `- **\`@review\`** — Code review, PRs, quality gates (READ-ONLY)`.
  status: PASS

- ID: CHK-012
  severity: P2
  title: Resume prior work row still includes `/memory:continue` and `memory_search()`
  file:line: `AGENTS.md:51`; `AGENTS_example_fs_enterprises.md:73`; `../Barter/coder/AGENTS.md:79`
  evidence: Each file still contains the row `| **Resume prior work** | \`/memory:continue\` OR \`memory_search({ query, specFolder, anchors: ['state', 'next-steps'] })\` → Review checklist → Continue |`.
  status: PASS

- ID: CHK-013
  severity: P2
  title: Save context row still includes `/memory:save`
  file:line: `AGENTS.md:52`; `AGENTS_example_fs_enterprises.md:74`; `../Barter/coder/AGENTS.md:80`
  evidence: Each file still contains the row `| **Save context** | \`/memory:save\` OR compose JSON → \`generate-context.js --json '<data>' [spec-folder]\` → Auto-indexed |`.
  status: PASS

- ID: CHK-014
  severity: P2
  title: File modification row still shows `Gate 3 → Gate 1 → Gate 2`
  file:line: `AGENTS.md:48`; `AGENTS_example_fs_enterprises.md:70`; `../Barter/coder/AGENTS.md:76`; `CLAUDE.md:48`
  evidence: All checked files still contain the row `| **File modification** | Gate 3 (ask spec folder) → Gate 1 → Gate 2 → Load memory context → Execute |`.
  status: PASS

