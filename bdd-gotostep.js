'use strict';
const vscode = require("vscode");
const fileCheck = require("./out/file-check");

function utf8_to_str(src, off, lim) {  // https://github.com/quicbit-js/qb-utf8-to-str-tiny
  lim = lim == null ? src.length : lim;
  for (var i = off || 0, s = ''; i < lim; i++) {
    var h = src[i].toString(16);
    if (h.length < 2) h = '0' + h;
    s += '%' + h;
  }
  return decodeURIComponent(s);
}

function findStep(step, lines, extension) {
  const fileChecker = fileCheck.getFileChecker(extension);
  if (fileChecker === undefined) { return -1; }
  for (let idx = 0; idx < lines.length; idx++) {
    if (fileChecker(step, lines[idx].trim())) { return idx; }
  }
  fileChecker(step, ''); // clear possible line buffers
  return -1;
}

/** @param {String} step @param {vscode.WorkspaceFolder} workspace @param {String} includeGlob */
async function getStepDef(step, workspace, includeGlob, excludeGlob) {
  const patternInclude = includeGlob ? new vscode.RelativePattern(workspace, includeGlob) : undefined;
  const patternExclude = excludeGlob ? new vscode.RelativePattern(workspace, excludeGlob) : undefined;
  const uris = await vscode.workspace.findFiles(patternInclude, patternExclude);
  for (const uri of uris) {
    const idx = uri.path.lastIndexOf('.');
    if (idx === -1) { continue; }
    const extension = uri.path.substring(idx);
    const lines = utf8_to_str(await vscode.workspace.fs.readFile(uri)).split("\n");
    const lineNr = findStep(step, lines, extension);
    if (lineNr >= 0) {
      return {uri, lineNr};
    }
  }
  return undefined;
}

/** @param {vscode.TextEditor} textEditor @param {Number} line */
const scrollToNewPositon = (textEditor, line) => {
  const position = new vscode.Position(line, 0);
  const range = new vscode.Range(position, position);
  textEditor.revealRange(range, vscode.TextEditorRevealType.InCenterIfOutsideViewport);
  const cursor = new vscode.Selection(position, position);
  vscode.window.activeTextEditor.selections = [cursor];
};

/** @param {vscode.TextEditor} editor */
async function goToDef(editor) {
  const workspace = vscode.workspace.getWorkspaceFolder(editor.document.uri);
  if (workspace === undefined) { return; }
  const configuration = vscode.workspace.getConfiguration('bdd-gotostep', workspace);
  const includeGlob = configuration.get('include');
  const excludeGlob = configuration.get('exclude');
  const step = editor.document.lineAt(editor.selection.active.line).text.trim();
  const result = await getStepDef(step, workspace, includeGlob, excludeGlob);
  if (result === undefined) {
    vscode.window.showErrorMessage("Step not found.");
    return;
  }
  vscode.commands.executeCommand('vscode.open', result.uri)
  .then( () => {
      let editor = vscode.window.activeTextEditor;
      if (!editor) { return; }
      scrollToNewPositon(editor, result.lineNr);
    },
    error => { vscode.window.showErrorMessage(String(error)); }
  );
}

function activate(context) {
  context.subscriptions.push(vscode.commands.registerTextEditorCommand('bdd-gotostep.goToDef', editor => goToDef(editor)) );
}

function deactivate() {
}

module.exports = {
  activate,
  deactivate
};
