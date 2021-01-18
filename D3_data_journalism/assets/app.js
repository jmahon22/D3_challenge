// @TODO: YOUR CODE HERE!
function makeResponsive(){

  // if the SVG area isn't empty when the browser loads, remove & replace it with a resized version of the chart
  var svgArea = d3.select("body").select("svg");

  //setup chart parameters
  var width = parseInt(d3.select("#scatter").style("width"))
  var height = (width - width /4)

  //clear SVG if Not Empty
    if (!svgArea.empty()) {
      svgArea.remove();
    }

  //chart parameters
  var svgWidth = width;
  var svgHeight = height;

  var margin = {
    top: 70,
    right: 70,
    bottom: 70,
    left: 100
    };

  var plotWidth = svgWidth - margin.left - margin.right;
  var plotHeight = svgHeight - margin.top - margin.bottom;

  // Create an SVG wrapper, append an SVG group that will hold our chart,
  // and shift the latter by left and top margins.
  var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  // append an SVG group
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  d3.csv("assets/NewsData.csv").then(function(NewsData) {
    
    //parse data
    NewsData.forEach(function(d) {
        d.poverty = +d.poverty
        d.healthcare  = +d.healthcare;
      });
  
      
    //y scale for veritcal axis
    var yLinearScale = d3.scaleLinear()
      .domain([
        d3.min(NewsData, d => d.healthcare)*.9,
        d3.max(NewsData, d => d.healthcare)*1
        ])
      .range([plotHeight, 0]);
  
    // x scale for horizontal axis
    var xLinearScale = d3.scaleLinear()
      .domain([
        d3.min(NewsData, d => d.poverty)*.9,
        d3.max(NewsData, d => d.poverty)*1
        ])
      .range([0, plotWidth]);
  
    //axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
  
    chartGroup
      .append("g")
      .call(leftAxis);
  
    chartGroup
      .append("g")
      .attr("transform", `translate(0, ${plotHeight})`)
      .call(bottomAxis);
  
    //create circles
    var circlesGroup = chartGroup.append('g').selectAll("circle")
      .data(NewsData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", "12")
      //.attr("fill", "red")
      .attr("opacity", ".8")
      .classed("stateCircle", true);
      // .transition()
      // .duration(1500)
      // //.delay(1000)
      // .attr("r", 14);
  
    //add state abbreviations to circles
    chartGroup.append("g").selectAll("text")
      .data(NewsData)
      .enter()
      .append("text")
      .attr("x", d => xLinearScale(d.poverty))
      .attr("y", d => yLinearScale(d.healthcare))
      .classed("stateText", true)
      .text(d => d.abbr)
      .attr("font-size", 11)
      .style("font-weight", "bold");
      // .transition()
      // .duration(1500)
      // //.delay(1000)
      // .attr("font-size", 12);
  
    //tooltip
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([90, -40])
      .html(function(d) {
        return (`${d.state}<br>Poverty: ${d.poverty}<br>Lacks Healthcare: ${d.healthcare}`);
      });
  
    chartGroup.call(toolTip);
  
    //create event listeners
    circlesGroup.on("mouseover", function(NewsData) {
      toolTip.show(NewsData, this)
      d3.select(this).style("fill", "blue").transition().duration(100);
    })
        
    // event listener for mouse out
    .on("mouseout", function(NewsData, index) {
      toolTip.hide(NewsData)
      d3.select(this).style("fill", "green").transition().duration(0);
    });
  
    // y axis labels
    chartGroup
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -50)
      .attr("x", 0 - (plotHeight / 2))
      .attr("dy", "1em")
      //.attr("dx", "-13em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");
  
    chartGroup
      .append("text")
      .attr("transform", `translate(${plotWidth / 2}, ${plotHeight + 20})`)
      // .attr('x', plotWidth /2)
      // .attr('y', plotHeight +20)
      .attr("class", "axisText")
      .attr("dy", "1em")
      .text("In Poverty (%)");
  
  
    // Catching erros in console without having to catch at every line
    }).catch(function(error) {
      console.log(error);
    });

}
makeResponsive();

//when browser window is resized, makeResponsive is called
d3.select(window).on("resize", makeResponsive);