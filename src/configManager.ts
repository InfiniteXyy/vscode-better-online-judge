import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
export class ConfigManager implements vscode.Disposable {
  public dispose() {
    console.log("dispose");
  }
  public generateFile() {
    let workspacePath = vscode.workspace.rootPath;
    if (!workspacePath) {
      vscode.window.showErrorMessage("请先打开项目文件夹");
      return;
    }
    let configPath = path.join(workspacePath, "project.config.js");
    fs.writeFileSync(configPath, "123", "utf8");
    vscode.window.showInformationMessage("init config: " + workspacePath);
  }
}
