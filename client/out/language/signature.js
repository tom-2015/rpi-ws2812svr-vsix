"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ws2812SignatureHelpProvider = void 0;
const vscode_1 = require("vscode");
const snippets = require("../../../snippets/snippets.json");
class ws2812SignatureHelpProvider {
    provideSignatureHelp(document, position, token) {
        var line = document.lineAt(position).text.trim();
        if (line.charAt(0) != '#') { //check if the line is a comment
            var pos = line.indexOf(" ");
            if (pos <= 0)
                pos = line.length;
            var funct_name = line.substr(0, pos).trim(); //get the function name
            //var before_cursor: string = line.substr(0, position.character);
            var arg_index = 0;
            var active_parameter = 0;
            var index = 0;
            var in_string = false;
            var prev_char = "";
            var char = "";
            var argvalues = [];
            var active_signature = 0;
            //parse arguments
            while (index < line.length) {
                char = line[index];
                if (!in_string) {
                    if (char == '#')
                        break; //exit on comments start
                    switch (char) {
                        case '"':
                            in_string = true;
                            break;
                        case ',':
                            if (index < position.character)
                                active_parameter++;
                            arg_index++;
                            argvalues[arg_index] = "";
                            break;
                        case '(':
                        case ')':
                            break;
                        default:
                            argvalues[arg_index] += char;
                            break;
                    }
                }
                else {
                    if (char == '"' && prev_char != "\\") {
                        in_string = false;
                    }
                    else {
                        if (char != "\\" || prev_char == "\\") {
                            argvalues[arg_index] += char;
                        }
                    }
                }
                prev_char = char;
                index++;
            }
            //trim all arguments
            for (var i = 0; i < argvalues.length - 1; i++)
                argvalues[i] = argvalues[i].trim();
            if (funct_name != "") {
                //determine the signature index
                switch (funct_name) {
                    case 'setup':
                        if (argvalues.length >= 3 && argvalues[2] == "99") { //virtual channel
                            active_signature = 2;
                        }
                        else if (argvalues.length >= 3 && parseInt(argvalues[2]) >= 12) { //SPI SK9822 channel
                            active_signature = 1;
                        }
                        break;
                }
                const snippet = snippets[funct_name];
                if (!snippet || !snippet.signatures.length || snippet.signatures.length == 0)
                    return null;
                var signature = new vscode_1.SignatureHelp(); //https://vshaxe.github.io/vscode-extern/vscode/SignatureHelp.html
                signature.activeParameter = active_parameter;
                signature.activeSignature = active_signature;
                signature.signatures = [];
                if (snippet.signatures != undefined) {
                    snippet.signatures.forEach(sig_info => {
                        var signature_info = new vscode_1.SignatureInformation(sig_info.label, new vscode_1.MarkdownString(sig_info.documentation, true));
                        signature.signatures.push(signature_info);
                        signature_info.parameters = [];
                        sig_info.parameters.forEach(param_info => {
                            signature_info.parameters.push(new vscode_1.ParameterInformation(param_info.label, new vscode_1.MarkdownString(param_info.documentation, true)));
                        });
                    });
                }
                return signature;
                //https://vshaxe.github.io/vscode-extern/vscode/SignatureInformation.html
                //new SignatureInformation ("label:String", "initializes a new channel") ]; 
                //https://vshaxe.github.io/vscode-extern/vscode/ParameterInformation.html
                //signature.signatures[0].parameters = [new ParameterInformation("param 1", "doc param 1"),
                //                                    new ParameterInformation("param 2", "doc param 2")];
                //return signature;
            }
        }
    }
}
exports.ws2812SignatureHelpProvider = ws2812SignatureHelpProvider;
//# sourceMappingURL=signature.js.map