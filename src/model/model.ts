import dayjs, { type Dayjs } from "dayjs"
import z from "zod/v4"
import "./dates.ts"

const tariffDateSchema = z
    .string()
    .trim()
    .min(1)
    .transform(value => {
        const format = value.split(" ")[1]?.length === 4 ? "DD/MM/YYYY H:mm" : "DD/MM/YYYY HH:mm"
        return dayjs.utc(value, format, true)
    })

export const readingSchema = z.object({
    start: tariffDateSchema,
    end: tariffDateSchema,
    usage: z.number().nonnegative()
})

export type Reading = z.infer<typeof readingSchema>

export interface Rates {
    standard: number
    peak: number
    peakStart: number
    peakEnd: number
    fixed: number
}

export interface CostPoint {
    without: number
    total: number
}

export interface UsagePoint {
    energy: number
    capacity: number
}

export interface Stats {
    costs: CostPoint[]
    usage: UsagePoint[]
    hours: number
    energy: number
    coveredEnergy: number
    without: number
    metered: number
    fixed: number
    total: number
}

export function intervalHours(reading: Reading): number {
    return reading.end.diff(reading.start, "millisecond") / (60 * 60 * 1000)
}

export function toHourlyReadings(readings: Reading[]): Reading[] {
    if (readings.length % 2 !== 0)
        throw new Error("Readings must contain pairs of half-hour intervals")
    const hourly: Reading[] = []
    for (let index = 0; index < readings.length; index += 2) {
        const first = readings[index]
        const second = readings[index + 1]
        hourly.push({
            start: first.start,
            end: second.end,
            usage: first.usage + second.usage
        })
    }
    return hourly
}

export type { Dayjs }
