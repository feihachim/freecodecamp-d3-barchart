"use strict";

const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

let dataset;

let heightScale;
let xScale;
let xAxisScale;
let yAxisScale;

const width = 800;
const height = 600;
const padding = 40;

const svg = d3.select("svg");

const drawCanvas = () => {
  svg.attr("width", width).attr("height", height);
};

const generateScales = () => {
  heightScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, (item) => item[1])])
    .range([0, height - padding * 2]);
  xScale = d3
    .scaleLinear()
    .domain([0, dataset.length - 1])
    .range([padding, width - padding]);

  let datesArray = dataset.map((item) => new Date(item[0]));

  xAxisScale = d3
    .scaleTime()
    .domain([d3.min(datesArray), d3.max(datesArray)])
    .range([padding, width - padding]);
  yAxisScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, (item) => item[1])])
    .range([height - padding, padding]);
};

const drawBars = () => {
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("visibility", "hidden")
    .style("width", "auto")
    .style("height", "auto");

  svg
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("width", (width - padding * 2) / dataset.length)
    .attr("data-date", (item) => item[0])
    .attr("data-gdp", (item) => item[1])
    .attr("height", (item) => heightScale(item[1]))
    .attr("x", (item, index) => xScale(index))
    .attr("y", (item) => height - padding - heightScale(item[1]))
    .on("mouseover", (event, item) => {
      tooltip.transition().style("visibility", "visible");

      tooltip.text(`${item[0]} \$${item[1]} Billion`);

      document.querySelector("#tooltip").setAttribute("data-date", item[0]);
    })
    .on("mouseout", (event, item) => {
      tooltip.transition().style("visibility", "hidden");
    });
};

const generateAxes = () => {
  let xAxis = d3.axisBottom(xAxisScale);
  let yAxis = d3.axisLeft(yAxisScale);

  svg
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", `translate(0,${height - padding})`);
  svg
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding},0)`);
};

// d3.json retourne une promesse
d3.json(url).then((json) => {
  dataset = json.data;

  drawCanvas();
  generateScales();
  drawBars();
  generateAxes();
});
