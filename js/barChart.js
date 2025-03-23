export function createBarChart(data, selector) {
    // Set the dimensions and margins of the graph
    const margin = { top: 30, right: 30, bottom: 70, left: 60 };
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

    // X axis
    const x = d3.scaleBand()
        .range([0, width])
        .domain(data.map(d => d.neighborhood))
        .padding(0.2);
    
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.count) * 1.1])
        .range([height, 0]);
    
    svg.append("g")
        .call(d3.axisLeft(y));

    // Calculate total for percentage
    const total = data.reduce((sum, d) => sum + d.count, 0);

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

    // Bars
    svg.selectAll("mybar")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => x(d.neighborhood))
        .attr("y", d => y(d.count))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.count))
        .attr("fill", "#69b3a2")
        .on("mouseover", function(event, d) {
            const percentage = ((d.count / total) * 100).toFixed(1);
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`${d.neighborhood}<br/>${d.count} listings<br/>${percentage}% of total`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
            d3.select(this).attr("fill", "#2E8B57");
        })
        .on("mouseout", function() {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
            d3.select(this).attr("fill", "#69b3a2");
        });

    // Add labels
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", `translate(${width/2}, ${height + margin.bottom - 5})`)
        .text("Neighborhood Group");

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 15)
        .attr("x", -height / 2)
        .text("Number of Listings");
}
