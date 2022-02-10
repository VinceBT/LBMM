import { Service } from "typedi";

import { Configuration } from "../settings/Configuration";
import { Logger } from "../settings/Logger";
import { Settings } from "../settings/Settings";
import { runCommand } from "../utils/processes";

import { ActiveWindowListener } from "./ActiveWindowListener";
import { TrayManager } from "./TrayManager";

@Service()
export class LittleBigMouseManager {
  private isLBMOn = this.settings.initial;

  constructor(
    private logger: Logger,
    private configuration: Configuration,
    private settings: Settings,
    private trayManager: TrayManager,
    private activeWindowListener: ActiveWindowListener,
  ) {
    logger.log(`Environment detected: ${configuration.environment}`);

    activeWindowListener.addListener((activeWindow) => {
      if (activeWindow) {
        const activeWindowName = activeWindow.window.path || "Transitioning between windows";
        logger.log(`Focused window (watched=${activeWindow.isWatched ? "true" : "false"}): ${activeWindowName}`);
      }
      if (activeWindow && !activeWindow.isWatched) {
        this.turnOnLBM();
      } else {
        this.turnOffLBM();
      }
    });
  }

  private turnOnLBM() {
    if (this.isLBMOn) return;
    this.isLBMOn = true;
    runCommand(this.settings.daemon, "--start");
    this.logger.log("Turned on");
  }

  private turnOffLBM() {
    if (!this.isLBMOn) return;
    this.isLBMOn = false;
    runCommand(this.settings.daemon, "--stop");
    this.logger.log("Turned off");
  }
}
