import * as React from "react";
import * as ReactDOM from "react-dom";

import App from "./components/App";
import { Report } from "./fortio";

let grpc = [];
let http1 = [];

import * as eg1 from "../example-grpc-in-4000.json";
grpc.push({ name: "grpc-in-4000", report: eg1 })

import * as eg3 from "../example-grpc-out-4000.json";
grpc.push({ name: "grpc-out-4000", report: eg3 })

import * as eg2 from "../example-grpc-in-6000.json";
grpc.push({ name: "grpc-in-6000", report: eg2 })

import * as eg4 from "../example-grpc-out-6000.json";
grpc.push({ name: "grpc-out-6000", report: eg4 })

import * as eg5 from "../example-http1-in-4000.json";
http1.push({ name: "http1-in-4000", report: eg5 })

import * as eg7 from "../example-http1-out-4000.json";
http1.push({ name: "http1-out-4000", report: eg7 })

import * as eg6 from "../example-http1-in-7000.json";
http1.push({ name: "http1-in-7000", report: eg6 })

import * as eg8 from "../example-http1-out-7000.json";
http1.push({ name: "http1-out-7000", report: eg8 })

const rowHeight = 20;
const margin = {
    top: 50,
    bottom: 0,
    left: 150,
    right: 0,
}

ReactDOM.render(
    <App width={window.innerWidth} rowHeight={rowHeight} margin={margin} reports={grpc} />,
    document.getElementById("grpc")
);

ReactDOM.render(
    <App width={window.innerWidth} rowHeight={rowHeight} margin={margin} reports={http1} />,
    document.getElementById("http1")
);
