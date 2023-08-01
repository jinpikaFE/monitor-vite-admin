import { useEventEmitter } from 'ahooks'
import { useRef } from 'react'
import useEChart from '@/hooks/useEChart'

const PerformanceCharts: React.FC = () => {
  const domRef = useRef(null)
  const renderEcharts$ = useEventEmitter()

  useEChart(
    domRef,
    {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [150, 230, 224, 218, 135, 147, 260],
          type: 'line'
        }
      ]
    },
    renderEcharts$
  )

  return (
    <>
      <div ref={domRef} style={{ width: '100%', height: 360 }} />
    </>
  )
}

export default PerformanceCharts
