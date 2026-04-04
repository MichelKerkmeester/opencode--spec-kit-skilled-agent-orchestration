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
/**
 * Defines the LAYER_DEFINITIONS constant.
 */
export declare const LAYER_DEFINITIONS: Record<LayerId, LayerDefinition>;
/**
 * Defines the TOOL_LAYER_MAP constant.
 */
export declare const TOOL_LAYER_MAP: Record<string, LayerId>;
/**
 * Get the layer ID for a tool.
 */
export declare function getLayerForTool(toolName: string): LayerId | null;
/**
 * Get the layer prefix for a tool's description.
 * CHK-073: Tool descriptions include layer prefix.
 */
export declare function getLayerPrefix(toolName: string): string;
/**
 * Enhance a tool description with layer information.
 * CHK-073: Adds layer prefix to description.
 */
export declare function enhanceDescription(toolName: string, description: string): string;
/**
 * Get the token budget for a tool.
 */
export declare function getLayerTokenBudget(toolName: string): number;
/**
 * Get the token budget for a tool.
 */
export declare function getTokenBudget(toolName: string): number;
/**
 * Get layer information for a tool.
 */
export declare function getLayerInfo(toolName: string): LayerDefinition | null;
/**
 * Get all layers in priority order.
 */
export declare function getLayersByPriority(): LayerDefinition[];
/**
 * Get layer usage guidance based on task.
 * CHK-074: Progressive disclosure from Orchestration to Analysis layers.
 */
export declare function getRecommendedLayers(taskType: TaskType): LayerId[];
/**
 * Get formatted layer documentation.
 */
export declare function getLayerDocumentation(): string;
//# sourceMappingURL=layer-definitions.d.ts.map