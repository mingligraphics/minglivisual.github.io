import * as d3 from 'd3'
import * as topojson from 'topojson'

let margin = { top: 20, left: 20, right: 20, bottom: 10 }

let height = 500 - margin.top - margin.bottom

let width = 1000 - margin.left - margin.right

let svg = d3
  .select('#chart-2')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  const projection = d3.geoEqualEarth()

  
  // out geoPath needs a PROJECTION variable
  const path = d3.geoPath().projection(projection)
  
  Promise.all([
    d3.json(require('/data/world.topojson')),
    d3.csv(require('/data/airport-codes-subset.csv'))
  ])
    .then(ready)
    .catch(err => console.log('Failed on', err))
  
  function ready([json, datapoints]) {
  
  const countries = topojson.feature(json, json.objects.countries)
  console.log(countries)
  

  svg.append('path')  
  .datum({type: 'Sphere'})
  .attr('d', path)
  .attr('stroke','black')
  .attr('fill','#81DAF5')

  svg
  .selectAll('.country')
  .data(countries.features)
  .enter()
  .append('path')
  .attr('class', 'country')
  .attr('d', path)
  .attr('fill','lightgrey')
  .attr('stroke','black')

  
  svg
  .selectAll('.airports')
  .data(datapoints)
  .enter()
  .append('circle')
  .attr('class', 'cities')
  .attr('r', 2)
  .attr('fill','white')
  .attr('transform', d => {
    const coords = projection([d.longitude, d.latitude])
    return `translate(${coords})`
  })

//-----------------------------------------------------------------  
  // Build a new place to keep all the vote data
  const airportStore = d3.map()

  //Copy our datapoints into a dictionary.
  
  datapoints.forEach(function(d) {
      airportStore.set(d.iata_code, [d.longitude, d.latitude])
      // otherAirport = airportStore.get(d.iata_code)
      
      // coords = [JFK, otherAirport]

      // console.log(airportStore.get(d.iata_code))

      geoLine = {
        type: 'LineString',
        coordinates: [[-74, 40],airportStore.get(d.iata_code)]
      }
    
      console.log(geoLine)
      svg
        .selectAll('path')
        .enter().append('path')
        .data(geoLine)
        .attr('stroke', 'white')
        .attr('fill', 'white')
        .attr('d', path)   
      
  })
  
  
  //We started off with
  
  //[ { state_name: 'Idaho', population: 20, votes: 3}, { state_name: 'Virginia', population: 40, votes: 4}]
  
 // and then end up with
  
 //  {
 //     'Idaho': { state_name: 'Idaho', population: 20, votes: 3},
 //     'Virginia': { state_name: 'Virginia', population: 40, votes: 4}
  // }
  
  //Why is this helpful??? Well, if we're somewhere that we don't have the datapoint but know the state's name, we can get the datapoint!
  
      // Add a state path for every state feature from our JSON
  // svg.selectAll('path')
  //     .data(states.features)
  //     .enter().append('path')
  //     .attr('d', path)
  //     .attr('fill', function(d) {
  //             // But how do we get the 'votes' column from the CSV?
  //             // we can't use d.properties.votes because this is the JSON not the CSV!
  //             // maybe the JSON only knows the name of the state in d.properties.name
  //     })
  
  //You just say hey, use the voteStore and get the CSV datapoint based on the state name
  
  //---------------------------------------
    }