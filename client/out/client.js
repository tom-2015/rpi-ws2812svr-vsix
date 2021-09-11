"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLanguageClient = void 0;
const path = require("path");
const node_1 = require("vscode-languageclient/node");
function createLanguageClient(context) {
    // The server is implemented in node
    let serverModule = context.asAbsolutePath(path.join("server", "out", "server.js"));
    // The debug options for the server
    // --inspect=6009: runs the server in Node"s Inspector mode so VS Code can attach to the server for debugging
    let debugOptions = { execArgv: ["--nolazy", "--inspect=6009"] };
    // If the extension is launched in debug mode then the debug server options are used
    // Otherwise the run options are used
    let serverOptions = {
        run: { module: serverModule, transport: node_1.TransportKind.ipc },
        debug: {
            module: serverModule,
            transport: node_1.TransportKind.ipc,
            options: debugOptions
        }
    };
    // Options to control the language client
    let clientOptions = {
        // Register the server for plain text documents
        documentSelector: ["ws2812"],
        initializationOptions: {
            dataPaths: [] /*,
            embeddedLanguages: { css: true, javascript: true }*/
        }
    };
    // Create the language client.
    return new node_1.LanguageClient("ws2812", "WS2812 Server", serverOptions, clientOptions);
}
exports.createLanguageClient = createLanguageClient;
//# sourceMappingURL=client.js.map