# Validation - Quality Assessment

Comprehensive reference for quality assessment and validation of markdown documentation using script-assisted AI analysis. This document covers the validation framework, quality metrics, and best practices for ensuring documentation meets production standards.

---

## 1. INTRODUCTION

This section explains validation and quality assessment for documentation.

Validation provides a comprehensive quality assessment framework for markdown documentation. The framework uses script-assisted AI analysis to evaluate documents across three dimensions: structure, content, and style.

### Purpose

The validation system serves several important purposes:

- **Quality assurance**: Ensures documentation meets minimum standards before publication
- **Consistency**: Enforces uniform structure and style across all documents
- **AI-friendliness**: Optimizes documents for consumption by AI assistants
- **Maintainability**: Creates documentation that is easy to update and extend

### How It Works

The validation process follows these steps:

1. Document is parsed by `extract_structure.py`
2. Structural elements are extracted (headings, code blocks, tables)
3. Metrics are calculated (word count, heading density)
4. Type-specific checklist is run
5. DQI score is computed from all factors

---

## 2. QUALITY METRICS

Detailed information about validation processes and quality metrics.

The Document Quality Index (DQI) is calculated from three components:

### Structure Score (40 points)

Based on checklist pass rate. Each document type has specific requirements:

| Document Type | Key Requirements |
|---------------|------------------|
| Skill | Frontmatter, WHEN TO USE, HOW IT WORKS, RULES sections |
| Reference | H1, intro paragraph, numbered H2s, substantial content |
| Asset | H1 without emoji, intro, code examples |
| Template | Flexible structure, allows placeholders |

### Content Score (30 points)

Measures document substance:

- **Word count** (10 pts): Within expected range for document type
- **Heading density** (8 pts): Appropriate number of H2s per 500 words
- **Code examples** (6 pts): Presence of code blocks with language tags
- **Structure elements** (3 pts): Tables and lists
- **Links** (3 pts): Internal and external references

### Style Score (30 points)

Evaluates formatting consistency:

- **H2 formatting** (12 pts): Number + emoji + ALL CAPS
- **Section dividers** (6 pts): Horizontal rules between sections
- **Style issues** (8 pts): Penalty for formatting problems
- **Intro paragraph** (4 pts): Brief introduction after H1

---

## 3. CODE EXAMPLES

Here are examples of validation in practice:

```javascript
// Running validation from JavaScript
function validateDocument(filepath) {
  const result = extractStructure(filepath);
  console.log(`DQI Score: ${result.dqi.total}/100`);
  return result.dqi.band === 'excellent';
}
```

Code block with proper language identifier above.

```python
# Running validation from Python
def validate_document(filepath):
    result = extract_structure(filepath)
    print(f"DQI Score: {result['dqi']['total']}/100")
    return result['dqi']['band'] == 'excellent'
```

```bash
# Running validation from command line
python3 extract_structure.py document.md | jq '.dqi'
```

Multiple code examples demonstrate language tag usage.

---

## 4. TROUBLESHOOTING

Common issues and their solutions:

### Missing Frontmatter

**Symptom**: Checklist fails "Has YAML frontmatter" check

**Solution**: Add YAML frontmatter at the top of the document:

```yaml
---
name: document-name
description: Brief description of the document
version: 1.0.0
---
```

### Broken H2 Format

**Symptom**: Style issues report "h2_missing_number" or "h2_missing_emoji"

**Solution**: Use the correct format: `## N. EMOJI TITLE`

- Wrong: `## Introduction`
- Wrong: `## 1. Introduction`
- Correct: `## 1. 📖 INTRODUCTION`

### No Language Tag

**Symptom**: Content issues report "code_block_no_language"

**Solution**: Add language identifier after opening backticks:

- Wrong: triple backticks alone
- Correct: triple backticks followed by `python`, `javascript`, `yaml`, etc.

### Low Word Count

**Symptom**: Checklist fails "Has substantial content" check

**Solution**: Expand sections with more detailed explanations, examples, and context. Each section should provide meaningful value to readers.

---

## 5. REFERENCES

Related documentation and resources:

- [Core Standards](./core_standards.md) - Fundamental documentation standards
- [Optimization Guide](./optimization.md) - Improving document quality
- [Workflows](./workflows.md) - Document creation workflows

This file demonstrates a properly formatted reference with:

1. Clean H1 (no emoji)
2. All H2s have number + emoji + title
3. Code blocks have language tags
4. No placeholders
5. Sequential section numbering (1-5)
6. Proper table formatting
7. Substantial content (>200 words)
