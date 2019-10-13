import * as d3 from 'd3'

// Create your margins and height/width
const margin = { top: 60, left: 46, right: 30, bottom: 40 }
const height = 250 - margin.top - margin.bottom

const width = 170 - margin.left - margin.right
// I'll give you this part!
const container = d3.select('#chart-China-FDI-US-02')

// Set up margin/height/width

// I'll give you the container

// Create your scales

// Create a d3.line function that uses your scales

// Read in your data

// Build your ready function that draws lines, axes, etc

// Create our scales
const xPositionScale = d3.scalePoint().range([0, width])

const yPositionScale = d3
  .scaleLinear()
  .domain([0, 100000])
  .range([height, 0])

const line = d3
  .line()
  .x(d => xPositionScale(d.year))
  .y(d => yPositionScale(d.FDI))



// Read in files
Promise.all([
  d3.csv(require('../data/China-FDI-US-02.csv')),
  d3.csv(require('../data/China-FDI-Global.csv'))
])
  .then(ready)
  .catch(err => {
    console.log(err)
  })

function ready([dataUS, dataOther]) {
  const nested = d3
    .nest()
    .key(function(d) {
      return d.region
    })
    .entries(dataOther)

  console.log('The US data is', dataUS)
  console.log('The data is', dataOther)

  const names = dataUS.map(d => d.year)
  xPositionScale.domain(names)

  container
    .selectAll('svg')
    .data(nested)
    .enter()
    .append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .each(function(d) {
      const name = d.key
      const svg = d3.select(this)
      const datapoints = d.values
      svg
        .append('path')
        .datum(dataUS)
        .attr('fill', 'none')
        .attr('stroke', 'grey')
        .attr('opacity', 0.8)
        .attr('d', line)
        .style('stroke-width', '2px')

      svg
        .append('path')
        .datum(datapoints)
        .attr('fill', 'none')
        .attr('stroke', '#9e4b6c')
        .attr('opacity', 0.8)
        .attr('d', line)
        .style('stroke-width', '2px')

      svg
        .append('text')
        .text('USA')
        .attr('x', (3 / 4) * width)
        .attr('y', (3 / 4) * height)
        .attr('font-size', '12px')
        .attr('dx', -10) // offset 5 pixels to the right
        .attr('dy', -20)
        .attr('alignment-baseline', 'middle')
        .attr('fill', 'grey')

      svg
        .append('text')
        .text(name)
        .attr('x', width / 2)
        .attr('text-anchor', 'middle') // text aligned
        .attr('dy', -15)
        .style('font-size', '14px')
        .attr('fill', '#9e4b6c')
        .attr('font-weight', 'bold')

      const xAxis = d3
        .axisBottom(xPositionScale)
        .tickValues([2015, 16, 17, 18])
        .tickFormat(d3.format('d'))
        .tickSize(-height)

      svg
        .append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)
        .style('font-size', '12px')
        .lower()

      const yAxis = d3
        .axisLeft(yPositionScale)
        .tickValues([20000, 40000, 60000, 80000,100000])
        .tickSize(-width)

      svg
        .append('g')
        .attr('class', 'axis y-axis')
        .call(yAxis)
        .style('font-size', '12px')
        .lower()

        svg
        .selectAll('.tick line')
        .attr('stroke-dasharray', 2)
        .attr('stroke', 'lightgrey')

      svg.selectAll('.domain').remove()


    })
}




// Create your scales

// Create your line generator

// Read in your data

// Create your ready function
