d3.json('https://2cec133e5e8a406f8be72250e993b2b2.vfs.cloud9.us-east-2.amazonaws.com/track/testuser1/JSON').then(function(data){
     
     /*{"_id":"5d10077db5af7017ed252acd","username":"testuser1","log":[{"date":"2019-06-24T00:00:00.000Z","_id":"5d1011eff8b8341de35afb0c","systolic":120,"diastolic":80,"activity":"washed plates","lemonwater":"yes"}],"__v":1}*/
     
     const w = 1000;
     const h = 700;
     const padding = 100;
     
     const svg = d3.select('body')
     .append('svg')
     .attr('width', w)
     .attr('height', h)
     
     var toolTip = d3.select('body')
     .append('div')
     .attr('id', 'tooltip')
     .style('opacity', 0)
     
     var colors = d3.scaleOrdinal()
     .domain(["Systolic", "Diastolic"])
     .range(["#F71735", "#44FFD1"]);
     
     const xScale = d3.scaleLinear()
     .domain([d3.min(data.log, function(d){return d.date}), d3.max(data.log, function(d){return d.date})])
     .range([padding, w-padding])
     
     const yScale = d3.scaleLinear()
     .domain([d3.min(data.log, function(d){return d.diastolic}), d3.max(data.log, function(d){return d.systolic})])
     var bloodPressures = d3.keys(data.log)
     .filter(function(item){return item=='systolic'&& item=='diastolic'})
     
     var series = bloodPressures.map(function(item){
         return data.log.map(function(d){
             return{'date': d.date, 'y':d[item], 'activity': d.activity, 'lemonwater': d.lemonwater}
         })
     })
     
     
     svg.selectAll('.series')
     .data(series)
     .enter().append('g')
     .attr('class', 'series')
     .style('fill', function(d, i){})
     .selectAll('.dot')
     data(function(d){return d})
     .enter().append('circle')
     .attr('class', 'dot')
     .attr('r', 5)
     .attr('cx', function(d){return xScale(d.date)})
     .attr('cy', function(d){return yScale(d.y)})
     .on('mouseover', function(d){
         toolTip.transition()
         .duration(300)
         .style('opacity', 1)
         toolTip.html(d.y + 'mmHg' + <br> + 'Activity: ' + d.activity + <br> + 'lemonwater: ' + d.lemonwater)
         .style("left", (d3.event.pageX) + 'px')
         .style("top", (d3.event.pageY) + 'px')
         
     })
     .on("mouseout", function(d){
       toolTip.transition()
           .duration(400)
            .style("opacity", 0)});
            
    //x and y axes
            
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
  const yAxis = d3.axisLeft(yScale)
  
  svg.append('g')
.attr("transform", "translate(0," + (h-padding) + ")")
.call(xAxis)
.attr("id", "x-axis")
  //x-axis label
svg.append("text")
.attr("id", "x-axis-label")
.text("Date")
 .attr("x", w/2)
  .attr("y", h-20)
  .attr("font-size", 20)
  .style("text-anchor", "end")
  
svg.append('g')
.attr("transform", "translate(" + (padding) + ", 0)")
.call(yAxis)
.attr("id", "y-axis")
  //y-axis label
 svg.append("text")
.attr("id", "y-axis-label")
.attr("y", padding-60)
 .attr("x", -h/2)
 .attr("transform", "rotate(-90)")
 .attr("dy", ".71em")
.text("Blood Pressure (mmHg)")

//legend
  
  
 var legend = svg.selectAll('.legend')
 .data(colors.range())
 .enter()
 .append('g')
.attr("transform", function(d, i){ return "translate(" +(w/2) + "," + h/2 - i * 20 + ")"})

  .style("font-size","12px")
 .attr("id", "legend")
  
  legend.append("rect")
  .attr("x", w - 66)
   .attr("y", function(d, i){return h-205 + 15 *i})
   .attr("width", 18)
   .attr("height", 18)
  .attr("fill", function(d){return d})
  
 legend.append("text")
  .attr("x", w - 84)
   .attr("y", function(d, i){return h-200 + 15 *i})
   .attr("dy", ".35em")
   .style("text-anchor", "end")
  .text((d) => d === "#F71735" ? "Systolic": "Diastolic")
  

 
     
     /*svg.selectAll('circle')
     .data(data.log)
     .enter()
     .append('cirlce')
     .attr('class', 'dot')
     .attr('r', 5)
     .attr('cx', function(d){return xScale(d.date)})
     .attr('cy', function(d){return yScale(d.systolic)})
     .attr()*/
     
     
    
})