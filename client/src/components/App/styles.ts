export const styles = {
  container: {
    height: "100%",
    display: "flex",
    flexFlow: "column",
  },
  consoleContainer: {
    display: "flex",
    flex: 1,
    overflow: "hidden",
    flexFlow: "column",
  },
  console: {
    display: "flex",
    flex: 1,
    flexFlow: "column",
    overflow: "auto",
    background: "black",
    color: "white",
    fontFamily: "monospace",
  },
  item: {
    //
  },
  activeWindow: {
    display: "none",
    flexFlow: "column",
    background: "red",
    color: "white",
    fontFamily: "monospace",
  },
  activeWindowEnabled: {
    background: "green",
  },
};
