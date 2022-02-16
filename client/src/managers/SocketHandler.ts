import { EventEmitter } from "events";

import { Service } from "typedi";

import { EventName } from "../../../server/src/types/Common";

@Service()
export class SocketHandler {
  private eventEmitter = new EventEmitter.EventEmitter();
  private webSocket?: WebSocket;

  public addListener(event: EventName, callback: (str: string) => void) {
    this.eventEmitter.addListener(event, callback);
  }

  public removeListener(event: EventName, callback: (str: string) => void) {
    this.eventEmitter.removeListener(event, callback);
  }

  public removeAllListeners() {
    this.eventEmitter.removeAllListeners();
  }

  public clean() {
    if (this.webSocket) {
      this.webSocket.close();
      this.webSocket = undefined;
    }
  }

  public connect(port: number) {
    const webSocket = new WebSocket(`ws://localhost:${port}/`);
    this.webSocket = webSocket;
    webSocket.onopen = () => {
      webSocket.send("Hi this is the client speaking through the server !");
    };
    webSocket.onmessage = (event) => {
      let eventName: EventName = "message";
      let eventData = event.data;
      try {
        const json = JSON.parse(event.data);
        eventName = json.name;
        eventData = json.payload;
      } catch (e) {}
      console.log(eventName, eventData);
      this.eventEmitter.emit(eventName, eventData);
    };
    webSocket.onclose = (event) => {
      if (!event.wasClean) {
        window.close();
      }
    };
  }
}
