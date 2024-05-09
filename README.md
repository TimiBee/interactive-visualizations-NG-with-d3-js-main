# Interactive Visualizations with D3.js

## Current Result

You can access the website [here](https://interactive-visualizations-ng.netlify.app/).

![website-result-screenshot](result-screenshot.png)

## Description

### Set Up

First, I organized my files and got my data.

### HTML

Next, I moved on to the basic index.html skeleton with navbar to hold my visualization.

```html
<!DOCTYPE html>
<html lang='en'>
<head>
  <meta charset='UTF-8'>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
  <meta http-equiv='X-UA-Compatible' content='ie=edge'>
  <title>D3 Visualizations</title>
  <script src='https://code.jquery.com/jquery-3.3.1.slim.min.js' integrity='sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo'
    crossorigin='anonymous'></script>
  <script src='https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js' integrity='sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49'
    crossorigin='anonymous'></script>
  <script src='https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js' integrity='sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy'
    crossorigin='anonymous'></script>
  <link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css' integrity='sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO'
    crossorigin='anonymous'>
  <link rel='stylesheet' href='assets/css/style.css'>
  <link rel='stylesheet' href='assets/css/d3Style.css'>

</head>

<body>

  <nav class='navbar navbar-custom'>
    <a class='navbar-brand' href='index.html'>Nigeria States Poverty and Unemployment Trends</a>
    </div>
  </nav>

  <div class='container-fluid'>

    <div class='row'>
      <div class='col text-center'>
        <h4 id='plot-title'>Poverty vs. Unemployment Across 36 States</h4>
      </div>
    </div>

    <div class='row'>
      <div class='col text-center'>
        <div id='scatter'>
        </div>
      </div>
    </div>

    <div class='row justify-content-center'>
      <div class='col-md-8'>

        <div class='row justify-content-center'>
          <h5 id='caption'>Correlations Discovered Between Poverty and Unemployment</h5>
        </div>
        <div class='row'><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This above visualization shows a positive correlation between poverty and unemployment.
            Poorer states have higher incidences of unemployment. The top states showing this correlation are
            Yobe, Kwara, Enugu, Plateau, and Zamfara. Other states show healthier populations
            along with lower poverty rates, such as Lagos, Rivers, and Ogun. Not all states show this
            correlation. For example, Oyo and Kastina both have relatively high unemployment rates compared to
            poverty rates.
          </p>
        </div>

      </div>
    </div>

  </div>

  <footer>
    <div class='footer'>
      Made with 💜 and <a id='d3-link' href='https://d3js.org/' target='_blank' rel='noopener noreferrer'>D3.js</a>&nbsp;&nbsp;|&nbsp;&nbsp;Timi B 2023&nbsp;&nbsp;
      <a href='https://github.com/TimiBee/interactive-visualizations-NG-with-d3-js' target='_blank' rel='noopener noreferrer'><img id='gh-icon' src='icons8-github-64.png'></a>
    </div>
  </footer>

  <script src='https://cdnjs.cloudflare.com/ajax/libs/d3/5.5.0/d3.min.js'></script>
  <script src='https://cdnjs.cloudflare.com/ajax/libs/d3-tip/0.9.1/d3-tip.js'></script>
  <script type='text/javascript' src='assets/js/app.js'></script>

</body>

</html>
```


### D3.js

Then, I used d3.js to make an interactive visualization that would be rendered on my website using the local server.

```javascript
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
    .attr('dy','1em').attr('class','aText').text('Obese (%)')

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
    .html(function(d){return(`<strong>${d.state}</strong><br>Poverty: ${d.poverty}%<br>Obesity: ${d.unemployment}%`)})

  // add tooltip to chart
  chartGroup.call(toolTip)

  // tooltip event listeners (show/hide)
  circlesGroup.on('mouseover',function(data){toolTip.show(data,this)})
    .on('mouseout',function(data){toolTip.hide(data)})
}
```

### Styles

Last, I added styles to give a little bit more personalization.

```css
.navbar-custom {
  background-color: ##66a07c;
}

.navbar-brand:link,
.navbar-brand:visited,
.navbar-brand:hover,
.navbar-brand:active {
  color: white;
  font-size: 0.9em;
}

#plot-title {
  padding-top: 10px;
}

#caption {
  text-align: center;
}

footer {
  background-color:  #66a07c;
  color: white; 
  font-size: 9pt; 
  text-align: center; 
  vertical-align: middle;
  line-height: 45px;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;

}

footer p {
  margin: 0;
  font-size: 0.9em;
}

#d3-link:link,
#d3-link:visited,
#d3-link:hover,
#d3-link:active {
  color: white !important;
}

#gh-icon {
  width: 30px;
  height: 30px;
  background-size: 100%;
}
```

And I styled my D3 Visualization with its own .css file.

```css
.aText {
  font-family: sans-serif;
  font-size: 16px;
  text-anchor: middle;
}

.active {
  font-weight: bold;
  fill: #000;
  transition: fill 0.3s ease-out;
  text-anchor: middle;
}

.inactive {
  font-weight: lighter;
  fill: #c9c9c9;
  transition: fill 0.3s ease-out;
  text-anchor: middle;
}

.inactive:hover {
  fill: #000;
  cursor: pointer;
}

/* font size dependent on radius, see app.js */
.stateText {
  font-family: sans-serif;
  fill: #fff;
  text-anchor: middle;
}

.stateCircle {
  fill: #5db988;
  stroke: #e3e3e3;
}

.chart {
  display: block;
  margin: 0;
}

.d3-tip {
  padding: 10px;
  font-size: 14px;
  line-height: 1;
  line-height: 1.5em;
  color: #fff;
  text-align: center;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 4px;
}

/* Mobile Rules */
@media screen and (max-width: 530px) {
  .stateText {
    display: none;
  }

  .aText {
    font-size: 14px;
  }
}

@media screen and (max-width: 400px) {
  .aText {
    font-size: 13px;
  }
}
```
