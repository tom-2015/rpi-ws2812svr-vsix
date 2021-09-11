import { CancellationToken, Hover, MarkdownString, Position , ProviderResult, TextDocument} from 'vscode';

//import * as CONSTANT from "../constants";

const snippets = require("../../../snippets/snippets.json");

export class HoverProvider implements HoverProvider {

	provideHover(document: TextDocument, position: Position, token: CancellationToken): ProviderResult<Hover> {
		const range = document.getWordRangeAtPosition(position);
		const word = document.getText(range);
		const line = document.lineAt(position).text;

		try {

			if (!snippets[word]){
				return null;
			}
		} catch (error) {
			return null;
		}

		const snippet = snippets[word];

		if (!snippet.description.length) {
			return null;
		}

		const md = new MarkdownString();
		// md.appendCodeblock(word);
		md.appendMarkdown(snippet.description);

		if (snippet.reference) {
			md.appendMarkdown(`\n\r[WS2812 Reference](url)`);
		}
		return new Hover(md);
	}

}