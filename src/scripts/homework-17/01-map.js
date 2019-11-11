import * as d3 from 'd3'
import * as topojson from 'topojson'

let margin = { top: 0, left: 0, right: 0, bottom: 0 }

let height = 500 - margin.top - margin.bottom

let width = 900 - margin.left - margin.right

let svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .style('background', 'black')
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const colorScale = d3.scaleSequential(d3.interpolateRainbow).domain([0,1000000])

const projection = d3.geoMercator()
const graticule = d3.geoGraticule()

// out geoPath needs a PROJECTION variable
const path = d3.geoPath().projection(projection)

Promise.all([
  d3.json(require('/data/world.topojson')),
  d3.csv(require('/data/world-cities.csv'))
])
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready([json, datapoints]) {

const countries = topojson.feature(json, json.objects.countries)
console.log(countries)

svg
.selectAll('.country')
.data(countries.features)
.enter()
.append('path')
.attr('class', 'country')
.attr('d', path)
.attr('fill', 'black')

// console.log(graticule())

svg
.append('path')
.datum(graticule())
.attr('d', path)
.attr('stroke', 'grey')
.lower()

svg
.selectAll('.cities')
.data(datapoints)
.enter()
.append('circle')
.attr('class', 'cities')
.attr('r', 1)
.attr('fill', d => {
  return colorScale(d.population)
})
.attr('transform', d => {
  const coords = projection([d.lng, d.lat])
  return `translate(${coords})`
})

}