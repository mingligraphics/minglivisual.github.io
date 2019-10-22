import * as d3 from 'd3'

const margin = { top: 30, left: 30, right: 30, bottom: 30 }

const height = 450 - margin.top - margin.bottom

const width = 800 - margin.left - margin.right

const svg = d3
  .select('#chart-5')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const angleScale = d3.scaleBand().range([0, Math.PI * 2])
const radius = 55

const radiusScale = d3
  .scaleLinear()
  .domain([0, 100])
  .range([0, radius])

const line = d3
  .radialArea()
  .angle(d => angleScale(d.month_name))
  .innerRadius(d => radiusScale(d.low_temp))
  .outerRadius(d => radiusScale(d.high_temp))

const xPositionScale = d3
  .scalePoint()
  .range([0, width])
  .padding(0.25)

d3.csv(require('/data/all-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  const names = datapoints.map(d => d.month_name)
  angleScale.domain(names)

  const positionNames = datapoints.map(d => d.city)
  xPositionScale.domain(positionNames)

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
      return `translate(${xPositionScale(d.key)},100)`
    })
    .each(function(d) {
      const name = d.key
      const datapoints = d.values
      datapoints.push(datapoints[0])
      console.log(d)
      // What svg are we in? Let's grab it
      const g = d3.select(this)

      g.append('path')
        .datum(datapoints)
        .attr('d', line)
        .attr('fill', 'pink')
        .attr('stroke', 'none')
        .attr('opacity', 0.6)

      g.append('circle')
        .attr('r', 3)
        .attr('cx', 0)
        .attr('cy', 0)

      const bands = [40, 60, 80, 100]

      // Draw a circle for each item in bands
      g.selectAll('.band')
        .data(bands)
        .enter()
        .append('circle')
        .attr('fill', 'none')
        .attr('stroke', 'grey')
        .attr('r', function(d) {
          console.log(d)
          return radiusScale(d)
        })
        .lower()

      g.selectAll('.label')
        .data(bands)
        .enter()
        .append('text')
        .text(d => d)
        .attr('y', d => -radiusScale(d))
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')

      g.selectAll('.title')
        .data(datapoints)
        .enter()
        .append('text')
        .text(name)
        .attr('transform', function(d) {
          return `translate(${xPositionScale(d.key)},0)`
        })
        .attr('dy', 5)
        .attr('dx', 0)
        .attr('text-anchor', 'middle')
    })
}
