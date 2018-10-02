import * as vscode from "vscode";

export function showInfo(content: string) {
  vscode.window.showInformationMessage(`Better Online Judge - ${content}`);
}

export function showError(content: string) {
  vscode.window.showErrorMessage(`Better Online Judge - ${content}`);
}
