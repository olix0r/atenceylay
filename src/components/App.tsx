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
        console.log(maxLatency!);
        const x = d3.scaleLinear()
            .domain([0, maxLatency!])
            .rangeRound([margin.left, width - margin.left - margin.right]);

        const y = d3.scaleBand()
            .domain(reports.map(r => r.name))
            .rangeRound([margin.top, margin.top + reports.length * rowHeight]);

        reports.forEach(r => {
            r.report.DurationHistogram.Data.forEach(d => {
                console.log(r.name, d, x(d.Start), x(d.End));
            });
        });

        const svg = d3.select(this.mountRef)
            .append('svg')
            .attr('width', width)
            .attr('height', margin.top + margin.bottom + reports.length * rowHeight);

        const maxCount = d3.max(reports, r => d3.max(r.report.DurationHistogram.Data, d => d.Count));
        const boxColor = d3.scaleSequential(d3.interpolateCool).domain([0, Math.pow(maxCount!, 0.5)]);
        const barColor = d3.scaleOrdinal(d3.schemeYlOrRd[5])
            .domain(["50", "75", "90", "99", "99.9"]);

        svg.append("g").call(g => g
            .attr("transform", `translate(0,${margin.top})`)
            .call(d3.axisTop(x)
                .tickSize((width - margin.left - margin.right) / 100)
                .tickFormat((n: number) => `${n * 1000}ms`))
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
            .attr("x", d => x(d.Start) + 1)
            .attr("width", d => x(d.End) - x(d.Start) - 1)
            .attr("height", y.bandwidth() - 1)
            .attr("fill", d => boxColor(Math.pow(d.Count, 0.5)))
            .append("title").text(d => `${d.Count} reqs [${d.Start}ms..${d.End}ms)`);

        row.append("g")
            .selectAll("rect")
            .data(r => r.report.DurationHistogram.Percentiles)
            .join("rect")
            .attr("x", p => x(p.Value))
            .attr("width", 3)
            .attr("height", y.bandwidth() - 1)
            .attr("fill", p => barColor(`${p.Percentile}`))
            .append("title").text(p => `${p.Percentile} percentile ${p.Value}ms`);
    }

    render() {
        const { width } = this.props;
        const style = { width, color: '#0f0', backgroundColor: "#111" };
        return <div style={style} ref={ref => (this.mountRef = ref!)} />;
    }
}
