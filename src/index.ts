import { exec } from "child_process";
import { ActiveWindowListener } from "./ActiveWindowListener";
import { Configuration } from "./Configuration";
import { Logger } from "./Logger";

Logger.log(Configuration.Environment);

function run(file: string, args: string[]) {
  exec(file + ["", ...args].join(" "), (error, stdout, stderr) => {
    if (error) {
      throw error;
    }
    if (stdout || stderr) {
      console.log(stdout, stderr);
    }
  });
}

let isOn = Configuration.Settings.default;

function turnOnLBM() {
  if (isOn) return;
  isOn = true;
  run(Configuration.Settings.daemon, Configuration.Settings.arguments.on);
  Logger.log("Turned on");
}

function turnOffLBM() {
  if (!isOn) return;
  isOn = false;
  run(Configuration.Settings.daemon, Configuration.Settings.arguments.off);
  Logger.log("Turned off");
}

function main() {
  const activeWindowListener = new ActiveWindowListener(
    Configuration.Settings.programs,
  );
  activeWindowListener.addListener((activeWindow) => {
    if (activeWindow) {
      Logger.log({
        watched: activeWindow.isWatched,
        path: activeWindow.window.path,
        title: activeWindow.window.getTitle(),
      });
    }
    if (activeWindow && !activeWindow.isWatched) {
      turnOnLBM();
    } else {
      turnOffLBM();
    }
  });
}

main();
