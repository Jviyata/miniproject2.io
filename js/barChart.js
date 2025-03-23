// Function to create a bar chart for NYC Airbnb neighborhood data
export function createBarChart(selector, data) {
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
    const x = d3.scaleBand()
        .domain(data.map(d => d.category))
        .range([0, width])
        .padding(0.2);
    
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
        .text("Neighborhood Group");
    
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
        .text("Number of Listings");
    
    // Create tooltip div
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    
    // Calculate total listings
    const totalListings = data.reduce((sum, d) => sum + d.value, 0);
    
    // Add the bars
    svg.selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.category))
        .attr('width', x.bandwidth())
        .attr('y', height) // Start at the bottom
        .attr('height', 0) // Initial height of 0
        .on("mouseover", function(event, d) {
            d3.select(this).transition()
                .duration(200)
                .attr('opacity', 0.8);
            
            const percentage = ((d.value / totalListings) * 100).toFixed(1);
            
            tooltip.transition()
                .duration(200)
                .style("opacity", 0.9);
            
            tooltip.html(`<strong>${d.category}</strong><br>${d.value} listings<br>${percentage}% of total`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            d3.select(this).transition()
                .duration(200)
                .attr('opacity', 1);
            
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        })
        // Add animation for bars growing up from bottom
        .transition()
        .duration(800)
        .attr('y', d => y(d.value))
        .attr('height', d => height - y(d.value));
    
    // Add title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Distribution of Airbnb Listings by Neighborhood Group");
    
    // Add percentage labels on top of bars
    svg.selectAll('.label')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'label')
        .attr('x', d => x(d.category) + x.bandwidth() / 2)
        .attr('y', d => y(d.value) - 5)
        .attr('text-anchor', 'middle')
        .text(d => ((d.value / totalListings) * 100).toFixed(0) + '%')
        .style('font-size', '12px')
        .style('opacity', 0)
        .transition()
        .delay(800)
        .duration(500)
        .style('opacity', 1);
}
