function drawCharts() {

    d3.csv("UKX_5Mins_20180709_20180716.csv").then((prices) => {

        //Define months names

        const months = { 0: 'Jan', 1: 'Feb', 2: 'Mar', 3: 'Apr', 4: 'May', 5: 'Jun', 6: 'Jul', 7: 'Aug', 8: 'Sep', 9: 'Oct', 10: 'Nov', 11: 'Dec' };

        console.log(prices);

        var dateFormat = d3.timeParse("%Y-%m-%d %H:%M");

        //Parse Date
        for (var i = 0; i < prices.length; i++) {
            prices[i].Date = dateFormat(prices[i].Date);
            // console.log(prices[i].Date);
        }
        //define margin bounds
        // console.log(prices);

        const margin = { top: 20, right: 70, bottom: 240, left: 50 },
            margin2 = { top: 680, right: 65, bottom: 80, left: 50 },
            w = 1200 - margin.left - margin.right,
            h = 820 - margin.top - margin.bottom,
            h2 = 820 - margin2.top - margin2.bottom;

        //define chart dimensions              
        var svg = d3.select("#chart")
            .attr("width", w + margin.left + margin.right)
            .attr("height", h + margin.top + margin.bottom);

        //define chart dimensions
        var focus = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        //define brush dimensions
        var context = svg.append("g")
            .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

        //get array of dates in data
        let dates = _.map(prices, 'Date');
        // console.log(dates)

        //define min and amx dates in data
        var xmin = d3.min(prices.map(r => r.Date.getTime()));
        var xmax = d3.max(prices.map(r => r.Date.getTime()));

        //define linear x-axis scale
        var xScale = d3.scaleLinear()
            .domain([-1, dates.length])
            .range([0, w]);
        // define quantize date scale with continuous domain and discrete range
        var xDateScale = d3.scaleQuantize()
            .domain([0, dates.length])
            .range(dates);
        // define banded x-axis scale to account for discontinuities in financial time series
        let xBand = d3.scaleBand()
            .domain(d3.range(-1, dates.length))
            .range([0, w])
            .padding(0.3);
        //define x-axis,apply scale and tick formatting
        var xAxis = d3.axisBottom()
            .scale(xScale)
            .tickFormat((d) => dateFormatter(d));
        // add clip path to focus - needed to make chart draggable
        focus.append("rect")
            .attr("id", "rect")
            .attr("width", w)
            .attr("height", h)
            .style("fill", "none")
            .style("pointer-events", "all")
            .attr("clip-path", "url(#clip)");

        //add x-axis to focus
        var gX = focus.append("g")
            .attr("class", "axis x-axis")
            .attr("transform", "translate(0," + h + ")")
            .call(xAxis);

        //wrap x-axis labels
        // gX.selectAll(".tick text")
        //     .attr("transform", "translate(-10,0)rotate(-45)")
        //     .style("text-anchor", "end");
        gX.selectAll(".tick text")
            .call(wrap, xBand.bandwidth());

        // add x-axis to brush
        var gX2 = context.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + h2 + ")")
            .call(xAxis);

        // add brush x-axis labels
        gX2.selectAll(".tick text")
            .call(wrap, xBand.bandwidth());

        // define min and max prices in data
		var ymin = d3.min(prices.map(r => r.Low));
		var ymax = d3.max(prices.map(r => r.High));

		// define linear y-axis scale
		var yScale = d3.scaleLinear().domain([ymin, ymax]).range([h, 0]).nice();

		// define y-axis and apply scale
		var yAxis = d3.axisLeft().scale(yScale);
		
		// Add y-axis to chart
		var gY = focus.append("g")
			.attr("class", "axis y-axis")
			.call(yAxis);
        
        //add clip path to chart
        var chartBody = focus.append("g")
            .attr("class","chartBody")
            .style("pointer-events", "all")
            .attr("clip-path", "url(#clip)");
        
        //draw candles
        let candles = chartBody.selectAll(".candle")
            .data(prices)
            .enter()
            .append("rect")
            .attr("class", "candle")
            .attr("x", (d, i) => xScale(i) - xBand.bandwidth() / 2)
            .attr("y", (d) => yScale(d.Low))
            .attr
    })
}

drawCharts()