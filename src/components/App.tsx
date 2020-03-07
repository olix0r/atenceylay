import * as d3 from "d3";
import * as React from "react";

import * as Fortio from "../fortio";

interface Props {
    reports: Array<{ name: string, report: Fortio.Report }>;
    width: number;
    rowHeight: number;
    margin: {
        top: number,
        bottom: number,
        left: number,
        right: number,
    }
}

export default class App extends React.Component<Props, {}> {
    mountRef: HTMLDivElement;

    componentDidMount() {
        const { width, rowHeight, margin, reports } = this.props;

        const maxLatency = d3.max(reports, r => d3.max(r.report.DurationHistogram.Data, d => d.End));
        console.log(maxLatency! * 1000);
        const x = d3.scaleLinear()
            .domain([0, maxLatency! * 1000])
            .rangeRound([margin.left, width - margin.left - margin.right]);

        const y = d3.scaleBand()
            .domain(reports.map(r => r.name))
            .rangeRound([margin.top, margin.top + reports.length * rowHeight]);

        reports.forEach(r => {
            r.report.DurationHistogram.Data.forEach(d => {
                console.log(r.name, d, x(d.Start * 1000), x(d.End * 1000));
            });
        });

        const svg = d3.select(this.mountRef)
            .append('svg')
            .attr('width', width)
            .attr('height', margin.top + margin.bottom + reports.length * rowHeight);

        const maxCount = d3.max(reports, r => d3.max(r.report.DurationHistogram.Data, d => d.Count));
        const boxColor = d3.scaleSequential(d3.interpolateCool).domain([0, maxCount!]);

        svg.append("g").call(g => g
            .attr("transform", `translate(0,${margin.top})`)
            .call(d3.axisTop(x).ticks((width - margin.left - margin.right) / 100, ".02f"))
            .call(g => g.selectAll(".domain").remove()));

        svg.append("g").call(g => g
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).tickSizeOuter(0))
            .call(g => g.selectAll(".domain").remove()));

        const row = svg.append("g")
            .selectAll("g")
            .data(reports)
            .join("g")
            .attr("transform", r => `translate(0,${y(r.name)})`)

        row.append("g")
            .selectAll("rect")
            .data(({ report }) => report.DurationHistogram.Data)
            .join("rect")
            .attr("x", d => x(d.Start * 1000) + 1)
            .attr("width", d => x(d.End * 1000) - x(d.Start * 1000) - 1)
            .attr("height", y.bandwidth() - 1)
            .attr("fill", d => boxColor(d.Count))
            .append("title").text(d => `${d.Count} reqs [${d.Start * 1000}ms..${d.End * 1000}ms)`);

        row.append("g")
            .selectAll("rect")
            .data(r => r.report.DurationHistogram.Percentiles)
            .join("rect")
            .attr("x", p => x(p.Value * 1000))
            .attr("width", 3)
            .attr("height", y.bandwidth() - 1)
            .attr("fill", "#fa0")
            .append("title").text(p => `${p.Percentile} percentile ${p.Value * 1000}ms`);
    }

    render() {
        const { width } = this.props;
        const style = { width, color: '#0f0', backgroundColor: "#111" };
        return <div style={style} ref={ref => (this.mountRef = ref!)} />;
    }
}
