/** Workflow pattern type */
export type WorkflowPattern = 'linear' | 'parallel';
/** Diagram classification pattern names */
export type DiagramPatternName = 'Linear Sequential' | 'Decision Branch' | 'Parallel Execution' | 'Nested Sub-Process' | 'Approval Gate' | 'Loop/Iteration' | 'Multi-Stage Pipeline' | 'Unknown';
/** Complexity level for diagrams */
export type ComplexityLevel = 'Low' | 'Medium' | 'High';
/** A workflow phase with activities.
 * Structural interface satisfied by both PhaseEntry (diagram-extractor) and
 * ConversationPhase (conversation-extractor) without requiring an index signature. */
export interface Phase {
    PHASE_NAME?: string;
    DURATION?: string;
    ACTIVITIES?: string[];
    TRANSITION_TRIGGER?: string;
}
/** Detailed phase with computed fields */
export interface PhaseDetail {
    INDEX: number;
    PHASE_NAME: string;
    DURATION: string;
    ACTIVITIES: string[];
    HAS_TRANSITION: boolean;
    FROM_PHASE: string;
    TO_PHASE: string;
    TRANSITION_TRIGGER: string;
}
/** Feature extracted from flowchart analysis */
export interface FlowchartFeature {
    FEATURE_NAME: string;
    FEATURE_DESC: string;
}
/** Classification result for an ASCII diagram */
export interface DiagramClassification {
    pattern: DiagramPatternName;
    complexity: ComplexityLevel;
}
declare const PATTERNS: {
    readonly LINEAR: WorkflowPattern;
    readonly PARALLEL: WorkflowPattern;
};
declare const DIAGRAM_PATTERNS: Record<string, DiagramPatternName>;
declare const COMPLEXITY: Record<string, ComplexityLevel>;
/** Linear (<=4 phases) or parallel (>4 phases) */
declare function detectWorkflowPattern(phases?: Phase[]): WorkflowPattern;
declare function generateConversationFlowchart(phases?: Phase[], initialRequest?: string): string;
declare function generateWorkflowFlowchart(phases?: Phase[]): string | null;
declare function buildPhaseDetails(phases?: Phase[]): PhaseDetail[];
declare function extractFlowchartFeatures(phases?: Phase[], patternType?: string): FlowchartFeature[];
declare function getPatternUseCases(patternType?: string): string[];
/** Classifies ASCII art using 7 core patterns from sk-doc */
declare function classifyDiagramPattern(asciiArt: string): DiagramClassification;
export { generateConversationFlowchart, generateWorkflowFlowchart, detectWorkflowPattern, classifyDiagramPattern, buildPhaseDetails, extractFlowchartFeatures, getPatternUseCases, PATTERNS, DIAGRAM_PATTERNS, COMPLEXITY, };
//# sourceMappingURL=flowchart-generator.d.ts.map