import * as fs from "fs";
import * as path from "path";

export function fileExistsValidator(filePath: string): boolean {
  try {
    const fullPath = path.resolve("./output_db", `${filePath}.db`);
    console.log(fullPath);
    return fs.existsSync(fullPath) && fs.lstatSync(fullPath).isFile();
  } catch (error) {
    return false;
  }
}
