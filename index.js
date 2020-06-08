const h = 600;
const w = 1000;
const padding = 80;

fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
    .then(response => response.json())
    .then(data => showData(data));


function showData(data) {
    console.log(data);

    let years = data.map(el => new Date(el["Year"], 0, 1));
    let minYear = new Date(d3.min(years).getFullYear(), 0, 1);
    let maxYear = new Date(d3.max(years).getFullYear(), 0, 1);

    minYear.setFullYear(minYear.getFullYear() - 1);
    maxYear.setFullYear(maxYear.getFullYear() + 1);
    

    let xScale = d3.scaleTime()
                    .domain([minYear, maxYear])
                    .range([padding, w - padding]);

    let timeFormat = "%M:%S";
    let timesInSec = data.map(el => d3.timeParse(timeFormat)(el["Time"]));

    console.log(timesInSec)

    let minTime = d3.min(timesInSec);
    let maxTime = d3.max(timesInSec);

    let yScale = d3.scaleTime()
                    .domain([minTime, maxTime])
                    .range([padding, h - padding]);

    const svg = d3.select("#svg-container")
                    .append("svg")
                    .attr("height", h)
                    .attr("width", w);

    d3.select("#legend")
        .style("top", (h/2) + "px")
        .style("left", (w - 260) + "px");

    const tooltip = d3.select("#tooltip");

    svg.selectAll("circle")
                    .data(data)
                    .enter()
                    .append("circle")
                    .attr("data-xvalue", (d, i) => years[i])
                    .attr("data-yvalue", (d, i) => timesInSec[i])
                    .attr("cx", (d, i) => xScale(years[i]))
                    .attr("cy", (d, i) => yScale(timesInSec[i]))
                    .attr("r", 8)
                    .attr("class", "dot")
                    .style("fill", d => (d["Doping"].length == 0 ? "yellowgreen" : "orange"))
                    .on("mouseover", (d, i) => {
                        tooltip.html(`${d["Name"]} (${d["Nationality"]})<br>
                                        Year: ${d["Year"]}, Time: ${d["Time"]}
                                        ${d["Doping"].length == 0 ? "" : `<br><br>${d['Doping']}`}`)
                            .attr("data-year", years[i])
                            .style("opacity", .85)
                            .style("top", (yScale(timesInSec[i])) + "px")
                            .style("left", (xScale(years[i]) + 10) + "px");
                    })
                    .on("mouseout", () => {
                       tooltip.style("opacity", 0).style("top", "-1000px").style("left", "-1000px");
                    });


    let xAxis = d3.axisBottom(xScale);
    let yAxis = d3.axisLeft(yScale)
    .tickFormat(function(d){
        return d3.timeFormat(timeFormat)(d)
    });;

    svg.append("g")
            .attr("transform", "translate(0, " + (h - padding) + ")")
            .attr("id", "x-axis")
            .call(xAxis);

    svg.append("g")
            .attr("transform", "translate(" + padding + ", 0)")
            .attr("id", "y-axis")
            .call(yAxis);
}