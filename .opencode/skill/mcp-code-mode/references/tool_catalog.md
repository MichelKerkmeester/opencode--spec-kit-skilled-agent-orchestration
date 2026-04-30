---
title: Tool Catalog - Complete List of Available MCP Tools
description: Reference catalog of 170+ tools across 7 MCP servers.
---

# Tool Catalog - Complete List of Available MCP Tools

Reference catalog of 170+ tools across 7 MCP servers, organized by service.

---

## 1. OVERVIEW

### Dynamic Discovery (Recommended)

Use `search_tools()` or `list_tools()` to discover tools at runtime:

```typescript
// Search by task description
const tools = await search_tools({
  task_description: "webflow CMS collections",
  limit: 10
});

// List all available tools
const allTools = await list_tools();

// Get specific tool interface
const info = await tool_info({
  tool_name: "webflow.webflow_collections_list"
});
```

### When to Use This Catalog

- Understanding available capabilities
- Planning workflows
- Quick reference when offline

---

## 2. CONFIGURED MCP SERVERS

1. **Webflow** - 40+ tools (Site & CMS management)
2. **ClickUp** - 20+ tools (Task & project management)
3. **Figma** - 15+ tools (Design file access)
4. **Chrome DevTools** - 52 tools (26 tools × 2 instances)
5. **ShadCN UI** - Component library access
6. **Imagician** - Image processing
7. **Video Audio** - 30+ tools (Video/audio processing)
8. **GitHub** - 20+ tools (Repository & PR management)

**Total:** 170+ tools

> **Note:** Notion MCP is not currently configured. Add to `.utcp_config.json` if needed.

---

## 3. WEBFLOW (40+ TOOLS)

**Manual name:** `webflow`
**Naming pattern:** `webflow.webflow_{tool_name}`

### Site Management (5 tools)

| Tool Name | Purpose | Key Parameters |
|-----------|---------|----------------|
| `webflow_sites_list` | List all sites | None |
| `webflow_sites_get` | Get site details | `site_id` |
| `webflow_sites_publish` | Publish site | `site_id`, `domains` |
| `webflow_sites_get_custom_domains` | Get custom domains | `site_id` |
| `webflow_sites_update_publishing_settings` | Update publishing | `site_id`, `settings` |

### CMS Collections (8 tools)

| Tool Name | Purpose | Key Parameters |
|-----------|---------|----------------|
| `webflow_collections_list` | List CMS collections | `site_id` |
| `webflow_collections_get` | Get collection details | `collection_id` |
| `webflow_collections_create` | Create new collection | `site_id`, `displayName`, `singularName` |
| `webflow_collection_fields_create_static` | Add static field | `collection_id`, `fieldData` |
| `webflow_collection_fields_create_reference` | Add reference field | `collection_id`, `fieldData`, `referencedCollection` |
| `webflow_collection_fields_update` | Update field | `collection_id`, `field_id`, `updates` |
| `webflow_collection_fields_delete` | Delete field | `collection_id`, `field_id` |
| `webflow_collections_delete` | Delete collection | `collection_id` |

### CMS Items (7 tools)

| Tool Name | Purpose | Key Parameters |
|-----------|---------|----------------|
| `webflow_collections_items_list_items` | List collection items | `collection_id`, `limit`, `offset` |
| `webflow_collections_items_get_item` | Get specific item | `collection_id`, `item_id` |
| `webflow_collections_items_create_item` | Create item (draft) | `collection_id`, `fieldData` |
| `webflow_collections_items_create_item_live` | Create & publish item | `collection_id`, `fieldData` |
| `webflow_collections_items_update_items` | Update items (draft) | `collection_id`, `item_ids`, `fieldData` |
| `webflow_collections_items_update_items_live` | Update & publish items | `collection_id`, `item_ids`, `fieldData` |
| `webflow_collections_items_delete_item` | Delete item | `collection_id`, `item_id` |

### Pages (5 tools)

| Tool Name | Purpose | Key Parameters |
|-----------|---------|----------------|
| `webflow_pages_list` | List all pages | `site_id` |
| `webflow_pages_get_content` | Get page content | `page_id` |
| `webflow_pages_get_metadata` | Get page metadata | `page_id` |
| `webflow_pages_update_page_settings` | Update page settings | `page_id`, `settings` |
| `webflow_pages_update_static_content` | Update static content | `page_id`, `content` |

### Assets (3 tools)

| Tool Name | Purpose | Key Parameters |
|-----------|---------|----------------|
| `webflow_assets_list` | List site assets | `site_id` |
| `webflow_assets_create` | Upload new asset | `site_id`, `file` |
| `webflow_assets_delete` | Delete asset | `asset_id` |

### Scripts (3 tools)

| Tool Name | Purpose | Key Parameters |
|-----------|---------|----------------|
| `webflow_scripts_list` | List custom scripts | `site_id` |
| `webflow_scripts_create` | Add custom script | `site_id`, `script`, `location` |
| `webflow_scripts_update` | Update script | `script_id`, `script` |

### Other Tools

- `webflow_webflow_guide_tool` - Get Webflow API documentation
- `webflow_forms_list` - List forms
- `webflow_forms_submissions_list` - List form submissions
- And 10+ more tools for webhooks, domains, users, etc.

---

## 4. CLICKUP (20+ TOOLS)

**Manual name:** `clickup`
**Naming pattern:** `clickup.clickup_{tool_name}`

### Task Management (10 tools)

| Tool Name | Purpose | Key Parameters |
|-----------|---------|----------------|
| `clickup_create_task` | Create task | `name`, `listName`, `description`, `priority`, `dueDate` |
| `clickup_get_task` | Get task details | `task_id` |
| `clickup_get_tasks` | List tasks with filters | `listName`, `status`, `assignee` |
| `clickup_update_task` | Update task | `task_id`, `updates` |
| `clickup_move_task` | Move task to list | `task_id`, `listName` |
| `clickup_duplicate_task` | Duplicate task | `task_id` |
| `clickup_delete_task` | Delete task | `task_id` |
| `clickup_add_task_dependency` | Add dependency | `task_id`, `depends_on` |
| `clickup_set_task_priority` | Set priority | `task_id`, `priority` |
| `clickup_add_task_tag` | Add tag | `task_id`, `tag` |

### Bulk Operations (3 tools)

| Tool Name | Purpose | Key Parameters |
|-----------|---------|----------------|
| `clickup_create_bulk_tasks` | Create multiple tasks | `tasks[]` |
| `clickup_update_bulk_tasks` | Update multiple tasks | `tasks[]`, `updates` |
| `clickup_delete_bulk_tasks` | Delete multiple tasks | `task_ids[]` |

### Workspace & Lists (5 tools)

| Tool Name | Purpose | Key Parameters |
|-----------|---------|----------------|
| `clickup_get_workspace_hierarchy` | Get workspace structure | None |
| `clickup_create_list` | Create new list | `name`, `folder_id` |
| `clickup_create_folder` | Create new folder | `name`, `space_id` |
| `clickup_create_space` | Create new space | `name` |
| `clickup_get_lists` | List all lists | `space_id` |

### Comments & Time (3 tools)

- `clickup_add_task_comment` - Add comment to task
- `clickup_start_time_entry` - Start time tracking
- `clickup_stop_time_entry` - Stop time tracking

---

## 5. FIGMA (15+ TOOLS)

**Manual name:** `figma`
**Naming pattern:** `figma.figma_{tool_name}`

### File Operations (6 tools)

| Tool Name | Purpose | Key Parameters |
|-----------|---------|----------------|
| `figma_get_file` | Get Figma file | `fileId` |
| `figma_get_file_nodes` | Get specific nodes | `fileId`, `nodeIds[]` |
| `figma_get_image` | Export images | `fileId`, `nodeIds[]`, `format`, `scale` |
| `figma_get_image_fills` | Get image fills | `fileId` |
| `figma_get_file_versions` | Get version history | `fileId` |
| `figma_get_file_components` | Get file components | `fileId` |

### Comments (3 tools)

| Tool Name | Purpose | Key Parameters |
|-----------|---------|----------------|
| `figma_get_comments` | Get file comments | `file_key` |
| `figma_post_comment` | Post comment | `file_key`, `message`, `client_meta` |
| `figma_delete_comment` | Delete comment | `file_key`, `comment_id` |

### Design System (4 tools)

| Tool Name | Purpose | Key Parameters |
|-----------|---------|----------------|
| `figma_get_team_components` | Get team components | `team_id` |
| `figma_get_component` | Get specific component | `key` |
| `figma_get_team_styles` | Get team styles | `team_id` |
| `figma_get_style` | Get specific style | `key` |

### Configuration (2 tools)

- `figma_set_api_key` - Set Figma API key
- `figma_get_me` - Get current user info

---

## 6. CHROME DEVTOOLS (52 TOOLS)

**Manual names:** `chrome_devtools_1`, `chrome_devtools_2`
**Naming pattern:** `chrome_devtools_1.chrome_devtools_1_{tool_name}`

**Note:** 26 tools × 2 instances = 52 tools total

### Navigation (4 tools)

| Tool Name | Purpose | Key Parameters |
|-----------|---------|----------------|
| `chrome_devtools_new_page` | Create new browser page | None |
| `chrome_devtools_navigate_page` | Navigate to URL | `url`, `pageId` |
| `chrome_devtools_close_page` | Close page | `pageId` |
| `chrome_devtools_list_pages` | List open pages | None |

### Interaction (10 tools)

| Tool Name | Purpose | Key Parameters |
|-----------|---------|----------------|
| `chrome_devtools_click` | Click element | `selector`, `button`, `clickCount` |
| `chrome_devtools_fill` | Fill form field | `selector`, `value` |
| `chrome_devtools_fill_form` | Fill entire form | `formData{}` |
| `chrome_devtools_select` | Select dropdown option | `selector`, `values[]` |
| `chrome_devtools_hover` | Hover over element | `selector` |
| `chrome_devtools_press_key` | Press keyboard key | `key`, `modifiers` |
| `chrome_devtools_type` | Type text | `text`, `delay` |
| `chrome_devtools_drag` | Drag and drop | `source`, `target` |
| `chrome_devtools_scroll` | Scroll page | `x`, `y` |
| `chrome_devtools_wait_for_selector` | Wait for element | `selector`, `timeout` |

### Inspection (6 tools)

| Tool Name | Purpose | Key Parameters |
|-----------|---------|----------------|
| `chrome_devtools_take_screenshot` | Capture screenshot | `fullPage`, `pageId` |
| `chrome_devtools_take_snapshot` | Take DOM snapshot | `pageId` |
| `chrome_devtools_evaluate_script` | Execute JavaScript | `script`, `pageId` |
| `chrome_devtools_get_console_message` | Get console message | `pageId` |
| `chrome_devtools_get_network_request` | Get network request | `requestId`, `pageId` |
| `chrome_devtools_get_element_attributes` | Get element attrs | `selector`, `pageId` |

### Performance (3 tools)

| Tool Name | Purpose | Key Parameters |
|-----------|---------|----------------|
| `chrome_devtools_performance_start_trace` | Start performance trace | `categories[]`, `pageId` |
| `chrome_devtools_performance_stop_trace` | Stop trace | `pageId` |
| `chrome_devtools_performance_analyze_insight` | Analyze performance | `traceData` |

### Other Tools (3 tools)

- `chrome_devtools_resize_page` - Resize viewport
- `chrome_devtools_list_console_messages` - List console logs
- `chrome_devtools_clear_console` - Clear console

---

## 7. SHADCN UI (COMPONENTS)

**Manual name:** `shadcn_ui`
**Naming pattern:** `shadcn_ui.shadcn_ui_{tool_name}`

| Tool Name | Purpose | Key Parameters |
|-----------|---------|----------------|
| `shadcn_ui_list_shadcn_components` | List all components | None |
| `shadcn_ui_get_component_details` | Get component details | `component_name` |
| `shadcn_ui_search_components` | Search components | `query` |

---

## 8. IMAGICIAN (IMAGE PROCESSING)

**Manual name:** `imagician`
**Naming pattern:** `imagician.imagician_{tool_name}`

| Tool Name | Purpose | Key Parameters |
|-----------|---------|----------------|
| `imagician_resize_image` | Resize image | `path`, `width`, `height` |
| `imagician_convert_format` | Convert image format | `path`, `format` |
| `imagician_compress_image` | Compress image | `path`, `quality` |
| `imagician_crop_image` | Crop image | `path`, `x`, `y`, `width`, `height` |
| `imagician_rotate_image` | Rotate image | `path`, `degrees` |
| `imagician_list_images` | List available images | None |

---

## 9. VIDEO AUDIO (30+ TOOLS)

**Manual name:** `video_audio`
**Naming pattern:** `video_audio.video_audio_{tool_name}`

### Video Tools (15+ tools)

| Tool Name | Purpose | Key Parameters |
|-----------|---------|----------------|
| `video_audio_extract_audio_from_video` | Extract audio track | `video_path` |
| `video_audio_trim_video` | Trim video | `video_path`, `start`, `end` |
| `video_audio_convert_video_format` | Convert format | `video_path`, `format` |
| `video_audio_resize_video` | Resize video | `video_path`, `width`, `height` |
| `video_audio_rotate_video` | Rotate video | `video_path`, `degrees` |
| `video_audio_merge_videos` | Merge videos | `video_paths[]` |
| `video_audio_add_watermark` | Add watermark | `video_path`, `watermark_path` |
| `video_audio_change_video_speed` | Change playback speed | `video_path`, `speed` |
| `video_audio_extract_video_frames` | Extract frames | `video_path`, `fps` |
| `video_audio_compress_video` | Compress video | `video_path`, `quality` |

### Audio Tools (15+ tools)

| Tool Name | Purpose | Key Parameters |
|-----------|---------|----------------|
| `video_audio_convert_audio_format` | Convert audio format | `audio_path`, `format` |
| `video_audio_trim_audio` | Trim audio | `audio_path`, `start`, `end` |
| `video_audio_merge_audio` | Merge audio files | `audio_paths[]` |
| `video_audio_change_audio_volume` | Change volume | `audio_path`, `volume` |
| `video_audio_change_audio_speed` | Change playback speed | `audio_path`, `speed` |
| `video_audio_extract_audio_metadata` | Get metadata | `audio_path` |
| `video_audio_normalize_audio` | Normalize audio | `audio_path` |
| `video_audio_add_silence` | Add silence | `audio_path`, `duration` |
| `video_audio_remove_silence` | Remove silence | `audio_path`, `threshold` |
| `video_audio_split_audio_by_silence` | Split by silence | `audio_path` |

---

## 10. TOOL DISCOVERY EXAMPLES

### Example 1: Search by Task Description

```typescript
// Find tools for a specific task
const tools = await search_tools({
  task_description: "webflow CMS collection management",
  limit: 10
});

// Result:
[
  {
    name: "webflow.webflow_collections_list",
    description: "List all CMS collections for a site",
    tags: ["webflow", "cms", "collections", "list"]
  },
  {
    name: "webflow.webflow_collections_create",
    description: "Create a new CMS collection",
    tags: ["webflow", "cms", "collections", "create"]
  }
  // ... more relevant tools
]
```

---

### Example 2: List All Tools from Specific Manual

```typescript
// Get all Webflow tools
const allTools = await list_tools();
const webflowTools = allTools.tools.filter(t => t.startsWith('webflow.'));

console.log(`Found ${webflowTools.length} Webflow tools`);
console.log(webflowTools);
```

---

### Example 3: Get Detailed Tool Information

```typescript
// Get full TypeScript interface for a tool
const info = await tool_info({
  tool_name: "webflow.webflow_collections_items_create_item_live"
});

console.log(info.interface);
// Shows: TypeScript interface with all parameters and return types
```

---

## 11. SUMMARY

**Total Tools:** 170+ across 7 MCP servers

**Best practices:**
1. Use `search_tools()` for dynamic discovery
2. Use `tool_info()` for detailed interfaces
3. Refer to this catalog for planning and overview
4. Check tool availability with `list_tools()` after configuration changes

**Remember:** This catalog may become outdated as MCP servers update. Always use dynamic discovery (`search_tools`, `list_tools`) for the most current tool list.

---

## 12. RELATED RESOURCES

### Reference Files
- [naming_convention.md](./naming_convention.md) - Critical naming patterns for all tools in this catalog
- [workflows.md](./workflows.md) - Workflow examples demonstrating tool usage
- [configuration.md](./configuration.md) - How to configure MCP servers for these tools
- [architecture.md](./architecture.md) - How tool discovery and loading works

### Related Skills
- `mcp-chrome-devtools` - Direct Chrome DevTools Protocol access via bdg CLI
