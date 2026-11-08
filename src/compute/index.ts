import { intervalHours, type Rates, type Reading, type Stats } from "../model/model.ts"

interface OptimizationReading {
    usage: number
    hours: number
    rate: number
}

function toOptimizationReadings(readings: Reading[], rates: Rates): OptimizationReading[] {
    return readings.map(reading => ({
        usage: reading.usage / intervalHours(reading),
        hours: intervalHours(reading),
        rate:
            reading.start.hour() >= rates.peakStart && reading.start.hour() < rates.peakEnd
                ? rates.peak
                : rates.standard
    }))
}

export function findOptimalContract(readings: Reading[], rates: Rates): number {
    const optimizedReadings = toOptimizationReadings(readings, rates)
    const target = rates.fixed * optimizedReadings.reduce((sum, reading) => sum + reading.hours, 0)
    const sorted = optimizedReadings
        .map(reading => ({
            usage: reading.usage,
            weight: reading.rate * reading.hours
        }))
        .sort((a, b) => b.usage - a.usage)
    let weight = 0
    for (const interval of sorted) {
        weight += interval.weight
        if (weight >= target) return interval.usage
    }
    return 0
}

export function computeStats(readings: Reading[], rates: Rates, contract: number): Stats {
    const optimizedReadings = toOptimizationReadings(readings, rates)
    let hours = 0
    let energy = 0
    let coveredEnergy = 0
    let without = 0
    let metered = 0
    const costs = [{ without: 0, total: 0 }]
    const usage = [{ energy: 0, capacity: 0 }]
    for (const reading of optimizedReadings) {
        const intervalEnergy = reading.usage * reading.hours
        hours += reading.hours
        energy += intervalEnergy
        coveredEnergy += Math.min(intervalEnergy, contract * reading.hours)
        without += intervalEnergy * reading.rate
        metered += Math.max(reading.usage - contract, 0) * reading.rate * reading.hours
        const fixed = rates.fixed * contract * hours
        costs.push({ without, total: fixed + metered })
        usage.push({ energy, capacity: contract * hours })
    }
    const fixed = rates.fixed * contract * hours
    return {
        costs,
        usage,
        hours,
        energy,
        coveredEnergy,
        without,
        metered,
        fixed,
        total: fixed + metered
    }
}
