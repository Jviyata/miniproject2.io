export function createLineChart(data, selector) {
    // Set the dimensions and margins of the graph
    const margin = { top: 30, right: 30, bottom: 60, left: 60 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Clear any existing SVG
    d3.select(selector).html("");

    // Append the svg object to the selector
    const svg = d3.select(selector)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add X axis
    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.min_nights)])
        .range([0, width]);
    
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(10));

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.avg_price) * 1.1])
        .range([height, 0]);
    
    svg.append("g")
        .call(d3.axisLeft(y));

    // Create tooltip
    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px");

    // Add the line
    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 2.5)
        .attr("d", d3.line()
            .x(d => x(d.min_nights))
            .y(d => y(d.avg_price))
        );

    // Add data points
    svg.selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.min_nights))
        .attr("cy", d => y(d.avg_price))
        .attr("r", 5)
        .attr("fill", "#69b3a2")
        .on("mouseover", function(event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`Minimum Nights: ${d.min_nights}<br/>Average Price: $${d.avg_price}`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
            d3.select(this).attr("r", 8).attr("fill", "#A94A4A");
        })
        .on("mouseout", function() {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
            d3.select(this).attr("r", 5).attr("fill", "#690B22");
        });

    // Add labels
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", `translate(${width/2}, ${height + margin.bottom - 10})`)
        .text("Minimum Nights Required");

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 15)
        .attr("x", -height / 2)
        .text("Average Price ($)");
}
