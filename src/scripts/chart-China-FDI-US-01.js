import * as d3 from 'd3'
import d3Tip from 'd3-tip'
import d3Annotation from 'd3-svg-annotation'

d3.tip = d3Tip
// const type = d3Annotation.annotationCalloutCircle
// const makeAnnotations = d3Annotation.annotation()
//   .annotations(annotations)

const margin = {
  top: 30,
  right: 40,
  bottom: 40,
  left: 40
}

const width = 700 - margin.left - margin.right
const height = 450 - margin.top - margin.bottom

const svg = d3
  .select('#chart-China-FDI-US-01')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const xPositionScale = d3.scaleBand().range([0, width]).paddingInner(0.4)

const yPositionScale = d3
  .scaleLinear()
  .domain([0, 46490])
  .range([height, 0])

  var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return d.FDI 
  })

svg.call(tip)

d3.csv(require('../data/China-FDI-US.csv')).then(ready)

function ready(datapoints) {

  console.log('This is ', datapoints)

  const years = datapoints.map(d => d.year)
  xPositionScale.domain(years)

/* Add title*/

  svg
  .append('text')
  .attr('x', width / 2)
  .attr('y', 0 - margin.top / 2)
  .attr('dx',-45)
  .attr('text-anchor', 'middle')
  .style('font-size', '16px')
  .text('Chinese Investment in U.S. Slumped amid Trade War')

  /* Add head images*/
  
  svg
  .append("image")
  .attr('x', 18)
  .attr('y', 302)
  .attr('width', 50)
  .attr('height', 50)
  .attr("xlink:href", require('../images/China-FDI/Bush.png'))

  svg
  .append("image")
  .attr('x', 278)
  .attr('y', 290)
  .attr('width', 62)
  .attr('height', 62)
  .attr("xlink:href", require('../images/China-FDI/Obama.png'))

  svg
  .append("image")
  .attr('x', 549)
  .attr('y', 55)
  .attr('width', 56)
  .attr('height', 52)
  .attr("xlink:href", require('../images/China-FDI/Trump.png'))

  /* Add your rectangles here */

  svg
    .selectAll('rect')
    .data(datapoints)
    .enter()
    .append('rect')
    .attr('y', function(d) {
      return yPositionScale(d.FDI)
    })
    .attr('x', function(d) {
      return xPositionScale(d.year)
    })
    .attr('height', function(d) {
      return height - yPositionScale(d.FDI)
    })
    .attr('width', xPositionScale.bandwidth())
    .attr('fill', 'blue')
    .attr('opacity',0.7)
    .attr('class','bar')
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)

/*annotations*/


  const annotations = [
    {
    note: { 
      label: "Trade War Begins" 
    },
    subject: {
      y1: margin.top + 50,
      y2: height + 25
    },
    x: 650,
    y: margin.top + 50,
    color: '#9e4b6c'
    // dy: 137,
    // dx: 262
  }
]

const type = d3Annotation.annotationCustomType(
  d3Annotation.annotationXYThreshold, 
  {"note":{
      "lineType":"none",
      "orientation": "top",
      "align":"middle"}
  }
)


 const makeAnnotations = d3Annotation
     .annotation()
     .type(type)
     .accessors({ 
       x: d => xPositionScale(d.year),
       y: function(d){ return y(d.y) }
      })
      .annotations(annotations)
      .textWrap(30)

      d3.select("svg")
      .append("g")
      .call(makeAnnotations)

    
  
/* axis */

svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", -5)
    .attr("y", 75)
    .style('font-size', '12px')
    .text("$mln")

    const yAxis = d3
    .axisLeft(yPositionScale)
    .tickSize(-width)
    .ticks(5)


  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
    .lower()
    .style('font-size', '12px')


  svg.selectAll('.tick line').attr('stroke-dasharray', '2 2').style('stroke','lightgrey')
  d3.select('.y-axis .domain').remove()
  

  const xAxis = d3.axisBottom(xPositionScale).tickSize(0).tickValues([2001, 2009, 2016, 2018])
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + (height + 5) + ')')
    .style('font-size', '12px') 
    .call(xAxis)

    d3.select('.x-axis .domain').remove()


}


