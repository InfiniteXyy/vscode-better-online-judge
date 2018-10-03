import * as vscode from "vscode";
import * as elegentSpinner from "elegant-spinner";
export namespace StatusManager {
  let _intervalTimer: NodeJS.Timer;
  let _timeOutTimer: NodeJS.Timer;
  const frame = elegentSpinner();
  const status = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    0
  );

  export function setLoadingText(text: string) {
    status.show();
    clearInterval(_timeOutTimer);
    clearInterval(_intervalTimer);
    _intervalTimer = setInterval(() => {
      status.text = frame() + " " + text;
    }, 50);
  }

  export function stopLoadingText(text: string) {
    clearInterval(_timeOutTimer);
    clearInterval(_intervalTimer);
    status.text = text;
    _timeOutTimer = setTimeout(() => {
      status.hide();
    }, 3000);
  }
}
