export const sleep = (ms: number, callback?: (cancelCallback: () => boolean) => void) =>
  new Promise<void>((resolve, reject) => {
    let timeout: NodeJS.Timeout | undefined = setTimeout(() => {
      timeout = undefined;
      resolve();
    }, ms);
    callback?.(() => {
      const timeoutSaved = timeout;
      timeout = undefined;
      reject();
      if (timeoutSaved) {
        clearTimeout(timeoutSaved);
      }
      return !!timeoutSaved;
    });
  });
