import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

export function contentPath(name: string): string {
  return resolve(process.cwd(), "content", name);
}

export function readJson(name: string): unknown {
  return JSON.parse(readFileSync(contentPath(name), "utf8")) as unknown;
}

export function writeJson(name: string, value: unknown): void {
  writeFileSync(contentPath(name), `${JSON.stringify(value, null, 2)}\n`);
}
