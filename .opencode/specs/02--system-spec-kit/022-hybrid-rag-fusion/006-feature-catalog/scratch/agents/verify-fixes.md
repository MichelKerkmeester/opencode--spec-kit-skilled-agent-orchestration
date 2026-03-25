● memory_match_triggers
  └ {"summary":"Matched 3 memories via trigger phrases","data":{"matchType":"trig...

● Run skill advisor (shell)
  │ python3 .opencode/skill/scripts/skill_advisor.py "Verify these specific documentation fixes were
  │ applied correctly by reading the listed feature catalog markdown files and confirming the
  │ requested wording/links in each file." --threshold 0.8
  └ 11 lines...

● skill(sk-doc)

I’m checking each file directly and focusing on the exact lines/sections tied to your six fix descriptions so I can give a clean yes/no verification without guessing.

● Search (grep)
  │ "removed|preferred|functional|positional JSON|JSON saves" (.opencode/skill/system-spec-kit/featu
  │ re_catalog/16--tooling-and-scripts/17-json-primary-deprecation-posture.md)
  └ 9 lines found

● Search (grep)
  │ "SPECKIT_CONSUMPTION_LOG|inert|active|default-ON|default ON" (.opencode/skill/system-spec-kit/fe
  │ ature_catalog/19--feature-flag-reference/06-6-debug-and-telemetry.md)
  └ 1 line found

● Search (grep)
  │ "MCP_MAX_MEMORY_TOKENS|warns|hard-fails|hard fails" (.opencode/skill/system-spec-kit/feature_cat
  │ alog/19--feature-flag-reference/03-3-mcp-configuration.md)
  └ 2 lines found

● Search (grep)
  │ "53 helpers|46 helpers|53|46"
  │ (.opencode/skill/system-spec-kit/feature_catalog/17--governance/02-feature-flag-sunset-audit.md)
  └ 1 line found

● Search (grep)
  │ "optional hints|required|actor identity|actorUserId|actorAgentId" (.opencode/skill/system-spec-k
  │ it/feature_catalog/02--mutation/07-namespace-management-crud-tools.md)
  └ 3 lines found

● Search (grep)
  │ "comprehensive-remediation-sprint-8|Comprehensive Remediation Sprint 8|\]\(#.*remediation.*\)"
  │ (.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md)
  └ No matches found

I found the exact updated lines in five of the six files. The remaining one is the big `feature_catalog.md`, so I’m reading both the TOC area and the section around the previously broken Sprint 8 link to confirm it lines up end to end.

● Read 17-json-primary-deprecation-posture.md
  │ .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/17-json-primary-deprecat
  │ ion-posture.md
  └ L16:45 (30 lines read)

● Read 06-6-debug-and-telemetry.md
  │ .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/06-6-debug-and-teleme
  │ try.md
  └ L24:36 (13 lines read)

● Read 03-3-mcp-configuration.md
  │ .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/03-3-mcp-configuratio
  │ n.md
  └ L20:28 (9 lines read)

● Read 02-feature-flag-sunset-audit.md
  │ .opencode/skill/system-spec-kit/feature_catalog/17--governance/02-feature-flag-sunset-audit.md
  └ L16:24 (9 lines read)

● Read 07-namespace-management-crud-tools.md
  │ .opencode/skill/system-spec-kit/feature_catalog/02--mutation/07-namespace-management-crud-tools.
  │ md
  └ L14:22 (9 lines read)

● Read feature_catalog.md
  │ .opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md
  └ L1:220 (175 lines read)

● Read feature_catalog.md
  │ .opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md
  └ L3918:3934 (17 lines read)

● Search (grep)
  │ "remediation" (.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md)
  └ 5 lines found

● Search (grep)
  │ "Comprehensive remediation|comprehensive-remediation|\]\(#comprehensive"
  │ (.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md)
  └ 1 line found

● Search (grep)
  │ "^### .*Sprint 8|^## .*Sprint 8|^### .*Comprehensive|^## .*Comprehensive"
  │ (.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md)
  └ No matches found

● Read feature_catalog.md
  │ .opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md
  └ L3926:3946 (21 lines read)

I’ve narrowed the `feature_catalog.md` question: the old `#comprehensive-remediation-sprint-8` link is no longer present at the cited spot. I’m doing one last pass on the catalog headings so I can say whether the TOC links still match the actual heading style, not just that one reference.

● Search (grep)
  │ "^## " (.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md)
  └ 22 lines found

● Read feature_catalog.md
  │ .opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md
  └ L1480:1510 (31 lines read)

● Search (grep)
  │ "\]\(#" (.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md)
  └ 21 lines found

`.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/17-json-primary-deprecation-posture.md | VERIFIED YES | States `--json`/`--stdin` are preferred while positional JSON file input remains functional; explicitly says removal applies to runtime-derived capture, not file-backed JSON input (lines 19, 29-31, 40-41).`

`.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/06-6-debug-and-telemetry.md | VERIFIED YES | `SPECKIT_CONSUMPTION_LOG` is described as active and **Default ON**, not inert (line 32).`

`.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/03-3-mcp-configuration.md | VERIFIED YES | `MCP_MAX_MEMORY_TOKENS` says pre-flight **hard-fails** with `PF020`, not warns (line 24).`

`.opencode/skill/system-spec-kit/feature_catalog/17--governance/02-feature-flag-sunset-audit.md | VERIFIED YES | Says the active helper inventory is **53 exported `is*` functions**, not 46 (line 20).`

`.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md | VERIFIED YES | TOC anchors match the actual H2 format (`#1-overview` … `#21-feature-flag-reference`). Near line 3940, the broken `#comprehensive-remediation-sprint-8` link is gone; it now uses plain text instead of a bad anchor link.`

`.opencode/skill/system-spec-kit/feature_catalog/02--mutation/07-namespace-management-crud-tools.md | VERIFIED YES | Actor identity fields are described as **optional corroboration hints**, not required authority fields (lines 18 and 20).`

