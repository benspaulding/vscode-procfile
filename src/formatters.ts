/**
 * Formatter module - structures & logic for formatting Procfiles within the editor.
 * @module extension
 */

import * as vsc from 'vscode';
import * as core from './core';
import * as re from './core/re';

export class ProcfileDocumentFormat implements vsc.DocumentFormattingEditProvider {
	async provideDocumentFormattingEdits(
		document: vsc.TextDocument,
	): Promise<vsc.TextEdit[]> {
		return formatDocumentLines(document, 0, document.lineCount);
	}
}

export class ProcfileDocumentRangeFormat
	implements vsc.DocumentRangeFormattingEditProvider
{
	async provideDocumentRangeFormattingEdits(
		document: vsc.TextDocument,
		range: vsc.Range,
	): Promise<vsc.TextEdit[]> {
		return formatDocumentLines(document, range.start.line, range.end.line + 1);
	}
}

export class ProcfileOnTypeFormat implements vsc.OnTypeFormattingEditProvider {
	async provideOnTypeFormattingEdits(
		document: vsc.TextDocument,
		position: vsc.Position,
		ch: string,
	): Promise<vsc.TextEdit[] | undefined> {
		if (
			ch === re.sep.source &&
			document.getWordRangeAtPosition(position, re.INTRO) &&
			vsc.workspace.getConfiguration('procfile').get('insertSpace')
		) {
			return [vsc.TextEdit.insert(position, ' ')];
		}
		return undefined;
	}
}

/**
 * Get an array of edits to make to a document so all lines are in a standard format.
 * @param document - VS Code Document to format.
 * @param start - First line (0-indexed) to format.
 * @param stop - Last line (1-indexed) through which to format.
 * @access package
 */
async function formatDocumentLines(
	document: vsc.TextDocument,
	start: number,
	stop: number,
): Promise<vsc.TextEdit[]> {
	const edits: vsc.TextEdit[] = [];
	let i = start;
	while (i < stop) {
		const line = document.lineAt(i);
		if (!line.isEmptyOrWhitespace && !line.firstNonWhitespaceCharacterIndex) {
			edits.push(
				vsc.TextEdit.replace(
					line.range,
					core.ProcessDef.fmtString(
						line.text,
						vsc.workspace.getConfiguration('procfile').get('insertSpace'),
					),
				),
			);
		}
		i++;
	}
	return edits;
}
