"use strict";
// ---------------------------------------------------------------
// MODULE: Config Barrel
// ---------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllExistingSpecsDirs = exports.findActiveSpecsDir = exports.getSpecsDirectories = exports.CONFIG = void 0;
// ───────────────────────────────────────────────────────────────
// 1. CONFIG BARREL
// ───────────────────────────────────────────────────────────────
// Re-exports CONFIG and spec-directory utilities so that non-core
// modules (extractors, renderers, loaders, etc.) can import from
// '../config' instead of reaching into '../core'.
//
// This eliminates the upward-dependency from extractors → core
// while keeping the canonical implementation in core/config.ts.
var config_1 = require("../core/config");
Object.defineProperty(exports, "CONFIG", { enumerable: true, get: function () { return config_1.CONFIG; } });
Object.defineProperty(exports, "getSpecsDirectories", { enumerable: true, get: function () { return config_1.getSpecsDirectories; } });
Object.defineProperty(exports, "findActiveSpecsDir", { enumerable: true, get: function () { return config_1.findActiveSpecsDir; } });
Object.defineProperty(exports, "getAllExistingSpecsDirs", { enumerable: true, get: function () { return config_1.getAllExistingSpecsDirs; } });
//# sourceMappingURL=index.js.map