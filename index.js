const h = 600;
const w = 1000;
const padding = 50;

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

    const svg = d3.select("main")
                    .append("svg")
                    .attr("height", h)
                    .attr("width", w);

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
                    .style("fill", d => (d["Doping"].length == 0 ? "yellowgreen" : "orange"));


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