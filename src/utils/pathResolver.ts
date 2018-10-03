import * as vscode from "vscode";
import * as path from "path";

const configFileName = "project.config.json";

export function joinPath(...dirs: string[]) {
  return path.join(...dirs);
}
function resolveWorkspacePath(): string {
  let workspacePath = vscode.workspace.rootPath;
  if (!workspacePath) {
    throw new Error("工作区未打开");
  }
  return workspacePath;
}

export function resolveJoinedPath(...dirs: string[]) {
  let workspacePath = resolveWorkspacePath();
  return path.join(workspacePath, ...dirs);
}

export function resolveConfigPath(): string {
  let workspacePath = resolveWorkspacePath();
  let configPath = path.join(workspacePath, configFileName);
  return configPath;
}
