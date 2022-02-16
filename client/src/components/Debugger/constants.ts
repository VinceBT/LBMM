export type DebugValue = number | string | boolean;

export type DebugFn = (key: string, value: DebugValue) => void;

export interface DebuggerRef {
  setValue: DebugFn;
}
