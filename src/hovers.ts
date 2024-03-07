/**
 * Hovers module - structures & logic necessary for showing information to the user
 * when they hover over relevant parts of a Procfile.
 * @module hovers
 */

import * as vsc from 'vscode';
import * as re from './core/re';
import * as special from './core/special';

/**
 * Format a message about particular process names for the user.
 *
 * Note that currently the vsc.MarkdownString this result is consumed by should have
 * `supportThemeIcons=true`.
 * @param msg - Object to be formatted into a Markdown text string.
 * @access package
 */
function formatMsg(msg: special.Msg): string {
	return `$(info) **${msg.provider}**: ${msg.text} ([docs](${msg.docUrl}))`;
}

export class ProcfileHover implements vsc.HoverProvider {
	async provideHover(
		document: vsc.TextDocument,
		position: vsc.Position,
	): Promise<vsc.Hover | undefined> {
		// Is user hovering over a process name?
		const wordRange = document.getWordRangeAtPosition(position, re.NAME);
		if (!wordRange) {
			return undefined;
		}

		// Is user hovering over a *special* process name?
		const specialName = special.PROCESS_NAMES.find(
			(processName) => processName.name === document.getText(wordRange),
		);
		if (!specialName) {
			return undefined;
		}

		// Show a message for the special name being hovered.
		const msgs = specialName.msgs.map((msg) => formatMsg(msg)).join('\n\n');
		const markdownMsgs = new vsc.MarkdownString(msgs, true);
		return new vsc.Hover(markdownMsgs);
	}
}
