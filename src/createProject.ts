import inquirer from "inquirer";
import ora from "ora";
import fs from "fs-extra";

import downloadLocal from "./download.js";

type InputData = {
  projectName: string;
  packageName: string;
  platform: string;
  type: "whole" | "main";
};

function createProject() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "请输入文件名(创建文件夹的名称)",
        name: "projectName",
        default: "PA-Project",
      },
      {
        type: "input",
        message: "请输入项目名(package.json中的name)",
        name: "packageName",
        default: "PA-Project",
      },
      {
        type: "input",
        message: "请输入PLATFORM",
        name: "platform",
        default: "PA-Project",
      },
      {
        type: "list",
        message: "请选择项目分类",
        name: "type",
        choices: [
          {
            value: "main",
            name: "基础项目(只有项目配置以及login)",
          },
          {
            value: "whole",
            name: "复杂项目(有常见的页面)",
          },
        ],
      },
    ])
    .then(async (data: InputData) => {
      const { projectName, packageName, platform, type } = data;

      // 检查文件名是否存在
      if(fs.pathExistsSync(projectName)){
        return console.log('创建失败,文件已存在!');
      }

      const loading = ora();
      loading.start("从gitlab获取代码 ...");

      // 把代码复制下来
      const res: any = await downloadLocal(projectName, type);

      if (res === "success") {
        loading.succeed("获取代码成功");
      } else {
        loading.fail("获取代码失败");
      }

      loading.start("初始化项目 ...");
      try {
        // 修改package.json
        const packageFileName: string = `${projectName}/package.json`;
        const packageJson = fs.readJsonSync(packageFileName);
        packageJson.name = packageName;
        fs.writeJsonSync(packageFileName, packageJson, { spaces: 2 });

        // 修改platform
        const umiFileName: string = `${projectName}/.umirc.ts`;
        const umiConfig = fs.readFileSync(umiFileName, "utf-8");
        fs.outputFileSync(umiFileName, umiConfig.replaceAll("Demo", platform));

        // 修改plugins/moveFiles.js
        const moveFileName: string = `${projectName}/plugins/moveFiles.js`;
        const moveFile = fs.readFileSync(moveFileName, "utf-8");
        fs.outputFileSync(moveFileName, moveFile.replaceAll("Demo", platform));

        loading.succeed("初始化项目完成");
      } catch (error) {
        loading.fail("初始化项目失败");
      }
    });
}

export default createProject;
