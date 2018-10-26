import Axios from "axios";
import * as cheerio from "cheerio";
import { HomeworkConfig } from "../projectManager";

export async function fetchHomeworkListFromVjudge(url: string) {
  return await Axios.get(url)
    .then(response => {
      return response.data;
    })
    // read homework list
    .then(html => {
      let $ = cheerio.load(html);
      // well formatted details;
      let descriptionObj = JSON.parse($("textarea").text());
      return descriptionObj.problems;
    })
    // read homework detail pages
    .then((list: Array<HomeworkConfig>) => {
      return list.map(item => ({
        num: item.num,
        language: "",
        title: item.title,
        oj: item.oj
      }));
    });
}
