import * as React from "react";
import * as ReactDOM from "react-dom";

import App from "./components/App";
import { Report } from "./fortio";

let reports = [];

// import * as eg1 from "../example-grpc-in-4000.json";
// reports.push({ name: "example-grpc-in-4000.json", report: eg1 })

// import * as eg2 from "../example-grpc-in-6000.json";
// reports.push({ name: "example-grpc-in-6000.json", report: eg2 })

import * as eg3 from "../example-grpc-out-4000.json";
reports.push({ name: "example-grpc-out-4000.json", report: eg3 })

import * as eg4 from "../example-grpc-out-6000.json";
reports.push({ name: "example-grpc-out-6000", report: eg4 })

// import * as eg5 from "../example-http1-in-4000.json";
// reports.push({ name: "example-grpc-in-4000", report: eg5 })

// import * as eg6 from "../example-http1-in-7000.json";
// reports.push({ name: "example-http1-in-7000", report: eg6 })

import * as eg7 from "../example-http1-out-4000.json";
reports.push({ name: "example-http1-out-4000", report: eg7 })

import * as eg8 from "../example-http1-out-7000.json";
reports.push({ name: "example-http1-out-7000", report: eg8 })

const rowHeight = 50;
const margin = {
    top: rowHeight,
    bottom: 0,
    left: 200,
    right: 0,
}

ReactDOM.render(
    <App width={window.innerWidth} rowHeight={rowHeight} margin={margin} reports={reports} />,
    document.getElementById("izvay")
);
