import * as vscode from "vscode";
import TempDocumentProvider from "./tempDocumentProvider";

export function activate(_: vscode.ExtensionContext) {
  const provider = new TempDocumentProvider();

  vscode.window.onDidChangeTextEditorSelection(async (_) => {
    //#region Capture single-click event only.
    if (_.selections.length !== 1) {
      return;
    }

    const selection = _.selections[0];

    if (!selection) {
      return;
    }

    if (selection.start.line !== selection.end.line) {
      return;
    }

    if (selection.start.character !== selection.end.character) {
      return;
    }
    //#endregion

    const tempDocument = await provider.getTempDocument();
    await provider.getCompletionItems(tempDocument);
    //await provider.deleteTempDocument(tempDocument);
  });
}

export function deactivate() {}
