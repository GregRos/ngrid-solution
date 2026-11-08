import assert from "node:assert/strict"
import test from "node:test"
import { formatNumber, hours, kWh, kW, money } from "./format.ts"

test("formats numbers with at most one decimal place", () => {
    assert.equal(formatNumber(1234.567), "1,234.6")
    assert.equal(formatNumber(42.04), "42")
    assert.equal(formatNumber(0.5), "0.5")
    assert.equal(formatNumber(-1.26), "-1.3")
})

test("formats each unit with the appropriate suffix", () => {
    assert.equal(hours(1.25), "1.3 hrs")
    assert.equal(kWh(1234.56), "1,234.6 kWh")
    assert.equal(kW(42), "42 kW")
    assert.equal(money(1.25), "₪1.3")
})
