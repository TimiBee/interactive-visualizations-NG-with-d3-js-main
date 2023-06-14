// canvas and svg width, height, and margins
const svgWidth = 900
const svgHeight = 450
const margin = {
    top: 25,
    right: 50,
    bottom: 70,
    left: 90
  }
const width = svgWidth - margin.left - margin.right
const height = svgHeight - margin.top - margin.bottom

// canvas
const svg = d3.select('#scatter').append('svg').attr('width', svgWidth).attr('height',svgHeight)

// chartGroup
const chartGroup = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`)

// data
const dataFile = 'assets/data/data.csv'
d3.csv(dataFile).then(visualization)

// plot function
function visualization(states) {
  
  // data loop
  states.map(function (data) {
    data.poverty = +data.poverty
    data.unemployment = +data.unemployment
  })

  // scale fnxs with min and max (plus a little more space)
  const linearScaleX = d3.scaleLinear().domain([8,d3.max(states,(d,i)=>d.poverty+0.5)]).range([0, width])
  const linearScaleY = d3.scaleLinear().domain([20,d3.max(states,(d,i)=>d.unemployment+1)]).range([height, 0])

  // call scale fnx with axes fnxs with set tick marks on x axis
  const bottomAxis =  d3.axisBottom(linearScaleX).ticks(10)
  const leftAxis =  d3.axisLeft(linearScaleY)

  // append axes to chartGroup
  chartGroup.append('g').attr('transform', `translate(0, ${height})`).call(bottomAxis)
  chartGroup.append('g').call(leftAxis)

  // label axes
  chartGroup.append('text').attr('transform','rotate(-90)').attr('x',0-height/2).attr('y',0-margin.left+40)
    .attr('dy','1em').attr('class','aText').text('unemploy (%)')

  chartGroup.append('text').attr('transform',`translate(${width/2},${height+margin.top+20})`).attr('class','aText').text('In Poverty (%)')

  // create plot markers
  let circlesGroup = chartGroup.selectAll('circle').data(states).enter().append('circle')
    .attr('cx',d=>linearScaleX(d.poverty)).attr('cy',d=>linearScaleY(d.unemployment))
    .attr('r','17').attr('fill','#66a07c').attr('opacity','0.85')
    
  // add state abbreviations to circles (centered on both x and y of circle)
  circlesGroup = chartGroup.selectAll().data(states).enter().append('text')
    .attr('x',d=>linearScaleX(d.poverty)).attr('y',(d,i)=>linearScaleY(d.unemployment)+4)
    .style('font-size','15px').style('text-anchor','middle').style('fill','white').text(d=>(d.abbr))

  // make tooltip
  const toolTip = d3.tip().attr('class','d3-tip').offset([80,-65])
    .html(function(d){return(`<strong>${d.state}</strong><br>Poverty: ${d.poverty}%<br>unemployment: ${d.unemployment}%`)})

  // add tooltip to chart
  chartGroup.call(toolTip)

  // tooltip event listeners (show/hide)
  circlesGroup.on('mouseover',function(data){toolTip.show(data,this)})
    .on('mouseout',function(data){toolTip.hide(data)})
}