import * as d3 from 'd3'

const margin = { top: 30, left: 30, right: 30, bottom: 30 }
const height = 400 - margin.top - margin.bottom
const width = 780 - margin.left - margin.right

const svg = d3
  .select('#chart-4')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  .attr('transform', `translate(${width / 2},${height / 2})`)

const angleScale = d3.scaleBand().range([0, Math.PI * 2])
const radius = 150

const radiusScale = d3
  .scaleLinear()
  .domain([0, 85])
  .range([0, radius])

const line = d3
  .radialArea()
  .angle(d => angleScale(d.month_name))
  .innerRadius(d => radiusScale(d.low_temp))
  .outerRadius(d => radiusScale(d.high_temp))

d3.csv(require('/data/ny-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  const names = datapoints.map(d => d.month_name)
  angleScale.domain(names)

  datapoints.push(datapoints[0])

  svg
    .append('path')
    .datum(datapoints)
    .attr('d', line)
    .attr('fill', 'lightblue')
    .attr('stroke', 'none')
    .attr('opacity', 0.6)

  svg
    .append('circle')
    .attr('r', 3)
    .attr('cx', 0)
    .attr('cy', 0)

  const bands = [30, 40, 50, 60, 70, 80, 90]

  // Draw a circle for each item in bands
  svg
    .selectAll('.band')
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

  svg
    .selectAll('.label')
    .data(bands)
    .enter()
    .append('text')
    .text(d => d)
    .attr('y', d => -radiusScale(d))
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')

  svg
    .append('text')
    .text('NYC')
    .attr('fill', 'black')
    .attr('stroke', 'none')
    .attr('font-weight', '500')
    .style('font-size', '26px')
    .attr('transform', 'translate(-25,10)')
}
