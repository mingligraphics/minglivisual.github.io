import * as d3 from 'd3'
import * as topojson from 'topojson'

let margin = { top: 0, left: 0, right: 0, bottom: 0 }

let height = 500 - margin.top - margin.bottom

let width = 900 - margin.left - margin.right

let svg = d3
  .select('#chart-4a')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  const colorScale = d3
  .scaleOrdinal()
  .domain(['Romney','Obama'])
  .range(['purple','green'])

const opacityScale = d3.scaleLinear().domain([50,100]).range([0,1])

const projection = d3.geoAlbersUsa()

const path = d3.geoPath().projection(projection)

d3.json(require('/data/counties.topojson'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(json) {
// console.log(json.objects)
  const counties = topojson.feature(json, json.objects.elpo12p010g)

  // Not sure how to do scale/center/etc?
  // Just use .fitSize to center your map
  // and set everything up nice
  projection.fitSize([width, height], counties)

  svg
    .selectAll('.counties')
    .data(counties.features)
    .enter()
    .append('path')
    .attr('class', 'counties')
    .attr('d', path)
    .attr('stroke', 'none')
    .attr('fill', d => {
      console.log(d)
      return colorScale(d.properties.WINNER)
    })
    .attr('opacity',d => {
      // console.log(d)
      return opacityScale(d.properties.PCT_WNR)
    })

  // Add a text element for every single state
  // and make the text of it be the abbreviation
  // of that state (the column name is 'postal')


}
