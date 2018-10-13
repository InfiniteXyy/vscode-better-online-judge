import { Disposable, window, TextDocument, Terminal, workspace } from "vscode";
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

  public run(withSampleInput: boolean) {
    try {
      let config = this._projectManager.readConfig();
      let options = config.homeworkList.map(i => {
        let lang = i.language ? i.language : config.defaultLanguage;
        return {
          description: lang + (withSampleInput ? "  " + `输入: ${i.inputSample}` : ""),
          label: `${i.num}: ${i.title}`,
          path: resolveJoinedPath(`${i.num}.${lang}`),
          lang: lang,
          input: withSampleInput ? i.inputSample : undefined
        };
      });
      window.showQuickPick(options).then(value => {
        try {
          if (value) {
            this.runCode(value.path, value.lang, value.input);
          }
        } catch (error) {
          showInfo(error.message);
        }
      });
    } catch (error) {
      showInfo(error.message);
    }
  }

  public runCurrentCode() {
    try {
      let document = this.getActiveFile();
      document.save();
      this.runCode(document.uri.fsPath, document.languageId);
    } catch (error) {
      showInfo(error.message);
    }
  }

  private runCode(uri: string, languageId: string, sampleInput?: string) {
    createDir("out");
    let term = this.selectTerminal();
    term.show();
    let fileName = uri.toString().replace(/^.*[\\\/]/, "");
    let _config = workspace.getConfiguration("better-oj");
    let compileCommands = _config.get<any>("executeMap");
    if (!compileCommands || !compileCommands.hasOwnProperty(languageId)) {
      throw new Error(languageId + " 未支持");
    }
    let command = compileCommands[languageId];
    let outName = fileName.split(".")[0] + ".out";
    let outPath = resolveJoinedPath("out", outName ? outName : "out");
    term.sendText(`${command} "${uri}" -o "${outPath}"`);
    term.sendText(joinPath("out", `${outName}`));
    if (sampleInput) {
      term.sendText(sampleInput);
    }
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
