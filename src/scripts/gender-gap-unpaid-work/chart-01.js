import * as d3 from 'd3'
import d3Tip from 'd3-tip'
import d3Annotation from 'd3-svg-annotation'

d3.tip = d3Tip

const margin = { top: 120, left: 100, right: 50, bottom: 50 }
const height = 800 - margin.top - margin.bottom
const width = 800 - margin.left - margin.right

const svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const xPositionScale = d3
  .scaleLinear()
  .domain([0, 400])
  .range([0, width])

const yPositionScale = d3
  .scalePoint()
  .range([height, 0])
  .padding(0.5)

const tipMen = d3
  .tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return d[0].Men
  })

svg.call(tipMen)

const tipWomen = d3
  .tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return d[0].Women
  })

svg.call(tipWomen)

d3.csv(require('../data/unpaid_3.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

function ready(datapoints) {
  console.log('Data read in:', datapoints)
  const nested = d3
    .nest()
    .key(function(d) {
      return d.Country
    })
    .entries(datapoints)

  console.log('Nested data read in:', nested)

  const names = nested.map(d => d.key)
  yPositionScale.domain(names)

  svg
    .selectAll('g')
    .data(nested)
    .enter()
    .append('g')
    .attr('transform', function(d) {
      return `translate(0,${yPositionScale(d.key)})`
    })
    .each(function(d) {
      const g = d3.select(this)
      const name = d.key
      const datapoints = d.values
      const manMins = datapoints[0].Men
      const womanMins = datapoints[0].Women

      g.append('line')
        .attr('y1', 0)
        .attr('y2', 0)
        .attr('x1', xPositionScale(manMins))
        .attr('x2', xPositionScale(womanMins))
        .attr('stroke', 'black')

      g.append('circle')
        .attr('r', 4)
        .attr('fill', '#F39C12')
        .attr('cy', 0)
        .attr('cx', xPositionScale(womanMins))
        .on('mouseover', tipWomen.show)
        .on('mouseout', tipWomen.hide)

      g.append('circle')
        .attr('r', 4)
        .attr('fill', 'blue')
        .attr('cy', 0)
        .attr('cx', xPositionScale(manMins))
        .on('mouseover', tipMen.show)
        .on('mouseout', tipMen.hide)
    })

  const annotations = [
    {
      note: {
        label:
          'Indian women do five hours more unpaid work than men, the widest gap in the world.',
        wrap: 118
      },
      x: 672,
      y: 152,
      dy: 40,
      dx: 20
    },
    {
      note: {
        label: 'Japanese men do least unpaid work, about 40 minutes per day.',
        wrap: 70
      },
      x: 165,
      y: 662,
      dy: -10,
      dx: 0
    }
  ]

  const makeAnnotations = d3Annotation.annotation().annotations(annotations)

  d3.select('svg')
    .append('g')
    .style('font-size', '12px')
    .call(makeAnnotations)

  const xAxis = d3.axisBottom(xPositionScale).tickSize(-height)
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  svg
    .append('g')
    .attr('class', 'axis x-axis-2')
    .attr('transform', 'translate(0, -15)')
    .call(xAxis)

  svg
    .selectAll('.x-axis line')
    .attr('stroke-dasharray', '1 4')
    .attr('fill', 'lightgrey')

  svg.selectAll('.x-axis path').remove()

  const yAxis = d3.axisLeft(yPositionScale)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
    .attr('font-size', '12')

  svg.selectAll('.y-axis path, .y-axis line').remove()
  svg.selectAll('.x-axis-2 path, .x-axis-2 line').remove()

  svg
    .append('text')
    .attr('font-size', '18')
    .attr('text-anchor', 'middle')
    .text('The global gender gap in unpaid work')
    .attr('x', width / 2)
    .attr('y', -100)
    .attr('dx', -40)
    .attr('font-weight', 'bold')
}
