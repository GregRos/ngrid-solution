Generate a React-based client-only app that visualizes the cost curves discussed in #file:./solution.md.

We want to visualize the contract cost vs metered cost, so we should use an interactive graph.

# Control element

This controls the following variables:

1. Standard usage rate
2. Peak usage rate
3. Peak interval (hour slider with two knobs)

# Interactive element

The first part should have an input and slider with a contract value. A button will set the value to the computed optimized one. During a sales meeting, the interactive input would allow representatives to show how different contracts affect total cost.

# Usage graph

There should be a graph of usage with two lines, the normal usage line and the contract line (which is flat).

## Stats

For this graph, there should be a stat block containing:

1. Total hours in the month
2. Total energy usage in kWh
3. Energy usage guaranteed by the contract

# Cost graph

The second graph should be an energy cost graph. It should have two lines, the total energy cost and a weighted contract energy cost.

This weighted contract energy cost is essentially the amount of cost saved by having the contract.

This second line divides the energy cost line into three important areas:

1. The area below that line, which is avoided metered cost
2. The area above the line, which is paid by rate
3. The parts of the graph below the contract line and the cost line, which is the cost of potential energy usage that is "wasted" by having the contract

These areas should be colored.

## Stats

A stat block should show:

1. Total cost without the contract
2. Total cost with the contract:
    1. The cost covered by the contract
    2. The cost outside of the contract
3. Cost loss vs optimal contract solution

there should be a stat called "savings" which is the metered spending - the contract. This should be in a big hero section at the top of the stats and colored

# Instructions

- Use Parcel as a bundler
- Use a CSS framework with SCSS and BEM
- Frontend code should be React/TS
- Serve the CSV as static content and requested by the page, which is then stored in state so it doesn't need to be requested again.
- The whole thing should be one page
- Use Apache ECharts
- Use dayjs for dates

# CRITICAL INSTRUCITONS

1. Create a zod schema for a Reading but otherwise assume data is valid
2. Always use dayjs for dates
3. Do not check for errors

# Change

- Show energy usage and cost cumulatively
- Each part of the dashboard should be its own component
- Use an appropriate CSV parser to parse CSV data
- Use the CSV parser's heading parsing feature
