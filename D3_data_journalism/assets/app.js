// @TODO: YOUR CODE HERE!
function makeResponsive(){
    var svgWidth = 960;
    var svgHeight = 500;

    var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
    };

    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    // Create an SVG wrapper, append an SVG group that will hold our chart,
    // and shift the latter by left and top margins.
    var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

    // Append an SVG group
    var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    d3.csv("NewsData.csv").then(function(NewsData, err) {
        if (err) throw err;
    
    //parse data
    NewsData.forEach(function(d) {
        d.poverty = +d.poverty
        d.healthcare  = +d.healthcare;
      });
  
      
    //y scale for veritcal axis
      var yLinearScale = d3.scaleLinear()
          .domain([
                  d3.min(NewsData, d => d.healthcare)*.9,
                  d3.max(NewsData, d => d.healthcare)*1.1
                ])
          .range([chartHeight, 0]);
  
      // x scale for horizontal axis
      var xLinearScale = d3.scaleLinear()
          .domain([
                  d3.min(NewsData, d => d.poverty)*.9,
                  d3.max(NewsData, d => d.poverty)*1.1
                ])
          .range([0, chartWidth]);
  
  
      //axis functions
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);
  
      chartGroup
        .append("g")
        .call(leftAxis);
  
      chartGroup
        .append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
  
    //create circles
        var circlesGroup = chartGroup.append('g').selectAll("circle")
            .data(Data)
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
          .data(Data)
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
        circlesGroup.on("mouseover", function(data) {
          toolTip.show(data, this)
          d3.select(this).style("fill", "blue").transition().duration(100);
        })
        
          // event listener for mouse out
          .on("mouseout", function(data, index) {
            toolTip.hide(data)
            d3.select(this).style("fill", "green").transition().duration(0);
          });
  
        // y axis labels
        chartGroup
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -50)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            //.attr("dx", "-13em")
            .attr("class", "axisText")
            .text("Lacks Healthcare (%)");
  
        chartGroup
          .append("text")
          .attr("transform", `translate(${width / 2}, ${height + 20})`)
          // .attr('x', chartWidth /2)
          // .attr('y', chartHeight +20)
          .attr("class", "axisText")
          .attr("dy", "1em")
          .text("In Poverty (%)");
  
  
        // Catching erros in console without having to catch at every line
        }).catch(function(error) {
        console.log(error);
        });

}
makeResponsive();