---
iteration: 42
dimension: maintainability
sessionId: rvw-2026-04-12T16-00-00Z
engine: copilot-gpt-5.4-high
phase: round-3-workflow-validation
startedAt: 2026-04-12T17:38:04Z
completedAt: 2026-04-12T17:55:32Z
---

# Deep Review Iteration 042 — maintainability (Round 3)

**Focus:** CROSS-CUTTING: Verify all 3 skill READMEs and SKILL.md frontmatter versions match their changelogs. Check sk-deep-review v1.3.2.0, sk-deep-research v1.6.2.0, sk-improve-agent v1.2.2.0, system-spec-kit v3.3.1.0, cli-copilot v1.3.4.0.

---

● skill(sk-deep-review)

● List directory .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvemen…
  └ 20 files found

● Read README.md
  │ .claude/skills/sk-deep-review/README.md
  └ L1:220 (220 lines read)

● Search (grep)
  │ "^(version:|## Changelog|# Changelog|### v|## v|version )" in
  │ {.claude/skills,.opencode/skill}/**/{README.md,SKILL.md,skill.md,CHANGELOG.md}
  └ 22 lines found

I’m mapping the review surface now: first the 042 packet docs, then the implementation files and version/changelog surfaces they point to. After that I’ll consolidate only maintainability findings with exact citations.

● Read spec.md
  │ .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/spec.md
  └ L1:260 (260 lines read)

● Read implementation-summary.md
  │ .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/implementa
  │ tion-summary.md
  └ L1:260 (129 lines read)

● Read tasks.md
  │ .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/tasks.md
  └ L1:260 (141 lines read)

● Search (grep)
  │ "(\.opencode/[^\s)"']+|\.claude/[^\s)"']+|mcp_server/[^\s)"']+|scripts/[^\s)"']+|\.github/workfl
  │ ows/[^\s)"']+)"
  │ (.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2)
  └ 6 lines found

● Search (glob)
  │ "**/{README.md,CHANGELOG.md,SKILL.md}" in .opencode/skill/cli-copilot
  └ 2 files found

● Search (glob)
  │ "**/{README.md,CHANGELOG.md,SKILL.md}" in .opencode/skill/sk-deep-research
  └ 3 files found

● Search (glob)
  │ "**/{README.md,CHANGELOG.md,SKILL.md}" in .opencode/skill/sk-improve-agent
  └ 3 files found

● Search (glob)
  │ "**/{README.md,CHANGELOG.md,SKILL.md}" in .opencode/skill/system-spec-kit
  └ 109 files found

● Search (glob)
  │ "**/{README.md,CHANGELOG.md,SKILL.md}" in .opencode/skill/sk-deep-review
  └ 3 files found

● Search (grep)
  │ "1\.3\.2\.0|1\.6\.2\.0|1\.2\.2\.0|3\.3\.1\.0|1\.3\.4\.0|1\.3\.0\.0|1\.6\.0\.0|1\.2\.0\.0|1\.1\.0
  │ \.0" in {.opencode/skill,.claude/skills,.opencode/specs}/**/*.{md,yaml,yml,json}
  └ 8 lines found

The packet docs are consistent so far; the likely review surface is now the actual shipped skill/runtime files and the version/changelog cross-links the packet claims were updated. I’m narrowing onto those exact files to see whether the maintenance surfaces drifted after the last fixes.

● Search (grep)
  │ "Version|version:|Changelog|CHANGELOG|## Changelog|## Version History|### Version History|###
  │ Changelog" in **/*.{md,yaml,yml,json} (.opencode/skill/sk-deep-research)
  └ 1 line found

● Search (grep)
  │ "Version|version:|Changelog|CHANGELOG|## Changelog|## Version History|### Version History|###
  │ Changelog" in **/*.{md,yaml,yml,json} (.opencode/skill/sk-deep-review)
  └ 3 lines found

● Search (grep)
  │ "Version|version:|Changelog|CHANGELOG|## Changelog|## Version History|### Version History|###
  │ Changelog" in **/*.{md,yaml,yml,json} (.opencode/skill/sk-improve-agent)
  └ 1 line found

● Search (grep)
  │ "Version|version:|Changelog|CHANGELOG|## Changelog|## Version History|### Version History|###
  │ Changelog" in **/*.{md,yaml,yml,json} (.opencode/skill/cli-copilot)
  └ 2 lines found

● Search (grep)
  │ "Version|version:|Changelog|CHANGELOG|## Changelog|## Version History|### Version History|###
  │ Changelog" in **/*.{md,yaml,yml,json} (.opencode/skill/system-spec-kit)
  └ 6 lines found

● Read README.md
  │ .opencode/skill/sk-improve-agent/README.md
  └ L1:220 (220 lines read)

● Read README.md
  │ .opencode/skill/sk-deep-research/README.md
  └ L1:220 (220 lines read)

● Read README.md
  │ .opencode/skill/system-spec-kit/README.md
  └ L1:220 (219 lines read)

● Read README.md
  │ .opencode/skill/cli-copilot/README.md
  └ L1:180 (180 lines read)

● Read README.md
  │ .opencode/skill/sk-deep-review/README.md
  └ L1:220 (220 lines read)

● Read tasks.md
  │ .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/008-furthe
  │ r-deep-loop-improvements/tasks.md
  └ L1:260 (137 lines read)

● Search (grep)
  │ "1\.6\.2\.0|1\.3\.2\.0|1\.2\.2\.0|3\.3\.1\.0|1\.3\.4\.0" in **/*.md
  │ (.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2)
  └ No matches found

● Search (grep)
  │ "changelog|Version|version bump|bump to v|SKILL bump|README" in **/*.md
  │ (.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/008-furth
  │ er-deep-loop-improvements)
  └ 43 lines found

● Read implementation-summary.md
  │ .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/008-furthe
  │ r-deep-loop-improvements/implementation-summary.md
  └ L1:260 (121 lines read)

● Search (glob)
  │ "**/*.md" in .opencode/changelog/13--sk-deep-review
  └ 6 files found

● Search (glob)
  │ "**/*.md" in .opencode/changelog/12--sk-deep-research
  └ 10 files found

● Search (glob)
  │ "**/*.md" in .opencode/changelog/15--sk-improve-agent
  └ 6 files found

● Search (glob)
  │ "**/*.md" in .opencode/changelog/01--system-spec-kit
  └ 94 files found

✗ Search (glob)
  │ "**/*.md" in .opencode/changelog/10--cli-copilot
  └ rg: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/changelog/10--cl
    i-copilot: IO error for operation on /Users/michelkerkmeester/MEGA/Development/Code_Environment/
    Public/.opencode/changelog/10--cli-copilot: No such file or directory (os error 2)

● Search (grep)
  │ "1\.6\.2\.0" in **/*.{md,json,yaml,yml} (.opencode/skill/sk-deep-research)
  └ 1 line found

● Search (grep)
  │ "1\.3\.4\.0" in **/*.md (.opencode/changelog)
  └ 2 lines found

● Search (grep)
  │ "3\.3\.1\.0" in **/*.{md,json,yaml,yml} (.opencode/skill/system-spec-kit)
  └ 2 lines found

● Search (grep)
  │ "1\.3\.2\.0" in **/*.{md,json,yaml,yml} (.opencode/skill/sk-deep-review)
  └ 1 line found

● Search (grep)
  │ "1\.2\.2\.0" in **/*.{md,json,yaml,yml} (.opencode/skill/sk-improve-agent)
  └ 1 line found

● Search (grep)
  │ "Skill version|Documentation version|Last updated|Version"
  │ (.opencode/skill/sk-deep-research/README.md)
  └ No matches found

● Search (grep)
  │ "Skill version|Documentation version|Last updated|Version"
  │ (.opencode/skill/sk-deep-review/README.md)
  └ No matches found

● Search (grep)
  │ "Skill version|Documentation version|Last updated|Version"
  │ (.opencode/skill/sk-improve-agent/README.md)
  └ No matches found

● Read v1.6.2.0.md
  │ .opencode/changelog/12--sk-deep-research/v1.6.2.0.md
  └ L1:220 (83 lines read)

● Read v1.3.2.0.md
  │ .opencode/changelog/13--sk-deep-review/v1.3.2.0.md
  └ L1:220 (107 lines read)

● Read v1.2.2.0.md
  │ .opencode/changelog/15--sk-improve-agent/v1.2.2.0.md
  └ L1:220 (111 lines read)

● Read SKILL.md
  │ .opencode/skill/system-spec-kit/SKILL.md
  └ L1:80 (80 lines read)

● Search (grep)
  │ "changelog|release note|release notes|v1\.|Skill version|Documentation version"
  │ (.opencode/skill/sk-deep-research/README.md)
  └ No matches found

● Search (grep)
  │ "changelog|release note|release notes|v1\.|Skill version|Documentation version"
  │ (.opencode/skill/sk-deep-review/README.md)
  └ No matches found

● Search (grep)
  │ "changelog|release note|release notes|v1\.|Skill version|Documentation version"
  │ (.opencode/skill/sk-improve-agent/README.md)
  └ No matches found

● Read v3.3.1.0.md
  │ .opencode/changelog/01--system-spec-kit/v3.3.1.0.md
  └ L1:220 (130 lines read)

● Read v1.3.4.0.md
  │ .opencode/changelog/22--cli-copilot/v1.3.4.0.md
  └ L1:220 (29 lines read)

● Read README.md
  │ .opencode/skill/sk-deep-research/README.md
  └ L214:280 (12 lines read)

● Search (grep)
  │ "## 9\. RELATED DOCUMENTS|## 12\. RELATED DOCUMENTS|RELATED DOCUMENTS|Skill
  │ version|Documentation version" (.opencode/skill/sk-deep-research/README.md)
  └ 2 lines found

● Search (grep)
  │ "## 9\. RELATED DOCUMENTS|## 12\. RELATED DOCUMENTS|RELATED DOCUMENTS|Skill
  │ version|Documentation version" (.opencode/skill/sk-deep-review/README.md)
  └ 2 lines found

● Search (grep)
  │ "## 9\. RELATED DOCUMENTS|## 12\. RELATED DOCUMENTS|RELATED DOCUMENTS|Skill
  │ version|Documentation version" (.opencode/skill/sk-improve-agent/README.md)
  └ 2 lines found

● Read README.md
  │ .opencode/skill/sk-deep-review/README.md
  └ L330:410 (81 lines read)

● Read README.md
  └ .opencode/skill/sk-improve-agent/README.md

● Read README.md
  │ .opencode/skill/sk-improve-agent/README.md
  └ L379:460 (25 lines read)

I’ve got one cross-cutting documentation drift candidate already: the three deep-loop README surfaces don’t expose any version/changelog linkage, which makes the exact release impossible to confirm from the human-facing docs alone. I’m now checking the runtime files for similar contract-drift risks in the actual code paths.

● Search (grep)
  │ "TODO|FIXME|XXX|HACK|NOTE:.*(deferred|legacy|remove|obsolete)|legacy alias|compatibility
  │ alias|deprecated" in **/*.{cjs,js,ts,md,yaml,yml} (.opencode/skill/sk-deep-review)
  └ 5 lines found

● Search (grep)
  │ "TODO|FIXME|XXX|HACK|NOTE:.*(deferred|legacy|remove|obsolete)|legacy alias|compatibility
  │ alias|deprecated" in **/*.{cjs,js,ts,md,yaml,yml} (.opencode/skill/sk-deep-research)
  └ 5 lines found

● Search (grep)
  │ "TODO|FIXME|XXX|HACK|NOTE:.*(deferred|legacy|remove|obsolete)|legacy alias|compatibility
  │ alias|deprecated" in **/*.{cjs,js,ts,md,yaml,yml} (.opencode/skill/sk-improve-agent)
  └ 5 lines found

● Search (grep)
  │ "TODO|FIXME|XXX|HACK|NOTE:.*(deferred|legacy|remove|obsolete)|legacy alias|compatibility
  │ alias|deprecated" in **/*.{cjs,js,ts,md,yaml,yml} (.opencode/skill/system-spec-kit)
  └ 6 lines found

● Search (grep)
  │ "TODO|FIXME|XXX|HACK|NOTE:.*(deferred|legacy|remove|obsolete)|legacy alias|compatibility
  │ alias|deprecated" in **/*deep*review*.yaml (.opencode/command)
  └ No matches found

● Read reduce-state.cjs
  │ .opencode/skill/sk-deep-review/scripts/reduce-state.cjs
  └ L1000:1055 (56 lines read)

● Search (grep)
  │ "repeatedFindings" in **/*.{cjs,md,json,yaml,yml} (.opencode/skill/sk-deep-review)
  └ 12 lines found

● Read state_format.md
  │ .opencode/skill/sk-deep-review/references/state_format.md
  └ L520:550 (31 lines read)

● Read deep-review-dashboard.md
  │ .opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-da
  │ shboard.md
  └ L72:90 (19 lines read)

● Read review_mode_contract.yaml
  │ .opencode/skill/sk-deep-review/assets/review_mode_contract.yaml
  └ L240:270 (31 lines read)

● Read loop_protocol.md
  │ .opencode/skill/sk-deep-review/references/loop_protocol.md
  └ L100:120 (21 lines read)

● Read reduce-state.cjs
  │ .opencode/skill/sk-deep-review/scripts/reduce-state.cjs
  └ L708:752 (45 lines read)

● Search (glob)
  │ "**/*wave*.{cjs,ts,js}" in .opencode/skill/system-spec-kit
  └ 9 files found

● Search (grep)
  │ "transitionBoardStatus|allowedTransitions|phaseTransitions|advancePhase\(|updateBoard\(|merge.*f
  │ inding|composite key|findingId" in **/*wave*.{cjs,ts,js}|**/wave/**/*.{cjs,ts,js}
  │ (.opencode/skill/system-spec-kit)
  └ No matches found

✗ search (MCP: cocoindex_code) · wave executor transitionBoardStatus updateBoard advancePhase allow…
  └ MCP server 'cocoindex_code': McpError: MCP error -32001: Request timed out

● Read wave-segment-state.cjs
  │ .opencode/skill/system-spec-kit/scripts/lib/wave-segment-state.cjs
  └ L1:260 (260 lines read)

● Search (grep)
  │ "transitionBoardStatus|advancePhase|allowed
  │ transition|allowedTransitions|queued|running|merge|findingId|composite" in wave-*.cjs
  │ (.opencode/skill/system-spec-kit/scripts/lib)
  └ 7 lines found

● Read wave-coordination-board.cjs
  │ .opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs
  └ L1:260 (259 lines read)

● Read wave-lifecycle.cjs
  │ .opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs
  └ L1:260 (260 lines read)

● Read create.sh
  │ .opencode/skill/system-spec-kit/scripts/spec/create.sh
  └ L1:240 (240 lines read)

● Search (grep)
  │ "memory/|mkdir .*memory|memory directory|templates/memory|scratch" in **/*.{sh,js,ts,cjs,md}
  │ (.opencode/skill/system-spec-kit/scripts/spec)
  └ 35 lines found

● Search (grep)
  │ "memory/ and scratch/ subdirectories|memory/|scratch/ subdirectories"
  │ (.opencode/skill/system-spec-kit/README.md)
  └ 12 lines found

● Code-review(gpt-5.4-mini) Audit maintainability
  │ Read deep-research-strategy.md
  │   │ .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/resear
  │   ch/d
  │   │ eep-research-strategy.md
  │   └ L156:168 (13 lines read)
  └ Read deep-review-strategy.md
      │ .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review
      /arc
      │ hive-rvw-2026-04-11/deep-review-strategy.md
      └ L100:115 (16 lines read)

I found one plausible code-level maintainability drift from a secondary review pass in the graph metadata parser. I’m verifying it directly in the code now and checking whether it belongs in the 042 scope before I include it.

● Read entity-extractor.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts
  └ L100:125 (26 lines read)

● Read graph-metadata-parser.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts
  └ L420:450 (31 lines read)

● Read graph-metadata-schema.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts
  └ L1:40 (40 lines read)

● Read deep-research-strategy.md
  │ .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/d
  │ eep-research-strategy.md
  └ L156:166 (11 lines read)

● Read SKILL.md
  │ .opencode/skill/sk-deep-research/SKILL.md
  └ L1:15 (14 lines read)

● Read README.md
  │ .opencode/skill/system-spec-kit/README.md
  └ L1080:1088 (7 lines read)

● Search (grep)
  │ "Skill version|Documentation version|Version" (.opencode/skill/cli-copilot/README.md)
  └ 1 line found

● Read SKILL.md
  │ .opencode/skill/sk-deep-review/SKILL.md
  └ L1:15 (15 lines read)

● Read SKILL.md
  │ .opencode/skill/sk-improve-agent/SKILL.md
  └ L1:12 (12 lines read)

● Code-review(gpt-5.4-mini) Audit wave optimizer
  │ List graph/lib changed files (shell)
  │   │ git --no-pager diff --name-only | rg
  │   '^\.opencode/skill/system-spec-kit/mcp_server/lib/graph/|^\
  │   │ .opencode/skill/system-spec-kit/scripts/lib/'
  │   └ 2 lines...
  └ List changed yaml files (shell)
      │ git --no-pager diff --name-only | rg '\.(ya?ml)$'
      └ 1 line...

● Code-review(gpt-5.4-mini) Audit version docs
  │ Read graph-metadata-parser.ts
  │   │ .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts
  │   └ L1:260 (260 lines read)
  └ List directory .opencode/changelog/01--system-spec-kit
      └ 94 files found

● Code-review(gpt-5.4-mini) Audit graph maintainability
  │ Changed relevant files against main (shell)
  │   │ git --no-pager diff --name-only main...HEAD --
  │   │ .opencode/skill/system-spec-kit/mcp_server/lib/graph
  │   │ .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph
  │   └ 1 line...
  └ Demonstrate the 80-char filter drops valid entity text (shell)
      │ python3 - <<'PY'
      │ entity_text = 'A' * 81
      │ normalized = entity_text.replace('\r',' ').replace('\n',' ').strip()
      │ print(len(normalized), normalized[:10] + '...')
      │ print('kept?', bool(normalized) and len(normalized) <= 80)…
      └ 4 lines...

● Read entity-extractor.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts
  └ L126:150 (24 lines read)

I found a stronger packet-level drift than the README issue: the 042 phase-008 docs still point readers at the original `v1.6.0.0 / v1.3.0.0 / v1.2.0.0` release notes as the “primary release evidence,” even though the shipped skill versions are now `v1.6.2.0 / v1.3.2.0 / v1.2.2.0`. I’m pulling the exact citations now because that directly affects release traceability for this bundle.

● Read README.md
  │ .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/008-furthe
  │ r-deep-loop-improvements/README.md
  └ L20:34 (14 lines read)

● Search (grep)
  │ "v1\.6\.0\.0|v1\.3\.0\.0|v1\.2\.0\.0" in **/*.md
  │ (.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2)
  └ 6 lines found

● Search (grep)
  │ "v1\.6\.2\.0|v1\.3\.2\.0|v1\.2\.2\.0" in **/*.md
  │ (.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2)
  └ No matches found

● Read v1.6.2.0.md
  │ .opencode/changelog/12--sk-deep-research/v1.6.2.0.md
  └ L1:12 (12 lines read)

● Read v1.3.2.0.md
  │ .opencode/changelog/13--sk-deep-review/v1.3.2.0.md
  └ L1:12 (12 lines read)

● Read v1.2.2.0.md
  │ .opencode/changelog/15--sk-improve-agent/v1.2.2.0.md
  └ L1:12 (12 lines read)

● Read decision-record.md
  │ .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/008-furthe
  │ r-deep-loop-improvements/decision-record.md
  └ L20:60 (40 lines read)

● Read implementation-summary.md
  │ .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/008-furthe
  │ r-deep-loop-improvements/implementation-summary.md
  └ L18:28 (11 lines read)

● Read tasks.md
  │ .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/tasks.md
  └ L72:80 (9 lines read)

● Read README.md
  │ .opencode/skill/cli-copilot/README.md
  └ L356:376 (21 lines read)

● Read README.md
  │ .opencode/skill/system-spec-kit/README.md
  └ L1038:1087 (49 lines read)

**Outcome:** no P0 maintainability issues. I found **1 P1** and **3 P2** items.  
**Version check:** `SKILL.md` frontmatter matches the current changelog versions for **sk-deep-review `1.3.2.0`**, **sk-deep-research `1.6.2.0`**, **sk-improve-agent `1.2.2.0`**, **system-spec-kit `3.3.1.0`**, and **cli-copilot `1.3.4.0`**.

### F-042-001
- **Severity:** P1
- **Dimension:** Maintainability
- **File / Line:**  
  - `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/tasks.md:79`  
  - `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/008-further-deep-loop-improvements/implementation-summary.md:25`  
  - `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/008-further-deep-loop-improvements/decision-record.md:27,45-51`  
  - `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/008-further-deep-loop-improvements/README.md:24-28`
- **Title:** 042 packet evidence chain still points to superseded Phase 008 releases
- **Description:** The packet’s canonical release-evidence surfaces still route maintainers to `v1.6.0.0 / v1.3.0.0 / v1.2.0.0` as the Phase 008 proof chain, even though the current shipped fixes for this same packet are now `v1.6.2.0 / v1.3.2.0 / v1.2.2.0`. That leaves the packet’s own closeout docs lagging the current release state and makes future audits start from obsolete release notes.
- **Evidence:** Current patch releases exist and explicitly point back to this packet: `.opencode/changelog/12--sk-deep-research/v1.6.2.0.md:7-12`, `.opencode/changelog/13--sk-deep-review/v1.3.2.0.md:7-12`, `.opencode/changelog/15--sk-improve-agent/v1.2.2.0.md:7-12`.
- **Recommendation:** Update the parent and Phase 008 closeout docs so they distinguish **original Phase 008 release evidence** from the **current post-review patch release evidence**, and point “primary/current release evidence” at the latest changelog trio.

### F-042-002
- **Severity:** P2
- **Dimension:** Maintainability
- **File / Line:**  
  - `.opencode/skill/sk-deep-research/README.md:214-224`  
  - `.opencode/skill/sk-deep-review/README.md:379-389`  
  - `.opencode/skill/sk-improve-agent/README.md:379-403`  
  - `.opencode/skill/cli-copilot/README.md:360-376`  
  - `.opencode/skill/system-spec-kit/README.md:1039-1086`
- **Title:** Skill entrypoint READMEs do not surface release-history links
- **Description:** The human-facing README entrypoints expose internal docs and related skills, but none of them link the corresponding versioned changelog surface. For the three deep-loop skills this is worse because the README also omits an inline skill version, so auditors must already know the `.opencode/changelog/<id>/vX.Y.Z.md` convention to confirm what release the README describes.
- **Evidence:** Versioned changelog files do exist for all requested artifacts — e.g. `.opencode/changelog/12--sk-deep-research/v1.6.2.0.md:1-7`, `.opencode/changelog/13--sk-deep-review/v1.3.2.0.md:1-7`, `.opencode/changelog/15--sk-improve-agent/v1.2.2.0.md:1-7`, `.opencode/changelog/01--system-spec-kit/v3.3.1.0.md:1-7`, `.opencode/changelog/22--cli-copilot/v1.3.4.0.md:1-7`. Only `system-spec-kit` and `cli-copilot` expose an inline version at the README level (`system-spec-kit/README.md:1086`, `cli-copilot/README.md:61`), but still not the changelog link.
- **Recommendation:** Add a small **Release history** link in each README, and add an inline skill version footer/table row for the three deep-loop skills.

### F-042-003
- **Severity:** P2
- **Dimension:** Maintainability
- **File / Line:**  
  - `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:716-749,1027-1033`  
  - `.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:250-259`  
  - `.opencode/skill/sk-deep-review/references/loop_protocol.md:106-110`  
  - `.opencode/skill/sk-deep-review/references/state_format.md:533-536`
- **Title:** Deprecated `repeatedFindings` bucket still leaks through canonical review surfaces
- **Description:** REQ-018 split repeated findings into `persistentSameSeverity` and `severityChanged`, but the deprecated combined bucket is still initialized as a first-class registry section and rendered in the canonical dashboard. That keeps three overlapping representations alive, prolongs contract complexity, and encourages new consumers to keep depending on the deprecated field instead of the split model.
- **Evidence:** The reducer comments explicitly say new code should read the split arrays, but it still computes and renders `repeatedFindings`; the contract YAML and loop protocol still treat `repeatedFindings` as part of canonical initialized state.
- **Recommendation:** Stop advertising `repeatedFindings` in new-packet contract/init/dashboard surfaces; keep it only in a legacy adapter path if backward compatibility is still required.

### F-042-004
- **Severity:** P2
- **Dimension:** Maintainability
- **File / Line:**  
  - `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:430-446`  
  - `.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:129-145`  
  - `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts:19-24`
- **Title:** Graph metadata parser applies a hidden second entity-length policy
- **Description:** `graph-metadata-parser.ts` silently drops extracted entities longer than 80 characters, but the extractor allows entities up to 100 characters and the schema has no max-length rule. That creates an undocumented second filter in the middle of the pipeline, so valid long headings or named concepts disappear from derived graph metadata without any shared contract explaining why.
- **Evidence:** The parser skips `normalizedName.length > 80`; the extractor explicitly permits up to 100 chars; the schema accepts any non-empty `name`.
- **Recommendation:** Move the length policy into one shared constant/schema rule, or preserve full entity text and cap only a display label.

## ITERATION SUMMARY
Round 3 maintainability review found **4 issues total: 1 P1, 3 P2, 0 P0**. The main theme is **release-traceability drift**, not algorithmic breakage: the runtime code is materially cleaner after the earlier fixes, but the packet’s documentation and a few canonical contracts still preserve stale or duplicate surfaces that will make future audits harder.

## COVERAGE ASSESSMENT
Reviewed:
1. 042 parent packet (`spec.md`, `tasks.md`, `implementation-summary.md`) and Phase 008 closeout docs.
2. Requested version surfaces across `SKILL.md`, README, and changelog files for `sk-deep-research`, `sk-deep-review`, `sk-improve-agent`, `system-spec-kit`, and `cli-copilot`.
3. Deep-review reducer/contract docs and targeted system-spec-kit graph metadata code.
4. Wave executor / optimizer surfaces were spot-checked; I did not find a material maintainability issue there worth reporting.

## CONFIDENCE
**High** on the 4 findings above.  
**Medium-high** overall: this was a targeted maintainability audit of the changed/runtime-truth surfaces, not an exhaustive line-by-line review of every helper in the bundle.

## NEXT PRIORITIES
1. Refresh 042 packet and Phase 008 release-evidence docs to point at the current patch releases.
2. Add release-history/version pointers to the skill README entrypoints.
3. Retire `repeatedFindings` from canonical deep-review packet surfaces.
4. Unify the graph-entity length policy across extractor, parser, and schema.


Changes   +0 -0
Requests  1 Premium (17m 25s)
Tokens    ↑ 7.4m • ↓ 59.0k • 7.1m (cached) • 33.7k (reasoning)
