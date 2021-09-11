import { CancellationToken, SignatureHelpProvider, MarkdownString, Position, TextDocument, SignatureHelp, ProviderResult, SignatureInformation, ParameterInformation} from 'vscode';
import { integer } from 'vscode-languageclient';

const snippets = require("../../../snippets/snippets.json");

export class ws2812SignatureHelpProvider implements SignatureHelpProvider {

    public provideSignatureHelp( document: TextDocument, position: Position, token: CancellationToken): ProviderResult<SignatureHelp> {
		var line = document.lineAt(position).text.trim();

        if (line.charAt(0)!='#'){ //check if the line is a comment
            var pos = line.indexOf(" ");
            if (pos <=0) pos = line.length;
            var funct_name: string = line.substr(0, pos).trim(); //get the function name
            //var before_cursor: string = line.substr(0, position.character);
            var arg_index: integer = 0;
            var active_parameter: integer = 0;
            var index: integer = 0;
            var in_string: boolean = false;
            var prev_char: string = "";
            var char: string="";
            var argvalues: Array<string> = [];
            var active_signature: integer=0;

            //parse arguments
            while (index < line.length){
                char = line[index];
                if (! in_string){
                    if (char == '#') break; //exit on comments start
                    switch (char){
                        case '"':
                            in_string=true;
                            break;
                        case ',':
                            if (index < position.character) active_parameter++;
                            arg_index++;
                            argvalues[arg_index]="";
                            break;
                        case '(':
                        case ')':
                            break;
                        default:
                            argvalues[arg_index]+=char;
                            break;
                    }
                }else{
                    if (char=='"' && prev_char!="\\"){
                         in_string=false;
                    }else{
                        if (char!="\\" || prev_char=="\\"){
                            argvalues[arg_index]+=char;
                        }
                    }
                }
                prev_char = char;
                index++;
            }

            //trim all arguments
            for (var i=0;i<argvalues.length-1;i++) argvalues[i]=argvalues[i].trim();

            if (funct_name!=""){

                //determine the signature index
                switch (funct_name){
                    case 'setup':
                        if (argvalues.length>=3 && argvalues[2]=="99"){ //virtual channel
                            active_signature = 2;
                        }else if (argvalues.length>=3 && parseInt(argvalues[2])>=12){ //SPI SK9822 channel
                            active_signature = 1;
                        }
                        
                        break;

                }

                const snippet = snippets[funct_name];
                if (!snippet || !snippet.signatures.length || snippet.signatures.length==0) return null;

                var signature = new SignatureHelp(); //https://vshaxe.github.io/vscode-extern/vscode/SignatureHelp.html

                signature.activeParameter = active_parameter;
                signature.activeSignature = active_signature;
                signature.signatures = [];
                snippet.signatures.forEach(sig_info => {
                    var signature_info =  new SignatureInformation (sig_info.label , new MarkdownString(sig_info.documentation, true) );
                    signature.signatures.push(signature_info);
                    signature_info.parameters = [];
                    sig_info.parameters.forEach(param_info => {
                        signature_info.parameters.push(new ParameterInformation(param_info.label, new MarkdownString(param_info.documentation, true)));
                    });
                });
                
                return signature;

                //new SignatureInformation ("label:String", "initializes a new channel") ]; //https://vshaxe.github.io/vscode-extern/vscode/SignatureInformation.html

                //https://vshaxe.github.io/vscode-extern/vscode/ParameterInformation.html
                //signature.signatures[0].parameters = [new ParameterInformation("param 1", "doc param 1"),
                //                                    new ParameterInformation("param 2", "doc param 2")];
                //return signature;

            }
        }
    }

}