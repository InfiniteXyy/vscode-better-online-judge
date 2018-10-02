import { commands, ExtensionContext } from "vscode";
import { ConfigManager } from "./configManager";
import { CodeGenerater } from "./codeGenerater";

export function activate(context: ExtensionContext) {
  console.log('Congratulations, "Better Online Judge" now active!');
  const configManager = new ConfigManager();
  const codeGenerater = new CodeGenerater();
  let initConfig = commands.registerCommand("betterOJ.initConfig", () => {
    configManager.createConfig();
  });
  let generater = commands.registerCommand("betterOJ.generateProject", () => {
    let config = configManager.readConfig();
    if (config) {
      codeGenerater.generateSource(config);
    }
  });
  let runCode = commands.registerCommand("betterOJ.runCode", () => {
    console.log("runcode");
  });
  // The command has been defined in the package.json file
  context.subscriptions.push(initConfig);
  context.subscriptions.push(generater);
  context.subscriptions.push(runCode);
}

export function deactivate() {}
