Generate `solution.md` solving the following problem in general terms. Don't read the CSV, provide a general solution.

> You're given a time series of electricity consumption at 0.5-hour intervals, covering
> one month (attached: consumption.csv).
> Electricity is purchased under the following pricing:
>
> - Hours 17, 18, and 19 of each day (i.e. 17:00-20:00) cost 2 NIS/kWh
> - All other hours cost 1 NIS/kWh.
>
> You can buy a contract that changes the settlement. You buy a fixed amount (kWh
> per hour) that applies to every hour of the month, at 0.5 NIS/kWh. In any hour,
> consumption up to the contract amount is covered by the contract. Consumption
> above the contract amount is charged at the regular price for that hour. To clarify -
> you pay for a contract regardless of the actual usage [contract amount (kW) × total
> hours in month (h) × rate (NIS/kWh)].
> Your task: find the optimal contract amount.

Don't assume the concrete values in the problem. Use $r(h)$ for rate in a given hour and $u_h$ for usage in that hour. Use $r_f$ for the fixed contract rate and $q$ for the contract value.

write some TypeScript code showing the algorithm for the solution. Assume the relevant functions and constants are defined.

# Notation

Use `$` and `$$` for mathematical notation.
