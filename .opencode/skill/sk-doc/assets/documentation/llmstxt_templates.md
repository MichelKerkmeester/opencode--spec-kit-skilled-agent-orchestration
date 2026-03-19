---
title: llms.txt Templates
description: Templates and patterns for creating effective llms.txt files that help AI assistants understand projects.
---

# llms.txt Templates - Document Type Reference

Templates for creating llms.txt files that provide AI assistants with project context.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### What Is llms.txt?

**llms.txt** is a standardized markdown file that provides AI assistants with essential project context. It acts as a curated entry point, helping LLMs quickly understand what a project does, how it's organized, and where to find key documentation.

The format follows the [llmstxt.org](https://llmstxt.org/) specification, which defines a standard way for projects to expose their documentation structure to AI tools.

**Core Purpose**:
- **Context loading** - AI assistants read llms.txt first to understand project scope
- **Documentation navigation** - Provides organized links to all important docs
- **Token efficiency** - Curated content reduces irrelevant context
- **Consistency** - Standard format across all projects

**Key Difference from README**:
- llms.txt = Structured index optimized for AI consumption
- README = Human-readable introduction and getting started guide

### Core Characteristics

| Characteristic | Description |
|----------------|-------------|
| **Markdown format** | Human and machine readable |
| **Full URLs only** | Absolute paths for reliable linking |
| **Descriptive links** | Each link explains what the resource contains |
| **Hierarchical organization** | Most important sections first |
| **Project-specific sections** | Adapts to project type (library, CLI, framework, etc.) |

### How AI Assistants Use llms.txt

```
AI receives question about project
         │
         ├─► Checks for llms.txt in project root
         │
         ├─► Reads blockquote → Understands project purpose
         │
         ├─► Scans sections → Identifies relevant documentation
         │
         └─► Follows links → Loads specific docs as needed
```

**Progressive Loading Pattern**:
- **Level 1**: llms.txt header + blockquote (~100 tokens) - Always loaded
- **Level 2**: Section headers + link descriptions (~500 tokens) - Scanned for relevance
- **Level 3**: Linked documents (varies) - Loaded on demand

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:when-to-create-llms-txt -->
## 2. WHEN TO CREATE LLMS.TXT

### Create llms.txt When

**Documentation Complexity**:
- Multiple documentation files exist (3+)
- Documentation spans multiple directories
- Project has distinct documentation types (guides, API, examples)

**AI Interaction Expected**:
- Open source project (contributors use AI tools)
- API/SDK (developers query AI about usage)
- Framework/library (complex enough to need navigation)

**Project Types by Priority**:

| Project Type | Priority | Reason |
|--------------|----------|--------|
| Open source library | **High** | Helps contributors and users understand the codebase |
| CLI tool | **High** | Documents commands, configuration, and usage |
| Framework | **High** | Complex structures benefit most from curated navigation |
| API/Service | **High** | Endpoint documentation, authentication, examples |
| Internal project | **Medium** | Team context, architecture decisions |
| AI agent skill | **Medium** | Skill capabilities, reference materials |
| Simple script | **Low** | README may be sufficient |

### Skip llms.txt When

**Simplicity Indicators**:
- Single-file projects - README covers everything
- Private prototypes - No external consumers
- Documentation doesn't exist - Create docs first, then llms.txt
- README under 200 lines - Not enough content to index

**Size Threshold**: If total documentation is under 500 lines across all files, a well-structured README may be sufficient.

### Decision Framework

```
Does the project have multiple documentation files (3+)?
├─► YES → Create llms.txt
│       │
│       ├─► Is it a library/framework?
│       │   └─► Use comprehensive sections (API REFERENCE, GUIDES, EXAMPLES)
│       │
│       ├─► Is it a CLI tool?
│       │   └─► Emphasize COMMANDS section
│       │
│       └─► Is it an AI skill?
│           └─► Emphasize REFERENCE MATERIALS section
│
└─► NO → Consider README-only approach
        │
        ├─► Will AI tools interact with this project frequently?
        │   └─► Create minimal llms.txt (header + DOCUMENTATION only)
        │
        └─► Internal/simple project with rare AI interaction?
            └─► Skip llms.txt, ensure README is well-structured
```

### llms.txt Types by Project

| Project Type | Required Sections | Optional Sections | Typical Size |
|--------------|-------------------|-------------------|--------------|
| **Library** | DOCUMENTATION, API REFERENCE, EXAMPLES | GUIDES, DEVELOPMENT | 80-150 lines |
| **CLI Tool** | GETTING STARTED, COMMANDS, EXAMPLES | CONFIGURATION, PLUGINS | 60-120 lines |
| **Framework** | DOCUMENTATION, GUIDES, API REFERENCE | INTEGRATIONS, EXAMPLES | 100-200 lines |
| **AI Skill** | DOCUMENTATION, REFERENCE MATERIALS | EXAMPLES, DEVELOPMENT | 40-80 lines |
| **API/Service** | DOCUMENTATION, API REFERENCE, EXAMPLES | GUIDES, INTEGRATIONS | 80-150 lines |

---

<!-- /ANCHOR:when-to-create-llms-txt -->
<!-- ANCHOR:llms-txt-structure -->
## 3. LLMS.TXT STRUCTURE

### Required Components

Every llms.txt file must have:

```markdown
# Project Name

> One-paragraph description explaining what the project does,
> its primary value proposition, and key capabilities.
> Use blockquote format for the description.

Key features:
- Feature 1
- Feature 2
- Feature 3

## DOCUMENTATION

- [Resource Name](https://full-url/path/to/file.md): What this resource contains
```

### Standard Section Order

| Order | Section | Required | Purpose |
|-------|---------|----------|---------|
| 1 | **H1 + Blockquote** | Yes | Project identity and description |
| 2 | **Key Features** | Yes | Bullet list of capabilities |
| 3 | **DOCUMENTATION** | Yes | Core docs (getting started, concepts) |
| 4 | **API REFERENCE** | Conditional | For libraries/frameworks with APIs |
| 5 | **COMMANDS** | Conditional | For CLI tools |
| 6 | **GUIDES** | Recommended | Task-oriented how-to content |
| 7 | **EXAMPLES** | Recommended | Code samples and use cases |
| 8 | **INTEGRATIONS** | Optional | Third-party tool connections |
| 9 | **DEVELOPMENT** | Optional | Contributing, setup, testing |
| 10 | **OPTIONAL** | Optional | Blog, changelog, community |

### URL Format Requirements

| Format | Status | Example |
|--------|--------|---------|
| Full URLs with protocol | ✅ Required | `https://github.com/org/repo/blob/main/docs/guide.md` |
| Relative paths | ❌ Invalid | `../docs/guide.md` |
| Root-relative paths | ❌ Invalid | `/docs/guide.md` |
| URLs without protocol | ❌ Invalid | `github.com/org/repo/docs/guide.md` |

### Link Format

Each link must include a description:

```markdown
✅ CORRECT:
- [Installation Guide](https://...): Step-by-step setup for all platforms

❌ INCORRECT:
- [Installation Guide](https://...)
- [Guide](https://...): Setup
```

---

<!-- /ANCHOR:llms-txt-structure -->
<!-- ANCHOR:writing-process -->
## 4. WRITING PROCESS

### Step 1: Gather Documentation Inventory

List all existing documentation files:
- README.md
- CONTRIBUTING.md
- API documentation
- Guides and tutorials
- Example files
- Configuration references

### Step 2: Categorize by Purpose

Group documents into logical sections:
- **Getting Started** → DOCUMENTATION
- **Reference docs** → API REFERENCE
- **How-to guides** → GUIDES
- **Code samples** → EXAMPLES
- **Setup/contribution** → DEVELOPMENT

### Step 3: Prioritize by User Journey

Order sections by typical user flow:
1. What is this? (blockquote)
2. How do I start? (Documentation)
3. What can I do? (API/Commands)
4. Show me examples (Examples)
5. How do I contribute? (Development)

### Step 4: Write Descriptive Links

For each link, answer: "What will the reader learn from this resource?"

| Bad Description | Good Description |
|-----------------|------------------|
| "Guide" | "Step-by-step authentication setup with OAuth2 examples" |
| "API" | "Complete REST API reference with request/response schemas" |
| "Config" | "All configuration options with default values and examples" |

### Step 5: Validate URLs

- Verify all URLs are accessible
- Prefer `.md` files over `.html` when both exist
- Use permalink formats when available (e.g., `/blob/main/` not `/blob/v1.0.0/`)

---

<!-- /ANCHOR:writing-process -->
<!-- ANCHOR:section-guidelines -->
## 5. SECTION GUIDELINES

### Opening Section (Required)

```markdown
# Project Name

> Project description in blockquote format. Keep to 2-4 sentences.
> Explain what it does, who it's for, and its main value proposition.

Key features/principles:
- First important capability
- Second important capability
- Third important capability
```

### DOCUMENTATION Section

Contains essential getting-started and conceptual content:

```markdown
## DOCUMENTATION

- [Quick Start Guide](url): Get up and running in 5 minutes
- [Core Concepts](url): Understanding [key concepts] and how they work
- [Configuration Guide](url): All configuration options explained
```

### API REFERENCE Section (Libraries/Frameworks)

```markdown
## API REFERENCE

- [Module Name](url): Purpose and key methods
- [Another Module](url): Purpose and key methods
```

### COMMANDS Section (CLI Tools)

```markdown
## COMMANDS

- [command-name](url): What this command does
- [All Commands](url): Complete command reference
```

### EXAMPLES Section

Organize from simple to complex:

```markdown
## EXAMPLES

- [Basic Usage](url): Simple examples for common tasks
- [Common Patterns](url): Frequently used patterns
- [Advanced Usage](url): Complex scenarios and edge cases
```

### OPTIONAL Section

Secondary resources that aren't essential:

```markdown
## OPTIONAL

- [Blog](url): Tutorials and announcements
- [Changelog](url): Version history and release notes
- [Community](url): Discord, GitHub discussions
```

---

<!-- /ANCHOR:section-guidelines -->
<!-- ANCHOR:url-and-link-patterns -->
## 6. URL AND LINK PATTERNS

### GitHub URL Patterns

| Use Case | Pattern |
|----------|---------|
| File in repo | `https://github.com/org/repo/blob/main/path/file.md` |
| Directory | `https://github.com/org/repo/tree/main/path/` |
| README in directory | `https://github.com/org/repo/blob/main/path/README.md` |

### Documentation Site Patterns

| Use Case | Pattern |
|----------|---------|
| Hosted docs | `https://projectname.dev/docs/guide.md` |
| Versioned docs | `https://projectname.dev/docs/latest/guide.md` |

### Markdown Preference

When both exist, prefer markdown over rendered HTML:

```markdown
✅ PREFER:
- [Guide](https://github.com/org/repo/blob/main/docs/guide.md)

⚠️ ACCEPTABLE (if no .md available):
- [Guide](https://projectname.dev/docs/guide.html)
```

---

<!-- /ANCHOR:url-and-link-patterns -->
<!-- ANCHOR:project-type-variations -->
## 7. PROJECT TYPE VARIATIONS

### Libraries/Packages

**Emphasis:** API Reference, Examples
**Key Sections:**
- DOCUMENTATION (concepts, getting started)
- API REFERENCE (module documentation)
- EXAMPLES (usage patterns)
- DEVELOPMENT (contributing)

### CLI Tools

**Emphasis:** Commands, Configuration
**Key Sections:**
- GETTING STARTED (installation, quickstart)
- COMMANDS (individual command docs)
- CONFIGURATION (config files, env vars)
- EXAMPLES (common workflows)

### Web Frameworks

**Emphasis:** Guides, Integrations
**Key Sections:**
- DOCUMENTATION (routing, data, rendering)
- GUIDES (auth, deployment, testing)
- API REFERENCE (config, CLI, components)
- INTEGRATIONS (databases, CSS, CMS)

### AI Agent Skills

**Emphasis:** Reference Materials, Capabilities
**Key Sections:**
- DOCUMENTATION (README, SKILL.md)
- REFERENCE MATERIALS (patterns, standards)
- EXAMPLES (before/after, use cases)
- DEVELOPMENT (scripts, tools)

---

<!-- /ANCHOR:project-type-variations -->
<!-- ANCHOR:anti-patterns-to-avoid -->
## 8. ANTI-PATTERNS TO AVOID

### Too Granular

```markdown
❌ DON'T:
## INSTALLATION
- [macOS Install](url)
- [Linux Install](url)
- [Windows Install](url)
- [Docker Install](url)

✅ DO:
## DOCUMENTATION
- [Installation](url): Installing on macOS, Linux, Windows, and Docker
```

### Missing Descriptions

```markdown
❌ DON'T:
- [Guide](url)
- [Docs](url)
- [API](url)

✅ DO:
- [Quick Start Guide](url): Get up and running in 5 minutes
- [Core Documentation](url): Architecture and key concepts
- [API Reference](url): Complete method documentation
```

### Relative URLs

```markdown
❌ DON'T:
- [Guide](../docs/guide.md)
- [Guide](/docs/guide.md)

✅ DO:
- [Guide](https://github.com/org/repo/blob/main/docs/guide.md)
```

### Version-Locked URLs

```markdown
❌ DON'T:
- [Guide](https://example.com/v1.0.0/docs/guide.md)

✅ DO:
- [Guide](https://example.com/docs/guide.md)
- [Guide](https://example.com/latest/docs/guide.md)
```

### Content Dumping

Don't paste entire documentation into llms.txt. Link to it instead.

```markdown
❌ DON'T:
## API REFERENCE
The DataStream class provides methods for...
[200 lines of documentation]

✅ DO:
## API REFERENCE
- [DataStream API](url): Stream creation and manipulation methods
```

---

<!-- /ANCHOR:anti-patterns-to-avoid -->
<!-- ANCHOR:llms-txt-checklist -->
## 9. LLMS.TXT CHECKLIST

Before publishing, verify:

### Structure
- [ ] H1 with project name (no emoji)
- [ ] Blockquote description (2-4 sentences)
- [ ] Key features bullet list (3-6 items)
- [ ] At least DOCUMENTATION section present

### Links
- [ ] All URLs are absolute (include protocol)
- [ ] All URLs are accessible (no 404s)
- [ ] All links have descriptions after colon
- [ ] Descriptions explain what reader will learn

### Content
- [ ] Sections ordered by user journey priority
- [ ] No duplicate links
- [ ] No outdated/deprecated resources
- [ ] Prefer .md files over .html when both exist

### Project-Specific
- [ ] Libraries: API REFERENCE section present
- [ ] CLI tools: COMMANDS section present
- [ ] Frameworks: GUIDES and INTEGRATIONS considered

---

<!-- /ANCHOR:llms-txt-checklist -->
<!-- ANCHOR:decision-tree-section-selection -->
## 10. DECISION TREE: SECTION SELECTION

### For Libraries/Packages
- **Must have**: DOCUMENTATION, API REFERENCE, EXAMPLES
- **Should have**: GETTING STARTED, DEVELOPMENT
- **Nice to have**: GUIDES, INTEGRATIONS, OPTIONAL

### For CLI Tools
- **Must have**: GETTING STARTED, COMMANDS, EXAMPLES
- **Should have**: CONFIGURATION, DEVELOPMENT
- **Nice to have**: PLUGINS, TROUBLESHOOTING, OPTIONAL

### For Frameworks
- **Must have**: DOCUMENTATION, GUIDES, API REFERENCE, EXAMPLES
- **Should have**: INTEGRATIONS, GETTING STARTED
- **Nice to have**: SHOWCASE, OPTIONAL

### For Skills/Plugins
- **Must have**: DOCUMENTATION, REFERENCE MATERIALS
- **Should have**: EXAMPLES, DEVELOPMENT
- **Nice to have**: OPTIONAL (external resources)

---

<!-- /ANCHOR:decision-tree-section-selection -->
<!-- ANCHOR:best-practices-summary -->
## 11. BEST PRACTICES SUMMARY

### DO

| Practice | Reason |
|----------|--------|
| Use full URLs with protocol | Ensures links work in any context |
| Write descriptive link text | Helps AI understand resource purpose |
| Order sections by priority | Most important info first |
| Keep blockquote concise | 2-4 sentences maximum |
| Prefer .md over .html | Better for AI parsing |
| Use consistent capitalization | ALL-CAPS for section headers |

### DON'T

| Anti-Pattern | Problem |
|--------------|---------|
| Relative URLs | Break when file is accessed differently |
| Links without descriptions | AI can't determine relevance |
| Too many sections | Dilutes important information |
| Version-locked URLs | Become outdated |
| Duplicate links | Waste tokens |
| Content dumping | llms.txt should link, not contain |

---

<!-- /ANCHOR:best-practices-summary -->
<!-- ANCHOR:complete-examples -->
## 12. COMPLETE EXAMPLES

### Example 1: Python Library (Data Processing)

#### Project Context
A Python library called "DataFlow" for stream data processing with multiple output formats.

#### Generated llms.txt

```markdown
# DataFlow

> DataFlow is a Python library for processing data streams with real-time transformations
> and multiple output formats. It provides efficient stream processing with lazy evaluation
> and built-in error handling.

Key features:
- Fast stream processing with lazy evaluation
- Support for CSV, JSON, Parquet, and custom formats
- Built-in error handling and recovery
- Zero-dependency core library
- Extensible plugin system

## DOCUMENTATION

- [Quick Start Guide](https://github.com/example/dataflow/blob/main/docs/quickstart.md): Get up and running in 5 minutes
- [Core Concepts](https://github.com/example/dataflow/blob/main/docs/concepts.md): Understanding streams, transformations, and processing
- [Configuration Guide](https://github.com/example/dataflow/blob/main/docs/configuration.md): All configuration options explained

## API REFERENCE

- [Stream API](https://github.com/example/dataflow/blob/main/docs/api/stream.md): Stream creation and manipulation methods
- [Transformations](https://github.com/example/dataflow/blob/main/docs/api/transforms.md): Built-in transformation functions
- [Exports](https://github.com/example/dataflow/blob/main/docs/api/exports.md): Output format specifications

## EXAMPLES

- [Basic Usage](https://github.com/example/dataflow/blob/main/examples/basic.md): Simple stream processing examples
- [Common Patterns](https://github.com/example/dataflow/blob/main/examples/patterns.md): Filtering, mapping, and aggregation
- [Error Handling](https://github.com/example/dataflow/blob/main/examples/errors.md): Handling failures and recovery
- [Advanced Usage](https://github.com/example/dataflow/blob/main/examples/advanced.md): Parallel processing and custom plugins

## DEVELOPMENT

- [Contributing Guide](https://github.com/example/dataflow/blob/main/CONTRIBUTING.md): How to contribute to DataFlow
- [Development Setup](https://github.com/example/dataflow/blob/main/docs/development.md): Setting up local development environment
- [Testing](https://github.com/example/dataflow/blob/main/docs/testing.md): Running and writing tests

## OPTIONAL

- [DataFlow Blog](https://dataflow.example.com/blog/): Latest updates and tutorials
- [Changelog](https://github.com/example/dataflow/blob/main/CHANGELOG.md): Version history and release notes
- [Performance Benchmarks](https://github.com/example/dataflow/blob/main/docs/performance.md): Benchmark results and optimization tips
```

#### Why This Structure?

- **Blockquote**: Clearly explains what DataFlow is and its main value proposition
- **Key Features**: Bullet list highlights important capabilities
- **Documentation**: Essential guides for getting started and understanding core concepts
- **API Reference**: Organized by major components (Stream, Transformations, Exports)
- **Examples**: Progressive from basic to advanced, includes error handling
- **Development**: Resources for contributors
- **Optional**: Secondary resources like blog and benchmarks

---

### Example 2: CLI Tool (Developer Tool)

#### Project Context
A command-line tool called "BuildKit" for managing build processes and deployment pipelines.

#### Generated llms.txt

```markdown
# BuildKit

> BuildKit is a CLI tool for managing build processes, running tests, and deploying
> applications across multiple environments. It provides a unified interface for common
> development workflows.

BuildKit follows these principles:
- Convention over configuration
- Fast feedback loops
- Environment parity
- Reproducible builds

## GETTING STARTED

- [Installation](https://buildkit.dev/docs/install.md): Installing BuildKit on macOS, Linux, and Windows
- [Quick Start](https://buildkit.dev/docs/quickstart.md): Your first BuildKit project in 5 minutes
- [Core Concepts](https://buildkit.dev/docs/concepts.md): Understanding tasks, pipelines, and environments

## COMMANDS

- [build](https://buildkit.dev/docs/commands/build.md): Build your project with automatic dependency detection
- [test](https://buildkit.dev/docs/commands/test.md): Run tests with parallel execution
- [deploy](https://buildkit.dev/docs/commands/deploy.md): Deploy to staging or production
- [watch](https://buildkit.dev/docs/commands/watch.md): Watch for changes and rebuild automatically
- [All Commands](https://buildkit.dev/docs/commands/): Complete command reference

## CONFIGURATION

- [buildkit.yml](https://buildkit.dev/docs/config.md): Configuration file reference
- [Environment Variables](https://buildkit.dev/docs/env.md): Environment-specific configuration
- [Plugins](https://buildkit.dev/docs/plugins.md): Extending BuildKit with custom plugins

## EXAMPLES

- [Node.js Projects](https://buildkit.dev/examples/nodejs.md): Building and deploying Node.js apps
- [Python Projects](https://buildkit.dev/examples/python.md): Python application workflows
- [Monorepos](https://buildkit.dev/examples/monorepo.md): Managing multiple packages
- [CI/CD Integration](https://buildkit.dev/examples/ci.md): Using BuildKit in CI/CD pipelines

## OPTIONAL

- [BuildKit Blog](https://buildkit.dev/blog/): Tutorials and case studies
- [Plugin Directory](https://buildkit.dev/plugins/): Community plugins
- [Troubleshooting](https://buildkit.dev/docs/troubleshooting.md): Common issues and solutions
```

#### Why This Structure?

- **Principles**: Shows design philosophy upfront
- **Getting Started**: Installation and quickstart are priority for CLI tools
- **Commands**: Individual command documentation (most important for CLI tools)
- **Configuration**: Clear section for config files and customization
- **Examples**: Language/framework-specific guides
- **Optional**: Community resources and troubleshooting

---

### Example 3: Web Framework

#### Project Context
A web framework called "FastWeb" for building modern web applications.

#### Generated llms.txt

```markdown
# FastWeb

> FastWeb is a modern web framework for building full-stack applications with Python.
> It provides server-side rendering, API routes, and built-in database support with
> zero configuration required.

FastWeb features:
- File-based routing with automatic code splitting
- Server-side rendering (SSR) and static site generation (SSG)
- Built-in API routes and middleware
- Real-time capabilities with WebSockets
- TypeScript-first with excellent type inference

## DOCUMENTATION

- [Getting Started](https://fastweb.dev/docs/getting-started.md): Create your first FastWeb app
- [Routing](https://fastweb.dev/docs/routing.md): File-based routing and dynamic routes
- [Data Fetching](https://fastweb.dev/docs/data.md): Loading data on server and client
- [Rendering](https://fastweb.dev/docs/rendering.md): SSR, SSG, and client-side rendering
- [API Routes](https://fastweb.dev/docs/api.md): Building REST and GraphQL APIs

## GUIDES

- [Authentication](https://fastweb.dev/guides/auth.md): User authentication and authorization
- [Database Integration](https://fastweb.dev/guides/database.md): Working with databases
- [Deployment](https://fastweb.dev/guides/deployment.md): Deploying to production
- [Testing](https://fastweb.dev/guides/testing.md): Unit and integration testing
- [Performance](https://fastweb.dev/guides/performance.md): Optimization best practices

## API REFERENCE

- [Configuration](https://fastweb.dev/api/config.md): fastweb.config.js options
- [CLI](https://fastweb.dev/api/cli.md): Command-line interface reference
- [Components](https://fastweb.dev/api/components.md): Built-in components
- [Hooks](https://fastweb.dev/api/hooks.md): React-style hooks API
- [Utilities](https://fastweb.dev/api/utils.md): Helper functions and utilities

## EXAMPLES

- [Blog](https://fastweb.dev/examples/blog.md): Building a blog with markdown
- [E-commerce](https://fastweb.dev/examples/ecommerce.md): Product catalog and checkout
- [Dashboard](https://fastweb.dev/examples/dashboard.md): Admin dashboard with charts
- [Real-time Chat](https://fastweb.dev/examples/chat.md): WebSocket-based chat app

## INTEGRATIONS

- [Databases](https://fastweb.dev/integrations/databases.md): PostgreSQL, MySQL, MongoDB
- [CSS Frameworks](https://fastweb.dev/integrations/css.md): Tailwind, Bootstrap, etc.
- [Analytics](https://fastweb.dev/integrations/analytics.md): Google Analytics, Plausible
- [CMS](https://fastweb.dev/integrations/cms.md): Headless CMS integrations

## OPTIONAL

- [FastWeb Blog](https://fastweb.dev/blog/): Tutorials and announcements
- [Showcase](https://fastweb.dev/showcase/): Sites built with FastWeb
- [Community](https://fastweb.dev/community/): Discord, GitHub discussions
- [Changelog](https://fastweb.dev/changelog/): Version history
```

#### Why This Structure?

- **Framework Features**: Lists core capabilities upfront
- **Documentation**: Core framework concepts and features
- **Guides**: Task-oriented how-to guides (authentication, deployment, etc.)
- **API Reference**: Technical reference for configuration and APIs
- **Examples**: Complete application examples
- **Integrations**: Third-party tool integration guides
- **Optional**: Community and showcase resources

---

### Example 4: AI Agent Skill

#### Project Context
An AI agent skill for optimizing documentation (this project!).

#### Generated llms.txt

```markdown
# doc-optimizer

> An AI agent skill that improves project documentation and README files for AI-assisted coding tools.
> Also generates llms.txt files for projects.

The skill provides:
- Documentation analysis and quality assessment
- Question-driven content restructuring
- Code snippet enhancement with context
- llms.txt file generation
- Python analysis script for automated scanning

## DOCUMENTATION

- [README](https://github.com/example/doc-optimizer/blob/main/README.md): Overview, installation, and usage
- [Skill Definition](https://github.com/example/doc-optimizer/blob/main/SKILL.md): Complete skill workflow and instructions
- [Changelog](https://github.com/example/doc-optimizer/blob/main/CHANGELOG.md): Version history and updates

## REFERENCE MATERIALS

- [Optimization Guide](https://github.com/example/doc-optimizer/blob/main/references/document-quality/optimization.md): Transformation patterns
- [Validation Guide](https://github.com/example/doc-optimizer/blob/main/references/document-quality/validation.md): Structure checks and quality gates
- [Core Standards](https://github.com/example/doc-optimizer/blob/main/references/document-quality/core_standards.md): Document types and structural rules

## EXAMPLES

- [README Optimization](https://github.com/example/doc-optimizer/blob/main/examples/sample_readme.md): Before/after documentation transformation
- [llms.txt Generation](https://github.com/example/doc-optimizer/blob/main/examples/sample_llmstxt.md): Generated llms.txt examples

## DEVELOPMENT

- [Structure Extraction](https://github.com/example/doc-optimizer/blob/main/scripts/extract_structure.py): Python tool for document parsing
- [Contributing](https://github.com/example/doc-optimizer/blob/main/CONTRIBUTING.md): How to contribute improvements

## OPTIONAL

- [Context7](https://context7.ai/): External docs benchmark/reference site
- [llmstxt.org](https://llmstxt.org/): Official llms.txt specification
- [OpenCode Docs](https://opencode.ai/docs): OpenCode documentation
```

#### Why This Structure?

- **Skill Capabilities**: Clear explanation of what the skill does
- **Documentation**: Essential files (README, SKILL.md, CHANGELOG)
- **Reference Materials**: Detailed specifications and patterns
- **Examples**: Practical before/after demonstrations
- **Development**: Tools and contribution guides
- **Optional**: External resources and official documentation

---

<!-- /ANCHOR:complete-examples -->
<!-- ANCHOR:common-customizations -->
## 13. COMMON CUSTOMIZATIONS

### Open Source Project

Add to OPTIONAL:
- Contributing guide
- Code of conduct
- Governance
- Roadmap

### Commercial Product

Add sections:
- Pricing/Plans
- Support
- Enterprise features
- Migration guides

### Educational Resource

Add sections:
- Tutorials
- Video courses
- Exercises
- Certification

### Research Project

Add sections:
- Papers
- Datasets
- Experiments
- Citations

---

<!-- /ANCHOR:common-customizations -->
<!-- ANCHOR:related-resources -->
## 14. RELATED RESOURCES

### Templates
- [frontmatter_templates.md](./frontmatter_templates.md) - Frontmatter by document type
- [skill_md_template.md](../opencode/skill_md_template.md) - SKILL.md file templates

### Standards
- [core_standards.md](../../references/global/core_standards.md) - Document type rules

### External
- [llmstxt.org](https://llmstxt.org/) - Official specification

---

Use these templates and patterns when generating llms.txt files for different project types!
<!-- /ANCHOR:related-resources -->
