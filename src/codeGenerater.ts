import { ProjectConfig } from "./configManager";
import { writeFileToWorkspace } from "./utils/file";
import { showInfo } from "./utils/message";
import { generateTemplate } from "./utils/template";

export class CodeGenerater {
  public generateSource(config: ProjectConfig) {
    let { homeworkList, defaultLanguage } = config;

    homeworkList.forEach(i => {
      try {
        let lang = defaultLanguage;
        writeFileToWorkspace(`${i.title}.${lang}`, generateTemplate(lang));
      } catch (error) {
        showInfo(error.message);
      }
    });
  }
}
