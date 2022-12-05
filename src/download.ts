import downloadGit from "download-git-repo";

const downloadLocal = async (projectName: string, branch: string) => {
  return new Promise((resolve, reject) => {
    //projectName 为下载到的本地目录
    downloadGit(
      `direct:https://gitlab.iglooinsure.com/axinan/fe/pa-template.git#${branch}`,
      projectName,
      { clone: true },
      (err) => {
        if (err) {
          reject(err);
        }
        resolve("success");
      }
    );
  });
};

export default downloadLocal;
