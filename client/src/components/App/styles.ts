export const styles = {
  container: {
    height: "100%",
    display: "flex",
    flexFlow: "column",
  },
  consoleContainer: {
    display: "flex",
    flex: 1,
    background: "black",
    overflowY: "auto",
    flexFlow: "column-reverse",
  },
  console: {
    display: "flex",
    flexFlow: "column-reverse",
    color: "white",
    fontFamily: "monospace",
    marginBottom: "auto",
  },
  item: {
    //
  },
  activeWindow: {
    flexFlow: "column",
    background: "red",
    color: "white",
    fontFamily: "monospace",
  },
  activeWindowEnabled: {
    background: "green",
  },
};
