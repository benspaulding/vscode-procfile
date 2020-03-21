/**
 * Diagnostics module - structures & logic for sending diagnostic info to the editor.
 * @module diagnostics
 */

import * as vsc from "vscode";
import * as core from "./core";
import * as re from "./core/re";

/**
 * Limit of number of diagnostic results to return.
 * VS Code only shows the first thousand, but there is no need for that. If your
 * Procfile has more than a thousand errors you have bigger problems.
 * @access package
 */
const LIMIT = 100;

export const diagnosticCollection = vsc.languages.createDiagnosticCollection(
	"procfile",
);

export async function procfileOpenChangeHandler(
	documentish: vsc.TextDocument | vsc.TextDocumentChangeEvent,
): Promise<void> {
	const document = (documentish as vsc.TextDocumentChangeEvent).document || documentish;
	if (document.languageId === "procfile") {
		diagnosticCollection.delete(document.uri);
		diagnosticCollection.set(document.uri, await getDiagnostics(document));
	}
}

export async function procfileCloseHandler(document: vsc.TextDocument): Promise<void> {
	if (document.languageId === "procfile") {
		diagnosticCollection.delete(document.uri);
	}
}

/**
 * Builds an array of diagnostic information for the given document.
 *
 * The only diagnostics provided is a check for duplicate process names.
 * @access package
 */
async function getDiagnostics(document: vsc.TextDocument): Promise<vsc.Diagnostic[]> {
	const procfile = core.Procfile.fromString(document.getText());
	const conflicts = procfile.conflicts.slice(undefined, LIMIT);

	return conflicts.map(([line, twins]) => {
		const diagnostic = new vsc.Diagnostic(
			getNameRange(document, line.num),
			"Process names must be unique within a file.",
		);
		diagnostic.source = "procfile";
		diagnostic.relatedInformation = twins.slice(undefined, LIMIT).map(twin => {
			const range = getNameRange(document, twin.num);
			return new vsc.DiagnosticRelatedInformation(
				new vsc.Location(document.uri, range),
				`Duplicate process name "${document.getText(range)}"`,
			);
		});
		return diagnostic;
	});
}

/**
 * Get a Range for the process name at the given line number.
 * @throws If a range cannot be found.
 * @access package
 */
function getNameRange(document: vsc.TextDocument, lineNum: number): vsc.Range {
	const range = document.getWordRangeAtPosition(new vsc.Position(lineNum, 0), re.NAME);
	if (range === undefined) {
		throw Error(
			`Range not found for process name at ${document.uri.fsPath}:${lineNum}`,
		);
	}
	return range;
}
