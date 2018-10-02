import { commands, ExtensionContext } from "vscode";
import { ConfigManager } from "./configManager";
import { CodeGenerater } from "./codeGenerater";
import { CodeRunnder } from "./codeRunner";

export function activate(context: ExtensionContext) {
  console.log('Congratulations, "Better Online Judge" now active!');
  const configManager = new ConfigManager();
  const codeGenerater = new CodeGenerater();
  const codeRunnder = new CodeRunnder();
  let initConfig = commands.registerCommand("betterOJ.initConfig", () => {
    configManager.createConfig();
  });
  let generater = commands.registerCommand("betterOJ.generateProject", () => {
    let config = configManager.readConfig();
    if (config) {
      codeGenerater.generateSource(config);
    }
  });
  let runCode = commands.registerCommand("betterOJ.testMyAnswer", () => {
    codeRunnder.run();
  });
  // The command has been defined in the package.json file
  context.subscriptions.push(initConfig);
  context.subscriptions.push(generater);
  context.subscriptions.push(runCode);
}

export function deactivate() { }
