"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode_1 = require("vscode");
const client_1 = require("./client");
const hover_1 = require("./language/hover");
const signature_1 = require("./language/signature");
let client;
function activate(context) {
    let { activeTextEditor } = vscode_1.window;
    // Reset
    function reset() {
    }
    // Language document hover provider
    vscode_1.languages.registerHoverProvider("ws2812", new hover_1.HoverProvider());
    vscode_1.languages.registerSignatureHelpProvider("ws2812", new signature_1.ws2812SignatureHelpProvider(), "(", " ", ",");
    // Create the language client and start the client.
    client = client_1.createLanguageClient(context);
    client.start();
}
exports.activate = activate;
function deactivate() {
    // Stop the language client.
    return client === null || client === void 0 ? void 0 : client.stop();
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map