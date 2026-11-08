# Finding the optimal contract amount

Let each observation $h$ represent an interval of duration $\Delta t_h$ hours, with average consumption rate $u_h$ in kWh per hour (equivalently, kW). Let $r(h)$ be the regular price during that interval, and let $r_f$ be the fixed contract price. The contract amount $q$ is nonnegative and applies uniformly across all intervals.

For a given $q$, the contract charge over the full period is $r_f q T$, where $T=\sum_h \Delta t_h$. In interval $h$, any demand above $q$ costs $r(h)$ per kWh. Thus the total cost is

$$
C(q) = r_f q T + \sum_h \Delta t_h\,r(h)\max(u_h-q,0).
$$

For half-hourly readings, use $\Delta t_h=0.5$. If the input records energy $e_h$ in kWh per interval rather than an average consumption rate, use $u_h=e_h/\Delta t_h$ in this formula.

## Optimality condition

The cost is a convex, piecewise-linear function of $q$. Between observed consumption levels, its slope is

$$
C'(q)=r_fT-\sum_{h:u_h>q}\Delta t_h\,r(h).
$$

Increasing $q$ by a small amount increases the fixed contract charge, while reducing the regular-price charges for intervals whose consumption exceeds $q$. The minimum is reached where these two effects balance. Specifically, for $q>0$ an optimal amount satisfies

$$
\sum_{h:u_h>q}\Delta t_h\,r(h)
\;\leq\; r_fT \;\leq\;
\sum_{h:u_h\geq q}\Delta t_h\,r(h).
$$

The two sums can differ at a consumption level observed in the data; this is where the slope changes. At the boundary $q=0$, it is optimal when

$$
r_fT \geq \sum_{h:u_h>0}\Delta t_h\,r(h).
$$

## How to find $q$

Calculate the weight $\Delta t_h r(h)$ for each interval, then sort the intervals by $u_h$. Accumulate these weights from the highest consumption level downward. The optimal $q$ is a consumption level at which the accumulated weight crosses $r_fT$. If the accumulated weight equals $r_fT$ between two distinct consumption levels, every $q$ in that range has the same minimum cost. If the boundary condition holds, choose $q=0$.

This determines the optimal contract amount from the usage and rates without requiring a particular month of readings. The result depends on the full distribution of consumption across intervals and their regular prices, not just on average consumption.

## TypeScript example

Assume `usage`, `regularRates`, `intervalHours`, and `fixedRate` are defined globally. Each array entry describes the same interval across all three arrays.

```ts
const totalHours = intervalHours.reduce((sum, hours) => sum + hours, 0)
const targetWeight = fixedRate * totalHours

const intervals = usage.map((amount, index) => ({
    usage: amount,
    weight: regularRates[index] * intervalHours[index]
}))

intervals.sort((a, b) => b.usage - a.usage)

let optimalAmount = 0
let accumulatedWeight = 0

for (const interval of intervals) {
    accumulatedWeight += interval.weight
    if (accumulatedWeight >= targetWeight) {
        optimalAmount = interval.usage
        break
    }
}
```

Each interval contributes weight $\Delta t_h r(h)$, and `targetWeight` is $r_fT$. Sorting by usage from highest to lowest and accumulating the weights finds the contract amount where the optimality condition is met. If the threshold lands exactly between two usage levels, this code returns one endpoint of the range of optimal amounts.


