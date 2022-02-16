import { Window } from "node-window-manager";

export interface ActiveWindow {
  window: Window;
  isBlacklisted: boolean;
}

export type EventName = "message" | "window";
export type EventPayload = any;
export type SocketEvent = { name: EventName; payload: EventPayload };
export type EventList = SocketEvent[];
