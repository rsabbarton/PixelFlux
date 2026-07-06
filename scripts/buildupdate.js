import { readFileSync, writeFileSync } from "fs";

const mainConfig = JSON.parse(readFileSync("./src/config/main.json", "utf8"));
mainConfig.build += 1;
writeFileSync("./src/config/main.json", JSON.stringify(mainConfig, null, 2));

const packageJson = JSON.parse(readFileSync("./package.json", "utf8"));
packageJson.version = mainConfig.version;
writeFileSync("./package.json", JSON.stringify(packageJson, null, 2));
