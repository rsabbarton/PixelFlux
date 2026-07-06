import { readFileSync, writeFileSync } from "fs";

const mainConfig = JSON.parse(readFileSync("./live/config/main.json", "utf8"));
mainConfig.releaseDate = new Date().toISOString().split("T")[0];
writeFileSync("./live/config/main.json", JSON.stringify(mainConfig, null, 2));
