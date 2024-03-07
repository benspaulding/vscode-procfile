import * as assert from 'assert';
import * as vscode from 'vscode';

suite('HoverProvider Test Suite', () => {
	vscode.window.showInformationMessage('Running HoverProvider tests …');
	test('First test', () => {
		assert.equal(1, 1);
	});
});
