import type { CollectedDataBase, DecisionOption, DecisionRecord, DecisionData, PhaseEntry, ToolCallEntry, ConversationMessage, ConversationData, DiagramOutput, DiagramData, SessionData, OutcomeEntry } from '../types/session-types';
export type { DecisionOption, DecisionRecord, DecisionData, PhaseEntry, ToolCallEntry, ConversationMessage, ConversationData, DiagramOutput, DiagramData, SessionData, OutcomeEntry, };
/** Timestamp format options */
export type SimTimestampFormat = 'iso' | 'readable' | 'date' | 'date-dutch' | 'time' | 'time-short' | 'filename';
/** Configuration for session data creation */
export interface SessionConfig {
    sessionId?: string;
    specFolder?: string;
    channel?: string;
    skillVersion?: string;
    userMessage?: string;
    assistantMessage?: string;
    title?: string;
    context?: string;
    description?: string;
    [key: string]: unknown;
}
/** Full simulation result */
export interface FullSimulation {
    session: SessionData;
    conversations: ConversationData;
    decisions: DecisionData;
    diagrams: DiagramData;
    phases: PhaseEntry[];
}
/** Collected data that might need simulation.
 * Extends CollectedDataBase (all fields optional via Partial) so the simulation
 * detector shares the same property types as the real pipeline. */
export interface SimCollectedData extends Partial<CollectedDataBase> {
}
/** Simulation metadata */
export interface SimulationMetadata {
    isSimulated?: boolean;
    _simulationWarning?: string;
    [key: string]: unknown;
}
declare function createSessionData(config?: SessionConfig): SessionData;
declare function createConversationData(config?: SessionConfig): ConversationData;
declare function createDecisionData(config?: SessionConfig): DecisionData;
declare function createDiagramData(config?: SessionConfig): DiagramData;
declare function createSimulationFlowchart(initialRequest?: string): string;
declare function createSimulationPhases(): PhaseEntry[];
declare function requiresSimulation(collectedData: SimCollectedData | null): boolean;
export { createConversationData, createSimulationFlowchart, createSimulationPhases, createDiagramData, createSessionData, requiresSimulation, createDecisionData, };
//# sourceMappingURL=simulation-factory.d.ts.map