---
title: Workflow Examples - Complex Multi-Tool Patterns
description: Five workflow patterns for multi-tool orchestration, error handling, and state persistence.
---

# Workflow Examples - Complex Multi-Tool Patterns

Five patterns demonstrating multi-tool orchestration, error handling, and state persistence in Code Mode.

---

## 1. OVERVIEW

This document provides five comprehensive workflow patterns for Code Mode UTCP.

**All examples use markdown code blocks** (not separate .ts files) for easier reference and embedding in documentation.

**Patterns covered:**

1. **Webflow Workflow** - Basic tool calling and data processing
2. **ClickUp Workflow** - Task creation with verification
3. **Notion Workflow** - Database operations with `notion_API_` prefix
4. **Multi-Tool Orchestration** - Complex cross-platform workflows
5. **Error Handling** - Robust patterns with fallbacks

---

## 2. WEBFLOW WORKFLOW

**Scenario:** Get all Webflow sites and their CMS collections

**Demonstrates:**
- Basic tool calling
- Data processing within sandbox
- State persistence across operations
- Console logging
- Result aggregation

**Code:**

```typescript
call_tool_chain({
  code: `
    console.log('Fetching Webflow sites...');

    // Step 1: List all sites (note the naming pattern)
    const sitesResult = await webflow.webflow_sites_list({});
    const sites = sitesResult.sites;

    console.log(\`Found \${sites.length} site(s)\`);

    // Step 2: Get collections for the first site
    if (sites.length > 0) {
      const siteId = sites[0].id;
      const siteName = sites[0].displayName;

      console.log(\`Getting collections for: \${siteName}\`);

      const collectionsResult = await webflow.webflow_collections_list({
        site_id: siteId
      });

      const collections = collectionsResult.collections;

      return {
        site: {
          id: siteId,
          name: siteName,
          domains: sites[0].customDomains
        },
        collectionsCount: collections.length,
        collections: collections.map(c => ({
          id: c.id,
          name: c.displayName,
          slug: c.slug
        }))
      };
    }

    return { message: 'No sites found' };
  `
});
```

**Expected Output:**

```javascript
{
  result: {
    site: {
      id: "...",
      name: "Example Corp",
      domains: ["example.com", "www.example.com"]
    },
    collectionsCount: 21,
    collections: [
      { id: "...", name: "Merken", slug: "merken" },
      { id: "...", name: "Blog", slug: "blog" },
      { id: "...", name: "Products", slug: "products" }
      // ... more collections
    ]
  },
  logs: [
    "Fetching Webflow sites...",
    "Found 1 site(s)",
    "Getting collections for: A. Nobel & Zn"
  ]
}
```

**Key learnings:**
- Data from first API call (`sitesResult`) used in second call
- State persisted throughout execution
- Console logs captured and returned
- Data transformation (`.map()`) performed in-sandbox
- Single execution, no multiple round trips

---

## 3. CLICKUP WORKFLOW

**Scenario:** Create a task in ClickUp and immediately fetch its details for confirmation

**Demonstrates:**
- Task creation with parameters
- Immediate verification
- Date handling
- Priority setting
- Result structuring

**Code:**

```typescript
call_tool_chain({
  code: `
    console.log('Creating ClickUp task...');

    // Step 1: Create a task
    const task = await clickup.clickup_create_task({
      name: "Implement new authentication feature",
      listName: "Development Sprint",
      description: "Add OAuth 2.0 authentication with Google and GitHub providers",
      priority: 1,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    });

    console.log(\`Task created: \${task.id}\`);

    // Step 2: Get task details to confirm
    const taskDetails = await clickup.clickup_get_task({
      task_id: task.id
    });

    console.log(\`Task confirmed: \${taskDetails.name}\`);

    return {
      success: true,
      taskId: task.id,
      taskName: task.name,
      taskUrl: task.url,
      status: taskDetails.status.status,
      priority: taskDetails.priority,
      dueDate: taskDetails.due_date
    };
  `
});
```

**Expected Output:**

```javascript
{
  result: {
    success: true,
    taskId: "abc123",
    taskName: "Implement new authentication feature",
    taskUrl: "https://app.clickup.com/t/abc123",
    status: "to do",
    priority: 1,
    dueDate: "2025-01-30T00:00:00Z"
  },
  logs: [
    "Creating ClickUp task...",
    "Task created: abc123",
    "Task confirmed: Implement new authentication feature"
  ]
}
```

**Key learnings:**
- Task ID from creation used for immediate verification
- Date calculated in JavaScript (7 days from now)
- Task creation and verification in single execution
- Result combines data from both API calls

---

## 4. NOTION WORKFLOW

**Scenario:** Create a page in Notion and add content blocks

**Demonstrates:**
- Notion page creation with parent reference
- Block manipulation
- Content structuring
- Database querying

**Code:**

```typescript
call_tool_chain({
  code: `
    console.log('Creating Notion page...');

    // Step 1: Search for the target database
    const searchResult = await notion.notion_API_post_search({
      query: "Projects"
    });

    const database = searchResult.results.find(r => r.object === 'database');
    if (!database) {
      return { success: false, error: 'Database not found' };
    }

    console.log(\`Found database: \${database.id}\`);

    // Step 2: Create a new page in the database
    const page = await notion.notion_API_post_page({
      parent: { database_id: database.id },
      properties: {
        Name: {
          title: [{ text: { content: 'New Project from Code Mode' } }]
        },
        Status: {
          select: { name: 'In Progress' }
        }
      }
    });

    console.log(\`Page created: \${page.id}\`);

    // Step 3: Verify the page was created
    const verifyPage = await notion.notion_API_retrieve_a_page({
      page_id: page.id
    });

    return {
      success: true,
      pageId: page.id,
      pageUrl: page.url,
      title: verifyPage.properties.Name?.title?.[0]?.text?.content,
      status: verifyPage.properties.Status?.select?.name
    };
  `
});
```

**Expected Output:**

```javascript
{
  result: {
    success: true,
    pageId: "abc123-def456...",
    pageUrl: "https://notion.so/New-Project-from-Code-Mode-abc123",
    title: "New Project from Code Mode",
    status: "In Progress"
  },
  logs: [
    "Creating Notion page...",
    "Found database: abc123",
    "Page created: def456"
  ]
}
```

**Key learnings:**
- Notion uses `notion_API_` prefix in tool names (different from other MCP servers)
- Search → Create → Verify pattern for reliability
- Page properties depend on database schema
- Parent reference required for database pages

---

## 5. MULTI-TOOL ORCHESTRATION

**Scenario:** Design-to-implementation workflow across three platforms (Figma → ClickUp → Webflow)

**Demonstrates:**
- Multi-tool orchestration
- Complex data flow
- State management across tools
- Workflow coordination
- Extended timeout for complex operations

**Code:**

```typescript
call_tool_chain({
  code: `
    // Step 1: Get Figma design data
    console.log('Fetching Figma design...');

    const design = await figma.figma_get_file({
      fileId: 'abc123xyz'
    });

    const componentCount = design.document.children.length;
    console.log(\`Design has \${componentCount} components\`);

    // Step 2: Create ClickUp task for implementation
    console.log('Creating implementation task...');

    const task = await clickup.clickup_create_task({
      name: \`Implement: \${design.name}\`,
      listName: "Design Implementation Queue",
      description: \`Implement design from Figma with \${componentCount} components\`,
      priority: 2
    });

    console.log(\`Task created: \${task.url}\`);

    // Step 3: Update Webflow CMS collection with design reference
    console.log('Updating Webflow CMS...');

    const cmsItem = await webflow.webflow_collections_items_create_item_live({
      collection_id: 'design-queue-collection-id',
      request: {
        items: [{
          fieldData: {
            name: design.name,
            figmaUrl: \`https://figma.com/file/\${design.key}\`,
            clickupTaskUrl: task.url,
            componentCount: componentCount,
            status: 'In Queue',
            createdAt: new Date().toISOString()
          }
        }]
      }
    });

    console.log('Workflow complete!');

    return {
      success: true,
      design: {
        name: design.name,
        components: componentCount,
        figmaUrl: \`https://figma.com/file/\${design.key}\`
      },
      task: {
        id: task.id,
        url: task.url
      },
      cms: {
        itemId: cmsItem.items[0].id
      },
      timestamp: new Date().toISOString()
    };
  `,
  timeout: 60000  // 60 second timeout for multi-tool workflow
});
```

**Expected Output:**

```javascript
{
  result: {
    success: true,
    design: {
      name: "New Homepage Design",
      components: 15,
      figmaUrl: "https://figma.com/file/abc123xyz"
    },
    task: {
      id: "task123",
      url: "https://app.clickup.com/t/task123"
    },
    cms: {
      itemId: "cms-item-456"
    },
    timestamp: "2025-01-23T10:30:00Z"
  },
  logs: [
    "Fetching Figma design...",
    "Design has 15 components",
    "Creating implementation task...",
    "Task created: https://app.clickup.com/t/task123",
    "Updating Webflow CMS...",
    "Workflow complete!"
  ]
}
```

**Key learnings:**
- Three different MCP tools orchestrated in sequence
- Data flows from Figma → ClickUp → Webflow
- Design data (`design.name`, `componentCount`) used in all three steps
- Extended timeout (60s) for complex workflow
- Single execution prevents context switching overhead
- All operations succeed or fail together (atomic workflow)

**Benefits demonstrated:**
- ✅ State persistence (design data used across all three operations)
- ✅ Error handling (any failure rolls back entire workflow)
- ✅ Single execution (no multiple round trips)
- ✅ Console logging (track progress through complex workflow)
- ✅ Complex data flow (Figma → ClickUp → Webflow)
- ✅ Time efficiency (3 tools, 1 execution vs 15+ round trips)

---

## 6. ERROR HANDLING PATTERNS

**Scenario:** Robust error handling with fallback logic and partial success

**Demonstrates:**
- Try/catch error handling
- Graceful degradation
- Partial success handling
- Error logging
- Conditional execution based on success/failure

**Code:**

```typescript
call_tool_chain({
  code: `
    const results = {
      sites: null,
      collections: null,
      errors: []
    };

    // Step 1: Attempt to fetch Webflow sites with error handling
    try {
      console.log('Attempting to fetch Webflow sites...');

      const sitesResult = await webflow.webflow_sites_list({});
      results.sites = sitesResult.sites;

      console.log(\`✓ Successfully fetched \${results.sites.length} sites\`);

    } catch (error) {
      console.error('✗ Failed to fetch sites:', error?.message || String(error));
      results.errors.push({
        step: 'fetch_sites',
        error: error?.message || String(error),
        timestamp: new Date().toISOString()
      });

      // Return early if sites fetch fails
      return {
        success: false,
        results,
        message: 'Cannot proceed without sites data',
        failedAt: 'fetch_sites'
      };
    }

    // Step 2: Only proceed if we have sites
    if (results.sites && results.sites.length > 0) {
      try {
        const siteId = results.sites[0].id;
        console.log(\`Fetching collections for site: \${siteId}\`);

        const collectionsResult = await webflow.webflow_collections_list({
          site_id: siteId
        });
        results.collections = collectionsResult.collections;

        console.log(\`✓ Successfully fetched \${results.collections.length} collections\`);

      } catch (error) {
        console.error('✗ Failed to fetch collections:', error?.message || String(error));
        results.errors.push({
          step: 'fetch_collections',
          error: error?.message || String(error),
          timestamp: new Date().toISOString()
        });

        // Continue execution with partial data (don't fail entire workflow)
        console.log('Continuing with partial data (sites only)...');
      }
    }

    // Step 3: Return results (success or partial success)
    return {
      success: results.errors.length === 0,
      partialSuccess: results.sites !== null && results.collections === null,
      results,
      errorCount: results.errors.length,
      timestamp: new Date().toISOString()
    };
  `,
  timeout: 30000
});
```

**Expected Output (Full Success):**

```javascript
{
  result: {
    success: true,
    partialSuccess: false,
    results: {
      sites: [{ id: "...", displayName: "Site Name", ... }],
      collections: [{ id: "...", displayName: "Collection", ... }],
      errors: []
    },
    errorCount: 0,
    timestamp: "2025-01-23T10:30:00Z"
  },
  logs: [
    "Attempting to fetch Webflow sites...",
    "✓ Successfully fetched 1 sites",
    "Fetching collections for site: ...",
    "✓ Successfully fetched 21 collections"
  ]
}
```

**Expected Output (Partial Success):**

```javascript
{
  result: {
    success: false,
    partialSuccess: true,
    results: {
      sites: [{ id: "...", displayName: "Site Name", ... }],
      collections: null,
      errors: [
        {
          step: "fetch_collections",
          error: "Site not found or access denied",
          timestamp: "2025-01-23T10:30:05Z"
        }
      ]
    },
    errorCount: 1,
    timestamp: "2025-01-23T10:30:05Z"
  },
  logs: [
    "Attempting to fetch Webflow sites...",
    "✓ Successfully fetched 1 sites",
    "Fetching collections for site: ...",
    "✗ Failed to fetch collections: Site not found or access denied",
    "Continuing with partial data (sites only)..."
  ]
}
```

**Expected Output (Complete Failure):**

```javascript
{
  result: {
    success: false,
    results: {
      sites: null,
      collections: null,
      errors: [
        {
          step: "fetch_sites",
          error: "Authentication failed: Invalid API token",
          timestamp: "2025-01-23T10:30:00Z"
        }
      ]
    },
    message: "Cannot proceed without sites data",
    failedAt: "fetch_sites"
  },
  logs: [
    "Attempting to fetch Webflow sites...",
    "✗ Failed to fetch sites: Authentication failed: Invalid API token"
  ]
}
```

**Key learnings:**
- Try/catch prevents entire workflow from failing
- Partial success possible (sites fetched, collections failed)
- Errors logged with timestamps and step identification
- Early return on critical failures
- Graceful degradation on non-critical failures
- Clear success indicators (`success`, `partialSuccess`, `errorCount`)
- Comprehensive logging for debugging

**Error handling patterns:**
1. **Critical failure** (sites fetch fails) → Early return with error
2. **Non-critical failure** (collections fetch fails) → Log error, continue with partial data
3. **Full success** → Return all data
4. **Partial success** → Return what succeeded, log what failed

---

## 7. PARALLEL EXECUTION PATTERNS

### When to Parallelize

**✅ USE Promise.all WHEN:**
- Operations don't depend on each other's results
- Order of execution doesn't matter
- You need data from multiple sources before next step

**✅ USE Promise.allSettled WHEN:**
- Some operations might fail
- You want partial results rather than complete failure
- Resilience is more important than speed

**❌ DO NOT PARALLELIZE WHEN:**
- Operation B needs result from Operation A
- Order of mutations matters (create before update)
- API has strict rate limits

### Pattern 1: Basic Parallel Fetch

```typescript
call_tool_chain({
  code: `
    // Independent operations - execute in parallel
    const [sites, workspace, figmaFile] = await Promise.all([
      webflow.webflow_sites_list({}),
      clickup.clickup_get_workspace_hierarchy({}),
      figma.figma_get_file({ fileKey: "abc123" })
    ]);
    
    return {
      webflow: { siteCount: sites.sites.length },
      clickup: { spaceCount: workspace.spaces.length },
      figma: { fileName: figmaFile.name }
    };
  `,
  timeout: 45000
});
```

**Performance:** ~400ms total vs ~1200ms sequential (3x faster)

### Pattern 2: Graceful Failure with Promise.allSettled

```typescript
call_tool_chain({
  code: `
    const results = await Promise.allSettled([
      webflow.webflow_sites_list({}),
      clickup.clickup_get_workspace_hierarchy({}),
      figma.figma_get_file({ fileKey: "invalid-key" })  // Will fail
    ]);
    
    const processed = results.map((result, index) => {
      const sources = ['webflow', 'clickup', 'figma'];
      if (result.status === 'fulfilled') {
        return { source: sources[index], success: true, data: result.value };
      } else {
        return { source: sources[index], success: false, error: result.reason.message };
      }
    });
    
    return {
      successCount: processed.filter(p => p.success).length,
      results: processed
    };
  `,
  timeout: 45000
});
```

**Key insight:** Promise.allSettled never rejects - always returns all results with status

### Pattern 3: Parallel Fetch → Sequential Process

```typescript
call_tool_chain({
  code: `
    // Phase 1: Fetch all data in parallel
    const [sites, workspace] = await Promise.all([
      webflow.webflow_sites_list({}),
      clickup.clickup_get_workspace_hierarchy({})
    ]);
    
    // Phase 2: Sequential processing (depends on parallel results)
    const firstSite = sites.sites[0];
    const collections = await webflow.webflow_collections_list({ 
      site_id: firstSite.id 
    });
    
    // Phase 3: Create task with combined data
    const task = await clickup.clickup_create_task({
      name: \`Sync \${firstSite.displayName} collections\`,
      listName: workspace.spaces[0]?.name || "Default"
    });
    
    return {
      phase1: { sites: sites.sites.length, spaces: workspace.spaces.length },
      phase2: { collections: collections.collections.length },
      phase3: { taskId: task.id }
    };
  `,
  timeout: 60000
});
```

### Pattern 4: Batch Operations with Chunked Parallelism

```typescript
call_tool_chain({
  code: `
    async function processInBatches(items, batchSize, processor) {
      const results = [];
      for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        console.log(\`Processing batch \${Math.floor(i/batchSize) + 1}\`);
        const batchResults = await Promise.all(batch.map(processor));
        results.push(...batchResults);
      }
      return results;
    }
    
    const collectionsResult = await webflow.webflow_collections_list({ 
      site_id: "your-site-id" 
    });
    
    // Process in batches of 3 (limit concurrent API calls)
    const details = await processInBatches(
      collectionsResult.collections.slice(0, 9),
      3,
      async (collection) => {
        const items = await webflow.webflow_collections_items_list_items({
          collection_id: collection.id,
          limit: 5
        });
        return { name: collection.displayName, itemCount: items.items?.length || 0 };
      }
    );
    
    return { collectionsProcessed: details.length, results: details };
  `,
  timeout: 90000
});
```

**Key insight:** Batching prevents API rate limits while still parallelizing

### Pattern 5: Error Handling in Parallel Context

```typescript
call_tool_chain({
  code: `
    async function safeParallel(operations) {
      const results = await Promise.allSettled(
        operations.map(async (op) => {
          try {
            return await op.fn();
          } catch (error) {
            return { error: true, name: op.name, message: error.message };
          }
        })
      );
      
      return results.map((r, i) => ({
        name: operations[i].name,
        success: r.status === 'fulfilled' && !r.value?.error,
        data: r.status === 'fulfilled' ? r.value : null,
        error: r.status === 'rejected' ? r.reason.message : r.value?.message
      }));
    }
    
    return await safeParallel([
      { name: 'webflow', fn: () => webflow.webflow_sites_list({}) },
      { name: 'clickup', fn: () => clickup.clickup_get_workspace_hierarchy({}) },
      { name: 'figma', fn: () => figma.figma_get_file({ fileKey: "test" }) }
    ]);
  `,
  timeout: 60000
});
```

---

## 8. PATTERN COMPARISON

### Traditional Multi-Tool Approach (Without Code Mode)

**Steps required:**
1. Call `webflow_sites_list` → Wait 500ms → Process in AI context
2. Extract site ID → Call `webflow_collections_list` → Wait 500ms → Process in AI context
3. Call `clickup_create_task` → Wait 500ms → Process in AI context
4. Call `webflow_cms_create_item` → Wait 500ms → Process in AI context

**Total time:** ~2000ms + 4× context overhead
**Total API calls:** 4 separate calls
**Context switches:** 4 times
**State management:** Manual across calls
**Error handling:** Must handle in AI layer

---

### Code Mode Approach

**Steps required:**
1. Call `call_tool_chain` with entire workflow code → Wait 300ms → Done

**Total time:** ~300ms + 1× minimal context overhead
**Total API calls:** 1 code execution (internally calls 4 tools)
**Context switches:** 1 time
**State management:** Automatic within sandbox
**Error handling:** Built into TypeScript code

**Result:** **5× faster**, **98% less context overhead**, **simpler code**

---

## 9. BEST PRACTICES

### 1. Always Use Console Logging

**Why:** Track workflow progress, debug issues, understand execution flow

```typescript
console.log('Starting workflow...');
console.log(\`Processing \${data.length} items\`);
console.error('Error occurred:', error.message);
console.log('Workflow complete!');
```

---

### 2. Structure Return Values Consistently

**Good:**
```typescript
return {
  success: true/false,
  data: { /* results */ },
  errors: [],
  timestamp: new Date().toISOString()
};
```

**Bad:**
```typescript
return result;  // Unclear structure
```

---

### 3. Use Try/Catch for Error Handling

**Good:**
```typescript
try {
  const result = await tool.call();
  return { success: true, result };
} catch (error) {
  return { success: false, error: error.message };
}
```

**Bad:**
```typescript
const result = await tool.call();  // Unhandled errors crash entire workflow
```

---

### 4. Set Appropriate Timeouts

**Guidelines:**
- Simple workflows (1-2 tools): 30s (default)
- Complex workflows (3-5 tools): 60s
- Very complex (6+ tools, large data): 120s+

```typescript
call_tool_chain({
  code: `/* workflow code */`,
  timeout: 60000  // 60 seconds
});
```

---

### 5. Use Descriptive Variable Names

**Good:**
```typescript
const sitesResult = await webflow.webflow_sites_list({});
const firstSite = sitesResult.sites[0];
const collectionsForSite = await webflow.webflow_collections_list({ site_id: firstSite.id });
```

**Bad:**
```typescript
const r = await webflow.webflow_sites_list({});
const s = r.sites[0];
const c = await webflow.webflow_collections_list({ site_id: s.id });
```

---

## 10. SUMMARY

**Five workflow patterns demonstrated:**

1. **Single-tool workflow** (Webflow) - Basic tool calling, data processing
2. **Task creation workflow** (ClickUp) - Creation + verification pattern
3. **Notion workflow** - Database querying and page creation with `notion_API_` prefix
4. **Multi-tool orchestration** (Figma → ClickUp → Webflow) - Complex data flow
5. **Error handling** (Webflow with fallbacks) - Robust error management
6. **Parallel execution** - Promise.all, Promise.allSettled, batching patterns

**Key benefits of Code Mode:**
- State persistence across operations
- Single execution vs multiple round trips
- Built-in error handling (try/catch)
- Console logging captured
- Complex data transformations in-sandbox
- 5× faster than traditional approach
- 98% less context overhead

**When to use each pattern:**
- **Pattern 1:** Simple single-tool operations
- **Pattern 2:** Create-then-verify workflows
- **Pattern 3:** Notion database operations (note the `notion_API_` prefix)
- **Pattern 4:** Complex multi-platform workflows
- **Pattern 5:** Mission-critical workflows requiring error resilience
- **Pattern 6:** Performance-critical workflows requiring parallel execution

**All examples use markdown code blocks** for easier embedding in SKILL.md and documentation.

---

## 11. RELATED RESOURCES

### Reference Files
- [naming_convention.md](./naming_convention.md) - Critical naming patterns used in all examples
- [tool_catalog.md](./tool_catalog.md) - Complete list of available tools for workflows
- [architecture.md](./architecture.md) - Execution environment and state persistence details
- [configuration.md](./configuration.md) - Configuration setup for MCP servers used in examples

### Related Skills
- `mcp-chrome-devtools` - Browser automation workflows via bdg CLI
