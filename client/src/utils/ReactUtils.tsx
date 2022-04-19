import { useCallback, useState } from "react";

export function useForceUpdate(): () => void {
  const [, dispatch] = useState<unknown>(Object.create(null));

  // Turn dispatch(required_parameter) into dispatch().
  const memoizedDispatch = useCallback((): void => {
    dispatch(Object.create(null));
  }, [dispatch]);
  return memoizedDispatch;
}
