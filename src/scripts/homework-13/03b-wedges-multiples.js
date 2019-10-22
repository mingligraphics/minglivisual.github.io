import * as d3 from 'd3'

const margin = { top: 30, left: 30, right: 30, bottom: 30 }
const height = 400 - margin.top - margin.bottom
const width = 780 - margin.left - margin.right

const svg = d3
  .select('#chart-3b')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const pie = d3.pie().value(1 / 12)

const radius = 70

const radiusScale = d3
  .scaleLinear()
  .domain([0, 100])
  .range([0, radius])

const arc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(d => radiusScale(d.data.high_temp))

const colorScale = d3.scaleLinear().range(['lightblue', 'pink'])

const piePositionScale = d3
  .scalePoint()
  .range([0, width])
  .padding(0.15)

d3.csv(require('/data/all-temps.csv'))
  .then(ready)
  .catch(err => {
    console.log('Failed with', err)
  })

function ready(datapoints) {
  const names = datapoints.map(d => d.city)
  piePositionScale.domain(names)

  const maxTemp = d3.max(datapoints, d => d.high_temp)
  const minTemp = d3.min(datapoints, d => d.low_temp)
  colorScale.domain([minTemp, maxTemp])

  const nested = d3
    .nest()
    .key(function(d) {
      return d.city
    })
    .entries(datapoints)

  console.log('The data is', nested)

  svg
    .selectAll('g')
    .data(nested)
    .enter()
    .append('g')
    .attr('transform', function(d) {
      return `translate(${piePositionScale(d.key)},100)`
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
        .attr('fill', d => colorScale(d.data.high_temp))

      console.log('The new data is', pie(datapoints))

      g.selectAll('.title')
        .data(pie(datapoints))
        .enter()
        .append('text')
        .text(name)
        .attr('transform', function(d) {
          return `translate(${piePositionScale(d.key)},0)`
        })
        .attr('dy', 120)
        .attr('dx', -20)
    })
}
