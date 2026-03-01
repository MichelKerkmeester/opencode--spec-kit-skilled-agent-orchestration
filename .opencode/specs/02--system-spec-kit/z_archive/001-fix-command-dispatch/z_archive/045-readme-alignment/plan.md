---
title: "Plan: README & Install Guide Alignment [045-readme-alignment/plan]"
description: "Fix all issues in each file before moving to the next. This minimizes context switching and ensures comprehensive fixes per file."
trigger_phrases:
  - "plan"
  - "readme"
  - "install"
  - "guide"
  - "alignment"
  - "045"
importance_tier: "important"
contextType: "decision"
---
# Plan: README & Install Guide Alignment

## 1. Overview

| Field | Value |
|-------|-------|
| **Approach** | File-by-file fixes with verification |
| **Phases** | 5 (one per file) |
| **Estimated Time** | ~30 minutes |
| **Risk Level** | Low (documentation only) |

---

## 2. Implementation Strategy

### Approach: Sequential File Fixing

Fix all issues in each file before moving to the next. This minimizes context switching and ensures comprehensive fixes per file.

### Order of Operations

1. **system-spec-kit/README.md** (3 HIGH issues) - Most impactful
2. **mcp_server/README.md** (2 HIGH + 1 MEDIUM) - Core MCP docs
3. **mcp-narsil/README.md** (1 HIGH) - Tool naming critical
4. **MCP - Code Mode.md** (1 HIGH + 1 MEDIUM) - Install guide
5. **mcp-leann/README.md** (1 MEDIUM) - Minor path fix

---

## 3. Phase Details

### Phase 1: system-spec-kit/README.md

**Issues to fix:**
- T-001: Template count (10 vs 9)
- S-001: Script count (11 vs 10)
- C-001: Command count (12 vs 7)

**Locations to update:**
| Line Range | Change |
|------------|--------|
| ~26 | Fix "10 templates" claim |
| ~63-69 | Fix Key Statistics table |
| ~76-77 | Fix "12 structured templates" |
| ~114-122 | Update directory structure listing |
| ~375-385 | Add context_template.md to template table |
| ~559-576 | Fix script count and add missing scripts |
| ~1022-1038 | Fix command count in Section 6 |
| ~1733-1743 | Fix FAQ template listing |

**Verification:**
- Count actual templates: 10 files
- Count actual scripts: 10 files
- Count documented commands: 7 spec_kit + 4 memory = 11 (or correct to 7)

---

### Phase 2: mcp_server/README.md

**Issues to fix:**
- L-001: Library module count (22 vs 23)
- V-001: Version mismatch (v12.x vs V16.0)
- P-001: Missing execution_methods.md reference

**Locations to update:**
| Line Range | Change |
|------------|--------|
| ~3 | Update version to V16.x |
| ~21 | Fix TOC "(22)" to "(23)" |
| ~205 | Verify section header says "(23)" |
| ~243-252 | Add errors.js to Infrastructure Modules |
| ~389 | Remove or update execution_methods.md reference |

**Verification:**
- Count actual lib/*.js files: 23
- Verify errors.js exists
- Verify execution_methods.md does NOT exist

---

### Phase 3: mcp-narsil/README.md

**Issues to fix:**
- N-005: Unprefixed tool names in Feature section

**Locations to update:**
| Line Range | Change |
|------------|--------|
| ~207-214 | Add `narsil.narsil_` prefix to Security tools |
| ~219-226 | Add prefix to Call Graph tools |
| ~253-255 | Add prefix to Type Inference tools |
| ~265-276 | Add prefix to Supply Chain tools |
| ~496-506 | Fix Common Patterns table |

**Verification:**
- All tool names follow `narsil.narsil_*` pattern
- Matches Troubleshooting section examples

---

### Phase 4: MCP - Code Mode.md

**Issues to fix:**
- I-013: Wrong naming pattern (dots vs underscores)
- I-005: UTCP_CONFIG_PATH vs UTCP_CONFIG_FILE

**Locations to update:**
| Line Range | Change |
|------------|--------|
| ~319 | Fix UTCP_CONFIG_PATH to UTCP_CONFIG_FILE |
| ~679-704 | Fix naming pattern documentation |
| ~691-694 | Fix examples: `webflow.webflow.sites_list` to `webflow.webflow_sites_list` |

**Verification:**
- Pattern matches README: `{manual}.{manual_name}_{tool_name}`
- Examples use underscore not double-dot

---

### Phase 5: mcp-leann/README.md

**Issues to fix:**
- X-001: URL-encoded paths

**Locations to update:**
| Line Range | Change |
|------------|--------|
| ~10-11 | Remove URL encoding from path |
| ~106 | Remove URL encoding from path |
| ~787 | Remove URL encoding from path |

**Verification:**
- Paths don't use `%20` encoding
- Links still resolve correctly

---

## 4. Quality Gates

| Gate | Criteria |
|------|----------|
| **Pre-fix** | Read and understand current content |
| **Post-fix** | Verify change matches actual file counts |
| **Cross-check** | Ensure no new contradictions introduced |
| **Final** | All checklist items marked complete |

---

## 5. Rollback Plan

All changes are documentation-only. If issues arise:
1. Revert via git: `git checkout -- <file>`
2. Re-apply fixes individually
3. Verify each fix before proceeding
