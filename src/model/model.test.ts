import assert from "node:assert/strict"
import dayjs from "dayjs"
import { readFileSync } from "node:fs"
import test from "node:test"
import { parseReadings } from "../api/readings.ts"
import { intervalHours, toHourlyReadings } from "./model.ts"
import { computeStats, findOptimalContract } from "../compute/index.ts"
import type { Rates } from "./model.ts"

const rates: Rates = { standard: 1, peak: 2, peakStart: 17, peakEnd: 20, fixed: 0.5 }
const csv = `time_from,time_to,Consumption kWh,,
01/01/2025 16:00,01/01/2025 16:30,1,,
01/01/2025 16:30,01/01/2025 17:00,2,,
01/01/2025 17:00,01/01/2025 17:30,3,,
01/01/2025 17:30,01/01/2025 18:00,2,,
,,,,
`

const getHourlyReadings = () => toHourlyReadings(parseReadings(csv))
const getStats = (contract: number, currentRates = rates) =>
    computeStats(getHourlyReadings(), currentRates, contract)

test("consolidates half-hour readings before applying hourly rates and contracts", () => {
    const raw = parseReadings(csv)
    assert.ok(dayjs.isDayjs(raw[0].start))
    assert.ok(dayjs.isDayjs(raw[0].end))
    assert.equal(raw[0].start.format("DD/MM/YYYY HH:mm"), "01/01/2025 16:00")
    assert.equal(raw[0].end.format("DD/MM/YYYY HH:mm"), "01/01/2025 16:30")
    assert.equal(intervalHours(raw[0]), 0.5)
    assert.ok(!("energy" in raw[0]))
    const readings = toHourlyReadings(raw)
    assert.deepEqual(
        readings.map(reading => reading.usage),
        [3, 5]
    )
    assert.deepEqual(
        readings.map(reading => intervalHours(reading)),
        [1, 1]
    )
    assert.deepEqual(
        readings.map(reading => reading.start.format("HH:mm")),
        ["16:00", "17:00"]
    )
    assert.deepEqual(
        raw.map(reading => reading.usage),
        [1, 2, 3, 2]
    )
    assert.equal(findOptimalContract(readings, rates), 5)
    const result = getStats(3)
    assert.equal(result.hours, 2)
    assert.equal(result.energy, 8)
    assert.equal(result.coveredEnergy, 6)
    assert.equal(result.without, 13)
    assert.equal(result.metered, 4)
    assert.equal(result.fixed, 3)
    assert.equal(result.total, 7)
})

test("optimal contract minimizes cost across observed levels and zero", () => {
    const readings = getHourlyReadings()
    for (const fixed of [0, 0.5, 1, 2, 10]) {
        const currentRates = { ...rates, fixed }
        const optimal = findOptimalContract(readings, currentRates)
        const costs = [0, ...readings.map(reading => reading.usage / intervalHours(reading))].map(
            q => computeStats(readings, currentRates, q).total
        )
        assert.ok(computeStats(readings, currentRates, optimal).total <= Math.min(...costs) + 1e-10)
    }
})

test("calculated cumulative costs start at zero and end at the displayed totals", () => {
    const result = getStats(3)
    assert.deepEqual(result.costs, [
        { without: 0, fixed: 0, metered: 0, total: 0 },
        { without: 3, fixed: 1.5, metered: 0, total: 1.5 },
        { without: 13, fixed: 3, metered: 4, total: 7 }
    ])
    assert.equal(result.costs.at(-1)?.without, result.without)
    assert.equal(result.costs.at(-1)?.total, result.total)
    const noContract = getStats(0)
    for (const point of noContract.costs) {
        assert.equal(point.without, point.total)
    }
})

test("calculated cumulative usage and contract capacity track energy and elapsed hours", () => {
    const result = getStats(3)
    assert.deepEqual(result.usage, [
        { energy: 0, capacity: 0 },
        { energy: 3, capacity: 3 },
        { energy: 8, capacity: 6 }
    ])
    assert.equal(result.usage.at(-1)?.energy, result.energy)
    assert.equal(result.usage.at(-1)?.capacity, 3 * result.hours)
    assert.ok(getStats(0).usage.every(point => point.capacity === 0))
})

test("rejects malformed or discontinuous readings", () => {
    assert.throws(
        () => parseReadings(csv.replace("17:30,01/01/2025 18:00", "18:30,01/01/2025 19:00")),
        /Missing or out-of-order/
    )
    assert.throws(
        () => parseReadings(csv.replace("17:00,01/01/2025 17:30,3", "17:00,01/01/2025 17:30,")),
        /Consumption kWh/
    )
    assert.throws(
        () => parseReadings(csv.replace("01/01/2025 16:00", "32/01/2025 16:00")),
        /Invalid timestamp/
    )
})

test("parses quoted CSV fields and reports malformed quoting", () => {
    const quoted =
        '\uFEFF"time_from","time_to","Consumption kWh","note"\r\n' +
        '"01/01/2025 0:00","01/01/2025 0:30","2.5","meter, north"\r\n' +
        '"01/01/2025 0:30","01/01/2025 1:00","3","meter ""A"""\r\n'
    assert.deepEqual(
        parseReadings(quoted).map(reading => reading.usage),
        [2.5, 3]
    )
    assert.throws(
        () => parseReadings('time_from,time_to,Consumption kWh\n"01/01/2025 0:00'),
        /Invalid CSV/
    )
})

test("maps readings by header name regardless of column order", () => {
    const reordered =
        'note, Consumption kWh ,time_to,time_from\n"meter, north",2.5,01/01/2025 0:30,01/01/2025 0:00\n'
    const readings = parseReadings(reordered)
    assert.equal(readings[0].usage, 2.5)
    assert.equal(readings[0].start.format("DD/MM/YYYY HH:mm"), "01/01/2025 00:00")
    assert.throws(() => parseReadings("time_from,time_to\n"), /must contain/)
    assert.throws(
        () => parseReadings("time_from,time_to,time_from,Consumption kWh\n"),
        /duplicate required columns/
    )
})

test("validates consumption values and interval lengths", () => {
    for (const value of ["", "NaN", "Infinity", "-1", "   "]) {
        assert.throws(
            () => parseReadings(csv.replace("17:30,3", `17:30,${value}`)),
            /Consumption kWh/
        )
    }
    assert.throws(
        () => parseReadings(csv.replace("17:00,01/01/2025 17:30,3", "17:00,01/01/2025 17:45,3")),
        /half-hour consumption/
    )
    assert.throws(
        () => parseReadings("time_from,time_to,Consumption kWh\n"),
        /no consumption readings/
    )
})

test("tariff dates are strict and independent of local timezone or DST", () => {
    const read = (start: string, end: string) =>
        parseReadings(`time_from,time_to,Consumption kWh\n${start},${end},1\n`)[0]
    const reading = read("30/03/2025 1:30", "30/03/2025 2:00")
    assert.equal(reading.end.diff(reading.start, "millisecond"), 1_800_000)
    assert.equal(reading.end.format("D MMM, HH:mm"), "30 Mar, 02:00")
    for (const invalid of [
        "29/02/2025 12:00",
        "01/13/2025 12:00",
        "01/01/2025 24:00",
        "1/01/2025 0:00",
        "01/01/2025 0:0"
    ]) {
        assert.throws(() => read(invalid, "01/01/2025 1:00"), /Invalid timestamp/)
    }
    assert.equal(read("01/01/2025 0:30", "01/01/2025 1:00").start.format("HH:mm"), "00:30")
    assert.equal(read("01/01/2025 00:30", "01/01/2025 01:00").start.format("HH:mm"), "00:30")
    assert.equal(reading.start.hour(), 1)
    assert.equal(
        read("29/02/2024 0:00", "29/02/2024 0:30").start.format("D MMM, HH:mm"),
        "29 Feb, 00:00"
    )
})

test("provided data covers a continuous month and has a true minimum", () => {
    const readings = parseReadings(
        readFileSync(new URL("../../data/consumption.csv", import.meta.url), "utf8")
    )
    assert.equal(readings.length, 1488)
    const hourly = toHourlyReadings(readings)
    assert.equal(hourly.length, 744)
    assert.ok(hourly.every(reading => intervalHours(reading) === 1))
    assert.ok(
        Math.abs(
            hourly.reduce((sum, reading) => sum + reading.usage, 0) -
                readings.reduce((sum, reading) => sum + reading.usage, 0)
        ) < 1e-8
    )
    const optimal = findOptimalContract(hourly, rates)
    const best = computeStats(hourly, rates, optimal).total
    for (const q of [0, optimal * 0.5, optimal, optimal * 1.5]) {
        assert.ok(computeStats(hourly, rates, q).total >= best - 1e-7)
    }
})
