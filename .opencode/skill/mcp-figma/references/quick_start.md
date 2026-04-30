---
title: Quick Start - Figma MCP
description: Get started with Figma MCP in 5 minutes covering prerequisites, verification, and first commands.
---

# Quick Start - Figma MCP

Get started with Figma MCP in 5 minutes covering prerequisites and first commands.

---

## 1. OVERVIEW

### Two Options Available

| Option | Name | Auth | Install |
|--------|------|------|---------|
| **A (Recommended)** | Official Figma MCP | OAuth (browser) | None - HTTP endpoint |
| **B** | Framelink (3rd-party) | API Key (`figd_*`) | npm package |

### Prerequisites

#### Option A: Official Figma MCP (Recommended)

| Component | Purpose | Verification |
|-----------|---------|--------------|
| Code Mode MCP | Tool orchestration | `search_tools()` returns results |
| Figma account | OAuth login | Browser login when prompted |

#### Option B: Framelink (3rd-party)

| Component | Purpose | Verification |
|-----------|---------|--------------|
| Code Mode MCP | Tool orchestration | `search_tools()` returns results |
| Figma PAT | API authentication | Token starts with `figd_` |
| .utcp_config.json | Figma MCP config | Contains `"figma"` entry |

#### Configuration Location

```
project/
├── .utcp_config.json    # Figma MCP configuration
├── .env                  # FIGMA_API_KEY (Option B only)
└── opencode.json        # Code Mode configuration
```

---

## 2. VERIFICATION

### Step 1: Verify Code Mode

```typescript
// Check Code Mode is working
search_tools({ task_description: "figma", limit: 5 });

// Expected: List of figma.figma_* tools
```

### Step 2: Check Figma Tools Available

```typescript
call_tool_chain({
  code: `
    const tools = await list_tools();
    const figmaTools = tools.tools.filter(t => t.includes('figma'));
    console.log('Figma tools:', figmaTools.length);
    return figmaTools;
  `
});

// Expected: 18 Figma tools
```

### Step 3: Verify API Key

```typescript
call_tool_chain({
  code: `
    const status = await figma.figma_check_api_key({});
    console.log('API Key configured:', status);
    return status;
  `
});

// Expected: Confirmation that key is set
```

---

## 3. FIRST COMMANDS

### Get a Figma File

```typescript
call_tool_chain({
  code: `
    const file = await figma.figma_get_file({
      fileKey: "YOUR_FILE_KEY"  // From Figma URL
    });
    
    console.log('File:', file.name);
    console.log('Pages:', file.document.children.length);
    
    return {
      name: file.name,
      pages: file.document.children.map(p => p.name)
    };
  `
});
```

**Finding your file key**:
```
https://www.figma.com/file/ABC123xyz/My-Design
                           └─────────┘
                           This is fileKey
```

### Export as Image

```typescript
call_tool_chain({
  code: `
    const images = await figma.figma_get_image({
      fileKey: "YOUR_FILE_KEY",
      ids: ["1:2"],           // Node ID from Figma
      format: "png",
      scale: 2
    });
    
    console.log('Image URLs:', images.images);
    return images;
  `
});
```

### Get Components

```typescript
call_tool_chain({
  code: `
    const components = await figma.figma_get_file_components({
      fileKey: "YOUR_FILE_KEY"
    });
    
    const list = Object.values(components.meta.components);
    console.log('Components found:', list.length);
    
    return list.map(c => c.name);
  `
});
```

### Get Styles (Design Tokens)

```typescript
call_tool_chain({
  code: `
    const styles = await figma.figma_get_file_styles({
      fileKey: "YOUR_FILE_KEY"
    });
    
    const list = Object.values(styles.meta.styles);
    console.log('Styles found:', list.length);
    
    // Group by type
    const grouped = {};
    list.forEach(s => {
      if (!grouped[s.style_type]) grouped[s.style_type] = [];
      grouped[s.style_type].push(s.name);
    });
    
    return grouped;
  `
});
```

---

## 4. COMMON WORKFLOWS

### Design File Access

```
1. get_file        → Get complete file structure
2. get_file_nodes  → Get specific nodes by ID
```

### Asset Export

```
1. get_file_components → List components
2. get_image           → Export as PNG/SVG
```

### Design Token Extraction

```
1. get_file_styles → Get all styles
2. Group by type   → FILL, TEXT, EFFECT, GRID
```

### Team Navigation

```
1. get_team_projects → List projects
2. get_project_files → List files in project
3. get_file          → Access specific file
```

---

## 5. TROUBLESHOOTING

### Tool Not Found

**Symptom**: `Error: Tool not found: figma.get_file`

**Solution**: Use correct naming pattern:
```typescript
// WRONG
await figma.get_file({...});

// CORRECT
await figma.figma_get_file({...});
```

### Authentication Failed

**Symptom**: `403 Forbidden`

**Solution**:
1. Check token in `.env`:
   ```bash
   grep FIGMA .env
   ```
2. Verify token format (starts with `figd_`)
3. Regenerate token if expired
4. Restart AI client

### File Not Found

**Symptom**: `404 Not Found`

**Solution**:
1. Verify file key from URL
2. Check file permissions in Figma
3. Ensure file wasn't deleted

### Empty Results

**Symptom**: Components or styles return empty

**Solution**:
1. Verify file has components/styles
2. Check file key is correct
3. Try with a known file first

---

## 6. RELATED RESOURCES

| Guide | When to Use |
|-------|-------------|
| [tool_reference.md](./tool_reference.md) | Full tool documentation |
| [SKILL.md](../SKILL.md) | Main skill instructions |

### Key Commands Reference

| Task | Command |
|------|---------|
| Get file | `figma_get_file({ fileKey })` |
| Get nodes | `figma_get_file_nodes({ fileKey, node_ids })` |
| Export image | `figma_get_image({ fileKey, ids, format })` |
| Get components | `figma_get_file_components({ fileKey })` |
| Get styles | `figma_get_file_styles({ fileKey })` |
| Get comments | `figma_get_comments({ fileKey })` |
| Post comment | `figma_post_comment({ fileKey, message })` |

---

**Remember**: All Figma tools use the naming pattern `figma.figma_{tool_name}` when called via Code Mode.

