import fs from "fs";
import path from "path";
import YAML from "yaml";

/** Reads docs/openapi.yaml (resolved from the working directory so it also works from the compiled dist/ folder). */
export function loadOpenApiSpec(): Record<string, unknown> {
  const file = path.resolve(process.cwd(), "docs/openapi.yaml");
  try {
    return YAML.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return { openapi: "3.0.3", info: { title: "BK E-Learning API", version: "1.0.0" }, paths: {} };
  }
}
