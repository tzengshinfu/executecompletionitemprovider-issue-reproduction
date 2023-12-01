# About `executecompletionitemprovider-issue-reproduction`

This extension is designed to demonstrate the behavior of the VSCode `openTextDocument` API when opening a content that has already been modified in the same text file, causing the `executeCompletionItemProvider` API to return a list of completion items from the previous content.

## Steps to Reproduce:

1. Clone this repository.
2. Open the extension folder in VSCode [executecompletionitemprovider-issue-reproduction](./executecompletionitemprovider-issue-reproduction/)
3. Run `npm i && tsc -watch -p ./`, then press F5 to launch the extension.
4. In the newly opened [Extension Development Host] window, open the Java project [java-demo](./java-demo/)
5. Open the Java code file for the demo [App.java](./java-demo/src/main/java/com/tzengshinfu/App.java)
6. Click on the code comments multiple times.
7. Observe the output in the VSCode [DEBUG CONSOLE], specifically the values of `Document.getText=` and `Document.readFile=`. They will start showing differences after the second click.
8. You can also compare the temporary file of the Java code [.App.java](./java-demo/src/main/java/com/tzengshinfu/.App.java).
