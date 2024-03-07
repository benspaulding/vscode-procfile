/**
 * @summary Procfile module
 * @module procfile
 * @see module:re
 * @description
 * # Anatomy of a Procfile
 *
 * A Procfile has only two kinds of lines:
 *
 * - Process Definitions
 * - Comments (everything that is *not* a Process Definition)
 *
 * ## Anatomy of a Process Definition:
 *
 * ```
 *        web: django-admin runserver
 *        ^ ^^^^                    ^
 *        |_||||____________________|
 *       / | \\______       |       \
 *     /|  |  \\_    \      |        \
 *   /  | name | \ blank?  cmd?       \
 *  |   |     sep \                   |
 *  |   |_________|                   |
 *  |        |                        |
 *  |      intro                      |
 *  |_________________________________|
 *                   |
 *              process def
 * ```
 */

import * as re from './re';

/**
 * A Procfile, in the abstract (think of buffer instead of a file on disk.)
 */
export class Procfile {
	readonly lines: Line[];

	/**
	 * Create a Procfile.
	 * @param lines - The lines of text within the Procfile.
	 */
	private constructor(...lines: Line[]) {
		this.lines = lines;
	}

	/**
	 * Create a Procfile from a block of text.
	 * @param text - Text to parse.
	 */
	static fromString(text: string): Procfile {
		return new Procfile(...text.split(/\r?\n/).map((line, i) => new Line(i, line)));
	}

	/** Return the Procfile as a string. */
	toString(): string {
		return this.lines.map((line) => line.val.toString()).join('');
	}

	/**
	 * Get all of the process definitions within the Procfile.
	 * @todo Somehow annotate return value to be Lines whose val is a ProcessDef.
	 */
	get processDefLines(): Line[] {
		return this.lines.filter((line) => line.val instanceof ProcessDef);
	}

	/** An array containing tuples of [def, [defWithSameName, ...]]. */
	get conflicts(): [Line, Line[]][] {
		// Save this property because we are going to iterate over it twice.
		const lines = this.processDefLines;

		// Turn the array of lines into an array containg a tuple with ...
		const paired = lines.map((a): [Line, Line[]] => [
			a, // ... the given line ...
			lines // ... and an array of other lines with the same name.
				.filter((b) => b !== a)
				.filter((b) => (b.val as ProcessDef).name === (a.val as ProcessDef).name),
		]);

		// Filter down to only lines that actually have conflicts.
		return paired.filter(([, twins]) => twins.length);
	}
}

/** A line that is part of a Procfile. */
class Line {
	readonly num: number;
	readonly val: Text;

	/**
	 * Create a Line.
	 * @param num - Location of the line.
	 * @param val - Object representing the contents of the line.
	 */
	constructor(num: number, val: string) {
		this.num = num;
		this.val = ProcessDef.fromString(val);
	}
}

/** A simple line of text. */
interface Text {
	/** @todo Ensure there are no new lines within text. */
	readonly text: string;
}

/** A comment line. */
export class Comment implements Text {
	readonly text: string;

	constructor(text = '') {
		this.text = text;
	}
}

/** A process definition line. */
export class ProcessDef implements Text {
	readonly text: string;
	readonly name: string;
	readonly sep: string;
	readonly blank?: string;
	readonly cmd?: string;

	/**
	 * Create a ProcessDef.
	 * @param text - Exact text used to create the ProcesDef.
	 * @param name - Name portion of the process definition.
	 * @param sep  - Sep(arator) in the process definition.
	 * @param blank - Separating whitespace (blank) in the process definition.
	 * @param cmd - Command portion of the process definition.
	 */
	private constructor(
		text: string,
		name: string,
		sep: string = re.sep.source,
		blank?: string,
		cmd?: string,
	) {
		this.text = text;
		this.name = name;
		this.sep = sep;
		this.blank = blank;
		this.cmd = cmd;
	}

	/**
	 * Create a ProcessDef or a Comment from a bit of text.
	 * @param text - Text to parse.
	 */
	static fromString(text: string): ProcessDef | Comment {
		const match = text.match(re.PDEF);
		if (match && match.groups) {
			const { name, sep, blank, cmd } = match.groups;
			return new ProcessDef(match[0], name, sep, blank, cmd);
		}
		// NOTE: This match/if dance is not necessary, but it feels thorough.
		// It would be nice if just to validate that everything is either a ProcessDef
		// or Comment, and error if not.
		// const comment = text.match(re.IGNORED);
		// if (comment) {
		return new Comment(text);
		// }
	}

	/** Return the ProcessDef as a string. */
	toString(): string {
		return ProcessDef.fmtString(this.text);
	}

	/**
	 * Format a string of text as a process definition, if possible.
	 * @param text - The text to format.
	 * @param insertSpaces - Use a space instead of a tab.
	 * @returns - The formatted string or `text` unchanged.
	 */
	static fmtString(text: string, insertSpace = true): string {
		const match = text.match(re.PDEF);
		if (match && match.groups) {
			const { name, sep, cmd } = match.groups;
			return `${name}${sep}${insertSpace ? ' ' : ''}${cmd}`;
		}
		return text;
	}
}
