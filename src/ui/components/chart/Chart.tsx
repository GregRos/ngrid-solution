import * as echarts from "echarts"
import { useEffect, useRef } from "react"
import "./Chart.scss"

interface ChartProps {
    option: echarts.EChartsOption
    label: string
}

export function Chart({ option, label }: ChartProps) {
    const element = useRef<HTMLDivElement>(null)
    const chart = useRef<echarts.ECharts | null>(null)

    useEffect(() => {
        if (!element.current) return
        const instance = echarts.init(element.current)
        chart.current = instance
        const observer = new ResizeObserver(() => instance.resize())
        observer.observe(element.current)
        return () => {
            observer.disconnect()
            instance.dispose()
            chart.current = null
        }
    }, [])

    useEffect(() => {
        chart.current?.setOption(option)
    }, [option])

    return <div ref={element} className="chart" role="img" aria-label={label} />
}
