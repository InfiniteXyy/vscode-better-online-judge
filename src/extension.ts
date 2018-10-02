import { window, commands, ExtensionContext } from "vscode";

export function activate(context: ExtensionContext) {
  console.log('Congratulations, "Better Online Judge" now active!');

  let deposable = commands.registerCommand("extension.initConfig", () => {
    window.showInformationMessage("init config");
  });
  // The command has been defined in the package.json file
  context.subscriptions.push(deposable);
}

export function deactivate() {}
