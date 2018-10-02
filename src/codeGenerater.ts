import { ProjectConfig } from "./configManager";
import { writeFileToWorkspace } from "./utils/file";
import { showInfo } from "./utils/message";
import { generateTemplate } from "./utils/template";

export class CodeGenerater {
  public generateSource(config: ProjectConfig) {
    let { homeworkList } = config;
    homeworkList.forEach(i => {
      try {
        writeFileToWorkspace(`${i.title}.cpp`, generateTemplate("cpp"));
      } catch (error) {
        showInfo(error.message);
      }
    });
  }
}
