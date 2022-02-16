import { useCallback, useState } from "react";

export function useForceUpdate(): () => void {
  // eslint-disable-next-line @typescript-eslint/ban-types
  const [, dispatch] = useState<{}>(Object.create(null));

  // Turn dispatch(required_parameter) into dispatch().
  const memoizedDispatch = useCallback((): void => {
    dispatch(Object.create(null));
  }, [dispatch]);
  return memoizedDispatch;
}
