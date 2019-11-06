import * as d3 from 'd3'

const margin = { top: 10, left: 10, right: 10, bottom: 10 }

const height = 480 - margin.top - margin.bottom

const width = 480 - margin.left - margin.right

const svg = d3
  .select('#chart-3')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const radius = 200

const radiusScale = d3
  .scaleLinear()
  .domain([10, 100])
  .range([40, radius])

const angleScale = d3
  .scalePoint()
  .domain([
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
    'Blah'
  ])
  .range([0, Math.PI * 2])

const line = d3
  .radialArea()
  .outerRadius(function(d) {
    return radiusScale(d.high_temp)
  })
  .innerRadius(function(d) {
    return radiusScale(d.low_temp)
  })
  .angle(function(d) {
    return angleScale(d.month_name)
  })

d3.csv(require('/data/all-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  const container = svg
    .append('g')
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

  datapoints.forEach(d => {
    d.high_temp = +d.high_temp
    d.low_temp = +d.low_temp
  })

  const circleBands = [20, 30, 40, 50, 60, 70, 80, 90]
  const textBands = [30, 50, 70, 90]

  container
    .selectAll('.bands')
    .data(circleBands)
    .enter()
    .append('circle')
    .attr('class', 'bands')
    .attr('fill', 'none')
    .attr('stroke', 'gray')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', function(d) {
      return radiusScale(d)
    })
    .lower()

  container
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('class', 'city-name')
    .text('NYC')
    .attr('font-size', 30)
    .attr('font-weight', 700)
    .attr('alignment-baseline', 'middle')

  container
    .selectAll('.temp-notes')
    .data(textBands)
    .enter()
    .append('text')
    .attr('class', 'temp-notes')
    .attr('x', 0)
    .attr('y', d => -radiusScale(d))
    .attr('dy', -2)
    .text(d => d + '°')
    .attr('text-anchor', 'middle')
    .attr('font-size', 8)

  /* 

  Bscrollytelling

  */
  d3.select('#reset-step').on('stepin', function() {
    svg.selectAll('.nyc-temp').style('visibility', 'hidden')
    svg.selectAll('.tuscon-temp').style('visibility', 'hidden')
    svg.selectAll('.bj-temp').style('visibility', 'hidden')
    svg.selectAll('.lima-temp').style('visibility', 'hidden')
    svg.selectAll('.stockholm-temp').style('visibility', 'hidden')
  })

  d3.select('#nyc-step').on('stepin', function() {
    svg
      .selectAll('.nyc-temp')
      .attr('fill', 'green')
      .style('visibility', 'visible')
    svg.selectAll('.tuscon-temp').style('visibility', 'hidden')
    svg.selectAll('.bj-temp').style('visibility', 'hidden')
    svg.selectAll('.lima-temp').style('visibility', 'hidden')
    svg.selectAll('.stockholm-temp').style('visibility', 'hidden')
  })

  d3.select('#beijing-step').on('stepin', function() {
    svg
      .selectAll('.bj-temp')
      .attr('fill', 'blue')
      .style('visibility', 'visible')
    svg.selectAll('.nyc-temp').style('visibility', 'hidden')
    svg.selectAll('.tuscon-temp').style('visibility', 'hidden')
    svg.selectAll('.lima-temp').style('visibility', 'hidden')
    svg.selectAll('.stockholm-temp').style('visibility', 'hidden')

    container.select('#city-name').text('Beijing')
  })

  d3.select('#stockholm-step').on('stepin', function() {
    svg
      .selectAll('.stockholm-temp')
      .attr('fill', 'purple')
      .style('visibility', 'visible')
    svg.selectAll('.bj-temp').style('visibility', 'hidden')
    svg.selectAll('.nyc-temp').style('visibility', 'hidden')
    svg.selectAll('.tuscon-temp').style('visibility', 'hidden')
    svg.selectAll('.lima-temp').style('visibility', 'hidden')
    container.select('#city-name').text('Stockholm')
  })

  d3.select('#lima-step').on('stepin', function() {
    svg
      .selectAll('.lima-temp')
      .attr('fill', 'orange')
      .style('visibility', 'visible')
    svg.selectAll('.stockholm-temp').style('visibility', 'hidden')
    svg.selectAll('.bj-temp').style('visibility', 'hidden')
    svg.selectAll('.nyc-temp').style('visibility', 'hidden')
    svg.selectAll('.tuscon-temp').style('visibility', 'hidden')
    container.select('#city-name').text('Lima')
  })

  d3.select('#tuscon-step').on('stepin', function() {
    svg
      .selectAll('.tuscon-temp')
      .attr('fill', 'red')
      .style('visibility', 'visible')
    svg.selectAll('.lima-temp').style('visibility', 'hidden')
    svg.selectAll('.stockholm-temp').style('visibility', 'hidden')
    svg.selectAll('.bj-temp').style('visibility', 'hidden')
    svg.selectAll('.nyc-temp').style('visibility', 'hidden')
    container.select('#city-name').text('Tuscon')
  })

  // Filter it so I'm only looking at NYC datapoints
  const nycDatapoints = datapoints.filter(d => d.city === 'NYC')
  nycDatapoints.push(nycDatapoints[0])

  container
    .append('path')
    .attr('class', 'nyc-temp')
    .datum(nycDatapoints)
    .attr('d', line)
    .attr('fill', 'none')
    .attr('opacity', 0.75)

  const bjDatapoints = datapoints.filter(d => d.city === 'Beijing')
  bjDatapoints.push(bjDatapoints[0])

  container
    .append('path')
    .attr('class', 'bj-temp')
    .datum(bjDatapoints)
    .attr('d', line)
    .attr('fill', 'none')
    .attr('opacity', 0.75)

  const limaDatapoints = datapoints.filter(d => d.city === 'Lima')
  limaDatapoints.push(limaDatapoints[0])

  container
    .append('path')
    .attr('class', 'lima-temp')
    .datum(limaDatapoints)
    .attr('d', line)
    .attr('fill', 'none')
    .attr('opacity', 0.75)

  const tusconDatapoints = datapoints.filter(d => d.city === 'Tuscon')
  tusconDatapoints.push(tusconDatapoints[0])

  container
    .append('path')
    .attr('class', 'tuscon-temp')
    .datum(tusconDatapoints)
    .attr('d', line)
    .attr('fill', 'none')
    .attr('opacity', 0.75)

  const stockholmDatapoints = datapoints.filter(d => d.city === 'Stockholm')
  stockholmDatapoints.push(stockholmDatapoints[0])

  container
    .append('path')
    .attr('class', 'stockholm-temp')
    .datum(stockholmDatapoints)
    .attr('d', line)
    .attr('fill', 'none')
    .attr('opacity', 0.75)

  /* 

  Responsive design render function

  */

  function render() {
    console.log('Rendering')

    // This section will always be the same (except the last line, maybe)
    const svgContainer = svg.node().closest('div')
    const svgWidth = svgContainer.offsetWidth
    const svgHeight = window.innerHeight
    // If you don't want the height to change, use this
    // const newHeight = height + margin.top + margin.bottom

    // always be the same
    const actualSvg = d3.select(svg.node().closest('svg'))
    actualSvg.attr('width', svgWidth).attr('height', svgHeight)

    // always be the same
    const newWidth = svgWidth - margin.left - margin.right
    const newHeight = svgHeight - margin.top - margin.bottom

    // Update your scales - almost always be the same
    radiusScale.range([0, Math.min((newWidth - 60) / 2, (newHeight - 60) / 2)])
    line
      .outerRadius(function(d) {
        return radiusScale(d.high_temp)
      })
      .innerRadius(function(d) {
        return radiusScale(d.low_temp)
      })

    // Update your axes - almost always the same
    container
      .selectAll('.bands')
      .attr('r', function(d) {
        return radiusScale(d)
      })
      .lower()

    container.selectAll('.temp-notes').attr('y', d => -radiusScale(d))

    // Update your data points
  }

  // When the window resizes, run the function
  // that redraws everything
  window.addEventListener('resize', render)

  // And now that the page has loaded, let's just try
  // to do it once before the page has resized
  render()
}
