import { exec, execSync, ExecSyncOptionsWithBufferEncoding } from "child_process";

export function runCommand(command: string, args: string[], options: ExecSyncOptionsWithBufferEncoding = {}) {
  exec(command + ["", ...args].join(" "), { stdio: "inherit", ...options });
}

export function runCommandSync(command: string, args: string[], options: ExecSyncOptionsWithBufferEncoding = {}) {
  execSync(command + ["", ...args].join(" "), { stdio: "inherit", ...options });
}

export const isRunningAsync = (query: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const platform = process.platform;
    let cmd = "";
    switch (platform) {
      case "win32":
        cmd = `tasklist`;
        break;
      case "darwin":
        cmd = `ps -ax | grep ${query}`;
        break;
      case "linux":
        cmd = `ps -A`;
        break;
      default:
        break;
    }
    exec(cmd, (err, stdout, stderr) => {
      if (stderr) reject(stderr);
      else resolve(stdout.toLowerCase().indexOf(query.toLowerCase()) > -1);
    });
  });
};

export const instancesRunning = (query: string): number => {
  const stdout = execSync("tasklist").toString();
  const lines = stdout.split("\n");
  const count = lines.reduce((prev, curr) => {
    return prev + (curr.includes(query) ? 1 : 0);
  }, 0);
  return count;
};

export const isRunning = (query: string): boolean => {
  return instancesRunning(query) !== 0;
};
