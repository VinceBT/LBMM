import React from "react";
import { render } from "react-dom";
import "reflect-metadata";

import App from "./components/App/App";

const portParam = new URL(location.href).searchParams.get("port");
const port = portParam ? Number.parseInt(portParam) : undefined;

render(<App port={port} />, document.getElementById("react-root"));
