import * as d3 from 'd3'

const margin = { top: 30, left: 30, right: 30, bottom: 30 }
const height = 400 - margin.top - margin.bottom
const width = 780 - margin.left - margin.right

const svg = d3
  .select('#chart-3')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  .attr('transform', `translate(${width / 2},${height / 2})`)

const pie = d3.pie().value(1 / 12)

const radius = 150

const radiusScale = d3
  .scaleLinear()
  .domain([0, 85])
  .range([0, radius])

const arc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(d => radiusScale(d.data.high_temp))

const colorScale = d3.scaleLinear().range(['lightblue', 'pink'])

d3.csv(require('/data/ny-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  const maxTemp = d3.max(datapoints, d => d.high_temp)
  const minTemp = d3.min(datapoints, d => d.high_temp)
  colorScale.domain([minTemp, maxTemp])

  console.log('The max is', maxTemp)

  svg
    .selectAll('path')
    .data(pie(datapoints))
    .enter()
    .append('path')
    .attr('d', d => arc(d))
    .attr('fill', d => colorScale(d.data.high_temp))

  svg
    .append('text')
    .text('NYC high temperatures, by month')
    .attr('fill', 'black')
    .attr('stroke', 'none')
    .attr('font-weight', '500')
    .style('font-size', '26px')
    .attr('transform', 'translate(-190,-130)')
}
