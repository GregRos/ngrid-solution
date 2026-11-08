import Papa from "papaparse"
import z from "zod/v4"
import { readingSchema, type Reading } from "../model/model.ts"

const csvUrl = new URL("../../data/consumption.csv", import.meta.url)
const csvReadingSchema = z
    .object({
        time_from: z.string(),
        time_to: z.string(),
        "Consumption kWh": z.string().trim().transform(Number)
    })
    .transform(row =>
        readingSchema.parse({
            start: row.time_from,
            end: row.time_to,
            usage: row["Consumption kWh"]
        })
    )

export function parseReadings(csv: string): Reading[] {
    const headerCounts = new Map<string, number>()
    const parsed = Papa.parse<Record<string, string>>(csv, {
        header: true,
        skipEmptyLines: "greedy",
        transformHeader: (header, index) => {
            const normalized = header.replace(/^\uFEFF/, "").trim() || `__empty_column_${index}`
            headerCounts.set(normalized, (headerCounts.get(normalized) ?? 0) + 1)
            return normalized
        }
    })
    if (parsed.errors.length) throw new Error(`Invalid CSV: ${parsed.errors[0].message}`)
    const readings = csvReadingSchema.array().parse(parsed.data)

    return readings
}

export async function fetchReadings(): Promise<Reading[]> {
    const response = await fetch(csvUrl)
    return parseReadings(await response.text())
}
