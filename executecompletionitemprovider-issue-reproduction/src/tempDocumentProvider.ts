import * as vscode from "vscode";
import * as fs from "fs";
import path from "path";

export default class TempDocumentProvider {
  getActiveTextEditor() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      throw new Error("No open text editor!");
    }

    return editor;
  }

  async getTempDocument() {
    const editor = this.getActiveTextEditor();

    const originalFilepaths = editor.document.uri.fsPath
      .toString()
      .split(path.sep);
    const originalFileName = originalFilepaths[originalFilepaths.length - 1] as string;
    const tempDocumentFileName = "." + originalFileName.split(".")[0] + "-" + new Date().getTime() + ".java";
    originalFilepaths[originalFilepaths.length - 1] = tempDocumentFileName;

    const tempDocumentFilePath = originalFilepaths.join(path.sep);
    const tempDocumentFileContent =
      editor.document.getText(
        new vscode.Range(new vscode.Position(0, 0), editor.selection.active)
      ) + ".";
    await fs.promises.writeFile(
      tempDocumentFilePath,
      tempDocumentFileContent,
      "utf8"
    );

    return await vscode.workspace.openTextDocument(tempDocumentFilePath);
  }

  getLastPosition(doc: vscode.TextDocument) {
    return new vscode.Position(
      doc.lineCount - 1,
      doc.lineAt(doc.lineCount - 1).range.end.character
    );
  }

  async getCompletionItems(doc: vscode.TextDocument) {
    console.log(`Document.uri=${doc.uri}`);
    console.log(`Cursor.position.line=${this.getLastPosition(doc).line + 1}`);
    console.log(
      `Cursor.position.col=${this.getLastPosition(doc).character + 1}`
    );
    console.log(`Document.getText=${doc.getText()}`);
    console.log(`Document.readFile=${(await fs.promises.readFile(doc.uri.fsPath.toString())).toString()}`);
    let completionItems: vscode.CompletionItem[] = [];
    const tempItems = await vscode.commands.executeCommand<
      vscode.CompletionItem[]
    >(
      "vscode.executeCompletionItemProvider",
      doc.uri,
      this.getLastPosition(doc),
      "."
    );
    let completionItemsStr = "";
    completionItems = (tempItems as any).items as vscode.CompletionItem[];
    completionItems.forEach((c) => {
      completionItemsStr += c.detail + "\n";
    });
    vscode.window.showInformationMessage(completionItemsStr);
  }

  async deleteTempDocument(doc: vscode.TextDocument) {
    await fs.promises.unlink(doc.uri.fsPath);
  }
}
