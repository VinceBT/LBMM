import path from "path";

import * as ChromeLauncher from "chrome-launcher";
import dialog from "node-native-dialog";
import open from "open";
import portfinder from "portfinder";
import { Service } from "typedi";
import waitOn from "wait-on";
import { WebSocket, WebSocketServer } from "ws";

import { Configuration } from "../settings/Configuration";
import { EventList, EventName, EventPayload, SocketEvent } from "../types/Common";

const devPort = 9000;

@Service()
export class MainDisplayManager {
  public port = 8080;
  public sockets: WebSocket[] = [];
  private events: EventList = [];

  constructor(private configuration: Configuration) {
    this.initialize(); // Ignore await
  }

  private async initialize() {
    this.port = await portfinder.getPortPromise();
    const wss = new WebSocketServer({
      port: this.port,
    });

    wss.on("connection", (ws) => {
      this.sockets.push(ws);
      ws.on("message", (data) => {
        console.log("Received: %s", data);
      });
      this.events.forEach((event) => {
        MainDisplayManager.sendEventAsJSON(ws, event);
      });
    });

    if (this.configuration.isDevelopment()) await this.openWindow();
  }

  public async openWindow() {
    const endpoint = this.configuration.isDevelopment()
      ? `http://localhost:${devPort}`
      : path.join(process.cwd(), "public/index.html");
    await waitOn({
      resources: [endpoint],
    });
    /*
    runCommand(chromium.path, [`--app=${endpoint}?port=${this.port}`, "--window-size=1200,800"], {
      env: {
        GOOGLE_API_KEY: "no",
        GOOGLE_DEFAULT_CLIENT_ID: "no",
        GOOGLE_DEFAULT_CLIENT_SECRET: "no",
      },
    });
    */
    const installations = ChromeLauncher.Launcher.getInstallations();
    if (installations.length === 0) {
      dialog
        .show({
          title: "Chrome installation required",
          msg: "You need a chrome installation in order to see the debugger",
          buttons: dialog.OK_CANCEL,
          defaultButton: dialog.RIGHT,
        })
        .then((result: string) => {
          if (result === dialog.RESULT_OK) {
            open("https://www.google.com/chrome");
          }
        });
    } else {
      const chrome = await ChromeLauncher.launch({
        chromeFlags: [`--app=${endpoint}?port=${this.port}`, "--window-size=1200,800"],
      });
      console.log(`Chrome debugging port running on ${chrome.port}`);
    }
  }

  public sendString(value: string) {
    this.sendEvent("message", value);
  }

  public sendEvent(name: EventName, payload: EventPayload) {
    const event: SocketEvent = { name, payload };
    this.events.push(event);
    this.sockets.forEach((ws) => {
      MainDisplayManager.sendEventAsJSON(ws, event);
    });
  }

  private static sendEventAsJSON(ws: WebSocket, event: SocketEvent) {
    ws.send(JSON.stringify(event));
  }
}
