"use strict";
// ───────────────────────────────────────────────────────────────
// MODULE: Index
// ───────────────────────────────────────────────────────────────
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractCodePatterns = exports.generateExtensionGuide = exports.extractKeyFilesWithRoles = exports.extractWhatBuilt = exports.extractMainTopic = exports.hasImplementationWork = exports.buildImplementationGuideData = void 0;
// ───────────────────────────────────────────────────────────────
// 1. INDEX
// ───────────────────────────────────────────────────────────────
// Barrel export for all extractor modules (files, diagrams, conversations, decisions, sessions)
__exportStar(require("./file-extractor"), exports);
__exportStar(require("./diagram-extractor"), exports);
__exportStar(require("./conversation-extractor"), exports);
__exportStar(require("./decision-extractor"), exports);
__exportStar(require("./session-extractor"), exports);
__exportStar(require("../lib/session-activity-signal"), exports);
/** Re-export extractor functions and helpers. */
var implementation_guide_extractor_1 = require("./implementation-guide-extractor");
Object.defineProperty(exports, "buildImplementationGuideData", { enumerable: true, get: function () { return implementation_guide_extractor_1.buildImplementationGuideData; } });
Object.defineProperty(exports, "hasImplementationWork", { enumerable: true, get: function () { return implementation_guide_extractor_1.hasImplementationWork; } });
Object.defineProperty(exports, "extractMainTopic", { enumerable: true, get: function () { return implementation_guide_extractor_1.extractMainTopic; } });
Object.defineProperty(exports, "extractWhatBuilt", { enumerable: true, get: function () { return implementation_guide_extractor_1.extractWhatBuilt; } });
Object.defineProperty(exports, "extractKeyFilesWithRoles", { enumerable: true, get: function () { return implementation_guide_extractor_1.extractKeyFilesWithRoles; } });
Object.defineProperty(exports, "generateExtensionGuide", { enumerable: true, get: function () { return implementation_guide_extractor_1.generateExtensionGuide; } });
Object.defineProperty(exports, "extractCodePatterns", { enumerable: true, get: function () { return implementation_guide_extractor_1.extractCodePatterns; } });
__exportStar(require("./collect-session-data"), exports);
__exportStar(require("./contamination-filter"), exports);
__exportStar(require("./quality-scorer"), exports);
__exportStar(require("./spec-folder-extractor"), exports);
__exportStar(require("./git-context-extractor"), exports);
//# sourceMappingURL=index.js.map