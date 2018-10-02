import { commands, ExtensionContext } from "vscode";
import { ConfigManager } from "./configManager";

export function activate(context: ExtensionContext) {
  console.log('Congratulations, "Better Online Judge" now active!');
  const configManager = new ConfigManager();
  let initConfig = commands.registerCommand("extension.initConfig", () => {
    configManager.generateFile();
  });
  // The command has been defined in the package.json file
  context.subscriptions.push(initConfig);
}

export function deactivate() {}
