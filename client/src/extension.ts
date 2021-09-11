import { commands, ConfigurationTarget, ExtensionContext, languages, window, workspace } from "vscode";
import { LanguageClient } from "vscode-languageclient/node";

import { createLanguageClient } from "./client";
import { HoverProvider } from "./language/hover";
import { ws2812SignatureHelpProvider } from "./language/signature";

let client: LanguageClient;

export function activate(context: ExtensionContext): void {

	let { activeTextEditor } = window;
	
	// Reset
	function reset() {

	}

	// Language document hover provider
	languages.registerHoverProvider("ws2812", new HoverProvider());
	languages.registerSignatureHelpProvider("ws2812", new ws2812SignatureHelpProvider(), "(", " ", ",");
	
	// Create the language client and start the client.
	client = createLanguageClient(context);
	client.start();
}

export function deactivate(): Thenable<void> | undefined {
	// Stop the language client.
	return client?.stop();
}