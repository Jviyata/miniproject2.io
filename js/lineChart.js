// Function to create a line chart for Airbnb minimum nights vs price data
export function createLineChart(selector, data) {
    // Clear any existing SVG
    d3.select(selector).select('svg').remove();
    
    // Set dimensions and margins
    const margin = { top: 40, right: 30, bottom: 60, left: 60 };
    const width = document.querySelector(selector).clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    
    // Create SVG element
    const svg = d3.select(selector)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Create scales
    const x = d3.scalePoint()
        .domain(data.map(d => d.minNights))
        .range([0, width])
        .padding(0.5);
    
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value) * 1.1]) // Add 10% padding
        .range([height, 0]);
    
    // Add X axis
    svg.append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x));
    
    // Add X axis label
    svg.append("text")
        .attr("transform", `translate(${width/2}, ${height + margin.bottom - 10})`)
        .style("text-anchor", "middle")
        .text("Minimum Nights");
    
    // Add Y axis
    svg.append('g')
        .attr('class', 'axis y-axis')
        .call(d3.axisLeft(y));
    
    // Add Y axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Average Price ($)");
    
    // Create a line generator
    const line = d3.line()
        .x(d => x(d.minNights))
        .y(d => y(d.value))
        .curve(d3.curveMonotoneX); // Smooth curve
    
    // Add grid lines
    svg.append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(y)
            .tickSize(-width)
            .tickFormat("")
        )
        .style("stroke-dasharray", "3,3")
        .style("stroke-opacity", 0.2);
    
    // Create clip path for line animation
    svg.append("defs")
        .append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", 0) // Start with zero width for animation
        .attr("height", height)
        .transition()
        .duration(1000)
        .attr("width", width); // Animate to full width
    
    // Add the line path with the clip path
    svg.append('path')
        .datum(data)
        .attr('class', 'line')
        .attr('d', line)
        .attr("clip-path", "url(#clip)");
    
    // Create tooltip div
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    
    // Add data points
    svg.selectAll('.dot')
        .data(data)
        .enter().append('circle')
        .attr('class', 'dot')
        .attr('cx', d => x(d.minNights))
        .attr('cy', d => y(d.value))
        .attr('r', 4)
        .style('opacity', 0.7)
        .on("mouseover", function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('r', 6)
                .style('opacity', 1);
            
            tooltip.transition()
                .duration(200)
                .style("opacity", 0.9);
            
            tooltip.html(`<strong>Minimum Nights: ${d.minNights}</strong><br>Avg. Price: $${d.value.toFixed(2)}`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('r', 4)
                .style('opacity', 0.7);
            
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
    
    // Add a title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Average Price by Minimum Stay Requirement");
    
    // Find points of interest for annotation (e.g., significant price jumps)
    // For Airbnb data, interesting points are typically at 1, 7, 30, and 365 days
    const keyPoints = [
        data.find(d => d.minNights === 1),
        data.find(d => d.minNights === 7),
        data.find(d => d.minNights === 30),
        data.find(d => d.minNights === 365)
    ].filter(d => d !== undefined);

    // Add annotations for key points
    keyPoints.forEach(point => {
        svg.append("circle")
            .attr("cx", x(point.minNights))
            .attr("cy", y(point.value))
            .attr("r", 5)
            .style("fill", "red");
        
        svg.append("text")
            .attr("x", x(point.minNights) + 10)
            .attr("y", y(point.value) - 10)
            .text(`${point.minNights} night${point.minNights > 1 ? 's' : ''}`)
            .style("font-size", "12px")
            .style("fill", "red");
    });
}
