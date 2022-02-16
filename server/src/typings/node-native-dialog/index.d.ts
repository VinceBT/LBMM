declare module "node-native-dialog" {
  export default class Dialog {
    static OK: string;
    static RIGHT: string;
    static OK_CANCEL: string;
    static RESULT_OK: string;

    static show(anything: any): Promise<string>;
  }
}
