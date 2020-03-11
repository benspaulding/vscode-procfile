/**
 * Extension module - main entry point for VS Code to run the Procfile extension.
 * @module extension
 */

import * as vsc from "vscode";
import {
	diagnosticCollection,
	procfileChangeHandler,
	procfileCloseHandler,
	procfileOpenHandler,
} from "./diagnostics";
import {
	ProcfileDocumentFormat,
	ProcfileDocumentRangeFormat,
	ProcfileOnTypeFormat,
} from "./formatters";
import { ProcfileHover } from "./hovers";
import * as re from "./core/re";
import { ProcfileDocumentSymbol } from "./symbols";

/** Any Procfile (syntax highlighting and validation). */
const PROCFILE_LANG = { language: "procfile" };

export function activate(context: vsc.ExtensionContext): void {
	context.subscriptions.push(
		vsc.languages.registerDocumentSymbolProvider(
			PROCFILE_LANG,
			new ProcfileDocumentSymbol(),
		),
		vsc.languages.registerHoverProvider(PROCFILE_LANG, new ProcfileHover()),
		vsc.languages.registerDocumentFormattingEditProvider(
			PROCFILE_LANG,
			new ProcfileDocumentFormat(),
		),
		vsc.languages.registerDocumentRangeFormattingEditProvider(
			PROCFILE_LANG,
			new ProcfileDocumentRangeFormat(),
		),
		vsc.languages.registerOnTypeFormattingEditProvider(
			PROCFILE_LANG,
			new ProcfileOnTypeFormat(),
			re.sep.source,
			re.comment.source,
		),
		diagnosticCollection,
		vsc.workspace.onDidOpenTextDocument(procfileOpenHandler),
		vsc.workspace.onDidChangeTextDocument(procfileChangeHandler),
		vsc.workspace.onDidCloseTextDocument(procfileCloseHandler),
	);
}
