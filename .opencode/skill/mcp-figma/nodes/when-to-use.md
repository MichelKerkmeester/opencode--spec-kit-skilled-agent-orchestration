---
description: "Activation triggers, use cases, and when NOT to use the Figma MCP skill."
---
# When To Use

Identifies when to invoke Figma MCP and when to use other tools instead.

## Activation Triggers

**Use when**:
- Retrieving Figma design file structure or content
- Exporting design elements as images (PNG, SVG, PDF)
- Extracting components for design system documentation
- Getting design tokens (colors, typography, effects)
- Managing team projects and files
- Reading or posting design review comments

**Keyword Triggers**:
- Files: "figma file", "design file", "get design", "figma document"
- Images: "export image", "export png", "export svg", "render node"
- Components: "figma components", "design system", "component library"
- Styles: "design tokens", "figma styles", "colors", "typography"
- Teams: "team projects", "project files", "figma team"
- Comments: "design comments", "review comments", "figma feedback"

## Use Cases

### Design File Access
- Get complete Figma file structure
- Retrieve specific nodes by ID
- Access file version history
- Navigate page and frame hierarchy

### Asset Export
- Export nodes as PNG, JPG, SVG, or PDF
- Control scale factor (0.01-4x)
- Get URLs for embedded images
- Batch export multiple nodes

### Design System Documentation
- List all components in a file
- Extract component metadata
- Get team-wide component libraries
- Document component sets

### Design Token Extraction
- Get color styles (fills)
- Get typography styles (text)
- Get effect styles (shadows, blurs)
- Get grid styles

### Collaboration
- Read comments on designs
- Post review feedback
- Reply to existing comments
- Delete comments

## When NOT to Use

**Do not use for**:
- Creating or editing Figma designs -- Use Figma directly
- Real-time collaboration -- Use Figma's native features
- File storage/backup -- Use Figma's version history
- Design prototyping -- Use Figma's prototyping tools

## Cross References
- [[how-it-works]] —Core workflow for invoking Figma tools
- [[rules]] —Mandatory rules when using this skill
