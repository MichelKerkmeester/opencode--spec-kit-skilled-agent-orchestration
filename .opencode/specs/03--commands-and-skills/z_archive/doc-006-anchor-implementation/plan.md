---
title: "Technical Plan: Retrieval Anchors for Skill Documentation [006-anchor-implementation/plan]"
description: "Spec Folder: .opencode/specs/03--commands-and-skills/sk-doc/006-anchor-implementation"
trigger_phrases:
  - "technical"
  - "plan"
  - "retrieval"
  - "anchors"
  - "for"
  - "033"
  - "anchor"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Technical Plan: Retrieval Anchors for Skill Documentation

<!-- ANCHOR: summary -->
**Spec Folder**: `.opencode/specs/03--commands-and-skills/sk-doc/006-anchor-implementation`  
**Level**: 3+ (Governance + Architecture)  
**Status**: Planning  
**Created**: 2026-02-17
<!-- /ANCHOR: summary -->

---

<!-- ANCHOR:summary -->
## 1. ARCHITECTURE OVERVIEW

### System Context

```
┌─────────────────────────────────────────────────────────────────┐
│                    Skill Documentation System                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────┐         ┌──────────────────┐              │
│  │  Skill Templates │────────▶│  New Skill Docs  │              │
│  │  (with anchors)  │         │  (auto-anchored) │              │
│  └─────────────────┘         └──────────────────┘              │
│                                                                  │
│  ┌─────────────────┐         ┌──────────────────┐              │
│  │ Existing Skills │────────▶│ Migration Script │              │
│  │  (no anchors)   │         │  (adds anchors)  │              │
│  └─────────────────┘         └──────────────────┘              │
│                                        │                         │
│                                        ▼                         │
│                               ┌──────────────────┐              │
│                               │ Validation Suite │              │
│                               │  (format/cover)  │              │
│                               └──────────────────┘              │
│                                        │                         │
│                                        ▼                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           Anchored Skill Documentation                    │  │
│  │  ┌───────────┐  ┌────────────┐  ┌──────────────┐        │  │
│  │  │ SKILL.md  │  │ references/│  │   assets/    │        │  │
│  │  │ (summary, │  │ (workflows,│  │ (checklists, │        │  │
│  │  │  rules,   │  │  trouble-  │  │  patterns,   │        │  │
│  │  │  examples)│  │  shooting) │  │  examples)   │        │  │
│  │  └───────────┘  └────────────┘  └──────────────┘        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                        │                         │
│                                        ▼                         │
│                          ┌──────────────────────┐               │
│                          │  Agent Skill Loader  │               │
│                          │ (anchor-aware/compat)│               │
│                          └──────────────────────┘               │
│                                        │                         │
└────────────────────────────────────────┼─────────────────────────┘
                                         ▼
                            ┌────────────────────────┐
                            │   AI Agent Context     │
                            │ (selective section     │
                            │     retrieval)         │
                            └────────────────────────┘
```

### Component Architecture

```
.opencode/skill/
│
├── sk-doc/
│   └── assets/opencode/
│       ├── skill_md_template.md         [UPDATED: anchor examples]
│       ├── skill_reference_template.md  [UPDATED: anchor examples]
│       └── skill_asset_template.md      [UPDATED: anchor examples]
│
├── [skill-name]/
│   ├── SKILL.md                         [MIGRATED: anchors added]
│   ├── references/
│   │   ├── *.md                         [MIGRATED: anchors added]
│   └── assets/
│       ├── *.md                         [MIGRATED: anchors added]
│
└── scripts/
    └── dist/skill/
        ├── add-anchors-to-skills.py     [NEW: migration tool]
        └── validate-skill-anchors.py    [NEW: validation tool]
```

---

<!-- /ANCHOR:summary -->
## 2. ANCHOR SPECIFICATION

### Anchor Format

**Syntax**: Identical to memory ANCHOR format (HTML comment style)

```markdown
<!-- ANCHOR: anchor-name -->
Content to be extracted goes here.
Can span multiple paragraphs and include any Markdown.
<!-- /ANCHOR: anchor-name -->
```

**Rules**:
1. Anchor names: lowercase, hyphenated (e.g., `summary`, `when-to-use`, `how-it-works`)
2. Flat structure: No nested anchors (one level only)
3. Self-contained: Anchor content must be complete and understandable in isolation
4. Non-empty: Anchor blocks must contain at least 1 paragraph
5. Unique: No duplicate anchor names in same file

### Anchor Taxonomy

**SKILL.md Anchors** (main skill file):

| Anchor | Location | Content | Required |
|--------|----------|---------|----------|
| `summary` | After H1, before H2 | 1-3 paragraph overview | ✅ Yes |
| `when-to-use` | Section 1 or trigger section | Use cases, activation patterns | ✅ Yes |
| `how-it-works` | Section 2 or workflow section | Operational flow | ✅ Yes |
| `rules` | Section dedicated to ALWAYS/NEVER | Constraints, requirements | ✅ Yes |
| `examples` | Examples section | Usage examples with code | ⭐ Recommended |
| `resources` | Resource catalog section | Bundled file references | ⭐ Recommended |
| `workflows` | Workflow/process sections | Step-by-step procedures | ⭐ Recommended |
| `troubleshooting` | Troubleshooting section | Common issues, solutions | ⭐ Recommended |

**Reference Doc Anchors** (`references/*.md`):

| Anchor | Content | Required |
|--------|---------|----------|
| `summary` | Brief doc overview | ✅ Yes |
| `workflows` | Detailed procedures | ⭐ Recommended |
| `examples` | Code samples, demos | ⭐ Recommended |
| `rules` | Constraints specific to topic | Optional |
| `troubleshooting` | Topic-specific issues | Optional |
| `decisions` | Design decisions, rationale | Optional |

**Asset Doc Anchors** (`assets/*.md`):

| Anchor | Content | Required |
|--------|---------|----------|
| `summary` | Asset purpose and usage | ⭐ Recommended |
| `validation` | Quality gates, checks | Optional |
| `examples` | Usage examples | Optional |

### Anchor Placement Strategy

**Principle**: Wrap existing content, don't rewrite.

**Strategy**:
1. **Section-based wrapping**: Wrap entire H2 sections with anchors matching section purpose
2. **Introduction wrapping**: Wrap first 1-3 paragraphs after H1 as `summary`
3. **Rule consolidation**: Wrap ALWAYS/NEVER lists and constraint paragraphs as `rules`
4. **Example consolidation**: Wrap code blocks and usage examples as `examples`

**Example: Before and After**

**Before**:
```markdown
# Skill Name

Brief description of what this skill does.

## 1. WHEN TO USE

Use this skill when:
- Condition A
- Condition B
```

**After**:
```markdown
# Skill Name

<!-- ANCHOR: summary -->
Brief description of what this skill does.
<!-- /ANCHOR: summary -->

## 1. WHEN TO USE

<!-- ANCHOR: when-to-use -->
Use this skill when:
- Condition A
- Condition B
<!-- /ANCHOR: when-to-use -->
```

---

## 3. IMPLEMENTATION APPROACH

### Phase 1: Foundation (Hours 1-8)

**Objective**: Update templates and define anchor taxonomy.

#### Task 1.1: Define Anchor Taxonomy (2 hours)
- Create `anchor-taxonomy.md` in spec folder
- Define all anchor names with purpose, scope, usage
- Document anchor placement rules
- Get approval from documentation lead

**Deliverable**: `anchor-taxonomy.md` with 10-15 defined anchors

#### Task 1.2: Update skill_md_template.md (2 hours)
- Add anchor syntax to template sections
- Include "How to Use Anchors" subsection (after frontmatter section)
- Provide 3+ concrete examples (summary, rules, examples)
- Add validation instructions

**Changes**:
```markdown
## 3. SKILL TEMPLATE

<!-- ANCHOR: summary -->
[Brief skill overview - this is an example of summary anchor placement]
<!-- /ANCHOR: summary -->

### How to Use Anchors

Anchors enable selective retrieval of skill sections. Add anchors to:
- **summary**: First 1-3 paragraphs after H1
- **when-to-use**: Trigger conditions and use cases
- **rules**: ALWAYS/NEVER constraints
...

## 5. RULES

<!-- ANCHOR: rules -->
**ALWAYS**:
- Rule 1
- Rule 2

**NEVER**:
- Anti-pattern 1
<!-- /ANCHOR: rules -->
```

**Deliverable**: Updated `skill_md_template.md` with ≥3 anchor examples

#### Task 1.3: Update skill_reference_template.md (2 hours)
- Add anchor examples for references
- Document multi-anchor patterns (multiple sections in one doc)
- Show cross-reference patterns

**Deliverable**: Updated `skill_reference_template.md` with anchor guidance

#### Task 1.4: Update skill_asset_template.md (2 hours)
- Add anchor examples for assets
- Document when assets need anchors vs when to skip
- Provide checklist and workflow examples

**Deliverable**: Updated `skill_asset_template.md` with anchor guidance

---

### Phase 2: Tooling (Hours 9-20)

**Objective**: Build migration and validation scripts.

#### Task 2.1: Migration Script - Core Logic (4 hours)
**File**: `.opencode/skill/system-spec-kit/scripts/dist/skill/add-anchors-to-skills.py`

**Features**:
- Parse Markdown files, detect major sections (H1, H2)
- Map sections to anchor types (e.g., H2 "WHEN TO USE" → `when-to-use`)
- Insert opening/closing anchor tags
- Preserve original formatting and line breaks

**Algorithm**:
```python
def add_anchors(file_path, anchor_mapping, dry_run=False):
    """
    Add anchors to skill markdown file.
    
    Args:
        file_path: Path to .md file
        anchor_mapping: Dict of section patterns -> anchor names
        dry_run: If True, return changes without writing
    
    Returns:
        List of changes made
    """
    1. Read file content
    2. Parse into sections (H1, H2, content blocks)
    3. For each section:
        a. Match section heading to anchor_mapping
        b. If match found:
            - Insert opening anchor before first content line
            - Insert closing anchor after last content line (before next heading)
    4. If not dry_run: Write modified content
    5. Return change log
```

**Anchor Mapping** (section heading patterns → anchor names):
```python
ANCHOR_MAPPING = {
    # SKILL.md specific
    r"(?i)^##\s*\d*\.?\s*(overview|introduction|purpose)": "summary",
    r"(?i)^##\s*\d*\.?\s*(when to use|activation|triggers?)": "when-to-use",
    r"(?i)^##\s*\d*\.?\s*(how it works|workflow|process)": "how-it-works",
    r"(?i)^##\s*\d*\.?\s*(rules|constraints|requirements)": "rules",
    r"(?i)^##\s*\d*\.?\s*(examples?|usage|demos?)": "examples",
    r"(?i)^##\s*\d*\.?\s*(resources?|bundled|dependencies)": "resources",
    r"(?i)^##\s*\d*\.?\s*(troubleshooting|debugging|issues?)": "troubleshooting",
    
    # Reference docs
    r"(?i)^##\s*\d*\.?\s*(decisions?|rationale|why)": "decisions",
    r"(?i)^##\s*\d*\.?\s*(validation|quality|checks?)": "validation",
}
```

**Deliverable**: Working migration script with dry-run mode

#### Task 2.2: Migration Script - Modes & Safety (3 hours)
- Implement dry-run mode (log changes, no writes)
- Implement interactive mode (confirm per file)
- Implement batch mode (process all with progress)
- Add backup creation (copy originals to backup dir)
- Add rollback function (restore from backup)

**CLI Interface**:
```bash
python3 scripts/dist/skill/add-anchors-to-skills.py \
  --skill-path .opencode/skill/system-spec-kit \
  --mode [dry-run|interactive|batch] \
  --backup-dir backups/20260217_1430 \
  --log-file migration.log \
  --anchor-types summary,rules,examples  # optional filter
```

**Deliverable**: Full-featured migration script with safety features

#### Task 2.3: Validation Script - Format Checking (2 hours)
**File**: `.opencode/skill/system-spec-kit/scripts/dist/skill/validate-skill-anchors.py`

**Validation Checks**:
1. **Format**: Opening/closing tags match, no orphans
2. **Naming**: Anchor names conform to taxonomy
3. **Nesting**: No nested anchors (flat structure only)
4. **Content**: Anchor blocks non-empty (≥1 paragraph)
5. **Uniqueness**: No duplicate anchor names per file

**CLI Interface**:
```bash
python3 scripts/dist/skill/validate-skill-anchors.py \
  --skill-path .opencode/skill/system-spec-kit \
  --json-report validation-report.json \
  --fail-on [error|warning]  # exit code behavior
```

**Output**:
```json
{
  "summary": {
    "total_files": 45,
    "files_with_anchors": 43,
    "total_anchors": 187,
    "errors": 2,
    "warnings": 5
  },
  "files": [
    {
      "path": ".opencode/skill/system-spec-kit/SKILL.md",
      "status": "pass",
      "anchors": ["summary", "when-to-use", "rules"],
      "errors": [],
      "warnings": []
    },
    {
      "path": ".opencode/skill/system-spec-kit/references/memory.md",
      "status": "fail",
      "anchors": ["summary"],
      "errors": ["Orphaned closing tag at line 45"],
      "warnings": ["Low coverage: only 1 anchor"]
    }
  ]
}
```

**Deliverable**: Validation script with JSON output and exit codes

#### Task 2.4: Validation Script - Coverage Checking (2 hours)
- Calculate % of sections anchored per file
- Generate coverage report per skill folder
- Identify missing anchors by section type
- Add coverage targets (80% SKILL.md, 60% references, 40% assets)

**Coverage Report**:
```
Skill: system-spec-kit
  SKILL.md: 85% coverage (6/7 major sections anchored) ✅
  references/: 65% coverage (13/20 files have ≥1 anchor) ✅
  assets/: 30% coverage (3/10 files have ≥1 anchor) ⚠️ 
  Overall: PASS (meets targets)

Missing anchors:
  - SKILL.md: Section "Advanced Usage" (no anchor)
  - references/debugging.md: No anchors (0/4 sections)
  - assets/checklist-template.md: No anchors
```

**Deliverable**: Coverage validation with actionable remediation list

---

### Phase 3: Migration (Hours 21-32)

**Objective**: Apply anchors to all existing skill documentation.

#### Task 3.1: Dry-Run and Review (2 hours)
- Run migration script in dry-run mode on all skills
- Review proposed changes for accuracy
- Identify edge cases requiring manual intervention
- Document findings in migration log

**Command**:
```bash
python3 scripts/dist/skill/add-anchors-to-skills.py \
  --skill-path .opencode/skill \
  --mode dry-run \
  --log-file migration-dryrun.log
```

**Deliverable**: Dry-run log with change proposals for all skills

#### Task 3.2: Backup and Batch Migration (3 hours)
- Create backup directory with timestamp
- Run batch migration on all skills
- Monitor progress and log any errors
- Verify backup creation for all modified files

**Commands**:
```bash
# Create backup
mkdir -p backups/20260217_migration
cp -r .opencode/skill backups/20260217_migration/

# Run batch migration
python3 scripts/dist/skill/add-anchors-to-skills.py \
  --skill-path .opencode/skill \
  --mode batch \
  --backup-dir backups/20260217_migration \
  --log-file migration-batch.log
```

**Deliverable**: All skills migrated with anchors, backups created

#### Task 3.3: Post-Migration Validation (2 hours)
- Run format validation on all migrated files
- Run coverage validation to verify targets met
- Generate JSON report for review
- Fix any validation errors

**Commands**:
```bash
# Format validation
python3 scripts/dist/skill/validate-skill-anchors.py \
  --skill-path .opencode/skill \
  --json-report validation-post-migration.json \
  --fail-on error

# Coverage validation
python3 scripts/dist/skill/validate-skill-anchors.py \
  --skill-path .opencode/skill \
  --check-coverage \
  --json-report coverage-post-migration.json
```

**Deliverable**: Validation reports showing 100% format compliance, ≥80% coverage

#### Task 3.4: Manual Review and Refinement (5 hours)
- Review validation warnings (low coverage, suboptimal anchor placement)
- Manually improve anchor coverage for key skills (system-spec-kit, sk-doc)
- Add anchors to sections missed by automated mapping
- Verify readability of anchored content in isolation

**Focus Skills** (manual improvement):
1. `system-spec-kit` (most critical)
2. `sk-doc` (template source)
3. `sk-code--full-stack` (complex multi-mode)

**Deliverable**: Key skills at ≥90% coverage with high-quality anchor placement

---

### Phase 4: Documentation & Handover (Hours 33-40)

**Objective**: Document the system and enable team to maintain it.

#### Task 4.1: Migration Guide (2 hours)
**File**: `.opencode/specs/03--commands-and-skills/sk-doc/006-anchor-implementation/README.md`

**Contents**:
- Overview of anchor system
- How to use migration script (with examples)
- How to validate anchors
- Rollback procedure
- Troubleshooting common issues

**Deliverable**: Complete migration guide for future use

#### Task 4.2: Update sk-doc Skill (3 hours)
- Add "Anchor Usage Guidelines" section to SKILL.md
- Document anchor taxonomy with examples
- Add validation instructions
- Update quick reference with anchor commands

**Deliverable**: sk-doc skill includes comprehensive anchor guidance

#### Task 4.3: Create Anchor Usage Examples (2 hours)
**File**: `.opencode/specs/03--commands-and-skills/sk-doc/006-anchor-implementation/examples`

**Examples**:
1. `before-after-skill.md` (SKILL.md transformation)
2. `before-after-reference.md` (reference doc transformation)
3. `before-after-asset.md` (asset doc transformation)
4. `troubleshooting-examples.md` (common issues and fixes)

**Deliverable**: 4 example files showing anchor transformations

#### Task 4.4: CI Integration (1 hour)
- Add validation script to pre-commit hook (optional, warning only)
- Document how to integrate validation into CI pipeline
- Create sample GitHub Actions workflow (if applicable)

**Deliverable**: CI integration instructions and sample workflow

---

## 4. DATA STRUCTURES

### Anchor Metadata

```python
@dataclass
class Anchor:
    name: str           # e.g., "summary", "rules"
    start_line: int     # Line number of opening tag
    end_line: int       # Line number of closing tag
    content: str        # Full content between tags
    file_path: str      # Path to source file
    
    def validate(self) -> List[str]:
        """Validate anchor format and content."""
        errors = []
        
        # Check naming convention
        if not re.match(r'^[a-z][a-z0-9-]*$', self.name):
            errors.append(f"Invalid anchor name: {self.name}")
        
        # Check content non-empty
        if not self.content.strip():
            errors.append(f"Empty anchor: {self.name}")
        
        # Check line ordering
        if self.start_line >= self.end_line:
            errors.append(f"Invalid line range: {self.start_line}-{self.end_line}")
        
        return errors
```

### Migration Result

```python
@dataclass
class MigrationResult:
    file_path: str
    success: bool
    anchors_added: List[str]  # List of anchor names added
    errors: List[str]
    warnings: List[str]
    backup_path: Optional[str]
    
    def to_dict(self) -> dict:
        """Convert to JSON-serializable dict."""
        return asdict(self)
```

### Validation Report

```python
@dataclass
class ValidationReport:
    total_files: int
    files_with_anchors: int
    total_anchors: int
    errors: int
    warnings: int
    files: List[FileValidation]
    
    def to_json(self) -> str:
        """Export as JSON report."""
        return json.dumps(asdict(self), indent=2)
    
    def print_summary(self):
        """Print human-readable summary."""
        print(f"Validated {self.total_files} files")
        print(f"  {self.files_with_anchors} have anchors")
        print(f"  {self.total_anchors} total anchors")
        print(f"  {self.errors} errors, {self.warnings} warnings")

@dataclass
class FileValidation:
    path: str
    status: str  # "pass", "warning", "fail"
    anchors: List[str]
    errors: List[str]
    warnings: List[str]
    coverage_percent: float
```

---

## 5. ALGORITHMS

### Anchor Detection Algorithm

```python
def detect_anchor_opportunities(markdown_content: str, file_type: str) -> List[AnchorOpportunity]:
    """
    Analyze Markdown content and identify where anchors should be placed.
    
    Args:
        markdown_content: Raw Markdown text
        file_type: "SKILL.md", "reference", or "asset"
    
    Returns:
        List of anchor opportunities with suggested names and line ranges
    """
    opportunities = []
    lines = markdown_content.split('\n')
    
    # Detect summary (first 1-3 paragraphs after H1)
    h1_index = find_first_heading(lines, level=1)
    if h1_index is not None:
        summary_end = find_first_heading(lines, level=2, start=h1_index+1)
        if summary_end is None:
            summary_end = len(lines)
        
        # Count paragraphs in potential summary
        para_count = count_paragraphs(lines[h1_index+1:summary_end])
        if 1 <= para_count <= 3:
            opportunities.append(AnchorOpportunity(
                name="summary",
                start_line=h1_index + 1,
                end_line=summary_end - 1,
                confidence=0.9
            ))
    
    # Detect section-based anchors
    for i, line in enumerate(lines):
        if is_heading(line, level=2):
            # Extract heading text
            heading_text = extract_heading_text(line)
            
            # Match against anchor mapping
            anchor_name = match_heading_to_anchor(heading_text, file_type)
            if anchor_name:
                # Find section content boundaries
                section_start = i + 1
                section_end = find_next_heading(lines, level=2, start=i+1)
                if section_end is None:
                    section_end = len(lines)
                
                opportunities.append(AnchorOpportunity(
                    name=anchor_name,
                    start_line=section_start,
                    end_line=section_end - 1,
                    confidence=0.8
                ))
    
    return opportunities
```

### Anchor Insertion Algorithm

```python
def insert_anchors(markdown_content: str, opportunities: List[AnchorOpportunity]) -> str:
    """
    Insert anchor tags into Markdown content based on opportunities.
    
    Args:
        markdown_content: Original Markdown text
        opportunities: List of anchor opportunities (sorted by start_line)
    
    Returns:
        Modified Markdown with anchor tags inserted
    """
    lines = markdown_content.split('\n')
    
    # Sort opportunities by start_line in reverse (insert from bottom to top)
    # This prevents line number shifts during insertion
    sorted_opps = sorted(opportunities, key=lambda x: x.start_line, reverse=True)
    
    for opp in sorted_opps:
        # Insert closing tag
        closing_tag = f"<!-- /ANCHOR: {opp.name} -->"
        lines.insert(opp.end_line + 1, closing_tag)
        
        # Insert opening tag
        opening_tag = f"<!-- ANCHOR: {opp.name} -->"
        lines.insert(opp.start_line, opening_tag)
    
    return '\n'.join(lines)
```

### Anchor Validation Algorithm

```python
def validate_anchors(markdown_content: str) -> ValidationResult:
    """
    Validate anchor format and structure in Markdown content.
    
    Args:
        markdown_content: Markdown text with anchors
    
    Returns:
        ValidationResult with errors and warnings
    """
    result = ValidationResult()
    lines = markdown_content.split('\n')
    
    # Track anchor state
    anchor_stack = []  # Stack to detect nesting
    anchor_names_seen = set()  # Set to detect duplicates
    
    for i, line in enumerate(lines, start=1):
        # Check for opening tag
        if match := re.match(r'<!--\s*ANCHOR:\s*([a-z0-9-]+)\s*-->', line):
            anchor_name = match.group(1)
            
            # Check for duplicate
            if anchor_name in anchor_names_seen:
                result.errors.append(f"Line {i}: Duplicate anchor '{anchor_name}'")
            anchor_names_seen.add(anchor_name)
            
            # Check for nesting
            if anchor_stack:
                result.errors.append(f"Line {i}: Nested anchor '{anchor_name}' (inside '{anchor_stack[-1]}')")
            
            # Push to stack
            anchor_stack.append((anchor_name, i))
        
        # Check for closing tag
        elif match := re.match(r'<!--\s*/ANCHOR:\s*([a-z0-9-]+)\s*-->', line):
            anchor_name = match.group(1)
            
            # Check for orphaned closing tag
            if not anchor_stack:
                result.errors.append(f"Line {i}: Orphaned closing tag for '{anchor_name}'")
                continue
            
            # Check for mismatched closing tag
            expected_name, start_line = anchor_stack[-1]
            if anchor_name != expected_name:
                result.errors.append(f"Line {i}: Closing tag '{anchor_name}' does not match opening tag '{expected_name}' at line {start_line}")
            else:
                # Pop from stack
                anchor_stack.pop()
                
                # Check for empty content
                if i - start_line <= 1:
                    result.warnings.append(f"Line {start_line}-{i}: Empty anchor '{anchor_name}'")
    
    # Check for unclosed anchors
    for anchor_name, start_line in anchor_stack:
        result.errors.append(f"Line {start_line}: Unclosed anchor '{anchor_name}'")
    
    return result
```

---

## 6. ERROR HANDLING

### Migration Errors

| Error | Cause | Handling |
|-------|-------|----------|
| **File not found** | Invalid path provided | Log error, skip file, continue |
| **File not writable** | Permission issues | Log error, skip file, continue |
| **Malformed Markdown** | Cannot parse structure | Log warning, attempt best-effort anchor placement |
| **Backup creation failed** | Disk space or permissions | HALT migration, report error |
| **Anchor insertion failed** | Unknown content structure | Log error, skip file, save to manual review list |

### Validation Errors

| Error | Severity | Action |
|-------|----------|--------|
| **Orphaned anchor tags** | Error | Report, fail validation |
| **Mismatched tags** | Error | Report, fail validation |
| **Duplicate anchor names** | Error | Report, fail validation |
| **Nested anchors** | Error | Report, fail validation |
| **Empty anchor content** | Warning | Report, pass validation |
| **Low coverage** | Warning | Report, pass validation |

### Rollback Procedure

```python
def rollback_migration(backup_dir: str, target_dir: str) -> bool:
    """
    Restore original files from backup directory.
    
    Args:
        backup_dir: Directory containing backup files
        target_dir: Directory to restore to (e.g., .opencode/skill)
    
    Returns:
        True if rollback successful, False otherwise
    """
    try:
        # Verify backup exists
        if not os.path.exists(backup_dir):
            raise FileNotFoundError(f"Backup directory not found: {backup_dir}")
        
        # Remove current skill directory
        shutil.rmtree(target_dir)
        
        # Restore from backup
        shutil.copytree(backup_dir, target_dir)
        
        # Verify restoration
        if not os.path.exists(target_dir):
            raise Exception("Rollback failed: target directory not restored")
        
        logger.info(f"Rollback successful: {backup_dir} -> {target_dir}")
        return True
    
    except Exception as e:
        logger.error(f"Rollback failed: {e}")
        return False
```

---

## 7. TESTING STRATEGY

### Unit Tests

**test_anchor_detection.py**:
```python
def test_detect_summary_anchor():
    """Test summary anchor detection after H1."""
    markdown = """
# Skill Name

This is the first paragraph.

This is the second paragraph.

## Section 1
"""
    opportunities = detect_anchor_opportunities(markdown, "SKILL.md")
    assert any(opp.name == "summary" for opp in opportunities)

def test_detect_section_anchor():
    """Test section-based anchor detection."""
    markdown = """
## 1. WHEN TO USE

Use this skill when...
"""
    opportunities = detect_anchor_opportunities(markdown, "SKILL.md")
    assert any(opp.name == "when-to-use" for opp in opportunities)

def test_no_nested_anchors():
    """Test that nested anchors are not generated."""
    # Implementation
```

**test_anchor_validation.py**:
```python
def test_orphaned_closing_tag():
    """Test detection of orphaned closing tag."""
    markdown = """
Content without opening tag.
<!-- /ANCHOR: summary -->
"""
    result = validate_anchors(markdown)
    assert len(result.errors) > 0
    assert "orphaned" in result.errors[0].lower()

def test_mismatched_tags():
    """Test detection of mismatched opening/closing tags."""
    markdown = """
<!-- ANCHOR: summary -->
Content here.
<!-- /ANCHOR: rules -->
"""
    result = validate_anchors(markdown)
    assert any("mismatch" in err.lower() for err in result.errors)
```

### Integration Tests

**test_migration_workflow.py**:
```python
def test_dry_run_no_writes(tmp_path):
    """Test that dry-run mode does not modify files."""
    # Create test skill structure
    skill_dir = tmp_path / "test-skill"
    skill_dir.mkdir()
    skill_file = skill_dir / "SKILL.md"
    skill_file.write_text("# Test Skill\n\nContent here.\n")
    
    # Run dry-run migration
    result = run_migration(skill_dir, mode="dry-run")
    
    # Verify no changes written
    assert skill_file.read_text() == "# Test Skill\n\nContent here.\n"
    assert result.success
    assert len(result.anchors_added) > 0

def test_backup_creation(tmp_path):
    """Test that backups are created before migration."""
    # Create test skill structure
    skill_dir = tmp_path / "test-skill"
    backup_dir = tmp_path / "backup"
    # ... setup ...
    
    # Run migration with backup
    result = run_migration(skill_dir, backup_dir=backup_dir)
    
    # Verify backup exists and matches original
    assert (backup_dir / "test-skill" / "SKILL.md").exists()
    # ... verify content matches ...
```

### End-to-End Tests

**test_full_migration.py**:
```python
def test_migrate_all_skills(tmp_path):
    """Test full migration workflow on all skills."""
    # Copy real skill structure to tmp_path
    # Run migration in batch mode
    # Validate all files pass format validation
    # Verify coverage targets met
```

### Manual Testing Checklist

- [ ] Dry-run on system-spec-kit skill shows correct anchor placements
- [ ] Interactive mode prompts for confirmation per file
- [ ] Batch mode processes all 9 skills without errors
- [ ] Validation script detects orphaned tags
- [ ] Validation script detects mismatched tags
- [ ] Coverage report identifies missing anchors
- [ ] Rollback restores exact original files (verified with diff)
- [ ] Anchored skills load correctly in Markdown viewers
- [ ] Anchored skills render correctly in VS Code, GitHub

---

## 8. DEPLOYMENT PLAN

### Pre-Deployment Checklist

- [ ] All unit tests passing (100% coverage for critical paths)
- [ ] Integration tests passing
- [ ] Manual testing checklist complete
- [ ] Templates reviewed and approved by documentation lead
- [ ] Migration script tested on sample skill with 100% success
- [ ] Validation script tested with known good and bad anchors
- [ ] Rollback procedure tested and verified
- [ ] Backup storage verified (sufficient disk space)
- [ ] Git status clean (no uncommitted changes in .opencode/skill/)

### Deployment Steps

**Step 1: Template Deployment** (Low risk)
- Commit updated templates to Git
- Push to remote repository
- Notify team of new anchor guidelines

**Step 2: Migration Dry-Run** (Validation)
- Run dry-run on all skills
- Review proposed changes
- Identify any edge cases requiring manual intervention
- Document findings in migration log

**Step 3: Backup Creation** (Safety)
- Create timestamped backup directory
- Copy entire `.opencode/skill/` directory to backup
- Verify backup integrity (file count, sizes match)

**Step 4: Batch Migration** (Execution)
- Run batch migration script
- Monitor progress and logs
- Pause if errors exceed threshold (>5% of files)
- Complete migration for all skills

**Step 5: Validation** (Quality Gate)
- Run format validation (must pass with 0 errors)
- Run coverage validation (verify ≥80% SKILL.md, ≥60% references)
- Generate JSON reports
- If validation fails: rollback immediately

**Step 6: Manual Review** (Quality Enhancement)
- Review validation warnings (low coverage files)
- Manually improve key skills (system-spec-kit, sk-doc)
- Re-run validation to verify improvements

**Step 7: Commit and Push** (Finalization)
- Commit all anchor changes to Git with descriptive message
- Push to remote repository
- Create Git tag: `anchor-migration-v1.0`
- Keep backups for 30 days post-deployment

### Rollback Plan

**Trigger Conditions**:
- Validation errors > 5% of files
- Skill loading breaks (functional regression)
- Markdown rendering issues in viewers
- Team requests rollback within 24 hours

**Rollback Steps**:
1. Stop any in-progress migrations
2. Run rollback script: `python3 scripts/rollback-migration.py --backup-dir backups/[timestamp]`
3. Verify rollback with diff: `diff -r backups/[timestamp]/.opencode/skill .opencode/skill`
4. Re-run validation on restored files (should show 0 anchors)
5. Commit rollback: `git commit -m "Rollback anchor migration due to [reason]"`
6. Investigate issues, fix scripts, re-attempt migration

**Rollback SLA**: <1 hour from decision to rollback completion

---

## 9. MONITORING & MAINTENANCE

### Success Metrics

| Metric | Target | Measurement | Frequency |
|--------|--------|-------------|-----------|
| **Format validation pass rate** | 100% | CI validation script | Every commit |
| **Coverage: SKILL.md** | ≥80% | Coverage report | Weekly |
| **Coverage: References** | ≥60% | Coverage report | Weekly |
| **Coverage: Assets** | ≥40% | Coverage report | Weekly |
| **Anchor adoption in new skills** | 100% | Manual review | Monthly |
| **Validation errors** | 0 | CI logs | Every commit |

### Maintenance Procedures

**Monthly Anchor Audit**:
- Run coverage report on all skills
- Identify skills below coverage targets
- Create GitHub issues for low-coverage skills
- Prioritize improvements based on skill usage

**Quarterly Taxonomy Review**:
- Review anchor taxonomy for gaps
- Propose new anchor types if needed
- Update templates with new examples
- Re-migrate skills if taxonomy changes

**On-demand Validation**:
- Developers run validation before committing skill changes
- Pre-commit hook warns if anchors missing (non-blocking)
- CI validates anchors on PR (blocking if format errors)

### Troubleshooting

**Issue: Anchors not rendering correctly**
- **Diagnosis**: Check Markdown viewer supports HTML comments
- **Fix**: Anchors use HTML comment format (should be invisible)
- **Escalation**: If viewer strips comments, switch to metadata blocks

**Issue: Low coverage after migration**
- **Diagnosis**: Automated mapping missed sections
- **Fix**: Manual anchor addition guided by validation report
- **Prevention**: Improve anchor mapping patterns

**Issue: Orphaned anchor tags**
- **Diagnosis**: Manual editing introduced errors
- **Fix**: Run validation script, follow remediation guidance
- **Prevention**: Pre-commit validation hook

---

## 10. RISKS & MITIGATION (TECHNICAL)

### Technical Risk Details

**R1: Anchor syntax breaks Markdown rendering**
- **Technical mitigation**: 
  - Use HTML comment format: `<!-- ANCHOR: name -->` (standard, widely supported)
  - Test in: VS Code, GitHub, GitLab, Markdown lint tools
  - If issues found: Switch to YAML frontmatter blocks (alternative syntax)

**R2: Migration script corrupts files**
- **Technical mitigation**:
  - Atomic writes: Write to temp file, then rename (OS-level atomicity)
  - Checksum verification: Compute hash before/after, rollback if mismatch
  - Git integration: Require clean working directory before migration
  - Dry-run mandatory: Always run dry-run before batch

**R3: Performance impact from large anchor blocks**
- **Technical mitigation**:
  - Content size guidelines: Max 500 lines per anchor
  - Lazy loading: Only parse anchor content when accessed
  - Caching: Cache parsed anchors in memory (LRU eviction)
  - Monitoring: Track skill load times (alert if >10ms increase)

---

## 11. ALTERNATIVE APPROACHES CONSIDERED

### Alternative 1: Metadata Blocks Instead of HTML Comments

**Approach**: Use YAML frontmatter-style blocks within Markdown.

```markdown
---anchor: summary---
Content here.
---/anchor---
```

**Pros**:
- More visible in plain text
- Easier to grep for

**Cons**:
- Not standard Markdown syntax (may break renderers)
- Requires custom parser
- Visually intrusive

**Decision**: Rejected - HTML comments are invisible, standard, widely supported.

---

### Alternative 2: Separate Anchor Metadata Files

**Approach**: Store anchor definitions in separate `.anchor.json` files.

```json
{
  "summary": {
    "start_line": 5,
    "end_line": 10
  },
  "rules": {
    "start_line": 42,
    "end_line": 58
  }
}
```

**Pros**:
- No modification to Markdown files
- Easier to version anchor definitions separately

**Cons**:
- Tight coupling to line numbers (breaks on any edit)
- Two files to maintain per document
- Complex synchronization logic

**Decision**: Rejected - Too fragile, high maintenance burden.

---

### Alternative 3: Section IDs Instead of Anchor Tags

**Approach**: Use Markdown heading IDs as anchors.

```markdown
## When to Use {#when-to-use}
```

**Pros**:
- Native Markdown feature (some parsers support)
- Creates linkable sections

**Cons**:
- Only works for headings (not arbitrary content blocks)
- Not widely supported (GitHub doesn't support)
- Cannot anchor multi-section content

**Decision**: Rejected - Insufficient flexibility, limited support.

---

## 12. FUTURE ENHANCEMENTS

### Phase 2 Enhancements (Post-Launch)

1. **Semantic Skill Search**
   - Query skills by anchor content: "show all validation rules"
   - Build search index from anchored sections
   - Enable natural language queries

2. **Skill Composition**
   - Dynamically compose new skills from anchored sections
   - Mix and match sections from multiple skills
   - Generate temporary skills for specific tasks

3. **Quality Metrics Dashboard**
   - Visualize anchor coverage across all skills
   - Track adoption trends over time
   - Identify documentation gaps

4. **Auto-Generated Skill Catalog**
   - Extract anchored summaries for skill directory
   - Build searchable skill index
   - Generate skill comparison matrices

5. **Anchor-Aware Skill Loader**
   - Load specific anchors on-demand (token optimization)
   - Cache frequently accessed anchors
   - Predictive pre-loading based on task context

---

## 13. GLOSSARY

| Term | Definition |
|------|------------|
| **Anchor** | HTML comment tag pair marking a retrievable section of Markdown content |
| **Anchor taxonomy** | Standardized set of anchor names and their purposes |
| **Coverage** | Percentage of sections in a document that have anchors |
| **Dry-run** | Script execution mode that logs proposed changes without modifying files |
| **Migration** | Process of adding anchors to existing skill documentation |
| **Orphaned tag** | Opening or closing anchor tag without matching counterpart |
| **Skill documentation** | Markdown files in `.opencode/skill/` folders (SKILL.md, references, assets) |
| **Validation** | Process of checking anchor format correctness and coverage |

---

## 14. REFERENCES

### Internal Documents
- Memory ANCHOR format specification (reference: `.opencode/specs/02--system-spec-kit` memory files)
- Skill template documentation (source: `.opencode/skill/sk-doc/assets/opencode/`)
- 5-state memory model (reference: `system-spec-kit` constitutional docs)

### External Standards
- HTML comment syntax: [W3C HTML5 Specification](https://www.w3.org/TR/html5/syntax.html#comments)
- Markdown specification: [CommonMark](https://commonmark.org/)
- Python 3.8+ documentation: [docs.python.org](https://docs.python.org/)

---

## 15. APPENDICES

### Appendix A: Sample Anchor Mapping Configuration

```python
# Complete anchor mapping configuration for migration script
SKILL_MD_ANCHORS = {
    "summary": {
        "patterns": [r"(?i)^##\s*\d*\.?\s*(overview|introduction|purpose)"],
        "placement": "after_h1",  # Special handling for summary
        "max_paragraphs": 3,
        "priority": 1
    },
    "when-to-use": {
        "patterns": [
            r"(?i)^##\s*\d*\.?\s*(when to use|activation|triggers?)",
            r"(?i)^##\s*\d*\.?\s*(use cases?|scenarios?)"
        ],
        "placement": "section",
        "priority": 2
    },
    "how-it-works": {
        "patterns": [
            r"(?i)^##\s*\d*\.?\s*(how it works|workflow|process)",
            r"(?i)^##\s*\d*\.?\s*(mechanics|operation)"
        ],
        "placement": "section",
        "priority": 3
    },
    # ... additional mappings ...
}
```

### Appendix B: Validation Script Output Examples

**Example 1: Clean validation (no errors)**
```
$ python3 validate-skill-anchors.py --skill-path .opencode/skill/system-spec-kit

Validating: .opencode/skill/system-spec-kit
  ✅ SKILL.md (6 anchors, 85% coverage)
  ✅ references/memory.md (3 anchors, 75% coverage)
  ✅ references/debugging.md (2 anchors, 50% coverage)
  ⚠️  assets/checklist.md (0 anchors, 0% coverage)

Summary: 4 files validated
  - 3 pass, 1 warning
  - 11 total anchors
  - Average coverage: 52.5%
  
Exit code: 0 (pass)
```

**Example 2: Validation with errors**
```
$ python3 validate-skill-anchors.py --skill-path .opencode/skill/broken-skill

Validating: .opencode/skill/broken-skill
  ❌ SKILL.md (errors: 2, warnings: 1)
    - Line 45: Orphaned closing tag for 'summary'
    - Line 78: Mismatched closing tag 'rules' (expected 'examples')
    ⚠️ Line 120: Empty anchor 'troubleshooting'

Summary: 1 file validated
  - 0 pass, 1 fail
  - Errors: 2, Warnings: 1
  
Exit code: 2 (fail)
```

---

**Document Status**: Complete  
**Next Steps**: Review technical plan → Approve → Begin Phase 1 implementation  
**Estimated Timeline**: 40 hours (5 days at 8 hours/day)
