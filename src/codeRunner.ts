import { Disposable, window, TextDocument, Terminal } from "vscode";
import { showInfo } from "./utils/message";
import { createDir } from "./utils/file";
import { resolveJoinedPath, joinPath } from "./utils/pathResolver";

export class CodeRunnder implements Disposable {
  dispose() {
    console.log("dispose code runner");
  }

  public run() {
    let document = this.getActiveFile();
    if (document) {
      createDir("out");
      let term = this.selectTerminal();
      term.show();
      let compileCommand = document.languageId === "c" ? "gcc" : "g++";
      let fileName = document.uri.path.replace(/^.*[\\\/]/, '');
      let outName = fileName.split(".")[0];
      let outPath = resolveJoinedPath("out", outName ? outName : "out");
      term.sendText(`${compileCommand} ${document.uri.fsPath} -o ${outPath}`);
      term.sendText(joinPath("out", `${outName}.exe`));
    }
  }

  private getActiveFile() : TextDocument | undefined {
    let editor = window.activeTextEditor;
    if (editor) {
      return editor.document;
    } else {
      showInfo("no active text editor");
    }
  }

  private selectTerminal() : Terminal {
    let term;
    if (window.terminals.length === 0) {
      term = window.createTerminal("acm");
    } else {
      term = window.terminals[0];
    }
    term.show();
    return term;
  }
}