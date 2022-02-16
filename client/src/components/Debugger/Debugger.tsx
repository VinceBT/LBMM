import React, { forwardRef, Ref, useCallback, useImperativeHandle, useState } from "react";
import { createUseStyles } from "react-jss";

import { useForceUpdate } from "../../utils/ReactUtils";

import { DebugFn, DebuggerRef, DebugValue } from "./constants";
import { styles } from "./styles";

const useStyles = createUseStyles(styles);

type DebuggerProps = {
  //
};

const Debugger = forwardRef((props: DebuggerProps, ref: Ref<DebuggerRef>) => {
  const [valueMap] = useState(new Map<string, DebugValue>());
  const classes = useStyles();

  const forceUpdate = useForceUpdate();

  const setValue: DebugFn = useCallback(
    (key, value) => {
      valueMap.set(key, value);
      forceUpdate();
    },
    [valueMap, forceUpdate],
  );

  useImperativeHandle(ref, () => ({ setValue }), [setValue]);

  if (valueMap.size === 0) return null;

  return (
    <div className={classes.container}>
      {Array.from(valueMap.keys()).map((key) => {
        return (
          <div key={key} className={classes.item}>
            <div className={classes.key}>{key}</div>
            <div className={classes.value}>{valueMap.get(key)}</div>
          </div>
        );
      })}
    </div>
  );
});

Debugger.displayName = "Debugger";

export { Debugger };
