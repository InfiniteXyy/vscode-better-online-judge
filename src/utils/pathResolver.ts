import * as vscode from "vscode";
import * as path from "path";

const configFileName = "project.config.json";


export function joinPath(...dirs: string[]) {
  return path.join(...dirs);
}
export function resolveJoinedPath(...dirs: string[]) {
  try {
    let workspacePath = resolveWorkspacePath()
    return path.join(workspacePath, ...dirs);
  } catch (error) {
    throw error;
  }
}

export function resolveWorkspacePath(): string {
  let workspacePath = vscode.workspace.rootPath;
  if (!workspacePath) {
    throw new Error("工作区未打开");
  }
  return workspacePath;
}

export function resolveConfigPath(): string {
  try {
    let workspacePath = resolveWorkspacePath();
    let configPath = path.join(workspacePath, configFileName);
    return configPath;
  } catch (error) {
    throw error;
  }
}
