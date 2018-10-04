import { Disposable, window, TextDocument, Terminal } from "vscode";
import { showInfo } from "./utils/message";
import { createDir } from "./utils/file";
import { resolveJoinedPath, joinPath } from "./utils/pathResolver";
import { ProjectManager } from "./projectManager";

export class CodeRunnder implements Disposable {
  dispose() {
    console.log("dispose code runner");
  }
  private _projectManager: ProjectManager;
  constructor(projectManager: ProjectManager) {
    this._projectManager = projectManager;
  }

  public run() {
    try {
      let config = this._projectManager.readConfig();
      let options = config.homeworkList.map(i => {
        let lang = i.language ? i.language : config.defaultLanguage;
        return {
          description: lang,
          label: `${i.num}: ${i.title}`,
          path: resolveJoinedPath(`${i.num}.${lang}`)
        };
      });
      window.showQuickPick(options).then(value => {
        if (value) {
          this.runCode(value.path, value.description);
        }
      });
    } catch (error) {
      showInfo(error.message);
    }
  }

  public runCurrentCode() {
    let document = this.getActiveFile();
    document.save();
    this.runCode(document.uri.fsPath, document.languageId);
  }

  private runCode(uri: string, languageId: string) {
    createDir("out");
    let term = this.selectTerminal();
    term.show();
    let fileName = uri.toString().replace(/^.*[\\\/]/, "");
    let compileCommand = languageId === "c" ? "gcc" : "g++";
    let outName = fileName.split(".")[0] + ".out";
    let outPath = resolveJoinedPath("out", outName ? outName : "out");
    term.sendText(`${compileCommand} ${uri} -o ${outPath}`);
    term.sendText(joinPath("out", `${outName}`));
  }

  private getActiveFile(): TextDocument {
    let editor = window.activeTextEditor;
    if (!editor) {
      throw new Error("没有打开的项目");
    }
    return editor.document;
  }

  private selectTerminal(): Terminal {
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
