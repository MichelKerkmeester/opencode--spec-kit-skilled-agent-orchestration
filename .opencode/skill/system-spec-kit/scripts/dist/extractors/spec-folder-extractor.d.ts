export interface SpecFolderExtraction {
    observations: Array<{
        type: string;
        title: string;
        narrative: string;
        timestamp: string;
        facts: string[];
        files: string[];
        _provenance: 'spec-folder';
        _synthetic: true;
    }>;
    FILES: Array<{
        FILE_PATH: string;
        DESCRIPTION: string;
        _provenance: 'spec-folder';
    }>;
    recentContext: Array<{
        learning: string;
        request: string;
        files: string[];
    }>;
    summary: string;
    triggerPhrases: string[];
    decisions: Array<{
        title: string;
        rationale: string;
        chosen: string;
        _provenance: 'spec-folder';
    }>;
    sessionPhase: string;
}
export declare function extractSpecFolderContext(specFolderPath: string): Promise<SpecFolderExtraction>;
//# sourceMappingURL=spec-folder-extractor.d.ts.map