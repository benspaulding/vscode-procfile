/**
 * Symbols module - structures & logic for giving symbol information to the editor.
 * @module symbols
 */

import * as vsc from "vscode";
import * as core from "./core";

export class ProcfileDocumentSymbol implements vsc.DocumentSymbolProvider {
	async provideDocumentSymbols(
		document: vsc.TextDocument,
	): Promise<vsc.DocumentSymbol[]> {
		const procfileDoc = core.Procfile.fromString(document.getText());
		return procfileDoc.processDefLines.map(line => {
			const pDef = line.val as core.ProcessDef;
			const fullRange = document.lineAt(line.num).range;
			const nameRange = fullRange.with({
				end: new vsc.Position(line.num, pDef.name.length - 1),
			});
			return new vsc.DocumentSymbol(
				pDef.name,
				pDef.cmd || "",
				vsc.SymbolKind.Function,
				fullRange,
				nameRange,
			);
		});
	}
}
