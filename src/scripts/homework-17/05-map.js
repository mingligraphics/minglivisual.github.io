import * as d3 from 'd3'
import * as topojson from 'topojson'

let margin = { top: 0, left: 150, right: 0, bottom: 0 }

let height = 600 - margin.top - margin.bottom

let width = 900 - margin.left - margin.right

let svg = d3
  .select('#chart-5')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')


const projection = d3.geoAlbersUsa()
const radiusScale = d3.scaleSqrt().range([1,6])
// const colorScale = d3.scaleOrdinal().range(['#a6cee3',
// '#1f78b4','#b2df8a','#33a02c','#fb9a99',
// '#e31a1c','#fdbf6f','#ff7f00','#cab2d6',
// '#6a3d9a','#ffff99'])

// out geoPath needs a PROJECTION variable
const path = d3.geoPath().projection(projection)

Promise.all([
  d3.json(require('/data/us_states.topojson')),
  d3.csv(require('/data/powerplants.csv'))
])
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready([json, datapoints]) {
  
  const states = topojson.feature(json, json.objects.us_states)

  const max = d3.max(datapoints, function(d) { return d.Total_MW });
  radiusScale.domain([0, max])

  // const Sources = datapoints.PrimSource
  // colorScale.domain(Sources)
  // Not sure how to do scale/center/etc?
  // Just use .fitSize to center your map
  // and set everything up nice
  projection.fitSize([width, height], states)

  svg
    .selectAll('.state')
    .data(states.features)
    .enter()
    .append('path')
    .attr('class', 'state')
    .attr('d', path)
    .attr('fill', 'lightgrey')

  // Add a text element for every single state
  // and make the text of it be the abbreviation
  // of that state (the column name is 'postal')
  console.log(states.features)
  svg
    .selectAll('.state-label')
    .data(states.features)
    .enter()
    .append('text')
    .attr('class', 'state-label')
    .text(d => d.properties.abbrev)
    .attr('stroke','black')
    .attr('fill','none')

  // Make a circle for every single wafflehouse
  // ps they're in datapoints
  // you don't have to position them
  // radius of.... 2?

  svg
    .selectAll('.powerplants')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('class', 'powerplants')
    .attr('r', d => {
      // console.log(d)
      return radiusScale(d.Total_MW)
    })
    .attr('fill', 'red')
    .attr('transform', d => {
      const coords = projection([d.Longitude, d.Latitude])
      return `translate(${coords})`
    })
    .attr('opacity',0.6)
  // .attr('cx', d => {
  //   console.log(d)
  //   // convert from lat/lon to pixels
  //   let coords = projection([d.long, d.lat])
  //   console.log(coords)
  //   return coords[0]
  // })
  // .attr('cy', d => {
  //   console.log(d)
  //   // convert from lat/lon to pixels
  //   let coords = projection([d.long, d.lat])
  //   console.log(coords)
  //   return coords[1]
  // })
}
