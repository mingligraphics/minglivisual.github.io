import * as d3 from 'd3'

const margin = { top: 30, left: 30, right: 30, bottom: 30 }
const height = 400 - margin.top - margin.bottom
const width = 780 - margin.left - margin.right

const svg = d3
  .select('#chart-2')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const pie = d3.pie().value(function(d) {
  return d.minutes
})

const radius = 80

const arc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(radius)

const colorScale = d3.scaleOrdinal().range(['#98DC4B', '#c994c7', '#fec44f'])

const pieScale = d3
  .scalePoint()
  .range([0, width])
  .padding(0.5)

// Read in files
d3.csv(require('/data/time-breakdown-all.csv'))
  .then(ready)
  .catch(err => {
    console.log('Failed with', err)
  })

function ready(datapoints) {
  const names = datapoints.map(d => d.project)
  pieScale.domain(names)

  const colorNames = datapoints.map(d => d.task)
  colorScale.domain(colorNames)

  const nested = d3
    .nest()
    .key(function(d) {
      return d.project
    })
    .entries(datapoints)

  console.log('The data is', nested)

  svg
    .selectAll('g')
    .data(nested)
    .enter()
    .append('g')
    .attr('transform', function(d) {
      return `translate(${pieScale(d.key)},100)`
    })
    .each(function(d) {
      const name = d.key
      const datapoints = d.values
      console.log(d)
      // What svg are we in? Let's grab it
      const g = d3.select(this)

      g.selectAll('path')
        .data(pie(datapoints))
        .enter()
        .append('path')
        .attr('d', d => arc(d))
        .attr('fill', d => colorScale(d.data.task))

      console.log('The new data is', pie(datapoints))

      g.selectAll('.title')
        .data(pie(datapoints))
        .enter()
        .append('text')
        .text(name)
        .attr('transform', function(d) {
          return `translate(${pieScale(d.key)},0)`
        })
        .attr('dy', 120)
        .attr('dx', -20)
    })
}
