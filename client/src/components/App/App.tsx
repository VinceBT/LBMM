import classNames from "classnames";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { createUseStyles } from "react-jss";
import { Container } from "typedi";

import { ActiveWindow } from "../../../../server/src/types/Common";
import { SocketHandler } from "../../managers/SocketHandler";
import { bottomScroller } from "../../utils/HTMLUtils";
import { DebuggerRef } from "../Debugger/constants";
import { Debugger } from "../Debugger/Debugger";

import { styles } from "./styles";

const useStyles = createUseStyles(styles);

type AppProps = {
  port?: number;
};

const App = (props: AppProps) => {
  const { port } = props;
  const classes = useStyles();

  const [logs, setLogs] = useState<string[]>([]);
  const [activeWindow, setActiveWindow] = useState<ActiveWindow>();

  const $console = useRef<HTMLPreElement>(null);
  const $debugger = useRef<DebuggerRef>(null);

  const socketHandler = Container.get(SocketHandler);

  const handleNewMessages = useCallback((data) => {
    let string = data;
    if (string[string.length - 1] !== "\n") {
      string += "\n";
    }
    setLogs((prevState) => prevState.concat(string));
  }, []);

  const handleActiveWindowChange = useCallback((data) => {
    setActiveWindow(data);
  }, []);

  const resetStates = useCallback(() => {
    setLogs([]);
    setActiveWindow(undefined);
  }, []);

  useEffect(() => {
    if (port) {
      socketHandler.connect(port);
    } else {
      console.log("No port");
    }
    return () => {
      // Hot loader triggered
      socketHandler.clean();
      resetStates();
    };
  }, [resetStates, port, socketHandler]);

  useEffect(() => {
    socketHandler.addListener("message", handleNewMessages);
    socketHandler.addListener("window", handleActiveWindowChange);
    return () => {
      socketHandler.removeListener("message", handleNewMessages);
      socketHandler.removeListener("window", handleActiveWindowChange);
    };
  }, [handleNewMessages, handleActiveWindowChange, socketHandler]);

  useEffect(() => {
    const unsubscribe = bottomScroller($console.current);
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.consoleContainer}>
        <pre ref={$console} className={classes.console}>
          {logs.map((log, i) => (
            <span key={log + i} className={classes.item}>
              {log}
            </span>
          ))}
        </pre>
      </div>
      {Boolean(activeWindow) && (
        <div
          className={classNames(classes.activeWindow, {
            [classes.activeWindowEnabled]: !activeWindow?.isBlacklisted,
          })}
        >
          {activeWindow?.window.path}
        </div>
      )}
      <Debugger ref={$debugger} />
    </div>
  );
};

export default App;
