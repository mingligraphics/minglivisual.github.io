import * as d3 from 'd3'

const margin = { top: 100, left: 50, right: 150, bottom: 30 }

const height = 700 - margin.top - margin.bottom

const width = 600 - margin.left - margin.right

const svg = d3
  .select('#chart-2')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const parseTime = d3.timeParse('%B-%y')

const xPositionScale = d3.scaleLinear().range([0, width])
const yPositionScale = d3.scaleLinear().range([height, 0])

const colorScale = d3
  .scaleOrdinal()
  .range([
    '#8dd3c7',
    '#ffffb3',
    '#bebada',
    '#fb8072',
    '#80b1d3',
    '#fdb462',
    '#b3de69',
    '#fccde5',
    '#d9d9d9',
    '#bc80bd'
  ])

const line = d3
  .line()
  .x(function(d) {
    return xPositionScale(d.datetime)
  })
  .y(function(d) {
    return yPositionScale(d.price)
  })

d3.csv(require('/data/housing-prices.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

function ready(datapoints) {
  datapoints.forEach(d => {
    d.datetime = parseTime(d.month)
  })
  const dates = datapoints.map(d => d.datetime)
  const prices = datapoints.map(d => +d.price)

  xPositionScale.domain(d3.extent(dates))
  yPositionScale.domain(d3.extent(prices))

  const nested = d3
    .nest()
    .key(function(d) {
      return d.region
    })
    .entries(datapoints)

  // ---------------------------------------------------
  d3.select('#reset-step').on('stepin', function() {
    svg.selectAll('path').style('visibility', 'hidden')
    svg.selectAll('circle').style('visibility', 'hidden')
    svg.selectAll('.region-text').style('visibility', 'hidden')
    svg.selectAll('.winter-rect').style('visibility', 'hidden')
  })

  d3.select('#all-line-step').on('stepin', function() {
    svg.selectAll('path').style('visibility', 'visible')
    svg.selectAll('circle').style('visibility', 'visible')
    svg.selectAll('.region-text').style('visibility', 'visible')
  })

  d3.select('#usline-step').on('stepin', function() {
    svg
      .selectAll('path')
      .attr('stroke', function(d) {
        if (d.key === 'U.S.') {
          return 'red'
        } else {
          return 'lightgrey'
        }
      })
      .raise()

    svg
      .selectAll('circle')
      .attr('fill', function(d) {
        if (d.key === 'U.S.') {
          return 'red'
        } else {
          return 'lightgrey'
        }
      })
      .raise()
  })

  d3.select('#regions-step').on('stepin', function() {
    svg
      .selectAll('path')
      .attr('stroke', function(d) {
        if (d.key === 'U.S.') {
          return 'red'
        }
        if (
          d.key === 'Mountain' ||
          d.key === 'Pacific' ||
          d.key === 'West South Central' ||
          d.key === 'South Atlantic'
        ) {
          return 'blue'
        } else {
          return 'lightgrey'
        }
      })
      .raise()

    svg
      .selectAll('circle')
      .attr('fill', function(d) {
        if (d.key === 'U.S.') {
          return 'red'
        }
        if (
          d.key === 'Mountain' ||
          d.key === 'Pacific' ||
          d.key === 'West South Central' ||
          d.key === 'South Atlantic'
        ) {
          return 'blue'
        } else {
          return 'lightgrey'
        }
      })
      .raise()
  })

  d3.select('#winter-step').on('stepin', function() {
    svg.selectAll('.winter-rect').style('visibility', 'visible')
  })

  // ---------------------------------------------------

  svg
    .selectAll('path')
    .data(nested)
    .enter()
    .append('path')
    .attr('class', 'region-path')
    .attr('d', function(d) {
      return line(d.values)
    })
    .attr('stroke', function(d) {
      return colorScale(d.key)
    })
    .attr('stroke-width', 2)
    .attr('fill', 'none')

  svg
    .selectAll('circle')
    .data(nested)
    .enter()
    .append('circle')
    .attr('class', 'region-circle')
    .attr('fill', function(d) {
      return colorScale(d.key)
    })
    .attr('r', 4)
    .attr('cy', function(d) {
      return yPositionScale(d.values[0].price)
    })
    .attr('cx', function(d) {
      return xPositionScale(d.values[0].datetime)
    })

  svg
    .selectAll('text')
    .data(nested)
    .enter()
    .append('text')
    .attr('class', 'region-text')
    .attr('y', function(d) {
      return yPositionScale(d.values[0].price)
    })
    .attr('x', function(d) {
      return xPositionScale(d.values[0].datetime)
    })
    .text(function(d) {
      return d.key
    })
    .attr('dx', 6)
    .attr('dy', 4)
    .attr('font-size', '12')

  svg
    .append('text')
    .attr('font-size', '24')
    .attr('text-anchor', 'middle')
    .text('U.S. housing prices fall in winter')
    .attr('class', 'title-text')
    .attr('x', width / 2)
    .attr('y', -40)
    .attr('dx', 40)

  const rectWidth =
    xPositionScale(parseTime('February-17')) -
    xPositionScale(parseTime('November-16'))

  svg
    .append('rect')
    .attr('class', 'winter-rect')
    .attr('x', xPositionScale(parseTime('December-16')))
    .attr('y', 0)
    .attr('width', rectWidth)
    .attr('height', height)
    .attr('fill', '#C2DFFF')
    .lower()

  const xAxis = d3
    .axisBottom(xPositionScale)
    .tickFormat(d3.timeFormat('%b %y'))
    .ticks(9)
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  const yAxis = d3.axisLeft(yPositionScale)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)

  // -------------------------------------------------------------------------
  function render() {
    console.log('Rendering')

    // This section will always be the same (except the last line, maybe)
    const svgContainer = svg.node().closest('div')
    const svgWidth = svgContainer.offsetWidth
    const svgHeight = window.innerHeight
    // If you don't want the height to change, use this

    // always be the same
    const actualSvg = d3.select(svg.node().closest('svg'))
    actualSvg.attr('width', svgWidth).attr('height', svgHeight)

    // always be the same
    const newWidth = svgWidth - margin.left - margin.right
    const newHeight = svgHeight - margin.top - margin.bottom

    // Update your scales - almost always be the same
    xPositionScale.range([0, newWidth])
    yPositionScale.range([newHeight, 0])

    // Maybe have fewer axis ticks if the window is smaller

    // Update your axes - almost always the same
    // Maybe have fewer axis ticks if the window is smaller
    if (svgWidth < 400) {
      xAxis.ticks(2)
    } else if (svgWidth < 550) {
      xAxis.ticks(4)
    } else {
      xAxis.ticks(null)
    }

    // Update your axes - almost always the same
    svg
      .select('.y-axis')
      .transition()
      .call(yAxis)

    svg
      .select('.x-axis')
      .transition()
      .attr('transform', 'translate(0,' + newHeight + ')')
      .call(xAxis)
    // Update your data points

    svg
      .selectAll('.region-circle')
      .transition()
      .ease(d3.easeElastic)
      .attr('cy', function(d) {
        return yPositionScale(d.values[0].price)
      })
      .attr('cx', function(d) {
        return xPositionScale(d.values[0].datetime)
      })

    svg
      .selectAll('.region-text')
      .transition()
      .ease(d3.easeElastic)
      .attr('y', function(d) {
        return yPositionScale(d.values[0].price)
      })
      .attr('x', function(d) {
        return xPositionScale(d.values[0].datetime)
      })

    svg
      .selectAll('.region-title')
      .transition()
      .ease(d3.easeElastic)
      .attr('x', newWidth / 2)

    const rectWidth =
      xPositionScale(parseTime('February-17')) -
      xPositionScale(parseTime('November-16'))

    svg
      .selectAll('.winter-rect')
      .attr('x', xPositionScale(parseTime('December-16')))
      .attr('width', rectWidth)
      .attr('height', newHeight)
  }

  // When the window resizes, run the function
  // that redraws everything
  window.addEventListener('resize', render)

  // And now that the page has loaded, let's just try
  // to do it once before the page has resized
  render()
}
