import { execSync } from "child_process";

export function runCommand(command: string, ...args: string[]) {
  execSync(command + ["", ...args].join(" "), { stdio: "inherit" });
}
