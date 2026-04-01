// ───────────────────────────────────────────────────────────────
// MODULE: Layer Definitions
// ───────────────────────────────────────────────────────────────
// Feature catalog: 7-layer tool architecture metadata
// LIB: LAYER DEFINITIONS
// 7-Layer MCP Architecture with Token Budgets
// ───────────────────────────────────────────────────────────────
// 1. LAYER TYPES

// ───────────────────────────────────────────────────────────────
/** Individual layer definition in the 7-layer architecture */
export interface LayerDefinition {
  id: string;
  name: string;
  description: string;
  tokenBudget: number;
  priority: number;
  useCase: string;
  tools: string[];
}

/** Layer ID string literal union */
export type LayerId = 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6' | 'L7';

/** Task type for layer recommendations */
export type TaskType = 'search' | 'browse' | 'modify' | 'checkpoint' | 'analyze' | 'maintenance' | 'default';

/* ───────────────────────────────────────────────────────────────
   2. LAYER CONSTANTS

   REQ-020: Layered Tool Organization (L1-L7 structure)

   Design Principles:
   - Progressive disclosure: Start with high-level, drill down as needed
   - Token efficiency: Higher layers = fewer tokens, more targeted
   - Cognitive load: Reduce choices at each decision point
   ──────────────────────────────────────────────────────────────── */

/**
 * Defines the LAYER_DEFINITIONS constant.
 */
export const LAYER_DEFINITIONS: Record<LayerId, LayerDefinition> = {
  L1: {
    id: 'L1',
    name: 'Orchestration',
    description: 'Unified entry points with intent-aware routing. Start here for most tasks.',
    tokenBudget: 3500,
    priority: 1,
    useCase: 'Default entry point for context retrieval. Automatically routes based on intent.',
    tools: ['memory_context', 'session_resume', 'session_bootstrap']
  },
  L2: {
    id: 'L2',
    name: 'Core',
    description: 'Primary memory operations. Use when you need specific search or save functionality.',
    tokenBudget: 3500,
    priority: 2,
    useCase: 'Direct access to search, save, and trigger matching when L1 routing is not needed.',
    tools: ['memory_search', 'memory_quick_search', 'memory_save', 'memory_match_triggers']
  },
  L3: {
    id: 'L3',
    name: 'Discovery',
    description: 'Browse and explore the memory system. Use to understand what exists.',
    tokenBudget: 1000,
    priority: 3,
    useCase: 'Explore available memories, check system health, view statistics.',
    tools: ['memory_list', 'memory_stats', 'memory_health', 'session_health']
  },
  L4: {
    id: 'L4',
    name: 'Mutation',
    description: 'Modify existing memories. Use to update, delete, or validate memories.',
    tokenBudget: 1000,
    priority: 4,
    useCase: 'Make changes to existing memories when corrections or updates are needed.',
    tools: ['memory_update', 'memory_delete', 'memory_validate', 'memory_bulk_delete']
  },
  L5: {
    id: 'L5',
    name: 'Lifecycle',
    description: 'Checkpoint and version management. Use for state preservation and recovery.',
    tokenBudget: 1000,
    priority: 5,
    useCase: 'Create checkpoints before major changes, restore previous states.',
    tools: ['checkpoint_create', 'checkpoint_list', 'checkpoint_restore', 'checkpoint_delete', 'shared_memory_enable', 'shared_memory_status', 'shared_space_upsert', 'shared_space_membership_set']
  },
  L6: {
    id: 'L6',
    name: 'Analysis',
    description: 'Deep inspection and causal analysis. Use to understand relationships and lineage.',
    tokenBudget: 1500,
    priority: 6,
    useCase: 'Trace decision history, understand memory relationships, measure learning.',
    tools: [
      'memory_drift_why',
      'memory_causal_link',
      'memory_causal_stats',
      'memory_causal_unlink',
      'task_preflight',
      'task_postflight',
      'eval_run_ablation',
      'eval_reporting_dashboard',
      'code_graph_query',
      'code_graph_context'
    ]
  },
  L7: {
    id: 'L7',
    name: 'Maintenance',
    description: 'System maintenance and bulk operations. Use for indexing and diagnostics.',
    tokenBudget: 1000,
    priority: 7,
    useCase: 'Re-index memories, view learning history, perform bulk operations.',
    tools: ['memory_index_scan', 'memory_get_learning_history', 'memory_ingest_start', 'memory_ingest_status', 'memory_ingest_cancel', 'code_graph_scan', 'code_graph_status', 'ccc_status', 'ccc_reindex', 'ccc_feedback']
  }
} as const;

/* ───────────────────────────────────────────────────────────────
   3. TOOL-TO-LAYER MAPPING

   Maps each tool to its layer for quick lookup.
   ──────────────────────────────────────────────────────────────── */

/**
 * Defines the TOOL_LAYER_MAP constant.
 */
export const TOOL_LAYER_MAP: Record<string, LayerId> = {} as Record<string, LayerId>;
for (const [layerId, layer] of Object.entries(LAYER_DEFINITIONS)) {
  for (const tool of layer.tools) {
    (TOOL_LAYER_MAP as Record<string, string>)[tool] = layerId;
  }
}

/* ───────────────────────────────────────────────────────────────
   4. LAYER PREFIX GENERATOR

   Generates description prefixes for tool descriptions.
   Format: "[L#:Name] Original description..."
   ──────────────────────────────────────────────────────────────── */

/**
 * Get the layer ID for a tool.
 */
export function getLayerForTool(toolName: string): LayerId | null {
  return TOOL_LAYER_MAP[toolName] ?? null;
}

/**
 * Get the layer prefix for a tool's description.
 * CHK-073: Tool descriptions include layer prefix.
 */
export function getLayerPrefix(toolName: string): string {
  const layerId = getLayerForTool(toolName);
  if (!layerId) return '';

  const layer = LAYER_DEFINITIONS[layerId];
  return `[${layerId}:${layer.name}]`;
}

/**
 * Enhance a tool description with layer information.
 * CHK-073: Adds layer prefix to description.
 */
export function enhanceDescription(toolName: string, description: string): string {
  const prefix = getLayerPrefix(toolName);
  if (!prefix) return description;

  return `${prefix} ${description}`;
}

/* ───────────────────────────────────────────────────────────────
   5. TOKEN BUDGET HELPERS

   CHK-072: Token budgets assigned per layer.
   ──────────────────────────────────────────────────────────────── */

/**
 * Get the token budget for a tool.
 */
export function getLayerTokenBudget(toolName: string): number {
  const layerId = getLayerForTool(toolName);
  if (!layerId) return 1000; // Default budget

  return LAYER_DEFINITIONS[layerId].tokenBudget;
}

/**
 * Get the token budget for a tool.
 */
export function getTokenBudget(toolName: string): number {
  return getLayerTokenBudget(toolName);
}

/**
 * Get layer information for a tool.
 */
export function getLayerInfo(toolName: string): LayerDefinition | null {
  const layerId = getLayerForTool(toolName);
  if (!layerId) return null;

  return { ...LAYER_DEFINITIONS[layerId] };
}

/**
 * Get all layers in priority order.
 */
export function getLayersByPriority(): LayerDefinition[] {
  return Object.values(LAYER_DEFINITIONS).sort((a, b) => a.priority - b.priority);
}

/**
 * Get layer usage guidance based on task.
 * CHK-074: Progressive disclosure from Orchestration to Analysis layers.
 */
export function getRecommendedLayers(taskType: TaskType): LayerId[] {
  const recommendations: Record<TaskType, LayerId[]> = {
    search: ['L1', 'L2'],
    browse: ['L3', 'L2'],
    modify: ['L4', 'L3'],
    checkpoint: ['L5'],
    analyze: ['L6', 'L2'],
    maintenance: ['L7', 'L3'],
    default: ['L1', 'L3', 'L2']
  };

  return recommendations[taskType] || recommendations.default;
}

/* ───────────────────────────────────────────────────────────────
   6. LAYER DOCUMENTATION

   Human-readable documentation for the layer system.
   ──────────────────────────────────────────────────────────────── */

/**
 * Get formatted layer documentation.
 */
export function getLayerDocumentation(): string {
  const lines: string[] = ['# Memory System Layer Architecture\n'];
  lines.push('Progressive disclosure from high-level orchestration to specialized operations.\n');

  for (const layer of getLayersByPriority()) {
    lines.push(`## ${layer.id}: ${layer.name}`);
    lines.push(`**Token Budget:** ${layer.tokenBudget}`);
    lines.push(`**Description:** ${layer.description}`);
    lines.push(`**Use Case:** ${layer.useCase}`);
    lines.push(`**Tools:** ${layer.tools.join(', ')}`);
    lines.push('');
  }

  return lines.join('\n');
}
