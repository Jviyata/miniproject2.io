// Function to create a complex bubble chart for Airbnb room types, reviews, and price data
export function createBubbleChart(selector, data) {
    // Clear any existing SVG
    d3.select(selector).select('svg').remove();
    
    // Set dimensions and margins
    const margin = { top: 40, right: 120, bottom: 60, left: 60 };
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
    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.x) * 1.1])
        .range([0, width]);
    
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.y) * 1.1])
        .range([height, 0]);
    
    const size = d3.scaleLinear()
        .domain([d3.min(data, d => d.size), d3.max(data, d => d.size)])
        .range([4, 15]);
    
    // Define color scale for room types
    const color = d3.scaleOrdinal()
        .domain(["Entire home/apt", "Private room", "Shared room"])
        .range(["#1f77b4", "#ff7f0e", "#2ca02c"]);
    
    // Add X axis
    svg.append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x));
    
    // Add X axis label
    svg.append("text")
        .attr("transform", `translate(${width/2}, ${height + margin.bottom - 10})`)
        .style("text-anchor", "middle")
        .text("Number of Reviews");
    
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
        .text("Price ($)");
    
    // Add grid lines
    svg.append("g")
        .attr("class", "grid")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x)
            .tickSize(-height)
            .tickFormat("")
        )
        .style("stroke-dasharray", "3,3")
        .style("stroke-opacity", 0.2);
    
    svg.append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(y)
            .tickSize(-width)
            .tickFormat("")
        )
        .style("stroke-dasharray", "3,3")
        .style("stroke-opacity", 0.2);
    
    // Create tooltip div
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    
    // Add bubbles
    svg.selectAll('.bubble')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'bubble')
        .attr('cx', d => x(d.x))
        .attr('cy', d => y(d.y))
        .attr('r', 0) // Start with radius 0 for animation
        .style('fill', d => color(d.group))
        .style('opacity', 0.7)
        .on("mouseover", function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .style('opacity', 1);
            
            tooltip.transition()
                .duration(200)
                .style("opacity", 0.9);
            
            tooltip.html(`<strong>${d.group}</strong><br>Reviews: ${Math.round(d.x)}<br>Price: $${Math.round(d.y)}<br>Min Nights: ${Math.round(d.size)}`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            d3.select(this)
                .transition()
                .duration(200)
                .style('opacity', 0.7);
            
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        })
        // Add animation
        .transition()
        .duration(800)
        .attr('r', d => size(d.size));
    
    // Add a title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Room Type, Reviews, and Price Relationship");
    
    // Add legend
    const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${width + 20}, 0)`);
    
    const roomTypes = ["Entire home/apt", "Private room", "Shared room"];
    
    roomTypes.forEach((type, i) => {
        const legendRow = legend.append("g")
            .attr("transform", `translate(0, ${i * 20})`);
        
        legendRow.append("rect")
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", color(type));
        
        legendRow.append("text")
            .attr("x", 20)
            .attr("y", 10)
            .attr("text-anchor", "start")
            .style("font-size", "12px")
            .text(type);
    });
    
    // Add legend for bubble size
    legend.append("text")
        .attr("x", 0)
        .attr("y", 80)
        .attr("text-anchor", "start")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .text("Bubble Size:");
    
    legend.append("text")
        .attr("x", 0)
        .attr("y", 95)
        .attr("text-anchor", "start")
        .style("font-size", "12px")
        .text("Minimum Nights");
    
    // Calculate and add group centroids for annotation
    const groups = d3.group(data, d => d.group);
    
    groups.forEach((groupData, groupName) => {
        const avgX = d3.mean(groupData, d => d.x);
        const avgY = d3.mean(groupData, d => d.y);
        
        svg.append("circle")
            .attr("cx", x(avgX))
            .attr("cy", y(avgY))
            .attr("r", 8)
            .style("fill", "none")
            .style("stroke", color(groupName))
            .style("stroke-width", 2)
            .style("stroke-dasharray", "3,3");
        
        svg.append("text")
            .attr("x", x(avgX))
            .attr("y", y(avgY) - 15)
            .attr("text-anchor", "middle")
            .style("font-size", "11px")
            .style("font-weight", "bold")
            .text(`${groupName} center`);
    });
}
